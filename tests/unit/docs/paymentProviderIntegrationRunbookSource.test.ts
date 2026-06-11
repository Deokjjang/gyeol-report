import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "docs/payment-provider-integration-runbook.md"),
  "utf8",
);

describe("payment provider integration runbook source", () => {
  it("documents current architecture without runtime implementation claims", () => {
    const requiredMarkers = [
      "Payment Provider Integration Runbook",
      "Current implementation includes a Toss confirm route that is disabled by default.",
      "The Toss confirm route calls the real Toss confirm API only when explicitly enabled.",
      "Real KakaoPay APIs are not called yet.",
      "One report per one payment",
      "ready payment_order",
      "server-side provider confirmation",
      "Checkout prepare API currently returns provider draft only.",
      "No real checkout URL exists yet.",
      "Client must never be trusted to mark payment as paid.",
      "The Toss confirm route does not mark a payment order paid yet.",
      "The Toss confirm route does not create a paid report or share link yet.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents Toss official integration requirements and env placeholders", () => {
    const requiredMarkers = [
      "Toss integration must use the official Toss Payments flow.",
      "Client-side checkout starts from a ready payment_order.",
      "Server must confirm or authorize the payment after redirect/callback.",
      "paymentOrderId",
      "providerOrderId",
      "amount = 990",
      "currency = KRW",
      "productType = `saju_mbti_full`",
      "provider = `toss`",
      "Test and live keys must be separated.",
      "TOSS_CLIENT_KEY",
      "TOSS_CONFIRM_API_ENABLED",
      "TOSS_SECRET_KEY",
      "TOSS_SUCCESS_URL",
      "TOSS_FAIL_URL",
      "TOSS_WEBHOOK_SECRET",
      "Do not expose `TOSS_SECRET_KEY` to client-side code.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents the Toss confirm route boundary", () => {
    const requiredMarkers = [
      "## Toss Confirm Route",
      "`POST /api/payments/toss/confirm` is server-only and disabled by default.",
      "It is enabled with `TOSS_CONFIRM_API_ENABLED=1`.",
      "It requires `TOSS_SECRET_KEY`.",
      "It confirms Toss payment using `paymentKey`, `orderId`, and `amount`.",
      "It enforces amount = 990.",
      "It does not mark `payment_order` as paid yet.",
      "It does not create reports or share links yet.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents the Toss paid transition RPC boundary", () => {
    const requiredMarkers = [
      "## Toss Paid Transition RPC",
      "After Toss confirm returns DONE, the server will call `mark_toss_payment_order_paid`.",
      "This transition only marks a ready Toss payment order as paid.",
      "It stores the provider payment id server-side.",
      "It does not create reports or share links.",
      "Paid report fulfillment is a separate next step.",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents KakaoPay official integration requirements and env placeholders", () => {
    const requiredMarkers = [
      "KakaoPay integration must use the official KakaoPay online single-payment API.",
      "KakaoPay app registration is required.",
      "Client ID and Secret key are required.",
      "CID is required after merchant review/approval.",
      "Web domain registration is required.",
      "Single payment flow should be modeled as ready → approve.",
      "amount = 990",
      "provider = `kakao_pay`",
      "KAKAO_PAY_CLIENT_ID",
      "KAKAO_PAY_SECRET_KEY",
      "KAKAO_PAY_CID",
      "KAKAO_PAY_APPROVAL_URL",
      "KAKAO_PAY_CANCEL_URL",
      "KAKAO_PAY_FAIL_URL",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents callback approval routes and state transitions", () => {
    const requiredMarkers = [
      "/api/payment-checkout/prepare",
      "/api/payments/toss/confirm",
      "/api/payments/kakao-pay/ready",
      "/api/payments/kakao-pay/approve",
      "/api/payments/kakao-pay/cancel",
      "/api/payments/kakao-pay/fail",
      "/api/payments/webhooks/toss",
      "ready → paid",
      "ready → failed",
      "ready → canceled",
      "paid → refunded",
      "client → paid",
      "failed → paid without new provider verification",
      "canceled → paid without new provider verification",
      "refunded → paid",
      "idempotent",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents fulfillment through stored input snapshot only", () => {
    const requiredMarkers = [
      "Paid report creation happens only after provider confirmation.",
      "Load payment_order by `paymentOrderId` / `providerOrderId`.",
      "Verify provider result.",
      "Mark order paid.",
      "Generate paid report from stored input_snapshot.",
      "Issue share token.",
      "Persist paid report.",
      "Attach `report_id` to payment_order.",
      "Return or redirect to `/r/<shareToken>`.",
      "Never generate paid report directly from client-supplied input after payment confirmation.",
      "Use stored payment_order.input_snapshot.",
      "persistPaidFullReport",
      "sharePath",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("documents security rules and future implementation order", () => {
    const requiredMarkers = [
      "Never trust client payment success claims.",
      "Never expose provider secret keys.",
      "Never expose input_snapshot in checkout responses.",
      "Never expose provider_payment_id unless explicitly needed server-side.",
      "Never expose access token hashes.",
      "Never expose Supabase keys in responses.",
      "Never use service role in client code.",
      "PAYMENT-16B Toss checkout request adapter",
      "PAYMENT-17 Toss confirm route",
      "PAYMENT-18 payment order mark-paid RPC",
      "PAYMENT-19 paid fulfillment from payment_order",
      "PAYMENT-20 KakaoPay ready adapter",
      "PAYMENT-21 KakaoPay approve route",
      "PAYMENT-22 payment webhook handling",
      "PAYMENT-23 production env and Vercel checklist",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }
  });

  it("does not claim real payment checkout is implemented or live", () => {
    const blockedMarkers = [
      "Real Toss checkout is implemented",
      "Real KakaoPay checkout is implemented",
      "Production payment is live",
      "No real Toss API call in this task.",
      "No approval or confirm route implementation in this task.",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("does not contain forbidden secret exposure names", () => {
    const blockedMarkers = [
      "NEXT_PUBLIC_TOSS_SECRET_KEY",
      "NEXT_PUBLIC_KAKAO_PAY_SECRET_KEY",
      "SUPABASE_SERVICE_ROLE",
      "service_role in client",
      "KAKAO_PAY_ADMIN_KEY",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });

  it("mentions stored-value concepts only as rejected scope", () => {
    const rejectionMarkers = [
      "No wallet.",
      "No recharge.",
      "No points.",
      "No credit balance.",
      "No wallet/recharge/point/balance concepts.",
    ];

    for (const marker of rejectionMarkers) {
      expect(source).toContain(marker);
    }

    const blockedPromotionMarkers = [
      "wallet " + "enabled",
      "recharge " + "enabled",
      "point balance " + "enabled",
      "credit balance " + "enabled",
      "package products " + "enabled",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of blockedPromotionMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
