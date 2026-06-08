import type {
  CreatePersistedReportInput,
  ReportPersistenceAdapter,
  ReportPersistenceWriteResult,
} from "./reportPersistenceAdapter";
import type {
  PersistedPaymentLinkage,
  PersistedReportRecord,
} from "./reportPersistenceTypes";

export type PaidReportStorageBoundaryErrorCode =
  | "PAID_REPORT_STORAGE_REQUIRES_PAID_ACCESS"
  | "PAID_REPORT_STORAGE_REQUIRES_COMPLETED_PAYMENT"
  | "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_METADATA"
  | "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_AMOUNT"
  | "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_CURRENCY"
  | "PAID_REPORT_STORAGE_REQUIRES_PAID_TIMESTAMP";

export type PaidReportStorageBoundaryResult =
  | ReportPersistenceWriteResult
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaidReportStorageBoundaryErrorCode;
        readonly messageKo: string;
      };
    };

export type PersistPaidFullReportInput = {
  readonly adapter: Pick<ReportPersistenceAdapter, "create">;
  readonly record: PersistedReportRecord;
};

const supportedPaymentCurrencies = ["KRW", "JPY", "USD"] as const;

function createBoundaryFailure(
  code: PaidReportStorageBoundaryErrorCode,
  messageKo: string,
): PaidReportStorageBoundaryResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSupportedPaymentCurrency(value: string): boolean {
  return supportedPaymentCurrencies.includes(
    value as (typeof supportedPaymentCurrencies)[number],
  );
}

function isTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function validatePaidPayment(
  payment: PersistedPaymentLinkage | undefined,
): PaidReportStorageBoundaryResult | null {
  if (payment === undefined) {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_METADATA",
      "Paid report storage requires payment metadata.",
    );
  }

  if (
    !isNonEmptyString(payment.orderId) ||
    !isNonEmptyString(payment.provider) ||
    !isNonEmptyString(payment.providerPaymentId)
  ) {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_METADATA",
      "Paid report storage requires payment identifiers.",
    );
  }

  if (payment.paymentStatus !== "paid") {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_COMPLETED_PAYMENT",
      "Paid report storage requires completed payment.",
    );
  }

  if (!Number.isFinite(payment.amount)) {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_AMOUNT",
      "Paid report storage requires a payment amount.",
    );
  }

  if (
    !isNonEmptyString(payment.currency) ||
    !isSupportedPaymentCurrency(payment.currency)
  ) {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_PAYMENT_CURRENCY",
      "Paid report storage requires a supported payment currency.",
    );
  }

  if (payment.paidAt === undefined || !isTimestamp(payment.paidAt)) {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_PAID_TIMESTAMP",
      "Paid report storage requires a paid timestamp.",
    );
  }

  return null;
}

export async function persistPaidFullReport(
  input: PersistPaidFullReportInput,
): Promise<PaidReportStorageBoundaryResult> {
  if (input.record.accessMode !== "paid") {
    return createBoundaryFailure(
      "PAID_REPORT_STORAGE_REQUIRES_PAID_ACCESS",
      "Paid report storage requires paid report access.",
    );
  }

  const paymentFailure = validatePaidPayment(input.record.payment);

  if (paymentFailure !== null) {
    return paymentFailure;
  }

  const createInput: CreatePersistedReportInput = {
    record: input.record,
  };

  return input.adapter.create(createInput);
}
