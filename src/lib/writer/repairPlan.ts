/**
 * W5 R2 수리 재설계(R0 표 — W4 8권 수리 전 초안 ↔ 발행 본문 대조, docs/v5/w5.md 2-1). 결정론(호출 0) 부분.
 * - 규칙마다 처리 방식: rewrite(작가 모델 수리 1회, 한 문장 → 한 문장) · drop(그 문장만 뗀다, 앞뒤 이음 확인) · none(기록만).
 *   다시 쓰기는 R0에서 득으로 나온 규칙만(사실 HARD·grade_leak·guide_copy·근거 없는 장면·용어 풀이·검수 I). 노출(safety·rule_leak)은 다시 써도 13/17 되돌림 → drop.
 *   물음 초과·재탕·씨앗 단정·검수 R/L/C → drop. 문구 복사(db·persona·seed)·검수 F·접속어 과다 → none(접속어는 결정론으로 앞 접속어만 뗀다).
 * - 수리 칸 우선순위: 사실 HARD → 노출 → 근거 없는 장면(입력 밖 상황 포함) → 그 밖.
 * - 수리 뒤 정리(F1): 이웃 문장 내용 낱말 70% 이상 같으면 뒤 문장을 뗀다 · 수리 문장이 이웃과 같은 뜻·끊긴 문장·같은 문단 다른 수리와 같은 구절이면 원문으로 되돌린다.
 */
import type { FinalChapter } from "./safety";
import { splitSentences } from "./safety/patterns";
import { ANAPHOR_SHORT, dependsOnRemoved, listItemIn, removeSentenceAt, stripConnective, SUBJECT_TERM } from "./safety/orphan";
import { HARD_RULES, type LintFlag, type P6cRule } from "./safety/p6c";
import type { AppliedRepair } from "./repair3";
import { gateClassOf, IMPROVE_DROP_MIN_LEFT } from "./gate";

export type RepairMode = "rewrite" | "drop" | "none";
/** HARD 가운데 문장 떼기(다시 써도 같은 내부 말이 남거나 없는 사실을 새로 만든 규칙). */
const DROP_HARD: ReadonlySet<string> = new Set(["safety", "rule_leak", "negative_claim", "fact_mark", "label_leak", "broken_sentence"]);
/** SOFT 가운데 문장 떼기(재탕·물음 초과·씨앗 단정). */
const DROP_SOFT: ReadonlySet<string> = new Set(["question_excess", "phrase_repeat", "notice_repeat", "scene_repeat", "prop_repeat", "advice_repeat", "seed_assert", "meaning_repeat", "closing_repeat"]);
/** SOFT 가운데 다시 쓰기(R0 득: 근거 없는 장면 28/30 · 용어 풀이 22/26, 그 밖 표본 작지만 고침 1/1인 별명·다섯 힘 이름·피할 그림·같은 일주 구절·이전 책 겹침·필수 근거 덧붙임·비문 꼴). */
const REWRITE_SOFT: ReadonlySet<string> = new Set(["scene_unbacked", "term_unexplained", "nickname", "group_name", "avoid_image", "ilju_phrase", "prior_overlap", "evidence_missing", "fn_join", "awkward", "job_prop", "farming", "second_image"]);
export function modeOf(rule: string): RepairMode {
  if (DROP_HARD.has(rule) || DROP_SOFT.has(rule)) return "drop";
  if (HARD_RULES.has(rule as P6cRule)) return "rewrite";
  return REWRITE_SOFT.has(rule) ? "rewrite" : "none";
}
/** 노출 HARD(다시 쓰기 쪽). */
const EXPOSURE: ReadonlySet<string> = new Set(["grade_leak", "guide_copy", "example_words", "render_dup", "time_fixed", "time_deictic", "calendar_month", "ilju_phrase", "avoid_image"]);
const SCENE: ReadonlySet<string> = new Set(["scene_unbacked", "input_outside", "school_scene", "presumed_partner", "past_assertion", "job_prop", "persona_mismatch"]);
/** 수리 칸 순서(작을수록 먼저): 0 사실 HARD · 1 노출 · 2 근거 없는 장면·입력 밖 · 3 그 밖. */
export function priorityOf(rule: string): number {
  if (SCENE.has(rule)) return 2;
  if (EXPOSURE.has(rule)) return 1;
  if (HARD_RULES.has(rule as P6cRule)) return 0;
  return 3;
}
/** 검수 범주(review.ts CAT): F 사실(오탐 많음 — 기록만) · I 입력 밖(다시 쓰기, 장면 칸) · R 반복 · L 노출 · C 모순(떼기) · T 시점(다시 쓰기) · A 비문(직접 고침, 수리 밖). */
export const reviewModeOf = (cat: string): RepairMode => (cat === "I" || cat === "T" ? "rewrite" : cat === "R" || cat === "L" || cat === "C" ? "drop" : "none");
export const reviewPriorityOf = (cat: string): number => (cat === "I" ? 2 : 3);

const norm = (s: string) => s.replace(/[⟪⟫]/g, "");
/** W6 S4 4판(2차 종합 4장): 앞 문장을 받는 짧은 「INFJ가 겹치면 더 그래요.」 — 앞 문장을 떼면 기댈 곳이 없다. W6.1: 기대는 문장 판정은 orphan.dependsOnRemoved 하나로. */
export { ANAPHOR_SHORT };
/** W6 S4(2차 커리어 8장): 문장 앞머리(20자 안)에서 앞 문장 내용을 「이 순서·이 방법」으로 받는 문장 — 개선 규칙으로 앞 문장을 떼면 가리킬 것이 없어진다(「셋째는 …」 원칙 내용이 빠지고 「이 순서가 방패가 됩니다」만 남음). */
const POINTS_BACK = /^[^.?!]{0,20}(?:이|그|이런|그런) (?:순서|방법|습관|규칙|원칙|장치|기준|패턴|방식|약속)/;
/**
 * W6 S4 2판: 개선 규칙으로 문단 첫 문장을 떼지 않는 것은 그 문장이 다음 문장의 주어(근거 이름)를 꺼낼 때만이다(「망신살이 있어요. 속마음이 … 드러나는 힘이라」).
 * 틀 문장(「이번 장의 행동은 이거예요」)·안내 문장은 지킬 주어가 없다 — 1판처럼 모두 지키면 1차 궁합에 「이번 장의 행동은 이거예요」가 6번 남았다.
 */
export const leadNamesSubject = (lead: string, next: string | undefined): boolean => next !== undefined && SUBJECT_TERM.test(lead) && !SUBJECT_TERM.test(next);
const ASKS = /([?？]|죠|지요|까요|ㄹ까|을까)[.!]?$/;
export type DropRecord = { readonly at: string; readonly sentence: string; readonly rule: string; readonly kept?: "leans" | "only_sentence" | "key" | "thin" | "lead" | "list" | "mid" };
export type DropTarget = { readonly chapter: number; readonly section: number; readonly paragraph: number; readonly sentence: string; readonly rule: string; readonly hard: boolean; readonly detail?: string };
/** W6 S0-1: 개선 규칙은 떼고 난 문단이 IMPROVE_DROP_MIN_LEFT(3)문장 이상일 때만 뗀다(차단 규칙은 그대로). */
export const improveOnly = (rule: string, detail?: string) => gateClassOf(rule, detail) === "improve";
/** W7 m1: 내용 반복 규칙(뒤 문장이 기대는 내용 문장을 뗀다) — 문단 끝 문장만 뗀다. */
export const REPEAT_DROP = /^(?:phrase|scene|prop|advice)_repeat$|^review_R$/;
/**
 * 그 문장만 뗀다(호출 0). 앞뒤 이음 확인: ① 다음 문장이 앞말에 기대면(지시어·「때문입니다」) SOFT는 남기고, HARD는 기대는 문장까지 함께 뗀다
 * ② 뗀 문장이 바로 앞 물음의 답이면 물음도 뗀다 ③ 다음 문장 머리 접속어는 뗀다 ④ 소제목에 문장이 하나만 남으면 SOFT는 떼지 않는다 ⑤ ⟪핵심 문장⟫은 SOFT면 떼지 않는다.
 */
export function dropSentences(chapters: readonly FinalChapter[], targets: readonly DropTarget[], o: { readonly names?: readonly (readonly string[])[] } = {}): { chapters: FinalChapter[]; dropped: DropRecord[] } {
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const dropped: DropRecord[] = [];
  for (const t of targets) {
    const ch = out.find(c => c.n === t.chapter); if (!ch || ch.source === "deterministic") continue;
    const sec = ch.sections[t.section]; const p = sec?.paragraphs[t.paragraph]; if (!sec || p === undefined || !t.sentence) continue;
    const ss = splitSentences(p), i = ss.findIndex(x => norm(x) === t.sentence || norm(x).includes(t.sentence) || t.sentence.includes(norm(x)));
    const at = `${t.chapter}.${t.section}.${t.paragraph}`;
    if (i < 0) continue;
    const inSection = sec.paragraphs.reduce((n, q) => n + splitSentences(q).length, 0);
    if (!t.hard && /⟪/.test(ss[i])) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "key" }); continue; }
    if (!t.hard && inSection <= 2) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "only_sentence" }); continue; }
    // W6.1: 목록 항목(「셋, …」「첫 번째 …」)은 개선 규칙으로 떼지 않는다 — 번호가 빈다.
    if (improveOnly(t.rule, t.detail) && listItemIn(ss[i], ch.sections.flatMap(x => x.paragraphs).join("\n"))) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "list" }); continue; }
    // W6 S4(2차 연애·종합): 문단 첫 문장은 주어(신살·십성 이름)를 꺼내는 자리라, 개선 규칙으로 떼면 다음 문장이 주어 없이 남는다(「속마음이 … 드러나는 힘이라」). 개선 규칙은 문단 첫 문장을 떼지 않는다.
    if (improveOnly(t.rule, t.detail) && i === 0 && leadNamesSubject(norm(ss[0]), ss[1] !== undefined ? norm(ss[1]) : undefined)) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "lead" }); continue; }
    const next = ss[i + 1] !== undefined ? norm(ss[i + 1]) : undefined;
    // W6.1 P2: 기대는 다음 문장(지시어·「때문」·되받기·「~도 함께」·비교 꼬리·주어를 받는 문장)은 개선 떼기면 원문을 두고, 차단 떼기면 함께 뗀다.
    const dep = dependsOnRemoved(norm(ss[i]), next, o), leans = dep !== null;
    if (improveOnly(t.rule, t.detail) && next !== undefined && POINTS_BACK.test(next)) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "leans" }); continue; }
    if (improveOnly(t.rule, t.detail) && ss.length - 1 - (leans && t.hard ? 1 : 0) < IMPROVE_DROP_MIN_LEFT) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "thin" }); continue; }
    if (leans && !t.hard) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "leans" }); continue; }
    // W7 m1(1차 궁합 9장 「두 사람에게는 귀한 기운도 함께 있어요」 뒤 · 1차 커리어 8장 「한가한 평일 하루를 정해 두면」): 반복 규칙으로 문단 가운데 문장을 떼면 뒤 문장이 기대던 앞말(무엇을·누구의)이 빠진다 → 반복 규칙은 문단 끝 문장만 뗀다(노출·금지 규칙은 그대로).
    if (REPEAT_DROP.test(t.rule) && i < ss.length - 1) { dropped.push({ at, sentence: t.sentence, rule: t.rule, kept: "mid" }); continue; }
    let rest = removeSentenceAt(ss, i).sentences;
    if (leans) { let prevGone = t.sentence; for (let n = 0; n < 3 && i < rest.length; n++) { const d = n === 0 ? dep : dependsOnRemoved(prevGone, norm(rest[i]), o); if (!d) break; dropped.push({ at, sentence: norm(rest[i]), rule: `${t.rule}:${d}` }); prevGone = norm(rest[i]); rest = rest.filter((_, j) => j !== i); } }
    if (i > 0 && ASKS.test(norm(ss[i - 1]).trim()) && !/⟪/.test(ss[i - 1]) && !ASKS.test(t.sentence.trim()) && (rest.length > 1 || sec.paragraphs.filter(Boolean).length > 1)) { dropped.push({ at, sentence: norm(ss[i - 1]), rule: `${t.rule}:question` }); rest = rest.filter((_, j) => j !== i - 1); }
    (sec.paragraphs as string[])[t.paragraph] = rest.join(" ");
    dropped.push({ at, sentence: t.sentence, rule: t.rule });
  }
  return { chapters: out.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: s.paragraphs.filter(x => x.trim()) })) })), dropped };
}
/** 접속어 과다(connective_excess): 걸린 문장의 앞 접속어만 뗀다(호출 0). */
export function stripConnectiveFlags(chapters: readonly FinalChapter[], flags: readonly LintFlag[]): { chapters: FinalChapter[]; count: number } {
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  let count = 0;
  for (const f of flags) {
    if (f.rule !== "connective_excess" || f.paragraph < 0 || !f.sentence) continue;
    const sec = out.find(c => c.n === f.chapter)?.sections[f.section]; const p = sec?.paragraphs[f.paragraph]; if (!sec || p === undefined) continue;
    const ss = splitSentences(p), i = ss.findIndex(x => norm(x).includes(f.sentence) || f.sentence.includes(norm(x)));
    if (i <= 0) continue;
    const t = stripConnective(ss[i]); if (!t) continue;
    ss[i] = t; (sec.paragraphs as string[])[f.paragraph] = ss.join(" "); count++;
  }
  return { chapters: out, count };
}

/** 내용 낱말(조사 뗀 2글자 이상, 흔한 말 뺌). */
const PART = /(으로서|으로써|에게서|으로|에서|에게|까지|부터|처럼|보다|이라|이나|라도|마저|조차|은|는|이|가|을|를|와|과|도|만|의|에|로|께|요|죠)$/;
const STOP = new Set("그리고 그래서 하지만 다만 또 이 그 저 것 수 때 더 덜 잘 좀 편 편입니다 있습니다 있어요 합니다 해요 이에요 예요 입니다 됩니다 돼요 같은 하는 한 할 있는 없는 두 사람 당신 님".split(" "));
export function contentWords(s: string): Set<string> {
  const out = new Set<string>();
  for (const w of norm(s).match(/[가-힣A-Za-z0-9]+/g) ?? []) { const x = w.replace(PART, ""); if (x.length >= 2 && !STOP.has(x)) out.add(x); }
  return out;
}
/** 두 문장 내용 낱말 겹침(작은 쪽 기준, 낱말 4개 미만이면 0). */
export function wordOverlap(a: string, b: string): number {
  const A = contentWords(a), B = contentWords(b); if (Math.min(A.size, B.size) < 4) return 0;
  let k = 0; for (const w of A) if (B.has(w)) k++;
  return k / Math.min(A.size, B.size);
}
const nk = (s: string) => norm(s).replace(/[^가-힣0-9]/g, "");
/** 가장 긴 공통 구절 길이(한글·숫자만). */
function commonRun(a: string, b: string): number {
  const x = nk(a), y = nk(b); let best = 0;
  for (let i = 0; i < x.length; i++) for (let j = 0; j < y.length; j++) { let k = 0; while (i + k < x.length && j + k < y.length && x[i + k] === y[j + k]) k++; if (k > best) best = k; }
  return best;
}
const BROKEN = /((?<![다라])고|며|는데|지만|면서|어서|아서|해서|으며|라서)$/;
export type TidyRecord = { readonly at: string; readonly rule: "f1_neighbor" | "f1_same_meaning" | "f1_broken" | "f1_converge"; readonly sentence: string; readonly restored?: string };
/**
 * 수리 뒤 결정론 정리(F1, 호출 0). revert 3종 뒤·남은 HARD 지우기 전에 돈다.
 * ① 수리 문장(applied, 아직 남은 것): 이웃 문장과 같은 뜻(내용 낱말 50% 이상 — 원문은 그 이웃과 50% 미만), 끊긴 문장(끝 문장부호 없음·이음꼴로 끝남),
 *    같은 문단의 다른 수리 문장과 10자 이상 같은 구절(원문끼리는 없던 것)이면 원문으로 되돌린다.
 * ② 책 전체 이웃 문장(작가·수리 모두): 내용 낱말 70% 이상 같으면 뒤 문장을 뗀다(뒤가 ⟪핵심⟫이고 앞이 아니면 앞을 뗀다).
 */
/**
 * W6 S4 3판(2차 커리어 8장): 수리가 차단 깃발(모순 「…절차형이라,」)을 고쳤는데 이웃과 뜻이 겹친다고(개선) 원문으로 되돌리면 차단 문장이 돌아와 지워지고 「이 순서가 방패가 됩니다」만 남았다.
 * blocked(원문) = 수리 전 차단 갈래 깃발이 있던 문장 — 뜻 겹침·수렴(개선)으로는 그 원문으로 되돌리지 않는다(끊긴 수리 답 f1_broken은 그대로 되돌린다).
 */
export function postRepairTidy(chapters: readonly FinalChapter[], applied: readonly AppliedRepair[], blocked: (before: string) => boolean = () => false): { chapters: FinalChapter[]; records: TidyRecord[] } {
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const records: TidyRecord[] = [];
  const seenPhrase = new Map<string, string[]>();
  for (const a of applied) {
    if (a.kind !== "sentence" || !a.after || !a.before) continue;
    const [cn, sn, pn] = a.at.split(".").map(Number);
    const sec = out.find(c => c.n === cn)?.sections[sn]; const p = sec?.paragraphs[pn]; if (!sec || p === undefined) continue;
    const ss = splitSentences(p), key = nk(a.after).slice(0, 24), i = ss.findIndex(x => key && nk(x).includes(key));
    if (i < 0) continue;
    const here = norm(ss[i]), nb = [ss[i - 1], ss[i + 1]].filter((x): x is string => x !== undefined).map(norm);
    let rule: TidyRecord["rule"] | null = null;
    if (nb.some(x => wordOverlap(here, x) >= 0.5 && wordOverlap(a.before, x) < 0.5)) rule = "f1_same_meaning";
    else if (!/[.!?。」”"')…]$/.test(a.after.trim()) || BROKEN.test(a.after.trim().replace(/[.!?]+$/, ""))) rule = "f1_broken";
    else { const others = seenPhrase.get(a.at) ?? []; if (others.some(o => commonRun(o, here) >= 10)) rule = "f1_converge"; seenPhrase.set(a.at, [...others, here]); }
    if (!rule) continue;
    if (rule !== "f1_broken" && blocked(a.before)) { records.push({ at: a.at, rule, sentence: `(남김·원문 차단) ${here}` }); continue; }
    // 수리 답 그 자리만 원문으로(끝 문장부호가 없던 답은 다음 문장과 붙어 있다 — 문장째 바꾸면 다음 문장이 사라진다).
    const cur = sec.paragraphs[pn];
    (sec.paragraphs as string[])[pn] = cur.includes(a.after) ? cur.replace(a.after, a.before).replace(/\s{2,}/g, " ") : (() => { ss[i] = /⟪/.test(ss[i]) ? `⟪${norm(a.before)}⟫` : a.before; return ss.join(" "); })();
    records.push({ at: a.at, rule, sentence: here, restored: a.before });
  }
  for (const c of out) { if (c.source === "deterministic") continue; c.sections.forEach((s, si) => { s.paragraphs.forEach((p, pi) => {
    const ss = splitSentences(p); if (ss.length < 2) return;
    for (let i = 1; i < ss.length; i++) {
      if (wordOverlap(ss[i - 1], ss[i]) < 0.7) continue;
      // W6 S0-1: 이웃 문장 되풀이는 개선 규칙 — 떼고 난 문단이 3문장 이상일 때만.
      if (ss.length - 1 < IMPROVE_DROP_MIN_LEFT) { records.push({ at: `${c.n}.${si}.${pi}`, rule: "f1_neighbor", sentence: `(남김·얇음) ${norm(ss[i])}` }); continue; }
      const j = /⟪/.test(ss[i]) && !/⟪/.test(ss[i - 1]) ? i - 1 : i;
      records.push({ at: `${c.n}.${si}.${pi}`, rule: "f1_neighbor", sentence: norm(ss[j]) });
      ss.splice(j, 1); i--;
    }
    (s.paragraphs as string[])[pi] = ss.join(" ");
  }); }); }
  return { chapters: out, records };
}

/**
 * 칸을 다 써서 수리하지 못한 HARD가 남은 문단은 문단째 지운다(장이 비지 않게 — 그 장에 다른 문단이 없으면 문장만). overflow = 칸이 없어 수리 항목에 못 든 HARD 깃발.
 */
export function dropOverflowParagraphs(chapters: readonly FinalChapter[], remaining: readonly LintFlag[], overflow: ReadonlySet<string>): { chapters: FinalChapter[]; dropped: { at: string; rule: string }[] } {
  const out = chapters.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: [...s.paragraphs] })) }));
  const dropped: { at: string; rule: string }[] = [];
  const keys = new Set<string>();
  // W6 S0-1: 문단째 지우기는 차단 규칙만(개선 규칙은 기록만).
  for (const f of remaining) if (HARD_RULES.has(f.rule) && !improveOnly(f.rule, f.detail) && f.paragraph >= 0 && !f.card && overflow.has(`${f.chapter}.${f.section}.${f.paragraph}|${f.rule}`)) keys.add(`${f.chapter}.${f.section}.${f.paragraph}|${f.rule}`);
  for (const k of keys) {
    const [at, rule] = k.split("|"); const [cn, sn, pn] = at.split(".").map(Number);
    const ch = out.find(c => c.n === cn); const sec = ch?.sections[sn]; if (!ch || !sec || sec.paragraphs[pn] === undefined) continue;
    const total = ch.sections.reduce((n, s) => n + s.paragraphs.filter(Boolean).length, 0);
    if (total <= 1) continue;
    (sec.paragraphs as string[])[pn] = ""; dropped.push({ at, rule });
  }
  return { chapters: out.map(c => ({ ...c, sections: c.sections.map(s => ({ ...s, paragraphs: s.paragraphs.filter(x => x.trim()) })) })), dropped };
}
