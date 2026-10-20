import type { CatalogKey, KnowledgeSourcePointer, MeaningRelation } from "../types";
import type { KnowledgeCandidate, KnowledgeBindingReceipt, KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductQuestionContract, QuestionMaterialLink } from "../product-specialist-foundation/types";
import type { Material } from "../../comprehensive-product-research/researchTypes";
export const VERSION = "comprehensive-specialist-engine-v1" as const;
export type CandidateState = "DISCOVERED" | "QUESTION_LINKED" | "SOURCE_TRACEABLE" | "ACTUAL_EVIDENCE_MATCHED" | "REQUIRED_CONDITIONS_PARTIAL" | "STRUCTURALLY_MATCHED" | "SEMANTIC_REVIEW_PENDING" | "POLICY_WITHHELD" | "OPERATOR_APPROVAL_PENDING" | "CUSTOMER_APPROVAL_PENDING" | "CUSTOMER_ELIGIBLE" | "NOT_APPLICABLE" | "INVALID_CANDIDATE";
export type ComprehensiveSpecialistCandidate = {
    catalogKey: CatalogKey;
    originalResearchId: string;
    locator: KnowledgeSourcePointer;
    recordHash: string;
    material: Material;
    bindingCandidate: KnowledgeCandidate;
    questionLinks: QuestionMaterialLink[];
    meaning: {
        originalMeaningId: string | null;
        originalClaimId: string | null;
        originalClass: Material["meaningClass"];
        review: "MEANING_RELATION_REVIEW_REQUIRED";
    };
    domain: string[];
    context: string[];
    facets: Material["semanticFacets"];
    actualFacetObservations: "UNSUPPORTED_PRODUCER";
    precedingMeaningRefs: readonly string[];
    sourceReview: string;
    originalReview: Material["review"];
    customerApproved: false;
};
export type MeaningView = {
    id: string;
    roots: string[];
    meaningId: string | null;
    claimId: string | null;
    question: string | null;
    conditions: string[];
    action: string | null;
    context: string[];
    reviewed: boolean;
    recall: boolean;
    actuallyDisplayed: boolean;
};
export type MeaningRelationship = {
    left: string;
    right: string;
    relation: MeaningRelation | "MEANING_RELATION_REVIEW_REQUIRED";
    sameUnderlyingRoots: boolean;
    independentInformation: boolean | null;
    reasons: string[];
};
export type ConflictKind = "SAME_UNDERLYING_FACT" | "SAME_MEANING" | "CONDITIONAL_COMPLEMENT" | "CONDITIONAL_TENSION" | "MUTUALLY_EXCLUSIVE" | "DIFFERENT_APPLICATION" | "REQUIRES_PRIOR_INTRODUCTION" | "SOURCE_REUSE_WITH_DIFFERENT_QUESTION";
export type ConflictEdge = {
    left: string;
    right: string;
    kind: ConflictKind;
    state: "VERIFIED" | "REVIEW_REQUIRED";
    blocksJointPrimary: boolean;
    reasons: string[];
};
export type MaterialDiagnostic = {
    catalogKey: CatalogKey;
    researchId: string;
    states: CandidateState[];
    binderReceipt: KnowledgeBindingReceipt;
    questionFits: {
        questionId: string;
        link: QuestionMaterialLink["kind"];
        originalRoleContribution: string | null;
        declaredMeaning: string;
        requiredMeaning: unknown;
        fit: "DECLARED_LINK_ONLY" | "REFERENCE_ONLY" | "RECALL_REQUIRES_DISPLAY";
        verifiedMeaningFulfillment: false;
    }[];
    roots: string[];
    actualNodes: string[];
    semanticSignals: {
        axis: string;
        value: number;
        kind: "SIGNED_BIPOLAR" | "STRENGTH";
        sourceNode: string;
        context: unknown;
    }[];
    sourceCoverage: unknown[];
    fusion: {
        nodeId: string;
        type: unknown;
        ruleId: unknown;
        split: unknown;
        sameOwnerBothRoots: boolean;
    }[];
    enteredContext: {
        jobStatus: string | null;
        relationshipStatus: string | null;
    };
    unenteredFacts: string[];
    recall: {
        required: boolean;
        actualLedgerPresent: boolean;
        eligible: false;
        reasons: string[];
    };
    meaningReviewRequired: true;
    customerEligible: false;
    customerRank: null;
    selectedForCustomer: false;
};
export type ComprehensiveSpecialistResult = {
    version: typeof VERSION;
    mode: "REAL_RESEARCH_DIAGNOSTICS";
    fixtureId: string;
    product: "saju_mbti_full";
    diagnostics: MaterialDiagnostic[];
    allProductReceipts: KnowledgeBindingReceipt[];
    baselineProductReceipts: KnowledgeBindingReceipt[];
    meaningRelations: MeaningRelationship[];
    conflicts: ConflictEdge[];
    duplicateFactGroups: {
        root: string;
        materialIds: string[];
    }[];
    coverage: {
        questionId: string;
        address: ProductQuestionContract["address"];
        linkedMaterials: number;
        actualWitnessMaterials: number;
        structuralMaterials: number;
        customerEligible: 0;
        unknown: string[];
    }[];
    graphUnchanged: boolean;
    researchUnchanged: boolean;
    errors: string[];
    actualCustomerEligible: 0;
    actualClaimsEmitted: 0;
    customerSelectionRun: false;
    bookChanges: 0;
};
export type RealRun = {
    request: KnowledgeBindingRequest;
    result: ComprehensiveSpecialistResult;
};
export type SyntheticQuestion = {
    id: string;
    requiredMeanings: string[];
    context: string;
    domain: string;
    chapter: string;
};
export type ApprovedSyntheticMeaning = {
    meaningId: string;
    claimId: string;
    reviewId: string;
    requiredMeanings: string[];
    conditions: string[];
    action: string;
    context: string;
    domain: string;
    facet: string;
    polarity: "positive" | "risk" | "twist" | "explanation";
    axis: {
        id: string;
        direction: 1 | -1;
    } | null;
    direct: boolean;
    extraMeanings: string[];
    recallOf: string | null;
    compatiblePriorContexts: string[];
    exclusiveWith: string[];
    verifiedSplitWith: string[];
    verifiedComplementWith: string[];
};
export type SyntheticIntroduction = {
    materialId: string;
    meaningId: string;
    claimId: string;
    owner: string;
    mbtiType: string | null;
    roots: string[];
    nodeIds: string[];
    context: string;
    actuallyDisplayed: true;
    displayRecord: string;
};
export type SyntheticOption = {
    id: string;
    questionId: string;
    receipt: KnowledgeBindingReceipt;
    meaning: ApprovedSyntheticMeaning;
    roots: string[];
    owner: string;
    mbtiType: string | null;
    eligible: boolean;
    reasons: string[];
};
export type SyntheticSession = {
    readonly kind: "SYNTHETIC_ELIGIBLE_SELECTION_TEST";
};
export type SelectionMethod = "FIRST_ELIGIBLE" | "QUESTION_FIT_FIRST" | "CONSTRAINT_SEARCH";
export type SyntheticSelectionResult = {
    method: SelectionMethod;
    selected: {
        questionId: string;
        candidateId: string;
    }[];
    coveredQuestions: number;
    requiredMeaningUnits: number;
    distinctMeanings: number;
    distinctRoots: number;
    repeatedRootUses: number;
    hardViolations: string[];
    preferences: {
        directMaterials: number;
        explicitWitnesses: number;
        functionVariety: number;
    };
    search: {
        visited: number;
        complete: boolean;
    };
    notSelected: {
        candidateId: string;
        reasons: string[];
    }[];
    actualCustomerClaimsEmitted: 0;
};
