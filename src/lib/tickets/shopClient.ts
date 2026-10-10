import { ticketBundle, type TicketBundleId } from "./bundleCatalog";
import { bundlePendingKey, bundleReturnKey, safeBookProduct } from "./shopContract";
import type { BundleOrder } from "./bundleTypes";
import type { bundleCheckout } from "./bundleService";

export type BundleCheckout = NonNullable<ReturnType<typeof bundleCheckout>> & { customerKey: string };
export type PendingBundle = { requestId: string; scope: string; bundleId: TicketBundleId; orderId?: string; providerOrderId?: string; launched?: boolean; payment?: { orderId: string; paymentKey: string; amount: number } };
export const validBundleOrderId = (id: unknown): id is string => typeof id === "string" && /^bundle_(?:toss_)?[a-f0-9]{32}$/.test(id);
export function readPendingBundle(storage: Pick<Storage, "getItem">): PendingBundle | null {
  try {
    const p = JSON.parse(storage.getItem(bundlePendingKey) ?? "null");
    return p && typeof p.requestId === "string" && /^[\w-]{16,100}$/.test(p.requestId) && /^[a-f0-9]{64}$/.test(p.scope) && ticketBundle(p.bundleId)
      && (!p.orderId || validBundleOrderId(p.orderId)) && (!p.providerOrderId || validBundleOrderId(p.providerOrderId)) ? p : null;
  } catch { return null; }
}
export function captureBundleCallback(url: URL, pending: PendingBundle | null): PendingBundle | null {
  // Only the same browser's prepared order is eligible for automatic confirm.
  // Otherwise owner-bound server recovery/history remains available.
  const orderId = url.searchParams.get("orderId"), paymentKey = url.searchParams.get("paymentKey"), amount = Number(url.searchParams.get("amount"));
  if (!pending || orderId !== pending.providerOrderId || !paymentKey || paymentKey.length > 200 || !Number.isSafeInteger(amount) || amount !== ticketBundle(pending.bundleId)?.amount) return pending;
  return { ...pending, payment: { orderId, paymentKey, amount } };
}
export function recordBookReturn(storage: Pick<Storage, "setItem">, product: string, scope: string): boolean {
  if (!safeBookProduct(product) || !/^[a-f0-9]{64}$/.test(scope)) return false;
  try { storage.setItem(bundleReturnKey, JSON.stringify({ product, scope })); return true; } catch { return false; }
}
export function readBookReturn(storage: Pick<Storage, "getItem">, scope: string) {
  try {
    const v = JSON.parse(storage.getItem(bundleReturnKey) ?? "null");
    return v?.scope === scope ? safeBookProduct(v.product) : null;
  } catch { return null; }
}
export function safeBundleOrder(value: unknown): value is BundleOrder {
  if (!value || typeof value !== "object") return false;
  const o = value as BundleOrder, b = ticketBundle(o.bundleId);
  return !!b && validBundleOrderId(o.orderId) && validBundleOrderId(o.providerOrderId) && Number.isSafeInteger(o.amount) && o.amount >= 100 && o.quantity === b.quantity && o.currency === "KRW"
    && ["READY", "CONFIRMING", "PAID_PENDING_GRANT", "GRANTED", "REFUND_PENDING", "REFUNDED", "FAILED"].includes(o.status);
}
export async function launchBundleCheckout(checkout: BundleCheckout) {
  // Reuse the SDK loader, not the direct-report launcher/metadata contract.
  let payment;
  try {
    const { loadTossPaymentsBrowserSdk } = await import("../payment/tossBrowserSdkLoader");
    const sdk = await loadTossPaymentsBrowserSdk(checkout.clientKey);
    payment = sdk.payment({ customerKey: checkout.customerKey });
  } catch { return "not-started" as const; }
  // Once invoked, rejection/cancel is uncertain. Do not unlock another charge.
  await payment.requestPayment(checkout.requestPayment);
  return "returned" as const;
}
