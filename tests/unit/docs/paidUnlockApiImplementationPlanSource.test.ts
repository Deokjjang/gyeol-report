import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const implementationPlan = readDoc(
  "docs/launch/PAID_UNLOCK_API_IMPLEMENTATION_PLAN.md",
);

describe("paid unlock API implementation plan source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Paid Unlock API Implementation Plan",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. API 후보",
      "## 4. 입력/출력 계약 초안",
      "## 5. 성공 처리 흐름",
      "## 6. 실패 처리 흐름",
      "## 7. 상태 전이 규칙",
      "## 8. 결제 검증 경계",
      "## 9. 리포트 접근 토큰 경계",
      "## 10. 저장/증적 경계",
      "## 11. 보안/오남용 방어",
      "## 12. 테스트 전략",
      "## 13. 구현 전 차단 조건",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(implementationPlan).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "payment provider integration is not implemented",
      "production persistence is not connected",
      "paid unlock API is not implemented",
      "report persistence adapter",
      "payment adapter interface",
      "access token hash utility",
      "payment UI remains inactive",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks API candidates and contract", () => {
    const contractMarkers = [
      "POST /api/reports/unlock",
      "POST /api/payments/confirm",
      "reportId",
      "orderId",
      "paymentProvider",
      "providerPaymentId",
      "amount",
      "currency",
      "ok",
      "accessMode",
      "paymentStatus",
      "unlockStatus",
      "messageKo",
    ];

    for (const marker of contractMarkers) {
      expect(implementationPlan).toContain(marker);
    }

    const boundaryMarkers = [
      "payment confirmation route",
      "webhook",
      "provider secrets",
      "client should not directly mark a report as paid",
      "Final schema는 payment adapter와 persistence implementation에 따라 조정될 수 있다.",
    ];

    for (const marker of boundaryMarkers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks success flow", () => {
    const markers = [
      "validate request shape",
      "load report record",
      "load payment/order record",
      "verify confirmed payment status",
      "verify amount/currency/product",
      "update report access mode/status",
      "store payment linkage",
      "return unlock response",
      "do not expose sensitive fields",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks failure flow", () => {
    const markers = [
      "invalid request",
      "report not found",
      "order not found",
      "payment not confirmed",
      "amount/currency mismatch",
      "providerPaymentId mismatch",
      "already unlocked",
      "persistence failure",
      "provider verification failure",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks state transitions", () => {
    const markers = [
      "preview -> paid",
      "generated -> paid_unlocked",
      "pending/ready -> paid",
      "failed/cancelled/refunded -> no unlock",
      "deleted -> no unlock",
      "already unlocked state는 idempotent handling 대상으로 둔다.",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks payment verification and access token boundaries", () => {
    const markers = [
      "client callback alone is not trusted",
      "provider confirmation",
      "verified webhook",
      "amount/currency/product consistency",
      "duplicate confirm",
      "refund after unlock",
      "separate policy decision",
      "access token plaintext is not stored",
      "access token hash utility",
      "token rotation",
      "unlock response should avoid exposing hash",
      "access token issuance/receipt",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks storage evidence and security boundaries", () => {
    const markers = [
      "persist access mode/status transition",
      "persist payment linkage metadata",
      "persist timestamps",
      "minimal external reference",
      "raw card data",
      "raw sensitive provider payload",
      "audit/event table",
      "server-side validation",
      "rate limiting",
      "abuse guard",
      "no secrets in client bundle",
      "least privilege persistence access",
      "predictable ID guessing should not unlock",
      "logs avoid sensitive payloads",
      "safe error messages",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks test strategy and blockers", () => {
    const markers = [
      "unlock success after confirmed payment",
      "unlock blocked before confirmation",
      "amount mismatch",
      "report not found",
      "order not found",
      "already unlocked idempotency",
      "failed/cancelled/refunded payment",
      "deleted report",
      "no sensitive fields in response",
      "no client-side paid override",
      "persistence provider ready",
      "mocked behind adapter",
      "payment confirmation path",
      "webhook design accepted",
      "env/secrets strategy",
      "release check",
      "manual QA plan",
      "payment inactive flag",
      "end-to-end verification",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const markers = [
      "59H",
      "60A",
      "60B",
      "60C",
      "60D",
      "production persistence adapter implementation plan",
      "launch switch/payment inactive flag design",
      "webhook route skeleton task spec",
      "paid unlock API skeleton task spec",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }

    const implementationClaims = [
      "paid unlock is implemented",
      "paid launch ready",
      "payment is implemented",
      "paid unlock 구현 완료",
      "유료 출시 준비 완료",
      "결제 연동 완료",
    ];

    for (const claim of implementationClaims) {
      expect(implementationPlan).not.toContain(claim);
    }
  });
});
