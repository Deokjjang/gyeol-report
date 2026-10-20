import {verifyCurrentWorkSemantics,verifyDirectedPairSources,validateWorkTrait} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/sourceOwnership";
import {validateAncestry,domainReasons,COWORKER_DOMAINS} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/workDomainBoundary";
import type {PairReview} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-manager-report-specialist-engine/researchCatalog";
import type {KnowledgeBinderCatalog} from "../../src/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import {isRecord} from "../../src/lib/report-knowledge/knowledge-integration-foundation/normalization";
export const sharedServices={verifyCurrentWorkSemantics,validateWorkTrait,validateAncestry,domainReasons,allowedDomains:COWORKER_DOMAINS,
 verifyDirectedPairSources:(reviews:readonly PairReview[],catalog:KnowledgeBinderCatalog)=>verifyDirectedPairSources(reviews.map(r=>({...r,coworkerPatternExists:false as const})),catalog).map(r=>{
 let raw:unknown=JSON.parse(catalog.reader.text(r.forward.file));for(const p of r.forward.pointer.split("/").slice(1))raw=isRecord(raw)||Array.isArray(raw)?(raw as Record<string,unknown>)[p]:undefined;
 const {coworkerPatternExists,...verified}=r;return {...verified,managerReportPatternExists:isRecord(raw)&&"managerReportPattern"in raw,legacyOtherCategoryPatternObserved:coworkerPatternExists};
 })};
