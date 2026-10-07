import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { SEMANTIC_AXES, BIPOLAR_AXES, type SemanticAxis, type InterpretationContext } from "../../../src/lib/interpretation-v4/semanticCore";
import { FUSION_COMPLEMENT_RULES, type FusionCompositeRule } from "../../../src/lib/interpretation-v4/fusionComplementRegistry";
import { FUSION_CONDITION_SPLITS, FUSION_RANK_POLICY, type FusionCandidate } from "../../../src/lib/interpretation-v4/fusionCore";
import { FUSION_CONTEXT_MATRIX, fusionContextFit } from "../../../src/lib/interpretation-v4/fusionContext";
import { inspectFusionRegistry, validateFusionCandidates } from "../../../src/lib/interpretation-v4/fusionDiagnostics";
import { adaptMbtiFusionSide, adaptMyeongliFusionSide } from "../../../src/lib/interpretation-v4/fusionProfileAdapter";
import { resolveFusionTension } from "../../../src/lib/interpretation-v4/fusionTension";
import { FUSION_BIPOLAR_MEANINGS, FUSION_STRENGTH_MEANINGS } from "../../../src/lib/interpretation-v4/fusionMeanings";
import { buildMyeongliMbtiFusion } from "../../../src/lib/interpretation-v4/fusionSemanticProfile";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { readMbtiSemanticSource } from "../../../src/lib/interpretation-v4/mbtiSourceAdapter";
import { projectMbtiSemanticProfile } from "../../../src/lib/interpretation-v4/mbtiSemanticProfile";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { myAtom, myProfile, mbtiProfile, realMbti, fuse, repeated } from "./fusionSemanticFixtures";

const all = (p: ReturnType<typeof fuse>) => [...p.reinforce, ...p.tensions, ...p.complements];
const mainOrSignature = (c: FusionCandidate) => expect(["MAIN", "SIGNATURE"]).toContain(c.strength);

describe("13D-2B closed semantic contracts", () => {
  it("36 human meanings, exactly ten splits, registry C001-C096; no pseudo-axis", () => {
    expect(Object.keys(FUSION_BIPOLAR_MEANINGS)).toHaveLength(8); expect(Object.keys(FUSION_STRENGTH_MEANINGS)).toHaveLength(28);
    expect(FUSION_CONDITION_SPLITS).toHaveLength(10); expect(FUSION_COMPLEMENT_RULES).toHaveLength(96);
    expect(FUSION_COMPLEMENT_RULES.map(r => r.id)).toEqual(Array.from({ length: 96 }, (_, i) => `C${String(i + 1).padStart(3, "0")}`));
    expect(inspectFusionRegistry(FUSION_COMPLEMENT_RULES)).toEqual([]);
    expect(FUSION_COMPLEMENT_RULES.find(r => r.id === "C081")).toMatchObject({ axisA: { axis: "PRECISION" }, axisB: { axis: "CARE" }, contexts: ["love", "social"], requiredContext: true });
    expect(FUSION_COMPLEMENT_RULES.find(r => r.id === "C082")).toMatchObject({ axisA: { axis: "STABILITY" }, axisB: { axis: "EXPRESSION" }, contexts: ["love"], requiredContext: true });
  });
  it.each(FUSION_COMPLEMENT_RULES)("$id: both cross-system assignments activate only registered direction/context", rule => {
    const context = rule.contexts[0], domain = ({ identity: "IDENTITY", work: "WORK", money: "MONEY", social: "RELATIONSHIPS", love: "LOVE", learning: "STUDY", stress: "RISKS", recovery: "GROWTH" } as const)[context];
    for (const [a, b] of [[rule.axisA, rule.axisB], [rule.axisB, rule.axisA]]) {
      const m = myProfile([myAtom("one", { [a.axis]: a.direction }, { contexts: [context] })]);
      const p = fuse(m, mbtiProfile([{ axes: { [b.axis]: b.direction }, domain }]));
      const candidate = p.complements.find(c => c.ruleId === rule.id && c.primaryContext === context);
      expect(candidate).toBeDefined(); expect(candidate?.sourceDescription).toBe(rule.sourceDescription);
      expect(candidate?.mbti.actualSourceEvidenceIds).toHaveLength(1);
    }
  });
  it("registry missing/duplicate/unknown axes and contexts fail", () => {
    expect(inspectFusionRegistry(FUSION_COMPLEMENT_RULES.slice(1)).some(e => e.code === "INCOMPLETE_COMPLEMENT_REGISTRY")).toBe(true);
    const bad = structuredClone(FUSION_COMPLEMENT_RULES) as FusionCompositeRule[];
    bad[0].id = "C002"; bad[0].axisA.axis = "LOVE_CONTEXT_CARE" as SemanticAxis; bad[0].contexts = ["unknown" as InterpretationContext];
    expect(inspectFusionRegistry(bad).map(e => e.code)).toEqual(expect.arrayContaining(["DUPLICATE_REGISTRY_ID", "INVALID_AXIS_REQUIREMENT", "INVALID_CONTEXT"]));
  });
  it("context fit is exact/general/adjacent; money versus love never mixes", () => {
    expect(fusionContextFit("work", "work")).toBe(1); expect(fusionContextFit("general", "work")).toBe(.9);
    expect(fusionContextFit("general", "general")).toBe(.85); expect(fusionContextFit("money", "love")).toBe(0);
    expect(fusionContextFit("work", "money")).toBe(.7);
    for (const a of Object.keys(FUSION_CONTEXT_MATRIX) as InterpretationContext[]) for (const b of Object.keys(FUSION_CONTEXT_MATRIX) as InterpretationContext[])
      expect(FUSION_CONTEXT_MATRIX[a][b]).toBe(FUSION_CONTEXT_MATRIX[b][a]);
  });
});

describe("actual evidence, direction and quality; no prior-generated personality", () => {
  const m = myProfile([myAtom("a", { GOAL_DRIVE: 2, PRECISION: 2 }), myAtom("b", { GOAL_DRIVE: 1, PRECISION: 1 })]);
  it("prior-only axes produce no candidates and remain diagnostic; real source enables reinforce", () => {
    const prior = mbtiProfile([], "ENTJ", true), p = fuse(m, prior);
    expect(all(p)).toEqual([]); expect(p.diagnostics.priorOnlySuppressed.some(d => d.detail === "GOAL_DRIVE:1")).toBe(true);
    const actual = mbtiProfile(repeated({ GOAL_DRIVE: 1 }), "ENTJ", true), q = fuse(m, actual);
    const c = q.reinforce.find(c => c.primaryAxes.includes("GOAL_DRIVE"))!;
    expect(c.mbti.sourceNodeIds).toHaveLength(3); expect(c.mbti.actualSourceEvidenceIds).toHaveLength(3); expect(c.mbti.priorEvidenceIds.length).toBeGreaterThan(0);
    mainOrSignature(c); expect(c.mbti.side.score).not.toBe(c.mbti.side.priorScore);
  });
  it("same axis actual source MAIN; raw cross-system numbers never compared", () => {
    const b = mbtiProfile(repeated({ PRECISION: 2 }, 2)), p = fuse(m, b), c = p.reinforce[0];
    mainOrSignature(c); expect(c.myeongli.side.band).toBe("STRONG"); expect(c.mbti.side.band).toBe("MAIN");
    expect(c.rankingFactors.sideStrengthBase).toBe(.9); expect(c.evidenceDiversity).toBeLessThanOrEqual(1.3);
  });
  it("independent families + actual specific nodes yield SIGNATURE before duplicate ranking", () => {
    const p = fuse(myProfile([myAtom("a", { PRECISION: 2 }), myAtom("b", { PRECISION: 2 })]), mbtiProfile(repeated({ PRECISION: 2 }, 3, "IDENTITY")));
    expect(p.reinforce.find(c => c.primaryContext === "identity")?.strength).toBe("SIGNATURE");
    const tension = fuse(myProfile([myAtom("a", { ACTION_TEMPO: 2 }), myAtom("b", { ACTION_TEMPO: 2 })]), mbtiProfile(repeated({ ACTION_TEMPO: -2 })));
    expect(tension.tensions.find(c => c.primaryContext === "identity")?.strength).toBe("SIGNATURE");
    const complement = fuse(myProfile([myAtom("a", { PRECISION: 2 }), myAtom("b", { PRECISION: 2 })]), mbtiProfile(repeated({ CARE: 2 })));
    expect(complement.complements.find(c => c.ruleId === "C001" && c.primaryContext === "identity")?.strength).toBe("SIGNATURE");
  });
  it("two general source nodes are MAIN, three specific nodes STRONG; repeated node is not extra diversity", () => {
    expect(adaptMbtiFusionSide(mbtiProfile(repeated({ PRECISION: 2 }, 2))).sides[0].band).toBe("MAIN");
    expect(adaptMbtiFusionSide(mbtiProfile(repeated({ PRECISION: 2 }, 3))).sides[0].band).toBe("STRONG");
    const onlyGeneral = mbtiProfile(repeated({ PRECISION: 1 }, 3).map(s => ({ ...s, weight: "GENERAL_TRAIT" as const })));
    expect(adaptMbtiFusionSide(onlyGeneral).sides[0].band).toBe("MAIN");
    const mixed = mbtiProfile([{ axes: { PRECISION: 1 }, domain: "IDENTITY" }, { axes: { PRECISION: 1 }, domain: "WORK" }, { axes: { PRECISION: 1 }, domain: "THINKING" }]);
    const side = adaptMbtiFusionSide(mixed).sides.find(s => s.scope === "work")!;
    expect(side.evidenceIds).toHaveLength(3); expect(side.domains).toHaveLength(3);
  });
  it.each(BIPOLAR_AXES)("%s: same sign reinforce, opposite sign tension, never subtraction", axis => {
    const mp = myProfile([myAtom("a", { [axis]: 2 })]);
    expect(fuse(mp, mbtiProfile([{ axes: { [axis]: 1 } }])).reinforce.some(c => c.primaryAxes.includes(axis))).toBe(true);
    const p = fuse(mp, mbtiProfile([{ axes: { [axis]: -1 } }]));
    expect(p.reinforce).toEqual([]); expect(p.tensions[0].myeongli.axisScores[axis]).toBe(2); expect(p.tensions[0].mbti.axisScores[axis]).toBe(-1.5);
    expect(p.tensions[0].metadata).toEqual({ relationship: "CONTRAST", promotion: "CANDIDATE_ONLY", causation: false });
  });
  it("different strength axes are not a tension; arbitrary pairs never complement", () => {
    expect(fuse(myProfile([myAtom("x", { RESOURCE_SENSE: 2 })]), mbtiProfile([{ axes: { CARE: 2 } }])).tensions).toEqual([]);
    const p = fuse(myProfile([myAtom("x", { COMPETITION: 2 })]), mbtiProfile([{ axes: { RECOVERY_NEED: 2 } }]));
    expect(all(p)).toEqual([]);
  });
  it("single-system pair is not cross-system complement", () => {
    const p = fuse(myProfile([myAtom("x", { PRECISION: 2, CARE: 2 })]), mbtiProfile([{ axes: { COMPETITION: 1 } }]));
    expect(p.complements.some(c => c.ruleId === "C001")).toBe(false);
  });
  it("amplifier-only always SUPPORT, core support permits MAIN", () => {
    const amp = myAtom("jangseong", { LEADERSHIP: 2 }, { sourceType: "shinsal", tier: "AMPLIFIER" });
    const b = mbtiProfile(repeated({ LEADERSHIP: 2 }));
    const p = fuse(myProfile([amp]), b); expect(p.reinforce[0].strength).toBe("SUPPORT"); expect(p.diagnostics.amplifierOnlyLimited.length).toBeGreaterThan(0);
    mainOrSignature(fuse(myProfile([amp, myAtom("officer", { LEADERSHIP: 2 })]), b).reinforce[0]);
  });
  it("prior heavy is reported, caps SIGNATURE, never changes side band", () => {
    const b = mbtiProfile([{ axes: { STRUCTURE_STYLE: .5 }, weight: "GENERAL_TRAIT" }], "ENTJ", true);
    const mp = myProfile([myAtom("a", { STRUCTURE_STYLE: 2 }), myAtom("b", { STRUCTURE_STYLE: 1 })]);
    const c = fuse(mp, b).reinforce[0]; expect(c.priorHeavy).toBe(true); expect(c.strength).not.toBe("SIGNATURE"); expect(c.mbti.side.band).toBe("SUPPORT");
  });
  it("general plus exact deduplicates nodes but exact opposite is preserved", () => {
    const b = mbtiProfile([{ axes: { COMMUNICATION_STYLE: 2 } }, { axes: { COMMUNICATION_STYLE: -2 }, domain: "WORK" }]);
    const p = fuse(myProfile([myAtom("a", { COMMUNICATION_STYLE: 2 }, { contexts: ["identity", "work"] })]), b);
    expect(p.reinforce.some(c => c.primaryContext === "identity")).toBe(true);
    expect(p.tensions.some(c => c.primaryContext === "work")).toBe(true);
    for (const c of all(p)) expect(new Set(c.mbti.sourceNodeIds).size).toBe(c.mbti.sourceNodeIds.length);
  });
  it("weak / zero-confidence input cannot supply a side", () => {
    expect(all(fuse(myProfile([myAtom("weak", { PRECISION: 10 }, { strength: "WEAK" })]), mbtiProfile(repeated({ PRECISION: 2 }))))).toEqual([]);
  });
});

describe("condition split resolution is evidenced, bounded and ordered", () => {
  it("decision review precedes action; unresolved speech remains SUPPORT", () => {
    const m = myProfile([myAtom("a", { ACTION_TEMPO: 2, COMMUNICATION_STYLE: 2 })]);
    const p = fuse(m, mbtiProfile(repeated({ ACTION_TEMPO: -2, COMMUNICATION_STYLE: -2 })));
    expect(p.tensions.find(c => c.primaryAxes.includes("ACTION_TEMPO"))?.conditionSplit?.type).toBe("BEFORE_AFTER_DECISION");
    const unresolved = p.tensions.find(c => c.primaryAxes.includes("COMMUNICATION_STYLE"))!;
    expect(unresolved.strength).toBe("SUPPORT"); expect(unresolved.conditionSplit?.resolved).toBe(false);
    expect(p.diagnostics.unresolvedTensions).toContain(unresolved.id);
  });
  it.each([
    ["RISKS", "stress", "NORMAL_STRESS"], ["WORK", "work", "WORK_PRIVATE"], ["LOVE", "love", "STRANGER_CLOSE"],
  ] as const)("%s actual context takes priority over default", (domain, context, split) => {
    const m = myProfile([myAtom("x", { ACTION_TEMPO: 2 })]);
    const p = fuse(m, mbtiProfile(repeated({ ACTION_TEMPO: -2 }, 2, domain)));
    expect(p.tensions.find(c => c.primaryContext === context)?.conditionSplit?.type).toBe(split);
  });
  it.each([
    ["ENERGY_DIRECTION", "RECOVERY_NEED", "OUTER_INNER"], ["CHANGE_ORIENTATION", "STABILITY", "START_MAINTAIN"],
    ["RELATION_STYLE", "RECOVERY_NEED", "OUTER_INNER"], ["DECISION_STYLE", "DEPTH", "BEFORE_AFTER_DECISION"],
  ] as const)("%s condition needs an actual supporting axis", (axis, supporting, split) => {
    const m = myProfile([myAtom("x", { [axis]: 2 })]);
    const p = fuse(m, mbtiProfile(repeated({ [axis]: -2, [supporting]: 1 })));
    expect(p.tensions[0].conditionSplit?.type).toBe(split);
    expect(fuse(m, mbtiProfile(repeated({ [axis]: -2 }))).tensions[0].conditionSplit?.resolved).toBe(false);
  });
  it.each([
    ["STRUCTURE_STYLE", "DUTY", "CREATION", "IDEA_EXECUTION"], ["RISK_STYLE", "OPPORTUNITY_SENSE", "STRATEGY", "SHORT_LONG_TERM"],
    ["DECISION_STYLE", "STRATEGY", "CARE", "HEAD_HEART"], ["COMMUNICATION_STYLE", "EXPRESSION", "BOUNDARY", "DESIRE_BEHAVIOR"],
  ] as const)("%s typed support resolves %s/%s", (axis, positive, negative, split) => {
    const p = fuse(myProfile([myAtom("x", { [axis]: 2, [positive]: 1 })]), mbtiProfile(repeated({ [axis]: -2, [negative]: 1 })));
    expect(p.tensions.find(c => c.primaryAxes.includes(axis))?.conditionSplit?.type).toBe(split);
  });
  it("opposite stress direction is assigned to the correct side", () => {
    const mp = myProfile([myAtom("pressure", { COMMUNICATION_STYLE: -2 }, { contexts: ["stress"] })]), bp = mbtiProfile(repeated({ COMMUNICATION_STYLE: 2 }));
    const m = adaptMyeongliFusionSide(mp)[0], b = adaptMbtiFusionSide(bp).sides.find(s => s.scope === "general")!;
    const t = resolveFusionTension(m, b, [m, b]); expect(t.split.sides).toEqual({ myeongli: "압박을 받는 상황", mbti: "평소" });
    expect(t.description).toContain("부드럽게");
  });
});

describe("complement context, direction, retention and human meanings", () => {
  it.each([["C054", "COMMUNICATION_STYLE", 1, "CARE"], ["C055", "COMMUNICATION_STYLE", -1, "CARE"],
    ["C046", "RISK_STYLE", -1, "RESOURCE_SENSE"], ["C091", "RISK_STYLE", 1, "STRATEGY"]] as const)("%s rejects reversed direction", (id, axis, sign, other) => {
    const rule = FUSION_COMPLEMENT_RULES.find(r => r.id === id)!, context = rule.contexts[0];
    const domain = context === "money" ? "MONEY" : "IDENTITY";
    const run = (direction: number) => fuse(myProfile([myAtom("x", { [axis]: direction }, { contexts: [context] })]), mbtiProfile([{ axes: { [other]: 2 }, domain }])).complements;
    expect(run(sign).some(c => c.ruleId === id)).toBe(true); expect(run(-sign).some(c => c.ruleId === id)).toBe(false);
  });
  it("work CARE cannot create love; love-only meaning cannot create money; context rejection visible", () => {
    const p = fuse(myProfile([myAtom("autonomy", { AUTONOMY: 2 }, { contexts: ["love"] })]), mbtiProfile([{ axes: { CARE: 2 }, domain: "WORK" }]));
    expect(p.complements.some(c => c.ruleId === "C077")).toBe(false);
    expect(p.diagnostics.contextRejected.length).toBeGreaterThan(0);
    const q = fuse(myProfile([myAtom("resource", { RESOURCE_SENSE: 2 }, { contexts: ["money"] })]), mbtiProfile([{ axes: { MEANING: 2 }, domain: "LOVE" }]));
    expect(q.complements.some(c => c.ruleId === "C040")).toBe(false);
  });
  it("reinforce and related composites survive, with overlap links", () => {
    const p = fuse(myProfile([myAtom("metal", { PRECISION: 2 }), myAtom("needle", { PRECISION: 1 })]), mbtiProfile(repeated({ PRECISION: 2, CARE: 2, SOCIAL_ATTUNEMENT: 2 })));
    expect(p.reinforce.length).toBeGreaterThan(0); expect(p.complements.some(c => c.ruleId === "C001")).toBe(true); expect(p.complements.some(c => c.ruleId === "C051")).toBe(true);
    expect(p.diagnostics.duplicateGroups.length).toBeGreaterThan(0);
    const c = p.reinforce.find(c => c.primaryContext === "identity")!; expect(c.relatedCandidateIds.some(id => id.includes("C001"))).toBe(true);
  });
  it("same broad deep-understanding themes share duplicate group without deleting candidates", () => {
    const axes = { DEPTH: 2, CURIOSITY: 1, PATTERN_SENSE: 1 };
    const p = fuse(myProfile([myAtom("a", axes)]), mbtiProfile(repeated(axes)));
    const core = p.reinforce.filter(c => c.primaryContext === "identity");
    expect(core).toHaveLength(3); expect(core.every(c => c.duplicateGroupId)).toBe(true);
    expect(new Set(core.map(c => c.duplicateGroupId)).size).toBe(1);
  });
  it("identical evidence repeated across contexts remains linked, not silently hidden from a future scheduler", () => {
    const p = fuse(myProfile([myAtom("x", { PRECISION: 2 }, { contexts: ["identity", "work"] })]), mbtiProfile(repeated({ PRECISION: 2 })));
    const identity = p.reinforce.find(c => c.primaryContext === "identity")!, work = p.reinforce.find(c => c.primaryContext === "work")!;
    expect(identity.relatedCandidateIds).toContain(work.id); expect(identity.duplicateGroupId).toBe(work.duplicateGroupId);
    expect(p.reinforce.filter(c => c.strength === "SIGNATURE").length).toBeLessThanOrEqual(1);
  });
  it("C001 admits the specified social application, C081/C082 still require their real context", () => {
    const p = fuse(myProfile([myAtom("x", { PRECISION: 2 }, { contexts: ["social"] })]), mbtiProfile([{ axes: { CARE: 1 }, domain: "RELATIONSHIPS" }]));
    expect(p.complements.some(c => c.ruleId === "C001")).toBe(true); expect(p.complements.some(c => c.ruleId === "C081")).toBe(true);
    const q = fuse(myProfile([myAtom("x", { PRECISION: 2, STABILITY: 1 })]), mbtiProfile([{ axes: { CARE: 1, EXPRESSION: 1 } }]));
    expect(q.complements.some(c => c.ruleId === "C081" || c.ruleId === "C082")).toBe(false);
  });
  it("descriptions stay human, non-causal and not final fortune claims", () => {
    const p = fuse(myProfile([myAtom("all", Object.fromEntries(SEMANTIC_AXES.map(a => [a, 1])))]), realMbti("ENTJ"));
    const copy = [...FUSION_COMPLEMENT_RULES.map(r => r.sourceDescription), ...all(p).map(c => c.sourceDescription)].join("\n");
    expect(copy).not.toMatch(/발현|상호작용|양상|사회적 지위|역할과 이름|내적 성찰|재정적 성취|복합적으로 작용|경향성이 있습니다/);
    expect(copy).not.toMatch(/사주 때문에 MBTI|MBTI가 사주 때문에|그래서 ENTJ가 되었습니다|그래서 INFJ입니다/);
    expect(copy).not.toMatch(/고집이 셉니다\.|리더십이 강합니다\.|사람복이 있습니다\.|재물운이 좋습니다\.|높은 직책을 노려볼 만합니다\.|돈과 명예를 같이 노려볼 만한 패입니다\./);
    expect(copy).toContain("문제를 빨리 알아차리면서도 사람을 함부로 몰아붙이지 않는 사람");
    expect(copy).toContain("돈도 중요하지만 의미 없는 일을 하면서 돈만 버는 것으로는 오래 만족하기 어려운 사람");
    expect(copy).toContain("사람의 반응을 읽으면서 방향을 정하는 리더");
  });
});

describe("source boundaries, circularity, determinism and product lock", () => {
  const m = myProfile([myAtom("base", { GOAL_DRIVE: 2, LEADERSHIP: 2, COMMUNICATION_STYLE: 1, ACTION_TEMPO: 2, ENERGY_DIRECTION: 2, DEPTH: 1, PRECISION: 2 }, { contexts: ["identity", "work", "social"] })]);
  it.each(["myeongliBridgeHints", "recommendedJobs", "avoidJobsOrEnvironments", "relationshipHints"])("%s removal leaves ENTIRE result equal", field => {
    const r = readMbtiSemanticSource("ENTJ"); if (!r.ok) return expect.unreachable();
    const source = structuredClone(r.source) as Record<string, unknown>, before = projectMbtiSemanticProfile("ENTJ", source);
    delete source[field]; const after = projectMbtiSemanticProfile("ENTJ", source);
    if (!before.ok || !after.ok) return expect.unreachable();
    expect(fuse(m, after.value)).toEqual(fuse(m, before.value));
  });
  it("ENTJ actual source supports goals/leadership/directness, not its type name", () => {
    const p = fuse(m, realMbti("ENTJ"));
    for (const axis of ["GOAL_DRIVE", "LEADERSHIP", "COMMUNICATION_STYLE"]) expect(p.reinforce.some(c => c.primaryAxes.includes(axis as SemanticAxis) && c.mbti.sourceNodeIds.length > 0)).toBe(true);
  });
  it("INFJ contrasts use actual inward source, ENFJ complements use actual care", () => {
    const p = fuse(m, realMbti("INFJ")); expect(p.tensions.some(c => c.primaryAxes.includes("ENERGY_DIRECTION"))).toBe(true);
    const q = fuse(m, realMbti("ENFJ")); expect(q.complements.some(c => ["C001", "C051"].includes(c.ruleId!))).toBe(true);
    expect(q.complements.every(c => c.mbti.sourceNodeIds.length > 0)).toBe(true);
  });
  it.each([undefined, null, "unknown"])("unknown %s is a normal empty result", type => {
    const p = fuse(m, realMbti(type)); expect(all(p)).toEqual([]); expect(p.diagnostics.warnings).toContainEqual({ code: "MBTI_UNAVAILABLE", refs: [] });
  });
  it("both inputs unchanged, stable order even when arrays/objects are reordered", () => {
    const b = realMbti("INFJ"), beforeM = structuredClone(m), beforeB = structuredClone(b), p = fuse(m, b);
    expect(fuse(m, b)).toEqual(p); expect(m).toEqual(beforeM); expect(b).toEqual(beforeB);
    const shuffledM = structuredClone(m), shuffledB = structuredClone(b);
    shuffledM.evidence.reverse(); shuffledM.rankedCandidates.reverse(); shuffledB.annotations.reverse(); shuffledB.sourceNodes.reverse(); shuffledB.contributions.reverse();
    expect(fuse(shuffledM, shuffledB)).toEqual(p); expect(JSON.parse(JSON.stringify(p))).toEqual(p);
  });
  it("all sixteen real types and natal fixtures run without inferring unknown fields", () => {
    const types = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
    const review: unknown[] = [];
    for (const [i, type] of types.entries()) {
      const f = NARRATIVE_FIXTURES[i % NARRATIVE_FIXTURES.length], integrated = buildIntegratedMyeongliProfile(fixtureInput(f).calculation);
      if (!integrated.ok) return expect.unreachable();
      const p = fuse(integrated.value, realMbti(type)); expect(p.diagnostics.hardErrors).toEqual([]); expect(p.topCandidates.length).toBeGreaterThan(0);
      expect(Object.keys(p.byContext)).toHaveLength(8);
      expect(all(p).every(c => c.mbti.actualSourceEvidenceIds.length && c.myeongli.evidenceIds.length)).toBe(true);
      review.push({ type, fixture: f.id, counts: [p.reinforce.length, p.tensions.length, p.complements.length], top: p.debug });
    }
    if (process.env.FUSION_SEMANTIC_REVIEW_EXPORT === "1") { mkdirSync("/tmp/gyeol-13d2b-fusion", { recursive: true }); writeFileSync("/tmp/gyeol-13d2b-fusion/review.json", JSON.stringify(review, null, 2)); }
  }, 25000);
  it("same saju/different MBTI and same MBTI/different evidence are different", () => {
    expect(fuse(m, realMbti("ENTJ"))).not.toEqual(fuse(m, realMbti("ISFP")));
    expect(fuse(m, realMbti("ENTJ"))).not.toEqual(fuse(myProfile([myAtom("gentle", { CARE: 2 })]), realMbti("ENTJ")));
  });
  it("source validation fails closed on unknown axis, dangling IDs, reference-only, duplicate or forbidden scoring", () => {
    const cases = [
      (b: ReturnType<typeof mbtiProfile>) => { b.contributions[0].axis = "EMPATHY" as SemanticAxis; },
      (b: ReturnType<typeof mbtiProfile>) => { b.contributions[0].sourceNodeId = "missing"; },
      (b: ReturnType<typeof mbtiProfile>) => { b.sourceNodes[0].classification = "REFERENCE_ONLY"; },
      (b: ReturnType<typeof mbtiProfile>) => { b.contributions.push({ ...b.contributions[0] }); },
      (b: ReturnType<typeof mbtiProfile>) => { b.contributions[0].contexts = ["invalid" as InterpretationContext]; },
      (b: ReturnType<typeof mbtiProfile>) => { b.sourceNodes[0].sourcePath = "/recommendedJobs/0"; },
      (b: ReturnType<typeof mbtiProfile>) => { b.contributions.pop(); },
    ];
    for (const mutate of cases) { const b = mbtiProfile(repeated({ PRECISION: 1 })); mutate(b); expect(buildMyeongliMbtiFusion(m, b).ok).toBe(false); }
    for (const domain of ["MYEONGLI_BRIDGE_HINT", "RECOMMENDED_JOBS", "AVOID_JOBS_OR_ENVIRONMENTS", "RELATIONSHIP_PAIR"] as const) {
      const b = mbtiProfile(repeated({ PRECISION: 1 })); b.sourceNodes[0].sourceDomain = domain;
      expect(buildMyeongliMbtiFusion(m, b).ok).toBe(false);
    }
    const bad = structuredClone(m); bad.rankedCandidates[0].evidenceIds.push("missing"); expect(buildMyeongliMbtiFusion(bad, realMbti("ENTJ")).ok).toBe(false);
  });
  it("output gate rejects collisions, invented registry pair and condition split", () => {
    const b = mbtiProfile(repeated({ PRECISION: 2, CARE: 1 })), p = fuse(m, b), c = structuredClone(p.complements.find(c => c.ruleId === "C001")!);
    expect(validateFusionCandidates([c, c], m, b).some(e => e.code === "DUPLICATE_FUSION_ID")).toBe(true);
    c.ruleId = "AI_NEW_PAIR"; expect(validateFusionCandidates([c], m, b).some(e => e.code === "UNREGISTERED_COMPLEMENT_PAIR")).toBe(true);
    c.conditionSplit = { resolved: true, type: "FAKE" as never, rationale: "", status: "CONDITIONAL_HYPOTHESIS", myeongliEvidenceIds: [], mbtiSourceNodeIds: [] };
    expect(validateFusionCandidates([c], m, b).some(e => e.code === "INVALID_CONDITION_SPLIT")).toBe(true);
  });
  it("foundation/MBTI inputs remain independent; fusion modules are not imported by any customer path", () => {
    const directory = "src/lib/interpretation-v4", files = ["fusionCore", "fusionContext", "fusionMeanings", "fusionComplementRegistry", "fusionProfileAdapter", "fusionTension", "fusionRanking", "fusionDiagnostics", "fusionSemanticProfile"];
    const claimBoundary = ["claimCore", "claimEvidence", "claimEvaluator", "claimDiagnostics", "claimProfile", "personalResonanceCore", "personalResonanceRules", "personalResonanceEvidence", "personalResonanceRanking", "personalResonanceEvaluator", "traitArc", "coreGyeol", "personalResonanceDiagnostics", "personalResonanceProfile", "guidanceCore", "guidanceEvidence", "comprehensivePlanCore"];
    function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []); }
    for (const file of walk("src")) {
      if (["comprehensiveProductAdapter", "careerProductAdapter", "relationshipProductView", "compatibilityProductView"].some(n => file === `${directory}/${n}.ts`)) continue;
      const text = readFileSync(file, "utf8");
      if (files.some(f => file === `${directory}/${f}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|process\.env|fetch\(|runtimeShadow|bookProjection|Composer|report-knowledge\/mbti/);
      else if (["narrativeCore", "narrativeConnectors", "narrativeSceneCore", "narrativeMbtiReason"].some(f => file === `${directory}/${f}.ts`)) {
        expect(text).not.toMatch(/import\s+(?!type)[^;]*from ["'][^"']*\/fusion/);
      } else if (!claimBoundary.some(f => file === `${directory}/${f}.ts`)) for (const name of files) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${name}["']`));
    }
    expect(FUSION_RANK_POLICY.specificity).toEqual({ REINFORCE: 1, TENSION: 1.15, COMPLEMENT: 1.1 });
  });
});
