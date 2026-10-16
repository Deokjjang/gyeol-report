import { approvalHash, exactKeys, sameApprovalValue } from './canonicalApproval';
import { findAuthority, authorityReasons, registryReasons } from './trustedReviewerRegistry';
import { verifySignedRecord } from './signatureVerification';
import { instant } from './validityWindow';
import { APPROVAL_VERSION } from './types';
import type { ApprovalBundle, ApprovalScope, VerificationEnvironment } from './types';
const BASE_RECORD_KEYS=['approvalContractVersion','recordKind','recordId','issuedAt','effectiveAt','reviewerAuthorityRef','signingKeyId','signatureAlgorithm','signature'];
export function ledgerReasons(env: VerificationEnvironment, bundle: ApprovalBundle, scope: ApprovalScope): string[] {
 try {
  const reasons=registryReasons(env), l=env.ledger, now=instant(env.verificationTime);
  if (reasons.length) return reasons;
  if (!l) return ['REVOCATION_REGISTRY_UNAVAILABLE'];
  if (!exactKeys(l,['ledgerId','revision','previousLedgerHash','asOf','validUntil','records']) || approvalHash(l)!==env.anchor.ledgerHash || l.ledgerId!==env.anchor.ledgerId || !Number.isSafeInteger(l.revision) || l.revision<env.anchor.minimumRevision || l.revision<0 || l.revision===0&&l.previousLedgerHash!==null || l.revision>0&&(typeof l.previousLedgerHash!=='string'||!/^[a-f0-9]{64}$/.test(l.previousLedgerHash)) || !Array.isArray(l.records)) return ['REVOCATION_LEDGER_PIN_OR_REVISION_MISMATCH'];
  const asOf=instant(l.asOf),until=instant(l.validUntil);
  if (now===null||asOf===null||until===null||asOf>=until||now<asOf||now>=until) return ['REVOCATION_LEDGER_STALE_OR_INVALID'];
  const seen=new Set<string>(), all=Object.values(bundle);
  for (const r of l.records) {
   const rotation=r.recordKind==='KEY_ROTATION', superseded=r.recordKind==='SUPERSESSION';
   const keys=rotation?[...BASE_RECORD_KEYS,'previousKeyFingerprint','replacementAuthorityRef','replacementKeyId','replacementKeyFingerprint','registryVersion']:[...BASE_RECORD_KEYS,'revokedApprovalId','originalApprovalHash','revocationScope',...(superseded?['replacementApprovalId','replacementApprovalHash','reason']:['revocationReason'])];
   if (!exactKeys(r,keys)||r.approvalContractVersion!==APPROVAL_VERSION||!['REVOCATION','SUPERSESSION','KEY_ROTATION'].includes(r.recordKind)||!r.recordId||seen.has(r.recordId)) { reasons.push('INVALID_OR_REPLAYED_LEDGER_RECORD'); continue; }
   seen.add(r.recordId);
   const authority=findAuthority(env,r.reviewerAuthorityRef,r.signingKeyId), issued=instant(r.issuedAt), effective=instant(r.effectiveAt), targetScope=rotation?scope:r.revocationScope;
   reasons.push(...authorityReasons(authority,r.recordKind,targetScope,r.issuedAt,env));
   if (issued===null||effective===null||issued>asOf||issued>effective) reasons.push('INVALID_LEDGER_EVENT_TIME');
   if (!authority || !verifySignedRecord(r,authority.publicKeySpki)) reasons.push('INVALID_LEDGER_SIGNATURE');
   if (rotation) {
    const replacement=findAuthority(env,r.replacementAuthorityRef,r.replacementKeyId);
    if (!authority||!replacement||r.registryVersion!==env.registry.registryVersion||replacement.revoked||authority.reviewerId!==replacement.reviewerId||authority.keyId===replacement.keyId||r.previousKeyFingerprint!==authority.publicKeyFingerprint||r.replacementKeyFingerprint!==replacement.publicKeyFingerprint||replacement.identityBoundary!==authority.identityBoundary||replacement.allowedDecisionKinds.some(v=>!authority.allowedDecisionKinds.includes(v))||replacement.allowedProducts.some(v=>!authority.allowedProducts.includes(v))||replacement.allowedRelationships.some(v=>!authority.allowedRelationships.includes(v))||replacement.allowedDomains.some(v=>!authority.allowedDomains.includes(v))||replacement.allowedSourceFamilies.some(v=>!authority.allowedSourceFamilies.includes(v))) reasons.push('INVALID_KEY_ROTATION_OR_PERMISSION_ESCALATION');
    if (effective!==null&&now>=effective&&all.some(e=>e.signingKeyId===r.signingKeyId)) reasons.push('SIGNING_KEY_SUPERSEDED_BY_ROTATION');
    if (effective!==null&&now<effective&&all.some(e=>e.signingKeyId===r.replacementKeyId)) reasons.push('ROTATION_NOT_YET_EFFECTIVE');
    if (effective!==null&&all.some(e=>e.signingKeyId===r.replacementKeyId&&(instant(e.issuedAt)===null||instant(e.issuedAt)!<effective))) reasons.push('ROTATED_KEY_USED_BEFORE_EFFECTIVE_TIME');
    if (replacement&&authority&&(effective===null||instant(replacement.validFrom)!<effective||instant(replacement.validUntil)!>instant(authority.validUntil)!)) reasons.push('INVALID_ROTATED_KEY_WINDOW');
   } else {
    if (!/^[a-f0-9]{64}$/.test(r.originalApprovalHash)||!r.revokedApprovalId||!(superseded?r.reason:r.revocationReason)) reasons.push('INVALID_REVOCATION_TARGET');
    if (superseded&&(!/^[a-f0-9]{64}$/.test(r.replacementApprovalHash)||!r.replacementApprovalId||r.replacementApprovalId===r.revokedApprovalId)) reasons.push('INVALID_SUPERSESSION_TARGET');
    const target=all.find(e=>e.decisionId===r.revokedApprovalId);
    if (target) {
     if (approvalHash(target)!==r.originalApprovalHash||!sameApprovalValue(r.revocationScope,scope)) reasons.push('REVOCATION_TARGET_HASH_OR_SCOPE_MISMATCH');
     if (effective!==null&&now>=effective) reasons.push(superseded?'APPROVAL_SUPERSEDED':'APPROVAL_REVOKED');
    }
   }
  }
  return [...new Set(reasons)].sort();
 } catch { return ['UNVERIFIABLE_REVOCATION_LEDGER']; }
}
