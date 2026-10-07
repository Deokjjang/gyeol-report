import type { ComprehensiveSectionId as S, EditorialCandidate, EditorialEmotion, EditorialSource, SectionBridgeIntent, SectionKind, SectionSlot, ComprehensiveSectionPlan } from "./comprehensivePlanCore";
import type { InterpretationContext } from "./semanticCore";

type Contract = { purpose: string; kind: SectionKind; maxPrimary: number; target: [number, number]; maxSupport: number;
  sources: EditorialSource[]; contexts: InterpretationContext[]; slots: SectionSlot[]; emotions: EditorialEmotion[]; score: number;
  depth: ComprehensiveSectionPlan["depthIntent"]; units: [number, number]; bridge?: SectionBridgeIntent; maxExplicit: number };
const sources: EditorialSource[] = ["PERSONAL_RESONANCE", "CLAIM", "FUSION", "TRAIT_ARC", "MYEONGLI_PATTERN"];
export const COMPREHENSIVE_SECTION_CONTRACTS: Record<S, Contract> = {
  C1: { purpose: "나는 한마디로 어떤 사람인가", kind: "IDENTITY", maxPrimary: 1, target: [1, 1], maxSupport: 2, sources: ["CORE_GYEOL", ...sources], contexts: ["identity"], slots: [], emotions: ["RELATABLE"], score: 30, depth: "DEEP", units: [2, 3], bridge: "IDENTITY_TO_REINFORCE", maxExplicit: 1 },
  C2: { purpose: "명리와 MBTI가 같은 곳", kind: "REINFORCE", maxPrimary: 2, target: [1, 2], maxSupport: 1, sources: ["FUSION", "MYEONGLI_PATTERN"], contexts: ["identity"], slots: [], emotions: ["SURPRISING"], score: 45, depth: "NORMAL", units: [2, 3], bridge: "REINFORCE_TO_TENSION", maxExplicit: 2 },
  C3: { purpose: "둘이 다르게 말해서 생기는 나의 반전", kind: "TENSION", maxPrimary: 2, target: [1, 2], maxSupport: 1, sources: ["FUSION", "PERSONAL_RESONANCE", "MYEONGLI_PATTERN"], contexts: ["identity", "stress"], slots: [], emotions: ["DISCOVERY", "REASSURING"], score: 20, depth: "DEEP", units: [1, 2], bridge: "TENSION_TO_STRENGTH", maxExplicit: 2 },
  C4: { purpose: "내가 가장 잘하는 것", kind: "STRENGTH", maxPrimary: 3, target: [2, 3], maxSupport: 1, sources, contexts: ["identity", "learning", "work", "social"], slots: [], emotions: ["CONFIDENCE", "UPLIFTING"], score: 55, depth: "NORMAL", units: [2, 3], bridge: "STRENGTH_TO_FORTUNE", maxExplicit: 0 },
  C5: { purpose: "내가 가진 좋은 패", kind: "GOOD_FORTUNE", maxPrimary: 3, target: [1, 3], maxSupport: 1, sources: ["CLAIM", "TRAIT_ARC", "MYEONGLI_PATTERN", "PERSONAL_RESONANCE"], contexts: ["identity", "money", "social", "work", "love", "learning"], slots: [], emotions: ["FORTUNE_REWARD", "UPLIFTING"], score: 80, depth: "NORMAL", units: [1, 3], bridge: "FORTUNE_TO_SHADOW", maxExplicit: 0 },
  C6: { purpose: "나도 인정하기 싫은 팩폭", kind: "FACT_BOMB", maxPrimary: 4, target: [2, 4], maxSupport: 2, sources: ["CLAIM", "TRAIT_ARC", "PERSONAL_RESONANCE", "GUIDANCE"], contexts: ["stress", "identity", "work", "social", "money"], slots: [], emotions: ["FACT_BOMB"], score: -25, depth: "SHORT", units: [1, 2], bridge: "SHADOW_TO_RELATION", maxExplicit: 0 },
  C7: { purpose: "사람과 사랑에서의 나", kind: "RELATION", maxPrimary: 4, target: [3, 4], maxSupport: 2, sources: [...sources, "GUIDANCE"], contexts: ["social", "love"], slots: ["OTHERS_SEE_ME", "LOVE_STYLE", "CLOSE_RELATION_CHANGE", "RELATION_RISK", "RELATION_STRENGTH", "RELATION_GUIDANCE"], emotions: ["RELATABLE", "WARM"], score: 20, depth: "NORMAL", units: [2, 3], bridge: "RELATION_TO_WORK", maxExplicit: 1 },
  C8: { purpose: "일과 돈에서의 나", kind: "WORK_MONEY", maxPrimary: 5, target: [3, 5], maxSupport: 2, sources: [...sources, "GUIDANCE"], contexts: ["work", "money", "learning"], slots: ["WORK_STYLE", "MONEY_STYLE", "CURRENT_CONTEXT", "RESULT_STYLE", "SUCCESS_DESIRE", "WORK_GUIDANCE", "MONEY_GUIDANCE"], emotions: ["PRACTICAL", "DESIRE"], score: 30, depth: "NORMAL", units: [3, 4], bridge: "WORK_TO_RECOVERY", maxExplicit: 1 },
  C9: { purpose: "내가 편해지는 환경과 회복법", kind: "RECOVERY_ENVIRONMENT", maxPrimary: 3, target: [2, 3], maxSupport: 2, sources: [...sources, "GUIDANCE"], contexts: ["recovery", "stress"], slots: ["ELEMENT_COMPOSITE", "YIN_YANG", "RECOVERY_STYLE", "RECOVERY_GUIDANCE", "OVERUSED_PATTERN", "UNDERUSED_PATTERN", "ENVIRONMENT"], emotions: ["REASSURING"], score: 25, depth: "NORMAL", units: [2, 3], bridge: "RECOVERY_TO_MANUAL", maxExplicit: 1 },
  C10: { purpose: "이런 나를 잘 쓰는 방법", kind: "OPERATING_MANUAL", maxPrimary: 5, target: [3, 5], maxSupport: 0, sources: ["GUIDANCE"], contexts: ["identity", "work", "money", "social", "love", "recovery", "learning"], slots: ["THINKING", "EXECUTION", "WORK_MONEY", "RELATIONSHIP", "RECOVERY"], emotions: ["PRACTICAL", "CONFIDENCE"], score: 65, depth: "SHORT", units: [3, 5], maxExplicit: 0 },
};

export const CLAIM_SECTION_PREFERENCES: Record<string, S[]> = {
  IDENTITY: ["C1", "C4"], STRENGTH: ["C4"], MONEY_STYLE: ["C8"], MONEY_FORTUNE: ["C5"], LEADERSHIP: ["C4", "C8"], HONOR: ["C5", "C8"], HIGH_POSITION: ["C5", "C8"], SUCCESS: ["C4", "C8"], EXPERTISE: ["C4", "C8"], BUSINESS: ["C8"], PEOPLE_LUCK: ["C5", "C7"], CHARM: ["C5", "C7"], FACT_BOMB: ["C6"],
};
export function sectionFit(c: EditorialCandidate, s: S): number {
  if (!c.allowedSections.includes(s) || !COMPREHENSIVE_SECTION_CONTRACTS[s].sources.includes(c.sourceType)) return 0;
  return c.preferredSections.includes(s) ? 1 : .8;
}
export function primarySectionEligible(c: EditorialCandidate, s: S, kind: SectionKind): boolean {
  if (!c.primaryEligible || !sectionFit(c, s)) return false;
  if (s === "C1") return c.sourceType === "CORE_GYEOL";
  if (s === "C2") return kind === "MYEONGLI_CONFIRMATION" ? c.sourceType === "MYEONGLI_PATTERN" && c.independentFamilies.length >= 2 && !c.internalComplexity : c.fusionType === "REINFORCE";
  if (s === "C3") return kind === "TENSION" ? c.fusionType === "TENSION" && c.conditionSplit?.resolved === true : kind === "COMPLEMENT_SURPRISE" ? c.fusionType === "COMPLEMENT" : !!c.internalComplexity || c.elementComposite;
  if (s === "C4") return c.positiveValence > c.negativeValence && !c.fortune && c.sourceType !== "GUIDANCE" && c.arcRole !== "SHADOW" && !c.internalComplexity && !c.primaryAxes.includes("RECOVERY_NEED") && !c.contexts.every(x => ["love", "recovery", "stress"].includes(x));
  if (s === "C5") return kind === "GOOD_FORTUNE" ? c.fortune && (c.claimLevel ?? 0) >= 3 : !c.fortune && c.positiveValence > c.negativeValence && c.sourceType !== "FUSION";
  if (s === "C6") return c.factBomb || c.arcRole === "SHADOW";
  if (s === "C7") return !c.fortune && c.contexts.some(x => x === "social" || x === "love") && c.sourceType !== "GUIDANCE" && c.primaryAxes.some(a => ["CARE", "SOCIAL_ATTUNEMENT", "RELATION_STYLE", "BOUNDARY", "COMMUNICATION_STYLE", "CHARISMA", "EXPRESSION"].includes(a));
  if (s === "C8") return !c.fortune && !c.factBomb && c.sourceType !== "GUIDANCE" && c.contexts.some(x => ["work", "money", "learning"].includes(x));
  if (s === "C9") return c.sourceType === "GUIDANCE" ? c.operatingRuleType === "RECOVERY" : c.elementComposite || c.strongYinYang || c.primaryAxes.includes("RECOVERY_NEED");
  return c.sourceType === "GUIDANCE";
}
