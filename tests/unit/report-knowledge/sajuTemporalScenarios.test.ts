import { beforeAll, describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { calculateCustomerDayun, selectCustomerDayun, formatDayunKst } from "@/lib/saju/customerDayun";
import { createSajuCalendarContext } from "@/lib/saju/lunarJavascriptPillars";
import { buildAnnualMonthCalendar, getAnnualJieBoundaries } from "@/lib/report-knowledge/annualMonthJie";
import { getBranchPairRelations, getTenGodForStemPair, getAnnualBranchInteractions } from "@/lib/report-knowledge/annualFortuneYearRules";
import { majorNarrativeEvidence, type MajorEvidence } from "@/lib/interpretation-v4/majorEvidence";
import { annualNarrativeEvidence, annualPeriodTime, annualTransitMaterials, type AnnualEvidence } from "@/lib/interpretation-v4/annualEvidence";
import { MAJOR_SAFETY_CASES } from "../interpretation-v4/majorEditorialSafetyFixtures";
import locks from "../../fixtures/six-product-integration-01/source-locks.json";
import { v4Digest } from "@/lib/interpretation-v4/runtimeProjection";

import frozen from "../../fixtures/temporal-interaction-01/offline-periods.json";

const NOW = "2026-10-12T12:00:00+09:00";
const exact = { name: "경계 검수", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE" };
const dayun = calculateCustomerDayun(exact);
if (!dayun.ok) throw new Error("existing exact fixture failed");
const context = createSajuCalendarContext("1996-12-06T14:15:00+09:00");
const calendar = (year: number, d = dayun.value) => buildAnnualMonthCalendar({ selectedYear: year, dayMaster: context.pillars.day.stem,
  natalBranches: Object.values(context.pillars).map(p => p.branch), missingElements: [], heavyElements: [], customerDayun: d });
const majors: MajorEvidence[] = [], annuals: AnnualEvidence[] = [];
beforeAll(async () => {
  for (const f of MAJOR_SAFETY_CASES.slice(0, 3)) {
    const r = await majorNarrativeEvidence(f.payload, NOW); expect(r.ok).toBe(true); if (r.ok) majors.push(r);
  }
  for (const id of ["A", "B", "C"]) {
    const f = locks.find(f => f.product === "annual" && f.id === id)!;
    const r = await annualNarrativeEvidence(f.payload, { currentDate: NOW }); expect(r.ok).toBe(true); if (r.ok) annuals.push(r);
  }
  // Explicit offline audit output only; no fixture/source/database writes.
  const output = { evaluatedAt: NOW,
    major: majors.map((m, i) => ({ id: "ABC"[i], input: MAJOR_SAFETY_CASES[i].payload, dayMaster: m.calculation.pillars.day.stem,
      horizon: m.horizon, years: m.years.map(y => ({ year: y.year, cycle: y.cycle, beforeCycle: y.beforeCycle, transitionDate: y.transitionDate,
        timePosition: y.timePosition, annual: { ganji: y.annual.ganji, tenGod: y.annual.tenGod, stemElement: y.annual.stemElement,
          branchElement: y.annual.branchElement, cycleRelations: y.annual.cycleRelations, natalRelations: y.annual.natalRelations, evidenceIds: y.annual.evidenceIds } })) })),
    annual: annuals.map((a, i) => ({ id: "ABC"[i], input: a.input, selectedYear: a.selectedYear, months: a.raw.calendarMonths,
      crossPeriods: a.crossPeriods, annualStemRelations: a.annualStemRelations, calculationDigest: v4Digest(a.calculation) })) };
  expect(output).toEqual(frozen);
  mkdirSync("/tmp/gyeol-saju-temporal-validation", { recursive: true });
  writeFileSync("/tmp/gyeol-saju-temporal-validation/offline-periods.json", JSON.stringify(output, null, 2));
}, 120000);

describe("temporal A–V: existing producers, not a new calendar or rule engine", () => {
  it("A/E: exact birth and a non-transition year preserve one active cycle", () => {
    expect(dayun.value.precision).toBe("exact");
    expect(calendar(2026).flatMap(m => m.segments).every(s => s.activeDayunContext.status === "active")).toBe(true);
    expect(new Set(calendar(2026).flatMap(m => m.segments).map(s => s.activeDayunContext.cycles[0].ganji)).size).toBe(1);
  });
  it("B/C: actual exact transition has three February segments and no fixed delay", () => {
    const feb = calendar(2027)[1].segments;
    expect(feb).toHaveLength(3);
    expect(feb[2].startKst).toBe("2027-02-21T12:15:00+09:00");
    expect(feb[1].endKstExclusive).toBe(feb[2].startKst);
    expect(feb[1].activeDayunContext.cycles[0].ganji).toBe("壬寅");
    expect(feb[2].activeDayunContext.cycles[0].ganji).toBe("癸卯");
  });
  it("D/F: unknown time can be stable but ranged; a separate unstable case is refused", () => {
    const d = calculateCustomerDayun({ ...exact, birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: true });
    expect(d.ok).toBe(true); if (!d.ok) return;
    expect(d.value.startSolarKst).toBeNull();
    const segments = calendar(2027, d.value).flatMap(m => m.segments);
    const uncertain = segments.filter(s => s.activeDayunContext.status === "transition_uncertain");
    expect(uncertain.length).toBeGreaterThan(0);
    const range = uncertain[0].activeDayunContext.transitionRange!;
    const at = (t: string) => segments.find(s => Date.parse(s.startKst) <= Date.parse(t) && Date.parse(t) < Date.parse(s.endKstExclusive))!;
    expect(at(range.earliestKst).activeDayunContext.cycles).toHaveLength(2);
    expect(at(range.latestKst).activeDayunContext.status).toBe("active");
    expect(uncertain.flatMap(s => s.relationFacts).filter(f => f.source === "month_dayun_branch").every(f => f.certainty === "conditional")).toBe(true);
    expect(selectCustomerDayun(d.value, 2027, new Date("2027-06-01T12:00:00+09:00"))).toMatchObject({ ok: true, value: { activeCycleAtEvaluation: null } });
    expect(calculateCustomerDayun({ ...exact, birthDate: "2024-02-04", birthTime: "", birthTimeUnknown: true })).toEqual({ ok: false, error: "DAYUN_UNCERTAIN" });
  });
  it("G: before the first cycle has no invented Dayun counterpart", () => {
    const first = calendar(1997).flatMap(m => m.segments).filter(s => s.activeDayunContext.status === "before_first_cycle");
    expect(first.length).toBeGreaterThan(0);
    expect(first.every(s => s.activeDayunContext.cycles.length === 0 && s.relationFacts.every(f => f.source !== "month_dayun_branch"))).toBe(true);
  });
  it("H/I: same and different ten gods have actual identical natal reference; flowGod is separate", () => {
    const a = majors[0], same = a.years.find(y => y.year === 2028)!;
    expect(same.cycle.tenGod).toBe("편인"); expect(same.annual.tenGod).toBe("편인");
    expect(a.years.some(y => y.annual.tenGod !== y.cycle.tenGod)).toBe(true);
    for (const annual of annuals) for (const p of annual.crossPeriods) for (const c of p.cycles) {
      expect(c.god).toBe(getTenGodForStemPair(annual.raw.dayMaster, c.cycle.stem));
      expect(p.annualGod).toBe(getTenGodForStemPair(annual.raw.dayMaster, p.segment.effectiveAnnualPillar.stem));
      expect(c.flowGod).toBe(getTenGodForStemPair(c.cycle.stem, p.segment.effectiveAnnualPillar.stem));
    }
    expect(annuals.flatMap(a => a.crossPeriods).some(p => p.cycles.some(c => c.flowGod !== p.annualGod))).toBe(true);
  });
  it("J/K/L/M: genuine natal harmony, clash, absence and multiple owners", () => {
    const a = majors[0].years.find(y => y.year === 2028)!.annual;
    expect(a.natalRelations.some(r => r.type === "반합" && r.branches.join("") === "申子")).toBe(true);
    expect(a.cycleRelations.map(r => r.type)).toEqual(expect.arrayContaining(["충", "형"]));
    expect(majors.some(m => m.years.some(y => y.annual.natalRelations.some(r => r.type === "충")))).toBe(true);
    const none = majors[1].years.find(y => y.year === 2028)!.annual;
    expect(none.cycleRelations).toEqual([]); expect(none.natalRelations).toEqual([]);
    expect(getAnnualBranchInteractions({ annualBranch: "巳", natalBranches: ["申"] }).some(r => r.type === "육합")).toBe(true);
  });
  it("N/P: Jie and effective year boundaries use half-open time, including exact Lichun", () => {
    for (const j of getAnnualJieBoundaries(2026)) {
      const before = createSajuCalendarContext(formatDayunKst(Date.parse(j.instantKst) - 1000)).pillars;
      const after = createSajuCalendarContext(j.instantKst).pillars;
      expect(before.month).not.toEqual(after.month);
      if (j.name === "입춘") expect(before.year).not.toEqual(after.year);
    }
    const feb = calendar(2026)[1].segments;
    expect(feb.map(s => s.effectiveAnnualPillar.stem + s.effectiveAnnualPillar.branch)).toEqual(["乙巳", "丙午"]);
    expect(calendar(2026)[0].segments[0].effectiveAnnualPillar).toEqual(feb[0].effectiveAnnualPillar);
  });
  it("O: close but genuinely distinct December Jie and Dayun boundaries remain separate", () => {
    const d = calculateCustomerDayun({ ...exact, birthDate: "2001-08-20", birthTime: "16:20" });
    expect(d.ok).toBe(true); if (!d.ok) return;
    const dec = calendar(2025, d.value)[11].segments;
    expect(dec).toHaveLength(3);
    expect(dec[1].startKst).toBe("2025-12-03T00:20:00+09:00");
    const jie = getAnnualJieBoundaries(2025).find(j => j.name === "대설")!;
    expect(dec[2].startKst).toBe(jie.instantKst);
    expect(Date.parse(jie.instantKst) - Date.parse(dec[1].startKst)).toBeLessThan(5 * 86400000);
  });
  it("Q/R/V: three real 14-year arrays and three 12-month arrays retain distinct evidence", () => {
    for (const m of majors) {
      expect(m.years).toHaveLength(14);
      expect(m.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
      expect(m.years.every(y => y.annual.evidenceIds.length > 0)).toBe(true);
    }
    expect(new Set(majors.map(m => v4Digest(m.years.map(y => [y.cycle, y.annual.tenGod, y.annual.natalRelations])))).size).toBe(3);
    for (const a of annuals) expect(a.raw.calendarMonths!.map(m => m.month)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]);
    const signatures = annuals.map(a => v4Digest(a.raw.calendarMonths!.map(m => m.segments.map(s => [s.stemTenGod, s.relationFacts]))));
    expect(new Set(signatures).size).toBe(3);
    expect(calendar(2026)).not.toEqual(calendar(2027));
  });
  it("S: unsupported triples and transit observations do not become approved facts", () => {
    expect(getBranchPairRelations("申", "子").some(r => r.type === "삼합")).toBe(false);
    expect(getBranchPairRelations("申", "子").some(r => r.type === "반합")).toBe(true);
    const held = annualTransitMaterials([{ id: "offline-held", code: "banghap", label: "방합", kind: "relation",
      basis: { anchor: "natal.day.branch", anchorValue: "申", target: "month.branch", targetValue: "子", rule: "unsupported" }, sourceRefs: ["calendarMonths:1"] }]);
    expect(held.accepted).toEqual([]); expect(held.held[0].reason).toBe("UNSUPPORTED_TRANSIT");
  });
  it("T: duplicate projection retains observations but never increments an effect score", () => {
    const f = annuals[0].months.flatMap(m => m.extension.features).find(f => f.kind === "lifeStage")!;
    const r = annualTransitMaterials([f, { ...f, id: f.id + ":second-source" }]);
    expect(r.accepted).toHaveLength(1); expect(r.accepted[0].observations).toHaveLength(2);
    expect(r.accepted[0]).not.toHaveProperty("score");
  });
  it("U: actual past/current/future distinctions never assert a past event", () => {
    expect(majors[0].years.map(y => y.timePosition)).toEqual(["past","past","past","current", ...Array(10).fill("future")]);
    expect(annualPeriodTime("2026-10-01T00:00:00+09:00", "2026-11-01T00:00:00+09:00", NOW)).toBe("current");
    expect(annualPeriodTime("2026-01-01T00:00:00+09:00", "2026-02-01T00:00:00+09:00", NOW)).toBe("past");
    expect(annualPeriodTime("2026-11-01T00:00:00+09:00", "2026-12-01T00:00:00+09:00", NOW)).toBe("future");
  });
});
