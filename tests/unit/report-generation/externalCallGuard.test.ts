import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { guardedReportFetch, REPORT_OUTPUT_TOKENS, REPORT_WRITER_INPUT_BYTES, REPORT_WRITER_TIMEOUT_MS, type WriterCallBudget } from "../../../src/lib/report-generation/reportWriterCallGuard";
import { confirmTossPayment, TOSS_CONFIRM_TIMEOUT_MS } from "../../../src/lib/payment/tossConfirmClient";
import { confirmPaidReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import { recoverPendingPayment, PAYMENT_RECOVERY_TIMEOUT_MS } from "../../../src/lib/payment/paymentConfirmRecovery";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";

const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const products = [
  ["saju_mbti_full", "saju-mbti-full", "comprehensive"],
  ["career_money_study", "career-money-study", "career"],
  ["love_marriage_child", "love-marriage-child", "love"],
  ["major_fortune", "major-fortune", "major"],
  ["annual_fortune", "annual-fortune", "annual"],
  ["saju_mbti_compatibility", "compatibility", "compatibility"],
] as const;
function payload(productKey: string, productSlug: string) {
  return productKey === "saju_mbti_compatibility"
    ? { productKey, productSlug, relationshipType: "love", personA: person, personB: { ...person, name: "이서연", birthDate: "1998-03-14", gender: "FEMALE", mbtiType: "INTP" } }
    : { productKey, productSlug, person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: productKey === "annual_fortune" ? { selectedYear: "2026" } : {} };
}
const runtime = (fetchImpl: typeof fetch) => ({ enabled: true as const, config: { enabled: true as const, apiKey: "mock-only", model: "mock-model", fetchImpl } });
const request = { method: "POST", body: JSON.stringify({ model: "mock-model", input: [] }) };
beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(new Date("2026-09-22T00:00:00Z")); });
afterEach(() => vi.useRealTimers());

describe("actual writer transport boundaries — no providers", () => {
  it.each(products)("%s bounds a hanging transport, aborts and records timeout", async (key, slug, product) => {
    const transport = vi.fn<typeof fetch>(() => new Promise(() => {}));
    const running = generateProductReport(payload(key, slug), runtime(transport), "normal_writer");
    await vi.advanceTimersByTimeAsync(REPORT_WRITER_TIMEOUT_MS);
    expect(await running).toMatchObject({ ok: true, delivery: { fallbackUsed: true, failureCode: "OPENAI_TIMEOUT" }, externalCalls: [{ outcome: "timeout", durationMs: 120000, inputTokens: null }] });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(transport.mock.calls[0][1]?.signal?.aborted).toBe(true);
    expect(JSON.parse(String(transport.mock.calls[0][1]?.body)).max_output_tokens).toBe(REPORT_OUTPUT_TOKENS[product]);
  });

  it.each(products)("%s has a bounded automatic run and a network-free fallback", async (key, slug) => {
    const transport = vi.fn<typeof fetch>(async () => Response.json({ output_text: "{}" }));
    const input = payload(key, slug);
    for (const strategy of ["normal_writer", "writer_regeneration"] as const) expect((await generateProductReport(input, runtime(transport), strategy)).ok).toBe(true);
    expect(transport).toHaveBeenCalledTimes(1);
    const before = transport.mock.calls.length;
    expect((await generateProductReport(input, runtime(transport), "deterministic_fallback")).ok).toBe(true);
    expect(transport).toHaveBeenCalledTimes(before);
  });

  it("compatibility invalid output falls back immediately without waiting for a repair", async () => {
    const transport = vi.fn<typeof fetch>().mockResolvedValueOnce(Response.json({ output_text: "{}", usage: { input_tokens: 10, output_tokens: 2, total_tokens: 12 } })).mockImplementation(() => new Promise(() => {}));
    const running = generateProductReport(payload("saju_mbti_compatibility", "compatibility"), runtime(transport), "normal_writer");
    await vi.advanceTimersByTimeAsync(REPORT_WRITER_TIMEOUT_MS);
    expect(await running).toMatchObject({ ok: true, delivery: { fallbackUsed: true, failureCode: "WRITER_VALIDATION_FAILED" }, externalCalls: [{ inputTokens: 10, outputTokens: 2, totalTokens: 12, outcome: "validation" }] });
    expect(transport).toHaveBeenCalledTimes(1);
    expect(REPORT_WRITER_TIMEOUT_MS * 2).toBeLessThan(300000);
    for (const call of transport.mock.calls) expect(JSON.parse(String(call[1]?.body)).max_output_tokens).toBe(REPORT_OUTPUT_TOKENS.compatibility);
  });

  it("worker records timeout and completes with validated fallback in the same attempt", async () => {
    const transport = vi.fn<typeof fetch>(() => new Promise(() => {}));
    const call = vi.fn<ReliabilityStore["call"]>(async action => action === "claim_job"
      ? { ok: true, job: { job_id: "job", report_id: "report_timeout", created_at: "2026-09-22T00:00:00Z", lease_token: "lease", attempt_count: 1, product_type: "career_money_study", payload: payload("career_money_study", "career-money-study") } }
      : { ok: true, status: "COMPLETED" });
    const running = runPaidReportJob({ call }, runtime(transport));
    await vi.advanceTimersByTimeAsync(REPORT_WRITER_TIMEOUT_MS);
    expect(await running).toMatchObject({ status: "COMPLETED" });
    expect(call).toHaveBeenLastCalledWith("finish_job", expect.objectContaining({ success: true, delivery: expect.objectContaining({ fallbackUsed: true, failureCode: "OPENAI_TIMEOUT" }), externalCalls: [expect.objectContaining({ outcome: "timeout", durationMs: 120000 })] }));
    expect(call).toHaveBeenCalledTimes(2);
  });

  it("bounds body consumption and ignores a late body after timeout", async () => {
    let complete!: (body: unknown) => void;
    const transport = vi.fn<typeof fetch>(async () => ({ ok: true, status: 200, json: () => new Promise(resolve => { complete = resolve; }) }) as Response);
    const budget: WriterCallBudget = { limit: 1, calls: [] };
    const running = guardedReportFetch({ fetchImpl: transport, callBudget: budget }, "career")("mock://openai", request);
    const rejected = expect(running).rejects.toThrow("EXTERNAL_CALL_TIMEOUT");
    await vi.advanceTimersByTimeAsync(REPORT_WRITER_TIMEOUT_MS);
    await rejected;
    complete({ output_text: "{}", usage: { input_tokens: 999 } });
    await Promise.resolve();
    expect(budget.calls[0]).toMatchObject({ outcome: "timeout", inputTokens: null });
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each(["comprehensive", "compatibility"] as const)("%s hard budget rejects 100 accidental wrapper calls", async product => {
    const transport = vi.fn<typeof fetch>(async () => Response.json({ output_text: "{bad" }));
    const budget: WriterCallBudget = { limit: product === "compatibility" ? 2 : 1, calls: [] };
    for (let i = 0; i < 100; i++) await guardedReportFetch({ fetchImpl: transport, callBudget: budget }, product)("mock://openai", request).catch(() => undefined);
    expect(transport).toHaveBeenCalledTimes(budget.limit);
  });

  it.each([
    [429, { error: { code: "rate_limit_exceeded", message: "PRIVATE" } }, "rate_limit"],
    [429, { error: { code: "insufficient_quota" } }, "quota"],
    [401, { error: { code: "invalid_api_key" } }, "config"],
    [404, { error: { code: "model_not_found" } }, "config"],
    [500, { error: { message: "PRIVATE" } }, "provider"],
  ] as const)("HTTP %s has a safe internal classification", async (status, body, outcome) => {
    const transport = vi.fn<typeof fetch>(async () => Response.json(body, { status }));
    const result = await generateProductReport(payload("career_money_study", "career-money-study"), runtime(transport), "normal_writer");
    expect(result).toMatchObject({ ok: true, delivery: { failureCode: `OPENAI_${outcome.toUpperCase()}`, fallbackUsed: true }, externalCalls: [{ outcome }] });
    expect(JSON.stringify(result.externalCalls)).not.toContain("PRIVATE");
    expect(transport).toHaveBeenCalledTimes(1);
  });

  it.each([
    { status: "incomplete" }, { status: "completed", incomplete_details: { reason: "max_output_tokens" } },
    { status: "completed", output: [{ status: "incomplete" }] }, { status: "failed", error: { code: "server_error" } },
  ])("rejects incomplete even when the output JSON parses", async metadata => {
    const transport = vi.fn<typeof fetch>(async () => Response.json({ output_text: "{}", ...metadata }));
    const result = await generateProductReport(payload("career_money_study", "career-money-study"), runtime(transport), "normal_writer");
    expect(result).toMatchObject({ ok: true, delivery: { failureCode: "OPENAI_INCOMPLETE", fallbackUsed: true } });
  });

  it("preserves valid long drafts and usage with no content shortening", async () => {
    for (const [key, slug] of products.filter(([key]) => key !== "saju_mbti_full")) {
      const prepared = await generateProductReport(payload(key, slug), { enabled: false, reason: "flag_disabled" }, "deterministic_fallback");
      if (!prepared.ok) throw new Error("INVALID_FIXTURE");
      const draft = prepared.draft;
      const transport = vi.fn<typeof fetch>(async () => Response.json({ status: "completed", output_text: JSON.stringify(draft), usage: { input_tokens: 10000, output_tokens: 12000, total_tokens: 22000 } }));
      const result = await generateProductReport(payload(key, slug), runtime(transport), "normal_writer");
      expect(result, key).toMatchObject({ ok: true, externalCalls: [{ model: "mock-model", inputTokens: 10000, outputTokens: 12000, totalTokens: 22000, outcome: "completed" }] });
    }
  });

  it("missing usage remains unknown; oversize input sends no HTTP", async () => {
    const budget: WriterCallBudget = { limit: 1, calls: [] };
    const transport = vi.fn<typeof fetch>(async () => Response.json({ output_text: "{}" }));
    const guarded = guardedReportFetch({ fetchImpl: transport, callBudget: budget }, "annual");
    await expect(guarded("mock://openai", { body: JSON.stringify({ input: "x".repeat(REPORT_WRITER_INPUT_BYTES) }) })).rejects.toThrow("OPENAI_INPUT_LIMIT");
    expect(transport).not.toHaveBeenCalled();
    await guarded("mock://openai", request);
    expect(budget.calls[0]).toMatchObject({ inputTokens: null, outputTokens: null, totalTokens: null });
  });

  it("missing configuration makes no calls", async () => {
    const transport = vi.fn<typeof fetch>();
    const result = await generateProductReport(payload("career_money_study", "career-money-study"), { enabled: false, reason: "missing_api_key" }, "normal_writer");
    expect(result).toMatchObject({ ok: true, delivery: { fallbackUsed: true, failureCode: "OPENAI_CONFIG" }, externalCalls: [] });
    expect(transport).not.toHaveBeenCalled();
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
