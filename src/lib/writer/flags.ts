/**
 * 기능 플래그 WRITER_V5_PRODUCTS: 쉼표로 나눈 상품 키(예 "saju_mbti_full,annual_fortune"). 기본은 비어 있음 = 기존(v4) 경로.
 * 이용권 발행 큐에서 이 상품만 v5 작가로 만든다. 결제(paid) 경로는 바뀌지 않는다.
 */
import { PRODUCT_KEYS } from "@/data/knowledge-v5/schema";

export function writerV5Products(env: Readonly<Record<string, string | undefined>> = process.env): string[] {
  return [...new Set((env.WRITER_V5_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(s => (PRODUCT_KEYS as readonly string[]).includes(s)))];
}

/** 운영 값(v5 최종3 출시 4종 + AM 12/1 대운·세운 v5). 대운·세운 판매는 FORTUNE_SALES_OPEN·가격 설정값이 따로 연다(이 값은 작가 경로만). */
export const LAUNCH_V5_PRODUCTS = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
export const LAUNCH_V5_PRODUCTS_VALUE = LAUNCH_V5_PRODUCTS.join(",");

/**
 * 서버 시작 점검(src/instrumentation.ts): WRITER_V5_PRODUCTS가 비었거나 출시 4종과 다르면 경고 한 줄(JSON), 같으면 null.
 * 경고만 남기고 동작(결제·생성)은 바꾸지 않는다 — 빠진 상품은 기존 V4 경로로 만들어진다.
 */
export function writerV5ProductsWarning(env: Readonly<Record<string, string | undefined>> = process.env): string | null {
  const raw = env.WRITER_V5_PRODUCTS ?? "", parsed = writerV5Products(env);
  const missing = LAUNCH_V5_PRODUCTS.filter(p => !parsed.includes(p)), extra = parsed.filter(p => !(LAUNCH_V5_PRODUCTS as readonly string[]).includes(p));
  const ignored = raw.split(",").map(s => s.trim()).filter(s => s && !(PRODUCT_KEYS as readonly string[]).includes(s));
  if (!missing.length && !extra.length && !ignored.length) return null;
  const message = !parsed.length ? "WRITER_V5_PRODUCTS가 비어 있습니다(또는 아는 상품 키가 없습니다) — 6상품 모두 V4로 생성됩니다."
    : "WRITER_V5_PRODUCTS가 운영 값(6상품)과 다릅니다 — 빠진 상품은 V4로 생성됩니다.";
  return JSON.stringify({ event: "WRITER_V5_PRODUCTS_MISMATCH", message, expected: LAUNCH_V5_PRODUCTS_VALUE, parsed, missing, extra, ignored });
}
