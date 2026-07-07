import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductTile from "../../../src/components/product/ProductTile";
import { GYEOL_PRODUCTS } from "../../../src/lib/product/gyeolProducts";

describe("ProductTile", () => {
  it("renders purchasable product state and 1290 won CTA", () => {
    const html = renderToStaticMarkup(
      <ProductTile product={GYEOL_PRODUCTS[0]} />,
    );

    expect(html).toContain("사주×MBTI 종합 리포트");
    expect(html).toContain("구매 가능");
    expect(html).toContain("1,290원");
    expect(html).toContain("1,290원 결제하고 리포트 생성하기");
    expect(html).toContain("생성일로부터 90일 열람");
    expect(html).toContain("결제 완료 후 즉시 생성, 최대 24시간 이내 제공");
    expect(html).toContain('href="/report/new?product=saju-mbti-full"');
    expect(html).not.toContain("990원");
    expect(html).not.toContain("런칭가");
    expect(html).not.toContain("확장 예정");
  });

  it("renders all six launch products as purchasable report cards", () => {
    const html = GYEOL_PRODUCTS.map((product) =>
      renderToStaticMarkup(<ProductTile product={product} />),
    ).join("\n");

    const productNames = [
      "사주×MBTI 종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "궁합 리포트",
      "대운 리포트",
      "세운 리포트",
    ];

    for (const productName of productNames) {
      expect(html).toContain(productName);
    }

    expect(GYEOL_PRODUCTS).toHaveLength(6);
    expect((html.match(/1,290원 결제하고 리포트 생성하기/g) ?? [])).toHaveLength(6);
    expect(html).not.toContain("다른 리포트 보기");
    expect(html).not.toContain("준비 중");
  });
});
