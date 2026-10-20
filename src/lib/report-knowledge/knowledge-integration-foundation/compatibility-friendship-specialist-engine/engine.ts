import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate, bindingCoverage } from "../knowledge-binder/engine";
import { evidenceHash } from "../actual-evidence-graph/graph";
import { canonicalJson, hash } from "../sourceReader";
import { isRecord } from "../normalization";
import { observePairWitnesses, pairWitnessErrors } from "../compatibility-love-specialist-engine/pairWitness";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import { BIPOLAR_AXES } from "../../../interpretation-v4/semanticCore";
import { buildMbtiSemanticProfile } from "../../../interpretation-v4/mbtiSemanticProfile";
import { FriendshipCandidateIndex } from "./candidateIndex";
import { resolveSourceInventory } from "./sourceInventoryResolver";
import { normalizeFriendshipRequirement } from "./requirementAdapter";
import { FRIENDSHIP_POLICY, unknownContext } from "./relationshipContext";
import { evaluateIntroducedGroups } from "./introducedGroups";
import { meaningRelations, structuralConflictRelations, type Meaning } from "./conflictGraph";
import { validateAncestry } from "../../../../../tools/compatibility-friendship-specialist-engine/sharedServices";
export class CompatibilityFriendshipSpecialistEngine {
  readonly index; readonly sourceAuditPromise;
  constructor(readonly foundation:ProductSpecialistFoundation) { this.index=new FriendshipCandidateIndex(foundation);this.sourceAuditPromise=auditOriginalSources(foundation); }
  static async prepare(foundation:ProductSpecialistFoundation) { const engine=new CompatibilityFriendshipSpecialistEngine(foundation);await engine.sourceAuditPromise;return engine; }
  diagnose(request:KnowledgeBindingRequest, prepared?:SpecialistFoundationResult) {
    const e=request.graphInput.evidence;
    if(request.product!=="saju_mbti_compatibility"||request.relationship!=="friendship"||e.input.kind!=="compatibility"||e.composition.product!=="saju_mbti_compatibility"||e.composition.result.evidence.category!=="friendship")throw Error("FRIENDSHIP_ONLY");
    if(e.input.compatibilityRoleVersion!==FRIENDSHIP_POLICY.roleVersion||e.composition.result.evidence.roleVersion!==FRIENDSHIP_POLICY.roleVersion||canonicalJson(e.composition.result.evidence.roles)!==canonicalJson(FRIENDSHIP_POLICY.roles))throw Error("V4_FIXED_AB_ROLE_REQUIRED");
    const input=e.input;
    const seal=evidenceHash([request.graph,e]),base=prepared??this.foundation.run(request),actual=new ActualBindingIndex(request,this.foundation.catalog);
    // The same 173 Foundation overlays and the same graph, without a proposed
    // inventory-to-claim mapping being silently installed into the Binder.
    const receipts=this.index.candidates.map(c=>bindKnowledgeCandidate(this.foundation.overlays.get(c.record.catalogKey)!.candidate,actual,this.foundation.catalog));
    const byKey=new Map(receipts.map(r=>[r.candidateCatalogKey,r]));
    const diagnostics=this.index.materials.map(({material:m,candidate:c,links})=>{
      const receipt=byKey.get(c.record.catalogKey)!,sources=resolveSourceInventory(m,this.foundation.catalog,actual);
      const ids=[...new Set([...receipt.selectedActualEvidence,...sources.flatMap(s=>s.observations.filter(w=>!w.errors.length).map(w=>w.nodeId))])];
      const observations=ids.map(id=>actual.graph.nodes.get(id)!).filter(Boolean);
      const ancestry=validateAncestry(actual,receipt.selectedActualEvidence),inventoryAudit=validateAncestry(actual,ids),inventoryObservationAncestry={...inventoryAudit,nodes:inventoryAudit.nodes.map(n=>({id:n.id}))},display=evaluateIntroducedGroups(m.binding.introducedGroups,[],new Map());
      const informationRoots=[...new Set(receipt.selectedActualEvidence.flatMap(id=>{const n=actual.graph.nodes.get(id);return n?.fact.independentFact&&n.fact.rootId?[n.fact.rootId]:[];}))].sort();
      const supportingAncestryRoots=[...new Set(observations.flatMap(n=>n.ancestry.rootIds))].sort();
      for(const n of observations){this.index.add("ActualEvidenceId",n.id,c.record.catalogKey);for(const source of n.sources)this.index.add("ActualSourceId",source.file+"#"+source.pointer,c.record.catalogKey);for(const domain of n.ancestry.domains)this.index.add("Domain",domain,c.record.catalogKey);for(const root of n.ancestry.rootIds)this.index.add("CanonicalFactRoot",root,c.record.catalogKey);if(isRecord(n.value)&&n.kind==="CANONICAL_PAIR_FACT"&&typeof n.value.kind==="string")this.index.add("CanonicalRelation",n.value.kind,c.record.catalogKey);if(isRecord(n.value)&&isRecord(n.value.receivedTenGod)&&typeof n.value.receivedTenGod.tenGodKo==="string")this.index.add("RecipientTenGod",n.value.receivedTenGod.tenGodKo,c.record.catalogKey);}
      for(const owner of m.binding.ownerRoots){const type=owner==="A"?input.personA.mbtiType:input.personB.mbtiType;if(type)this.index.add("MBTIType",type,c.record.catalogKey);}
      const directions=observations.filter(n=>n.kind==="DIRECTIONAL_RELATION_FACT"&&n.direction?.subject===actual.owner(m.binding.direction==="A_TO_B"?"A":"B")&&m.binding.direction!==null).map(n=>({id:n.id,producer:n.producer,originalEvidenceId:n.fact.producerEvidenceId,owner:n.owner,direction:n.direction,receivedTenGod:isRecord(n.value)?n.value.receivedTenGod:null,source:n.sources,ancestry:n.ancestry,errors:pairWitnessErrors(actual,n),actualRecipientReaction:"UNKNOWN"}));
      const blockers=[...new Set([...receipt.followupRequirements,...ancestry.reasons,...sources.filter(s=>s.referenceKind==="SOURCE_INVENTORY_REFERENCE").map(()=>"SOURCE_ROLE_NOT_MACHINE_CHECKABLE"),...m.binding.actualContextRequired.map(k=>"ACTUAL_CONTEXT_REQUIRED:"+k),...(m.mode==="REPAIR"?["REPAIR_REQUIRES_INTRODUCED_FRICTION",...display.reasons]:[]),...(m.mode==="RECALL"?["RECALL_REQUIRES_ACTUAL_DISPLAY",...display.reasons]:[]),"MEANING_REVIEW_REQUIRED","CUSTOMER_APPROVAL_PENDING"])].sort();
      const canonical=observations.filter(n=>n.kind==="CANONICAL_PAIR_FACT").map(n=>({id:n.id,producer:n.producer,originalEvidenceId:n.fact.producerEvidenceId,participants:n.participants,value:n.value,ancestry:n.ancestry,errors:pairWitnessErrors(actual,n)}));
      return {originalResearchId:m.id,catalogKey:c.record.catalogKey,address:m.address,mode:m.mode,originalSourceLocator:c.record.locator,sourceHash:c.record.locator.recordSha256,questionIds:links.map(l=>l.questionId),material:m,normalization:normalizeFriendshipRequirement(c,m),sources:sources.map(({observations,...source})=>({...source,observationIndexKey:source.source.sourceRef+":"+source.source.owner,observationNodeIds:observations.map(n=>n.nodeId)})),actualPersonARoots:[...new Set(observations.filter(n=>n.owner.fixtureOwnerId===actual.owner("A")).flatMap(n=>n.ancestry.rootIds))].sort(),actualPersonBRoots:[...new Set(observations.filter(n=>n.owner.fixtureOwnerId===actual.owner("B")).flatMap(n=>n.ancestry.rootIds))].sort(),canonical,directions,receivedTenGod:directions.map(d=>d.receivedTenGod),mbtiSourceState:sources.filter(s=>s.source.sourceRef.endsWith("individual-mbti")).map(s=>({owner:s.source.owner,state:s.requirementState,observationNodeIds:s.observations.map(n=>n.nodeId)})),individualFusionState:sources.filter(s=>s.source.sourceRef.endsWith("individual-fusion")).map(s=>({owner:s.source.owner,state:s.requirementState,observationNodeIds:s.observations.map(n=>n.nodeId)})),ancestry,inventoryObservationAncestry,inventoryObservationsAreRequired:false,actualRelationshipFacts:m.actualRelationshipFacts,context:unknownContext(),lifeContexts:this.index.research.life.filter(l=>l.materialAddresses.includes(m.address)),repairStudies:this.index.research.repairs.filter(r=>r.frictionAddress===m.address||r.repairAddresses.includes(m.address)),concepts:this.index.research.concepts.filter(r=>m.conceptIds.includes(r.id)),facets:this.index.research.facets.filter(r=>m.facetRefs.includes(r.sourceId)),introducedGroups:m.binding.introducedGroups,display,informationRoots,supportingAncestryRoots,receipt,meaningIdentity:null,claimIdentity:null,operatorApproval:false,customerApproval:false,rank:null,selected:false,eligible:false,blockers};
    });
    const conflicts=[];
    const meaning=(d:typeof diagnostics[number]):Meaning=>({id:d.originalResearchId,claim:d.originalResearchId,owner:d.mode==="SELF_A"?"A":d.mode==="SELF_B"?"B":"PAIR",direction:d.material.binding.direction,context:"UNKNOWN",application:d.address,boundary:"REVIEW_REQUIRED",consent:"UNKNOWN",permission:"UNKNOWN",reciprocity:"UNKNOWN",function:d.mode==="REPAIR"?"REPAIR":d.mode==="RECALL"?"RECALL":"NEW_APPLICATION",reviewed:false});
    for(let i=0;i<diagnostics.length;i++)for(let j=i+1;j<diagnostics.length;j++){const a=diagnostics[i],b=diagnostics[j];conflicts.push({a:a.originalResearchId,b:b.originalResearchId,...meaningRelations(meaning(a),meaning(b),a.informationRoots.some(r=>b.informationRoots.includes(r))),structuralWithholds:{a:structuralConflictRelations(a.blockers),b:structuralConflictRelations(b.blockers)},structuralWithholdIsNotConfirmedSemanticConflict:true});}
    const graphUnchanged=seal===evidenceHash([request.graph,e]);
    const inventoryIds=new Set(diagnostics.flatMap(d=>d.sources.flatMap(s=>s.observationNodeIds)));
    const inventoryWitnesses=[...actual.graph.nodes.values()].filter(n=>inventoryIds.has(n.id)).map(n=>({id:n.id,kind:n.kind,owner:n.owner,producer:n.producer,fact:n.fact,sources:n.sources,ancestry:n.ancestry,status:n.status,participants:n.participants,direction:n.direction,valueHash:hash(canonicalJson(n.value)),valueIdentity:isRecord(n.value)?Object.fromEntries(Object.entries(n.value).filter(([key])=>["god","kind","axis","ruleId","contexts","sourceDomain","classification","sourceType","targetType","receivedTenGod"].includes(key))):null,applicationApproved:false})).sort((a,b)=>a.id.localeCompare(b.id,"en"));
    return {version:"compatibility-friendship-specialist-v1",mode:"REAL_RESEARCH_DIAGNOSTICS",fixtureId:request.graph.context.fixtureId,before:bindingCoverage(base.after),after:bindingCoverage(receipts),baselineReceipts:base.after,receipts,diagnostics,conflicts,inventoryWitnesses,witnesses:observePairWitnesses(actual),ownerIds:{A:actual.owner("A"),B:actual.owner("B")},signedAxes:request.graph.nodes.flatMap(n=>isRecord(n.value)&&typeof n.value.axis==="string"?[{owner:n.owner,axis:n.value.axis,value:n.value.score??n.value.value,signed:(BIPOLAR_AXES as readonly string[]).includes(n.value.axis),ancestry:n.ancestry}]:[]),questionCoverage:this.index.questions.map(q=>({id:q.id,address:q.address,materials:this.index.lookup("QuestionId",q.id),customerEligible:0})),graphUnchanged,actualCustomerEligible:0,actualSpecialistClaims:0,customerSelection:false,newActualRoots:0,errors:[...base.errors,...actual.errors,...(!graphUnchanged?["ORIGINAL_GRAPH_MUTATED"]:[]),...(canonicalJson(base.after)!==canonicalJson(receipts)?["ORIGINAL_BINDER_RECEIPTS_CHANGED"]:[])]};
  }
}
async function auditOriginalSources(foundation:ProductSpecialistFoundation) {
  const index=new FriendshipCandidateIndex(foundation),catalog=foundation.catalog;
  const crosswalk=[];
  for(const r of [...index.research.traits,...index.research.pairs,...index.research.fusion,...index.research.facets,...index.research.canonical]) {
    const located=await catalog.reader.locate(r.locator),fileHash=catalog.reader.files.get(r.locator.file);
    crosswalk.push({id:r.id,sourceId:r.sourceId,locator:r.locator,verified:!located.code&&fileHash===catalog.input.frozen.get(r.locator.file),state:r.originalState,applicationGate:r.applicationGate,materialAddresses:r.materialAddresses,customerApproved:false});
  }
  const lenses=[];
  for(const l of index.research.lenses){const proofs=[];for(const source of l.sources){const located=await catalog.reader.locate(source);proofs.push({source,verified:!located.code&&catalog.reader.files.get(source.file)===catalog.input.frozen.get(source.file),error:located.code??null});}lenses.push({original:l,proofs});}
  const pairDirections=[];
  for(const p of index.research.pairs){const state=p.originalState;const proofs=[];
    for(const key of ["sourceRecord","reverseSourceRecord"]){const ref=state[key];if(!isRecord(ref)||typeof ref.file!=="string"||typeof ref.pointer!=="string")throw Error("ORIGINAL_PAIR_SOURCE_REQUIRED");const located=await catalog.reader.locate({file:ref.file,pointer:ref.pointer});proofs.push({key,reference:ref,verified:!located.code&&hash(canonicalJson(located.value))===ref.sha256&&catalog.reader.files.get(ref.file)===catalog.input.frozen.get(ref.file),friendshipPatternExists:isRecord(located.value)&&"friendshipPattern"in located.value});}
    pairDirections.push({id:p.id,sourceType:state.sourceType,targetType:state.targetType,proofs,referenceOnly:true});
  }
  const profiles=new Map(index.research.lenses.map(l=>{const result=buildMbtiSemanticProfile(l.type);if(!result.ok)throw Error("ORIGINAL_MBTI_PROFILE_REQUIRED");return [l.type,result.value] as const;}));
  const currentMbti=index.research.traits.map(t=>{const state=t.originalState,node=state.node,profile=typeof state.type==="string"?profiles.get(state.type):null,current=isRecord(node)?profile?.sourceNodes.find(n=>n.id===node.id):null;return {id:t.id,type:state.type,sourceId:t.sourceId,sourceCoverage:state.sourceCoverage,currentProjectionAllowed:state.currentProjectionAllowed,verified:!!current&&isRecord(node)&&current.classification===node.classification&&current.sourceDomain===node.sourceDomain&&current.sourcePath===node.sourcePath&&canonicalJson(profile!.annotations.filter(a=>a.sourceNodeId===node.id))===canonicalJson(state.annotations),inventoryProfileIsActualCustomer:false};});
  if(crosswalk.some(r=>!r.verified)||lenses.some(l=>l.proofs.some(p=>!p.verified))||pairDirections.some(p=>p.proofs.some(r=>!r.verified||r.friendshipPatternExists))||currentMbti.some(r=>!r.verified))throw Error("ORIGINAL_FRIENDSHIP_SOURCE_INTEGRITY_FAILED");
  return {crosswalk,lenses,pairDirections,currentMbti,externalSources:index.research.sources,externalAccessNotExpanded:true,sourceExistenceIsPersonalObservation:false};
}
export type FriendshipResult=ReturnType<CompatibilityFriendshipSpecialistEngine["diagnose"]>;
