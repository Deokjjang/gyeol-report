import {
  requireSajuFeatureEntry,
  SAJU_FEATURE_TAXONOMY,
} from "./sajuFeatureTaxonomy";
import type {
  SajuFeatureCategory,
  SajuFeatureEntry,
  SajuFeatureScore,
  SajuFeatureScoreStrength,
  SajuFeatureTopic,
} from "./sajuFeatureTypes";

const CATEGORY_WEIGHTS: Record<SajuFeatureCategory, number> = {
  day_master: 0.35,
  day_pillar: 0.45,
  element: 0.3,
  ten_god: 0.35,
  twelve_life_stage: 0.2,
  twelve_sinsal: 0.55,
  sinsal: 0.55,
  gwiin: 0.6,
  relation: 0.25,
  structure: 0.5,
};

const TOPIC_MATCH_WEIGHT = 0.85;
const PREFERRED_CATEGORY_WEIGHT = 0.45;
const VIVIDNESS_WEIGHT = 0.22;
const DUPLICATE_CATEGORY_PENALTY = 0.38;

function getPolarityWeight(entry: SajuFeatureEntry): number {
  if (entry.polarity === "mixed") {
    return 0.32;
  }

  if (entry.polarity === "positive") {
    return 0.2;
  }

  return 0.08;
}

function getStrength(score: number): SajuFeatureScoreStrength {
  if (score >= 6) {
    return "very_high";
  }

  if (score >= 5) {
    return "high";
  }

  if (score >= 4) {
    return "medium";
  }

  return "low";
}

export type ScoreSajuFeaturesInput = {
  readonly featureIds?: readonly string[];
  readonly topic?: SajuFeatureTopic;
  readonly preferredCategories?: readonly SajuFeatureCategory[];
};

function scoreEntry(input: {
  readonly entry: SajuFeatureEntry;
  readonly topic?: SajuFeatureTopic;
  readonly preferredCategories: readonly SajuFeatureCategory[];
  readonly duplicateCategoryIndex: number;
}): SajuFeatureScore {
  const reasons: string[] = [`base:${input.entry.baseWeight}`];
  let score = input.entry.baseWeight;

  const categoryWeight = CATEGORY_WEIGHTS[input.entry.category];
  score += categoryWeight;
  reasons.push(`category:${input.entry.category}`);

  if (input.topic !== undefined && input.entry.topics.includes(input.topic)) {
    score += TOPIC_MATCH_WEIGHT;
    reasons.push(`topic:${input.topic}`);
  }

  if (input.preferredCategories.includes(input.entry.category)) {
    score += PREFERRED_CATEGORY_WEIGHT;
    reasons.push(`preferred_category:${input.entry.category}`);
  }

  const vividnessBonus = input.entry.vividness * VIVIDNESS_WEIGHT;
  score += vividnessBonus;
  reasons.push(`vividness:${input.entry.vividness}`);

  const polarityWeight = getPolarityWeight(input.entry);
  score += polarityWeight;
  reasons.push(`polarity:${input.entry.polarity}`);

  if (input.duplicateCategoryIndex > 0) {
    const penalty = input.duplicateCategoryIndex * DUPLICATE_CATEGORY_PENALTY;
    score -= penalty;
    reasons.push(`duplicate category penalty:${penalty.toFixed(2)}`);
  }

  const normalizedScore = Number(score.toFixed(4));

  return {
    featureId: input.entry.id,
    category: input.entry.category,
    score: normalizedScore,
    strength: getStrength(normalizedScore),
    polarity: input.entry.polarity,
    topics: input.entry.topics,
    reasons,
  };
}

export function scoreSajuFeatures(
  input: ScoreSajuFeaturesInput = {},
): readonly SajuFeatureScore[] {
  const featureIds =
    input.featureIds ?? SAJU_FEATURE_TAXONOMY.map((entry) => entry.id);
  const categoryCounts = new Map<SajuFeatureCategory, number>();
  const preferredCategories = input.preferredCategories ?? [];

  return featureIds
    .map((featureId) => {
      const entry = requireSajuFeatureEntry(featureId);
      const duplicateCategoryIndex = categoryCounts.get(entry.category) ?? 0;
      categoryCounts.set(entry.category, duplicateCategoryIndex + 1);

      return scoreEntry({
        entry,
        topic: input.topic,
        preferredCategories,
        duplicateCategoryIndex,
      });
    })
    .sort((a, b) => b.score - a.score || a.featureId.localeCompare(b.featureId));
}
