import { readFileSync } from 'node:fs';
import { nativeRehearsal, type NativeCase } from '../global-book-planner/nativeRehearsal';
import { bindKnowledgeCandidate } from '../knowledge-binder/engine';
import { ActualBindingIndex } from '../knowledge-binder/matching';
import { hash, recordHash, canonicalJson } from '../sourceReader';
import type { KnowledgeCandidate } from '../knowledge-binder/types';
import { approvalHash, jsonSnapshot } from './canonicalApproval';
import type { ApprovalReviewContext, ApprovalScope } from './types';
const contexts=new WeakMap<ApprovalReviewContext,{seal:string;verifyCurrentOriginals:()=>boolean}>();
const seal=(c:ApprovalReviewContext)=>approvalHash({mode:c.mode,scope:c.scope,requirement:c.requirement,originalGateResults:c.originalGateResults,originalReviewState:c.originalReviewState,evaluatedAt:c.evaluatedAt});
export function authenticReviewContext(c:ApprovalReviewContext):boolean {
 try { const proof=contexts.get(c);return !process.env.VERCEL && !!proof && proof.seal===seal(c) && proof.verifyCurrentOriginals===c.verifyCurrentOriginals && proof.verifyCurrentOriginals(); } catch { return false; }
}
function contextFor(root:string,f:NativeCase,candidate:KnowledgeCandidate,index:ActualBindingIndex):ApprovalReviewContext {
 if (candidate.provenance!=='SYNTHETIC_TEST_ONLY'||!candidate.record.originalId.startsWith('synthetic:')||!f.request.graph.context.synthetic||!f.request.graph.context.fixtureId.startsWith('synthetic:')) throw Error('INDEPENDENT_NATIVE_SYNTHETIC_ONLY');
 const receipt=bindKnowledgeCandidate(candidate,index,f.catalog),q=candidate.requirement,r=candidate.record;
 const selected=receipt.selectedActualEvidence.map(id=>f.request.graph.nodes.find(n=>n.id===id)!).filter(Boolean),nodes=[...new Map(selected.flatMap(n=>[n,...index.ancestors(n)]).map(n=>[n.id,n])).values()];
 const raw=f.catalog.raw.get(r.catalogKey), originalMeaning=raw&&typeof raw==='object'&&'meaning' in raw?raw.meaning:q.coreMeaning;
 const sourceProof={locator:r.locator,sourceCheck:candidate.sourceCheck,sourceGroups:q.sourceGroups,requiredSources:q.sourceRequirements};
 const packet={original:r.originalId,sourceProofHash:approvalHash(sourceProof),originalMeaning,requirement:receipt.approvalRequirement,counterexamples:q.counterexamples,prohibitions:q.prohibitions,conditions:q.requiredUserState,fixture:f.request.graph.context.fixtureId};
 const scope:ApprovalScope={originalReviewUnitId:'synthetic:official-review:'+r.originalId,originalResearchId:r.originalId,catalogKey:r.catalogKey,originalRecordHash:receipt.approvalRequirement.originalRecordHash,sourceVersion:receipt.approvalRequirement.sourceVersion,sourceProofHash:approvalHash(sourceProof),reviewPacketHash:approvalHash(packet),meaningIdentity:q.meaningIdentity??'UNKNOWN',claimIdentity:q.claimIdentity??'UNKNOWN',approvedMeaningScope:{originalMeaning,modelMeaningProposal:null,approvedInterpretation:originalMeaning,allowedConditionalApplications:{contexts:[...f.request.contexts],requiredUserState:q.requiredUserState}},productScope:f.request.product,relationshipScope:f.request.relationship,domainScope:['SYNTHETIC_ONLY'],contextScope:[...f.request.contexts],evidenceScope:{fixtureId:f.request.graph.context.fixtureId,evidenceIds:receipt.selectedActualEvidence,fullAncestryHashes:nodes.map(n=>({id:n.id,hash:hash(canonicalJson(n))})),sourceGroups:{original:q.sourceGroups,evaluated:receipt.sourceGroupEvaluation},producerVersions:nodes.map(n=>({id:n.id,producer:n.producer}))},canonicalFactRootScope:receipt.canonicalFactRoots,ownerScope:nodes.map(n=>({nodeId:n.id,slot:n.owner.slot,ownerId:n.owner.fixtureOwnerId})),directionScope:nodes.flatMap(n=>n.direction?[{nodeId:n.id,subject:n.direction.subject,recipient:n.direction.recipient,relationId:n.direction.relationId}]:[]),temporalScope:receipt.temporalWitnesses,graphVersion:receipt.graphVersion,sourceVerificationVersion:receipt.sourceVerificationVersion,semanticVerificationVersion:receipt.semanticVerificationVersion,prohibitedInferences:q.prohibitions,requiredCounterexamples:q.counterexamples,actualContextRequirements:{declared:q.requiredUserState,context:q.requiredContext,actual:f.request.actualUserState,unresolved:q.unresolvedConditions},originalPolicyReferences:[...receipt.domainPolicyReferences],policyVersion:f.catalog.input.config.version,sourceFamily:r.family,requirementHash:approvalHash(receipt.approvalRequirement)};
 // SourceReader's exact JSON record hash detects all native request/catalog
 // changes. The private index is reused only while its original input matches;
 // native Binder Gates are still recomputed, without recloning the whole Graph.
 const currentProof=(binding:typeof receipt)=>recordHash([candidate,f.request,binding,[...f.catalog.raw],f.catalog.input.records,f.catalog.input.edges,f.catalog.input.config,f.catalog.evidence.versions,[...f.catalog.input.frozen],[...f.catalog.decisions],[...f.catalog.sourceChecks]]);
 const initial=currentProof(receipt);
 const c:ApprovalReviewContext={mode:'SYNTHETIC_TEST_ONLY',scope:jsonSnapshot(scope),requirement:jsonSnapshot(receipt.approvalRequirement),originalGateResults:jsonSnapshot(receipt.allTwelveGateResults),originalReviewState:jsonSnapshot(q.originalReviewState),evaluatedAt:f.request.graph.context.evaluatedAt,verifyCurrentOriginals:()=>{
  const fresh=bindKnowledgeCandidate(candidate,index,f.catalog);
  return [...f.catalog.input.frozen].every(([file,digest])=>hash(readFileSync(root+'/'+file))===digest)&&hash(readFileSync(root+'/'+r.locator.file))===r.locator.fileSha256&&recordHash(f.catalog.raw.get(r.catalogKey))===r.locator.recordSha256&&initial===currentProof(fresh);
 }};
 contexts.set(c,{seal:seal(c),verifyCurrentOriginals:c.verifyCurrentOriginals});Object.freeze(c);return c;
}
export type ApprovalNegativeVariant = Parameters<typeof nativeRehearsal>[3] | 'unsupportedProducer' | 'unknownState' | 'incompleteAncestry' | 'wrongDirection' | 'unreviewedMeaning' | 'counterexampleReview' | 'wrongSpecialism' | 'natalAsAnnual';
export async function prepareSyntheticReviewContexts(root:string,engine='comprehensive',display=false,negative?:ApprovalNegativeVariant) {
 if(process.env.VERCEL)throw Error('OFFICIAL_APPROVAL_OFFLINE_ONLY');
 const originalVariants=['missingApproval','wrongOwner','referenceOnly','badSourceHash','missingFact','missingGroupSource','domainBlocked'];
 const native=await nativeRehearsal(root,engine,display,originalVariants.includes(negative??'')?negative as Parameters<typeof nativeRehearsal>[3]:undefined);
 // These independent negative fixtures change test input, never a Gate result.
 // The unchanged Binder computes all failures from the changed input itself.
 if(negative==='incompleteAncestry')for(const n of native.request.graph.nodes)native.request.graph.edges.push({from:n.id,to:'synthetic:official:missing-ancestor',kind:'REQUIRES_SOURCE_ROOT',required:true});
 for(const c of native.candidates){
  if(negative==='unsupportedProducer')c.requirement.producerRequirements=['synthetic:official:unsupported-producer'];
  if(negative==='unknownState')c.requirement.requiredUserState=[{key:'missingSyntheticState',allowed:['known'],originalField:'/synthetic/missingState'}];
  if(negative==='wrongDirection')c.requirement.requiredDirection=['A_TO_B'];
  if(negative==='unreviewedMeaning')c.requirement.originalReviewState={syntheticMeaningReviewed:false};
  if(negative==='counterexampleReview')c.requirement.counterexamples=['synthetic:official:unreviewed-counterexample'];
  if(negative==='wrongSpecialism')c.requirement.products=['career_money_study'];
  if(negative==='natalAsAnnual')c.requirement.requiredTemporalScope='annual';
 }
 const index=new ActualBindingIndex(native.request,native.catalog);
 return{native,contexts:native.candidates.map(c=>contextFor(root,native,c,index))};
}
