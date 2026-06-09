import type { PaymentProviderId } from "./paymentProviderTypes";
import type {
  ReportProductCurrency,
  ReportProductCatalogItem,
} from "./reportProductCatalog";
import type { ReportProductType } from "./reportProductTypes";

export type PaymentOrderStatus =
  | "ready"
  | "paid"
  | "failed"
  | "canceled"
  | "refunded";

export type PaymentOrderInputSnapshot = Readonly<Record<string, unknown>>;

export type PaymentOrderDraft = {
  readonly paymentOrderId: string;
  readonly productType: ReportProductType;
  readonly provider: PaymentProviderId;
  readonly amount: ReportProductCatalogItem["amount"];
  readonly currency: ReportProductCurrency;
  readonly status: Extract<PaymentOrderStatus, "ready">;
  readonly inputSnapshot: PaymentOrderInputSnapshot;
  readonly createdAt: string;
  readonly providerPaymentId?: string;
  readonly paidAt?: string;
  readonly failedAt?: string;
  readonly canceledAt?: string;
  readonly refundedAt?: string;
};
