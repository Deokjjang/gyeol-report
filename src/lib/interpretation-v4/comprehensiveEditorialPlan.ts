import { GYEOL_COMPREHENSIVE_SCHEDULER_VERSION, COMPREHENSIVE_SECTIONS, type ComprehensivePlanInputs, type ComprehensivePlanResult, type ComprehensiveEditorialPlan } from "./comprehensivePlanCore";
import { collectComprehensiveCandidates, editorialUnique } from "./comprehensiveCandidateAdapter";
import { editorialScore } from "./comprehensiveScoring";
import { emptyComprehensiveDiagnostics, inspectComprehensiveInputs, filterEditorialCandidates } from "./comprehensiveDiagnostics";
import { buildEditorialConflictGraph } from "./comprehensiveConflictGraph";
import { reserveComprehensiveMaterials } from "./comprehensiveReservation";
import { allocateComprehensiveMaterials } from "./comprehensiveAllocator";
import { assignEditorialOwnership, buildEditorialThemeBudget, finalizeEditorialSections } from "./comprehensiveEvidenceOwnership";
import { auditComprehensivePlan } from "./comprehensiveQualityAudit";

export const COMPREHENSIVE_EDITORIAL_STEPS = [
  "COLLECT_ALL", "FILTER_INVALID", "DEDUP_UNDERLYING", "SEMANTIC_DUPLICATE_VIEW", "CONFLICT_GRAPH",
  "RESERVE_CORE", "RESERVE_REINFORCE", "RESERVE_TENSION_OR_COMPLEMENT", "RESERVE_FORTUNE", "RESERVE_FACT_BOMB", "RESERVE_TRAIT_ARC",
  "ALLOCATE_C4", "ALLOCATE_C7", "ALLOCATE_C8", "ALLOCATE_C9", "FINALIZE_C1_SUPPORT", "ALLOCATE_C10",
  "EVIDENCE_OWNERSHIP", "THEME_AUDIT", "FUSION_MBTI_AUDIT", "NOVELTY_AUDIT", "CONFLICT_AUDIT", "EMOTIONAL_AUDIT", "C10_NO_NEW_EVIDENCE_AUDIT", "RETURN_PLAN",
] as const;

/** Opt-in, deterministic, candidate-only boundary. Intentionally has no caller
 * in customer generation, versioned packets, or the Book experience. */
export function buildComprehensiveEditorialPlan(input: ComprehensivePlanInputs): ComprehensivePlanResult {
  const before = JSON.stringify(input), diagnostics = emptyComprehensiveDiagnostics();
  diagnostics.hardErrors = inspectComprehensiveInputs(input);
  if (diagnostics.hardErrors.length) return { ok: false, diagnostics };
  const all = collectComprehensiveCandidates(input);
  const filtered = filterEditorialCandidates(all, input);
  const candidates = filtered.eligible.map(c => ({ ...c, evidenceIds: editorialUnique(c.evidenceIds), underlyingEvidenceIds: editorialUnique(c.underlyingEvidenceIds), priorityScore: Math.max(...c.preferredSections.map(s => editorialScore(c, s)), 0) }));
  const graph = buildEditorialConflictGraph(candidates, input);
  const { reservations, kinds } = reserveComprehensiveMaterials(candidates, input.mbti.available);
  for (const c of candidates) { const r = reservations.find(r => r.candidateId === c.id); if (r) c.reservedFor = r.sectionId; }
  const allocated = allocateComprehensiveMaterials(candidates, input, kinds, reservations, graph.edges);
  const ownership = assignEditorialOwnership(allocated.sections, candidates, input);
  const themeBudget = buildEditorialThemeBudget(allocated.sections, candidates);
  const fusionBudget = finalizeEditorialSections(allocated.sections, candidates, input.mbti.available);
  const suppressedCandidates = [...filtered.suppressed, ...allocated.suppressed].filter((r, n, all) => all.findIndex(x => x.candidateId === r.candidateId && x.sectionId === r.sectionId && x.reason === r.reason) === n);
  const auditInput = { candidates, sections: allocated.sections, ...ownership, themeBudget, fusionBudget, suppressedCandidates };
  const audited = auditComprehensivePlan(auditInput, input, graph.edges);
  if (before !== JSON.stringify(input)) audited.diagnostics.hardErrors.push("INPUT_PROFILE_MUTATION");
  if (audited.diagnostics.hardErrors.length) return { ok: false, diagnostics: audited.diagnostics };
  const core = candidates.find(c => c.sourceType === "CORE_GYEOL");
  const positive = COMPREHENSIVE_SECTIONS.flatMap(s => allocated.sections[s].primaryCandidateIds).map(id => candidates.find(c => c.id === id)!).filter(c => c.positiveValence > c.negativeValence && c.sourceType !== "CORE_GYEOL").sort((a, b) => b.priorityScore - a.priorityScore || a.id.localeCompare(b.id))[0];
  const explicitMbtiBudget = { count: fusionBudget.explicitTotal, max: 7 as const, target: [4, 7] as [4, 7], available: input.mbti.available };
  const plan: ComprehensiveEditorialPlan = { version: GYEOL_COMPREHENSIVE_SCHEDULER_VERSION, coreGyeolId: core?.sourceId ?? null, ...auditInput, explicitMbtiBudget,
    emotionalArc: COMPREHENSIVE_SECTIONS.map(s => ({ sectionId: s, intent: allocated.sections[s].emotionalIntent, score: allocated.sections[s].emotionalScore })), reservations,
    finalCoreRecallIntent: { coreGyeolId: core?.sourceId ?? null, primaryTheme: core?.semanticTheme ?? null, strongestPositiveCandidateId: positive?.id ?? null, operatingPrincipleGuidanceId: allocated.sections.C10.guidanceIds[0] ?? null }, ...audited,
    debug: { pipelineSteps: [...COMPREHENSIVE_EDITORIAL_STEPS], duplicateGroups: graph.duplicateGroups, conflictGraph: graph.edges, reservations: structuredClone(reservations), sections: structuredClone(allocated.sections), evidenceOwnership: structuredClone(ownership.evidenceOwnership), themeBudget: structuredClone(themeBudget), fusionBudget: structuredClone(fusionBudget), explicitMbtiBudget, suppressedCandidates: structuredClone(suppressedCandidates), qualityAudit: structuredClone(audited.qualityAudit), diagnostics: structuredClone(audited.diagnostics) } };
  // Optional source metadata uses undefined upstream. Drop only absent object
  // properties at this boundary; preserve every value/ID in a JSON-safe plan.
  return { ok: true, value: JSON.parse(JSON.stringify(plan)) as ComprehensiveEditorialPlan };
}
