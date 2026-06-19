import type { MajorFortuneReportDraft } from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import {
  getMajorFortuneBasisDisplayLabel,
  sanitizeMajorFortuneVisibleText,
} from "../../../lib/report-generation/majorFortuneReportDraftValidator";

type MajorFortuneReportViewProps = {
  readonly draft: MajorFortuneReportDraft;
  readonly reportId?: string;
  readonly devStatus?: string;
};

const majorFortuneCycleBasisFallback = "입력된 대운표 기준";

function text(value: string): string {
  return sanitizeMajorFortuneVisibleText(value);
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

function renderCurrentSituation(draft: MajorFortuneReportDraft) {
  return (
    <section className="grid gap-3 sm:grid-cols-3" aria-label="현재 상황">
      <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
        <p className="text-xs font-semibold text-neutral-500">현재 나의 연애</p>
        <p className="mt-2 text-base font-semibold text-neutral-100">
          {text(draft.userContextSummary.relationshipStatusLabel ?? "미입력")}
        </p>
      </div>
      <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
        <p className="text-xs font-semibold text-neutral-500">현재 하는 일</p>
        <p className="mt-2 text-base font-semibold text-neutral-100">
          {text(draft.userContextSummary.lifeStatusLabel)}
        </p>
      </div>
      <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
        <p className="text-xs font-semibold text-neutral-500">해석 기준</p>
        <p className="mt-2 text-base font-semibold text-neutral-100">
          {text(draft.userContextSummary.fieldLabel ?? "미입력")}
        </p>
      </div>
    </section>
  );
}

function renderCycleBasis(draft: MajorFortuneReportDraft) {
  const rows = [
    ["대운", draft.cycleSummary.ganji],
    ["대운 순번", draft.cycleSummary.cycleIndexLabel],
    ["현재 위치", draft.cycleSummary.currentPositionLabel],
    ["연도 구간", draft.cycleSummary.yearRangeLabel],
    ["나이 구간", draft.cycleSummary.ageRangeLabel],
    ["천간", draft.cycleSummary.stemLabel],
    ["지지", draft.cycleSummary.branchLabel],
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
      <h2 className="text-lg font-semibold text-neutral-50">대운 기준 요약</h2>
      <dl className="mt-4 grid gap-2 text-sm md:grid-cols-2">
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
      <p className="mt-4 max-w-prose text-sm leading-6 text-neutral-300">
        {text(draft.calculationBasis.explanation)}{" "}
        {text(draft.calculationBasis.note)}
      </p>
    </section>
  );
}

function renderTimeline(draft: MajorFortuneReportDraft) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div>
        <h2 className="text-lg font-semibold text-neutral-50">
          대운 타임라인
        </h2>
        <p className="mt-1 text-sm text-neutral-400">
          대운과 세운을 나란히 놓고 10년의 전략 지점을 봅니다.
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border border-neutral-800">
        <div className="hidden grid-cols-[5.5rem_4rem_6rem_6rem_1fr] gap-0 bg-neutral-900/90 px-4 py-3 text-xs font-semibold text-neutral-500 md:grid">
          <span>연도</span>
          <span>나이</span>
          <span>대운</span>
          <span>세운</span>
          <span>한 줄 전략</span>
        </div>
        <div className="divide-y divide-neutral-800">
          {draft.majorFortuneTimelineRows.map((row) => (
            <article
              key={`${row.year}:${row.annualGanji}`}
              className={
                row.isCurrentYear
                  ? "grid gap-3 bg-sky-950/35 px-4 py-4 text-sm ring-1 ring-inset ring-sky-500/35 md:grid-cols-[5.5rem_4rem_6rem_6rem_1fr]"
                  : "grid gap-3 bg-neutral-950/40 px-4 py-4 text-sm md:grid-cols-[5.5rem_4rem_6rem_6rem_1fr]"
              }
            >
              <div>
                <p className="font-semibold text-neutral-50">{row.year}년</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {row.badges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold text-sky-100"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
              <p className="font-medium text-neutral-300">
                {text(row.ageLabel ?? "-")}
              </p>
              <p className="font-semibold text-neutral-100">
                <span className="mr-1 text-xs text-neutral-500">대운</span>
                {text(row.majorGanji)}
              </p>
              <p className="font-semibold text-neutral-100">
                <span className="mr-1 text-xs text-neutral-500">세운</span>
                {text(row.annualGanji)}
              </p>
              <div className="space-y-1">
                <p className="leading-6 text-neutral-200">{text(row.oneLine)}</p>
                <p className="leading-6 text-neutral-400">
                  {text(row.annualTenGodLabel)}
                  {row.keyInteractionLabel === null
                    ? ""
                    : ` · ${text(row.keyInteractionLabel)}`}
                </p>
                <p className="leading-6 text-sky-100">
                  전략: {text(row.strategy)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderStrongYears(draft: MajorFortuneReportDraft) {
  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">
        강하게 체감될 해 TOP 5
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {draft.strongYears.map((year) => (
          <article
            key={`${year.year}:${year.ganji}`}
            className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <p className="text-xs font-semibold text-sky-200">
              {year.year}년 · {text(year.ganji)} · {text(year.likelyArea)}
            </p>
            <h3 className="mt-1 text-base font-semibold text-neutral-50">
              {text(year.headline)}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-300">
              왜 강한가: {text(year.whyStrong)}
            </p>
            <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
              <p className="rounded-md border border-sky-500/30 bg-sky-500/10 p-3 leading-6 text-sky-100">
                밀어볼 것: {text(year.pushStrategy)}
              </p>
              <p className="rounded-md border border-neutral-700 bg-neutral-950/70 p-3 leading-6 text-neutral-300">
                줄일 것: {text(year.reduceStrategy)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderMyeongliDetails(draft: MajorFortuneReportDraft) {
  const layers = draft.myeongliLayers;

  return (
    <details className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <summary className="cursor-pointer text-lg font-semibold text-neutral-50">
        명리 근거 펼쳐보기
      </summary>
      <div className="mt-4 grid gap-3">
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">십성</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.tenGodLayer.plain)}
          </p>
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">오행</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.elementLayer.plain)}
          </p>
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">지지 작용</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.branchInteractionLayer.plain)}
          </p>
          {renderList(
            layers.branchInteractionLayer.interactions
              .slice(0, 5)
              .map(
                (interaction) =>
                  `${interaction.type}: ${interaction.plainType} - ${interaction.plain}`,
              ),
          )}
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">지장간</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.hiddenStemLayer.plain)}
          </p>
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">신살·귀인 참고</h3>
          {renderList(
            layers.auxiliaryStarsLayer.map((star) =>
              star.caution === null
                ? `${star.label}: ${star.plain}`
                : `${star.label}: ${star.plain} ${star.caution}`,
            ),
          )}
        </section>
      </div>
    </details>
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
          <p className="text-base font-semibold leading-7 text-neutral-200">
            {text(draft.personLabel)} · {text(draft.cycleSummary.displayTitle)}
          </p>
          <p className="max-w-prose text-base leading-7 text-neutral-300">
            {text(draft.coreLine)}
          </p>
        </div>
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

      {renderCurrentSituation(draft)}
      {renderCycleBasis(draft)}
      {renderTimeline(draft)}

      <section className="space-y-3 rounded-lg border border-sky-500/30 bg-sky-950/20 p-5">
        <p className="text-xs font-semibold text-sky-200">이 10년의 한 줄 결론</p>
        <h2 className="text-xl font-semibold leading-8 text-neutral-50">
          {text(draft.decadeArchetype.label)}
        </h2>
        <p className="text-base font-semibold leading-7 text-sky-100">
          {text(draft.decadeArchetype.metaphor)}
        </p>
        <p className="max-w-prose text-base leading-7 text-neutral-300">
          {text(draft.decadeArchetype.plain)}
        </p>
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          대운 전환 해석: 이전 대운 → 현재 대운
        </h2>
        <p className="max-w-prose text-base leading-7 text-neutral-300">
          {text(draft.previousToCurrentShift.plain)}
        </p>
        {renderList(draft.previousToCurrentShift.whatChanged)}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">핵심 테마 3개</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {draft.bigThemes.slice(0, 3).map((theme) => (
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
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                전략: {text(theme.strategy)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {renderStrongYears(draft)}

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">
          현실 전략: 일·돈·연애·관계·몸·학업
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {draft.finalAdvice.map((advice) => (
            <article
              key={advice.label}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <h3 className="text-sm font-semibold text-sky-100">
                {text(advice.label)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {text(advice.body)}
              </p>
            </article>
          ))}
        </div>
      </section>

      {renderMyeongliDetails(draft)}

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-sm font-semibold text-neutral-400">안전 안내</h2>
        {renderList(draft.safetyNotes)}
      </section>
    </article>
  );
}
