import { readFileSync, writeFileSync } from "node:fs";
import { afterAll, expect, it } from "vitest";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { validateV4Publication, v4Digest, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { projectBook } from "@/app/dev/book-preview/bookProjection";
import { calculateCustomerDayun, selectCustomerDayun } from "@/lib/saju/customerDayun";
import { getAnnualGanjiInfo, getTenGodForStemPair } from "@/lib/report-knowledge/annualFortuneYearRules";
import { composeMajorFortuneNarrative } from "@/lib/interpretation-v4/majorComposer";
import { MAJOR_SAFETY_CASES, MAJOR_SAFETY_CLOCK } from "../interpretation-v4/majorEditorialSafetyFixtures";

const doc = "docs/validation/v4-major-fortune-product-knowledge-01/";
const observations: unknown[] = [];
afterAll(() => {
  if (process.env.MAJOR_RESEARCH_CAPTURE) writeFileSync(process.env.MAJOR_RESEARCH_CAPTURE, JSON.stringify(observations, null, 2) + "\n");
});
it.each(MAJOR_SAFETY_CASES)("$id preserves actual 14-year generation, calculation, evidence, narrative and Book", async c => {
  const generated = await generateV4ShadowReport(c.payload, MAJOR_SAFETY_CLOCK);
  expect(generated.externalCalls).toEqual([]);
  expect(generated.ok).toBe(true);
  if (!generated.ok) return;
  const evidence = generated.evidencePacket as V4RuntimeEvidence;
  expect(evidence.composition.product).toBe("major_fortune");
  if (evidence.composition.product !== "major_fortune") return;
  const result = evidence.composition.result, e = result.evidence;
  expect(result.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => e.currentYear - 3 + i));
  expect(e.horizon.through - e.horizon.from + 1).toBe(14);
  // Fully covered 14 calendar years cannot fit inside one 10-year cycle.
  expect(new Set(result.years.map(y => y.cycle.index)).size).toBeGreaterThan(1);
  expect(e.horizon.transitions.length).toBeGreaterThan(0);
  expect(result.years.some(y => !e.horizon.transitions.some(t => t.year === y.year))).toBe(true);
  expect(new Set(result.years.map(y => y.annual.tenGod)).size).toBeLessThan(14);
  expect(new Set(result.years.map(y => y.timePosition))).toEqual(new Set(["past", "current", "future"]));
  for (const y of result.years) {
    const info = getAnnualGanjiInfo(y.year);
    expect(y.annual.ganji).toBe(info.ganji);
    expect(y.annual.tenGod).toBe(getTenGodForStemPair(e.calculation.pillars.day.stem, info.stem));
    expect(y.cycle.startYear <= y.year && y.year <= y.cycle.endYear).toBe(true);
    expect(y.annual.evidenceIds).toContain(`major:${y.cycle.index}:${y.cycle.ganji}:year:${y.year}:${y.annual.ganji}`);
    for (const relation of y.annual.cycleRelations) {
      expect(relation.branches).toContain(y.cycle.ganji.slice(-1));
      expect(relation.branches).toContain(y.annual.ganji.slice(-1));
    }
    for (const relation of y.annual.natalRelations) {
      for (const position of relation.affectedPillars ?? []) expect(relation.branches).toContain(e.calculation.pillars[position]?.branch);
      if (c.payload.person.birthTimeUnknown) expect(relation.affectedPillars).not.toContain("hour");
    }
    const transition = e.horizon.transitions.find(t => t.year === y.year);
    if (transition) expect(y.blocks.map(b => b.text).join(" ")).toContain("전환이 완료된 뒤");
  }
  if (!c.payload.person.mbtiType) expect(evidence.mbtiTables.person).toBeNull();
  expect(validateV4Publication(evidence.productType, generated.draft, evidence).ok).toBe(true);
  const book = projectBook(evidence);
  expect(book).toBeTruthy();
  const observation = { id: c.id, hashes: { calculation: v4Digest(evidence.calculations), evidence: v4Digest(evidence),
    draft: v4Digest(generated.draft), narrative: v4Digest(result.narrative), book: v4Digest(book) },
    currentYear: e.currentYear, active: e.horizon.activeCycle, transitions: e.horizon.transitions,
    precision: e.precision, majorNatal: e.majorNatal,
    candidateAudit: {
      selectedNatalMaterials: e.materials.selected.map(m => ({ feature: m.feature, evidence: m.evidence,
        availableSeedIds: m.material.seeds.map(s => s.id) })),
      availableFusionIds: e.materials.fusions.map(f => f.ruleId),
      displayedProofs: [...result.narrative.opening, ...result.narrative.sections.flatMap(s => s.blocks)]
        .map(b => ({ blockId: b.id, proof: b.proof })),
      timeIntegration: "integration" in result ? result.integration : null,
      distinction: "Selected/available sources are not all displayed; repeated proof roots are not independent facts.",
    },
    years: result.years.map(y => ({ year: y.year, timePosition: y.timePosition, cycle: y.cycle, annual: y.annual,
      title: y.title, blocks: y.blocks })) };
  observations.push(observation);
  if (process.env.MAJOR_RESEARCH_BASELINE !== "1") {
    const baseline = JSON.parse(readFileSync(doc + "baseline-generation.json", "utf8")) as { id: string }[];
    expect(observation).toEqual(baseline.find(r => r.id === c.id));
  }
}, 120000);

it("retains exact boundary just before, at and after rather than selecting by calendar year", () => {
  const calculated = calculateCustomerDayun({ birthDate: "2001-06-22", birthTime: "13:30", gender: "MALE" });
  expect(calculated.ok).toBe(true); if (!calculated.ok) return;
  expect(calculated.value.cycles[2].startSolarKst).toBe("2026-12-30T15:30:00+09:00");
  const instants = ["2026-12-30T15:29:59+09:00", "2026-12-30T15:30:00+09:00", "2026-12-30T15:30:01+09:00"];
  const selections = instants.map(t => selectCustomerDayun(calculated.value, 2026, new Date(t)));
  expect(selections.map(s => s.ok ? s.value.activeCycleAtEvaluation : s.error)).toEqual([2, 3, 3]);
  expect(selections.every(s => s.ok && s.value.selectedCycle.index === 3)).toBe(true);
  observations.push({ id: "exact-boundary", calculation: calculated, instants, selections });
});

it("retains range endpoints, uncertainty, pre-first-cycle and invalid-input rejection", () => {
  const r = calculateCustomerDayun({ birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: true, gender: "MALE" });
  expect(r.ok).toBe(true); if (!r.ok) return;
  const c = r.value.cycles[2], lo = Date.parse(c.startSolarRange.earliestKst), hi = Date.parse(c.startSolarRange.latestKst);
  expect(c.startSolarKst).toBeNull(); expect(hi).toBeGreaterThan(lo);
  const selections = [lo - 1, lo, hi - 1, hi, hi + 1].map(t => selectCustomerDayun(r.value, c.startYear, new Date(t)));
  expect(selections.map(s => s.ok ? s.value.activeCycleAtEvaluation : s.error)).toEqual([2, null, null, 3, 3]);
  const pre = selectCustomerDayun(r.value, 2026, new Date("2000-01-01T00:00:00+09:00"));
  expect(pre.ok && pre.value.activeCycleAtEvaluation).toBeNull();
  // The low-level selector accepts a separate target year. An actual
  // pre-first-year request has no covered calendar cycle and is rejected.
  const preFirstRequest = selectCustomerDayun(r.value, 2000, new Date("2000-01-01T00:00:00+09:00"));
  expect(preFirstRequest).toEqual({ ok: false, error: "DAYUN_CYCLE_UNAVAILABLE" });
  const invalid = calculateCustomerDayun({ birthDate: "2001-06-22", birthTimeUnknown: true, gender: "MALE" });
  expect(invalid).toEqual({ ok: false, error: "DAYUN_UNCERTAIN" });
  observations.push({ id: "range-boundary", calculation: r, selections, pre, preFirstRequest, invalid });
});

it("keeps the relative horizon in another base year and refuses a current uncertain boundary", async () => {
  const shifted = await composeMajorFortuneNarrative(MAJOR_SAFETY_CASES[0].payload, "2027-10-12T12:00:00+09:00");
  expect(shifted.ok).toBe(true);
  if (shifted.ok) expect(shifted.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2024 + i));
  const uncertain = await composeMajorFortuneNarrative(MAJOR_SAFETY_CASES[3].payload, "2033-08-01T12:00:00+09:00");
  expect(uncertain).toEqual({ ok: false, errors: ["CURRENT_DAYUN_BOUNDARY_UNCERTAIN"] });
  observations.push({ id: "relative-horizon-and-rejected-boundary", shifted: shifted.ok ? {
    years: shifted.years.map(y => y.year), calculation: v4Digest(shifted.evidence.calculation),
    evidence: v4Digest(shifted.evidence), narrative: v4Digest(shifted.narrative),
  } : shifted, uncertain });
}, 120000);
