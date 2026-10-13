import { readFileSync, writeFileSync } from "node:fs";
import { afterAll, expect, it } from "vitest";
import { generateV4ShadowReport, type V4ShadowClock } from "@/lib/interpretation-v4/runtimeShadow";
import { v4Digest, validateV4Publication, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "@/app/dev/book-preview/bookProjection";
import { getAnnualJieBoundaries, buildAnnualMonthCalendar, monthPillarText, type AnnualCalendarMonth } from "@/lib/report-knowledge/annualMonthJie";
import { annualSegmentAt } from "@/lib/report-knowledge/annualMonthExtendedEvidence";
import { calculateCustomerDayun, formatDayunKst } from "@/lib/saju/customerDayun";
import { createSajuCalendarContext } from "@/lib/saju/lunarJavascriptPillars";
import { getTenGodForStemPair, getAnnualFortuneCommerceYearPolicy } from "@/lib/report-knowledge/annualFortuneYearRules";
import { ANNUAL_JIE_CASES } from "../../fixtures/saju/annualJieBoundaryGoldens";

const doc = "docs/validation/v4-annual-fortune-product-knowledge-01/";
type Case = { id: string; purpose: string; payload: unknown; clock: V4ShadowClock; expectation: "success" | "failure" };
const cases = JSON.parse(readFileSync(doc + "input-cases.json", "utf8")) as Case[];
const observations: unknown[] = [];
afterAll(() => {
  if (process.env.ANNUAL_RESEARCH_CAPTURE) writeFileSync(process.env.ANNUAL_RESEARCH_CAPTURE, JSON.stringify(observations, null, 2) + "\n");
});
function continuous(months: readonly AnnualCalendarMonth[], year: number) {
  expect(months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  const segments = months.flatMap(m => m.segments);
  expect(segments[0].startKst).toBe(`${year}-01-01T00:00:00+09:00`);
  expect(segments.at(-1)!.endKstExclusive).toBe(`${year + 1}-01-01T00:00:00+09:00`);
  for (const [i, s] of segments.entries()) {
    expect(Date.parse(s.startKst)).toBeLessThan(Date.parse(s.endKstExclusive));
    if (i) expect(s.startKst).toBe(segments[i - 1].endKstExclusive);
    expect(annualSegmentAt(months, s.startKst)).toBe(s);
    expect(annualSegmentAt(months, formatDayunKst(Date.parse(s.endKstExclusive) - 1000))).toBe(s);
    expect(annualSegmentAt(months, s.endKstExclusive)).not.toBe(s);
  }
}
it.each(cases)("$id: actual offline publication and all segments retain exact digests", async c => {
  const g = await generateV4ShadowReport(c.payload, c.clock);
  expect(g.externalCalls).toEqual([]);
  expect(g.ok).toBe(c.expectation === "success");
  if (!g.ok) {
    const failure = { id: c.id, error: g.error };
    observations.push(failure);
    if (process.env.ANNUAL_RESEARCH_BASELINE !== "1") {
      expect((JSON.parse(readFileSync(doc + "baseline-generation.json", "utf8")) as { id: string }[]).find(r => r.id === c.id)).toEqual(failure);
    }
    return;
  }
  const packet = g.evidencePacket as V4RuntimeEvidence;
  expect(packet.composition.product).toBe("annual_fortune");
  if (packet.composition.product !== "annual_fortune") return;
  const r = packet.composition.result, e = r.evidence;
  continuous(e.raw.calendarMonths!, e.selectedYear);
  expect(r.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
  for (const s of e.segments) {
    const canonical = createSajuCalendarContext(s.startKst).pillars;
    expect(s.monthPillar).toEqual(canonical.month); expect(s.effectiveAnnualPillar).toEqual(canonical.year);
    expect(s.stemTenGod).toBe(getTenGodForStemPair(e.raw.dayMaster, s.monthPillar.stem));
    for (const f of s.relationFacts) {
      expect(s.evidenceIds).toContain(f.id);
      if (f.source === "month_natal_element") continue;
      expect(f.monthBranch).toBe(s.monthPillar.branch);
      expect(f.participants).toContain(s.monthPillar.branch);
      if (f.source === "month_natal_branch") {
        for (const p of f.affectedPillars) expect(f.participants).toContain(e.calculation.pillars[p]?.branch);
      } else if (f.source === "month_annual_branch") {
        expect(f.counterpart.pillar).toBe(monthPillarText(s.effectiveAnnualPillar));
      } else {
        expect(f.counterpart.scope).toBe("dayun");
        if (f.counterpart.scope === "dayun") expect(s.activeDayunContext.cycles).toContainEqual({ index: f.counterpart.cycleIndex, ganji: f.counterpart.pillar });
        expect(f.certainty).toBe(s.activeDayunContext.status === "transition_uncertain" ? "conditional" : "confirmed");
      }
    }
  }
  expect(validateV4Publication(packet.productType, g.draft, packet).ok).toBe(true);
  const book = projectBook(packet); expect(book).toBeTruthy();
  const observation = { id: c.id, selectedYear: e.selectedYear, time: e.time, annualGanji: e.raw.annualGanji,
    hashes: { calculation: v4Digest(packet.calculations), evidence: v4Digest(packet), draft: v4Digest(g.draft), narrative: v4Digest(r.narrative), book: v4Digest(book) },
    dayMaster: e.raw.dayMaster, calculation: e.calculation, annualStemRelations: e.annualStemRelations,
    annualNatalRelations: e.raw.natalAnnualRelations, calendar: e.raw.calendarMonths, extension: e.monthly,
    crossPeriods: e.crossPeriods, narrative: r.narrative,
    selectedNatal: e.materials.selected.map(m => ({ feature: m.feature, evidence: m.evidence, seedIds: m.material.seeds.map(s => s.id) })),
    availableFusionIds: e.materials.fusions.map(f => f.ruleId),
    integration: "integration" in r ? r.integration : null,
    months: r.months.map(m => ({ ...m, acceptedTransit: e.months[m.month - 1].transit.accepted, heldTransit: e.months[m.month - 1].transit.held })) };
  observations.push(observation);
  if (process.env.ANNUAL_RESEARCH_BASELINE !== "1") {
    const baseline = JSON.parse(readFileSync(doc + "baseline-generation.json", "utf8")) as { id: string }[];
    expect(observation).toEqual(baseline.find(r => r.id === c.id));
  }
}, 120000);

it("preserves the six-year commerce window and exact Ipchun / ordinary Jie instants", () => {
  expect(getAnnualFortuneCommerceYearPolicy(new Date("2026-10-12T12:00:00+09:00")).selectableYears).toEqual([2021, 2022, 2023, 2024, 2025, 2026]);
  const selected = ANNUAL_JIE_CASES.filter(g => g.year === 2026 && [2, 6].includes(g.month));
  expect(selected).toHaveLength(2);
  for (const g of selected) {
    expect(getAnnualJieBoundaries(g.year)[g.month - 1].instantKst).toBe(g.instantKst);
    for (const delta of [-1000, 0, 1000]) {
      const p = createSajuCalendarContext(formatDayunKst(Date.parse(g.instantKst) + delta)).pillars;
      expect(monthPillarText(p.month)).toBe(delta < 0 ? g.before : g.after);
      expect(monthPillarText(p.year)).toBe(delta < 0 ? g.beforeYear : g.afterYear);
    }
  }
  observations.push({ id: "commerce-and-jie-boundaries", policy: [2021, 2022, 2023, 2024, 2025, 2026], goldens: selected });
});

it("preserves exact/ranged Dayun and pre-first segments without fixing every civil month to two segments", () => {
  const build = (birthDate: string, birthTime: string, unknown: boolean, year: number) => {
    const calc = calculateCustomerDayun({ birthDate, birthTime, gender: "MALE", birthTimeUnknown: unknown });
    expect(calc.ok).toBe(true); if (!calc.ok) return [];
    const natal = calc.value.calendarContext.confirmed;
    return buildAnnualMonthCalendar({ selectedYear: year, customerDayun: calc.value, dayMaster: natal.day!.stem,
      natalBranches: [natal.year!.branch, natal.month!.branch, natal.day!.branch, ...(natal.hour ? [natal.hour.branch] : [])], missingElements: [], heavyElements: [] });
  };
  const exact = build("2001-06-22", "13:30", false, 2026);
  continuous(exact, 2026); expect(exact[11].segments.length).toBeGreaterThan(2);
  const t = "2026-12-30T15:30:00+09:00";
  expect([-1000, 0, 1000].map(delta => annualSegmentAt(exact, formatDayunKst(Date.parse(t) + delta))!.activeDayunContext.cycles[0].index)).toEqual([2, 3, 3]);
  const range = build("1999-07-31", "", true, 2027);
  continuous(range, 2027); expect(range.some(m => m.segments.length > 2)).toBe(true);
  const uncertain = range.flatMap(m => m.segments).filter(s => s.activeDayunContext.status === "transition_uncertain");
  expect(uncertain.length).toBeGreaterThan(0); expect(uncertain.every(s => s.activeDayunContext.cycles.length === 2)).toBe(true);
  const boundary = uncertain[0].activeDayunContext.transitionRange!;
  expect(annualSegmentAt(range, boundary.earliestKst)!.activeDayunContext.status).toBe("transition_uncertain");
  expect(annualSegmentAt(range, boundary.latestKst)!.activeDayunContext.status).toBe("active");
  const august = range[7].segments;
  expect(august).toHaveLength(3);
  expect(august[1].boundaryReason).toContain("jie:입추");
  expect(august[2].boundaryReason).toContain("dayun_uncertainty_end");
  // These are actual separate producer boundaries, less than a day apart.
  expect(Date.parse(august[2].startKst) - Date.parse(august[1].startKst)).toBeLessThan(86400000);
  const before = build("1999-07-31", "07:30", false, 2000);
  continuous(before, 2000); expect(before.flatMap(m => m.segments).every(s => s.activeDayunContext.status === "before_first_cycle")).toBe(true);
  expect(before.flatMap(m => m.segments).flatMap(s => s.relationFacts).some(f => f.source === "month_dayun_branch")).toBe(false);
  observations.push({ id: "dayun-low-level-boundaries", exact, range, before, birthInputNoSyntheticCycle: true });
});
