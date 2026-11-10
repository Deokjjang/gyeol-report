import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";

export type TossClientCheckoutCustomerKey = string;
export type SupportedEasyPay = "TOSSPAY" | "KAKAOPAY";

export type TossClientPaymentWindow = {
  readonly requestPayment: (
    paymentRequest: TossCheckoutRequestDraft["requestPayment"] & {
      // 2026-11-10: 간편결제 바로 열기(DIRECT + easyPay). 통합결제창(DEFAULT)은 계약하지 않은 카드·페이코·삼성페이까지 보여서 쓰지 않는다.
      // 수단은 우리 화면 하단 시트의 두 버튼(카카오페이·토스페이)에서 고른다.
      readonly card?: {
        readonly flowMode: "DIRECT";
        readonly easyPay: SupportedEasyPay;
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
  readonly easyPay: SupportedEasyPay;
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
