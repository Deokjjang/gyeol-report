import type { ComprehensiveReportSectionId } from "../report-knowledge/reportSectionSchema";
import type { SajuFeatureSpotlightSection } from "../report-knowledge/sajuFeatureSpotlight";
import type { SajuSignatureScene } from "../report-knowledge/sajuSignatureSceneRules";

export type ComprehensiveReportDraftTone =
  | "saju_first"
  | "conversational"
  | "direct"
  | "warm"
  | "cautionary";

export type ComprehensiveReportDraftSection = {
  readonly sectionId: ComprehensiveReportSectionId;
  readonly titleKo: string;
  readonly oneLine: string;
  readonly body: string;
  readonly evidenceSummary: readonly string[];
  readonly sajuTermsUsed: readonly string[];
  readonly mbtiTermsUsed: readonly string[];
  readonly cautionLevel: "low" | "medium" | "high";
};

export type ComprehensiveReportV1Draft = {
  readonly version: "comprehensive_v1_draft";
  readonly productType: "saju_mbti_full";
  readonly tone: readonly ComprehensiveReportDraftTone[];
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly sections: readonly ComprehensiveReportDraftSection[];
  readonly finalAdvice: string;
  readonly safetyNotes: readonly string[];
};

export type ComprehensiveReportV2ChapterId =
  | "opening"
  | "saju_identity"
  | "personality_pattern"
  | "work_money_study"
  | "love_relationships"
  | "people_family_environment"
  | "risk_and_growth"
  | "final_message";

export const COMPREHENSIVE_REPORT_V2_CHAPTER_IDS = [
  "opening",
  "saju_identity",
  "personality_pattern",
  "work_money_study",
  "love_relationships",
  "people_family_environment",
  "risk_and_growth",
  "final_message",
] as const satisfies readonly ComprehensiveReportV2ChapterId[];

export type ComprehensiveReportV2Chapter = {
  readonly chapterId: ComprehensiveReportV2ChapterId;
  readonly titleKo: string;
  readonly headline: string;
  readonly hitReadingLines: readonly string[];
  readonly body: string;
  readonly solutionLines: readonly string[];
  readonly keyPhrases: readonly string[];
  readonly sajuTermsUsed: readonly string[];
  readonly mbtiTermsUsed: readonly string[];
};

export type ComprehensiveReportV2PillarGridColumnId =
  | "hour"
  | "day"
  | "month"
  | "year";

export type ComprehensiveReportV2PillarGridColumn = {
  readonly columnId: ComprehensiveReportV2PillarGridColumnId;
  readonly labelKo: string;
  readonly pillar?: string;
  readonly heavenlyStem?: string;
  readonly earthlyBranch?: string;
  readonly tenGod?: readonly string[];
  readonly hiddenStems?: readonly string[];
  readonly twelveLifeStage?: readonly string[];
  readonly twelveSinsal?: readonly string[];
  readonly sinsal?: readonly string[];
  readonly gwiin?: readonly string[];
};

export type ComprehensiveReportV2ProfileTable = {
  readonly yearPillar?: string;
  readonly monthPillar?: string;
  readonly dayPillar?: string;
  readonly hourPillar?: string;
  readonly fourPillarGrid?: readonly ComprehensiveReportV2PillarGridColumn[];
  readonly dayMaster?: string;
  readonly dayPillarKeywords?: readonly string[];
  readonly fiveElementSummary: readonly string[];
  readonly excessiveElements: readonly string[];
  readonly missingElements: readonly string[];
  readonly tenGodSummary: readonly string[];
  readonly specialPatterns: readonly string[];
  readonly sinsal: readonly string[];
  readonly gwiin: readonly string[];
  readonly twelveSinsal?: readonly string[];
  readonly majorSinsal?: readonly string[];
  readonly gwiinGilshin?: readonly string[];
  readonly mbti: string;
};

export type ComprehensiveReportV2Draft = {
  readonly version: "comprehensive_v2_draft";
  readonly productType: "saju_mbti_full";
  readonly openingTitle: string;
  readonly openingSummary: string;
  readonly coreLine: string;
  readonly profileTable: ComprehensiveReportV2ProfileTable;
  readonly sajuFeatureSpotlight?: SajuFeatureSpotlightSection;
  readonly sajuSignatureScenes?: readonly SajuSignatureScene[];
  readonly chapters: readonly ComprehensiveReportV2Chapter[];
  readonly finalAdvice: string;
  readonly safetyNotes: readonly string[];
};

export type ComprehensiveReportV2NarrativeDraft = Omit<
  ComprehensiveReportV2Draft,
  "profileTable" | "sajuFeatureSpotlight" | "sajuSignatureScenes"
>;

export type ComprehensiveReportDraft =
  | ComprehensiveReportV1Draft
  | ComprehensiveReportV2Draft;

export type ComprehensiveReportSnapshotVersion = ComprehensiveReportDraft["version"];

export function isComprehensiveReportV1Draft(
  draft: ComprehensiveReportDraft,
): draft is ComprehensiveReportV1Draft {
  return draft.version === "comprehensive_v1_draft";
}

export function isComprehensiveReportV2Draft(
  draft: ComprehensiveReportDraft,
): draft is ComprehensiveReportV2Draft {
  return draft.version === "comprehensive_v2_draft";
}
