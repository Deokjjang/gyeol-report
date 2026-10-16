import { compileApprovalEditorialHandoff } from '../official-approval-contract/futureActivation';
import type { ApprovalBundle, ApprovalReviewContext, VerificationEnvironment } from '../official-approval-contract/types';

/** Delegates cryptography and current revocation checks to the unchanged contract.
 * Original signatures do not approve the newly authored synthetic definitions. */
export function intakeOfficialApproval(bundle: ApprovalBundle, context: ApprovalReviewContext, environment: VerificationEnvironment) {
  const handoff = compileApprovalEditorialHandoff(bundle, context, environment);
  return { handoff, newSyntheticDefinitionCoveredByOriginalSignature: false as const,
    actualCustomerApproval: 0 as const, actualCustomerClaims: 0 as const, actualBookAllocations: 0 as const };
}
