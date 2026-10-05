import { describe, expect, it } from "vitest";
import { BIPOLAR_AXES, BIPOLAR_DIRECTIONS, SEMANTIC_AXES, STRENGTH_AXES, type SemanticSignature } from "../../../src/lib/interpretation-v4/semanticCore";
import { YIN_YANG_COPY, YIN_YANG_DESCRIPTIONS, YIN_YANG_SIGNATURES, YIN_YANG_MULTIPLIERS, buildYinYangEvidence, classifyFoundationYinYang } from "../../../src/lib/interpretation-v4/foundationYinYang";
import { FOUNDATION_ELEMENTS, FOUNDATION_ELEMENT_REGISTRY, ELEMENT_STATE_MULTIPLIERS, buildElementEvidence, type FoundationElementState } from "../../../src/lib/interpretation-v4/foundationElements";
import { STRONG_ELEMENT_PAIRS, STRONGEST_WEAKEST_RULES, YIN_YANG_ELEMENT_RULES } from "../../../src/lib/interpretation-v4/foundationSynthesis";
import { buildFoundationProfile, type FoundationInput } from "../../../src/lib/interpretation-v4/foundationProfile";

function input(yinCount = 4): FoundationInput {
  return { yinYang: { yinCount, yangCount: 8 - yinCount },
    elements: Object.fromEntries(FOUNDATION_ELEMENTS.map(e => [e, { state: "BALANCED", weightedScore: 2 }])) as FoundationInput["elements"] };
}
function profile(i: FoundationInput) {
  const r = buildFoundationProfile(i);
  expect(r.ok).toBe(true);
  if (!r.ok) return expect.unreachable(r.error);
  return r.value;
}
const strongStates = ["STRONG", "VERY_STRONG"] as const;
const nonStrongStates = ["BALANCED", "WEAK", "VERY_WEAK"] as const;
const states = Object.keys(ELEMENT_STATE_MULTIPLIERS) as FoundationElementState[];

describe("Canonical semantic axes and type boundary", () => {
  it("has exactly 8 bipolar and 28 strength axes, with signed direction definitions", () => {
    expect(BIPOLAR_AXES).toHaveLength(8); expect(STRENGTH_AXES).toHaveLength(28);
    expect(SEMANTIC_AXES).toHaveLength(36); expect(new Set(SEMANTIC_AXES).size).toBe(36);
    expect(Object.keys(BIPOLAR_DIRECTIONS)).toEqual([...BIPOLAR_AXES]);
    expect(BIPOLAR_DIRECTIONS.DECISION_STYLE).toEqual(["가능성을 열어둠", "결론·결정"]);
    for (const invalid of ["INWARDNESS", "DIRECTNESS", "STRUCTURE", "NOVELTY", "DECISIVENESS", "LOGIC", "EMPATHY", "AMBITION"]) {
      expect(SEMANTIC_AXES).not.toContain(invalid);
    }
    // @ts-expect-error Ad-hoc axes cannot enter typed registries.
    const invalid: SemanticSignature = { INWARDNESS: 1 };
    void invalid;
  });
  it("all registry axes are canonical, strength axes never carry negative values", () => {
    for (const signature of [...Object.values(YIN_YANG_SIGNATURES), ...Object.values(FOUNDATION_ELEMENT_REGISTRY).map(d => d.axes)]) {
      for (const [axis, value] of Object.entries(signature)) {
        expect(SEMANTIC_AXES).toContain(axis);
        if ((STRENGTH_AXES as readonly string[]).includes(axis)) expect(value).toBeGreaterThanOrEqual(0);
      }
    }
    for (const rule of [...STRONG_ELEMENT_PAIRS, ...STRONGEST_WEAKEST_RULES, ...YIN_YANG_ELEMENT_RULES]) {
      rule.primaryAxes.forEach(axis => expect(SEMANTIC_AXES).toContain(axis));
      expect(rule.contexts.length).toBeGreaterThan(0);
    }
  });
});

describe("Visible-eight yin/yang, no guessed hour or personality type", () => {
  it.each([
    [0, "EXTREME_YANG"], [1, "EXTREME_YANG"], [2, "STRONG_YANG"], [3, "MILD_YANG"],
    [4, "BALANCED"], [5, "MILD_YIN"], [6, "STRONG_YIN"], [7, "EXTREME_YIN"], [8, "EXTREME_YIN"],
  ] as const)("yin %i: %s", (yin, state) => {
    expect(classifyFoundationYinYang(yin, 8 - yin)).toEqual({ ok: true, value: state });
    const p = profile(input(yin)), atom = p.evidence[0];
    expect(atom.weight).toBe(YIN_YANG_MULTIPLIERS[state]);
    expect(atom.metadata).toMatchObject({ yinCount: yin, yangCount: 8 - yin, state, mainClaimEligible: state !== "BALANCED" });
    const signature: SemanticSignature = state === "BALANCED" ? {} : YIN_YANG_SIGNATURES[yin < 4 ? "YANG" : "YIN"];
    expect(atom.axes).toEqual(signature);
    for (const axis of SEMANTIC_AXES) {
      const contribution = p.contributions[axis]?.find(c => c.sourceType === "yin_yang");
      expect(contribution?.weightedValue ?? 0).toBe((signature[axis] ?? 0) * YIN_YANG_MULTIPLIERS[state]);
    }
  });
  it.each([[3, 3], [-1, 9], [9, -1], [4.5, 3.5], [NaN, 8], [Infinity, -Infinity], [0, 0]])("invalid %s/%s fails without correction or partial data", (yin, yang) => {
    expect(buildYinYangEvidence(yin, yang)).toEqual({ ok: false, error: "INVALID_YIN_YANG_COUNTS" });
    expect(buildFoundationProfile({ ...input(), yinYang: { yinCount: yin, yangCount: yang } })).toEqual({ ok: false, error: "INVALID_YIN_YANG_COUNTS" });
  });
  it("balanced preserves 4:4 metadata but contributes no directional main claim", () => {
    const p = profile(input());
    expect(p.evidence[0]).toMatchObject({ axes: {}, weight: 0, metadata: { mainClaimEligible: false, yinCount: 4, yangCount: 4 } });
    expect(Object.values(p.contributions).flat().some(c => c.sourceType === "yin_yang")).toBe(false);
    expect(p.synthesisCandidates).toEqual([]);
  });
  it("uses the specified signed Yang/Yin signatures, not E/I or social skill", () => {
    expect(YIN_YANG_SIGNATURES.YANG).toEqual({ ACTION_TEMPO: 2, ENERGY_DIRECTION: 2, DECISION_STYLE: 1, COMMUNICATION_STYLE: 1, CHANGE_ORIENTATION: 1, INITIATIVE: 2, EXPANSION: 1, EXPRESSION: 1 });
    expect(YIN_YANG_SIGNATURES.YIN).toEqual({ ACTION_TEMPO: -2, ENERGY_DIRECTION: -2, DECISION_STYLE: -1, COMMUNICATION_STYLE: -1, CHANGE_ORIENTATION: -1, DEPTH: 2, PERSISTENCE: 1, STABILITY: 1, RECOVERY_NEED: 1 });
    expect(JSON.stringify([YIN_YANG_COPY, YIN_YANG_DESCRIPTIONS])).not.toMatch(/외향형|내향형|사회성이 낮|소극적|성격이 급/);
  });
});

describe("Five-element registry and weak safety", () => {
  it("keeps all five exact axis maps", () => {
    expect(Object.fromEntries(FOUNDATION_ELEMENTS.map(e => [e, FOUNDATION_ELEMENT_REGISTRY[e].axes]))).toEqual({
      WOOD: { INITIATIVE: 1, GOAL_DRIVE: 1, EXPANSION: 2, PERSISTENCE: 1, ADAPTABILITY: 1 },
      FIRE: { ENERGY_DIRECTION: 2, EXPRESSION: 2, CHARISMA: 2, CREATION: 1, INITIATIVE: 1 },
      EARTH: { STRUCTURE_STYLE: 2, STABILITY: 2, PRACTICALITY: 2, PERSISTENCE: 1, DUTY: 1, RESOURCE_SENSE: 1 },
      METAL: { STRUCTURE_STYLE: 2, DECISION_STYLE: 1, COMMUNICATION_STYLE: 1, PRECISION: 2, BOUNDARY: 2, STRATEGY: 1, PRACTICALITY: 1 },
      WATER: { ACTION_TEMPO: -1, ENERGY_DIRECTION: -1, STRUCTURE_STYLE: -1, DEPTH: 2, ADAPTABILITY: 2, PATTERN_SENSE: 1, CURIOSITY: 1, LEARNING: 1, RECOVERY_NEED: 1 },
    });
    expect(ELEMENT_STATE_MULTIPLIERS).toEqual({ VERY_STRONG: 1.5, STRONG: 1, BALANCED: 0.5, WEAK: 0.15, VERY_WEAK: 0 });
  });
  it.each(FOUNDATION_ELEMENTS.flatMap(e => states.map(state => [e, state] as const)))("%s/%s: scales only, never inverts weak axes", (element, state) => {
    const atom = buildElementEvidence(element, { state, weightedScore: 2 });
    expect(atom.axes).toEqual(FOUNDATION_ELEMENT_REGISTRY[element].axes);
    expect(atom.weight).toBe(ELEMENT_STATE_MULTIPLIERS[state]);
    const i = input(); i.elements[element] = { state, weightedScore: 2 };
    const p = profile(i);
    for (const axis of SEMANTIC_AXES) {
      const raw = (FOUNDATION_ELEMENT_REGISTRY[element].axes as SemanticSignature)[axis];
      const c = p.contributions[axis]?.find(c => c.sourceKey === element);
      if (raw === undefined) expect(c).toBeUndefined();
      else expect(c).toMatchObject({ rawValue: raw, weightedValue: state === "VERY_WEAK" ? 0 : raw * ELEMENT_STATE_MULTIPLIERS[state] });
    }
    if (state === "WEAK" || state === "VERY_WEAK") {
      expect(atom.humanDescription).toBe(FOUNDATION_ELEMENT_REGISTRY[element].weakDescription);
      expect(atom.positiveMeaning).toBeUndefined(); expect(atom.shadowMeaning).toBeUndefined();
      expect(atom.metadata?.mainClaimEligible).toBe(false);
    }
    if (state === "BALANCED") expect(atom.humanDescription).toBeUndefined();
    expect(JSON.parse(JSON.stringify(p))).toEqual(p);
  });
  it.each([NaN, Infinity, -1])("invalid canonical weight %s is rejected", weightedScore => {
    const i = input(); i.elements.FIRE.weightedScore = weightedScore;
    expect(buildFoundationProfile(i)).toEqual({ ok: false, error: "INVALID_ELEMENT_INPUT" });
  });
  it("rejects missing and unknown states at the runtime boundary", () => {
    const i = input(); Reflect.deleteProperty(i.elements, "WATER");
    expect(buildFoundationProfile(i)).toEqual({ ok: false, error: "INVALID_ELEMENT_INPUT" });
    const bad = input(); Object.assign(bad.elements.FIRE, { state: "EXTREME" });
    expect(buildFoundationProfile(bad)).toEqual({ ok: false, error: "INVALID_ELEMENT_INPUT" });
  });
});

describe("10 strong element pairs", () => {
  it("covers each unordered distinct pair once", () => {
    expect(STRONG_ELEMENT_PAIRS).toHaveLength(10);
    const actual = STRONG_ELEMENT_PAIRS.map(r => [...r.requiredElements].sort().join("/"));
    const expected = FOUNDATION_ELEMENTS.flatMap((a, i) => FOUNDATION_ELEMENTS.slice(i + 1).map(b => [a, b].sort().join("/")));
    expect(actual.toSorted()).toEqual(expected.toSorted());
  });
  it.each(STRONG_ELEMENT_PAIRS)("$semanticTheme: both must be strong, either order", rule => {
    const [a, b] = rule.requiredElements;
    for (const sa of states) for (const sb of states) {
      const i = input(); i.elements[a].state = sa; i.elements[b].state = sb;
      const p = profile(i), c = p.synthesisCandidates.find(c => c.semanticTheme === rule.semanticTheme);
      const expected = (strongStates as readonly string[]).includes(sa) && (strongStates as readonly string[]).includes(sb);
      expect(Boolean(c), `${sa}/${sb}`).toBe(expected);
      if (c) {
        expect(c.humanDescription).toBe(rule.humanDescription);
        expect(c.evidenceIds).toEqual([`foundation:element:${a}:${sa}`, `foundation:element:${b}:${sb}`]);
        expect(c.exclusivityGroup).toBeTruthy(); expect(c.strength).toBe("MAIN");
      }
    }
  });
  it("retains precise-deep-analysis meaning verbatim", () => {
    expect(STRONG_ELEMENT_PAIRS.find(r => r.semanticTheme === "PRECISE_DEEP_ANALYSIS")?.humanDescription)
      .toBe("작은 오류를 보는 눈과 그 오류가 왜 생겼는지 파고드는 성향이 같이 있습니다.");
  });
});

describe("20 unique strongest × weakest combinations", () => {
  it("covers every ordered distinct pair, not self pairs", () => {
    expect(STRONGEST_WEAKEST_RULES).toHaveLength(20);
    expect(STRONGEST_WEAKEST_RULES.map(r => `${r.strongest}/${r.weakest}`).toSorted())
      .toEqual(FOUNDATION_ELEMENTS.flatMap(a => FOUNDATION_ELEMENTS.filter(b => a !== b).map(b => `${a}/${b}`)).toSorted());
  });
  it.each(STRONGEST_WEAKEST_RULES)("$strongest / $weakest: requires canonical states plus unique scores", rule => {
    for (const highState of states) for (const lowState of states) {
      const i = input(); i.elements[rule.strongest] = { state: highState, weightedScore: 5 };
      i.elements[rule.weakest] = { state: lowState, weightedScore: 0.5 };
      const p = profile(i), c = p.synthesisCandidates.find(c => c.source === "STRONGEST_WEAKEST");
      expect(p.elements).toMatchObject({ strongest: rule.strongest, weakest: rule.weakest, strongestIsUnique: true, weakestIsUnique: true });
      expect(Boolean(c)).toBe((highState === "STRONG" || highState === "VERY_STRONG") && (lowState === "WEAK" || lowState === "VERY_WEAK"));
      if (c) expect(c.humanDescription).toBe(rule.humanDescription);
    }
  });
  it.each(["top", "bottom", "all"])("%s tie stays unresolved, never picked by iteration order", kind => {
    const i = input();
    if (kind !== "all") {
      i.elements.FIRE = { state: "STRONG", weightedScore: 5 };
      i.elements.EARTH = { state: "WEAK", weightedScore: 0.5 };
      i.elements.WOOD = kind === "top" ? { state: "STRONG", weightedScore: 5 } : { state: "WEAK", weightedScore: 0.5 };
    }
    const p = profile(i);
    expect(p.synthesisCandidates.some(c => c.source === "STRONGEST_WEAKEST")).toBe(false);
    if (kind !== "bottom") { expect(p.elements.strongestIsUnique).toBe(false); expect(p.elements.strongest).toBeUndefined(); }
    if (kind !== "top") { expect(p.elements.weakestIsUnique).toBe(false); expect(p.elements.weakest).toBeUndefined(); }
  });
});

describe("10 polarity × element combinations", () => {
  it("covers each polarity and element exactly once", () => {
    expect(YIN_YANG_ELEMENT_RULES).toHaveLength(10);
    expect(YIN_YANG_ELEMENT_RULES.map(r => `${r.polarity}/${r.element}`).toSorted())
      .toEqual(["YIN", "YANG"].flatMap(p => FOUNDATION_ELEMENTS.map(e => `${p}/${e}`)).toSorted());
  });
  it.each(YIN_YANG_ELEMENT_RULES)("$semanticTheme: strong/extreme only and strong elements only", rule => {
    for (let yin = 0; yin <= 8; yin++) for (const state of states) {
      const i = input(yin); i.elements[rule.element].state = state;
      const c = profile(i).synthesisCandidates.find(c => c.semanticTheme === rule.semanticTheme);
      expect(Boolean(c)).toBe((rule.polarity === "YANG" ? yin <= 2 : yin >= 6) && (state === "STRONG" || state === "VERY_STRONG"));
      if (c) expect(c.humanDescription).toBe(rule.humanDescription);
    }
  });
  it("Yin-metal does not turn into a direct/public expression claim", () => {
    expect(YIN_YANG_ELEMENT_RULES.find(r => r.semanticTheme === "YIN_METAL")?.humanDescription)
      .toBe("속으로는 기준이 꽤 분명하지만 그 생각을 매번 다 말하지는 않는 편입니다.");
  });
});

describe("Manual sanity contracts, traceability, determinism and language", () => {
  it("A: extreme yang + metal/water + weak fire retains all compatible candidates", () => {
    const i = input(0); i.elements.METAL = { state: "STRONG", weightedScore: 5 };
    i.elements.WATER = { state: "STRONG", weightedScore: 4 }; i.elements.FIRE = { state: "WEAK", weightedScore: 0.5 };
    const p = profile(i);
    expect(p.yinYang.state).toBe("EXTREME_YANG");
    expect(p.synthesisCandidates.map(c => c.semanticTheme)).toEqual([
      "JUDGMENT_BEFORE_EXPRESSION", "PRECISE_DEEP_ANALYSIS", "YANG_METAL", "YANG_WATER",
    ]);
    for (const c of p.synthesisCandidates) expect(c.evidenceIds.every(id => p.evidence.some(e => e.id === id))).toBe(true);
    for (const axis of SEMANTIC_AXES) expect(p.axes[axis]).toBe((p.contributions[axis] ?? []).reduce((sum, c) => sum + c.weightedValue, 0));
    expect(p.axes.LEADERSHIP).toBe(0); expect(p.axes.STATUS_DRIVE).toBe(0);
  });
  it("B: strong yin + wood keeps quiet but meaningful direction", () => {
    const i = input(6); i.elements.WOOD.state = "STRONG";
    expect(profile(i).synthesisCandidates.find(c => c.semanticTheme === "YIN_WOOD")?.secondaryDescription)
      .toBe("조용해 보여도 목표까지 작은 사람은 아닙니다.");
  });
  it("C: Earth very strong is resource sense, not wealth/status/fortune", () => {
    const i = input(); i.elements.EARTH = { state: "VERY_STRONG", weightedScore: 7 };
    const p = profile(i);
    expect(p.axes.RESOURCE_SENSE).toBe(1.5); expect(p.evidence[0].metadata?.mainClaimEligible).toBe(false);
    expect(p.evidence.every(e => e.kind === "TRAIT")).toBe(true);
    expect(p.synthesisCandidates).toEqual([]);
    expect(JSON.stringify(p)).not.toMatch(/재물운|부자|돈복|명예운|사람복|wealth|FORTUNE/);
  });
  it("D: strong fire + unique weak earth preserves the specified real-life meaning", () => {
    const i = input(); i.elements.FIRE = { state: "STRONG", weightedScore: 5 }; i.elements.EARTH = { state: "WEAK", weightedScore: 0.5 };
    expect(profile(i).synthesisCandidates.find(c => c.source === "STRONGEST_WEAKEST")?.humanDescription)
      .toBe("말하고 보여주는 속도는 빠른데 생활을 일정하게 굴리는 마지막 관리가 밀릴 수 있습니다.");
  });
  it("same input/registry and permuted object insertion order give identical detached profiles", () => {
    const i = input(8); i.elements.METAL.state = "STRONG"; i.elements.WATER.state = "STRONG";
    const original = structuredClone(i), a = profile(i), b = profile(i);
    expect(a).toEqual(b); expect(i).toEqual(original);
    const reversed = { ...i, elements: Object.fromEntries(Object.entries(i.elements).reverse()) as FoundationInput["elements"] };
    expect(profile(reversed)).toEqual(a);
    expect(JSON.parse(JSON.stringify(a))).toEqual(a);
    a.evidence[1].axes.EXPANSION = 100;
    expect(profile(i)).toEqual(b); expect(FOUNDATION_ELEMENT_REGISTRY.WOOD.axes.EXPANSION).toBe(2);
    expect(new Set(b.synthesisCandidates.map(c => c.id)).size).toBe(b.synthesisCandidates.length);
  });
  it("all source language excludes abstract jargon, unsupported fortune and hard-negative absence", () => {
    const text = JSON.stringify([FOUNDATION_ELEMENT_REGISTRY, YIN_YANG_COPY, YIN_YANG_DESCRIPTIONS,
      STRONG_ELEMENT_PAIRS, STRONGEST_WEAKEST_RULES, YIN_YANG_ELEMENT_RULES]);
    expect(text).not.toMatch(/발현|양상|상호작용|경향성이 있습니다|사회적 지위|역할과 이름|내적 성찰|재정적 성취|복합적으로 작용|로 해석될 여지가 있습니다|의 측면에서/);
    expect(text).not.toMatch(/재물운|돈복|부자|명예운|사람복|성공합니다|사업가 기질|연애운|높은 직책|표현력이 없|추진력이 없|판단력이 없|생각이 얕|알아주길 바/);
  });
  it.each(nonStrongStates)("%s cannot produce strong composites even if its numeric score is highest", state => {
    const i = input(0); i.elements.FIRE = { state, weightedScore: 100 }; i.elements.WATER.state = "WEAK";
    expect(profile(i).synthesisCandidates).toEqual([]);
  });
});
