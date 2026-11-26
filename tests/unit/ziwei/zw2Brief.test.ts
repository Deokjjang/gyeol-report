// ZW-2 2부 불변식(호출 0): 무작위 2,010명 + 7부 시험 인물 5명. 위반은 모두 0이어야 한다.
//  ① 카드 = 엔진(별 · 칸 · 사화 · 공궁 · 오행국 · 대한) ② 밝기 말은 근거 「통용」 칸에만 ③ 조언 꼬리 · 등급 낱말(「살성」 포함) · 극단 운명 말 · 내부 말 · 지시어 0
//  ④ 입력 거름(전제 말 · 건강 말 · 칸 렌즈) ⑤ 반대 쌍(상한 밖 0) ⑥ MBTI 짝 ≤ 3 · 짝 밖 유형 이름 0 · MBTI 없으면 짝 0.
// ZW2_REPORT=<파일>이면 분포 보고를 JSON으로 남긴다(판정 _raw용).
import { writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { computeZiweiChart } from "../../../src/lib/ziwei/chart";
import { loadZiweiKnowledge } from "../../../src/lib/ziwei/knowledge";
import { buildZiweiBrief, clashScope, personLines, ZIWEI_CLASH_MIN, ZIWEI_PAIR_MAX, type ZiweiBrief } from "../../../src/lib/ziwei/brief";
import { FATE_WORD, GRADE_WORD, isAdvice, maskPalaceNames, splitSents, ZW_HEALTH, ZW_MEMO } from "../../../src/lib/ziwei/text";
import { FIVE_CLASS_INFO, PALACE_NAMES, STAR_NAMES, BRANCH_KO, type StarId } from "../../../src/lib/ziwei/ids";
import { premiseHits } from "../../../src/lib/brief/premise";
import { writerKnowledge } from "../../../src/lib/writer/publish";
import { randomPeople, Z5_PEOPLE, type TestPerson } from "./zw2People";

const kb = loadZiweiKnowledge();
const { k } = writerKnowledge();
const ASOF = "2026-12-02";
const DEICTIC_ZW = /(?<![가-힣])(?:이|그) (?:칸|별|표시|사화|대한)(?![가-힣])/;
const AGE = /\d+\s?(?:세|살)(?![가-힣])/;
const STAR_KO = Object.entries(STAR_NAMES) as [StarId, (typeof STAR_NAMES)[StarId]][];

/** 작가에게 보이는 브리프 글 전부(어디서 왔는지와 함께). */
function visible(b: ZiweiBrief): { where: string; text: string }[] {
  return [
    ...personLines(b.person).map(t => ({ where: "person", text: t })),
    ...b.lines.flatMap(l => [{ where: `${l.id}.value`, text: l.value }, { where: `${l.id}.meaning`, text: l.meaning }]),
    ...b.mbtiLines.flatMap(l => [{ where: `${l.id}.value`, text: l.value }, { where: `${l.id}.meaning`, text: l.meaning }]),
    ...b.pairs.map(p => ({ where: `${p.id}.why`, text: p.why })),
    ...Object.entries(b.palaces).flatMap(([p, x]) => [{ where: `${p}.angle`, text: x.angle }, { where: `${p}.stage`, text: x.stage }, ...x.scenes.map(t => ({ where: `${p}.scene`, text: t }))]),
    { where: "body.angle", text: b.body.angle }, ...b.body.scenes.map(t => ({ where: "body.scene", text: t })),
  ].filter(x => x.text);
}
type Tally = Record<string, number>;
const bump = (t: Tally, key: string, n = 1) => { t[key] = (t[key] ?? 0) + n; };

function check(tp: TestPerson, out: { violations: string[]; tally: Tally }) {
  const v = (rule: string, detail: string) => out.violations.push(`${tp.id} ${rule}: ${detail}`);
  const chart = computeZiweiChart(tp.input as never, ASOF);
  const b = buildZiweiBrief({ chart, kb, k, person: tp.person, asOf: ASOF });
  const t = out.tally;
  if (b.log.missing.length) v("missing", b.log.missing.join(","));
  // ① 카드 = 엔진
  const placed = new Map(chart.stars.map(s => [s.id, s] as const)), mutOf = new Map(chart.mutagens.map(m => [m.star, m] as const));
  for (const c of b.cards) {
    const at = placed.get(c.star)?.palace;
    if (c.borrowedFrom) { const p = chart.palaces.find(x => x.id === c.palace)!; if (!p.empty || p.borrowFrom !== c.borrowedFrom || at !== c.borrowedFrom) v("card_borrow", c.id); if (c.mutagen) v("card_borrow_mutagen", c.id); }
    else { if (at !== c.palace) v("card_palace", `${c.id} 엔진 ${at}`); if ((mutOf.get(c.star)?.mutagen ?? undefined) !== c.mutagen) v("card_mutagen", c.id); }
    for (const d of Object.keys(c.tags)) if (!k.ontology.dimensions.some(x => x.id === d)) v("card_dim", `${c.id} ${d}`);
  }
  const palLines = b.lines.filter(l => l.kind === "palace");
  if (palLines.length !== 12) v("palace_lines", String(palLines.length));
  for (const l of palLines) {
    const p = chart.palaces.find(x => x.id === l.palace)!;
    const want = [...p.majors, ...p.helpers, ...p.malefics, ...p.loves];
    if ([...(l.facts.stars ?? [])].sort().join() !== [...want].sort().join()) v("palace_stars", l.id);
    if (!l.value.startsWith(`${PALACE_NAMES[p.id].easy} 칸`)) v("palace_name", l.id);
    const borrowed = p.empty ? chart.palaces.find(x => x.id === p.borrowFrom)!.majors : [];
    if (p.empty !== Boolean(l.facts.borrowedFrom) || (p.empty && l.facts.borrowedFrom !== p.borrowFrom)) v("palace_borrow", l.id);
    for (const [id, n] of STAR_KO) { const inValue = new RegExp(`(?<![가-힣])${n.ko}(?![가-힣])`).test(l.value); if (inValue !== (want.includes(id) || borrowed.includes(id as never))) v("palace_star_text", `${l.id} ${n.ko}`); }
    const muts = chart.mutagens.filter(m => m.palace === p.id).map(m => `${m.mutagen}:${m.star}`).sort().join();
    if ((l.facts.mutagens ?? []).map(m => `${m.mutagen}:${m.star}`).sort().join() !== muts) v("palace_mutagen", l.id);
  }
  const mutLines = b.lines.filter(l => l.kind === "mutagen");
  if (mutLines.length !== 4) v("mutagen_lines", String(mutLines.length));
  for (const l of mutLines) { const m = chart.mutagens.find(x => x.mutagen === l.facts.mutagens![0].mutagen)!; if (m.star !== l.facts.mutagens![0].star || m.palace !== l.palace || !l.value.endsWith(`${PALACE_NAMES[m.palace].easy} 칸`)) v("mutagen_fact", l.id); }
  const cls = b.lines.find(l => l.kind === "class")!;
  if (!cls.value.includes(FIVE_CLASS_INFO[chart.fiveClass.id].ko) || !cls.value.includes(`국수 ${chart.fiveClass.number}`)) v("class", cls.value);
  const head = b.lines.find(l => l.kind === "chart")!, empties = chart.palaces.filter(p => p.empty);
  if (!head.value.includes(`명궁 ${BRANCH_KO[chart.lifePalace.branch]}(${chart.lifePalace.branch}) 칸`) || !head.value.includes(`${PALACE_NAMES[chart.bodyPalace.palace].easy} 칸에 겹침`) || !head.value.includes(`빈 칸 ${empties.length}개`)) v("chart_head", head.value);
  for (const l of b.lines.filter(x => x.kind === "decade")) {
    const d = chart.decadals[l.facts.decade === "current" ? chart.now.current! : chart.now.next!];
    if (!d || d.palace !== l.palace || l.facts.years?.[0] !== d.startYear || l.facts.years?.[1] !== d.endYear || !l.value.includes(`${d.startYear}~${d.endYear}년`)) v("decade", l.value);
    if (AGE.test(l.value + l.meaning)) v("decade_age", l.value);
  }
  if ((chart.now.current !== undefined) !== b.lines.some(l => l.kind === "decade" && l.facts.decade === "current")) v("decade_current", "");
  // ② 밝기 말은 통용 칸에만
  for (const l of palLines) {
    const n = (l.value.match(/별 모습:/g) ?? []).length;
    if (n !== (l.facts.brightStars ?? []).length) v("bright_count", l.id);
    for (const s of l.facts.brightStars ?? []) if (placed.get(s)?.brightnessBasis !== "통용") v("bright_basis", `${l.id} ${s}`);
  }
  const texts = visible(b);
  for (const s of chart.stars.filter(x => x.kind === "major" && x.brightnessBasis !== "통용")) {
    const e = kb.stars.get(s.id); for (const lvl of ["bright", "normal", "dark"] as const) { const bt = e?.brightness?.[lvl]; if (!bt) continue; const head0 = splitSents(bt)[0].slice(0, 14);
      if (texts.some(x => x.where.endsWith(".value") && x.where.startsWith(`Z`) && b.lines.find(l => `${l.id}.value` === x.where)?.palace === s.palace && x.text.includes(head0))) v("bright_weak", `${s.id}@${s.palace}`); }
  }
  // ③ · ④ 글 검사
  for (const x of texts) {
    for (const sen of splitSents(x.text)) if (isAdvice(sen)) v("advice", `${x.where} «${sen}»`);
    if (GRADE_WORD.test(x.text)) v("grade_word", `${x.where} «${x.text}»`);
    if (FATE_WORD.test(x.text)) v("fate_word", `${x.where} «${x.text}»`);
    if (ZW_MEMO.test(x.text) && x.where !== "person") v("memo", `${x.where} «${x.text}»`);
    if (DEICTIC_ZW.test(x.text)) v("deictic", `${x.where} «${x.text}»`);
    if (ZW_HEALTH.test(x.text)) v("health", `${x.where} «${x.text}»`);
    if (/(?<![가-힣])(?:요즘|최근|올해|요새|당장)/.test(x.text) || (/(?<![가-힣])지금/.test(x.text) && !(x.where.endsWith(".value") && b.lines.find(l => `${l.id}.value` === x.where)?.kind === "decade"))) v("time_word", `${x.where} «${x.text}»`);
    const hits = x.where === "person" ? [] : premiseHits(maskPalaceNames(x.text).text, b.inputs); if (hits.length) v("premise", `${x.where} ${hits.map(h => h.word).join(",")} «${x.text}»`);
    if (tp.person.mbti && x.text.includes(tp.person.mbti) && !/^(?:B\d+\.|P\d+\.why|person)/.test(x.where)) v("mbti_outside", `${x.where}`);
  }
  // ④ 칸 렌즈 = 입력
  const rel = tp.person.relationshipStatus, relState = rel === "marriage_preparing" ? "dating" : rel;
  const bucheoLens = kb.palaces.get("bucheo")!.lens;
  const wantBucheo = relState && (bucheoLens.relationship as Record<string, string | undefined> | undefined)?.[relState] ? `relationship.${relState}` : null;
  if (wantBucheo && b.palaces.bucheo.lensKey !== wantBucheo) v("lens_bucheo", b.palaces.bucheo.lensKey);
  if (!relState && b.palaces.bucheo.lensKey.startsWith("relationship.")) v("lens_bucheo_unknown", b.palaces.bucheo.lensKey);
  const janyeoLens = kb.palaces.get("janyeo")!.lens;
  if (janyeoLens.children && b.palaces.janyeo.lensKey !== (tp.person.children === "has" ? "children.has" : "children.none")) v("lens_janyeo", b.palaces.janyeo.lensKey);
  const job = tp.person.jobStatus, jobState = job === "employee" ? "employed" : job === "self_employed" || job === "business_owner" ? "business" : job === "student" ? "student" : "other";
  const gwanLens = kb.palaces.get("gwanrok")!.lens;
  if ((gwanLens.job as Record<string, string | undefined> | undefined)?.[jobState] && b.palaces.gwanrok.lensKey !== `job.${jobState}`) v("lens_gwanrok", b.palaces.gwanrok.lensKey);
  // ⑤ 반대 쌍(상한 밖 0)
  const covered = new Set(b.tensions.flatMap(x => [`${x.a}|${x.b}`, `${x.b}|${x.a}`]));
  for (let j = 1; j < b.lines.length; j++) for (let i = 0; i < j; i++) {
    const a = b.lines[i], c = b.lines[j];
    if (!clashScope(a, c)) continue;
    const d = Object.entries(a.dims).find(([dim, val]) => Math.abs(val) >= ZIWEI_CLASH_MIN && c.dims[dim] !== undefined && Math.abs(c.dims[dim]) >= ZIWEI_CLASH_MIN && Math.sign(val) !== Math.sign(c.dims[dim]));
    if (!d) continue;
    const sameCards = b.tensions.some(x => { const ta = b.lines.find(l => l.id === x.a)!, tb = b.lines.find(l => l.id === x.b)!; const k1 = [ta.cards.join("+"), tb.cards.join("+")].sort().join("|"), k2 = [a.cards.join("+"), c.cards.join("+")].sort().join("|"); return k1 === k2; });
    if (!covered.has(`${a.id}|${c.id}`) && !sameCards) v("clash_left", `${a.id}×${c.id} ${d[0]}`);
  }
  bump(t, "tidy_over(보고)", b.log.tidyOver.length);
  // ⑥ MBTI
  if (b.pairs.length > ZIWEI_PAIR_MAX) v("pair_max", String(b.pairs.length));
  if (!tp.person.mbti && (b.pairs.length || b.mbtiLines.length)) v("pair_no_mbti", String(b.pairs.length));
  for (const p of b.pairs) { const life = chart.palaces.find(x => x.id === "myeong")!; const stars = life.empty ? chart.palaces.find(x => x.id === life.borrowFrom)!.majors : life.majors; if (!stars.includes(p.star)) v("pair_star", p.ruleId); }
  // 분포
  bump(t, "people"); bump(t, `pairs=${b.pairs.length}`); bump(t, "tensions", b.tensions.length); bump(t, `tension_kind:긴장`, b.tensions.filter(x => x.kind === "긴장").length); bump(t, `tension_kind:다른 무대`, b.tensions.filter(x => x.kind === "다른 무대").length);
  bump(t, "tidy_drops", b.log.tidy.length); bump(t, "tails", b.log.clean.tails); bump(t, "tails_salvaged", b.log.clean.salvaged);
  for (const d of b.log.clean.dropped) bump(t, `dropped:${d.why}`);
  bump(t, `life:${chart.palaces.find(x => x.id === "myeong")!.empty ? "empty" : chart.palaces.find(x => x.id === "myeong")!.majors.length === 2 ? "pair" : "single"}`);
  bump(t, "lines", b.lines.length);
}

describe("ZW-2 2부 자미 카드 · 브리프 불변식", () => {
  it("시험 인물 5명(7부 Z5) — 위반 0", () => {
    const out = { violations: [] as string[], tally: {} as Tally };
    for (const p of Z5_PEOPLE) check(p, out);
    expect(out.violations).toEqual([]);
  });
  it("무작위 2,010명 — 위반 0(분포 보고)", () => {
    const out = { violations: [] as string[], tally: {} as Tally };
    for (const p of randomPeople(2010)) check(p, out);
    if (process.env.ZW2_REPORT) writeFileSync(process.env.ZW2_REPORT, JSON.stringify({ tally: out.tally, violations: out.violations.slice(0, 200), violationCount: out.violations.length }, null, 2));
    expect(out.violations.slice(0, 30)).toEqual([]);
    expect(out.tally.people).toBe(2010);
  }, 600_000);
});
