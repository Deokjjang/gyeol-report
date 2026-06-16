import type { MbtiProductType } from "./mbtiKnowledgeSelector";
import type { MbtiTypeCode } from "./mbtiKnowledgeTypes";
import {
  MBTI_TYPE_KNOWLEDGE_BASE,
  requireMbtiTypeKnowledge,
} from "./mbtiTypeKnowledgeBase";

export type MbtiCompatibilityCandidate = {
  readonly candidateType: MbtiTypeCode;
  readonly matchReasons: readonly string[];
  readonly frictionRisks: readonly string[];
  readonly recommendedFor:
    | "love"
    | "friendship"
    | "family"
    | "work_partner"
    | "general_relationship";
  readonly score: number;
};

type CandidateInput = {
  readonly userMbti: MbtiTypeCode;
  readonly relationshipNeeds: readonly string[];
  readonly compatibleTraitConditions: readonly string[];
  readonly frictionTraitConditions: readonly string[];
  readonly productType: Extract<
    MbtiProductType,
    "compatibility" | "relationship_family" | "comprehensive"
  >;
  readonly maxCandidates?: number;
};

function tokenize(values: readonly string[]): readonly string[] {
  return [
    ...new Set(
      values
        .flatMap((value) => value.split(/[\s,·/]+/u))
        .map((value) => value.trim())
        .filter((value) => value.length >= 2),
    ),
  ];
}

function countKeywordOverlap(
  left: readonly string[],
  right: readonly string[],
): number {
  const rightText = right.join("\n");

  return tokenize(left).filter((keyword) => rightText.includes(keyword)).length;
}

function getRecommendedFor(
  productType: CandidateInput["productType"],
): MbtiCompatibilityCandidate["recommendedFor"] {
  if (productType === "relationship_family") {
    return "general_relationship";
  }

  return "love";
}

export function selectMbtiCompatibilityCandidates(
  input: CandidateInput,
): readonly MbtiCompatibilityCandidate[] {
  if (input.productType === "comprehensive") {
    return [];
  }

  const userKnowledge = requireMbtiTypeKnowledge(input.userMbti);
  const needs = [
    ...input.relationshipNeeds,
    ...input.compatibleTraitConditions,
    ...userKnowledge.relationshipNeeds,
    ...userKnowledge.compatibleTraitConditions,
  ];
  const frictionConditions = [
    ...input.frictionTraitConditions,
    ...userKnowledge.frictionTraitConditions,
  ];

  return MBTI_TYPE_KNOWLEDGE_BASE
    .filter((candidate) => candidate.type !== input.userMbti)
    .map((candidate) => {
      const candidateText = [
        candidate.oneLine,
        candidate.corePattern,
        ...candidate.relationshipNeeds,
        ...candidate.compatibleTraitConditions,
        ...candidate.frictionTraitConditions,
        ...candidate.traitSeeds.flatMap((trait) => [
          trait.label,
          trait.description,
          ...trait.tags,
        ]),
      ];
      const needScore = countKeywordOverlap(needs, candidateText);
      const frictionScore = countKeywordOverlap(frictionConditions, candidateText);
      const matchReasons = [
        ...candidate.relationshipNeeds.slice(0, 1),
        ...candidate.compatibleTraitConditions.slice(0, 2),
      ].slice(0, 3);
      const frictionRisks = candidate.frictionTraitConditions.slice(0, 2);

      return {
        candidateType: candidate.type,
        matchReasons,
        frictionRisks,
        recommendedFor: getRecommendedFor(input.productType),
        score: Number((50 + needScore * 8 - frictionScore * 2).toFixed(2)),
      } satisfies MbtiCompatibilityCandidate;
    })
    .filter(
      (candidate) =>
        candidate.matchReasons.length > 0 && candidate.frictionRisks.length > 0,
    )
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.candidateType.localeCompare(right.candidateType),
    )
    .slice(0, input.maxCandidates ?? 4);
}
