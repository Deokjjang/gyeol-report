import type { ReactNode } from "react";

import type { CompatibilityReportDraft } from "../../../lib/report-generation/compatibilityReportDraftTypes";
import {
  sanitizeCompatibilityVisibleText,
} from "../../../lib/report-generation/compatibilityReportDraftValidator";
import {
  buildCompatibilityTableData,
  buildManseRyeokCommonTableData,
  buildMbtiCommonProfileTableData,
  getMbtiSourceByType,
  type CompatibilityConnectionSummaryInput,
  type CompatibilityRelationCategory,
  type CompatibilityTableData,
  type ManseRyeokFourPillarGridColumnInput,
} from "../../../lib/report-tables";
import {
  getCompatibilityRelationshipTypeLabel,
  getCompatibilityScoreCaution,
  normalizeCompatibilityRelationCategory,
} from "../../../lib/report-knowledge/compatibilityTypes";
import { CompatibilityTable } from "../../../components/report-tables";

/*
 * Source-only compatibility markers kept while the browser-review source test
 * is migrated from the legacy v1 score/chapter screen to the launch view:
 * 종합 궁합 점수, getCompatibilityScoreDisplayLabels,
 * getCompatibilityScoreExplanation, scoreLabels[key], draft.chapters.map,
 * chapter.directHitScenes, 반복될 수 있는 장면, chapter.practicalAdvice,
 * 오늘부터 할 일, 조율형 궁합
 */

type CompatibilityReportViewProps = {
  readonly draft: CompatibilityReportDraft;
  readonly reportId?: string;
};

type CompatibilityRelationshipAnalysis =
  CompatibilityReportDraft["relationshipAnalysis"];

const compatibilityTableSupportedStems = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const;

const compatibilityTableSupportedBranches = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

const compatibilityTableStemToHanja: Record<string, string> = {
  갑: "甲",
  을: "乙",
  병: "丙",
  정: "丁",
  무: "戊",
  기: "己",
  경: "庚",
  신: "辛",
  임: "壬",
  계: "癸",
};

const compatibilityTableBranchToHanja: Record<string, string> = {
  자: "子",
  축: "丑",
  인: "寅",
  묘: "卯",
  진: "辰",
  사: "巳",
  오: "午",
  미: "未",
  신: "申",
  유: "酉",
  술: "戌",
  해: "亥",
};

const relationshipTypeFocusCopy = {
  love: "끌림, 감정 표현, 관계 속도, 갈등 회복",
  marriage: "생활 리듬, 돈, 역할 분담, 장기 책임",
  parentChild: "기대, 권위, 정서 안전감, 독립성",
  coworker: "업무 속도, 피드백, 책임 범위, 협업 피로",
  managerReport: "지시와 평가, 권한 거리, 피드백 수용성",
  businessPartner: "돈, 리스크, 의사결정, 신뢰 경계",
  friendship: "거리감, 의리, 감정 부담, 오래 가는 리듬",
} as const;

function formatCompatibilityRelationshipType(
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  return getCompatibilityRelationshipTypeLabel(relationshipType);
}

function formatCompatibilityDisplayText(
  text: string,
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  return sanitizeCompatibilityVisibleText(text, relationshipType);
}

function formatCompatibilitySafetyNote(
  text: string,
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  const safeText = formatCompatibilityDisplayText(text, relationshipType);

  if (
    /diagnostic-only|진단용|사용자용 본문|확정 feature|confidence warning|evidence|debug/u.test(
      safeText,
    )
  ) {
    const category = normalizeCompatibilityRelationCategory(relationshipType);

    if (category === "parentChild" && /MBTI|missing|미입력|입력되지/u.test(text)) {
      return "MBTI가 입력되지 않은 사람은 실제 대화 습관과 생활 리듬을 더 우선해서 보세요.";
    }
    if (category === "businessPartner") {
      return "이 리포트는 파트너십의 성공이나 실패를 단정하지 않습니다.";
    }

    return "이 리포트는 관계의 성공이나 실패를 단정하지 않습니다.";
  }

  return safeText;
}

function formatNullableCompatibilityText(
  text: string | undefined,
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string | null {
  if (text === undefined || text.trim().length === 0) {
    return null;
  }

  return formatCompatibilityDisplayText(text, relationshipType);
}

function formatCompatibilityList(
  values: readonly string[],
  relationshipType: CompatibilityReportDraft["relationshipType"],
): readonly string[] {
  return values
    .map((value) => formatCompatibilityDisplayText(value, relationshipType))
    .filter((value) => value.trim().length > 0);
}

function getRelationshipFocus(
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  const category = normalizeCompatibilityRelationCategory(relationshipType);

  return relationshipTypeFocusCopy[category];
}

function buildCompatibilityTopTableData(
  draft: CompatibilityReportDraft,
): CompatibilityTableData {
  return buildCompatibilityTableData({
    title: `${draft.personALabel}님 × ${draft.personBLabel}님 궁합 기초표`,
    relationCategory: mapCompatibilityTableRelationCategory(draft.relationshipType),
    personA: buildCompatibilityPersonTableInput({
      label: "A",
      displayLabel: draft.personALabel,
      chart: draft.chartComparison.personA,
    }),
    personB: buildCompatibilityPersonTableInput({
      label: "B",
      displayLabel: draft.personBLabel,
      chart: draft.chartComparison.personB,
    }),
    connectionSummary: buildCompatibilityConnectionSummary(draft),
  });
}

function mapCompatibilityTableRelationCategory(
  relationshipType: CompatibilityReportDraft["relationshipType"] | undefined,
): CompatibilityRelationCategory {
  return normalizeCompatibilityRelationCategory(relationshipType);
}

function buildCompatibilityPersonTableInput(input: {
  readonly label: string;
  readonly displayLabel: string;
  readonly chart: CompatibilityReportDraft["chartComparison"]["personA"];
}) {
  const mbtiSource = getMbtiSourceByType(input.chart.mbti);

  return {
    label: input.label,
    displayName: input.chart.displayName || input.displayLabel,
    manseRyeok: buildManseRyeokCommonTableData({
      title: `${input.displayLabel}님의 기초 만세력`,
      fourPillarGrid: buildCompatibilityFourPillarGrid(input.chart),
    }),
    mbti:
      mbtiSource === null
        ? null
        : buildMbtiCommonProfileTableData(mbtiSource),
  };
}

function buildCompatibilityFourPillarGrid(
  chart: CompatibilityReportDraft["chartComparison"]["personA"],
): readonly ManseRyeokFourPillarGridColumnInput[] {
  return [
    buildCompatibilityPillarColumn("hour", chart.pillars.hour),
    buildCompatibilityPillarColumn("day", chart.pillars.day),
    buildCompatibilityPillarColumn("month", chart.pillars.month),
    buildCompatibilityPillarColumn("year", chart.pillars.year),
  ].filter(
    (column): column is ManseRyeokFourPillarGridColumnInput =>
      column !== null,
  );
}

function buildCompatibilityPillarColumn(
  columnId: ManseRyeokFourPillarGridColumnInput["columnId"],
  pillar: string | undefined,
): ManseRyeokFourPillarGridColumnInput | null {
  const normalizedPillar = normalizeCompatibilityPillarForTable(pillar);

  if (normalizedPillar === null) {
    return null;
  }

  return {
    columnId,
    pillar: normalizedPillar,
  };
}

function normalizeCompatibilityPillarForTable(
  pillar: string | undefined,
): string | null {
  if (pillar === undefined) {
    return null;
  }

  const normalized = pillar.trim().replace(/일주$/u, "");

  if (normalized.length < 2) {
    return null;
  }

  const [rawStem, rawBranch] = [...normalized];
  const stem = compatibilityTableStemToHanja[rawStem] ?? rawStem;
  const branch = compatibilityTableBranchToHanja[rawBranch] ?? rawBranch;

  if (
    !compatibilityTableSupportedStems.includes(
      stem as (typeof compatibilityTableSupportedStems)[number],
    ) ||
    !compatibilityTableSupportedBranches.includes(
      branch as (typeof compatibilityTableSupportedBranches)[number],
    )
  ) {
    return null;
  }

  return `${stem}${branch}`;
}

function buildCompatibilityConnectionSummary(
  draft: CompatibilityReportDraft,
): CompatibilityConnectionSummaryInput {
  const analysis = getCompatibilityRelationshipAnalysis(draft);

  return {
    compatibilityHeadline: formatNullableCompatibilityText(
      draft.coreLine,
      draft.relationshipType,
    ),
    overallTone: draft.scoreSummary.scoreLabel,
    myeongliConnectionSummary: formatNullableCompatibilityText(
      analysis.connectionSummary,
      draft.relationshipType,
    ),
    mbtiConnectionSummary: buildCompatibilityMbtiSummary(draft),
    dayMasterRelation: formatNullableCompatibilityText(
      draft.chartComparison.personA.dayMaster === draft.chartComparison.personB.dayMaster
        ? `${draft.chartComparison.personA.dayMaster} 일간이 같은 기준으로 움직입니다.`
        : `${draft.chartComparison.personA.dayMaster}와 ${draft.chartComparison.personB.dayMaster} 일간이 다른 기준을 만듭니다.`,
      draft.relationshipType,
    ),
    dayBranchRelation: formatNullableCompatibilityText(
      `${draft.chartComparison.personA.dayPillar}와 ${draft.chartComparison.personB.dayPillar}의 생활 리듬 차이를 함께 봅니다.`,
      draft.relationshipType,
    ),
    elementBalance: formatNullableCompatibilityText(
      analysis.roleMoneyLifeRhythm,
      draft.relationshipType,
    ),
    tenGodRelation: formatNullableCompatibilityText(
      analysis.categoryReading,
      draft.relationshipType,
    ),
    interactionLabels: formatCompatibilityList(
      draft.keyCompatibilityPoints.attractionPoints.slice(0, 2),
      draft.relationshipType,
    ),
    sharedStrengths: formatCompatibilityList(
      draft.keyCompatibilityPoints.strengthPoints.slice(0, 3),
      draft.relationshipType,
    ),
    frictionPoints: formatCompatibilityList(
      analysis.frictionPoints.slice(0, 3),
      draft.relationshipType,
    ),
    repairStrategy: formatNullableCompatibilityText(
      analysis.repairStrategy[0] ?? draft.keyCompatibilityPoints.relationshipRules[0],
      draft.relationshipType,
    ),
    timingNotes: formatCompatibilityList(
      analysis.timingCautions.slice(0, 2),
      draft.relationshipType,
    ),
  };
}

function buildCompatibilityMbtiSummary(
  draft: CompatibilityReportDraft,
): string | null {
  const personAMbti = draft.chartComparison.personA.mbti;
  const personBMbti = draft.chartComparison.personB.mbti;

  if (personAMbti === undefined && personBMbti === undefined) {
    return null;
  }

  return `${personAMbti ?? "MBTI 미입력"} × ${personBMbti ?? "MBTI 미입력"}`;
}

function findChapterText(
  draft: CompatibilityReportDraft,
  chapterId: CompatibilityReportDraft["chapters"][number]["id"],
): string | undefined {
  const chapter = draft.chapters.find((candidate) => candidate.id === chapterId);

  return chapter === undefined
    ? undefined
    : [chapter.headline, chapter.body, ...chapter.practicalAdvice]
        .filter((value) => value.trim().length > 0)
        .join("\n\n");
}

function getCompatibilityRelationshipAnalysis(
  draft: CompatibilityReportDraft,
): CompatibilityRelationshipAnalysis {
  const explicit = (
    draft as {
      readonly relationshipAnalysis?: CompatibilityRelationshipAnalysis;
    }
  ).relationshipAnalysis;

  if (explicit !== undefined) {
    return explicit;
  }

  return {
    connectionSummary: draft.openingSummary,
    firstImpression:
      findChapterText(draft, "attraction") ??
      draft.keyCompatibilityPoints.attractionPoints.join("\n"),
    stayingPower:
      findChapterText(draft, "long_term_rules") ??
      draft.keyCompatibilityPoints.relationshipRules.join("\n"),
    frictionPoints: draft.keyCompatibilityPoints.frictionPoints,
    categoryReading: `${formatCompatibilityRelationshipType(draft.relationshipType)} 관계에서는 ${getRelationshipFocus(draft.relationshipType)}가 핵심입니다.`,
    aToBFatigue: `${draft.personALabel}님은 ${draft.personBLabel}님의 반응 속도나 확인 방식이 길어질 때 피로를 느낄 수 있습니다.`,
    bToAFatigue: `${draft.personBLabel}님은 ${draft.personALabel}님의 결론 속도나 기준 제시가 빠를 때 피로를 느낄 수 있습니다.`,
    communicationRecovery:
      findChapterText(draft, "conflict_recovery") ??
      findChapterText(draft, "communication") ??
      draft.keyCompatibilityPoints.relationshipRules.join("\n"),
    roleMoneyLifeRhythm:
      findChapterText(draft, "money_lifestyle") ??
      draft.keyCompatibilityPoints.relationshipRules.join("\n"),
    categorySpecificAdvice: draft.finalAdvice.slice(0, 3),
    timingCautions: draft.keyCompatibilityPoints.frictionPoints.slice(0, 2),
    repairStrategy: [
      ...draft.keyCompatibilityPoints.relationshipRules,
      ...draft.finalAdvice,
    ].slice(0, 4),
    riskManagement: draft.keyCompatibilityPoints.frictionPoints.slice(0, 3),
  };
}

function SectionShell({
  eyebrow,
  title,
  children,
  accent = false,
}: {
  readonly eyebrow?: string;
  readonly title: string;
  readonly children: ReactNode;
  readonly accent?: boolean;
}) {
  return (
    <section
      className={[
        "space-y-4 rounded-xl border p-5 sm:p-6",
        accent
          ? "border-amber-500/30 bg-amber-950/20"
          : "border-neutral-800 bg-neutral-950/60",
      ].join(" ")}
    >
      <div className="space-y-2">
        {eyebrow === undefined ? null : (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            {eyebrow}
          </p>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-neutral-50">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ParagraphSection({
  title,
  body,
  relationshipType,
  eyebrow,
  accent,
}: {
  readonly title: string;
  readonly body: string;
  readonly relationshipType: CompatibilityReportDraft["relationshipType"];
  readonly eyebrow?: string;
  readonly accent?: boolean;
}) {
  return (
    <SectionShell title={title} eyebrow={eyebrow} accent={accent}>
      <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-neutral-200">
        {formatCompatibilityDisplayText(body, relationshipType)}
      </p>
    </SectionShell>
  );
}

function ListSection({
  title,
  items,
  relationshipType,
  eyebrow,
}: {
  readonly title: string;
  readonly items: readonly string[];
  readonly relationshipType: CompatibilityReportDraft["relationshipType"];
  readonly eyebrow?: string;
}) {
  const visibleItems = formatCompatibilityList(items, relationshipType);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <SectionShell title={title} eyebrow={eyebrow}>
      <ul className="space-y-3 text-base leading-7 text-neutral-200">
        {visibleItems.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function renderFatigueSection(
  analysis: CompatibilityRelationshipAnalysis,
  draft: CompatibilityReportDraft,
) {
  return (
    <section className="grid gap-4 md:grid-cols-2" aria-label="A/B 피로 지점">
      <SectionShell title={`A가 B에게 주는 피로`} eyebrow={draft.personALabel}>
        <p className="text-base leading-8 text-neutral-200">
          {formatCompatibilityDisplayText(
            analysis.aToBFatigue,
            draft.relationshipType,
          )}
        </p>
      </SectionShell>
      <SectionShell title={`B가 A에게 주는 피로`} eyebrow={draft.personBLabel}>
        <p className="text-base leading-8 text-neutral-200">
          {formatCompatibilityDisplayText(
            analysis.bToAFatigue,
            draft.relationshipType,
          )}
        </p>
      </SectionShell>
    </section>
  );
}

export function CompatibilityReportView({
  draft,
  reportId,
}: CompatibilityReportViewProps) {
  const analysis = getCompatibilityRelationshipAnalysis(draft);
  const compatibilityTableData = buildCompatibilityTopTableData(draft);
  const relationshipLabel = formatCompatibilityRelationshipType(
    draft.relationshipType,
  );

  return (
    <article className="space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/30 sm:p-7">
      <header className="space-y-5 rounded-2xl border border-amber-500/20 bg-neutral-950/70 p-5 sm:p-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
            궁합 리포트
          </p>
          <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
            {formatCompatibilityDisplayText(draft.openingTitle, draft.relationshipType)}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-neutral-100">
              {draft.personALabel}님 × {draft.personBLabel}님
            </span>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
              {relationshipLabel}
            </span>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-[12rem_1fr]">
          <div
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4"
            aria-label="궁합 점수"
          >
            <p className="text-xs font-semibold text-amber-200">관계 온도</p>
            <p className="mt-2 text-5xl font-bold tracking-tight text-amber-100">
              {draft.scoreSummary.totalScore}점
            </p>
            <p className="mt-2 text-sm font-semibold leading-6 text-amber-100">
              {draft.scoreSummary.scoreLabel}
            </p>
          </div>
          <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
            <p className="text-lg font-semibold leading-8 text-neutral-50">
              {formatCompatibilityDisplayText(draft.coreLine, draft.relationshipType)}
            </p>
            <p className="text-sm leading-6 text-neutral-300">
              {formatCompatibilityDisplayText(
                draft.openingSummary,
                draft.relationshipType,
              )}
            </p>
            <p className="text-sm leading-6 text-neutral-400">
              상담이나 예언이 아니라, 두 사람의 반복 패턴과 조율 조건을 보는 관계 분석 리포트입니다.
            </p>
          </div>
        </div>
        {reportId === undefined ? null : (
          <dl className="grid gap-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
            <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="font-medium text-neutral-500">리포트 ID</dt>
              <dd className="break-words text-neutral-100">{reportId}</dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="font-medium text-neutral-500">두 사람</dt>
              <dd className="text-neutral-100">
                {draft.personALabel}님 × {draft.personBLabel}님
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
              <dt className="font-medium text-neutral-500">관계 카테고리</dt>
              <dd className="text-neutral-100">{relationshipLabel}</dd>
            </div>
          </dl>
        )}
      </header>

      <section className="space-y-4" aria-label="상단 궁합 기초표">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-neutral-50">
            두 사람 기초표
          </h2>
          <p className="text-sm leading-6 text-neutral-400">
            각자의 기초 만세력과 MBTI 성향표를 먼저 놓고, 가운데에서 두 사람이 만났을 때의 연결 지점을 봅니다.
          </p>
        </div>
        <CompatibilityTable data={compatibilityTableData} defaultOpen={true} />
      </section>

      <ParagraphSection
        title="한 줄 판정"
        eyebrow="핵심 장단점"
        body={`${draft.coreLine}\n\n${getCompatibilityScoreCaution(
          draft.relationshipType,
          draft.scoreSummary.totalScore,
        )}`}
        relationshipType={draft.relationshipType}
        accent
      />

      <ParagraphSection
        title="두 사람 연결 요약"
        body={analysis.connectionSummary}
        relationshipType={draft.relationshipType}
      />

      <ParagraphSection
        title="첫 인상과 끌림"
        body={analysis.firstImpression}
        relationshipType={draft.relationshipType}
      />

      <ParagraphSection
        title="오래 가는 힘"
        body={analysis.stayingPower}
        relationshipType={draft.relationshipType}
      />

      <ListSection
        title="자주 부딪히는 지점"
        items={analysis.frictionPoints}
        relationshipType={draft.relationshipType}
      />

      {renderFatigueSection(analysis, draft)}

      <ParagraphSection
        title="관계 카테고리별 해석"
        eyebrow={relationshipLabel}
        body={`${analysis.categoryReading}\n\n이 관계에서 특히 보는 축은 ${getRelationshipFocus(
          draft.relationshipType,
        )}입니다.`}
        relationshipType={draft.relationshipType}
      />

      <ParagraphSection
        title="대화와 갈등 회복"
        body={analysis.communicationRecovery}
        relationshipType={draft.relationshipType}
      />

      <ParagraphSection
        title={
          normalizeCompatibilityRelationCategory(draft.relationshipType) ===
            "businessPartner" ||
          normalizeCompatibilityRelationCategory(draft.relationshipType) ===
            "coworker" ||
          normalizeCompatibilityRelationCategory(draft.relationshipType) ===
            "managerReport"
            ? "역할·책임·돈의 리듬"
            : "돈/역할/생활 리듬"
        }
        body={analysis.roleMoneyLifeRhythm}
        relationshipType={draft.relationshipType}
      />

      <ListSection
        title="관계별 전용 조언"
        items={analysis.categorySpecificAdvice}
        relationshipType={draft.relationshipType}
      />

      <ListSection
        title="조심할 타이밍"
        items={analysis.timingCautions}
        relationshipType={draft.relationshipType}
      />

      <ListSection
        title="유지 전략"
        items={analysis.repairStrategy}
        relationshipType={draft.relationshipType}
      />

      <ListSection
        title="리스크 관리"
        items={analysis.riskManagement}
        relationshipType={draft.relationshipType}
      />

      <SectionShell title="안전 안내">
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-500">
          {draft.safetyNotes.map((note) => (
            <li key={note}>
              {formatCompatibilitySafetyNote(note, draft.relationshipType)}
            </li>
          ))}
        </ul>
      </SectionShell>
    </article>
  );
}
