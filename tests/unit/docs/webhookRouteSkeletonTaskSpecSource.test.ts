import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const taskSpec = readDoc("docs/launch/WEBHOOK_ROUTE_SKELETON_TASK_SPEC.md");

describe("webhook route skeleton task spec source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Webhook Route Skeleton Task Spec",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 대상 파일 후보",
      "## 4. Route 계약 초안",
      "## 5. Skeleton 동작",
      "## 6. 검증 경계",
      "## 7. 멱등성 경계",
      "## 8. 상태 매핑 경계",
      "## 9. 저장/증적 경계",
      "## 10. 보안/로그 경계",
      "## 11. 테스트 전략",
      "## 12. 구현하지 않는 범위",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(taskSpec).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "payment webhook design draft",
      "Toss",
      "payment remains inactive",
      "webhook route is not implemented",
      "production persistence is not connected",
      "paid unlock API is not implemented",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks target files and route contract", () => {
    const markers = [
      "src/app/api/payments/toss/webhook/route.ts",
      "tests/unit/app/tossWebhookRouteSource.test.ts",
      "src/lib/payments/tossWebhookTypes.ts",
      "src/lib/payments/tossWebhookMapper.ts",
      "tests/unit/payments/tossWebhookMapper.test.ts",
      "POST /api/payments/toss/webhook",
      "server-only handler",
      "no client-side webhook handling",
      "provider event payload",
      "safe JSON response",
      "no secrets in response",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks skeleton behavior", () => {
    const markers = [
      "parse request safely",
      "not verify real Toss signature yet",
      "secrets/config",
      "unavailable/disabled response",
      "payment flags are disabled",
      "not mutate report/payment state",
      "not unlock reports",
      "not store raw provider payload",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks verification and idempotency boundaries", () => {
    const markers = [
      "provider authenticity/signature",
      "provider payment ID",
      "internal order ID",
      "amount/currency/product",
      "inconsistent events",
      "do not trust webhook alone for unlock",
      "idempotency by provider payment ID and internal order ID",
      "duplicate events",
      "duplicate unlock",
      "duplicate fail/cancel/refund",
      "retries should be safe",
      "processed event reference",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks status mapping and storage evidence boundaries", () => {
    const statusMarkers = [
      "ready",
      "pending",
      "paid",
      "failed",
      "cancelled",
      "refunded",
      "provider-neutral payment status",
    ];

    for (const marker of statusMarkers) {
      expect(taskSpec).toContain(marker);
    }

    const storageMarkers = [
      "no persistence writes in skeleton",
      "mapped status",
      "minimal external reference",
      "raw card data",
      "raw sensitive provider payload",
      "plaintext access token",
      "audit/event table",
    ];

    for (const marker of storageMarkers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks security and log boundary", () => {
    const markers = [
      "no secrets in client bundle",
      "no secrets in logs",
      "redact provider payloads",
      "avoid logging sensitive payloads",
      "server-side route only",
      "least-privilege persistence access",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks test strategy and excluded scope", () => {
    const markers = [
      "route file contains POST handler",
      "route returns disabled/unavailable",
      "no client-side imports",
      "no provider SDK import",
      "no raw card data markers",
      "no unlock call in skeleton",
      "server-only boundary",
      "future mapper tests separated",
      "real Toss signature verification",
      "real provider API call",
      "real persistence mutation",
      "paid unlock execution",
      "refund automation",
      "admin console",
      "production deployment",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks completion criteria", () => {
    const markers = [
      "route skeleton compiles",
      "disabled response is deterministic",
      "no secrets/env leakage to client",
      "no report unlock side effect",
      "release check passes",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const markers = [
      "60F",
      "60G",
      "61A",
      "61B",
      "61C",
      "paid unlock API skeleton task spec",
      "Supabase migration file task",
      "runtime launch flag implementation task",
      "webhook route skeleton implementation",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }

    const implementationClaims = [
      "webhook is implemented",
      "payment is implemented",
      "Webhook 구현 완료",
      "결제 연동 완료",
    ];

    for (const claim of implementationClaims) {
      expect(taskSpec).not.toContain(claim);
    }
  });
});
