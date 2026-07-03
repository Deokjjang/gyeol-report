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

export type ManseRyeokPillarKey = "hour" | "day" | "month" | "year";

export type ManseRyeokStemBranchCell = {
  readonly hanja: string;
  readonly ko: string;
  readonly tenGod: string | null;
  readonly element: ReportTableFiveElement;
  readonly yinYang: ReportTableYinYang;
  readonly colorToken: ReportTableElementColorToken;
};

export type ManseRyeokDetailRowKey =
  | "hiddenStems"
  | "twelveLifeStage"
  | "twelveSinsal"
  | "sinsalAndGwiin"
  | "interactions";

export type ManseRyeokColumn = {
  readonly key: ManseRyeokPillarKey;
  readonly label: string;
};

export type ManseRyeokDetailRow = {
  readonly key: ManseRyeokDetailRowKey;
  readonly label: string;
  readonly cells: Record<ManseRyeokPillarKey, readonly string[]>;
};

export type ManseRyeokCommonTableData = {
  readonly title: string;
  readonly columns: readonly ManseRyeokColumn[];
  readonly stemRow: Record<ManseRyeokPillarKey, ManseRyeokStemBranchCell | null>;
  readonly branchRow: Record<
    ManseRyeokPillarKey,
    ManseRyeokStemBranchCell | null
  >;
  readonly detailRows: readonly ManseRyeokDetailRow[];
};
