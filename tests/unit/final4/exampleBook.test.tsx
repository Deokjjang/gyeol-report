/**
 * 최종 A 15: 공개 예시 리포트(/example) — 가상의 인물 서하은 종합 책 저장본 앞 2장, 실제 사람 정보 0, 기존 책 화면 그대로.
 * 상품 카드(책장 표지) 분량 — 종합 13장, 나머지 9장, 「약 N천 자」(v5 저장본 평균 천 단위 내림).
 */
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { EXAMPLE_BOOK, EXAMPLE_CTA, EXAMPLE_TAG, exampleLeaks, OTHER_TEST_NAMES } from "../../../src/lib/book/example";
import { BookReading } from "../../../src/components/book/BookReading";
import { projectBookShare } from "../../../src/lib/book/shareModel";
import { aboutChars, BOOK_CHAPTER_COUNT, bookLengthParts } from "../../../src/lib/book/bookLength";
import lengths from "../../../src/data/example/book-lengths.json";
import { Cover } from "../../../src/app/dev/book-preview/BookPages";
import { BOOKS } from "../../../src/lib/book/product";

describe("예시 리포트 데이터", () => {
  const pages = EXAMPLE_BOOK.data.pages;
  it("표지·주인공·만세력·MBTI + 1·2장 + 끝 쪽만(3장 이후 없음), 목차는 남긴 쪽만 가리킨다", () => {
    expect(EXAMPLE_BOOK.source).toMatchObject({ productType: "saju_mbti_full", chapters: 2, of: 13 });
    expect(pages.map(p => p.kind)).toEqual(["cover", "contents", "input", "manse", "mbti", "narrative", "narrative", "contents", "back"]);
    expect(pages.filter(p => p.kind === "narrative").map(p => p.id)).toEqual(["core", "chapter-portrait"]);
    const toc = pages.find(p => p.kind === "contents")! as Extract<typeof pages[number], { kind: "contents" }>;
    expect(toc.entries.every(e => e.page >= 0 && e.page < pages.length)).toBe(true);
    expect(EXAMPLE_BOOK.data.names).toBe("서하은");
  });
  it("실제 사람·식별 정보 0(다른 시험 인물 이름·이메일·UUID·주문 코드·리포트 id·전화)", () => {
    const json = JSON.stringify(EXAMPLE_BOOK);
    expect(exampleLeaks(json)).toEqual([]);
    for (const n of OTHER_TEST_NAMES) expect(json).not.toContain(n);
    expect(json).not.toMatch(/"raw"|briefHash|priorBooks|evidencePacket|consentEvidence/);
    // 검사 자체가 잡는지(거짓 통과 방지)
    expect(exampleLeaks("장덕민 a@b.co report_" + "0".repeat(32) + " GR-ABCD 010-1234-5678")).toEqual(["장덕민", "email", "reportId", "orderCode", "phone"]);
  });
  it("기존 책 화면(BookReading)으로 그대로 — 맨 위 작은 회색 「예시 · 가상의 인물」, 실제 정보 0", () => {
    const share = projectBookShare({ productType: "saju_mbti_full", names: EXAMPLE_BOOK.data.names })!;
    const html = renderToStaticMarkup(<BookReading data={EXAMPLE_BOOK.data} today={EXAMPLE_BOOK.today} edition={EXAMPLE_BOOK.edition} share={share} home="/" example={{ tag: EXAMPLE_TAG, cta: EXAMPLE_CTA }} />);
    expect(html).toContain("data-example-page");
    expect(html).toMatch(/data-example-tag[^>]*>예시 · 가상의 인물</);
    expect(html).toContain("data-book-report");
    expect(exampleLeaks(html)).toEqual([]);
    expect(EXAMPLE_CTA).toEqual({ label: "내 리포트 만들기", href: "/" });
  });
  it("공유 미리보기(og 제목·이미지)", async () => {
    const { metadata } = await import("../../../src/app/example/page");
    expect(metadata.openGraph).toMatchObject({ title: expect.stringContaining("예시"), url: "https://gyeolreport.com/example", images: [{ url: "https://gyeolreport.com/example/og", width: 1200, height: 630 }] });
    expect(JSON.stringify(metadata)).not.toMatch(/보상/);
  });
});

describe("상품 카드 분량", () => {
  it("종합 13장, 나머지 9장 · 글자 수는 저장본 평균의 천 단위 내림", () => {
    expect(BOOK_CHAPTER_COUNT).toEqual({ saju_mbti_full: 13, career_money_study: 9, love_marriage_child: 9, saju_mbti_compatibility: 9 });
    for (const [k, v] of Object.entries(lengths.products)) {
      // 표시는 v5 저장본 전체 평균(allV5)의 천 단위 내림(최신판만의 평균보다 작거나 같다 — 과장 금지).
      expect(v.allV5.thousands).toBe(Math.floor(v.allV5.avgChars / 1000));
      expect(v.allV5.books).toBeGreaterThan(0);
      expect(v.allV5.thousands).toBeLessThanOrEqual(v.thousands);
      expect(bookLengthParts(k)).toEqual({ chapters: `${BOOK_CHAPTER_COUNT[k]}장`, chars: aboutChars(v.allV5.thousands) });
    }
    expect([aboutChars(12), aboutChars(10), aboutChars(9)]).toEqual(["약 1만 2천 자", "약 1만 자", "약 9천 자"]);
    expect(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"].map(k => bookLengthParts(k)!.chars)).toEqual(["약 1만 자", "약 9천 자", "약 9천 자", "약 8천 자"]);
    expect(bookLengthParts("major_fortune")).toBeNull(); expect(bookLengthParts("annual_fortune")).toBeNull();
  });
  it("책장 표지(이름 없음)에 분량, 독자 표지(이름 있음)는 그대로", () => {
    const full = BOOKS.find(b => b.productKey === "saju_mbti_full")!, major = BOOKS.find(b => b.productKey === "major_fortune")!;
    const shelf = renderToStaticMarkup(<Cover book={full} />).replace(/<[^>]+>/g, " ");
    expect(shelf).toContain("13장"); expect(shelf).toContain(bookLengthParts("saju_mbti_full")!.chars);
    expect(renderToStaticMarkup(<Cover book={full} name="서하은" />)).toContain("서하은의 책");
    expect(renderToStaticMarkup(<Cover book={major} />)).toContain("한 사람, 한 권.");
  });
});
