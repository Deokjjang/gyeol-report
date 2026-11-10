/**
 * F 퍼널 익명 집계(화면·서버 공용, 서버 전용 모듈을 가져오지 않는다).
 * 저장은 「날짜(KST) × 단계 × 유입(utm_source, utm_campaign, utm_content) × 횟수」뿐이다(SQL ops_funnel). 사용자 id·IP·쿠키 식별자는 저장하지 않는다.
 * 같은 브라우저의 같은 단계는 브라우저 세션 저장소로 1번만 보낸다(funnel.ts). 가입·가입 이용권·무료 책은 서버가 센다(funnelServer.ts).
 * 유입은 처음 들어온 광고 주소의 값을 「유입 표시」 쿠키(30일, 값은 광고 주소의 utm 값뿐 — 식별자 아님)에 두고 로그인 왕복·다음 방문에도 같은 값으로 센다.
 */
export const FUNNEL_STEPS = [
  "land", "free_view", "home_view", "product_view", "input_start", "input_done",
  "pay_click", "pay_open", "ticket_click", "login_new", "login_member", "signup_grant", "free_book", "book_start", "book_published", "paid",
] as const;
export type FunnelStep = typeof FUNNEL_STEPS[number];
/** 회원 단계: 서버가 로그인 계정을 보고 시험 계정(ops_test_user와 같은 목록)이면 세지 않는다. */
export const MEMBER_FUNNEL_STEPS: readonly FunnelStep[] = ["pay_click", "pay_open", "ticket_click", "login_new", "login_member", "signup_grant", "free_book", "book_start", "book_published", "paid"];
/** 서버만 세는 단계(가입 정보 첫 저장·가입 이용권 지급·가입 이용권으로 책 시작). 브라우저가 보내면 무시한다(두 번 세지 않게). */
export const SERVER_FUNNEL_STEPS: readonly FunnelStep[] = ["login_new", "signup_grant", "free_book"];
export const FUNNEL_LABEL: Readonly<Record<FunnelStep, string>> = {
  land: "랜딩(이번 방문 첫 화면)", free_view: "/free 조회", home_view: "메인 조회", product_view: "상품 화면", input_start: "입력 시작", input_done: "입력 완료",
  pay_click: "결제하기", pay_open: "결제창 열림", ticket_click: "이용권 사용", login_new: "신규 가입", login_member: "기존 회원 로그인",
  signup_grant: "가입 이용권 지급", free_book: "무료 책(가입 이용권으로 책 시작)", book_start: "책 생성 시작", book_published: "책 발행", paid: "결제 완료",
};
export const isFunnelStep = (v: unknown): v is FunnelStep => typeof v === "string" && (FUNNEL_STEPS as readonly string[]).includes(v);
/** 유입 값: 소문자·숫자·_·-만, 없거나 틀리면 '-'(SQL과 같은 규칙). */
export function funnelTag(v: unknown, max = 40): string {
  const s = typeof v === "string" ? v.trim().toLowerCase() : "";
  return new RegExp(`^[a-z0-9_-]{1,${max}}$`).test(s) ? s : "-";
}
/** 「시험」 브라우저 표시(서버가 시험 계정 세션을 보면 남긴다, 값 "1"만 — 식별자 아님). 퍼널·메타 전송이 이 브라우저를 뺀다. */
export const TEST_BROWSER_COOKIE = "gyeol-test-browser";
export const TEST_BROWSER_KEY = "gyeol-test-browser-v1";
/** 로그인 완료 신호(로그인 콜백이 기존 회원이면 "member", 2분). 화면이 읽어 login_member를 1번 보내고 지운다. */
export const FUNNEL_LOGIN_COOKIE = "gyeol-fn-login";
/** 「유입 표시」 쿠키: 처음 들어온 광고 주소의 utm_source·utm_campaign·utm_content(정리한 값)를 「source.campaign.content」로 30일. 식별자 아님. */
export const FUNNEL_SOURCE_COOKIE = "gyeol-fn-src";
export const FUNNEL_SOURCE_DAYS = 30;
export type FunnelSource = { source: string; campaign: string; content: string };
export const DIRECT_SOURCE: FunnelSource = { source: "direct", campaign: "-", content: "-" };
export function formatFunnelSource(s: FunnelSource): string { return [funnelTag(s.source), funnelTag(s.campaign, 64), funnelTag(s.content, 64)].join("."); }
/** 쿠키 값 → 유입(틀리면 null). 화면·서버가 같은 규칙으로 읽는다. */
export function parseFunnelSource(v: string | null | undefined): FunnelSource | null {
  if (typeof v !== "string") return null;
  let raw = v; try { raw = decodeURIComponent(v); } catch { return null; }
  const m = /^([a-z0-9_-]{1,40})\.([a-z0-9_-]{1,64})\.([a-z0-9_-]{1,64})$/.exec(raw);
  return m && m[1] !== "-" ? { source: m[1], campaign: m[2], content: m[3] } : null;
}
