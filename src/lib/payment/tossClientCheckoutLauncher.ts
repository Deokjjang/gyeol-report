"use client";

import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";
import type {
  SupportedEasyPay,
  TossClientCheckoutErrorCode,
  TossClientCheckoutLaunchResult,
  TossClientSdk,
  TossClientSdkLoader,
  TossWidgetSheet,
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

/** P 추가 G: 결제위젯 연동 키(gck)인가. 이 키면 우리 화면 버튼은 「결제하기」 하나, 수단 고르기는 토스 위젯 안(어드민 설정: 토스페이·카카오페이). */
export function isTossWidgetClientKey(clientKey: unknown): boolean {
  return typeof clientKey === "string" && /^(test|live)_gck_/.test(clientKey);
}
/** 위젯의 비회원 고객 키(토스 v2 SDK ANONYMOUS). 결제수단 저장(브랜드페이)을 쓰지 않으므로 계정마다 키를 만들지 않는다. */
export const TOSS_WIDGET_ANONYMOUS = "@@ANONYMOUS";
function isWidgetSheet(value: unknown): value is TossWidgetSheet {
  return isRecord(value) && typeof value.open === "function" && typeof value.waitForPay === "function" && typeof value.close === "function";
}

export function isSupportedEasyPay(value: unknown): value is SupportedEasyPay {
  return value === "TOSSPAY" || value === "KAKAOPAY";
}

function isTossRequestPayment(
  value: unknown,
): value is TossCheckoutRequestDraft["requestPayment"] {
  if (!isRecord(value)) {
    return false;
  }

  if (value.method !== "CARD") {
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

  if ((value.customerEmail !== undefined && !isNonEmptyString(value.customerEmail)) || (value.customerMobilePhone !== undefined && !(typeof value.customerMobilePhone === "string" && /^01\d{8,9}$/.test(value.customerMobilePhone)))) {
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
        method: value.requestPayment.method,
        orderId: value.requestPayment.orderId,
        orderName: value.requestPayment.orderName,
        amount: {
          currency: value.requestPayment.amount.currency,
          value: value.requestPayment.amount.value,
        },
        successUrl: value.requestPayment.successUrl,
        failUrl: value.requestPayment.failUrl,
        customerName: value.requestPayment.customerName,
        ...(value.requestPayment.customerEmail ? { customerEmail: value.requestPayment.customerEmail } : {}),
        ...(value.requestPayment.customerMobilePhone ? { customerMobilePhone: value.requestPayment.customerMobilePhone } : {}),
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
  if (!isRecord(input) || !isSupportedEasyPay(input.easyPay)) {
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

  if (isTossWidgetClientKey(parsedRequest.request.clientKey)) {
    const sheet = isWidgetSheet(input.widgetSheet) ? input.widgetSheet : null;
    if (typeof tossClient.widgets !== "function" || !sheet) {
      return failure("TOSS_CLIENT_CHECKOUT_REQUEST_FAILED", "Toss 결제창을 열지 못했습니다.");
    }
    const request = parsedRequest.request.requestPayment;
    try {
      const widgets = tossClient.widgets({ customerKey: TOSS_WIDGET_ANONYMOUS });
      // 금액은 결제수단을 그리기 전에(토스 문서). 금액·주문번호는 서버가 준비한 값 그대로 — 승인 때 서버가 저장 금액과 다시 맞춘다.
      await widgets.setAmount({ currency: request.amount.currency, value: request.amount.value });
      const slots = await sheet.open();
      await Promise.all([
        widgets.renderPaymentMethods({ selector: slots.methods, variantKey: "DEFAULT" }),
        widgets.renderAgreement({ selector: slots.agreement, variantKey: "AGREEMENT" }),
      ]);
      if (!await sheet.waitForPay()) { sheet.close(); return failure("TOSS_CLIENT_CHECKOUT_CANCELED", "결제를 취소했어요."); }
      await widgets.requestPayment({ orderId: request.orderId, orderName: request.orderName, successUrl: request.successUrl, failUrl: request.failUrl,
        ...(request.customerEmail ? { customerEmail: request.customerEmail } : {}), ...(request.customerName ? { customerName: request.customerName } : {}) });
    } catch {
      sheet.close();
      return failure("TOSS_CLIENT_CHECKOUT_REQUEST_FAILED", "Toss 결제창을 열지 못했습니다.");
    }
    return { ok: true, status: "redirect_requested" };
  }

  try {
    const paymentWindow = tossClient.payment({
      customerKey: input.customerKey,
    });

    await paymentWindow.requestPayment({
      ...parsedRequest.request.requestPayment,
      card: { flowMode: "DIRECT", easyPay: input.easyPay },
    });
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
