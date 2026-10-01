import type { CompatibilityRelationshipType } from "../report-generation/reportInputTypes";
import type { NarrativeBlock, NarrativeProof, NarrativeSection, MaterialPacket } from "./narrativeTypes";
import type { FusionInterpretation } from "./types";

export type PairCategory = CompatibilityRelationshipType;
export type PairStyle = "inquiry" | "care" | "decisive" | "steady" | "explore" | "social-rest" | "express" | "sensitive" | "independent" | "practical" | "natal";
export type PairPerson = {
  readonly personId: string;
  readonly name: string;
  readonly mbti: string | null;
  readonly style: PairStyle;
  readonly core: string;
  readonly strength: string;
  readonly shadow: string;
  readonly relationship: string;
  readonly fusion: FusionInterpretation | null;
  readonly proof: NarrativeProof;
  readonly materials: MaterialPacket;
};
export type CompatibilityNarrative = {
  readonly version: "v4-compatibility-narrative-1";
  readonly category: PairCategory;
  readonly compatibilityRoleVersion: string;
  readonly headline: string;
  readonly opening: readonly NarrativeBlock[];
  readonly sections: readonly NarrativeSection[];
  readonly finalLine: string;
  readonly finalProof: NarrativeProof;
};
