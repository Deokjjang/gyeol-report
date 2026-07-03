import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../../../src/app/page";

describe("home page product source", () => {
  it("shows the active product and purchase path", () => {
    const html = renderToStaticMarkup(Home());
    const requiredMarkers = [
      "결리포트",
      "명리 기반 프리미엄 디지털 리포트",
      "결리포트 상품군",
      "사주×MBTI 종합 리포트",
      "직업·커리어·돈·학업 리포트",
      "연애·결혼·자녀 리포트",
      "대운 리포트",
      "세운 리포트",
      "궁합 리포트",
      "구매 가능",
      "비활성",
      "출시 준비 중",
      "리빌딩 중",
      "런칭가",
      "990원",
      "정가",
      "1,290원",
      "결제 후 온라인 열람",
      "자동 생성 디지털 리포트",
      "사람 상담이 아닌 자동 생성 리포트",
      "990원 결제하고 리포트 생성하기",
      "/report/new",
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
    ];

    for (const marker of blockedMarkers) {
      expect(html).not.toContain(marker);
    }
  });
});
