import { describe, expect, it } from "vitest";
import { closedSaleProducts, FORTUNE_SALES_OPEN_AT, fortuneSalesOpen, fortuneSalesOpenAtMs, fortunePriceSet, productOnSale } from "../../../src/lib/ops/config";

const OPEN = Date.parse(FORTUNE_SALES_OPEN_AT);
const BEFORE = OPEN - 1, AFTER = OPEN;
const PRICED = { FORTUNE_PRICE_ANNUAL_KRW: "3900", FORTUNE_PRICE_MAJOR_KRW: "5900" };

// AM: 판매 시작은 시각(코드 상수 2026-12-01 09:00 KST). FORTUNE_SALES_OPEN은 끄기 스위치, 가격이 비면 닫힘.
describe("대운·세운 판매 시작 시각", () => {
  it("시작 시각은 2026-12-01 09:00 KST(= 00:00 UTC)", () => {
    expect(new Date(OPEN).toISOString()).toBe("2026-12-01T00:00:00.000Z");
    expect(fortuneSalesOpenAtMs({})).toBe(OPEN);
  });
  it("① 시각 전: 스위치를 켜고 가격을 넣어도 닫힘", () => {
    const env = { FORTUNE_SALES_OPEN: "1", ...PRICED };
    expect(fortuneSalesOpen(env, BEFORE)).toBe(false);
    expect(closedSaleProducts(env, BEFORE)).toEqual(["major_fortune", "annual_fortune"]);
    expect(productOnSale("annual_fortune", env, BEFORE)).toBe(false);
    expect(productOnSale("saju_mbti_full", env, BEFORE)).toBe(true);
  });
  it("② 시각 후: 저절로 열림(재배포 없이 같은 설정값)", () => {
    const env = { FORTUNE_SALES_OPEN: "1", ...PRICED };
    expect(fortuneSalesOpen(env, AFTER)).toBe(true);
    expect(closedSaleProducts(env, AFTER)).toEqual([]);
    expect(productOnSale("major_fortune", env, AFTER)).toBe(true);
    expect(productOnSale("annual_fortune", env, AFTER + 86_400_000)).toBe(true);
  });
  it("③ 스위치 끔: 시각이 지나도 닫힘", () => {
    for (const v of [undefined, "", "0", "true"]) {
      const env = { ...(v === undefined ? {} : { FORTUNE_SALES_OPEN: v }), ...PRICED };
      expect(closedSaleProducts(env, AFTER)).toEqual(["major_fortune", "annual_fortune"]);
      expect(productOnSale("annual_fortune", env, AFTER)).toBe(false);
    }
  });
  it("④ 가격 없음: 시각이 지나고 스위치가 켜져도 그 상품만 닫힘", () => {
    expect(closedSaleProducts({ FORTUNE_SALES_OPEN: "1" }, AFTER)).toEqual(["major_fortune", "annual_fortune"]);
    const env = { FORTUNE_SALES_OPEN: "1", FORTUNE_PRICE_ANNUAL_KRW: "3900" };
    expect(closedSaleProducts(env, AFTER)).toEqual(["major_fortune"]);
    expect(productOnSale("annual_fortune", env, AFTER)).toBe(true);
    expect(productOnSale("major_fortune", env, AFTER)).toBe(false);
  });
  it("시험용 시각 바꾸기(FORTUNE_SALES_OPEN_AT_TEST)는 운영 빌드에서 읽지 않는다", () => {
    const env = { FORTUNE_SALES_OPEN: "1", FORTUNE_SALES_OPEN_AT_TEST: "2026-01-01T00:00:00+09:00", ...PRICED };
    expect(productOnSale("annual_fortune", env, BEFORE)).toBe(true);
    const prev = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    try { expect(fortuneSalesOpenAtMs(env)).toBe(OPEN); expect(productOnSale("annual_fortune", env, BEFORE)).toBe(false); }
    finally { (process.env as Record<string, string | undefined>).NODE_ENV = prev; }
  });
});

// AM 6부: 대운·세운 가격은 설정값. 비어 있으면 판매를 열어도 팔지 않는다(판매 중지 유지).
describe("대운·세운 가격 설정값", () => {
  it("판매를 닫으면 둘 다 닫힌다", () => { expect(closedSaleProducts({}, AFTER)).toEqual(["major_fortune", "annual_fortune"]); });
  it("판매를 열어도 가격이 비어 있으면 닫힌다", () => {
    expect(closedSaleProducts({ FORTUNE_SALES_OPEN: "1" }, AFTER)).toEqual(["major_fortune", "annual_fortune"]);
    expect(productOnSale("annual_fortune", { FORTUNE_SALES_OPEN: "1" }, AFTER)).toBe(false);
  });
  it("가격을 넣은 상품만 열린다", () => {
    const env = { FORTUNE_SALES_OPEN: "1", FORTUNE_PRICE_ANNUAL_KRW: "3900" };
    expect(fortunePriceSet("annual_fortune", env)).toBe(true);
    expect(closedSaleProducts(env, AFTER)).toEqual(["major_fortune"]);
    expect(productOnSale("annual_fortune", env, AFTER)).toBe(true);
    expect(productOnSale("saju_mbti_full", env, AFTER)).toBe(true);
  });
  it("100원 미만·숫자 아님은 비어 있는 것과 같다", () => {
    expect(fortunePriceSet("major_fortune", { FORTUNE_PRICE_MAJOR_KRW: "50" })).toBe(false);
    expect(fortunePriceSet("major_fortune", { FORTUNE_PRICE_MAJOR_KRW: "abc" })).toBe(false);
  });
});
