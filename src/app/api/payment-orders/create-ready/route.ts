import { randomUUID } from "node:crypto";
import { productOnSale, SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, SALES_PAUSED_CODE } from "../../../../lib/ops/config";
import { salesPauseNotice } from "../../../../lib/ops/salesPause";

import { NextResponse } from "next/server";

import { createReadyPaymentOrder } from "../../../../lib/payment/supabaseReadyPaymentOrderAdapter";
import { createSupabaseReadyPaymentOrderClient } from "../../../../lib/payment/supabaseReadyPaymentOrderClient";

type ReadyPaymentOrderRouteErrorCode =
  | "PAYMENT_READY_ORDER_API_DISABLED"
  | "PAYMENT_READY_ORDER_INVALID_REQUEST"
  | "PAYMENT_READY_ORDER_CREATE_FAILED"
  | typeof SALES_CLOSED_CODE
  | typeof SALES_PAUSED_CODE;

const readyOrderApiEnabledEnv = "PAYMENT_READY_ORDER_API_ENABLED";
const defaultProductType = "saju_mbti_full";
const invalidRequestMessage = "Ready payment order request is invalid.";
const createFailedMessage = "Ready payment order could not be created.";

function createErrorResponse(
  code: ReadyPaymentOrderRouteErrorCode,
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
    { status },
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

export async function POST(request: Request): Promise<NextResponse> {
  if (process.env[readyOrderApiEnabledEnv] !== "1") {
    return createErrorResponse(
      "PAYMENT_READY_ORDER_API_DISABLED",
      "Ready payment order API is disabled.",
      404,
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return createErrorResponse(
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (!isJsonObject(json)) {
    return createErrorResponse(
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  if (typeof json.provider !== "string") {
    return createErrorResponse(
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  // P6d-ops 1: 판매를 닫은 상품(대운·세운)은 주문을 만들지 않는다.
  if (!productOnSale(json.productType ?? defaultProductType)) {
    return createErrorResponse(SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, 409);
  }
  // W3 P0: 4종 판매 중지(DB 스위치) — 주문을 만들지 않는다. 못 읽으면 판매를 계속한다.
  // W4 Q0: 문구는 멈춘 이유대로(AI 장애·연결 오류 = 「AI 서버 점검」, 그 밖 = 기존 문구).
  const pausedNotice = await salesPauseNotice();
  if (pausedNotice) {
    return createErrorResponse(SALES_PAUSED_CODE, pausedNotice, 409);
  }

  if (!isJsonObject(json.inputSnapshot)) {
    return createErrorResponse(
      "PAYMENT_READY_ORDER_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  const client = createSupabaseReadyPaymentOrderClient({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
  const createResult = await createReadyPaymentOrder({
    productType: json.productType ?? defaultProductType,
    provider: json.provider,
    inputSnapshot: json.inputSnapshot,
    providerOrderId: createProviderOrderId(),
    client,
  });

  if (!createResult.ok) {
    const isInvalidRequest = isClientInputError(createResult.error.code);

    return createErrorResponse(
      isInvalidRequest
        ? "PAYMENT_READY_ORDER_INVALID_REQUEST"
        : "PAYMENT_READY_ORDER_CREATE_FAILED",
      isInvalidRequest ? invalidRequestMessage : createFailedMessage,
      isInvalidRequest ? 400 : 500,
    );
  }

  return NextResponse.json(
    {
      ok: true,
      paymentOrder: createResult.order,
    },
    { status: 200 },
  );
}
