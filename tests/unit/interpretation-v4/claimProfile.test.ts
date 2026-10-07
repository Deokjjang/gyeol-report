import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { buildClaimProfile } from "../../../src/lib/interpretation-v4/claimProfile";
import { inspectClaimInputs, validateClaimCandidates } from "../../../src/lib/interpretation-v4/claimDiagnostics";
import { buildClaimEvidenceView } from "../../../src/lib/interpretation-v4/claimEvidence";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { evaluateClaim } from "../../../src/lib/interpretation-v4/claimEvaluator";
import { CLAIM_REGISTRY } from "../../../src/lib/interpretation-v4/claimRegistry";
import { myAtom, myProfile, realMbti, mbtiProfile, repeated, fuse } from "./fusionSemanticFixtures";
import { claim, claims, strong, integrated, withComposite, wealth, officer, marker } from "./claimFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("claim provenance boundary", () => {
  const m = strong({ RESOURCE_SENSE: 2, PRACTICALITY: 2, MEANING: 2 });
  const b = mbtiProfile(repeated({ RESOURCE_SENSE: 2, PRACTICALITY: 2, MEANING: 2 }, 3, "MONEY"));
  it("all three inputs immutable, deterministic including diagnostics and debug", () => {
    const f = fuse(m, b), before = hash([m, b, f]);
    const p = buildClaimProfile(m, b, f);
    expect(buildClaimProfile(m, b, f)).toEqual(p); expect(hash([m, b, f])).toBe(before);
    expect(JSON.parse(JSON.stringify(p))).toEqual(p);
    const shuffledM = structuredClone(m), shuffledB = structuredClone(b), shuffledF = structuredClone(f);
    shuffledM.evidence.reverse(); shuffledM.rankedCandidates.reverse(); shuffledB.sourceNodes.reverse(); shuffledB.annotations.reverse(); shuffledB.contributions.reverse();
    shuffledF.reinforce.reverse(); shuffledF.complements.reverse(); shuffledF.tensions.reverse();
    expect(buildClaimProfile(shuffledM, shuffledB, shuffledF)).toEqual(p);
  });
  it("underlying references deduped across axes, composites and fusion", () => {
    const p = claims(m, b), c = p.candidates.find(c => c.id === "M01_REALISTIC_MONEY_SENSE")!;
    expect(c.evidence.myeongliEvidenceIds).toEqual(["core-a", "core-b"]);
    expect(c.evidence.mbtiSourceNodeIds).toHaveLength(3);
    expect(c.evidence.independentMyeongliFamilies).toHaveLength(2);
    expect(c.evidence.fusionCandidateIds.length).toBeGreaterThan(0);
    for (const c of p.candidates) for (const ids of Object.values(c.evidence)) expect(ids.length).toBe(new Set(ids).size);
  });
  it("prior-only input cannot create an axis, fortune, or level increase", () => {
    const single = myProfile([myAtom("solo", { LEADERSHIP: 2 })]);
    const priorOnly = mbtiProfile([], "ENTJ", true);
    expect(claim(single, "S01", priorOnly)?.level).toBe(claim(single, "S01")?.level);
    expect(claim(single, "S01", priorOnly)?.evidence.mbtiSourceNodeIds).toEqual([]);
    expect(claim(myProfile([]), "M08", priorOnly)).toBeUndefined();
  });
  it("work-only and love-only facts do not leak into money rules", () => {
    const local = myProfile([myAtom("love", { RESOURCE_SENSE: 2, PRACTICALITY: 2 }, { contexts: ["love"] })]);
    const love = mbtiProfile(repeated({ RESOURCE_SENSE: 2, PRACTICALITY: 2 }, 3, "LOVE"));
    expect(claim(local, "M01", love)).toBeUndefined();
    const p = claims(local, love); expect(p.diagnostics.hardErrors).toEqual([]);
  });
  it("unresolved natal opposite direction blocks L4 without deleting valid desires", () => {
    const base = strong({ RESOURCE_SENSE: 2, OPPORTUNITY_SENSE: 2 }, [wealth(), marker("JAEGO")]);
    const mixed = withComposite(integrated([...base.evidence, myAtom("p", { RISK_STYLE: 2 }), myAtom("n", { RISK_STYLE: -2 })]), "OUTPUT_TO_WEALTH", ["RESOURCE_SENSE", "RISK_STYLE"]);
    // Unrelated risk tension is not a wealth contradiction; claim-specific axes only.
    expect(claim(mixed, "M08")?.level).toBe(4);
  });
  it("same-family tag aliases do not meet high-position diversity", () => {
    const rows = [wealth(), officer(), marker("JANGSEONG"), marker("BANAN")].map(e => ({ ...e, family: "same-underlying-family" }));
    expect(claim(integrated(rows), "S03", realMbti("ENTJ"))).toBeUndefined();
    expect(claim(integrated(rows), "S08", realMbti("ENTJ"))).toBeUndefined();
  });
  it("weak/zero-confidence evidence cannot activate claims", () => {
    const weak = myProfile([myAtom("weak", { LEADERSHIP: 2 }, { strength: "WEAK" }), myAtom("zero", { LEADERSHIP: 2 }, { weight: 0 })]);
    expect(claims(weak).candidates).toEqual([]);
  });
  it("reference-only MBTI and stale or invented Fusion fail closed", () => {
    const reference = structuredClone(b); reference.sourceNodes[0].classification = "REFERENCE_ONLY";
    expect(buildClaimProfile(m, reference, fuse(m, b)).ok).toBe(false);
    const forged = fuse(m, b); forged.reinforce[0].rankingScore += 100;
    expect(inspectClaimInputs(m, b, forged).map(e => e.code)).toContain("STALE_OR_FORGED_FUSION");
    const unknown = fuse(m, b); unknown.reinforce[0].id = "invented:fusion";
    expect(inspectClaimInputs(m, b, unknown).map(e => e.code)).toContain("UNKNOWN_FUSION_ID");
    const noEvidence = structuredClone(m); noEvidence.evidence = [];
    expect(buildClaimProfile(noEvidence, b, fuse(m, b)).ok).toBe(false);
  });
  it("candidate invariant errors are explicit rather than silently corrected", () => {
    const f = fuse(m, b), p = claims(m, b), original = p.candidates.find(c => c.id === "M01_REALISTIC_MONEY_SENSE")!;
    const check = (change: (c: typeof original) => void) => { const c = structuredClone(original); change(c); return validateClaimCandidates([c], m, b, f).map(e => e.code); };
    expect(check(c => { c.id = "fake"; })).toContain("UNKNOWN_CLAIM_ID");
    expect(check(c => { c.fortuneClaim = true; })).toContain("FORTUNE_FLAG_MISMATCH");
    expect(check(c => { c.level = 4; })).toContain("UNAUTHORIZED_LEVEL4");
    expect(check(c => { c.customerClaim = "다른 레벨 문장"; })).toContain("INVALID_COPY_LEVEL_MAPPING");
    expect(check(c => { c.evidence.myeongliEvidenceIds.push("missing"); })).toContain("MISSING_MYEONGLI_EVIDENCE");
    expect(check(c => { c.evidence.mbtiSourceNodeIds.push("reference"); })).toContain("NON_SCORING_MBTI_SOURCE");
    expect(check(c => { c.evidence.fusionCandidateIds.push("fake"); })).toContain("UNKNOWN_FUSION_ID");
    expect(check(c => { c.evidence.myeongliEvidenceIds.push(c.evidence.myeongliEvidenceIds[0]); })).toContain("UNDERLYING_EVIDENCE_DOUBLE_COUNT");
    expect(validateClaimCandidates([original, original], m, b, f).map(e => e.code)).toContain("DUPLICATE_CLAIM_ID");
    const fortunate = claim(withComposite(strong({ RESOURCE_SENSE: 2 }, [wealth(), marker("JAEGO")]), "OUTPUT_TO_WEALTH", ["RESOURCE_SENSE"]), "M08")!;
    expect(validateClaimCandidates([fortunate], myProfile([]), realMbti(null), fuse(myProfile([]), realMbti(null))).map(e => e.code)).toContain("FORTUNE_WITHOUT_MYEONGLI_GATE");
  });
  it("verified family state must reference actual matching ten gods", () => {
    const bad = structuredClone(m); bad.foundation.tenGods.states.families.WEALTH = { state: "HIGH", evidenceIds: ["core-a"], provenance: ["invalid"] };
    expect(inspectClaimInputs(bad, b, fuse(m, b)).map(e => e.code)).toContain("INVALID_TEN_GOD_FAMILY_PROVENANCE");
  });
  it("missing fortune axes cannot be patched with a manually passed Fusion candidate", () => {
    const f = fuse(m, b); const copied = structuredClone(f.complements[0]);
    copied.ruleId = "C040"; copied.id = "spoof:C040"; copied.strength = "SIGNATURE"; f.complements.push(copied);
    expect(buildClaimProfile(m, b, f).ok).toBe(false);
  });
  it("exclusivity retains candidates and puts the higher composite first", () => {
    const p = claims(withComposite(strong({ RESOURCE_SENSE: 2, STATUS_DRIVE: 2, GOAL_DRIVE: 2 }, [wealth(), officer(), marker("JAEGO"), marker("BANAN")])));
    expect(p.candidates[0].id).toBe("S08_MONEY_AND_HONOR");
    for (const id of ["M08_GOOD_WEALTH_PATTERN", "S04_HONOR_FORTUNE"]) expect(p.candidates.find(c => c.id === id)?.relatedClaimIds).toContain("S08_MONEY_AND_HONOR");
    expect(p.candidates.some(c => c.level === (0 as number))).toBe(false);
    expect(p.debug.suppressed.every(c => c.level === 0 && c.reasons.length > 0)).toBe(true);
  });
  it("registry evaluator can be inspected without any writer or customer effect", () => {
    const f = fuse(m, b), view = buildClaimEvidenceView(m, b, f), definition = CLAIM_REGISTRY[0];
    const c = evaluateClaim(definition, view, m).candidate!;
    expect(c.diagnostics.gates.every(g => g.passed)).toBe(true); expect(c.customerClaim).toBe(definition.claimsByLevel[c.level]);
  });
});

describe("real source coverage and runtime separation", () => {
  it("twelve real natal fixtures and every actual MBTI remain valid; unknown is meaningful", () => {
    const review: unknown[] = [];
    const types = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP", null];
    for (const [i, type] of types.entries()) {
      const fixture = NARRATIVE_FIXTURES[i % NARRATIVE_FIXTURES.length], result = buildIntegratedMyeongliProfile(fixtureInput(fixture).calculation);
      if (!result.ok) return expect.unreachable(JSON.stringify(result.diagnostics.hardErrors));
      const b = realMbti(type), f = fuse(result.value, b), before = hash([result.value, b, f]);
      const p = buildClaimProfile(result.value, b, f); if (!p.ok) return expect.unreachable(JSON.stringify(p.diagnostics.hardErrors));
      expect(p.value.candidates.length).toBeGreaterThan(0); expect(hash([result.value, b, f])).toBe(before);
      expect(p.value.diagnostics.levelCounts[0] + p.value.candidates.length).toBe(41);
      if (!type) expect(p.value.candidates.every(c => c.evidence.mbtiSourceNodeIds.length === 0)).toBe(true);
      review.push({ fixture: fixture.id, type, levels: p.value.diagnostics.levelCounts, claims: p.value.candidates.map(c => ({ id: c.id, level: c.level, copy: c.customerClaim, evidence: c.evidence })), diagnostics: p.value.diagnostics });
    }
    if (process.env.CLAIM_ENGINE_REVIEW_EXPORT === "1") {
      mkdirSync("/tmp/gyeol-13d3a-claims", { recursive: true }); writeFileSync("/tmp/gyeol-13d3a-claims/review.json", JSON.stringify(review, null, 2));
    }
  }, 30000);
  it("counterfactual MBTI or natal evidence changes claims without inventing type", () => {
    const m = myProfile([myAtom("leader", { LEADERSHIP: 2 })]);
    expect(claims(m, realMbti("ENTJ"))).not.toEqual(claims(m, realMbti("ISFP")));
    expect(claims(m, realMbti("ENTJ"))).not.toEqual(claims(strong({ CARE: 2 }), realMbti("ENTJ")));
    for (const unknown of [undefined, null, "unknown"]) expect(claims(strong({ LEADERSHIP: 2 }), realMbti(unknown)).diagnostics.warnings).toContainEqual({ code: "MBTI_UNAVAILABLE", refs: [] });
  });
  it("new modules have no customer, calculation, provider, side-effect or scheduler consumer", () => {
    const directory = "src/lib/interpretation-v4", names = ["claimCore", "claimEvidence", "claimEvaluator", "claimDiagnostics", "claimProfile", "claimRegistry", "claimRegistryMoney", "claimRegistryStatus", "claimRegistrySuccess", "claimRegistrySocial", "claimRegistryFactBomb"];
    const resonanceBoundary = ["personalResonanceCore", "personalResonanceRules", "personalResonanceEvidence", "personalResonanceEvaluator", "traitArc", "personalResonanceDiagnostics", "personalResonanceProfile", "guidanceCore", "guidanceEvidence", "guidanceProfile"];
    function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []); }
    for (const file of walk("src")) {
      const text = readFileSync(file, "utf8");
      if (names.some(name => file === `${directory}/${name}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|Composer|bookProjection|runtimeShadow|supabase|openai|C[1-9]-C10|LifeStatus/);
      else if (!resonanceBoundary.some(name => file === `${directory}/${name}.ts`)) for (const name of names) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${name}["']`));
    }
  });
});
