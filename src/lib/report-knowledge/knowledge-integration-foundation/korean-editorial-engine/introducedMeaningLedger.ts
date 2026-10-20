import { digest } from '../global-specialist-integration/candidateEnvelope';
import { constructClaim } from './claimEnvelope';
import { validateMeaning } from './meaningPreservation';
import type { EditorialInput, EditorialParagraph, SemanticUnit, SyntheticDisplayRecord, TypedEditorialClaim } from './types';

export type DisplayProof = { readonly fixture: string };
const ledgers = new WeakMap<DisplayProof, { input: EditorialInput; records: SyntheticDisplayRecord[] }>();
export function newDisplayProof(input: EditorialInput): DisplayProof {
  const proof = Object.freeze({ fixture: input.request.fixtureId });
  ledgers.set(proof, { input, records: [] }); return proof;
}
export function displayedRecords(proof: DisplayProof): SyntheticDisplayRecord[] {
  const state = ledgers.get(proof); return state ? structuredClone(state.records) : [];
}
export function semanticPayloadHash(unit: SemanticUnit): string {
  return digest([unit.meaningKey, unit.condition, unit.negationScope, unit.subject, unit.object, unit.predicate, unit.certainty]);
}
export function hasDisplayDependency(input: EditorialInput, claim: TypedEditorialClaim, proof?: DisplayProof, unit?: SemanticUnit): boolean {
  const state = proof ? ledgers.get(proof) : undefined;
  if (!state || state.input !== input) return false;
  if (unit && !unit.displayPrerequisiteUnitIds.every(id => state.records.some(r => r.semanticUnits.some(u => u.id === id)
    && r.owner === claim.owner && r.direction === claim.direction && r.temporalHash === digest(claim.temporal)))) return false;
  const dep = claim.originalAssignment.displayDependency;
  if (!dep && unit?.kind === 'EDITORIAL_CONNECTIVE' && unit.displayPrerequisiteUnitIds.length > 0) return true;
  if (dep) {
    if (!dep.actualDisplayVerified || !dep.nativeDisplayProof || !dep.alternatives.length) return false;
    const nativeDependency = dep.alternatives.some(ids => ids.length > 0 && ids.every(id => state.records.some(r => r.material === id && r.fixture === input.request.fixtureId)));
    if (!nativeDependency) return false;
    return dep.kind !== 'RECALL' || !!unit && state.records.some(r => r.owner === claim.owner && r.direction === claim.direction
      && r.temporalHash === digest(claim.temporal) && r.semanticUnits.some(u => unit.displayPrerequisiteUnitIds.includes(u.id) && u.payloadHash === semanticPayloadHash(unit)));
  }
  return state.records.some(r => r.meaning === claim.meaningId && r.claim === claim.claimId && r.owner === claim.owner
    && r.direction === claim.direction && r.temporalHash === digest(claim.temporal) && r.sourceHash === claim.source.hash
    && (!unit || r.semanticUnits.some(u => u.id === unit.id && u.payloadHash === semanticPayloadHash(unit))));
}
export function registerGeneratedDisplay(input: EditorialInput, paragraph: EditorialParagraph, proof: DisplayProof): SyntheticDisplayRecord | null {
  const state = ledgers.get(proof), a = input.plan.selectedCandidateReferences.find(a => a.originalReaderQuestion.id === paragraph.questionId);
  if (!state || state.input !== input || !a || !paragraph.sentences.length || paragraph.text !== paragraph.sentences.map(s => s.actualText).join(' ')) return null;
  const claim = constructClaim(input, a);
  if (!claim || paragraph.sentences.some(s => !validateMeaning(input, claim, s, proof).ok)) return null;
  if (digest(paragraph.address) !== digest(claim.readerQuestion.address)
    || paragraph.originalQuestion !== claim.readerQuestion.originalText || paragraph.syntheticQuestionGloss !== claim.syntheticDefinition.syntheticQuestionGloss) return null;
  if (!paragraph.sentences.some(s => s.semanticUnits.includes(claim.syntheticDefinition.primaryUnit))) return null;
  const record: SyntheticDisplayRecord = { version: 'korean-editorial-synthetic-display-v1', fixture: input.request.fixtureId,
    material: a.originalMaterialId, claim: claim.claimId, meaning: claim.meaningId, owner: claim.owner, direction: claim.direction,
    temporalHash: digest(claim.temporal), sourceHash: claim.source.hash, roots: claim.factRoots, readerAddress: claim.readerQuestion.address,
    sourceGroupsHash: digest(claim.originalConditions), semanticUnits: paragraph.sentences.flatMap(s => s.semanticUnits.map(id => ({ id, payloadHash: semanticPayloadHash(claim.syntheticDefinition.units.find(u => u.id === id)!) }))),
    sentenceIds: paragraph.sentences.map(s => s.id), sentenceTextHash: digest(paragraph.sentences.map(s => s.actualText)),
    actuallyGeneratedAndValidated: true, actualCustomerDisplay: false };
  state.records.push(structuredClone(record)); return record;
}
