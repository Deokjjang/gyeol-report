import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductSummaryCard from "../../../src/components/product/ProductSummaryCard";
import { GYEOL_PRODUCTS } from "../../../src/lib/product/gyeolProducts";

describe("ProductSummaryCard", () => {
  it("renders the active product summary", () => {
    const html = renderToStaticMarkup(
      <ProductSummaryCard product={GYEOL_PRODUCTS[0]} />,
    );
    const visibleMarkers = [
      "사주×MBTI 종합 리포트",
      "판매가",
      "1,290원",
      "생성일로부터 90일 열람",
      "결제 완료 후 즉시 생성, 최대 24시간 이내 제공",
      "자동 생성 디지털 리포트",
      "결제 후 온라인 리포트 생성/열람",
      "자세히 보기",
      "1,290원 결제하고 리포트 생성하기",
    ];

    for (const marker of visibleMarkers) {
      expect(html).toContain(marker);
    }
  });

  it("renders product and policy links", () => {
    const html = renderToStaticMarkup(
      <ProductSummaryCard product={GYEOL_PRODUCTS[0]} />,
    );
    const expectedLinks = [
      "/products/saju-mbti-full",
      "/report/new?product=saju-mbti-full",
      "/refund",
      "/privacy",
    ];

    for (const link of expectedLinks) {
      expect(html).toContain(`href="${link}"`);
    }
  });
});
