import contentBaseline from "./productNarrativeBaseline.json";
import { createHash } from "node:crypto";
import { isVerifiedBookConsumer } from "./bookBoundary";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { careerRecommendations } from "../../../src/lib/interpretation-v4/careerRecommendations";
import { selectCareerVoice } from "../../../src/lib/interpretation-v4/careerVoices";
import { careerWorkNarrative } from "../../../src/lib/interpretation-v4/careerWorkNarrative";
import { careerStudy } from "../../../src/lib/interpretation-v4/careerStudy";
import { careerFortune } from "../../../src/lib/interpretation-v4/careerFortune";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { JOB_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import type { NarrativeInput, NarrativeState } from "../../../src/lib/interpretation-v4/narrativeTypes";
import { fixtureInput, NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { careerInputs } from "./careerFixtures";

// Phase13A intentionally rebuilds all six products. Its reviewed text/proof
// baseline is separate from the retained Phase7A historical baseline.
const PHASE4B_HASHES = Object.entries(contentBaseline.rows).filter(([id]) => id.startsWith("comprehensive-")).sort(([a], [b]) => a.localeCompare(b)).map(([, row]) => row.after);
const inputs = careerInputs();
describe("Career gates and isolation", () => {
  it.each(NARRATIVE_FIXTURES.map((f, i) => ({ f, hash: PHASE4B_HASHES[i] })))("$f.id: reviewed Comprehensive narrative remains byte-for-byte stable", ({ f, hash }) => {
    const r = composeComprehensiveNarrative(fixtureInput(f)); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex")).toBe(hash);
  });
  it.each(JOB_STATUSES)("%s: all eight charts honor canonical status without mutating input", status => {
    for (const { input } of inputs) {
      const changed = { ...input, context: { ...input.context, jobStatus: status } };
      const before = JSON.stringify(changed), r = composeCareerNarrative(changed);
      expect(r.ok).toBe(true); expect(JSON.stringify(changed)).toBe(before); if (!r.ok) continue;
      const current = r.narrative.sections.find(s => s.id === "current")!.blocks.map(b => b.text).join(" ");
      if (["unemployed", "student", "job_seeker", "homemaker"].includes(status)) expect(current).not.toMatch(/상사가|회사에서는|내 연봉|직원에게 지시/);
      if (status === "business_owner") expect(current).toContain("고객");
      if (status === "freelancer") expect(current).toMatch(/의뢰|계약|프리랜서/);
      expect(r.editorial.filter(i => i.severity === "Blocker")).toEqual([]);
    }
  });
  it("removing strong route materials removes the recommendation, not just its evidence label", () => {
    const input = inputs[7].input, r = composeCareerNarrative(input); if (!r.ok) return;
    const pillar = r.materials.selected.find(m => m.material.category === "dayPillar")!, master = r.materials.selected.find(m => m.material.category === "dayMaster")!;
    const state: NarrativeState = { input, packet: { ...r.materials, selected: [pillar, master], fusions: [], fortuneComposites: [] }, pillar, master, usedSeeds: new Set(), featureUses: new Map() };
    const routes = careerRecommendations(state, selectCareerVoice(state), careerWorkNarrative(input));
    expect(routes.recommendations.map(r => r.id)).toEqual(["sample-first"]);
    expect(routes.recommendations[0].basis).toBe("explore-with-sample");
    expect(careerStudy(state).basis).toBeNull();
    expect(careerFortune(state, "natal").proof.features).toEqual(expect.arrayContaining([pillar.feature, master.feature]));
  });
  it("malformed input is a failure result, not an exception or a guessed profile", () => {
    const base = inputs[0].input;
    for (const input of [null, { ...base, name: "" }, { ...base, mbti: 42 }, { ...base, context: { ...base.context, jobStatus: "ceo" } }]) {
      expect(composeCareerNarrative(input as unknown as NarrativeInput)).toMatchObject({ ok: false });
    }
  });
  it("same chart/different MBTI and same MBTI/different chart affect career content without changing natal facts", () => {
    const base = inputs[7].input, original = composeCareerNarrative(base); if (!original.ok) return;
    for (const mbti of ["INTP", "ENFP", null]) {
      const r = composeCareerNarrative({ ...base, mbti }); expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.materials.selected).toEqual(original.materials.selected);
      expect(r.narrative.opening[0].text).not.toBe(original.narrative.opening[0].text);
      expect(narrativeText(r.narrative)).not.toBe(narrativeText(original.narrative));
    }
    for (const { input } of inputs.slice(0, 3)) {
      const r = composeCareerNarrative({ ...base, calculation: input.calculation }); if (!r.ok) continue;
      expect(r.materials.selected).not.toEqual(original.materials.selected);
      expect(r.narrative.sections.find(s => s.id === "fortune")).not.toEqual(original.narrative.sections.find(s => s.id === "fortune"));
    }
  });
  it("composers stay out of public UI/runtime; only explicit dev consumers may cross", () => {
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : /\.[jt]sx?$/.test(entry.name) ? [join(dir, entry.name)] : []);
    for (const dir of ["src/app", "src/components", "src/lib/report-generation", "src/lib/interpretation-v3", "src/lib/sharing"]) {
      for (const file of walk(dir)) {
        const source = readFileSync(file, "utf8");
        if (isVerifiedBookConsumer(file, source)) continue;
        if (file === "src/components/report/V4ShadowReportView.tsx") {
          expect(source.match(/^import .*interpretation-v4.*$/gm)).toEqual(['import type { V4ShadowView } from "../../lib/interpretation-v4/runtimeTypes";']);
        } else expect(source, file).not.toMatch(/interpretation-v4\//);
      }
    }
  });
});
