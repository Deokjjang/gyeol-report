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
/** 켜짐(GIFT_EVENT_ENABLED=1)이고 기간(GIFT_EVENT_START·END, ISO)이 맞아야 active. 상한 기본 2장·보너스 2장·유효 30일, 대상 상품 기본 = 판매 중인 전부. */
export function giftEventConfig(env: Env = process.env, now = Date.now()): GiftEventConfig {
  const start = env.GIFT_EVENT_START ?? "", end = env.GIFT_EVENT_END ?? "";
  const valid = Number.isFinite(Date.parse(start)) && Number.isFinite(Date.parse(end)) && Date.parse(start) < Date.parse(end);
  const listed = (env.GIFT_EVENT_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(p => (ALL_PRODUCTS as readonly string[]).includes(p));
  const products = (listed.length ? listed : [...ALL_PRODUCTS]).filter(p => productOnSale(p, env));
  return { active: env.GIFT_EVENT_ENABLED === "1" && valid && now >= Date.parse(start) && now < Date.parse(end), start: valid ? new Date(start).toISOString() : "", end: valid ? new Date(end).toISOString() : "",
    maxPerAccount: int(env.GIFT_EVENT_MAX_PER_ACCOUNT, 2, 20), bonusMax: int(env.GIFT_EVENT_BONUS_MAX, 2, 20), products, validDays: int(env.GIFT_EVENT_VALID_DAYS, 30, 365) || 30 };
}

export type CompConfig = {
  readonly enabled: boolean;
  /** A: 총 장수(장마다 내가 쓰기/선물 선택) · 유효일. */
  readonly aQty: number; readonly aDays: number;
  /** B: 장수(장마다 내가 쓰기/선물 선택) · 유효일. */
  readonly bQty: number; readonly bDays: number;
  /** 보상 이용권으로 만들 수 있는 상품(기본 4종: 종합·커리어·연애·궁합). 이용권 자체에 담겨 사용 때 서버가 다시 확인한다. */
  readonly products: readonly string[];
};
export const COMP_DEFAULT_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;
const compInt = (v: string | undefined, d: number, min: number, max: number) => { const n = Number(v); return v !== undefined && v.trim() !== "" && Number.isInteger(n) && n >= min && n <= max ? n : d; };
/** COMP_ENABLED=1이어야 지급·안내가 켜진다(지정·집계는 꺼져 있어도 된다). 모든 장수·유효일·상품은 환경 설정값. */
export function compConfig(env: Env = process.env): CompConfig {
  const listed = (env.COMP_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(p => (ALL_PRODUCTS as readonly string[]).includes(p));
  return {
    enabled: env.COMP_ENABLED === "1",
    aQty: compInt(env.COMP_A_QTY, 2, 0, 5), aDays: compInt(env.COMP_A_VALID_DAYS, 60, 1, 365),
    bQty: compInt(env.COMP_B_QTY, 1, 0, 5), bDays: compInt(env.COMP_B_VALID_DAYS, 30, 1, 365),
    products: listed.length ? [...new Set(listed)] : [...COMP_DEFAULT_PRODUCTS],
  };
}
/** ops_comp('sync')에 넘기는 설정값(서재 안내·관리자 지정이 같이 쓴다). */
export function compSyncArgs(cfg: CompConfig, enabled = cfg.enabled) {
  return { enabled, aQty: cfg.aQty, aDays: cfg.aDays, bQty: cfg.bQty, bDays: cfg.bDays, products: cfg.products };
}
