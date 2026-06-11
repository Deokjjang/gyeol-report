import { NextResponse } from "next/server";

import {
  confirmTossPayment,
  TOSS_CONFIRM_REQUIRED_AMOUNT,
} from "../../../../../lib/payment/tossConfirmClient";
import { markTossPaymentOrderPaid } from "../../../../../lib/payment/supabaseTossPaymentOrderPaidAdapter";
import { createSupabaseTossPaymentOrderPaidClient } from "../../../../../lib/payment/supabaseTossPaymentOrderPaidClient";
import type { MarkTossPaymentOrderPaidResult } from "../../../../../lib/payment/tossPaymentOrderPaidTypes";
import type {
  TossConfirmErrorCode,
  TossConfirmRequest,
  TossConfirmSafeResult,
} from "../../../../../lib/payment/tossConfirmTypes";

export const runtime = "nodejs";

type TossConfirmRouteErrorCode =
  | "TOSS_CONFIRM_API_DISABLED"
  | "TOSS_PAYMENT_NOT_DONE"
  | "PAYMENT_MARK_PAID_FAILED"
  | TossConfirmErrorCode;

type TossConfirmRouteSafeConfirm = Omit<
  TossConfirmSafeResult,
  "method" | "approvedAt" | "rawPaymentStatus"
> & {
  readonly method: string | null;
  readonly approvedAt: string | null;
  readonly rawPaymentStatus: string;
};

type TossConfirmRouteErrorContext = {
  readonly orderId: string;
  readonly amount: number;
  readonly confirmStatus: string;
  readonly rawPaymentStatus: string;
};

type TossConfirmRouteResponse =
  | {
      readonly ok: true;
      readonly confirm: TossConfirmRouteSafeConfirm;
      readonly paymentOrder: MarkTossPaymentOrderPaidResult;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: TossConfirmRouteErrorCode;
        readonly message: string;
        readonly context?: TossConfirmRouteErrorContext;
      };
    };

const tossConfirmApiEnabledEnv = "TOSS_CONFIRM_API_ENABLED";
const tossSecretKeyEnv = "TOSS_SECRET_KEY";
const supabaseUrlEnv = "SUPABASE_URL";
const supabaseAnonKeyEnv = "SUPABASE_ANON_KEY";
const invalidRequestMessage = "Toss confirm request is invalid.";
const amountMismatchMessage =
  "Toss confirm amount does not match the order amount.";
const configMissingMessage = "Toss confirm configuration is missing.";
const tossPaymentNotDoneMessage = "Toss payment is not done.";
const paymentMarkPaidFailedMessage = "Payment order could not be marked paid.";
const jsonResponseHeaders = {
  "content-type": "application/json; charset=utf-8",
} as const;

function createErrorResponse(
  code: TossConfirmRouteErrorCode,
  message: string,
  status: number,
  context?: TossConfirmRouteErrorContext,
): NextResponse<TossConfirmRouteResponse> {
  return NextResponse.json<TossConfirmRouteResponse>(
    {
      ok: false,
      error: {
        code,
        message,
        ...(context === undefined ? {} : { context }),
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

function parseConfirmRequest(
  value: unknown,
):
  | {
      readonly ok: true;
      readonly request: TossConfirmRequest;
    }
  | {
      readonly ok: false;
      readonly response: NextResponse<TossConfirmRouteResponse>;
    } {
  if (!isJsonObject(value)) {
    return {
      ok: false,
      response: createErrorResponse(
        "TOSS_CONFIRM_INVALID_REQUEST",
        invalidRequestMessage,
        400,
      ),
    };
  }

  if (!isNonEmptyString(value.paymentKey) || !isNonEmptyString(value.orderId)) {
    return {
      ok: false,
      response: createErrorResponse(
        "TOSS_CONFIRM_INVALID_REQUEST",
        invalidRequestMessage,
        400,
      ),
    };
  }

  if (typeof value.amount !== "number" || !Number.isFinite(value.amount)) {
    return {
      ok: false,
      response: createErrorResponse(
        "TOSS_CONFIRM_INVALID_REQUEST",
        invalidRequestMessage,
        400,
      ),
    };
  }

  if (value.amount !== TOSS_CONFIRM_REQUIRED_AMOUNT) {
    return {
      ok: false,
      response: createErrorResponse(
        "TOSS_CONFIRM_AMOUNT_MISMATCH",
        amountMismatchMessage,
        400,
      ),
    };
  }

  return {
    ok: true,
    request: {
      paymentKey: value.paymentKey,
      orderId: value.orderId,
      amount: value.amount,
    },
  };
}

function mapConfirmFailureStatus(code: TossConfirmErrorCode): number {
  if (code === "TOSS_CONFIRM_CONFIG_MISSING") {
    return 500;
  }

  if (
    code === "TOSS_CONFIRM_INVALID_REQUEST" ||
    code === "TOSS_CONFIRM_AMOUNT_MISMATCH"
  ) {
    return 400;
  }

  return 502;
}

function mapConfirmForResponse(
  confirm: TossConfirmSafeResult,
): TossConfirmRouteSafeConfirm {
  return {
    provider: confirm.provider,
    paymentKeyReceived: true,
    orderId: confirm.orderId,
    amount: confirm.amount,
    status: confirm.status,
    method: confirm.method ?? null,
    approvedAt: confirm.approvedAt ?? null,
    rawPaymentStatus: confirm.rawPaymentStatus ?? confirm.status,
  };
}

function createConfirmContext(
  confirm: TossConfirmRouteSafeConfirm,
): TossConfirmRouteErrorContext {
  return {
    orderId: confirm.orderId,
    amount: confirm.amount,
    confirmStatus: confirm.status,
    rawPaymentStatus: confirm.rawPaymentStatus,
  };
}

function createPaidOrderClient() {
  return createSupabaseTossPaymentOrderPaidClient({
    supabaseUrl: process.env[supabaseUrlEnv],
    supabaseAnonKey: process.env[supabaseAnonKeyEnv],
  });
}

export async function POST(
  request: Request,
): Promise<NextResponse<TossConfirmRouteResponse>> {
  if (process.env[tossConfirmApiEnabledEnv] !== "1") {
    return createErrorResponse(
      "TOSS_CONFIRM_API_DISABLED",
      "Toss confirm API is disabled.",
      404,
    );
  }

  let json: unknown;

  try {
    json = await request.json();
  } catch {
    return createErrorResponse(
      "TOSS_CONFIRM_INVALID_REQUEST",
      invalidRequestMessage,
      400,
    );
  }

  const parsedRequest = parseConfirmRequest(json);

  if (!parsedRequest.ok) {
    return parsedRequest.response;
  }

  const secretKey = process.env[tossSecretKeyEnv];

  if (!isNonEmptyString(secretKey)) {
    return createErrorResponse(
      "TOSS_CONFIRM_CONFIG_MISSING",
      configMissingMessage,
      500,
    );
  }

  const result = await confirmTossPayment({
    secretKey,
    paymentKey: parsedRequest.request.paymentKey,
    orderId: parsedRequest.request.orderId,
    amount: parsedRequest.request.amount,
  });

  if (!result.ok) {
    return createErrorResponse(
      result.error.code,
      result.error.message,
      mapConfirmFailureStatus(result.error.code),
    );
  }

  const confirm = mapConfirmForResponse(result.confirm);

  if (confirm.status !== "DONE") {
    return createErrorResponse(
      "TOSS_PAYMENT_NOT_DONE",
      tossPaymentNotDoneMessage,
      409,
      createConfirmContext(confirm),
    );
  }

  const paidResult = await markTossPaymentOrderPaid({
    providerOrderId: confirm.orderId,
    providerPaymentId: parsedRequest.request.paymentKey,
    amount: confirm.amount,
    currency: "KRW",
    ...(confirm.approvedAt === null ? {} : { paidAt: confirm.approvedAt }),
    client: createPaidOrderClient(),
  });

  if (!paidResult.ok) {
    return createErrorResponse(
      "PAYMENT_MARK_PAID_FAILED",
      paymentMarkPaidFailedMessage,
      500,
      createConfirmContext(confirm),
    );
  }

  return NextResponse.json<TossConfirmRouteResponse>(
    {
      ok: true,
      confirm,
      paymentOrder: paidResult.order,
    },
    {
      status: 200,
      headers: jsonResponseHeaders,
    },
  );
}
