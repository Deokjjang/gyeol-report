// AM2-14 4부(호출 0): 세운 → 대운 반값 — 자격(결제 · 환불 없음 · 2027판) · 서버 가격 · 승인 직전 원자 소진 · 동시 이중 사용 · 환불 되돌림 · 판매 닫힘/멈춤 · 4종 불변.
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { consumeHalf, eligibleAnnuals, HALF_AMOUNT_CODE, HALF_CONFIRM_GUARD_MS, HALF_PAYMENT_KEY_HOLD_MS, HALF_REFUSED_CODE, halfUseState, majorHalfGate, quoteHalf, type AnnualRow, type HalfPort, type MajorRow, type UseRow } from "../../../src/lib/payment/majorDiscount";
import { confirmGate } from "../../../src/lib/payment/confirmGate";
import { discountedAmount, majorHalfPriceKrw, MAJOR_HALF_RATE, reportPriceKrw } from "../../../src/lib/payment/reportProductCatalog";
import { FORTUNE_SALES_OPEN_AT, SALES_CLOSED_CODE, SALES_PAUSED_CODE } from "../../../src/lib/ops/config";

const OPEN = Date.parse(FORTUNE_SALES_OPEN_AT), T = OPEN + 86_400_000; // 판매 시작 다음 날
const iso = (t: number) => new Date(t).toISOString();
const PRICE = reportPriceKrw("major_fortune"), HALF = majorHalfPriceKrw();

/** 메모리 손: 넣기(PK 충돌) · 비교 후 바꾸기를 한 줄 원자로(운영 PostgREST 한 문장과 같은 뜻). */
function memory() {
  const orders = new Map<string, { id: string; product: string; status: string; amount: number; paidAt: string | null; owner: string | null; paymentKey: boolean; refund: string | null; reportId?: string }>();
  const uses = new Map<string, UseRow & { rate: number; amount: number; originalAmount: number }>();
  const calls = { n: 0 };
  const port: HalfPort = {
    async annualOrders(userId) { calls.n++; await Promise.resolve(); return [...orders.values()].filter(o => o.owner === userId && o.product === "annual_fortune").map(o => ({ id: o.id, status: o.status, amount: o.amount, paidAt: o.paidAt, refund: o.refund }) as AnnualRow); },
    async uses(ids) { await Promise.resolve(); return [...uses.values()].filter(u => ids.includes(u.annualOrderId)).map(u => ({ ...u })); },
    async majors(ids) { await Promise.resolve(); return ids.flatMap(id => { const o = orders.get(id); return o ? [{ id, status: o.status, paymentKey: o.paymentKey } as MajorRow] : []; }); },
    async insertUse(r) { await Promise.resolve(); if (uses.has(r.annualOrderId) || [...uses.values()].some(u => u.majorOrderId === r.majorOrderId)) return "conflict"; uses.set(r.annualOrderId, { ...r }); return "ok"; },
    async casUse(a, expect, set) { await Promise.resolve(); const u = uses.get(a); if (!u || u.majorOrderId !== expect.majorOrderId || u.reservedAt !== expect.reservedAt) return false; uses.set(a, { ...u, ...set }); return true; },
    async orderOwner(id) { return orders.get(id)?.owner ?? null; },
    async reportOrder(reportId) { return [...orders.values()].find(o => o.reportId === reportId && o.product === "annual_fortune")?.id ?? null; },
    async input(id) { return orders.get(id) ? { person: { name: `사람 ${id}` }, userContext: {} } : null; },
  };
  const annual = (id: string, owner: string, extra: Partial<{ status: string; paidAt: string | null; refund: string | null; amount: number; reportId: string }> = {}) => orders.set(id, { id, product: "annual_fortune", status: "paid", amount: 3900, paidAt: iso(T), owner, paymentKey: true, refund: null, ...extra });
  const major = (id: string, owner: string, amount: number, extra: Partial<{ status: string; paymentKey: boolean }> = {}) => orders.set(id, { id, product: "major_fortune", status: "ready", amount, paidAt: null, owner, paymentKey: false, refund: null, ...extra });
  const order = (id: string) => { const o = orders.get(id)!; return { payment_order_id: o.id, provider_order_id: o.id, product_type: o.product, status: o.status, amount: o.amount }; };
  return { port, orders, uses, annual, major, order, calls };
}

describe("AM2-14 4부 대운 반값 — 가격 · 자격", () => {
  it("가격: 대운 정가 × 0.5(10원 내림) — 카탈로그 한 곳에서", () => {
    expect(MAJOR_HALF_RATE).toBe(0.5);
    expect(HALF).toBe(discountedAmount(PRICE, 0.5));
    expect(discountedAmount(4900, 0.5)).toBe(2450);
    expect(discountedAmount(150, 0.9)).toBe(100);
  });
  it("자격: 결제됨 · 금액 있음 · 환불(요청 · 처리 · 완료) 없음 · 2027판 판매 시작 뒤 결제, 오래된 것 먼저", () => {
    const rows: AnnualRow[] = [
      { id: "a-new", status: "paid", amount: 3900, paidAt: iso(T + 10), refund: null },
      { id: "a-old", status: "paid", amount: 3900, paidAt: iso(T), refund: null },
      { id: "a-2026", status: "paid", amount: 3900, paidAt: iso(OPEN - 1), refund: null },
      { id: "a-ready", status: "ready", amount: 3900, paidAt: null, refund: null },
      { id: "a-refund-req", status: "paid", amount: 3900, paidAt: iso(T), refund: "requested" },
      { id: "a-refund-fail", status: "paid", amount: 3900, paidAt: iso(T), refund: "failed" },
      { id: "a-refunded", status: "refunded", amount: 3900, paidAt: iso(T), refund: "done" },
    ];
    expect(eligibleAnnuals(rows).map(r => r.id)).toEqual(["a-old", "a-refund-fail", "a-new"]);
  });
  it("판정(쓰기 없음): 로그인 없음 · 세운 없음(이용권 세운은 주문이 없다) · 쓴 자격 → 거절, 안 쓴 자격 → 서버 금액 반값", async () => {
    const m = memory();
    expect(await quoteHalf(m.port, { userId: null, now: T })).toMatchObject({ ok: false, code: "LOGIN" });
    expect(await quoteHalf(m.port, { userId: "u1", now: T })).toMatchObject({ ok: false, code: "NONE" });
    m.annual("A1", "u1", { reportId: "report_aaaaaaaaaaaaaaaa" });
    const q = await quoteHalf(m.port, { userId: "u1", from: "report_aaaaaaaaaaaaaaaa", now: T + 1000 });
    expect(q).toMatchObject({ ok: true, annualOrderId: "A1", amount: HALF, original: PRICE });
    expect(m.uses.size).toBe(0); // 판정은 쓰지 않는다
    m.major("M1", "u1", HALF, { status: "paid", paymentKey: true }); m.uses.set("A1", { annualOrderId: "A1", majorOrderId: "M1", userId: "u1", reservedAt: iso(T), rate: 0.5, amount: HALF, originalAmount: PRICE });
    expect(await quoteHalf(m.port, { userId: "u1", now: T + 1000 })).toMatchObject({ ok: false, code: "USED" });
    m.annual("A2", "u1", { paidAt: iso(T + 500) });
    expect(await quoteHalf(m.port, { userId: "u1", now: T + 1000 })).toMatchObject({ ok: true, annualOrderId: "A2" }); // 세운 1건마다 1회
  });
});

describe("AM2-14 4부 승인 직전 문(원자 소진)", () => {
  it("정가 대운은 소진 없이 통과 · 반값은 소진 성공 때만 · 그 밖 금액(조작)은 거절 · 대운이 아닌 주문은 그대로", async () => {
    const m = memory(); m.annual("A1", "u1");
    m.major("M-full", "u1", PRICE); expect(await majorHalfGate(m.order("M-full"), m.port, T)).toBeNull(); expect(m.uses.size).toBe(0);
    m.major("M-tamper", "u1", 1000); expect(await majorHalfGate(m.order("M-tamper"), m.port, T)).toBe(HALF_AMOUNT_CODE);
    m.major("M-half", "u1", HALF); expect(await majorHalfGate(m.order("M-half"), m.port, T)).toBeNull();
    expect(m.uses.get("A1")).toMatchObject({ majorOrderId: "M-half", userId: "u1", amount: HALF, originalAmount: PRICE });
    m.major("M-none", "u2", HALF); expect(await majorHalfGate(m.order("M-none"), m.port, T)).toBe(HALF_REFUSED_CODE); // 자격 없는 계정
    expect(await majorHalfGate({ product_type: "saju_mbti_full", status: "ready", amount: 3900, payment_order_id: "x" }, m.port, T)).toBeNull();
    expect(await majorHalfGate({ product_type: "major_fortune", status: "paid", amount: HALF, payment_order_id: "M-half" }, m.port, T)).toBeNull(); // 이미 결제된 주문은 문을 다시 지나지 않는다
  });
  it("같은 주문의 다시 승인(결과 화면 새로 고침)은 그 줄을 다시 확정한다", async () => {
    const m = memory(); m.annual("A1", "u1"); m.major("M1", "u1", HALF);
    expect(await consumeHalf(m.port, { userId: "u1", majorOrderId: "M1", now: T })).toBe(true);
    expect(await consumeHalf(m.port, { userId: "u1", majorOrderId: "M1", now: T + 5000 })).toBe(true);
    expect(m.uses.get("A1")?.reservedAt).toBe(iso(T + 5000));
  });
  it("동시 이중 사용: 같은 자격(세운 1건)으로 반값 대운 둘을 동시에 승인하면 하나만 통과", async () => {
    for (let round = 0; round < 20; round++) {
      const m = memory(); m.annual("A1", "u1"); m.major("M1", "u1", HALF); m.major("M2", "u1", HALF);
      const [g1, g2] = await Promise.all([majorHalfGate(m.order("M1"), m.port, T), majorHalfGate(m.order("M2"), m.port, T)]);
      expect([g1, g2].filter(g => g === null).length).toBe(1);
      expect([g1, g2].filter(g => g === HALF_REFUSED_CODE).length).toBe(1);
      expect(m.uses.size).toBe(1);
    }
    // 세운이 둘이면 둘 다 통과(각각 다른 자격)
    const m = memory(); m.annual("A1", "u1"); m.annual("A2", "u1", { paidAt: iso(T + 1) }); m.major("M1", "u1", HALF); m.major("M2", "u1", HALF);
    const both = await Promise.all([majorHalfGate(m.order("M1"), m.port, T), majorHalfGate(m.order("M2"), m.port, T)]);
    expect(both).toEqual([null, null]); expect(new Set([...m.uses.values()].map(u => u.majorOrderId))).toEqual(new Set(["M1", "M2"]));
  });
  it("갈아 끼우기도 하나만: 예전 대운이 환불된 줄을 두 주문이 동시에 노리면 하나만", async () => {
    const m = memory(); m.annual("A1", "u1"); m.major("M0", "u1", HALF, { status: "refunded", paymentKey: true });
    m.uses.set("A1", { annualOrderId: "A1", majorOrderId: "M0", userId: "u1", reservedAt: iso(T), rate: 0.5, amount: HALF, originalAmount: PRICE });
    m.major("M1", "u1", HALF); m.major("M2", "u1", HALF);
    const r = await Promise.all([majorHalfGate(m.order("M1"), m.port, T + 10), majorHalfGate(m.order("M2"), m.port, T + 10)]);
    expect(r.filter(g => g === null).length).toBe(1);
  });
  it("승인 중인 대운의 줄은 지킨다: 문을 지난 지 3분 안이거나 결제 키가 있으면(승인 · 회수 중) 다른 주문이 못 가져간다", async () => {
    const m = memory(); m.annual("A1", "u1"); m.major("M1", "u1", HALF); m.major("M2", "u1", HALF);
    expect(await majorHalfGate(m.order("M1"), m.port, T)).toBeNull();
    expect(await majorHalfGate(m.order("M2"), m.port, T + 60_000)).toBe(HALF_REFUSED_CODE);
    m.orders.get("M1")!.paymentKey = true;
    expect(await majorHalfGate(m.order("M2"), m.port, T + HALF_CONFIRM_GUARD_MS + 1)).toBe(HALF_REFUSED_CODE);
    m.orders.get("M1")!.paymentKey = false; // 승인 시작 전에 멈춘 주문(창 닫음) — 3분 뒤 풀린다
    expect(await majorHalfGate(m.order("M2"), m.port, T + HALF_CONFIRM_GUARD_MS + 1)).toBeNull();
    expect(m.uses.get("A1")?.majorOrderId).toBe("M2");
  });
  it("줄 상태 판정", () => {
    const u = { annualOrderId: "A", majorOrderId: "M", userId: "u", reservedAt: iso(T) };
    expect(halfUseState(undefined, undefined, T)).toBe("free");
    expect(halfUseState(u, { id: "M", status: "paid", paymentKey: true }, T)).toBe("used");
    for (const s of ["refunded", "canceled", "failed"]) expect(halfUseState(u, { id: "M", status: s, paymentKey: true }, T)).toBe("free");
    expect(halfUseState(u, { id: "M", status: "ready", paymentKey: true }, T + 3_600_000)).toBe("inflight");
    expect(halfUseState(u, { id: "M", status: "ready", paymentKey: true }, T + HALF_PAYMENT_KEY_HOLD_MS)).toBe("free"); // 승인 실패 · 회수 「주의」로 끝난 결제 키는 하루 뒤 풀린다
    expect(halfUseState(u, { id: "M", status: "ready", paymentKey: false }, T + 1000)).toBe("inflight");
    expect(halfUseState(u, { id: "M", status: "ready", paymentKey: false }, T + HALF_CONFIRM_GUARD_MS)).toBe("free");
  });
});

describe("AM2-14 4부 환불", () => {
  let m: ReturnType<typeof memory>;
  beforeEach(async () => { m = memory(); m.annual("A1", "u1"); m.major("M1", "u1", HALF); expect(await majorHalfGate(m.order("M1"), m.port, T)).toBeNull(); m.orders.get("M1")!.status = "paid"; m.orders.get("M1")!.paymentKey = true; });
  it("대운 반값이 환불되면(30분 자동 환불 포함 — status refunded) 자격이 돌아온다", async () => {
    expect(await quoteHalf(m.port, { userId: "u1", now: T + 1000 })).toMatchObject({ ok: false, code: "USED" });
    m.orders.get("M1")!.status = "refunded";
    expect(await quoteHalf(m.port, { userId: "u1", now: T + 2000 })).toMatchObject({ ok: true, annualOrderId: "A1" });
    m.major("M2", "u1", HALF); expect(await majorHalfGate(m.order("M2"), m.port, T + 3000)).toBeNull();
    expect(m.uses.get("A1")?.majorOrderId).toBe("M2");
  });
  it("세운이 환불되면 안 쓴 자격은 없어지고(요청 순간부터), 이미 쓴 대운은 그대로", async () => {
    m.annual("A2", "u1", { paidAt: iso(T + 10) }); m.major("M2", "u1", HALF);
    m.orders.get("A2")!.refund = "requested";
    expect(await quoteHalf(m.port, { userId: "u1", now: T + 1000 })).toMatchObject({ ok: false, code: "USED" });
    expect(await majorHalfGate(m.order("M2"), m.port, T + 1000)).toBe(HALF_REFUSED_CODE); // 반값 결제창을 연 뒤 세운이 환불돼도 승인하지 않는다
    m.orders.get("A1")!.refund = "done"; m.orders.get("A1")!.status = "refunded";
    expect(m.orders.get("M1")!.status).toBe("paid"); // 쓴 대운은 그대로
    expect(await quoteHalf(m.port, { userId: "u1", now: T + 2000 })).toMatchObject({ ok: false, code: "NONE" });
  });
});

describe("AM2-14 4부 판매 닫힘 · 멈춤(Q0 · 처리 봇)이 반값보다 먼저 · 4종 불변", () => {
  const store = (order: Record<string, unknown>) => ({ call: vi.fn(async (action: string) => (action === "find_order" ? { ok: true, order } : { ok: false })) });
  it("판매 닫힘이면 반값 주문도 소진하지 않고 닫힘", async () => {
    const m = memory(); m.annual("A1", "u1"); m.major("M1", "u1", HALF);
    const o = { ...m.order("M1") };
    // 판매 시작 전(시험 시각 = 지금 실제 시각, 2026-12-01 09:00 전) → 닫힘
    if (Date.now() < OPEN) { expect(await confirmGate(store(o) as never, "M1", { port: () => m.port, paused: async () => false })).toBe(SALES_CLOSED_CODE); expect(m.uses.size).toBe(0); }
  });
  it("판매 멈춤이면 반값 주문도 소진하지 않고 멈춤 · 4종 주문은 반값 손을 부르지 않는다", async () => {
    vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", "2000-01-01T00:00:00+09:00"); vi.stubEnv("FORTUNE_SALES_OPEN", "1"); vi.stubEnv("FORTUNE_PRICE_MAJOR_KRW", String(PRICE)); vi.stubEnv("FORTUNE_PRICE_ANNUAL_KRW", "3900");
    try {
      const m = memory(); m.annual("A1", "u1"); m.major("M1", "u1", HALF);
      expect(await confirmGate(store(m.order("M1")) as never, "M1", { port: () => m.port, paused: async () => true })).toBe(SALES_PAUSED_CODE);
      expect(m.uses.size).toBe(0);
      // 요청 금액이 저장 금액과 다르면(토스 요청 조작) 자격을 잡기 전에 거절
      expect(await confirmGate(store(m.order("M1")) as never, "M1", { amount: 100, port: () => m.port, paused: async () => false })).toBe(HALF_AMOUNT_CODE);
      expect(m.uses.size).toBe(0);
      expect(await confirmGate(store(m.order("M1")) as never, "M1", { amount: HALF, port: () => m.port, paused: async () => false })).toBeNull();
      expect(m.uses.size).toBe(1);
      const spy = vi.fn(() => m.port);
      for (const product of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "annual_fortune"]) {
        expect(await confirmGate(store({ provider_order_id: "P", payment_order_id: "P", product_type: product, status: "ready", amount: reportPriceKrw(product as never) }) as never, "P", { port: spy, paused: async () => false })).toBeNull();
      }
      expect(spy).not.toHaveBeenCalled();
    } finally { vi.unstubAllEnvs(); }
  });
  it("4종 가격은 그대로 3,900원", () => {
    for (const p of ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility"] as const) expect(reportPriceKrw(p)).toBe(3900);
  });
});
