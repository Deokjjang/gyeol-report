import { parsePaymentProviderId } from "./paymentProviderBoundary";
import { getReportProduct } from "./reportProductCatalog";
import type { ReportProductCurrency } from "./reportProductCatalog";
import type { PaymentOrderStatus } from "./paymentOrderTypes";
import type { ReportProductType } from "./reportProductTypes";
import type {
  KakaoPayCheckoutProviderPayload,
  PaymentCheckoutSessionDraft,
  TossCheckoutProviderPayload,
} from "./paymentCheckoutSessionTypes";

export type PaymentCheckoutSessionErrorCode =
  | "PAYMENT_CHECKOUT_INVALID_ORDER"
  | "PAYMENT_CHECKOUT_ORDER_NOT_READY"
  | "PAYMENT_CHECKOUT_MISSING_PROVIDER_ORDER_ID"
  | "PAYMENT_CHECKOUT_UNSUPPORTED_PROVIDER"
  | "PAYMENT_CHECKOUT_PRODUCT_NOT_PURCHASABLE"
  | "PAYMENT_CHECKOUT_AMOUNT_MISMATCH"
  | "PAYMENT_CHECKOUT_CURRENCY_MISMATCH";

export type PreparePaymentCheckoutSessionInput = {
  readonly paymentOrderId: unknown;
  readonly providerOrderId: unknown;
  readonly productType: unknown;
  readonly provider: unknown;
  readonly amount: unknown;
  readonly currency: unknown;
  readonly status: unknown;
};

export type PaymentCheckoutSessionResult =
  | {
      readonly ok: true;
      readonly session: PaymentCheckoutSessionDraft;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaymentCheckoutSessionErrorCode;
        readonly messageKo: string;
      };
    };

function failure(
  code: PaymentCheckoutSessionErrorCode,
  messageKo: string,
): PaymentCheckoutSessionResult {
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

function isPaymentOrderStatus(value: unknown): value is PaymentOrderStatus {
  return (
    value === "ready" ||
    value === "paid" ||
    value === "failed" ||
    value === "canceled" ||
    value === "refunded"
  );
}

function createTossPayload(input: {
  readonly providerOrderId: string;
  readonly productLabelKo: string;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
}): TossCheckoutProviderPayload {
  return {
    provider: "toss",
    orderId: input.providerOrderId,
    orderName: input.productLabelKo,
    amount: input.amount,
    currency: input.currency,
    customerNameLabel: "결리포트 고객",
  };
}

function createKakaoPayPayload(input: {
  readonly providerOrderId: string;
  readonly productLabelKo: string;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
}): KakaoPayCheckoutProviderPayload {
  return {
    provider: "kakao_pay",
    partnerOrderId: input.providerOrderId,
    itemName: input.productLabelKo,
    quantity: 1,
    totalAmount: input.amount,
    currency: input.currency,
  };
}

export function preparePaymentCheckoutSession(
  input: PreparePaymentCheckoutSessionInput,
): PaymentCheckoutSessionResult {
  if (!isNonEmptyString(input.paymentOrderId)) {
    return failure(
      "PAYMENT_CHECKOUT_INVALID_ORDER",
      "결제 주문 정보가 올바르지 않습니다.",
    );
  }

  if (!isPaymentOrderStatus(input.status) || input.status !== "ready") {
    return failure(
      "PAYMENT_CHECKOUT_ORDER_NOT_READY",
      "결제 주문이 준비 상태가 아닙니다.",
    );
  }

  if (!isNonEmptyString(input.providerOrderId)) {
    return failure(
      "PAYMENT_CHECKOUT_MISSING_PROVIDER_ORDER_ID",
      "결제 제공자 주문 식별자가 필요합니다.",
    );
  }

  const provider = parsePaymentProviderId(input.provider);

  if (provider === null) {
    return failure(
      "PAYMENT_CHECKOUT_UNSUPPORTED_PROVIDER",
      "지원하지 않는 결제 수단입니다.",
    );
  }

  const product = getReportProduct(input.productType);

  if (product === null) {
    return failure(
      "PAYMENT_CHECKOUT_INVALID_ORDER",
      "지원하지 않는 리포트 상품입니다.",
    );
  }

  if (!product.isPurchasable) {
    return failure(
      "PAYMENT_CHECKOUT_PRODUCT_NOT_PURCHASABLE",
      "아직 결제할 수 없는 리포트 상품입니다.",
    );
  }

  if (input.amount !== product.amount) {
    return failure(
      "PAYMENT_CHECKOUT_AMOUNT_MISMATCH",
      "결제 금액이 상품 정보와 일치하지 않습니다.",
    );
  }

  if (input.currency !== product.currency) {
    return failure(
      "PAYMENT_CHECKOUT_CURRENCY_MISMATCH",
      "결제 통화가 상품 정보와 일치하지 않습니다.",
    );
  }

  const payloadInput = {
    providerOrderId: input.providerOrderId,
    productLabelKo: product.labelKo,
    amount: product.amount,
    currency: product.currency,
  };

  return {
    ok: true,
    session: {
      paymentOrderId: input.paymentOrderId,
      providerOrderId: input.providerOrderId,
      productType: product.productType as ReportProductType,
      productLabelKo: product.labelKo,
      provider,
      amount: product.amount,
      currency: product.currency,
      status: "prepared",
      checkoutMode: "provider_redirect_pending",
      providerPayload:
        provider === "toss"
          ? createTossPayload(payloadInput)
          : createKakaoPayPayload(payloadInput),
    },
  };
}
