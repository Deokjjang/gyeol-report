import type { ComprehensiveEditorialPlan, ComprehensivePlanInputs, ComprehensiveSectionId, SectionKind } from "./comprehensivePlanCore";
import type { NarrativeBlockDraft, NarrativeMemory, NarrativeSentenceDraft, NarrativeIssue } from "./narrativeCore";
import type { SceneUse } from "./narrativeSceneCore";
import type { TitleUse } from "./narrativeTitleCore";
import type { MeaningSignature } from "./narrativeMeaningSignature";
import type { OperatingRuleCandidate } from "./operatingRuleCore";
export const GYEOL_COMPREHENSIVE_MANUSCRIPT_VERSION = "comprehensive-manuscript-13d-5b-v1";
export type ManuscriptInput = { reportStableKey: string; plan: ComprehensiveEditorialPlan; profiles: ComprehensivePlanInputs };
export type ManuscriptMemory = { language: NarrativeMemory; usedScenes: SceneUse[]; usedTitles: TitleUse[]; meanings?: MeaningSignature[] };
export type RenderedComprehensiveSection = {
  sectionId: ComprehensiveSectionId; sectionKind: SectionKind; title: string; blocks: NarrativeBlockDraft[];
  bridgeIn?: NarrativeSentenceDraft; plainText: string; sourceCandidateIds: string[]; evidenceIds: string[];
  semanticThemes: string[]; explicitMbtiCount: number; sceneIds: string[]; terminologyUsed: string[];
  operatingRules?: { candidateId: string; text: string; antecedentCandidateIds: string[]; source?: OperatingRuleCandidate }[];
  validation: { hardViolations: NarrativeIssue[]; warnings: NarrativeIssue[] };
};
export type ManuscriptValidation = {
  scores: Record<string, number | null>; hardViolations: NarrativeIssue[]; warnings: NarrativeIssue[];
  heuristicNotice: string;
};
export type ComprehensiveManuscriptDraft = {
  version: string; reportStableKey: string; coreGyeol: { sourceId: string | null; text: string };
  sections: Record<ComprehensiveSectionId, RenderedComprehensiveSection>; fullText: string;
  narrativeMemory: ManuscriptMemory; terminologyUsage: string[]; explicitMbtiUsage: number;
  sceneUsage: SceneUse[]; titleUsage: TitleUse[]; semanticThemeUsage: Record<string, number>;
  validation: ManuscriptValidation; diagnostics: { warnings: string[]; suppressed: { sectionId: string; candidateId: string; reasons: string[] }[] };
  debug: { sources: Record<string, unknown>; bridgeDecisions: { sectionId: string; intent?: string; used: boolean; reason: string }[]; coreRecall: string[];
    operatingRules?: { eligible: OperatingRuleCandidate[]; rendered: string[] }; quality?: Record<string, unknown> };
};
