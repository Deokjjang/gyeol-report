import type { NarrativeIntent, NarrativeRequest, ParagraphPattern, SentenceRole } from "./narrativeCore";
import { stableVariants, narrativeSeed } from "./narrativeVariant";

const humanSources = ["CORE_GYEOL", "PERSONAL_RESONANCE", "CLAIM", "FUSION", "TRAIT_ARC", "MYEONGLI_EVIDENCE"] as const;
function pattern(id: string, intent: NarrativeIntent, orders: SentenceRole[][], requiredRoles: SentenceRole[], extra: Partial<ParagraphPattern> = {}): ParagraphPattern {
  return { id, intent, family: id, compatibleSourceTypes: humanSources, requiredRoles,
    optionalRoles: [...new Set(orders.flat())].filter(r => !requiredRoles.includes(r)), roleOrderVariants: orders,
    minSentences: 2, maxSentences: 5, depth: ["SHORT", "NORMAL", "DEEP"], directnessIntent: "PRESERVE", toneIntent: "HUMAN", ...extra };
}
export const NARRATIVE_PATTERNS: readonly ParagraphPattern[] = [
  pattern("P01", "HUMAN", [["DIRECT_CLAIM", "LIFE_SCENE", "MYEONGLI_REASON", "MBTI_REASON", "FUSION", "CLOSER"], ["DIRECT_CLAIM", "MYEONGLI_REASON", "LIFE_SCENE", "CLOSER"]], ["DIRECT_CLAIM", "MYEONGLI_REASON"]),
  pattern("P02", "HUMAN", [["LIFE_SCENE", "DIRECT_CLAIM", "MYEONGLI_REASON", "CLOSER"], ["LIFE_SCENE", "DIRECT_CLAIM", "CLOSER"]], ["LIFE_SCENE", "DIRECT_CLAIM"]),
  pattern("P03", "HUMAN", [["DIRECT_CLAIM", "MYEONGLI_REASON", "CLOSER"], ["DIRECT_CLAIM", "CLOSER"]], ["DIRECT_CLAIM"], { maxSentences: 3, depth: ["SHORT", "NORMAL"] }),
  pattern("P04", "REINFORCE", [["DIRECT_CLAIM", "MYEONGLI_REASON", "MBTI_REASON", "FUSION"]], ["DIRECT_CLAIM", "MYEONGLI_REASON", "MBTI_REASON", "FUSION"], { family: "R-A", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"] }),
  pattern("P05", "REINFORCE", [["HOOK", "MYEONGLI_REASON", "MBTI_REASON", "CLOSER"]], ["HOOK", "MYEONGLI_REASON", "MBTI_REASON", "CLOSER"], { family: "R-B", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"] }),
  pattern("P06", "TENSION", [["DIRECT_CLAIM", "MYEONGLI_REASON", "MBTI_REASON", "CONTRAST", "CLOSER"], ["LIFE_SCENE", "DIRECT_CLAIM", "CONTRAST", "MYEONGLI_REASON", "MBTI_REASON", "CLOSER"]], ["DIRECT_CLAIM", "CONTRAST", "CLOSER"], { minSentences: 4, maxSentences: 6, depth: ["NORMAL", "DEEP"], compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["TENSION"] }),
  pattern("P07", "TENSION", [["DIRECT_CLAIM", "CONTRAST", "CLOSER"], ["DIRECT_CLAIM", "MYEONGLI_REASON", "CONTRAST", "CLOSER"]], ["DIRECT_CLAIM", "CONTRAST", "CLOSER"], { maxSentences: 4, compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["TENSION"] }),
  pattern("P08", "COMPLEMENT", [["DIRECT_CLAIM", "MYEONGLI_REASON", "MBTI_REASON", "FUSION", "LIFE_SCENE"], ["DIRECT_CLAIM", "FUSION", "CLOSER"]], ["DIRECT_CLAIM", "FUSION"], { compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["COMPLEMENT"] }),
  pattern("P09", "FORTUNE", [["GOOD_RESULT", "IMAGE", "MYEONGLI_REASON", "MBTI_REASON", "FUSION", "CLOSER"], ["GOOD_RESULT", "MYEONGLI_REASON", "FUSION", "CLOSER"]], ["GOOD_RESULT"], { compatibleSourceTypes: ["CLAIM"], toneIntent: "DIRECT" }),
  pattern("P10", "FACT_BOMB", [["DIRECT_CLAIM", "SHADOW", "MYEONGLI_REASON", "CLOSER"], ["DIRECT_CLAIM", "MYEONGLI_REASON", "SHADOW"]], ["DIRECT_CLAIM"], { compatibleSourceTypes: ["CLAIM", "TRAIT_ARC"], maxSentences: 4, toneIntent: "DIRECT" }),
  pattern("P11", "TRAIT_ARC", [["DIRECT_CLAIM", "GOOD_RESULT", "SHADOW", "ACTION"], ["DIRECT_CLAIM", "GOOD_RESULT", "SHADOW", "CLOSER"]], ["DIRECT_CLAIM", "GOOD_RESULT"], { compatibleSourceTypes: ["TRAIT_ARC"] }),
  pattern("P12", "GUIDANCE", [["DIRECT_CLAIM", "MYEONGLI_REASON", "ACTION"], ["ACTION", "MYEONGLI_REASON", "CLOSER"]], ["ACTION"], { compatibleSourceTypes: ["GUIDANCE"], minSentences: 1, maxSentences: 3, toneIntent: "PRACTICAL" }),
  pattern("P13", "REINFORCE", [["LIFE_SCENE", "DIRECT_CLAIM", "MYEONGLI_REASON", "MBTI_REASON", "FUSION"]], ["LIFE_SCENE", "DIRECT_CLAIM", "MYEONGLI_REASON", "MBTI_REASON", "FUSION"], { family: "R-C", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"] }),
  pattern("P14", "REINFORCE", [["IMAGE", "MYEONGLI_REASON", "MBTI_REASON", "CLOSER"]], ["IMAGE", "MYEONGLI_REASON", "MBTI_REASON", "CLOSER"], { family: "R-D", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"] }),
  pattern("P15", "REINFORCE", [["DIRECT_CLAIM", "FUSION", "MYEONGLI_REASON", "MBTI_REASON"]], ["DIRECT_CLAIM", "FUSION", "MYEONGLI_REASON", "MBTI_REASON"], { family: "R-E", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"] }),
  pattern("P16", "REINFORCE", [["MYEONGLI_REASON", "MBTI_REASON", "FUSION", "CLOSER"]], ["MYEONGLI_REASON", "MBTI_REASON", "FUSION", "CLOSER"], { family: "R-F", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"] }),
  // Explicit opt-in manuscript continuations; not added to 5A/default selection.
  pattern("P17", "GUIDANCE", [["MYEONGLI_REASON", "ACTION"], ["DIRECT_CLAIM", "ACTION"]], ["ACTION"], { family: "GUIDANCE_REASON_FIRST", compatibleSourceTypes: ["GUIDANCE"], minSentences: 1, maxSentences: 4, toneIntent: "PRACTICAL" }),
  pattern("P18", "FORTUNE", [["GOOD_RESULT", "MYEONGLI_REASON", "IMAGE", "CLOSER"]], ["GOOD_RESULT", "MYEONGLI_REASON"], { family: "FORTUNE_PROOF_FIRST", compatibleSourceTypes: ["CLAIM"], maxSentences: 6 }),
  pattern("P19", "HUMAN", [["DIRECT_CLAIM", "CLOSER", "LIFE_SCENE"], ["DIRECT_CLAIM", "LIFE_SCENE", "CLOSER"]], ["DIRECT_CLAIM"], { family: "HUMAN_APPLICATION", maxSentences: 6 }),
  pattern("P20", "FACT_BOMB", [["DIRECT_CLAIM", "MYEONGLI_REASON"], ["DIRECT_CLAIM", "LIFE_SCENE"]], ["DIRECT_CLAIM"], { family: "FACT_COMPACT", compatibleSourceTypes: ["CLAIM", "TRAIT_ARC"], minSentences: 1, maxSentences: 4 }),
  pattern("P21", "HUMAN", [["CLOSER"]], ["CLOSER"], { family: "SECTION_BRIDGE", compatibleSourceTypes: ["SECTION_BRIDGE"], minSentences: 1, maxSentences: 1 }),
  pattern("P22", "COMPLEMENT", [["FUSION", "MYEONGLI_REASON", "MBTI_REASON", "LIFE_SCENE"], ["FUSION", "MBTI_REASON", "MYEONGLI_REASON"]], ["FUSION", "MYEONGLI_REASON", "MBTI_REASON"], { family: "COMPLEMENT_THIRD_FIRST", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["COMPLEMENT"], maxSentences: 6 }),
  pattern("P23", "REINFORCE", [["MYEONGLI_REASON", "MBTI_REASON", "FUSION"], ["MYEONGLI_REASON", "LIFE_SCENE", "MBTI_REASON", "FUSION"]], ["MYEONGLI_REASON", "MBTI_REASON", "FUSION"], { family: "R-F", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["REINFORCE"], maxSentences: 6 }),
  pattern("P24", "HUMAN", [["DIRECT_CLAIM", "LIFE_SCENE", "CLOSER", "MYEONGLI_REASON"]], ["DIRECT_CLAIM"], { family: "HUMAN_REASON_LAST", maxSentences: 6 }),
  pattern("P25", "COMPLEMENT", [["MYEONGLI_REASON", "MBTI_REASON", "FUSION", "LIFE_SCENE"], ["MBTI_REASON", "MYEONGLI_REASON", "FUSION"]], ["FUSION", "MYEONGLI_REASON", "MBTI_REASON"], { family: "COMPLEMENT_REASON_FIRST", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["COMPLEMENT"], maxSentences: 6 }),
  pattern("P26", "TENSION", [["MYEONGLI_REASON", "MBTI_REASON", "CONTRAST", "CLOSER"], ["MBTI_REASON", "MYEONGLI_REASON", "CONTRAST", "CLOSER", "LIFE_SCENE"]], ["MYEONGLI_REASON", "MBTI_REASON", "CONTRAST", "CLOSER"], { family: "TENSION_ACTUAL_SIDES", compatibleSourceTypes: ["FUSION"], compatibleFusionTypes: ["TENSION"], maxSentences: 7 }),
];
export function compatiblePatterns(request: NarrativeRequest, available: readonly SentenceRole[]) {
  return NARRATIVE_PATTERNS.filter(p => (Number(p.id.slice(1)) < 17 || request.patternId === p.id) && p.intent === request.intent && p.compatibleSourceTypes.includes(request.source.sourceType)
    && (!p.compatibleFusionTypes || (request.source.fusionType && p.compatibleFusionTypes.includes(request.source.fusionType)))
    && p.requiredRoles.every(r => available.includes(r)) && (!request.patternId || p.id === request.patternId));
}
export function orderedPatterns(request: NarrativeRequest, available: readonly SentenceRole[]) {
  const all = compatiblePatterns(request, available);
  return stableVariants(all.filter(p => p.depth.includes(request.depthIntent)), narrativeSeed(request, "PATTERN"))
    .concat(all.filter(p => !p.depth.includes(request.depthIntent)));
}
