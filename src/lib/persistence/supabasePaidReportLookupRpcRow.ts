import type {
  PersistedReportInputSnapshot,
  PersistedReportSnapshot,
  ReportAccessMode,
  ReportPaymentStatus,
  ReportPersistenceStatus,
} from "./reportPersistenceTypes";

export type SupabasePaidReportLookupRow = {
  readonly report_id: string;
  readonly status: ReportPersistenceStatus;
  readonly access_mode: ReportAccessMode;
  readonly input_snapshot: PersistedReportInputSnapshot;
  readonly report_snapshot: PersistedReportSnapshot;
  readonly report_version: string;
  readonly calculation_version: string;
  readonly locale: string;
  readonly payment_status: ReportPaymentStatus;
  readonly created_at: string;
  readonly updated_at: string;
};

export type SupabasePaidReportLookupRowParseResult =
  | {
      readonly ok: true;
      readonly row: SupabasePaidReportLookupRow | null;
    }
  | {
      readonly ok: false;
      readonly code: "REPORT_STORAGE_VALIDATION_FAILED";
      readonly messageKo: string;
    };

const INVALID_LOOKUP_ROW_MESSAGE =
  "Supabase paid report lookup RPC returned invalid data.";

const reportStatuses = [
  "draft",
  "generated",
  "paid_unlocked",
  "deleted",
] as const satisfies readonly ReportPersistenceStatus[];

const accessModes = ["preview", "paid"] as const satisfies readonly ReportAccessMode[];

const paymentStatuses = [
  "not_required",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const satisfies readonly ReportPaymentStatus[];

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestamp(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isReportStatus(value: unknown): value is ReportPersistenceStatus {
  return (
    typeof value === "string" &&
    reportStatuses.includes(value as ReportPersistenceStatus)
  );
}

function isAccessMode(value: unknown): value is ReportAccessMode {
  return (
    typeof value === "string" && accessModes.includes(value as ReportAccessMode)
  );
}

function isPaymentStatus(value: unknown): value is ReportPaymentStatus {
  return (
    typeof value === "string" &&
    paymentStatuses.includes(value as ReportPaymentStatus)
  );
}

function createInvalidLookupRowResult(): SupabasePaidReportLookupRowParseResult {
  return {
    ok: false,
    code: "REPORT_STORAGE_VALIDATION_FAILED",
    messageKo: INVALID_LOOKUP_ROW_MESSAGE,
  };
}

function parseSupabasePaidReportLookupRow(
  value: unknown,
): SupabasePaidReportLookupRowParseResult {
  if (!isObjectRecord(value)) {
    return createInvalidLookupRowResult();
  }

  const reportId = value.report_id;
  const status = value.status;
  const accessMode = value.access_mode;
  const inputSnapshot = value.input_snapshot;
  const reportSnapshot = value.report_snapshot;
  const reportVersion = value.report_version;
  const calculationVersion = value.calculation_version;
  const locale = value.locale;
  const paymentStatus = value.payment_status;
  const createdAt = value.created_at;
  const updatedAt = value.updated_at;

  if (
    !isNonEmptyString(reportId) ||
    !isReportStatus(status) ||
    !isAccessMode(accessMode) ||
    !isObjectRecord(inputSnapshot) ||
    !isObjectRecord(reportSnapshot) ||
    !isNonEmptyString(reportVersion) ||
    !isNonEmptyString(calculationVersion) ||
    !isNonEmptyString(locale) ||
    !isPaymentStatus(paymentStatus) ||
    !isTimestamp(createdAt) ||
    !isTimestamp(updatedAt)
  ) {
    return createInvalidLookupRowResult();
  }

  return {
    ok: true,
    row: {
      report_id: reportId,
      status,
      access_mode: accessMode,
      input_snapshot: inputSnapshot as PersistedReportInputSnapshot,
      report_snapshot: reportSnapshot as PersistedReportSnapshot,
      report_version: reportVersion,
      calculation_version: calculationVersion,
      locale,
      payment_status: paymentStatus,
      created_at: createdAt,
      updated_at: updatedAt,
    },
  };
}

export function parseSupabasePaidReportLookupRpcResult(
  value: unknown,
): SupabasePaidReportLookupRowParseResult {
  if (value === null) {
    return {
      ok: true,
      row: null,
    };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return {
        ok: true,
        row: null,
      };
    }

    return parseSupabasePaidReportLookupRow(value[0]);
  }

  return parseSupabasePaidReportLookupRow(value);
}
