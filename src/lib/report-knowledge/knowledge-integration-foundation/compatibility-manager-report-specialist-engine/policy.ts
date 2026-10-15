import {compatibleDisplay,type Display as GenericDisplay,type Meaning} from "../compatibility-love-specialist-engine/policy";
import {canonicalJson} from "../sourceReader";
import {evaluateWorkContext,validateAuthority,type WorkContext} from "./managementContext";
import {validateFixedRole,ROLE_VERSION} from "./roleValidator";
export {ROLE_VERSION};
export const SAFETY_SIGNALS=["VIOLENCE","THREAT","COERCION","RETALIATION","HARASSMENT","PERSONAL_ATTACK","SURVEILLANCE","PRIVACY_VIOLATION","DISCRIMINATION","ECONOMIC_COERCION","UNSAFE_PROCEDURE","AUTHORITY_ABUSE","UNCONSENTED_DISCLOSURE"] as const;
export const MANAGER_REPORT_POLICY={category:"managerReport",roleVersion:ROLE_VERSION,roles:{A:"상사",B:"부하·팀원"},actualReportingRelationship:"UNKNOWN",actualWorkplace:"UNKNOWN",actualJob:"UNKNOWN",actualAuthority:"UNKNOWN",actualEvaluationAuthority:"UNKNOWN",actualApprovalAuthority:"UNKNOWN",actualWorkHistory:"UNKNOWN",managerReportPatternExists:false,domainAllowlistExpanded:false,roleDeclarationIsAuthority:false,delegationTransfersResponsibility:false,feedbackIsPersonnelEvaluation:false,mbtiIsMeasuredSkill:false,pairRelationIsPerformance:false,actualCustomerApproval:0,actualDisplayLedgerIssued:false,writerUnchanged:true} as const;
export type WorkAssertion={roleVersion:string;category:string;declaredRoles:{personA:string;personB:string};stage:string;outputType:string;workFunctions:string[];authorityKind:string;authorityOwner:"A"|"B";context:WorkContext|null;requiredFacts:string[];abilityClaim:boolean;performanceClaim:boolean;promotionClaim:boolean;jobSuitabilityClaim:boolean;roleFromType:boolean;equalAuthorityAssumed:boolean;roleDeclarationMeansAuthority:boolean;delegationMeansDecisionRight:boolean;delegationMeansResponsibilityTransfer:boolean;reviewMeansApproval:boolean;deliveryMeansAcceptance:boolean;feedbackMeansPersonnelEvaluation:boolean;supportMeansResponsibilityTransfer:boolean;draftMeansFinalDecision:boolean;pairOutcomeClaim:boolean;pairWorkPatternClaim:boolean;romanticPatternTransferred:boolean;actualHistoryClaim:boolean;recipientReactionClaim:boolean;actualRecovery:boolean;preventionOnly:boolean;forcedContact:boolean;forcedReconciliation:boolean;forcedDisclosure:boolean;managerResponsibilityShiftedToReport:boolean;reportEmotionalLaborForced:boolean;unlimitedOvertimeRequired:boolean;unfairInstructionRequired:boolean;reportMustAgree:boolean;voiceSafetyAssumed:boolean;retaliationAbsenceGuaranteed:boolean;anonymityGuaranteed:boolean;legalOutcomeGuaranteed:boolean;reportingMeansSurveillance:boolean;resourceGapMeansLowWill:boolean;managerDutyMeansSupport:boolean;questionMeansRebellion:boolean;reviewMeansHarassment:boolean;safety:string[]};
export function safetyReasons(signals:readonly string[],forcedContact:boolean,forcedRepair:boolean,forcedDisclosure=false){return signals.some(s=>(SAFETY_SIGNALS as readonly string[]).includes(s))&&(forcedContact||forcedRepair||forcedDisclosure)?["SAFETY_CONDITION_FAILED","UNSAFE_REPAIR_OR_CONTACT_BLOCKED"]:[];}
export function validateWorkAssertion(a:WorkAssertion){
 const reasons=evaluateWorkContext({workStage:a.stage,outputType:a.outputType,workFunctions:a.workFunctions,authorityContext:{kind:a.authorityKind,actualAuthority:"UNKNOWN",verificationRequired:true,question:"synthetic typed condition"},requirements:{actualWorkContextRequired:true} as Parameters<typeof evaluateWorkContext>[0]["requirements"]},a.context??undefined).reasons;
 reasons.push(...validateFixedRole(a.roleVersion,a.declaredRoles),...validateAuthority([a.authorityKind],a.context??undefined,a.authorityOwner));if(a.category!=="managerReport")reasons.push("MANAGER_REPORT_SCOPE_REQUIRED");
 if(a.abilityClaim||a.performanceClaim||a.promotionClaim||a.jobSuitabilityClaim)reasons.push("UNVERIFIED_WORK_PERFORMANCE");
 if(a.roleFromType||a.equalAuthorityAssumed||a.roleDeclarationMeansAuthority)reasons.push("ACTUAL_AUTHORITY_UNKNOWN");
 if(a.delegationMeansDecisionRight||a.delegationMeansResponsibilityTransfer||a.reviewMeansApproval||a.feedbackMeansPersonnelEvaluation||a.supportMeansResponsibilityTransfer||a.draftMeansFinalDecision)reasons.push("AUTHORITY_FUNCTION_CONFLATION");
 if(a.feedbackMeansPersonnelEvaluation)reasons.push(...validateAuthority(["evaluation"],a.context??undefined),"FEEDBACK_IS_NOT_PERSONNEL_EVALUATION");
 if(a.reviewMeansApproval)reasons.push(...validateAuthority(["approval"],a.context??undefined));
 if(a.deliveryMeansAcceptance)reasons.push("HANDOFF_ACCEPTANCE_UNVERIFIED");
 if(a.pairOutcomeClaim||a.pairWorkPatternClaim||a.romanticPatternTransferred)reasons.push("PAIR_REFERENCE_NOT_PERSON_FACT");
 if(a.actualHistoryClaim)reasons.push("UNVERIFIED_WORK_HISTORY");if(a.recipientReactionClaim)reasons.push("RECIPIENT_RESPONSE_UNVERIFIED");
 if(a.actualRecovery&&a.preventionOnly)reasons.push("PREVENTION_IS_NOT_ACTUAL_RECOVERY");
 if(a.managerResponsibilityShiftedToReport)reasons.push("MANAGER_RESPONSIBILITY_SHIFTED_TO_REPORT");
 if(a.reportEmotionalLaborForced)reasons.push("REPORT_EMOTIONAL_LABOR_FORCED");
 if(a.unlimitedOvertimeRequired||a.unfairInstructionRequired||a.reportMustAgree)reasons.push("TEAM_MEMBER_SAFETY_VIOLATION");
 if(a.voiceSafetyAssumed||a.retaliationAbsenceGuaranteed||a.anonymityGuaranteed||a.legalOutcomeGuaranteed)reasons.push("UNSAFE_VOICE_ASSUMPTION");
 if(a.reportingMeansSurveillance)reasons.push("REPORTING_IS_NOT_SURVEILLANCE");
 if(a.resourceGapMeansLowWill||a.managerDutyMeansSupport)reasons.push("WORKLOAD_RESOURCE_CONFLATION");
 if(a.questionMeansRebellion||a.reviewMeansHarassment)reasons.push("UNVERIFIED_BEHAVIOR_JUDGMENT");
 for(const fact of a.requiredFacts)reasons.push("ACTUAL_WORK_FACT_UNKNOWN:"+fact);
 return [...new Set([...reasons,...safetyReasons(a.safety,a.forcedContact,a.forcedReconciliation,a.forcedDisclosure)])].sort();
}
export type Display=GenericDisplay&{roleVersion:string;workStage:string;taskId:string;outputType:string;materialId:string;sourceGroupId:string;sourceKeys:string[];authorityKind:string};
export function managerReportRecallDisplay(expected:Omit<Display,"id"|"address"|"actuallyDisplayed">,displays:readonly Display[],introductionAddress:string|null){return !!introductionAddress&&compatibleDisplay(expected,displays.filter(d=>d.address===introductionAddress&&["roleVersion","workStage","taskId","outputType","materialId","sourceGroupId","sourceKeys","authorityKind"].every(k=>canonicalJson(d[k as keyof Display])===canonicalJson(expected[k as keyof typeof expected]))));}
export type WorkMeaning=Meaning&{workStage:string;outputType:string;jobContext:string;authorityRequirement:string;responsibility:string;decisionRight:string};
export function classifyWorkMeaning(a:WorkMeaning,b:WorkMeaning,sameRoot:boolean){
 if(a.owner!==b.owner)return "DIFFERENT_OWNER";if(a.direction!==b.direction)return "DIFFERENT_DIRECTION";
 if(!a.reviewed||!b.reviewed)return "MEANING_REVIEW_REQUIRED";
 if(a.claim===b.claim)return b.function==="RECALL"?"VALID_RECALL":"SAME_CLAIM";if(a.id===b.id)return "SAME_MEANING";
 if(a.authorityRequirement!==b.authorityRequirement)return "DIFFERENT_AUTHORITY_KIND";if(a.responsibility!==b.responsibility)return "DIFFERENT_RESPONSIBILITY";if(a.decisionRight!==b.decisionRight)return "DIFFERENT_DECISION_RIGHT";if(a.workStage!==b.workStage)return "DIFFERENT_WORK_STAGE";
 return sameRoot?"SAME_FACT":"VERIFIED_NEW_APPLICATION";
}
export const CONFLICT_TYPES=["SAME_UNDERLYING_FACT","SAME_MEANING","DIFFERENT_PERSON_OWNER","DIFFERENT_DIRECTION","WRONG_ROLE_VERSION","ROLE_DECLARATION_CHANGED","ACTUAL_AUTHORITY_UNKNOWN","UNVERIFIED_REPORTING_RELATIONSHIP","UNVERIFIED_EVALUATION_RIGHT","UNVERIFIED_APPROVAL_RIGHT","MANAGER_RESPONSIBILITY_SHIFTED_TO_REPORT","REPORT_EMOTIONAL_LABOR_FORCED","UNSAFE_VOICE_ASSUMPTION","WORK_DOMAIN_NOT_APPROVED","CAREER_DOMAIN_NOT_APPROVED","THINKING_DOMAIN_NOT_APPROVED","CHILDREN_ANCESTRY_CONTAMINATION","PAIR_REFERENCE_NOT_PERSON_FACT","UNSUPPORTED_CANONICAL_RELATION","INCOMPLETE_REQUIRED_ANCESTRY","SOURCE_GROUP_AND_INCOMPLETE","SOURCE_GROUP_OWNER_TYPE_MISMATCH","INCOMPATIBLE_DISPLAYED_GROUP","UNVERIFIED_WORK_CONTEXT","UNVERIFIED_WORK_PERFORMANCE","CH08_REQUIRES_PRECEDING_FRICTION","CH09_REQUIRES_ACTUAL_DISPLAY","SAFETY_CONDITION_FAILED","MEANING_REVIEW_REQUIRED"] as const;
