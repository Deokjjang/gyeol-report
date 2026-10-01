import { describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";
import { loveInputs } from "./loveFixtures";

describe("Love source fixture discovery", () => {
  it("selects actual natal sources, including stable approximate and unknown hours", () => {
    const rows = loveInputs().map(({ fixture, input }) => {
      const p = buildMyeongliMaterialPacket(input);
      expect(p.selected.some(m => m.material.category === "dayPillar")).toBe(true);
      return { name: fixture.name, precision: input.calculation.birthTimeContext?.birthTimePrecision, pillars: input.calculation.pillars,
        features: p.selected.map(m => m.feature), fusions: [...new Set(p.fusions.map(f => f.ruleId))], low: p.symbolicElements.filter(e => e.state === "low").map(e => e.element) };
    });
    if (process.env.V4_PHASE5B_EXPORT === "1") {
      mkdirSync("/tmp/gyeol-v4-phase5b", { recursive: true });
      writeFileSync("/tmp/gyeol-v4-phase5b/source-fixtures.json", JSON.stringify(rows, null, 2));
    }
  });
});
