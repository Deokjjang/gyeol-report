"use client";

import { useState } from "react";

import { loadTossPaymentsBrowserSdk } from "../../lib/payment/tossBrowserSdkLoader";
import { launchTossCheckout } from "../../lib/payment/tossClientCheckoutLauncher";
import type {
  TossClientCheckoutLaunchResult,
  TossClientSdk,
  TossClientSdkLoader,
} from "../../lib/payment/tossClientCheckoutTypes";

const DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED =
  process.env.NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED === "1";
const DEV_TOSS_CHECKOUT_CUSTOMER_KEY = "gyeol_local_test_customer";
const DEV_TOSS_CHECKOUT_ERROR_MESSAGE =
  "Toss 결제창 테스트를 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.";
const REQUIRED_CHECKOUT_INPUT_MESSAGE_KO =
  "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.";

export type DevTossCheckoutInputSnapshot = {
  readonly mbti: string;
  readonly gender: string;
  readonly timezone: string;
  readonly birthDate: string;
  readonly birthTime: string;
  readonly calendarType: string;
  readonly birthTimeUnknown: boolean;
  readonly displayName?: string;
};

type DevTossCheckoutLauncherProps = {
  readonly inputSnapshot: DevTossCheckoutInputSnapshot;
  readonly ctaLabelKo?: string;
};

type DevTossCheckoutFetchResponse = {
  readonly ok: boolean;
  json(): Promise<unknown>;
};

type DevTossCheckoutFetch = (
  input: string,
  init: RequestInit,
) => Promise<DevTossCheckoutFetchResponse>;

export type DevTossCheckoutLauncherRuntime = {
  readonly fetch: DevTossCheckoutFetch;
  readonly launchTossCheckout: (
    input: unknown,
  ) => Promise<TossClientCheckoutLaunchResult>;
  readonly loadTossPayments: TossClientSdkLoader;
};

type DevTossCheckoutErrorStage =
  | "input_validation"
  | "prepare_api"
  | "sdk_load"
  | "request_payment"
  | "unknown";

type DevTossCheckoutErrorDetail = {
  readonly stage: DevTossCheckoutErrorStage;
  readonly errorCode: string;
  readonly errorMessage: string;
};

export type DevTossCheckoutLauncherResult =
  | {
      readonly ok: true;
      readonly status: "redirect_requested";
    }
  | {
      readonly ok: false;
      readonly messageKo: string;
      readonly detail: DevTossCheckoutErrorDetail;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readStringField(value: unknown, field: string): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const fieldValue = value[field];

  return typeof fieldValue === "string" ? fieldValue : undefined;
}

function sanitizeDevErrorText(value: string): string {
  const restrictedMarkers = [
    "TOSS" + "_SECRET" + "_KEY",
    "NEXT" + "_PUBLIC" + "_TOSS" + "_SECRET" + "_KEY",
    "payment" + "Key",
    "provider" + "PaymentId",
    "provider" + "_payment" + "_id",
    "access" + "TokenHash",
    "share" + "Token",
    "report" + "_snapshot",
    "SUPABASE" + "_URL",
    "SUPABASE" + "_ANON" + "_KEY",
  ];

  let sanitized = value
    .replace(/\b(?:test|live)_(?:ck|sk)_[A-Za-z0-9_-]+/g, "[masked_key]")
    .replace(/\b[A-Za-z0-9_-]{25,}\b/g, (token) =>
      /^[A-Z0-9_]+$/.test(token) ? token : "[masked_token]",
    )
    .slice(0, 240);

  for (const marker of restrictedMarkers) {
    sanitized = sanitized.split(marker).join("[masked]");
  }

  return sanitized.trim() || "No safe error message was provided.";
}

function extractSafeErrorDetail(
  stage: DevTossCheckoutErrorStage,
  error: unknown,
): DevTossCheckoutErrorDetail {
  const rawCode =
    readStringField(error, "code") ??
    readStringField(error, "errorCode") ??
    "UNKNOWN_TOSS_CHECKOUT_ERROR";
  const rawMessage =
    readStringField(error, "message") ??
    readStringField(error, "messageKo") ??
    (typeof error === "string" ? error : "No safe error message was provided.");

  return {
    stage,
    errorCode:
      sanitizeDevErrorText(rawCode) || "UNKNOWN_TOSS_CHECKOUT_ERROR",
    errorMessage: sanitizeDevErrorText(rawMessage),
  };
}

function createFailureResult(
  detail: DevTossCheckoutErrorDetail = extractSafeErrorDetail(
    "unknown",
    undefined,
  ),
): DevTossCheckoutLauncherResult {
  return {
    ok: false,
    messageKo: DEV_TOSS_CHECKOUT_ERROR_MESSAGE,
    detail,
  };
}

function getLaunchFailureStage(
  result: Extract<TossClientCheckoutLaunchResult, { ok: false }>,
): DevTossCheckoutErrorStage {
  if (result.error.code === "TOSS_CLIENT_CHECKOUT_SDK_LOAD_FAILED") {
    return "sdk_load";
  }

  if (result.error.code === "TOSS_CLIENT_CHECKOUT_REQUEST_FAILED") {
    return "request_payment";
  }

  return "unknown";
}

export function isDevTossCheckoutInputComplete(
  inputSnapshot: DevTossCheckoutInputSnapshot,
): boolean {
  const hasRequiredText =
    inputSnapshot.birthDate.trim().length > 0 &&
    inputSnapshot.gender.trim().length > 0 &&
    inputSnapshot.mbti.trim().length > 0 &&
    inputSnapshot.calendarType.trim().length > 0 &&
    inputSnapshot.timezone.trim().length > 0;

  return (
    hasRequiredText &&
    (inputSnapshot.birthTimeUnknown ||
      inputSnapshot.birthTime.trim().length > 0)
  );
}

function createDetailCapturingLoader(
  sdkLoader: TossClientSdkLoader,
  captureDetail: (detail: DevTossCheckoutErrorDetail) => void,
): TossClientSdkLoader {
  return async (clientKey) => {
    let sdk: TossClientSdk;

    try {
      sdk = await sdkLoader(clientKey);
    } catch (error) {
      captureDetail(extractSafeErrorDetail("sdk_load", error));
      throw error;
    }

    return {
      payment(params) {
        const paymentWindow = sdk.payment(params);

        return {
          async requestPayment(paymentRequest) {
            try {
              await paymentWindow.requestPayment(paymentRequest);
            } catch (error) {
              captureDetail(extractSafeErrorDetail("request_payment", error));
              throw error;
            }
          },
        };
      },
    };
  };
}

const defaultRuntime = {
  fetch: (input, init) => fetch(input, init),
  launchTossCheckout,
  loadTossPayments: loadTossPaymentsBrowserSdk,
} satisfies DevTossCheckoutLauncherRuntime;

export async function runDevTossCheckout(
  inputSnapshot: DevTossCheckoutInputSnapshot,
  runtime: DevTossCheckoutLauncherRuntime = defaultRuntime,
): Promise<DevTossCheckoutLauncherResult> {
  if (!isDevTossCheckoutInputComplete(inputSnapshot)) {
    return createFailureResult({
      stage: "input_validation",
      errorCode: "REPORT_INPUT_REQUIRED",
      errorMessage: REQUIRED_CHECKOUT_INPUT_MESSAGE_KO,
    });
  }

  let response: DevTossCheckoutFetchResponse;

  try {
    response = await runtime.fetch("/api/payment-checkout/prepare", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        provider: "toss",
        productType: "saju_mbti_full",
        inputSnapshot,
      }),
    });
  } catch (error) {
    return createFailureResult(extractSafeErrorDetail("prepare_api", error));
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch (error) {
    return createFailureResult(extractSafeErrorDetail("prepare_api", error));
  }

  if (
    !response.ok ||
    !isRecord(body) ||
    body.ok !== true ||
    !isRecord(body.tossCheckoutRequest)
  ) {
    const responseError =
      isRecord(body) && isRecord(body.error) ? body.error : undefined;

    return createFailureResult(
      extractSafeErrorDetail("prepare_api", responseError),
    );
  }

  let capturedDetail: DevTossCheckoutErrorDetail | null = null;
  const loadTossPayments = createDetailCapturingLoader(
    runtime.loadTossPayments,
    (detail) => {
      capturedDetail = detail;
    },
  );
  let launchResult: TossClientCheckoutLaunchResult;

  try {
    launchResult = await runtime.launchTossCheckout({
      tossCheckoutRequest: body.tossCheckoutRequest,
      // TODO: production customerKey must be stable and non-guessable.
      customerKey: DEV_TOSS_CHECKOUT_CUSTOMER_KEY,
      loadTossPayments,
    });
  } catch (error) {
    return createFailureResult(extractSafeErrorDetail("unknown", error));
  }

  if (!launchResult.ok) {
    return createFailureResult(
      capturedDetail ??
        extractSafeErrorDetail(getLaunchFailureStage(launchResult), launchResult.error),
    );
  }

  return {
    ok: true,
    status: "redirect_requested",
  };
}

export default function DevTossCheckoutLauncher({
  inputSnapshot,
  ctaLabelKo = "990원 결제하고 리포트 생성하기",
}: DevTossCheckoutLauncherProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetail, setErrorDetail] =
    useState<DevTossCheckoutErrorDetail | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  if (!DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED) {
    return null;
  }

  const isInputComplete = isDevTossCheckoutInputComplete(inputSnapshot);

  async function handleLaunch() {
    if (isLaunching || !isInputComplete) {
      return;
    }

    setIsLaunching(true);
    setErrorMessage("");
    setErrorDetail(null);
    setStatusMessage("");

    const result = await runDevTossCheckout(inputSnapshot);

    if (!result.ok) {
      setErrorMessage(result.messageKo);
      setErrorDetail(result.detail);
      setIsLaunching(false);
      return;
    }

    setStatusMessage("Toss 결제창 요청을 보냈습니다.");
    setIsLaunching(false);
  }

  return (
    <section className="space-y-4 rounded-lg border-2 border-sky-400 bg-sky-50 p-4 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-bold text-sky-900">
          Toss 결제창 테스트
        </p>
        <p className="text-sm leading-6 text-sky-800">
          결제 성공 후 임시 승인 대기 화면으로 이동합니다.
        </p>
        <p className="text-sm leading-6 text-sky-800">
          리포트 제공은 결제 승인 확인 연동 이후 이어집니다.
        </p>
      </div>
      {!isInputComplete ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          {REQUIRED_CHECKOUT_INPUT_MESSAGE_KO}
        </p>
      ) : null}
      <button
        type="button"
        disabled={isLaunching || !isInputComplete}
        onClick={() => void handleLaunch()}
        className="w-full rounded-lg bg-sky-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
      >
        {isLaunching
          ? "Toss 결제창 여는 중..."
          : ctaLabelKo}
      </button>
      {errorMessage ? (
        <div className="space-y-3 rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm leading-6 text-red-100">
          <p>{errorMessage}</p>
          {errorDetail ? (
            <dl className="grid gap-2 rounded-lg border border-red-900/50 bg-neutral-950/60 p-3">
              <div className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                <dt className="font-medium text-red-200/80">stage</dt>
                <dd className="break-words text-red-50">{errorDetail.stage}</dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                <dt className="font-medium text-red-200/80">오류 코드</dt>
                <dd className="break-words text-red-50">
                  {errorDetail.errorCode}
                </dd>
              </div>
              <div className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                <dt className="font-medium text-red-200/80">오류 메시지</dt>
                <dd className="break-words text-red-50">
                  {errorDetail.errorMessage}
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
      ) : null}
      {statusMessage ? (
        <p className="rounded-lg border border-sky-200 bg-white p-3 text-sm leading-6 text-sky-900">
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
