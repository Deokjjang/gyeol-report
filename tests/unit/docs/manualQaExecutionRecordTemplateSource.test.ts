import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const template = readDoc(
  "docs/launch/MANUAL_QA_EXECUTION_RECORD_TEMPLATE.md",
);

describe("manual QA execution record template source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Manual QA Execution Record Template",
      "## 1. 목적",
      "## 2. QA 실행 전 상태",
      "## 3. 실행 환경",
      "## 4. 검증 명령 결과",
      "## 5. 라우트별 QA 기록",
      "## 6. 입력 시나리오 QA 기록",
      "## 7. 모바일 QA 기록",
      "## 8. 결제 비활성 QA 기록",
      "## 9. 정책 페이지 QA 기록",
      "## 10. 오류/복구 QA 기록",
      "## 11. 이슈 목록",
      "## 12. 최종 판정",
      "## 13. 다음 조치",
    ];

    for (const heading of headings) {
      expect(template).toContain(heading);
    }
  });

  it("locks pre-QA status and environment fields", () => {
    const fields = [
      "Git commit:",
      "Branch:",
      "Date:",
      "Tester:",
      "Environment:",
      "OS:",
      "Browser:",
      "Device:",
      "Viewport:",
      "Network:",
    ];

    for (const field of fields) {
      expect(template).toContain(field);
    }
  });

  it("locks verification command table", () => {
    const markers = [
      "| Command | Result | Notes |",
      "| --- | --- | --- |",
      "| pnpm test |",
      "| pnpm lint |",
      "| pnpm build |",
      "| pnpm release:check |",
    ];

    for (const marker of markers) {
      expect(template).toContain(marker);
    }
  });

  it("locks route QA records", () => {
    const markers = [
      "| Route | Expected | Result | Issue |",
      "| / | Home page loads and CTA is visible |",
      "| /report/new | Report preview creation screen loads |",
      "| /terms | Terms placeholder page loads |",
      "| /privacy | Privacy placeholder page loads |",
      "| /refund | Refund placeholder page loads |",
    ];

    for (const marker of markers) {
      expect(template).toContain(marker);
    }
  });

  it("locks input mobile and payment inactive QA records", () => {
    const markers = [
      "valid solar birth date/time",
      "unknown birth time",
      "MBTI selected",
      "MBTI omitted",
      "missing birth date",
      "incomplete field",
      "360px viewport",
      "no horizontal overflow",
      "form usability",
      "report card readability",
      "home no-payment preview copy visible",
      "/report/new payment inactive notice visible",
      "no card/payment input",
      "no active purchase flow",
      "locked/full report CTA is non-purchase wording",
    ];

    for (const marker of markers) {
      expect(template).toContain(marker);
    }
  });

  it("locks policy and error recovery QA records", () => {
    const markers = [
      "pre-launch draft notice",
      "support email visible",
      "home link works",
      "no final legal approval claim",
      "validation error",
      "API failure",
      "retry path",
      "user not stuck after error",
    ];

    for (const marker of markers) {
      expect(template).toContain(marker);
    }
  });

  it("locks issue table and final decision checklist", () => {
    const markers = [
      "| ID | Severity | Area | Description | Owner | Status |",
      "Internal/private no-payment preview can proceed",
      "Internal/private no-payment preview is blocked",
      "Paid public launch remains blocked",
    ];

    for (const marker of markers) {
      expect(template).toContain(marker);
    }
  });

  it("avoids QA completion and launch approval claims", () => {
    const overclaims = [
      "QA completed",
      "launch approved",
      "paid launch ready",
      "QA 완료",
      "출시 승인 완료",
      "유료 출시 준비 완료",
    ];

    for (const overclaim of overclaims) {
      expect(template).not.toContain(overclaim);
    }
  });
});
