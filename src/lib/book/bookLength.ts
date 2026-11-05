import lengths from "../../data/example/book-lengths.json";

/**
 * 최종 A 15: 상품 카드(책장 표지) 분량 표시 — 「13장 · 약 1만 자」. 출시 4종만(대운·세운은 판매 중지라 없음).
 * 글자 수는 v5 저장본 전체(COMPLETED, 판 구분 없이) 장 본문 평균을 천 단위로 내림한 값(allV5, tools/final4/book-length.ts → book-lengths.json).
 * 지시 「v5 저장본 평균·과장 금지」를 글자 그대로 따라 최신판(제6판)만의 평균(더 큼)은 쓰지 않는다.
 */
export const BOOK_CHAPTER_COUNT: Readonly<Record<string, number>> = { saju_mbti_full: 13, career_money_study: 9, love_marriage_child: 9, saju_mbti_compatibility: 9 };
const THOUSANDS: Readonly<Record<string, number>> = Object.fromEntries(Object.entries(lengths.products).map(([k, v]) => [k, v.allV5.thousands]));
/** 천 단위 수 → "약 1만 2천 자"·"약 1만 자"·"약 9천 자". */
export function aboutChars(thousands: number): string {
  const man = Math.floor(thousands / 10), cheon = thousands % 10;
  return `약 ${man ? `${man}만` : ""}${man && cheon ? " " : ""}${cheon ? `${cheon}천` : ""} 자`;
}
export function bookLengthParts(productKey: string): { chapters: string; chars: string } | null {
  const n = BOOK_CHAPTER_COUNT[productKey], k = THOUSANDS[productKey];
  return n && k ? { chapters: `${n}장`, chars: aboutChars(k) } : null;
}
