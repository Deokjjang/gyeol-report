import 'server-only';
import { generateV4ShadowReport, type V4ShadowClock } from '../runtimeShadow';
import { buildV4CompatibilityProduct, type CompatibilityProduct } from '../compatibilityProductAdapter';
import { buildRelationshipProfiles, projectRelationshipView, type RelationshipView } from '../relationshipProductView';
import { validateCompatibilityRelease } from '../compatibilityReleaseValidator';
import { projectV4Composition, validateV4Publication, v4Digest, type V4RuntimeEvidence } from '../runtimeProjection';
import { createProductPreviewSnapshot } from '../../report-generation/productPreviewSnapshot';
import { storedBook } from '../../book/storedReport';
import { assertOfflineIntegration } from '../../report-knowledge/knowledge-integration-foundation/full-product-integration/readerCatalog';
import { createPublicationAncestryInspector, inspectPublicationAncestry, publicationView } from './ancestry';
import type { SajuCalcResult } from '../../saju/types';

export const SAFETY_EDITION = 'compatibility-publication-safety-01-v1' as const;
type Views = { personA: RelationshipView; personB: RelationshipView };
export type PublicationSafetySession = Awaited<ReturnType<typeof prepareOfflinePublication>>;
const proofs = new WeakMap<object, { hash: string; originalHash: string }>();
const unique = (values: string[]) => [...new Set(values)].sort();

/** Existing Writer validation plus actual full ancestry; not a new research
 * approval, semantic equivalence oracle, legal authority or access grant. */
export function inspectCompatibilitySafety(result: CompatibilityProduct, views: Views) {
  const registry = result.integration.publicationSafetyRegistry;
  if (!registry) return { ok: false, errors: ['AUTHENTIC_SAFETY_REGISTRY_REQUIRED'], ancestry: [] };
  const inspectors = { personA: createPublicationAncestryInspector(views.personA), personB: createPublicationAncestryInspector(views.personB) };
  const d = result.integration.readerEdition, errors = [...validateCompatibilityRelease(d, result.evidence, views, registry).hardErrors];
  const canonicalSources: { source: string; owner: string; id: string; sourceHash: string; sourceRefs: readonly string[]; lineage: readonly string[] }[] = [];
  // Legacy material-packet Fusion IDs have a different namespace from the
  // integrated profiles. Resolve their actual structured MBTI parent rather
  // than silently treating an unknown Fusion ID as a root.
  const displayedSources = new Set(d.chapters.flatMap(c => c.paragraphs.flatMap(p => p.sentences.map(s => s.provenance.sourceRegistryKey))));
  for (const source of Object.values(registry).filter(s => displayedSources.has(s.id))) {
    for (const slot of ['personA', 'personB'] as const) {
      if (source.slot && source.slot !== slot) continue;
      const person = result.evidence.persons[slot];
      for (const feature of source.proof.features) {
        const material = person.materials.selected.find(m => m.feature === feature);
        if (material) canonicalSources.push({ source: source.id, owner: slot, id: feature, sourceHash: v4Digest(material), sourceRefs: material.sourceRefs, lineage: material.lineage });
      }
      for (const id of source.fusions) {
        const f = person.materials.fusions.find(f => f.ruleId === id);
        if (!f) continue;
        const parent = `mbti:${f.mbtiEvidence.type}:traits:${f.mbtiEvidence.area}:${f.mbtiEvidence.traitId}:plainKo`;
        errors.push(...inspectors[slot]([parent]).errors);
        canonicalSources.push({ source: source.id, owner: slot, id, sourceHash: v4Digest(f), sourceRefs: f.mbtiEvidence.sourceRefs, lineage: [parent, ...f.myeongliEvidence.flatMap(e => e.evidence.lineage)] });
      }
    }
    for (const id of source.fusions) {
      const declared = (['personA', 'personB'] as const).some(slot => (!source.slot || source.slot === slot) && (result.evidence.persons[slot].materials.fusions.some(f => f.ruleId === id)
        || [...views[slot].profiles.fusion.reinforce, ...views[slot].profiles.fusion.complements, ...views[slot].profiles.fusion.tensions].some(f => f.id === id)));
      if (!declared) errors.push('FULL_FUSION_ANCESTRY_MISSING:' + id);
    }
  }
  if (d.chapters.length !== 9 || d.chapters.some(c => c.paragraphs.length !== 4 || c.paragraphs.some(p => p.sentences.length !== 4))) errors.push('READER_9_36_144_REQUIRED');
  const ancestry: { address: string; owner: string; direction: string | null; source: string; roots: string[]; ancestors: ReturnType<typeof inspectPublicationAncestry>['ancestors']; errors: string[] }[] = [];
  for (const c of d.chapters) for (const p of c.paragraphs) for (const s of p.sentences) {
    const source = registry[s.provenance.sourceRegistryKey]; if (!source) continue;
    for (const slot of ['personA', 'personB'] as const) {
      const roots = source.slot === slot ? [...source.individual, ...source.nodes, ...source.fusions, ...(source.candidateId ? [source.candidateId] : [])]
        : source.slot ? [] : source.proof.sourceRefs.filter(id => id.startsWith(slot + ':')).map(id => id.slice(slot.length + 1));
      if (!roots.length) continue;
      const check = inspectors[slot](roots); errors.push(...check.errors);
      ancestry.push({ address: p.id + '.' + s.sentenceRole, owner: slot, direction: s.directionId ?? null, source: source.id, ...check });
    }
  }
  const byId = new Map(d.chapters.flatMap(c => c.paragraphs.map(p => [p.id, p] as const)));
  // Repair references a displayed actual personal risk, and Recall only the
  // displayed same-edition roots. No invented Reader/Scheduler mapping.
  for (const [repair, problem] of [['CH08.P2', 'CH02.P4'], ['CH08.P3', 'CH03.P4']] as const) {
    const r = byId.get(repair), p = byId.get(problem);
    if (!r || !p || !r.sentences.some(s => p.sentences.some(x => x.sourceCandidateId && x.sourceCandidateId === s.sourceCandidateId))) errors.push('ACTUAL_REPAIR_PROBLEM_REQUIRED:' + repair);
  }
  for (const p of d.chapters[8]?.paragraphs ?? []) for (const s of p.sentences.filter(s => s.individualEvidenceIds.length || s.mbtiSourceNodeIds.length)) {
    const roots = [...s.individualEvidenceIds, ...s.mbtiSourceNodeIds];
    if (!d.chapters.slice(0, 8).flatMap(c => c.paragraphs.flatMap(p => p.sentences)).some(prior => roots.every(id => [...prior.individualEvidenceIds, ...prior.mbtiSourceNodeIds].includes(id)))) errors.push('ACTUALLY_DISPLAYED_RECALL_REQUIRED:' + p.id);
  }
  const text = d.chapters.flatMap(c => c.paragraphs.map(p => p.text)).join('\n');
  if (result.evidence.category === 'parentChild' && /부모가 안전과 최종 결정|안전의 최종 책임은 부모/.test(text)) errors.push('UNVERIFIED_PARENT_AUTHORITY');
  if (result.integration.publishedEdition !== d.version || d.version !== SAFETY_EDITION) errors.push('UNVERIFIED_LEGACY_FALLBACK');
  if (result.integration.readerEditorial.some(i => i.severity !== 'Minor')) errors.push('READER_EDITORIAL_NOT_READY');
  return { ok: !errors.length, errors: unique(errors), ancestry, canonicalSources };
}


export function observePublicationViews(evidence: V4RuntimeEvidence) {
  assertOfflineIntegration();
  if (evidence.input.kind !== 'compatibility') return null;
  const input = evidence.input;
  const profiles = (['personA', 'personB'] as const).map(slot => buildRelationshipProfiles({ calculation: evidence.calculations[slot], name: input[slot].name, mbti: input[slot].mbtiType,
    context: { jobStatus: '', detailJob: '', relationshipStatus: input.relationshipType === 'love' ? 'dating' : input.relationshipType === 'marriage' ? 'married' : '' } }));
  const [a, b] = profiles;
  if (!a.ok || !b.ok) return null;
  const romantic = ['love', 'marriage'].includes(input.relationshipType);
  const original = { personA: projectRelationshipView(a.profiles, romantic), personB: projectRelationshipView(b.profiles, romantic) };
  return { original, eligible: { personA: publicationView(original.personA), personB: publicationView(original.personB) } };
}

/** No route, Worker or customer payload imports/selects this function. Existing
 * generateV4ShadowReport defaults and paid fulfillment are untouched. */
export async function prepareOfflinePublication(payload: unknown, clock: V4ShadowClock) {
  assertOfflineIntegration();
  const original = await generateV4ShadowReport(payload, clock);
  if (!original.ok) return { ok: false as const, errors: [original.error.message], customerAuthorized: false as const };
  const originalEvidence = original.evidencePacket as V4RuntimeEvidence, originalHash = v4Digest(originalEvidence);
  let evidence = originalEvidence;
  let safety: ReturnType<typeof inspectCompatibilitySafety> | null = null;
  if (originalEvidence.input.kind === 'compatibility') {
    const observed = observePublicationViews(originalEvidence);
    if (!observed) return { ok: false as const, errors: ['PUBLICATION_PROFILE_INVALID'], customerAuthorized: false as const };
    const views = observed.eligible;
    const result = buildV4CompatibilityProduct(payload, originalEvidence.calculations as { personA: SajuCalcResult; personB: SajuCalcResult }, { publicationSafety: true, views });
    if (!result.ok) return { ok: false as const, errors: result.errors, customerAuthorized: false as const };
    safety = inspectCompatibilitySafety(result, views);
    const { contentDigest: _digest, ...body } = originalEvidence; void _digest;
    const changed = JSON.parse(JSON.stringify({ ...body, composition: { product: 'saju_mbti_compatibility', result } })) as Omit<V4RuntimeEvidence, 'contentDigest'>;
    evidence = { ...changed, contentDigest: v4Digest(changed) };
  }
  const draft = projectV4Composition(evidence.composition), publisher = validateV4Publication(evidence.productType, draft, evidence);
  const errors = unique([...publisher.errors, ...(safety?.errors ?? [])]);
  const snapshot = createProductPreviewSnapshot({ reportId: 'offline-publication-safety', createdAtIso: evidence.generatedAt, productKey: evidence.productType,
    productSlug: evidence.input.productSlug, draft, evidencePacket: evidence });
  const book = snapshot.ok ? storedBook(snapshot.value) : null;
  if (!snapshot.ok || !book) errors.push('SNAPSHOT_READER_ROUNDTRIP_FAILED');
  if (v4Digest(originalEvidence) !== originalHash || v4Digest(evidence.calculations) !== v4Digest(originalEvidence.calculations)) errors.push('ORIGINAL_CALCULATION_OR_SNAPSHOT_CHANGED');
  const session = { ok: true as const, original, result: { validGeneratedContent: publisher.ok && !(safety?.errors.some(e => e !== 'READER_EDITORIAL_NOT_READY' && e !== 'UNVERIFIED_LEGACY_FALLBACK') ?? false), safeToPublish: !errors.length,
    approvedForCustomerUse: false as const, humanQualityApproved: false as const, customerAuthorized: false as const, actualCustomerClaims: 0 as const,
    actualBookAllocations: 0 as const, errors: unique(errors), originalHash, evidence, draft, snapshot: !errors.length && snapshot.ok ? snapshot.value : null,
    bookHash: !errors.length && book ? v4Digest(book.data) : null, safety,
    legacyFallback: { used: !!safety && evidence.composition.product === 'saju_mbti_compatibility' && 'integration' in evidence.composition.result && evidence.composition.result.integration.publishedEdition !== SAFETY_EDITION,
      permittedWithoutIndependentSafety: false as const, legacyProofStatus: 'FULL_LEGACY_ANCESTRY_NOT_PROVEN' as const },
    unenteredFacts: { age: 'UNKNOWN', guardianship: 'UNKNOWN', consent: 'UNKNOWN', supportNeed: 'UNKNOWN', legalAuthority: 'UNKNOWN' } } };
  proofs.set(session, { hash: v4Digest(session.result), originalHash });
  return session;
}

/** Private generation receipt, not the public contentDigest, authenticates this
 * offline review. Reopen never regenerates or grants owner/90-day/share rights. */
export function validateOfflinePublication(session: PublicationSafetySession, candidate: unknown = session.ok ? session.result : null) {
  assertOfflineIntegration(); const proof = proofs.get(session);
  if (!session.ok || !proof || v4Digest(candidate) !== proof.hash) return { ok: false, errors: ['AUTHENTIC_UNCHANGED_PUBLICATION_REQUIRED'] };
  return { ok: session.result.safeToPublish, errors: session.result.errors };
}
export function reopenOfflinePublication(session: PublicationSafetySession, serialized: string) {
  assertOfflineIntegration();
  try { const value: unknown = JSON.parse(serialized); return validateOfflinePublication(session, value).ok ? value : null; }
  catch { return null; }
}
