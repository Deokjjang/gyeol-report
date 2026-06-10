import type { PaymentProviderId } from "./paymentProviderTypes";
import type { ReportProductCurrency } from "./reportProductCatalog";
import type { ReportProductType } from "./reportProductTypes";

export type PaymentCheckoutSessionStatus = "prepared";

export type PaymentCheckoutProvider = "toss" | "kakao_pay";

export type TossCheckoutProviderPayload = {
  readonly provider: Extract<PaymentCheckoutProvider, "toss">;
  readonly orderId: string;
  readonly orderName: string;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
  readonly customerNameLabel: string;
};

export type KakaoPayCheckoutProviderPayload = {
  readonly provider: Extract<PaymentCheckoutProvider, "kakao_pay">;
  readonly partnerOrderId: string;
  readonly itemName: string;
  readonly quantity: 1;
  readonly totalAmount: number;
  readonly currency: ReportProductCurrency;
};

export type PaymentCheckoutProviderPayload =
  | TossCheckoutProviderPayload
  | KakaoPayCheckoutProviderPayload;

export type PaymentCheckoutSessionDraft = {
  readonly paymentOrderId: string;
  readonly providerOrderId: string;
  readonly productType: ReportProductType;
  readonly productLabelKo: string;
  readonly provider: PaymentProviderId;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
  readonly status: PaymentCheckoutSessionStatus;
  readonly checkoutMode: "provider_redirect_pending";
  readonly providerPayload: PaymentCheckoutProviderPayload;
};
