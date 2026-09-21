import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { confirmPaidReport, readPublishedReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { privacyPolicyRetentionRows } from "../../../src/lib/legal/privacyPolicy";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => store }));
import ReportResultPage from "../../../src/app/reports/[reportId]/page";

const patch = readFileSync("scripts/paid_report_publish_expiry_patch.sql", "utf8");
const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "만료검증", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: {} };
const runtime = { enabled: false as const, reason: "flag_disabled" as const };
const payment = { orderId: "order-expiry", paymentKey: "mock-only", amount: 1290 };
const mockConfirm = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: payment.orderId, amount: 1290, status: "DONE" } }));
let db: PGlite;
let store: ReliabilityStore;
let valid: ProductGenerationSuccessResult;
let id: string;
async function rows(table: string) { return (await db.query(`select * from ${table}`)).rows as Record<string, unknown>[]; }
async function report() { return (await rows("paid_report_snapshots"))[0]; }
async function due() { await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second'"); }
async function publish() {
  expect(await runPaidReportJob(store, runtime, async () => valid)).toMatchObject({ status: "COMPLETED" });
  return report();
}
function time(value: unknown) { return value instanceof Date ? value.getTime() : new Date(String(value)).getTime(); }
beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const file of readdirSync("supabase/migrations").filter(name => /^\d{4}_.*\.sql$/u.test(name)).sort()) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/u, ""));
  }
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql"]) await db.exec(readFileSync(file, "utf8"));
  await db.exec(patch);
  store = { async call(action, data = {}) {
    return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value;
  } };
  const result = await generateProductReport(payload, runtime, "deterministic_fallback");
  expect(result.ok).toBe(true);
  valid = result as ProductGenerationSuccessResult;
}, 30000);
beforeEach(async () => {
  mockConfirm.mockClear();
  vi.stubEnv("NODE_ENV", "production");
  await db.exec("truncate payment_orders cascade");
  expect(await store.call("create_order", { paymentOrderId: "po-expiry", providerOrderId: payment.orderId, productType: payload.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
  const paid = await confirmPaidReport(payment, store, mockConfirm);
  expect(paid.ok).toBe(true);
  id = String(paid.reportId);
});
afterEach(() => { vi.unstubAllEnvs(); });
afterAll(async () => { await db?.close(); });

describe("publication-based paid access and retention — real SQL", () => {
  it("a 24-hour generation delay costs no access time, matching input/result privacy SSOT", async () => {
    expect(privacyPolicyRetentionRows.slice(0, 2).map(row => row.periodKo)).toEqual(["리포트 생성일로부터 90일", "리포트 생성일로부터 90일"]);
    await db.exec("update payment_orders set paid_at=now()-interval '1 day'; update paid_report_snapshots set created_at=now()-interval '1 day'; update report_input_snapshots set expires_at=now()+interval '89 days'");
    const provisionalInput = (await rows("report_input_snapshots"))[0];
    expect(await report()).toMatchObject({ published_at: null, expires_at: null });
    const completed = await publish();
    expect(time(completed.published_at) - time((await rows("payment_orders"))[0].paid_at)).toBeGreaterThanOrEqual(86400000);
    expect(time(completed.expires_at) - time(completed.published_at)).toBe(90 * 86400000);
    const input = (await rows("report_input_snapshots"))[0];
    expect(input.expires_at).toEqual(completed.expires_at);
    expect(time(input.expires_at)).toBeGreaterThan(time(provisionalInput.expires_at));
    expect(input.payload_json).toEqual(provisionalInput.payload_json);
    await store.call("expire");
    expect((await rows("report_input_snapshots"))[0]).toEqual(input);
    expect(time((completed.snapshot_json as { createdAtIso: string }).createdAtIso)).toBe(time(completed.published_at));
  });

  it.each(["QUEUED", "GENERATING", "RETRYING", "FAILED_REQUIRES_ATTENTION"])("%s has no access countdown and expiry worker leaves retained input alone", async status => {
    if (status === "GENERATING") await store.call("claim_job");
    const failures = status === "FAILED_REQUIRES_ATTENTION" ? 3 : status === "RETRYING" ? 1 : 0;
    for (let i = 0; i < failures; i++) { await due(); await runPaidReportJob(store, runtime, async () => ({ ok: false, error: { code: "INVALID_REPORT_INPUT", message: "mock" } })); }
    const input = await rows("report_input_snapshots");
    expect(await report()).toMatchObject({ status, expires_at: null, published_at: null });
    await store.call("expire");
    expect(await report()).toMatchObject({ status, expires_at: null });
    expect(await rows("report_input_snapshots")).toEqual(input);
  });

  it.each([2, 3])("first success after %i failures/admin retry starts the full term", async failures => {
    await db.exec("update payment_orders set paid_at=now()-interval '4 days'; update paid_report_snapshots set created_at=now()-interval '4 days'");
    for (let i = 0; i < failures; i++) {
      await due(); await runPaidReportJob(store, runtime, async () => ({ ok: false, error: { code: "INVALID_REPORT_INPUT", message: "mock" } }));
      expect(await report()).toMatchObject({ expires_at: null, published_at: null });
    }
    if (failures === 3) expect(await store.call("admin_retry", { reportId: id })).toMatchObject({ ok: true });
    await due();
    const completed = await publish();
    expect(time(completed.expires_at) - time(completed.published_at)).toBe(90 * 86400000);
    expect(time(completed.published_at) - time((await rows("payment_orders"))[0].paid_at)).toBeGreaterThanOrEqual(4 * 86400000);
  });

  it("duplicate completion/callback/read never changes first publication or expiry", async () => {
    let completion: Record<string, unknown> = {};
    const capturing: ReliabilityStore = { call: async (action, data) => { if (action === "finish_job") completion = data ?? {}; return store.call(action, data); } };
    await runPaidReportJob(capturing, runtime, async () => valid);
    const original = await report();
    expect(await store.call("finish_job", completion)).toMatchObject({ ok: false, code: "STALE_LEASE" });
    expect(await confirmPaidReport(payment, store, mockConfirm)).toMatchObject({ reportId: id });
    expect(mockConfirm).toHaveBeenCalledTimes(1);
    await readPublishedReport(store, id); await readPublishedReport(store, id);
    await runPaidReportJob(store, runtime, async () => valid);
    expect(await report()).toEqual(original);
  });

  it("quarantine and corrected publication preserve the original term and input expiry", async () => {
    const original = await publish();
    const input = await rows("report_input_snapshots");
    expect(await store.call("quarantine", { reportId: id, expectedSnapshot: original.snapshot_json })).toMatchObject({ quarantined: true });
    expect(await store.call("admin_retry", { reportId: id })).toMatchObject({ ok: true });
    const corrected = await publish();
    expect(corrected.published_at).toEqual(original.published_at);
    expect(corrected.expires_at).toEqual(original.expires_at);
    expect(await rows("report_input_snapshots")).toEqual(input);
  });

  it("one microsecond before expiry is readable; exact deadline and later are expired on direct/shared paths", async () => {
    await publish();
    await db.exec("begin; update paid_report_snapshots set published_at=now()-interval '2160 hours'+interval '1 microsecond',expires_at=now()+interval '1 microsecond'");
    try {
      expect(await readPublishedReport(store, id)).toMatchObject({ status: "COMPLETED" });
      const sharedUrl = new URL(`https://example.com/reports/${id}`);
      const sharedId = sharedUrl.pathname.split("/").at(-1)!;
      expect(sharedId).toBe(id);
      const render = () => ReportResultPage({ params: Promise.resolve({ reportId: sharedId }) });
      expect(renderToStaticMarkup(await render())).toContain("리포트 공유하기");
      await db.exec("update paid_report_snapshots set published_at=now()-interval '2160 hours',expires_at=now()");
      expect(await readPublishedReport(store, id)).toMatchObject({ status: "EXPIRED", snapshot: null });
      const expired = renderToStaticMarkup(await render());
      expect(expired).toContain("90일");
      expect(expired).not.toContain("리포트 공유하기");
      await db.exec("update paid_report_snapshots set published_at=now()-interval '2160 hours'-interval '1 second',expires_at=now()-interval '1 second'");
      expect(await readPublishedReport(store, id)).toMatchObject({ status: "EXPIRED", snapshot: null });
    } finally { await db.exec("rollback"); }
  });

  it("expiry clears quarantined snapshot/input/validation data and preserves financial records", async () => {
    const completed = await publish();
    await store.call("quarantine", { reportId: id, expectedSnapshot: completed.snapshot_json });
    await db.exec("update paid_report_snapshots set published_at=now()-interval '2160 hours'-interval '1 second',expires_at=now()-interval '1 second'; update report_input_snapshots set expires_at=now()-interval '1 second'; update report_generation_attempts set validation_errors='[\"private diagnostic\"]'");
    await store.call("expire");
    expect(await report()).toMatchObject({ status: "EXPIRED", snapshot_json: null });
    expect(await rows("report_input_snapshots")).toHaveLength(0);
    expect((await rows("report_generation_attempts"))[0].validation_errors).toEqual([]);
    expect((await rows("payment_orders"))[0].status).toBe("paid");
    expect(await store.call("admin_retry", { reportId: id })).toMatchObject({ ok: false });
  });

  it("unpublished input retention exhaustion is attention, never an invented access expiry", async () => {
    await runPaidReportJob(store, runtime);
    await db.exec("update report_input_snapshots set expires_at=now()-interval '1 second'; update report_generation_attempts set validation_errors='[\"private diagnostic\"]'");
    await store.call("expire");
    expect(await report()).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION", expires_at: null, published_at: null });
    expect((await rows("report_generation_jobs"))[0].last_error_code).toBe("INPUT_RETENTION_EXPIRED");
    expect((await rows("report_generation_attempts"))[0].validation_errors).toEqual([]);
    expect(await rows("report_input_snapshots")).toHaveLength(0);
    expect((await rows("payment_orders"))[0].status).toBe("paid");
  });

  it.each([false, true])("input expiry before finish (cleanup=%s) cannot publish or revive deleted input", async cleanup => {
    const outcome = await runPaidReportJob(store, runtime, async () => {
      await db.exec("update report_input_snapshots set expires_at=now()-interval '1 second'");
      if (cleanup) await store.call("expire");
      return valid;
    });
    expect(outcome).toMatchObject({ ok: false, code: cleanup ? "STALE_LEASE" : "INPUT_EXPIRED" });
    await store.call("expire");
    expect(await report()).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION", published_at: null, expires_at: null, snapshot_json: null });
    expect(await rows("report_input_snapshots")).toHaveLength(0);
    expect((await rows("payment_orders"))[0].status).toBe("paid");
  });

  it("rejects COMPLETED without publication and expiry at the database boundary", async () => {
    await expect(db.query("update paid_report_snapshots set status='COMPLETED',snapshot_json=$1::jsonb,gate_version='paid-report-v1'", [JSON.stringify({ draft: valid.draft })])).rejects.toThrow("paid_report_snapshots_access_expiry_check");
    expect(await report()).toMatchObject({ status: "QUEUED", published_at: null, expires_at: null });
  });

  it("patch reapplication preserves populated rows, RPC permissions, and absolute 90 days under DST timezone", async () => {
    await db.exec("set timezone='America/New_York'");
    const completed = await publish();
    expect(time(completed.expires_at) - time(completed.published_at)).toBe(90 * 86400000);
    await db.exec(patch); await db.exec(patch);
    expect(await report()).toEqual(completed);
    for (const role of ["anon", "authenticated", "service_role"]) {
      const result = await db.query<{ allowed: boolean }>("select has_function_privilege($1,'public.paid_report_reliability(text,jsonb)','EXECUTE') as allowed", [role]);
      expect(result.rows[0].allowed).toBe(role === "service_role");
    }
  });

  it("read-only single-result postflight passes with pending and published data", async () => {
    const verify = async () => {
      const result = await db.query<{ pass: boolean; check_name: string; detail: string }>(readFileSync("scripts/paid_report_publish_expiry_verify.sql", "utf8"));
      expect(result.rows.filter(row => !row.pass)).toEqual([]);
      expect(result.rows.find(row => row.check_name === "PUBLISH_EXPIRY_SUMMARY")).toMatchObject({ detail: "failed=0 total=8" });
    };
    await verify();
    await publish();
    await verify();
    await expect(db.exec("update paid_report_snapshots set expires_at=expires_at-interval '1 day'")).rejects.toThrow("paid_report_snapshots_access_expiry_check");
  });

  it("incompatible existing data stops the patch transaction without changing rows or defaults", async () => {
    await db.exec("alter table paid_report_snapshots drop constraint paid_report_snapshots_access_expiry_check; alter table paid_report_snapshots alter column expires_at set default now()+interval '90 days'; update paid_report_snapshots set expires_at=now()+interval '90 days'");
    const original = await report();
    await expect(db.exec(patch)).rejects.toThrow("EXISTING_REPORT_EXPIRY_REVIEW_REQUIRED");
    await db.exec("rollback");
    expect(await report()).toEqual(original);
    expect((await db.query<{ column_default: string }>("select column_default from information_schema.columns where table_name='paid_report_snapshots' and column_name='expires_at'")).rows[0].column_default).toContain("90 days");
    // Local fixture reset only; never production backfill.
    await db.exec("truncate payment_orders cascade");
    await db.exec(patch);
  });
});
