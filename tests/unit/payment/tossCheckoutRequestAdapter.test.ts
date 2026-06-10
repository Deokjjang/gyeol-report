import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { preparePaymentCheckoutSession } from "../../../src/lib/payment/paymentCheckoutSessionBoundary";
import type { PaymentCheckoutSessionDraft } from "../../../src/lib/payment/paymentCheckoutSessionTypes";
import {
  prepareTossCheckoutRequest,
  type TossCheckoutRequestResult,
} from "../../../src/lib/payment/tossCheckoutRequestAdapter";

const successUrl = "https://gyeol.example/payments/toss/success";
const failUrl = "https://gyeol.example/payments/toss/fail";

const readyOrder = {
  paymentOrderId: "payment_order_toss_checkout_test",
  providerOrderId: "provider_order_toss_checkout_test",
  productType: "saju_mbti_full",
  provider: "toss",
  amount: 990,
  currency: "KRW",
  status: "ready",
} as const;

function createPreparedTossSession(): PaymentCheckoutSessionDraft {
  const result = preparePaymentCheckoutSession(readyOrder);

  if (!result.ok) {
    throw new Error("Expected prepared Toss checkout session.");
  }

  return result.session;
}

function createPreparedKakaoPaySession(): PaymentCheckoutSessionDraft {
  const result = preparePaymentCheckoutSession({
    ...readyOrder,
    provider: "kakao_pay",
  });

  if (!result.ok) {
    throw new Error("Expected prepared KakaoPay checkout session.");
  }

  return result.session;
}

function expectPreparedDraft(
  result: TossCheckoutRequestResult,
): Extract<TossCheckoutRequestResult, { readonly ok: true }>["draft"] {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error("Expected Toss checkout request draft.");
  }

  return result.draft;
}

function expectError(
  result: TossCheckoutRequestResult,
  code: string,
): void {
  expect(result).toEqual({
    ok: false,
    error: {
      code,
      messageKo: expect.any(String),
    },
  });
}

function prepareDefault(
  checkoutSession: unknown = createPreparedTossSession(),
): TossCheckoutRequestResult {
  return prepareTossCheckoutRequest({
    checkoutSession,
    clientKey: "test_client_key",
    successUrl,
    failUrl,
  });
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Toss checkout request adapter", () => {
  it("builds a Toss request draft from a prepared Toss checkout session", () => {
    const draft = expectPreparedDraft(prepareDefault());

    expect(draft).toEqual({
      provider: "toss",
      clientKey: "test_client_key",
      requestPayment: {
        method: "CARD",
        orderId: "provider_order_toss_checkout_test",
        orderName: "사주×MBTI 전체 리포트",
        amount: {
          currency: "KRW",
          value: 990,
        },
        successUrl,
        failUrl,
        customerName: "결리포트 고객",
      },
      metadata: {
        paymentOrderId: "payment_order_toss_checkout_test",
        productType: "saju_mbti_full",
      },
    });
  });

  it("includes Toss payment window method fields", () => {
    const draft = expectPreparedDraft(prepareDefault());

    expect(draft.requestPayment.method).toBe("CARD");
    expect(draft.requestPayment).not.toHaveProperty("flow" + "Mode");
  });

  it("includes the client key and redirect URLs", () => {
    const draft = expectPreparedDraft(
      prepareTossCheckoutRequest({
        checkoutSession: createPreparedTossSession(),
        clientKey: "live_client_key",
        successUrl,
        failUrl,
      }),
    );

    expect(draft.clientKey).toBe("live_client_key");
    expect(draft.requestPayment.successUrl).toBe(successUrl);
    expect(draft.requestPayment.failUrl).toBe(failUrl);
  });

  it("rejects a non-Toss checkout session", () => {
    expectError(
      prepareDefault(createPreparedKakaoPaySession()),
      "TOSS_CHECKOUT_UNSUPPORTED_PROVIDER",
    );
  });

  it("rejects a non-prepared checkout session", () => {
    expectError(
      prepareDefault({
        ...createPreparedTossSession(),
        status: "ready",
      }),
      "TOSS_CHECKOUT_INVALID_SESSION",
    );
  });

  it("rejects a checkout session with the wrong checkout mode", () => {
    expectError(
      prepareDefault({
        ...createPreparedTossSession(),
        checkoutMode: "direct_redirect",
      }),
      "TOSS_CHECKOUT_INVALID_SESSION",
    );
  });

  it("rejects missing client key", () => {
    expectError(
      prepareTossCheckoutRequest({
        checkoutSession: createPreparedTossSession(),
        clientKey: "",
        successUrl,
        failUrl,
      }),
      "TOSS_CHECKOUT_INVALID_CLIENT_KEY",
    );
  });

  it("rejects non-HTTPS success URL by default", () => {
    expectError(
      prepareTossCheckoutRequest({
        checkoutSession: createPreparedTossSession(),
        clientKey: "test_client_key",
        successUrl: "http://example.com/success",
        failUrl,
      }),
      "TOSS_CHECKOUT_INVALID_SUCCESS_URL",
    );
  });

  it("rejects non-HTTPS fail URL by default", () => {
    expectError(
      prepareTossCheckoutRequest({
        checkoutSession: createPreparedTossSession(),
        clientKey: "test_client_key",
        successUrl,
        failUrl: "http://example.com/fail",
      }),
      "TOSS_CHECKOUT_INVALID_FAIL_URL",
    );
  });

  it("allows localhost URLs only when explicitly enabled", () => {
    const localSuccessUrl = "http://localhost:3000/payments/toss/success";
    const localFailUrl = "http://127.0.0.1:3000/payments/toss/fail";

    expectError(
      prepareTossCheckoutRequest({
        checkoutSession: createPreparedTossSession(),
        clientKey: "test_client_key",
        successUrl: localSuccessUrl,
        failUrl: localFailUrl,
      }),
      "TOSS_CHECKOUT_INVALID_SUCCESS_URL",
    );

    const draft = expectPreparedDraft(
      prepareTossCheckoutRequest({
        checkoutSession: createPreparedTossSession(),
        clientKey: "test_client_key",
        successUrl: localSuccessUrl,
        failUrl: localFailUrl,
        allowLocalhostRedirects: true,
      }),
    );

    expect(draft.requestPayment.successUrl).toBe(localSuccessUrl);
    expect(draft.requestPayment.failUrl).toBe(localFailUrl);
  });

  it("does not mutate input", () => {
    const checkoutSession = createPreparedTossSession();
    const before = JSON.stringify(checkoutSession);

    prepareDefault(checkoutSession);

    expect(JSON.stringify(checkoutSession)).toBe(before);
  });

  it("returns no confirm-stage fields provider identifiers or real checkout url", () => {
    const draft = expectPreparedDraft(prepareDefault());
    const serialized = JSON.stringify(draft);
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "secret" + "Key",
      "client" + "Secret",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "share" + "Token",
      "access" + "TokenHash",
    ];

    for (const marker of blockedMarkers) {
      expect(serialized).not.toContain(marker);
    }
  });

  it("source does not call Toss SDK APIs or add paid report behavior", () => {
    const source = [
      readSource("src/lib/payment/tossCheckoutRequestTypes.ts"),
      readSource("src/lib/payment/tossCheckoutRequestAdapter.ts"),
    ].join("\n");
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "secret" + "Key",
      "client" + "Secret",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "/v1/" + "payments/confirm",
      "To" + "ss" + "Payments(",
      "@toss" + "payments",
      "fe" + "tch(",
      "ax" + "ios",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
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
