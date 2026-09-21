import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../../../src/app/page";

const productCatalogSource = readFileSync(
  join(process.cwd(), "src/lib/product/gyeolProducts.ts"),
  "utf8",
);
const homeSource = readFileSync(
  join(process.cwd(), "src/app/page.tsx"),
  "utf8",
);
const homeStyles = readFileSync(
  join(process.cwd(), "src/app/home.module.css"),
  "utf8",
);

describe("home page product source", () => {
  it("shows the active product and purchase path", () => {
    const html = renderToStaticMarkup(Home());
    const requiredMarkers = [
      "결리포트",
      "Gyeol Report",
      "사주×MBTI 종합 리포트",
      "어떤 리포트를 볼까요?",
      "사주×MBTI 종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "대운 리포트",
      "세운 리포트",
      "궁합 리포트",
      "1,290원",
      "생성일로부터 90일 온라인 열람",
      "최대 24시간 이내 제공",
      "자동 생성 디지털 리포트",
      "상담이 아닌 참고용 리포트",
      "내 리포트 만들기",
      "/report/new?product=saju-mbti-full",
      "/report/new?product=career-money-study",
      "/report/new?product=love-marriage-child",
      "/report/new?product=compatibility",
      "/report/new?product=major-fortune",
      "/report/new?product=annual-fortune",
      "love-marriage-child",
      "compatibility",
      "major-fortune",
      "annual-fortune",
    ];

    for (const marker of requiredMarkers) {
      expect(html).toContain(marker);
    }

    const productNames = [
      "사주×MBTI 종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "궁합 리포트",
      "대운 리포트",
      "세운 리포트",
    ];

    expect(productNames.every((productName) => html.includes(productName))).toBe(
      true,
    );
    expect((html.match(/<article/g) ?? []).length).toBe(6);

    const blockedMarkers = [
      "구매 가능",
      "판매 상품",
      "구매 상태",
      "1,290원 결제하고 리포트 생성하기",
      "오행팔찌 구매",
      "굿즈 구매",
      "대운 구매",
      "세운 구매",
      "궁합 구매",
      "현재 구매 가능한 " + "상품 1개",
      "현재 구매 가능한 " + "리포트",
      "이용 " + "흐름",
      "상품 상세 보기",
      "가볍게 정리해 드립니다",
      "자기이해용 참고 콘텐츠",
      "진단",
      "치료",
      "적중률",
      "100%",
      "보장",
      "반드시",
      "운명 확정",
      "개발 preview",
      "preview generation",
      "productKey",
      "productSlug",
      "snapshot",
      "source registry",
      "fallback",
      "v1.0 준비",
      "준비 중 · 미리보기 가능",
      "입력 흐름 미리보기",
      "990원",
      "런칭가",
      "확장 예정",
    ];

    for (const marker of blockedMarkers) {
      expect(html).not.toContain(marker);
    }
  });

  it("shows one price and one working start link per card, with policy once below the grid", () => {
    const html = renderToStaticMarkup(Home());
    const cards = html.match(/<article\b[\s\S]*?<\/article>/g) ?? [];
    expect(cards).toHaveLength(6);
    for (const card of cards) {
      expect(card.match(/1,290원/g)).toHaveLength(1);
      expect(card.match(/<a\b/g)).toHaveLength(1);
      expect(card).toMatch(/href="\/report\/new\?product=[a-z-]+"/);
      expect(card).toContain("시작하기");
      expect(card).not.toMatch(/구매 가능|판매 상품|자동 생성 디지털|90일|최대 24시간/);
    }
    expect(html.match(/최대 24시간 이내 제공/g)).toHaveLength(1);
    expect(html.indexOf("공통 상품 안내")).toBeGreaterThan(html.lastIndexOf("</article>"));
  });

  it("keeps motion optional and focus styles explicit", () => {
    for (const file of ["src/app/home.module.css", "src/components/product/editorialProduct.module.css"]) {
      const css = readFileSync(join(process.cwd(), file), "utf8");
      expect(css).toContain("prefers-reduced-motion: reduce");
      expect(css).toContain(":focus-visible");
      expect(css).not.toMatch(/transition:\s*all/);
    }
  });

  it("uses a focused editorial hero without repeating the brand eyebrow", () => {
    const html = renderToStaticMarkup(Home());
    const hero = html.match(/<header\b[\s\S]*?<\/header>/)?.[0] ?? "";

    expect(hero).toContain("나를 읽는<br/>또 하나의 방식");
    expect(hero).toContain("사주 × MBTI 종합 리포트");
    expect(hero).toContain("1,290원");
    expect(hero).toContain("90일 열람");
    expect(hero).toContain('href="/report/new?product=saju-mbti-full"');
    expect(hero).not.toContain(">결리포트<");
    expect(homeSource).not.toContain("styles.eyebrow");
    expect(homeStyles).toContain("grid-template-columns");
    expect(homeStyles).toContain("@media (min-width: 1024px)");
    expect(homeStyles).toContain("@media (prefers-reduced-motion: reduce)");
    expect(homeStyles).not.toMatch(/transition:\s*all/);
  });

  it("opens the annual fortune card as a purchasable entry", () => {
    const requiredSourceMarkers = [
      'id: "saewoon_report"',
      'productType: "annual_fortune"',
      'slug: "annual-fortune"',
      'status: "available"',
      "isPurchasable: true",
      'href: "/report/new?product=annual-fortune"',
      'badgeKo: "구매 가능"',
      "paymentAmount: PRODUCT_PRICE_AMOUNT",
      'retentionKo: "생성일로부터 90일 열람"',
    ];

    for (const marker of requiredSourceMarkers) {
      expect(productCatalogSource).toContain(marker);
    }
  });
});
