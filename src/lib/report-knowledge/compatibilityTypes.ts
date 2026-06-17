import type { MbtiTypeCode } from "./mbtiKnowledgeTypes";
import type { ComputedSajuFacts } from "./sajuComputedFactsTypes";
import type { CompatibilityDeepSajuLayer } from "./compatibilityDeepSajuBridge";

export type CompatibilityRelationshipType =
  | "love"
  | "some"
  | "marriage"
  | "friendship";

export type CompatibilityPersonInput = {
  readonly role: "personA" | "personB";
  readonly displayName: string;
  readonly gender?: "MALE" | "FEMALE" | "OTHER" | null;
  readonly calendarType: "SOLAR" | "LUNAR";
  readonly birthDate: string;
  readonly birthTime?: string | null;
  readonly birthTimeKnown: boolean;
  readonly timezone: string;
  readonly mbti?: string | null;
};

export type CompatibilityInput = {
  readonly productType: "saju_mbti_compatibility";
  readonly productVersion: "1.0";
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personA: CompatibilityPersonInput;
  readonly personB: CompatibilityPersonInput;
};

export type CompatibilityScoreBreakdown = {
  readonly attraction: number;
  readonly communication: number;
  readonly lifestyleRhythm: number;
  readonly conflictRecovery: number;
  readonly longTermStability: number;
  readonly growthComplement: number;
};

export type CompatibilityScoreResult = {
  readonly totalScore: number;
  readonly breakdown: CompatibilityScoreBreakdown;
  readonly scoreLabel: string;
  readonly scoreCaution: string;
};

export type CompatibilityEvidenceSection =
  | "overview"
  | "two_charts"
  | "attraction"
  | "strengths"
  | "frictions"
  | "communication"
  | "relationship_scenes"
  | "long_term"
  | "money_lifestyle"
  | "conflict_recovery"
  | "final_advice";

export type CompatibilityEvidenceItem = {
  readonly section: CompatibilityEvidenceSection;
  readonly title: string;
  readonly summary: string;
  readonly deepSajuLayer?: CompatibilityDeepSajuLayer;
  readonly personAFeatureIds: readonly string[];
  readonly personBFeatureIds: readonly string[];
  readonly mbtiTraitIds: readonly string[];
  readonly sceneSeeds: readonly string[];
  readonly practicalSwitches: readonly string[];
  readonly scoreImpact: number;
};

export type CompatibilityPillars = {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly hour?: string;
};

export type CompatibilityPersonChartSummary = {
  readonly role: CompatibilityPersonInput["role"];
  readonly displayName: string;
  readonly mbti?: MbtiTypeCode;
  readonly birthTimeConfidence: "known" | "unknown";
  readonly pillars: CompatibilityPillars;
  readonly dayMaster: string;
  readonly dayPillar: string;
  readonly featureIds: readonly string[];
  readonly featureLabels: readonly string[];
  readonly diagnosticFeatureLabels: readonly string[];
  readonly sajuFacts: ComputedSajuFacts;
};
