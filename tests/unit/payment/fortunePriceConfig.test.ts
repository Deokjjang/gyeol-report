// AM2-14 5부(덕짱님 결정 2026-11-24): 세운 · 대운 판매 · 가격 · 작가 경로는 운영 env에 기대지 않는다(4종과 같은 방식).
//   판매 시작 = 코드 상수 2026-12-01 09:00 KST(그 전 닫힘) · 긴급 정지 = DB 판매 멈춤(Q0 · 처리 봇) · 가격 = 카탈로그 상수(세운 3,900 · 대운 4,900 · 반값 2,450).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { closedSaleProducts, FORTUNE_SALES_OPEN_AT, fortuneOpenByClock, fortuneSalesOpen, fortuneSalesOpenAtMs, productOnSale, SALES_CLOSED_CODE, SALES_PAUSED_CODE } from "../../../src/lib/ops/config";
import { getReportProduct, majorHalfPriceKrw, reportPriceKrw } from "../../../src/lib/payment/reportProductCatalog";
import { closedProductOrder } from "../../../src/lib/payment/paidReportReliability";
import { writerV5Products } from "../../../src/lib/writer/flags";

const OPEN = Date.parse(FORTUNE_SALES_OPEN_AT);
const KST = (s: string) => Date.parse(`${s}+09:00`);
/** 운영에서 이제 읽지 않는 env — 무엇이 들어 있어도(비어도) 결과가 같아야 한다. */
const LEGACY = ["FORTUNE_SALES_OPEN", "FORTUNE_PRICE_MAJOR_KRW", "FORTUNE_PRICE_ANNUAL_KRW", "NEXT_PUBLIC_FORTUNE_PRICE_MAJOR_KRW", "NEXT_PUBLIC_FORTUNE_PRICE_ANNUAL_KRW", "WRITER_V5_PRODUCTS"] as const;
beforeEach(() => { for (const k of [...LEGACY, "FORTUNE_SALES_OPEN_AT_TEST"]) vi.stubEnv(k, undefined as never); });
afterEach(() => { vi.unstubAllEnvs(); });

describe("판매 시작 시각(KST)", () => {
  it("시작 시각은 2026-12-01 09:00 KST(= 00:00 UTC)", () => {
    expect(new Date(OPEN).toISOString()).toBe("2026-12-01T00:00:00.000Z");
    expect(fortuneSalesOpenAtMs({})).toBe(OPEN);
  });
  it("12/01 08:59 KST 닫힘 · 09:00 세운 · 대운 열림 — 운영 env가 하나도 없어도", () => {
    const before = KST("2026-12-01T08:59:59"), at = KST("2026-12-01T09:00:00");
    expect(fortuneSalesOpen({}, before)).toBe(false);
    expect(closedSaleProducts({}, before)).toEqual(["major_fortune", "annual_fortune"]);
    expect(productOnSale("annual_fortune", {}, before)).toBe(false); expect(productOnSale("major_fortune", {}, before)).toBe(false);
    expect(fortuneSalesOpen({}, at)).toBe(true);
    expect(closedSaleProducts({}, at)).toEqual([]);
    expect(productOnSale("annual_fortune", {}, at)).toBe(true); expect(productOnSale("major_fortune", {}, at)).toBe(true);
    for (const t of [before, at]) for (const p of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"]) expect(productOnSale(p, {}, t)).toBe(true);
    expect(fortuneOpenByClock(before)).toBe(false); expect(fortuneOpenByClock(at)).toBe(true); // 화면 버튼 판정도 같은 시각
  });
  it("옛 끄기 스위치 · 가격 env는 읽지 않는다(어떤 값이든 시각만 본다)", () => {
    const at = KST("2026-12-01T09:00:00");
    for (const env of [{ FORTUNE_SALES_OPEN: "0" }, { FORTUNE_SALES_OPEN: "" }, { FORTUNE_PRICE_MAJOR_KRW: "" , FORTUNE_PRICE_ANNUAL_KRW: "abc" }, { FORTUNE_SALES_OPEN: "1", FORTUNE_PRICE_ANNUAL_KRW: "3900" }]) {
      expect(closedSaleProducts(env, at)).toEqual([]);
      expect(closedSaleProducts(env, at - 1)).toEqual(["major_fortune", "annual_fortune"]);
    }
  });
  it("시험용 시각 바꾸기(FORTUNE_SALES_OPEN_AT_TEST)는 운영 빌드에서 읽지 않는다", () => {
    const env = { FORTUNE_SALES_OPEN_AT_TEST: "2026-01-01T00:00:00+09:00" };
    expect(productOnSale("annual_fortune", env, OPEN - 1)).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(fortuneSalesOpenAtMs(env)).toBe(OPEN); expect(productOnSale("annual_fortune", env, OPEN - 1)).toBe(false);
  });
});

describe("긴급 정지 = DB 판매 멈춤(Q0 · 처리 봇)이 세운 · 대운에도", () => {
  const store = (product: string) => ({ call: vi.fn(async (a: string) => (a === "find_order" ? { ok: true, order: { provider_order_id: "o-1", status: "ready", product_type: product } } : { ok: false })) });
  it("판매 시작 뒤에도 멈춤이면 승인 전 주문을 막는다(세운 · 대운 · 4종 같이), 멈춤이 풀리면 통과", async () => {
    vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", "2000-01-01T00:00:00+09:00");
    for (const p of ["annual_fortune", "major_fortune", "saju_mbti_full"]) {
      expect(await closedProductOrder(store(p) as never, "o-1", async () => true)).toBe(SALES_PAUSED_CODE);
      expect(await closedProductOrder(store(p) as never, "o-1", async () => false)).toBeNull();
    }
  });
  it("판매 시작 전에는 멈춤과 상관없이 닫힘(세운 · 대운)", async () => {
    vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", "2099-01-01T00:00:00+09:00");
    for (const p of ["annual_fortune", "major_fortune"]) expect(await closedProductOrder(store(p) as never, "o-1", async () => false)).toBe(SALES_CLOSED_CODE);
  });
});

describe("가격 · 작가 경로 상수", () => {
  it("세운 3,900 · 대운 4,900 · 세운 구매자 대운 반값 2,450 · 4종 3,900 그대로", () => {
    expect(reportPriceKrw("annual_fortune")).toBe(3900); expect(reportPriceKrw("major_fortune")).toBe(4900); expect(majorHalfPriceKrw()).toBe(2450);
    for (const p of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const) expect(reportPriceKrw(p)).toBe(3900);
    expect(getReportProduct("annual_fortune")?.priceLabelKo).toBe("3,900원"); expect(getReportProduct("major_fortune")?.priceLabelKo).toBe("4,900원");
  });
  it("v5 작가 상품 = 6상품(세운 · 대운 포함 — 30분 흐름 · 자동 환불이 걸린다)", () => {
    expect(writerV5Products()).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"]);
  });
});
