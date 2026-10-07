import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { FOUNDATION_ELEMENTS } from "../../../src/lib/interpretation-v4/foundationElements";
import { adaptFoundationInput, buildFoundationFromCalculation } from "../../../src/lib/interpretation-v4/foundationProfile";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

const base = { birthDate: "1996-12-06", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" } as const;
const exact = () => calculateSaju({ ...base, birthTime: "14:15", birthTimePrecision: "exact" });

describe("Canonical calculation adapter (not another calculator)", () => {
  it.each(NARRATIVE_FIXTURES)("$id: real chart, canonical labels/counts/weights preserved without mutation", fixture => {
    const { calculation } = fixtureInput(fixture), before = structuredClone(calculation);
    const result = adaptFoundationInput(calculation);
    expect(calculation).toEqual(before);
    if (!calculation.pillars.hour) {
      expect(result).toEqual({ ok: false, error: "INCOMPLETE_CHART" });
      return;
    }
    expect(result.ok).toBe(true); if (!result.ok) return;
    expect(result.value.yinYang).toMatchObject({ yinCount: calculation.yinYang.yin, yangCount: calculation.yinYang.yang });
    const profile = buildFoundationFromCalculation(calculation);
    expect(profile.ok).toBe(true); if (!profile.ok) return;
    for (const e of FOUNDATION_ELEMENTS) {
      const labels: readonly string[] = calculation.elements.labels;
      const expected = labels.includes(`${e}_STRONG`) ? "STRONG" : labels.includes(`${e}_WEAK`) ? "WEAK" : labels.includes(`${e}_MISSING`) ? "VERY_WEAK" : "BALANCED";
      expect(result.value.elements[e]).toMatchObject({ state: expected, weightedScore: calculation.elements.weighted[e],
        metadata: { canonicalLabels: labels.filter(l => l.startsWith(`${e}_`)), canonicalWeightedScore: calculation.elements.weighted[e], canonicalVisibleCount: calculation.elements.visible[e] } });
      expect(profile.value.elements.states[e]).toBe(expected);
      expect(profile.value.evidence.find(a => a.sourceKey === e)?.metadata?.provenance)
        .toContain(`SajuCalcResult:elements.weighted:${e}`);
    }
    expect(buildFoundationFromCalculation(calculation)).toEqual(profile);
    expect(calculation).toEqual(before);
  });
  it("maps every current label, absent=balanced; never invents very-strong", () => {
    const states = new Set<string>(), labels = new Set<string>();
    for (const fixture of NARRATIVE_FIXTURES) {
      const r = adaptFoundationInput(fixtureInput(fixture).calculation); if (!r.ok) continue;
      for (const e of FOUNDATION_ELEMENTS) {
        states.add(r.value.elements[e].state);
        const raw = r.value.elements[e].metadata!.canonicalLabels as string[];
        raw.forEach(l => labels.add(l.slice(e.length + 1)));
      }
    }
    expect(states).toEqual(new Set(["STRONG", "WEAK", "VERY_WEAK", "BALANCED"]));
    expect(labels).toEqual(new Set(["STRONG", "WEAK", "MISSING"]));
  });
  it("stable approximate time uses confirmed chart unchanged, no invented exact time", () => {
    const approximate = calculateSaju({ ...base, approximateBirthTimeSlot: "MISI", birthTimePrecision: "approximate" });
    expect(approximate.input.birthTime).toBeUndefined();
    const a = buildFoundationFromCalculation(approximate), b = buildFoundationFromCalculation(exact());
    expect(a.ok && b.ok).toBe(true); if (!a.ok || !b.ok) return;
    expect(a.value.axes).toEqual(b.value.axes);
    expect(a.value.synthesisCandidates).toEqual(b.value.synthesisCandidates);
    expect(a.value.evidence[1].metadata?.birthTimePrecision).toBe("approximate");
  });
  it("unknown hour is explicitly unavailable, never normalized from six to eight", () => {
    const calculation = calculateSaju({ ...base, birthTimeUnknown: true, birthTimePrecision: "unknown" });
    expect(calculation.yinYang.yin + calculation.yinYang.yang).toBe(6);
    expect(buildFoundationFromCalculation(calculation)).toEqual({ ok: false, error: "INCOMPLETE_CHART" });
    expect(calculation.pillars.hour).toBeUndefined();
  });
  it("unstable hour or inconsistent counts cannot produce a foundation profile", () => {
    const calculation = exact(); calculation.birthTimeContext!.stable.hour = false;
    expect(buildFoundationFromCalculation(calculation)).toEqual({ ok: false, error: "INCOMPLETE_CHART" });
    const badCounts = exact(); badCounts.yinYang.yin++;
    expect(buildFoundationFromCalculation(badCounts)).toEqual({ ok: false, error: "INVALID_YIN_YANG_COUNTS" });
  });
  it("ambiguous canonical element labels fail rather than silently prioritizing one", () => {
    const calculation = exact(); calculation.elements.labels = ["FIRE_STRONG", "FIRE_WEAK"];
    expect(buildFoundationFromCalculation(calculation)).toEqual({ ok: false, error: "CONFLICTING_ELEMENT_LABELS" });
  });
  it("adapter never substitutes numeric thresholds for canonical labels", () => {
    const calculation = exact(); calculation.elements.labels = [];
    calculation.elements.weighted = { WOOD: 0, FIRE: 100, EARTH: 2, METAL: 2, WATER: 2 };
    const r = buildFoundationFromCalculation(calculation);
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(Object.values(r.value.elements.states)).toEqual(Array(5).fill("BALANCED"));
    expect(r.value.synthesisCandidates).toEqual([]);
    expect(r.value.elements).toMatchObject({ strongest: "FIRE", weakest: "WOOD" });
  });
  it("invalid canonical weighted scores fail at the adapter boundary", () => {
    const calculation = exact(); calculation.elements.weighted.METAL = NaN;
    expect(adaptFoundationInput(calculation)).toEqual({ ok: false, error: "INVALID_ELEMENT_INPUT" });
  });
});

describe("Phase13D-1A stays off all six product paths", () => {
  it("only foundation modules reference the foundation; no writer/UI/calculation import", () => {
    const allowed = new Set(["semanticCore.ts", "foundationYinYang.ts", "foundationElements.ts", "foundationSynthesis.ts", "foundationProfile.ts",
      "foundationPillars.ts", "foundationTenGods.ts", "foundationTenGodSynthesis.ts", "foundationNatalProfile.ts",
      "foundationRelations.ts", "foundationTwelveStages.ts", "foundationShinsal.ts", "foundationShinsalFamilies.ts", "foundationSupplement.ts",
      "foundationIntegratedProfile.ts", "foundationRanking.ts", "foundationTension.ts", "foundationDiagnostics.ts"]);
    // 13D-2A shares only the 36-axis vocabulary. It may not consume actual
    // Myeongli foundation evidence/profiles, and foundation remains MBTI-free.
    const mbtiAxisOnly = new Set(["mbtiSemanticCore.ts", "mbtiDimensionPriors.ts", "mbtiSemanticAnnotations.ts", "mbtiSemanticProfile.ts", "narrativeCore.ts", "narrativeVocabulary.ts", "narrativeSceneCore.ts", "narrativeHumanOutcome.ts", "narrativeMeaningSignature.ts", "narrativePositiveReward.ts", "comprehensiveManuscriptPolish.ts", "operatingRuleRegistry.ts", "narrativeCausality.ts", "narrativeHumanSurface.ts"]);
    const fusionBoundary = new Set(["fusionCore.ts", "fusionContext.ts", "fusionMeanings.ts", "fusionComplementRegistry.ts", "fusionProfileAdapter.ts", "fusionTension.ts", "fusionRanking.ts", "fusionDiagnostics.ts", "fusionSemanticProfile.ts"]);
    const claimBoundary = new Set(["claimCore.ts", "claimEvidence.ts", "claimEvaluator.ts", "claimDiagnostics.ts", "claimProfile.ts"]);
    const resonanceBoundary = new Set(["personalResonanceCore.ts", "personalResonanceRules.ts", "personalResonanceEvidence.ts", "personalResonanceDiagnostics.ts", "personalResonanceProfile.ts", "guidanceCore.ts", "guidanceProblems.ts", "guidanceEvidence.ts", "comprehensivePlanCore.ts", "comprehensiveCandidateAdapter.ts", "comprehensiveSectionContracts.ts", "comprehensiveConflictGraph.ts"]);
    function files(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : /\.tsx?$/.test(entry.name) ? [join(dir, entry.name)] : []);
    }
    const consumers = files("src").filter(file => /["'][^"']*\/(?:semanticCore|foundationYinYang|foundationElements|foundationSynthesis|foundationProfile|foundationPillars|foundationTenGods|foundationTenGodSynthesis|foundationNatalProfile|foundationRelations|foundationTwelveStages|foundationShinsal|foundationShinsalFamilies|foundationSupplement|foundationIntegratedProfile|foundationRanking|foundationTension|foundationDiagnostics)["']/.test(readFileSync(file, "utf8")));
    expect(consumers.length).toBeGreaterThan(0);
    for (const file of consumers) {
      const name = file.split("/").at(-1)!;
      if (mbtiAxisOnly.has(name)) {
        expect(file).toBe(`src/lib/interpretation-v4/${name}`);
        expect(readFileSync(file, "utf8")).not.toMatch(/from ["'][^"']*\/foundation[^"']*["']/);
      } else if (["narrativeTerminology.ts", "comprehensiveNarrativeAdapter.ts"].includes(name)) {
        expect(file).toBe(`src/lib/interpretation-v4/${name}`);
        expect(readFileSync(file, "utf8")).not.toMatch(/from ["'][^"']*\/(?:foundationProfile|foundationIntegratedProfile|calculateSaju)["']/);
      } else if (fusionBoundary.has(name) || claimBoundary.has(name) || resonanceBoundary.has(name)) expect(file).toBe(`src/lib/interpretation-v4/${name}`);
      else expect(allowed.has(name), file).toBe(true);
    }
    for (const name of allowed) {
      const text = readFileSync(`src/lib/interpretation-v4/${name}`, "utf8");
      expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|analyzeFullElements\(/);
      expect(text).not.toMatch(/from ["'][^"']*(?:mbti|runtimeShadow|Composer|renderer|bookProjection)/i);
    }
  });
});
