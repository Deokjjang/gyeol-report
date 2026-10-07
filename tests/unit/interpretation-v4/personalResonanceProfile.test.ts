import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { buildPersonalResonanceProfile } from "../../../src/lib/interpretation-v4/personalResonanceProfile";
import { buildIntegratedMyeongliProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
import { validatePersonalResonanceCandidates, stableResonanceValue } from "../../../src/lib/interpretation-v4/personalResonanceDiagnostics";
import { HUMAN_GOLDEN_LANGUAGE, humanLanguageErrors } from "../../../src/lib/interpretation-v4/humanDescription";
import { PERSONAL_RESONANCE_REGISTRY } from "../../../src/lib/interpretation-v4/personalResonanceRegistry";
import { CORE_GYEOL_GRAMMARS } from "../../../src/lib/interpretation-v4/personalResonanceCore";
import { strong, integrated, marker } from "./claimFixtures";
import { realMbti, myAtom, mbtiProfile, repeated } from "./fusionSemanticFixtures";
import { resonance, resonanceInputs, resonanceScope } from "./personalResonanceFixtures";
import { NARRATIVE_FIXTURES, fixtureInput } from "./narrativeFixtures";

const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const modules = ["humanDescription", "personalResonanceCore", "personalResonanceRules", "personalResonanceRegistry", "personalResonanceRegistryThinking", "personalResonanceRegistryValues", "personalResonanceRegistryRelationships", "personalResonanceRegistryIdentity", "personalResonanceEvidence", "personalResonanceEvaluator", "personalResonanceRanking", "personalResonanceDiagnostics", "personalResonanceProfile", "traitArc", "coreGyeol"];
const review: unknown[] = [];
const types = [...NARRATIVE_FIXTURES.map(f => f.mbti), "INTJ", "INFP", "ENFJ", "ESFJ", "ISTP", "ESFP", "ESTJ"];
afterAll(() => {
  if (process.env.PERSONAL_RESONANCE_REVIEW_EXPORT === "1") {
    mkdirSync("/tmp/gyeol-13d3b-resonance", { recursive: true }); writeFileSync("/tmp/gyeol-13d3b-resonance/review.json", JSON.stringify(review, null, 2));
  }
});

describe("personal resonance profile boundary", () => {
  it("four inputs immutable, full result serializable and deterministic, reordered sources stable", () => {
    const i = resonanceInputs(strong({ PRECISION: 2, CARE: 2, AUTONOMY: 2, DUTY: 2 }), realMbti("ENTJ"));
    const before = hash(i), p = buildPersonalResonanceProfile(i.m, i.b, i.f, i.claims);
    expect(p.ok).toBe(true); expect(buildPersonalResonanceProfile(i.m, i.b, i.f, i.claims)).toEqual(p);
    expect(hash(i)).toBe(before); expect(JSON.parse(JSON.stringify(p))).toEqual(p);
    const shuffled = structuredClone(i);
    shuffled.m.evidence.reverse(); shuffled.m.rankedCandidates.reverse(); shuffled.b.sourceNodes.reverse(); shuffled.b.annotations.reverse(); shuffled.b.contributions.reverse();
    shuffled.f.reinforce.reverse(); shuffled.f.tensions.reverse(); shuffled.f.complements.reverse(); shuffled.claims.candidates.reverse();
    expect(buildPersonalResonanceProfile(shuffled.m, shuffled.b, shuffled.f, shuffled.claims)).toEqual(p);
  });
  it("forged claim/fusion/reference-only metadata cannot launder specific copy", () => {
    const i = resonanceInputs(strong({ PRECISION: 2, STRUCTURE_STYLE: 2 }), realMbti("ENTJ"));
    const corrupt = structuredClone(i); corrupt.claims.candidates[0].customerClaim = HUMAN_GOLDEN_LANGUAGE.delayedPrecision;
    expect(buildPersonalResonanceProfile(corrupt.m, corrupt.b, corrupt.f, corrupt.claims).ok).toBe(false);
    const forged = structuredClone(i); forged.f.reinforce[0].rankingScore += 1;
    expect(buildPersonalResonanceProfile(forged.m, forged.b, forged.f, forged.claims).ok).toBe(false);
    const ref = structuredClone(i), id = ref.b.contributions.find(c => c.sourceType !== "dimension_prior")!.sourceNodeId;
    ref.b.sourceNodes.find(n => n.id === id)!.classification = "REFERENCE_ONLY";
    expect(buildPersonalResonanceProfile(ref.m, ref.b, ref.f, ref.claims).ok).toBe(false);
  });
  it("prior-only MBTI contributes neither specifics nor independence", () => {
    const m = strong({ DEPTH: 2, CURIOSITY: 2 });
    const p = resonance(m, mbtiProfile([], "ENTJ", true)), unknown = resonance(m);
    expect(p.candidates).toEqual(unknown.candidates); expect(p.coreGyeolCandidates).toEqual(unknown.coreGyeolCandidates);
  });
  it("forged active specificity and duplicated underlying IDs are hard errors", () => {
    const m = strong({ AUTONOMY: 2, DUTY: 2 }), scope = resonanceScope(m), p = resonance(m);
    const c = structuredClone(p.candidates[0]); c.humanDescription = "매주 일요일 서점에서 생각합니다."; c.diagnostics.independentCount += 10;
    c.evidence.myeongliEvidenceIds.push(c.evidence.myeongliEvidenceIds[0]);
    expect(validatePersonalResonanceCandidates([c], scope).map(e => e.code)).toEqual(expect.arrayContaining(["UNSUPPORTED_SPECIFICITY", "UNDERLYING_EVIDENCE_DOUBLE_COUNT", "STALE_OR_FORGED_RESONANCE"]));
  });
  it("resolved decision split wins without deleting the slower/faster candidates", () => {
    const m = strong({ DEPTH: 2, ACTION_TEMPO: -2, CURIOSITY: 2, STRATEGY: 2 });
    const p = resonance(m, mbtiProfile(repeated({ ACTION_TEMPO: 2, STRATEGY: 2 }, 3)));
    expect(p.candidates.find(c => c.ruleId === "PR001")?.conditionSplit?.resolved).toBe(true);
    expect(p.candidates.some(c => c.ruleId === "PR005")).toBe(true); expect(p.candidates.some(c => c.ruleId === "PR010")).toBe(true);
    expect(p.conflictGroups.find(g => g.id === "pr-conflict:DECISION_TIMING")?.resolvedBy).toContain("resonance:PR001");
    expect(p.candidates.find(c => c.ruleId === "PR001")!.rankingScore).toBeGreaterThan(p.candidates.find(c => c.ruleId === "PR005")!.rankingScore);
  });
  it("unresolved speech contradiction is not averaged into a best core", () => {
    const m = strong({ COMMUNICATION_STYLE: 2, AUTONOMY: 2 });
    const p = resonance(m, mbtiProfile(repeated({ COMMUNICATION_STYLE: -2 }, 3)));
    expect(p.candidates.find(c => c.ruleId === "PR002")?.diagnostics.unresolvedContradiction).toBe(true);
    expect(p.coreGyeolCandidates.some(c => c.sourceResonanceIds.includes("resonance:PR002"))).toBe(false);
  });
  it("all eight core grammars activate only via qualifying people/arc sources", () => {
    const general = strong({ DEPTH: 2, ACTION_TEMPO: 2, CURIOSITY: 2, CREATION: 2, STRUCTURE_STYLE: 2, PRECISION: 2, RESOURCE_SENSE: 2, MEANING: 2, STABILITY: 2, CHANGE_ORIENTATION: 2, ENERGY_DIRECTION: 2, RECOVERY_NEED: 2 });
    const pressure = strong({ LEADERSHIP: 2, DUTY: 2 }, [myAtom("pressure", { DUTY: 2 }, { contexts: ["stress"] })]);
    const grammars = new Set([...resonance(general).coreGyeolCandidates, ...resonance(pressure).coreGyeolCandidates].map(c => c.grammar));
    expect(grammars).toEqual(new Set(CORE_GYEOL_GRAMMARS));
  });
  it("known risk detail has a narrower context than a general axis", () => {
    const m = strong({ EXPRESSION: 2, PRECISION: 2 }), p = resonance(m, realMbti("INTP"));
    const c = p.candidates.find(c => c.ruleId === "PR060"); expect(c).toBeDefined();
    expect(c!.evidence.mbtiSourceNodeIds).toContain("mbti:INTP:traits:communication:topic_triggered_talk:plainKo");
    const a = marker("GWIMUN"); a.metadata = { ...a.metadata, riskTags: ["RUMINATION", "FIXATION"] };
    const r = resonance(integrated([...strong({ ENERGY_DIRECTION: -2, DEPTH: 2 }).evidence, a])); expect(r.candidates.some(c => c.ruleId === "PR080")).toBe(true);
  });
  it.each(types.map((type, index) => [index, type] as const))("actual source case %i / %s is immutable and inspectable", (index, type) => {
      const f = NARRATIVE_FIXTURES[index % NARRATIVE_FIXTURES.length], m = buildIntegratedMyeongliProfile(fixtureInput(f).calculation);
      if (!m.ok) return expect.unreachable(JSON.stringify(m.diagnostics.hardErrors));
      const i = resonanceInputs(m.value, realMbti(type)), before = hash(i), result = buildPersonalResonanceProfile(i.m, i.b, i.f, i.claims);
      if (!result.ok) return expect.unreachable(`${f.id}/${type}: ${JSON.stringify(result.diagnostics.hardErrors)}`);
      const p = result.value; expect(hash(i)).toBe(before); expect(p.candidates.length).toBeGreaterThan(0);
      expect(p.candidates.length + p.diagnostics.suppressedRuleIds.length).toBe(96);
      expect(p.debug.topSignatureResonance.length).toBeLessThanOrEqual(8); expect(p.debug.topMainResonance.length).toBeLessThanOrEqual(16);
      for (const c of p.candidates) { expect(humanLanguageErrors(c.humanDescription)).toEqual([]); expect(c.diagnostics.unsupportedSpecificity).toBe(false); }
      if (!type) { expect(p.candidates.every(c => !c.evidence.mbtiSourceNodeIds.length)).toBe(true); expect(p.bestCoreGyeol).toBeDefined(); }
      review.push({ fixture: f.id, mbti: type, input: { date: f.date, time: f.time ?? "unknown", gender: f.gender },
        top: p.candidates.slice(0, 8), core: p.coreGyeolCandidates, best: p.bestCoreGyeol, arcs: p.traitArcs, diagnostics: p.diagnostics });
  }, 30000);
  it("source-only module graph: customer paths and all previous engines import none of 3B", () => {
    function walk(dir: string): string[] { return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : []); }
    for (const file of walk("src")) {
      const text = readFileSync(file, "utf8");
      if (modules.some(n => file === `src/lib/interpretation-v4/${n}.ts`)) expect(text).not.toMatch(/Math\.random|Date\.now|new Date|process\.env|fetch\(|calculateSaju\(|Composer|bookProjection|runtimeShadow|supabase|openai|WorkMode|LifeStatus/);
      else if (!["guidanceCore", "guidanceProblems", "guidanceEvidence", "guidanceConflictResolver", "guidanceDiagnostics"].some(n => file === `src/lib/interpretation-v4/${n}.ts`)) for (const name of modules) expect(text, file).not.toMatch(new RegExp(`["'][^"']*/${name}["']`));
    }
    expect(PERSONAL_RESONANCE_REGISTRY).toHaveLength(96);
    expect(stableResonanceValue({ b: 2, a: 1 })).toBe(stableResonanceValue({ a: 1, b: 2 }));
  });
});
