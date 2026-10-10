import { afterAll, beforeAll, beforeEach, expect, it, vi } from "vitest";
import { paidWorkerSql, seedPaid } from "../../helpers/paidWorkerSql";
import { runPaidReportBatch } from "../../../src/lib/book/paidWorkerBatch";
import { runPaidReportJob, type ProductGenerator } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { createAnnualCommerceAcceptance } from "../../../src/lib/payment/annualPurchasePolicy";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "../interpretation-v4/runtimeFixtures";
import { storedBook } from "../../../src/lib/book/storedReport";

vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => true }));
const runtime = { enabled: false, reason: "flag_disabled" } as const;
const deps = { now: () => 0, rss: () => 0 };
let sql: Awaited<ReturnType<typeof paidWorkerSql>>;
let valid: ProductGenerationSuccessResult;
const payload = { ...RUNTIME_FIXTURES[0].payload, productOptions: {} };
beforeAll(async () => {
  sql = await paidWorkerSql();
  const result = await generateProductReport(payload, runtime, "deterministic_fallback");
  expect(result.ok).toBe(true); valid = result as ProductGenerationSuccessResult;
}, 30000);
beforeEach(async () => { await sql.db.exec("truncate payment_orders cascade"); });
afterAll(async () => { await sql?.db.close(); });
const rows = async (table: string) => (await sql.db.query<Record<string, unknown>>(`select * from ${table}`)).rows;
const runJob = (store: ReliabilityStore) => runPaidReportJob(store, runtime, async () => valid);

it("real six-product V4 batch publishes once each through SQL → validator → stored Book; legacy stays V3", async () => {
  for (const f of RUNTIME_FIXTURES) await seedPaid(sql.store, f.id, f.payload, {
    bookGeneration: { version: "v4", evaluatedAt: SHADOW_CLOCK.evaluatedAt },
    ...(f.id === "annual" ? { annualCommerceAcceptance: createAnnualCommerceAcceptance(2026, new Date(SHADOW_CLOCK.evaluatedAt)) } : {}),
  });
  await seedPaid(sql.store, "legacy", payload);
  const result = await runPaidReportBatch(sql.store, runtime, deps);
  expect(result).toMatchObject({ completed: 7, processed: 7, stop: "empty" });
  const snapshots = await rows("paid_report_snapshots");
  for (const row of snapshots) {
    const snapshot = row.snapshot_json as Record<string, unknown>;
    if (row.order_id === "legacy") { expect(snapshot.productVersion).not.toBe("v4"); continue; }
    expect(snapshot.productVersion).toBe("v4");
    const book = storedBook(snapshot); expect(book, String(row.order_id)).toBeTruthy();
    if (row.order_id === "major") expect((snapshot.draft as { major: { years: unknown[] } }).major.years).toHaveLength(14);
    if (row.order_id === "annual") expect((snapshot.draft as { annual: { months: unknown[] } }).annual.months).toHaveLength(12);
  }
  expect(await runPaidReportBatch(sql.store, runtime, deps)).toMatchObject({ processed: 0 });
  expect(await rows("paid_report_snapshots")).toEqual(snapshots);
  expect(await rows("report_generation_attempts")).toHaveLength(7);
  expect(fetch).not.toHaveBeenCalled();
}, 120000);

it("overlapping cron / two workers claim distinct jobs and cannot publish a duplicate", async () => {
  for (let i = 0; i < 12; i++) await seedPaid(sql.store, `parallel-${i}`, payload);
  const finished: Record<string, unknown>[] = [];
  const capture: ReliabilityStore = { call: (action, data) => { if (action === "finish_job") finished.push(data!); return sql.store.call(action, data); } };
  const results = await Promise.all([runPaidReportBatch(capture, runtime, { ...deps, runJob }), runPaidReportBatch(capture, runtime, { ...deps, runJob })]);
  expect(results.reduce((n, r) => n + r.completed, 0)).toBe(12);
  expect(await rows("report_generation_attempts")).toHaveLength(12);
  expect(new Set(finished.map(f => f.jobId)).size).toBe(12);
  expect(await sql.store.call("finish_job", finished[0])).toMatchObject({ ok: false, code: "STALE_LEASE" });
  expect((await rows("paid_report_snapshots")).every(r => r.status === "COMPLETED")).toBe(true);
});

it("crashed claim waits for lease expiry; retry never re-enters external writer", async () => {
  await seedPaid(sql.store, "crash", payload);
  const job = (await sql.store.call("claim_job")).job as Record<string, unknown>;
  expect(await runPaidReportBatch(sql.store, runtime, { ...deps, runJob })).toMatchObject({ processed: 0 });
  await sql.db.exec("update report_generation_jobs set lease_until=now()-interval '1 second'");
  const generate = vi.fn<ProductGenerator>(async () => valid);
  expect(await runPaidReportBatch(sql.store, runtime, { ...deps, runJob: s => runPaidReportJob(s, runtime, generate) })).toMatchObject({ completed: 1 });
  expect(generate.mock.calls[0]?.[2]).toBe("deterministic_fallback");
  expect(await sql.store.call("finish_job", { jobId: job.job_id, token: job.lease_token, success: false })).toMatchObject({ code: "STALE_LEASE" });
});

it.each([false, true])("lost finish acknowledgement after commit=%s stops batch; next cron/lease recovers without double publication", async committed => {
  await seedPaid(sql.store, "uncertain", payload); await seedPaid(sql.store, "healthy", payload);
  let failed = false;
  const transport: ReliabilityStore = { call: async (action, data) => {
    if (action === "finish_job" && !failed) { failed = true; if (committed) await sql.store.call(action, data); return { ok: false, code: "DURABLE_STORAGE_FAILED" }; }
    return sql.store.call(action, data);
  } };
  expect(await runPaidReportBatch(transport, runtime, { ...deps, runJob })).toMatchObject({ ok: false, stop: "storage_error" });
  const before = await rows("paid_report_snapshots");
  await sql.db.exec("update report_generation_jobs set lease_until=now()-interval '1 second' where status='RUNNING'");
  expect(await runPaidReportBatch(sql.store, runtime, { ...deps, runJob })).toMatchObject({ completed: committed ? 1 : 2 });
  const after = await rows("paid_report_snapshots");
  expect(after.every(r => r.status === "COMPLETED")).toBe(true);
  if (committed) expect(after.find(r => r.order_id === "uncertain")).toEqual(before.find(r => r.order_id === "uncertain"));
  expect(await rows("report_generation_attempts")).toHaveLength(committed ? 2 : 3);
});
