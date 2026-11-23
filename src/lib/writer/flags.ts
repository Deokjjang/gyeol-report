/**
 * v5 작가 상품(AM2-14 5부, 덕짱님 결정 2026-11-24): 6상품 모두 v5 작가(코드 상수 LAUNCH_V5_PRODUCTS) — 운영 env WRITER_V5_PRODUCTS는 읽지 않는다
 * (그 env가 4종만 담고 있으면 대운 · 세운이 옛 V4 경로로 만들어지고 30분 흐름도 걸리지 않았다). 결제 워커 · 이용권 큐 · 30분 마감 청소 · 입력 화면이 이 값을 쓴다.
 */
/** 운영 값(v5 최종3 출시 4종 + AM 12/1 대운·세운 v5). 대운·세운 판매는 판매 시작 시각(ops/config FORTUNE_SALES_OPEN_AT)이 따로 연다(이 값은 작가 경로만). */
export const LAUNCH_V5_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
export const LAUNCH_V5_PRODUCTS_VALUE = LAUNCH_V5_PRODUCTS.join(",");
export function writerV5Products(): string[] { return [...LAUNCH_V5_PRODUCTS]; }
