/** Handoff fixtures identify required gates; this is not an actual Evidence Binder. */
export const BINDING_SAFETY_REQUIREMENTS = [
  { id: "CHILDREN_ANCESTRY", identifyWith: ["all ancestor domains", "relationship category", "original domain policy"], futureGate: "ALL_ANCESTOR_DOMAINS", sourceVerificationCannotApproveActualUse: true },
  { id: "BUSINESS_DOMAIN_TRANSFER", identifyWith: ["businessPartner policy", "WORK/CAREER/MONEY/INVESTMENT source domain"], futureGate: "PRODUCT_AND_DOMAIN_APPROVAL", sourceVerificationCannotApproveActualUse: true },
  { id: "PAIR_REFERENCE_AS_PERSONAL_TRAIT", identifyWith: ["source kind", "MBTI sourceType/targetType", "actual owner"], futureGate: "ACTUAL_PERSONAL_SOURCE", sourceVerificationCannotApproveActualUse: true },
  { id: "DEFINITION_AS_CALCULATED_PAIR", identifyWith: ["calculation definition", "producer", "actual emitted Pair ID"], futureGate: "ACTUAL_CALCULATED_FACT", sourceVerificationCannotApproveActualUse: true },
  { id: "NATAL_AS_PERIOD_EVENT", identifyWith: ["origin layer", "requested period", "original effective interval"], futureGate: "ACTUAL_PERIOD_FACT_AND_TIME_INTERSECTION", sourceVerificationCannotApproveActualUse: true },
  { id: "MIXED_TRANSITION_WINDOWS", identifyWith: ["all source intervals", "transition certainty", "excluded windows"], futureGate: "CONFIRMED_COMPATIBLE_INTERVALS", sourceVerificationCannotApproveActualUse: true },
  { id: "FUSION_WITHOUT_ROOTS", identifyWith: ["same-owner natal source", "same-owner MBTI source", "original hashes"], futureGate: "ALL_FUSION_ROOTS", sourceVerificationCannotApproveActualUse: true },
  { id: "REPEATED_FACT_ROOT", identifyWith: ["canonical fact roots", "reference reuse", "source ancestry"], futureGate: "INDEPENDENT_FACT_ROOT_ACCOUNTING", sourceVerificationCannotApproveActualUse: true },
] as const;
export type SourceUseFixture = { ancestryDomains: string[]; category: string; sourceKind: "MBTI_PAIR_REFERENCE" | "CALCULATION_DEFINITION" | "FUSION_RESEARCH" | "NATAL_FACT" | "OTHER"; requestedUse: "PERSONAL_TRAIT" | "CALCULATED_PAIR" | "PERIOD_EVENT" | "OTHER"; declaredOrigin: "natal" | "period" | "unknown"; mixedTransitionWindows: boolean; sourceRootsVerified: boolean; factRoots: string[]; actualOwnersDirectionsTimesVerified: boolean; customerApproved: false };
export function assessSourceUseFixture(f: SourceUseFixture): { requiredGates: string[]; independentRootCount: number; approvedForCustomer: false; eligibleCandidateProduced: false } {
  const gates = new Set<string>();
  if (f.ancestryDomains.includes("CHILDREN") && ["friendship", "coworker", "businessPartner", "managerReport"].includes(f.category)) gates.add("CHILDREN_ANCESTRY_PROHIBITED_WITHOUT_EXPLICIT_REVIEW");
  if (f.category === "businessPartner" && f.ancestryDomains.some(d => ["WORK", "CAREER", "THINKING", "MONEY", "INVESTMENT"].includes(d))) gates.add("EXISTING_BUSINESS_DOMAIN_POLICY_BLOCK");
  if (f.sourceKind === "MBTI_PAIR_REFERENCE" && f.requestedUse === "PERSONAL_TRAIT") gates.add("PAIR_REFERENCE_IS_NOT_PERSONAL_FACT");
  if (f.sourceKind === "CALCULATION_DEFINITION" && f.requestedUse === "CALCULATED_PAIR") gates.add("ACTUAL_PAIR_EVIDENCE_REQUIRED");
  if (f.declaredOrigin === "natal" && f.requestedUse === "PERIOD_EVENT") gates.add("ACTUAL_PERIOD_FACT_AND_INTERVAL_REQUIRED");
  if (f.mixedTransitionWindows) gates.add("TRANSITION_WINDOW_INTERSECTION_REQUIRED");
  if (f.sourceKind === "FUSION_RESEARCH" && !f.sourceRootsVerified) gates.add("ALL_FUSION_ROOTS_REQUIRED");
  if (new Set(f.factRoots).size !== f.factRoots.length) gates.add("REPEATED_ROOT_NOT_INDEPENDENT_EVIDENCE");
  if (!f.actualOwnersDirectionsTimesVerified) gates.add("ACTUAL_OWNER_DIRECTION_TIME_REQUIRED");
  gates.add("CUSTOMER_APPROVAL_REQUIRED");
  return { requiredGates: [...gates], independentRootCount: new Set(f.factRoots).size, approvedForCustomer: false, eligibleCandidateProduced: false };
}
