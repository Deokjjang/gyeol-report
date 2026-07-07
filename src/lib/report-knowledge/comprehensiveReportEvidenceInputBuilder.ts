import { buildComprehensiveReportEvidencePacket } from "./comprehensiveReportEvidenceBuilder";
import type {
  ComprehensiveMbtiBasis,
  ComprehensiveReportEvidencePacket,
  ComprehensiveSajuFeatureDictionaryEntry,
  ComprehensiveSajuMbtiBridgeInterpretation,
  SelectedSajuFeatureEvidence,
  SelectedSajuFeatureEvidenceItem,
} from "./comprehensiveReportEvidenceTypes";
import type { MbtiKnowledgeContext, MbtiType } from "./mbtiKnowledgeTypes";
import { scoreSajuFeatures } from "./sajuFeatureScoring";
import { selectSajuFeaturesForChapter } from "./sajuFeatureSelector";
import { shouldShowFeatureInNarrative } from "./sajuFeatureDisplayPolicy";
import { buildSajuFeatureSpotlight } from "./sajuFeatureSpotlight";
import {
  buildSajuPillarFeaturePlacements,
  buildSajuPillarGridColumns,
} from "./sajuPillarFeaturePlacement";
import { selectSajuSignatureScenes } from "./sajuSignatureSceneRules";
import { buildReportDifferentiationModules } from "./reportDifferentiationModules";
import { buildSajuSymbolicNickname } from "./sajuSymbolicNickname";
import {
  selectMbtiKnowledge,
  type SelectedMbtiKnowledge,
} from "./mbtiKnowledgeSelector";
import { scoreSajuMbtiBridgeEvidence } from "./sajuMbtiBridgeScorer";
import type { SajuMbtiBridgeEvidence } from "./sajuMbtiBridgeScorer";
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
import {
  MBTI_TRAIT_AREAS,
  getMbtiMyeongliBridgeHints,
  getMbtiReportUseCase,
  getMbtiSourceProfile,
  type MbtiSourceTraitItem,
} from "./mbti/sourceRuntimeAdapter";

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

const comprehensiveMbtiContexts = [
  "core_identity",
  "communication",
  "work",
  "study",
  "money",
  "love",
  "family",
  "stress",
  "recovery",
  "growth",
] as const;

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
  const narrativeFeatureIds = featureIds.filter(shouldShowFeatureInNarrative);

  if (narrativeFeatureIds.length === 0) {
    return [];
  }

  const chapters = v2FeatureChapterIds.map((chapterId) => {
    const scores = scoreSajuFeatures({
      featureIds: narrativeFeatureIds,
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
    chapters: ensureMappedFeaturesRepresented({
      chapters,
      featureIds: narrativeFeatureIds,
    }),
    featureIds: narrativeFeatureIds,
  }).map((chapter) => ({
    chapterId: chapter.chapterId,
    features: chapter.selected.map(toSelectedFeatureEvidenceItem),
  }));
}

function uniqueStrings(values: readonly string[], limit?: number): readonly string[] {
  const result = [...new Set(values.map((value) => value.trim()).filter(Boolean))];

  return limit === undefined ? result : result.slice(0, limit);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getStringArrayProperty(
  value: unknown,
  key: string,
): readonly string[] {
  if (!isRecord(value)) {
    return [];
  }

  const property = value[key];

  return Array.isArray(property) && property.every((item) => typeof item === "string")
    ? property
    : [];
}

function getStringRecordValues(
  value: unknown,
): readonly string[] {
  if (!isRecord(value)) {
    return [];
  }

  return Object.values(value).filter((item): item is string => typeof item === "string");
}

function getFunctionStackRows(
  functionStack: Readonly<Record<string, string>> | undefined,
): ComprehensiveMbtiBasis["functionStack"] {
  if (functionStack === undefined) {
    return [];
  }

  return Object.entries(functionStack)
    .filter(([, code]) => code.trim().length > 0)
    .map(([position, code]) => ({
      position,
      code,
    }));
}

function toMbtiBasisTrait(
  trait: MbtiSourceTraitItem,
): ComprehensiveMbtiBasis["traitAreas"][number]["traits"][number] | undefined {
  const label = trait.label ?? trait.plainKo;

  if (label === undefined || label.trim().length === 0) {
    return undefined;
  }

  return {
    ...(trait.id === undefined ? {} : { id: trait.id }),
    label,
    ...(trait.plainKo === undefined ? {} : { plainKo: trait.plainKo }),
    ...(trait.strongLine === undefined ? {} : { strongLine: trait.strongLine }),
    ...(trait.positiveUse === undefined ? {} : { positiveUse: trait.positiveUse }),
    ...(trait.risk === undefined ? {} : { risk: trait.risk }),
    matchingMyeongliSignals: trait.matchingMyeongliSignals ?? [],
    productDomains: trait.productDomains ?? [],
  };
}

function buildComprehensiveMbtiBasis(input: {
  readonly mbtiType: MbtiType;
  readonly selectedMbtiKnowledge?: SelectedMbtiKnowledge;
}): ComprehensiveMbtiBasis | undefined {
  const source = getMbtiSourceProfile(input.mbtiType);

  if (source === null) {
    return undefined;
  }

  return {
    type: source.type,
    titleKo: source.titleKo,
    archetype: source.archetype,
    oneLine: source.oneLine,
    coreSummary: uniqueStrings([
      ...getStringRecordValues(source.summary),
      source.oneLine,
    ]),
    closeKeywords: getStringArrayProperty(source, "closeKeywords"),
    farKeywords: getStringArrayProperty(source, "farKeywords"),
    functionStack: getFunctionStackRows(source.functionStack),
    traitAreas: MBTI_TRAIT_AREAS.map((area) => ({
      area,
      traits: (source.traits?.[area] ?? [])
        .map(toMbtiBasisTrait)
        .filter(
          (trait): trait is ComprehensiveMbtiBasis["traitAreas"][number]["traits"][number] =>
            trait !== undefined,
        ),
    })).filter((area) => area.traits.length > 0),
    myeongliBridgeHints: (getMbtiMyeongliBridgeHints(source.type) ?? []).map(
      (hint) => ({
        signal: hint.signal,
        reason: hint.reason,
        relatedTraits: hint.relatedTraits,
        productDomains: hint.productDomains,
      }),
    ),
    reportUseCases: getMbtiReportUseCase(source.type, "generalReport") ?? [],
    selectedTraitSeeds:
      input.selectedMbtiKnowledge?.selectedTraits.map((trait) => ({
        id: trait.id,
        context: trait.context,
        label: trait.label,
        description: trait.description,
        strengths: trait.strengths,
        risks: trait.risks,
        practicalSwitches: trait.practicalSwitches,
        tags: trait.tags,
      })) ?? [],
  };
}

function toSajuFeatureDictionaryEntry(
  feature: SelectedSajuFeatureEvidenceItem,
): ComprehensiveSajuFeatureDictionaryEntry {
  return {
    id: `feature_${feature.id}`,
    rawLabel: feature.labelKo,
    category: feature.category,
    interpretationTitle: feature.symbolicImage,
    description: feature.summary,
    strengths: uniqueStrings([feature.positiveReading, feature.practicalUse]),
    fatiguePoints: uniqueStrings([feature.cautionReading]),
    sceneExamples: feature.sceneSeeds,
    practicalUse: feature.practicalUse,
    sourceFeatureId: feature.id,
  };
}

function buildHiddenStemDictionary(input: {
  readonly sajuFacts: ComputedSajuFacts;
  readonly featureIds: readonly string[];
}): readonly ComprehensiveSajuFeatureDictionaryEntry[] {
  const pillarGrid = buildSajuPillarGridColumns({
    yearPillar: input.sajuFacts.yearPillar,
    monthPillar: input.sajuFacts.monthPillar,
    dayPillar: input.sajuFacts.dayPillar,
    hourPillar: input.sajuFacts.hourPillar,
    dayMaster: input.sajuFacts.dayMaster,
    productionFeatureIds: input.featureIds,
  });

  return pillarGrid.flatMap((column) =>
    (column.hiddenStems ?? []).map((hiddenStem, index) => ({
      id: `hidden_stem_${column.columnId}_${index + 1}`,
      rawLabel: `${column.labelKo} 지장간 ${hiddenStem}`,
      category: "hidden_stem" as const,
      interpretationTitle: "겉 기운 안에 숨어 있는 역할",
      description:
        "지장간은 겉으로 보이는 지지 안쪽에 숨어 있는 욕구, 역할, 회복 포인트를 읽기 위한 보조 근거입니다.",
      strengths: [
        "겉으로 바로 드러나지 않는 재능과 보완 기운을 찾는 데 도움이 됩니다.",
      ],
      fatiguePoints: [
        "겉 행동과 안쪽 욕구가 다르게 움직이면 선택이 늦어지거나 피로가 쌓일 수 있습니다.",
      ],
      sceneExamples: [
        "겉으로는 단순히 버티는 것처럼 보여도 안쪽에서는 다른 역할과 욕구가 동시에 움직이는 장면",
      ],
      practicalUse:
        "겉으로 보이는 간지와 함께 읽어야 하며, 지장간만으로 사건을 단정하지 않습니다.",
      sourcePillar: column.labelKo,
    })),
  );
}

function buildSajuFeatureDictionary(input: {
  readonly selectedSajuFeatureEvidence: readonly SelectedSajuFeatureEvidence[];
  readonly sajuFacts: ComputedSajuFacts;
  readonly featureIds: readonly string[];
}): readonly ComprehensiveSajuFeatureDictionaryEntry[] {
  const featureEntries = input.selectedSajuFeatureEvidence
    .flatMap((chapter) => chapter.features)
    .map(toSajuFeatureDictionaryEntry);
  const hiddenStemEntries = buildHiddenStemDictionary({
    sajuFacts: input.sajuFacts,
    featureIds: input.featureIds,
  });
  const entriesById = new Map<string, ComprehensiveSajuFeatureDictionaryEntry>();

  for (const entry of [...featureEntries, ...hiddenStemEntries]) {
    if (!entriesById.has(entry.id)) {
      entriesById.set(entry.id, entry);
    }
  }

  return [...entriesById.values()];
}

function buildInterpretedBridgeEvidence(input: {
  readonly bridgeEvidence: readonly SajuMbtiBridgeEvidence[];
  readonly selectedMbtiKnowledge?: SelectedMbtiKnowledge;
  readonly dictionary: readonly ComprehensiveSajuFeatureDictionaryEntry[];
}): readonly ComprehensiveSajuMbtiBridgeInterpretation[] {
  const traitsById = new Map(
    input.selectedMbtiKnowledge?.selectedTraits.map((trait) => [trait.id, trait]) ?? [],
  );
  const dictionaryByFeatureId = new Map(
    input.dictionary
      .filter((entry) => entry.sourceFeatureId !== undefined)
      .map((entry) => [entry.sourceFeatureId as string, entry]),
  );

  return input.bridgeEvidence.map((bridge) => {
    const trait = traitsById.get(bridge.traitId);
    const relatedSignals = bridge.relatedSajuFeatureIds.flatMap((featureId) => {
      const dictionaryEntry = dictionaryByFeatureId.get(featureId);

      return dictionaryEntry === undefined ? [] : [dictionaryEntry.rawLabel];
    });
    const traitTopic: MbtiKnowledgeContext = trait?.context ?? "core_identity";
    const fatiguePoint =
      trait?.risks[0] ??
      "명리 신호와 행동 성향이 과열되면 속도, 말투, 책임 범위에서 피로가 커질 수 있습니다.";

    return {
      chapterId: bridge.chapterId,
      mbti: bridge.mbti,
      traitId: bridge.traitId,
      mbtiTraitTopic: traitTopic,
      myeongliSignalIds: bridge.relatedSajuFeatureIds,
      myeongliSignalLabels: relatedSignals,
      interpretation: `${uniqueStrings(relatedSignals).join(" · ")} 신호는 ${
        trait?.label ?? "선택된 MBTI trait"
      } 성향과 만나 ${bridge.sentenceSeed}`,
      fatiguePoint,
      practicalUse: bridge.practicalSwitch,
      sceneSeed: bridge.sceneSeed,
      bridgeNeed: bridge.bridgeNeed,
      score: bridge.score,
    };
  });
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
  const sajuPillarFeaturePlacements = buildSajuPillarFeaturePlacements({
    yearPillar: input.sajuFacts.yearPillar,
    monthPillar: input.sajuFacts.monthPillar,
    dayPillar: input.sajuFacts.dayPillar,
    hourPillar: input.sajuFacts.hourPillar,
    dayMaster: input.sajuFacts.dayMaster,
    productionFeatureIds: mappedFeatures.featureIds,
  });
  const sajuFeatureSpotlight = buildSajuFeatureSpotlight({
    selectedEvidence: selectedSajuFeatureEvidence,
  });
  const sajuSignatureScenes = selectSajuSignatureScenes({
    featureIds: mappedFeatures.featureIds,
    mbtiType: input.mbtiType,
    limit: 8,
  });
  const reportDifferentiationModules = buildReportDifferentiationModules({
    selectedSajuFeatureEvidence,
    sajuFeatureSpotlight,
    sajuSignatureScenes,
    mbtiType: input.mbtiType,
  });
  const sajuSymbolicNickname = buildSajuSymbolicNickname(input.sajuFacts);
  const selectedMbtiKnowledge = selectMbtiKnowledge({
    mbti: input.mbtiType,
    contexts: comprehensiveMbtiContexts,
    productType: "comprehensive",
    maxTraitsPerContext: 2,
  });
  const sajuMbtiBridgeEvidence = scoreSajuMbtiBridgeEvidence({
    selectedMbtiKnowledge,
    selectedSajuFeatureEvidence,
    computedFeatureIds: mappedFeatures.featureIds,
    productType: "comprehensive",
    limit: 8,
  });
  const mbtiBasis = buildComprehensiveMbtiBasis({
    mbtiType: input.mbtiType,
    selectedMbtiKnowledge,
  });
  const sajuFeatureDictionary = buildSajuFeatureDictionary({
    selectedSajuFeatureEvidence,
    sajuFacts: input.sajuFacts,
    featureIds: mappedFeatures.featureIds,
  });
  const interpretedSajuMbtiBridgeEvidence = buildInterpretedBridgeEvidence({
    bridgeEvidence: sajuMbtiBridgeEvidence,
    selectedMbtiKnowledge,
    dictionary: sajuFeatureDictionary,
  });

  return {
    packet: {
      ...packet,
      productKey: "saju_mbti_full",
      productSlug: "saju-mbti-full",
      productType: "saju_mbti_full",
      ...(mbtiBasis === undefined ? {} : { mbtiBasis }),
      ...(sajuFeatureDictionary.length === 0 ? {} : { sajuFeatureDictionary }),
      selectedSajuFeatureEvidence,
      ...(sajuPillarFeaturePlacements.length === 0
        ? {}
        : { sajuPillarFeaturePlacements }),
      ...(sajuFeatureSpotlight === undefined ? {} : { sajuFeatureSpotlight }),
      ...(sajuSignatureScenes.length === 0 ? {} : { sajuSignatureScenes }),
      ...(reportDifferentiationModules.length === 0
        ? {}
        : { reportDifferentiationModules }),
      ...(sajuSymbolicNickname === undefined ? {} : { sajuSymbolicNickname }),
      ...(selectedMbtiKnowledge === undefined ? {} : { selectedMbtiKnowledge }),
      ...(sajuMbtiBridgeEvidence.length === 0
        ? {}
        : { sajuMbtiBridgeEvidence }),
      ...(interpretedSajuMbtiBridgeEvidence.length === 0
        ? {}
        : { interpretedSajuMbtiBridgeEvidence }),
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
