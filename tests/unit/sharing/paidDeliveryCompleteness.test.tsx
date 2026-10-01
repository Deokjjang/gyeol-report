import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createSingleProductOptions as formOptions } from "../../../src/lib/report-generation/reportInputPresentation";
import { renderToStaticMarkup } from "react-dom/server";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { createProductPreviewSnapshot, type ProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { confirmPaidReport, readPublishedReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore, ReliabilityResult } from "../../../src/lib/payment/paidReportReliabilityStore";
import { createAnnualCommerceAcceptance } from "../../../src/lib/payment/annualPurchasePolicy";
import { GAON_MAJOR_FORTUNE_V3_PAYLOAD as base } from "../../../src/lib/interpretation-v3/majorFortuneFixtures";
import { COMPATIBILITY_ROLE_VERSION } from "../../../src/lib/report-generation/reportInputTypes";
import { completenessManifest, assertDeliveredHtml } from "../../fixtures/report-sharing/completeness";
import { ROBUSTNESS_FIXTURES } from "../interpretation-v3/robustnessFixtures";

const local = vi.hoisted(() => ({ rpc: vi.fn(), select: vi.fn(), insert: vi.fn() }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: local.rpc }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({
  from: () => {
    let field = "", value = "";
    const query = { select: () => query, eq: (f: string, v: string) => { field = f; value = v; return query; },
      abortSignal: () => query, maybeSingle: () => local.select(field, value),
      upsert: (row: { report_id: string; token: string }) => ({ abortSignal: () => local.insert(row) }) };
    return query;
  },
}) }));
import { issuePublishedReportShare, loadSharedReport } from "../../../src/lib/sharing/reportShareStore";
import SharedPage from "../../../src/app/r/[token]/page";
import ReportPage from "../../../src/app/reports/[reportId]/page";

const products = [
  ["saju_mbti_full", "saju-mbti-full"], ["career_money_study", "career-money-study"],
  ["love_marriage_child", "love-marriage-child"], ["saju_mbti_compatibility", "compatibility"],
  ["major_fortune", "major-fortune"], ["annual_fortune", "annual-fortune"],
] as const;
const cases = [false, true].flatMap(stress => products.map(([product, slug]) => ({ product, slug, stress, key: slug + (stress ? "-stress" : ""), robustness: false })))
  .concat(products.map(([product, slug]) => ({ product, slug, stress: false, key: slug + "-robust", robustness: true })));
const snapshots: Record<string, ProductPreviewSnapshot> = {};
const manifests: Record<string, ReturnType<typeof completenessManifest>> = {};
let db: PGlite;
let store: ReliabilityStore;
const runtime = { enabled: false as const, reason: "flag_disabled" as const };

// The real production form helper is now shared with the Book presentation.

beforeAll(async () => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("RELEASE_GATE_NETWORK_FORBIDDEN"); }));
  // Existing production SQL is executed ONLY in an ephemeral in-process engine.
  // No Supabase server, CLI migration, real confirmation or provider is involved.
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  for (const file of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/u.test(n)).sort()) await db.exec(readFileSync("supabase/migrations/" + file, "utf8").replace(/^\uFEFF/u, ""));
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "scripts/paid_report_external_call_guard_patch.sql", "supabase/migrations/20260929113608_report_share_links.sql"]) await db.exec(readFileSync(file, "utf8"));
  store = { async call(action, data = {}) {
    return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value;
  } };
  local.rpc.mockImplementation(store.call);
  local.select.mockImplementation(async (field, value) => {
    if (!["report_id", "token"].includes(field)) return { error: "INVALID_FIELD", data: null };
    const rows = (await db.query("select report_id,token,revoked_at from report_share_links where " + field + "=$1", [value])).rows;
    return { error: null, data: rows[0] ?? null };
  });
  local.insert.mockImplementation(async row => {
    await db.query("insert into report_share_links(report_id,token) values ($1,$2) on conflict(report_id) do nothing", [row.report_id, row.token]);
    return { error: null };
  });
  for (const c of cases) {
    const person = { ...base.person, ...(c.stress ? { birthDate: "1996-12-06", mbtiType: "ENFP" } : {}) };
    const input = c.robustness ? { ...Object.values(ROBUSTNESS_FIXTURES).find(f => f.productKey === c.product)!, productOptions: formOptions(c.product, { selectedYear: "2026" }) } : { ...base, person, productKey: c.product, productSlug: c.slug,
      userContext: { ...base.userContext, ...(c.stress ? { detailJob: "B2B SaaS 영업기획 · 고객 미팅과 제품팀 조율, 제안 협상, 파이프라인 분석, 평가와 보상, 신규 시장 확장을 함께 담당", relationshipStatus: "married", focusAreas: ["가족"] } : {}) },
      productOptions: formOptions(c.product, { selectedYear: String(new Date().getFullYear()) }),
      ...(c.product === "saju_mbti_compatibility" ? { compatibilityRoleVersion: COMPATIBILITY_ROLE_VERSION, relationshipType: c.stress ? "businessPartner" : "love", personA: person,
        personB: { ...base.person, name: "유나", birthDate: "1993-10-17", gender: "FEMALE", mbtiType: "INFJ" } } : {}) };
    // No preview-only version options: exactly the paid worker's call contract.
    const generated = await generateProductReport(input, runtime, "normal_writer");
    expect(generated.ok, c.key + JSON.stringify(generated.ok ? {} : generated)).toBe(true);
    if (!generated.ok) continue;
    expect(generated.externalCalls).toEqual([]);
    const payment = { orderId: "release-" + c.key, paymentKey: "local-only-" + c.key, amount: 1290 };
    expect(await store.call("create_order", { paymentOrderId: "po-" + c.key, providerOrderId: payment.orderId, productType: c.product, provider: "toss", amount: 1290,
      inputSnapshot: { reportInputPayload: input, ...(c.product === "annual_fortune" && "selectedYear" in input.productOptions ? { annualCommerceAcceptance: createAnnualCommerceAcceptance(Number(input.productOptions.selectedYear), new Date()) } : {}) } })).toMatchObject({ ok: true });
    const paid = await confirmPaidReport(payment, store, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: payment.orderId, amount: 1290, status: "DONE" } }));
    expect(paid.ok).toBe(true);
    expect(await runPaidReportJob(store, runtime)).toMatchObject({ status: "COMPLETED" });
    const readback = await readPublishedReport(store, String(paid.reportId));
    expect(readback.status).toBe("COMPLETED");
    const snapshot = readback.snapshot as ProductPreviewSnapshot;
    const before = createProductPreviewSnapshot({ reportId: snapshot.reportId, createdAtIso: snapshot.createdAtIso, productKey: c.product, productSlug: c.slug, draft: generated.draft, evidencePacket: generated.evidencePacket });
    expect(before.ok).toBe(true); if (!before.ok) continue;
    expect(snapshot.productVersion).toBe("v3");
    manifests[c.key] = completenessManifest(before.value);
    expect(completenessManifest(snapshot)).toEqual(manifests[c.key]);
    expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
    snapshots[c.key] = snapshot;
  }
  if (process.env.RELEASE_QA_DIR) {
    mkdirSync(process.env.RELEASE_QA_DIR, { recursive: true });
    writeFileSync(process.env.RELEASE_QA_DIR + "/snapshots.json", JSON.stringify(snapshots));
    writeFileSync(process.env.RELEASE_QA_DIR + "/manifests.json", JSON.stringify(manifests));
  }
}, 60000);
beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:3140");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "local-fixture-only");
  vi.stubEnv("NODE_ENV", "production");
});
afterAll(async () => {
  if (process.env.RELEASE_QA_DIR && db) writeFileSync(process.env.RELEASE_QA_DIR + "/links.json", JSON.stringify((await db.query("select report_id,token,revoked_at from report_share_links")).rows));
  vi.unstubAllEnvs(); await db?.close();
});

describe("release gate: generated → actual SQL publication/readback → direct/shared full report", () => {
  it.each(cases)("$key: every section, every paragraph and the final sentinel survive", async c => {
    const snapshot = snapshots[c.key], manifest = manifests[c.key];
    expect(snapshot).toBeTruthy();
    expect(validateNewProductPublication(c.product, snapshot.draft, snapshot.evidencePacket)).toEqual({ ok: true, errors: [] });
    const issued = await issuePublishedReportShare(snapshot.reportId);
    expect(issued.ok).toBe(true); if (!issued.ok) return;
    const token = issued.data.url.split("/").at(-1)!;
    const shared = await loadSharedReport(token);
    expect(completenessManifest(shared!.snapshot)).toEqual(manifest);
    const directHtml = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: snapshot.reportId }) }));
    const sharedHtml = renderToStaticMarkup(await SharedPage({ params: Promise.resolve({ token }) }));
    assertDeliveredHtml(directHtml, manifest); assertDeliveredHtml(sharedHtml, manifest);
    expect(sharedHtml).toBe(directHtml);
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(cases.filter(c => !c.stress))("$key: existing publish replay rejects missing middle/final content and placeholders", c => {
    const snapshot = snapshots[c.key];
    const original = snapshot.draft as unknown as Record<string, unknown>;
    const collection = ["chapters", "editorialMonths", "editorialYears", "sections"].find(k => Array.isArray(original[k]))!;
    for (const middle of [false, true]) {
      const draft = structuredClone(original), rows = draft[collection] as unknown[];
      rows.splice(middle ? Math.floor(rows.length / 2) : rows.length - 1, 1);
      expect(validateNewProductPublication(c.product, draft, snapshot.evidencePacket).ok).toBe(false);
    }
    for (const invalid of ["", "undefined", "null", "[truncated]"]) {
      const draft = structuredClone(original);
      if (typeof draft.direction === "string") draft.direction = invalid;
      else if (Array.isArray(draft.finale)) draft.finale = [invalid];
      else {
        const chapters = draft.chapters as { scenes: { parts: { text: string }[] }[] }[];
        chapters.at(-1)!.scenes.at(-1)!.parts.at(-1)!.text = invalid;
      }
      expect(validateNewProductPublication(c.product, draft, snapshot.evidencePacket).ok).toBe(false);
    }
  });
});
