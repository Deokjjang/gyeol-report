import { describe, expect, it } from "vitest";

import {
  GYEOL_COMING_SOON_PRODUCTS,
  GYEOL_HOME_PRODUCT_GRID,
  GYEOL_PRODUCTS,
} from "../../../src/lib/product/gyeolProducts";
import { formatKrw, REPORT_PRICE_TABLE_KRW } from "../../../src/lib/payment/reportProductCatalog";

const comprehensivePrice = REPORT_PRICE_TABLE_KRW.saju_mbti_full;

describe("GYEOL_PRODUCTS", () => {
  it("defines all six public products as purchasable launch products", () => {
    expect(GYEOL_PRODUCTS).toHaveLength(6);
    expect(GYEOL_PRODUCTS.filter((product) => product.isPurchasable)).toHaveLength(
      6,
    );

    expect(GYEOL_PRODUCTS[0]).toMatchObject({
      id: "comprehensive",
      productType: "saju_mbti_full",
      paymentProductType: "saju_mbti_full",
      slug: "saju-mbti-full",
      nameKo: "사주×MBTI 종합 리포트",
      fullNameKo: "사주×MBTI 종합 리포트",
      versionBadgeKo: "판매 상품",
      priceAmount: comprehensivePrice,
      listPriceAmount: comprehensivePrice,
      salePriceAmount: comprehensivePrice,
      paymentAmount: comprehensivePrice,
      currency: "KRW",
      priceKo: formatKrw(comprehensivePrice),
      listPriceKo: formatKrw(comprehensivePrice),
      salePriceKo: `판매가 ${formatKrw(comprehensivePrice)}`,
      status: "available",
      isPurchasable: true,
      href: "/report/new?product=saju-mbti-full",
      ctaHref: "/report/new?product=saju-mbti-full",
      formatKo: "자동 생성 디지털 리포트",
      deliveryTypeKo: "결제 후 온라인 리포트 생성/열람",
      retentionKo: "생성일로부터 90일 열람",
    });
    for (const product of GYEOL_PRODUCTS) {
      const price = REPORT_PRICE_TABLE_KRW[product.productType];
      expect(product).toMatchObject({
        priceAmount: price,
        listPriceAmount: price,
        salePriceAmount: price,
        paymentAmount: price,
        priceKo: formatKrw(price),
        salePriceKo: `판매가 ${formatKrw(price)}`,
      });
    }
  });

  it("does not expose coming-soon products in the launch catalog", () => {
    expect(GYEOL_COMING_SOON_PRODUCTS).toHaveLength(0);
  });

  it("orders the home product grid with all six products purchasable", () => {
    expect(GYEOL_HOME_PRODUCT_GRID.map((product) => product.nameKo)).toEqual([
      "사주×MBTI 종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "궁합 리포트",
      "대운 리포트",
      "세운 리포트",
    ]);
    expect(
      GYEOL_HOME_PRODUCT_GRID.filter((product) => product.isPurchasable),
    ).toHaveLength(6);
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
