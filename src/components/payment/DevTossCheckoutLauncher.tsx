"use client";

import { useId, useRef, useState } from "react";
import { createCheckoutConsentAssertion, calculateCheckoutAge, getCheckoutAgeGateStatus, type CheckoutLegalConfirmations, type CheckoutAgeGateStatus } from "../../lib/payment/checkoutConsent";
import styles from "./paidFunnel.module.css";
import { getReportProduct } from "../../lib/payment/reportProductCatalog";

import { prePaymentPrivacyNoticeKo } from "../../lib/legal/privacyPolicy";
import { prePaymentRefundNoticeKo } from "../../lib/legal/refundPolicy";
import type { ReportProductType } from "../../lib/payment/reportProductTypes";
import { loadTossPaymentsBrowserSdk } from "../../lib/payment/tossBrowserSdkLoader";
import { isSupportedEasyPay, launchTossCheckout } from "../../lib/payment/tossClientCheckoutLauncher";
import type { SupportedEasyPay, TossClientCheckoutLaunchResult, TossClientSdkLoader } from "../../lib/payment/tossClientCheckoutTypes";

const DEV_TOSS_CHECKOUT_CUSTOMER_KEY = "gyeol_local_test_customer";
const DEV_TOSS_CHECKOUT_ERROR_MESSAGE =
  "결제창을 시작하지 못했습니다. 잠시 후 다시 시도해 주세요.";
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
  readonly reportInputPayload?: unknown;
};

type DevTossCheckoutLauncherProps = {
  readonly inputSnapshot: DevTossCheckoutInputSnapshot;
  readonly productType?: ReportProductType;
  readonly productLabelKo?: string;
  readonly ctaLabelKo?: string;
  readonly disabled?: boolean;
  readonly disabledMessageKo?: string;
  readonly onEditInput?: () => void;
  readonly reviewGroups?: readonly {
    readonly titleKo?: string;
    readonly rows: readonly { readonly labelKo: string; readonly valueKo: string }[];
  }[];
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

type DevTossCheckoutRunOptions = {
  readonly productType?: ReportProductType;
  readonly easyPay: SupportedEasyPay;
};

export type DevTossCheckoutLegalConfirmations = CheckoutLegalConfirmations;
export type DevTossCheckoutAgeGateStatus = CheckoutAgeGateStatus;

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

function createFailureResult(
  messageKo = DEV_TOSS_CHECKOUT_ERROR_MESSAGE,
): DevTossCheckoutLauncherResult {
  return {
    ok: false,
    messageKo,
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

export function isDevTossCheckoutInputComplete(
  inputSnapshot: DevTossCheckoutInputSnapshot,
): boolean {
  const hasRequiredText =
    (inputSnapshot.displayName ?? "").trim().length > 0 &&
    inputSnapshot.birthDate.trim().length > 0 &&
    inputSnapshot.calendarType.trim().length > 0 &&
    inputSnapshot.timezone.trim().length > 0;

  return hasRequiredText;
}

export const calculateDevTossCheckoutAge = calculateCheckoutAge;
export const getDevTossCheckoutAgeGateStatus = getCheckoutAgeGateStatus;

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

const defaultRuntime = {
  fetch: (input, init) => fetch(input, init),
  launchTossCheckout,
  loadTossPayments: loadTossPaymentsBrowserSdk,
} satisfies DevTossCheckoutLauncherRuntime;

export async function runDevTossCheckout(
  inputSnapshot: DevTossCheckoutInputSnapshot,
  legalConfirmations: DevTossCheckoutLegalConfirmations,
  runtime: DevTossCheckoutLauncherRuntime = defaultRuntime,
  options: DevTossCheckoutRunOptions,
): Promise<DevTossCheckoutLauncherResult> {
  if (!isSupportedEasyPay(options?.easyPay)) {
    return createFailureResult();
  }
  if (!isDevTossCheckoutInputComplete(inputSnapshot)) {
    return createFailureResult(REQUIRED_CHECKOUT_INPUT_MESSAGE_KO);
  }

  if (
    getDevTossCheckoutAgeGateStatus(inputSnapshot.birthDate) === "under_14"
  ) {
    return createFailureResult(UNDER_14_BLOCK_MESSAGE_KO);
  }

  if (
    !isDevTossCheckoutLegalConfirmationComplete(
      inputSnapshot,
      legalConfirmations,
    )
  ) {
    return createFailureResult(REQUIRED_CONFIRMATION_MESSAGE_KO);
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
        productType: options.productType ?? "saju_mbti_full",
        inputSnapshot,
        consent: createCheckoutConsentAssertion(legalConfirmations),
      }),
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
    return createFailureResult(isRecord(body) && isRecord(body.error) && body.error.message === "필수 항목을 확인해 주세요."
      ? "필수 항목을 확인해 주세요." : DEV_TOSS_CHECKOUT_ERROR_MESSAGE);
  }

  let launchResult: TossClientCheckoutLaunchResult;

  try {
    launchResult = await runtime.launchTossCheckout({
      tossCheckoutRequest: body.tossCheckoutRequest,
      // TODO: production customerKey must be stable and non-guessable.
      customerKey: DEV_TOSS_CHECKOUT_CUSTOMER_KEY,
      easyPay: options.easyPay,
      loadTossPayments: runtime.loadTossPayments,
    });
  } catch {
    return createFailureResult();
  }

  if (!launchResult.ok) {
    return createFailureResult();
  }

  return {
    ok: true,
    status: "redirect_requested",
  };
}

export default function DevTossCheckoutLauncher({
  inputSnapshot,
  productType = "saju_mbti_full",
  productLabelKo = "사주×MBTI 종합 리포트",
  disabled = false,
  disabledMessageKo = REQUIRED_CHECKOUT_INPUT_MESSAGE_KO,
  onEditInput,
  reviewGroups,
}: DevTossCheckoutLauncherProps) {
  const noticeId = useId();
  const priceLabel = getReportProduct(productType)?.priceLabelKo ?? "";
  const [isLaunching, setIsLaunching] = useState(false);
  const launchInFlight = useRef(false);
  const [legalConfirmations, setLegalConfirmations] =
    useState<DevTossCheckoutLegalConfirmations>(
      emptyDevTossCheckoutLegalConfirmations,
    );
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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
    !disabled && isInputComplete && !isUnder14Blocked && isLegalConfirmationComplete;

  function updateLegalConfirmation(
    field: keyof DevTossCheckoutLegalConfirmations,
    checked: boolean,
  ) {
    setLegalConfirmations((current) => ({
      ...current,
      [field]: checked,
    }));
  }

  async function handleLaunch(easyPay: SupportedEasyPay) {
    if (launchInFlight.current || isLaunching || !canLaunchCheckout) {
      return;
    }

    launchInFlight.current = true;
    setIsLaunching(true);
    setErrorMessage("");
    setStatusMessage("");

    const result = await runDevTossCheckout(
      inputSnapshot,
      legalConfirmations,
      defaultRuntime,
      { productType, easyPay },
    );

    if (!result.ok) {
      launchInFlight.current = false;
      setErrorMessage(result.messageKo);
      setIsLaunching(false);
      return;
    }

    setStatusMessage("Toss 결제창 요청을 보냈습니다.");
    // Keep both methods locked while the successful redirect is pending.
  }

  const reviewReady = isInputComplete && !disabled;
  const fallbackReviewRows = [
    { labelKo: "이름", valueKo: inputSnapshot.displayName ?? "" },
    { labelKo: "생년월일", valueKo: inputSnapshot.birthDate },
    { labelKo: "출생시간", valueKo: inputSnapshot.birthTimeUnknown ? "출생시간 모름" : inputSnapshot.birthTime },
    { labelKo: "성별", valueKo: formatCheckoutGender(inputSnapshot.gender) },
    { labelKo: "MBTI", valueKo: inputSnapshot.mbti },
  ];
  const groups = reviewGroups ?? [{ rows: fallbackReviewRows }];

  if (!reviewReady) {
    return (
      <p className={styles.pendingReview} role="status" data-checkout-ready="false">
        필수 정보를 입력하면 결제 전 내용을 확인할 수 있습니다.
      </p>
    );
  }

  return (
    <section className={styles.review} aria-label="결제 직전 확인" data-checkout-ready="true">
      <div className={styles.reviewHeader}>
        <h2>최종 확인</h2>
        {onEditInput ? (
          <button type="button" onClick={onEditInput} className={styles.edit}>입력값 수정하기</button>
        ) : null}
      </div>
      <div className={styles.reviewBody}>
        <section aria-label="입력값 최종 확인">
          <div className={styles.reviewGroups}>
            {groups.map((group, index) => (
              <div key={group.titleKo ?? index}>
                {group.titleKo ? <h3>{group.titleKo}</h3> : null}
                <dl>{group.rows.map((row) => <ReviewRow key={row.labelKo} {...row} />)}</dl>
              </div>
            ))}
          </div>
        </section>
        <dl className={styles.orderSummary}>
          <div><dt>상품</dt><dd>{productLabelKo}</dd></div>
          <div><dt>총 결제금액</dt><dd>{priceLabel}</dd></div>
        </dl>
        <section>
          <h3>서비스 제공 방식</h3>
          <ul>
            <li>입력값 기반 자동 생성 디지털 리포트 · 사람 상담 아님</li>
            <li>결제 완료 후 즉시 생성, 최대 24시간 이내 제공</li>
            <li>생성일로부터 90일 · 결제 후 온라인 열람</li>
          </ul>
          {productType === "saju_mbti_compatibility" ? <p>상담이나 예언이 아닌 관계 분석용 디지털 리포트입니다.</p> : null}
        </section>
        <section>
          <h3>환불 및 청약철회 안내</h3>
          <p>{prePaymentRefundNoticeKo}</p>
          <a href="/refund" className={styles.policyLink}>환불정책 자세히 보기</a>
        </section>
        <fieldset className={styles.consents}>
          <legend>약관 및 개인정보 동의</legend>
          <p>{prePaymentPrivacyNoticeKo}</p>
          <p>만 14세 이상만 이용할 수 있습니다. 만 19세 미만 사용자는 법정대리인 동의가 필요할 수 있습니다.</p>
          {isUnder14Blocked ? <p role="alert" className={styles.error}>{UNDER_14_BLOCK_MESSAGE_KO}</p> : null}
          {shouldShowMinorNotice ? <p>{MINOR_NOTICE_MESSAGE_KO}</p> : null}
          <div>
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
          <nav aria-label="결제 전 정책 링크" className={styles.policyLinks}>
            <a href="/terms">이용약관</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/refund">환불정책</a>
            <a href="/business">사업자정보</a>
          </nav>
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
        </fieldset>
      </div>
      <p id={noticeId} className={styles.notice} aria-live="polite">
        {!isInputComplete
          ? REQUIRED_CHECKOUT_INPUT_MESSAGE_KO
          : disabled
            ? disabledMessageKo
            : isUnder14Blocked
              ? "만 14세 이상만 결제할 수 있습니다."
              : !isLegalConfirmationComplete
                ? REQUIRED_CONFIRMATION_MESSAGE_KO
                : "입력 정보와 결제금액을 확인했습니다. 결제를 진행해 주세요."}
      </p>
      <div className={styles.paymentMethods} aria-label="간편결제 선택" aria-busy={isLaunching}>
        {([
          { easyPay: "TOSSPAY", label: "토스페이로 결제" },
          { easyPay: "KAKAOPAY", label: "카카오페이로 결제" },
        ] as const).map(({ easyPay, label }) => (
          <button
            key={easyPay}
            type="button"
            data-easy-pay={easyPay}
            disabled={isLaunching || !canLaunchCheckout}
            aria-describedby={noticeId}
            onClick={() => void handleLaunch(easyPay)}
            className={styles.submit}
          >
            {isLaunching ? "Toss 결제창 여는 중..." : label}
            <span aria-hidden="true">→</span>
          </button>
        ))}
      </div>
      {errorMessage ? <p role="alert" className={styles.error}>{errorMessage}</p> : null}
      {statusMessage ? <p role="status" className={styles.notice}>{statusMessage}</p> : null}
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
    <div className={styles.reviewRow}>
      <dt>{labelKo}</dt>
      <dd>
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
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        aria-required="true"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-4 w-4 shrink-0"
      />
      <span>{labelKo}</span>
    </label>
  );
}
