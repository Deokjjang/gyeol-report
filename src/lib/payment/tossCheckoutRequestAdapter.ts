import type { PaymentCheckoutSessionDraft } from "./paymentCheckoutSessionTypes";
import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";

export type TossCheckoutRequestErrorCode =
  | "TOSS_CHECKOUT_INVALID_SESSION"
  | "TOSS_CHECKOUT_UNSUPPORTED_PROVIDER"
  | "TOSS_CHECKOUT_INVALID_CLIENT_KEY"
  | "TOSS_CHECKOUT_INVALID_SUCCESS_URL"
  | "TOSS_CHECKOUT_INVALID_FAIL_URL";

export type PrepareTossCheckoutRequestInput = {
  readonly checkoutSession: unknown;
  readonly clientKey: unknown;
  readonly successUrl: unknown;
  readonly failUrl: unknown;
  readonly allowLocalhostRedirects?: boolean;
};

export type TossCheckoutRequestResult =
  | {
      readonly ok: true;
      readonly draft: TossCheckoutRequestDraft;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: TossCheckoutRequestErrorCode;
        readonly messageKo: string;
      };
    };

type TossCheckoutSession = PaymentCheckoutSessionDraft & {
  readonly provider: "toss";
  readonly providerPayload: Extract<
    PaymentCheckoutSessionDraft["providerPayload"],
    { readonly provider: "toss" }
  >;
};

function failure(
  code: TossCheckoutRequestErrorCode,
  messageKo: string,
): TossCheckoutRequestResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPreparedTossSession(value: unknown): value is TossCheckoutSession {
  if (!isRecord(value)) {
    return false;
  }

  if (value.provider !== "toss") {
    return false;
  }

  if (
    !isNonEmptyString(value.paymentOrderId) ||
    !isNonEmptyString(value.providerOrderId) ||
    !isNonEmptyString(value.productType) ||
    !isNonEmptyString(value.productLabelKo) ||
    value.status !== "prepared" ||
    value.checkoutMode !== "provider_redirect_pending" ||
    value.amount !== 990 ||
    value.currency !== "KRW"
  ) {
    return false;
  }

  if (!isRecord(value.providerPayload)) {
    return false;
  }

  return (
    value.providerPayload.provider === "toss" &&
    isNonEmptyString(value.providerPayload.customerNameLabel)
  );
}

function isValidRedirectUrl(
  value: unknown,
  allowLocalhostRedirects: boolean,
): value is string {
  if (!isNonEmptyString(value)) {
    return false;
  }

  try {
    const parsed = new URL(value);

    if (parsed.protocol === "https:") {
      return true;
    }

    return (
      allowLocalhostRedirects &&
      parsed.protocol === "http:" &&
      (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
    );
  } catch {
    return false;
  }
}

export function prepareTossCheckoutRequest(
  input: PrepareTossCheckoutRequestInput,
): TossCheckoutRequestResult {
  if (isRecord(input.checkoutSession) && input.checkoutSession.provider !== "toss") {
    return failure(
      "TOSS_CHECKOUT_UNSUPPORTED_PROVIDER",
      "Toss 결제 요청은 Toss 체크아웃 세션만 사용할 수 있습니다.",
    );
  }

  if (!isPreparedTossSession(input.checkoutSession)) {
    return failure(
      "TOSS_CHECKOUT_INVALID_SESSION",
      "Toss 결제 요청 세션이 올바르지 않습니다.",
    );
  }

  if (!isNonEmptyString(input.clientKey)) {
    return failure(
      "TOSS_CHECKOUT_INVALID_CLIENT_KEY",
      "Toss 클라이언트 키가 필요합니다.",
    );
  }

  const allowLocalhostRedirects = input.allowLocalhostRedirects === true;

  if (!isValidRedirectUrl(input.successUrl, allowLocalhostRedirects)) {
    return failure(
      "TOSS_CHECKOUT_INVALID_SUCCESS_URL",
      "Toss 성공 리다이렉트 URL이 올바르지 않습니다.",
    );
  }

  if (!isValidRedirectUrl(input.failUrl, allowLocalhostRedirects)) {
    return failure(
      "TOSS_CHECKOUT_INVALID_FAIL_URL",
      "Toss 실패 리다이렉트 URL이 올바르지 않습니다.",
    );
  }

  const checkoutSession = input.checkoutSession;

  return {
    ok: true,
    draft: {
      provider: "toss",
      clientKey: input.clientKey,
      requestPayment: {
        method: "CARD",
        orderId: checkoutSession.providerOrderId,
        orderName: checkoutSession.productLabelKo,
        amount: {
          currency: checkoutSession.currency,
          value: checkoutSession.amount,
        },
        successUrl: input.successUrl,
        failUrl: input.failUrl,
        customerName: checkoutSession.providerPayload.customerNameLabel,
      },
      metadata: {
        paymentOrderId: checkoutSession.paymentOrderId,
        productType: checkoutSession.productType,
      },
    },
  };
}
