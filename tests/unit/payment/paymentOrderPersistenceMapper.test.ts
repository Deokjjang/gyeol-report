import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  mapPaymentOrderRecordToRow,
  mapPaymentOrderRowToRecord,
} from "../../../src/lib/payment/paymentOrderPersistenceMapper";
import type {
  PaymentOrderPersistenceResult,
  PaymentOrderRecord,
} from "../../../src/lib/payment/paymentOrderPersistenceTypes";
import type { PaymentOrderRow } from "../../../src/lib/payment/paymentOrderPersistenceMapper";

const createdAt = "2026-01-01T00:00:00.000Z";
const updatedAt = "2026-01-02T00:00:00.000Z";
const requestedAt = "2026-01-03T00:00:00.000Z";
const paidAt = "2026-01-04T00:00:00.000Z";
const failedAt = "2026-01-05T00:00:00.000Z";
const canceledAt = "2026-01-06T00:00:00.000Z";
const refundedAt = "2026-01-07T00:00:00.000Z";
const deletedAt = "2026-01-08T00:00:00.000Z";

const inputSnapshot = {
  displayName: "PAYMENT_ORDER_PERSISTENCE_TEST",
  birthDate: "1996-12-06",
} as const;

function createRecord(
  overrides: Partial<PaymentOrderRecord> = {},
): PaymentOrderRecord {
  return {
    paymentOrderId: "payment_order_test_1",
    productType: "saju_mbti_full",
    provider: "toss",
    amount: 1290,
    currency: "KRW",
    status: "paid",
    inputSnapshot,
    providerPaymentId: "provider_payment_test_1",
    providerOrderId: "provider_order_test_1",
    reportId: "report_test_1",
    createdAt,
    updatedAt,
    requestedAt,
    paidAt,
    failedAt,
    canceledAt,
    refundedAt,
    deletedAt,
    ...overrides,
  };
}

function createRow(overrides: Partial<PaymentOrderRow> = {}): PaymentOrderRow {
  return {
    payment_order_id: "payment_order_test_1",
    product_type: "saju_mbti_full",
    provider: "toss",
    amount: 1290,
    currency: "KRW",
    status: "paid",
    input_snapshot: inputSnapshot,
    provider_payment_id: "provider_payment_test_1",
    provider_order_id: "provider_order_test_1",
    report_id: "report_test_1",
    created_at: createdAt,
    updated_at: updatedAt,
    requested_at: requestedAt,
    paid_at: paidAt,
    failed_at: failedAt,
    canceled_at: canceledAt,
    refunded_at: refundedAt,
    deleted_at: deletedAt,
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

function expectValidationFailure<T>(
  result: PaymentOrderPersistenceResult<T>,
): void {
  expect(result).toEqual({
    ok: false,
    error: {
      code: "PAYMENT_ORDER_STORAGE_VALIDATION_FAILED",
      messageKo: "결제 주문 저장 데이터가 올바르지 않습니다.",
    },
  });
}

function readPaymentSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

describe("payment order persistence mapper", () => {
  it("maps payment order record to payment_orders row", () => {
    const record = createRecord();
    const row = expectOk(mapPaymentOrderRecordToRow(record));

    expect(row).toEqual({
      payment_order_id: record.paymentOrderId,
      product_type: record.productType,
      provider: record.provider,
      amount: record.amount,
      currency: record.currency,
      status: record.status,
      input_snapshot: record.inputSnapshot,
      provider_payment_id: record.providerPaymentId,
      provider_order_id: record.providerOrderId,
      report_id: record.reportId,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
      requested_at: record.requestedAt,
      paid_at: record.paidAt,
      failed_at: record.failedAt,
      canceled_at: record.canceledAt,
      refunded_at: record.refundedAt,
      deleted_at: record.deletedAt,
    });
  });

  it("maps payment_orders row to payment order record", () => {
    const row = createRow();
    const record = expectOk(mapPaymentOrderRowToRecord(row));

    expect(record).toEqual({
      paymentOrderId: row.payment_order_id,
      productType: row.product_type,
      provider: row.provider,
      amount: row.amount,
      currency: row.currency,
      status: row.status,
      inputSnapshot: row.input_snapshot,
      providerPaymentId: row.provider_payment_id,
      providerOrderId: row.provider_order_id,
      reportId: row.report_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      requestedAt: row.requested_at,
      paidAt: row.paid_at,
      failedAt: row.failed_at,
      canceledAt: row.canceled_at,
      refundedAt: row.refunded_at,
      deletedAt: row.deleted_at,
    });
  });

  it("rejects unsupported product type", () => {
    expectValidationFailure(
      mapPaymentOrderRowToRecord(createRow({ product_type: "unknown_product" })),
    );
  });

  it("rejects unsupported provider", () => {
    expectValidationFailure(
      mapPaymentOrderRowToRecord(createRow({ provider: "payco" })),
    );
  });

  it("rejects unsupported status", () => {
    expectValidationFailure(
      mapPaymentOrderRowToRecord(createRow({ status: "pending" })),
    );
  });

  it("rejects non-KRW currency", () => {
    expectValidationFailure(
      mapPaymentOrderRowToRecord(createRow({ currency: "USD" })),
    );
  });

  it("rejects non-positive amount", () => {
    expectValidationFailure(mapPaymentOrderRowToRecord(createRow({ amount: 0 })));
  });

  it("rejects invalid record fields before row mapping", () => {
    expectValidationFailure(
      mapPaymentOrderRecordToRow(
        createRecord({ productType: "unknown_product" as never }),
      ),
    );
  });

  it("does not add stored-value fields to mapped rows", () => {
    const row = expectOk(mapPaymentOrderRecordToRow(createRecord()));
    const rowKeys = Object.keys(row);

    expect(rowKeys).not.toContain("wall" + "et");
    expect(rowKeys).not.toContain("re" + "charge");
    expect(rowKeys).not.toContain("point_" + "balance");
    expect(rowKeys).not.toContain("credit_" + "balance");
  });

  it("keeps mapper source isolated from unsafe payment/runtime markers", () => {
    const source = readPaymentSource(
      "src/lib/payment/paymentOrderPersistenceMapper.ts",
    );
    const rejectedMarkers = [
      "/api/" + "payments",
      "/api/" + "reports/unlock",
      "To" + "ss" + "Payments",
      "KakaoPay" + " API",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "access" + "TokenHash",
      "share" + "Token",
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
