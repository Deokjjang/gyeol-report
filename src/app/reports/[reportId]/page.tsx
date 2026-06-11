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
    if (result.error.code === "PAID_REPORT_RESULT_INVALID_REQUEST") {
      return { kind: "invalid" };
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

function formatProductTitle(result: PaidReportResult): string {
  if (result.productType === "saju_mbti_full") {
    return "사주×MBTI 종합 리포트";
  }

  return result.title;
}

function renderReadyState(result: PaidReportResult) {
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
            <dd className="text-neutral-100">{formatProductTitle(result)}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">상태</dt>
            <dd className="text-neutral-100">{result.status}</dd>
          </div>
        </dl>

        <p className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm leading-7 text-neutral-300">
          {result.placeholderText}
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

  return renderReadyState(state.result);
}
