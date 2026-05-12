import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const designDoc = readDoc("docs/launch/PAID_UNLOCK_TRANSACTION_DESIGN.md");

describe("paid unlock transaction design source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Paid Unlock Transaction Design",
      "## 1. 목적",
      "## 2. 현재 상태",
      "## 3. 핵심 원칙",
      "## 4. 정상 흐름",
      "## 5. 실패 흐름",
      "## 6. 멱등성 기준",
      "## 7. 저장소 업데이트 기준",
      "## 8. 결제 Adapter 책임",
      "## 9. Report Persistence Adapter 책임",
      "## 10. 보안/검증 기준",
      "## 11. 구현 전 차단 조건",
      "## 12. 보류 사항",
      "## 13. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(designDoc).toContain(heading);
    }
  });

  it("locks current inactive and non-production state", () => {
    const markers = [
      "payment는 비활성 상태",
      "in-memory payment adapter",
      "tests/dev only",
      "in-memory persistence adapter",
      "real provider는 구현되어 있지 않다",
      "production DB는 구현되어 있지 않다",
      "report preview와 gating UI",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks normal unlock flow", () => {
    const markers = [
      "payment order 또는 session",
      "provider가 payment를 confirm",
      "provider result와 amount를 검증",
      "`reportId`로 report를 찾는다",
      "payment linkage를 갱신",
      "`accessMode`",
      "`paid`",
      "`paid_unlocked`",
      "public paid access result",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks failure flow", () => {
    const markers = [
      "payment cancelled",
      "amount mismatch",
      "provider confirmation failed",
      "report not found",
      "already processed order",
      "persistence update failed",
      "paid unlock은 closed 상태로 유지",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks idempotency and storage update fields", () => {
    const markers = [
      "orderId",
      "providerPaymentId",
      "payment.orderId",
      "payment.provider",
      "payment.paymentStatus",
      "payment.amount",
      "payment.currency",
      "payment.paidAt",
      "accessMode",
      "status",
      "updatedAt",
      "`generated` 또는 preview 상태에서 `paid_unlocked`",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks adapter responsibilities", () => {
    const markers = [
      "create session",
      "confirm",
      "cancel",
      "refund",
      "typed errors",
      "report persistence를 직접 mutate하지 않음",
      "report record create, find, update",
      "unlock patch 적용",
      "public projection",
      "deleted report 접근 차단",
      "accessTokenHash",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("locks security and blockers", () => {
    const markers = [
      "amount와 currency",
      "provider가 일치",
      "`reportId`가 일치",
      "server-side verification",
      "plaintext access token",
      "provider decision",
      "production persistence provider",
      "schema/migration",
      "access token hash storage",
      "refund/support policy",
      "release check",
      "manual QA",
    ];

    for (const marker of markers) {
      expect(designDoc).toContain(marker);
    }
  });

  it("avoids implementation claims", () => {
    const implementationClaims = [
      "paid unlock implemented",
      "payment provider active",
      "transaction implemented",
      "유료 잠금 해제 구현 완료",
      "결제 연동 완료",
      "production DB 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(designDoc).not.toContain(claim);
    }
  });
});
