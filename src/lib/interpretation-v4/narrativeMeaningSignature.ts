import type { EditorialCandidate, ComprehensiveSectionId, CandidatePlacement } from "./comprehensivePlanCore";
import type { SemanticAxis } from "./semanticCore";

export const BEHAVIOR_FAMILIES = ["DEEP_THINKING","ERROR_FINDING","DECISION_SPEED","METHOD_CHANGE","GOAL_PURSUIT","RESULT_MAKING","PUBLIC_EXPRESSION","SOCIAL_READING","CARE_GIVING","LEADERSHIP","RESPONSIBILITY","MONEY_REALITY","MONEY_OPPORTUNITY","STATUS_RECOGNITION","RELATION_BOUNDARY","RECOVERY_SOLITUDE","STABILITY_NEED","CHANGE_NEED","OVERTHINKING","PERFECTIONISM","DIRECT_SPEECH","OVERWORK","OPPORTUNITY_SCATTER"] as const;
export type BehaviorFamily = typeof BEHAVIOR_FAMILIES[number];
export type MeaningSignature = { semanticTheme:string; primaryAxes:SemanticAxis[]; behaviorFamily:BehaviorFamily;
  traitArcRole:"IDENTITY"|"EXPLANATION"|"STRENGTH"|"SHADOW"|"APPLICATION"|"GUIDANCE_RECALL"; context:string; section:ComprehensiveSectionId; candidateId:string };
const axes:Partial<Record<SemanticAxis,BehaviorFamily>>={DEPTH:"DEEP_THINKING",PRECISION:"ERROR_FINDING",ACTION_TEMPO:"DECISION_SPEED",ADAPTABILITY:"METHOD_CHANGE",GOAL_DRIVE:"GOAL_PURSUIT",CREATION:"RESULT_MAKING",EXPRESSION:"PUBLIC_EXPRESSION",SOCIAL_ATTUNEMENT:"SOCIAL_READING",CARE:"CARE_GIVING",LEADERSHIP:"LEADERSHIP",DUTY:"RESPONSIBILITY",RESOURCE_SENSE:"MONEY_REALITY",PRACTICALITY:"MONEY_REALITY",OPPORTUNITY_SENSE:"MONEY_OPPORTUNITY",STATUS_DRIVE:"STATUS_RECOGNITION",BOUNDARY:"RELATION_BOUNDARY",RECOVERY_NEED:"RECOVERY_SOLITUDE",STABILITY:"STABILITY_NEED",CHANGE_ORIENTATION:"CHANGE_NEED",COMMUNICATION_STYLE:"DIRECT_SPEECH",AUTONOMY:"RELATION_BOUNDARY",CURIOSITY:"DEEP_THINKING",PATTERN_SENSE:"DEEP_THINKING",LEARNING:"DEEP_THINKING",PERSISTENCE:"GOAL_PURSUIT",EXPANSION:"GOAL_PURSUIT"};
export function meaningSignature(c:EditorialCandidate,section:ComprehensiveSectionId,p:CandidatePlacement):MeaningSignature {
  const family:BehaviorFamily = /OVERTHINK/.test(c.semanticTheme)?"OVERTHINKING":/PERFECTION|NEVER_ENOUGH/.test(c.semanticTheme)?"PERFECTIONISM":/OVERWORK/.test(c.semanticTheme)?"OVERWORK":/TOO_MANY.*OPPORTUNIT/.test(c.semanticTheme)?"OPPORTUNITY_SCATTER":c.primaryAxes.map(a=>axes[a]).find(Boolean)??"RESULT_MAKING";
  return {semanticTheme:c.broadTheme,primaryAxes:[...c.primaryAxes].sort(),behaviorFamily:family,
    traitArcRole:section==="C10"||c.sourceType==="GUIDANCE"?"GUIDANCE_RECALL":c.factBomb&&(section==="C6"||p.reuseIntent!=="DIFFERENT_APPLICATION")?"SHADOW":section==="C1"?"IDENTITY":["C2","C3"].includes(section)?"EXPLANATION":["C4","C5"].includes(section)?"STRENGTH":"APPLICATION",
    context:p.context,section,candidateId:c.id};
}
export function repeatedMeaning(current:MeaningSignature,used:readonly MeaningSignature[]):MeaningSignature|undefined {
  const overlap=(a:SemanticAxis[],b:SemanticAxis[])=> a.length&&b.length?a.filter(x=>b.includes(x)).length/Math.min(a.length,b.length):0;
  return used.find(prev=>prev.behaviorFamily===current.behaviorFamily && prev.traitArcRole===current.traitArcRole
    && (current.traitArcRole === "SHADOW" || prev.section===current.section || prev.context===current.context)
    && (overlap(prev.primaryAxes,current.primaryAxes)>=.7 || prev.semanticTheme===current.semanticTheme));
}
export function recoveryRelevant(c:EditorialCandidate) {
  return c.primaryAxes.includes("RECOVERY_NEED") || c.sourceType==="GUIDANCE"&&c.operatingRuleType==="RECOVERY"
    || /회복|혼자 쉬|에너지.*정리|편한 환경/.test(c.sourceText);
}
