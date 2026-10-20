export const FUTURE_ACTIVATION_HANDOFF = {
 version:'official-approval-activation-handoff-v1',
 current:{approvalContract:'OFFLINE_IMPLEMENTED',binder:'BINDER_REAL_APPROVAL_INTEGRATION_PENDING',planner:'PLANNER_REAL_APPROVAL_INTEGRATION_PENDING',assignment:'CUSTOMER_ASSIGNMENT_NOT_ENABLED',actualOperatorApproved:0,actualCustomerApproved:0},
 requiredExplicitSteps:[
  'Authenticate the real human reviewer and independently attest ownership of an externally managed Ed25519 public key; no synthetic keys.',
  'Establish externally authenticated, versioned registry and current revocation-ledger hash pins, revision floor, freshness, role changes and rotation delivery; unavailability blocks use.',
  'Complete human reading and separately sign exact meaning, applicability, operator authorization and customer use decisions. Draft exports never convert automatically.',
  'Recheck original SourceReader proof, record/source/policy versions, full actual ancestry and exact evidence/owner/direction/temporal/context scopes; changes require new review and signature.',
  'In a separately authorized task integrate verified decisions with Binder INTERPRETATION_REVIEW and CUSTOMER_APPROVAL while preserving the other ten mandatory Gates.',
  'Separately integrate Planner real approval and proven Reader/Scheduler bridges, meaning identity, reuse and actual display dependencies; retain all withheld questions.',
  'Only after explicit customer-runtime activation and end-to-end publication/reopen regression may a customer assignment occur.'
 ],
 editorialInputContract:{approvedState:'SIGNED_APPROVAL_CONTRACT_VERIFIED',requiredReceipts:['canonical signed envelope hashes','trusted registry and current ledger hashes','exact source/meaning/claim/product/relationship/evidence/root/owner/direction/time scope','validity and revocation disposition','unchanged native twelve-Gate receipt','Planner validated typed Editorial Handoff'],metadataAloneIsCustomerAuthorization:false,proseEngineStarted:false},
 activationPrerequisites:[
  {id:'REAL_IDENTITY_AND_EXTERNAL_KEYS',state:'PENDING',automatic:false},
  {id:'AUTHENTICATED_CURRENT_TRUST_AND_REVOCATION_PINS',state:'PENDING',automatic:false},
  {id:'FOUR_SEPARATE_HUMAN_DECISIONS',state:'PENDING',automatic:false},
  {id:'BINDER_REAL_GATE_INTEGRATION',state:'NOT_ENABLED',automatic:false},
  {id:'PLANNER_BRIDGE_AND_REAL_APPROVAL_INTEGRATION',state:'NOT_ENABLED',automatic:false},
  {id:'CUSTOMER_RUNTIME_ACTIVATION',state:'NOT_ENABLED',automatic:false}
 ],
 realRegistryEnrollmentImplemented:false,realSigningCommandProvided:false,customerRuntimeConnected:false,policyChangesAllowed:false
} as const;
import type { ApprovalAuditReceipt, ApprovalBundle, ApprovalReviewContext, VerificationEnvironment } from './types';
import { verifyApprovalBundle } from './approvalEnvelope';
import { jsonSnapshot } from './canonicalApproval';


export type OfficialApprovalEditorialHandoff = {
 version:'official-approval-editorial-handoff-v1'; contractDisposition:ApprovalAuditReceipt['disposition'];
 signedContractReceipt:ApprovalAuditReceipt; sourceMeaningAndScope:ApprovalReviewContext['scope']|null;
 binderRealApprovalIntegration:'PENDING'; plannerRealApprovalIntegration:'PENDING';
 customerAssignmentEnabled:false; customerUseAuthorized:false; actualCustomerClaims:0; actualBookAllocations:0;
 activationPrerequisites:typeof FUTURE_ACTIVATION_HANDOFF.activationPrerequisites;
};
export function compileApprovalEditorialHandoff(bundle:ApprovalBundle,context:ApprovalReviewContext,environment:VerificationEnvironment):OfficialApprovalEditorialHandoff {
 const receipt=verifyApprovalBundle(bundle,context,environment);
 return {version:'official-approval-editorial-handoff-v1',contractDisposition:receipt.disposition,signedContractReceipt:receipt,sourceMeaningAndScope:receipt.ok?jsonSnapshot(context.scope):null,binderRealApprovalIntegration:'PENDING',plannerRealApprovalIntegration:'PENDING',customerAssignmentEnabled:false,customerUseAuthorized:false,actualCustomerClaims:0,actualBookAllocations:0,activationPrerequisites:FUTURE_ACTIVATION_HANDOFF.activationPrerequisites};
}
