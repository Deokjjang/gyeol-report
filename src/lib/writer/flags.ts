/**
 * 기능 플래그 WRITER_V5_PRODUCTS: 쉼표로 나눈 상품 키(예 "saju_mbti_full,annual_fortune"). 기본은 비어 있음 = 기존(v4) 경로.
 * 이용권 발행 큐에서 이 상품만 v5 작가로 만든다. 결제(paid) 경로는 바뀌지 않는다.
 */
import { PRODUCT_KEYS } from "@/data/knowledge-v5/schema";

export function writerV5Products(env: Readonly<Record<string, string | undefined>> = process.env): string[] {
  return [...new Set((env.WRITER_V5_PRODUCTS ?? "").split(",").map(s => s.trim()).filter(s => (PRODUCT_KEYS as readonly string[]).includes(s)))];
}
