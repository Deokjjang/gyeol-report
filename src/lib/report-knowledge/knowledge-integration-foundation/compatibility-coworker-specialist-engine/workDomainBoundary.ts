import {RELATIONSHIP_DOMAINS} from "../../../interpretation-v4/relationshipProductView";
import {isRecord} from "../normalization";
import type {ActualBindingIndex} from "../knowledge-binder/matching";
export const COWORKER_DOMAINS=RELATIONSHIP_DOMAINS.filter(d=>d!=="LOVE"&&d!=="MARRIAGE");
export function domainReasons(domains:readonly string[]){
 const blocked=[...new Set(domains)].filter(d=>!(COWORKER_DOMAINS as readonly string[]).includes(d));
 return blocked.length?["DISALLOWED_ANCESTOR_DOMAIN","SOURCE_DOMAIN_PROJECTION_MISMATCH","REQUIRED_ANCESTOR_NOT_APPROVED",...blocked.map(d=>d==="CHILDREN"?"CHILDREN_ANCESTRY_CONTAMINATION":d+"_SOURCE_NOT_PROJECTED")]:[];
}
export function validateAncestry(index:ActualBindingIndex,ids:readonly string[],declaredDomains:readonly string[]=[]){
 const nodes=[...new Map(ids.flatMap(id=>{const n=index.graph.nodes.get(id);return n?index.ancestors(n).map(a=>[a.id,a] as const):[];})).values()];
 const missing=ids.filter(id=>!index.graph.nodes.has(id)),domains=[...new Set([...declaredDomains,...nodes.flatMap(n=>n.ancestry.domains),...nodes.flatMap(n=>isRecord(n.value)&&typeof n.value.sourceDomain==="string"?[n.value.sourceDomain]:[])])].sort();
 const reasons=domainReasons(domains);if(missing.length||nodes.some(n=>!n.ancestry.complete||n.ancestry.missingIds.length||n.status==="WITHHELD"||n.sources.some(s=>s.state!=="VERIFIED")))reasons.push("INCOMPLETE_REQUIRED_ANCESTRY","REQUIRED_ANCESTOR_NOT_APPROVED");
 return {nodes:nodes.map(n=>({id:n.id,kind:n.kind,owner:n.owner,producer:n.producer,originalEvidenceId:n.fact.producerEvidenceId,pointer:n.fact.observationPointer,roots:n.ancestry.rootIds,domains:n.ancestry.domains,source:n.sources})),domains,missing,reasons:[...new Set(reasons)].sort(),allowed:!reasons.length,childrenContaminated:domains.includes("CHILDREN"),oneAllowedSourceIsEnough:false};
}
