import type {Material} from "./researchCatalog";
export const BUSINESS_STAGES=["opportunity","idea","market","trial","offer","pricing","proposal","contract","resources","execution","quality","delivery","collection","settlement","customer_review","continuation","exit"] as const;
export const BUSINESS_STATUSES=["prospective","actual-business","project-collaboration","joint-capital","equity-holders","contract-partners","unknown"] as const;
export const REQUIREMENTS={
 repair:["actualHistory","actualConflict","negotiationConsent","safeNegotiation"],
 basic:["actualPartnership","structure","parties","task","stage","output","availableTime","safeNegotiation"],
 market:["idea","customerProblem","customerInterest","usageIntent","actualUse","purchaseIntent","actualPurchase","repeatPurchase","marketScope"],
 trial:["trialGoal","trialBudget","trialDuration","acceptanceCriteria","failureCondition","safetyConstraints","recoveryConditions","actualResult","customerAcceptance","repeatability","offerScope","excludedScope","deliveryCapacity"],
 contribution:["actualContribution","contributor","valueEstimation","recurringObligation","ownership","compensation","consent"],
 capital:["capitalContribution","noncashContribution","laborContribution","capitalCommitment","paidCapital","equity","votingRights","profitDistribution","lossAllocation","managementRights","agencyAuthority","debtResponsibility","exitRights"],
 decision:["decisionType","proposalAuthority","consultationRequirement","consentRequirement","approvalAuthority","executionOwner","financialExposure","externalObligation","evidenceRequired"],
 procedure:["actualAuthority","requiredParties","requiredConsent","deadline","exception","scope","cost","documentation","reviewTrigger"],
 finance:["revenue","profit","cashInflow","cashOutflow","cost","operatingExpense","laborCost","fixedCost","variableCost","receivable","debt","workingCapital","forecast","assets"],
 cashFlow:["proposal","contract","invoice","payment","collectionDate","paymentObligation","upcomingOutflow","cashBalance","expectedReceivable","operatingCashNeed"],
 risk:["expectedProfit","actualProfit","capitalAtRisk","maximumCommitment","additionalFunding","debtGuarantee","lossAllocation","recoveryOptions","lossCapacity","financialExposure"],
 contract:["structure","parties","contract","actualAuthority","economicCondition","relevantDocument","jurisdiction"],
 ip:["preExistingIP","newIP","thirdPartyIP","ipOwnership","ipLicense","usagePermission","modificationPermission","disclosurePermission","confidentiality","ipTransfer","exitUse","deliverableRights"],
 agency:["customerProposal","priceExplanation","draftDelivery","partnerInformation","partnerConsent","contractExecution","representation","externalObligation","contractChange","collectionApproval"],
 exit:["trialStop","individualExit","dissolution","windingUp","assetLiabilitySettlement","customerObligations","ipInformationTransfer","remainingDuties","exitTerms","stopConditions"],
} as const;
export type BusinessField=typeof REQUIREMENTS[keyof typeof REQUIREMENTS][number];
export const BUSINESS_FIELDS=[...new Set(Object.values(REQUIREMENTS).flat())] as BusinessField[];
export type BusinessFact={value:string;source:string;verified:boolean;taskId:string;owner:"A"|"B"|"PAIR"};
export type BusinessContext={status:"VERIFIED"|"HYPOTHETICAL";businessStatus:string;businessContext:string;stage:string;taskId:string;outputType:string;facts:Partial<Record<BusinessField,BusinessFact>>;authority:Record<string,{owner:"A"|"B";scope:string;source:string;taskId:string;verified:boolean}>;contributions:Record<string,BusinessFact>;financial:Record<string,BusinessFact>;contracts:Record<string,BusinessFact>;ip:Record<string,BusinessFact>;exits:Record<string,BusinessFact>};
export function verifiedText(v:unknown):v is string{return typeof v==="string"&&v.trim().length>0&&!['UNKNOWN','UNVERIFIED'].includes(v.trim().toUpperCase());}
export function verifiedFact(f:BusinessFact|undefined,c:BusinessContext|undefined){return !!c&&c.status==="VERIFIED"&&verifiedText(c.taskId)&&!!f&&f.verified&&verifiedText(f.value)&&verifiedText(f.source)&&f.taskId===c.taskId&&["A","B","PAIR"].includes(f.owner);}
export function requireBusinessFields(fields:readonly BusinessField[],c?:BusinessContext){return fields.map(field=>({field,state:verifiedFact(c?.facts[field],c)?"VERIFIED":"UNKNOWN"}));}
export function validateBusinessAuthority(kind:string,c?:BusinessContext,owner?:"A"|"B"){const a=c?.authority[kind];return c?.status==="VERIFIED"&&a?.verified&&verifiedText(a.source)&&verifiedText(a.scope)&&verifiedText(a.taskId)&&a.taskId===c.taskId&&["A","B"].includes(a.owner)&&(!owner||a.owner===owner)?[]:["UNVERIFIED_DECISION_RIGHTS","UNVERIFIED_AGENCY_AUTHORITY","AUTHORITY_REQUIREMENT_UNVERIFIED:"+kind];}
export function validateTypedBusinessRecord(family:"contributions"|"financial"|"contracts"|"ip"|"exits",key:string,c?:BusinessContext){return verifiedFact(c?.[family][key],c)?[]:["UNVERIFIED_"+family.toUpperCase()+":"+key];}
export function evaluateBusinessContext(m:Omit<Pick<Material,"workStage"|"outputType"|"requirements"|"authorityContext">,"workStage">&{workStage:string},c?:BusinessContext){
 const active=new Set<keyof typeof REQUIREMENTS>(["basic"]);const s=m.workStage;
 if(["opportunity","idea","market","customer_review"].includes(s))active.add("market");if(["trial","offer"].includes(s))active.add("trial");if(s==="resources") {active.add("contribution");active.add("capital");}
 if(["pricing","collection","settlement","continuation"].includes(s)){active.add("finance");active.add("cashFlow");active.add("risk");}
 if(["proposal","contract"].includes(s)){active.add("contract");active.add("decision");active.add("procedure");active.add("agency");}
 if(["execution","quality","delivery"].includes(s)){active.add("trial");active.add("contribution");active.add("ip");}
 if(s==="exit"){active.add("exit");active.add("contract");active.add("risk");active.add("ip");}
 const checks=requireBusinessFields([...new Set([...active].flatMap(k=>REQUIREMENTS[k]))],c),reasons:string[]=[];
 if(!c||c.status!=="VERIFIED"||!verifiedText(c.taskId)||checks.some(f=>f.state!=="VERIFIED"))reasons.push("UNVERIFIED_BUSINESS_CONTEXT");
 if(!c||c.status!=="VERIFIED"||!(BUSINESS_STATUSES as readonly string[]).includes(c.businessStatus)||c.businessStatus==="unknown")reasons.push("UNVERIFIED_ACTUAL_PARTNERSHIP");
 if(!(BUSINESS_STAGES as readonly string[]).includes(s))reasons.push("UNSUPPORTED_BUSINESS_STAGE");
 if(c&&[...["stage","output","task"].filter(k=>!verifiedFact(c.facts[k as BusinessField],c)),...(c.facts.stage?.value!==c.stage?["stage-value"]:[]),...(c.facts.output?.value!==c.outputType?["output-value"]:[]),...(c.facts.task?.value!==c.taskId?["task-value"]:[])].length)reasons.push("ACTUAL_BUSINESS_CONTEXT_VALUE_MISMATCH");
 if(c&&c.stage!==s)reasons.push("BUSINESS_STAGE_MISMATCH");if(c&&c.outputType!==m.outputType)reasons.push("BUSINESS_OUTPUT_MISMATCH");
 reasons.push(...validateBusinessAuthority(m.authorityContext.kind,c));
 return {actualState:c?.status==="VERIFIED"?"DECLARED_VERIFIED_CONTEXT":"UNKNOWN",actualPartnership:verifiedFact(c?.facts.actualPartnership,c)?c!.facts.actualPartnership!.value:"UNKNOWN",taskId:c?.status==="VERIFIED"?c.taskId:null,checks,requiredFamilies:[...active],reasons:[...new Set(reasons)].sort(),applicable:!reasons.length,hypotheticalSceneIsActualFact:false};
}
export function matchBusinessResearch<T extends {id:string;key?:string;stage?:string;family?:string;materialRefs:readonly string[]}>(research:T,c?:BusinessContext){
 const groups:Record<string,keyof typeof REQUIREMENTS>={context:"basic",contribution:"contribution",decision:"decision",finance:"finance",contract:"contract",exit:"exit"},family=research.id.split(":")[1];
 const checks=requireBusinessFields(REQUIREMENTS[groups[research.family??""]??"basic"],c),verified=c?.status==="VERIFIED"&&checks.every(p=>p.state==="VERIFIED");
 let scopeMatched=false,reasons:string[]=[];
 if(family==="stage")scopeMatched=verified&&c?.stage===research.stage;
 else if(family==="status")scopeMatched=verified&&c?.businessStatus===research.key&&research.key!=="unknown";
 else if(family==="context")scopeMatched=verified&&c?.businessContext===research.key;
 else if(family==="decision"||family==="decisionMode"){reasons=validateBusinessAuthority(research.key??"UNKNOWN",c);scopeMatched=verified&&!reasons.length;}
 else {const registries={contribution:"contributions",finance:"financial",contract:"contracts",exit:"exits"} as const;const registry=registries[family as keyof typeof registries];if(registry){reasons=validateTypedBusinessRecord(registry,research.key??"UNKNOWN",c);scopeMatched=verified&&!reasons.length;}}
 return {original:research,actualBusinessStatus:c?.status==="VERIFIED"?c.businessStatus:"UNKNOWN",actualStage:c?.status==="VERIFIED"?c.stage:"UNKNOWN",checks,scopeMatched,reasons:scopeMatched?[]:[...new Set([...reasons,"ACTUAL_BUSINESS_APPLICATION_NOT_VERIFIED"])],applicable:scopeMatched,declaredResearchOnly:true,actualAssignmentVerified:false,customerApproved:false};
}
