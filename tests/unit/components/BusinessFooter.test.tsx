import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BusinessFooter from "../../../src/components/legal/BusinessFooter";
const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
beforeEach(() => { route.pathname = "/"; });

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
      "support@gyeolreport.com",
      "전화 상담은 제공하지 않습니다.",
      "고객 문의는 카카오톡 채널 채팅으로 받고 있습니다.",
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

  it.each(["/reports/example", "/reports/example/", "/r/share-token"])("hides footer at paid reading route %s during SSR", pathname => {
    route.pathname = pathname;
    expect(renderToStaticMarkup(<BusinessFooter />)).toBe("");
  });
  it.each(["/", "/products/major-fortune", "/checkout", "/payment/success", "/terms", "/privacy", "/reports"])("retains footer on general route %s", pathname => {
    route.pathname = pathname;
    expect(renderToStaticMarkup(<BusinessFooter />)).toContain("<footer");
  });
  it("uses secure plain external links and makes Kakao chat the primary contact", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);
    for (const href of ["https://www.instagram.com/gyeolreport/", "http://pf.kakao.com/_sbHaX/chat", "http://pf.kakao.com/_sbHaX"]) {
      expect(html).toContain(`href="${href}" target="_blank" rel="noopener noreferrer"`);
    }
    expect(html.match(/href="http:\/\/pf.kakao.com\/_sbHaX\/chat"/g)).toHaveLength(2);
    expect(html).toContain("채팅하기"); expect(html).not.toContain("support@dvem.ai");
    expect(html).not.toContain("<script");
  });
});
