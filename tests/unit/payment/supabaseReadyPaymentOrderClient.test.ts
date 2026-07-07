import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  createSupabaseReadyPaymentOrderClient,
  type ReadyPaymentOrderRpcExecutor,
  type ReadyPaymentOrderRpcInput,
  type ReadyPaymentOrderRpcResultRow,
} from "../../../src/lib/payment/supabaseReadyPaymentOrderClient";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-01T00:00:01.000Z";

function createInput(
  overrides: Partial<ReadyPaymentOrderRpcInput> = {},
): ReadyPaymentOrderRpcInput {
  return {
    paymentOrderId: "payment_order_ready_client_test",
    productType: "saju_mbti_full",
    provider: "toss",
    amount: 1290,
    currency: "KRW",
    inputSnapshot: {
      displayName: "READY_CLIENT_TEST",
      birthDate: "1996-12-06",
    },
    providerOrderId: "provider_order_ready_client_test",
    ...overrides,
  };
}

function createRow(
  overrides: Partial<ReadyPaymentOrderRpcResultRow> = {},
): ReadyPaymentOrderRpcResultRow {
  return {
    payment_order_id: "payment_order_ready_client_test",
    product_type: "saju_mbti_full",
    provider: "toss",
    amount: 1290,
    currency: "KRW",
    status: "ready",
    provider_order_id: "provider_order_ready_client_test",
    created_at: createdAt,
    updated_at: updatedAt,
    ...overrides,
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("supabase ready payment order client", () => {
  it("calls create_ready_payment_order RPC with expected argument names", async () => {
    const calls: Array<{
      readonly functionName: string;
      readonly args: Record<string, unknown>;
    }> = [];
    const rpcExecutor: ReadyPaymentOrderRpcExecutor = async (
      functionName,
      args,
    ) => {
      calls.push({ functionName, args });

      return {
        data: [createRow()],
        error: null,
      };
    };
    const client = createSupabaseReadyPaymentOrderClient({ rpcExecutor });
    const result = await client.createReadyPaymentOrder(createInput());

    expect(result.ok).toBe(true);
    expect(calls).toEqual([
      {
        functionName: "create_ready_payment_order",
        args: {
          p_payment_order_id: "payment_order_ready_client_test",
          p_product_type: "saju_mbti_full",
          p_provider: "toss",
          p_amount: 1290,
          p_currency: "KRW",
          p_input_snapshot: {
            displayName: "READY_CLIENT_TEST",
            birthDate: "1996-12-06",
          },
          p_provider_order_id: "provider_order_ready_client_test",
        },
      },
    ]);
  });

  it("maps returned safe row fields", async () => {
    const client = createSupabaseReadyPaymentOrderClient({
      rpcExecutor: async () => ({ data: [createRow()], error: null }),
    });
    const result = await client.createReadyPaymentOrder(createInput());

    expect(result).toEqual({
      ok: true,
      data: {
        paymentOrderId: "payment_order_ready_client_test",
        productType: "saju_mbti_full",
        provider: "toss",
        amount: 1290,
        currency: "KRW",
        status: "ready",
        providerOrderId: "provider_order_ready_client_test",
        createdAt,
        updatedAt,
      },
    });
  });

  it("rejects missing RPC row", async () => {
    const client = createSupabaseReadyPaymentOrderClient({
      rpcExecutor: async () => ({ data: [], error: null }),
    });
    const result = await client.createReadyPaymentOrder(createInput());

    expect(result).toEqual({
      ok: false,
      code: "READY_PAYMENT_ORDER_RPC_VALIDATION_FAILED",
      messageKo: "Supabase ready payment order RPC returned invalid data.",
    });
  });

  it("maps RPC error safely", async () => {
    const client = createSupabaseReadyPaymentOrderClient({
      rpcExecutor: async () => ({
        data: null,
        error: {
          code: "23505",
          message: "duplicate order",
        },
      }),
    });
    const result = await client.createReadyPaymentOrder(createInput());

    expect(result).toEqual({
      ok: false,
      code: "DUPLICATE_PAYMENT_ORDER",
      messageKo: "Supabase ready payment order RPC failed.",
    });
  });

  it("does not expose request snapshot or provider payment id", async () => {
    const client = createSupabaseReadyPaymentOrderClient({
      rpcExecutor: async () => ({
        data: [
          {
            ...createRow(),
            ["input" + "_snapshot"]: { hidden: true },
            ["provider" + "_payment" + "_id"]: "hidden_payment_id",
          },
        ],
        error: null,
      }),
    });
    const result = await client.createReadyPaymentOrder(createInput());

    expect(result.ok).toBe(true);

    if (result.ok) {
      const keys = Object.keys(result.data);

      expect(keys).not.toContain("input" + "_snapshot");
      expect(keys).not.toContain("provider_" + "payment_id");
    }
  });

  it("source uses RPC and avoids direct table insert or unsafe markers", () => {
    const source = readSource(
      "src/lib/payment/supabaseReadyPaymentOrderClient.ts",
    );
    const rejectedMarkers = [
      ".from(",
      "from(" + "\"payment_orders\"",
      "." + "in" + "sert(",
      "grant " + "insert",
      "create " + "policy",
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

    expect(source).toContain(".rpc(");
    expect(source).toContain("create_ready_payment_order");

    for (const marker of rejectedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
