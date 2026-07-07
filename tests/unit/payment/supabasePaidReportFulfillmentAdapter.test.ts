import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import type {
  FulfillPaidPaymentOrderInput,
  FulfillPaidPaymentOrderResult,
} from "../../../src/lib/payment/paidReportFulfillmentTypes";
import { fulfillPaidPaymentOrder } from "../../../src/lib/payment/supabasePaidReportFulfillmentAdapter";
import type { SupabasePaidReportFulfillmentRpcClient } from "../../../src/lib/payment/supabasePaidReportFulfillmentClient";

const createdAt = "2026-06-11T12:00:00.000Z";
const updatedAt = "2026-06-11T12:00:01.000Z";

function createFulfillmentResult(
  input: FulfillPaidPaymentOrderInput,
): FulfillPaidPaymentOrderResult {
  return {
    paymentOrderId: "payment_order_fulfillment_adapter_test",
    providerOrderId: input.providerOrderId,
    reportId: "report_fulfillment_adapter_test",
    productType: "saju_mbti_full",
    status: "paid",
    amount: 1290,
    currency: "KRW",
    createdAt,
    updatedAt,
  };
}

function createFakeClient(): {
  readonly calls: FulfillPaidPaymentOrderInput[];
  readonly client: SupabasePaidReportFulfillmentRpcClient;
} {
  const calls: FulfillPaidPaymentOrderInput[] = [];

  return {
    calls,
    client: {
      async fulfillPaidPaymentOrder(input) {
        calls.push(input);

        return {
          ok: true,
          data: createFulfillmentResult(input),
        };
      },
    },
  };
}

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("Supabase paid report fulfillment adapter", () => {
  it("fulfills a valid paid Toss payment order", async () => {
    const fake = createFakeClient();
    const result = await fulfillPaidPaymentOrder({
      providerOrderId: "provider_order_fulfillment_adapter_test",
      client: fake.client,
    });

    expect(result).toMatchObject({
      ok: true,
      fulfillment: {
        providerOrderId: "provider_order_fulfillment_adapter_test",
        reportId: "report_fulfillment_adapter_test",
        productType: "saju_mbti_full",
        amount: 1290,
        currency: "KRW",
        status: "paid",
      },
    });
    expect(fake.calls).toEqual([
      {
        providerOrderId: "provider_order_fulfillment_adapter_test",
      },
    ]);
  });

  it("trims and requires providerOrderId", async () => {
    const fake = createFakeClient();
    const result = await fulfillPaidPaymentOrder({
      providerOrderId: "  provider_order_fulfillment_adapter_test  ",
      client: fake.client,
    });

    expect(result.ok).toBe(true);
    expect(fake.calls).toEqual([
      {
        providerOrderId: "provider_order_fulfillment_adapter_test",
      },
    ]);
  });

  it("rejects missing providerOrderId before RPC", async () => {
    const fake = createFakeClient();
    const result = await fulfillPaidPaymentOrder({
      providerOrderId: "",
      client: fake.client,
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "PAID_REPORT_FULFILLMENT_INVALID_REQUEST",
        messageKo: "Paid report fulfillment request is invalid.",
      },
    });
    expect(fake.calls).toEqual([]);
  });

  it("returns safe client failures", async () => {
    const result = await fulfillPaidPaymentOrder({
      providerOrderId: "provider_order_fulfillment_adapter_test",
      client: {
        async fulfillPaidPaymentOrder() {
          return {
            ok: false,
            code: "PAYMENT_ORDER_NOT_PAID",
            messageKo: "Supabase paid report fulfillment RPC failed.",
          };
        },
      },
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: "PAYMENT_ORDER_NOT_PAID",
        messageKo: "Supabase paid report fulfillment RPC failed.",
      },
    });
  });

  it("returns report id without private fields", async () => {
    const fake = createFakeClient();
    const result = await fulfillPaidPaymentOrder({
      providerOrderId: "provider_order_fulfillment_adapter_test",
      client: fake.client,
    });
    const serialized = JSON.stringify(result);

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.fulfillment.reportId).toBe("report_fulfillment_adapter_test");
      expect(Object.keys(result.fulfillment)).not.toContain("providerPaymentId");
      expect(Object.keys(result.fulfillment)).not.toContain("inputSnapshot");
      expect(Object.keys(result.fulfillment)).not.toContain("access" + "TokenHash");
      expect(Object.keys(result.fulfillment)).not.toContain("share" + "Token");
    }

    expect(serialized).not.toContain("provider_payment_id");
    expect(serialized).not.toContain("input_snapshot");
  });

  it("source does not confirm Toss create reports issue links or add final content", () => {
    const source = [
      readSource("src/lib/payment/supabasePaidReportFulfillmentAdapter.ts"),
      readSource("src/lib/payment/supabasePaidReportFulfillmentClient.ts"),
    ].join("\n");
    const blockedMarkers = [
      "confirmTossPayment",
      "/v1/" + "payments/confirm",
      "createReport",
      "generateReport",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "/api/" + "reports/unlock",
      "TOSS" + "_SECRET" + "_KEY",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "service" + "_role",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "Bar" + "num",
      "바" + "넘",
      "현" + "침살",
      "망" + "신살",
      "백" + "호대살",
      "홍" + "염살",
      "재" + "다신약",
      "제" + "다신약",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
