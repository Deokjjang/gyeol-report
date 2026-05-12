import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const schemaDraft = readDoc(
  "docs/launch/PRODUCTION_PERSISTENCE_SCHEMA_DRAFT.md",
);

describe("production persistence schema draft source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Production Persistence Schema Draft",
      "## 1. 목적",
      "## 2. 현재 상태",
      "## 3. 설계 원칙",
      "## 4. reports 테이블/컬렉션 후보",
      "## 5. payment_linkage 필드 후보",
      "## 6. access token hash 필드 후보",
      "## 7. public result projection",
      "## 8. 삭제/보존 필드",
      "## 9. 인덱스 후보",
      "## 10. 보안/접근 제어",
      "## 11. 마이그레이션 전 차단 조건",
      "## 12. 보류 사항",
      "## 13. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(schemaDraft).toContain(heading);
    }
  });

  it("locks report field candidates", () => {
    const fields = [
      "reportId",
      "status",
      "accessMode",
      "inputSnapshot",
      "reportSnapshot",
      "reportVersion",
      "calculationVersion",
      "locale",
      "createdAt",
      "updatedAt",
      "deletedAt",
    ];

    for (const field of fields) {
      expect(schemaDraft).toContain(field);
    }
  });

  it("locks payment linkage candidates", () => {
    const fields = [
      "orderId",
      "provider",
      "providerPaymentId",
      "paymentStatus",
      "amount",
      "currency",
      "paidAt",
      "refundedAt",
      "metadata",
    ];

    for (const field of fields) {
      expect(schemaDraft).toContain(field);
    }
  });

  it("locks access token hash candidates", () => {
    const fields = [
      "accessTokenHash",
      "accessTokenCreatedAt",
      "accessTokenRotatedAt",
      "accessTokenVersion",
      "plaintext",
      "production",
    ];

    for (const field of fields) {
      expect(schemaDraft).toContain(field);
    }
  });

  it("locks public projection boundary", () => {
    const markers = [
      "public result",
      "payment provider 내부 field",
      "token hash",
      "deleted report",
      "`status`, `accessMode`, payment linkage",
    ];

    for (const marker of markers) {
      expect(schemaDraft).toContain(marker);
    }
  });

  it("locks deletion index and access control boundaries", () => {
    const markers = [
      "soft delete",
      "hard delete",
      "retention period",
      "reportId",
      "payment.orderId",
      "payment.providerPaymentId",
      "server-side access",
      "`reportId`와 access token hash",
      "client direct write",
      "redact",
    ];

    for (const marker of markers) {
      expect(schemaDraft).toContain(marker);
    }
  });

  it("locks migration blockers", () => {
    const blockers = [
      "final provider decision",
      "env/secrets separation",
      "access token hash storage decision",
      "backup/export plan",
      "deletion/retention policy",
      "release check",
      "manual QA",
    ];

    for (const blocker of blockers) {
      expect(schemaDraft).toContain(blocker);
    }
  });

  it("avoids implementation claims", () => {
    const implementationClaims = [
      "production DB implemented",
      "migration implemented",
      "schema deployed",
      "DB 구현 완료",
      "마이그레이션 완료",
    ];

    for (const claim of implementationClaims) {
      expect(schemaDraft).not.toContain(claim);
    }
  });
});
