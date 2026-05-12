import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const taskSpec = readDoc(
  "docs/launch/PRODUCTION_PERSISTENCE_ADAPTER_TASK_SPEC.md",
);

describe("production persistence adapter task spec source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Production Persistence Adapter Task Spec",
      "## 1. 목적",
      "## 2. 구현 전제",
      "## 3. 구현 대상",
      "## 4. 구현 제외 대상",
      "## 5. Adapter 계약",
      "## 6. Access Token Hash 처리",
      "## 7. Report 저장/조회 흐름",
      "## 8. 삭제/보존 처리",
      "## 9. 에러 처리 기준",
      "## 10. 테스트 요구사항",
      "## 11. 보안 요구사항",
      "## 12. 완료 기준",
      "## 13. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(taskSpec).toContain(heading);
    }
  });

  it("locks implementation prerequisites", () => {
    const markers = [
      "final provider",
      "production schema와 migration draft",
      "access token hash utility",
      "payment는 별도 task 전까지 비활성 상태",
      "release check",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks implementation and exclusion scope", () => {
    const markers = [
      "production adapter",
      "provider client initialization",
      "`create`, `update`, `find`, `softDelete`, `list`",
      "report snapshot",
      "payment linkage metadata",
      "accessTokenHash",
      "payment provider implementation",
      "paid unlock API",
      "policy page final copy",
      "admin console",
      "analytics",
      "raw card data",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks adapter contract", () => {
    const markers = [
      "ReportPersistenceAdapter",
      "create",
      "update",
      "find",
      "softDelete",
      "list",
      "PublicReportResult",
      "PersistedReportRecord",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks access token hash and report flow", () => {
    const markers = [
      "plaintext token",
      "accessTokenHash",
      "hashReportAccessToken()",
      "lookup",
      "token hash를 검증",
      "`status`, `accessMode`, payment linkage",
      "public projection",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks deletion error and test requirements", () => {
    const markers = [
      "softDelete",
      "deleted report",
      "hard delete",
      "retention period",
      "typed result",
      "provider error",
      "messageKo",
      "invalid token",
      "wrong token",
      "paid access boundary",
      "duplicate reportId",
      "provider failure mapping",
      "plaintext token 없음",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("locks security and completion criteria", () => {
    const markers = [
      "server-side writes",
      "no client direct write",
      "token redaction",
      "env/secrets",
      "least-privilege",
      "backup/export",
      "tests가 통과",
      "lint/build가 통과",
      "payment implementation을 포함하지 않는다",
      "UI/API behavior를 변경하지 않는다",
    ];

    for (const marker of markers) {
      expect(taskSpec).toContain(marker);
    }
  });

  it("avoids implementation claims", () => {
    const implementationClaims = [
      "production persistence implemented",
      "DB adapter implemented",
      "provider connected",
      "production DB 구현 완료",
      "adapter 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(taskSpec).not.toContain(claim);
    }
  });
});
