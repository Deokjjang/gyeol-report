import { evidenceHash } from "../actual-evidence-graph/graph";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BIPOLAR_AXES } from "../../../interpretation-v4/semanticCore";
import { isRecord } from "../normalization";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import { CareerSpecialistIndex } from "./candidateIndex";
import { observeCareerContext, matchJobContext } from "./context";
import { observeExistingProofs, matchExistingProof } from "./proofMatcher";
import { careerMaterialConflicts } from "./conflictGraph";
import { VERSION, type CareerSpecialistResult, type CareerSelectionReceipt } from "./types";
export class CareerSpecialistEngine {
 readonly index:CareerSpecialistIndex;
 constructor(readonly foundation:ProductSpecialistFoundation){this.index=new CareerSpecialistIndex(foundation);}
 diagnose(request:KnowledgeBindingRequest,prepared?:SpecialistFoundationResult):CareerSpecialistResult{
  if(request.product!=="career_money_study"||request.relationship!==null)throw Error("CAREER_SCOPE_ONLY");
  const before=evidenceHash([request.graph,request.graphInput.evidence]),research=evidenceHash([...this.index.candidates.values()].map(c=>c.material)),originalRecommendations=evidenceHash(request.graphInput.evidence.composition.result.narrative);
  const bound=prepared??this.foundation.run(request),actual=new ActualBindingIndex(request,this.foundation.catalog),context=observeCareerContext(request,Object.fromEntries(["src/lib/interpretation-v3/careerContextV3.ts","src/lib/interpretation-v4/narrativeContext.ts","src/lib/interpretation-v4/narrativeWorkContext.ts","src/lib/interpretation-v4/careerWorkNarrative.ts"].map(f=>[f,this.foundation.catalog.input.frozen.get(f)??"UNKNOWN"]))),proofs=observeExistingProofs(request,actual);
  const receipts=this.index.applicableCandidates.map(c=>bindKnowledgeCandidate(this.index.candidates.get(c.record.catalogKey)?.bindingCandidate??this.foundation.overlays.get(c.record.catalogKey)!.candidate,actual,this.foundation.catalog)),byKey=new Map(receipts.map(r=>[r.candidateCatalogKey,r]));
  const diagnostics:CareerSelectionReceipt[]=[];
  for(const c of this.index.candidates.values()){const r=byKey.get(c.catalogKey)!;if(!r)throw Error("ORIGINAL_CAREER_RECEIPT_MISSING");const nodes=r.selectedActualEvidence.map(id=>actual.graph.nodes.get(id)!).filter(Boolean),ancestors=[...new Map(nodes.flatMap(n=>actual.ancestors(n)).map(n=>[n.id,n])).values()];
   const signals:CareerSelectionReceipt["semanticSignals"]=[];
   for(const n of ancestors)if(isRecord(n.value)){const vs=isRecord(n.value.axes)?Object.entries(n.value.axes):typeof n.value.axis==="string"?[[n.value.axis,n.value.value??n.value.score]]:[];for(const [axis,value]of vs)if(typeof axis==="string"&&typeof value==="number"&&Number.isFinite(value))signals.push({axis,value,node:n.id,signed:(BIPOLAR_AXES as readonly string[]).includes(axis)});}
   diagnostics.push({catalogKey:c.catalogKey,originalId:c.originalId,receipt:r,job:matchJobContext(c,context),recommendation:matchExistingProof(c,proofs,r.canonicalFactRoots,"recommendation"),avoid:matchExistingProof(c,proofs,r.canonicalFactRoots,"avoid"),economic:c.economic,learning:c.learning,actualNodes:r.selectedActualEvidence,roots:r.canonicalFactRoots,semanticSignals:signals,sourceCoverage:ancestors.filter(n=>n.kind==="MBTI_SOURCE_NODE").map(n=>({node:n.id,value:n.value,source:n.sources})),fusion:ancestors.filter(n=>n.kind==="FUSION_DERIVATION").map(n=>({node:n.id,value:n.value,parents:n.ancestry.rootIds,owner:n.owner.fixtureOwnerId})),recall:{required:c.material.researchKind==="recall",actualLedgerPresent:!!request.introducedLedger?.length,eligible:false,reasons:c.material.researchKind==="recall"?["ACTUAL_SAME_OWNER_TYPE_ROOT_MEANING_CLAIM_JOB_CONTEXT_QUESTION_DISPLAY_REQUIRED","PRECEDING_REFS_ARE_NOT_ACTUAL_DISPLAY"]:[]},meaningReviewRequired:true,customerRank:null,selectedForCustomer:false,customerEligible:false});
  }
  const conflicts=careerMaterialConflicts(this.index,diagnostics),qmap=new Map<string,CareerSelectionReceipt[]>();for(const d of diagnostics)for(const l of this.index.candidates.get(d.catalogKey)!.links)if(!(qmap.get(l.questionId)??[]).some(x=>x.catalogKey===d.catalogKey))qmap.set(l.questionId,[...(qmap.get(l.questionId)??[]),d]);
  const e=request.graphInput.evidence,{contentDigest,...body}=e,graphUnchanged=before===evidenceHash([request.graph,e]),researchUnchanged=research===evidenceHash([...this.index.candidates.values()].map(c=>c.material)),recommendationsUnchanged=originalRecommendations===evidenceHash(e.composition.result.narrative);
  const errors=[...bound.errors,...actual.errors,...(v4Digest(body)!==contentDigest?["ORIGINAL_PRODUCER_PACKET_SEAL_INVALID"]:[]),...(!graphUnchanged||!researchUnchanged||!recommendationsUnchanged?["ORIGINAL_INPUT_RESEARCH_OR_RECOMMENDATION_MUTATED"]:[]),...(receipts.some(r=>r.operatorApproved||r.customerApproved)?["REAL_RESEARCH_APPROVAL_MUST_REMAIN_ZERO"]:[])];
  return {version:VERSION,mode:"REAL_RESEARCH_DIAGNOSTICS",fixtureId:request.graph.context.fixtureId,diagnostics,allProductReceipts:receipts,baselineProductReceipts:bound.after,context,proofs,meaningRelations:conflicts.relations,conflicts:conflicts.edges,duplicateFactGroups:conflicts.duplicateFactGroups,rootIndex:conflicts.rootIndex,foundationQuestionCoverage:bound.questionCoverage,coverage:this.index.questions.map(q=>{const ds=qmap.get(q.id)??[];return {questionId:q.id,address:q.address,linkedMaterials:ds.length,actualWitnessMaterials:ds.filter(d=>d.receipt.matches.some(m=>m.matchedActualEvidence.length)).length,customerEligible:0,unknown:[...q.requirement.remainingUnknown,...(!ds.length?["NO_DECLARED_MATERIAL"]:[]),"SEMANTIC_REVIEW_REQUIRED","OPERATOR_AND_CUSTOMER_APPROVAL_REQUIRED"]};}),graphUnchanged,researchUnchanged,recommendationsUnchanged,errors,actualOperatorApproved:0,actualCustomerEligible:0,actualClaimsEmitted:0,customerSelectionRun:false,bookChanges:0};
 }
}
