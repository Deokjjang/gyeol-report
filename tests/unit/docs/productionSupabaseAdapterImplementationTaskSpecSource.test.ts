import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("production Supabase adapter implementation task spec source", () => {
  const docPath =
    "docs/launch/PRODUCTION_SUPABASE_ADAPTER_IMPLEMENTATION_TASK_SPEC.md";

  it("includes required sections", () => {
    const doc = readDoc(docPath);
    const headings = [
      "# 결리포트 Production Supabase Adapter Implementation Task Spec",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 전 차단 조건",
      "## 4. 구현 대상 파일 후보",
      "## 5. Supabase client 경계",
      "## 6. Adapter method 구현 범위",
      "## 7. Mapper 사용 규칙",
      "## 8. 오류 매핑 규칙",
      "## 9. 보안/비밀값 경계",
      "## 10. 테스트 전략",
      "## 11. 구현하지 않는 범위",
      "## 12. 완료 기준",
      "## 13. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(doc).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "migration file exists",
      "row mapper exists and is tested",
      "Supabase adapter skeleton exists",
      "provider-neutral",
      "production DB is not connected",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks blockers and target files", () => {
    const doc = readDoc(docPath);
    const markers = [
      "Supabase project ready",
      "migration reviewed",
      "local/test database strategy",
      "env/secrets strategy",
      "RLS/access policy",
      "backup/export plan",
      "release check pass",
      "src/lib/persistence/supabaseReportPersistenceAdapter.ts",
      "tests/unit/persistence/supabaseReportPersistenceAdapter.test.ts",
      "src/lib/persistence/supabaseReportPersistenceClient.ts",
      "tests/unit/persistence/supabaseReportPersistenceClient.test.ts",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks Supabase client boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "server-side only",
      "service role key",
      "not be exposed to client",
      "dependency injection",
      "no direct process.env access inside pure mapper",
      "injected query client",
      "config",
      "no client-side imports",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks adapter method scope", () => {
    const doc = readDoc(docPath);
    const methodMarkers = ["create", "update", "find", "softDelete", "list"];
    const behaviorMarkers = [
      "inserts mapped row",
      "returns persisted record",
      "controlled patch",
      "maps updated row",
      "lookup by reportId",
      "access/payment boundaries",
      "sets deleted status/timestamp",
      "bounded records",
      "unbounded scans",
    ];

    for (const marker of methodMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of behaviorMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks mapper usage rules", () => {
    const doc = readDoc(docPath);
    const markers = [
      "mapPersistedReportRecordToSupabaseRow",
      "mapSupabaseRowToPersistedReportRecord",
      "do not duplicate row mapping in adapter",
      "mapper failure maps to typed adapter failure",
      "snapshots pass through mapper boundary",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks error mapping and security boundaries", () => {
    const doc = readDoc(docPath);
    const markers = [
      "duplicate report ID",
      "not found",
      "deleted record",
      "permission/RLS failure",
      "DB unavailable",
      "mapper validation failure",
      "unknown DB error",
      "typed failure result",
      "raw card data",
      "plaintext access token storage",
      "secrets in logs",
      "secrets in client bundle",
      "raw provider payload",
      "least privilege DB access",
      "RLS/access policy",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks test strategy", () => {
    const doc = readDoc(docPath);
    const markers = [
      "create success",
      "duplicate create",
      "update success",
      "update not found",
      "find success",
      "find not found",
      "soft delete",
      "list bounded records",
      "mapper failure",
      "DB failure",
      "no SDK/env/client marker in pure files",
      "skeleton unavailable tests updated or split",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks excluded scope and completion criteria", () => {
    const doc = readDoc(docPath);
    const markers = [
      "actual paid unlock API",
      "payment provider integration",
      "webhook processing",
      "admin console",
      "analytics",
      "accounting automation",
      "production deployment",
      "legal/support copy finalization",
      "adapter methods implemented",
      "adapter tests pass",
      "mapper tests remain pass",
      "no skeleton unavailable behavior on production path",
      "no secrets exposed",
      "release check passes",
      "migration application remains separately confirmed",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const doc = readDoc(docPath);
    const nextTaskMarkers = [
      "63B",
      "63C",
      "63D",
      "63E",
      "64A",
      "Supabase adapter query client boundary",
      "Supabase adapter implementation",
      "Supabase adapter tests",
      "payment provider implementation preparation",
    ];
    const overclaimMarkers = [
      "production persistence is implemented",
      "Supabase implemented",
      "production DB connected",
      "production DB 구현 완료",
      "Supabase 구현 완료",
    ];

    for (const marker of nextTaskMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of overclaimMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
