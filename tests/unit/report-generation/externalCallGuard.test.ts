import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { confirmTossPayment, TOSS_CONFIRM_TIMEOUT_MS } from "../../../src/lib/payment/tossConfirmClient";
import { confirmPaidReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import { recoverPendingPayment, PAYMENT_RECOVERY_TIMEOUT_MS } from "../../../src/lib/payment/paymentConfirmRecovery";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { WRITER_DISABLED_RUNTIME } from "../../../src/lib/report-generation/writerDisabled";

const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const products = [
  ["saju_mbti_full", "saju-mbti-full"],
  ["career_money_study", "career-money-study"],
  ["love_marriage_child", "love-marriage-child"],
  ["major_fortune", "major-fortune"],
  ["annual_fortune", "annual-fortune"],
  ["saju_mbti_compatibility", "compatibility"],
] as const;
function payload(productKey: string, productSlug: string) {
  return productKey === "saju_mbti_compatibility"
    ? { productKey, productSlug, relationshipType: "love", personA: person, personB: { ...person, name: "이서연", birthDate: "1998-03-14", gender: "FEMALE", mbtiType: "INTP" } }
    : { productKey, productSlug, person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: productKey === "annual_fortune" ? { selectedYear: "2026" } : {} };
}
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-22T00:00:00Z")); });
afterEach(() => vi.useRealTimers());

describe("report generation has no external transport", () => {
  it.each(products)("%s delivers the deterministic draft for every strategy without any call", async (key, slug) => {
    for (const strategy of ["normal_writer", "writer_regeneration", "deterministic_fallback"] as const) {
      const result = await generateProductReport(payload(key, slug), undefined, strategy);
      expect(result).toMatchObject({ ok: true, externalCalls: [], delivery: { fallbackUsed: true, publish: "pass" } });
    }
    expect(fetch).not.toHaveBeenCalled();
  });

  it("worker completes in the first attempt with an empty call audit", async () => {
    const call = vi.fn<ReliabilityStore["call"]>(async action => action === "claim_job"
      ? { ok: true, job: { job_id: "job", report_id: "report_no_writer", created_at: "2026-09-22T00:00:00Z", lease_token: "lease", attempt_count: 1, product_type: "career_money_study", payload: payload("career_money_study", "career-money-study") } }
      : { ok: true, status: "COMPLETED" });
    expect(await runPaidReportJob({ call }, WRITER_DISABLED_RUNTIME)).toMatchObject({ status: "COMPLETED" });
    expect(call).toHaveBeenCalledWith("claim_job", { model: "deterministic" });
    expect(call).toHaveBeenLastCalledWith("finish_job", expect.objectContaining({ success: true, delivery: expect.objectContaining({ fallbackUsed: true, failureCode: "WRITER_DISABLED" }), externalCalls: [] }));
    expect(call).toHaveBeenCalledTimes(2);
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("Toss deadline preserves uncertain approval", () => {
  const payment = { orderId: "mock-order", paymentKey: "mock-payment", amount: 1290 };
  it.each(["headers", "body"])("bounds a hang at %s without marking payment failed", async phase => {
    const transport = vi.fn(async () => phase === "headers" ? new Promise<never>(() => {}) : { ok: true, status: 200, json: () => new Promise<never>(() => {}) });
    const call = vi.fn(async () => ({ ok: true, token: "lease-token" }));
    const running = confirmPaidReport(payment, { call }, input => confirmTossPayment({ ...input, secretKey: "mock-only", fetchImpl: transport }));
    await vi.advanceTimersByTimeAsync(TOSS_CONFIRM_TIMEOUT_MS);
    expect(await running).toEqual({ ok: false, code: "PAYMENT_CONFIRM_PENDING" });
    expect(call.mock.calls).toHaveLength(1);
    expect(transport).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
  it("recovery's earlier 10s parent deadline aborts confirm and schedules recovery", async () => {
    const transport = vi.fn(async (_url: string, init: RequestInit) => { expect(init.signal).toBeDefined(); return new Promise<never>(() => {}); });
    const call = vi.fn<ReliabilityStore["call"]>(async action => action === "claim_payment_recovery" ? { ok: true, token: "token", order: { provider_order_id: "mock-order", provider_payment_id: "mock-payment", amount: 1290, payment_order_id: "po" } } : { ok: true });
    const running = recoverPendingPayment({ call }, (input, signal) => confirmTossPayment({ ...input, signal, secretKey: "mock-only", fetchImpl: transport }));
    await vi.advanceTimersByTimeAsync(PAYMENT_RECOVERY_TIMEOUT_MS);
    await running;
    expect(call).toHaveBeenLastCalledWith("payment_recovery_failed", expect.objectContaining({ code: "RECOVERY_TIMEOUT" }));
    expect(transport.mock.calls[0][1].signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });
});
