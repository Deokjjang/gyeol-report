import type { InterpretationContext, SemanticAxis } from "./semanticCore";
import type { FusionConditionSplit, FusionType } from "./fusionCore";

/** Isolated language layer. No customer writer, section adapter or Book consumer. */
export const GYEOL_KOREAN_NARRATIVE_CORE_VERSION = "korean-narrative-core-v1" as const;
export const SENTENCE_ROLES = ["HOOK", "DIRECT_CLAIM", "LIFE_SCENE", "IMAGE", "MYEONGLI_REASON", "MBTI_REASON", "FUSION", "CONTRAST", "GOOD_RESULT", "SHADOW", "ACTION", "CLOSER"] as const;
export type SentenceRole = typeof SENTENCE_ROLES[number];
export const ENDING_STYLES = ["FORMAL_DA", "SOFT_YO", "OBSERVATION_JYO", "QUESTION", "SHORT_DA", "DIRECT"] as const;
export type EndingStyle = typeof ENDING_STYLES[number];
export type SentenceLengthClass = "S" | "M" | "L";
export const NARRATIVE_SOURCE_TYPES = ["CORE_GYEOL", "PERSONAL_RESONANCE", "CLAIM", "FUSION", "TRAIT_ARC", "GUIDANCE", "MYEONGLI_EVIDENCE", "SECTION_BRIDGE"] as const;
export type NarrativeSourceType = typeof NARRATIVE_SOURCE_TYPES[number];
export type NarrativeIntent = "HUMAN" | "REINFORCE" | "TENSION" | "COMPLEMENT" | "FORTUNE" | "FACT_BOMB" | "TRAIT_ARC" | "GUIDANCE";
export type NarrativeRefs = {
  evidenceIds: readonly string[]; claimIds: readonly string[]; fusionIds: readonly string[];
  resonanceIds: readonly string[]; guidanceIds: readonly string[]; mbtiSourceNodeIds: readonly string[];
};
/** Each phrase is supplied by a trusted upstream adapter, not inferred from axes/type/job. */
export type NarrativePhrase = {
  id: string; role: SentenceRole; text: string; semanticTheme: string;
  primaryAxes: readonly SemanticAxis[]; contexts: readonly InterpretationContext[];
  refs: NarrativeRefs; directnessLevel: number;
  origin: "MYEONGLI" | "MBTI_ACTUAL" | "MBTI_REFERENCE" | "SYNTHESIS" | "GUIDANCE" | "SCENE" | "BRIDGE";
  /** Resolved by the upstream Fusion engine, never by this language core. */
  splitType?: FusionConditionSplit["type"]; thirdInterpretation?: boolean;
  termDefinitionKey?: string; imageKey?: string;
  /** Only supplied questions can be selected. No declarative-to-question transform. */
  endingStyle?: EndingStyle;
};
export type NarrativeEvidenceTerm = {
  key: string; displayName: string; easyDefinition: string; image?: string;
  exposurePriority: number; sourceEvidenceIds: readonly string[];
};
export type NarrativeSourceUnit = {
  id: string; sourceType: NarrativeSourceType; semanticTheme: string;
  primaryAxes: readonly SemanticAxis[]; contexts: readonly InterpretationContext[];
  confidence: "LOW" | "MEDIUM" | "HIGH"; directnessLevel: number;
  /** Named roles replace parallel free-text fields: one copy of each upstream meaning. */
  phrases: readonly NarrativePhrase[]; evidenceTerms?: readonly NarrativeEvidenceTerm[];
  fusionType?: FusionType; conditionSplit?: FusionConditionSplit;
  metadata?: { problemAlreadyExplained?: boolean; selfPerceptionSupported?: boolean; mbtiType?: string };
};
export type ParagraphPattern = {
  id: string; intent: NarrativeIntent; family: string;
  compatibleSourceTypes: readonly NarrativeSourceType[]; compatibleFusionTypes?: readonly FusionType[];
  requiredRoles: readonly SentenceRole[]; optionalRoles: readonly SentenceRole[];
  roleOrderVariants: readonly (readonly SentenceRole[])[];
  minSentences: number; maxSentences: number; depth: readonly ("SHORT" | "NORMAL" | "DEEP")[];
  directnessIntent: "PRESERVE"; toneIntent: "HUMAN" | "DIRECT" | "PRACTICAL";
};
export type NarrativeIssue = { code: string; refs: string[]; detail?: string };
export type NarrativeValidationResult = {
  readability: number; directness: number; humanDescriptiveness: number; contextCoherence: number;
  evidenceGrounding: number; narrativeFlow: number; repetitionPenalty: number;
  hardViolations: NarrativeIssue[]; warnings: NarrativeIssue[];
};
export type NarrativeSentenceDraft = {
  id: string; role: SentenceRole; text: string; sourcePhraseId: string; sourceSentenceIndex: number; sourceUnitIds: string[];
  evidenceIds: string[]; claimIds: string[]; fusionIds: string[]; resonanceIds: string[]; guidanceIds: string[];
  mbtiSourceNodeIds: string[]; semanticTheme: string; directness: number;
  endingStyle: EndingStyle; lengthClass: SentenceLengthClass; variantId: string;
  explicitMbtiMention: boolean; explicitFusionPhrase: boolean;
  connectorId?: string; termDefinitionKey?: string; imageKey?: string;
};
export type NarrativeMemory = {
  usedEvidence: Record<string, number>; usedAxisAsPrimary: Record<string, number>;
  usedSemanticThemes: Record<string, number>; usedClaims: string[]; usedResonances: string[];
  usedFusions: string[]; usedGuidance: string[]; usedImages: string[];
  usedConnectors: Record<string, number>; usedPhrases: Record<string, number>; usedWords: Record<string, number>;
  usedTermDefinitions: string[]; usedExplicitMbtiMentions: number;
  usedParagraphPatterns: string[]; usedPatternFamilies: string[];
  endingHistory: EndingStyle[]; sentenceLengthHistory: SentenceLengthClass[];
  recentSubjects: string[]; recentOpenings: string[]; recentConnectors: string[];
  sectionCounters: Record<string, { questions: number; words: Record<string, number> }>;
  questions: number;
};
export type NarrativeRequest = {
  source: NarrativeSourceUnit; reportStableKey: string; sectionId: string; intent: NarrativeIntent;
  depthIntent: "SHORT" | "NORMAL" | "DEEP"; context: InterpretationContext;
  presentationIntent: "EXPLICIT" | "HIDDEN"; explicitMbtiBudget: number;
  /** Upstream allocation caps, never guessed by the renderer. */
  semanticThemeBudget?: number; engineVersion?: string; occurrenceIndex?: number;
  patternId?: string; connectorIntent?: "REASON" | "ADD" | "TURN" | "SUMMARY";
  /** Optional caller contract. Selection and validation must agree on completeness. */
  requirements?: { minSentences: number; roles: readonly SentenceRole[]; firstRole?: SentenceRole };
  /** Exact upstream phrase texts reserved for later mandatory content. */
  reservedPhraseTexts?: readonly string[];
};
export type NarrativeBlockDraft = {
  id: string; sourceUnitIds: string[]; patternId: string; patternFamily: string;
  sentenceRoles: SentenceRole[]; sentences: NarrativeSentenceDraft[]; plainText: string;
  semanticTheme: string; directness: number; terminologyUsed: string[]; connectorUsed: string[];
  endingSequence: EndingStyle[]; lengthSequence: SentenceLengthClass[];
  validation: NarrativeValidationResult;
};
export type NarrativeRenderResult = {
  ok: boolean; block: NarrativeBlockDraft; nextMemory: NarrativeMemory;
  debug: { steps: readonly string[]; pattern: string; roles: SentenceRole[]; sourceIds: string[];
    variants: string[]; terms: string[]; images: string[]; memoryBefore: NarrativeMemory; memoryAfter: NarrativeMemory };
};
