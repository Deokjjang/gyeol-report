import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../../src/app/api/payment-checkout/prepare/route";
import { TEST_BUYER } from "../../helpers/opsStoreStub";
import { REPORT_PRICE_KRW } from "../../../src/lib/payment/reportProductCatalog";

const storage = vi.hoisted(() => ({ create: vi.fn(async (record: unknown) => ({ ok: true, value: record })), bind: vi.fn(async () => true) }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);
// P 추가 A: 결제는 로그인한 회원만 — 가입 정보를 마친 회원 대역(customerDayunGeneration 시험과 같은 방식). 서재 연결만 로컬 대역.
vi.mock("../../../src/lib/account/supabase", async () => (await import("../../helpers/opsStoreStub")).memberAccountModule);
vi.mock("../../../src/lib/library/supabase", () => ({ createLibraryPort: () => ({ bind: storage.bind }) }));
const person = { name: "검증", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
function request(input: object) {
  return new Request("https://gyeolreport.com/api/payment-checkout/prepare", {
    method: "POST", headers: { "Content-Type": "application/json", Origin: "https://gyeolreport.com" }, body: JSON.stringify({
      consent: adultCheckoutConsent(), buyer: TEST_BUYER, provider: "toss", productType: "saju_mbti_full", inputSnapshot: {
        displayName: person.name, birthDate: person.birthDate,
        reportInputPayload: { productKey: "saju_mbti_full", productSlug: "saju-mbti-full", person: input, userContext: { focusAreas: [] }, productOptions: {} },
      },
    }),
  });
}
beforeEach(() => {
  storage.create.mockClear();
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("PAID_REPORT_RELIABILITY_ENABLED", "1");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "mock-not-a-secret");
  vi.stubEnv("CRON_SECRET", "mock-cron");
  vi.stubEnv("REPORT_ADMIN_SECRET", "mock-admin");
  vi.stubEnv("NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY", "test_toss_client_key");
  vi.stubEnv("TOSS_PAYMENTS_SECRET_KEY", "test_toss_secret_key");
  vi.stubEnv("TOSS_CONFIRM_API_ENABLED", "1");
});
afterEach(() => vi.unstubAllEnvs());
describe("production input rejection before durable checkout writes", () => {
  it.each([
    { birthTimePrecision: "exact", birthTime: "" },
    // v5-lmt: 통자시(unified)에서는 자시 슬롯 전체가 한 날의 일주라 거절 사례가 아니다(아래 허용 목록). 대신 입춘(17:27)을 품은 신시 슬롯.
    { birthDate: "2024-02-04", birthTime: "", approximateBirthTimeSlot: "SINSI" },
    { birthDate: "2024-02-04", birthTime: "", approximateBirthTimeSlot: "YUSI" },
    { birthDate: "2024-02-04", birthTime: "", birthTimeUnknown: true },
    { birthTimeUnknown: true },
  ])("does not create orders for invalid/unstable precision %j", async (patch) => {
    const response = await POST(request({ ...person, ...patch }));
    expect(response.status).toBe(400);
    expect(storage.create).not.toHaveBeenCalled();
    const body = await response.json();
    expect(body).not.toHaveProperty("checkoutSession");
    if ("approximateBirthTimeSlot" in patch && patch.approximateBirthTimeSlot === "SINSI") expect(body.error.message).toMatch(/월주[\s\S]*또는[\s\S]*달라집니다/);
    // 절입일(2024-02-04 입춘)은 두 후보와 절기가 바뀐 시각을 밝히는 안내 문구로 거절한다.
    if ("birthDate" in patch && "birthTimeUnknown" in patch) expect(body.error.message).toMatch(/월주[\s\S]*또는[\s\S]*오(전|후) \d+시 \d+분/);
    expect(body.error.message).not.toMatch(/RPC|SQL|stack|Supabase|BIRTH_TIME_UNCERTAIN/);
  });
  it.each([
    {}, { birthTime: "", approximateBirthTimeSlot: "MISI" }, { birthTime: "", approximateBirthTimeSlot: "JASI" }, { birthTime: "", birthTimeUnknown: true },
  ])("allows exact/stable approximate/stable unknown without real providers %j", async (patch) => {
    const response = await POST(request({ ...person, ...patch }));
    expect(response.status, JSON.stringify(await response.clone().json())).toBe(200);
    expect(storage.create).toHaveBeenCalledTimes(1);
    expect((await response.json()).paymentOrder.amount).toBe(REPORT_PRICE_KRW);
  });
});
