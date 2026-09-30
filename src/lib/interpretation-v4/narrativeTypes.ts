import type { SajuCalcResult } from "../saju/types";
import type { JobStatus, RelationshipStatus } from "../report-generation/reportInputTypes";
import type { Domain, FusionInterpretation } from "./types";
import type { buildMyeongliMaterialPacket, BoundMaterial } from "./materialPacket";

export type NarrativeInput = {
  readonly calculation: SajuCalcResult;
  readonly name: string;
  readonly mbti?: string | null;
  readonly context: { readonly jobStatus: JobStatus; readonly detailJob: string; readonly relationshipStatus: RelationshipStatus };
};
export type NarrativeMode = "prose" | "punch" | "question";
export type NarrativeTone = "positive" | "observation" | "shadow" | "direction";
export type NarrativeProof = {
  readonly features: readonly string[];
  readonly seedIds: readonly string[];
  readonly fusionIds: readonly string[];
  readonly sourceRefs: readonly string[];
};
export type NarrativeBlock = {
  readonly id: string;
  readonly text: string;
  readonly mode: NarrativeMode;
  readonly tone: NarrativeTone;
  readonly scene?: string;
  /** Authored manifestation, not an inferred event or customer-visible evidence. */
  readonly editorial?: { readonly variant: string; readonly sceneFamily?: string; readonly theme?: string };
  readonly proof: NarrativeProof;
};
export type NarrativeSection = {
  readonly id: string;
  readonly title: string;
  readonly domain: Domain;
  readonly blocks: readonly NarrativeBlock[];
};
export type ComprehensiveNarrative = {
  readonly version: "v4-comprehensive-narrative-1";
  readonly headline: string;
  readonly opening: readonly NarrativeBlock[];
  readonly sections: readonly NarrativeSection[];
  readonly finalLine: string;
  readonly finalProof: NarrativeProof;
};
export type MaterialPacket = ReturnType<typeof buildMyeongliMaterialPacket>;
export type NarrativeState = {
  readonly input: NarrativeInput;
  readonly packet: MaterialPacket;
  readonly pillar: BoundMaterial;
  readonly master: BoundMaterial;
  readonly usedSeeds: Set<string>;
  readonly featureUses: Map<string, number>;
};
export type EditorialIssue = { readonly severity: "Blocker" | "Major" | "Minor"; readonly code: string; readonly location: string };
export type Signature = {
  readonly id: string;
  readonly headline: string;
  readonly opening: string;
  readonly gift: string;
  readonly direction: string;
  readonly final: string;
  readonly fusions: readonly FusionInterpretation[];
};
