import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import GyeolBrandHeader from "../../../src/components/brand/GyeolBrandHeader";

describe("GyeolBrandHeader", () => {
  it("renders the Korean brand with the small English lockup", () => {
    const html = renderToStaticMarkup(
      <GyeolBrandHeader taglineKo="사주와 MBTI를 함께 읽는 리포트" />,
    );

    expect(html).toContain("결리포트");
    expect(html).toContain("Gyeol Report");
    expect(html).toContain("사주와 MBTI를 함께 읽는 리포트");
    expect(html).toContain('href="/"');
    expect(html).not.toContain("productKey");
    expect(html).not.toContain("productSlug");
  });
});
