/**
 * F 퍼널 익명 집계(브라우저). 단계마다 브라우저 세션 저장소로 1번만 /api/funnel에 보낸다.
 * 유입(F 후속 「퍼널 유입 연결」): 처음 들어온 광고 주소의 utm_source·utm_campaign·utm_content(campaignUtm과 같은 규칙)를 「유입 표시」 쿠키(30일)에 둔다.
 * 처음 값만 남기고(나중 광고 주소로 덮지 않음) 로그인 왕복(카카오·구글)·새 탭·다음 방문에도 같은 값으로 센다. 쿠키를 못 쓰면 세션 저장소. 개인 식별 값 없음.
 * 「시험」 브라우저(시험 계정으로 로그인한 적이 있는 브라우저)는 아무것도 보내지 않는다.
 * 운영 빌드에서만 보낸다(로컬 확인은 localStorage 'gyeol-funnel-dev'='1').
 */
import { campaignUtm } from "../growth/model";
import { DIRECT_SOURCE, FUNNEL_LOGIN_COOKIE, FUNNEL_SOURCE_COOKIE, FUNNEL_SOURCE_DAYS, SERVER_FUNNEL_STEPS, TEST_BROWSER_KEY, formatFunnelSource, funnelTag, parseFunnelSource, type FunnelSource, type FunnelStep } from "./funnelModel";

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
const readCookie = (name: string): string | null => {
  try { for (const c of document.cookie.split(";")) { const [k, ...v] = c.trim().split("="); if (k === name) return v.join("="); } } catch { /* 쿠키 못 읽음 */ }
  return null;
};
function sessionSource(): FunnelSource | null {
  try {
    const v = JSON.parse(get(session(), UTM_KEY) ?? "null") as Partial<FunnelSource> | null;
    return v && funnelTag(v.source) !== "-" ? { source: funnelTag(v.source), campaign: funnelTag(v.campaign, 64), content: funnelTag(v.content, 64) } : null;
  } catch { return null; }
}
/** 주소에 utm_source가 있고 아직 기억한 유입이 없으면 처음 유입으로 기억한다(쿠키 30일 + 세션 저장소). 이미 있으면 그대로 둔다. */
export function captureUtm(search: string = typeof window === "undefined" ? "" : window.location.search) {
  if (typeof document === "undefined") return;
  const utm = campaignUtm(Object.fromEntries(new URLSearchParams(search)));
  if (!utm.utm_source || funnelTag(utm.utm_source) === "-") return;
  if (parseFunnelSource(readCookie(FUNNEL_SOURCE_COOKIE)) || sessionSource()) return;
  const src: FunnelSource = { source: funnelTag(utm.utm_source), campaign: funnelTag(utm.utm_campaign, 64), content: funnelTag(utm.utm_content, 64) };
  try { document.cookie = `${FUNNEL_SOURCE_COOKIE}=${formatFunnelSource(src)}; Max-Age=${FUNNEL_SOURCE_DAYS * 86_400}; Path=/; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`; } catch { /* 쿠키 못 씀 → 세션 저장소만 */ }
  set(session(), UTM_KEY, JSON.stringify(src));
}
/** 지금 기억한 처음 유입(쿠키 → 세션 저장소 → 직접). */
export function currentUtm(): FunnelSource {
  return parseFunnelSource(readCookie(FUNNEL_SOURCE_COOKIE)) ?? sessionSource() ?? DIRECT_SOURCE;
}
/** 로그인 화면 주소에 처음 유입을 실어 보낸다(인앱 → 외부 브라우저로 열려도 이어지게). 직접 유입이면 빈 문자열. */
export function utmQuery(src: FunnelSource = currentUtm()): string {
  if (src.source === "direct" || src.source === "-") return "";
  const q = new URLSearchParams({ utm_source: src.source });
  if (src.campaign !== "-") q.set("utm_campaign", src.campaign);
  if (src.content !== "-") q.set("utm_content", src.content);
  return q.toString();
}
/** 단계 1번(이 브라우저 세션에서). 실패해도 화면에 영향 없음. 반환: 보냈는가(시험). */
export function funnel(step: FunnelStep): boolean {
  if (typeof window === "undefined" || testerBrowser() || SERVER_FUNNEL_STEPS.includes(step)) return false;
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
/** 주소별 조회 단계(land는 FunnelTracker가 이번 방문 첫 화면에 1번). */
export function viewStep(pathname: string): FunnelStep | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/free") return "free_view";
  if (p === "/" || p === "/products") return "home_view";
  if (p === "/report/new" || p.startsWith("/products/")) return "product_view";
  return null;
}
