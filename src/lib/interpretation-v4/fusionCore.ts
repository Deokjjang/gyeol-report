import type { InterpretationContext, SemanticAxis, SemanticSignature } from "./semanticCore";
import type { MbtiSourceDomain } from "./mbtiSemanticCore";

/** Internal editorial support, NOT probabilities, chart strength or final claims. */
export const GYEOL_FUSION_ENGINE_VERSION = "myeongli-mbti-fusion-13d-2b-v1" as const;
export const FUSION_TYPES = ["REINFORCE", "TENSION", "COMPLEMENT"] as const;
export type FusionType = typeof FUSION_TYPES[number];
export type FusionSideStrength = "NONE" | "SUPPORT" | "MAIN" | "STRONG";
export type FusionStrength = "SUPPORT" | "MAIN" | "SIGNATURE";
export type FusionScope = "general" | Exclude<InterpretationContext, "identity">;
export type AxisRequirement = { axis: SemanticAxis; direction: 1 | -1 };
export const FUSION_CONDITION_SPLITS = ["BEFORE_AFTER_DECISION", "OUTER_INNER", "WORK_PRIVATE", "STRANGER_CLOSE", "NORMAL_STRESS",
  "IDEA_EXECUTION", "START_MAINTAIN", "SHORT_LONG_TERM", "HEAD_HEART", "DESIRE_BEHAVIOR"] as const;
export type FusionSplitType = typeof FUSION_CONDITION_SPLITS[number];
export type FusionConditionSplit = {
  resolved: boolean; type?: FusionSplitType; rationale: string;
  myeongliEvidenceIds: string[]; mbtiSourceNodeIds: string[];
  sides?: { myeongli: string; mbti: string };
  /** A supported conditional reading, never a claim about observed history. */
  status: "CONDITIONAL_HYPOTHESIS" | "UNRESOLVED";
};
export type FusionProof = {
  id: string; axis: SemanticAxis; value: number; contexts: InterpretationContext[];
  family: string; domain?: MbtiSourceDomain; quality: string; confidence?: number;
};
export type FusionSide = {
  system: "myeongli" | "mbti"; axis: SemanticAxis; direction: 1 | -1; scope: FusionScope;
  band: FusionSideStrength; axisRank: number; score: number; priorScore: number;
  evidenceIds: string[]; candidateIds: string[]; annotationIds: string[]; priorEvidenceIds: string[];
  families: string[]; domains: MbtiSourceDomain[]; proofs: FusionProof[];
  exactEvidenceIds: string[]; amplifierOnly: boolean; priorHeavy: boolean;
};
export type FusionRankingFactors = {
  sideStrengthBase: number; contextFit: number; diversityFactor: number; sourceQualityFactor: number;
  specificityFactor: number; duplicationPenalty: number; priorDependencyPenalty: number; amplifierOnlyPenalty: number;
};
export type FusionCandidate = {
  id: string; type: FusionType; semanticTheme: string; primaryAxes: SemanticAxis[];
  contexts: InterpretationContext[]; primaryContext: InterpretationContext; compatibleContexts: InterpretationContext[];
  strength: FusionStrength; sourceDescription: string; ruleId?: string;
  myeongli: { axisScores: SemanticSignature; evidenceIds: string[]; independentFamilies: string[]; candidateIds: string[]; side: FusionSide };
  mbti: { axisScores: SemanticSignature; sourceNodeIds: string[]; sourceDomains: MbtiSourceDomain[];
    actualSourceEvidenceIds: string[]; priorEvidenceIds: string[]; side: FusionSide };
  contextFit: number; evidenceDiversity: number; conditionSplit?: FusionConditionSplit;
  priorHeavy: boolean; amplifierOnly: boolean; relatedCandidateIds: string[];
  duplicateGroupId?: string; semanticOverlapScore: number;
  rankingScore: number; rankingFactors: FusionRankingFactors;
  metadata: { relationship: "CORRESPONDENCE" | "CONTRAST" | "SYNTHESIS"; promotion: "CANDIDATE_ONLY"; causation: false };
};
export type FusionIssue = { code: string; refs: string[]; detail?: string };
export type FusionDiagnostics = {
  reinforceCount: number; tensionCount: number; complementCount: number;
  signatureCount: number; mainCount: number; supportCount: number;
  priorOnlySuppressed: FusionIssue[]; priorHeavyCandidates: string[]; amplifierOnlyLimited: string[];
  unresolvedTensions: string[]; contextRejected: FusionIssue[];
  duplicateGroups: { id: string; candidateIds: string[] }[]; bridgeHintIgnored: true;
  warnings: FusionIssue[]; hardErrors: FusionIssue[];
};
export type FusionDebugCandidate = Pick<FusionCandidate, "id" | "type" | "strength" | "primaryAxes" | "sourceDescription" | "contextFit" | "evidenceDiversity" | "conditionSplit" | "rankingScore"> & {
  myeongli: FusionCandidate["myeongli"]; mbti: FusionCandidate["mbti"];
};
export type MyeongliMbtiFusionProfile = {
  version: typeof GYEOL_FUSION_ENGINE_VERSION; registryVersion: string;
  reinforce: FusionCandidate[]; tensions: FusionCandidate[]; complements: FusionCandidate[];
  topCandidates: FusionCandidate[]; byContext: Partial<Record<InterpretationContext, FusionCandidate[]>>;
  diagnostics: FusionDiagnostics;
  debug: { topReinforce: FusionDebugCandidate[]; topTensions: FusionDebugCandidate[]; topComplements: FusionDebugCandidate[];
    byContext: Partial<Record<InterpretationContext, string[]>>; priorHeavy: string[]; suppressedPriorOnly: FusionIssue[];
    duplicateGroups: FusionDiagnostics["duplicateGroups"]; diagnostics: FusionDiagnostics };
};
export type FusionResult = { ok: true; value: MyeongliMbtiFusionProfile } | { ok: false; diagnostics: FusionDiagnostics };
export const fusionOrder = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
export const fusionUnique = <T extends string>(values: readonly T[]): T[] => [...new Set(values)].sort(fusionOrder);
export const BAND_ORDER = { NONE: 0, SUPPORT: 1, MAIN: 2, STRONG: 3 } as const;
export const FUSION_RANK_POLICY = {
  sideBase: { NONE: [0, 0, 0, 0], SUPPORT: [0, .5, .65, .65], MAIN: [0, .65, .8, .9], STRONG: [0, .65, .9, 1] },
  myeongliDiversity: [1, 1.15, 1.3, 1.4], mbtiDiversity: [1, 1.1, 1.2], diversityCap: 1.3,
  sourceQuality: [0, .8, .95, 1], specificity: { REINFORCE: 1, TENSION: 1.15, COMPLEMENT: 1.1 },
  duplicateThreshold: .7, duplicatePenalty: .1, priorPenalty: .1, amplifierPenalty: .25, topLimit: 12,
} as const;
