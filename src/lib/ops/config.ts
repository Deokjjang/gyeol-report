/**
 * 운영 설정값(P6d-ops). 서버에서만 읽고, 화면에는 값만 props로 넘긴다.
 * - FORTUNE_SALES_OPEN=1: 대운·세운 판매를 다시 연다(기본: 닫힘, 이미 산 Book은 어느 쪽이든 열린다).
 * - ADMIN_USER_IDS: 관리자 화면(/admin/orders)을 열 수 있는 계정 id(쉼표 구분). 비어 있으면 아무도 못 연다.
 * - GIFT_EVENT_*: 결제 1건마다 이용권 1장 이벤트(기본: 꺼짐).
 * - COMP_*: 보상 이용권 두 등급(P6e-ops, 기본: 꺼짐). A = 결제 후 환불한 고객(관리자가 지정), B = 기존 무료 이벤트 가입자 명단.
 *   v5 최종 2-3: A 2장·B 1장, 장마다 고객이 '내가 쓰기 / 선물 링크 만들기'를 고른다(이벤트 이용권과 같은 종류·화면·규칙).
 */
type Env = Readonly<Record<string, string | undefined>>;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const CLOSED_FORTUNE_PRODUCTS = ["major_fortune", "annual_fortune"] as const;
export const FORTUNE_REOPEN_LINE = "12월 1일 · 2027 신년판 공개";
export const ALL_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;

export function fortuneSalesOpen(env: Env = process.env) { return env.FORTUNE_SALES_OPEN === "1"; }
export function closedSaleProducts(env: Env = process.env): string[] { return fortuneSalesOpen(env) ? [] : [...CLOSED_FORTUNE_PRODUCTS]; }
/** 결제·이용권 사용 진입점 전용(읽기·분석 경로는 isPurchasable 그대로). */
export function productOnSale(product: unknown, env: Env = process.env): boolean { return typeof product === "string" && !closedSaleProducts(env).includes(product); }
export const SALES_CLOSED_CODE = "PRODUCT_SALES_CLOSED";
export const SALES_CLOSED_MESSAGE = "대운·세운은 2027 신년판으로 새로 단장하고 있어요. 12월 1일에 다시 만나요.";

export function adminUserIds(env: Env = process.env): string[] { return (env.ADMIN_USER_IDS ?? "").split(",").map(s => s.trim()).filter(s => UUID.test(s)); }
export function isAdminUser(id: unknown, env: Env = process.env): boolean { return typeof id === "string" && adminUserIds(env).includes(id); }

export type GiftEventConfig = { readonly active: boolean; readonly start: string; readonly end: string; readonly maxPerAccount: number; readonly bonusMax: number; readonly products: readonly string[]; readonly validDays: number };
const int = (v: string | undefined, d: number, max: number) => { const n = Number(v); return Number.isInteger(n) && n >= 0 && n <= max ? n : d; };
/**
 * 이용권 유효기간(v5 최종3): 앞으로 발급하는 모든 이용권(이벤트 1+1·친구 보너스·보상 A·B·관리자 지급)은 발급일로부터 30일.
 * 선물은 처음 발급 기한을 그대로 넘긴다. 이미 발급한 이용권은 발급 때 기한 그대로. SQL(20261105120000_v5_final3_tickets_reading.sql)도 30일을 넘기지 않는다.
 */
export const TICKET_VALID_DAYS = 30;
/** 1+1 이벤트 기본 기간(최종 A 11): 2026-11-07 00:00:00 ~ 2026-11-16 23:59:59 KST. GIFT_EVENT_START·END env로 바꾼다. */
export const GIFT_EVENT_DEFAULT_START = "2026-11-07T00:00:00+09:00";
export const GIFT_EVENT_DEFAULT_END = "2026-11-16T23:59:59+09:00";
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
 * start·end는 [시작, 끝) 경계의 ISO(SQL이 paid_at >= start and paid_at < end로 쓴다). 상한 기본 2장·보너스 2장·유효 30일(고정), 대상 상품 기본 = 판매 중인 전부.
 */
export function giftEventConfig(env: Env = process.env, now = Date.now()): GiftEventConfig {
  const w = giftEventWindow(env, now), valid = Number.isFinite(w.startMs);
  const listed = (env.GIFT_EVENT_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(p => (ALL_PRODUCTS as readonly string[]).includes(p));
  const products = (listed.length ? listed : [...ALL_PRODUCTS]).filter(p => productOnSale(p, env));
  return { active: w.phase === "during", start: valid ? new Date(w.startMs).toISOString() : "", end: valid ? new Date(w.endMs).toISOString() : "",
    maxPerAccount: int(env.GIFT_EVENT_MAX_PER_ACCOUNT, 2, 20), bonusMax: int(env.GIFT_EVENT_BONUS_MAX, 2, 20), products, validDays: TICKET_VALID_DAYS };
}
/** 화면에 내보내는 공개 이벤트 정보(보상 이야기 없음). 배너·팝업 ①·영수증 한 줄. */
export type GiftEventPublicView = { phase: GiftEventPhase; serverNow: string; startsAt: string; endsAt: string; maxPerAccount: number; validDays: number };
export function giftEventPublicView(env: Env = process.env, now = Date.now()): GiftEventPublicView {
  const w = giftEventWindow(env, now), cfg = giftEventConfig(env, now);
  return { phase: w.phase, serverNow: new Date(now).toISOString(), startsAt: cfg.start, endsAt: cfg.end, maxPerAccount: cfg.maxPerAccount, validDays: TICKET_VALID_DAYS };
}

export type CompConfig = {
  readonly enabled: boolean;
  /** A: 총 장수(장마다 내가 쓰기/선물 선택) · 유효일(30일 고정, TICKET_VALID_DAYS). */
  readonly aQty: number; readonly aDays: number;
  /** B: 장수(장마다 내가 쓰기/선물 선택) · 유효일(30일 고정). */
  readonly bQty: number; readonly bDays: number;
  /** 보상 이용권으로 만들 수 있는 상품(기본 4종: 종합·커리어·연애·궁합). 이용권 자체에 담겨 사용 때 서버가 다시 확인한다. */
  readonly products: readonly string[];
};
export const COMP_DEFAULT_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;
const compInt = (v: string | undefined, d: number, min: number, max: number) => { const n = Number(v); return v !== undefined && v.trim() !== "" && Number.isInteger(n) && n >= min && n <= max ? n : d; };
/** COMP_ENABLED=1이어야 지급·안내가 켜진다(지정·집계는 꺼져 있어도 된다). 장수·상품은 환경 설정값, 유효일은 30일 고정(최종3). */
export function compConfig(env: Env = process.env): CompConfig {
  const listed = (env.COMP_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(p => (ALL_PRODUCTS as readonly string[]).includes(p));
  return {
    enabled: env.COMP_ENABLED === "1",
    aQty: compInt(env.COMP_A_QTY, 2, 0, 5), aDays: TICKET_VALID_DAYS,
    bQty: compInt(env.COMP_B_QTY, 1, 0, 5), bDays: TICKET_VALID_DAYS,
    products: listed.length ? [...new Set(listed)] : [...COMP_DEFAULT_PRODUCTS],
  };
}
/** ops_comp('sync')에 넘기는 설정값(서재 안내·관리자 지정이 같이 쓴다). */
export function compSyncArgs(cfg: CompConfig, enabled = cfg.enabled) {
  return { enabled, aQty: cfg.aQty, aDays: cfg.aDays, bQty: cfg.bQty, bDays: cfg.bDays, products: cfg.products };
}
