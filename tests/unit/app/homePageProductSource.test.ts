import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../../../src/app/page";

describe("home page product source", () => {
  it("shows the active product and purchase path", () => {
    const html = renderToStaticMarkup(Home());
    const requiredMarkers = [
      "결리포트",
      "사주와 MBTI로 보는 나의 결",
      "하반기 운세",
      "종합 리포트",
      "대운 리포트",
      "세운 리포트",
      "궁합 리포트",
      "출시 준비 중",
      "990원",
      "시작하기",
      "/report/new",
    ];

    for (const marker of requiredMarkers) {
      expect(html).toContain(marker);
    }

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
      "결제금액 990원",
    ];

    for (const marker of blockedMarkers) {
      expect(html).not.toContain(marker);
    }
  });
});
