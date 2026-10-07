import type { GuidanceInputs, ContextualGuidanceProfile, GuidanceUserContext } from "./guidanceCore";
import type { InterpretationContext, SemanticAxis } from "./semanticCore";
import type { FusionConditionSplit, FusionType } from "./fusionCore";

export const GYEOL_COMPREHENSIVE_SCHEDULER_VERSION = "comprehensive-editorial-13d-4-v1" as const;
export const COMPREHENSIVE_SECTIONS = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10"] as const;
export type ComprehensiveSectionId = typeof COMPREHENSIVE_SECTIONS[number];
export type ComprehensivePlanInputs = Readonly<GuidanceInputs & { guidance: ContextualGuidanceProfile }>;
export type EditorialSource = "CORE_GYEOL" | "PERSONAL_RESONANCE" | "CLAIM" | "FUSION" | "TRAIT_ARC" | "GUIDANCE" | "MYEONGLI_PATTERN";
export type EditorialEmotion = "RELATABLE" | "SURPRISING" | "UPLIFTING" | "FACT_BOMB" | "REASSURING" | "PRACTICAL" | "FORTUNE_REWARD" | "DISCOVERY" | "CONFIDENCE" | "WARM" | "DESIRE";
export type TraitArcEditorialRole = "INTRO" | "STRENGTH" | "SHADOW" | "APPLICATION" | "GUIDANCE_RECALL";
export type OperatingManualSlot = "THINKING" | "EXECUTION" | "WORK_MONEY" | "RELATIONSHIP" | "RECOVERY";
export type SectionSlot = OperatingManualSlot | "OTHERS_SEE_ME" | "CLOSE_RELATION_CHANGE" | "RELATION_STRENGTH" | "LOVE_STYLE" | "RELATION_RISK" | "RELATION_GUIDANCE" | "WORK_STYLE" | "RESULT_STYLE" | "MONEY_STYLE" | "SUCCESS_DESIRE" | "CURRENT_CONTEXT" | "WORK_GUIDANCE" | "MONEY_GUIDANCE" | "OVERUSED_PATTERN" | "UNDERUSED_PATTERN" | "YIN_YANG" | "ELEMENT_COMPOSITE" | "RECOVERY_STYLE" | "ENVIRONMENT" | "RECOVERY_GUIDANCE";
export type SectionBridgeIntent = "IDENTITY_TO_REINFORCE" | "REINFORCE_TO_TENSION" | "TENSION_TO_STRENGTH" | "STRENGTH_TO_FORTUNE" | "FORTUNE_TO_SHADOW" | "SHADOW_TO_RELATION" | "RELATION_TO_WORK" | "WORK_TO_RECOVERY" | "RECOVERY_TO_MANUAL";
export type SectionKind = "IDENTITY" | "REINFORCE" | "TENSION" | "COMPLEMENT_SURPRISE" | "MYEONGLI_CONFIRMATION" | "MYEONGLI_COMPLEXITY" | "STRENGTH" | "GOOD_FORTUNE" | "POSITIVE_POTENTIAL" | "FACT_BOMB" | "RELATION" | "WORK_MONEY" | "RECOVERY_ENVIRONMENT" | "OPERATING_MANUAL";
export type EditorialRefs = { evidenceIds: string[]; underlyingEvidenceIds: string[]; myeongliEvidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionIds: string[]; claimIds: string[]; resonanceIds: string[]; traitArcIds: string[]; guidanceIds: string[] };
export type EditorialCandidate = EditorialRefs & {
  id: string; sourceType: EditorialSource; sourceId: string; sourceText: string;
  semanticTheme: string; broadTheme: string; primaryAxes: SemanticAxis[]; contexts: InterpretationContext[];
  allowedSections: ComprehensiveSectionId[]; preferredSections: ComprehensiveSectionId[];
  confidence: number; specificity: number; emotionalValue: number; fusionValue: number; inputFit: number; evidenceDiversity: number;
  positiveValence: number; negativeValence: number; genericness: number; priorityScore: number;
  rank: "SUPPORT" | "MAIN" | "SIGNATURE"; independentEvidenceCount: number; independentFamilies: string[];
  semanticOverlapGroup?: string; conflictGroupId?: string; duplicateGroupId?: string;
  reservedFor?: ComprehensiveSectionId; emotionTags: EditorialEmotion[]; slots: SectionSlot[];
  fusionType?: FusionType; conditionSplit?: FusionConditionSplit; thirdInterpretationSource?: string;
  internalComplexity?: { sideA: string[]; sideB: string[]; hypotheses: string[]; sourceId: string };
  claimCategory?: string; claimLevel?: number; fortune: boolean; fortuneFamilies: string[]; compositeFortune: boolean; factBomb: boolean;
  arcRole?: TraitArcEditorialRole; operatingRuleType?: OperatingManualSlot; problemId?: string; strategyIds?: string[];
  precursorIds: string[]; guidanceMerged: boolean; elementComposite: boolean; strongYinYang: boolean;
  primaryEligible: boolean; invalidReasons: string[];
};
export type EditorialConflictEdge = { left: string; right: string; kind: "CONTRADICTORY" | "TENSION_RESOLVED" | "SEMANTIC_DUPLICATE" | "TRAIT_ARC_PAIR" | "FORTUNE_OVERLAP" | "GUIDANCE_OVERLAP"; resolvedBy: string[] };
export type EditorialSuppression = { candidateId: string; reason: string; sectionId?: ComprehensiveSectionId; relatedIds?: string[] };
export type EditorialReservation = { stage: string; candidateId: string; sectionId: ComprehensiveSectionId; role?: TraitArcEditorialRole; status: "PLANNED" | "FULFILLED" | "RELEASED"; reason?: string };
export type CandidatePlacement = {
  candidateId: string; role: "PRIMARY" | "SUPPORT" | "RECALL"; context: InterpretationContext;
  /** Complete validated proof is retained here, never counted as independent derived sources. */
  provenanceEvidenceIds: string[];
  /** Exposure is not proof reduction: these are the terms to explain, others remain source references. */
  primaryEvidenceIds: string[]; supportEvidenceIds: string[]; provenanceOnlyEvidenceIds: string[];
  presentationIntent: "EXPLICIT" | "HIDDEN"; arcRoles: { traitArcId: string; role: TraitArcEditorialRole }[];
  slots: SectionSlot[]; preferredAdvice: boolean;
  guidanceRenderIntent?: "FULL_GUIDANCE" | "SHORT_GUIDANCE" | "OPERATING_RULE_RECALL";
  antecedentCandidateIds: string[]; reuseIntent: "FIRST_MEANING" | "DIFFERENT_APPLICATION" | "RESULT_ONLY" | "OPERATING_RULE_RECALL";
};
export type EvidenceOwnership = { evidenceId: string; primaryOwner: ComprehensiveSectionId; supportAllowed: ComprehensiveSectionId[]; maxPrimaryUses: 1; maxSupportUses: 1 | 2; currentPrimaryUses: number; currentSupportUses: number };
export type SemanticThemeBudget = { theme: string; core: boolean; maxPrimaryUses: number; maxSupportUses: 1; primaryUses: ComprehensiveSectionId[]; supportUses: ComprehensiveSectionId[]; recallUses: ComprehensiveSectionId[] };
export type TerminologyOwnership = { termKey: string; evidenceIds: string[]; definitionOwner?: ComprehensiveSectionId; maxDefinitions: 1; recallAllowed: true };
export type ComprehensiveSectionPlan = {
  sectionId: ComprehensiveSectionId; purpose: string; sectionKind: SectionKind;
  primaryCandidateIds: string[]; supportingCandidateIds: string[]; placements: CandidatePlacement[];
  evidenceIds: string[]; traitArcIds: string[]; fusionIds: string[]; claimIds: string[]; resonanceIds: string[]; guidanceIds: string[];
  explicitMbtiCandidateIds: string[]; allowExplicitMbti: boolean; preferredExplicitMbti: boolean; maxExplicitMbti: number;
  semanticThemes: string[]; emotionalIntent: EditorialEmotion[]; emotionalScore: number;
  depthIntent: "SHORT" | "NORMAL" | "DEEP"; estimatedNarrativeUnits: number; bridgeIntent?: SectionBridgeIntent;
  thirdInterpretations: { candidateId: string; sideA: string; sideB: string; conditionSplit: FusionConditionSplit; thirdInterpretationSource: string }[];
  factBombGroup: string[]; questionSlots: Partial<Record<SectionSlot, string[]>>;
  preferredConcreteTerms: string[]; avoidTerms: string[]; forbidFortuneVocabulary: boolean;
  context: GuidanceUserContext; coreGyeolRecall: boolean; diagnostics: { warnings: string[]; newThemes: string[]; compact: boolean };
};
export type FusionBudget = { explicit: Record<FusionType, number>; hidden: Record<FusionType, number>; explicitTotal: number; maxExplicitTotal: 7; maxByType: Record<FusionType, number> };
export type ComprehensivePlanQualityAudit = {
  coreGyeolPresent: boolean; reinforceCoverage: number; tensionOrComplementCoverage: number;
  strengthCount: number; fortuneOrPotentialCount: number; factBombCount: number;
  relationCoverage: boolean; workCoverage: boolean; moneyCoverage: boolean; recoveryCoverage: boolean; operatingRuleCount: number;
  unresolvedContradictions: number; semanticThemeOveruse: string[]; exactEvidenceOveruse: string[]; sectionNoveltyFailures: ComprehensiveSectionId[];
  explicitMbtiCount: number; fusionCounts: FusionBudget; frontLoadingScore: number;
  domainBalance: Record<string, number>; emotionalArcStatus: "VALID" | "INVALID";
  c10NewEvidenceViolations: number; qualityWarnings: string[];
};
export type ComprehensivePlanDiagnostics = {
  candidateCount: number; assignedPrimaryCount: number; assignedSupportCount: number; suppressedCount: number;
  sectionCoverage: Record<ComprehensiveSectionId, number>; sectionNovelty: Record<ComprehensiveSectionId, string[]>;
  duplicateThemeWarnings: string[]; evidenceReuseWarnings: string[]; unresolvedContradictions: string[];
  c10NewEvidenceViolations: string[]; terminologyDefinitionViolations: string[]; warnings: string[]; hardErrors: string[];
};
export type ComprehensiveEditorialPlan = {
  version: typeof GYEOL_COMPREHENSIVE_SCHEDULER_VERSION; coreGyeolId: string | null; candidates: EditorialCandidate[];
  sections: Record<ComprehensiveSectionId, ComprehensiveSectionPlan>; evidenceOwnership: EvidenceOwnership[];
  terminologyOwnership: TerminologyOwnership[]; themeBudget: SemanticThemeBudget[]; fusionBudget: FusionBudget;
  explicitMbtiBudget: { count: number; max: 7; target: [4, 7]; available: boolean };
  emotionalArc: { sectionId: ComprehensiveSectionId; intent: EditorialEmotion[]; score: number }[];
  reservations: EditorialReservation[]; suppressedCandidates: EditorialSuppression[];
  finalCoreRecallIntent: { coreGyeolId: string | null; primaryTheme: string | null; strongestPositiveCandidateId: string | null; operatingPrincipleGuidanceId: string | null };
  qualityAudit: ComprehensivePlanQualityAudit; diagnostics: ComprehensivePlanDiagnostics;
  debug: { pipelineSteps: string[]; duplicateGroups: { id: string; candidateIds: string[] }[]; conflictGraph: EditorialConflictEdge[];
    reservations: EditorialReservation[]; sections: ComprehensiveEditorialPlan["sections"]; evidenceOwnership: EvidenceOwnership[];
    themeBudget: SemanticThemeBudget[]; fusionBudget: FusionBudget; explicitMbtiBudget: ComprehensiveEditorialPlan["explicitMbtiBudget"];
    suppressedCandidates: EditorialSuppression[]; qualityAudit: ComprehensivePlanQualityAudit; diagnostics: ComprehensivePlanDiagnostics };
};
export type ComprehensivePlanResult = { ok: true; value: ComprehensiveEditorialPlan } | { ok: false; diagnostics: ComprehensivePlanDiagnostics };
