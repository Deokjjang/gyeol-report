import { digest } from '../global-specialist-integration/candidateEnvelope';
import { recordHash } from '../sourceReader';
import { freeze, definitionErrors, isAuthenticatedInput } from './editorialInput';
import { DEFINITION_FILE, type EditorialInput, type TypedEditorialClaim } from './types';
import type { SelectedAssignment } from '../global-book-planner/types';
import type { ActualEvidenceNode } from '../actual-evidence-graph/types';

const claims = new WeakMap<TypedEditorialClaim, { hash: string; input: EditorialInput }>();
export function constructClaim(input: EditorialInput, assignment: SelectedAssignment): TypedEditorialClaim | null {
  if (!isAuthenticatedInput(input) || input.plan.mode !== 'ISOLATED_EDITORIAL_REHEARSAL'
    || !input.plan.selectedCandidateReferences.includes(assignment)) return null;
  const definition = input.definitions.definitions.find(d => d.native.engine === input.request.registration.engineId
    && d.native.materialId === assignment.originalMaterialId && d.native.assignmentHash === digest(assignment));
  if (!definition || definitionErrors(definition, assignment, input.request).length) return null;
  const claim: TypedEditorialClaim = {
    claimId: assignment.primaryInformation.claimId, meaningId: assignment.primaryInformation.meaningId,
    readerQuestion: assignment.originalReaderQuestion, originalAssignment: assignment, source: assignment.source,
    evidenceIds: assignment.actualEvidence, factRoots: assignment.canonicalFactRoots, ancestryRoots: assignment.supportingAncestryRoots,
    owner: assignment.owner, direction: assignment.direction, temporal: assignment.temporalScope,
    factRootOwnership: input.request.canonicalFactRoots.filter(r => [...assignment.canonicalFactRoots, ...assignment.supportingAncestryRoots].includes(r.id)),
    directionWitnesses: (input.request.actualEvidenceWitnesses as readonly ActualEvidenceNode[]).flatMap(n => assignment.actualEvidence.includes(n.id) && n.direction ? [{ nodeId: n.id, ownerId: n.owner.fixtureOwnerId, direction: n.direction }] : []),
    originalConditions: assignment.conditionalRequirements, originalNegationAndMeaning: assignment.primaryInformation.original,
    originalCounterexamples: assignment.counterexamples, originalProhibitions: assignment.disallowedInferences,
    originalSupportingInformation: assignment.supportingInformation, originalApprovalState: input.originalApprovalState,
    syntheticDefinition: definition, expressionSource: { file: DEFINITION_FILE, fileHash: input.definitionFileHash,
      definitionHash: recordHash(definition), provenance: 'SYNTHETIC_TEST_ONLY', researchExpressionCopied: false },
  };
  freeze(claim); claims.set(claim, { hash: digest(claim), input }); return claim;
}
export function authenticClaim(claim: TypedEditorialClaim, input?: EditorialInput): boolean {
  const proof = claims.get(claim);
  return !!proof && (!input || proof.input === input) && proof.hash === digest(claim);
}
