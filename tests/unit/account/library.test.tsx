import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { bindCheckout, claimCookieName, claimHash, handleLibrary, type LibraryPort } from "../../../src/lib/library/server";
import { createLocalLibraryPort } from "../../../src/lib/library/localReview";
import { libraryItem, type LibraryRow } from "../../../src/lib/library/model";
import { handleAccount, type AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS, safeAccountNext, type AccountIdentity } from "../../../src/lib/account/policy";
import { prepareLocalBook, publishLocalBook, readLocalBook } from "../../../src/lib/book/localReview";
import { bookCheckoutSnapshot } from "../../../src/lib/book/form";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { confirmedAdultDevTossCheckoutLegalConfirmations } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { LibraryShelf } from "../../../src/components/account/Library";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "../interpretation-v4/runtimeFixtures";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { GET } from "../../../src/app/auth/[action]/route";
import { POST as localApi } from "../../../src/app/dev/book-flow/api/route";
const origin = "https://gyeolreport.com", id = "report_12345678901234567890", secret = "a".repeat(64);
const A: AccountIdentity = { id: "user-a", provider: "kakao", displayName: "검수" }, B: AccountIdentity = { id: "user-b", provider: "google", displayName: "검수" };
const records = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, required: true, is_agreed: true, recorded_at: "2026-10-03T00:00:00Z" }));
function auth(user: AccountIdentity | null = A, agreed = true): AccountPort {
  return { currentUser: vi.fn(async () => user), read: vi.fn(async () => ({ profile: agreed ? user : null, consents: agreed ? records : [] })), consent: vi.fn(async () => true), start: vi.fn(async (_p, callback) => `https://example.supabase.co/auth/v1/authorize?redirect_to=${encodeURIComponent(callback)}`), exchange: vi.fn(async () => true), logout: vi.fn(async () => true), finish: r => r, authorizationOrigin: "https://example.supabase.co" };
}
function port(): LibraryPort { return { bind: vi.fn(async () => true), orderForReport: vi.fn(async () => "po-private"), claim: vi.fn(async () => "owned" as const), list: vi.fn(async () => []) }; }
function request(action: string, body?: unknown, cookie = "") { return new NextRequest(`${origin}/auth/library-${action}${body === undefined && action !== "list" ? `?reportId=${id}` : ""}`, { method: body === undefined ? "GET" : "POST", headers: { origin, cookie, "content-type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }); }
afterEach(() => vi.unstubAllEnvs());
describe("server claim boundary", () => {
  it("checkout uses getUser not payload authority; guest capability is 256-bit HttpOnly Secure and never JSON", async () => {
    const p = port();
    const r = await bindCheckout(request("claim", {}), NextResponse.json({ ok: true }), "po-private", { person: { name: "서윤" }, userId: B.id }, auth(null), p);
    const cookie = r!.cookies.get(claimCookieName("po-private", false))!;
    expect(cookie).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 604800 });
    expect(cookie.value).toMatch(/^[a-f0-9]{64}$/); expect(await r!.json()).toEqual({ ok: true });
    expect(p.bind).toHaveBeenCalledWith(expect.objectContaining({ buyerId: null, claimHash: claimHash(cookie.value), displayName: "서윤" }));
    const logged = await bindCheckout(request("claim", {}), NextResponse.json({ ok: true }), "po-buyer", { userId: B.id }, auth(), p);
    expect(logged!.cookies.getAll()).toEqual([]); expect(p.bind).toHaveBeenLastCalledWith(expect.objectContaining({ buyerId: A.id, claimHash: null }));
  });
  it("a binding failure blocks checkout delivery, unavailable auth does not silently downgrade", async () => {
    const p = port(), a = auth(); vi.mocked(p.bind).mockResolvedValue(false);
    expect(await bindCheckout(request("claim", {}), NextResponse.json({}), "po", {}, a, p)).toBeNull();
    vi.mocked(a.read).mockResolvedValue(null); expect(await bindCheckout(request("claim", {}), NextResponse.json({}), "po", {}, a, p)).toBeNull();
  });
  it.each([null, "https://evil.test"])("Origin %s rejected before any write", async value => {
    const p = port(), req = request("claim", { reportId: id }); if (value) req.headers.set("origin", value); else req.headers.delete("origin");
    expect((await handleLibrary(req, "claim", auth(), p)).status).toBe(403); expect(p.claim).not.toHaveBeenCalled();
  });
  it.each(["userId", "ownerId", "proof", "token", "email"])("client %s rejected", async key => {
    const p = port(); expect((await handleLibrary(request("claim", { reportId: id, [key]: "forged" }), "claim", auth(), p)).status).toBe(400); expect(p.claim).not.toHaveBeenCalled();
  });
  it("reportId/share token alone supplies no proof; cookie is hashed server-side; same auth UUID regardless provider", async () => {
    const p = port();
    await handleLibrary(request("claim", { reportId: id }, "shareToken=gr_public;userId=forged"), "claim", auth(), p);
    expect(p.claim).toHaveBeenLastCalledWith(id, A.id, null, true);
    const response = await handleLibrary(request("claim", { reportId: id }, `${claimCookieName("po-private", false)}=${secret}`), "claim", auth({ ...A, provider: "google" }), p);
    expect(p.claim).toHaveBeenLastCalledWith(id, A.id, claimHash(secret), true);
    expect(await response.json()).toEqual({ ok: true }); expect(response.headers.get("cache-control")).toContain("no-store");
  });
  it("guest/stale consent/logged-out sessions cannot list or commit; status has no IDs or capabilities", async () => {
    const p = port(); vi.mocked(p.claim).mockResolvedValue("claimable");
    for (const a of [auth(null), auth(A, false)]) {
      expect((await handleLibrary(request("list"), "list", a, p)).status).toBe(401);
      expect((await handleLibrary(request("claim", { reportId: id }), "claim", a, p)).status).toBe(401);
      expect(await (await handleLibrary(request("status"), "status", a, p)).json()).toEqual({ state: "claimable", needsLogin: true });
    }
  });
  it("list always filters by verified identity, never query param user_id", async () => {
    const p = port(); const req = new NextRequest(`${origin}/auth/library-list?userId=user-b`);
    expect((await handleLibrary(req, "list", auth(), p)).status).toBe(200); expect(p.list).toHaveBeenCalledWith(A.id);
  });
  it("closed public gate prevents all library routes and local APIs in production", async () => {
    for (const action of ["library-list", "library-status", "library-claim"]) expect((await GET(request("list"), { params: Promise.resolve({ action }) })).status).toBe(404);
    vi.stubEnv("NODE_ENV", "production"); expect((await localApi(new Request("http://127.0.0.1/dev/book-flow/api", { method: "POST", body: "{}" }))).status).toBe(404);
    expect(await createLocalLibraryPort().list(A.id)).toBeNull();
  });
});
describe("safe OAuth report return including FIRST consent", () => {
  it.each([`/reports/${id}`, "/dev/book-flow/report/book-local-11111111-1111-4111-8111-111111111111"])("permits exact report path %s", path => expect(safeAccountNext(path, path.startsWith("/dev"))).toBe(path));
  it.each([`/reports/${id}?next=https://evil`, `/reports/${id}/..`, "/r/gr_share", "//evil.test", "https://evil.test", "/reports/%2e%2e", "/reports/report_abc\\evil"])("denies %s", path => expect(safeAccountNext(path)).toBe("/account"));
  it("new member returns to report after required consent without capability in URL", async () => {
    const p = auth(A, false), next = `/reports/${id}`;
    const start = await handleAccount(request("start", { provider: "kakao", next }), "start", p);
    const c = start.cookies.get("gyeol-auth-flow")!, flow = JSON.parse(c.value);
    const callback = new NextRequest(`${origin}/auth/callback?flow=${flow.state}&code=test`, { headers: { cookie: `${c.name}=${encodeURIComponent(c.value)}` } });
    const res = await handleAccount(callback, "callback", p); expect(res.headers.get("location")).toBe(`${origin}/account`);
    const ret = res.cookies.get("gyeol-account-return")!; expect(ret.httpOnly).toBe(true);
    const after = await handleAccount(request("consent", { requestId: randomUUID(), terms: true, privacy: true, versions: ACCOUNT_POLICY_VERSIONS }, `${ret.name}=${encodeURIComponent(ret.value)}`), "consent", p);
    expect(await after.json()).toEqual({ ok: true, next }); expect(after.cookies.get(ret.name)?.maxAge).toBe(0);
  });
});
describe("real six-product local generation + ownership fixtures", () => {
  it("A Full/Love/Annual; B Career; guest Major claims once; shared Compatibility read-only", async () => {
    const p = createLocalLibraryPort(), ids: string[] = [];
    for (const f of RUNTIME_FIXTURES) {
      const payload = f.payload as ReportInputPayload;
      const purchase = { provider: "toss", productType: payload.productKey, inputSnapshot: bookCheckoutSnapshot(payload), consent: createCheckoutConsentAssertion(confirmedAdultDevTossCheckoutLegalConfirmations) };
      if (process.env.LIBRARY_REVIEW_EXPORT) { mkdirSync(process.env.LIBRARY_REVIEW_EXPORT, { recursive: true }); writeFileSync(`${process.env.LIBRARY_REVIEW_EXPORT}/request-${f.id === "comprehensive" ? "full" : f.id}.json`, JSON.stringify(purchase)); }
      const prepared = prepareLocalBook(purchase, new Date(SHADOW_CLOCK.evaluatedAt));
      expect(prepared.ok).toBe(true); if (!prepared.ok) continue;
      const user = ["comprehensive", "love", "annual"].includes(f.id) ? A : f.id === "career" ? B : null;
      const response = await bindCheckout(request("claim", {}), NextResponse.json({}), prepared.orderId, payload, auth(user), p, true);
      const before = (await p.list(A.id))!.length;
      expect(await p.claim(prepared.orderId, A.id, null, true)).toBe("unavailable");
      expect(await publishLocalBook(prepared.orderId)).toMatchObject({ ok: true });
      const stored = await readLocalBook(prepared.orderId); expect(stored).toMatchObject({ productVersion: "v4" });
      if (user?.id === A.id) {
        const owned = (await p.list(A.id))!; expect(owned.length).toBe(before + 1);
        const item = owned.find(r => r.reportId === prepared.orderId)!;
        expect(Date.parse(item.expiresAt) - Date.parse(item.publishedAt)).toBe(90 * 86400000);
      }
      expect(await p.claim(prepared.orderId, "share-reader", claimHash("gr_share"), true)).toBe("unavailable");
      if (f.id === "major") {
        expect(await p.claim(prepared.orderId, null, claimHash(response!.cookies.get(claimCookieName(prepared.orderId, true))!.value), false)).toBe("claimable");
        const proof = claimHash(response!.cookies.get(claimCookieName(prepared.orderId, true))!.value);
        expect(await Promise.all([p.claim(prepared.orderId, A.id, proof, true), p.claim(prepared.orderId, B.id, proof, true), p.claim(prepared.orderId, A.id, proof, true)])).toEqual(["owned", "unavailable", "owned"]);
      }
      expect(await readLocalBook(prepared.orderId)).toEqual(stored); ids.push(prepared.orderId);
    }
    expect(ids).toHaveLength(6); expect(await p.list(A.id)).toHaveLength(4); expect(await p.list(B.id)).toHaveLength(1);
    expect(JSON.stringify(await p.list(A.id))).not.toMatch(/evidencePacket|draft|claimHash|paymentKey/);
  }, 30000);
});
describe("library metadata and book shelf", () => {
  const row: LibraryRow = { reportId: id, productType: "annual_fortune", displayName: "긴 이름도 빠짐없이 보이는 책", selectedYear: "2027", publishedAt: "2026-10-01T00:00:00Z", expiresAt: "2026-12-30T00:00:00Z", reportVersion: "v3", status: "available" };
  it("canonical cover, version preserved, existing report route and expiry (no new 90-day arithmetic)", () => {
    const item = libraryItem(row, false, Date.parse("2026-10-03"))!;
    expect(item).toMatchObject({ title: "나의 2027", reportVersion: "v3", accessURL: `/reports/${id}`, expiresAt: row.expiresAt });
    const html = renderToStaticMarkup(<LibraryShelf items={[item]} />); expect(html).toContain("나의 2027"); expect(html).toContain("발행"); expect(html).toContain("까지 열람 가능"); expect(html).toContain("<a");
    expect(readFileSync("src/lib/library/model.ts", "utf8")).not.toMatch(/90|generate/);
  });
  it("expired item redacts name, cannot be clicked; empty is short and not guest onboarding", () => {
    const item = libraryItem(row, false, Date.parse("2027-01-01"))!;
    expect(item).toMatchObject({ status: "expired", displayName: "", accessURL: null });
    const html = renderToStaticMarkup(<LibraryShelf items={[item]} />); expect(html).toContain("열람기간이 끝난 책"); expect(html).not.toContain("<a");
    const empty = renderToStaticMarkup(<LibraryShelf items={[]} />); expect(empty).toContain("아직 꽂힌 책이 없습니다."); expect(empty).not.toContain("로그인 없이도");
  });
  it("share route and metadata never gain save-to-library props", () => {
    expect(readFileSync("src/app/r/[token]/page.tsx", "utf8")).not.toMatch(/SaveToLibrary|saveToLibrary/);
    expect(readFileSync("src/lib/sharing/reportShareStore.ts", "utf8")).not.toMatch(/claim_report|report_account|library/);
  });
});
