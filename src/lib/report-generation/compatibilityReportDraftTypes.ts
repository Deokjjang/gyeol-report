import type {
  CompatibilityPersonChartSummary,
  CompatibilityRelationshipType,
  CompatibilityScoreBreakdown,
} from "../report-knowledge/compatibilityTypes";

export type CompatibilityReportChapterId =
  | "overview"
  | "attraction"
  | "strengths"
  | "frictions"
  | "communication"
  | "relationship_scenes"
  | "money_lifestyle"
  | "conflict_recovery"
  | "long_term_rules"
  | "final_message";

export const COMPATIBILITY_REPORT_CHAPTER_IDS = [
  "overview",
  "attraction",
  "strengths",
  "frictions",
  "communication",
  "relationship_scenes",
  "money_lifestyle",
  "conflict_recovery",
  "long_term_rules",
  "final_message",
] as const satisfies readonly CompatibilityReportChapterId[];

export type CompatibilityReportChapter = {
  readonly id: CompatibilityReportChapterId;
  readonly title: string;
  readonly headline: string;
  readonly body: string;
  readonly directHitScenes: readonly string[];
  readonly practicalAdvice: readonly string[];
};

export type CompatibilityReportRelationshipAnalysis = {
  readonly connectionSummary: string;
  readonly firstImpression: string;
  readonly stayingPower: string;
  readonly frictionPoints: readonly string[];
  readonly categoryReading: string;
  readonly aToBFatigue: string;
  readonly bToAFatigue: string;
  readonly communicationRecovery: string;
  readonly roleMoneyLifeRhythm: string;
  readonly categorySpecificAdvice: readonly string[];
  readonly timingCautions: readonly string[];
  readonly repairStrategy: readonly string[];
  readonly riskManagement: readonly string[];
};

export type CompatibilityReportDraft = {
  readonly version: "compatibility_v1_draft";
  readonly productType: "saju_mbti_compatibility";
  readonly productVersion: "1.0";
  readonly relationshipType: CompatibilityRelationshipType;
  readonly personALabel: string;
  readonly personBLabel: string;
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly scoreSummary: {
    readonly totalScore: number;
    readonly scoreLabel: string;
    readonly scoreCaution: string;
    readonly breakdown: CompatibilityScoreBreakdown;
  };
  readonly chartComparison: {
    readonly personA: CompatibilityPersonChartSummary;
    readonly personB: CompatibilityPersonChartSummary;
  };
  readonly keyCompatibilityPoints: {
    readonly attractionPoints: readonly string[];
    readonly strengthPoints: readonly string[];
    readonly frictionPoints: readonly string[];
    readonly relationshipRules: readonly string[];
  };
  readonly relationshipAnalysis: CompatibilityReportRelationshipAnalysis;
  readonly chapters: readonly CompatibilityReportChapter[];
  readonly finalAdvice: readonly string[];
  readonly safetyNotes: readonly string[];
};

export function isCompatibilityReportDraft(
  value: unknown,
): value is CompatibilityReportDraft {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const candidate = value as {
    readonly version?: unknown;
    readonly productType?: unknown;
    readonly productVersion?: unknown;
    readonly chapters?: unknown;
  };

  return (
    candidate.version === "compatibility_v1_draft" &&
    candidate.productType === "saju_mbti_compatibility" &&
    candidate.productVersion === "1.0" &&
    Array.isArray(candidate.chapters)
  );
}
