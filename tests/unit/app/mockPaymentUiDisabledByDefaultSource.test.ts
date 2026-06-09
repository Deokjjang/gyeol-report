import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/report/new/page.tsx"),
  "utf8",
);

function getMockPaymentUiGuardedSource(): string {
  const start = pageSource.indexOf(
    "currentStep === 3 && MOCK_PAID_REPORT_UI_ENABLED",
  );
  const end = pageSource.indexOf("{currentStep > 0 ? (", start);

  expect(start).toBeGreaterThanOrEqual(0);
  expect(end).toBeGreaterThan(start);

  return pageSource.slice(start, end);
}

describe("mock payment UI production safety", () => {
  it("is hidden by default behind a strict public env flag", () => {
    expect(pageSource).toContain("NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED");
    expect(pageSource).toContain(
      'process.env.NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED === "1"',
    );
    expect(pageSource).toContain(
      "currentStep === 3 && MOCK_PAID_REPORT_UI_ENABLED",
    );
    expect(getMockPaymentUiGuardedSource()).toContain(
      "mockPaymentChoices.map",
    );

    const looseGateMarkers = [
      "if (process.env.NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED)",
      'process.env.NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED === "true"',
      'process.env.NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED !== "0"',
    ];

    for (const marker of looseGateMarkers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("keeps one-report payment choices to Toss and KakaoPay", () => {
    const requiredMarkers = [
      "/api/reports/mock-paid-complete",
      "mockPaymentMethod",
      "toss",
      "kakao_pay",
      "Toss로 결제 테스트",
      "KakaoPay로 결제 테스트",
      "리포트 1개당 1회 결제",
      "정식 결제 전 테스트용 결제 흐름입니다",
      "sharePath",
      "결제 테스트를 완료하지 못했습니다",
    ];

    for (const marker of requiredMarkers) {
      expect(pageSource).toContain(marker);
    }
  });

  it("does not add wallet recharge point balance or alternate providers", () => {
    const blockedPageMarkers = [
      "wallet",
      "recharge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "잔" + "액",
      "kakao" + "_card",
      "naver" + "_pay",
      "payco",
    ];

    for (const marker of blockedPageMarkers) {
      expect(pageSource).not.toContain(marker);
    }

    expect(getMockPaymentUiGuardedSource()).not.toContain("포" + "인트");
  });

  it("does not include real payment routes, secrets, logs, or restricted fields", () => {
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
      expect(pageSource).not.toContain(marker);
    }
  });
});
