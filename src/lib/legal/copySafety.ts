export type CopySafetyViolationReason =
  | "medical"
  | "legal"
  | "investment"
  | "guarantee"
  | "certainty"
  | "price_exaggeration"
  | "diagnosis";

export type CopySafetyViolation = {
  readonly term: string;
  readonly reason: CopySafetyViolationReason;
};

export const allowedDisclaimerPatterns = [
  "의료·법률·투자 자문을 제공하지 않습니다",
] as const;

export const forbiddenAdvertisingClaimPatterns = [
  { term: "적중률", reason: "guarantee" },
  { term: "100%", reason: "guarantee" },
  { term: "100% 맞춤", reason: "guarantee" },
  { term: "100% 정확", reason: "guarantee" },
  { term: "100% 보장", reason: "guarantee" },
  { term: "보장", reason: "guarantee" },
  { term: "반드시 성공", reason: "certainty" },
  { term: "반드시 합격", reason: "certainty" },
  { term: "반드시 결혼", reason: "certainty" },
  { term: "무조건", reason: "certainty" },
  { term: "운명 확정", reason: "certainty" },
  { term: "미래 확정", reason: "certainty" },
  { term: "진단", reason: "diagnosis" },
  { term: "치료", reason: "medical" },
  { term: "상담치료", reason: "medical" },
  { term: "정신질환 분석", reason: "medical" },
  { term: "우울증 분석", reason: "medical" },
  { term: "불안장애 분석", reason: "medical" },
  { term: "의료 상담", reason: "medical" },
  { term: "법률 자문", reason: "legal" },
  { term: "투자 추천", reason: "investment" },
  { term: "종목 추천", reason: "investment" },
  { term: "수익 보장", reason: "investment" },
  { term: "오늘만", reason: "price_exaggeration" },
  { term: "마감 임박", reason: "price_exaggeration" },
  { term: "원래 9,900원", reason: "price_exaggeration" },
  { term: "90% 할인", reason: "price_exaggeration" },
  { term: "역대급 할인", reason: "price_exaggeration" },
  { term: "100% 할인", reason: "price_exaggeration" },
] as const satisfies readonly {
  readonly term: string;
  readonly reason: CopySafetyViolationReason;
}[];

function removeAllowedDisclaimers(input: string): string {
  return allowedDisclaimerPatterns.reduce(
    (current, disclaimer) => current.split(disclaimer).join(""),
    input,
  );
}

function isGenericGuaranteeTermAllowed(input: string, index: number): boolean {
  const windowStart = Math.max(0, index - 20);
  const windowEnd = Math.min(input.length, index + 20);
  const textWindow = input.slice(windowStart, windowEnd);

  return (
    textWindow.includes("제공하지 않습니다") ||
    textWindow.includes("하지 않습니다") ||
    textWindow.includes("아닙니다")
  );
}

export function findUnsafeVisibleCopy(input: string): readonly CopySafetyViolation[] {
  const normalizedInput = removeAllowedDisclaimers(input);
  const violations: CopySafetyViolation[] = [];

  for (const pattern of forbiddenAdvertisingClaimPatterns) {
    let searchIndex = normalizedInput.indexOf(pattern.term);

    while (searchIndex >= 0) {
      if (
        pattern.term !== "보장" ||
        !isGenericGuaranteeTermAllowed(normalizedInput, searchIndex)
      ) {
        violations.push({
          term: pattern.term,
          reason: pattern.reason,
        });
        break;
      }

      searchIndex = normalizedInput.indexOf(
        pattern.term,
        searchIndex + pattern.term.length,
      );
    }
  }

  return violations;
}
