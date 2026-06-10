import { parsePaymentProviderId } from "./paymentProviderBoundary";
import type { ReportProductCurrency } from "./reportProductCatalog";
import { parseReportProductType } from "./reportProductTypes";
import type { PaymentOrderStatus } from "./paymentOrderTypes";
import type {
  PaymentOrderPersistenceResult,
  PaymentOrderRecord,
} from "./paymentOrderPersistenceTypes";

export type PaymentOrderRow = {
  readonly payment_order_id: string;
  readonly product_type: string;
  readonly provider: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: string;
  readonly input_snapshot: unknown;
  readonly provider_payment_id: string | null;
  readonly provider_order_id: string | null;
  readonly report_id: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly requested_at: string | null;
  readonly paid_at: string | null;
  readonly failed_at: string | null;
  readonly canceled_at: string | null;
  readonly refunded_at: string | null;
  readonly deleted_at: string | null;
};

const paymentOrderStatuses = [
  "ready",
  "paid",
  "failed",
  "canceled",
  "refunded",
] as const satisfies readonly PaymentOrderStatus[];

function success<T>(value: T): PaymentOrderPersistenceResult<T> {
  return { ok: true, value };
}

function validationFailure<T>(): PaymentOrderPersistenceResult<T> {
  return {
    ok: false,
    error: {
      code: "PAYMENT_ORDER_STORAGE_VALIDATION_FAILED",
      messageKo: "결제 주문 저장 데이터가 올바르지 않습니다.",
    },
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isInputSnapshot(
  value: unknown,
): value is PaymentOrderRecord["inputSnapshot"] {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isNullableTimestamp(value: string | null): boolean {
  return value === null || isTimestamp(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isNonEmptyString(value);
}

function isPaymentOrderStatus(value: string): value is PaymentOrderStatus {
  return paymentOrderStatuses.includes(value as PaymentOrderStatus);
}

function validatePaymentOrderRecord(
  record: PaymentOrderRecord,
): PaymentOrderPersistenceResult<PaymentOrderRecord> {
  if (
    !isNonEmptyString(record.paymentOrderId) ||
    parseReportProductType(record.productType) === null ||
    parsePaymentProviderId(record.provider) === null ||
    record.currency !== "KRW" ||
    !isPaymentOrderStatus(record.status) ||
    !Number.isInteger(record.amount) ||
    record.amount <= 0 ||
    !isInputSnapshot(record.inputSnapshot) ||
    !isNullableString(record.providerPaymentId) ||
    !isNullableString(record.providerOrderId) ||
    !isNullableString(record.reportId) ||
    !isTimestamp(record.createdAt) ||
    !isTimestamp(record.updatedAt) ||
    !isNullableTimestamp(record.requestedAt) ||
    !isNullableTimestamp(record.paidAt) ||
    !isNullableTimestamp(record.failedAt) ||
    !isNullableTimestamp(record.canceledAt) ||
    !isNullableTimestamp(record.refundedAt) ||
    !isNullableTimestamp(record.deletedAt)
  ) {
    return validationFailure();
  }

  return success(record);
}

function validatePaymentOrderRow(
  row: PaymentOrderRow,
): PaymentOrderPersistenceResult<PaymentOrderRecord> {
  const productType = parseReportProductType(row.product_type);
  const provider = parsePaymentProviderId(row.provider);

  if (
    !isNonEmptyString(row.payment_order_id) ||
    productType === null ||
    provider === null ||
    row.currency !== "KRW" ||
    !isPaymentOrderStatus(row.status) ||
    !Number.isInteger(row.amount) ||
    row.amount <= 0 ||
    !isInputSnapshot(row.input_snapshot) ||
    !isNullableString(row.provider_payment_id) ||
    !isNullableString(row.provider_order_id) ||
    !isNullableString(row.report_id) ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at) ||
    !isNullableTimestamp(row.requested_at) ||
    !isNullableTimestamp(row.paid_at) ||
    !isNullableTimestamp(row.failed_at) ||
    !isNullableTimestamp(row.canceled_at) ||
    !isNullableTimestamp(row.refunded_at) ||
    !isNullableTimestamp(row.deleted_at)
  ) {
    return validationFailure();
  }

  return success({
    paymentOrderId: row.payment_order_id,
    productType,
    provider,
    amount: row.amount,
    currency: row.currency as ReportProductCurrency,
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
}

export function mapPaymentOrderRecordToRow(
  record: PaymentOrderRecord,
): PaymentOrderPersistenceResult<PaymentOrderRow> {
  const validation = validatePaymentOrderRecord(record);

  if (!validation.ok) {
    return validation;
  }

  return success({
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
}

export function mapPaymentOrderRowToRecord(
  row: PaymentOrderRow,
): PaymentOrderPersistenceResult<PaymentOrderRecord> {
  return validatePaymentOrderRow(row);
}
