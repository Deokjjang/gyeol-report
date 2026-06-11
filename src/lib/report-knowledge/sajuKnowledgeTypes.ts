import type { InterpretationTagId } from "./interpretationTags";

export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";

export type TenGod =
  | "bijian"
  | "jie_cai"
  | "shi_shen"
  | "shang_guan"
  | "pian_cai"
  | "zheng_cai"
  | "qi_sha"
  | "zheng_guan"
  | "pian_yin"
  | "zheng_yin";

export type SajuKnowledgeTopic =
  | "personality"
  | "strengths"
  | "weaknesses"
  | "work_career"
  | "money_asset"
  | "love_relationship"
  | "human_relations"
  | "family_independence"
  | "study_growth"
  | "environment_luck"
  | "final_advice";

export type SajuKnowledgeCategory =
  | "day_master"
  | "day_pillar"
  | "five_element"
  | "ten_god"
  | "special_pattern"
  | "nobleman"
  | "sinsal"
  | "relationship"
  | "element_balance";

export type KnowledgePhraseSeeds = {
  readonly analytical: readonly string[];
  readonly conversational: readonly string[];
  readonly caution: readonly string[];
  readonly advice: readonly string[];
};

export type SajuTopicInterpretation = {
  readonly summary: string;
  readonly positive: readonly string[];
  readonly risk: readonly string[];
  readonly advice: readonly string[];
};

export type SajuBalanceHints = {
  readonly whenExcessive?: readonly string[];
  readonly whenMissing?: readonly string[];
  readonly usefulWhen?: readonly string[];
};

export type SajuMatchingHints = {
  readonly helpfulElements?: readonly FiveElement[];
  readonly difficultElements?: readonly FiveElement[];
  readonly relationshipStyle?: readonly string[];
};

export type SajuCareerHints = {
  readonly favorableFields?: readonly string[];
  readonly cautionFields?: readonly string[];
  readonly workingStyle?: readonly string[];
};

export type SajuMoneyHints = {
  readonly earningStyle?: readonly string[];
  readonly assetStyle?: readonly string[];
  readonly riskStyle?: readonly string[];
};

export type SajuPatternHints = {
  readonly whenStrong: readonly string[];
  readonly personalityResult: readonly string[];
  readonly moneyCareerResult: readonly string[];
  readonly relationshipResult: readonly string[];
  readonly risk: readonly string[];
  readonly advice: readonly string[];
};

export type SajuDayPillarHints = {
  readonly coreTension: readonly string[];
  readonly strength: readonly string[];
  readonly risk: readonly string[];
  readonly loveHint: readonly string[];
  readonly careerHint: readonly string[];
  readonly moneyHint: readonly string[];
  readonly relationshipHint: readonly string[];
};

export type SajuKnowledgeEntry = {
  readonly id: string;
  readonly category: SajuKnowledgeCategory;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly coreImageKo?: string;
  readonly summary: string;
  readonly meaning: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly topicWeights: Partial<Record<SajuKnowledgeTopic, number>>;
  readonly mbtiBridgeTags: readonly InterpretationTagId[];
  readonly topicInterpretations?: Partial<
    Record<SajuKnowledgeTopic, SajuTopicInterpretation>
  >;
  readonly balanceHints?: SajuBalanceHints;
  readonly matchingHints?: SajuMatchingHints;
  readonly careerHints?: SajuCareerHints;
  readonly moneyHints?: SajuMoneyHints;
  readonly patternHints?: SajuPatternHints;
  readonly dayPillarHints?: SajuDayPillarHints;
  readonly phraseSeeds: KnowledgePhraseSeeds;
};

export const SAJU_KNOWLEDGE_TOPICS = [
  "personality",
  "strengths",
  "weaknesses",
  "work_career",
  "money_asset",
  "love_relationship",
  "human_relations",
  "family_independence",
  "study_growth",
  "environment_luck",
  "final_advice",
] as const satisfies readonly SajuKnowledgeTopic[];
