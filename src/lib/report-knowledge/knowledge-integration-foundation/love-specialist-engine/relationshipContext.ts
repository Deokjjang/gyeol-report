import { RELATIONSHIP_STATUSES } from "../../../report-generation/reportInputTypes";
import type { Material } from "../../love-product-research/researchTypes";
import type { RelationshipStatus } from "../../../report-generation/reportInputTypes";
import type { LoveStatusMatch, LoveEnteredContext, LoveApplicationRequirement, LoveBoundaryResult } from "./types";
export const RELATIONSHIP_RISK_KINDS = Object.freeze(["VIOLENCE","THREAT","COERCION","SURVEILLANCE","STALKING","SEXUAL_CONSENT_VIOLATION","ECONOMIC_CONTROL","PRIVACY_VIOLATION","CHILD_ABUSE","REPEATED_PRESSURE"]);
export const LOVE_UNKNOWN_FACTS = Object.freeze(["partner.natal","partner.mbti","partner.feelings","partner.consent","partner.actualResponse","marriage.cohabitation","marriage.householdRoles","marriage.money","marriage.informationAccess","child.exists","child.age","child.development","child.health","child.grades","child.mbti","child.history"]);
export function matchRelationshipStatus(actual: RelationshipStatus, allowed: readonly RelationshipStatus[], prerequisites: unknown, additionalRequired = false): LoveStatusMatch {
  if (!(RELATIONSHIP_STATUSES as readonly string[]).includes(actual)) throw Error("ORIGINAL_RELATIONSHIP_STATUS_REQUIRED");
  const scopeMatched = allowed.includes(actual), all = RELATIONSHIP_STATUSES.every(s=>allowed.includes(s));
  const state = actual === "" ? "UNKNOWN_RELATIONSHIP_STATUS" : !scopeMatched ? "STATUS_CONFLICT" : additionalRequired ? "ADDITIONAL_STATE_REQUIRED" : all ? "STATUS_SCOPE_ONLY" : "RELATIONSHIP_STATUS_MATCHED";
  return {state,scopeMatched,actual,allowed,additionalState:additionalRequired?"UNKNOWN":"NOT_REQUIRED",originalPrerequisites:prerequisites,reasons:state==="STATUS_CONFLICT"?["ACTUAL_STATUS_OUTSIDE_ORIGINAL_SCOPE"]:actual===""?["CURRENT_RELATIONSHIP_STAGE_UNKNOWN"]:additionalRequired?["STATUS_IS_NOT_ADDITIONAL_LIFE_FACT"]:[]};
}
export function actualLoveContext(status: RelationshipStatus): LoveEnteredContext {
  return {relationshipStatus:status,contextId:null,partnerFacts:[],marriageFacts:[],childFacts:[],safety:"UNKNOWN",voluntaryConsent:null,riskKinds:[]};
}
export function materialApplication(m: Material): LoveApplicationRequirement {
  // Reader addresses locate a research domain, never prove an actual life event.
  return {scope:m.chapterId==="CH08"?"OWN_PARENTING":"OWN_RELATIONSHIP_PREFERENCE",partnerFacts:[],marriageFacts:[],childFacts:[],parentSourceRequired:false,repair:m.chapterId==="CH06",unconditionalRepair:false,assertsOutcome:false,symbol:null,symbolDirection:null};
}
export function validateLoveApplication(req: LoveApplicationRequirement, context: LoveEnteredContext, sources: { pairBlocked: boolean; childBlocked: boolean; ownParentSource: boolean; symbolVerified: boolean }): LoveBoundaryResult {
  const reasons:string[]=[],missing=(needs:string[],facts:string[])=>needs.some(x=>!facts.includes(x));
  const partnerWithheld=missing(req.partnerFacts,context.partnerFacts)||["ACTUAL_PARTNER_FACT","CANONICAL_PAIR_EVIDENCE","ACTUAL_RECIPIENT_RESPONSE"].includes(req.scope);
  const childWithheld=missing(req.childFacts,context.childFacts)||req.scope==="ACTUAL_CHILD_FACT";
  const marriageUnknown=missing(req.marriageFacts,context.marriageFacts);
  if(partnerWithheld)reasons.push("ACTUAL_PARTNER_OR_RECIPIENT_FACT_NOT_PROVIDED_BY_SINGLE_PERSON_PRODUCT");
  if(childWithheld)reasons.push("ACTUAL_CHILD_EXISTENCE_AGE_DEVELOPMENT_NOT_PROVIDED");
  if(marriageUnknown)reasons.push("MARRIED_STATUS_IS_NOT_COHABITATION_MONEY_OR_CONSENT");
  if(sources.pairBlocked)reasons.push("PAIR_REFERENCE_CANNOT_BECOME_PERSONAL_EVIDENCE");
  if(sources.childBlocked)reasons.push("CHILD_SOURCE_CANNOT_BECOME_OWN_PARENTING");
  if(req.parentSourceRequired&&!sources.ownParentSource)reasons.push("EXACT_SAME_OWNER_PARENTS_SOURCE_REQUIRED");
  const unsafeRepair=req.repair&&(req.unconditionalRepair||context.safety!=="VOLUNTARY_SAFE"||context.voluntaryConsent!==true||context.riskKinds.length>0);
  if(unsafeRepair)reasons.push("REPAIR_REQUIRES_SAFETY_AND_VOLUNTARY_CONSENT");
  if(req.assertsOutcome)reasons.push("TRADITIONAL_SYMBOL_OR_PREFERENCE_IS_NOT_ACTUAL_RELATIONSHIP_OUTCOME");
  if(req.symbol&&!sources.symbolVerified)reasons.push("POSITIVE_SYMBOL_NOT_CALCULATED_OR_SOURCE_HELD");
  if(req.symbol==="CHEONEUL"&&req.symbolDirection==="GIVE_HELP")reasons.push("RECEIVING_HELP_SYMBOL_CANNOT_PROVE_GIVING_HELP_ABILITY");
  return {eligible:!reasons.length,reasons,partnerWithheld,marriageUnknown,childWithheld,unsafeRepair,pairBlocked:sources.pairBlocked,childSourceBlocked:sources.childBlocked,parentMatched:sources.ownParentSource,actualRecipientResponseKnown:false};
}
