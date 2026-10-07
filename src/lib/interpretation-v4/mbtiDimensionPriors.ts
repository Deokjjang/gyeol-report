import { MBTI_TYPES } from "../report-knowledge/mbtiKnowledgeTypes";
import type { SemanticSignature } from "./semanticCore";
import type { MbtiSemanticAnnotation, MbtiType } from "./mbtiSemanticCore";

export const MBTI_DIMENSION_PRIORS = {
  E: { ENERGY_DIRECTION: 2, RELATION_STYLE: 2, EXPRESSION: 1, SOCIAL_ATTUNEMENT: 1, INITIATIVE: 1 },
  I: { ENERGY_DIRECTION: -2, RELATION_STYLE: -1, DEPTH: 1, RECOVERY_NEED: 2 },
  S: { PRACTICALITY: 2, PRECISION: 1, STABILITY: 1, RESOURCE_SENSE: 1 },
  N: { PATTERN_SENSE: 2, CURIOSITY: 1, EXPANSION: 1, MEANING: 1, STRATEGY: 1 },
  T: { DECISION_STYLE: 1, COMMUNICATION_STYLE: 1, PRECISION: 1, BOUNDARY: 1, PRACTICALITY: 1 },
  F: { RELATION_STYLE: 1, SOCIAL_ATTUNEMENT: 2, CARE: 2, MEANING: 1 },
  J: { STRUCTURE_STYLE: 2, DECISION_STYLE: 2, DUTY: 1, GOAL_DRIVE: 1, STABILITY: 1 },
  P: { STRUCTURE_STYLE: -2, CHANGE_ORIENTATION: 2, ADAPTABILITY: 2, CURIOSITY: 1 },
} as const satisfies Record<string, SemanticSignature>;

export function parseSemanticMbtiType(value: unknown): { ok: true; type: MbtiType | null } | { ok: false; error: "INVALID_MBTI_TYPE" } {
  if (value === undefined || value === null || value === "unknown" || value === "UNKNOWN") return { ok: true, type: null };
  if (typeof value !== "string") return { ok: false, error: "INVALID_MBTI_TYPE" };
  const normalized = value.trim().toUpperCase();
  return (MBTI_TYPES as readonly string[]).includes(normalized) ? { ok: true, type: normalized as MbtiType } : { ok: false, error: "INVALID_MBTI_TYPE" };
}

export function buildMbtiDimensionPriors(type: MbtiType): MbtiSemanticAnnotation[] {
  return [...type].map(letter => ({ id: `mbti:${type}:prior:${letter}`, mbtiType: type, sourceNodeId: `mbti:${type}:prior:${letter}`,
    sourceDomain: "IDENTITY", sourceType: "dimension_prior", axes: { ...MBTI_DIMENSION_PRIORS[letter as keyof typeof MBTI_DIMENSION_PRIORS] },
    contexts: ["identity"], weightClass: "DIMENSION_PRIOR", annotationConfidence: "SUPPORTED", metadata: { letter, interpretation: "WEAK_PRIOR_ONLY" },
  }));
}
