import { approvalHash, exactKeys, canonicalApproval } from './canonicalApproval';
import { publicKeyFingerprint } from './signatureVerification';
import { instant } from './validityWindow';
import { DECISION_KINDS } from './types';
import type { ApprovalScope, AuthorityKind, ReviewerAuthority, VerificationEnvironment } from './types';
const REGISTRY_KEYS = ['registryId','registryVersion','mode','authorities'];
const AUTHORITY_KEYS = ['authorityRef','reviewerId','keyId','publicKeySpki','publicKeyFingerprint','allowedDecisionKinds','allowedProducts','allowedRelationships','allowedDomains','allowedSourceFamilies','validFrom','validUntil','revoked','registryVersion','identityBoundary'];
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.length > 0 && v.every(s => typeof s === 'string' && !!s && s !== '*' && s !== 'UNKNOWN') && new Set(v).size === v.length;
// A signed authority reference commits to identity, public key, permissions,
// window and registry version. Remapping a friendly ID cannot reattribute a
// prior signature or retroactively grant a role that was not signed.
export function reviewerAuthorityReference(authority: ReviewerAuthority): string {
 const {authorityRef:omitted,...snapshot}=authority;void omitted;
 return 'official-reviewer-authority-v1:'+approvalHash(snapshot);
}
export function registryReasons(env: VerificationEnvironment): string[] {
 try {
  const r = env.registry, a = env.anchor;
  canonicalApproval(r); canonicalApproval(a);
  if (!exactKeys(a,['mode','registryHash','ledgerHash','ledgerId','minimumRevision','registryVersion']) || !exactKeys(r,REGISTRY_KEYS) || !r.registryId || !r.registryVersion || !['SYNTHETIC_TEST_ONLY','REAL_RESEARCH_READINESS'].includes(r.mode) || a.mode !== r.mode || a.registryVersion !== r.registryVersion || approvalHash(r) !== a.registryHash || !Number.isSafeInteger(a.minimumRevision) || a.minimumRevision < 0) return ['TRUSTED_REGISTRY_PIN_MISMATCH'];
  if (!Array.isArray(r.authorities)) return ['INVALID_TRUSTED_REGISTRY'];
  const keys = new Set<string>(), refs = new Set<string>(), fingerprints = new Set<string>();
  for (const k of r.authorities) {
   if (!exactKeys(k,AUTHORITY_KEYS) || typeof k.authorityRef !== 'string' || !k.authorityRef || typeof k.reviewerId !== 'string' || !k.reviewerId || typeof k.keyId !== 'string' || !k.keyId || typeof k.revoked !== 'boolean' || k.registryVersion !== r.registryVersion || keys.has(k.keyId) || refs.has(k.authorityRef) || fingerprints.has(k.publicKeyFingerprint)) return ['INVALID_OR_DUPLICATE_AUTHORITY'];
   if(k.authorityRef!==reviewerAuthorityReference(k))return ['REVIEWER_AUTHORITY_SNAPSHOT_CHANGED_REAPPROVAL_REQUIRED'];
   if (publicKeyFingerprint(k.publicKeySpki) !== k.publicKeyFingerprint || !strings(k.allowedDecisionKinds) || k.allowedDecisionKinds.some(d => ![...DECISION_KINDS,'REVOCATION','SUPERSESSION','KEY_ROTATION'].includes(d)) || !strings(k.allowedProducts) || !strings(k.allowedDomains) || !strings(k.allowedSourceFamilies) || !Array.isArray(k.allowedRelationships) || !k.allowedRelationships.length || k.allowedRelationships.some(v=>v!==null&&(typeof v!=='string'||!v||String(v)==='*')) || new Set(k.allowedRelationships).size!==k.allowedRelationships.length) return ['INVALID_AUTHORITY_KEY_OR_SCOPE'];
   if (instant(k.validFrom) === null || instant(k.validUntil) === null || instant(k.validFrom)! >= instant(k.validUntil)!) return ['INVALID_AUTHORITY_WINDOW'];
   if (r.mode === 'REAL_RESEARCH_READINESS' && k.identityBoundary !== 'EXTERNAL_IDENTITY_VERIFIED' || r.mode === 'SYNTHETIC_TEST_ONLY' && (k.identityBoundary !== 'SYNTHETIC_TEST_ONLY' || !k.reviewerId.startsWith('synthetic:') || !k.keyId.startsWith('synthetic:'))) return ['SYNTHETIC_KEY_CANNOT_BECOME_REAL_TRUST'];
   keys.add(k.keyId); refs.add(k.authorityRef); fingerprints.add(k.publicKeyFingerprint);
  }
  return [];
 } catch { return ['UNVERIFIABLE_TRUSTED_REGISTRY']; }
}
export function authorityReasons(authority: ReviewerAuthority | undefined, kind: AuthorityKind, scope: ApprovalScope, issuedAt: string, env: VerificationEnvironment): string[] {
 if (!authority) return ['UNREGISTERED_REVIEWER_OR_KEY'];
 const k = authority, reasons: string[] = [];
 if (k.revoked) reasons.push('SIGNING_KEY_REVOKED');
 if (!k.allowedDecisionKinds.includes(kind)) reasons.push('REVIEWER_DECISION_ROLE_DENIED');
 if (!k.allowedProducts.includes(scope.productScope)) reasons.push('REVIEWER_PRODUCT_DENIED');
 if (!k.allowedRelationships.includes(scope.relationshipScope)) reasons.push('REVIEWER_RELATIONSHIP_DENIED');
 if (scope.domainScope.some(d => !k.allowedDomains.includes(d))) reasons.push('REVIEWER_DOMAIN_DENIED');
 if (!k.allowedSourceFamilies.includes(scope.sourceFamily)) reasons.push('REVIEWER_SOURCE_FAMILY_DENIED');
 const start=instant(k.validFrom),end=instant(k.validUntil),issued=instant(issuedAt),now=instant(env.verificationTime);
 if ([start,end,issued,now].some(v=>v===null) || start! >= end! || issued! < start! || issued! >= end! || now! < start! || now! >= end!) reasons.push('REVIEWER_AUTHORITY_EXPIRED_OR_NOT_YET_VALID');
 return reasons;
}
export function findAuthority(env: VerificationEnvironment, ref: string, keyId: string): ReviewerAuthority | undefined {
 return env.registry.authorities.find(k=>k.authorityRef===ref && k.keyId===keyId);
}
