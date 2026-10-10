import { REPORT_PRICE_KRW } from "../payment/reportProductCatalog";

// Price/quantity are selected here on the server, never accepted from a browser.
export const TICKET_BUNDLES = [
  { id: "SINGLE_1", quantity: 1, amount: REPORT_PRICE_KRW },
  { id: "PACK_3", quantity: 3, amount: 4290 },
  { id: "PACK_5", quantity: 5, amount: 6890 },
  { id: "PACK_10", quantity: 10, amount: 13400 },
] as const;
export type TicketBundleId = typeof TICKET_BUNDLES[number]["id"];
export function ticketBundle(id: unknown) {
  const bundle = TICKET_BUNDLES.find(item => item.id === id);
  return bundle ? { ...bundle, currency: "KRW" as const, name: `결리포트 이용권 ${bundle.quantity}장` } : null;
}
// No public activation, environment override, automatic refunds or arbitrary expiry.
export function ticketBundleCommerceEnabled(): boolean { return false; }
export const AUTOMATIC_BUNDLE_REFUND_ENABLED = false;
