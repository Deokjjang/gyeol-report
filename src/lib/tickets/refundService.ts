import "server-only";
import { automaticRefundMethod, confirmedRefund, type RefundProvider } from "../payment/tossRefundClient";
import type { RefundResult, RefundStore } from "./refundContract";

// Service-only operator procedure. Not an HTTP/customer action; no implicit batch,
// automatic approval, credential loading, or provider live invocation.
export async function processApprovedRefund(store: RefundStore, provider: RefundProvider, userId: string, bundleOrderId: string, requestId: string, operatorRef: string): Promise<RefundResult> {
  const args={ bundleOrderId,requestId,operatorRef };
  try {
    const claimed=await store.call("claim",userId,args);
    if (!claimed.ok) return claimed;
    if (claimed.refund?.state==="COMPLETED") return claimed;
    if (claimed.intent) {
      const i=claimed.intent;
      // Always GET first, including initial execution, restarts and retries.
      let result=await provider.lookup(i);
      if (!result.ok) return { ok:false,code:"PROVIDER_OUTCOME_UNKNOWN",refund:claimed.refund };
      let confirmed=confirmedRefund(result.payment,i);
      if (!confirmed) {
        if (result.payment.cancels.length || result.payment.balanceAmount!==i.originalAmount) return await store.call("attention",userId,{ ...args,token:i.token,code:"PROVIDER_MISMATCH" });
        if (!i.canPost) return await store.call("attention",userId,{ ...args,token:i.token,code:"IDEMPOTENCY_EXPIRED" });
        if (!automaticRefundMethod(result.payment,i)) return await store.call("attention",userId,{ ...args,token:i.token,code:"METHOD_REVIEW" });
        result=await provider.cancel(i);
        if (!result.ok) {
          // Even an error can follow a successful financial transaction. GET again;
          // never release a hold based on an error response or client timeout.
          const code=result.code;
          result=await provider.lookup(i);
          if (!result.ok) return { ok:false,code:"PROVIDER_OUTCOME_UNKNOWN",refund:claimed.refund };
          confirmed=confirmedRefund(result.payment,i);
          if (!confirmed) {
            if (code==="PROVIDER_UNKNOWN" && result.payment.cancels.length===0) return { ok:false,code:"PROVIDER_OUTCOME_UNKNOWN",refund:claimed.refund };
            return await store.call("attention",userId,{ ...args,token:i.token,code });
          }
        } else confirmed=confirmedRefund(result.payment,i);
      }
      if (!confirmed || !result.ok) return await store.call("attention",userId,{ ...args,token:i.token,code:"PROVIDER_MISMATCH" });
      const saved=await store.call("confirm",userId,{ ...args,token:i.token,paymentKey:i.paymentKey,providerOrderId:i.providerOrderId,currency:"KRW",
        totalAmount:i.originalAmount,balanceAmount:result.payment.balanceAmount,...confirmed });
      if (!saved.ok) return saved; // PG success / DB failure remains held, recover via GET.
    } else if (!["PG_CANCEL_CONFIRMED","LEDGER_SETTLED"].includes(claimed.refund?.state ?? "")) return { ok:false,code:"REFUND_REVIEW_REQUIRED" };
    const settled=await store.call("settle",userId,args);
    if (!settled.ok) return settled;
    return await store.call("complete",userId,args);
  } catch { return { ok:false,code:"REFUND_RECONCILIATION_REQUIRED" }; }
}
