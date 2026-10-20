import { beforeAll, describe, expect, it, vi } from 'vitest';
import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { ACTUAL_INVOKERS } from '../../../tools/global-specialist-integration-audit/invokers';
import { readGlobalArtifact } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/artifactReader';
import { digest } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/candidateEnvelope';
import { prepareRehearsalRequest } from '@/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/planningRequest';
import { planGlobalBook } from '@/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/engine';
import { compileEditorialHandoff } from '@/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/editorialHandoff';
import type { EngineRegistration } from '@/lib/report-knowledge/knowledge-integration-foundation/global-specialist-integration/types';
import type { ProductContract } from '@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/types';
import { createEditorialInput, definitionErrors } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/editorialInput';
import { constructClaim } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/claimEnvelope';
import { generateEditorialDraft } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/engine';
import { auditDraft } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/wholeDraftAudit';
import { validateMeaning, validateUnitMutation } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/meaningPreservation';
import { composeSentence, sceneApplicable, unitEligibility } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/sentenceComposer';
import { newDisplayProof, registerGeneratedDisplay, displayedRecords } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/introducedMeaningLedger';
import { RESEARCH, auditResearchRegistry } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/researchRegistry';
import { runGrammarFixtures } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/researchValidation';
import { explainTerm, newTermMemory } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/termExplanation';
import { semanticApplicationKey, auditRepetition } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/semanticRepetition';
import type { EditorialInput, EditorialDraft, SentenceLedger, } from '@/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/types';

const root = resolve('.'), inputs = new Map<string, EditorialInput>(), drafts = new Map<string, EditorialDraft>();
const registry = readGlobalArtifact(root + '/docs/validation/v4-global-specialist-integration-audit-01', 'global-engine-registry.json') as EngineRegistration[];
const full = () => inputs.get('comprehensive')!, draft = () => drafts.get('comprehensive')!;
beforeAll(async () => {
  for (const entry of registry) {
    const contract = (entry.readerContract as { foundationProductContract: ProductContract[] }).foundationProductContract[0];
    const r = await prepareRehearsalRequest(root, { ...entry, invoke: ACTUAL_INVOKERS[entry.engineId] }, contract), p = planGlobalBook(r);
    const input = createEditorialInput(root, r, p); inputs.set(entry.engineId, input); drafts.set(entry.engineId, generateEditorialDraft(input));
  }
  const e = registry.find(e => e.engineId === 'compatibility-friendship')!, r = await prepareRehearsalRequest(root, { ...e, invoke: ACTUAL_INVOKERS[e.engineId] }, inputs.get(e.engineId)!.plan.readerContract, true);
  const i = createEditorialInput(root, r, planGlobalBook(r)); inputs.set('friendship-display', i); drafts.set('friendship-display', generateEditorialDraft(i));
}, 300000);

describe('Korean Editorial Engine — exact native assignments plus new isolated synthetic definitions', () => {
  for (const entry of registry) it('generates Korean prose and validates original route ' + entry.engineId, () => {
    const i = inputs.get(entry.engineId)!, d = drafts.get(entry.engineId)!;
    expect(d.paragraphs.length).toBeGreaterThan(0); expect(d.sentences.every(s => /[가-힣]/u.test(s.actualText))).toBe(true);
    expect(auditDraft(i, d)).toMatchObject({ ok: true, errors: [], completeCustomerBook: false, actualCustomerClaims: 0 });
    expect(i.handoff).toEqual(compileEditorialHandoff(i.request, i.plan));
  });
  it('retains twelve routes, six products and seven categories', () => {
    expect(inputs.size).toBe(13); expect(new Set([...inputs.values()].map(i => i.plan.productScope)).size).toBe(6);
    expect(new Set([...inputs.values()].map(i => i.plan.relationshipScope).filter(Boolean)).size).toBe(7);
    expect([...inputs.entries()].filter(([k]) => k !== 'friendship-display').reduce((n, [, i]) => n + i.plan.primaryInformation.length, 0)).toBe(1085);
  });
  it('does not fabricate paragraph addresses or full customer Books', () => {
    for (const id of ['comprehensive', 'career']) for (const p of drafts.get(id)!.paragraphs) expect(p.address.paragraphId).toBeNull();
    for (const d of drafts.values()) expect(d.paragraphs.every(p => p.completeCustomerParagraph === false)).toBe(true);
  });
  it('explicitly binds required-2, condition-c and action-c to new test definitions', () => {
    const d = full().definitions.definitions.find(d => d.native.materialId === 'synthetic:cse:c')!;
    expect(d.identifierDefinitions.map(d => d.originalId)).toEqual(['required-2', 'condition-c', 'action-c']);
    expect(d.identifierDefinitions.every(d => /[가-힣]/u.test(d.definition))).toBe(true);
    expect(d).toMatchObject({ provenance: 'SYNTHETIC_TEST_ONLY', existingResearchMeaning: false, automaticClaimAnchorMapping: false, actualCustomerAuthorization: false });
  });
  it('does not silently bridge the twelve research Claim Anchors', () => {
    expect(RESEARCH.claims).toHaveLength(12); expect(RESEARCH.expressions).toHaveLength(24);
    for (const i of inputs.values()) for (const d of i.definitions.definitions) expect(RESEARCH.claims.some(c => c.claimIdentity === d.native.claimId)).toBe(false);
  });
  for (const term of RESEARCH.terms) it('requires exact term scope and preserves source boundary ' + term.term, () => {
    const i = full(), c = constructClaim(i, i.plan.selectedCandidateReferences[0])!;
    expect(explainTerm(i, c, term.id, { mode: 'OFFLINE_TERM_REFERENCE' }).status).toBe('WITHHELD');
    const r = explainTerm(i, c, term.id, newTermMemory(i));
    expect(r.newIndependentFacts).toBe(0);
    if (r.status === 'GENERAL_USAGE_REFERENCE') expect(r).toMatchObject({ individualDefinitionOrInterpretationApproved: false, actualCustomerClaims: 0, sourceHash: term.sourceHash });
  });
  it('explains a sourced MBTI usage once and withholds unavailable strength/formation claims', () => {
    const i = inputs.get('compatibility-parent-child')!, c = constructClaim(i, i.plan.selectedCandidateReferences[0])!, memory = newTermMemory(i);
    expect(explainTerm(i, c, 'ker:term:13', memory).status).toBe('GENERAL_USAGE_REFERENCE');
    expect(explainTerm(i, c, 'ker:term:13', memory).status).toBe('REFERENCE_ALREADY_INTRODUCED');
    for (const id of ['ker:term:4', 'ker:term:5', 'ker:term:6', 'ker:term:7', 'ker:term:8', 'ker:term:9']) expect(explainTerm(i, c, id, memory).status).toBe('WITHHELD');
  });
  it('loads all 392 original records without customer approval or runtime changes', () => expect(auditResearchRegistry()).toHaveLength(392));
  for (const f of runGrammarFixtures()) it('executes bounded original grammar construction ' + f.id, () => {
    expect(f.passed).toBe(true); expect(f.actual).not.toBe(f.prohibited);
  });
  for (const field of ['questionId', 'questionHash', 'materialId', 'claimId', 'meaningId', 'originalMeaningHash', 'assignmentHash', 'fixture', 'product', 'relationship', 'engine'] as const) it('rejects changed definition binding ' + field, () => {
    const a = full().plan.selectedCandidateReferences[0], d = structuredClone(full().definitions.definitions.find(d => d.native.materialId === a.originalMaterialId)!);
    (d.native as Record<string, unknown>)[field] = 'forged'; expect(definitionErrors(d, a, full().request)).toContain('EXACT_NATIVE_ASSIGNMENT_BINDING_REQUIRED');
  });
  it('blocks an opaque required identifier if its new definition is omitted', () => {
    const a = full().plan.selectedCandidateReferences[0], d = structuredClone(full().definitions.definitions.find(d => d.native.materialId === a.originalMaterialId)!);
    d.identifierDefinitions = []; expect(definitionErrors(d, a, full().request)).toContain('OPAQUE_IDENTIFIER_DEFINITION_MISSING');
  });
  it('does not authenticate a cloned Editorial Input or Claim', () => {
    expect(() => generateEditorialDraft({ ...full() })).toThrow('AUTHENTIC_OFFLINE');
    const a = full().plan.selectedCandidateReferences[0]; expect(constructClaim({ ...full() }, a)).toBeNull();
    const c = constructClaim(full(), a)!; expect(composeSentence(full(), { ...c }, c.syntheticDefinition.units[0], 'risk')).toBeNull();
  });
  it('preserves the original supporting MBTI/Fusion ledger', () => {
    for (const [k, i] of inputs) for (const s of drafts.get(k)!.sentences) {
      const a = i.plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === s.questionId)!;
      expect(s.evidenceIds).toEqual(a.actualEvidence); expect(s.ancestryRoots).toEqual(a.supportingAncestryRoots);
      expect(s.originalSupportingInformation).toEqual(a.supportingInformation);
    }
  });
  const mutations: [string, (s: SentenceLedger) => void][] = [
    ['claim', s => { s.primaryClaimId = 'other'; }], ['meaning', s => { s.meaningId = 'other'; }],
    ['question', s => { s.questionId = 'other'; }], ['source hash', s => { s.source.hash = 'other'; }],
    ['source locator', s => { s.source.locator = { file: 'other' }; }], ['version', s => { s.source.version = 'other'; }],
    ['evidence', s => { s.evidenceIds = []; }], ['MBTI/Fusion support', s => { s.originalSupportingInformation = []; }],
    ['root', s => { s.factRoots = ['invented']; }], ['ancestry', s => { s.ancestryRoots = []; }],
    ['owner', s => { s.owner = 'other'; }], ['direction', s => { s.direction = 'BA'; }],
    ['time', s => { s.temporal = [{ scope: 'annual', start: '1900', endExclusive: '2100', certainty: 'confirmed', originalBounds: null, compatibleCombination: true }]; }],
    ['semantic units', s => { s.semanticUnits = []; }], ['condition', s => { s.conditionalScope.clause = ''; }],
    ['negation', s => { s.negationScope = 'REMOVED'; }], ['counterexample', s => { s.syntheticCounterexamples = []; }],
    ['original counterexample', s => { s.originalCounterexamples = null; }], ['prohibition', s => { s.syntheticProhibitedInferences = []; }],
    ['original prohibition', s => { s.originalProhibitedInferences = null; }], ['certainty', s => { Object.assign(s, { certainty: 'confirmed' }); }],
    ['new fact', s => { Object.assign(s, { newIndependentFacts: 1 }); }], ['expression source', s => { s.expressionSource.definitionHash = 'other'; }],
  ];
  for (const [name, change] of mutations) it('withholds a sentence with changed ' + name, () => {
    const s = structuredClone(draft().sentences[0]); change(s);
    const a = full().plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === s.questionId) ?? full().plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === draft().sentences[0].questionId)!;
    expect(validateMeaning(full(), constructClaim(full(), a)!, s).ok).toBe(false);
  });
  for (const r of RESEARCH.invariants) it('blocks original UnsafeAfter invariant ' + r.invariant, () => {
    const s = structuredClone(draft().sentences[0]); s.actualText = r.unsafeAfter;
    const a = full().plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === s.questionId)!;
    expect(validateMeaning(full(), constructClaim(full(), a)!, s).ok).toBe(false);
  });
  for (const r of RESEARCH.rejected) for (const suffix of ['', '일 수 있어요.']) it('blocks rejected expression with softer ending ' + r.id + suffix, () => {
    const s = structuredClone(draft().sentences[0]); s.actualText = r.rejected + suffix;
    const a = full().plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === s.questionId)!;
    expect(validateMeaning(full(), constructClaim(full(), a)!, s).ok).toBe(false);
  });
  for (const f of RESEARCH.functions) it('realizes a licensed construction for function ' + f.function, () => {
    const i = f.function === 'fusion' ? inputs.get('compatibility-parent-child')! : full();
    const a = i.plan.selectedCandidateReferences.find(a => i.definitions.definitions.some(d => d.native.assignmentHash === digest(a) && d.units.some(u => u.functions.includes(f.function))))!;
    const c = constructClaim(i, a)!, u = c.syntheticDefinition.units.find(u => u.functions.includes(f.function))!, proof = newDisplayProof(i);
    const p = drafts.get(i.request.registration.engineId)!.paragraphs.find(p => p.questionId === c.readerQuestion.id)!;
    expect(registerGeneratedDisplay(i, p, proof)).not.toBeNull();
    const s = composeSentence(i, c, u, f.function, new Set(), proof);
    expect(s).not.toBeNull(); expect(s && validateMeaning(i, c, s, proof).ok).toBe(true);
  });
  for (const scene of RESEARCH.scenes) it('keeps scene hypothetical and scoped ' + scene.id, () => {
    const unit = structuredClone(full().definitions.definitions[0].units[0]); unit.kind = 'HYPOTHETICAL_SCENE'; unit.sceneRef = scene.id; unit.sceneCondition = scene.requiredUserState; unit.condition.clause = '가령 해당 활동을 한다면,';
    const scope = { plan: { productScope: scene.productKey, relationshipScope: scene.category } } as EditorialInput;
    expect(sceneApplicable(scope, unit).ok).toBe(true); unit.condition.clause = '지난번 그 일을 했습니다.'; expect(sceneApplicable(scope, unit).ok).toBe(false);
    unit.condition.clause = '가령 해당 활동을 한다면,'; expect(sceneApplicable({ plan: { productScope: 'FORGED', relationshipScope: null } } as unknown as EditorialInput, unit).ok).toBe(false);
  });
  it('blocks unlicensed risk and twist rather than adding generic downsides', () => {
    const a = full().plan.selectedCandidateReferences.find(a => a.primaryInformation.function === 'POSITIVE')!, c = constructClaim(full(), a)!, u = c.syntheticDefinition.units[0];
    expect(unitEligibility(full(), c, u, 'risk')).toContain('MISSING_FUNCTION');
    expect(composeSentence(full(), c, u, 'twist')).toBeNull();
  });
  it('retains independent A→B and B→A, with no name-only reversal', () => {
    for (const [k, d] of drafts) if (k.startsWith('compatibility-') && k !== 'compatibility-friendship') {
      expect(d.sentences.some(s => ['AB', 'A_TO_B'].includes(s.direction ?? ''))).toBe(true);
      expect(d.sentences.some(s => ['BA', 'B_TO_A'].includes(s.direction ?? ''))).toBe(true);
    }
  });
  it('requires genuine generated text in addition to the native Friendship display fixture', () => {
    const i = inputs.get('friendship-display')!, d = drafts.get('friendship-display')!;
    expect(i.plan.selectedCandidateReferences.length).toBe(180);
    const repair = i.plan.selectedCandidateReferences.find(a => a.displayDependency?.kind === 'REPAIR')!, c = constructClaim(i, repair)!;
    expect(c).not.toBeNull(); expect(composeSentence(i, c, c.syntheticDefinition.units[0], c.syntheticDefinition.units[0].functions[0])).toBeNull();
    expect(d.sentences.some(s => s.readerAddress.chapterId === 'CH08')).toBe(true);
    expect(d.sentences.some(s => s.readerAddress.chapterId === 'CH09')).toBe(true);
    expect(auditDraft(i, d).ok).toBe(true); expect(d.displayRecords.every(r => !r.actualCustomerDisplay)).toBe(true);
  });
  it('does not accept a copied display record as proof', () => {
    const i = inputs.get('friendship-display')!, a = i.plan.selectedCandidateReferences.find(a => a.displayDependency?.kind === 'REPAIR')!, c = constructClaim(i, a)!;
    expect(composeSentence(i, c, c.syntheticDefinition.units[0], c.syntheticDefinition.units[0].functions[0], new Set(), { fixture: i.request.fixtureId })).toBeNull();
    expect(displayedRecords({ fixture: i.request.fixtureId })).toEqual([]);
  });
  it('rejects changed paragraph addresses, question text and customer authority', () => {
    for (const change of [ (d: EditorialDraft) => { d.paragraphs[0].address.paragraphId = 'invented'; },
      (d: EditorialDraft) => { d.paragraphs[0].originalQuestion = 'different question'; },
      (d: EditorialDraft) => { Object.assign(d, { actualCustomerClaims: 1 }); },
      (d: EditorialDraft) => { d.paragraphs[0].text += ' 누락 없는 완성본입니다.'; } ]) {
      const d = structuredClone(draft()); change(d); expect(auditDraft(full(), d).ok).toBe(false);
    }
  });
  it('detects same-root and word-only meaning repetition without merging owners', () => {
    const s = draft().sentences[0], copy = { ...s, id: 'another-sentence', actualText: '같은 뜻의 다른 표현' };
    const unit = full().definitions.definitions.find(d => d.native.questionId === s.questionId)!.units[0];
    expect(semanticApplicationKey(s, unit)).toBe(semanticApplicationKey(copy, unit));
    expect(semanticApplicationKey(s, unit)).not.toBe(semanticApplicationKey({ ...copy, owner: 'other' }, unit));
    expect(auditRepetition([s, copy]).some(r => r.kind === 'ROOT')).toBe(true);
  });
  it('preserves conditional units and rejects new applications invented by wording', () => {
    const u = full().definitions.definitions[0].units[0];
    for (const key of ['condition', 'negationScope', 'predicate', 'meaningKey'] as const) {
      const next = structuredClone(u); Object.assign(next, { [key]: 'invented' }); expect(validateUnitMutation(u, next).ok).toBe(false);
    }
  });
  it('does not execute in Vercel or grant permissions from NODE_ENV', () => {
    vi.stubEnv('VERCEL', '1'); try { expect(() => generateEditorialDraft(full())).toThrow('AUTHENTIC_OFFLINE'); } finally { vi.unstubAllEnvs(); }
    vi.stubEnv('NODE_ENV', 'production'); try { expect(generateEditorialDraft(full()).actualCustomerClaims).toBe(0); } finally { vi.unstubAllEnvs(); }
  });
  it('is byte deterministic for identical input without random endings', () => expect(JSON.stringify(generateEditorialDraft(full()))).toBe(JSON.stringify(generateEditorialDraft(full()))));
  it('keeps the customer Writer and protected source fixture out of this engine', () => {
    expect(readFileSync(root + '/src/lib/book/paidRuntime.ts', 'utf8')).not.toContain('korean-editorial-engine');
    expect(readFileSync(root + '/tests/fixtures/comprehensive-specialist-engine-01/synthetic-knowledge.json', 'utf8')).not.toContain('synthetic:kee:');
  });
});
