import { JOB_STATUSES, type JobStatus } from "../../../report-generation/reportInputTypes";
import { narrativeContext } from "../../../interpretation-v4/narrativeContext";
import { careerWorkNarrative } from "../../../interpretation-v4/careerWorkNarrative";
import { CAREER_JOB_RESEARCH } from "../../career-product-research/jobFunctionResearch";
import { CAREER_DETAIL_JOB_APPLICATIONS } from "../../career-product-research/detailJobApplicability";
import type { NarrativeInput } from "../../../interpretation-v4/narrativeTypes";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { CareerSpecialistCandidate, CareerContextObservation, CareerJobMatch } from "./types";
export function observeCareerContext(request:KnowledgeBindingRequest, sourceHashes:Record<string,string>):CareerContextObservation {
  const e=request.graphInput.evidence;if(e.input.kind==="compatibility")throw Error("SINGLE_CAREER_INPUT_REQUIRED");
  const ctx=e.input.userContext;if(!JOB_STATUSES.includes(ctx.jobStatus))throw Error("ORIGINAL_JOB_STATUS_REQUIRED");
  return observeCareerInput({calculation:e.calculations.person,name:e.input.person.name,mbti:e.input.person.mbtiType,context:ctx},sourceHashes);
}
/** Classifier-only probes do not create Graph observations or Binder claims. */
export function observeCareerInput(input:NarrativeInput,sourceHashes:Record<string,string>):CareerContextObservation {
  const ctx=input.context,base=narrativeContext(input),effective=careerWorkNarrative(input),raw=ctx.detailJob.trim(),jobs=CAREER_JOB_RESEARCH.filter(j=>j.testedInputText.trim()===raw&&raw.length>0);
  const states=[...(raw?["EXACT_ENTERED_CONTEXT"]:[]),effective.workFunction==="unknown"?"UNKNOWN_WORK_FUNCTION":"SUPPORTED_WORK_FUNCTION",...(base.career.function!==effective.workFunction?["V4_OVERRIDE_OBSERVED"]:[]),...(!raw?["GENERIC_WORK_FUNCTION"]:[]),...(jobs.length?["JOB_RESEARCH_REFERENCE_ONLY"]:[]),"PERSONAL_SKILL_UNVERIFIED"];
  return {jobStatus:ctx.jobStatus,detailJobProvided:!!raw,exactEnteredContext:!!raw,baseFunction:base.career.function??"unknown",narrativeFunction:base.workFunction,effectiveFunction:effective.workFunction,workMode:effective.workMode??null,states,exactJobResearchIds:jobs.map(j=>j.id),detailApplicationIds:CAREER_DETAIL_JOB_APPLICATIONS.filter(d=>jobs.some(j=>j.id===d.jobRef)).map(d=>d.id),skillVerified:false,enteredTextRetainedOnlyInCaller:true,sourceHashes,unknownFacts:["authority","actualTasks","workOutputs","contracts","clientCount","staff","income","revenue","profit","cashFlow","assets","investmentReturn","pastSuccess","pastFailure","academicDegree","qualification","legalAuthority","skillPerformance","examPreparation","actualConflict"]};
}
export function matchJobContext(candidate:CareerSpecialistCandidate,context:CareerContextObservation):CareerJobMatch {
  const state=context.jobStatus===""?"UNKNOWN":candidate.job.allowed.includes(context.jobStatus)?"MATCHED_SCOPE_ONLY":"CONFLICT";
  const exact=candidate.functions.jobResearch.filter(j=>context.exactJobResearchIds.includes(j.id)),functions=candidate.functions.jobResearch.map(j=>j.observedFunction).filter(f=>f!=="unknown");
  const functionState=context.effectiveFunction==="unknown"?"UNKNOWN":!functions.length||functions.includes(context.effectiveFunction)?"SUPPORTED_OBSERVATION":"DIFFERENT_FUNCTION";
  return {state,allowed:candidate.job.allowed,actual:context.jobStatus,allStatusesScopeOnly:candidate.job.allStatusesScopeOnly,detailState:!context.detailJobProvided?"MISSING":exact.length?"EXACT_REFERENCE_ONLY":"GENERAL_REFERENCE_ONLY",workFunctionState:functionState,actualFunction:context.effectiveFunction,matchedJobRefs:exact.map(j=>j.id),missingRequirements:[...(state==="UNKNOWN"?["JOB_STATUS_NOT_ENTERED"]:[]),...(state==="CONFLICT"?["JOB_STATUS_CONFLICT"]:[]),...(functionState==="UNKNOWN"?["UNKNOWN_WORK_FUNCTION"]:[]),...(functionState==="DIFFERENT_FUNCTION"?["WORK_FUNCTION_APPLICATION_NOT_MATCHED"]:[]),"ACTUAL_TASK_AUTHORITY_OUTPUT_EXPERIENCE_UNKNOWN","PERSONAL_SKILL_UNVERIFIED","ORIGINAL_CONTEXT_CONDITIONS_REVIEW_REQUIRED"],currentExperienceEstablished:false};
}
export function matchesJobStatus(allowed:readonly JobStatus[],actual:JobStatus){return actual===""?"UNKNOWN":allowed.includes(actual)?"MATCHED_SCOPE_ONLY":"CONFLICT";}
