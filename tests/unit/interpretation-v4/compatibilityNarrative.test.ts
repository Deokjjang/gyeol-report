import { expectBoundCohortReuse } from "./contentCohortAssertions";
import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { composeCompatibilityNarrative } from "../../../src/lib/interpretation-v4/compatibilityComposer";
import { narrativeText, reviewNarrativeCohort } from "../../../src/lib/interpretation-v4/editorialGuard";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";

const reports = COMPATIBILITY_NARRATIVE_FIXTURES.map(f => ({ ...f, result: composeCompatibilityNarrative(f.payload) }));
describe("V4 Compatibility editorial review", () => {
  it.each(reports)("$id: complete deterministic, attributed narrative without scores", ({ id, payload, result: r }) => {
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(composeCompatibilityNarrative(payload)).toEqual(r);
    expect(r.narrative.sections.map(s => s.id)).toEqual(expect.arrayContaining(["delight", "direction-ab", "direction-ba", "scene", "fortune", "friction", "repair"]));
    const text = narrativeText(r.narrative);
    expect(text.length).toBeGreaterThan(2200);
    expect(text).not.toMatch(/\d+\s*(점|%|퍼센트)|별점|등급|[★☆]|\b[ABCSD][+-]?급|궁합 점수|sourceRefs|personA|personB|내 원국|KPI/);
    expect(text).not.toMatch(/것가|것는|힘가|힘는|대화이|자유은|온기이|태도을|결단와/);
    expect(r.editorial).toEqual([]);
    for (const b of [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)]) expect(b.proof.sourceRefs.length, b.id).toBeGreaterThan(0);
    if (process.env.V4_PHASE5C_EXPORT === "1") {
      mkdirSync("/tmp/gyeol-v4-phase5c", { recursive: true });
      writeFileSync(`/tmp/gyeol-v4-phase5c/${id}.md`, text);
      writeFileSync(`/tmp/gyeol-v4-phase5c/${id}.json`, JSON.stringify(r, null, 2));
    }
  });
  it("distinct headlines and finals; shared explanations retain concrete common evidence", () => {
    const cohort = reports.flatMap(r => r.result.ok ? [{ id: r.id, narrative: r.result.narrative }] : []);
    const issues = reviewNarrativeCohort(cohort);
    if (process.env.V4_PHASE5C_EXPORT === "1") {
      writeFileSync("/tmp/gyeol-v4-phase5c/cohort-qa.json", JSON.stringify(issues, null, 2));
      writeFileSync("/tmp/gyeol-v4-phase5c/index.md", `# Compatibility V4 · Phase5C\n\n${reports.map(({ id, payload }) => `- [${payload.relationshipType} · ${payload.personA.name} × ${payload.personB.name}](${id}.md) · ${payload.personA.mbtiType} × ${payload.personB.mbtiType}`).join("\n")}\n`);
      writeFileSync("/tmp/gyeol-v4-phase5c/inputs.json", JSON.stringify(COMPATIBILITY_NARRATIVE_FIXTURES, null, 2));
    }
    expectBoundCohortReuse(cohort);
  });
});
