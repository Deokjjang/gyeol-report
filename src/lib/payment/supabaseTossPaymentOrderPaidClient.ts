import { createClient } from "@supabase/supabase-js";

import type {
  MarkTossPaymentOrderPaidInput,
  MarkTossPaymentOrderPaidResult,
} from "./tossPaymentOrderPaidTypes";

export type MarkTossPaymentOrderPaidRpcResultRow = {
  readonly payment_order_id: string;
  readonly provider_order_id: string;
  readonly product_type: string;
  readonly provider: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: string;
  readonly paid_at: string;
  readonly report_id: string | null;
  readonly created_at: string;
  readonly updated_at: string;
};

export type SupabaseTossPaymentOrderPaidQueryErrorCode =
  | "DB_UNAVAILABLE"
  | "PERMISSION_DENIED"
  | "PAYMENT_ORDER_NOT_FOUND"
  | "PAYMENT_ORDER_NOT_READY"
  | "PAYMENT_ORDER_PAID_CONFLICT"
  | "TOSS_PAYMENT_ORDER_PAID_RPC_FAILED"
  | "TOSS_PAYMENT_ORDER_PAID_RPC_VALIDATION_FAILED";

export type SupabaseTossPaymentOrderPaidQueryResult<T> =
  | {
      readonly ok: true;
      readonly data: T;
    }
  | {
      readonly ok: false;
      readonly code: SupabaseTossPaymentOrderPaidQueryErrorCode;
      readonly messageKo: string;
    };

type SupabaseTossPaymentOrderPaidRpcError = {
  readonly code?: string;
  readonly message: string;
};

export type TossPaymentOrderPaidRpcExecutor = (
  functionName: string,
  args: Record<string, unknown>,
) => Promise<{
  readonly data: unknown;
  readonly error: SupabaseTossPaymentOrderPaidRpcError | null;
}>;

export type SupabaseTossPaymentOrderPaidRpcClient = {
  markTossPaymentOrderPaid(
    input: MarkTossPaymentOrderPaidInput,
  ): Promise<
    SupabaseTossPaymentOrderPaidQueryResult<MarkTossPaymentOrderPaidResult>
  >;
};

export type SupabaseTossPaymentOrderPaidClientConfig = {
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly rpcExecutor?: TossPaymentOrderPaidRpcExecutor;
};

const MARK_TOSS_PAYMENT_ORDER_PAID_RPC = "mark_toss_payment_order_paid";
const QUERY_FAILED_MESSAGE = "Supabase Toss payment paid RPC failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase Toss payment paid RPC returned invalid data.";

function createUnavailableResult<T>(): SupabaseTossPaymentOrderPaidQueryResult<T> {
  return {
    ok: false,
    code: "DB_UNAVAILABLE",
    messageKo: "Supabase Toss payment paid client is not connected.",
  };
}

function mapRpcError<T>(
  error: SupabaseTossPaymentOrderPaidRpcError,
): SupabaseTossPaymentOrderPaidQueryResult<T> {
  if (error.code === "42501") {
    return {
      ok: false,
      code: "PERMISSION_DENIED",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (
    error.code === "23505" ||
    error.message.includes("PAYMENT_ORDER_PAID_CONFLICT")
  ) {
    return {
      ok: false,
      code: "PAYMENT_ORDER_PAID_CONFLICT",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (error.message.includes("PAYMENT_ORDER_NOT_FOUND")) {
    return {
      ok: false,
      code: "PAYMENT_ORDER_NOT_FOUND",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (error.message.includes("PAYMENT_ORDER_NOT_READY")) {
    return {
      ok: false,
      code: "PAYMENT_ORDER_NOT_READY",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  return {
    ok: false,
    code: "TOSS_PAYMENT_ORDER_PAID_RPC_FAILED",
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

function isNullableString(value: unknown): value is string | null {
  return value === null || isNonEmptyString(value);
}

function extractSingleRow(
  data: unknown,
): MarkTossPaymentOrderPaidRpcResultRow | null {
  if (Array.isArray(data) && data.length === 1 && isObjectRecord(data[0])) {
    return data[0] as MarkTossPaymentOrderPaidRpcResultRow;
  }

  if (isObjectRecord(data)) {
    return data as MarkTossPaymentOrderPaidRpcResultRow;
  }

  return null;
}

function mapRpcRow(
  row: MarkTossPaymentOrderPaidRpcResultRow,
): SupabaseTossPaymentOrderPaidQueryResult<MarkTossPaymentOrderPaidResult> {
  if (
    !isNonEmptyString(row.payment_order_id) ||
    !isNonEmptyString(row.provider_order_id) ||
    row.product_type !== "saju_mbti_full" ||
    row.provider !== "toss" ||
    row.amount !== 990 ||
    row.currency !== "KRW" ||
    row.status !== "paid" ||
    !isTimestamp(row.paid_at) ||
    !isNullableString(row.report_id) ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at)
  ) {
    return {
      ok: false,
      code: "TOSS_PAYMENT_ORDER_PAID_RPC_VALIDATION_FAILED",
      messageKo: QUERY_INVALID_DATA_MESSAGE,
    };
  }

  return {
    ok: true,
    data: {
      paymentOrderId: row.payment_order_id,
      providerOrderId: row.provider_order_id,
      productType: "saju_mbti_full",
      provider: "toss",
      amount: row.amount,
      currency: "KRW",
      status: "paid",
      paidAt: row.paid_at,
      reportId: row.report_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  };
}

function createRpcArgs(
  input: MarkTossPaymentOrderPaidInput,
): Record<string, unknown> {
  return {
    p_provider_order_id: input.providerOrderId,
    p_provider_payment_id: input.providerPaymentId,
    p_amount: input.amount,
    p_currency: input.currency,
    p_paid_at: input.paidAt ?? null,
  };
}

export function createUnavailableSupabaseTossPaymentOrderPaidClient(): SupabaseTossPaymentOrderPaidRpcClient {
  return {
    async markTossPaymentOrderPaid() {
      return createUnavailableResult();
    },
  };
}

export function createSupabaseTossPaymentOrderPaidClient(
  config: SupabaseTossPaymentOrderPaidClientConfig = {},
): SupabaseTossPaymentOrderPaidRpcClient {
  if (config.rpcExecutor !== undefined) {
    return createConnectedClient(config.rpcExecutor);
  }

  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createUnavailableSupabaseTossPaymentOrderPaidClient();
  }

  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const rpcExecutor: TossPaymentOrderPaidRpcExecutor = async (
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
  rpcExecutor: TossPaymentOrderPaidRpcExecutor,
): SupabaseTossPaymentOrderPaidRpcClient {
  return {
    async markTossPaymentOrderPaid(input) {
      const result = await rpcExecutor(
        MARK_TOSS_PAYMENT_ORDER_PAID_RPC,
        createRpcArgs(input),
      );

      if (result.error !== null) {
        return mapRpcError(result.error);
      }

      const row = extractSingleRow(result.data);

      if (row === null) {
        return {
          ok: false,
          code: "TOSS_PAYMENT_ORDER_PAID_RPC_VALIDATION_FAILED",
          messageKo: QUERY_INVALID_DATA_MESSAGE,
        };
      }

      return mapRpcRow(row);
    },
  };
}
