import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { expect, it, vi } from "vitest";
import { runPaidReportBatch } from "../../../src/lib/book/paidWorkerBatch";
import { runPublicPaidReportJob } from "../../../src/lib/book/paidRuntime";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { createAnnualCommerceAcceptance } from "../../../src/lib/payment/annualPurchasePolicy";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "../interpretation-v4/runtimeFixtures";

vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => true }));
it.skipIf(!["before", "after"].includes(process.env.GYEOL_WORKER_MEASURE ?? ""))("local real V4 generation measurement, process-only gate stub, no DB or providers", async () => {
  const mode = process.env.GYEOL_WORKER_MEASURE!;
  let index = -1, finished = 0, calls = 0;
  const metrics: object[] = [];
  const digests: string[] = [];
  const store: ReliabilityStore = { async call(action, data = {}) {
    calls++;
    if (action === "claim_job") {
      index++; if (index >= 8) return { ok: true, job: null };
      const f = RUNTIME_FIXTURES[index % 6];
      return { ok: true, job: { job_id: `job-${index}`, order_id: `order-${index}`, report_id: `report-${index}`, product_type: f.payload.productKey, payload: f.payload, created_at: SHADOW_CLOCK.evaluatedAt, lease_token: "mock", attempt_count: 1 } };
    }
    if (action === "find_order") {
      const f = RUNTIME_FIXTURES[index % 6];
      return { ok: true, order: { payment_order_id: `order-${index}`, report_id: `report-${index}`, product_type: f.payload.productKey, status: "paid", input_snapshot: { reportInputPayload: f.payload, bookGeneration: { version: "v4", evaluatedAt: SHADOW_CLOCK.evaluatedAt }, ...(f.id === "annual" ? { annualCommerceAcceptance: createAnnualCommerceAcceptance(2026, new Date(SHADOW_CLOCK.evaluatedAt)) } : {}) } } };
    }
    expect(action).toBe("finish_job"); expect(data.success, String(data.code)).toBe(true);
    expect(data.externalCalls).toEqual([]); finished++;
    digests.push(createHash("sha256").update(JSON.stringify(data.snapshot)).digest("hex"));
    return { ok: true, status: "COMPLETED" };
  } };
  const runtime = { enabled: false, reason: "flag_disabled" } as const;
  const measured: typeof runPublicPaidReportJob = async (s, r) => {
    const start = performance.now(), used = process.cpuUsage(), priorCalls = calls;
    const result = await runPublicPaidReportJob(s, r), cpu = process.cpuUsage(used);
    metrics.push({ product: RUNTIME_FIXTURES[index % 6].id, wallMs: performance.now() - start, cpuMs: (cpu.user + cpu.system) / 1000, rssMiB: process.memoryUsage.rss() / 1024 ** 2, peakRssMiB: process.resourceUsage().maxRSS / 1024, rpcCount: calls - priorCalls });
    return result;
  };
  const start = performance.now(), used = process.cpuUsage();
  const batch = mode === "after" ? await runPaidReportBatch(store, runtime, { runJob: measured }) : null;
  if (mode === "before") for (let i = 0; i < 8; i++) await measured(store, runtime);
  const cpu = process.cpuUsage(used);
  expect(finished).toBeGreaterThan(0); expect(fetch).not.toHaveBeenCalled();
  writeFileSync(`/tmp/gyeol-ops-measure-${mode}.json`, JSON.stringify({ mode, batch, completed: finished, wallMs: performance.now() - start, cpuMs: (cpu.user + cpu.system) / 1000, peakRssMiB: process.resourceUsage().maxRSS / 1024, metrics, digests, scope: "local sequential real V4 with synthetic store, includes cold runtime imports, no DB/network/provider; before=8 individual invocations without cron waits; after=one bounded invocation" }, null, 2));
}, 120000);
