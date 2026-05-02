import type { SajuTagCode } from "../saju/tags";
import type { MbtiType } from "./types";

export type MbtiAxis = "EI" | "SN" | "TF" | "JP";

export type MbtiAxisSide = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

export type SajuMbtiSuggestionStrength = "LOW" | "MEDIUM" | "HIGH";

export type SajuMbtiSuggestionConfidence = "LOW" | "MEDIUM" | "HIGH";

export type SajuMbtiSuggestionEvidence = {
  sajuTagCode: SajuTagCode;
  reasonKo: string;
};

export type SajuMbtiAxisSuggestion = {
  axis: MbtiAxis;
  suggestedSide: MbtiAxisSide;
  strength: SajuMbtiSuggestionStrength;
  confidence: SajuMbtiSuggestionConfidence;
  titleKo: string;
  summaryKo: string;
  evidence: readonly SajuMbtiSuggestionEvidence[];
};

export type SajuMbtiTypeSuggestion = {
  suggestedType: MbtiType;
  confidence: SajuMbtiSuggestionConfidence;
  matchedAxes: readonly MbtiAxis[];
  unresolvedAxes: readonly MbtiAxis[];
  summaryKo: string;
};

export type SajuMbtiComparisonDirection =
  | "MATCH"
  | "PARTIAL_MATCH"
  | "TENSION"
  | "UNRESOLVED";

export type SajuMbtiUserComparison = {
  userType: MbtiType;
  suggestedType?: MbtiType;
  direction: SajuMbtiComparisonDirection;
  matchingAxes: readonly MbtiAxis[];
  tensionAxes: readonly MbtiAxis[];
  summaryKo: string;
};

export type SajuMbtiSuggestionResult = {
  userType: MbtiType;
  axisSuggestions: readonly SajuMbtiAxisSuggestion[];
  typeSuggestion?: SajuMbtiTypeSuggestion;
  comparison: SajuMbtiUserComparison;
  notices: readonly string[];
};

export type SajuMbtiAxisRuleId =
  | "SELF_EXPRESSION_TO_E"
  | "INNER_PROCESSING_TO_I"
  | "PRACTICAL_STRUCTURE_TO_S"
  | "ABSTRACT_SYMBOLISM_TO_N"
  | "CONTROL_DECISION_TO_T"
  | "RELATION_SENSITIVITY_TO_F"
  | "STRUCTURE_RESPONSIBILITY_TO_J"
  | "FLEXIBLE_FLOW_TO_P";

export type SajuMbtiAxisRuleDefinition = {
  id: SajuMbtiAxisRuleId;
  axis: MbtiAxis;
  suggestedSide: MbtiAxisSide;
  strength: SajuMbtiSuggestionStrength;
  requiredTags: readonly SajuTagCode[];
  supportingTags?: readonly SajuTagCode[];
  titleKo: string;
  summaryKo: string;
};
