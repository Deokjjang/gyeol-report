import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";

export type TossClientCheckoutCustomerKey = string;
export type SupportedEasyPay = "TOSSPAY" | "KAKAOPAY";

export type TossClientPaymentWindow = {
  readonly requestPayment: (
    paymentRequest: TossCheckoutRequestDraft["requestPayment"] & {
      readonly card?: {
        readonly flowMode: "DIRECT";
        readonly easyPay: SupportedEasyPay;
      };
    },
  ) => Promise<void> | void;
};

/**
 * P 추가 G: 토스 결제위젯(v2 widgets). 보여 줄 결제수단(토스페이·카카오페이만)은 토스 결제 어드민의 결제 UI 설정이 정한다 — 코드로 거르지 않는다.
 * 위젯 연동 키(test_gck_/live_gck_, 짝 시크릿 test_gsk_/live_gsk_)일 때만 쓴다.
 */
export type TossWidgets = {
  readonly setAmount: (amount: { readonly currency: string; readonly value: number }) => Promise<void> | void;
  readonly renderPaymentMethods: (params: { readonly selector: string; readonly variantKey?: string }) => Promise<unknown> | unknown;
  readonly renderAgreement: (params: { readonly selector: string; readonly variantKey?: string }) => Promise<unknown> | unknown;
  readonly requestPayment: (params: { readonly orderId: string; readonly orderName: string; readonly successUrl: string; readonly failUrl: string; readonly customerEmail?: string; readonly customerName?: string }) => Promise<void> | void;
};
/** 우리 화면의 결제 시트: 열어서 위젯을 그릴 자리(CSS 선택자)를 주고, 시트 안 [결제하기]를 누르면 true, 닫으면 false. */
export type TossWidgetSheet = {
  readonly open: () => Promise<{ readonly methods: string; readonly agreement: string }>;
  readonly waitForPay: () => Promise<boolean>;
  readonly close: () => void;
};

export type TossClientSdk = {
  readonly payment: (params: {
    readonly customerKey: TossClientCheckoutCustomerKey;
  }) => TossClientPaymentWindow;
  readonly widgets?: (params: { readonly customerKey: TossClientCheckoutCustomerKey }) => TossWidgets;
};

export type TossClientSdkLoader = (
  clientKey: string,
) => Promise<TossClientSdk>;

export type TossClientCheckoutLaunchInput = {
  readonly tossCheckoutRequest: TossCheckoutRequestDraft;
  readonly customerKey: TossClientCheckoutCustomerKey;
  readonly easyPay: SupportedEasyPay;
  readonly loadTossPayments: TossClientSdkLoader;
  /** P 추가 G: 위젯 연동 키일 때 결제위젯을 띄울 시트(없으면 위젯 키로는 결제하지 않는다). */
  readonly widgetSheet?: TossWidgetSheet;
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
  | "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED"
  | "TOSS_CLIENT_CHECKOUT_CANCELED";

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
