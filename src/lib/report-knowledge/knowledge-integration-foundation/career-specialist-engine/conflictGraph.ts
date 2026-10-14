import { resolveMeaningRelationship } from "../comprehensive-specialist-engine/meaningIdentity";
import type { CareerSpecialistIndex } from "./candidateIndex";
import type { CareerSelectionReceipt, CareerConflictRelation } from "./types";
export function careerMaterialConflicts(index:CareerSpecialistIndex,ds:readonly CareerSelectionReceipt[]){
 const byId=new Map(ds.map(d=>[d.catalogKey,d])),buckets=new Map<string,string[]>(),pairs=new Set<string>(),edges:CareerConflictRelation[]=[];
 const add=(key:string,id:string)=>buckets.set(key,[...(buckets.get(key)??[]),id]);
 for(const d of ds){const c=index.candidates.get(d.catalogKey)!;for(const r of d.roots)add("root:"+r,d.catalogKey);for(const f of c.material.semanticFacets)add("axis:"+f.axis,d.catalogKey);for(const p of c.material.precedingMeaningRefs){const target=index.byOriginalId.get(p);if(target)pairs.add(JSON.stringify([d.catalogKey,target].sort()));}
  const put=(kind:CareerConflictRelation["kind"],reason:string,state:CareerConflictRelation["state"]="REVIEW_REQUIRED")=>edges.push({left:d.catalogKey,right:d.catalogKey,kind,state,blocksJointPrimary:state==="VERIFIED",reasons:[reason]});
  if(d.job.state==="CONFLICT")put("JOB_STATUS_CONFLICT","EXACT_INPUT_STATUS_OUTSIDE_ORIGINAL_SCOPE","VERIFIED");
  if(d.recommendation.required&&!d.recommendation.proofMatched)put("RECOMMENDATION_PROOF_MISMATCH","ORIGINAL_RECOMMENDATION_PROOF_CONTRACT_UNRESOLVED");
  if(c.material.chapterId==="CH06")put("ECONOMIC_MEANING_CONFLICT","SYMBOL_OR_PREFERENCE_IS_NOT_ACTUAL_ENTERED_FINANCIAL_RESULT");
  if(c.material.chapterId==="CH07")put("LEARNING_MEANING_CONFLICT","PREFERENCE_IS_NOT_VERIFIED_PERFORMANCE_OR_QUALIFICATION");
 }
 for(const ids of buckets.values()){const u=[...new Set(ids)].sort();for(let i=0;i<u.length;i++)for(const b of u.slice(i+1))pairs.add(JSON.stringify([u[i],b]));}
 const relations=[];
 for(const pair of [...pairs].sort()){const[a,b]=JSON.parse(pair) as [string,string],da=byId.get(a)!,db=byId.get(b)!,ca=index.candidates.get(a)!,cb=index.candidates.get(b)!;
 const view=(d:CareerSelectionReceipt,c:typeof ca)=>({id:d.catalogKey,roots:d.roots,meaningId:c.meaning.meaningId,claimId:c.meaning.claimId,question:c.material.readerQuestion,conditions:Object.values(c.material.prerequisites).filter((x):x is string=>typeof x==="string"),action:c.material.action,context:[c.material.address],reviewed:false,recall:c.material.researchKind==="recall",actuallyDisplayed:false});
 relations.push(resolveMeaningRelationship(view(da,ca),view(db,cb)));
 const put=(kind:CareerConflictRelation["kind"],reason:string,state:CareerConflictRelation["state"]="REVIEW_REQUIRED")=>edges.push({left:a,right:b,kind,state,blocksJointPrimary:false,reasons:[reason]});
 if(da.roots.some(r=>db.roots.includes(r)))put("SAME_UNDERLYING_FACT","EXACT_EXISTING_CANONICAL_ROOT_INTERSECTION","VERIFIED");
 if(ca.material.address!==cb.material.address)put("DIFFERENT_APPLICATION","DIFFERENT_READER_QUESTION_REQUIRES_MEANING_REVIEW");
 if(ca.functions.jobResearch.length&&cb.functions.jobResearch.length&&!ca.functions.jobResearch.some(j=>cb.functions.jobResearch.some(k=>k.observedFunction===j.observedFunction)))put("DIFFERENT_WORK_FUNCTION","JOB_RESEARCH_FUNCTION_IS_NOT_PERSONAL_SKILL");
 if(ca.material.precedingMeaningRefs.includes(cb.material.id)||cb.material.precedingMeaningRefs.includes(ca.material.id))put("RECALL_REQUIRES_INTRODUCTION","ORIGINAL_PRECEDING_REF_IS_NOT_ACTUAL_DISPLAY","VERIFIED");
 if(da.semanticSignals.some(x=>x.signed&&db.semanticSignals.some(y=>y.signed&&x.axis===y.axis&&x.value*y.value<0)))put("CONDITIONAL_TENSION","ACTUAL_OPPOSITE_SIGNALS_REQUIRE_CONTEXT_REVIEW");
 }
 return {relations,edges,rootIndex:Object.fromEntries([...buckets].filter(([k])=>k.startsWith("root:")).map(([k,v])=>[k.slice(5),[...new Set(v)].sort()])),duplicateFactGroups:[...buckets].filter(([k,v])=>k.startsWith("root:")&&new Set(v).size>1).map(([k,v])=>({root:k.slice(5),materials:[...new Set(v)].sort()}))};
}
