import { DaeunFortuneTable } from "../../../components/report-tables";
import type { MajorFortuneReportDraft } from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import {
  getMajorFortuneBasisDisplayLabel,
  sanitizeMajorFortuneVisibleText,
} from "../../../lib/report-generation/majorFortuneReportDraftValidator";
import {
  buildDaeunFortuneTableData,
  type DaeunAnnualFortuneInput,
  type DaeunCurrentCycleInput,
  type DaeunTimelineYearInput,
} from "../../../lib/report-tables";

type MajorFortuneReportViewProps = {
  readonly draft: MajorFortuneReportDraft;
  readonly reportId?: string;
  readonly devStatus?: string;
};

const majorFortuneCycleBasisFallback = "입력된 대운표 기준";

function text(value: string): string {
  return sanitizeMajorFortuneVisibleText(value)
    .replace(/관계 상태가 미입력이므로\s*/gu, "")
    .replace(/관계 상태가 미입력이라서\s*/gu, "")
    .replace(/관계 상태가 미입력이라\s*/gu, "")
    .replace(/연애 상태가 입력되지 않아\s*/gu, "")
    .replace(/연애 상태가 입력되지 않았으므로\s*/gu, "");
}

function isVisibleText(value: string): boolean {
  const sanitized = text(value);

  return (
    sanitized.length > 0 &&
    !/백호대살|diagnostic-only|evidence|debug|fixture/iu.test(sanitized)
  );
}

function renderList(items: readonly string[]) {
  const visibleItems = items.map(text).filter(isVisibleText);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
      {visibleItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function renderCurrentSituation(draft: MajorFortuneReportDraft) {
  const relationshipStatusLabel = draft.userContextSummary.relationshipStatusLabel;
  const shouldRenderRelationshipStatus =
    relationshipStatusLabel !== null &&
    relationshipStatusLabel !== "미입력" &&
    isVisibleText(relationshipStatusLabel);

  return (
    <section
      className={
        shouldRenderRelationshipStatus
          ? "grid gap-3 sm:grid-cols-3"
          : "grid gap-3 sm:grid-cols-2"
      }
      aria-label="현재 상황"
    >
      {shouldRenderRelationshipStatus ? (
        <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4">
          <p className="text-xs font-semibold text-neutral-500">현재 나의 연애</p>
          <p className="mt-2 text-base font-semibold text-neutral-100">
            {text(relationshipStatusLabel ?? "")}
          </p>
        </div>
      ) : null}
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

function renderDaeunFortuneTable(draft: MajorFortuneReportDraft) {
  if (draft.majorFortuneTimelineRows.length === 0) {
    return null;
  }

  const currentTimelineRow =
    draft.majorFortuneTimelineRows.find((row) => row.isCurrentYear) ??
    draft.majorFortuneTimelineRows[0];

  if (currentTimelineRow === undefined) {
    return null;
  }

  const tableData = buildDaeunFortuneTableData({
    title: `${text(draft.personLabel)} 대운표`,
    currentYear: currentTimelineRow.year,
    selectedYear: currentTimelineRow.year,
    currentAge: parseAgeLabel(currentTimelineRow.ageLabel) ?? undefined,
    currentDaeunCycle: buildCurrentDaeunCycleInput(draft),
    timelineYears: buildTimelineYearInputs(draft),
    annualFortunes: buildAnnualFortuneInputs(draft),
  });

  return (
    <DaeunFortuneTable
      data={tableData}
      defaultOpen={true}
      className="bg-white text-neutral-950"
    />
  );
}

function buildCurrentDaeunCycleInput(
  draft: MajorFortuneReportDraft,
): DaeunCurrentCycleInput {
  const sortedRows = [...draft.majorFortuneTimelineRows].sort(
    (left, right) => left.year - right.year,
  );
  const firstRow = sortedRows[0];
  const lastRow = sortedRows[sortedRows.length - 1];
  const ageRange = parseNumberRange(draft.cycleSummary.ageRangeLabel);

  return {
    ganji: text(draft.cycleSummary.ganji),
    startYear: firstRow?.year,
    endYear: lastRow?.year,
    startAge: ageRange?.start,
    endAge: ageRange?.end,
    stemTenGod: text(draft.myeongliLayers.tenGodLayer.majorStemTenGod),
    hiddenStems: draft.myeongliLayers.hiddenStemLayer.majorBranchHiddenStems.map(text),
    twelveLifeStage:
      draft.myeongliLayers.twelveStageLayer === null
        ? []
        : [text(draft.myeongliLayers.twelveStageLayer.label)],
    sinsalAndGwiin: draft.myeongliLayers.auxiliaryStarsLayer
      .map((star) => text(star.label))
      .filter(isVisibleText),
    interactions: draft.myeongliLayers.branchInteractionLayer.interactions
      .filter((interaction) => interaction.year === null)
      .map(formatDaeunInteractionLabel)
      .filter(isVisibleText),
  };
}

function buildTimelineYearInputs(
  draft: MajorFortuneReportDraft,
): readonly DaeunTimelineYearInput[] {
  return draft.majorFortuneTimelineRows.map((row) => ({
    year: row.year,
    ageLabel: row.ageLabel === null ? null : text(row.ageLabel),
    isCurrentYear: row.isCurrentYear,
    isCycleStartYear: row.isCycleStartYear,
    badges: row.badges,
    majorGanji: text(row.majorGanji),
    annualGanji: text(row.annualGanji),
    annualTenGodLabel: text(row.annualTenGodLabel),
    keyInteractionLabel:
      row.keyInteractionLabel === null ? null : text(row.keyInteractionLabel),
    oneLine: text(row.oneLine),
    strategy: text(row.strategy),
  }));
}

function buildAnnualFortuneInputs(
  draft: MajorFortuneReportDraft,
): readonly DaeunAnnualFortuneInput[] {
  const annualTenGodByYear = new Map(
    draft.myeongliLayers.tenGodLayer.annualStemTenGodsInCycle.map((item) => [
      item.year,
      text(item.tenGod),
    ]),
  );
  const annualInteractionLabelsByYear = new Map<number, string[]>();

  for (const interaction of draft.myeongliLayers.branchInteractionLayer.interactions) {
    if (interaction.year === null) {
      continue;
    }

    const labels = annualInteractionLabelsByYear.get(interaction.year) ?? [];
    labels.push(formatDaeunInteractionLabel(interaction));
    annualInteractionLabelsByYear.set(interaction.year, labels);
  }

  return draft.majorFortuneTimelineRows.map((row) => ({
    year: row.year,
    ganji: text(row.annualGanji),
    stemTenGod: annualTenGodByYear.get(row.year) ?? text(row.annualTenGodLabel),
    interactions: annualInteractionLabelsByYear.get(row.year) ?? [],
  }));
}

function formatDaeunInteractionLabel(
  interaction: MajorFortuneReportDraft["myeongliLayers"]["branchInteractionLayer"]["interactions"][number],
): string {
  return text(`${interaction.type}: ${interaction.plainType}`);
}

function parseAgeLabel(ageLabel: string | null): number | null {
  if (ageLabel === null) {
    return null;
  }

  const parsedAge = Number.parseInt(ageLabel, 10);

  return Number.isFinite(parsedAge) ? parsedAge : null;
}

function parseNumberRange(label: string): {
  readonly start: number;
  readonly end: number;
} | null {
  const matches = label.match(/\d+/gu);

  if (matches === null || matches.length < 2) {
    return null;
  }

  const start = Number.parseInt(matches[0] ?? "", 10);
  const end = Number.parseInt(matches[1] ?? "", 10);

  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return null;
  }

  return { start, end };
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
  const branchInteractions = layers.branchInteractionLayer.interactions
    .slice(0, 5)
    .map(
      (interaction) =>
        `${interaction.type}: ${interaction.plainType} - ${interaction.plain}`,
    )
    .filter(isVisibleText);
  const auxiliaryStars = layers.auxiliaryStarsLayer
    .map((star) =>
      star.caution === null
        ? `${star.label}: ${star.plain}`
        : `${star.label}: ${star.plain} ${star.caution}`,
    )
    .filter(isVisibleText)
    .filter(
      (item) =>
        !item.includes("생활 장면으로만 조심스럽게 참고합니다") &&
        item.length >= 28,
    )
    .slice(0, 5);
  const hasMyeongliContent =
    isVisibleText(layers.tenGodLayer.plain) &&
    isVisibleText(layers.elementLayer.plain) &&
    (isVisibleText(layers.branchInteractionLayer.plain) ||
      branchInteractions.length > 0) &&
    isVisibleText(layers.hiddenStemLayer.plain);

  if (!hasMyeongliContent) {
    return null;
  }

  return (
    <section className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <h2 className="text-lg font-semibold text-neutral-50">명리 근거</h2>
      <div className="mt-4 grid gap-3">
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">1. 십성</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.tenGodLayer.plain)}
          </p>
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">2. 오행</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.elementLayer.plain)}
          </p>
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">3. 지지 작용</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.branchInteractionLayer.plain)}
          </p>
          {renderList(branchInteractions)}
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">4. 지장간</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-300">
            {text(layers.hiddenStemLayer.plain)}
          </p>
        </section>
        <section className="rounded-md border border-neutral-800 bg-neutral-900/70 p-4">
          <h3 className="text-sm font-semibold text-sky-100">
            5. 신살·귀인 참고
          </h3>
          {auxiliaryStars.length === 0 ? (
            <p className="mt-2 text-sm leading-6 text-neutral-300">
              원국의 귀인·살은 사용자용으로 안전한 항목만 생활 작용으로 번역합니다.
            </p>
          ) : (
            renderList(auxiliaryStars)
          )}
        </section>
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
          대운 리포트
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
            <dd className="text-neutral-100">대운 리포트</dd>
          </div>
        </dl>
      )}

      {renderCurrentSituation(draft)}
      {renderCycleBasis(draft)}
      {renderDaeunFortuneTable(draft)}

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
