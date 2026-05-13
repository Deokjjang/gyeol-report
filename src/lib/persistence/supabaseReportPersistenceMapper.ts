import type {
  PersistedPaymentLinkage,
  PersistedReportInputSnapshot,
  PersistedReportRecord,
  PersistedReportSnapshot,
  ReportAccessMode,
  ReportPaymentStatus,
  ReportPersistenceStatus,
} from "./reportPersistenceTypes";

export type SupabaseReportRow = {
  readonly report_id: string;
  readonly status: string;
  readonly access_mode: string;
  readonly input_snapshot: unknown;
  readonly report_snapshot: unknown;
  readonly report_version: string | null;
  readonly calculation_version: string | null;
  readonly locale: string | null;
  readonly access_token_hash: string | null;
  readonly access_token_created_at: string | null;
  readonly access_token_rotated_at: string | null;
  readonly access_token_version: string | null;
  readonly payment_order_id: string | null;
  readonly payment_provider: string | null;
  readonly payment_provider_payment_id: string | null;
  readonly payment_status: string | null;
  readonly payment_amount: number | string | null;
  readonly payment_currency: string | null;
  readonly payment_paid_at: string | null;
  readonly payment_refunded_at: string | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly deleted_at: string | null;
};

type SupabaseReportMappingErrorCode =
  | "INVALID_REPORT_ROW"
  | "INVALID_REPORT_RECORD"
  | "INVALID_REPORT_STATUS"
  | "INVALID_ACCESS_MODE"
  | "INVALID_PAYMENT_STATUS"
  | "INVALID_PAYMENT_CURRENCY"
  | "INVALID_SNAPSHOT"
  | "INVALID_TIMESTAMP";

export type SupabaseReportMappingResult<T> =
  | { readonly ok: true; readonly value: T }
  | {
      readonly ok: false;
      readonly code: SupabaseReportMappingErrorCode;
      readonly messageKo: string;
    };

type SupabasePaymentColumns = Pick<
  SupabaseReportRow,
  | "payment_order_id"
  | "payment_provider"
  | "payment_provider_payment_id"
  | "payment_status"
  | "payment_amount"
  | "payment_currency"
  | "payment_paid_at"
  | "payment_refunded_at"
>;

const reportStatuses = [
  "draft",
  "generated",
  "paid_unlocked",
  "deleted",
] as const satisfies readonly ReportPersistenceStatus[];

const accessModes = [
  "preview",
  "paid",
] as const satisfies readonly ReportAccessMode[];

const paymentStatuses = [
  "not_required",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const satisfies readonly ReportPaymentStatus[];

const paymentCurrencies = ["KRW", "JPY", "USD"] as const;

function success<T>(value: T): SupabaseReportMappingResult<T> {
  return { ok: true, value };
}

function failure<T>(
  code: SupabaseReportMappingErrorCode,
  messageKo: string,
): SupabaseReportMappingResult<T> {
  return { ok: false, code, messageKo };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isReportStatus(value: string): value is ReportPersistenceStatus {
  return reportStatuses.includes(value as ReportPersistenceStatus);
}

function isAccessMode(value: string): value is ReportAccessMode {
  return accessModes.includes(value as ReportAccessMode);
}

function isPaymentStatus(value: string): value is ReportPaymentStatus {
  return paymentStatuses.includes(value as ReportPaymentStatus);
}

function isPaymentCurrency(value: string): boolean {
  return paymentCurrencies.includes(value as (typeof paymentCurrencies)[number]);
}

function parsePaymentAmount(
  value: number | string | null,
): SupabaseReportMappingResult<number> {
  if (typeof value === "number" && Number.isFinite(value)) {
    return success(value);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return success(parsedValue);
    }
  }

  return failure("INVALID_REPORT_ROW", "Invalid payment amount.");
}

function validateRecordBase(
  record: PersistedReportRecord,
): SupabaseReportMappingResult<{
  readonly status: ReportPersistenceStatus;
  readonly accessMode: ReportAccessMode;
}> {
  if (!isNonEmptyString(record.reportId)) {
    return failure("INVALID_REPORT_RECORD", "Invalid report record.");
  }

  if (!isReportStatus(record.status)) {
    return failure("INVALID_REPORT_STATUS", "Invalid report status.");
  }

  if (!isAccessMode(record.accessMode)) {
    return failure("INVALID_ACCESS_MODE", "Invalid report access mode.");
  }

  if (!isTimestamp(record.createdAt) || !isTimestamp(record.updatedAt)) {
    return failure("INVALID_TIMESTAMP", "Invalid report timestamp.");
  }

  if (record.deletedAt !== undefined && !isTimestamp(record.deletedAt)) {
    return failure("INVALID_TIMESTAMP", "Invalid report timestamp.");
  }

  if (
    !isObjectRecord(record.inputSnapshot) ||
    !isObjectRecord(record.reportSnapshot)
  ) {
    return failure("INVALID_SNAPSHOT", "Invalid report snapshot.");
  }

  return success({
    status: record.status,
    accessMode: record.accessMode,
  });
}

function mapPaymentToColumns(
  payment: PersistedPaymentLinkage | undefined,
): SupabaseReportMappingResult<SupabasePaymentColumns> {
  if (payment === undefined) {
    return success({
      payment_order_id: null,
      payment_provider: null,
      payment_provider_payment_id: null,
      payment_status: null,
      payment_amount: null,
      payment_currency: null,
      payment_paid_at: null,
      payment_refunded_at: null,
    });
  }

  if (
    !isNonEmptyString(payment.orderId) ||
    !isNonEmptyString(payment.provider) ||
    !isNonEmptyString(payment.providerPaymentId)
  ) {
    return failure("INVALID_REPORT_RECORD", "Invalid payment linkage.");
  }

  if (!isPaymentStatus(payment.paymentStatus)) {
    return failure("INVALID_PAYMENT_STATUS", "Invalid payment status.");
  }

  if (!isPaymentCurrency(payment.currency)) {
    return failure("INVALID_PAYMENT_CURRENCY", "Invalid payment currency.");
  }

  if (!Number.isFinite(payment.amount)) {
    return failure("INVALID_REPORT_RECORD", "Invalid payment amount.");
  }

  if (payment.paidAt !== undefined && !isTimestamp(payment.paidAt)) {
    return failure("INVALID_TIMESTAMP", "Invalid payment timestamp.");
  }

  if (payment.refundedAt !== undefined && !isTimestamp(payment.refundedAt)) {
    return failure("INVALID_TIMESTAMP", "Invalid payment timestamp.");
  }

  return success({
    payment_order_id: payment.orderId,
    payment_provider: payment.provider,
    payment_provider_payment_id: payment.providerPaymentId,
    payment_status: payment.paymentStatus,
    payment_amount: payment.amount,
    payment_currency: payment.currency,
    payment_paid_at: payment.paidAt ?? null,
    payment_refunded_at: payment.refundedAt ?? null,
  });
}

function validateRequiredRowFields(
  row: SupabaseReportRow,
): SupabaseReportMappingResult<{
  readonly status: ReportPersistenceStatus;
  readonly accessMode: ReportAccessMode;
  readonly reportVersion: string;
  readonly calculationVersion: string;
  readonly locale: string;
}> {
  if (
    !isNonEmptyString(row.report_id) ||
    !isNonEmptyString(row.report_version) ||
    !isNonEmptyString(row.calculation_version) ||
    !isNonEmptyString(row.locale)
  ) {
    return failure("INVALID_REPORT_ROW", "Invalid report row.");
  }

  if (!isReportStatus(row.status)) {
    return failure("INVALID_REPORT_STATUS", "Invalid report status.");
  }

  if (!isAccessMode(row.access_mode)) {
    return failure("INVALID_ACCESS_MODE", "Invalid report access mode.");
  }

  if (!isTimestamp(row.created_at) || !isTimestamp(row.updated_at)) {
    return failure("INVALID_TIMESTAMP", "Invalid report timestamp.");
  }

  if (row.deleted_at !== null && !isTimestamp(row.deleted_at)) {
    return failure("INVALID_TIMESTAMP", "Invalid report timestamp.");
  }

  if (!isObjectRecord(row.input_snapshot) || !isObjectRecord(row.report_snapshot)) {
    return failure("INVALID_SNAPSHOT", "Invalid report snapshot.");
  }

  return success({
    status: row.status,
    accessMode: row.access_mode,
    reportVersion: row.report_version,
    calculationVersion: row.calculation_version,
    locale: row.locale,
  });
}

function hasPaymentFields(row: SupabaseReportRow): boolean {
  return (
    row.payment_order_id !== null ||
    row.payment_provider !== null ||
    row.payment_provider_payment_id !== null ||
    row.payment_status !== null ||
    row.payment_amount !== null ||
    row.payment_currency !== null ||
    row.payment_paid_at !== null ||
    row.payment_refunded_at !== null
  );
}

function mapRowToPayment(
  row: SupabaseReportRow,
): SupabaseReportMappingResult<PersistedPaymentLinkage | undefined> {
  if (!hasPaymentFields(row)) {
    return success(undefined);
  }

  if (
    !isNonEmptyString(row.payment_order_id) ||
    !isNonEmptyString(row.payment_provider) ||
    !isNonEmptyString(row.payment_provider_payment_id) ||
    !isNonEmptyString(row.payment_status) ||
    !isNonEmptyString(row.payment_currency)
  ) {
    return failure("INVALID_REPORT_ROW", "Invalid payment linkage row.");
  }

  if (!isPaymentStatus(row.payment_status)) {
    return failure("INVALID_PAYMENT_STATUS", "Invalid payment status.");
  }

  if (!isPaymentCurrency(row.payment_currency)) {
    return failure("INVALID_PAYMENT_CURRENCY", "Invalid payment currency.");
  }

  if (row.payment_paid_at !== null && !isTimestamp(row.payment_paid_at)) {
    return failure("INVALID_TIMESTAMP", "Invalid payment timestamp.");
  }

  if (row.payment_refunded_at !== null && !isTimestamp(row.payment_refunded_at)) {
    return failure("INVALID_TIMESTAMP", "Invalid payment timestamp.");
  }

  const amountResult = parsePaymentAmount(row.payment_amount);

  if (!amountResult.ok) {
    return amountResult;
  }

  return success({
    orderId: row.payment_order_id,
    provider: row.payment_provider,
    providerPaymentId: row.payment_provider_payment_id,
    paymentStatus: row.payment_status,
    amount: amountResult.value,
    currency: row.payment_currency,
    ...(row.payment_paid_at !== null ? { paidAt: row.payment_paid_at } : {}),
    ...(row.payment_refunded_at !== null
      ? { refundedAt: row.payment_refunded_at }
      : {}),
  });
}

export function mapPersistedReportRecordToSupabaseRow(
  record: PersistedReportRecord,
): SupabaseReportMappingResult<SupabaseReportRow> {
  const recordValidation = validateRecordBase(record);

  if (!recordValidation.ok) {
    return recordValidation;
  }

  const paymentColumnsResult = mapPaymentToColumns(record.payment);

  if (!paymentColumnsResult.ok) {
    return paymentColumnsResult;
  }

  return success({
    report_id: record.reportId,
    status: recordValidation.value.status,
    access_mode: recordValidation.value.accessMode,
    input_snapshot: record.inputSnapshot,
    report_snapshot: record.reportSnapshot,
    report_version: record.reportVersion,
    calculation_version: record.calculationVersion,
    locale: record.locale,
    access_token_hash: null,
    access_token_created_at: null,
    access_token_rotated_at: null,
    access_token_version: null,
    ...paymentColumnsResult.value,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    deleted_at: record.deletedAt ?? null,
  });
}

export function mapSupabaseRowToPersistedReportRecord(
  row: SupabaseReportRow,
): SupabaseReportMappingResult<PersistedReportRecord> {
  const rowValidation = validateRequiredRowFields(row);

  if (!rowValidation.ok) {
    return rowValidation;
  }

  const paymentResult = mapRowToPayment(row);

  if (!paymentResult.ok) {
    return paymentResult;
  }

  return success({
    reportId: row.report_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: rowValidation.value.status,
    reportVersion: rowValidation.value.reportVersion,
    calculationVersion: rowValidation.value.calculationVersion,
    locale: rowValidation.value.locale,
    accessMode: rowValidation.value.accessMode,
    inputSnapshot: row.input_snapshot as PersistedReportInputSnapshot,
    reportSnapshot: row.report_snapshot as PersistedReportSnapshot,
    ...(paymentResult.value !== undefined ? { payment: paymentResult.value } : {}),
    ...(row.deleted_at !== null ? { deletedAt: row.deleted_at } : {}),
  });
}
