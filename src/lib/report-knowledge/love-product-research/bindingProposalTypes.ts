/** Future review shape only. No resolver, bindings or generated evidence. */
import type { Address, RoleAddress, ResearchId, CalculatedEvidenceId } from "./researchTypes";
import type { RelationshipStatus } from "../../report-generation/reportInputTypes";
export type ExistingProducerReference = {
  readonly id: CalculatedEvidenceId;
  readonly owner: "self";
  readonly scope: "natal" | "own_mbti_trait" | "registered_individual_fusion";
  readonly actualProducer: string;
  readonly originalSourceRef: string;
  readonly conditionsChecked: readonly string[];
};
export type LoveBindingReviewProposal = {
  readonly researchId: ResearchId;
  readonly address: Address;
  readonly role: RoleAddress;
  readonly relationshipStatus: RelationshipStatus;
  readonly reviewStatus: "unbound" | "withheld" | "requires_independent_review";
  readonly actualEvidenceToReview: readonly ExistingProducerReference[];
  readonly partnerFactsAvailable: boolean;
  readonly childFactsAvailable: boolean;
  readonly introducedMeaningRefs: readonly ResearchId[];
  readonly sourceOwnerChecked: boolean;
  readonly domainAndContextChecked: boolean;
  readonly sourceCoveragePreserved: boolean;
  readonly oppositeConditionsChecked: boolean;
  readonly unknownTimeChecked: boolean;
  readonly recipientConsentKnown: boolean;
  readonly approvedForCustomer: false;
  readonly connectedToRuntime: false;
};
