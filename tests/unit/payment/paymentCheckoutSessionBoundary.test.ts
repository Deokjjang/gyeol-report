import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  preparePaymentCheckoutSession,
  type PreparePaymentCheckoutSessionInput,
} from "../../../src/lib/payment/paymentCheckoutSessionBoundary";
import type { PaymentCheckoutSessionDraft } from "../../../src/lib/payment/paymentCheckoutSessionTypes";

const readyOrder = {
  paymentOrderId: "payment_order_checkout_test",
  providerOrderId: "provider_order_checkout_test",
  productType: "saju_mbti_full",
  provider: "toss",
  amount: 1290,
  currency: "KRW",
  status: "ready",
} as const satisfies PreparePaymentCheckoutSessionInput;

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function expectPrepared(
  result: ReturnType<typeof preparePaymentCheckoutSession>,
): PaymentCheckoutSessionDraft {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected checkout session to be prepared.");
  }

  return result.session;
}

function expectError(
  input: PreparePaymentCheckoutSessionInput,
  code: string,
): void {
  const result = preparePaymentCheckoutSession(input);

  expect(result).toEqual({
    ok: false,
    error: {
      code,
      messageKo: expect.any(String),
    },
  });
}

describe("payment checkout session boundary", () => {
  it("prepares Toss checkout draft from a ready order", () => {
    const session = expectPrepared(preparePaymentCheckoutSession(readyOrder));

    expect(session).toMatchObject({
      paymentOrderId: "payment_order_checkout_test",
      providerOrderId: "provider_order_checkout_test",
      productType: "saju_mbti_full",
      productLabelKo: "사주×MBTI 종합 리포트",
      provider: "toss",
      amount: 1290,
      currency: "KRW",
      status: "prepared",
      checkoutMode: "provider_redirect_pending",
      providerPayload: {
        provider: "toss",
        orderId: "provider_order_checkout_test",
        orderName: "사주×MBTI 종합 리포트",
        amount: 1290,
        currency: "KRW",
        customerNameLabel: "결리포트 고객",
      },
    });
  });

  it("prepares KakaoPay checkout draft from a ready order", () => {
    const session = expectPrepared(
      preparePaymentCheckoutSession({
        ...readyOrder,
        provider: "kakao_pay",
      }),
    );

    expect(session.providerPayload).toEqual({
      provider: "kakao_pay",
      partnerOrderId: "provider_order_checkout_test",
      itemName: "사주×MBTI 종합 리포트",
      quantity: 1,
      totalAmount: 1290,
      currency: "KRW",
    });
  });

  it("uses product catalog label as provider order name and item name", () => {
    const tossSession = expectPrepared(preparePaymentCheckoutSession(readyOrder));
    const kakaoPaySession = expectPrepared(
      preparePaymentCheckoutSession({
        ...readyOrder,
        provider: "kakao_pay",
      }),
    );

    expect(tossSession.productLabelKo).toBe("사주×MBTI 종합 리포트");
    expect(tossSession.providerPayload).toMatchObject({
      orderName: "사주×MBTI 종합 리포트",
    });
    expect(kakaoPaySession.providerPayload).toMatchObject({
      itemName: "사주×MBTI 종합 리포트",
    });
  });

  it("requires status ready and rejects paid failed canceled and refunded orders", () => {
    expectError(
      {
        ...readyOrder,
        status: "paid",
      },
      "PAYMENT_CHECKOUT_ORDER_NOT_READY",
    );
    expectError(
      {
        ...readyOrder,
        status: "failed",
      },
      "PAYMENT_CHECKOUT_ORDER_NOT_READY",
    );
    expectError(
      {
        ...readyOrder,
        status: "canceled",
      },
      "PAYMENT_CHECKOUT_ORDER_NOT_READY",
    );
    expectError(
      {
        ...readyOrder,
        status: "refunded",
      },
      "PAYMENT_CHECKOUT_ORDER_NOT_READY",
    );
  });

  it("requires provider order id", () => {
    expectError(
      {
        ...readyOrder,
        providerOrderId: "",
      },
      "PAYMENT_CHECKOUT_MISSING_PROVIDER_ORDER_ID",
    );
  });

  it("rejects unsupported provider", () => {
    expectError(
      {
        ...readyOrder,
        provider: "payco",
      },
      "PAYMENT_CHECKOUT_UNSUPPORTED_PROVIDER",
    );
  });

  it("rejects unsupported product", () => {
    expectError(
      {
        ...readyOrder,
        productType: "unknown_product",
        amount: 1290,
      },
      "PAYMENT_CHECKOUT_INVALID_ORDER",
    );
  });

  it("rejects amount mismatch", () => {
    expectError(
      {
        ...readyOrder,
        amount: 990,
      },
      "PAYMENT_CHECKOUT_AMOUNT_MISMATCH",
    );
  });

  it("rejects currency mismatch", () => {
    expectError(
      {
        ...readyOrder,
        currency: "USD",
      },
      "PAYMENT_CHECKOUT_CURRENCY_MISMATCH",
    );
  });

  it("rejects missing payment order id", () => {
    expectError(
      {
        ...readyOrder,
        paymentOrderId: "",
      },
      "PAYMENT_CHECKOUT_INVALID_ORDER",
    );
  });

  it("does not mutate input object", () => {
    const mutableOrder = {
      ...readyOrder,
    };
    const before = JSON.stringify(mutableOrder);

    preparePaymentCheckoutSession(mutableOrder);

    expect(JSON.stringify(mutableOrder)).toBe(before);
  });

  it("does not return real checkout urls or provider secrets", () => {
    const session = expectPrepared(preparePaymentCheckoutSession(readyOrder));
    const serialized = JSON.stringify(session);
    const blockedMarkers = [
      "checkout" + "Url",
      "next" + "_redirect",
      "approval" + "_url",
      "cancel" + "_url",
      "fail" + "_url",
      "secret" + "Key",
      "client" + "Secret",
      "admin" + "Key",
      "c" + "id",
    ];

    for (const marker of blockedMarkers) {
      expect(serialized).not.toContain(marker);
    }
  });

  it("source does not call providers create reports issue links or mutate persistence", () => {
    const source = [
      readSource("src/lib/payment/paymentCheckoutSessionTypes.ts"),
      readSource("src/lib/payment/paymentCheckoutSessionBoundary.ts"),
    ].join("\n");
    const blockedMarkers = [
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "secret" + "Key",
      "client" + "Secret",
      "admin" + "Key",
      "checkout" + "Url",
      "next" + "_redirect",
      "approval" + "_url",
      "cancel" + "_url",
      "fail" + "_url",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "buildReportPersistencePayload",
      "." + "in" + "sert(",
      "." + "update(",
      "share" + "Token",
      "access" + "TokenHash",
      "provider" + "_payment" + "_id",
      "report" + "_snapshot",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
