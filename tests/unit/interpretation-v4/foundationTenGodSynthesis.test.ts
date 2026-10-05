import { describe, expect, it } from "vitest";
import type { TenGod } from "../../../src/lib/saju/types";
import { aggregateSemanticEvidence, type EvidenceAtom } from "../../../src/lib/interpretation-v4/semanticCore";
import { HEAVENLY_STEM_SEMANTICS, EARTHLY_BRANCH_SEMANTICS } from "../../../src/lib/interpretation-v4/foundationPillars";
import { TEN_GOD_FAMILIES, TEN_GOD_FAMILY_SEMANTICS, TEN_GOD_SEMANTICS, type NormalizedTenGodStates, type TenGodFamily, type VerifiedIntensity } from "../../../src/lib/interpretation-v4/foundationTenGods";
import { buildTenGodCandidates, TEN_GOD_PAIR_RULES, TEN_GOD_CHAIN_RULES, SPECIFIC_TEN_GOD_RULES, DAY_MASTER_TEN_GOD_RULES } from "../../../src/lib/interpretation-v4/foundationTenGodSynthesis";

/** Explicit normalized semantic fixtures, NOT fake calculated birth charts. */
function normalized() {
  const evidence: EvidenceAtom[] = (Object.keys(TEN_GOD_SEMANTICS) as TenGod[]).map(god => {
    const def = TEN_GOD_SEMANTICS[god];
    return { id: `fixture:${god}`, sourceType: "ten_god", sourceKey: god, kind: "TRAIT", tier: "CORE", strength: "STRONG", weight: 1,
      ...def, contexts: [...def.contexts], metadata: { canonicalWeight: 1 } };
  });
  const def = HEAVENLY_STEM_SEMANTICS.庚;
  evidence.push({ id: "fixture:day-master", sourceType: "heavenly_stem", sourceKey: "庚", kind: "TRAIT", tier: "CORE", strength: "STRONG", weight: 1,
    ...def, contexts: [...def.contexts], metadata: { isDayMaster: true } });
  const states: NormalizedTenGodStates = { families: {}, gods: {} };
  const family = (f: TenGodFamily, state: VerifiedIntensity["state"] = "HIGH") => {
    states.families[f] = { state, evidenceIds: evidence.filter(e => e.family === f).map(e => e.id), provenance: [`explicit-normalized-fixture:family:${f}:${state}`] };
  };
  const god = (g: TenGod, state: VerifiedIntensity["state"] = "HIGH") => {
    states.gods[g] = { state, evidenceIds: [`fixture:${g}`], provenance: [`explicit-normalized-fixture:god:${g}:${state}`] };
  };
  const dayMaster = (state: "STRONG" | "WEAK" | "BALANCED") => {
    states.dayMaster = { state, evidenceIds: ["fixture:day-master"], provenance: [`explicit-normalized-fixture:day-master:${state}`] };
  };
  return { states, evidence, family, god, dayMaster, run: () => buildTenGodCandidates(states, evidence) };
}

describe("13D-1B normalized family synthesis (no raw-count detectors)", () => {
  it("10 unique unordered pairs / 5 explicit chains / 3 specifics / 10 modifiers", () => {
    expect(TEN_GOD_PAIR_RULES).toHaveLength(10);
    expect(new Set(TEN_GOD_PAIR_RULES.map(r => [...r.families].sort().join("+"))).size).toBe(10);
    expect(TEN_GOD_CHAIN_RULES).toHaveLength(5);
    expect(SPECIFIC_TEN_GOD_RULES).toHaveLength(3);
    expect(DAY_MASTER_TEN_GOD_RULES).toHaveLength(10);
  });
  it.each(TEN_GOD_PAIR_RULES)("$id pair requires both independently eligible families", rule => {
    const f = normalized();
    rule.families.forEach(family => f.family(family, "MEANINGFUL"));
    const result = f.run().find(c => c.id === rule.id)!;
    expect(result).toMatchObject({ source: "TEN_GOD_FAMILY_PAIR", semanticTheme: rule.id, strength: "MAIN", priority: 30,
      primaryAxes: [...rule.primaryAxes], humanDescription: rule.humanDescription, positiveMeaning: rule.positiveMeaning, shadowMeaning: rule.shadowMeaning });
    expect(result.evidenceIds).toHaveLength(4);
    for (const state of ["WEAK", "UNCERTAIN", "SUPPORT"] as const) {
      f.family(rule.families[0], state);
      expect(f.run().some(c => c.id === rule.id)).toBe(false);
    }
    delete f.states.families[rule.families[0]];
    expect(f.run().some(c => c.id === rule.id)).toBe(false);
  });
  it.each(TEN_GOD_CHAIN_RULES)("$id chain needs all 3, retains pair candidates without double aggregation", rule => {
    const f = normalized(); rule.families.forEach(family => f.family(family));
    const before = aggregateSemanticEvidence(f.evidence);
    const candidates = f.run();
    expect(candidates.find(c => c.id === rule.id)).toMatchObject({ source: "TEN_GOD_CHAIN", strength: "SIGNATURE", priority: 50, humanDescription: rule.humanDescription });
    expect(candidates.filter(c => c.source === "TEN_GOD_FAMILY_PAIR")).toHaveLength(3);
    expect(aggregateSemanticEvidence(f.evidence)).toEqual(before);
    for (const family of rule.families) {
      f.family(family, "WEAK"); expect(f.run().some(c => c.id === rule.id)).toBe(false); f.family(family);
      delete f.states.families[family]; expect(f.run().some(c => c.id === rule.id)).toBe(false); f.family(family);
    }
  });
  it.each(SPECIFIC_TEN_GOD_RULES)("$id uses exact gods, not the other member of the family", rule => {
    const f = normalized(); rule.families.forEach(v => f.family(v)); rule.gods.forEach(v => f.god(v));
    expect(f.run().find(c => c.id === rule.id)).toMatchObject({ source: "SPECIFIC_TEN_GOD", priority: 30, humanDescription: rule.humanDescription, primaryAxes: [...rule.primaryAxes] });
    const first = rule.gods[0];
    delete f.states.gods[first];
    const sibling = TEN_GOD_FAMILY_SEMANTICS[TEN_GOD_SEMANTICS[first].family].members.find(g => g !== first)!;
    f.god(sibling);
    expect(f.run().some(c => c.id === rule.id)).toBe(false);
    f.god(first, "WEAK"); expect(f.run().some(c => c.id === rule.id)).toBe(false);
  });
  it.each(DAY_MASTER_TEN_GOD_RULES)("$id needs authoritative day-master + family state", rule => {
    const f = normalized(); f.dayMaster(rule.dayMaster); f.family(rule.family, rule.intensity);
    expect(f.run().find(c => c.id === rule.id)).toMatchObject({ source: "DAY_MASTER_TEN_GOD", priority: 40, strength: "MAIN", humanDescription: rule.humanDescription });
    f.dayMaster("BALANCED"); expect(f.run().some(c => c.id === rule.id)).toBe(false);
    delete f.states.dayMaster; expect(f.run().some(c => c.id === rule.id)).toBe(false);
    f.dayMaster(rule.dayMaster); f.family(rule.family, rule.intensity === "HIGH" ? "SUPPORT" : "HIGH");
    expect(f.run().some(c => c.id === rule.id)).toBe(false);
    delete f.states.families[rule.family]; expect(f.run().some(c => c.id === rule.id)).toBe(false);
  });
  it("presence/quantity alone activates nothing; missing provenance and wrong evidence refs are suppressed", () => {
    const f = normalized();
    expect(f.run()).toEqual([]);
    f.evidence.forEach(e => { e.weight = 99; });
    expect(f.run()).toEqual([]);
    f.family("OUTPUT"); f.family("RESOURCE");
    f.states.families.OUTPUT!.provenance = [];
    expect(f.run()).toEqual([]);
    f.family("OUTPUT"); f.states.families.OUTPUT!.evidenceIds = ["missing-id"];
    expect(f.run()).toEqual([]);
    f.states.families.OUTPUT!.evidenceIds = ["fixture:正印"];
    expect(f.run()).toEqual([]);
    f.states.families.OUTPUT!.evidenceIds = [];
    expect(f.run()).toEqual([]);
    f.family("OUTPUT"); f.dayMaster("STRONG");
    f.states.dayMaster!.evidenceIds = ["fixture:偏官"];
    expect(f.run().some(c => c.source === "DAY_MASTER_TEN_GOD")).toBe(false);
  });
  it("specific/pair overlap remains visible to the later scheduler", () => {
    const f = normalized(); f.family("OUTPUT"); f.family("RESOURCE"); f.god("偏印"); f.god("食神");
    const candidates = f.run(), pair = candidates.find(c => c.id === "LEARNING_TO_OUTPUT")!, specific = candidates.find(c => c.id === "UNUSUAL_THOUGHT_TO_OUTPUT")!;
    expect(candidates).toHaveLength(2);
    expect(pair.exclusivityGroup).toBe(specific.exclusivityGroup);
    expect(pair.evidenceIds).toEqual(expect.arrayContaining(specific.evidenceIds));
    expect(pair.semanticTheme).not.toBe(specific.semanticTheme);
  });
  it("all candidates/provenance/order deterministic; priorities composite > modifier > pair", () => {
    const f = normalized(); TEN_GOD_FAMILIES.forEach(v => f.family(v)); Object.keys(TEN_GOD_SEMANTICS).forEach(g => f.god(g as TenGod)); f.dayMaster("STRONG");
    const before = structuredClone({ states: f.states, evidence: f.evidence });
    const candidates = f.run();
    expect(candidates).toHaveLength(23);
    expect(new Set(candidates.map(c => c.id)).size).toBe(candidates.length);
    expect(f.run()).toEqual(candidates);
    expect(buildTenGodCandidates(f.states, [...f.evidence].reverse())).toEqual(candidates);
    expect({ states: f.states, evidence: f.evidence }).toEqual(before);
    expect(candidates[0].source).toBe("TEN_GOD_CHAIN");
    for (let i = 1; i < candidates.length; i++) expect(candidates[i - 1].priority).toBeGreaterThanOrEqual(candidates[i].priority);
    for (const c of candidates) {
      expect(c.metadata?.provenance).not.toHaveLength(0);
      expect(c.metadata?.promotion).toBe("INTERNAL_ONLY");
      expect(c.evidenceIds).toEqual([...new Set(c.evidenceIds)].sort());
    }
  });
});

describe("13D-1B requested integrated semantic examples and language/fortune guards", () => {
  it("A: 庚 + 偏官 adds decision/precision/leadership without creating fortunes", () => {
    const f = normalized();
    const evidence = f.evidence.filter(e => e.sourceKey === "庚" || e.sourceKey === "偏官");
    const result = aggregateSemanticEvidence(evidence);
    expect(result.axes).toMatchObject({ DECISION_STYLE: 4, PRECISION: 2, LEADERSHIP: 2 });
    expect(evidence.every(e => e.kind === "TRAIT")).toBe(true);
    expect(buildTenGodCandidates(f.states, evidence)).toEqual([]);
  });
  it("B: OUTPUT + RESOURCE makes learning-to-output, not an authority refusal story", () => {
    const f = normalized(); f.family("OUTPUT"); f.family("RESOURCE");
    expect(f.run().map(c => c.id)).toEqual(["LEARNING_TO_OUTPUT"]);
    expect(f.run()[0].humanDescription).toContain("이해한 것을 설명하거나 결과물로");
  });
  it("C: WEALTH + RESOURCE retains money AND meaning", () => {
    const f = normalized(); f.family("WEALTH"); f.family("RESOURCE");
    expect(f.run()[0].humanDescription).toBe("돈이 된다는 이유만으로 움직이지도 않고, 좋아한다는 이유만으로 현실을 무시하지도 않습니다.");
    expect(f.run()[0].secondaryDescription).toContain("배울 가치도 있고");
  });
  it("D: PEER + OFFICER retains duty instead of generic dislike of instruction", () => {
    const f = normalized(); f.family("PEER"); f.family("OFFICER");
    expect(f.run()[0].secondaryDescription).toBe("마음에 들지 않는 방식이어도 맡은 일 자체는 끝내려 할 수 있습니다.");
  });
  it("E: 傷官 + OFFICER supplies a specific reason-for-rules candidate", () => {
    const f = normalized(); f.god("傷官"); f.family("OFFICER");
    expect(f.run()[0].id).toBe("BETTER_RULE_NOT_BLIND_RULE");
    expect(f.run()[0].positiveMeaning).toContain("더 나은 규칙과 방법");
  });
  it("all customer-readable meanings are human and never promote unsupported fortune/status/structure claims", () => {
    const entries = [...Object.values(HEAVENLY_STEM_SEMANTICS), ...Object.values(EARTHLY_BRANCH_SEMANTICS),
      ...Object.values(TEN_GOD_SEMANTICS), ...Object.values(TEN_GOD_FAMILY_SEMANTICS),
      ...TEN_GOD_PAIR_RULES, ...TEN_GOD_CHAIN_RULES, ...SPECIFIC_TEN_GOD_RULES, ...DAY_MASTER_TEN_GOD_RULES];
    for (const entry of entries) {
      const text = Object.entries(entry).filter(([key]) => /Meaning|Description|image/.test(key)).map(([, value]) => value).join(" ");
      expect(text).not.toMatch(/발현|상호작용|양상|사회적\s?지위|역할과\s?이름|내적\s?성찰|재정적\s?성취|복합적으로\s?작용|경향성이\s?있습니다/);
      expect(text).not.toMatch(/부자(?:가 |가?됩)|돈과 명예를 얻|고위직이|사업\s?성공|사업가입니다|리더가 됩니다|공부를 잘합니다|반드시|무조건 (?:성공|부자|돈|결혼)|재다신약|식신제살|도식/);
    }
    expect(TEN_GOD_SEMANTICS.比肩.humanDescription).toBe("남이 정해주기보다 직접 판단하고 자기 방식대로 해보고 싶은 마음이 강합니다.");
  });
});
