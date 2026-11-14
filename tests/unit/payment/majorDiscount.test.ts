import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { discountedAmount, majorDiscountRate, quoteMajorDiscount, reserveMajorDiscount, samePerson } from "../../../src/lib/payment/majorDiscount";

const person = { name: "가상 하나", birthDate: "1998-03-14", birthTime: "09:30", birthTimeUnknown: false, gender: "FEMALE", mbtiType: "ENFP" };
const store = (r: Record<string, unknown>) => ({ call: vi.fn(async () => r) });

// AM 3부 세운 → 대운 연결 할인: 1회·7일·같은 사람·환불 회수·서버 금액.
describe("대운 연결 할인", () => {
  it("할인율 설정값(기본 50%)과 서버 금액(10원 내림, 최소 100원)", () => {
    expect(majorDiscountRate({})).toBe(0.5);
    expect(majorDiscountRate({ MAJOR_DISCOUNT_RATE: "0.3" })).toBe(0.3);
    expect(majorDiscountRate({ MAJOR_DISCOUNT_RATE: "1.5" })).toBe(0.5);
    expect(discountedAmount(6900, 0.5)).toBe(3450);
    expect(discountedAmount(5900, 0.5)).toBe(2950);
    expect(discountedAmount(7900, 0.5)).toBe(3950);
    expect(discountedAmount(150, 0.9)).toBe(100);
  });
  it("같은 사람: 이름 공백·MBTI는 무시, 생일·시각·성별은 같아야", () => {
    expect(samePerson(person, { ...person, name: "가상하나", mbtiType: "INTJ" })).toBe(true);
    expect(samePerson(person, { ...person, birthDate: "1998-03-15" })).toBe(false);
    expect(samePerson(person, { ...person, birthTime: "10:30" })).toBe(false);
    expect(samePerson(person, { ...person, gender: "MALE" })).toBe(false);
    expect(samePerson({ ...person, birthTimeUnknown: true, birthTime: "" }, { ...person, birthTimeUnknown: true, birthTime: "" })).toBe(true);
    expect(samePerson(undefined, person)).toBe(false);
  });
  it("판정: SQL 규칙(1회·7일·환불)이 막으면 그대로 거절, 같은 사람이 아니면 거절, 맞으면 서버 금액", async () => {
    expect(await quoteMajorDiscount(store({}) as never, { annualReportId: "report_x", userId: null, price: 6900 })).toMatchObject({ ok: false, code: "LOGIN" });
    for (const code of ["USED", "EXPIRED", "REFUNDED", "NOT_FOUND"]) expect(await quoteMajorDiscount(store({ ok: false, code }) as never, { annualReportId: "report_x", userId: "u", price: 6900 })).toMatchObject({ ok: false, code });
    const ok = store({ ok: true, annualOrderId: "po_a", until: "2026-12-09T00:00:00Z", input: { person } });
    expect(await quoteMajorDiscount(ok as never, { annualReportId: "report_x", userId: "u", price: 6900, majorPerson: { ...person, birthDate: "2000-01-01" } })).toMatchObject({ ok: false, code: "NOT_SAME" });
    expect(await quoteMajorDiscount(ok as never, { annualReportId: "report_x", userId: "u", price: 6900, majorPerson: person })).toMatchObject({ ok: true, amount: 3450, original: 6900, rate: 0.5, annualOrderId: "po_a" });
  });
  it("예약: 세운 주문당 하나(SQL 유일 키) — 거절이면 결제를 만들지 않는다", async () => {
    const q = { ok: true as const, annualOrderId: "po_a", until: "", rate: 0.5, amount: 3450, original: 6900, input: {} };
    expect(await reserveMajorDiscount(store({ ok: true }) as never, q, "po_major", "u")).toBe(true);
    expect(await reserveMajorDiscount(store({ ok: false, code: "USED" }) as never, q, "po_major2", "u")).toBe(false);
  });
});
