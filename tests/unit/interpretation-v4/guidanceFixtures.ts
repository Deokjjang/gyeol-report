import { expect } from "vitest";
import type { GuidanceInputs, GuidanceProblemCandidate, GuidanceUserContext } from "../../../src/lib/interpretation-v4/guidanceCore";
import { buildPersonalResonanceProfile } from "../../../src/lib/interpretation-v4/personalResonanceProfile";
import { buildContextualGuidanceProfile } from "../../../src/lib/interpretation-v4/guidanceProfile";
import { normalizeGuidanceContext, type GuidanceContextInput } from "../../../src/lib/interpretation-v4/guidanceContext";
import { guidanceScope, evaluateGuidanceProblem } from "../../../src/lib/interpretation-v4/guidanceEvidence";
import { GUIDANCE_PROBLEM_REGISTRY } from "../../../src/lib/interpretation-v4/guidanceProblems";
import { emptyGuidanceDiagnostics } from "../../../src/lib/interpretation-v4/guidanceDiagnostics";
import { selectGuidance } from "../../../src/lib/interpretation-v4/guidanceEvaluator";
import { resonanceInputs } from "./personalResonanceFixtures";
import { realMbti } from "./fusionSemanticFixtures";
import type { MyeongliSemanticProfile } from "../../../src/lib/interpretation-v4/foundationIntegratedProfile";
export function guidanceInputs(m: MyeongliSemanticProfile, b = realMbti(null)): GuidanceInputs {
  const i = resonanceInputs(m, b), r = buildPersonalResonanceProfile(i.m, i.b, i.f, i.claims);
  if (!r.ok) return expect.unreachable(JSON.stringify(r.diagnostics));
  return { myeongli: i.m, mbti: i.b, fusion: i.f, claims: i.claims, resonance: r.value };
}
export function context(raw: GuidanceContextInput = {}): GuidanceUserContext {
  const c = normalizeGuidanceContext(raw); if (!c.ok) return expect.unreachable(JSON.stringify(c)); return c.value;
}
export function problem(id: string, input: GuidanceInputs) {
  return evaluateGuidanceProblem(GUIDANCE_PROBLEM_REGISTRY.find(p => p.id === id)!, input, guidanceScope(input, "identity").view);
}
export function profile(i: GuidanceInputs, raw: GuidanceContextInput = {}) {
  const p = buildContextualGuidanceProfile(i, raw); if (!p.ok) return expect.unreachable(JSON.stringify(p.diagnostics)); return p.value;
}
/** Selection fixtures are explicitly established problems, not fake chart data. */
export function establishedProblem(id: string): GuidanceProblemCandidate {
  const d = GUIDANCE_PROBLEM_REGISTRY.find(p => p.id === id)!;
  return { ...d, semanticTheme: d.problem, sourceResonanceIds: [], sourceClaimIds: [], sourceTraitArcIds: [], sourceFusionIds: [], evidenceIds: ["selection-fixture"],
    evidenceStrength: "STRONG", confidence: "HIGH", forbiddenStrategies: [], relatedProblemIds: [] };
}
export function select(id: string, raw: GuidanceContextInput = {}) {
  const c = context(raw), diagnostics = emptyGuidanceDiagnostics(c), selected = selectGuidance(establishedProblem(id), c, diagnostics);
  expect(selected).toBeDefined(); return { selected: selected!, diagnostics };
}
