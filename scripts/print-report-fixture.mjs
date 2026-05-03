const lines = [
  "결리포트 수동 출력 리뷰",
  "",
  "Current fixture input:",
  "birthDate: 2024-02-04",
  "birthTime: 17:27",
  "birthTimeUnknown: false",
  "calendarType: SOLAR",
  "gender: MALE",
  "timezone: Asia/Seoul",
  "mbtiType: ENTJ",
  "",
  "Recommended command:",
  "pnpm vitest run tests/unit/report/reportOutputFixture.test.ts --reporter=verbose",
  "",
  "Instructions:",
  "리포트 JSON을 직접 출력하려면 reportOutputFixture.test.ts의 skipped print test를 로컬에서만 일시적으로 활성화한 뒤 위 명령을 실행하세요.",
  "출력 확인 후 테스트를 다시 skip 상태로 되돌리고 커밋하지 마세요.",
  "",
  "Release check command:",
  "pnpm release:check",
];

console.log(lines.join("\n"));
