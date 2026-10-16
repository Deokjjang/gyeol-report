import{intersectEvidencePeriods}from'../actual-evidence-graph/temporal';
import{isRecord}from'../normalization';
import type{GlobalBookPlanningRequest,GlobalBookPlan,PlanningOption}from'./types';
import type{EvidenceTemporalWindow}from'../actual-evidence-graph/types';
export function temporalIntersectionReasons(windows:readonly EvidenceTemporalWindow[],comparison=false){
 if(!windows.length)return['TEMPORAL_SCOPE_UNKNOWN'];
 if(comparison)return windows.some(w=>!w.start||!w.endExclusive||w.certainty!=='confirmed')?['COMPARISON_OPERAND_WINDOW_UNKNOWN']:[];
 const result=intersectEvidencePeriods(windows);return result.state==='CONFIRMED_INTERSECTION'?[]:[result.state];
}
export function temporalOptionAudit(o:PlanningOption){return{candidate:o.id,windows:o.temporal,originalInformationFunction:o.originalFunction,sourceHash:o.sourceHash,scopeInferenceAdded:false,wholeYearOrMonthClaimed:false,exactNativeValidationRequired:true};}
export function auditTemporalBook(r:GlobalBookPlanningRequest,p:GlobalBookPlan){
 const native=isRecord(r.temporalContract)&&isRecord(r.temporalContract.registry)?r.temporalContract.registry:null;
 if(r.productKey==='major_fortune'){
  const years=[...new Set(r.questions.flatMap(q=>q.address.periodId&&/^\d{4}$/.test(q.address.periodId)?[Number(q.address.periodId)]:[]))].sort();
  return{kind:'MAJOR_FORTUNE',editorialHorizonYears:years.length,years,tenYearCyclesNotReplacedByHorizon:true,exactOrRangeTransitionNotModified:true,assignments:p.selectedCandidateReferences.map(a=>({question:a.originalReaderQuestion.id,period:a.originalReaderQuestion.address.periodId,windows:a.temporalScope,informationFunction:a.primaryInformation.function})),unknownIntervalsRemainUnknown:true};
 }
 if(r.productKey==='annual_fortune'){
  const facts=native&&Array.isArray(native.facts)?native.facts.filter(isRecord):[],segments=native&&Array.isArray(native.segments)?native.segments.filter((x):x is string=>typeof x==='string'):[];
  return{kind:'ANNUAL_FORTUNE',civilMonths:12,registeredSegments:segments.length,months:Array.from({length:12},(_,i)=>{const month=i+1,required=segments.flatMap(id=>facts.filter(f=>f.id===id&&f.month===month));return{civilMonth:month,requiredSegments:required.map(f=>({id:f.id,start:f.start,endExclusive:f.end,nominalAndEffectiveAnnualKeptSeparate:true,effectiveAnnual:f.annual,monthPillar:f.pillar,activeDayun:f.dayun,uncertainDayun:f.uncertainDayun})),plannedQuestions:p.selectedCandidateReferences.filter(a=>a.originalReaderQuestion.address.periodId==='month-'+month).map(a=>a.originalReaderQuestion.id),fullMonthMeaningApproved:false,focusSegmentIsNotWholeMonth:true};}),stemAndBranchMainAreDistinct:true,newCompositeJudgments:0};
 }
 return{kind:'NON_TEMPORAL',newTemporalAssertions:0};
}
