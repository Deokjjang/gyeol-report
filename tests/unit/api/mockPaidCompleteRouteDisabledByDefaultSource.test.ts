import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const routeSource = readFileSync(
  join(process.cwd(), "src/app/api/reports/mock-paid-complete/route.ts"),
  "utf8",
);
const createRouteSource = readFileSync(
  join(process.cwd(), "src/app/api/reports/create/route.ts"),
  "utf8",
);

describe("mock paid complete route production safety", () => {
  it("is disabled by default behind a strict env flag", () => {
    expect(routeSource).toContain("MOCK_PAID_REPORT_API_ENABLED");
    expect(routeSource).toContain("MOCK_PAID_REPORT_API_DISABLED");
    expect(routeSource).toContain(
      'process.env[mockApiEnabledEnv] !== "1"',
    );
    expect(routeSource).toContain(
      'const mockApiEnabledEnv = "MOCK_PAID_REPORT_API_ENABLED"',
    );

    const looseGateMarkers = [
      "if (process.env.MOCK_PAID_REPORT_API_ENABLED)",
      "if (process.env[mockApiEnabledEnv])",
      'process.env.MOCK_PAID_REPORT_API_ENABLED === "true"',
      'process.env[mockApiEnabledEnv] === "true"',
    ];

    for (const marker of looseGateMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });

  it("keeps payment methods locked to Toss and KakaoPay mocks", () => {
    const requiredMarkers = [
      "toss",
      "kakao_pay",
      "mock_toss",
      "mock_kakao_pay",
    ];
    const blockedMarkers = [
      "kakao" + "_card",
      "naver" + "_pay",
      "payco",
      "wallet",
      "recharge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of requiredMarkers) {
      expect(routeSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });

  it("does not introduce real payment routes, secrets, or restricted fields", () => {
    const blockedMarkers = [
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "access" + "TokenHash",
      "access" + "_token" + "_hash",
      "payment" + "Provider" + "Payment" + "Id",
      "payment" + "_provider" + "_payment" + "_id",
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "console" + ".log",
    ];

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });

  it("does not alter the preview create route boundary", () => {
    expect(createRouteSource).toContain('mode: "preview_memory"');
    expect(createRouteSource).not.toContain("mock-paid-complete");
    expect(createRouteSource).not.toContain("MOCK_PAID_REPORT_API_ENABLED");
    expect(createRouteSource).not.toContain("persistPaidFullReport");
    expect(createRouteSource).not.toContain("issueReportShareToken");
  });
});
