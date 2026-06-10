import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import type { PaymentCheckoutSessionDraft } from "../../../../lib/payment/paymentCheckoutSessionTypes";
import { preparePaymentCheckoutSession } from "../../../../lib/payment/paymentCheckoutSessionBoundary";
import type { ReadyPaymentOrderView } from "../../../../lib/payment/supabaseReadyPaymentOrderAdapter";
import { createReadyPaymentOrder } from "../../../../lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../../../../lib/payment/supabaseReadyPaymentOrderClient";

type CheckoutPrepareRouteErrorCode =
  | "PAYMENT_CHECKOUT_PREPARE_API_DISABLED"
  | "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST"
  | "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED";

const checkoutPrepareApiEnabledEnv = "PAYMENT_CHECKOUT_PREPARE_API_ENABLED";
const defaultProductType = "saju_mbti_full";
const invalidRequestMessage = "Checkout prepare request is invalid.";
const createFailedMessage = "Checkout could not be prepared.";
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

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env[checkoutPrepareApiEnabledEnv] !== "1") {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_PREPARE_API_DISABLED",
      "Checkout prepare API is disabled.",
      404,
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isJsonObject(json)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (typeof json.provider !== "string") {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isJsonObject(json.inputSnapshot)) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  const client = createSupabaseReadyPaymentOrderClient({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
  const readyOrderResult = await createReadyPaymentOrder({
    productType: json.productType ?? defaultProductType,
    provider: json.provider,
    inputSnapshot: json.inputSnapshot,
    providerOrderId: createProviderOrderId(),
    client,
  });

  if (!readyOrderResult.ok) {
    const isInvalidRequest = isClientInputError(readyOrderResult.error.code);

    return createErrorResponse(
      isInvalidRequest
        ? "PAYMENT_CHECKOUT_PREPARE_INVALID_REQUEST"
        : "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
      isInvalidRequest ? invalidRequestMessage : createFailedMessage,
      isInvalidRequest ? 400 : 500,
    );
  }

  const checkoutResult = preparePaymentCheckoutSession(readyOrderResult.order);

  if (!checkoutResult.ok) {
    return createErrorResponse(
      "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
      createFailedMessage,
      500,
    );
  }

  return NextResponse.json(
    {
      ok: true,
      paymentOrder: mapReadyOrderForResponse(readyOrderResult.order),
      checkoutSession: mapCheckoutSessionForResponse(checkoutResult.session),
    },
    {
      status: 200,
      headers: jsonResponseHeaders,
    },
  );
}
