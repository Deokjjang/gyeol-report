import { describe, expect, it } from "vitest";
import { PERSONAL_RESONANCE_REGISTRY as registry } from "../../../src/lib/interpretation-v4/personalResonanceRegistry";
import { inspectPersonalResonanceRegistry, validatePersonalResonanceCandidates, validateCoreGyeol } from "../../../src/lib/interpretation-v4/personalResonanceDiagnostics";
import { evaluatePersonalResonance } from "../../../src/lib/interpretation-v4/personalResonanceEvaluator";
import { evaluateResonanceCondition, RESONANCE_BEHAVIOR_SOURCES } from "../../../src/lib/interpretation-v4/personalResonanceEvidence";
import { HUMAN_DESCRIPTION_TYPES, HUMAN_GOLDEN_LANGUAGE as golden, humanLanguageErrors, genericnessPenalty, descriptionGenericness } from "../../../src/lib/interpretation-v4/humanDescription";
import { CORE_GYEOL_GRAMMARS } from "../../../src/lib/interpretation-v4/personalResonanceCore";
import { CORE_GYEOL_SEEDS, CORE_ARC_SEEDS } from "../../../src/lib/interpretation-v4/coreGyeol";
import { resonanceScore, rankPersonalResonance } from "../../../src/lib/interpretation-v4/personalResonanceRanking";
import { strong, integrated, marker, withComposite, wealth, officer } from "./claimFixtures";
import { myAtom, myProfile, realMbti, mbtiProfile, repeated } from "./fusionSemanticFixtures";
import { resonance, resonanceScope, RESONANCE_SCENARIOS } from "./personalResonanceFixtures";
import type { SemanticSignature } from "../../../src/lib/interpretation-v4/semanticCore";

const find = (axes: SemanticSignature, id: string) => resonance(strong(axes)).candidates.find(c => c.ruleId === id);
describe("96 reviewed human descriptions", () => {
  it("exactly PR001–PR096, twelve types, eight grammars, no unreviewed language", () => {
    expect(registry.map(r => r.id)).toEqual(Array.from({ length: 96 }, (_, i) => `PR${String(i + 1).padStart(3, "0")}`));
    expect(inspectPersonalResonanceRegistry(registry)).toEqual([]);
    expect(new Set(registry.map(r => r.descriptionType))).toEqual(new Set(HUMAN_DESCRIPTION_TYPES));
    expect(new Set([...CORE_GYEOL_SEEDS.map(s => s.grammar), "STRENGTH_SHADOW"])).toEqual(new Set(CORE_GYEOL_GRAMMARS));
    for (const text of [...Object.values(golden), ...CORE_GYEOL_SEEDS.map(s => s.text), ...CORE_ARC_SEEDS.map(s => s.text), ...registry.flatMap(d => [d.humanDescription, d.positiveMeaning ?? "", ...d.alternatives.map(v => v.text)])]) expect(humanLanguageErrors(text), text).toEqual([]);
    expect(registry.every(d => d.quality === "HUMAN_DESCRIPTIVE")).toBe(true);
  });
  it.each(registry.map(d => [d.id, d] as const))("%s suppresses empty evidence", (_, d) => {
    expect(evaluatePersonalResonance(d, resonanceScope(myProfile([])))).toBeUndefined();
  });
  it.each(RESONANCE_SCENARIOS)("%s explicit positive uses actual underlying source", (id, axes) => {
    const c = evaluatePersonalResonance(registry.find(d => d.id === id)!, resonanceScope(strong(axes)));
    expect(c, id).toBeDefined(); expect(c!.evidence.myeongliEvidenceIds).toEqual(["core-a", "core-b"]);
    expect(c!.evidence.mbtiSourceNodeIds).toEqual([]);
  });
  it("user golden language activates without MBTI stereotypes", () => {
    expect(find({ DEPTH: 2, ACTION_TEMPO: 2 }, "PR001")?.humanDescription).toBe(golden.thinkMove);
    expect(find({ AUTONOMY: 2, BOUNDARY: 2, COMMUNICATION_STYLE: -2 }, "PR002")?.humanDescription).toBe(golden.softBelief);
    expect(find({ CHANGE_ORIENTATION: 2, STABILITY: 2 }, "PR019")?.humanDescription).toBe(golden.newStable);
    expect(find({ RESOURCE_SENSE: 2, MEANING: 2 }, "PR037")?.humanDescription).toBe(golden.moneyMeaning);
    expect(find({ PRECISION: 2 }, "PR003")?.humanDescription).toBe(golden.precision);
    expect(find({ PRECISION: 2, STRUCTURE_STYLE: 2, ACTION_TEMPO: -2 }, "PR003")?.humanDescription).toBe(golden.delayedPrecision);
  });
  it("pressure is required and calm has a separate real-source gate", () => {
    const axes = { STRATEGY: 2, DECISION_STYLE: 2, DUTY: 2 };
    expect(find(axes, "PR008")).toBeUndefined();
    const m = strong(axes, [myAtom("stress-source", { DUTY: 1 }, { contexts: ["stress"], family: "pressure" })]);
    const cautious = resonance(m).candidates.find(c => c.ruleId === "PR008");
    expect(cautious?.humanDescription).not.toContain("차분"); expect(cautious).toBeDefined();
    expect(resonance(m, realMbti("INTJ")).candidates.find(c => c.ruleId === "PR008")?.humanDescription).toBe(golden.calmPressure);
    expect(resonance(strong({ DUTY: 2 }, [myAtom("七殺", { DUTY: 1 }, { sourceKey: "偏官" })])).coreGyeolCandidates.some(c => c.grammar === "BEST_UNDER_PRESSURE")).toBe(false);
  });
  it("public fatigue golden variant requires the reviewed social persistence source", () => {
    const m = integrated([myAtom("work-a", { DUTY: 2, RECOVERY_NEED: 2 }, { contexts: ["work"] }), myAtom("work-b", { DUTY: 2, RECOVERY_NEED: 2 }, { contexts: ["work"] })]);
    const p = resonance(m, realMbti("INTP"));
    expect(p.candidates.find(c => c.ruleId === "PR073")?.humanDescription).toBe(golden.publicRecovery);
  });
  it("missing axis is not weakness; supported limited band is explicit", () => {
    const scope = resonanceScope(strong({ INITIATIVE: 2 }));
    expect(evaluateResonanceCondition({ kind: "limited", axis: "PERSISTENCE" }, { ...scope, context: "identity" }).passed).toBe(false);
    expect(find({ INITIATIVE: 2 }, "PR014")).toBeUndefined();
    expect(find({ MEANING: 2 }, "PR045")).toBeUndefined();
    expect(find({ RESOURCE_SENSE: 2 }, "PR046")).toBeUndefined();
    expect(find({ EXPRESSION: 2, PRECISION: 2 }, "PR060")).toBeUndefined();
    expect(resonance(strong({ EXPRESSION: 2, PRECISION: 2 })).diagnostics.unsupportedSpecificityRejected).toContain("PR060");
    expect(find({ SOCIAL_ATTUNEMENT: 2, COMMUNICATION_STYLE: -2 }, "PR067")).toBeUndefined();
    expect(find({ ENERGY_DIRECTION: -2, DEPTH: 2 }, "PR080")).toBeUndefined();
    expect(find({ GOAL_DRIVE: 2, DUTY: 2 }, "PR082")).toBeUndefined();
    expect(find({ INITIATIVE: 2, DUTY: 2, EXPANSION: 2 }, "PR083")).toBeUndefined();
  });
  it("reviewed extra details are backed by real primary source nodes", () => {
    for (const [risk, ids] of Object.entries(RESONANCE_BEHAVIOR_SOURCES)) for (const id of ids) {
      const b = realMbti(id.split(":")[1]), node = b.sourceNodes.find(n => n.id === id);
      expect(node, `${risk}:${id}`).toBeDefined(); expect(node!.classification, id).toBe("SCORING_SEMANTIC");
    }
  });
  it("precision/care/leadership do not invent shadows", () => {
    const precision = resonance(strong({ PRECISION: 2 })).traitArcs.find(a => a.semanticTheme === "PRECISION_AND_STANDARDS")!;
    expect(precision.strengthDescription).toContain("오류"); expect(precision.shadowDescription).toBeUndefined();
    const standards = resonance(strong({ PRECISION: 2, STRUCTURE_STYLE: 2 })).traitArcs.find(a => a.semanticTheme === "PRECISION_AND_STANDARDS")!;
    expect(standards.shadowDescription).toContain("만족"); expect(standards.shadowDescription).not.toMatch(/시작|마감/);
    const care = resonance(strong({ CARE: 2 })).traitArcs; expect(care.every(a => !a.shadowDescription)).toBe(true);
    const leader = resonance(strong({ ENERGY_DIRECTION: -2, LEADERSHIP: 2 })).traitArcs[0]; expect(leader.shadowDescription).toBeUndefined();
  });
  it("six representative arcs preserve same-trait shadow provenance", () => {
    const rows: [SemanticSignature, string][] = [
      [{ PRECISION: 2, STRUCTURE_STYLE: 2, ACTION_TEMPO: -2 }, "PRECISION_AND_STANDARDS"],
      [{ ENERGY_DIRECTION: -2, LEADERSHIP: 2, AUTONOMY: 2, DUTY: 2 }, "LEADERSHIP_AND_RESPONSIBILITY"],
      [{ DEPTH: 2, CURIOSITY: 2, ACTION_TEMPO: -2 }, "DEEP_UNDERSTANDING"],
      [{ SOCIAL_ATTUNEMENT: 2, CARE: 2 }, "SOCIAL_ATTUNEMENT_AND_CARE"],
      [{ GOAL_DRIVE: 2, EXPANSION: 2 }, "GROWTH_AND_EXPANSION"],
      [{ RESOURCE_SENSE: 2, MEANING: 2 }, "MONEY_AND_REALITY"],
    ];
    for (const [axes, theme] of rows) {
      const arc = resonance(strong(axes)).traitArcs.find(a => a.semanticTheme === theme)!;
      expect(arc, theme).toBeDefined(); expect(arc.provenance.strength.myeongliEvidenceIds.length).toBeGreaterThan(0);
      if (theme !== "MONEY_AND_REALITY") { expect(arc.shadowDescription, theme).toBeTruthy(); expect(arc.provenance.shadow).toBeDefined(); }
      for (const text of [arc.humanDescription, arc.strengthDescription, arc.shadowDescription ?? ""]) expect(humanLanguageErrors(text)).toEqual([]);
    }
    const bounded = resonance(strong({ SOCIAL_ATTUNEMENT: 2, CARE: 2, BOUNDARY: 2 }));
    expect(bounded.traitArcs.find(a => a.semanticTheme === "SOCIAL_ATTUNEMENT_AND_CARE")?.shadowDescription).toBeUndefined();
    const values = resonance(strong({ RESOURCE_SENSE: 2, STABILITY: 2, MEANING: 2 }));
    expect(values.traitArcs.find(a => a.semanticTheme === "MONEY_AND_REALITY")?.humanDescription).toBe(golden.moneyMeaning);
  });
  it("genericness and unsupported-specificity penalties are explicit", () => {
    expect([.3, .31, .5, .51, .7, .71].map(genericnessPenalty)).toEqual([0, 5, 5, 12, 12, 25]);
    const generic = descriptionGenericness("UNDERSTANDABLE", .15, 1), specific = descriptionGenericness("HUMAN_DESCRIPTIVE", .92, 2);
    const c = find({ DUTY: 2, AUTONOMY: 2 }, "PR096")!;
    expect(resonanceScore({ ...c, genericness: specific })).toBeGreaterThan(resonanceScore({ ...c, genericness: generic }));
    expect(resonanceScore(c, 0, true)).toBe(0);
    for (const text of ["매주 일요일 서점에서 생각합니다.", "회의가 끝난 뒤 항상 복습합니다.", "연인의 답장이 세 시간 늦으면 화냅니다."]) expect(humanLanguageErrors(text)).toContain("UNSUPPORTED_SPECIFICITY");
  });
  it("near duplicates retained, independent atoms never multiplied by wrappers", () => {
    const p = resonance(strong({ PRECISION: 2, AUTONOMY: 2, EXPANSION: 2 }));
    expect(p.candidates.filter(c => ["PR003", "PR091", "PR095"].includes(c.ruleId))).toHaveLength(3);
    const d = resonance(strong({ COMMUNICATION_STYLE: -2, AUTONOMY: 2, BOUNDARY: 2 }));
    expect(d.duplicateGroups.some(g => ["resonance:PR002", "resonance:PR052"].every(id => g.candidateIds.includes(id)))).toBe(true);
    for (const c of d.candidates) { expect(c.diagnostics.independentCount).toBe(2); for (const ids of Object.values(c.evidence)) expect(ids.length).toBe(new Set(ids).size); }
    expect(rankPersonalResonance(d.candidates).candidates).toEqual(d.candidates);
  });
  it("registry/candidate corruption is rejected", () => {
    for (const mutate of [
      (d: typeof registry[number]) => { d.id = "PR999"; }, (d: typeof registry[number]) => { d.primaryAxes = ["FAKE" as never]; },
      (d: typeof registry[number]) => { d.required = { kind: "claim", id: "FAKE", minLevel: 3 }; },
      (d: typeof registry[number]) => { d.required = { kind: "fusion", theme: "FAKE" }; },
      (d: typeof registry[number]) => { d.humanDescription = "복합적 특성이 상호작용합니다."; },
      (d: typeof registry[number]) => { d.humanDescription = "먼저 쉬세요."; },
    ]) { const rows = structuredClone([...registry]); mutate(rows[0]); expect(inspectPersonalResonanceRegistry(rows).length).toBeGreaterThan(0); }
    const m = strong({ DEPTH: 2, ACTION_TEMPO: 2 }), p = resonance(m), c = structuredClone(p.candidates[0]);
    c.evidence.myeongliEvidenceIds.push("missing");
    expect(validatePersonalResonanceCandidates([c], resonanceScope(m)).map(e => e.code)).toContain("UNSUPPORTED_EVIDENCE_ID");
    const core = structuredClone(p.coreGyeolCandidates[0]); core.diagnostics.concepts.push("THIRD", "FOURTH");
    expect(validateCoreGyeol([core], p.candidates).map(e => e.code)).toContain("INVALID_CORE_CONCEPTS");
  });
  it("fortune cannot become the core person or causal care shadow", () => {
    const m = withComposite(strong({ RESOURCE_SENSE: 2, STATUS_DRIVE: 2, GOAL_DRIVE: 2, MEANING: 2, CARE: 2, SOCIAL_ATTUNEMENT: 2, AUTONOMY: 2, ADAPTABILITY: 2 }, [wealth(), officer(), marker("JAEGO"), marker("BANAN"), marker("JANGSEONG"), marker("CHEONEUL")]));
    const s = resonanceScope(m); expect(s.claims.candidates.filter(c => c.fortuneClaim && c.level === 4).length).toBeGreaterThan(1);
    const p = resonance(m); expect(p.bestCoreGyeol).toBeDefined();
    expect(p.coreGyeolCandidates.every(c => !/재물복|사람복|명예운/.test(c.humanDescription))).toBe(true);
    expect(p.traitArcs.every(a => !a.sourceClaimIds.includes("P01_PEOPLE_LUCK"))).toBe(true);
  });
  it("unknown MBTI retains human descriptions/core, fusion adds specificity", () => {
    const m = strong({ DEPTH: 2, ACTION_TEMPO: -2, AUTONOMY: 2, CARE: 2, ADAPTABILITY: 2 });
    const unknown = resonance(m), b = mbtiProfile(repeated({ ACTION_TEMPO: 2, DEPTH: 2 }, 3)), known = resonance(m, b);
    expect(unknown.bestCoreGyeol).toBeDefined(); expect(unknown.candidates.every(c => !c.evidence.mbtiSourceNodeIds.length && !c.evidence.fusionCandidateIds.length)).toBe(true);
    const moving = known.candidates.find(c => c.ruleId === "PR001"); expect(moving?.conditionSplit?.type).toBe("BEFORE_AFTER_DECISION");
    expect(known.candidates.length).toBeGreaterThanOrEqual(unknown.candidates.length);
    expect(unknown.candidates.every(c => known.candidates.some(k => k.ruleId === c.ruleId))).toBe(true);
    expect(known.coreGyeolCandidates.some(c => c.grammar === "A_BUT_B")).toBe(true);
  });
  it("rich cores are bounded 5–15, sparse sources are not padded", () => {
    const rich = resonance(strong({ DEPTH: 2, CURIOSITY: 2, STRATEGY: 2, PRECISION: 2, INITIATIVE: 2, PERSISTENCE: 2, AUTONOMY: 2, ADAPTABILITY: 2,
      GOAL_DRIVE: 2, EXPANSION: 2, STABILITY: 2, CHANGE_ORIENTATION: 2, CREATION: 2, EXPRESSION: 2, CARE: 2, SOCIAL_ATTUNEMENT: 2, DUTY: 2, MEANING: 2, PRACTICALITY: 2 }));
    expect(rich.coreGyeolCandidates.length).toBeGreaterThanOrEqual(5); expect(rich.coreGyeolCandidates.length).toBeLessThanOrEqual(15);
    expect(rich.coreGyeolCandidates.every(c => c.diagnostics.concepts.length <= 3 && c.diagnostics.qualityQuestions.length === 7)).toBe(true);
    expect(resonance(myProfile([])).coreGyeolCandidates).toEqual([]);
    expect(resonance(strong({ DEPTH: 2, CURIOSITY: 2 })).coreGyeolCandidates).toHaveLength(1);
  });
  it("amplifier-only, weak atoms and work/love cross-contamination never make strong cores", () => {
    const amp = resonance(integrated([marker("HYEONCHIM"), marker("HWAGAE")])); expect(amp.signature).toEqual([]); expect(amp.bestCoreGyeol).toBeUndefined();
    const weak = resonance(myProfile([myAtom("weak", { DEPTH: 2, CURIOSITY: 2 }, { strength: "WEAK" })])); expect(weak.candidates).toEqual([]);
    const isolated = resonance(myProfile([myAtom("work", { RESOURCE_SENSE: 2 }, { contexts: ["work"] }), myAtom("love", { MEANING: 2 }, { contexts: ["love"] })]));
    expect(isolated.candidates.some(c => c.ruleId === "PR037")).toBe(false);
  });
});
