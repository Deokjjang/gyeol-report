import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readableBookText, readableBookTime, readableSajuText } from "../../../src/lib/book/readerCopy";
import { heavenlyStemDisplays, earthlyBranchDisplays } from "../../../src/lib/report-tables/displayDictionaries";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import type { BookData, BookPage } from "../../../src/app/dev/book-preview/bookTypes";

describe("recognized Book display tokens leave the source immutable", () => {
  it("all sixty valid pillars and individual dictionary characters have readings", () => {
    const stems = Object.entries(heavenlyStemDisplays), branches = Object.entries(earthlyBranchDisplays);
    for (let i = 0; i < 60; i++) {
      const [stem, s] = stems[i % 10], [branch, b] = branches[i % 12];
      expect(readableSajuText(`${stem}${branch}`)).toBe(`${s.ko}${b.ko}(${stem}${branch})`);
    }
    for (const [key, value] of [...stems, ...branches]) expect(readableSajuText(key)).toBe(`${value.ko}(${key})`);
  });
  it.each(["戊辰", "癸卯", "丙午", "辛丑"])("%s is idempotent", value => {
    const shown = readableSajuText(value);
    expect(readableSajuText(shown)).toBe(shown);
  });
  it("uses the verified Hangul reading for attached particles, including the ㄹ exception", () => {
    expect(readableSajuText("己丑로 바뀝니다. 乙으로 움직입니다.")).toBe("기축(己丑)으로 바뀝니다. 을(乙)로 움직입니다.");
    expect(readableSajuText("무진(戊辰)가 기준입니다. 癸卯은 이어집니다.")).toBe("무진(戊辰)이 기준입니다. 계묘(癸卯)는 이어집니다.");
    expect(readableSajuText("병오(丙午)을 읽고 신축(辛丑)와 연결합니다.")).toBe("병오(丙午)를 읽고 신축(辛丑)과 연결합니다.");
    expect(readableSajuText("무진(戊辰)가", ["무진(戊辰)"])).toBe("무진(戊辰)가");
  });
  it("does not guess other CJK, invalid pillars, IDs or protected names", () => {
    for (const value of ["甲丑", "甲木", "戊辰생", "source:戊辰:id", "stem_甲", "木火", "戊辰(무진)", "무진(戊辰)"]) expect(readableSajuText(value)).toBe(value);
    expect(readableSajuText("戊辰의 책 · 대운 戊辰", ["戊辰"])).toBe("戊辰의 책 · 대운 戊辰");
    expect(readableSajuText("戊辰의 책 · 대운 癸卯", ["戊辰"])).toBe("戊辰의 책 · 대운 계묘(癸卯)");
    expect(readableSajuText("(甲)라는 이름 · 대운 戊辰", ["(甲)"])).toBe("(甲)라는 이름 · 대운 무진(戊辰)");
  });
  it.each([
    ["2028-04-23T12:42:07Z", "2028년 4월 23일 21시 42분 7초"],
    ["2028-04-23T21:42:00+09:00", "2028년 4월 23일 21시 42분"],
    ["2028-04-23 21:42 KST", "2028년 4월 23일 21시 42분"],
    ["2028-04-23T21:42+09:00", "2028년 4월 23일 21시 42분"],
    ["2028-04-23Tinvalid", "2028-04-23Tinvalid"],
    ["2028-04-23", "2028년 4월 23일"],
    ["2028-02-29", "2028년 2월 29일"],
    ["2028-01-01T20:00:00Z", "2028년 1월 2일 5시 0분"],
    ["2027-02-29", "2027-02-29"],
    ["2028-02-30T12:00:00Z", "2028-02-30T12:00:00Z"],
  ])("time %s → %s", (value, expected) => expect(readableBookTime(value)).toBe(expected));
});

describe("Reader notes use one native list counter and unique valid markers", () => {
  const page: BookPage = { kind: "narrative", title: "戊辰의 해", paragraphs: [
    { text: "戊辰에서 새 장을 엽니다.", notes: [1, 1, 0, -1, 2, 1.5] },
  ], notes: [{ name: "戊辰", text: "2028-04-23 21:42 KST부터 적용합니다." }] };
  const data: BookData = { bookId: "full", title: "나라는 사람", names: "검수", people: [], context: [], pages: [page], readingDate: "2026-10-20", share: { title: "공유", description: "설명" } };
  it("renders one spaced accessible marker and preserves its explanation", () => {
    const before = JSON.stringify({ data, page });
    const html = renderToStaticMarkup(<BookReader data={data} page={page} onNote={() => {}} onPage={() => {}} onShare={() => {}} />);
    expect(html.match(/<sup>/g)).toHaveLength(1);
    expect(html).toContain('aria-label="각주 1 戊辰"');
    expect(html).toContain('엽니다. <sup>');
    expect(html).toContain('<li value="1"><div><strong>무진(戊辰)</strong> <p>');
    expect(html).not.toContain('<span>1.</span>');
    expect(html).toContain('2028년 4월 23일 21시 42분');
    expect(html).toContain('무진(戊辰)의 해</h1>');
    expect(JSON.stringify({ data, page })).toBe(before);
  });
  it("applies presentation helpers only at rendering, retaining stored text", () => {
    expect(page.kind === "narrative" && page.paragraphs[0].text).toBe("戊辰에서 새 장을 엽니다.");
    expect(readableBookText("戊辰 · 2028-04-23T12:42:00Z")).toBe("무진(戊辰) · 2028년 4월 23일 21시 42분");
  });
});
