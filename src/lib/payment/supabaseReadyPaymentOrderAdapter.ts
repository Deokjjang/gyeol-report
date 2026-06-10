import {
  createPaymentOrderDraft,
  type PaymentOrderBoundaryErrorCode,
} from "./paymentOrderBoundary";
import type { PaymentProviderId } from "./paymentProviderTypes";
import type { ReportProductCurrency } from "./reportProductCatalog";
import type { PaymentOrderInputSnapshot } from "./paymentOrderTypes";
import type { ReportProductType } from "./reportProductTypes";
import type {
  ReadyPaymentOrderSafeRow,
  SupabaseReadyPaymentOrderQueryErrorCode,
  SupabaseReadyPaymentOrderRpcClient,
} from "./supabaseReadyPaymentOrderClient";

export type ReadyPaymentOrderView = {
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

export type CreateReadyPaymentOrderInput = {
  readonly productType?: unknown;
  readonly provider: unknown;
  readonly inputSnapshot: unknown;
  readonly providerOrderId?: string | null;
  readonly nowIso?: string;
  readonly client: SupabaseReadyPaymentOrderRpcClient;
};

export type ReadyPaymentOrderAdapterErrorCode =
  | PaymentOrderBoundaryErrorCode
  | SupabaseReadyPaymentOrderQueryErrorCode;

export type ReadyPaymentOrderAdapterResult =
  | {
      readonly ok: true;
      readonly order: ReadyPaymentOrderView;
    }
  | {
      readonly ok: false;
      readonly error: {
        readonly code: ReadyPaymentOrderAdapterErrorCode;
        readonly messageKo: string;
      };
    };

function failure(
  code: ReadyPaymentOrderAdapterErrorCode,
  messageKo: string,
): ReadyPaymentOrderAdapterResult {
  return {
    ok: false,
    error: {
      code,
      messageKo,
    },
  };
}

function mapSafeRowToView(row: ReadyPaymentOrderSafeRow): ReadyPaymentOrderView {
  return {
    paymentOrderId: row.paymentOrderId,
    productType: row.productType,
    provider: row.provider,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    providerOrderId: row.providerOrderId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function createReadyPaymentOrder(
  input: CreateReadyPaymentOrderInput,
): Promise<ReadyPaymentOrderAdapterResult> {
  const draftResult = createPaymentOrderDraft({
    productType: input.productType,
    provider: input.provider,
    inputSnapshot: input.inputSnapshot,
    nowIso: input.nowIso,
  });

  if (!draftResult.ok) {
    return {
      ok: false,
      error: draftResult.error,
    };
  }

  const order = draftResult.order;
  const rpcResult = await input.client.createReadyPaymentOrder({
    paymentOrderId: order.paymentOrderId,
    productType: order.productType,
    provider: order.provider,
    amount: order.amount,
    currency: order.currency,
    inputSnapshot: order.inputSnapshot as PaymentOrderInputSnapshot,
    providerOrderId: input.providerOrderId ?? null,
  });

  if (!rpcResult.ok) {
    return failure(rpcResult.code, rpcResult.messageKo);
  }

  return {
    ok: true,
    order: mapSafeRowToView(rpcResult.data),
  };
}
