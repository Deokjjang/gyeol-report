import {
  getMbtiSourceProfile,
  type MbtiSourceProfile,
  type MbtiSourceTraitItem,
  type MbtiTraitArea,
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

const CAREER_MBTI_TRAIT_AREAS = [
  "career",
  "workplace",
  "money",
  "investment",
  "study",
  "strengths",
  "risks",
  "growth",
] as const satisfies readonly MbtiTraitArea[];

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
  return [
    buildPillarColumn("year", evidence.userPillars.year),
    buildPillarColumn("month", evidence.userPillars.month),
    buildPillarColumn("day", evidence.userPillars.day),
    buildPillarColumn("hour", evidence.userPillars.hour),
  ].filter(
    (column): column is ManseRyeokFourPillarGridColumnInput =>
      column !== null,
  );
}

function buildPillarColumn(
  columnId: ManseRyeokFourPillarGridColumnInput["columnId"],
  pillar: string | undefined,
): ManseRyeokFourPillarGridColumnInput | null {
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
  const traits: Record<string, readonly MbtiSourceTraitItem[]> = {};

  for (const area of CAREER_MBTI_TRAIT_AREAS) {
    const items = source.traits?.[area];

    if (items !== undefined && items.length > 0) {
      traits[area] = items;
    }
  }

  const reportUseCases = source.reportUseCases?.careerReport ?? [];

  if (reportUseCases.length > 0) {
    traits.careerReportUseCases = reportUseCases.map((line, index) => ({
      id: `career_report_use_case_${index + 1}`,
      label: "직업·돈·학업 활용",
      plainKo: line,
      productDomains: ["career_money_study"],
    }));
  }

  return traits;
}

function getStringArrayProperty(
  source: MbtiSourceProfile,
  key: "closeKeywords" | "farKeywords",
): readonly string[] {
  const value = source[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}
