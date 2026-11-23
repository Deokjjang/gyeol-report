import type { ReportProductKey, ReportProductSlug } from "../report-generation/reportInputTypes";

// Shared presentation identity. Prices and purchase eligibility live in the
// existing payment catalog, never here.
export const BOOKS = [
  { id: "full", productKey: "saju_mbti_full", slug: "saju-mbti-full", title: "나라는\n사람", color: "#F5D43B", ink: "#111111", issue: "01" },
  { id: "career", productKey: "career_money_study", slug: "career-money-study", title: "내가\n잘되는 방식", color: "#176346", ink: "#FFFFFF", issue: "02" },
  { id: "love", productKey: "love_marriage_child", slug: "love-marriage-child", title: "내 사랑\n이야기", color: "#EC643B", ink: "#111111", issue: "03" },
  { id: "compatibility", productKey: "saju_mbti_compatibility", slug: "compatibility", title: "우리라는\n사이", color: "#6942A6", ink: "#FFFFFF", issue: "04" },
  { id: "major", productKey: "major_fortune", slug: "major-fortune", title: "앞으로의\n나", color: "#203754", ink: "#FFFFFF", issue: "05" },
  { id: "annual", productKey: "annual_fortune", slug: "annual-fortune", title: "나의\n한 해", color: "#CED1D4", ink: "#111111", issue: "06" },
] as const satisfies readonly { id: string; productKey: ReportProductKey; slug: ReportProductSlug; title: string; color: string; ink: string; issue: string }[];
export type Book = typeof BOOKS[number];
export function readerTitle(book: Book, year: string) {
  return book.id === "annual" ? (/^\d{4}$/.test(year) ? `나의 ${year}` : "나의 한 해") : book.title.replace("\n", " ");
}
export function bookForProduct(product: string) { return BOOKS.find(b => b.productKey === product || b.slug === product); }
/** AM2-14 4부: 세운 책 끝 · 서재 세운 카드의 대운 반값 버튼(판매가 닫혀 있으면 닫힘 문구 — 결제로 넘어가지 않는다). */
export const MAJOR_HALF_CTA = "10년으로 이어 보기 — 세운을 산 분은 대운 반값";
export const MAJOR_HALF_CTA_CLOSED = "12월 1일 공개";
/** 결제 화면 반값 줄의 머리 말. */
export const MAJOR_HALF_LINE = "세운 구매 혜택 · 반값";
/** AM2-14 1부: 세운 · 대운 책 소개 한 줄(입력 첫 쪽 · 닫힘 안내). 확정 예언 없이 책 구성만. 가격은 결제 카탈로그(reportProductCatalog)에서. */
export function fortuneIntro(productKey: string, year: number): string | null {
  if (productKey === "annual_fortune") return `1월 다리와 열두 절기월, 13개월을 달 카드로 펼치고 한 해 흐름표와 ${year}년 운을 쓰는 법을 담았어요.`;
  if (productKey === "major_fortune") return "내 인생이라는 책의 차례에서 지금 장과 다음 장을 읽고, 두 장 사이 문턱을 맞대 본 뒤 10년 영역 지도와 10년 실천 지도로 정리해요.";
  return null;
}

/**
 * 판매 중인 4종의 장 제목(운영 Q 9부) — 결제 전 주문서의 「이 책의 차례」에 그대로 보인다.
 * 원본은 src/data/knowledge-v5/product-narratives.json의 장 title(작가 장 목록, brief/chapters.ts). 그 JSON(약 70KB)을 화면 묶음에 넣지 않으려고
 * 제목만 옮겨 둔다 — tests/unit/book/chapterTitles.test.ts가 JSON과 같은지 확인한다. 궁합의 A·B는 책에서 두 사람 호칭으로 바뀐다(brief/buildBrief.ts).
 */
export const BOOK_CHAPTER_TITLES: Partial<Record<ReportProductKey, readonly string[]>> = {
  saju_mbti_full: ["나를 한 줄로", "성격: 겉과 속", "기질의 뿌리", "재능: 결과가 되는 힘", "내 안의 두 방향", "단점: 알면서 또 하는 실수", "좋은 기운과 귀인", "일과 성과", "돈의 흐름", "연애", "가족", "관계", "실행 전략"],
  career_money_study: ["일의 엔진", "지금 자리 진단", "맞는 일과 길", "나를 보여 주는 법", "일터의 사람들", "평가·승진·문서·자격", "돈의 길", "투자와 자산 성향", "타이밍과 3년 로드맵"],
  love_marriage_child: ["사랑의 엔진", "내 매력 사용설명서", "맞는 사람과 끌리는 사람", "호감·연락·고백", "연애할 때의 나", "갈등과 회복", "결혼관과 함께 살기", "부모 역할", "인연의 흐름과 로드맵"],
  saju_mbti_compatibility: ["한 줄 판정", "각자의 바탕", "잘 맞는 부분", "A가 보는 B", "B가 보는 A", "안 맞는 부분", "관계의 현장에서", "보완할 부분", "조화를 위한 방법"],
};
