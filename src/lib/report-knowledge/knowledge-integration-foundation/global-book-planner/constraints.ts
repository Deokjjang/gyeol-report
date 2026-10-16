import type {GlobalBookPlanningRequest,PlanningOption}from'./types';
export function semanticConflicts(a:PlanningOption,b:PlanningOption):string[]{
 const reasons:string[]=[];
 if(a.id===b.id||a.questionId===b.questionId)reasons.push('ONE_PRIMARY_PER_READER_QUESTION');
 const sameScope=a.owner===b.owner&&a.direction===b.direction,recall=[a,b].some(o=>o.informationKind==='RECALL'||o.originalFunction==='CONTINUITY'),shared=a.primaryRoots.some(r=>b.primaryRoots.includes(r));
 const distinct=a.semanticIdentity.verifiedDistinctApplication&&b.semanticIdentity.verifiedDistinctApplication&&a.questionId!==b.questionId&&a.semanticIdentity.application!==b.semanticIdentity.application&&a.semanticIdentity.condition!==b.semanticIdentity.condition;
 if(sameScope&&!recall&&a.claimIdentity&&a.claimIdentity===b.claimIdentity)reasons.push('SAME_CLAIM_PRIMARY_REUSE');
 if(sameScope&&!recall&&a.primaryMeaning&&a.primaryMeaning===b.primaryMeaning&&!distinct)reasons.push('SAME_MEANING_WITHOUT_VERIFIED_DISTINCT_APPLICATION');
 if(shared&&a.informationKind==='ACTUAL_CALCULATED_FACT'&&b.informationKind==='ACTUAL_CALCULATED_FACT')reasons.push('SAME_ROOT_NOT_NEW_CALCULATED_FACT');
 // Equality is structural identity, never inferred semantic equivalence.
 for(const key of ['phrase','example','advice']as const){const x=a.semanticIdentity[key];if(x&&x===b.semanticIdentity[key]&&!recall)reasons.push('SAME_'+key.toUpperCase()+'_REQUIRES_REVIEW');}
 return reasons;
}
export function selectionReasons(r:GlobalBookPlanningRequest,rows:readonly PlanningOption[],final=false):string[]{
 const reasons=[...r.existingReuseBudgets.validateSelection(rows.map(o=>o.id),final)].filter(reason=>final||!/(REQUIRES_PRIOR|SELECTED_PRECEDING)/.test(reason));
 for(let i=0;i<rows.length;i++)for(const b of rows.slice(i+1))reasons.push(...semanticConflicts(rows[i],b));
 if(final)for(const o of rows){
  const d=o.dependency;
  if(d&&d.alternatives.length>0&&['REPAIR','CONTINUITY'].includes(d.kind)&&!d.alternatives.some(group=>group.every(id=>rows.some(p=>p.materialId===id))))reasons.push('REQUIRED_ORIGINAL_INTRODUCTION_NOT_PLANNED:'+o.id);
  if(d?.kind==='RECALL'&&!d.actualDisplayVerified)reasons.push('PLANNED_IS_NOT_ACTUALLY_DISPLAYED');
 }
 return [...new Set(reasons)].sort();
}

export function additionReasons(r:GlobalBookPlanningRequest,rows:readonly PlanningOption[],next:PlanningOption):string[]{
 if(!r.existingReuseBudgets.validateAddition)return selectionReasons(r,[...rows,next]);
 return [...new Set([...r.existingReuseBudgets.validateAddition(rows.map(o=>o.id),next.id),...rows.flatMap(o=>semanticConflicts(o,next))])].sort();
}
