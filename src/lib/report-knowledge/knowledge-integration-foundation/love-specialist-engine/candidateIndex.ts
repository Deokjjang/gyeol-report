import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { Material } from "../../love-product-research/researchTypes";
import { isRecord } from "../normalization";
import { adaptLoveRequirements } from "./requirementAdapter";
import type { LoveCandidate } from "./types";
export class LoveSpecialistIndex {
  readonly candidates=new Map<string,LoveCandidate>();readonly byQuestion=new Map<string,string[]>();readonly byAddress=new Map<string,string[]>();readonly byOriginalId=new Map<string,string>();readonly bySourceKey=new Map<string,string[]>();readonly byAxis=new Map<string,string[]>();readonly byFacet=new Map<string,string[]>();readonly byStatus=new Map<string,string[]>();readonly bySourceDomain=new Map<string,string[]>();readonly byParentingSource=new Map<string,string[]>();readonly byApproval=new Map<string,string[]>();readonly byPartnerRequirement=new Map<string,string[]>();readonly byChildRequirement=new Map<string,string[]>();readonly byFusionRule=new Map<string,string[]>();
  readonly questions;readonly applicableCandidates;
  constructor(readonly foundation:ProductSpecialistFoundation){
    this.questions=foundation.registry.questions.filter(q=>q.productKey==="love_marriage_child");this.applicableCandidates=foundation.catalog.search("love_marriage_child",null);
    const qids=new Set(this.questions.map(q=>q.id)),links=new Map<string,typeof foundation.questions.links>();
    for(const l of foundation.questions.links)if(qids.has(l.questionId))links.set(l.catalogKey,[...(links.get(l.catalogKey)??[]),l]);
    const add=(map:Map<string,string[]>,k:string,id:string)=>map.set(k,[...(map.get(k)??[]),id]);
    for(const c of this.applicableCandidates){if(c.record.family!=="love-product-research"||!/\/chapter\d+Materials\.ts$/.test(c.record.locator.file))continue;
      const raw=foundation.catalog.raw.get(c.record.catalogKey);if(!isRecord(raw)||raw.productKey!=="love_marriage_child"||!Array.isArray(raw.sourceKeys)||!Array.isArray(raw.relationshipStatuses)||!isRecord(raw.roleContributions))throw Error("ORIGINAL_LOVE_MATERIAL_SHAPE_INVALID");
      const material=raw as unknown as Material,a=adaptLoveRequirements(foundation.overlays.get(c.record.catalogKey)!.candidate,material,foundation.catalog),row:LoveCandidate={catalogKey:c.record.catalogKey,originalId:c.record.originalId,locator:c.record.locator,material,links:links.get(c.record.catalogKey)??[],sources:a.sources,bindingCandidate:a.candidate,meaningId:c.requirement.meaningIdentity,claimId:c.requirement.claimIdentity,meaningReview:"MEANING_RELATION_REVIEW_REQUIRED",customerApproved:false};
      this.candidates.set(row.catalogKey,row);this.byOriginalId.set(material.id,row.catalogKey);add(this.byAddress,material.address,row.catalogKey);add(this.byApproval,"UNAPPROVED",row.catalogKey);
      for(const l of row.links)add(this.byQuestion,l.questionId,row.catalogKey);for(const s of row.sources){add(this.bySourceKey,s.key,row.catalogKey);const domain=s.registry?.originalState.area;if(typeof domain==="string")add(this.bySourceDomain,domain,row.catalogKey);if(domain==="parenting"&&s.originalId)add(this.byParentingSource,s.originalId,row.catalogKey);if(s.registry?.sourceKind==="fusion_research"&&s.originalId)add(this.byFusionRule,s.originalId,row.catalogKey);}
      for(const f of material.semanticFacets){add(this.byAxis,f.axis,row.catalogKey);add(this.byFacet,f.id,row.catalogKey);}for(const s of material.relationshipStatuses)add(this.byStatus,s,row.catalogKey);
      add(this.byPartnerRequirement,"COUPLE_CLAIMS_REQUIRE_ACTUAL_PARTNER",row.catalogKey);add(this.byChildRequirement,"CHILD_CLAIMS_REQUIRE_ACTUAL_CHILD",row.catalogKey);
    }
  }
}
