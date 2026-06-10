import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import BusinessFooter from "../../../src/components/legal/BusinessFooter";

describe("BusinessFooter", () => {
  it("renders required business information", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);

    const expectedText = [
      "결리포트",
      "상호명",
      "DVEM",
      "대표자",
      "장덕민",
      "사업자등록번호",
      "184-27-02002",
      "통신판매업 신고번호",
      "신고 진행 중",
      "사업장 주소",
      "인천광역시 연수구 인천타워대로 185, 10층 1001호 V206",
      "고객지원",
      "support@dvem.ai",
      "공식 문의",
      "official@dvem.ai",
    ];

    for (const text of expectedText) {
      expect(html).toContain(text);
    }
  });

  it("renders policy links", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);
    const expectedLinks = [
      "/legal/business-info",
      "/legal/terms",
      "/legal/privacy",
      "/legal/refund",
    ];

    for (const link of expectedLinks) {
      expect(html).toContain(`href="${link}"`);
    }
  });
});
