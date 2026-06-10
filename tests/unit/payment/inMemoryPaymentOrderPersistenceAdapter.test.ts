import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { createInMemoryPaymentOrderPersistenceAdapter } from "../../../src/lib/payment/inMemoryPaymentOrderPersistenceAdapter";
import type {
  PaymentOrderPersistenceResult,
  PaymentOrderRecord,
} from "../../../src/lib/payment/paymentOrderPersistenceTypes";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-02T00:00:00.000Z";
const paidAt = "2026-01-03T00:00:00.000Z";
const failedAt = "2026-01-04T00:00:00.000Z";
const canceledAt = "2026-01-05T00:00:00.000Z";
const refundedAt = "2026-01-06T00:00:00.000Z";
const deletedAt = "2026-01-07T00:00:00.000Z";

const inputSnapshot = {
  displayName: "PAYMENT_ORDER_ADAPTER_TEST",
  birthDate: "1996-12-06",
} as const;

function createOrder(
  overrides: Partial<PaymentOrderRecord> = {},
): PaymentOrderRecord {
  return {
    paymentOrderId: "payment_order_adapter_test_1",
    productType: "saju_mbti_full",
    provider: "toss",
    amount: 1290,
    currency: "KRW",
    status: "ready",
    inputSnapshot,
    providerPaymentId: null,
    providerOrderId: null,
    reportId: null,
    createdAt,
    updatedAt: createdAt,
    requestedAt: createdAt,
    paidAt: null,
    failedAt: null,
    canceledAt: null,
    refundedAt: null,
    deletedAt: null,
    ...overrides,
  };
}

function expectOk<T>(result: PaymentOrderPersistenceResult<T>): T {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error(result.error.messageKo);
  }

  return result.value;
}

function expectFailureCode<T>(
  result: PaymentOrderPersistenceResult<T>,
  code: Exclude<
    PaymentOrderPersistenceResult<T>,
    { readonly ok: true }
  >["error"]["code"],
): void {
  expect(result.ok).toBe(false);

  if (result.ok) {
    throw new Error("Expected failure result.");
  }

  expect(result.error.code).toBe(code);
}

function readPaymentSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("in-memory payment order persistence adapter", () => {
  it("creates a ready payment order", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter();
    const order = createOrder();
    const result = await adapter.create(order);
    const created = expectOk(result);

    expect(created).toEqual(order);
    expect(created).not.toBe(order);
    expect(created.inputSnapshot).toEqual(order.inputSnapshot);
    expect(created.inputSnapshot).not.toBe(order.inputSnapshot);
  });

  it("rejects duplicate order ids", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter();
    const order = createOrder();

    expectOk(await adapter.create(order));

    expectFailureCode(
      await adapter.create(order),
      "PAYMENT_ORDER_ALREADY_EXISTS",
    );
  });

  it("returns null for missing order lookup", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter();

    await expect(
      adapter.findByPaymentOrderId("payment_order_missing"),
    ).resolves.toBeNull();
  });

  it("marks order paid with provider payment metadata", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter([
      createOrder(),
    ]);
    const result = await adapter.markPaid({
      paymentOrderId: "payment_order_adapter_test_1",
      providerPaymentId: "provider_payment_test_1",
      providerOrderId: "provider_order_test_1",
      paidAt,
      updatedAt,
    });
    const paidOrder = expectOk(result);

    expect(paidOrder).toMatchObject({
      status: "paid",
      providerPaymentId: "provider_payment_test_1",
      providerOrderId: "provider_order_test_1",
      paidAt,
      updatedAt,
    });
  });

  it("marks order failed", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter([
      createOrder(),
    ]);
    const failedOrder = expectOk(
      await adapter.markFailed({
        paymentOrderId: "payment_order_adapter_test_1",
        failedAt,
        updatedAt,
      }),
    );

    expect(failedOrder.status).toBe("failed");
    expect(failedOrder.failedAt).toBe(failedAt);
    expect(failedOrder.updatedAt).toBe(updatedAt);
  });

  it("marks order canceled", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter([
      createOrder(),
    ]);
    const canceledOrder = expectOk(
      await adapter.markCanceled({
        paymentOrderId: "payment_order_adapter_test_1",
        canceledAt,
        updatedAt,
      }),
    );

    expect(canceledOrder.status).toBe("canceled");
    expect(canceledOrder.canceledAt).toBe(canceledAt);
    expect(canceledOrder.updatedAt).toBe(updatedAt);
  });

  it("marks paid order refunded", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter([
      createOrder(),
    ]);

    expectOk(
      await adapter.markPaid({
        paymentOrderId: "payment_order_adapter_test_1",
        providerPaymentId: "provider_payment_test_1",
        paidAt,
        updatedAt,
      }),
    );

    const refundedOrder = expectOk(
      await adapter.markRefunded({
        paymentOrderId: "payment_order_adapter_test_1",
        refundedAt,
        updatedAt,
      }),
    );

    expect(refundedOrder.status).toBe("refunded");
    expect(refundedOrder.refundedAt).toBe(refundedAt);
  });

  it("attaches report id after paid report creation", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter([
      createOrder(),
    ]);

    expectOk(
      await adapter.markPaid({
        paymentOrderId: "payment_order_adapter_test_1",
        providerPaymentId: "provider_payment_test_1",
        paidAt,
        updatedAt,
      }),
    );

    const linkedOrder = expectOk(
      await adapter.attachReport({
        paymentOrderId: "payment_order_adapter_test_1",
        reportId: "report_paid_1",
        updatedAt,
      }),
    );

    expect(linkedOrder.reportId).toBe("report_paid_1");
    expect(linkedOrder.updatedAt).toBe(updatedAt);
  });

  it("does not create a paid order directly", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter();
    const paidOrder = createOrder({
      status: "paid",
      providerPaymentId: "provider_payment_test_1",
      paidAt,
    });

    expectFailureCode(
      await adapter.create(paidOrder),
      "PAYMENT_ORDER_STORAGE_VALIDATION_FAILED",
    );
  });

  it("does not mark deleted order as paid", async () => {
    const adapter = createInMemoryPaymentOrderPersistenceAdapter([
      createOrder({ deletedAt }),
    ]);

    expectFailureCode(
      await adapter.markPaid({
        paymentOrderId: "payment_order_adapter_test_1",
        providerPaymentId: "provider_payment_test_1",
        paidAt,
        updatedAt,
      }),
      "PAYMENT_ORDER_INVALID_STATE",
    );
  });

  it("does not generate reports or issue access links", () => {
    const paymentSource = [
      readPaymentSource(
        "src/lib/payment/inMemoryPaymentOrderPersistenceAdapter.ts",
      ),
      readPaymentSource("src/lib/payment/paymentOrderPersistenceTypes.ts"),
      readPaymentSource("src/lib/payment/paymentOrderPersistenceMapper.ts"),
    ].join("\n");
    const rejectedMarkers = [
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "buildReportPersistencePayload",
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "access" + "TokenHash",
      "share" + "Token",
    ];

    for (const marker of rejectedMarkers) {
      expect(paymentSource).not.toContain(marker);
    }
  });

  it("does not add stored-value source concepts", () => {
    const paymentSource = [
      readPaymentSource(
        "src/lib/payment/inMemoryPaymentOrderPersistenceAdapter.ts",
      ),
      readPaymentSource("src/lib/payment/paymentOrderPersistenceTypes.ts"),
      readPaymentSource("src/lib/payment/paymentOrderPersistenceMapper.ts"),
    ].join("\n");
    const rejectedMarkers = [
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of rejectedMarkers) {
      expect(paymentSource).not.toContain(marker);
    }
  });
});
