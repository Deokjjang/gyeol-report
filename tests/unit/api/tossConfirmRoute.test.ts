import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../../src/app/api/payments/toss/confirm/route";
import { createPaidReportReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { confirmTossPayment } from "../../../src/lib/payment/tossConfirmClient";
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: vi.fn() }));
vi.mock("../../../src/lib/payment/tossConfirmClient", () => ({ TOSS_CONFIRM_REQUIRED_AMOUNT: 1290, confirmTossPayment: vi.fn() }));
const call = vi.fn();
function request(body: unknown) { return new Request("http://localhost/api/payments/toss/confirm", { method: "POST", body: JSON.stringify(body) }); }
const payment = { paymentKey: "mock-key", orderId: "mock-order", amount: 1290 };
beforeEach(() => {
  vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
  vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "mock-secret");
  call.mockReset();
  vi.mocked(createPaidReportReliabilityStore).mockReturnValue({ call });
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
  it("rejects disabled, malformed, wrong amount, and missing config requests", async () => {
    expect((await POST(request({}))).status).toBe(400);
    expect((await POST(request({ ...payment, amount: 1 }))).status).toBe(400);
    vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "");
    expect((await POST(request(payment))).status).toBe(500);
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "0");
    expect((await POST(request(payment))).status).toBe(404);
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
});
