import type {
  EarthlyBranch,
  FiveElement,
  HeavenlyStem,
  Pillar,
  YinYang,
} from "./types";

export const HEAVENLY_STEMS = [
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
] as const satisfies readonly HeavenlyStem[];

export const STEM_ELEMENT: Record<HeavenlyStem, FiveElement> = {
  甲: "WOOD",
  乙: "WOOD",
  丙: "FIRE",
  丁: "FIRE",
  戊: "EARTH",
  己: "EARTH",
  庚: "METAL",
  辛: "METAL",
  壬: "WATER",
  癸: "WATER",
};

export const STEM_YIN_YANG: Record<HeavenlyStem, YinYang> = {
  甲: "YANG",
  乙: "YIN",
  丙: "YANG",
  丁: "YIN",
  戊: "YANG",
  己: "YIN",
  庚: "YANG",
  辛: "YIN",
  壬: "YANG",
  癸: "YIN",
};

export const EARTHLY_BRANCHES = [
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
] as const satisfies readonly EarthlyBranch[];

export const BRANCH_MAIN_ELEMENT: Record<EarthlyBranch, FiveElement> = {
  子: "WATER",
  丑: "EARTH",
  寅: "WOOD",
  卯: "WOOD",
  辰: "EARTH",
  巳: "FIRE",
  午: "FIRE",
  未: "EARTH",
  申: "METAL",
  酉: "METAL",
  戌: "EARTH",
  亥: "WATER",
};

export const BRANCH_YIN_YANG: Record<EarthlyBranch, YinYang> = {
  子: "YANG",
  丑: "YIN",
  寅: "YANG",
  卯: "YIN",
  辰: "YANG",
  巳: "YIN",
  午: "YANG",
  未: "YIN",
  申: "YANG",
  酉: "YIN",
  戌: "YANG",
  亥: "YIN",
};

export const SEXAGENARY_CYCLE = Array.from({ length: 60 }, (_, index) => ({
  stem: HEAVENLY_STEMS[index % 10],
  branch: EARTHLY_BRANCHES[index % 12],
})) as readonly Pillar[];

export const STEM_INDEX: Record<HeavenlyStem, number> = Object.fromEntries(
  HEAVENLY_STEMS.map((stem, index) => [stem, index]),
) as Record<HeavenlyStem, number>;

export const BRANCH_INDEX: Record<EarthlyBranch, number> = Object.fromEntries(
  EARTHLY_BRANCHES.map((branch, index) => [branch, index]),
) as Record<EarthlyBranch, number>;

export type HiddenStemWeightKind = "MAIN" | "SUB" | "MINOR";

export type HiddenStemConstant = {
  stem: HeavenlyStem;
  kind: HiddenStemWeightKind;
  weight: number;
};

export const HIDDEN_STEMS: Record<
  EarthlyBranch,
  readonly HiddenStemConstant[]
> = {
  子: [{ stem: "癸", kind: "MAIN", weight: 0.6 }],
  丑: [
    { stem: "己", kind: "MAIN", weight: 0.6 },
    { stem: "癸", kind: "SUB", weight: 0.3 },
    { stem: "辛", kind: "MINOR", weight: 0.1 },
  ],
  寅: [
    { stem: "甲", kind: "MAIN", weight: 0.6 },
    { stem: "丙", kind: "SUB", weight: 0.3 },
    { stem: "戊", kind: "MINOR", weight: 0.1 },
  ],
  卯: [{ stem: "乙", kind: "MAIN", weight: 0.6 }],
  辰: [
    { stem: "戊", kind: "MAIN", weight: 0.6 },
    { stem: "乙", kind: "SUB", weight: 0.3 },
    { stem: "癸", kind: "MINOR", weight: 0.1 },
  ],
  巳: [
    { stem: "丙", kind: "MAIN", weight: 0.6 },
    { stem: "戊", kind: "SUB", weight: 0.3 },
    { stem: "庚", kind: "MINOR", weight: 0.1 },
  ],
  午: [
    { stem: "丁", kind: "MAIN", weight: 0.6 },
    { stem: "己", kind: "SUB", weight: 0.3 },
  ],
  未: [
    { stem: "己", kind: "MAIN", weight: 0.6 },
    { stem: "丁", kind: "SUB", weight: 0.3 },
    { stem: "乙", kind: "MINOR", weight: 0.1 },
  ],
  申: [
    { stem: "庚", kind: "MAIN", weight: 0.6 },
    { stem: "壬", kind: "SUB", weight: 0.3 },
    { stem: "戊", kind: "MINOR", weight: 0.1 },
  ],
  酉: [{ stem: "辛", kind: "MAIN", weight: 0.6 }],
  戌: [
    { stem: "戊", kind: "MAIN", weight: 0.6 },
    { stem: "辛", kind: "SUB", weight: 0.3 },
    { stem: "丁", kind: "MINOR", weight: 0.1 },
  ],
  亥: [
    { stem: "壬", kind: "MAIN", weight: 0.6 },
    { stem: "甲", kind: "SUB", weight: 0.3 },
  ],
};

export const ELEMENT_WEIGHTS = {
  heavenlyStem: 1.0,
  earthlyBranchMain: 1.0,
  hiddenStemMain: 0.6,
  hiddenStemSub: 0.3,
  hiddenStemMinor: 0.1,
} as const;

export type HourBranchRange = {
  branch: EarthlyBranch;
  startHour: number;
  endHour: number;
};

export const HOUR_BRANCH_RANGES: readonly HourBranchRange[] = [
  { branch: "子", startHour: 23, endHour: 0 },
  { branch: "丑", startHour: 1, endHour: 2 },
  { branch: "寅", startHour: 3, endHour: 4 },
  { branch: "卯", startHour: 5, endHour: 6 },
  { branch: "辰", startHour: 7, endHour: 8 },
  { branch: "巳", startHour: 9, endHour: 10 },
  { branch: "午", startHour: 11, endHour: 12 },
  { branch: "未", startHour: 13, endHour: 14 },
  { branch: "申", startHour: 15, endHour: 16 },
  { branch: "酉", startHour: 17, endHour: 18 },
  { branch: "戌", startHour: 19, endHour: 20 },
  { branch: "亥", startHour: 21, endHour: 22 },
] as const;

export const HOUR_STEM_START_BY_DAY_STEM: Record<
  HeavenlyStem,
  HeavenlyStem
> = {
  甲: "甲",
  己: "甲",
  乙: "丙",
  庚: "丙",
  丙: "戊",
  辛: "戊",
  丁: "庚",
  壬: "庚",
  戊: "壬",
  癸: "壬",
};

export const MONTH_BRANCHES_BY_SOLAR_TERM = [
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
  "子",
  "丑",
] as const satisfies readonly EarthlyBranch[];

export const MONTH_STEM_START_BY_YEAR_STEM: Record<
  HeavenlyStem,
  HeavenlyStem
> = {
  甲: "丙",
  己: "丙",
  乙: "戊",
  庚: "戊",
  丙: "庚",
  辛: "庚",
  丁: "壬",
  壬: "壬",
  戊: "甲",
  癸: "甲",
};

export const STEM_COMBINATIONS = [
  ["甲", "己"],
  ["乙", "庚"],
  ["丙", "辛"],
  ["丁", "壬"],
  ["戊", "癸"],
] as const;

export const BRANCH_COMBINATIONS = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"],
] as const;

export const BRANCH_CLASHES = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
] as const;
