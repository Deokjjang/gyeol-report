import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { markTossPaymentOrderPaid } from "../../../src/lib/payment/supabaseTossPaymentOrderPaidAdapter";
import { POST } from "../../../src/app/api/payments/toss/confirm/route";

vi.mock("../../../src/lib/payment/supabaseTossPaymentOrderPaidAdapter", () => ({
  markTossPaymentOrderPaid: vi.fn(),
}));

const originalConfirmApiEnabled = process.env.TOSS_CONFIRM_API_ENABLED;
const originalTossSecretKey = process.env.TOSS_SECRET_KEY;
const originalSupabaseUrl = process.env.SUPABASE_URL;
const originalSupabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const secretKey = "test_sk_route_confirm_secret";
const mockMarkTossPaymentOrderPaid = vi.mocked(markTossPaymentOrderPaid);

function restoreOptionalEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function createJsonRequest(body: unknown): Request {
  return new Request("http://localhost/api/payments/toss/confirm", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/payments/toss/confirm", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: "{invalid-json",
  });
}

function createProviderSuccessResponse(
  overrides: Record<string, unknown> = {},
): Response {
  return new Response(
    JSON.stringify({
      orderId: "provider_order_route_confirm",
      totalAmount: 990,
      currency: "KRW",
      status: "DONE",
      method: "카드",
      approvedAt: "2026-06-11T12:00:00+09:00",
      rawProviderOnlyField: "must_not_return",
      input_snapshot: {
        birthDate: "1996-12-06",
      },
      provider_payment_id: "provider_payment_raw_id",
      reportSnapshot: {
        result: "must_not_return",
      },
      ...overrides,
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
      },
    },
  );
}

function createPaidOrder() {
  return {
    paymentOrderId: "payment_order_route_confirm",
    providerOrderId: "provider_order_route_confirm",
    productType: "saju_mbti_full",
    provider: "toss",
    amount: 990,
    currency: "KRW",
    status: "paid",
    paidAt: "2026-06-11T12:00:00+09:00",
    reportId: null,
    createdAt: "2026-06-11T11:59:00+09:00",
    updatedAt: "2026-06-11T12:00:01+09:00",
  } as const;
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

function createValidRequest(): Request {
  return createJsonRequest({
    paymentKey: "pay_route_confirm_key",
    orderId: "provider_order_route_confirm",
    amount: 990,
  });
}

describe("Toss confirm route", () => {
  beforeEach(() => {
    mockMarkTossPaymentOrderPaid.mockReset();
    mockMarkTossPaymentOrderPaid.mockResolvedValue({
      ok: true,
      order: createPaidOrder(),
    });
    delete process.env.TOSS_CONFIRM_API_ENABLED;
    delete process.env.TOSS_SECRET_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
  });

  afterEach(() => {
    restoreOptionalEnv("TOSS_CONFIRM_API_ENABLED", originalConfirmApiEnabled);
    restoreOptionalEnv("TOSS_SECRET_KEY", originalTossSecretKey);
    restoreOptionalEnv("SUPABASE_URL", originalSupabaseUrl);
    restoreOptionalEnv("SUPABASE_ANON_KEY", originalSupabaseAnonKey);
    vi.unstubAllGlobals();
  });

  it("is disabled by default", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createValidRequest());
    const body = await readJsonObject(response);

    expect(response.status).toBe(404);
    expectErrorBody(body, "TOSS_CONFIRM_API_DISABLED");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
  });

  it("returns a safe config error when enabled without a secret", async () => {
    const fetchMock = vi.fn();
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createValidRequest());
    const body = await readJsonObject(response);
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(500);
    expectErrorBody(body, "TOSS_CONFIRM_CONFIG_MISSING");
    expect(serialized).not.toContain("TOSS_SECRET_KEY");
    expect(fetchMock).not.toHaveBeenCalled();
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects invalid JSON body", async () => {
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;

    const response = await POST(createInvalidJsonRequest());
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "TOSS_CONFIRM_INVALID_REQUEST");
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects missing paymentKey", async () => {
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;

    const response = await POST(
      createJsonRequest({
        orderId: "provider_order_route_confirm",
        amount: 990,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "TOSS_CONFIRM_INVALID_REQUEST");
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects missing orderId", async () => {
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;

    const response = await POST(
      createJsonRequest({
        paymentKey: "pay_route_confirm_key",
        amount: 990,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "TOSS_CONFIRM_INVALID_REQUEST");
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
  });

  it("rejects amount mismatch", async () => {
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;

    const response = await POST(
      createJsonRequest({
        paymentKey: "pay_route_confirm_key",
        orderId: "provider_order_route_confirm",
        amount: 1290,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(400);
    expectErrorBody(body, "TOSS_CONFIRM_AMOUNT_MISMATCH");
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
  });

  it("calls Toss confirm API, marks the order paid, and returns safe result", async () => {
    const fetchMock = vi.fn(async () => createProviderSuccessResponse());
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createValidRequest());
    const body = await readJsonObject(response);
    const serialized = JSON.stringify(body);
    const fetchInit = fetchMock.mock.calls[0]?.[1] ?? {};

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "https://api.tosspayments.com/v1/payments/confirm",
    );
    expect(new Headers(fetchInit.headers).get("authorization")).toBe(
      `Basic ${Buffer.from(`${secretKey}:`, "utf8").toString("base64")}`,
    );
    expect(isRecord(body.confirm)).toBe(true);
    expect(isRecord(body.paymentOrder)).toBe(true);

    if (isRecord(body.confirm)) {
      expect(body.confirm).toMatchObject({
        provider: "toss",
        paymentKeyReceived: true,
        orderId: "provider_order_route_confirm",
        amount: 990,
        status: "DONE",
        method: "카드",
        approvedAt: "2026-06-11T12:00:00+09:00",
        rawPaymentStatus: "DONE",
      });
    }

    if (isRecord(body.paymentOrder)) {
      expect(body.paymentOrder).toMatchObject({
        paymentOrderId: "payment_order_route_confirm",
        providerOrderId: "provider_order_route_confirm",
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 990,
        currency: "KRW",
        status: "paid",
        paidAt: "2026-06-11T12:00:00+09:00",
        reportId: null,
      });
    }

    expect(mockMarkTossPaymentOrderPaid).toHaveBeenCalledTimes(1);
    expect(mockMarkTossPaymentOrderPaid).toHaveBeenCalledWith(
      expect.objectContaining({
        providerOrderId: "provider_order_route_confirm",
        providerPaymentId: "pay_route_confirm_key",
        amount: 990,
        currency: "KRW",
        paidAt: "2026-06-11T12:00:00+09:00",
        client: expect.any(Object),
      }),
    );
    expect(serialized).not.toContain(secretKey);
    expect(serialized).not.toContain("pay_route_confirm_key");
    expect(serialized).not.toContain("providerPaymentId");
    expect(serialized).not.toContain("must_not_return");
    expect(serialized).not.toContain("provider_payment_raw_id");
    expect(serialized).not.toContain("input_snapshot");
    expect(serialized).not.toContain("reportSnapshot");
    expect(serialized).not.toContain("shareToken");
    expect(serialized).not.toContain("accessTokenHash");
  });

  it("does not mark paid when Toss status is not DONE", async () => {
    const fetchMock = vi.fn(async () =>
      createProviderSuccessResponse({
        status: "WAITING_FOR_DEPOSIT",
      }),
    );
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createValidRequest());
    const body = await readJsonObject(response);

    expect(response.status).toBe(409);
    expectErrorBody(body, "TOSS_PAYMENT_NOT_DONE");
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();

    if (isRecord(body.error) && isRecord(body.error.context)) {
      expect(body.error.context).toMatchObject({
        orderId: "provider_order_route_confirm",
        amount: 990,
        confirmStatus: "WAITING_FOR_DEPOSIT",
        rawPaymentStatus: "WAITING_FOR_DEPOSIT",
      });
    }
  });

  it("returns safe failure when mark paid fails", async () => {
    const fetchMock = vi.fn(async () => createProviderSuccessResponse());
    mockMarkTossPaymentOrderPaid.mockResolvedValue({
      ok: false,
      error: {
        code: "PAYMENT_ORDER_PAID_CONFLICT",
        messageKo: "safe mark paid failure",
      },
    });
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createValidRequest());
    const body = await readJsonObject(response);
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(500);
    expectErrorBody(body, "PAYMENT_MARK_PAID_FAILED");
    expect(mockMarkTossPaymentOrderPaid).toHaveBeenCalledTimes(1);
    expect(serialized).toContain("provider_order_route_confirm");
    expect(serialized).toContain("DONE");
    expect(serialized).not.toContain("pay_route_confirm_key");
    expect(serialized).not.toContain("providerPaymentId");
    expect(serialized).not.toContain("safe mark paid failure");
  });

  it("does not expose provider raw error or secret values", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(
        JSON.stringify({
          code: "INVALID_REQUEST",
          message: `provider failed with ${secretKey}`,
          rawBody: "must_not_return",
        }),
        {
          status: 400,
          headers: {
            "content-type": "application/json",
          },
        },
      ),
    );
    process.env.TOSS_CONFIRM_API_ENABLED = "1";
    process.env.TOSS_SECRET_KEY = secretKey;
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createValidRequest());
    const body = await readJsonObject(response);
    const serialized = JSON.stringify(body);

    expect(response.status).toBe(502);
    expectErrorBody(body, "TOSS_CONFIRM_PROVIDER_ERROR");
    expect(mockMarkTossPaymentOrderPaid).not.toHaveBeenCalled();
    expect(serialized).not.toContain(secretKey);
    expect(serialized).not.toContain("must_not_return");
  });

  it("source wires confirm to paid transition without report creation or share behavior", () => {
    const source = readFileSync(
      join(process.cwd(), "src/app/api/payments/toss/confirm/route.ts"),
      "utf8",
    );
    const requiredMarkers = [
      "TOSS_CONFIRM_API_ENABLED",
      "TOSS_CONFIRM_API_DISABLED",
      "TOSS_CONFIRM_CONFIG_MISSING",
      "TOSS_CONFIRM_INVALID_REQUEST",
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "TOSS_PAYMENT_NOT_DONE",
      "PAYMENT_MARK_PAID_FAILED",
      "TOSS_SECRET_KEY",
      "confirmTossPayment",
      "markTossPaymentOrderPaid",
      "await markTossPaymentOrderPaid",
      "createSupabaseTossPaymentOrderPaidClient",
      "paymentOrder",
      "TOSS_CONFIRM_REQUIRED_AMOUNT",
      "paymentKey",
      "orderId",
      "amount",
    ];
    const blockedMarkers = [
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "createReport",
      "generateReport",
      "." + "insert(",
      "." + "update(",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "provider" + "_payment" + "_id",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
