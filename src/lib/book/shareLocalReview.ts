import "server-only";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type { PGlite } from "@electric-sql/pglite";
import { localTicketDatabase, localTicketUserId } from "../tickets/localDatabase";
import type { ReliabilityResult } from "../payment/paidReportReliabilityStore";
import { confirmPaidReport } from "../payment/paidReportReliability";
import { runLocalBookJob, validateLocalBookInput } from "./localReview";
import { createLocalAccountPort } from "../account/localReview";
import { bindCheckout, type LibraryPort } from "../library/server";
import type { ShareStorePort } from "../sharing/reportShareStore";
import { loadShareablePublication } from "../sharing/reportShareStore";
import { validateBookPublication } from "./storedReport";
import { BOOK_SHARE_HEADERS, mayShareBook } from "./shareServer";
import { createAnnualCommerceAcceptance } from "../payment/annualPurchasePolicy";

// Existing SQL schemas in an isolated, restart-discarded test database. No provider/network.
const state = globalThis as typeof globalThis & { __bookShareReview?: Promise<PGlite> };
export async function localBookShareDatabase() {
  if (!["test", "development"].includes(process.env.NODE_ENV)) return null;
  return state.__bookShareReview ??= (async () => {
    const db = (await localTicketDatabase())!;
    await db.exec(await readFile("supabase/migrations/20260929113608_report_share_links.sql", "utf8"));
    return db;
  })();
}
export function sqlBookSharePort(db: PGlite): ShareStorePort {
  return {
    async read(action, data = {}) { return (await db.query<{ result: ReliabilityResult }>("select paid_report_reliability($1,$2::jsonb) result", [action, JSON.stringify(data)])).rows[0].result; },
    async find(key, value) {
      const query = key === "token" ? "select report_id,token,revoked_at from report_share_links where token=$1" : "select report_id,token,revoked_at from report_share_links where report_id=$1";
      return (await db.query<{ report_id: string; token: string; revoked_at: string | null }>(query, [value])).rows[0] ?? null;
    },
    async insert(id, token) { await db.query("insert into report_share_links(report_id,token) values($1,$2) on conflict(report_id) do nothing", [id, token]); return true; },
  };
}
export function sqlBookShareLibrary(db: PGlite): LibraryPort {
  const uid = async (user: string | null) => {
    const id = user ? localTicketUserId(user) : null;
    if (id) await db.query("insert into auth.users(id) values($1) on conflict do nothing", [id]);
    return id;
  };
  return {
    async bind(b) { return (await db.query<{ ok: boolean }>("select bind_report_purchase($1,$2,$3,$4,$5) ok", [b.orderId, await uid(b.buyerId), b.claimHash, b.displayName, b.selectedYear])).rows[0].ok; },
    async orderForReport(id) { return (await db.query<{ id: string }>("select order_id id from paid_report_snapshots where report_id=$1", [id])).rows[0]?.id ?? null; },
    async claim(id, user, hash, commit) { return (await db.query<{ state: Awaited<ReturnType<LibraryPort["claim"]>> }>("select claim_report_account($1,$2,$3,$4) state", [id, await uid(user), hash, commit])).rows[0].state; },
    async list() { return []; },
  };
}
export async function readOwnedLocalShareBook(request: NextRequest, reportId: string) {
  const db = await localBookShareDatabase(), auth = createLocalAccountPort(request);
  if (!db || !auth || !await mayShareBook(request, reportId, auth, sqlBookShareLibrary(db), true)) return null;
  return (await loadShareablePublication(reportId, validateBookPublication, sqlBookSharePort(db)))?.snapshot ?? null;
}
// Explicit developer fixture only. Normal ready → bound purchase → mock confirm → paid worker.
// No coupons, grants, tickets or referrals are issued here.
export async function createLocalShareFixture(request: NextRequest, payload: unknown) {
  const db = await localBookShareDatabase(), auth = createLocalAccountPort(request);
  if (!db || !auth || !validateLocalBookInput(payload).ok || (await db.query("select 1 from payment_orders limit 30")).rows.length >= 30) return NextResponse.json({}, { status: 400 });
  const input = payload as { productKey: string; productOptions?: { selectedYear?: string } }, id = `share-review-${randomUUID()}`, port = sqlBookSharePort(db);
  const created = await port.read("create_order", { paymentOrderId: id, providerOrderId: id, productType: input.productKey, provider: "toss", amount: 1290, inputSnapshot: { reportInputPayload: payload,
    ...(input.productKey === "annual_fortune" ? { annualCommerceAcceptance: createAnnualCommerceAcceptance(Number(input.productOptions?.selectedYear), new Date()) } : {}) } });
  if (!created.ok) return NextResponse.json({ error: "LOCAL_ORDER_FAILED" }, { status: 503 });
  const response = NextResponse.json({ ok: true }, { headers: BOOK_SHARE_HEADERS });
  const bound = await bindCheckout(request, response, id, payload, auth, sqlBookShareLibrary(db), true);
  if (!bound) return NextResponse.json({ error: "LOCAL_BIND_FAILED" }, { status: 503 });
  const paid = await confirmPaidReport({ orderId: id, paymentKey: `LOCAL_ONLY_${id}`, amount: 1290 }, { call: port.read }, async () => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: id, amount: 1290, status: "DONE" } }));
  if (!paid.ok || typeof paid.reportId !== "string") return NextResponse.json({ error: "LOCAL_CONFIRM_FAILED" }, { status: 503 });
  const { localReferralStore } = await import("../referrals/localReview");
  const { withReferralPublication } = await import("../referrals/service");
  const referrals = await localReferralStore();
  await runLocalBookJob(referrals ? withReferralPublication({ call: port.read }, referrals) : { call: port.read });
  const published = await loadShareablePublication(paid.reportId, validateBookPublication, port);
  if (!published) return NextResponse.json({ error: "LOCAL_PUBLICATION_FAILED" }, { status: 503 });
  const result = NextResponse.json({ reportId: paid.reportId, reportUrl: `/dev/book-flow/report/${paid.reportId}` }, { headers: BOOK_SHARE_HEADERS });
  for (const cookie of bound.cookies.getAll()) result.cookies.set(cookie);
  return result;
}
