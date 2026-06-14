export type SajuFeatureCategory =
  | "day_master"
  | "day_pillar"
  | "element"
  | "ten_god"
  | "twelve_life_stage"
  | "twelve_sinsal"
  | "sinsal"
  | "gwiin"
  | "relation"
  | "structure";

export type SajuFeatureTopic =
  | "identity"
  | "personality"
  | "work"
  | "money"
  | "love"
  | "relationship"
  | "family"
  | "study"
  | "environment"
  | "growth";

export type SajuFeaturePolarity = "positive" | "warning" | "mixed";

export type MbtiBridgeNeed =
  | "emotional_buffer"
  | "warmth"
  | "stability"
  | "autonomy_respect"
  | "intellectual_match"
  | "pace_flexibility"
  | "responsibility_clarity"
  | "expression_support";

export type SajuFeatureEntry = {
  readonly id: string;
  readonly category: SajuFeatureCategory;
  readonly labelKo: string;
  readonly hanja?: string;
  readonly aliases: readonly string[];
  readonly polarity: SajuFeaturePolarity;
  readonly topics: readonly SajuFeatureTopic[];
  readonly baseWeight: number;
  readonly vividness: number;
  readonly summary: string;
  readonly symbolicImage: string;
  readonly positiveReading: string;
  readonly cautionReading: string;
  readonly practicalUse: string;
  readonly sceneSeeds: readonly string[];
  readonly phraseSeeds: readonly string[];
  readonly avoidClaims: readonly string[];
  readonly mbtiBridgeNeeds?: readonly MbtiBridgeNeed[];
};

export type SajuFeatureScoreStrength =
  | "low"
  | "medium"
  | "high"
  | "very_high";

export type SajuFeatureScore = {
  readonly featureId: string;
  readonly category: SajuFeatureCategory;
  readonly score: number;
  readonly strength: SajuFeatureScoreStrength;
  readonly polarity: SajuFeaturePolarity;
  readonly topics: readonly SajuFeatureTopic[];
  readonly reasons: readonly string[];
};

export type SajuFeatureChapterId =
  | "opening"
  | "saju_identity"
  | "personality_pattern"
  | "work_money_study"
  | "love_relationships"
  | "people_family_environment"
  | "risk_and_growth"
  | "final_message";
