import { createHash } from "node:crypto";
import { isVerifiedBookConsumer } from "./bookBoundary";
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { composeLoveNarrative } from "../../../src/lib/interpretation-v4/loveComposer";
import { composeCareerNarrative } from "../../../src/lib/interpretation-v4/careerComposer";
import { narrativeText } from "../../../src/lib/interpretation-v4/editorialGuard";
import { selectLoveVoice } from "../../../src/lib/interpretation-v4/loveVoices";
import { loveFortune } from "../../../src/lib/interpretation-v4/loveFortune";
import { loveNatalScenes } from "../../../src/lib/interpretation-v4/loveNatalScenes";
import { loveFusionTurn } from "../../../src/lib/interpretation-v4/loveFusionScenes";
import { MBTI_SOURCE_TYPES } from "../../../src/lib/report-knowledge/mbti/sourceRuntimeAdapter";
import { RELATIONSHIP_STATUSES } from "../../../src/lib/report-generation/reportInputTypes";
import type { NarrativeInput, NarrativeState } from "../../../src/lib/interpretation-v4/narrativeTypes";
import { loveInputs } from "./loveFixtures";
import { careerInputs } from "./careerFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

// Phase 5A baseline plus reviewed Phase 7A prose; before/after and immutable
// evidence/proof hashes are recorded in finalEditorialBaseline.json.
const CAREER_HASHES = [
  "dacbdcbeb42b15b65ff6c25a348f6721a5d6164e959b57b7bea86a1b7b3e6760", "8201af77e7dc274593d739e7dfd454f5b16aaa7eae164e0ddcad42a6fd8883dc",
  "31152e39362b63ffbeef6b5dc6ffd213a9e0a3362b5ea01adbc0cf048cf1d16a", "509fe3c8b4a173e89e16d2592fe15e90ba67a7235a2ba3922d4ce0fb2085f884",
  "735309a7e92cea1eee3d7dc7ad6e6e89968ee000b27052575c0fe4d4e38e1f85", "443e99d5216d242f426faa379c4440ac75b3a9debb51622ac36de3ffa96707dc",
  "e4fab97f6ef08b6341fdffd9d77a7265a2a77203aacb9a6cc7359ee8d9c4a7c6", "dc68e33b76f7cb6c5dbfed65dc9e534f1afcedbe6511a045e5a4261935a693c8",
];
const inputs = loveInputs();
const stateFor = (input: NarrativeInput): NarrativeState => {
  const result = composeLoveNarrative(input); expect(result.ok).toBe(true);
  if (!result.ok) return null as unknown as NarrativeState;
  const packet = result.materials;
  return { input, packet, pillar: packet.selected.find(m => m.material.category === "dayPillar")!, master: packet.selected.find(m => m.material.category === "dayMaster")!, usedSeeds: new Set(), featureUses: new Map() };
};

describe("Love evidence and regression boundaries", () => {
  it.each(careerInputs().map((v, i) => ({ ...v, hash: CAREER_HASHES[i] })))("$fixture.id: reviewed Career narrative hash unchanged", ({ input, hash }) => {
    const r = composeCareerNarrative(input); expect(r.ok).toBe(true); if (!r.ok) return;
    expect(createHash("sha256").update(JSON.stringify(r.narrative)).digest("hex")).toBe(hash);
  });
  it.each(RELATIONSHIP_STATUSES)("%s: 16 MBTI x 8 actual charts, no state contradiction or editorial failure", status => {
    for (const { input } of inputs) for (const mbti of MBTI_SOURCE_TYPES) {
      const r = composeLoveNarrative({ ...input, mbti, context: { ...input.context, relationshipStatus: status } });
      expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.editorial, `${input.name}/${mbti}/${status}`).toEqual([]);
      const text = narrativeText(r.narrative);
      if (status !== "married") expect(text).not.toMatch(/기혼인 지금|함께 살고 있는 지금|당신의 배우자는/);
      if (["married", "marriage_preparing", "dating"].includes(status)) expect(text).not.toMatch(/지금 솔로|솔로 탈출|짝사랑|재회|이별 후/);
      expect(text).not.toMatch(/깊이은|다정함를|성실함이은|표현력를|子丑|sourceRefs|gwiin_|sinsal_|MBTI 궁합 순위/);
    }
  });
  it("all four charm cases use actual chart evidence and never conflate the two", () => {
    const cases = [{ index: 6, dohwa: true, hongyeom: false }, { index: 2, dohwa: false, hongyeom: true }, { index: 1, dohwa: true, hongyeom: true }, { index: 0, dohwa: false, hongyeom: false }];
    for (const c of cases) {
      const r = composeLoveNarrative(inputs[c.index].input); if (!r.ok) continue;
      const text = narrativeText(r.narrative);
      expect(text.includes("도화")).toBe(c.dohwa); expect(text.includes("홍염")).toBe(c.hongyeom);
      const blocks = r.narrative.sections.find(s => s.id === "fortune")!.blocks;
      if (c.dohwa) expect(blocks.find(b => b.proof.features.includes("sinsal_dohwa"))?.text).toMatch(/첫|처음|눈길|시선/);
      if (c.hongyeom) expect(blocks.find(b => b.proof.features.includes("sinsal_hongyeom"))?.text).toMatch(/가까|친밀|둘이/);
    }
  });
  it("absent strong evidence removes the copy, not merely its provenance label", () => {
    const state = stateFor(inputs[1].input);
    const bare: NarrativeState = { ...state, packet: { ...state.packet, selected: [state.pillar, state.master], fusions: [], fortuneComposites: [] } };
    expect(selectLoveVoice(bare)).toBeNull(); expect(loveFusionTurn(bare)).toBeUndefined();
    expect(loveNatalScenes(bare, "decisive")).toEqual([]);
    const fortune = loveFortune(bare, "natal");
    expect(fortune.map(b => b.text).join(" ")).not.toMatch(/도화|홍염|천을|월덕|장성|반안|귀인|사람복/);
    expect(fortune.flatMap(b => b.proof.features)).toEqual([state.pillar.feature]);
  });
  it("unknown and invalid MBTI keep natal material without guessing a type", () => {
    for (const mbti of [null, "", "UNKNOWN", "모름"]) {
      const r = composeLoveNarrative({ ...inputs[0].input, mbti }); expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.materials.fusions).toEqual([]); expect(r.mbtiBasis).toBeNull(); expect(r.selection.voice).toBe("natal");
      expect(r.editorial).toEqual([]);
      expect(narrativeText(r.narrative)).not.toMatch(/ENTJ|ISFP|MBTI가 없|정보가 부족|부족한 정보/);
      expect(r.narrative.sections.map(s => s.id)).toEqual(expect.arrayContaining(["current", "home", "parenting", "fortune", "direction"]));
    }
  });
  it("ambiguous mangsin and DB-only structures cannot enter Love body proof", () => {
    for (const { input } of inputs) {
      const r = composeLoveNarrative(input); if (!r.ok) continue;
      const proofs = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)].flatMap(b => b.proof.features);
      expect(proofs.join(" ")).not.toMatch(/mangsin|mungok|bokseong|cheoneuiseong|structure:WEALTH/);
      for (const held of r.materials.held) {
        // Verified output-low is deliberately held out of strong natal materials,
        // but may appear only in the existing supporting complement proof.
        if (held.feature === "distribution:output-low") {
          for (const block of [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)].filter(b => b.proof.features.includes(held.feature))) {
            expect(block.id).toBe("love-fusion-turn");
            expect(r.materials.fusions.filter(f => block.proof.fusionIds.includes(f.ruleId)).every(f => f.kind === "complement" && f.strength === "supporting")).toBe(true);
          }
        } else expect(proofs).not.toContain(held.feature);
      }
    }
  });
  it("six real counterfactuals change person/fortune/MBTI behavior without altering natal data", () => {
    const base = inputs[1].input, original = composeLoveNarrative(base); if (!original.ok) return;
    const examples = [];
    for (const mbti of ["ISFP", "INFJ", "INTP"]) {
      const r = composeLoveNarrative({ ...base, mbti }); expect(r.ok).toBe(true); if (!r.ok) continue;
      expect(r.materials.selected).toEqual(original.materials.selected);
      expect(r.narrative.opening).not.toEqual(original.narrative.opening);
      examples.push({ kind: "same-saju", mbti, headline: r.narrative.headline, opening: r.narrative.opening });
    }
    for (const { input } of [inputs[0], inputs[4], inputs[6]]) {
      const r = composeLoveNarrative({ ...base, calculation: input.calculation }); if (!r.ok) continue;
      expect(r.narrative.opening).not.toEqual(original.narrative.opening);
      expect(r.narrative.sections.find(s => s.id === "fortune")).not.toEqual(original.narrative.sections.find(s => s.id === "fortune"));
      examples.push({ kind: "same-mbti", date: input.calculation.input.birthDate, headline: r.narrative.headline, fortune: r.narrative.sections.find(s => s.id === "fortune") });
    }
    if (process.env.V4_PHASE5B_EXPORT === "1") writeFileSync("/tmp/gyeol-v4-phase5b/counterfactuals.json", JSON.stringify(examples, null, 2));
  });
  it("overlap, contrast and supporting complement are realized, not just tags", () => {
    const examples = [
      { input: inputs[1].input, kind: "overlap", match: /현침.*ENTJ/ },
      { input: { ...inputs[2].input, mbti: "ISFP", context: { ...inputs[2].input.context, relationshipStatus: "dating" as const } }, kind: "contrast", match: /천천히 마음을 여는.*홍염/ },
      { input: { ...fixtureInput(NARRATIVE_FIXTURES[5]), mbti: "ENFP" }, kind: "complement", match: /ENFP.*통로/ },
    ];
    const review = [];
    for (const c of examples) {
      const r = composeLoveNarrative(c.input); expect(r.ok).toBe(true); if (!r.ok) continue;
      const blocks = [...r.narrative.opening, ...r.narrative.sections.flatMap(s => s.blocks)];
      const block = blocks.find(b => c.match.test(b.text)); expect(block).toBeDefined();
      expect(block!.proof.fusionIds.some(id => r.materials.fusions.some(f => f.ruleId === id && f.kind === c.kind))).toBe(true);
      if (c.kind === "complement") expect(r.materials.fusions.filter(f => block!.proof.fusionIds.includes(f.ruleId)).every(f => f.strength === "supporting")).toBe(true);
      review.push({ kind: c.kind, date: c.input.calculation.input.birthDate, mbti: c.input.mbti, text: block!.text, proof: block!.proof });
    }
    if (process.env.V4_PHASE5B_EXPORT === "1") {
      mkdirSync("/tmp/gyeol-v4-phase5b", { recursive: true });
      writeFileSync("/tmp/gyeol-v4-phase5b/fusion-examples.json", JSON.stringify(review, null, 2));
    }
  });
  it("rejects invented relationship states and malformed input", () => {
    const base = inputs[0].input;
    for (const bad of [null, { ...base, name: "" }, { ...base, mbti: 42 }, ...["breakup", "reunion", "divorced"].map(status => ({ ...base, context: { ...base.context, relationshipStatus: status } }))]) {
      expect(composeLoveNarrative(bad as unknown as NarrativeInput)).toMatchObject({ ok: false });
    }
  });
  it("no V4 import in any existing runtime/UI/product/paid delivery file", () => {
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
