import { verifyActualSourceGroup } from "../actual-evidence-graph/groups";
import type { KnowledgeCandidate, KnowledgeBindingMatch, KnowledgeBindingReceipt, KnowledgeBindingRequest } from "./types";
import type { ActualBindingIndex } from "./matching";
import type { KnowledgeBinderCatalog } from "./catalog";
export function evaluateSourceGroups(c:KnowledgeCandidate,matches:readonly KnowledgeBindingMatch[],index:ActualBindingIndex,catalog:KnowledgeBinderCatalog):KnowledgeBindingReceipt["sourceGroupEvaluation"]{
 const q=c.requirement,byId=new Map(matches.map(m=>[m.requirementId,m]));
 const result=q.sourceGroups.map(g=>{
  const reasons:string[]=[];
  if(g.originalTechnicalState!=="DECLARED_SOURCES_VERIFIED")reasons.push("INHERITED_SOURCE_GROUP_HELD");
  if(!g.sourceRequirementIds.length)reasons.push("SOURCE_GROUP_CONTRACT_MISSING");
  if(g.sourceRequirementIds.some(id=>byId.get(id)?.state!=="PASS"))reasons.push("ALL_AND_GROUP_SOURCES_REQUIRED");
  for(const t of g.typePredicates){const owner=index.owner(t.owner),type=index.request.graphInput.evidence.input.kind==="compatibility"?(t.owner==="A"?index.request.graphInput.evidence.input.personA.mbtiType:t.owner==="B"?index.request.graphInput.evidence.input.personB.mbtiType:null):index.request.graphInput.evidence.input.person.mbtiType;if(!owner||type!==t.type)reasons.push("SOURCE_GROUP_OWNER_TYPE_MISMATCH");}
  if(g.requiresDisplayedLedger){const body=typeof g.originalId==="string"?g.originalId:null;const displayed=(index.request.introducedLedger??[]).find(l=>l.actuallyDisplayed&&l.materialId===body&&l.product===index.request.product&&l.relationship===index.request.relationship&&l.ownerIds.every(o=>Object.values(index.request.graph.context.owners).includes(o))&&l.nodeIds.every(id=>index.graph.nodes.has(id)));if(!displayed)reasons.push("ACTUALLY_DISPLAYED_COMPATIBLE_GROUP_REQUIRED");}
  const original=catalog.input.sourceGroups.find(o=>o.catalogKey===c.record.catalogKey),specs=q.sourceRequirements.filter(s=>g.sourceRequirementIds.includes(s.id)&&s.selector),ownerSet=new Set(specs.map(s=>index.owner(s.owner)));
  if(original&&ownerSet.size===1&&specs.length){const sources=new Map(specs.flatMap(s=>{const m=byId.get(s.id)?.matchedActualEvidence[0],n=m?index.graph.nodes.get(m.nodeId):null;return s.sourceKey&&n?[[s.sourceKey,n]as const]:[]}));const checked=verifyActualSourceGroup(original,g.originalIndex,sources,[...ownerSet][0]??"",!g.requiresDisplayedLedger||!reasons.includes("ACTUALLY_DISPLAYED_COMPATIBLE_GROUP_REQUIRED"));reasons.push(...checked.reasons);}
  return {groupIndex:g.originalIndex,state:reasons.length?"FAIL" as const:"PASS" as const,reasons:[...new Set(reasons)].sort(),selected:false};
 });
 if(q.sourceGroupSemantics==="AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS"){const selected=result.find(g=>g.state==="PASS");if(selected)selected.selected=true;}
 else for(const g of result)g.selected=g.state==="PASS";
 return result;
}
export function activeRequirements(c:KnowledgeCandidate,groups:KnowledgeBindingReceipt["sourceGroupEvaluation"]){
 const q=c.requirement;if(q.sourceGroupSemantics!=="AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS")return q.sourceRequirements.filter(s=>s.required);
 const conditional=new Set(q.sourceGroups.flatMap(g=>g.sourceRequirementIds)),chosen=new Set(q.sourceGroups.filter(g=>groups.some(r=>r.selected&&r.groupIndex===g.originalIndex)).flatMap(g=>g.sourceRequirementIds));
 return q.sourceRequirements.filter(s=>s.required&&(!conditional.has(s.id)||chosen.has(s.id)));
}
export function displayedRecall(c:KnowledgeCandidate,request:KnowledgeBindingRequest,nodeIds:readonly string[],rootIds:readonly string[]){
 if(!c.requirement.requiresIntroducedLedger)return {ok:true,reasons:[]};
 const ledger=request.introducedLedger??[],ids=c.requirement.introducedIds;
 if(!ids.length)return {ok:false,reasons:["INTRODUCED_MEANING_CONTRACT_MISSING"]};
 const compatible=ids.filter(id=>ledger.some(l=>l.materialId===id&&l.actuallyDisplayed&&l.product===request.product&&l.relationship===request.relationship&&l.ownerIds.every(o=>Object.values(request.graph.context.owners).includes(o))&&l.nodeIds.every(n=>nodeIds.includes(n))&&l.rootIds.every(r=>rootIds.includes(r))&&(!l.direction||c.requirement.requiredDirection.includes(l.direction))&&l.context.every(x=>request.contexts.includes(x))));
 return {ok:compatible.length>0,reasons:compatible.length?[]:["ACTUALLY_DISPLAYED_COMPATIBLE_MEANING_REQUIRED"]};
}
