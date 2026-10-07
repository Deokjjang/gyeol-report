import { BIPOLAR_AXES } from "./semanticCore";
import { editorialOverlap } from "./comprehensiveScoring";
import { editorialUnique } from "./comprehensiveCandidateAdapter";
import type { ComprehensivePlanInputs, EditorialCandidate, EditorialConflictEdge } from "./comprehensivePlanCore";

export function buildEditorialConflictGraph(rows: readonly EditorialCandidate[], input: ComprehensivePlanInputs) {
  const edges: EditorialConflictEdge[] = [];
  const splits = rows.filter(c => c.conditionSplit?.resolved && c.rank !== "SUPPORT");
  const sourceGroups = [...input.resonance.conflictGroups.map(g => ({ ids: g.candidateIds, resolved: g.resolvedBy })), ...input.claims.diagnostics.conflictGroups.map(g => ({ ids: g.claimIds, resolved: g.fusionIds }))];
  function sign(c: EditorialCandidate, axis: typeof BIPOLAR_AXES[number]) {
    if (!c.primaryAxes.includes(axis) || c.conditionSplit?.resolved || c.internalComplexity || c.sourceType === "CORE_GYEOL" || c.sourceType === "GUIDANCE") return 0;
    const values = [...input.myeongli.evidence.filter(e => c.myeongliEvidenceIds.includes(e.id)).map(e => e.axes[axis] ?? 0), ...input.mbti.annotations.filter(a => c.mbtiSourceNodeIds.includes(a.sourceNodeId)).map(a => a.axes[axis] ?? 0)].filter(Boolean);
    return values.length && values.every(v => v > 0) ? 1 : values.length && values.every(v => v < 0) ? -1 : 0;
  }
  const signs = new Map(rows.map(c => [c.id, BIPOLAR_AXES.map(a => sign(c, a))]));
  for (let x = 0; x < rows.length; x++) for (let y = x + 1; y < rows.length; y++) {
    const a = rows[x], b = rows[y];
    const add = (kind: EditorialConflictEdge["kind"], resolvedBy: string[] = []) => edges.push({ left: a.id, right: b.id, kind, resolvedBy });
    // Money-opportunity scatter and general opportunity scatter can have
    // different broad themes but describe the same existing 3C problem.
    // Reuse those exact source links, never infer similarity from customer text.
    const sameShadowProblem = a.factBomb && b.factBomb && input.guidance.problems.some(p => p.evidenceStrength !== "SUPPORT"
      && (a.claimIds.some(id => p.sourceClaimIds.includes(id)) || a.resonanceIds.some(id => p.sourceResonanceIds.includes(id)))
      && (b.claimIds.some(id => p.sourceClaimIds.includes(id)) || b.resonanceIds.some(id => p.sourceResonanceIds.includes(id))));
    if (editorialOverlap(a, b) >= .7 - 1e-9 || a.duplicateGroupId && a.duplicateGroupId === b.duplicateGroupId || sameShadowProblem) add("SEMANTIC_DUPLICATE");
    if (a.traitArcIds.some(id => b.traitArcIds.includes(id))) add("TRAIT_ARC_PAIR");
    if (a.fortune && b.fortune && a.fortuneFamilies.some(f => b.fortuneFamilies.includes(f))) add("FORTUNE_OVERLAP");
    if (a.sourceType === "GUIDANCE" && b.sourceType === "GUIDANCE" && (a.problemId === b.problemId || a.strategyIds?.some(id => b.strategyIds?.includes(id)))) add("GUIDANCE_OVERLAP");
    const group = sourceGroups.find(g => g.ids.includes(a.sourceId) && g.ids.includes(b.sourceId));
    const f05f06 = [a.sourceId, b.sourceId].includes("F05_OVERTHINKING") && [a.sourceId, b.sourceId].includes("F06_TOO_FAST");
    const opposite = a.contexts.some(ctx => b.contexts.includes(ctx)) && BIPOLAR_AXES.some((_, n) => signs.get(a.id)![n] * signs.get(b.id)![n] === -1);
    if (group || f05f06 || opposite) {
      const resolvedBy = splits.filter(c => group?.resolved.includes(c.sourceId) || f05f06 && c.conditionSplit?.type === "BEFORE_AFTER_DECISION" || c.underlyingEvidenceIds.some(id => a.underlyingEvidenceIds.includes(id)) && c.underlyingEvidenceIds.some(id => b.underlyingEvidenceIds.includes(id)) && c.primaryAxes.some(axis => a.primaryAxes.includes(axis) && b.primaryAxes.includes(axis))).map(c => c.id);
      add(resolvedBy.length ? "TENSION_RESOLVED" : "CONTRADICTORY", resolvedBy);
    }
  }
  // Connected groups are a debug view; allocation checks actual pair edges to
  // avoid turning A≈B≈C into a false claim that A and C mean the same thing.
  const duplicateGroups: { id: string; candidateIds: string[] }[] = [], seen = new Set<string>();
  const adjacency = new Map<string, string[]>();
  for (const e of edges.filter(e => e.kind === "SEMANTIC_DUPLICATE")) { adjacency.set(e.left, [...(adjacency.get(e.left) ?? []), e.right]); adjacency.set(e.right, [...(adjacency.get(e.right) ?? []), e.left]); }
  for (const id of [...adjacency.keys()].sort()) {
    if (seen.has(id)) continue;
    const pending = [id], members: string[] = [];
    while (pending.length) { const next = pending.pop()!; if (seen.has(next)) continue; seen.add(next); members.push(next); pending.push(...(adjacency.get(next) ?? [])); }
    duplicateGroups.push({ id: `editorial-duplicate:${duplicateGroups.length + 1}`, candidateIds: editorialUnique(members) });
  }
  return { edges, duplicateGroups };
}
