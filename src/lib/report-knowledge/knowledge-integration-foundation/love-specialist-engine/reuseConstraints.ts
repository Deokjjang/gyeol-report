import { checkSyntheticRecall } from "../comprehensive-specialist-engine/reuseConstraints";
import { resolveMeaningRelationship } from "../comprehensive-specialist-engine/meaningIdentity";
import type { LoveSyntheticOption, LoveIntroduction, LoveConflict } from "./types";
export const LOVE_REUSE_CONTRACT=Object.freeze({releaseSource:"src/lib/interpretation-v4/loveReleaseRenderer.ts#eligible/application",nonRecallFacetMax:6,recallExemptFromGlobalFacetGate:true,sameChapterFacetMax:1,facetUnit:"LOVE_RELEASE_MATERIALS key",rootHardCap:null,rootUnit:"LoveReleaseSource.atom.id",rootUsePolicy:"Existing use count is a sorting preference",canonicalRootBridge:"IDENTITY_BRIDGE_UNVERIFIED",researchFacetBridge:"IDENTITY_BRIDGE_UNVERIFIED_NO_NEW_FACET_BUDGET",selectorThemeUnit:"duplicateGroupId ?? semanticOverlapGroup ?? semanticTheme",selectorThemeMax:1,readerBridge:"READER_L_QUESTION_BRIDGE_UNVERIFIED",directTake:["L1","L3","L4","L5","L6","L7","L8","L9"],L2:"RETAINED_LEGACY_ATTRACTION_PARTNER_NOT_DIRECT_TAKE",actualDisplayLedgerIssued:false});
export function loveRecallReasons(o:LoveSyntheticOption,ledger:readonly LoveIntroduction[]):string[]{
 const general=checkSyntheticRecall(o,ledger);if(!o.meaning.recallOf)return general;
 const compatible=ledger.some(l=>l.materialId===o.meaning.recallOf&&l.relationshipStatus===o.relationshipStatus&&l.contextId===o.contextId&&o.meaning.compatiblePriorQuestions.includes(l.questionId)&&/^CH0[1-8]\.P[1-4]$/.test(l.address)&&checkSyntheticRecall(o,[l]).length===0);
 return [...general,...(!compatible?["ACTUAL_COMPATIBLE_STATUS_CONTEXT_QUESTION_ADDRESS_DISPLAY_REQUIRED"]:[])];
}
export function syntheticLoveConflicts(options:readonly LoveSyntheticOption[]):LoveConflict[]{
 const edges:LoveConflict[]=[];
 for(let i=0;i<options.length;i++)for(const b of options.slice(i+1)){const a=options[i],ma=a.meaning,mb=b.meaning;const put=(kind:LoveConflict["kind"],blocks:boolean,reason:string,state:LoveConflict["state"]="VERIFIED")=>edges.push({left:a.id,right:b.id,kind,state,blocksJointPrimary:blocks,reasons:[reason]});
  if(a.roots.some(r=>b.roots.includes(r)))put("SAME_UNDERLYING_FACT",false,"EXACT_REGISTERED_ROOT_INTERSECTION");
  const view=(o:LoveSyntheticOption)=>({id:o.id,roots:o.roots,meaningId:o.meaning.meaningId,claimId:o.meaning.claimId,question:o.questionId,conditions:o.meaning.conditions,action:o.meaning.action,context:[o.meaning.context],reviewed:true,recall:!!o.meaning.recallOf,actuallyDisplayed:o.eligible&&!!o.meaning.recallOf});
  const relation=resolveMeaningRelationship(view(a),view(b));
  if(!ma.recallOf&&!mb.recallOf&&(ma.claimId===mb.claimId||ma.meaningId===mb.meaningId&&relation.relation!=="NEW_APPLICATION"))put("SAME_MEANING",true,"REVIEWED_SAME_PRIMARY_MEANING");
  if(relation.relation==="NEW_APPLICATION")put("DIFFERENT_RELATIONSHIP_APPLICATION",false,"REVIEWED_QUESTION_TARGET_CONDITION_ACTION_DIFFERENCE");
  if(a.relationshipStatus!==b.relationshipStatus||a.contextId!==b.contextId)put("RELATIONSHIP_STATUS_CONFLICT",true,"SAME_PERSON_CURRENT_STATUS_CONTEXT_CANNOT_DIFFER");
  if(ma.exclusiveWith.includes(b.id)||mb.exclusiveWith.includes(a.id))put("CONDITIONAL_TENSION",true,"EXPLICIT_REVIEWED_EXCLUSION");
  if(ma.axis&&mb.axis&&ma.axis.id===mb.axis.id&&ma.axis.direction!==mb.axis.direction){const split=ma.verifiedSplitWith.includes(b.id)||mb.verifiedSplitWith.includes(a.id),different=ma.context!==mb.context;put("CONDITIONAL_TENSION",!split&&!different,"OPPOSITE_SIGNALS_REQUIRE_REVIEWED_SPLIT_OR_DISTINCT_CONTEXT",split||different?"VERIFIED":"REVIEW_REQUIRED");}
  if(ma.verifiedComplementWith.includes(b.id)||mb.verifiedComplementWith.includes(a.id))put("CONDITIONAL_COMPLEMENT",false,"EXPLICIT_REVIEWED_COMPLEMENT");
  if(ma.recallOf===b.id||mb.recallOf===a.id)put("RECALL_REQUIRES_INTRODUCTION",!a.eligible||!b.eligible,"PLANNED_SELECTION_IS_NOT_DISPLAY");
 }
 return edges.sort((a,b)=>JSON.stringify([a.left,a.right,a.kind]).localeCompare(JSON.stringify([b.left,b.right,b.kind]),"en"));
}
export function loveSelectionViolations(options:readonly LoveSyntheticOption[],ledger:readonly LoveIntroduction[]):string[]{
 const errors:string[]=[],facets=new Map<string,number>(),chapterFacets=new Set<string>(),questions=new Set<string>();
 for(const o of options){if(!o.eligible)errors.push("INELIGIBLE:"+o.id);if(questions.has(o.questionId))errors.push("QUESTION_ASSIGNED_TWICE");questions.add(o.questionId);errors.push(...loveRecallReasons(o,ledger));
  const key=o.chapter+":"+o.meaning.facet;if(chapterFacets.has(key))errors.push("SAME_CHAPTER_FACET_REUSE");chapterFacets.add(key);
  if(!o.meaning.recallOf)facets.set(o.meaning.facet,(facets.get(o.meaning.facet)??0)+1);
 }
 if([...facets.values()].some(n=>n>LOVE_REUSE_CONTRACT.nonRecallFacetMax))errors.push("LOVE_NON_RECALL_FACET_BUDGET");
 for(const e of syntheticLoveConflicts(options))if(e.blocksJointPrimary)errors.push(...e.reasons);
 return [...new Set(errors)].sort();
}
