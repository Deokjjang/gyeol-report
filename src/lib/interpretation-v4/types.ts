import type { Evidence } from "../interpretation-v3/types";
import type { MbtiSourceType, MbtiTraitArea } from "../report-knowledge/mbti/sourceRuntimeAdapter";
import type { StructureCandidate } from "./structureTypes";

export const V4_DOMAINS = ["identity", "strengths", "weaknesses", "work", "money", "study", "love", "marriage", "relationships", "success/fortune"] as const;
export type Domain = (typeof V4_DOMAINS)[number];
export type FusionKind = "overlap" | "contrast" | "complement";
export type EvidenceStatus = "confirmed/calculated" | "derived-but-supported" | "db-only" | "ambiguous/conflicted" | "unsupported";
/** Editorial support, never a new classical strength calculation or customer score. */
export type Strength = "strong" | "supporting" | "weak" | "none";
export type Confidence = "supported" | "derived";
export type SemanticTag = "precision" | "decisive-correction" | "leadership" | "status" | "wealth" | "accumulation" | "help" | "first-attraction" | "intimate-attraction" | "mobility" | "solitude" | "inquiry" | "expression" | "expression-gap" | "autonomy" | "consistency" | "learning" | "sociability" | "reserved-affection" | "experimentation" | "experience-spending" | "practical-learning";
export type Observation = Pick<Evidence, "id" | "subject" | "scope" | "period" | "certainty" | "sourceRefs" | "lineage"> & {
  readonly feature: string;
  readonly method: "canonical-calculation" | "canonical-marker" | "supported-derivation" | "weighted-output-gap" | "v4-structure" | "supplied";
  readonly substantial: boolean;
  readonly completeChart: boolean;
  readonly weight?: number;
  readonly structure?: StructureCandidate;
};
export type EvidenceDecision = {
  readonly evidence: Observation;
  readonly status: EvidenceStatus;
  readonly strength: Strength;
  readonly usable: boolean;
  readonly reasons: readonly string[];
};
export type Material = {
  readonly feature: string;
  readonly label: string;
  readonly semanticTags: readonly SemanticTag[];
  readonly positiveMeaning: string;
  readonly shadowMeaning: string;
  readonly imagery: string;
  readonly domains: readonly Domain[];
  /** Unbound registry entries have none; only evaluated observations supply strength. */
  readonly evidenceStrength: Strength;
  readonly sourceRefs: readonly string[];
};
export type MbtiEvidence = {
  readonly type: MbtiSourceType;
  readonly area: MbtiTraitArea;
  readonly traitId: string;
  readonly meaning: string;
  readonly semanticTag: SemanticTag;
  readonly sourceCoverage: "direct" | "inferred";
  readonly provenance: "direct" | "derived";
  readonly sourceRefs: readonly string[];
};
export type FusionRule = {
  readonly id: string;
  readonly type: MbtiSourceType;
  readonly kind: FusionKind;
  readonly features: readonly string[];
  readonly myeongliTag: SemanticTag;
  readonly trait: readonly [MbtiTraitArea, string, SemanticTag];
  readonly domains: readonly Domain[];
  readonly sharedTheme: string;
  readonly insightSeed: string;
};
export type FusionInterpretation = {
  readonly ruleId: string;
  readonly domain: Domain;
  readonly kind: FusionKind;
  readonly myeongliEvidence: readonly EvidenceDecision[];
  readonly mbtiEvidence: MbtiEvidence;
  readonly sharedTheme: string;
  readonly insightSeed: string;
  readonly strength: "strong" | "supporting";
  readonly confidence: Confidence;
  readonly provenanceRefs: readonly string[];
};
export type FortuneTheme = "wealth" | "status/honor" | "leadership" | "helpers/people-luck" | "charm" | "accumulation" | "learning" | "expression" | "mobility/opportunity";
export type FortuneRule = {
  readonly id: string;
  readonly theme: FortuneTheme;
  readonly allOf: readonly (readonly string[])[];
  readonly seed: string;
};
export type FortuneComposite = {
  readonly ruleId: string;
  readonly theme: FortuneTheme;
  readonly supportingEvidence: readonly EvidenceDecision[];
  readonly strength: "strong";
  readonly directCopySeed: string;
  readonly provenanceRefs: readonly string[];
};
export type Suppression = { readonly id: string; readonly reasons: readonly string[] };
