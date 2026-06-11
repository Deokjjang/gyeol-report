import type { InterpretationTagId } from "./interpretationTags";
import type {
  FiveElement,
  KnowledgePhraseSeeds,
  SajuKnowledgeTopic,
  TenGod,
} from "./sajuKnowledgeTypes";

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

export type MbtiPreferenceLetter = "E" | "I" | "N" | "S" | "T" | "F" | "J" | "P";

export type MbtiTemperamentGroup = "NT" | "NF" | "SJ" | "SP";

export type MbtiTopicInterpretation = {
  readonly summary: string;
  readonly positive: readonly string[];
  readonly risk: readonly string[];
  readonly advice: readonly string[];
  readonly sajuConnectionHints: readonly string[];
};

export type MbtiFunctionProfile = {
  readonly dominant: string;
  readonly auxiliary: string;
  readonly tertiary: string;
  readonly inferior: string;
  readonly dominantMeaning: string;
  readonly auxiliaryMeaning: string;
  readonly tertiaryMeaning: string;
  readonly inferiorRisk: string;
};

export type MbtiSajuBridge = {
  readonly reinforcesTags: readonly InterpretationTagId[];
  readonly contrastsTags: readonly InterpretationTagId[];
  readonly compensatesTags: readonly InterpretationTagId[];
  readonly usefulSajuElements?: readonly FiveElement[];
  readonly difficultSajuElements?: readonly FiveElement[];
  readonly resonantTenGods?: readonly TenGod[];
  readonly likelySajuResonance?: readonly string[];
};

export type MbtiKnowledgeEntry = {
  readonly type: MbtiType;
  readonly labelKo: string;
  readonly commonAliasKo: string;
  readonly functionStack: readonly string[];
  readonly functionProfile?: MbtiFunctionProfile;
  readonly preferenceLetters?: readonly MbtiPreferenceLetter[];
  readonly temperamentGroup?: MbtiTemperamentGroup;
  readonly coreTemperamentKo?: string;
  readonly summary: string;
  readonly traitTags: readonly InterpretationTagId[];
  readonly riskTags: readonly InterpretationTagId[];
  readonly topicWeights: Partial<Record<SajuKnowledgeTopic, number>>;
  readonly sajuBridgeTags: readonly InterpretationTagId[];
  readonly topicInterpretations?: Partial<
    Record<SajuKnowledgeTopic, MbtiTopicInterpretation>
  >;
  readonly sajuBridge?: MbtiSajuBridge;
  readonly relationshipPreferences: {
    readonly attracts: readonly InterpretationTagId[];
    readonly needs: readonly InterpretationTagId[];
    readonly risks: readonly InterpretationTagId[];
  };
  readonly workStyleKo?: readonly string[];
  readonly moneyStyleKo?: readonly string[];
  readonly loveStyleKo?: readonly string[];
  readonly relationshipStyleKo?: readonly string[];
  readonly growthAdviceKo?: readonly string[];
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
