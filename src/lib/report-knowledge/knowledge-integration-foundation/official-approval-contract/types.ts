import type { KnowledgeBindingApprovalRequirement, KnowledgeBindingGateResult, ApprovalRecord } from '../knowledge-binder/types';
import type { ProductKey, RelationshipCategory } from '../types';

export const APPROVAL_VERSION = 'official-approval-contract-v1' as const;
export const SIGNING_DOMAIN = 'GYEOL_OFFICIAL_APPROVAL_V1' as const;
export const DECISION_KINDS = ['HUMAN_MEANING_REVIEW_DECISION', 'DOMAIN_APPLICABILITY_DECISION', 'OPERATOR_AUTHORIZATION', 'CUSTOMER_USE_AUTHORIZATION'] as const;
export type DecisionKind = typeof DECISION_KINDS[number];
export type AuthorityKind = DecisionKind | 'REVOCATION' | 'SUPERSESSION' | 'KEY_ROTATION';
export type ApprovalStage = 'MODEL_MEANING_PROPOSAL' | 'REVIEW_DRAFT' | DecisionKind | 'EXPIRED' | 'REVOKED' | 'SUPERSEDED' | 'CUSTOMER_ELIGIBLE';
export type ApprovalScope = {
 originalReviewUnitId: string; originalResearchId: string; catalogKey: string; originalRecordHash: string; sourceVersion: string;
 sourceProofHash: string; reviewPacketHash: string; meaningIdentity: string; claimIdentity: string;
 approvedMeaningScope: { originalMeaning: unknown; modelMeaningProposal: unknown; approvedInterpretation: unknown; allowedConditionalApplications: unknown };
 productScope: ProductKey; relationshipScope: RelationshipCategory | null; domainScope: string[]; contextScope: readonly string[];
 evidenceScope: { fixtureId: string; evidenceIds: string[]; fullAncestryHashes: { id: string; hash: string }[]; sourceGroups: unknown; producerVersions: unknown };
 canonicalFactRootScope: string[]; ownerScope: { nodeId: string; slot: string; ownerId: string }[];
 directionScope: { nodeId: string; subject: string; recipient: string; relationId: string }[];
 temporalScope: KnowledgeBindingApprovalRequirement['temporalWitnesses']; graphVersion: string; sourceVerificationVersion: string; semanticVerificationVersion: string;
 prohibitedInferences: unknown; requiredCounterexamples: unknown; actualContextRequirements: unknown; originalPolicyReferences: string[];
 policyVersion: string; sourceFamily: string; requirementHash: string;
};
export type MeaningDecision = { decision: 'MEANING_APPROVED'; originalMeaning: unknown; modelMeaningProposal: unknown; approvedInterpretation: unknown; allowedConditionalApplications: unknown; requiredActualEvidence: string[]; requiredActualContext: unknown; counterexamples: unknown; prohibitedInferences: unknown; reviewedFields: string[]; explicitHumanDecision: true };
export type ApplicabilityDecision = { decision: 'APPLICABILITY_APPROVED'; meaningDecisionHash: string; domain: string[]; requiredSourceRoots: string[]; actualUserStateRequirements: unknown; allowedUse: unknown; disallowedUse: unknown; originalPolicyReferences: string[] };
export type OperatorDecision = { decision: 'OPERATOR_AUTHORIZED'; meaningDecisionHash: string; applicabilityDecisionHash: string };
export type CustomerDecision = { decision: 'CUSTOMER_USE_AUTHORIZED'; meaningDecisionHash: string; applicabilityDecisionHash: string; operatorDecisionHash: string; requiredCounterexamples: unknown };
export type OfficialApprovalEnvelope = ApprovalScope & {
 approvalContractVersion: typeof APPROVAL_VERSION; decisionId: string; decisionKind: DecisionKind;
 decision: MeaningDecision | ApplicabilityDecision | OperatorDecision | CustomerDecision;
 issuedAt: string; validFrom: string; validUntil: string; reviewerAuthorityRef: string; signingKeyId: string;
 signatureAlgorithm: 'Ed25519'; signature: string; revocationStateReference: string;
};
export type SignedMeaningReviewDecision = OfficialApprovalEnvelope & { decisionKind: 'HUMAN_MEANING_REVIEW_DECISION'; decision: MeaningDecision };
export type SignedApplicabilityDecision = OfficialApprovalEnvelope & { decisionKind: 'DOMAIN_APPLICABILITY_DECISION'; decision: ApplicabilityDecision };
export type SignedCustomerUseAuthorization = OfficialApprovalEnvelope & { decisionKind: 'CUSTOMER_USE_AUTHORIZATION'; decision: CustomerDecision };
export type ApprovalBundle = { meaning: SignedMeaningReviewDecision; applicability: SignedApplicabilityDecision; operator: OfficialApprovalEnvelope & { decisionKind: 'OPERATOR_AUTHORIZATION'; decision: OperatorDecision }; customer: SignedCustomerUseAuthorization };
export type ReviewerAuthority = {
 authorityRef: string; reviewerId: string; keyId: string; publicKeySpki: string; publicKeyFingerprint: string;
 allowedDecisionKinds: AuthorityKind[]; allowedProducts: ProductKey[]; allowedRelationships: (RelationshipCategory | null)[];
 allowedDomains: string[]; allowedSourceFamilies: string[]; validFrom: string; validUntil: string; revoked: boolean;
 registryVersion: string; identityBoundary: 'SYNTHETIC_TEST_ONLY' | 'EXTERNAL_IDENTITY_VERIFIED';
};
export type TrustedReviewerRegistry = { registryId: string; registryVersion: string; mode: 'SYNTHETIC_TEST_ONLY' | 'REAL_RESEARCH_READINESS'; authorities: ReviewerAuthority[] };
export type SignedRevocationRecord = {
 approvalContractVersion: typeof APPROVAL_VERSION; recordKind: 'REVOCATION'; recordId: string; revokedApprovalId: string;
 originalApprovalHash: string; revocationReason: string; revocationScope: ApprovalScope; issuedAt: string; effectiveAt: string;
 reviewerAuthorityRef: string; signingKeyId: string; signatureAlgorithm: 'Ed25519'; signature: string;
};
export type SignedSupersessionRecord = Omit<SignedRevocationRecord, 'recordKind' | 'revocationReason'> & { recordKind: 'SUPERSESSION'; replacementApprovalId: string; replacementApprovalHash: string; reason: string };
export type SignedKeyRotationRecord = {
 approvalContractVersion: typeof APPROVAL_VERSION; recordKind: 'KEY_ROTATION'; recordId: string; reviewerAuthorityRef: string;
 signingKeyId: string; signatureAlgorithm: 'Ed25519'; signature: string; issuedAt: string; effectiveAt: string;
 previousKeyFingerprint: string; replacementAuthorityRef: string; replacementKeyId: string; replacementKeyFingerprint: string; registryVersion: string;
};
export type RevocationLedger = { ledgerId: string; revision: number; previousLedgerHash: string | null; asOf: string; validUntil: string; records: (SignedRevocationRecord | SignedSupersessionRecord | SignedKeyRotationRecord)[] };
// Pins must come from a separately authenticated host procedure, never from an envelope.
export type OfflineTrustAnchor = { mode: TrustedReviewerRegistry['mode']; registryHash: string; ledgerHash: string; ledgerId: string; minimumRevision: number; registryVersion: string };
export type ApprovalReviewContext = {
 mode: TrustedReviewerRegistry['mode']; scope: ApprovalScope; requirement: KnowledgeBindingApprovalRequirement;
 originalGateResults: KnowledgeBindingGateResult[]; originalReviewState: unknown; evaluatedAt: string;
 verifyCurrentOriginals: () => boolean;
};
export type VerificationEnvironment = { registry: TrustedReviewerRegistry; ledger: RevocationLedger | null; anchor: OfflineTrustAnchor; verificationTime: string };
export type ApprovalAuditReceipt = {
 version: typeof APPROVAL_VERSION; ok: boolean; disposition: 'SIGNED_APPROVAL_CONTRACT_VERIFIED' | 'NOT_APPROVABLE_YET'; reasons: string[];
 approvalStage: ApprovalStage | 'NOT_APPROVABLE_YET';
 decisions: { id: string; hash: string; kind: string; authorityHash: string; signatureVerified: boolean; scopeVerified: boolean; reasons: string[] }[];
 scopeHash: string; requirementHash: string; registryHash: string; revocationLedgerHash: string | null; verificationTime: string;
 remainingGates: KnowledgeBindingGateResult[]; realResearchBinderGatePromoted: false; actualCustomerEligible: 0; actualBookAllocations: 0;
};
export type OfflineProviderProof = { approval: ApprovalRecord; bundleHash: string; audit: ApprovalAuditReceipt };
