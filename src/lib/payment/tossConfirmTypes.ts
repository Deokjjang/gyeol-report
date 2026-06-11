export type TossConfirmRequest = {
  readonly paymentKey: string;
  readonly orderId: string;
  readonly amount: number;
};

export type TossConfirmSafeResult = {
  readonly provider: "toss";
  readonly paymentKeyReceived: true;
  readonly orderId: string;
  readonly amount: number;
  readonly status: string;
  readonly method?: string;
  readonly approvedAt?: string;
  readonly rawPaymentStatus?: string;
};

export type TossConfirmErrorCode =
  | "TOSS_CONFIRM_CONFIG_MISSING"
  | "TOSS_CONFIRM_INVALID_REQUEST"
  | "TOSS_CONFIRM_AMOUNT_MISMATCH"
  | "TOSS_CONFIRM_PROVIDER_ERROR";

export type TossConfirmClientResult =
  | {
      readonly ok: true;
      readonly confirm: TossConfirmSafeResult;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: TossConfirmErrorCode;
        readonly message: string;
      };
    };
