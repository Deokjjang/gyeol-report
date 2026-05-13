import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const implementationPlan = readDoc(
  "docs/launch/PRODUCTION_PERSISTENCE_ADAPTER_IMPLEMENTATION_PLAN.md",
);

describe("production persistence adapter implementation plan source", () => {
  it("includes required sections", () => {
    const headings = [
      "# 결리포트 Production Persistence Adapter Implementation Plan",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 전 차단 조건",
      "## 4. 구현 대상 파일 후보",
      "## 5. 환경 변수/비밀값 경계",
      "## 6. 데이터 매핑 계획",
      "## 7. Adapter method 구현 계획",
      "## 8. 오류 매핑 계획",
      "## 9. 접근 토큰/hash 처리 계획",
      "## 10. 테스트 전략",
      "## 11. 마이그레이션/배포 순서",
      "## 12. 구현하지 않는 범위",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(implementationPlan).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const markers = [
      "Supabase/Postgres",
      "schema migration draft",
      "Supabase adapter skeleton",
      "report persistence adapter interface",
      "access token hash utility",
      "production DB is not connected",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks blockers and target files", () => {
    const markers = [
      "Supabase project",
      "migration path",
      "env/secrets strategy",
      "RLS/access policy",
      "backup/export plan",
      "retention/deletion policy",
      "local/dev test strategy",
      "release check",
      "src/lib/persistence/supabaseReportPersistenceAdapter.ts",
      "tests/unit/persistence/supabaseReportPersistenceAdapter.test.ts",
      "supabase/migrations/*",
      "src/lib/persistence/supabaseReportPersistenceMapper.ts",
      "tests/unit/persistence/supabaseReportPersistenceMapper.test.ts",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks env and secrets boundary", () => {
    const markers = [
      "server-side only Supabase URL/key",
      "service role key",
      "not exposed to client",
      "no env reads in client components",
      "config injection",
      "logs should not expose secrets",
      "no plaintext access tokens",
      "env/logs/storage",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks data mapping", () => {
    const markers = [
      "id/reportId -> report_id",
      "status -> status",
      "accessMode -> access_mode",
      "inputSnapshot -> input_snapshot",
      "reportSnapshot -> report_snapshot",
      "reportVersion -> report_version",
      "calculationVersion -> calculation_version",
      "locale -> locale",
      "accessTokenHash -> access_token_hash",
      "paymentLinkage -> payment_* columns",
      "createdAt/updatedAt/deletedAt -> timestamps",
      "JSONB serialization",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks adapter method plan", () => {
    const markers = [
      "create",
      "update",
      "find",
      "softDelete",
      "list",
      "inserts a report record",
      "controlled patch",
      "reportId/access mode/payment status",
      "sets deleted status/timestamp",
      "bounded results",
      "unbounded scans",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks error mapping and token hash plan", () => {
    const markers = [
      "duplicate report ID",
      "not found",
      "deleted record",
      "DB unavailable",
      "validation/mapping error",
      "permission/RLS error",
      "unknown provider error",
      "typed public report error codes",
      "plaintext access token is not stored",
      "access token hash utility",
      "adapter stores hash only",
      "find should not expose hash publicly",
      "token rotation fields",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks tests and migration deploy sequence", () => {
    const markers = [
      "create success",
      "duplicate create",
      "update success",
      "update not found",
      "find preview/paid boundary",
      "soft delete",
      "list bounded records",
      "DB failure mapping",
      "no raw access token storage",
      "no client-side env markers",
      "skeleton unavailable tests",
      "create migration file",
      "apply to local/test project",
      "typed row mapping",
      "implement mapper",
      "implement adapter",
      "update tests",
      "run release check",
      "run manual QA",
      "payment inactive",
      "end-to-end checks",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks excluded scope and completion criteria", () => {
    const markers = [
      "payment provider implementation",
      "paid unlock API implementation",
      "webhook route implementation",
      "admin console",
      "analytics",
      "accounting automation",
      "final legal/support copy replacement",
      "raw card data storage",
      "adapter methods implemented and tested",
      "no skeleton unavailable behavior remains",
      "release check passes",
      "manual QA",
      "no secrets exposed",
      "no raw access token storage",
      "no production persistence claim before deployed verification",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const markers = [
      "60B",
      "60C",
      "60D",
      "60E",
      "61A",
      "launch switch/payment inactive flag design",
      "webhook route skeleton task spec",
      "paid unlock API skeleton task spec",
      "Supabase migration file task",
    ];

    for (const marker of markers) {
      expect(implementationPlan).toContain(marker);
    }

    const implementationClaims = [
      "production persistence is implemented",
      "Supabase implemented",
      "production DB 구현 완료",
      "Supabase 구현 완료",
    ];

    for (const claim of implementationClaims) {
      expect(implementationPlan).not.toContain(claim);
    }
  });
});
