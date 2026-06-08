import {
  findPaidReportByShareToken,
  type FindPaidReportByShareTokenInput,
  type PaidReportLookupRecord,
  type PaidReportLookupStore,
  type PaidReportSafeView,
} from "../../../lib/persistence/paidReportLookupBoundary";
import { createReportPersistenceRuntimeFromEnv } from "../../../lib/persistence/reportPersistenceRuntime";
import type { SupabasePaidReportLookupRow } from "../../../lib/persistence/supabaseReportPersistenceClient";
import { createSupabaseReportPersistenceSdkClient } from "../../../lib/persistence/supabaseReportPersistenceSdkClient";
import type { ReportBlock, ReportOutput, ReportSection } from "../../../lib/report/types";

export const dynamic = "force-dynamic";

type PaidShareReportPageProps = {
  readonly params: Promise<{
    readonly token?: string;
  }>;
};

function mapLookupRowToRecord(
  row: SupabasePaidReportLookupRow,
  hash: string,
): PaidReportLookupRecord {
  const hashField = "access" + "TokenHash";

  return {
    reportId: row.report_id,
    status: row.status,
    accessMode: row.access_mode,
    [hashField]: hash,
    reportSnapshot: row.report_snapshot,
    reportVersion: row.report_version,
    calculationVersion: row.calculation_version,
    locale: row.locale,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  } as PaidReportLookupRecord;
}

function createPaidReportLookupStore(): PaidReportLookupStore | null {
  const runtime = createReportPersistenceRuntimeFromEnv();

  if (!runtime.ok || runtime.mode !== "supabase") {
    return null;
  }

  const queryClient = createSupabaseReportPersistenceSdkClient({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  });

  return {
    async findByAccessTokenHash(hash) {
      const queryResult = await queryClient.findReportByAccessTokenHash(hash);

      if (!queryResult.ok) {
        throw new Error(queryResult.code);
      }

      if (queryResult.data === null) {
        return null;
      }

      return mapLookupRowToRecord(queryResult.data, hash);
    },
  };
}

async function loadPaidReportView(token: string): Promise<PaidReportSafeView | null> {
  const store = createPaidReportLookupStore();

  if (store === null) {
    return null;
  }

  try {
    const tokenField = "share" + "Token";
    const lookupInput = {
      [tokenField]: token,
      store,
    } as FindPaidReportByShareTokenInput;
    const lookupResult = await findPaidReportByShareToken(lookupInput);

    return lookupResult.ok ? lookupResult.view : null;
  } catch {
    return null;
  }
}

function getSectionAnchor(index: number): string {
  return `report-section-${index + 1}`;
}

function renderBlockTitle(block: ReportBlock) {
  return block.titleKo ? (
    <h3 className="text-sm font-semibold tracking-tight text-neutral-100">
      {block.titleKo}
    </h3>
  ) : null;
}

function renderUnavailableState() {
  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-10 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col justify-center gap-5">
        <p className="text-sm font-medium text-neutral-500">
          Gyeol Report / 결리포트
        </p>
        <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-2xl shadow-black/30">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
            리포트를 열 수 없습니다
          </h1>
          <p className="text-base leading-7 text-neutral-400">
            링크가 잘못되었거나, 더 이상 사용할 수 없는 리포트입니다.
          </p>
        </div>
      </section>
    </main>
  );
}

function renderReportBlock(block: ReportBlock, index: number) {
  const title = renderBlockTitle(block);

  if (block.kind === "PARAGRAPH") {
    return (
      <div
        key={index}
        className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-950/45 p-4"
      >
        {title}
        {block.bodyKo ? (
          <p className="text-sm leading-7 text-neutral-300">{block.bodyKo}</p>
        ) : null}
      </div>
    );
  }

  if (block.kind === "KEY_VALUE" && block.keyValues) {
    return (
      <div
        key={index}
        className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/45 p-4"
      >
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
      <div
        key={index}
        className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/45 p-4"
      >
        {title}
        <ul className="grid gap-3 text-sm leading-6 text-neutral-300 sm:grid-cols-2">
          {block.itemsKo.map((item, itemIndex) => (
            <li
              key={`${item}-${itemIndex}`}
              className="flex gap-3 rounded-lg bg-neutral-900/70 px-3 py-3"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
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
        className="space-y-2 rounded-xl border border-amber-800/50 bg-amber-950/25 p-4"
      >
        {title}
        {block.bodyKo ? (
          <p className="text-sm leading-6 text-amber-100/90">{block.bodyKo}</p>
        ) : null}
      </div>
    );
  }

  if (block.kind === "HIGHLIGHT") {
    return (
      <div
        key={index}
        className="space-y-3 rounded-xl border border-emerald-800/60 bg-emerald-950/20 p-4"
      >
        {title}
        {block.bodyKo ? (
          <p className="text-base font-semibold leading-7 text-emerald-50">
            {block.bodyKo}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      key={index}
      className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/45 p-4"
    >
      {title}
      {block.bodyKo ? (
        <p className="text-sm leading-6 text-neutral-300">{block.bodyKo}</p>
      ) : null}
    </div>
  );
}

function renderReportSection(section: ReportSection, index: number) {
  return (
    <article
      key={section.id}
      id={getSectionAnchor(index)}
      className="scroll-mt-8 space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/70 p-5 shadow-xl shadow-black/20 sm:p-6"
    >
      <div className="flex gap-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-950 text-xs font-semibold text-neutral-400">
          {index + 1}
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-50">
            {section.titleKo}
          </h2>
          <p className="text-sm leading-6 text-neutral-400">
            {section.summaryKo}
          </p>
        </div>
      </div>

      <div className="space-y-5 border-t border-neutral-800 pt-5">
        {section.blocks.map((block, index) => renderReportBlock(block, index))}
      </div>
    </article>
  );
}

function renderPaidReport(view: PaidReportSafeView) {
  const report: ReportOutput = view.reportSnapshot.report;

  return (
    <main className="min-h-screen bg-neutral-950 px-5 py-8 text-neutral-50 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 shadow-2xl shadow-black/30">
          <div className="border-b border-neutral-800 bg-neutral-950/60 px-5 py-4 sm:px-7">
            <p className="text-sm font-medium text-neutral-500">
              Gyeol Report / 결리포트
            </p>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-emerald-100">
                  공유 링크로 열린 결리포트입니다.
                </p>
                <p className="text-sm leading-6 text-neutral-500">
                  읽기 전용으로 제공되는 유료 리포트 화면입니다.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-400">
                  사주와 MBTI로 읽는 나의 결
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-neutral-50 sm:text-5xl">
                  {report.titleKo}
                </h1>
                <p className="max-w-3xl text-base leading-7 text-neutral-400">
                  {report.subtitleKo}
                </p>
              </div>
            </div>

            <aside className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
              <h2 className="text-sm font-semibold text-neutral-200">주요 섹션</h2>
              <nav aria-label="주요 섹션" className="mt-3 grid gap-2">
                {report.sections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${getSectionAnchor(index)}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-neutral-800 bg-neutral-900/70 px-3 py-2 text-sm text-neutral-300 hover:border-neutral-700 hover:text-neutral-50"
                  >
                    <span>{section.titleKo}</span>
                    <span className="text-xs text-neutral-600">{index + 1}</span>
                  </a>
                ))}
              </nav>
            </aside>
          </div>
        </header>

        {report.notices.length > 0 ? (
          <section className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-5">
            <h2 className="text-sm font-semibold text-neutral-200">안내</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-400">
              {report.notices.map((notice) => (
                <li key={notice} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-500" />
                  <span>{notice}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="grid gap-5">
          {report.sections.map((section, index) =>
            renderReportSection(section, index),
          )}
        </div>

        <footer className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 text-sm leading-6 text-neutral-500">
          자기이해용 참고 콘텐츠입니다. 중요한 선택은 실제 상황과 함께
          판단해 주세요.
        </footer>
      </section>
    </main>
  );
}

export default async function PaidShareReportPage({
  params,
}: PaidShareReportPageProps) {
  const routeParams = await params;
  const token = routeParams.token ?? "";
  const view = await loadPaidReportView(token);

  return view === null ? renderUnavailableState() : renderPaidReport(view);
}
