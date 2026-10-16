import {bindKnowledgeCandidate,bindingCoverage} from "../knowledge-binder/engine";
import {ActualBindingIndex} from "../knowledge-binder/matching";
import {digest} from "../global-specialist-integration/candidateEnvelope";
import {BINDING_HARD_GATES} from "../types";
import type {KnowledgeCandidate,KnowledgeBindingReceipt} from "../knowledge-binder/types";
import type {SourceResolution,ReevaluationRow,CandidateImpact} from "./types";
export const containsExact=(v:unknown,target:unknown):boolean=>typeof v==="string"?v===target:Array.isArray(v)?v.some(x=>containsExact(x,target)):v!==null&&typeof v==="object"?Object.values(v).some(x=>containsExact(x,target)):false;
export function assertGateDelta(before:KnowledgeBindingReceipt,after:KnowledgeBindingReceipt){
 if(digest(after.allTwelveGateResults.map(g=>g.gate))!==digest(BINDING_HARD_GATES)||after.customerApproved||after.operatorApproved||after.finalDisposition==="CUSTOMER_ELIGIBLE"||after.reuse.independentFactsAdded!==0)throw Error("OVERLAY_APPROVAL_OR_GATE_CONTRACT_VIOLATION");
 // Scope, input, policy, interpretation and approval cannot be authorized by a source proof.
 for(const gate of ["ACTUAL_OWNER","ACTUAL_DIRECTION","ALL_ANCESTOR_DOMAINS","TIME_INTERSECTION","INTERPRETATION_REVIEW","COUNTEREXAMPLES_AND_PROHIBITIONS","PRODUCT_SPECIALISM","CUSTOMER_APPROVAL"]){const b=before.allTwelveGateResults.find(g=>g.gate===gate),a=after.allTwelveGateResults.find(g=>g.gate===gate);if(b&&a&&b.state!=="PASS"&&b.state!=="NOT_APPLICABLE"&&(a.state==="PASS"||a.state==="NOT_APPLICABLE"))throw Error("SOURCE_PROOF_CANNOT_AUTHORIZE_OTHER_GATE:"+gate);}
}
export function reevaluate(candidate:KnowledgeCandidate,index:ActualBindingIndex,original:KnowledgeBindingReceipt,impact:CandidateImpact,resolutions:readonly SourceResolution[]):ReevaluationRow {
 const hash=digest(candidate),clone=structuredClone(candidate),applied:string[]=[],selectorProofs:unknown[]=[];
 for(const spec of clone.requirement.sourceRequirements){
  for(const o of resolutions){
   if(o.newTechnicalAssessment!=="PROVEN_TECHNICAL_RESOLUTION"||!o.resolvedCatalogKey||!o.proofs.length||o.proofs.some(p=>p.expectedHash!==p.actualHash)||o.sourceKind==="EDITORIAL_SOURCE_FRAGMENT")continue;
   if(!containsExact(spec.originalDeclaration,o.originalTarget)&&spec.sourceKey!==o.originalTarget)continue;
   if(index.catalog.sourceChecks.get(o.resolvedCatalogKey)?.state!=="PASS")continue;
   if(!spec.sourceCatalogKeys.includes(o.resolvedCatalogKey)){spec.sourceCatalogKeys.push(o.resolvedCatalogKey);applied.push(o.originalReferenceKey);}
  }
  // An exact single existing witness can refine a missing producer identity.
  // No null selector, ambiguous role, owner, time, group, gap or predicate is removed.
  if(spec.selector&&!spec.selector.producer&&spec.selector.owner!=="UNKNOWN"){
   const match=index.match(spec);if(match.matchedActualEvidence.length===1){const m=match.matchedActualEvidence[0],n=index.graph.nodes.get(m.nodeId)!;
    if(n.ancestry.complete&&n.sources.every(s=>s.state==="VERIFIED")&&n.producer.version&&n.producer.symbol&&(!spec.selector.temporalScope||n.temporal?.certainty==="confirmed")){
     spec.selector.producer={...n.producer};selectorProofs.push({requirementId:spec.id,originalSelectorHash:digest({...spec.selector,producer:undefined}),exactProducer:n.producer,graphNodeId:n.id,ownerId:n.owner.fixtureOwnerId,direction:n.direction,temporal:n.temporal,participants:n.participants,sources:n.sources,requiredAncestry:n.ancestry,kind:"EXISTING_SELECTOR_PRODUCER_REFINEMENT",createsFact:false});
    }
   }
  }
 }
 const next=bindKnowledgeCandidate(clone,index,index.catalog);assertGateDelta(original,next);
 if(digest(candidate)!==hash)throw Error("ORIGINAL_CANDIDATE_MUTATED");
 const b=bindingCoverage([original]),a=bindingCoverage([next]);
 return {candidate:impact.identity.globalId,originalReceiptRef:impact.originalBinderReceipt,originalReceiptId:original.receiptId,originalReceiptHash:digest(original),overlayReceipt:next,appliedProofs:[...new Set(applied)].sort(),sourceRequirementsAdded:0,selectorProofs,originalConditionsPreserved:true,originalGateResults:original.allTwelveGateResults,delta:{sourceMatches:a.sourceMatchOccurrences-b.sourceMatchOccurrences,evidenceMatches:a.actualEvidenceMatchOccurrences-b.actualEvidenceMatchOccurrences,structural:a.structurallyMatched-b.structurallyMatched}};
}
