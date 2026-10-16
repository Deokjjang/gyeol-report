import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hash, recordHash } from '../sourceReader';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { assertPlanningRequest } from '../global-book-planner/planningRequest';
import { compileEditorialHandoff } from '../global-book-planner/editorialHandoff';
import { candidateEligibility } from '../global-book-planner/evidenceEligibility';
import { isRecord } from '../normalization';
import { DEFINITION_SHA256 } from './sourcePin';
import { DEFINITION_FILE, EDITORIAL_VERSION, type DefinitionRegistry, type EditorialInput, type SyntheticMeaningDefinition } from './types';
import type { GlobalBookPlan, GlobalBookPlanningRequest, SelectedAssignment } from '../global-book-planner/types';

const authenticated = new WeakMap<EditorialInput, { hash: string; sources: Map<string, string> }>();
export const isAuthenticatedInput = (input: EditorialInput) => authenticated.has(input) && Object.isFrozen(input);
export function freeze<T>(v: T): T {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) { for (const x of Object.values(v)) freeze(x); Object.freeze(v); }
  return v;
}
export function definitionErrors(d: SyntheticMeaningDefinition, a: SelectedAssignment, r: GlobalBookPlanningRequest): string[] {
  const expected = { engine: r.registration.engineId, fixture: r.fixtureId, product: r.productKey, relationship: r.relationshipCategory,
    questionId: a.originalReaderQuestion.id, questionHash: digest(a.originalReaderQuestion), materialId: a.originalMaterialId,
    claimId: a.primaryInformation.claimId, meaningId: a.primaryInformation.meaningId, originalMeaningHash: digest(a.primaryInformation.original), assignmentHash: digest(a), source: a.source };
  const errors: string[] = [];
  if (d.provenance !== 'SYNTHETIC_TEST_ONLY' || d.existingResearchMeaning !== false || d.automaticClaimAnchorMapping !== false || d.actualCustomerAuthorization !== false) errors.push('SYNTHETIC_DEFINITION_CANNOT_APPROVE_RESEARCH');
  if (digest(d.native) !== digest(expected)) errors.push('EXACT_NATIVE_ASSIGNMENT_BINDING_REQUIRED');
  if (!d.glossIsNewSyntheticTestData || !d.syntheticQuestionGloss.trim()) errors.push('UNVERIFIED_READER_BRIDGE');
  if (!d.units.length || !d.units.some(u => u.id === d.primaryUnit) || new Set(d.units.map(u => u.id)).size !== d.units.length) errors.push('MISSING_SEMANTIC_UNITS');
  for (const u of d.units) {
    if (u.certainty !== 'conditional' || !u.meaningKey || !u.condition.id || !u.condition.clause || !u.functions.length || !u.negationScope) errors.push('MEANING_VALIDATION_REQUIRED');
    if (u.subject && u.subject.owner !== a.owner || u.object.owner !== a.owner) errors.push('OWNER_CHANGED_IN_TYPED_SLOT');
    if (u.kind === 'ACTUAL_CALCULATED_FACT' || u.kind === 'ACTUAL_ENTERED_INPUT') errors.push('NEW_SYNTHETIC_PROSE_IS_NOT_A_NEW_FACT');
  }
  for (const entry of d.identifierDefinitions) {
    const unit = d.units.find(u => u.id === entry.semanticUnitRef);
    if (!unit || !entry.definition.trim() || entry.role === 'condition' && entry.definition !== unit.condition.clause) errors.push('IDENTIFIER_SEMANTIC_UNIT_LINK_CHANGED');
  }
  // The newly authored definitions explain the old opaque identifiers. They
  // never change the old records or claim an old reviewed meaning existed.
  if (isRecord(a.primaryInformation.original) && Array.isArray(a.primaryInformation.original.requiredMeanings)) {
    const m = a.primaryInformation.original;
    for (const id of [...(Array.isArray(m.requiredMeanings) ? m.requiredMeanings : []), ...(Array.isArray(m.conditions) ? m.conditions : []), ...(typeof m.action === 'string' ? [m.action] : [])]) {
      if (typeof id !== 'string' || !d.identifierDefinitions.some(x => x.originalId === id && x.definition.trim())) errors.push('OPAQUE_IDENTIFIER_DEFINITION_MISSING');
    }
  }
  return [...new Set(errors)].sort();
}
export function createEditorialInput(root: string, request: GlobalBookPlanningRequest, plan: GlobalBookPlan): EditorialInput {
  if (process.env.VERCEL) throw Error('KOREAN_EDITORIAL_OFFLINE_ONLY');
  assertPlanningRequest(request);
  const handoff = compileEditorialHandoff(request, plan);
  const bytes = readFileSync(join(root, DEFINITION_FILE)), definitionFileHash = hash(bytes);
  if (definitionFileHash !== DEFINITION_SHA256) throw Error('SYNTHETIC_DEFINITION_SOURCE_HASH_CHANGED');
  const definitions: DefinitionRegistry = JSON.parse(bytes.toString());
  const sources = new Map<string, string>();
  const sourceRecords = new Map<string, unknown>();
  if (definitions.version !== 'korean-editorial-synthetic-definitions-v1' || definitions.provenance !== 'SYNTHETIC_TEST_ONLY'
    || definitions.actualApprovals !== 0 || definitions.actualClaims !== 0 || definitions.actualBookAllocations !== 0
    || new Set(definitions.definitions.map(d => d.id)).size !== definitions.definitions.length) throw Error('SYNTHETIC_REGISTRY_BOUNDARY_CHANGED');
  for (const a of plan.selectedCandidateReferences) {
    const option = request.options.find(o => o.id === a.candidateId);
    if (!option || !candidateEligibility(request, option).eligiblePrimary) throw Error('ALL_TWELVE_NATIVE_GATES_REQUIRED');
    const locator = a.source.locator;
    if (!isRecord(locator) || typeof locator.file !== 'string' || typeof locator.pointer !== 'string'
      || !locator.file.startsWith('tests/fixtures/')) throw Error('INDEPENDENT_SYNTHETIC_SOURCE_REQUIRED');
    if (!sourceRecords.has(locator.file)) {
      const sourceBytes = readFileSync(join(root, locator.file));
      sources.set(locator.file, hash(sourceBytes));
      sourceRecords.set(locator.file, JSON.parse(sourceBytes.toString()));
    }
    if (sources.get(locator.file) !== locator.fileSha256) throw Error('NATIVE_SOURCE_FILE_CHANGED');
    let raw: unknown = sourceRecords.get(locator.file);
    for (const key of locator.pointer.split('/').slice(1)) {
      const decoded = key.replace(/~1/g, '/').replace(/~0/g, '~');
      raw = Array.isArray(raw) ? raw[Number(decoded)] : isRecord(raw) ? raw[decoded] : undefined;
    }
    if (recordHash(raw) !== a.source.hash) throw Error('NATIVE_SOURCE_RECORD_CHANGED');
    const d = definitions.definitions.find(d => d.native.engine === request.registration.engineId && d.native.materialId === a.originalMaterialId);
    if (d) { const errors = definitionErrors(d, a, request); if (errors.length) throw Error(errors.join('|')); }
  }
  const input: EditorialInput = { version: EDITORIAL_VERSION, root, request, plan, handoff, definitions: freeze(definitions), definitionFileHash,
    originalApprovalState: { native: request.approvalState, official: 'OFFLINE_IMPLEMENTED_REAL_ACTIVATION_PENDING', actualOperatorApproved: 0, actualCustomerApproved: 0 } };
  freeze(input.handoff); freeze(input.originalApprovalState); Object.freeze(input);
  authenticated.set(input, { hash: digest({ handoff, plan, definitions, approval: input.originalApprovalState }), sources });
  return input;
}
export function assertEditorialInput(input: EditorialInput): void {
  if (process.env.VERCEL || !authenticated.has(input)) throw Error('AUTHENTIC_OFFLINE_EDITORIAL_INPUT_REQUIRED');
  assertPlanningRequest(input.request);
  const proof = authenticated.get(input)!;
  if ([...proof.sources].some(([file, pin]) => hash(readFileSync(join(input.root, file))) !== pin)
    || hash(readFileSync(join(input.root, DEFINITION_FILE))) !== input.definitionFileHash
    || proof.hash !== digest({ handoff: compileEditorialHandoff(input.request, input.plan), plan: input.plan, definitions: input.definitions, approval: input.originalApprovalState })) throw Error('EDITORIAL_INPUT_CHANGED');
}
