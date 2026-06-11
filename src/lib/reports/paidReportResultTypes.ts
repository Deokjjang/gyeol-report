export type PaidReportResultProductType = "saju_mbti_full";
export type PaidReportResultStatus = "ready";

export type GetPaidReportResultInput = {
  readonly reportId: string;
};

export type PaidReportResult = {
  readonly reportId: string;
  readonly productType: PaidReportResultProductType;
  readonly status: PaidReportResultStatus;
  readonly title: string;
  readonly placeholderText: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};
