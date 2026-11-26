export type ReportProductType =
  | "saju_mbti_full"
  | "career_money_study"
  | "love_marriage_child"
  | "saju_mbti_compatibility"
  | "major_fortune"
  | "annual_fortune"
  /** ZW-2 자미두수 단독 상품 「나의 열두 서가」 — 판매 닫힘(ops/config ALWAYS_CLOSED_PRODUCTS · 카탈로그 isPurchasable false). */
  | "ziwei_full";

export const reportProductTypes = [
  "saju_mbti_full",
  "career_money_study",
  "love_marriage_child",
  "saju_mbti_compatibility",
  "major_fortune",
  "annual_fortune",
  "ziwei_full",
] as const satisfies readonly ReportProductType[];

export function parseReportProductType(
  value: unknown,
): ReportProductType | null {
  return reportProductTypes.includes(value as ReportProductType)
    ? (value as ReportProductType)
    : null;
}
