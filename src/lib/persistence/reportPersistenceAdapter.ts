import type {
  PersistedReportRecord,
  PublicReportResult,
  ReportAccessMode,
  ReportPersistenceStatus,
} from "./reportPersistenceTypes";

export type CreatePersistedReportInput = {
  record: PersistedReportRecord;
};

export type UpdatePersistedReportInput = {
  reportId: string;
  patch: Partial<
    Pick<
      PersistedReportRecord,
      | "updatedAt"
      | "status"
      | "accessMode"
      | "payment"
      | "expiresAt"
      | "deletedAt"
    >
  >;
};

export type FindPersistedReportInput = {
  reportId: string;
  accessToken?: string;
  accessMode?: ReportAccessMode;
};

export type DeletePersistedReportInput = {
  reportId: string;
  deletedAt: string;
};

export type ListPersistedReportsInput = {
  status?: ReportPersistenceStatus;
  limit?: number;
};

export type ReportPersistenceWriteResult =
  | { ok: true; record: PersistedReportRecord }
  | {
      ok: false;
      error: {
        code:
          | "REPORT_STORAGE_WRITE_FAILED"
          | "REPORT_STORAGE_VALIDATION_FAILED";
        messageKo: string;
      };
    };

export type ReportPersistenceDeleteResult =
  | { ok: true; record: PersistedReportRecord }
  | {
      ok: false;
      error: {
        code:
          | "REPORT_NOT_FOUND"
          | "REPORT_ALREADY_DELETED"
          | "REPORT_STORAGE_DELETE_FAILED";
        messageKo: string;
      };
    };

export type ReportPersistenceAdapter = {
  create(
    input: CreatePersistedReportInput,
  ): Promise<ReportPersistenceWriteResult>;
  update(
    input: UpdatePersistedReportInput,
  ): Promise<ReportPersistenceWriteResult>;
  find(input: FindPersistedReportInput): Promise<PublicReportResult>;
  softDelete(
    input: DeletePersistedReportInput,
  ): Promise<ReportPersistenceDeleteResult>;
  list(
    input: ListPersistedReportsInput,
  ): Promise<readonly PersistedReportRecord[]>;
};
