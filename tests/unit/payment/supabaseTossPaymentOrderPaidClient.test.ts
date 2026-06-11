import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createSupabaseTossPaymentOrderPaidClient,
  type MarkTossPaymentOrderPaidRpcResultRow,
  type TossPaymentOrderPaidRpcExecutor,
} from "../../../src/lib/payment/supabaseTossPaymentOrderPaidClient";
import type { MarkTossPaymentOrderPaidInput } from "../../../src/lib/payment/tossPaymentOrderPaidTypes";

const paidAt = "2026-06-11T12:00:00.000Z";
const createdAt = "2026-06-11T11:59:00.000Z";
const updatedAt = "2026-06-11T12:00:01.000Z";

function createInput(
  overrides: Partial<MarkTossPaymentOrderPaidInput> = {},
): MarkTossPaymentOrderPaidInput {
  return {
    providerOrderId: "provider_order_paid_client_test",
    providerPaymentId: "toss_payment_paid_client_test",
    amount: 990,
    currency: "KRW",
    paidAt,
    ...overrides,
  };
}

function createRow(
  overrides: Partial<MarkTossPaymentOrderPaidRpcResultRow> = {},
): MarkTossPaymentOrderPaidRpcResultRow {
  return {
    payment_order_id: "payment_order_paid_client_test",
    provider_order_id: "provider_order_paid_client_test",
    product_type: "saju_mbti_full",
    provider: "toss",
    amount: 990,
    currency: "KRW",
    status: "paid",
    paid_at: paidAt,
    report_id: null,
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase Toss payment order paid client", () => {
  it("calls mark_toss_payment_order_paid RPC with expected argument names", async () => {
    const calls: Array<{
      readonly functionName: string;
      readonly args: Record<string, unknown>;
    }> = [];
    const rpcExecutor: TossPaymentOrderPaidRpcExecutor = async (
      functionName,
      args,
    ) => {
      calls.push({ functionName, args });

      return {
        data: [createRow()],
        error: null,
      };
    };
    const client = createSupabaseTossPaymentOrderPaidClient({ rpcExecutor });
    const result = await client.markTossPaymentOrderPaid(createInput());

    expect(result.ok).toBe(true);
    expect(calls).toEqual([
      {
        functionName: "mark_toss_payment_order_paid",
        args: {
          p_provider_order_id: "provider_order_paid_client_test",
          p_provider_payment_id: "toss_payment_paid_client_test",
          p_amount: 990,
          p_currency: "KRW",
          p_paid_at: paidAt,
        },
      },
    ]);
  });

  it("maps returned safe row fields", async () => {
    const client = createSupabaseTossPaymentOrderPaidClient({
      rpcExecutor: async () => ({ data: [createRow()], error: null }),
    });
    const result = await client.markTossPaymentOrderPaid(createInput());

    expect(result).toEqual({
      ok: true,
      data: {
        paymentOrderId: "payment_order_paid_client_test",
        providerOrderId: "provider_order_paid_client_test",
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 990,
        currency: "KRW",
        status: "paid",
        paidAt,
        reportId: null,
        createdAt,
        updatedAt,
      },
    });
  });

  it("rejects RPC error safely", async () => {
    const client = createSupabaseTossPaymentOrderPaidClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "P0001",
          message: "PAYMENT_ORDER_NOT_READY",
        },
      }),
    });
    const result = await client.markTossPaymentOrderPaid(createInput());

    expect(result).toEqual({
      ok: false,
      code: "PAYMENT_ORDER_NOT_READY",
      messageKo: "Supabase Toss payment paid RPC failed.",
    });
  });

  it("rejects missing row", async () => {
    const client = createSupabaseTossPaymentOrderPaidClient({
      rpcExecutor: async () => ({ data: [], error: null }),
    });
    const result = await client.markTossPaymentOrderPaid(createInput());

    expect(result).toEqual({
      ok: false,
      code: "TOSS_PAYMENT_ORDER_PAID_RPC_VALIDATION_FAILED",
      messageKo: "Supabase Toss payment paid RPC returned invalid data.",
    });
  });

  it("does not expose provider payment id or input snapshot in result", async () => {
    const client = createSupabaseTossPaymentOrderPaidClient({
      rpcExecutor: async () => ({
        data: [
          {
            ...createRow(),
            ["provider" + "_payment" + "_id"]: "hidden_provider_payment_id",
            ["input" + "_snapshot"]: { hidden: true },
          },
        ],
        error: null,
      }),
    });
    const result = await client.markTossPaymentOrderPaid(createInput());
    const serialized = JSON.stringify(result);

    expect(result.ok).toBe(true);
    expect(serialized).not.toContain("hidden_provider_payment_id");
    expect(serialized).not.toContain("input" + "_snapshot");
    expect(serialized).not.toContain("inputSnapshot");
  });

  it("source uses RPC and avoids direct update report creation or unsafe exposure", () => {
    const source = readSource(
      "src/lib/payment/supabaseTossPaymentOrderPaidClient.ts",
    );
    const requiredMarkers = [
      ".rpc(",
      "mark_toss_payment_order_paid",
      "p_provider_order_id",
      "p_provider_payment_id",
      "p_amount",
      "p_currency",
      "p_paid_at",
    ];
    const blockedMarkers = [
      ".from(",
      "from(" + "\"payment_orders\"",
      "." + "update(",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "buildReportPersistencePayload",
      "/api/" + "payments/toss/confirm",
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

    for (const marker of requiredMarkers) {
      expect(source).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
