import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ book: false, account: false, auth: null as unknown, library: null as unknown, orders: [] as Array<Record<string, unknown>>, cookie: "", owned: false }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => state.book }));
vi.mock("../../../src/lib/account/gate", () => ({ accountPublicEnabled: () => state.account }));
vi.mock("../../../src/lib/account/supabase", () => ({ createAccountPort: () => state.auth }));
vi.mock("../../../src/lib/library/supabase", () => ({ createLibraryPort: () => state.library }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => ({ create: async (order: Record<string, unknown>) => { state.orders.push(order); return { ok: true, value: order }; } }) }));
vi.mock("../../../src/lib/sharing/reportShareStore", async original => ({ ...await original<object>(), sharePort: () => ({ owned: async () => state.owned }) }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ cookie: state.cookie }) }));
import { POST } from "../../../src/app/api/payment-checkout/prepare/route";
import { handleAccount, type AccountPort } from "../../../src/lib/account/handler";
import { ACCOUNT_POLICY_VERSIONS, safeAccountNext } from "../../../src/lib/account/policy";
import { bindCheckout, claimCookieName, claimHash, handleLibrary, type LibraryPort } from "../../../src/lib/library/server";
import { prepareBookShare } from "../../../src/lib/book/shareServer";
import { canReadPurchasedBook } from "../../../src/lib/book/ownerAccess";
import { runPublicPaidReportJob } from "../../../src/lib/book/paidRuntime";
import { readPublishedReport } from "../../../src/lib/payment/paidReportReliability";
import type { ReliabilityStore } from "../../../src/lib/payment/paidReportReliabilityStore";
import { storedBook, validateBookPublication } from "../../../src/lib/book/storedReport";
import { bookCheckoutSnapshot } from "../../../src/lib/book/form";
import { BookCheckout } from "../../../src/components/book/BookCheckout";
import { getReportProduct } from "../../../src/lib/payment/reportProductCatalog";
import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import type { ReportInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "../interpretation-v4/runtimeFixtures";
const origin = "https://www.gyeolreport.com", reportId = "report_release_12345678901234567890";
const consents = Object.entries(ACCOUNT_POLICY_VERSIONS).map(([consent_type, document_version]) => ({ consent_type: consent_type as "terms" | "privacy", document_version, required: true, is_agreed: true, recorded_at: SHADOW_CLOCK.evaluatedAt }));
function auth(member = true): AccountPort {
  const user = member ? { id: "verified-buyer", provider: "google" as const, displayName: "회원" } : null;
  return { currentUser: vi.fn(async () => user), read: vi.fn(async () => ({ profile: user, consents })), consent: vi.fn(async () => true), exchange: vi.fn(async () => true), logout: vi.fn(async () => true), start: vi.fn(async (_p, callback) => `https://test.supabase.co/auth/v1/authorize?redirect_to=${encodeURIComponent(callback)}`), authorizationOrigin: "https://test.supabase.co", finish: response => response };
}
function library(): LibraryPort { return { bind: vi.fn(async () => true), claim: vi.fn(async () => "unavailable" as const), orderForReport: vi.fn(async () => "order-release"), list: vi.fn(async () => []) }; }
function request(payload: unknown = RUNTIME_FIXTURES[0].payload, requestOrigin: string | null = origin, host = origin) {
  const p = payload as ReportInputPayload;
  return new NextRequest(`${host}/api/payment-checkout/prepare`, { method: "POST", headers: { "content-type": "application/json", ...(requestOrigin === null ? {} : { origin: requestOrigin }), cookie: "test-session=forwarded" }, body: JSON.stringify({ provider: "toss", productType: p.productKey, inputSnapshot: { ...bookCheckoutSnapshot(p), bookGeneration: { version: "v4", evaluatedAt: "forged" } }, consent: adultCheckoutConsent() }) });
}
beforeEach(() => {
  state.book = state.account = false; state.orders = []; state.auth = auth(); state.library = library(); state.cookie = ""; state.owned = false;
  vi.useFakeTimers(); vi.setSystemTime(new Date(SHADOW_CLOCK.evaluatedAt));
  vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_client_not_real"); vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_secret_not_real");
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllEnvs(); });

describe("release gate combinations and real checkout route", () => {
  it.each([[false,false],[true,false],[false,true],[true,true]])("Book %s / Account %s", async (book, account) => {
    state.book = book; state.account = account;
    const response = await POST(request()); expect(response.status).toBe(200);
    const saved = state.orders[0].inputSnapshot as Record<string, unknown>;
    expect(saved.bookGeneration).toEqual(book ? { version: "v4", evaluatedAt: new Date(SHADOW_CLOCK.evaluatedAt).toISOString() } : undefined);
    expect(vi.mocked((state.library as LibraryPort).bind)).toHaveBeenCalledTimes(account ? 1 : 0);
    if (account) expect((state.library as LibraryPort).bind).toHaveBeenCalledWith(expect.objectContaining({ buyerId: "verified-buyer", claimHash: null }));
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(["https://gyeolreport.com", origin])("trusted %s survives checkout/auth/library/share origin checks", async host => {
    state.account = true;
    expect((await POST(request(undefined, host, host))).status).toBe(200);
    const a = state.auth as AccountPort, p = state.library as LibraryPort;
    const req = (path: string, body: object) => new NextRequest(`${host}${path}`, { method: "POST", headers: { origin: host }, body: JSON.stringify(body) });
    const started = await handleAccount(req("/auth/start", { provider: "google", next: "/report/new?product=career-money-study" }), "start", a);
    expect(started.status).toBe(200); expect(a.start).toHaveBeenCalledWith("google", expect.stringContaining(`${host}/auth/callback?flow=`));
    const authorization = await started.json(), callback = new URL(new URL(authorization.url).searchParams.get("redirect_to")!);
    callback.searchParams.set("code", "local-test-code");
    const returned = await handleAccount(new NextRequest(callback, { headers: { cookie: started.cookies.getAll().map(c => `${c.name}=${c.value}`).join("; ") } }), "callback", a);
    expect(returned.status).toBe(303); expect(returned.headers.get("location")).toBe(`${host}/report/new?product=career-money-study`);
    expect(returned.headers.get("cache-control")).toContain("no-store");
    expect((await handleLibrary(req("/auth/library-claim", { reportId }), "claim", a, p)).status).toBe(403); // ownership, not origin
    expect(p.claim).toHaveBeenCalled();
    const shared = await prepareBookShare(req("/api/book-share", { reportId }), a, p, { read: vi.fn(), find: vi.fn(), insert: vi.fn() });
    expect(shared.status).toBe(403); expect(p.orderForReport).toHaveBeenCalled();
  });
  it.each([null,"https://evil.test","https://gyeolreport.com.evil.test","http://www.gyeolreport.com","https://www.gyeolreport.com/","https://www.gyeolreport.com:444","null","https://gyeolreport.com"])("rejects missing/malformed/cross-host origin %s before order", async value => {
    state.account = true; expect((await POST(request(undefined, value))).status).toBe(403); expect(state.orders).toHaveLength(0);
  });
  it("guest checkout binds an HttpOnly purchase capability, never an invented account", async () => {
    state.account = true; state.auth = auth(false);
    const response = await POST(request()); expect(response.status).toBe(200);
    const binding = vi.mocked((state.library as LibraryPort).bind).mock.calls[0][0];
    expect(binding.buyerId).toBeNull(); expect(binding.claimHash).toMatch(/^[a-f0-9]{64}$/);
    expect(response.cookies.getAll()[0]).toMatchObject({ httpOnly: true, secure: true, sameSite: "lax" });
    expect(JSON.stringify(await response.json())).not.toContain(binding.claimHash);
  });
  it.each(["auth", "database"])("%s unavailable fails closed, no provider checkout", async failure => {
    state.account = true;
    if (failure === "auth") state.auth = null; else vi.mocked((state.library as LibraryPort).bind).mockResolvedValue(false);
    const response = await POST(request()); expect(response.status).toBe(503); expect(await response.text()).not.toContain("tossCheckoutRequest");
  });
  it("production checkout presentation uses public session and the existing launcher, not dev mocks", () => {
    const source = readFileSync("src/components/book/BookCheckout.tsx", "utf8");
    expect(source).toContain("useAccountSession(props.internal)"); expect(source).toContain("runDevTossCheckout(snapshot, consents, undefined");
    const html = renderToStaticMarkup(<BookCheckout payload={RUNTIME_FIXTURES[0].payload as ReportInputPayload} now={SHADOW_CLOCK.evaluatedAt} internal={false} onPublishing={() => {}} onError={() => {}} />);
    expect(html).toContain("결제하기"); expect(html).not.toContain("결제 연결 준비 중"); expect(html).toContain("로그인하고 이어서 구매하기");
  });
  it("login return allows only canonical product routes, not open redirects", () => {
    for (const f of RUNTIME_FIXTURES) expect(safeAccountNext(`/report/new?product=${f.payload.productKey}`)).toBe(`/report/new?product=${f.payload.productKey}`);
    for (const path of ["//evil.test", "/report/new?product=career-money-study&next=https://evil.test", "/report/new?product=unknown"]) expect(safeAccountNext(path)).toBe("/account");
  });
});

describe("public paid worker → existing V4 engine → frozen snapshot → Book", () => {
  it("browser annual input reaches the current publication boundary", async () => {
    const { generateV4ShadowReport } = await import("../../../src/lib/interpretation-v4/runtimeShadow");
    const input = { ...RUNTIME_FIXTURES[5].payload,
      person: { name: "출시검수", birthDate: "1994-04-12", birthTime: "12:30", birthTimePrecision: "exact", birthTimeUnknown: false, approximateBirthTimeSlot: "", mbtiType: "INTJ", gender: "FEMALE" },
      userContext: { jobStatus: "employee", detailJob: "교육 운영 담당", relationshipStatus: "dating", focusAreas: [] },
      productOptions: { contentVersion: "v3", selectedYear: "2026" },
    };
    const result = await generateV4ShadowReport(input, { evaluatedAt: "2026-10-08T06:50:00.000Z", policyDate: "2026-10-08T06:50:00.000Z" });
    const built = await (await import("../../../src/lib/interpretation-v4/annualProductAdapter")).buildV4AnnualProduct(input, { currentDate: "2026-10-08T06:50:00.000Z", policyDate: "2026-10-08T06:50:00.000Z" });
    expect(result, result.ok ? "" : JSON.stringify({ result, editorial: built.ok ? built.editorial : built })).toMatchObject({ ok: true });
    if (!result.ok || !built.ok) return;
    const { validateV4Publication, v4Digest, projectV4Composition } = await import("../../../src/lib/interpretation-v4/runtimeProjection");
    expect(result.draft).toEqual(projectV4Composition({ product: "annual_fortune", result: built }));
    expect(built.editorial).toEqual(expect.arrayContaining([expect.objectContaining({ code: "DUPLICATE_SENTENCE" }), expect.objectContaining({ code: "REPEATED_LONG_PHRASE" })]));
    for (const issue of [{ severity: "Blocker", code: "DUPLICATE_SENTENCE" }, { severity: "Major", code: "UNKNOWN_ISSUE" }, { severity: "Blocker", code: "UNSUPPORTED_GUARANTEE" }]) {
      const evidence = JSON.parse(JSON.stringify(result.evidencePacket));
      evidence.composition.result.editorial.push({ ...issue, location: "text" });
      delete evidence.contentDigest; evidence.contentDigest = v4Digest(evidence);
      expect(validateV4Publication("annual_fortune", result.draft, evidence).errors).toContain("V4_EDITORIAL_BLOCKED");
    }
  }, 30000);
  it.each([false, true])("legacy purchase remains V3 with Book gate %s", async book => {
    state.book = book;
    const payload = RUNTIME_FIXTURES[0].payload;
    let snapshot: unknown;
    const store: ReliabilityStore = { call: vi.fn(async (action, data) => {
      if (action === "claim_job") return { ok: true, job: { job_id: "legacy-job", lease_token: "lease", order_id: "legacy-order", product_type: payload.productKey, report_id: reportId, created_at: SHADOW_CLOCK.evaluatedAt, attempt_count: 1, payload } };
      if (action === "find_order") return { ok: true, order: { payment_order_id: "legacy-order", product_type: payload.productKey, report_id: reportId, status: "paid", input_snapshot: { reportInputPayload: payload } } };
      if (action === "finish_job") { expect(data?.success).toBe(true); snapshot = data?.snapshot; return { ok: true, status: "COMPLETED" }; }
      return { ok: false };
    }) };
    expect(await runPublicPaidReportJob(store, { enabled: false, reason: "flag_disabled" })).toMatchObject({ ok: true, status: "COMPLETED" });
    expect(snapshot).toMatchObject({ productVersion: "v3", productType: payload.productKey });
    expect(fetch).not.toHaveBeenCalled();
  });
  it.each(RUNTIME_FIXTURES)("$id real checkout amount, server version, generation and reopen", async f => {
    state.book = state.account = true;
    const response = await POST(request(f.payload)); expect(response.status).toBe(200);
    const body = await response.json(), order = state.orders[0], input = order.inputSnapshot as Record<string, unknown>;
    const amount = getReportProduct(f.payload.productKey)!.amount;
    expect(body.paymentOrder.amount).toBe(amount); expect(body.checkoutSession.amount).toBe(amount); expect(body.tossCheckoutRequest.requestPayment.amount.value).toBe(amount); expect(order.amount).toBe(amount);
    let snapshot: unknown;
    const store: ReliabilityStore = { call: vi.fn(async (action, data) => {
      if (action === "claim_job") return { ok: true, job: { job_id: "job", lease_token: "lease", order_id: order.paymentOrderId, product_type: f.payload.productKey, report_id: reportId, created_at: SHADOW_CLOCK.evaluatedAt, attempt_count: 1, payload: f.payload } };
      if (action === "find_order") return { ok: true, order: { payment_order_id: order.paymentOrderId, product_type: f.payload.productKey, report_id: reportId, status: "paid", input_snapshot: input } };
      if (action === "finish_job") { expect(data?.success).toBe(true); expect(data?.externalCalls).toEqual([]); snapshot = JSON.parse(JSON.stringify(data?.snapshot)); return { ok: true, status: "COMPLETED" }; }
      if (action === "read_report") return { ok: true, status: "COMPLETED", snapshot };
      return { ok: false };
    }) };
    expect(await runPublicPaidReportJob(store, { enabled: false, reason: "flag_disabled" })).toMatchObject({ ok: true, status: "COMPLETED" });
    expect(snapshot).toMatchObject({ productVersion: "v4", productType: f.payload.productKey });
    const read = await readPublishedReport(store, reportId, validateBookPublication), book = storedBook(read.snapshot)!;
    expect(book).not.toBeNull(); expect(book.data.pages.at(-1)?.kind).toBe("back");
    if (f.id === "major") expect(book.data.pages.find(p => p.kind === "timeline")?.years).toHaveLength(14);
    if (f.id === "annual") expect(book.data.pages.find(p => p.kind === "months")?.months).toHaveLength(12);
    expect((await readPublishedReport(store, reportId, validateBookPublication)).snapshot).toEqual(snapshot);
    expect(fetch).not.toHaveBeenCalled();
  }, 30000);
  it("purchase identity mismatch fails closed before generation", async () => {
    state.book = true;
    const store: ReliabilityStore = { call: vi.fn(async action => action === "claim_job" ? { ok: true, job: { order_id: "one", report_id: reportId, product_type: "saju_mbti_full" } } : { ok: true, order: { payment_order_id: "different", status: "paid" } }) };
    expect(await runPublicPaidReportJob(store, { enabled: false, reason: "flag_disabled" })).toMatchObject({ ok: false, code: "PURCHASE_CONTEXT_UNAVAILABLE" });
  });
});

describe("original V4 book authority", () => {
  it("report ID/share token/another account cannot read; only owner or purchase capability", async () => {
    const p = state.library as LibraryPort;
    expect(await canReadPurchasedBook(reportId)).toBe(false);
    state.cookie = "shareToken=public;userId=forged"; expect(await canReadPurchasedBook(reportId)).toBe(false);
    vi.mocked(p.claim).mockResolvedValue("owned"); expect(await canReadPurchasedBook(reportId)).toBe(true);
    state.auth = auth(false); vi.mocked(p.claim).mockResolvedValue("claimable");
    state.cookie = `${claimCookieName("order-release", false)}=${"a".repeat(64)}`;
    expect(await canReadPurchasedBook(reportId)).toBe(true); expect(p.claim).toHaveBeenLastCalledWith(reportId, null, claimHash("a".repeat(64)), false);
    vi.mocked(p.claim).mockResolvedValue("unavailable"); expect(await canReadPurchasedBook(reportId)).toBe(false);
    state.auth = auth(); state.owned = true; expect(await canReadPurchasedBook(reportId)).toBe(true);
  });
  it("failed account DB reads do not become a member or claim grant", async () => {
    const a = state.auth as AccountPort; vi.mocked(a.read).mockResolvedValue(null);
    expect(await bindCheckout(request(), NextResponse.json({}), "order", {}, a, state.library as LibraryPort)).toBeNull();
    expect(await canReadPurchasedBook(reportId)).toBe(false);
  });
  it("public gates remain server constants OFF", () => {
    for (const path of ["src/lib/book/publicGate.ts", "src/lib/account/gate.ts"]) expect(readFileSync(path, "utf8")).toMatch(/PublicEnabled\(\): boolean \{ return false; \}/);
  });
});
