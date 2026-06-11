import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { DevTossCheckoutInputSnapshot } from "../../../src/components/payment/DevTossCheckoutLauncher";

const componentPath = join(
  process.cwd(),
  "src/components/payment/DevTossCheckoutLauncher.tsx",
);
const componentSource = readFileSync(componentPath, "utf8");
const envName = "NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED";

const validInputSnapshot = {
  mbti: "INFP",
  gender: "MALE",
  timezone: "Asia/Seoul",
  birthDate: "2001-01-02",
  birthTime: "08:30",
  calendarType: "SOLAR",
  birthTimeUnknown: false,
  displayName: "민지",
} as const satisfies DevTossCheckoutInputSnapshot;

const missingInputSnapshot = {
  ...validInputSnapshot,
  birthDate: "",
} as const satisfies DevTossCheckoutInputSnapshot;

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
        value: 990,
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
  readonly launcherUsesLoader?: boolean;
  readonly sdkLoadError?: unknown;
  readonly requestPaymentError?: unknown;
}) {
  const fetchCalls: {
    readonly input: string;
    readonly init: RequestInit;
  }[] = [];
  const launchInputs: unknown[] = [];
  const requestPayment = vi.fn(async () => {
    if (options?.requestPaymentError !== undefined) {
      throw options.requestPaymentError;
    }
  });
  const fakeLoadTossPayments = async () => {
    if (options?.sdkLoadError !== undefined) {
      throw options.sdkLoadError;
    }

    return {
      payment: () => ({
        requestPayment,
      }),
    };
  };
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

      if (options?.launcherUsesLoader) {
        if (!isRecord(input) || typeof input.loadTossPayments !== "function") {
          return {
            ok: false,
            status: "failed_to_launch" as const,
            error: {
              code: "TOSS_CLIENT_CHECKOUT_INVALID_REQUEST" as const,
              messageKo: "Toss 결제 실행 요청이 올바르지 않습니다.",
            },
          };
        }

        try {
          const sdk = await input.loadTossPayments("test_client_key");
          const paymentWindow = sdk.payment({
            customerKey: "gyeol_local_test_customer",
          });

          await paymentWindow.requestPayment(
            createTossRequestDraft().requestPayment,
          );
        } catch {
          return {
            ok: false,
            status: "failed_to_launch" as const,
            error: {
              code:
                options.sdkLoadError !== undefined
                  ? ("TOSS_CLIENT_CHECKOUT_SDK_LOAD_FAILED" as const)
                  : ("TOSS_CLIENT_CHECKOUT_REQUEST_FAILED" as const),
              messageKo: "Toss 결제창을 열지 못했습니다.",
            },
          };
        }
      }

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
    requestPayment,
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

    const html = renderToStaticMarkup(
      <Component inputSnapshot={validInputSnapshot} />,
    );

    expect(html).toBe("");
  });

  it("renders dev-only Toss launcher copy when the public env gate is on", async () => {
    const launcherModule = await importLauncherModule(true);
    const Component = launcherModule.default;

    const html = renderToStaticMarkup(
      <Component inputSnapshot={validInputSnapshot} />,
    );

    expect(html).toContain("Toss 결제창 테스트");
    expect(html).toContain("결제 성공 후 임시 승인 대기 화면으로 이동합니다.");
    expect(html).toContain("990원 결제하고 리포트 생성하기");
  });

  it("uses the provided inputSnapshot in the checkout prepare request", async () => {
    const launcherModule = await importLauncherModule(true);
    const tossCheckoutRequest = createTossRequestDraft();
    const harness = createHarness({
      responseBody: {
        ok: true,
        tossCheckoutRequest,
      },
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      harness.runtime,
    );

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
    expect(requestBody.inputSnapshot).toEqual(validInputSnapshot);
    expect(harness.launchInputs).toHaveLength(1);

    const launchInput = harness.launchInputs[0];

    expect(isRecord(launchInput)).toBe(true);

    if (!isRecord(launchInput)) {
      throw new Error("launch input was not an object");
    }

    expect(launchInput.tossCheckoutRequest).toBe(tossCheckoutRequest);
    expect(launchInput.customerKey).toBe("gyeol_local_test_customer");
    expect(typeof launchInput.loadTossPayments).toBe("function");
  });

  it("does not call prepare API when required input is missing", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness();

    const result = await launcherModule.runDevTossCheckout(
      missingInputSnapshot,
      harness.runtime,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("expected input validation failure");
    }

    expect(result.detail).toEqual({
      stage: "input_validation",
      errorCode: "REPORT_INPUT_REQUIRED",
      errorMessage: "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.",
    });
    expect(harness.fetchCalls).toHaveLength(0);
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("shows a missing input message for invalid input", async () => {
    const launcherModule = await importLauncherModule(true);
    const Component = launcherModule.default;

    const html = renderToStaticMarkup(
      <Component inputSnapshot={missingInputSnapshot} />,
    );

    expect(html).toContain(
      "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.",
    );
    expect(html).toContain("disabled");
  });

  it("requires a Toss checkout request in the prepare API response", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness({
      responseBody: {
        ok: true,
      },
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      harness.runtime,
    );

    expect(result.ok).toBe(false);
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("shows safe prepare API error code and message", async () => {
    const launcherModule = await importLauncherModule(true);
    const hiddenClientKey = "test" + "_ck_" + "abcdefghijklmnopqrstuvwxyz";
    const hiddenSecretKey = "test" + "_sk_" + "abcdefghijklmnopqrstuvwxyz";
    const harness = createHarness({
      responseOk: false,
      responseBody: {
        ok: false,
        error: {
          code: "PAYMENT_TOSS_CHECKOUT_CONFIG_MISSING",
          message: `Toss config failed for ${hiddenClientKey} and ${hiddenSecretKey}`,
        },
      },
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      harness.runtime,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("expected prepare failure");
    }

    expect(result.detail).toEqual({
      stage: "prepare_api",
      errorCode: "PAYMENT_TOSS_CHECKOUT_CONFIG_MISSING",
      errorMessage: "Toss config failed for [masked_key] and [masked_key]",
    });
    expect(JSON.stringify(result)).not.toContain(hiddenClientKey);
    expect(JSON.stringify(result)).not.toContain(hiddenSecretKey);
  });

  it("launches through the injected Toss checkout boundary", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness({
      launcherUsesLoader: true,
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      harness.runtime,
    );

    expect(result.ok).toBe(true);
    expect(harness.requestPayment).toHaveBeenCalledTimes(1);
    expect(harness.launchInputs).toHaveLength(1);
  });

  it("keeps source scoped to checkout preparation only", () => {
    const requiredMarkers = [
      "NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED",
      "DevTossCheckoutInputSnapshot",
      "inputSnapshot",
      "isDevTossCheckoutInputComplete",
      "Toss 결제창 테스트",
      "990원 결제하고 리포트 생성하기",
      "/api/payment-checkout/prepare",
      "launchTossCheckout",
      "loadTossPaymentsBrowserSdk",
      "gyeol_local_test_customer",
      "UNKNOWN_TOSS_CHECKOUT_ERROR",
      "prepare_api",
      "sdk_load",
      "request_payment",
      "[masked_key]",
    ];
    const blockedMarkers = [
      "1996-12-06",
      "ENTJ",
      "FEMALE",
      "devTossCheckoutPrepareBody",
      "/api/reports/create",
      "TOSS" + "_SECRET" + "_KEY",
      "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
      "/v1/" + "payments/confirm",
      "payment" + "Key",
      "provider" + "Payment" + "Id",
      "provider" + "_payment" + "_id",
      "checkout" + "Url",
      "share" + "Token",
      "access" + "TokenHash",
      "report" + "_snapshot",
      "service" + "_role",
      "SUPABASE" + "_SERVICE" + "_ROLE",
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
