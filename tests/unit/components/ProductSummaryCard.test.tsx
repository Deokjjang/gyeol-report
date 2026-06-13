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
      "정가",
      "1,290원",
      "런칭가 990원",
      "990원",
      "자동 생성 디지털 리포트",
      "결제 후 온라인 열람",
      "자세히 보기",
      "990원 결제하고 리포트 생성하기",
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
      "/report/new",
      "/refund",
      "/privacy",
    ];

    for (const link of expectedLinks) {
      expect(html).toContain(`href="${link}"`);
    }
  });
});
