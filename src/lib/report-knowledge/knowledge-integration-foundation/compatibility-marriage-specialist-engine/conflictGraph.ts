export type ConflictInput = {
 mode:string; topics:readonly string[]; phases:readonly (string|null)[];
 roots:readonly string[]; meaningIdentity:string|null; claimIdentity:string|null;
 meaningReviewed:boolean; reasons:readonly string[];
};
export function marriageConflictRelations(a:ConflictInput,b:ConflictInput) {
 const relations:{kind:string;state:"OBSERVED"|"REVIEW_REQUIRED";basis:string[]}[]=[];
 const add=(kind:string,state:"OBSERVED"|"REVIEW_REQUIRED",...basis:string[])=>relations.push({kind,state,basis});
 const roots=a.roots.filter(r=>b.roots.includes(r));
 if(roots.length)add("SAME_UNDERLYING_FACT","OBSERVED",...roots);
 if(a.meaningReviewed&&b.meaningReviewed&&a.meaningIdentity&&a.meaningIdentity===b.meaningIdentity)add("SAME_MEANING","OBSERVED",a.meaningIdentity);
 else add("MEANING_REVIEW_REQUIRED","REVIEW_REQUIRED","Original meaning identities not approved");
 if([a.mode,b.mode].every(m=>["SELF_A","SELF_B"].includes(m))&&a.mode!==b.mode)add("DIFFERENT_PERSON_OWNER","OBSERVED",a.mode,b.mode);
 if([a.mode,b.mode].every(m=>["AB","BA"].includes(m))&&a.mode!==b.mode)add("DIFFERENT_DIRECTION","OBSERVED",a.mode,b.mode);
 if(a.topics.join("|")!==b.topics.join("|"))add("DIFFERENT_HOUSEHOLD_APPLICATION","REVIEW_REQUIRED",...a.topics,...b.topics);
 if(a.phases.join("|")!==b.phases.join("|"))add("DIFFERENT_TASK_PHASE","OBSERVED",...a.phases.filter((p):p is string=>p!==null),...b.phases.filter((p):p is string=>p!==null));
 add("HOUSEHOLD_STATUS_UNKNOWN","OBSERVED","No actual marital/cohabitation/history input");
 add("MARRIAGE_CATEGORY_NOT_FACT","OBSERVED","Category and internal editorial projection are not household observations");
 add("SHARED_DECISION_RIGHT_UNKNOWN","OBSERVED","No entered authority or consent");
 if([...a.topics,...b.topics].includes("financial"))add("FINANCIAL_CONTEXT_UNVERIFIED","OBSERVED","Income/assets/debt/cost not entered");
 const reasons=[...a.reasons,...b.reasons];
 const map:Record<string,string>={WRONG_OWNER:"DIFFERENT_PERSON_OWNER",WRONG_DIRECTION:"DIFFERENT_DIRECTION",EXACT_DIRECTION_GOD_NOT_MATCHED:"WRONG_RECIPIENT_TEN_GOD",ACTUAL_ANCESTRY_NOT_SUPPLIED:"INCOMPLETE_SOURCE_ANCESTRY",DISALLOWED_ANCESTOR_DOMAIN:"DISALLOWED_DOMAIN",MARRIAGE_REQUIRED_ANCESTOR_DOMAIN_NOT_ALLOWED:"DISALLOWED_DOMAIN",GENDER_OR_TYPE_ROLE_ASSIGNMENT_FORBIDDEN:"GENDER_ROLE_ASSIGNMENT_FORBIDDEN",UNSAFE_MARRIAGE_REPAIR_OR_CONTACT_BLOCKED:"UNSAFE_REPAIR_ASSUMPTION"};
 for(const [reason,kind]of Object.entries(map))if(reasons.includes(reason))add(kind,"OBSERVED",reason);
 if([...a.topics,...b.topics].includes("canonical")&&reasons.includes("ACTUAL_EVIDENCE_NOT_FOUND"))add("CANONICAL_RELATION_MISSING","REVIEW_REQUIRED","Original relation-specific witness required; another witness cannot replace it");
 if([...a.topics,...b.topics].includes("mbtiPair"))add("PAIR_REFERENCE_NOT_PERSON_FACT","OBSERVED","Reference-only original source classification");
 if([...a.topics,...b.topics].includes("repair"))add("CH08_REQUIRES_PRECEDING_CONDITION","REVIEW_REQUIRED","Prevention and actual recovery are distinct");
 if(a.mode==="RECALL"||b.mode==="RECALL")add("CH09_REQUIRES_DISPLAY","OBSERVED","Research reference/planned allocation is not actual display");
 for(const kind of["CONDITIONAL_TENSION","CONDITIONAL_COMPLEMENT"])add(kind,"REVIEW_REQUIRED","Original risk/positive meanings require independent application review");
 return relations;
}
