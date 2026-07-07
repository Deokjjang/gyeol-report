import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getInactiveReportProductTypes,
  getReportProduct,
  getReportProductCatalog,
  isPurchasableReportProduct,
} from "../../../src/lib/payment/reportProductCatalog";

const source = readFileSync(
  join(process.cwd(), "src/lib/payment/reportProductCatalog.ts"),
  "utf8",
);

describe("report product catalog", () => {
  it("contains the current purchasable saju mbti product", () => {
    const product = getReportProduct("saju_mbti_full");

    expect(product).toEqual({
      productType: "saju_mbti_full",
      labelKo: "사주×MBTI 종합 리포트",
      descriptionKo: "명리 구조와 MBTI 행동 패턴을 함께 읽는 종합 리포트입니다.",
      amount: 1290,
      currency: "KRW",
      priceLabelKo: "1,290원",
      isPurchasable: true,
    });
    expect(isPurchasableReportProduct("saju_mbti_full")).toBe(true);
  });

  it("keeps all launch products purchasable at the fixed amount", () => {
    const launchProductTypes = [
      "career_money_study",
      "love_marriage_child",
      "saju_mbti_compatibility",
      "major_fortune",
      "annual_fortune",
    ];

    expect(getInactiveReportProductTypes()).toEqual([]);

    for (const productType of launchProductTypes) {
      const product = getReportProduct(productType);

      expect(product?.isPurchasable).toBe(true);
      expect(product?.amount).toBe(1290);
      expect(product?.currency).toBe("KRW");
      expect(isPurchasableReportProduct(productType)).toBe(true);
    }
  });

  it("has one catalog item for every report product type", () => {
    expect(getReportProductCatalog().map((product) => product.productType)).toEqual([
      "saju_mbti_full",
      "career_money_study",
      "love_marriage_child",
      "saju_mbti_compatibility",
      "major_fortune",
      "annual_fortune",
    ]);
  });

  it("rejects unknown products", () => {
    expect(getReportProduct("unknown_product")).toBeNull();
    expect(isPurchasableReportProduct("unknown_product")).toBe(false);
  });

  it("does not include stored-value or package catalog entries", () => {
    const blockedMarkers = [
      ["wall", "et"].join(""),
      ["re", "charge"].join(""),
      "point " + "balance",
      "credit " + "balance",
      "package products enabled",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
    ];

    for (const marker of blockedMarkers) {
      expect(source).not.toContain(marker);
    }
  });
});
