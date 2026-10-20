import { canonicalJson, hash, recordHash } from "../sourceReader";
import { isRecord } from "../normalization";
import { BINDING_HARD_GATES } from "../types";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeCandidate, KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import { checkEnteredRequirements } from "./domainRequirements";
import { careerRecallReasons, careerSelectionViolations } from "./reuseConstraints";
import type { CareerSyntheticMeaning, CareerSyntheticQuestion, CareerSyntheticContext, CareerIntroduction, CareerSyntheticOption, CareerSyntheticSession, CareerSelectionMethod, CareerSyntheticSelection } from "./types";
export const SYNTHETIC_FILE="tests/fixtures/career-specialist-engine-01/synthetic-knowledge.json";
const sessions=new WeakMap<CareerSyntheticSession,{options:CareerSyntheticOption[];questions:CareerSyntheticQuestion[];ledger:CareerIntroduction[]}>();
export async function createCareerSyntheticSession(catalog:KnowledgeBinderCatalog,request:KnowledgeBindingRequest,candidates:readonly KnowledgeCandidate[],questions:readonly CareerSyntheticQuestion[],meanings:ReadonlyMap<string,CareerSyntheticMeaning>,approvals:KnowledgeBindingApprovalProvider,context:CareerSyntheticContext,ledger:readonly CareerIntroduction[]=[]):Promise<CareerSyntheticSession>{
 if(request.product!=="career_money_study"||request.relationship!==null||!request.graph.context.fixtureId.startsWith("synthetic:career:")||request.graph.nodes.some(n=>n.producer.file!==SYNTHETIC_FILE||!n.owner.fixtureOwnerId.startsWith("synthetic:career:")||n.fact.rootId&&!n.fact.rootId.startsWith("synthetic:career:root:"))||catalog.input.records.length!==candidates.length||catalog.input.records.some(r=>r.family!=="career-specialist-synthetic-fixture"||r.locator.file!==SYNTHETIC_FILE||!r.originalId.startsWith("synthetic:career:")))throw Error("CAREER_SYNTHETIC_ISOLATION_REQUIRED");
 if(hash(catalog.reader.text(SYNTHETIC_FILE))!==catalog.input.frozen.get(SYNTHETIC_FILE))throw Error("CAREER_SYNTHETIC_SOURCE_CHANGED");
 const declared=catalog.reader.json(SYNTHETIC_FILE);if(!isRecord(declared)||!Array.isArray(declared.questions)||!Array.isArray(declared.enterableFacts))throw Error("CAREER_SYNTHETIC_REGISTRY_REQUIRED");
 const enterableFacts=declared.enterableFacts;
 if([...context.economicFacts,...context.learningFacts].some(f=>!enterableFacts.includes(f)))throw Error("UNREGISTERED_SYNTHETIC_ENTERED_FACT");
 for(const q of questions)if(!declared.questions.some(r=>canonicalJson(r)===canonicalJson(q)))throw Error("CAREER_SYNTHETIC_QUESTION_NOT_REGISTERED");
 if(ledger.some(l=>!l.displayRecord.startsWith("synthetic:career:")||!l.materialId.startsWith("synthetic:career:")))throw Error("CAREER_SYNTHETIC_DISPLAY_REQUIRED");
 const input=request.graphInput.evidence.input;
 if(input.kind==="compatibility"||input.userContext.jobStatus!==context.jobStatus||request.actualUserState.jobStatus!==context.jobStatus||!request.graph.nodes.some(n=>n.kind==="CONTEXT_INPUT"&&n.owner.fixtureOwnerId===request.graph.context.owners.person&&n.status==="VERIFIED"&&canonicalJson(n.value)===canonicalJson(context)))throw Error("VERIFIED_SYNTHETIC_CAREER_CONTEXT_REQUIRED");
 const index=new ActualBindingIndex(request,catalog);if(index.errors.length)throw Error("CAREER_SYNTHETIC_GRAPH_INVALID:"+index.errors.join("|"));
 const options:CareerSyntheticOption[]=[];
 for(const c of candidates){const source=await catalog.reader.locate(c.record.locator),meaning=meanings.get(c.record.originalId);
  if(c.provenance!=="SYNTHETIC_TEST_ONLY"||c.record.locator.file!==SYNTHETIC_FILE||!c.record.originalId.startsWith("synthetic:career:")||source.code||recordHash(source.value)!==c.record.locator.recordSha256||!isRecord(source.value)||!meaning?.reviewId.startsWith("synthetic:career:review:")||canonicalJson(source.value.meaning)!==canonicalJson(meaning))throw Error("CAREER_SYNTHETIC_MATERIAL_NOT_REGISTERED");
  const receipt=bindKnowledgeCandidate(c,index,catalog,approvals);if(receipt.allTwelveGateResults.map(g=>g.gate).join("|")!==BINDING_HARD_GATES.join("|"))throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
  const sourceQuestionId=source.value.questionId;
  for(const q of questions.filter(q=>q.id===sourceQuestionId)){
   const reasons=receipt.allTwelveGateResults.filter(g=>!["PASS","NOT_APPLICABLE"].includes(g.state)).flatMap(g=>g.reasons);
   if(!q.requiredMeanings.every(m=>meaning.requiredMeanings.includes(m)))reasons.push("QUESTION_REQUIRED_MEANING_MISSING");
   if(q.domain!==meaning.domain||q.context!==meaning.context)reasons.push("QUESTION_DOMAIN_CONTEXT_MISMATCH");
   if(c.requirement.meaningIdentity!==meaning.meaningId||c.requirement.claimIdentity!==meaning.claimId)reasons.push("APPROVED_MEANING_IDENTITY_MISMATCH");
   if(context.jobStatus==="")reasons.push("JOB_STATUS_UNKNOWN");else if(!meaning.jobStatuses.includes(context.jobStatus))reasons.push("JOB_STATUS_CONFLICT");
   if(meaning.functions.length&&(context.effectiveFunction==="unknown"||!meaning.functions.includes(context.effectiveFunction)))reasons.push("WORK_FUNCTION_UNSUPPORTED");
   reasons.push(...checkEnteredRequirements(meaning.economicNeeds,context.economicFacts,"ECONOMIC_REQUIREMENTS_UNKNOWN"),...checkEnteredRequirements(meaning.learningNeeds,context.learningFacts,"LEARNING_REQUIREMENTS_UNKNOWN"));
   if(meaning.recommendationId&&!context.recommendationProofs.some(p=>p.id===meaning.recommendationId&&p.complete&&p.roots.some(r=>receipt.canonicalFactRoots.includes(r))))reasons.push("RECOMMENDATION_PROOF_MISMATCH");
   if(!receipt.canonicalFactRoots.length)reasons.push("VERIFIED_ROOT_REQUIRED");if(q.chapter==="CH09"&&!meaning.recallOf)reasons.push("CH09_ACTUAL_INTRODUCTION_REQUIRED");
   const option:CareerSyntheticOption={id:c.record.originalId,questionId:q.id,receipt,meaning:structuredClone(meaning),roots:receipt.canonicalFactRoots,owner:request.graph.context.owners.person!,mbtiType:request.graphInput.evidence.input.kind==="compatibility"?null:request.graphInput.evidence.input.person.mbtiType||null,eligible:false,reasons,chapter:q.chapter,requiredMeaningCount:q.requiredMeanings.length,jobStatus:context.jobStatus,effectiveFunction:context.effectiveFunction,detailContextId:context.detailContextId};
   reasons.push(...careerRecallReasons(option,ledger));option.reasons=[...new Set(reasons)].sort();option.eligible=receipt.customerApproved&&!option.reasons.length;options.push(option);
  }
 }
 const session:CareerSyntheticSession=Object.freeze({kind:"CAREER_SYNTHETIC_ELIGIBLE_SELECTION_TEST"});sessions.set(session,{options,questions:structuredClone([...questions]),ledger:structuredClone([...ledger])});return session;
}
export function careerSyntheticOptions(session:CareerSyntheticSession){const data=sessions.get(session);if(!data)throw Error("AUTHENTIC_CAREER_SYNTHETIC_SESSION_REQUIRED");return structuredClone(data.options);}
export function selectCareerSynthetic(session:CareerSyntheticSession,method:CareerSelectionMethod,maxVisits=200000):CareerSyntheticSelection{
 if(!Number.isInteger(maxVisits)||maxVisits<1||maxVisits>200000)throw Error("INVALID_CAREER_SEARCH_BUDGET");
 const d=sessions.get(session);if(!d)throw Error("AUTHENTIC_CAREER_SYNTHETIC_SESSION_REQUIRED");if(d.questions.length>24||d.options.length>256)throw Error("EXPLICIT_CAREER_SYNTHETIC_SCOPE_REQUIRED");
 const questions=[...d.questions].sort((a,b)=>a.id.localeCompare(b.id,"en")),byQuestion=new Map(questions.map(q=>[q.id,d.options.filter(o=>o.questionId===q.id&&o.eligible).sort((a,b)=>method==="FIRST_ELIGIBLE"?a.id.localeCompare(b.id,"en"):Number(b.meaning.direct)-Number(a.meaning.direct)||a.id.localeCompare(b.id,"en"))]));
 const objective=(rows:readonly CareerSyntheticOption[])=>{const uses=rows.filter(o=>!o.meaning.recallOf).flatMap(o=>o.roots);return [new Set(rows.map(o=>o.questionId)).size,rows.reduce((n,o)=>n+questions.find(q=>q.id===o.questionId)!.importance,0),rows.reduce((n,o)=>n+o.requiredMeaningCount,0),rows.filter(o=>o.meaning.direct).length,new Set(rows.filter(o=>!o.meaning.recallOf).map(o=>o.meaning.meaningId)).size,-(uses.length-new Set(uses).size),new Set(rows.map(o=>o.meaning.polarity)).size];};
 const compare=(a:number[],b:number[])=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;};
 let selected:CareerSyntheticOption[]=[],visits=0,complete=true;
 if(method!=="CONSTRAINT_AWARE_SELECTION")for(const q of questions){const next=byQuestion.get(q.id)!.find(o=>!careerSelectionViolations([...selected,o],d.ledger).length);if(next)selected.push(next);}
 else{let best:CareerSyntheticOption[]=[];const visit=(i:number,rows:CareerSyntheticOption[])=>{if(++visits>maxVisits){complete=false;return;}if(rows.length+questions.length-i<best.length)return;if(i===questions.length){const order=compare(objective(rows),objective(best));if(order>0||order===0&&rows.map(o=>o.id).join("|")<best.map(o=>o.id).join("|"))best=[...rows];return;}for(const o of byQuestion.get(questions[i].id)!)if(!careerSelectionViolations([...rows,o],d.ledger).length)visit(i+1,[...rows,o]);visit(i+1,rows);};visit(0,[]);selected=best;}
 const roots=selected.filter(o=>!o.meaning.recallOf).flatMap(o=>o.roots),score=objective(selected),conflicts=careerSelectionViolations(selected,d.ledger);if(!complete)conflicts.push("SEARCH_LIMIT_NO_OPTIMALITY_CLAIM");
 return {method,selected:selected.map(o=>({questionId:o.questionId,candidateId:o.id})),coveredQuestions:score[0],importanceCovered:score[1],requiredMeaningUnits:score[2],independentMeanings:score[4],roots:{distinct:new Set(roots).size,references:roots.length,repeated:roots.length-new Set(roots).size},conflicts,missingQuestions:questions.filter(q=>!selected.some(o=>o.questionId===q.id)).map(q=>q.id),search:{visits,complete},notSelected:d.options.filter(o=>!selected.includes(o)).map(o=>({id:o.id,reasons:o.eligible?careerSelectionViolations([...selected,o],d.ledger).length?careerSelectionViolations([...selected,o],d.ledger):["GLOBAL_RESERVATION_OR_LEXICOGRAPHIC_PREFERENCE"]:o.reasons})),customerClaimsEmitted:0};
}
