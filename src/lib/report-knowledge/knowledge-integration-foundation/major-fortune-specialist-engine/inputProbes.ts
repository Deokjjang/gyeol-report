import { readFileSync } from "node:fs";
import { majorNarrativeEvidence } from "../../../interpretation-v4/majorEvidence";
import { calculateCustomerDayun, type CustomerDayunInput } from "../../../saju/customerDayun";
import { getAnnualFortuneCurrentYear } from "../../annualFortuneYearRules";
import { normalizeReportInputPayload } from "../../../report-generation/reportInputAdapter";
import { composeMajorFortuneNarrative } from "../../../interpretation-v4/majorComposer";
import { observeMajorPeriods } from "./temporalEvidence";
import { compareMajorYears } from "./yearComparator";
import { transitionBoundaryAudit, validateActiveCycle, validateYearCycleScope } from "./transitionValidator";
export function publicMajorObservation(o: ReturnType<typeof observeMajorPeriods>) {
  const { originalDayun, ...body } = o;
  return { ...body, producerContract: { calculationVersion: originalDayun.calculationVersion, calendarVersion: originalDayun.calendarVersion, libraryVersion: originalDayun.libraryVersion, yunSect: originalDayun.yunSect, direction: originalDayun.direction, precision: originalDayun.precision, stable: originalDayun.stable, fullCycleCount: originalDayun.cycles.length }, actualInputPersonalDataOmitted: true };
}
export async function observeMajorInput(payload: unknown, evaluatedAt: string) {
  const normalized = normalizeReportInputPayload(payload), instant = Date.parse(evaluatedAt);
  if (!normalized.ok || normalized.value.kind !== "majorFortune" || !Number.isFinite(instant)) return { status: "WITHHELD" as const, originalErrors: ["V4_MAJOR_INPUT_AND_EXPLICIT_INSTANT_REQUIRED"], observation: null, customerEligible: 0, syntheticCycleCreated: false };
  const basis = calculateCustomerDayun(normalized.value.person);
  if (!basis.ok) return { status: "WITHHELD" as const, originalErrors: [basis.error], observation: null, customerEligible: 0, syntheticCycleCreated: false };
  const selection = validateActiveCycle(basis.value, evaluatedAt, getAnnualFortuneCurrentYear(new Date(instant)));
  if (selection.originalError) return { status: "WITHHELD" as const, originalErrors: [selection.originalError], observation: null, selection, customerEligible: 0, syntheticCycleCreated: false };
  const e = await majorNarrativeEvidence(payload, evaluatedAt);
  if (!e.ok) return { status: "WITHHELD" as const, originalErrors: [...e.errors], observation: null, selection, customerEligible: 0, syntheticCycleCreated: false };
  const observation = publicMajorObservation(observeMajorPeriods(e, normalized.value.person));
  if (!e.horizon.activeCycle) {
    const original = await composeMajorFortuneNarrative(payload, evaluatedAt);
    return { status: "WITHHELD" as const, originalErrors: original.ok ? [] : [...original.errors], observation, selection, independentYearObservationsPreserved: observation.years.length, customerEligible: 0, syntheticCycleCreated: false };
  }
  return { status: "OBSERVED_APPROVAL_PENDING" as const, originalErrors: [], observation, selection, customerEligible: 0, syntheticCycleCreated: false };
}
export async function runMajorInputProbes(root: string) {
  const input = JSON.parse(readFileSync(root + "/docs/validation/v4-major-fortune-product-knowledge-01/input-cases.json", "utf8")) as { clock: string; cases: { id: string; payload: unknown }[]; boundaryInputs: CustomerDayunInput[] };
  const observations = [], boundaries = [], errors = [], forbidden: string[] = [];
  for (const [i, c] of input.cases.entries()) {
    const normalized = normalizeReportInputPayload(c.payload);
    if (!normalized.ok || normalized.value.kind !== "majorFortune") throw Error("ORIGINAL_A_F_INPUT_CONTRACT_REQUIRED");
    const person = normalized.value.person; forbidden.push(person.name, person.birthDate);
    for (const clock of [input.clock, "2027-10-12T12:00:00+09:00"]) {
      const e = await majorNarrativeEvidence(c.payload, clock);
      if (!e.ok) throw Error("ORIGINAL_A_F_GENERATION_FAILED:" + c.id + ":" + e.errors.join("|"));
      const id = String.fromCharCode(65 + i), o = observeMajorPeriods(e, person, null, null, "offline:major:fixture:" + id);
      observations.push({ id, clock, observation: publicMajorObservation(o), comparison: compareMajorYears(o.years), mbti: person.mbtiType || null, fusionInputPresent: !!person.mbtiType, hourPresent: !!e.calculation.pillars.hour, actualCustomerEligible: 0 });
      if (clock === input.clock) for (const t of e.horizon.transitions) {
        const audit = transitionBoundaryAudit(o.originalDayun, t.year), year = o.years.find(y => y.calendarYear === t.year)!;
        boundaries.push({ id, ...audit, annualGanji: year.annualGanji, annualTenGod: year.annualTenGod, cycleScopeGuards: audit.observations.map(a => validateYearCycleScope(year, o.originalDayun, a.evaluatedAt)) });
      }
    }
  }
  for (const [i, person] of input.boundaryInputs.entries()) {
    const basis = calculateCustomerDayun(person);
    if (!basis.ok) { errors.push({ inputId: "boundary-" + i, status: "WITHHELD", originalError: basis.error, syntheticCycleCreated: false }); continue; }
    const first = basis.value.cycles[0], at = new Date(Date.parse(first.startSolarRange.earliestKst) - 1).toISOString();
    errors.push({ inputId: "boundary-" + i, status: "WITHHELD", result: validateActiveCycle(basis.value, at, first.startYear - 1), syntheticCycleCreated: false });
  }
  // Preserve the real generator failure when evaluation is inside D's range.
  const d = input.cases[3], normalizedD = normalizeReportInputPayload(d.payload);
  if (!normalizedD.ok || normalizedD.value.kind !== "majorFortune") throw Error("ORIGINAL_D_INPUT_REQUIRED");
  const original = await composeMajorFortuneNarrative(d.payload, "2033-08-01T12:00:00+09:00");
  const specialist = await observeMajorInput(d.payload, "2033-08-01T12:00:00+09:00");
  errors.push({ inputId: "D-inside-range", status: "WITHHELD", originalResult: original.ok ? { ok: true } : original, specialist, syntheticCycleCreated: false });
  return { mode: "REAL_PRODUCER_A_F_OBSERVATIONS", inputSource: "docs/validation/v4-major-fortune-product-knowledge-01/input-cases.json", originalClock: input.clock, observations, boundaries, withheld: errors, forbidden };
}
