import {
  paymentMethodMetadata,
  paymentProviderIds,
} from "./paymentProviderTypes";
import type {
  PaymentMethodMetadata,
  PaymentProviderId,
  PaymentProviderStorageId,
} from "./paymentProviderTypes";

export type PaymentProviderBoundaryErrorCode =
  "PAYMENT_PROVIDER_UNSUPPORTED";

export type SupportedPaymentProviderResult =
  | {
      readonly ok: true;
      readonly providerId: PaymentProviderId;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: PaymentProviderBoundaryErrorCode;
        readonly messageKo: string;
      };
    };

export type MockPaymentProviderStorageId = Extract<
  PaymentProviderStorageId,
  "mock_toss" | "mock_kakao_pay"
>;

export function getSupportedPaymentProviders(): readonly PaymentMethodMetadata[] {
  return paymentMethodMetadata;
}

export function parsePaymentProviderId(
  value: unknown,
): PaymentProviderId | null {
  return paymentProviderIds.includes(value as PaymentProviderId)
    ? (value as PaymentProviderId)
    : null;
}

export function assertSupportedPaymentProvider(
  value: unknown,
): SupportedPaymentProviderResult {
  const providerId = parsePaymentProviderId(value);

  if (providerId === null) {
    return {
      ok: false,
      error: {
        code: "PAYMENT_PROVIDER_UNSUPPORTED",
        messageKo: "지원하지 않는 결제 수단입니다.",
      },
    };
  }

  return {
    ok: true,
    providerId,
  };
}

export function toMockPaymentProviderStorageId(
  provider: PaymentProviderId,
): MockPaymentProviderStorageId {
  return provider === "toss" ? "mock_toss" : "mock_kakao_pay";
}
