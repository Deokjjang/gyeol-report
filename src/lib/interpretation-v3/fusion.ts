import { BRIDGE_SCENE_RULES } from "../report-knowledge/bridge/interactionSceneRules";
import { matchFactCondition } from "../report-knowledge/bridge/factConditions";
import type { BridgeInteractionTrace } from "../report-knowledge/bridge/factConditions";
import type { Evidence } from "./types";
import { canonicalFeatureId } from "./evidence";

export type MbtiFusion = {
  readonly id: string;
  readonly type: BridgeInteractionTrace["interactionType"];
  readonly evidenceRefs: readonly string[];
  readonly sourceRefs: readonly string[];
  readonly contexts: readonly string[];
  readonly meaning: string;
  readonly scene: string;
  readonly strength: string;
  readonly caution: string;
  readonly directive: string;
  readonly scope: "natal" | "selected-flow";
};
/** Existing predicates + actual trait records; type letters alone cannot invent
 * an interaction. Text here remains source MATERIAL, not published V3 copy. */
export function fuseMbti(evidence: readonly Evidence[], subject: Evidence["subject"], period?: string): readonly MbtiFusion[] {
  const facts = evidence.filter(e => e.subject === subject && e.certainty !== "weak" && e.sourceRefs.length &&
    (e.scope === "natal" || e.scope === "behavior" || Boolean(period && e.period === period))).toSorted((a, b) => a.id.localeCompare(b.id));
  const ids = new Set(facts.filter(e => e.kind !== "mbti").map(e => canonicalFeatureId(e.featureId)));
  return BRIDGE_SCENE_RULES.flatMap(rule => {
    const refs = matchFactCondition({ allOf: rule.requires.allOf.map(g => g.map(canonicalFeatureId)), noneOf: rule.requires.noneOf?.map(canonicalFeatureId) }, ids);
    const traits = rule.traits.map(([area, id]) => `mbti:${rule.mbti}:traits:${area}:${id}`);
    if (!refs || !traits.length || traits.some(id => !facts.some(e => e.kind === "mbti" && e.featureId === id))) return [];
    const selected = facts.filter(e => refs.includes(canonicalFeatureId(e.featureId)) || traits.includes(e.featureId));
    return [{ id: `v3:mbti:${rule.id}`, type: rule.type, evidenceRefs: selected.map(e => e.id),
      sourceRefs: [`bridge/interactionSceneRules:${rule.id}`, ...selected.flatMap(e => e.sourceRefs)], contexts: rule.contexts,
      meaning: rule.meaning, scene: rule.scene, strength: rule.strength, caution: rule.risk, directive: rule.practice,
      scope: selected.some(e => ["major", "annual", "monthly"].includes(e.scope)) ? "selected-flow" as const : "natal" as const }];
  });
}
