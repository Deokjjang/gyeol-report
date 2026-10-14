import { selectCustomerDayun, type CustomerDayun } from "../../../saju/customerDayun";
import type { MajorCycleIdentity, MajorYearContext } from "./types";
export function validateActiveCycle(basis: CustomerDayun, at: string, targetYear: number) {
  const instant = Date.parse(at);
  if (!Number.isFinite(instant)) return { state: "UNSUPPORTED_CALCULATION", activeCycle: null, selectedCycle: null, originalError: "INVALID_OBSERVATION_INSTANT", evaluatedAt: at, transition: null };
  const selected = selectCustomerDayun(basis, targetYear, new Date(instant));
  const range = basis.cycles.find(c => !c.startSolarKst && instant >= Date.parse(c.startSolarRange.earliestKst) && instant < Date.parse(c.startSolarRange.latestKst));
  const beforeFirst = !!basis.cycles[0] && instant < Date.parse(basis.cycles[0].startSolarRange.earliestKst);
  return { state: beforeFirst ? "BEFORE_FIRST_DAYUN" : range ? "ACTIVE_CYCLE_UNCERTAIN" : !selected.ok ? "TARGET_CYCLE_UNAVAILABLE" : selected.value.activeCycleAtEvaluation === null ? "CURRENT_DAYUN_UNCERTAIN" : "CONFIRMED", activeCycle: selected.ok ? selected.value.activeCycleAtEvaluation : null, selectedCycle: selected.ok ? selected.value.selectedCycle.index : null, originalError: selected.ok ? null : selected.error, evaluatedAt: at, transition: selected.ok ? selected.value.transition : null };
}
export function validateYearCycleScope(year: MajorYearContext, basis: CustomerDayun, at: string) {
  const active = validateActiveCycle(basis, at, year.calendarYear), reasons = year.cycle ? cycleInstantEligibility(year.cycle, active, year.cycle.cycleIndex) : ["TARGET_CYCLE_UNAVAILABLE"];
  return { calendarYear: year.calendarYear, evaluatedAt: at, selectedCycle: active.selectedCycle, instantActiveCycle: active.activeCycle, rowCycle: year.cycle?.cycleIndex ?? null, cycleScopeAllowed: reasons.length === 0, reasons, relationPacketPresent: year.relations.some(r => r.scope === "dayun_saeun"), annualEvidencePrecision: year.certainty, grantsExactAnnualEvidence: false };
}
export function transitionBoundaryAudit(basis: CustomerDayun, year: number) {
  const cycle = basis.cycles.find(c => c.startYear === year);
  if (!cycle) return { year, state: "NO_TRANSITION_IN_THIS_YEAR", observations: [], boundary: null };
  const { earliestKst, latestKst } = cycle.startSolarRange, exact = cycle.startSolarKst;
  const points = exact ? [Date.parse(exact) - 1, Date.parse(exact), Date.parse(exact) + 1] : [Date.parse(earliestKst) - 1, Date.parse(earliestKst), Date.parse(earliestKst) + 1, Date.parse(latestKst) - 1, Date.parse(latestKst), Date.parse(latestKst) + 1];
  const observations = points.map(ms => validateActiveCycle(basis, new Date(ms).toISOString(), year));
  const previous = basis.cycles.find(c => c.index === cycle.index - 1)?.index ?? null;
  const expected = exact ? [previous, cycle.index, cycle.index] : [previous, null, null, null, cycle.index, cycle.index];
  return { year, state: observations.every((r, i) => r.activeCycle === expected[i]) ? "PASS" : "FAIL", observations, boundary: { exact, earliestKst, latestKst, beforeIndex: previous, afterIndex: cycle.index }, midpointUsed: false, originalCalculationVersion: basis.calculationVersion };
}
/** This validates a supplied producer interval. It does not add interval nodes
 * to the Graph or turn calendar-year observations into instant evidence. */
export function cycleInstantEligibility(cycle: MajorCycleIdentity, active: ReturnType<typeof validateActiveCycle>, requiredCycle: number) {
  if (active.state === "ACTIVE_CYCLE_UNCERTAIN") return ["ACTIVE_CYCLE_UNCERTAIN"];
  if (active.state !== "CONFIRMED") return [active.state];
  if (active.activeCycle !== requiredCycle || cycle.cycleIndex !== requiredCycle) return ["WRONG_CYCLE", "PRE_POST_TRANSITION_CONFLICT"];
  return [];
}
