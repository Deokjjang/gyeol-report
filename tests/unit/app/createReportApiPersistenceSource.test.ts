import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const routePath = "src/app/api/reports/create/route.ts";
const createReportApiPath = "src/lib/api/createReport.ts";

function readFile(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function getFinalSuccessResponseSource(source: string): string {
  const successResponseMarker = [
    "return NextResponse.json(",
    "    {",
    "      ...envelope.body,",
  ].join("\n");
  const start = source.indexOf(successResponseMarker);

  expect(start).toBeGreaterThanOrEqual(0);

  return source.slice(start);
}

describe("create report API persistence source", () => {
  it("imports persistence builder and runtime", () => {
    const source = readFile(routePath);

    expect(source).toContain("buildReportPersistencePayload");
    expect(source).toContain("createReportPersistenceRuntime");
  });

  it("uses preview-memory runtime without production persistence wiring", () => {
    const source = readFile(routePath);
    const blockedMarkers = [
      "production_supabase",
      "createSupabaseReportPersistenceAdapter",
      "createSupabaseReportPersistenceSdkClient",
      "@supabase/supabase-js",
      "process.env",
      "NEXT_PUBLIC",
    ];

    expect(source).toContain('mode: "preview_memory"');

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("calls adapter create after payload and runtime setup", () => {
    const source = readFile(routePath);

    expect(source).toContain("adapter.create");
  });

  it("preserves success response compatibility and exposes public reportId", () => {
    const routeSource = readFile(routePath);
    const createReportApiSource = readFile(createReportApiPath);
    const finalSuccessResponseSource =
      getFinalSuccessResponseSource(routeSource);
    const responseBlockedMarkers = [
      "inputSnapshot",
      "reportSnapshot",
      "accessToken",
      "access_token",
      "payment:",
      "providerRaw",
    ];

    expect(createReportApiSource).toContain("ok: true");
    expect(createReportApiSource).toContain("report: result.report");
    expect(finalSuccessResponseSource).toContain("...envelope.body");
    expect(finalSuccessResponseSource).toContain(
      "reportId: createResult.record.reportId",
    );

    for (const marker of responseBlockedMarkers) {
      expect(finalSuccessResponseSource).not.toContain(marker);
    }
  });

  it("has typed persistence failure envelopes", () => {
    const source = readFile(routePath);
    const expectedMarkers = [
      "REPORT_PERSISTENCE_PAYLOAD_FAILED",
      "REPORT_PERSISTENCE_RUNTIME_FAILED",
      "REPORT_PERSISTENCE_CREATE_FAILED",
      "리포트 저장 준비에 실패했습니다.",
      "리포트 저장 환경을 준비하지 못했습니다.",
      "리포트를 저장하지 못했습니다.",
    ];

    for (const marker of expectedMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("keeps existing validation and report failure envelope markers", () => {
    const routeSource = readFile(routePath);
    const createReportApiSource = readFile(createReportApiPath);
    const combinedSource = [routeSource, createReportApiSource].join("\n");

    expect(routeSource).toContain("INVALID_REQUEST");
    expect(createReportApiSource).toContain("REPORT_CREATE_FAILED");
    expect(combinedSource).toContain(
      "리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.",
    );
  });

  it("does not enable payment", () => {
    const source = readFile(routePath);
    const paymentEnabledMarkers = [
      "paid unlock enabled",
      "PAID" + "_UNLOCK" + "_ENABLED: true",
      "PAYMENT" + "_ENABLED: true",
      'paymentStatus: "paid"',
      'accessMode: "paid"',
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "check" + "out",
      "T" + "oss",
    ];

    for (const marker of paymentEnabledMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("avoids unsafe source markers", () => {
    const source = readFile(routePath);
    const unsafeMarkers = [
      "@supabase/supabase-js",
      "process.env",
      "NEXT_PUBLIC",
      "fetch(",
      "createClient",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "pass" + "word",
      "provider raw payload",
      "access token",
    ];

    for (const marker of unsafeMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
