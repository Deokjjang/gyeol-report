export type ReportProductType =
  | "saju_mbti_full"
  | "saju_basic"
  | "saju_full"
  | "daewoon"
  | "saewoon"
  | "compatibility";

export const reportProductTypes = [
  "saju_mbti_full",
  "saju_basic",
  "saju_full",
  "daewoon",
  "saewoon",
  "compatibility",
] as const satisfies readonly ReportProductType[];

export function parseReportProductType(
  value: unknown,
): ReportProductType | null {
  return reportProductTypes.includes(value as ReportProductType)
    ? (value as ReportProductType)
    : null;
}
