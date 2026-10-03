import "server-only";
import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { bookForProduct } from "./product";
import type { BookShareModel } from "./shareModel";
import { BOOK_SHARE_HEADERS } from "./shareServer";
import coverage from "./fonts/coverage.json";

let font: Promise<Buffer> | undefined;
// Missing rare glyphs become a visible box instead of triggering Next OG's remote fallback.
export const ogFontText = (text: string) => Array.from(text).map(c => coverage.some(([a, b]) => c.codePointAt(0)! >= a && c.codePointAt(0)! <= b) ? c : "□").join("");
export async function renderBookOg(model: BookShareModel) {
  font ??= readFile(`${process.cwd()}/src/lib/book/fonts/NotoSansKR-Book.woff`);
  const book = bookForProduct(model.productType)!;
  const title = book.id === "annual" ? model.bookTitle.replace(" ", "\n") : book.title;
  const lines = title.split("\n"), name = ogFontText(model.displayName);
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f5f2", color: "#111", fontFamily: "Book", padding: "55px 90px", alignItems: "center", gap: 100 }}>
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0, width: 365, height: 520, background: book.color, color: book.ink, padding: "34px 32px", borderLeft: "8px solid #0002", boxShadow: "12px 14px 22px #0002" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}><span>GYEOL REPORT</span><span>{model.issueNumber}</span></div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 51, letterSpacing: -2, lineHeight: 1.18 }}>{lines.map((line, i) => <div key={i}>{line}</div>)}</div>
      <div style={{ display: "flex", fontSize: name.length > 12 ? 18 : 23, lineHeight: 1.5, flexWrap: "wrap", wordBreak: "break-all" }}>{name || "PERSONAL EDITION"}</div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", width: 540, gap: 36 }}>
      <div style={{ display: "flex", fontSize: 18, letterSpacing: 3 }}>GYEOL REPORT {model.issueNumber}</div>
      <div style={{ display: "flex", flexDirection: "column", fontSize: 64, lineHeight: 1.17, letterSpacing: -3 }}>{lines.map((line, i) => <div key={i}>{line}</div>)}</div>
      <div style={{ display: "flex", fontSize: name.length > 12 ? 23 : 28, lineHeight: 1.5, wordBreak: "break-all" }}>{name}</div>
    </div>
  </div>, { width: 1200, height: 630, fonts: [{ name: "Book", data: await font, weight: 700, style: "normal" }], headers: BOOK_SHARE_HEADERS });
}
