import {
  createUnavailableSupabaseReportPersistenceQueryClient,
  type SupabaseReportPersistenceQueryClient,
  type SupabaseReportQueryResult,
  type SupabaseReportRowPatch,
} from "./supabaseReportPersistenceClient";
import {
  mapPersistedReportRecordToSupabaseRow,
  mapSupabaseRowToPersistedReportRecord,
  type SupabaseReportMappingResult,
  type SupabaseReportRow,
} from "./supabaseReportPersistenceMapper";
import type {
  ReportPersistenceAdapter,
  ReportPersistenceDeleteResult,
  ReportPersistenceWriteResult,
  UpdatePersistedReportInput,
} from "./reportPersistenceAdapter";
import type {
  PersistedPaymentLinkage,
  PersistedReportRecord,
  PublicReportResult,
} from "./reportPersistenceTypes";

type MutableSupabaseReportRowPatch = {
  -readonly [Key in keyof SupabaseReportRowPatch]: SupabaseReportRowPatch[Key];
};

export const SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS =
  "skeleton" as const;

export type SupabaseReportPersistenceAdapterStatus =
  typeof SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS;

export type SupabaseReportPersistenceAdapterConfig = {
  readonly projectUrl?: string;
  readonly schema?: string;
  readonly tableName?: string;
  readonly queryClient?: SupabaseReportPersistenceQueryClient;
};

const SKELETON_MESSAGE =
  "Supabase report persistence adapter is a skeleton and is not connected yet.";
const DEFAULT_LIST_LIMIT = 50;
const MAX_LIST_LIMIT = 100;

const paymentMappingRecordTemplate: PersistedReportRecord = {
  reportId: "report_payment_mapping_template",
  createdAt: "1970-01-01T00:00:00.000Z",
  updatedAt: "1970-01-01T00:00:00.000Z",
  status: "generated",
  reportVersion: "v1",
  calculationVersion: "v1",
  locale: "ko",
  accessMode: "preview",
  inputSnapshot: {
    birthDate: "1970-01-01",
    birthTime: null,
    birthTimeUnknown: true,
    calendarType: "SOLAR",
    timezone: "Asia/Seoul",
  },
  reportSnapshot: {
    report: {
      version: "v1",
      titleKo: "Supabase mapping template",
      subtitleKo: "Supabase mapping template",
      sections: [],
      notices: [],
    },
    reportVersion: "v1",
    renderVersion: "v1",
    createdAt: "1970-01-01T00:00:00.000Z",
  },
};

function createUnavailableMessage(tableName: string): string {
  return `${SKELETON_MESSAGE} table=${tableName}`;
}

function createQueryFailureMessage(
  tableName: string,
  queryError: Extract<SupabaseReportQueryResult<unknown>, { ok: false }>,
): string {
  if (queryError.code === "DB_UNAVAILABLE") {
    return createUnavailableMessage(tableName);
  }

  return `${queryError.messageKo} table=${tableName}`;
}

function createMappingFailureMessage(
  tableName: string,
  mappingError: Extract<SupabaseReportMappingResult<unknown>, { ok: false }>,
): string {
  return `${mappingError.messageKo} table=${tableName}`;
}

function createWriteFailure(
  code: "REPORT_STORAGE_WRITE_FAILED" | "REPORT_STORAGE_VALIDATION_FAILED",
  messageKo: string,
): ReportPersistenceWriteResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function createDeleteFailure(
  code:
    | "REPORT_NOT_FOUND"
    | "REPORT_ALREADY_DELETED"
    | "REPORT_STORAGE_DELETE_FAILED",
  messageKo: string,
): ReportPersistenceDeleteResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function createFindFailure(
  code: "REPORT_NOT_FOUND" | "REPORT_DELETED" | "REPORT_ACCESS_DENIED" | "REPORT_STORAGE_ERROR",
  messageKo: string,
): PublicReportResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function mapQueryErrorToWriteFailure(
  tableName: string,
  queryError: Extract<SupabaseReportQueryResult<unknown>, { ok: false }>,
): ReportPersistenceWriteResult {
  return createWriteFailure(
    queryError.code === "DUPLICATE_REPORT_ID"
      ? "REPORT_STORAGE_VALIDATION_FAILED"
      : "REPORT_STORAGE_WRITE_FAILED",
    createQueryFailureMessage(tableName, queryError),
  );
}

function mapQueryErrorToFindFailure(
  tableName: string,
  queryError: Extract<SupabaseReportQueryResult<unknown>, { ok: false }>,
): PublicReportResult {
  return createFindFailure(
    queryError.code === "NOT_FOUND" ? "REPORT_NOT_FOUND" : "REPORT_STORAGE_ERROR",
    createQueryFailureMessage(tableName, queryError),
  );
}

function mapQueryErrorToDeleteFailure(
  tableName: string,
  queryError: Extract<SupabaseReportQueryResult<unknown>, { ok: false }>,
): ReportPersistenceDeleteResult {
  return createDeleteFailure(
    queryError.code === "NOT_FOUND"
      ? "REPORT_NOT_FOUND"
      : "REPORT_STORAGE_DELETE_FAILED",
    createQueryFailureMessage(tableName, queryError),
  );
}

function mapRecordToPublicResult(record: PersistedReportRecord): PublicReportResult {
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
}

function createPaymentMappingRecord(
  payment: PersistedPaymentLinkage,
): PersistedReportRecord {
  return {
    ...paymentMappingRecordTemplate,
    payment,
  };
}

function mapPaymentToRowPatch(
  payment: PersistedPaymentLinkage,
): SupabaseReportMappingResult<SupabaseReportRowPatch> {
  const rowResult = mapPersistedReportRecordToSupabaseRow(
    createPaymentMappingRecord(payment),
  );

  if (!rowResult.ok) {
    return rowResult;
  }

  return {
    ok: true,
    value: {
      payment_order_id: rowResult.value.payment_order_id,
      payment_provider: rowResult.value.payment_provider,
      payment_provider_payment_id: rowResult.value.payment_provider_payment_id,
      payment_status: rowResult.value.payment_status,
      payment_amount: rowResult.value.payment_amount,
      payment_currency: rowResult.value.payment_currency,
      payment_paid_at: rowResult.value.payment_paid_at,
      payment_refunded_at: rowResult.value.payment_refunded_at,
    },
  };
}

function mapUpdatePatchToRowPatch(
  patch: UpdatePersistedReportInput["patch"],
): SupabaseReportMappingResult<SupabaseReportRowPatch> {
  const rowPatch: MutableSupabaseReportRowPatch = {};

  if (patch.status !== undefined) {
    rowPatch.status = patch.status;
  }

  if (patch.accessMode !== undefined) {
    rowPatch.access_mode = patch.accessMode;
  }

  if (patch.updatedAt !== undefined) {
    rowPatch.updated_at = patch.updatedAt;
  }

  if (patch.deletedAt !== undefined) {
    rowPatch.deleted_at = patch.deletedAt;
  }

  if (patch.payment !== undefined) {
    const paymentPatchResult = mapPaymentToRowPatch(patch.payment);

    if (!paymentPatchResult.ok) {
      return paymentPatchResult;
    }

    return {
      ok: true,
      value: {
        ...rowPatch,
        ...paymentPatchResult.value,
      },
    };
  }

  return {
    ok: true,
    value: rowPatch,
  };
}

function mapRowResultToWriteResult(
  tableName: string,
  row: SupabaseReportRow,
): ReportPersistenceWriteResult {
  const recordResult = mapSupabaseRowToPersistedReportRecord(row);

  if (!recordResult.ok) {
    return createWriteFailure(
      "REPORT_STORAGE_VALIDATION_FAILED",
      createMappingFailureMessage(tableName, recordResult),
    );
  }

  return {
    ok: true,
    record: recordResult.value,
  };
}

function getBoundedLimit(limit: number | undefined): number {
  if (limit === undefined) {
    return DEFAULT_LIST_LIMIT;
  }

  if (limit < 0) {
    return 0;
  }

  return Math.min(limit, MAX_LIST_LIMIT);
}

export function createSupabaseReportPersistenceAdapter(
  config: SupabaseReportPersistenceAdapterConfig = {},
): ReportPersistenceAdapter {
  const tableName = config.tableName ?? "reports";
  const queryClient =
    config.queryClient ?? createUnavailableSupabaseReportPersistenceQueryClient();

  // Compatibility metadata stays "skeleton" until a real SDK-backed client is supplied.
  // Plaintext access tokens stay outside stored records.
  return {
    async create(input): Promise<ReportPersistenceWriteResult> {
      const rowResult = mapPersistedReportRecordToSupabaseRow(input.record);

      if (!rowResult.ok) {
        return createWriteFailure(
          "REPORT_STORAGE_VALIDATION_FAILED",
          createMappingFailureMessage(tableName, rowResult),
        );
      }

      const queryResult = await queryClient.insertReport(rowResult.value);

      if (!queryResult.ok) {
        return mapQueryErrorToWriteFailure(tableName, queryResult);
      }

      return mapRowResultToWriteResult(tableName, queryResult.data);
    },

    async update(input): Promise<ReportPersistenceWriteResult> {
      const patchResult = mapUpdatePatchToRowPatch(input.patch);

      if (!patchResult.ok) {
        return createWriteFailure(
          "REPORT_STORAGE_VALIDATION_FAILED",
          createMappingFailureMessage(tableName, patchResult),
        );
      }

      const queryResult = await queryClient.updateReport(
        input.reportId,
        patchResult.value,
      );

      if (!queryResult.ok) {
        return mapQueryErrorToWriteFailure(tableName, queryResult);
      }

      return mapRowResultToWriteResult(tableName, queryResult.data);
    },

    async find(input): Promise<PublicReportResult> {
      const queryResult = await queryClient.findReportById(input.reportId);

      if (!queryResult.ok) {
        return mapQueryErrorToFindFailure(tableName, queryResult);
      }

      if (queryResult.data === null) {
        return createFindFailure(
          "REPORT_NOT_FOUND",
          `Report was not found. table=${tableName}`,
        );
      }

      const recordResult = mapSupabaseRowToPersistedReportRecord(
        queryResult.data,
      );

      if (!recordResult.ok) {
        return createFindFailure(
          "REPORT_STORAGE_ERROR",
          createMappingFailureMessage(tableName, recordResult),
        );
      }

      if (recordResult.value.status === "deleted") {
        return createFindFailure(
          "REPORT_DELETED",
          `Report was deleted. table=${tableName}`,
        );
      }

      if (
        input.accessMode === "paid" &&
        recordResult.value.accessMode !== "paid"
      ) {
        return createFindFailure(
          "REPORT_ACCESS_DENIED",
          `Report access is denied. table=${tableName}`,
        );
      }

      return mapRecordToPublicResult(recordResult.value);
    },

    async softDelete(input): Promise<ReportPersistenceDeleteResult> {
      const queryResult = await queryClient.updateReport(input.reportId, {
        status: "deleted",
        deleted_at: input.deletedAt,
        updated_at: input.deletedAt,
      });

      if (!queryResult.ok) {
        return mapQueryErrorToDeleteFailure(tableName, queryResult);
      }

      const recordResult = mapSupabaseRowToPersistedReportRecord(
        queryResult.data,
      );

      if (!recordResult.ok) {
        return createDeleteFailure(
          "REPORT_STORAGE_DELETE_FAILED",
          createMappingFailureMessage(tableName, recordResult),
        );
      }

      return {
        ok: true,
        record: recordResult.value,
      };
    },

    async list(input) {
      const queryResult = await queryClient.listReports({
        limit: getBoundedLimit(input.limit),
      });

      if (!queryResult.ok) {
        return [];
      }

      const records: PersistedReportRecord[] = [];

      for (const row of queryResult.data) {
        const recordResult = mapSupabaseRowToPersistedReportRecord(row);

        if (!recordResult.ok) {
          return [];
        }

        records.push(recordResult.value);
      }

      return input.status === undefined
        ? records
        : records.filter((record) => record.status === input.status);
    },
  };
}
