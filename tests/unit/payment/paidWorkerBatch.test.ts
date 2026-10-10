import { describe, expect, it, vi } from "vitest";
import { PAID_WORKER_LIMITS, runPaidReportBatch } from "../../../src/lib/book/paidWorkerBatch";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";

const runtime = { enabled: false, reason: "flag_disabled" } as const;
const store: ReliabilityStore = { call: vi.fn() };
const dependencies = { now: () => 0, rss: () => 0 };

describe("bounded paid worker admission (no new job state machine)", () => {
  it("runs at most eight sequential jobs, retaining no job payloads", async () => {
    let active = 0, peak = 0;
    const runJob = vi.fn(async () => { peak = Math.max(peak, ++active); await Promise.resolve(); active--; return { ok: true, status: "COMPLETED" }; });
    expect(await runPaidReportBatch(store, runtime, { ...dependencies, runJob })).toEqual({ ok: true, processed: 8, completed: 8, retrying: 0, attention: 0, stop: "job_limit" });
    expect(peak).toBe(1); expect(runJob).toHaveBeenCalledTimes(8);
    expect(store.call).not.toHaveBeenCalled();
  });
  it("empty queue returns after one claim, not eight empty polls", async () => {
    const runJob = vi.fn(async () => ({ ok: true, job: null }));
    expect(await runPaidReportBatch(store, runtime, { ...dependencies, runJob })).toMatchObject({ processed: 0, stop: "empty" });
    expect(runJob).toHaveBeenCalledTimes(1);
  });
  it("honors the inclusive time boundary including expiry overhead", async () => {
    let time = 40_000;
    const runJob = vi.fn(async () => { time += 5_000; return { ok: true, status: "COMPLETED" }; });
    expect(await runPaidReportBatch(store, runtime, { ...dependencies, startedAt: 0, now: () => time, runJob })).toMatchObject({ processed: 1, stop: "time_budget" });
    expect(runJob).toHaveBeenCalledTimes(1);
  });
  it("lets a slow legacy writer finish, then admits no further work", async () => {
    let time = 0;
    const runJob = vi.fn(async () => { time += 120_000; return { ok: true, status: "COMPLETED" }; });
    expect(await runPaidReportBatch(store, { enabled: true, config: { enabled: true, apiKey: "mock", model: "mock" } }, { ...dependencies, now: () => time, runJob })).toMatchObject({ completed: 1, stop: "time_budget" });
    expect(runJob).toHaveBeenCalledTimes(1);
  });
  it("does not claim at high process RSS; rechecks between every job", async () => {
    let memory = PAID_WORKER_LIMITS.maxRssBytes;
    const runJob = vi.fn(async () => { memory = PAID_WORKER_LIMITS.maxRssBytes; return { ok: true, status: "COMPLETED" }; });
    const opts = { ...dependencies, rss: () => memory, runJob };
    expect(await runPaidReportBatch(store, runtime, opts)).toMatchObject({ ok: false, processed: 0, stop: "memory_budget" });
    expect(runJob).not.toHaveBeenCalled();
    memory = 0;
    expect(await runPaidReportBatch(store, runtime, opts)).toMatchObject({ processed: 1, stop: "memory_budget" });
  });
  it("durable retry/attention failures do not block the next healthy order", async () => {
    const runJob = vi.fn().mockResolvedValueOnce({ ok: true, status: "RETRYING" }).mockResolvedValueOnce({ ok: true, status: "FAILED_REQUIRES_ATTENTION" }).mockResolvedValueOnce({ ok: true, status: "COMPLETED" }).mockResolvedValue({ ok: true, job: null });
    expect(await runPaidReportBatch(store, runtime, { ...dependencies, runJob })).toEqual({ ok: true, processed: 3, completed: 1, retrying: 1, attention: 1, stop: "empty" });
  });
  it.each([false, true])("lost DB/HTTP acknowledgement (throws=%s) stops without retrying or releasing a lease", async throws => {
    const runJob = vi.fn().mockResolvedValueOnce({ ok: true, status: "COMPLETED" });
    if (throws) runJob.mockRejectedValue(new Error("PRIVATE provider response"));
    else runJob.mockResolvedValue({ ok: false, code: "DURABLE_STORAGE_FAILED" });
    const result = await runPaidReportBatch(store, runtime, { ...dependencies, runJob });
    expect(result).toMatchObject({ ok: false, processed: 1, stop: "storage_error" });
    expect(runJob).toHaveBeenCalledTimes(2); expect(JSON.stringify(result)).not.toContain("PRIVATE");
  });
});
