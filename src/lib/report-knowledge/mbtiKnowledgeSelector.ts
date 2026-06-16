import type {
  MbtiKnowledgeContext,
  MbtiTraitSeed,
  MbtiTypeCode,
} from "./mbtiKnowledgeTypes";
import { isMbtiTypeCode, requireMbtiTypeKnowledge } from "./mbtiTypeKnowledgeBase";

export type MbtiProductType =
  | "comprehensive"
  | "compatibility"
  | "career_money_study"
  | "relationship_family"
  | "yearly_flow"
  | "major_luck"
  | "date_selection";

export type SelectMbtiKnowledgeInput = {
  readonly mbti?: MbtiTypeCode | string | null;
  readonly contexts: readonly MbtiKnowledgeContext[];
  readonly maxTraitsPerContext?: number;
  readonly productType: MbtiProductType;
};

export type SelectedMbtiKnowledge = {
  readonly mbti: MbtiTypeCode;
  readonly selectedTraits: readonly MbtiTraitSeed[];
  readonly selectedScenes: readonly string[];
  readonly selectedSwitches: readonly string[];
  readonly relationshipNeeds: readonly string[];
  readonly compatibleTraitConditions: readonly string[];
  readonly frictionTraitConditions: readonly string[];
};

const comprehensiveContexts = [
  "core_identity",
  "communication",
  "work",
  "study",
  "money",
  "love",
  "family",
  "stress",
  "recovery",
  "growth",
] as const satisfies readonly MbtiKnowledgeContext[];

const minimalMbtiProductTypes = new Set<MbtiProductType>([
  "yearly_flow",
  "major_luck",
  "date_selection",
]);

function uniqueStrings(values: readonly string[], limit?: number): readonly string[] {
  const result = [...new Set(values.filter((value) => value.trim().length > 0))];

  return limit === undefined ? result : result.slice(0, limit);
}

function getContexts(input: SelectMbtiKnowledgeInput): readonly MbtiKnowledgeContext[] {
  if (input.productType === "comprehensive" && input.contexts.length === 0) {
    return comprehensiveContexts;
  }

  return input.contexts;
}

export function selectMbtiKnowledge(
  input: SelectMbtiKnowledgeInput,
): SelectedMbtiKnowledge | undefined {
  if (
    input.mbti === undefined ||
    input.mbti === null ||
    !isMbtiTypeCode(input.mbti) ||
    minimalMbtiProductTypes.has(input.productType)
  ) {
    return undefined;
  }

  const entry = requireMbtiTypeKnowledge(input.mbti);
  const maxTraitsPerContext = input.maxTraitsPerContext ?? 2;
  const requestedContexts = new Set(getContexts(input));
  const selectedTraits = entry.traitSeeds
    .filter((trait) => requestedContexts.has(trait.context))
    .reduce<MbtiTraitSeed[]>((accumulator, trait) => {
      const countInContext = accumulator.filter(
        (item) => item.context === trait.context,
      ).length;

      if (countInContext < maxTraitsPerContext) {
        accumulator.push(trait);
      }

      return accumulator;
    }, []);

  if (selectedTraits.length === 0) {
    return undefined;
  }

  return {
    mbti: entry.type,
    selectedTraits,
    selectedScenes: uniqueStrings(
      selectedTraits.flatMap((trait) => trait.sceneSeeds),
      18,
    ),
    selectedSwitches: uniqueStrings(
      selectedTraits.flatMap((trait) => trait.practicalSwitches),
      14,
    ),
    relationshipNeeds: entry.relationshipNeeds,
    compatibleTraitConditions: entry.compatibleTraitConditions,
    frictionTraitConditions: entry.frictionTraitConditions,
  };
}
