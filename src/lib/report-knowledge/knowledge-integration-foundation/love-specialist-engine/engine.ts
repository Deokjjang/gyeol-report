import { evidenceHash } from "../actual-evidence-graph/graph";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import { BIPOLAR_AXES } from "../../../interpretation-v4/semanticCore";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { isRecord } from "../normalization";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import { LoveSpecialistIndex } from "./candidateIndex";
import { actualLoveContext, matchRelationshipStatus, materialApplication, validateLoveApplication } from "./relationshipContext";
import { requiredLoveAncestry, inspectLoveFusion, positiveSymbolObservation } from "./evidenceBoundaries";
import { ownParentingWitnesses } from "./parentingSources";
import { loveMaterialConflicts } from "./conflictGraph";
import { VERSION, type LoveResult, type LoveDiagnostic } from "./types";
export class LoveSpecialistEngine {
 readonly index:LoveSpecialistIndex;
 constructor(readonly foundation:ProductSpecialistFoundation){this.index=new LoveSpecialistIndex(foundation);}
 diagnose(request:KnowledgeBindingRequest,prepared?:SpecialistFoundationResult):LoveResult{
  const input=request.graphInput.evidence.input;
  if(request.product!=="love_marriage_child"||request.relationship!==null||input.kind==="compatibility")throw Error("LOVE_SINGLE_PERSON_SCOPE_ONLY");
  const before=evidenceHash([request.graph,request.graphInput.evidence]),research=evidenceHash([...this.index.candidates.values()].map(c=>c.material));
  const bound=prepared??this.foundation.run(request),actual=new ActualBindingIndex(request,this.foundation.catalog),enteredContext=actualLoveContext(input.userContext.relationshipStatus);
  const receipts=this.index.applicableCandidates.map(c=>bindKnowledgeCandidate(this.index.candidates.get(c.record.catalogKey)?.bindingCandidate??this.foundation.overlays.get(c.record.catalogKey)!.candidate,actual,this.foundation.catalog)),byKey=new Map(receipts.map(r=>[r.candidateCatalogKey,r]));
  const symbols=(['DOHWA','CHEONEUL','HONGYEOM']as const).map(s=>positiveSymbolObservation(s,actual));
  const diagnostics:LoveDiagnostic[]=[];
  for(const c of this.index.candidates.values()){const r=byKey.get(c.catalogKey)!;if(!r)throw Error("ORIGINAL_LOVE_RECEIPT_MISSING");const nodes=r.selectedActualEvidence.map(id=>actual.graph.nodes.get(id)!).filter(Boolean),ancestors=[...new Map(nodes.flatMap(n=>actual.ancestors(n)).map(n=>[n.id,n])).values()],ancestry=requiredLoveAncestry(c,actual,this.foundation.catalog,r.selectedActualEvidence),parents=ownParentingWitnesses(actual,c),application=materialApplication(c.material);
   const semanticSignals:LoveDiagnostic["semanticSignals"]=[];
   for(const n of ancestors)if(isRecord(n.value)){const vs=isRecord(n.value.axes)?Object.entries(n.value.axes):typeof n.value.axis==="string"?[[n.value.axis,n.value.value??n.value.score]]:[];for(const[axis,value]of vs)if(typeof axis==="string"&&typeof value==="number"&&Number.isFinite(value))semanticSignals.push({axis,value,node:n.id,signed:(BIPOLAR_AXES as readonly string[]).includes(axis)});}
   const positiveSymbols=c.material.prerequisites.positiveSymbolNeedsActualProducer?symbols.filter(s=>c.sources.some(ref=>ref.registry?.sourceId==="foundation:shinsal_gwiin:"+(s.symbol==="DOHWA"?"dohwa":s.symbol==="CHEONEUL"?"cheoneul":"hongyeom"))):[];
   diagnostics.push({catalogKey:c.catalogKey,originalId:c.originalId,receipt:r,status:matchRelationshipStatus(enteredContext.relationshipStatus,c.material.relationshipStatuses,c.material.prerequisites,c.bindingCandidate.requirement.unresolvedConditions.length>0),boundary:validateLoveApplication(application,enteredContext,{pairBlocked:ancestry.pairBlocked,childBlocked:ancestry.childBlocked,ownParentSource:parents.length>0,symbolVerified:positiveSymbols.length>0&&positiveSymbols.every(s=>s.matched)}),ancestry,actualNodes:r.selectedActualEvidence,roots:r.canonicalFactRoots,semanticSignals,sourceCoverage:[...ancestors.filter(n=>n.kind==="MBTI_SOURCE_NODE"),...parents].filter((n,i,a)=>a.findIndex(x=>x.id===n.id)===i).map(n=>({node:n.id,owner:n.owner.fixtureOwnerId,value:n.value,source:n.sources})),fusion:ancestors.filter(n=>n.kind==="FUSION_DERIVATION").map(n=>inspectLoveFusion(actual,n)),positiveSymbols,recall:{required:c.material.researchKind==="recall",actualLedgerPresent:!!request.introducedLedger?.length,eligible:false,reasons:c.material.researchKind==="recall"?["ACTUAL_COMPATIBLE_OWNER_TYPE_ROOT_MEANING_CLAIM_STATUS_CONTEXT_QUESTION_DISPLAY_REQUIRED","PRECEDING_REFERENCE_IS_NOT_ACTUAL_DISPLAY"]:[]},originalConditions:c.material.prerequisites,meaningReviewRequired:true,customerRank:null,selectedForCustomer:false,customerEligible:false});
  }
  const conflicts=loveMaterialConflicts(this.index,diagnostics),qmap=new Map<string,LoveDiagnostic[]>();for(const d of diagnostics)for(const l of this.index.candidates.get(d.catalogKey)!.links)qmap.set(l.questionId,[...(qmap.get(l.questionId)??[]),d]);
  const e=request.graphInput.evidence,{contentDigest,...body}=e,graphUnchanged=before===evidenceHash([request.graph,e]),researchUnchanged=research===evidenceHash([...this.index.candidates.values()].map(c=>c.material));
  const errors=[...bound.errors,...actual.errors,...(v4Digest(body)!==contentDigest?["ORIGINAL_PRODUCER_PACKET_SEAL_INVALID"]:[]),...(!graphUnchanged||!researchUnchanged?["ORIGINAL_INPUT_OR_RESEARCH_MUTATED"]:[]),...(receipts.some(r=>r.operatorApproved||r.customerApproved)?["REAL_RESEARCH_APPROVAL_MUST_REMAIN_ZERO"]:[])];
  return {version:VERSION,mode:"REAL_RESEARCH_DIAGNOSTICS",fixtureId:request.graph.context.fixtureId,diagnostics,allProductReceipts:receipts,baselineProductReceipts:bound.after,foundationQuestionCoverage:bound.questionCoverage,enteredContext,coverage:this.index.questions.map(q=>({questionId:q.id,address:q.address,linkedMaterials:(qmap.get(q.id)??[]).length,actualWitnessMaterials:(qmap.get(q.id)??[]).filter(d=>d.receipt.matches.some(m=>m.matchedActualEvidence.length)).length,customerEligible:0})),meaningRelations:conflicts.relations,conflicts:conflicts.edges,rootIndex:conflicts.rootIndex,duplicateFactGroups:conflicts.duplicateFactGroups,graphUnchanged,researchUnchanged,errors,actualOperatorApproved:0,actualCustomerEligible:0,actualClaimsEmitted:0,customerSelectionRun:false,bookChanges:0};
 }
}
