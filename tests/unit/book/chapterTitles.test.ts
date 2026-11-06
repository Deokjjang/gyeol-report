// 운영 Q 9부: 결제 전 「이 책의 차례」 제목 상수(src/lib/book/product.ts)가 작가 장 목록(product-narratives.json)과 같다.
// 화면 묶음에는 JSON을 넣지 않는다(상수만) — 그래서 JSON이 바뀌면 이 시험이 먼저 알려 준다.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { BOOK_CHAPTER_TITLES } from "@/lib/book/product";
import { ALL_PRODUCTS, productOnSale } from "@/lib/ops/config";

type Narratives = { products: { productKey: string; chapters: { title: string }[] }[] };
const narratives = JSON.parse(readFileSync("src/data/knowledge-v5/product-narratives.json", "utf8")) as Narratives;
const ON_SALE = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const;

describe("주문서 「이 책의 차례」 제목", () => {
  it("판매 중인 4종(기본 설정)만, 장 수는 13·9·9·9", () => {
    expect(ALL_PRODUCTS.filter(p => productOnSale(p, {}))).toEqual([...ON_SALE]);
    expect(Object.keys(BOOK_CHAPTER_TITLES).sort()).toEqual([...ON_SALE].sort());
    expect(ON_SALE.map(p => BOOK_CHAPTER_TITLES[p]!.length)).toEqual([13, 9, 9, 9]);
  });
  it.each(ON_SALE)("%s: product-narratives.json의 장 title과 순서까지 같다", product => {
    const source = narratives.products.find(p => p.productKey === product);
    expect(source).toBeDefined();
    expect(BOOK_CHAPTER_TITLES[product]).toEqual(source!.chapters.map(c => c.title));
  });
  it("주문서·상품 상수 파일은 큰 JSON을 불러오지 않는다", () => {
    for (const file of ["src/lib/book/product.ts", "src/components/book/BookCheckout.tsx"]) expect(readFileSync(file, "utf8")).not.toMatch(/(?:import|require)[^;\n]*knowledge-v5/);
  });
});
