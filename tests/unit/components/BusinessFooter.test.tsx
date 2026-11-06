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
  it.each(["/admin/orders", "/admin/orders/GR-ABCD", "/admin"])("관리자 화면 %s에는 고객용 푸터를 붙이지 않는다", pathname => {
    route.pathname = pathname;
    expect(renderToStaticMarkup(<BusinessFooter />)).toBe("");
  });
  it.each(["/", "/products/major-fortune", "/checkout", "/payment/success", "/terms", "/privacy", "/reports"])("retains footer on general route %s", pathname => {
    route.pathname = pathname;
    expect(renderToStaticMarkup(<BusinessFooter />)).toContain("<footer");
  });
  it("uses secure plain external links and makes Kakao chat the primary contact", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);
    for (const href of ["https://www.instagram.com/gyeolreport/", "http://pf.kakao.com/_sbHaX/chat"]) {
      expect(html).toContain(`href="${href}" target="_blank" rel="noopener noreferrer"`);
    }
    // P6e-ops 9: "채널 보기"(채널 홈 링크)는 삭제 — 문의는 채팅 링크만 남긴다.
    expect(html).not.toContain("채널 보기"); expect(html).not.toContain('href="http://pf.kakao.com/_sbHaX"');
    expect(html.match(/href="http:\/\/pf.kakao.com\/_sbHaX\/chat"/g)).toHaveLength(2);
    expect(html).toContain("채팅하기"); expect(html).not.toContain("support@dvem.ai");
    expect(html).not.toContain("<script");
  });
  // v5 최종 2-2: 인스타그램 · 카카오톡 · X · 스레드 순서, 같은 누름 영역·간격, 새 탭(noopener), 낭독 이름.
  it("소셜 아이콘은 인스타그램·카카오톡·X·스레드 순서로 같은 크기·간격이다", () => {
    const html = renderToStaticMarkup(<BusinessFooter />);
    const order = ["결리포트 Instagram", "카카오톡 고객 문의", "결리포트 X", "결리포트 스레드"].map(label => html.indexOf(`aria-label="${label}"`));
    expect(order.every(i => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    for (const [href, label] of [["https://x.com/gyeolreport", "결리포트 X"], ["https://www.threads.com/@gyeolreport", "결리포트 스레드"]]) {
      expect(html).toContain(`href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label}"`);
    }
    // 네 아이콘 링크가 같은 클래스(44px 원형 누름 영역)를 쓰고, 아이콘 그림 크기는 인스타그램과 같다(21px).
    const iconLinks = html.match(/<a [^>]*class="inline-flex size-11 items-center justify-center rounded-full[^"]*"/g) ?? [];
    expect(iconLinks).toHaveLength(4);
    expect(html.match(/<svg aria-hidden="true" width="21" height="21"/g)).toHaveLength(3);
    expect(html).not.toContain("채널 보기");
  });
});
