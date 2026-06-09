import { randomUUID } from "node:crypto";

import { parsePaymentProviderId } from "./paymentProviderBoundary";
import { getReportProduct } from "./reportProductCatalog";
import { parseReportProductType } from "./reportProductTypes";
import type { PaymentProviderId } from "./paymentProviderTypes";
import type {
  PaymentOrderDraft,
  PaymentOrderInputSnapshot,
} from "./paymentOrderTypes";
import type { ReportProductType } from "./reportProductTypes";

export type PaymentOrderBoundaryErrorCode =
  | "PAYMENT_PRODUCT_UNSUPPORTED"
  | "PAYMENT_PRODUCT_NOT_PURCHASABLE"
  | "PAYMENT_ORDER_INVALID_PROVIDER"
  | "PAYMENT_ORDER_INVALID_INPUT";

export type CreatePaymentOrderDraftInput = {
  readonly productType?: unknown;
  readonly provider: unknown;
  readonly inputSnapshot: unknown;
  readonly nowIso?: string;
  readonly requestedAmount?: unknown;
  readonly requestedCurrency?: unknown;
  readonly requestedStatus?: unknown;
};

export type PaymentOrderBoundaryResult =
  | {
      readonly ok: true;
      readonly order: PaymentOrderDraft;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaymentOrderBoundaryErrorCode;
        readonly messageKo: string;
      };
    };

const defaultProductType: ReportProductType = "saju_mbti_full";

function createBoundaryFailure(
  code: PaymentOrderBoundaryErrorCode,
  messageKo: string,
): PaymentOrderBoundaryResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function isInputSnapshot(value: unknown): value is PaymentOrderInputSnapshot {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createPaymentOrderId(): string {
  return `payment_order_${randomUUID()}`;
}

function getOrderCreatedAt(nowIso: string | undefined): string {
  return nowIso ?? new Date().toISOString();
}

export function assertPaymentOrderCanStart(input: {
  readonly productType?: unknown;
  readonly provider: unknown;
}): PaymentOrderBoundaryResult | null {
  const productType =
    input.productType === undefined
      ? defaultProductType
      : parseReportProductType(input.productType);

  if (productType === null) {
    return createBoundaryFailure(
      "PAYMENT_PRODUCT_UNSUPPORTED",
      "지원하지 않는 리포트 상품입니다.",
    );
  }

  const product = getReportProduct(productType);

  if (product === null) {
    return createBoundaryFailure(
      "PAYMENT_PRODUCT_UNSUPPORTED",
      "지원하지 않는 리포트 상품입니다.",
    );
  }

  if (!product.isPurchasable) {
    return createBoundaryFailure(
      "PAYMENT_PRODUCT_NOT_PURCHASABLE",
      "아직 결제할 수 없는 리포트 상품입니다.",
    );
  }

  if (parsePaymentProviderId(input.provider) === null) {
    return createBoundaryFailure(
      "PAYMENT_ORDER_INVALID_PROVIDER",
      "지원하지 않는 결제 수단입니다.",
    );
  }

  return null;
}

export function createPaymentOrderDraft(
  input: CreatePaymentOrderDraftInput,
): PaymentOrderBoundaryResult {
  const startFailure = assertPaymentOrderCanStart(input);

  if (startFailure !== null) {
    return startFailure;
  }

  if (!isInputSnapshot(input.inputSnapshot)) {
    return createBoundaryFailure(
      "PAYMENT_ORDER_INVALID_INPUT",
      "결제 주문을 시작할 입력 정보가 필요합니다.",
    );
  }

  const productType =
    input.productType === undefined
      ? defaultProductType
      : parseReportProductType(input.productType);
  const provider = parsePaymentProviderId(input.provider);

  if (productType === null || provider === null) {
    return createBoundaryFailure(
      "PAYMENT_ORDER_INVALID_INPUT",
      "결제 주문 입력값이 올바르지 않습니다.",
    );
  }

  const product = getReportProduct(productType);

  if (product === null) {
    return createBoundaryFailure(
      "PAYMENT_PRODUCT_UNSUPPORTED",
      "지원하지 않는 리포트 상품입니다.",
    );
  }

  return {
    ok: true,
    order: {
      paymentOrderId: createPaymentOrderId(),
      productType,
      provider: provider as PaymentProviderId,
      amount: product.amount,
      currency: product.currency,
      status: "ready",
      inputSnapshot: input.inputSnapshot,
      createdAt: getOrderCreatedAt(input.nowIso),
    },
  };
}

export { parseReportProductType };
