import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const taskSpec = readDoc("docs/launch/PAID_UNLOCK_API_SKELETON_TASK_SPEC.md");

describe("paid unlock API skeleton task spec source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Paid Unlock API Skeleton Task Spec",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 대상 파일 후보",
      "## 4. Route 계약 초안",
      "## 5. Skeleton 동작",
      "## 6. 입력 검증 경계",
      "## 7. 결제 검증 경계",
      "## 8. 상태 전이 경계",
      "## 9. 접근 토큰/hash 경계",
      "## 10. 저장/증적 경계",
      "## 11. 보안/오남용 방어",
      "## 12. 테스트 전략",
      "## 13. 구현하지 않는 범위",
      "## 14. 완료 기준",
      "## 15. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(taskSpec).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "paid unlock API implementation plan",
      "paid unlock API is not implemented",
      "payment remains inactive",
      "production persistence is not connected",
      "real payment provider is not implemented",
      "access token hash utility",
      "launch flags are not implemented yet",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks target files and route contract", () => {
    const markers = [
      "src/app/api/reports/unlock/route.ts",
      "tests/unit/app/paidUnlockRouteSource.test.ts",
      "src/lib/payments/paidUnlockService.ts",
      "tests/unit/payments/paidUnlockService.test.ts",
      "src/lib/payments/paidUnlockTypes.ts",
      "POST /api/reports/unlock",
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

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks skeleton behavior", () => {
    const markers = [
      "PAID_UNLOCK_ENABLED=false",
      "disabled/unavailable",
      "not verify real provider payment yet",
      "not mutate report/payment state",
      "not unlock reports",
      "not issue plaintext access token",
      "not store raw provider payload",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks input validation boundary", () => {
    const markers = [
      "validate JSON request shape",
      "validate required IDs",
      "validate amount/currency format",
      "reject unsupported provider",
      "typed safe error",
      "sensitive implementation details",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks payment verification boundary", () => {
    const markers = [
      "client callback alone is not trusted",
      "provider confirmation",
      "verified webhook",
      "amount/currency/product consistency",
      "duplicate confirm",
      "failed/cancelled/refunded payment should not unlock",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks state transition boundary", () => {
    const markers = [
      "preview -> paid",
      "generated -> paid_unlocked",
      "pending/ready -> paid",
      "failed/cancelled/refunded -> no unlock",
      "deleted -> no unlock",
      "Already-unlocked idempotency",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks access token hash and storage evidence boundaries", () => {
    const markers = [
      "plaintext access token is not stored",
      "access token hash utility",
      "skeleton should not expose hash",
      "token issuance",
      "token rotation",
      "no persistence writes in skeleton",
      "access mode/status transition",
      "payment linkage metadata",
      "timestamps",
      "minimal external reference",
      "raw card data",
      "raw sensitive provider payload",
      "audit/event table",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks security abuse defense and tests", () => {
    const markers = [
      "server-side route only",
      "no secrets in client bundle",
      "predictable ID guessing should not unlock",
      "rate limiting",
      "abuse guard",
      "least privilege persistence access",
      "logs avoid sensitive payloads",
      "safe error messages",
      "route file contains POST handler",
      "route returns disabled/unavailable",
      "invalid request rejected",
      "no provider SDK import",
      "no raw card data markers",
      "no plaintext token response",
      "no unlock side effect",
      "no client-side paid override",
      "server-only boundary",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks excluded scope and completion criteria", () => {
    const markers = [
      "real payment confirmation",
      "real persistence mutation",
      "report unlock execution",
      "access token issuance",
      "refund handling",
      "webhook processing",
      "payment provider implementation",
      "production deployment",
      "route skeleton compiles",
      "disabled response is deterministic",
      "no secrets/env leakage to client",
      "no report unlock side effect",
      "no raw access token exposure",
      "release check passes",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const markers = [
      "60H",
      "61A",
      "61B",
      "61C",
      "61D",
      "Supabase migration file task",
      "runtime launch flag implementation task",
      "webhook route skeleton implementation",
      "paid unlock API route skeleton implementation",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
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
      expect(taskSpec).not.toContain(claim);
    }
  });
});
