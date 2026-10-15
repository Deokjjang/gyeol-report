import {RELATIONSHIP_DOMAINS} from "../../../interpretation-v4/relationshipProductView";
// Generic identity and meaning-reuse comparisons only; no Love priorities or
// relationship-state policy are reused.
import {compatibleDisplay,type Display} from "../compatibility-love-specialist-engine/policy";
export {compatibleDisplay,meaningConflict} from "../compatibility-love-specialist-engine/policy";
export type {Display,Meaning} from "../compatibility-love-specialist-engine/policy";
export {MARRIAGE_SAFETY_SIGNALS as SAFETY_SIGNALS,marriageSafetyReasons as safetyReasons} from "./householdContext";
export function marriageDomainReasons(domains:readonly string[]) {return domains.some(d=>!(RELATIONSHIP_DOMAINS as readonly string[]).includes(d))?["MARRIAGE_REQUIRED_ANCESTOR_DOMAIN_NOT_ALLOWED"]:[];}
export const MARRIAGE_POLICY={relationshipStatus:"UNKNOWN_UNLESS_ACTUALLY_ENTERED",marriedProjectionIsInput:false,fixedAB:true,inferGenderRoles:false,missingPair:"NO_RELATION_DETECTED_IS_NOT_BAD_COMPATIBILITY",pairReference:"REFERENCE_ONLY_NOT_INDIVIDUAL_SCORING_OR_OBSERVED_BEHAVIOR",signedAxes:"KEEP_OWNER_AND_SIGN; SAME_OR_OPPOSITE_IS_NOT_OUTCOME",facets:"APPLICATION_CONDITION_NOT_NEW_ROOT",friction:"POSSIBLE_CONDITION_NOT_ACTUAL_HOUSEHOLD_HISTORY",repair:"PREVENTION_DISTINCT_FROM_RECOVERY; VERIFIED_PRECEDING_CONDITION_REQUIRED_FOR_RECOVERY",repairSteps:["FACT_CHECK","COMPLETION_STANDARD","AUTHORITY","PERSON_A_ADJUSTMENT","PERSON_B_ADJUSTMENT","HANDOVER","EXCEPTION","REVIEW_TIME","CONSENT","SAFETY_BOUNDARY"],positive:"CONDITIONS_COUNTEREXAMPLES_CONSENT_AND_OVERUSE_REQUIRED",recall:"ACTUAL_SAME_OWNER_TYPE_ROOT_DIRECTION_MEANING_CLAIM_CONTEXT_DISPLAY_REQUIRED",rootBudget:null,newActualRoots:0,customerDisplayLedgerIssued:false} as const;
export const MARRIAGE_CONFLICT_TYPES=["SAME_UNDERLYING_FACT","SAME_MEANING","DIFFERENT_PERSON_OWNER","DIFFERENT_DIRECTION","DIFFERENT_HOUSEHOLD_APPLICATION","DIFFERENT_TASK_PHASE","HOUSEHOLD_STATUS_UNKNOWN","MARRIAGE_CATEGORY_NOT_FACT","FINANCIAL_CONTEXT_UNVERIFIED","SHARED_DECISION_RIGHT_UNKNOWN","GENDER_ROLE_ASSIGNMENT_FORBIDDEN","WRONG_RECIPIENT_TEN_GOD","PAIR_REFERENCE_NOT_PERSON_FACT","CANONICAL_RELATION_MISSING","INCOMPLETE_SOURCE_ANCESTRY","DISALLOWED_DOMAIN","CONDITIONAL_TENSION","CONDITIONAL_COMPLEMENT","CH08_REQUIRES_PRECEDING_CONDITION","CH09_REQUIRES_DISPLAY","UNSAFE_REPAIR_ASSUMPTION","MEANING_REVIEW_REQUIRED"] as const;

export function marriageRecallDisplay(expected:Omit<Display,"id"|"address"|"actuallyDisplayed">,displays:readonly Display[],originalIntroductionAddress:string|null) {
 return !!originalIntroductionAddress && compatibleDisplay(expected,displays.filter(d=>d.address===originalIntroductionAddress));
}
