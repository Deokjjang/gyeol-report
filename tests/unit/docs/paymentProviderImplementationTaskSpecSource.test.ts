import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const taskSpec = readDoc(
  "docs/launch/PAYMENT_PROVIDER_IMPLEMENTATION_TASK_SPEC.md",
);

describe("payment provider implementation task spec source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Payment Provider Implementation Task Spec",
      "## 1. 목적",
      "## 2. 구현 전제",
      "## 3. 구현 대상",
      "## 4. 구현 제외 대상",
      "## 5. Payment Adapter 계약",
      "## 6. 결제 세션 생성 흐름",
      "## 7. 결제 승인/확인 흐름",
      "## 8. 취소/환불 흐름",
      "## 9. Paid Unlock 연계 경계",
      "## 10. 에러 처리 기준",
      "## 11. 보안 요구사항",
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
      "final payment provider",
      "production persistence",
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
      "provider-specific adapter",
      "provider client initialization",
      "createSession",
      "confirm",
      "cancel",
      "refund",
      "providerPaymentId",
      "orderId",
      "typed result",
      "report persistence adapter implementation",
      "paid unlock API transaction",
      "final policy page replacement",
      "admin console",
      "analytics",
      "raw card data",
      "direct UI purchase flow",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks PaymentAdapter contract", () => {
    const markers = [
      "PaymentAdapter",
      "createSession",
      "confirm",
      "cancel",
      "refund",
      "find",
      "list",
      "PaymentOperationResult",
      "PaymentSessionResult",
      "PaymentFindResult",
      "PublicPaymentSummary",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks session and confirmation flows", () => {
    const markers = [
      "`reportId`, `productCode`, amount, currency",
      "provider session 또는 order",
      "redirectUrl",
      "providerPayload",
      "session creation 단계에서는 paid unlock",
      "server에서 검증",
      "amount와 currency",
      "providerPaymentId",
      "duplicate confirmation",
      "payment order state",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks cancel refund and paid unlock boundary", () => {
    const markers = [
      "paid state 전 cancel",
      "paid state 이후 refund",
      "repeated refund 또는 cancel",
      "manual refund path",
      "customer support path",
      "report persistence를 직접 mutate하지 않는다",
      "payment failure",
      "access token",
      "orderId",
      "providerPaymentId",
      "linkage metadata",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks error security and test requirements", () => {
    const markers = [
      "PaymentFailureCode",
      "messageKo",
      "provider raw error detail",
      "sanitized diagnostic data",
      "platform env",
      "source에 secrets",
      "HTTPS",
      "webhook 또는 redirect",
      "unknown",
      "createSession success/failure",
      "amount mismatch",
      "duplicate confirm",
      "provider error mapping",
      "env hardcoding 없음",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks completion criteria and avoids implementation claims", () => {
    const completionMarkers = [
      "adapter가 existing interface를 구현",
      "tests가 통과",
      "lint/build가 통과",
      "report persistence를 mutate하지 않는다",
      "paid unlock API를 포함하지 않는다",
      "payment inactive UI를 유지",
    ];

    for (const marker of completionMarkers) {
      expect(taskSpec).toContain(marker);
    }

    const implementationClaims = [
      "payment provider implemented",
      "paid launch ready",
      "provider connected",
      "결제 연동 완료",
      "유료 출시 준비 완료",
      "provider 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(taskSpec).not.toContain(claim);
    }
  });
});
