import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import Home from "../../../src/app/page";

describe("home page product source", () => {
  it("shows the active product and purchase path", () => {
    const html = renderToStaticMarkup(Home());
    const requiredMarkers = [
      "사주×MBTI 전체 리포트",
      "1,290원",
      "/products/saju-mbti-full",
      "/report/new",
    ];

    for (const marker of requiredMarkers) {
      expect(html).toContain(marker);
    }
  });
});
