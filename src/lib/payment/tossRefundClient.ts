import "server-only";
import { Buffer } from "node:buffer";
import type { RefundIntent } from "../tickets/refundContract";

type Cancel = { transactionKey: string; cancelAmount: number; cancelReason: string; cancelStatus: string; canceledAt: string };
export type RefundPayment = { paymentKey: string; orderId: string; currency: "KRW"; totalAmount: number; balanceAmount: number; status: string; method: string; isPartialCancelable: boolean; cancels: Cancel[] };
export type RefundProviderResult = { ok: true; payment: RefundPayment } | { ok: false; code: "PROVIDER_UNKNOWN" | "PROVIDER_REJECTED" | "PROVIDER_MISMATCH" };
export interface RefundProvider { lookup(intent: RefundIntent): Promise<RefundProviderResult>; cancel(intent: RefundIntent): Promise<RefundProviderResult> }
export function refundPayment(value: unknown, intent: RefundIntent): RefundPayment | null {
  if (!value || typeof value!=="object") return null;
  const p=value as RefundPayment;
  if (p.paymentKey!==intent.paymentKey || p.orderId!==intent.providerOrderId || p.currency!=="KRW" || p.totalAmount!==intent.originalAmount
    || !Number.isSafeInteger(p.balanceAmount) || p.balanceAmount<0 || p.balanceAmount>p.totalAmount || typeof p.method!=="string"
    || typeof p.isPartialCancelable!=="boolean" || !["DONE","PARTIAL_CANCELED","CANCELED"].includes(p.status)) return null;
  const cancels=p.cancels ?? [];
  if (!Array.isArray(cancels) || cancels.length>100 || cancels.some(c=>!c || typeof c.transactionKey!=="string" || !c.transactionKey.length || c.transactionKey.length>64
    || !Number.isSafeInteger(c.cancelAmount) || c.cancelAmount<=0 || c.cancelStatus!=="DONE" || typeof c.cancelReason!=="string" || !Number.isFinite(Date.parse(c.canceledAt)))) return null;
  if (new Set(cancels.map(c=>c.transactionKey)).size!==cancels.length || cancels.reduce((n,c)=>n+c.cancelAmount,0)!==p.totalAmount-p.balanceAmount) return null;
  if ((p.status==="DONE" && cancels.length) || (p.status==="CANCELED" && p.balanceAmount!==0) || (p.status==="PARTIAL_CANCELED" && (p.balanceAmount===0 || !cancels.length))) return null;
  // Whitelist fields: no card/account/holder details retained by refund processing.
  return { paymentKey:p.paymentKey,orderId:p.orderId,currency:p.currency,totalAmount:p.totalAmount,balanceAmount:p.balanceAmount,status:p.status,method:p.method,isPartialCancelable:p.isPartialCancelable,
    cancels:cancels.map(c=>({ transactionKey:c.transactionKey,cancelAmount:c.cancelAmount,cancelReason:c.cancelReason,cancelStatus:c.cancelStatus,canceledAt:c.canceledAt })) };
}
export function confirmedRefund(payment: RefundPayment, intent: RefundIntent) {
  const p=refundPayment(payment,intent);
  // This release refunds all remaining units once. Unrelated/out-of-band cancellation
  // needs separate reconciliation, not an amount-only guess about our transaction.
  if (!p || p.cancels.length!==1 || p.balanceAmount!==intent.originalAmount-intent.amount) return null;
  const c=p.cancels[0];
  return c.cancelAmount===intent.amount && c.cancelReason===intent.cancelReason && Date.parse(c.canceledAt)>=Date.parse(intent.firstAttemptAt)-1000 ? c : null;
}
export function automaticRefundMethod(p: RefundPayment, intent: RefundIntent): boolean {
  // Current checkout CARD / domestic easy-pay only. Other methods are manual review,
  // never a rejection of consumer rights or a request for bank data in this API.
  return ["카드","간편결제"].includes(p.method) && (intent.amount===intent.originalAmount || p.isPartialCancelable);
}
// No default global fetch, no env reads, no public route wiring. An authorized
// future operator composition must explicitly inject transport + server secret.
// This phase uses an isolated mock transport ONLY (not Toss test credentials).
export function createTossRefundProvider(secretKey: string, fetchImpl: typeof fetch): RefundProvider {
  const request = async (intent: RefundIntent, cancel: boolean): Promise<RefundProviderResult> => {
    if (cancel && (!intent.canPost || !Number.isFinite(Date.parse(intent.firstAttemptAt)) || Date.now()>=Date.parse(intent.firstAttemptAt)+15*24*60*60*1000)) return { ok:false,code:"PROVIDER_MISMATCH" };
    if (!secretKey || !intent.paymentKey || intent.paymentKey.length>200 || !Number.isSafeInteger(intent.amount) || intent.amount<=0 || intent.amount>intent.originalAmount
      || !/^ticket-refund-[a-f0-9-]{36}$/.test(intent.idempotencyKey) || !intent.cancelReason || intent.cancelReason.length>200) return { ok:false,code:"PROVIDER_MISMATCH" };
    const abort=new AbortController(), timer=setTimeout(()=>abort.abort(),15000);
    try {
      const response=await fetchImpl(`https://api.tosspayments.com/v1/payments/${encodeURIComponent(intent.paymentKey)}${cancel ? "/cancel" : ""}`, {
        method:cancel ? "POST" : "GET", cache:"no-store", redirect:"error", signal:abort.signal,
        headers:{ Authorization:`Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`, ...(cancel ? { "Content-Type":"application/json", "Idempotency-Key":intent.idempotencyKey } : {}) },
        ...(cancel ? { body:JSON.stringify({ cancelReason:intent.cancelReason,cancelAmount:intent.amount,currency:"KRW" }) } : {}),
      });
      if (!response.ok) return { ok:false,code:response.status>=400 && response.status<500 ? "PROVIDER_REJECTED" : "PROVIDER_UNKNOWN" };
      const payment=refundPayment(await response.json(),intent);
      return payment ? { ok:true,payment } : { ok:false,code:"PROVIDER_MISMATCH" };
    } catch { return { ok:false,code:"PROVIDER_UNKNOWN" }; }
    finally { clearTimeout(timer); }
  };
  return { lookup:i=>request(i,false), cancel:i=>request(i,true) };
}
