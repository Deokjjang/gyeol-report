import {classifyWorkMeaning,type WorkMeaning} from "./policy";
export type ConflictCandidate={id:string;address:string;mode:string;roots:readonly string[];meaning:WorkMeaning;reasons:readonly string[]};
export function managerReportConflictRelations(a:ConflictCandidate,b:ConflictCandidate){
 const same=a.roots.some(r=>b.roots.includes(r)),structural:string[]=[],restrictions=[...new Set([...a.reasons,...b.reasons])].sort();
 if(same)structural.push("SAME_UNDERLYING_FACT");if(a.meaning.owner!==b.meaning.owner)structural.push("DIFFERENT_PERSON_OWNER");if(a.meaning.direction!==b.meaning.direction)structural.push("DIFFERENT_DIRECTION");if(a.meaning.workStage!==b.meaning.workStage)structural.push("DIFFERENT_WORK_STAGE");if(a.meaning.outputType!==b.meaning.outputType)structural.push("DIFFERENT_OUTPUT_FUNCTION");if(a.address===b.address)structural.push("ALTERNATIVE_PARAGRAPH_CANDIDATES");
 const relation=classifyWorkMeaning(a.meaning,b.meaning,same),confirmed=a.meaning.reviewed&&b.meaning.reviewed&&["SAME_CLAIM","SAME_MEANING"].includes(relation);if(confirmed)structural.push("SAME_MEANING");
 return {left:a.id,right:b.id,sharedInformationRoots:a.roots.filter(r=>b.roots.includes(r)),structural:structural.sort(),restrictions,meaningRelation:relation,conditionalRelation:"MEANING_REVIEW_REQUIRED",confirmedSemanticConflict:confirmed};
}
