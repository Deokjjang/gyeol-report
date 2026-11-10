import { describe, expect, it } from "vitest";
import { closedSaleProducts, fortunePriceSet, productOnSale } from "../../../src/lib/ops/config";

// AM 6부: 대운·세운 가격은 설정값. 비어 있으면 판매를 열어도 팔지 않는다(판매 중지 유지).
describe("대운·세운 가격 설정값", () => {
  it("판매를 닫으면 둘 다 닫힌다", () => { expect(closedSaleProducts({})).toEqual(["major_fortune", "annual_fortune"]); });
  it("판매를 열어도 가격이 비어 있으면 닫힌다", () => {
    expect(closedSaleProducts({ FORTUNE_SALES_OPEN: "1" })).toEqual(["major_fortune", "annual_fortune"]);
    expect(productOnSale("annual_fortune", { FORTUNE_SALES_OPEN: "1" })).toBe(false);
  });
  it("가격을 넣은 상품만 열린다", () => {
    const env = { FORTUNE_SALES_OPEN: "1", FORTUNE_PRICE_ANNUAL_KRW: "3900" };
    expect(fortunePriceSet("annual_fortune", env)).toBe(true);
    expect(closedSaleProducts(env)).toEqual(["major_fortune"]);
    expect(productOnSale("annual_fortune", env)).toBe(true);
    expect(productOnSale("saju_mbti_full", env)).toBe(true);
  });
  it("100원 미만·숫자 아님은 비어 있는 것과 같다", () => {
    expect(fortunePriceSet("major_fortune", { FORTUNE_PRICE_MAJOR_KRW: "50" })).toBe(false);
    expect(fortunePriceSet("major_fortune", { FORTUNE_PRICE_MAJOR_KRW: "abc" })).toBe(false);
  });
});
