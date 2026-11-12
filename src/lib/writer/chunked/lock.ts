/**
 * AM2-6 5부(덕짱님 지시 2026-11-12) — 문단 교체 사실 고정(결정론, 호출 0).
 * P5 차단·경계 가운데 다시 쓰기·지우기가 만든 것(세운 6 · 대운 3: 「하반기」 「그 불」 「한 번 더 기우는 달」 「두 해째」 …)을 구조로 막는다.
 * - 교체 문단에서 깃발이 없던 문장은 원문으로 되돌린다(문장 정렬). 깃발 문장 바로 앞뒤 한 문장만 이음말(첫 어절)을 바꿀 수 있다.
 * - 깃발 문장도 사실 낱말(달 이름 목록 · 관계 이름 · 십성 · 숫자 · 경향 꼬리 「…쉬운 때」 「…움직이는 때」)을 잃으면 그 교체는 받지 않는다.
 *   깃발이 그 사실 자체를 가리킬 때만 예외다(관계 깃발 → 관계 이름, 달 깃발 → 달 이름, 단정 깃발 → 꼬리 …).
 * - 되돌린 뒤 문단 전체 다시 검사(새 깃발이면 교체를 버린다)는 부르는 쪽(publish rewrite)이 한다.
 */
import { splitSentences } from "../safety/patterns";

const norm = (t: string) => t.replace(/[⟪⟫]/g, "").replace(/[^가-힣A-Za-z0-9]/g, "");
const grams = (t: string) => { const n = norm(t), s = new Set<string>(); for (let i = 0; i + 4 <= n.length; i++) s.add(n.slice(i, i + 4)); return s; };
const jac = (a: string, b: string) => { const A = grams(a), B = grams(b); if (!A.size || !B.size) return norm(a) === norm(b) ? 1 : 0; let n = 0; for (const w of A) if (B.has(w)) n++; return n / (A.size + B.size - n); };
const CONNECTIVE = /^(그래서|그러니|그러니까|그리고|또|또한|다만|하지만|그런데|그만큼|이때|그때|특히|한편|반면|그러면|대신|게다가|무엇보다|그럼에도)\s+/;
const stripHead = (t: string) => t.replace(/[⟪⟫]/g, "").replace(CONNECTIVE, "");

/** 사실 낱말 종류(깃발 규칙 → 그 깃발이 가리키는 사실 종류는 바뀌어도 된다). */
export type FactKind = "month" | "rel" | "tg" | "num" | "tail";
const MONTH = /(?:2028년 )?(?:1[0-2]|[1-9])월(?: · [갑을병정무기경신임계][자축인묘진사오미신유술해]월)?|[갑을병정무기경신임계][자축인묘진사오미신유술해]월/g;
const TG = /비견|겁재|식신|상관|편재|정재|편관|정관|편인|정인/g;
// 숫자 사실은 단위가 붙은 것만(해 · 달 · 번째 · 나이 · 개수). 「1장」 「이 10년」 같은 가리킴 · 대운 말은 사실 낱말이 아니다.
const NUM = /20\d\d년|(?<!\d)(?:1[0-2]|[1-9])월|\d+번째|만 \d+세|\d+세|\d+개|\d+번(?!째)|\d+가지|\d+명/g;
const TAIL = /(?:쉬운|쉬워요|쉽습니다|움직이는|움직이기 쉬운|좋은|좋아요|좋습니다) (?:때|달|해|쪽)|기 (?:쉬워요|좋아요|쉽습니다|좋습니다)|기 쉬운|경향/g;
const RULE_FACT: Readonly<Record<string, readonly FactKind[]>> = {
  relation_scope: ["rel"], rel_verb: ["rel"], rel_mix: ["rel"], seat_badge: ["rel"], key_value: ["rel", "month", "tg", "num"], relation_frame: ["rel"], must_bare: ["rel"], rel_echo: ["rel"],
  month_list: ["month"], month_range: ["month"], month_line: ["month"], claim_months: ["month"], calendar_month: ["month"], orphan_deictic: ["month"], orphan_ref: ["month"], future_past: ["month", "num"],
  key_tengod: ["tg"], sky_ground: ["tg"], head_repeat: ["tg"], tg_join: ["tg"], pair_scope: ["tg"], pair_causal: ["tg"], pair_link: ["tg"], evidence_owner: ["tg"],
  count_claim: ["num"], dayun_position: ["num", "month"], date_deadline: ["num"], degree: ["num"],
  // 말 꼴 · 되풀이 깃발(교체 대상 경미)은 그 문장을 다른 말로 쓰라는 것 — 가리킴 달 · 해와 경향 꼬리는 바뀌어도 된다(관계 이름 · 십성은 지킨다). 달 목록 핵심 주장은 교체 뒤 다시 검사(claim_months)가 지킨다.
  link_template: ["num", "month", "tail"], chapter_repeat: ["num", "month", "tail"], rep_adjacent: ["num", "month", "tail"], ending_cap: ["tail"], head_echo: ["tail"], gyeol_cap: ["tail"], pair_opener: ["tail"], pair_last: ["tail"], advice_repeat_sec: ["tail"], rx_extra: ["tail"], rx_repeat_sec: ["tail"], screen_repeat: ["tail"], name_call: [], meta_trace: ["num"],
  future_assert: ["tail"], future_event: ["tail"], past_assert: ["tail"], habit_assert: ["tail"], tone_mismatch: ["tail"], past_question: ["tail"], past_premise: ["tail"],
};
export function factsOf(t0: string, rels: readonly string[]): Record<FactKind, Set<string>> {
  // 고객 바람 인용(«…»)과 따옴표 대사 안은 사실 낱말로 세지 않는다(인용을 덜어 내는 교체를 막지 않게).
  const t = t0.replace(/«[^»]*»|["“][^"”]*["”]/g, " ");
  const g = (re: RegExp) => new Set([...t.matchAll(re)].map(m => m[0].replace(/ · .+$/, "").replace(/^(\d+)월.*/, "$1월")));
  // 경향 꼬리는 「있다/없다」로만 본다(「움직이는 때」 → 「흔들리기 쉬운 달」은 경향 그대로 — 「한 번 더 기우는 달」처럼 단정으로 바뀐 것만 잃음).
  return { month: g(MONTH), rel: new Set(rels.filter(r => r.length >= 2 && t.includes(r))), tg: g(TG), num: g(NUM), tail: TAIL.test(t) ? new Set(["경향"]) : new Set<string>() };
}
const lostFacts = (from: string, to: string, rels: readonly string[], exempt: ReadonlySet<FactKind>): string[] => {
  const a = factsOf(from, rels), b = factsOf(to, rels), out: string[] = [];
  for (const k of ["month", "rel", "tg", "num", "tail"] as const) if (!exempt.has(k)) for (const v of a[k]) if (!b[k].has(v) && !(k === "month" && b.month.has(v.replace(/ · .+$/, "")))) out.push(`${k}:${v}`);
  return out;
};
const exemptOf = (rules: readonly string[]) => new Set(rules.flatMap(r => RULE_FACT[r] ?? []));
const holds = (raw: string, sen: string) => { const r = norm(raw), x = norm(sen); return x.length > 0 && (r.includes(x) || x.includes(r) || (x.length >= 24 && r.includes(x.slice(0, 12)) && r.includes(x.slice(-12)))); };

export type LockNote = { readonly at: string; readonly kind: "restored" | "rejected" | "whole_rejected"; readonly detail: string };
/**
 * 문단 하나: before(원문) · after(교체 글) · 깃발 문장(규칙). 깃발 없는 문장은 원문으로, 깃발 문장 자리에는 교체 글의 그 자리 문장을(사실을 잃지 않을 때만).
 * 깃발 문장을 원문에서 찾지 못하면(문단 단위 깃발) 사실만 대조한다 — 잃으면 원문을 둔다.
 */
export function lockParagraph(before: string, after: string, flagged: readonly { sentence: string; rule: string }[], rels: readonly string[], at = ""): { text: string; notes: LockNote[] } {
  const B = splitSentences(before), A = splitSentences(after), notes: LockNote[] = [];
  const fl = B.map(bs => flagged.filter(f => holds(bs, f.sentence)));
  const flaggedIdx = new Set(fl.map((f, i) => (f.length ? i : -1)).filter(i => i >= 0));
  if (!flaggedIdx.size) {
    const lost = lostFacts(before, after, rels, exemptOf(flagged.map(f => f.rule)));
    if (lost.length) { notes.push({ at, kind: "whole_rejected", detail: `깃발 문장 없음 · 사실 잃음 ${lost.join(", ")}` }); return { text: before, notes }; }
    return { text: after, notes };
  }
  // 정렬: 깃발 없는 원문 문장마다 교체 글에서 가장 닮은 문장(앞에서부터 순서대로, 자카드 0.5 이상).
  const anchor = new Map<number, number>(); let from = 0;
  B.forEach((bs, i) => { if (flaggedIdx.has(i)) return; let best = -1, bestS = 0.5; for (let j = from; j < A.length; j++) { const s2 = jac(bs, A[j]); if (s2 >= bestS) { best = j; bestS = s2; } } if (best >= 0) { anchor.set(i, best); from = best + 1; } });
  // 닻 사이(gap)마다 교체 글 문장을 원문 문장에 나눈다: 닮은 원문(자카드 0.25 이상)이 있으면 그 문장의 새 글, 없으면 가장 가까운 깃발 문장 몫.
  // 깃발 없는 원문 문장은 늘 원문 그대로(그 문장의 새 글은 버린다). 깃발 문장 바로 앞뒤는 이음말만 바뀐 새 글이면 받는다.
  const out: string[] = [];
  const anchors = [...anchor].sort((p1, p2) => p1[0] - p2[0]);
  const gapsB: number[][] = [], gapsA: number[][] = []; let bPrev = -1, aPrev = -1;
  for (const [bi, aj] of [...anchors, [B.length, A.length] as [number, number]]) { gapsB.push(Array.from({ length: bi - bPrev - 1 }, (_, q) => bPrev + 1 + q)); gapsA.push(Array.from({ length: Math.max(0, aj - aPrev - 1) }, (_, q) => aPrev + 1 + q)); bPrev = bi; aPrev = aj; }
  const assigned = new Map<number, number[]>(); // 원문 index → 교체 글 index들
  gapsB.forEach((gb, gi) => { const ga = gapsA[gi], flaggedHere = gb.filter(x => flaggedIdx.has(x));
    // 문장 수가 같으면 차례대로(한 문장씩 고쳐 쓴 꼴), 다르면 닮은 문장으로.
    if (ga.length === gb.length) { gb.forEach((bi, q) => assigned.set(bi, [ga[q]])); return; }
    for (const aj of ga) { let best = -1, bestS = 0.25; for (const bi of gb) { const s2 = jac(B[bi], A[aj]); if (s2 >= bestS) { best = bi; bestS = s2; } }
      const target = best >= 0 ? best : flaggedHere.length ? flaggedHere.reduce((p1, p2) => (Math.abs(p2 - aj) < Math.abs(p1 - aj) ? p2 : p1)) : -1;
      if (target >= 0) assigned.set(target, [...(assigned.get(target) ?? []), aj]); } });
  let i = 0;
  while (i < B.length) {
    if (!flaggedIdx.has(i)) {
      const j = anchor.get(i), neighbor = flaggedIdx.has(i - 1) || flaggedIdx.has(i + 1);
      if (j !== undefined && neighbor && norm(stripHead(A[j])) === norm(stripHead(B[i]))) out.push(A[j]);
      else { out.push(B[i]); const own = j !== undefined ? [j] : assigned.get(i) ?? []; if (own.some(x => norm(A[x]) !== norm(B[i]))) notes.push({ at, kind: "restored", detail: B[i].slice(0, 60) }); }
      i++; continue;
    }
    // 이어진 깃발 문장 묶음 → 그 문장들에 나눠진 새 글.
    let k = i; while (k + 1 < B.length && flaggedIdx.has(k + 1)) k++;
    const seg = Array.from({ length: k - i + 1 }, (_, q) => assigned.get(i + q) ?? []).flat().sort((p1, p2) => p1 - p2).map(x => A[x]);
    const run = B.slice(i, k + 1).join(" "), rules = fl.slice(i, k + 1).flat().map(f => f.rule);
    const rest = B.filter((_x, q) => q < i || q > k).join(" ");
    const lost = lostFacts(run, `${seg.join(" ")} ${rest}`, rels, exemptOf(rules));
    if (lost.length) { out.push(...B.slice(i, k + 1)); notes.push({ at, kind: "rejected", detail: `사실 잃음 ${lost.join(", ")} — ${run.slice(0, 60)}` }); }
    else out.push(...seg);
    i = k + 1;
  }
  return { text: out.join(" ").replace(/\s{2,}/g, " ").trim(), notes };
}
/** 「*」 자리(key · 절 전체): 깃발 문장 밖 사실 낱말이 새 글에 모두 있어야 한다. 잃으면 원문을 둔다. */
export function lockWhole(before: readonly string[], after: readonly string[], flagged: readonly { sentence: string; rule: string }[], rels: readonly string[], at = ""): { paragraphs: readonly string[]; notes: LockNote[] } {
  const keep = before.flatMap(p => splitSentences(p)).filter(s => !flagged.some(f => holds(s, f.sentence))).join(" ");
  const lost = lostFacts(keep, after.join(" "), rels, exemptOf(flagged.map(f => f.rule)));
  return lost.length && before.some(p => p.trim()) ? { paragraphs: before, notes: [{ at, kind: "whole_rejected", detail: `사실 잃음 ${lost.join(", ")}` }] } : { paragraphs: after, notes: [] };
}
