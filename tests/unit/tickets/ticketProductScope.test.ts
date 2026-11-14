import { describe, expect, it } from "vitest";
import { TICKET_PRODUCTS, ticketProductAllowed } from "../../../src/lib/ops/config";

// AM 3부: 보상·증정·가입·추천·묶음·관리자 지급 이용권 모두 출시 4종에만(약관 그대로). 판매를 열어도 대운·세운은 결제로만.
describe("이용권 상품 범위", () => {
  it("출시 4종만 허용", () => {
    expect([...TICKET_PRODUCTS]).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"]);
    for (const p of TICKET_PRODUCTS) expect(ticketProductAllowed(p)).toBe(true);
  });
  it("대운·세운·모르는 값은 거절", () => {
    for (const p of ["major_fortune", "annual_fortune", "", null, 1]) expect(ticketProductAllowed(p)).toBe(false);
  });
});
