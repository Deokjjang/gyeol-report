import { isRecord } from "../normalization";
import { foundationMarkerKey } from "../../../interpretation-v4/foundationShinsal";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import type { LoveCandidate, LoveDiagnostic } from "./types";
export function sourceDomainBoundary(sources: readonly { domain?: string | null; classification?: string | null; pointer?: string | null }[]) {
  const pair=sources.some(s=>s.domain==="RELATIONSHIP_PAIR"||s.classification==="PAIR_REFERENCE_ONLY"||/^\/(notablePairs|relationshipHints)(\/|$)/.test(s.pointer??""));
  const child=sources.some(s=>s.domain==="CHILD"||s.domain==="CHILDREN"||/^\/traits\/(child|children)(\/|$)/.test(s.pointer??""));
  return {pairBlocked:pair,childBlocked:child};
}
export function requiredLoveAncestry(c: LoveCandidate, index: ActualBindingIndex, catalog: KnowledgeBinderCatalog, selectedNodes: readonly string[]) {
  const keys=new Set(c.sources.flatMap(s=>s.requiredAncestors.map(a=>a.catalogKey))),records=[...keys].map(k=>catalog.semantic.graph.byKey.get(k)!).filter(Boolean);
  const declarations=(r: typeof records[number])=>[{pointer:r.locator.pointer,domain:r.family==="mbti-pair-relation-research"?"RELATIONSHIP_PAIR":typeof r.metadata.sourceDomain==="string"?r.metadata.sourceDomain:null,classification:typeof r.metadata.classification==="string"?r.metadata.classification:null},...(catalog.decisions.get(r.catalogKey)??[]).map(d=>({domain:typeof d.sourceDomain==="string"?d.sourceDomain:null}))];
  const blockedSources=records.filter(r=>{const b=sourceDomainBoundary(declarations(r));return b.pairBlocked||b.childBlocked;});
  const nodes=[...new Map(selectedNodes.flatMap(id=>{const n=index.graph.nodes.get(id);return n?index.ancestors(n):[];}).map(n=>[n.id,n])).values()];
  const nodeBoundary=(n:ActualEvidenceNode)=>sourceDomainBoundary([{domain:isRecord(n.value)&&typeof n.value.sourceDomain==="string"?n.value.sourceDomain:null,classification:isRecord(n.value)&&typeof n.value.classification==="string"?n.value.classification:null,pointer:isRecord(n.value)&&typeof n.value.sourcePath==="string"?n.value.sourcePath:null},...n.sources.map(s=>({pointer:s.pointer,classification:s.originalClassification}))]);
  const sourceBoundary=sourceDomainBoundary([...c.sources.map(s=>({pointer:s.originalLocator?.pointer})),...blockedSources.flatMap(declarations)]);
  const pairBlocked=sourceBoundary.pairBlocked||nodes.some(n=>nodeBoundary(n).pairBlocked),childBlocked=sourceBoundary.childBlocked||nodes.some(n=>nodeBoundary(n).childBlocked);
  return {pairBlocked,childBlocked,blockedSources:blockedSources.map(r=>r.catalogKey),blockedNodes:nodes.filter(n=>nodeBoundary(n).pairBlocked||nodeBoundary(n).childBlocked).map(n=>n.id),reasons:[...(pairBlocked?["REQUIRED_PAIR_ANCESTRY_WITHHELD_FOR_PERSONAL_APPLICATION"]:[]),...(childBlocked?["REQUIRED_CHILD_ANCESTRY_CANNOT_DESCRIBE_PARENT"]:[])]};
}
export function inspectLoveFusion(index: ActualBindingIndex, node: ActualEvidenceNode): LoveDiagnostic["fusion"][number] {
  const spec={id:"love-fusion-observation:"+node.id,originalField:"actual-graph",originalDeclaration:{observationOnly:true},sourceKey:null,sourceCatalogKeys:[],owner:"person" as const,use:"FUSION" as const,selector:{kinds:["FUSION_DERIVATION" as const],owner:"person" as const,evidenceId:node.fact.producerEvidenceId??undefined,fields:[],requiresFusionRoots:true,allowedContexts:["love"]},required:true,gaps:[]};
  const m=index.match(spec),value=isRecord(node.value)?node.value:{},anc=index.ancestors(node);
  const profile=index.request.graphInput.profiles.person?.fusion,original=profile?[...profile.reinforce,...profile.tensions,...profile.complements].find(c=>c.id===node.fact.producerEvidenceId):null;
  const supported=!!original&&original.ruleId===value.ruleId,scoring=anc.some(n=>n.kind==="MBTI_SOURCE_NODE"&&isRecord(n.value)&&n.value.classification==="SCORING_SEMANTIC"&&n.owner.fixtureOwnerId===node.owner.fixtureOwnerId);
  const reasons=[...m.reasons,...(!supported?["ORIGINAL_FUSION_PRODUCER_RULE_NOT_FOUND"]:[]),...(!scoring?["ACTUAL_SCORING_MBTI_ROOT_REQUIRED"]:[])];
  return {node:node.id,matched:m.matchedActualEvidence.some(n=>n.nodeId===node.id)&&!reasons.length,reasons:[...new Set(reasons)],roots:node.ancestry.rootIds,ruleId:value.ruleId,contexts:value.contexts,split:value.conditionSplit};
}
export function positiveSymbolObservation(symbol: "DOHWA" | "CHEONEUL" | "HONGYEOM", index: ActualBindingIndex): LoveDiagnostic["positiveSymbols"][number] {
  // Exact existing natal-table feature IDs; no calculation or new alias.
  const features=symbol==="HONGYEOM"?[]:[...new Set([...index.graph.nodes.values()].flatMap(n=>isRecord(n.value)&&typeof n.value.featureDefinitionId==="string"&&foundationMarkerKey(n.value.featureDefinitionId)===symbol?[n.value.featureDefinitionId]:[]))];
  const matches=features.map(feature=>index.match({id:"love-symbol:"+symbol,originalField:"actual-graph",originalDeclaration:{observationOnly:true,sourceReviewSeparate:true},sourceKey:null,sourceCatalogKeys:[],owner:"person",use:"ACTUAL_FACT",selector:{kinds:["CALCULATED_NATAL_FACT"],owner:"person",fields:[{path:"value.featureDefinitionId",equals:feature}]},required:true,gaps:[]}));
  const nodes=[...new Set(matches.flatMap(m=>m.matchedActualEvidence.map(n=>n.nodeId)))];
  return {symbol,matched:!!nodes.length,nodes,reasons:symbol==="HONGYEOM"?["ORIGINAL_HONGYEOM_RESEARCH_SOURCE_HELD_NO_ALIAS_SUBSTITUTION"]:nodes.length?[]:matches.length?matches.flatMap(m=>m.reasons):["ACTUAL_SYMBOL_NOT_FOUND"],sourceReviewRequired:true,actualOutcomeKnown:false};
}
