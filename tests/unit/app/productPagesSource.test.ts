import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const productPageSources = [
  readSource("src/lib/product/gyeolProducts.ts"),
  readSource("src/components/product/ProductVisual.tsx"),
  readSource("src/components/product/ProductSummaryCard.tsx"),
  readSource("src/components/product/ComingSoonProductCard.tsx"),
  readSource("src/components/product/ProductGrid.tsx"),
  readSource("src/components/product/ProductTile.tsx"),
  readSource("src/components/product/ProductTileVisual.tsx"),
  readSource("src/app/products/page.tsx"),
  readSource("src/app/products/saju-mbti-full/page.tsx"),
].join("\n");

describe("product pages source", () => {
  it("contains required Toss review product phrases", () => {
    const requiredMarkers = [
      "상품",
      "결리포트에서 제공하는 리포트",
      "종합 리포트",
      "사주×MBTI 전체 리포트",
      "정가 1,290원",
      "런칭가 990원",
      "결제금액 990원",
      "결제 승인 후 온라인 열람",
      "디지털 리포트",
      "자기이해용 참고 콘텐츠",
      "중요한 의사결정은 관련 전문가의 조언과 함께 판단해 주세요",
      "중복 결제",
      "시스템 오류",
      "리포트 미제공",
      "하반기 운세",
      "궁합 리포트",
      "대운 리포트",
      "세운 리포트",
      "출시 준비 중",
      "시작하기",
    ];

    for (const marker of requiredMarkers) {
      expect(productPageSources).toContain(marker);
    }
  });

  it("renders coming soon products as disabled and not purchasable", () => {
    const requiredMarkers = [
      "coming_soon",
      "isPurchasable: false",
      "href: null",
      'disabled',
      'aria-disabled="true"',
      "half_year",
      "comprehensive",
      "daewoon",
      "saewoon",
      "compatibility",
    ];

    for (const marker of requiredMarkers) {
      expect(productPageSources).toContain(marker);
    }
  });

  it("does not show empty category or unsupported product purchase UI", () => {
    const blockedMarkers = [
      "빈 카테고리",
      "출시 예정 상품 구매하기",
      "하반기 운세 " + "구매하기",
      "오행팔찌 구매",
      "굿즈 구매",
      "대운 구매",
      "세운 구매",
      "궁합 구매",
    ];

    for (const marker of blockedMarkers) {
      expect(productPageSources).not.toContain(marker);
    }
  });

  it("does not contain payment secret or paid-report implementation markers", () => {
    const blockedMarkers = [
      ["TOSS", "SECRET", "KEY"].join("_"),
      ["SUPABASE", "SERVICE", "ROLE"].join("_"),
      ["payment", "Key"].join(""),
      ["provider", "PaymentId"].join(""),
      ["access", "TokenHash"].join(""),
      ["share", "Token"].join(""),
      ["guaranteed", "future"].join(" "),
      ["질병", "진단"].join(" "),
      ["투자", "수익", "보장"].join(" "),
      ["결혼", "보장"].join(" "),
    ];

    for (const marker of blockedMarkers) {
      expect(productPageSources).not.toContain(marker);
    }
  });
});
