import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { storedBook } from "../../../src/lib/book/storedReport";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";

// P6b-ui 화면 정리 전후로 저장된 Book 본문(장 제목·소제목·본문 문단)이 바뀌지 않는지. 운영 버전 조합 9종 중
// Book 렌더러로 여는 v4 5종은 본문 쪽을 렌더해 정리 전 기준(body-text.json)과 비교한다. 쪽 번호·앞부분 쪽은 비교하지 않는다.
// 레거시 v1·1.0·v2 4종은 Book 렌더러가 아니라 기존 결과 화면이 연다(storedBook null).
// 기준 갱신은 정리 전 코드에서만: UPDATE_BODY_BASELINE=1 pnpm exec vitest run tests/unit/app/bookBodySameness.test.tsx
const COMBOS = [
  ["annual_fortune", "v4"], ["career_money_study", "v1"], ["career_money_study", "v4"], ["love_marriage_child", "v4"],
  ["major_fortune", "v4"], ["saju_mbti_compatibility", "1.0"], ["saju_mbti_compatibility", "v4"], ["saju_mbti_full", "v2"], ["saju_mbti_full", "v4"],
] as const;
const BASELINE = "tests/fixtures/production-version-combos/body-text.json";
const load = (product: string, version: string): Record<string, unknown> =>
  JSON.parse(gunzipSync(readFileSync(`tests/fixtures/production-version-combos/${product}-${version}.json.gz`)).toString("utf8"));
const decode = (html: string) => html.replace(/<sup>[\s\S]*?<\/sup>/g, "").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#x27;/g, "'").replace(/\s+/g, " ").trim();

/** 본문 쪽마다 장 제목·소제목·본문 문단. */
function bodyText(snapshot: Record<string, unknown>) {
  const book = storedBook(snapshot);
  if (!book) return null;
  return book.data.pages.filter(page => page.kind === "narrative").map(page => {
    const html = renderToStaticMarkup(<BookReader data={book.data} page={page} onNote={() => {}} onShare={() => {}} onPage={() => {}} />);
    const paragraphs = [...html.matchAll(/<p data-narrative-paragraph="[^"]*">([\s\S]*?)<\/p>/g)].map(m => decode(m[1]));
    const headings = page.kind === "narrative" ? page.paragraphs.flatMap(p => p.heading ? [p.heading] : []) : [];
    return [page.title, ...headings, ...paragraphs].join("\n");
  });
}

describe("stored Book body sameness", () => {
  const current: Record<string, { pages: number; sha256: string; chars: number } | null> = {};
  it.each(COMBOS)("%s %s keeps body text", (product, version) => {
    const pages = bodyText(load(product, version));
    const key = `${product}-${version}`;
    current[key] = pages && { pages: pages.length, sha256: createHash("sha256").update(pages.join("\n\f\n")).digest("hex"), chars: pages.join("").length };
    if (version === "v4") expect(pages?.length).toBeGreaterThan(3); else expect(pages).toBeNull();
    if (process.env.UPDATE_BODY_BASELINE) return;
    const baseline = JSON.parse(readFileSync(BASELINE, "utf8")) as Record<string, unknown>;
    expect(current[key]).toEqual(baseline[key]);
  });
  it("writes the baseline only when asked", () => {
    if (process.env.UPDATE_BODY_BASELINE) writeFileSync(BASELINE, JSON.stringify(current, null, 1) + "\n");
    expect(existsSync(BASELINE)).toBe(true);
  });
});
