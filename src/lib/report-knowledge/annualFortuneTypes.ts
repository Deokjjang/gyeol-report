export type AnnualFortuneMode =
  | "past_review"
  | "current_year"
  | "new_year_preview"
  | "locked_future";

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

export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";

export type YinYang = "yang" | "yin";

export type TenGod =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인";

export interface AnnualGanjiInfo {
  readonly year: number;
  readonly stem: HeavenlyStem;
  readonly branch: EarthlyBranch;
  readonly ganji: string;
  readonly stemElement: FiveElement;
  readonly branchElement: FiveElement;
  readonly stemYinYang: YinYang;
  readonly branchYinYang: YinYang;
  readonly displayTitle: string;
  readonly elementSummary: string;
}

export interface AnnualMonthGanjiInfo {
  readonly year: number;
  readonly month: number;
  readonly label: string;
  readonly ganji: string;
  readonly stem: HeavenlyStem;
  readonly branch: EarthlyBranch;
  readonly stemElement: FiveElement;
  readonly branchElement: FiveElement;
  readonly elementSummary: string;
  readonly basis: "calendar_month_approximation" | "solar_term_exact";
}

export interface AnnualFortuneYearAccess {
  readonly year: number;
  readonly mode: AnnualFortuneMode;
  readonly isSelectable: boolean;
  readonly label: string;
  readonly reason?: string;
}

export type AnnualBranchInteractionType =
  | "충"
  | "육합"
  | "삼합"
  | "반합"
  | "해"
  | "형"
  | "파";

export type AnnualPillarPosition = "year" | "month" | "day" | "hour";

export interface AnnualBranchInteraction {
  readonly type: AnnualBranchInteractionType;
  readonly branches: readonly EarthlyBranch[];
  readonly plain: string;
  readonly affectedPillars?: readonly AnnualPillarPosition[];
}

export type AnnualFortuneYearAccessStatus =
  | "selectable"
  | "new_year_preview"
  | "locked";

export type AnnualFortuneDomainFlowKey =
  | "careerWork"
  | "moneyResource"
  | "relationshipLove"
  | "healthRoutine"
  | "socialFamily"
  | "studyGrowth";
