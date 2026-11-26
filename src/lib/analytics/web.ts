/**
 * OPS-1 Vercel Web Analytics(쿠키 없는 익명 방문 통계). 화면 주소에서 쿼리·id·토큰을 지우고, 맞춤 이벤트는 정해진 속성(상품 키·채널)만 보낸다.
 * 이름·생일·이메일·id 같은 개인정보는 보내지 않는다. 시험 브라우저(funnel의 testerBrowser)는 이벤트를 보내지 않는다.
 */
import { track } from "@vercel/analytics";
import { testerBrowser } from "./funnel";

export const WEB_EVENTS = ["cover_open", "input_done", "checkout_open", "paid", "book_open", "share_click", "share_landing"] as const;
export type WebEventName = typeof WEB_EVENTS[number];
export const SHARE_CHANNELS = ["kakao", "native", "copy", "card"] as const;
export type ShareChannel = typeof SHARE_CHANNELS[number];
const PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;

/** 상품 키만 통과(모르는 값은 "other"). */
export const productProp = (v: unknown): string => (PRODUCTS as readonly string[]).includes(String(v)) ? String(v) : "other";

/** 이벤트 속성: 이름마다 정해진 칸만. */
export function webEventProps(name: WebEventName, a: { product?: unknown; channel?: unknown }): Record<string, string> {
  const props: Record<string, string> = { product: productProp(a.product) };
  if (name === "share_click") props.channel = (SHARE_CHANNELS as readonly string[]).includes(String(a.channel)) ? String(a.channel) : "other";
  return props;
}

export function webEvent(name: WebEventName, a: { product?: unknown; channel?: unknown } = {}): boolean {
  if (typeof window === "undefined" || testerBrowser()) return false;
  // ZW-2 1부: 직접 주소로만 여는 검수 상품(자미 「나의 열두 서가」)은 분석 이벤트를 보내지 않는다.
  if (a.product === "ziwei_full") return false;
  try { track(name, webEventProps(name, a)); return true; } catch { return false; }
}

/** 이번 탭에서 같은 키로 한 번만. */
export function webEventOnce(name: WebEventName, a: { product?: unknown; channel?: unknown }, key: string): boolean {
  if (typeof window === "undefined") return false;
  const k = `gyeol-va:${name}:${key}`;
  try { if (sessionStorage.getItem(k) === "1") return false; sessionStorage.setItem(k, "1"); } catch { /* 저장소가 막혀도 보낸다 */ }
  return webEvent(name, a);
}

/** 보내지 않는 화면: 관리자 · API · 개발 화면 · 결제 콜백. */
const BLOCKED = [/^\/admin(\/|$)/, /^\/api(\/|$)/, /^\/dev(\/|$)/, /^\/payments(\/|$)/, /^\/account\/tickets\/checkout(\/|$)/];
/** 동적 경로의 id·토큰 자리. */
const DYNAMIC: readonly [RegExp, string][] = [
  [/^\/r\/[^/]+/, "/r/[token]"],
  [/^\/gift\/[^/]+/, "/gift/[token]"],
  [/^\/reports\/[^/]+/, "/reports/[reportId]"],
];
const FROM_VALUES = ["share"];

/** beforeSend: 쿼리는 from(허용 값)만 남기고 해시를 지우며, id·토큰은 자리표시로. 막는 화면은 null. */
export function sanitizeAnalyticsUrl(raw: string): string | null {
  let url: URL;
  try { url = new URL(raw, "https://gyeol.invalid"); } catch { return null; }
  let path = url.pathname.replace(/\/+$/, "") || "/";
  if (BLOCKED.some(r => r.test(path))) return null;
  for (const [r, to] of DYNAMIC) if (r.test(path)) { path = path.replace(r, to); break; }
  const from = url.searchParams.get("from");
  const query = from && FROM_VALUES.includes(from) ? `?from=${from}` : "";
  return `${url.origin === "https://gyeol.invalid" ? "" : url.origin}${path}${query}`;
}

/** 공유로 내보내는 주소에 from=share(다른 쿼리는 그대로). 옛 링크는 쿼리 없이도 그대로 열린다. */
export function withShareFrom(raw: string): string {
  if (!raw) return raw;
  try { const u = new URL(raw); u.searchParams.set("from", "share"); return u.href; } catch { return raw; }
}
