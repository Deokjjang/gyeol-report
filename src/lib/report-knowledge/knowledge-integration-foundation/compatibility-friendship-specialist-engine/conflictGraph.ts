export const CONFLICT_TYPES = ["SAME_UNDERLYING_FACT","SAME_MEANING","DIFFERENT_OWNER","DIFFERENT_DIRECTION","PAIR_REFERENCE_NOT_PERSON_FACT","CANONICAL_RELATION_NOT_ACTUALLY_DETECTED","UNSUPPORTED_RELATION","WRONG_RECIPIENT_TEN_GOD","INCOMPLETE_REQUIRED_ANCESTRY","CHILDREN_DOMAIN_CONTAMINATION","DISALLOWED_SOURCE_DOMAIN","SOURCE_INVENTORY_NOT_EVIDENCE","UNVERIFIED_FRIENDSHIP_HISTORY","UNVERIFIED_CONTACT_FREQUENCY","UNVERIFIED_RELATIONSHIP_DURATION","UNVERIFIED_CLOSENESS","UNVERIFIED_SHARED_SECRET","UNVERIFIED_MONEY_TRANSACTION","UNVERIFIED_JEALOUSY","ASSUMED_EXCLUSIVITY","FORCED_RECIPROCITY","UNCONSENTED_INFORMATION_SHARING","UNVERIFIED_RECIPIENT_REACTION","FORCED_RECONTACT","FORCED_FORGIVENESS","FORCED_RELATIONSHIP_CONTINUATION","REPAIR_REQUIRES_INTRODUCED_FRICTION","INCOMPATIBLE_INTRODUCED_GROUP","RECALL_REQUIRES_ACTUAL_DISPLAY","UNSUPPORTED_FRIENDSHIP_PREDICTION","MEANING_REVIEW_REQUIRED"] as const;
export type Meaning = { id:string;claim:string;owner:string;direction:string|null;context:string;application:string;boundary:string;consent:string;permission:string;reciprocity:string;function:"NEW_APPLICATION"|"REPAIR"|"RECALL";reviewed:boolean };
export function meaningRelations(a:Meaning,b:Meaning,sharedRoot:boolean) {
  const relations:string[]=[];
  if(sharedRoot)relations.push("SAME_UNDERLYING_FACT");
  if(a.owner!==b.owner)relations.push("DIFFERENT_OWNER");
  if(a.direction!==b.direction)relations.push("DIFFERENT_DIRECTION");
  if(a.context!==b.context)relations.push("DIFFERENT_LIFE_CONTEXT");
  if(a.consent!==b.consent)relations.push("DIFFERENT_CONSENT_REQUIREMENT");
  if(a.permission!==b.permission)relations.push("DIFFERENT_INFORMATION_PERMISSION");
  if(a.reciprocity!==b.reciprocity)relations.push("DIFFERENT_RECIPROCITY_QUESTION");
  if(a.boundary!==b.boundary)relations.push("DIFFERENT_BOUNDARY");
  if(!a.reviewed||!b.reviewed)relations.push("MEANING_REVIEW_REQUIRED");
  else if(a.id===b.id)relations.push(a.function==="RECALL"||b.function==="RECALL"?"VALID_RECALL":"SAME_MEANING");
  else if(a.claim===b.claim)relations.push("SAME_CLAIM");
  else relations.push(sharedRoot?"VERIFIED_NEW_APPLICATION":"DIFFERENT_MEANING");
  return {relations,confirmedConflict:a.reviewed&&b.reviewed&&(relations.includes("SAME_MEANING")||relations.includes("SAME_CLAIM")),independentFactsAdded:0};
}
export function structuralConflictRelations(reasons:readonly string[]) {
  const mapped:Record<string,string>={SOURCE_ROLE_NOT_MACHINE_CHECKABLE:"SOURCE_INVENTORY_NOT_EVIDENCE",DISALLOWED_ANCESTOR_DOMAIN:"DISALLOWED_SOURCE_DOMAIN",CHILDREN_ANCESTRY_CONTAMINATION:"CHILDREN_DOMAIN_CONTAMINATION",ACTUAL_COMPATIBLE_DISPLAY_REQUIRED:"INCOMPATIBLE_INTRODUCED_GROUP"};
  const fields:Record<string,string>={friendshipDuration:"UNVERIFIED_RELATIONSHIP_DURATION",closeness:"UNVERIFIED_CLOSENESS",currentContactFrequency:"UNVERIFIED_CONTACT_FREQUENCY",sharedSecrets:"UNVERIFIED_SHARED_SECRET",moneyTransactions:"UNVERIFIED_MONEY_TRANSACTION",jealousy:"UNVERIFIED_JEALOUSY",helpReceived:"UNVERIFIED_RECIPIENT_REACTION"};
  return [...new Set(reasons.flatMap(reason=>{if(reason.startsWith("UNVERIFIED_FRIENDSHIP_FACT:"))return [fields[reason.split(":")[1]]??"UNVERIFIED_FRIENDSHIP_HISTORY"];if(reason.startsWith("ACTUAL_CONTEXT_REQUIRED:sharingPermission")||reason.startsWith("ACTUAL_CONTEXT_REQUIRED:permission"))return ["UNCONSENTED_INFORMATION_SHARING"];if(mapped[reason])return [mapped[reason]];return (CONFLICT_TYPES as readonly string[]).includes(reason)?[reason]:[];}))].sort();
}
