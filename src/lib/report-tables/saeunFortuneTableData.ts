import {
  getBranchDisplay,
  getStemDisplay,
} from "./displayDictionaries";
import type {
  DaeunPillarCard,
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
      daeun: daeun?.hiddenStems ?? [],
      annual: annual.hiddenStems ?? [],
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
        hiddenStems: month.hiddenStems ?? [],
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
