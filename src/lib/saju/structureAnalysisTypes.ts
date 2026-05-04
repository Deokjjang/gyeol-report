export type DayMasterStrengthLevel =
  | "VERY_WEAK"
  | "WEAK"
  | "BALANCED"
  | "STRONG"
  | "VERY_STRONG";

export type SajuStructurePatternCode =
  | "WEAK_DAYMASTER_WITH_STRONG_WEALTH"
  | "WEAK_DAYMASTER_WITH_STRONG_OUTPUT"
  | "WEAK_DAYMASTER_WITH_STRONG_OFFICER"
  | "RESOURCE_HEAVY"
  | "PEER_HEAVY"
  | "OUTPUT_HEAVY"
  | "WEALTH_HEAVY"
  | "OFFICER_HEAVY"
  | "MIXED_OFFICER_KILLING"
  | "RESOURCE_SUPPORTS_DAYMASTER"
  | "OUTPUT_GENERATES_WEALTH"
  | "WEALTH_GENERATES_OFFICER"
  | "FIRE_METAL_TENSION"
  | "WATER_WEAK_RECOVERY_NEEDED";

export type StructureAnalysisConfidence = "LOW" | "MEDIUM" | "HIGH";

export type StructureAnalysisEvidence = {
  source: "TEN_GODS" | "ELEMENTS" | "SEASON" | "RELATIONS" | "SHINSAL";
  keyKo: string;
  valueKo: string;
};

export type SajuStructurePattern = {
  code: SajuStructurePatternCode;
  labelKo: string;
  summaryKo: string;
  confidence: StructureAnalysisConfidence;
  evidence: readonly StructureAnalysisEvidence[];
};

export type DayMasterStrengthAnalysis = {
  level: DayMasterStrengthLevel;
  score: number;
  labelKo: string;
  summaryKo: string;
  confidence: StructureAnalysisConfidence;
  evidence: readonly StructureAnalysisEvidence[];
};

export type SajuStructureSummary = {
  titleKo: string;
  bodyKo: string;
  keywordsKo: readonly string[];
};

export type SajuStructureAnalysis = {
  dayMasterStrength: DayMasterStrengthAnalysis;
  patterns: readonly SajuStructurePattern[];
  summary: SajuStructureSummary;
  notices: readonly string[];
};
