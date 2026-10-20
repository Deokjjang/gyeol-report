import { canonicalJson } from "../sourceReader";
import { annualSegmentAt } from "../../../report-knowledge/annualMonthExtendedEvidence";
import { getAnnualJieBoundaries } from "../../../report-knowledge/annualMonthJie";
import type { CustomerDayun } from "../../../saju/customerDayun";
import type { AnnualCalendarMonth, AnnualMonthSegment } from "../../../report-knowledge/annualMonthJie";
import type { AnnualSegment, BoundaryRow } from "./types";
const stamp = (s: AnnualMonthSegment | undefined) => s ? { month: s.monthPillar, annual: s.effectiveAnnualPillar, dayun: s.activeDayunContext, stemTenGod: s.stemTenGod, branchTenGod: s.branchTenGod, relationIds: s.relationFacts.map(f => f.id), evidenceIds: s.evidenceIds } : null;
export function auditBoundaries(segments: readonly AnnualSegment[]): BoundaryRow[] {
  return segments.filter(s => s.raw.boundaryReason.some(b => b.startsWith("jie:") || b.startsWith("dayun"))).map(s => {
    const t = Date.parse(s.raw.startKst), before = segments.find(p => Date.parse(p.raw.startKst) <= t - 1000 && t - 1000 < Date.parse(p.raw.endKstExclusive)), after = segments.find(p => Date.parse(p.raw.startKst) <= t + 1000 && t + 1000 < Date.parse(p.raw.endKstExclusive));
    const same = (a: unknown, b: unknown) => canonicalJson(a) === canonicalJson(b);
    return { instant: s.raw.startKst, month: s.contract.month, reason: s.raw.boundaryReason, beforePointer: before?.originalPointer ?? null, afterPointer: s.originalPointer, monthChanged: !same(before?.raw.monthPillar, s.raw.monthPillar), annualChanged: !same(before?.raw.effectiveAnnualPillar, s.raw.effectiveAnnualPillar), dayunChanged: !same(before?.raw.activeDayunContext, s.raw.activeDayunContext), before: stamp(before?.raw), at: stamp(s.raw), after: stamp(after?.raw), state: before && after ? "VERIFIED" : "REVIEW_REQUIRED" };
  });
}
export function validateDayunContext(basis: CustomerDayun, s: AnnualMonthSegment): string[] {
  const t = Date.parse(s.startKst), candidates = basis.cycles.filter(c => Date.parse(c.startSolarRange.earliestKst) <= t), uncertain = candidates.find(c => t < Date.parse(c.startSolarRange.latestKst)), prior = uncertain ? basis.cycles.find(c => c.index === uncertain.index - 1) : candidates.at(-1);
  const context = s.activeDayunContext;
  const expected = uncertain ? [prior, uncertain].filter(c => c !== undefined).map(c => ({ index: c.index, ganji: c.ganji })) : prior ? [{ index: prior.index, ganji: prior.ganji }] : [];
  return [...(canonicalJson(expected) !== canonicalJson(context.cycles) ? ["WRONG_ACTIVE_DAYUN"] : []), ...(context.status !== (uncertain ? "transition_uncertain" : prior ? "active" : "before_first_cycle") ? ["WRONG_DAYUN_STATE"] : []), ...(uncertain && canonicalJson(context.transitionRange) !== canonicalJson(uncertain.startSolarRange) ? ["WRONG_TRANSITION_RANGE"] : [])];
}
export function validateJieCalendar(months: readonly AnnualCalendarMonth[], year: number) {
  return getAnnualJieBoundaries(year).map(j => {
    const t = Date.parse(j.instantKst), before = annualSegmentAt(months, new Date(t - 1000).toISOString()), at = annualSegmentAt(months, j.instantKst), after = annualSegmentAt(months, new Date(t + 1000).toISOString());
    return { ...j, before: stamp(before), at: stamp(at), after: stamp(after), valid: !!before && !!at && !!after && canonicalJson(before.monthPillar) === canonicalJson(j.beforeMonth) && canonicalJson(at.monthPillar) === canonicalJson(j.afterMonth) && canonicalJson(before.effectiveAnnualPillar) === canonicalJson(j.beforeYear) && canonicalJson(at.effectiveAnnualPillar) === canonicalJson(j.afterYear) && canonicalJson(at) === canonicalJson(after) };
  });
}
