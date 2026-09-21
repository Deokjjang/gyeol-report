import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";

import { recoverPendingPayment, PAYMENT_RECOVERY_TIMEOUT_MS } from "../../../src/lib/payment/paymentConfirmRecovery";
import { confirmPaidReport } from "../../../src/lib/payment/paidReportReliability";
import { confirmTossPayment } from "../../../src/lib/payment/tossConfirmClient";
import type { TossConfirmRequest } from "../../../src/lib/payment/tossConfirmTypes";

let db: PGlite;
let store: ReliabilityStore;
const input = { reportInputPayload: { productKey: "saju_mbti_full", person: { name: "mock" } } };
beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const file of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/, ""));
  // Wrong production application order must fail before any columns/RPC change.
  await expect(db.exec(readFileSync("scripts/paid_payment_confirm_recovery_queue_patch.sql", "utf8"))).rejects.toThrow("QUARANTINE_PATCH_REQUIRED");
  await db.exec("rollback");
  expect((await db.query("select column_name from information_schema.columns where table_name='payment_orders' and column_name='recovery_attempt_count'")).rows).toEqual([]);
  await db.exec(readFileSync("scripts/paid_report_quarantine_recovery_patch.sql", "utf8"));
  store = { async call(action, data = {}) {
    return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value;
  } };
}, 30000);
afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec("truncate payment_orders cascade");
  await db.exec(readFileSync("scripts/paid_payment_confirm_recovery_queue_patch.sql", "utf8"));
  await db.exec(readFileSync("scripts/paid_report_publish_expiry_patch.sql", "utf8"));
  await db.exec(readFileSync("scripts/paid_report_external_call_guard_patch.sql", "utf8"));
});
afterEach(() => vi.useRealTimers());
async function order(id: string) {
  await store.call("create_order", { paymentOrderId: id, providerOrderId: `order-${id}`, productType: "saju_mbti_full", provider: "toss", amount: 1290, inputSnapshot: input });
  await store.call("confirm_claim", { orderId: `order-${id}`, paymentKey: `mock-${id}`, amount: 1290 });
  await db.query("update payment_orders set confirm_lease_until=now()-interval '1 second' where payment_order_id=$1", [id]);
}
describe("payment recovery SQL", () => {
  it("reproduces the pre-patch starvation: expired A remains head ahead of recoverable B and C", async () => {
    await db.exec(readFileSync("scripts/paid_report_quarantine_recovery_patch.sql", "utf8"));
    await order("A"); await order("B"); await order("C");
    await db.exec("update payment_orders set created_at=created_at-interval '1 day' where payment_order_id='A'; update report_input_snapshots set expires_at=now()-interval '1 second' where order_id='A'");
    for (let i = 0; i < 3; i++) {
      expect(await store.call("pending_payment")).toMatchObject({ order: { payment_order_id: "A" } });
      expect(await store.call("confirm_claim", { orderId: "order-A", paymentKey: "mock-A", amount: 1290 })).toMatchObject({ ok: false, code: "INPUT_EXPIRED" });
    }
    expect((await db.query("select status from payment_orders where payment_order_id in ('B','C')")).rows).toEqual([{ status: "ready" }, { status: "ready" }]);
  });
});

const request = (id: string) => ({ orderId: `order-${id}`, paymentKey: `mock-${id}`, amount: 1290 });
const success = (p: TossConfirmRequest) => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, ...p, status: "DONE" } });
const fail = async () => ({ ok: false as const, error: { code: "TOSS_CONFIRM_PROVIDER_ERROR" as const, message: "mock network error" } });
async function row(id: string) { return (await db.query<Record<string, unknown>>("select * from payment_orders where payment_order_id=$1", [id])).rows[0]; }
async function makeDue(id: string) { await db.query("update payment_orders set recovery_next_retry_at=now()-interval '1 second',confirm_lease_until=now()-interval '1 second' where payment_order_id=$1", [id]); }
async function counts() { return (await db.query("select (select count(*)::int from paid_report_snapshots) as reports,(select count(*)::int from report_generation_jobs) as jobs")).rows[0]; }

describe("fair durable payment recovery", () => {
  it("one recoverable order succeeds; repeat recovery and callback return no duplicates", async () => {
    await order("A");
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    const result = await recoverPendingPayment(store, provider);
    expect(result).toMatchObject({ ok: true, reportId: expect.any(String) });
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ order: null });
    expect(await confirmPaidReport(request("A"), store, provider)).toMatchObject({ reportId: result.reportId });
    expect(provider).toHaveBeenCalledTimes(1);
    expect(await counts()).toEqual({ reports: 1, jobs: 1 });
    expect(await row("A")).toMatchObject({ status: "paid", recovery_attempt_count: 1, recovery_last_error_code: null });
  });

  it("transient A backs off so B and C progress before it is retried", async () => {
    await order("A"); await order("B"); await order("C");
    expect(await recoverPendingPayment(store, fail)).toMatchObject({ ok: true, attention: false, orderId: "A" });
    const a = await row("A");
    expect(a).toMatchObject({ status: "ready", recovery_attempt_count: 1, recovery_last_error_code: "RECOVERY_PROVIDER_UNCERTAIN", confirm_token: null });
    expect(Date.parse(String(a.recovery_next_retry_at)) - Date.parse(String(a.updated_at))).toBe(60000);
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    await recoverPendingPayment(store, provider); await recoverPendingPayment(store, provider);
    expect(provider.mock.calls.map(c => c[0].orderId)).toEqual(["order-B", "order-C"]);
    expect(await counts()).toEqual({ reports: 2, jobs: 2 });
    await makeDue("A"); await recoverPendingPayment(store, provider);
    expect((await row("A")).status).toBe("paid");
  });

  it("expired A moves to attention once and B/C are recoverable on following runs", async () => {
    await order("A"); await order("B"); await order("C");
    await db.exec("update report_input_snapshots set expires_at=now()-interval '1 second' where order_id='A'");
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ attention: true, code: "RECOVERY_INPUT_EXPIRED" });
    expect(provider).not.toHaveBeenCalled();
    await recoverPendingPayment(store, provider); await recoverPendingPayment(store, provider);
    expect(provider.mock.calls.map(c => c[0].orderId)).toEqual(["order-B", "order-C"]);
    expect((await row("A")).status).toBe("ready");
    expect((await store.call("attention")).paymentRecovery).toEqual([expect.objectContaining({ payment_order_id: "A", recovery_last_error_code: "RECOVERY_INPUT_EXPIRED" })]);
  });

  it.each(["failed", "canceled", "refunded"])("skips terminal %s orders", async status => {
    await order("A"); await order("B");
    await db.query("update payment_orders set status=$1 where payment_order_id='A'", [status]);
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    await recoverPendingPayment(store, provider);
    expect(provider.mock.calls[0][0].orderId).toBe("order-B");
    expect((await row("A")).status).toBe(status);
  });

  it("skips never-attempted checkout and isolates attempted orders missing provider identity", async () => {
    await store.call("create_order", { paymentOrderId: "untouched", providerOrderId: "untouched-order", productType: "saju_mbti_full", provider: "toss", amount: 1290, inputSnapshot: input });
    await order("A"); await order("B");
    await db.exec("update payment_orders set provider_order_id=null where payment_order_id='A'");
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ attention: true, code: "RECOVERY_IDENTITY_MISSING" });
    await recoverPendingPayment(store, provider);
    expect(provider).toHaveBeenCalledTimes(1);
    expect((await row("untouched")).recovery_attempt_count).toBe(0);
  });

  it("concurrent recovery claims lease different orders and never confirm an order twice", async () => {
    await order("A"); await order("B");
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    await Promise.all([recoverPendingPayment(store, provider), recoverPendingPayment(store, provider), recoverPendingPayment(store, provider)]);
    expect(provider.mock.calls.map(c => c[0].orderId).sort()).toEqual(["order-A", "order-B"]);
    expect(await counts()).toEqual({ reports: 2, jobs: 2 });
  });

  it("a crashed recovery lease can be reclaimed and stale success/failure cannot mutate it", async () => {
    await order("A");
    const first = await store.call("claim_payment_recovery");
    expect(await store.call("claim_payment_recovery")).toMatchObject({ order: null });
    await makeDue("A");
    const second = await store.call("claim_payment_recovery");
    expect(second.token).not.toBe(first.token);
    const before = await row("A");
    expect(await store.call("confirm_finish", { ...request("A"), token: first.token })).toMatchObject({ ok: false, code: "STALE_CONFIRM" });
    expect(await store.call("payment_recovery_failed", { paymentOrderId: "A", token: first.token, code: "RECOVERY_TIMEOUT" })).toMatchObject({ ok: false, code: "STALE_CONFIRM" });
    expect(await row("A")).toEqual(before);
    expect(await store.call("confirm_finish", { ...request("A"), token: second.token })).toMatchObject({ ok: true });
  });

  it("expired token is rejected even before a different owner reclaims", async () => {
    await order("A");
    const claim = await store.call("claim_payment_recovery");
    await makeDue("A");
    expect(await store.call("confirm_finish", { ...request("A"), token: claim.token })).toMatchObject({ ok: false, code: "STALE_CONFIRM" });
    expect(await counts()).toEqual({ reports: 0, jobs: 0 });
  });

  it("callback first excludes recovery and recovery first makes callback wait without another provider call", async () => {
    await order("A");
    const callbackProvider = vi.fn(async (p: TossConfirmRequest) => success(p));
    const completed = await confirmPaidReport(request("A"), store, callbackProvider);
    expect(await recoverPendingPayment(store, callbackProvider)).toMatchObject({ order: null });
    expect(callbackProvider).toHaveBeenCalledTimes(1);
    await order("B");
    const claim = await store.call("claim_payment_recovery");
    expect(await confirmPaidReport(request("B"), store, callbackProvider)).toMatchObject({ pending: true });
    const recovered = await store.call("confirm_finish", { ...request("B"), token: claim.token });
    expect(await confirmPaidReport(request("B"), store, callbackProvider)).toMatchObject({ reportId: recovered.reportId });
    expect(await store.call("confirm_finish", { ...request("A"), token: claim.token })).toMatchObject({ reportId: completed.reportId });
    expect(callbackProvider).toHaveBeenCalledTimes(1);
    expect(await counts()).toEqual({ reports: 2, jobs: 2 });
  });

  it("bounds unknown/network failures at five attempts with backoff and financial status preserved", async () => {
    await order("A");
    const delays = [60, 300, 900, 3600, 3600];
    for (let i=0; i<5; i++) {
      await makeDue("A");
      expect(await recoverPendingPayment(store, fail)).toMatchObject({ attention: i===4 });
      const a = await row("A");
      expect(a.status).toBe("ready");
      expect(a.recovery_attempt_count).toBe(i+1);
      expect(Date.parse(String(a.recovery_next_retry_at))-Date.parse(String(a.updated_at))).toBe(delays[i]*1000);
    }
    await makeDue("A");
    expect(await store.call("claim_payment_recovery")).toMatchObject({ order: null });
    expect(await counts()).toEqual({ reports: 0, jobs: 0 });
  });

  it("five crashed workers also stop at attention", async () => {
    await order("A");
    for (let i=0; i<5; i++) { await makeDue("A"); expect((await store.call("claim_payment_recovery")).order).not.toBeNull(); }
    await makeDue("A");
    expect(await store.call("claim_payment_recovery")).toMatchObject({ attention: true, code: "RECOVERY_ATTEMPTS_EXHAUSTED" });
  });

  it.each(["CANCELED", "PARTIAL_CANCELED", "ABORTED", "EXPIRED"])("provider status %s requires attention without inventing a local financial transition", async status => {
    await order("A");
    expect(await recoverPendingPayment(store, async p => ({ ...success(p), confirm: { ...success(p).confirm, status } }))).toMatchObject({ attention: true });
    expect(await row("A")).toMatchObject({ status: "ready", recovery_last_error_code: "RECOVERY_PROVIDER_TERMINAL" });
    expect(await store.call("claim_payment_recovery")).toMatchObject({ order: null });
  });

  it("PAID without report/job is repaired without provider approval; repeated finish reuses the report", async () => {
    await order("A");
    await db.exec("update payment_orders set status='paid',paid_at=now()-interval '1 day' where payment_order_id='A'");
    const before = await row("A");
    const inputBefore = (await db.query("select * from report_input_snapshots")).rows;
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ reportId: expect.any(String) });
    expect(provider).not.toHaveBeenCalled();
    expect(await row("A")).toMatchObject({ status: "paid", paid_at: before.paid_at });
    expect((await db.query("select * from report_input_snapshots")).rows).toEqual(inputBefore);
    expect(await counts()).toEqual({ reports: 1, jobs: 1 });
  });

  it("repairs a missing queued job using the same existing report", async () => {
    await order("A"); await recoverPendingPayment(store, async p => success(p));
    const id = (await row("A")).report_id;
    await db.exec("delete from report_generation_jobs");
    await makeDue("A");
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ reportId: id });
    expect(provider).not.toHaveBeenCalled();
    expect(await counts()).toEqual({ reports: 1, jobs: 1 });
  });

  it("a conflicting legacy report link is attention, never a duplicate report or reapproval", async () => {
    await order("A");
    await db.exec("update payment_orders set status='paid',report_id='legacy-report' where payment_order_id='A'");
    const provider = vi.fn(async (p: TossConfirmRequest) => success(p));
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ attention: true, code: "RECOVERY_REPORT_LINK_CONFLICT" });
    expect(provider).not.toHaveBeenCalled();
    expect(await counts()).toEqual({ reports: 0, jobs: 0 });
    expect((await row("A")).status).toBe("paid");
  });

  it("DB finish failure schedules later recovery without losing provider identity", async () => {
    await order("A");
    const unavailable: ReliabilityStore = { call: (action,data) => action==='confirm_finish' ? Promise.resolve({ ok:false,code:'DB_UNAVAILABLE' }) : store.call(action,data) };
    expect(await recoverPendingPayment(unavailable, async p => success(p))).toMatchObject({ attention:false });
    expect(await row("A")).toMatchObject({ status:'ready',provider_payment_id:'mock-A',recovery_last_error_code:'RECOVERY_DB_FINISH_FAILED' });
    await makeDue("A");
    expect(await recoverPendingPayment(store, async p => success(p))).toMatchObject({ reportId:expect.any(String) });
  });

  it("a timed-out provider is aborted at ten seconds; even a late success never finishes the order", async () => {
    await order("A");
    let signal: AbortSignal | undefined;
    let late!: (v: ReturnType<typeof success>) => void;
    const hanging = (_p: TossConfirmRequest, s: AbortSignal) => { signal=s; return new Promise<ReturnType<typeof success>>(resolve => { late=resolve; }); };
    const running = recoverPendingPayment(store, hanging);
    // PGlite uses real timers; exercise the actual provider deadline here.
    await vi.waitFor(() => expect(signal).toBeDefined());
    expect(PAYMENT_RECOVERY_TIMEOUT_MS).toBe(10000);
    // This one boundary test deliberately waits for the real deadline.
    expect(await running).toMatchObject({ attention:false });
    expect(signal?.aborted).toBe(true);
    expect((await row("A")).recovery_last_error_code).toBe('RECOVERY_TIMEOUT');
    late(success(request("A")));
    await Promise.resolve();
    expect(await counts()).toEqual({ reports:0,jobs:0 });
  }, 15000);

  it("keeps Toss's endpoint/body/idempotency key and passes the recovery abort signal", async () => {
    const controller=new AbortController();
    const fetchImpl=vi.fn(async () => ({ ok:true,status:200,json:async () => ({ orderId:'order-A',totalAmount:1290,status:'DONE',currency:'KRW' }) }));
    expect(await confirmTossPayment({ ...request('A'),secretKey:'mock-secret',signal:controller.signal,fetchImpl })).toMatchObject({ ok:true });
    expect(fetchImpl.mock.calls[0]).toEqual(['https://api.tosspayments.com/v1/payments/confirm',expect.objectContaining({ method:'POST',signal:expect.any(AbortSignal),headers:expect.objectContaining({ 'Idempotency-Key':'confirm-order-A' }),body:JSON.stringify({ paymentKey:'mock-A',orderId:'order-A',amount:1290 }) })]);
  });

  it("reapplying the patch preserves active leases and counters, and keeps RPC service-only", async () => {
    await order('A'); await store.call('claim_payment_recovery');
    const before=await row('A');
    await db.exec(readFileSync('scripts/paid_payment_confirm_recovery_queue_patch.sql','utf8'));
    expect(await row('A')).toEqual(before);
    for (const role of ['anon','authenticated','service_role']) {
      const permission=await db.query<{allowed:boolean}>("select has_function_privilege($1,'public.paid_report_reliability(text,jsonb)','EXECUTE') as allowed",[role]);
      expect(permission.rows[0].allowed).toBe(role==='service_role');
    }
  });
});
