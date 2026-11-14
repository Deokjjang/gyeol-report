import { adultCheckoutConsent } from "../../fixtures/checkoutConsent";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "../../../src/app/api/payment-checkout/prepare/route";
import { REPORT_PRICE_KRW } from "../../../src/lib/payment/reportProductCatalog";

// P 추가 A: 결제는 같은 출처(Origin) + 로그인한 회원만. 계정·서재·운영 저장소는 로컬 대역(customerDayunGeneration 시험과 같은 방식).
vi.mock("../../../src/lib/account/supabase", async () => (await import("../../helpers/opsStoreStub")).memberAccountModule);
vi.mock("../../../src/lib/library/supabase", () => ({ createLibraryPort: () => ({ bind: async () => true }) }));
vi.mock("../../../src/lib/ops/store", async () => (await import("../../helpers/opsStoreStub")).opsStoreModule);

const routeSource = readFileSync(
  join(process.cwd(), "src/app/api/payment-checkout/prepare/route.ts"),
  "utf8",
);

const originalEnv = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  tossClientKey: process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY,
  tossSecretKey: process.env.TOSS_PAYMENTS_SECRET_KEY,
};

const inputSnapshot = {
  displayName: "PAYMENT_ORDER_TEST",
  birthDate: "1996-12-06",
  reportInputPayload: {
    productKey: "saju_mbti_full",
    productSlug: "saju-mbti-full",
    person: { name: "테스트", birthDate: "1996-12-06", birthTime: "09:30", birthTimeUnknown: false, approximateBirthTimeSlot: "", gender: "MALE", mbtiType: "ENTJ" },
    userContext: { relationshipStatus: "single", jobStatus: "employee", detailJob: "기획자", focusAreas: [] }, productOptions: {},
  },
} as const;

function restoreOptionalEnv(name: string, value: string | undefined): void {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

function createJsonRequest(body: unknown): Request {
  return new Request("https://gyeolreport.com/api/payment-checkout/prepare", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://gyeolreport.com",
    },
    body: JSON.stringify(isRecord(body) ? { consent: adultCheckoutConsent(), ...body } : body),
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readJsonObject(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json();

  if (!isRecord(body)) {
    throw new Error("Unexpected response body.");
  }

  return body;
}

function expectErrorBody(body: Record<string, unknown>, code: string): void {
  expect(body.ok).toBe(false);
  expect(isRecord(body.error)).toBe(true);

  if (isRecord(body.error)) {
    expect(body.error.code).toBe(code);
    expect(typeof body.error.message).toBe("string");
    expect(JSON.stringify(body)).not.toContain(
      "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
    );
    expect(body.error.message).not.toContain("Checkout could not be prepared");
    expect(body.error.message).not.toContain("Toss checkout request configuration");
  }
}

describe("payment checkout prepare route", () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_ANON_KEY = "test-anon-key";
    process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY = "test_toss_client_key";
    process.env.TOSS_PAYMENTS_SECRET_KEY = "test_toss_secret_key";
  });

  afterEach(() => {
    restoreOptionalEnv("SUPABASE_URL", originalEnv.supabaseUrl);
    restoreOptionalEnv("SUPABASE_ANON_KEY", originalEnv.supabaseAnonKey);
    restoreOptionalEnv(
      "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY",
      originalEnv.tossClientKey,
    );
    restoreOptionalEnv("TOSS_PAYMENTS_SECRET_KEY", originalEnv.tossSecretKey);
  });

  it("prepares Toss checkout draft with fixed amount and route success fail URLs", async () => {
    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.paymentOrder).toMatchObject({
      productType: "saju_mbti_full",
      provider: "toss",
      amount: REPORT_PRICE_KRW,
      currency: "KRW",
      status: "ready",
    });
    expect(body.checkoutSession).toMatchObject({
      productLabelKo: "사주×MBTI 종합 리포트",
      amount: REPORT_PRICE_KRW,
      currency: "KRW",
      status: "prepared",
    });
    expect(body.tossCheckoutRequest).toMatchObject({
      provider: "toss",
      clientKey: "test_toss_client_key",
      requestPayment: {
        method: "CARD",
        orderId: expect.stringMatching(/^provider_order_/),
        // P6d-ops 3: 주문명 뒤에 짧은 주문코드, 구매자는 서버가 읽은 회원 가입 정보.
        orderName: expect.stringMatching(/^사주×MBTI 종합 리포트 GR-T\d{3}$/),
        successUrl: "https://gyeolreport.com/payments/toss/success",
        failUrl: "https://gyeolreport.com/payments/toss/fail",
        customerName: "검수 회원",
        customerEmail: "member@example.com",
        amount: {
          currency: "KRW",
          value: REPORT_PRICE_KRW,
        },
      },
      metadata: {
        paymentOrderId: expect.stringMatching(/^payment_order_/),
        productType: "saju_mbti_full",
      },
    });
    expect(JSON.stringify(body)).not.toContain("test_toss_secret_key");
  });

  it("returns safe config error when Toss env is missing", async () => {
    delete process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;

    const response = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(500);
    expectErrorBody(body, "PAYMENT_CHECKOUT_UNAVAILABLE");
    expect(JSON.stringify(body)).toContain(
      "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );
    expect(JSON.stringify(body)).not.toContain("test_toss_secret_key");
  });

  it("keeps non-Toss providers out of Toss request drafting", async () => {
    const response = await POST(
      createJsonRequest({
        provider: "kakao_pay",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    );
    const body = await readJsonObject(response);

    expect(response.status).toBe(200);
    expect(body.paymentOrder).toMatchObject({
      provider: "kakao_pay",
      amount: REPORT_PRICE_KRW,
      currency: "KRW",
    });
    expect(body).not.toHaveProperty("tossCheckoutRequest");
  });

  it("returns 400 when input snapshot is missing or not an object", async () => {
    const missingResponse = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
      }),
    );
    const nonObjectResponse = await POST(
      createJsonRequest({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot: "not-object",
      }),
    );

    expect(missingResponse.status).toBe(400);
    expect(nonObjectResponse.status).toBe(400);
    expectErrorBody(
      await readJsonObject(missingResponse),
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
    );
    expectErrorBody(
      await readJsonObject(nonObjectResponse),
      "PAYMENT_CHECKOUT_INVALID_REQUEST",
    );
  });

  it("source stays scoped to checkout preparation only", () => {
    const requiredMarkers = [
      "NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY",
      "TOSS_PAYMENTS_SECRET_KEY",
      "PAYMENT_CHECKOUT_UNAVAILABLE",
      "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      "preparePaymentCheckoutSession",
      "prepareTossCheckoutRequest",
      "createPaymentOrderDraft",
      "createPaymentOrderPersistenceRuntime",
      "createReadyPaymentOrderRecord",
      "/payments/toss/success",
      "/payments/toss/fail",
      "tossCheckoutRequest",
      "saju_mbti_full",
    ];
    const blockedMarkers = [
      "/api/reports/create",
      "/v1/" + "payments/confirm",
      "fetch" + "(",
      "payment" + "Key",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "persistPaidFullReport",
      "issueReport" + "Share" + "Token",
      "createSupabaseReadyPaymentOrderClient",
      "supabaseReadyPaymentOrderAdapter",
      "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
      "Checkout could not be prepared",
      "Toss checkout request configuration is missing",
    ];

    for (const marker of requiredMarkers) {
      expect(routeSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(routeSource).not.toContain(marker);
    }
  });
});
