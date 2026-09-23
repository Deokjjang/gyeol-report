import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ANNUAL_JIE_CASES } from "../../fixtures/saju/annualJieBoundaryGoldens";
import legacy from "../../fixtures/report-generation/annual-month-legacy-v1.json";
import { createSajuCalendarContext } from "../../../src/lib/saju/lunarJavascriptPillars";
import { calculateCustomerDayun, formatDayunKst } from "../../../src/lib/saju/customerDayun";
import { ANNUAL_MONTH_CALCULATION_VERSION, buildAnnualMonthCalendar, getAnnualJieBoundaries, monthPillarText, type AnnualCalendarMonth, type AnnualMonthSegment } from "../../../src/lib/report-knowledge/annualMonthJie";
import * as monthlyEngine from "../../../src/lib/report-knowledge/annualMonthJie";
import { generateAnnualFortuneProductDraft } from "../../../src/lib/report-generation/annualFortuneGenerationHandler";
import { annualMonthlyEvidenceMatches } from "../../../src/lib/report-generation/annualMonthlyPublication";
import { validateNewProductPublication, validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { validateAnnualFortuneReportDraft } from "../../../src/lib/report-generation/annualFortuneReportDraftValidator";
import { generateAnnualFortuneReportDraft } from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriter";
import { buildOpenAIAnnualFortuneReportWriterMessages } from "../../../src/lib/report-generation/openaiAnnualFortuneReportWriterPrompt";
import { readPublishedReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import type { AnnualFortuneEvidencePacket } from "../../../src/lib/report-knowledge/annualFortuneEvidence";
import type { SinglePersonGenerationInput } from "../../../src/lib/report-generation/reportInputAdapter";
import { AnnualFortuneReportView } from "../../../src/app/reports/[reportId]/AnnualFortuneReportView";

const customers = [
  { name: "고객A", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ" },
  { name: "고객B", birthDate: "1980-05-15", birthTime: "09:30", gender: "FEMALE", mbtiType: "ISFJ" },
  { name: "고객C", birthDate: "2001-08-20", birthTime: "16:20", gender: "MALE", mbtiType: "ENFP" },
] as const;
function inputFor(index = 0, year = 2026): SinglePersonGenerationInput {
  return { kind: "annualFortune", productKey: "annual_fortune", productSlug: "annual-fortune",
    person: { ...customers[index], birthTimeUnknown: false, approximateBirthTimeSlot: "", calendarType: "solar", timezone: "Asia/Seoul" },
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: ["직업", "돈"] }, productOptions: { selectedYear: String(year) } };
}
async function generate(index = 0, year = 2026, person?: Partial<SinglePersonGenerationInput["person"]>) {
  const input = inputFor(index, year);
  const r = await generateAnnualFortuneProductDraft({ ...input, person: { ...input.person, ...person } }, {
    writer: { enabled: false }, now: () => new Date(`${year}-09-23T00:00:00+09:00`),
  });
  expect(r.ok, JSON.stringify(r)).toBe(true);
  if (!r.ok) throw new Error("local annual fixture failed");
  return r;
}
const at = (segments: readonly AnnualMonthSegment[], instant: string) => segments.find(s => Date.parse(s.startKst) <= Date.parse(instant) && Date.parse(instant) < Date.parse(s.endKstExclusive))!;
const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
function continuity(months: readonly AnnualCalendarMonth[], year: number) {
  expect(months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  const all = months.flatMap(m => m.segments);
  expect(all[0].startKst).toBe(`${year}-01-01T00:00:00+09:00`);
  expect(all.at(-1)!.endKstExclusive).toBe(`${year + 1}-01-01T00:00:00+09:00`);
  all.forEach((s, i) => {
    expect(Date.parse(s.startKst)).toBeLessThan(Date.parse(s.endKstExclusive));
    if (i) expect(s.startKst).toBe(all[i - 1].endKstExclusive);
  });
  months.forEach(m => {
    expect(m.startKst).toBe(m.segments[0].startKst);
    expect(m.endKstExclusive).toBe(m.segments.at(-1)!.endKstExclusive);
  });
}

describe("frozen 48 Jie boundaries before / exact / after", () => {
  it.each(ANNUAL_JIE_CASES)("$instantKst $before → $after", g => {
    const boundaries = getAnnualJieBoundaries(g.year);
    expect(boundaries).toHaveLength(12);
    expect(boundaries[g.month - 1].instantKst).toBe(g.instantKst);
    for (const seconds of [-1, 0, 1]) {
      const p = createSajuCalendarContext(formatDayunKst(Date.parse(g.instantKst) + seconds * 1000)).pillars;
      expect(monthPillarText(p.month)).toBe(seconds < 0 ? g.before : g.after);
      expect(monthPillarText(p.year)).toBe(seconds < 0 ? g.beforeYear : g.afterYear);
    }
  });
  it("keeps the 2026 Mangzhong KST date and civil-midnight continuity", () => {
    const c = createSajuCalendarContext("2026-06-06T00:48:21+09:00");
    expect(c.solarTermComparisonDateTime).toBe("2026-06-05T23:48:21+08:00");
    expect(monthPillarText(c.pillars.month)).toBe("甲午");
    for (const year of [2024, 2025, 2026, 2027]) {
      const midnight = Date.parse(`${year}-01-01T00:00:00+09:00`);
      const before = createSajuCalendarContext(formatDayunKst(midnight - 1000));
      const after = createSajuCalendarContext(formatDayunKst(midnight));
      expect(before.pillars.month).toEqual(after.pillars.month);
      expect(before.pillars.year).toEqual(after.pillars.year);
      expect(before.pillars.day).not.toEqual(after.pillars.day);
    }
  });
  it("has identical complete segments in UTC, Seoul and New York", () => {
    const script = `const fs=require('node:fs'),ts=require('typescript'),url=require('node:url');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8').replaceAll('import.meta.url',JSON.stringify(url.pathToFileURL(f).href)),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,f);
global.fetch=()=>{throw Error('NETWORK_FORBIDDEN')};
const {buildAnnualMonthCalendar,getAnnualJieBoundaries}=require('./src/lib/report-knowledge/annualMonthJie.ts');
const {calculateCustomerDayun}=require('./src/lib/saju/customerDayun.ts');
const basis=calculateCustomerDayun({birthDate:'1996-12-06',birthTime:'14:15',gender:'MALE'}).value;
process.stdout.write(JSON.stringify([2024,2025,2026,2027].map(selectedYear=>({jie:getAnnualJieBoundaries(selectedYear),months:buildAnnualMonthCalendar({selectedYear,dayMaster:'丁',natalBranches:['子','亥','丑','未'],missingElements:[],heavyElements:[],customerDayun:basis})}))));`;
    const outputs = ["UTC", "Asia/Seoul", "America/New_York"].map(TZ => execFileSync(process.execPath, ["-e", script], { cwd: process.cwd(), env: { ...process.env, TZ }, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
    expect(outputs[1]).toBe(outputs[0]); expect(outputs[2]).toBe(outputs[0]);
    const parsed = JSON.parse(outputs[0]) as { jie: { instantKst: string }[]; months: AnnualCalendarMonth[] }[];
    expect(parsed.flatMap(p => p.jie.map(j => j.instantKst))).toEqual(ANNUAL_JIE_CASES.map(g => g.instantKst));
    parsed.forEach((p, i) => continuity(p.months, 2024 + i));
  });
});

describe("3 customers ×4 years ×12 calendar months", () => {
  const library = createRequire(import.meta.url)("lunar-javascript") as { LunarUtil: { SHI_SHEN: Record<string, string>; ZHI_HIDE_GAN: Record<string, string[]> } };
  const names: Record<string, string> = { 比肩: "비견", 劫财: "겁재", 食神: "식신", 伤官: "상관", 偏财: "편재", 正财: "정재", 七杀: "편관", 正官: "정관", 偏印: "편인", 正印: "정인" };
  it.each(customers.flatMap((_, index) => [2024, 2025, 2026, 2027].map(year => ({ index, year }))))("customer $index / $year publishes and renders", async ({ index, year }) => {
    const r = await generate(index, year), p = r.evidencePacket, months = p.calendarMonths!;
    expect(p.monthlyCalculationVersion).toBe(ANNUAL_MONTH_CALCULATION_VERSION);
    expect(p.monthlyFortunes).toEqual([]); expect(p.monthlyFortuneSeeds).toEqual([]);
    expect(annualMonthlyEvidenceMatches(p)).toBe(true);
    expect(validateNewProductPublication("annual_fortune", r.draft, p).ok).toBe(true);
    continuity(months, year);
    for (const m of months) {
      const golden = ANNUAL_JIE_CASES.find(g => g.year === year && g.month === m.month)!;
      for (const seconds of [-1, 0, 1]) {
        const segment = at(m.segments, formatDayunKst(Date.parse(golden.instantKst) + seconds * 1000));
        expect(monthPillarText(segment.monthPillar)).toBe(seconds < 0 ? golden.before : golden.after);
        expect(monthPillarText(segment.effectiveAnnualPillar)).toBe(seconds < 0 ? golden.beforeYear : golden.afterYear);
      }
      for (const s of m.segments) {
        const util = library.LunarUtil, day = p.baseSaju.dayMaster;
        expect(s.stemTenGod).toBe(names[util.SHI_SHEN[day + s.monthPillar.stem]]);
        expect(s.branchTenGod).toBe(names[util.SHI_SHEN[day + util.ZHI_HIDE_GAN[s.monthPillar.branch][0]]]);
        expect(new Set(s.evidenceIds).size).toBe(s.evidenceIds.length);
        s.relationFacts.forEach(f => {
          expect(s.evidenceIds).toContain(f.id);
          if (f.source === "month_annual_branch") expect(f.counterpart).toEqual({ scope: "annual", pillar: monthPillarText(s.effectiveAnnualPillar) });
          if (f.source === "month_dayun_branch" && f.counterpart.scope === "dayun") expect(s.activeDayunContext.cycles).toContainEqual({ index: f.counterpart.cycleIndex, ganji: f.counterpart.pillar });
        });
      }
      expect(r.draft.monthlyFlow[m.month - 1].monthGanji).toBeNull();
    }
    const html = renderToStaticMarkup(createElement(AnnualFortuneReportView, { draft: r.draft, evidencePacket: p }));
    expect((html.match(/기간별 관계 근거/g) ?? []).length).toBe(months.flatMap(m => m.segments).length);
    expect(text(html)).not.toMatch(/calendar_month_approximation|달력월 기준 운영 가이드|month-v2:/);
    expect(html).toContain("focus-visible");
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });
  it("preserves the audited customer A February facts and both explicit cross sources", async () => {
    const r = await generate(), s = r.evidencePacket.calendarMonths![1].segments;
    expect(s.map(p => monthPillarText(p.monthPillar))).toEqual(["己丑", "庚寅"]);
    expect(s.map(p => [p.stemTenGod, p.branchTenGod])).toEqual([["식신", "식신"], ["정재", "정인"]]);
    expect(s[0].relationFacts).toContainEqual(expect.objectContaining({ source: "month_natal_branch", type: "충", participants: ["丑", "未"] }));
    expect(s[1].relationFacts).toContainEqual(expect.objectContaining({ source: "month_natal_branch", type: "육합", participants: ["寅", "亥"] }));
    expect(s[0].relationFacts).toContainEqual(expect.objectContaining({ source: "month_annual_branch", type: "반합", participants: ["巳", "丑"], counterpart: { scope: "annual", pillar: "乙巳" } }));
    expect(s[1].relationFacts).toContainEqual(expect.objectContaining({ source: "month_annual_branch", type: "반합", participants: ["寅", "午"], counterpart: { scope: "annual", pillar: "丙午" } }));
    const june = r.evidencePacket.calendarMonths![5].segments[1].relationFacts;
    expect(june).toContainEqual(expect.objectContaining({ source: "month_annual_branch", type: "형", participants: ["午", "午"], counterpart: { scope: "annual", pillar: "丙午" } }));
    expect(june).toContainEqual(expect.objectContaining({ source: "month_dayun_branch", type: "반합", participants: ["寅", "午"], counterpart: { scope: "dayun", cycleIndex: 3, pillar: "壬寅" } }));
    expect(s.flatMap(p => p.relationFacts)).not.toContainEqual(expect.objectContaining({ source: "month_natal_branch", type: "삼합", participants: ["亥", "卯", "未"] }));
    const all = r.evidencePacket.calendarMonths!.flatMap(m => m.segments.flatMap(s => s.relationFacts));
    expect(all.some(f => f.source === "month_annual_branch")).toBe(true);
    expect(all.some(f => f.source === "month_dayun_branch")).toBe(true);
  });
});

describe("Dayun boundary and precision", () => {
  it.each([
    { index: 0, year: 2027, month: 2, time: "2027-02-21T12:15:00+09:00", before: "壬寅", after: "癸卯" },
    { index: 2, year: 2025, month: 12, time: "2025-12-03T00:20:00+09:00", before: "甲午", after: "癸巳" },
  ])("splits $time without changing Dayun calculation", async g => {
    const r = await generate(g.index, g.year), m = r.evidencePacket.calendarMonths![g.month - 1];
    expect(m.segments).toHaveLength(3);
    expect(at(m.segments, formatDayunKst(Date.parse(g.time) - 1000)).activeDayunContext.cycles[0].ganji).toBe(g.before);
    expect(at(m.segments, g.time).activeDayunContext.cycles[0].ganji).toBe(g.after);
    expect(at(m.segments, g.time).boundaryReason).toContain("dayun_transition");
    expect(m.importanceCandidates.some(c => c.kind === "transition")).toBe(true);
  });
  it.each(["approximate", "unknown"] as const)("retains %s transition candidates across all affected months", async precision => {
    const r = await generate(0, 2027, { birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: precision === "unknown", approximateBirthTimeSlot: precision === "approximate" ? "JINSI" : "" });
    const months = r.evidencePacket.calendarMonths!, all = months.flatMap(m => m.segments);
    const start = precision === "approximate" ? "2027-05-13T07:00:00+09:00" : "2027-04-08T00:00:00+09:00";
    const end = precision === "approximate" ? "2027-05-23T06:59:59+09:00" : "2027-08-08T21:59:59+09:00";
    expect(at(all, start).activeDayunContext).toMatchObject({ status: "transition_uncertain", transitionRange: { earliestKst: start, latestKst: end }, cycles: [{ ganji: "己巳" }, { ganji: "戊辰" }] });
    expect(at(all, end).activeDayunContext).toMatchObject({ status: "active", cycles: [{ ganji: "戊辰" }] });
    const uncertain = all.filter(s => s.uncertainty.length);
    expect(uncertain.length).toBeGreaterThan(0);
    const conditional = uncertain.flatMap(s => s.relationFacts).filter(f => f.source === "month_dayun_branch");
    // May's 巳 has no validated pair relation with either 巳 or 辰. Uncertainty
    // alone must not invent a relation; the wider unknown range has real pairs.
    if (precision === "approximate") expect(conditional).toEqual([]);
    else expect(conditional.length).toBeGreaterThan(0);
    expect(conditional.every(f => f.certainty === "conditional")).toBe(true);
    expect(validateNewProductPublication("annual_fortune", r.draft, r.evidencePacket).ok).toBe(true);
    continuity(months, 2027);
  });
  it("retains the first-cycle pre-start interval without inventing a cycle", () => {
    const r = calculateCustomerDayun({ birthDate: "1999-07-31", birthTime: "07:30", gender: "MALE" });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const months = buildAnnualMonthCalendar({ selectedYear: r.value.cycles[0].startYear, customerDayun: r.value, dayMaster: "甲", natalBranches: [], missingElements: [], heavyElements: [] });
    expect(months[0].segments[0].activeDayunContext).toMatchObject({ status: "before_first_cycle", cycles: [], includesBeforeFirstCycle: true });
  });
});

describe("V2 tamper gate, writer and immutable legacy read", () => {
  it("rejects missing/version/year/gap/overlap/pillar/Dayun/ten-god/source/uncertainty tampering", async () => {
    const r = await generate();
    type Mutable = { [key: string]: unknown };
    const cases: [string, unknown][] = [
      ["monthlyCalculationVersion", undefined], ["monthlyCalculationVersion", "v3"], ["selectedYear", 2025],
      ["calendarMonths", []], ["calendarMonths.0.month", 2], ["calendarMonths.0.startKst", "2026-01-02T00:00:00+09:00"],
      ["calendarMonths.0.segments.0.endKstExclusive", "2026-01-05T17:23:09+09:00"],
      ["calendarMonths.0.segments.1.startKst", "2026-01-05T17:23:09+09:00"],
      ["calendarMonths.0.segments.1.boundaryReason", []], ["calendarMonths.0.segments.1.monthPillar.stem", "甲"],
      ["calendarMonths.0.segments.1.effectiveAnnualPillar.stem", "甲"], ["calendarMonths.0.segments.1.activeDayunContext.cycles", []],
      ["calendarMonths.0.segments.1.stemTenGod", "비견"], ["calendarMonths.0.segments.1.branchTenGod", "비견"],
      ["calendarMonths.0.segments.1.relationFacts.0.source", "month_annual_branch"],
      ["calendarMonths.0.segments.1.relationFacts.0.participants", []], ["calendarMonths.0.segments.1.evidenceIds", []],
      ["calendarMonths.0.segments.1.uncertainty", [{ kind: "dayun_transition" }]],
    ];
    for (const [path, value] of cases) {
      const copy = structuredClone(r.evidencePacket) as unknown as Mutable;
      const keys = path.split("."); let node = copy;
      for (const k of keys.slice(0, -1)) node = node[k] as Mutable;
      if (value === undefined) delete node[keys.at(-1)!]; else node[keys.at(-1)!] = value;
      expect(validateNewProductPublication("annual_fortune", r.draft, copy).ok, path).toBe(false);
    }
    const uncertain = await generate(0, 2027, { birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: true });
    const p = structuredClone(uncertain.evidencePacket);
    p.calendarMonths!.flatMap(m => m.segments).find(s => s.uncertainty.length)!.uncertainty = [];
    expect(validateNewProductPublication("annual_fortune", uncertain.draft, p).ok).toBe(false);
    const promoted = structuredClone(uncertain.evidencePacket);
    const conditional = promoted.calendarMonths!.flatMap(m => m.segments.flatMap(s => s.relationFacts)).find(f => f.certainty === "conditional")!;
    conditional.certainty = "confirmed";
    expect(validateNewProductPublication("annual_fortune", uncertain.draft, promoted).ok).toBe(false);
  });
  it("reads V2 JSONB key order without mutation or a new commerce-year check", async () => {
    const r = await generate(0, 2024);
    const reverseKeys = (v: unknown): unknown => Array.isArray(v) ? v.map(reverseKeys) : v !== null && typeof v === "object"
      ? Object.fromEntries(Object.entries(v).reverse().map(([k, x]) => [k, reverseKeys(x)])) : v;
    const snapshot = reverseKeys({ reportId: "v2-report", productType: "annual_fortune", draft: r.draft, evidencePacket: r.evidencePacket });
    const frozen = JSON.stringify(snapshot);
    const call = vi.fn(async () => ({ ok: true, status: "COMPLETED", snapshot }));
    const result = await readPublishedReport({ call } as unknown as ReliabilityStore, "v2-report");
    expect(result.status).toBe("COMPLETED"); expect(JSON.stringify(snapshot)).toBe(frozen);
    expect(call.mock.calls).toEqual([["read_report", { reportId: "v2-report" }]]);
  });
  it("uses the same exact publication in a mock writer and rejects a representative month pillar", async () => {
    const r = await generate();
    const request = (draft: unknown) => generateAnnualFortuneReportDraft({ evidencePacket: r.evidencePacket,
      config: { enabled: true, apiKey: "test-only", model: "mock", fetchImpl: vi.fn(async () => new Response(JSON.stringify({ output_text: JSON.stringify(draft) }), { status: 200 })) } });
    expect((await request(r.draft)).draft.monthlyFlow).toEqual(r.draft.monthlyFlow);
    const copy = structuredClone(r.draft); (copy.monthlyFlow[1] as { monthGanji: string | null }).monthGanji = "庚寅";
    await expect(request(copy)).rejects.toMatchObject({ code: "OPENAI_ANNUAL_FORTUNE_REPORT_WRITER_VALIDATION_FAILED" });
    const prompt = buildOpenAIAnnualFortuneReportWriterMessages({ evidencePacket: r.evidencePacket });
    expect(prompt.user).toContain("calendarMonths"); expect(prompt.developer).toContain("Conditional Dayun facts");
    expect(JSON.stringify(prompt)).not.toContain("calendar_month_approximation");
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });
  it("reads frozen V1 without backfill/quarantine, but cannot newly publish it", async () => {
    const r = await generate();
    const v2Calculation = vi.spyOn(monthlyEngine, "buildAnnualMonthCalendar");
    const { monthlyCalculationVersion: _v, calendarMonths: _m, ...base } = r.evidencePacket; void _v; void _m;
    const evidence = { ...base, monthlyFortunes: legacy.monthlyFortunes, monthlyFortuneSeeds: legacy.monthlyFortuneSeeds } as AnnualFortuneEvidencePacket;
    const validated = validateAnnualFortuneReportDraft({ ...r.draft, ...legacy.publication }, evidence);
    expect(validated.ok).toBe(true);
    const draft = { ...validated.value!, dayunContext: r.draft.dayunContext };
    expect(validateProductPublication("annual_fortune", draft, evidence).ok).toBe(true);
    expect(validateNewProductPublication("annual_fortune", draft, evidence).errors).toContain("ANNUAL_MONTH_V2_REQUIRED");
    const snapshot = { reportId: "legacy-report", productType: "annual_fortune", draft, evidencePacket: evidence };
    const frozen = JSON.stringify(snapshot);
    const call = vi.fn(async () => ({ ok: true, status: "COMPLETED", snapshot }));
    const result = await readPublishedReport({ call } as unknown as ReliabilityStore, "legacy-report");
    expect(result.status).toBe("COMPLETED"); expect(JSON.stringify(snapshot)).toBe(frozen);
    expect(call.mock.calls).toEqual([["read_report", { reportId: "legacy-report" }]]);
    expect(v2Calculation).not.toHaveBeenCalled();
    v2Calculation.mockRestore();
  });
});
