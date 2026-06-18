import type { AnnualFortuneReportDraft } from "../../../lib/report-generation/annualFortuneReportDraftTypes";
import {
  inferAnnualAdviceDomain,
  sanitizeAnnualFortuneVisibleText,
} from "../../../lib/report-generation/annualFortuneReportDraftValidator";

type AnnualFortuneReportViewProps = {
  readonly draft: AnnualFortuneReportDraft;
  readonly reportId?: string;
};

type StemMeta = {
  readonly element: string;
  readonly yinYang: string;
};

const stemMetaByStem: Record<string, StemMeta> = {
  甲: { element: "목", yinYang: "양목" },
  乙: { element: "목", yinYang: "음목" },
  丙: { element: "화", yinYang: "양화" },
  丁: { element: "화", yinYang: "음화" },
  戊: { element: "토", yinYang: "양토" },
  己: { element: "토", yinYang: "음토" },
  庚: { element: "금", yinYang: "양금" },
  辛: { element: "금", yinYang: "음금" },
  壬: { element: "수", yinYang: "양수" },
  癸: { element: "수", yinYang: "음수" },
};

const branchMetaByBranch: Record<string, StemMeta> = {
  子: { element: "수", yinYang: "양수" },
  丑: { element: "토", yinYang: "음토" },
  寅: { element: "목", yinYang: "양목" },
  卯: { element: "목", yinYang: "음목" },
  辰: { element: "토", yinYang: "양토" },
  巳: { element: "화", yinYang: "음화" },
  午: { element: "화", yinYang: "양화" },
  未: { element: "토", yinYang: "음토" },
  申: { element: "금", yinYang: "양금" },
  酉: { element: "금", yinYang: "음금" },
  戌: { element: "토", yinYang: "양토" },
  亥: { element: "수", yinYang: "음수" },
};

const annualFortuneFlowAreaLabels = [
  "일·성과",
  "돈·현실",
  "인간관계",
  "연애·가족",
  "학업·자격증",
  "몸·생활 리듬",
] as const;

function text(value: string): string {
  return sanitizeAnnualFortuneVisibleText(value);
}

function getAnnualFlowIndexHeading(
  mode: AnnualFortuneReportDraft["mode"],
): string {
  if (mode === "past_review") {
    return "회고 흐름 지표";
  }
  if (mode === "new_year_preview") {
    return "신년 흐름 지표";
  }

  return "올해 흐름 지표";
}

function getAnnualFlowMetricLabel(label: string): string {
  if (label === "일·성과") {
    return "활성도";
  }
  if (label === "돈·현실") {
    return "체감도";
  }
  if (label === "인간관계") {
    return "노출도";
  }
  if (label === "연애·가족") {
    return "조율도";
  }
  if (label === "학업·자격증") {
    return "활용도";
  }
  if (label === "몸·생활 리듬") {
    return "주의도";
  }

  return "체감도";
}

function getAnnualKeySignalDisplayLabel(
  type: AnnualFortuneReportDraft["keySignals"][number]["type"],
): string {
  if (type === "opportunity") {
    return "기회 신호";
  }
  if (type === "difficulty") {
    return "부담 신호";
  }
  if (type === "mixed") {
    return "양면 신호";
  }
  if (type === "recovery") {
    return "연결 신호";
  }

  return "주의 신호";
}

function getGanjiParts(ganji: string): {
  readonly stem: string;
  readonly branch: string;
} {
  const [stem = "-", branch = "-"] = [...ganji];

  return { stem, branch };
}

function renderList(items: readonly string[]) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
      {items.map((item) => (
        <li key={item}>{text(item)}</li>
      ))}
    </ul>
  );
}

function renderYearStructure(draft: AnnualFortuneReportDraft) {
  const { stem, branch } = getGanjiParts(draft.yearSummary.ganji);
  const stemMeta = stemMetaByStem[stem];
  const branchMeta = branchMetaByBranch[branch];
  const rows = [
    ["연도", `${draft.targetYear}`],
    ["간지", draft.yearSummary.ganji],
    ["천간", `${stem} · ${stemMeta?.yinYang ?? "확인 필요"}`],
    ["지지", `${branch} · ${branchMeta?.yinYang ?? "확인 필요"}`],
    [
      "오행",
      stemMeta?.element === branchMeta?.element && stemMeta !== undefined
        ? stemMeta.element
        : draft.yearSummary.elementLabel,
    ],
    ["십성", draft.yearSummary.tenGodLabel],
    ["현재 모드", draft.yearSummary.modeLabel],
  ] as const;

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">연도 구조</h2>
      <dl className="mt-4 grid gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[5rem_1fr] rounded-md border border-neutral-800 bg-neutral-900/70"
          >
            <dt className="px-3 py-2 font-semibold text-neutral-500">{label}</dt>
            <dd className="px-3 py-2 font-medium text-neutral-100">
              {text(value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function AnnualFortuneReportView({
  draft,
  reportId,
}: AnnualFortuneReportViewProps) {
  const userContextSummary = draft.userContextSummary ?? {
    lifeStatusLabel: "기타",
    fieldLabel: null,
    translationNote:
      "현재 상태와 분야 정보가 충분하지 않아 전체 흐름 장면으로 해석했습니다.",
  };

  return (
    <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/30 sm:p-6">
      <header className="space-y-5 rounded-xl border border-amber-500/20 bg-neutral-950/70 p-5">
        <p className="text-xs font-semibold uppercase text-amber-200">
          세운 리포트 v1.0
        </p>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
            {text(draft.openingTitle)}
          </h1>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 font-semibold text-neutral-100">
              {text(draft.personLabel)}
            </span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-semibold text-amber-100">
              {text(draft.yearSummary.displayTitle)}
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-neutral-300">
              {text(draft.yearSummary.modeLabel)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 font-semibold text-neutral-200">
              현재 상태: {text(userContextSummary.lifeStatusLabel)}
            </span>
            {userContextSummary.fieldLabel === null ? null : (
              <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 font-semibold text-neutral-200">
                분야: {text(userContextSummary.fieldLabel)}
              </span>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
          <section
            className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
            aria-label={getAnnualFlowIndexHeading(draft.mode)}
          >
            <p className="text-xs font-semibold text-amber-200">
              {getAnnualFlowIndexHeading(draft.mode)}
            </p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-amber-100">
              {draft.scoreSummary.flowIndex}
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-amber-100">
              {text(draft.scoreSummary.flowTypeLabel)}
            </p>
          </section>
          <section className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
            <p className="text-base font-semibold leading-7 text-neutral-50">
              {text(draft.coreLine)}
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              {text(draft.scoreSummary.flowIndexCaution)}
            </p>
          </section>
        </div>
        <p className="max-w-prose text-base leading-7 text-neutral-300">
          {text(draft.openingSummary)}
        </p>
      </header>

      {reportId === undefined ? null : (
        <dl className="grid gap-2 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="font-medium text-neutral-500">리포트 ID</dt>
            <dd className="break-words text-neutral-100">{reportId}</dd>
          </div>
          <div className="grid gap-1 sm:grid-cols-[8rem_1fr]">
            <dt className="font-medium text-neutral-500">상품</dt>
            <dd className="text-neutral-100">세운 리포트 v1.0</dd>
          </div>
        </dl>
      )}

      {renderYearStructure(draft)}

      <section className="space-y-3" aria-label="흐름 카드">
        <div className="flex flex-wrap gap-2">
          {annualFortuneFlowAreaLabels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-neutral-800 bg-neutral-950/60 px-3 py-1 text-xs font-semibold text-neutral-300"
            >
              {text(label)}
            </span>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.flowCards.map((card) => (
            <article
              key={`${card.label}:${card.headline}`}
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold text-neutral-400">
                  {text(card.label)} {getAnnualFlowMetricLabel(card.label)}
                </h2>
                <span className="text-xl font-bold text-amber-100">
                  {card.score}
                </span>
              </div>
              <p className="mt-3 text-base font-semibold leading-7 text-neutral-50">
                {text(card.headline)}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(card.body)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">핵심 신호</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.keySignals.map((signal) => (
            <article
              key={`${signal.type}:${signal.title}`}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-xs font-semibold text-amber-200">
                {getAnnualKeySignalDisplayLabel(signal.type)}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-50">
                {text(signal.title)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(signal.body)}
              </p>
              <p className="mt-3 text-xs text-neutral-500">
                근거: {text(signal.evidenceLabel)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          올해 구조 해석
        </h2>
        <dl className="grid gap-3">
          {[
            ["간지", draft.annualStructure.ganjiExplanation],
            ["십성", draft.annualStructure.tenGodExplanation],
            ["오행", draft.annualStructure.elementEffectExplanation],
            ["지지 작용", draft.annualStructure.branchInteractionExplanation],
          ].map(([label, body]) => (
            <div
              key={label}
              className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <dt className="text-xs font-semibold text-amber-200">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-300">
                {text(body)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-5" aria-label="세운 리포트 본문">
        {draft.chapters.map((chapter) => (
          <section
            key={`${chapter.title}:${chapter.headline}`}
            className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-50">
                {text(chapter.title)}
              </h2>
              <p className="text-base font-semibold leading-7 text-amber-100">
                {text(chapter.headline)}
              </p>
            </div>
            <p className="max-w-prose whitespace-pre-line text-base leading-8 text-neutral-200">
              {text(chapter.body)}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
                <h3 className="text-sm font-semibold text-amber-100">
                  나타날 수 있는 장면
                </h3>
                {renderList(chapter.likelyScenes)}
              </section>
              <section className="rounded-lg border border-neutral-700 bg-neutral-900/70 p-4">
                <h3 className="text-sm font-semibold text-neutral-100">
                  실전 조언
                </h3>
                {renderList(chapter.practicalAdvice)}
              </section>
            </div>
          </section>
        ))}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          월별 운영 가이드
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.monthlyFlow.map((flow) => (
            <article
              key={flow.month}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-xs font-semibold text-amber-200">
                {text(flow.label)}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-50">
                {text(flow.headline)}
              </h3>
              {flow.elementFocus === null ? null : (
                <p className="mt-2 text-xs text-neutral-500">
                  오행 포인트: {text(flow.elementFocus)}
                </p>
              )}
              {flow.monthGanji === null ? null : (
                <p className="mt-2 text-xs text-neutral-500">
                  월 간지: {text(flow.monthGanji)}
                </p>
              )}
              <p className="mt-2 text-xs text-neutral-500">
                기준: {text(flow.monthlyBasis ?? "달력월 기준 운영 가이드")}
              </p>
              {flow.natalInteractionSummary === null ? null : (
                <p className="mt-2 text-xs text-neutral-500">
                  원국과의 작용: {text(flow.natalInteractionSummary)}
                </p>
              )}
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(flow.body)}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {text(flow.advice)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">마지막 조언</h2>
        <ol className="grid gap-3">
          {draft.finalAdvice.map((advice, index) => (
            <li
              key={advice}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-sm font-semibold text-amber-100">
                {index + 1}. {inferAnnualAdviceDomain(advice)}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(advice)}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-sm font-semibold text-neutral-400">안전 안내</h2>
        {renderList(draft.safetyNotes)}
      </section>
    </article>
  );
}
