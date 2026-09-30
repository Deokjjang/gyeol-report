import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { MBTI_SOURCE_TYPES } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { buildFusionCore } from "../../../src/lib/interpretation-v4/fusion";
import { FUSION_RULES, FORTUNE_RULES } from "../../../src/lib/interpretation-v4/fusionRules";
import { MATERIAL_REGISTRY } from "../../../src/lib/interpretation-v4/materialRegistry";
import { V4_DOMAINS } from "../../../src/lib/interpretation-v4/types";

describe("V4 actual-calculation representative matrix", () => {
  it("finds genuine overlap/complement/fortune examples and exports only by explicit local opt-in", () => {
    const samples = [1988, 1992, 1994, 1996, 2001, 2003].flatMap(year => Array.from({ length: 12 }, (_, month) => [6, 18, 27].map(day => {
      const birthDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const calculation = calculateSaju({ birthDate, birthTime: "09:30", birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
      return { birthDate, calculation, entj: buildFusionCore({ calculation, mbti: "ENTJ" }), enfp: buildFusionCore({ calculation, mbti: "ENFP" }) };
    })).flat());
    const overlap = samples.find(s => ["entj-wealth", "entj-pressure", "entj-needle"].every(id => s.entj.fusions.some(f => f.ruleId === id)));
    const complement = samples.find(s => s.enfp.fusions.some(f => f.kind === "complement"));
    const contrast = samples.find(s => s.enfp.fusions.some(f => f.kind === "contrast"));
    const fortune = samples.find(s => s.entj.fortuneComposites.some(f => f.ruleId === "wealth-and-name"));
    expect(overlap).toBeDefined(); expect(complement).toBeDefined(); expect(contrast).toBeDefined(); expect(fortune).toBeDefined();
    const projection = (s: NonNullable<typeof overlap>, key: "entj" | "enfp") => ({ birthDate: s.birthDate, birthTime: "09:30", mbti: key.toUpperCase(),
      pillars: s.calculation.pillars, fusions: s[key].fusions.map(f => ({ id: f.ruleId, domain: f.domain, kind: f.kind, seed: f.insightSeed, strength: f.strength,
        myeongli: f.myeongliEvidence.map(d => ({ feature: d.evidence.feature, status: d.status, weight: d.evidence.weight ?? null, sources: d.evidence.sourceRefs })),
        mbti: f.mbtiEvidence, provenance: f.provenanceRefs })), composites: s[key].fortuneComposites });
    const coverage = MBTI_SOURCE_TYPES.map(type => ({ type, counts: Object.fromEntries(V4_DOMAINS.map(domain => [domain, FUSION_RULES.filter(r => r.type === type && r.domains.includes(domain)).length])),
      actual: buildFusionCore({ calculation: overlap!.calculation, mbti: type }).fusions.map(f => f.ruleId) }));
    expect(new Set(coverage.map(row => JSON.stringify(row.actual))).size).toBeGreaterThan(8);
    if (process.env.V4_PHASE1_EXPORT) {
      expect(process.env.V4_PHASE1_EXPORT).toBe("/tmp/gyeol-v4-phase1-samples.json");
      writeFileSync(process.env.V4_PHASE1_EXPORT, JSON.stringify({ scannedRealCharts: samples.length, materialCount: MATERIAL_REGISTRY.length,
        fusionRules: FUSION_RULES.length, fortuneRules: FORTUNE_RULES.length, coverage,
        overlap: projection(overlap!, "entj"), complement: projection(complement!, "enfp"), contrast: projection(contrast!, "enfp"), fortune: projection(fortune!, "entj") }, null, 2) + "\n");
    }
  });
});
