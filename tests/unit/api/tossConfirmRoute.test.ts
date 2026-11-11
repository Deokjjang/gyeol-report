import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../../src/app/api/payments/toss/confirm/route";
import { createPaidReportReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { confirmTossPayment } from "../../../src/lib/payment/tossConfirmClient";
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: vi.fn() }));
vi.mock("../../../src/lib/payment/tossConfirmClient", () => ({ TOSS_CONFIRM_REQUIRED_AMOUNT: 1290, confirmTossPayment: vi.fn() }));
const call = vi.fn();
// v5 최종3: 승인 전 판매 중지 상품 확인(find_order)은 따로 받는다 — 기존 승인 순서(confirm_claim → 토스 → confirm_finish) 시험은 그대로.
const findOrder = vi.fn();
function request(body: unknown) { return new Request("http://localhost/api/payments/toss/confirm", { method: "POST", body: JSON.stringify(body) }); }
const payment = { paymentKey: "mock-key", orderId: "mock-order", amount: 1290 };
beforeEach(() => {
  vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
  vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "mock-secret");
  call.mockReset();
  findOrder.mockReset().mockResolvedValue({ ok: true, order: { provider_order_id: payment.orderId, status: "ready", product_type: "saju_mbti_full" } });
  vi.mocked(createPaidReportReliabilityStore).mockReturnValue({ call: (action: string, data?: Record<string, unknown>) => action === "find_order" ? findOrder(action, data) : call(action, data) });
  vi.mocked(confirmTossPayment).mockReset().mockResolvedValue({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: payment.orderId, amount: 1290, status: "DONE" } });
});
afterEach(() => vi.unstubAllEnvs());
describe("Toss confirm durable boundary (mock payment)", () => {
  it("records payment and queues a report without calling generation", async () => {
    call.mockResolvedValueOnce({ ok: true, token: "lease" }).mockResolvedValueOnce({ ok: true, reportId: "report-id" });
    const response = await POST(request(payment));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true, reportId: "report-id", status: "QUEUED" });
    expect(call.mock.calls.map((c) => c[0])).toEqual(["confirm_claim", "confirm_finish"]);
    expect(confirmTossPayment).toHaveBeenCalledTimes(1);
  });
  it("completed callbacks return existing report without confirming again", async () => {
    call.mockResolvedValue({ ok: true, reportId: "existing" });
    expect(await (await POST(request(payment))).json()).toMatchObject({ reportId: "existing" });
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("concurrent confirmation returns pending without provider call", async () => {
    call.mockResolvedValue({ ok: true, pending: true });
    expect((await POST(request(payment))).status).toBe(202);
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("storage failure blocks confirmation", async () => {
    call.mockResolvedValue({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    expect((await POST(request(payment))).status).toBe(503);
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("non-DONE payment never records PAID", async () => {
    call.mockResolvedValue({ ok: true, token: "lease" });
    vi.mocked(confirmTossPayment).mockResolvedValue({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: payment.orderId, amount: 1290, status: "IN_PROGRESS" } });
    expect((await POST(request(payment))).status).toBe(503);
    expect(call).toHaveBeenCalledTimes(1);
  });
  it("storage failure after approval does not expose internals", async () => {
    call.mockResolvedValueOnce({ ok: true, token: "lease" }).mockResolvedValueOnce({ ok: false, code: "mock-secret" });
    const response = await POST(request(payment));
    expect(response.status).toBe(503);
    const body = JSON.stringify(await response.json());
    expect(body).not.toContain("mock-secret");
    expect(body).not.toContain("mock-key");
  });
  it("does not pin a price: any well-formed amount goes to the stored-order amount check (confirm_claim)", async () => {
    call.mockResolvedValueOnce({ ok: false, code: "PAYMENT_MISMATCH" });
    expect((await POST(request({ ...payment, amount: 1990 }))).status).toBe(503);
    expect(call).toHaveBeenCalledWith("confirm_claim", { ...payment, amount: 1990 });
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("rejects disabled, malformed, wrong amount, and missing config requests", async () => {
    expect((await POST(request({}))).status).toBe(400);
    expect((await POST(request({ ...payment, amount: 1 }))).status).toBe(400);
    vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "");
    expect((await POST(request(payment))).status).toBe(500);
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "0");
    expect((await POST(request(payment))).status).toBe(404);
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it.each(["major_fortune", "annual_fortune"])("판매 중지 %s의 승인 전 주문은 토스 승인·주문 선점 없이 409", async product => {
    findOrder.mockResolvedValue({ ok: true, order: { provider_order_id: payment.orderId, status: "ready", product_type: product } });
    const response = await POST(request(payment));
    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ ok: false, error: { code: "PRODUCT_SALES_CLOSED" } });
    expect(findOrder).toHaveBeenCalledWith("find_order", { orderId: payment.orderId });
    expect(call).not.toHaveBeenCalled();
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("이미 승인된(paid) 판매 중지 상품 주문, 판매 재개(FORTUNE_SALES_OPEN=1), 주문 조회 실패는 기존 승인 흐름 그대로", async () => {
    for (const [order, open] of [[{ provider_order_id: payment.orderId, status: "paid", product_type: "major_fortune" }, "0"], [{ provider_order_id: payment.orderId, status: "ready", product_type: "annual_fortune" }, "1"], [null, "0"]] as const) {
      vi.stubEnv("FORTUNE_SALES_OPEN", open); vi.stubEnv("FORTUNE_PRICE_MAJOR_KRW", "4900"); vi.stubEnv("FORTUNE_PRICE_ANNUAL_KRW", "4900");
      findOrder.mockResolvedValue(order ? { ok: true, order } : { ok: false, code: "DURABLE_STORAGE_FAILED" });
      call.mockReset().mockResolvedValueOnce({ ok: true, token: "lease" }).mockResolvedValueOnce({ ok: true, reportId: "report-id" });
      expect((await POST(request(payment))).status).toBe(200);
      expect(call.mock.calls.map((c) => c[0])).toEqual(["confirm_claim", "confirm_finish"]);
    }
  });
});
