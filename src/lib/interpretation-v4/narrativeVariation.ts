import type { NarrativeBlock, NarrativeState } from "./narrativeTypes";
import { DOMAIN_VARIANTS } from "./narrativeDomainVariants";
import { PORTRAIT_VARIANTS } from "./narrativePortraitVariants";
import { LIFE_VARIANTS } from "./narrativeLifeVariants";
import { depthFeature } from "./materialDepth";

/** These are manifestations of reviewed Fusion rules, never personality inferred from a job/name. */
export type ExpressionLens = "drive" | "capacity" | "connect" | "notice" | "meaning" | "care" | "inquiry" | "challenge" | "practice" | "steady" | "privacy" | "natal";
export const EXPRESSION_RULES: Readonly<Record<ExpressionLens, readonly string[]>> = {
  capacity: ["entj-wealth-pressure-structure"], privacy: ["infj-marriage", "infj-depth"],
  drive: ["entj-pressure", "entj-needle", "estj-status"],
  connect: ["enfp-connection", "enfp-expression", "enfj-expression", "esfp-expression"],
  notice: ["isfp-needle", "isfp-love"], inquiry: ["intp-inquiry", "intp-pressure-learning-structure", "intj-inquiry"],
  meaning: ["infj-depth"], care: ["isfj-learning", "isfj-love"], challenge: ["entp-rules"],
  practice: ["estp-study", "estp-needle", "istp-study"], steady: ["istj-love", "istj-marriage", "istj-needle"], natal: [],
};
export function expressionLens(state: NarrativeState): ExpressionLens {
  for (const [lens, rules] of Object.entries(EXPRESSION_RULES) as [ExpressionLens, readonly string[]][]) {
    const has = (rule: string) => state.packet.fusions.some(f => f.ruleId === rule);
    if (lens === "privacy" ? rules.every(has) : rules.some(has)) return lens;
  }
  return "natal";
}
export function expressionFusions(state: NarrativeState) {
  return state.packet.fusions.filter(f => EXPRESSION_RULES[expressionLens(state)].includes(f.ruleId));
}
export type EditorialVariant = { readonly text: string; readonly sceneFamily?: string; readonly theme?: string };
export type VariantBank = Readonly<Record<string, Readonly<Partial<Record<ExpressionLens, EditorialVariant>>>>>;

/** Select before realization, by the actual root and domain. No text search, hashing,
 * cohort/order dependence, synonym replacement, deduplication or sentence deletion. */
export function realizeEditorialVariant(state: NarrativeState, block: NarrativeBlock): NarrativeBlock {
  const selectionState = block.id === "opening-bridge" ? { ...state, packet: { ...state.packet,
    fusions: state.packet.fusions.filter(f => block.proof.fusionIds.includes(f.ruleId)) } } : state;
  const lens = expressionLens(selectionState);
  // The opening must describe its chosen Fusion, not a different available pair.
  if (block.id === "opening-bridge") {
    const rules = selectionState.packet.fusions;
    if (rules.some(f => f.kind === "complement") ||
      (lens === "inquiry" && !rules.some(f => f.ruleId === "intp-pressure-learning-structure")) ||
      (lens === "drive" && !["entj-wealth", "entj-pressure"].every(id => rules.some(f => f.ruleId === id))) ||
      (lens === "notice" && !rules.some(f => f.ruleId === "isfp-needle")) ||
      (lens === "connect" && !rules.some(f => f.ruleId === "enfp-connection")) ||
      (lens === "care" && !rules.some(f => f.ruleId === "isfj-learning")) ||
      (lens === "steady" && !rules.some(f => ["istj-love", "istj-marriage"].includes(f.ruleId))) ||
      (lens === "practice" && !rules.some(f => f.ruleId === "estp-study"))) return block;
  }
  const slot = block.id.startsWith("work-") && ["work-character", "work-other-face"].includes(block.id) ? "work" :
    ["love-character", "love-other-face"].includes(block.id) ? "love" :
    block.id === "money-person" ? "money" : block.id === "people-character" ? "relationships" :
    block.id === "private-thinking" ? "study" : block.id;
  const candidates = [
    ...block.proof.features.map(feature => ({ key: `${feature}/${slot}`, bank: DOMAIN_VARIANTS })),
    ...block.proof.features.map(feature => ({ key: `${feature}/${slot}`, bank: PORTRAIT_VARIANTS })),
    ...(block.id === "natal-relations" ? [{ key: `natal-relations:${block.proof.features.some(f => f.includes("BRANCH_CLASH")) ? "clash" : "union"}:${block.proof.features.some(f => f.includes("COMBINATION")) ? "union" : "only"}`, bank: LIFE_VARIANTS }] : []),
    { key: block.id, bank: LIFE_VARIANTS },
  ];
  for (const { key, bank } of candidates) {
    const selected = bank[key]?.[lens];
    if (!selected) continue;
    if (key === "opening-fortune" && !block.proof.sourceRefs.includes(`v4:fortune-narrative:${lens === "practice" ? "people-support" : "recognized-place"}`)) continue;
    const usedFusions = expressionFusions(selectionState);
    const unique = (items: readonly string[]) => [...new Set(items)].sort();
    return { ...block, text: selected.text.replace(/\{type\}/g, usedFusions[0]?.mbtiEvidence.type ?? ""),
      editorial: { variant: `${key}/${lens}`, sceneFamily: selected.sceneFamily, theme: selected.theme },
      proof: { ...block.proof,
        features: unique([...block.proof.features, ...usedFusions.flatMap(f => f.myeongliEvidence.map(d => depthFeature(d.evidence.feature)))]),
        fusionIds: unique([...block.proof.fusionIds, ...usedFusions.map(f => f.ruleId)]),
        sourceRefs: unique([...block.proof.sourceRefs, ...usedFusions.flatMap(f => f.provenanceRefs), `v4:editorial-variant:${key}:${lens}`]) } };
  }
  return block;
}
