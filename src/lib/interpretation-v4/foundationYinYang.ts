import { FOUNDATION_VERSION, type EvidenceAtom, type FoundationResult, type SemanticSignature } from "./semanticCore";

export const YIN_YANG_STATES = ["EXTREME_YANG", "STRONG_YANG", "MILD_YANG", "BALANCED", "MILD_YIN", "STRONG_YIN", "EXTREME_YIN"] as const;
export type YinYangState = typeof YIN_YANG_STATES[number];
export type Polarity = "YIN" | "YANG";
export const YIN_YANG_MULTIPLIERS = {
  MILD_YANG: 0.5, STRONG_YANG: 1, EXTREME_YANG: 1.5,
  BALANCED: 0, MILD_YIN: 0.5, STRONG_YIN: 1, EXTREME_YIN: 1.5,
} as const satisfies Record<YinYangState, number>;
export const YIN_YANG_SIGNATURES = {
  YANG: { ACTION_TEMPO: 2, ENERGY_DIRECTION: 2, DECISION_STYLE: 1, COMMUNICATION_STYLE: 1,
    CHANGE_ORIENTATION: 1, INITIATIVE: 2, EXPANSION: 1, EXPRESSION: 1 },
  YIN: { ACTION_TEMPO: -2, ENERGY_DIRECTION: -2, DECISION_STYLE: -1, COMMUNICATION_STYLE: -1,
    CHANGE_ORIENTATION: -1, DEPTH: 2, PERSISTENCE: 1, STABILITY: 1, RECOVERY_NEED: 1 },
} as const satisfies Record<Polarity, SemanticSignature>;

export const YIN_YANG_COPY = {
  YANG: {
    easyMeaning: "생각을 안에만 두기보다 행동이나 표현으로 꺼내는 쪽입니다.",
    positiveMeaning: "시작하고 움직이는 속도가 빠른 편입니다.",
    shadowMeaning: "너무 빨리 앞으로 가면 검토하거나 쉬어야 할 때를 놓칠 수 있습니다.",
  },
  YIN: {
    easyMeaning: "바로 꺼내기보다 안에서 충분히 보고 정리한 뒤 움직이는 쪽입니다.",
    positiveMeaning: "신중하게 보고 오래 붙드는 데 강점이 있습니다.",
    shadowMeaning: "생각과 준비가 길어지면 시작이 늦어질 수 있습니다.",
  },
} as const;
export const YIN_YANG_DESCRIPTIONS = {
  MILD_YANG: "생각을 정리한 뒤 행동이나 표현으로 꺼내는 쪽에 조금 더 무게가 있습니다.",
  STRONG_YANG: "결론이 나면 오래 머뭇거리기보다 밖으로 움직이는 편입니다.",
  EXTREME_YANG: "안에서 생각하고 끝내기보다 행동이나 표현으로 바로 꺼내는 성향이 아주 강합니다.",
  BALANCED: "음과 양이 4:4라 이 부분만으로는 한쪽 성향이 강하게 두드러지지 않습니다.",
  MILD_YIN: "바로 꺼내기보다 안에서 생각을 정리하는 쪽에 조금 더 무게가 있습니다.",
  STRONG_YIN: "바로 결론을 내리기보다 안에서 충분히 생각하고 정리한 뒤 움직이는 편입니다.",
  EXTREME_YIN: "밖으로 바로 꺼내기보다 혼자 충분히 생각하고 정리한 뒤 움직이려는 성향이 아주 강합니다.",
} as const satisfies Record<YinYangState, string>;

export function classifyFoundationYinYang(yinCount: number, yangCount: number): FoundationResult<YinYangState> {
  if (!Number.isInteger(yinCount) || !Number.isInteger(yangCount) || yinCount < 0 || yangCount < 0 || yinCount + yangCount !== 8) {
    return { ok: false, error: "INVALID_YIN_YANG_COUNTS" };
  }
  if (yinCount === 4) return { ok: true, value: "BALANCED" };
  if (yangCount > yinCount) return { ok: true, value: yangCount === 5 ? "MILD_YANG" : yangCount === 6 ? "STRONG_YANG" : "EXTREME_YANG" };
  return { ok: true, value: yinCount === 5 ? "MILD_YIN" : yinCount === 6 ? "STRONG_YIN" : "EXTREME_YIN" };
}

/** Missing hours are not scaled to eight characters. No E/I inference. */
export function buildYinYangEvidence(yinCount: number, yangCount: number): FoundationResult<{ state: YinYangState; evidence: EvidenceAtom }> {
  const result = classifyFoundationYinYang(yinCount, yangCount);
  if (!result.ok) return result;
  const state = result.value, weight = YIN_YANG_MULTIPLIERS[state];
  const polarity = state === "BALANCED" ? null : state.endsWith("YANG") ? "YANG" : "YIN";
  return { ok: true, value: { state, evidence: {
    id: `foundation:yin_yang:${state}`, sourceType: "yin_yang", sourceKey: state,
    kind: "TRAIT", tier: "SUPPORT", strength: weight >= 1 ? "STRONG" : weight > 0 ? "MEDIUM" : "WEAK",
    weight, axes: polarity ? { ...YIN_YANG_SIGNATURES[polarity] } : {},
    contexts: ["identity", "work", "stress", "recovery"], family: "visible_yin_yang",
    ...(polarity ? YIN_YANG_COPY[polarity] : { easyMeaning: YIN_YANG_DESCRIPTIONS.BALANCED }),
    humanDescription: YIN_YANG_DESCRIPTIONS[state],
    metadata: { registryVersion: FOUNDATION_VERSION, yinCount, yangCount, state,
      mainClaimEligible: state !== "BALANCED", provenance: "SajuCalcResult:yinYang:visible-unweighted" },
  } } };
}
