import type { CompatibilityReportDraft } from "../../../lib/report-generation/compatibilityReportDraftTypes";
import { CompatibilityTable } from "../../../components/report-tables";
import {
  sanitizeCompatibilityKoreanCopy,
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
  getCompatibilityScoreDisplayLabels,
  getCompatibilityScoreExplanation,
} from "../../../lib/report-knowledge/compatibilityTypes";
import type {
  CompatibilityDeepSajuBridgeResult,
  CompatibilityDeepSajuLayer,
} from "../../../lib/report-knowledge/compatibilityDeepSajuBridge";

type CompatibilityReportViewProps = {
  readonly draft: CompatibilityReportDraft;
  readonly reportId?: string;
};

function formatCompatibilityRelationshipType(
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string {
  return getCompatibilityRelationshipTypeLabel(relationshipType);
}

const compatibilityScoreOrder = [
  "attraction",
  "communication",
  "lifestyleRhythm",
  "conflictRecovery",
  "longTermStability",
  "growthComplement",
] as const satisfies readonly (keyof CompatibilityReportDraft["scoreSummary"]["breakdown"])[];

const finalAdviceAllowedLabelsByRelationshipType = {
  love: [
    "대화 규칙",
    "생활 리듬",
    "감정 표현",
    "갈등 회복",
    "돈과 생활",
    "실행 규칙",
    "관계 속도",
  ],
  some: [
    "대화 규칙",
    "생활 리듬",
    "감정 표현",
    "갈등 회복",
    "돈과 생활",
    "실행 규칙",
    "관계 속도",
  ],
  marriage: [
    "대화 습관",
    "생활 기준",
    "돈과 생활",
    "갈등 회복",
    "역할 분담",
    "장기 운영",
  ],
  friendship: [
    "대화 리듬",
    "거리 조절",
    "도움 방식",
    "오해 회복",
    "경계선",
    "오래 가는 규칙",
  ],
  family: [
    "대화 규칙",
    "생활 기준",
    "도움 요청",
    "갈등 회복",
    "역할 분담",
    "정서 회복",
  ],
  business_work_partner: [
    "의사결정",
    "역할 분담",
    "돈과 자원",
    "피드백 규칙",
    "갈등 조정",
    "신뢰 관리",
    "업무 기준",
  ],
} as const satisfies Record<
  CompatibilityReportDraft["relationshipType"],
  readonly string[]
>;

const finalAdviceLabels = finalAdviceAllowedLabelsByRelationshipType.love;

const finalAdviceKnownPrefixes = [
  "대화 규칙",
  "생활 기준",
  "도움 요청",
  "갈등 회복",
  "실행 규칙",
  "생활 리듬",
  "돈과 생활",
  "돈과 자원",
  "관계 기준",
  "관계 속도",
  "감정 표현",
  "협업 시너지",
  "데이트",
  "연애",
  "거리 조절",
  "대화 습관",
  "대화 리듬",
  "도움 방식",
  "오해 회복",
  "경계선",
  "오래 가는 규칙",
  "역할 분담",
  "장기 운영",
  "정서 회복",
  "피드백 규칙",
  "갈등 조정",
  "업무 기준",
  "의사결정",
  "신뢰 관리",
] as const;

const finalAdviceLabelPriority = [
  "대화 규칙",
  "대화 습관",
  "대화 리듬",
  "생활 기준",
  "생활 리듬",
  "도움 요청",
  "도움 방식",
  "갈등 회복",
  "갈등 조정",
  "오해 회복",
  "돈과 생활",
  "돈과 자원",
  "실행 규칙",
  "관계 속도",
  "역할 분담",
  "의사결정",
  "피드백 규칙",
  "신뢰 관리",
  "업무 기준",
  "거리 조절",
  "감정 표현",
  "경계선",
  "오래 가는 규칙",
  "장기 운영",
  "정서 회복",
] as const;

const finalAdviceConflictMarkers = [
  "서운",
  "갈등",
  "어긋",
  "감정",
  "싸움",
  "불편",
  "회복",
] as const;

const finalAdviceHelpMarkers = [
  "도움",
  "필요",
  "요청",
  "공유",
] as const;

const deepSajuLayerOrder = [
  "day_master_relation",
  "cross_ten_god",
  "element_complement",
  "combined_element_climate",
  "branch_trine",
  "branch_clash",
  "branch_harm",
  "spouse_palace",
  "month_rhythm",
  "hour_life_rhythm",
] as const satisfies readonly CompatibilityDeepSajuLayer[];

const expandedDeepSajuNoteLimit = 4;

const expandedDeepSajuLayerOrder = [
  "day_master_relation",
  "element_complement",
  "combined_element_climate",
  "branch_clash",
  "branch_harm",
  "cross_ten_god",
  "branch_trine",
  "spouse_palace",
  "month_rhythm",
  "hour_life_rhythm",
] as const satisfies readonly CompatibilityDeepSajuLayer[];

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

function renderCompatibilityScoreCards(draft: CompatibilityReportDraft) {
  const scoreLabels = getCompatibilityScoreDisplayLabels(draft.relationshipType);

  return (
    <section className="space-y-4" aria-label="종합 궁합 점수 세부 항목">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {compatibilityScoreOrder.map((key) => (
          <div
            key={key}
            className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-4"
          >
            <p className="text-xs font-semibold text-neutral-500">
              {scoreLabels[key]}
            </p>
            <p className="mt-1 text-2xl font-bold text-neutral-50">
              {draft.scoreSummary.breakdown[key]}
            </p>
            <p className="mt-2 text-xs leading-5 text-neutral-400">
              {getCompatibilityScoreExplanation({
                relationshipType: draft.relationshipType,
                category: key,
                score: draft.scoreSummary.breakdown[key],
              })}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function renderCompatibilityKeyPoints(draft: CompatibilityReportDraft) {
  const groups = [
    ["왜 끌리는지", draft.keyCompatibilityPoints.attractionPoints],
    ["잘 맞는 지점", draft.keyCompatibilityPoints.strengthPoints],
    ["부딪히는 지점", draft.keyCompatibilityPoints.frictionPoints],
    ["관계 규칙", draft.keyCompatibilityPoints.relationshipRules],
  ] as const;

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {groups.map(([title, items]) => (
        <article
          key={title}
          className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
        >
          <h3 className="text-sm font-semibold text-neutral-50">{title}</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
            {items.slice(0, 3).map((item) => (
              <li key={item}>
                {formatCompatibilityDisplayText(item, draft.relationshipType)}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function getDraftDeepSajuBridge(
  draft: CompatibilityReportDraft,
): CompatibilityDeepSajuBridgeResult | undefined {
  return (draft as { readonly deepSajuBridge?: CompatibilityDeepSajuBridgeResult })
    .deepSajuBridge;
}

function renderDeepSajuExplanationSections(
  note: CompatibilityDeepSajuBridgeResult["notes"][number],
  relationshipType: CompatibilityReportDraft["relationshipType"],
) {
  const sections = [
    ["명리학적으로는", note.principleExplanation],
    ["두 사람에게는", note.relationshipTranslation],
    ["좋게 쓰면", note.positiveExpression],
    ["조심할 점", note.riskExpression],
    ["실제 장면", note.everydayScene],
    ["관계 운영법", note.actionRule],
  ] as const;

  return (
    <dl className="mt-3 space-y-3">
      {sections
        .filter(([, body]) => body.trim().length > 0)
        .map(([label, body]) => (
          <div key={label} className="rounded-md border border-neutral-800 bg-neutral-950/50 p-3">
            <dt className="text-xs font-semibold text-amber-200">{label}</dt>
            <dd className="mt-1 text-sm leading-6 text-neutral-300">
              {formatCompatibilityDisplayText(body, relationshipType)}
            </dd>
          </div>
        ))}
    </dl>
  );
}

function getLayerOrderIndex(
  layer: CompatibilityDeepSajuLayer,
  order: readonly CompatibilityDeepSajuLayer[],
): number {
  const index = order.indexOf(layer);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
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

  if (/diagnostic-only|진단용|사용자용 본문|확정 feature|confidence warning|evidence|debug/u.test(
    safeText,
  )) {
    if (relationshipType === "family" && /MBTI|missing|미입력|입력되지/u.test(text)) {
      return "MBTI가 입력되지 않은 사람은 실제 대화 습관과 생활 리듬을 더 우선해서 보세요.";
    }
    if (relationshipType === "business_work_partner") {
      return "이 리포트는 파트너십의 성공이나 실패를 단정하지 않습니다.";
    }

    return "이 리포트는 관계의 성공이나 실패를 단정하지 않습니다.";
  }

  return safeText;
}

function formatTechnicalRelationLabel(relationLabel: string): string {
  return sanitizeCompatibilityKoreanCopy(relationLabel).replace("->", "→");
}

function buildCompatibilityTopTableData(
  draft: CompatibilityReportDraft,
): CompatibilityTableData {
  return buildCompatibilityTableData({
    title: `${draft.personALabel}님 × ${draft.personBLabel}님 궁합표`,
    relationCategory: mapCompatibilityTableRelationCategory(
      draft.relationshipType,
    ),
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
  switch (relationshipType ?? "love") {
    case "love":
    case "some":
      return "love";
    case "marriage":
      return "marriage";
    case "friendship":
      return "friendship";
    case "family":
      return "parentChild";
    case "business_work_partner":
      return "businessPartner";
    default:
      return "love";
  }
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
      title: `${input.displayLabel}님의 만세력`,
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
  const deepNotes = getDraftDeepSajuBridge(draft)?.notes ?? [];
  const dayMasterNote = findDeepSajuNote(deepNotes, ["day_master_relation"]);
  const dayBranchNote = findDeepSajuNote(deepNotes, [
    "branch_clash",
    "branch_harm",
    "branch_trine",
    "spouse_palace",
  ]);
  const elementNote = findDeepSajuNote(deepNotes, [
    "element_complement",
    "combined_element_climate",
  ]);
  const tenGodNote = findDeepSajuNote(deepNotes, ["cross_ten_god"]);

  return {
    compatibilityHeadline: formatNullableCompatibilityText(
      draft.coreLine,
      draft.relationshipType,
    ),
    overallTone: draft.scoreSummary.scoreLabel,
    myeongliConnectionSummary: formatNullableCompatibilityText(
      deepNotes[0]?.plainKoreanSummary ?? draft.openingSummary,
      draft.relationshipType,
    ),
    mbtiConnectionSummary: buildCompatibilityMbtiSummary(draft),
    dayMasterRelation: formatDeepSajuNoteForSummary(
      dayMasterNote,
      draft.relationshipType,
    ),
    dayBranchRelation: formatDeepSajuNoteForSummary(
      dayBranchNote,
      draft.relationshipType,
    ),
    elementBalance: formatDeepSajuNoteForSummary(
      elementNote,
      draft.relationshipType,
    ),
    tenGodRelation: formatDeepSajuNoteForSummary(
      tenGodNote,
      draft.relationshipType,
    ),
    interactionLabels: deepNotes
      .map((note) => formatTechnicalRelationLabel(note.relationLabel))
      .filter((label) => label.length > 0)
      .slice(0, 6),
    sharedStrengths: formatCompatibilityList(
      draft.keyCompatibilityPoints.strengthPoints.slice(0, 3),
      draft.relationshipType,
    ),
    frictionPoints: formatCompatibilityList(
      draft.keyCompatibilityPoints.frictionPoints.slice(0, 3),
      draft.relationshipType,
    ),
    repairStrategy: formatNullableCompatibilityText(
      draft.keyCompatibilityPoints.relationshipRules[0],
      draft.relationshipType,
    ),
    timingNotes: formatCompatibilityList(
      draft.keyCompatibilityPoints.attractionPoints.slice(0, 2),
      draft.relationshipType,
    ),
  };
}

function findDeepSajuNote(
  notes: readonly CompatibilityDeepSajuBridgeResult["notes"][number][],
  layers: readonly CompatibilityDeepSajuLayer[],
): CompatibilityDeepSajuBridgeResult["notes"][number] | undefined {
  return notes.find((note) => layers.includes(note.layer));
}

function formatDeepSajuNoteForSummary(
  note: CompatibilityDeepSajuBridgeResult["notes"][number] | undefined,
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string | null {
  if (note === undefined) {
    return null;
  }

  return formatNullableCompatibilityText(
    note.plainKoreanSummary || note.relationshipTranslation,
    relationshipType,
  );
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

function renderDeepSajuStructureCard(
  draft: CompatibilityReportDraft,
) {
  const deepSajuBridge = getDraftDeepSajuBridge(draft);

  if (deepSajuBridge === undefined || deepSajuBridge.notes.length === 0) {
    return null;
  }

  const sortedNotes = [...deepSajuBridge.notes]
    .sort(
      (left, right) =>
        getLayerOrderIndex(left.layer, deepSajuLayerOrder) -
        getLayerOrderIndex(right.layer, deepSajuLayerOrder),
    );
  const expandedNotes = [...sortedNotes]
    .sort(
      (left, right) =>
        getLayerOrderIndex(left.layer, expandedDeepSajuLayerOrder) -
        getLayerOrderIndex(right.layer, expandedDeepSajuLayerOrder),
    )
    .slice(0, expandedDeepSajuNoteLimit);
  const expandedKeys = new Set(
    expandedNotes.map((note) => `${note.layer}:${note.relationLabel}`),
  );
  const compactNotes = sortedNotes.filter(
    (note) => !expandedKeys.has(`${note.layer}:${note.relationLabel}`),
  );

  return (
    <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-neutral-50">
          두 사람 사이에 생기는 명리학 구조
        </h2>
        <p className="text-sm leading-6 text-neutral-400">
          각자 사주를 따로 놓고 보는 것과 달리, 두 원국이 만났을 때 새로 생기는 관계만 추려서 봅니다.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {expandedNotes.map((note) => (
          <article
            key={`${note.layer}:${note.relationLabel}`}
            className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
          >
            <p className="text-xs font-semibold text-amber-200">{note.title}</p>
            <h3 className="mt-1 text-base font-semibold leading-6 text-neutral-50">
              {note.plainKoreanSummary.trim().length > 0
                ? formatCompatibilityDisplayText(
                    note.plainKoreanSummary,
                    draft.relationshipType,
                  )
                : note.title}
            </h3>
            <p className="mt-2 text-xs font-semibold text-neutral-500">
              계산값: {formatTechnicalRelationLabel(note.relationLabel)}
            </p>
            {renderDeepSajuExplanationSections(note, draft.relationshipType)}
          </article>
        ))}
      </div>
      {compactNotes.length === 0 ? null : (
        <section className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
          <h3 className="text-sm font-semibold text-neutral-100">
            더 살펴볼 구조
          </h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-300">
            {compactNotes.map((note) => (
              <li key={`${note.layer}:${note.relationLabel}`}>
                <span className="font-semibold text-neutral-100">{note.title}</span>
                {": "}
                {formatCompatibilityDisplayText(
                  note.plainKoreanSummary,
                  draft.relationshipType,
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}

function getFinalAdviceLabel(input: {
  readonly advice: string;
  readonly index: number;
  readonly relationshipType: CompatibilityReportDraft["relationshipType"];
}): string {
  const allowedLabels: readonly string[] =
    finalAdviceAllowedLabelsByRelationshipType[input.relationshipType];
  const defaultLabel =
    allowedLabels[input.index] ??
    finalAdviceLabels[input.index] ??
    allowedLabels[allowedLabels.length - 1] ??
    "실행 규칙";

  if (defaultLabel !== "도움 요청") {
    return defaultLabel;
  }
  if (finalAdviceHelpMarkers.some((marker) => input.advice.includes(marker))) {
    return defaultLabel;
  }
  if (finalAdviceConflictMarkers.some((marker) => input.advice.includes(marker))) {
    return "갈등 회복";
  }

  return defaultLabel;
}

export function normalizeCompatibilityFinalAdviceItem(
  item: string,
  fallbackLabel: string,
  relationshipType: CompatibilityReportDraft["relationshipType"] = "love",
): {
  readonly label: string;
  readonly body: string;
} {
  let label = fallbackLabel;
  let body = formatCompatibilityDisplayText(item, relationshipType).trim();
  let prefix = finalAdviceKnownPrefixes.find((candidate) =>
    body.startsWith(`${candidate}:`),
  );

  while (prefix !== undefined) {
    label = prefix;
    body = body.slice(prefix.length + 1).trim();
    prefix = finalAdviceKnownPrefixes.find((candidate) =>
      body.startsWith(`${candidate}:`),
    );
  }

  return { label, body };
}

function inferFinalAdviceLabel(
  body: string,
  relationshipType: CompatibilityReportDraft["relationshipType"],
): string | undefined {
  if (/돈|자원|예산|계좌|기록/u.test(body)) {
    return relationshipType === "business_work_partner" ? "돈과 자원" : "돈과 생활";
  }
  if (/역할|담당|권한|책임/u.test(body)) {
    return "역할 분담";
  }
  if (/업무|작업|문서/u.test(body)) {
    return relationshipType === "business_work_partner" ? "업무 기준" : "실행 규칙";
  }
  if (/결정|기준|보류/u.test(body)) {
    if (relationshipType === "business_work_partner") {
      return "의사결정";
    }
    if (relationshipType === "marriage" || relationshipType === "family") {
      return "생활 기준";
    }
    if (relationshipType === "friendship") {
      return "경계선";
    }
    return "실행 규칙";
  }
  if (/신뢰/u.test(body)) {
    return relationshipType === "business_work_partner"
      ? "신뢰 관리"
      : "오래 가는 규칙";
  }
  if (/거리|선|경계/u.test(body)) {
    return relationshipType === "friendship" ? "경계선" : "관계 속도";
  }
  if (/속도|타이밍/u.test(body)) {
    return relationshipType === "business_work_partner" ? "업무 기준" : "관계 속도";
  }
  if (/피드백|수정|확인/u.test(body)) {
    if (relationshipType === "business_work_partner") {
      return "피드백 규칙";
    }
    if (relationshipType === "friendship") {
      return "대화 리듬";
    }
    if (relationshipType === "marriage") {
      return "대화 습관";
    }
    return "대화 규칙";
  }
  if (/대화|말|이해|결론/u.test(body)) {
    if (relationshipType === "business_work_partner") {
      return "의사결정";
    }
    if (relationshipType === "friendship") {
      return "대화 리듬";
    }
    if (relationshipType === "marriage") {
      return "대화 습관";
    }
    return "대화 규칙";
  }
  if (/도움|필요|요청/u.test(body)) {
    if (relationshipType === "friendship") {
      return "도움 방식";
    }
    if (relationshipType === "family") {
      return "도움 요청";
    }
    if (relationshipType === "business_work_partner") {
      return "역할 분담";
    }
    return "감정 표현";
  }
  if (/갈등|서운|어긋난|회복|감정|정서/u.test(body)) {
    if (relationshipType === "business_work_partner") {
      return "갈등 조정";
    }
    if (relationshipType === "friendship") {
      return "오해 회복";
    }
    if (relationshipType === "family" && /정서|감정/u.test(body)) {
      return "정서 회복";
    }
    return "갈등 회복";
  }
  if (/일정|주말|쉬는|생활|만남/u.test(body)) {
    if (relationshipType === "business_work_partner") {
      return "업무 기준";
    }
    if (relationshipType === "friendship") {
      return "거리 조절";
    }
    if (relationshipType === "love" || relationshipType === "some") {
      return "생활 리듬";
    }
    return "생활 기준";
  }

  return undefined;
}

function getAllowedFinalAdviceLabel(input: {
  readonly label: string;
  readonly body: string;
  readonly relationshipType: CompatibilityReportDraft["relationshipType"];
  readonly usedLabels: ReadonlySet<string>;
}): string {
  const allowedLabels: readonly string[] =
    finalAdviceAllowedLabelsByRelationshipType[input.relationshipType];
  const inferred = inferFinalAdviceLabel(input.body, input.relationshipType);

  if (
    inferred !== undefined &&
    allowedLabels.includes(inferred) &&
    !input.usedLabels.has(inferred)
  ) {
    return inferred;
  }
  if (
    allowedLabels.includes(input.label) &&
    !input.usedLabels.has(input.label)
  ) {
    return input.label;
  }
  if (inferred !== undefined && allowedLabels.includes(inferred)) {
    return inferred;
  }

  return (
    allowedLabels.find((label) => !input.usedLabels.has(label)) ??
    allowedLabels[0] ??
    input.label
  );
}

function legacyInferFinalAdviceLabel(body: string): string | undefined {
  if (/돈|자원|예산|계좌|기록/u.test(body)) {
    return "돈과 생활";
  }
  if (/역할|담당|권한|책임/u.test(body)) {
    return "역할 분담";
  }
  if (/결정|기준|보류/u.test(body)) {
    return "의사결정";
  }
  if (/피드백|수정|확인/u.test(body)) {
    return "피드백 규칙";
  }
  if (/대화|말|이해|결론/u.test(body)) {
    return "대화 규칙";
  }
  if (/도움|필요|요청/u.test(body)) {
    return "도움 요청";
  }
  if (/갈등|서운|어긋난|회복|감정/u.test(body)) {
    return "갈등 회복";
  }
  if (/일정|주말|쉬는|생활|만남/u.test(body)) {
    return "생활 기준";
  }

  return undefined;
}

function resolveDuplicateFinalAdviceLabel(input: {
  readonly label: string;
  readonly body: string;
  readonly usedLabels: ReadonlySet<string>;
  readonly relationshipType: CompatibilityReportDraft["relationshipType"];
}): string {
  const allowedLabels: readonly string[] =
    finalAdviceAllowedLabelsByRelationshipType[input.relationshipType];
  const categoryLabel = getAllowedFinalAdviceLabel(input);

  if (!input.usedLabels.has(categoryLabel)) {
    return categoryLabel;
  }

  const inferred = legacyInferFinalAdviceLabel(input.body);
  if (inferred !== undefined && !input.usedLabels.has(inferred)) {
    return getAllowedFinalAdviceLabel({
      ...input,
      label: inferred,
    });
  }

  return (
    allowedLabels.find((label) => !input.usedLabels.has(label)) ??
    finalAdviceLabelPriority.find(
      (label) => allowedLabels.includes(label) && !input.usedLabels.has(label),
    ) ??
    input.label
  );
}

export function normalizeCompatibilityFinalAdviceItems(
  items: readonly string[],
  relationshipType: CompatibilityReportDraft["relationshipType"] = "love",
): readonly {
  readonly label: string;
  readonly body: string;
}[] {
  const usedLabels = new Set<string>();

  return items.map((advice, index) => {
    const fallbackLabel = getFinalAdviceLabel({
      advice,
      index,
      relationshipType,
    });
    const normalized = normalizeCompatibilityFinalAdviceItem(
      advice,
      fallbackLabel,
      relationshipType,
    );
    const label = resolveDuplicateFinalAdviceLabel({
      label: normalized.label,
      body: normalized.body,
      usedLabels,
      relationshipType,
    });

    usedLabels.add(label);

    return {
      label,
      body: normalized.body,
    };
  });
}

export function CompatibilityReportView({
  draft,
  reportId,
}: CompatibilityReportViewProps) {
  const compatibilityTableData = buildCompatibilityTopTableData(draft);

  return (
    <article className="space-y-8 rounded-xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl shadow-black/30 sm:p-6">
      <header className="space-y-5">
        <div className="space-y-4 rounded-xl border border-amber-500/20 bg-neutral-950/70 p-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-amber-200">
              사주×MBTI 궁합 리포트
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-50 sm:text-3xl">
              {formatCompatibilityDisplayText(
                draft.openingTitle,
                draft.relationshipType,
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-neutral-100">
                {draft.personALabel}님 × {draft.personBLabel}님
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-100">
                {formatCompatibilityRelationshipType(draft.relationshipType)} 궁합
              </span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-[10rem_1fr] sm:items-stretch">
            <div
              className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
              aria-label="종합 궁합 점수"
            >
              <p className="text-xs font-semibold text-amber-200">종합 궁합 점수</p>
              <p className="mt-2 text-5xl font-bold tracking-tight text-amber-100">
                {draft.scoreSummary.totalScore}점
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-amber-100">
                {draft.scoreSummary.scoreLabel}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/70 p-4">
              <p className="text-base font-semibold leading-7 text-neutral-50">
                {formatCompatibilityDisplayText(
                  draft.coreLine,
                  draft.relationshipType,
                )}
              </p>
              <p className="text-sm leading-6 text-neutral-300">
                {getCompatibilityScoreCaution(
                  draft.relationshipType,
                  draft.scoreSummary.totalScore,
                )}
              </p>
            </div>
          </div>
          <p className="max-w-prose text-base leading-7 text-neutral-300">
            {formatCompatibilityDisplayText(
              draft.openingSummary,
              draft.relationshipType,
            )}
          </p>
        </div>
      </header>

      {reportId === undefined ? null : (
        <dl className="grid gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-4 text-sm">
        {reportId === undefined ? null : (
          <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
            <dt className="font-medium text-neutral-500">리포트 ID</dt>
            <dd className="break-words text-neutral-100">{reportId}</dd>
          </div>
        )}
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-medium text-neutral-500">상품</dt>
          <dd className="text-neutral-100">사주×MBTI 궁합 리포트</dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-medium text-neutral-500">두 사람</dt>
          <dd className="text-neutral-100">
            {draft.personALabel}님 × {draft.personBLabel}님
          </dd>
        </div>
        <div className="grid gap-1 sm:grid-cols-[9rem_1fr]">
          <dt className="font-medium text-neutral-500">관계 유형</dt>
          <dd className="text-neutral-100">
            {formatCompatibilityRelationshipType(draft.relationshipType)}
          </dd>
        </div>
        </dl>
      )}

      <CompatibilityTable data={compatibilityTableData} defaultOpen={true} />

      {renderCompatibilityScoreCards(draft)}

      {renderDeepSajuStructureCard(draft)}

      {renderCompatibilityKeyPoints(draft)}

      <section className="space-y-5" aria-label="궁합 리포트 본문">
        {draft.chapters.map((chapter) => (
          <section
            key={chapter.id}
            className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-50">
                {formatCompatibilityDisplayText(
                  chapter.title,
                  draft.relationshipType,
                )}
              </h2>
              <p className="text-base font-semibold leading-7 text-amber-100">
                {formatCompatibilityDisplayText(
                  chapter.headline,
                  draft.relationshipType,
                )}
              </p>
            </div>
            <p className="max-w-prose whitespace-pre-line text-base leading-8 text-neutral-200">
              {formatCompatibilityDisplayText(
                chapter.body,
                draft.relationshipType,
              )}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <section className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
                <h3 className="text-sm font-semibold text-amber-100">
                  반복될 수 있는 장면
                </h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-50/90">
                  {chapter.directHitScenes.map((scene) => (
                    <li key={scene}>
                      {formatCompatibilityDisplayText(scene, draft.relationshipType)}
                    </li>
                  ))}
                </ul>
              </section>
              {chapter.practicalAdvice.length > 0 ? (
                <section className="rounded-lg border border-neutral-700 bg-neutral-900/70 p-4">
                  <h3 className="text-sm font-semibold text-neutral-100">
                    실전 조언
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-300">
                    {chapter.practicalAdvice.map((advice) => (
                      <li key={advice}>
                        {formatCompatibilityDisplayText(
                          advice,
                          draft.relationshipType,
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </section>
        ))}
      </section>

      <section className="space-y-4 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-lg font-semibold text-neutral-50">오늘부터 할 일</h2>
        <ol className="grid gap-3">
          {normalizeCompatibilityFinalAdviceItems(
            draft.finalAdvice,
            draft.relationshipType,
          ).map((normalizedAdvice, index) => (
            <li
              key={`${normalizedAdvice.label}:${normalizedAdvice.body}`}
              className="rounded-lg border border-neutral-800 bg-neutral-900/70 p-4"
            >
              <p className="text-sm font-semibold text-amber-100">
                {index + 1}. {normalizedAdvice.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                {normalizedAdvice.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 rounded-lg border border-neutral-800 bg-neutral-950/60 p-5">
        <h2 className="text-sm font-semibold text-neutral-400">안전 안내</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-neutral-500">
          {draft.safetyNotes.map((note) => (
            <li key={note}>
              {formatCompatibilitySafetyNote(note, draft.relationshipType)}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
