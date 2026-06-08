"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

type ValidationError = {
  field: string;
  code: string;
  messageKo: string;
};

type CreateReportErrorSummary = {
  code: string;
  messageKo: string;
};

type ReportBlock = {
  kind: string;
  titleKo?: string;
  bodyKo?: string;
  itemsKo?: string[];
  keyValues?: {
    keyKo: string;
    valueKo: string;
  }[];
};

type ReportSection = {
  id: string;
  level: string;
  titleKo: string;
  summaryKo: string;
  blocks: ReportBlock[];
};

type ReportPreview = {
  version: "v1";
  titleKo: string;
  subtitleKo: string;
  sections: ReportSection[];
  notices: string[];
};

type ReportPreviewMode = "dev_full" | "gated_preview";

type CreateReportResponse =
  | {
      ok: true;
      report: ReportPreview;
    }
  | {
      ok: false;
      error?: CreateReportErrorSummary;
      errors: ValidationError[];
    };

const REPORT_PREVIEW_MODE = "gated_preview" as const satisfies ReportPreviewMode;

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
  { step: 3, labelKo: "4단계", titleKo: "확인 후 생성" },
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

  if (value === "OTHER") {
    return "기타";
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

function getReportCreationErrorMessage(errorCode: string | undefined): string {
  if (errorCode === "SOLAR_TERM_YEAR_UNSUPPORTED") {
    return "현재 입력값은 자동 계산 범위에서 처리하지 못했습니다. 생년월일과 출생시간을 다시 확인해 주세요.";
  }

  if (errorCode === "NETWORK_ERROR") {
    return "일시적인 연결 문제로 리포트를 만들지 못했습니다. 잠시 후 다시 시도해 주세요.";
  }

  return "입력한 생년월일, 출생시간, MBTI를 다시 확인해 주세요. 잠시 후 다시 시도해 주세요.";
}

function getCreateReportErrorCode(
  response: Extract<CreateReportResponse, { ok: false }>,
): string | undefined {
  const unsupportedYearError = response.errors.find(
    (error) => error.code === "SOLAR_TERM_YEAR_UNSUPPORTED",
  );

  return unsupportedYearError?.code ?? response.error?.code;
}

function canShowSectionBody(
  level: ReportSection["level"],
  mode: ReportPreviewMode,
): boolean {
  if (mode === "dev_full") {
    return true;
  }

  return level === "FREE_PREVIEW";
}

function getLockedSectionTeaser(title: string): string {
  if (title.includes("오행")) {
    return "오행 밸런스, 보완 루틴, 추천 색상·공간을 전체 리포트에서 확인할 수 있습니다.";
  }

  if (title.includes("십성")) {
    return "강하게 쓰는 성향과 보완하면 좋은 흐름을 더 자세히 확인할 수 있습니다.";
  }

  if (title.includes("신살") || title.includes("귀인")) {
    return "귀인·신살의 핵심 신호와 실전 활용 포인트를 전체 리포트에서 확인할 수 있습니다.";
  }

  if (title.includes("일·돈·관계")) {
    return "일의 방식, 자원 관리, 관계·연애 패턴을 전체 리포트에서 확인할 수 있습니다.";
  }

  if (title.includes("사주×MBTI")) {
    return "입력 MBTI와 사주 구조의 공통점과 차이를 전체 리포트에서 확인할 수 있습니다.";
  }

  if (title.includes("활용 가이드")) {
    return "오늘부터 써먹을 루틴과 조심할 패턴을 전체 리포트에서 확인할 수 있습니다.";
  }

  return "이 섹션의 상세 해석은 전체 리포트에서 확인할 수 있습니다.";
}

function renderLockedSectionBody(section: ReportSection) {
  return (
    <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/70 p-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-100">
          전체 리포트 잠금
        </p>
        <p className="text-sm leading-6 text-neutral-400">
          {getLockedSectionTeaser(section.titleKo)}
        </p>
      </div>
      <p className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-300">
        정식 결제 연동 후 제공 예정
      </p>
    </div>
  );
}

function renderReportBlock(block: ReportBlock, index: number) {
  const title = block.titleKo ? (
    <h4 className="text-sm font-semibold tracking-tight text-neutral-100">
      {block.titleKo}
    </h4>
  ) : null;

  if (block.kind === "KEY_VALUE" && block.keyValues) {
    return (
      <div key={index} className="space-y-3">
        {title}
        <dl className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950/70">
          {block.keyValues.map((item) => (
            <div
              key={`${item.keyKo}-${item.valueKo}`}
              className="grid gap-1 border-b border-neutral-800 px-4 py-3 text-sm last:border-b-0 sm:grid-cols-[8rem_1fr] sm:gap-4"
            >
              <dt className="font-medium text-neutral-500">{item.keyKo}</dt>
              <dd className="leading-6 text-neutral-200">{item.valueKo}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  if (block.kind === "BULLET_LIST" && block.itemsKo) {
    return (
      <div key={index} className="space-y-3">
        {title}
        <ul className="space-y-3 text-sm leading-6 text-neutral-300">
          {block.itemsKo.map((item, itemIndex) => (
            <li key={`${item}-${itemIndex}`} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (block.kind === "WARNING") {
    return (
      <div
        key={index}
        className="space-y-2 rounded-lg border border-amber-900/50 bg-amber-950/20 p-4"
      >
        {title}
        <p className="text-sm leading-6 text-amber-100/90">{block.bodyKo}</p>
      </div>
    );
  }

  if (block.kind === "HIGHLIGHT") {
    return (
      <div
        key={index}
        className="space-y-3 rounded-lg border border-neutral-700 bg-neutral-900 p-4"
      >
        {title}
        <p className="text-base font-semibold leading-7 text-neutral-50">
          {block.bodyKo}
        </p>
      </div>
    );
  }

  return (
    <div key={index} className="space-y-3">
      {title}
      <p className="text-sm leading-6 text-neutral-300">{block.bodyKo}</p>
    </div>
  );
}

export default function NewReportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [creationErrorMessage, setCreationErrorMessage] = useState("");
  const [report, setReport] = useState<ReportPreview | null>(null);
  const [currentStep, setCurrentStep] = useState<ReportInputStep>(0);
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTimeMode, setBirthTimeMode] = useState<BirthTimeMode>("exact");
  const [birthTime, setBirthTime] = useState("");
  const [timeBranch, setTimeBranch] = useState<TimeBranchSelection>("");
  const [gender, setGender] = useState("");
  const [mbtiType, setMbtiType] = useState("");
  const [stepError, setStepError] = useState("");
  const resultRef = useRef<HTMLElement | null>(null);
  const shouldScrollToResultRef = useRef(false);

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

  useEffect(() => {
    if (!report || !shouldScrollToResultRef.current) {
      return;
    }

    shouldScrollToResultRef.current = false;
    resultRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [report]);

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
    setCurrentStep((step) =>
      Math.max(0, step - 1) as ReportInputStep,
    );
  }

  function goToNextStep() {
    if (currentStep === 1 && !isBirthTimeStepValid()) {
      setStepError(
        "출생시간을 입력하거나, 대략적인 시간대 또는 모름을 선택해 주세요.",
      );
      return;
    }

    setStepError("");
    setCurrentStep((step) =>
      Math.min(reportInputSteps.length - 1, step + 1) as ReportInputStep,
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep !== 3) {
      goToNextStep();
      return;
    }

    setIsSubmitting(true);
    setErrors([]);
    setCreationErrorMessage("");
    setReport(null);

    const payload = {
      displayName: displayName.trim(),
      birthDate,
      birthTime: normalizedBirthTime,
      birthTimeUnknown,
      calendarType: "SOLAR",
      gender,
      timezone: "Asia/Seoul",
      mbtiType,
    };

    try {
      const response = await fetch("/api/reports/create", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const json = (await response.json()) as CreateReportResponse;

      if (!json.ok) {
        setErrors(json.errors);
        setCreationErrorMessage(
          getReportCreationErrorMessage(getCreateReportErrorCode(json)),
        );
        return;
      }

      shouldScrollToResultRef.current = true;
      setReport(json.report);
    } catch {
      setErrors([]);
      setCreationErrorMessage(getReportCreationErrorMessage("NETWORK_ERROR"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-8 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
            결리포트 미리보기
          </h1>
          <p className="max-w-2xl text-base leading-8 text-neutral-400">
            생년월일, 출생시간, MBTI를 입력하면 사주 구조와 자기인식의
            겹침을 바탕으로 샘플 리포트를 생성합니다. 무료 미리보기에서는
            핵심 구조 일부를 먼저 확인할 수 있습니다. 전체 리포트는
            정식 결제 연동 이후 제공됩니다.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/20"
            >
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-neutral-100">
                  {selectedStep.labelKo} · {selectedStep.titleKo}
                </h2>
                <p className="text-sm leading-6 text-neutral-400">
                  모바일에서 한 단계씩 입력한 뒤 무료 미리보기를 생성합니다.
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
                        onChange={(event) => setBirthDate(event.target.value)}
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

                  {stepError ? (
                    <p className="rounded-lg border border-red-900/60 bg-red-950/30 p-4 text-sm leading-6 text-red-100">
                      {stepError}
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
                      onChange={(event) => setGender(event.target.value)}
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
                      onChange={(event) => setMbtiType(event.target.value)}
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
                <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <h3 className="text-base font-semibold text-neutral-100">
                    입력 정보 확인
                  </h3>
                  <dl className="grid gap-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">이름</dt>
                      <dd className="text-right text-neutral-200">
                        {displayName.trim() || "미입력"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-neutral-500">달력 기준</dt>
                      <dd className="text-right text-neutral-200">
                        {formatCalendarTypeLabel("SOLAR")}
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
                  </dl>
                </div>
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
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-neutral-50 px-5 py-4 font-semibold text-neutral-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-neutral-500 sm:col-span-2"
                  >
                    {isSubmitting ? "리포트 생성 중..." : "무료 미리보기 생성"}
                  </button>
                )}
              </div>
              {isSubmitting ? (
                <p className="text-center text-sm leading-6 text-neutral-400">
                  사주 구조와 MBTI 입력값을 함께 정리하고 있습니다.
                </p>
              ) : null}
            </form>

            {creationErrorMessage || errors.length > 0 ? (
              <section className="space-y-3 rounded-lg border border-red-900/60 bg-red-950/30 p-5">
                <h2 className="font-semibold text-red-100">
                  리포트 생성에 실패했습니다.
                </h2>
                <p className="text-sm leading-6 text-red-100/90">
                  {creationErrorMessage ||
                    getReportCreationErrorMessage(undefined)}
                </p>
                <p className="text-sm leading-6 text-red-200">
                  입력 정보를 고친 뒤 무료 미리보기를 다시 생성해 주세요.
                </p>
              </section>
            ) : null}

            <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 text-sm leading-6 text-neutral-500">
              <p>현재 V1은 양력과 Asia/Seoul 시간대만 지원합니다.</p>
              <p>
                본 리포트는 자기이해를 돕기 위한 참고 콘텐츠이며,
                의료·투자·법률·관계 선택에 대한 전문 판단이나 미래 사건 예측을
                제공하지 않습니다.
              </p>
            </div>
          </div>

          {report ? (
            <section
              ref={resultRef}
              aria-labelledby="generated-preview-title"
              className="scroll-mt-6 space-y-6"
            >
              <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/70 p-5">
                <div className="space-y-2">
                  <p
                    id="generated-preview-title"
                    className="text-lg font-semibold text-neutral-50"
                  >
                    생성된 미리보기
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    아래에서 무료 미리보기 결과를 확인할 수 있습니다.
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-4">
                  <p className="text-sm font-semibold text-emerald-100">
                    샘플 리포트가 생성되었습니다.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-100/80">
                    아래 내용은 자기이해용 참고자료입니다.
                  </p>
                </div>

                <nav
                  aria-label="결과 빠른 이동"
                  className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4"
                >
                  <p className="text-sm font-semibold text-neutral-100">
                    결과 빠른 이동
                  </p>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <a
                      href="#report-section-INTRO"
                      className="rounded-lg border border-neutral-700 px-3 py-2 text-neutral-200 transition hover:bg-neutral-900"
                    >
                      리포트 개요
                    </a>
                    <a
                      href="#report-section-QUICK_SUMMARY"
                      className="rounded-lg border border-neutral-700 px-3 py-2 text-neutral-200 transition hover:bg-neutral-900"
                    >
                      한눈에 보는 나의 결
                    </a>
                    <span className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 px-3 py-2 text-emerald-100">
                      무료 미리보기
                    </span>
                    <span className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-300">
                      전체 리포트 잠금
                    </span>
                  </div>
                </nav>

                <div className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
                  <p className="text-sm font-semibold text-neutral-100">
                    결제 비활성 안내
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    현재 실제 결제는 아직 활성화되어 있지 않습니다.
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    무료 미리보기에서는 핵심 구조 일부를 먼저 확인할 수 있습니다.
                  </p>
                  <p className="text-sm leading-6 text-neutral-400">
                    전체 리포트는 정식 결제 연동 이후 제공됩니다.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{report.titleKo}</h2>
                    <p className="text-neutral-400">{report.subtitleKo}</p>
                  </div>
                  <p className="rounded-full border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-500">
                    자기이해용 참고자료
                  </p>
                </div>

                {report.notices.length > 0 ? (
                  <ul className="space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/70 p-4 text-sm leading-6 text-neutral-400">
                    {report.notices.map((notice) => (
                      <li key={notice}>{notice}</li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="space-y-5">
                {report.sections.map((section) => {
                  const shouldShowSectionBody = canShowSectionBody(
                    section.level,
                    REPORT_PREVIEW_MODE,
                  );

                  return (
                    <article
                      key={section.id}
                      id={`report-section-${section.id}`}
                      className="space-y-5 rounded-lg border border-neutral-800 bg-neutral-900/60 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold tracking-tight text-neutral-50">
                            {section.titleKo}
                          </h3>
                          <p className="text-sm leading-6 text-neutral-400">
                            {section.summaryKo}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-400">
                          {section.level === "FREE_PREVIEW"
                            ? "무료 미리보기"
                            : "전체 리포트"}
                        </span>
                      </div>

                      <div className="space-y-5 border-t border-neutral-800 pt-5">
                        {shouldShowSectionBody
                          ? section.blocks.map((block, index) =>
                              renderReportBlock(block, index),
                            )
                          : renderLockedSectionBody(section)}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : (
            <section className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/30 p-8">
              <div className="max-w-xl space-y-3">
                <h2 className="text-xl font-semibold text-neutral-100">
                  입력 후 리포트가 이곳에 표시됩니다.
                </h2>
                <p className="text-sm leading-7 text-neutral-400">
                  일간, 십성, 구조 후보, 신살·귀인, 사주 기반 MBTI 보정까지
                  섹션별 카드로 정리해 보여줍니다.
                </p>
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
