import { createClient } from "@supabase/supabase-js";

import {
  createUnavailableSupabaseReportPersistenceQueryClient,
  type SupabaseReportPersistenceQueryClient,
  type SupabaseReportQueryResult,
} from "./supabaseReportPersistenceClient";
import type { SupabaseReportRow } from "./supabaseReportPersistenceMapper";

export const SUPABASE_REPORT_PERSISTENCE_SDK_CLIENT_STATUS =
  "sdk_ready" as const;

export type SupabaseReportPersistenceSdkClientConfig = {
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly tableName?: string;
};

type SupabaseQueryError = {
  readonly code?: string;
  readonly message: string;
};

const DEFAULT_REPORTS_TABLE = "reports";
const QUERY_FAILED_MESSAGE = "Supabase reports query failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase reports query returned invalid data.";

function mapSupabaseError<T>(
  error: SupabaseQueryError,
): SupabaseReportQueryResult<T> {
  if (error.code === "23505") {
    return {
      ok: false,
      code: "DUPLICATE_REPORT_ID",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (error.code === "42501") {
    return {
      ok: false,
      code: "PERMISSION_DENIED",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (error.code === "PGRST116") {
    return {
      ok: false,
      code: "NOT_FOUND",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  return {
    ok: false,
    code: "UNKNOWN_DB_ERROR",
    messageKo: QUERY_FAILED_MESSAGE,
  };
}

function createInvalidDataResult<T>(): SupabaseReportQueryResult<T> {
  return {
    ok: false,
    code: "UNKNOWN_DB_ERROR",
    messageKo: QUERY_INVALID_DATA_MESSAGE,
  };
}

function createInsertSuccessResult(): SupabaseReportQueryResult<null> {
  return {
    ok: true,
    data: null,
  };
}

function isSupabaseReportRow(value: unknown): value is SupabaseReportRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSupabaseReportRowArray(
  value: unknown,
): value is readonly SupabaseReportRow[] {
  return Array.isArray(value) && value.every(isSupabaseReportRow);
}

export function createSupabaseReportPersistenceSdkClient(
  config: SupabaseReportPersistenceSdkClientConfig = {},
): SupabaseReportPersistenceQueryClient {
  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createUnavailableSupabaseReportPersistenceQueryClient();
  }

  const tableName = config.tableName ?? DEFAULT_REPORTS_TABLE;
  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return {
    async insertReport(
      row,
    ): Promise<SupabaseReportQueryResult<null>> {
      const result = await client.from(tableName).insert(row);

      if (result.error !== null) {
        return mapSupabaseError(result.error);
      }

      return createInsertSuccessResult();
    },

    async updateReport(
      reportId,
      patch,
    ): Promise<SupabaseReportQueryResult<SupabaseReportRow>> {
      const result = await client
        .from(tableName)
        .update(patch)
        .eq("report_id", reportId)
        .select("*")
        .single();

      if (result.error !== null) {
        return mapSupabaseError(result.error);
      }

      return isSupabaseReportRow(result.data)
        ? { ok: true, data: result.data }
        : createInvalidDataResult();
    },

    async findReportById(
      reportId,
    ): Promise<SupabaseReportQueryResult<SupabaseReportRow | null>> {
      const result = await client
        .from(tableName)
        .select("*")
        .eq("report_id", reportId)
        .maybeSingle();

      if (result.error !== null) {
        return mapSupabaseError(result.error);
      }

      if (result.data === null) {
        return { ok: true, data: null };
      }

      return isSupabaseReportRow(result.data)
        ? { ok: true, data: result.data }
        : createInvalidDataResult();
    },

    async listReports(input): Promise<
      SupabaseReportQueryResult<readonly SupabaseReportRow[]>
    > {
      const result = await client
        .from(tableName)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(input.limit);

      if (result.error !== null) {
        return mapSupabaseError(result.error);
      }

      return isSupabaseReportRowArray(result.data)
        ? { ok: true, data: result.data }
        : createInvalidDataResult();
    },
  };
}
