import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readDoc(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("report creation persistence integration plan source", () => {
  const docPath =
    "docs/launch/REPORT_CREATION_PERSISTENCE_INTEGRATION_PLAN.md";

  it("includes required sections", () => {
    const doc = readDoc(docPath);
    const headings = [
      "# 결리포트 Report Creation Persistence Integration Plan",
      "## 1. 목적",
      "## 2. 현재 전제",
      "## 3. 통합 전 차단 조건",
      "## 4. 대상 파일 후보",
      "## 5. 현재 Report Creation 흐름",
      "## 6. 통합 후 Report Creation 흐름",
      "## 7. Persisted Record 생성 규칙",
      "## 8. API Response 경계",
      "## 9. 실패 처리 규칙",
      "## 10. Preview/Paid 경계",
      "## 11. 테스트 전략",
      "## 12. 구현하지 않는 범위",
      "## 13. 완료 기준",
      "## 14. 다음 개발 Task 제안",
    ];

    for (const heading of headings) {
      expect(doc).toContain(heading);
    }
  });

  it("locks current assumptions and blockers", () => {
    const doc = readDoc(docPath);
    const markers = [
      "/api/reports/create",
      "calculateSaju",
      "buildReport",
      "ReportPersistenceAdapter",
      "createReportPersistenceRuntime",
      "production DB",
      "payment remains inactive",
      "persistence runtime factory tested",
      "API error envelope",
      "persisted input snapshot",
      "persisted report snapshot",
      "access token strategy",
      "preview/paid boundary",
      "release check pass",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks target files", () => {
    const doc = readDoc(docPath);
    const markers = [
      "src/app/api/reports/create/route.ts",
      "src/lib/persistence/reportPersistenceRuntime.ts",
      "tests/unit/app/createReportApi",
      "tests/unit/persistence",
      "src/lib/report/reportPersistencePayload.ts",
      "tests/unit/report/reportPersistencePayload.test.ts",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks current report creation flow", () => {
    const doc = readDoc(docPath);
    const markers = [
      "parse request body",
      "validate input",
      "calculate saju",
      "build report",
      "return report response",
      "no persisted report ID yet",
      "no DB write yet",
      "current UI remains preview-oriented",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks future report creation flow", () => {
    const doc = readDoc(docPath);
    const markers = [
      "parse request body",
      "validate input",
      "calculate saju",
      "build report",
      "create persisted input snapshot",
      "create persisted report snapshot",
      "call persistence runtime",
      "adapter.create",
      "return public report response with reportId",
      "internal persistence record must not be exposed directly",
      "DB row must not be exposed",
      "payment remains inactive",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks persisted record rules", () => {
    const doc = readDoc(docPath);
    const markers = [
      "status starts as generated",
      "access mode starts as preview",
      "report version",
      "calculation version",
      "locale",
      "input snapshot excludes unnecessary raw data",
      "report snapshot stores generated report structure",
      "payment state remains not required/not started",
      "access token/hash handling remains separate",
      "lookup/unlock flow",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks API response boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "{ ok: true, report }",
      "reportId",
      "public-safe field",
      "no internal DB row",
      "no access token",
      "separate token flow",
      "no raw payment/provider payload",
      "no secrets",
      "typed error envelope",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks failure handling and preview paid boundary", () => {
    const doc = readDoc(docPath);
    const markers = [
      "validation failure",
      "calculation failure",
      "report creation failure",
      "persistence unavailable",
      "duplicate report id",
      "mapper validation failure",
      "provider/raw DB errors",
      "no partial paid unlock",
      "current preview UI remains unchanged",
      "paid unlock remains inactive",
      "report creation does not imply payment",
      "preview access can be persisted",
      "full paid access requires later unlock/token/payment verification",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks test strategy and exclusions", () => {
    const doc = readDoc(docPath);
    const markers = [
      "successful report creation calls persistence adapter",
      "API response includes public-safe report id",
      "persistence unavailable returns typed API error",
      "validation failure does not call persistence",
      "calculation/report build failure does not write persistence",
      "response does not expose DB row",
      "response does not expose access token",
      "payment remains inactive",
      "no Supabase SDK import in API route",
      "actual Supabase SDK client implementation",
      "actual production DB connection",
      "report lookup route",
      "paid unlock API",
      "Toss payment integration",
      "webhook processing",
      "admin console",
      "analytics",
      "production deployment",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("locks completion criteria and next tasks", () => {
    const doc = readDoc(docPath);
    const markers = [
      "integration plan exists",
      "target files are identified",
      "creation flow is defined",
      "persisted record rules are defined",
      "API response boundary is defined",
      "failure handling is defined",
      "preview/paid boundary is defined",
      "test strategy is defined",
      "66B",
      "66C",
      "66D",
      "66E",
      "67A",
      "report persistence payload builder",
      "report persistence payload builder tests",
      "report creation API persistence integration skeleton",
      "report lookup persistence plan",
    ];

    for (const marker of markers) {
      expect(doc).toContain(marker);
    }
  });

  it("avoids implementation claims", () => {
    const doc = readDoc(docPath);
    const overclaimMarkers = [
      "report creation persistence is implemented",
      "report creation persistence implemented",
      "report creation persistence 구현 완료",
      "DB write implemented",
      "DB write 구현 완료",
      "paid unlock enabled",
      "paid unlock 활성화",
    ];

    for (const marker of overclaimMarkers) {
      expect(doc).not.toContain(marker);
    }
  });
});
