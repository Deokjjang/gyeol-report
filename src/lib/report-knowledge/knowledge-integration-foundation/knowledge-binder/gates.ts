import { BINDING_HARD_GATES } from "../types";
import { isRecord } from "../normalization";
import { canonicalJson } from "../sourceReader";
import { declaredDomains } from "../semantic-domain-verification/graph";
import type { KnowledgeCandidate, KnowledgeBindingGateResult, KnowledgeBindingApprovalProvider, KnowledgeBindingApprovalRequirement, ApprovalRecord, GateState, KnowledgeBindingRequest, KnowledgeBindingMatch } from "./types";
import type { KnowledgeBinderCatalog } from "./catalog";
import type { ActualBindingIndex } from "./matching";
export const NO_APPROVALS:KnowledgeBindingApprovalProvider=Object.freeze({lookup:()=>null,verifyAuthenticity:()=>false});
export function validateApproval(expected:KnowledgeBindingApprovalRequirement,record:ApprovalRecord|null,provider:KnowledgeBindingApprovalProvider){
 if(!record)return {ok:false,reasons:["OPERATOR_APPROVAL_PENDING","CUSTOMER_APPROVAL_PENDING"]};
 const same=["catalogKey","originalRecordHash","sourceVersion","meaningIdentity","claimIdentity","product","relationship","contexts","evidenceIds","prohibitedInference","canonicalFactRoots","graphVersion","sourceVerificationVersion","semanticVerificationVersion","temporalWitnesses"]as const;
 if(!expected.meaningIdentity&&!expected.claimIdentity||!provider.verifyAuthenticity(record)||same.some(k=>canonicalJson(record[k])!==canonicalJson(expected[k]))||!record.operatorApproved||!record.customerApproved||!record.approvalVersion||!record.approverIdentity||!record.reviewRecord||record.revoked||!Number.isFinite(Date.parse(record.issuedAt))||!Number.isFinite(Date.parse(record.expiresAt))||Date.parse(expected.evaluatedAt)<Date.parse(record.issuedAt)||Date.parse(expected.evaluatedAt)>=Date.parse(record.expiresAt))return {ok:false,reasons:["APPROVAL_SCOPE_HASH_VERSION_OR_VALIDITY_MISMATCH"]};
 return {ok:true,reasons:[]};
}
export function inputConditions(c:KnowledgeCandidate,request:KnowledgeBindingRequest){
 const input=request.graphInput.evidence.input,context=input.kind==="compatibility"?{}:input.userContext;
 return c.requirement.requiredUserState.map(r=>{const value=(context as Readonly<Record<string,unknown>>)[r.key],provided=request.actualUserState[r.key];
  if(provided!==undefined&&value!==undefined&&canonicalJson(provided)!==canonicalJson(value))return {key:r.key,state:"FAIL" as const};
  if(value===undefined||value===null||value===""||!r.allowed)return {key:r.key,state:"UNKNOWN" as const};
  return {key:r.key,state:r.allowed.includes(value)?"PASS" as const:"FAIL" as const};
 });
}
export type GateInput={candidate:KnowledgeCandidate;index:ActualBindingIndex;catalog:KnowledgeBinderCatalog;matches:readonly KnowledgeBindingMatch[];activeRequirementIds:readonly string[];selectedNodeIds:readonly string[];groupReasons:string[];groupRequired:boolean;groupPassed:boolean;recall:{ok:boolean;reasons:string[]};approvalRequirement:KnowledgeBindingApprovalRequirement;approvals?:KnowledgeBindingApprovalProvider};
export function evaluateTwelveGates(x:GateInput):KnowledgeBindingGateResult[]{
 const {candidate:c,index,catalog}=x,q=c.requirement,active=new Set(x.activeRequirementIds),matches=x.matches.filter(m=>active.has(m.requirementId)),specs=q.sourceRequirements.filter(s=>active.has(s.id)),nodes=x.selectedNodeIds.map(id=>index.graph.nodes.get(id)!).filter(Boolean),ancestors=[...new Map(nodes.flatMap(n=>index.ancestors(n)).map(n=>[n.id,n])).values()];
 const result:KnowledgeBindingGateResult[]=[];
 const put=(gate:KnowledgeBindingGateResult["gate"],state:GateState,reasons:string[],fields:string[]=[],refs:string[]=[])=>result.push({gate,state,requirementFields:fields,actualEvidence:[...x.selectedNodeIds],originalReferences:[c.record.catalogKey,...refs],reasons:[...new Set(reasons)].sort(),nextAction:state==="PASS"||state==="NOT_APPLICABLE"?null:"Supply the exact missing source/producer/input/review contract; preserve current calculations and keep this scoped use withheld."});
 const decisions=(catalog.decisions.get(c.record.catalogKey)??[]).filter(d=>(d.targetProduct==="UNKNOWN"||d.targetProduct.includes(index.request.product))&&(d.targetRelationship==="UNKNOWN"||!d.targetRelationship.length||index.request.relationship!==null&&d.targetRelationship.includes(index.request.relationship)));
 const sourceKeys=[...new Set(specs.flatMap(s=>s.sourceCatalogKeys))],trace=catalog.semantic.graph.trace(c.record.catalogKey);
 const sourceFailed=index.errors.length>0||c.sourceCheck.state!=="PASS"||c.sourceCheck.actualRecordHash!==c.record.locator.recordSha256||c.sourceCheck.fileHash!==catalog.input.frozen.get(c.record.locator.file)||specs.some(s=>s.sourceKey!==null&&!s.sourceCatalogKeys.length)||sourceKeys.some(k=>catalog.sourceChecks.get(k)?.state!=="PASS")||decisions.some(d=>d.decisionState==="SOURCE_INCOMPLETE");
 put("SOURCE_INTEGRITY",sourceFailed?"FAIL":"PASS",sourceFailed?["SOURCE_HASH_VERSION_OR_REFERENCE_MISMATCH"]:[],["originalRecordHash","sourceVerificationVersion"],sourceKeys);
 const syntheticReviewed=c.provenance==="SYNTHETIC_TEST_ONLY"&&isRecord(q.originalReviewState)&&q.originalReviewState.syntheticMeaningReviewed===true;
 put("INTERPRETATION_REVIEW",syntheticReviewed?"PASS":"REVIEW_REQUIRED",syntheticReviewed?[]:[decisions.some(d=>d.reviewActorType==="CODEX_MODEL")?"CODEX_MODEL_REVIEW_IS_NOT_OPERATOR_APPROVAL":"SEMANTIC_REVIEW_REQUIRED"],["originalReviewState"],decisions.map(d=>d.decisionKey));
 const producerReasons=[...q.producerRequirements,...matches.flatMap(m=>m.reasons.filter(r=>["UNSUPPORTED_PRODUCER","UNSUPPORTED_COMPOSITE","MISSING_RULE_ID","RULE_SPECIFIC_FUSION_NOT_FOUND","MISSING_FUSION_ROOT"].includes(r)))];
 put("PRODUCER_SUPPORT",producerReasons.length||q.compositeLayers>2?"FAIL":specs.some(s=>s.selector)?"PASS":"UNKNOWN",[...producerReasons,...(!specs.some(s=>s.selector)?["EXACT_PRODUCER_REQUIREMENT_MISSING"]:[])],["producerRequirements"]);
 const actualSpecs=specs.filter(s=>s.selector),actualMatches=matches.filter(m=>actualSpecs.some(s=>s.id===m.requirementId));
 const missingContract=specs.some(s=>s.use!=="DOCUMENTARY"&&!s.selector);
 const actualKinds=["CALCULATED_NATAL_FACT","CALCULATED_PERIOD_FACT","CANONICAL_PAIR_FACT","DIRECTIONAL_RELATION_FACT","MBTI_SOURCE_NODE","SEMANTIC_DERIVATION","FUSION_DERIVATION"];
 const factsPass=actualSpecs.length>0&&nodes.some(n=>actualKinds.includes(n.kind))&&!missingContract&&actualMatches.every(m=>m.state==="PASS")&&(!x.groupRequired||x.groupPassed);
 put("ACTUAL_CALCULATED_FACT",factsPass?"PASS":actualMatches.some(m=>m.state==="FAIL")?"FAIL":"UNKNOWN",factsPass?[]:[...actualMatches.flatMap(m=>m.reasons),...(nodes.length&&!nodes.some(n=>actualKinds.includes(n.kind))?["SOURCE_DECLARATION_NOT_PERSONAL_FACT"]:[]),...(missingContract||!actualSpecs.length?["CONTRACT_NOT_MACHINE_CHECKABLE"]:[]),...x.groupReasons],["sourceRequirements","sourceGroups"]);
 const ownerReasons=matches.flatMap(m=>m.reasons.filter(r=>["WRONG_OWNER","UNKNOWN_OWNER"].includes(r)));
 const ownerEvidenceMissing=actualSpecs.length>0&&actualMatches.some(m=>!m.matchedActualEvidence.length);
 put("ACTUAL_OWNER",ownerReasons.includes("WRONG_OWNER")?"FAIL":ownerReasons.length||ownerEvidenceMissing||actualSpecs.some(s=>!index.owner(s.owner))?"UNKNOWN":actualSpecs.length?"PASS":"UNKNOWN",[...ownerReasons,...(!actualSpecs.length?["ACTUAL_OWNER_REQUIREMENT_MISSING"]:[]),...(ownerEvidenceMissing?["ACTUAL_OWNER_EVIDENCE_NOT_FOUND"]:[])],["requiredOwner"]);
 const directionReasons=matches.flatMap(m=>m.reasons.filter(r=>r==="WRONG_DIRECTION"));
 const directionNodes=ancestors.filter(n=>n.direction);const requiredDirections=[...new Set([...q.requiredDirection,...specs.flatMap(s=>s.selector?.direction?[s.selector.direction]:s.selector?.referenceDirection?[s.selector.referenceDirection]:[])])];
 const directionsPresent=requiredDirections.every(direction=>{const subject=direction==="A_TO_B"?index.request.graph.context.owners.personA:index.request.graph.context.owners.personB,recipient=direction==="A_TO_B"?index.request.graph.context.owners.personB:index.request.graph.context.owners.personA;return directionNodes.some(n=>n.direction!==null&&n.direction.subject===subject&&n.direction.recipient===recipient&&n.direction.relationId===n.fact.producerEvidenceId);});
 put("ACTUAL_DIRECTION",!requiredDirections.length?"NOT_APPLICABLE":directionReasons.length?"FAIL":directionsPresent?"PASS":"UNKNOWN",directionReasons.length?directionReasons:requiredDirections.length&&!directionsPresent?["ACTUAL_DIRECTION_ID_REQUIRED"]:[],["requiredDirection"]);
 const policyRules=catalog.input.config.rules.filter(r=>r.relationship===index.request.relationship),domains=new Set(ancestors.flatMap(n=>n.ancestry.domains));
 const researchKeys=[...new Set([...trace.requiredSourceKeys,...sourceKeys.flatMap(k=>catalog.sourceAncestors(k))])];
 for(const k of researchKeys){for(const d of declaredDomains(catalog.raw.get(k)))domains.add(d);const record=catalog.semantic.graph.byKey.get(k);if(record?.namespace==="FOUNDATION"&&record.locator.file.startsWith(catalog.input.config.mbtiSourceRoot+"/")&&record.locator.pointer?.startsWith("/traits/")){const domain=catalog.mbtiDomains[record.locator.pointer.split("/")[2]];if(typeof domain==="string")domains.add(domain);}}
 for(const match of matches)if(match.reasons.includes("DISALLOWED_ANCESTOR_DOMAIN")||match.reasons.includes("REQUIRED_ANCESTOR_WITHHELD"))for(const id of match.rejectedNodeIds){const n=index.graph.nodes.get(id);if(n)for(const d of n.ancestry.domains)domains.add(d);}
 const domainPolicies=policyRules.filter(r=>r.prohibitedDomains.some(d=>domains.has(d)));
 const forbidden=domainPolicies.length>0||decisions.some(d=>d.decisionState==="EXPLICITLY_PROHIBITED");
 const ancestryBad=ancestors.some(n=>n.status==="WITHHELD"||!n.ancestry.complete||n.ancestry.missingIds.length||n.sources.some(s=>s.state!=="VERIFIED"))||trace.cycleEdges.length>0||trace.incompleteReferenceKeys.length>0;
 const ancestryMissing=ownerEvidenceMissing||missingContract;
 put("ALL_ANCESTOR_DOMAINS",forbidden||ancestryBad?"FAIL":nodes.length&&!ancestryMissing?"PASS":"UNKNOWN",[...(forbidden?["DISALLOWED_ANCESTOR_DOMAIN"]:[]),...(ancestryBad?["INCOMPLETE_REQUIRED_ANCESTRY"]:[]),...(!nodes.length||ancestryMissing?["ACTUAL_ANCESTRY_NOT_SUPPLIED"]:[])],["allActualAndResearchRequiredAncestors"],domainPolicies.map(r=>r.id));
 const temporal=index.temporal(x.selectedNodeIds,q.requiredTemporalScope,q.compositeLayers);put("TIME_INTERSECTION",temporal.state,temporal.reasons,["requiredTemporalScope","requiredWindow"]);
 const conditions=inputConditions(c,index.request),unknown=q.unresolvedConditions.length>0||q.requiredContext.length>0&&!q.requiredContext.some(context=>index.request.contexts.includes(context));
 put("ACTUAL_USER_STATE",conditions.some(s=>s.state==="FAIL")?"FAIL":conditions.some(s=>s.state==="UNKNOWN")||unknown?"UNKNOWN":"PASS",[...(conditions.some(s=>s.state!=="PASS")?["REQUIRED_USER_STATE_NOT_VERIFIED"]:[]),...(unknown?["CONTRACT_NOT_MACHINE_CHECKABLE"]:[])],[...q.requiredUserState.map(s=>s.originalField),...q.unresolvedConditions.map(s=>s.field)]);
 const noCounter=Array.isArray(q.counterexamples)&&q.counterexamples.length===0&&isRecord(q.prohibitions)&&Object.keys(q.prohibitions).length===0;
 const counterPass=noCounter&&x.recall.ok;
 put("COUNTEREXAMPLES_AND_PROHIBITIONS",counterPass?"PASS":!x.recall.ok?"FAIL":"REVIEW_REQUIRED",[...(!noCounter?["ORIGINAL_COUNTEREXAMPLE_REVIEW_REQUIRED"]:[]),...x.recall.reasons],["counterexamples","prohibitions","introducedLedger"]);
 const scopeMatches=q.products.includes(index.request.product)&&(index.request.product!=="saju_mbti_compatibility"||index.request.relationship!==null&&q.relationships.includes(index.request.relationship));
 const specialist=["PRODUCT_SPECIALIST","RELATIONSHIP_SPECIALIST"].includes(c.record.kind);
 put("PRODUCT_SPECIALISM",!scopeMatches?"FAIL":!q.readerQuestion||!q.coreMeaning?"UNKNOWN":specialist?"PASS":"REVIEW_REQUIRED",!scopeMatches?["PRODUCT_OR_RELATIONSHIP_MISMATCH"]:!q.readerQuestion||!q.coreMeaning?["SPECIALIST_QUESTION_OR_MEANING_UNKNOWN"]:!specialist?["COMMON_RESEARCH_IS_NOT_SPECIALIST_REPLACEMENT"]:[],["product","relationship","readerQuestion","coreMeaning"]);
 const provider=c.provenance==="SYNTHETIC_TEST_ONLY"?x.approvals??NO_APPROVALS:NO_APPROVALS,approval=validateApproval(x.approvalRequirement,provider.lookup(x.approvalRequirement),provider);
 put("CUSTOMER_APPROVAL",approval.ok?"PASS":"REVIEW_REQUIRED",approval.reasons,["operatorApproval","customerApproval","originalRecordHash","approvalScope"]);
 if(result.length!==BINDING_HARD_GATES.length||result.some((g,i)=>g.gate!==BINDING_HARD_GATES[i]))throw new Error("HARD_GATE_ORDER_MISMATCH");
 return result;
}
