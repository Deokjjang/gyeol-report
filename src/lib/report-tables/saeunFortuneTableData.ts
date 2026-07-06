import {
  getTenGodForStemPair as getStemTenGodForPair,
} from "../report-knowledge/annualFortuneYearRules";
import type { HeavenlyStem } from "../report-knowledge/annualFortuneTypes";
import type { AnnualFortuneEvidencePacket } from "../report-knowledge/annualFortuneEvidence";
import {
  getMbtiSourceProfile,
  type MbtiSourceProfile,
  type MbtiSourceTraitItem,
} from "../report-knowledge/mbti";
import {
  getBranchDisplay,
  getStemDisplay,
} from "./displayDictionaries";
import {
  buildManseRyeokCommonTableData,
  type ManseRyeokFourPillarGridColumnInput,
} from "./manseRyeokTableData";
import {
  buildMbtiCommonProfileTableData,
  type MbtiCommonProfileSourceInput,
} from "./mbtiProfileTableData";
import type {
  DaeunPillarCard,
  ManseRyeokCommonTableData,
  MbtiCommonProfileTableData,
  MbtiFunctionStackPosition,
  MbtiPreferenceAxisKey,
  SaeunAnnualCompareTableData,
  SaeunFortuneTableData,
  SaeunMonthlyFortuneRow,
} from "./types";

type SaeunGanjiInput = {
  readonly ganji?: string;
  readonly pillar?: string;
  readonly heavenlyStem?: string;
  readonly earthlyBranch?: string;
  readonly stem?: string;
  readonly branch?: string;
  readonly tenGod?: readonly string[] | string;
  readonly stemTenGod?: string;
  readonly branchTenGod?: string;
  readonly hiddenStems?: readonly string[];
  readonly twelveLifeStage?: readonly string[];
  readonly twelveSinsal?: readonly string[];
  readonly sinsal?: readonly string[];
  readonly gwiin?: readonly string[];
  readonly sinsalAndGwiin?: readonly string[];
  readonly interactions?: readonly string[];
};

export type AnnualFortuneReportCommonTablesData = {
  readonly manseRyeokTableData: ManseRyeokCommonTableData;
  readonly mbtiProfileTableData: MbtiCommonProfileTableData | null;
};

const HIDDEN_STEMS_BY_BRANCH: Record<string, readonly string[]> = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "戊", "庚"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"],
};

export type SaeunDaeunCycleInput = SaeunGanjiInput;

export type SaeunAnnualFortuneInput = SaeunGanjiInput & {
  readonly year?: number;
};

export type SaeunMonthlyFortuneInput = SaeunGanjiInput & {
  readonly month: number;
  readonly monthLabel?: string;
  readonly label?: string;
  readonly monthlyPillar?: string;
  readonly monthGanji?: string;
  readonly oneLine?: string | null;
  readonly headline?: string | null;
  readonly plain?: string | null;
  readonly caution?: string | null;
  readonly basis?: string | null;
  readonly monthlyBasis?: string | null;
};

export type BuildSaeunFortuneTableDataInput = {
  readonly title?: string;
  readonly displayName?: string;
  readonly selectedYear: number;
  readonly currentDaeunCycle?: SaeunDaeunCycleInput;
  readonly annualFortune: SaeunAnnualFortuneInput;
  readonly monthlyFortunes: readonly SaeunMonthlyFortuneInput[];
};

export function buildSaeunFortuneTableData(
  input: BuildSaeunFortuneTableDataInput,
): SaeunFortuneTableData {
  const monthlyRows = buildMonthlyRows(input.monthlyFortunes);

  return {
    title: buildTitle(input),
    selectedYear: input.selectedYear,
    daeunAnnualCompareTable: buildAnnualCompareTable(
      input.currentDaeunCycle,
      input.annualFortune,
    ),
    firstHalfMonthlyTable: {
      half: "first",
      title: "월운 - 상반기",
      monthRangeLabel: "1월~6월",
      rows: monthlyRows.filter((row) => row.month >= 1 && row.month <= 6),
    },
    secondHalfMonthlyTable: {
      half: "second",
      title: "월운 - 하반기",
      monthRangeLabel: "7월~12월",
      rows: monthlyRows.filter((row) => row.month >= 7 && row.month <= 12),
    },
  };
}

export function buildAnnualFortuneReportCommonTablesData(
  evidence: AnnualFortuneEvidencePacket,
): AnnualFortuneReportCommonTablesData {
  return {
    manseRyeokTableData: buildAnnualFortuneReportManseRyeokTableData(evidence),
    mbtiProfileTableData: buildAnnualFortuneReportMbtiProfileTableData(evidence),
  };
}

export function buildAnnualFortuneReportManseRyeokTableData(
  evidence: AnnualFortuneEvidencePacket,
): ManseRyeokCommonTableData {
  return buildManseRyeokCommonTableData({
    displayName: evidence.personContext.name,
    fourPillarGrid: buildAnnualFortuneFourPillarGrid(evidence),
  });
}

export function buildAnnualFortuneReportMbtiProfileTableData(
  evidence: AnnualFortuneEvidencePacket,
): MbtiCommonProfileTableData | null {
  const source = getMbtiSourceProfile(evidence.mbtiBasis.type);

  if (source === null) {
    return null;
  }

  return buildMbtiCommonProfileTableData(toAnnualFortuneMbtiProfileSource(source));
}

function buildAnnualFortuneFourPillarGrid(
  evidence: AnnualFortuneEvidencePacket,
): readonly ManseRyeokFourPillarGridColumnInput[] {
  return [
    buildAnnualFortunePillarColumn("year", evidence.baseSaju.pillars.year, evidence),
    buildAnnualFortunePillarColumn("month", evidence.baseSaju.pillars.month, evidence),
    buildAnnualFortunePillarColumn("day", evidence.baseSaju.pillars.day, evidence),
    buildAnnualFortunePillarColumn("hour", evidence.baseSaju.pillars.hour, evidence),
  ].filter(
    (column): column is ManseRyeokFourPillarGridColumnInput =>
      column !== null,
  );
}

function buildAnnualFortunePillarColumn(
  columnId: ManseRyeokFourPillarGridColumnInput["columnId"],
  pillar: string | undefined,
  evidence: AnnualFortuneEvidencePacket,
): ManseRyeokFourPillarGridColumnInput | null {
  if (pillar === undefined || pillar.trim().length < 2) {
    return null;
  }

  const stem = pillar.trim().slice(0, 1);
  const branch = pillar.trim().slice(1, 2);

  return {
    columnId,
    pillar,
    heavenlyStem: stem,
    earthlyBranch: branch,
    tenGod: buildPillarTenGodPair({
      dayMaster: evidence.dayMaster,
      stem,
      branch,
    }),
    hiddenStems: getHiddenStemsForBranch(branch),
    twelveLifeStage: [],
    twelveSinsal: [],
    sinsal: [],
    gwiin: [],
    interactions: [],
  };
}

function buildPillarTenGodPair(input: {
  readonly dayMaster: HeavenlyStem;
  readonly stem: string;
  readonly branch: string;
}): readonly string[] {
  const stemTenGod = isHeavenlyStem(input.stem)
    ? getStemTenGodForPair(input.dayMaster, input.stem)
    : null;
  const branchMainStem = getHiddenStemsForBranch(input.branch)[0];
  const branchTenGod =
    branchMainStem !== undefined && isHeavenlyStem(branchMainStem)
      ? getStemTenGodForPair(input.dayMaster, branchMainStem)
      : null;

  return [
    stemTenGod === null ? null : `천간 ${stemTenGod}`,
    branchTenGod === null ? null : `지지 ${branchTenGod}`,
  ].filter((value): value is string => value !== null);
}

function isHeavenlyStem(value: string): value is HeavenlyStem {
  return [
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
  ].includes(value);
}

function getHiddenStemsForBranch(branch: string): readonly string[] {
  return HIDDEN_STEMS_BY_BRANCH[branch] ?? [];
}

function toAnnualFortuneMbtiProfileSource(
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
    traits: buildAnnualFortuneMbtiTraits(source),
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

function buildAnnualFortuneMbtiTraits(
  source: MbtiSourceProfile,
): Readonly<Record<string, readonly MbtiSourceTraitItem[]>> {
  const reportUseCases = (source.reportUseCases?.saeunReport ?? []).slice(0, 5);

  if (reportUseCases.length === 0) {
    return {};
  }

  return {
    "세운 활용": reportUseCases.map((line, index) => ({
      id: `saeun_report_use_case_${index + 1}`,
      label: getAnnualFortuneReportUseCaseLabel(index),
      plainKo: sanitizeAnnualFortuneReportUseCaseLine(line),
      productDomains: [],
    })),
  };
}

function getAnnualFortuneReportUseCaseLabel(index: number): string {
  return [
    "연간 흐름",
    "일과 실행",
    "돈과 자원",
    "관계 리듬",
    "성장 방식",
  ][index] ?? "활용 포인트";
}

function sanitizeAnnualFortuneReportUseCaseLine(line: string): string {
  return line
    .replaceAll("saeun 섹션", "세운 해석")
    .replaceAll("saeun 리포트", "세운 리포트")
    .replaceAll("career 섹션", "직업 흐름")
    .replaceAll("money 섹션", "돈 흐름")
    .replaceAll("relationship 섹션", "관계 흐름")
    .replaceAll("source", "근거");
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

function buildTitle(input: BuildSaeunFortuneTableDataInput): string {
  if (input.title) {
    return input.title;
  }

  if (input.displayName) {
    return `${input.displayName}님의 ${input.selectedYear}년 세운표`;
  }

  return `${input.selectedYear}년 세운표`;
}

function buildAnnualCompareTable(
  daeun: SaeunDaeunCycleInput | undefined,
  annual: SaeunAnnualFortuneInput,
): SaeunAnnualCompareTableData {
  return {
    daeunStem: buildStemCard(daeun),
    daeunBranch: buildBranchCard(daeun),
    annualStem: buildStemCard(annual),
    annualBranch: buildBranchCard(annual),
    hiddenStems: {
      daeun: daeun?.hiddenStems ?? getHiddenStemsForBranch(getBranch(daeun) ?? ""),
      annual: annual.hiddenStems ?? getHiddenStemsForBranch(getBranch(annual) ?? ""),
    },
    twelveLifeStage: {
      daeun: daeun?.twelveLifeStage ?? [],
      annual: annual.twelveLifeStage ?? [],
    },
    twelveSinsal: {
      daeun: daeun?.twelveSinsal ?? [],
      annual: annual.twelveSinsal ?? [],
    },
    sinsalAndGwiin: {
      daeun: getSinsalAndGwiin(daeun),
      annual: getSinsalAndGwiin(annual),
    },
    interactions: {
      daeun: daeun?.interactions ?? [],
      annual: annual.interactions ?? [],
    },
  };
}

function buildMonthlyRows(
  monthlyFortunes: readonly SaeunMonthlyFortuneInput[],
): readonly SaeunMonthlyFortuneRow[] {
  return [...monthlyFortunes]
    .sort((left, right) => left.month - right.month)
    .map((month) => {
      const monthlyPillar = getMonthlyPillar(month);
      const normalizedMonth = {
        ...month,
        ganji: monthlyPillar ?? undefined,
      };

      return {
        month: month.month,
        monthLabel: month.monthLabel ?? month.label ?? `${month.month}월`,
        monthlyPillar,
        stemCell: buildStemCard(normalizedMonth),
        branchCell: buildBranchCard(normalizedMonth),
        hiddenStems: month.hiddenStems ?? getHiddenStemsForBranch(getBranch(normalizedMonth) ?? ""),
        twelveLifeStage: month.twelveLifeStage ?? [],
        twelveSinsal: month.twelveSinsal ?? [],
        sinsalAndGwiin: getSinsalAndGwiin(month),
        interactions: month.interactions ?? [],
        oneLine: month.oneLine ?? month.headline ?? month.plain ?? null,
        caution: month.caution ?? null,
        basis: month.basis ?? month.monthlyBasis ?? null,
      };
    });
}

function buildStemCard(input: SaeunGanjiInput | undefined): DaeunPillarCard | null {
  const stem = getStem(input);

  if (!stem) {
    return null;
  }

  return {
    ...getStemDisplay(stem),
    tenGod: getTenGod(input, "stem"),
  };
}

function buildBranchCard(
  input: SaeunGanjiInput | undefined,
): DaeunPillarCard | null {
  const branch = getBranch(input);

  if (!branch) {
    return null;
  }

  return {
    ...getBranchDisplay(branch),
    tenGod: getTenGod(input, "branch"),
  };
}

function getStem(input: SaeunGanjiInput | undefined): string | null {
  return input?.heavenlyStem ?? input?.stem ?? getGanji(input)?.slice(0, 1) ?? null;
}

function getBranch(input: SaeunGanjiInput | undefined): string | null {
  return (
    input?.earthlyBranch ??
    input?.branch ??
    getGanji(input)?.slice(1, 2) ??
    null
  );
}

function getGanji(input: SaeunGanjiInput | undefined): string | null {
  return input?.ganji ?? input?.pillar ?? null;
}

function getMonthlyPillar(input: SaeunMonthlyFortuneInput): string | null {
  return input.monthlyPillar ?? input.monthGanji ?? getGanji(input);
}

function getTenGod(
  input: SaeunGanjiInput | undefined,
  target: "stem" | "branch",
): string | null {
  if (!input) {
    return null;
  }

  const directValue = target === "stem" ? input.stemTenGod : input.branchTenGod;

  if (directValue) {
    return directValue;
  }

  const values =
    typeof input.tenGod === "string" ? [input.tenGod] : (input.tenGod ?? []);
  const prefix = target === "stem" ? "천간" : "지지";
  const prefixedValue = values.find((value) => value.startsWith(prefix));

  if (prefixedValue) {
    return prefixedValue.replace(prefix, "").trim() || null;
  }

  return values[target === "stem" ? 0 : 1] ?? null;
}

function getSinsalAndGwiin(input: SaeunGanjiInput | undefined): readonly string[] {
  if (!input) {
    return [];
  }

  return [
    ...(input.sinsalAndGwiin ?? []),
    ...(input.sinsal ?? []),
    ...(input.gwiin ?? []),
  ];
}
