import { createHash } from "node:crypto";
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

// Phase 4B baseline, with explicitly reviewed Phase 7A prose corrections.
// Original hashes and unchanged evidence/proof hashes: finalEditorialBaseline.json.
const PHASE4B_HASHES = [
  "8b0e5cde9809fc4cae3873a5b54611b56c5f291894d9b88cfefc210d50af4788", "719ccb62e6bb699393665fb08636e48c53de8b8ad1a0144f4f4c1e1de3e1e92d",
  "4cc1f08797688927d9c3e5b9d22342fb639cb9ca9d0f5e9d8ae700da5b5bb13e", "35f22010e2a8d19c46c61692cc3e96aa570642d6f94d55ebfdfb07f2882b2278",
  "e63d23a99fd58b7eac738f8a94bd7e7f8aabcaa21117029fff453388dce2b78f", "12bd23cd12deb9b11e121f265ea29eccc96fe88797436bbc881fe783d8d2477b",
  "e73c1a512c981788a011351f35624389fa5e56edf8e5a71fbca6d13dbbaae03c", "0f5f0e9a9b240eb6d7f49a1864b349b3c26bff0332e1692182511acc43b5d53c",
  "7bf7c01e6475c8b0865b845245619ab495f99d9cee7d8a786e39a1e00cacc4ba", "e552621a35803761f48499fb94c8fefb14f0f631a71f103a7e605feffdb4f34e",
  "ff51b237aa4e81c6f0e7ecbdcfb168dbf7e04f98b4329028d4e07a638ea480b1", "d020318a60eab800c7e5e19390bc5c8de680db69b3f53bf8a88115083fb5d9bb",
];
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
  it("composers stay out of public UI/runtime; only shadow DTO types may cross", () => {
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : /\.[jt]sx?$/.test(entry.name) ? [join(dir, entry.name)] : []);
    for (const dir of ["src/app", "src/components", "src/lib/report-generation", "src/lib/interpretation-v3", "src/lib/sharing"]) {
      for (const file of walk(dir)) {
        const source = readFileSync(file, "utf8");
        if (file === "src/components/report/V4ShadowReportView.tsx") {
          expect(source.match(/^import .*interpretation-v4.*$/gm)).toEqual(['import type { V4ShadowView } from "../../lib/interpretation-v4/runtimeTypes";']);
        } else expect(source, file).not.toMatch(/interpretation-v4\//);
      }
    }
  });
});
