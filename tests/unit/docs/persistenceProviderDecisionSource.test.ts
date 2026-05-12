import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const decisionDoc = readDoc("docs/launch/PERSISTENCE_PROVIDER_DECISION.md");

describe("persistence provider decision source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Persistence Provider Decision",
      "## 1. 목적",
      "## 2. 현재 저장소 전제",
      "## 3. 저장 대상",
      "## 4. 저장하지 않을 대상",
      "## 5. 후보 Provider",
      "## 6. 평가 기준",
      "## 7. 한국 V1 권장 방향",
      "## 8. 결제 연동과의 관계",
      "## 9. 개인정보/보존/삭제 경계",
      "## 10. 구현 전 차단 조건",
      "## 11. 최소 Adapter 요구사항",
      "## 12. 보류 사항",
      "## 13. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(decisionDoc).toContain(heading);
    }
  });

  it("locks storage target boundaries", () => {
    const markers = [
      "reportId",
      "status",
      "accessMode",
      "input snapshot",
      "report snapshot",
      "payment linkage",
      "createdAt",
      "updatedAt",
      "deletedAt",
      "locale",
      "version",
    ];

    for (const marker of markers) {
      expect(decisionDoc).toContain(marker);
    }
  });

  it("locks storage non-target boundaries", () => {
    const markers = [
      "raw card data",
      "provider secret keys",
      "raw logs",
      "보존 규칙",
    ];

    for (const marker of markers) {
      expect(decisionDoc).toContain(marker);
    }
  });

  it("locks provider candidates", () => {
    const providers = [
      "Supabase",
      "Postgres",
      "Firebase",
      "Firestore",
      "hosted Postgres",
      "object storage",
    ];

    for (const provider of providers) {
      expect(decisionDoc).toContain(provider);
    }
  });

  it("locks payment relation and privacy boundaries", () => {
    const markers = [
      "payment success",
      "payment failure",
      "providerPaymentId",
      "orderId",
      "card data",
      "birth input",
      "soft delete",
      "official@dvem.ai",
    ];

    for (const marker of markers) {
      expect(decisionDoc).toContain(marker);
    }
  });

  it("locks implementation blockers and adapter requirements", () => {
    const markers = [
      "production env",
      "retention/deletion policy",
      "access token",
      "backup/export",
      "release check",
      "create",
      "update",
      "find",
      "softDelete",
      "list",
    ];

    for (const marker of markers) {
      expect(decisionDoc).toContain(marker);
    }
  });

  it("avoids completion claims", () => {
    const completionClaims = [
      "provider selection final",
      "production storage implemented",
      "DB 구현 완료",
      "결제 연동 완료",
    ];

    for (const claim of completionClaims) {
      expect(decisionDoc).not.toContain(claim);
    }
  });
});
