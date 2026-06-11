import { createClient } from "@supabase/supabase-js";

import type {
  GetPaidReportResultInput,
  PaidReportResult,
} from "./paidReportResultTypes";

export type PaidReportResultRpcResultRow = {
  readonly report_id: string;
  readonly product_type: string;
  readonly status: string;
  readonly title: string;
  readonly placeholder_text: string;
  readonly created_at: string;
  readonly updated_at: string;
};

export type SupabasePaidReportResultQueryErrorCode =
  | "DB_UNAVAILABLE"
  | "PERMISSION_DENIED"
  | "PAID_REPORT_RESULT_INVALID_REPORT_ID"
  | "PAID_REPORT_RESULT_NOT_FOUND"
  | "PAID_REPORT_RESULT_RPC_FAILED"
  | "PAID_REPORT_RESULT_RPC_VALIDATION_FAILED";

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

const GET_PAID_SAJU_MBTI_REPORT_RESULT_RPC =
  "get_paid_saju_mbti_report_result";
const QUERY_FAILED_MESSAGE = "Supabase paid report result RPC failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase paid report result RPC returned invalid data.";

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

  if (error.message.includes("PAID_REPORT_RESULT_INVALID_REPORT_ID")) {
    return {
      ok: false,
      code: "PAID_REPORT_RESULT_INVALID_REPORT_ID",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (error.message.includes("PAID_REPORT_RESULT_NOT_FOUND")) {
    return {
      ok: false,
      code: "PAID_REPORT_RESULT_NOT_FOUND",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  return {
    ok: false,
    code: "PAID_REPORT_RESULT_RPC_FAILED",
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
    row.status !== "ready" ||
    !isNonEmptyString(row.title) ||
    !isNonEmptyString(row.placeholder_text) ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at)
  ) {
    return {
      ok: false,
      code: "PAID_REPORT_RESULT_RPC_VALIDATION_FAILED",
      messageKo: QUERY_INVALID_DATA_MESSAGE,
    };
  }

  return {
    ok: true,
    data: {
      reportId: row.report_id,
      productType: "saju_mbti_full",
      status: "ready",
      title: row.title,
      placeholderText: row.placeholder_text,
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
        GET_PAID_SAJU_MBTI_REPORT_RESULT_RPC,
        createRpcArgs(input),
      );

      if (result.error !== null) {
        return mapRpcError(result.error);
      }

      const row = extractSingleRow(result.data);

      if (row === null) {
        return {
          ok: false,
          code: "PAID_REPORT_RESULT_RPC_VALIDATION_FAILED",
          messageKo: QUERY_INVALID_DATA_MESSAGE,
        };
      }

      return mapRpcRow(row);
    },
  };
}
