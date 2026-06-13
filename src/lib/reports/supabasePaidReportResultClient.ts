import { createClient } from "@supabase/supabase-js";

import { validateComprehensiveReportDraft } from "../report-generation/comprehensiveReportDraftValidator";
import type { ComprehensiveReportSnapshotVersion } from "../report-generation/comprehensiveReportDraftTypes";
import type {
  GetPaidReportResultInput,
  PaidReportResult,
  PaidReportSnapshotStatus,
  PaidReportResultStatus,
} from "./paidReportResultTypes";

export type PaidReportResultRpcResultRow = {
  readonly report_id: string;
  readonly product_type: string;
  readonly status: string;
  readonly snapshot_status: string;
  readonly snapshot_version?: string | null;
  readonly report_snapshot: unknown | null;
  readonly created_at: string;
  readonly updated_at: string;
};

export type SupabasePaidReportResultQueryErrorCode =
  | "DB_UNAVAILABLE"
  | "PERMISSION_DENIED"
  | "REPORT_RESULT_INVALID_REPORT_ID"
  | "REPORT_RESULT_NOT_FOUND"
  | "REPORT_RESULT_RPC_FAILED"
  | "REPORT_RESULT_RPC_VALIDATION_FAILED"
  | "REPORT_RESULT_SNAPSHOT_INVALID";

export type SupabasePaidReportResultQueryResult<T> =
  | {
      readonly ok: true;
      readonly data: T;
    }
  | {
      readonly ok: false;
      readonly code: SupabasePaidReportResultQueryErrorCode;
      readonly messageKo: string;
    };

type SupabasePaidReportResultRpcError = {
  readonly code?: string;
  readonly message: string;
};

export type PaidReportResultRpcExecutor = (
  functionName: string,
  args: Record<string, unknown>,
) => Promise<{
  readonly data: unknown;
  readonly error: SupabasePaidReportResultRpcError | null;
}>;

export type SupabasePaidReportResultRpcClient = {
  getPaidReportResult(
    input: GetPaidReportResultInput,
  ): Promise<SupabasePaidReportResultQueryResult<PaidReportResult>>;
};

export type SupabasePaidReportResultClientConfig = {
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly rpcExecutor?: PaidReportResultRpcExecutor;
};

const GET_GENERATED_COMPREHENSIVE_REPORT_RESULT_RPC =
  "get_generated_comprehensive_report_result";
const QUERY_FAILED_MESSAGE = "Supabase paid report result RPC failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase paid report result RPC returned invalid data.";
const QUERY_INVALID_SNAPSHOT_MESSAGE =
  "Supabase paid report result snapshot is invalid.";

function createUnavailableResult<T>(): SupabasePaidReportResultQueryResult<T> {
  return {
    ok: false,
    code: "DB_UNAVAILABLE",
    messageKo: "Supabase paid report result client is not connected.",
  };
}

function mapRpcError<T>(
  error: SupabasePaidReportResultRpcError,
): SupabasePaidReportResultQueryResult<T> {
  if (error.code === "42501") {
    return {
      ok: false,
      code: "PERMISSION_DENIED",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (
    error.message.includes("REPORT_RESULT_INVALID_REPORT_ID") ||
    error.message.includes("PAID_REPORT_RESULT_INVALID_REPORT_ID")
  ) {
    return {
      ok: false,
      code: "REPORT_RESULT_INVALID_REPORT_ID",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (
    error.message.includes("REPORT_RESULT_NOT_FOUND") ||
    error.message.includes("PAID_REPORT_RESULT_NOT_FOUND")
  ) {
    return {
      ok: false,
      code: "REPORT_RESULT_NOT_FOUND",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  return {
    ok: false,
    code: "REPORT_RESULT_RPC_FAILED",
    messageKo: QUERY_FAILED_MESSAGE,
  };
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isResultStatus(value: unknown): value is PaidReportResultStatus {
  return value === "ready" || value === "generated";
}

function isSnapshotStatus(
  value: unknown,
): value is PaidReportSnapshotStatus {
  return value === "missing" || value === "generated";
}

function isSnapshotVersion(value: unknown): value is ComprehensiveReportSnapshotVersion {
  return (
    value === "comprehensive_v1_draft" ||
    value === "comprehensive_v2_draft"
  );
}

function extractSingleRow(data: unknown): PaidReportResultRpcResultRow | null {
  if (Array.isArray(data) && data.length === 1 && isObjectRecord(data[0])) {
    return data[0] as PaidReportResultRpcResultRow;
  }

  if (isObjectRecord(data)) {
    return data as PaidReportResultRpcResultRow;
  }

  return null;
}

function mapRpcRow(
  row: PaidReportResultRpcResultRow,
): SupabasePaidReportResultQueryResult<PaidReportResult> {
  if (
    !isNonEmptyString(row.report_id) ||
    row.product_type !== "saju_mbti_full" ||
    !isResultStatus(row.status) ||
    !isSnapshotStatus(row.snapshot_status) ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at)
  ) {
    return {
      ok: false,
      code: "REPORT_RESULT_RPC_VALIDATION_FAILED",
      messageKo: QUERY_INVALID_DATA_MESSAGE,
    };
  }

  if (row.snapshot_status === "missing") {
    if (row.status !== "ready" || row.report_snapshot !== null) {
      return {
        ok: false,
        code: "REPORT_RESULT_RPC_VALIDATION_FAILED",
        messageKo: QUERY_INVALID_DATA_MESSAGE,
      };
    }

    return {
      ok: true,
      data: {
        reportId: row.report_id,
        productType: "saju_mbti_full",
        status: "ready",
        snapshotStatus: "missing",
        snapshotVersion: null,
        draft: null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    };
  }

  const validation = validateComprehensiveReportDraft(row.report_snapshot);

  if (
    !validation.ok ||
    validation.value === undefined ||
    !isSnapshotVersion(row.snapshot_version ?? validation.value.version) ||
    (row.snapshot_version !== undefined &&
      row.snapshot_version !== null &&
      row.snapshot_version !== validation.value.version)
  ) {
    return {
      ok: false,
      code: "REPORT_RESULT_SNAPSHOT_INVALID",
      messageKo: QUERY_INVALID_SNAPSHOT_MESSAGE,
    };
  }

  return {
    ok: true,
    data: {
      reportId: row.report_id,
      productType: "saju_mbti_full",
      status: "generated",
      snapshotStatus: "generated",
      snapshotVersion: validation.value.version,
      draft: validation.value,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  };
}

function createRpcArgs(
  input: GetPaidReportResultInput,
): Record<string, unknown> {
  return {
    p_report_id: input.reportId,
  };
}

export function createUnavailableSupabasePaidReportResultClient(): SupabasePaidReportResultRpcClient {
  return {
    async getPaidReportResult() {
      return createUnavailableResult();
    },
  };
}

export function createSupabasePaidReportResultClient(
  config: SupabasePaidReportResultClientConfig = {},
): SupabasePaidReportResultRpcClient {
  if (config.rpcExecutor !== undefined) {
    return createConnectedClient(config.rpcExecutor);
  }

  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createUnavailableSupabasePaidReportResultClient();
  }

  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const rpcExecutor: PaidReportResultRpcExecutor = async (
    functionName,
    args,
  ) => {
    const result = await client.rpc(functionName, args);

    return {
      data: result.data,
      error: result.error,
    };
  };

  return createConnectedClient(rpcExecutor);
}

function createConnectedClient(
  rpcExecutor: PaidReportResultRpcExecutor,
): SupabasePaidReportResultRpcClient {
  return {
    async getPaidReportResult(input) {
      const result = await rpcExecutor(
        GET_GENERATED_COMPREHENSIVE_REPORT_RESULT_RPC,
        createRpcArgs(input),
      );

      if (result.error !== null) {
        return mapRpcError(result.error);
      }

      const row = extractSingleRow(result.data);

      if (row === null) {
        return {
          ok: false,
          code: "REPORT_RESULT_RPC_VALIDATION_FAILED",
          messageKo: QUERY_INVALID_DATA_MESSAGE,
        };
      }

      return mapRpcRow(row);
    },
  };
}
