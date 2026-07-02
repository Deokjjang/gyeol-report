export type ReportTableFiveElement =
  | "wood"
  | "fire"
  | "earth"
  | "metal"
  | "water";

export type ReportTableYinYang = "yang" | "yin";

export type ReportTableElementColorToken =
  | "wood-green"
  | "fire-red"
  | "earth-soil"
  | "metal-gold"
  | "water-sky";

export type ReportTableHeavenlyStem =
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

export type ReportTableEarthlyBranch =
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

export type ReportTableGanjiDisplayBase = {
  readonly hanja: string;
  readonly ko: string;
  readonly element: ReportTableFiveElement;
  readonly yinYang: ReportTableYinYang;
  readonly colorToken: ReportTableElementColorToken;
};

export type ReportTableStemDisplay = ReportTableGanjiDisplayBase & {
  readonly hanja: ReportTableHeavenlyStem;
};

export type ReportTableBranchDisplay = ReportTableGanjiDisplayBase & {
  readonly hanja: ReportTableEarthlyBranch;
};
