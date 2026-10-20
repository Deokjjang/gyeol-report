import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { Material } from "../../career-product-research/researchTypes";
import { CAREER_JOB_RESEARCH } from "../../career-product-research/jobFunctionResearch";
import { CAREER_DETAIL_JOB_APPLICATIONS } from "../../career-product-research/detailJobApplicability";
import { CAREER_PARAGRAPH_RESEARCH } from "../../career-product-research/paragraphResearch";
import { JOB_STATUSES } from "../../../report-generation/reportInputTypes";
import { isRecord } from "../normalization";
import { adaptCareerRequirements } from "./requirementAdapter";
import { economicRequirement, learningRequirement } from "./domainRequirements";
import type { CareerSpecialistCandidate } from "./types";
export class CareerSpecialistIndex {
  readonly candidates=new Map<string,CareerSpecialistCandidate>();readonly byQuestion=new Map<string,string[]>();readonly byAddress=new Map<string,string[]>();readonly byOriginalId=new Map<string,string>();
  readonly bySourceKey=new Map<string,string[]>();readonly byAxis=new Map<string,string[]>();readonly byFacet=new Map<string,string[]>();readonly byJobStatus=new Map<string,string[]>();readonly byDetailJobRef=new Map<string,string[]>();readonly byWorkFunction=new Map<string,string[]>();readonly byRecommendationId=new Map<string,string[]>();readonly byEconomicMeaning=new Map<string,string[]>();readonly byLearningMeaning=new Map<string,string[]>();
  readonly questions;readonly applicableCandidates;
  constructor(readonly foundation:ProductSpecialistFoundation){
    this.questions=foundation.registry.questions.filter(q=>q.productKey==="career_money_study");this.applicableCandidates=foundation.catalog.search("career_money_study",null);
    const ids=new Set(this.questions.map(q=>q.id)),links=new Map<string,typeof foundation.questions.links>();
    for(const l of foundation.questions.links)if(ids.has(l.questionId))links.set(l.catalogKey,[...(links.get(l.catalogKey)??[]),l]);
    const add=(map:Map<string,string[]>,key:string,id:string)=>map.set(key,[...(map.get(key)??[]),id]);
    for(const c of this.applicableCandidates){const raw=foundation.catalog.raw.get(c.record.catalogKey);if(c.record.family!=="career-product-research"||!c.record.locator.file.match(/\/chapter\d+Materials\.ts$/))continue;
      if(!isRecord(raw)||raw.productKey!=="career_money_study"||!Array.isArray(raw.sourceKeys)||!Array.isArray(raw.jobStatuses)||!isRecord(raw.roleContributions))throw Error("ORIGINAL_CAREER_MATERIAL_SHAPE_INVALID");
      const material=raw as unknown as Material,adapted=adaptCareerRequirements(foundation.overlays.get(c.record.catalogKey)!.candidate,material,foundation.catalog),jobs=CAREER_JOB_RESEARCH.filter(j=>material.detailJobRefs.includes(j.id)),details=CAREER_DETAIL_JOB_APPLICATIONS.filter(d=>d.materialRefs.includes(material.id)),paragraph=CAREER_PARAGRAPH_RESEARCH.find(p=>p.address===material.address);
      const row:CareerSpecialistCandidate={catalogKey:c.record.catalogKey,originalId:c.record.originalId,locator:c.record.locator,material,links:links.get(c.record.catalogKey)??[],bindingCandidate:adapted.candidate,sources:adapted.resolutions,job:{allowed:material.jobStatuses,allStatusesScopeOnly:JOB_STATUSES.every(s=>material.jobStatuses.includes(s)),detailJobRefs:material.detailJobRefs,originalInput:material.prerequisites.input},functions:{jobResearch:jobs,details,unsupportedConditions:details.map(d=>d.additionalEvidenceNeed)},recommendation:{requiresRecommendation:material.prerequisites.requiresExistingRecommendation,requiresAvoid:material.prerequisites.requiresExistingAvoidProof,possibleRouteReferences:[...new Set(jobs.flatMap(j=>j.existingRouteRefs))],professionalApplicationApproved:false},economic:economicRequirement(material,paragraph,details),learning:learningRequirement(material,paragraph,details),meaning:{meaningId:c.requirement.meaningIdentity,claimId:c.requirement.claimIdentity,review:"MEANING_RELATION_REVIEW_REQUIRED"},customerApproved:false};
      this.candidates.set(c.record.catalogKey,row);this.byOriginalId.set(material.id,c.record.catalogKey);add(this.byAddress,material.address,c.record.catalogKey);
      for(const l of row.links)add(this.byQuestion,l.questionId,c.record.catalogKey);for(const s of material.sourceKeys)add(this.bySourceKey,s,c.record.catalogKey);for(const f of material.semanticFacets){add(this.byAxis,f.axis,c.record.catalogKey);add(this.byFacet,f.id,c.record.catalogKey);}for(const s of material.jobStatuses)add(this.byJobStatus,s,c.record.catalogKey);for(const j of jobs){add(this.byDetailJobRef,j.id,c.record.catalogKey);add(this.byWorkFunction,j.observedFunction,c.record.catalogKey);}for(const id of row.recommendation.possibleRouteReferences)add(this.byRecommendationId,id,c.record.catalogKey);
      // Economic/learning original conditions are indexed by original paragraph,
      // not guessed classified into the vocabulary from a shared keyword.
      add(this.byEconomicMeaning,material.address,c.record.catalogKey);add(this.byLearningMeaning,material.address,c.record.catalogKey);
    }
  }
}
