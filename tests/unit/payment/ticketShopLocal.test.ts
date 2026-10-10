import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { createLocalAccountPort } from "../../../src/lib/account/localReview";
import { handleLocalBundle } from "../../../src/lib/tickets/bundleLocalReview";
import { MOCK_BUNDLE_POLICY } from "../../../src/lib/tickets/shopContract";
import { GET } from "../../../src/app/dev/account/tickets/api/[action]/route";
import { randomUUID } from "node:crypto";

beforeEach(() => { vi.stubEnv("NODE_ENV", "development"); });
afterEach(() => { vi.unstubAllEnvs(); });
describe("actual localhost mock checkout (no provider)", () => {
  it("production rejects before initializing local state", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect((await GET(new NextRequest("http://localhost/dev/account/tickets/api/state"), { params: Promise.resolve({ action: "state" }) })).status).toBe(404);
  });
  it("local member → existing SQL bundle → mock approval → grant → existing ticket balance", async () => {
    const first = new NextRequest("http://localhost/dev/account");
    const account = createLocalAccountPort(first)!;
    const login = await account.start("kakao", "http://localhost/dev/account/api/callback");
    expect(await account.exchange(new URL(login!).searchParams.get("code")!)).toBe(true);
    const user = (await account.currentUser())!; expect(await account.consent(user, randomUUID(), "first_login")).toBe(true);
    const cookie = account.finish(new NextResponse()).cookies.get("gyeol-local-account")!;
    const req = (action: string, body?: object, scope?: string) => new NextRequest(`http://localhost/dev/account/tickets/api/${action}`, { method: body ? "POST" : "GET", headers: { origin: "http://localhost", cookie: `${cookie.name}=${cookie.value}`, "content-type": "application/json", ...(scope ? { "x-ticket-account": scope } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
    const state = await handleLocalBundle(req("state"), "state"); expect(state.status, await state.clone().text()).toBe(200);
    const { scope, quantity } = await state.json(); expect(quantity).toBe(0);
    const prepare = await handleLocalBundle(req("prepare", { bundleId: "PACK_3", requestId: randomUUID(), consent: { version: MOCK_BUNDLE_POLICY, product: true, digitalDelivery: true, purchasePolicy: true } }, scope), "prepare");
    expect(prepare.status, await prepare.clone().text()).toBe(200); const { order } = await prepare.json();
    const mock = await handleLocalBundle(req("mock", { orderId: order.orderId, outcome: "GRANT_PENDING" }), "mock");
    const payment = await mock.json();
    const confirmation = await handleLocalBundle(req("confirm", payment, scope), "confirm");
    expect(confirmation.status).toBe(202); expect(await confirmation.json()).toMatchObject({ order: { status: "PAID_PENDING_GRANT" } });
    expect((await (await handleLocalBundle(req("state"), "state")).json()).quantity).toBe(0);
    const recover = await handleLocalBundle(req("recover", { orderId: order.orderId }, scope), "recover");
    expect(recover.status).toBe(200);
    expect((await (await handleLocalBundle(req("state"), "state")).json()).quantity).toBe(3);
    expect((await (await handleLocalBundle(req("history"), "history")).json()).orders).toHaveLength(1);
  });
});
