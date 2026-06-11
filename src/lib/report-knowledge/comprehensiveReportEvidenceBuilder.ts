import type {
  EvidenceRole,
  ComprehensiveReportEvidencePacket,
  ComprehensiveReportSectionEvidence,
  ReportEvidenceItem,
} from "./comprehensiveReportEvidenceTypes";
import type { FusionKnowledgeRule } from "./fusionKnowledgeTypes";
import type { InterpretationTagId } from "./interpretationTags";
import {
  findFusionRules,
  getMbtiKnowledge,
  getSajuKnowledgeByIds,
} from "./knowledgeSelectors";
import { scoreMbtiEvidenceForTopic } from "./mbtiEvidenceScoring";
import type { MbtiKnowledgeEntry, MbtiType } from "./mbtiKnowledgeTypes";
import {
  COMPREHENSIVE_REPORT_SECTION_DEFINITIONS,
  type ComprehensiveReportSectionDefinition,
  type ComprehensiveReportSectionId,
} from "./reportSectionSchema";
import { scoreSajuEvidenceForTopic } from "./sajuEvidenceScoring";
import type { SajuKnowledgeEntry, SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

const sectionTopicById: Partial<Record<ComprehensiveReportSectionId, SajuKnowledgeTopic>> = {
  opening_summary: "personality",
  saju_core: "personality",
  mbti_core: "personality",
  saju_mbti_fusion: "personality",
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

function uniqueTags(tags: readonly InterpretationTagId[]): readonly InterpretationTagId[] {
  return [...new Set(tags)];
}

function collectSajuTags(
  entries: readonly SajuKnowledgeEntry[],
): readonly InterpretationTagId[] {
  return uniqueTags(
    entries.flatMap((entry) => [
      ...entry.positiveTags,
      ...entry.riskTags,
      ...entry.mbtiBridgeTags,
    ]),
  );
}

function collectMbtiTags(entry: MbtiKnowledgeEntry): readonly InterpretationTagId[] {
  return uniqueTags([
    ...entry.traitTags,
    ...entry.riskTags,
    ...entry.sajuBridgeTags,
    ...entry.relationshipPreferences.attracts,
    ...entry.relationshipPreferences.needs,
    ...entry.relationshipPreferences.risks,
  ]);
}

function getSectionTopic(
  sectionId: ComprehensiveReportSectionId,
): SajuKnowledgeTopic | undefined {
  return sectionTopicById[sectionId];
}

function getFusionEvidenceRole(rule: FusionKnowledgeRule): EvidenceRole {
  if (rule.kind === "reinforcement") {
    return "fusion_reinforcement";
  }
  if (rule.kind === "contrast") {
    return "fusion_contrast";
  }
  if (rule.kind === "compensation") {
    return "fusion_compensation";
  }

  return "topic_specialization";
}

function getSajuSummary(
  entry: SajuKnowledgeEntry,
  topic: SajuKnowledgeTopic,
): string {
  return entry.topicInterpretations?.[topic]?.summary ?? entry.summary;
}

function buildSajuEvidenceItems(input: {
  readonly entries: readonly SajuKnowledgeEntry[];
  readonly topic: SajuKnowledgeTopic;
  readonly mbtiTags: readonly InterpretationTagId[];
}): readonly ReportEvidenceItem[] {
  return input.entries
    .filter((entry) => entry.topicWeights[input.topic] !== undefined)
    .map((entry) => ({
      role: "primary_saju" as const,
      sourceId: entry.id,
      sourceLabelKo: entry.labelKo,
      summary: getSajuSummary(entry, input.topic),
      topic: input.topic,
      tags: uniqueTags([
        ...entry.positiveTags,
        ...entry.riskTags,
        ...entry.mbtiBridgeTags,
      ]),
      priority: Number(
        (
          200 +
          scoreSajuEvidenceForTopic({
            entry,
            topic: input.topic,
            matchedTags: input.mbtiTags,
          })
        ).toFixed(4),
      ),
    }))
    .sort((left, right) => right.priority - left.priority);
}

function buildMbtiEvidenceItem(input: {
  readonly entry: MbtiKnowledgeEntry;
  readonly topic: SajuKnowledgeTopic;
  readonly sajuTags: readonly InterpretationTagId[];
  readonly sectionId: ComprehensiveReportSectionId;
}): ReportEvidenceItem {
  const basePriority = input.sectionId === "mbti_core" ? 220 : 100;
  const topicEvidence = input.entry.topicInterpretations?.[input.topic];

  return {
    role: "supporting_mbti",
    sourceId: `mbti_${input.entry.type}_${input.topic}`,
    sourceLabelKo: input.entry.type,
    summary: topicEvidence?.summary ?? input.entry.summary,
    topic: input.topic,
    tags: collectMbtiTags(input.entry),
    priority: Number(
      (
        basePriority +
        scoreMbtiEvidenceForTopic({
          entry: input.entry,
          topic: input.topic,
          matchedTags: input.sajuTags,
        })
      ).toFixed(4),
    ),
  };
}

function buildFusionEvidenceItems(input: {
  readonly rules: readonly FusionKnowledgeRule[];
  readonly topic: SajuKnowledgeTopic;
}): readonly ReportEvidenceItem[] {
  return input.rules.map((rule) => ({
    role: getFusionEvidenceRole(rule),
    sourceId: rule.id,
    sourceLabelKo: rule.summary,
    summary: rule.interpretation,
    topic: input.topic,
    tags: uniqueTags([
      ...(rule.requiredSajuTags ?? []),
      ...(rule.requiredMbtiTags ?? []),
    ]),
    priority: rule.priority,
  }));
}

function getFusionRulesForSection(input: {
  readonly sectionDefinition: ComprehensiveReportSectionDefinition;
  readonly sajuEntryIds: readonly string[];
  readonly mbtiType: MbtiType;
  readonly topic: SajuKnowledgeTopic;
}): readonly FusionKnowledgeRule[] {
  if (input.sectionDefinition.id === "saju_mbti_fusion") {
    return findFusionRules({
      sajuEntryIds: input.sajuEntryIds,
      mbtiType: input.mbtiType,
    });
  }

  return findFusionRules({
    sajuEntryIds: input.sajuEntryIds,
    mbtiType: input.mbtiType,
    topic: input.topic,
  });
}

function buildSectionWarnings(input: {
  readonly sectionDefinition: ComprehensiveReportSectionDefinition;
  readonly primarySaju: readonly ReportEvidenceItem[];
  readonly supportingMbti: readonly ReportEvidenceItem[];
  readonly fusion: readonly ReportEvidenceItem[];
}): readonly string[] {
  const warnings: string[] = [];

  if (
    input.sectionDefinition.primaryBasis !== "display" &&
    input.sectionDefinition.id !== "mbti_core" &&
    input.primarySaju.length === 0
  ) {
    warnings.push(`${input.sectionDefinition.id} needs primary saju evidence.`);
  }
  if (
    input.sectionDefinition.id === "saju_mbti_fusion" &&
    input.fusion.length === 0
  ) {
    warnings.push("saju_mbti_fusion needs matched fusion evidence.");
  }
  if (
    input.sectionDefinition.id === "mbti_core" &&
    input.supportingMbti.length === 0
  ) {
    warnings.push("mbti_core needs supporting MBTI evidence.");
  }

  return warnings;
}

function buildSectionEvidence(input: {
  readonly sectionDefinition: ComprehensiveReportSectionDefinition;
  readonly sajuEntries: readonly SajuKnowledgeEntry[];
  readonly mbtiEntry: MbtiKnowledgeEntry;
  readonly sajuEntryIds: readonly string[];
  readonly sajuTags: readonly InterpretationTagId[];
  readonly mbtiTags: readonly InterpretationTagId[];
}): ComprehensiveReportSectionEvidence {
  const topic = getSectionTopic(input.sectionDefinition.id);

  if (topic === undefined) {
    return {
      sectionId: input.sectionDefinition.id,
      titleKo: input.sectionDefinition.titleKo,
      primarySaju: [],
      supportingMbti: [],
      fusion: [],
      warnings: [],
    };
  }

  const primarySaju =
    input.sectionDefinition.primaryBasis === "display" ||
    input.sectionDefinition.id === "mbti_core"
      ? []
      : buildSajuEvidenceItems({
          entries: input.sajuEntries,
          topic,
          mbtiTags: input.mbtiTags,
        });
  const supportingMbti =
    input.sectionDefinition.primaryBasis === "display"
      ? []
      : [
          buildMbtiEvidenceItem({
            entry: input.mbtiEntry,
            topic,
            sajuTags: input.sajuTags,
            sectionId: input.sectionDefinition.id,
          }),
        ];
  const fusionRules =
    input.sectionDefinition.primaryBasis === "display" ||
    input.sectionDefinition.id === "mbti_core"
      ? []
      : getFusionRulesForSection({
          sectionDefinition: input.sectionDefinition,
          sajuEntryIds: input.sajuEntryIds,
          mbtiType: input.mbtiEntry.type,
          topic,
        });
  const fusion = buildFusionEvidenceItems({ rules: fusionRules, topic });

  return {
    sectionId: input.sectionDefinition.id,
    titleKo: input.sectionDefinition.titleKo,
    primarySaju,
    supportingMbti,
    fusion,
    warnings: buildSectionWarnings({
      sectionDefinition: input.sectionDefinition,
      primarySaju,
      supportingMbti,
      fusion,
    }),
  };
}

export function buildComprehensiveReportEvidencePacket(input: {
  readonly mbtiType: MbtiType;
  readonly sajuEntryIds: readonly string[];
}): ComprehensiveReportEvidencePacket {
  const sajuEntries = getSajuKnowledgeByIds(input.sajuEntryIds);
  const mbtiEntry = getMbtiKnowledge(input.mbtiType);
  const sajuTags = collectSajuTags(sajuEntries);
  const mbtiTags = collectMbtiTags(mbtiEntry);
  const sections = COMPREHENSIVE_REPORT_SECTION_DEFINITIONS.map((sectionDefinition) =>
    buildSectionEvidence({
      sectionDefinition,
      sajuEntries,
      mbtiEntry,
      sajuEntryIds: input.sajuEntryIds,
      sajuTags,
      mbtiTags,
    }),
  );
  const globalWarnings: string[] = [];

  if (sajuEntries.length !== input.sajuEntryIds.length) {
    globalWarnings.push("Some Saju entry ids were not found.");
  }

  return {
    mbtiType: input.mbtiType,
    sajuEntryIds: input.sajuEntryIds,
    sections,
    globalWarnings,
  };
}
