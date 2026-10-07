import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import { inspectIntegratedSources } from "./foundationDiagnostics";
import { BIPOLAR_AXES } from "./semanticCore";
import { FUSION_CONDITION_SPLITS, FUSION_TYPES, fusionUnique, fusionOrder,
  type FusionCandidate, type FusionDiagnostics, type FusionIssue, type FusionDebugCandidate } from "./fusionCore";
import { FUSION_COMPLEMENT_RULES, type FusionCompositeRule } from "./fusionComplementRegistry";
import { validFusionAxis, validFusionContexts } from "./fusionProfileAdapter";

export const stableFusionIssues = (rows: readonly FusionIssue[]) => [...new Map(rows.map(r => {
  const row = { ...r, refs: fusionUnique(r.refs) }; return [`${row.code}:${row.refs.join("|")}:${row.detail ?? ""}`, row];
})).entries()].sort(([a], [b]) => fusionOrder(a, b)).map(([, r]) => r);
export function emptyFusionDiagnostics(): FusionDiagnostics {
  return { reinforceCount: 0, tensionCount: 0, complementCount: 0, signatureCount: 0, mainCount: 0, supportCount: 0,
    priorOnlySuppressed: [], priorHeavyCandidates: [], amplifierOnlyLimited: [], unresolvedTensions: [], contextRejected: [],
    duplicateGroups: [], bridgeHintIgnored: true, warnings: [], hardErrors: [] };
}
export function inspectFusionRegistry(rules: readonly FusionCompositeRule[]): FusionIssue[] {
  const errors: FusionIssue[] = [], ids = new Set<string>();
  for (const r of rules) {
    if (ids.has(r.id)) errors.push({ code: "DUPLICATE_REGISTRY_ID", refs: [r.id] }); ids.add(r.id);
    if (!validFusionContexts(r.contexts)) errors.push({ code: "INVALID_CONTEXT", refs: [r.id] });
    for (const a of [r.axisA, r.axisB]) if (!validFusionAxis(a.axis) || ![1, -1].includes(a.direction) || (a.direction < 0 && !(BIPOLAR_AXES as readonly string[]).includes(a.axis))) errors.push({ code: "INVALID_AXIS_REQUIREMENT", refs: [r.id, a.axis] });
    if (r.axisA.axis === r.axisB.axis || !r.sourceDescription || !Number.isFinite(r.priority)) errors.push({ code: "INVALID_COMPLEMENT_RULE", refs: [r.id] });
  }
  if (rules.length !== 96 || Array.from({ length: 96 }, (_, i) => `C${String(i + 1).padStart(3, "0")}`).some(id => !ids.has(id))) errors.push({ code: "INCOMPLETE_COMPLEMENT_REGISTRY", refs: [] });
  return stableFusionIssues(errors);
}

export function inspectFusionMyeongliSource(m: MyeongliSemanticProfile): FusionIssue[] {
  const inspected = inspectIntegratedSources(m.evidence, m.synthesisCandidates);
  return [...inspected.hardErrors, ...inspected.suppressedEvidence].map(e => ({ code: e.code, refs: e.evidenceIds, ...(e.detail ? { detail: e.detail } : {}) }));
}

/** Publicly testable internal invariant gate. Invalid output is never returned
 * as a successful profile, including injected registry/candidate references. */
export function validateFusionCandidates(candidates: readonly FusionCandidate[], m: MyeongliSemanticProfile, b: MbtiSemanticProfile): FusionIssue[] {
  const errors: FusionIssue[] = [], ids = new Set<string>(), mIds = new Set(m.evidence.map(e => e.id));
  const nodes = new Map(b.sourceNodes.map(n => [n.id, n])), annotations = new Set(b.annotations.filter(a => a.sourceType !== "reference_only").map(a => a.id));
  const fail = (code: string, c: FusionCandidate) => errors.push({ code, refs: [c.id] });
  for (const c of candidates) {
    if (ids.has(c.id)) fail("DUPLICATE_FUSION_ID", c); ids.add(c.id);
    if (!(FUSION_TYPES as readonly string[]).includes(c.type)) fail("INVALID_FUSION_TYPE", c);
    if (c.primaryAxes.some(a => !validFusionAxis(a))) fail("INVALID_AXIS", c);
    if (!validFusionContexts(c.contexts) || !validFusionContexts([c.primaryContext]) || !c.contexts.includes(c.primaryContext)) fail("INVALID_CONTEXT", c);
    if (!c.myeongli.evidenceIds.length || c.myeongli.evidenceIds.some(id => !mIds.has(id))) fail("MISSING_MYEONGLI_EVIDENCE", c);
    if (!c.mbti.sourceNodeIds.length || c.mbti.sourceNodeIds.some(id => nodes.get(id)?.classification !== "SCORING_SEMANTIC") ||
      !c.mbti.actualSourceEvidenceIds.length || c.mbti.actualSourceEvidenceIds.some(id => !annotations.has(id))) fail("NON_SCORING_MBTI_SOURCE", c);
    if (c.conditionSplit) {
      const s = c.conditionSplit;
      if ((s.resolved && (!s.type || !(FUSION_CONDITION_SPLITS as readonly string[]).includes(s.type))) || (!s.resolved && c.strength !== "SUPPORT")) fail("INVALID_CONDITION_SPLIT", c);
      if (s.myeongliEvidenceIds.some(id => !mIds.has(id)) || s.mbtiSourceNodeIds.some(id => nodes.get(id)?.classification !== "SCORING_SEMANTIC")) fail("MISSING_SPLIT_EVIDENCE", c);
    }
    if (c.type === "TENSION" && (!c.conditionSplit || c.myeongli.side.axis !== c.mbti.side.axis || c.myeongli.side.direction === c.mbti.side.direction || !(BIPOLAR_AXES as readonly string[]).includes(c.myeongli.side.axis))) fail("INVALID_TENSION", c);
    if (c.type === "REINFORCE" && (c.myeongli.side.axis !== c.mbti.side.axis || c.myeongli.side.direction !== c.mbti.side.direction)) fail("INVALID_REINFORCE", c);
    if (c.type === "COMPLEMENT") {
      const rule = FUSION_COMPLEMENT_RULES.find(r => r.id === c.ruleId);
      const match = (a: FusionCompositeRule["axisA"], s: FusionCandidate["myeongli"]["side"]) => a.axis === s.axis && a.direction === s.direction;
      if (!rule || !rule.contexts.includes(c.primaryContext) || !((match(rule.axisA, c.myeongli.side) && match(rule.axisB, c.mbti.side)) || (match(rule.axisB, c.myeongli.side) && match(rule.axisA, c.mbti.side)))) fail("UNREGISTERED_COMPLEMENT_PAIR", c);
    }
    if (c.amplifierOnly && c.strength !== "SUPPORT") fail("AMPLIFIER_CAP_VIOLATION", c);
    if (c.priorHeavy && c.strength === "SIGNATURE") fail("PRIOR_CAP_VIOLATION", c);
    if (!Number.isFinite(c.rankingScore) || !Number.isFinite(c.contextFit) || c.contextFit <= 0) fail("INVALID_FUSION_RANKING", c);
  }
  return stableFusionIssues(errors);
}

export function completeFusionDiagnostics(base: FusionDiagnostics, candidates: readonly FusionCandidate[]): FusionDiagnostics {
  const ids = (fn: (c: FusionCandidate) => boolean) => fusionUnique(candidates.filter(fn).map(c => c.id));
  const warnings = candidates.flatMap(c => [
    ...(c.priorHeavy ? ["PRIOR_HEAVY"] : []), ...(c.amplifierOnly ? ["AMPLIFIER_ONLY"] : []),
    ...(c.type === "TENSION" && !c.conditionSplit?.resolved ? ["UNRESOLVED_TENSION"] : []),
    ...(c.mbti.sourceDomains.length === 1 ? ["ONE_MBTI_DOMAIN"] : []), ...(c.contextFit < .85 ? ["LOW_CONTEXT_FIT"] : []),
    ...(c.duplicateGroupId ? ["NEAR_DUPLICATE"] : []), ...(c.myeongli.side.proofs.some(p => p.confidence === undefined) ? ["SOURCE_CONFIDENCE_UNAVAILABLE"] : []),
  ].map(code => ({ code, refs: [c.id] })));
  return { ...base, reinforceCount: ids(c => c.type === "REINFORCE").length, tensionCount: ids(c => c.type === "TENSION").length, complementCount: ids(c => c.type === "COMPLEMENT").length,
    signatureCount: ids(c => c.strength === "SIGNATURE").length, mainCount: ids(c => c.strength === "MAIN").length, supportCount: ids(c => c.strength === "SUPPORT").length,
    priorHeavyCandidates: ids(c => c.priorHeavy), amplifierOnlyLimited: ids(c => c.amplifierOnly), unresolvedTensions: ids(c => c.type === "TENSION" && !c.conditionSplit?.resolved),
    priorOnlySuppressed: stableFusionIssues(base.priorOnlySuppressed), contextRejected: stableFusionIssues(base.contextRejected), warnings: stableFusionIssues([...base.warnings, ...warnings]), hardErrors: stableFusionIssues(base.hardErrors) };
}
export function fusionDebugCandidates(candidates: readonly FusionCandidate[]): FusionDebugCandidate[] {
  return structuredClone(candidates.slice(0, 12).map(c => ({ id: c.id, type: c.type, strength: c.strength, primaryAxes: c.primaryAxes,
    sourceDescription: c.sourceDescription, myeongli: c.myeongli, mbti: c.mbti, contextFit: c.contextFit, evidenceDiversity: c.evidenceDiversity,
    rankingScore: c.rankingScore, ...(c.conditionSplit ? { conditionSplit: c.conditionSplit } : {}) })));
}
