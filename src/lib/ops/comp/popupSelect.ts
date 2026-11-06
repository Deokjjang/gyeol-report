/**
 * 메인·상품 화면 팝업 고르기(최종 A 14) — 화면(클라이언트)과 시험이 같이 쓰는 순수 함수. 서버 전용 모듈을 가져오지 않는다.
 * 상황마다 하나만:
 *   ③ comp-a: 안 쓴 보상 이용권이 있는 A 계정(서버 지급 기록 기준)
 *   ② comp-b: 안 쓴 보상 이용권이 있는 B 계정
 *   ① event-1plus1: 그 밖의 방문자(로그인 안 함·신규 가입·이용권을 다 쓴 회원) — 1+1 기간에만
 * 보상 이용권을 다 쓰거나 만료되면 ②·③은 없다. 리포트 읽는 화면(/reports/*, /r/*)·그 밖의 화면에는 띄우지 않는다.
 */
export type PopupId = "event-1plus1" | "comp-b" | "comp-a";
export type PopupEventPhase = "off" | "before" | "during" | "after";
export type PopupEvent = { phase: PopupEventPhase; serverNow: string; startsAt: string; endsAt: string; maxPerAccount: number; validDays: number };
export type PopupComp = { tier: "A" | "B"; quantity: number; unused: number; expiresAt: string };
export type PopupState = { member: boolean; comp: PopupComp | null; event: PopupEvent | null };

/** 「오늘 하루 보지 않기」·닫기 기억은 팝업 id(이번 행사판)마다 따로. */
export const POPUP_STORAGE_KEY: Readonly<Record<PopupId, string>> = {
  "event-1plus1": "gyeol-popup:event-1plus1-202611",
  "comp-b": "gyeol-popup:comp-b-202611",
  "comp-a": "gyeol-popup:comp-a-202611",
};

/** 메인(/, /products — 같은 책장 화면)과 상품 화면(/report/new)만. */
export function popupAllowedPath(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, "") || "/";
  return p === "/" || p === "/products" || p === "/report/new";
}

export function selectPopup(state: PopupState, pathname: string, now = Date.now()): PopupId | null {
  if (!popupAllowedPath(pathname)) return null;
  const c = state.comp;
  if (state.member && c && (c.tier === "A" || c.tier === "B") && c.unused > 0 && Date.parse(c.expiresAt) > now) return c.tier === "A" ? "comp-a" : "comp-b";
  return state.event?.phase === "during" ? "event-1plus1" : null;
}

/** KST 날짜(YYYY-MM-DD) — 「오늘 하루」 기준. */
export function kstDay(ms: number): string { return new Date(ms + 9 * 3_600_000).toISOString().slice(0, 10); }
type Store = Pick<Storage, "getItem" | "setItem"> | null | undefined;
const safeGet = (store: Store, key: string) => { try { return store?.getItem(key) ?? null; } catch { return null; } };
const safeSet = (store: Store, key: string, value: string) => { try { store?.setItem(key, value); } catch { /* 저장 못 해도 화면은 그대로 */ } };
/** 오늘(KST) 보지 않기로 했거나, 이 탭에서 이미 닫았으면 숨긴다. */
export function popupHidden(id: PopupId, now: number, local: Store, session: Store): boolean {
  return safeGet(local, `${POPUP_STORAGE_KEY[id]}:hide-day`) === kstDay(now) || safeGet(session, `${POPUP_STORAGE_KEY[id]}:closed`) === "1";
}
export function rememberPopup(id: PopupId, how: "close" | "today", now: number, local: Store, session: Store): void {
  safeSet(session, `${POPUP_STORAGE_KEY[id]}:closed`, "1");
  if (how === "today") safeSet(local, `${POPUP_STORAGE_KEY[id]}:hide-day`, kstDay(now));
}

const kstMonthDay = (ms: number) => { const d = new Date(ms + 9 * 3_600_000); return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`; };
/** 「11월 7일 – 11월 16일」: 끝은 [시작, 끝) 경계라 1ms 앞의 날짜. */
export function eventRangeLabel(e: Pick<PopupEvent, "startsAt" | "endsAt">): string {
  const a = Date.parse(e.startsAt), b = Date.parse(e.endsAt);
  return Number.isFinite(a) && Number.isFinite(b) ? `${kstMonthDay(a)} – ${kstMonthDay(b - 1)}` : "";
}
/** 「11월 7일 00시 시작」 */
export function eventStartLabel(startsAt: string): string {
  const a = Date.parse(startsAt); if (!Number.isFinite(a)) return "";
  const h = new Date(a + 9 * 3_600_000).getUTCHours();
  return `${kstMonthDay(a)} ${String(h).padStart(2, "0")}시 시작`;
}
/** {만료일}: 「12월 6일」 */
export function expiryLabel(expiresAt: string): string { const a = Date.parse(expiresAt); return Number.isFinite(a) ? kstMonthDay(a) : ""; }
/** 「N일 HH:MM:SS」 */
export function remainingLabel(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000)), p = (n: number) => String(n).padStart(2, "0");
  return `${Math.floor(s / 86400)}일 ${p(Math.floor(s % 86400 / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`;
}
const NATIVE = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"];
/** 「두 번」(1~9는 고유어 수). */
export const timesLabel = (n: number) => (Number.isInteger(n) && n >= 1 && n <= 9 ? `${NATIVE[n]} 번` : `${n}번`);

export function isPopupState(v: unknown): v is PopupState {
  if (!v || typeof v !== "object") return false;
  const x = v as PopupState;
  return typeof x.member === "boolean" && (x.comp === null || (typeof x.comp === "object" && (x.comp.tier === "A" || x.comp.tier === "B") && Number.isInteger(x.comp.unused) && typeof x.comp.expiresAt === "string"))
    && (x.event === null || (typeof x.event === "object" && ["off", "before", "during", "after"].includes(x.event.phase) && typeof x.event.endsAt === "string"));
}
