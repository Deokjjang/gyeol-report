import { getSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import type {
  SajuFeatureCategory,
  SajuFeatureChapterId,
  SajuFeatureScore,
  SajuFeatureTopic,
} from "./sajuFeatureTypes";

export type SajuChapterFeatureSelection = {
  readonly chapterId: SajuFeatureChapterId;
  readonly positive: readonly SajuFeatureScore[];
  readonly warningOrMixed: readonly SajuFeatureScore[];
  readonly vivid: SajuFeatureScore | null;
  readonly practical: SajuFeatureScore | null;
  readonly selected: readonly SajuFeatureScore[];
};

type ChapterFeatureConfig = {
  readonly topics: readonly SajuFeatureTopic[];
  readonly categories: readonly SajuFeatureCategory[];
  readonly positiveLimit: number;
  readonly warningOrMixedLimit: number;
};

const CHAPTER_FEATURE_CONFIG: Record<SajuFeatureChapterId, ChapterFeatureConfig> = {
  opening: {
    topics: ["identity", "personality", "work", "growth"],
    categories: [
      "day_master",
      "day_pillar",
      "element",
      "ten_god",
      "sinsal",
      "twelve_sinsal",
      "gwiin",
      "structure",
    ],
    positiveLimit: 3,
    warningOrMixedLimit: 3,
  },
  saju_identity: {
    topics: ["identity", "personality", "growth"],
    categories: [
      "day_master",
      "day_pillar",
      "element",
      "structure",
      "gwiin",
      "sinsal",
      "twelve_sinsal",
    ],
    positiveLimit: 4,
    warningOrMixedLimit: 4,
  },
  personality_pattern: {
    topics: ["personality", "relationship", "growth"],
    categories: ["day_master", "day_pillar", "element", "sinsal", "ten_god"],
    positiveLimit: 4,
    warningOrMixedLimit: 4,
  },
  work_money_study: {
    topics: ["work", "money", "study", "growth"],
    categories: ["ten_god", "gwiin", "twelve_sinsal", "structure", "element"],
    positiveLimit: 4,
    warningOrMixedLimit: 4,
  },
  love_relationships: {
    topics: ["love", "relationship", "growth"],
    categories: ["sinsal", "element", "ten_god", "relation", "gwiin"],
    positiveLimit: 4,
    warningOrMixedLimit: 5,
  },
  people_family_environment: {
    topics: ["relationship", "family", "environment", "growth"],
    categories: ["ten_god", "relation", "twelve_sinsal", "structure", "gwiin"],
    positiveLimit: 4,
    warningOrMixedLimit: 4,
  },
  risk_and_growth: {
    topics: ["growth", "relationship", "work"],
    categories: ["element", "sinsal", "structure", "twelve_sinsal"],
    positiveLimit: 3,
    warningOrMixedLimit: 6,
  },
  final_message: {
    topics: ["identity", "growth", "work", "relationship", "money"],
    categories: [
      "day_master",
      "day_pillar",
      "element",
      "ten_god",
      "sinsal",
      "twelve_sinsal",
      "gwiin",
      "structure",
    ],
    positiveLimit: 4,
    warningOrMixedLimit: 4,
  },
};

function scoreMatchesConfig(
  score: SajuFeatureScore,
  config: ChapterFeatureConfig,
): boolean {
  return (
    config.categories.includes(score.category) ||
    score.topics.some((topic) => config.topics.includes(topic))
  );
}

function sortScores(scores: readonly SajuFeatureScore[]): readonly SajuFeatureScore[] {
  return [...scores].sort(
    (a, b) => b.score - a.score || a.featureId.localeCompare(b.featureId),
  );
}

function chooseVivid(
  scores: readonly SajuFeatureScore[],
): SajuFeatureScore | null {
  const vividScores = scores
    .map((score) => ({
      score,
      entry: getSajuFeatureEntry(score.featureId),
    }))
    .filter((item) => item.entry !== undefined)
    .sort((a, b) => {
      const vividnessDiff = (b.entry?.vividness ?? 0) - (a.entry?.vividness ?? 0);

      return vividnessDiff || b.score.score - a.score.score;
    });

  return vividScores[0]?.score ?? null;
}

function choosePractical(
  scores: readonly SajuFeatureScore[],
): SajuFeatureScore | null {
  const practicalScores = scores
    .map((score) => ({
      score,
      entry: getSajuFeatureEntry(score.featureId),
    }))
    .filter(
      (item) =>
        item.entry !== undefined && item.entry.practicalUse.trim().length > 0,
    )
    .sort((a, b) => b.score.score - a.score.score);

  return practicalScores[0]?.score ?? null;
}

function appendUnique(
  target: SajuFeatureScore[],
  candidate: SajuFeatureScore | null,
): void {
  if (
    candidate !== null &&
    !target.some((score) => score.featureId === candidate.featureId)
  ) {
    target.push(candidate);
  }
}

export function selectSajuFeaturesForChapter(
  scores: readonly SajuFeatureScore[],
  chapterId: SajuFeatureChapterId,
): SajuChapterFeatureSelection {
  const config = CHAPTER_FEATURE_CONFIG[chapterId];
  const candidates = sortScores(
    scores.filter((score) => scoreMatchesConfig(score, config)),
  );
  const positive = candidates
    .filter((score) => score.polarity === "positive")
    .slice(0, config.positiveLimit);
  const warningOrMixed = candidates
    .filter((score) => score.polarity === "warning" || score.polarity === "mixed")
    .slice(0, config.warningOrMixedLimit);
  const vivid = chooseVivid(candidates);
  const practical = choosePractical(candidates);
  const selected = [...positive, ...warningOrMixed];

  appendUnique(selected, vivid);
  appendUnique(selected, practical);

  return {
    chapterId,
    positive,
    warningOrMixed,
    vivid,
    practical,
    selected,
  };
}
