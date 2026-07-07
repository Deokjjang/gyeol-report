import { createClient } from "@supabase/supabase-js";

import { parsePaymentProviderId } from "./paymentProviderBoundary";
import type { PaymentProviderId } from "./paymentProviderTypes";
import type { ReportProductCurrency } from "./reportProductCatalog";
import { getReportProduct } from "./reportProductCatalog";
import { parseReportProductType } from "./reportProductTypes";
import type { ReportProductType } from "./reportProductTypes";

export type ReadyPaymentOrderRpcInput = {
  readonly paymentOrderId: string;
  readonly productType: ReportProductType;
  readonly provider: PaymentProviderId;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
  readonly inputSnapshot: Readonly<Record<string, unknown>>;
  readonly providerOrderId?: string | null;
};

export type ReadyPaymentOrderRpcResultRow = {
  readonly payment_order_id: string;
  readonly product_type: string;
  readonly provider: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: string;
  readonly provider_order_id: string | null;
  readonly created_at: string;
  readonly updated_at: string;
};

export type ReadyPaymentOrderSafeRow = {
  readonly paymentOrderId: string;
  readonly productType: ReportProductType;
  readonly provider: PaymentProviderId;
  readonly amount: number;
  readonly currency: ReportProductCurrency;
  readonly status: "ready";
  readonly providerOrderId: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type SupabaseReadyPaymentOrderQueryErrorCode =
  | "DB_UNAVAILABLE"
  | "DUPLICATE_PAYMENT_ORDER"
  | "PERMISSION_DENIED"
  | "READY_PAYMENT_ORDER_RPC_FAILED"
  | "READY_PAYMENT_ORDER_RPC_VALIDATION_FAILED";

export type SupabaseReadyPaymentOrderQueryResult<T> =
  | {
      readonly ok: true;
      readonly data: T;
    }
  | {
      readonly ok: false;
      readonly code: SupabaseReadyPaymentOrderQueryErrorCode;
      readonly messageKo: string;
    };

export type ReadyPaymentOrderRpcExecutor = (
  functionName: string,
  args: Record<string, unknown>,
) => Promise<{
  readonly data: unknown;
  readonly error: SupabaseReadyPaymentOrderRpcError | null;
}>;

export type SupabaseReadyPaymentOrderRpcClient = {
  createReadyPaymentOrder(
    input: ReadyPaymentOrderRpcInput,
  ): Promise<SupabaseReadyPaymentOrderQueryResult<ReadyPaymentOrderSafeRow>>;
};

export type SupabaseReadyPaymentOrderClientConfig = {
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly rpcExecutor?: ReadyPaymentOrderRpcExecutor;
};

type SupabaseReadyPaymentOrderRpcError = {
  readonly code?: string;
  readonly message: string;
};

const CREATE_READY_PAYMENT_ORDER_RPC = "create_ready_payment_order";
const QUERY_FAILED_MESSAGE = "Supabase ready payment order RPC failed.";
const QUERY_INVALID_DATA_MESSAGE =
  "Supabase ready payment order RPC returned invalid data.";

function createUnavailableResult<T>(): SupabaseReadyPaymentOrderQueryResult<T> {
  return {
    ok: false,
    code: "DB_UNAVAILABLE",
    messageKo: "Supabase ready payment order client is not connected.",
  };
}

function mapRpcError<T>(
  error: SupabaseReadyPaymentOrderRpcError,
): SupabaseReadyPaymentOrderQueryResult<T> {
  if (error.code === "23505") {
    return {
      ok: false,
      code: "DUPLICATE_PAYMENT_ORDER",
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

  return {
    ok: false,
    code: "READY_PAYMENT_ORDER_RPC_FAILED",
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

function extractSingleRow(data: unknown): ReadyPaymentOrderRpcResultRow | null {
  if (Array.isArray(data) && data.length === 1 && isObjectRecord(data[0])) {
    return data[0] as ReadyPaymentOrderRpcResultRow;
  }

  if (isObjectRecord(data)) {
    return data as ReadyPaymentOrderRpcResultRow;
  }

  return null;
}

function mapRpcRow(
  row: ReadyPaymentOrderRpcResultRow,
): SupabaseReadyPaymentOrderQueryResult<ReadyPaymentOrderSafeRow> {
  const productType = parseReportProductType(row.product_type);
  const provider = parsePaymentProviderId(row.provider);
  const product = getReportProduct(productType);

  if (
    product === null ||
    !isNonEmptyString(row.payment_order_id) ||
    productType === null ||
    provider === null ||
    row.amount !== product.amount ||
    row.currency !== product.currency ||
    row.status !== "ready" ||
    (row.provider_order_id !== null && !isNonEmptyString(row.provider_order_id)) ||
    !isTimestamp(row.created_at) ||
    !isTimestamp(row.updated_at)
  ) {
    return {
      ok: false,
      code: "READY_PAYMENT_ORDER_RPC_VALIDATION_FAILED",
      messageKo: QUERY_INVALID_DATA_MESSAGE,
    };
  }

  return {
    ok: true,
    data: {
      paymentOrderId: row.payment_order_id,
      productType,
      provider,
      amount: row.amount,
      currency: row.currency,
      status: "ready",
      providerOrderId: row.provider_order_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    },
  };
}

function createRpcArgs(input: ReadyPaymentOrderRpcInput): Record<string, unknown> {
  return {
    p_payment_order_id: input.paymentOrderId,
    p_product_type: input.productType,
    p_provider: input.provider,
    p_amount: input.amount,
    p_currency: input.currency,
    p_input_snapshot: input.inputSnapshot,
    p_provider_order_id: input.providerOrderId ?? null,
  };
}

export function createUnavailableSupabaseReadyPaymentOrderClient(): SupabaseReadyPaymentOrderRpcClient {
  return {
    async createReadyPaymentOrder() {
      return createUnavailableResult();
    },
  };
}

export function createSupabaseReadyPaymentOrderClient(
  config: SupabaseReadyPaymentOrderClientConfig = {},
): SupabaseReadyPaymentOrderRpcClient {
  if (config.rpcExecutor !== undefined) {
    return createConnectedClient(config.rpcExecutor);
  }

  if (config.supabaseUrl === undefined || config.supabaseAnonKey === undefined) {
    return createUnavailableSupabaseReadyPaymentOrderClient();
  }

  const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  const rpcExecutor: ReadyPaymentOrderRpcExecutor = async (functionName, args) => {
    const result = await client.rpc(functionName, args);

    return {
      data: result.data,
      error: result.error,
    };
  };

  return createConnectedClient(rpcExecutor);
}

function createConnectedClient(
  rpcExecutor: ReadyPaymentOrderRpcExecutor,
): SupabaseReadyPaymentOrderRpcClient {
  return {
    async createReadyPaymentOrder(input) {
      const result = await rpcExecutor(
        CREATE_READY_PAYMENT_ORDER_RPC,
        createRpcArgs(input),
      );

      if (result.error !== null) {
        return mapRpcError(result.error);
      }

      const row = extractSingleRow(result.data);

      if (row === null) {
        return {
          ok: false,
          code: "READY_PAYMENT_ORDER_RPC_VALIDATION_FAILED",
          messageKo: QUERY_INVALID_DATA_MESSAGE,
        };
      }

      return mapRpcRow(row);
    },
  };
}
