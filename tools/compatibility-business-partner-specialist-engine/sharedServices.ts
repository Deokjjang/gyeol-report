// Offline composition root: reuse source-neutral validators without importing
// another specialist's policy into the new source tree.
import {verifyCurrentWorkSemantics,validateWorkTrait,verifyDirectedPairSources} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/sourceOwnership";
import {validateAncestry,domainReasons,COWORKER_DOMAINS} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/workDomainBoundary";
import type {WorkTrait,PairReview} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-coworker-specialist-engine/researchCatalog";
import type {PairSource,WorkTrait as BusinessTrait} from "../../src/lib/report-knowledge/knowledge-integration-foundation/compatibility-business-partner-specialist-engine/researchCatalog";
import type {KnowledgeBinderCatalog} from "../../src/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import type {ActualBindingIndex} from "../../src/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/matching";
import {isRecord} from "../../src/lib/report-knowledge/knowledge-integration-foundation/normalization";
export const sharedServices={validateAncestry,domainReasons,allowedDomains:COWORKER_DOMAINS,
 verifyCurrentWorkSemantics:(traits:readonly BusinessTrait[])=>verifyCurrentWorkSemantics(traits as readonly WorkTrait[]),
 validateWorkTrait:(s:BusinessTrait,owner:"A"|"B",type:string|null,c:KnowledgeBinderCatalog,a?:ActualBindingIndex)=>validateWorkTrait(s as WorkTrait,owner,type,c,a),
 verifyDirectedPairSources:(reviews:readonly PairSource[],catalog:KnowledgeBinderCatalog)=>verifyDirectedPairSources(reviews.map(r=>({...r,coworkerPatternExists:false})) as PairReview[],catalog).map(r=>{let raw:unknown=JSON.parse(catalog.reader.text(r.forward.file));for(const p of r.forward.pointer.split("/").slice(1))raw=isRecord(raw)||Array.isArray(raw)?(raw as Record<string,unknown>)[p]:undefined;const {coworkerPatternExists,...v}=r;return {...v,businessPartnerPatternExists:isRecord(raw)&&"businessPartnerPattern"in raw,otherCategoryPatternObserved:coworkerPatternExists};})};
