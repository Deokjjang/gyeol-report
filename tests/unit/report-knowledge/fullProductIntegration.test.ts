import { beforeAll, describe, expect, it, vi } from 'vitest';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { ACTUAL_INVOKERS } from '../../../tools/global-specialist-integration-audit/invokers';
import { readGlobalArtifact } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/artifactReader';
import { digest } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/candidateEnvelope';
import type { EngineRegistration } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/types';
import type { ProductContract } from '@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/types';
import { prepareRehearsalRequest } from '@/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/planningRequest';
import { integrateProduct, validateIntegrationResult, reopenOfflineIntegration } from '@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/engine';
import { loadReaderCatalog } from '@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/readerCatalog';
import { adaptOfflineBook } from '@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/bookAdapter';
import { inspectStoredPublication, reopenStoredPublication } from '@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/storedPublication';
import type { IntegrationSession, IntegrationResult } from '@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/types';

vi.mock('server-only', () => ({}));
const root = resolve('.'), sessions = new Map<string, IntegrationSession>();
const entries = readGlobalArtifact(root + '/docs/validation/v4-global-specialist-integration-audit-01', 'global-engine-registry.json') as EngineRegistration[];
beforeAll(async () => {
  for (const e of entries) {
    const contract = (e.readerContract as { foundationProductContract: ProductContract[] }).foundationProductContract[0];
    const request = await prepareRehearsalRequest(root, { ...e, invoke: ACTUAL_INVOKERS[e.engineId] }, contract);
    sessions.set(e.engineId, integrateProduct(root, request));
  }
  const e = entries.find(e => e.engineId === 'compatibility-friendship')!;
  const request = await prepareRehearsalRequest(root, { ...e, invoke: ACTUAL_INVOKERS[e.engineId] }, sessions.get(e.engineId)!.input.plan.readerContract, true);
  sessions.set('friendship-display', integrateProduct(root, request));
}, 300000);

describe('offline full-product integration — original contracts remain authoritative', () => {
  for (const e of entries) {
    it('executes Planner, Editorial, native Reader and Book representation: ' + e.engineId, () => {
      const session = sessions.get(e.engineId)!, r = session.result;
      expect(validateIntegrationResult(session)).toEqual({ ok: true, errors: [] });
      expect(r.product).toBe(e.productKey); expect(r.relationship).toBe(e.relationshipCategory);
      expect(r.draft.sentences.length).toBeGreaterThan(0);
      expect(r.bridges.every(b => !b.customerBridgeVerified)).toBe(true);
      expect(r.book.placements.length).toBe(r.book.pages.length);
      for (const placement of r.book.placements) {
        const p = r.draft.paragraphs.find(p => p.questionId === placement.questionId)!;
        const page = r.book.pages.find(p => p.id === placement.pageId)!;
        expect(page.kind).toBe('narrative');
        if (page.kind === 'narrative') expect(page.paragraphs.map(p => p.text)).toEqual([p.text]);
        expect(placement.originalAddress).toEqual(p.address); expect(placement.ledgerHash).toBe(digest(p.sentences));
      }
    });
    it('reopens the exact partial test representation: ' + e.engineId, () => {
      const session = sessions.get(e.engineId)!;
      expect(reopenOfflineIntegration(session, JSON.stringify(session.result))).not.toBeNull();
    });
    if (e.relationshipCategory) it('preserves both actual native direction labels: ' + e.relationshipCategory, () => {
      const { input, result } = sessions.get(e.engineId)!;
      expect(input.plan.qualityDiagnostics.directionCounts.A_TO_B).toBeGreaterThan(0);
      expect(input.plan.qualityDiagnostics.directionCounts.B_TO_A).toBeGreaterThan(0);
      for (const s of result.draft.sentences) {
        const a = input.plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === s.questionId)!;
        expect(s.direction).toBe(a.direction); expect(s.owner).toBe(a.owner);
      }
    });
  }
  it('preserves all 2060 actual Reader questions without covering them by synthetic IDs', () => {
    const actual = [...sessions.entries()].filter(([id]) => id !== 'friendship-display').flatMap(([, s]) => s.result.coverage.filter(q => q.namespace === 'ORIGINAL_RESEARCH_READER'));
    expect(actual).toHaveLength(2060); expect(new Set(actual.map(q => q.questionId)).size).toBe(2060);
    expect(actual.every(q => !q.bookDisplayPossible && !q.plannerAssigned && !q.editorialGenerated)).toBe(true);
  });
  it('does not invent missing comprehensive/career paragraph addresses', () => {
    for (const e of ['comprehensive', 'career']) {
      const r = sessions.get(e)!.result; expect(r.book.pages).toHaveLength(0);
      expect(r.bridges.filter(b => b.paragraphId).every(b => b.reasons.includes('ORIGINAL_PARAGRAPH_ADDRESS_MISSING'))).toBe(true);
    }
  });
  it('retains separate 13/52/208, 9/36/144, fourteen-year and twelve-month contracts', () => {
    const c = loadReaderCatalog(root).contracts;
    expect(c.find(c => c.productKey === 'saju_mbti_full')).toMatchObject({ chapters: 13, paragraphs: 52, roles: 208 });
    for (const p of ['career_money_study', 'love_marriage_child', 'saju_mbti_compatibility']) expect(c.filter(c => c.productKey === p).every(c => c.chapters === 9 && c.paragraphs === 36 && c.roles === 144)).toBe(true);
    expect(c.find(c => c.productKey === 'major_fortune')?.periodSlots).toBe(14);
    expect(c.find(c => c.productKey === 'annual_fortune')?.periodSlots).toBe(12);
  });
  for (const [route, roles] of [['compatibility-parent-child', { A: 'parent', B: 'child' }], ['compatibility-manager-report', { A: 'manager', B: 'report' }]] as const) {
    it('retains fixed role declaration without creating entered authority: ' + route, () => {
      expect(sessions.get(route)!.input.request.relationshipContract).toMatchObject({ fixedRoles: roles, actualUnenteredFacts: 'UNKNOWN_UNLESS_EXPLICIT_REGISTERED_SYNTHETIC_CONTEXT' });
    });
  }
  it('retains actual generated display dependencies across the Book boundary', () => {
    const s = sessions.get('friendship-display')!;
    expect(s.result.draft.sentences.some(s => s.readerAddress.chapterId === 'CH08')).toBe(true);
    expect(s.result.draft.sentences.some(s => s.readerAddress.chapterId === 'CH09')).toBe(true);
    expect(s.result.draft.displayRecords.every(r => r.actuallyGeneratedAndValidated && !r.actualCustomerDisplay)).toBe(true);
    expect(validateIntegrationResult(s).ok).toBe(true);
  });
  for (const e of entries.filter(e => e.relationshipCategory)) it('rejects swapping the two existing directional values: ' + e.relationshipCategory, () => {
    const s = sessions.get(e.engineId)!, r = { ...s.result, draft: structuredClone(s.result.draft) };
    const assignment = s.input.plan.selectedCandidateReferences.find(a => a.direction)!;
    const other = s.input.plan.relationshipAssignments.find(a => a.direction && a.direction !== assignment.direction)!;
    expect(other).toBeDefined();
    r.plan = { ...s.result.plan, selectedCandidateReferences: s.result.plan.selectedCandidateReferences.map(a => a === assignment ? { ...a, direction: other.direction } : a) };
    expect(validateIntegrationResult(s, r).ok).toBe(false);
  });
  for (const route of ['compatibility-parent-child', 'compatibility-manager-report']) it('rejects exchanging existing fixed-role owners: ' + route, () => {
    const s = sessions.get(route)!, r = { ...s.result, draft: structuredClone(s.result.draft) };
    const sentence = r.draft.sentences[0], other = s.input.plan.relationshipAssignments.find(a => a.owner && a.owner !== sentence.owner)!;
    expect(other).toBeDefined(); sentence.owner = other.owner;
    expect(validateIntegrationResult(s, r).ok).toBe(false);
  });
  it('does not repair a problem whose actual generated introduction is removed', () => {
    const s = sessions.get('friendship-display')!, r = { ...s.result, draft: structuredClone(s.result.draft) };
    const intro = r.draft.paragraphs.find(p => p.address.chapterId === 'CH07')!;
    expect(intro).toBeDefined();
    r.draft.paragraphs = r.draft.paragraphs.filter(p => p.id !== intro.id);
    r.draft.sentences = r.draft.paragraphs.flatMap(p => p.sentences);
    r.draft.displayRecords = r.draft.displayRecords.filter(d => !intro.sentences.some(s => d.sentenceIds.includes(s.id)));
    expect(validateIntegrationResult(s, r).ok).toBe(false);
  });
  it('preserves MBTI/Fusion, roots, temporal data and source identity in every generated sentence', () => {
    for (const session of sessions.values()) for (const s of session.result.draft.sentences) {
      const a = session.input.plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === s.questionId)!;
      expect(s.source).toEqual(a.source); expect(s.evidenceIds).toEqual(a.actualEvidence);
      expect(s.originalSupportingInformation).toEqual(a.supportingInformation);
      expect(s.factRoots).toEqual(a.canonicalFactRoots); expect(s.ancestryRoots).toEqual(a.supportingAncestryRoots);
      expect(s.temporal).toEqual(a.temporalScope); expect(s.originalConditions).toEqual(a.conditionalRequirements);
    }
  });
  const mutations: [string, (r: IntegrationResult) => void][] = [
    ['cross-product question', r => { r.draft.paragraphs[0].questionId = 'other-product'; }],
    ['cross-category material', r => { r.draft.sentences[0].materialId = 'other-category'; }],
    ['A/B direction', r => { r.draft.sentences[0].direction = 'SWAPPED'; }],
    ['parent/child or manager/report owner', r => { r.draft.sentences[0].owner = 'SWAPPED'; }],
    ['different period', r => { r.book.temporalContractHash = 'other-period'; }],
    ['source hash', r => { r.draft.sentences[0].source.hash = 'forged'; }],
    ['evidence ID', r => { r.draft.sentences[0].evidenceIds = ['forged']; }],
    ['missing fact root', r => { r.draft.sentences[0].factRoots = []; }],
    ['claim meaning', r => { r.draft.sentences[0].meaningId = 'forged'; }],
    ['missing condition', r => { r.draft.sentences[0].conditionalScope.clause = ''; }],
    ['negation reversal', r => { r.draft.sentences[0].negationScope = 'REVERSED'; }],
    ['future event assertion', r => { r.draft.sentences[0].actualText = '내년에 반드시 성공합니다.'; }],
    ['fake Recall display', r => { r.draft.displayRecords = []; }],
    ['wrong Reader address', r => { r.bridges[0].address.paragraphId = 'P999'; }],
    ['omitted question', r => { r.coverage.pop(); }],
    ['changed Book text', r => { r.book.pages = []; r.book.placements = []; }],
    ['customer allocation', r => { Object.assign(r, { actualBookAllocations: 1 }); }],
    ['synthetic promotion', r => { Object.assign(r.book, { edition: 'v4', customerEdition: true }); }],
    ['Approval bypass', r => { Object.assign(r, { actualCustomerApproved: 1, customerReady: true }); }],
    ['false complete Book', r => { Object.assign(r, { wholeBookCompleted: true }); }],
    ['Publisher bypass', r => { Object.assign(r.book, { publisherValidation: 'PASS' }); }],
  ];
  for (const [name, mutate] of mutations) it('fails closed for ' + name, () => {
    const session = sessions.get('compatibility-friendship')!, changed = structuredClone(session.result);
    mutate(changed); expect(validateIntegrationResult(session, changed).ok).toBe(false);
    expect(reopenOfflineIntegration(session, JSON.stringify(changed))).toBeNull();
  });
  it('cannot authenticate a copied session or request', () => {
    const s = sessions.get('comprehensive')!;
    expect(validateIntegrationResult({ ...s }).ok).toBe(false);
    expect(() => integrateProduct(root, { ...s.input.request })).toThrow('AUTHENTIC_UNCHANGED');
  });
  it('rejects a copied native Reader placement proof at the Book adapter', () => {
    const s = sessions.get('compatibility-love')!;
    expect(() => adaptOfflineBook(loadReaderCatalog(root), s.input, s.result.draft, structuredClone(s.result.bridges))).toThrow('AUTHENTIC_UNCHANGED_READER_PLACEMENT');
  });
  it('retains offline protection and rejects Vercel entry', () => {
    vi.stubEnv('VERCEL', '1');
    try { expect(() => integrateProduct(root, sessions.get('comprehensive')!.input.request)).toThrow('OFFLINE_ONLY'); }
    finally { vi.unstubAllEnvs(); }
  });
  it('never makes a test representation a stored customer Edition', () => {
    expect(inspectStoredPublication(sessions.get('compatibility-love')!.result.book).ok).toBe(false);
    expect(reopenStoredPublication(JSON.stringify(sessions.get('compatibility-love')!.result.book)).ok).toBe(false);
  });
  it('retains all protected source contracts and test-only definitions', () => {
    const d = JSON.parse(readFileSync(root + '/tests/fixtures/korean-editorial-engine-01/synthetic-meaning-definitions.json', 'utf8'));
    expect(d.definitions).toHaveLength(30);
    expect(d.definitions.every((d: { existingResearchMeaning: boolean; actualCustomerAuthorization: boolean; automaticClaimAnchorMapping: boolean }) => !d.existingResearchMeaning && !d.actualCustomerAuthorization && !d.automaticClaimAnchorMapping)).toBe(true);
    for (const s of sessions.values()) expect(s.result).toMatchObject({ actualOperatorApproved: 0, actualCustomerApproved: 0, actualCustomerEligible: 0, actualCustomerClaims: 0, actualBookAllocations: 0, wholeBookCompleted: false, humanQualityApproved: false, customerReady: false });
  });
});
