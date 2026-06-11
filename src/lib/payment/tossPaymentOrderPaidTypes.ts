export type MarkTossPaymentOrderPaidInput = {
  readonly providerOrderId: string;
  readonly providerPaymentId: string;
  readonly amount: number;
  readonly currency: "KRW";
  readonly paidAt?: string;
};

export type MarkTossPaymentOrderPaidResult = {
  readonly paymentOrderId: string;
  readonly providerOrderId: string;
  readonly productType: "saju_mbti_full";
  readonly provider: "toss";
  readonly amount: number;
  readonly currency: "KRW";
  readonly status: "paid";
  readonly paidAt: string;
  readonly reportId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};
