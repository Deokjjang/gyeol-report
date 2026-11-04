/**
 * P6e-ops 9: 푸터 X·스레드 아이콘. 주소는 src/lib/legal/socialLinks.ts 상수이고, 비어 있으면(기본) 아이콘을 그리지 않는다.
 * 아이콘은 공식 로고 모양(단색 SVG). 관리자 화면에는 두 푸터 모두 붙지 않는다.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => route.pathname }));
afterEach(() => { vi.resetModules(); vi.doUnmock("../../../src/lib/legal/socialLinks"); route.pathname = "/"; });

async function withLinks(links: { instagram: string; x: string; threads: string }) {
  vi.resetModules();
  vi.doMock("../../../src/lib/legal/socialLinks", async importOriginal => ({ ...(await importOriginal<typeof import("../../../src/lib/legal/socialLinks")>()), SOCIAL_LINKS: links }));
  return (await import("../../../src/components/legal/SocialIconLinks")).default;
}

describe("푸터 소셜 아이콘", () => {
  it("기본값(주소 비어 있음)이면 X·스레드 아이콘을 숨긴다", async () => {
    const Icons = await withLinks({ instagram: "https://www.instagram.com/gyeolreport/", x: "", threads: "" });
    expect(renderToStaticMarkup(<Icons />)).toBe("");
  });
  it("주소가 있으면 공식 로고 모양 SVG와 새 탭 링크를 그린다", async () => {
    const Icons = await withLinks({ instagram: "https://www.instagram.com/gyeolreport/", x: "https://x.com/gyeolreport", threads: "https://www.threads.com/@gyeolreport" });
    const html = renderToStaticMarkup(<Icons className="c" />);
    expect(html).toContain('href="https://x.com/gyeolreport" target="_blank" rel="noopener noreferrer" aria-label="결리포트 X"');
    expect(html).toContain('href="https://www.threads.com/@gyeolreport" target="_blank" rel="noopener noreferrer" aria-label="결리포트 스레드"');
    expect(html).toContain("M18.244 2.25h3.308l-7.227 8.26");   // X 로고 경로
    expect(html).toContain("M12.186 24h-.007c-3.581-.024");       // Threads 로고 경로
    expect(html.match(/<svg/g)).toHaveLength(2);
  });
  it("한쪽만 있으면 그쪽만, https가 아니거나 형식이 틀리면 숨긴다", async () => {
    const Icons = await withLinks({ instagram: "x", x: "http://x.com/a", threads: "https://www.threads.com/@gyeolreport" });
    const html = renderToStaticMarkup(<Icons />);
    expect(html).toContain('data-social="threads"'); expect(html).not.toContain('data-social="x"');
    const Bad = await withLinks({ instagram: "x", x: "javascript:alert(1)", threads: "not a url" });
    expect(renderToStaticMarkup(<Bad />)).toBe("");
  });
  it("Book 푸터(BookFooter)도 관리자 화면에는 붙지 않고, 일반 화면에는 '채널 보기'가 없다", async () => {
    const { BookFooter } = await import("../../../src/components/book/BookLegalRoutes");
    route.pathname = "/admin/orders"; expect(renderToStaticMarkup(<BookFooter />)).toBe("");
    route.pathname = "/account";
    const html = renderToStaticMarkup(<BookFooter />);
    expect(html).toContain("<footer"); expect(html).not.toContain("채널 보기"); expect(html).toContain("카카오톡 고객 문의");
  });
});
