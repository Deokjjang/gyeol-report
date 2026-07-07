import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ReportShareActions from "../../../src/components/report/ReportShareActions";

describe("ReportShareActions", () => {
  it("renders share and reentry CTAs without payment wording", () => {
    const html = renderToStaticMarkup(
      <ReportShareActions productSlug="saju-mbti-full" />,
    );

    expect(html).toContain("리포트 공유하기");
    expect(html).toContain("나도 내 리포트 보기");
    expect(html).toContain("다른 리포트 보기");
    expect(html).toContain('href="/report/new?product=saju-mbti-full"');
    expect(html).toContain('href="/"');
    expect(html).not.toContain("구매하기");
    expect(html).not.toContain("결제하기");
  });
});
