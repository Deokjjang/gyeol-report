import type { InterpretationContext, SemanticAxis, FortuneTag, DynamicTag } from "./semanticCore";
import type { TenGodFamily } from "./foundationTenGods";
import type { FusionSideStrength, FusionCandidate, FusionSide, FusionIssue } from "./fusionCore";

/** Candidate foundation only: not imported by a writer, packet or customer route. */
export const GYEOL_CLAIM_ENGINE_VERSION = "claim-intelligence-13d-3a-v1" as const;
export const CLAIM_REGISTRY_VERSION = "claim-registry-41-v1" as const;
export const CLAIM_LEVELS = [0, 1, 2, 3, 4] as const;
export type ClaimLevel = typeof CLAIM_LEVELS[number];
export const CLAIM_CATEGORIES = ["IDENTITY", "STRENGTH", "MONEY_STYLE", "MONEY_FORTUNE", "LEADERSHIP", "HONOR", "HIGH_POSITION", "SUCCESS", "EXPERTISE", "BUSINESS", "PEOPLE_LUCK", "CHARM", "FACT_BOMB"] as const;
export type ClaimCategory = typeof CLAIM_CATEGORIES[number];
export type AxisBandRequirement = { axis: SemanticAxis; band: Exclude<FusionSideStrength, "NONE">; direction: 1 | -1 };
export type ClaimCondition =
  | { kind: "axis"; requirement: AxisBandRequirement }
  | { kind: "family"; family: TenGodFamily; band: "SUPPORT" | "MAIN" }
  | { kind: "fortune"; tag: FortuneTag }
  | { kind: "dynamic"; tag: DynamicTag }
  | { kind: "source"; key: string }
  | { kind: "synthesis"; theme: string }
  | { kind: "fusion"; ruleId: string }
  | { kind: "helperCompanion" }
  | { kind: "delay" }
  | { kind: "any" | "all"; conditions: ClaimCondition[] };
export type ClaimDefinition = {
  id: string; category: ClaimCategory; semanticTheme: string; contexts: InterpretationContext[];
  requiredAxes: AxisBandRequirement[]; requiredConditions: ClaimCondition[];
  preferredFusionIds: string[]; minimumIndependentMyeongliFamilies: number;
  minLevel: ClaimLevel; maxLevel: ClaimLevel; fortuneClaim: boolean; factBomb: boolean;
  claimsByLevel: Partial<Record<ClaimLevel, string>>; alternativeLevel3?: string;
  exclusivityGroup: string; priority: number;
};
export type ClaimEvidenceRefs = {
  myeongliEvidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionCandidateIds: string[];
  independentMyeongliFamilies: string[]; myeongliSourceTypes: string[]; mbtiDomains: string[];
};
export type ClaimGateResult = { gate: string; passed: boolean; myeongliEvidenceIds: string[]; mbtiSourceNodeIds: string[]; fusionCandidateIds: string[] };
export type ClaimCandidate = {
  id: string; category: ClaimCategory; level: Exclude<ClaimLevel, 0>; maxAllowedLevel: ClaimLevel;
  semanticTheme: string; customerClaim: string; contexts: InterpretationContext[]; allowedContexts: InterpretationContext[];
  evidence: ClaimEvidenceRefs; evidenceDiversity: number; confidenceBand: "LOW" | "MEDIUM" | "HIGH";
  fortuneClaim: boolean; factBomb: boolean; exclusivityGroup: string; priority: number;
  rankingSupport: { actualMbtiMain: boolean; validFusionMain: boolean; preferredFusionMain: boolean };
  relatedClaimIds: string[]; relatedFusionIds: string[]; conflictGroupId?: string; overlapScore: number;
  diagnostics: { gates: ClaimGateResult[]; warnings: string[]; structuralCompositeIds: string[]; primaryMyeongliGatePassed: boolean };
};
export type ClaimSuppression = { id: string; context: InterpretationContext; level: 0; reasons: string[]; gates: ClaimGateResult[] };
export type ClaimDiagnostics = {
  generatedCount: number; levelCounts: Record<ClaimLevel, number>; fortuneCount: number; factBombCount: number;
  suppressedInsufficientEvidence: string[]; suppressedAmplifierOnly: string[]; suppressedMissingMyeongliGate: string[]; suppressedContradiction: string[];
  conflictGroups: { id: string; claimIds: string[]; fusionIds: string[] }[];
  exclusivityGroups: { id: string; claimIds: string[] }[]; warnings: FusionIssue[]; hardErrors: FusionIssue[];
};
export type ClaimEvidenceView = {
  myeongliAxisBands: FusionSide[]; mbtiAxisBands: FusionSide[]; fusionCandidates: FusionCandidate[];
  tenGodFamilies: Partial<Record<TenGodFamily, { band: FusionSideStrength; evidenceIds: string[] }>>;
  specificTenGodEvidence: Record<string, string[]>; fortuneTags: Partial<Record<FortuneTag, string[]>>;
  dynamicTags: Partial<Record<DynamicTag, string[]>>; synthesisIds: string[]; semanticThemes: string[];
  myeongliEvidenceIds: string[]; mbtiSourceNodeIds: string[]; independentMyeongliFamilies: string[];
  mbtiDomainDiversity: string[]; amplifierOnly: boolean;
};
export type ClaimProfile = {
  version: typeof GYEOL_CLAIM_ENGINE_VERSION; registryVersion: typeof CLAIM_REGISTRY_VERSION;
  candidates: ClaimCandidate[]; diagnostics: ClaimDiagnostics;
  debug: { topClaims: ClaimCandidate[]; byCategory: Partial<Record<ClaimCategory, string[]>>; level4: string[]; fortune: string[]; factBomb: string[];
    suppressed: ClaimSuppression[]; conflicts: ClaimDiagnostics["conflictGroups"]; exclusivity: ClaimDiagnostics["exclusivityGroups"];
    evidenceSummary: ClaimEvidenceView; diagnostics: ClaimDiagnostics };
};
export type ClaimResult = { ok: true; value: ClaimProfile } | { ok: false; diagnostics: ClaimDiagnostics };

export const axis = (axis: SemanticAxis, band: AxisBandRequirement["band"] = "MAIN", direction: 1 | -1 = 1): AxisBandRequirement => ({ axis, band, direction });
export const axisGate = (a: SemanticAxis, band: AxisBandRequirement["band"] = "MAIN", direction: 1 | -1 = 1): ClaimCondition => ({ kind: "axis", requirement: axis(a, band, direction) });
export const fortune = (tag: FortuneTag): ClaimCondition => ({ kind: "fortune", tag });
export const family = (family: TenGodFamily, band: "SUPPORT" | "MAIN" = "MAIN"): ClaimCondition => ({ kind: "family", family, band });
export const synthesis = (theme: string): ClaimCondition => ({ kind: "synthesis", theme });
export const any = (...conditions: ClaimCondition[]): ClaimCondition => ({ kind: "any", conditions });
export const all = (...conditions: ClaimCondition[]): ClaimCondition => ({ kind: "all", conditions });
/** Defaults are editorial contract, not inferred gates or generated copy. */
export function defineClaim(definition: Pick<ClaimDefinition, "id" | "category" | "semanticTheme" | "requiredAxes" | "claimsByLevel" | "exclusivityGroup"> & Partial<ClaimDefinition>): ClaimDefinition {
  return { contexts: ["identity", "work"], requiredConditions: [], preferredFusionIds: [], minimumIndependentMyeongliFamilies: 0,
    minLevel: 2, maxLevel: 3, fortuneClaim: false, factBomb: false, priority: 50, ...definition };
}
