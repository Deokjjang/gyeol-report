import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase SDK client adapter task spec source", () => {
  const docPath = "docs/launch/SUPABASE_SDK_CLIENT_ADAPTER_TASK_SPEC.md";

  it("includes required sections", () => {
    const doc = readDoc(docPath);
    const headings = [
      "# 결리포트 Supabase SDK Client Adapter Task Spec",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 구현 전 차단 조건",
      "## 4. 구현 대상 파일 후보",
      "## 5. 서버 전용 경계",
      "## 6. 환경변수/비밀값 경계",
      "## 7. Query Client 구현 범위",
      "## 8. DB 오류 매핑 규칙",
      "## 9. RLS/권한 검토",
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
      "SupabaseReportPersistenceQueryClient",
      "createSupabaseReportPersistenceAdapter",
      "injected query client",
      "row mapper",
      "migration",
      "production DB",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks blockers and target files", () => {
    const doc = readDoc(docPath);
    const markers = [
      "Supabase project",
      "reports table migration",
      "migration application procedure",
      "service role usage",
      "server-only runtime boundary",
      "env var naming",
      "local/test DB",
      "fake SDK strategy",
      "RLS/access policy",
      "backup/export plan",
      "release check pass",
      "src/lib/persistence/supabaseReportPersistenceSdkClient.ts",
      "tests/unit/persistence/supabaseReportPersistenceSdkClient.test.ts",
      "tests/integration/persistence/supabaseReportPersistenceSdkClient.integration.test.ts",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks server-only boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "server-side only",
      "client components",
      "browser-executed code",
      "service role key",
      "route handlers",
      "server actions",
      "pure mapper",
      "SDK-free",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks env and secrets boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "one server-only boundary",
      "no env read in mapper",
      "no env read in report generation logic",
      "no secrets in logs",
      "no secrets in client bundle",
      "no hardcoded keys",
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "NEXT_PUBLIC_",
      "service role key",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks query client method scope", () => {
    const doc = readDoc(docPath);
    const methodMarkers = [
      "insertReport",
      "updateReport",
      "findReportById",
      "listReports",
      "SupabaseReportQueryResult",
      "SupabaseReportRow",
    ];
    const behaviorMarkers = [
      "insert result",
      "updated row",
      "row or null",
      "bounded limit",
      "stable ordering",
      "typed `SupabaseReportQueryResult`",
    ];

    for (const marker of methodMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of behaviorMarkers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks DB error mapping rules", () => {
    const doc = readDoc(docPath);
    const markers = [
      "DB_UNAVAILABLE",
      "DUPLICATE_REPORT_ID",
      "NOT_FOUND",
      "PERMISSION_DENIED",
      "UNKNOWN_DB_ERROR",
      "duplicate key",
      "unique violation",
      "no row",
      "RLS",
      "permission failure",
      "connection/config failure",
      "unknown provider error",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks RLS and security review", () => {
    const doc = readDoc(docPath);
    const markers = [
      "service role bypass risk",
      "least privilege",
      "report access",
      "app-controlled",
      "no broad public table access",
      "production policy",
      "raw sensitive payload",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks test strategy", () => {
    const doc = readDoc(docPath);
    const markers = [
      "insert success",
      "duplicate insert mapping",
      "update success",
      "update not found",
      "find success",
      "find null",
      "list bounded limit",
      "permission failure",
      "unavailable/config failure",
      "unknown DB error",
      "no `NEXT_PUBLIC_` service role usage",
      "no client-side import markers",
      "no mapper SDK import",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks excluded scope and completion criteria", () => {
    const doc = readDoc(docPath);
    const markers = [
      "actual paid unlock API",
      "Toss payment integration",
      "webhook processing",
      "production deployment",
      "admin console",
      "analytics",
      "legal/support copy finalization",
      "applying migration to production DB",
      "SDK-backed query client file exists",
      "query client implements existing interface",
      "no SDK import in mapper",
      "no secrets exposed",
      "env boundary is server-only",
      "adapter tests remain pass",
      "query client tests pass",
      "release check passes",
      "actual production DB migration/application confirmed separately",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks next tasks and avoids implementation claims", () => {
    const doc = readDoc(docPath);
    const nextTaskMarkers = [
      "64B",
      "64C",
      "64D",
      "65A",
      "65B",
      "Supabase SDK client adapter implementation",
      "Supabase SDK client adapter tests",
      "production persistence wiring plan",
      "payment provider implementation preparation",
    ];
    const overclaimMarkers = [
      "SDK client is implemented",
      "SDK client 구현 완료",
      "Supabase SDK 구현 완료",
      "production DB connected",
      "production DB 연결 완료",
    ];

    for (const marker of nextTaskMarkers) {
      expect(doc).toContain(marker);
    }

    for (const marker of overclaimMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
