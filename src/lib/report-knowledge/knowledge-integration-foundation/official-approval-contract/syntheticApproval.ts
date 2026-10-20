import { generateKeyPairSync, sign, type KeyObject } from 'node:crypto';
import { REVIEW_FIELDS } from '../semantic-domain-review-workbench/types';
import { APPROVAL_VERSION, DECISION_KINDS } from './types';
import type { ApprovalScope, ApprovalBundle, OfficialApprovalEnvelope, ReviewerAuthority, VerificationEnvironment, RevocationLedger, SignedRevocationRecord, SignedSupersessionRecord, SignedKeyRotationRecord } from './types';
import { prepareSyntheticReviewContexts } from './reviewContext';
import { approvalHash, signedPayload, jsonSnapshot } from './canonicalApproval';
import { publicKeyFingerprint } from './signatureVerification';
import { createOfflineApprovalProvider } from './approvalProvider';
import { reviewerAuthorityReference } from './trustedReviewerRegistry';
const ISSUED='2026-01-01T00:00:00+09:00',UNTIL='2027-01-01T00:00:00+09:00';
export async function syntheticApprovalFixture(root:string,engine='comprehensive',display=false,negative?:Parameters<typeof prepareSyntheticReviewContexts>[3]) {
 if(process.env.VERCEL)throw Error('OFFICIAL_APPROVAL_OFFLINE_ONLY');
 const {native,contexts}=await prepareSyntheticReviewContexts(root,engine,display,negative);
 const keys=new Map<string,KeyObject>(),authorities:ReviewerAuthority[]=DECISION_KINDS.map((kind,i):ReviewerAuthority=>{
  const pair=generateKeyPairSync('ed25519'),keyId='synthetic:official:key:'+i,spki=Buffer.from(pair.publicKey.export({type:'spki',format:'der'})).toString('base64');keys.set(keyId,pair.privateKey);
  return {authorityRef:'synthetic:official:authority:'+i,reviewerId:'synthetic:official:reviewer:'+i,keyId,publicKeySpki:spki,publicKeyFingerprint:publicKeyFingerprint(spki),allowedDecisionKinds:[kind,'REVOCATION','SUPERSESSION','KEY_ROTATION'],allowedProducts:[native.request.product],allowedRelationships:[native.request.relationship],allowedDomains:['SYNTHETIC_ONLY'],allowedSourceFamilies:[...new Set(contexts.map(c=>c.scope.sourceFamily))],validFrom:ISSUED,validUntil:UNTIL,revoked:false,registryVersion:'synthetic:official:registry-v1',identityBoundary:'SYNTHETIC_TEST_ONLY'};
 }).map(authority=>({...authority,authorityRef:reviewerAuthorityReference(authority)}));
 const env:VerificationEnvironment={registry:{registryId:'synthetic:official:registry',registryVersion:'synthetic:official:registry-v1',mode:'SYNTHETIC_TEST_ONLY',authorities},ledger:{ledgerId:'synthetic:official:revocations',revision:0,previousLedgerHash:null,asOf:native.request.graph.context.evaluatedAt,validUntil:UNTIL,records:[]},anchor:{mode:'SYNTHETIC_TEST_ONLY',registryHash:'',ledgerHash:'',ledgerId:'synthetic:official:revocations',minimumRevision:0,registryVersion:'synthetic:official:registry-v1'},verificationTime:native.request.graph.context.evaluatedAt};
 const repin=()=>{env.anchor.registryHash=approvalHash(env.registry);env.anchor.ledgerHash=env.ledger?approvalHash(env.ledger):'UNAVAILABLE';env.anchor.minimumRevision=env.ledger?.revision??0;};repin();
 function signRecord<T extends {signingKeyId:string;signature:string}>(record:T):T {
  const key=keys.get(record.signingKeyId);if(!key)throw Error('SYNTHETIC_PROCESS_LOCAL_KEY_NOT_FOUND');
  return{...record,signature:sign(null,signedPayload(record),key).toString('base64')};
 }
 function envelope(scope:ApprovalScope,i:number,decision:OfficialApprovalEnvelope['decision']):OfficialApprovalEnvelope {
  return signRecord({...jsonSnapshot(scope),approvalContractVersion:APPROVAL_VERSION,decisionId:'synthetic:official:decision:'+approvalHash([scope,i]),decisionKind:DECISION_KINDS[i],decision,issuedAt:ISSUED,validFrom:ISSUED,validUntil:UNTIL,reviewerAuthorityRef:authorities[i].authorityRef,signingKeyId:authorities[i].keyId,signatureAlgorithm:'Ed25519',signature:'',revocationStateReference:env.anchor.ledgerId});
 }
 const bundles:ApprovalBundle[]=contexts.map(c=>{
  const s=c.scope,meaning=envelope(s,0,{decision:'MEANING_APPROVED',originalMeaning:s.approvedMeaningScope.originalMeaning,modelMeaningProposal:s.approvedMeaningScope.modelMeaningProposal,approvedInterpretation:s.approvedMeaningScope.approvedInterpretation,allowedConditionalApplications:s.approvedMeaningScope.allowedConditionalApplications,requiredActualEvidence:s.evidenceScope.evidenceIds,requiredActualContext:s.actualContextRequirements,counterexamples:s.requiredCounterexamples,prohibitedInferences:s.prohibitedInferences,reviewedFields:[...REVIEW_FIELDS],explicitHumanDecision:true});
  const applicability=envelope(s,1,{decision:'APPLICABILITY_APPROVED',meaningDecisionHash:approvalHash(meaning),domain:s.domainScope,requiredSourceRoots:s.canonicalFactRootScope,actualUserStateRequirements:s.actualContextRequirements,allowedUse:s.approvedMeaningScope.allowedConditionalApplications,disallowedUse:s.prohibitedInferences,originalPolicyReferences:s.originalPolicyReferences});
  const operator=envelope(s,2,{decision:'OPERATOR_AUTHORIZED',meaningDecisionHash:approvalHash(meaning),applicabilityDecisionHash:approvalHash(applicability)});
  const customer=envelope(s,3,{decision:'CUSTOMER_USE_AUTHORIZED',meaningDecisionHash:approvalHash(meaning),applicabilityDecisionHash:approvalHash(applicability),operatorDecisionHash:approvalHash(operator),requiredCounterexamples:s.requiredCounterexamples});
  return{meaning,applicability,operator,customer} as ApprovalBundle;
 });
 const provider=createOfflineApprovalProvider(contexts.map((context,i)=>({context,bundle:bundles[i]})),()=>env);
 function advanceLedger(record:RevocationLedger['records'][number]){
  if(!env.ledger)throw Error('SYNTHETIC_LEDGER_UNAVAILABLE');const previousLedgerHash=approvalHash(env.ledger);
  env.ledger={...env.ledger,revision:env.ledger.revision+1,previousLedgerHash,records:[...env.ledger.records,record]};repin();
 }
 function revoke(i=0):SignedRevocationRecord {
  const target=bundles[i].customer;
  const r=signRecord({approvalContractVersion:APPROVAL_VERSION,recordKind:'REVOCATION',recordId:'synthetic:official:revoke:'+target.decisionId,revokedApprovalId:target.decisionId,originalApprovalHash:approvalHash(target),revocationReason:'SYNTHETIC_TEST_REVOCATION',revocationScope:contexts[i].scope,issuedAt:env.verificationTime,effectiveAt:env.verificationTime,reviewerAuthorityRef:authorities[3].authorityRef,signingKeyId:authorities[3].keyId,signatureAlgorithm:'Ed25519',signature:''} satisfies SignedRevocationRecord);advanceLedger(r);return r;
 }
 function supersede(i=0):SignedSupersessionRecord {
  const target=bundles[i].customer;
  const r=signRecord({approvalContractVersion:APPROVAL_VERSION,recordKind:'SUPERSESSION',recordId:'synthetic:official:supersede:'+target.decisionId,revokedApprovalId:target.decisionId,originalApprovalHash:approvalHash(target),revocationScope:contexts[i].scope,replacementApprovalId:'synthetic:official:replacement',replacementApprovalHash:approvalHash('synthetic:official:replacement'),reason:'SYNTHETIC_TEST_REAPPROVAL_REQUIRED',issuedAt:env.verificationTime,effectiveAt:env.verificationTime,reviewerAuthorityRef:authorities[3].authorityRef,signingKeyId:authorities[3].keyId,signatureAlgorithm:'Ed25519',signature:''} satisfies SignedSupersessionRecord);advanceLedger(r);return r;
 }
 function rotate(i=3):SignedKeyRotationRecord {
  const old=env.registry.authorities[i],pair=generateKeyPairSync('ed25519'),keyId='synthetic:official:rotated:'+i,publicKeySpki=Buffer.from(pair.publicKey.export({type:'spki',format:'der'})).toString('base64');keys.set(keyId,pair.privateKey);
  const replacement={...jsonSnapshot(old),authorityRef:'synthetic:official:rotated-authority:'+i,keyId,publicKeySpki,publicKeyFingerprint:publicKeyFingerprint(publicKeySpki),validFrom:env.verificationTime};replacement.authorityRef=reviewerAuthorityReference(replacement);env.registry.authorities.push(replacement);
  const r=signRecord({approvalContractVersion:APPROVAL_VERSION,recordKind:'KEY_ROTATION',recordId:'synthetic:official:rotation:'+i,issuedAt:env.verificationTime,effectiveAt:env.verificationTime,reviewerAuthorityRef:old.authorityRef,signingKeyId:old.keyId,signatureAlgorithm:'Ed25519',signature:'',previousKeyFingerprint:old.publicKeyFingerprint,replacementAuthorityRef:replacement.authorityRef,replacementKeyId:replacement.keyId,replacementKeyFingerprint:replacement.publicKeyFingerprint,registryVersion:env.registry.registryVersion} satisfies SignedKeyRotationRecord);advanceLedger(r);return r;
 }
 // No private key material is returned, serialized, logged, or persisted. Signing here
 // is only for the isolated, explicitly synthetic security test harness.
 return{native,contexts,bundles,provider,env,signRecord,repin,revoke,supersede,rotate,advanceLedger};
}
