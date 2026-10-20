import { LOVE_PARENTING_SOURCE_AUDIT } from "../../love-product-research/parentingSourceAudit";
import { LOVE_PARENTING_STRENGTHS, LOVE_PARENTING_RISK, LOVE_PARENTING_RISK_TRAITS } from "../../../interpretation-v4/loveReleaseParenting";
import { buildMbtiSemanticProfile } from "../../../interpretation-v4/mbtiSemanticProfile";
import { recordHash } from "../sourceReader";
import { isRecord } from "../normalization";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { LoveCandidate } from "./types";
import { resolveLoveReference } from "./requirementAdapter";
import { LOVE_SOURCE_REGISTRY } from "../../love-product-research/sourceRegistry";
export function auditParentingSources(catalog: KnowledgeBinderCatalog) {
  const refs=new Map(LOVE_SOURCE_REGISTRY.map(s=>[s.key,s]));
  return LOVE_PARENTING_SOURCE_AUDIT.map(a=>{
    const profile=buildMbtiSemanticProfile(a.mbtiType);if(!profile.ok)throw Error("ORIGINAL_PARENTING_PROFILE_INVALID");
    const file=`docs/product/mbti/source/${a.mbtiType}.json`,fileText=catalog.reader.text(file),fileHash=catalog.reader.files.get(file)!;
    void fileText;
    if(fileHash!==catalog.input.frozen.get(file))throw Error("ORIGINAL_PARENTING_SOURCE_CHANGED");
    const sources=[...a.strengthSources.map(s=>({...s,role:"STRENGTH"})),{...a.riskSource,role:"RISK"}].map(s=>{
      const ref=refs.get(s.sourceKey),r=ref?resolveLoveReference(ref,catalog):null,pointer=r?.locator&&"pointer" in r.locator?r.locator.pointer:undefined,fieldPointer=pointer?pointer+"/"+s.field:null;
      const nodes=profile.value.sourceNodes.filter(n=>n.mbtiType===a.mbtiType&&n.sourceDomain==="PARENTS"&&n.sourcePath===fieldPointer);
      const verified=!!ref&&!!r?.verified&&ref.sourceId===`mbti:${a.mbtiType}:traits:parenting:${s.traitId}`&&nodes.length===1&&["SCORING_SEMANTIC","REFERENCE_ONLY"].includes(nodes[0].classification)&&typeof nodes[0].sourceCoverage==="string"&&fileHash===ref.sourceFileSha256;
      return {role:s.role,traitId:s.traitId,field:s.field,sourceKey:s.sourceKey,originalLocator:r?.locator??null,fieldPointer,fileHash,fieldHash:nodes.length===1?recordHash(nodes[0].value):null,sourceNode:nodes.length===1?nodes[0]:null,sourceDomain:"PARENTS",ownership:"adult_own_parenting_only",verified,semanticScoringEligible:nodes.length===1&&nodes[0].classification==="SCORING_SEMANTIC",applicationReviewRequired:true,customerApproved:false,requiredActualChildFacts:["existence","age","development","safety"],originalApplication:s.originalApplication};
    });
    const originalRowsPreserved=recordHash(LOVE_PARENTING_STRENGTHS[a.mbtiType])===a.originalStrengthsHash&&recordHash(LOVE_PARENTING_RISK[a.mbtiType])===a.originalRiskHash&&LOVE_PARENTING_RISK_TRAITS[a.mbtiType]===a.riskSource.traitId;
    return {mbtiType:a.mbtiType,strengthRows:sources.filter(s=>s.role==="STRENGTH").length,riskRows:sources.filter(s=>s.role==="RISK").length,sources,originalRowsPreserved,allSourcesVerified:sources.every(s=>s.verified),childFactsProvided:false,childDomainTransferAllowed:false,missingAgePolicy:a.missingAgePolicy,customerApproved:false};
  });
}
export function ownParentingWitnesses(index: ActualBindingIndex, c: LoveCandidate) {
  const input=index.request.graphInput.evidence.input;if(input.kind==="compatibility")return [];
  const type=input.person.mbtiType,owner=index.request.graph.context.owners.person;
  const refs=c.sources.filter(s=>s.verified&&s.registry?.sourceKind==="mbti_trait"&&s.registry.originalState.area==="parenting"&&s.registry.originalState.type===type&&s.originalLocator?.pointer);
  return [...index.graph.nodes.values()].filter(n=>{const v=n.value;return n.kind==="MBTI_SOURCE_NODE"&&n.status==="VERIFIED"&&n.owner.fixtureOwnerId===owner&&isRecord(v)&&v.type===type&&v.sourceDomain==="PARENTS"&&v.classification==="SCORING_SEMANTIC"&&refs.some(s=>typeof v.sourcePath==="string"&&v.sourcePath.startsWith(s.originalLocator!.pointer!+"/")&&n.sources.some(a=>a.file===s.originalLocator!.file&&a.fileSha256===s.registry!.sourceFileSha256&&a.state==="VERIFIED"));});
}
