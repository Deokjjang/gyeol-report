import type { BookData } from "../../app/dev/book-preview/bookTypes";
import exampleJson from "../../data/example/seohaeun-full.json";

/**
 * 최종 A 15: 공개 예시 리포트(/example). 지어낸 인물 서하은의 v5 종합 책 저장본 앞 2장(tools/final4/export-example.ts가 만든 데이터).
 * 저장된 문장을 그대로 보여 준다(호출 0). 실제 사람 정보가 섞이지 않았는지 exampleLeaks로 만들 때·시험에서 확인한다.
 */
export type ExampleBook = { source: { productType: string; chapters: number; of: number; note: string }; today: string; edition?: string; data: BookData };
export const EXAMPLE_BOOK = exampleJson as unknown as ExampleBook;
export const EXAMPLE_TAG = "예시 · 가상의 인물";
export const EXAMPLE_CTA = { label: "내 리포트 만들기", href: "/" } as const;
export const EXAMPLE_TITLE = "예시로 먼저 펼쳐 보기 · 나라는 사람";
export const EXAMPLE_DESCRIPTION = "가상의 인물 서하은의 사주×MBTI 종합 리포트, 앞 2장을 그대로 펼쳐 보세요.";

export { exampleLeaks, OTHER_TEST_NAMES } from "./exampleGuard";
