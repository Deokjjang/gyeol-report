"use client";
import { metaOrigin } from "./metaConsent";
import { metaProduct, metaPurchase, type FunnelEvent, type Interaction, type MetaEvent, type PurchaseFact } from "./events";

declare global { interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown } }
const delivered = new Set<string>();
const pending = new Map<string, MetaEvent>();
let retry: ReturnType<typeof setTimeout> | undefined;
// Suppression only: cannot enable a product/auth gate or production transport.
export const manualReviewSilent = () => process.env.NODE_ENV !== "production" && typeof window !== "undefined" &&
  (/^\/dev\/content-review(?:\/|$)/.test(window.location.pathname ?? "") || process.env.NEXT_PUBLIC_LOCAL_REVIEW_SILENT === "1");
export const localMeasurement = () => process.env.NODE_ENV !== "production" && typeof window !== "undefined" && /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
let metaChoice = false;
export function setMetaChoice(agreed: boolean) { metaChoice = agreed; lastPage = undefined; if (!agreed) { pending.clear(); if (retry) clearTimeout(retry); retry = undefined; } }
export const publicMetaAllowed = () => process.env.NODE_ENV === "production" && typeof window !== "undefined" && metaOrigin(window.location.origin) && metaChoice;
const publicPath = (path: string) => path === "/" || path === "/campaign/gyeol-opening-2026" || path === "/report/new" || path === "/checkout";

function capture(channel: "internal" | "meta", event: FunnelEvent | MetaEvent) {
  if (localMeasurement()) {
    const detail = { channel, ...event };
    window.dispatchEvent(new CustomEvent("gyeol:measurement", { detail }));
    // Inspectable local test adapter only; never enabled on preview/Production hosts.
    try { const log = JSON.parse(sessionStorage.getItem("gyeol:measurement") ?? "[]"); sessionStorage.setItem("gyeol:measurement", JSON.stringify([...log.slice(-399), detail])); } catch { /* optional diagnostic */ }
  }
}
export function sendMeta(event: MetaEvent, key: string) {
  if (manualReviewSilent()) return;
  if (typeof window === "undefined" || delivered.has(key)) return;
  if (localMeasurement()) { delivered.add(key); capture("meta", event); return; }
  if (!publicMetaAllowed()) return;
  // Business conversions are sent solely by server-verified durable facts.
  if (!["PageView", "ViewContent", "InitiateCheckout"].includes(event.event) || !publicPath(window.location.pathname)) return;
  if (pending.has(key)) return;
  pending.set(key, event);
  const productType = Array.isArray(event.params.content_ids) ? event.params.content_ids[0] : undefined;
  void fetch("/api/analytics/meta", { method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ event: event.event, ...(typeof productType === "string" ? { productType } : {}), requestId: crypto.randomUUID() }), keepalive: true,
  }).then(r => { if (r.ok) delivered.add(key); }).catch(() => {}).finally(() => pending.delete(key));
}
export function flushMeta() { for (const [key, event] of pending) sendMeta(event, key); }
let lastPage: string | undefined;
let pageSequence = 0;
export function pageView(path: string) {
  if (manualReviewSilent()) return;
  if (!path || path === lastPage || (!localMeasurement() && (!publicMetaAllowed() || !publicPath(path)))) return;
  lastPage = path;
  sendMeta({ event: "PageView", params: {} }, `page:${++pageSequence}`);
}

// Opaque, session-local journey; no answers, user IDs or campaign query propagation.
export function journeyId() {
  try {
    const stored = sessionStorage.getItem("gyeol:journey");
    if (stored && /^[a-f0-9-]{36}$/.test(stored)) return stored;
    const id = crypto.randomUUID(); sessionStorage.setItem("gyeol:journey", id); return id;
  } catch { return fallbackJourney ??= crypto.randomUUID(); }
}
let fallbackJourney: string | undefined;
export function interaction(event: Interaction, productType?: string, campaign?: string) {
  if (manualReviewSilent()) return;
  if (typeof window === "undefined") return;
  const eventId = `${journeyId()}:${event}${productType ? `:${productType}` : ""}`;
  const key = `gyeol:event:${eventId}:${campaign ?? ""}`;
  try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch { if (delivered.has(key)) return; }
  delivered.add(key);
  const data: FunnelEvent = { event, eventId, ...(productType ? { productType } : {}), ...(campaign ? { campaign } : {}) };
  capture("internal", data);
  if (localMeasurement()) void fetch("/dev/measurement", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data), keepalive: true }).catch(() => {});
  const mapped = event === "book_viewed" ? "ViewContent" : event === "checkout_started" ? "InitiateCheckout" : null;
  const message = mapped && productType ? metaProduct(mapped, productType) : null;
  if (message) sendMeta(message, eventId);
}
// Business truth comes only from the authenticated server projection. Repeated
// polling/refresh is keyed by the source entity, never by a callback invocation.
export async function syncLocalFacts() {
  if (manualReviewSilent()) return;
  if (!localMeasurement()) return;
  try {
    const r = await fetch("/dev/measurement", { cache: "no-store" });
    if (!r.ok) return;
    const { events, purchases } = await r.json() as { events: FunnelEvent[]; purchases?: Array<{ reportId: string }> };
    for (const event of events ?? []) {
      const key = `gyeol:fact:${event.eventId}`;
      if (localStorage.getItem(key)) continue;
      localStorage.setItem(key, "1"); capture("internal", event);
    }
    for (const purchase of purchases ?? []) await dispatchPurchase(purchase.reportId, true);
  } catch { /* Analytics failure never changes checkout/publication. */ }
}
export async function dispatchPurchase(reportId: string, local = false) {
  if (manualReviewSilent()) return;
  if (!(local ? localMeasurement() : publicMetaAllowed())) return;
  try {
    // Claim only when the transport is ready. The SQL unique order wins across tabs.
    const response = await fetch(local ? "/dev/measurement" : "/api/analytics/purchase", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reportId, ...(!local ? { requestId: crypto.randomUUID() } : {}) }), keepalive: true });
    const result = await response.json() as { purchase?: PurchaseFact };
    const event = response.ok && result.purchase ? metaPurchase(result.purchase) : null;
    if (event) sendMeta(event, event.eventId!);
  } catch { /* No mutation to financial or publication state. */ }
}
