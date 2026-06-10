import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../../../src/app/page";

describe("home page product source", () => {
  it("shows the active product and purchase path", () => {
    const html = renderToStaticMarkup(Home());
    const requiredMarkers = [
      "결리포트",
      "사주와 MBTI를 함께 보는 자기이해 리포트",
      "현재 구매 가능한 리포트",
      "사주×MBTI 전체 리포트",
      "정가 1,290원",
      "런칭가 990원",
      "곧 추가될 리포트",
      "2026 하반기 운세",
      "궁합 리포트",
      "준비 중",
      "런칭가 990원",
      "/products",
      "/products/saju-mbti-full",
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
    ];

    for (const marker of blockedMarkers) {
      expect(html).not.toContain(marker);
    }
  });
});
