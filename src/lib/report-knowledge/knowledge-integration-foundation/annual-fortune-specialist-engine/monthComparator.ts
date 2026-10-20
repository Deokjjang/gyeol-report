import { canonicalJson } from "../sourceReader";
import type { AnnualSegment, ComparisonGraph } from "./types";
export function compareAnnualSegments(segments: readonly AnnualSegment[]): ComparisonGraph {
  const segmentEdges: ComparisonGraph["segmentEdges"] = [];
  for (let i = 1; i < segments.length; i++) {
    const a = segments[i - 1], b = segments[i], x = a.raw, y = b.raw, eq = (u: unknown, v: unknown) => canonicalJson(u) === canonicalJson(v);
    const kinds = [eq(x.monthPillar, y.monthPillar) ? "SAME_MONTH_PILLAR" : "DIFFERENT_MONTH_PILLAR", eq(x.effectiveAnnualPillar, y.effectiveAnnualPillar) ? "SAME_EFFECTIVE_ANNUAL" : "EFFECTIVE_ANNUAL_CHANGED", x.activeDayunContext.status === "transition_uncertain" || y.activeDayunContext.status === "transition_uncertain" ? "DAYUN_UNCERTAIN" : eq(x.activeDayunContext, y.activeDayunContext) ? "SAME_DAYUN" : "DAYUN_CHANGED", x.stemTenGod === y.stemTenGod ? "SAME_STEM_TEN_GOD_ROLE" : "DIFFERENT_STEM_TEN_GOD_ROLE", x.branchTenGod === y.branchTenGod ? "SAME_BRANCH_TEN_GOD_ROLE" : "DIFFERENT_BRANCH_TEN_GOD_ROLE", ...y.boundaryReason.filter(r => r.startsWith("jie:")).map(r => r === "jie:입춘" ? "IPCHUN_BOUNDARY" : "JIE_BOUNDARY"), ...y.boundaryReason.filter(r => r.startsWith("dayun")).map(() => "DAYUN_BOUNDARY"), "COMPARISON_REVIEW_REQUIRED"];
    kinds.push(x.stemTenGod === y.stemTenGod && x.branchTenGod === y.branchTenGod ? "SAME_TEN_GOD_ROLE" : "DIFFERENT_TEN_GOD_ROLE");
    const transit = (s: AnnualSegment) => s.nodes.filter(n => n.fact.observationPointer?.includes("/extendedEvidence/features/"));
    if (transit(b).some(n => n.status === "VERIFIED" && !transit(a).some(p => p.fact.rootId === n.fact.rootId))) kinds.push("NEW_ACCEPTED_TRANSIT");
    if (transit(b).some(n => n.status !== "VERIFIED")) kinds.push("WITHHELD_TRANSIT");
    const changedRoots = b.canonicalFactRoots.filter(r => !a.canonicalFactRoots.includes(r)), repeatedRoots = b.supportingAncestryRoots.filter(r => a.supportingAncestryRoots.includes(r));
    if (eq(x.monthPillar, y.monthPillar) && eq(x.effectiveAnnualPillar, y.effectiveAnnualPillar) && eq(x.activeDayunContext, y.activeDayunContext)) kinds.push("CONTINUITY");
    if (b.nodes.some(n => n.fact.observationPointer?.includes("/relationFacts/") && n.fact.rootId && changedRoots.includes(n.fact.rootId))) kinds.push("NEW_RELATION_ROOT");
    if (a.raw.endKstExclusive !== b.raw.startKst) kinds.push("TEMPORAL_SCOPE_CONFLICT");
    segmentEdges.push({ from: a.originalPointer, to: b.originalPointer, level: a.contract.month === b.contract.month ? "WITHIN_MONTH" : "ADJACENT_MONTH", kinds, changedRoots, repeatedRoots, comparisonApproved: false });
  }
  const roots = new Map<string, string[]>(); for (const s of segments) for (const r of s.supportingAncestryRoots) roots.set(r, [...(roots.get(r) ?? []), s.originalPointer]);
  return { segmentEdges, repeatedRootGroups: [...roots].filter(([, p]) => p.length > 1).map(([root, segmentPointers]) => ({ root, segmentPointers })).sort((a, b) => a.root.localeCompare(b.root, "en")), independentApplicationApprovals: 0 };
}
