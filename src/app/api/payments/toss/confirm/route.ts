import { NextResponse } from "next/server";

import {
  confirmTossPayment,
  TOSS_CONFIRM_REQUIRED_AMOUNT,
} from "../../../../../lib/payment/tossConfirmClient";
import type {
  TossConfirmErrorCode,
  TossConfirmRequest,
  TossConfirmSafeResult,
} from "../../../../../lib/payment/tossConfirmTypes";

export const runtime = "nodejs";

type TossConfirmRouteErrorCode =
  | "TOSS_CONFIRM_API_DISABLED"
  | TossConfirmErrorCode;

type TossConfirmRouteResponse =
  | {
      readonly ok: true;
      readonly confirm: TossConfirmSafeResult;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: TossConfirmRouteErrorCode;
        readonly message: string;
      };
    };

const tossConfirmApiEnabledEnv = "TOSS_CONFIRM_API_ENABLED";
const tossSecretKeyEnv = "TOSS_SECRET_KEY";
const invalidRequestMessage = "Toss confirm request is invalid.";
const amountMismatchMessage =
  "Toss confirm amount does not match the order amount.";
const configMissingMessage = "Toss confirm configuration is missing.";
const jsonResponseHeaders = {
  "content-type": "application/json; charset=utf-8",
} as const;

function createErrorResponse(
  code: TossConfirmRouteErrorCode,
  message: string,
  status: number,
): NextResponse<TossConfirmRouteResponse> {
  return NextResponse.json<TossConfirmRouteResponse>(
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

  return NextResponse.json<TossConfirmRouteResponse>(
    {
      ok: true,
      confirm: result.confirm,
    },
    {
      status: 200,
      headers: jsonResponseHeaders,
    },
  );
}
