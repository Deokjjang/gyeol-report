/**
 * W6 S0-1 출시 기준(2026-11-15 덕짱님 결정 1): 검사 규칙을 「차단」(실질 결함 — 0이어야 출시)과 「개선」(계속 고치되 출시를 막지 않음)으로 나눈다.
 *  - 차단 = 계산·사실 오류(fact) · 잘못된 연결(link) · 같은 책 안의 모순(contradiction) · 깨진 문장(broken).
 *    CLAUDE.md 원고 규칙의 사실 금지(시간 미상 시주·MBTI 없음 날조·확정 예언·입력과 다른 관계·직업·생활 단계)는 「계산·입력에 없는 사실 단정」이라 fact로 둔다.
 *    내부 표시·id·편집 용어가 그대로 남은 문장은 고객 문장으로 성립하지 않아 broken으로 둔다.
 *  - 개선 = 문장 반복 · 꼬리 틀 · 판정 풀어쓰기(등급 말·규칙 노출 포함) · 같은 논지 반복 · 밀도 · 입력에 없는 구체적 경험 단정.
 * 출시 관문 수치는 차단만 센다. 개선 규칙의 문장 떼기는 떼고 난 문단이 3문장 이상일 때만 하고, 아니면 기록만(본문을 얇게 만들지 않는다).
 * 규칙의 수리 방식(다시 쓰기·떼기·기록만, repairPlan.modeOf)은 이 분류와 따로다.
 */
export type GateKind = "fact" | "link" | "contradiction" | "broken";
export type GateClass = "block" | "improve";

const BLOCK: Readonly<Record<string, GateKind>> = {
  // 계산·사실(정답지·엔진 값과 다름, 입력과 다름)
  fact_term: "fact", fact_relation: "fact", fact_strength: "fact", fact_ganji: "fact", fact_meaning: "fact", fact_mix: "fact", fact_dayun: "fact", fact_count: "fact", fact_season: "fact", fact_direction: "fact",
  common_split: "fact", yinyang_claim: "fact", element_claim: "fact", element_count: "fact", dayun_claim: "fact", dayun_year: "fact", star_claim: "fact", ten_god_direction: "fact",
  pillar_claim: "fact", group_claim: "fact", glyph_list: "fact", intensity_claim: "fact", pair_both: "fact", negative_claim: "fact", presumed_partner: "fact", school_scene: "fact",
  marriage_talk: "fact", input_outside: "fact", invest_directive: "fact",
  // 잘못된 연결(남의 주인·근거 없는 명리×MBTI·기능 순서·남의 성격)
  feature_owner: "link", scene_owner: "link", mbti_misattr: "link", fn_role: "link", persona_mismatch: "link", pair_profile: "link", link_relation: "link",
  // 같은 책 안의 모순
  self_contradiction: "contradiction",
  // 깨진 문장
  broken_sentence: "broken", fragment: "broken", empty_preview: "broken", orphan_start: "broken", self_correction: "broken", chapter_ref: "broken", count_mismatch: "broken",
  render_dup: "broken", fact_mark: "broken", fn_join: "broken",
};
/** 안전망 문장 규칙(safety의 detail) 가운데 차단. 그 밖(옛 부정 낱말·출처·자기 깎기·경험 단정·가족 지어내기 등)은 개선. */
const SAFETY_BLOCK: Readonly<Record<string, GateKind>> = {
  hour_pillar: "fact", mbti_absent: "fact", fact_partner: "fact", fact_spouse: "fact", fact_children: "fact", fact_job: "fact", date_event: "fact", love_timing: "fact",
  health_claim: "fact", band_mismatch: "fact", score_mismatch: "fact", intensity_mismatch: "fact", stage_glyph: "fact",
  internal_term: "broken", internal_label: "broken", orphan_ref: "broken",
};
/** 검수(LLM) 범주: C(모순)만 차단 쪽 지적이고, 나머지는 기록·개선. 검수 F는 오탐이 많아 관문에 쓰지 않는다(정답지 대조가 맡음). */
const REVIEW_BLOCK: Readonly<Record<string, GateKind>> = { C: "contradiction" };

export function gateKindOf(rule: string, detail?: string): GateKind | null {
  if (rule === "safety") return detail ? SAFETY_BLOCK[detail] ?? null : null;
  if (rule.startsWith("review_")) return REVIEW_BLOCK[rule.slice(7)] ?? null;
  return BLOCK[rule] ?? null;
}
export const gateClassOf = (rule: string, detail?: string): GateClass => (gateKindOf(rule, detail) ? "block" : "improve");
/** 개선 규칙 문장 떼기의 하한: 떼고 난 문단이 이만큼 남을 때만 뗀다. */
export const IMPROVE_DROP_MIN_LEFT = 3;
