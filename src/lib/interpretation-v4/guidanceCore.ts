import type { InterpretationContext } from "./semanticCore";
import type { MyeongliSemanticProfile } from "./foundationIntegratedProfile";
import type { MbtiSemanticProfile } from "./mbtiSemanticProfile";
import type { MyeongliMbtiFusionProfile } from "./fusionCore";
import type { ClaimProfile } from "./claimCore";
import type { PersonalResonanceProfile, ResonanceCondition } from "./personalResonanceCore";

export const GYEOL_GUIDANCE_ENGINE_VERSION = "contextual-guidance-13d-3c-v1" as const;
export const GYEOL_WORK_MODE_VERSION = "work-mode-13d-3c-v1" as const;
export const LIFE_STATUSES = ["STUDENT", "JOB_SEEKER", "EMPLOYEE", "FREELANCER", "BUSINESS_OWNER", "OTHER", "UNKNOWN"] as const;
export type LifeStatus = typeof LIFE_STATUSES[number];
export const GUIDANCE_RELATIONSHIP_STATUSES = ["SINGLE", "DATING", "MARRIED", "OTHER", "UNKNOWN"] as const;
export type GuidanceRelationshipStatus = typeof GUIDANCE_RELATIONSHIP_STATUSES[number];
export const PRIMARY_WORK_MODES = ["ITERATIVE_PRODUCT", "CRAFT_FINAL_OUTPUT", "HIGH_STAKES_PRECISION", "EDITORIAL_REVIEW", "RESEARCH_EXPLORATION", "OPERATIONS_PROCESS", "SALES_MARKET", "PEOPLE_SERVICE", "LEADERSHIP_MANAGEMENT", "PERFORMANCE_PUBLIC", "LEARNING_PROJECT", "APPLICATION_MARKET"] as const;
export type WorkMode = typeof PRIMARY_WORK_MODES[number] | "GENERAL";
export type WeightedWorkMode = { mode: WorkMode; weight: number; confidence: number; matchedBy: string[] };
export type GuidanceUserContext = {
  lifeStatus: LifeStatus; rawJobText?: string; workModes: WeightedWorkMode[];
  relationshipStatus: GuidanceRelationshipStatus; contextConfidence: number;
  provenance: { lifeStatusSource?: string; jobTextSource?: string; relationshipSource?: string };
};
export const GUIDANCE_PROBLEMS = ["PERFECTIONISM_DELAY", "OVERTHINKING", "TOO_MANY_OPTIONS", "RUMINATION", "INFORMATION_OVERLOAD", "PREMATURE_DECISION", "FAST_START_WEAK_FINISH", "TOO_MANY_STARTS", "IMPULSIVE_ACTION", "ROUTINE_DROP", "CHANGE_CHASING", "OVER_STABILITY", "OVERRESPONSIBILITY", "DELEGATION_DIFFICULTY", "MICROMANAGEMENT", "WORKAHOLIC", "HIGH_STANDARD_FOR_OTHERS", "URGENCY_PRESSURE", "BLUNT_COMMUNICATION", "CONFLICT_AVOIDANCE", "UNSPOKEN_EXPECTATION", "OVEREXPLAINING", "PEOPLE_PLEASING", "WEAK_BOUNDARY", "SOCIAL_DRAIN", "OVERREADING_SIGNALS", "EMOTIONAL_WITHDRAWAL", "OVER_CARE", "OPPORTUNITY_HOPPING", "OVER_SAVING", "IMPULSE_SPENDING", "MONEY_OVER_MEANING", "MEANING_OVER_MONEY", "STATUS_SPENDING", "REST_GUILT", "MENTAL_OFF_SWITCH", "SCHEDULE_OVERLOAD", "TOO_MUCH_ISOLATION", "NEVER_ENOUGH", "NEXT_GOAL_TOO_FAST"] as const;
export type GuidanceProblem = typeof GUIDANCE_PROBLEMS[number];
export const GUIDANCE_STRATEGIES = ["DEFINE_DONE", "TIMEBOX_THINKING", "LIMIT_REVISION", "ITERATE_WHEN_SAFE", "PRIORITIZE_CRITICAL_ERRORS", "EXTERNALIZE_MEMORY", "SET_BOUNDARY", "DELEGATE_BY_OUTCOME", "SEPARATE_FACT_INTERPRETATION", "ONE_OPPOSING_VIEW", "STOP_RULE", "RECOVERY_BLOCK", "REMOVE_BEFORE_ADD", "VALUE_AND_PRICE_SEPARATE", "PERSON_VS_PROBLEM", "DECISION_EXECUTION_SPLIT", "PRIORITIZE_BY_IMPACT", "SELECTIVE_FEEDBACK", "DEFINE_RESPONSIBILITY", "CAP_COMMITMENTS", "SPEND_DELAY", "CELEBRATE_AND_REVIEW", "COMMUNICATE_STATE", "SMALL_EXPERIMENT", "BUDGET_BUCKETS"] as const;
export type GuidanceStrategyId = typeof GUIDANCE_STRATEGIES[number];
export type StrategyApplicability = "PREFERRED" | "ALLOWED" | "CAUTION" | "FORBIDDEN";
export type GuidanceConfidence = "LOW" | "MEDIUM" | "HIGH";
export type GuidanceInputs = { myeongli: MyeongliSemanticProfile; mbti: MbtiSemanticProfile; fusion: MyeongliMbtiFusionProfile; claims: ClaimProfile; resonance: PersonalResonanceProfile };
export type GuidanceCondition =
  | { kind: "resonance"; ids: string[] }
  | { kind: "existing"; condition: ResonanceCondition }
  | { kind: "delayQualifiedClaim" }
  | { kind: "behavior"; key: string }
  | { kind: "all" | "any"; conditions: GuidanceCondition[] };
export type GuidanceRefs = { sourceResonanceIds: string[]; sourceClaimIds: string[]; sourceTraitArcIds: string[]; sourceFusionIds: string[]; evidenceIds: string[] };
export type GuidanceProblemDefinition = {
  id: string; problem: GuidanceProblem; humanProblemDescription: string; contexts: InterpretationContext[];
  required: GuidanceCondition; forbidden?: GuidanceCondition; candidateStrategies: GuidanceStrategyId[];
};
export type GuidanceProblemCandidate = GuidanceRefs & {
  id: string; problem: GuidanceProblem; humanProblemDescription: string; semanticTheme: string;
  contexts: InterpretationContext[]; evidenceStrength: "SUPPORT" | "MAIN" | "STRONG"; confidence: GuidanceConfidence;
  candidateStrategies: GuidanceStrategyId[]; forbiddenStrategies: GuidanceStrategyId[]; relatedProblemIds: string[];
  conflictGroupId?: string;
};
export type GuidanceStrategy = {
  id: string; strategy: GuidanceStrategyId; generalAdvice: string; action: string;
  applicability: Record<WorkMode, StrategyApplicability>; allowedModes: WorkMode[]; cautionModes: WorkMode[]; forbiddenModes: WorkMode[];
};
export type GuidanceCandidate = GuidanceRefs & {
  id: string; problemId: string; problem: GuidanceProblem; problemDescription: string;
  selectedStrategyIds: GuidanceStrategyId[]; customerAdvice: string; whyThisFits?: string;
  context: Pick<GuidanceUserContext, "lifeStatus" | "workModes" | "relationshipStatus">;
  confidence: GuidanceConfidence; contextFit: number; applicability: StrategyApplicability;
  conflictGroupId?: string; mergedFromGuidanceIds?: string[];
  diagnostics: { contextVariantId: string; action: string; rankingScore: number; problemEvidenceStrength: number; personalSpecificity: number; genericAdvicePenalty: number; conflictPenalty: number; unsafeContextPenalty: number };
};
export type GuidanceConflictGroup = { id: string; sourceGuidanceIds: string[]; mergedGuidanceId: string };
export type GuidanceDiagnostics = {
  problemCount: number; guidanceCount: number; lifeStatus: LifeStatus; workModes: WeightedWorkMode[]; relationshipStatus: GuidanceRelationshipStatus;
  unknownJobFallback: boolean; suppressedLowEvidenceProblems: string[]; suppressedLowConfidenceAdvice: string[];
  suppressedUnsafeStrategies: { problemId: string; strategy: GuidanceStrategyId; modes: WorkMode[] }[];
  suppressedContextMismatch: string[]; mergedAdviceConflicts: GuidanceConflictGroup[]; forbiddenStrategyAttempts: string[];
  genericAdviceRejected: string[]; warnings: string[]; hardErrors: string[];
};
export type ContextualGuidanceProfile = {
  version: typeof GYEOL_GUIDANCE_ENGINE_VERSION; workModeVersion: typeof GYEOL_WORK_MODE_VERSION; context: GuidanceUserContext;
  problems: GuidanceProblemCandidate[]; guidanceCandidates: GuidanceCandidate[]; topGuidance: GuidanceCandidate[];
  byContext: Partial<Record<InterpretationContext, string[]>>; byProblem: Partial<Record<GuidanceProblem, string[]>>;
  conflictGroups: GuidanceConflictGroup[]; mergedGuidance: GuidanceCandidate[]; diagnostics: GuidanceDiagnostics;
  debug: { userContext: GuidanceUserContext; workModeMatches: WeightedWorkMode[]; problems: GuidanceProblemCandidate[];
    selectedStrategies: { guidanceId: string; strategyIds: GuidanceStrategyId[] }[]; guidanceCandidates: GuidanceCandidate[]; topGuidance: GuidanceCandidate[];
    suppressedUnsafe: GuidanceDiagnostics["suppressedUnsafeStrategies"]; conflictMerges: GuidanceConflictGroup[]; diagnostics: GuidanceDiagnostics };
};
export type GuidanceResult = { ok: true; value: ContextualGuidanceProfile } | { ok: false; diagnostics: GuidanceDiagnostics };
