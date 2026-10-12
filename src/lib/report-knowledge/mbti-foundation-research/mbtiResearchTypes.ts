import type { MbtiType } from "../mbtiKnowledgeTypes";

export type ResearchDomain = "identity" | "thinkingStyle" | "career" | "workplace" | "money" | "investment" | "study" | "love" | "marriage" | "parenting" | "child" | "relationships" | "communication" | "strengths" | "risks" | "growth";
export type SourceRef = {
  readonly type: MbtiType;
  readonly file: string;
  readonly pointer: string;
  readonly traitId: string;
  readonly sourceCoverage: "direct" | "inferred";
  readonly sourceMeaningSha256: string;
};
/** Offline editorial hypotheses. A source's direct label is not empirical proof.
 * Examples, contrasts and interventions require individual confirmation. */
export type MbtiResearchMaterial = {
  readonly id: string;
  readonly type: MbtiType;
  readonly domain: ResearchDomain;
  readonly basis: readonly SourceRef[];
  readonly provenance: "new_conditional_research";
  readonly coreMeaning: string;
  readonly positiveExpression: string;
  readonly cautionExpression: string;
  readonly behaviorCandidate: string;
  readonly environmentCondition: string;
  readonly unexpectedFacet: string;
  readonly similarTypeContrast: {
    readonly type: MbtiType;
    readonly basis: readonly SourceRef[];
    readonly interpretation: string;
    readonly status: "source_comparison_hypothesis_not_exclusive";
  };
  readonly fictionalExample: { readonly kind: "fictional_not_user_history"; readonly text: string };
  readonly counterexample: string;
  readonly applicationGate: string;
  readonly sourceRefs: readonly string[];
  readonly verification: "editorial_reviewed_not_empirically_verified";
  readonly approvedForCustomer: false;
  readonly connectedToRuntime: false;
};
export type MbtiResearchSource = {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly location: string;
  readonly checked: string;
  readonly supports: string;
  readonly limitations: string;
};
