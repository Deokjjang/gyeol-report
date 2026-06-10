import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const componentPath = join(
  process.cwd(),
  "src/components/payment/DevTossCheckoutLauncher.tsx",
);
const componentSource = readFileSync(componentPath, "utf8");
const envName = "NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function importLauncherModule(enabled: boolean) {
  vi.resetModules();

  if (enabled) {
    process.env[envName] = "1";
  } else {
    delete process.env[envName];
  }

  return import("../../../src/components/payment/DevTossCheckoutLauncher");
}

function createTossRequestDraft(): Record<string, unknown> {
  return {
    provider: "toss",
    clientKey: "test_client_key",
    requestPayment: {
      orderId: "provider_order_test_1",
      orderName: "사주×MBTI 전체 리포트",
      amount: {
        currency: "KRW",
        value: 1290,
      },
      successUrl: "https://example.com/payments/toss/success",
      failUrl: "https://example.com/payments/toss/fail",
      customerName: "결리포트 고객",
    },
    metadata: {
      paymentOrderId: "payment_order_test_1",
      productType: "saju_mbti_full",
    },
  };
}

function createHarness(options?: {
  readonly responseOk?: boolean;
  readonly responseBody?: unknown;
  readonly rejectFetch?: boolean;
  readonly launcherSucceeds?: boolean;
}) {
  const fetchCalls: {
    readonly input: string;
    readonly init: RequestInit;
  }[] = [];
  const launchInputs: unknown[] = [];
  const fakeLoadTossPayments = async () => ({
    payment: () => ({
      requestPayment: () => undefined,
    }),
  });
  const runtime = {
    fetch: async (input: string, init: RequestInit) => {
      if (options?.rejectFetch) {
        throw new Error("prepare failed");
      }

      fetchCalls.push({ input, init });

      return {
        ok: options?.responseOk ?? true,
        json: async () =>
          options?.responseBody ?? {
            ok: true,
            tossCheckoutRequest: createTossRequestDraft(),
          },
      };
    },
    launchTossCheckout: async (input: unknown) => {
      launchInputs.push(input);

      if (options?.launcherSucceeds === false) {
        return {
          ok: false,
          status: "failed_to_launch" as const,
          error: {
            code: "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED" as const,
            messageKo: "Toss 결제창을 열지 못했습니다.",
          },
        };
      }

      return {
        ok: true,
        status: "redirect_requested" as const,
      };
    },
    loadTossPayments: fakeLoadTossPayments,
  };

  return {
    runtime,
    fetchCalls,
    launchInputs,
    fakeLoadTossPayments,
  };
}

function parseRequestBody(init: RequestInit): Record<string, unknown> {
  expect(typeof init.body).toBe("string");

  const parsed: unknown = JSON.parse(
    typeof init.body === "string" ? init.body : "",
  );

  expect(isRecord(parsed)).toBe(true);

  if (!isRecord(parsed)) {
    throw new Error("request body was not an object");
  }

  return parsed;
}

afterEach(() => {
  delete process.env[envName];
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("DevTossCheckoutLauncher", () => {
  it("does not render when the public env gate is off", async () => {
    const launcherModule = await importLauncherModule(false);
    const Component = launcherModule.default;

    const html = renderToStaticMarkup(<Component />);

    expect(html).toBe("");
  });

  it("renders dev-only Toss launcher copy when the public env gate is on", async () => {
    const launcherModule = await importLauncherModule(true);
    const Component = launcherModule.default;

    const html = renderToStaticMarkup(<Component />);

    expect(html).toContain("Toss 결제창 테스트");
    expect(html).toContain(
      "실제 결제 승인(confirm)은 아직 연결되지 않았습니다.",
    );
    expect(html).toContain("결제 성공 후 임시 success 페이지로 돌아옵니다.");
    expect(html).toContain("Toss 결제창 열기");
  });

  it("prepares a Toss checkout request and launches through injected boundaries", async () => {
    const launcherModule = await importLauncherModule(true);
    const tossCheckoutRequest = createTossRequestDraft();
    const harness = createHarness({
      responseBody: {
        ok: true,
        tossCheckoutRequest,
      },
    });

    const result = await launcherModule.runDevTossCheckout(harness.runtime);

    expect(result).toEqual({
      ok: true,
      status: "redirect_requested",
    });
    expect(harness.fetchCalls).toHaveLength(1);
    expect(harness.fetchCalls[0]?.input).toBe("/api/payment-checkout/prepare");
    expect(harness.fetchCalls[0]?.init.method).toBe("POST");
    expect(harness.fetchCalls[0]?.init.headers).toEqual({
      "content-type": "application/json",
    });

    const requestBody = parseRequestBody(harness.fetchCalls[0]?.init ?? {});

    expect(requestBody.provider).toBe("toss");
    expect(requestBody.productType).toBe("saju_mbti_full");
    expect(requestBody.inputSnapshot).toMatchObject({
      mbti: "ENTJ",
      gender: "FEMALE",
      timezone: "Asia/Seoul",
      birthDate: "1996-12-06",
      birthTime: "14:15",
      calendarType: "SOLAR",
      birthTimeUnknown: false,
    });

    expect(harness.launchInputs).toHaveLength(1);
    const launchInput = harness.launchInputs[0];

    expect(isRecord(launchInput)).toBe(true);

    if (!isRecord(launchInput)) {
      throw new Error("launch input was not an object");
    }

    expect(launchInput.tossCheckoutRequest).toBe(tossCheckoutRequest);
    expect(launchInput.customerKey).toBe("gyeol_local_test_customer");
    expect(launchInput.loadTossPayments).toBe(harness.fakeLoadTossPayments);
  });

  it("requires a Toss checkout request in the prepare API response", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness({
      responseBody: {
        ok: true,
      },
    });

    const result = await launcherModule.runDevTossCheckout(harness.runtime);

    expect(result.ok).toBe(false);
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("returns a safe error when the prepare API fails", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness({
      responseOk: false,
      responseBody: {
        ok: false,
      },
    });

    const result = await launcherModule.runDevTossCheckout(harness.runtime);

    expect(result).toEqual({
      ok: false,
      messageKo:
        "Toss 결제창 테스트를 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.",
    });
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("returns a safe error when launcher execution fails", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness({
      launcherSucceeds: false,
    });

    const result = await launcherModule.runDevTossCheckout(harness.runtime);

    expect(result).toEqual({
      ok: false,
      messageKo:
        "Toss 결제창 테스트를 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.",
    });
  });

  it("keeps source scoped to dev launcher behavior", () => {
    const requiredMarkers = [
      "NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED",
      "Toss 결제창 테스트",
      "실제 결제 승인(confirm)은 아직 연결되지 않았습니다.",
      "결제 성공 후 임시 success 페이지로 돌아옵니다.",
      "/api/payment-checkout/prepare",
      "launchTossCheckout",
      "loadTossPaymentsBrowserSdk",
      "gyeol_local_test_customer",
      "onClick={() => void handleLaunch()}",
    ];
    const blockedMarkers = [
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "/v1/" + "payments/confirm",
      "payment" + "Key",
      "provider" + "PaymentId",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
      "wall" + "et",
      "re" + "charge",
      "point " + "balance",
      "credit " + "balance",
      "충" + "전",
      "포" + "인트",
      "잔" + "액",
      "TossPayments(",
      "@tosspayments",
    ];

    for (const marker of requiredMarkers) {
      expect(componentSource).toContain(marker);
    }

    for (const marker of blockedMarkers) {
      expect(componentSource).not.toContain(marker);
    }
  });
});
