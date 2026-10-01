import { mkdirSync, writeFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { composeAnnualFortuneNarrative } from "../../../src/lib/interpretation-v4/annualComposer";
import { narrativeText, reviewNarrativeCohort } from "../../../src/lib/interpretation-v4/editorialGuard";
import { ANNUAL_NARRATIVE_FIXTURES as fixtures } from "./annualFixtures";
type Result = Extract<Awaited<ReturnType<typeof composeAnnualFortuneNarrative>>, { ok: true }>;
const results: { id: string; result: Result }[] = [];
beforeAll(async () => {
  for (const f of fixtures) { const result = await composeAnnualFortuneNarrative(f.payload, f.clock); expect(result.ok).toBe(true); if (result.ok) results.push({ id: f.id, result }); }
});
describe("Annual V4 deterministic text-only narrative", () => {
  it("exports all six unabridged texts, packets and read-only cohort diagnostics", () => {
    if (process.env.V4_PHASE6B_EXPORT !== "1") return;
    const dir = "/tmp/gyeol-v4-phase6b"; mkdirSync(dir, { recursive: true });
    for (const { id, result } of results) {
      writeFileSync(`${dir}/${id}.md`, narrativeText(result.narrative));
      writeFileSync(`${dir}/${id}.json`, JSON.stringify(result, null, 2));
    }
    writeFileSync(`${dir}/cohort-qa.json`, JSON.stringify(reviewNarrativeCohort(results.map(r => ({ id: r.id, narrative: r.result.narrative }))), null, 2));
    writeFileSync(`${dir}/index.md`, results.map(r => `- [${r.result.evidence.input.name}](${r.id}.md) · ${r.result.narrative.headline}`).join("\n"));
  });
  it.each(fixtures)("$id: twelve substantive months, all required sections and nonrepeating scenes", ({ id }) => {
    const r = results.find(r => r.id === id)!.result;
    expect(r.completeness).toMatchObject({ months: 12, opening: true, fortune: true, final: true, monthProvenance: true, ordered: true });
    expect(r.completeness.dayunCross).toBeGreaterThan(0);
    expect(r.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    expect(new Set(r.months.map(m => m.title)).size).toBe(12);
    expect(new Set(r.months.map(m => m.sceneFamily)).size).toBe(12);
    expect(r.narrative.sections.at(-1)?.id).toBe("final");
    for (const m of r.months) {
      expect(m.blocks.length).toBeGreaterThanOrEqual(3);
      expect(m.blocks.reduce((n, b) => n + b.text.length, 0)).toBeGreaterThan(300);
      expect(m.occurrence).toBeLessThan(2);
    }
    expect(r.editorial).toEqual([]);
  });
  it("headline/final are distinct, without score/ranking, source IDs or raw Jie timestamps", () => {
    expect(new Set(results.map(r => r.result.narrative.headline)).size).toBe(6);
    expect(new Set(results.map(r => r.result.narrative.finalLine)).size).toBe(6);
    for (const { result: r } of results) expect(narrativeText(r.narrative)).not.toMatch(/최고의? 달|최악의? 달|[12]위|\d+점|[SABC]등급|\d+%|\d{4}-\d{2}-\d{2}T|metal|water|sourceRefs|undefined|겁재은|정재은|결과이|망신살|방합/);
  });
});
