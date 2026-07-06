import {
  getTenGodForStemPair as getStemTenGodForPair,
} from "../report-knowledge/annualFortuneYearRules";
import type { HeavenlyStem } from "../report-knowledge/annualFortuneTypes";
import {
  getMbtiSourceProfile,
  type MbtiSourceProfile,
  type MbtiSourceTraitItem,
} from "../report-knowledge/mbti";
import type { MajorFortuneEvidencePacket } from "../report-knowledge/majorFortuneTypes";
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
  DaeunAnnualCompareTableData,
  DaeunFortuneTableData,
  DaeunPillarCard,
  DaeunTimelineRow,
  ManseRyeokCommonTableData,
  MbtiCommonProfileTableData,
  MbtiFunctionStackPosition,
  MbtiPreferenceAxisKey,
} from "./types";

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

type DaeunGanjiInput = {
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

export type DaeunCurrentCycleInput = DaeunGanjiInput & {
  readonly startYear?: number;
  readonly endYear?: number;
  readonly startAge?: number;
  readonly endAge?: number;
};

export type DaeunTimelineYearInput = DaeunGanjiInput & {
  readonly year: number;
  readonly age?: number;
  readonly ageLabel?: string | null;
  readonly isCurrentYear?: boolean;
  readonly isTransitionYear?: boolean;
  readonly isCycleStartYear?: boolean;
  readonly badges?: readonly string[];
  readonly daeunPillar?: string;
  readonly majorGanji?: string;
  readonly annualPillar?: string;
  readonly annualGanji?: string;
  readonly daeunTenGod?: string;
  readonly annualTenGod?: string;
  readonly annualTenGodLabel?: string;
  readonly keyInteractionLabel?: string | null;
  readonly oneLine?: string | null;
  readonly strategy?: string | null;
  readonly yearDetail?: DaeunTimelineRow["yearDetail"];
};

export type DaeunAnnualFortuneInput = DaeunGanjiInput & {
  readonly year: number;
};

export type BuildDaeunFortuneTableDataInput = {
  readonly title?: string;
  readonly displayName?: string;
  readonly currentYear: number;
  readonly selectedYear: number;
  readonly currentAge?: number;
  readonly currentDaeunCycle: DaeunCurrentCycleInput;
  readonly timelineYears: readonly DaeunTimelineYearInput[];
  readonly annualFortunes: readonly DaeunAnnualFortuneInput[];
};

export type MajorFortuneReportCommonTablesData = {
  readonly manseRyeokTableData: ManseRyeokCommonTableData;
  readonly mbtiProfileTableData: MbtiCommonProfileTableData | null;
};

export function buildMajorFortuneReportCommonTablesData(
  evidence: MajorFortuneEvidencePacket,
): MajorFortuneReportCommonTablesData {
  return {
    manseRyeokTableData: buildMajorFortuneReportManseRyeokTableData(evidence),
    mbtiProfileTableData: buildMajorFortuneReportMbtiProfileTableData(evidence),
  };
}

export function buildMajorFortuneReportManseRyeokTableData(
  evidence: MajorFortuneEvidencePacket,
): ManseRyeokCommonTableData {
  return buildManseRyeokCommonTableData({
    displayName: evidence.personLabel,
    fourPillarGrid: buildMajorFortuneFourPillarGrid(evidence),
  });
}

export function buildMajorFortuneReportMbtiProfileTableData(
  evidence: MajorFortuneEvidencePacket,
): MbtiCommonProfileTableData | null {
  const source = getMbtiSourceProfile(evidence.mbtiBasis.type);

  if (source === null) {
    return null;
  }

  return buildMbtiCommonProfileTableData(toMajorFortuneMbtiProfileSource(source));
}

export function buildDaeunFortuneTableData(
  input: BuildDaeunFortuneTableDataInput,
): DaeunFortuneTableData {
  const annualFortunesByYear = new Map(
    input.annualFortunes.map((fortune) => [fortune.year, fortune]),
  );
  const selectedAnnualFortune = annualFortunesByYear.get(input.selectedYear);
  const currentDaeunGanji = getGanji(input.currentDaeunCycle);

  return {
    title: buildTitle(input),
    selectedYear: input.selectedYear,
    currentDaeun: {
      ganji: currentDaeunGanji,
      startYear: input.currentDaeunCycle.startYear ?? null,
      endYear: input.currentDaeunCycle.endYear ?? null,
      startAge: input.currentDaeunCycle.startAge ?? null,
      endAge: input.currentDaeunCycle.endAge ?? null,
      stem: buildStemCard(input.currentDaeunCycle),
      branch: buildBranchCard(input.currentDaeunCycle),
    },
    timelineRows: buildTimelineRows(input, annualFortunesByYear),
    annualCompareTable: buildAnnualCompareTable(
      input.currentDaeunCycle,
      selectedAnnualFortune,
    ),
  };
}

function buildMajorFortuneFourPillarGrid(
  evidence: MajorFortuneEvidencePacket,
): readonly ManseRyeokFourPillarGridColumnInput[] {
  return [
    buildMajorFortunePillarColumn("year", evidence.baseSaju.pillars.year, evidence),
    buildMajorFortunePillarColumn("month", evidence.baseSaju.pillars.month, evidence),
    buildMajorFortunePillarColumn("day", evidence.baseSaju.pillars.day, evidence),
    buildMajorFortunePillarColumn("hour", evidence.baseSaju.pillars.hour, evidence),
  ].filter(
    (column): column is ManseRyeokFourPillarGridColumnInput =>
      column !== null,
  );
}

function buildMajorFortunePillarColumn(
  columnId: ManseRyeokFourPillarGridColumnInput["columnId"],
  pillar: string | undefined,
  evidence: MajorFortuneEvidencePacket,
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

function toMajorFortuneMbtiProfileSource(
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
    traits: buildMajorFortuneMbtiTraits(source),
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

function buildMajorFortuneMbtiTraits(
  source: MbtiSourceProfile,
): Readonly<Record<string, readonly MbtiSourceTraitItem[]>> {
  const reportUseCases = (source.reportUseCases?.daeunReport ?? []).slice(0, 5);

  if (reportUseCases.length === 0) {
    return {};
  }

  return {
    "대운 활용": reportUseCases.map((line, index) => ({
      id: `daeun_report_use_case_${index + 1}`,
      label: getMajorFortuneReportUseCaseLabel(index),
      plainKo: sanitizeMajorFortuneReportUseCaseLine(line),
      productDomains: [],
    })),
  };
}

function getMajorFortuneReportUseCaseLabel(index: number): string {
  return [
    "10년 흐름",
    "일과 역할",
    "돈과 자원",
    "관계 리듬",
    "성장 방식",
  ][index] ?? "활용 포인트";
}

function sanitizeMajorFortuneReportUseCaseLine(line: string): string {
  return line
    .replaceAll("daeun 섹션", "대운 해석")
    .replaceAll("daeun 리포트", "대운 리포트")
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

function buildTitle(input: BuildDaeunFortuneTableDataInput): string {
  if (input.title) {
    return input.title;
  }

  if (input.displayName) {
    return `${input.displayName}님의 대운표`;
  }

  return "대운표";
}

function buildTimelineRows(
  input: BuildDaeunFortuneTableDataInput,
  annualFortunesByYear: ReadonlyMap<number, DaeunAnnualFortuneInput>,
): readonly DaeunTimelineRow[] {
  return [...input.timelineYears]
    .sort((left, right) => left.year - right.year)
    .map((row) => {
      const annualFortune = annualFortunesByYear.get(row.year);
      const daeunGanji =
        row.daeunPillar ?? row.majorGanji ?? getGanji(input.currentDaeunCycle);
      const annualGanji =
        row.annualPillar ?? row.annualGanji ?? getGanji(annualFortune);
      const daeunInput = {
        ...input.currentDaeunCycle,
        ganji: daeunGanji ?? undefined,
        stemTenGod: row.daeunTenGod ?? input.currentDaeunCycle.stemTenGod,
      };
      const annualInput = {
        ...annualFortune,
        ganji: annualGanji ?? undefined,
        stemTenGod:
          row.annualTenGod ??
          row.annualTenGodLabel ??
          annualFortune?.stemTenGod,
      };
      const age = getAge({
        row,
        currentYear: input.currentYear,
        currentAge: input.currentAge,
      });
      const isCurrentYear = row.isCurrentYear ?? row.year === input.currentYear;
      const isTransitionYear =
        row.isTransitionYear ??
        row.isCycleStartYear ??
        row.year === input.currentDaeunCycle.startYear;

      return {
        year: row.year,
        age,
        ageLabel: row.ageLabel ?? (age === null ? null : `${age}세`),
        isCurrentYear,
        isTransitionYear,
        badges: buildBadges({
          badges: row.badges ?? [],
          isCurrentYear,
          isTransitionYear,
        }),
        daeunPillar: buildPillarDisplay(daeunInput),
        annualPillar: buildPillarDisplay(annualInput),
        daeunTenGod: row.daeunTenGod ?? getTenGod(input.currentDaeunCycle, "stem"),
        annualTenGod:
          row.annualTenGod ??
          row.annualTenGodLabel ??
          getTenGod(annualFortune, "stem"),
        keyInteractionLabel: row.keyInteractionLabel ?? null,
        oneLine: row.oneLine ?? null,
        strategy: row.strategy ?? null,
        yearDetail: row.yearDetail,
      };
    });
}

function buildAnnualCompareTable(
  currentDaeunCycle: DaeunCurrentCycleInput,
  selectedAnnualFortune: DaeunAnnualFortuneInput | undefined,
): DaeunAnnualCompareTableData {
  return {
    daeunStem: buildStemCard(currentDaeunCycle),
    daeunBranch: buildBranchCard(currentDaeunCycle),
    annualStem: buildStemCard(selectedAnnualFortune),
    annualBranch: buildBranchCard(selectedAnnualFortune),
    hiddenStems: {
      daeun:
        currentDaeunCycle.hiddenStems ??
        getHiddenStemsForBranch(getBranch(currentDaeunCycle)),
      annual:
        selectedAnnualFortune?.hiddenStems ??
        getHiddenStemsForBranch(getBranch(selectedAnnualFortune)),
    },
    twelveLifeStage: {
      daeun: currentDaeunCycle.twelveLifeStage ?? [],
      annual: selectedAnnualFortune?.twelveLifeStage ?? [],
    },
    twelveSinsal: {
      daeun: currentDaeunCycle.twelveSinsal ?? [],
      annual: selectedAnnualFortune?.twelveSinsal ?? [],
    },
    sinsalAndGwiin: {
      daeun: getSinsalAndGwiin(currentDaeunCycle),
      annual: getSinsalAndGwiin(selectedAnnualFortune),
    },
    interactions: {
      daeun: currentDaeunCycle.interactions ?? [],
      annual: selectedAnnualFortune?.interactions ?? [],
    },
  };
}

function getHiddenStemsForBranch(branch: string | null): readonly string[] {
  return branch === null ? [] : HIDDEN_STEMS_BY_BRANCH[branch] ?? [];
}

function buildPillarDisplay(input: DaeunGanjiInput | undefined): {
  readonly ganji: string | null;
  readonly stem: DaeunPillarCard | null;
  readonly branch: DaeunPillarCard | null;
} {
  const ganji = getGanji(input);

  return {
    ganji,
    stem: buildStemCard(input),
    branch: buildBranchCard(input),
  };
}

function buildStemCard(input: DaeunGanjiInput | undefined): DaeunPillarCard | null {
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
  input: DaeunGanjiInput | undefined,
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

function getStem(input: DaeunGanjiInput | undefined): string | null {
  return input?.heavenlyStem ?? input?.stem ?? getGanji(input)?.slice(0, 1) ?? null;
}

function getBranch(input: DaeunGanjiInput | undefined): string | null {
  return (
    input?.earthlyBranch ??
    input?.branch ??
    getGanji(input)?.slice(1, 2) ??
    null
  );
}

function getGanji(input: DaeunGanjiInput | undefined): string | null {
  return input?.ganji ?? input?.pillar ?? null;
}

function getTenGod(
  input: DaeunGanjiInput | undefined,
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

function getAge(input: {
  readonly row: DaeunTimelineYearInput;
  readonly currentYear: number;
  readonly currentAge?: number;
}): number | null {
  if (input.row.age !== undefined) {
    return input.row.age;
  }

  if (input.row.ageLabel) {
    const parsedAge = Number.parseInt(input.row.ageLabel, 10);

    if (Number.isFinite(parsedAge)) {
      return parsedAge;
    }
  }

  if (input.currentAge !== undefined) {
    return input.currentAge + (input.row.year - input.currentYear);
  }

  return null;
}

function buildBadges(input: {
  readonly badges: readonly string[];
  readonly isCurrentYear: boolean;
  readonly isTransitionYear: boolean;
}): readonly string[] {
  return [
    ...new Set([
      ...input.badges,
      input.isCurrentYear ? "올해" : undefined,
      input.isTransitionYear ? "전환" : undefined,
    ].filter((badge): badge is string => badge !== undefined)),
  ];
}

function getSinsalAndGwiin(
  input: DaeunGanjiInput | undefined,
): readonly string[] {
  if (!input) {
    return [];
  }

  return [
    ...(input.sinsalAndGwiin ?? []),
    ...(input.sinsal ?? []),
    ...(input.gwiin ?? []),
  ];
}
