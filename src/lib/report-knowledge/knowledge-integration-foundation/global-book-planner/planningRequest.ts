import {digest,validateEnvelope,scopedAddress}from'../global-specialist-integration/candidateEnvelope';
import {compilePlannerHandoff}from'../global-specialist-integration/plannerHandoff';
import {GlobalSpecialistRegistry}from'../global-specialist-integration/engineRegistry';
import type{CandidateEnvelope,EngineRegistration}from'../global-specialist-integration/types';
import type{KnowledgeBindingReceipt}from'../knowledge-binder/types';
import type{ProductQuestionRegistry}from'../product-specialist-foundation/questionRegistry';
import type{ProductContract,QuestionMaterialLink}from'../product-specialist-foundation/types';
import type{GlobalBookPlanningRequest,PlanningOption,PlanningQuestion,RootOwnership}from'./types';
import{nativeRehearsal}from'./nativeRehearsal';
import{adaptSynthetic}from'./optionAdapter';
const authenticated=new WeakMap<GlobalBookPlanningRequest,{receipts:readonly (readonly [string,KnowledgeBindingReceipt])[]}>();
function freeze(value:unknown,seen=new Set<object>()):void{
 if(!value||typeof value!=='object'||seen.has(value))return;seen.add(value);
 if(value instanceof Map)for(const[k,v]of value){freeze(k,seen);freeze(v,seen);}else for(const v of Object.values(value))freeze(v,seen);Object.freeze(value);
}
// Copy each shared metadata object once. Freezing a Planner snapshot must not
// freeze the caller's Registry, Foundation questions or native Binder receipts.
function snapshot<T>(value:T,seen=new Map<object,unknown>()):T{
 if(!value||typeof value!=='object')return value;
 if(seen.has(value))return seen.get(value)as T;
 if(value instanceof Map){const copy=new Map<unknown,unknown>();seen.set(value,copy);for(const[k,v]of value)copy.set(snapshot(k,seen),snapshot(v,seen));return copy as T;}
 if(Array.isArray(value)){const copy:unknown[]=[];seen.set(value,copy);for(const v of value)copy.push(snapshot(v,seen));return copy as T;}
 const copy:Record<string,unknown>={};seen.set(value,copy);for(const[k,v]of Object.entries(value))copy[k]=snapshot(v,seen);return copy as T;
}
function register(input:GlobalBookPlanningRequest){
 if(process.env.VERCEL)throw Error('GLOBAL_PLANNER_OFFLINE_ONLY');const r=snapshot(input);freeze(r);authenticated.set(r,{receipts:[...r.bindingReceipts]});return r;
}
export function assertPlanningRequest(r:GlobalBookPlanningRequest){
 if(process.env.VERCEL)throw Error('GLOBAL_PLANNER_OFFLINE_ONLY');const proof=authenticated.get(r),entries=[...r.bindingReceipts];
 if(!proof||!Object.isFrozen(r)||entries.length!==proof.receipts.length||entries.some(([key,value],i)=>key!==proof.receipts[i][0]||value!==proof.receipts[i][1]))throw Error('AUTHENTIC_UNCHANGED_OFFLINE_PLANNING_REQUEST_REQUIRED');
 const registry=new GlobalSpecialistRegistry([r.registration]);registry.route({product:r.productKey,relationship:r.relationshipCategory});
 if(r.executionMode==='ISOLATED_EDITORIAL_REHEARSAL'&&(!r.fixtureId.startsWith('synthetic:')||r.originalCandidateEnvelopes.length||r.approvalState!=='ISOLATED_AUTHENTIC_SYNTHETIC_PROVIDER'))throw Error('SYNTHETIC_ISOLATION_REQUIRED');
 if(r.executionMode==='STRICT_CUSTOMER_POLICY'&&r.approvalState!=='NO_APPROVALS')throw Error('ORIGINAL_NO_APPROVALS_POLICY_REQUIRED');
}
export async function prepareRehearsalRequest(root:string,entry:EngineRegistration,readerContract:ProductContract,display=false,negative?:Parameters<typeof nativeRehearsal>[3]):Promise<GlobalBookPlanningRequest>{
 if(process.env.VERCEL)throw Error('GLOBAL_PLANNER_OFFLINE_ONLY');
 const native=await nativeRehearsal(root,entry.engineId,display,negative),adapted=adaptSynthetic(native,entry),first=adapted.receipts.values().next().value;
 if(native.request.product!==entry.productKey||native.request.relationship!==entry.relationshipCategory||!first)throw Error('NATIVE_REHEARSAL_SCOPE_MISMATCH');
 const files=[...new Set(native.candidates.map(c=>c.record.locator.file))];if(files.length!==1)throw Error('ONE_NATIVE_SYNTHETIC_REGISTRY_PER_ROUTE_REQUIRED');
 return register({productKey:entry.productKey,relationshipCategory:entry.relationshipCategory,executionMode:'ISOLATED_EDITORIAL_REHEARSAL',fixtureId:native.request.graph.context.fixtureId,
 versions:{readerContract:readerContract.originalReaderVersion??readerContract.originalReaderHash??'PERIOD_CONTRACT',questionRegistry:entry.questionRegistryVersion,knowledgeCatalog:first.catalogVersion,sourceVerification:first.sourceVerificationVersion,graph:first.graphVersion,binder:first.binderVersion,specialistEngine:entry.engineVersion},originalCandidateEnvelopes:[],bindingReceipts:adapted.receipts,actualEvidenceWitnesses:native.request.graph.nodes,sourceGroups:native.candidates.flatMap(c=>c.requirement.sourceGroups),canonicalFactRoots:adapted.roots,semanticIdentityState:'VERIFIED_SYNTHETIC',approvalState:'ISOLATED_AUTHENTIC_SYNTHETIC_PROVIDER',actualContext:native.request.actualUserState,temporalWindow:native.request.requiredWindow??null,existingReuseBudgets:native.policy,introducedMeaningRequirements:adapted.options.flatMap(o=>o.dependency?[o.dependency]:[]),readerContract,questions:adapted.questions,options:adapted.options,registration:entry,originalInputProof:{source:files[0],sha256:native.catalog.input.frozen.get(files[0])!},nativeConflicts:{source:entry.engineId,policy:entry.reusePolicy},temporalContract:{registry:native.catalog.reader.json(files[0]),nodes:native.request.graph.nodes.filter(n=>n.temporal)},relationshipContract:{fixedRoles:entry.relationshipCategory==='parentChild'?{A:'parent',B:'child'}:entry.relationshipCategory==='managerReport'?{A:'manager',B:'report'}:{A:'A',B:'B'},roleSource:entry.policySources.filter(p=>p.file.endsWith('roleValidator.ts')),category:entry.relationshipCategory,owners:native.request.graph.context.owners,roleVersion:entry.relationshipCategory?'compatibility-fixed-ab-v1':null,actualUnenteredFacts:'UNKNOWN_UNLESS_EXPLICIT_REGISTERED_SYNTHETIC_CONTEXT'}});
}
export function prepareStrictRequest(args:{entry:EngineRegistration;registry:ProductQuestionRegistry;envelopes:readonly CandidateEnvelope[];receipts:readonly KnowledgeBindingReceipt[];witnesses:readonly unknown[];originalInputProof:GlobalBookPlanningRequest['originalInputProof'];nativeConflicts:unknown}):GlobalBookPlanningRequest{
 const{entry,registry,envelopes,receipts}=args,first=envelopes[0];if(!first||envelopes.length!==receipts.length)throw Error('EXACT_NATIVE_ENVELOPES_AND_RECEIPTS_REQUIRED');
 const receiptMap=new Map<string,KnowledgeBindingReceipt>(),options:PlanningOption[]=[],questions:PlanningQuestion[]=registry.questions.filter(q=>q.productKey===entry.productKey&&q.relationshipCategory===entry.relationshipCategory).map(q=>({id:q.id,original:q,address:q.address,originalText:q.originalQuestion??q.readerPurpose,originalHash:q.originalContractHash,product:q.productKey,relationship:q.relationshipCategory,owner:null,direction:null,priority:0,requiredMeaning:[],requiredEvidenceKinds:q.requirement.requiredEvidenceKinds,synthetic:false}));
 const roots=new Map<string,RootOwnership>();
 for(let i=0;i<envelopes.length;i++){
  const e=envelopes[i],receipt=receipts[i];validateEnvelope(e,e,receipt);compilePlannerHandoff(e);
  if(e.engine!==entry.engineId||e.productScope!==entry.productKey||e.relationshipScope!==entry.relationshipCategory||e.fixtureScope.fixtureId!==first.fixtureScope.fixtureId||e.originalMaterial.provenance!=='ACTUAL_RESEARCH')throw Error('ORIGINAL_ENGINE_SCOPE_REQUIRED');
  receiptMap.set(e.originalBinderReceipt.key,receipt);for(const r of e.informationRootAddresses)roots.set(r.originalRootId,{id:r.originalRootId,owner:r.ownerId,producer:r.producer,temporal:r.temporal,independentFact:r.independentFact,type:r.rootType});
  const links:CandidateEnvelope['questionLinks'][number][]=[...e.questionLinks];
  for(const link of links){const q=questions.find(q=>q.id===link.questionId);if(!q)throw Error('ORIGINAL_QUESTION_NOT_IN_REGISTRY');
   const state=linkState(link,q);
   options.push({id:scopedAddress('planner-option-v1',e.identity.globalId,link.questionId,link.kind),catalogKey:receipt.candidateCatalogKey,materialId:e.identity.originalResearchId,engine:e.engine,product:e.productScope,relationship:e.relationshipScope,fixtureId:e.fixtureScope.fixtureId,provenance:'ACTUAL_RESEARCH',originalEnvelope:e,originalEnvelopeHash:digest(e),questionId:q.id,link:state,materialLinkKind:link.kind,originalQuestionLink:link,receiptKey:e.originalBinderReceipt.key,receiptHash:e.originalBinderReceipt.hash,sourceHash:e.originalMaterial.recordHash??'',sourceVersion:e.originalMaterial.locator.sourceVersion??'',sourceLocator:e.originalMaterial.locator,owner:e.fixtureScope.ownerIds.length===1?e.fixtureScope.ownerIds[0]:null,direction:e.directionRequirements.length===1?e.directionRequirements[0]:null,temporal:receipt.temporalWitnesses,primaryRoots:e.informationRoots,ancestryRoots:e.supportingAncestryRoots,evidenceIds:receipt.selectedActualEvidence,primaryMeaning:e.semanticIdentity,claimIdentity:e.claimIdentity,meaningState:'REVIEW_REQUIRED',context:[],informationKind:'CONDITIONAL_INTERPRETATION',informationFunction:link.kind==='RECALL_ONLY'?'RECALL':'EXPLANATION',originalFunction:link.kind,fit:0,supportingInformation:[{kind:'SUPPORTING_INFORMATION',ids:receipt.selectedActualEvidence}],originalMeaning:e.semanticDescription,conditions:e.actualContextRequirements,counterexamples:e.counterexamples,disallowedInferences:e.prohibitions,actualContext:e.actualContextRequirements,missingConditions:e.withholdReasons,dependency:link.kind==='RECALL_ONLY'?{kind:'RECALL',alternatives:[],requiredOriginalIntroductions:[],plannedIsDisplayed:false,nativeDisplayProof:null,actualDisplayVerified:false}:null,nativeEligible:false,nativeReasons:e.withholdReasons,policyRef:e.engine,semanticIdentity:{phrase:null,example:null,advice:null,application:null,condition:null,verifiedDistinctApplication:false}});
  }
 }
 const readerContract=registry.products.find(p=>p.productKey===entry.productKey&&p.relationship===entry.relationshipCategory);if(!readerContract)throw Error('ORIGINAL_PRODUCT_READER_CONTRACT_REQUIRED');const receipt=receipts[0];
 return register({productKey:entry.productKey,relationshipCategory:entry.relationshipCategory,executionMode:'STRICT_CUSTOMER_POLICY',fixtureId:first.fixtureScope.fixtureId,versions:{readerContract:readerContract.originalReaderVersion??readerContract.originalReaderHash??'PERIOD_CONTRACT',questionRegistry:entry.questionRegistryVersion,knowledgeCatalog:receipt.catalogVersion,sourceVerification:receipt.sourceVerificationVersion,graph:receipt.graphVersion,binder:receipt.binderVersion,specialistEngine:entry.engineVersion},originalCandidateEnvelopes:envelopes,bindingReceipts:receiptMap,actualEvidenceWitnesses:args.witnesses,sourceGroups:envelopes.flatMap(e=>e.sourceGroups),canonicalFactRoots:[...roots.values()],semanticIdentityState:'REVIEW_REQUIRED',approvalState:'NO_APPROVALS',actualContext:envelopes.map(e=>e.actualContextRequirements),temporalWindow:null,existingReuseBudgets:{reference:entry.engineId,original:entry.reusePolicy,validateSelection:()=>[]},introducedMeaningRequirements:options.flatMap(o=>o.dependency?[o.dependency]:[]),readerContract,questions,options,registration:entry,originalInputProof:args.originalInputProof,nativeConflicts:args.nativeConflicts,temporalContract:envelopes.map(e=>e.temporalRequirements),relationshipContract:{owners:envelopes.map(e=>e.ownerRequirements),directions:envelopes.map(e=>e.directionRequirements),originalConditions:'PRESERVED_NOT_INFERRED'}});
}
export function linkState(link:QuestionMaterialLink,q:PlanningQuestion):PlanningOption['link']{
 if(q.original?.readerAgreement==='REVIEW_REQUIRED')return'BRIDGE_UNVERIFIED';
 switch(link.kind){case'DIRECT_QUESTION_MATERIAL':return'EXACT_VERIFIED_MATERIAL_LINK';case'CONDITIONAL_APPLICATION':return'SOURCE_SUPPORTED_APPLICATION';case'RECALL_ONLY':return'EXACT_VERIFIED_QUESTION_LINK';default:return'NO_VALID_LINK';}
}
