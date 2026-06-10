import type { TossCheckoutRequestDraft } from "./tossCheckoutRequestTypes";

export type TossClientCheckoutCustomerKey = string;

export type TossClientPaymentWindow = {
  readonly requestPayment: (
    paymentRequest: TossCheckoutRequestDraft["requestPayment"],
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
