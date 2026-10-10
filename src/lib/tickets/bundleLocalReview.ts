import "server-only";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { localAccountAllowed } from "../account/gate";
import { createLocalAccountPort } from "../account/localReview";
import { ACCOUNT_POLICY_VERSIONS, accountSession } from "../account/policy";
import { localTicketDatabase, localTicketStore, localTicketUserId } from "./localDatabase";
import { handleBundleCommerce } from "./bundleHandler";
import { MOCK_BUNDLE_POLICY } from "./shopContract";
import type { BundleResult, BundleStore } from "./bundleTypes";

const state = globalThis as typeof globalThis & { __bundleLocalSetup?: Promise<void>; __bundleLocalOutcomes?: Map<string, string>; __bundleGrantDelay?: Set<string> };
export async function handleLocalBundle(request: NextRequest, action: string) {
  if (!localAccountAllowed(request)) return new NextResponse(null, { status: 404 });
  const auth = createLocalAccountPort(request), db = await localTicketDatabase(), tickets = await localTicketStore();
  if (!auth || !db || !tickets) return new NextResponse(null, { status: 404 });
  state.__bundleLocalSetup ??= (async () => {
    await db.exec(await readFile("supabase/migrations/20261010095005_v4_ticket_bundle_commerce.sql", "utf8"));
  })();
  await state.__bundleLocalSetup;
  const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : null;
  if (!user || !snapshot || accountSession(user, snapshot).status !== "member") return NextResponse.json({ ok: false }, { status: 401 });
  const id = localTicketUserId(user.id);
  const store: BundleStore = { async call(a, u, data = {}) {
    if (a === "grant" && state.__bundleGrantDelay?.delete(String(data.orderId))) return { ok: false, code: "LOCAL_GRANT_DELAY" };
    return db.transaction(async tx => {
      const mapped = localTicketUserId(u);
      await tx.query("insert into auth.users(id) values($1) on conflict do nothing", [mapped]);
      await tx.exec("set local role service_role");
      if (a === "prepare") await tx.query("select record_account_consent($1,$2,'로컬 구매 검수','google','first_login',$3::jsonb)", [mapped, randomUUID(), JSON.stringify(Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type, document_version, is_agreed: true, required: true })))]);
      return (await tx.query<{ r: BundleResult }>("select ticket_bundle_commerce($1,$2,$3::jsonb) r", [a, mapped, JSON.stringify(data)])).rows[0].r;
    });
  } };
  const url = new URL(request.url), origin = url.origin;
  if (action === "mock") {
    if (request.method !== "POST" || request.headers.get("origin") !== origin) return new NextResponse(null, { status: 403 });
    const raw = await request.text(); if (raw.length > 300) return new NextResponse(null, { status: 400 });
    let body; try { body = JSON.parse(raw); } catch { return new NextResponse(null, { status: 400 }); }
    if (!body || !["DONE", "ABORTED", "PENDING", "GRANT_PENDING"].includes(body.outcome)) return new NextResponse(null, { status: 400 });
    const found = await store.call("read", user.id, { orderId: body.orderId });
    if (!found.order || found.order.status !== "READY") return new NextResponse(null, { status: 409 });
    // Fixed local provider facts; never a provider/financial API call.
    (state.__bundleLocalOutcomes ??= new Map()).set(`${id}:${found.order.providerOrderId}`, body.outcome);
    if (body.outcome === "GRANT_PENDING") (state.__bundleGrantDelay ??= new Set()).add(found.order.orderId);
    return NextResponse.json({ orderId: found.order.providerOrderId, amount: found.order.amount, paymentKey: `local-mock-${found.order.orderId}` }, { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  }
  return handleBundleCommerce(request, action, auth, store, async (p, recovery) => {
    const status = state.__bundleLocalOutcomes?.get(`${id}:${p.orderId}`);
    const found = await store.call("read", user.id, { orderId: p.orderId });
    if (!status || p.paymentKey !== `local-mock-${found.order?.orderId}`) return { ok: false, error: { code: "TOSS_CONFIRM_PROVIDER_ERROR", message: "Local approval unavailable" } };
    if (status === "PENDING" && !recovery) return { ok: false, error: { code: "TOSS_CONFIRM_PROVIDER_ERROR", message: "Local pending" } };
    return { ok: true, confirm: { provider: "toss", paymentKeyReceived: true, paymentKeyVerified: true, currency: "KRW", orderId: p.orderId, amount: p.amount, status: status === "ABORTED" ? "ABORTED" : "DONE", approvedAt: new Date().toISOString() } };
  }, { clientKey: "local-mock-only", successUrl: `${origin}/dev/account/tickets/checkout/success`, failUrl: `${origin}/dev/account/tickets/checkout/fail`, allowLocalhostRedirects: true }, { tickets, localOrigin: origin, purchasePolicyVersion: MOCK_BUNDLE_POLICY });
}
