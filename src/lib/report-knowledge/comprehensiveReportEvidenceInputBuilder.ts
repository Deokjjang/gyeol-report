import { buildComprehensiveReportEvidencePacket } from "./comprehensiveReportEvidenceBuilder";
import type {
  ComprehensiveReportEvidencePacket,
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "./comprehensiveReportEvidenceTypes";
import type { MbtiType } from "./mbtiKnowledgeTypes";
import { scoreSajuFeatures } from "./sajuFeatureScoring";
import { selectSajuFeaturesForChapter } from "./sajuFeatureSelector";
import { requireSajuFeatureEntry } from "./sajuFeatureTaxonomy";
import type {
  SajuFeatureCategory,
  SajuFeatureEntry,
  SajuFeatureChapterId,
  SajuFeatureScore,
  SajuFeatureTopic,
} from "./sajuFeatureTypes";
import {
  mapComputedSajuFactsToKnowledgeEntryIds,
  mapComputedSajuFactsToFeatureIds,
  type MappedSajuKnowledgeInput,
} from "./sajuComputedFactsMapper";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";

const v2FeatureChapterIds = [
  "opening",
  "saju_identity",
  "personality_pattern",
  "work_money_study",
  "love_relationships",
  "people_family_environment",
  "risk_and_growth",
  "final_message",
] as const satisfies readonly SajuFeatureChapterId[];

const featureLimitByChapter = {
  opening: 4,
  saju_identity: 6,
  personality_pattern: 6,
  work_money_study: 6,
  love_relationships: 6,
  people_family_environment: 6,
  risk_and_growth: 6,
  final_message: 5,
} as const satisfies Record<SajuFeatureChapterId, number>;

const scoreTopicByChapter = {
  opening: "identity",
  saju_identity: "identity",
  personality_pattern: "personality",
  work_money_study: "money",
  love_relationships: "love",
  people_family_environment: "relationship",
  risk_and_growth: "growth",
  final_message: "growth",
} as const satisfies Record<SajuFeatureChapterId, SajuFeatureTopic>;

type MutableChapterFeatureEvidence = {
  readonly chapterId: SajuFeatureChapterId;
  readonly selected: SajuFeatureScore[];
};

function appendUniqueScore(
  target: SajuFeatureScore[],
  score: SajuFeatureScore | undefined,
): void {
  if (
    score !== undefined &&
    !target.some((item) => item.featureId === score.featureId)
  ) {
    target.push(score);
  }
}

function getLimitedChapterScores(input: {
  readonly chapterId: SajuFeatureChapterId;
  readonly selected: readonly SajuFeatureScore[];
}): readonly SajuFeatureScore[] {
  const limit = featureLimitByChapter[input.chapterId];

  if (input.selected.length <= limit) {
    return input.selected;
  }

  const selected: SajuFeatureScore[] = [];
  const positive = input.selected.find((score) => score.polarity === "positive");
  const warningOrMixed = input.selected.find(
    (score) => score.polarity === "warning" || score.polarity === "mixed",
  );

  appendUniqueScore(selected, positive);
  appendUniqueScore(selected, warningOrMixed);

  for (const score of [...input.selected].sort((left, right) => right.score - left.score)) {
    appendUniqueScore(selected, score);
    if (selected.length >= limit) {
      break;
    }
  }

  return selected;
}

function appendUniqueChapter(
  target: SajuFeatureChapterId[],
  chapterId: SajuFeatureChapterId,
): void {
  if (!target.includes(chapterId)) {
    target.push(chapterId);
  }
}

function getCandidateChapterIdsForFeature(
  entry: SajuFeatureEntry,
): readonly SajuFeatureChapterId[] {
  const chapterIds: SajuFeatureChapterId[] = [];

  if (entry.category === "day_master" || entry.category === "day_pillar") {
    appendUniqueChapter(chapterIds, "saju_identity");
    appendUniqueChapter(chapterIds, "opening");
    appendUniqueChapter(chapterIds, "personality_pattern");
    appendUniqueChapter(chapterIds, "final_message");
  }

  if (entry.category === "element") {
    appendUniqueChapter(chapterIds, "risk_and_growth");
    appendUniqueChapter(chapterIds, "love_relationships");
    appendUniqueChapter(chapterIds, "personality_pattern");
    appendUniqueChapter(chapterIds, "final_message");
  }

  if (entry.category === "ten_god") {
    appendUniqueChapter(chapterIds, "work_money_study");
    appendUniqueChapter(chapterIds, "people_family_environment");
    appendUniqueChapter(chapterIds, "love_relationships");
    appendUniqueChapter(chapterIds, "final_message");
  }

  if (entry.category === "gwiin") {
    appendUniqueChapter(chapterIds, "work_money_study");
    appendUniqueChapter(chapterIds, "saju_identity");
    appendUniqueChapter(chapterIds, "people_family_environment");
    appendUniqueChapter(chapterIds, "final_message");
  }

  if (entry.category === "sinsal" || entry.category === "twelve_sinsal") {
    appendUniqueChapter(chapterIds, "love_relationships");
    appendUniqueChapter(chapterIds, "personality_pattern");
    appendUniqueChapter(chapterIds, "risk_and_growth");
    appendUniqueChapter(chapterIds, "final_message");
  }

  if (entry.category === "structure") {
    appendUniqueChapter(chapterIds, "risk_and_growth");
    appendUniqueChapter(chapterIds, "work_money_study");
    appendUniqueChapter(chapterIds, "people_family_environment");
    appendUniqueChapter(chapterIds, "final_message");
  }

  for (const topic of entry.topics) {
    if (topic === "identity") {
      appendUniqueChapter(chapterIds, "saju_identity");
      appendUniqueChapter(chapterIds, "opening");
    }

    if (topic === "personality") {
      appendUniqueChapter(chapterIds, "personality_pattern");
    }

    if (topic === "work" || topic === "money" || topic === "study") {
      appendUniqueChapter(chapterIds, "work_money_study");
    }

    if (topic === "love") {
      appendUniqueChapter(chapterIds, "love_relationships");
    }

    if (topic === "relationship") {
      appendUniqueChapter(chapterIds, "love_relationships");
      appendUniqueChapter(chapterIds, "people_family_environment");
    }

    if (topic === "family" || topic === "environment") {
      appendUniqueChapter(chapterIds, "people_family_environment");
    }

    if (topic === "growth") {
      appendUniqueChapter(chapterIds, "risk_and_growth");
      appendUniqueChapter(chapterIds, "final_message");
    }
  }

  for (const chapterId of v2FeatureChapterIds) {
    appendUniqueChapter(chapterIds, chapterId);
  }

  return chapterIds;
}

function countFeatureOccurrences(
  chapters: readonly MutableChapterFeatureEvidence[],
  featureId: string,
): number {
  return chapters.reduce(
    (count, chapter) =>
      count + chapter.selected.filter((score) => score.featureId === featureId).length,
    0,
  );
}

function canRemoveScoreFromChapter(input: {
  readonly chapters: readonly MutableChapterFeatureEvidence[];
  readonly chapter: MutableChapterFeatureEvidence;
  readonly index: number;
}): boolean {
  const candidate = input.chapter.selected[input.index];

  if (candidate === undefined) {
    return false;
  }

  if (countFeatureOccurrences(input.chapters, candidate.featureId) <= 1) {
    return false;
  }

  if (input.chapter.chapterId !== "final_message") {
    return true;
  }

  const remaining = input.chapter.selected.filter((_, index) => index !== input.index);
  const hasPositive = remaining.some((score) => score.polarity === "positive");
  const hasWarningOrMixed = remaining.some(
    (score) => score.polarity === "warning" || score.polarity === "mixed",
  );

  return hasPositive && hasWarningOrMixed;
}

function getChapterScore(input: {
  readonly featureId: string;
  readonly chapterId: SajuFeatureChapterId;
}): SajuFeatureScore | undefined {
  return scoreSajuFeatures({
    featureIds: [input.featureId],
    topic: scoreTopicByChapter[input.chapterId],
  })[0];
}

function insertScoreIntoChapter(input: {
  readonly chapters: readonly MutableChapterFeatureEvidence[];
  readonly chapterId: SajuFeatureChapterId;
  readonly score: SajuFeatureScore;
  readonly protectedCategories?: readonly SajuFeatureCategory[];
}): boolean {
  const chapter = input.chapters.find((item) => item.chapterId === input.chapterId);

  if (chapter === undefined) {
    return false;
  }

  if (chapter.selected.some((score) => score.featureId === input.score.featureId)) {
    return true;
  }

  if (chapter.selected.length < featureLimitByChapter[chapter.chapterId]) {
    chapter.selected.push(input.score);
    chapter.selected.sort((left, right) => right.score - left.score);
    return true;
  }

  const replacement = chapter.selected
    .map((score, index) => ({ score, index }))
    .filter((item) =>
      !(input.protectedCategories ?? []).includes(item.score.category) &&
      canRemoveScoreFromChapter({
        chapters: input.chapters,
        chapter,
        index: item.index,
      }),
    )
    .sort(
      (left, right) =>
        left.score.score - right.score.score ||
        left.score.featureId.localeCompare(right.score.featureId),
    )[0];

  if (replacement === undefined) {
    return false;
  }

  chapter.selected[replacement.index] = input.score;
  chapter.selected.sort((left, right) => right.score - left.score);
  return true;
}

function ensureMappedFeaturesRepresented(input: {
  readonly chapters: readonly MutableChapterFeatureEvidence[];
  readonly featureIds: readonly string[];
}): readonly MutableChapterFeatureEvidence[] {
  for (const featureId of input.featureIds) {
    if (countFeatureOccurrences(input.chapters, featureId) > 0) {
      continue;
    }

    const entry = requireSajuFeatureEntry(featureId);
    const candidateChapterIds = getCandidateChapterIdsForFeature(entry);

    for (const chapterId of candidateChapterIds) {
      const score = getChapterScore({ featureId, chapterId });

      if (
        score !== undefined &&
        insertScoreIntoChapter({
          chapters: input.chapters,
          chapterId,
          score,
        })
      ) {
        break;
      }
    }
  }

  return input.chapters;
}

function ensureChapterFeaturesByCategory(input: {
  readonly chapters: readonly MutableChapterFeatureEvidence[];
  readonly featureIds: readonly string[];
  readonly chapterId: SajuFeatureChapterId;
  readonly category: SajuFeatureCategory;
  readonly limit: number;
  readonly protectedCategories?: readonly SajuFeatureCategory[];
}): void {
  const candidateFeatureIds = input.featureIds.filter(
    (featureId) => requireSajuFeatureEntry(featureId).category === input.category,
  );
  const scores = scoreSajuFeatures({
    featureIds: candidateFeatureIds,
    topic: scoreTopicByChapter[input.chapterId],
    preferredCategories: [input.category],
  });

  for (const score of scores.slice(0, input.limit)) {
    insertScoreIntoChapter({
      chapters: input.chapters,
      chapterId: input.chapterId,
      score,
      protectedCategories: input.protectedCategories,
    });
  }
}

function ensureChapterPriorityCoverage(input: {
  readonly chapters: readonly MutableChapterFeatureEvidence[];
  readonly featureIds: readonly string[];
}): readonly MutableChapterFeatureEvidence[] {
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "saju_identity",
    category: "day_pillar",
    limit: 1,
  });
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "work_money_study",
    category: "ten_god",
    limit: 4,
  });
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "work_money_study",
    category: "gwiin",
    limit: 1,
  });
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "love_relationships",
    category: "sinsal",
    limit: 2,
  });
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "risk_and_growth",
    category: "structure",
    limit: 3,
  });
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "risk_and_growth",
    category: "element",
    limit: 3,
  });
  ensureChapterFeaturesByCategory({
    ...input,
    chapterId: "risk_and_growth",
    category: "structure",
    limit: 1,
    protectedCategories: ["element"],
  });

  return input.chapters;
}

function toSelectedFeatureEvidenceItem(
  score: SajuFeatureScore,
): SelectedSajuFeatureEvidenceItem {
  const entry = requireSajuFeatureEntry(score.featureId);

  return {
    id: entry.id,
    labelKo: entry.labelKo,
    category: entry.category,
    polarity: entry.polarity,
    strength: score.strength,
    score: score.score,
    topics: entry.topics,
    summary: entry.summary,
    symbolicImage: entry.symbolicImage,
    positiveReading: entry.positiveReading,
    cautionReading: entry.cautionReading,
    practicalUse: entry.practicalUse,
    sceneSeeds: entry.sceneSeeds.slice(0, 3),
    phraseSeeds: entry.phraseSeeds.slice(0, 3),
    ...(entry.mbtiBridgeNeeds === undefined
      ? {}
      : { mbtiBridgeNeeds: entry.mbtiBridgeNeeds }),
  };
}

function buildSelectedSajuFeatureEvidence(
  featureIds: readonly string[],
): readonly SelectedSajuFeatureEvidence[] {
  if (featureIds.length === 0) {
    return [];
  }

  const chapters = v2FeatureChapterIds.map((chapterId) => {
    const scores = scoreSajuFeatures({
      featureIds,
      topic: scoreTopicByChapter[chapterId],
    });
    const selection = selectSajuFeaturesForChapter(scores, chapterId);
    const limitedScores = getLimitedChapterScores({
      chapterId,
      selected: selection.selected,
    });

    return {
      chapterId,
      selected: [...limitedScores],
    };
  });

  return ensureChapterPriorityCoverage({
    chapters: ensureMappedFeaturesRepresented({ chapters, featureIds }),
    featureIds,
  }).map((chapter) => ({
    chapterId: chapter.chapterId,
    features: chapter.selected.map(toSelectedFeatureEvidenceItem),
  }));
}

export function buildComprehensiveReportEvidencePacketFromComputedFacts(input: {
  readonly mbtiType: MbtiType;
  readonly sajuFacts: ComputedSajuFacts;
}): {
  readonly packet: ComprehensiveReportEvidencePacket;
  readonly mappedSaju: MappedSajuKnowledgeInput;
  readonly mappedFeatures: ReturnType<typeof mapComputedSajuFactsToFeatureIds>;
} {
  const mappedSaju = mapComputedSajuFactsToKnowledgeEntryIds(input.sajuFacts);
  const mappedFeatures = mapComputedSajuFactsToFeatureIds(input.sajuFacts);
  const packet = buildComprehensiveReportEvidencePacket({
    mbtiType: input.mbtiType,
    sajuEntryIds: mappedSaju.sajuEntryIds,
  });
  const selectedSajuFeatureEvidence = buildSelectedSajuFeatureEvidence(
    mappedFeatures.featureIds,
  );

  return {
    packet: {
      ...packet,
      selectedSajuFeatureEvidence,
      globalWarnings: [
        ...packet.globalWarnings,
        ...mappedSaju.warnings,
        ...mappedFeatures.warnings,
      ],
    },
    mappedSaju,
    mappedFeatures,
  };
}
