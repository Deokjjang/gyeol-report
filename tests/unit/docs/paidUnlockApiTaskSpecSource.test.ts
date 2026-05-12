import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const taskSpec = readDoc("docs/launch/PAID_UNLOCK_API_TASK_SPEC.md");

describe("paid unlock API task spec source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Paid Unlock API Task Spec",
      "## 1. 목적",
      "## 2. 구현 전제",
      "## 3. 구현 대상",
      "## 4. 구현 제외 대상",
      "## 5. API 입력/출력 경계",
      "## 6. 정상 처리 흐름",
      "## 7. 실패 처리 흐름",
      "## 8. 멱등성/중복 처리",
      "## 9. Payment Adapter 연계",
      "## 10. Report Persistence Adapter 연계",
      "## 11. 보안/검증 요구사항",
      "## 12. 테스트 요구사항",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(taskSpec).toContain(heading);
    }
  });

  it("locks implementation prerequisites", () => {
    const markers = [
      "payment provider",
      "production persistence adapter",
      "paid unlock transaction design",
      "policy, refund, support copy",
      "release check",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks implementation and exclusion scope", () => {
    const markers = [
      "API route candidate",
      "request validation",
      "payment confirmation lookup",
      "report lookup",
      "paid unlock update",
      "typed success/failure response",
      "payment provider SDK implementation",
      "production persistence provider implementation",
      "final policy page replacement",
      "admin recovery console",
      "analytics",
      "email/receipt sending",
      "raw card data handling",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks API input and output boundary", () => {
    const markers = [
      "orderId",
      "reportId",
      "provider",
      "providerPaymentId",
      "amount",
      "currency",
      "ok",
      "accessMode",
      "status",
      "paymentStatus",
      "ok: false",
      "error.code",
      "error.messageKo",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks normal and failure flows", () => {
    const markers = [
      "request를 validate",
      "payment를 confirm",
      "amount, currency, provider, `reportId`를 검증",
      "report를 load",
      "deleted 또는 missing report를 reject",
      "payment linkage를 update",
      "`accessMode`를 `paid`",
      "`status`를 `paid_unlocked`",
      "invalid request",
      "payment not found",
      "payment not paid",
      "amount/currency mismatch",
      "provider mismatch",
      "report not found",
      "deleted report",
      "persistence update failure",
      "duplicate",
      "already unlocked",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks idempotency and adapter linkage", () => {
    const markers = [
      "`orderId`를 primary idempotency key",
      "`providerPaymentId`는 external reference",
      "double-unlock side effects",
      "`confirm` 또는 `find`",
      "client가 전달한 paid status를 신뢰하지 않는다",
      "PaymentFailureCode",
      "provider raw payload",
      "PaymentAdapter",
      "report persistence를 직접 update하지 않는다",
      "`reportId`로 report를 find",
      "`accessMode`, `status`, payment linkage를 update",
      "report snapshot을 보존",
      "deleted report를 block",
      "accessTokenHash",
      "PublicReportResult",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks security and test requirements", () => {
    const markers = [
      "server-side only",
      "no raw card data",
      "no plaintext access token logs",
      "amount, currency, provider validation",
      "server-side payment result verification",
      "sanitized provider errors",
      "rate limiting",
      "HTTPS",
      "success unlock",
      "invalid request",
      "payment not found",
      "amount mismatch",
      "provider mismatch",
      "deleted report blocked",
      "duplicate unlock",
      "persistence update failure mapping",
      "raw card 또는 access token exposure 없음",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks completion criteria and avoids implementation claims", () => {
    const completionMarkers = [
      "API contract가 later task에서 구현된다",
      "tests가 통과",
      "lint/build가 통과",
      "provider SDK를 추가하지 않는다",
      "policy copy replacement를 포함하지 않는다",
      "payment inactive UI를 유지",
      "docs를 갱신",
    ];

    for (const marker of completionMarkers) {
      expect(taskSpec).toContain(marker);
    }

    const implementationClaims = [
      "paid unlock API implemented",
      "payment provider active",
      "paid launch ready",
      "유료 잠금 해제 API 구현 완료",
      "결제 연동 완료",
      "유료 출시 준비 완료",
    ];

    for (const claim of implementationClaims) {
      expect(taskSpec).not.toContain(claim);
    }
  });
});
