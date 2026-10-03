import { getReportProduct } from "../payment/reportProductCatalog";

// Interactions are observations, never authority for money, grants or publication.
export const INTERACTIONS = ["campaign_landing_opened", "campaign_cta_clicked", "book_viewed", "book_selected", "input_started", "input_completed", "signup_started", "checkout_started", "coupon_applied", "ticket_selected", "report_opened", "referral_landing_opened", "referral_cta_clicked"] as const;
export const FACTS = ["account_created", "required_consent_completed", "campaign_attributed", "campaign_benefit_granted", "payment_succeeded", "ticket_redeemed", "publishing_started", "report_published", "share_created", "referral_link_created", "referral_attributed", "referral_referred_ticket_granted", "referral_qualified", "referral_inviter_ticket_granted"] as const;
export type Interaction = typeof INTERACTIONS[number];
export type FunnelEvent = { event: Interaction | typeof FACTS[number]; eventId: string; productType?: string; campaign?: string; occurredAt?: string; value?: number; currency?: "KRW" };
export type PurchaseFact = { eventId: string; productType: string; value: number; currency: "KRW" };
export type MetaEvent = { event: "PageView" | "ViewContent" | "InitiateCheckout" | "Purchase"; params: Record<string, unknown>; eventId?: string };

// Rebuild the allowlisted payload; do NOT spread an input, report or OAuth object.
export function metaProduct(event: "ViewContent" | "InitiateCheckout", productType: string): MetaEvent | null {
  const p = getReportProduct(productType);
  return p?.isPurchasable ? { event, params: { content_ids: [p.productType], content_type: "product", value: p.amount, currency: "KRW", ...(event === "InitiateCheckout" ? { num_items: 1 } : {}) } } : null;
}
export function metaPurchase(fact: PurchaseFact): MetaEvent | null {
  if (!getReportProduct(fact.productType)?.isPurchasable || !/^purchase_[a-f0-9]{32}$/.test(fact.eventId) || !Number.isSafeInteger(fact.value) || fact.value <= 0 || fact.currency !== "KRW") return null;
  return { event: "Purchase", eventId: fact.eventId, params: { content_ids: [fact.productType], content_type: "product", value: fact.value, currency: "KRW", num_items: 1 } };
}
export function validInteraction(value: unknown): value is FunnelEvent & { event: Interaction } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const e = value as Record<string, unknown>;
  return Object.keys(e).every(k => ["event", "eventId", "productType", "campaign"].includes(k))
    && INTERACTIONS.includes(e.event as Interaction) && typeof e.eventId === "string" && /^[a-f0-9-]{36}:[a-z_]+(?::[a-z_]+)?$/.test(e.eventId)
    && (e.productType === undefined || (typeof e.productType === "string" && !!getReportProduct(e.productType)?.isPurchasable))
    && (e.campaign === undefined || (typeof e.campaign === "string" && /^[a-z0-9][a-z0-9-]{2,63}$/.test(e.campaign)));
}
export function funnelCounts(events: readonly FunnelEvent[]) {
  const unique = new Map(events.map(e => [`${e.eventId}:${e.campaign ?? ""}`, e]));
  return Object.fromEntries([...INTERACTIONS, ...FACTS].map(event => [event, [...unique.values()].filter(e => e.event === event).length]));
}
