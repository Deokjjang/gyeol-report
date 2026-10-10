import "server-only";
import type { TossConfirmClientResult, TossConfirmRequest } from "../payment/tossConfirmTypes";
import type { TossCheckoutRequestDraft } from "../payment/tossCheckoutRequestTypes";
import { isValidRedirectUrl } from "../payment/tossCheckoutRequestAdapter";
import { ticketBundle } from "./bundleCatalog";
import type { BundleOrder, BundleResult, BundleStore } from "./bundleTypes";

export type BundleProvider = (input: TossConfirmRequest, recovery: boolean) => Promise<TossConfirmClientResult>;
export type BundleCheckoutConfig = { clientKey: string; successUrl: string; failUrl: string; allowLocalhostRedirects?: boolean };
const failure = (code: string): BundleResult => ({ ok: false, code });

export async function prepareBundleOrder(store: BundleStore, userId: string, input: { bundleId: unknown; requestId: unknown }, consent: unknown) {
  const bundle = ticketBundle(input.bundleId);
  if (!bundle || typeof input.requestId !== "string" || !/^[a-zA-Z0-9_-]{16,100}$/.test(input.requestId)) return failure("INVALID_INPUT");
  // The account handler supplies current required-consent evidence, not the body.
  try { return await store.call("prepare", userId, { bundleId: bundle.id, quantity: bundle.quantity, amount: bundle.amount, currency: bundle.currency, requestId: input.requestId, consent }); }
  catch { return failure("STORAGE_UNAVAILABLE"); }
}

export function bundleCheckout(order: BundleOrder, config: BundleCheckoutConfig, customerName: string) {
  const bundle = ticketBundle(order.bundleId);
  if (!bundle || order.status !== "READY" || order.amount !== bundle.amount || order.quantity !== bundle.quantity || order.currency !== "KRW" || order.provider !== "toss"
    || !config.clientKey.trim() || !isValidRedirectUrl(config.successUrl, config.allowLocalhostRedirects === true) || !isValidRedirectUrl(config.failUrl, config.allowLocalhostRedirects === true)) return null;
  // Same Toss SDK requestPayment contract, but no report product/id/session fiction.
  const requestPayment: TossCheckoutRequestDraft["requestPayment"] = {
    method: "CARD", orderId: order.providerOrderId, orderName: bundle.name,
    amount: { currency: order.currency, value: order.amount }, successUrl: config.successUrl, failUrl: config.failUrl, customerName,
  };
  return { provider: "toss" as const, clientKey: config.clientKey, requestPayment, metadata: { bundleOrderId: order.orderId, bundleId: order.bundleId } };
}

// Durable claim BEFORE the provider call. Approved receipt and grant are separate
// commits: failed grants retain PAID_PENDING_GRANT; unknown approval commits retain
// the payment key for provider lookup, never a new charge/order.
export async function confirmBundleOrder(store: BundleStore, userId: string, input: TossConfirmRequest, provider: BundleProvider): Promise<BundleResult> {
  if (!input.orderId || !input.paymentKey || input.paymentKey.length > 200 || !Number.isSafeInteger(input.amount)) return failure("INVALID_INPUT");
  try { return await settleBundleClaim(store, userId, await store.call("claim", userId, { ...input }), input.paymentKey, provider); }
  catch { return failure("PAYMENT_RECONCILIATION_REQUIRED"); }
}
export async function recoverBundleOrder(store: BundleStore, userId: string, orderId: string, provider: BundleProvider): Promise<BundleResult> {
  try {
    const claim = await store.call("recover", userId, { orderId });
    return await settleBundleClaim(store, userId, claim, claim.paymentKey ?? "", provider);
  } catch { return failure("PAYMENT_RECONCILIATION_REQUIRED"); }
}
async function settleBundleClaim(store: BundleStore, userId: string, claim: BundleResult, paymentKey: string, provider: BundleProvider): Promise<BundleResult> {
  if (!claim.ok || claim.pending || !claim.order || claim.order.status === "GRANTED") return { ok: claim.ok, code: claim.code, pending: claim.pending, order: claim.order };
  const order = claim.order;
  if (!claim.alreadyPaid) {
    const payment = { orderId: order.providerOrderId, paymentKey, amount: order.amount };
    let confirmed: TossConfirmClientResult;
    try { confirmed = await provider(payment, claim.recovery === true); }
    catch { return failure("PAYMENT_RECONCILIATION_REQUIRED"); }
    if (!confirmed.ok) return failure("PAYMENT_RECONCILIATION_REQUIRED");
    const receipt = confirmed.confirm;
    if (receipt.provider !== "toss" || receipt.orderId !== payment.orderId || receipt.amount !== order.amount || receipt.currency !== "KRW" || receipt.paymentKeyVerified !== true) return failure("PROVIDER_MISMATCH");
    if (["CANCELED", "PARTIAL_CANCELED", "ABORTED", "EXPIRED"].includes(receipt.status)) {
      await store.call("terminal", userId, { orderId: order.orderId, token: claim.token, status: receipt.status });
      return failure("PAYMENT_TERMINAL");
    }
    if (receipt.status !== "DONE" || !receipt.approvedAt || !Number.isFinite(Date.parse(receipt.approvedAt))) return failure("PAYMENT_RECONCILIATION_REQUIRED");
    const recorded = await store.call("approved", userId, { orderId: order.orderId, token: claim.token, paymentKey, provider: receipt.provider,
      providerOrderId: receipt.orderId, amount: receipt.amount, currency: receipt.currency, status: receipt.status, paidAt: receipt.approvedAt });
    if (!recorded.ok) return failure("PAYMENT_RECONCILIATION_REQUIRED");
  }
  try {
    const granted = await store.call("grant", userId, { orderId: order.orderId });
    return granted.ok && granted.order?.status === "GRANTED" ? granted : { ok: false, code: "PAID_PENDING_GRANT", order: granted.order };
  } catch { return { ok: false, code: "PAID_PENDING_GRANT" }; }
}
