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

async function importLauncherModule() {
  vi.resetModules();

  return import("../../../src/components/payment/DevTossCheckoutLauncher");
}

function createTossRequestDraft(): Record<string, unknown> {
  return {
    provider: "toss",
    clientKey: "test_client_key",
    requestPayment: {
      orderId: "provider_order_test_1",
      orderName: "사주×MBTI 종합 리포트",
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
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("DevTossCheckoutLauncher", () => {
  it("renders Toss widget launcher copy", async () => {
    const launcherModule = await importLauncherModule();
    const Component = launcherModule.default;

    const html = renderToStaticMarkup(
      <Component inputSnapshot={validInputSnapshot} />,
    );

    expect(html).toContain("결제 직전 확인");
    expect(html).toContain("입력값 최종 확인");
    expect(html).toContain("결제 정보");
    expect(html).toContain("서비스 제공 방식");
    expect(html).toContain("환불 및 청약철회 안내");
    expect(html).toContain("미성년자 안내");
    expect(html).toContain("약관 및 개인정보 동의");
    expect(html).toContain("이름");
    expect(html).toContain("민지");
    expect(html).toContain("생년월일");
    expect(html).toContain("2001-01-02");
    expect(html).toContain("출생시간");
    expect(html).toContain("08:30");
    expect(html).toContain("성별");
    expect(html).toContain("남성");
    expect(html).toContain("MBTI");
    expect(html).toContain("INFP");
    expect(html).toContain("상품명");
    expect(html).toContain("사주×MBTI 종합 리포트");
    expect(html).toContain("판매가");
    expect(html).toContain("1,290원");
    expect(html).toContain("총 결제금액");
    expect(html).toContain("90일");
    expect(html).toContain("결제 후 온라인 열람");
    expect(html).toContain("자동 생성 디지털 리포트");
    expect(html).toContain("생성 시작 후 단순 변심에 의한 환불이 제한될 수 있으며");
    expect(html).toContain("이용약관");
    expect(html).toContain("개인정보처리방침");
    expect(html).toContain("환불정책");
    expect(html).toContain("사업자정보");
    expect(html).toContain(
      "리포트 생성을 위해 이름 또는 닉네임, 생년월일, 출생시간, 성별, MBTI가 처리됩니다.",
    );
    expect(html).toContain("[필수] 만 14세 이상입니다.");
    expect(html).toContain("1,290원 결제하고 리포트 생성하기");
    expect(html).toContain("disabled");
  });

  it("uses the provided inputSnapshot in the checkout prepare request", async () => {
    const launcherModule = await importLauncherModule();
    const tossCheckoutRequest = createTossRequestDraft();
    const harness = createHarness({
      responseBody: {
        ok: true,
        tossCheckoutRequest,
      },
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
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
    const launcherModule = await importLauncherModule();
    const harness = createHarness();

    const result = await launcherModule.runDevTossCheckout(
      missingInputSnapshot,
      launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
      harness.runtime,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("expected input validation failure");
    }

    expect(result).toEqual({
      ok: false,
      messageKo: "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.",
    });
    expect(harness.fetchCalls).toHaveLength(0);
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("shows a missing input message for invalid input", async () => {
    const launcherModule = await importLauncherModule();
    const Component = launcherModule.default;

    const html = renderToStaticMarkup(
      <Component inputSnapshot={missingInputSnapshot} />,
    );

    expect(html).toContain(
      "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.",
    );
    expect(html).toContain("disabled");
  });

  it("blocks checkout until all legal confirmations are checked", async () => {
    const launcherModule = await importLauncherModule();
    const harness = createHarness();

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      launcherModule.emptyDevTossCheckoutLegalConfirmations,
      harness.runtime,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("expected legal confirmation failure");
    }

    expect(result).toEqual({
      ok: false,
      messageKo: "결제 전 필수 확인 항목에 모두 동의해 주세요.",
    });
    expect(harness.fetchCalls).toHaveLength(0);
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("calculates age gate with a deterministic date", async () => {
    const launcherModule = await importLauncherModule();
    const asOfDate = new Date(Date.UTC(2026, 5, 14));

    expect(
      launcherModule.getDevTossCheckoutAgeGateStatus("2012-06-14", asOfDate),
    ).toBe("minor");
    expect(
      launcherModule.getDevTossCheckoutAgeGateStatus("2012-06-15", asOfDate),
    ).toBe("under_14");
    expect(
      launcherModule.getDevTossCheckoutAgeGateStatus("2007-06-14", asOfDate),
    ).toBe("adult");
  });

  it("requires minor legal representative confirmation for users under 19", async () => {
    const launcherModule = await importLauncherModule();
    const asOfDate = new Date(Date.UTC(2026, 5, 14));
    const minorInputSnapshot = {
      ...validInputSnapshot,
      birthDate: "2010-01-02",
    } satisfies DevTossCheckoutInputSnapshot;

    expect(
      launcherModule.isDevTossCheckoutLegalConfirmationComplete(
        minorInputSnapshot,
        launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
        asOfDate,
      ),
    ).toBe(false);
    expect(
      launcherModule.isDevTossCheckoutLegalConfirmationComplete(
        minorInputSnapshot,
        {
          ...launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
          minorLegalRepresentative: true,
        },
        asOfDate,
      ),
    ).toBe(true);
  });

  it("renders under-14 block and minor legal notice", async () => {
    const launcherModule = await importLauncherModule();
    const Component = launcherModule.default;

    const under14Html = renderToStaticMarkup(
      <Component
        inputSnapshot={{
          ...validInputSnapshot,
          birthDate: "2020-01-02",
        }}
      />,
    );
    const minorHtml = renderToStaticMarkup(
      <Component
        inputSnapshot={{
          ...validInputSnapshot,
          birthDate: "2010-01-02",
        }}
      />,
    );

    expect(under14Html).toContain(
      "만 14세 미만은 법정대리인 동의 확인 절차 없이 서비스를 이용할 수 없습니다.",
    );
    expect(under14Html).toContain("현재 버전에서는 만 14세 이상만 이용할 수 있습니다.");
    expect(minorHtml).toContain("법정대리인 동의가 필요하며");
    expect(minorHtml).toContain(
      "동의가 없는 경우 본인 또는 법정대리인이 계약을 취소할 수 있음을 확인했습니다.",
    );
  });

  it("requires a Toss checkout request in the prepare API response", async () => {
    const launcherModule = await importLauncherModule();
    const harness = createHarness({
      responseBody: {
        ok: true,
      },
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
      harness.runtime,
    );

    expect(result.ok).toBe(false);
    expect(harness.launchInputs).toHaveLength(0);
  });

  it("returns only safe user copy when prepare API fails", async () => {
    const launcherModule = await importLauncherModule();
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
      launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
      harness.runtime,
    );

    expect(result.ok).toBe(false);

    if (result.ok) {
      throw new Error("expected prepare failure");
    }

    expect(result).toEqual({
      ok: false,
      messageKo: "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    });
    expect(JSON.stringify(result)).not.toContain(hiddenClientKey);
    expect(JSON.stringify(result)).not.toContain(hiddenSecretKey);
    expect(JSON.stringify(result)).not.toContain("PAYMENT_TOSS_CHECKOUT_CONFIG_MISSING");
    expect(JSON.stringify(result)).not.toContain("prepare_api");
  });

  it("keeps internal checkout error detail out of rendered user copy", () => {
    const forbiddenVisibleDetailMarkers = [
      ">stage<",
      "prepare_api",
      "오류 코드",
      "오류 메시지",
      "PAYMENT_CHECKOUT_PREPARE_CREATE_FAILED",
      "Checkout could not be prepared",
    ];

    expect(componentSource).toContain(
      "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.",
    );

    for (const marker of forbiddenVisibleDetailMarkers) {
      expect(componentSource).not.toContain(marker);
    }
  });

  it("allows retry after prepare failure without keeping stale UI state", () => {
    const retryMarkers = [
      "if (isLaunching || !canLaunchCheckout)",
      "setErrorMessage(\"\")",
      "setStatusMessage(\"\")",
      "setIsLaunching(false)",
    ];

    for (const marker of retryMarkers) {
      expect(componentSource).toContain(marker);
    }
  });

  it("launches through the injected Toss checkout boundary", async () => {
    const launcherModule = await importLauncherModule();
    const harness = createHarness({
      launcherUsesLoader: true,
    });

    const result = await launcherModule.runDevTossCheckout(
      validInputSnapshot,
      launcherModule.confirmedAdultDevTossCheckoutLegalConfirmations,
      harness.runtime,
    );

    expect(result.ok).toBe(true);
    expect(harness.requestPayment).toHaveBeenCalledTimes(1);
    expect(harness.launchInputs).toHaveLength(1);
  });

  it("keeps source scoped to checkout preparation only", () => {
    const requiredMarkers = [
      "DevTossCheckoutInputSnapshot",
      "inputSnapshot",
      "isDevTossCheckoutInputComplete",
      "productType",
      "입력값 최종 확인",
      "결제 정보",
      "서비스 제공 방식",
      "환불 및 청약철회 안내",
      "약관 및 개인정보 동의",
      "prePaymentPrivacyNoticeKo",
      "만 14세 미만",
      "법정대리인",
      "1,290원 결제하고 리포트 생성하기",
      "/api/payment-checkout/prepare",
      "launchTossCheckout",
      "loadTossPaymentsBrowserSdk",
      "gyeol_local_test_customer",
    ];
    const riskCopyMarkers = [
      "진단",
      "치료",
      "적중률",
      "100%",
      "보장",
      "반드시",
      "운명 확정",
    ];
    const blockedMarkers = [
      "1996-12-06",
      "ENTJ",
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

    for (const marker of riskCopyMarkers) {
      expect(componentSource).not.toContain(marker);
    }
  });
});
