import { APPROVAL_VERSION, DECISION_KINDS } from './types';
import type { ApprovalAuditReceipt, ApprovalBundle, ApprovalReviewContext, VerificationEnvironment } from './types';
import { approvalHash, exactKeys } from './canonicalApproval';
import { registryReasons, findAuthority, authorityReasons } from './trustedReviewerRegistry';
import { envelopeShapeReasons, exactScopeReasons } from './approvalScope';
import { verifySignedRecord } from './signatureVerification';
import { decisionReasons } from './reviewDecision';
import { validityReasons } from './validityWindow';
import { ledgerReasons } from './revocationLedger';
import { authenticReviewContext } from './reviewContext';
import { BINDING_HARD_GATES } from '../types';
export function verifyApprovalBundle(bundle:ApprovalBundle,c:ApprovalReviewContext,env:VerificationEnvironment):ApprovalAuditReceipt {
 const receipt:ApprovalAuditReceipt={version:APPROVAL_VERSION,ok:false,disposition:'NOT_APPROVABLE_YET',approvalStage:'NOT_APPROVABLE_YET',reasons:[],decisions:[],scopeHash:'UNKNOWN',requirementHash:'UNKNOWN',registryHash:'UNVERIFIED',revocationLedgerHash:null,verificationTime:env.verificationTime,remainingGates:c.originalGateResults,realResearchBinderGatePromoted:false,actualCustomerEligible:0,actualBookAllocations:0};
 try {
  if(process.env.VERCEL)receipt.reasons.push('OFFICIAL_APPROVAL_OFFLINE_ONLY');
  if (!authenticReviewContext(c)) receipt.reasons.push('AUTHENTIC_UNCHANGED_REVIEW_CONTEXT_REQUIRED');
  if(c.mode!=='SYNTHETIC_TEST_ONLY'||env.registry.mode!==c.mode||env.anchor.mode!==c.mode)receipt.reasons.push('REAL_APPROVAL_ACTIVATION_NOT_ENABLED');
  receipt.scopeHash=approvalHash(c.scope);receipt.requirementHash=approvalHash(c.requirement);receipt.registryHash=approvalHash(env.registry);receipt.revocationLedgerHash=env.ledger?approvalHash(env.ledger):null;
  receipt.reasons.push(...registryReasons(env));
  if(!exactKeys(bundle,['meaning','applicability','operator','customer'])){receipt.reasons.push('EXACT_FOUR_DECISION_BUNDLE_REQUIRED');return finish(receipt);}
  const rows=[bundle.meaning,bundle.applicability,bundle.operator,bundle.customer];
  const shape=rows.flatMap(envelopeShapeReasons);
  if(shape.length){receipt.reasons.push(...shape);return finish(receipt);}
  const ids=rows.map(e=>e.decisionId);if(new Set(ids).size!==4)receipt.reasons.push('DECISIONS_MUST_BE_SEPARATE');
  const links={meaning:approvalHash(bundle.meaning),applicability:approvalHash(bundle.applicability),operator:approvalHash(bundle.operator)};
  for(const[i,e]of rows.entries()){
   const authority=findAuthority(env,e.reviewerAuthorityRef,e.signingKeyId),signatureVerified=!!authority&&verifySignedRecord(e,authority.publicKeySpki),scope=exactScopeReasons(e,c);
   const reasons=[...scope,...authorityReasons(authority,e.decisionKind,c.scope,e.issuedAt,env),...validityReasons(e,c.evaluatedAt,env.verificationTime),...decisionReasons(e,c.scope,links)];
   if(e.decisionKind!==DECISION_KINDS[i])reasons.push('DECISION_KIND_OR_ORDER_MISMATCH');
   if(e.revocationStateReference!==env.anchor.ledgerId)reasons.push('REVOCATION_STATE_REFERENCE_MISMATCH');
   if(!signatureVerified)reasons.push('INVALID_CRYPTOGRAPHIC_SIGNATURE');
   receipt.decisions.push({id:e.decisionId,hash:approvalHash(e),kind:e.decisionKind,authorityHash:authority?approvalHash(authority):'UNREGISTERED',signatureVerified,scopeVerified:scope.length===0,reasons});
   receipt.reasons.push(...reasons);
  }
  receipt.reasons.push(...ledgerReasons(env,bundle,c.scope));
  // Approval never manufactures calculation, ancestry, state or product support.
  const blocked=c.originalGateResults.filter(g=>g.gate!=='CUSTOMER_APPROVAL'&&!['PASS','NOT_APPLICABLE'].includes(g.state));
  receipt.reasons.push(...blocked.map(g=>'REMAINING_HARD_GATE:'+g.gate+':'+g.state));
  if(c.originalGateResults.length!==12||c.originalGateResults.some((g,i)=>g.gate!==BINDING_HARD_GATES[i]))receipt.reasons.push('ORIGINAL_TWELVE_GATES_REQUIRED');
  return finish(receipt);
 } catch {receipt.reasons.push('MALFORMED_OR_UNVERIFIABLE_APPROVAL');return finish(receipt);}
}
function finish(r:ApprovalAuditReceipt):ApprovalAuditReceipt {
 r.reasons=[...new Set(r.reasons)].sort();r.ok=r.reasons.length===0;r.disposition=r.ok?'SIGNED_APPROVAL_CONTRACT_VERIFIED':'NOT_APPROVABLE_YET';
 r.approvalStage=r.reasons.includes('APPROVAL_REVOKED')?'REVOKED':r.reasons.some(s=>['APPROVAL_SUPERSEDED','SIGNING_KEY_SUPERSEDED_BY_ROTATION'].includes(s))?'SUPERSEDED':r.reasons.includes('APPROVAL_EXPIRED')?'EXPIRED':r.ok?'CUSTOMER_USE_AUTHORIZATION':'NOT_APPROVABLE_YET';
 return r;
}
