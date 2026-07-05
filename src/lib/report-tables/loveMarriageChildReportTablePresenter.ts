import {
  getMbtiSourceProfile,
  type MbtiSourceProfile,
} from "../report-knowledge/mbti";
import type {
  LoveMarriageChildMbtiTraitEvidence,
  LoveMarriageChildReportEvidencePacket,
  LoveMarriageChildSajuSignal,
} from "../report-knowledge/loveMarriageChildReportTypes";
import {
  buildManseRyeokCommonTableData,
  type ManseRyeokFourPillarGridColumnInput,
} from "./manseRyeokTableData";
import {
  buildMbtiCommonProfileTableData,
  type MbtiCommonProfileSourceInput,
  type MbtiSourceTraitItem,
} from "./mbtiProfileTableData";
import type {
  ManseRyeokCommonTableData,
  MbtiCommonProfileTableData,
  MbtiFunctionStackPosition,
  MbtiPreferenceAxisKey,
} from "./types";

export type LoveMarriageChildReportCommonTablesData = {
  readonly manseRyeokTableData: ManseRyeokCommonTableData;
  readonly mbtiProfileTableData: MbtiCommonProfileTableData | null;
};

type LoveMarriageChildEvidenceWithOptionalPillars =
  LoveMarriageChildReportEvidencePacket & {
    readonly manseRyeokPillars?: readonly ManseRyeokFourPillarGridColumnInput[];
    readonly userPillars?: Partial<
      Record<ManseRyeokFourPillarGridColumnInput["columnId"], string>
    >;
  };

export function buildLoveMarriageChildReportCommonTablesData(
  evidence: LoveMarriageChildReportEvidencePacket,
): LoveMarriageChildReportCommonTablesData {
  return {
    manseRyeokTableData:
      buildLoveMarriageChildReportManseRyeokTableData(evidence),
    mbtiProfileTableData:
      buildLoveMarriageChildReportMbtiProfileTableData(evidence),
  };
}

export function buildLoveMarriageChildReportManseRyeokTableData(
  evidence: LoveMarriageChildReportEvidencePacket,
): ManseRyeokCommonTableData {
  return buildManseRyeokCommonTableData({
    displayName: evidence.personContext.name,
    fourPillarGrid: buildLoveMarriageChildFourPillarGrid(evidence),
  });
}

export function buildLoveMarriageChildReportMbtiProfileTableData(
  evidence: LoveMarriageChildReportEvidencePacket,
): MbtiCommonProfileTableData | null {
  const source = getMbtiSourceProfile(evidence.personContext.mbtiType);

  if (source === null) {
    return null;
  }

  return buildMbtiCommonProfileTableData(
    toLoveMarriageChildMbtiProfileSource(source, evidence),
  );
}

function buildLoveMarriageChildFourPillarGrid(
  evidence: LoveMarriageChildReportEvidencePacket,
): readonly ManseRyeokFourPillarGridColumnInput[] {
  const explicitGrid = buildExplicitFourPillarGrid(evidence);

  if (explicitGrid.length > 0) {
    return explicitGrid;
  }

  return [
    {
      columnId: "day",
      pillar: evidence.sajuBasis.dayPillar,
      heavenlyStem: evidence.sajuBasis.dayMaster,
      earthlyBranch: evidence.sajuBasis.dayBranch,
      tenGod: buildTenGodLabels(evidence).slice(0, 2),
      hiddenStems: [],
      twelveLifeStage: [],
      twelveSinsal: [],
      sinsal: buildSinsalLabels(evidence),
      gwiin: buildGwiinLabels(evidence),
      interactions: pickSignalLabels(evidence.sajuBasis.relationInteractionSignals),
    },
  ];
}

function buildExplicitFourPillarGrid(
  evidence: LoveMarriageChildReportEvidencePacket,
): readonly ManseRyeokFourPillarGridColumnInput[] {
  const evidenceWithPillars =
    evidence as LoveMarriageChildEvidenceWithOptionalPillars;
  const detailedPillars = new Map(
    (evidenceWithPillars.manseRyeokPillars ?? []).map((pillar) => [
      pillar.columnId,
      pillar,
    ]),
  );
  const userPillars = evidenceWithPillars.userPillars ?? {};

  return (["year", "month", "day", "hour"] as const)
    .map((columnId) => {
      const detailedPillar = detailedPillars.get(columnId);

      if (detailedPillar !== undefined) {
        return detailedPillar;
      }

      const pillar = userPillars[columnId];

      if (pillar === undefined || pillar.trim().length === 0) {
        return null;
      }

      return {
        columnId,
        pillar,
        hiddenStems: [],
        twelveLifeStage: [],
        twelveSinsal: [],
        sinsal: [],
        gwiin: [],
        interactions: [],
      };
    })
    .filter(
      (column): column is ManseRyeokFourPillarGridColumnInput =>
        column !== null,
    );
}

function buildTenGodLabels(
  evidence: LoveMarriageChildReportEvidencePacket,
): readonly string[] {
  return uniqueValues(
    [
      ...evidence.sajuBasis.loveTenGodSignals,
      ...evidence.sajuBasis.marriageTenGodSignals,
      ...evidence.sajuBasis.parentingTenGodSignals,
    ].map((signal) => signal.tenGod),
  );
}

function buildSinsalLabels(
  evidence: LoveMarriageChildReportEvidencePacket,
): readonly string[] {
  return uniqueValues([
    ...pickSignalLabels(evidence.sajuBasis.attractionSignals),
    ...pickSignalLabels(evidence.sajuBasis.conflictSignals),
  ]);
}

function buildGwiinLabels(
  evidence: LoveMarriageChildReportEvidencePacket,
): readonly string[] {
  return pickSignalLabels(evidence.sajuBasis.supportSignals);
}

function pickSignalLabels(
  signals: readonly LoveMarriageChildSajuSignal[],
): readonly string[] {
  return uniqueValues(signals.map((signal) => signal.label));
}

function uniqueValues(values: readonly string[]): readonly string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function toLoveMarriageChildMbtiProfileSource(
  source: MbtiSourceProfile,
  evidence: LoveMarriageChildReportEvidencePacket,
): MbtiCommonProfileSourceInput {
  return {
    type: source.type,
    titleKo: source.titleKo,
    archetype: source.archetype,
    oneLine: source.oneLine,
    preferenceAxes: pickPreferenceAxes(source.preferenceAxes),
    functionStack: pickFunctionStack(source.functionStack),
    summary: source.summary,
    traits: buildLoveMarriageChildMbtiTraits(source, evidence),
    closeKeywords: getStringArrayProperty(source, "closeKeywords"),
    farKeywords: getStringArrayProperty(source, "farKeywords"),
  };
}

function pickPreferenceAxes(
  sourceAxes: Readonly<Record<string, string>> | undefined,
): Partial<Record<MbtiPreferenceAxisKey, string>> | undefined {
  if (sourceAxes === undefined) {
    return undefined;
  }

  return {
    energy: sourceAxes.energy,
    perception: sourceAxes.perception,
    judgment: sourceAxes.judgment,
    lifestyle: sourceAxes.lifestyle,
  };
}

function pickFunctionStack(
  sourceStack: Readonly<Record<string, string>> | undefined,
): Partial<Record<MbtiFunctionStackPosition, string>> | undefined {
  if (sourceStack === undefined) {
    return undefined;
  }

  return {
    dominant: sourceStack.dominant,
    auxiliary: sourceStack.auxiliary,
    tertiary: sourceStack.tertiary,
    inferior: sourceStack.inferior,
  };
}

function buildLoveMarriageChildMbtiTraits(
  source: MbtiSourceProfile,
  evidence: LoveMarriageChildReportEvidencePacket,
): Readonly<Record<string, readonly MbtiSourceTraitItem[]>> {
  const reportUseCases =
    source.reportUseCases?.loveMarriageChildReport ??
    evidence.mbtiBasis.reportUseCases;

  if (reportUseCases.length > 0) {
    return {
      "연애·결혼·자녀 활용": reportUseCases.slice(0, 5).map((line, index) => ({
        id: `love_marriage_child_use_case_${index + 1}`,
        label: getLoveMarriageChildUseCaseLabel(index, line),
        plainKo: sanitizeLoveMarriageChildUseCaseLine(line),
        productDomains: [],
      })),
    };
  }

  const fallbackTraits = buildFallbackTraitLines(evidence);

  if (fallbackTraits.length === 0) {
    return {};
  }

  return {
    "연애·결혼·자녀 활용": fallbackTraits,
  };
}

function buildFallbackTraitLines(
  evidence: LoveMarriageChildReportEvidencePacket,
): readonly MbtiSourceTraitItem[] {
  return [
    toTraitLine("사랑 방식", evidence.mbtiBasis.loveTraits[0]),
    toTraitLine("결혼 리듬", evidence.mbtiBasis.marriageTraits[0]),
    toTraitLine("부모 역할", evidence.mbtiBasis.parentingTraits[0]),
    toTraitLine("관계 회복", evidence.mbtiBasis.communicationTraits[0]),
    toTraitLine("성장 방향", evidence.mbtiBasis.growth[0]),
  ].flatMap((item) => (item === null ? [] : [item]));
}

function toTraitLine(
  label: string,
  trait: LoveMarriageChildMbtiTraitEvidence | undefined,
): MbtiSourceTraitItem | null {
  if (trait === undefined) {
    return null;
  }

  return {
    id: trait.id ?? undefined,
    label,
    plainKo: trait.plain,
    positiveUse: trait.growth ?? undefined,
    risk: trait.risk ?? undefined,
    productDomains: [],
  };
}

function getLoveMarriageChildUseCaseLabel(
  index: number,
  line: string,
): string {
  if (line.includes("love")) {
    return "사랑 방식";
  }
  if (line.includes("marriage")) {
    return "결혼 리듬";
  }
  if (line.includes("갈등")) {
    return "갈등 회복";
  }
  if (line.includes("부모")) {
    return "부모 역할";
  }

  return [
    "사랑 방식",
    "결혼 리듬",
    "갈등 회복",
    "부모 역할",
    "관계 성장",
  ][index] ?? "관계 활용";
}

function sanitizeLoveMarriageChildUseCaseLine(line: string): string {
  return line
    .replaceAll("love 섹션", "사랑 방식")
    .replaceAll("marriage 섹션", "결혼 생활")
    .replaceAll("parenting 섹션", "부모 역할")
    .replaceAll("child 섹션", "부모 역할")
    .replaceAll("relationship 섹션", "관계 해석")
    .replaceAll("communication 섹션", "대화 방식")
    .replaceAll("compatibility 섹션", "관계 해석")
    .replaceAll("daeun 섹션", "흐름 해석")
    .replaceAll("saeun 섹션", "연간 흐름 해석")
    .replaceAll("sajuMbtiBridge 섹션", "명리와 MBTI 연결 해석")
    .replaceAll("자녀 성취 투영", "성과 기준을 투영하는 위험")
    .replaceAll("자녀", "부모 역할");
}

function getStringArrayProperty(
  source: MbtiSourceProfile,
  key: "closeKeywords" | "farKeywords",
): readonly string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .slice(0, 6);
}
