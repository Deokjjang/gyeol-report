import type { NarrativeBlock, NarrativeProof, NarrativeSection } from "./narrativeTypes";

export type CareerRecommendation = {
  readonly id: string;
  readonly roleExamples: readonly string[];
  readonly reason: string;
  readonly environment: string;
  readonly basis: "supported-tendency" | "explore-with-sample";
  readonly proof: NarrativeProof;
};
export type CareerNarrative = {
  readonly version: "v4-career-narrative-1";
  readonly headline: string;
  readonly opening: readonly NarrativeBlock[];
  readonly sections: readonly NarrativeSection[];
  readonly recommendations: readonly CareerRecommendation[];
  readonly avoidEnvironments: readonly { readonly text: string; readonly proof: NarrativeProof }[];
  readonly finalLine: string;
  readonly finalProof: NarrativeProof;
};
