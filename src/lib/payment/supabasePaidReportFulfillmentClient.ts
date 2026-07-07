import { createClient } from "@supabase/supabase-js";

import type {
  FulfillPaidPaymentOrderInput,
  FulfillPaidPaymentOrderResult,
} from "./paidReportFulfillmentTypes";

export type PaidReportFulfillmentRpcResultRow = {
  readonly payment_order_id: string;
  readonly provider_order_id: string;
  readonly report_id: string;
  readonly product_type: string;
  readonly status: string;
  readonly amount: number;
  readonly currency: string;
  readonly created_at: string;
  readonly updated_at: string;
};

export type SupabasePaidReportFulfillmentQueryErrorCode =
  | "DB_UNAVAILABLE"
  | "PERMISSION_DENIED"
  | "PAYMENT_ORDER_NOT_FOUND"
  | "PAYMENT_ORDER_NOT_PAID"
  | "PAYMENT_ORDER_INVALID_CONTEXT"
  | "PAID_REPORT_FULFILLMENT_CONFLICT"
  | "PAID_REPORT_FULFILLMENT_RPC_FAILED"
  | "PAID_REPORT_FULFILLMENT_RPC_VALIDATION_FAILED";

export type SupabasePaidReportFulfillmentQueryResult<T> =
  | {
      readonly ok: true;
      readonly data: T;
    }
  | {
      readonly ok: false;
      readonly code: SupabasePaidReportFulfillmentQueryErrorCode;
      readonly messageKo: string;
    };

type SupabasePaidReportFulfillmentRpcError = {
  readonly code?: string;
  readonly message: string;
};

export type PaidReportFulfillmentRpcExecutor = (
  functionName: string,
  args: Record<string, unknown>,
) => Promise<{
  readonly data: unknown;
  readonly error: SupabasePaidReportFulfillmentRpcError | null;
}>;

export type SupabasePaidReportFulfillmentRpcClient = {
  fulfillPaidPaymentOrder(
    input: FulfillPaidPaymentOrderInput,
  ): Promise<
    SupabasePaidReportFulfillmentQueryResult<FulfillPaidPaymentOrderResult>
  >;
};

export type SupabasePaidReportFulfillmentClientConfig = {
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly rpcExecutor?: PaidReportFulfillmentRpcExecutor;
};

const FULFILL_PAID_SAJU_MBTI_REPORT_RPC = "fulfill_paid_saju_mbti_report";
const QUERY_FAILED_MESSAGE = "Supabase paid report fulfillment RPC failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase paid report fulfillment RPC returned invalid data.";

function createUnavailableResult<T>(): SupabasePaidReportFulfillmentQueryResult<T> {
  return {
    ok: false,
    code: "DB_UNAVAILABLE",
    messageKo: "Supabase paid report fulfillment client is not connected.",
  };
}

function mapRpcError<T>(
  error: SupabasePaidReportFulfillmentRpcError,
): SupabasePaidReportFulfillmentQueryResult<T> {
  if (error.code === "42501") {
    return {
      ok: false,
      code: "PERMISSION_DENIED",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (
    error.code === "23505" ||
    error.message.includes("PAID_REPORT_FULFILLMENT_CONFLICT")
  ) {
    return {
      ok: false,
      code: "PAID_REPORT_FULFILLMENT_CONFLICT",
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

  if (error.message.includes("PAYMENT_ORDER_NOT_PAID")) {
    return {
      ok: false,
      code: "PAYMENT_ORDER_NOT_PAID",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  if (error.message.includes("PAYMENT_ORDER_INVALID_CONTEXT")) {
    return {
      ok: false,
      code: "PAYMENT_ORDER_INVALID_CONTEXT",
      messageKo: QUERY_FAILED_MESSAGE,
    };
  }

  return {
    ok: false,
    code: "PAID_REPORT_FULFILLMENT_RPC_FAILED",
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

function extractSingleRow(data: unknown): PaidReportFulfillmentRpcResultRow | null {
  if (Array.isArray(data) && data.length === 1 && isObjectRecord(data[0])) {
    return data[0] as PaidReportFulfillmentRpcResultRow;
  }

  if (isObjectRecord(data)) {
    return data as PaidReportFulfillmentRpcResultRow;
  }

  return null;
}

function mapRpcRow(
  row: PaidReportFulfillmentRpcResultRow,
): SupabasePaidReportFulfillmentQueryResult<FulfillPaidPaymentOrderResult> {
  if (
    !isNonEmptyString(row.payment_order_id) ||
    !isNonEmptyString(row.provider_order_id) ||
    !isNonEmptyString(row.report_id) ||
    row.product_type !== "saju_mbti_full" ||
    row.status !== "paid" ||
    row.amount !== 1290 ||
    row.currency !== "KRW" ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at)
  ) {
    return {
      ok: false,
      code: "PAID_REPORT_FULFILLMENT_RPC_VALIDATION_FAILED",
      messageKo: QUERY_INVALID_DATA_MESSAGE,
    };
  }

  return {
    ok: true,
    data: {
      paymentOrderId: row.payment_order_id,
      providerOrderId: row.provider_order_id,
      reportId: row.report_id,
      productType: "saju_mbti_full",
      status: "paid",
      amount: row.amount,
      currency: "KRW",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  };
}

function createRpcArgs(
  input: FulfillPaidPaymentOrderInput,
): Record<string, unknown> {
  return {
    p_provider_order_id: input.providerOrderId,
  };
}

export function createUnavailableSupabasePaidReportFulfillmentClient(): SupabasePaidReportFulfillmentRpcClient {
  return {
    async fulfillPaidPaymentOrder() {
      return createUnavailableResult();
    },
  };
}

export function createSupabasePaidReportFulfillmentClient(
  config: SupabasePaidReportFulfillmentClientConfig = {},
): SupabasePaidReportFulfillmentRpcClient {
  if (config.rpcExecutor !== undefined) {
    return createConnectedClient(config.rpcExecutor);
  }

  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createUnavailableSupabasePaidReportFulfillmentClient();
  }

  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const rpcExecutor: PaidReportFulfillmentRpcExecutor = async (
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
  rpcExecutor: PaidReportFulfillmentRpcExecutor,
): SupabasePaidReportFulfillmentRpcClient {
  return {
    async fulfillPaidPaymentOrder(input) {
      const result = await rpcExecutor(
        FULFILL_PAID_SAJU_MBTI_REPORT_RPC,
        createRpcArgs(input),
      );

      if (result.error !== null) {
        return mapRpcError(result.error);
      }

      const row = extractSingleRow(result.data);

      if (row === null) {
        return {
          ok: false,
          code: "PAID_REPORT_FULFILLMENT_RPC_VALIDATION_FAILED",
          messageKo: QUERY_INVALID_DATA_MESSAGE,
        };
      }

      return mapRpcRow(row);
    },
  };
}
