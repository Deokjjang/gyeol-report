import { it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { compatibilityNarrativeEvidence } from "../../../src/lib/interpretation-v4/compatibilityEvidence";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
it("discovers canonical pair and individual fusion material for the review cohort", () => {
  const result = COMPATIBILITY_NARRATIVE_FIXTURES.map(f => ({ id: f.id, result: compatibilityNarrativeEvidence(f.payload) }));
  for (const r of result) expect(r.result.ok, r.id).toBe(true);
  if (process.env.V4_PHASE5C_EXPORT === "1") {
    mkdirSync("/tmp/gyeol-v4-phase5c", { recursive: true });
    writeFileSync("/tmp/gyeol-v4-phase5c/evidence.json", JSON.stringify(result, null, 2));
    const base = COMPATIBILITY_NARRATIVE_FIXTURES[0].payload;
    writeFileSync("/tmp/gyeol-v4-phase5c/esfj-search.json", JSON.stringify(["1995-04-08", "1995-04-10", "1995-04-11", "1995-04-12", "1988-03-22"].map(birthDate => {
      const r = compatibilityNarrativeEvidence({ ...base, personB: { ...base.personB, birthDate } });
      return { birthDate, fusions: r.ok ? r.persons.personB.materials.fusions.map(f => f.ruleId) : [] };
    }), null, 2));
  }
});
