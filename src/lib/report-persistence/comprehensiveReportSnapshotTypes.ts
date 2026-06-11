import type { ComprehensiveReportDraft } from "../report-generation/comprehensiveReportDraftTypes";

export type SaveComprehensiveReportSnapshotInput = {
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly draft: ComprehensiveReportDraft;
  readonly generationModel?: string | null;
};

export type SaveComprehensiveReportSnapshotStatus = "ready" | "generated";

export type SaveComprehensiveReportSnapshotResult = {
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly productType: "saju_mbti_full";
  readonly snapshotVersion: "comprehensive_v1_draft";
  readonly generationModel: string | null;
  readonly status: SaveComprehensiveReportSnapshotStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
};
