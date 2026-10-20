import {isRecord} from "../normalization";
import type {KnowledgeBinderCatalog} from "../knowledge-binder/catalog";
import type {BusinessPartnerMaterial,BusinessStageResearch,BusinessSpecialistResearch,WorkTraitReview,PairReview} from "../../../../../tools/compatibility-business-partner-specialist-engine/researchTypes";
import type {OriginalSource,OriginalRelation} from "../compatibility-love-specialist-engine/researchCatalog";
export type Material=BusinessPartnerMaterial;
export type OriginalSourceView=OriginalSource;
export type WorkTrait=WorkTraitReview;
export type PairSource=PairReview;
export function readBusinessPartnerResearch(catalog:KnowledgeBinderCatalog){
 const checked=new Set<string>();
 const records=catalog.input.records.filter(r=>r.originalId.startsWith("bppr:")).map(record=>{const raw=catalog.raw.get(record.catalogKey);if(catalog.sourceChecks.get(record.catalogKey)?.state!=="PASS"||!isRecord(raw)||raw.id!==record.originalId||raw.productKey!=="saju_mbti_compatibility"||raw.relationshipCategory!=="businessPartner"||!checked.has(record.locator.file)&&(catalog.reader.text(record.locator.file),catalog.reader.files.get(record.locator.file))!==catalog.input.frozen.get(record.locator.file))throw Error("ORIGINAL_BUSINESS_PARTNER_RECORD_REQUIRED");checked.add(record.locator.file);return {record,raw};});
 const by=<T,>(p:string)=>records.filter(r=>r.record.originalId.startsWith("bppr:"+p+":")).map(r=>r.raw as unknown as T);
 const result={records,sources:by<OriginalSource>("source"),relations:by<OriginalRelation>("relation"),pairReviews:by<PairSource>("pair"),traits:by<WorkTrait>("work-trait"),stages:by<BusinessStageResearch>("stage"),statuses:by<BusinessSpecialistResearch>("status"),contexts:by<BusinessSpecialistResearch>("context"),contributions:by<BusinessSpecialistResearch>("contribution"),decisions:by<BusinessSpecialistResearch>("decision"),procedures:by<BusinessSpecialistResearch>("decisionMode"),finances:by<BusinessSpecialistResearch>("finance"),contracts:by<BusinessSpecialistResearch>("contract").filter(r=>r.family==="contract"),exits:by<BusinessSpecialistResearch>("exit")};
 if([result.sources.length,result.relations.length,result.pairReviews.length,result.traits.length,result.stages.length,result.statuses.length,result.contexts.length,result.contributions.length,result.decisions.length,result.procedures.length,result.finances.length,result.contracts.length,result.exits.length].join()!==[46,64,256,779,17,7,15,15,13,9,13,7,6].join())throw Error("BUSINESS_PARTNER_RESEARCH_INVENTORY_CHANGED");return result;
}
