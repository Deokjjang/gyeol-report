/**
 * AM2: 상품별 작가 방식. book = 책 1권 = 작가 1회(검사 → 수리 → 재작성, 4종 그대로). chunked = 장 묶음 작가(세운·대운: 묶음 병렬 →
 * 차단 검사 → 걸린 묶음 다시 쓰기 → 문장 삭제 → 장 결정론 대체). 상품 구성·지식 DB·엔진은 같다.
 */
export type WriterMode = "book" | "chunked";
export const WRITER_MODE: Readonly<Record<string, WriterMode>> = { annual_fortune: "chunked", major_fortune: "chunked" };
export const writerModeOf = (productKey: string): WriterMode => WRITER_MODE[productKey] ?? "book";
