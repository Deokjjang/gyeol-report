import { RELATIONSHIP_DOMAINS } from "../../../interpretation-v4/relationshipProductView";
import { compatibleDisplay, type Display as GenericDisplay } from "../compatibility-love-specialist-engine/policy";
import { evaluateContext, type ContextDeclaration } from "./developmentalContext";
import { ROLE_VERSION } from "./roleValidator";
export { meaningConflict } from "../compatibility-love-specialist-engine/policy";
export type { Meaning } from "../compatibility-love-specialist-engine/policy";
export type Display = GenericDisplay & { roleVersion: string; developmentalContext: string };
export const SAFETY_SIGNALS = ["CHILD_ABUSE", "NEGLECT", "VIOLENCE", "THREAT", "COERCION", "STALKING", "SURVEILLANCE", "PRIVACY_VIOLATION", "SEXUAL_BOUNDARY", "ECONOMIC_CONTROL", "PARENT_EMOTIONAL_BURDEN", "UNSAFE_RECONTACT"] as const;
export const UNKNOWN_FACTS = ["parentage", "guardianship", "cohabitation", "familyHistory", "childAbility", "schoolPerformance", "developmentalAssessment", "emotionalHealth", "childConsent", "supportNeed", "legalAuthority", "actualRisk"] as const;
export type ParentChildAssertion = {
  roleVersion: string | null; roleDeclarationChanged: boolean; roleFromDemographics: boolean; context: ContextDeclaration | null; allowedContexts: string[];
  parentResponsible: boolean; parentSelfRegulates: boolean; parentSeeksAdultSupport: boolean; parentExplains: boolean;
  childVoiceOptional: boolean; childHelpOptional: boolean; childBoundaryOptional: boolean;
  childMustRepairParent: boolean; equalBlame: boolean; forcedForgiveness: boolean;
  adultIndependentDecision: boolean; adultConsent: boolean; parentFinalDecision: boolean;
  abilityPrediction: boolean; schoolPrediction: boolean; developmentalDiagnosis: boolean;
  monitoringAuthorizedByCare: boolean; obedienceAuthorizedByDuty: boolean; neglectAuthorizedByAutonomy: boolean;
  trustProvenBySilence: boolean; helpDifficultyCausedByMbti: boolean; forcedDisclosure: boolean; parentingOutcomeClaim: boolean; pairRelationOutcomeClaim: boolean; parentChildPatternClaim: boolean; equalAdultJudgmentRequiredForMinor: boolean; withholdSupportBecauseAdult: boolean;
  actualRecovery: boolean; preventionOnly: boolean; requiredFacts: string[];
  requiredSourceDomains: { domain: string; owner: string; scoringSupported: boolean }[];
};
export function parentChildDomainReasons(domains: readonly string[]) {
  const allowed = RELATIONSHIP_DOMAINS.filter(d => d !== "LOVE" && d !== "MARRIAGE");
  return domains.some(d => !(allowed as readonly string[]).includes(d)) ? ["PARENT_CHILD_REQUIRED_ANCESTOR_DOMAIN_NOT_ALLOWED"] : [];
}
export function safetyReasons(signals: readonly string[], forcedContact: boolean, forcedRepair: boolean) {
  return signals.some(s => (SAFETY_SIGNALS as readonly string[]).includes(s)) && (forcedContact || forcedRepair) ? ["UNSAFE_REPAIR_OR_CONTACT_BLOCKED"] : [];
}
export function validateParentChildAssertion(a: ParentChildAssertion) {
  const reasons = [...evaluateContext(a.allowedContexts, a.context ?? undefined).reasons];
  if (a.roleVersion !== ROLE_VERSION) reasons.push(a.roleVersion === null ? "V4_FIXED_ROLE_REQUIRED" : "INVALID_ROLE_VERSION");
  if (a.roleDeclarationChanged) reasons.push("WHOLE_SWAP_ROLE_DECLARATION_CHANGED");
  if (a.roleFromDemographics) reasons.push("DEMOGRAPHICS_DO_NOT_ASSIGN_PARENT_CHILD_ROLE");
  if (a.trustProvenBySilence || a.helpDifficultyCausedByMbti || a.forcedDisclosure) reasons.push("TRUST_COMMUNICATION_CONTEXT_UNVERIFIED");
  if (a.parentingOutcomeClaim || a.pairRelationOutcomeClaim) reasons.push("PARENTING_OUTCOME_UNVERIFIED");
  if (a.parentChildPatternClaim) reasons.push("PAIR_PATTERN_UNSUPPORTED");
  if (a.context?.context !== "ADULT" && a.equalAdultJudgmentRequiredForMinor) reasons.push("MINOR_PROTECTION_REQUIRED");
  if (a.context?.context === "ADULT" && a.withholdSupportBecauseAdult) reasons.push("ACTUAL_SUPPORT_NEED_UNKNOWN");
  if (!a.parentResponsible || !a.parentSelfRegulates || !a.parentSeeksAdultSupport || !a.parentExplains) reasons.push("PARENT_RESPONSIBILITY_REQUIRED");
  if (!a.childVoiceOptional || !a.childHelpOptional || !a.childBoundaryOptional) reasons.push("CHILD_CHOICE_AND_HELP_OPTION_REQUIRED");
  if (a.childMustRepairParent) reasons.push("CHILD_REPAIR_BURDEN_FORBIDDEN");
  if (a.equalBlame) reasons.push("NO_EQUAL_BLAME_ASSUMPTION");
  if (a.forcedForgiveness) reasons.push("NO_FORCED_FORGIVENESS");
  if (a.context?.context === "ADULT" && (!a.adultIndependentDecision || !a.adultConsent || a.parentFinalDecision)) reasons.push("ADULT_AUTONOMY_REQUIRED");
  if (a.abilityPrediction || a.schoolPrediction || a.developmentalDiagnosis) reasons.push("LEARNING_DEVELOPMENT_CLAIM_FORBIDDEN");
  if (a.monitoringAuthorizedByCare || a.obedienceAuthorizedByDuty || a.neglectAuthorizedByAutonomy) reasons.push("AXIS_IS_NOT_AUTHORITY_OR_PROTECTION_FACT");
  if (a.actualRecovery && a.preventionOnly) reasons.push("PREVENTION_IS_NOT_ACTUAL_RECOVERY");
  for (const fact of a.requiredFacts) reasons.push("ACTUAL_FAMILY_FACT_UNKNOWN:" + fact);
  for (const s of a.requiredSourceDomains) {
    if (s.domain === "PARENTS" && s.owner !== "A") reasons.push("PARENTS_SOURCE_WRONG_OWNER");
    if (s.domain === "CHILDREN" && s.owner !== "B") reasons.push("CHILDREN_SOURCE_WRONG_OWNER");
    if (["PARENTS", "CHILDREN"].includes(s.domain)) {
      reasons.push("SCORING_PROJECTION_NOT_SUPPORTED");
      if (s.scoringSupported) reasons.push("NON_SCORING_SOURCE_PROMOTED");
    }
    if (s.domain === "CHILDREN" && a.context?.context === "ADULT") reasons.push("ADULT_CHILD_TRAIT_TRANSFER_UNAPPROVED");
  }
  return [...new Set(reasons)].sort();
}
export function parentChildRecallDisplay(expected: Omit<Display, "id" | "address" | "actuallyDisplayed">, displays: readonly Display[], introductionAddress: string | null) {
  return !!introductionAddress && compatibleDisplay(expected, displays.filter(d => d.address === introductionAddress && d.roleVersion === expected.roleVersion && d.developmentalContext === expected.developmentalContext));
}
export const PARENT_CHILD_POLICY = { roleVersion: ROLE_VERSION, parentOwner: "A", childOwner: "B", actualParentage: "UNKNOWN", development: "UNKNOWN_UNLESS_EXPLICITLY_VERIFIED", ageCalculation: false, scoringDomainExpansion: false, responsibility: "ASYMMETRIC_PARENT_RESPONSIBILITY_CHILD_OPTIONS", childMustRepairParent: false, adultParentFinalAuthority: false, parentChildPatternExists: false, actualCustomerApprovals: 0, customerDisplayLedgerIssued: false, writerUnchanged: true } as const;
export const PARENT_CHILD_CONFLICT_TYPES = ["SAME_UNDERLYING_FACT", "SAME_MEANING", "DIFFERENT_OWNER", "DIFFERENT_DIRECTION", "WRONG_ROLE_VERSION", "ROLE_DECLARATION_CHANGED", "PARENT_CHILD_RESPONSIBILITY_ASYMMETRY", "DEVELOPMENTAL_STAGE_UNVERIFIED", "MINOR_PROTECTION_REQUIRED", "ADULT_AUTONOMY_REQUIRED", "CHILD_REPAIR_BURDEN_FORBIDDEN", "PARENTS_SOURCE_WRONG_OWNER", "CHILDREN_SOURCE_WRONG_OWNER", "NON_SCORING_SOURCE_PROMOTED", "PAIR_PATTERN_UNSUPPORTED", "UNSUPPORTED_RELATION", "INCOMPLETE_ANCESTRY", "DISALLOWED_DOMAIN", "UNSAFE_REPAIR", "RECALL_REQUIRES_INTRODUCTION", "MEANING_REVIEW_REQUIRED"] as const;
