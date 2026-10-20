import type { SajuFoundationDomain } from "../sajuFoundationKnowledgeTypes";
import type { EarthlyBranch, HeavenlyStem, TenGod, FiveElement } from "../../saju/types";

/** Research only. Source checking never establishes predictive validity. */
export type DeepSourceRef = { readonly sourceId: string; readonly locator: string; readonly proposition: string };
export type DeepMaterial = {
  readonly id: string; readonly targetId: string; readonly domain: SajuFoundationDomain;
  readonly readerQuestion: string; readonly coreMeaning: string; readonly positive: string; readonly caution: string;
  readonly differentiation: string; readonly prerequisites: readonly string[];
  readonly evidenceLevel: "modern_conditional_candidate" | "research_requirements_only";
  readonly review: "editorial_reviewed_not_validated" | "unverified_application_after_premise_review";
  readonly sourceRefs: readonly DeepSourceRef[]; readonly followUp: readonly string[];
};
export type DeepStoredStem = { readonly stem: HeavenlyStem; readonly role: "MAIN" | "SUB" | "MINOR"; readonly weight: number };
export type DeepDayPillar = {
  readonly id: string; readonly targetId: string; readonly label: string;
  readonly stem: HeavenlyStem; readonly branch: EarthlyBranch;
  readonly stored: readonly (DeepStoredStem & { readonly tenGod: TenGod })[];
  readonly coreMeaning: string; readonly strengthMeaning: string; readonly overuseCondition: string;
  /** Inherited text is retained by reference and is not counted as a new meaning. */
  readonly inheritedMeaningRef: string;
  readonly contrasts: readonly { readonly kind: "same_stem" | "same_branch"; readonly otherTargetId: string; readonly meaning: string }[];
  readonly applicationIds: readonly string[];
  readonly evidenceLevel: "repository_structure_with_conditional_applications";
  readonly review: "all_eight_domains_reviewed";
  readonly sourceRefs: readonly DeepSourceRef[]; readonly followUp: readonly string[];
};
export type DeepTenGod = {
  readonly id: string; readonly targetId: string; readonly label: string;
  readonly definition: string; readonly contrastTargetId: string; readonly differentiation: string;
  readonly prerequisites: readonly string[]; readonly strengthConditions: readonly string[];
  readonly applicationIds: readonly string[]; readonly sourceRefs: readonly DeepSourceRef[]; readonly followUp: readonly string[];
};
export type DeepPosition = {
  readonly id: string; readonly targetId: string; readonly position: "year" | "month" | "day" | "hour";
  readonly wasUnverified: boolean;
  readonly review: "limited_passage_checked" | "unverified_after_search" | "inherited_conditional_passage";
  readonly meaning: string; readonly condition: string; readonly sourceRefs: readonly DeepSourceRef[]; readonly followUp: readonly string[];
};
export type DeepMarker = {
  readonly id: string; readonly targetId: string; readonly label: string; readonly previousReview: string;
  readonly nameInSource: string | null;
  readonly sourceStatus: "printed_formation_checked" | "homonym_context_separated" | "modern_rule_observed" | "modern_name_observed" | "academic_name_observed" | "inherited_passage_rechecked";
  readonly formation: string; readonly lineageDifference: string;
  readonly traditionalMeaning: string; readonly positiveCandidate: string; readonly caution: string;
  readonly differentiation: readonly string[];
  readonly interpretationReview: "not_newly_validated";
  readonly modernApplicationReview: "conditional_candidate_or_withheld";
  readonly forbiddenClaims: readonly string[]; readonly sourceRefs: readonly DeepSourceRef[]; readonly followUp: readonly string[];
};
export type DeepHiddenStem = {
  readonly id: string; readonly targetId: string; readonly stored: readonly DeepStoredStem[];
  readonly elementComposition: readonly FiveElement[];
  readonly roleTerminology: string; readonly weightMeaning: string; readonly seasonalDistinction: readonly string[];
  readonly positionalLimits: readonly string[]; readonly manifestationConditions: readonly string[];
  readonly requirementIds: readonly string[]; readonly sourceRefs: readonly DeepSourceRef[];
  readonly review: "all_eight_premises_reviewed_not_filled";
};
export type DeepCollation = {
  readonly id: string; readonly targetId: string; readonly issue: string;
  readonly review: "open_after_additional_source_search"; readonly finding: string;
  readonly checkedSources: readonly DeepSourceRef[]; readonly followUp: readonly string[];
};
export type DeepSource = {
  readonly id: string; readonly title: string; readonly author: string | null; readonly publication: string | null;
  readonly edition: string; readonly location: string; readonly checkedAt: string;
  readonly access: "public_transcription_read" | "academic_abstract_read" | "modern_provider_rule_read" | "modern_author_rule_read" | "provider_manual_pages_read" | "scan_pages_read" | "repository_read" | "authored_candidate";
  readonly contentSha256: string; readonly sections: readonly string[]; readonly supports: string; readonly limitations: readonly string[];
};
