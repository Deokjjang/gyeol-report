// AM2-14 4부(호출 0): 대운 반값 — 결제 준비(서버 금액 · 화면 금액 무시 · 자격 없으면 알림) · 승인 직전 문(소진 · 거절 · 금액 조작) · 4종 그대로.
import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("../../../src/lib/account/supabase", async () => (await import("../../helpers/opsStoreStub")).memberAccountModule);
vi.mock("../../../src/lib/library/supabase", () => ({ createLibraryPort: () => ({ bind: async () => true }) }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);
vi.mock("../../../src/lib/ops/salesPause", async () => ({ ...(await vi.importActual<object>("../../../src/lib/ops/salesPause")), salesPaused: async () => false, salesPauseNotice: async () => null }));
const storage = vi.hoisted(() => ({ create: vi.fn(async (record: unknown) => ({ ok: true, value: record })) }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));
const half = vi.hoisted(() => ({ port: null as unknown }));
vi.mock("../../../src/lib/payment/majorDiscount", async () => ({ ...(await vi.importActual<object>("../../../src/lib/payment/majorDiscount")), createHalfPort: () => half.port }));
const confirmPort = vi.hoisted(() => ({ order: null as Record<string, unknown> | null, call: vi.fn() }));
vi.mock("../../../src/lib/payment/paidReportReliabilityStore", () => ({ createPaidReportReliabilityStore: () => ({ call: async (a: string, d?: unknown) => a === "find_order" ? { ok: true, order: confirmPort.order } : confirmPort.call(a, d) }) }));
vi.mock("../../../src/lib/payment/tossConfirmClient", () => ({ confirmTossPayment: vi.fn(async (p: { orderId: string; amount: number }) => ({ ok: true, confirm: { provider: "toss", paymentKeyReceived: true, orderId: p.orderId, amount: p.amount, status: "DONE", approvedAt: "2026-12-02T00:00:00.000Z" } })) }));
import { POST as prepare } from "../../../src/app/api/payment-checkout/prepare/route";
import { POST as tossConfirm } from "../../../src/app/api/payments/toss/confirm/route";
import { confirmTossPayment } from "../../../src/lib/payment/tossConfirmClient";
import { HALF_AMOUNT_CODE, HALF_REFUSED_CODE, type HalfPort } from "../../../src/lib/payment/majorDiscount";
import { majorHalfPriceKrw, reportPriceKrw } from "../../../src/lib/payment/reportProductCatalog";
import { TEST_MEMBER } from "../../helpers/opsStoreStub";

const HALF = majorHalfPriceKrw(), PRICE = reportPriceKrw("major_fortune");
const person = { name: "윤태민", birthDate: "1998-11-03", birthTime: "10:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTP" };
const payload = (product: "major_fortune" | "saju_mbti_full") => ({ productKey: product, productSlug: product === "major_fortune" ? "major-fortune" : "saju-mbti-full", person, userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "", focusAreas: [] }, productOptions: {} });
const req = (product: "major_fortune" | "saju_mbti_full", extra: Record<string, unknown> = {}) => new Request("https://gyeolreport.com/api/payment-checkout/prepare", {
  method: "POST", headers: { origin: "https://gyeolreport.com", "content-type": "application/json" },
  body: JSON.stringify({ consent: adultCheckoutConsent(), provider: "toss", productType: product, inputSnapshot: { displayName: person.name, birthDate: person.birthDate, reportInputPayload: payload(product) }, ...extra }),
});
/** 자격 하나(결제된 세운 A1)가 있는 메모리 손 — 판정 · 소진만 쓴다. */
function portWith(opts: { annual?: boolean; used?: boolean } = {}): HalfPort & { inserted: unknown[] } {
  const inserted: unknown[] = [];
  return {
    inserted,
    annualOrders: async (u: string) => (opts.annual !== false && u === TEST_MEMBER.id ? [{ id: "A1", status: "paid", amount: 3900, paidAt: "2026-12-02T00:00:00.000Z", refund: null }] : []),
    uses: async () => (opts.used ? [{ annualOrderId: "A1", majorOrderId: "M0", userId: TEST_MEMBER.id, reservedAt: "2026-12-02T00:00:00.000Z" }] : []),
    majors: async () => (opts.used ? [{ id: "M0", status: "paid", paymentKey: true }] : []),
    insertUse: async (r: unknown) => { inserted.push(r); return "ok" as const; },
    casUse: async () => false, orderOwner: async () => TEST_MEMBER.id, reportOrder: async () => null, input: async () => null,
  };
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key"); vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key"); vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
  // 판매 열림(시험 시각 바꾸기 — 운영 빌드는 읽지 않는다) · 대운 · 세운 가격(5부 전 설정값 자리)
  vi.stubEnv("FORTUNE_SALES_OPEN_AT_TEST", "2000-01-01T00:00:00+09:00"); vi.stubEnv("FORTUNE_SALES_OPEN", "1"); vi.stubEnv("FORTUNE_PRICE_MAJOR_KRW", String(PRICE)); vi.stubEnv("FORTUNE_PRICE_ANNUAL_KRW", "3900");
  storage.create.mockClear(); confirmPort.call.mockReset(); vi.mocked(confirmTossPayment).mockClear();
});
afterEach(() => { vi.unstubAllEnvs(); });

describe("AM2-14 4부 결제 준비: 가격은 서버에서만", () => {
  it("자격 있는 회원의 대운 = 반값 저장 · 토스 금액 반값 · 화면이 보낸 금액은 무시", async () => {
    half.port = portWith();
    const r = await prepare(req("major_fortune", { amount: 100, discountFrom: "annual" }));
    const body = await r.json();
    expect(r.status).toBe(200);
    expect((storage.create.mock.calls[0]![0] as { amount: number }).amount).toBe(HALF);
    expect(body.tossCheckoutRequest.requestPayment.amount.value).toBe(HALF);
    expect((half.port as { inserted: unknown[] }).inserted).toEqual([]); // 준비 단계는 예약하지 않는다
  });
  it("자격 없는 회원: 링크 없이 왔으면 정가, 화면이 반값을 보내 왔으면(discountFrom) 알리고 주문을 만들지 않는다", async () => {
    half.port = portWith({ annual: false });
    const full = await prepare(req("major_fortune"));
    expect(full.status).toBe(200); expect((storage.create.mock.calls[0]![0] as { amount: number }).amount).toBe(PRICE);
    storage.create.mockClear(); half.port = portWith({ used: true });
    const used = await prepare(req("major_fortune", { discountFrom: "annual" }));
    expect(used.status).toBe(409); expect((await used.json()).error.code).toBe("MAJOR_DISCOUNT_UNAVAILABLE"); expect(storage.create).not.toHaveBeenCalled();
  });
  it("4종 결제 준비는 반값 손을 지나지 않고 3,900원 그대로", async () => {
    half.port = { ...portWith(), annualOrders: vi.fn(async () => { throw new Error("4종은 부르지 않는다"); }) };
    const r = await prepare(req("saju_mbti_full", { discountFrom: "annual", amount: 100 }));
    expect(r.status).toBe(200); expect((storage.create.mock.calls[0]![0] as { amount: number }).amount).toBe(3900);
  });
});

describe("AM2-14 4부 승인 직전 문", () => {
  const confirm = (amount: number) => tossConfirm(new Request("http://localhost/api/payments/toss/confirm", { method: "POST", body: JSON.stringify({ paymentKey: "k-1", orderId: "po-M1", amount }) }));
  it("반값 주문: 자격을 소진하면 승인 진행(confirm_claim → 토스), 자격을 이미 썼으면 409 · 토스 승인을 부르지 않는다", async () => {
    confirmPort.order = { provider_order_id: "po-M1", payment_order_id: "M1", product_type: "major_fortune", status: "ready", amount: HALF };
    confirmPort.call.mockImplementation(async (a: string) => (a === "confirm_claim" ? { ok: true, token: "t" } : { ok: true, reportId: "report_r1" }));
    half.port = portWith();
    const ok = await confirm(HALF); expect(ok.status).toBe(200); expect(confirmTossPayment).toHaveBeenCalledTimes(1);
    expect((half.port as { inserted: { majorOrderId: string }[] }).inserted[0]).toMatchObject({ majorOrderId: "M1", amount: HALF });
    vi.mocked(confirmTossPayment).mockClear(); confirmPort.call.mockClear(); half.port = portWith({ used: true });
    const refused = await confirm(HALF); expect(refused.status).toBe(409);
    expect((await refused.json()).error.code).toBe(HALF_REFUSED_CODE);
    expect(confirmTossPayment).not.toHaveBeenCalled(); expect(confirmPort.call).not.toHaveBeenCalled();
  });
  it("토스 요청 금액이 저장 금액과 다르면 → 409 · 자격을 잡지 않는다", async () => {
    confirmPort.order = { provider_order_id: "po-M1", payment_order_id: "M1", product_type: "major_fortune", status: "ready", amount: HALF };
    half.port = portWith();
    const r = await confirm(100); expect(r.status).toBe(409); expect((await r.json()).error.code).toBe(HALF_AMOUNT_CODE);
    expect((half.port as { inserted: unknown[] }).inserted).toEqual([]); expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("저장 금액 조작(정가도 반값도 아님) → 409 · 승인하지 않는다", async () => {
    confirmPort.order = { provider_order_id: "po-M1", payment_order_id: "M1", product_type: "major_fortune", status: "ready", amount: 1000 };
    half.port = portWith();
    const r = await confirm(1000); expect(r.status).toBe(409); expect((await r.json()).error.code).toBe(HALF_AMOUNT_CODE);
    expect(confirmTossPayment).not.toHaveBeenCalled();
  });
  it("정가 대운 · 4종은 소진 없이 기존 흐름(confirm_claim → 토스)", async () => {
    confirmPort.call.mockImplementation(async (a: string) => (a === "confirm_claim" ? { ok: true, token: "t" } : { ok: true, reportId: "report_r1" }));
    for (const [product, amount] of [["major_fortune", PRICE], ["saju_mbti_full", 3900]] as const) {
      half.port = { ...portWith(), insertUse: vi.fn(async () => { throw new Error("소진하지 않는다"); }) };
      confirmPort.order = { provider_order_id: "po-M1", payment_order_id: "M1", product_type: product, status: "ready", amount };
      expect((await confirm(amount)).status).toBe(200);
    }
  });
});
