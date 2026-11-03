// v5 Book 본문(본문 쪽 제목·소제목·문단) 해시: 화면 정리 전후 비교용. V5_BOOKS=<스냅샷 JSON 폴더>.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { storedBook } from "../../src/lib/book/storedReport";
import { BookReader } from "../../src/app/dev/book-preview/BookReader";
const decode = (html: string) => html.replace(/<sup>[\s\S]*?<\/sup>/g, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
it("v5 body hashes", () => {
  const dir = process.env.V5_BOOKS!;
  for (const file of readdirSync(dir).filter(f => f.endsWith(".json")).sort()) {
    const book = storedBook(JSON.parse(readFileSync(join(dir, file), "utf8")))!;
    const pages = book.data.pages.filter(p => p.kind === "narrative").map(page => {
      const html = renderToStaticMarkup(createElement(BookReader, { data: book.data, page, onNote: () => {}, onShare: () => {}, onPage: () => {} }));
      return [page.title, ...(page.kind === "narrative" ? page.paragraphs.flatMap(p => p.heading ? [p.heading] : []) : []), ...[...html.matchAll(/<p data-narrative-paragraph="[^"]*">([\s\S]*?)<\/p>/g)].map(m => decode(m[1]))].join("\n");
    });
    console.log(`BODY ${file} pages=${pages.length} chars=${pages.join("").length} sha=${createHash("sha256").update(pages.join("\n\f\n")).digest("hex").slice(0, 16)}`);
  }
});
