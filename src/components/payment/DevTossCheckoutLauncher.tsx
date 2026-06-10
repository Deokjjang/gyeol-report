"use client";

import { useState } from "react";

import { loadTossPaymentsBrowserSdk } from "../../lib/payment/tossBrowserSdkLoader";
import { launchTossCheckout } from "../../lib/payment/tossClientCheckoutLauncher";
import type {
  TossClientCheckoutLaunchResult,
  TossClientSdkLoader,
} from "../../lib/payment/tossClientCheckoutTypes";

const DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED =
  process.env.NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED === "1";
const DEV_TOSS_CHECKOUT_CUSTOMER_KEY = "gyeol_local_test_customer";
const DEV_TOSS_CHECKOUT_ERROR_MESSAGE =
  "Toss 결제창 테스트를 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.";

const devTossCheckoutPrepareBody = {
  provider: "toss",
  productType: "saju_mbti_full",
  inputSnapshot: {
    mbti: "ENTJ",
    gender: "FEMALE",
    timezone: "Asia/Seoul",
    birthDate: "1996-12-06",
    birthTime: "14:15",
    calendarType: "SOLAR",
    birthTimeUnknown: false,
  },
} as const;

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

export type DevTossCheckoutLauncherResult =
  | {
      readonly ok: true;
      readonly status: "redirect_requested";
    }
  | {
      readonly ok: false;
      readonly messageKo: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createFailureResult(): DevTossCheckoutLauncherResult {
  return {
    ok: false,
    messageKo: DEV_TOSS_CHECKOUT_ERROR_MESSAGE,
  };
}

const defaultRuntime = {
  fetch: (input, init) => fetch(input, init),
  launchTossCheckout,
  loadTossPayments: loadTossPaymentsBrowserSdk,
} satisfies DevTossCheckoutLauncherRuntime;

export async function runDevTossCheckout(
  runtime: DevTossCheckoutLauncherRuntime = defaultRuntime,
): Promise<DevTossCheckoutLauncherResult> {
  let response: DevTossCheckoutFetchResponse;

  try {
    response = await runtime.fetch("/api/payment-checkout/prepare", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(devTossCheckoutPrepareBody),
    });
  } catch {
    return createFailureResult();
  }

  let body: unknown;

  try {
    body = await response.json();
  } catch {
    return createFailureResult();
  }

  if (
    !response.ok ||
    !isRecord(body) ||
    body.ok !== true ||
    !isRecord(body.tossCheckoutRequest)
  ) {
    return createFailureResult();
  }

  const launchResult = await runtime.launchTossCheckout({
    tossCheckoutRequest: body.tossCheckoutRequest,
    // TODO: production customerKey must be stable and non-guessable.
    customerKey: DEV_TOSS_CHECKOUT_CUSTOMER_KEY,
    loadTossPayments: runtime.loadTossPayments,
  });

  if (!launchResult.ok) {
    return createFailureResult();
  }

  return {
    ok: true,
    status: "redirect_requested",
  };
}

export default function DevTossCheckoutLauncher() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  if (!DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED) {
    return null;
  }

  async function handleLaunch() {
    if (isLaunching) {
      return;
    }

    setIsLaunching(true);
    setErrorMessage("");
    setStatusMessage("");

    const result = await runDevTossCheckout();

    if (!result.ok) {
      setErrorMessage(result.messageKo);
      setIsLaunching(false);
      return;
    }

    setStatusMessage("Toss 결제창 요청을 보냈습니다.");
    setIsLaunching(false);
  }

  return (
    <section className="space-y-4 rounded-lg border border-sky-900/50 bg-sky-950/20 p-4">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-sky-100">
          Toss 결제창 테스트
        </p>
        <p className="text-sm leading-6 text-sky-100/80">
          실제 결제 승인(confirm)은 아직 연결되지 않았습니다.
        </p>
        <p className="text-sm leading-6 text-sky-100/80">
          결제 성공 후 임시 success 페이지로 돌아옵니다.
        </p>
      </div>
      <button
        type="button"
        disabled={isLaunching}
        onClick={() => void handleLaunch()}
        className="w-full rounded-lg border border-sky-800/70 bg-neutral-950 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-500 disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-500"
      >
        {isLaunching ? "Toss 결제창 여는 중..." : "Toss 결제창 열기"}
      </button>
      {errorMessage ? (
        <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-3 text-sm leading-6 text-red-100">
          {errorMessage}
        </p>
      ) : null}
      {statusMessage ? (
        <p className="rounded-lg border border-sky-900/60 bg-sky-950/30 p-3 text-sm leading-6 text-sky-100">
          {statusMessage}
        </p>
      ) : null}
    </section>
  );
}
