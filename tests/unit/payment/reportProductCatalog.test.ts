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
      labelKo: "사주×MBTI 전체 리포트",
      descriptionKo: "사주 구조와 MBTI 입력을 함께 보는 전체 리포트입니다.",
      amount: 1290,
      currency: "KRW",
      isPurchasable: true,
    });
    expect(isPurchasableReportProduct("saju_mbti_full")).toBe(true);
  });

  it("keeps planned future products non-purchasable", () => {
    const futureProductTypes = [
      "saju_basic",
      "saju_full",
      "daewoon",
      "saewoon",
      "compatibility",
    ];

    expect(getInactiveReportProductTypes()).toEqual(futureProductTypes);

    for (const productType of futureProductTypes) {
      const product = getReportProduct(productType);

      expect(product?.isPurchasable).toBe(false);
      expect(product?.currency).toBe("KRW");
      expect(isPurchasableReportProduct(productType)).toBe(false);
    }
  });

  it("has one catalog item for every report product type", () => {
    expect(getReportProductCatalog().map((product) => product.productType)).toEqual([
      "saju_mbti_full",
      "saju_basic",
      "saju_full",
      "daewoon",
      "saewoon",
      "compatibility",
    ]);
  });

  it("rejects unknown products", () => {
    expect(getReportProduct("unknown_product")).toBeNull();
    expect(isPurchasableReportProduct("unknown_product")).toBe(false);
  });

  it("does not include stored-value or package catalog entries", () => {
    const blockedMarkers = [
      "wallet",
      "recharge",
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
