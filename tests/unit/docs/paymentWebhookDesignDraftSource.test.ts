import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const designDraft = readDoc("docs/launch/PAYMENT_WEBHOOK_DESIGN_DRAFT.md");

describe("payment webhook design draft source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Payment Webhook Design Draft",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. Webhook 대상 이벤트",
      "## 4. 수신 엔드포인트 초안",
      "## 5. 검증 절차",
      "## 6. 멱등성 처리",
      "## 7. 상태 매핑",
      "## 8. 저장 범위",
      "## 9. paid unlock 연계",
      "## 10. 오류/재시도 처리",
      "## 11. 보안/로그 정책",
      "## 12. 테스트 전략",
      "## 13. 적용 전 차단 조건",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(designDraft).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "Toss Payments",
      "provider-neutral",
      "production persistence",
      "paid unlock API",
      "payment UI remains inactive",
      "webhook route is not implemented",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks target events and endpoint", () => {
    const markers = [
      "payment approved/paid",
      "payment cancelled",
      "payment failed",
      "refund/partial refund",
      "duplicate or repeated delivery",
      "unknown provider event",
      "/api/payments/toss/webhook",
      "server-only route",
      "no client-side webhook handling",
      "raw body",
      "signature verification",
      "provider-neutral payment status",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks verification procedure", () => {
    const markers = [
      "provider authenticity",
      "signature",
      "provider/order IDs",
      "amount/currency/product",
      "internal payment order",
      "expected state",
      "state transition",
      "inconsistent events",
      "do not trust webhook alone",
      "consistency checks",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks idempotency handling", () => {
    const markers = [
      "provider payment ID",
      "internal order ID",
      "duplicate paid event",
      "unlock twice",
      "duplicate cancel/fail/refund event",
      "safe on retry",
      "processed event reference",
      "status transition marker",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks status mapping and storage boundary", () => {
    const markers = [
      "ready",
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded",
      "existing payment status model",
      "provider payment ID",
      "order ID",
      "mapped status",
      "amount/currency",
      "timestamps",
      "minimal external reference",
      "raw card data",
      "raw sensitive payload",
      "secrets/signatures",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks paid unlock linkage", () => {
    const markers = [
      "confirmed paid state",
      "amount/currency/product consistency",
      "report access mode/status update",
      "payment confirmation",
      "failed/cancelled/refunded status does not unlock",
      "refund after unlock",
      "separate product decision",
      "access token hash boundary",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks error retry and security log policy", () => {
    const markers = [
      "invalid signature",
      "order not found",
      "amount mismatch",
      "unsupported event",
      "duplicate event",
      "persistence failure",
      "provider retry",
      "internal retry/backoff",
      "HTTP status",
      "server-side secrets",
      "no secrets in client bundle",
      "no raw card data",
      "no plaintext access token",
      "logs avoid sensitive payloads",
      "redact provider payloads",
      "audit/event record",
      "least-privilege route handling",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks test strategy and blockers", () => {
    const markers = [
      "valid paid webhook",
      "invalid signature/authenticity",
      "unknown order",
      "amount mismatch",
      "duplicate paid webhook",
      "failed/cancelled mapping",
      "refund mapping",
      "unsupported event",
      "persistence failure behavior",
      "no sensitive markers in source",
      "Toss webhook documentation",
      "webhook secret/key",
      "endpoint URL",
      "persistence linkage",
      "paid unlock transition",
      "manual QA plan",
      "release check",
      "payment inactive flag",
      "end-to-end verification",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const markers = [
      "59F",
      "59G",
      "60A",
      "60B",
      "60C",
      "paid unlock API implementation plan",
      "production persistence adapter implementation plan",
      "launch switch/payment inactive flag design",
      "webhook route skeleton task spec",
    ];

    for (const marker of markers) {
      expect(designDraft).toContain(marker);
    }

    const implementationClaims = [
      "webhook is implemented",
      "payment is implemented",
      "paid launch ready",
      "Webhook 구현 완료",
      "결제 연동 완료",
      "유료 출시 준비 완료",
    ];

    for (const claim of implementationClaims) {
      expect(designDraft).not.toContain(claim);
    }
  });
});
