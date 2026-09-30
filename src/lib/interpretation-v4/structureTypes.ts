import type { PillarSet } from "../saju/analyze";
import type { PillarKey } from "../saju/birthTimePrecisionTypes";
import type { FiveElement, HeavenlyStem, TenGod } from "../saju/types";

export const STRUCTURE_VERSION = "v4-structure-evidence-1" as const;
export type StructureConfidence = "strong" | "supported" | "uncertain";
export type DaymasterLevel = "veryWeak" | "weak" | "balanced" | "strong" | "veryStrong";
export type GodFamily = "peer" | "output" | "wealth" | "officer" | "resource";
export type StructureId = "wealthHeavyWeakDaymaster" | "outputCreatesWealth" | "wealthCreatesOfficer" |
  "officerResourceFlow" | "killingResourceFlow" | "hurtingOfficerMeetsOfficer" | "mixedOfficers" |
  "peerHeavy" | "outputHeavy" | "wealthHeavy" | "officerHeavy" | "resourceHeavy" | "noResource" | "noOutput";
export type StructureAtom = {
  readonly id: string;
  readonly position: PillarKey;
  readonly stem: HeavenlyStem;
  readonly element: FiveElement;
  readonly god: TenGod;
  readonly family: GodFamily;
  readonly location: "visible" | "MAIN" | "SUB" | "MINOR";
  readonly weight: number;
  readonly provenance: readonly string[];
};
export type StrengthEvidence = {
  readonly dimension: "season" | "visible" | "hidden" | "root";
  readonly meaning: string;
  readonly atomIds: readonly string[];
  readonly provenance: readonly string[];
};
export type DaymasterStrength = {
  readonly version: typeof STRUCTURE_VERSION;
  readonly level: DaymasterLevel;
  readonly confidence: StructureConfidence;
  readonly supportingEvidence: readonly StrengthEvidence[];
  readonly weakeningEvidence: readonly StrengthEvidence[];
  readonly reasons: readonly string[];
  readonly provenance: readonly string[];
  readonly hourSensitivity: { readonly evaluated: number; readonly possibleLevels: readonly DaymasterLevel[]; readonly stable: boolean };
};
export type StructureContext = {
  readonly valid: boolean;
  readonly complete: boolean;
  readonly pillars: PillarSet;
  readonly atoms: readonly StructureAtom[];
  readonly alternatives: readonly PillarSet[];
  readonly reasons: readonly string[];
};
export type StructureCandidate = {
  readonly version: typeof STRUCTURE_VERSION;
  readonly id: StructureId;
  readonly label: string;
  readonly confidence: Exclude<StructureConfidence, "uncertain">;
  readonly supportingEvidence: readonly StructureAtom[];
  readonly connections: readonly { readonly from: string; readonly to: string; readonly kind: "generation" | "control" | "resourceToDaymaster" }[];
  readonly reasons: readonly string[];
  readonly provenance: readonly string[];
  readonly lineage: readonly string[];
};
export type StructureAssessment = {
  readonly id: StructureId;
  readonly status: StructureConfidence | "suppressed";
  readonly reasons: readonly string[];
};
export type StructureLayer = {
  readonly version: typeof STRUCTURE_VERSION;
  readonly completeChart: boolean;
  readonly strength: DaymasterStrength;
  readonly candidates: readonly StructureCandidate[];
  readonly assessments: readonly StructureAssessment[];
};
