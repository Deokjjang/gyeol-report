import type { ApprovalScope, OfficialApprovalEnvelope, ApprovalReviewContext } from './types';
import { approvalHash, sameApprovalValue, exactKeys, canonicalApproval } from './canonicalApproval';
import { APPROVAL_VERSION, DECISION_KINDS } from './types';
export const SCOPE_KEYS = ['originalReviewUnitId','originalResearchId','catalogKey','originalRecordHash','sourceVersion','sourceProofHash','reviewPacketHash','meaningIdentity','claimIdentity','approvedMeaningScope','productScope','relationshipScope','domainScope','contextScope','evidenceScope','canonicalFactRootScope','ownerScope','directionScope','temporalScope','graphVersion','sourceVerificationVersion','semanticVerificationVersion','prohibitedInferences','requiredCounterexamples','actualContextRequirements','originalPolicyReferences','policyVersion','sourceFamily','requirementHash'] as const;
export const ENVELOPE_KEYS = [...SCOPE_KEYS,'approvalContractVersion','decisionId','decisionKind','decision','issuedAt','validFrom','validUntil','reviewerAuthorityRef','signingKeyId','signatureAlgorithm','signature','revocationStateReference'];
export function scopeOf(e: OfficialApprovalEnvelope): ApprovalScope { return Object.fromEntries(SCOPE_KEYS.map(k=>[k,e[k]])) as ApprovalScope; }
export function envelopeShapeReasons(value: unknown): string[] {
 try {
  canonicalApproval(value);
  if (!exactKeys(value,ENVELOPE_KEYS) || value.approvalContractVersion !== APPROVAL_VERSION || !DECISION_KINDS.includes(value.decisionKind as never)) return ['OFFICIAL_ENVELOPE_REQUIRED_NOT_REVIEW_DRAFT'];
  for (const k of ['decisionId','issuedAt','validFrom','validUntil','reviewerAuthorityRef','signingKeyId','revocationStateReference']) if (typeof value[k] !== 'string' || !value[k]) return ['INVALID_ENVELOPE_FIELD:'+k];
  if (value.signatureAlgorithm !== 'Ed25519' || typeof value.signature !== 'string' || !value.signature) return ['UNSIGNED_OR_UNSUPPORTED_ALGORITHM'];
  return [];
 } catch { return ['NON_CANONICAL_ENVELOPE']; }
}
export function exactScopeReasons(e: OfficialApprovalEnvelope, c: ApprovalReviewContext): string[] {
 const reasons: string[] = [];
 for (const k of SCOPE_KEYS) if (!sameApprovalValue(e[k],c.scope[k])) reasons.push('EXACT_SCOPE_MISMATCH:'+k);
 if (c.scope.requirementHash !== approvalHash(c.requirement)) reasons.push('APPROVAL_REQUIREMENT_HASH_MISMATCH');
 if (c.requirement.evaluatedAt !== c.evaluatedAt) reasons.push('ORIGINAL_EVALUATED_AT_CHANGED');
 const required=['originalReviewUnitId','originalResearchId','catalogKey','sourceVersion','meaningIdentity','claimIdentity','graphVersion','sourceVerificationVersion','semanticVerificationVersion','policyVersion','sourceFamily'] as const;
 if (required.some(k=>!c.scope[k] || ['UNKNOWN','NOT_APPROVABLE_YET'].includes(c.scope[k])) || !c.scope.domainScope.length) reasons.push('UNKNOWN_SCOPE_NOT_APPROVABLE_YET');
 if (['originalRecordHash','sourceProofHash','reviewPacketHash','requirementHash'].some(k=>!/^[a-f0-9]{64}$/.test(String(c.scope[k as keyof ApprovalScope])))) reasons.push('INVALID_SOURCE_OR_REVIEW_HASH');
 return reasons;
}
