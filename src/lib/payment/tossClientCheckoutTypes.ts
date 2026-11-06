import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";

export type TossClientCheckoutCustomerKey = string;
export type SupportedEasyPay = "TOSSPAY" | "KAKAOPAY";

export type TossClientPaymentWindow = {
  readonly requestPayment: (
    paymentRequest: TossCheckoutRequestDraft["requestPayment"] & {
      // 2026-11-06: 결제창 기본 화면(DEFAULT = 카드·간편결제 통합결제창) — 고객이 토스 결제창 안에서 수단을 고른다. easyPay는 지정하지 않는다(DEFAULT에서는 무시됨, 토스 문서).
      readonly card?: {
        readonly flowMode: "DEFAULT";
      };
    },
  ) => Promise<void> | void;
};

export type TossClientSdk = {
  readonly payment: (params: {
    readonly customerKey: TossClientCheckoutCustomerKey;
  }) => TossClientPaymentWindow;
};

export type TossClientSdkLoader = (
  clientKey: string,
) => Promise<TossClientSdk>;

export type TossClientCheckoutLaunchInput = {
  readonly tossCheckoutRequest: TossCheckoutRequestDraft;
  readonly customerKey: TossClientCheckoutCustomerKey;
  readonly loadTossPayments: TossClientSdkLoader;
};

export type TossClientCheckoutLaunchStatus =
  | "redirect_requested"
  | "failed_to_launch";

export type TossClientCheckoutErrorCode =
  | "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST"
  | "TOSS_CLIENT_CHECKOUT_INVALID_PROVIDER"
  | "TOSS_CLIENT_CHECKOUT_INVALID_CLIENT_KEY"
  | "TOSS_CLIENT_CHECKOUT_INVALID_CUSTOMER_KEY"
  | "TOSS_CLIENT_CHECKOUT_SDK_LOAD_FAILED"
  | "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED";

export type TossClientCheckoutLaunchResult =
  | {
      readonly ok: true;
      readonly status: Extract<
        TossClientCheckoutLaunchStatus,
        "redirect_requested"
      >;
    }
  | {
      readonly ok: false;
      readonly status: Extract<
        TossClientCheckoutLaunchStatus,
        "failed_to_launch"
      >;
      readonly error: {
        readonly code: TossClientCheckoutErrorCode;
        readonly messageKo: string;
      };
    };
