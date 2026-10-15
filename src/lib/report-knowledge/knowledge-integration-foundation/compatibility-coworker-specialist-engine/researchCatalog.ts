import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { OriginalSource, OriginalRelation } from "../compatibility-love-specialist-engine/researchCatalog";
export type Material = {
 id: string; chapterId: string; paragraphId: string; address: string; mode: "JOINT"|"SELF_A"|"SELF_B"|"AB"|"BA"|"RECALL";
 readerQuestion: string; coreMeaning: string; roleContributions: {address:string; originalRole:string; knowledge:string}[];
 ownedSources: {owner:string;sourceKey:string;sourceUse:string}[]; semanticFacets:{id:string;axis:string;condition:string}[];
 workStage:string;workFunctions:string[];outputType:string;positive:string;risk:string;factBomb:string;twist:string;
 fictionalScene:{status:string;text:string;isCustomerHistory:false};actions:{personA:string;personB:string};counterexample:string;distinctFromOtherParagraphs:string;
 precedingMeaningRefs:string[];introducedMeaningRequirements:{materialId:string;expectedMode:string;direction:string|null;actualOwnersMustMatch:true;actualTaskMustMatch:true;actuallyDisplayedRequired:true;mayUseOnlyCompatibleDisplayedSubset:true}[];
 requirements:{policyRef:string;typePredicates:{owner:string;type:string;sourceKey:string;domain:string}[];direction:{direction:string;subject:string;recipient:string;tenGodViewer:string;tenGodTarget:string}|null;canonicalClaim:string;jobRole:string;authority:string;workplace:string;workHistory:string;actualWorkContextRequired:boolean;additionalInput:string[];introducedRequired:boolean};
 repair:{firstFactCheck:string;aChange:string;bChange:string;authority:string;scope:string;recheck:string;improvement:string;safetySupport:string};
};
export type WorkTrait={id:string;type:string;area:string;domain:string;file:string;pointer:string;recordSha256:string;sourceFileSha256:string;sourceCoverage:string;raw:Record<string,unknown>;semanticNode:{id:string;classification:string;sourceDomain:string;sourcePath:string;annotationCount:number};currentProjectionAllowed:boolean;empiricalValidation:string};
export type Process={id:string;stage:string;question:string;input:string;personAContribution:string;personBContribution:string;output:string;qualityCheck:string;handoffNeed:string;risk:string;repair:string;counterexample:string;sourceKeys:string[];materialRefs:string[];sceneStatus:string};
export type Job={id:string;jobKey:string;jobLabel:string;priorAuditRef:string;priorRecordHash:string;tasks:string;personAStage:string;personBStage:string;requiredInformation:string;output:string;qualityCriterion:string;problem:string;usefulContribution:string;handoff:string;revisionDone:string;nextProcedure:string;additionalInput:string[];authority:string;actualJob:string;sceneStatus:string;materialRefs:string[]};
export type PairReview={id:string;sourceType:string;targetType:string;forward:{pointer:string;sha256:string;sourceCoverage:string};reverse:{pointer:string;sha256:string;sourceCoverage:string};genericReference:unknown;coverageClass:string;coworkerPatternExists:false;romanticPatternsWithheld:true};
/** Catalog-native views retain complete original objects; no research imports or registration. */
export function readCoworkerResearch(catalog:KnowledgeBinderCatalog){
 const checked=new Set<string>();
 const records=catalog.input.records.filter(r=>r.originalId.startsWith("cwpr:")).map(record=>{const raw=catalog.raw.get(record.catalogKey);if(catalog.sourceChecks.get(record.catalogKey)?.state!=="PASS"||!isRecord(raw)||raw.id!==record.originalId||raw.productKey!=="saju_mbti_compatibility"||raw.relationshipCategory!=="coworker"||!checked.has(record.locator.file)&&(catalog.reader.text(record.locator.file),catalog.reader.files.get(record.locator.file))!==catalog.input.frozen.get(record.locator.file))throw Error("ORIGINAL_COWORKER_RECORD_REQUIRED");checked.add(record.locator.file);return {record,raw};});
 const byPrefix=<T,>(prefix:string)=>records.filter(r=>r.record.originalId.startsWith("cwpr:"+prefix+":")).map(r=>r.raw as unknown as T);
 const result={records,sources:byPrefix<OriginalSource>("source"),relations:byPrefix<OriginalRelation>("relation"),pairReviews:byPrefix<PairReview>("pair"),traits:byPrefix<WorkTrait>("work-trait"),processes:byPrefix<Process>("process"),jobs:byPrefix<Job>("job")};
 if(result.sources.length!==113||result.relations.length!==64||result.pairReviews.length!==256||result.traits.length!==603||result.processes.length!==14||result.jobs.length!==23)throw Error("COWORKER_RESEARCH_INVENTORY_CHANGED");return result;
}
