import type { SajuFoundationDomain } from "../sajuFoundationKnowledgeTypes";

/** Source research only: not a calculation, Evidence ID, selector or approved customer copy. */
export type CompletionSourceRef = {
  readonly sourceId: string;
  readonly locator: string;
  readonly proposition: string;
};
export type CompletionDomainMaterial = {
  readonly kind: "conditional_composition" | "modern_editorial_candidate";
  readonly meaning: string;
  readonly favorable: string;
  readonly risk: string;
  readonly when: string;
  readonly practice: string;
  readonly avoid: string;
};
export type CompletionResearch = {
  readonly id: string;
  readonly targetId: string;
  readonly label: string;
  readonly kind: "source_research_profile";
  readonly review: "historical_text_checked" | "repository_composition" | "unverified_tradition";
  /** Review applies to the source proposition, never to predictive validity or the modern examples. */
  readonly interpretationReview: "modern_candidate_not_historical_fact" | "research_metadata_only";
  readonly core: string;
  readonly traditional: readonly string[];
  readonly composition?: {
    readonly stem: string; readonly branch: string;
    readonly stemElement: string; readonly branchElement: string;
    readonly stemYinYang: string; readonly branchYinYang: string;
  };
  readonly positive: string;
  readonly risk: string;
  readonly behavior: { readonly judgment: string; readonly action: string; readonly expression: string; readonly conflict: string; readonly environment: string };
  readonly growth: string;
  readonly unexpected: string;
  readonly conditions: readonly string[];
  readonly domains: Partial<Readonly<Record<SajuFoundationDomain, CompletionDomainMaterial>>>;
  readonly contrasts: readonly string[];
  readonly limitations: readonly string[];
  readonly sourceRefs: readonly CompletionSourceRef[];
  readonly pending: readonly string[];
  /** Historical formation description, never executable detection logic. */
  readonly marker?: { readonly hanja: string | null; readonly aliases: readonly string[]; readonly formation: string; readonly lineageDifference: string; readonly formationReview: "text_checked" | "repository_only" | "unverified" };
  readonly hiddenStems?: readonly string[];
  readonly positionNotes?: readonly {
    readonly position: "year" | "month" | "day" | "hour";
    readonly review: "text_checked_conditional" | "unverified";
    readonly meaning: string;
    readonly condition: string;
    readonly sourceRefs: readonly CompletionSourceRef[];
  }[];
};
export type CompletionSource = {
  readonly id: string; readonly title: string; readonly author: string;
  readonly edition: string; readonly publication: string | null;
  readonly location: string; readonly checkedAt: string;
  readonly access: "public_transcription_read" | "repository_read";
  readonly revision: string | null; readonly contentSha256: string | null;
  readonly sections: readonly string[]; readonly limitations: readonly string[];
};
