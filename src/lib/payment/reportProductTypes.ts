export type ReportProductType =
  | "saju_mbti_full"
  | "career_money_study"
  | "love_marriage_child"
  | "saju_mbti_compatibility"
  | "major_fortune"
  | "annual_fortune";

export const reportProductTypes = [
  "saju_mbti_full",
  "career_money_study",
  "love_marriage_child",
  "saju_mbti_compatibility",
  "major_fortune",
  "annual_fortune",
] as const satisfies readonly ReportProductType[];

export function parseReportProductType(
  value: unknown,
): ReportProductType | null {
  return reportProductTypes.includes(value as ReportProductType)
    ? (value as ReportProductType)
    : null;
}
