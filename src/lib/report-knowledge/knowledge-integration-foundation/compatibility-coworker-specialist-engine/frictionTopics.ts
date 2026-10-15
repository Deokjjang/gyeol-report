import type {CompatibilityCoworkerIndex} from "./candidateIndex";
import type {KnowledgeBinderCatalog} from "../knowledge-binder/catalog";
import {requireWorkFields,type WorkField,type WorkContext} from "./workContext";
/** Conditions of an application, never proof that a dispute actually occurred. */
export const FRICTION_FIELDS={
 "업무 분담":["task","responsibility","output"],"책임 경계":["responsibility","decisionAuthority","handoffAcceptance"],
 "완료 기준":["output","qualityCriterion","qualityVerified"],"검토 깊이":["technicalReview","observedArtifact","availableTime"],
 "마감":["finalDeadline","intermediateDeadline","dependency"],"우선순위":["priority","decisionOwner","availableCapacity"],
 "업무 요청":["requiredInformation","requestedChange","availableCapacity"],"피드백 전달":["observedArtifact","observedIssue","senderIntention"],
 "피드백 수신":["recipientInterpretation","requestedChange","followupVerification"],"수정 횟수·종료":["revisionScope","revisionDone","qualityCriterion"],
 "추가 업무":["additionalRequest","availableCapacity","decisionAuthority"],"정보 공유":["latestVersion","requiredAccess","uncertainty"],
 "인수인계 누락":["incompleteItems","nextAction","recipientAcceptance"],"중복 작업":["latestVersion","currentState","responsibility"],
 "기여 인정":["observedArtifact","responsibility","observedIssue"],"회의":["decisionOwner","nextAction","responsibility"],
 "결정 지연":["decisionAuthority","dependency","availableTime"],"의견 충돌":["observedIssue","potentialImpact","qualityCriterion"],
 "작업물과 개인 평가":["observedArtifact","observedIssue","personnelEvaluation"],"반복 피로":["availableCapacity","revisionScope","availableTime"],
} as const satisfies Record<string,readonly WorkField[]>;
export function evaluateFrictionTopic(topic:keyof typeof FRICTION_FIELDS,context?:WorkContext){const checks=requireWorkFields(FRICTION_FIELDS[topic],context);return {topic,checks,applicable:context?.status==="VERIFIED"&&!!context.taskId&&checks.every(c=>c.state==="VERIFIED"),actualConflictHistory:"UNKNOWN",actualConflictDiagnosed:false,recipientResponseVerified:false,conditionKind:"POTENTIAL_WORK_FRICTION_ONLY"};}
export function readFrictionTopics(index:CompatibilityCoworkerIndex,catalog:KnowledgeBinderCatalog){
 const file="docs/validation/v4-compatibility-coworker-product-knowledge-01/work-friction-topic-coverage.json",topics=catalog.reader.json(file) as {topic:string;materialRef:string}[];
 if(catalog.reader.files.get(file)!==catalog.input.frozen.get(file)||topics.length!==Object.keys(FRICTION_FIELDS).length)throw Error("ORIGINAL_FRICTION_TOPICS_REQUIRED");
 return topics.map(t=>{if(!(t.topic in FRICTION_FIELDS))throw Error("ORIGINAL_FRICTION_TOPIC_UNSUPPORTED");const row=index.lookup("OriginalResearchId",t.materialRef)[0];if(!row)throw Error("ORIGINAL_FRICTION_MATERIAL_REQUIRED");return {...t,readerAddress:row.material.address,originalMaterial:row.material,sourceFile:file,sourceHash:catalog.reader.files.get(file),validation:evaluateFrictionTopic(t.topic as keyof typeof FRICTION_FIELDS),crossChapterOriginalLink:row.material.chapterId!=="CH07"};});
}
