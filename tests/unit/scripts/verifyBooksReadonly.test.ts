import { describe, expect, it } from "vitest";
import { classify, classifyBookData, visibleText, MIN_VISIBLE_TEXT } from "../../../scripts/verify-books-readonly";

const page = (body: string) => `<!DOCTYPE html><html><head><title>결리포트</title><script>self.__next_f.push([1,"x"])</script></head><body>${body}</body></html>`;
const longText = "당신은 사람을 편하게 만드는 힘이 있습니다. ".repeat(12);

describe("verify-books-readonly classify (no network)", () => {
  it("passes a report page with enough visible text and ignores head/script text", () => {
    expect(visibleText(page("<p>가&amp;나</p>"))).toBe("가&나");
    const verdict = classify(page(`<main><h1>종합 리포트</h1><p>${longText}</p></main>`), 200);
    expect(verdict).toMatchObject({ ok: true, kind: "report" });
  });

  it("fails non-200, empty, short and Next.js error pages", () => {
    expect(classify(page(`<p>${longText}</p>`), 500)).toMatchObject({ ok: false, reason: "HTTP 500" });
    expect(classify("", 200)).toMatchObject({ ok: false, reason: "빈 응답" });
    expect(classify(page("<p>짧다</p>"), 200).reason).toContain(`${MIN_VISIBLE_TEXT}자`);
    expect(classify(page(`<h2>Application error: a server-side exception has occurred</h2><p>${longText}</p>`), 200).ok).toBe(false);
    expect(classify(`<html id="__next_error__"><body>${longText}</body></html>`, 200).ok).toBe(false);
    expect(classify(page(`<p>${longText}</p><script>self.__next_f.push([1,"{\\"digest\\":\\"123\\"}"])</script>`), 200).ok).toBe(false);
  });

  it("fails the product's unavailable, attention and expired screens", () => {
    for (const title of ["리포트를 열 수 없습니다", "리포트 준비에 확인이 필요합니다", "리포트 열람 기간이 종료되었습니다", "리포트를 불러오지 못했습니다."]) {
      expect(classify(page(`<main><h1>${title}</h1><p>${longText}</p></main>`), 200)).toMatchObject({ ok: false, kind: "error" });
    }
  });

  it("marks the shared Book cover as book-entry and checks book-data separately", () => {
    const entry = page(`<main><h1>민지의 종합 리포트</h1><button aria-label="민지의 종합 리포트 펼치기"></button><p>책 펼치기 ↗</p></main>`);
    expect(classify(entry, 200)).toMatchObject({ ok: true, kind: "book-entry" });
    const pages = [{ kind: "narrative", title: "1장", paragraphs: [{ text: longText }], notes: [] }];
    expect(classifyBookData(JSON.stringify({ data: { pages }, share: {} }), 200)).toMatchObject({ ok: true });
    expect(classifyBookData("{}", 404)).toMatchObject({ ok: false, reason: "book-data HTTP 404" });
    expect(classifyBookData(JSON.stringify({ data: { pages: [] } }), 200).ok).toBe(false);
    expect(classifyBookData("<html>", 200).ok).toBe(false);
  });
});
