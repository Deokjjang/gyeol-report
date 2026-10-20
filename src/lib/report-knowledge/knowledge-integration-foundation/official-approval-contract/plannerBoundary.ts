import type { EngineRegistration } from '../global-specialist-integration/types';
import type { ProductContract } from '../product-specialist-foundation/types';
import { digest } from '../global-specialist-integration/candidateEnvelope';
import { prepareRehearsalRequest } from '../global-book-planner/planningRequest';
import { planGlobalBook } from '../global-book-planner/engine';
import { validateGlobalBookPlan } from '../global-book-planner/planValidator';
import { compileEditorialHandoff } from '../global-book-planner/editorialHandoff';
import { syntheticApprovalFixture } from './syntheticApproval';
import { rehearseSignedBinder } from './binderCompatibility';
import { verifyApprovalBundle } from './approvalEnvelope';
export async function rehearseSignedPlanner(root:string,entry:EngineRegistration,readerContract:ProductContract,display=false){
 const f=await syntheticApprovalFixture(root,entry.engineId,display),receipts=rehearseSignedBinder(f.native,f.provider);
 // The existing Planner has no injectable approval provider. Do not add a
 // bypass: prove equality of each selected signed-native Binder receipt with
 // its unchanged authenticated Planner counterpart, then reuse its validator.
 const request=await prepareRehearsalRequest(root,entry,readerContract,display),plan=planGlobalBook(request);
 const comparison=plan.selectedCandidateReferences.map(a=>{
  const signed=receipts.find(r=>r.candidateCatalogKey===a.catalogKey),original=request.bindingReceipts.get(a.originalReceipt.key);
  return{materialId:a.originalMaterialId,signedBinderVerified:!!signed?.customerApproved,receiptByteIdentity:!!signed&&!!original&&digest(signed)===digest(original)};
 });
 const validation=validateGlobalBookPlan(request,plan),handoff=compileEditorialHandoff(request,plan);
 if(!validation.ok||comparison.some(c=>!c.signedBinderVerified||!c.receiptByteIdentity)||handoff.customerAssignable||plan.customerEligible)throw Error('SIGNED_BINDER_PLANNER_BOUNDARY_FAILED');
 const audits=f.contexts.map((c,i)=>verifyApprovalBundle(f.bundles[i],c,f.env));
 return{engine:entry.engineId,mode:'SYNTHETIC_SIGNED_APPROVAL_REHEARSAL',displayFixture:display,registeredMaterials:f.contexts.length,syntheticMaterialIdentity:f.contexts.map(c=>({catalogKey:c.scope.catalogKey,originalId:c.scope.originalResearchId,recordHash:c.scope.originalRecordHash,fixture:c.scope.evidenceScope.fixtureId})),verifiedBundles:audits.filter(a=>a.ok).length,blockedBundles:audits.filter(a=>!a.ok).length,signedBinderEligible:receipts.filter(r=>r.customerApproved).length,selected:plan.primaryInformation.length,unfilled:plan.unfilledQuestions.length,selectedSignedReceiptComparison:comparison,planHash:digest(plan),validation,handoffHash:digest(handoff),actualCustomerApproved:0,actualCustomerEligible:0,actualBookAllocations:0,plannerCodeChanges:0,providerInjectionIntoPlanner:false};
}
