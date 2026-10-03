import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { getReportProduct } from "../payment/reportProductCatalog";
import { createCheckoutConsentEvidence } from "../payment/checkoutConsent";
import { createAnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";
import { normalizeReportInputPayload } from "../report-generation/reportInputAdapter";
import { isRecord } from "../report-generation/productPublishGate";
import { purchaseMetadata } from "../library/model";
import type { TossConfirmClientResult, TossConfirmRequest } from "../payment/tossConfirmTypes";
import { preparePaymentCheckoutSession } from "../payment/paymentCheckoutSessionBoundary";
import { prepareTossCheckoutRequest } from "../payment/tossCheckoutRequestAdapter";

export type CouponIdentity = { user: string | null; actor: string };
export type CouponSelection = { code: string; grantId?: never } | { grantId: string; code?: never };
export type CouponResult = { ok: boolean; code?: string; state?: string; orderId?: string; reportId?: string; [key: string]: unknown };
export type CouponStore = { call(action: string, identity: CouponIdentity, data?: Record<string, unknown>): Promise<CouponResult> };
export type CouponQuote = { originalAmount: number; discountAmount: number; finalAmount: number; coupon: { name: string } | null };
export const couponError = (code: string): CouponResult => ({ ok: false, code });
export function validCouponSelection(value: unknown): value is CouponSelection {
  return isRecord(value) && Object.keys(value).length === 1 &&
    ((typeof value.code === "string" && /^[A-Za-z0-9_-]{3,40}$/.test(value.code.trim())) ||
      (typeof value.grantId === "string" && /^[a-f0-9-]{36}$/i.test(value.grantId)));
}
export async function quoteCoupon(store: CouponStore, identity: CouponIdentity, productType: unknown, selection?: CouponSelection) {
  const product = getReportProduct(productType);
  if (!product?.isPurchasable) return couponError("PRODUCT_INVALID");
  if (!selection) return { ok: true, originalAmount: product.amount, discountAmount: 0, finalAmount: product.amount, coupon: null };
  if (!validCouponSelection(selection)) return couponError("COUPON_INVALID");
  return store.call("quote", identity, { ...selection, productType: product.productType, originalAmount: product.amount });
}
// Server caller has already authenticated identity. No client monetary fields.
export async function reserveCouponOrder(store: CouponStore, identity: CouponIdentity,
  input: { requestId: string; payload: unknown; consent: unknown; selection: CouponSelection; claimHash: string | null }, now = new Date()) {
  if (!validCouponSelection(input.selection) || !/^[A-Za-z0-9_-]{16,100}$/.test(input.requestId) || !isRecord(input.payload)) return couponError("REQUEST_INVALID");
  const payload = input.payload, product = getReportProduct(payload.productKey), normalized = normalizeReportInputPayload(payload, { now: () => now });
  const person = isRecord(payload.person) ? payload.person : payload.personA;
  const consent = isRecord(person) && typeof person.birthDate === "string" ? createCheckoutConsentEvidence(input.consent,person.birthDate,now) : null;
  if (!product?.isPurchasable || !normalized.ok || !consent) return couponError("INPUT_OR_CONSENT_INVALID");
  const annualCommerceAcceptance = product.productType === "annual_fortune" && isRecord(payload.productOptions)
    ? createAnnualCommerceAcceptance(Number(payload.productOptions.selectedYear),now) : undefined;
  const inputSnapshot = { reportInputPayload: payload, checkoutConsent: consent, ...(annualCommerceAcceptance ? { annualCommerceAcceptance } : {}) };
  return store.call("reserve",identity,{ ...input.selection, requestId:input.requestId,
    orderId:`coupon-local-${randomUUID()}`, productType:product.productType, originalAmount:product.amount,
    inputHash:createHash("sha256").update(JSON.stringify(payload)).digest("hex"),inputSnapshot,
    claimHash:input.claimHash,...purchaseMetadata(payload) });
}
// Must be an INTERNAL provider adapter, never an HTTP request field. An ambiguous
// network failure is NOT definitive; it remains reserved for reconciliation.
export async function confirmCouponOrder(store: CouponStore, identity: CouponIdentity, orderId: string, paymentKey: string,
  confirm: (payment: TossConfirmRequest) => Promise<TossConfirmClientResult & { definitiveFailure?: boolean }>) {
  const claim = await store.call("begin_confirm",identity,{orderId,paymentKey});
  if (!claim.ok || claim.pending || claim.state === "REDEEMED" || claim.reportId) return claim;
  if (typeof claim.token !== "string" || !Number.isSafeInteger(claim.finalAmount) || Number(claim.finalAmount)<100 || typeof claim.providerOrderId!=="string") return couponError("ORDER_BINDING_INVALID");
  const payment = { orderId:claim.providerOrderId,paymentKey,amount:Number(claim.finalAmount) };
  try {
    const result = await confirm(payment);
    if (!result.ok) return result.definitiveFailure
      ? await store.call("verified_failure",identity,{orderId,token:claim.token}) : couponError("PAYMENT_RECONCILIATION_REQUIRED");
    if(result.confirm.status!=="DONE" || result.confirm.amount!==payment.amount || result.confirm.orderId!==payment.orderId) return couponError("PAYMENT_RECONCILIATION_REQUIRED");
    return await store.call("finish_confirm",identity,{orderId,paymentKey,token:claim.token,amount:payment.amount,paidAt:result.confirm.approvedAt});
  } catch { return couponError("PAYMENT_RECONCILIATION_REQUIRED"); }
}
// Uses the current checkout adapters, with the amount returned by SQL reserve.
// Local mock key/URLs only; public activation is deliberately absent.
export function localCouponCheckout(productType:unknown,reservation:CouponResult) {
  if(!["test","development"].includes(process.env.NODE_ENV)||!reservation.ok||typeof reservation.orderId!=="string"||typeof reservation.finalAmount!=="number")return null;
  const session=preparePaymentCheckoutSession({paymentOrderId:reservation.orderId,providerOrderId:reservation.orderId,productType,provider:"toss",amount:reservation.finalAmount,currency:"KRW",status:"ready"},reservation.finalAmount);
  if(!session.ok)return null;
  const checkout=prepareTossCheckoutRequest({checkoutSession:session.session,clientKey:"local-mock-not-a-provider-key",successUrl:"http://127.0.0.1/dev/book-flow",failUrl:"http://127.0.0.1/dev/book-flow",allowLocalhostRedirects:true},reservation.finalAmount);
  return checkout.ok?checkout.draft:null;
}
