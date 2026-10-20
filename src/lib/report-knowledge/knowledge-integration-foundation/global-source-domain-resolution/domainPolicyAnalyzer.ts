import type {SemanticDomainDecision} from "../semantic-domain-verification/types";
import type {GroupReview} from "../source-verification/types";
import type {ResolutionIndex} from "./resolutionIndex";
import type {SourceResolution} from "./types";
import type {ExactSourceResolver} from "./exactSourceResolver";
import type {KnowledgeCatalogRecord} from "../types";
import {digest} from "../global-specialist-integration/candidateEnvelope";
export async function domainOverlay(decisions:readonly SemanticDomainDecision[],index:ResolutionIndex,resolver:ExactSourceResolver,records:readonly KnowledgeCatalogRecord[],overlay:readonly SourceResolution[]){
 const byKey=new Map(records.map(r=>[r.catalogKey,r])),proofs=new Map(overlay.filter(r=>r.newTechnicalAssessment==="PROVEN_TECHNICAL_RESOLUTION").map(r=>[r.originalReferenceKey,r]));
 const rows=[];
 for(const d of decisions){const r=byKey.get(d.catalogKey);if(!r)throw Error("DOMAIN_ORIGINAL_RECORD_MISSING");const p=await resolver.proof(r.locator,r.originalId,r.catalogKey);if(p.actualHash!==d.originalRecordHash)throw Error("DOMAIN_ORIGINAL_HASH_CHANGED");
  const affected=index.affected(d.catalogKey),technical=d.sourceVerificationReferenceKeys.filter(k=>proofs.has(k));
  rows.push({decisionKey:d.decisionKey,catalogKey:d.catalogKey,originalDecisionHash:digest(d),originalDecisionState:d.decisionState,originalDomain:d.domain,originalSourceProof:p,originalProducts:d.products,originalRelationships:d.relationships,originalContext:d.context,originalPolicies:d.originalPolicyRefs,originalAncestry:d.ancestryRefs,originalRequiredEvidence:d.requiredEvidence,originalRequiredUserState:d.requiredUserState,originalCounterexamples:d.counterexamples,originalProhibitedInference:d.prohibitedInference,originalBlockingReasons:d.blockingReasons,newTechnicalProofReferences:technical,domainDeclarationState:"DOMAIN_DECLARATION_VERIFIED",domainPolicyState:d.decisionState==="EXPLICITLY_PROHIBITED"?"PROHIBITED":"DOMAIN_APPLICABILITY_REVIEW_REQUIRED",meaningState:"OPERATOR_APPROVAL_PENDING",actualScopeWitnesses:affected.map(c=>({candidate:c.identity.globalId,engine:c.engine,product:c.productScope,relationship:c.relationshipScope,fixture:c.fixtureScope.fixtureId,evidence:c.actualEvidenceWitnesses,owner:c.ownerRequirements,direction:c.directionRequirements,time:c.temporalRequirements})),operatorApproved:false,customerApproved:false,policyChanged:false});
 }
 return rows;
}
export async function sourceGroupImpact(groups:readonly GroupReview[],overlay:readonly SourceResolution[],index:ResolutionIndex,records:readonly KnowledgeCatalogRecord[],receipts:readonly import("../source-verification/types").VerificationReceipt[],resolver:ExactSourceResolver){
 const result=[];const resolved=new Set(overlay.filter(o=>o.newTechnicalAssessment==="PROVEN_TECHNICAL_RESOLUTION").map(o=>o.originalReferenceKey));
 for(const g of groups){
  const owner=records.find(r=>r.catalogKey===g.catalogKey);if(!owner)throw Error("SOURCE_GROUP_OWNER_MISSING");
  const rows=[];
  for(const [i,a] of g.groups.entries()){
   const checks=[];
   for(const key of a.requiredSources){
    const candidates=records.filter(r=>r.family===owner.family&&r.metadata.key===key),record=candidates.length===1?candidates[0]:null;
    const remaining=record?receipts.filter(r=>r.affectedCatalogKey===record.catalogKey&&r.resolutionState!=="FUTURE_REQUIREMENT_ONLY"&&!resolved.has(r.referenceKey)&&!["EXACT_SOURCE_VERIFIED","UNIQUE_ALIAS_VERIFIED","FRAGMENT_VERIFIED","AUDIT_AND_ORIGINAL_VERIFIED"].includes(r.resolutionState)):[];
    let proof=null,error:string|null=null;if(record)try{proof=await resolver.proof(record.locator,record.originalId,record.catalogKey);}catch(e){error=e instanceof Error?e.message:String(e);}
    checks.push({sourceKey:key,exactCatalogKey:record?.catalogKey??null,proof,remainingReferences:remaining.map(r=>r.referenceKey),error,complete:!!record&&!!proof&&!remaining.length});
   }
   const complete=checks.length>0&&checks.every(c=>c.complete)&&!a.conflictingOwnerTypeDeclarations&&g.semantics!=="UNKNOWN_GROUP_SEMANTICS";
   rows.push({originalGroupIndex:i,original:a,checks,sourceTechnicallyComplete:complete,technicalStateChanged:complete!==(a.status==="DECLARED_SOURCES_VERIFIED"),ownerTypeMatched:"REQUIRES_ORIGINAL_ENTERED_TYPE_PREDICATE",actualProducerMatched:"REQUIRES_SCOPED_BINDER",actualEvidenceMatched:"REQUIRES_SCOPED_BINDER",displayRequirementMet:"UNKNOWN",domainReviewed:false,semanticReviewed:false,customerApproved:false});
  }
  result.push({catalogKey:g.catalogKey,originalId:g.originalId,originalGroupHash:digest(g),originalSemantics:g.semantics,originalGroupPolicy:g.originalGroupPolicy,originalBlockingReasons:g.blockingReasons,groups:rows,affectedCandidates:index.affected(g.catalogKey).map(c=>c.identity.globalId),approvedForCustomer:false});
 }
 return result;
}
