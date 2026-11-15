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

/**
 * W6 개선 지표(기록만 — 관문에 쓰지 않는다). 발행 메타 report.metrics.gate에 남겨 운영 관찰에서도 읽는다.
 *  - tails: 같은 꼬리 틀(문장 끝 「~사람이에요」「~편이에요」 …, 처방 머리 「이번 주에는」「한마디만」 …) 책당 횟수(B4).
 *  - verdict: 판정 풀어쓰기 꼴(「세지도 여리지도」「가운데예요」「여린 편」 …, B2).
 *  - thin: 3문장 미만 문단 수(B5). scenes: 입력 근거 없는 구체 장면 깃발 수(scene_unbacked·seed_assert, B1).
 */
const TAILS: readonly (readonly [string, RegExp])[] = [
  ["~사람이에요", /사람(?:이에요|입니다)[.!]?$/], ["~편이에요", /편(?:이에요|입니다)[.!]?$/], ["~쪽이에요", /쪽(?:이에요|입니다)[.!]?$/], ["~거예요", /거(?:예요|에요)[.!]?$/],
  ["~힘이에요", /힘(?:이에요|입니다)[.!]?$/], ["~이유예요", /이유(?:예요|입니다)[.!]?$/], ["~방식이에요", /방식(?:이에요|입니다)[.!]?$/],
  ["이번 주에는", /^이번 주(?:에는|엔|에)/], ["한마디만", /한마디(?:만|면)/], ["한 줄만", /한 줄(?:만|이면)/], ["~해 보세요", /해 보세요[.!]?$/],
];
const VERDICT = /세지도 (?:여리지도|약하지도)|센 쪽도 여린 쪽도|가운데(?:예요|이에요|입니다|라서|라,| 쪽)|여린 쪽 힘|힘이 (?:아주 |많이 )?여린 편|힘이 (?:아주 )?센 편|힘의 세기(?:는|가)|있는 만큼 쓰는 쪽|보통 세기/g;
export type GateMetrics = { readonly block: Readonly<Record<GateKind, number>>; readonly blockRules: Readonly<Record<string, number>>; readonly tails: Readonly<Record<string, number>>; readonly verdict: number; readonly thin: number; readonly paragraphs: number; readonly scenes: number };
export function gateMetrics(chapters: readonly { readonly sections: readonly { readonly paragraphs: readonly string[] }[] }[], flags: readonly { readonly rule: string; readonly detail?: string; readonly paragraph: number; readonly card?: string }[], split: (p: string) => string[]): GateMetrics {
  const block: Record<GateKind, number> = { fact: 0, link: 0, contradiction: 0, broken: 0 }, blockRules: Record<string, number> = {};
  let scenes = 0;
  for (const f of flags) { if (f.card) continue; const k = gateKindOf(f.rule, f.detail); if (k) { block[k]++; blockRules[f.rule] = (blockRules[f.rule] ?? 0) + 1; } if (f.rule === "scene_unbacked" || f.rule === "seed_assert") scenes++; }
  const tails: Record<string, number> = {}; let verdict = 0, thin = 0, paragraphs = 0;
  for (const c of chapters) for (const s of c.sections) for (const p of s.paragraphs) {
    const ss = split(p); paragraphs++; if (ss.length < 3) thin++;
    verdict += (p.match(VERDICT) ?? []).length;
    for (const x of ss) { const t = x.replace(/[⟪⟫"'”’)\]]+$/g, "").trim(); for (const [name, re] of TAILS) if (re.test(t)) tails[name] = (tails[name] ?? 0) + 1; }
  }
  return { block, blockRules, tails, verdict, thin, paragraphs, scenes };
}
