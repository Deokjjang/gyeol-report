import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ProductTile from "../../../src/components/product/ProductTile";
import type {
  ProductTileItem,
} from "../../../src/components/product/ProductTile";

const activeProduct = {
  id: "comprehensive",
  nameKo: "사주×MBTI 종합 리포트",
  versionBadgeKo: "v1.0",
  status: "available",
  isPurchasable: true,
  href: "/report/new",
  badgeKo: "런칭가",
  visualKey: "comprehensive",
  summaryKo:
    "결제 후 입력값을 바탕으로 자동 생성되는 유료 디지털 리포트입니다.",
  salePriceKo: "런칭가 990원",
  listPriceKo: "1,290원",
  listPriceLabelKo: "1,290원",
  priceLabelKo: "990원",
  deliveryTypeKo: "결제 후 온라인 열람",
  formatKo: "자동 생성 디지털 리포트",
} as const satisfies ProductTileItem;

const comingSoonProduct = {
  id: "career_money_study_report",
  nameKo: "직업·커리어·돈·학업 리포트",
  versionBadgeKo: "v1.0 준비",
  shortDescriptionKo: "타고난 직업성과 돈, 공부 전략을 함께 봅니다.",
  status: "coming_soon",
  isPurchasable: false,
  href: null,
  badgeKo: "리빌딩 중",
  visualKey: "career_money_study",
} as const satisfies ProductTileItem;

const previewProduct = {
  id: "career_money_study_report",
  productKey: "career_money_study",
  slug: "career-money-study",
  nameKo: "직업·커리어·돈·학업 리포트",
  versionBadgeKo: "v1.0 준비",
  shortDescriptionKo: "타고난 직업성과 돈, 공부 전략을 함께 봅니다.",
  status: "preview_available",
  isPurchasable: false,
  href: null,
  previewHref: "/report/new?product=career-money-study",
  previewCtaLabelKo: "입력 흐름 미리보기",
  previewStatusKo: "준비 중 · 미리보기 가능",
  badgeKo: "개발 preview",
  visualKey: "career_money_study",
} as const satisfies ProductTileItem;

const lovePreviewProduct = {
  id: "love_marriage_child_report",
  productKey: "love_marriage_child",
  slug: "love-marriage-child",
  nameKo: "연애·결혼·자녀 리포트",
  versionBadgeKo: "v1.0 준비",
  shortDescriptionKo: "관계 표현과 결혼 생활, 부모 역할을 함께 봅니다.",
  status: "preview_available",
  isPurchasable: false,
  href: null,
  previewHref: "/report/new?product=love-marriage-child",
  previewCtaLabelKo: "입력 흐름 미리보기",
  previewStatusKo: "준비 중 · 미리보기 가능",
  badgeKo: "개발 preview",
  visualKey: "love_marriage_child",
} as const satisfies ProductTileItem;

describe("ProductTile", () => {
  it("renders purchasable product state and CTA", () => {
    const html = renderToStaticMarkup(<ProductTile product={activeProduct} />);

    expect(html).toContain("사주×MBTI 종합 리포트");
    expect(html).toContain("구매 가능");
    expect(html).toContain("런칭가 990원");
    expect(html).toContain("990원 결제하고 리포트 생성하기");
    expect(html).toContain('href="/report/new"');
  });

  it("renders coming soon product as disabled", () => {
    const html = renderToStaticMarkup(
      <ProductTile product={comingSoonProduct} />,
    );

    expect(html).toContain("직업·커리어·돈·학업 리포트");
    expect(html).toContain("리빌딩 중");
    expect(html).toContain("비활성");
    expect(html).toContain("출시 준비 중");
    expect(html).toContain("disabled");
    expect(html).toContain('aria-disabled="true"');
    expect(html).not.toContain("결제하고 리포트 생성하기");
  });

  it("renders preview product as a non-purchasable input flow link", () => {
    const html = renderToStaticMarkup(<ProductTile product={previewProduct} />);

    expect(html).toContain("직업·커리어·돈·학업 리포트");
    expect(html).toContain("개발 preview");
    expect(html).toContain("준비 중 · 미리보기 가능");
    expect(html).toContain("입력 흐름 미리보기");
    expect(html).toContain('href="/report/new?product=career-money-study"');
    expect(html).not.toContain("구매 가능");
    expect(html).not.toContain("결제하고 리포트 생성하기");
  });

  it("renders love marriage child preview product as a non-purchasable input flow link", () => {
    const html = renderToStaticMarkup(
      <ProductTile product={lovePreviewProduct} />,
    );

    expect(html).toContain("연애·결혼·자녀 리포트");
    expect(html).toContain("개발 preview");
    expect(html).toContain("준비 중 · 미리보기 가능");
    expect(html).toContain("입력 흐름 미리보기");
    expect(html).toContain('href="/report/new?product=love-marriage-child"');
    expect(html).not.toContain("구매 가능");
    expect(html).not.toContain("결제하고 리포트 생성하기");
  });
});
