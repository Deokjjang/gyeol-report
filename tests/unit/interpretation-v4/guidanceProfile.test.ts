import { afterAll, describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildContextualGuidanceProfile } from "../../../src/lib/interpretation-v4/guidanceProfile";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { resolveGuidanceConflicts } from "../../../src/lib/interpretation-v4/guidanceConflictResolver";
import { selectGuidance } from "../../../src/lib/interpretation-v4/guidanceEvaluator";
import { emptyGuidanceDiagnostics, validateGuidanceCandidates } from "../../../src/lib/interpretation-v4/guidanceDiagnostics";
import type { GuidanceInputs, GuidanceStrategyId } from "../../../src/lib/interpretation-v4/guidanceCore";
import { rankGuidance } from "../../../src/lib/interpretation-v4/guidanceRanking";
import { GUIDANCE_BEHAVIOR_SOURCES } from "../../../src/lib/interpretation-v4/guidanceEvidence";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";
import { context, guidanceInputs, profile, establishedProblem } from "./guidanceFixtures";
import { strong } from "./claimFixtures";
import { myProfile, realMbti } from "./fusionSemanticFixtures";
const hash = (x: unknown) => createHash("sha256").update(JSON.stringify(x)).digest("hex");
const modules = ["guidanceCore", "guidanceContext", "guidanceJobClassifier", "guidanceProblems", "guidanceEvidence", "guidanceStrategies", "guidanceContextVariants", "guidanceEvaluator", "guidanceConflictResolver", "guidanceRanking", "guidanceDiagnostics", "guidanceProfile"];
const review: unknown[] = [];
afterAll(() => { if (process.env.GUIDANCE_REVIEW_EXPORT === "1") { mkdirSync("/tmp/gyeol-13d3c-guidance", { recursive: true }); writeFileSync("/tmp/gyeol-13d3c-guidance/review.json", JSON.stringify(review, null, 2)); } });

describe("3C deterministic isolated profile", () => {
  const i = guidanceInputs(strong({ PRECISION: 2, STRUCTURE_STYLE: 2, ACTION_TEMPO: -2, DUTY: 2 }));
  it("job changes guidance only; all five immutable upstream inputs unchanged", () => {
    const before = hash(i), developer = profile(i, { detailJob: "개발자" }), artist = profile(i, { detailJob: "화가" });
    expect(hash(i)).toBe(before); expect(developer.problems).toEqual(artist.problems);
    expect(developer.guidanceCandidates.find(c => c.problemId === "G01")?.customerAdvice).not.toBe(artist.guidanceCandidates.find(c => c.problemId === "G01")?.customerAdvice);
    expect(profile(i, { detailJob: "개발자" })).toEqual(developer);
    expect(JSON.parse(JSON.stringify(developer))).toEqual(developer);
  });
  it("relationship modifies an established problem only", () => {
    const r = guidanceInputs(strong({ SOCIAL_ATTUNEMENT: 2, DEPTH: 2 }));
    const results = (["single", "dating", "married", "", "some", "marriage_preparing"] as const).map(relationshipStatus => profile(r, { relationshipStatus }));
    expect(results.every(p => p.problems.some(x => x.id === "G26"))).toBe(true);
    expect(new Set(results.map(p => JSON.stringify(p.problems.map(x => x.id)))).size).toBe(1);
    expect(results[1].guidanceCandidates.find(g => g.problemId === "G26")!.customerAdvice).toContain("답장이 늦었다");
    const empty = guidanceInputs(myProfile([]));
    for (const relationshipStatus of ["dating", "married"] as const) expect(profile(empty, { relationshipStatus }).problems).toEqual([]);
  });
  it("forged shadows, missing sources and invalid raw context fail closed", () => {
    const forged = structuredClone(i); forged.resonance.traitArcs[0].shadowDescription = "invented";
    const result = buildContextualGuidanceProfile(forged); expect(result.ok).toBe(false);
    if (!result.ok) expect(result.diagnostics.hardErrors).toContain("STALE_OR_FORGED_PERSONAL_RESONANCE");
    expect(buildContextualGuidanceProfile(i, { jobStatus: "invented" as never }).ok).toBe(false);
    const p = profile(i), row = { ...p.guidanceCandidates[0], sourceResonanceIds: ["does-not-exist"] };
    expect(validateGuidanceCandidates([row], i, p.context)).toContain(`MISSING_SOURCE_REF:${row.id}`);
  });
  it("unknown MBTI remains unknown and Myeongli-only advice works", () => {
    expect(i.mbti.available).toBe(false); const p = profile(i);
    expect(p.guidanceCandidates.length).toBeGreaterThan(0); expect(p.guidanceCandidates.every(g => g.evidenceIds.every(id => !id.startsWith("mbti:")))).toBe(true);
  });
  it("ranking is bounded, deterministic, at most ten top candidates", () => {
    const p = profile(i); expect(p.topGuidance.length).toBeLessThanOrEqual(10);
    expect(rankGuidance([...p.guidanceCandidates].reverse())).toEqual(rankGuidance(p.guidanceCandidates));
    for (const row of p.guidanceCandidates) expect(row.diagnostics.rankingScore).toBeGreaterThanOrEqual(0);
  });
  it("suppression/ref/debug retained and no scalar advice on LOW", () => {
    const p = profile(i, { detailJob: "회계사" }); expect(p.debug.suppressedUnsafe.length).toBeGreaterThan(0);
    expect(p.diagnostics.suppressedLowEvidenceProblems.length + p.problems.length).toBe(40);
    expect(p.topGuidance.every(c => c.confidence !== "LOW")).toBe(true); expect(p.debug.problems).toEqual(p.problems);
    const unsafe = { ...p.guidanceCandidates[0], selectedStrategyIds: ["ITERATE_WHEN_SAFE" as const] };
    expect(validateGuidanceCandidates([unsafe], i, p.context)).toContain(`FORBIDDEN_STRATEGY:${unsafe.id}`);
  });
});

describe("six conflict resolutions preserve the useful strength", () => {
  // Unit boundary: already-established problem fixtures exercise resolver paths,
  // including G30 whose real unsupported risk gate intentionally stays closed.
  const inputs = guidanceInputs(strong({ CARE: 2, SOCIAL_ATTUNEMENT: 2, COMMUNICATION_STYLE: 2, PRECISION: 2, RESOURCE_SENSE: 2, MEANING: 2, CHANGE_ORIENTATION: 2, STABILITY: 2, DEPTH: 2, CURIOSITY: 2 }));
  function resolve(ids: string[], i: GuidanceInputs = inputs) {
    const c = context(), d = emptyGuidanceDiagnostics(c);
    const rows = ids.map(id => selectGuidance({ ...establishedProblem(id), sourceResonanceIds: i.resonance.candidates.map(r => r.id) }, c, d)!);
    return resolveGuidanceConflicts(rows, i, c);
  }
  it.each([
    [["G02", "G06"], "decision-execution", "DECISION_EXECUTION_SPLIT", "방향을 정한 뒤"],
    [["G24", "G28"], "care-boundary", "SET_BOUNDARY", "장점은 그대로"],
    [["G19"], "directness-care", "PERSON_VS_PROBLEM", "사람을 평가하지"],
    [["G12", "G11"], "stability-change", "SMALL_EXPERIMENT", "작은 부분"],
    [["G33"], "money-meaning", "VALUE_AND_PRICE_SEPARATE", "하나를 포기"],
    [["G30"], "saving-experience", "BUDGET_BUCKETS", "써도 되는 돈"],
  ] as const)("%s merges %s", (ids, key, strategy, text) => {
    const r = resolve([...ids]); expect(r.groups.some(g => g.id === `guidance-conflict:${key}`)).toBe(true);
    expect(r.merged[0].selectedStrategyIds).toContain(strategy as GuidanceStrategyId); expect(r.merged[0].customerAdvice).toContain(text);
    expect(r.candidates.every(c => c.conflictGroupId)).toBe(true); expect(r.merged[0].mergedFromGuidanceIds?.length).toBe(ids.length);
  });
  it("actual care profile exposes merged advice instead of contradictory originals", () => {
    const p = profile(guidanceInputs(strong({ CARE: 2, DUTY: 2, SOCIAL_ATTUNEMENT: 2 })));
    expect(p.mergedGuidance.some(g => g.id === "guidance-merge:care-boundary")).toBe(true);
    expect(p.topGuidance.every(g => !g.conflictGroupId || !!g.mergedFromGuidanceIds)).toBe(true);
  });
});

describe("actual DOB/source coverage and six-product isolation", () => {
  it.each(["ENTJ", "ENTP", "INTJ", "INTP", "ENFJ", "ENFP", "INFJ", "INFP", "ESTJ", "ESFJ", "ISTJ", "ISFJ", "ESTP", "ESFP", "ISTP", "ISFP", null])("%s actual MBTI never relies on its prior alone", type => {
    const i = guidanceInputs(strong({ PRECISION: 2, STRUCTURE_STYLE: 2, ACTION_TEMPO: -2 }), realMbti(type));
    const p = profile(i, { detailJob: "출판 편집자", jobStatus: "employee" }); expect(p.diagnostics.hardErrors).toEqual([]);
    expect(p.guidanceCandidates.length).toBeGreaterThan(0);
    expect(p.guidanceCandidates.every(g => g.evidenceIds.every(id => !id.includes("prior")))).toBe(true);
  });
  it.each(NARRATIVE_FIXTURES)("$id actual chart remains unchanged", fixture => {
    const calculation = fixtureInput(fixture).calculation, natal = buildIntegratedMyeongliProfile(calculation);
    if (!natal.ok) return expect.unreachable(JSON.stringify(natal.diagnostics));
    const i = guidanceInputs(natal.value, realMbti(fixture.mbti)), before = hash({ i, calculation });
    const p = profile(i, fixture.context); expect(hash({ i, calculation })).toBe(before);
    expect(p.diagnostics.hardErrors).toEqual([]); expect(p.problems.length + p.diagnostics.suppressedLowEvidenceProblems.length).toBe(40);
    review.push({ fixture: fixture.id, context: p.context, problems: p.problems, topGuidance: p.topGuidance, diagnostics: p.diagnostics });
  }, 30000);
  it("all mapped behavioral sources have annotations and matching context, not reference-only data", () => {
    const types = [...new Set(Object.values(GUIDANCE_BEHAVIOR_SOURCES).flat().map(id => id.split(":")[1]))];
    for (const type of types) {
      const b = realMbti(type);
      for (const id of Object.values(GUIDANCE_BEHAVIOR_SOURCES).flat().filter(id => id.split(":")[1] === type)) expect(b.annotations.some(a => a.sourceNodeId === id && a.sourceType !== "reference_only"), id).toBe(true);
    }
  });
  it("3C remains entirely off customer runtime, all previous layers and side effects", () => {
    function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []); }
    for (const file of walk("src")) {
      if (["comprehensiveProductAdapter", "careerProductAdapter"].some(n => file === `src/lib/interpretation-v4/${n}.ts`)) continue;
      const text = readFileSync(file, "utf8");
      if (modules.some(n => file === `src/lib/interpretation-v4/${n}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|Composer|bookProjection|runtimeShadow|supabase|openai/i);
      else if (!["comprehensivePlanCore", "comprehensiveDiagnostics", "narrativeSceneCore", "narrativeTitleShort", "operatingRuleRegistry", "operatingRuleBuilder"].some(n => file === `src/lib/interpretation-v4/${n}.ts`)) for (const name of modules) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${name}["']`));
    }
    const evaluator = readFileSync("src/lib/interpretation-v4/guidanceEvidence.ts", "utf8");
    expect(evaluator).not.toMatch(/rawJobText|lifeStatus|relationshipStatus|GuidanceUserContext/);
    expect(readFileSync("src/lib/interpretation-v4/guidanceJobClassifier.ts", "utf8")).not.toMatch(/PersonalResonance|ClaimProfile|MyeongliSemanticProfile|axes|humanDescription/);
  });
});
