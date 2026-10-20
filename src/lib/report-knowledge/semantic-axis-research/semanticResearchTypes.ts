/** Offline research contracts. No producers, selectors, scores or runtime adapters. */
import type { BipolarAxis, SemanticAxis, InterpretationContext } from "../../interpretation-v4/semanticCore";
import type { Domain, SemanticTag } from "../../interpretation-v4/types";
export type ResearchState = "repository_definition_checked" | "conditional_semantic_candidate" | "modern_application_candidate" | "source_insufficient" | "conditions_insufficient" | "rejected" | "follow_up_required";
export type Isolation = { connectedToRuntime: false; approvedForCustomer: false; existingScoreContribution: false; runtimeEvidenceIds: readonly [] };
export type ResearchRecord = Isolation & { id: string; review: ResearchState; sourceRefs: readonly string[]; sourceStatus: "repository_checked_not_empirical" | "primary_reference_checked" | "unverified" };
export type AxisResearch = ResearchRecord & {
  axis: SemanticAxis; kind: "bipolar" | "strength"; definition: string; existingDefinition: string; definitionRelation: "conditional_decomposition_not_replacement"; parent: "existing_semantic_axis";
  facets: readonly string[]; relatedAxes: readonly SemanticAxis[]; distinguishAxis: SemanticAxis;
  distinction: string; behavior: string; positive: string; risk: string; weakSignalLimit: string;
  twist: string; environment: string; coexist: { axis: SemanticAxis; condition: string };
  tension: { axis: SemanticAxis; condition: string }; counterexample: string; fictionalScene: string;
  prohibitedClaim: string; applicabilityRef: string; limits: readonly string[];
};
export type FacetResearch = ResearchRecord & {
  axis: SemanticAxis; parent: string; definition: string; positive: string; risk: string;
  condition: string; distinguishAxis: SemanticAxis; twistRef: string; counterexampleRef: string;
  applicabilityRef: string; applicabilityMode: "parent_questions_intersect_own_condition";
  observationPrompt: string; notIndependentEvidence: true;
};
export type DirectionResearch = ResearchRecord & {
  axis: BipolarAxis; direction: -1 | 1; label: string; definition: string; positive: string;
  risk: string; environment: string; contrast: string; defectInferenceAllowed: false;
};
export type SignalResearch = ResearchRecord & { state: "supported" | "weak" | "absent" | "contrary_observed" | "unresolved"; meaning: string; permitted: string; forbidden: string };
export type TagResearch = ResearchRecord & {
  tag: SemanticTag; relatedAxes: readonly SemanticAxis[];
  relation: "RELATED_CONDITIONAL" | "ONE_TO_MANY" | "NOT_EQUIVALENT" | "NO_TRAIT_INFERENCE";
  commonMeaning: string; difference: string; preservationRequirement: string;
  existingMaterials: readonly string[]; existingDomains: readonly Domain[];
  existingFusionRuleIds: readonly string[]; existingMbtiTraits: readonly { type: string; area: string; traitId: string }[];
  exactEquivalenceApproved: false;
};
export type ThemeResearch = ResearchRecord & { theme: string; axes: readonly SemanticAxis[]; definition: string; adjacentTheme: string; distinction: string; compressionRisk: string; preserve: string; overlappingAxisIds: readonly SemanticAxis[] };
export type ContextDomainResearch = ResearchRecord & { context: InterpretationContext; domain: Domain; relation: "direct_scope" | "partial_scope" | "conditions_required" | "additional_context" | "not_transferable"; reason: string; requirements: readonly string[] };
export type ApplicabilityResearch = ResearchRecord & {
  axis: SemanticAxis;
  products: Readonly<Record<"comprehensive" | "career" | "love" | "compatibility" | "major_fortune" | "annual_fortune", { question: string; gateRef: string }>>;
  relationships: Readonly<Record<"love" | "marriage" | "parentChild" | "coworker" | "managerReport" | "businessPartner" | "friendship", { question: string; gateRef: string }>>;
  suitability: "conditional_question_candidate_only"; scope: "not_product_or_category_database";
};
export type CompositeResearch = ResearchRecord & { axes: readonly SemanticAxis[]; definition: string; positive: string; condition: string; forbidden: string; counterexample: string; notNewAxis: true; notIndependentEvidence: true };
export type NewAxisCandidate = ResearchRecord & { name: string; definition: string; relatedAxes: readonly SemanticAxis[]; distinction: string; independenceReason: string; substitutionLimit: string; domains: readonly Domain[]; overlapRisk: string; verificationRequired: readonly string[]; disposition: "research_only_no_scoring" };
export type AuditFinding = ResearchRecord & { topic: string; refs: readonly string[]; difference: string; loss: string; requirement: string; currentDefectConfirmed: boolean };
