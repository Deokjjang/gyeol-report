import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { prepareOfflinePublication, observePublicationViews, validateOfflinePublication, reopenOfflinePublication, SAFETY_EDITION, type PublicationSafetySession } from '@/lib/interpretation-v4/publication-safety/engine';
import { publicationView, inspectPublicationAncestry } from '@/lib/interpretation-v4/publication-safety/ancestry';
import { projectV4Composition, validateV4Publication, v4Digest, type V4RuntimeEvidence } from '@/lib/interpretation-v4/runtimeProjection';
import { storedBook } from '@/lib/book/storedReport';
import { createProductPreviewSnapshot, type ProductPreviewSnapshotDraft } from '@/lib/report-generation/productPreviewSnapshot';
vi.mock('server-only', () => ({}));
const clock = { evaluatedAt: '2026-10-12T12:00:00+09:00' };
function payload(category: string, letter: string) {
  const rows = JSON.parse(readFileSync(`docs/validation/v4-compatibility-${category}-product-knowledge-01/input-cases.json`, 'utf8')) as { letter: string; variants: unknown[] }[];
  return rows.find(c => c.letter === letter)!.variants[0];
}
const sessions = new Map<string, PublicationSafetySession>();
let originalView: NonNullable<ReturnType<typeof observePublicationViews>>['original']['personA'];
beforeAll(async () => {
  for (const [key, category, letter] of [['love', 'love', 'O'], ['parent-child', 'parent-child', 'V'], ['parent-child-minor', 'parent-child', 'A'], ['business-partner', 'business-partner', 'AM']]) sessions.set(key, await prepareOfflinePublication(payload(category, letter), clock));
  originalView = observePublicationViews(ready('business-partner').original.evidencePacket as V4RuntimeEvidence)!.original.personA;
}, 300000);
function ready(category = 'parent-child') {
  const s = sessions.get(category)!;
  if (!s.ok) throw Error('REAL_GENERATION_REQUIRED:' + s.errors.join('|'));
  return s;
}
describe('offline publication safety — real Writer/Publisher/Reader', () => {
  it('pins the reviewed source-revision overlay without rewriting original research receipts', () => {
    const bytes = readFileSync('tests/fixtures/publication-safety-01/source-revision-contract.json');
    expect(createHash('sha256').update(bytes).digest('hex')).toBe('afdcb18f96f9a6252c96b23c3a050d71473b6c27385affa97752d790b1f30580');
    expect(JSON.parse(bytes.toString())).toMatchObject({ customerRuntimeActivated: false, originalResearchHashesRewritten: false });
  });
  it.each(['love', 'parent-child'])('validates actual corrected edition and stored JSON: %s', category => {
    const s = ready(category), r = s.result;
    expect(r.safeToPublish, JSON.stringify(r.errors)).toBe(true);
    expect(validateOfflinePublication(s)).toEqual({ ok: true, errors: [] });
    expect(reopenOfflinePublication(s, JSON.stringify(r))).toEqual(r);
    expect(validateV4Publication(r.evidence.productType, r.draft, r.evidence).ok).toBe(true);
    expect(r.evidence.composition.product).toBe('saju_mbti_compatibility');
    if (r.evidence.composition.product === 'saju_mbti_compatibility' && 'integration' in r.evidence.composition.result) {
      const i = r.evidence.composition.result.integration;
      expect(i.publishedEdition).toBe(SAFETY_EDITION);
      expect(i.readerEdition.chapters).toHaveLength(9);
      expect(i.readerEdition.chapters.flatMap(c => c.paragraphs)).toHaveLength(36);
      expect(i.readerEdition.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences))).toHaveLength(144);
      expect(i.readerEditorial).toEqual([]);
    }
  });
  it.each(['love', 'parent-child', 'business-partner'])('preserves old packet, calculations, default Writer and old Book: %s', category => {
    const s = ready(category), e = s.original.evidencePacket as V4RuntimeEvidence;
    expect(v4Digest(e)).toBe(s.result.originalHash);
    expect(s.result.evidence.calculations).toEqual(e.calculations);
    const created = createProductPreviewSnapshot({ reportId: 'original', createdAtIso: e.generatedAt, productKey: e.productType, productSlug: e.input.productSlug, draft: projectV4Composition(e.composition), evidencePacket: e });
    expect(created.ok).toBe(true);
    if (created.ok) {
      const before = v4Digest(created.value), original = storedBook(created.value);
      expect(original).not.toBeNull(); expect(storedBook(JSON.parse(JSON.stringify(created.value)))).toEqual(original);
      expect(v4Digest(created.value)).toBe(before);
    }
    if (e.composition.product === 'saju_mbti_compatibility' && s.result.evidence.composition.product === 'saju_mbti_compatibility') {
      expect(s.result.evidence.composition.result.evidence.directions).toEqual(e.composition.result.evidence.directions);
      expect(s.result.evidence.composition.result.compatibilityIndex).toEqual(e.composition.result.compatibilityIndex);
    }
  });
  it('gives V4 an explicit factory draft type without a legacy cast', () => {
    const draft: ProductPreviewSnapshotDraft = ready().result.draft;
    expect(draft.productVersion).toBe('v4');
  });
  it('reproduces original CHILDREN source and excludes the entire derived side', () => {
    const view = originalView, id = 'mbti:INTP:traits:child:socially_detached_child:plainKo';
    expect(inspectPublicationAncestry(view, [id]).errors).toContain('PROHIBITED_ANCESTOR_DOMAIN:' + id);
    const tainted = view.sides.filter(s => s.evidenceIds.includes(id)); expect(tainted.length).toBeGreaterThan(0);
    const safe = publicationView(view); expect(safe.sides.some(s => s.evidenceIds.includes(id))).toBe(false);
    expect(safe.profiles).toBe(view.profiles); // underlying MBTI/Fusion calculations unchanged
    expect(ready('business-partner').result.safety!.ancestry.every(r => r.ancestors.every(a => a.domain !== 'CHILDREN'))).toBe(true);
  });
  it('withholds the whole Book when full Domain ancestry leaves mandatory Reader paragraphs unsupported', () => {
    const s = ready('business-partner');
    expect(s.result.safeToPublish).toBe(false);
    expect(s.result.errors).toContain('READER_9_36_144_REQUIRED');
    expect(s.result.errors).toContain('UNVERIFIED_LEGACY_FALLBACK');
    expect(s.result.snapshot).toBeNull(); expect(s.result.bookHash).toBeNull();
    expect(reopenOfflinePublication(s, JSON.stringify(s.result))).toBeNull();
  });
  it('does not accept an unresolvable ancestry root or replace its ID', () => {
    expect(inspectPublicationAncestry(originalView, ['missing-original-id']).errors).toEqual(['FULL_ANCESTRY_MISSING:missing-original-id']);
  });
  it('does not transfer a Thinking-domain source into the relationship publication scope', () => {
    const source = originalView.profiles.mbti.sourceNodes.find(n => n.sourceDomain === 'THINKING' && n.classification === 'SCORING_SEMANTIC');
    expect(source).toBeDefined();
    expect(inspectPublicationAncestry(originalView, [source!.id]).errors).toContain('UNAPPROVED_ANCESTOR_DOMAIN:' + source!.id);
  });
  it.each(['parent-child', 'parent-child-minor'])('adult and minor birth-date fixtures never license blanket authority: %s', category => {
    const r = ready(category).result;
    expect(Object.values(r.unenteredFacts)).toEqual(Array(5).fill('UNKNOWN'));
    const text = [r.draft.opening, ...r.draft.sections.map(s => s.paragraphs)].flat().join(' ');
    expect(text).not.toMatch(/부모가 안전과 최종 결정|안전의 최종 책임은 부모/);
    expect(text).toContain('조언을 건네는 일과 자녀의 결정을 대신하는 일을 구분');
    // Neither fixture confirms guardianship, consent, support need or legal rights.
  });
  it.each(['guardianship', 'consent', 'age', 'supportNeed', 'legalAuthority'])('rejects UNKNOWN promotion: %s', key => {
    const s = ready(), bad = structuredClone(s.result);
    Object.assign(bad.unenteredFacts, { [key]: 'CONFIRMED' });
    expect(validateOfflinePublication(s, bad).ok).toBe(false);
  });
  it.each(['INDEPENDENT', 'NEEDS_SUPPORT'])('does not turn a hypothetical support condition into an entered fact: %s', supportNeed => {
    const s = ready('parent-child'), bad = structuredClone(s.result);
    Object.assign(bad.unenteredFacts, { supportNeed });
    expect(validateOfflinePublication(s, bad).ok).toBe(false);
  });
  it.each(['approvedForCustomerUse', 'humanQualityApproved', 'actualBookAllocations', 'actualCustomerClaims', 'originalHash', 'safeToPublish'])('does not grant authority or accept changed review fields: %s', key => {
    const s = ready(), bad = { ...s.result, [key]: key === 'safeToPublish' ? false : 'forged' };
    expect(validateOfflinePublication(s, bad).ok).toBe(false);
  });
  it('rejects a Legacy relabel despite a recomputed public digest', () => {
    const s = ready(), bad = structuredClone(s.result), e = bad.evidence;
    if (e.composition.product !== 'saju_mbti_compatibility' || !('integration' in e.composition.result)) throw Error('PAIR_REQUIRED');
    e.composition.result.integration.publishedEdition = 'compatibility-product-13d-7b-v1';
    const { contentDigest: _, ...body } = e; void _;
    Object.assign(e, { contentDigest: v4Digest(body) });
    expect(validateOfflinePublication(s, bad).ok).toBe(false);
  });
  it('rejects cloned receipts, modified Book text, wrong version and digest', () => {
    const s = ready(); expect(validateOfflinePublication({ ...s }).ok).toBe(false);
    for (const change of ['draft', 'snapshot', 'evidence'] as const) {
      const bad = { ...s.result, [change]: { forged: true } };
      expect(reopenOfflinePublication(s, JSON.stringify(bad))).toBeNull();
    }
  });
  it('does not authorize customer use even after all offline checks', () => {
    expect(ready().result).toMatchObject({ approvedForCustomerUse: false, humanQualityApproved: false, actualCustomerClaims: 0, actualBookAllocations: 0 });
  });
  it('rejects Vercel invocation before generating anything', async () => {
    vi.stubEnv('VERCEL', '1');
    try { await expect(prepareOfflinePublication(payload('love', 'O'), clock)).rejects.toThrow('FULL_PRODUCT_INTEGRATION_OFFLINE_ONLY'); }
    finally { vi.unstubAllEnvs(); }
  });
});
