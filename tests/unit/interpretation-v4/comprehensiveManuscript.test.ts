import { afterAll, describe, expect, it } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { renderComprehensiveManuscript } from "../../../src/lib/interpretation-v4/comprehensiveManuscriptRenderer";
import { NARRATIVE_SCENES } from "../../../src/lib/interpretation-v4/narrativeSceneRegistry";
import { SCENE_FAMILIES, inspectSceneSafety } from "../../../src/lib/interpretation-v4/narrativeSceneCore";
import { TITLE_TYPES, TITLE_SKELETONS } from "../../../src/lib/interpretation-v4/narrativeTitleRegistry";
import { PRIMARY_WORK_MODES } from "../../../src/lib/interpretation-v4/guidanceCore";
import { COMPREHENSIVE_SECTIONS } from "../../../src/lib/interpretation-v4/comprehensivePlanCore";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { schedulerInputs, schedulerPlan } from "./comprehensiveSchedulerFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

const reviews: { id: string; name: string; mbti: unknown; draft: unknown; text: string }[] = [];
afterAll(() => {
  if (process.env.MANUSCRIPT_REVIEW_EXPORT !== "1") return;
  const dir = "/tmp/gyeol-13d5b-manuscript";
  mkdirSync(`${dir}/full-text`, { recursive: true });
  writeFileSync(`${dir}/review.json`, JSON.stringify(reviews, null, 2));
  for (const r of reviews) writeFileSync(`${dir}/full-text/${r.id}.txt`, r.text);
});
describe("13D-5B registry contracts", () => {
  it("distinct scenes, eight families and safe specificity", () => {
    expect(NARRATIVE_SCENES.length).toBeGreaterThanOrEqual(250);
    expect(new Set(NARRATIVE_SCENES.map(s => s.id)).size).toBe(NARRATIVE_SCENES.length);
    expect(new Set(NARRATIVE_SCENES.map(s => s.sourceText)).size).toBe(NARRATIVE_SCENES.length);
    for (const [n, family] of SCENE_FAMILIES.entries()) expect(NARRATIVE_SCENES.filter(s => s.family === family).length).toBeGreaterThanOrEqual([30, 80, 25, 25, 30, 20, 20, 20][n]);
    expect(NARRATIVE_SCENES.flatMap(inspectSceneSafety)).toEqual([]);
  });
  it.each(PRIMARY_WORK_MODES)("work mode %s has at least five scenes", mode => {
    expect(NARRATIVE_SCENES.filter(s => s.compatibleWorkModes?.includes(mode)).length).toBeGreaterThanOrEqual(5);
  });
  it("six title types have twenty grounded skeletons each", () => {
    for (const type of TITLE_TYPES) expect(TITLE_SKELETONS.filter(s => s.type === type)).toHaveLength(20);
    expect(new Set(TITLE_SKELETONS.map(s => s.id)).size).toBe(120);
  });
});
describe("actual twelve-person manuscripts", () => {
  it.each(NARRATIVE_FIXTURES)("$id full draft from actual calculation", fixture => {
    const natal = buildIntegratedMyeongliProfile(fixtureInput(fixture).calculation);
    if (!natal.ok) return expect.unreachable(JSON.stringify(natal.diagnostics));
    const profiles = schedulerInputs(natal.value, fixture.mbti, fixture.context), plan = schedulerPlan(profiles);
    const input = { reportStableKey: fixture.id, plan, profiles }, before = JSON.stringify(input);
    const result = renderComprehensiveManuscript(input);
    if (!result.ok) return expect.unreachable(result.error);
    const d = result.draft;
    reviews.push({ id: fixture.id, name: fixture.name, mbti: fixture.mbti, draft: d,
      text: `${fixture.name} / ${fixture.mbti ?? "모름"}\n${JSON.stringify(profiles.guidance.context)}\n\nCORE GYEOL\n${d.coreGyeol.text}\n\n${COMPREHENSIVE_SECTIONS.map(id => `${id} ${d.sections[id].title}\n\n${d.sections[id].plainText}`).join("\n\n")}\n\nREPORT AUDIT\n${JSON.stringify(d.validation, null, 2)}\nSUPPRESSED\n${JSON.stringify(d.diagnostics.suppressed, null, 2)}` });
    expect(JSON.stringify(input)).toBe(before);
    expect(Object.keys(d.sections)).toEqual(COMPREHENSIVE_SECTIONS);
    expect(d.validation.hardViolations, JSON.stringify(d.diagnostics.suppressed)).toEqual([]);
    expect(JSON.parse(JSON.stringify(d))).toEqual(d);
    expect(d.fullText).not.toMatch(/[A-Z]{2,}_[A-Z_]+|actual-source|(?:natal|supplement|foundation|editorial):/);
    if (!profiles.mbti.available) expect(d.explicitMbtiUsage).toBe(0);
    expect(d.sections.C1.blocks[0]?.sentences[0]?.role).toBe("DIRECT_CLAIM");
    expect(d.sections.C1.blocks[0]?.sourceUnitIds).toContain(plan.sections.C1.primaryCandidateIds[0]);
    for (const id of ["C1", "C6", "C9"] as const) expect(d.sections[id].sceneIds.length).toBeLessThanOrEqual(1);
    for (const id of ["C5", "C10"] as const) expect(d.sections[id].sceneIds).toEqual([]);
    for (const id of COMPREHENSIVE_SECTIONS) {
      const s = d.sections[id];
      if (s.blocks.length) expect(s.title.length).toBeGreaterThan(0);
      for (const b of s.blocks) {
        if(id==="C10") { expect(s.operatingRules?.some(r=>b.sourceUnitIds.includes(r.candidateId))).toBe(true);continue; }
        const placement = plan.sections[id].placements.find(p => b.sourceUnitIds.includes(p.candidateId))!;
        const c = plan.candidates.find(c => c.id === placement.candidateId)!;
        if (c.fusionType && placement.presentationIntent === "EXPLICIT" && !(d.debug.sources[`${id}:${c.id}`] as {diagnostics?:string[]})?.diagnostics?.includes("MBTI_VISIBLE_DOMAIN_SUPPRESSED")) {
          expect(b.sentenceRoles).toContain("MYEONGLI_REASON"); expect(b.sentenceRoles).toContain("MBTI_REASON");
        }
      }
    }
    expect(new Set(d.titleUsage.map(t => t.text)).size).toBe(d.titleUsage.length);
    const last = d.sections.C10.blocks.at(-1);
    if (last && d.debug.coreRecall.length) {
      expect(last.sentences.length).toBeGreaterThanOrEqual(2);
      expect(last.sentences.length).toBeLessThanOrEqual(3);
      expect(last.sentences[0].sourcePhraseId).toMatch(/:core-recall$/);
      expect(last.sentences.some(s => s.role === "ACTION")).toBe(true);
    }
  }, 60000);
});
