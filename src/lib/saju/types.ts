export const SAJU_CALC_SPEC_VERSION = "SAJU_CALC_SPEC_v0.1" as const;

export type HeavenlyStem =
  | "甲"
  | "乙"
  | "丙"
  | "丁"
  | "戊"
  | "己"
  | "庚"
  | "辛"
  | "壬"
  | "癸";

export type EarthlyBranch =
  | "子"
  | "丑"
  | "寅"
  | "卯"
  | "辰"
  | "巳"
  | "午"
  | "未"
  | "申"
  | "酉"
  | "戌"
  | "亥";

export type FiveElement = "WOOD" | "FIRE" | "EARTH" | "METAL" | "WATER";

export type YinYang = "YANG" | "YIN";

export type TenGod =
  | "比肩"
  | "劫財"
  | "食神"
  | "傷官"
  | "偏財"
  | "正財"
  | "偏官"
  | "正官"
  | "偏印"
  | "正印";

export type Pillar = {
  stem: HeavenlyStem;
  branch: EarthlyBranch;
};

export type CalendarType = "SOLAR" | "LUNAR";

export type Gender = "MALE" | "FEMALE" | "OTHER_OR_UNSPECIFIED";

export type SajuCalcInput = {
  birthDate: string;
  birthTime?: string;
  birthTimeUnknown: boolean;
  calendarType: CalendarType;
  isLeapMonth?: boolean;
  gender: Gender;
  timezone: "Asia/Seoul";
};

export type ElementLabel =
  | "WOOD_STRONG"
  | "WOOD_WEAK"
  | "WOOD_MISSING"
  | "FIRE_STRONG"
  | "FIRE_WEAK"
  | "FIRE_MISSING"
  | "EARTH_STRONG"
  | "EARTH_WEAK"
  | "EARTH_MISSING"
  | "METAL_STRONG"
  | "METAL_WEAK"
  | "METAL_MISSING"
  | "WATER_STRONG"
  | "WATER_WEAK"
  | "WATER_MISSING";

export type YinYangLabel = "YIN_HEAVY" | "YANG_HEAVY" | "BALANCED";

export type HiddenStemEntry = {
  branch: EarthlyBranch;
  stem: HeavenlyStem;
  tenGod?: TenGod;
  weight: number;
};

export type SajuCalcResult = {
  input: SajuCalcInput;
  converted?: {
    solarDate: string;
    lunarDate?: string;
    isLeapMonth?: boolean;
  };
  pillars: {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    hour?: Pillar;
  };
  dayMaster: HeavenlyStem;
  tenGods: {
    stems: Partial<Record<"year" | "month" | "hour", TenGod>>;
    hiddenStems: HiddenStemEntry[];
    distribution: Record<TenGod, number>;
  };
  elements: {
    visible: Record<FiveElement, number>;
    weighted: Record<FiveElement, number>;
    labels: ElementLabel[];
  };
  yinYang: {
    yin: number;
    yang: number;
    label: YinYangLabel;
  };
  relations: {
    stemCombinations: string[];
    branchCombinations: string[];
    branchClashes: string[];
  };
  notices: string[];
};
