export const CONTEXT_FIELDS = ["oldFriends","childhoodFriends","sameSchool","sameWorkplace","regularMeetings","pastConflict","moneyTransactions","sharedSecrets","jealousy","oneSidedRelationship","currentlyEstranged","closeness","friendshipDuration","currentContactFrequency","meetingOffer","meetingAcceptance","availableTime","contactRequest","contactConsent","contactRefusal","responseDeadlineAgreement","reconnectionIntent","otherFriends","groupInvitation","invitationCapacity","actualExclusion","repeatedHarm","disclosure","listeningRequested","adviceRequested","helpReceived","informationOwner","sharingPermission","permissionScope","permissionWithdrawn","disclosureHistory","trustObserved","helpOffer","helpRequest","helpAcceptance","voluntaryHelp","timeCost","moneyCost","emotionalCost","expectedReciprocity","explicitAgreement","actualDebt","supportBoundary","professionalSupportNeeded","lifeChange","relationshipRedefinition","distanceChoice","endChoice","conflictObserved","repairConsent","safeRecontact","apology","apologyAcceptance","forgiveness","closenessRestored","relationshipContinued"] as const;
export type ContextField = typeof CONTEXT_FIELDS[number];
export type Proof = { state: "UNKNOWN" } | { state: "VERIFIED"; value: string | boolean; owner: "A" | "B" | "PAIR"; sourceId: string; scope: string };
export type FriendshipContext = Record<ContextField, Proof>;
export function unknownContext(): FriendshipContext { return Object.fromEntries(CONTEXT_FIELDS.map(k => [k,{state:"UNKNOWN"}])) as FriendshipContext; }
export type Assertion = { action: "QUESTION" | "MEET" | "CONTACT" | "DISCLOSE" | "HELP" | "REPAYMENT" | "ADVICE" | "ACTUAL_REPAIR"; scope: string; owner: "A" | "B" | "PAIR"; context: FriendshipContext; claims: Partial<Record<ContextField,string|boolean>>; requires: ContextField[]; forcedContact: boolean; forcedForgiveness: boolean; forcedReciprocity: boolean; forcedContinuation: boolean; assumesExclusivity: boolean; controlsOtherFriends: boolean; predictedOutcome: string | null };
export function evaluateFriendshipAssertion(a: Assertion): string[] {
  const reasons: string[] = [];
  const present=(value:unknown)=>typeof value==="boolean"||typeof value==="string"&&!!value.trim()&&!["UNKNOWN","UNVERIFIED"].includes(value.trim());
  const verified = (key: ContextField, value?: string|boolean,owner=a.owner) => { const p=a.context[key]; return p?.state==="VERIFIED" && present(p.sourceId) && present(p.value) && present(p.scope) && p.scope===a.scope && (p.owner===owner || p.owner==="PAIR") && (value===undefined || p.value===value); };
  for (const [key,value] of Object.entries(a.claims)) if (!CONTEXT_FIELDS.includes(key as ContextField) || !verified(key as ContextField,value)) reasons.push("UNVERIFIED_FRIENDSHIP_FACT:"+key);
  for (const key of a.requires) if (!verified(key)) reasons.push("ACTUAL_CONTEXT_REQUIRED:"+key);
  if(a.forcedContact)reasons.push("FORCED_RECONTACT");
  if(a.forcedForgiveness)reasons.push("FORCED_FORGIVENESS");
  if(a.forcedReciprocity)reasons.push("FORCED_RECIPROCITY");
  if(a.forcedContinuation)reasons.push("FORCED_RELATIONSHIP_CONTINUATION");
  if(a.assumesExclusivity||a.controlsOtherFriends)reasons.push("ASSUMED_EXCLUSIVITY");
  if(a.predictedOutcome!==null)reasons.push("UNSUPPORTED_FRIENDSHIP_PREDICTION");
  const recipient=a.owner==="A"?"B":a.owner==="B"?"A":"PAIR";
  const need = (key: ContextField,value?: string|boolean,owner=a.owner) => { if(!verified(key,value,owner))reasons.push("ACTUAL_CONTEXT_REQUIRED:"+key); };
  if(a.action==="MEET"){need("meetingAcceptance",true,recipient);need("availableTime",undefined,recipient);}
  if(a.action==="CONTACT"||a.action==="ACTUAL_REPAIR"){need("contactConsent",true,recipient);need("contactRefusal",false,recipient);need("safeRecontact",true,recipient);}
  if(a.action==="DISCLOSE"){need("informationOwner");const p=a.context.informationOwner,owner=p.state==="VERIFIED"&&(p.value==="A"||p.value==="B"||p.value==="PAIR")?p.value:null;if(!owner)reasons.push("INFORMATION_OWNER_NOT_VERIFIED");else{need("sharingPermission",true,owner);need("permissionScope",a.scope,owner);need("permissionWithdrawn",false,owner);}}
  if(a.action==="HELP"){need("helpAcceptance",true,recipient);need("voluntaryHelp",true);need("supportBoundary");}
  if(a.action==="REPAYMENT"){need("actualDebt");need("explicitAgreement");}
  if(a.action==="ADVICE")need("adviceRequested",true,recipient);
  if(a.action==="ACTUAL_REPAIR"){need("pastConflict",true);need("conflictObserved",true);need("repairConsent",true,recipient);}
  if(["CONTACT","ACTUAL_REPAIR","MEET"].includes(a.action) && (verified("repeatedHarm",true)||verified("repeatedHarm",true,recipient)||verified("contactRefusal",true,recipient)))reasons.push("UNSAFE_OR_UNCONSENTED_CONTACT");
  return [...new Set(reasons)].sort();
}
export const FRIENDSHIP_POLICY = { category:"friendship",roleVersion:"compatibility-fixed-ab-v1",roles:{personA:"A",personB:"B"},actualHistory:"UNKNOWN",sourceInventoryIsEvidence:false,allMentionedSystemsAreAnd:false,voluntaryRelationship:true,nonExclusive:true,invitationIsAcceptance:false,helpIsDebt:false,disclosureIsSharingPermission:false,apologyIsForgiveness:false,forgivenessIsRecontact:false,distanceIsFailure:false,continuedFriendshipGuaranteed:false,customerSelection:false } as const;
