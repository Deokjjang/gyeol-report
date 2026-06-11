import type { ComprehensiveReportDraft } from "../report-generation/comprehensiveReportDraftTypes";

export type PaidReportResultProductType = "saju_mbti_full";
export type PaidReportResultStatus = "ready" | "generated";
export type PaidReportSnapshotStatus = "missing" | "generated";

export type GetPaidReportResultInput = {
  readonly reportId: string;
};

export type GeneratedComprehensiveReportResult = {
  readonly reportId: string;
  readonly productType: PaidReportResultProductType;
  readonly status: PaidReportResultStatus;
  readonly snapshotStatus: PaidReportSnapshotStatus;
  readonly draft: ComprehensiveReportDraft | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type PaidReportResult = GeneratedComprehensiveReportResult;
