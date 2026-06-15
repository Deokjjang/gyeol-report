import type { ReactNode } from "react";

import { getPaidReportResult } from "../../../lib/reports/supabasePaidReportResultAdapter";
import { createSupabasePaidReportResultClient } from "../../../lib/reports/supabasePaidReportResultClient";
import type { PaidReportResult } from "../../../lib/reports/paidReportResultTypes";
import type {
  ComprehensiveReportDraft,
  ComprehensiveReportDraftSection,
  ComprehensiveReportV2Chapter,
  ComprehensiveReportV2ProfileTable,
} from "../../../lib/report-generation/comprehensiveReportDraftTypes";
import {
  isComprehensiveReportV2Draft,
} from "../../../lib/report-generation/comprehensiveReportDraftTypes";

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

const displaySectionIds = ["manse_table", "mbti_table"] as const;

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

function isDisplaySection(section: ComprehensiveReportDraftSection): boolean {
  return (displaySectionIds as readonly string[]).includes(section.sectionId);
}

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function collectDraftSajuTerms(result: PaidReportResult): readonly string[] {
  if (result.draft === null) {
    return [];
  }
  if (isComprehensiveReportV2Draft(result.draft)) {
    return uniqueValues(
      result.draft.chapters.flatMap((chapter) => chapter.sajuTermsUsed),
    );
  }

  return uniqueValues(
    result.draft.sections.flatMap((section) => [
      ...section.sajuTermsUsed,
      ...section.evidenceSummary.filter((item) => item !== "ENTJ"),
    ]),
  );
}

function collectDraftMbtiTerms(result: PaidReportResult): readonly string[] {
  if (result.draft === null) {
    return [];
  }
  if (isComprehensiveReportV2Draft(result.draft)) {
    return uniqueValues(
      result.draft.chapters.flatMap((chapter) => chapter.mbtiTermsUsed),
    );
  }

  return uniqueValues(result.draft.sections.flatMap((section) => section.mbtiTermsUsed));
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

function renderDisplaySummaryCard(input: {
  readonly title: string;
  readonly description: string;
  readonly termsLabel: string;
  readonly terms: readonly string[];
}) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-neutral-50">{input.title}</h2>
        <p className="text-sm leading-6 text-neutral-400">{input.description}</p>
      </div>
      {renderTermList(input.termsLabel, input.terms)}
    </section>
  );
}

function renderDisplaySections(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v1_draft" }>,
) {
  const manseSection = draft.sections.find(
    (section) => section.sectionId === "manse_table",
  );
  const mbtiSection = draft.sections.find(
    (section) => section.sectionId === "mbti_table",
  );

  return (
    <section className="grid gap-4 md:grid-cols-2" aria-label="입력 요약">
      {renderDisplaySummaryCard({
        title: "사주 원국 요약",
        description:
          manseSection?.oneLine ?? "사주 원국에서 해석에 사용한 핵심 근거를 정리했습니다.",
        termsLabel: "사주 근거",
        terms: collectDraftSajuTerms(result),
      })}
      {renderDisplaySummaryCard({
        title: "MBTI 입력 요약",
        description:
          mbtiSection?.oneLine ?? "입력하신 MBTI 유형을 보조 기준으로 정리했습니다.",
        termsLabel: "MBTI 참고",
        terms: collectDraftMbtiTerms(result),
      })}
    </section>
  );
}

function renderEvidenceDetails(section: ComprehensiveReportDraftSection) {
  const hasEvidence =
    section.evidenceSummary.length > 0 ||
    section.sajuTermsUsed.length > 0 ||
    section.mbtiTermsUsed.length > 0;

  if (!hasEvidence) {
    return null;
  }

  return (
    <details className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-neutral-400">
        분석 근거 보기
      </summary>
      <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
        {section.evidenceSummary.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
            {section.evidenceSummary.map((summary) => (
              <li key={summary}>{summary}</li>
            ))}
          </ul>
        ) : null}
        <div className="grid gap-4 sm:grid-cols-2">
          {renderTermList("사주 근거", section.sajuTermsUsed)}
          {renderTermList("MBTI 참고", section.mbtiTermsUsed)}
        </div>
      </div>
    </details>
  );
}

function renderGeneratedState(result: PaidReportResult) {
  const draft = result.draft;

  if (draft === null) {
    return renderPlaceholderState(result);
  }

  if (isComprehensiveReportV2Draft(draft)) {
    return renderGeneratedV2State(result, draft);
  }

  return renderGeneratedV1State(result, draft);
}

function renderReportMetadata(result: PaidReportResult) {
  return (
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
  );
}

function createFallbackProfileTable(
  result: PaidReportResult,
): ComprehensiveReportV2ProfileTable {
  const sajuTerms = collectDraftSajuTerms(result);
  const mbtiTerms = collectDraftMbtiTerms(result);

  return {
    dayPillar: sajuTerms.find((term) => term.endsWith("일주")),
    dayPillarKeywords: [],
    dayMaster: sajuTerms.find(
      (term) =>
        term.endsWith("목") ||
        term.endsWith("화") ||
        term.endsWith("토") ||
        term.endsWith("금") ||
        term.endsWith("수"),
    ),
    fiveElementSummary: sajuTerms.filter(
      (term) => term.includes("과다") || term.includes("부족"),
    ),
    excessiveElements: sajuTerms.filter((term) => term.includes("과다")),
    missingElements: sajuTerms.filter((term) => term.includes("부족")),
    tenGodSummary: sajuTerms.filter((term) =>
      ["비견", "겁재", "식신", "상관", "편재", "정재", "편관", "정관", "편인", "정인"].includes(term),
    ),
    specialPatterns: sajuTerms.filter((term) =>
      ["재" + "다신약", "무인성", "무식상", "신강", "신약"].includes(term),
    ),
    sinsal: sajuTerms.filter((term) => term.endsWith("살")),
    gwiin: sajuTerms.filter((term) => term.endsWith("귀인")),
    mbti: mbtiTerms[0] ?? "입력값 없음",
  };
}

function renderProfileRow(label: string, value: string | readonly string[] | undefined) {
  const values =
    typeof value === "string" ? [value] : value?.filter((item) => item.trim().length > 0);

  if (values === undefined || values.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-1 border-t border-neutral-800 py-3 first:border-t-0 sm:grid-cols-[6.5rem_1fr]">
      <dt className="text-sm font-semibold text-neutral-500">{label}</dt>
      <dd className="flex flex-wrap gap-2 text-sm text-neutral-100">
        {values.map((item) => (
          <span
            key={`${label}:${item}`}
            className="rounded-md border border-neutral-800 bg-neutral-950/70 px-2 py-1"
          >
            {item}
          </span>
        ))}
      </dd>
    </div>
  );
}

function renderV2ProfileTable(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v2_draft" }>,
) {
  const profile = draft.profileTable ?? createFallbackProfileTable(result);

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">
        만세력 및 명리학 표
      </h2>
      <dl className="mt-4 divide-y divide-neutral-800">
        {renderProfileRow("연주", profile.yearPillar)}
        {renderProfileRow("월주", profile.monthPillar)}
        {renderProfileRow("일주", profile.dayPillar)}
        {renderProfileRow("시주", profile.hourPillar)}
        {renderProfileRow("일간", profile.dayMaster)}
        {renderProfileRow("일주 해석 키워드", profile.dayPillarKeywords)}
        {renderProfileRow("오행 분포", profile.fiveElementSummary)}
        {renderProfileRow("과다 오행", profile.excessiveElements)}
        {renderProfileRow("부족 오행", profile.missingElements)}
        {renderProfileRow("십성 핵심", profile.tenGodSummary)}
        {renderProfileRow("주요 구조", profile.specialPatterns)}
        {renderProfileRow("십이신살", profile.twelveSinsal)}
        {renderProfileRow("주요 신살", profile.majorSinsal ?? profile.sinsal)}
        {renderProfileRow("귀인/길신", profile.gwiinGilshin ?? profile.gwiin)}
        {renderProfileRow("MBTI 입력값", profile.mbti)}
      </dl>
    </section>
  );
}

function renderGeneratedV1State(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v1_draft" }>,
) {
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

        {renderReportMetadata(result)}

        {renderDisplaySections(result, draft)}

        <section className="space-y-3" aria-label="핵심 해석">
          {draft.sections.filter((section) => !isDisplaySection(section)).map((section, index) => (
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

                {renderEvidenceDetails(section)}
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

function renderV2IntegratedChapterProse(chapter: ComprehensiveReportV2Chapter) {
  const paragraphs = [
    ...chapter.hitReadingLines,
    chapter.body,
    ...chapter.solutionLines,
  ].filter((line) => line.trim().length > 0);

  return (
    <div className="space-y-4 text-base leading-8 text-neutral-200">
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${chapter.chapterId}:${index}`}
          className={
            index < chapter.hitReadingLines.length
              ? "rounded-md border-l-2 border-emerald-500/70 bg-emerald-950/20 py-2 pl-4 text-emerald-50"
              : "whitespace-pre-line"
          }
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function renderGeneratedV2State(
  result: PaidReportResult,
  draft: Extract<ComprehensiveReportDraft, { readonly version: "comprehensive_v2_draft" }>,
) {
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

        {renderV2ProfileTable(result, draft)}

        <section className="space-y-5" aria-label="리포트 본문">
          {draft.chapters.map((chapter) => (
            <section
              key={chapter.chapterId}
              className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
            >
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-neutral-50">
                  {chapter.titleKo}
                </h2>
                <p className="text-sm font-medium leading-6 text-emerald-100">
                  {chapter.headline}
                </p>
              </div>
              {renderV2IntegratedChapterProse(chapter)}
            </section>
          ))}
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
