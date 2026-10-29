import type { ReportProductKey, ReportProductSlug } from "../report-generation/reportInputTypes";

// Shared presentation identity. Prices and purchase eligibility live in the
// existing payment catalog, never here. P5: 6색 계열은 그대로, 채도만 낮춘 천 장정 색.
export const BOOKS = [
  { id: "full", productKey: "saju_mbti_full", slug: "saju-mbti-full", title: "나라는\n사람", color: "#D6B758", ink: "#1F1B14", issue: "01" },
  { id: "career", productKey: "career_money_study", slug: "career-money-study", title: "내가\n잘되는 방식", color: "#2F5A47", ink: "#F6F1E6", issue: "02" },
  { id: "love", productKey: "love_marriage_child", slug: "love-marriage-child", title: "내 사랑\n이야기", color: "#C46A4C", ink: "#1F1B14", issue: "03" },
  { id: "compatibility", productKey: "saju_mbti_compatibility", slug: "compatibility", title: "우리라는\n사이", color: "#5B4A82", ink: "#F6F1E6", issue: "04" },
  { id: "major", productKey: "major_fortune", slug: "major-fortune", title: "앞으로의\n나", color: "#2D3E56", ink: "#F6F1E6", issue: "05" },
  { id: "annual", productKey: "annual_fortune", slug: "annual-fortune", title: "나의\n한 해", color: "#C8C4BA", ink: "#1F1B14", issue: "06" },
] as const satisfies readonly { id: string; productKey: ReportProductKey; slug: ReportProductSlug; title: string; color: string; ink: string; issue: string }[];
export type Book = typeof BOOKS[number];
export function readerTitle(book: Book, year: string) {
  return book.id === "annual" ? (/^\d{4}$/.test(year) ? `나의 ${year}` : "나의 한 해") : book.title.replace("\n", " ");
}
export function bookForProduct(product: string) { return BOOKS.find(b => b.productKey === product || b.slug === product); }
