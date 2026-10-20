import { canonicalJson } from "../sourceReader";
import { RELATIONSHIP_DOMAINS } from "../../../interpretation-v4/relationshipProductView";
import { classifyMeaningReuse } from "../semantic-domain-verification/rules";
export function loveDomainReasons(domains: readonly string[]) { return domains.some(d => !(RELATIONSHIP_DOMAINS as readonly string[]).includes(d)) ? ["LOVE_REQUIRED_ANCESTOR_DOMAIN_NOT_ALLOWED"] : []; }
export const LOVE_POLICY = {
  relationshipStatus: "UNKNOWN_UNLESS_ACTUALLY_ENTERED",
  datingProjectionIsInput: false, fixedAB: true, inferGenderRoles: false,
  missingPair: "NO_RELATION_DETECTED_IS_NOT_BAD_COMPATIBILITY",
  pairReference: "REFERENCE_ONLY_NOT_INDIVIDUAL_SCORING_OR_OBSERVED_BEHAVIOR",
  signedAxes: "KEEP_OWNER_AND_SIGN; SAME_OR_OPPOSITE_IS_NOT_OUTCOME",
  facets: "APPLICATION_CONDITION_NOT_NEW_ROOT",
  friction: "PERSONAL_TENDENCY_AND_PAIR_DIFFERENCE_AND_HYPOTHESIS_ARE_DISTINCT",
  repair: "VERIFIED_PRECEDING_FRICTION_REQUIRED; NO_ASSUMED_PAST_CONFLICT",
  repairSteps: ["FACT_CHECK", "SENDER_ADJUSTMENT", "RECIPIENT_QUESTION", "CONSENT", "REVIEW_TIME", "BOUNDARIES"],
  positive: "CONDITIONS_COUNTEREXAMPLES_CONSENT_AND_OVERUSE_REQUIRED",
  recall: "ACTUAL_SAME_OWNER_TYPE_ROOT_DIRECTION_MEANING_CLAIM_CONTEXT_DISPLAY_REQUIRED",
  rootBudget: null, newActualRoots: 0, customerDisplayLedgerIssued: false,
} as const;
export const SAFETY_SIGNALS = ["VIOLENCE", "THREAT", "COERCION", "STALKING", "NO_CONTACT_CONSENT", "SEXUAL_BOUNDARY", "SURVEILLANCE", "ECONOMIC_CONTROL", "PRIVACY_VIOLATION", "RETALIATION"] as const;
export type Display = { id: string; address: string; owners: string[]; types: string[]; roots: string[]; direction: string | null; meaning: string; claim: string; context: string; actuallyDisplayed: boolean };
export function compatibleDisplay(expected: Omit<Display, "id" | "address" | "actuallyDisplayed">, displays: readonly Display[]) {
  return displays.some(d => d.actuallyDisplayed === true && /^CH0[1-8]\.P[1-4](?:\.S[1-4])?$/.test(d.address) && d.id.length > 0 && ["owners", "types", "roots", "direction", "meaning", "claim", "context"].every(k => canonicalJson(d[k as keyof Display]) === canonicalJson(expected[k as keyof typeof expected])));
}
export function safetyReasons(signals: readonly string[], forcedContact: boolean, forcedRepair: boolean) { return signals.some(s => (SAFETY_SIGNALS as readonly string[]).includes(s)) && (forcedContact || forcedRepair) ? ["UNSAFE_REPAIR_OR_CONTACT_BLOCKED"] : []; }
export type Meaning = { id: string; claim: string; owner: string; direction: string | null; context: string; application: string; condition: string; function: "NEW_FACT" | "NEW_APPLICATION" | "RECALL"; reviewed: boolean };
export function meaningConflict(a: Meaning, b: Meaning, sameRoot: boolean): string[] {
  if (!a.reviewed || !b.reviewed) return ["MEANING_REVIEW_REQUIRED"];
  const reasons = [];
  const reuse = classifyMeaningReuse({ sourceRootKeys: sameRoot ? ["synthetic:shared-root"] : [], priorRootKeys: sameRoot ? ["synthetic:shared-root"] : [], sourceClaimId: a.claim, targetClaimId: b.claim, sourceMeaningId: a.id, targetMeaningId: b.id, priorQuestion: a.application, targetQuestion: b.application, priorConditions: [a.condition], targetConditions: [b.condition], priorAction: a.application, targetAction: b.application, recallRequested: b.function === "RECALL", actuallyDisplayed: b.function === "RECALL" });
  if (["SAME_CLAIM", "SAME_MEANING"].includes(reuse.relation)) reasons.push("SAME_MEANING_OR_CLAIM");
  if (b.function !== "RECALL" && (a.id === b.id || a.claim === b.claim)) reasons.push("SAME_MEANING_OR_CLAIM");
  if (sameRoot && a.function === "NEW_FACT" && b.function === "NEW_FACT") reasons.push("SAME_ROOT_NOT_NEW_FACT");
  if (sameRoot && b.function === "NEW_APPLICATION" && (a.application === b.application || a.condition === b.condition)) reasons.push("NEW_APPLICATION_CONDITION_REQUIRED");
  return reasons;
}
