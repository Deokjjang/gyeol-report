import type { InterpretationTagId } from "./interpretationTags";
import type { MbtiType } from "./mbtiKnowledgeTypes";
import type { ComprehensiveReportSectionId } from "./reportSectionSchema";
import type { SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

export type EvidenceRole =
  | "primary_saju"
  | "supporting_mbti"
  | "fusion_reinforcement"
  | "fusion_contrast"
  | "fusion_compensation"
  | "topic_specialization";

export type ReportEvidenceItem = {
  readonly role: EvidenceRole;
  readonly sourceId: string;
  readonly sourceLabelKo: string;
  readonly summary: string;
  readonly topic: SajuKnowledgeTopic;
  readonly tags: readonly InterpretationTagId[];
  readonly priority: number;
};

export type ComprehensiveReportSectionEvidence = {
  readonly sectionId: ComprehensiveReportSectionId;
  readonly titleKo: string;
  readonly primarySaju: readonly ReportEvidenceItem[];
  readonly supportingMbti: readonly ReportEvidenceItem[];
  readonly fusion: readonly ReportEvidenceItem[];
  readonly warnings: readonly string[];
};

export type ComprehensiveReportEvidencePacket = {
  readonly mbtiType: MbtiType;
  readonly sajuEntryIds: readonly string[];
  readonly sections: readonly ComprehensiveReportSectionEvidence[];
  readonly globalWarnings: readonly string[];
};
