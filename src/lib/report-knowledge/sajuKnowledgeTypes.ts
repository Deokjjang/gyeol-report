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

export type SajuKnowledgeEntry = {
  readonly id: string;
  readonly category: SajuKnowledgeCategory;
  readonly labelKo: string;
  readonly aliases: readonly string[];
  readonly summary: string;
  readonly meaning: string;
  readonly positiveTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly topicWeights: Partial<Record<SajuKnowledgeTopic, number>>;
  readonly mbtiBridgeTags: readonly InterpretationTagId[];
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
