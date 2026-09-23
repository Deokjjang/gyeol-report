import { getMbtiSourceProfile, type MbtiSourceType, type MbtiTraitArea } from "../mbti";
import { interactionKey, matchFactCondition, type BridgeInteractionTrace, type FactCondition } from "./factConditions";
import { BRIDGE_SCENE_RULES } from "./interactionSceneRules";
import type { BridgeProductContext, ProductBridgeEvidencePacket } from "./types";

export type BridgeSceneContext = "identity" | "career" | "money" | "study" | "love" | "marriage" | "family" | "conflict" | "recovery";
export type BridgeSceneRule = {
  readonly id: string;
  readonly mbti: MbtiSourceType;
  readonly requires: FactCondition;
  readonly traits: readonly (readonly [MbtiTraitArea, string])[];
  readonly type: BridgeInteractionTrace["interactionType"];
  readonly contexts: readonly BridgeSceneContext[];
  readonly meaning: string;
  readonly scene: string;
  readonly strength: string;
  readonly risk: string;
  readonly practice: string;
};
export type BridgeInteractionScene = BridgeInteractionTrace & {
  readonly mbtiType: MbtiSourceType;
  readonly factScope: "natal" | "fortune-flow";
  readonly meaning: string;
  readonly scene: string;
  readonly strength: string;
  readonly risk: string;
  readonly practice: string;
  readonly mbtiBasis: readonly { readonly evidenceId: string; readonly area: MbtiTraitArea; readonly traitId: string; readonly reading: string }[];
};
export const BRIDGE_SCENE_CONTEXTS: Record<BridgeProductContext, readonly BridgeSceneContext[]> = {
  general: ["identity", "career", "money", "study", "love", "marriage", "family", "conflict", "recovery"],
  careerMoneyStudy: ["career", "money", "study"], loveMarriageChild: ["love", "marriage", "family", "conflict"],
  compatibility: ["career", "money", "love", "marriage", "family", "conflict", "recovery"],
  daeun: ["career", "money", "study", "recovery"], saeun: ["career", "money", "study", "conflict", "recovery"],
};
export function buildBridgeInteractionScenes(input: {
  readonly mbtiType: string | null | undefined;
  readonly factIds: ReadonlySet<string>;
  readonly productContext: BridgeProductContext;
  readonly limit?: number;
}): readonly BridgeInteractionScene[] {
  const source = getMbtiSourceProfile(input.mbtiType);
  if (!source) return [];
  const flow = input.productContext === "daeun" || input.productContext === "saeun";
  const seen = new Set<string>();
  const scenes = BRIDGE_SCENE_RULES.flatMap((rule): BridgeInteractionScene[] => {
    if (rule.mbti !== source.type || !rule.contexts.some(c => BRIDGE_SCENE_CONTEXTS[input.productContext].includes(c))) return [];
    const factIds = matchFactCondition(rule.requires, input.factIds);
    if (!factIds) return [];
    const mbtiBasis = rule.traits.flatMap(([area, traitId]) => {
      const trait = source.traits?.[area]?.find(t => t.id === traitId);
      return trait?.plainKo ? [{ area, traitId, evidenceId: `mbti:${source.type}:traits:${area}:${traitId}`, reading: trait.plainKo }] : [];
    });
    if (!mbtiBasis.length || mbtiBasis.length !== rule.traits.length) return [];
    const trace: BridgeInteractionTrace = {
      interactionId: `bridge-v2:${rule.id}`, ruleId: rule.id, interactionType: rule.type,
      myeongliEvidenceIds: factIds, mbtiEvidenceIds: mbtiBasis.map(b => b.evidenceId),
      contexts: rule.contexts, confidence: "inferred", intensity: "low",
    };
    const key = interactionKey(trace);
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ ...trace, mbtiType: source.type, factScope: flow ? "fortune-flow" : "natal",
      meaning: rule.meaning, scene: rule.scene, strength: rule.strength, risk: rule.risk, practice: rule.practice, mbtiBasis }];
  });
  // Identity leads the comprehensive report; no count-derived strength or arbitrary rotation.
  return scenes.sort((a, b) => input.productContext === "general"
    ? Number(b.contexts.includes("identity")) - Number(a.contexts.includes("identity")) : 0).slice(0, input.limit ?? 8);
}
/** A scene subsumes a hint only when it covers the same facts and the actual trait references. */
export function sceneCoversInteraction(scene: BridgeInteractionTrace, trace: BridgeInteractionTrace): boolean {
  const contexts: Readonly<Record<string, string>> = { personality: "identity", strengths: "identity", weaknesses: "recovery", final_advice: "recovery", growth: "recovery", work_career: "career", workplace: "career", money_asset: "money", investment: "money", study_growth: "study", love_relationship: "love", parenting: "family", human_relations: "conflict", relationship: "conflict", relationships: "conflict", general: "identity" };
  const sceneContexts = scene.contexts.map(context => contexts[context] ?? context);
  return trace.interactionType === scene.interactionType && trace.contexts.some(context => sceneContexts.includes(contexts[context] ?? context)) &&
    trace.myeongliEvidenceIds.length > 0 && trace.mbtiEvidenceIds.length > 0 &&
    trace.myeongliEvidenceIds.every(id => scene.myeongliEvidenceIds.includes(id)) &&
    trace.mbtiEvidenceIds.every(id => scene.mbtiEvidenceIds.includes(id));
}
export function formatBridgeScene(scene: BridgeInteractionScene): string {
  return [scene.meaning, scene.scene, scene.strength, scene.risk, scene.practice].join(" ");
}
export function productBridgeScenes(packet: ProductBridgeEvidencePacket | undefined): readonly BridgeInteractionScene[] {
  const scenes = packet ? [...packet.primaryEvidence, ...packet.supportingEvidence, ...packet.cautionEvidence]
    .flatMap(item => item.evidence.scenes ?? []) : [];
  return [...new Map(scenes.map(scene => [interactionKey(scene), scene])).values()];
}
export function formatProductBridgeScenes(packet: ProductBridgeEvidencePacket | undefined, limit = 2): string {
  const scenes = productBridgeScenes(packet).slice(0, limit);
  if (!scenes.length) return "";
  const scope = scenes[0].factScope === "fortune-flow"
    ? "다음 장면은 원래 성격의 확정이 아니라 선택한 운의 신호와 입력한 행동 성향을 함께 살피는 기준입니다. " : "";
  return scope + scenes.map(formatBridgeScene).join("\n\n");
}
