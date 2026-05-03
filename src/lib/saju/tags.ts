import type { ElementLabel, FiveElement, HeavenlyStem, TenGod, YinYangLabel } from "./types";

export type SajuTagCategory =
  | "DAY_MASTER"
  | "ELEMENT"
  | "TEN_GOD"
  | "YIN_YANG"
  | "STRENGTH_BALANCE"
  | "ADVANCED_PATTERN"
  | "SHINSAL"
  | "RELATION"
  | "BIRTH_TIME"
  | "NOTICE";

export type SajuTagSeverity = "INFO" | "LOW" | "MEDIUM" | "HIGH";

export type SajuTagConfidence = "LOW" | "MEDIUM" | "HIGH";

export type DayMasterTagCode =
  | "DAY_MASTER_GAP_WOOD"
  | "DAY_MASTER_EUL_WOOD"
  | "DAY_MASTER_BYEONG_FIRE"
  | "DAY_MASTER_JEONG_FIRE"
  | "DAY_MASTER_MU_EARTH"
  | "DAY_MASTER_GI_EARTH"
  | "DAY_MASTER_GYEONG_METAL"
  | "DAY_MASTER_SIN_METAL"
  | "DAY_MASTER_IM_WATER"
  | "DAY_MASTER_GYE_WATER";

export type ElementTagCode = ElementLabel;

export type TenGodTagCode =
  | "TEN_GOD_PEER_STRONG"
  | "TEN_GOD_PEER_WEAK"
  | "TEN_GOD_OUTPUT_STRONG"
  | "TEN_GOD_OUTPUT_WEAK"
  | "TEN_GOD_WEALTH_STRONG"
  | "TEN_GOD_WEALTH_WEAK"
  | "TEN_GOD_OFFICER_STRONG"
  | "TEN_GOD_OFFICER_WEAK"
  | "TEN_GOD_RESOURCE_STRONG"
  | "TEN_GOD_RESOURCE_WEAK";

export type YinYangTagCode = YinYangLabel;

export type StrengthBalanceTagCode =
  | "DAY_MASTER_RELATIVELY_STRONG"
  | "DAY_MASTER_RELATIVELY_WEAK"
  | "DAY_MASTER_BALANCED"
  | "SUPPORT_LOW"
  | "PRESSURE_HIGH";

export type AdvancedPatternTagCode =
  | "WEALTH_OVERLOAD"
  | "WEAK_DAYMASTER_WITH_STRONG_WEALTH"
  | "OFFICER_PRESSURE_HIGH"
  | "RESOURCE_SUPPORT_MISSING"
  | "EXPRESSION_OUTPUT_MISSING"
  | "FOOD_WEALTH_FLOW"
  | "KILLING_RESOURCE_FLOW"
  | "MIXED_OFFICER_KILLING"
  | "HURTING_OFFICER_SEES_OFFICER"
  | "PEER_OVERLOAD"
  | "RESOURCE_OVERLOAD";

export type ShinsalTagCode =
  | "SHINSAL_HYEONCHIMSAL"
  | "SHINSAL_HONGYEOMSAL"
  | "SHINSAL_BAEKHODAESAL"
  | "SHINSAL_MANGSINSAL"
  | "SHINSAL_YEOKMASAL"
  | "SHINSAL_DOHWASAL"
  | "SHINSAL_HWAGAE"
  | "SHINSAL_GOSINSAL"
  | "SHINSAL_GWASUKSAL"
  | "SHINSAL_CHEON_EUL_GWIIN"
  | "SHINSAL_TAEGEUK_GWIIN"
  | "SHINSAL_MUN_CHANG_GWIIN"
  | "SHINSAL_HAK_DANG_GWIIN"
  | "SHINSAL_WOL_DEOK_GWIIN"
  | "SHINSAL_CHEON_DEOK_GWIIN"
  | "SHINSAL_TWELVE_GEOPSAL"
  | "SHINSAL_TWELVE_JAESAL"
  | "SHINSAL_TWELVE_CHEONSAL"
  | "SHINSAL_TWELVE_JISAL"
  | "SHINSAL_TWELVE_NYEONSAL"
  | "SHINSAL_TWELVE_WOLSAL"
  | "SHINSAL_TWELVE_MANGSINSAL"
  | "SHINSAL_TWELVE_JANGSEONGSAL"
  | "SHINSAL_TWELVE_BANANSAL"
  | "SHINSAL_TWELVE_YEOKMASAL"
  | "SHINSAL_TWELVE_YUKHAESAL"
  | "SHINSAL_TWELVE_HWAGAE";

export type RelationTagCode =
  | "STEM_COMBINATION_PRESENT"
  | "BRANCH_COMBINATION_PRESENT"
  | "BRANCH_CLASH_PRESENT";

export type BirthTimeTagCode = "BIRTH_TIME_KNOWN" | "BIRTH_TIME_UNKNOWN";

export type NoticeTagCode =
  | "BIRTH_TIME_UNKNOWN_NOTICE"
  | "LUNAR_UNSUPPORTED_NOTICE";

export type SajuTagCode =
  | DayMasterTagCode
  | ElementTagCode
  | TenGodTagCode
  | YinYangTagCode
  | StrengthBalanceTagCode
  | AdvancedPatternTagCode
  | ShinsalTagCode
  | RelationTagCode
  | BirthTimeTagCode
  | NoticeTagCode;

export type SajuTag = {
  code: SajuTagCode;
  category: SajuTagCategory;
  severity: SajuTagSeverity;
  confidence: SajuTagConfidence;
  labelKo: string;
  descriptionKo: string;
  evidence: string[];
};

export type DayMasterTagCodeByStem = Record<HeavenlyStem, DayMasterTagCode>;

export type TenGodGroup =
  | "PEER"
  | "OUTPUT"
  | "WEALTH"
  | "OFFICER"
  | "RESOURCE";

export type TenGodGroupMap = Record<TenGodGroup, readonly TenGod[]>;

export type ElementTagCodeByElementState = Record<
  FiveElement,
  {
    strong: ElementTagCode;
    weak: ElementTagCode;
    missing: ElementTagCode;
  }
>;
