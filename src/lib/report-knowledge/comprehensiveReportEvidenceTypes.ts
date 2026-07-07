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
import type { SelectedMbtiKnowledge } from "./mbtiKnowledgeSelector";
import type { SajuMbtiBridgeEvidence } from "./sajuMbtiBridgeScorer";
import type {
  MbtiKnowledgeContext,
  MbtiTypeCode,
} from "./mbtiKnowledgeTypes";

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

export type ComprehensiveMbtiBasisTrait = {
  readonly id?: string;
  readonly label: string;
  readonly plainKo?: string;
  readonly strongLine?: string;
  readonly positiveUse?: string;
  readonly risk?: string;
  readonly matchingMyeongliSignals: readonly string[];
  readonly productDomains: readonly string[];
};

export type ComprehensiveMbtiBasisTraitArea = {
  readonly area:
    | "identity"
    | "thinkingStyle"
    | "career"
    | "workplace"
    | "money"
    | "investment"
    | "study"
    | "love"
    | "marriage"
    | "parenting"
    | "child"
    | "relationships"
    | "communication"
    | "strengths"
    | "risks"
    | "growth";
  readonly traits: readonly ComprehensiveMbtiBasisTrait[];
};

export type ComprehensiveMbtiBasisFunctionStack = {
  readonly position: string;
  readonly code: string;
};

export type ComprehensiveMbtiBasisBridgeHint = {
  readonly signal: string;
  readonly reason: string;
  readonly relatedTraits: readonly string[];
  readonly productDomains: readonly string[];
};

export type ComprehensiveMbtiBasisSelectedTraitSeed = {
  readonly id: string;
  readonly context: MbtiKnowledgeContext;
  readonly label: string;
  readonly description: string;
  readonly strengths: readonly string[];
  readonly risks: readonly string[];
  readonly practicalSwitches: readonly string[];
  readonly tags: readonly string[];
};

export type ComprehensiveMbtiBasis = {
  readonly type: MbtiTypeCode;
  readonly titleKo: string;
  readonly archetype: string;
  readonly oneLine: string;
  readonly coreSummary: readonly string[];
  readonly closeKeywords: readonly string[];
  readonly farKeywords: readonly string[];
  readonly functionStack: readonly ComprehensiveMbtiBasisFunctionStack[];
  readonly traitAreas: readonly ComprehensiveMbtiBasisTraitArea[];
  readonly myeongliBridgeHints: readonly ComprehensiveMbtiBasisBridgeHint[];
  readonly reportUseCases: readonly string[];
  readonly selectedTraitSeeds: readonly ComprehensiveMbtiBasisSelectedTraitSeed[];
};

export type ComprehensiveSajuFeatureDictionaryCategory =
  | SajuFeatureCategory
  | "hidden_stem"
  | "relation";

export type ComprehensiveSajuFeatureDictionaryEntry = {
  readonly id: string;
  readonly rawLabel: string;
  readonly category: ComprehensiveSajuFeatureDictionaryCategory;
  readonly userTitle: string;
  readonly plainMeaning: string;
  readonly howItShowsInYou: string;
  readonly strength: string;
  readonly fatiguePoint: string;
  readonly interpretationTitle: string;
  readonly description: string;
  readonly strengths: readonly string[];
  readonly fatiguePoints: readonly string[];
  readonly sceneExamples: readonly string[];
  readonly practicalUse: string;
  readonly sourceFeatureId?: string;
  readonly sourcePillar?: string;
};

export type ComprehensiveSajuMbtiBridgeInterpretation = {
  readonly chapterId: SajuFeatureChapterId;
  readonly mbti: MbtiTypeCode;
  readonly traitId: string;
  readonly mbtiTraitTopic: MbtiKnowledgeContext;
  readonly myeongliSignalIds: readonly string[];
  readonly myeongliSignalLabels: readonly string[];
  readonly interpretation: string;
  readonly fatiguePoint: string;
  readonly practicalUse: string;
  readonly sceneSeed: string;
  readonly bridgeNeed: string;
  readonly score: number;
};

export type ComprehensiveReportEvidencePacket = {
  readonly productKey?: "saju_mbti_full";
  readonly productSlug?: "saju-mbti-full";
  readonly productType?: "saju_mbti_full";
  readonly mbtiType: MbtiType;
  readonly sajuEntryIds: readonly string[];
  readonly sections: readonly ComprehensiveReportSectionEvidence[];
  readonly mbtiBasis?: ComprehensiveMbtiBasis;
  readonly sajuFeatureDictionary?: readonly ComprehensiveSajuFeatureDictionaryEntry[];
  readonly selectedSajuFeatureEvidence?: readonly SelectedSajuFeatureEvidence[];
  readonly sajuPillarFeaturePlacements?: readonly SajuPillarFeaturePlacement[];
  readonly sajuFeatureSpotlight?: SajuFeatureSpotlightSection;
  readonly sajuSignatureScenes?: readonly SajuSignatureScene[];
  readonly reportDifferentiationModules?: readonly ReportDifferentiationModule[];
  readonly sajuSymbolicNickname?: SajuSymbolicNickname;
  readonly selectedMbtiKnowledge?: SelectedMbtiKnowledge;
  readonly sajuMbtiBridgeEvidence?: readonly SajuMbtiBridgeEvidence[];
  readonly interpretedSajuMbtiBridgeEvidence?: readonly ComprehensiveSajuMbtiBridgeInterpretation[];
  readonly globalWarnings: readonly string[];
};
