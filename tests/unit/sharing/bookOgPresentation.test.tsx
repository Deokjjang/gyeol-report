import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { renderBookOg, ogFontText } from "../../../src/lib/book/bookOg";
import { projectBookShare, bookKakaoCard } from "../../../src/lib/book/shareModel";
import { BOOKS } from "../../../src/lib/book/product";

describe("Book OG public presentation edge names", () => {
  it.each(["김아름다운하늘빛고운별꽃사랑가나다라마바사", "  김 하늘 & 별 · (봄)  "])("renders sanitized name %s without remote glyph fallback", async names => {
    const model = projectBookShare({ productType: "saju_mbti_compatibility", names })!;
    expect(Array.from(model.displayName).length).toBeLessThanOrEqual(20);
    expect(ogFontText(model.displayName)).not.toContain("□");
    const png = Buffer.from(await (await renderBookOg(model)).arrayBuffer());
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
    if (process.env.BOOK_SHARE_REVIEW_EXPORT) writeFileSync(`${process.env.BOOK_SHARE_REVIEW_EXPORT}/og-name-${names.includes('&') ? 'special' : 'long'}.png`, png);
  });
  it("brand glyphs are covered; six cover identities and personalized Kakao titles stay distinct", () => {
    expect(ogFontText("타고난 결을 읽고, 삶의 이야기를 펼치다. GYEOL REPORT PERSONAL EDITION")).not.toContain("□");
    const models = BOOKS.map(book => projectBookShare({ productType: book.productKey, names: "한서진", selectedYear: "2027" })!);
    expect(new Set(models.map(m => m.coverColor)).size).toBe(6);
    expect(models.map(m => m.issueNumber)).toEqual(["01", "02", "03", "04", "05", "06"]);
    expect(models.at(-1)?.bookTitle).toBe("나의 2027");
    for (const model of models) expect(bookKakaoCard(model).content.title).toBe("한서진님의 책이 도착했습니다.");
  });
});
