/** Proposal only: these types are not implemented, imported or accepted by any runtime API. */
import type { SemanticAxis, InterpretationContext } from "../../interpretation-v4/semanticCore";
import type { Domain } from "../../interpretation-v4/types";
export type ResearchId = `sar:${string}`;
// Separate nominal identity; a sar ID cannot be a calculation ID by string conversion.
declare const calculatedEvidenceBrand: unique symbol;
export type CalculatedEvidenceId = string & { readonly [calculatedEvidenceBrand]: "existing_producer_verified" };
export type BindingFailure = "UNVERIFIED_SOURCE" | "UNSUPPORTED_PRODUCER" | "MISSING_OWNER" | "DIRECTION_MISMATCH" | "TIME_SCOPE_MISMATCH" | "MISSING_CONDITION" | "COUNTEREXAMPLE" | "DUPLICATE_FACT" | "REFERENCE_ONLY" | "ABSENCE_IS_NOT_OPPOSITE" | "UNAPPROVED_RESEARCH" | "BOOK_VERSION_MISMATCH";
export type TemporalScope =
  | { kind: "natal"; immutableBirthRecordDigest: string }
  | { kind: "major" | "annual" | "monthly"; startInclusiveIso: string; endExclusiveIso: string; timezone: "Asia/Seoul"; producerVersion: string; transitionEvidenceIds: readonly CalculatedEvidenceId[] };
export type OwnershipScope = { owner: "person" | "personA" | "personB"; counterpart?: "personA" | "personB"; direction?: "A_TO_B" | "B_TO_A"; relationCategory?: "love" | "marriage" | "parentChild" | "coworker" | "managerReport" | "businessPartner" | "friendship" };
export type ProposedEvidenceEnvelope = {
  evidenceId: CalculatedEvidenceId; producer: string; producerVersion: string;
  sourceIds: readonly string[]; sourceVersion: string; sourceDigest: string;
  directSourceCoverage: boolean; empiricalValidation: "not_claimed" | "separately_verified";
  ownership: OwnershipScope; time: TemporalScope;
  // Original participant roles and observed calculation facts must survive projection.
  participants: readonly { origin: "natal" | "major" | "annual" | "monthly"; pillar: string; symbol: string; owner: OwnershipScope["owner"] }[];
  canonicalFactKey: string; prerequisiteStatus: "satisfied" | "missing" | "contradictory";
};
export type ProposedSemanticCandidate = {
  researchId: ResearchId; facetId?: ResearchId; axes: readonly SemanticAxis[];
  evidence: readonly ProposedEvidenceEnvelope[]; contexts: readonly InterpretationContext[];
  applicationConditions: readonly { id: string; status: "satisfied" | "missing" | "contradictory"; evidenceIds: readonly CalculatedEvidenceId[] }[];
  interpretationStatus: "withheld" | "conditionally_reviewed"; independentFactKeys: readonly string[];
  approvedForCustomer: false; connectedToRuntime: false;
};
export type ProposedParagraphAssignment = {
  candidate: ProposedSemanticCandidate; productVersion: string; domain: Domain;
  sectionId: string; blockId: string; preservedSourceIds: readonly string[];
  allocatedCanonicalFacts: readonly string[]; languageReview: "pending" | "reviewed";
  originalBookDigest: string; newEditionDigest?: string;
};
