import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { META_CONSENT_COOKIE, META_CONSENT_VERSION, metaConsentValue, metaOrigin } from "./metaConsent";
import { metaProduct, metaPurchase, type MetaEvent } from "./events";

export function metaDeliveryReady() {
  return process.env.VERCEL_ENV === "production" && process.env.META_MEASUREMENT_APPROVED === META_CONSENT_VERSION &&
    process.env.NEXT_PUBLIC_META_PIXEL_ID === "1912751453433745" && !!process.env.META_CONVERSIONS_ACCESS_TOKEN &&
    /^v[0-9]{2,3}\.0$/.test(process.env.META_GRAPH_API_VERSION ?? "");
}
export function metaRequestData(request: NextRequest) {
  // Vercel overwrites this header. Do not trust caller-supplied forwarded-for.
  const ip = process.env.VERCEL === "1" ? request.headers.get("x-vercel-forwarded-for")?.trim() : undefined;
  const agent = request.headers.get("user-agent")?.replace(/[\x00-\x1f\x7f]/g, "").slice(0, 512);
  return ip && isIP(ip) && agent ? { client_ip_address: ip, client_user_agent: agent } : null;
}
export function metaBrowserKey(request: NextRequest) {
  const value = request.cookies.get(META_CONSENT_COOKIE)?.value;
  return metaConsentValue(value) === null ? null : createHash("sha256").update(value!.split(":")[2]).digest("hex");
}
export async function recordMetaConsent(request: NextRequest, user: string | null) {
  const agreed = metaConsentValue(request.cookies.get(META_CONSENT_COOKIE)?.value);
  if (agreed === null) return true;
  const data = agreed ? metaRequestData(request) : null;
  try {
    const result = await createSupabaseServerClient().rpc("record_meta_consent", { p_user: user, p_agreed: agreed,
      p_browser: metaBrowserKey(request), p_version: META_CONSENT_VERSION, p_ip: data?.client_ip_address ?? null, p_agent: data?.client_user_agent ?? null });
    return !result.error && result.data === true;
  } catch { return false; }
}
export function browserMetaEvent(value: unknown): MetaEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const b = value as Record<string, unknown>;
  if (Object.keys(b).some(k => !["event", "productType", "requestId"].includes(k))) return null;
  if (b.event === "PageView" && b.productType === undefined) return { event: "PageView", params: {} };
  if ((b.event === "ViewContent" || b.event === "InitiateCheckout") && typeof b.productType === "string") return metaProduct(b.event, b.productType);
  // Browser input can NEVER assert a registration, grant or paid purchase.
  return null;
}
export type MetaDelivery = { event_name: MetaEvent["event"]; event_id: string; event_time: number;
  user_data: { client_ip_address: string; client_user_agent: string }; custom_data?: Record<string, unknown> };
export async function transmitMeta(event: MetaDelivery, transport: typeof fetch = fetch): Promise<boolean> {
  if (!metaDeliveryReady() || !Number.isSafeInteger(event.event_time) || event.event_time <= 0 || !isIP(event.user_data.client_ip_address)) return false;
  let customData: Record<string, unknown> | undefined;
  if (event.event_name === "Purchase" || event.event_name === "ViewContent" || event.event_name === "InitiateCheckout") {
    const data = event.custom_data, ids = data?.content_ids;
    const productType = Array.isArray(ids) && typeof ids[0] === "string" ? ids[0] : "";
    const mapped = event.event_name === "Purchase" ? metaPurchase({ eventId: event.event_id, productType, value: data?.value as number, currency: data?.currency as "KRW" }) : metaProduct(event.event_name, productType);
    if (!mapped) return false;
    customData = mapped.params;
  } else if (event.event_name === "CompleteRegistration") {
    if (!/^registration_[a-f0-9]{32}$/.test(event.event_id)) return false;
  } else if (event.event_name !== "PageView") return false;
  try {
    const response = await transport(`https://graph.facebook.com/${process.env.META_GRAPH_API_VERSION}/1912751453433745/events`, {
      method: "POST", redirect: "error", signal: AbortSignal.timeout(8000), headers: { "content-type": "application/json" },
      body: JSON.stringify({ access_token: process.env.META_CONVERSIONS_ACCESS_TOKEN, data: [{
        event_name: event.event_name, event_id: event.event_id, event_time: event.event_time, action_source: "website",
        event_source_url: "https://www.gyeolreport.com/", // Constant, never request URL/referrer.
        user_data: { client_ip_address: event.user_data.client_ip_address, client_user_agent: event.user_data.client_user_agent },
        ...(customData ? { custom_data: customData } : {}),
      }] }),
    });
    const result = await response.json();
    return response.ok && result.events_received === 1;
  } catch { return false; } // No token, provider response, URL or user data in logs.
}
export async function runMetaDeliveries() {
  const db = createSupabaseServerClient();
  await db.rpc("meta_delivery_batch", { p_action: "cleanup" });
  if (!metaDeliveryReady()) return { ready: false, sent: 0, failed: 0 };
  const batch = await db.rpc("meta_delivery_batch", { p_action: "claim" });
  if (batch.error || !Array.isArray(batch.data)) return { ready: true, sent: 0, failed: 1 };
  let sent = 0, failed = 0;
  for (const item of batch.data as Array<MetaDelivery & { lease: string }>) {
    // Recheck withdrawal immediately before external transmission.
    const allowed = await db.rpc("meta_delivery_batch", { p_action: "allowed", p_event: item.event_id, p_lease: item.lease });
    if (allowed.error || allowed.data !== true) continue;
    const ok = await transmitMeta(item);
    const saved = await db.rpc("meta_delivery_batch", { p_action: ok ? "sent" : "retry", p_event: item.event_id, p_lease: item.lease });
    if (ok && !saved.error) sent++; else failed++;
  }
  return { ready: true, sent, failed };
}
export const metaPublicRequest = (request: NextRequest) => process.env.NODE_ENV === "production" &&
  metaOrigin(new URL(request.url).origin) && request.headers.get("origin") === new URL(request.url).origin;
