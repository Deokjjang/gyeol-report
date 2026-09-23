import { MBTI_TYPES, type MbtiKnowledgeContext, type MbtiTraitSeed, type MbtiTypeCode, type MbtiTypeKnowledge } from "./mbtiKnowledgeTypes";
import { getMbtiSourceProfile, type MbtiTraitArea } from "./mbti/sourceRuntimeAdapter";

// Context is a report question, never a personality inferred from a type letter.
const contextAreas: Record<MbtiKnowledgeContext, readonly MbtiTraitArea[]> = {
  core_identity: ["identity", "thinkingStyle"], communication: ["communication"], decision: ["thinkingStyle"],
  work: ["career", "workplace"], study: ["study"], money: ["money", "investment"], love: ["love"],
  friendship: ["relationships"], family: ["marriage", "parenting", "child"], conflict: ["communication", "risks"],
  stress: ["risks"], recovery: ["growth"], growth: ["growth"], compatibility: ["relationships", "love"],
};

// Six authored Bridge scenes keep their established IDs. These are source-backed ID
// aliases, not a second personality DB; all sixteen profiles follow the same mapping.
export const MBTI_BRIDGE_TRAIT_ALIASES = [
  { type: "INTP", context: "core_identity", area: "thinkingStyle", trait: "ti_internal_model", id: "mbti_intp_core_identity_1" },
  { type: "INTP", context: "core_identity", area: "workplace", trait: "needs_thinking_time", id: "mbti_intp_core_identity_2" },
  { type: "INTP", context: "money", area: "money", trait: "automated_money_routine", id: "mbti_intp_money_1" },
  { type: "ENTJ", context: "communication", area: "communication", trait: "wait_and_listen_gap", id: "mbti_entj_communication_2" },
  { type: "ENTJ", context: "money", area: "money", trait: "expansion_reserve_limit", id: "mbti_entj_money_2" },
  { type: "ENTJ", context: "work", area: "career", trait: "large_team_manager", id: "mbti_entj_work_1" },
] as const;

function buildSourceKnowledge(type: MbtiTypeCode): MbtiTypeKnowledge {
  const source = getMbtiSourceProfile(type)!;
  const texts = (areas: readonly MbtiTraitArea[], field: "plainKo" | "positiveUse" | "risk") =>
    [...new Set(areas.flatMap(area => (source.traits?.[area] ?? []).flatMap(t => t[field] ? [t[field]!] : [])))];
  const traitSeeds = Object.entries(contextAreas).flatMap(([key, areas]) => {
    const context = key as MbtiKnowledgeContext;
    const aliases = MBTI_BRIDGE_TRAIT_ALIASES.filter(a => a.type === type && a.context === context);
    const candidates = [
      ...aliases.map(a => ({ area: a.area, trait: source.traits?.[a.area]?.find(t => t.id === a.trait), alias: a.id })),
      ...areas.flatMap(area => (source.traits?.[area] ?? []).map(trait => ({ area, trait, alias: undefined }))),
    ];
    const seen = new Set<string>();
    return candidates.flatMap(({ area, trait, alias }): MbtiTraitSeed[] => {
      if (!trait?.id || !trait.plainKo || seen.has(trait.id)) return [];
      seen.add(trait.id);
      const sourceEvidenceId = `mbti:${type}:traits:${area}:${trait.id}`;
      return [{ id: alias ?? `${sourceEvidenceId}:${context}`, sourceEvidenceId, type, context,
        label: trait.label ?? trait.id, description: trait.plainKo,
        sceneSeeds: [trait.strongLine ?? trait.plainKo], strengths: trait.positiveUse ? [trait.positiveUse] : [],
        risks: trait.risk ? [trait.risk] : [], practicalSwitches: trait.positiveUse ? [trait.positiveUse] : [],
        tone: "direct", tags: [context, type.toLowerCase()] }];
    });
  });
  return { type, nickname: source.titleKo, oneLine: source.oneLine, corePattern: source.summary?.identity ?? source.oneLine,
    traitSeeds, relationshipNeeds: texts(["relationships", "communication"], "positiveUse").slice(0, 4),
    compatibleTraitConditions: texts(["love", "marriage"], "positiveUse").slice(0, 4),
    frictionTraitConditions: texts(["relationships", "communication"], "risk").slice(0, 4),
    stressSignals: texts(["risks"], "plainKo").slice(0, 3), recoverySignals: texts(["growth"], "plainKo").slice(0, 3) };
}
export const MBTI_TYPE_KNOWLEDGE_BASE: readonly MbtiTypeKnowledge[] = MBTI_TYPES.map(buildSourceKnowledge);
export const MBTI_TYPE_KNOWLEDGE_BY_TYPE = new Map(MBTI_TYPE_KNOWLEDGE_BASE.map(entry => [entry.type, entry]));
export function requireMbtiTypeKnowledge(type: MbtiTypeCode): MbtiTypeKnowledge {
  const entry = MBTI_TYPE_KNOWLEDGE_BY_TYPE.get(type);
  if (entry === undefined) throw new Error(`Unknown MBTI type: ${type}`);
  return entry;
}
export function isMbtiTypeCode(value: string): value is MbtiTypeCode {
  return (MBTI_TYPES as readonly string[]).includes(value);
}
