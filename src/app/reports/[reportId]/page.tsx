import type { ReactNode } from "react";

import { getPaidReportResult } from "../../../lib/reports/supabasePaidReportResultAdapter";
import { createSupabasePaidReportResultClient } from "../../../lib/reports/supabasePaidReportResultClient";
import type { PaidReportResult } from "../../../lib/reports/paidReportResultTypes";

export const dynamic = "force-dynamic";

type ReportResultPageProps = {
  readonly params: Promise<{
    readonly reportId?: string;
  }>;
};

type PageState =
  | {
      readonly kind: "invalid";
    }
  | {
      readonly kind: "invalidSnapshot";
    }
  | {
      readonly kind: "unavailable";
    }
  | {
      readonly kind: "ready";
      readonly result: PaidReportResult;
    };

function createResultClient() {
  return createSupabasePaidReportResultClient({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });
}

async function loadPageState(reportId: string): Promise<PageState> {
  const result = await getPaidReportResult({
    reportId,
    client: createResultClient(),
  });

  if (!result.ok) {
    if (
      result.error.code === "REPORT_RESULT_INVALID_REQUEST" ||
      result.error.code === "REPORT_RESULT_INVALID_REPORT_ID"
    ) {
      return { kind: "invalid" };
    }

    if (result.error.code === "REPORT_RESULT_SNAPSHOT_INVALID") {
      return { kind: "invalidSnapshot" };
    }

    return { kind: "unavailable" };
  }

  return {
    kind: "ready",
    result: result.result,
  };
}

function ResultShell({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-6">
        <p className="text-sm font-medium text-neutral-500">결리포트</p>
        {children}
      </section>
    </main>
  );
}

function renderInvalidState() {
  return (
    <ResultShell>
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          리포트 정보가 올바르지 않습니다.
        </h1>
        <p className="text-base leading-7 text-neutral-400">
          리포트 주소를 다시 확인해 주세요.
        </p>
      </div>
    </ResultShell>
  );
}

function renderUnavailableState() {
  return (
    <ResultShell>
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          리포트를 찾을 수 없습니다.
        </h1>
        <p className="text-base leading-7 text-neutral-400">
          결제가 완료된 리포트만 조회할 수 있습니다.
        </p>
      </div>
    </ResultShell>
  );
}

function renderInvalidSnapshotState() {
  return (
    <ResultShell>
      <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          리포트를 불러오지 못했습니다.
        </h1>
        <p className="text-base leading-7 text-neutral-400">
          저장된 리포트 형식을 확인할 수 없습니다.
        </p>
      </div>
    </ResultShell>
  );
}

function renderTermList(label: string, terms: readonly string[]) {
  if (terms.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-neutral-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {terms.map((term) => (
          <span
            key={term}
            className="rounded-full border border-neutral-700 bg-neutral-950/70 px-2.5 py-1 text-xs text-neutral-300"
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}

function renderGeneratedState(result: PaidReportResult) {
  const draft = result.draft;

  if (draft === null) {
    return renderPlaceholderState(result);
  }

  return (
    <ResultShell>
      <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-emerald-200">
            사주×MBTI 종합 리포트
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
              {draft.openingTitle}
            </h1>
            <p className="text-base leading-7 text-neutral-300">
              {draft.openingSummary}
            </p>
          </div>
          <p className="rounded-lg border border-emerald-900/70 bg-emerald-950/30 p-4 text-base font-semibold leading-7 text-emerald-100">
            {draft.coreLine}
          </p>
        </header>

        <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">리포트 ID</dt>
            <dd className="break-words text-neutral-100">{result.reportId}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상품</dt>
            <dd className="text-neutral-100">사주×MBTI 종합 리포트</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상태</dt>
            <dd className="text-neutral-100">{result.status}</dd>
          </div>
        </dl>

        <section className="space-y-3" aria-label="핵심 해석">
          {draft.sections.map((section, index) => (
            <details
              key={section.sectionId}
              open={index < 2}
              className="group rounded-lg border border-neutral-800 bg-neutral-950/60 p-4"
            >
              <summary className="cursor-pointer list-none space-y-2">
                <span className="block text-lg font-semibold text-neutral-50">
                  {section.titleKo}
                </span>
                <span className="block text-sm leading-6 text-neutral-400">
                  {section.oneLine}
                </span>
              </summary>

              <div className="mt-5 space-y-5 border-t border-neutral-800 pt-5">
                <p className="whitespace-pre-line text-base leading-8 text-neutral-200">
                  {section.body}
                </p>

                {section.evidenceSummary.length > 0 ? (
                  <div className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
                    <p className="text-xs font-semibold text-neutral-500">
                      근거 요약
                    </p>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                      {section.evidenceSummary.map((summary) => (
                        <li key={summary}>{summary}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  {renderTermList("사주 근거", section.sajuTermsUsed)}
                  {renderTermList("MBTI 보조 근거", section.mbtiTermsUsed)}
                </div>
              </div>
            </details>
          ))}
        </section>

        <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
          <h2 className="text-lg font-semibold text-neutral-50">최종 조언</h2>
          <p className="mt-3 text-base leading-8 text-neutral-300">
            {draft.finalAdvice}
          </p>
        </section>
      </article>
    </ResultShell>
  );
}

function renderPlaceholderState(result: PaidReportResult) {
  return (
    <ResultShell>
      <article className="space-y-6 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-emerald-200">
            리포트 준비 완료
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
            결제가 완료되었고 리포트가 생성되었습니다.
          </h1>
        </div>

        <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">리포트 ID</dt>
            <dd className="break-words text-neutral-100">{result.reportId}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상품</dt>
            <dd className="text-neutral-100">사주×MBTI 종합 리포트</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상태</dt>
            <dd className="text-neutral-100">{result.status}</dd>
          </div>
        </dl>

        <p className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm leading-7 text-neutral-300">
          상세 리포트 생성 대기 중입니다.
        </p>
      </article>
    </ResultShell>
  );
}

export default async function ReportResultPage({
  params,
}: ReportResultPageProps) {
  const routeParams = await params;
  const state = await loadPageState(routeParams.reportId ?? "");

  if (state.kind === "invalid") {
    return renderInvalidState();
  }

  if (state.kind === "unavailable") {
    return renderUnavailableState();
  }

  if (state.kind === "invalidSnapshot") {
    return renderInvalidSnapshotState();
  }

  return renderGeneratedState(state.result);
}
