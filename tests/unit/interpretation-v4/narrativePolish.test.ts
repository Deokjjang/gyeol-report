import { expectBoundCohortReuse } from "./contentCohortAssertions";
import { mkdirSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { composeComprehensiveNarrative } from "../../../src/lib/interpretation-v4/comprehensiveComposer";
import { narrativeText, reviewNarrative, reviewNarrativeCohort, sentences } from "../../../src/lib/interpretation-v4/editorialGuard";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { narrativeContext } from "../../../src/lib/interpretation-v4/narrativeContext";
import { atomicFortunes, ATOMIC_FORTUNE } from "../../../src/lib/interpretation-v4/narrativeAtomicFortune";
import { EXPRESSION_RULES, realizeEditorialVariant } from "../../../src/lib/interpretation-v4/narrativeVariation";
import { FUSION_RULES } from "../../../src/lib/interpretation-v4/fusionRules";
import type { NarrativeState } from "../../../src/lib/interpretation-v4/narrativeTypes";

const results = NARRATIVE_FIXTURES.map(fixture => ({ fixture, result: composeComprehensiveNarrative(fixtureInput(fixture)) }));
const base = fixtureInput(NARRATIVE_FIXTURES[0]);
const counterfactuals = [
  ...["INTP", "ENFP", "ISFP"].map(mbti => ({ id: `same-saju-${mbti}`, input: { ...base, mbti }, change: "mbti" })),
  ...[3, 5, 7].map(index => ({ id: `same-ENTJ-chart-${index + 1}`, input: { ...base, calculation: fixtureInput(NARRATIVE_FIXTURES[index]).calculation }, change: "calculation" })),
];
describe("Phase 4B complete-text review", () => {
  it("exports a separate before/after review corpus, without touching the Phase 4A originals", () => {
    if (process.env.V4_PHASE4B_EXPORT !== "1") return;
    const directory = "/tmp/gyeol-v4-phase4b";
    mkdirSync(directory, { recursive: true });
    for (const { fixture, result } of results) if (result.ok) {
      writeFileSync(`${directory}/${fixture.id}.md`, `${fixture.name} · ${fixture.mbti ?? "MBTI 모름"} · ${fixture.context.detailJob}\n\n${narrativeText(result.narrative)}\n`);
      writeFileSync(`${directory}/${fixture.id}.json`, JSON.stringify({ fixture, ...result }, null, 2));
    }
    writeFileSync(`${directory}/cohort-qa.json`, JSON.stringify(reviewNarrativeCohort(results.flatMap(({ fixture, result }) => result.ok ? [{ id: fixture.id, narrative: result.narrative }] : [])), null, 2));
    const index = results.flatMap(({ fixture, result }) => result.ok ? [`- [${fixture.name}](${fixture.id}.md) · ${result.narrative.headline}`] : []);
    for (const { id, input } of counterfactuals) {
      const result = composeComprehensiveNarrative(input);
      if (!result.ok) continue;
      writeFileSync(`${directory}/counter-${id}.md`, `${id}\n\n${narrativeText(result.narrative)}\n`);
      writeFileSync(`${directory}/counter-${id}.json`, JSON.stringify({ input, ...result }, null, 2));
      index.push(`- [${id}](counter-${id}.md)`);
    }
    writeFileSync(`${directory}/index.md`, `# Phase 4B · 12 full reports + 6 counterfactuals\n\n${index.join("\n")}\n`);
  });
  it("distinct headlines and finals; shared explanations retain concrete common evidence", () => {
    const reports = results.flatMap(({ fixture, result }) => result.ok ? [{ id: fixture.id, narrative: result.narrative }] : []);
    expect(reports).toHaveLength(12);
    expectBoundCohortReuse(reports);
  });
  it.each(counterfactuals)("$id: change exactly one input axis, preserve evidence and create a different character", ({ input, change }) => {
    const result = composeComprehensiveNarrative(input), original = results[0].result;
    expect(result.ok && original.ok).toBe(true); if (!result.ok || !original.ok) return;
    expect(result.editorial).toEqual([]);
    expect(input.context).toEqual(base.context);
    expect(input.name).toBe(base.name);
    if (change === "mbti") {
      expect(input.calculation).toEqual(base.calculation);
      expect(result.materials.selected).toEqual(original.materials.selected);
    } else {
      expect(input.mbti).toBe(base.mbti);
      expect(result.materials.selected).not.toEqual(original.materials.selected);
    }
    expect(result.narrative.opening[0].text.replace(/ENTJ|INTP|ENFP|ISFP/g, "TYPE")).not.toEqual(original.narrative.opening[0].text.replace(/ENTJ/g, "TYPE"));
    expect(result.narrative.opening[0].proof.fusionIds).not.toEqual(original.narrative.opening[0].proof.fusionIds);
  });
  it("unknown MBTI is full natal prose, never a missing-personality warning", () => {
    const r = results.at(-1)!.result; expect(r.ok).toBe(true); if (!r.ok) return;
    expect(r.materials.fusions).toEqual([]);
    const text = narrativeText(r.narrative);
    expect(text).not.toMatch(/MBTI|[IE][NS][FT][JP]|유형을 알|정보가 부족|판단하기 어렵/);
    expect(r.narrative.sections.find(s => s.id === "fortune")!.blocks.length).toBeGreaterThanOrEqual(2);
    expect(text).toMatch(/장성/); expect(text).toMatch(/역마/);
    expect(text).toMatch(/바리스타 일을 하며 익힌/);
    expect(text).not.toMatch(/현재.*바리스타|매장에 출근/);
  });
  it("atomic positive copy is 3–4 substantive sentences and requires an eligible marker", () => {
    for (const [, text] of Object.values(ATOMIC_FORTUNE)) expect(sentences(text).length).toBeGreaterThanOrEqual(3);
    for (const { fixture, result } of results) {
      if (!result.ok) continue;
      const selected = result.materials.selected;
      const state: NarrativeState = { input: fixtureInput(fixture), packet: result.materials, pillar: selected.find(m => m.material.category === "dayPillar")!, master: selected.find(m => m.material.category === "dayMaster")!, usedSeeds: new Set(), featureUses: new Map() };
      const gifts = atomicFortunes(state);
      for (const gift of gifts) expect(selected.some(m => m.feature === gift.material.feature && m.heroEligible)).toBe(true);
      expect(atomicFortunes({ ...state, packet: { ...state.packet, selected: selected.filter(m => !(m.feature in ATOMIC_FORTUNE)) } })).toEqual([]);
      for (const gift of gifts) {
        const held = { ...state, packet: { ...state.packet, selected: selected.filter(m => m.feature !== gift.material.feature) } };
        expect(atomicFortunes(held).some(g => g.material.feature === gift.material.feature)).toBe(false);
      }
    }
  });
  it("normalizes functions and working mode rather than a list of fixture job names", () => {
    for (const detailJob of ["기술 문서 번역가", "영상 번역 프리랜서", "게임 현지화 담당", "회의 통역가"]) {
      const c = narrativeContext({ ...base, context: { ...base.context, jobStatus: "freelancer", detailJob } });
      expect(c.workFunction).toBe("language_mediation"); expect(c.scenes.learning).toContain("쓰임");
    }
    for (const detailJob of ["독립서점 운영", "동네 소매 매장", "문구샵 운영"]) {
      const c = narrativeContext({ ...base, context: { ...base.context, jobStatus: "self_employed", detailJob } });
      expect(c.workFunction).toBe("retail_operations"); expect(c.scenes.learning).toContain("다시 찾아온");
    }
    const consulting = narrativeContext({ ...base, context: { ...base.context, jobStatus: "self_employed", detailJob: "개발 컨설팅" } });
    expect(consulting.workFunction).not.toBe("retail_operations"); expect(consulting.money).not.toMatch(/들여온 물건|내 공간/);
    const care = narrativeContext(fixtureInput(NARRATIVE_FIXTURES[5]));
    expect(care.workFunction).toBe("caregiving"); expect(care.scenes.entry).toContain("하루의 순서");
    const rest = narrativeContext(fixtureInput(NARRATIVE_FIXTURES[11]));
    expect(rest.workFunction).toBe("recovery"); expect(rest.direction).not.toContain("현재 직업");
  });
  it("the source-selected variants do not depend on cohort order or name and keep full paragraphs", () => {
    for (const { fixture, result } of [...results].reverse()) {
      expect(composeComprehensiveNarrative(fixtureInput(fixture))).toEqual(result);
    }
    const r = results[0].result; if (!r.ok) return;
    const state: NarrativeState = { input: base, packet: r.materials, pillar: r.materials.selected.find(m => m.material.category === "dayPillar")!, master: r.materials.selected.find(m => m.material.category === "dayMaster")!, usedSeeds: new Set(), featureUses: new Map() };
    const unrelated = { ...r.narrative.opening[0], id: "unrelated", text: "남겨둬야 할 고객 문장입니다. 남겨둬야 할 고객 문장입니다.", proof: { features: [], seedIds: [], fusionIds: [], sourceRefs: [] } };
    expect(realizeEditorialVariant(state, unrelated)).toEqual(unrelated);
  });
  it("semantic/scene/weak-fortune guards report problems without removing customer prose", () => {
    const r = results[0].result; if (!r.ok) return;
    const original = r.narrative;
    const noisy = { ...original, opening: [...original.opening, ...["첫 장면을 씁니다.", "다음 장면을 씁니다.", "세 번째 장면입니다."].map((text, i) => ({ ...original.opening[0], id: `noise-${i}`, text, scene: undefined, editorial: { variant: `noise-${i}`, sceneFamily: "same-scene", theme: "same-meaning" } }))], sections: original.sections.map(s => s.id === "fortune" ? { ...s, blocks: [{ ...s.blocks[0], text: "좋은 힘이 있습니다." }] } : s) };
    const before = JSON.stringify(noisy);
    expect(reviewNarrative(noisy).map(i => i.code)).toEqual(expect.arrayContaining(["SAME_SCENE_FAMILY", "NEAR_SEMANTIC_REPETITION", "WEAK_POSITIVE_SECTION"]));
    expect(JSON.stringify(noisy)).toBe(before);
    const repeated = reviewNarrativeCohort([{ id: "one", narrative: original }, { id: "two", narrative: original }]);
    expect(repeated.map(i => i.code)).toEqual(expect.arrayContaining(["COHORT_EXACT_SENTENCE", "COHORT_LONG_SPAN", "COHORT_HEADLINE", "COHORT_FINAL_LINE"]));
  });
  it("Korean object particles agree with every selected scene", () => {
    for (const { result } of results) if (result.ok) expect(narrativeText(result.narrative)).not.toMatch(/자리을|대화를를|순간를|시간를|겁재은/);
  });
  it("every expression selector uses an existing reviewed rule, not an invented MBTI inference", () => {
    const supported = new Set(FUSION_RULES.map(r => r.id));
    for (const id of Object.values(EXPRESSION_RULES).flat()) expect(supported.has(id), id).toBe(true);
    for (const { id, input } of counterfactuals.filter(c => c.change === "mbti")) {
      const r = composeComprehensiveNarrative(input); if (!r.ok) continue;
      const bridge = r.narrative.opening.find(b => b.id === "opening-bridge")!;
      if (id.endsWith("ISFP")) expect(bridge.text).not.toMatch(/작은 차이를 잡는 명리의 눈/);
      if (id.endsWith("INTP")) expect(bridge.text).not.toMatch(/버거운 일을 이해로 바꾸는/);
    }
  });
});
