import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { POST } from "../../../src/app/api/payment-checkout/prepare/route";

const routeSource = readFileSync(
  join(process.cwd(), "src/app/api/payment-checkout/prepare/route.ts"),
  "utf8",
);

const originalEnv = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  tossClientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY,
  tossSecretKey: process.env.TOSS_PAYMENTS_SECRET_KEY,
};

const inputSnapshot = {
  displayName: "PAYMENT_ORDER_TEST",
  birthDate: "1996-12-06",
  reportInputPayload: {
    productKey: "saju_mbti_full",
    productSlug: "saju-mbti-full",
  },
} as const;

function restoreOptionalEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost:3000/api/payment-checkout/prepare", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJsonObject(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json();

  if (!isRecord(body)) {
    throw new Error("Unexpected response body.");
  }

  return body;
}

function expectErrorBody(body: Record<string, unknown>, code: string): void {
  expect(body.ok).toBe(false);
  expect(isRecord(body.error)).toBe(true);

  if (isRecord(body.error)) {
    expect(body.error.code).toBe(code);
    expect(typeof body.error.message).toBe("string");
    expect(JSON.stringify(body)).not.toContain(
      "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
    );
    expect(body.error.message).not.toContain("Checkout could not be prepared");
    expect(body.error.message).not.toContain("Toss checkout request configuration");
  }
}

describe("payment checkout prepare route", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
    process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY = "test_toss_client_key";
    process.env.TOSS_PAYMENTS_SECRET_KEY = "test_toss_secret_key";
  });

  afterEach(() => {
    restoreOptionalEnv("SUPABASE_URL", originalEnv.supabaseUrl);
    restoreOptionalEnv("SUPABASE_ANON_KEY", originalEnv.supabaseAnonKey);
    restoreOptionalEnv(
      "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY",
      originalEnv.tossClientKey,
    );
    restoreOptionalEnv("TOSS_PAYMENTS_SECRET_KEY", originalEnv.tossSecretKey);
  });

  it("prepares Toss checkout draft with fixed amount and route success fail URLs", async () => {
    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.paymentOrder).toMatchObject({
      productType: "saju_mbti_full",
      provider: "toss",
      amount: 1290,
      currency: "KRW",
      status: "ready",
    });
    expect(body.checkoutSession).toMatchObject({
      productLabelKo: "사주×MBTI 종합 리포트",
      amount: 1290,
      currency: "KRW",
      status: "prepared",
    });
    expect(body.tossCheckoutRequest).toMatchObject({
      provider: "toss",
      clientKey: "test_toss_client_key",
      requestPayment: {
        method: "CARD",
        orderId: expect.stringMatching(/^provider_order_/),
        orderName: "사주×MBTI 종합 리포트",
        successUrl: "http://localhost:3000/payments/toss/success",
        failUrl: "http://localhost:3000/payments/toss/fail",
        customerName: "결리포트 고객",
        amount: {
          currency: "KRW",
          value: 1290,
        },
      },
      metadata: {
        paymentOrderId: expect.stringMatching(/^payment_order_/),
        productType: "saju_mbti_full",
      },
    });
    expect(JSON.stringify(body)).not.toContain("test_toss_secret_key");
  });

  it("returns safe config error when Toss env is missing", async () => {
    delete process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(500);
    expectErrorBody(body, "PAYMENT_CHECKOUT_UNAVAILABLE");
    expect(JSON.stringify(body)).toContain(
      "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );
    expect(JSON.stringify(body)).not.toContain("test_toss_secret_key");
  });

  it("keeps non-Toss providers out of Toss request drafting", async () => {
    const response = await POST(
      createJsonRequest({
        provider: "kakao_pay",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(200);
    expect(body.paymentOrder).toMatchObject({
      provider: "kakao_pay",
      amount: 1290,
      currency: "KRW",
    });
    expect(body).not.toHaveProperty("tossCheckoutRequest");
  });

  it("returns 400 when input snapshot is missing or not an object", async () => {
    const missingResponse = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
      }),
    );
    const nonObjectResponse = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot: "not-object",
      }),
    );

    expect(missingResponse.status).toBe(400);
    expect(nonObjectResponse.status).toBe(400);
    expectErrorBody(
      await readJsonObject(missingResponse),
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
    );
    expectErrorBody(
      await readJsonObject(nonObjectResponse),
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
    );
  });

  it("source stays scoped to checkout preparation only", () => {
    const requiredMarkers = [
      "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY",
      "TOSS_PAYMENTS_SECRET_KEY",
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      "preparePaymentCheckoutSession",
      "prepareTossCheckoutRequest",
      "createPaymentOrderDraft",
      "createPaymentOrderPersistenceRuntime",
      "createReadyPaymentOrderRecord",
      "/payments/toss/success",
      "/payments/toss/fail",
      "tossCheckoutRequest",
      "saju_mbti_full",
    ];
    const blockedMarkers = [
      "/api/reports/create",
      "/v1/" + "payments/confirm",
      "fetch" + "(",
      "payment" + "Key",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "createSupabaseReadyPaymentOrderClient",
      "supabaseReadyPaymentOrderAdapter",
      "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
      "Checkout could not be prepared",
      "Toss checkout request configuration is missing",
    ];

    for (const marker of requiredMarkers) {
      expect(routeSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });
});
