import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CHECKOUT_POLICY_VERSIONS } from "../../../src/lib/legal/policyVersions";
import { calculateCheckoutAge, createCheckoutConsentEvidence } from "../../../src/lib/payment/checkoutConsent";
import { createDurablePaymentOrderAdapter, type ReliabilityResult, type ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { confirmPaidReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import { recoverPendingPayment } from "../../../src/lib/payment/paymentConfirmRecovery";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";

const mocks = vi.hoisted(() => ({ runtime: vi.fn() }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: mocks.runtime }));
import { POST } from "../../../src/app/api/payment-checkout/prepare/route";

const acceptedAt = new Date("2026-09-22T00:00:00.000Z");
const person = { name: "동의검증", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
const products = [
  ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"],
  ["love_marriage_child", "love-marriage-child"], ["saju_mbti_compatibility", "compatibility"],
  ["major_fortune", "major-fortune"], ["annual_fortune", "annual-fortune"],
] as const;
function reportInput(productKey = "career_money_study", productSlug = "career-money-study", birthDate = person.birthDate) {
  const first = { ...person, birthDate };
  return productKey === "saju_mbti_compatibility"
    ? { productKey, productSlug, relationshipType: "parentChild", personA: first, personB: { ...person, name: "상대", birthDate: "2020-12-06" } }
    : { productKey, productSlug, person: first, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: productKey === "annual_fortune" ? { selectedYear: "2026" } : {} };
}
function requestBody() {
  return { provider: "toss", productType: "career_money_study", inputSnapshot: { birthDate: person.birthDate, reportInputPayload: reportInput() }, consent: adultCheckoutConsent() };
}
async function prepare(body: unknown) {
  const response = await POST(new Request("https://example.test/api/payment-checkout/prepare", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }));
  return { status: response.status, body: await response.json() };
}
let db: PGlite;
let store: ReliabilityStore;
let create: ReturnType<typeof vi.fn>;
const patch = readFileSync("scripts/paid_checkout_consent_evidence_patch.sql", "utf8");
const finalPostflight = readFileSync(
  "scripts/paid_report_production_postflight_single_result.sql",
  "utf8",
);
beforeAll(async () => {
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role;");
  for (const file of readdirSync("supabase/migrations").filter(name => /^\d{4}_.*\.sql$/u.test(name)).sort()) await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/u, ""));
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "scripts/paid_report_external_call_guard_patch.sql"]) await db.exec(readFileSync(file, "utf8"));
  await db.exec(patch);
  store = { async call(action, data = {}) {
    const result = await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)]);
    return result.rows[0].value;
  } };
}, 30000);
afterAll(async () => { await db?.close(); });
beforeEach(async () => {
  await db.exec("truncate payment_orders cascade");
  const adapter = createDurablePaymentOrderAdapter(store);
  create = vi.fn(adapter.create);
  mocks.runtime.mockClear().mockReturnValue({ ...adapter, create });
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("PAID_REPORT_RELIABILITY_ENABLED", "1");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "mock-not-a-secret");
  vi.stubEnv("CRON_SECRET", "mock-cron");
  vi.stubEnv("REPORT_ADMIN_SECRET", "mock-admin");
  vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key");
  vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key");
  vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(acceptedAt);
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
async function orders() { return (await db.query<{ payment_order_id: string; input_snapshot: Record<string, unknown> }>("select payment_order_id,input_snapshot from payment_orders order by created_at,payment_order_id")).rows; }
async function assertRejected(body: unknown) {
  const result = await prepare(body);
  expect(result).toEqual({ status: 400, body: { ok: false, error: { code: "PAYMENT_CHECKOUT_INVALID_REQUEST", message: "필수 항목을 확인해 주세요." } } });
  expect(create).not.toHaveBeenCalled();
  expect(mocks.runtime).not.toHaveBeenCalled();
  expect(await orders()).toEqual([]);
  expect((await db.query("select * from report_input_snapshots")).rows).toEqual([]);
}

describe("public prepare consent boundary with real durable SQL and mock providers", () => {
  it("rejects production Toss checkout before durable writes when confirm is disabled", async () => {
    vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "0");

    const result = await prepare(requestBody());

    expect(result).toEqual({
      status: 503,
      body: {
        ok: false,
        error: {
          code: "PAYMENT_CHECKOUT_UNAVAILABLE",
          message: "현재 결제를 준비 중입니다. 잠시 후 다시 확인해 주세요.",
        },
      },
    });
    expect(mocks.runtime).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(await orders()).toEqual([]);
    expect((await db.query("select * from report_input_snapshots")).rows).toEqual([]);
    expect(JSON.stringify(result.body)).not.toMatch(
      /TOSS_CONFIRM_API_ENABLED|tossCheckoutRequest|clientKey|secret/i,
    );
  });

  it.each(products)("%s accepts existing assertions without changing price or URLs", async (key, slug) => {
    const body = { ...requestBody(), productType: key, inputSnapshot: { reportInputPayload: reportInput(key, slug) } };
    const result = await prepare(body);
    expect(result.status, JSON.stringify(result.body)).toBe(200);
    expect(result.body.paymentOrder).toMatchObject({ productType: key, amount: 1290, currency: "KRW", status: "ready" });
    expect(JSON.stringify(result.body.tossCheckoutRequest)).toContain("/payments/toss/success");
    expect(JSON.stringify(result.body.tossCheckoutRequest)).toContain("/payments/toss/fail");
    expect(JSON.stringify(result.body)).not.toMatch(/consentEvidence|policyVersions|assertions/);
    const stored = (await orders())[0].input_snapshot;
    expect(Object.keys(stored)).toEqual(["consentEvidence"]);
    expect(stored.consentEvidence).toMatchObject({ acceptedAt: acceptedAt.toISOString(), ageBand: "adult", policyVersions: CHECKOUT_POLICY_VERSIONS });
  });

  it.each(["termsAccepted", "privacyAccepted", "refundAccepted", "inputAccuracy", "digitalReportStart", "refundRestriction", "age14OrOlder"] as const)("%s missing/false/truthy strings cannot create an order", async key => {
    for (const value of [undefined, false, "true", 1, {}]) {
      const body = requestBody();
      await assertRejected({ ...body, consent: { ...body.consent, assertions: { ...body.consent.assertions, [key]: value } } });
    }
  });
  it.each([undefined, null, true, "true", {}])("rejects missing/malformed consent %j", async consent => {
    await assertRejected({ ...requestBody(), consent });
  });
  it.each(["terms", "privacy", "refund"] as const)("rejects old/future/missing %s version", async key => {
    for (const version of [undefined, "old", "2099-01-01.1"]) {
      const body = requestBody();
      await assertRejected({ ...body, consent: { ...body.consent, policyVersions: { ...body.consent.policyVersions, [key]: version } } });
    }
  });
  it("ignores forged timestamps/evidence, copies only safe assertions, uses server time", async () => {
    const body = requestBody();
    const result = await prepare({ ...body, acceptedAt: "1900-01-01", consentEvidence: { accepted: true },
      consent: { ...body.consent, acceptedAt: "1900-01-01", ip: "PRIVATE", userAgent: "PRIVATE" },
      inputSnapshot: { ...body.inputSnapshot, consentEvidence: { acceptedAt: "1900-01-01", private: "PRIVATE" } },
    });
    expect(result.status).toBe(200);
    const evidence = (await orders())[0].input_snapshot.consentEvidence;
    expect(evidence).toEqual(createCheckoutConsentEvidence(body.consent, person.birthDate, acceptedAt));
    expect(JSON.stringify(evidence)).not.toMatch(/PRIVATE|ip|userAgent|birthDate|1900/);
  });
  it("unknown assertion fields cannot override a false required assertion", async () => {
    const body = requestBody();
    await assertRejected({ ...body, consent: { ...body.consent, assertions: { ...body.consent.assertions, termsAccepted: false, accepted: true } } });
  });
  it("uses actual normalized birth date, not spoofed outer snapshot age", async () => {
    const body = requestBody();
    await assertRejected({ ...body, inputSnapshot: { birthDate: "1980-01-01", reportInputPayload: reportInput(undefined, undefined, "2020-12-06") } });
  });
  it("minor guardian acknowledgement is required; adult acknowledgement is optional", async () => {
    const body = requestBody();
    const minorBody = { ...body, inputSnapshot: { reportInputPayload: reportInput(undefined, undefined, "2010-12-06") } };
    await assertRejected(minorBody);
    const result = await prepare({ ...minorBody, consent: { ...body.consent, assertions: { ...body.consent.assertions, minorLegalRepresentative: true } } });
    expect(result.status).toBe(200);
    expect((await orders())[0].input_snapshot.consentEvidence).toMatchObject({ ageBand: "minor", assertions: { minorLegalRepresentative: true } });
    const adult = requestBody();
    const assertions = Object.fromEntries(Object.entries(adult.consent.assertions).filter(([key]) => key !== "minorLegalRepresentative"));
    expect((await prepare({ ...adult, consent: { ...adult.consent, assertions } })).status).toBe(200);
  });
  it.each([
    ["2012-09-22", "2026-09-21T14:59:59Z", 13], ["2012-09-22", "2026-09-21T15:00:00Z", 14],
    ["2007-09-22", "2026-09-21T14:59:59Z", 18], ["2007-09-22", "2026-09-21T15:00:00Z", 19],
    ["2012-02-30", "2026-09-22T00:00:00Z", null],
  ])("shared Seoul age rule %s / %s", (birth, now, age) => {
    expect(calculateCheckoutAge(birth!, new Date(now!))).toBe(age);
  });
  it("Seoul birthday boundary is enforced at the public route", async () => {
    const body = requestBody();
    const minor = { ...body, inputSnapshot: { reportInputPayload: reportInput(undefined, undefined, "2012-09-22") }, consent: { ...body.consent, assertions: { ...body.consent.assertions, minorLegalRepresentative: true } } };
    vi.setSystemTime(new Date("2026-09-21T14:59:59Z"));
    await assertRejected(minor);
    vi.setSystemTime(new Date("2026-09-21T15:00:00Z"));
    expect((await prepare(minor)).status).toBe(200);
  });

  it("callback/recovery/retry/admin retry preserve original evidence and never expose it in reports", async () => {
    const { body } = await prepare(requestBody());
    const original = (await orders())[0].input_snapshot;
    const payment = { orderId: body.paymentOrder.providerOrderId as string, paymentKey: "mock-payment", amount: 1290 };
    const provider = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: payment.orderId, amount: 1290, status: "DONE" } }));
    await store.call("confirm_claim", payment);
    await db.exec("update payment_orders set confirm_lease_until=now()-interval '1 second'");
    expect(await recoverPendingPayment(store, provider)).toMatchObject({ ok: true });
    const completed = await confirmPaidReport(payment, store, provider);
    expect(completed.ok).toBe(true);
    expect(provider).toHaveBeenCalledTimes(1);
    const disabled = { enabled: false as const, reason: "flag_disabled" as const };
    for (let attempt=0; attempt<3; attempt++) {
      await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second'");
      await runPaidReportJob(store, disabled, async () => ({ ok: false, error: { code: "INVALID_REPORT_INPUT", message: "mock" } }));
      expect((await orders())[0].input_snapshot).toEqual(original);
    }
    expect(await store.call("admin_retry", { reportId: completed.reportId })).toMatchObject({ ok: true });
    expect(await runPaidReportJob(store, disabled, input => generateProductReport(input, disabled, "deterministic_fallback"))).toMatchObject({ status: "COMPLETED" });
    expect((await orders())[0].input_snapshot).toEqual(original);
    const read = await store.call("read_report", { reportId: completed.reportId });
    expect(JSON.stringify(read.snapshot)).not.toMatch(/consentEvidence|policyVersions|assertions|acceptedAt/);
    const found = await store.call("find_order", { paymentOrderId: body.paymentOrder.paymentOrderId });
    expect(found).toMatchObject({ order: { input_snapshot: { ...original, reportInputPayload: requestBody().inputSnapshot.reportInputPayload } } });
    const input = await db.query<{ payload_json: Record<string, unknown> }>("select payload_json from report_input_snapshots");
    expect(input.rows[0].payload_json).not.toHaveProperty("consentEvidence");
  });
  it("a duplicate order insert and policy upgrade cannot rewrite the first evidence", async () => {
    await prepare(requestBody());
    const original = (await orders())[0];
    const v2 = { terms: "test-v2", privacy: "test-v2", refund: "test-v2" };
    expect(createCheckoutConsentEvidence(adultCheckoutConsent(), person.birthDate, acceptedAt, v2)).toBeNull();
    const newConsent = { ...adultCheckoutConsent(), policyVersions: v2 };
    const next = createCheckoutConsentEvidence(newConsent, person.birthDate, new Date("2026-09-23T00:00:00Z"), v2);
    expect(next).toMatchObject({ policyVersions: v2 });
    const record = create.mock.calls[0][0];
    expect(await store.call("create_order", { ...record, inputSnapshot: { ...record.inputSnapshot, consentEvidence: next } })).toMatchObject({ ok: false });
    expect((await orders())[0]).toEqual(original);
    // New checkouts create separate orders by the existing random-ID contract.
    expect((await prepare(requestBody())).status).toBe(200);
    expect(await orders()).toHaveLength(2);
  });
  it("a server policy revision rejects the old browser version but preserves old orders", async () => {
    const oldRequest = requestBody();
    expect((await prepare(oldRequest)).status).toBe(200);
    const original = (await orders())[0];
    const previousVersions = { ...CHECKOUT_POLICY_VERSIONS };
    try {
      // Test-only revision; no policy text or production version is changed.
      Object.assign(CHECKOUT_POLICY_VERSIONS, { terms: "test-v2", privacy: "test-v2", refund: "test-v2" });
      create.mockClear(); mocks.runtime.mockClear();
      expect((await prepare(oldRequest)).status).toBe(400);
      expect(create).not.toHaveBeenCalled();
      expect((await prepare(requestBody())).status).toBe(200);
      const all = await orders();
      expect(all.find(row => row.payment_order_id === original.payment_order_id)).toEqual(original);
      expect(all.find(row => row.payment_order_id !== original.payment_order_id)?.input_snapshot.consentEvidence).toMatchObject({ policyVersions: { terms: "test-v2" } });
    } finally { Object.assign(CHECKOUT_POLICY_VERSIONS, previousVersions); }
  });
  it("patch reapply leaves legacy evidence absent and preserves contracts past input expiry", async () => {
    await store.call("create_order", { paymentOrderId: "legacy", providerOrderId: "legacy-provider", productType: "career_money_study", provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: reportInput() } });
    await prepare(requestBody());
    const before = await orders();
    await db.exec(patch);
    expect(await orders()).toEqual(before);
    const verified = await db.query<{ pass: boolean }>(readFileSync("scripts/paid_checkout_consent_evidence_verify.sql", "utf8"));
    expect(verified.rows.every(row => row.pass)).toBe(true);
    expect(before.find(row => row.payment_order_id === "legacy")?.input_snapshot).toEqual({});
    await db.exec("update report_input_snapshots set expires_at=now()-interval '1 second'");
    await store.call("expire");
    expect(await orders()).toEqual(before);
    expect((await db.query("select * from report_input_snapshots")).rows).toEqual([]);
    for (const role of ["anon", "authenticated", "service_role"]) {
      const permission = await db.query<{ allowed: boolean }>("select has_function_privilege($1,'public.paid_report_reliability(text,jsonb)','EXECUTE') as allowed", [role]);
      expect(permission.rows[0].allowed).toBe(role === "service_role");
    }
  });
  it("find_order does not resurrect expired legacy input from financial JSON", async () => {
    await store.call("create_order", { paymentOrderId: "legacy", providerOrderId: "legacy-provider", productType: "career_money_study", provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: reportInput() } });
    await db.query("update payment_orders set input_snapshot=$1::jsonb where payment_order_id='legacy'", [JSON.stringify({ reportInputPayload: reportInput(), displayName: "legacy-private" })]);
    await db.exec("update report_input_snapshots set expires_at=now()-interval '1 second'");
    expect(await store.call("find_order", { paymentOrderId: "legacy" })).toMatchObject({ ok: true, order: { input_snapshot: {} } });
    expect(JSON.stringify(await store.call("find_order", { paymentOrderId: "legacy" }))).not.toContain("legacy-private");
  });

  it("the cumulative SQL chain passes the final production postflight", async () => {
    const result = await db.query<{
      check_name: string;
      pass: boolean;
      detail: string;
    }>(finalPostflight);

    expect(result.rows.filter(row => !row.pass)).toEqual([]);
    expect(
      result.rows.find(row => row.check_name === "production reliability reconciliation"),
    ).toMatchObject({ pass: true, detail: "failed=0; total=155" });
  });
});
