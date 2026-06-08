import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const routeSourcePath = "src/app/api/reports/mock-paid-complete/route.ts";
const createRouteSourcePath = "src/app/api/reports/create/route.ts";
const routeSource = readSource(routeSourcePath);
const createRouteSource = readSource(createRouteSourcePath);

describe("mock paid complete route source", () => {
  it("is env-gated and completes paid report storage with two mock methods", () => {
    const requiredMarkers = [
      "MOCK_PAID_REPORT_API_ENABLED",
      "POST",
      "issueReportShareToken",
      "persistPaidFullReport",
      "buildReportPersistencePayload",
      "paid_unlocked",
      "toss",
      "kakao_pay",
      "mock_toss",
      "mock_kakao_pay",
      "1290",
      "KRW",
      "sharePath",
      "MOCK_PAID_REPORT_INVALID_PAYMENT_METHOD",
    ];

    for (const marker of requiredMarkers) {
      expect(routeSource).toContain(marker);
    }
  });

  it("does not include real payment integration, secrets, or restricted output fields", () => {
    const blockedMarkers = [
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "kakao" + "_card",
      "naver" + "_pay",
      "payco",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "console" + ".log",
      "access" + "TokenHash",
      "access" + "_token" + "_hash",
      "payment" + "Provider" + "Payment" + "Id",
      "payment" + "_provider" + "_payment" + "_id",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
    ];

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });

  it("keeps the preview create route separate from mock paid completion", () => {
    expect(createRouteSource).toContain('mode: "preview_memory"');
    expect(createRouteSource).not.toContain("mock-paid-complete");
    expect(createRouteSource).not.toContain("MOCK_PAID_REPORT_API_ENABLED");
    expect(createRouteSource).not.toContain("persistPaidFullReport");
    expect(createRouteSource).not.toContain("issueReportShareToken");
  });
});
