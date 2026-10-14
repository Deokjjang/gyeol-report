import { resolveMeaningRelationship } from "../comprehensive-specialist-engine/meaningIdentity";
import type { MajorDiagnostic, MajorConflict, SyntheticMajorOption } from "./types";
export function majorMeaningConflicts(diagnostics: readonly MajorDiagnostic[]): MajorConflict[] {
  const out: MajorConflict[] = [];
  for (let i = 0; i < diagnostics.length; i++) for (let j = i + 1; j < diagnostics.length; j++) {
    const a = diagnostics[i], b = diagnostics[j];
    const view = (d: MajorDiagnostic) => ({ id: d.catalogKey, roots: d.receipt.canonicalFactRoots, claimId: d.receipt.claimIdentity, meaningId: d.receipt.meaningIdentity, question: null, action: null, context: [], conditions: [], reviewed: false, recall: false, actuallyDisplayed: false });
    const relation = resolveMeaningRelationship(view(a), view(b));
    out.push({ left: a.catalogKey, right: b.catalogKey, kind: relation.relation === "SAME_FACT" ? "SAME_DAYUN_ROOT" : "MEANING_REVIEW_REQUIRED", state: "REVIEW_REQUIRED", reasons: relation.reasons, independentInformation: null });
  }
  return out;
}
export function majorSyntheticConflicts(options: readonly SyntheticMajorOption[]): MajorConflict[] {
  const edges: MajorConflict[] = [], kinds: Readonly<Record<string, string>> = { WRONG_CYCLE: "WRONG_CYCLE", WRONG_ANNUAL_YEAR: "DIFFERENT_PERIOD", WRONG_RELATION_SCOPE: "TEMPORAL_SCOPE_CONFLICT", PRE_POST_TRANSITION_CONFLICT: "PRE_POST_TRANSITION_CONFLICT", UNSUPPORTED_COMPOSITE: "UNSUPPORTED_COMPOSITE", MISSING_PARTICIPANT: "MISSING_PARTICIPANT", ACTIVE_CYCLE_UNCERTAIN: "UNKNOWN_TRANSITION", COMPARISON_REQUIRES_TWO_PERIODS: "COMPARISON_REQUIRES_TWO_PERIODS" };
  for (const o of options) for (const reason of o.reasons) if (kinds[reason]) edges.push({ left: o.id, right: o.questionId, kind: kinds[reason], state: "VERIFIED_STRUCTURAL", reasons: [reason], independentInformation: false });
  for (let i = 0; i < options.length; i++) for (let j = i + 1; j < options.length; j++) {
    const a = options[i], b = options[j], shared = a.roots.filter(r => b.roots.includes(r));
    for (const kind of new Set(shared.map(r => r.startsWith("synthetic:major:root:cycle:") ? "SAME_DAYUN_ROOT" : "SAME_ANNUAL_ROOT"))) edges.push({ left: a.id, right: b.id, kind, state: "VERIFIED_STRUCTURAL", reasons: ["SAME_GRAPH_ROOT_NOT_INDEPENDENT_NEW_FACT", "CONTEXT_ROOT_REUSE_IS_DISTINCT_FROM_PRIMARY_INFORMATION"], independentInformation: false });
    if (a.meaning.meaningId === b.meaning.meaningId && ![a, b].some(o => ["RECALL", "CONTINUITY"].includes(o.meaning.function))) edges.push({ left: a.id, right: b.id, kind: "REUSE_WITHOUT_NEW_MEANING", state: "VERIFIED_STRUCTURAL", reasons: ["REGISTERED_SYNTHETIC_APPROVED_MEANING_IDENTITY_EQUAL"], independentInformation: false });
  }
  return edges;
}
