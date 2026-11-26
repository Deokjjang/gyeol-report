// ZW-2 1부(덕짱님 결정 2026-11-26): 자미두수 단독 상품 「나의 열두 서가」(ziwei_full) 등록 · 입력 · 판매 닫힘.
//  - 판매 닫힘: 판매 시작 시각(12/01 09:00 KST)과 무관하게 늘 닫힘 — 결제 준비 · 주문 만들기 409(주문 쓰기 전), 이용권 거절.
//  - 입력: 성별 필수, 시각 「모름」이면 막음(시진만 알아도 됨), 자녀는 자미 productOptions에만.
//  - 4종 · 세운 · 대운의 가격 · 판매 · 입력 변환은 그대로.
import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { ALWAYS_CLOSED_PRODUCTS, ALL_PRODUCTS, closedSaleProducts, FORTUNE_SALES_OPEN_AT, productOnSale, SALES_CLOSED_CODE, SALES_CLOSED_MESSAGE, salesClosedMessageFor, TICKET_PRODUCTS, ticketProductAllowed, ZIWEI_SALES_CLOSED_MESSAGE } from "../../../src/lib/ops/config";
import { getReportProduct, getReportProductCatalog, REPORT_PRICE_TABLE_KRW, customerProductLabelKo, ZIWEI_BOOK_NAME } from "../../../src/lib/payment/reportProductCatalog";
import { parseReportProductType } from "../../../src/lib/payment/reportProductTypes";
import { ALL_BOOKS, BOOKS, bookForProduct, ZIWEI_BOOK } from "../../../src/lib/book/product";
import { normalizeReportInputPayload } from "../../../src/lib/report-generation/reportInputAdapter";
import { buildSinglePersonReportInputPayload, createSingleProductOptions } from "../../../src/lib/report-generation/reportInputPresentation";
import { enqueueTicketPublication } from "../../../src/lib/tickets/publication";
import { POST as validateInput } from "../../../src/app/api/reports/validate-input/route";
import { POST as prepareCheckout } from "../../../src/app/api/payment-checkout/prepare/route";
import { POST as createReady } from "../../../src/app/api/payment-orders/create-ready/route";
import { TEST_BUYER } from "../../helpers/opsStoreStub";
import { readZiweiSnapshotPart, ziweiSnapshotPart } from "../../../src/lib/ziwei/snapshot";
import { ZIWEI_CALC_VERSION } from "../../../src/lib/ziwei/basis";
import { webEvent } from "../../../src/lib/analytics/web";
import { getProductGenerationHandler } from "../../../src/lib/report-generation/productGenerationDispatcher";

const storage = vi.hoisted(() => ({ create: vi.fn(async (record: unknown) => ({ ok: true, value: record })), bind: vi.fn(async () => true) }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));
vi.mock("../../../src/lib/account/supabase", async () => (await import("../../helpers/opsStoreStub")).memberAccountModule);
vi.mock("../../../src/lib/library/supabase", () => ({ createLibraryPort: () => ({ bind: storage.bind }) }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);

const OPEN = Date.parse(FORTUNE_SALES_OPEN_AT);
const READY_ENV = "PAYMENT_READY_ORDER_API_ENABLED";
const SIX = ["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"] as const;
const person = { name: "서윤", birthDate: "1983-07-08", birthTime: "10:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", birthTimePrecision: "exact", gender: "FEMALE", mbtiType: "ISFJ" };
const ziwei = (changes: object = {}, productOptions: object = { children: "has" }) => ({ productKey: "ziwei_full", productSlug: "ziwei-full", person: { ...person, ...changes }, userContext: { relationshipStatus: "married", jobStatus: "employee", detailJob: "", focusAreas: [] }, productOptions });
const post = (url: string, body: unknown) => new Request(url, { method: "POST", headers: { origin: "https://gyeolreport.com", "content-type": "application/json" }, body: JSON.stringify(body) });

beforeEach(() => { storage.create.mockClear(); storage.bind.mockReset().mockResolvedValue(true); });
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("판매 닫힘(늘 닫힘 — 판매 시작 시각과 무관)", () => {
  it("12/01 09:00 전후 모두 닫힘 · 대운 · 세운 시각 판정과 4종은 그대로", () => {
    expect(ALWAYS_CLOSED_PRODUCTS).toEqual(["ziwei_full"]);
    for (const t of [OPEN - 1, OPEN, OPEN + 86_400_000 * 365]) expect(productOnSale("ziwei_full", {}, t)).toBe(false);
    expect(closedSaleProducts({}, OPEN - 1)).toEqual(["major_fortune", "annual_fortune"]);
    expect(closedSaleProducts({}, OPEN)).toEqual([]);
    for (const p of SIX) expect(productOnSale(p, {}, OPEN)).toBe(true);
    for (const p of ["major_fortune", "annual_fortune"]) expect(productOnSale(p, {}, OPEN - 1)).toBe(false);
  });
  it("관리 · 증정 · 이용권 목록에 넣지 않는다", () => {
    expect([...ALL_PRODUCTS]).toEqual([...SIX]);
    expect((TICKET_PRODUCTS as readonly string[]).includes("ziwei_full")).toBe(false);
    expect(ticketProductAllowed("ziwei_full")).toBe(false);
  });
  it("닫힘 문구는 상품별(대운 · 세운 · 4종은 그대로)", () => {
    expect(salesClosedMessageFor("ziwei_full")).toBe(ZIWEI_SALES_CLOSED_MESSAGE);
    for (const p of SIX) expect(salesClosedMessageFor(p)).toBe(SALES_CLOSED_MESSAGE);
  });
  it("카탈로그: 살 수 없음 · 가격 표시 말 없음(가격은 자리표시) · 고객 이름은 「나의 열두 서가」", () => {
    const z = getReportProduct("ziwei_full")!;
    expect(z.isPurchasable).toBe(false);
    expect(z.priceLabelKo).toBeUndefined();
    expect(customerProductLabelKo("ziwei_full")).toBe(ZIWEI_BOOK_NAME);
    expect(getReportProductCatalog().filter(p => p.isPurchasable).map(p => p.productType).sort()).toEqual([...SIX].sort());
    expect(parseReportProductType("ziwei_full")).toBe("ziwei_full");
  });
  it("4종 · 세운 · 대운 가격 · 카탈로그 줄 그대로", () => {
    expect(Object.fromEntries(SIX.map(p => [p, REPORT_PRICE_TABLE_KRW[p]]))).toEqual({ saju_mbti_full: 3900, career_money_study: 3900, love_marriage_child: 3900, saju_mbti_compatibility: 3900, major_fortune: 4900, annual_fortune: 3900 });
    for (const p of SIX) { const c = getReportProduct(p)!; expect(c.isPurchasable).toBe(true); expect(c.priceLabelKo).toBe(`${REPORT_PRICE_TABLE_KRW[p].toLocaleString("ko-KR")}원`); }
    expect(customerProductLabelKo("major_fortune")).toBe("대운 리포트");
  });
  it("옛 생성 경로는 없다(v5 작가 전용)", async () => {
    const r = await getProductGenerationHandler("ziweiFull")({ kind: "ziweiFull" } as never);
    expect(r).toMatchObject({ ok: false, error: { code: "PRODUCT_GENERATION_NOT_IMPLEMENTED" } });
  });
});

describe("결제 준비 · 주문 만들기 · 이용권 — 주문 쓰기 전에 거절", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key"); vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key"); vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
    vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", "2000-01-01T00:00:00+09:00"); // 대운 · 세운도 열린 때에도 자미는 닫힘
  });
  it("결제 준비 409 PRODUCT_SALES_CLOSED · 자미 문구 · 주문 쓰기 0", async () => {
    const p = ziwei();
    const r = await prepareCheckout(post("https://gyeolreport.com/api/payment-checkout/prepare", { consent: adultCheckoutConsent(), buyer: TEST_BUYER, provider: "toss", productType: "ziwei_full", inputSnapshot: { displayName: p.person.name, birthDate: p.person.birthDate, reportInputPayload: p } }));
    expect(r.status).toBe(409);
    expect(await r.json()).toMatchObject({ ok: false, error: { code: SALES_CLOSED_CODE, message: ZIWEI_SALES_CLOSED_MESSAGE } });
    expect(storage.create).not.toHaveBeenCalled(); expect(storage.bind).not.toHaveBeenCalled();
  });
  it("주문 만들기(create-ready, 켠 경우)도 409", async () => {
    vi.stubEnv(READY_ENV, "1");
    const r = await createReady(post("https://gyeolreport.com/api/payment-orders/create-ready", { productType: "ziwei_full", provider: "toss", amount: 3900 }));
    expect(r.status).toBe(409);
    expect(await r.json()).toMatchObject({ ok: false, error: { code: SALES_CLOSED_CODE, message: ZIWEI_SALES_CLOSED_MESSAGE } });
    expect(storage.create).not.toHaveBeenCalled();
  });
  it("이용권 사용 거절(판매 닫힘) · 저장소 호출 0", async () => {
    const store = { call: vi.fn(async () => ({ ok: true })) };
    const r = await enqueueTicketPublication(store as never, "user-1", "11111111-1111-4111-8111-111111111111", ziwei(), {} as never, new Date("2026-12-02T10:00:00+09:00"), async () => false);
    expect(r).toEqual({ ok: false, code: SALES_CLOSED_CODE });
    expect(store.call).not.toHaveBeenCalled();
  });
});

describe("입력: 성별 필수 · 시각 미상 막음 · 시진만 가능 · 자녀는 자미에만", () => {
  it("입력 변환: 정확 · 시진만 → 통과, 모름 → ZIWEI_NEED_SLOT, 성별 없음 → ZIWEI_GENDER_REQUIRED, 범위 밖 → ZIWEI_OUT_OF_RANGE", () => {
    const ok = normalizeReportInputPayload(ziwei());
    expect(ok.ok && ok.value.kind === "ziweiFull" && ok.value.productOptions).toEqual({ children: "has" });
    expect(normalizeReportInputPayload(ziwei({ birthTime: "", birthTimePrecision: "approximate", approximateBirthTimeSlot: "SASI" })).ok).toBe(true);
    expect(normalizeReportInputPayload(ziwei({ birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown" }))).toMatchObject({ ok: false, error: "ZIWEI_NEED_SLOT" });
    expect(normalizeReportInputPayload(ziwei({ gender: "" }))).toMatchObject({ ok: false, error: "ZIWEI_GENDER_REQUIRED" });
    expect(normalizeReportInputPayload(ziwei({ birthDate: "1900-01-10" }))).toMatchObject({ ok: false, error: "ZIWEI_OUT_OF_RANGE" });
    expect((normalizeReportInputPayload(ziwei({}, { children: "maybe" })) as { value: { productOptions: object } }).value.productOptions).toEqual({});
  });
  it("입력 확인 API: 모름이면 400 · 시간대 안내 · 「나라는 사람」 권함", async () => {
    const bad = await validateInput(post("https://gyeolreport.com/api/reports/validate-input", ziwei({ birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown" })));
    expect(bad.status).toBe(400);
    expect(await bad.json()).toMatchObject({ ok: false, code: "ZIWEI_NEED_SLOT", recommend: "saju_mbti_full", message: expect.stringContaining("시간대") });
    const good = await validateInput(post("https://gyeolreport.com/api/reports/validate-input", ziwei()));
    expect(await good.json()).toEqual({ ok: true });
  });
  it("자녀 칸은 자미 productOptions에만 — 다른 상품 입력 그대로", () => {
    expect(createSingleProductOptions("ziwei_full", { selectedYear: "", children: "none" })).toEqual({ children: "none" });
    expect(createSingleProductOptions("ziwei_full", { selectedYear: "" })).toEqual({});
    expect(createSingleProductOptions("major_fortune", { selectedYear: "2027", children: "has" })).toEqual({ contentVersion: "v3" });
    expect(createSingleProductOptions("annual_fortune", { selectedYear: "2027", children: "has" })).toEqual({ selectedYear: "2027", contentVersion: "v3" });
    const state = { name: "서윤", birthDate: "1983-07-08", paidBirthTimeMode: "exact" as const, birthTime: "10:15", timeBranch: "" as const, birthTimeUnknown: false, gender: "FEMALE", mbtiType: "", relationshipStatus: "married", jobStatus: "employee", detailedJob: "", focusAreas: [], selectedYear: "2027", children: "has" };
    expect(buildSinglePersonReportInputPayload(ZIWEI_BOOK, state).productOptions).toEqual({ children: "has" });
    expect(buildSinglePersonReportInputPayload(BOOKS[0], state).productOptions).toEqual({ contentVersion: "v3" });
  });
});

describe("홈 · 목록 · 분석에는 넣지 않는다(직접 주소로만)", () => {
  it("서가 BOOKS는 6권 그대로, 찾기(ALL_BOOKS)에만 자미", () => {
    expect(BOOKS.map(b => b.productKey)).toEqual(["saju_mbti_full", "career_money_study", "love_marriage_child", "saju_mbti_compatibility", "major_fortune", "annual_fortune"]);
    expect(ALL_BOOKS.at(-1)).toBe(ZIWEI_BOOK);
    expect(bookForProduct("ziwei-full")).toBe(ZIWEI_BOOK); expect(bookForProduct("ziwei_full")).toBe(ZIWEI_BOOK);
    expect(ZIWEI_BOOK.title).toBe("나의\n열두 서가");
  });
  it("분석 이벤트를 보내지 않는다", () => {
    vi.stubGlobal("window", {});
    try { expect(webEvent("input_done", { product: "ziwei_full" })).toBe(false); } finally { vi.unstubAllGlobals(); }
  });
});

describe("Book 스냅샷: 명반 + 계산 버전", () => {
  it("저장 조각 = 계산 버전 + 명반(JSON 왕복 그대로), 읽기 검사", () => {
    const part = ziweiSnapshotPart(person as never, "2026-12-02");
    expect(part.calcVersion).toBe(ZIWEI_CALC_VERSION);
    expect(part.chart.calcVersion).toBe(ZIWEI_CALC_VERSION);
    const stored = JSON.parse(JSON.stringify(part));
    expect(stored).toEqual(part);
    expect(readZiweiSnapshotPart(stored)).toMatchObject({ calcVersion: ZIWEI_CALC_VERSION, current: true });
    expect(readZiweiSnapshotPart({ calcVersion: "ziwei-v0", chart: stored.chart })).toMatchObject({ current: false });
    expect(readZiweiSnapshotPart({ calcVersion: ZIWEI_CALC_VERSION, chart: { palaces: [] } })).toBeNull();
    // 시진만 입력한 사람도 만든다.
    expect(ziweiSnapshotPart({ ...person, birthTime: "", birthTimePrecision: "approximate", approximateBirthTimeSlot: "SULSI" } as never, "2026-12-02").chart.birth.precision).toBe("approximate");
  });
});
