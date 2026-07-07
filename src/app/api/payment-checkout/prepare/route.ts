import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import type { PaymentCheckoutSessionDraft } from "../../../../lib/payment/paymentCheckoutSessionTypes";
import { preparePaymentCheckoutSession } from "../../../../lib/payment/paymentCheckoutSessionBoundary";
import { createPaymentOrderDraft } from "../../../../lib/payment/paymentOrderBoundary";
import type { PaymentOrderRecord } from "../../../../lib/payment/paymentOrderPersistenceTypes";
import { createPaymentOrderPersistenceRuntime } from "../../../../lib/payment/paymentOrderRuntime";
import type { TossCheckoutRequestDraft } from "../../../../lib/payment/tossCheckoutRequestTypes";
import { prepareTossCheckoutRequest } from "../../../../lib/payment/tossCheckoutRequestAdapter";

type ReadyPaymentOrderView = {
  readonly paymentOrderId: PaymentOrderRecord["paymentOrderId"];
  readonly productType: PaymentOrderRecord["productType"];
  readonly provider: PaymentOrderRecord["provider"];
  readonly amount: PaymentOrderRecord["amount"];
  readonly currency: PaymentOrderRecord["currency"];
  readonly status: "ready";
  readonly providerOrderId: PaymentOrderRecord["providerOrderId"];
  readonly createdAt: PaymentOrderRecord["createdAt"];
  readonly updatedAt: PaymentOrderRecord["updatedAt"];
};

type CheckoutPrepareRouteErrorCode =
  | "PAYMENT_CHECKOUT_INVALID_REQUEST"
  | "PAYMENT_CHECKOUT_UNAVAILABLE";

const tossClientKeyEnv = "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY";
const tossSecretKeyEnv = "TOSS_PAYMENTS_SECRET_KEY";
const tossAllowLocalhostRedirectsEnv = "TOSS_ALLOW_LOCALHOST_REDIRECTS";
const defaultProductType = "saju_mbti_full";
const invalidRequestMessage = "결제 요청 정보가 올바르지 않습니다.";
const createFailedMessage =
  "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const tossCheckoutConfigMissingMessage =
  "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.";
const jsonResponseHeaders = {
  "content-type": "application/json; charset=utf-8",
} as const;

function createErrorResponse(
  code: CheckoutPrepareRouteErrorCode,
  message: string,
  status: number,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    {
      status,
      headers: jsonResponseHeaders,
    },
  );
}

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isClientInputError(code: string): boolean {
  return (
    code === "PAYMENT_PRODUCT_UNSUPPORTED" ||
    code === "PAYMENT_PRODUCT_NOT_PURCHASABLE" ||
    code === "PAYMENT_ORDER_INVALID_PROVIDER" ||
    code === "PAYMENT_ORDER_INVALID_INPUT"
  );
}

function createProviderOrderId(): string {
  return `provider_order_${randomUUID()}`;
}

function mapRecordToReadyOrderView(record: PaymentOrderRecord): ReadyPaymentOrderView {
  return {
    paymentOrderId: record.paymentOrderId,
    productType: record.productType,
    provider: record.provider,
    amount: record.amount,
    currency: record.currency,
    status: "ready",
    providerOrderId: record.providerOrderId,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function createReadyPaymentOrderRecord(input: {
  readonly productType: unknown;
  readonly provider: unknown;
  readonly inputSnapshot: unknown;
  readonly providerOrderId: string;
}):
  | {
      readonly ok: true;
      readonly record: PaymentOrderRecord;
    }
  | {
      readonly ok: false;
      readonly code: string;
    } {
  const draftResult = createPaymentOrderDraft({
    productType: input.productType,
    provider: input.provider,
    inputSnapshot: input.inputSnapshot,
  });

  if (!draftResult.ok) {
    return {
      ok: false,
      code: draftResult.error.code,
    };
  }

  const createdAt = draftResult.order.createdAt;

  return {
    ok: true,
    record: {
      ...draftResult.order,
      providerPaymentId: null,
      providerOrderId: input.providerOrderId,
      reportId: null,
      reportGenerationStatus: "not_started",
      updatedAt: createdAt,
      requestedAt: createdAt,
      paidAt: null,
      failedAt: null,
      canceledAt: null,
      refundedAt: null,
      deletedAt: null,
    },
  };
}

function mapReadyOrderForResponse(order: ReadyPaymentOrderView): ReadyPaymentOrderView {
  return {
    paymentOrderId: order.paymentOrderId,
    productType: order.productType,
    provider: order.provider,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
    providerOrderId: order.providerOrderId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function mapProviderPayloadForResponse(
  payload: PaymentCheckoutSessionDraft["providerPayload"],
): PaymentCheckoutSessionDraft["providerPayload"] {
  if (payload.provider === "toss") {
    return {
      provider: payload.provider,
      orderId: payload.orderId,
      orderName: payload.orderName,
      amount: payload.amount,
      currency: payload.currency,
      customerNameLabel: payload.customerNameLabel,
    };
  }

  return {
    provider: payload.provider,
    partnerOrderId: payload.partnerOrderId,
    itemName: payload.itemName,
    quantity: payload.quantity,
    totalAmount: payload.totalAmount,
    currency: payload.currency,
  };
}

function mapCheckoutSessionForResponse(
  session: PaymentCheckoutSessionDraft,
): PaymentCheckoutSessionDraft {
  return {
    paymentOrderId: session.paymentOrderId,
    providerOrderId: session.providerOrderId,
    productType: session.productType,
    productLabelKo: session.productLabelKo,
    provider: session.provider,
    amount: session.amount,
    currency: session.currency,
    status: session.status,
    checkoutMode: session.checkoutMode,
    providerPayload: mapProviderPayloadForResponse(session.providerPayload),
  };
}

function createSuccessBody(
  order: ReadyPaymentOrderView,
  session: PaymentCheckoutSessionDraft,
  tossCheckoutRequest?: TossCheckoutRequestDraft,
): {
  readonly ok: true;
  readonly paymentOrder: ReadyPaymentOrderView;
  readonly checkoutSession: PaymentCheckoutSessionDraft;
  readonly tossCheckoutRequest?: TossCheckoutRequestDraft;
} {
  const body: {
    readonly ok: true;
    readonly paymentOrder: ReadyPaymentOrderView;
    readonly checkoutSession: PaymentCheckoutSessionDraft;
  } = {
    ok: true,
    paymentOrder: mapReadyOrderForResponse(order),
    checkoutSession: mapCheckoutSessionForResponse(session),
  };

  if (tossCheckoutRequest === undefined) {
    return body;
  }

  return {
    ...body,
    tossCheckoutRequest,
  };
}

function createOptionalTossCheckoutRequest(
  session: PaymentCheckoutSessionDraft,
  requestUrl: string,
):
  | {
      readonly ok: true;
      readonly draft?: TossCheckoutRequestDraft;
    }
  | {
      readonly ok: false;
      readonly response: NextResponse;
    } {
  if (session.provider !== "toss") {
    return { ok: true };
  }

  const clientKey = process.env[tossClientKeyEnv];
  const secretKey = process.env[tossSecretKeyEnv];
  const requestOrigin = new URL(requestUrl).origin;
  const successUrl = new URL("/payments/toss/success", requestOrigin).toString();
  const failUrl = new URL("/payments/toss/fail", requestOrigin).toString();
  const requestHostname = new URL(requestOrigin).hostname;
  const isLocalhostRedirect =
    requestHostname === "localhost" || requestHostname === "127.0.0.1";

  if (
    !isNonEmptyString(clientKey) ||
    !isNonEmptyString(secretKey)
  ) {
    return {
      ok: false,
      response: createErrorResponse(
        "PAYMENT_CHECKOUT_UNAVAILABLE",
        tossCheckoutConfigMissingMessage,
        500,
      ),
    };
  }

  const tossResult = prepareTossCheckoutRequest({
    checkoutSession: session,
    clientKey,
    successUrl,
    failUrl,
    allowLocalhostRedirects:
      isLocalhostRedirect || process.env[tossAllowLocalhostRedirectsEnv] === "1",
  });

  if (!tossResult.ok) {
    return {
      ok: false,
      response: createErrorResponse(
        "PAYMENT_CHECKOUT_UNAVAILABLE",
        tossCheckoutConfigMissingMessage,
        500,
      ),
    };
  }

  return {
    ok: true,
    draft: tossResult.draft,
  };
}

export async function POST(request: Request): Promise<NextResponse> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isJsonObject(json)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (typeof json.provider !== "string") {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isJsonObject(json.inputSnapshot)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  const readyOrderRecordResult = createReadyPaymentOrderRecord({
    productType: json.productType ?? defaultProductType,
    provider: json.provider,
    inputSnapshot: json.inputSnapshot,
    providerOrderId: createProviderOrderId(),
  });

  if (!readyOrderRecordResult.ok) {
    const isInvalidRequest = isClientInputError(readyOrderRecordResult.code);

    return createErrorResponse(
      isInvalidRequest
        ? "PAYMENT_CHECKOUT_INVALID_REQUEST"
        : "PAYMENT_CHECKOUT_UNAVAILABLE",
      isInvalidRequest ? invalidRequestMessage : createFailedMessage,
      isInvalidRequest ? 400 : 500,
    );
  }

  const orderRuntime = createPaymentOrderPersistenceRuntime();
  const createOrderResult = await orderRuntime.create(
    readyOrderRecordResult.record,
  );

  if (!createOrderResult.ok) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      createFailedMessage,
      500,
    );
  }

  const readyOrder = mapRecordToReadyOrderView(createOrderResult.value);
  const checkoutResult = preparePaymentCheckoutSession(readyOrder);

  if (!checkoutResult.ok) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      createFailedMessage,
      500,
    );
  }

  const tossCheckoutRequestResult = createOptionalTossCheckoutRequest(
    checkoutResult.session,
    request.url,
  );

  if (!tossCheckoutRequestResult.ok) {
    return tossCheckoutRequestResult.response;
  }

  return NextResponse.json(
    createSuccessBody(
      readyOrder,
      checkoutResult.session,
      tossCheckoutRequestResult.draft,
    ),
    {
      status: 200,
      headers: jsonResponseHeaders,
    },
  );
}
