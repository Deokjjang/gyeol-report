import type { InterpretationContext, SemanticAxis } from "./semanticCore";
import type { ClaimCondition, ClaimLevel } from "./claimCore";
import type { FusionConditionSplit, FusionIssue, FusionSplitType, FusionStrength } from "./fusionCore";
import type { HumanDescriptionQuality, HumanDescriptionType } from "./humanDescription";

export const GYEOL_PERSONAL_RESONANCE_VERSION = "personal-resonance-13d-3b-v1" as const;
export const PERSONAL_RESONANCE_REGISTRY_VERSION = "personal-resonance-96-v1" as const;
export const GYEOL_CORE_GYEOL_VERSION = "core-gyeol-13d-3b-v1" as const;
export const CORE_GYEOL_GRAMMARS = ["A_AND_B", "A_BUT_B", "OUTER_INNER", "A_TO_B", "DUAL_VALUE", "STRENGTH_SHADOW", "BEST_UNDER_PRESSURE", "TWO_NEEDS"] as const;
export type CoreGyeolGrammar = typeof CORE_GYEOL_GRAMMARS[number];
export const RESONANCE_RISKS = ["PRESSURE", "CALM_PRESSURE", "FINISH_DROP", "OVER_EXPLAIN", "UNSPOKEN_EXPECTATION", "RUMINATION", "OVERCONTROL", "REST_GUILT", "OVERLOAD", "MEANING_OVER_MONEY", "MONEY_OVER_MEANING", "PUBLIC_PERSISTENCE"] as const;
export type ResonanceRisk = typeof RESONANCE_RISKS[number];
export type ResonanceCondition =
  | { kind: "existing"; condition: ClaimCondition }
  | { kind: "claim"; id: string; minLevel: ClaimLevel }
  | { kind: "fusion"; ruleId?: string; theme?: string; split?: FusionSplitType }
  | { kind: "risk"; risk: ResonanceRisk }
  | { kind: "limited"; axis: SemanticAxis }
  | { kind: "all" | "any"; conditions: ResonanceCondition[] };
export type ResonanceDefinition = {
  id: string; descriptionType: HumanDescriptionType; semanticTheme: string; semanticGroup: string;
  contexts: InterpretationContext[]; primaryAxes: SemanticAxis[]; required: ResonanceCondition;
  optionalSupport: ResonanceCondition[]; forbiddenConditions: ResonanceCondition[];
  humanDescription: string; alternatives: { when: ResonanceCondition; text: string }[];
  positiveMeaning?: string; shadowMeaning?: string; quality: HumanDescriptionQuality;
  specificityBase: number; emotionalImpactBase: number; priority: number; exclusivityGroup: string;
  polarity: "positive" | "neutral" | "shadow"; arcTheme?: string;
};
export type ResonanceEvidence = { myeongliEvidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionCandidateIds: string[]; claimIds: string[] };
export type ResonanceGate = ResonanceEvidence & { passed: boolean; key: string };
export type PersonalResonanceCandidate = {
  id: string; ruleId: string; descriptionType: HumanDescriptionType; semanticTheme: string; semanticGroup: string;
  contexts: InterpretationContext[]; humanDescription: string; positiveMeaning?: string; shadowMeaning?: string;
  source: "MYEONGLI" | "FUSION" | "CLAIM" | "MIXED"; evidence: ResonanceEvidence; primaryAxes: SemanticAxis[];
  conditionSplit?: FusionConditionSplit; evidenceStrength: number; familyDiversity: number; specificity: number;
  contradictionValue: number; fusionValue: number; humanRelevance: number; emotionalImpact: number; genericness: number;
  rankingScore: number; rank: FusionStrength; relatedCandidateIds: string[]; conflictGroupId?: string; duplicateGroupId?: string;
  diagnostics: { independentFamilies: string[]; mbtiDomains: string[]; independentCount: number; amplifierOnly: boolean;
    unresolvedContradiction: boolean; unsupportedSpecificity: boolean; quality: HumanDescriptionQuality;
    duplicatePenalty: number; genericnessPenalty: number; conflictPenalty: number; gates: ResonanceGate[] };
};
export type CandidateGroup = { id: string; candidateIds: string[] };
export type ConflictGroup = CandidateGroup & { resolvedBy: string[] };
export type TraitArc = {
  id: string; semanticTheme: string; humanDescription: string; strengthDescription: string; shadowDescription?: string;
  sourceResonanceIds: string[]; sourceClaimIds: string[]; sourceFusionIds: string[]; evidenceIds: string[];
  primaryAxes: SemanticAxis[]; contexts: InterpretationContext[]; strengthRank: FusionStrength;
  futureGuidanceTheme?: string; relatedArcIds: string[];
  provenance: { strength: ResonanceEvidence; shadow?: ResonanceEvidence };
};
export type CoreGyeolCandidate = {
  id: string; grammar: CoreGyeolGrammar; primaryTheme: string; secondaryTheme?: string; contrastTheme?: string;
  sourceResonanceIds: string[]; sourceFusionIds: string[]; sourceClaimIds: string[]; evidenceIds: string[];
  humanDescription: string; evidenceConfidence: number; personalSpecificity: number; evidenceDiversity: number;
  identitySalience: number; fusionValue: number; emotionalImpact: number; memorability: number; genericness: number;
  score: number; diagnostics: { qualityQuestions: boolean[]; qualityPassed: number; warnings: string[]; eligibleBest: boolean; concepts: string[] };
};
export type PersonalResonanceDiagnostics = {
  totalCandidates: number; signatureCount: number; mainCount: number; supportCount: number; genericCandidateCount: number;
  unsupportedSpecificityRejected: string[]; suppressedRuleIds: string[]; duplicateGroups: CandidateGroup[]; conflictGroups: ConflictGroup[];
  mbtiIndependentCandidateCount: number; fusionDrivenCandidateCount: number; coreGyeolCandidateCount: number;
  coreGyeolQualityWarnings: string[]; traitArcCount: number; warnings: FusionIssue[]; hardErrors: FusionIssue[];
  emotionalMix: Record<"positive" | "neutral" | "shadow", number>;
};
export type PersonalResonanceProfile = {
  version: typeof GYEOL_PERSONAL_RESONANCE_VERSION; registryVersion: typeof PERSONAL_RESONANCE_REGISTRY_VERSION;
  coreGyeolVersion: typeof GYEOL_CORE_GYEOL_VERSION; candidates: PersonalResonanceCandidate[];
  signature: PersonalResonanceCandidate[]; main: PersonalResonanceCandidate[]; support: PersonalResonanceCandidate[];
  byContext: Partial<Record<InterpretationContext, string[]>>; byDescriptionType: Partial<Record<HumanDescriptionType, string[]>>;
  duplicateGroups: CandidateGroup[]; conflictGroups: ConflictGroup[]; traitArcs: TraitArc[];
  coreGyeolCandidates: CoreGyeolCandidate[]; bestCoreGyeol?: CoreGyeolCandidate; diagnostics: PersonalResonanceDiagnostics;
  debug: { topSignatureResonance: PersonalResonanceCandidate[]; topMainResonance: PersonalResonanceCandidate[];
    byContext: PersonalResonanceProfile["byContext"]; byDescriptionType: PersonalResonanceProfile["byDescriptionType"];
    duplicateGroups: CandidateGroup[]; conflictGroups: ConflictGroup[]; traitArcs: TraitArc[]; coreGyeolCandidates: CoreGyeolCandidate[];
    bestCoreGyeol?: CoreGyeolCandidate; mbtiIndependentCount: number; fusionDrivenCount: number; diagnostics: PersonalResonanceDiagnostics };
};
export type PersonalResonanceResult = { ok: true; value: PersonalResonanceProfile } | { ok: false; diagnostics: PersonalResonanceDiagnostics };
