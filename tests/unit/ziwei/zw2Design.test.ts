// ZW-2 3부 설계도 · 작가 지시 불변식(호출 0): 시험 인물 5명 + 무작위 2,010명.
//  9장 · 소제목 2~3 · 근거 집 장(집 줄은 그 장 소제목에, 다른 장 줄은 「새 각도」로만) · 처방(1장 없음 · 9장 사전 밖 · 2~8장 장끼리 갈래 겹침 0 · 이웃 장 같은 갈래 0 · 입력에 맞음)
//  · 지시 · 카드에 극단 운명 말 · 등급 낱말(「살성」) · 내부 말 · 계산 기준 이야기 0 · 공유 블록에 MBTI 유형 0 · 짝 밖 묶음에 유형 0 · 작가 규칙 토큰 ≤ 대운.
// ZW2_REPORT_DESIGN=<파일>이면 처방 분포 · 토큰 · 지시 글자 수를 JSON으로 남긴다.
import { writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { computeZiweiChart } from "../../../src/lib/ziwei/chart";
import { loadZiweiKnowledge } from "../../../src/lib/ziwei/knowledge";
import { buildZiweiBrief } from "../../../src/lib/ziwei/brief";
import { buildZiweiDesign, ZIWEI_CHAPTERS } from "../../../src/lib/ziwei/design";
import { FATE_WORD, GRADE_WORD } from "../../../src/lib/ziwei/text";
import { buildZiweiIntake, ziweiRuleCtxOf, ziweiRules } from "../../../src/lib/writer/chunked/ziwei";
import { chunkPlan, chunkRules, chunkUser, renderCard } from "../../../src/lib/writer/chunked/prompt";
import { RX_FAMILY, type RxKind } from "../../../src/lib/brief/prescriptions";
import { needMet } from "../../../src/lib/brief/premise";
import { estimateTokens } from "../../../src/lib/brief/size";
import { writerKnowledge } from "../../../src/lib/writer/publish";
import { randomPeople, Z5_PEOPLE, type TestPerson } from "./zw2People";

const kb = loadZiweiKnowledge();
const { k } = writerKnowledge();
const ASOF = "2026-12-02";
const MAJOR_RULE_TOKENS = Math.min(...[true, false].map(mbti => estimateTokens(chunkRules({ product: "major_fortune", mbti, wish: "none", job: "일: 직장인", relationship: "연애: 기혼", children: "있음" }))));
const SCHOOL = /학파|유파|중주파|북파|삼합파|계산 기준|iztro|라이브러리|통용|全書|추정/i;
const fam = (kd: RxKind) => RX_FAMILY[kd] ?? kd;
type Report = { people: number; rx: Record<number, Record<string, number>>; systemTokens: number[]; cardTokens: number[]; slotChars: number[]; ruleTokens: number[] };

function check(tp: TestPerson, out: { v: string[]; r: Report }) {
  const v = (rule: string, d: string) => out.v.push(`${tp.id} ${rule}: ${d}`);
  const chart = computeZiweiChart(tp.input as never, ASOF);
  const b = buildZiweiBrief({ chart, kb, k, person: tp.person, asOf: ASOF });
  const d = buildZiweiDesign(b), x = buildZiweiIntake(b, d);
  if (d.chapters.map(c => `${c.n}.${c.title}`).join("|") !== ZIWEI_CHAPTERS.map(c => `${c.n}.${c.title}`).join("|")) v("chapters", "");
  const lineHome = new Map(b.lines.map(l => [l.id, l.home] as const));
  for (const c of d.chapters) {
    if (c.sections.length < 2 || c.sections.length > 3) v("sections", `${c.n}장 ${c.sections.length}`);
    const used = new Set(c.sections.flatMap(s => s.lines));
    for (const id of c.home) if (!used.has(id)) v("home_unused", `${c.n}장 ${id}`);
    for (const id of used) { const h = lineHome.get(id); if (h !== undefined && h !== c.n && c.away[id] !== h) v("away_missing", `${c.n}장 ${id}(집 ${h})`); }
    for (const s of c.sections) {
      if (!s.core || !s.tone) v("slot_empty", `${c.n}장 ${s.q}`);
      for (const t of [s.q, s.core, s.own, s.third ?? "", s.tone]) { if (FATE_WORD.test(t)) v("fate_slot", `${c.n}장 «${t}»`); if (GRADE_WORD.test(t)) v("grade_slot", `${c.n}장 «${t}»`); if (SCHOOL.test(t)) v("school_slot", `${c.n}장 «${t}»`); if (/요즘|최근|올해|당장/.test(t)) v("time_slot", `${c.n}장 «${t}»`); }
      out.r.slotChars.push([s.core, s.own, s.third ?? "", s.tone].join("").length);
    }
  }
  // 처방
  const r1 = d.chapters.find(c => c.n === 1)!.rx, r9 = d.chapters.find(c => c.n === 9)!.rx;
  if (r1.use || r1.label) v("rx1", "1장 처방"); if (r9.use || !r9.label?.includes("사전 밖")) v("rx9", String(r9.label));
  const uses = d.chapters.filter(c => c.n >= 2 && c.n <= 8).map(c => ({ n: c.n, use: c.rx.use, forbid: c.rx.forbid }));
  for (const u of uses) { if (!u.use) { v("rx_none", `${u.n}장`); continue; } (out.r.rx[u.n] ??= {})[u.use] = (out.r.rx[u.n][u.use] ?? 0) + 1; if (u.forbid.includes(u.use)) v("rx_forbid_self", `${u.n}장`);
    if ((u.use === "월급날·먼저 떼어 두기" || u.use === "값 매기기") && !needMet("job:work", b.inputs)) v("rx_input", `${u.n}장 ${u.use}`); }
  const fams = uses.filter(u => u.use).map(u => fam(u.use!));
  if (new Set(fams).size !== fams.length) v("rx_dup", fams.join(","));
  for (let i = 1; i < uses.length; i++) if (uses[i].use && uses[i - 1].use && fam(uses[i].use!) === fam(uses[i - 1].use!)) v("rx_adjacent", `${uses[i - 1].n}-${uses[i].n}`);
  // 지시 · 카드 · MBTI
  const card = renderCard(x), rules = ziweiRules(ziweiRuleCtxOf(b, x)), chunks = chunkPlan(x);
  if (chunks.length !== 6 || chunks.map(c => c.parts.map(p => p.n).join("+")).join(" ") !== "1+2 3+4 5 6+7 8 9") v("chunks", chunks.map(c => c.parts.map(p => p.n).join("+")).join(" "));
  for (const [where, t] of [["card", card], ["rules", rules]] as const) { if (FATE_WORD.test(t)) v("fate", where); if (/살성|길성|흉성/.test(t)) v("salseong", where); if (/학파|유파|중주파|북파|삼합파|iztro|全書|통용|추정/i.test(t)) v("school", where); }
  const type = tp.person.mbti;
  if (type && card.includes(type)) v("mbti_card", "공유 블록에 유형");
  if (x.pairs.length > 3) v("pair_max", String(x.pairs.length));
  if (!type && (x.pairs.length || x.lines.some(l => l.subject === "mbti"))) v("pair_no_mbti", "");
  for (const c of chunks) { const u = chunkUser(x, c), hasPair = x.pairs.some(p => (p.use ?? []).some(n => c.parts.some(q => q.n === n)));
    if (type && !hasPair && u.includes(type)) v("mbti_chunk", c.id); if (type && hasPair && !u.includes(type)) v("mbti_chunk_missing", c.id); }
  const rt = estimateTokens(rules); out.r.ruleTokens.push(rt); if (rt > MAJOR_RULE_TOKENS) v("rule_tokens", `${rt} > ${MAJOR_RULE_TOKENS}`);
  out.r.systemTokens.push(rt + estimateTokens(card)); out.r.cardTokens.push(estimateTokens(card));
  out.r.people++;
}
const stat = (xs: number[]) => ({ avg: Math.round(xs.reduce((a, b) => a + b, 0) / xs.length), max: Math.max(...xs), min: Math.min(...xs) });

describe("ZW-2 3부 9장 설계도 · 작가 지시", () => {
  it("시험 인물 5명 — 위반 0", () => {
    const out = { v: [] as string[], r: { people: 0, rx: {}, systemTokens: [], cardTokens: [], slotChars: [], ruleTokens: [] } as Report };
    for (const p of Z5_PEOPLE) check(p, out);
    expect(out.v).toEqual([]);
  });
  it("무작위 2,010명 — 위반 0 · 처방이 한 종류로 쏠리지 않음", () => {
    const out = { v: [] as string[], r: { people: 0, rx: {}, systemTokens: [], cardTokens: [], slotChars: [], ruleTokens: [] } as Report };
    for (const p of randomPeople(2010)) check(p, out);
    const share = Object.fromEntries(Object.entries(out.r.rx).map(([n, m]) => [n, { kinds: Object.keys(m).length, top: Object.entries(m).sort((a, b) => b[1] - a[1])[0], maxShare: Math.round(Math.max(...Object.values(m)) / out.r.people * 100) / 100 }]));
    const rep = { people: out.r.people, rx: out.r.rx, share, systemTokens: stat(out.r.systemTokens), cardTokens: stat(out.r.cardTokens), ruleTokens: stat(out.r.ruleTokens), majorRuleTokens: MAJOR_RULE_TOKENS, slotChars: stat(out.r.slotChars), violations: out.v.slice(0, 100), violationCount: out.v.length };
    if (process.env.ZW2_REPORT_DESIGN) writeFileSync(process.env.ZW2_REPORT_DESIGN, JSON.stringify(rep, null, 2));
    expect(out.v.slice(0, 30)).toEqual([]);
    for (const [n, s] of Object.entries(share)) { expect(s.kinds, `${n}장 종류 수`).toBeGreaterThanOrEqual(3); expect(s.maxShare, `${n}장 쏠림`).toBeLessThanOrEqual(0.6); }
  }, 600_000);
});
