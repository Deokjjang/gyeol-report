import { approvalHash, jsonSnapshot } from './canonicalApproval';
import { verifyApprovalBundle } from './approvalEnvelope';
import { syntheticApprovalFixture } from './syntheticApproval';
import type { ApprovalBundle, OfficialApprovalEnvelope, VerificationEnvironment, ApprovalReviewContext } from './types';
export type SecurityCase = {name:string;rejected:boolean;reasons:string[]};
type Fixture=Awaited<ReturnType<typeof syntheticApprovalFixture>>;
export async function runNegativeSecurityTests(root:string,provided?:Fixture):Promise<SecurityCase[]> {
 const f=provided??await syntheticApprovalFixture(root),results:SecurityCase[]=[];
 const exercise=(name:string,change:(b:ApprovalBundle,e:VerificationEnvironment)=>void,resign=false)=>{
  const bundle=jsonSnapshot(f.bundles[0]),env=jsonSnapshot(f.env);change(bundle,env);
  if(resign)bundle.meaning=f.signRecord(bundle.meaning);
  const r=verifyApprovalBundle(bundle,f.contexts[0],env);results.push({name,rejected:!r.ok,reasons:r.reasons});
 };
 exercise('01 missing signature',b=>{b.meaning.signature='';});
 exercise('02 invalid signature',b=>{b.meaning.signature=Buffer.alloc(64).toString('base64');});
 exercise('03 signature by different registered key',b=>{b.meaning.signature=f.signRecord({...b.meaning,signingKeyId:f.env.registry.authorities[1].keyId}).signature;});
 exercise('04 unregistered public key',(_,e)=>{e.registry.authorities=e.registry.authorities.slice(1);e.anchor.registryHash=approvalHash(e.registry);});
 exercise('05 revoked signing key',(_,e)=>{e.registry.authorities[0].revoked=true;e.anchor.registryHash=approvalHash(e.registry);});
 exercise('06 expired reviewer authority',(_,e)=>{e.registry.authorities[0].validUntil='2026-10-01T00:00:00+09:00';e.anchor.registryHash=approvalHash(e.registry);});
 exercise('07 wrong reviewer role',(_,e)=>{e.registry.authorities[0].allowedDecisionKinds=['REVOCATION'];e.anchor.registryHash=approvalHash(e.registry);});
 const fields:[string,(e:OfficialApprovalEnvelope)=>void][]=[
  ['08 product scope',e=>{e.productScope='career_money_study';}],['09 relationship scope',e=>{e.relationshipScope='businessPartner';}],
  ['10 source hash',e=>{e.originalRecordHash='0'.repeat(64);}],['11 source version',e=>{e.sourceVersion='synthetic:other-version';}],
  ['12 graph version',e=>{e.graphVersion='synthetic:other-graph';}],['13 evidence ID',e=>{e.evidenceScope.evidenceIds=['synthetic:other-evidence'];}],
  ['14 canonical root',e=>{e.canonicalFactRootScope=['synthetic:other-root'];}],['15 meaning identity',e=>{e.meaningIdentity='synthetic:other-meaning';}],
  ['16 claim identity',e=>{e.claimIdentity='synthetic:other-claim';}],['17 counterexample',e=>{e.requiredCounterexamples=['synthetic:unreviewed'];}],
  ['18 prohibited inference removal',e=>{e.prohibitedInferences=[];}],['19 direction',e=>{e.directionScope=[{nodeId:'synthetic:node',subject:'synthetic:B',recipient:'synthetic:A',relationId:'synthetic:reverse'}];}],
  ['20 temporal expansion',e=>{e.temporalScope=[{scope:'annual',start:'1900-01-01T00:00:00+09:00',endExclusive:'2100-01-01T00:00:00+09:00',certainty:'confirmed',compatibleCombination:true,originalBounds:{syntheticOnly:true}}];}],
  ['21 context expansion',e=>{e.contextScope=[...e.contextScope,'synthetic:unreviewed-domain'];}],['22 actual owner swap',e=>{e.ownerScope=e.ownerScope.map(v=>({...v,ownerId:'synthetic:other-owner'}));}],
  ['23 different fixture replay',e=>{e.evidenceScope.fixtureId='synthetic:other-fixture';}],['24 review packet hash',e=>{e.reviewPacketHash='0'.repeat(64);}],
  ['31 another source group',e=>{e.evidenceScope.sourceGroups={syntheticOnly:true,group:'other'};}],
  ['source proof hash',e=>{e.sourceProofHash='0'.repeat(64);}],['source verification version',e=>{e.sourceVerificationVersion='other';}],['semantic verification version',e=>{e.semanticVerificationVersion='other';}],
  ['policy version',e=>{e.policyVersion='other';}],['full ancestry omission',e=>{e.evidenceScope.fullAncestryHashes=[];}],['producer version',e=>{e.evidenceScope.producerVersions=[];}],
  ['original material identity',e=>{e.originalResearchId='synthetic:other-material';}],['review unit',e=>{e.originalReviewUnitId='synthetic:other-unit';}],['catalog key',e=>{e.catalogKey='kc:v1:other';}],
  ['approved meaning change',e=>{e.approvedMeaningScope.approvedInterpretation='synthetic:expanded-meaning';}],['domain expansion',e=>{e.domainScope=['synthetic:other-domain'];}],
  ['actual user requirements omission',e=>{e.actualContextRequirements={};}],['original policy reference omission',e=>{e.originalPolicyReferences=['synthetic:invented-policy'];}]
 ];
 for(const[name,change]of fields)exercise(name,b=>change(b.meaning),true);
 exercise('25 review draft disguised as approval',b=>{b.meaning={purpose:'REVIEW_DRAFT_NOT_APPROVAL',selectedDecision:'APPROVE_FOR_FURTHER_REVIEW'} as unknown as ApprovalBundle['meaning'];});
 exercise('26 further review decision promoted',b=>{b.meaning.decision.decision='APPROVE_FOR_FURTHER_REVIEW' as never;},true);
 exercise('27 use before validity begins',b=>{b.meaning.validFrom='2026-11-01T00:00:00+09:00';},true);
 exercise('28 expired approval',b=>{b.meaning.validUntil='2026-10-01T00:00:00+09:00';},true);
 exercise('36 synthetic key promoted to real trust',(_,e)=>{e.registry.mode='REAL_RESEARCH_READINESS';e.anchor.mode='REAL_RESEARCH_READINESS';e.anchor.registryHash=approvalHash(e.registry);});
 exercise('missing applicability decision',b=>{b.applicability=undefined as never;});
 exercise('missing operator authorization',b=>{b.operator=undefined as never;});
 exercise('missing separate customer authorization',b=>{b.customer=b.meaning as unknown as ApprovalBundle['customer'];});
 exercise('unreviewed required fields',b=>{b.meaning.decision.reviewedFields=['ORIGINAL'];},true);
 exercise('algorithm downgrade',b=>{b.meaning.signatureAlgorithm='RSA-SHA256' as never;});
 exercise('approval contract downgrade',b=>{b.meaning.approvalContractVersion='v0' as never;});
 exercise('unknown unsigned envelope field',b=>{Object.assign(b.meaning,{wildcard:true});});
 exercise('reversed validity',b=>{b.meaning.validUntil='2025-01-01T00:00:00+09:00';},true);
 exercise('invalid date normalization',b=>{b.meaning.validUntil='2026-02-30T00:00:00+09:00';},true);
 exercise('future issuance',b=>{b.meaning.issuedAt='2026-11-01T00:00:00+09:00';},true);
 exercise('revocation registry unavailable',(_,e)=>{e.ledger=null;});
 exercise('stale revocation registry',(_,e)=>{e.ledger!.validUntil=e.verificationTime;e.anchor.ledgerHash=approvalHash(e.ledger);});
 exercise('revocation registry rollback',(_,e)=>{e.anchor.minimumRevision=1;});
 exercise('unverified trust registry',(_,e)=>{e.anchor.registryHash='0'.repeat(64);});
 exercise('current product authority removed',(_,e)=>{e.registry.authorities[0].allowedProducts=['annual_fortune'];e.anchor.registryHash=approvalHash(e.registry);});
 exercise('current domain authority removed',(_,e)=>{e.registry.authorities[0].allowedDomains=['other'];e.anchor.registryHash=approvalHash(e.registry);});
 exercise('current source authority removed',(_,e)=>{e.registry.authorities[0].allowedSourceFamilies=['other'];e.anchor.registryHash=approvalHash(e.registry);});
 exercise('public key fingerprint changed',(_,e)=>{e.registry.authorities[0].publicKeyFingerprint='0'.repeat(64);e.anchor.registryHash=approvalHash(e.registry);});
 exercise('duplicate registry key',(_,e)=>{e.registry.authorities.push(e.registry.authorities[0]);e.anchor.registryHash=approvalHash(e.registry);});
 exercise('key ID replay',b=>{b.meaning.signingKeyId=f.env.registry.authorities[1].keyId;},true);
 exercise('authority reference replay',b=>{b.meaning.reviewerAuthorityRef=f.env.registry.authorities[1].authorityRef;},true);
 exercise('invalid verification date',(_,e)=>{e.verificationTime='invalid';});
 exercise('verification before evaluatedAt',(_,e)=>{e.verificationTime='2026-10-01T00:00:00+09:00';});
 // Contexts are authenticated, sealed process-local observations, not JSON claims.
 const forged={...f.contexts[0],originalGateResults:f.contexts[0].originalGateResults.map(g=>({...g,state:'PASS' as const}))};
 let r=verifyApprovalBundle(f.bundles[0],forged,f.env);results.push({name:'39 direct gate result manipulation',rejected:!r.ok,reasons:r.reasons});
 r=verifyApprovalBundle(f.bundles[0],{...f.contexts[0],mode:'REAL_RESEARCH_READINESS'} as ApprovalReviewContext,f.env);results.push({name:'actual research context forged',rejected:!r.ok,reasons:r.reasons});
 for(const[name,variant]of [['32 explicit domain prohibition','domainBlocked'],['33 unsupported producer','unsupportedProducer'],['34 actual user state unknown','unknownState'],['35 incomplete full ancestry','incompleteAncestry'],['missing actual fact','missingFact'],['wrong actual owner','wrongOwner'],['wrong actual direction','wrongDirection'],['missing AND group source','missingGroupSource'],['unreviewed original meaning','unreviewedMeaning'],['counterexample review still pending','counterexampleReview'],['wrong product specialism','wrongSpecialism'],['signed approval cannot turn natal into annual evidence','natalAsAnnual'],['native source integrity still failed','badSourceHash'],['source declaration is not a personal fact','referenceOnly']] as const){
  const n=await syntheticApprovalFixture(root,'comprehensive',false,variant),audit=verifyApprovalBundle(n.bundles[0],n.contexts[0],n.env);
  results.push({name,rejected:!audit.ok,reasons:audit.reasons});
 }
 const revoke=await syntheticApprovalFixture(root);const issued=revoke.provider.lookup(revoke.contexts[0].requirement);revoke.revoke();r=verifyApprovalBundle(revoke.bundles[0],revoke.contexts[0],revoke.env);
 results.push({name:'29 approval revoked',rejected:!r.ok&&!!issued&&!revoke.provider.verifyAuthenticity(issued)&&revoke.provider.lookup(revoke.contexts[0].requirement)===null,reasons:r.reasons});
 const sup=await syntheticApprovalFixture(root);sup.supersede();r=verifyApprovalBundle(sup.bundles[0],sup.contexts[0],sup.env);results.push({name:'30 superseded approval',rejected:!r.ok,reasons:r.reasons});
 const rotation=await syntheticApprovalFixture(root);rotation.rotate();r=verifyApprovalBundle(rotation.bundles[0],rotation.contexts[0],rotation.env);results.push({name:'key rotation old signature reused',rejected:!r.ok,reasons:r.reasons});
 const revokedEnv=jsonSnapshot(revoke.env);revokedEnv.ledger!.records[0].signature=Buffer.alloc(64).toString('base64');revokedEnv.anchor.ledgerHash=approvalHash(revokedEnv.ledger);r=verifyApprovalBundle(revoke.bundles[1],revoke.contexts[1],revokedEnv);results.push({name:'tampered revocation signature',rejected:!r.ok,reasons:r.reasons});
 const duplicate=jsonSnapshot(revoke.env);duplicate.ledger!.records.push(duplicate.ledger!.records[0]);duplicate.anchor.ledgerHash=approvalHash(duplicate.ledger);r=verifyApprovalBundle(revoke.bundles[1],revoke.contexts[1],duplicate);results.push({name:'ledger event replay',rejected:!r.ok,reasons:r.reasons});
 return results;
}
