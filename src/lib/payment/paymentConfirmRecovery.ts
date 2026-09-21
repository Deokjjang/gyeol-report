import { ExternalCallTimeout, withDeadline } from "../network/withDeadline";
import type { ReliabilityStore } from "./paidReportReliabilityStore";
import type { TossConfirmClientResult, TossConfirmRequest } from "./tossConfirmTypes";
import { isRecord } from "../report-generation/productPublishGate";

export const PAYMENT_RECOVERY_TIMEOUT_MS = 10_000;
type RecoveryConfirm = (payment: TossConfirmRequest, signal: AbortSignal) => Promise<TossConfirmClientResult>;

// One durable claim per worker. No provider messages, keys or payloads enter audit fields.
export async function recoverPendingPayment(store: ReliabilityStore, confirm: RecoveryConfirm) {
  const claim = await store.call("claim_payment_recovery");
  if (!claim.ok || !isRecord(claim.order)) return claim;
  const order = claim.order;
  const payment = { orderId: String(order.provider_order_id), paymentKey: String(order.provider_payment_id), amount: Number(order.amount) };
  const failed = (code: string, attention = false) => store.call("payment_recovery_failed", {
    paymentOrderId: order.payment_order_id, token: claim.token, code, attention,
  });
  let paidAt: string | undefined;
  if (!claim.alreadyPaid) {
    let result: TossConfirmClientResult;
    try {
      result = await withDeadline(signal => confirm(payment, signal), PAYMENT_RECOVERY_TIMEOUT_MS);
    } catch (error) {
      return failed(error instanceof ExternalCallTimeout ? "RECOVERY_TIMEOUT" : "RECOVERY_PROVIDER_UNCERTAIN");
    }
    if (!result.ok) {
      if (result.error.code === "TOSS_CONFIRM_CONFIG_MISSING") return failed("RECOVERY_CONFIG_MISSING", true);
      if (result.error.code === "TOSS_CONFIRM_AMOUNT_MISMATCH" || result.error.code === "TOSS_CONFIRM_INVALID_REQUEST") return failed("RECOVERY_PROVIDER_MISMATCH", true);
      return failed("RECOVERY_PROVIDER_UNCERTAIN");
    }
    if (result.confirm.orderId !== payment.orderId || result.confirm.amount !== payment.amount) return failed("RECOVERY_PROVIDER_MISMATCH", true);
    if (["CANCELED", "PARTIAL_CANCELED", "ABORTED", "EXPIRED"].includes(result.confirm.status)) return failed("RECOVERY_PROVIDER_TERMINAL", true);
    if (result.confirm.status !== "DONE") return failed("RECOVERY_PROVIDER_UNCERTAIN");
    paidAt = result.confirm.approvedAt;
  }
  try {
    const result = await store.call("confirm_finish", { ...payment, token: claim.token, paidAt });
    if (result.ok) return result;
    if (result.code === "FULFILLMENT_CONFLICT" || result.code === "DUPLICATE_ORDER_OR_PAYMENT") return failed("RECOVERY_REPORT_LINK_CONFLICT", true);
    if (result.code === "INPUT_EXPIRED") return failed("RECOVERY_INPUT_EXPIRED", true);
    return failed("RECOVERY_DB_FINISH_FAILED");
  } catch {
    return failed("RECOVERY_DB_FINISH_FAILED");
  }
}
