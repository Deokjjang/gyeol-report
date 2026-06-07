"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ValidationError = {
  field: string;
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

function canShowSectionBody(
  level: ReportSection["level"],
  mode: ReportPreviewMode,
): boolean {
  if (mode === "dev_full") {
    return true;
  }

  return level === "FREE_PREVIEW";
}

function renderLockedSectionBody(section: ReportSection) {
  return (
    <div className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/70 p-5">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-100">
          {section.titleKo}
        </p>
        <p className="text-sm leading-6 text-neutral-400">
          {section.summaryKo}
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
  const [report, setReport] = useState<ReportPreview | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setReport(null);

    const formData = new FormData(event.currentTarget);
    const birthTimeUnknown = formData.get("birthTimeUnknown") === "on";
    const payload = {
      birthDate: formData.get("birthDate"),
      birthTime: birthTimeUnknown ? undefined : formData.get("birthTime"),
      birthTimeUnknown,
      calendarType: formData.get("calendarType"),
      gender: formData.get("gender"),
      timezone: formData.get("timezone"),
      mbtiType: formData.get("mbtiType"),
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
        return;
      }

      setReport(json.report);
    } catch {
      setErrors([
        {
          field: "request",
          code: "REQUEST_FAILED",
          messageKo: "리포트를 생성하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        },
      ]);
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
            핵심 구조 일부를 먼저 확인할 수 있습니다. 전체 리포트 영역은
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
                  리포트 정보 입력
                </h2>
                <p className="text-sm leading-6 text-neutral-400">
                  출생정보와 MBTI를 입력하면 샘플 리포트를 생성합니다.
                </p>
              </div>

              <input type="hidden" name="calendarType" value="SOLAR" />
              <input type="hidden" name="timezone" value="Asia/Seoul" />

              <div className="space-y-2">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-neutral-200"
                >
                  생년월일
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                />
                <p className="text-xs leading-5 text-neutral-500">
                  양력 기준 생년월일을 입력합니다.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm font-medium text-neutral-200">
                <input
                  name="birthTimeUnknown"
                  type="checkbox"
                  className="h-5 w-5 rounded border-neutral-700 bg-neutral-950"
                />
                출생시간을 모릅니다
              </label>

              <div className="space-y-2">
                <label
                  htmlFor="birthTime"
                  className="block text-sm font-medium text-neutral-200"
                >
                  출생시간
                </label>
                <input
                  id="birthTime"
                  name="birthTime"
                  type="time"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                />
                <p className="text-xs leading-5 text-neutral-500">
                  출생시간을 모르면 비워 두거나 알 수 없음 옵션을 사용합니다.
                </p>
              </div>

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
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  defaultValue=""
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
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
                  defaultValue=""
                >
                  <option value="">선택</option>
                  {mbtiTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-5 text-neutral-500">
                  모르면 임시로 가장 가까운 유형을 선택해도 됩니다.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-neutral-50 px-5 py-4 font-semibold text-neutral-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-neutral-500"
              >
                {isSubmitting ? "리포트 생성 중..." : "무료 미리보기 생성"}
              </button>
              {isSubmitting ? (
                <p className="text-center text-sm leading-6 text-neutral-400">
                  사주 구조와 MBTI 입력값을 함께 정리하고 있습니다.
                </p>
              ) : null}
            </form>

            {errors.length > 0 ? (
              <section className="space-y-3 rounded-lg border border-red-900/60 bg-red-950/30 p-5">
                <h2 className="font-semibold text-red-100">
                  입력값을 확인해 주세요.
                </h2>
                <p className="text-sm leading-6 text-red-100/90">
                  리포트를 생성하지 못했습니다. 입력값을 확인한 뒤 다시 시도해
                  주세요.
                </p>
                <ul className="space-y-2 text-sm leading-6 text-red-200">
                  {errors.map((error) => (
                    <li key={`${error.field}-${error.code}`}>
                      {error.messageKo}
                    </li>
                  ))}
                </ul>
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
            <section className="space-y-6">
              <div className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/70 p-5">
                <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-4">
                  <p className="text-sm font-semibold text-emerald-100">
                    샘플 리포트가 생성되었습니다.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-emerald-100/80">
                    아래 내용은 자기이해용 참고자료입니다.
                  </p>
                </div>

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
                    전체 리포트 영역은 정식 결제 연동 이후 제공됩니다.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">{report.titleKo}</h2>
                    <p className="text-neutral-400">{report.subtitleKo}</p>
                  </div>
                  <p className="rounded-full border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-500">
                    무료 미리보기에서는 핵심 구조 일부를 먼저 확인할 수 있습니다.
                    전체 리포트 영역은 정식 결제 연동 이후 제공됩니다.
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
