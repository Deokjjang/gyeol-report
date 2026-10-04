import { expectBoundCohortReuse } from "./contentCohortAssertions";
import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { narrativeText, reviewNarrativeCohort } from "../../../src/lib/interpretation-v4/editorialGuard";
import { buildMyeongliMaterialPacket } from "../../../src/lib/interpretation-v4/materialPacket";
import { MBTI_SOURCE_TYPES, getMbtiSourceProfile } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import { LOVE_VOICES } from "../../../src/lib/interpretation-v4/loveVoices";
import { loveInputs } from "./loveFixtures";

const inputs = loveInputs();
const reports = inputs.map(({ fixture, input }) => ({ fixture, input, result: composeLoveNarrative(input) }));
describe("Phase 5B offline Love narrative", () => {
  it("exports eight complete texts for reading, not just automatic metrics", () => {
    if (process.env.V4_PHASE5B_EXPORT !== "1") return;
    const dir = "/tmp/gyeol-v4-phase5b"; mkdirSync(dir, { recursive: true });
    for (const { fixture, input, result } of reports) if (result.ok) {
      writeFileSync(`${dir}/${fixture.id}.md`, `${fixture.name} · ${fixture.mbti ?? "MBTI 모름"} · ${fixture.context.relationshipStatus || "미선택"} · ${input.calculation.birthTimeContext?.birthTimePrecision}\n\n${narrativeText(result.narrative)}\n`);
      writeFileSync(`${dir}/${fixture.id}.json`, JSON.stringify({ fixture, ...result }, null, 2));
    }
    writeFileSync(`${dir}/cohort-qa.json`, JSON.stringify(reviewNarrativeCohort(reports.flatMap(({ fixture, result }) => result.ok ? [{ id: fixture.id, narrative: result.narrative }] : [])), null, 2));
    writeFileSync(`${dir}/index.md`, `# Love Phase 5B · 8 full texts\n\n${reports.flatMap(({ fixture, result }) => result.ok ? [`- [${fixture.name}](${fixture.id}.md) · ${result.narrative.headline}`] : []).join("\n")}\n`);
  });
  it.each(reports)("$fixture.id: full, evidence-bound character without editorial failures", ({ result }) => {
    expect(result.ok).toBe(true); if (!result.ok) return;
    expect(result.editorial).toEqual([]);
    expect(narrativeText(result.narrative).length).toBeGreaterThan(2500);
    expect(result.narrative.sections.map(s => s.id)).toEqual(expect.arrayContaining(["current", "partner", "home", "parenting", "fortune", "direction"]));
    const features = new Set([...result.materials.selected.map(m => m.feature), ...result.materials.symbolicElements.map(m => m.material.feature), ...result.materials.fusions.flatMap(f => f.myeongliEvidence.map(d => d.evidence.feature))]);
    for (const block of [...result.narrative.opening, ...result.narrative.sections.flatMap(s => s.blocks)]) {
      expect(block.proof.sourceRefs.length, block.id).toBeGreaterThan(0);
      for (const feature of block.proof.features) expect(features.has(feature), feature).toBe(true);
    }
  });
  it("distinct headlines and finals; shared explanations retain concrete common evidence", () => {
    expectBoundCohortReuse(reports.flatMap(({ fixture, result }) => result.ok ? [{ id: fixture.id, narrative: result.narrative }] : []));
  });
  it.each(inputs)("$fixture.id: immutable calculation, deterministic repeat and unchanged core packet", ({ input }) => {
    const before = JSON.stringify(input), r = composeLoveNarrative(input);
    expect(composeLoveNarrative(input)).toEqual(r); expect(JSON.stringify(input)).toBe(before);
    expect(r.ok && r.materials).toEqual(buildMyeongliMaterialPacket(input));
  });
  it.each(MBTI_SOURCE_TYPES)("%s: eight actual charts remain safe without forced Fusion", mbti => {
    for (const { input } of inputs) {
      const r = composeLoveNarrative({ ...input, mbti }); expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.editorial.filter(i => i.severity !== "Minor"), `${input.name}/${mbti}`).toEqual([]);
      const text = narrativeText(r.narrative);
      expect(text).not.toMatch(/KPI|최적화|내적 자원|구조적으로|메타인지|반드시.{0,10}결혼|자녀는.{0,10}(천재|성공|될)/);
    }
  });
  it.each(RELATIONSHIP_STATUSES)("%s: actual state changes current scenes, household wording and conclusion", status => {
    const base = inputs[1].input;
    const r = composeLoveNarrative({ ...base, context: { ...base.context, relationshipStatus: status } });
    expect(r.ok).toBe(true); if (!r.ok) return;
    const text = narrativeText(r.narrative);
    expect(r.narrative.relationshipStatus).toBe(status);
    expect(r.editorial).toEqual([]);
    if (status !== "married") expect(text).not.toMatch(/기혼인 지금|함께 살고 있는 지금|당신의 배우자는/);
    if (status === "married") expect(text).not.toMatch(/솔로|썸에서는|아직 내 사람이|새 연인을 찾/);
    if (status === "dating") expect(text).not.toMatch(/짝사랑|솔로|소개팅을 늘/);
    expect(r.narrative.sections.find(s => s.id === "parenting")?.title).toContain("부모가 된다면");
  });
  it("six states have six actually different scenes and final paragraphs on one chart", () => {
    const values = RELATIONSHIP_STATUSES.map(status => {
      const r = composeLoveNarrative({ ...inputs[0].input, context: { ...inputs[0].input.context, relationshipStatus: status } });
      expect(r.ok).toBe(true); if (!r.ok) return [];
      return ["current", "home", "direction"].map(id => r.narrative.sections.find(s => s.id === id)?.blocks.map(b => b.text).join(" "));
    });
    for (let i = 0; i < 3; i++) expect(new Set(values.map(v => v[i])).size).toBe(6);
  });
  it("source trait IDs, use cases and non-ranking pair hints are real; coverage retained", () => {
    for (const { result } of reports) {
      if (!result.ok || !result.mbtiBasis) continue;
      const p = getMbtiSourceProfile(result.mbtiBasis.type)!;
      for (const t of result.mbtiBasis.traits) {
        expect(p.traits?.[t.area as "love"]?.some(v => v.id === t.id && v.sourceCoverage === t.sourceCoverage)).toBe(true);
      }
      expect(result.mbtiBasis.reportUseCases).toEqual(p.reportUseCases?.loveMarriageChildReport);
      expect(result.mbtiBasis.pairHint).toEqual(p.relationshipHints?.notablePairs?.[0]);
      expect(LOVE_VOICES[result.selection.voice]).toBeDefined();
    }
  });
  it("unknown hour does not invent deficit, hour markers or missing-chart certainty", () => {
    const r = reports[0].result; if (!r.ok) return;
    expect(r.selection.symbolicPartner).toBeNull();
    expect(r.materials.symbolicElements).toEqual([]);
    expect(narrativeText(r.narrative)).not.toMatch(/부족한 [목화토금수]|시주|도화|홍염/);
  });
  it("stable approximate slots retain confirmed pillars, not a made-up exact minute", () => {
    for (const i of [3, 7]) {
      const context = inputs[i].input.calculation.birthTimeContext!;
      expect(context.birthTimePrecision).toBe("approximate"); expect(context.stable.hour).toBe(true);
      expect(inputs[i].input.calculation.input.birthTime).toBeUndefined();
      expect(context.approximateBirthTimeSlot).toBeDefined();
    }
  });
});
