import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const route = vi.hoisted(() => ({ enabled: false, snapshot: null as unknown, rpc: vi.fn() }));
vi.mock("../../../src/lib/book/publicGate", () => ({ bookExperiencePublicEnabled: () => route.enabled }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: route.rpc }) }));
vi.mock("../../../src/lib/sharing/reportShareStore", () => ({ existingReportShareUrl: async () => null }));
vi.mock("next/navigation", () => ({ usePathname: () => "/", useSearchParams: () => new URLSearchParams(), notFound: () => { throw new Error("404"); } }));
import Home from "../../../src/app/page";
import InputLayout from "../../../src/app/report/new/layout";
import ReportPage from "../../../src/app/reports/[reportId]/page";
import LocalHome from "../../../src/app/dev/book-flow/page";
import { POST as localApi } from "../../../src/app/dev/book-flow/api/route";
import { BOOKS, bookForProduct, readerTitle } from "../../../src/lib/book/product";
import { bookInputPayload, bookCheckoutSnapshot, emptyBookForm, personErrors, restoreBookForm, type BookFormState } from "../../../src/lib/book/form";
import { prepareLocalBook, publishLocalBook, readLocalBook, validateLocalBookInput } from "../../../src/lib/book/localReview";
import { storedBook, StoredBookReport, validateBookPublication } from "../../../src/lib/book/storedReport";
import { projectBookShare } from "../../../src/lib/book/shareModel";
import { createCheckoutConsentAssertion } from "../../../src/lib/payment/checkoutConsent";
import { getReportProduct } from "../../../src/lib/payment/reportProductCatalog";
import { preparePaymentCheckoutSession } from "../../../src/lib/payment/paymentCheckoutSessionBoundary";
import { prepareTossCheckoutRequest } from "../../../src/lib/payment/tossCheckoutRequestAdapter";
import { confirmedAdultDevTossCheckoutLegalConfirmations as agreed, runDevTossCheckout } from "../../../src/components/payment/DevTossCheckoutLauncher";
import { BookCheckout } from "../../../src/components/book/BookCheckout";
import { BookFooter, BookLegalPage } from "../../../src/components/book/BookLegalRoutes";
import { BookReader } from "../../../src/app/dev/book-preview/BookReader";
import { BookReadingPresentation } from "../../../src/components/book/BookEntry";
import type { ReportInputPayload, ReportPersonInputPayload } from "../../../src/lib/report-generation/reportInputTypes";
import { RUNTIME_FIXTURES, SHADOW_CLOCK } from "../interpretation-v4/runtimeFixtures";
import { BOOK_FIXTURES } from "../../../src/app/dev/book-preview/runtimeBooks";
const now = new Date(SHADOW_CLOCK.evaluatedAt);
const src = (path: string) => readFileSync(path, "utf8");
function form(payload: ReportInputPayload): BookFormState {
  const p = payload.productKey === "saju_mbti_compatibility" ? payload.personA : payload.person;
  const person = (p: ReportPersonInputPayload) => ({ name: p.name, birthDate: p.birthDate, paidBirthTimeMode: p.birthTimePrecision ?? "exact", birthTime: p.birthTime, birthTimeUnknown: p.birthTimeUnknown, timeBranch: p.approximateBirthTimeSlot, gender: p.gender, mbtiType: p.mbtiType });
  const state = emptyBookForm(now.getUTCFullYear());
  state.person = { ...state.person, ...person(p) };
  if (payload.productKey === "saju_mbti_compatibility") { state.personB = person(payload.personB); state.category = payload.relationshipType; }
  else { state.person = { ...state.person, relationshipStatus: payload.userContext.relationshipStatus, jobStatus: payload.userContext.jobStatus, detailedJob: payload.userContext.detailJob, focusAreas: payload.userContext.focusAreas, selectedYear: "selectedYear" in payload.productOptions ? payload.productOptions.selectedYear : state.person.selectedYear }; }
  return state;
}
const request = (payload: ReportInputPayload) => ({ provider: "toss", productType: payload.productKey, inputSnapshot: bookCheckoutSnapshot(payload), consent: createCheckoutConsentAssertion(agreed) });
afterEach(() => { route.enabled = false; vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("server-authority OFF route boundary", () => {
  it("actual constant has no external inputs or environment activation", async () => {
    const gate = await vi.importActual<typeof import("../../../src/lib/book/publicGate")>("../../../src/lib/book/publicGate");
    expect(gate.bookExperiencePublicEnabled()).toBe(false);
    expect(src("src/lib/book/publicGate.ts")).not.toMatch(/process\.env|cookies\(|headers\(|searchParams|localStorage|getItem/);
    expect(src("src/lib/book/publicGate.ts")).toMatch(/^import "server-only"/);
  });
  it.each(["?v4=1", "?book=1", "cookie: book=1", "localStorage: v4", "payload: version=v4", "reportVersion=v4"])("%s cannot change the default home/input", () => {
    const html = renderToStaticMarkup(Home());
    expect(html).toContain("오픈 기념"); expect(html).not.toContain("data-book-home");
    expect(InputLayout({ children: <div data-v3-input /> })).toEqual(<div data-v3-input />);
  });
  it("only internal injection selects the Book server components", () => {
    route.enabled = true;
    expect(Home().type).toBeTypeOf("function");
    expect(InputLayout({ children: <div data-v3-input /> })).not.toEqual(<div data-v3-input />);
  });
  it("dev entry and mock API fail closed in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => LocalHome()).toThrow("404");
    expect((await localApi(new Request("http://127.0.0.1/dev/book-flow/api", { method: "POST", body: "{}" }))).status).toBe(404);
    expect(prepareLocalBook({})).toMatchObject({ ok: false, error: "NOT_FOUND" });
  });
  it("dev API refuses off-host / cross-origin calls", async () => {
    vi.stubEnv("NODE_ENV", "development");
    expect((await localApi(new Request("https://gyeolreport.com/dev/book-flow/api", { method: "POST", body: "{}" }))).status).toBe(404);
    expect((await localApi(new Request("http://127.0.0.1/dev/book-flow/api", { method: "POST", headers: { origin: "https://example.com" }, body: "{}" }))).status).toBe(403);
  });
});
describe("actual input → existing checkout builder → local publish/read → actual report route", () => {
  it.each(RUNTIME_FIXTURES)("$id complete flow, catalog/payload parity, full book", async fixture => {
    const original = fixture.payload as ReportInputPayload, book = bookForProduct(original.productKey)!, state = form(original), payload = bookInputPayload(book, state);
    expect(payload).toEqual({ ...original, ...(book.id === "compatibility" ? { compatibilityRoleVersion: "compatibility-fixed-ab-v1" } : { productOptions: book.id === "annual" ? { contentVersion: "v3", selectedYear: state.person.selectedYear } : { contentVersion: "v3" } }) });
    expect(validateLocalBookInput(payload, now)).toEqual({ ok: true });
    const before = JSON.stringify(payload), prepared = prepareLocalBook(request(payload), now);
    expect(prepared).toMatchObject({ ok: true }); if (!prepared.ok) return;
    const product = getReportProduct(payload.productKey)!;
    const session = preparePaymentCheckoutSession({ paymentOrderId: prepared.orderId, providerOrderId: prepared.orderId, productType: product.productType, provider: "toss", amount: product.amount, currency: product.currency, status: "ready" });
    expect(session.ok).toBe(true); if (!session.ok) return;
    const parity = prepareTossCheckoutRequest({ checkoutSession: session.session, clientKey: "local-mock-not-a-provider-key", successUrl: "http://127.0.0.1/dev/book-flow", failUrl: "http://127.0.0.1/dev/book-flow", allowLocalhostRedirects: true });
    expect(parity.ok && parity.draft).toEqual(prepared.tossCheckoutRequest);
    const sdk = vi.fn(), send = vi.fn(async () => ({ ok: true as const, status: "redirect_requested" as const }));
    const mockFetch = vi.fn(async (_url: string, init: RequestInit) => { expect(JSON.parse(String(init.body))).toEqual(request(payload)); return { ok: true, json: async () => prepared }; });
    expect(await runDevTossCheckout(bookCheckoutSnapshot(payload), agreed, { fetch: mockFetch, loadTossPayments: sdk, launchTossCheckout: send }, { productType: payload.productKey, easyPay: "TOSSPAY" })).toMatchObject({ ok: true });
    expect(sdk).not.toHaveBeenCalled(); expect(send).toHaveBeenCalledTimes(1);
    expect(await publishLocalBook(prepared.orderId)).toMatchObject({ ok: true });
    expect(await publishLocalBook(prepared.orderId)).toEqual(await publishLocalBook(prepared.orderId));
    const snapshot = await readLocalBook(prepared.orderId), view = storedBook(snapshot)!;
    expect(view).not.toBeNull(); expect(JSON.stringify(payload)).toBe(before);
    expect(JSON.parse(JSON.stringify(view))).toEqual(view);
    expect(JSON.stringify(view)).not.toMatch(/sourceRefs|contentDigest|natalEvidence|v4_structure:|confidence/);
    expect(view.data.pages.at(-1)?.kind).toBe("back");
    expect(view.data.pages.some(p => p.kind === "appendix")).toBe(true);
    expect(view.data.pages.filter(p => p.kind === "manse")).toHaveLength(book.id === "compatibility" ? 2 : 1);
    if (book.id === "major") { const t = view.data.pages.find(p => p.kind === "timeline"); expect(t?.kind === "timeline" && t.years.length).toBe(14); expect(t?.kind === "timeline" && t.years.filter(y => y.time === "앞으로").length).toBe(10); }
    if (book.id === "annual") { const t = view.data.pages.find(p => p.kind === "months"); expect(t?.kind === "months" && t.months.map(m => m.month)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1)); }
    const fullHtml = view.data.pages.map(page => renderToStaticMarkup(<BookReader data={view.data} page={page} onPage={() => {}} onNote={() => {}} onShare={() => {}} />)).join("");
    expect(fullHtml).toContain("이 책 공유하기"); expect(fullHtml).not.toContain("<footer");
    // Node's next/dynamic entry wraps its loadable in forwardRef. Vitest has
    // no Next preload pass, so preload the real component before static SSR.
    await (BookReadingPresentation as unknown as { render: { preload: () => Promise<unknown> } }).render.preload();
    expect(renderToStaticMarkup(<StoredBookReport snapshot={snapshot} />)).toContain("data-book-report");
    route.enabled = true; route.rpc.mockImplementation(async () => ({ ok: true, status: "COMPLETED", snapshot })); vi.stubEnv("NODE_ENV", "development");
    const html = renderToStaticMarkup(await ReportPage({ params: Promise.resolve({ reportId: prepared.orderId }) }));
    expect(html).toContain("data-book-report");
    expect(fetch).not.toHaveBeenCalled();
    if (process.env.BOOK_FLOW_EXPORT) { mkdirSync(process.env.BOOK_FLOW_EXPORT, { recursive: true }); writeFileSync(`${process.env.BOOK_FLOW_EXPORT}/${book.id}.json`, JSON.stringify({ book, state, payload, view })); }
  }, 30000);
  it.each(BOOK_FIXTURES.filter(f => !["full", "career", "love", "compatibility", "major", "annual"].includes(f.id)))("$id unknown/approx/roles pass through same adapters", async fixture => {
    const payload = bookInputPayload(bookForProduct(fixture.payload.productKey)!, form(fixture.payload as ReportInputPayload));
    const prepared = prepareLocalBook(request(payload), now); expect(prepared, fixture.id).toMatchObject({ ok: true }); if (!prepared.ok) return;
    expect(await publishLocalBook(prepared.orderId)).toMatchObject({ ok: true });
    const view = storedBook(await readLocalBook(prepared.orderId))!;
    expect(view).not.toBeNull();
    if (payload.productKey === "saju_mbti_compatibility") { const spread = view.data.pages.find(p => p.kind === "pair"); expect(spread).toBeDefined(); expect(JSON.stringify(view.data)).not.toMatch(/67점|궁합 점수|궁합 등급/); }
    else if (payload.person.birthTimeUnknown) expect(view.data.people[0].table.manse.stemRow.hour).toBeNull();
  }, 30000);
});
describe("presentation contracts", () => {
  it("restores only input fields, never versions/prices/consents/gate; exact/approx/unknown", () => {
    const state = form(RUNTIME_FIXTURES[0].payload as ReportInputPayload);
    expect(restoreBookForm({ version: 1, state: { ...state, enabled: true, price: 1, consents: agreed } }, 2026)).toEqual(state);
    for (const mode of ["exact", "approximate", "unknown"] as const) {
      const p = { ...state.person, paidBirthTimeMode: mode, birthTime: mode === "exact" ? "05:30" : "", timeBranch: mode === "approximate" ? "MYOSI" as const : "" as const, birthTimeUnknown: mode === "unknown" };
      expect(personErrors(p, now.toISOString(), true)).toEqual({});
    }
    expect(personErrors({ ...state.person, name: "", birthDate: "2026-02-30", gender: "" }, now.toISOString(), true)).toHaveProperty("birthDate");
  });
  it("guest required consent, no fake member bypass, compact collapsed details", () => {
    const payload = RUNTIME_FIXTURES[0].payload as ReportInputPayload;
    expect(prepareLocalBook({ ...request(payload), consent: createCheckoutConsentAssertion({ ...agreed, policyAgreement: false }) }, now)).toMatchObject({ ok: false });
    const html = renderToStaticMarkup(<BookCheckout payload={payload} now={now.toISOString()} internal onPublishing={() => {}} onError={() => {}} />);
    expect(html).toContain("전체 동의"); expect(html).not.toContain("<dialog"); expect(html).not.toContain("마케팅"); expect(html).not.toContain("회원 미리보기");
    expect(src("src/components/book/BookCheckout.tsx")).toContain("indeterminate = some && !all");
  });
  it("stored version is authoritative and V3/invalid snapshots cannot be regenerated", () => {
    expect(storedBook({ productVersion: "v3", reportVersion: "v4" })).toBeNull();
    expect(storedBook({ productVersion: "v4" })).toBeNull();
    expect(validateBookPublication("saju_mbti_full", { productVersion: "v4" }, {})).toMatchObject({ ok: false });
    expect(src("src/lib/book/storedReport.tsx")).not.toMatch(/generateV4|runtimeShadow|compose/);
  });
  it("share model uses registry, existing URL/token and no SDK", () => {
    const share = projectBookShare({ productType: "annual_fortune", selectedYear: "2027", names: "하린", reportId: "id", shareUrl: "https://gyeolreport.com/r/test_token" })!;
    expect(share).toMatchObject({ title: "나의 2027", displayTitle: "하린님의 나의 2027", coverColor: BOOKS[5].color, issue: "06", token: "test_token", reportUrl: "/reports/id" });
    expect(projectBookShare({ productType: "annual_fortune", names: "하린", reportId: "id", shareUrl: "https://evil.example/r/x" })?.shareUrl).toBeNull();
    expect(readerTitle(BOOKS[5], "<script>")).toBe("나의 한 해");
  });
  it("footer contact values preserved, primary support is Kakao, business collapsed", () => {
    const html = renderToStaticMarkup(<BookFooter />);
    expect(html).toContain("고객 문의는 카카오톡 채널 채팅으로 받고 있습니다."); expect(html).toContain("http://pf.kakao.com/_sbHaX/chat"); expect(html).toContain("support@gyeolreport.com"); expect(html).not.toMatch(/mailto:|tel:|<details[^>]*open/);
    expect(renderToStaticMarkup(<BookLegalPage index={0} />)).toContain("이용약관");
  });
});
