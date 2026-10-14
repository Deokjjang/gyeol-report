import type { Material, ParagraphResearch, DetailApplication } from "../../career-product-research/researchTypes";
import type { CareerEconomicRequirement, CareerLearningRequirement } from "./types";
/** Distinct concepts are declared output vocabulary, not an NLP inference from
 * a money/learning word or a claim about the person's actual finances/skills. */
export const ECONOMIC_CONCEPTS=["revenue","profit","cashFlow","compensation","price","workTime","opportunityCost","maintenanceCost"] as const;
export const LEARNING_CONCEPTS=["interest","preference","conceptUnderstanding","practiceExperience","independentPerformance","transferPerformance","qualification","legalAuthority","professionalSkill"] as const;
export function economicRequirement(material:Material, paragraph?:ParagraphResearch, details:readonly DetailApplication[]=[]):CareerEconomicRequirement {
  return {original:[material.economicScene,material.prerequisites.input,...(paragraph?[paragraph.economicCondition]:[]),...details.map(d=>d.economicCondition)],categories:[],actualAmounts:"UNKNOWN",traditionalSymbolIsMoney:false,status:"REVIEW_REQUIRED"};
}
export function learningRequirement(material:Material, paragraph?:ParagraphResearch, details:readonly DetailApplication[]=[]):CareerLearningRequirement {
  return {original:[material.learningScene,material.prerequisites.input,...(paragraph?[paragraph.learningCondition]:[]),...details.flatMap(d=>[d.skillVerification,d.additionalEvidenceNeed])],categories:[],actualSkill:"UNKNOWN",qualifications:"UNKNOWN",preferenceIsAbility:false,status:"REVIEW_REQUIRED"};
}
export function checkEnteredRequirements(required:readonly string[], entered:readonly string[], code:string):string[]{return required.every(x=>entered.includes(x))?[]:[code];}
