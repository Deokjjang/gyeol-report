import {
  getMbtiSourceProfile,
  type MbtiSourceProfile,
  type MbtiSourceTraitItem,
} from "../report-knowledge/mbti";
import type { CareerReportEvidencePacket } from "../report-knowledge/careerReportTypes";
import {
  buildManseRyeokCommonTableData,
  type ManseRyeokFourPillarGridColumnInput,
} from "./manseRyeokTableData";
import {
  buildMbtiCommonProfileTableData,
  type MbtiCommonProfileSourceInput,
} from "./mbtiProfileTableData";
import type {
  ManseRyeokCommonTableData,
  MbtiCommonProfileTableData,
  MbtiFunctionStackPosition,
  MbtiPreferenceAxisKey,
} from "./types";

export type CareerReportCommonTablesData = {
  readonly manseRyeokTableData: ManseRyeokCommonTableData;
  readonly mbtiProfileTableData: MbtiCommonProfileTableData | null;
};

export function buildCareerReportCommonTablesData(
  evidence: CareerReportEvidencePacket,
): CareerReportCommonTablesData {
  return {
    manseRyeokTableData: buildCareerReportManseRyeokTableData(evidence),
    mbtiProfileTableData: buildCareerReportMbtiProfileTableData(evidence),
  };
}

export function buildCareerReportManseRyeokTableData(
  evidence: CareerReportEvidencePacket,
): ManseRyeokCommonTableData {
  return buildManseRyeokCommonTableData({
    displayName: evidence.personLabel,
    fourPillarGrid: buildCareerFourPillarGrid(evidence),
  });
}

export function buildCareerReportMbtiProfileTableData(
  evidence: CareerReportEvidencePacket,
): MbtiCommonProfileTableData | null {
  const source = getMbtiSourceProfile(evidence.mbtiType);

  if (source === null) {
    return null;
  }

  return buildMbtiCommonProfileTableData(toCareerMbtiProfileSource(source));
}

function buildCareerFourPillarGrid(
  evidence: CareerReportEvidencePacket,
): readonly ManseRyeokFourPillarGridColumnInput[] {
  const detailedPillars = new Map(
    (evidence.manseRyeokPillars ?? []).map((pillar) => [
      pillar.columnId,
      pillar,
    ]),
  );

  return [
    buildPillarColumn("year", evidence.userPillars.year, detailedPillars),
    buildPillarColumn("month", evidence.userPillars.month, detailedPillars),
    buildPillarColumn("day", evidence.userPillars.day, detailedPillars),
    buildPillarColumn("hour", evidence.userPillars.hour, detailedPillars),
  ].filter(
    (column): column is ManseRyeokFourPillarGridColumnInput =>
      column !== null,
  );
}

function buildPillarColumn(
  columnId: ManseRyeokFourPillarGridColumnInput["columnId"],
  pillar: string | undefined,
  detailedPillars: ReadonlyMap<
    ManseRyeokFourPillarGridColumnInput["columnId"],
    NonNullable<CareerReportEvidencePacket["manseRyeokPillars"]>[number]
  >,
): ManseRyeokFourPillarGridColumnInput | null {
  const detailedPillar = detailedPillars.get(columnId);

  if (detailedPillar !== undefined) {
    return {
      columnId,
      pillar: detailedPillar.pillar,
      heavenlyStem: detailedPillar.heavenlyStem,
      earthlyBranch: detailedPillar.earthlyBranch,
      tenGod: detailedPillar.tenGod,
      hiddenStems: detailedPillar.hiddenStems,
      twelveLifeStage: detailedPillar.twelveLifeStage,
      twelveSinsal: detailedPillar.twelveSinsal,
      sinsal: detailedPillar.sinsal,
      gwiin: detailedPillar.gwiin,
      interactions: detailedPillar.interactions,
    };
  }

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
}

function toCareerMbtiProfileSource(
  source: MbtiSourceProfile,
): MbtiCommonProfileSourceInput {
  return {
    type: source.type,
    titleKo: source.titleKo,
    archetype: source.archetype,
    oneLine: source.oneLine,
    preferenceAxes: pickPreferenceAxes(source.preferenceAxes),
    functionStack: pickFunctionStack(source.functionStack),
    summary: source.summary,
    traits: buildCareerMbtiTraits(source),
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

function buildCareerMbtiTraits(
  source: MbtiSourceProfile,
): Readonly<Record<string, readonly MbtiSourceTraitItem[]>> {
  const reportUseCases = (source.reportUseCases?.careerReport ?? []).slice(0, 5);

  if (reportUseCases.length > 0) {
    return {
      "직업·돈·학업 활용": reportUseCases.map((line, index) => ({
        id: `career_report_use_case_${index + 1}`,
        label: getCareerReportUseCaseLabel(index, line),
        plainKo: sanitizeCareerReportUseCaseLine(line),
        productDomains: [],
      })),
    };
  }

  return {};
}

function getCareerReportUseCaseLabel(index: number, line: string): string {
  if (line.includes("workplace")) {
    return "조직 적합도";
  }
  if (line.includes("money")) {
    return "돈 관리";
  }
  if (line.includes("investment")) {
    return "투자 태도";
  }
  if (line.includes("study")) {
    return "공부 전략";
  }

  return [
    "직업 활용",
    "조직 적합도",
    "돈 관리",
    "투자 태도",
    "성장 방향",
  ][index] ?? "활용 포인트";
}

function sanitizeCareerReportUseCaseLine(line: string): string {
  return line
    .replaceAll("career 섹션", "직업 해석")
    .replaceAll("career 리포트", "직업 리포트")
    .replaceAll("workplace 문장", "직장·조직 해석")
    .replaceAll("workplace 섹션", "직장·조직 해석")
    .replaceAll("money 섹션", "돈 관리 해석")
    .replaceAll("investment 섹션", "투자 성향 해석")
    .replaceAll("study 섹션", "공부 전략 해석")
    .replaceAll("compatibility 섹션", "관계 해석")
    .replaceAll("daeun 섹션", "흐름 해석")
    .replaceAll("saeun 섹션", "연간 흐름 해석");
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
