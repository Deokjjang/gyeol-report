import { canonicalJson,hash,recordHash } from "../sourceReader";
import { isRecord } from "../normalization";
import { BINDING_HARD_GATES } from "../types";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest,KnowledgeCandidate,KnowledgeBindingApprovalProvider } from "../knowledge-binder/types";
import { validateLoveApplication,matchRelationshipStatus } from "./relationshipContext";
import { sourceDomainBoundary } from "./evidenceBoundaries";
import { loveRecallReasons,loveSelectionViolations } from "./reuseConstraints";
import type { LoveSyntheticMeaning,LoveSyntheticQuestion,LoveEnteredContext,LoveIntroduction,LoveSyntheticOption,LoveSyntheticSession,LoveSelectionMethod,LoveSelection } from "./types";
export const SYNTHETIC_FILE="tests/fixtures/love-specialist-engine-01/synthetic-knowledge.json";
const sessions=new WeakMap<LoveSyntheticSession,{options:LoveSyntheticOption[];questions:LoveSyntheticQuestion[];ledger:LoveIntroduction[]}>();
export async function createLoveSyntheticSession(catalog:KnowledgeBinderCatalog,request:KnowledgeBindingRequest,candidates:readonly KnowledgeCandidate[],questions:readonly LoveSyntheticQuestion[],meanings:ReadonlyMap<string,LoveSyntheticMeaning>,approvals:KnowledgeBindingApprovalProvider,context:LoveEnteredContext,ledger:readonly LoveIntroduction[]=[]):Promise<LoveSyntheticSession>{
 if(request.product!=="love_marriage_child"||request.relationship!==null||!request.graph.context.fixtureId.startsWith("synthetic:love:")||request.graph.nodes.some(n=>n.producer.file!==SYNTHETIC_FILE||!n.owner.fixtureOwnerId.startsWith("synthetic:love:")||n.fact.rootId&&!n.fact.rootId.startsWith("synthetic:love:root:"))||catalog.input.records.length!==candidates.length||catalog.input.records.some(r=>r.family!=="love-specialist-synthetic-fixture"||r.locator.file!==SYNTHETIC_FILE||!r.originalId.startsWith("synthetic:love:")))throw Error("LOVE_SYNTHETIC_ISOLATION_REQUIRED");
 if(hash(catalog.reader.text(SYNTHETIC_FILE))!==catalog.input.frozen.get(SYNTHETIC_FILE))throw Error("LOVE_SYNTHETIC_SOURCE_CHANGED");
 const declared=catalog.reader.json(SYNTHETIC_FILE);if(!isRecord(declared)||!Array.isArray(declared.questions)||!Array.isArray(declared.enterableFacts))throw Error("LOVE_SYNTHETIC_REGISTRY_REQUIRED");
 const enterable=declared.enterableFacts;if([...context.partnerFacts,...context.marriageFacts,...context.childFacts].some(f=>!enterable.includes(f)))throw Error("UNREGISTERED_SYNTHETIC_ENTERED_FACT");
 for(const q of questions)if(!declared.questions.some(r=>canonicalJson(r)===canonicalJson(q)))throw Error("LOVE_SYNTHETIC_QUESTION_NOT_REGISTERED");
 if(ledger.some(l=>!l.displayRecord.startsWith("synthetic:love:")||!l.materialId.startsWith("synthetic:love:")))throw Error("LOVE_SYNTHETIC_DISPLAY_REQUIRED");
 const input=request.graphInput.evidence.input;if(input.kind==="compatibility"||input.userContext.relationshipStatus!==context.relationshipStatus||request.actualUserState.relationshipStatus!==context.relationshipStatus||!request.graph.nodes.some(n=>n.kind==="CONTEXT_INPUT"&&n.owner.fixtureOwnerId===request.graph.context.owners.person&&n.status==="VERIFIED"&&canonicalJson(n.value)===canonicalJson(context)))throw Error("VERIFIED_SYNTHETIC_LOVE_CONTEXT_REQUIRED");
 const index=new ActualBindingIndex(request,catalog);if(index.errors.length)throw Error("LOVE_SYNTHETIC_GRAPH_INVALID:"+index.errors.join("|"));
 const options:LoveSyntheticOption[]=[];
 for(const c of candidates){const source=await catalog.reader.locate(c.record.locator),meaning=meanings.get(c.record.originalId);
  if(c.provenance!=="SYNTHETIC_TEST_ONLY"||c.record.locator.file!==SYNTHETIC_FILE||source.code||recordHash(source.value)!==c.record.locator.recordSha256||!isRecord(source.value)||!meaning?.reviewId.startsWith("synthetic:love:review:")||canonicalJson(source.value.meaning)!==canonicalJson(meaning))throw Error("LOVE_SYNTHETIC_MATERIAL_NOT_REGISTERED");
  const receipt=bindKnowledgeCandidate(c,index,catalog,approvals);if(receipt.allTwelveGateResults.map(g=>g.gate).join("|")!==BINDING_HARD_GATES.join("|"))throw Error("ORIGINAL_TWELVE_GATES_REQUIRED");
  const sourceQuestionId=source.value.questionId;
  for(const q of questions.filter(q=>q.id===sourceQuestionId)){
   const reasons=receipt.allTwelveGateResults.filter(g=>!["PASS","NOT_APPLICABLE"].includes(g.state)).flatMap(g=>g.reasons);
   if(!q.requiredMeanings.every(m=>meaning.requiredMeanings.includes(m)))reasons.push("QUESTION_REQUIRED_MEANING_MISSING");
   if(q.domain!==meaning.domain||q.context!==meaning.context)reasons.push("QUESTION_DOMAIN_CONTEXT_MISMATCH");
   if(c.requirement.meaningIdentity!==meaning.meaningId||c.requirement.claimIdentity!==meaning.claimId)reasons.push("APPROVED_MEANING_IDENTITY_MISMATCH");
   const status=matchRelationshipStatus(context.relationshipStatus,meaning.relationshipStatuses,meaning.conditions);if(!status.scopeMatched||status.actual==="")reasons.push(...status.reasons);
   const ancestors=[...new Map(receipt.selectedActualEvidence.flatMap(id=>{const n=index.graph.nodes.get(id);return n?index.ancestors(n):[]}).map(n=>[n.id,n])).values()];
   const boundaries=sourceDomainBoundary([...meaning.sourceDomains.map(domain=>({domain})),...ancestors.map(n=>({domain:isRecord(n.value)&&typeof n.value.sourceDomain==="string"?n.value.sourceDomain:null,classification:isRecord(n.value)&&typeof n.value.classification==="string"?n.value.classification:null,pointer:isRecord(n.value)&&typeof n.value.sourcePath==="string"?n.value.sourcePath:null}))]);
   const ownParent=ancestors.some(n=>n.kind==="MBTI_SOURCE_NODE"&&n.status==="VERIFIED"&&n.owner.fixtureOwnerId===request.graph.context.owners.person&&isRecord(n.value)&&n.value.type===input.person.mbtiType&&n.value.sourceDomain==="PARENTS"&&n.value.classification==="SCORING_SEMANTIC");
   const symbol=meaning.application.symbol,symbolVerified=!!symbol&&symbol!=="HONGYEOM"&&ancestors.some(n=>n.kind==="CALCULATED_NATAL_FACT"&&n.status==="VERIFIED"&&isRecord(n.value)&&n.value.syntheticSymbol===symbol);
   reasons.push(...validateLoveApplication(meaning.application,context,{pairBlocked:boundaries.pairBlocked,childBlocked:boundaries.childBlocked,ownParentSource:ownParent,symbolVerified}).reasons);
   if(!receipt.canonicalFactRoots.length)reasons.push("VERIFIED_ROOT_REQUIRED");if(/^CH09\.P[34]$/.test(q.address)&&!meaning.recallOf)reasons.push("CH09_ACTUAL_INTRODUCTION_REQUIRED");
   const option:LoveSyntheticOption={id:c.record.originalId,questionId:q.id,receipt,meaning:structuredClone(meaning),roots:receipt.canonicalFactRoots,owner:request.graph.context.owners.person!,mbtiType:input.person.mbtiType||null,eligible:false,reasons,chapter:q.chapter,requiredMeaningCount:q.requiredMeanings.length,relationshipStatus:context.relationshipStatus,contextId:context.contextId};
   reasons.push(...loveRecallReasons(option,ledger));option.reasons=[...new Set(reasons)].sort();option.eligible=receipt.customerApproved&&!option.reasons.length;options.push(option);
  }
 }
 const session:LoveSyntheticSession=Object.freeze({kind:"LOVE_SYNTHETIC_ELIGIBLE_SELECTION_TEST"});sessions.set(session,{options,questions:structuredClone([...questions]),ledger:structuredClone([...ledger])});return session;
}
export function loveSyntheticOptions(session:LoveSyntheticSession){const d=sessions.get(session);if(!d)throw Error("AUTHENTIC_LOVE_SYNTHETIC_SESSION_REQUIRED");return structuredClone(d.options);}
export function loveRoleFunctions(options:readonly LoveSyntheticOption[]){return [...new Set(options.flatMap(o=>[o.meaning.polarity,...(o.meaning.application.repair?["repair"]:[])]))].sort();}
export function selectLoveSynthetic(session:LoveSyntheticSession,method:LoveSelectionMethod,maxVisits=200000):LoveSelection{
 if(!Number.isInteger(maxVisits)||maxVisits<1||maxVisits>200000)throw Error("INVALID_LOVE_SEARCH_BUDGET");
 const d=sessions.get(session);if(!d)throw Error("AUTHENTIC_LOVE_SYNTHETIC_SESSION_REQUIRED");if(d.questions.length>24||d.options.length>256)throw Error("EXPLICIT_LOVE_SYNTHETIC_SCOPE_REQUIRED");
 const questions=[...d.questions].sort((a,b)=>a.id.localeCompare(b.id,"en")),byQuestion=new Map(questions.map(q=>[q.id,d.options.filter(o=>o.questionId===q.id&&o.eligible).sort((a,b)=>method==="FIRST_ELIGIBLE"?a.id.localeCompare(b.id,"en"):Number(b.meaning.direct)-Number(a.meaning.direct)||a.id.localeCompare(b.id,"en"))]));
 const objective=(rows:readonly LoveSyntheticOption[])=>{const uses=rows.filter(o=>!o.meaning.recallOf).flatMap(o=>o.roots);return [new Set(rows.map(o=>o.questionId)).size,rows.reduce((n,o)=>n+questions.find(q=>q.id===o.questionId)!.importance,0),rows.reduce((n,o)=>n+o.requiredMeaningCount,0),rows.filter(o=>o.meaning.direct).length,new Set(rows.filter(o=>!o.meaning.recallOf).map(o=>o.meaning.meaningId)).size,-(uses.length-new Set(uses).size),loveRoleFunctions(rows).length];};
 const compare=(a:number[],b:number[])=>{for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;};let selected:LoveSyntheticOption[]=[],visits=0,complete=true;
 if(method!=="CONSTRAINT_AWARE_SELECTION")for(const q of questions){const next=byQuestion.get(q.id)!.find(o=>!loveSelectionViolations([...selected,o],d.ledger).length);if(next)selected.push(next);}
 else{let best:LoveSyntheticOption[]=[];const visit=(i:number,rows:LoveSyntheticOption[])=>{if(++visits>maxVisits){complete=false;return;}if(rows.length+questions.length-i<best.length)return;if(i===questions.length){const order=compare(objective(rows),objective(best));if(order>0||order===0&&rows.map(o=>o.id).join("|")<best.map(o=>o.id).join("|"))best=[...rows];return;}for(const o of byQuestion.get(questions[i].id)!)if(!loveSelectionViolations([...rows,o],d.ledger).length)visit(i+1,[...rows,o]);visit(i+1,rows);};visit(0,[]);selected=best;}
 const roots=selected.filter(o=>!o.meaning.recallOf).flatMap(o=>o.roots),score=objective(selected),conflicts=loveSelectionViolations(selected,d.ledger);if(!complete)conflicts.push("SEARCH_LIMIT_NO_OPTIMALITY_CLAIM");
 return {method,selected:selected.map(o=>({questionId:o.questionId,candidateId:o.id})),coveredQuestions:score[0],importanceCovered:score[1],requiredMeaningUnits:score[2],independentMeanings:score[4],roots:{distinct:new Set(roots).size,references:roots.length,repeated:roots.length-new Set(roots).size},conflicts,missingQuestions:questions.filter(q=>!selected.some(o=>o.questionId===q.id)).map(q=>q.id),search:{visits,complete},notSelected:d.options.filter(o=>!selected.includes(o)).map(o=>({id:o.id,reasons:o.eligible?loveSelectionViolations([...selected,o],d.ledger).length?loveSelectionViolations([...selected,o],d.ledger):["GLOBAL_RESERVATION_OR_LEXICOGRAPHIC_PREFERENCE"]:o.reasons})),invalidPartnerChildInferences:0,customerClaimsEmitted:0};
}
