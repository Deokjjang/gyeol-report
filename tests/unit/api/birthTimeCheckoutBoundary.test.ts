import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../../src/app/api/payment-checkout/prepare/route";

const storage = vi.hoisted(() => ({ create: vi.fn(async (record: unknown) => ({ ok: true, value: record })) }));
vi.mock("../../../src/lib/payment/paymentOrderRuntime", () => ({ createPaymentOrderPersistenceRuntime: () => storage }));
const person = { name: "검증", birthDate: "1996-12-06", birthTime: "14:15", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" };
function request(input: object) {
  return new Request("https://example.test/api/payment-checkout/prepare", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      provider: "toss", productType: "saju_mbti_full", inputSnapshot: {
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
});
afterEach(() => vi.unstubAllEnvs());
describe("production input rejection before durable checkout writes", () => {
  it.each([
    { birthTimePrecision: "exact", birthTime: "" },
    { birthTime: "", approximateBirthTimeSlot: "JASI" },
    { birthDate: "2024-02-04", birthTime: "", approximateBirthTimeSlot: "YUSI" },
    { birthDate: "2024-02-04", birthTime: "", birthTimeUnknown: true },
    { birthTimeUnknown: true },
  ])("does not create orders for invalid/unstable precision %j", async (patch) => {
    const response = await POST(request({ ...person, ...patch }));
    expect(response.status).toBe(400);
    expect(storage.create).not.toHaveBeenCalled();
    const body = await response.json();
    expect(body).not.toHaveProperty("checkoutSession");
    if ("birthDate" in patch || ("approximateBirthTimeSlot" in patch && patch.approximateBirthTimeSlot === "JASI")) expect(body.error.message).toContain("원국이 달라집니다");
    expect(body.error.message).not.toMatch(/RPC|SQL|stack|Supabase|BIRTH_TIME_UNCERTAIN/);
  });
  it.each([
    {}, { birthTime: "", approximateBirthTimeSlot: "MISI" }, { birthTime: "", birthTimeUnknown: true },
  ])("allows exact/stable approximate/stable unknown without real providers %j", async (patch) => {
    const response = await POST(request({ ...person, ...patch }));
    expect(response.status, JSON.stringify(await response.clone().json())).toBe(200);
    expect(storage.create).toHaveBeenCalledTimes(1);
    expect((await response.json()).paymentOrder.amount).toBe(1290);
  });
});
