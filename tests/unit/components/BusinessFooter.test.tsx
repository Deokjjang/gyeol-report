import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BusinessFooter from "../../../src/components/legal/BusinessFooter";

describe("BusinessFooter", () => {
  it("renders compact required business information", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);

    const expectedText = [
      "결리포트",
      "상호명",
      "DVEM",
      "대표",
      "장덕민",
      "사업자등록번호",
      "184-27-02002",
      "통신판매업 신고번호",
      "신고 진행 중",
      "고객센터",
      "010-3156-8568",
    ];

    for (const text of expectedText) {
      expect(html).toContain(text);
    }

    const hiddenDetailText = [
      "과세" + "유형",
      "일반" + "과세자",
      "개인정보보호 " + "책임자",
      "호스팅 " + "제공자",
      "Vercel " + "Inc.",
      "사업장 " + "주소",
      "official" + "@dvem.ai",
      "support" + "@dvem.ai",
    ];

    for (const text of hiddenDetailText) {
      expect(html).not.toContain(text);
    }
  });

  it("renders policy links", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);
    const expectedLinks = [
      "/legal/business-info",
      "/legal/terms",
      "/legal/privacy",
      "/legal/refund",
      "사업자 정보",
      "이용약관",
      "개인정보처리방침",
      "환불/취소 정책",
    ];

    for (const value of expectedLinks) {
      expect(html).toContain(value);
    }
  });
});
