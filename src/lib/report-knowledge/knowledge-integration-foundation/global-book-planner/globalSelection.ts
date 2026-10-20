import {canonicalJson}from'../sourceReader';
import type{GlobalBookPlanningRequest,PlanningOption,CandidateEligibility,SelectionMethod}from'./types';
import{selectionReasons,additionReasons}from'./constraints';
export function canonicalDirection(value:string|null){return value==='AB'||value==='A_TO_B'?'A_TO_B':value==='BA'||value==='B_TO_A'?'B_TO_A':null;}
export function objective(r:GlobalBookPlanningRequest,rows:readonly PlanningOption[]):number[]{
 const critical=new Set(r.questions.filter(q=>q.priority>0).map(q=>q.id));
 return[rows.filter(o=>critical.has(o.questionId)).length,rows.length,Math.min(rows.filter(o=>canonicalDirection(o.direction)==='A_TO_B').length,rows.filter(o=>canonicalDirection(o.direction)==='B_TO_A').length),new Set(rows.filter(o=>o.informationKind!=='RECALL').map(o=>o.primaryMeaning)).size,new Set(rows.map(o=>o.informationFunction)).size,rows.reduce((sum,o)=>sum+o.fit,0)];
}
export function compare(a:readonly number[],b:readonly number[]){for(let i=0;i<a.length;i++)if(a[i]!==b[i])return a[i]-b[i];return 0;}
export function selectGlobal(r:GlobalBookPlanningRequest,eligibility:readonly CandidateEligibility[],method:SelectionMethod='GLOBAL_CONSTRAINT_AWARE',limit=200000){
 if(!Number.isSafeInteger(limit)||limit<1)throw Error('POSITIVE_SEARCH_LIMIT_REQUIRED');
 const eligible=new Set(eligibility.filter(e=>e.eligiblePrimary).map(e=>e.option));
 const pool=new Map(r.questions.map(q=>[q.id,r.options.filter(o=>o.questionId===q.id&&eligible.has(o.id)).sort((a,b)=>method==='FIRST_ELIGIBLE'?a.id.localeCompare(b.id,'en'):b.fit-a.fit||a.id.localeCompare(b.id,'en'))]));
 // Most constrained questions first. The DFS can undo earlier root/meaning use.
 const qs=r.questions.filter(q=>pool.get(q.id)!.length).sort((a,b)=>method==='GLOBAL_CONSTRAINT_AWARE'?b.priority-a.priority||pool.get(a.id)!.length-pool.get(b.id)!.length||a.id.localeCompare(b.id,'en'):a.address.originalAddress.localeCompare(b.address.originalAddress,'en')||a.id.localeCompare(b.id,'en'));
 let selected:PlanningOption[]=[],visited=0,complete=true;
 if(method!=='GLOBAL_CONSTRAINT_AWARE'){
  for(const q of qs){const next=pool.get(q.id)!.find(o=>additionReasons(r,selected,o).length===0&&selectionReasons(r,[...selected,o],true).length===0);if(next)selected.push(next);}
 }else{
  const bestScore=()=>objective(r,selected);
  const stack:{i:number;rows:PlanningOption[]}[]=[{i:0,rows:[]}];
  while(stack.length){
   if(++visited>limit){complete=false;break;}const{i,rows}=stack.pop()!;
   if(i===qs.length){if(selectionReasons(r,rows,true).length)continue;const cmp=compare(objective(r,rows),bestScore());if(cmp>0||cmp===0&&canonicalJson(rows.map(o=>o.id))<canonicalJson(selected.map(o=>o.id)))selected=rows;continue;}
   const remaining=qs.slice(i),possible=remaining.flatMap(q=>pool.get(q.id)!),critical=remaining.filter(q=>q.priority>0).length;
   const upper=[objective(r,rows)[0]+critical,rows.length+remaining.length,Math.min(rows.filter(o=>canonicalDirection(o.direction)==='A_TO_B').length+remaining.filter(q=>pool.get(q.id)!.some(o=>canonicalDirection(o.direction)==='A_TO_B')).length,rows.filter(o=>canonicalDirection(o.direction)==='B_TO_A').length+remaining.filter(q=>pool.get(q.id)!.some(o=>canonicalDirection(o.direction)==='B_TO_A')).length),Math.min(rows.length+remaining.length,new Set([...rows,...possible].filter(o=>o.informationKind!=='RECALL').map(o=>o.primaryMeaning)).size),Math.min(rows.length+remaining.length,new Set([...rows,...possible].map(o=>o.informationFunction)).size),rows.reduce((s,o)=>s+o.fit,0)+remaining.reduce((s,q)=>s+Math.max(0,...pool.get(q.id)!.map(o=>o.fit)),0)];
   // Ties keep the first deterministic traversal. This bound cannot discard a better objective.
   if(compare(upper,bestScore())<=0)continue;
   stack.push({i:i+1,rows});for(const o of [...pool.get(qs[i].id)!].reverse())if(additionReasons(r,rows,o).length===0)stack.push({i:i+1,rows:[...rows,o]});
  }
 }
 return{selected,search:{method,visited,complete,optimality:method==='GLOBAL_CONSTRAINT_AWARE'&&complete?'EXHAUSTIVE_WITHIN_REGISTERED_POOL' as const:'NOT_CLAIMED' as const,objective:objective(r,selected)}};
}
