import type { InterpretationContext } from "./semanticCore";
import { BAND_ORDER, fusionOrder, type FusionSide, type FusionScope } from "./fusionCore";

export const FUSION_CONTEXTS = ["identity", "work", "money", "social", "love", "stress", "learning", "recovery"] as const;
/** Symmetric, explicit compatibility; identity is the general source scope. */
export const FUSION_CONTEXT_MATRIX = {
  identity: { identity: .85, work: .9, money: .9, social: .9, love: .9, stress: .9, learning: .9, recovery: .9 },
  work: { identity: .9, work: 1, money: .7, social: 0, love: 0, stress: .7, learning: .7, recovery: 0 },
  money: { identity: .9, work: .7, money: 1, social: 0, love: 0, stress: 0, learning: 0, recovery: 0 },
  social: { identity: .9, work: 0, money: 0, social: 1, love: .7, stress: .7, learning: 0, recovery: 0 },
  love: { identity: .9, work: 0, money: 0, social: .7, love: 1, stress: 0, learning: 0, recovery: 0 },
  stress: { identity: .9, work: .7, money: 0, social: .7, love: 0, stress: 1, learning: 0, recovery: .7 },
  learning: { identity: .9, work: .7, money: 0, social: 0, love: 0, stress: 0, learning: 1, recovery: 0 },
  recovery: { identity: .9, work: 0, money: 0, social: 0, love: 0, stress: .7, learning: 0, recovery: 1 },
} as const satisfies Record<InterpretationContext, Record<InterpretationContext, number>>;
export const scopeContext = (scope: FusionScope): InterpretationContext => scope === "general" ? "identity" : scope;
export const fusionContextFit = (a: FusionScope, b: FusionScope): number => FUSION_CONTEXT_MATRIX[scopeContext(a)][scopeContext(b)];
export type FusionSidePair = { myeongli: FusionSide; mbti: FusionSide; context: InterpretationContext; fit: number };

/** Exact context wins. General evidence supplements the same direction only;
 * a work-only contribution can never silently become a love contribution. */
export function selectFusionPair(m: readonly FusionSide[], b: readonly FusionSide[], context: InterpretationContext): FusionSidePair | undefined {
  const pairs: FusionSidePair[] = [];
  for (const myeongli of m) for (const mbti of b) {
    const x = scopeContext(myeongli.scope), y = scopeContext(mbti.scope), fit = fusionContextFit(myeongli.scope, mbti.scope);
    if (!fit || (context === "identity" ? x !== "identity" || y !== "identity" : x !== context && y !== context)) continue;
    pairs.push({ myeongli, mbti, context, fit });
  }
  return pairs.sort((a, b) => b.fit - a.fit ||
    (BAND_ORDER[b.myeongli.band] + BAND_ORDER[b.mbti.band]) - (BAND_ORDER[a.myeongli.band] + BAND_ORDER[a.mbti.band]) ||
    b.mbti.evidenceIds.length - a.mbti.evidenceIds.length ||
    fusionOrder(`${a.myeongli.scope}:${a.mbti.scope}`, `${b.myeongli.scope}:${b.mbti.scope}`))[0];
}
