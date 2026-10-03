import { readFileSync } from "node:fs";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ACCOUNT_POLICY_VERSIONS, accountSession, needsRequiredReconsent, safeAccountNext, safeDisplayName, validConsentSubmission, purchasePolicyLabel, type AccountIdentity, type AccountSnapshot } from "../../../src/lib/account/policy";
import { handleAccount, type AccountPort } from "../../../src/lib/account/handler";
import { createLocalAccountPort } from "../../../src/lib/account/localReview";
import { accountPublicEnabled, localAccountAllowed } from "../../../src/lib/account/gate";
import { GET as publicGet, POST as publicPost } from "../../../src/app/auth/[action]/route";
import { POST as bookApi } from "../../../src/app/dev/book-flow/api/route";
import { BookHomeRoute } from "../../../src/components/book/BookRoutes";
import { bookCheckoutSnapshot } from "../../../src/lib/book/form";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { confirmedAdultDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { RUNTIME_FIXTURES } from "../interpretation-v4/runtimeFixtures";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";

const user: AccountIdentity = { id: "verified-user", provider: "kakao", displayName: "서윤" };
const records = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, required: true, is_agreed: true, recorded_at: "2026-10-03T00:00:00Z" }));
const agreed = { requestId: "7b034e9f-3b49-4fe6-a439-463b7d457897", terms: true, privacy: true, versions: ACCOUNT_POLICY_VERSIONS };
const origin = "https://gyeolreport.com";
const req = (action: string, body?: unknown, cookie = "", query = "") => new NextRequest(`${origin}/auth/${action}${query}`, { method: body === undefined ? "GET" : "POST", headers: { origin, cookie, "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
function port(snapshot: AccountSnapshot | null = { profile: null, consents: [] }): AccountPort {
  return { authorizationOrigin: "https://project.supabase.co", currentUser: vi.fn(async () => user), start: vi.fn(async (_p, callback) => `https://project.supabase.co/auth/v1/authorize?redirect_to=${encodeURIComponent(callback)}`), exchange: vi.fn(async () => true), logout: vi.fn(async () => true), read: vi.fn(async () => snapshot), consent: vi.fn(async () => true), finish: r => r };
}
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });
describe("account consent and authority", () => {
  it("OAuth success alone is not an active account", () => expect(accountSession(user, { profile: null, consents: [] }).status).toBe("needs_consent"));
  it("current versions activate; newest old/withdrawn/missing required remains stale", () => {
    expect(accountSession(user, { profile: user, consents: records }).status).toBe("member");
    expect(needsRequiredReconsent(records)).toBe(false);
    expect(needsRequiredReconsent([{ ...records[0], document_version: "old" }, ...records])).toBe(true);
    expect(needsRequiredReconsent([{ ...records[0], is_agreed: false }, ...records])).toBe(true);
    expect(needsRequiredReconsent(records.slice(1))).toBe(true);
  });
  it("no marketing contract means no optional opt-in invented or required", () => {
    expect(validConsentSubmission(agreed)).toBe(true);
    expect(validConsentSubmission({ ...agreed, marketing: true })).toBe(false);
    expect(needsRequiredReconsent([{ consent_type: "marketing", document_version: "future", is_agreed: false, required: false, recorded_at: "now" }, ...records])).toBe(false);
  });
  it.each(["user_id", "role", "provider", "agreed_at", "isAdmin"])("client %s cannot be submitted as authority", async field => {
    const p = port(); expect((await handleAccount(req("consent", { ...agreed, [field]: "forged" }), "consent", p)).status).toBe(400); expect(p.consent).not.toHaveBeenCalled();
  });
  it.each([{ ...agreed, terms: false }, { ...agreed, privacy: false }, { ...agreed, versions: { ...ACCOUNT_POLICY_VERSIONS, terms: "old" } }, { ...agreed, requestId: "bad" }])("enforces complete required current consent", async body => expect((await handleAccount(req("consent", body), "consent", port())).status).toBe(400));
  it("server verified id and source are used, never provider email", async () => {
    const p = port(); const response = await handleAccount(req("consent", agreed), "consent", p);
    expect(response.status).toBe(200); expect(p.consent).toHaveBeenCalledWith(user, agreed.requestId, "first_login");
    const returning = port({ profile: user, consents: [{ ...records[0], document_version: "old" }] });
    await handleAccount(req("consent", agreed), "consent", returning); expect(returning.consent).toHaveBeenCalledWith(user, agreed.requestId, "reconsent");
  });
  it("expired/forged session cannot write and returns guest", async () => {
    const p = port(); vi.mocked(p.currentUser).mockResolvedValue(null);
    expect((await handleAccount(req("consent", agreed, "role=admin;user_id=other"), "consent", p)).status).toBe(401);
    expect(await (await handleAccount(req("session"), "session", p)).json()).toEqual({ status: "guest" });
  });
  it("missing DB fails closed rather than accepting consent", async () => expect((await handleAccount(req("consent", agreed), "consent", port(null))).status).toBe(503));
  it("member presentation removes repeated general terms, retains refund and every purchase assertion", () => {
    expect(purchasePolicyLabel({ status: "member" })).toBe("환불정책 동의");
    expect(purchasePolicyLabel({ status: "needs_consent" })).toContain("이용약관");
    const code = readFileSync("src/components/book/BookCheckout.tsx", "utf8");
    expect(code).toContain("key={session.status}"); expect(code).toContain("isDevTossCheckoutLegalConfirmationComplete");
  });
});
describe("OAuth redirects, CSRF, session", () => {
  it.each(["kakao", "google"])("%s starts supported OAuth with httpOnly state", async provider => {
    const p = port(); const res = await handleAccount(req("start", { provider }), "start", p);
    expect(res.status).toBe(200); expect(p.start).toHaveBeenCalledWith(provider, expect.stringContaining("/auth/callback?flow="));
    expect(res.cookies.get("gyeol-auth-flow")?.httpOnly).toBe(true); expect(res.cookies.get("gyeol-auth-flow")?.secure).toBe(true);
  });
  it.each(["email", "password", "github", "admin"])("unsupported %s does not initiate", async provider => expect((await handleAccount(req("start", { provider }), "start", port())).status).toBe(400));
  it.each(["//evil.test", "https://evil.test", "/\\evil", "/%2f%2fevil", "/account?next=https://evil.test", "/reports/private"])("redirect %s denied", value => expect(safeAccountNext(value)).toBe("/account"));
  it.each([null, "https://evil.test"])("Origin %s cannot post", async originValue => {
    const r = req("consent", agreed); if (originValue) r.headers.set("origin", originValue); else r.headers.delete("origin");
    expect((await handleAccount(r, "consent", port())).status).toBe(403);
  });
  it("valid callback exchanges code then distinguishes new and returning", async () => {
    for (const current of [false, true]) {
      const p = port(current ? { profile: user, consents: records } : undefined);
      const start = await handleAccount(req("start", { provider: "kakao", next: "/report/new" }), "start", p);
      const c = start.cookies.get("gyeol-auth-flow")!, flow = JSON.parse(c.value);
      const res = await handleAccount(req("callback", undefined, `${c.name}=${encodeURIComponent(c.value)}`, `?flow=${flow.state}&code=valid`), "callback", p);
      expect(p.exchange).toHaveBeenCalledWith("valid");
      expect(res.headers.get("location")).toBe(`${origin}${current ? "/report/new" : "/account"}`);
      expect(res.cookies.get(c.name)?.maxAge).toBe(0);
    }
  });
  it.each(["?code=bad", "?error=access_denied", "?flow=bad&code=bad", "?error_description=secret-provider-error"])("invalid/cancelled callback %s is generic", async query => {
    const p = port(); const r = await handleAccount(req("callback", undefined, "", query), "callback", p);
    expect(r.headers.get("location")).toBe(`${origin}/login?error=login`); expect(p.exchange).not.toHaveBeenCalled();
  });
  it("expired flow denied and external authorization redirect refused", async () => {
    const p = port(); const flow = { state: "a".repeat(64), expires: 1, next: "/" };
    expect((await handleAccount(req("callback", undefined, `gyeol-auth-flow=${encodeURIComponent(JSON.stringify(flow))}`, `?flow=${flow.state}&code=bad`), "callback", p)).headers.get("location")).toContain("error=login");
    vi.mocked(p.start).mockResolvedValue("https://evil.test/auth/v1/authorize");
    expect((await handleAccount(req("start", { provider: "google" }), "start", p)).status).toBe(503);
  });
  it("logout invokes session invalidation; all responses private no-store", async () => {
    const p = port(); const r = await handleAccount(req("logout", {}), "logout", p);
    expect(p.logout).toHaveBeenCalledOnce(); expect(r.headers.get("cache-control")).toContain("no-store");
  });
  it("metadata is a bounded cosmetic fallback, not authority", () => { expect(safeDisplayName(undefined)).toBe("회원"); expect(safeDisplayName("x".repeat(100))).toHaveLength(40); expect(safeDisplayName("<admin>\u0001")).toBe("admin"); });
});
describe("local adapter and OFF gates", () => {
  it("Book header only enables account entry from the server's independent gate", async () => {
    expect((await BookHomeRoute({ internal: false })).props.authEnabled).toBe(false);
    expect((await BookHomeRoute({ internal: true })).props.authEnabled).toBe(true);
  });
  it("auth is independent and cannot be enabled by query/cookie", async () => {
    expect(accountPublicEnabled()).toBe(false);
    expect((await publicGet(req("session", undefined, "auth=true", "?enabled=1"), { params: Promise.resolve({ action: "session" }) })).status).toBe(404);
    expect((await publicPost(req("start", { provider: "kakao" }), { params: Promise.resolve({ action: "start" }) })).status).toBe(404);
    expect(readFileSync("src/lib/book/publicGate.ts", "utf8")).toContain("return false");
  });
  it("local path unavailable in production and on non-loopback hosts", () => {
    vi.stubEnv("NODE_ENV", "production"); expect(createLocalAccountPort(req("session"))).toBeNull(); expect(localAccountAllowed(req("session"))).toBe(false);
    vi.stubEnv("NODE_ENV", "development"); expect(localAccountAllowed(req("session"))).toBe(false);
  });
  it("member claim cannot bypass server consent recheck in local checkout", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const r = new Request("http://127.0.0.1/dev/book-flow/api", { method: "POST", headers: { origin: "http://127.0.0.1" }, body: JSON.stringify({ operation: "prepare", memberGeneralConsent: true, request: {} }) });
    expect((await bookApi(r)).status).toBe(401);
  });
  it("verified current member may prepare the same checkout while every purchase assertion remains required", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const base = "http://127.0.0.1", p = createLocalAccountPort(new NextRequest(`${base}/dev/account`))!;
    const destination = new URL((await p.start("kakao", `${base}/dev/account/api/callback`))!);
    await p.exchange(destination.searchParams.get("code")!); const u = (await p.currentUser())!;
    await p.consent(u, agreed.requestId, "first_login");
    const cookie = p.finish(new NextResponse()).cookies.get("gyeol-local-account")!;
    const payload = RUNTIME_FIXTURES[0].payload as ReportInputPayload;
    const prepare = (digitalReportStart: boolean) => new Request(`${base}/dev/book-flow/api`, { method: "POST", headers: { origin: base, cookie: `${cookie.name}=${cookie.value}` }, body: JSON.stringify({ operation: "prepare", memberGeneralConsent: true, request: { provider: "toss", productType: payload.productKey, inputSnapshot: bookCheckoutSnapshot(payload), consent: createCheckoutConsentAssertion({ ...confirmedAdultDevTossCheckoutLegalConfirmations, digitalReportStart }) } }) });
    expect(await (await bookApi(prepare(true))).json()).toMatchObject({ ok: true });
    expect(await (await bookApi(prepare(false))).json()).toMatchObject({ ok: false });
  });
  it("opaque local sessions, replay, reload, same provider, distinct providers, expiry and logout", async () => {
    const cookieFor = (value: string) => new NextRequest("http://localhost/dev/account", { headers: { cookie: `gyeol-local-account=${value}` } });
    const ids: string[] = [];
    for (const provider of ["kakao", "kakao", "google"] as const) {
      const p = createLocalAccountPort(cookieFor("forged"))!; expect(await p.currentUser()).toBeNull();
      const target = new URL((await p.start(provider, "http://localhost/dev/account/api/callback"))!);
      const code = target.searchParams.get("code")!; expect(await p.exchange(code)).toBe(true); expect(await p.exchange(code)).toBe(false);
      const c = p.finish(new NextResponse()).cookies.get("gyeol-local-account")!.value;
      const reloaded = createLocalAccountPort(cookieFor(c))!, u = (await reloaded.currentUser())!; ids.push(u.id);
      expect(await reloaded.consent(u, agreed.requestId, "first_login")).toBe(true); expect(accountSession(u, (await reloaded.read(u))!).status).toBe("member");
      expect(await reloaded.logout()).toBe(true); expect(await createLocalAccountPort(cookieFor(c))!.currentUser()).toBeNull();
    }
    expect(ids[0]).toBe(ids[1]); expect(ids[2]).not.toBe(ids[0]);
    const p = createLocalAccountPort(cookieFor(""))!, target = new URL((await p.start("google", "http://localhost/callback"))!);
    await p.exchange(target.searchParams.get("code")!); const c = p.finish(new NextResponse()).cookies.get("gyeol-local-account")!.value;
    vi.useFakeTimers(); vi.setSystemTime(Date.now() + 3_600_001); expect(await createLocalAccountPort(cookieFor(c))!.currentUser()).toBeNull();
  });
});
