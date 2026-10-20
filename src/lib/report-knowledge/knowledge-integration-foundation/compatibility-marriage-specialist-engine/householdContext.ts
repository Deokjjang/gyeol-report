import type {MarriageMaterial} from "./researchCatalog";
export const RESPONSIBILITY_PHASES = ["DISCOVERY","PREPARATION","DECISION","EXECUTION","VERIFICATION","EXCEPTION_HANDLING","FUTURE_MEMORY_OR_REVIEW"] as const;
const PHASE_MAP:Record<string,typeof RESPONSIBILITY_PHASES[number]>={notice:"DISCOVERY",prepare:"PREPARATION",decide:"DECISION",execute:"EXECUTION",monitor:"VERIFICATION",handle_exception:"EXCEPTION_HANDLING",remember_next_cycle:"FUTURE_MEMORY_OR_REVIEW"};
export const UNKNOWN_HOUSEHOLD_FACTS=["maritalStatus","cohabitation","householdHistory","taskAssignee","laborTime","income","assets","debt","account","investments","sharedExpense","legalOwnership","children","parentingHistory","familyConflict","employmentChange","incomeChange","decisionRight","consent"] as const;
export type HouseholdAssertion = {kind:"HOUSEHOLD_QUESTION"|"HYPOTHETICAL_SCENE"|"ACTUAL_HOUSEHOLD_FACT"|"UNVERIFIED_ASSUMPTION"; requiredFacts:string[]; assignedBy:string; processRoles:string[]; completeResponsibility:boolean; actualRecovery:boolean; preventionOnly:boolean; precedingCondition:string|null; safety:string[]; forcedRepair:boolean; forcedContact:boolean; financialPrescription:boolean; actualTransitionDate:string|null};
export const MARRIAGE_SAFETY_SIGNALS=["VIOLENCE","THREAT","COERCION","STALKING","SURVEILLANCE","ECONOMIC_CONTROL","NO_CONTACT_CONSENT","SEXUAL_BOUNDARY","PRIVACY_VIOLATION","RETALIATION","FAMILY_CONTROL"] as const;
export function marriageSafetyReasons(signals:readonly string[],forcedContact:boolean,forcedRepair:boolean){return signals.some(s=>(MARRIAGE_SAFETY_SIGNALS as readonly string[]).includes(s))&&(forcedContact||forcedRepair)?["UNSAFE_MARRIAGE_REPAIR_OR_CONTACT_BLOCKED"]:[];}
export function validateHouseholdAssertion(a:HouseholdAssertion,actualFacts:Readonly<Record<string,unknown>>={}) {
 const reasons=marriageSafetyReasons(a.safety,a.forcedContact,a.forcedRepair);
 if(a.kind==="UNVERIFIED_ASSUMPTION")reasons.push("UNVERIFIED_HOUSEHOLD_ASSUMPTION");
 if(a.kind==="ACTUAL_HOUSEHOLD_FACT" && !a.requiredFacts.length)reasons.push("EXPLICIT_HOUSEHOLD_FACT_REQUIREMENT_REQUIRED");
 for(const f of a.requiredFacts)if(!Object.hasOwn(actualFacts,f)||actualFacts[f]===null||actualFacts[f]==="UNKNOWN")reasons.push("ACTUAL_HOUSEHOLD_FACT_UNKNOWN:"+f);
 if(a.assignedBy!=="people_consent_not_gender_or_type")reasons.push("GENDER_OR_TYPE_ROLE_ASSIGNMENT_FORBIDDEN");
 const phases=a.processRoles.map(p=>PHASE_MAP[p]);
 if(phases.some(p=>!p))reasons.push("TASK_PHASE_REVIEW_REQUIRED");
 if(a.completeResponsibility && RESPONSIBILITY_PHASES.some(p=>!phases.includes(p)))reasons.push("INCOMPLETE_END_TO_END_RESPONSIBILITY");
 if(a.actualRecovery && (!a.precedingCondition||!/^CH07\.P[1-4]$/.test(a.precedingCondition)))reasons.push("CH08_REQUIRES_VERIFIED_PRECEDING_CONDITION");
 if(a.actualRecovery && a.preventionOnly)reasons.push("PREVENTION_IS_NOT_ACTUAL_RECOVERY");
 if(a.financialPrescription)reasons.push("UNAPPROVED_ECONOMIC_OR_LEGAL_CLAIM");
 if(a.actualTransitionDate)reasons.push("UNENTERED_TRANSITION_DATE_FORBIDDEN");
 return [...new Set(reasons)].sort();
}
export function responsibilityProcess(roles:readonly string[]) {
 return {phases:roles.map(originalRole=>({originalRole,phase:PHASE_MAP[originalRole]??null,state:PHASE_MAP[originalRole]?"EXPLICIT_ROLE_MAPPING":"REVIEW_REQUIRED"})),scope:"GENERAL_TASK_MODEL_NOT_ACTUAL_AB_HISTORY",actualTaskOwner:"UNKNOWN",laborTime:"UNKNOWN",oneOffHelpIsEndToEndResponsibility:false};
}
export function enteredTypePredicates(m:MarriageMaterial,types:Readonly<Record<string,string|null>>) {
 return m.requirements.enteredTypePredicates.map(p=>({...p,actualEnteredMbti:types[p.owner]??null,state:types[p.owner]===p.type?"MATCH":"WITHHELD",reason:types[p.owner]===p.type?null:types[p.owner]?"ENTERED_TYPE_MISMATCH":"ENTERED_TYPE_UNKNOWN"}));
}
export function marriageMaterialContext(m:MarriageMaterial,types:Readonly<Record<string,string|null>>) {
 const predicates=enteredTypePredicates(m,types),scene=m.fictionalScene;
 const assertion:HouseholdAssertion={kind:"HYPOTHETICAL_SCENE",requiredFacts:[],assignedBy:m.jointDecision.assignedBy,processRoles:[...m.jointDecision.processRoles],completeResponsibility:false,actualRecovery:false,preventionOnly:m.chapterId==="CH08",precedingCondition:null,safety:[],forcedRepair:false,forcedContact:false,financialPrescription:false,actualTransitionDate:null};
 const reasons=validateHouseholdAssertion(assertion);
 if(scene.status!=="fictional_not_customer_history"||scene.premise!=="hypothetical_only_actual_marriage_unknown")reasons.push("FICTIONAL_SCENE_BOUNDARY_INVALID");
 if(predicates.some(p=>p.state!=="MATCH"))reasons.push("ALL_ENTERED_TYPE_PREDICATES_REQUIRED");
 return {category:"RELATIONSHIP_CATEGORY_MARRIAGE",editorialContext:"EDITORIAL_CONTEXT_MARRIED",editorialProjectionIsFact:false,actualMaritalStatus:"UNKNOWN",actualCohabitation:"UNKNOWN",actualHouseholdHistory:"UNKNOWN",actualFacts:Object.fromEntries(UNKNOWN_HOUSEHOLD_FACTS.map(k=>[k,"UNKNOWN"])),topics:m.householdTopics,scene,predicates,sourceUsesAreConjunctive:m.requirements.sourceUsesAreConjunctive,process:responsibilityProcess(m.jointDecision.processRoles),decisionRights:{original:m.jointDecision,actualAuthority:"UNKNOWN",actualConsent:"UNKNOWN",assignedBy:m.jointDecision.assignedBy},financialBoundary:{income:"UNKNOWN",assets:"UNKNOWN",debt:"UNKNOWN",legalOwnership:"UNKNOWN",prescriptionAllowed:false,traditionalWealthIsActualMoney:false,resourceSenseIsFinancialAbility:false},familyBoundary:{actualConflict:"UNKNOWN",actualConsent:"UNKNOWN",topicIsFact:false},transition:{actualEvent:"UNKNOWN",date:null,reviewTrigger:m.jointDecision.reviewTrigger,temporalEvidenceImported:false},assertion,reasons};
}
