import type {
  ReportPersistenceAdapter,
  ReportPersistenceDeleteResult,
  ReportPersistenceWriteResult,
} from "./reportPersistenceAdapter";
import type { PublicReportResult } from "./reportPersistenceTypes";

export const SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS =
  "skeleton" as const;

export type SupabaseReportPersistenceAdapterStatus =
  typeof SUPABASE_REPORT_PERSISTENCE_ADAPTER_STATUS;

export type SupabaseReportPersistenceAdapterConfig = {
  readonly projectUrl?: string;
  readonly serviceRoleKey?: string;
  readonly schema?: string;
  readonly tableName?: string;
};

const SKELETON_MESSAGE =
  "Supabase report persistence adapter is a skeleton and is not connected yet.";

function createUnavailableMessage(tableName: string): string {
  return `${SKELETON_MESSAGE} table=${tableName}`;
}

function createWriteUnavailable(
  tableName: string,
): ReportPersistenceWriteResult {
  return {
    ok: false,
    error: {
      code: "REPORT_STORAGE_WRITE_FAILED",
      messageKo: createUnavailableMessage(tableName),
    },
  };
}

function createFindUnavailable(tableName: string): PublicReportResult {
  return {
    ok: false,
    error: {
      code: "REPORT_STORAGE_ERROR",
      messageKo: createUnavailableMessage(tableName),
    },
  };
}

function createDeleteUnavailable(
  tableName: string,
): ReportPersistenceDeleteResult {
  return {
    ok: false,
    error: {
      code: "REPORT_STORAGE_DELETE_FAILED",
      messageKo: createUnavailableMessage(tableName),
    },
  };
}

export function createSupabaseReportPersistenceAdapter(
  config: SupabaseReportPersistenceAdapterConfig = {},
): ReportPersistenceAdapter {
  const tableName = config.tableName ?? "reports";

  // Skeleton only. Add real Supabase access after migration, env, and RLS decisions.
  // Plaintext access tokens stay outside stored records.
  const adapter: ReportPersistenceAdapter = {
    async create(input): Promise<ReportPersistenceWriteResult> {
      void input;

      return createWriteUnavailable(tableName);
    },

    async update(input): Promise<ReportPersistenceWriteResult> {
      void input;

      return createWriteUnavailable(tableName);
    },

    async find(input): Promise<PublicReportResult> {
      void input;

      return createFindUnavailable(tableName);
    },

    async softDelete(input): Promise<ReportPersistenceDeleteResult> {
      void input;

      return createDeleteUnavailable(tableName);
    },

    async list(input) {
      void input;
      void tableName;

      return [];
    },
  };

  return adapter;
}
