import type { ReactNode } from "react";

import { DaeunFortuneTable } from "../../../components/report-tables";
import type { MajorFortuneReportDraft } from "../../../lib/report-generation/majorFortuneReportDraftTypes";
import {
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

const panelClass =
  "min-w-0 rounded-[8px] border border-[#ded2c2] bg-[#fffaf1] p-5 shadow-[0_16px_40px_rgba(62,45,35,0.08)]";
const mutedPanelClass =
  "min-w-0 rounded-[8px] border border-[#e5dbcc] bg-[#fbf6ee] p-4 text-sm leading-7 break-words text-[#5f554b]";
const sectionTitleClass =
  "text-xl font-semibold tracking-normal text-[#2b211b] sm:text-2xl";
const fiveElementLabelByValue: Record<string, string> = {
  wood: "목",
  fire: "화",
  earth: "토",
  metal: "금",
  water: "수",
};

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
  className = "space-y-2 text-sm leading-7 break-words text-[#51463c]",
) {
  const visibleItems = items.map(text).filter(Boolean);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {visibleItems.map((item) => (
        <li key={item} className="flex min-w-0 gap-2">
          <span className="mt-[0.72em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#9f7a2d]" />
          <span className="min-w-0 break-words">{item}</span>
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
    <div className="space-y-3 break-words text-[15px] leading-8 text-[#4f453c]">
      {visibleItems.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

function compactSentence(value: string | null | undefined): string {
  const visibleValue = text(value);

  if (!visibleValue) return "";

  return visibleValue.split(/[.!?。]\s*|[.。]\s*/u)[0]?.trim() || visibleValue;
}

function formatKoreanAgeText(value: string | number | null | undefined): string {
  const visibleValue = typeof value === "number" ? `${value}세` : text(value);

  if (!visibleValue) return "";
  if (visibleValue.includes("한국나이")) return visibleValue;
  if (visibleValue.includes("세")) return `한국나이 ${visibleValue}`;

  return visibleValue;
}

function formatSignalList(values: readonly string[] | undefined): string {
  const visibleValues = values?.map(text).filter(Boolean) ?? [];
  return visibleValues.length > 0 ? visibleValues.join(" · ") : "뚜렷한 신호는 본문 해석에서 보완합니다.";
}

function explainMyeongliSignal(value: string | null | undefined): string {
  const signal = text(value);

  if (!signal) return "";
  if (/장면|흐름|누적|조율|압박|회복|기준/.test(signal) && signal.length > 18) {
    return signal;
  }
  if (/辰申.*반합|申辰.*반합/u.test(signal)) {
    return `${signal}: 생각과 회복, 정보 흐름이 부분적으로 살아나는 장면입니다. 좋게 쓰면 판단 재료가 늘고, 과하면 결론이 늦어질 수 있습니다.`;
  }
  if (/卯辰.*해|辰卯.*해/u.test(signal)) {
    return `${signal}: 크게 터지는 충돌보다 작지만 반복되는 어긋남과 누적 피로로 보기 쉽습니다.`;
  }
  if (/辰辰.*형/u.test(signal)) {
    return `${signal}: 스스로 기준을 높이고 압박을 반복해서 키우는 장면으로 해석합니다.`;
  }
  if (signal.includes("충")) {
    return `${signal}: 익숙한 구조와 새 요구가 부딪혀 역할, 계약, 일정 기준을 다시 맞춰야 하는 장면입니다.`;
  }
  if (signal.includes("해")) {
    return `${signal}: 겉으로 크게 부딪히지 않아도 불편감이 천천히 쌓일 수 있는 지점입니다.`;
  }
  if (signal.includes("형")) {
    return `${signal}: 반복 압박이 커지기 쉬워 기준을 좁히고 회복 시간을 먼저 확보해야 하는 장면입니다.`;
  }
  if (signal.includes("파")) {
    return `${signal}: 기존 방식이 깨지고 다시 맞춰야 하는 장면이 생기기 쉬운 흐름입니다.`;
  }
  if (signal.includes("반합")) {
    return `${signal}: 일부 흐름이 살아나지만 결론까지 가려면 속도와 기준 조율이 필요한 장면입니다.`;
  }
  if (signal.includes("삼합")) {
    return `${signal}: 같은 방향의 힘이 커져 장점과 과열이 함께 생길 수 있는 흐름입니다.`;
  }
  if (signal.includes("합")) {
    return `${signal}: 약속, 관계, 일정이 묶이며 실제 움직임이 생기기 쉬운 흐름입니다.`;
  }

  return signal;
}

function formatFiveElementValues(
  values: readonly string[] | undefined,
  fallback: string | null | undefined,
): string {
  const visibleValues = values
    ?.map((value) => fiveElementLabelByValue[text(value).toLowerCase()] ?? text(value))
    .filter(Boolean);

  if (visibleValues && visibleValues.length > 0) {
    return visibleValues.join(" · ");
  }

  return text(fallback);
}

function renderPill(label: string, value: string | number | null | undefined) {
  const visibleValue = typeof value === "number" ? String(value) : text(value);

  if (!visibleValue) {
    return null;
  }

  return (
    <div className="min-w-0 rounded-[8px] border border-[#e4d8c8] bg-[#fffdf8] px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#95733a]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#2f251f]">{visibleValue}</p>
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
            formatKoreanAgeText(
              currentCycle?.ageRange ?? draft.cycleSummary.ageRangeLabel,
            ),
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
    compactSentence(mbtiBasis?.decisionPattern),
    compactSentence(mbtiBasis?.workPattern),
    evidencePacket === undefined ? compactSentence(draft.mbtiExpression) : "",
  ].filter(Boolean).slice(0, 3);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">기초 정보</p>
        <h2 className={sectionTitleClass}>대운 해석에 쓰는 기본 표</h2>
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-2">
        <div className={panelClass}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#2b211b]">기초 만세력</h3>
            <p className="mt-1 text-sm leading-6 text-[#76685c]">
              원국이 연결되면 대운 해석의 기준이 되는 사주 원국표를 함께 표시합니다.
            </p>
          </div>
          {manseRyeokTable ?? (
            <div className={mutedPanelClass}>
              원국표 데이터가 연결되면 이 영역에 기초 만세력을 표시합니다.
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
                  MBTI가 연결되면 행동 발현 방식만 짧게 요약합니다.
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
        {renderPill(
          "오행 초점",
          formatFiveElementValues(currentCycle?.elementFocus, draft.cycleSummary.elementLabel),
        )}
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

function renderTenYearSummary(draft: MajorFortuneReportDraft, evidencePacket: MajorFortuneEvidencePacket | undefined) {
  const summary = [
    text(evidencePacket?.tenYearFlowSummary?.headline),
    text(evidencePacket?.tenYearFlowSummary?.summary),
    evidencePacket === undefined ? text(draft.tenYearTheme) : "",
    evidencePacket === undefined ? text(draft.openingSummary) : "",
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
    interactions: evidencePacket?.branchInteractions.map((interaction) =>
      explainMyeongliSignal(interaction.plain),
    ),
  };
}

function buildTimelineYearDetail(
  row: MajorFortuneReportDraft["majorFortuneTimelineRows"][number],
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
): NonNullable<DaeunTimelineYearInput["yearDetail"]> {
  const cycleYear = draft.cycleYearTimeline.find((year) => year.year === row.year);
  const mbtiLine =
    text(row.yearDetail?.mbtiExpression) ||
    text(draft.mbtiExpression) ||
    text(evidencePacket?.mbtiBasis?.decisionPattern) ||
    "MBTI는 대운의 원인이 아니라 판단 속도와 실행 방식으로 드러나는 보조 신호입니다.";

  return {
    myeongliSummary:
      text(row.yearDetail?.myeongliSummary) ||
      `${row.year}년 ${text(row.annualGanji)} 연운은 ${text(row.annualTenGodLabel)} 흐름으로 ${text(cycleYear?.headline) || text(row.oneLine)} 장면을 강조합니다.`,
    daeunAnnualRelation:
      text(row.yearDetail?.daeunAnnualRelation) ||
      text(cycleYear?.roleOfYearInCycle) ||
      `${text(row.majorGanji)} 대운 위에 ${text(row.annualGanji)} 연운이 올라와 단기 자극을 만듭니다.`,
    natalAnnualRelation:
      text(row.yearDetail?.natalAnnualRelation) ||
      explainMyeongliSignal(row.keyInteractionLabel) ||
      text(cycleYear?.whyItMatters),
    careerWork:
      text(row.yearDetail?.careerWork) ||
      text(draft.careerWorkFlow?.summary) ||
      "직업·일에서는 맡을 역할과 성과 기준을 먼저 좁혀야 합니다.",
    moneyResource:
      text(row.yearDetail?.moneyResource) ||
      text(draft.moneyResourceFlow?.summary) ||
      "돈·자원에서는 지출, 계약, 정산 기준을 숫자로 확인해야 합니다.",
    relationshipLove:
      text(row.yearDetail?.relationshipLove) ||
      text(draft.relationshipFlow?.summary) ||
      "관계·연애에서는 감정보다 연락, 거리, 약속 기준이 체감에 크게 작동합니다.",
    healthRoutine:
      text(row.yearDetail?.healthRoutine) ||
      text(draft.healthRoutineFlow?.summary) ||
      "건강관리·생활 리듬에서는 수면, 식사, 회복 시간을 일정처럼 고정합니다.",
    socialFamily:
      text(row.yearDetail?.socialFamily) ||
      text(draft.finalAdvice.find((advice) => /인간관계|연애·가족/.test(advice.label))?.body) ||
      "사회·가족에서는 역할 기대와 생활 반경의 경계를 먼저 맞춰야 합니다.",
    studyGrowth:
      text(row.yearDetail?.studyGrowth) ||
      text(draft.finalAdvice.find((advice) => /학업|자격/.test(advice.label))?.body) ||
      "공부·성장에서는 배운 내용을 문서, 자격, 포트폴리오처럼 남기는 방식이 좋습니다.",
    mbtiExpression: mbtiLine,
    caution:
      text(row.yearDetail?.caution) ||
      text(row.strategy) ||
      "주의할 점은 특정 사건 예언이 아니라 반복되는 피로와 과부하 관리입니다.",
    actionStandard:
      text(row.yearDetail?.actionStandard) ||
      text(cycleYear?.strategicFocus) ||
      text(row.strategy) ||
      "그해 먼저 고정할 역할, 돈 기준, 회복 루틴을 하나씩 정합니다.",
  };
}

function buildTimelineYearInputs(
  draft: MajorFortuneReportDraft,
  evidencePacket: MajorFortuneEvidencePacket | undefined,
): DaeunTimelineYearInput[] {
  return draft.majorFortuneTimelineRows.map((row) => {
    const rowAgeRange = parseAgeLabel(row.ageLabel);

    return {
      year: row.year,
      age: rowAgeRange?.start,
      ageLabel: formatKoreanAgeText(row.ageLabel),
      isCurrentYear: row.isCurrentYear,
      isCycleStartYear: row.isCycleStartYear,
      isTransitionYear: row.isCycleStartYear || row.isCycleEndYear,
      badges: row.badges,
      majorGanji: row.majorGanji,
      annualGanji: row.annualGanji,
      annualTenGodLabel: row.annualTenGodLabel,
      keyInteractionLabel: explainMyeongliSignal(row.keyInteractionLabel),
      oneLine: row.oneLine,
      strategy: row.strategy,
      yearDetail: buildTimelineYearDetail(row, draft, evidencePacket),
    };
  });
}

function buildAnnualFortuneInputs(draft: MajorFortuneReportDraft): DaeunAnnualFortuneInput[] {
  return draft.majorFortuneTimelineRows.map((annual) => ({
    year: annual.year,
    ganji: annual.annualGanji,
    stemTenGod: annual.annualTenGodLabel,
    interactions: annual.keyInteractionLabel
      ? [explainMyeongliSignal(annual.keyInteractionLabel)]
      : [],
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
    timelineYears: buildTimelineYearInputs(draft, evidencePacket),
    annualFortunes: buildAnnualFortuneInputs(draft),
  });

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-[#8b6d2d]">대운 타임라인</p>
        <h2 className={sectionTitleClass}>10년 연도별 상세 흐름</h2>
        <p className="mt-2 text-sm leading-7 text-[#76685c]">
          대운·연운 비교를 먼저 확인한 뒤, 각 연도를 열어 직업·돈·관계·생활 리듬·MBTI
          발현 방식까지 함께 봅니다.
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
          ? `${text(mbtiBasis?.type)}가 이 대운을 쓰는 방식`
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
        {renderAnnualCross(draft, evidencePacket)}
        {renderTenYearSummary(draft, evidencePacket)}
        {renderDaeunFortuneTable(draft, evidencePacket)}
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
