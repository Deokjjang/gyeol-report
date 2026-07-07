import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
  confirmTossPayment,
  TOSS_CONFIRM_API_URL,
  TOSS_CONFIRM_REQUIRED_AMOUNT,
} from "../../../src/lib/payment/tossConfirmClient";

const secretKey = "test_sk_toss_confirm_secret";
const request = {
  secretKey,
  paymentKey: "pay_confirm_test_key",
  orderId: "provider_order_confirm_test",
  amount: 1290,
} as const;

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
    },
  });
}

function createSuccessFetch(body?: Record<string, unknown>) {
  return vi.fn(async () =>
    createJsonResponse(
      body ?? {
        orderId: request.orderId,
        totalAmount: 1290,
        currency: "KRW",
        status: "DONE",
        method: "카드",
        approvedAt: "2026-06-11T12:00:00+09:00",
      },
    ),
  );
}

function readHeader(init: RequestInit, name: string): string | null {
  return new Headers(init.headers).get(name);
}

function readRequestBody(init: RequestInit): unknown {
  if (typeof init.body !== "string") {
    throw new Error("Expected JSON string body.");
  }

  return JSON.parse(init.body) as unknown;
}

function expectFetchNotCalled(fetchImpl: ReturnType<typeof createSuccessFetch>) {
  expect(fetchImpl).not.toHaveBeenCalled();
}

describe("Toss confirm client", () => {
  it("requires a secret key", async () => {
    const fetchImpl = createSuccessFetch();
    const result = await confirmTossPayment({
      ...request,
      secretKey: "",
      fetchImpl,
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_CONFIG_MISSING",
        message: "Toss confirm configuration is missing.",
      },
    });
    expectFetchNotCalled(fetchImpl);
  });

  it("requires paymentKey", async () => {
    const fetchImpl = createSuccessFetch();
    const result = await confirmTossPayment({
      ...request,
      paymentKey: "",
      fetchImpl,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_INVALID_REQUEST",
      },
    });
    expectFetchNotCalled(fetchImpl);
  });

  it("requires orderId", async () => {
    const fetchImpl = createSuccessFetch();
    const result = await confirmTossPayment({
      ...request,
      orderId: "",
      fetchImpl,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_INVALID_REQUEST",
      },
    });
    expectFetchNotCalled(fetchImpl);
  });

  it("requires amount 1290", async () => {
    const fetchImpl = createSuccessFetch();
    const result = await confirmTossPayment({
      ...request,
      amount: 990,
      fetchImpl,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_AMOUNT_MISMATCH",
      },
    });
    expectFetchNotCalled(fetchImpl);
  });

  it("calls the Toss confirm API with POST Basic auth and request body", async () => {
    const fetchImpl = createSuccessFetch();
    const result = await confirmTossPayment({
      ...request,
      fetchImpl,
    });
    const fetchCall = fetchImpl.mock.calls[0];

    expect(result.ok).toBe(true);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(fetchCall?.[0]).toBe(TOSS_CONFIRM_API_URL);
    expect(fetchCall?.[1].method).toBe("POST");
    expect(readHeader(fetchCall?.[1] ?? {}, "authorization")).toBe(
      `Basic ${Buffer.from(`${secretKey}:`, "utf8").toString("base64")}`,
    );
    expect(readHeader(fetchCall?.[1] ?? {}, "content-type")).toBe(
      "application/json",
    );
    expect(readRequestBody(fetchCall?.[1] ?? {})).toEqual({
      paymentKey: request.paymentKey,
      orderId: request.orderId,
      amount: TOSS_CONFIRM_REQUIRED_AMOUNT,
    });
  });

  it("sanitizes success response", async () => {
    const fetchImpl = createSuccessFetch({
      orderId: request.orderId,
      totalAmount: 1290,
      currency: "KRW",
      status: "DONE",
      method: "간편결제",
      approvedAt: "2026-06-11T12:00:00+09:00",
      rawProviderField: "must_not_return",
    });
    const result = await confirmTossPayment({
      ...request,
      fetchImpl,
    });

    expect(result).toEqual({
      ok: true,
      confirm: {
        provider: "toss",
        paymentKeyReceived: true,
        orderId: request.orderId,
        amount: 1290,
        status: "DONE",
        method: "간편결제",
        approvedAt: "2026-06-11T12:00:00+09:00",
        rawPaymentStatus: "DONE",
      },
    });
    expect(JSON.stringify(result)).not.toContain("must_not_return");
    expect(JSON.stringify(result)).not.toContain(request.paymentKey);
  });

  it("rejects provider amount or currency mismatch", async () => {
    const amountFetch = createSuccessFetch({
      orderId: request.orderId,
      totalAmount: 990,
      currency: "KRW",
      status: "DONE",
    });
    const currencyFetch = createSuccessFetch({
      orderId: request.orderId,
      totalAmount: 1290,
      currency: "USD",
      status: "DONE",
    });

    await expect(
      confirmTossPayment({
        ...request,
        fetchImpl: amountFetch,
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_AMOUNT_MISMATCH",
      },
    });
    await expect(
      confirmTossPayment({
        ...request,
        fetchImpl: currencyFetch,
      }),
    ).resolves.toMatchObject({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_AMOUNT_MISMATCH",
      },
    });
  });

  it("handles Toss error response safely", async () => {
    const fetchImpl = vi.fn(async () =>
      createJsonResponse(
        {
          code: "PROVIDER_ERROR",
          message: `failed with ${secretKey} and ${request.paymentKey}`,
        },
        400,
      ),
    );
    const result = await confirmTossPayment({
      ...request,
      fetchImpl,
    });
    const serialized = JSON.stringify(result);

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_CONFIRM_PROVIDER_ERROR",
      },
    });
    expect(serialized).not.toContain(secretKey);
    expect(serialized).not.toContain(request.paymentKey);
  });

  it("does not expose the secret key in success or provider failure", async () => {
    const successResult = await confirmTossPayment({
      ...request,
      fetchImpl: createSuccessFetch(),
    });
    const failureResult = await confirmTossPayment({
      ...request,
      fetchImpl: vi.fn(async () =>
        createJsonResponse(
          {
            message: secretKey,
          },
          500,
        ),
      ),
    });

    expect(JSON.stringify(successResult)).not.toContain(secretKey);
    expect(JSON.stringify(failureResult)).not.toContain(secretKey);
  });

  it("source stays scoped to provider confirm only", () => {
    const source = [
      readFileSync(
        join(process.cwd(), "src/lib/payment/tossConfirmTypes.ts"),
        "utf8",
      ),
      readFileSync(
        join(process.cwd(), "src/lib/payment/tossConfirmClient.ts"),
        "utf8",
      ),
    ].join("\n");
    const requiredMarkers = [
      "TossConfirmRequest",
      "TossConfirmSafeResult",
      "/v1/payments/confirm",
      "Buffer.from",
      "paymentKey",
      "orderId",
      "amount",
      "1290",
    ];
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "mark" + "Paid",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "." + "insert(",
      "." + "update(",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
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
