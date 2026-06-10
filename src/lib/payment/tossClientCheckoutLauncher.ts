"use client";

import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";
import type {
  TossClientCheckoutErrorCode,
  TossClientCheckoutLaunchResult,
  TossClientSdk,
  TossClientSdkLoader,
} from "./tossClientCheckoutTypes";

function failure(
  code: TossClientCheckoutErrorCode,
  messageKo: string,
): TossClientCheckoutLaunchResult {
  return {
    ok: false,
    status: "failed_to_launch",
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

function isTossSdkLoader(value: unknown): value is TossClientSdkLoader {
  return typeof value === "function";
}

function isTossRequestPayment(
  value: unknown,
): value is TossCheckoutRequestDraft["requestPayment"] {
  if (!isRecord(value)) {
    return false;
  }

  if (
    !isNonEmptyString(value.orderId) ||
    !isNonEmptyString(value.orderName) ||
    !isNonEmptyString(value.successUrl) ||
    !isNonEmptyString(value.failUrl) ||
    !isNonEmptyString(value.customerName)
  ) {
    return false;
  }

  if (!isRecord(value.amount)) {
    return false;
  }

  return value.amount.currency === "KRW" && typeof value.amount.value === "number";
}

function parseTossCheckoutRequest(
  value: unknown,
):
  | {
      readonly ok: true;
      readonly request: TossCheckoutRequestDraft;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: TossClientCheckoutErrorCode;
        readonly messageKo: string;
      };
    } {
  if (!isRecord(value)) {
    return {
      ok: false,
      error: {
        code: "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
        messageKo: "Toss 결제 요청 정보가 올바르지 않습니다.",
      },
    };
  }

  if (value.provider !== "toss") {
    return {
      ok: false,
      error: {
        code: "TOSS_CLIENT_CHECKOUT_INVALID_PROVIDER",
        messageKo: "Toss 결제 실행은 Toss 요청만 사용할 수 있습니다.",
      },
    };
  }

  if (!isNonEmptyString(value.clientKey)) {
    return {
      ok: false,
      error: {
        code: "TOSS_CLIENT_CHECKOUT_INVALID_CLIENT_KEY",
        messageKo: "Toss 클라이언트 키가 필요합니다.",
      },
    };
  }

  if (!isTossRequestPayment(value.requestPayment) || !isRecord(value.metadata)) {
    return {
      ok: false,
      error: {
        code: "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
        messageKo: "Toss 결제 요청 정보가 올바르지 않습니다.",
      },
    };
  }

  if (
    !isNonEmptyString(value.metadata.paymentOrderId) ||
    !isNonEmptyString(value.metadata.productType)
  ) {
    return {
      ok: false,
      error: {
        code: "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
        messageKo: "Toss 결제 요청 정보가 올바르지 않습니다.",
      },
    };
  }

  return {
    ok: true,
    request: {
      provider: "toss",
      clientKey: value.clientKey,
      requestPayment: {
        orderId: value.requestPayment.orderId,
        orderName: value.requestPayment.orderName,
        amount: {
          currency: value.requestPayment.amount.currency,
          value: value.requestPayment.amount.value,
        },
        successUrl: value.requestPayment.successUrl,
        failUrl: value.requestPayment.failUrl,
        customerName: value.requestPayment.customerName,
      },
      metadata: {
        paymentOrderId: value.metadata.paymentOrderId,
        productType: value.metadata.productType,
      },
    },
  };
}

export async function launchTossCheckout(
  input: unknown,
): Promise<TossClientCheckoutLaunchResult> {
  if (!isRecord(input)) {
    return failure(
      "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
      "Toss 결제 실행 요청이 올바르지 않습니다.",
    );
  }

  const parsedRequest = parseTossCheckoutRequest(input.tossCheckoutRequest);

  if (!parsedRequest.ok) {
    return failure(parsedRequest.error.code, parsedRequest.error.messageKo);
  }

  if (!isNonEmptyString(input.customerKey)) {
    return failure(
      "TOSS_CLIENT_CHECKOUT_INVALID_CUSTOMER_KEY",
      "Toss 고객 식별 키가 필요합니다.",
    );
  }

  if (!isTossSdkLoader(input.loadTossPayments)) {
    return failure(
      "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST",
      "Toss 결제 실행 요청이 올바르지 않습니다.",
    );
  }

  let tossClient: TossClientSdk;

  try {
    tossClient = await input.loadTossPayments(parsedRequest.request.clientKey);
  } catch {
    return failure(
      "TOSS_CLIENT_CHECKOUT_SDK_LOAD_FAILED",
      "Toss 결제 모듈을 불러오지 못했습니다.",
    );
  }

  try {
    const paymentWindow = tossClient.payment({
      customerKey: input.customerKey,
    });

    await paymentWindow.requestPayment(parsedRequest.request.requestPayment);
  } catch {
    return failure(
      "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED",
      "Toss 결제창을 열지 못했습니다.",
    );
  }

  return {
    ok: true,
    status: "redirect_requested",
  };
}
