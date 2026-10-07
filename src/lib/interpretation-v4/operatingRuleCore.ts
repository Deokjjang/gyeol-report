import type { ComprehensiveSectionId } from "./comprehensivePlanCore";
export const OPERATING_RULE_SOURCES = ["GUIDANCE","STRENGTH_USE","STRENGTH_SHADOW_GUARD","TENSION_SWITCH","FORTUNE_OPPORTUNITY"] as const;
export type OperatingRuleSourceType = typeof OPERATING_RULE_SOURCES[number];
export type OperatingSlot = "THINKING"|"EXECUTION"|"WORK_MONEY"|"RELATIONSHIP"|"RECOVERY";
export type OperatingRuleCandidate = {
  id:string; sourceType:OperatingRuleSourceType; operatingSlot:OperatingSlot;
  sourceTraitArcIds:string[]; sourceResonanceIds:string[]; sourceFusionIds:string[]; sourceClaimIds:string[]; sourceGuidanceIds:string[];
  evidenceIds:string[]; mbtiSourceNodeIds:string[]; antecedentCandidateIds:string[]; introducedInSection:ComprehensiveSectionId[];
  ruleText:string; shortTitle:string; confidence:"MEDIUM"|"HIGH"; alreadyIntroduced:true;
  semanticTheme:string; meaningKey:string; priority:number; mergedSourceTypes:OperatingRuleSourceType[];
};
