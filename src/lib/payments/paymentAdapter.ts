import type {
  CreatePaymentOrderInput,
  PaymentFailureCode,
  PaymentOperationResult,
  PaymentOrder,
  PaymentProvider,
  PaymentStatus,
  PublicPaymentSummary,
} from "./paymentTypes";

export type CreatePaymentSessionInput = CreatePaymentOrderInput & {
  successUrl: string;
  failureUrl: string;
  customerEmail?: string;
};

export type PaymentSessionResult =
  | {
      ok: true;
      order: PaymentOrder;
      redirectUrl?: string;
      providerPayload?: unknown;
    }
  | {
      ok: false;
      error: {
        code: PaymentFailureCode;
        messageKo: string;
      };
    };

export type ConfirmPaymentInput = {
  orderId: string;
  provider: PaymentProvider;
  providerPaymentId?: string;
  amountValue?: number;
  rawPayload?: unknown;
};

export type CancelPaymentInput = {
  orderId: string;
  provider: PaymentProvider;
  reasonKo: string;
  rawPayload?: unknown;
};

export type RefundPaymentInput = {
  orderId: string;
  provider: PaymentProvider;
  reasonKo: string;
  amountValue?: number;
  rawPayload?: unknown;
};

export type FindPaymentInput = {
  orderId: string;
  provider?: PaymentProvider;
};

export type ListPaymentOrdersInput = {
  reportId?: string;
  status?: PaymentStatus;
  provider?: PaymentProvider;
  limit?: number;
};

export type PaymentFindResult =
  | { ok: true; order: PaymentOrder }
  | {
      ok: false;
      error: {
        code: "PAYMENT_ORDER_NOT_FOUND" | "PAYMENT_LOOKUP_FAILED";
        messageKo: string;
      };
    };

export type PaymentAdapter = {
  createSession(input: CreatePaymentSessionInput): Promise<PaymentSessionResult>;
  confirm(input: ConfirmPaymentInput): Promise<PaymentOperationResult>;
  cancel(input: CancelPaymentInput): Promise<PaymentOperationResult>;
  refund(input: RefundPaymentInput): Promise<PaymentOperationResult>;
  find(input: FindPaymentInput): Promise<PaymentFindResult>;
  list(input: ListPaymentOrdersInput): Promise<readonly PublicPaymentSummary[]>;
};
