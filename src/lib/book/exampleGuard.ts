/** 최종 A 15: 공개 예시(/example)에 실제 사람·식별 정보가 섞였는지 보는 검사(데이터 파일과 따로 — 내보내기 도구가 먼저 쓴다). */
/** 결리포트 시험·검수에 쓴 실제·다른 인물 이름(서하은 말고). 예시 데이터에 하나라도 있으면 안 된다. */
export const OTHER_TEST_NAMES = ["장덕민", "장소담", "전성민", "최지우", "윤도윤", "남태민", "백정우", "오지안", "남궁현", "백은솔"] as const;
const LEAK_PATTERNS: readonly [string, RegExp][] = [
  ["email", /[\w.+-]+@[\w-]+\.[\w.-]+/],
  ["uuid", /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i],
  ["reportId", /report_[a-f0-9]{32}/],
  ["orderCode", /\bGR-[A-Z0-9]{4}\b/],
  ["paymentOrder", /\b(?:po|order)_[A-Za-z0-9]{8,}/],
  ["phone", /01[016789]-?\d{3,4}-?\d{4}/],
];
export function exampleLeaks(text: string): string[] {
  return [...OTHER_TEST_NAMES.filter(n => text.includes(n)), ...LEAK_PATTERNS.filter(([, re]) => re.test(text)).map(([k]) => k)];
}
