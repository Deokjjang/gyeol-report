import type { MbtiType } from "../report-knowledge/mbtiKnowledgeTypes";
import type { InterpretationContext, SemanticAxis, SemanticSignature } from "./semanticCore";

export type { MbtiType, InterpretationContext, SemanticAxis };
export const MBTI_SEMANTIC_ANNOTATION_VERSION = "mbti-semantic-13d-2a-v1" as const;
export const MBTI_WEIGHT_CLASSES = { DIMENSION_PRIOR: 0.5, GENERAL_TRAIT: 1, SPECIFIC_TRAIT: 1.5, DIRECT_BEHAVIOR: 2, DOMAIN_SPECIFIC: 1.5, REFERENCE_ONLY: 0 } as const;
export type MbtiWeightClass = keyof typeof MBTI_WEIGHT_CLASSES;
export const MBTI_DOMAIN_CONTEXTS = {
  IDENTITY: ["identity"], THINKING: ["identity", "learning"], CAREER: ["work"], WORK: ["work"], MONEY: ["money"], INVESTMENT: ["money"],
  STUDY: ["learning"], LOVE: ["love"], MARRIAGE: ["love"], PARENTS: ["social"], CHILDREN: ["social"], RELATIONSHIPS: ["social"],
  COMMUNICATION: ["social"], STRENGTHS: ["identity"], RISKS: ["stress"], GROWTH: ["identity", "recovery"],
  RECOMMENDED_JOBS: [], AVOID_JOBS_OR_ENVIRONMENTS: [], RELATIONSHIP_PAIR: [], MYEONGLI_BRIDGE_HINT: [],
} as const satisfies Record<string, readonly InterpretationContext[]>;
export type MbtiSourceDomain = keyof typeof MBTI_DOMAIN_CONTEXTS;
export const GENERAL_MBTI_DOMAINS: readonly MbtiSourceDomain[] = ["IDENTITY", "THINKING", "STRENGTHS", "RISKS", "GROWTH", "COMMUNICATION", "RELATIONSHIPS"];
export const MBTI_TRAIT_DOMAINS = {
  identity: "IDENTITY", thinkingStyle: "THINKING", career: "CAREER", workplace: "WORK", money: "MONEY", investment: "INVESTMENT", study: "STUDY",
  love: "LOVE", marriage: "MARRIAGE", parenting: "PARENTS", child: "CHILDREN", relationships: "RELATIONSHIPS", communication: "COMMUNICATION",
  strengths: "STRENGTHS", risks: "RISKS", growth: "GROWTH",
} as const satisfies Record<string, MbtiSourceDomain>;
export type MbtiEvidenceSource = "dimension_prior" | "source_trait" | "domain_trait" | "reference_only";
export type MbtiNodeClassification = "SCORING_SEMANTIC" | "REFERENCE_ONLY" | "METADATA" | "UNCLASSIFIED";
export type MbtiSourceNode = {
  id: string; mbtiType: MbtiType; sourceDomain: MbtiSourceDomain | null; sourcePath: string; stablePath: string;
  value: string | number | boolean | null; classification: MbtiNodeClassification; reason: string;
  sourceCoverage?: string;
};
export type MbtiSemanticAnnotation = {
  id: string; mbtiType: MbtiType; sourceNodeId: string; sourceDomain: MbtiSourceDomain; sourceType: MbtiEvidenceSource;
  axes: SemanticSignature; contexts: InterpretationContext[]; weightClass: MbtiWeightClass;
  annotationConfidence: "DIRECT" | "SUPPORTED" | "REFERENCE_ONLY";
  metadata?: Record<string, unknown>;
};
export type MbtiContribution = {
  axis: SemanticAxis; sourceNodeId: string; mbtiType: MbtiType; sourceDomain: MbtiSourceDomain; sourceType: MbtiEvidenceSource;
  weightClass: MbtiWeightClass; rawValue: number; effectiveValue: number; annotationConfidence: MbtiSemanticAnnotation["annotationConfidence"];
  contexts: InterpretationContext[]; sourcePath?: string; sourceCoverage?: string;
};
export type MbtiDiagnostic = { code: string; sourceNodeIds: string[]; detail?: string };
export const semanticOrder = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
/** Compact hand-authored axis data, never a text classifier. */
export type AxisTerms = readonly [SemanticAxis, number] | readonly [SemanticAxis, number, SemanticAxis, number] |
  readonly [SemanticAxis, number, SemanticAxis, number, SemanticAxis, number] |
  readonly [SemanticAxis, number, SemanticAxis, number, SemanticAxis, number, SemanticAxis, number];
export type AnnotationEntry = AxisTerms | "ADVICE" | "UNSCORED_REFERENCE";
export type TypeAnnotationManifest = Readonly<Record<string, AnnotationEntry>>;
