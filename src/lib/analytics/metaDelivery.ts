import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "../db/supabaseServer";
import { META_CONSENT_COOKIE, META_CONSENT_VERSION, metaConsentValue, metaDefaultOn, metaOrigin } from "./metaConsent";
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
/**
 * 이 브라우저의 광고 설정(덕짱님 결정 A, 2026-11-09): true = 선택 동의(개인 식별 정보 포함), false = 거부, null = 기본 허용(행태정보만).
 * 거부 쿠키는 DB를 보지 않고 바로 거부. 동의 쿠키는 DB 기록이 동의일 때만 true, 기록이 거부면 false(다른 브라우저에서 로그인한 채 거부),
 * 기록이 없으면(180일 정리) 기본 허용. DB를 못 읽으면 보내지 않는다(false).
 */
export async function metaRequestConsent(request: NextRequest): Promise<boolean | null> {
  const choice = metaConsentValue(request.cookies.get(META_CONSENT_COOKIE)?.value);
  if (choice !== true) return choice;
  try {
    const { data, error } = await createSupabaseServerClient().from("meta_tracking_consents").select("agreed,version").eq("browser_key", metaBrowserKey(request)).maybeSingle();
    if (error) return false;
    return !data ? null : data.agreed === true && data.version === META_CONSENT_VERSION ? true : data.agreed === false ? false : null;
  } catch { return false; }
}
/**
 * 회원의 광고 설정(가장 최근 기록). 거부한 회원이 다른 브라우저(설정 쿠키 없음)로 로그인해도 보내지 않으려고 쓴다.
 * 못 읽으면 undefined — 부르는 쪽은 이번에는 보내지 않되 거부 쿠키를 남기지 않는다(DB 장애·migration 전 배포가 1년짜리 거부가 되지 않게).
 */
export async function metaAccountChoice(user: string): Promise<boolean | null | undefined> {
  try {
    const { data, error } = await createSupabaseServerClient().rpc("meta_user_choice", { p_user: user });
    return error ? undefined : data === true ? true : data === false ? false : null;
  } catch { return undefined; }
}
type MetaMatch = { em?: string[]; ph?: string[] };
const hashList = (value: unknown) => Array.isArray(value) && value.length === 1 && typeof value[0] === "string" && /^[a-f0-9]{64}$/.test(value[0]) ? [value[0]] : undefined;
/** 개인 식별 정보: 해시 64자 하나씩만 통과(원문·다른 칸은 버린다). */
export function metaMatchKeys(value: unknown): MetaMatch {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const v = value as Record<string, unknown>, em = hashList(v.em), ph = hashList(v.ph);
  return { ...(em ? { em } : {}), ...(ph ? { ph } : {}) };
}
/** 선택 동의 회원의 이메일·휴대폰 해시(DB가 동의를 다시 확인하고 해시로만 준다). 못 읽으면 붙이지 않는다. */
export async function metaUserMatch(user: string): Promise<MetaMatch> {
  try {
    const { data, error } = await createSupabaseServerClient().rpc("meta_user_match", { p_user: user });
    return error ? {} : metaMatchKeys(data);
  } catch { return {}; }
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
  user_data: { client_ip_address: string; client_user_agent: string } & MetaMatch; custom_data?: Record<string, unknown> };
/**
 * 이벤트 관리자 「테스트 이벤트」 확인용(운영 Q 추가). META_TEST_EVENT_CODE(예: TEST12345, 덕짱님이 넣고 확인 뒤 지움)가 있으면
 * 서버 전송에 test_event_code를 붙인다 — 붙은 이벤트도 Meta는 일반 이벤트처럼 처리하므로 확인이 끝나면 지운다.
 */
export function metaTestEventCode(env: Readonly<Record<string, string | undefined>> = process.env): { test_event_code?: string } {
  const code = env.META_TEST_EVENT_CODE?.trim();
  return code && /^TEST[A-Z0-9]{2,20}$/.test(code) ? { test_event_code: code } : {};
}
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
        // em·ph는 선택 동의 회원의 해시만(metaUserMatch·대기표 meta_user_match). 그 밖의 칸은 넣지 않는다.
        // 해시는 시행일(META_DEFAULT_FROM)부터만 — DB meta_user_match도 시행 전 빈 값이지만, 법률 검토로 코드 스위치만 바꿔도(null·연기) 여기서 같이 멈춘다.
        user_data: { client_ip_address: event.user_data.client_ip_address, client_user_agent: event.user_data.client_user_agent, ...(metaDefaultOn() ? metaMatchKeys(event.user_data) : {}) },
        ...(customData ? { custom_data: customData } : {}),
      }], ...metaTestEventCode() }),
    });
    const result = await response.json();
    return response.ok && result.events_received === 1;
  } catch { return false; } // No token, provider response, URL or user data in logs.
}
// 설정 쿠키가 없는 기본 허용 브라우저는 p_browser 없이 로그인한 회원으로만 받는다(기본 줄).
export async function claimMetaBrowserEvents(request: NextRequest, user: string | null) {
  const result = await createSupabaseServerClient().rpc("claim_meta_browser_events", { p_browser: metaBrowserKey(request), p_user: user });
  return !result.error && Array.isArray(result.data) ? result.data : [];
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
