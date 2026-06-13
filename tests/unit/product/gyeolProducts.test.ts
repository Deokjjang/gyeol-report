import { describe, expect, it } from "vitest";

import {
  GYEOL_COMING_SOON_PRODUCTS,
  GYEOL_HOME_PRODUCT_GRID,
  GYEOL_PRODUCTS,
} from "../../../src/lib/product/gyeolProducts";

describe("GYEOL_PRODUCTS", () => {
  it("defines the single purchasable public product for Toss review", () => {
    expect(GYEOL_PRODUCTS).toHaveLength(1);
    expect(GYEOL_PRODUCTS.filter((product) => product.isPurchasable)).toHaveLength(
      1,
    );

    expect(GYEOL_PRODUCTS[0]).toMatchObject({
      id: "comprehensive",
      productType: "saju_mbti_full",
      paymentProductType: "saju_mbti_full",
      slug: "saju-mbti-full",
      nameKo: "사주×MBTI 종합 리포트",
      fullNameKo: "사주×MBTI 종합 리포트",
      priceAmount: 990,
      listPriceAmount: 1290,
      salePriceAmount: 990,
      paymentAmount: 990,
      currency: "KRW",
      priceKo: "990원",
      listPriceKo: "1,290원",
      salePriceKo: "런칭가 990원",
      status: "available",
      isPurchasable: true,
      href: "/report/new",
      ctaHref: "/report/new",
      formatKo: "자동 생성 디지털 리포트",
      deliveryTypeKo: "결제 후 온라인 열람",
    });
  });

  it("defines coming soon products as display-only cards", () => {
    const comingSoonNames = GYEOL_COMING_SOON_PRODUCTS.map(
      (product) => product.nameKo,
    );

    expect(comingSoonNames).toEqual([
      "하반기 운세",
      "궁합 리포트",
      "대운 리포트",
      "세운 리포트",
    ]);
    expect(
      GYEOL_COMING_SOON_PRODUCTS.every(
        (product) =>
          product.status === "coming_soon" &&
          product.isPurchasable === false &&
          product.href === null &&
          product.badgeKo === "출시 준비 중",
      ),
    ).toBe(true);
  });

  it("orders the home product grid with only the comprehensive report purchasable", () => {
    expect(GYEOL_HOME_PRODUCT_GRID.map((product) => product.nameKo)).toEqual([
      "하반기 운세",
      "사주×MBTI 종합 리포트",
      "대운 리포트",
      "세운 리포트",
      "궁합 리포트",
    ]);
    expect(
      GYEOL_HOME_PRODUCT_GRID.filter((product) => product.isPurchasable),
    ).toEqual([GYEOL_PRODUCTS[0]]);
  });

  it("does not expose blocked future markers as public sellable products", () => {
    const publicProductSource = JSON.stringify(GYEOL_PRODUCTS);
    const blockedMarkers = [
      "saju_basic",
      "saju_full",
      "오행팔찌",
      "굿즈",
    ];

    for (const marker of blockedMarkers) {
      expect(publicProductSource).not.toContain(marker);
    }
  });
});
