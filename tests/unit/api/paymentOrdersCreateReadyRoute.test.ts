import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../../../src/app/api/payment-orders/create-ready/route";
import { createReadyPaymentOrder } from "../../../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import type { ReadyPaymentOrderAdapterResult } from "../../../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import type { PaymentProviderId } from "../../../src/lib/payment/paymentProviderTypes";

vi.mock("../../../src/lib/payment/supabaseReadyPaymentOrderAdapter", () => ({
  createReadyPaymentOrder: vi.fn(),
}));

const routeSource = readFileSync(
  join(process.cwd(), "src/app/api/payment-orders/create-ready/route.ts"),
  "utf8",
);
const createRouteSource = readFileSync(
  join(process.cwd(), "src/app/api/reports/create/route.ts"),
  "utf8",
);

const originalReadyOrderApiEnabled =
  process.env.PAYMENT_READY_ORDER_API_ENABLED;
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
  return new Request("http://localhost/api/payment-orders/create-ready", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/payment-orders/create-ready", {
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
      paymentOrderId: `payment_order_route_${provider}`,
      productType: "saju_mbti_full",
      provider,
      amount: 990,
      currency: "KRW",
      status: "ready",
      providerOrderId: `provider_order_route_${provider}`,
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

function expectSuccessPaymentOrder(
  body: Record<string, unknown>,
  provider: PaymentProviderId,
): void {
  expect(body.ok).toBe(true);
  expect(isRecord(body.paymentOrder)).toBe(true);

  if (isRecord(body.paymentOrder)) {
    expect(body.paymentOrder).toMatchObject({
      productType: "saju_mbti_full",
      provider,
      amount: 990,
      currency: "KRW",
      status: "ready",
    });
  }
}

const mockCreateReadyPaymentOrder = vi.mocked(createReadyPaymentOrder);

describe("payment orders create ready route", () => {
  beforeEach(() => {
    mockCreateReadyPaymentOrder.mockReset();
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
  });

  afterEach(() => {
    restoreOptionalEnv(
      "PAYMENT_READY_ORDER_API_ENABLED",
      originalReadyOrderApiEnabled,
    );
    restoreOptionalEnv("SUPABASE_URL", originalSupabaseUrl);
    restoreOptionalEnv("SUPABASE_ANON_KEY", originalSupabaseAnonKey);
  });

  it("returns 404 when disabled by default", async () => {
    delete process.env.PAYMENT_READY_ORDER_API_ENABLED;

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(404);
    expectErrorBody(body, "PAYMENT_READY_ORDER_API_DISABLED");
    expect(mockCreateReadyPaymentOrder).not.toHaveBeenCalled();
  });

  it("creates a ready order for Toss when enabled", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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
    expectSuccessPaymentOrder(body, "toss");
    expect(mockCreateReadyPaymentOrder).toHaveBeenCalledTimes(1);
    expect(mockCreateReadyPaymentOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        productType: "saju_mbti_full",
        provider: "toss",
        inputSnapshot,
      }),
    );
  });

  it("creates a ready order for KakaoPay when enabled", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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
    expectSuccessPaymentOrder(body, "kakao_pay");
  });

  it("returns 400 when provider is missing", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";

    const response = await POST(
      createJsonRequest({
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "PAYMENT_READY_ORDER_INVALID_REQUEST");
    expect(mockCreateReadyPaymentOrder).not.toHaveBeenCalled();
  });

  it("returns 400 for unsupported provider", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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
    expectErrorBody(body, "PAYMENT_READY_ORDER_INVALID_REQUEST");
  });

  it("returns 400 for disabled future product", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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
    expectErrorBody(body, "PAYMENT_READY_ORDER_INVALID_REQUEST");
  });

  it("returns 400 when input snapshot is missing or not an object", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";

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
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
    );
    expectErrorBody(
      await readJsonObject(nonObjectResponse),
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
    );
    expect(mockCreateReadyPaymentOrder).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";

    const response = await POST(createInvalidJsonRequest());
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "PAYMENT_READY_ORDER_INVALID_REQUEST");
  });

  it("defaults omitted product type to saju mbti full", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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

  it("ignores client supplied amount currency and status", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
    mockCreateReadyPaymentOrder.mockResolvedValue(createReadyResult("toss"));

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
        amount: 1,
        currency: "USD",
        status: "paid",
      }),
    );
    const body = await readJsonObject(response);
    const call = mockCreateReadyPaymentOrder.mock.calls[0]?.[0];

    expect(response.status).toBe(200);
    expectSuccessPaymentOrder(body, "toss");
    expect(call).toBeDefined();
    expect(call).not.toHaveProperty("amount");
    expect(call).not.toHaveProperty("currency");
    expect(call).not.toHaveProperty("status");
  });

  it("returns 500 for adapter storage failures with safe error body", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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
    expectErrorBody(body, "PAYMENT_READY_ORDER_CREATE_FAILED");
  });

  it("success response exposes only safe ready order fields", async () => {
    process.env.PAYMENT_READY_ORDER_API_ENABLED = "1";
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

    expect(response.status).toBe(200);
    expect(serialized).not.toContain("inputSnapshot");
    expect(serialized).not.toContain("input_snapshot");
    expect(serialized).not.toContain("provider" + "Payment" + "Id");
    expect(serialized).not.toContain("provider" + "_payment" + "_id");
    expect(serialized).not.toContain("reportSnapshot");
    expect(serialized).not.toContain("report" + "_snapshot");
    expect(serialized).not.toContain("share" + "Token");
    expect(serialized).not.toContain("access" + "TokenHash");
  });

  it("source stays scoped to ready order creation only", () => {
    const requiredMarkers = [
      "PAYMENT_READY_ORDER_API_ENABLED",
      "PAYMENT_READY_ORDER_API_DISABLED",
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
      "PAYMENT_READY_ORDER_CREATE_FAILED",
      "createReadyPaymentOrder",
      "createSupabaseReadyPaymentOrderClient",
      "paymentOrder",
      "saju_mbti_full",
    ];
    const blockedMarkers = [
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "buildReportPersistencePayload",
      "." + "in" + "sert(",
      "from(" + "\"payment_orders\"",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "/api/" + "reports/unlock",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "grant " + "insert",
      "create " + "policy",
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

  it("does not alter preview report creation", () => {
    expect(createRouteSource).toContain('mode: "preview_memory"');
    expect(createRouteSource).not.toContain("payment-orders/create-ready");
    expect(createRouteSource).not.toContain("PAYMENT_READY_ORDER_API_ENABLED");
  });
});
