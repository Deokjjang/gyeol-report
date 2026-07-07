import { Buffer } from "node:buffer";

import type {
  TossConfirmClientResult,
  TossConfirmErrorCode,
  TossConfirmRequest,
  TossConfirmSafeResult,
} from "./tossConfirmTypes";

export const TOSS_CONFIRM_API_URL =
  "https://api.tosspayments.com/v1/payments/confirm";
export const TOSS_CONFIRM_REQUIRED_AMOUNT = 1290;
const tossConfirmRequiredCurrency = "KRW";

type TossConfirmFetchResponse = {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
};

type TossConfirmFetch = (
  input: string,
  init: RequestInit,
) => Promise<TossConfirmFetchResponse>;

type ConfirmTossPaymentInput = TossConfirmRequest & {
  readonly secretKey: string;
  readonly fetchImpl?: TossConfirmFetch;
};

function failure(
  code: TossConfirmErrorCode,
  message: string,
): TossConfirmClientResult {
  return {
    ok: false,
    error: {
      code,
      message,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function readStringField(
  value: Record<string, unknown>,
  field: string,
): string | undefined {
  const fieldValue = value[field];

  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function readNumberField(
  value: Record<string, unknown>,
  field: string,
): number | undefined {
  const fieldValue = value[field];

  return typeof fieldValue === "number" && Number.isFinite(fieldValue)
    ? fieldValue
    : undefined;
}

function sanitizeProviderText(
  value: string,
  secretKey: string,
  paymentKey?: string,
): string {
  const restrictedMarkers = [
    "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
    "payment" + "Key",
    "provider" + "PaymentId",
    "provider" + "_payment" + "_id",
    "access" + "TokenHash",
    "share" + "Token",
    "report" + "_snapshot",
    "service" + "_role",
  ];

  let sanitized = value
    .split(secretKey)
    .join("[masked_key]")
    .replace(/\b(?:test|live)_(?:ck|sk)_[A-Za-z0-9_-]+/g, "[masked_key]")
    .replace(/\b[A-Za-z0-9_-]{32,}\b/g, "[masked_token]")
    .slice(0, 240);

  if (isNonEmptyString(paymentKey)) {
    sanitized = sanitized.split(paymentKey).join("[masked_key]");
  }

  for (const marker of restrictedMarkers) {
    sanitized = sanitized.split(marker).join("[masked]");
  }

  return sanitized.trim() || "Toss confirm request failed.";
}

function createAuthorizationHeader(secretKey: string): string {
  return `Basic ${Buffer.from(`${secretKey}:`, "utf8").toString("base64")}`;
}

function parseProviderError(
  body: unknown,
  secretKey: string,
  paymentKey: string,
): string {
  if (!isRecord(body)) {
    return "Toss confirm request failed.";
  }

  const code = readStringField(body, "code");
  const message = readStringField(body, "message");
  const combined = [code, message].filter(isNonEmptyString).join(": ");

  return sanitizeProviderText(combined, secretKey, paymentKey);
}

async function readJsonSafely(response: TossConfirmFetchResponse): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function mapTossConfirmResponse(
  body: unknown,
  request: TossConfirmRequest,
): TossConfirmClientResult {
  if (!isRecord(body)) {
    return failure(
      "TOSS_CONFIRM_PROVIDER_ERROR",
      "Toss confirm response is invalid.",
    );
  }

  const totalAmount = readNumberField(body, "totalAmount");
  const amount = readNumberField(body, "amount");
  const currency = readStringField(body, "currency");
  const responseOrderId = readStringField(body, "orderId");

  if (
    totalAmount !== undefined &&
    totalAmount !== TOSS_CONFIRM_REQUIRED_AMOUNT
  ) {
    return failure(
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "Toss confirm amount does not match the order amount.",
    );
  }

  if (amount !== undefined && amount !== TOSS_CONFIRM_REQUIRED_AMOUNT) {
    return failure(
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "Toss confirm amount does not match the order amount.",
    );
  }

  if (currency !== undefined && currency !== tossConfirmRequiredCurrency) {
    return failure(
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "Toss confirm currency does not match the order currency.",
    );
  }

  if (responseOrderId !== undefined && responseOrderId !== request.orderId) {
    return failure(
      "TOSS_CONFIRM_PROVIDER_ERROR",
      "Toss confirm response does not match the order.",
    );
  }

  const status = readStringField(body, "status") ?? "UNKNOWN";
  const method = readStringField(body, "method");
  const approvedAt = readStringField(body, "approvedAt");
  const confirm: TossConfirmSafeResult = {
    provider: "toss",
    paymentKeyReceived: true,
    orderId: request.orderId,
    amount: TOSS_CONFIRM_REQUIRED_AMOUNT,
    status,
    ...(method === undefined ? {} : { method }),
    ...(approvedAt === undefined ? {} : { approvedAt }),
    ...(status === "UNKNOWN" ? {} : { rawPaymentStatus: status }),
  };

  return {
    ok: true,
    confirm,
  };
}

export async function confirmTossPayment(
  input: ConfirmTossPaymentInput,
): Promise<TossConfirmClientResult> {
  if (!isNonEmptyString(input.secretKey)) {
    return failure(
      "TOSS_CONFIRM_CONFIG_MISSING",
      "Toss confirm configuration is missing.",
    );
  }

  if (!isNonEmptyString(input.paymentKey) || !isNonEmptyString(input.orderId)) {
    return failure(
      "TOSS_CONFIRM_INVALID_REQUEST",
      "Toss confirm request is invalid.",
    );
  }

  if (input.amount !== TOSS_CONFIRM_REQUIRED_AMOUNT) {
    return failure(
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "Toss confirm amount does not match the order amount.",
    );
  }

  const fetchImpl =
    input.fetchImpl ?? ((url: string, init: RequestInit) => fetch(url, init));
  let response: TossConfirmFetchResponse;

  try {
    response = await fetchImpl(TOSS_CONFIRM_API_URL, {
      method: "POST",
      headers: {
        authorization: createAuthorizationHeader(input.secretKey),
        "content-type": "application/json",
      },
      body: JSON.stringify({
        paymentKey: input.paymentKey,
        orderId: input.orderId,
        amount: TOSS_CONFIRM_REQUIRED_AMOUNT,
      }),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? sanitizeProviderText(error.message, input.secretKey, input.paymentKey)
        : "Toss confirm request failed.";

    return failure("TOSS_CONFIRM_PROVIDER_ERROR", message);
  }

  const body = await readJsonSafely(response);

  if (!response.ok) {
    return failure(
      "TOSS_CONFIRM_PROVIDER_ERROR",
      parseProviderError(body, input.secretKey, input.paymentKey),
    );
  }

  return mapTossConfirmResponse(body, input);
}
