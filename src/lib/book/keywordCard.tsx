import "server-only";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { ogFontText } from "./bookOg";
import { BOOK_SHARE_HEADERS } from "./shareServer";

let font: Promise<Buffer> | undefined;
/**
 * AM 2부 세운 키워드 공유 카드(서버 이미지 1080×1350): 흰 바탕, 「결리포트 / GYEOL REPORT」, Noto Sans KR(700 서브셋, 한글 전체).
 * 「나의 2027」 + 키워드 3개 + 한 줄. 이름은 선택(기본 끔). 생년월일·사주 원문은 넣지 않는다.
 */
export async function renderKeywordCard(c: { year: number; keywords: readonly string[]; line: string; name?: string | null }) {
  font ??= readFile(`${process.cwd()}/src/lib/book/fonts/NotoSansKR-Book.woff`);
  const kw = c.keywords.slice(0, 3).map(ogFontText), line = ogFontText(c.line.slice(0, 40)), name = c.name ? ogFontText(c.name.slice(0, 12)) : "";
  return new ImageResponse(<div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#ffffff", color: "#111111", fontFamily: "Book", padding: "96px 92px", justifyContent: "space-between" }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", fontSize: 34, letterSpacing: -1 }}>결리포트</div>
      <div style={{ display: "flex", fontSize: 20, letterSpacing: 6, color: "#666666" }}>GYEOL REPORT</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
      <div style={{ display: "flex", fontSize: 54, letterSpacing: -2, color: "#444444" }}>{name ? `${name}의 ${c.year}` : `나의 ${c.year}`}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>{kw.map((w, i) => <div key={i} style={{ display: "flex", fontSize: 104, letterSpacing: -4, lineHeight: 1.12 }}>{w}</div>)}</div>
      <div style={{ display: "flex", width: 120, height: 6, background: "#111111" }} />
      <div style={{ display: "flex", fontSize: 40, lineHeight: 1.5, letterSpacing: -1, flexWrap: "wrap" }}>{line}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#888888", letterSpacing: 2 }}><span>{`${c.year} 신년판`}</span><span>gyeolreport.com</span></div>
  </div>, { width: 1080, height: 1350, fonts: [{ name: "Book", data: await font, weight: 700, style: "normal" }], headers: BOOK_SHARE_HEADERS });
}
