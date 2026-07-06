import type { ReactNode } from "react";

import { DaeunFortuneTable } from "../../../components/report-tables";
import type { MajorFortuneReportDraft } from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import {
  getMajorFortuneBasisDisplayLabel,
  sanitizeMajorFortuneVisibleText,
} from "../../../lib/report-generation/majorFortuneReportDraftValidator";
import type { MajorFortuneEvidencePacket } from "../../../lib/report-knowledge/majorFortuneTypes";
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
  readonly evidencePacket?: MajorFortuneEvidencePacket;
  readonly manseRyeokTable?: ReactNode;
  readonly mbtiProfileTable?: ReactNode;
};

type DomainFlowKey = keyof MajorFortuneEvidencePacket["domainFlows"];

const domainFlowSections = [
  { key: "careerWork", label: "직업/일" },
  { key: "moneyResource", label: "돈/자원" },
  { key: "relationshipLove", label: "관계/연애" },
  { key: "healthRoutine", label: "건강관리/생활 리듬" },
  { key: "socialFamily", label: "사회/가족" },
  { key: "studyGrowth", label: "공부/성장" },
] as const satisfies ReadonlyArray<{ key: DomainFlowKey; label: string }>;

const panelClass =
  "rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] p-5 shadow-[0_16px_40px_rgba(62,45,35,0.08)]";
const mutedPanelClass =
  "rounded-[8px] border border-[#e5dbcc] bg-[#fbf6ee] p-4 text-sm leading-7 text-[#5f554b]";
const sectionTitleClass =
  "text-xl font-semibold tracking-normal text-[#2b211b] sm:text-2xl";

function text(value: string | number | null | undefined): string {
  return sanitizeMajorFortuneVisibleText(value === undefined || value === null ? "" : String(value)).trim();
}

function isVisibleText(value: string | null | undefined): value is string {
  const sanitized = text(value);
  if (!sanitized) return false;
  return !/백호대살|diagnostic-only|evidence|debug|fixture/i.test(sanitized);
}

function renderList(
  items: readonly (string | number | null | undefined)[],
  className = "space-y-2 text-sm leading-7 text-[#51463c]",
) {
  const visibleItems = items.map(text).filter(Boolean);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {visibleItems.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9f7a2d]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function renderParagraphs(items: readonly (string | null | undefined)[]) {
  const visibleItems = items.map(text).filter(Boolean);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 text-[15px] leading-8 text-[#4f453c]">
      {visibleItems.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function formatSignalList(values: readonly string[] | undefined): string {
  const visibleValues = values?.map(text).filter(Boolean) ?? [];
  return visibleValues.length > 0 ? visibleValues.join(" · ") : "뚜렷한 신호는 본문 해석에서 보완합니다.";
}

function renderPill(label: string, value: string | number | null | undefined) {
  const visibleValue = typeof value === "number" ? String(value) : text(value);

  if (!visibleValue) {
    return null;
  }

  return (
    <div className="rounded-[8px] border border-[#e4d8c8] bg-[#fffdf8] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#95733a]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#2f251f]">{visibleValue}</p>
    </div>
  );
}

function renderHero(
  draft: MajorFortuneReportDraft,
  reportId: string | undefined,
  devStatus: string | undefined,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const name = text(evidencePacket?.personContext.name) || "사용자";
  const currentCycle = evidencePacket?.currentMajorFortune;
  const headline =
    text(draft.headline) ||
    text(draft.openingTitle) ||
    "대운의 긴 흐름과 올해 자극을 함께 읽는 리포트";
  const currentLine =
    text(currentCycle?.keyTheme) ||
    text(draft.currentCycleSummary) ||
    text(draft.decadeArchetype.plain) ||
    "입력된 대운표 기준으로 현재 10년의 방향을 정리합니다.";

  return (
    <header className="overflow-hidden rounded-[8px] border border-[#d9c8b5] bg-[#fffaf1] shadow-[0_22px_70px_rgba(77,48,35,0.12)]">
      <div className="border-b border-[#e6d9c8] bg-[#f4eadc] px-6 py-4">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#7d1f39]">
          <span className="rounded-full border border-[#c8a565] bg-[#fff7df] px-3 py-1 text-[#6f4e16]">
            대운 리포트
          </span>
          <span>{name}님의 10년 흐름</span>
          {reportId ? <span className="text-[#8a8077]">Report {reportId}</span> : null}
          {devStatus ? <span className="text-[#8a8077]">{text(devStatus)}</span> : null}
        </div>
      </div>
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <p className="text-sm font-semibold text-[#8b6d2d]">
          10년 흐름과 올해 세운 교차를 함께 읽는 리포트
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-normal text-[#2b211b] sm:text-4xl">
          {headline}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[#5a4d42]">{currentLine}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {renderPill("현재 대운", currentCycle?.ganji ?? draft.cycleSummary.ganji)}
          {renderPill(
            "나이 구간",
            currentCycle?.ageRange ?? draft.cycleSummary.ageRangeLabel,
          )}
          {renderPill(
            "연도 구간",
            currentCycle?.yearRange ?? draft.cycleSummary.yearRangeLabel,
          )}
        </div>
      </div>
    </header>
  );
}

function renderCommonFoundation(
  manseRyeokTable: ReactNode | undefined,
  mbtiProfileTable: ReactNode | undefined,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
  draft: MajorFortuneReportDraft,
) {
  const mbtiBasis = evidencePacket?.mbtiBasis;
  const mbtiFallback = [
    text(mbtiBasis?.type) ? `${text(mbtiBasis?.type)} · ${text(mbtiBasis?.titleKo || mbtiBasis?.archetype)}` : "",
    text(mbtiBasis?.decisionPattern),
    text(mbtiBasis?.workPattern),
    text(draft.mbtiExpression),
  ].filter(Boolean);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">기초 정보</p>
        <h2 className={sectionTitleClass}>대운 해석에 쓰는 기본 표</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className={panelClass}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#2b211b]">기초 만세력</h3>
            <p className="mt-1 text-sm leading-6 text-[#76685c]">
              원국이 연결되면 대운 해석의 기준이 되는 사주 원국표를 함께 표시합니다.
            </p>
          </div>
          {manseRyeokTable ?? (
            <div className={mutedPanelClass}>
              입력된 대운표와 draft 기준으로 먼저 읽습니다. 원국 데이터가 연결된 결과에서는
              기초 만세력이 이 영역에 표시됩니다.
            </div>
          )}
        </div>
        <div className={panelClass}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#2b211b]">MBTI 성향표</h3>
            <p className="mt-1 text-sm leading-6 text-[#76685c]">
              MBTI는 대운의 원인이 아니라 흐름이 행동과 선택으로 드러나는 방식을 보조합니다.
            </p>
          </div>
          {mbtiProfileTable ?? (
            <div className="space-y-3">
              {mbtiFallback.length > 0 ? (
                renderList(mbtiFallback)
              ) : (
                <div className={mutedPanelClass}>
                  MBTI가 연결되면 의사결정, 일 처리, 관계 반응 방식이 이 영역에 요약됩니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function renderCurrentMajorFortune(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const currentCycle = evidencePacket?.currentMajorFortune;
  const interpretation =
    text(currentCycle?.interpretation) ||
    text(draft.currentCycleSummary) ||
    text(draft.cycleSummary.displayTitle) ||
    text(draft.decadeArchetype.plain);

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">현재 대운 요약</p>
      <h2 className={`${sectionTitleClass} mt-1`}>
        {text(currentCycle?.keyTheme) || text(draft.cycleSummary.displayTitle) || "현재 10년의 중심 흐름"}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {renderPill("대운", currentCycle?.ganji ?? draft.cycleSummary.ganji)}
        {renderPill("천간 십성", currentCycle?.stemTenGod ?? draft.cycleSummary.tenGodLabel)}
        {renderPill("지지 십성", currentCycle?.branchTenGod)}
        {renderPill("오행 초점", currentCycle?.elementFocus?.join(" · ") ?? draft.cycleSummary.elementLabel)}
      </div>
      {interpretation ? <div className="mt-5">{renderParagraphs([interpretation])}</div> : null}
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
          <h3 className="text-sm font-semibold text-[#6f1d35]">도움이 되는 신호</h3>
          <p className="mt-2 text-sm leading-7 text-[#5a4d42]">
            {formatSignalList(currentCycle?.supportSignals)}
          </p>
        </div>
        <div className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
          <h3 className="text-sm font-semibold text-[#6f1d35]">마찰로 느껴질 수 있는 신호</h3>
          <p className="mt-2 text-sm leading-7 text-[#5a4d42]">
            {formatSignalList(currentCycle?.frictionSignals)}
          </p>
        </div>
      </div>
    </section>
  );
}

function renderCycleBasis(draft: MajorFortuneReportDraft) {
  const basis = draft.calculationBasis;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">대운 기준</p>
      <h2 className={`${sectionTitleClass} mt-1`}>입력된 대운표 기준</h2>
      <p className="mt-4 text-[15px] leading-8 text-[#51463c]">
        이 화면은 입력된 대운표를 기준으로 현재 대운, 전체 타임라인, 올해 세운 교차를
        정리합니다. 직접 사건을 예언하기보다 긴 흐름 안에서 선택과 관리 기준을 잡는 데
        초점을 둡니다.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {renderPill("기준 방식", getMajorFortuneBasisDisplayLabel(basis.basisType))}
        {renderPill("나이 기준", basis.ageBasisLabel)}
        {renderPill("표 기준", basis.displayLabel)}
      </div>
      {renderList([basis.explanation, basis.note], "mt-5 space-y-2 text-sm leading-7 text-[#51463c]")}
    </section>
  );
}

function renderTenYearSummary(draft: MajorFortuneReportDraft, evidencePacket: MajorFortuneEvidencePacket | undefined) {
  const summary = [
    text(evidencePacket?.tenYearFlowSummary?.headline),
    text(evidencePacket?.tenYearFlowSummary?.summary),
    text(draft.tenYearTheme),
    text(draft.openingSummary),
    text(draft.previousToCurrentShift.plain),
    ...draft.previousToCurrentShift.whatChanged.map(text),
  ].filter(Boolean);

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">10년 흐름 핵심</p>
      <h2 className={`${sectionTitleClass} mt-1`}>이번 대운이 바꾸는 방향</h2>
      <div className="mt-5">{renderParagraphs(summary)}</div>
      {draft.bigThemes.length > 0 ? (
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {draft.bigThemes.slice(0, 3).map((theme) => (
            <div key={theme.title} className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
              <h3 className="text-sm font-semibold text-[#2f251f]">{text(theme.title)}</h3>
              <p className="mt-2 text-sm leading-7 text-[#5a4d42]">{text(theme.body)}</p>
              <p className="mt-2 text-sm leading-7 text-[#5a4d42]">{text(theme.strategy)}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function buildCurrentDaeunCycleInput(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
): DaeunCurrentCycleInput {
  const current = evidencePacket?.currentMajorFortune;
  const parsedYearRange = parseNumberRange(current?.yearRange ?? draft.cycleSummary.yearRangeLabel);
  const parsedAgeRange = parseAgeLabel(current?.ageRange ?? draft.cycleSummary.ageRangeLabel);

  return {
    ganji: current?.ganji ?? draft.cycleSummary.ganji,
    stem: current?.stem,
    branch: current?.branch,
    stemTenGod: current?.stemTenGod ?? draft.cycleSummary.tenGodLabel,
    branchTenGod: current?.branchTenGod,
    tenGod: current?.stemTenGod ?? draft.cycleSummary.tenGodLabel,
    startYear: parsedYearRange?.start,
    endYear: parsedYearRange?.end,
    startAge: parsedAgeRange?.start,
    endAge: parsedAgeRange?.end,
    interactions: evidencePacket?.branchInteractions.map((interaction) => interaction.plain),
  };
}

function buildTimelineYearInputs(draft: MajorFortuneReportDraft): DaeunTimelineYearInput[] {
  return draft.majorFortuneTimelineRows.map((row) => {
    const rowAgeRange = parseAgeLabel(row.ageLabel);

    return {
      year: row.year,
      age: rowAgeRange?.start,
      ageLabel: row.ageLabel,
      isCurrentYear: row.isCurrentYear,
      isCycleStartYear: row.isCycleStartYear,
      isTransitionYear: row.isCycleStartYear || row.isCycleEndYear,
      badges: row.badges,
      majorGanji: row.majorGanji,
      annualGanji: row.annualGanji,
      annualTenGodLabel: row.annualTenGodLabel,
      keyInteractionLabel: row.keyInteractionLabel,
      oneLine: row.oneLine,
      strategy: row.strategy,
    };
  });
}

function buildAnnualFortuneInputs(draft: MajorFortuneReportDraft): DaeunAnnualFortuneInput[] {
  return draft.majorFortuneTimelineRows.map((annual) => ({
    year: annual.year,
    ganji: annual.annualGanji,
    stemTenGod: annual.annualTenGodLabel,
    interactions: annual.keyInteractionLabel ? [annual.keyInteractionLabel] : [],
  }));
}

function parseAgeLabel(ageLabel: string | null | undefined): { start: number; end?: number } | undefined {
  if (!ageLabel) return undefined;

  const rangeMatch = ageLabel.match(/(\d+)\s*[~-]\s*(\d+)/);
  if (rangeMatch) {
    return {
      start: Number(rangeMatch[1]),
      end: Number(rangeMatch[2]),
    };
  }

  const singleMatch = ageLabel.match(/(\d+)/);
  if (singleMatch) {
    return { start: Number(singleMatch[1]) };
  }

  return undefined;
}

function parseNumberRange(value: string | undefined): { start: number; end?: number; label?: string } | undefined {
  if (!value) return undefined;

  const rangeMatch = value.match(/(\d{4})\s*[~-]\s*(\d{4})/);
  if (rangeMatch) {
    return {
      start: Number(rangeMatch[1]),
      end: Number(rangeMatch[2]),
      label: value,
    };
  }

  const singleMatch = value.match(/(\d{4})/);
  if (singleMatch) {
    return {
      start: Number(singleMatch[1]),
      label: value,
    };
  }

  return undefined;
}

function renderDaeunFortuneTable(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const currentYear =
    evidencePacket?.currentYear ??
    draft.majorFortuneTimelineRows.find((row) => row.isCurrentYear)?.year ??
    draft.majorFortuneTimelineRows[0]?.year ??
    new Date().getFullYear();
  const data = buildDaeunFortuneTableData({
    currentYear,
    selectedYear: evidencePacket?.currentAnnualCross.selectedYear ?? currentYear,
    currentDaeunCycle: buildCurrentDaeunCycleInput(draft, evidencePacket),
    timelineYears: buildTimelineYearInputs(draft),
    annualFortunes: buildAnnualFortuneInputs(draft),
  });

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">대운 타임라인</p>
        <h2 className={sectionTitleClass}>전체 대운 흐름표</h2>
        <p className="mt-2 text-sm leading-7 text-[#76685c]">
          현재 대운을 강조하고, 각 대운의 천간·지지·십성·오행과 세운 비교를 함께 봅니다.
        </p>
      </div>
      <DaeunFortuneTable
        data={data}
        defaultOpen
        className="bg-[#fffaf1] text-[#2b211b] shadow-[0_16px_40px_rgba(62,45,35,0.08)]"
      />
    </section>
  );
}

function renderAnnualCross(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const annualCross = evidencePacket?.currentAnnualCross;
  const currentAnnual =
    draft.majorFortuneTimelineRows.find((row) => row.isCurrentYear) ??
    draft.majorFortuneTimelineRows[0];
  const interpretation =
    text(annualCross?.interpretation) ||
    text(draft.annualCrossReading) ||
    text(currentAnnual?.oneLine);
  const annualYear = annualCross?.selectedYear ?? currentAnnual?.year;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">현재 대운·올해 세운 교차</p>
      <h2 className={`${sectionTitleClass} mt-1`}>
        {annualYear ?? "올해"} 세운이 현재 대운 위에 올리는 자극
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {renderPill("올해 간지", annualCross?.annualGanji ?? currentAnnual?.annualGanji)}
        {renderPill("세운 천간 십성", annualCross?.annualStemTenGod ?? currentAnnual?.annualTenGodLabel)}
        {renderPill("대운↔세운", annualCross?.cycleToAnnualRelation ?? currentAnnual?.keyInteractionLabel)}
        {renderPill("원국↔세운", annualCross?.natalToAnnualRelation)}
      </div>
      <div className="mt-5">{renderParagraphs([interpretation, annualCross?.caution])}</div>
      {renderList([annualCross?.annualFocus], "mt-5 space-y-2 text-sm leading-7 text-[#51463c]")}
    </section>
  );
}

function getDraftDomainFallback(draft: MajorFortuneReportDraft, key: DomainFlowKey) {
  if (key === "careerWork") return draft.careerWorkFlow;
  if (key === "moneyResource") return draft.moneyResourceFlow;
  if (key === "relationshipLove") return draft.relationshipFlow;
  if (key === "healthRoutine") return draft.healthRoutineFlow;
  if (key === "socialFamily") {
    return draft.finalAdvice.find((item) => /관계|가족|사회/.test(item.label));
  }
  return draft.finalAdvice.find((item) => /공부|성장|학업|자격/.test(item.label));
}

function renderDomainFlows(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">영역별 흐름</p>
        <h2 className={sectionTitleClass}>대운이 생활 영역에 드러나는 방식</h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {domainFlowSections.map(({ key, label }) => {
          const evidenceFlow = evidencePacket?.domainFlows[key];
          const draftFlow = getDraftDomainFallback(draft, key);
          const draftTitle = draftFlow && "title" in draftFlow ? draftFlow.title : draftFlow?.label;
          const draftSummary =
            draftFlow && "summary" in draftFlow ? draftFlow.summary : draftFlow?.body;
          const draftActionHint =
            draftFlow && "actionHint" in draftFlow ? draftFlow.actionHint : undefined;
          const title = text(evidenceFlow?.title) || text(draftTitle) || label;
          const summary = text(evidenceFlow?.summary) || text(draftSummary);
          const actionHint = text(evidenceFlow?.actionHint) || text(draftActionHint);
          const supportingSignals = evidenceFlow?.supportingSignals ?? [];
          const frictionSignals = evidenceFlow?.frictionSignals ?? [];

          return (
            <article key={key} className={panelClass}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9f7a2d]">
                {label}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[#2b211b]">{title}</h3>
              <div className="mt-3">{renderParagraphs([summary, actionHint])}</div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-3">
                  <p className="text-xs font-semibold text-[#6f1d35]">살릴 흐름</p>
                  <p className="mt-1 text-sm leading-6 text-[#5a4d42]">{formatSignalList(supportingSignals)}</p>
                </div>
                <div className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-3">
                  <p className="text-xs font-semibold text-[#6f1d35]">관리할 흐름</p>
                  <p className="mt-1 text-sm leading-6 text-[#5a4d42]">{formatSignalList(frictionSignals)}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function renderMbtiExpression(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const mbtiBasis = evidencePacket?.mbtiBasis;
  const traits = [
    mbtiBasis?.decisionPattern,
    mbtiBasis?.workPattern,
    mbtiBasis?.relationshipPattern,
    mbtiBasis?.growthPattern,
    ...(mbtiBasis?.coreTraits ?? []),
  ].filter(isVisibleText);

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">MBTI 성향 발현 방식</p>
      <h2 className={`${sectionTitleClass} mt-1`}>
        {text(mbtiBasis?.type)
          ? `${text(mbtiBasis?.type)} 성향이 대운을 쓰는 방식`
          : "흐름이 행동으로 드러나는 방식"}
      </h2>
      <div className="mt-5">
        {renderParagraphs([
          draft.mbtiExpression,
          "명리는 긴 흐름의 방향을 잡고, MBTI는 그 흐름이 판단 속도, 일 처리, 관계 반응으로 드러나는 방식을 보조합니다.",
        ])}
      </div>
      {traits.length > 0 ? (
        <div className="mt-5 rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
          <h3 className="text-sm font-semibold text-[#6f1d35]">행동으로 나타나는 신호</h3>
          {renderList(traits.slice(0, 6), "mt-3 space-y-2 text-sm leading-7 text-[#51463c]")}
        </div>
      ) : null}
    </section>
  );
}

function renderRiskPatterns(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const evidenceRisks = evidencePacket?.riskPatterns ?? [];
  const risks =
    evidenceRisks.length > 0
      ? evidenceRisks.map((risk) => ({
          title: risk.title,
          summary: risk.summary,
          action: risk.prevention,
        }))
      : (draft.riskManagement ?? []).map((risk, index) => ({
          title: `관리 기준 ${index + 1}`,
          summary: risk,
          action: "",
        }));

  if (risks.length === 0) return null;

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">조심할 패턴</p>
        <h2 className={sectionTitleClass}>흐름이 부담으로 바뀌는 순간</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {risks.map((risk) => (
          <article key={risk.title} className={panelClass}>
            <h3 className="text-lg font-semibold text-[#2b211b]">{text(risk.title)}</h3>
            <div className="mt-3">{renderParagraphs([risk.summary, risk.action])}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderActionGuides(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const evidenceGuides = evidencePacket?.actionGuides ?? [];
  const guides =
    evidenceGuides.length > 0
      ? evidenceGuides.map((guide) => ({
          title: guide.title,
          summary: guide.action,
          steps: [guide.timingHint],
        }))
      : (draft.actionPlan ?? []).map((guide, index) => ({
          title: `실행 기준 ${index + 1}`,
          summary: guide,
          steps: [],
        }));

  if (guides.length === 0) return null;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">실행 기준</p>
      <h2 className={`${sectionTitleClass} mt-1`}>이번 대운을 실제 선택으로 바꾸는 기준</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {guides.map((guide) => (
          <article key={guide.title} className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
            <h3 className="text-sm font-semibold text-[#2b211b]">{text(guide.title)}</h3>
            <p className="mt-2 text-sm leading-7 text-[#5a4d42]">{text(guide.summary)}</p>
            {renderList(guide.steps ?? [], "mt-3 space-y-2 text-sm leading-7 text-[#51463c]")}
          </article>
        ))}
      </div>
    </section>
  );
}

function renderStrongYears(draft: MajorFortuneReportDraft) {
  if (draft.strongYears.length === 0) return null;

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">체감이 강한 해</p>
      <h2 className={`${sectionTitleClass} mt-1`}>대운 안에서 더 선명하게 느껴지는 연도</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {draft.strongYears.slice(0, 5).map((year) => (
          <article key={`${year.year}-${year.ganji}`} className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg font-semibold text-[#2b211b]">{year.year}</span>
              <span className="rounded-full border border-[#d2b66e] bg-[#fff7df] px-2.5 py-1 text-xs font-semibold text-[#6f4e16]">
                {text(year.ganji)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[#5a4d42]">{text(year.body)}</p>
            <p className="mt-2 text-sm leading-7 text-[#5a4d42]">{text(year.advice)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderMyeongliDetails(draft: MajorFortuneReportDraft) {
  const layers = draft.myeongliLayers;
  const layerItems = [
    {
      title: "십성",
      evidence: layers.tenGodLayer.majorStemTenGod,
      interpretation: layers.tenGodLayer.plain,
    },
    {
      title: "오행",
      evidence: layers.elementLayer.majorElements.join(" · "),
      interpretation: layers.elementLayer.plain,
    },
    {
      title: "합충형파해",
      evidence: layers.branchInteractionLayer.interactions
        .map((interaction) => interaction.plainType)
        .join(" · "),
      interpretation: layers.branchInteractionLayer.plain,
    },
    {
      title: "지장간",
      evidence: layers.hiddenStemLayer.majorBranchHiddenStems.join(" · "),
      interpretation: layers.hiddenStemLayer.plain,
    },
    layers.twelveStageLayer
      ? {
          title: "십이운성",
          evidence: layers.twelveStageLayer.label,
          interpretation: layers.twelveStageLayer.plain,
        }
      : null,
    ...layers.auxiliaryStarsLayer.map((star) => ({
      title: star.label,
      evidence: star.label,
      interpretation: [star.plain, star.caution].filter(Boolean).join(" "),
    })),
  ].filter((item): item is { title: string; evidence: string; interpretation: string } => item !== null);

  return (
    <section className={panelClass}>
      <p className="text-sm font-semibold text-[#8b6d2d]">명리 근거</p>
      <h2 className={`${sectionTitleClass} mt-1`}>대운 해석에 실제로 쓰는 신호</h2>
      <div className="mt-5 space-y-4">
        {layerItems.slice(0, 7).map((layer, index) => (
          <article key={`${layer.title}-${index}`} className="rounded-[8px] border border-[#eadfce] bg-[#fffdf8] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9f7a2d]">
              {index + 1}. {text(layer.title)}
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2b211b]">{text(layer.evidence)}</p>
            <p className="mt-2 text-sm leading-7 text-[#5a4d42]">{text(layer.interpretation)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderSafetyNotes(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
) {
  const notes = evidencePacket?.safetyNotes?.length ? evidencePacket.safetyNotes : draft.safetyNotes;

  return (
    <section className="rounded-[8px] border border-[#ded2c2] bg-[#f8efe3] p-5">
      <p className="text-sm font-semibold text-[#8b6d2d]">안전 안내</p>
      <h2 className={`${sectionTitleClass} mt-1`}>이 리포트를 읽는 기준</h2>
      <div className="mt-4">
        {renderList(notes, "space-y-2 text-sm leading-7 text-[#5a4d42]") ?? (
          <p className="text-sm leading-7 text-[#5a4d42]">
            특정 사건이나 날짜를 예언하지 않고, 10년 흐름 안에서 선택과 관리 기준을 세우는
            참고용 리포트입니다.
          </p>
        )}
      </div>
    </section>
  );
}

export function MajorFortuneReportView({
  draft,
  reportId,
  devStatus,
  evidencePacket,
  manseRyeokTable,
  mbtiProfileTable,
}: MajorFortuneReportViewProps) {
  return (
    <main className="min-w-0 bg-[#f6f0e7] px-4 py-8 text-[#2b211b] sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {renderHero(draft, reportId, devStatus, evidencePacket)}
        {renderCommonFoundation(manseRyeokTable, mbtiProfileTable, evidencePacket, draft)}
        {renderCurrentMajorFortune(draft, evidencePacket)}
        {renderCycleBasis(draft)}
        {renderTenYearSummary(draft, evidencePacket)}
        {renderDaeunFortuneTable(draft, evidencePacket)}
        {renderAnnualCross(draft, evidencePacket)}
        {renderDomainFlows(draft, evidencePacket)}
        {renderMbtiExpression(draft, evidencePacket)}
        {renderStrongYears(draft)}
        {renderMyeongliDetails(draft)}
        {renderRiskPatterns(draft, evidencePacket)}
        {renderActionGuides(draft, evidencePacket)}
        {renderSafetyNotes(draft, evidencePacket)}
      </div>
    </main>
  );
}

export default MajorFortuneReportView;
