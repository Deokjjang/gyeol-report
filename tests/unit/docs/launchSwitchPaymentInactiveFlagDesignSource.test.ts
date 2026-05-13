import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const designDoc = readDoc(
  "docs/launch/LAUNCH_SWITCH_PAYMENT_INACTIVE_FLAG_DESIGN.md",
);

describe("launch switch payment inactive flag design source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Launch Switch and Payment Inactive Flag Design",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. Flag 후보",
      "## 4. 기본 상태",
      "## 5. UI 노출 규칙",
      "## 6. API 차단 규칙",
      "## 7. Paid unlock 차단 규칙",
      "## 8. 전환 조건",
      "## 9. Rollback 조건",
      "## 10. 테스트 전략",
      "## 11. 구현하지 않는 범위",
      "## 12. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(designDoc).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "payment UI is inactive",
      "home no-payment preview copy",
      "/report/new payment inactive notice",
      "real payment provider is not implemented",
      "production persistence is not connected",
      "paid unlock API is not implemented",
      "public paid launch is blocked",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks candidate flags and defaults", () => {
    const markers = [
      "PAYMENT_ENABLED",
      "PAID_UNLOCK_ENABLED",
      "PUBLIC_PAID_LAUNCH_ENABLED",
      "INTERNAL_PREVIEW_ENABLED",
      "PAYMENT_ENABLED=false",
      "PAID_UNLOCK_ENABLED=false",
      "PUBLIC_PAID_LAUNCH_ENABLED=false",
      "INTERNAL_PREVIEW_ENABLED=true",
      "default-deny",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks UI exposure rules", () => {
    const markers = [
      "payment disabled",
      "home shows no-payment preview copy",
      "/report/new shows payment inactive notice",
      "purchase CTA",
      "active checkout",
      "full report unlock copy",
      "purchase is available",
      "internal preview",
      "report structure",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks API blocking rules", () => {
    const markers = [
      "payment session API",
      "PAYMENT_ENABLED=false",
      "paid unlock API",
      "PAID_UNLOCK_ENABLED=false",
      "public paid launch features",
      "PUBLIC_PAID_LAUNCH_ENABLED=false",
      "typed safe error",
      "client cannot override flags",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks paid unlock blocking rules", () => {
    const markers = [
      "no unlock before confirmed payment",
      "paid unlock flag disabled",
      "failed/cancelled/refunded",
      "client-only request",
      "idempotent already-unlocked handling",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks enablement and rollback conditions", () => {
    const markers = [
      "production persistence connected and verified",
      "payment provider test flow verified",
      "webhook route verified",
      "paid unlock API verified",
      "policy/refund/support copy reviewed",
      "release check pass",
      "manual QA pass",
      "rollback plan exists",
      "payment confirmation failure",
      "webhook inconsistency",
      "persistence failure",
      "paid unlock mismatch",
      "sensitive data exposure concern",
      "policy/support blocker",
      "manual QA blocker",
      "paid flags를 먼저 disabled 상태로 되돌린다.",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks test strategy and excluded scope", () => {
    const markers = [
      "default flags disabled",
      "home disabled copy visible",
      "/report/new inactive notice visible",
      "payment API blocked when disabled",
      "unlock API blocked when disabled",
      "client cannot enable paid flow",
      "enabling payment without unlock still blocks unlock",
      "rollback flag state restores disabled UI",
      "actual flag implementation",
      "payment provider implementation",
      "paid unlock API implementation",
      "webhook route implementation",
      "production deployment",
      "legal approval",
      "accounting automation",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks next tasks and avoids launch claims", () => {
    const markers = [
      "60D",
      "60E",
      "60F",
      "61A",
      "61B",
      "webhook route skeleton task spec",
      "paid unlock API skeleton task spec",
      "Supabase migration file task",
      "runtime launch flag implementation task",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }

    const launchClaims = [
      "paid launch ready",
      "payment enabled",
      "결제 활성화 완료",
      "유료 출시 준비 완료",
      "paid public launch is ready",
    ];

    for (const claim of launchClaims) {
      expect(designDoc).not.toContain(claim);
    }
  });
});
