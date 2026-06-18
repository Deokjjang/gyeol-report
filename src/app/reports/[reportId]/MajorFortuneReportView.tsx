import type {
  MajorFortuneKeySignalType,
  MajorFortuneReportDraft,
} from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import {
  getMajorFortuneBasisDisplayLabel,
  sanitizeMajorFortuneVisibleText,
} from "../../../lib/report-generation/majorFortuneReportDraftValidator";

type MajorFortuneReportViewProps = {
  readonly draft: MajorFortuneReportDraft;
  readonly reportId?: string;
  readonly devStatus?: string;
};

const majorFortuneCycleBasisFallback = "사전 계산된 대운표 기준";

function text(value: string): string {
  return sanitizeMajorFortuneVisibleText(value);
}

function getKeySignalDisplayLabel(type: MajorFortuneKeySignalType): string {
  if (type === "opportunity") {
    return "기회 신호";
  }
  if (type === "difficulty") {
    return "부담 신호";
  }
  if (type === "mixed") {
    return "양면 신호";
  }
  if (type === "transition") {
    return "전환 신호";
  }

  return "주의 신호";
}

function getPhaseDisplayLabel(
  phase: MajorFortuneReportDraft["phaseTimeline"][number],
): string {
  if (phase.phase === "early") {
    return phase.label.includes("초반") ? text(phase.label) : "초반 1~3년";
  }
  if (phase.phase === "middle") {
    return phase.label.includes("중반") ? text(phase.label) : "중반 4~7년";
  }

  return phase.label.includes("후반") ? text(phase.label) : "후반 8~10년";
}

function getMajorFlowIntensityLabel(flowIndex: number): string {
  if (flowIndex >= 75) {
    return "높음";
  }
  if (flowIndex >= 50) {
    return "중간";
  }

  return "완만함";
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

function renderCycleStructure(draft: MajorFortuneReportDraft) {
  const rows = [
    ["대운", draft.cycleSummary.ganji],
    ["대운 순번", draft.cycleSummary.cycleIndexLabel],
    ["현재 위치", draft.cycleSummary.currentPositionLabel],
    ["나이 구간", draft.cycleSummary.ageRangeLabel],
    ["연도 구간", draft.cycleSummary.yearRangeLabel],
    ["천간", draft.cycleSummary.stemLabel],
    ["지지", draft.cycleSummary.branchLabel],
    ["오행", draft.cycleSummary.elementLabel],
    ["십성", draft.cycleSummary.tenGodLabel],
    [
      "계산 기준",
      getMajorFortuneBasisDisplayLabel(
        draft.calculationBasis.displayLabel ||
          draft.cycleSummary.basisLabel ||
          majorFortuneCycleBasisFallback,
      ),
    ],
  ] as const;

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">
        현재 대운 구조
      </h2>
      <dl className="mt-4 grid gap-2 text-sm">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[6rem_1fr] rounded-md border border-neutral-800 bg-neutral-900/70"
          >
            <dt className="px-3 py-2 font-semibold text-neutral-500">{label}</dt>
            <dd className="px-3 py-2 font-medium text-neutral-100">
              {text(value)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 space-y-1 rounded-md border border-neutral-800 bg-neutral-900/70 p-3 text-sm leading-6 text-neutral-300">
        <p>{text(draft.calculationBasis.explanation)}</p>
        <p>{text(draft.calculationBasis.ageBasisLabel)}</p>
        <p>{text(draft.calculationBasis.note)}</p>
      </div>
    </section>
  );
}

export function MajorFortuneReportView({
  draft,
  reportId,
  devStatus,
}: MajorFortuneReportViewProps) {
  return (
    <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/30 sm:p-6">
      {devStatus === undefined ? null : (
        <aside
          className="rounded-md border border-neutral-800 bg-neutral-950/70 px-3 py-2 text-xs text-neutral-500"
          aria-label="dev-only metadata"
        >
          <span className="font-semibold text-neutral-400">개발 상태</span>
          <span className="ml-2">{text(devStatus)}</span>
        </aside>
      )}

      <header className="space-y-5 rounded-xl border border-sky-500/20 bg-neutral-950/70 p-5">
        <p className="text-xs font-semibold uppercase text-sky-200">
          대운 리포트 v1.0
        </p>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
            {text(draft.openingTitle)}
          </h1>
          <p className="text-sm font-semibold leading-6 text-neutral-200">
            {text(draft.personLabel)} · {text(draft.cycleSummary.tenGodLabel)}
          </p>
          <p className="text-sm leading-6 text-neutral-400">
            {text(draft.userContextSummary.lifeStatusLabel)}
            {draft.userContextSummary.fieldLabel === null
              ? ""
              : ` · ${text(draft.userContextSummary.fieldLabel)} 기준으로 해석`}
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-semibold text-sky-100">
              {text(draft.cycleSummary.displayTitle)}
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-neutral-300">
              {text(draft.cycleSummary.ageRangeLabel)}
            </span>
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-neutral-300">
              {text(draft.cycleSummary.yearRangeLabel)}
            </span>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[14rem_1fr]">
          <section
            className="rounded-lg border border-sky-500/40 bg-sky-500/10 p-4"
            aria-label="대운 유형"
          >
            <p className="text-xs font-semibold text-sky-200">
              대운 유형
            </p>
            <p className="mt-2 text-lg font-bold leading-7 text-sky-100">
              {text(draft.flowIndexSummary.flowTypeLabel)}
            </p>
            <p className="mt-2 text-sm leading-6 text-sky-100">
              체감 강도:{" "}
              {getMajorFlowIntensityLabel(draft.flowIndexSummary.flowIndex)}
            </p>
          </section>
          <section className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
            <p className="text-xs font-semibold text-neutral-500">핵심 방향</p>
            <p className="text-base font-semibold leading-7 text-neutral-50">
              {text(draft.coreLine)}
            </p>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              {text(draft.flowIndexSummary.flowIndexCaution)}
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
            <dd className="text-neutral-100">대운 리포트 v1.0</dd>
          </div>
        </dl>
      )}

      {renderCycleStructure(draft)}

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          10년 핵심 테마
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {draft.bigThemes.map((theme) => (
            <article
              key={`${theme.title}:${theme.metaphor}`}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <h3 className="text-base font-semibold text-neutral-50">
                {text(theme.title)}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-sky-100">
                {text(theme.metaphor)}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                {text(theme.body)}
              </p>
              {renderList(theme.likelyScenes)}
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {text(theme.strategy)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-3" aria-label="영역별 장기 영향">
        <h2 className="text-lg font-semibold text-neutral-50">
          영역별 장기 영향
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.decadeCards.map((card) => (
            <article
              key={`${card.label}:${card.headline}`}
              className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-sm font-semibold text-neutral-400">
                  {text(card.label)}
                </h2>
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
              <p className="text-xs font-semibold text-sky-200">
                {getKeySignalDisplayLabel(signal.type)}
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
          대운 구조 해석
        </h2>
        <dl className="grid gap-3">
          {[
            ["간지", draft.majorStructure.ganjiExplanation],
            ["십성", draft.majorStructure.tenGodExplanation],
            ["오행", draft.majorStructure.elementEffectExplanation],
            ["지지 작용", draft.majorStructure.branchInteractionExplanation],
            ["전환", draft.majorStructure.transitionExplanation],
          ].map(([label, body]) => (
            <div
              key={label}
              className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <dt className="text-xs font-semibold text-sky-200">{label}</dt>
              <dd className="mt-1 text-sm leading-6 text-neutral-300">
                {text(body)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="space-y-5" aria-label="대운 리포트 본문">
        {draft.cycleChapters.map((chapter) => (
          <section
            key={`${chapter.title}:${chapter.headline}`}
            className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-50">
                {text(chapter.title)}
              </h2>
              <p className="text-base font-semibold leading-7 text-sky-100">
                {text(chapter.headline)}
              </p>
            </div>
            <p className="max-w-prose whitespace-pre-line text-base leading-8 text-neutral-200">
              {text(chapter.body)}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded-lg border border-sky-500/30 bg-sky-950/20 p-4">
                <h3 className="text-sm font-semibold text-sky-100">
                  반복될 수 있는 장면
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
          대운 10년 흐름
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {draft.phaseTimeline.map((phase) => (
            <article
              key={phase.phase}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-xs font-semibold text-sky-200">
                {getPhaseDisplayLabel(phase)}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-50">
                {text(phase.headline)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(phase.body)}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {text(phase.advice)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          10년 연도별 흐름
        </h2>
        <div className="grid gap-2">
          {draft.cycleYearTimeline.map((year) => (
            <article
              key={`${year.year}:${year.ganji}`}
              className="grid gap-2 rounded-md border border-neutral-800 bg-neutral-900/70 p-3 text-sm sm:grid-cols-[8rem_1fr]"
            >
              <div>
                <p className="font-semibold text-sky-100">
                  {year.year}년 {text(year.ganji)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {year.yearIndexInCycle}년차 ·{" "}
                  {year.phase === "early"
                    ? "초반"
                    : year.phase === "middle"
                      ? "중반"
                      : "후반"}
                </p>
              </div>
              <div>
                <p className="font-semibold leading-6 text-neutral-100">
                  {text(year.headline)}
                </p>
                <p className="mt-1 leading-6 text-neutral-300">
                  {text(year.relationToMajorCycle)}
                </p>
                <p className="mt-1 leading-6 text-neutral-400">
                  {text(year.plain)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          특히 강하게 체감될 수 있는 해 TOP 5
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.strongYears.map((year) => (
            <article
              key={`${year.year}:${year.ganji}`}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-xs font-semibold text-sky-200">
                {year.year}년 · {text(year.ganji)}
              </p>
              <h3 className="mt-1 text-base font-semibold text-neutral-50">
                {text(year.headline)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(year.body)}
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                {text(year.advice)}
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
              key={advice.label}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-sm font-semibold text-sky-100">
                {index + 1}. {text(advice.label)}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(advice.body)}
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
