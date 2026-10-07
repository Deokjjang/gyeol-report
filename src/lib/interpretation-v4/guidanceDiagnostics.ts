import { GUIDANCE_PROBLEMS, GUIDANCE_STRATEGIES, LIFE_STATUSES, GUIDANCE_RELATIONSHIP_STATUSES, PRIMARY_WORK_MODES, type GuidanceCandidate, type GuidanceCondition, type GuidanceDiagnostics, type GuidanceInputs, type GuidanceProblemDefinition, type GuidanceStrategy, type GuidanceUserContext } from "./guidanceCore";
import { GUIDANCE_PROBLEM_REGISTRY } from "./guidanceProblems";
import { GUIDANCE_STRATEGY_REGISTRY, strategyApplicability } from "./guidanceStrategies";
import { GUIDANCE_BEHAVIOR_SOURCES } from "./guidanceEvidence";
import { PERSONAL_RESONANCE_REGISTRY } from "./personalResonanceRegistry";
import { buildPersonalResonanceProfile } from "./personalResonanceProfile";
import { stableResonanceValue } from "./personalResonanceDiagnostics";

export function emptyGuidanceDiagnostics(c: GuidanceUserContext): GuidanceDiagnostics {
  return { problemCount: 0, guidanceCount: 0, lifeStatus: c.lifeStatus, workModes: structuredClone(c.workModes), relationshipStatus: c.relationshipStatus,
    unknownJobFallback: c.workModes[0]?.mode === "GENERAL", suppressedLowEvidenceProblems: [], suppressedLowConfidenceAdvice: [], suppressedUnsafeStrategies: [], suppressedContextMismatch: [],
    mergedAdviceConflicts: [], forbiddenStrategyAttempts: [], genericAdviceRejected: [], warnings: [], hardErrors: [] };
}
export function adviceLanguageErrors(text: string): string[] {
  const errors: string[] = [];
  if (!text.trim()) errors.push("EMPTY_ADVICE");
  if (/균형을 맞추|스트레스를 관리|충분히 휴식|소통을 잘|완벽주의를 내려놓|자신을 믿|긍정적으로 생각|강점을 활용|자신의 결을 받아|마음을 편하게/.test(text)) errors.push("GENERIC_ADVICE");
  if (/우울증|ADHD|불안장애|트라우마|정신질환|번아웃|매수|매도|대출|금융상품|주식 종목|코인/.test(text)) errors.push("CLINICAL_OR_FINANCIAL_ADVICE");
  return errors;
}
export function inspectGuidanceRegistry(problems: readonly GuidanceProblemDefinition[] = GUIDANCE_PROBLEM_REGISTRY, strategies: readonly GuidanceStrategy[] = GUIDANCE_STRATEGY_REGISTRY): string[] {
  const errors: string[] = [];
  if (problems.length !== 40 || GUIDANCE_PROBLEMS.some(p => problems.filter(r => r.problem === p).length !== 1)) errors.push("INCOMPLETE_PROBLEM_REGISTRY");
  if (strategies.length !== 25 || GUIDANCE_STRATEGIES.some(s => strategies.filter(r => r.strategy === s).length !== 1)) errors.push("INCOMPLETE_STRATEGY_REGISTRY");
  if (new Set(problems.map(p => p.id)).size !== problems.length || new Set(strategies.map(s => s.id)).size !== strategies.length) errors.push("DUPLICATE_REGISTRY_ID");
  problems.forEach((p, index) => {
    if (p.id !== `G${String(index + 1).padStart(2, "0")}` || !p.candidateStrategies.length || p.candidateStrategies.some(s => !GUIDANCE_STRATEGIES.includes(s))) errors.push(`INVALID_PROBLEM:${p.id}`);
    function check(c: GuidanceCondition) {
      if (c.kind === "resonance" && (!c.ids.length || c.ids.some(id => !PERSONAL_RESONANCE_REGISTRY.some(r => r.id === id)))) errors.push(`INVALID_RESONANCE_REF:${p.id}`);
      if (c.kind === "behavior" && !Object.hasOwn(GUIDANCE_BEHAVIOR_SOURCES, c.key)) errors.push(`INVALID_BEHAVIOR_REF:${p.id}`);
      if (c.kind === "all" || c.kind === "any") { if (!c.conditions.length) errors.push(`EMPTY_CONDITION:${p.id}`); c.conditions.forEach(check); }
    }
    check(p.required); if (p.forbidden) check(p.forbidden);
  });
  strategies.forEach((s, index) => {
    if (s.id !== `GS${String(index + 1).padStart(2, "0")}` || !s.action.trim()) errors.push(`INVALID_STRATEGY:${s.id}`);
    for (const mode of [...PRIMARY_WORK_MODES, "GENERAL" as const]) if (!["PREFERRED", "ALLOWED", "CAUTION", "FORBIDDEN"].includes(s.applicability[mode])) errors.push(`INVALID_MATRIX:${s.id}:${mode}`);
    errors.push(...adviceLanguageErrors(s.generalAdvice).map(e => `${e}:${s.id}`));
  });
  return [...new Set(errors)].sort();
}
export function inspectGuidanceContext(c: GuidanceUserContext): string[] {
  const errors: string[] = [];
  if (!LIFE_STATUSES.includes(c.lifeStatus)) errors.push("INVALID_LIFE_STATUS");
  if (!GUIDANCE_RELATIONSHIP_STATUSES.includes(c.relationshipStatus)) errors.push("INVALID_RELATIONSHIP_STATUS");
  if (!Number.isFinite(c.contextConfidence) || c.contextConfidence < 0 || c.contextConfidence > 1) errors.push("INVALID_CONTEXT_CONFIDENCE");
  if (!c.workModes.length || new Set(c.workModes.map(m => m.mode)).size !== c.workModes.length || Math.abs(c.workModes.reduce((n, m) => n + m.weight, 0) - 1) > .000001) errors.push("INVALID_MODE_WEIGHTS");
  for (const m of c.workModes) if (![...PRIMARY_WORK_MODES, "GENERAL"].includes(m.mode) || !Number.isFinite(m.weight) || m.weight <= 0 || !Number.isFinite(m.confidence) || m.confidence < 0 || m.confidence > 1) errors.push("INVALID_WORK_MODE");
  return errors;
}
export function inspectGuidanceInputs(i: GuidanceInputs): string[] {
  const verified = buildPersonalResonanceProfile(i.myeongli, i.mbti, i.fusion, i.claims);
  if (!verified.ok) return verified.diagnostics.hardErrors.map(e => `UPSTREAM:${e.code}`);
  // Validates shadows and core as well as PRs; forged derived profiles must not
  // create actionable problems. This does not change any upstream object.
  return stableResonanceValue(verified.value) === stableResonanceValue(i.resonance) ? [] : ["STALE_OR_FORGED_PERSONAL_RESONANCE"];
}
export function validateGuidanceCandidates(rows: readonly GuidanceCandidate[], i: GuidanceInputs, c: GuidanceUserContext): string[] {
  const errors: string[] = [], evidence = new Set([...i.myeongli.evidence.map(e => e.id), ...i.mbti.sourceNodes.filter(n => n.classification === "SCORING_SEMANTIC").map(n => n.id)]);
  const fusion = [...i.fusion.reinforce, ...i.fusion.tensions, ...i.fusion.complements];
  for (const r of rows) {
    if (r.confidence === "LOW") errors.push(`LOW_CONFIDENCE_ADVICE:${r.id}`);
    if (!r.selectedStrategyIds.length || r.selectedStrategyIds.length > 2 || r.selectedStrategyIds.some(s => !GUIDANCE_STRATEGIES.includes(s))) errors.push(`INVALID_STRATEGIES:${r.id}`);
    else if (r.selectedStrategyIds.some(s => strategyApplicability(s, c.workModes) === "FORBIDDEN")) errors.push(`FORBIDDEN_STRATEGY:${r.id}`);
    if (r.sourceResonanceIds.some(id => !i.resonance.candidates.some(x => x.id === id)) || r.sourceTraitArcIds.some(id => !i.resonance.traitArcs.some(x => x.id === id)) ||
      r.sourceClaimIds.some(id => !i.claims.candidates.some(x => x.id === id)) || r.sourceFusionIds.some(id => !fusion.some(x => x.id === id)) || r.evidenceIds.some(id => !evidence.has(id))) errors.push(`MISSING_SOURCE_REF:${r.id}`);
    if (!r.evidenceIds.length || !r.diagnostics.action) errors.push(`MISSING_PROOF_OR_ACTION:${r.id}`);
    errors.push(...adviceLanguageErrors(r.customerAdvice).map(e => `${e}:${r.id}`));
  }
  return [...new Set(errors)].sort();
}
