import type { AnnualSpecialistIndex } from "./candidateIndex";
import type { AnnualMonthContract } from "../product-specialist-foundation/types";
import type { AnnualQuestion } from "./types";
export function annualQuestions(index: AnnualSpecialistIndex, months: readonly AnnualMonthContract[]): AnnualQuestion[] {
  return months.map(m => {
    const qs = [...index.foundation.questions.byId.values()].filter(q => q.productKey === "annual_fortune" && q.address.periodId === `month-${m.civilMonth}`);
    if (qs.length !== 1 || !m.questionIds.includes(qs[0].id)) throw Error("ORIGINAL_ANNUAL_QUESTION_REQUIRED");
    const q = qs[0], raw = q.sourceCatalogKey ? index.foundation.catalog.raw.get(q.sourceCatalogKey) : null;
    return { ...structuredClone(q), selectedYear: m.selectedYear, civilMonth: m.civilMonth, calendarBounds: m.calendarBounds, segmentRequirements: raw?.requires ?? null, previousMonthRequirement: raw?.previousMonthDifference ?? null, nextMonthRequirement: raw?.nextMonthConnection ?? null, counterexamples: raw?.counterexample ?? null, approvalState: "PENDING" };
  });
}
