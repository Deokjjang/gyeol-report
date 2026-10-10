import "server-only";
import { NextRequest, NextResponse } from "next/server";
import type { AccountPort } from "../account/handler";
import { accountSession, ACCOUNT_POLICY_VERSIONS } from "../account/policy";
import { publicRequestOrigin } from "../account/origin";
import { isRecord } from "../report-generation/productPublishGate";
import { bundleCheckout, prepareBundleOrder, confirmBundleOrder, recoverBundleOrder, type BundleProvider, type BundleCheckoutConfig } from "./bundleService";
import type { BundleStore } from "./bundleTypes";
import { createHash } from "node:crypto";
import { BUNDLE_PURCHASE_POLICY_VERSION, validBundleConsent } from "./shopContract";
import type { TicketStore } from "./service";
import { ticketBundle } from "./bundleCatalog";

// Dedicated member store handler; all public commerce gates remain OFF.
export async function handleBundleCommerce(request: NextRequest, action: string, auth: AccountPort, store: BundleStore, provider: BundleProvider, config: BundleCheckoutConfig,
  options: { tickets?: TicketStore; purchasePolicyVersion?: string | null; localOrigin?: string } = {}) {
  const json = (body: object, status = 200) => auth.finish(NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Vary: "Cookie", "Referrer-Policy": "no-referrer" } }));
  if (!["prepare", "confirm", "recover", "history", "state"].includes(action)) return json({}, 404);
  if (request.method !== (["history", "state"].includes(action) ? "GET" : "POST")) return json({}, 405);
  const local = ["development", "test"].includes(process.env.NODE_ENV) && options.localOrigin === new URL(request.url).origin && ["localhost", "127.0.0.1", "[::1]"].includes(new URL(request.url).hostname);
  const origin = local ? options.localOrigin : publicRequestOrigin(request);
  if (!origin || (request.method === "POST" && request.headers.get("origin") !== origin)) return json({}, 403);
  try {
    const user = await auth.currentUser(), snapshot = user ? await auth.read(user) : null;
    if (!user || !snapshot || snapshot.profile?.id !== user.id || accountSession(user, snapshot).status !== "member") return json({ ok: false, code: "MEMBER_CONSENT_REQUIRED" }, 401);
    // Presentation scope only, not an authorization token. Same-name account
    // switches invalidate client state; all authority still comes from getUser.
    const scope = createHash("sha256").update(`bundle-ui-v1:${user.id}`).digest("hex");
    const expected = request.headers.get("x-ticket-account");
    if (expected && expected !== scope) return json({ ok: false, code: "ACCOUNT_CHANGED" }, 409);
    if (action === "state") {
      const balance = await options.tickets?.call("summary", user.id);
      if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
      return balance?.ok && Number.isInteger(balance.quantity) && Number(balance.quantity) >= 0 ? json({ ok: true, scope, quantity: balance.quantity }) : json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    }
    if (action === "history") {
      const r = await store.call("history", user.id);
      if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
      return r.ok ? json({ ok: true, orders: r.orders ?? [] }) : json({ ok: false, code: "STORAGE_UNAVAILABLE" }, 503);
    }
    if (Number(request.headers.get("content-length")) > 4096) return json({}, 413);
    const reader = request.body?.getReader();
    if (!reader) return json({}, 400);
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) { const next = await reader.read(); if (next.done) break; size += next.value.byteLength; if (size > 4096) { await reader.cancel(); return json({}, 413); } chunks.push(next.value); }
    let body: unknown;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return json({}, 400); }
    const fields = action === "prepare" ? ["bundleId", "requestId", "consent"] : action === "confirm" ? ["orderId", "paymentKey", "amount"] : ["orderId"];
    if (!isRecord(body) || Object.keys(body).some(k => !fields.includes(k))) return json({ ok: false, code: "INVALID_INPUT" }, 400);
    if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
    let result;
    if (action === "prepare") {
      if (!ticketBundle(body.bundleId) || typeof body.requestId !== "string" || !/^[a-zA-Z0-9_-]{16,100}$/.test(body.requestId)) return json({ ok: false, code: "INVALID_INPUT" }, 400);
      const version = options.purchasePolicyVersion ?? BUNDLE_PURCHASE_POLICY_VERSION;
      if (!version) return json({ ok: false, code: "PURCHASE_POLICY_PENDING" }, 503);
      if (!expected || !validBundleConsent(body.consent, version)) return json({ ok: false, code: "PURCHASE_CONSENT_REQUIRED" }, 400);
      result = await prepareBundleOrder(store, user.id, { bundleId: body.bundleId, requestId: body.requestId }, { ...ACCOUNT_POLICY_VERSIONS, purchase: { version, product: true, digitalDelivery: true, purchasePolicy: true, recordedAt: new Date().toISOString() } });
      const checkout = result.order ? bundleCheckout(result.order, config, user.displayName) : null;
      if (result.ok && result.order?.status === "READY" && !checkout) return json({ ok: false, code: "CHECKOUT_UNAVAILABLE" }, 503);
      return json({ ok: result.ok, code: result.code, order: result.order, ...(checkout ? { tossCheckoutRequest: { ...checkout, customerKey: `member_${scope}` } } : {}) }, result.ok ? 200 : 400);
    }
    if (typeof body.orderId !== "string" || !/^bundle_(?:toss_)?[a-f0-9]{32}$/.test(body.orderId)) return json({}, 400);
    if (action === "confirm") {
      if (typeof body.paymentKey !== "string" || typeof body.amount !== "number") return json({}, 400);
      result = await confirmBundleOrder(store, user.id, { orderId: body.orderId, paymentKey: body.paymentKey, amount: body.amount }, provider);
    } else {
      const current = await store.call("read", user.id, { orderId: body.orderId });
      if (!current.ok) return json({ ok: false, code: "ORDER_NOT_FOUND" }, 404);
      result = current.order && ["READY", "GRANTED", "FAILED", "REFUND_PENDING", "REFUNDED"].includes(current.order.status) ? current : await recoverBundleOrder(store, user.id, body.orderId, provider);
    }
    if ((await auth.currentUser())?.id !== user.id) return json({}, 401);
    if (!result.order) {
      const current = await store.call("read", user.id, { orderId: body.orderId });
      if (current.order) result = { ...result, order: current.order };
    }
    // Pending is never represented as successful fulfillment. No tokens/keys escape.
    const ready = result.ok && result.order?.status === "GRANTED";
    return json({ ok: ready, order: result.order, code: ready ? undefined : result.code ?? "PAYMENT_PENDING" }, ready ? 200 : result.pending || result.code === "PAID_PENDING_GRANT" ? 202 : 409);
  } catch { return json({ ok: false, code: "PAYMENT_RECONCILIATION_REQUIRED" }, 503); }
}
