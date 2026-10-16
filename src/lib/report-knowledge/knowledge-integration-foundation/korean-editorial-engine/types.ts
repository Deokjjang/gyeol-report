import type { FunctionKey } from '../../korean-editorial-research/researchTypes';
import type { GlobalBookPlan, GlobalBookPlanningRequest, SelectedAssignment, RootOwnership } from '../global-book-planner/types';
import type { EvidenceDirection } from '../actual-evidence-graph/types';
import type { KoreanEditorialPlanningHandoff } from '../global-book-planner/editorialHandoff';
import type { OfficialApprovalEditorialHandoff } from '../official-approval-contract/futureActivation';
import type { NounSlot } from './typedKoreanSlots';

export const EDITORIAL_VERSION = 'offline-korean-editorial-engine-v1' as const;
export const DEFINITION_FILE = 'tests/fixtures/korean-editorial-engine-01/synthetic-meaning-definitions.json';
export type EditorialKind = 'ACTUAL_CALCULATED_FACT' | 'ACTUAL_ENTERED_INPUT' | 'APPROVED_OR_SYNTHETIC_MEANING' | 'CONDITIONAL_APPLICATION' | 'EDITORIAL_CONNECTIVE' | 'HYPOTHETICAL_SCENE' | 'RECALL';
export type ShortageCode = 'MISSING_APPROVED_CLAIM' | 'MISSING_PRIMARY_INFORMATION' | 'UNVERIFIED_READER_BRIDGE' | 'REQUIRED_SOURCE_NOT_VERIFIED' | 'MISSING_SEMANTIC_UNITS' | 'MISSING_FUNCTION' | 'MISSING_REQUIRED_CONTEXT' | 'UNRESOLVED_GRAMMAR_SLOT' | 'MISSING_ACTUAL_DIRECTION' | 'TEMPORAL_SCOPE_MISMATCH' | 'REPAIR_DEPENDENCY_MISSING' | 'RECALL_DISPLAY_MISSING' | 'MEANING_VALIDATION_REQUIRED' | 'CUSTOMER_APPROVAL_PENDING' | 'WITHHELD_MEANING_NOT_VERIFIED' | 'DUPLICATE_MEANING';
export type PredicateKey = 'check' | 'compare' | 'distinguish' | 'delay' | 'reduce' | 'retain' | 'ask' | 'notProve' | 'notTransfer';
export type SemanticUnit = {
  id: string; meaningKey: string; kind: EditorialKind; functions: FunctionKey[];
  condition: { id: string; clause: string }; negationScope: string;
  subject: NounSlot | null; object: NounSlot; predicate: PredicateKey;
  certainty: 'conditional'; adviceIdentity: string | null;
  sceneRef: string | null; sceneCondition: string | null;
  requiredEvidenceKinds: string[]; requiresPreviousDisplay: boolean;
  displayPrerequisiteUnitIds: string[];
};
export type SyntheticMeaningDefinition = {
  id: string; provenance: 'SYNTHETIC_TEST_ONLY'; existingResearchMeaning: false;
  automaticClaimAnchorMapping: false; actualCustomerAuthorization: false;
  native: { engine: string; fixture: string; product: GlobalBookPlan['productScope']; relationship: GlobalBookPlan['relationshipScope'];
    questionId: string; questionHash: string; materialId: string; claimId: string; meaningId: string;
    originalMeaningHash: string; assignmentHash: string; source: SelectedAssignment['source'] };
  identifierDefinitions: { originalId: string; role: 'meaning' | 'condition' | 'action'; definition: string; semanticUnitRef: string }[];
  syntheticQuestionGloss: string; glossIsNewSyntheticTestData: true;
  primaryUnit: string; units: SemanticUnit[]; counterexamples: string[]; prohibitedInferences: string[];
};
export type DefinitionRegistry = { version: 'korean-editorial-synthetic-definitions-v1'; provenance: 'SYNTHETIC_TEST_ONLY'; actualApprovals: 0; actualClaims: 0; actualBookAllocations: 0; definitions: SyntheticMeaningDefinition[] };
export type EditorialInput = {
  version: typeof EDITORIAL_VERSION; root: string; request: GlobalBookPlanningRequest; plan: GlobalBookPlan;
  handoff: KoreanEditorialPlanningHandoff; definitions: DefinitionRegistry; definitionFileHash: string;
  originalApprovalState: { native: GlobalBookPlanningRequest['approvalState']; official: 'OFFLINE_IMPLEMENTED_REAL_ACTIVATION_PENDING'; actualOperatorApproved: 0; actualCustomerApproved: 0 };
};
export type TypedEditorialClaim = {
  claimId: string; meaningId: string; readerQuestion: SelectedAssignment['originalReaderQuestion'];
  originalAssignment: SelectedAssignment; source: SelectedAssignment['source']; evidenceIds: readonly string[];
  factRoots: readonly string[]; ancestryRoots: readonly string[]; owner: string | null; direction: string | null;
  factRootOwnership: readonly RootOwnership[]; directionWitnesses: readonly { nodeId: string; ownerId: string; direction: EvidenceDirection }[];
  temporal: SelectedAssignment['temporalScope']; originalConditions: unknown; originalNegationAndMeaning: unknown;
  originalCounterexamples: unknown; originalProhibitions: unknown; originalSupportingInformation: SelectedAssignment['supportingInformation'];
  originalApprovalState: EditorialInput['originalApprovalState']; syntheticDefinition: SyntheticMeaningDefinition;
  expressionSource: { file: typeof DEFINITION_FILE; fileHash: string; definitionHash: string; provenance: 'SYNTHETIC_TEST_ONLY'; researchExpressionCopied: false };
};
export type SentenceLedger = {
  id: string; readerAddress: SelectedAssignment['originalReaderQuestion']['address']; questionId: string;
  materialId: string; primaryClaimId: string; meaningId: string; semanticUnits: string[]; function: FunctionKey;
  kind: EditorialKind; source: SelectedAssignment['source']; evidenceIds: readonly string[]; factRoots: readonly string[];
  semanticMeaningKey: string; practicalAdviceIdentity: string | null;
  originalMeaningHash: string; originalAssignmentHash: string; originalApprovalState: EditorialInput['originalApprovalState'];
  factRootOwnership: readonly RootOwnership[]; directionWitnesses: TypedEditorialClaim['directionWitnesses'];
  ancestryRoots: readonly string[]; owner: string | null; direction: string | null; temporal: SelectedAssignment['temporalScope'];
  certainty: 'conditional'; conditionalScope: SemanticUnit['condition']; negationScope: string;
  originalConditions: unknown; originalCounterexamples: unknown; originalProhibitedInferences: unknown;
  syntheticCounterexamples: string[]; syntheticProhibitedInferences: string[];
  originalSupportingInformation: SelectedAssignment['supportingInformation']; expressionSource: TypedEditorialClaim['expressionSource'];
  sceneSource: { id: string; recordHash: string; hypotheticalOnly: true } | null;
  actualText: string; surfaceId: string; validationState: 'VERIFIED_SYNTHETIC_ONLY'; newIndependentFacts: 0;
};
export type EditorialParagraph = { id: string; address: SelectedAssignment['originalReaderQuestion']['address']; questionId: string; originalQuestion: string | null; syntheticQuestionGloss: string; sentences: SentenceLedger[]; text: string; completeCustomerParagraph: false };
export type SyntheticDisplayRecord = { version: 'korean-editorial-synthetic-display-v1'; fixture: string; material: string; claim: string; meaning: string; owner: string | null; direction: string | null; temporalHash: string; sourceHash: string; sourceGroupsHash: string; semanticUnits: { id: string; payloadHash: string }[]; roots: readonly string[]; readerAddress: SelectedAssignment['originalReaderQuestion']['address']; sentenceIds: string[]; sentenceTextHash: string; actuallyGeneratedAndValidated: true; actualCustomerDisplay: false };
export type EditorialDraft = {
  version: typeof EDITORIAL_VERSION; engine: string; mode: GlobalBookPlan['mode']; product: GlobalBookPlan['productScope']; relationship: GlobalBookPlan['relationshipScope'];
  paragraphs: EditorialParagraph[]; sentences: SentenceLedger[]; displayRecords: SyntheticDisplayRecord[];
  shortages: { questionId: string; address: SelectedAssignment['originalReaderQuestion']['address']; reasons: readonly string[] }[];
  repetition: { scope: 'PARAGRAPH' | 'CHAPTER' | 'BOOK'; kind: string; key: string; occurrences: string[]; blocked: boolean }[];
  transitions: { from: string; to: string; researchRef: string; text: string; kind: 'EDITORIAL_CONNECTIVE'; newIndependentFacts: 0 }[];
  actualOperatorApproved: 0; actualCustomerApproved: 0; actualCustomerEligible: 0; actualCustomerSelections: 0; actualCustomerClaims: 0; actualBookAllocations: 0;
};
export type FutureOfficialApprovalIntake = OfficialApprovalEditorialHandoff;
