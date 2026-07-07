import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../../../src/app/api/payment-checkout/prepare/route";
import { createReadyPaymentOrder } from "../../../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import type { ReadyPaymentOrderAdapterResult } from "../../../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import type { PaymentProviderId } from "../../../src/lib/payment/paymentProviderTypes";

vi.mock("../../../src/lib/payment/supabaseReadyPaymentOrderAdapter", () => ({
  createReadyPaymentOrder: vi.fn(),
}));

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

const mockCreateReadyPaymentOrder = vi.mocked(createReadyPaymentOrder);

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

function createReadyResult(
  provider: PaymentProviderId,
): ReadyPaymentOrderAdapterResult {
  return {
    ok: true,
    order: {
      paymentOrderId: `payment_order_checkout_${provider}`,
      productType: "saju_mbti_full",
      provider,
      amount: 1290,
      currency: "KRW",
      status: "ready",
      providerOrderId: `provider_order_checkout_${provider}`,
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:01.000Z",
    },
  };
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
  }
}

describe("payment checkout prepare route", () => {
  beforeEach(() => {
    mockCreateReadyPaymentOrder.mockReset();
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
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("toss"));

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
        orderId: "provider_order_checkout_toss",
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
        paymentOrderId: "payment_order_checkout_toss",
        productType: "saju_mbti_full",
      },
    });
    expect(mockCreateReadyPaymentOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        productType: "saju_mbti_full",
        provider: "toss",
        inputSnapshot,
      }),
    );
  });

  it("returns safe config error when Toss env is missing", async () => {
    delete process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("toss"));

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(500);
    expectErrorBody(body, "PAYMENT_TOSS_CHECKOUT_CONFIG_MISSING");
    expect(JSON.stringify(body)).not.toContain("test_toss_secret_key");
  });

  it("keeps non-Toss providers out of Toss request drafting", async () => {
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("kakao_pay"));

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
      "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST",
    );
    expectErrorBody(
      await readJsonObject(nonObjectResponse),
      "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST",
    );
    expect(mockCreateReadyPaymentOrder).not.toHaveBeenCalled();
  });

  it("source stays scoped to checkout preparation only", () => {
    const requiredMarkers = [
      "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY",
      "TOSS_PAYMENTS_SECRET_KEY",
      "PAYMENT_TOSS_CHECKOUT_CONFIG_MISSING",
      "preparePaymentCheckoutSession",
      "prepareTossCheckoutRequest",
      "createReadyPaymentOrder",
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
      "provider" + "Payment" + "Id",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
    ];

    for (const marker of requiredMarkers) {
      expect(routeSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });
});
