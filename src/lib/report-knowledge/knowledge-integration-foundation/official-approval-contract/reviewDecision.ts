import { REVIEW_FIELDS } from '../semantic-domain-review-workbench/types';
import { draftSchema } from '../semantic-domain-review-workbench/reviewDraftValidator';
import { exactKeys, sameApprovalValue } from './canonicalApproval';
import type { OfficialApprovalEnvelope, ApprovalScope } from './types';
export function reviewDraftBoundary(value: unknown) {
 // Draft exports, including APPROVE_FOR_FURTHER_REVIEW, never issue authority.
 const draft=value!==null&&typeof value==='object'&&('purpose' in value || 'selectedDecision' in value || 'decisions' in value);
 return { state: draft ? 'REVIEW_DRAFT_NOT_APPROVAL' : 'EXPLICIT_SIGNED_DECISIONS_REQUIRED', automaticConversion: false, approvalRecordsIssued: 0, originalDraftSchema: draftSchema } as const;
}
export function decisionReasons(e: OfficialApprovalEnvelope, s: ApprovalScope, links: {meaning:string;applicability:string;operator:string}): string[] {
 const d=e.decision;
 switch(e.decisionKind) {
 case 'HUMAN_MEANING_REVIEW_DECISION':
  if (!exactKeys(d,['decision','originalMeaning','modelMeaningProposal','approvedInterpretation','allowedConditionalApplications','requiredActualEvidence','requiredActualContext','counterexamples','prohibitedInferences','reviewedFields','explicitHumanDecision']) || d.decision !== 'MEANING_APPROVED' || d.explicitHumanDecision!==true) return ['EXPLICIT_MEANING_DECISION_REQUIRED'];
  if (!sameApprovalValue(d.originalMeaning,s.approvedMeaningScope.originalMeaning) || !sameApprovalValue(d.modelMeaningProposal,s.approvedMeaningScope.modelMeaningProposal) || !sameApprovalValue(d.approvedInterpretation,s.approvedMeaningScope.approvedInterpretation) || !sameApprovalValue(d.allowedConditionalApplications,s.approvedMeaningScope.allowedConditionalApplications) || !sameApprovalValue(d.requiredActualEvidence,s.evidenceScope.evidenceIds) || !sameApprovalValue(d.requiredActualContext,s.actualContextRequirements) || !sameApprovalValue(d.counterexamples,s.requiredCounterexamples) || !sameApprovalValue(d.prohibitedInferences,s.prohibitedInferences) || !sameApprovalValue(d.reviewedFields,REVIEW_FIELDS)) return ['MEANING_REVIEW_FIELDS_OR_CONDITIONS_MISMATCH'];
  return [];
 case 'DOMAIN_APPLICABILITY_DECISION':
  if (!exactKeys(d,['decision','meaningDecisionHash','domain','requiredSourceRoots','actualUserStateRequirements','allowedUse','disallowedUse','originalPolicyReferences']) || d.decision !== 'APPLICABILITY_APPROVED' || d.meaningDecisionHash!==links.meaning) return ['SEPARATE_APPLICABILITY_DECISION_REQUIRED'];
  return sameApprovalValue(d.domain,s.domainScope)&&sameApprovalValue(d.requiredSourceRoots,s.canonicalFactRootScope)&&sameApprovalValue(d.actualUserStateRequirements,s.actualContextRequirements)&&sameApprovalValue(d.allowedUse,s.approvedMeaningScope.allowedConditionalApplications)&&sameApprovalValue(d.disallowedUse,s.prohibitedInferences)&&sameApprovalValue(d.originalPolicyReferences,s.originalPolicyReferences)?[]:['APPLICABILITY_SCOPE_OR_POLICY_CHANGED'];
 case 'OPERATOR_AUTHORIZATION':
  return exactKeys(d,['decision','meaningDecisionHash','applicabilityDecisionHash'])&&d.decision==='OPERATOR_AUTHORIZED'&&d.meaningDecisionHash===links.meaning&&d.applicabilityDecisionHash===links.applicability?[]:['SEPARATE_OPERATOR_AUTHORIZATION_REQUIRED'];
 case 'CUSTOMER_USE_AUTHORIZATION':
  return exactKeys(d,['decision','meaningDecisionHash','applicabilityDecisionHash','operatorDecisionHash','requiredCounterexamples'])&&d.decision==='CUSTOMER_USE_AUTHORIZED'&&d.meaningDecisionHash===links.meaning&&d.applicabilityDecisionHash===links.applicability&&d.operatorDecisionHash===links.operator&&sameApprovalValue(d.requiredCounterexamples,s.requiredCounterexamples)?[]:['SEPARATE_CUSTOMER_AUTHORIZATION_REQUIRED'];
 }
}
