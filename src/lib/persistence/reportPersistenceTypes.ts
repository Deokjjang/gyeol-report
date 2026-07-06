import type { ReportOutput } from "../report/types";
import type { ProductPreviewSnapshot } from "../report-generation/productPreviewSnapshot";

export type ReportPersistenceStatus =
  | "draft"
  | "generated"
  | "paid_unlocked"
  | "deleted";

export type ReportAccessMode = "preview" | "paid";

export type ReportPaymentStatus =
  | "not_required"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type PersistedReportInputSnapshot = {
  birthDate: string;
  birthTime: string | null;
  birthTimeUnknown: boolean;
  calendarType: "SOLAR" | "LUNAR";
  timezone: string;
  gender?: string;
  mbti?: string;
};

export type ComprehensiveReportOutputSnapshot = {
  snapshotKind?: "comprehensive_report_output";
  report: ReportOutput;
  reportVersion: string;
  renderVersion: string;
  createdAt: string;
};

export type ProductPreviewPersistedSnapshot = {
  snapshotKind: "product_preview";
  productPreview: ProductPreviewSnapshot;
  report: ReportOutput;
  reportVersion: string;
  renderVersion: string;
  createdAt: string;
};

export type PersistedReportSnapshot =
  | ComprehensiveReportOutputSnapshot
  | ProductPreviewPersistedSnapshot;

export type PersistedPaymentLinkage = {
  orderId: string;
  provider: string;
  providerPaymentId: string;
  paymentStatus: ReportPaymentStatus;
  amount: number;
  currency: string;
  paidAt?: string;
  refundedAt?: string;
};

export type PersistedReportRecord = {
  reportId: string;
  createdAt: string;
  updatedAt: string;
  status: ReportPersistenceStatus;
  reportVersion: string;
  calculationVersion: string;
  locale: string;
  accessMode: ReportAccessMode;
  accessTokenHash: string;
  accessTokenCreatedAt: string;
  accessTokenRotatedAt?: string;
  accessTokenVersion: string;
  inputSnapshot: PersistedReportInputSnapshot;
  reportSnapshot: PersistedReportSnapshot;
  payment?: PersistedPaymentLinkage;
  deletedAt?: string;
};

type PublicReportPreviewRecordBase = {
  reportId: string;
  createdAt: string;
  status: ReportPersistenceStatus;
  accessMode: ReportAccessMode;
};

export type PublicComprehensiveReportPreviewRecord = PublicReportPreviewRecordBase & {
  snapshotKind?: "comprehensive_report_output";
  report: ReportOutput;
};

export type PublicProductPreviewRecord = PublicReportPreviewRecordBase & {
  snapshotKind: "product_preview";
  productPreview: ProductPreviewSnapshot;
};

export type PublicReportPreviewRecord =
  | PublicComprehensiveReportPreviewRecord
  | PublicProductPreviewRecord;

export type PublicReportErrorCode =
  | "REPORT_NOT_FOUND"
  | "REPORT_DELETED"
  | "REPORT_ACCESS_DENIED"
  | "REPORT_STORAGE_ERROR";

export type PublicReportResult =
  | { ok: true; record: PublicReportPreviewRecord }
  | {
      ok: false;
      error: {
        code: PublicReportErrorCode;
        messageKo: string;
      };
    };
