import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { calculateSaju } from "../../../src/lib/saju/calculateSaju";
import { buildMyeongliStructure } from "../../../src/lib/interpretation-v4/structureEvidence";
import { STRUCTURE_RULES } from "../../../src/lib/interpretation-v4/structureRules";
import { buildFusionCore } from "../../../src/lib/interpretation-v4/fusion";

describe("V4 Phase 2 actual date matrix", () => {
  it("audits real calculation candidates without changing their source", () => {
    const rows: { date: string; time: string; pillars: unknown; level: string; confidence: string; structures: { id: string; confidence: string }[] }[] = [];
    const suppressions: Record<string, Record<string, number>> = {};
    const statuses: Record<string, Record<string, number>> = {};
    const negativeExamples: Record<string, Record<string, { date: string; time: string }>> = {};
    for (let year = 1984; year <= 2007; year++) for (let month = 1; month <= 12; month++) for (const day of [6, 18, 27]) for (const time of Array.from({ length: 12 }, (_, i) => `${String(i * 2 + 1).padStart(2, "0")}:30`)) {
      const date = `${year}-${String(month).padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      const calc = calculateSaju({ birthDate: date, birthTime: time, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
      const before = JSON.stringify(calc), layer = buildMyeongliStructure(calc);
      expect(JSON.stringify(calc)).toBe(before);
      if (layer.strength.confidence !== "strong") expect(layer.candidates.some(c => c.id === "wealthHeavyWeakDaymaster")).toBe(false);
      rows.push({ date, time, pillars: calc.pillars, level: layer.strength.level, confidence: layer.strength.confidence,
        structures: layer.candidates.map(c => ({ id: c.id, confidence: c.confidence })) });
      for (const c of layer.candidates) {
        expect(new Set(c.lineage).size).toBe(c.lineage.length);
        expect(c.provenance.length).toBeGreaterThan(2);
        if (["noResource", "noOutput"].includes(c.id)) expect(c.confidence).toBe("supported");
      }
      for (const a of layer.assessments) {
        statuses[a.id] ??= {}; statuses[a.id][a.status] = (statuses[a.id][a.status] ?? 0) + 1;
      }
      for (const a of layer.assessments) for (const reason of a.reasons) {
        suppressions[a.id] ??= {}; suppressions[a.id][reason] = (suppressions[a.id][reason] ?? 0) + 1;
        if (a.status === "suppressed" || a.status === "uncertain") {
          negativeExamples[a.id] ??= {}; negativeExamples[a.id][reason] ??= { date, time };
        }
      }
    }
    expect(rows).toHaveLength(10368);
    const counts = STRUCTURE_RULES.map(rule => ({ id: rule.id,
      strong: rows.filter(r => r.structures.some(s => s.id === rule.id && s.confidence === "strong")).length,
      supported: rows.filter(r => r.structures.some(s => s.id === rule.id && s.confidence === "supported")).length,
      uncertain: statuses[rule.id].uncertain ?? 0,
      suppressed: statuses[rule.id].suppressed ?? 0,
      example: rows.find(r => r.structures.some(s => s.id === rule.id && s.confidence === "strong")) ?? null,
    }));
    for (const row of counts) {
      if (["noResource", "noOutput"].includes(row.id)) expect(row.supported).toBeGreaterThan(0);
      else expect(row.strong, row.id).toBeGreaterThan(0);
      expect(row.strong + row.supported + row.uncertain + row.suppressed).toBe(rows.length);
      expect(row.suppressed + row.uncertain, `${row.id} negative fixtures`).toBeGreaterThan(0);
    }
    const integration = rows.filter(r => r.structures.some(s => ["wealthHeavyWeakDaymaster", "outputCreatesWealth"].includes(s.id) && s.confidence === "strong")).flatMap(row => {
      const calculation = calculateSaju({ birthDate: row.date, birthTime: row.time, birthTimeUnknown: false, calendarType: "SOLAR", gender: "MALE", timezone: "Asia/Seoul" });
      const r = buildFusionCore({ calculation, mbti: "ENTJ" });
      return r.fortuneComposites.filter(f => ["ambition-with-place", "created-value-accumulates"].includes(f.ruleId)).map(f => ({
        date: row.date, time: row.time, id: f.ruleId, seed: f.directCopySeed, supports: f.supportingEvidence.map(d => d.evidence.feature),
        fusions: r.fusions.filter(f => f.myeongliEvidence.some(d => d.evidence.structure)).map(f => ({ id: f.ruleId, seed: f.insightSeed })),
      }));
    });
    expect(integration.some(r => r.id === "created-value-accumulates")).toBe(true);
    if (process.env.V4_PHASE2_EXPORT) {
      expect(process.env.V4_PHASE2_EXPORT).toBe("/tmp/gyeol-v4-phase2-matrix.json");
      writeFileSync(process.env.V4_PHASE2_EXPORT, JSON.stringify({ counts, suppressions, negativeExamples, integration, rows }, null, 2) + "\n");
    }
  }, 120_000);
});
