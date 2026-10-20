import { resolveMeaningRelationship } from "../comprehensive-specialist-engine/meaningIdentity";
import type { LoveSpecialistIndex } from "./candidateIndex";
import type { LoveDiagnostic, LoveConflict } from "./types";
export function loveMaterialConflicts(index:LoveSpecialistIndex,ds:readonly LoveDiagnostic[]){
 const byId=new Map<string,LoveDiagnostic>(ds.map(d=>[d.catalogKey,d])),buckets=new Map<string,string[]>(),pairs=new Set<string>(),edges:LoveConflict[]=[];
 const add=(key:string,id:string)=>buckets.set(key,[...(buckets.get(key)??[]),id]);
 for(const d of ds){const c=index.candidates.get(d.catalogKey)!;for(const r of d.roots)add("root:"+r,d.catalogKey);for(const f of c.material.semanticFacets)add("axis:"+f.axis,d.catalogKey);for(const p of c.material.precedingMeaningRefs){const target=index.byOriginalId.get(p);if(target)pairs.add(JSON.stringify([d.catalogKey,target].sort()));}
  const put=(kind:LoveConflict["kind"],reason:string,state:LoveConflict["state"]="REVIEW_REQUIRED")=>edges.push({left:d.catalogKey,right:d.catalogKey,kind,state,blocksJointPrimary:state==="VERIFIED",reasons:[reason]});
  if(d.status.state==="STATUS_CONFLICT")put("RELATIONSHIP_STATUS_CONFLICT","EXACT_CURRENT_INPUT_STATUS_OUTSIDE_ORIGINAL_SCOPE","VERIFIED");
  if(d.boundary.partnerWithheld)put("PARTNER_FACT_REQUIRED","SINGLE_PERSON_INPUT_DOES_NOT_SUPPLY_PARTNER_FACTS","VERIFIED");
  if(d.ancestry.pairBlocked)put("PARTNER_FACT_REQUIRED","REQUIRED_PAIR_ANCESTRY_IS_NOT_PERSONAL_EVIDENCE","VERIFIED");
  if(d.ancestry.childBlocked)put("PARENTING_SOURCE_BOUNDARY","REQUIRED_CHILD_SOURCE_IS_NOT_PARENT","VERIFIED");
  if(c.material.chapterId==="CH02"||c.material.chapterId==="CH03")put("RECIPIENT_REACTION_UNKNOWN","OWN_STRENGTH_OR_PREFERENCE_IS_NOT_ACTUAL_RECIPIENT_RESPONSE");
  if(c.material.chapterId==="CH07")put("MARRIAGE_CONTEXT_REQUIRED","MARRIAGE_STATE_DOES_NOT_PROVE_LIVING_MONEY_OR_CONSENT");
  if(c.material.chapterId==="CH08")put("CHILD_FACT_REQUIRED","OWN_PARENTING_SOURCE_DOES_NOT_PROVE_CHILD_EXISTS_AGE_OR_DEVELOPMENT");
  if(d.boundary.unsafeRepair)put("UNSAFE_REPAIR_ASSUMPTION","ACTUAL_SAFETY_AND_VOLUNTARY_CONSENT_UNKNOWN");
  if(d.positiveSymbols.some(s=>!s.matched))put("POSITIVE_SYMBOL_NOT_CALCULATED","ORIGINAL_SYMBOL_APPLICATION_REQUIRES_NATIVE_FACT_AND_SOURCE_REVIEW");
 }
 for(const ids of buckets.values()){const u=[...new Set(ids)].sort();for(let i=0;i<u.length;i++)for(const b of u.slice(i+1))pairs.add(JSON.stringify([u[i],b]));}
 const relations=[];
 for(const pair of [...pairs].sort()){const[a,b]=JSON.parse(pair)as[string,string],da=byId.get(a)!,db=byId.get(b)!,ca=index.candidates.get(a)!,cb=index.candidates.get(b)!;
  const view=(d:LoveDiagnostic,c:typeof ca)=>({id:d.catalogKey,roots:d.roots,meaningId:c.meaningId,claimId:c.claimId,question:c.material.readerQuestion,conditions:Object.values(c.material.prerequisites).filter((x):x is string=>typeof x==="string"),action:c.material.repairAction,context:[c.material.address],reviewed:false,recall:c.material.researchKind==="recall",actuallyDisplayed:false});
  relations.push(resolveMeaningRelationship(view(da,ca),view(db,cb)));
  const put=(kind:LoveConflict["kind"],reason:string,state:LoveConflict["state"]="REVIEW_REQUIRED")=>edges.push({left:a,right:b,kind,state,blocksJointPrimary:false,reasons:[reason]});
  if(da.roots.some(r=>db.roots.includes(r)))put("SAME_UNDERLYING_FACT","EXACT_CANONICAL_ROOT_INTERSECTION","VERIFIED");
  if(ca.material.address!==cb.material.address)put("DIFFERENT_RELATIONSHIP_APPLICATION","DIFFERENT_READER_QUESTION_AND_TARGET_REQUIRE_MEANING_REVIEW");
  if(!ca.material.relationshipStatuses.some(s=>cb.material.relationshipStatuses.includes(s)))put("RELATIONSHIP_STATUS_CONFLICT","DISJOINT_ORIGINAL_CURRENT_STATUS_SCOPES","VERIFIED");
  if(ca.material.precedingMeaningRefs.includes(cb.material.id)||cb.material.precedingMeaningRefs.includes(ca.material.id))put("RECALL_REQUIRES_INTRODUCTION","CANDIDATE_OR_PLANNED_SELECTION_IS_NOT_ACTUAL_DISPLAY","VERIFIED");
  if(da.semanticSignals.some(x=>x.signed&&db.semanticSignals.some(y=>y.signed&&x.axis===y.axis&&x.value*y.value<0)))put("CONDITIONAL_TENSION","OPPOSITE_ACTUAL_SIGNALS_REQUIRE_REVIEWED_SPLIT");
 }
 return {relations,edges,rootIndex:Object.fromEntries([...buckets].filter(([k])=>k.startsWith("root:")).map(([k,v])=>[k.slice(5),[...new Set(v)].sort()])),duplicateFactGroups:[...buckets].filter(([k,v])=>k.startsWith("root:")&&new Set(v).size>1).map(([k,v])=>({root:k.slice(5),materials:[...new Set(v)].sort()}))};
}
