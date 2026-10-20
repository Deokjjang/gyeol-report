import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { OriginalSource, OriginalRelation } from "../compatibility-love-specialist-engine/researchCatalog";
export type OriginalSourceView=OriginalSource;
export type Material = {
 id: string; chapterId: string; paragraphId: string; address: string; mode: "JOINT"|"SELF_A"|"SELF_B"|"AB"|"BA"|"RECALL";
 readerQuestion: string; coreMeaning: string; roleContributions: {address:string; originalRole:string; knowledge:string}[];
 ownedSources: {owner:string;sourceKey:string;sourceUse:string}[]; semanticFacets:{id:string;axis:string;condition:string}[];
 workStage:string;workFunctions:string[];outputType:string;positive:string;risk:string;factBomb:string;twist:string;
 fictionalScene:{status:string;text:string;isCustomerHistory:false};actions:{personA:string;personB:string};counterexample:string;distinctFromOtherParagraphs:string;
 precedingMeaningRefs:string[];introducedMeaningRequirements:{materialId:string;expectedMode:string;direction:string|null;actualOwnersMustMatch:true;actualTaskMustMatch:true;actuallyDisplayedRequired:true;mayUseOnlyCompatibleDisplayedSubset:true}[];
 requirements:{sourceGroups:{groupId:string;sourceKeys:string[];typePredicates:{owner:string;type:string;sourceKey:string}[];allSourcesWithinGroupRequired:true}[];groupPolicy:"all_direct_sources"|"compatible_actually_displayed_group_only";policyRef:string;typePredicates:{owner:string;type:string;sourceKey:string;domain:string}[];direction:{direction:string;subject:string;recipient:string;tenGodViewer:string;tenGodTarget:string}|null;canonicalClaim:string;jobRole:string;authority:string;workplace:string;workHistory:string;actualWorkContextRequired:boolean;additionalInput:string[];introducedRequired:boolean};
 roleVersion:string;declaredRoles:{personA:string;personB:string};authorityContext:{kind:string;actualAuthority:string;verificationRequired:boolean;question:string};managerResponsibleAction:string;teamMemberAvailableAction:string;safeVoiceCondition:string;
 repair:{firstFactCheck:string;aChange:string;bChange:string;authority:string;scope:string;recheck:string;improvement:string;safetySupport:string};
};
export type ManagementConcept={id:string;concept:string;definition:string;managerResponsibility:string;reportAvailableAction:string;limits:string;sourceKeys:string[];basis:string;applicationStatus:string;materialRefs:string[];actualAuthority:"UNKNOWN"};
export type WorkTrait={id:string;type:string;area:string;domain:string;file:string;pointer:string;recordSha256:string;sourceFileSha256:string;sourceCoverage:string;raw:Record<string,unknown>;semanticNode:{id:string;classification:string;sourceDomain:string;sourcePath:string;annotationCount:number};currentProjectionAllowed:boolean;empiricalValidation:string};
export type Process={id:string;stage:string;question:string;input:string;personAContribution:string;personBContribution:string;output:string;qualityCheck:string;handoffNeed:string;risk:string;repair:string;counterexample:string;sourceKeys:string[];materialRefs:string[];sceneStatus:string};
export type Job={id:string;jobKey:string;jobLabel:string;priorAuditRef:string;priorRecordHash:string;tasks:string;personAStage:string;personBStage:string;requiredInformation:string;output:string;qualityCriterion:string;problem:string;usefulContribution:string;handoff:string;revisionDone:string;nextProcedure:string;additionalInput:string[];authority:string;actualJob:string;sceneStatus:string;materialRefs:string[]};
export type PairReview={id:string;sourceType:string;targetType:string;forward:{pointer:string;sha256:string;sourceCoverage:string};reverse:{pointer:string;sha256:string;sourceCoverage:string};genericReference:unknown;coverageClass:string;managerReportPatternExists:false;romanticPatternsWithheld:true};
/** Catalog-native views retain complete original objects; no research imports or registration. */
export function readManagerReportResearch(catalog:KnowledgeBinderCatalog){
 const checked=new Set<string>();
 const records=catalog.input.records.filter(r=>r.originalId.startsWith("mrpr:")).map(record=>{const raw=catalog.raw.get(record.catalogKey);if(catalog.sourceChecks.get(record.catalogKey)?.state!=="PASS"||!isRecord(raw)||raw.id!==record.originalId||raw.productKey!=="saju_mbti_compatibility"||raw.relationshipCategory!=="managerReport"||!checked.has(record.locator.file)&&(catalog.reader.text(record.locator.file),catalog.reader.files.get(record.locator.file))!==catalog.input.frozen.get(record.locator.file))throw Error("ORIGINAL_MANAGER_REPORT_RECORD_REQUIRED");checked.add(record.locator.file);return {record,raw};});
 const byPrefix=<T,>(prefix:string)=>records.filter(r=>r.record.originalId.startsWith("mrpr:"+prefix+":")).map(r=>r.raw as unknown as T);
 const result={records,sources:byPrefix<OriginalSource>("source"),relations:byPrefix<OriginalRelation>("relation"),pairReviews:byPrefix<PairReview>("pair"),traits:byPrefix<WorkTrait>("work-trait"),processes:byPrefix<Process>("process"),jobs:byPrefix<Job>("job"),concepts:byPrefix<ManagementConcept>("concept")};
 if(result.sources.length!==68||result.relations.length!==64||result.pairReviews.length!==256||result.traits.length!==603||result.processes.length!==14||result.jobs.length!==23||result.concepts.length!==16)throw Error("MANAGER_REPORT_RESEARCH_INVENTORY_CHANGED");return result;
}
