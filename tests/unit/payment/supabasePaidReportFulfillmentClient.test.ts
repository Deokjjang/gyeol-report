import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type { FulfillPaidPaymentOrderInput } from "../../../src/lib/payment/paidReportFulfillmentTypes";
import {
  createSupabasePaidReportFulfillmentClient,
  type PaidReportFulfillmentRpcExecutor,
  type PaidReportFulfillmentRpcResultRow,
} from "../../../src/lib/payment/supabasePaidReportFulfillmentClient";

const createdAt = "2026-06-11T12:00:00.000Z";
const updatedAt = "2026-06-11T12:00:01.000Z";

function createInput(
  overrides: Partial<FulfillPaidPaymentOrderInput> = {},
): FulfillPaidPaymentOrderInput {
  return {
    providerOrderId: "provider_order_fulfillment_client_test",
    ...overrides,
  };
}

function createRow(
  overrides: Partial<PaidReportFulfillmentRpcResultRow> = {},
): PaidReportFulfillmentRpcResultRow {
  return {
    payment_order_id: "payment_order_fulfillment_client_test",
    provider_order_id: "provider_order_fulfillment_client_test",
    report_id: "report_fulfillment_client_test",
    product_type: "saju_mbti_full",
    status: "paid",
    amount: 990,
    currency: "KRW",
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase paid report fulfillment client", () => {
  it("calls fulfill_paid_saju_mbti_report RPC with expected argument names", async () => {
    const calls: Array<{
      readonly functionName: string;
      readonly args: Record<string, unknown>;
    }> = [];
    const rpcExecutor: PaidReportFulfillmentRpcExecutor = async (
      functionName,
      args,
    ) => {
      calls.push({ functionName, args });

      return {
        data: [createRow()],
        error: null,
      };
    };
    const client = createSupabasePaidReportFulfillmentClient({ rpcExecutor });
    const result = await client.fulfillPaidPaymentOrder(createInput());

    expect(result.ok).toBe(true);
    expect(calls).toEqual([
      {
        functionName: "fulfill_paid_saju_mbti_report",
        args: {
          p_provider_order_id: "provider_order_fulfillment_client_test",
        },
      },
    ]);
  });

  it("maps returned safe row fields", async () => {
    const client = createSupabasePaidReportFulfillmentClient({
      rpcExecutor: async () => ({ data: [createRow()], error: null }),
    });
    const result = await client.fulfillPaidPaymentOrder(createInput());

    expect(result).toEqual({
      ok: true,
      data: {
        paymentOrderId: "payment_order_fulfillment_client_test",
        providerOrderId: "provider_order_fulfillment_client_test",
        reportId: "report_fulfillment_client_test",
        productType: "saju_mbti_full",
        status: "paid",
        amount: 990,
        currency: "KRW",
        createdAt,
        updatedAt,
      },
    });
  });

  it("rejects ready orders through RPC error mapping", async () => {
    const client = createSupabasePaidReportFulfillmentClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "P0001",
          message: "PAYMENT_ORDER_NOT_PAID",
        },
      }),
    });
    const result = await client.fulfillPaidPaymentOrder(createInput());

    expect(result).toEqual({
      ok: false,
      code: "PAYMENT_ORDER_NOT_PAID",
      messageKo: "Supabase paid report fulfillment RPC failed.",
    });
  });

  it("rejects wrong amount or product through invalid context mapping", async () => {
    const client = createSupabasePaidReportFulfillmentClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "P0001",
          message: "PAYMENT_ORDER_INVALID_CONTEXT",
        },
      }),
    });
    const result = await client.fulfillPaidPaymentOrder(createInput());

    expect(result).toEqual({
      ok: false,
      code: "PAYMENT_ORDER_INVALID_CONTEXT",
      messageKo: "Supabase paid report fulfillment RPC failed.",
    });
  });

  it("rejects missing row", async () => {
    const client = createSupabasePaidReportFulfillmentClient({
      rpcExecutor: async () => ({ data: [], error: null }),
    });
    const result = await client.fulfillPaidPaymentOrder(createInput());

    expect(result).toEqual({
      ok: false,
      code: "PAID_REPORT_FULFILLMENT_RPC_VALIDATION_FAILED",
      messageKo: "Supabase paid report fulfillment RPC returned invalid data.",
    });
  });

  it("does not expose private fields in result", async () => {
    const client = createSupabasePaidReportFulfillmentClient({
      rpcExecutor: async () => ({
        data: [
          {
            ...createRow(),
            ["input" + "_snapshot"]: { hidden: true },
            ["provider" + "_payment" + "_id"]: "hidden_provider_payment_id",
            ["access" + "_token" + "_hash"]: "hidden_access_hash",
            ["share" + "Token"]: "hidden_share_token",
          },
        ],
        error: null,
      }),
    });
    const result = await client.fulfillPaidPaymentOrder(createInput());
    const serialized = JSON.stringify(result);

    expect(result.ok).toBe(true);
    expect(serialized).not.toContain("hidden_provider_payment_id");
    expect(serialized).not.toContain("input" + "_snapshot");
    expect(serialized).not.toContain("inputSnapshot");
    expect(serialized).not.toContain("hidden_access_hash");
    expect(serialized).not.toContain("hidden_share_token");
  });

  it("source uses RPC only and avoids report content or unsafe exposure", () => {
    const source = readSource(
      "src/lib/payment/supabasePaidReportFulfillmentClient.ts",
    );
    const requiredMarkers = [
      ".rpc(",
      "fulfill_paid_saju_mbti_report",
      "p_provider_order_id",
    ];
    const blockedMarkers = [
      ".from(",
      "." + "update(",
      "createReport",
      "generateReport",
      "confirmTossPayment",
      "/v1/" + "payments/confirm",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "provider" + "PaymentId",
    ];

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
