import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  YinYang,
} from "./annualFortuneTypes";
import {
  getBranchElement,
  getBranchYinYang,
  getStemElement,
  getStemYinYang,
} from "./annualFortuneYearRules";
import type {
  MajorFortuneCycle,
  MajorFortuneCycleAccess,
} from "./majorFortuneTypes";

const heavenlyStemSet = new Set<HeavenlyStem>([
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
]);

const earthlyBranchSet = new Set<EarthlyBranch>([
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
]);

function parseMajorStem(value: string): HeavenlyStem {
  if (heavenlyStemSet.has(value as HeavenlyStem)) {
    return value as HeavenlyStem;
  }

  throw new Error(`Invalid major fortune stem: ${value}`);
}

function parseMajorBranch(value: string): EarthlyBranch {
  if (earthlyBranchSet.has(value as EarthlyBranch)) {
    return value as EarthlyBranch;
  }

  throw new Error(`Invalid major fortune branch: ${value}`);
}

export function getMajorFortuneGanjiInfo(ganji: string): {
  readonly stem: HeavenlyStem;
  readonly branch: EarthlyBranch;
  readonly stemElement: FiveElement;
  readonly branchElement: FiveElement;
  readonly stemYinYang: YinYang;
  readonly branchYinYang: YinYang;
} {
  const normalized = ganji.trim();
  const stem = parseMajorStem([...normalized][0] ?? "");
  const branch = parseMajorBranch([...normalized][1] ?? "");

  return {
    stem,
    branch,
    stemElement: getStemElement(stem),
    branchElement: getBranchElement(branch),
    stemYinYang: getStemYinYang(stem),
    branchYinYang: getBranchYinYang(branch),
  };
}

export function hydrateMajorFortuneCycle(input: {
  readonly index: number;
  readonly startAge: number;
  readonly endAge: number;
  readonly startYear: number;
  readonly endYear: number;
  readonly ganji: string;
}): MajorFortuneCycle {
  const ganjiInfo = getMajorFortuneGanjiInfo(input.ganji);

  return {
    index: input.index,
    startAge: input.startAge,
    endAge: input.endAge,
    startYear: input.startYear,
    endYear: input.endYear,
    ganji: input.ganji,
    ...ganjiInfo,
  };
}

export function getMajorFortuneCycleForYear(params: {
  readonly cycles: readonly MajorFortuneCycle[];
  readonly currentYear: number;
  readonly currentAge: number;
}): MajorFortuneCycleAccess {
  const currentCycleIndex = params.cycles.findIndex(
    (cycle) =>
      cycle.startYear <= params.currentYear &&
      params.currentYear <= cycle.endYear,
  );

  if (currentCycleIndex < 0) {
    throw new Error(
      `No major fortune cycle covers current year: ${params.currentYear}`,
    );
  }

  const currentCycle = params.cycles[currentCycleIndex];

  if (currentCycle === undefined) {
    throw new Error(`Invalid major fortune cycle index: ${currentCycleIndex}`);
  }

  return {
    currentAge: params.currentAge,
    currentYear: params.currentYear,
    currentCycle,
    previousCycle: params.cycles[currentCycleIndex - 1],
    nextCycle: params.cycles[currentCycleIndex + 1],
  };
}
