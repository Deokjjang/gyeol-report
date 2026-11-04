import type { ReportProductCurrency } from "./reportProductCatalog";

export type TossPaymentWindowMethod = "CARD";

export type TossCheckoutRequestDraft = {
  readonly provider: "toss";
  readonly clientKey: string;
  readonly requestPayment: {
    readonly method: TossPaymentWindowMethod;
    readonly orderId: string;
    readonly orderName: string;
    readonly amount: {
      readonly currency: Extract<ReportProductCurrency, "KRW">;
      readonly value: number;
    };
    readonly successUrl: string;
    readonly failUrl: string;
    readonly customerName: string;
    /** P6d-ops 3: 구매자 이메일·휴대폰(있으면). 토스 결제창·영수증 안내에 쓰인다. */
    readonly customerEmail?: string;
    readonly customerMobilePhone?: string;
  };
  readonly metadata: {
    readonly paymentOrderId: string;
    readonly productType: string;
  };
};
