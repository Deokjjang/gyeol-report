import { readFileSync, readdirSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { confirmPaidReport, runPaidReportJob, readPublishedReport } from "../../../src/lib/payment/paidReportReliability";
import { generateProductReport } from "../../../src/lib/report-generation/generateProductReport";
import type { ProductGenerationSuccessResult } from "../../../src/lib/report-generation/productGenerationDispatcher";
import type { ReliabilityStore, ReliabilityResult } from "../../../src/lib/payment/paidReportReliabilityStore";
import { claimHash } from "../../../src/lib/library/server";
import type { LibraryRow } from "../../../src/lib/library/model";

const A = "11111111-1111-4111-8111-111111111111", B = "22222222-2222-4222-8222-222222222222", hash = claimHash("private-browser-capability"), order = "po-library";
const payload = { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: { name: "서재 검수", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" }, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획", focusAreas: [] }, productOptions: { contentVersion: "v3" } };
let db: PGlite, store: ReliabilityStore, generated: ProductGenerationSuccessResult;
const runtime = { enabled: false as const, reason: "flag_disabled" as const };
async function bind(user: string | null = null, proof: string | null = hash) {
  return (await db.query<{ value: boolean }>("select public.bind_report_purchase($1,$2,$3,'서재 검수',null) value", [order, user, proof])).rows[0].value;
}
async function list(user = A) { return (await db.query<{ value: LibraryRow[] }>("select public.list_account_reports($1) value", [user])).rows[0].value; }
async function claim(id: string, user: string | null = A, proof: string | null = hash, commit = true) {
  return (await db.query<{ value: string }>("select public.claim_report_account($1,$2,$3,$4) value", [id, user, proof, commit])).rows[0].value;
}
async function pay() {
  const result = await confirmPaidReport({ orderId: "provider-library", paymentKey: "test-only", amount: 1290 }, store,
    async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: "provider-library", amount: 1290, status: "DONE" } }));
  expect(result.ok).toBe(true); return String(result.reportId);
}
async function publish() { expect(await runPaidReportJob(store, runtime, async () => generated)).toMatchObject({ status: "COMPLETED" }); }
beforeAll(async () => {
  db = new PGlite();
  await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
    create schema auth; create table auth.users(id uuid primary key);
    insert into auth.users values ('${A}'),('${B}');
    grant usage on schema public,auth to anon,authenticated,service_role;`);
  for (const file of readdirSync("supabase/migrations").filter(n => /^\d{4}_.*\.sql$/.test(n)).sort()) await db.exec(readFileSync(`supabase/migrations/${file}`, "utf8").replace(/^\uFEFF/, ""));
  for (const file of ["supabase/migrations/20260920163924_production_reliability_reconcile.sql", "scripts/paid_report_quarantine_recovery_patch.sql", "scripts/paid_payment_confirm_recovery_queue_patch.sql", "scripts/paid_report_publish_expiry_patch.sql", "supabase/migrations/20260929113608_report_share_links.sql"]) await db.exec(readFileSync(file, "utf8"));
  await db.exec(`alter default privileges in schema public grant all on tables to anon,authenticated,service_role;`);
  await db.exec(readFileSync("supabase/migrations/20261003104500_v4_report_library.sql", "utf8"));
  store = { async call(action, data = {}) { return (await db.query<{ value: ReliabilityResult }>("select public.paid_report_reliability($1,$2::jsonb) value", [action, JSON.stringify(data)])).rows[0].value; } };
  const result = await generateProductReport(payload, runtime, "deterministic_fallback"); expect(result.ok).toBe(true); generated = result as ProductGenerationSuccessResult;
}, 30000);
beforeEach(async () => {
  await db.exec("reset role; truncate public.payment_orders cascade");
  expect(await store.call("create_order", { paymentOrderId: order, providerOrderId: "provider-library", productType: payload.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload } })).toMatchObject({ ok: true });
});
afterAll(async () => { await db?.close(); });

describe("ownership migration on real local Postgres + unchanged paid lifecycle", () => {
  it("ready binding alone is invisible; valid first publish auto-links once, preserving V3 payload/version/90-day clock", async () => {
    await db.exec("set role service_role"); expect(await bind(A, null)).toBe(true); expect(await bind(A, null)).toBe(true);
    expect(await bind(B, null)).toBe(false); expect(await list()).toEqual([]);
    const id = await pay(); expect(await list()).toEqual([]); await publish();
    const [item] = await list(); expect(item).toMatchObject({ reportId: id, reportVersion: "v3", status: "available", displayName: "서재 검수" });
    expect(Date.parse(item.expiresAt) - Date.parse(item.publishedAt)).toBe(90 * 86400000);
    expect(await list(B)).toEqual([]);
    const before = await readPublishedReport(store, id);
    expect(await claim(id, A, null)).toBe("owned"); expect(await claim(id, B)).toBe("unavailable");
    expect(await pay()).toBe(id); expect(await list()).toHaveLength(1);
    expect(await readPublishedReport(store, id)).toEqual(before);
  });
  it("unbound guest still generates/reads; guessed report ID or share token grants no ownership", async () => {
    const id = await pay(); await publish(); expect((await readPublishedReport(store, id)).status).toBe("COMPLETED");
    expect(await list()).toEqual([]); expect(await claim(id)).toBe("unavailable");
    expect(await claim(id, A, claimHash("gr_" + "x".repeat(32)))).toBe("unavailable");
    expect(await bind(A, null)).toBe(false); // cannot attach a late visitor to an already-paid order
  });
  it("guest capability is report-bound, single-owner, same-user retry works; sharing unchanged", async () => {
    expect(await bind()).toBe(true); const id = await pay(); await publish();
    await db.query("insert into report_share_links(report_id,token) values($1,$2)", [id, "gr_" + "x".repeat(32)]);
    const original = await readPublishedReport(store, id);
    expect(await claim(id, null, hash, false)).toBe("claimable");
    expect(await claim(id, A, null)).toBe("unavailable");
    expect(await claim(id, A, claimHash(id))).toBe("unavailable");
    expect(await claim(id, A, claimHash("gr_" + "x".repeat(32)))).toBe("unavailable");
    expect(await claim(id)).toBe("owned"); expect(await claim(id)).toBe("owned"); expect(await claim(id, B)).toBe("unavailable");
    expect(await claim("report_guessed00000000000")).toBe("unavailable");
    expect((await db.query("select * from report_share_links")).rows).toHaveLength(1);
    expect(await readPublishedReport(store, id)).toEqual(original);
  });
  it("competing same/different-user claims converge on one PK; no second owner", async () => {
    await bind(); const id = await pay(); await publish();
    const outcomes = await Promise.all([claim(id), claim(id, B), claim(id), claim(id, B)]);
    expect(outcomes).toEqual(["owned", "unavailable", "owned", "unavailable"]);
    expect((await db.query("select * from report_account_links")).rows).toHaveLength(1);
  });
  it("pending and failed/invalid publication cannot enter the library", async () => {
    await bind(A, null); const id = await pay();
    expect(await claim(id, A, null)).toBe("unavailable");
    await runPaidReportJob(store, runtime, async () => ({ ok: false, error: { code: "INVALID_REPORT_INPUT", message: "test" } }));
    expect(await list()).toEqual([]);
    await db.exec("update report_generation_jobs set next_retry_at=now()-interval '1 second'");
    await runPaidReportJob(store, runtime, async () => ({ ...generated, draft: {} as typeof generated.draft }));
    expect(await list()).toEqual([]);
  });
  it.each(["revoked", "deleted", "refunded", "proof-expired", "report-expired"])("%s refuses claim and does not extend any dates", async reason => {
    await bind(); const id = await pay(); await publish();
    if (reason === "revoked") await db.exec("update report_purchase_bindings set revoked_at=now()");
    if (reason === "deleted") await db.exec("update payment_orders set deleted_at=now()");
    if (reason === "refunded") await db.exec("update payment_orders set status='refunded'");
    if (reason === "proof-expired") await db.exec("update report_purchase_bindings set claim_expires_at=now()-interval '1 second'");
    if (reason === "report-expired") await db.exec("update paid_report_snapshots set published_at=published_at-interval '91 days',expires_at=expires_at-interval '91 days'");
    expect(await claim(id)).toBe("unavailable"); expect(await list()).toEqual([]);
  });
  it("expiry redacts names immediately, disables links; existing expiry worker erases capability/name", async () => {
    await bind(); const id = await pay(); await publish(); await claim(id);
    await db.exec("update paid_report_snapshots set published_at=published_at-interval '91 days',expires_at=expires_at-interval '91 days'");
    expect((await list())[0]).toMatchObject({ status: "expired", displayName: "" });
    await store.call("expire");
    expect((await db.query("select display_name,claim_hash from report_purchase_bindings")).rows).toEqual([{ display_name: "", claim_hash: null }]);
    expect((await readPublishedReport(store, id)).snapshot).toBeNull(); expect(await claim(id)).toBe("unavailable");
  });
  it("abandoned ready-order metadata follows existing input purge, not an extra retention clock", async () => {
    await bind();
    await db.exec("update report_input_snapshots set expires_at=now()-interval '1 second'");
    await store.call("expire");
    expect((await db.query("select display_name,claim_hash from report_purchase_bindings")).rows).toEqual([{ display_name: "", claim_hash: null }]);
    expect(await list()).toEqual([]);
  });
  it("publish racing a claim cannot attach an unpublished book; retry converges after valid publish", async () => {
    await bind(A, null); const id = await pay();
    await Promise.all([publish(), claim(id, B)]);
    expect(await claim(id, A, null)).toBe("owned"); expect(await claim(id, B)).toBe("unavailable");
    expect(await list(A)).toHaveLength(1); expect(await list(B)).toHaveLength(0);
  });
  it("anon/authenticated cannot read, insert, mutate or invoke ownership RPCs even with permissive default grants", async () => {
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      for (const table of ["report_purchase_bindings", "report_account_links"]) {
        await expect(db.query(`select * from ${table}`)).rejects.toThrow(/permission denied/);
        await expect(db.query(`delete from ${table}`)).rejects.toThrow(/permission denied/);
      }
      await expect(bind(A, null)).rejects.toThrow(/permission denied/);
      await expect(list()).rejects.toThrow(/permission denied/);
      await expect(claim("report_guessed00000000")).rejects.toThrow(/permission denied/);
      await db.exec("reset role");
    }
    expect((await db.query<{ relrowsecurity: boolean }>("select relrowsecurity from pg_class where relname in ('report_account_links','report_purchase_bindings')")).rows.every(r => r.relrowsecurity)).toBe(true);
    expect((await db.query<{ prosecdef: boolean }>("select prosecdef from pg_proc where proname in ('list_account_reports','claim_report_account','bind_report_purchase','link_published_report_account')")).rows.every(r => !r.prosecdef)).toBe(true);
  });
  it("list SQL contains only metadata; rejects missing auth FK and duplicate ownership", async () => {
    await expect(bind("33333333-3333-4333-8333-333333333333", null)).rejects.toThrow(/foreign key/);
    const sql = readFileSync("supabase/migrations/20261003104500_v4_report_library.sql", "utf8").split("create function public.list_account_reports")[1];
    expect(sql).not.toMatch(/snapshot_json|payload_json/);
  });
});
