import type { FactCondition, BridgeInteractionTrace } from "./bridge/factConditions";
import type { InterpretationTagId } from "./interpretationTags";
import type { MbtiType } from "./mbtiKnowledgeTypes";
import type { SajuKnowledgeTopic } from "./sajuKnowledgeTypes";

export type FusionRuleKind =
  | "reinforcement"
  | "contrast"
  | "compensation"
  | "topic_specialization";

export type FusionKnowledgeRule = {
  readonly id: string;
  readonly kind: FusionRuleKind;
  readonly requires: FactCondition;
  readonly availability?: "needs_strength_evidence";
  readonly interactionType: BridgeInteractionTrace["interactionType"];
  readonly match?: BridgeInteractionTrace;
  readonly sajuEntryIds: readonly string[];
  readonly mbtiTypes?: readonly MbtiType[];
  readonly requiredSajuTags?: readonly InterpretationTagId[];
  readonly requiredMbtiTags?: readonly InterpretationTagId[];
  readonly topic: SajuKnowledgeTopic;
  readonly priority: number;
  readonly summary: string;
  readonly interpretation: string;
  readonly caution?: string;
  readonly advice?: string;
  readonly phraseSeeds: readonly string[];
};
