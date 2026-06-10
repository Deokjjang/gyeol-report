import { describe, expect, it } from "vitest";

import { GYEOL_PRODUCTS } from "../../../src/lib/product/gyeolProducts";

describe("GYEOL_PRODUCTS", () => {
  it("defines the single public product for Toss review", () => {
    expect(GYEOL_PRODUCTS).toHaveLength(1);

    expect(GYEOL_PRODUCTS[0]).toMatchObject({
      productType: "saju_mbti_full",
      slug: "saju-mbti-full",
      nameKo: "사주×MBTI 전체 리포트",
      priceAmount: 1290,
      currency: "KRW",
      priceKo: "1,290원",
      formatKo: "디지털 리포트",
      deliveryTypeKo: "결제 승인 후 온라인 열람",
    });
  });

  it("does not expose future products as public sellable products", () => {
    const publicProductSource = JSON.stringify(GYEOL_PRODUCTS);
    const blockedMarkers = [
      "saju_basic",
      "saju_full",
      "daewoon",
      "saewoon",
      "compatibility",
      "오행팔찌",
      "굿즈",
    ];

    for (const marker of blockedMarkers) {
      expect(publicProductSource).not.toContain(marker);
    }
  });
});
