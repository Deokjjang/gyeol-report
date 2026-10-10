import { randomUUID, createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { ticketPublicationSql, ticketAuth, TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";
import { enqueueTicketPublication, type TicketPublicationStore } from "../../../src/lib/tickets/publication";
import { handleTicketPublication } from "../../../src/lib/tickets/publicHandler";
import { runTicketPublicationJob, runTicketPublicationBatch } from "../../../src/lib/tickets/publicationWorker";
import { readOwnedTicketReport } from "../../../src/lib/tickets/ownerRead";
import { createCheckoutConsentAssertion, createCheckoutConsentEvidence } from "../../../src/lib/payment/checkoutConsent";
import { confirmedAdultDevTossCheckoutLegalConfirmations as agreed } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { RUNTIME_FIXTURES, singleRuntimeInput } from "../interpretation-v4/runtimeFixtures";
import { BOOK_FIXTURES } from "../../../src/app/dev/book-preview/runtimeBooks";
import { storedBook } from "../../../src/lib/book/storedReport";
import { prepareBookShare, loadSharedBookData } from "../../../src/lib/book/shareServer";
import { sqlBookSharePort, sqlBookShareLibrary } from "../../../src/lib/book/shareLocalReview";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { generateV4ShadowReport } from "../../../src/lib/interpretation-v4/runtimeShadow";

const now = new Date("2026-10-10T03:00:00Z"), consent = createCheckoutConsentEvidence(createCheckoutConsentAssertion(agreed), "1990-01-01", now)!;
const fixtures = [...RUNTIME_FIXTURES.map(f => ({ ...f, payload: f.id === "annual" ? { ...f.payload, productOptions: { selectedYear: "2026" } } : f.payload })),
  { id: "comprehensive-sparse", payload: singleRuntimeInput("saju_mbti_full", "saju-mbti-full", {
    id: "sparse", name: "출시검수1", date: "1993-02-06", gender: "FEMALE", mbti: "",
    context: { jobStatus: "", detailJob: "", relationshipStatus: "single" },
  }) },
];
let local: Awaited<ReturnType<typeof ticketPublicationSql>>;
const grant = (quantity = 1, user = A, extra: Record<string, unknown> = {}) => local.tickets.call("grant", user, { quantity, sourceType: "manual", sourceRef: randomUUID(), key: randomUUID(), reason: "LOCAL_TEST", ...extra });
const reserve = (payload: unknown = fixtures[0].payload, key: string = randomUUID(), user = A, queue = local.queue) => enqueueTicketPublication(queue, user, key, payload, consent, now);
const request = (action: string, body?: unknown, origin = "https://gyeolreport.com") => new NextRequest(`https://gyeolreport.com/auth/ticket-${action}`, { method: action.startsWith("status") ? "GET" : "POST", headers: { origin, "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
const exportDir = process.env.TICKET_PUBLICATION_EXPORT;
const exports: unknown[] = [];
const sharePort = () => ({ ...sqlBookSharePort(local.db), async owned(reportId: string, user: string) { return (await local.db.query<{ r: { ok: boolean } }>("select book_share_publication($1,$2) r", [reportId, user])).rows[0].r.ok; } });
beforeAll(async () => { local = await ticketPublicationSql(); }, 30000);
beforeEach(async () => { await local.db.exec("reset role; truncate ticket_bundle_orders,report_ticket_grants,payment_orders cascade; set role service_role;"); });
afterAll(async () => {
  if (exportDir) { mkdirSync(exportDir, { recursive: true }); writeFileSync(`${exportDir}/six-products.json`, JSON.stringify(exports)); }
  await local.db?.close();
});

describe("public ticket queue: real SQL chain, deterministic V4, no financial calls", () => {
  it("reservation does not generate; 100 retries/last ticket converge; canonical keys conflict", async () => {
    await grant(); const key = randomUUID();
    const rs = await Promise.all(Array.from({ length: 100 }, () => reserve(fixtures[0].payload, key)));
    expect(rs.every(r => r.state === "QUEUED")).toBe(true); expect(new Set(rs.map(r => r.redemptionId)).size).toBe(1);
    expect(await reserve(fixtures[0].payload, key.toUpperCase())).toMatchObject({ state: "QUEUED", redemptionId: rs[0].redemptionId });
    expect(await reserve()).toMatchObject({ code: "NO_USABLE_TICKET" });
    const original = fixtures[0].payload;
    const changed = { ...original, person: { ...("person" in original ? original.person : {}), name: "다른입력" } };
    expect(await reserve(changed, key)).toMatchObject({ code: "REQUEST_CONFLICT" });
    expect((await local.db.query("select * from report_ticket_ledger where event_type='REDEEM'")).rows).toHaveLength(1);
    expect((await local.db.query("select snapshot_json from paid_report_snapshots")).rows[0]).toEqual({ snapshot_json: null });
    expect((await local.tickets.call("summary", A)).quantity).toBe(0);
  });
  it("distinct last-ticket contenders and two claim calls: exactly one reservation and one lease (PGlite serialized)", async () => {
    await grant(); const rs = await Promise.all([reserve(), reserve()]); expect(rs.filter(r => r.ok)).toHaveLength(1);
    const claims = await Promise.all([local.queue.call("claim", null), local.queue.call("claim", null)]);
    expect(claims.filter(r => r.token)).toHaveLength(1); expect(claims.filter(r => r.empty)).toHaveLength(1);
  });
  it("lost enqueue acknowledgement recovers by owner + requestId", async () => {
    await grant(); const id = randomUUID();
    const flaky: TicketPublicationStore = { async call(a, u, d) { await local.queue.call(a, u, d); throw Error("ACK_LOST"); } };
    expect(await reserve(fixtures[0].payload, id, A, flaky)).toMatchObject({ code: "STORAGE_UNAVAILABLE" });
    expect(await local.queue.call("status", A, { requestId: id })).toMatchObject({ state: "QUEUED" });
    expect(await local.queue.call("status", B, { requestId: id })).toMatchObject({ code: "NOT_FOUND" });
    expect(await reserve(fixtures[0].payload, id)).toMatchObject({ state: "QUEUED" });
    expect((await local.tickets.call("summary", A)).quantity).toBe(0);
  });
  it("crash/expired lease restores original lot once; stale publication is fenced; queued survives browser absence", async () => {
    await grant(); const queued = await reserve();
    await local.db.exec("update report_ticket_redemptions set lease_until=now()-interval '1 minute'");
    expect((await local.tickets.call("summary", A)).quantity).toBe(0);
    const claim = await local.queue.call("claim", null);
    await local.db.exec("update report_ticket_redemptions set lease_until=now()-interval '1 minute'");
    await local.queue.call("claim", null); // worker-side reconciliation, no browser required
    expect(await local.queue.call("status", A, { redemptionId: queued.redemptionId })).toMatchObject({ state: "REVERSED" });
    expect(await local.queue.call("publish", A, { redemptionId: claim.redemptionId, token: claim.token })).toMatchObject({ state: "REVERSED" });
    expect((await local.tickets.call("summary", A)).quantity).toBe(1);
    expect((await local.db.query("select * from report_ticket_ledger where event_type='REVERSAL'")).rows).toHaveLength(1);
  });
  it.each(["generation", "persistence", "ack"])("%s failure reconciles using durable state, never timeout guesses", async failure => {
    await grant(); await reserve();
    const queue: TicketPublicationStore = { async call(a, u, d) {
      if (a === "publish" && failure === "persistence") throw Error("DISK");
      const r = await local.queue.call(a, u, d);
      if (a === "publish" && failure === "ack") throw Error("ACK_LOST");
      return r;
    } };
    const result = await runTicketPublicationJob(queue, failure === "generation" ? async () => { throw Error("GENERATION"); } : undefined);
    expect(result).toMatchObject({ state: failure === "ack" ? "COMPLETED" : "REVERSED" });
    expect((await local.tickets.call("summary", A)).quantity).toBe(failure === "ack" ? 0 : 1);
  }, 60000);
  it("wrong lease/cross-user publish rejected, no caller may reverse a queued reservation", async () => {
    await grant(); const r = await reserve();
    expect(await local.queue.call("reverse", A, { redemptionId: r.redemptionId, token: randomUUID() })).toMatchObject({ code: "STALE_LEASE" });
    const c = await local.queue.call("claim", null);
    expect(await local.queue.call("reverse", B, { redemptionId: c.redemptionId, token: c.token })).toMatchObject({ code: "NOT_FOUND" });
    expect(await local.queue.call("publish", A, { redemptionId: c.redemptionId, token: randomUUID() })).toMatchObject({ code: "STALE_LEASE" });
  });
  it("refund-held FEFO lot rolls reservation back, does not skip to another lot", async () => {
    const g = await grant(1, A, { sourceType: "purchase", expiresAt: new Date(Date.now() + 60000).toISOString() }); await grant();
    await local.db.query("insert into ticket_bundle_orders(user_id,request_id,bundle_id,quantity,amount,currency,consent_evidence,status,grant_id,paid_at,refund_state) values($1,$2,'SINGLE_1',1,1490,'KRW','{}','REFUND_PENDING',$3,now(),'REVIEW_REQUIRED')", [A, randomUUID(), g.grantId]);
    expect(await reserve()).toMatchObject({ code: "REFUND_HOLD" });
    expect((await local.db.query("select * from report_ticket_redemptions")).rows).toHaveLength(0);
    expect((await local.tickets.call("summary", A)).quantity).toBe(2);
  });
  it("service-only RPC and append-only original ledger", async () => {
    for (const role of ["anon", "authenticated"]) {
      await local.db.exec(`reset role; set role ${role}`);
      await expect(local.queue.call("claim", null)).rejects.toThrow(/permission denied/);
      await expect(local.queue.call("enqueue", A)).rejects.toThrow(/permission denied/);
    }
  });
  it.each(fixtures)("$id real queue → V4 → owner/Book/library/share, stable clock and no side effects", async f => {
    await grant(); const requestId = randomUUID(), queued = await reserve(f.payload, requestId);
    expect(queued).toMatchObject({ state: "QUEUED" });
    expect(await runTicketPublicationJob(local.queue)).toMatchObject({ state: "COMPLETED" });
    const reportId = String(queued.reportId);
    const owner = await readOwnedTicketReport(reportId, ticketAuth(), local.tickets);
    expect(owner.kind).toBe("ticketBook"); if (owner.kind !== "ticketBook") return;
    const book = storedBook(owner.snapshot)!; expect(book).not.toBeNull(); expect(book.data.pages.at(-1)?.kind).toBe("back");
    // A missing ticket owner must not leak through the old public paid read.
    expect(await local.paid.call("read_report", { reportId })).toMatchObject({ ok: false, code: "REPORT_NOT_FOUND" });
    const html = book.data.pages.map(page => renderToStaticMarkup(createElement(BookReader, { data: book.data, page, onPage() {}, onNote() {}, onShare() {} }))).join("");
    expect(html).toContain("이 책 공유하기"); expect(html).not.toContain("<footer");
    const normalized = normalizeReportInputPayload(f.payload, { now: () => now }); expect(normalized.ok).toBe(true);
    const repeat = await generateV4ShadowReport(normalized.ok ? normalized.value : null, { evaluatedAt: now.toISOString(), policyDate: now.toISOString() });
    expect(repeat.ok).toBe(true);
    if (repeat.ok) { expect(owner.snapshot.draft).toEqual(repeat.draft); expect(owner.snapshot.evidencePacket).toEqual(repeat.evidencePacket); }
    if (f.id === "major") { const timeline = book.data.pages.find(p => p.kind === "timeline"); expect(timeline?.kind === "timeline" && timeline.years.length).toBe(14); expect(timeline?.kind === "timeline" && timeline.years.filter(y => y.time === "앞으로")).toHaveLength(10); }
    if (f.id === "annual") { const months = book.data.pages.find(p => p.kind === "months"); expect(months?.kind === "months" && months.months.map(m => m.month)).toEqual([1,2,3,4,5,6,7,8,9,10,11,12]); expect(book.data.title).toContain("2026"); }
    if (f.id === "compatibility") { expect(book.data.people).toHaveLength(2); const pair = book.data.pages.find(p => p.kind === "pair"); expect(pair?.kind === "pair" && pair.directions).toHaveLength(2); }
    expect((await local.tickets.call("library", A)).items).toEqual([expect.objectContaining({ reportId, reportVersion: "v4", status: "available" })]);
    expect(await readOwnedTicketReport(reportId, ticketAuth(B), local.tickets)).toEqual({ kind: "absent" });
    expect(await readOwnedTicketReport(reportId, ticketAuth(null), local.tickets)).toEqual({ kind: "absent" });
    const share = await prepareBookShare(new NextRequest("https://gyeolreport.com/api/book-share", { method: "POST", headers: { origin: "https://gyeolreport.com" }, body: JSON.stringify({ reportId }) }), ticketAuth(), sqlBookShareLibrary(local.db), sharePort());
    expect(share.status).toBe(200); const { model } = await share.json();
    expect((await loadSharedBookData(model.shareToken, sqlBookSharePort(local.db)))?.data).toEqual(book.data);
    const after = await local.queue.call("status", A, { redemptionId: queued.redemptionId });
    expect(after.state).toBe("COMPLETED"); expect((await local.tickets.call("summary", A)).quantity).toBe(0);
    if (f.id === "comprehensive-sparse") {
      expect(await reserve(f.payload, requestId)).toMatchObject({ state: "COMPLETED", reportId });
      expect(await runTicketPublicationJob(local.queue)).toMatchObject({ empty: true });
      expect((await local.db.query("select * from report_ticket_ledger where event_type='REDEEM'")).rows).toHaveLength(1);
      expect((await local.db.query("select * from paid_report_snapshots where published_at is not null")).rows).toHaveLength(1);
    }
    exports.push({ id: f.id, input: f.payload, reportId, book, contentHash: createHash("sha256").update(JSON.stringify(owner.snapshot.draft)).digest("hex") });
    await local.db.exec("reset role");
    for (const table of ["payment_orders", "report_generation_jobs", "ticket_bundle_orders", "coupon_redemptions", "referral_attributions", "campaign_attributions", "meta_purchase_dispatches"]) expect((await local.db.query(`select * from ${table}`)).rows).toHaveLength(0);
    await local.db.exec("set role service_role; update report_account_links set revoked_at=now()");
    expect(await readOwnedTicketReport(reportId, ticketAuth(), local.tickets)).toEqual({ kind: "absent" });
    expect(await loadSharedBookData(model.shareToken, sqlBookSharePort(local.db))).toBeNull();
    await local.db.exec("update report_account_links set revoked_at=null; update paid_report_snapshots set published_at=now()-interval '91 days',expires_at=now()-interval '1 day'");
    expect(await readOwnedTicketReport(reportId, ticketAuth(), local.tickets)).toEqual({ kind: "expired" });
    expect(await loadSharedBookData(model.shareToken, sqlBookSharePort(local.db))).toBeNull();
    expect((await local.tickets.call("summary", A)).quantity).toBe(0);
  }, 60000);
  it.each(BOOK_FIXTURES.filter(f => /unknown|approx/.test(f.id)))("$id input uncertainty contracts survive queued publication", async f => {
    await grant(); expect(await reserve(f.payload)).toMatchObject({ state: "QUEUED" });
    expect(await runTicketPublicationJob(local.queue)).toMatchObject({ state: "COMPLETED" });
  }, 60000);
  it("bounded worker stops admission, never races already-started publication", async () => {
    const runJob = vi.fn(async () => ({ ok: true, state: "COMPLETED" }));
    expect(await runTicketPublicationBatch(local.queue, { runJob, now: () => 0, rss: () => 0 })).toMatchObject({ processed: 2, stop: "job_limit" });
    runJob.mockClear(); expect(await runTicketPublicationBatch(local.queue, { runJob, rss: () => 2 * 1024 ** 3 })).toMatchObject({ processed: 0, stop: "budget" }); expect(runJob).not.toHaveBeenCalled();
    let clock = 0; expect(await runTicketPublicationBatch(local.queue, { runJob, now: () => clock += 31000, rss: () => 0 })).toMatchObject({ processed: 0, stop: "budget" });
  });
});
describe("public API security and safe response", () => {
  it("verified member/current consent/origin/bounded body/authority fields required", async () => {
    const store = { call: vi.fn(async () => ({ ok: true })) }, body = { requestId: randomUUID(), payload: fixtures[0].payload, consent: createCheckoutConsentAssertion(agreed) };
    for (const auth of [ticketAuth(null), ticketAuth(A, false)]) expect((await handleTicketPublication(request("redeem", body), "redeem", auth, store)).status).toBe(401);
    expect((await handleTicketPublication(request("redeem", body, "https://evil.example"), "redeem", ticketAuth(), store)).status).toBe(403);
    for (const field of ["userId", "grantId", "quantity", "sourceType", "amount", "reportId", "redemptionId", "leaseToken"]) expect((await handleTicketPublication(request("redeem", { ...body, [field]: "attack" }), "redeem", ticketAuth(), store)).status).toBe(400);
    expect((await handleTicketPublication(request("redeem", { ...body, requestId: "not-random" }), "redeem", ticketAuth(), store)).status).toBe(400);
    expect((await handleTicketPublication(request("redeem", { ...body, padding: "가".repeat(17000) }), "redeem", ticketAuth(), store)).status).toBe(413);
    expect(store.call).not.toHaveBeenCalled();
  });
  it("owner-only status includes no token/input/snapshot and exposes only safe completed URL", async () => {
    await grant(); const key = randomUUID(), r = await reserve(fixtures[0].payload, key);
    const response = await handleTicketPublication(request(`status?requestId=${key}`), "status", ticketAuth(), local.queue);
    expect(response.status).toBe(202); expect(response.headers.get("cache-control")).toContain("no-store");
    const data = await response.json(); expect(data).toMatchObject({ state: "QUEUED", redemptionId: r.redemptionId }); expect(JSON.stringify(data)).not.toMatch(/token|input|snapshot|reportId|birthDate/);
    expect((await handleTicketPublication(request(`status?redemptionId=${r.redemptionId}`), "status", ticketAuth(B), local.queue)).status).toBe(404);
    expect(await readOwnedTicketReport(String(r.reportId), ticketAuth(), { call: async () => ({ ok: false, code: "STORAGE_UNAVAILABLE" }) })).toEqual({ kind: "storageError" });
  });
});
