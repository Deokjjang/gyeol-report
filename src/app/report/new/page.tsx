"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type ValidationError = {
  field: string;
  code: string;
  messageKo: string;
};

type ReportSection = {
  id: string;
  titleKo: string;
  summaryKo: string;
};

type ReportPreview = {
  version: "v1";
  titleKo: string;
  subtitleKo: string;
  sections: ReportSection[];
  notices: string[];
};

type CreateReportResponse =
  | {
      ok: true;
      report: ReportPreview;
    }
  | {
      ok: false;
      errors: ValidationError[];
    };

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
    <main className="min-h-screen bg-neutral-950 px-6 py-10 text-neutral-50">
      <section className="mx-auto max-w-md space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-medium text-neutral-400">Gyeol Report</p>
          <h1 className="text-3xl font-bold tracking-tight">결리포트 만들기</h1>
          <p className="leading-7 text-neutral-400">
            생년월일, 출생시간, MBTI를 입력하면 사주 구조와 자기인식의
            겹침을 정리합니다.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5"
        >
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
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
            />
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
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
            />
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
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
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
              className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-neutral-50 outline-none focus:border-neutral-400"
              defaultValue=""
            >
              <option value="">선택</option>
              {mbtiTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-neutral-50 px-5 py-4 font-semibold text-neutral-950 disabled:cursor-not-allowed disabled:bg-neutral-500"
          >
            {isSubmitting ? "생성 중..." : "무료 미리보기 생성"}
          </button>
        </form>

        {errors.length > 0 ? (
          <section className="space-y-3 rounded-2xl border border-red-900/60 bg-red-950/30 p-5">
            <h2 className="font-semibold text-red-100">
              입력값을 확인해 주세요.
            </h2>
            <ul className="space-y-2 text-sm leading-6 text-red-200">
              {errors.map((error) => (
                <li key={`${error.field}-${error.code}`}>{error.messageKo}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {report ? (
          <section className="space-y-5 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{report.titleKo}</h2>
              <p className="text-neutral-400">{report.subtitleKo}</p>
            </div>

            <div className="space-y-3">
              {report.sections.slice(0, 5).map((section) => (
                <article
                  key={section.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 p-4"
                >
                  <h3 className="font-semibold text-neutral-100">
                    {section.titleKo}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    {section.summaryKo}
                  </p>
                </article>
              ))}
            </div>

            {report.notices.length > 0 ? (
              <ul className="space-y-2 text-sm leading-6 text-neutral-500">
                {report.notices.map((notice) => (
                  <li key={notice}>{notice}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ) : null}

        <div className="space-y-3 text-sm leading-6 text-neutral-500">
          <p>현재 V1은 양력과 Asia/Seoul 시간대만 지원합니다.</p>
          <p>
            본 리포트는 자기이해용 콘텐츠이며, 질병·투자·법률 판단이나 미래
            사건 예측을 제공하지 않습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
