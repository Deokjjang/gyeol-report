import type { EditorialCandidate } from "./comprehensivePlanCore";

export type RecoverySourceKind = "RECOVERY_DIRECT" | "ENERGY_PATTERN" | "ENVIRONMENT_FIT" | "OVERUSE_COST" | "GENERIC_TRAIT";
export function classifyRecovery(c: EditorialCandidate): { kind: RecoverySourceKind; relevance: number } {
  if (c.sourceType === "GUIDANCE" && c.operatingRuleType === "RECOVERY") return { kind: "RECOVERY_DIRECT", relevance: 1 };
  if (c.primaryAxes.includes("RECOVERY_NEED") && /회복|쉬|정리/.test(c.sourceText)) return { kind: "RECOVERY_DIRECT", relevance: 1 };
  if (/혼자.*회복|몸은 쉬.*생각|머리는.*퇴근/.test(c.sourceText)) return { kind: "ENERGY_PATTERN", relevance: .9 };
  if (/편한 환경|회복할 때.*환경/.test(c.sourceText)) return { kind: "ENVIRONMENT_FIT", relevance: .85 };
  // Considerate restraint ("몰아붙이지 않는") is not an overwork/recovery source.
  if (/지칠|지치|몰아붙(?:입|이게|일|이는)|일이.*늘어|성취를 느낄/.test(c.sourceText)) return { kind: "OVERUSE_COST", relevance: .7 };
  return { kind: "GENERIC_TRAIT", relevance: 0 };
}
