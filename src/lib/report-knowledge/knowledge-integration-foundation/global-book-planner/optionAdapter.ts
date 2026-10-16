import {isRecord}from'../normalization';
import {recordHash}from'../sourceReader';
import {digest}from'../global-specialist-integration/candidateEnvelope';
import {ActualBindingIndex}from'../knowledge-binder/matching';
import {bindKnowledgeCandidate}from'../knowledge-binder/engine';
import type{EngineRegistration}from'../global-specialist-integration/types';
import type{KnowledgeBindingReceipt}from'../knowledge-binder/types';
import type{NativeCase}from'./nativeRehearsal';
import type{PlanningQuestion,PlanningOption,InformationFunction,DisplayDependency,RootOwnership}from'./types';
const text=(v:unknown):string|null=>typeof v==='string'?v:null;
const strings=(v:unknown):string[]=>Array.isArray(v)?v.filter((s):s is string=>typeof s==='string'):typeof v==='string'?[v]:[];
export function syntheticAddress(q:Record<string,unknown>):PlanningQuestion['address']{
 const a=text(q.address),chapter=text(q.chapter)??(typeof q.chapter==='number'?'CH'+String(q.chapter).padStart(2,'0'):null),period=typeof q.year==='number'?String(q.year):typeof q.month==='number'?'month-'+q.month:null;
 const parts=a?.split('.')??[],role=q.role===null?null:typeof q.role==='number'?'S'+q.role:null;
 return{chapterId:chapter,periodId:period,paragraphId:typeof q.paragraph==='number'?'P'+q.paragraph:parts[1]??null,sentenceRole:role??parts[2]??(period?text(q.questionKey):null),originalAddress:a??String(q.id),level:period?(text(q.questionKey)?'PERIOD_ROLE':'PERIOD'):role||parts[2]?'SENTENCE_ROLE':'PARAGRAPH'};
}
export function informationFunction(m:Record<string,unknown>):InformationFunction{
 if(m.function==='RECALL'||m.function==='VALID_RECALL')return'RECALL';
 const f=text(m.informationFunction)??text(m.polarity)??text(m.function);
 switch(f){case'EXPLANATION':case'PERSONALIZED_REASON':case'CONDITIONAL_APPLICATION':case'PRACTICAL_REFLECTION':case'COMPARISON':return f;case'POSITIVE':case'positive':return'POSITIVE';case'RISK':case'risk':return'RISK';case'FACT_BOMB':case'fact_bomb':return'FACT_BOMB';case'TWIST':case'twist':return'TWIST';case'RECALL':case'VALID_RECALL':return'RECALL';case'VERIFIED_COMPARISON':case'CONDITIONAL_COMPARISON':return'COMPARISON';case'REPAIR':return'PRACTICAL_REFLECTION';case'VERIFIED_NEW_APPLICATION':case'NEW_APPLICATION':return'CONDITIONAL_APPLICATION';default:return'EXPLANATION';}
}
export function adaptSynthetic(f:NativeCase,entry:EngineRegistration){
 const actual=new ActualBindingIndex(f.request,f.catalog),byCandidate=new Map(f.candidates.map(c=>[c.record.originalId,c])),receipts=new Map<string,KnowledgeBindingReceipt>(),options:PlanningOption[]=[],questions=new Map<string,PlanningQuestion>();
 const owner=(v:unknown)=>v==='PAIR'?actual.owner('PAIR'):v==='A'?actual.owner('A'):v==='B'?actual.owner('B'):text(v)??f.request.graph.context.owners.person??null;
 for(const value of f.options){
  if(!isRecord(value)||!isRecord(value.meaning)||typeof value.id!=='string')throw Error('NATIVE_SYNTHETIC_OPTION_REQUIRED');
  const c=byCandidate.get(value.id);if(!c||c.provenance!=='SYNTHETIC_TEST_ONLY'||!c.record.locator.file.startsWith('tests/fixtures/')||!c.record.originalId.startsWith('synthetic:'))throw Error('INDEPENDENT_NATIVE_SYNTHETIC_REGISTRY_REQUIRED');
  const m=value.meaning,q=isRecord(value.question)?value.question:f.questions.find(q=>isRecord(q)&&q.id===value.questionId);
  if(!isRecord(q)||typeof q.id!=='string')throw Error('NATIVE_QUESTION_REQUIRED');
  const receipt=bindKnowledgeCandidate(c,actual,f.catalog,f.provider);
  if(digest(receipt)!==digest(value.receipt))throw Error('NATIVE_BINDER_RECEIPT_CHANGED');
  const receiptKey='planner-synthetic-receipt:'+entry.engineId+':'+c.record.originalId;receipts.set(receiptKey,receipt);
  const source=f.catalog.raw.get(c.record.catalogKey),sourceHash=c.record.locator.recordSha256;
  if(!source||recordHash(source)!==sourceHash)throw Error('EXACT_SYNTHETIC_SOURCE_REQUIRED');
  const prior=strings(m.recallOf),friction=strings(m.frictionOf??m.precedingMaterialId),groups=Array.isArray(m.introducedGroups)?m.introducedGroups.filter(isRecord).map(g=>strings(g.materialIds)):[];
  const fn=text(m.function)??(prior.length?'RECALL':'CONDITIONAL_APPLICATION');
  const kind:DisplayDependency['kind']|null=fn==='RECALL'||fn==='VALID_RECALL'?'RECALL':fn==='REPAIR'||m.requiresFriction===true||friction.length?'REPAIR':fn==='CONTINUITY'?'CONTINUITY':null;
  const required=groups.length?groups:[...prior,...friction].length?[[...prior,...friction]]:[];
  const dependency:DisplayDependency|null=kind?{kind,alternatives:required,requiredOriginalIntroductions:required.flat(),plannedIsDisplayed:false,nativeDisplayProof:kind==='RECALL'||kind==='REPAIR'&&f.displays.length>0?{verifiedBy:'ORIGINAL_SPECIALIST_SESSION',nativeEligible:value.eligible,externalRegisteredDisplayUsed:f.displays.length>0}:null,actualDisplayVerified:(kind==='RECALL'||kind==='REPAIR'&&f.displays.length>0)&&value.eligible===true}:null;
  const roots=strings(value.informationRoots??value.roots),qowner=owner(q.requiredOwner??q.owner??value.owner??m.owner),direction=text(q.requiredDirection??q.direction??m.direction);
  if(!questions.has(q.id))questions.set(q.id,{id:q.id,original:null,address:syntheticAddress(q),originalText:text(q.questionKey)??q.id,originalHash:recordHash(q),product:entry.productKey,relationship:entry.relationshipCategory,owner:qowner,direction,priority:q.priority==='TRANSITION'||q.priority==='BOUNDARY'||q.priority===true?1:0,requiredMeaning:[],requiredEvidenceKinds:[],synthetic:true});
  const primary=text(m.meaningId??m.id),claim=text(m.claimId??m.claim);
  const nativeReasons=strings(value.reasons),eligible=value.eligible===true;
  options.push({id:value.id,catalogKey:c.record.catalogKey,materialId:c.record.originalId,engine:entry.engineId,product:entry.productKey,relationship:entry.relationshipCategory,fixtureId:f.request.graph.context.fixtureId,provenance:'SYNTHETIC_TEST_ONLY',originalEnvelope:null,originalEnvelopeHash:null,questionId:q.id,link:'EXACT_VERIFIED_QUESTION_LINK',materialLinkKind:kind==='RECALL'?'RECALL_ONLY':'DIRECT_QUESTION_MATERIAL',originalQuestionLink:{nativeQuestion:q,sourceQuestionId:source.questionId,sourceHash,verifiedBy:'ORIGINAL_SPECIALIST_SESSION'},receiptKey,receiptHash:digest(receipt),sourceHash:sourceHash??'',sourceVersion:c.record.locator.sourceVersion??'',sourceLocator:c.record.locator,owner:owner(m.owner??value.owner),direction:text(m.direction)??direction,temporal:receipt.temporalWitnesses,primaryRoots:roots,ancestryRoots:receipt.canonicalFactRoots,evidenceIds:receipt.selectedActualEvidence,primaryMeaning:primary,claimIdentity:claim,meaningState:'VERIFIED_SYNTHETIC',context:strings(m.context??m.condition),informationKind:fn==='NEW_CALCULATED_FACT'?'ACTUAL_CALCULATED_FACT':kind==='RECALL'?'RECALL':fn==='CONTINUITY'?'SUPPORTING_INFORMATION':'CONDITIONAL_INTERPRETATION',informationFunction:informationFunction(m),originalFunction:fn,fit:typeof m.fit==='number'?m.fit:(m.direct===true?10:0)+strings(m.extraMeanings).length,supportingInformation:[{kind:'SUPPORTING_INFORMATION',ids:receipt.selectedActualEvidence}],originalMeaning:m,conditions:c.requirement, counterexamples:c.requirement.counterexamples,disallowedInferences:c.requirement.prohibitions,actualContext:{native:m,entered:f.request.actualUserState},missingConditions:nativeReasons,dependency,nativeEligible:eligible,nativeReasons,policyRef:entry.engineId,semanticIdentity:{phrase:text(m.phrase),example:text(m.example),advice:text(m.advice),application:text(m.application??m.action),condition:text(m.condition)??strings(m.conditions).join('|'),verifiedDistinctApplication:eligible&&['VERIFIED_NEW_APPLICATION','NEW_APPLICATION'].includes(fn)}});
 }
 // Exact native address declarations are resolved within the same registered
 // synthetic registry; this is not a Scheduler-to-Reader bridge.
 for(const o of options)if(o.dependency){o.dependency={...o.dependency,alternatives:o.dependency.alternatives.flatMap(group=>group.reduce<string[][]>((groups,id)=>{const matches=options.filter(p=>p.materialId===id||isRecord(p.originalQuestionLink)&&isRecord(p.originalQuestionLink.nativeQuestion)&&p.originalQuestionLink.nativeQuestion.address===id).map(p=>p.materialId);return groups.flatMap(g=>(matches.length?matches:[id]).map(material=>[...g,material]));},[[]]))};}
 // Keep every registered question, including those with no candidate. No
 // unknown address is filled by inventing a paragraph number.
 for(const value of f.questions){if(!isRecord(value)||typeof value.id!=='string'||questions.has(value.id))continue;questions.set(value.id,{id:value.id,original:null,address:syntheticAddress(value),originalText:text(value.questionKey)??value.id,originalHash:recordHash(value),product:entry.productKey,relationship:entry.relationshipCategory,owner:owner(value.requiredOwner??value.owner),direction:text(value.requiredDirection??value.direction),priority:value.priority==='TRANSITION'||value.priority==='BOUNDARY'||value.priority===true?1:0,requiredMeaning:[],requiredEvidenceKinds:[],synthetic:true});}
 const roots:RootOwnership[]=f.request.graph.nodes.filter(n=>n.fact.rootId).map(n=>({id:n.fact.rootId!,owner:n.owner.fixtureOwnerId,producer:n.producer,temporal:n.temporal,independentFact:n.fact.independentFact,type:n.fact.rootType}));
 return{options,questions:[...questions.values()],receipts,roots};
}
