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
    fakeLoadTossPayments,
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

function expectFailure(
  result: Awaited<
    ReturnType<
      typeof import("../../../src/components/payment/DevTossCheckoutLauncher").runDevTossCheckout
    >
  >,
) {
  expect(result.ok).toBe(false);

  if (result.ok) {
    throw new Error("expected launch failure");
  }

  return result;
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
    expect(typeof launchInput.loadTossPayments).toBe("function");
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

    const failure = expectFailure(result);

    expect(failure.messageKo).toBe(
      "Toss 결제창 테스트를 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.",
    );
    expect(failure.detail).toEqual({
      stage: "prepare_api",
      errorCode: "UNKNOWN_TOSS_CHECKOUT_ERROR",
      errorMessage: "No safe error message was provided.",
    });
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

    const failure = expectFailure(
      await launcherModule.runDevTossCheckout(harness.runtime),
    );

    expect(failure.detail).toEqual({
      stage: "prepare_api",
      errorCode: "PAYMENT_TOSS_CHECKOUT_CONFIG_MISSING",
      errorMessage: "Toss config failed for [masked_key] and [masked_key]",
    });
    expect(JSON.stringify(failure)).not.toContain(hiddenClientKey);
    expect(JSON.stringify(failure)).not.toContain(hiddenSecretKey);
  });

  it("shows safe SDK load failure stage code and message", async () => {
    const launcherModule = await importLauncherModule(true);
    const hiddenSecretKey = "live" + "_sk_" + "abcdefghijklmnopqrstuvwxyz";
    const harness = createHarness({
      launcherUsesLoader: true,
      sdkLoadError: {
        code: "TOSS_BROWSER_SDK_LOAD_FAILED",
        message: `SDK load failed with ${hiddenSecretKey}`,
      },
    });

    const failure = expectFailure(
      await launcherModule.runDevTossCheckout(harness.runtime),
    );

    expect(failure.detail).toEqual({
      stage: "sdk_load",
      errorCode: "TOSS_BROWSER_SDK_LOAD_FAILED",
      errorMessage: "SDK load failed with [masked_key]",
    });
    expect(JSON.stringify(failure)).not.toContain(hiddenSecretKey);
  });

  it("shows safe Toss request failure code and message", async () => {
    const launcherModule = await importLauncherModule(true);
    const hiddenSecretKey = "test" + "_sk_" + "abcdefghijklmnopqrstuvwxyz";
    const hiddenClientKey = "live" + "_ck_" + "abcdefghijklmnopqrstuvwxyz";
    const hiddenPaymentReference = "payment" + "Key";
    const harness = createHarness({
      launcherUsesLoader: true,
      requestPaymentError: {
        code: "NOT_SUPPORTED_WIDGET_KEY",
        message: `API 개별 연동 키를 사용해주세요. ${hiddenSecretKey} ${hiddenClientKey} ${hiddenPaymentReference}`,
      },
    });

    const failure = expectFailure(
      await launcherModule.runDevTossCheckout(harness.runtime),
    );

    expect(failure.detail).toEqual({
      stage: "request_payment",
      errorCode: "NOT_SUPPORTED_WIDGET_KEY",
      errorMessage:
        "API 개별 연동 키를 사용해주세요. [masked_key] [masked_key] [masked]",
    });
    expect(harness.requestPayment).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(failure)).not.toContain(hiddenSecretKey);
    expect(JSON.stringify(failure)).not.toContain(hiddenClientKey);
    expect(JSON.stringify(failure)).not.toContain(hiddenPaymentReference);
  });

  it("masks insecure key usage details safely", async () => {
    const launcherModule = await importLauncherModule(true);
    const hiddenSecretKey = "test" + "_sk_" + "abcdefghijklmnopqrstuvwxyz";
    const harness = createHarness({
      launcherUsesLoader: true,
      requestPaymentError: {
        code: "INSECURE_KEY_USAGE",
        message: `${hiddenSecretKey} should not be exposed`,
      },
    });

    const failure = expectFailure(
      await launcherModule.runDevTossCheckout(harness.runtime),
    );

    expect(failure.detail).toEqual({
      stage: "request_payment",
      errorCode: "INSECURE_KEY_USAGE",
      errorMessage: "[masked_key] should not be exposed",
    });
    expect(JSON.stringify(failure)).not.toContain(hiddenSecretKey);
  });

  it("returns a safe error when launcher execution fails", async () => {
    const launcherModule = await importLauncherModule(true);
    const harness = createHarness({
      launcherSucceeds: false,
    });

    const result = await launcherModule.runDevTossCheckout(harness.runtime);

    const failure = expectFailure(result);

    expect(failure.messageKo).toBe(
      "Toss 결제창 테스트를 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.",
    );
    expect(failure.detail).toEqual({
      stage: "request_payment",
      errorCode: "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED",
      errorMessage: "Toss 결제창을 열지 못했습니다.",
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
      "UNKNOWN_TOSS_CHECKOUT_ERROR",
      "prepare_api",
      "sdk_load",
      "request_payment",
      "오류 코드",
      "오류 메시지",
      "[masked_key]",
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
