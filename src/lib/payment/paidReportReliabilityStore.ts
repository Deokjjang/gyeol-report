import { createClient } from "@supabase/supabase-js";
import { isRecord } from "../report-generation/productPublishGate";
import { mapPaymentOrderRowToRecord, type PaymentOrderRow } from "./paymentOrderPersistenceMapper";
import type { PaymentOrderPersistenceAdapter } from "./paymentOrderPersistenceTypes";

export type ReliabilityResult = { ok: boolean; code?: string; [key: string]: unknown };
export type ReliabilityStore = { call(action: string, data?: Record<string, unknown>): Promise<ReliabilityResult> };

export function createPaidReportReliabilityStore(env = process.env): ReliabilityStore {
  const url = env.SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  const client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return {
    async call(action, data = {}) {
      if (!client) return { ok: false, code: "DURABLE_STORAGE_UNAVAILABLE" };
      try {
        const result = await client.rpc("paid_report_reliability", { p_action: action, p_data: data });
        return !result.error && isRecord(result.data) && typeof result.data.ok === "boolean"
          ? result.data as ReliabilityResult : { ok: false, code: "DURABLE_STORAGE_FAILED" };
      } catch {
        return { ok: false, code: "DURABLE_STORAGE_FAILED" };
      }
    },
  };
}

export function createDurablePaymentOrderAdapter(store = createPaidReportReliabilityStore()): PaymentOrderPersistenceAdapter {
  const unavailable = () => ({ ok: false as const, error: { code: "PAYMENT_ORDER_INVALID_STATE" as const, messageKo: "주문을 처리하지 못했습니다. 잠시 후 다시 확인해 주세요." } });
  const find = async (data: Record<string, unknown>) => {
    const result = await store.call("find_order", data);
    if (!result.ok || !isRecord(result.order)) return null;
    const mapped = mapPaymentOrderRowToRecord(result.order as PaymentOrderRow);
    return mapped.ok ? mapped.value : null;
  };
  return {
    async create(order) {
      const result = await store.call("create_order", { ...order });
      return result.ok ? { ok: true, value: order } : unavailable();
    },
    findByPaymentOrderId: (paymentOrderId) => find({ paymentOrderId }),
    findByProviderOrderId: (orderId) => find({ orderId }),
    // Paid transitions and report links must use the atomic confirmation RPC.
    markPaid: async () => unavailable(),
    markFailed: async () => unavailable(),
    markCanceled: async () => unavailable(),
    markRefunded: async () => unavailable(),
    attachReport: async () => unavailable(),
    markReportGenerationFailed: async () => unavailable(),
  };
}
