import { expectBoundCohortReuse } from "./contentCohortAssertions";
import { mkdirSync, writeFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { composeMajorFortuneNarrative } from "../../../src/lib/interpretation-v4/majorComposer";
import { narrativeText, reviewNarrativeCohort } from "../../../src/lib/interpretation-v4/editorialGuard";
import { MAJOR_NARRATIVE_FIXTURES as fixtures, MAJOR_EVALUATED_AT } from "./majorFixtures";
type Result = Extract<Awaited<ReturnType<typeof composeMajorFortuneNarrative>>, { ok: true }>;
const results: { id: string; result: Result }[] = [];
beforeAll(async () => {
  for (const f of fixtures) { const result = await composeMajorFortuneNarrative(f.payload, MAJOR_EVALUATED_AT); expect(result.ok).toBe(true); if (result.ok) results.push({ id: f.id, result }); }
});
describe("Major V4 offline fourteen-year narrative", () => {
  it("exports six complete customer texts and structured packets", () => {
    if (process.env.V4_PHASE6A_EXPORT !== "1") return;
    const dir = "/tmp/gyeol-v4-phase6a"; mkdirSync(dir, { recursive: true });
    for (const { id, result } of results) {
      writeFileSync(`${dir}/${id}.md`, narrativeText(result.narrative));
      writeFileSync(`${dir}/${id}.json`, JSON.stringify(result, null, 2));
    }
    writeFileSync(`${dir}/cohort-qa.json`, JSON.stringify(reviewNarrativeCohort(results.map(r => ({ id: r.id, narrative: r.result.narrative }))), null, 2));
    writeFileSync(`${dir}/index.md`, results.map(r => `- [${r.result.evidence.input.name}](${r.id}.md) · ${r.result.narrative.headline}`).join("\n"));
  });
  it.each(fixtures)("$id: full horizon, age, real transitions, substantial distinct years and final", ({ id }) => {
    const r = results.find(r => r.id === id)!.result;
    expect(r.completeness).toMatchObject({ years: 14, futureYears: 10, ages: true, final: true });
    expect(r.years.map(y => y.year)).toEqual(Array.from({ length: 14 }, (_, i) => 2023 + i));
    expect(new Set(r.years.map(y => y.title)).size).toBe(14);
    expect(new Set(r.years.map(y => y.sceneFamily)).size).toBe(14);
    expect(r.transitions.length).toBe(r.evidence.horizon.transitions.length);
    expect(r.narrative.sections.at(-1)?.id).toBe("final");
    for (const y of r.years) {
      expect(y.blocks.length).toBeGreaterThanOrEqual(y.importance === "BACKGROUND" ? 3 : 4);
      expect(y.blocks.reduce((n, b) => n + b.text.length, 0)).toBeGreaterThan(y.importance === "BACKGROUND" ? 200 : 350);
    }
    expect(r.editorial).toEqual([]);
  });
  it("distinct headlines and finals; shared explanations retain concrete common evidence", () => {
    expectBoundCohortReuse(results.map(r => ({ id: r.id, narrative: r.result.narrative })));
  });
});
