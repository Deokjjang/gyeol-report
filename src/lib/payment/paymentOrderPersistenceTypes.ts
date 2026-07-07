import type { PaymentProviderId } from "./paymentProviderTypes";
import type { ReportProductCurrency } from "./reportProductCatalog";
import type {
  PaymentOrderInputSnapshot,
  PaymentOrderStatus,
} from "./paymentOrderTypes";
import type { ReportProductType } from "./reportProductTypes";

export type PaymentOrderRecord = {
  readonly paymentOrderId: string;
  readonly productType: ReportProductType;
  readonly provider: PaymentProviderId;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
  readonly status: PaymentOrderStatus;
  readonly inputSnapshot: PaymentOrderInputSnapshot;
  readonly providerPaymentId: string | null;
  readonly providerOrderId: string | null;
  readonly reportId: string | null;
  readonly reportGenerationStatus?: "not_started" | "completed" | "failed";
  readonly reportGenerationError?: {
    readonly code: string;
    readonly messageKo: string;
    readonly failedAt: string;
  };
  readonly reportExpiresAt?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly requestedAt: string | null;
  readonly paidAt: string | null;
  readonly failedAt: string | null;
  readonly canceledAt: string | null;
  readonly refundedAt: string | null;
  readonly deletedAt: string | null;
};

export type PaymentOrderPersistenceErrorCode =
  | "PAYMENT_ORDER_STORAGE_VALIDATION_FAILED"
  | "PAYMENT_ORDER_ALREADY_EXISTS"
  | "PAYMENT_ORDER_NOT_FOUND"
  | "PAYMENT_ORDER_INVALID_STATE";

export type PaymentOrderPersistenceResult<T> =
  | {
      readonly ok: true;
      readonly value: T;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaymentOrderPersistenceErrorCode;
        readonly messageKo: string;
      };
    };

export type PaymentOrderLifecycleTimestampInput = {
  readonly paymentOrderId: string;
  readonly updatedAt?: string;
};

export type MarkPaymentOrderPaidInput = PaymentOrderLifecycleTimestampInput & {
  readonly providerPaymentId: string;
  readonly providerOrderId?: string | null;
  readonly paidAt?: string;
};

export type MarkPaymentOrderFailedInput = PaymentOrderLifecycleTimestampInput & {
  readonly failedAt?: string;
};

export type MarkPaymentOrderCanceledInput =
  PaymentOrderLifecycleTimestampInput & {
    readonly canceledAt?: string;
  };

export type MarkPaymentOrderRefundedInput =
  PaymentOrderLifecycleTimestampInput & {
    readonly refundedAt?: string;
  };

export type AttachPaymentOrderReportInput = PaymentOrderLifecycleTimestampInput & {
  readonly reportId: string;
  readonly reportExpiresAt?: string;
};

export type MarkPaymentOrderReportGenerationFailedInput =
  PaymentOrderLifecycleTimestampInput & {
    readonly code: string;
    readonly messageKo: string;
    readonly failedAt?: string;
};

export type PaymentOrderPersistenceAdapter = {
  create(
    order: PaymentOrderRecord,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
  findByPaymentOrderId(paymentOrderId: string): Promise<PaymentOrderRecord | null>;
  findByProviderOrderId(providerOrderId: string): Promise<PaymentOrderRecord | null>;
  markPaid(
    input: MarkPaymentOrderPaidInput,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
  markFailed(
    input: MarkPaymentOrderFailedInput,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
  markCanceled(
    input: MarkPaymentOrderCanceledInput,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
  markRefunded(
    input: MarkPaymentOrderRefundedInput,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
  attachReport(
    input: AttachPaymentOrderReportInput,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
  markReportGenerationFailed(
    input: MarkPaymentOrderReportGenerationFailedInput,
  ): Promise<PaymentOrderPersistenceResult<PaymentOrderRecord>>;
};
