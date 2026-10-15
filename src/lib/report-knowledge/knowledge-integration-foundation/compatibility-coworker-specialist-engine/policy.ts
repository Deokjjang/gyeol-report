import {compatibleDisplay,type Display as GenericDisplay,type Meaning} from "../compatibility-love-specialist-engine/policy";
import {canonicalJson} from "../sourceReader";
import {evaluateWorkContext,type WorkContext} from "./workContext";
export const ROLE_VERSION="compatibility-fixed-ab-v1" as const;
export const SAFETY_SIGNALS=["THREAT","COERCION","RETALIATION","HARASSMENT","SURVEILLANCE","PRIVACY_VIOLATION","DISCRIMINATION","ECONOMIC_COERCION","UNSAFE_PROCEDURE","AUTHORITY_ABUSE","UNCONSENTED_DISCLOSURE"] as const;
export const COWORKER_POLICY={category:"coworker",roleVersion:ROLE_VERSION,roles:{A:"PERSON_A",B:"PERSON_B"},actualWorkplace:"UNKNOWN",actualJob:"UNKNOWN",actualAuthority:"UNKNOWN",actualWorkHistory:"UNKNOWN",coworkerPatternExists:false,domainAllowlistExpanded:false,reviewIsApproval:false,deliveryIsAcceptance:false,feedbackIsPersonnelEvaluation:false,mbtiIsMeasuredSkill:false,pairRelationIsPerformance:false,actualCustomerApproval:0,actualDisplayLedgerIssued:false,writerUnchanged:true} as const;
export type WorkAssertion={roleVersion:string;category:string;stage:string;outputType:string;workFunctions:string[];context:WorkContext|null;requiredFacts:string[];abilityClaim:boolean;performanceClaim:boolean;promotionClaim:boolean;jobSuitabilityClaim:boolean;roleFromType:boolean;equalAuthorityAssumed:boolean;reviewMeansApproval:boolean;deliveryMeansAcceptance:boolean;feedbackMeansPersonnelEvaluation:boolean;supportMeansResponsibilityTransfer:boolean;draftMeansFinalDecision:boolean;pairOutcomeClaim:boolean;pairWorkPatternClaim:boolean;romanticPatternTransferred:boolean;actualHistoryClaim:boolean;recipientReactionClaim:boolean;actualRecovery:boolean;preventionOnly:boolean;forcedContact:boolean;forcedReconciliation:boolean;forcedDisclosure:boolean;safety:string[]};
export function safetyReasons(signals:readonly string[],forcedContact:boolean,forcedRepair:boolean,forcedDisclosure=false){return signals.some(s=>(SAFETY_SIGNALS as readonly string[]).includes(s))&&(forcedContact||forcedRepair||forcedDisclosure)?["SAFETY_CONDITION_FAILED","UNSAFE_REPAIR_OR_CONTACT_BLOCKED"]:[];}
export function validateWorkAssertion(a:WorkAssertion){
 const reasons=evaluateWorkContext({workStage:a.stage,outputType:a.outputType,workFunctions:a.workFunctions,requirements:{actualWorkContextRequired:true} as Parameters<typeof evaluateWorkContext>[0]["requirements"]},a.context??undefined).reasons;
 if(a.roleVersion!==ROLE_VERSION)reasons.push("V4_FIXED_ROLE_REQUIRED");if(a.category!=="coworker")reasons.push("COWORKER_SCOPE_REQUIRED");
 if(a.abilityClaim||a.performanceClaim||a.promotionClaim||a.jobSuitabilityClaim)reasons.push("UNSUPPORTED_WORK_PERFORMANCE_CLAIM");
 if(a.roleFromType||a.equalAuthorityAssumed)reasons.push("UNVERIFIED_AUTHORITY","UNVERIFIED_JOB_ROLE");
 if(a.reviewMeansApproval||a.feedbackMeansPersonnelEvaluation||a.supportMeansResponsibilityTransfer||a.draftMeansFinalDecision)reasons.push("AUTHORITY_FUNCTION_CONFLATION");
 if(a.deliveryMeansAcceptance)reasons.push("HANDOFF_ACCEPTANCE_UNVERIFIED");
 if(a.pairOutcomeClaim||a.pairWorkPatternClaim||a.romanticPatternTransferred)reasons.push("PAIR_REFERENCE_NOT_PERSON_FACT");
 if(a.actualHistoryClaim)reasons.push("UNVERIFIED_WORK_HISTORY");if(a.recipientReactionClaim)reasons.push("RECIPIENT_RESPONSE_UNVERIFIED");
 if(a.actualRecovery&&a.preventionOnly)reasons.push("PREVENTION_IS_NOT_ACTUAL_RECOVERY");
 for(const fact of a.requiredFacts)reasons.push("ACTUAL_WORK_FACT_UNKNOWN:"+fact);
 return [...new Set([...reasons,...safetyReasons(a.safety,a.forcedContact,a.forcedReconciliation,a.forcedDisclosure)])].sort();
}
export type Display=GenericDisplay&{roleVersion:string;workStage:string;taskId:string;outputType:string;materialId:string};
export function coworkerRecallDisplay(expected:Omit<Display,"id"|"address"|"actuallyDisplayed">,displays:readonly Display[],introductionAddress:string|null){return !!introductionAddress&&compatibleDisplay(expected,displays.filter(d=>d.address===introductionAddress&&["roleVersion","workStage","taskId","outputType","materialId"].every(k=>canonicalJson(d[k as keyof Display])===canonicalJson(expected[k as keyof typeof expected]))));}
export type WorkMeaning=Meaning&{workStage:string;outputType:string;jobContext:string;authorityRequirement:string};
export function classifyWorkMeaning(a:WorkMeaning,b:WorkMeaning,sameRoot:boolean){
 if(a.owner!==b.owner)return "DIFFERENT_OWNER";if(a.direction!==b.direction)return "DIFFERENT_DIRECTION";
 if(!a.reviewed||!b.reviewed)return "MEANING_REVIEW_REQUIRED";
 if(a.claim===b.claim)return b.function==="RECALL"?"VALID_RECALL":"SAME_CLAIM";if(a.id===b.id)return "SAME_MEANING";
 if(a.workStage!==b.workStage)return "DIFFERENT_WORK_STAGE";if(a.outputType!==b.outputType)return "DIFFERENT_OUTPUT";if(a.jobContext!==b.jobContext)return "DIFFERENT_JOB_CONTEXT";if(a.authorityRequirement!==b.authorityRequirement)return "DIFFERENT_AUTHORITY_REQUIREMENT";
 return sameRoot?"SAME_FACT":"DIFFERENT_MEANING";
}
export const CONFLICT_TYPES=["SAME_UNDERLYING_FACT","SAME_MEANING","DIFFERENT_PERSON_OWNER","DIFFERENT_DIRECTION","DIFFERENT_WORK_STAGE","DIFFERENT_OUTPUT_FUNCTION","CONDITIONAL_COMPLEMENT","CONDITIONAL_TENSION","WRONG_OWNER","WRONG_RECIPIENT_TEN_GOD","MISSING_ACTUAL_WORK_CONTEXT","UNVERIFIED_JOB_ROLE","UNVERIFIED_AUTHORITY","UNVERIFIED_WORK_HISTORY","UNVERIFIED_OUTPUT","SOURCE_DOMAIN_NOT_ALLOWED","CHILDREN_ANCESTRY_CONTAMINATION","WORK_SOURCE_NOT_PROJECTED","CAREER_SOURCE_NOT_PROJECTED","THINKING_SOURCE_NOT_PROJECTED","UNSUPPORTED_PAIR_RELATION","PAIR_REFERENCE_NOT_PERSON_FACT","INCOMPLETE_REQUIRED_ANCESTRY","CH08_REQUIRES_PRECEDING_WORK_MEANING","CH09_REQUIRES_ACTUAL_DISPLAY","SAFETY_CONDITION_FAILED","MEANING_REVIEW_REQUIRED"] as const;
