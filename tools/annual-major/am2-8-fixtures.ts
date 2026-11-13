/**
 * AM2-8 1부 고정 시험 묶음 만들기(호출 0): 판독이 인용한 문장을 기록된 첫 원고(meta.raw kind=first)에서 찾아 그 장 · 소제목 문단째 꺼낸다.
 *   NODE_PATH=tools/llm/shim pnpm exec tsx tools/annual-major/am2-8-fixtures.ts
 * 결과: tests/unit/writer/am28-fixed.json(저장소 안 — 시험은 데스크톱 파일을 읽지 않는다).
 * - 다시 쓰기가 만든 문장(버린 교체 · 되돌림)은 swap으로 첫 원고 문장 자리에 넣는다.
 * - 앞으로 판독이 끝날 때마다 그 판의 인용 문장을 CASES에 더하고 다시 돌린다(rubric.md 8절).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseChapters } from "../../src/lib/writer/format";
import { OUT2, payloadFor } from "./am2-6-books";
import { intakeOf } from "./am2-brief";

export type Expect = "catch" | "pass";
type Spec = { id: string; src: string; book: string; find: string; expect: Expect; rules: string[]; note: string; swap?: string; cut?: string; detfix?: boolean };
const RB6 = ["mbti_trait", "pair_clause", "pair_link", "pair_scope", "evidence_owner"];
export const CASES: Spec[] = [
  // ---- 통과해야 함(오탐) ----
  { id: "F1", src: "P7-annual-p6b", book: "annual-p6b", find: "6월 · 병오월에는 가까운 사람과의 자리에서", expect: "pass", rules: ["rel_verb", "key_value", "rel_mix"], note: "P7 보류 7.9.0 key_value(앞 달 견줌 절)" },
  { id: "F2", src: "P7-annual-p6b", book: "annual-p6b", find: "HOLD:7.2.0", expect: "pass", rules: ["rel_verb", "key_value", "rel_mix"], note: "P7 보류 7.2.0 rel_verb" },
  { id: "F3", src: "P7-annual-p6b", book: "annual-p6b", find: "HOLD:7.10.0", expect: "pass", rules: ["rel_verb", "key_value", "rel_mix"], note: "P7 보류 7.10.0 rel_verb" },
  { id: "F4", src: "P7-major-p6b", book: "major-p6b", find: "큰 계절은 같았고, 그 위로 정관에서 편인, 정인으로 날씨가 옮겨 갔습니다.", expect: "pass", rules: ["past_assert"], note: "P7 2.0.1 엔진 값 과거형" },
  { id: "F5", src: "P7-major-p6b", book: "major-p6b", find: "큰 계절은 같았고, 그 위로 정관에서 편인, 정인으로 날씨가 옮겨 갔습니다.", swap: "큰 계절은 같고, 그 위로 정관에서 편인, 정인으로 날씨가 옮겨 가는 흐름이었습니다.", expect: "pass", rules: ["past_assert"], note: "P7 2.0.1 되돌린 다시 쓰기" },
  { id: "F6", src: "P7-major-p6b", book: "major-p6b", find: "쉬는 중인 지금 해 둔 작은 시도가", swap: "쉬는 중이라면 이 대운 끝 무렵에 해 둔 작은 시도가 그때 손에 쥘 재료가 됩니다.", expect: "pass", rules: ["dayun_position", "dayun_claim", "dayun_phase"], note: "P7 8.0.1 버린 다시 쓰기(「이 대운」 = 지금 대운)" },
  { id: "F7", src: "P7-major-p6b", book: "major-p6b", find: "혼자 낯선 도시에서 오래된 서점을 도는 편이", expect: "pass", rules: ["future_event"], note: "P7 5 · 2034 ¶1 가능 꼴" },
  { id: "F8", src: "P7-major-p6b", book: "major-p6b", find: "혼자 낯선 도시에서 오래된 서점을 도는 편이", swap: "사람 많은 송년회 대신 혼자 낯선 도시의 오래된 서점을 돌고 싶어진다면, 그 마음이 어울리는 해예요.", expect: "pass", rules: ["orphan_deictic"], note: "P7 5 · 2034 ¶1 다시 쓰기(같은 문장 조건절이 앞말)" },
  { id: "F9", src: "P7-major-p5", book: "major-p5", find: "하나만큼은 끝까지 마무리하는 원칙을", expect: "pass", rules: ["dayun_claim"], note: "P7 보류 3.0.2 dayun_claim" },
  { id: "F10", src: "P7-major-p5", book: "major-p5", find: "다만 말과 결과물이 앞서 나갈 때가 있어요.", expect: "pass", rules: ["habit_assert"], note: "P7 보류 3.0.2 habit_assert(Q7은 아직 지움)" },
  { id: "F11", src: "P7-major-1", book: "major-1", find: "판을 크게 벌이는 대담한 아이디어를 즐기고", expect: "pass", rules: ["mbti_trait"], note: "짝 P2 key 안(짝 범위)" },
  // AM2-8 6부 P7 재현(현재 코드 · 호출 0)이 남긴 보류 가운데 오탐 둘.
  { id: "F12", src: "P7-annual-p6b", book: "annual-p6b", find: "태어난 시각 자리의 정임합은 하늘 글자끼리 묶이는 힘으로 들어와요", expect: "pass", rules: ["future_assert"], note: "P7 재현 7.11.0 명리 풀이 「…힘으로 들어와요」" },
  { id: "F13", src: "P7-major-p6a", book: "major-p6a", find: "그 서운함이 속에 쌓이기 쉬운 해예요", expect: "pass", rules: ["future_event"], note: "P7 재현 5.8.1 카드 꼴 「…기 쉬운 해예요」" },
  // ---- 걸려야 함(미탐) ----
  { id: "M1", src: "P7-major-p6b", book: "major-p6b", find: "당신은 눈앞의 것부터 처리하는 쪽이라", expect: "catch", rules: RB6, note: "P7 R-B6 5 · 2032 ¶2(짝 없는 key)" },
  { id: "M2", src: "P7-major-p6a", book: "major-p6a", find: "마음을 읽는 감각을 가진 당신에게는", expect: "catch", rules: RB6, note: "P7 R-B6 7.1 ¶1" },
  { id: "M3", src: "P7-major-p6a", book: "major-p6a", find: "사람 곁에서 힘을 얻는 유형이라", expect: "catch", rules: RB6, note: "P7 R-B6 7.1 ¶2" },
  { id: "M4", src: "P7-major-p6a", book: "major-p6a", find: "당신은 사람 마음을 먼저 읽고 말을 고를 수 있어요", expect: "catch", rules: RB6, note: "P7 R-B6 9.0 ¶3(이웃 문장 「그 감각에 갑인의 곧은 뿌리」)" },
  { id: "M5", src: "P7-major-1", book: "major-1", find: "벌여 놓은 시도 중 내 이름으로 남길 것을", expect: "catch", rules: RB6, note: "P7 R-B6 7.1 ¶1(성장 곡선 말로 대운 풂)" },
  { id: "M6", src: "P7-annual-p5", book: "annual-p5", find: "작은 서운함을 삼키면 방해의 기운 속에서", expect: "catch", rules: RB6, note: "P7 R-B6 2.2 ¶2(「그 다정함」 = B1)" },
  { id: "M7", src: "P7-annual-p6b", book: "annual-p6b", find: "좋아하는 마음을 확인될 때까지", expect: "catch", rules: ["input_premise", "seed_grammar", "advice_cliche", "presumed_partner", "rel_premise"], note: "P7 경계 예 2월 ¶2(씨앗 비문 + 기혼에 연애 시작 꼴)" },
  { id: "M8", src: "P7-annual-p6b", book: "annual-p6b", find: "정임합이 하늘 글자끼리 묶이는 힘으로 작용하기 쉬운 때예요", expect: "catch", rules: ["rel_subject_time"], note: "P7 경계 12월(관계 주어 + 「때예요」)" },
  { id: "M9", src: "P7-major-p6a", book: "major-p6a", find: "화면에 이미 있는 줄이라", expect: "catch", rules: ["meta_trace"], note: "P7 경계 예 5 · 2032 ¶1" },
  { id: "M10", src: "P7-major-1", book: "major-1", find: "채워지는 쪽을 먼저 둡니다", expect: "catch", rules: ["rule_echo"], note: "P7 경계 아마 5 · 2036 ¶2(짝 꼴 이름)" },
  { id: "M11", src: "P7-major-p6a", book: "major-p6a", find: "다그치는 기운이 채워지는 쪽보다", expect: "catch", rules: ["rule_echo"], note: "P7 경계 아마 5 · 2030 ¶2(짝 꼴 이름)" },
  // ---- 지우기 뒤 고아(지우면 안 되는 자리) ----
  { id: "C1", src: "P6-major-p6b", book: "major-p6b", find: "출장·외근이 잦아져", cut: "출장·외근이 잦아져", expect: "catch", rules: ["lean_on_cut"], note: "R7 6.2 ¶2 「반가운 흐름 · 반경」(앞말을 지우면 고아)" },
  { id: "C2", src: "P6-major-p6b", book: "major-p6b", find: "그 몫이 든든한 바탕", cut: "들어오는 돈이 있는 날", expect: "catch", rules: ["lean_on_cut"], note: "R7 8.1 ¶3 「그 몫」" },
  { id: "C3", src: "P7-major-p5", book: "major-p5", find: "다만 말과 결과물이 앞서 나갈 때가 있어요.", cut: "다만 말과 결과물이 앞서 나갈 때가 있어요.", expect: "catch", rules: ["lean_on_cut"], note: "Q7 3.0 ¶3 「그럴 때」(앞말을 지우면 고아)" },
  { id: "D1", src: "P6-major-p6b", book: "major-p6b", find: "월급날이 아니어도", expect: "catch", rules: ["input_premise", "time_deictic"], detfix: true, note: "R7 8.1 ¶3 첫 원고: 결정론 고침 둘 다 대고 지우지 않음" },
  // ---- P8 판독(2026-11-13) 뒤 — P8 뒤 고침(재현만 확인) ----
  { id: "P8a", src: "P8/_raw/annual-p6b", book: "annual-p6b", find: "ISTJ도 검증된 것만 믿는 쪽이라", expect: "catch", rules: RB6, note: "P8 차단 R-B6 7월 ¶2(짝 P10 밖 땅 비견을 「ISTJ도」로 받음)" },
  { id: "P8b", src: "P8/_raw/annual-p6b", book: "annual-p6b", find: "이 책에서 두 번째로 가까운 사람의 자리", expect: "catch", rules: ["meta_trace"], note: "P8 경계 예 3월 ¶1(고리 재료 「이 책 2번째」를 옮김)" },
  { id: "P8c", src: "P8/_raw/annual-1", book: "annual-1", find: "부딪침이 있어도 수국 반합이 함께 있어서", expect: "pass", rules: ["rel_verb"], note: "P8 보류 7.11.0 rel_verb(부딪침 = 같은 달 자오충)" },
  { id: "P8d", src: "P8/_raw/annual-p6b", book: "annual-p6b", find: "가장 아끼는 일 하나를 고르면 됩니다", expect: "pass", rules: ["degree"], note: "P8 남은 차단 8.0 ¶1 degree(읽는 사람이 고름)" },
  { id: "P8e", src: "P8/_raw/annual-1", book: "annual-1", find: "부딪침이 있어도 수국 반합이 함께 있어서", swap: "10월 · 경술월이 불꽃처럼 모이는 달이었다면, 12월 · 임자월은 같은 태어난 날 자리에 자오충이 들어와 마음의 온도가 오르내리는 달입니다.", expect: "pass", rules: ["month_list"], note: "P8 버린 다시 쓰기 7.11.0 #1~#3(「오르내리는 달」을 「오르는 달」 목록으로 셈)" },
];

type Raw = { kind: string; text: string };
const stripHanja = (t: string) => t.replace(/\s?\([一-鿿·\s]+\)/g, "");
function firstDraft(src: string) {
  const snap = JSON.parse(readFileSync(join(OUT2, src, "snapshot.json"), "utf8"));
  const raws = (snap.evidencePacket.meta.raw as Raw[]).filter(r => r.kind === "first");
  return { snap, chapters: raws.flatMap(r => parseChapters(r.text)) };
}
export type Fixture = { id: string; book: string; expect: Expect; rules: string[]; note: string; chapter: number; section: number; heading: string; keyed: boolean; paragraphs: string[]; sentence: string; cut?: string; detfix?: boolean };
const out: Fixture[] = [];
for (const c of CASES) {
  const { snap, chapters } = firstDraft(c.src);
  const { intake } = intakeOf(payloadFor(c.book));
  const keyOf = new Map(intake.chapters.flatMap(ch => (ch.keys ?? []).map(k => [k.label, k.key] as const)));
  let find = c.find;
  if (find.startsWith("HOLD:")) { const at = find.slice(5); const h = (snap.evidencePacket.meta.review.hold as { at: string; sentence: string }[]).find(x => x.at === at); if (!h) throw new Error(`${c.id} hold ${at} 없음`); find = h.sentence.slice(0, 40); }
  // 첫 원고에 없으면(다시 쓰기가 만든 문장) 발행본에서 찾는다 — 머리 문장(「…가 하늘에, …가 땅에 들어오는 달·해…」)과 한자는 뗀다.
  const finals = (snap.draft.chapters as { n: number; title: string; sections: { heading: string; paragraphs: string[] }[] }[]).map(ch => ({ ...ch, sections: ch.sections.map(s2 => ({ ...s2, heading: intake.chapters.flatMap(p => p.keys ?? []).find(k => k.key === s2.heading)?.label ?? s2.heading, paragraphs: s2.paragraphs.map((p, pi) => (pi === 0 ? stripHanja(p).replace(/^[^.?!]*하늘에, [^.?!]*땅에 들어오는 (달|해)[^.?!]*[.?!]\s*/, "") : stripHanja(p))) })) }));
  const pick = (chs: readonly { n: number; sections: readonly { heading: string; paragraphs: readonly string[] }[] }[]) => chs.flatMap(ch => ch.sections.map((s, si) => ({ ch, s, si }))).find(x => x.s.paragraphs.some(p => p.includes(find)));
  const hit = pick(chapters) ?? pick(finals);
  if (!hit) { console.error(`${c.id}: 첫 원고에서 못 찾음 — ${find}`); continue; }
  const plan = intake.chapters.find(p => p.n === hit.ch.n);
  const key = keyOf.get(hit.s.heading.trim().replace(/^\d+\.\s*/, "")) ?? [...keyOf].find(([l]) => hit.s.heading.includes(l))?.[1];
  const sentence0 = hit.s.paragraphs.find(p => p.includes(find))!;
  const sen = (c.swap ?? find);
  const paragraphs = hit.s.paragraphs.map(p => stripHanja(c.swap ? p.replace(new RegExp(`[^.?!]*${find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^.?!]*[.?!]`), c.swap) : p));
  void sentence0;
  out.push({ id: c.id, book: c.book, expect: c.expect, rules: c.rules, note: c.note, chapter: hit.ch.n, section: hit.si, heading: plan?.keys ? key ?? hit.s.heading : hit.s.heading, keyed: Boolean(plan?.keys), paragraphs, sentence: stripHanja(sen), ...(c.cut ? { cut: c.cut } : {}), ...(c.detfix ? { detfix: true } : {}) });
}
writeFileSync("tests/unit/writer/am28-fixed.json", `${JSON.stringify(out, null, 1)}\n`);
console.log(`고정 시험 ${out.length}/${CASES.length}건 → tests/unit/writer/am28-fixed.json`);
