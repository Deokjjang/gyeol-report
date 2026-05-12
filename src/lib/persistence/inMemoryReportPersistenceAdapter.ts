import type {
  DeletePersistedReportInput,
  FindPersistedReportInput,
  ListPersistedReportsInput,
  ReportPersistenceAdapter,
  ReportPersistenceDeleteResult,
  ReportPersistenceWriteResult,
  UpdatePersistedReportInput,
} from "./reportPersistenceAdapter";
import type {
  PersistedReportRecord,
  PublicReportResult,
} from "./reportPersistenceTypes";

export function createInMemoryReportPersistenceAdapter(
  initialRecords: readonly PersistedReportRecord[] = [],
): ReportPersistenceAdapter {
  const records = new Map<string, PersistedReportRecord>();

  for (const record of initialRecords) {
    records.set(record.reportId, record);
  }

  return {
    async create(input): Promise<ReportPersistenceWriteResult> {
      if (records.has(input.record.reportId)) {
        return {
          ok: false,
          error: {
            code: "REPORT_STORAGE_VALIDATION_FAILED",
            messageKo: "이미 존재하는 리포트입니다.",
          },
        };
      }

      records.set(input.record.reportId, input.record);

      return {
        ok: true,
        record: input.record,
      };
    },

    async update(
      input: UpdatePersistedReportInput,
    ): Promise<ReportPersistenceWriteResult> {
      const current = records.get(input.reportId);

      if (!current) {
        return {
          ok: false,
          error: {
            code: "REPORT_STORAGE_WRITE_FAILED",
            messageKo: "리포트 정보를 찾을 수 없습니다.",
          },
        };
      }

      const updated: PersistedReportRecord = {
        ...current,
        ...input.patch,
      };

      records.set(input.reportId, updated);

      return {
        ok: true,
        record: updated,
      };
    },

    async find(input: FindPersistedReportInput): Promise<PublicReportResult> {
      const record = records.get(input.reportId);

      if (!record) {
        return {
          ok: false,
          error: {
            code: "REPORT_NOT_FOUND",
            messageKo: "리포트를 찾을 수 없습니다.",
          },
        };
      }

      if (record.status === "deleted") {
        return {
          ok: false,
          error: {
            code: "REPORT_DELETED",
            messageKo: "삭제된 리포트입니다.",
          },
        };
      }

      if (input.accessMode === "paid" && record.accessMode !== "paid") {
        return {
          ok: false,
          error: {
            code: "REPORT_ACCESS_DENIED",
            messageKo: "전체 리포트 접근 권한을 확인할 수 없습니다.",
          },
        };
      }

      return {
        ok: true,
        record: {
          reportId: record.reportId,
          createdAt: record.createdAt,
          status: record.status,
          accessMode: record.accessMode,
          report: record.reportSnapshot.report,
        },
      };
    },

    async softDelete(
      input: DeletePersistedReportInput,
    ): Promise<ReportPersistenceDeleteResult> {
      const current = records.get(input.reportId);

      if (!current) {
        return {
          ok: false,
          error: {
            code: "REPORT_NOT_FOUND",
            messageKo: "리포트를 찾을 수 없습니다.",
          },
        };
      }

      if (current.status === "deleted") {
        return {
          ok: false,
          error: {
            code: "REPORT_ALREADY_DELETED",
            messageKo: "이미 삭제 처리된 리포트입니다.",
          },
        };
      }

      const updated: PersistedReportRecord = {
        ...current,
        status: "deleted",
        deletedAt: input.deletedAt,
        updatedAt: input.deletedAt,
      };

      records.set(input.reportId, updated);

      return {
        ok: true,
        record: updated,
      };
    },

    async list(
      input: ListPersistedReportsInput,
    ): Promise<readonly PersistedReportRecord[]> {
      const allRecords = Array.from(records.values());
      const filteredRecords = input.status
        ? allRecords.filter((record) => record.status === input.status)
        : allRecords;

      return input.limit === undefined
        ? filteredRecords
        : filteredRecords.slice(0, input.limit);
    },
  };
}
