/**
 * 운영 설정값(P6d-ops). 서버에서만 읽고, 화면에는 값만 props로 넘긴다.
 * - FORTUNE_SALES_OPEN=1: 대운·세운 판매 끄기 스위치(켜 두면 FORTUNE_SALES_OPEN_AT 뒤에 열린다. 기본: 닫힘, 이미 산 Book은 어느 쪽이든 열린다).
 * - ADMIN_USER_IDS: 관리자 화면(/admin/orders)을 열 수 있는 계정 id(쉼표 구분). 비어 있으면 아무도 못 연다.
 * - GIFT_EVENT_*: 결제 1건마다 이용권 1장 이벤트(기본: 꺼짐). P 추가 C: 계정당 횟수 상한·친구 첫 결제 보너스 없음.
 * - COMP_*: 보상 이용권 두 등급(P6e-ops, 기본: 꺼짐). A = 결제 후 환불한 고객(관리자가 지정), B = 기존 무료 이벤트 가입자 명단.
 *   v5 최종 2-3: A 2장·B 1장, 장마다 고객이 '내가 쓰기 / 선물 링크 만들기'를 고른다(이벤트 이용권과 같은 종류·화면·규칙).
 */
type Env = Readonly<Record<string, string | undefined>>;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const CLOSED_FORTUNE_PRODUCTS = ["major_fortune", "annual_fortune"] as const;
export const FORTUNE_REOPEN_LINE = "12월 1일 · 2027 신년판 공개";
export const ALL_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;

/**
 * AM 판매 시작(덕짱님 결정 2026-11-11): 대운·세운은 이 시각이 지나면 저절로 열린다(재배포 없이).
 * FORTUNE_SALES_OPEN은 끄기 스위치다 — "1"이 아니면 시각이 지나도 닫힘. 가격 설정값이 비어도 닫힘(fortunePriceSet).
 * 정적 화면(/, /products, /report/new)은 revalidate 60초로 다시 그려 1분 안에 따라온다.
 */
export const FORTUNE_SALES_OPEN_AT = "2026-12-01T09:00:00+09:00";
/** 시험·로컬 개발 전용으로 시작 시각을 바꿔 본다(FORTUNE_SALES_OPEN_AT_TEST). 운영 빌드(NODE_ENV=production)에서는 읽지 않는다. */
export function fortuneSalesOpenAtMs(env: Env = process.env): number {
  const override = process.env.NODE_ENV !== "production" ? Date.parse(env.FORTUNE_SALES_OPEN_AT_TEST ?? "") : NaN;
  return Number.isFinite(override) ? override : Date.parse(FORTUNE_SALES_OPEN_AT);
}
export function fortuneSalesOpen(env: Env = process.env, now: number = Date.now()) { return env.FORTUNE_SALES_OPEN === "1" && now >= fortuneSalesOpenAtMs(env); }
/** AM 2부: 세운 신년판 연도(설정값, 기본 2027 정미년). 연 1회 재구매 상품이라 해마다 이 값만 바꾼다. */
export function annualProductYear(env: Env = process.env): number { const y = Number(env.ANNUAL_PRODUCT_YEAR ?? env.NEXT_PUBLIC_ANNUAL_PRODUCT_YEAR); return Number.isInteger(y) && y >= 2026 && y <= 2100 ? y : 2027; }
/** AM 6부: 대운·세운 가격 설정값이 비어 있으면 판매를 열어도 팔지 않는다(가격은 덕짱님 결정). */
export function fortunePriceSet(product: string, env: Env = process.env): boolean {
  const v = Number(product === "major_fortune" ? env.FORTUNE_PRICE_MAJOR_KRW ?? env.NEXT_PUBLIC_FORTUNE_PRICE_MAJOR_KRW : product === "annual_fortune" ? env.FORTUNE_PRICE_ANNUAL_KRW ?? env.NEXT_PUBLIC_FORTUNE_PRICE_ANNUAL_KRW : undefined);
  return Number.isSafeInteger(v) && v >= 100;
}
export function closedSaleProducts(env: Env = process.env, now: number = Date.now()): string[] { return fortuneSalesOpen(env, now) ? CLOSED_FORTUNE_PRODUCTS.filter(p => !fortunePriceSet(p, env)) : [...CLOSED_FORTUNE_PRODUCTS]; }
/** 결제·이용권 사용 진입점 전용(읽기·분석 경로는 isPurchasable 그대로). */
export function productOnSale(product: unknown, env: Env = process.env, now: number = Date.now()): boolean { return typeof product === "string" && !closedSaleProducts(env, now).includes(product); }
export const SALES_CLOSED_CODE = "PRODUCT_SALES_CLOSED";
/**
 * AM 3부(약관 termsPolicy 「이용권으로 만들 수 있는 리포트는 … 4종」 유지): 이용권(보상·증정·가입·추천·묶음·관리자 지급 모두)은 출시 4종에만 쓴다.
 * 이용권마다 상품 범위가 비어 있어도(증정·관리자 지급) 대운·세운은 결제로만 — 판매를 열어도 이 관문이 막는다.
 */
export const TICKET_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;
export const TICKET_PRODUCT_CODE = "TICKET_PRODUCT_EXCLUDED";
export const TICKET_PRODUCT_MESSAGE = "대운·세운은 이용권으로 만들 수 없어요. 결제로 만들 수 있어요.";
export function ticketProductAllowed(product: unknown): boolean { return typeof product === "string" && (TICKET_PRODUCTS as readonly string[]).includes(product); }
export const SALES_CLOSED_MESSAGE = "대운·세운은 2027 신년판으로 새로 단장하고 있어요. 12월 1일에 다시 만나요.";

export function adminUserIds(env: Env = process.env): string[] { return (env.ADMIN_USER_IDS ?? "").split(",").map(s => s.trim()).filter(s => UUID.test(s)); }
export function isAdminUser(id: unknown, env: Env = process.env): boolean { return typeof id === "string" && adminUserIds(env).includes(id); }

export type GiftEventConfig = { readonly active: boolean; readonly start: string; readonly end: string; readonly products: readonly string[]; readonly ticketExpiresAt: string };
/**
 * 이용권 유효기간.
 * - 결제 증정 이용권(gift_rewards.kind='event', 결제 1건마다 1장): 받은 날부터 30일(EVENT_TICKET_DAYS).
 *   2026-11-10 정정(덕짱님 결정): 「11-30 23:59:59 KST 고정」에서 바꿈 — 마지막 날 결제해도 30일을 쓴다. 이미 나간 이용권도 발급일 + 30일로 늘렸다(줄이지 않음, migration 20261111110000).
 * - 보상 이용권(kind='comp', 업그레이드 감사 A·B): P 추가 D(2026-11-06) 그대로 2026-11-30 23:59:59 KST(COMP_TICKET_EXPIRES_AT, 받은 날과 상관없이 같은 날).
 *   운영의 기존 행은 업그레이드 보상 캠페인 42장만 같은 시각으로 당겼다(migration 20261107090000, 누나 계정 5장은 그대로). 그 시각이 지난 뒤 새로 나가는 보상만 발급일로부터 30일.
 * - 가입 이용권(kind='signup'): 받은 날부터 7일(SIGNUP_TICKET_DAYS, 아래).
 * - 선물은 처음 기한을 그대로 넘긴다. 관리자 수동 지급(오류 난 책 보상 등)은 이 값을 쓰지 않는다 — SQL 기본값 발급일 + 30일.
 * SQL(ops_gift issue)은 받은 값과 지금 + 30일 중 이른 쪽을 쓴다(상한).
 */
export const TICKET_VALID_DAYS = 30;
export const EVENT_TICKET_DAYS = TICKET_VALID_DAYS;
export const COMP_TICKET_EXPIRES_AT = "2026-11-30T23:59:59+09:00";
/** 팝업 ①·메인 배너 한 줄: 「이용권은 받은 날부터 30일 동안 쓸 수 있어요」. */
export const eventTicketValidityLine = (days: number) => `이용권은 받은 날부터 ${days}일 동안 쓸 수 있어요`;
/** 결제 증정 이용권의 기한(ISO, UTC) = 지금 + 30일. */
export function eventTicketExpiresAt(now = Date.now()): string { return new Date(now + EVENT_TICKET_DAYS * 86_400_000).toISOString(); }
/** 보상 이용권의 기한(ISO, UTC). 11-30 23:59:59 KST 전이면 그 시각, 지난 뒤면 지금 + 30일. */
export function compTicketExpiresAt(now = Date.now()): string {
  const fixed = Date.parse(COMP_TICKET_EXPIRES_AT);
  return new Date(now < fixed ? fixed : now + TICKET_VALID_DAYS * 86_400_000).toISOString();
}
/** 「11월 30일」(KST). 못 읽으면 빈 문자열. */
export function kstMonthDayLabel(iso: string | null | undefined): string {
  const ms = Date.parse(iso ?? "");
  if (!Number.isFinite(ms)) return "";
  const d = new Date(ms + 9 * 3_600_000);
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}
/** 1+1 이벤트 기본 기간(최종 A 11, 배포 명령 0-8에서 시작을 당김): 2026-11-06 09:00:00 ~ 2026-11-30 23:59:59 KST. GIFT_EVENT_START·END env로 바꾼다.
 * F(2026-11-10 덕짱님 결정): 끝을 11-16 → 11-30 23:59:59로 연장. 이용권 기한은 기간과 따로(받은 날부터 30일, eventTicketExpiresAt).
 * 연장할 때는 이 값(또는 env GIFT_EVENT_END) 하나만 바꾼다 — 1+1 발급·팝업·배너·영수증·가입 이용권 캠페인 끝(signupCampaignConfig)·/free·약관 문구가 모두 이 값을 읽는다.
 * SQL(ops_gift issue·pending_orders, ops_signup grant)은 기간을 갖고 있지 않고 이 값(giftEventConfig·signupCampaignConfig의 start·end)을 받아 쓴다 — tests/unit/final4/eventConfig.test.ts가 고정. */
export const GIFT_EVENT_DEFAULT_START = "2026-11-06T09:00:00+09:00";
export const GIFT_EVENT_DEFAULT_END = "2026-11-30T23:59:59+09:00";
const KST_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?\s*(Z|[+-]\d{2}:?\d{2})?$/;
/**
 * env 시각을 읽는다(최종 A 11). 오프셋이 없으면 KST(+09:00)로 읽는다 — Vercel 서버는 UTC라 Date.parse만 쓰면 9시간 어긋난다.
 * edge="end"면 끝을 포함하는 시각으로 읽는다: 초가 59로 끝나면(예 "2026-11-16 23:59:59") 그 초가 끝나는 순간(+1초)이 경계, 날짜만이면 그 날 끝(다음 날 0시).
 * 돌려주는 값은 [시작, 끝) 경계(ms). 못 읽으면 NaN.
 */
export function parseEventInstant(value: string | undefined, edge: "start" | "end" = "start"): number {
  const m = (value ?? "").trim().match(KST_TIME);
  if (!m) return Number.NaN;
  const [, y, mo, d, h, mi, sec, zone] = m;
  const offset = zone === undefined ? "+09:00" : zone === "Z" ? "Z" : zone.includes(":") ? zone : `${zone.slice(0, 3)}:${zone.slice(3)}`;
  const ms = Date.parse(`${y}-${mo}-${d}T${h ?? "00"}:${mi ?? "00"}:${sec ?? "00"}${offset}`);
  if (!Number.isFinite(ms) || edge === "start") return ms;
  if (h === undefined) return ms + 86_400_000;
  return sec === "59" ? ms + 1000 : ms;
}
export type GiftEventPhase = "off" | "before" | "during" | "after";
/** 이벤트 시간 창(서버 시각 기준). 배너·팝업·영수증 한 줄이 함께 쓴다. off = 꺼짐(GIFT_EVENT_ENABLED≠1) 또는 기간 설정 오류. */
export function giftEventWindow(env: Env = process.env, now = Date.now()): { phase: GiftEventPhase; startMs: number; endMs: number } {
  const startMs = parseEventInstant(env.GIFT_EVENT_START || GIFT_EVENT_DEFAULT_START, "start"), endMs = parseEventInstant(env.GIFT_EVENT_END || GIFT_EVENT_DEFAULT_END, "end");
  const valid = Number.isFinite(startMs) && Number.isFinite(endMs) && startMs < endMs;
  const phase: GiftEventPhase = env.GIFT_EVENT_ENABLED !== "1" || !valid ? "off" : now < startMs ? "before" : now < endMs ? "during" : "after";
  return { phase, startMs: valid ? startMs : Number.NaN, endMs: valid ? endMs : Number.NaN };
}
/** 결제 영수증·팝업용: 지금 1+1 기간인가(서버 시각). */
export function giftEventActive(env: Env = process.env, now = Date.now()): boolean { return giftEventWindow(env, now).phase === "during"; }
/**
 * 켜짐(GIFT_EVENT_ENABLED=1)이고 기간 안이어야 active. 기간은 GIFT_EVENT_START·END(오프셋 없으면 KST, 끝은 23:59:59 포함), 없으면 기본 기간.
 * start·end는 [시작, 끝) 경계의 ISO(SQL이 paid_at >= start and paid_at < end로 쓴다). 결제 1건마다 1장(계정당 상한 없음), 기한 = eventTicketExpiresAt(받은 날부터 30일), 대상 상품 기본 = 판매 중인 전부.
 */
export function giftEventConfig(env: Env = process.env, now = Date.now()): GiftEventConfig {
  const w = giftEventWindow(env, now), valid = Number.isFinite(w.startMs);
  const listed = (env.GIFT_EVENT_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(p => (ALL_PRODUCTS as readonly string[]).includes(p));
  const products = (listed.length ? listed : [...ALL_PRODUCTS]).filter(p => productOnSale(p, env));
  return { active: w.phase === "during", start: valid ? new Date(w.startMs).toISOString() : "", end: valid ? new Date(w.endMs).toISOString() : "", products, ticketExpiresAt: eventTicketExpiresAt(now) };
}
/** 화면에 내보내는 공개 이벤트 정보(보상 이야기 없음). 배너·팝업 ①·영수증 한 줄. ticketDays = 결제 증정 이용권을 받은 날부터 쓸 수 있는 날수. */
/** signup(F): 가입 이용권 캠페인 공개 상태 — DB 켜짐/꺼짐을 읽은 경로(/api/gift-event·/auth/event-popup)만 채운다. */
export type GiftEventPublicView = { phase: GiftEventPhase; serverNow: string; startsAt: string; endsAt: string; ticketDays: number; signup?: SignupPublicView };
export function giftEventPublicView(env: Env = process.env, now = Date.now()): GiftEventPublicView {
  const w = giftEventWindow(env, now), cfg = giftEventConfig(env, now);
  return { phase: w.phase, serverNow: new Date(now).toISOString(), startsAt: cfg.start, endsAt: cfg.end, ticketDays: EVENT_TICKET_DAYS };
}

export type CompConfig = {
  readonly enabled: boolean;
  /** A: 총 장수(장마다 결제 화면에서 쓰거나 선물) · 유효일(기한 계산 예비값, TICKET_VALID_DAYS). */
  readonly aQty: number; readonly aDays: number;
  /** B: 장수 · 유효일(예비값). */
  readonly bQty: number; readonly bDays: number;
  /** 지급 기한(P 추가 D): compTicketExpiresAt() — 2026-11-30 23:59:59 KST. SQL이 days보다 이 값을 먼저 쓴다. */
  readonly expiresAt: string;
  /** 보상 이용권으로 만들 수 있는 상품(기본 4종: 종합·커리어·연애·궁합). 이용권 자체에 담겨 사용 때 서버가 다시 확인한다. */
  readonly products: readonly string[];
};
export const COMP_DEFAULT_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;
const compInt = (v: string | undefined, d: number, min: number, max: number) => { const n = Number(v); return v !== undefined && v.trim() !== "" && Number.isInteger(n) && n >= min && n <= max ? n : d; };
/**
 * F: 신규 가입 이용권(가입하면 내 책 한 권 무료). gift_rewards.kind='signup', 계정당 1장, 선물·양도 불가.
 * - 시작 = 이번 배포 시각(SIGNUP_CAMPAIGN_START, env로만 바꿈) · 끝 = 1+1 끝과 같은 값(GIFT_EVENT_END·GIFT_EVENT_DEFAULT_END) — 연장은 1+1 설정 하나로.
 * - 기한 = 받은 시각 + 7일 · 사용 범위 = 출시 4종(대운·세운 제외).
 * - 켜짐/꺼짐은 DB(ops_settings 'signup_grant', 처리 봇 [지급 멈춤]·[다시 켜기])가 정한다. 하루 상한은 없다.
 */
export const SIGNUP_CAMPAIGN_START = "2026-11-10T20:00:00+09:00";
export const SIGNUP_TICKET_DAYS = 7;
export const SIGNUP_PRODUCTS = COMP_DEFAULT_PRODUCTS;
export type SignupCampaignConfig = { readonly valid: boolean; readonly inWindow: boolean; readonly start: string; readonly end: string; readonly startMs: number; readonly endMs: number; readonly days: number; readonly products: readonly string[] };
export function signupCampaignConfig(env: Env = process.env, now = Date.now()): SignupCampaignConfig {
  const startMs = parseEventInstant(env.SIGNUP_CAMPAIGN_START || SIGNUP_CAMPAIGN_START, "start"), endMs = parseEventInstant(env.GIFT_EVENT_END || GIFT_EVENT_DEFAULT_END, "end");
  const valid = Number.isFinite(startMs) && Number.isFinite(endMs) && startMs < endMs;
  return { valid, inWindow: valid && now >= startMs && now < endMs, start: valid ? new Date(startMs).toISOString() : "", end: valid ? new Date(endMs).toISOString() : "",
    startMs: valid ? startMs : Number.NaN, endMs: valid ? endMs : Number.NaN, days: SIGNUP_TICKET_DAYS, products: [...SIGNUP_PRODUCTS] };
}
/** 화면용(메인 띠·/free·팝업): active = 기간 안 + DB 켜짐. endsAt = [시작, 끝) 끝 경계(ISO). */
export type SignupPublicView = { active: boolean; endsAt: string; days: number };
export function signupPublicView(on: boolean, env: Env = process.env, now = Date.now()): SignupPublicView {
  const c = signupCampaignConfig(env, now);
  return { active: on && c.inWindow, endsAt: c.end, days: c.days };
}
/** 「11월 30일」: [시작, 끝) 끝 경계의 1초 앞(KST). 못 읽으면 빈 문자열. */
export function eventEndDayLabel(endsAt: string | null | undefined): string {
  const ms = Date.parse(endsAt ?? "");
  return Number.isFinite(ms) ? kstMonthDayLabel(new Date(ms - 1000).toISOString()) : "";
}
/** COMP_ENABLED=1이어야 지급·안내가 켜진다(지정·집계는 꺼져 있어도 된다). 장수·상품은 환경 설정값, 기한은 compTicketExpiresAt(P 추가 D, 11-30 그대로). */
export function compConfig(env: Env = process.env, now = Date.now()): CompConfig {
  const listed = (env.COMP_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(p => (ALL_PRODUCTS as readonly string[]).includes(p));
  return {
    enabled: env.COMP_ENABLED === "1",
    aQty: compInt(env.COMP_A_QTY, 2, 0, 5), aDays: TICKET_VALID_DAYS,
    bQty: compInt(env.COMP_B_QTY, 1, 0, 5), bDays: TICKET_VALID_DAYS, expiresAt: compTicketExpiresAt(now),
    products: listed.length ? [...new Set(listed)] : [...COMP_DEFAULT_PRODUCTS],
  };
}
/** ops_comp('sync')에 넘기는 설정값(서재 안내·관리자 지정이 같이 쓴다). */
export function compSyncArgs(cfg: CompConfig, enabled = cfg.enabled) {
  return { enabled, aQty: cfg.aQty, aDays: cfg.aDays, bQty: cfg.bQty, bDays: cfg.bDays, expiresAt: cfg.expiresAt, products: cfg.products };
}
