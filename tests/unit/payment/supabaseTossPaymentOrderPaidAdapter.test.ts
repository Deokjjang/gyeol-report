import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { markTossPaymentOrderPaid } from "../../../src/lib/payment/supabaseTossPaymentOrderPaidAdapter";
import type { SupabaseTossPaymentOrderPaidRpcClient } from "../../../src/lib/payment/supabaseTossPaymentOrderPaidClient";
import type {
  MarkTossPaymentOrderPaidInput,
  MarkTossPaymentOrderPaidResult,
} from "../../../src/lib/payment/tossPaymentOrderPaidTypes";

const paidAt = "2026-06-11T12:00:00.000Z";
const createdAt = "2026-06-11T11:59:00.000Z";
const updatedAt = "2026-06-11T12:00:01.000Z";

function createPaidResult(
  input: MarkTossPaymentOrderPaidInput,
): MarkTossPaymentOrderPaidResult {
  return {
    paymentOrderId: "payment_order_paid_adapter_test",
    providerOrderId: input.providerOrderId,
    productType: "saju_mbti_full",
    provider: "toss",
    amount: input.amount,
    currency: input.currency,
    status: "paid",
    paidAt: input.paidAt ?? paidAt,
    reportId: null,
    createdAt,
    updatedAt,
  };
}

function createFakeClient(): {
  readonly calls: MarkTossPaymentOrderPaidInput[];
  readonly client: SupabaseTossPaymentOrderPaidRpcClient;
} {
  const calls: MarkTossPaymentOrderPaidInput[] = [];

  return {
    calls,
    client: {
      async markTossPaymentOrderPaid(input) {
        calls.push(input);

        return {
          ok: true,
          data: createPaidResult(input),
        };
      },
    },
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase Toss payment order paid adapter", () => {
  it("marks paid for a valid Toss order", async () => {
    const fake = createFakeClient();
    const result = await markTossPaymentOrderPaid({
      providerOrderId: "provider_order_paid_adapter_test",
      providerPaymentId: "toss_payment_paid_adapter_test",
      amount: 990,
      currency: "KRW",
      paidAt,
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: true,
      order: {
        providerOrderId: "provider_order_paid_adapter_test",
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 990,
        currency: "KRW",
        status: "paid",
        paidAt,
      },
    });
    expect(fake.calls).toEqual([
      {
        providerOrderId: "provider_order_paid_adapter_test",
        providerPaymentId: "toss_payment_paid_adapter_test",
        amount: 990,
        currency: "KRW",
        paidAt,
      },
    ]);
  });

  it("requires providerOrderId", async () => {
    const fake = createFakeClient();
    const result = await markTossPaymentOrderPaid({
      providerOrderId: "",
      providerPaymentId: "toss_payment_paid_adapter_test",
      amount: 990,
      currency: "KRW",
      client: fake.client,
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "TOSS_PAYMENT_ORDER_PAID_INVALID_REQUEST",
        messageKo: "Toss 결제 주문 paid 전환 요청이 올바르지 않습니다.",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("requires providerPaymentId", async () => {
    const fake = createFakeClient();
    const result = await markTossPaymentOrderPaid({
      providerOrderId: "provider_order_paid_adapter_test",
      providerPaymentId: "",
      amount: 990,
      currency: "KRW",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_PAYMENT_ORDER_PAID_INVALID_REQUEST",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("enforces amount 990", async () => {
    const fake = createFakeClient();
    const result = await markTossPaymentOrderPaid({
      providerOrderId: "provider_order_paid_adapter_test",
      providerPaymentId: "toss_payment_paid_adapter_test",
      amount: 1290,
      currency: "KRW",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_PAYMENT_ORDER_PAID_AMOUNT_MISMATCH",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("enforces currency KRW", async () => {
    const fake = createFakeClient();
    const result = await markTossPaymentOrderPaid({
      providerOrderId: "provider_order_paid_adapter_test",
      providerPaymentId: "toss_payment_paid_adapter_test",
      amount: 990,
      currency: "USD",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: false,
      error: {
        code: "TOSS_PAYMENT_ORDER_PAID_CURRENCY_MISMATCH",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("returns status paid without provider payment id", async () => {
    const fake = createFakeClient();
    const result = await markTossPaymentOrderPaid({
      providerOrderId: "provider_order_paid_adapter_test",
      providerPaymentId: "toss_payment_paid_adapter_test",
      amount: 990,
      currency: "KRW",
      client: fake.client,
    });
    const serialized = JSON.stringify(result);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.order.status).toBe("paid");
      expect(Object.keys(result.order)).not.toContain("providerPaymentId");
    }

    expect(serialized).not.toContain("toss_payment_paid_adapter_test");
  });

  it("source does not create reports issue links or call Toss confirm", () => {
    const source = [
      readSource("src/lib/payment/supabaseTossPaymentOrderPaidAdapter.ts"),
      readSource("src/lib/payment/supabaseTossPaymentOrderPaidClient.ts"),
    ].join("\n");
    const blockedMarkers = [
      "confirmTossPayment",
      "/v1/" + "payments/confirm",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "buildReportPersistencePayload",
      "/api/" + "reports/unlock",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
