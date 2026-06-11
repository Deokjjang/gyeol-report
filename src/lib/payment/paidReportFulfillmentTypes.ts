export type FulfillPaidPaymentOrderInput = {
  readonly providerOrderId: string;
};

export type FulfillPaidPaymentOrderResult = {
  readonly paymentOrderId: string;
  readonly providerOrderId: string;
  readonly reportId: string;
  readonly productType: "saju_mbti_full";
  readonly status: "paid";
  readonly amount: number;
  readonly currency: "KRW";
  readonly createdAt: string;
  readonly updatedAt: string;
};
