import type { InterpretationTagId } from "./interpretationTags";
import type { MbtiType } from "./mbtiKnowledgeTypes";
import type { ComprehensiveReportSectionId } from "./reportSectionSchema";
import type {
  MbtiBridgeNeed,
  SajuFeatureCategory,
  SajuFeatureChapterId,
  SajuFeaturePolarity,
  SajuFeatureScoreStrength,
  SajuFeatureTopic,
} from "./sajuFeatureTypes";
import type { SajuKnowledgeTopic } from "./sajuKnowledgeTypes";
import type { SajuFeatureSpotlightSection } from "./sajuFeatureSpotlight";
import type { SajuSignatureScene } from "./sajuSignatureSceneRules";
import type { SajuPillarFeaturePlacement } from "./sajuPillarFeaturePlacement";
import type { ReportDifferentiationModule } from "./reportDifferentiationModules";
import type { SajuSymbolicNickname } from "./sajuSymbolicNickname";

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

export type SelectedSajuFeatureEvidenceItem = {
  readonly id: string;
  readonly labelKo: string;
  readonly category: SajuFeatureCategory;
  readonly polarity: SajuFeaturePolarity;
  readonly strength: SajuFeatureScoreStrength;
  readonly score: number;
  readonly topics: readonly SajuFeatureTopic[];
  readonly summary: string;
  readonly symbolicImage: string;
  readonly positiveReading: string;
  readonly cautionReading: string;
  readonly practicalUse: string;
  readonly sceneSeeds: readonly string[];
  readonly phraseSeeds: readonly string[];
  readonly mbtiBridgeNeeds?: readonly MbtiBridgeNeed[];
};

export type SelectedSajuFeatureEvidence = {
  readonly chapterId: SajuFeatureChapterId;
  readonly features: readonly SelectedSajuFeatureEvidenceItem[];
};

export type ComprehensiveReportEvidencePacket = {
  readonly mbtiType: MbtiType;
  readonly sajuEntryIds: readonly string[];
  readonly sections: readonly ComprehensiveReportSectionEvidence[];
  readonly selectedSajuFeatureEvidence?: readonly SelectedSajuFeatureEvidence[];
  readonly sajuPillarFeaturePlacements?: readonly SajuPillarFeaturePlacement[];
  readonly sajuFeatureSpotlight?: SajuFeatureSpotlightSection;
  readonly sajuSignatureScenes?: readonly SajuSignatureScene[];
  readonly reportDifferentiationModules?: readonly ReportDifferentiationModule[];
  readonly sajuSymbolicNickname?: SajuSymbolicNickname;
  readonly globalWarnings: readonly string[];
};
