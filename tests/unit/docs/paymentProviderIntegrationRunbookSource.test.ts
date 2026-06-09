import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "docs/payment-provider-integration-runbook.md"),
  "utf8",
);

describe("payment provider integration runbook source", () => {
  it("documents current mock-only state and provider scope", () => {
    const requiredMarkers = [
      "Payment Provider Integration Runbook",
      "Current implementation is mock-only.",
      "Real Toss and KakaoPay APIs are not called yet.",
      "Mock payment API is disabled by default.",
      "Mock payment UI is hidden by default.",
      "One report per one payment.",
      "toss",
      "kakao_pay",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents required environment placeholders and dev-only mock flags", () => {
    const requiredMarkers = [
      "TOSS_CLIENT_KEY=<toss-client-key>",
      "TOSS_SECRET_KEY=<toss-secret-key>",
      "KAKAO_PAY_ADMIN_KEY=<kakao-pay-admin-key>",
      "KAKAO_PAY_CID=<kakao-pay-cid>",
      "PAYMENT_SUCCESS_URL=<success-url>",
      "PAYMENT_FAIL_URL=<fail-url>",
      "PAYMENT_CANCEL_URL=<cancel-url>",
      "PAYMENT_WEBHOOK_SECRET=<webhook-secret>",
      "MOCK_PAID_REPORT_API_ENABLED=1",
      "NEXT_PUBLIC_MOCK_PAID_REPORT_UI_ENABLED=1",
      "Do not enable mock payment flags in production.",
      "Do not commit payment secrets.",
      "Do not paste payment secrets into chat.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents planned callback paths without implementing routes", () => {
    const requiredMarkers = [
      "/api/payments/toss/confirm",
      "/api/payments/kakao-pay/approve",
      "/api/payments/webhook",
      "These routes are planned and not implemented in this task.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents status mapping and paid report completion security", () => {
    const requiredMarkers = [
      "ready",
      "paid",
      "failed",
      "canceled",
      "refunded",
      "Only `paid` may create a paid report and share token.",
      "Do not trust client-provided payment status.",
      "Do not create paid reports before provider confirmation.",
      "Do not store plaintext share token.",
      "persistPaidFullReport",
      "sharePath",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not contain real-looking secrets", () => {
    const blockedMarkers = [
      "s" + "k" + "_",
      "test" + "_" + "s" + "k" + "_",
      "live" + "_",
      "AK" + "IA",
      "ey" + "J",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("does not promote unsupported payment models as enabled", () => {
    const blockedMarkers = [
      "wallet " + "enabled",
      "recharge " + "enabled",
      "point balance " + "enabled",
      "credit balance " + "enabled",
      "package products " + "enabled",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
