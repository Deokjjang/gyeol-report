export type PaymentProviderId = "toss" | "kakao_pay";

export type PaymentProviderStorageId =
  | PaymentProviderId
  | "mock_toss"
  | "mock_kakao_pay";

export type PaymentProviderStatus =
  | "ready"
  | "paid"
  | "failed"
  | "canceled"
  | "refunded";

export type PaymentMethodMetadata = {
  readonly id: PaymentProviderId;
  readonly labelKo: string;
  readonly descriptionKo: string;
};

export const paymentProviderIds = [
  "toss",
  "kakao_pay",
] as const satisfies readonly PaymentProviderId[];

export const paymentProviderStatuses = [
  "ready",
  "paid",
  "failed",
  "canceled",
  "refunded",
] as const satisfies readonly PaymentProviderStatus[];

export const paymentMethodMetadata = [
  {
    id: "toss",
    labelKo: "Toss",
    descriptionKo: "Toss 결제 선택지입니다.",
  },
  {
    id: "kakao_pay",
    labelKo: "KakaoPay",
    descriptionKo: "KakaoPay 결제 선택지입니다.",
  },
] as const satisfies readonly PaymentMethodMetadata[];
