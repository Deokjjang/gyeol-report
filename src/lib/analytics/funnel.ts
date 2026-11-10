/**
 * F 퍼널 익명 집계(브라우저). 단계마다 브라우저 세션 저장소로 1번만 /api/funnel에 보낸다.
 * 유입은 처음 들어온 주소의 utm_source·utm_campaign(campaignUtm과 같은 규칙)만 세션 저장소에 둔다 — 개인 식별 값 없음.
 * 「시험」 브라우저(시험 계정으로 로그인한 적이 있는 브라우저)는 아무것도 보내지 않는다.
 * 운영 빌드에서만 보낸다(로컬 확인은 localStorage 'gyeol-funnel-dev'='1').
 */
import { campaignUtm } from "../growth/model";
import { FUNNEL_LOGIN_COOKIE, TEST_BROWSER_KEY, funnelTag, type FunnelStep } from "./funnelModel";

const UTM_KEY = "gyeol-utm-v1", DONE_KEY = "gyeol-funnel-v1:";
type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const session = (): Store | null => { try { return window.sessionStorage; } catch { return null; } };
const local = (): Store | null => { try { return window.localStorage; } catch { return null; } };
const get = (s: Store | null, k: string) => { try { return s?.getItem(k) ?? null; } catch { return null; } };
const set = (s: Store | null, k: string, v: string) => { try { s?.setItem(k, v); } catch { /* 저장 못 하면 1번 처리도 못 하지만 화면은 그대로 */ } };

/** 「시험」 표시(세션 응답 tester:true 또는 서버 표시). */
export function markTesterBrowser() { set(local(), TEST_BROWSER_KEY, "1"); }
export function testerBrowser(): boolean { return get(local(), TEST_BROWSER_KEY) === "1"; }
function sendAllowed(): boolean {
  if (typeof window === "undefined") return false;
  return process.env.NODE_ENV === "production" || get(local(), "gyeol-funnel-dev") === "1";
}
/** 주소에 utm_source가 있으면 이번 세션의 유입으로 기억한다(마지막 광고 클릭 기준). */
export function captureUtm(search: string = typeof window === "undefined" ? "" : window.location.search) {
  const q = Object.fromEntries(new URLSearchParams(search));
  const utm = campaignUtm(q);
  if (!utm.utm_source) return;
  set(session(), UTM_KEY, JSON.stringify({ source: funnelTag(utm.utm_source, 40), campaign: funnelTag(utm.utm_campaign, 64) }));
}
export function currentUtm(): { source: string; campaign: string } {
  try { const v = JSON.parse(get(session(), UTM_KEY) ?? "null") as { source?: unknown; campaign?: unknown } | null; if (v) return { source: funnelTag(v.source), campaign: funnelTag(v.campaign, 64) }; } catch { /* 없음 */ }
  return { source: "direct", campaign: "-" };
}
/** 단계 1번(이 브라우저 세션에서). 실패해도 화면에 영향 없음. 반환: 보냈는가(시험). */
export function funnel(step: FunnelStep): boolean {
  if (typeof window === "undefined" || testerBrowser()) return false;
  const s = session();
  if (get(s, DONE_KEY + step) === "1") return false;
  set(s, DONE_KEY + step, "1");
  if (!sendAllowed()) return false;
  try {
    void fetch("/api/funnel", { method: "POST", keepalive: true, credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ step, ...currentUtm() }) }).catch(() => undefined);
  } catch { /* 무시 */ }
  return true;
}
/** 로그인 콜백이 남긴 기존 회원 로그인 신호를 1번 세고 지운다. */
export function consumeLoginSignal() {
  if (typeof document === "undefined") return;
  if (!document.cookie.split(";").some(c => c.trim() === `${FUNNEL_LOGIN_COOKIE}=member`)) return;
  document.cookie = `${FUNNEL_LOGIN_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  funnel("login_member");
}
/** 주소별 조회 단계. */
export function viewStep(pathname: string): FunnelStep | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/free") return "free_view";
  if (p === "/" || p === "/products") return "home_view";
  if (p === "/report/new" || p.startsWith("/products/")) return "product_view";
  return null;
}
