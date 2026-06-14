import type { FiveElement, TenGod } from "./sajuKnowledgeTypes";

export const KOREAN_HEAVENLY_STEMS = [
  "갑",
  "을",
  "병",
  "정",
  "무",
  "기",
  "경",
  "신",
  "임",
  "계",
] as const;

export const KOREAN_EARTHLY_BRANCHES = [
  "자",
  "축",
  "인",
  "묘",
  "진",
  "사",
  "오",
  "미",
  "신",
  "유",
  "술",
  "해",
] as const;

export type KoreanHeavenlyStem = (typeof KOREAN_HEAVENLY_STEMS)[number];
export type KoreanEarthlyBranch = (typeof KOREAN_EARTHLY_BRANCHES)[number];
export type KoreanGanji = `${KoreanHeavenlyStem}${KoreanEarthlyBranch}`;

export type FiveElementCounts = Record<FiveElement, number>;

export const COMPUTED_SAJU_SPECIAL_PATTERN_IDS = [
  "jaeda_sinyak",
  "gwansal_mixed",
  "siksang_saengjae",
  "jaesaenggwan",
  "salin_sangsaeng",
  "strong_day_master",
  "weak_day_master",
  "no_resource",
  "no_output",
  "earth_excess_buries_metal",
  "metal_excess_cuts_wood",
  "wood_excess_feeds_fire",
  "water_excess_floats_wood",
] as const;

export type ComputedSajuSpecialPatternId =
  (typeof COMPUTED_SAJU_SPECIAL_PATTERN_IDS)[number];

export const COMPUTED_SINSAL_IDS = [
  "hyeonchim",
  "hongyeom",
  "mangsin",
  "baekho",
  "yeokma",
  "gwimun",
  "wonjin",
  "dohwa",
  "hwagae",
  "goegang",
  "yangin",
  "cheonmun",
  "wolsal",
  "jangseong",
  "banan",
] as const;

export type ComputedSinsalId = (typeof COMPUTED_SINSAL_IDS)[number];

export const COMPUTED_GWIIN_IDS = [
  "cheon_eul",
  "cheon_deok",
  "wol_deok",
  "munchang",
  "taegeuk",
  "jaego",
] as const;

export type ComputedGwiinId = (typeof COMPUTED_GWIIN_IDS)[number];

export const COMPUTED_TEN_GOD_SIGNAL_STRENGTHS = [
  "missing",
  "weak",
  "present",
  "strong",
  "excessive",
] as const;

export type ComputedTenGodSignalStrength =
  (typeof COMPUTED_TEN_GOD_SIGNAL_STRENGTHS)[number];

export type ComputedTenGodSignal = {
  readonly tenGod: TenGod;
  readonly strength: ComputedTenGodSignalStrength;
};

export type ComputedSajuFacts = {
  readonly yearPillar?: string;
  readonly monthPillar?: string;
  readonly hourPillar?: string;
  readonly earthlyBranches?: readonly string[];
  readonly heavenlyStems?: readonly string[];
  readonly dayMaster: KoreanHeavenlyStem;
  readonly dayPillar: KoreanGanji;
  readonly fiveElementCounts: FiveElementCounts;
  readonly excessiveElements: readonly FiveElement[];
  readonly missingElements: readonly FiveElement[];
  readonly usefulElements?: readonly FiveElement[];
  readonly tenGodSignals: readonly ComputedTenGodSignal[];
  readonly specialPatterns: readonly ComputedSajuSpecialPatternId[];
  readonly sinsal: readonly ComputedSinsalId[];
  readonly gwiin: readonly ComputedGwiinId[];
};
