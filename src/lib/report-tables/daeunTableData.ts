import {
  getBranchDisplay,
  getStemDisplay,
} from "./displayDictionaries";
import type {
  DaeunAnnualCompareTableData,
  DaeunFortuneTableData,
  DaeunPillarCard,
  DaeunTimelineRow,
} from "./types";

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
      daeun: currentDaeunCycle.hiddenStems ?? [],
      annual: selectedAnnualFortune?.hiddenStems ?? [],
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
