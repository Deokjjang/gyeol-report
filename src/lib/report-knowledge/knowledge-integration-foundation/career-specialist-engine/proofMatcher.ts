import { isRecord } from "../normalization";
import { canonicalJson } from "../sourceReader";
import { CAREER_ROUTES } from "../../../interpretation-v4/careerRecommendations";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { CareerProofObservation, CareerProofMatch, CareerSpecialistCandidate } from "./types";
const strings=(v:unknown):string[]=>Array.isArray(v)?v.filter((x):x is string=>typeof x==="string"):[];
/** Read original recommendation order/reasons/proof. Documentary route/input
 * references are distinguished from actual native/MBTI/Fusion proof nodes. */
export function observeExistingProofs(request:KnowledgeBindingRequest,index:ActualBindingIndex):CareerProofObservation[]{
  const c=request.graphInput.evidence.composition;if(c.product!=="career_money_study")return [];
  const n=c.result.narrative,owner=index.owner("person"),rows:CareerProofObservation[]=[];
  const observe=(kind:CareerProofObservation["kind"],id:string,rank:number,reason:string,proof:unknown)=>{
    const p=isRecord(proof)?proof:{},refs=strings(p.sourceRefs),features=strings(p.features),fusions=strings(p.fusionIds),matched=new Set<string>(),unresolved:string[]=[];
    const select=(ids:readonly string[],ref:string)=>{const good=ids.filter(id=>{const node=index.graph.nodes.get(id);if(!node||node.owner.fixtureOwnerId!==owner)return false;const m=index.match({id:"career-proof:"+ref,originalField:"/narrative/proof",originalDeclaration:proof,sourceKey:null,sourceCatalogKeys:[],owner:"person",use:"ACTUAL_FACT",selector:{kinds:[node.kind],owner:"person",producer:node.producer,observationPointer:node.fact.observationPointer,fields:[],...(node.kind==="FUSION_DERIVATION"?{requiresFusionRoots:true}:{})},required:true,gaps:[]});return m.matchedActualEvidence.some(n=>n.nodeId===id);});if(!good.length)unresolved.push(ref);else good.forEach(id=>matched.add(id));};
    for(const f of features)select(index.byField.get(canonicalJson(["value.featureDefinitionId",f]))??index.byEvidenceId.get(f)??[],"feature:"+f);
    for(const f of fusions)select(index.byEvidenceId.get(f)??[],"fusion:"+f);
    const routes=refs.flatMap(r=>{const m=/^v4:career-route:([^:]+)(?::environment)?$/.exec(r);return m?[m[1]]:[];});
    for(const ref of refs){
      const direct=index.byEvidenceId.get(ref);if(direct?.length){select(direct,ref);continue;}
      if(/^v4:career-route:/.test(ref)){if(!routes.some(r=>CAREER_ROUTES.some(route=>route.id===r)))unresolved.push(ref);continue;}
      if(["input:jobStatus","input:detailJob","careerContextV3:normalized-dimensions"].includes(ref)||ref.startsWith("v4:career-setting:")){select(index.byKind.get("CONTEXT_INPUT")??[],ref);continue;}
      const sources=index.catalog.semantic.graph.byId.get(ref)??[];
      if(sources.length!==1||index.catalog.sourceChecks.get(sources[0].catalogKey)?.state!=="PASS")unresolved.push(ref);
      // A verified source declaration alone deliberately adds no actual root.
    }
    const nodes=[...matched].map(id=>index.graph.nodes.get(id)!),roots=[...new Set(nodes.flatMap(n=>n.ancestry.rootIds))].sort();
    rows.push({kind,id,rank,originalReason:reason,originalSourceProof:proof,routeReferences:routes,matchedNodeIds:[...matched].sort(),roots,unresolvedSourceRefs:[...new Set(unresolved)].sort(),complete:features.length>0&&roots.length>0&&unresolved.length===0,professionalApplicationApproved:false});
  };
  n.recommendations.forEach((r,i)=>observe("recommendation",r.id,i+1,r.reason,r.proof));
  n.avoidEnvironments.forEach((a,i)=>observe("avoid","existing-avoid-"+(i+1),i+1,a.text,a.proof));
  return rows;
}
export function matchExistingProof(candidate:CareerSpecialistCandidate,proofs:readonly CareerProofObservation[],roots:readonly string[],kind:CareerProofObservation["kind"]):CareerProofMatch {
  const required=kind==="recommendation"?candidate.recommendation.requiresRecommendation:candidate.recommendation.requiresAvoid,available=proofs.filter(p=>p.kind===kind),routeRefs=candidate.recommendation.possibleRouteReferences;
  const candidates=available.filter(p=>routeRefs.some(id=>p.id===id||p.routeReferences.includes(id))),compatible=candidates.filter(p=>p.complete&&roots.length>0&&p.roots.some(r=>roots.includes(r)));
  return {required,exists:available.length>0,proofMatched:compatible.length>0,matchingIds:candidates.map(p=>p.id),rootCompatibleIds:compatible.map(p=>p.id),blockers:[...(required&&!available.length?[kind==="recommendation"?"LEGACY_RECOMMENDATION_MISSING":"EXISTING_AVOID_PROOF_MISSING"]:[]),...(required&&!routeRefs.length?["ORIGINAL_RECOMMENDATION_ROUTE_NOT_DECLARED"]:[]),...(required&&!compatible.length?[kind==="recommendation"?"RECOMMENDATION_PROOF_OR_ROOT_COMPATIBILITY_MISSING":"AVOID_PROOF_OR_ROOT_COMPATIBILITY_MISSING"]:[]),...(required?["SKILL_AND_PROFESSIONAL_APPLICATION_REVIEW_REQUIRED"]:[])],applicationReviewRequired:true};
}
