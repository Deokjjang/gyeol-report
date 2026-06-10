import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { createReadyPaymentOrder } from "../../../src/lib/payment/supabaseReadyPaymentOrderAdapter";
import type {
  ReadyPaymentOrderRpcInput,
  ReadyPaymentOrderSafeRow,
  SupabaseReadyPaymentOrderRpcClient,
} from "../../../src/lib/payment/supabaseReadyPaymentOrderClient";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-01T00:00:01.000Z";
const inputSnapshot = {
  displayName: "READY_ADAPTER_TEST",
  birthDate: "1996-12-06",
} as const;

function createSafeRow(input: ReadyPaymentOrderRpcInput): ReadyPaymentOrderSafeRow {
  return {
    paymentOrderId: input.paymentOrderId,
    productType: input.productType,
    provider: input.provider,
    amount: input.amount,
    currency: input.currency,
    status: "ready",
    providerOrderId: input.providerOrderId ?? null,
    createdAt,
    updatedAt,
  };
}

function createFakeClient(): {
  readonly calls: ReadyPaymentOrderRpcInput[];
  readonly client: SupabaseReadyPaymentOrderRpcClient;
} {
  const calls: ReadyPaymentOrderRpcInput[] = [];

  return {
    calls,
    client: {
      async createReadyPaymentOrder(input) {
        calls.push(input);

        return {
          ok: true,
          data: createSafeRow(input),
        };
      },
    },
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("supabase ready payment order adapter", () => {
  it("creates ready order for saju mbti full with Toss", async () => {
    const fake = createFakeClient();
    const result = await createReadyPaymentOrder({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
      providerOrderId: "provider_order_ready_adapter_toss",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 990,
        currency: "KRW",
        status: "ready",
        providerOrderId: "provider_order_ready_adapter_toss",
      },
    });
    expect(fake.calls).toHaveLength(1);
    expect(fake.calls[0]?.paymentOrderId.startsWith("payment_order_")).toBe(true);
  });

  it("creates ready order for saju mbti full with KakaoPay", async () => {
    const fake = createFakeClient();
    const result = await createReadyPaymentOrder({
      productType: "saju_mbti_full",
      provider: "kakao_pay",
      inputSnapshot,
      providerOrderId: "provider_order_ready_adapter_kakao",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        productType: "saju_mbti_full",
        provider: "kakao_pay",
        amount: 990,
        currency: "KRW",
        status: "ready",
        providerOrderId: "provider_order_ready_adapter_kakao",
      },
    });
    expect(fake.calls[0]).toMatchObject({
      provider: "kakao_pay",
      amount: 990,
      currency: "KRW",
    });
  });

  it("uses server-side catalog amount and currency", async () => {
    const fake = createFakeClient();

    await createReadyPaymentOrder({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
      client: fake.client,
    });

    expect(fake.calls[0]).toMatchObject({
      amount: 990,
      currency: "KRW",
    });
  });

  it("rejects disabled future product before RPC", async () => {
    const fake = createFakeClient();
    const result = await createReadyPaymentOrder({
      productType: "daewoon",
      provider: "toss",
      inputSnapshot,
      client: fake.client,
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "PAYMENT_PRODUCT_NOT_PURCHASABLE",
        messageKo: "아직 결제할 수 없는 리포트 상품입니다.",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("rejects unsupported provider before RPC", async () => {
    const fake = createFakeClient();
    const result = await createReadyPaymentOrder({
      productType: "saju_mbti_full",
      provider: "payco",
      inputSnapshot,
      client: fake.client,
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "PAYMENT_ORDER_INVALID_PROVIDER",
        messageKo: "지원하지 않는 결제 수단입니다.",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("returns safe ready order view only", async () => {
    const fake = createFakeClient();
    const result = await createReadyPaymentOrder({
      productType: "saju_mbti_full",
      provider: "toss",
      inputSnapshot,
      client: fake.client,
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      const keys = Object.keys(result.order);

      expect(result.order.status).toBe("ready");
      expect(keys).not.toContain("inputSnapshot");
      expect(keys).not.toContain("provider" + "Payment" + "Id");
    }
  });

  it("source does not create reports issue links call payment APIs or insert directly", () => {
    const source = [
      readSource("src/lib/payment/supabaseReadyPaymentOrderAdapter.ts"),
      readSource("src/lib/payment/supabaseReadyPaymentOrderClient.ts"),
    ].join("\n");
    const rejectedMarkers = [
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "buildReportPersistencePayload",
      "from(" + "\"payment_orders\"",
      "." + "in" + "sert(",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "share" + "Token",
      "access" + "TokenHash",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
