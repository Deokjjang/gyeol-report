import type { MbtiType } from "../mbtiKnowledgeTypes";

export type MbtiPairSourceRef = {
  readonly file: string;
  readonly pointer: string;
  readonly sha256: string;
  readonly label: string;
  readonly sourceRelationName: string;
  readonly sourceCoverage: "direct" | "inferred";
};
export type MbtiPairTraitRef = {
  readonly type: MbtiType;
  readonly domain: string;
  readonly traitId: string;
  readonly file: string;
  readonly pointer: string;
  readonly sourceCoverage: "direct" | "inferred";
  readonly plainKoSha256: string;
};
/** Offline research only. A source-local label is not empirical verification. */
export type MbtiPairResearch = {
  readonly id: string;
  readonly sourceType: MbtiType;
  readonly targetType: MbtiType;
  readonly jointReviewId: string;
  readonly sourceRecord: MbtiPairSourceRef;
  readonly reverseSourceRecord: MbtiPairSourceRef | null;
  readonly reverseSourceStatus: "present" | "missing_do_not_invent";
  readonly sourceTraitRefs: readonly MbtiPairTraitRef[];
  readonly targetTraitRefs: readonly MbtiPairTraitRef[];
  readonly basisDomains: readonly string[];
  readonly provenance: "two_trait_conditional_comparison";
  readonly existingSourceStatus: "source_local_direct" | "source_local_inferred";
  readonly sharedGround: string;
  readonly difference: string;
  readonly directionalContribution: string;
  readonly targetContribution: string;
  readonly friction: {
    readonly condition: string;
    readonly sourceIntentionCandidate: string;
    readonly targetMayMisreadSource: string;
    readonly targetIntentionCandidate: string;
    readonly sourceMayMisreadTarget: string;
  };
  readonly repair: {
    readonly sourceQuestion: string;
    readonly targetQuestion: string;
    readonly jointAgreement: string;
    readonly timingLimit: string;
  };
  readonly twist: string;
  readonly fictionalScenes: readonly { readonly id: string; readonly kind: "fictional_not_user_history"; readonly text: string }[];
  readonly categoryApplicability: readonly {
    readonly category: "love" | "marriage" | "parent_child" | "coworkers" | "manager_team" | "business" | "friends";
    readonly scope: "basic_interaction_candidate_only";
    readonly gate: string;
  }[];
  readonly counterexample: string;
  readonly applicationGate: string;
  readonly disallowedClaims: readonly string[];
  readonly relationNameReview: {
    readonly termFamily: string | null;
    readonly system: string;
    readonly reasonClasses: readonly string[];
    readonly mappingStatus: "not_established";
    readonly approvedForCustomer: false;
  };
  readonly conflictStatus: "source_meaning_preserved_new_conditions_not_empirically_verified";
  readonly sourceRefs: readonly string[];
  readonly verification: "editorially_reviewed_conditional_not_empirical";
  readonly connectedToRuntime: false;
  readonly approvedForCustomer: false;
};
