import {
  getAnnualFortuneCommerceYearPolicy,
  getAnnualFortuneCurrentYear,
} from "../../../lib/report-knowledge/annualFortuneYearRules";

export const getAsiaSeoulCurrentYear = getAnnualFortuneCurrentYear;

export function getAnnualFortuneYearOptions(
  referenceDate = new Date(),
): readonly number[] {
  return getAnnualFortuneCommerceYearPolicy(referenceDate).selectableYears;
}
