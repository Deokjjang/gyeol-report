"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import DevTossCheckoutLauncher, {
  type DevTossCheckoutInputSnapshot,
  isDevTossCheckoutInputComplete,
} from "../../../components/payment/DevTossCheckoutLauncher";
import { GYEOL_PRODUCTS } from "../../../lib/product/gyeolProducts";

const ACTIVE_REPORT_PRODUCT = GYEOL_PRODUCTS[0];
const ACTIVE_REPORT_LIST_PRICE_LABEL_KO = "정가 1,290원";
const ACTIVE_REPORT_SALE_PRICE_LABEL_KO = "런칭가 990원";
const ACTIVE_REPORT_PAYMENT_PRICE_LABEL_KO = "결제금액 990원";
const ACTIVE_REPORT_FORMAT_LABEL_KO = "디지털 리포트";
const CHECKOUT_CTA_LABEL_KO = "990원 결제하고 리포트 생성하기";
const REQUIRED_CHECKOUT_INPUT_MESSAGE_KO =
  "리포트 생성을 위해 필요한 정보를 먼저 입력해 주세요.";
const DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED =
  process.env.NEXT_PUBLIC_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED === "1";

const mbtiTypes = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

type ReportInputStep = 0 | 1 | 2 | 3;
type BirthTimeMode = "exact" | "branch" | "unknown";

const reportInputSteps = [
  { step: 0, labelKo: "1단계", titleKo: "이름·생년월일" },
  { step: 1, labelKo: "2단계", titleKo: "출생시간" },
  { step: 2, labelKo: "3단계", titleKo: "성별·MBTI" },
  { step: 3, labelKo: "4단계", titleKo: "확인 후 결제" },
] as const satisfies readonly {
  readonly step: ReportInputStep;
  readonly labelKo: string;
  readonly titleKo: string;
}[];

const timeBranches = [
  { value: "JASI", labelKo: "자시 23:00~00:59", representativeTime: "00:30" },
  { value: "CHUKSI", labelKo: "축시 01:00~02:59", representativeTime: "02:00" },
  { value: "INSI", labelKo: "인시 03:00~04:59", representativeTime: "04:00" },
  { value: "MYOSI", labelKo: "묘시 05:00~06:59", representativeTime: "06:00" },
  { value: "JINSI", labelKo: "진시 07:00~08:59", representativeTime: "08:00" },
  { value: "SASI", labelKo: "사시 09:00~10:59", representativeTime: "10:00" },
  { value: "OSI", labelKo: "오시 11:00~12:59", representativeTime: "12:00" },
  { value: "MISI", labelKo: "미시 13:00~14:59", representativeTime: "14:00" },
  { value: "SINSI", labelKo: "신시 15:00~16:59", representativeTime: "16:00" },
  { value: "YUSI", labelKo: "유시 17:00~18:59", representativeTime: "18:00" },
  { value: "SULSI", labelKo: "술시 19:00~20:59", representativeTime: "20:00" },
  { value: "HAESI", labelKo: "해시 21:00~22:59", representativeTime: "22:00" },
] as const;

type TimeBranchValue = (typeof timeBranches)[number]["value"];
type TimeBranchSelection = TimeBranchValue | "";

function getRepresentativeBirthTime(branch: TimeBranchValue): string {
  return (
    timeBranches.find((item) => item.value === branch)?.representativeTime ??
    "00:30"
  );
}

function isMidnightBoundaryTime(value: string): boolean {
  return value.startsWith("23:") || value.startsWith("00:");
}

function formatGenderLabel(value: string): string {
  if (value === "MALE") {
    return "남성";
  }

  if (value === "FEMALE") {
    return "여성";
  }

  return "선택 안 함";
}

function formatCalendarTypeLabel(value: string): string {
  if (value === "SOLAR") {
    return "양력";
  }

  return "선택 안 함";
}

function formatBirthTimeSummary(
  mode: BirthTimeMode,
  exactTime: string,
  branch: TimeBranchSelection,
): string {
  if (mode === "unknown") {
    return "출생시간 모름";
  }

  if (mode === "branch") {
    const selectedBranch = timeBranches.find((item) => item.value === branch);

    return selectedBranch
      ? `대략적인 시간대 · ${selectedBranch.labelKo} 기준`
      : "시간대를 선택해 주세요";
  }

  return exactTime ? `정확한 시간 · ${exactTime}` : "정확한 시간 · 미입력";
}

function createCheckoutInputSnapshot(input: {
  readonly displayName: string;
  readonly birthDate: string;
  readonly birthTime: string | undefined;
  readonly birthTimeUnknown: boolean;
  readonly gender: string;
  readonly mbtiType: string;
}): DevTossCheckoutInputSnapshot {
  const trimmedDisplayName = input.displayName.trim();

  return {
    mbti: input.mbtiType,
    gender: input.gender,
    timezone: "Asia/Seoul",
    birthDate: input.birthDate,
    birthTime: input.birthTime ?? "",
    calendarType: "SOLAR",
    birthTimeUnknown: input.birthTimeUnknown,
    ...(trimmedDisplayName ? { displayName: trimmedDisplayName } : {}),
  };
}

export default function NewReportPage() {
  const [currentStep, setCurrentStep] = useState<ReportInputStep>(0);
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTimeMode, setBirthTimeMode] = useState<BirthTimeMode>("exact");
  const [birthTime, setBirthTime] = useState("");
  const [timeBranch, setTimeBranch] = useState<TimeBranchSelection>("");
  const [gender, setGender] = useState("");
  const [mbtiType, setMbtiType] = useState("");
  const [stepError, setStepError] = useState("");

  const selectedStep = reportInputSteps[currentStep];
  const progressPercent = ((currentStep + 1) / reportInputSteps.length) * 100;
  const birthTimeUnknown = birthTimeMode === "unknown";
  const normalizedBirthTime = birthTimeUnknown
    ? undefined
    : birthTimeMode === "branch"
      ? timeBranch
        ? getRepresentativeBirthTime(timeBranch)
        : undefined
      : birthTime;
  const birthTimeSummary = formatBirthTimeSummary(
    birthTimeMode,
    birthTime,
    timeBranch,
  );
  const shouldShowMidnightBoundaryWarning =
    (birthTimeMode === "exact" && isMidnightBoundaryTime(birthTime)) ||
    (birthTimeMode === "branch" && timeBranch === "JASI");
  const checkoutInputSnapshot = createCheckoutInputSnapshot({
    displayName,
    birthDate,
    birthTime: normalizedBirthTime,
    birthTimeUnknown,
    gender,
    mbtiType,
  });
  const isCheckoutInputComplete =
    isDevTossCheckoutInputComplete(checkoutInputSnapshot);

  function isBirthTimeStepValid(): boolean {
    if (birthTimeMode === "unknown") {
      return true;
    }

    if (birthTimeMode === "branch") {
      return timeBranch !== "";
    }

    return /^\d{2}:\d{2}$/.test(birthTime);
  }

  function goToPreviousStep() {
    setStepError("");
    setCurrentStep((step) => Math.max(0, step - 1) as ReportInputStep);
  }

  function goToNextStep() {
    if (currentStep === 0 && birthDate.trim().length === 0) {
      setStepError("생년월일을 입력해 주세요.");
      return;
    }

    if (currentStep === 1 && !isBirthTimeStepValid()) {
      setStepError(
        "출생시간을 입력하거나, 대략적인 시간대 또는 모름을 선택해 주세요.",
      );
      return;
    }

    if (currentStep === 2 && (gender.trim().length === 0 || mbtiType === "")) {
      setStepError("성별과 MBTI를 선택해 주세요.");
      return;
    }

    setStepError("");
    setCurrentStep((step) =>
      Math.min(reportInputSteps.length - 1, step + 1) as ReportInputStep,
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep !== 3) {
      goToNextStep();
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-8 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
            종합 리포트 입력
          </h1>
          <p className="max-w-2xl text-base leading-8 text-neutral-400">
            생년월일시와 MBTI를 입력하고 확인한 뒤 990원 결제창으로
            이동합니다. 리포트는 결제 승인 후 생성됩니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/20 lg:sticky lg:top-8"
          >
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-neutral-100">
                {selectedStep.labelKo} · {selectedStep.titleKo}
              </h2>
              <p className="text-sm leading-6 text-neutral-400">
                입력한 정보는 결제 주문의 inputSnapshot으로 저장되어 이후
                전체 리포트 생성에 사용됩니다.
              </p>
            </div>

            <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-neutral-100">
                  {currentStep + 1} / {reportInputSteps.length}
                </p>
                <p className="text-right text-sm text-neutral-400">
                  {selectedStep.labelKo} · {selectedStep.titleKo}
                </p>
              </div>
              <div
                aria-label="진행률"
                className="h-2 overflow-hidden rounded-full bg-neutral-800"
              >
                <div
                  className="h-full rounded-full bg-neutral-100"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <ol className="grid gap-2 text-xs text-neutral-500 sm:grid-cols-4">
                {reportInputSteps.map((step) => (
                  <li
                    key={step.step}
                    className={
                      step.step === currentStep
                        ? "rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-neutral-100"
                        : "rounded-lg border border-neutral-800 px-3 py-2"
                    }
                  >
                    <span className="font-semibold">{step.labelKo}</span>
                    <span className="ml-2">{step.titleKo}</span>
                  </li>
                ))}
              </ol>
            </div>

            <input type="hidden" name="timezone" value="Asia/Seoul" />
            <input type="hidden" name="calendarType" value="SOLAR" />
            <input
              type="hidden"
              name="birthTimeUnknown"
              value={birthTimeUnknown ? "on" : ""}
            />

            {currentStep === 0 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    이름
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={displayName}
                    maxLength={20}
                    onChange={(event) => setDisplayName(event.target.value)}
                    placeholder="예: 덕짱"
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-neutral-400"
                  />
                  <p className="text-xs leading-5 text-neutral-500">
                    리포트에서 불러드릴 이름입니다. 사주 계산에는 사용하지 않습니다.
                  </p>
                </div>

                <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <p className="text-sm font-semibold text-neutral-100">
                    양력 기준 생년월일
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    현재 V1은 양력 기준 생년월일만 지원합니다.
                  </p>
                  <p className="text-sm leading-6 text-neutral-500">
                    음력 생일 입력은 추후 지원 예정입니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="birthDate"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    생년월일
                  </label>
                  <div className="relative">
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={birthDate}
                      onChange={(event) => {
                        setBirthDate(event.target.value);
                        setStepError("");
                      }}
                      style={{ colorScheme: "dark" }}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 pr-24 text-neutral-50 outline-none focus:border-neutral-400"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-300">
                      날짜 선택
                    </span>
                  </div>
                  <p className="text-xs leading-5 text-neutral-500">
                    예: 1996-12-06 형식으로 입력해 주세요.
                  </p>
                </div>
              </div>
            ) : null}

            {currentStep === 1 ? (
              <div className="space-y-5">
                <fieldset className="space-y-3">
                  <legend className="text-sm font-medium text-neutral-200">
                    출생시간
                  </legend>
                  <div className="grid gap-3">
                    {[
                      { value: "exact", labelKo: "정확한 시간" },
                      { value: "branch", labelKo: "대략적인 시간대" },
                      { value: "unknown", labelKo: "출생시간 모름" },
                    ].map((mode) => (
                      <label
                        key={mode.value}
                        className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm font-medium text-neutral-200"
                      >
                        <input
                          type="radio"
                          checked={birthTimeMode === mode.value}
                          onChange={() => {
                            setBirthTimeMode(mode.value as BirthTimeMode);
                            setStepError("");
                          }}
                          className="h-4 w-4"
                        />
                        {mode.labelKo}
                      </label>
                    ))}
                  </div>
                </fieldset>

                {birthTimeMode === "exact" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="birthTime"
                      className="block text-sm font-medium text-neutral-200"
                    >
                      출생시간
                    </label>
                    <div className="relative">
                      <input
                        id="birthTime"
                        name="birthTime"
                        type="time"
                        value={birthTime}
                        onChange={(event) => {
                          setBirthTime(event.target.value);
                          setStepError("");
                        }}
                        style={{ colorScheme: "dark" }}
                        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 pr-24 text-neutral-50 outline-none focus:border-neutral-400"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-medium text-neutral-300">
                        시간 선택
                      </span>
                    </div>
                    <p className="text-xs leading-5 text-neutral-500">
                      예: 오후 3시 12분이면 15:12로 입력해 주세요.
                    </p>
                  </div>
                ) : null}

                {birthTimeMode === "branch" ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="timeBranch"
                      className="block text-sm font-medium text-neutral-200"
                    >
                      대략적인 시간대
                    </label>
                    <select
                      id="timeBranch"
                      value={timeBranch}
                      onChange={(event) => {
                        setTimeBranch(event.target.value as TimeBranchSelection);
                        setStepError("");
                      }}
                      className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                    >
                      <option value="">시간대를 선택해 주세요</option>
                      {timeBranches.map((branch) => (
                        <option key={branch.value} value={branch.value}>
                          {branch.labelKo}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {birthTimeMode === "unknown" ? (
                  <p className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm leading-6 text-neutral-400">
                    출생시간을 모르면 시주 없이 일부 해석이 제한될 수 있습니다.
                  </p>
                ) : null}

                {shouldShowMidnightBoundaryWarning ? (
                  <div className="space-y-2 rounded-lg border border-amber-900/50 bg-amber-950/20 p-4 text-sm leading-6 text-amber-100/90">
                    <p>
                      자정 전후 출생은 날짜 기준에 따라 일주·시주 해석이 달라질 수 있습니다.
                    </p>
                    <p>
                      가능하면 가족에게 실제 출생일과 시간을 다시 확인해 주세요.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {currentStep === 2 ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    성별
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(event) => {
                      setGender(event.target.value);
                      setStepError("");
                    }}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    <option value="MALE">남성</option>
                    <option value="FEMALE">여성</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mbtiType"
                    className="block text-sm font-medium text-neutral-200"
                  >
                    MBTI
                  </label>
                  <select
                    id="mbtiType"
                    name="mbtiType"
                    value={mbtiType}
                    onChange={(event) => {
                      setMbtiType(event.target.value);
                      setStepError("");
                    }}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  >
                    <option value="">선택</option>
                    {mbtiTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs leading-5 text-neutral-500">
                    MBTI는 내가 생각하는 나의 모습이 반영될 수 있습니다. 가능하면 여러 번의 검사 결과나 가까운 사람의 피드백도 함께 참고해 주세요.
                  </p>
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="space-y-5">
                <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-neutral-100">
                      입력 정보 확인
                    </h3>
                    <p className="text-sm leading-6 text-neutral-400">
                      입력한 정보로 전체 리포트를 생성합니다. 결제 승인 후 리포트가 생성되며, 결과는 온라인 열람 페이지로 제공됩니다.
                    </p>
                  </div>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">이름</dt>
                      <dd className="text-right text-neutral-200">
                        {displayName.trim() || "미입력"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">생년월일</dt>
                      <dd className="text-right text-neutral-200">
                        {birthDate || "미입력"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">출생시간</dt>
                      <dd className="text-right text-neutral-200">
                        {birthTimeSummary}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">성별</dt>
                      <dd className="text-right text-neutral-200">
                        {formatGenderLabel(gender)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">MBTI</dt>
                      <dd className="text-right text-neutral-200">
                        {mbtiType || "미선택"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">달력</dt>
                      <dd className="text-right text-neutral-200">
                        {formatCalendarTypeLabel("SOLAR")}
                      </dd>
                    </div>
                  </dl>
                </section>

                <section className="space-y-4 rounded-lg border border-sky-200 bg-white p-4 text-neutral-950">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-sky-700">
                      전체 리포트
                    </p>
                    <h3 className="text-xl font-extrabold">
                      {ACTIVE_REPORT_PRODUCT.nameKo}
                    </h3>
                    <p className="text-sm leading-6 text-neutral-600">
                      {ACTIVE_REPORT_FORMAT_LABEL_KO} · 결제 승인 후 온라인 열람
                    </p>
                  </div>
                  <dl className="grid gap-3 text-sm sm:grid-cols-3">
                    <div
                      aria-label={ACTIVE_REPORT_LIST_PRICE_LABEL_KO}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                    >
                      <dt className="text-neutral-500">정가</dt>
                      <dd className="mt-1 font-semibold text-neutral-400 line-through">
                        {ACTIVE_REPORT_PRODUCT.listPriceKo}
                      </dd>
                    </div>
                    <div
                      aria-label={ACTIVE_REPORT_SALE_PRICE_LABEL_KO}
                      className="rounded-lg border border-rose-200 bg-rose-50 p-3"
                    >
                      <dt className="text-rose-700">런칭가</dt>
                      <dd className="mt-1 text-xl font-extrabold text-rose-700">
                        {ACTIVE_REPORT_PRODUCT.priceKo}
                      </dd>
                    </div>
                    <div
                      aria-label={ACTIVE_REPORT_PAYMENT_PRICE_LABEL_KO}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
                    >
                      <dt className="text-neutral-500">결제금액</dt>
                      <dd className="mt-1 font-bold text-neutral-950">
                        {ACTIVE_REPORT_PRODUCT.priceKo}
                      </dd>
                    </div>
                  </dl>

                  {!isCheckoutInputComplete ? (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                      {REQUIRED_CHECKOUT_INPUT_MESSAGE_KO}
                    </p>
                  ) : null}

                  {DEV_TOSS_CHECKOUT_LAUNCHER_UI_ENABLED ? (
                    <DevTossCheckoutLauncher
                      inputSnapshot={checkoutInputSnapshot}
                      ctaLabelKo={CHECKOUT_CTA_LABEL_KO}
                    />
                  ) : (
                    <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                      <p className="text-sm font-semibold text-neutral-900">
                        정식 결제 연결 준비 중입니다.
                      </p>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        심사 및 결제 승인 연동 후 전체 리포트 구매가 가능합니다.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            ) : null}

            {stepError ? (
              <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm leading-6 text-red-100">
                {stepError}
              </p>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="rounded-lg border border-neutral-700 px-5 py-4 font-semibold text-neutral-200 transition hover:bg-neutral-800"
                >
                  이전
                </button>
              ) : null}
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="rounded-lg bg-neutral-50 px-5 py-4 font-semibold text-neutral-950 transition hover:bg-white"
                >
                  다음
                </button>
              ) : null}
            </div>
          </form>

          <aside className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/60 p-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-neutral-400">
                구매 상품
              </p>
              <h2 className="text-2xl font-bold text-neutral-50">
                {ACTIVE_REPORT_PRODUCT.nameKo}
              </h2>
              <p className="text-sm leading-6 text-neutral-400">
                {ACTIVE_REPORT_PRODUCT.fullNameKo}
              </p>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                <dt className="text-neutral-500">형태</dt>
                <dd className="mt-1 font-semibold text-neutral-100">
                  {ACTIVE_REPORT_FORMAT_LABEL_KO}
                </dd>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                <dt className="text-neutral-500">제공 방식</dt>
                <dd className="mt-1 font-semibold text-neutral-100">
                  {ACTIVE_REPORT_PRODUCT.deliveryTypeKo}
                </dd>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                <dt className="text-neutral-500">정가</dt>
                <dd className="mt-1 font-semibold text-neutral-400 line-through">
                  {ACTIVE_REPORT_PRODUCT.listPriceKo}
                </dd>
              </div>
              <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-4">
                <dt className="text-rose-100/80">런칭가</dt>
                <dd className="mt-1 text-2xl font-extrabold text-rose-100">
                  {ACTIVE_REPORT_PRODUCT.priceKo}
                </dd>
              </div>
            </dl>
            <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 text-sm leading-6 text-neutral-400">
              <p>현재 V1은 양력과 Asia/Seoul 시간대만 지원합니다.</p>
              <p>
                본 리포트는 자기이해를 돕기 위한 참고 콘텐츠이며,
                의료·투자·법률·관계 선택에 대한 전문 판단이나 미래 사건 예측을
                제공하지 않습니다.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
