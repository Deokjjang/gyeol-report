import { expectBoundCohortReuse } from "./contentCohortAssertions";
import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { narrativeText, reviewNarrativeCohort } from "../../../src/lib/interpretation-v4/editorialGuard";
import { MBTI_SOURCE_TYPES, getMbtiSourceProfile } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { CAREER_STUDY_BRIDGES } from "../../../src/lib/interpretation-v4/careerStudy";
import { careerWorkNarrative } from "../../../src/lib/interpretation-v4/careerWorkNarrative";
import { careerInputs } from "./careerFixtures";
import { fixtureInput, NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";

const inputs = careerInputs();
const results = inputs.map(({ fixture, input }) => ({ fixture, result: composeCareerNarrative(input) }));
describe("Phase 5A offline career text", () => {
  it("exports eight actual full texts and packets for deep editorial review", () => {
    if (process.env.V4_PHASE5A_EXPORT !== "1") return;
    const dir = "/tmp/gyeol-v4-phase5a"; mkdirSync(dir, { recursive: true });
    for (const { fixture, result } of results) if (result.ok) {
      writeFileSync(`${dir}/${fixture.id}.md`, `${fixture.name} · ${fixture.mbti ?? "MBTI 모름"} · ${fixture.context.detailJob}\n\n${narrativeText(result.narrative)}\n`);
      writeFileSync(`${dir}/${fixture.id}.json`, JSON.stringify({ fixture, ...result }, null, 2));
    }
    writeFileSync(`${dir}/cohort-qa.json`, JSON.stringify(reviewNarrativeCohort(results.flatMap(({ fixture, result }) => result.ok ? [{ id: fixture.id, narrative: result.narrative }] : [])), null, 2));
    writeFileSync(`${dir}/index.md`, `# Career Phase 5A · eight full texts\n\n${results.flatMap(({ fixture, result }) => result.ok ? [`- [${fixture.name}](${fixture.id}.md) · ${result.narrative.headline}`] : []).join("\n")}\n`);
  });
  it.each(results)("$fixture.id: complete, evidence-bound long prose with no editorial blocker", ({ result }) => {
    expect(result.ok).toBe(true); if (!result.ok) return;
    expect(result.editorial).toEqual([]);
    expect(result.narrative.recommendations.length).toBeGreaterThanOrEqual(3);
    expect(result.narrative.recommendations.length).toBeLessThanOrEqual(6);
    expect(result.narrative.avoidEnvironments.length).toBeGreaterThanOrEqual(2);
    expect(narrativeText(result.narrative).length).toBeGreaterThan(2300);
    const features = new Set([...result.materials.selected.map(m => m.feature), ...result.materials.symbolicElements.map(m => m.material.feature), ...result.materials.fusions.flatMap(f => f.myeongliEvidence.map(d => d.evidence.feature))]);
    for (const block of [...result.narrative.opening, ...result.narrative.sections.flatMap(s => s.blocks)]) {
      expect(block.proof.sourceRefs.length, block.id).toBeGreaterThan(0);
      for (const feature of block.proof.features) expect(features.has(feature), `${block.id}: ${feature}`).toBe(true);
    }
  });
  it("distinct headlines and finals; shared explanations retain concrete common evidence", () => {
    expectBoundCohortReuse(results.flatMap(({ fixture, result }) => result.ok ? [{ id: fixture.id, narrative: result.narrative }] : []));
  });
  it.each(inputs)("$fixture.id preserves calculation and material source inputs exactly", ({ input }) => {
    const before = JSON.stringify(input), expected = buildMyeongliMaterialPacket(input);
    const result = composeCareerNarrative(input);
    expect(JSON.stringify(input)).toBe(before);
    expect(result.ok && result.materials).toEqual(expected);
    expect(composeCareerNarrative(input)).toEqual(result);
  });
  it("reads all sixteen actual study trait IDs and never treats a type label as evidence", () => {
    for (const type of MBTI_SOURCE_TYPES) {
      const bridge = CAREER_STUDY_BRIDGES[type];
      expect(getMbtiSourceProfile(type)?.traits?.study?.some(t => t.id === bridge.trait)).toBe(true);
    }
  });
  it("unknown MBTI has full natal career copy, not inferred type or a warning", () => {
    const r = results[5].result; if (!r.ok) return;
    expect(r.materials.fusions).toEqual([]); expect(r.studyBasis).toBeNull();
    expect(narrativeText(r.narrative)).not.toMatch(/MBTI|ENTJ|INTP|유형을 알|정보가 부족|현재 회사|당신의 상사/);
    expect(r.narrative.sections.map(s => s.id)).toEqual(expect.arrayContaining(["money", "roles", "study", "fortune", "direction"]));
  });
  it("prioritizes job function over industry, and does not invent a current employer while resting", () => {
    const base = inputs[0].input;
    for (const detailJob of ["병원 재무기획", "제조업 예산 담당", "교육기업 회계"]) {
      const c = careerWorkNarrative({ ...base, context: { ...base.context, detailJob } });
      expect(c.workFunction).toBe("finance_planning"); expect(c.current.join(" ")).not.toMatch(/처치|강의 준비|환자/);
    }
    const resting = careerWorkNarrative({ ...base, context: { ...base.context, jobStatus: "unemployed", detailJob: "이전 직업 회계" } });
    expect(resting.current.join(" ")).not.toMatch(/현재.*회계|상사가 원하는|다음 이직/);
  });
  it.each(MBTI_SOURCE_TYPES)("%s: eight real charts, safe deterministic fallback when Fusion is absent", mbti => {
    for (const { input } of inputs) {
      const r = composeCareerNarrative({ ...input, mbti });
      expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.editorial.filter(i => i.severity !== "Minor"), `${input.name}:${mbti}`).toEqual([]);
      expect(r.materials).toEqual(buildMyeongliMaterialPacket({ calculation: input.calculation, mbti }));
    }
  });
  it("unknown birth time never invents an element deficit or unsupported structure", () => {
    const r = composeCareerNarrative(fixtureInput(NARRATIVE_FIXTURES[2]));
    expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.narrative.sections.some(s => s.id === "balance")).toBe(false);
  });
  it("real chart counterfactuals include overlap, contrast and complement without guessing an MBTI", () => {
    const kinds = new Set<string>(), examples: Record<string, unknown> = {};
    const charts = [...NARRATIVE_FIXTURES, { ...NARRATIVE_FIXTURES[1], date: "1988-03-06", time: "09:30" }];
    for (const f of charts) for (const mbti of MBTI_SOURCE_TYPES) {
      const r = composeCareerNarrative({ ...fixtureInput(f), mbti }); if (!r.ok) continue;
      for (const block of [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)]) {
        if (!block.proof.fusionIds.length || !["career-character", "fusion-turn"].includes(block.id)) continue;
        for (const fusion of r.materials.fusions.filter(f => block.proof.fusionIds.includes(f.ruleId))) {
          kinds.add(fusion.kind);
          examples[fusion.kind] ??= { date: f.date, time: f.time, mbti, rule: fusion.ruleId, text: block.text };
        }
      }
    }
    expect([...kinds].sort()).toEqual(["complement", "contrast", "overlap"]);
    if (process.env.V4_PHASE5A_EXPORT === "1") writeFileSync("/tmp/gyeol-v4-phase5a/fusion-counterfactuals.json", JSON.stringify(examples, null, 2));
  });
  it("all emitted Korean combinations use the shared particle realizer", () => {
    for (const { result } of results) if (result.ok) expect(narrativeText(result.narrative)).not.toMatch(/역할가|금가|목가|재주을|기회을|검토을|괴리이|합니다을|형상입니다처럼/);
  });
});
