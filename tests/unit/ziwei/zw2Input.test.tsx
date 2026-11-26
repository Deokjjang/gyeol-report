// ZW-2 1부 화면(정적 렌더, 호출 0): 자미 「나의 열두 서가」 — 직접 주소로 입력 화면이 열리고(닫힘 안내 아님), 소개에 가격이 없고, 홈 서가에는 없다.
// 입력 상호작용(자녀 칸 · 시각 「모름」 막음 · 결제 단계 「준비 중」)은 4부 브라우저 확인(_raw/screens)에서 본다.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const nav = vi.hoisted(() => ({ product: "ziwei-full" }));
vi.mock("next/navigation", () => ({ usePathname: () => "/", useSearchParams: () => new URLSearchParams(`product=${nav.product}`), useRouter: () => ({ push: () => {}, replace: () => {} }) }));
vi.mock("../../../src/components/book/useSalesPaused", () => ({ useSalesPaused: () => null }));
import { BookShelf } from "../../../src/components/book/BookShelf";
import { BookInput, FortuneIntro } from "../../../src/components/book/BookInput";
import { ZIWEI_BOOK, ZIWEI_COVER_LINE } from "../../../src/lib/book/product";

describe("ZW-2 자미 입력 화면", () => {
  it("소개: 이름 · 표지 문구만, 가격 없음", () => {
    const html = renderToStaticMarkup(createElement(FortuneIntro, { book: ZIWEI_BOOK, withPrice: true }));
    expect(html).toContain("나의 열두 서가");
    expect(html).toContain(ZIWEI_COVER_LINE);
    expect(html).not.toMatch(/\d,?\d{3}원/);
  });
  it("직접 주소: 닫힘 안내가 아니라 입력 화면(대운 · 세운이 닫힌 때도)", () => {
    nav.product = "ziwei-full";
    const html = renderToStaticMarkup(createElement(BookInput, { internal: false, now: "2026-11-26T03:00:00.000Z", closed: ["major_fortune", "annual_fortune"] }));
    expect(html).toContain("data-book-input");
    expect(html).not.toContain("data-sales-closed");
    expect(html).toContain(ZIWEI_BOOK.color);
  });
  it("홈 서가에는 없다", () => {
    const html = renderToStaticMarkup(createElement(BookShelf, { inputPath: "/report/new", year: 2027, closed: [] }));
    expect(html).not.toContain("열두 서가");
    expect(html).not.toContain("ziwei");
  });
});
