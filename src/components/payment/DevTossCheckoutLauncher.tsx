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
  "결제창을 시작하지 못했습니다. 환경값을 확인한 뒤 다시 시도해 주세요.";
const REQUIRED_CHECKOUT_INPUT_MESSAGE_KO =
  "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.";
const REQUIRED_CONFIRMATION_MESSAGE_KO =
  "결제 전 필수 확인 항목에 모두 동의해 주세요.";
const UNDER_14_BLOCK_MESSAGE_KO =
  "만 14세 미만은 법정대리인 동의 확인 절차 없이 서비스를 이용할 수 없습니다. 현재 버전에서는 만 14세 이상만 이용할 수 있습니다.";
const MINOR_NOTICE_MESSAGE_KO =
  "미성년자는 법정대리인 동의가 필요하며, 동의가 없는 경우 본인 또는 법정대리인이 계약을 취소할 수 있습니다.";

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
  readonly onEditInput?: () => void;
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

export type DevTossCheckoutLegalConfirmations = {
  readonly inputAccuracy: boolean;
  readonly digitalReportStart: boolean;
  readonly refundRestriction: boolean;
  readonly policyAgreement: boolean;
  readonly age14OrOlder: boolean;
  readonly minorLegalRepresentative: boolean;
};

export type DevTossCheckoutAgeGateStatus =
  | "adult"
  | "minor"
  | "under_14"
  | "invalid_birthdate";

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

export const emptyDevTossCheckoutLegalConfirmations = {
  inputAccuracy: false,
  digitalReportStart: false,
  refundRestriction: false,
  policyAgreement: false,
  age14OrOlder: false,
  minorLegalRepresentative: false,
} as const satisfies DevTossCheckoutLegalConfirmations;

export const confirmedAdultDevTossCheckoutLegalConfirmations = {
  inputAccuracy: true,
  digitalReportStart: true,
  refundRestriction: true,
  policyAgreement: true,
  age14OrOlder: true,
  minorLegalRepresentative: false,
} as const satisfies DevTossCheckoutLegalConfirmations;

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
    (inputSnapshot.displayName ?? "").trim().length > 0 &&
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

function parseBirthDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

export function calculateDevTossCheckoutAge(
  birthDate: string,
  asOfDate: Date,
): number | null {
  const parsedBirthDate = parseBirthDate(birthDate);

  if (!parsedBirthDate) {
    return null;
  }

  let age = asOfDate.getUTCFullYear() - parsedBirthDate.getUTCFullYear();
  const monthDiff = asOfDate.getUTCMonth() - parsedBirthDate.getUTCMonth();
  const dayDiff = asOfDate.getUTCDate() - parsedBirthDate.getUTCDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age;
}

export function getDevTossCheckoutAgeGateStatus(
  birthDate: string,
  asOfDate: Date = new Date(),
): DevTossCheckoutAgeGateStatus {
  const age = calculateDevTossCheckoutAge(birthDate, asOfDate);

  if (age === null) {
    return "invalid_birthdate";
  }

  if (age < 14) {
    return "under_14";
  }

  if (age < 19) {
    return "minor";
  }

  return "adult";
}

export function isDevTossCheckoutLegalConfirmationComplete(
  inputSnapshot: DevTossCheckoutInputSnapshot,
  confirmations: DevTossCheckoutLegalConfirmations,
  asOfDate: Date = new Date(),
): boolean {
  if (!isDevTossCheckoutInputComplete(inputSnapshot)) {
    return false;
  }

  const ageGateStatus = getDevTossCheckoutAgeGateStatus(
    inputSnapshot.birthDate,
    asOfDate,
  );

  if (ageGateStatus === "under_14" || ageGateStatus === "invalid_birthdate") {
    return false;
  }

  const requiredBaseConfirmations =
    confirmations.inputAccuracy &&
    confirmations.digitalReportStart &&
    confirmations.refundRestriction &&
    confirmations.policyAgreement &&
    confirmations.age14OrOlder;

  if (!requiredBaseConfirmations) {
    return false;
  }

  return ageGateStatus === "minor"
    ? confirmations.minorLegalRepresentative
    : true;
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
  legalConfirmations: DevTossCheckoutLegalConfirmations,
  runtime: DevTossCheckoutLauncherRuntime = defaultRuntime,
): Promise<DevTossCheckoutLauncherResult> {
  if (!isDevTossCheckoutInputComplete(inputSnapshot)) {
    return createFailureResult({
      stage: "input_validation",
      errorCode: "REPORT_INPUT_REQUIRED",
      errorMessage: REQUIRED_CHECKOUT_INPUT_MESSAGE_KO,
    });
  }

  if (
    getDevTossCheckoutAgeGateStatus(inputSnapshot.birthDate) === "under_14"
  ) {
    return createFailureResult({
      stage: "input_validation",
      errorCode: "REPORT_USER_UNDER_14",
      errorMessage: UNDER_14_BLOCK_MESSAGE_KO,
    });
  }

  if (
    !isDevTossCheckoutLegalConfirmationComplete(
      inputSnapshot,
      legalConfirmations,
    )
  ) {
    return createFailureResult({
      stage: "input_validation",
      errorCode: "REPORT_LEGAL_CONFIRMATION_REQUIRED",
      errorMessage: REQUIRED_CONFIRMATION_MESSAGE_KO,
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
  onEditInput,
}: DevTossCheckoutLauncherProps) {
  const [isLaunching, setIsLaunching] = useState(false);
  const [legalConfirmations, setLegalConfirmations] =
    useState<DevTossCheckoutLegalConfirmations>(
      emptyDevTossCheckoutLegalConfirmations,
    );
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetail, setErrorDetail] =
    useState<DevTossCheckoutErrorDetail | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  if (!DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED) {
    return null;
  }

  const isInputComplete = isDevTossCheckoutInputComplete(inputSnapshot);
  const ageGateStatus = getDevTossCheckoutAgeGateStatus(inputSnapshot.birthDate);
  const isUnder14Blocked = ageGateStatus === "under_14";
  const shouldShowMinorNotice = ageGateStatus === "minor";
  const isLegalConfirmationComplete =
    isDevTossCheckoutLegalConfirmationComplete(
      inputSnapshot,
      legalConfirmations,
    );
  const canLaunchCheckout =
    isInputComplete && !isUnder14Blocked && isLegalConfirmationComplete;

  function updateLegalConfirmation(
    field: keyof DevTossCheckoutLegalConfirmations,
    checked: boolean,
  ) {
    setLegalConfirmations((current) => ({
      ...current,
      [field]: checked,
    }));
  }

  async function handleLaunch() {
    if (isLaunching || !canLaunchCheckout) {
      return;
    }

    setIsLaunching(true);
    setErrorMessage("");
    setErrorDetail(null);
    setStatusMessage("");

    const result = await runDevTossCheckout(
      inputSnapshot,
      legalConfirmations,
    );

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
    <section className="space-y-5 rounded-lg border-2 border-sky-400 bg-sky-50 p-4 text-neutral-950 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-bold text-sky-900">결제 직전 확인</p>
        <p className="text-sm leading-6 text-sky-800">
          아래 입력값과 거래조건을 확인한 뒤 결제창으로 이동합니다.
        </p>
      </div>

      <section className="space-y-3 rounded-lg border border-sky-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-base font-extrabold text-neutral-950">
            입력값 최종 확인
          </h3>
          {onEditInput ? (
            <button
              type="button"
              onClick={onEditInput}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-bold text-neutral-800 transition hover:bg-neutral-50"
            >
              입력값 수정하기
            </button>
          ) : null}
        </div>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <ReviewRow labelKo="이름" valueKo={inputSnapshot.displayName ?? ""} />
          <ReviewRow labelKo="생년월일" valueKo={inputSnapshot.birthDate} />
          <ReviewRow
            labelKo="출생시간"
            valueKo={
              inputSnapshot.birthTimeUnknown
                ? "출생시간 모름"
                : inputSnapshot.birthTime
            }
          />
          <ReviewRow labelKo="성별" valueKo={formatCheckoutGender(inputSnapshot.gender)} />
          <ReviewRow labelKo="MBTI" valueKo={inputSnapshot.mbti} />
        </dl>
      </section>

      <section className="space-y-3 rounded-lg border border-sky-200 bg-white p-4">
        <h3 className="text-base font-extrabold text-neutral-950">결제 정보</h3>
        <dl className="grid gap-3 text-sm">
          <ReviewRow labelKo="상품명" valueKo="사주×MBTI 종합 리포트" />
          <ReviewRow labelKo="정가" valueKo="1,290원" />
          <ReviewRow labelKo="런칭가" valueKo="990원" />
          <ReviewRow labelKo="총 결제금액" valueKo="990원" />
          <ReviewRow labelKo="제공 방식" valueKo="결제 후 온라인 열람" />
        </dl>
      </section>

      <section className="space-y-3 rounded-lg border border-sky-200 bg-white p-4">
        <h3 className="text-base font-extrabold text-neutral-950">
          서비스 제공 방식
        </h3>
        <ul className="space-y-2 text-sm leading-6 text-neutral-700">
          <li>상품 유형: 자동 생성 디지털 리포트</li>
          <li>생성 방식: 입력값 기반 자동 생성 디지털 리포트</li>
          <li>상담 여부: 사람 상담 아님</li>
          <li>열람 방식: 결제 후 온라인 열람</li>
        </ul>
      </section>

      <section className="space-y-3 rounded-lg border border-sky-200 bg-white p-4">
        <h3 className="text-base font-extrabold text-neutral-950">
          환불 및 청약철회 안내
        </h3>
        <p className="text-sm leading-6 text-neutral-700">
          결제 완료 후 온라인 열람형 디지털 리포트 생성 절차가 시작됩니다.
          생성 시작 후 단순 변심 환불 제한 가능성이 있으며, 장애·중복결제·결과
          미제공·법령상 취소 사유는 예외로 확인합니다.
        </p>
      </section>

      <section className="space-y-3 rounded-lg border border-sky-200 bg-white p-4">
        <h3 className="text-base font-extrabold text-neutral-950">
          미성년자 안내
        </h3>
        {isUnder14Blocked ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-bold leading-6 text-red-800">
            {UNDER_14_BLOCK_MESSAGE_KO}
          </p>
        ) : (
          <p className="text-sm leading-6 text-neutral-700">
            만 14세 이상만 이용할 수 있습니다. 만 19세 미만 사용자는
            법정대리인 동의가 필요할 수 있습니다.
          </p>
        )}
        {shouldShowMinorNotice ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
            {MINOR_NOTICE_MESSAGE_KO}
          </p>
        ) : null}
      </section>

      <section className="space-y-4 rounded-lg border border-sky-200 bg-white p-4">
        <h3 className="text-base font-extrabold text-neutral-950">
          약관 및 개인정보 동의
        </h3>
        <nav aria-label="결제 전 정책 링크" className="flex flex-wrap gap-3 text-sm">
          <a href="/terms" className="font-bold text-neutral-900 underline underline-offset-4">
            이용약관
          </a>
          <a href="/privacy" className="font-bold text-neutral-900 underline underline-offset-4">
            개인정보처리방침
          </a>
          <a href="/refund" className="font-bold text-neutral-900 underline underline-offset-4">
            환불정책
          </a>
          <a href="/business" className="font-bold text-neutral-900 underline underline-offset-4">
            사업자정보
          </a>
        </nav>
        <div className="space-y-3">
          <ConfirmationCheckbox
            checked={legalConfirmations.inputAccuracy}
            labelKo="[필수] 입력한 정보가 정확하며, 결제 후 입력값을 기준으로 리포트 생성이 진행되는 것을 확인했습니다."
            onChange={(checked) =>
              updateLegalConfirmation("inputAccuracy", checked)
            }
          />
          <ConfirmationCheckbox
            checked={legalConfirmations.digitalReportStart}
            labelKo="[필수] 결제 완료 후 온라인 열람형 디지털 리포트 생성 절차가 시작되는 것을 확인했습니다."
            onChange={(checked) =>
              updateLegalConfirmation("digitalReportStart", checked)
            }
          />
          <ConfirmationCheckbox
            checked={legalConfirmations.refundRestriction}
            labelKo="[필수] 생성 시작 후 단순 변심에 의한 환불이 제한될 수 있으며, 장애·중복결제·결과 미제공·법령상 취소 사유는 예외임을 확인했습니다."
            onChange={(checked) =>
              updateLegalConfirmation("refundRestriction", checked)
            }
          />
          <ConfirmationCheckbox
            checked={legalConfirmations.policyAgreement}
            labelKo="[필수] 이용약관, 개인정보처리방침, 환불정책을 확인하고 동의합니다."
            onChange={(checked) =>
              updateLegalConfirmation("policyAgreement", checked)
            }
          />
          <ConfirmationCheckbox
            checked={legalConfirmations.age14OrOlder}
            disabled={isUnder14Blocked}
            labelKo="[필수] 만 14세 이상입니다."
            onChange={(checked) =>
              updateLegalConfirmation("age14OrOlder", checked)
            }
          />
          {shouldShowMinorNotice ? (
            <ConfirmationCheckbox
              checked={legalConfirmations.minorLegalRepresentative}
              labelKo="[필수] 미성년자는 법정대리인 동의가 필요하며, 동의가 없는 경우 본인 또는 법정대리인이 계약을 취소할 수 있음을 확인했습니다."
              onChange={(checked) =>
                updateLegalConfirmation("minorLegalRepresentative", checked)
              }
            />
          ) : null}
        </div>
      </section>

      {!isInputComplete ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          {REQUIRED_CHECKOUT_INPUT_MESSAGE_KO}
        </p>
      ) : null}
      {isInputComplete && !isUnder14Blocked && !isLegalConfirmationComplete ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          {REQUIRED_CONFIRMATION_MESSAGE_KO}
        </p>
      ) : null}
      <button
        type="button"
        disabled={isLaunching || !canLaunchCheckout}
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

function formatCheckoutGender(value: string): string {
  if (value === "MALE") {
    return "남성";
  }

  if (value === "FEMALE") {
    return "여성";
  }

  return "";
}

function ReviewRow({
  labelKo,
  valueKo,
}: {
  readonly labelKo: string;
  readonly valueKo: string;
}) {
  return (
    <div className="flex justify-between gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <dt className="font-semibold text-neutral-500">{labelKo}</dt>
      <dd className="text-right font-bold text-neutral-950">
        {valueKo.trim() || "미입력"}
      </dd>
    </div>
  );
}

function ConfirmationCheckbox({
  checked,
  disabled = false,
  labelKo,
  onChange,
}: {
  readonly checked: boolean;
  readonly disabled?: boolean;
  readonly labelKo: string;
  readonly onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm font-semibold leading-6 text-neutral-800">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0"
      />
      <span>{labelKo}</span>
    </label>
  );
}
