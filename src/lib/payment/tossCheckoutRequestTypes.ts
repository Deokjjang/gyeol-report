import type { ReportProductCurrency } from "./reportProductCatalog";

export type TossCheckoutRequestDraft = {
  readonly provider: "toss";
  readonly clientKey: string;
  readonly requestPayment: {
    readonly orderId: string;
    readonly orderName: string;
    readonly amount: {
      readonly currency: Extract<ReportProductCurrency, "KRW">;
      readonly value: number;
    };
    readonly successUrl: string;
    readonly failUrl: string;
    readonly customerName: string;
  };
  readonly metadata: {
    readonly paymentOrderId: string;
    readonly productType: string;
  };
};
