import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { PGlite } from "@electric-sql/pglite";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const local = vi.hoisted(() => ({ rpc: vi.fn(), select: vi.fn(), insert: vi.fn() }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: local.rpc }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ from: () => {
  let field = "", value = "";
  const q = { select: () => q, eq: (f: string, v: string) => { field = f; value = v; return q; }, abortSignal: () => q,
    maybeSingle: () => local.select(field, value), upsert: (row: unknown) => ({ abortSignal: () => local.insert(row) }) };
  return q;
} }) }));
import { generateV4ShadowReport, runV4ShadowJob } from "../../../src/lib/interpretation-v4/runtimeShadow";
import { projectV4Snapshot, validateV4Publication, stableV4Json, v4Digest, type V4RuntimeEvidence } from "../../../src/lib/interpretation-v4/runtimeProjection";
import { V4ShadowReportView } from "../../../src/components/report/V4ShadowReportView";
import { confirmPaidReport, readPublishedReport, runPaidReportJob } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityResult, ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import { validateNewProductPublication } from "../../../src/lib/report-generation/productPublishGate";
import { createProductPreviewSnapshot } from "../../../src/lib/report-generation/productPreviewSnapshot";
import { createAnnualCommerceAcceptance } from "../../../src/lib/payment/annualPurchasePolicy";
import { issuePublishedReportShare, loadSharedReport, loadShareableReport } from "../../../src/lib/sharing/reportShareStore";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { buildCanonicalManseRyeokTableData, withConsistentNatalMarkers } from "../../../src/lib/report-tables/manseRyeokTableData";
import { RUNTIME_FIXTURES, SHADOW_CLOCK, singleRuntimeInput } from "./runtimeFixtures";
import { NARRATIVE_FIXTURES } from "./narrativeFixtures";
import { LOVE_FIXTURES } from "./loveFixtures";
import { COMPATIBILITY_NARRATIVE_FIXTURES } from "./compatibilityFixtures";
import type { V4CustomerReport } from "../../../src/lib/interpretation-v4/runtimeTypes";

type Generated = { draft: V4CustomerReport; evidencePacket: V4RuntimeEvidence };
const packets = new Map<string, Generated>();
const snapshots = new Map<string, Record<string, unknown>>();
const disabled = { enabled: false as const, reason: "flag_disabled" as const };
let db: PGlite, store: ReliabilityStore;
async function seed(id: string, payload: unknown) {
  const p = payload as { productKey: string; productOptions?: { selectedYear?: string } };
  const payment = { orderId: `shadow-order-${id}`, paymentKey: `mock-${id}`, amount: 1290 };
  const acceptance = p.productKey === "annual_fortune" ? createAnnualCommerceAcceptance(Number(p.productOptions!.selectedYear), new Date(SHADOW_CLOCK.evaluatedAt)) : undefined;
  expect(await store.call("create_order", { paymentOrderId: `shadow-payment-${id}`, providerOrderId: payment.orderId, productType: p.productKey,
    provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload, ...(acceptance ? { annualCommerceAcceptance: acceptance } : {}) } })).toMatchObject({ ok: true });
  const confirm = vi.fn(async () => ({ ok: true as const, confirm: { provider: "toss" as const, paymentKeyReceived: true as const, orderId: payment.orderId, amount: 1290, status: "DONE" } }));
  const paid = await confirmPaidReport(payment, store, confirm);
  expect(paid.ok).toBe(true);
  expect(await confirmPaidReport(payment, store, confirm)).toMatchObject({ reportId: paid.reportId });
  expect(confirm).toHaveBeenCalledTimes(1);
  return String(paid.reportId);
}
beforeAll(async () => {
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("SHADOW_NETWORK_FORBIDDEN"); }));
  db = new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls;");
  for (const file of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/, ""));
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "scripts/paid_report_external_call_guard_patch.sql", "supabase/migrations/20260929113608_report_share_links.sql"]) await db.exec(readFileSync(file, "utf8"));
  store = { async call(action, data = {}) {
    return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) as value", [action, JSON.stringify(data)])).rows[0].value;
  } };
  local.rpc.mockImplementation(store.call);
  local.select.mockImplementation(async (field, value) => ({ error: null, data: ["report_id", "token"].includes(field)
    ? (await db.query(`select report_id,token,revoked_at from report_share_links where ${field}=$1`, [value])).rows[0] ?? null : null }));
  local.insert.mockImplementation(async row => {
    await db.query("insert into report_share_links(report_id,token) values($1,$2) on conflict(report_id) do nothing", [row.report_id, row.token]);
    return { error: null };
  });
  for (const f of RUNTIME_FIXTURES) {
    const generated = await generateV4ShadowReport(f.payload, { ...SHADOW_CLOCK, ...(f.id === "annual" ? { policyDate: new Date(SHADOW_CLOCK.evaluatedAt).toISOString() } : {}) });
    expect(generated, f.id).toMatchObject({ ok: true, externalCalls: [] });
    if (!generated.ok) continue;
    packets.set(f.id, generated as Generated);
    const reportId = await seed(f.id, f.payload);
    expect(await runV4ShadowJob(store, SHADOW_CLOCK), f.id).toMatchObject({ ok: true, status: "COMPLETED" });
    const read = await readPublishedReport(store, reportId, validateV4Publication);
    expect(read.status).toBe("COMPLETED");
    snapshots.set(f.id, read.snapshot as Record<string, unknown>);
    expect(fetch).not.toHaveBeenCalled();
  }
}, 60000);
beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "http://127.0.0.1:3140");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "local-fixture-only");
});
afterAll(async () => { vi.unstubAllEnvs(); await db?.close(); });
afterEach(() => vi.useRealTimers());

describe("V4 shadow: actual durable worker + SQL JSONB + server projection + share", () => {
  it.each(RUNTIME_FIXTURES)("$id generation, full snapshot read and direct/share SSR parity", async f => {
    const s = snapshots.get(f.id)!, p = packets.get(f.id)!;
    expect(s.productVersion).toBe("v4");
    expect(s.draft).toEqual(p.draft);
    expect(s.evidencePacket).toEqual(p.evidencePacket);
    expect(validateV4Publication(f.payload.productKey, s.draft, s.evidencePacket)).toEqual({ ok: true, errors: [] });
    const issued = await issuePublishedReportShare(String(s.reportId), validateV4Publication);
    expect(issued.ok).toBe(true); if (!issued.ok) return;
    expect(await issuePublishedReportShare(String(s.reportId), validateV4Publication)).toEqual(issued);
    const token = issued.data.url.split("/").at(-1)!;
    const shared = await loadSharedReport(token, validateV4Publication);
    expect(shared).not.toBeNull();
    const direct = projectV4Snapshot(s)!, view = projectV4Snapshot(shared!.snapshot)!;
    expect(view).toEqual(direct);
    const html = renderToString(<V4ShadowReportView view={direct} />);
    expect(renderToString(<V4ShadowReportView view={view} />)).toBe(html);
    for (const text of [direct.report.headline, ...direct.report.opening, ...direct.report.sections.flatMap(s => [s.title, ...s.paragraphs]), direct.report.finalLine]) {
      // React escapes quotes in SSR; assert through the same text renderer.
      const escaped = renderToString(<span>{text}</span>).replace(/^<span>|<\/span>$/g, "");
      expect(html, f.id).toContain(escaped);
    }
    expect(html).toContain('aria-label="리포트 공유하기"');
    expect(html).not.toMatch(/<footer|sourceRefs|seedIds|fusionIds|calendarMonths:|confidence|v4_structure:/);
    expect(JSON.stringify(direct)).not.toMatch(/"(?:proof|sourceRefs|seedIds|fusionIds|natalEvidence|calculations|composition|contentDigest)"/);
    const body = html.slice(html.indexOf('data-v4-body'), html.indexOf('data-v4-final'));
    const headings = [...body.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1]);
    expect(headings).toEqual(direct.report.sections.map(s => renderToString(<span>{s.title}</span>).replace(/^<span>|<\/span>$/g, "")));
    // Public read/share paths remain closed even for an explicitly seeded local V4.
    expect(await loadShareableReport(String(s.reportId))).toBeNull();
    expect(await loadSharedReport(token)).toBeNull();
    expect(projectV4Snapshot(JSON.parse(JSON.stringify(s)))).toEqual(direct);
    if (process.env.V4_SHADOW_EXPORT) {
      mkdirSync(process.env.V4_SHADOW_EXPORT, { recursive: true });
      writeFileSync(`${process.env.V4_SHADOW_EXPORT}/${f.id}.json`, JSON.stringify(direct));
      writeFileSync(`${process.env.V4_SHADOW_EXPORT}/${f.id}.html`, html);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
  it("14 years / 10 future / ages / transitions and 12 months / Jie provenance are frozen", () => {
    const major = packets.get("major")!, annual = packets.get("annual")!;
    expect(major.draft.major?.years).toHaveLength(14);
    expect(major.draft.major!.years.filter(y => y.year > major.draft.major!.currentYear)).toHaveLength(10);
    expect(major.draft.major!.years.every(y => Number.isInteger(y.age))).toBe(true);
    expect(major.draft.major!.transitions.length).toBeGreaterThan(0);
    expect(annual.draft.annual?.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1));
    vi.useFakeTimers(); vi.setSystemTime(new Date("2038-06-01T00:00:00Z"));
    for (const f of RUNTIME_FIXTURES) expect(projectV4Snapshot(snapshots.get(f.id))!.report).toEqual(packets.get(f.id)!.draft);
    vi.useRealTimers();
  });
  it("existing job claim and first-publish stay idempotent", async () => {
    const before = await db.query("select report_id,snapshot_json,published_at,expires_at from paid_report_snapshots order by report_id");
    await runV4ShadowJob(store, SHADOW_CLOCK);
    expect((await db.query("select report_id,snapshot_json,published_at,expires_at from paid_report_snapshots order by report_id")).rows).toEqual(before.rows);
    const attempts = await db.query<{ calls: number }>("select count(*)::int as calls from report_generation_attempts");
    expect(attempts.rows[0].calls).toBe(6);
  });
});

describe("V4 invalid packets fail closed", () => {
  const cases: [string, string, (p: Generated) => void][] = [
    ["final missing", "career", p => { (p.draft as { finalLine: string }).finalLine = ""; }],
    ["Major 13", "major", p => { (p.draft.major!.years as unknown[]).pop(); }],
    ["Annual 11", "annual", p => { (p.draft.annual!.months as unknown[]).pop(); }],
    ["role missing", "compatibility", p => { delete (p.draft.compatibility!.personA as { role?: string }).role; }],
    ["extra proof", "comprehensive", p => { Object.assign(p.draft.sections[0], { proof: { sourceRefs: ["private"] } }); }],
    ["numeric pair", "compatibility", p => { Object.assign(p.draft.compatibility!, { score: 67 }); }],
  ];
  it.each(cases)("%s cannot pass the publication validator", (_name, id, change) => {
    const p = structuredClone(packets.get(id)!); change(p);
    expect(validateV4Publication(p.draft.productType, p.draft, p.evidencePacket).ok).toBe(false);
    expect(projectV4Snapshot({ ...snapshots.get(id), ...p })).toBeNull();
  });
  it("invalid composer structure is rejected even with a refreshed corruption seal", () => {
    const p = structuredClone(packets.get("major")!);
    if (p.evidencePacket.composition.product !== "major_fortune") return;
    p.evidencePacket.composition.result.years.pop();
    const { contentDigest: _digest, ...body } = p.evidencePacket; void _digest;
    Object.assign(p.evidencePacket, { contentDigest: v4Digest(body) });
    expect(validateV4Publication(p.draft.productType, p.draft, p.evidencePacket).errors).toContain("V4_MAJOR_INCOMPLETE");
  });
  it("missing final reaches existing durable failure/attention rather than success or V3 rescue", async () => {
    const f = RUNTIME_FIXTURES[1], reportId = await seed("bad-final", f.payload), p = structuredClone(packets.get("career")!);
    Object.assign(p.draft, { finalLine: "" });
    const bad = async () => ({ ok: true as const, kind: "careerMoneyStudy" as const, ...p, externalCalls: [] });
    for (let i = 0; i < 4; i++) {
      await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second' where status='RETRYING'");
      await runPaidReportJob(store, disabled, bad, validateV4Publication);
    }
    const row = (await db.query<{ snapshot_json: unknown; status: string }>("select snapshot_json,status from paid_report_snapshots where report_id=$1", [reportId])).rows[0];
    expect(row.snapshot_json).toBeNull(); expect(row.status).toBe("FAILED_REQUIRES_ATTENTION");
  });
  it("unsupported year, invalid context, missing clock are rejected without network", async () => {
    const a = RUNTIME_FIXTURES[5].payload;
    expect(await generateV4ShadowReport({ ...a, productOptions: { selectedYear: "2099" } }, SHADOW_CLOCK)).toMatchObject({ ok: false });
    expect(await generateV4ShadowReport({ ...RUNTIME_FIXTURES[1].payload, userContext: { jobStatus: "invented", relationshipStatus: "breakup", detailJob: "", focusAreas: [] } }, SHADOW_CLOCK)).toMatchObject({ ok: false });
    expect(await generateV4ShadowReport(a, { evaluatedAt: "" })).toMatchObject({ ok: false });
    expect(fetch).not.toHaveBeenCalled();
  });
  it("the public direct reader rejects a locally persisted V4; it cannot silently activate", async () => {
    const reportId = await seed("default-reader-deny", RUNTIME_FIXTURES[1].payload);
    expect(await runV4ShadowJob(store, SHADOW_CLOCK)).toMatchObject({ status: "COMPLETED" });
    expect(await readPublishedReport(store, reportId)).toMatchObject({ status: "FAILED_REQUIRES_ATTENTION", snapshot: null });
  });
});

describe("roles, precision and customer/default boundaries", () => {
  it.each(COMPATIBILITY_NARRATIVE_FIXTURES)("$id: fixed roles and distinct direction survive JSON", async f => {
    const g = await generateV4ShadowReport(f.payload, SHADOW_CLOCK);
    expect(g).toMatchObject({ ok: true }); if (!g.ok) return;
    const p = g as Generated, c = p.draft.compatibility!;
    expect(c.category).toBe(f.payload.relationshipType);
    expect(c.aToB).not.toEqual(c.bToA);
    expect(JSON.stringify(c)).not.toMatch(/"(?:score|rating|percent)"|\d+점|[★☆]/);
    if (c.category === "parentChild") expect([c.personA.role, c.personB.role]).toEqual(["부모", "자녀"]);
    if (c.category === "managerReport") expect([c.personA.role, c.personB.role]).toEqual(["상사", "부하·팀원"]);
    const swapped = await generateV4ShadowReport({ ...f.payload, personA: f.payload.personB, personB: f.payload.personA }, SHADOW_CLOCK);
    expect(swapped.ok).toBe(true); if (!swapped.ok) return;
    const x = (swapped as Generated).evidencePacket.composition, y = p.evidencePacket.composition;
    if (x.product !== "saju_mbti_compatibility" || y.product !== "saju_mbti_compatibility") return;
    expect(x.result.evidence.invariant).toEqual(y.result.evidence.invariant);
    expect(x.result.evidence.directions.aToB).toEqual(y.result.evidence.directions.bToA);
  });
  it.each(["", "single", "some", "dating", "marriage_preparing", "married"])("Love state %s retained", async state => {
    const base = singleRuntimeInput("love_marriage_child", "love-marriage-child");
    const g = await generateV4ShadowReport({ ...base, userContext: { ...base.userContext, relationshipStatus: state } }, SHADOW_CLOCK);
    expect(g).toMatchObject({ ok: true, draft: { relationshipStatus: state } });
  });
  it("MBTI unknown and approximate/unknown times retain canonical tables", async () => {
    const inputs = [singleRuntimeInput("saju_mbti_full", "saju-mbti-full", NARRATIVE_FIXTURES[11]),
      singleRuntimeInput("love_marriage_child", "love-marriage-child", LOVE_FIXTURES[3], "MYOSI")];
    for (const input of inputs) {
      const g = await generateV4ShadowReport(input, SHADOW_CLOCK);
      expect(g).toMatchObject({ ok: true }); if (!g.ok) continue;
      const e = (g as Generated).evidencePacket;
      expect(e.natalTableEvidence.person.precision).toBe(input.person.birthTimePrecision);
      expect(normalizeReportInputPayload(input).ok).toBe(true);
      expect(g.externalCalls).toEqual([]);
    }
    expect(packets.get("love")!.evidencePacket.natalTableEvidence.person.precision).toBe("unknown");
    expect(packets.get("love")!.evidencePacket.calculations.person.pillars.hour).toBeUndefined();
  });
  it.each(RUNTIME_FIXTURES)("$id public/default cannot select V4 from arbitrary client fields", async f => {
    // Compare payloads at one instant; Annual records evaluatedAt to the second.
    vi.useFakeTimers({ toFake: ["Date"] }); vi.setSystemTime(new Date(SHADOW_CLOCK.evaluatedAt));
    const base = await generateProductReport(f.payload, disabled, "normal_writer");
    expect(base.ok).toBe(true); if (!base.ok) return;
    expect((base.draft as { productVersion: string }).productVersion).toBe("v3");
    const tables = projectV4Snapshot(snapshots.get(f.id))!.tables;
    for (const [i, slot] of (f.id === "compatibility" ? ["personA", "personB"] as const : ["person"] as const).entries()) {
      const table = withConsistentNatalMarkers(buildCanonicalManseRyeokTableData(base.evidencePacket, tables[i].name, slot)!);
      const { natalEvidence: _natal, ...publicTable } = table; void _natal;
      expect(tables[i].manse).toEqual(publicTable);
    }
    const attack = { ...f.payload, reportVersion: "v4", narrativeVersion: "v4", mode: "shadow", shadow: true, query: { version: "v4" }, cookie: "version=v4", localStorage: { version: "v4" } };
    const changed = await generateProductReport(attack, disabled, "normal_writer");
    expect(changed).toEqual(base);
    const override = await generateProductReport({ ...attack, productOptions: { ...("productOptions" in f.payload ? f.payload.productOptions : {}), contentVersion: "v4" } }, disabled, "normal_writer");
    if (override.ok) expect((override.draft as { productVersion: string }).productVersion).not.toBe("v4");
    const p = packets.get(f.id)!;
    expect(validateNewProductPublication(f.payload.productKey, p.draft, p.evidencePacket).ok).toBe(false);
    const legacy = createProductPreviewSnapshot({ reportId: "old", createdAtIso: SHADOW_CLOCK.evaluatedAt, productKey: f.payload.productKey as never, productSlug: f.payload.productSlug as never, draft: base.draft as never, evidencePacket: base.evidencePacket });
    expect(legacy.ok).toBe(true);
    expect(projectV4Snapshot(legacy.ok ? legacy.value : null)).toBeNull();
    expect(stableV4Json(base)).toBe(stableV4Json(changed));
  });
  it("no public route or default runtime imports shadow generation, projection or renderer", () => {
    const allowed = new Set(["lib/interpretation-v4/runtimeShadow.ts", "lib/interpretation-v4/runtimeProjection.ts"]);
    for (const f of readdirSync("src", { recursive: true }).filter((f): f is string => typeof f === "string" && /\.tsx?$/.test(f))) {
      if (allowed.has(f)) continue;
      const source = readFileSync(`src/${f}`, "utf8");
      expect(source, f).not.toMatch(/(?:from\s*|import\s*\()["'][^"']*(?:runtimeShadow|runtimeProjection|V4ShadowReportView)["']/);
    }
    for (const f of ["runtimeShadow.ts", "runtimeProjection.ts"]) {
      const source = readFileSync(`src/lib/interpretation-v4/${f}`, "utf8");
      expect(source).toMatch(/^import "server-only";/);
      expect(source).not.toMatch(/["']use server["']/);
    }
  });
});
