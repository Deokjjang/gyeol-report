import { axisGate, type ClaimCondition, type ClaimLevel } from "./claimCore";
import { CLAIM_REGISTRY } from "./claimRegistry";
import type { SemanticAxis } from "./semanticCore";
import type { FusionSplitType } from "./fusionCore";
import type { ResonanceCondition, ResonanceDefinition, ResonanceRisk } from "./personalResonanceCore";

export const existing = (condition: ClaimCondition): ResonanceCondition => ({ kind: "existing", condition });
export const a = (axis: SemanticAxis, band: "SUPPORT" | "MAIN" | "STRONG" = "MAIN", direction: 1 | -1 = 1) => existing(axisGate(axis, band, direction));
export const all = (...conditions: ResonanceCondition[]): ResonanceCondition => ({ kind: "all", conditions });
export const any = (...conditions: ResonanceCondition[]): ResonanceCondition => ({ kind: "any", conditions });
/** IDs are resolved against the read-only 3A registry; missing IDs fail validation. */
export const claim = (prefix: string, minLevel: ClaimLevel = 2): ResonanceCondition => ({ kind: "claim", id: CLAIM_REGISTRY.find(c => c.id.startsWith(`${prefix}_`))?.id ?? prefix, minLevel });
export const fusion = (ruleId: string): ResonanceCondition => ({ kind: "fusion", ruleId });
export const split = (split: FusionSplitType): ResonanceCondition => ({ kind: "fusion", split });
export const risk = (risk: ResonanceRisk): ResonanceCondition => ({ kind: "risk", risk });
export const limited = (axis: SemanticAxis): ResonanceCondition => ({ kind: "limited", axis });
export const synthesis = (theme: string) => existing({ kind: "synthesis", theme });
export function r(id: string, descriptionType: ResonanceDefinition["descriptionType"], semanticTheme: string, primaryAxes: SemanticAxis[], required: ResonanceCondition,
  humanDescription: string, options: Partial<ResonanceDefinition> = {}): ResonanceDefinition {
  return { id, descriptionType, semanticTheme, primaryAxes, required, humanDescription,
    semanticGroup: semanticTheme, contexts: ["identity", "work", "social"], optionalSupport: [], forbiddenConditions: [], alternatives: [],
    quality: "HUMAN_DESCRIPTIVE", specificityBase: .80, emotionalImpactBase: .75, priority: 50, exclusivityGroup: semanticTheme, polarity: "positive", ...options };
}
