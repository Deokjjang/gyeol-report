import { withDeadline } from "../network/withDeadline";
import { REPORT_PRICE_KRW, isDirectReportPaymentAmount } from "./reportProductCatalog";
import { Buffer } from "node:buffer";

import type {
  TossConfirmClientResult,
  TossConfirmErrorCode,
  TossConfirmRequest,
  TossConfirmSafeResult,
} from "./tossConfirmTypes";

export const TOSS_CONFIRM_API_URL =
  "https://api.tosspayments.com/v1/payments/confirm";
export const TOSS_CONFIRM_TIMEOUT_MS = 15_000;
export const TOSS_CONFIRM_REQUIRED_AMOUNT = REPORT_PRICE_KRW;
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
  // Internal order snapshot authority, never forwarded from a request body.
  // Historical direct-order amounts remain valid; DB claim verifies the snapshot.
  readonly expectedAmount?: number;
  readonly verifyIdentity?: boolean;
  readonly secretKey: string;
  readonly fetchImpl?: TossConfirmFetch;
  readonly signal?: AbortSignal;
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
  verifyIdentity = false,
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
  if (verifyIdentity && (body.paymentKey !== request.paymentKey || responseOrderId !== request.orderId || currency !== "KRW" || totalAmount !== request.amount)) {
    return failure("TOSS_CONFIRM_PROVIDER_ERROR", "Toss payment identity does not match the verified order.");
  }

  if (
    totalAmount !== undefined &&
    totalAmount !== request.amount
  ) {
    return failure(
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "Toss confirm amount does not match the order amount.",
    );
  }

  if (amount !== undefined && amount !== request.amount) {
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
    amount: request.amount,
    status,
    ...(verifyIdentity ? { currency: "KRW" as const, paymentKeyVerified: true as const } : {}),
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

  const expectedAmount = input.expectedAmount ?? input.amount;
  if (!Number.isSafeInteger(expectedAmount) || expectedAmount < 100 || input.amount !== expectedAmount || (input.expectedAmount === undefined && !isDirectReportPaymentAmount(input.amount))) {
    return failure(
      "TOSS_CONFIRM_AMOUNT_MISMATCH",
      "Toss confirm amount does not match the order amount.",
    );
  }

  const fetchImpl =
    input.fetchImpl ?? ((url: string, init: RequestInit) => fetch(url, init));
  let response: TossConfirmFetchResponse;
  let body: unknown;

  try {
    ({ response, body } = await withDeadline(async signal => {
      const response = await fetchImpl(TOSS_CONFIRM_API_URL, {
        signal,
        method: "POST",
        headers: {
          authorization: createAuthorizationHeader(input.secretKey),
          "content-type": "application/json",
          "Idempotency-Key": `confirm-${input.orderId}`,
        },
        body: JSON.stringify({
          paymentKey: input.paymentKey,
          orderId: input.orderId,
          amount: expectedAmount,
        }),
      });
      return { response, body: await readJsonSafely(response) };
    }, TOSS_CONFIRM_TIMEOUT_MS, input.signal));
  } catch (error) {
    const message =
      error instanceof Error
        ? sanitizeProviderText(error.message, input.secretKey, input.paymentKey)
        : "Toss confirm request failed.";

    return failure("TOSS_CONFIRM_PROVIDER_ERROR", message);
  }

  if (!response.ok) {
    return failure(
      "TOSS_CONFIRM_PROVIDER_ERROR",
      parseProviderError(body, input.secretKey, input.paymentKey),
    );
  }

  if (input.expectedAmount !== undefined && (!isRecord(body) || (body.totalAmount ?? body.amount) !== expectedAmount)) {
    return failure("TOSS_CONFIRM_AMOUNT_MISMATCH", "Toss confirm amount does not match the verified order amount.");
  }

  return mapTossConfirmResponse(body, input, input.verifyIdentity);
}

// Recovery only reads the provider fact first. A previous successful approval is
// not reconfirmed/charged. IN_PROGRESS may finish the same authenticated payment.
export async function confirmTossBundlePayment(input: ConfirmTossPaymentInput, recovery = false): Promise<TossConfirmClientResult> {
  const strict = { ...input, expectedAmount: input.expectedAmount ?? input.amount, verifyIdentity: true };
  if (!recovery) return confirmTossPayment(strict);
  if (!isNonEmptyString(input.secretKey) || !isNonEmptyString(input.paymentKey)) return failure("TOSS_CONFIRM_CONFIG_MISSING", "Toss configuration is missing.");
  try {
    const fetchImpl = input.fetchImpl ?? fetch;
    const result = await withDeadline(async signal => {
      const response = await fetchImpl(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(input.paymentKey)}`, { method: "GET", signal, headers: { authorization: createAuthorizationHeader(input.secretKey) } });
      if (!response.ok) return failure("TOSS_CONFIRM_PROVIDER_ERROR", "Toss payment lookup is pending.");
      return mapTossConfirmResponse(await readJsonSafely(response), input, true);
    }, TOSS_CONFIRM_TIMEOUT_MS, input.signal);
    return result.ok && result.confirm.status === "IN_PROGRESS" ? confirmTossPayment(strict) : result;
  } catch { return failure("TOSS_CONFIRM_PROVIDER_ERROR", "Toss payment lookup is pending."); }
}

// Official orderId lookup for a lost bundle callback. Read-only: even an
// IN_PROGRESS response does not authorize a new confirm request here.
export async function lookupTossBundleOrder(input: Omit<ConfirmTossPaymentInput, "paymentKey">): Promise<(Extract<TossConfirmClientResult, { ok: true }> & { paymentKey: string }) | { ok: false }> {
  if (!isNonEmptyString(input.secretKey) || !/^bundle_toss_[a-f0-9]{32}$/.test(input.orderId)
    || !Number.isSafeInteger(input.amount) || input.amount < 100) return { ok: false };
  try {
    return await withDeadline(async signal => {
      const response = await (input.fetchImpl ?? fetch)(`https://api.tosspayments.com/v1/payments/orders/${encodeURIComponent(input.orderId)}`, {
        method: "GET", signal, headers: { authorization: createAuthorizationHeader(input.secretKey) },
      });
      if (!response.ok) return { ok: false as const };
      const body = await readJsonSafely(response);
      if (!isRecord(body) || !isNonEmptyString(body.paymentKey) || body.paymentKey.length > 200) return { ok: false as const };
      const result = mapTossConfirmResponse(body, { orderId: input.orderId, amount: input.amount, paymentKey: body.paymentKey }, true);
      return result.ok ? { ...result, paymentKey: body.paymentKey } : { ok: false as const };
    }, TOSS_CONFIRM_TIMEOUT_MS, input.signal);
  } catch { return { ok: false }; }
}
