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
const createReadyRouteSource = readFileSync(
  join(process.cwd(), "src/app/api/payment-orders/create-ready/route.ts"),
  "utf8",
);
const createReportRouteSource = readFileSync(
  join(process.cwd(), "src/app/api/reports/create/route.ts"),
  "utf8",
);

const originalCheckoutPrepareApiEnabled =
  process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalSupabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const inputSnapshot = {
  mbti: "ENTJ",
  gender: "FEMALE",
  timezone: "Asia/Seoul",
  birthDate: "1996-12-06",
  birthTime: "14:15",
  calendarType: "SOLAR",
  birthTimeUnknown: false,
} as const;

function restoreOptionalEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/payment-checkout/prepare", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/payment-checkout/prepare", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "{invalid-json",
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

function createAdapterFailure(
  code:
    | "PAYMENT_ORDER_INVALID_PROVIDER"
    | "PAYMENT_PRODUCT_NOT_PURCHASABLE"
    | "DB_UNAVAILABLE",
): ReadyPaymentOrderAdapterResult {
  return {
    ok: false,
    error: {
      code,
      messageKo: "safe failure",
    },
  };
}

function createReadyResultWithoutProviderOrderId(): ReadyPaymentOrderAdapterResult {
  return {
    ok: true,
    order: {
      paymentOrderId: "payment_order_checkout_missing_provider_order",
      productType: "saju_mbti_full",
      provider: "toss",
      amount: 1290,
      currency: "KRW",
      status: "ready",
      providerOrderId: null,
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

function expectErrorBody(
  body: Record<string, unknown>,
  code: string,
): void {
  expect(body.ok).toBe(false);
  expect(isRecord(body.error)).toBe(true);

  if (isRecord(body.error)) {
    expect(body.error.code).toBe(code);
    expect(typeof body.error.message).toBe("string");
  }
}

function expectReadyPaymentOrder(
  body: Record<string, unknown>,
  provider: PaymentProviderId,
): void {
  expect(isRecord(body.paymentOrder)).toBe(true);

  if (isRecord(body.paymentOrder)) {
    expect(body.paymentOrder).toMatchObject({
      productType: "saju_mbti_full",
      provider,
      amount: 1290,
      currency: "KRW",
      status: "ready",
    });
  }
}

function expectPreparedCheckoutSession(
  body: Record<string, unknown>,
  provider: PaymentProviderId,
): void {
  expect(isRecord(body.checkoutSession)).toBe(true);

  if (isRecord(body.checkoutSession)) {
    expect(body.checkoutSession).toMatchObject({
      productType: "saju_mbti_full",
      productLabelKo: "사주×MBTI 전체 리포트",
      provider,
      amount: 1290,
      currency: "KRW",
      status: "prepared",
      checkoutMode: "provider_redirect_pending",
    });
    expect(isRecord(body.checkoutSession.providerPayload)).toBe(true);

    if (isRecord(body.checkoutSession.providerPayload)) {
      expect(body.checkoutSession.providerPayload.provider).toBe(provider);
    }
  }
}

const mockCreateReadyPaymentOrder = vi.mocked(createReadyPaymentOrder);

describe("payment checkout prepare route", () => {
  beforeEach(() => {
    mockCreateReadyPaymentOrder.mockReset();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    restoreOptionalEnv(
      "PAYMENT_CHECKOUT_PREPARE_API_ENABLED",
      originalCheckoutPrepareApiEnabled,
    );
    restoreOptionalEnv("SUPABASE_URL", originalSupabaseUrl);
    restoreOptionalEnv("SUPABASE_ANON_KEY", originalSupabaseAnonKey);
  });

  it("returns 404 when disabled by default", async () => {
    delete process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED;

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(404);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_API_DISABLED");
    expect(mockCreateReadyPaymentOrder).not.toHaveBeenCalled();
  });

  it("prepares Toss checkout draft when enabled", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
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
    expectReadyPaymentOrder(body, "toss");
    expectPreparedCheckoutSession(body, "toss");
    expect(mockCreateReadyPaymentOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        productType: "saju_mbti_full",
        provider: "toss",
        inputSnapshot,
      }),
    );
  });

  it("prepares KakaoPay checkout draft when enabled", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
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
    expectReadyPaymentOrder(body, "kakao_pay");
    expectPreparedCheckoutSession(body, "kakao_pay");

    if (
      isRecord(body.checkoutSession) &&
      isRecord(body.checkoutSession.providerPayload)
    ) {
      expect(body.checkoutSession.providerPayload).toMatchObject({
        provider: "kakao_pay",
        itemName: "사주×MBTI 전체 리포트",
        quantity: 1,
        totalAmount: 1290,
        currency: "KRW",
      });
    }
  });

  it("returns 400 when provider is missing", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";

    const response = await POST(
      createJsonRequest({
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST");
    expect(mockCreateReadyPaymentOrder).not.toHaveBeenCalled();
  });

  it("returns 400 for unsupported provider", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(
      createAdapterFailure("PAYMENT_ORDER_INVALID_PROVIDER"),
    );

    const response = await POST(
      createJsonRequest({
        provider: "payco",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST");
  });

  it("returns 400 for disabled future product", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(
      createAdapterFailure("PAYMENT_PRODUCT_NOT_PURCHASABLE"),
    );

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "daewoon",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST");
  });

  it("returns 400 when input snapshot is missing or not an object", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";

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

  it("returns 400 for invalid JSON", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";

    const response = await POST(createInvalidJsonRequest());
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST");
  });

  it("defaults omitted product type to saju mbti full", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("toss"));

    await POST(
      createJsonRequest({
        provider: "toss",
        inputSnapshot,
      }),
    );

    expect(mockCreateReadyPaymentOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        productType: "saju_mbti_full",
      }),
    );
  });

  it("ignores client supplied amount currency and payment statuses", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("toss"));

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
        amount: 1,
        currency: "USD",
        status: "paid",
        paymentStatus: "paid",
      }),
    );
    const body = await readJsonObject(response);
    const call = mockCreateReadyPaymentOrder.mock.calls[0]?.[0];

    expect(response.status).toBe(200);
    expectReadyPaymentOrder(body, "toss");
    expectPreparedCheckoutSession(body, "toss");
    expect(call).toBeDefined();
    expect(call).not.toHaveProperty("amount");
    expect(call).not.toHaveProperty("currency");
    expect(call).not.toHaveProperty("status");
    expect(call).not.toHaveProperty("paymentStatus");
  });

  it("returns 500 for adapter failures with safe error body", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(
      createAdapterFailure("DB_UNAVAILABLE"),
    );

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(500);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED");
  });

  it("returns 500 if checkout session cannot be prepared from adapter result", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(
      createReadyResultWithoutProviderOrderId(),
    );

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(500);
    expectErrorBody(body, "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED");
  });

  it("success response contains no snapshots provider payment id report data token hash or provider url fields", async () => {
    process.env.PAYMENT_CHECKOUT_PREPARE_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("toss"));

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);
    const serialized = JSON.stringify(body);
    const blockedMarkers = [
      "inputSnapshot",
      "input" + "_snapshot",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "reportSnapshot",
      "report" + "_snapshot",
      "share" + "Token",
      "access" + "TokenHash",
      "checkout" + "Url",
      "next" + "_redirect" + "_pc" + "_url",
      "next" + "_redirect" + "_mobile" + "_url",
      "approval" + "_url",
      "cancel" + "_url",
      "fail" + "_url",
    ];

    expect(response.status).toBe(200);

    for (const marker of blockedMarkers) {
      expect(serialized).not.toContain(marker);
    }
  });

  it("source stays scoped to checkout preparation only", () => {
    const requiredMarkers = [
      "PAYMENT_CHECKOUT_PREPARE_API_ENABLED",
      "PAYMENT_CHECKOUT_PREPARE_API_DISABLED",
      "preparePaymentCheckoutSession",
      "createReadyPaymentOrder",
      "checkoutSession",
      "providerPayload",
      "saju_mbti_full",
    ];
    const blockedMarkers = [
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "secret" + "Key",
      "client" + "Secret",
      "admin" + "Key",
      "c" + "id",
      "checkout" + "Url",
      "next" + "_redirect",
      "approval" + "_url",
      "cancel" + "_url",
      "fail" + "_url",
      "/api/" + "reports/unlock",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "grant " + "insert",
      "create " + "policy",
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

    for (const marker of requiredMarkers) {
      expect(routeSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });

  it("does not alter existing ready order or preview report routes", () => {
    expect(createReadyRouteSource).toContain("PAYMENT_READY_ORDER_API_ENABLED");
    expect(createReadyRouteSource).not.toContain(
      "PAYMENT_CHECKOUT_PREPARE_API_ENABLED",
    );
    expect(createReportRouteSource).toContain('mode: "preview_memory"');
    expect(createReportRouteSource).not.toContain("payment-checkout/prepare");
    expect(createReportRouteSource).not.toContain(
      "PAYMENT_CHECKOUT_PREPARE_API_ENABLED",
    );
  });
});
