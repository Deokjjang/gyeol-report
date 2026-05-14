import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("production persistence wiring plan source", () => {
  const docPath = "docs/launch/PRODUCTION_PERSISTENCE_WIRING_PLAN.md";

  it("includes required sections", () => {
    const doc = readDoc(docPath);
    const headings = [
      "# 결리포트 Production Persistence Wiring Plan",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. Wiring 전 차단 조건",
      "## 4. Runtime 구성 후보",
      "## 5. Report Creation 저장 흐름",
      "## 6. Report Lookup 조회 흐름",
      "## 7. Preview/Paid Access 경계",
      "## 8. Adapter 선택 규칙",
      "## 9. 환경변수/서버 전용 경계",
      "## 10. 실패 처리 규칙",
      "## 11. 테스트 전략",
      "## 12. 구현하지 않는 범위",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(doc).toContain(heading);
    }
  });

  it("locks current assumptions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "report creation API",
      "in-memory adapter",
      "Supabase adapter",
      "injected query client",
      "Supabase SDK client",
      "skeleton",
      "production DB",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks blockers and runtime candidates", () => {
    const doc = readDoc(docPath);
    const markers = [
      "SDK-backed query client",
      "env/secrets boundary",
      "migration applied",
      "RLS/access policy",
      "fallback behavior",
      "manual QA plan",
      "release check pass",
      "createReportPersistenceRuntime",
      "createProductionReportPersistenceAdapter",
      "createPreviewReportPersistenceAdapter",
      "Supabase adapter + SDK query client",
      "in-memory adapter",
      "server-only",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks report creation flow", () => {
    const doc = readDoc(docPath);
    const markers = [
      "validate input",
      "calculate saju",
      "build report",
      "create persistence record",
      "save via adapter.create",
      "return report preview response",
      "API response should not expose internal DB row",
      "access token handling remains separate",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks report lookup flow", () => {
    const doc = readDoc(docPath);
    const markers = [
      "receive report id/access token later",
      "validate access boundary",
      "adapter.find",
      "return public preview/full result according to access mode",
      "do not expose deleted reports",
      "do not expose raw payment/provider data",
      "token hash verification remains separate",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks preview and paid access boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "preview mode",
      "limited/public safe result",
      "paid mode",
      "future unlock/token/payment validation",
      "current UI payment inactive state remains unchanged",
      "no automatic paid unlock",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks adapter selection rules", () => {
    const doc = readDoc(docPath);
    const markers = [
      "production env selects Supabase adapter",
      "SDK query client is implemented",
      "local/dev/test",
      "in-memory adapter",
      "no silent production fallback to memory",
      "explicit flag",
      "fail closed",
      "avoid hidden runtime switching",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks env server-only and failure handling", () => {
    const doc = readDoc(docPath);
    const markers = [
      "env read only inside server-only composition layer",
      "no env read in mapper",
      "no env read in report generation logic",
      "no secrets in client bundle",
      "no NEXT_PUBLIC_ service role key",
      "no secrets in logs",
      "persistence unavailable",
      "duplicate report id",
      "mapper validation failure",
      "DB permission failure",
      "unknown DB failure",
      "typed API error envelope",
      "do not expose secrets/provider raw errors",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks test strategy and exclusions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "runtime factory selects preview adapter",
      "runtime factory selects Supabase adapter when configured",
      "production misconfiguration fails closed",
      "report creation calls persistence adapter",
      "persistence failure maps to API error envelope",
      "lookup excludes deleted records",
      "no client-side import markers",
      "no env read in pure files",
      "release check pass",
      "actual SDK-backed query client",
      "actual paid unlock API",
      "Toss payment integration",
      "webhook processing",
      "admin console",
      "analytics",
      "production deployment",
      "legal/support copy finalization",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks completion criteria and next tasks", () => {
    const doc = readDoc(docPath);
    const markers = [
      "wiring plan exists",
      "runtime factory task is defined",
      "server-only boundary is defined",
      "adapter selection rules are defined",
      "creation/lookup flows are defined",
      "test strategy is defined",
      "65B",
      "65C",
      "65D",
      "66A",
      "66B",
      "persistence runtime factory skeleton",
      "persistence runtime factory tests",
      "report creation persistence integration plan",
      "payment provider implementation preparation",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("avoids implementation claims", () => {
    const doc = readDoc(docPath);
    const overclaimMarkers = [
      "production persistence is live",
      "production persistence live",
      "production persistence 구현 완료",
      "production DB connected",
      "production DB 연결 완료",
      "runtime wiring implemented",
      "runtime wiring 구현 완료",
    ];

    for (const marker of overclaimMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
