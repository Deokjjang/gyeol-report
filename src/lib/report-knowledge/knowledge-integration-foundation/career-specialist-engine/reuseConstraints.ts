import { checkSyntheticRecall } from "../comprehensive-specialist-engine/reuseConstraints";
import { resolveMeaningRelationship } from "../comprehensive-specialist-engine/meaningIdentity";
import type { CareerSyntheticOption, CareerIntroduction, CareerConflictRelation } from "./types";
export const CAREER_REUSE_CONTRACT=Object.freeze({releaseSource:"src/lib/interpretation-v4/careerReleaseRenderer.ts#eligible/application",positiveFacetMax:4,facetUnit:"CAREER_RELEASE_MATERIALS key",sameChapterPositiveFacetMax:1,riskAndRecallExemptFromPositiveFacetCap:true,rootHardCap:null,rootUsePolicy:"Existing Release atom use count is a sorting preference, not a hard cap",rootUnit:"CareerReleaseSource.atom.id",canonicalRootBridge:"IDENTITY_BRIDGE_UNVERIFIED",researchFacetBridge:"IDENTITY_BRIDGE_UNVERIFIED_NO_NEW_FACET_BUDGET",internalSelection:{source:"src/lib/interpretation-v4/careerProductSelection.ts#take",duplicateGroupDefaultMax:1,verifiedRiskRepeatMax:2,sameQuestionBroadThemeMax:1,readerBridge:"READER_INTERNAL_QUESTION_BRIDGE_UNVERIFIED"},realIntroducedLedgerIssued:false});
export function careerRecallReasons(o:CareerSyntheticOption,ledger:readonly CareerIntroduction[]):string[]{
  const general=checkSyntheticRecall(o,ledger);if(!o.meaning.recallOf)return general;
  const actual=ledger.some(l=>l.materialId===o.meaning.recallOf&&l.jobStatus===o.jobStatus&&l.effectiveFunction===o.effectiveFunction&&l.detailContextId===o.detailContextId&&o.meaning.compatiblePriorQuestions.includes(l.questionId)&&checkSyntheticRecall(o,[l]).length===0);
  return [...general,...(!actual?["ACTUAL_COMPATIBLE_JOB_CONTEXT_QUESTION_AND_DISPLAY_REQUIRED"]:[])];
}
export function syntheticCareerConflicts(options:readonly CareerSyntheticOption[]):CareerConflictRelation[]{
 const edges:CareerConflictRelation[]=[];
 for(let i=0;i<options.length;i++)for(const b of options.slice(i+1)){const a=options[i],ma=a.meaning,mb=b.meaning;const put=(kind:CareerConflictRelation["kind"],blocks:boolean,reason:string,state:CareerConflictRelation["state"]="VERIFIED")=>edges.push({left:a.id,right:b.id,kind,state,blocksJointPrimary:blocks,reasons:[reason]});
  if(a.roots.some(r=>b.roots.includes(r)))put("SAME_UNDERLYING_FACT",false,"EXACT_REGISTERED_ROOT_INTERSECTION");
  const view=(o:CareerSyntheticOption)=>({id:o.id,roots:o.roots,meaningId:o.meaning.meaningId,claimId:o.meaning.claimId,question:o.questionId,conditions:o.meaning.conditions,action:o.meaning.action,context:[o.meaning.context],reviewed:true,recall:!!o.meaning.recallOf,actuallyDisplayed:o.eligible&&!!o.meaning.recallOf});
  const relation=resolveMeaningRelationship(view(a),view(b));
  if(!ma.recallOf&&!mb.recallOf&&(ma.claimId===mb.claimId||ma.meaningId===mb.meaningId&&relation.relation!=="NEW_APPLICATION"))put("SAME_MEANING",true,"REVIEWED_SAME_PRIMARY_MEANING");
  if(relation.relation==="NEW_APPLICATION")put("DIFFERENT_APPLICATION",false,"REVIEWED_QUESTION_CONDITION_ACTION_DIFFERENCE");
  if(ma.functions.length&&mb.functions.length&&!ma.functions.some(f=>mb.functions.includes(f)))put("DIFFERENT_WORK_FUNCTION",false,"DIFFERENT_REGISTERED_TASK_FUNCTIONS");
  if(a.jobStatus!==b.jobStatus)put("JOB_STATUS_CONFLICT",true,"SAME_PERSON_CURRENT_STATUS_CANNOT_DIFFER");
  if(a.detailContextId!==b.detailContextId)put("CONTEXT_CONFLICT",true,"DIFFERENT_ACTUAL_CURRENT_CONTEXT");
  if(ma.exclusiveWith.includes(b.id)||mb.exclusiveWith.includes(a.id))put("CONTEXT_CONFLICT",true,"EXPLICIT_REVIEWED_EXCLUSION");
  if(ma.axis&&mb.axis&&ma.axis.id===mb.axis.id&&ma.axis.direction!==mb.axis.direction){const split=ma.verifiedSplitWith.includes(b.id)||mb.verifiedSplitWith.includes(a.id),different=ma.context!==mb.context;put("CONDITIONAL_TENSION",!split&&!different,"OPPOSITE_SIGNALS_REQUIRE_REVIEWED_SPLIT_OR_DISTINCT_CONTEXT",split||different?"VERIFIED":"REVIEW_REQUIRED");}
  if(ma.verifiedComplementWith.includes(b.id)||mb.verifiedComplementWith.includes(a.id))put("CONDITIONAL_COMPLEMENT",false,"EXPLICIT_REVIEWED_COMPLEMENT");
  if(ma.recallOf===b.id||mb.recallOf===a.id)put("RECALL_REQUIRES_INTRODUCTION",!a.eligible||!b.eligible,"PLANNED_SELECTION_IS_NOT_DISPLAY");
 }
 return edges.sort((a,b)=>JSON.stringify([a.left,a.right,a.kind]).localeCompare(JSON.stringify([b.left,b.right,b.kind]),"en"));
}
export function careerSelectionViolations(options:readonly CareerSyntheticOption[],ledger:readonly CareerIntroduction[]):string[]{
 const errors:string[]=[],facets=new Map<string,number>(),chapterFacets=new Set<string>(),questions=new Set<string>(),groups=new Map<string,number>();
 for(const o of options){if(!o.eligible)errors.push("INELIGIBLE:"+o.id);if(questions.has(o.questionId))errors.push("QUESTION_ASSIGNED_TWICE");questions.add(o.questionId);errors.push(...careerRecallReasons(o,ledger));if(o.meaning.recallOf)continue;
   if(o.meaning.polarity!=="risk"){const key=o.chapter+":"+o.meaning.facet;if(chapterFacets.has(key))errors.push("SAME_CHAPTER_POSITIVE_FACET_REUSE");chapterFacets.add(key);facets.set(o.meaning.facet,(facets.get(o.meaning.facet)??0)+1);}
   const key=o.meaning.duplicateGroup??o.meaning.semanticTheme;if(key){groups.set(key,(groups.get(key)??0)+1);}
 }
 for(const [key,n]of groups){const repeatedRisk=options.some(o=>(o.meaning.duplicateGroup??o.meaning.semanticTheme)===key&&o.meaning.verifiedRiskRepeat&&o.meaning.polarity==="risk");if(n>(repeatedRisk?2:1))errors.push("INTERNAL_DUPLICATE_GROUP_CONTRACT");}
 if([...facets.values()].some(n=>n>CAREER_REUSE_CONTRACT.positiveFacetMax))errors.push("CAREER_POSITIVE_FACET_BUDGET");
 for(const e of syntheticCareerConflicts(options))if(e.blocksJointPrimary)errors.push(...e.reasons);
 return [...new Set(errors)].sort();
}
