import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const taskSpec = readDoc("docs/launch/TOSS_PAYMENT_INTEGRATION_TASK_SPEC.md");

describe("toss payment integration task spec source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Toss Payment Integration Task Spec",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 전 차단 조건",
      "## 4. 구현 대상 범위",
      "## 5. 구현하지 않는 범위",
      "## 6. 결제 생성 흐름",
      "## 7. 결제 승인 흐름",
      "## 8. Webhook 처리 흐름",
      "## 9. paid unlock 연계 흐름",
      "## 10. 오류/취소/환불 처리",
      "## 11. 보안/비밀값 관리",
      "## 12. 테스트 전략",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(taskSpec).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "Toss Payments",
      "payment adapter interface",
      "in-memory payment adapter",
      "tests/dev only",
      "payment UI는 비활성 상태를 유지한다.",
      "paid unlock API",
      "production persistence",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks pre-implementation blockers", () => {
    const markers = [
      "Toss account/project",
      "test keys/secrets",
      "redirect/callback URL",
      "webhook endpoint path",
      "persistence linkage",
      "refund/support policy copy",
      "manual QA template",
      "release check",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks implementation and exclusion scope", () => {
    const markers = [
      "Toss adapter",
      "create payment session",
      "confirm payment",
      "payment order persistence linkage",
      "webhook verification design",
      "paid unlock transition boundary",
      "typed error mapping",
      "tests",
      "raw card data",
      "paid public launch",
      "KakaoPay PG",
      "Paddle",
      "admin console automation",
      "accounting automation",
      "final legal review claim",
      "full refund automation",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks create payment flow", () => {
    const markers = [
      "validate report/order request",
      "create internal payment order ID",
      "pending/ready state",
      "create Toss payment session/request data",
      "client-safe checkout data",
      "payment inactive flag",
      "explicit launch switch",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks confirm payment flow", () => {
    const markers = [
      "paymentKey",
      "orderId",
      "amount",
      "verify order exists",
      "verify amount/currency/product",
      "provider confirmation",
      "mark payment paid",
      "verified confirmation",
      "do not unlock report before confirmation",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks webhook and paid unlock boundaries", () => {
    const markers = [
      "verify signature",
      "provider authenticity",
      "idempotency",
      "duplicate events",
      "provider status",
      "internal status",
      "external reference",
      "raw sensitive payload",
      "consistency checks",
      "confirmed payment",
      "report status/access mode",
      "payment linkage",
      "access token/hash boundary",
      "failed payment does not unlock",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks error security test and completion criteria", () => {
    const markers = [
      "user cancel",
      "provider failure",
      "amount mismatch",
      "order not found",
      "duplicate confirmation",
      "refund requested",
      "typed error codes",
      "secrets only server-side",
      "no secrets in client bundle",
      "no raw card data",
      "no plaintext access token storage",
      "env separation",
      "webhook secret handling",
      "logs should avoid sensitive payloads",
      "create session success",
      "confirm amount mismatch",
      "webhook duplicate",
      "paid unlock blocked before confirmation",
      "paid unlock after confirmation",
      "source marker tests",
      "release check pass",
      "manual QA pass",
      "payment inactive flag",
      "end-to-end verification",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks next tasks", () => {
    const markers = [
      "59D",
      "59E",
      "59F",
      "60A",
      "60B",
      "payment webhook design draft",
      "paid unlock API implementation plan",
      "production persistence adapter implementation plan",
      "launch switch/payment inactive flag design",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("avoids implementation and launch claims", () => {
    const implementationClaims = [
      "payment is implemented",
      "paid launch ready",
      "Toss implemented",
      "결제 연동 완료",
      "유료 출시 준비 완료",
      "Toss 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(taskSpec).not.toContain(claim);
    }
  });
});
