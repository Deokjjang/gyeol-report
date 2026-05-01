import type { MbtiTraitCode, MbtiType } from "../mbti/types";
import type { SajuTagCode } from "../saju/tags";

export type BridgeSignalDirection =
  | "OVERLAP"
  | "TENSION"
  | "COMPENSATION"
  | "NEUTRAL";

export type BridgeSignalStrength = "LOW" | "MEDIUM" | "HIGH";

export type BridgeSignalConfidence = "LOW" | "MEDIUM" | "HIGH";

export type BridgeEvidence = {
  sajuTagCode?: SajuTagCode;
  mbtiTraitCode?: MbtiTraitCode;
  reasonKo: string;
};

export type BridgeSignal = {
  direction: BridgeSignalDirection;
  strength: BridgeSignalStrength;
  confidence: BridgeSignalConfidence;
  titleKo: string;
  summaryKo: string;
  evidence: BridgeEvidence[];
};

export type BridgeResult = {
  mbtiType: MbtiType;
  signals: BridgeSignal[];
  notices: string[];
};

export type BridgeRuleId =
  | "DIRECTNESS_OVERLAP"
  | "DIRECTNESS_TENSION"
  | "STRUCTURE_OVERLAP"
  | "STRUCTURE_TENSION"
  | "RESOURCE_COMPENSATION"
  | "OUTPUT_COMPENSATION"
  | "OFFICER_PRESSURE_WITH_JUDGING"
  | "WEALTH_REALITY_WITH_EFFICIENCY"
  | "RELATION_HARMONY_WITH_BRANCH_COMBINATION"
  | "CONFLICT_DIRECTNESS_WITH_BRANCH_CLASH"
  | "INTERNAL_PROCESSING_WITH_RESOURCE"
  | "EXPLORATION_WITH_OUTPUT";

export type BridgeRule = {
  id: BridgeRuleId;
  direction: BridgeSignalDirection;
  strength: BridgeSignalStrength;
  confidence: BridgeSignalConfidence;
  requiredSajuTags: readonly SajuTagCode[];
  requiredMbtiTraits: readonly MbtiTraitCode[];
  titleKo: string;
  summaryKo: string;
};
