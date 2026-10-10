import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createHash, randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { ticketPublicationSql, ticketAuth, TICKET_A as A, TICKET_B as B } from "../../helpers/ticketPublicationSql";
import { handleBundleCommerce } from "../../../src/lib/tickets/bundleHandler";
import { bundleEditions, bundlePendingKey, BUNDLE_PURCHASE_POLICY_VERSION, MOCK_BUNDLE_POLICY, validBundleConsent, ticketEventLabel } from "../../../src/lib/tickets/shopContract";
import { captureBundleCallback, launchBundleCheckout, recordBookReturn, readBookReturn, readPendingBundle, safeBundleOrder } from "../../../src/lib/tickets/shopClient";
import { safeAccountNext } from "../../../src/lib/account/policy";
import { TicketShop } from "../../../src/components/account/TicketShop";
import type { BundleOrder, BundleResult, BundleStore } from "../../../src/lib/tickets/bundleTypes";
import type { BundleProvider } from "../../../src/lib/tickets/bundleService";
import { ticketShopEnabled } from "../../../src/lib/tickets/shopGate";
import { loadTossPaymentsBrowserSdk } from "../../../src/lib/payment/tossBrowserSdkLoader";
vi.mock("../../../src/lib/payment/tossBrowserSdkLoader",()=>({loadTossPaymentsBrowserSdk:vi.fn()}));

let sql: Awaited<ReturnType<typeof ticketPublicationSql>>, store: BundleStore;
const scope = (user = A) => createHash("sha256").update(`bundle-ui-v1:${user}`).digest("hex");
const consent = { version: MOCK_BUNDLE_POLICY, product: true, digitalDelivery: true, purchasePolicy: true };
const config = { clientKey: "test-only", successUrl: "https://gyeolreport.com/account/tickets/checkout/success", failUrl: "https://gyeolreport.com/account/tickets/checkout/fail" };
const provider = vi.fn<BundleProvider>(async p => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, paymentKeyVerified: true, currency: "KRW", orderId: p.orderId, amount: p.amount, status: "DONE", approvedAt: new Date().toISOString() } }));
const request = (action: string, body?: object, owner = A, origin = "https://gyeolreport.com") => new NextRequest(`https://gyeolreport.com/api/ticket-bundles/${action}`, { method: ["state", "history"].includes(action) ? "GET" : "POST", headers: { origin, "content-type": "application/json", "x-ticket-account": scope(owner) }, ...(body ? { body: JSON.stringify(body) } : {}) });
const invoke = (action: string, body?: object, user: string | null = A, options = { tickets: sql.tickets, purchasePolicyVersion: MOCK_BUNDLE_POLICY }) => handleBundleCommerce(request(action, body, user ?? A), action, ticketAuth(user), store, provider, config, options);
beforeAll(async () => {
  sql = await ticketPublicationSql();
  store = { async call(action, user, data = {}) { return (await sql.db.query<{ r: BundleResult }>("select ticket_bundle_commerce($1,$2,$3::jsonb) r", [action, user, JSON.stringify(data)])).rows[0].r; } };
});
afterAll(async () => { await sql.db.close(); });
describe("COMMERCE-03 real order/ledger boundary", () => {
  it("catalog prices, unit prices and exact discounts derive from SSOT", () => {
    expect(bundleEditions().map(b => [b.quantity, b.amount, b.saving, b.unit])).toEqual([[1,1490,0,1490],[3,4290,180,1430],[5,6890,560,1378],[10,13400,1500,1340]]);
  });
  it("production policy approval is absent, prepare cannot invent consent", async () => {
    expect(BUNDLE_PURCHASE_POLICY_VERSION).toBeNull(); expect(ticketShopEnabled()).toBe(false);
    const r = await handleBundleCommerce(request("prepare", { bundleId: "PACK_3", requestId: randomUUID(), consent }), "prepare", ticketAuth(), store, provider, config);
    expect(r.status).toBe(503); expect(await r.json()).toMatchObject({ code: "PURCHASE_POLICY_PENDING" });
  });
  it.each([null, {}, { ...consent, purchasePolicy: false }, { ...consent, version: "old" }, { ...consent, optional: true }])("purchase-specific invalid assertion %j cannot prepare", async value => {
    expect(validBundleConsent(value, MOCK_BUNDLE_POLICY)).toBe(false);
    const r = await invoke("prepare", { bundleId: "PACK_3", requestId: randomUUID(), consent: value }); expect(r.status).toBe(400);
  });
  it.each(bundleEditions())("$id prepare/consent/callback/revisit/server balance, no automatic report", async edition => {
    const before = Number((await sql.tickets.call("summary", A)).quantity), requestId = randomUUID();
    const prepared = await (await invoke("prepare", { bundleId: edition.id, requestId, consent })).json();
    const order: BundleOrder = prepared.order; expect(safeBundleOrder(order)).toBe(true);
    expect(prepared.tossCheckoutRequest.requestPayment.successUrl).toBe(config.successUrl);
    expect(prepared.tossCheckoutRequest.customerKey).toBe(`member_${scope()}`);
    expect(prepared.tossCheckoutRequest.metadata).toEqual({ bundleOrderId: order.orderId, bundleId: edition.id });
    expect((await (await invoke("prepare", { bundleId: edition.id, requestId, consent })).json()).order.orderId).toBe(order.orderId);
    const evidence = (await sql.db.query<{ consent_evidence: Record<string, unknown> }>("select consent_evidence from ticket_bundle_orders where id=$1", [order.orderId])).rows[0].consent_evidence;
    expect(evidence.purchase).toMatchObject({ version: MOCK_BUNDLE_POLICY, product: true, digitalDelivery: true, purchasePolicy: true });
    const body = { orderId: order.providerOrderId, paymentKey: `mock-key-${requestId}`, amount: edition.amount };
    const paid = await invoke("confirm", body); expect(paid.status).toBe(200);
    expect(await paid.text()).not.toMatch(/paymentKey|mock-key|confirm_token|user_id/);
    for (let i = 0; i < 3; i++) expect((await (await invoke("recover", { orderId: order.orderId })).json()).order.status).toBe("GRANTED");
    expect((await sql.tickets.call("summary", A)).quantity).toBe(before + edition.quantity);
    expect((await sql.db.query("select * from report_ticket_redemptions")).rows).toHaveLength(0);
  });
  it("member A history and recovery never appear to B; stale scope rejects before write", async () => {
    const history = await (await invoke("history")).json(); expect(history.orders).toHaveLength(4);
    expect((await (await invoke("history", undefined, B)).json()).orders).toHaveLength(0);
    expect((await invoke("recover", { orderId: history.orders[0].orderId }, B)).status).toBe(404);
    const changed = await handleBundleCommerce(request("prepare", { bundleId: "PACK_3", requestId: randomUUID(), consent }, A), "prepare", ticketAuth(B), store, provider, config, { purchasePolicyVersion: MOCK_BUNDLE_POLICY });
    expect(changed.status).toBe(409); expect(await changed.json()).toMatchObject({ code: "ACCOUNT_CHANGED" });
    expect((await invoke("state", undefined, null)).status).toBe(401);
  });
  it("READY recovery remains uncertain, not confirmed failed; unknown callback cannot grant", async () => {
    const prepared = await (await invoke("prepare", { bundleId: "SINGLE_1", requestId: randomUUID(), consent })).json();
    expect((await (await invoke("recover", { orderId: prepared.order.orderId })).json()).order.status).toBe("READY");
    const before = provider.mock.calls.length;
    expect((await invoke("confirm", { orderId: prepared.order.providerOrderId, paymentKey: "wrong-amount", amount: 1 })).status).not.toBe(200);
    expect(provider).toHaveBeenCalledTimes(before);
  });
  it("Origin check, current-consent and shape reject before creating orders", async () => {
    for (const extra of [{ amount: 1 }, { quantity: 100 }, { userId: B }, { returnUrl: "https://evil.test" }]) expect((await invoke("prepare", { bundleId: "PACK_3", requestId: randomUUID(), consent, ...extra })).status).toBe(400);
    expect((await handleBundleCommerce(request("prepare", {}, A, "https://evil.test"), "prepare", ticketAuth(), store, provider, config)).status).toBe(403);
    expect((await handleBundleCommerce(request("state"), "state", ticketAuth(A, false), store, provider, config)).status).toBe(401);
  });
  it("state is verified total only; source lots retained; no payment/campaign/referral/Meta side effects", async () => {
    const state = await (await invoke("state")).json(); expect(state).toEqual({ ok: true, scope: scope(), quantity: 19 });
    await sql.db.exec("reset role");
    for (const table of ["payment_orders", "report_generation_jobs", "coupon_redemptions", "referral_attributions", "campaign_attributions", "meta_purchase_dispatches"]) expect((await sql.db.query(`select * from ${table}`)).rows).toHaveLength(0);
    expect((await sql.db.query("select distinct source_type from report_ticket_grants")).rows).toEqual([{ source_type: "purchase" }]);
    await sql.db.exec("set role service_role");
  });
});
describe("shop browser contracts (not a visual browser test)", () => {
  const values = new Map<string, string>(), storage = { getItem: (k: string) => values.get(k) ?? null, setItem: (k: string, v: string) => { values.set(k, v); } };
  it("only exact tickets login return, no external/PII/callback allowlist", () => {
    expect(safeAccountNext("/account/tickets")).toBe("/account/tickets");
    for (const next of ["//evil.test", "https://evil.test", "/account/tickets?next=https://evil.test", "/account/tickets/checkout/success?paymentKey=secret"]) expect(safeAccountNext(next)).toBe("/account");
  });
  it("Book return is product-only, owner scoped, cannot imply entitlement", () => {
    expect(recordBookReturn(storage, "career_money_study", scope())).toBe(true);
    expect(readBookReturn(storage, scope())).toBe("career_money_study"); expect(readBookReturn(storage, scope(B))).toBeNull();
    expect(recordBookReturn(storage, "https://evil.test?name=홍길동", scope())).toBe(false);
  });
  it("callback captures only same prepared provider order and correct amount", () => {
    const p = { requestId: randomUUID(), scope: scope(), bundleId: "PACK_5" as const, orderId: `bundle_${"a".repeat(32)}`, providerOrderId: `bundle_toss_${"b".repeat(32)}`, launched: true };
    storage.setItem(bundlePendingKey, JSON.stringify(p)); expect(readPendingBundle(storage)).toEqual(p);
    const url = new URL(`${config.successUrl}?orderId=${p.providerOrderId}&amount=6890&paymentKey=mock-only`);
    expect(captureBundleCallback(url, p)?.payment).toEqual({ orderId: p.providerOrderId, amount: 6890, paymentKey: "mock-only" });
    url.searchParams.set("amount", "1"); expect(captureBundleCallback(url, p)).toEqual(p);
    expect(captureBundleCallback(url, null)).toBeNull();
  });
  it("SSR has editorial shell, loading is not zero, no unapproved policy promises", () => {
    const html = renderToStaticMarkup(<TicketShop />);
    expect(html).toContain("MEMBER EDITIONS"); expect(html).toContain("이용권 조회 중");
    expect(html).not.toMatch(/무기한|평생|BEST|paymentKey|보유.*0장/);
  });
  it("SDK adapter passes the prepared member key and request unchanged, never report metadata",async()=>{
    const prepared=await (await invoke("prepare",{bundleId:"PACK_3",requestId:randomUUID(),consent})).json();
    const requestPayment=vi.fn(),payment=vi.fn(()=>({requestPayment}));
    vi.mocked(loadTossPaymentsBrowserSdk).mockResolvedValue({payment});
    await launchBundleCheckout(prepared.tossCheckoutRequest);
    expect(payment).toHaveBeenCalledWith({customerKey:`member_${scope()}`});
    expect(requestPayment).toHaveBeenCalledWith(prepared.tossCheckoutRequest.requestPayment);
    expect(prepared.tossCheckoutRequest.metadata).not.toHaveProperty("reportId");
    expect(requestPayment.mock.calls[0][0].amount.value).toBe(4290);
  });
  it("ledger labels never display raw reasons; refund distinction stays accurate", () => {
    expect(ticketEventLabel("GRANT", "PAID_BUNDLE_PACK_5")).toBe("유료 구매 지급");
    expect(ticketEventLabel("REVERSAL", "INTERNAL_FAILURE")).toBe("발행 실패 · 이용권 복구");
    expect(ticketEventLabel("GRANT", "sensitive-debug")).toBe("이용권 지급");
  });
  it("callback privacy / shop gates / local production guard are explicit", () => {
    const route = readFileSync("src/app/api/ticket-bundles/[action]/route.ts", "utf8");
    expect(route.indexOf("if (!ticketShopEnabled())")).toBeLessThan(route.indexOf('await import('));
    const mock = readFileSync("src/app/dev/account/tickets/api/[action]/route.ts", "utf8");
    expect(mock.indexOf("if (!localAccountAllowed")).toBeLessThan(mock.indexOf('await import('));
    expect(readFileSync("next.config.ts", "utf8")).toContain('value: "no-referrer"');
    expect(readFileSync("src/components/analytics/MetaPixel.tsx", "utf8")).toContain('if (bundleCallback) return;');
    expect(readFileSync("src/components/account/TicketShop.tsx", "utf8")).not.toContain('interaction(');
  });
});
