export type PaymentProvider = "manual" | "toss" | "kakaopay_pg" | "paddle";

export type PaymentCurrency = "KRW" | "JPY" | "USD";

export type PaymentStatus =
  | "not_started"
  | "ready"
  | "pending"
  | "paid"
  | "failed"
  | "cancelled"
  | "refunded";

export type PaymentFailureCode =
  | "PAYMENT_PROVIDER_UNAVAILABLE"
  | "PAYMENT_CANCELLED_BY_USER"
  | "PAYMENT_AUTH_FAILED"
  | "PAYMENT_AMOUNT_MISMATCH"
  | "PAYMENT_REPORT_NOT_FOUND"
  | "PAYMENT_ALREADY_PROCESSED"
  | "PAYMENT_UNKNOWN_ERROR";

export type PaymentProductCode = "gyeol_report_full_v1";

export type PaymentAmount = {
  value: number;
  currency: PaymentCurrency;
};

export type PaymentOrder = {
  orderId: string;
  reportId: string;
  productCode: PaymentProductCode;
  provider: PaymentProvider;
  amount: PaymentAmount;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  providerPaymentId?: string;
  paidAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  failureCode?: PaymentFailureCode;
  failureMessageKo?: string;
};

export type CreatePaymentOrderInput = {
  reportId: string;
  productCode: PaymentProductCode;
  provider: PaymentProvider;
  amount: PaymentAmount;
};

export type PaymentOperationResult =
  | { ok: true; order: PaymentOrder }
  | {
      ok: false;
      error: {
        code: PaymentFailureCode;
        messageKo: string;
      };
    };

export type PublicPaymentSummary = {
  orderId: string;
  reportId: string;
  productCode: PaymentProductCode;
  provider: PaymentProvider;
  amount: PaymentAmount;
  status: PaymentStatus;
  paidAt?: string;
  refundedAt?: string;
};
