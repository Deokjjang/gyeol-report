// P3.5 B: 결제 경로 v5 작가(WRITER_V5_PRODUCTS 플래그 뒤). 실제 결제 SQL(PGlite)로 claim → v5 생성 → finish_job → 읽기까지.
// 결제 확정은 기존 테스트처럼 가짜 Toss 응답(DONE)으로 통과시키고, 그 직후 단계(생성·발행)부터 실제 코드를 탄다. 외부 호출 0.
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { confirmPaidReport, readPublishedReport, runPaidReportJob, type PaidV5Builder } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { WRITER_DISABLED_RUNTIME as runtime } from "../../../src/lib/report-generation/writerDisabled";
import { buildV5Snapshot } from "../../../src/lib/writer/publish";
import { validateV5Publication } from "../../../src/lib/writer/book";

const person = { name: "김도윤", birthDate: "1996-12-06", birthTime: "14:15", gender: "MALE", mbtiType: "ENTJ", birthTimeUnknown: false, approximateBirthTimeSlot: "" };
let db: PGlite, store: ReliabilityStore;
const rows = async (table: string) => (await db.query(`select * from ${table}`)).rows as Record<string, unknown>[];
async function paid(product = "saju_mbti_full") {
  const personB = { ...person, name: "상대", gender: "FEMALE", mbtiType: "INTP", birthDate: "1998-03-14" };
  const payload = { productKey: product, productSlug: product === "saju_mbti_full" ? "saju-mbti-full" : product === "saju_mbti_compatibility" ? "compatibility" : product.replaceAll("_", "-"),
    ...(product === "saju_mbti_compatibility" ? { personA: person, personB, relationshipType: "love" } : { person }),
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "서비스 기획자", focusAreas: [] }, productOptions: {} };
  expect(await store.call("create_order", { paymentOrderId: "po", providerOrderId: "provider", productType: product, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
  return confirmPaidReport({ orderId: "provider", paymentKey: "mock-key", amount: 1290 }, store, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: "provider", amount: 1290, status: "DONE" } }));
}
/** paidRuntime이 넘기는 훅과 같은 모양(결정론 작가, LLM 없음). */
const v5Builder = (calls: { attempt: number }[]): PaidV5Builder => async job => {
  calls.push({ attempt: job.attempt });
  const built = await buildV5Snapshot({ payload: job.payload as never, reportId: job.report_id, policyAt: new Date(job.created_at).toISOString(), sink: { save: async () => true, load: async () => [] }, recover: job.attempt >= 3, deps: { provider: "openai", model: "", people: async () => [] } });
  return { snapshot: built.snapshot as unknown as Record<string, unknown> };
};

beforeAll(async () => {
  db = new PGlite(); await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const name of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${name}`, "utf8").replace(/^﻿/u, ""));
  for (const name of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "scripts/paid_report_external_call_guard_patch.sql", "scripts/paid_checkout_consent_evidence_patch.sql", "scripts/paid_report_one_call_delivery_patch.sql"]) await db.exec(readFileSync(name, "utf8"));
  store = { async call(action, data = {}) { return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value; } };
}, 30000);
beforeEach(async () => { await db.exec("truncate payment_orders cascade"); });
afterEach(() => { vi.restoreAllMocks(); });
afterAll(async () => { await db?.close(); });

describe("결제 경로 v5 작가", () => {
  it.each(["saju_mbti_full", "saju_mbti_compatibility"])("%s: 결제 확정 → v5 생성 → finish_job 발행 → v5 Book으로 읽힘", async product => {
    const order = await paid(product);
    const calls: { attempt: number }[] = [];
    const generate = vi.fn();
    expect(await runPaidReportJob(store, runtime, generate, undefined, v5Builder(calls))).toMatchObject({ status: "COMPLETED" });
    expect(generate).not.toHaveBeenCalled();
    expect(calls).toEqual([{ attempt: 1 }]);
    const snap = (await rows("paid_report_snapshots"))[0];
    expect(snap).toMatchObject({ status: "COMPLETED", gate_version: "paid-report-v1" });
    expect((snap.snapshot_json as { productVersion: string }).productVersion).toBe("v5");
    expect((await rows("payment_orders"))[0].status).toBe("paid"); // 결제 상태는 그대로
    const read = await readPublishedReport(store, String(order.reportId), validateV5Publication);
    expect(read).toMatchObject({ ok: true, status: "COMPLETED" });
  });

  it("훅이 null(플래그 밖 상품)이면 기존 생성 경로를 탄다", async () => {
    await paid();
    const before = await runPaidReportJob(store, runtime, undefined, undefined, async () => null);
    expect(before).toMatchObject({ status: "COMPLETED" });
    expect(((await rows("paid_report_snapshots"))[0].snapshot_json as { productVersion?: string }).productVersion).not.toBe("v5");
  });

  it("3번째 시도는 LLM 없이 결정론(recover)으로 완성한다(앞 시도가 lease 만료로 끝난 경우)", async () => {
    await paid();
    for (let i = 0; i < 2; i++) { await store.call("claim_job", { model: "writer" }); await db.exec("update report_generation_jobs set lease_until=now()-interval '1 second'"); }
    const calls: { attempt: number }[] = [];
    expect(await runPaidReportJob(store, runtime, undefined, undefined, v5Builder(calls))).toMatchObject({ status: "COMPLETED" });
    expect(calls).toEqual([{ attempt: 3 }]);
  });

  it("v5 생성 중 예외는 기존과 같이 재시도(RETRYING)로 남고 결제는 그대로", async () => {
    await paid();
    expect(await runPaidReportJob(store, runtime, undefined, undefined, async () => { throw new Error("boom"); })).toMatchObject({ status: "RETRYING" });
    expect((await rows("payment_orders"))[0].status).toBe("paid");
  });
});
