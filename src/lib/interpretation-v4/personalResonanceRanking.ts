import { genericnessPenalty } from "./humanDescription";
import { fusionOrder, fusionUnique as unique } from "./fusionCore";
import type { CandidateGroup, ConflictGroup, PersonalResonanceCandidate } from "./personalResonanceCore";

export const resonanceOverlap = (a: readonly string[], b: readonly string[]) => { const union = new Set([...a, ...b]); return union.size ? new Set(a.filter(x => b.includes(x))).size / union.size : 0; };
export const resonanceUnderlying = (c: PersonalResonanceCandidate) => unique([...c.evidence.myeongliEvidenceIds, ...c.evidence.mbtiSourceNodeIds]);
export const roundEditorial = (n: number) => Math.round(n * 100) / 100;
export function resonanceScore(c: Pick<PersonalResonanceCandidate, "evidenceStrength" | "familyDiversity" | "specificity" | "contradictionValue" | "fusionValue" | "humanRelevance" | "emotionalImpact" | "genericness">, duplicatePenalty = 0, unsupported = false, conflictPenalty = 0) {
  return roundEditorial(Math.max(0, Math.min(100, 25 * c.evidenceStrength + 20 * c.familyDiversity + 15 * c.specificity + 15 * c.contradictionValue +
    10 * c.fusionValue + 10 * c.humanRelevance + 5 * c.emotionalImpact - genericnessPenalty(c.genericness) - duplicatePenalty - conflictPenalty - (unsupported ? 100 : 0))));
}
export const resonanceOrder = (a: PersonalResonanceCandidate, b: PersonalResonanceCandidate) => b.rankingScore - a.rankingScore || b.specificity - a.specificity || b.familyDiversity - a.familyDiversity || fusionOrder(a.id, b.id);

/** All candidates survive editorial dedup. Connected components are diagnostic,
 * not a final chapter allocator or a second independent evidence source. */
export function rankPersonalResonance(input: readonly PersonalResonanceCandidate[]) {
  const candidates = structuredClone([...input]).sort((a, b) => fusionOrder(a.id, b.id));
  const adjacency = new Map(candidates.map(c => [c.id, new Set<string>()]));
  for (let i = 0; i < candidates.length; i++) for (let j = i + 1; j < candidates.length; j++) {
    const a = candidates[i], b = candidates[j];
    const overlap = (a.semanticGroup === b.semanticGroup ? .5 : 0) + .3 * resonanceOverlap(a.primaryAxes, b.primaryAxes) + .2 * resonanceOverlap(resonanceUnderlying(a), resonanceUnderlying(b));
    if (overlap + 1e-9 >= .7) { adjacency.get(a.id)!.add(b.id); adjacency.get(b.id)!.add(a.id); }
  }
  const duplicateGroups: CandidateGroup[] = [], seen = new Set<string>();
  for (const c of candidates) {
    if (seen.has(c.id) || !adjacency.get(c.id)!.size) continue;
    const pending = [c.id], members: string[] = [];
    while (pending.length) { const id = pending.pop()!; if (seen.has(id)) continue; seen.add(id); members.push(id); pending.push(...adjacency.get(id)!); }
    const ids = unique(members), group = { id: `pr-duplicate:${ids.join(":")}`, candidateIds: ids }; duplicateGroups.push(group);
    const rows = candidates.filter(x => ids.includes(x.id)).sort(resonanceOrder);
    rows.forEach((x, index) => { x.duplicateGroupId = group.id; x.relatedCandidateIds = unique([...x.relatedCandidateIds, ...ids.filter(id => id !== x.id)]); x.diagnostics.duplicatePenalty = index ? 8 : 0; });
  }
  const conflictGroups: ConflictGroup[] = [];
  for (const [name, left, right, resolving] of [
    ["DECISION_TIMING", ["PR005", "PR015"], ["PR010", "PR013"], ["PR001"]],
    ["CARE_BOUNDARY", ["PR056"], ["PR055", "PR072"], []],
    ["EXECUTION_ENDURANCE", ["PR014"], ["PR013", "PR015"], []],
  ] as const) {
    const l = candidates.filter(c => (left as readonly string[]).includes(c.ruleId)), r = candidates.filter(c => (right as readonly string[]).includes(c.ruleId));
    if (!l.length || !r.length) continue;
    const resolvedBy = candidates.filter(c => (resolving as readonly string[]).includes(c.ruleId) && c.conditionSplit?.resolved).map(c => c.id);
    const group = { id: `pr-conflict:${name}`, candidateIds: unique([...l, ...r].map(c => c.id)), resolvedBy }; conflictGroups.push(group);
    for (const c of [...l, ...r]) { c.conflictGroupId = group.id; c.relatedCandidateIds = unique([...c.relatedCandidateIds, ...group.candidateIds.filter(id => id !== c.id), ...resolvedBy]);
      if (!resolvedBy.length) { c.diagnostics.unresolvedContradiction = true; c.diagnostics.conflictPenalty = 12; } }
  }
  for (const c of candidates) {
    c.rankingScore = resonanceScore(c, c.diagnostics.duplicatePenalty, c.diagnostics.unsupportedSpecificity, c.diagnostics.conflictPenalty);
    c.rank = c.rankingScore >= 78 && c.diagnostics.independentCount >= 2 && c.genericness <= .3 && !c.diagnostics.amplifierOnly && !c.diagnostics.unresolvedContradiction ? "SIGNATURE"
      : c.rankingScore >= 55 && !c.diagnostics.amplifierOnly ? "MAIN" : "SUPPORT";
  }
  return { candidates: candidates.sort(resonanceOrder), duplicateGroups, conflictGroups };
}
