import type { ComprehensiveReportSectionId } from "../report-knowledge/reportSectionSchema";

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

export type ComprehensiveReportDraft = {
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
