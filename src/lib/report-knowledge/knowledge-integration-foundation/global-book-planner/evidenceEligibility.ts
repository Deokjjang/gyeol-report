import { BINDING_HARD_GATES } from '../types';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { isRecord } from '../normalization';
import type { GlobalBookPlanningRequest, PlanningOption, CandidateEligibility } from './types';
import { primaryQuestionReasons } from './questionMatcher';
export function candidateEligibility(r:GlobalBookPlanningRequest,o:PlanningOption):CandidateEligibility {
 const reasons:string[]=[],receipt=r.bindingReceipts.get(o.receiptKey),q=r.questions.find(q=>q.id===o.questionId);
 if(!receipt||digest(receipt)!==o.receiptHash)reasons.push('ORIGINAL_BINDER_RECEIPT_HASH_MISMATCH');
 if(o.product!==r.productKey||o.relationship!==r.relationshipCategory||o.engine!==r.registration.engineId||o.fixtureId!==r.fixtureId)reasons.push('PRODUCT_RELATIONSHIP_FIXTURE_SCOPE_MISMATCH');
 if(receipt){
  if(receipt.allTwelveGateResults.length!==12||receipt.allTwelveGateResults.some((g,i)=>g.gate!==BINDING_HARD_GATES[i]))reasons.push('ALL_TWELVE_HARD_GATES_REQUIRED');
  reasons.push(...receipt.allTwelveGateResults.filter(g=>!['PASS','NOT_APPLICABLE'].includes(g.state)).map(g=>g.gate+':'+g.state));
  if(!receipt.customerApproved||!receipt.operatorApproved||receipt.finalDisposition!=='CUSTOMER_ELIGIBLE')reasons.push('CUSTOMER_APPROVAL_PENDING');
  if(receipt.product!==o.product||receipt.relationship!==o.relationship||receipt.fixtureId!==o.fixtureId||receipt.candidateCatalogKey!==o.catalogKey||receipt.originalResearchId!==o.materialId)reasons.push('ORIGINAL_RECEIPT_SCOPE_MISMATCH');
  if(digest([...o.evidenceIds].sort())!==digest([...receipt.selectedActualEvidence].sort()))reasons.push('EXACT_EVIDENCE_NOT_IN_ORIGINAL_RECEIPT');
  if(digest([...o.ancestryRoots].sort())!==digest([...receipt.canonicalFactRoots].sort()))reasons.push('FULL_REQUIRED_ANCESTRY_CHANGED');
  if(o.primaryRoots.some(id=>!r.canonicalFactRoots.some(root=>root.id===id)))reasons.push('ORIGINAL_FACT_ROOT_MISSING');
  if(receipt.sourceGroupEvaluation.some(g=>g.selected&&g.state!=='PASS'))reasons.push('ORIGINAL_SOURCE_GROUP_AND_BLOCKED');
 }
 if(r.executionMode==='STRICT_CUSTOMER_POLICY'&&o.provenance!=='ACTUAL_RESEARCH')reasons.push('SYNTHETIC_NOT_CUSTOMER_ELIGIBLE');
 if(r.executionMode==='ISOLATED_EDITORIAL_REHEARSAL'&&(o.provenance!=='SYNTHETIC_TEST_ONLY'||o.originalEnvelope!==null||!o.materialId.startsWith('synthetic:')||!o.fixtureId.startsWith('synthetic:')))reasons.push('ACTUAL_RESEARCH_CANNOT_BE_SYNTHETICALLY_APPROVED');
 if(!o.nativeEligible)reasons.push(...o.nativeReasons,'NATIVE_SPECIALIST_WITHHELD');
 if(o.meaningState!=='VERIFIED_SYNTHETIC')reasons.push('MEANING_REVIEW_REQUIRED');
 if(!o.primaryMeaning||!o.claimIdentity)reasons.push('MEANING_AND_CLAIM_ID_REQUIRED');
 if(!o.sourceHash||!o.sourceVersion||receipt&&(o.sourceHash!==receipt.approvalRequirement.originalRecordHash||o.sourceVersion!==receipt.approvalRequirement.sourceVersion))reasons.push('EXACT_SOURCE_HASH_REQUIRED');
 if(o.dependency?.kind==='RECALL'&&!o.dependency.actualDisplayVerified)reasons.push('RECALL_ACTUAL_DISPLAY_REQUIRED');
 if(o.informationKind==='ACTUAL_CALCULATED_FACT'&&r.actualEvidenceWitnesses.some(n=>isRecord(n)&&n.id&&o.evidenceIds.includes(String(n.id))&&n.kind==='SOURCE_DECLARATION'))reasons.push('SOURCE_DEFINITION_NOT_CALCULATED_FACT');
 const common=[...new Set(reasons)].sort();
 const primary=[...common,...(q?primaryQuestionReasons(q,o):['ORIGINAL_READER_QUESTION_MISSING'])];
 return {option:o.id,questionId:o.questionId,eligiblePrimary:primary.length===0,eligibleSupporting:common.length===0&&!!q&&!['EXPRESSION_ONLY','UNMAPPED'].includes(o.materialLinkKind),reasons:[...new Set(primary)].sort(),gates:receipt?.allTwelveGateResults??[],receiptHash:o.receiptHash};
}
