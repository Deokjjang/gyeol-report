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
