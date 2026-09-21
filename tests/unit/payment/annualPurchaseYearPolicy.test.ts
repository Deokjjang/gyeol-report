import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createDurablePaymentOrderAdapter, type ReliabilityResult, type ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { confirmPaidReport, runPaidReportJob, type ProductGenerator } from "../../../src/lib/payment/paidReportReliability";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { getAnnualFortuneYearAccess, getAnnualFortuneCommerceYearPolicy } from "../../../src/lib/report-knowledge/annualFortuneYearRules";
import { createAnnualCommerceAcceptance, getAnnualPurchasePolicyDate } from "../../../src/lib/payment/annualPurchasePolicy";

const mocks = vi.hoisted(() => ({ runtime: vi.fn() }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: mocks.runtime }));
import { POST } from "../../../src/app/api/payment-checkout/prepare/route";

const beforeRollover = new Date("2026-12-31T14:59:59.000Z");
const afterRollover = new Date("2026-12-31T15:00:00.000Z");
const runtime = { enabled: false as const, reason: "flag_disabled" as const };
const person = { name: "회귀검증", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const payloadFor = (year: string) => ({ productKey: "annual_fortune", productSlug: "annual-fortune", person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: { selectedYear: year } });
let db: PGlite;
let store: ReliabilityStore;
beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const file of readdirSync("supabase/migrations").filter(name => /^\d{4}_.*\.sql$/u.test(name)).sort()) {
    await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/u, ""));
  }
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql"]) {
    await db.exec(readFileSync(file, "utf8"));
  }
  store = { async call(action, data = {}) {
    const result = await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)]);
    return result.rows[0].value;
  } };
}, 30000);
afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec("truncate payment_orders cascade");
  mocks.runtime.mockReturnValue(createDurablePaymentOrderAdapter(store));
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key");
  vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key");
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(beforeRollover);
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

async function checkout(year: string, snapshotExtra: Record<string, unknown> = {}, payloadExtra: Record<string, unknown> = {}) {
  const response = await POST(new Request("http://localhost/api/payment-checkout/prepare", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ provider: "toss", productType: "annual_fortune", inputSnapshot: { ...snapshotExtra, reportInputPayload: { ...payloadFor(year), ...payloadExtra } } }),
  }));
  return { status: response.status, body: await response.json() };
}
async function purchase() {
  const { status, body } = await checkout("2021");
  expect(status).toBe(200);
  const payment = { orderId: body.paymentOrder.providerOrderId as string, paymentKey: "mock-paid-only", amount: 1290 };
  const provider = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: payment.orderId, amount: 1290, status: "DONE", approvedAt: beforeRollover.toISOString() } }));
  const result = await confirmPaidReport(payment, store, provider);
  expect(result.ok).toBe(true);
  return { payment, provider, reportId: String(result.reportId), orderId: String(body.paymentOrder.paymentOrderId) };
}
async function due() { await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second'"); }
async function inputSnapshot() {
  return (await db.query<{ payload_json: Record<string, unknown> }>("select payload_json from report_input_snapshots")).rows[0].payload_json;
}
const deterministic: ProductGenerator = (payload, writer, _strategy, context) => generateProductReport(payload, writer, "deterministic_fallback", context);
async function expectCompleted(reportId: string) {
  const result = await store.call("read_report", { reportId });
  expect(result).toMatchObject({ ok: true, status: "COMPLETED", snapshot: { draft: { targetYear: 2021 }, evidencePacket: { selectedYear: 2021, dayunSelection: { targetYear: 2021 } } } });
  expect(JSON.stringify(result.snapshot)).not.toContain("annualCommerceAcceptance");
  const orders = await db.query<{ status: string }>("select status from payment_orders");
  expect(orders.rows).toEqual([{ status: "paid" }]);
}

describe("annual purchase policy — real prepare / SQL / worker, no providers", () => {
  it.each([
    [beforeRollover, "2021", 200], [beforeRollover, "2020", 400], [beforeRollover, "2027", 400],
    [afterRollover, "2021", 400], [afterRollover, "2022", 200], [afterRollover, "2027", 200],
  ] as const)("new checkout at %s for %s returns %i", async (date, year, status) => {
    vi.setSystemTime(date);
    const result = await checkout(year);
    expect(result.status).toBe(status);
    const rows = await db.query("select payment_order_id from payment_orders");
    expect(rows.rows).toHaveLength(status === 200 ? 1 : 0);
    if (status === 200) {
      expect(await inputSnapshot()).toMatchObject({ annualCommerceAcceptance: { version: "annual-commerce-v1", acceptedAt: date.toISOString(), selectedYear: Number(year) } });
      expect(JSON.stringify(result.body)).not.toContain("annualCommerceAcceptance");
    }
  });

  it("rejects spoofed old acceptance both beside and inside the public payload", async () => {
    vi.setSystemTime(afterRollover);
    const forged = createAnnualCommerceAcceptance(2021, beforeRollover);
    expect((await checkout("2021", { annualCommerceAcceptance: forged, acceptedCurrentYear: 2026 }, { annualCommerceAcceptance: forged, fromYear: 2021, toYear: 2026 })).status).toBe(400);
    expect((await checkout("2022", { annualCommerceAcceptance: forged })).status).toBe(200);
    expect(await inputSnapshot()).toMatchObject({ annualCommerceAcceptance: { selectedYear: 2022, acceptedAt: afterRollover.toISOString() } });
    expect((await generateProductReport({ ...payloadFor("2021"), annualCommerceAcceptance: forged }, runtime, "deterministic_fallback")).ok).toBe(false);
  });

  it.each([afterRollover, new Date("2027-02-15T00:00:00+09:00")])("paid 2021 generates after rollover/delay at %s using original selected-year Dayun", async date => {
    const { reportId } = await purchase();
    const original = await inputSnapshot();
    vi.setSystemTime(date);
    expect(await runPaidReportJob(store, runtime, deterministic)).toMatchObject({ status: "COMPLETED" });
    await expectCompleted(reportId);
    expect(await inputSnapshot()).toEqual(original);
  });

  it("normal writer retry in 2027 receives the accepted 2026 policy through the real dispatcher", async () => {
    const { reportId } = await purchase();
    const fixture = await generateProductReport(payloadFor("2021"), runtime, "deterministic_fallback");
    expect(fixture.ok).toBe(true);
    if (!fixture.ok) return;
    vi.setSystemTime(afterRollover);
    const transport = vi.fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("mock outage"))
      .mockResolvedValueOnce(Response.json({ output_text: JSON.stringify(fixture.draft) }));
    const writer = { enabled: true as const, config: { enabled: true as const, apiKey: "mock", model: "mock", fetchImpl: transport } };
    expect(await runPaidReportJob(store, writer)).toMatchObject({ status: "RETRYING" });
    await due();
    expect(await runPaidReportJob(store, writer)).toMatchObject({ status: "COMPLETED" });
    expect(transport).toHaveBeenCalledTimes(2);
    await expectCompleted(reportId);
  });

  it.each([
    ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"],
    ["love_marriage_child", "love-marriage-child"], ["major_fortune", "major-fortune"],
    ["saju_mbti_compatibility", "compatibility"],
  ])("other product %s keeps price, input and paid generation without annual context", async (productKey, productSlug) => {
    const payload = productKey === "saju_mbti_compatibility"
      ? { productKey, productSlug, relationshipType: "love", personA: person, personB: { ...person, name: "상대", mbtiType: "INTP" } }
      : { ...payloadFor("2021"), productKey, productSlug, productOptions: {} };
    const response = await POST(new Request("http://localhost/api/payment-checkout/prepare", {
      method: "POST", body: JSON.stringify({ provider: "toss", productType: productKey, inputSnapshot: { reportInputPayload: payload } }),
    }));
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.paymentOrder).toMatchObject({ productType: productKey, amount: 1290 });
    expect(await inputSnapshot()).toEqual({ reportInputPayload: payload });
    const orderId = body.paymentOrder.providerOrderId as string;
    expect(await confirmPaidReport({ orderId, paymentKey: "mock", amount: 1290 }, store,
      async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId, amount: 1290, status: "DONE" } }))).toMatchObject({ ok: true });
    const generator = vi.fn(deterministic);
    expect(await runPaidReportJob(store, runtime, generator)).toMatchObject({ status: "COMPLETED" });
    expect(generator.mock.calls[0]).toHaveLength(3);
  });

  it("automatic retries and real deterministic fallback preserve accepted policy", async () => {
    const { reportId } = await purchase();
    vi.setSystemTime(afterRollover);
    // Disabled writer fails the first two attempts; third uses the actual fallback.
    for (let attempt = 0; attempt < 2; attempt++) {
      await due();
      expect(await runPaidReportJob(store, runtime)).toMatchObject({ status: "RETRYING" });
    }
    await due();
    expect(await runPaidReportJob(store, runtime)).toMatchObject({ status: "COMPLETED" });
    await expectCompleted(reportId);
  });

  it("admin retry and duplicate callbacks leave original durable context and identity intact", async () => {
    const { reportId, payment, provider } = await purchase();
    const original = await inputSnapshot();
    const failure: ProductGenerator = async () => ({ ok: false, error: { code: "INVALID_REPORT_INPUT", message: "mock outage" } });
    for (let attempt = 0; attempt < 3; attempt++) { await due(); await runPaidReportJob(store, runtime, failure); }
    expect(await store.call("read_report", { reportId })).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION" });
    vi.setSystemTime(new Date("2027-02-01T00:00:00+09:00"));
    expect(await confirmPaidReport(payment, store, provider)).toMatchObject({ reportId });
    expect(provider).toHaveBeenCalledTimes(1);
    expect(await store.call("admin_retry", { reportId })).toMatchObject({ ok: true });
    expect(await runPaidReportJob(store, runtime, deterministic)).toMatchObject({ status: "COMPLETED" });
    await expectCompleted(reportId);
    expect(await inputSnapshot()).toEqual(original);
    for (const table of ["payment_orders", "paid_report_snapshots", "report_generation_jobs"]) {
      expect((await db.query(`select count(*)::int as n from ${table}`)).rows).toEqual([{ n: 1 }]);
    }
  });

  it.each(["missing", "invalid-date", "tampered-year", "wrong-version"])("%s paid context never invokes generation, reaches attention, preserves PAID", async corruption => {
    const { reportId } = await purchase();
    if (corruption === "missing") await db.exec("update report_input_snapshots set payload_json=payload_json-'annualCommerceAcceptance'");
    if (corruption === "invalid-date") await db.exec(`update report_input_snapshots set payload_json=jsonb_set(payload_json,'{annualCommerceAcceptance,acceptedAt}','"invalid"')`);
    if (corruption === "wrong-version") await db.exec(`update report_input_snapshots set payload_json=jsonb_set(payload_json,'{annualCommerceAcceptance,version}','"unknown"')`);
    if (corruption === "tampered-year") await db.exec(`update report_input_snapshots set payload_json=jsonb_set(payload_json,'{reportInputPayload,productOptions,selectedYear}','"2022"')`);
    vi.setSystemTime(afterRollover);
    const generator = vi.fn(deterministic);
    for (let attempt = 0; attempt < 3; attempt++) { await due(); await runPaidReportJob(store, runtime, generator); }
    expect(generator).not.toHaveBeenCalled();
    expect(await store.call("read_report", { reportId })).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION" });
    expect((await db.query("select status from payment_orders")).rows).toEqual([{ status: "paid" }]);
    expect((await db.query("select last_error_code from report_generation_jobs")).rows).toEqual([{ last_error_code: "ANNUAL_PURCHASE_CONTEXT_INVALID" }]);
  });

  it("domain December preview remains separate from the six commerce years", () => {
    expect(getAnnualFortuneYearAccess({ targetYear: 2027, currentDate: beforeRollover })).toMatchObject({ mode: "new_year_preview" });
    expect(getAnnualFortuneCommerceYearPolicy(beforeRollover).selectableYears).toEqual([2021, 2022, 2023, 2024, 2025, 2026]);
    expect(getAnnualFortuneCommerceYearPolicy(afterRollover).selectableYears).toEqual([2022, 2023, 2024, 2025, 2026, 2027]);
    expect(getAnnualPurchasePolicyDate(createAnnualCommerceAcceptance(2027, beforeRollover), payloadFor("2027"))).toBeNull();
  });
});
