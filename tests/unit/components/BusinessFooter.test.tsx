import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BusinessFooter from "../../../src/components/legal/BusinessFooter";

describe("BusinessFooter", () => {
  it("renders compact required business information", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);

    const expectedText = [
      "결리포트",
      "DVEM",
      "대표",
      "장덕민",
      "사업자등록번호",
      "184-27-02002",
      "통신판매업 신고번호",
      "2026-인천연수구-2118",
      "인천광역시 연수구 인천타워대로 185, 10층 1001호 V206",
      "고객센터",
      "050-6664-8562",
      "support@dvem.ai",
      "전화 상담은 제공하지 않습니다. 문의는 support@dvem.ai로 보내주세요.",
    ];

    for (const text of expectedText) {
      expect(html).toContain(text);
    }

    const hiddenDetailText = [
      "시행일",
      "호스팅 제공자",
      "Vercel Inc.",
      "과세" + "유형",
      "일반" + "과세자",
      "개인정보보호 " + "책임자",
      "official" + "@dvem.ai",
    ];

    for (const text of hiddenDetailText) {
      expect(html).not.toContain(text);
    }
  });

  it("renders policy links", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);
    const expectedLinks = [
      "/terms",
      "/privacy",
      "/refund",
      "/business",
      "이용약관",
      "개인정보처리방침",
      "환불정책",
      "사업자정보",
    ];

    for (const value of expectedLinks) {
      expect(html).toContain(value);
    }
  });
});
