import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  join(process.cwd(), "src/app/report/new/page.tsx"),
  "utf8",
);

describe("mock payment UI production safety", () => {
  it("removes mock paid report completion from the normal checkout page", () => {
    const removedMarkers = [
      "NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED",
      "MOCK_PAID_REPORT_UI_ENABLED",
      "/api/reports/mock-paid-complete",
      "mockPaymentMethod",
      "mockPaymentChoices",
      "Toss로 결제 테스트",
      "KakaoPay로 결제 테스트",
      "sharePath",
      "window.location.assign",
    ];

    for (const marker of removedMarkers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("keeps the Toss checkout test launcher as the only payment entry", () => {
    const requiredMarkers = [
      "NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED",
      "DevTossCheckoutLauncher",
      "inputSnapshot={checkoutInputSnapshot}",
      "990원 결제하고 리포트 생성하기",
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
      "포" + "인트",
    ];

    for (const marker of blockedPageMarkers) {
      expect(pageSource).not.toContain(marker);
    }
  });

  it("does not include confirm, secrets, logs, or restricted fields", () => {
    const blockedMarkers = [
      "/v1/" + "payments/confirm",
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
