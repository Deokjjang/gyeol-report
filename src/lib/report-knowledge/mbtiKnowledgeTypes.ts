import type { InterpretationTagId } from "./interpretationTags";
import type { KnowledgePhraseSeeds, SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

export type MbtiType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type MbtiKnowledgeEntry = {
  readonly type: MbtiType;
  readonly labelKo: string;
  readonly commonAliasKo: string;
  readonly functionStack: readonly string[];
  readonly summary: string;
  readonly traitTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly topicWeights: Partial<Record<SajuKnowledgeTopic, number>>;
  readonly sajuBridgeTags: readonly InterpretationTagId[];
  readonly relationshipPreferences: {
    readonly attracts: readonly InterpretationTagId[];
    readonly needs: readonly InterpretationTagId[];
    readonly risks: readonly InterpretationTagId[];
  };
  readonly phraseSeeds: KnowledgePhraseSeeds;
};

export const MBTI_TYPES = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const satisfies readonly MbtiType[];
