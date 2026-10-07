import { GYEOL_GUIDANCE_ENGINE_VERSION, GYEOL_WORK_MODE_VERSION, type ContextualGuidanceProfile, type GuidanceInputs, type GuidanceResult } from "./guidanceCore";
import { normalizeGuidanceContext, type GuidanceContextInput } from "./guidanceContext";
import { GUIDANCE_PROBLEM_REGISTRY } from "./guidanceProblems";
import { evaluateGuidanceProblem } from "./guidanceEvidence";
import { buildClaimEvidenceView } from "./claimEvidence";
import { selectGuidance } from "./guidanceEvaluator";
import { resolveGuidanceConflicts } from "./guidanceConflictResolver";
import { rankGuidance } from "./guidanceRanking";
import { emptyGuidanceDiagnostics, inspectGuidanceContext, inspectGuidanceInputs, inspectGuidanceRegistry, validateGuidanceCandidates } from "./guidanceDiagnostics";

/** Candidate-only 3C boundary. No calculation, writer, Book, user effects or clock.
 * User context never enters the problem evaluator or upstream profile builders. */
export function buildContextualGuidanceProfile(input: GuidanceInputs, userContext: GuidanceContextInput = {}): GuidanceResult {
  const normalized = normalizeGuidanceContext(userContext);
  const fallback = normalizeGuidanceContext({});
  if (!fallback.ok) return { ok: false, diagnostics: { ...emptyGuidanceDiagnostics({ lifeStatus: "UNKNOWN", relationshipStatus: "UNKNOWN", workModes: [], contextConfidence: 0, provenance: {} }), hardErrors: fallback.errors } };
  const context = normalized.ok ? normalized.value : fallback.value, diagnostics = emptyGuidanceDiagnostics(context);
  diagnostics.hardErrors = [...inspectGuidanceRegistry(), ...inspectGuidanceContext(context), ...(!normalized.ok ? normalized.errors : [])];
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  diagnostics.hardErrors = inspectGuidanceInputs(input);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const view = buildClaimEvidenceView(input.myeongli, input.mbti, input.fusion);
  const problems = GUIDANCE_PROBLEM_REGISTRY.flatMap(d => { const p = evaluateGuidanceProblem(d, input, view); return p ? [p] : []; });
  diagnostics.suppressedLowEvidenceProblems = GUIDANCE_PROBLEM_REGISTRY.filter(d => !problems.some(p => p.id === d.id)).map(d => d.id);
  const advice = problems.flatMap(p => { const a = selectGuidance(p, context, diagnostics); return a ? [a] : []; });
  const conflicts = resolveGuidanceConflicts(advice, input, context);
  const guidanceCandidates = rankGuidance(conflicts.candidates), mergedGuidance = rankGuidance(conflicts.merged);
  const topGuidance = rankGuidance([...guidanceCandidates.filter(c => !c.conflictGroupId), ...mergedGuidance]).slice(0, 10);
  for (const group of conflicts.groups) for (const p of problems.filter(p => group.sourceGuidanceIds.includes(`guidance:${p.id}`))) {
    p.conflictGroupId = group.id; p.relatedProblemIds = problems.filter(x => x.id !== p.id && group.sourceGuidanceIds.includes(`guidance:${x.id}`)).map(x => x.id);
  }
  const byContext: ContextualGuidanceProfile["byContext"] = {}, byProblem: ContextualGuidanceProfile["byProblem"] = {};
  for (const p of problems) {
    const ids = [...guidanceCandidates.filter(g => g.problemId === p.id && !g.conflictGroupId).map(g => g.id), ...mergedGuidance.filter(g => g.mergedFromGuidanceIds?.includes(`guidance:${p.id}`)).map(g => g.id)];
    byProblem[p.problem] = ids;
    for (const ctx of p.contexts) byContext[ctx] = [...new Set([...(byContext[ctx] ?? []), ...ids])].sort();
  }
  diagnostics.problemCount = problems.length; diagnostics.guidanceCount = guidanceCandidates.length; diagnostics.mergedAdviceConflicts = conflicts.groups;
  diagnostics.warnings = [...new Set([
    "RISK_SOURCE_UNAVAILABLE:G30:RESTRICTIVE_SAVING", "RISK_SOURCE_UNAVAILABLE:G32:MONEY_OVER_MEANING",
    ...(diagnostics.unknownJobFallback ? ["UNKNOWN_JOB_GENERAL_FALLBACK"] : []), ...(context.contextConfidence < .6 ? ["LOW_WORK_MODE_CONFIDENCE_GENERAL_WORDING"] : []),
    ...(context.workModes.length > 1 && context.workModes[0].weight === context.workModes[1].weight ? ["MULTIPLE_WORK_MODE_TIE"] : []),
    ...(context.relationshipStatus === "UNKNOWN" ? ["RELATIONSHIP_UNKNOWN"] : []),
    ...guidanceCandidates.filter(c => c.diagnostics.contextVariantId.startsWith("general:")).map(c => `GENERAL_ADVICE_FALLBACK:${c.problemId}`),
    ...problems.filter(p => p.confidence === "MEDIUM").map(p => `ONE_SOURCE_PROBLEM:${p.id}`),
    ...input.resonance.traitArcs.filter(a => !a.shadowDescription).map(a => `ARC_WITHOUT_SHADOW:${a.id}`),
    ...conflicts.groups.map(g => `ADVICE_CONFLICT_MERGED:${g.id}`),
  ])].sort();
  diagnostics.hardErrors = validateGuidanceCandidates([...guidanceCandidates, ...mergedGuidance], input, context);
  diagnostics.forbiddenStrategyAttempts = diagnostics.hardErrors.filter(e => e.startsWith("FORBIDDEN_STRATEGY"));
  diagnostics.genericAdviceRejected = diagnostics.hardErrors.filter(e => e.startsWith("GENERIC_ADVICE"));
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  return { ok: true, value: { version: GYEOL_GUIDANCE_ENGINE_VERSION, workModeVersion: GYEOL_WORK_MODE_VERSION, context, problems, guidanceCandidates, topGuidance, byContext, byProblem,
    conflictGroups: conflicts.groups, mergedGuidance, diagnostics,
    debug: { userContext: structuredClone(context), workModeMatches: structuredClone(context.workModes), problems: structuredClone(problems),
      selectedStrategies: [...guidanceCandidates, ...mergedGuidance].map(g => ({ guidanceId: g.id, strategyIds: [...g.selectedStrategyIds] })),
      guidanceCandidates: structuredClone(guidanceCandidates), topGuidance: structuredClone(topGuidance), suppressedUnsafe: structuredClone(diagnostics.suppressedUnsafeStrategies), conflictMerges: structuredClone(conflicts.groups), diagnostics: structuredClone(diagnostics) } } };
}
