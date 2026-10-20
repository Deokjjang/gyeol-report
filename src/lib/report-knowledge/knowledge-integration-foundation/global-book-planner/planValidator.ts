import{digest}from'../global-specialist-integration/candidateEnvelope';
import{assertPlanningRequest}from'./planningRequest';
import{candidateEligibility}from'./evidenceEligibility';
import{selectionReasons}from'./constraints';
import{PLAN_VERSION,type GlobalBookPlanningRequest,type GlobalBookPlan}from'./types';
export function validateGlobalBookPlan(r:GlobalBookPlanningRequest,p:GlobalBookPlan){
 assertPlanningRequest(r);const errors:string[]=[];
 if(p.productScope!==r.productKey||p.relationshipScope!==r.relationshipCategory||p.fixtureId!==r.fixtureId||p.mode!==r.executionMode)errors.push('PLAN_SCOPE_CHANGED');
 if(p.planVersion!==PLAN_VERSION||digest(p.readerContract)!==digest(r.readerContract))errors.push('ORIGINAL_READER_CONTRACT_CHANGED');
 const selected=p.selectedCandidateReferences.map(a=>{
  const o=r.options.find(o=>o.id===a.candidateId),q=r.questions.find(q=>q.id===a.originalReaderQuestion.id);
  if(!o||!q||!candidateEligibility(r,o).eligiblePrimary){errors.push('UNVERIFIED_PLAN_ASSIGNMENT');return null;}
  if(digest(q)!==digest(a.originalReaderQuestion)||a.originalMaterialId!==o.materialId||a.catalogKey!==o.catalogKey)errors.push('READER_QUESTION_OR_MATERIAL_CHANGED');
  if(digest(a.supportingInformation)!==digest(o.supportingInformation)||digest(a.actualEvidence)!==digest(o.evidenceIds))errors.push('REQUIRED_MBTI_FUSION_OR_EVIDENCE_DROPPED');
  if(a.owner!==o.owner||a.direction!==o.direction||digest(a.temporalScope)!==digest(o.temporal))errors.push('OWNER_DIRECTION_OR_TEMPORAL_CHANGED');
  if(a.primaryInformation.meaningId!==o.primaryMeaning||a.primaryInformation.claimId!==o.claimIdentity||digest(a.primaryInformation.original)!==digest(o.originalMeaning))errors.push('PRIMARY_MEANING_CHANGED');
  if(digest(a.conditionalRequirements)!==digest(o.conditions)||digest(a.counterexamples)!==digest(o.counterexamples)||digest(a.disallowedInferences)!==digest(o.disallowedInferences))errors.push('ORIGINAL_CONDITIONS_LOST');
  if(digest(a.canonicalFactRoots)!==digest(o.primaryRoots)||digest(a.supportingAncestryRoots)!==digest(o.ancestryRoots))errors.push('NEW_OR_CHANGED_FACT_ROOT');
  if(digest(a.source)!==digest({locator:o.sourceLocator,hash:o.sourceHash,version:o.sourceVersion})||a.originalReceipt.hash!==o.receiptHash||a.originalReceipt.key!==o.receiptKey)errors.push('SOURCE_OR_RECEIPT_HASH_CHANGED');
  if(a.claimState!==o.meaningState||a.primaryInformation.kind!==o.informationKind||a.primaryInformation.function!==o.informationFunction)errors.push('INFORMATION_FUNCTION_OR_CLAIM_STATE_CHANGED');
  if(digest(a.displayDependency)!==digest(o.dependency))errors.push('PLANNED_DISPLAY_DEPENDENCY_CHANGED');
  if(digest(a.originalContext)!==digest(o.actualContext)||digest(a.missingConditions)!==digest(o.missingConditions)||a.reuseConstraintRef!==o.policyRef)errors.push('ORIGINAL_CONTEXT_OR_REUSE_REQUIREMENTS_CHANGED');
  if(a.customerAssignable)errors.push('OFFLINE_PLAN_CANNOT_ASSIGN_CUSTOMERS');return o;
 });
 if(selected.every((o):o is NonNullable<typeof o>=>!!o))errors.push(...selectionReasons(r,selected,true));
 const ids=p.selectedCandidateReferences.map(a=>a.originalReaderQuestion.id).concat(p.unfilledQuestions.map(q=>q.id));
 if(ids.length!==r.questions.length||new Set(ids).size!==r.questions.length||r.questions.some(q=>!ids.includes(q.id)))errors.push('ORIGINAL_READER_COVERAGE_MISSING');
 if(digest(p.primaryInformation)!==digest(p.selectedCandidateReferences.map(a=>a.primaryInformation))||digest(p.supportingInformation)!==digest(p.selectedCandidateReferences.map(a=>a.supportingInformation)))errors.push('DERIVED_INFORMATION_LEDGER_CHANGED');
 if(digest(p.canonicalFactRootOwnership)!==digest(r.canonicalFactRoots))errors.push('FACT_ROOT_OWNERSHIP_CHANGED');
 if(digest(p.deferredDisplayDependencies)!==digest(r.options.flatMap(o=>o.dependency?[{candidate:o.id,dependency:o.dependency}]:[])))errors.push('DEFERRED_DISPLAY_PROOF_CHANGED');
 const slots=[...p.paragraphPlans,...p.sentenceRolePlans];
 if(slots.length!==r.questions.length||new Set(slots.map(s=>s.questionId)).size!==r.questions.length)errors.push('READER_PLAN_SLOTS_MISSING');
 for(const q of r.questions){const slot=slots.find(s=>s.questionId===q.id),primary=p.selectedCandidateReferences.find(a=>a.originalReaderQuestion.id===q.id)??null;if(!slot||digest(slot.address)!==digest(q.address)||digest(slot.primary)!==digest(primary))errors.push('READER_PLAN_ADDRESS_OR_PRIMARY_CHANGED');}
 if(p.actualDisplayRecordsIssued||p.customerApproved||p.customerEligible||p.customerSelections||p.customerClaims||p.customerBookAllocations||p.repetitionBudget.independentFactsAdded)errors.push('CUSTOMER_OR_DISPLAY_AUTHORITY_ISSUED');
 if(r.executionMode==='STRICT_CUSTOMER_POLICY'&&p.selectedCandidateReferences.length)errors.push('CURRENT_ACTUAL_RESEARCH_ASSIGNMENTS_MUST_BE_ZERO');
 return{ok:errors.length===0,errors:[...new Set(errors)].sort()};
}
