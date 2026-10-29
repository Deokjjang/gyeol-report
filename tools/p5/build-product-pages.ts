/**
 * 입력 첫 쪽의 상품 소개(무엇을 알게 되는지 3줄 + 목차 미리보기, P5). 목차는 지식 DB product-narratives의 장 제목(읽기만).
 *   pnpm exec tsx tools/p5/build-product-pages.ts → src/data/book-pages/products.json
 * 가격은 넣지 않는다(가격은 주문서에서만).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const LINES: Record<string, [string, string, string]> = {
  saju_mbti_full: ["타고난 사주와 MBTI가 같은 이야기를 하는 지점", "일·돈·사랑·사람에서 내가 잘되는 방식과 반복하는 실수", "지금의 흐름과 오늘부터 써 볼 방법"],
  career_money_study: ["잘 맞는 직업과 역할, 지금 하는 일과의 궁합", "돈을 벌고 모으고 쓰는 나만의 방식", "공부·자격 전략과 힘이 붙는 시기"],
  love_marriage_child: ["사랑할 때의 나, 끌리는 사람과 그 이유", "표현·다툼·회복에서 내가 쓰는 방식", "함께 살게 되거나 부모가 된다면 보이는 모습"],
  saju_mbti_compatibility: ["두 사람이 서로에게 주는 기운과 잘 맞는 판", "같은 장면을 서로 다르게 느끼는 순간", "둘이 먼저 맞춰 볼 한 가지"],
  major_fortune: ["지나온 3년과 지금 대운이 주는 조건", "앞으로 10년의 연도별 흐름과 바뀌는 해", "흐름을 타는 나만의 방법"],
  annual_fortune: ["올해의 기운이 내 원국과 만나는 방식", "절기로 나눈 열두 달의 흐름과 눈여겨볼 달", "올해를 내 방식으로 쓰는 방법"],
};
const d = JSON.parse(readFileSync(join(ROOT, "src/data/knowledge-v5/product-narratives.json"), "utf8")) as { products: { productKey: string; chapters: { title: string }[] }[] };
const products = Object.fromEntries(d.products.map(p => [p.productKey, { lines: LINES[p.productKey], toc: p.chapters.map(c => c.title.replace(/^A가 보는 B$/, "내가 보는 상대").replace(/^B가 보는 A$/, "상대가 보는 나")) }]));
writeFileSync(join(ROOT, "src/data/book-pages/products.json"), JSON.stringify({ version: "book-products-1", source: "knowledge-v5/product-narratives chapters[].title", products }, null, 1) + "\n");
console.log(Object.entries(products).map(([k, v]) => `${k}: ${v.toc.length}장`).join(", "));
