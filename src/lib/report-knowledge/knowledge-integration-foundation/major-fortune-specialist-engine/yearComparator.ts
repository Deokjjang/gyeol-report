import { canonicalJson } from "../sourceReader";
import type { MajorYearContext, YearComparisonGraph, YearComparisonEdge } from "./types";
const signature = (y: MajorYearContext) => y.relations.filter(r => r.state === "VERIFIED_YEAR_OBSERVATION").map(r => canonicalJson([r.scope, r.relationType, r.participants])).sort();
export function compareMajorYears(years: readonly MajorYearContext[]): YearComparisonGraph {
  const edges: YearComparisonEdge[] = [];
  for (let i = 0; i < years.length; i++) for (let j = i + 1; j < years.length; j++) {
    const a = years[i], b = years[j], ar = signature(a), br = signature(b);
    const add = (kind: string, roots: string[] = [], evidenceIds: string[] = [], reason = "STRUCTURAL_OBSERVATION_NOT_APPROVED_APPLICATION") => edges.push({ from: a.calendarYear, to: b.calendarYear, kind, roots, evidenceIds, independentApplication: false, reason });
    if (a.cycle && b.cycle) add(a.cycle.cycleIndex === b.cycle.cycleIndex ? "SAME_CYCLE" : "DIFFERENT_CYCLE");
    else add("COMPARISON_REVIEW_REQUIRED", [], [], "MISSING_CYCLE_IS_NOT_ZERO_OR_CONTINUITY");
    add(a.annualTenGod === b.annualTenGod ? "SAME_TEN_GOD" : "DIFFERENT_TEN_GOD");
    const commonDayun = a.cycle?.canonicalFactRoots.filter(r => b.cycle?.canonicalFactRoots.includes(r)) ?? [], commonNatal = a.natalRoots.filter(r => b.natalRoots.includes(r));
    if (commonDayun.length) add("SHARED_DAYUN_ROOT", commonDayun);
    if (commonNatal.length) add("SHARED_NATAL_ROOT", commonNatal);
    const newAnnual = b.annualRoots.filter(r => !a.annualRoots.includes(r));
    if (newAnnual.length) add("NEW_ANNUAL_ROOT", newAnnual, [...b.annualEvidenceIds]);
    if (br.some(r => !ar.includes(r))) add("RELATION_ADDED", [], b.relations.filter(r => !ar.includes(canonicalJson([r.scope, r.relationType, r.participants]))).flatMap(r => r.originalEvidenceId ? [r.originalEvidenceId] : []));
    if (ar.some(r => !br.includes(r))) add("RELATION_REMOVED", [], a.relations.filter(r => !br.includes(canonicalJson([r.scope, r.relationType, r.participants]))).flatMap(r => r.originalEvidenceId ? [r.originalEvidenceId] : []));
    if (a.transition || b.transition) add("TRANSITION_BOUNDARY", [], [...a.reasonIds, ...b.reasonIds]);
    add("COMPARISON_SUPPORTED", [], [...a.annualEvidenceIds, ...b.annualEvidenceIds], "TWO_ORIGINAL_YEAR_OBSERVATIONS_ONLY_NOT_EVENT_CHANGE");
    add("COMPARISON_REVIEW_REQUIRED", [], [], "MEANING_AND_NEW_APPLICATION_APPROVAL_PENDING");
    if (commonDayun.length) { add("REUSE_WITH_NEW_QUESTION", commonDayun, [], "POSSIBLE_CONTINUITY_FUNCTION_NOT_INDEPENDENT_DAYUN_FACT"); add("NOT_INDEPENDENT_INFORMATION", commonDayun); }
    if (a.missing.length || b.missing.length) add("COMPARISON_REVIEW_REQUIRED", [], [], "EXACT_TIME_APPLICATION_WITHHELD_YEAR_COMPARISON_PRESERVED");
  }
  return { years: [...years], edges, independentAnnualRoots: new Set(years.flatMap(y => y.annualRoots)).size, distinctCycleRoots: new Set(years.flatMap(y => y.cycle?.canonicalFactRoots ?? [])).size, applicationApprovals: 0, pairComparisons: years.length * (years.length - 1) / 2 };
}
