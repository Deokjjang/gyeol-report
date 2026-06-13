import { createClient } from "@supabase/supabase-js";

import type {
  SaveComprehensiveReportSnapshotInput,
  SaveComprehensiveReportSnapshotResult,
} from "./comprehensiveReportSnapshotTypes";
import type { ComprehensiveReportSnapshotVersion } from "../report-generation/comprehensiveReportDraftTypes";

export type ComprehensiveReportSnapshotRpcResultRow = {
  readonly report_id: string;
  readonly provider_order_id: string;
  readonly product_type: string;
  readonly snapshot_version: string;
  readonly generation_model: string | null;
  readonly status: string;
  readonly created_at: string;
  readonly updated_at: string;
};

export type ComprehensiveReportSnapshotRpcErrorCode =
  | "DB_UNAVAILABLE"
  | "PERMISSION_DENIED"
  | "REPORT_SNAPSHOT_INPUT_INVALID"
  | "REPORT_PAYMENT_ORDER_NOT_FOUND"
  | "REPORT_NOT_FOUND"
  | "REPORT_SNAPSHOT_VERSION_INVALID"
  | "REPORT_SNAPSHOT_PRODUCT_INVALID"
  | "REPORT_SNAPSHOT_ALREADY_EXISTS"
  | "REPORT_SNAPSHOT_SAVE_FAILED"
  | "REPORT_SNAPSHOT_RPC_FAILED"
  | "REPORT_SNAPSHOT_RPC_VALIDATION_FAILED";

export class ComprehensiveReportSnapshotPersistenceError extends Error {
  readonly code: ComprehensiveReportSnapshotRpcErrorCode;

  constructor(code: ComprehensiveReportSnapshotRpcErrorCode, message: string) {
    super(message);
    this.name = "ComprehensiveReportSnapshotPersistenceError";
    this.code = code;
  }
}

type SupabaseComprehensiveReportSnapshotRpcError = {
  readonly code?: string;
  readonly message: string;
};

export type ComprehensiveReportSnapshotRpcExecutor = (
  functionName: string,
  args: Record<string, unknown>,
) => Promise<{
  readonly data: unknown;
  readonly error: SupabaseComprehensiveReportSnapshotRpcError | null;
}>;

export type SupabaseComprehensiveReportSnapshotRpcClient = {
  saveComprehensiveReportDraftSnapshot(
    input: SaveComprehensiveReportSnapshotInput,
  ): Promise<SaveComprehensiveReportSnapshotResult>;
};

export type SupabaseComprehensiveReportSnapshotClientConfig = {
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly rpcExecutor?: ComprehensiveReportSnapshotRpcExecutor;
};

const SAVE_COMPREHENSIVE_REPORT_DRAFT_SNAPSHOT_RPC =
  "save_comprehensive_report_draft_snapshot";
const QUERY_FAILED_MESSAGE =
  "Supabase comprehensive report snapshot RPC failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase comprehensive report snapshot RPC returned invalid data.";

function createPersistenceError(
  code: ComprehensiveReportSnapshotRpcErrorCode,
  message: string,
): ComprehensiveReportSnapshotPersistenceError {
  return new ComprehensiveReportSnapshotPersistenceError(code, message);
}

function throwUnavailable(): never {
  throw createPersistenceError(
    "DB_UNAVAILABLE",
    "Supabase comprehensive report snapshot client is not connected.",
  );
}

function mapRpcError(
  error: SupabaseComprehensiveReportSnapshotRpcError,
): ComprehensiveReportSnapshotPersistenceError {
  if (error.code === "42501") {
    return createPersistenceError("PERMISSION_DENIED", QUERY_FAILED_MESSAGE);
  }

  const knownCodes = [
    "REPORT_SNAPSHOT_INPUT_INVALID",
    "REPORT_PAYMENT_ORDER_NOT_FOUND",
    "REPORT_NOT_FOUND",
    "REPORT_SNAPSHOT_VERSION_INVALID",
    "REPORT_SNAPSHOT_PRODUCT_INVALID",
    "REPORT_SNAPSHOT_ALREADY_EXISTS",
    "REPORT_SNAPSHOT_SAVE_FAILED",
  ] as const satisfies readonly ComprehensiveReportSnapshotRpcErrorCode[];

  for (const code of knownCodes) {
    if (error.message.includes(code)) {
      return createPersistenceError(code, QUERY_FAILED_MESSAGE);
    }
  }

  return createPersistenceError("REPORT_SNAPSHOT_RPC_FAILED", QUERY_FAILED_MESSAGE);
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isTimestamp(value: string): boolean {
  return value.trim().length > 0 && !Number.isNaN(Date.parse(value));
}

function isSnapshotVersion(value: unknown): value is ComprehensiveReportSnapshotVersion {
  return (
    value === "comprehensive_v1_draft" ||
    value === "comprehensive_v2_draft"
  );
}

function extractSingleRow(data: unknown): ComprehensiveReportSnapshotRpcResultRow | null {
  if (Array.isArray(data) && data.length === 1 && isObjectRecord(data[0])) {
    return data[0] as ComprehensiveReportSnapshotRpcResultRow;
  }

  if (isObjectRecord(data)) {
    return data as ComprehensiveReportSnapshotRpcResultRow;
  }

  return null;
}

function mapRpcRow(
  row: ComprehensiveReportSnapshotRpcResultRow,
): SaveComprehensiveReportSnapshotResult {
  if (
    !isNonEmptyString(row.report_id) ||
    !isNonEmptyString(row.provider_order_id) ||
    row.product_type !== "saju_mbti_full" ||
    !isSnapshotVersion(row.snapshot_version) ||
    !isNullableString(row.generation_model) ||
    (row.status !== "ready" && row.status !== "generated") ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at)
  ) {
    throw createPersistenceError(
      "REPORT_SNAPSHOT_RPC_VALIDATION_FAILED",
      QUERY_INVALID_DATA_MESSAGE,
    );
  }

  return {
    reportId: row.report_id,
    providerOrderId: row.provider_order_id,
    productType: "saju_mbti_full",
    snapshotVersion: row.snapshot_version,
    generationModel: row.generation_model,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createRpcArgs(
  input: SaveComprehensiveReportSnapshotInput,
): Record<string, unknown> {
  return {
    p_report_id: input.reportId,
    p_provider_order_id: input.providerOrderId,
    p_report_snapshot: input.draft,
    p_generation_model: input.generationModel ?? null,
    p_generation_version: input.draft.version,
  };
}

export function createUnavailableSupabaseComprehensiveReportSnapshotClient(): SupabaseComprehensiveReportSnapshotRpcClient {
  return {
    async saveComprehensiveReportDraftSnapshot() {
      throwUnavailable();
    },
  };
}

export function createSupabaseComprehensiveReportSnapshotClient(
  config: SupabaseComprehensiveReportSnapshotClientConfig = {},
): SupabaseComprehensiveReportSnapshotRpcClient {
  if (config.rpcExecutor !== undefined) {
    return createConnectedClient(config.rpcExecutor);
  }

  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createUnavailableSupabaseComprehensiveReportSnapshotClient();
  }

  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const rpcExecutor: ComprehensiveReportSnapshotRpcExecutor = async (
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
  rpcExecutor: ComprehensiveReportSnapshotRpcExecutor,
): SupabaseComprehensiveReportSnapshotRpcClient {
  return {
    async saveComprehensiveReportDraftSnapshot(input) {
      const result = await rpcExecutor(
        SAVE_COMPREHENSIVE_REPORT_DRAFT_SNAPSHOT_RPC,
        createRpcArgs(input),
      );

      if (result.error !== null) {
        throw mapRpcError(result.error);
      }

      const row = extractSingleRow(result.data);

      if (row === null) {
        throw createPersistenceError(
          "REPORT_SNAPSHOT_RPC_VALIDATION_FAILED",
          QUERY_INVALID_DATA_MESSAGE,
        );
      }

      return mapRpcRow(row);
    },
  };
}

export async function saveComprehensiveReportDraftSnapshotWithSupabase(input: {
  readonly client: SupabaseComprehensiveReportSnapshotRpcClient;
  readonly reportId: string;
  readonly providerOrderId: string;
  readonly draft: SaveComprehensiveReportSnapshotInput["draft"];
  readonly generationModel?: string | null;
}): Promise<SaveComprehensiveReportSnapshotResult> {
  return input.client.saveComprehensiveReportDraftSnapshot({
    reportId: input.reportId,
    providerOrderId: input.providerOrderId,
    draft: input.draft,
    generationModel: input.generationModel ?? null,
  });
}
