import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

const productPageSources = [
  readSource("src/lib/legal/businessInfo.ts"),
  readSource("src/lib/product/gyeolProducts.ts"),
  readSource("src/components/product/ProductSummaryCard.tsx"),
  readSource("src/components/product/ProductGrid.tsx"),
  readSource("src/components/product/ProductTile.tsx"),
  readSource("src/components/product/ProductTileVisual.tsx"),
  readSource("src/app/products/page.tsx"),
  readSource("src/app/products/saju-mbti-full/page.tsx"),
].join("\n");

describe("product pages source", () => {
  it("contains six purchasable launch product phrases", () => {
    const requiredMarkers = [
      "결리포트에서 제공하는 리포트",
      "사주×MBTI 종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "궁합 리포트",
      "대운 리포트",
      "세운 리포트",
      "판매 상품",
      "구매 가능",
      "1,290원",
      "1,290원 결제하고 리포트 생성하기",
      "무형재화/디지털 콘텐츠",
      "결제 완료 후 즉시 생성, 최대 24시간 이내 제공",
      "생성일로부터 90일",
      "환불 가능",
      "중복결제",
      "시스템 오류",
      "입력값 기반 자동 생성",
      "사람 상담 아님",
      "다운로드",
      "제공하지 않음, 온라인 열람 중심",
      "이름 또는 닉네임",
      "생년월일",
      "출생시간",
      "성별",
      "MBTI",
      "010-3156-8568",
      "support@dvem.ai",
    ];

    for (const marker of requiredMarkers) {
      expect(productPageSources).toContain(marker);
    }
  });

  it("does not expose old discount or unavailable product language", () => {
    const blockedMarkers = [
      "990원",
      "런칭가",
      "할인가",
      "확장 예정",
      "준비 중",
      "미리보기",
      "coming_soon",
      "isPurchasable: false",
      "href: null",
    ];

    for (const marker of blockedMarkers) {
      expect(productPageSources).not.toContain(marker);
    }
  });
});
