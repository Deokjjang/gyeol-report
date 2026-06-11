import type { InterpretationTagId } from "./interpretationTags";
import type { SajuKnowledgeEntry, SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

function countMatches(
  source: readonly InterpretationTagId[],
  matchedTags: readonly InterpretationTagId[],
): number {
  const matchedSet = new Set<InterpretationTagId>(matchedTags);

  return source.filter((tag) => matchedSet.has(tag)).length;
}

function hasTag(
  entry: SajuKnowledgeEntry,
  tag: InterpretationTagId,
): boolean {
  return (
    entry.positiveTags.includes(tag) ||
    entry.riskTags.includes(tag) ||
    entry.mbtiBridgeTags.includes(tag)
  );
}

export function scoreSajuEvidenceForTopic(input: {
  readonly entry: SajuKnowledgeEntry;
  readonly topic: SajuKnowledgeTopic;
  readonly matchedTags?: readonly InterpretationTagId[];
}): number {
  const matchedTags = input.matchedTags ?? [];
  const baseScore = input.entry.topicWeights[input.topic] ?? 0;
  const tagScore =
    countMatches(input.entry.positiveTags, matchedTags) * 0.08 +
    countMatches(input.entry.riskTags, matchedTags) * 0.07 +
    countMatches(input.entry.mbtiBridgeTags, matchedTags) * 0.06;
  const weaknessScore =
    input.topic === "weaknesses" && input.entry.riskTags.length > 0 ? 0.18 : 0;
  const strengthScore =
    input.topic === "strengths" && input.entry.positiveTags.length > 0 ? 0.14 : 0;
  const moneyScore =
    input.topic === "money_asset" &&
    (hasTag(input.entry, "money_orientation") ||
      hasTag(input.entry, "asset_building"))
      ? 0.16
      : 0;
  const loveScore =
    input.topic === "love_relationship" &&
    (hasTag(input.entry, "romantic_attraction") ||
      hasTag(input.entry, "workplace_romance") ||
      hasTag(input.entry, "relationship_distance"))
      ? 0.16
      : 0;
  const careerScore =
    input.topic === "work_career" &&
    (hasTag(input.entry, "authority_orientation") ||
      hasTag(input.entry, "precision_skill") ||
      hasTag(input.entry, "leadership"))
      ? 0.14
      : 0;

  return Number(
    (
      baseScore +
      tagScore +
      weaknessScore +
      strengthScore +
      moneyScore +
      loveScore +
      careerScore
    ).toFixed(4),
  );
}
