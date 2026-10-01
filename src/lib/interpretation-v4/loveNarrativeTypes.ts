import type { NarrativeBlock, NarrativeProof, NarrativeSection } from "./narrativeTypes";
import type { RelationshipStatus } from "../report-generation/reportInputTypes";

export type LoveNarrative = {
  readonly version: "v4-love-narrative-1";
  readonly headline: string;
  readonly opening: readonly NarrativeBlock[];
  readonly sections: readonly NarrativeSection[];
  readonly relationshipStatus: RelationshipStatus;
  readonly finalLine: string;
  readonly finalProof: NarrativeProof;
};
