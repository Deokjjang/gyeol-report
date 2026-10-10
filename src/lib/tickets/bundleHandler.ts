import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession, ACCOUNT_POLICY_VERSIONS } from "../account/policy";
import { publicRequestOrigin } from "../account/origin";
import { isRecord } from "../report-generation/productPublishGate";
import { bundleCheckout, prepareBundleOrder, confirmBundleOrder, recoverBundleOrder, type BundleProvider, type BundleCheckoutConfig } from "./bundleService";
import type { BundleStore } from "./bundleTypes";

// Server handler foundation. Not mounted in a selling UI; production gate is OFF.
export async function handleBundleCommerce(request: NextRequest, action: string, auth: AccountPort, store: BundleStore, provider: BundleProvider, config: BundleCheckoutConfig) {
  const json = (body: object, status = 200) => auth.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (!["prepare", "confirm", "recover", "history"].includes(action)) return json({}, 404);
  if (request.method !== (action === "history" ? "GET" : "POST")) return json({}, 405);
  const origin = publicRequestOrigin(request);
  if (!origin || (request.method === "POST" && request.headers.get("origin") !== origin)) return json({}, 403);
  try {
    const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : null;
    if (!user || !snapshot || snapshot.profile?.id !== user.id || accountSession(user, snapshot).status !== "member") return json({ ok: false, code: "MEMBER_CONSENT_REQUIRED" }, 401);
    if (action === "history") {
      const r = await store.call("history", user.id);
      return r.ok ? json({ ok: true, orders: r.orders ?? [] }) : json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    }
    if (Number(request.headers.get("content-length")) > 4096) return json({}, 413);
    const reader = request.body?.getReader();
    if (!reader) return json({}, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const next = await reader.read(); if (next.done) break; size += next.value.byteLength; if (size > 4096) { await reader.cancel(); return json({}, 413); } chunks.push(next.value); }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return json({}, 400); }
    const fields = action === "prepare" ? ["bundleId", "requestId"] : action === "confirm" ? ["orderId", "paymentKey", "amount"] : ["orderId"];
    if (!isRecord(body) || Object.keys(body).some(k => !fields.includes(k))) return json({ ok: false, code: "INVALID_INPUT" }, 400);
    if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
    let result;
    if (action === "prepare") {
      result = await prepareBundleOrder(store, user.id, { bundleId: body.bundleId, requestId: body.requestId }, ACCOUNT_POLICY_VERSIONS);
      const checkout = result.order ? bundleCheckout(result.order, config, user.displayName) : null;
      if (result.ok && result.order?.status === "READY" && !checkout) return json({ ok: false, code: "CHECKOUT_UNAVAILABLE" }, 503);
      return json({ ok: result.ok, code: result.code, order: result.order, ...(checkout ? { tossCheckoutRequest: checkout } : {}) }, result.ok ? 200 : 400);
    }
    if (typeof body.orderId !== "string" || !/^bundle_(?:toss_)?[a-f0-9]{32}$/.test(body.orderId)) return json({}, 400);
    if (action === "confirm") {
      if (typeof body.paymentKey !== "string" || typeof body.amount !== "number") return json({}, 400);
      result = await confirmBundleOrder(store, user.id, { orderId: body.orderId, paymentKey: body.paymentKey, amount: body.amount }, provider);
    } else result = await recoverBundleOrder(store, user.id, body.orderId, provider);
    // Pending is never represented as successful fulfillment. No tokens/keys escape.
    const ready = result.ok && result.order?.status === "GRANTED";
    return json({ ok: ready, order: result.order, code: ready ? undefined : result.code ?? "PAYMENT_PENDING" }, ready ? 200 : result.pending || result.code === "PAID_PENDING_GRANT" ? 202 : 409);
  } catch { return json({ ok: false, code: "PAYMENT_RECONCILIATION_REQUIRED" }, 503); }
}
