import type { FusionSplitType } from "./fusionCore";
import type { NarrativeMemory } from "./narrativeCore";
import { stableVariants } from "./narrativeVariant";

export const CONNECTOR_INTENTS = ["REASON", "ADD", "TURN", "SUMMARY", "BRIDGE"] as const;
export type NarrativeConnector = { id: string; intent: typeof CONNECTOR_INTENTS[number]; text: string; maxUses: number; prefix?: string };
const rows: [NarrativeConnector["intent"], string[]][] = [
  ["REASON", ["이유는 생각보다 단순합니다.", "여기에는 {meaning}도 같이 들어 있습니다.", "명리에서는 이 부분을 {meaning}로 봅니다.", "이런 모습이 나오는 데는 {meaning}도 한몫합니다.", "이 특징을 받쳐주는 근거가 하나 더 있습니다."]],
  ["ADD", ["여기서 하나가 더 붙습니다.", "그런데 이게 전부는 아닙니다.", "또 하나 눈에 띄는 건 {meaning}입니다.", "여기에 다른 특징 하나가 더해집니다."]],
  ["TURN", ["재미있는 건 여기부터입니다.", "그런데 반대쪽 특징도 있습니다.", "겉으로는 그런데 안에서는 조금 다릅니다.", "여기서 모습이 한번 달라집니다."]],
  ["SUMMARY", ["쉽게 말하면 {meaning}입니다.", "결국 {meaning}인 셈이에요.", "한마디로 {meaning}에 가깝습니다.", "그래서 실제 모습은 {meaning}에 더 가깝습니다.", "정리하면 {meaning}입니다."]],
];
/** Frames require a future adapter's grammatical slot; never blindly inserted before a sentence. */
export const NARRATIVE_CONNECTORS: readonly NarrativeConnector[] = [
  ...rows.flatMap(([intent, texts]) => texts.map((text, i) => ({ id: `${intent}_${i + 1}`, intent, text, maxUses: 2 }))),
  { id: "SUMMARY_PREFIX", intent: "SUMMARY", text: "쉽게 말하면", prefix: "쉽게 말하면, ", maxUses: 2 },
  { id: "SUMMARY_PLAIN", intent: "SUMMARY", text: "정리하면", prefix: "정리하면, ", maxUses: 1 },
  { id: "TURN_PREFIX", intent: "TURN", text: "다만", prefix: "다만, ", maxUses: 2 },
  { id: "ADD_PREFIX", intent: "ADD", text: "여기에", prefix: "여기에 ", maxUses: 1 },
];
export const SECTION_BRIDGE_REGISTRY = {
  IDENTITY_TO_REINFORCE: "이 특징은 다른 해석에서도 한번 더 확인됩니다.",
  REINFORCE_TO_TENSION: "그런데 모든 부분이 똑같이 맞아떨어지는 건 아닙니다.",
  TENSION_TO_STRENGTH: "이 차이는 오히려 잘 쓰면 장점이 됩니다.",
  STRENGTH_TO_FORTUNE: "이런 장점이 성격으로만 끝나는 건 아닙니다.",
  FORTUNE_TO_SHADOW: "좋은 점이 큰 만큼 세게 쓰면 피곤해지는 부분도 분명합니다.",
  SHADOW_TO_RELATION: "이런 모습은 혼자 있을 때보다 사람과 가까워질수록 더 잘 보이기도 합니다.",
  RELATION_TO_WORK: "사람 사이에서 보인 이 특징은 일할 때도 다른 모습으로 이어집니다.",
  WORK_TO_RECOVERY: "잘하는 방식이 분명한 만큼 어디에서 지치는지도 같이 봐야 합니다.",
  RECOVERY_TO_MANUAL: "이제 중요한 건 이런 자신을 어떻게 오래 잘 쓰느냐입니다.",
} as const;
export const CONDITION_SPLIT_SURFACES = {
  BEFORE_AFTER_DECISION: ["결정하기 전에는", "한번 답을 정한 뒤에는"], OUTER_INNER: ["사람들과 있거나 밖에서 움직일 때는", "혼자 있을 때는"],
  WORK_PRIVATE: ["일할 때는", "일에서 벗어나면"], STRANGER_CLOSE: ["처음 만난 사람에게는", "가까운 사람에게는"],
  NORMAL_STRESS: ["평소에는", "일이 급하거나 압박이 커지면"], IDEA_EXECUTION: ["아이디어를 생각할 때는", "실제로 움직일 때는"],
  START_MAINTAIN: ["새로 시작할 때는", "오래 유지해야 할 때는"], SHORT_LONG_TERM: ["당장의 선택에서는", "오래 보고 결정할 때는"],
  HEAD_HEART: ["머리로 판단할 때는", "마음이 실제로 움직이는지는"], DESIRE_BEHAVIOR: ["마음으로는", "실제로 움직일 때는"],
} as const satisfies Record<FusionSplitType, readonly [string, string]>;
export const REINFORCE_CLOSERS = [
  { id: "RF01", text: "여기서는 두 해석이 꽤 같은 쪽을 보고 있습니다." },
  { id: "RF02", text: "명리에서도 MBTI에서도 이 특징이 반복해서 나옵니다." },
  { id: "RF03", text: "서로 다른 방식으로 봤는데 결론은 꽤 비슷합니다." },
  { id: "RF04", text: "이 부분은 두 체계가 거의 같은 말을 합니다." },
  { id: "RF05", text: "한쪽만의 해석이 아니라 두 곳에서 같은 특징이 확인됩니다." },
] as const;
/** RF06 is the upstream human description itself; it has no static copy. */
export const THIRD_INTERPRETATION_FRAMES = [
  { id: "TI01", text: "그래서 {before}하기 전과 {after}한 뒤의 모습이 꽤 다를 수 있습니다." },
  { id: "TI02", text: "한쪽이 틀린 게 아니라 상황이 바뀌면 쓰는 방식이 달라지는 겁니다." },
  { id: "TI03", text: "결국 {sideA}하면서도 {condition}할 때는 {sideB}하는 사람에 가깝습니다." },
  { id: "TI04", text: "주변에서 보는 모습과 본인이 느끼는 모습이 다를 수 있는 이유도 여기 있습니다.", requiresSelfPerception: true },
] as const;
export function selectConnector(intent: NarrativeConnector["intent"], memory: NarrativeMemory, seed: string): NarrativeConnector | undefined {
  return stableVariants(NARRATIVE_CONNECTORS.filter(c => c.intent === intent && c.prefix), seed)
    .find(c => (memory.usedConnectors[c.id] ?? 0) < c.maxUses && !memory.recentConnectors.includes(c.id)
      && (c.id !== "SUMMARY_PREFIX" || (memory.usedPhrases["쉽게 말하면"] ?? 0) < 2));
}
