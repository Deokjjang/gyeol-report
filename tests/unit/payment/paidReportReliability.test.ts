import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ComprehensiveReportV2View } from "../../../src/app/reports/[reportId]/ComprehensiveReportV2View";
import type { ComprehensiveReportV2Draft } from "../../../src/lib/report-generation/comprehensiveReportDraftTypes";
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { confirmPaidReport, readPublishedReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore, ReliabilityResult } from "../../../src/lib/payment/paidReportReliabilityStore";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import { validateProductPublication } from "../../../src/lib/report-generation/productPublishGate";

const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "신뢰성검증", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획자", focusAreas: [] }, productOptions: {} };
const runtime = { enabled: false as const, reason: "flag_disabled" as const };
const payment = { orderId: "order-test", paymentKey: "mock-payment-key", amount: 1290 };
let db: PGlite;
let store: ReliabilityStore;
let valid: ProductGenerationSuccessResult;
const mockPayment = () => vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: payment.orderId, amount: 1290, status: "DONE" } }));
async function paid() {
  const result = await confirmPaidReport(payment, store, mockPayment());
  expect(result.ok).toBe(true);
  return String(result.reportId);
}
async function due() { await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second'"); }
async function rows(table: string) { return (await db.query(`select * from ${table}`)).rows as Record<string, unknown>[]; }
beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const file of readdirSync("supabase/migrations").filter((name) => /^\d{4}_.*\.sql$/u.test(name)).sort()) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/u, ""));
  }
  store = { async call(action, data = {}) {
    const result = await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)]);
    return result.rows[0].value;
  } };
  const result = await generateProductReport(payload, runtime, "deterministic_fallback");
  expect(result, JSON.stringify(result.ok ? {} : result)).toMatchObject({ ok: true });
  valid = result as ProductGenerationSuccessResult;
}, 30000);
afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec("truncate payment_orders cascade");
  expect(await store.call("create_order", { paymentOrderId: "po-test", providerOrderId: payment.orderId, productType: payload.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
});

describe("paid report reliability — actual SQL, mock providers", () => {
  it.each(["timeout", "malformed", "empty", "invalid"])("writer %s → two durable retries → canonical fallback publication", async failure => {
    const id = await paid();
    const transport = vi.fn<typeof fetch>(async () => {
      if (failure === "timeout") throw new DOMException("mock timeout", "AbortError");
      return Response.json({ output_text: failure === "malformed" ? "{broken" : failure === "empty" ? "" : "{}" });
    });
    const writerRuntime = { enabled: true as const, config: { enabled: true as const, apiKey: "mock-only", model: "mock", fetchImpl: transport } };
    for (let i = 0; i < 2; i++) {
      await due();
      expect(await runPaidReportJob(store, writerRuntime)).toMatchObject({ status: "RETRYING" });
      expect((await readPublishedReport(store, id)).snapshot).toBeNull();
    }
    const calls = transport.mock.calls.length;
    await due();
    expect(await runPaidReportJob(store, writerRuntime)).toMatchObject({ status: "COMPLETED" });
    expect(transport).toHaveBeenCalledTimes(calls);
    const result = await readPublishedReport(store, id);
    expect(result.snapshot).toMatchObject({ evidencePacket: valid.evidencePacket });
    expect((await rows("payment_orders"))[0].status).toBe("paid");
    expect(await rows("report_generation_attempts")).toHaveLength(3);
  });
  it("1 paid → generation success → COMPLETED", async () => {
    const id = await paid();
    expect(await runPaidReportJob(store, runtime, vi.fn(async () => structuredClone(valid)))).toMatchObject({ ok: true, status: "COMPLETED" });
    expect(await readPublishedReport(store, id)).toMatchObject({ ok: true, status: "COMPLETED" });
  });
  it("2 writer failure → durable retry → success", async () => {
    await paid();
    const generate = vi.fn().mockRejectedValueOnce(new Error("mock writer failed")).mockResolvedValueOnce(valid);
    expect(await runPaidReportJob(store, runtime, generate)).toMatchObject({ status: "RETRYING" });
    await due();
    expect(await runPaidReportJob(store, runtime, generate)).toMatchObject({ status: "COMPLETED" });
    expect(generate.mock.calls.map((c) => c[2])).toEqual(["normal_writer", "writer_regeneration"]);
  });
  it("3 invalid writer draft → reject → retry", async () => {
    const id = await paid();
    const invalid = structuredClone(valid);
    (invalid.draft as Record<string, unknown>).longformReadings = [];
    expect(await runPaidReportJob(store, runtime, async () => invalid)).toMatchObject({ status: "RETRYING" });
    expect((await readPublishedReport(store, id)).snapshot).toBeNull();
    await due();
    expect(await runPaidReportJob(store, runtime, async () => valid)).toMatchObject({ status: "COMPLETED" });
  });
  it("4 evidence missing → publish rejected", async () => {
    await paid();
    expect(await runPaidReportJob(store, runtime, async () => ({ ...valid, evidencePacket: undefined }))).toMatchObject({ status: "RETRYING" });
    expect((await rows("report_generation_attempts"))[0].validation_errors).toContain("EVIDENCE_REQUIRED");
  });
  it("5 missing manseryeok or pillars → publish rejected", async () => {
    await paid();
    const invalid = structuredClone(valid);
    const profile = (invalid.draft as { profileTable: Record<string, unknown> }).profileTable;
    delete profile.fourPillarGrid;
    expect(await runPaidReportJob(store, runtime, async () => invalid)).toMatchObject({ status: "RETRYING" });
    expect((await rows("report_generation_attempts"))[0].validation_errors).toContain("PILLAR_REQUIRED:hour");
  });
  it("6 all three attempts including fallback fail → PAID + input retained + attention", async () => {
    const id = await paid();
    const generate = vi.fn(async () => ({ ...valid, evidencePacket: undefined }));
    for (let i = 0; i < 3; i++) { await due(); await runPaidReportJob(store, runtime, generate); }
    expect((await rows("payment_orders"))[0].status).toBe("paid");
    expect(await rows("report_input_snapshots")).toHaveLength(1);
    expect(await readPublishedReport(store, id)).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION", snapshot: null });
    expect(generate.mock.calls.map((c: unknown[]) => c[2])).toEqual(["normal_writer", "writer_regeneration", "deterministic_fallback"]);
    expect(await rows("report_generation_attempts")).toHaveLength(3);
    expect(await store.call("admin_retry", { reportId: id })).toMatchObject({ ok: true });
    expect(await runPaidReportJob(store, runtime, async () => valid)).toMatchObject({ status: "COMPLETED" });
    expect(await rows("report_generation_attempts")).toHaveLength(4);
  });
  it("7 simultaneous + repeated success callbacks produce one report and one provider confirm", async () => {
    const confirm = mockPayment();
    await Promise.all([confirmPaidReport(payment, store, confirm), confirmPaidReport(payment, store, confirm)]);
    const again = await confirmPaidReport(payment, store, confirm);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(await rows("paid_report_snapshots")).toHaveLength(1);
    expect(await rows("report_generation_jobs")).toHaveLength(1);
    expect(again.reportId).toBe((await rows("paid_report_snapshots"))[0].report_id);
    await runPaidReportJob(store, runtime, async () => valid);
    expect((await confirmPaidReport(payment, store, confirm)).reportId).toBe(again.reportId);
    expect(confirm).toHaveBeenCalledTimes(1);
  });
  it("8 refresh and concurrent workers do not duplicate generation", async () => {
    const id = await paid();
    const generate = vi.fn(async () => valid);
    await Promise.all([readPublishedReport(store, id), runPaidReportJob(store, runtime, generate), runPaidReportJob(store, runtime, generate)]);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(await rows("report_generation_attempts")).toHaveLength(1);
  });
  it("9 persisted result roundtrip contains evidence and complete four pillars", async () => {
    const id = await paid();
    await runPaidReportJob(store, runtime, async () => valid);
    const result = await readPublishedReport(store, id);
    const snapshot = result.snapshot as { productType: string; draft: unknown; evidencePacket: unknown };
    expect(validateProductPublication(snapshot.productType, snapshot.draft, snapshot.evidencePacket)).toEqual({ ok: true, errors: [] });
    expect(snapshot.evidencePacket).toEqual(valid.evidencePacket);
    expect(snapshot.draft).toEqual(valid.draft);
  });
  it("10 report expiry = createdAt + 90 days; cleanup retains financial records", async () => {
    const id = await paid();
    const row = (await rows("paid_report_snapshots"))[0];
    expect(Date.parse(String(row.expires_at)) - Date.parse(String(row.created_at))).toBe(90 * 86400000);
    await db.exec("update paid_report_snapshots set expires_at=now()-interval '1 second'; update report_input_snapshots set expires_at=now()-interval '1 second'");
    expect(await readPublishedReport(store, id)).toMatchObject({ status: "EXPIRED", snapshot: null });
    await store.call("expire");
    expect(await rows("report_input_snapshots")).toHaveLength(0);
    expect((await rows("payment_orders"))[0].status).toBe("paid");
  });
  it("rejects stale worker commits after lease recovery", async () => {
    await paid();
    const first = (await store.call("claim_job")).job as Record<string, unknown>;
    await db.exec("update report_generation_jobs set lease_until=now()-interval '1 second'");
    expect(await runPaidReportJob(store, runtime, async () => valid)).toMatchObject({ status: "COMPLETED" });
    expect(await store.call("finish_job", { jobId: first.job_id, token: first.lease_token, success: false })).toMatchObject({ ok: false, code: "STALE_LEASE" });
  });
  it("paymentKey is unique across orders; wrong callback cannot downgrade PAID", async () => {
    await paid();
    expect(await confirmPaidReport({ ...payment, amount: 1 }, store, mockPayment())).toMatchObject({ ok: false });
    expect((await rows("payment_orders"))[0].status).toBe("paid");
    await store.call("create_order", { paymentOrderId: "po-other", providerOrderId: "order-other", productType: payload.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } });
    expect(await store.call("confirm_claim", { ...payment, orderId: "order-other" })).toMatchObject({ ok: false, code: "DUPLICATE_ORDER_OR_PAYMENT" });
  });
  it("recovers provider-approved payment when process dies before durable finish", async () => {
    await store.call("confirm_claim", payment);
    await db.exec("update payment_orders set confirm_lease_until=now()-interval '1 second'");
    expect(await store.call("pending_payment")).toMatchObject({ ok: true, order: { provider_order_id: payment.orderId } });
    expect(await confirmPaidReport(payment, store, mockPayment())).toMatchObject({ ok: true });
    expect(await rows("report_generation_jobs")).toHaveLength(1);
  });
  it("published UI contains all body sections and no generic quick-interpretation fallback", async () => {
    const id = await paid();
    await runPaidReportJob(store, runtime, async () => valid);
    const snapshot = (await readPublishedReport(store, id)).snapshot as { draft: ComprehensiveReportV2Draft; evidencePacket: unknown };
    const html = renderToStaticMarkup(createElement(ComprehensiveReportV2View, snapshot));
    expect(html).not.toContain("만세력표는 시주·일주·월주·연주가 모두 연결된 결과");
    expect(html).not.toContain("이름보다 실제 행동에서 어디를 바꿀지");
    for (const reading of snapshot.draft.longformReadings ?? []) {
      if (!["sajuFeatureReading", "mbtiReading", "finalMessage"].includes(reading.readingId)) expect(html).toContain(reading.titleKo);
    }
    const invalid = { ...snapshot, draft: { ...snapshot.draft, longformReadings: [] } };
    const blocked = renderToStaticMarkup(createElement(ComprehensiveReportV2View, invalid));
    expect(blocked).not.toContain(snapshot.draft.openingTitle);
  });
  it("rejects internal markers, repeated paragraphs, thin content, and empty evidence", () => {
    for (const mutate of [
      (d: Record<string, unknown>) => { d.openingSummary = "INTERNAL_META validation_errors"; },
      (d: Record<string, unknown>) => { d.longformReadings = []; },
      (d: Record<string, unknown>) => {
        const readings = d.longformReadings as { body: string }[];
        const sentence = "같은 설명을 계속 반복하여 분량을 채우는 내용은 개인별 해석으로 인정할 수 없으며 실제 고객에게 전달해서는 안 됩니다.";
        readings[0].body = Array(20).fill(sentence).join(" ");
      },
    ]) {
      const draft = structuredClone(valid.draft) as Record<string, unknown>;
      mutate(draft);
      expect(validateProductPublication(payload.productKey, draft, valid.evidencePacket).ok).toBe(false);
    }
    expect(validateProductPublication(payload.productKey, valid.draft, { productType: payload.productKey, mbtiType: "ENTJ", sections: [] }).ok).toBe(false);
  });
  it("third attempt runs the actual deterministic pipeline and the same publication gate", async () => {
    const id = await paid();
    const fail = async () => ({ ok: false as const, error: { code: "INVALID_REPORT_INPUT" as const, message: "mock writer failure" } });
    await runPaidReportJob(store, runtime, fail);
    await due(); await runPaidReportJob(store, runtime, fail);
    await due();
    expect(await runPaidReportJob(store, runtime)).toMatchObject({ status: "COMPLETED" });
    expect(await readPublishedReport(store, id)).toMatchObject({ status: "COMPLETED" });
  });
  it("three worker crashes become attention without losing payment", async () => {
    await paid();
    for (let i=0; i<3; i++) {
      expect((await store.call("claim_job")).job).not.toBeNull();
      await db.exec("update report_generation_jobs set lease_until=now()-interval '1 second'");
    }
    expect((await store.call("claim_job")).job).toBeNull();
    expect((await rows("report_generation_jobs"))[0].status).toBe("FAILED_REQUIRES_ATTENTION");
    expect((await rows("payment_orders"))[0].status).toBe("paid");
    expect((await rows("report_generation_attempts")).every((a) => a.error_code === "LEASE_EXPIRED")).toBe(true);
  });
  it("failure during publication rolls back snapshot, job and attempt updates atomically", async () => {
    await paid();
    const job = (await store.call("claim_job")).job as Record<string, unknown>;
    // Invalid duration aborts the transaction after the snapshot UPDATE.
    await expect(store.call("finish_job", { jobId: job.job_id, token: job.lease_token, success: true, gateVersion: "paid-report-v1", durationMs: "not-an-integer", snapshot: { reportId: job.report_id, productType: payload.productKey, draft: valid.draft, evidencePacket: valid.evidencePacket } })).rejects.toThrow();
    expect((await rows("paid_report_snapshots"))[0].snapshot_json).toBeNull();
    expect((await rows("report_generation_jobs"))[0].status).toBe("RUNNING");
    expect((await rows("payment_orders"))[0].status).toBe("paid");
  });
  it("anonymous callers cannot mutate or read paid storage", async () => {
    const permissions = await db.query<{ allowed: boolean }>("select has_function_privilege('anon', 'public.paid_report_reliability(text,jsonb)', 'EXECUTE') as allowed");
    expect(permissions.rows[0].allowed).toBe(false);
    const legacy = await db.query<{ allowed: boolean }>("select has_function_privilege('anon', 'public.fulfill_paid_saju_mbti_report(text)', 'EXECUTE') as allowed");
    expect(legacy.rows[0].allowed).toBe(false);
    const tables = await db.query<{ allowed: boolean }>("select has_table_privilege('anon', 'public.paid_report_snapshots', 'SELECT') as allowed");
    expect(tables.rows[0].allowed).toBe(false);
  });
  it("read gate quarantines corrupted completed snapshots for admin recovery", async () => {
    const id = await paid();
    await runPaidReportJob(store, runtime, async () => valid);
    await db.exec("update paid_report_snapshots set snapshot_json=snapshot_json-'evidencePacket'");
    expect(await readPublishedReport(store, id)).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION", snapshot: null });
    expect((await rows("paid_report_snapshots"))[0].snapshot_json).toBeNull();
    expect(await store.call("admin_retry", { reportId: id })).toMatchObject({ ok: true });
  });

  it("mock OpenAI transport exercises the shared normal writer and required longform schema", async () => {
    const narrative = JSON.parse(JSON.stringify(valid.draft)
      .replaceAll("토 과다", "현실 감각").replaceAll("수 부족", "회복 통로").replaceAll("화 부족", "표현 통로").replaceAll("현침살", "날카로운 판단")) as Record<string, unknown>;
    for (const key of ["profileTable", "productVersion", "sajuFeatureSpotlight", "sajuSignatureScenes", "reportDifferentiationModules", "sajuSymbolicNickname", "sajuFeatureChapter"]) delete narrative[key];
    const fetchMock = vi.fn(async () => Response.json({ output_text: JSON.stringify(narrative) }));
    vi.stubGlobal("fetch", fetchMock);
    const writer = { enabled: true as const, config: { enabled: true as const, apiKey: "mock-only", model: "mock-writer" } };
    const result = await generateProductReport(payload, writer, "normal_writer");
    expect(result, JSON.stringify(result.ok ? {} : result)).toMatchObject({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const request = JSON.parse(String(call[1].body));
    expect(request.text.format.schema.required).toContain("longformReadings");
    await paid();
    expect(await runPaidReportJob(store, writer)).toMatchObject({ status: "COMPLETED" });
  });
  it("a schema-era writer result lacking longform is rejected without silent fallback", async () => {
    const narrative = JSON.parse(JSON.stringify(valid.draft)
      .replaceAll("토 과다", "현실 감각").replaceAll("수 부족", "회복 통로").replaceAll("화 부족", "표현 통로").replaceAll("현침살", "날카로운 판단")) as Record<string, unknown>;
    for (const key of ["profileTable", "productVersion", "longformReadings", "sajuFeatureSpotlight", "sajuSignatureScenes", "reportDifferentiationModules", "sajuSymbolicNickname", "sajuFeatureChapter"]) delete narrative[key];
    const fetchMock = vi.fn(async () => Response.json({ output_text: JSON.stringify(narrative) }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await generateProductReport(payload, { enabled: true, config: { enabled: true, apiKey: "mock-only", model: "mock-writer" } }, "normal_writer");
    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

});
