import { mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { it, expect } from "vitest";
import { annualNarrativeEvidence } from "../../../src/lib/interpretation-v4/annualEvidence";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { MAJOR_NARRATIVE_FIXTURES, MAJOR_EVALUATED_AT } from "./majorFixtures";
import { ANNUAL_NARRATIVE_FIXTURES } from "./annualFixtures";
it("discovers canonical Annual evidence and freezes unchanged Phase6A output", async () => {
  const summary = [], hashes = [];
  for (const f of ANNUAL_NARRATIVE_FIXTURES) {
    const e = await annualNarrativeEvidence(f.payload, f.clock); expect(e.ok, JSON.stringify([f.id, e.ok ? "ok" : e.errors])).toBe(true); if (!e.ok) continue;
    summary.push({ id: f.id, year: e.selectedYear, annual: e.raw.annualFortune, stemRelations: e.annualStemRelations,
      cross: e.crossPeriods.map(p => ({ start: p.startKst, end: p.endKstExclusive, god: p.annualGod, cycles: p.cycles.map(c => ({ god: c.god, flow: c.flowGod })) })),
      fusion: e.materials.fusions.map(f => ({ rule: f.ruleId, tag: f.mbtiEvidence.semanticTag, kind: f.kind })),
      months: e.months.map(m => ({ month: m.month, stem: m.focus.stemTenGod, branch: m.focus.branchTenGod, ganji: m.extension.ganji, time: m.time, relations: m.focus.relationFacts,
        features: m.transit.accepted.map(f => [f.feature, f.observations[0].label]) })) });
  }
  for (const f of MAJOR_NARRATIVE_FIXTURES) {
    const r = await composeMajorFortuneNarrative(f.payload, MAJOR_EVALUATED_AT); expect(r.ok).toBe(true);
    if (r.ok) hashes.push(createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex"));
  }
  if (process.env.V4_PHASE6B_EXPORT === "1") {
    mkdirSync("/tmp/gyeol-v4-phase6b", { recursive: true });
    writeFileSync("/tmp/gyeol-v4-phase6b/evidence-summary.json", JSON.stringify(summary, null, 2));
    writeFileSync("/tmp/gyeol-v4-phase6b/major-baseline.json", JSON.stringify(hashes, null, 2));
  }
});
