import type { InterpretationTagId } from "./interpretationTags";
import type { MbtiKnowledgeEntry } from "./mbtiKnowledgeTypes";
import type { SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

function countMatches(
  source: readonly InterpretationTagId[],
  matchedTags: readonly InterpretationTagId[],
): number {
  const matchedSet = new Set<InterpretationTagId>(matchedTags);

  return source.filter((tag) => matchedSet.has(tag)).length;
}

function hasTag(entry: MbtiKnowledgeEntry, tag: InterpretationTagId): boolean {
  return (
    entry.traitTags.includes(tag) ||
    entry.riskTags.includes(tag) ||
    entry.sajuBridgeTags.includes(tag) ||
    entry.relationshipPreferences.attracts.includes(tag) ||
    entry.relationshipPreferences.needs.includes(tag) ||
    entry.relationshipPreferences.risks.includes(tag)
  );
}

export function scoreMbtiEvidenceForTopic(input: {
  readonly entry: MbtiKnowledgeEntry;
  readonly topic: SajuKnowledgeTopic;
  readonly matchedTags?: readonly InterpretationTagId[];
}): number {
  const matchedTags = input.matchedTags ?? [];
  const baseScore = input.entry.topicWeights[input.topic] ?? 0;
  const tagScore =
    countMatches(input.entry.traitTags, matchedTags) * 0.07 +
    countMatches(input.entry.riskTags, matchedTags) * 0.08 +
    countMatches(input.entry.sajuBridgeTags, matchedTags) * 0.06;
  const weaknessScore =
    input.topic === "weaknesses" && input.entry.riskTags.length > 0 ? 0.18 : 0;
  const relationshipScore =
    (input.topic === "love_relationship" || input.topic === "human_relations") &&
    (input.entry.relationshipPreferences.attracts.length > 0 ||
      input.entry.relationshipPreferences.needs.length > 0 ||
      input.entry.relationshipPreferences.risks.length > 0)
      ? 0.14
      : 0;
  const workScore =
    input.topic === "work_career" &&
    (hasTag(input.entry, "leadership") ||
      hasTag(input.entry, "efficiency_focus") ||
      hasTag(input.entry, "precision_skill") ||
      hasTag(input.entry, "authority_orientation"))
      ? 0.14
      : 0;
  const moneyScore =
    input.topic === "money_asset" &&
    (hasTag(input.entry, "money_orientation") ||
      hasTag(input.entry, "asset_building") ||
      hasTag(input.entry, "stability_need") ||
      hasTag(input.entry, "efficiency_focus"))
      ? 0.14
      : 0;

  return Number(
    (
      baseScore +
      tagScore +
      weaknessScore +
      relationshipScore +
      workScore +
      moneyScore
    ).toFixed(4),
  );
}
