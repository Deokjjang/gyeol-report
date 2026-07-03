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

export type MbtiPreferenceAxisKey =
  | "energy"
  | "perception"
  | "judgment"
  | "lifestyle";

export type MbtiPreferenceCode =
  | "E"
  | "I"
  | "S"
  | "N"
  | "T"
  | "F"
  | "J"
  | "P";

export type MbtiPreferenceDisplay = {
  readonly code: MbtiPreferenceCode;
  readonly nameKo: string;
  readonly nameEn: string;
  readonly description: string;
};

export type MbtiPreferenceAxisOption = MbtiPreferenceDisplay & {
  readonly selected: boolean;
};

export type MbtiPreferenceAxisRow = {
  readonly axisKey: MbtiPreferenceAxisKey;
  readonly label: string;
  readonly selectedCode: MbtiPreferenceCode;
  readonly left: MbtiPreferenceAxisOption;
  readonly right: MbtiPreferenceAxisOption;
};

export type MbtiFunctionStackPosition =
  | "dominant"
  | "auxiliary"
  | "tertiary"
  | "inferior";

export type MbtiFunctionCode =
  | "Te"
  | "Ti"
  | "Fe"
  | "Fi"
  | "Se"
  | "Si"
  | "Ne"
  | "Ni";

export type MbtiFunctionDisplay = {
  readonly code: MbtiFunctionCode;
  readonly nameKo: string;
  readonly attitude: "외향" | "내향";
  readonly domain: "사고" | "감정" | "감각" | "직관";
  readonly description: string;
  readonly reportUsageNote: string;
};

export type MbtiFunctionStackRow = MbtiFunctionDisplay & {
  readonly position: MbtiFunctionStackPosition;
  readonly label: string;
};

export type MbtiCoreSummaryItem = {
  readonly key: string;
  readonly label: string;
  readonly text: string;
};

export type MbtiReportUsageNote = {
  readonly categoryKey: string;
  readonly id: string | null;
  readonly label: string;
  readonly plainKo: string | null;
  readonly strongLine: string | null;
  readonly positiveUse: string | null;
  readonly risk: string | null;
  readonly productDomains: readonly string[];
};

export type MbtiCommonProfileTableData = {
  readonly type: string;
  readonly titleKo: string;
  readonly archetype: string;
  readonly oneLine: string;
  readonly preferenceRows: readonly MbtiPreferenceAxisRow[];
  readonly functionRows: readonly MbtiFunctionStackRow[];
  readonly coreSummary: readonly MbtiCoreSummaryItem[];
  readonly closeKeywords: readonly string[];
  readonly farKeywords: readonly string[];
  readonly reportUsageNotes: readonly MbtiReportUsageNote[];
};
