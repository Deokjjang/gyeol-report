import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionId,
} from "./reportSectionSchema";
import type { InterpretationTagId } from "./interpretationTags";
import { FUSION_KNOWLEDGE_BASE } from "./fusionKnowledgeBase";
import type { FusionKnowledgeRule } from "./fusionKnowledgeTypes";
import { MBTI_KNOWLEDGE_BASE, MBTI_KNOWLEDGE_BY_TYPE } from "./mbtiKnowledgeBase";
import { scoreMbtiEvidenceForTopic } from "./mbtiEvidenceScoring";
import type { MbtiKnowledgeEntry, MbtiType } from "./mbtiKnowledgeTypes";
import { scoreSajuEvidenceForTopic } from "./sajuEvidenceScoring";
import { SAJU_KNOWLEDGE_BASE, SAJU_KNOWLEDGE_BY_ID } from "./sajuKnowledgeBase";
import type { SajuKnowledgeEntry, SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

type BuildSectionEvidenceInput = {
  readonly sectionId: ComprehensiveReportSectionId;
  readonly sajuEntryIds: readonly string[];
  readonly mbtiType: MbtiType;
};

export type SectionEvidence = {
  readonly sectionId: ComprehensiveReportSectionId;
  readonly sajuEvidence: readonly SajuKnowledgeEntry[];
  readonly mbtiEvidence: MbtiKnowledgeEntry;
  readonly mbtiTopicEvidence?: MbtiTopicEvidence;
  readonly fusionRules: readonly FusionKnowledgeRule[];
};

export type MbtiTopicEvidence = {
  readonly mbtiType: MbtiType;
  readonly topic: SajuKnowledgeTopic;
  readonly summary: string;
  readonly positive: readonly string[];
  readonly risk: readonly string[];
  readonly advice: readonly string[];
  readonly bridgeHints: readonly string[];
  readonly score: number;
};

const sectionTopicById: Partial<Record<ComprehensiveReportSectionId, SajuKnowledgeTopic>> = {
  personality: "personality",
  strengths: "strengths",
  weaknesses: "weaknesses",
  work_career: "work_career",
  money_asset: "money_asset",
  love_relationship: "love_relationship",
  human_relations: "human_relations",
  family_independence: "family_independence",
  study_growth: "study_growth",
  environment_luck: "environment_luck",
  final_advice: "final_advice",
};

function uniqueValues<T extends string>(values: readonly T[]): readonly T[] {
  return [...new Set(values)];
}

function collectSajuTags(
  entries: readonly SajuKnowledgeEntry[],
): readonly InterpretationTagId[] {
  return uniqueValues(
    entries.flatMap((entry) => [
      ...entry.positiveTags,
      ...entry.riskTags,
      ...entry.mbtiBridgeTags,
    ]),
  );
}

function collectMbtiTags(entry: MbtiKnowledgeEntry): readonly InterpretationTagId[] {
  return uniqueValues([
    ...entry.traitTags,
    ...entry.riskTags,
    ...entry.sajuBridgeTags,
    ...entry.relationshipPreferences.attracts,
    ...entry.relationshipPreferences.needs,
    ...entry.relationshipPreferences.risks,
  ]);
}

function hasAllTags(
  sourceTags: readonly string[],
  requiredTags: readonly string[] | undefined,
): boolean {
  if (requiredTags === undefined || requiredTags.length === 0) {
    return true;
  }

  const sourceSet = new Set(sourceTags);

  return requiredTags.every((tag) => sourceSet.has(tag));
}

function getSectionTopic(
  sectionId: ComprehensiveReportSectionId,
): SajuKnowledgeTopic | undefined {
  if (sectionId === "saju_mbti_fusion" || sectionId === "opening_summary") {
    return undefined;
  }

  return sectionTopicById[sectionId];
}

function sortSajuEvidenceForTopic(
  entries: readonly SajuKnowledgeEntry[],
  topic: SajuKnowledgeTopic,
  mbtiEntry: MbtiKnowledgeEntry,
): SajuKnowledgeEntry[] {
  const matchedTags = [
    ...mbtiEntry.traitTags,
    ...mbtiEntry.riskTags,
    ...mbtiEntry.sajuBridgeTags,
  ];

  return entries
    .map((entry, index) => ({
      entry,
      index,
      score: scoreSajuEvidenceForTopic({ entry, topic, matchedTags }),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.index - right.index;
    })
    .map((item) => item.entry);
}

export function getSajuKnowledgeByIds(
  ids: readonly string[],
): SajuKnowledgeEntry[] {
  return ids
    .map((id) => SAJU_KNOWLEDGE_BY_ID.get(id))
    .filter((entry): entry is SajuKnowledgeEntry => entry !== undefined);
}

export function getMbtiKnowledge(type: MbtiType): MbtiKnowledgeEntry {
  const entry = MBTI_KNOWLEDGE_BY_TYPE.get(type);

  if (entry === undefined) {
    throw new Error(`Unknown MBTI type: ${type}`);
  }

  return entry;
}

export function getMbtiTopicEvidence(input: {
  readonly mbtiType: MbtiType;
  readonly topic: SajuKnowledgeTopic;
  readonly matchedTags?: readonly InterpretationTagId[];
}): MbtiTopicEvidence {
  const entry = getMbtiKnowledge(input.mbtiType);
  const topicInterpretation = entry.topicInterpretations?.[input.topic];

  if (topicInterpretation === undefined) {
    throw new Error(`Missing MBTI topic evidence: ${input.mbtiType}/${input.topic}`);
  }

  return {
    mbtiType: input.mbtiType,
    topic: input.topic,
    summary: topicInterpretation.summary,
    positive: topicInterpretation.positive,
    risk: topicInterpretation.risk,
    advice: topicInterpretation.advice,
    bridgeHints: topicInterpretation.sajuConnectionHints,
    score: scoreMbtiEvidenceForTopic({
      entry,
      topic: input.topic,
      matchedTags: input.matchedTags,
    }),
  };
}

export function findFusionRules(input: {
  readonly sajuEntryIds: readonly string[];
  readonly mbtiType: MbtiType;
  readonly topic?: SajuKnowledgeTopic;
}): FusionKnowledgeRule[] {
  const selectedSajuEntries = getSajuKnowledgeByIds(input.sajuEntryIds);
  const selectedSajuIds = new Set(selectedSajuEntries.map((entry) => entry.id));
  const sajuTags = collectSajuTags(selectedSajuEntries);
  const mbtiEntry = getMbtiKnowledge(input.mbtiType);
  const mbtiTags = collectMbtiTags(mbtiEntry);

  return FUSION_KNOWLEDGE_BASE.filter((rule) => {
    const hasSajuBasis = rule.sajuEntryIds.some((id) => selectedSajuIds.has(id));
    const matchesMbti =
      rule.mbtiTypes === undefined || rule.mbtiTypes.includes(input.mbtiType);
    const matchesTopic = input.topic === undefined || rule.topic === input.topic;

    return (
      hasSajuBasis &&
      matchesMbti &&
      matchesTopic &&
      hasAllTags(sajuTags, rule.requiredSajuTags) &&
      hasAllTags(mbtiTags, rule.requiredMbtiTags)
    );
  }).sort((left, right) => right.priority - left.priority);
}

export function buildSectionEvidence(
  input: BuildSectionEvidenceInput,
): SectionEvidence {
  const sectionDefinition = COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.find(
    (section) => section.id === input.sectionId,
  );
  const topic = getSectionTopic(input.sectionId);
  const sajuEntries = getSajuKnowledgeByIds(input.sajuEntryIds);
  const mbtiEvidence = getMbtiKnowledge(input.mbtiType);
  const topicFilteredSajuEvidence =
    topic === undefined
      ? sajuEntries
      : sajuEntries.filter((entry) => entry.topicWeights[topic] !== undefined);
  const sajuEvidence =
    topic === undefined
      ? topicFilteredSajuEvidence
      : sortSajuEvidenceForTopic(topicFilteredSajuEvidence, topic, mbtiEvidence);

  if (sectionDefinition === undefined) {
    throw new Error(`Unknown report section: ${input.sectionId}`);
  }

  return {
    sectionId: input.sectionId,
    sajuEvidence,
    mbtiEvidence,
    ...(topic === undefined
      ? {}
      : {
          mbtiTopicEvidence: getMbtiTopicEvidence({
            mbtiType: input.mbtiType,
            topic,
            matchedTags: collectSajuTags(sajuEntries),
          }),
        }),
    fusionRules: findFusionRules({
      sajuEntryIds: input.sajuEntryIds,
      mbtiType: input.mbtiType,
      ...(topic === undefined ? {} : { topic }),
    }),
  };
}

export const REPORT_KNOWLEDGE_SELECTOR_SOURCES = {
  saju: SAJU_KNOWLEDGE_BASE,
  mbti: MBTI_KNOWLEDGE_BASE,
  fusion: FUSION_KNOWLEDGE_BASE,
} as const;
