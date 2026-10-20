import { ActualGraphIndex, evidenceHash } from "../actual-evidence-graph/graph";
import { intersectEvidencePeriods } from "../actual-evidence-graph/temporal";
import { canonicalJson } from "../sourceReader";
import { isRecord } from "../normalization";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import type { KnowledgeBindingMatch, KnowledgeBindingRequest, NormalizedSourceRequirement, BindingOwner, EvidenceSelector } from "./types";
import type { KnowledgeBinderCatalog } from "./catalog";
const paths=["value.god","value.tenGod","value.featureDefinitionId","value.position","value.slot","value.value","value.type","value.sourceDomain","value.classification","value.axis","value.context","value.ruleId","value.kind","value.component","value.actualCrossPersonDetection","value.scope","value.stage","value.stemTenGod","value.branchTenGod"];
export const valueAt=(n:unknown,path:string):unknown=>path.split(".").reduce<unknown>((v,k)=>isRecord(v)?v[k]:undefined,n);
const add=(map:Map<string,string[]>,key:string,id:string)=>map.set(key,[...(map.get(key)??[]),id]);
export class ActualBindingIndex {
 readonly graph:ActualGraphIndex;
 readonly errors:string[]=[];
 readonly byKind=new Map<string,string[]>();readonly byEvidenceId=new Map<string,string[]>();readonly byOwner=new Map<string,string[]>();readonly byPointer=new Map<string,string[]>();readonly bySourceKey=new Map<string,string[]>();readonly bySourceLocator=new Map<string,string[]>();readonly byFile=new Map<string,string[]>();readonly byProducer=new Map<string,string[]>();readonly byScope=new Map<string,string[]>();readonly byField=new Map<string,string[]>();readonly byDomain=new Map<string,string[]>();readonly byRoot=new Map<string,string[]>();
 private parentMap=new Map<string,string[]>();private ancestryCache=new Map<string,ActualEvidenceNode[]>();
 constructor(readonly request:KnowledgeBindingRequest,readonly catalog:KnowledgeBinderCatalog){
  const g=request.graph;this.graph=new ActualGraphIndex(g.context);
  if(!g.validation.ok||g.version!=="actual-evidence-graph-v1"||g.context.catalogVersion!==catalog.evidence.versions.catalog||g.context.sourceVersion!==catalog.evidence.versions.source||g.context.semanticVersion!==catalog.evidence.versions.semantic||request.product!==g.product||request.relationship!==g.relationship||g.context.evaluatedAt!==request.graphInput.evidence.generatedAt)this.errors.push("GRAPH_VERSION_CONTEXT_OR_PRODUCT_MISMATCH");
  for(const n of structuredClone(g.nodes)){const found=this.graph.add(n);if(found.id!==n.id)this.errors.push("ORIGINAL_IN_MEMORY_GRAPH_IDENTITY_REQUIRED");}
  for(const e of g.edges)this.graph.link(e.from,e.to,e.kind,e.required);
  if(!this.errors.length&&!this.graph.finalize().ok)this.errors.push("INVALID_REQUIRED_GRAPH_ANCESTRY");
  const restricted=request.restrictEvidenceTo?new Set(request.restrictEvidenceTo):null;
  for(const n of this.graph.nodes.values()){
   if(restricted&&!restricted.has(n.id))continue;
   add(this.byKind,n.kind,n.id);add(this.byOwner,n.owner.fixtureOwnerId,n.id);add(this.byPointer,n.fact.observationPointer,n.id);add(this.byProducer,canonicalJson(n.producer),n.id);
   if(n.fact.producerEvidenceId)add(this.byEvidenceId,n.fact.producerEvidenceId,n.id);
   if(n.temporal)add(this.byScope,n.temporal.scope,n.id);
   for(const s of n.sources){add(this.byFile,s.file,n.id);add(this.bySourceLocator,canonicalJson([s.file,s.pointer,s.fileSha256]),n.id);for(const k of s.catalogKeys)add(this.bySourceKey,k,n.id);}
   for(const path of paths){const value=valueAt(n,path);if(value!==undefined)add(this.byField,canonicalJson([path,value]),n.id);}
   for(const d of n.ancestry.domains)add(this.byDomain,d,n.id);for(const root of n.ancestry.rootIds)add(this.byRoot,root,n.id);
  }
  for(const e of g.edges)if(e.required)add(this.parentMap,e.from,e.to);
 }
 owner(owner:BindingOwner):string|null{
  const c=this.request.graph.context.owners;
  if(owner==="person")return c.person??null;if(owner==="A")return c.personA??null;if(owner==="B")return c.personB??null;
  if(owner==="PAIR")return c.personA&&c.personB?`fixture-pair:${[c.personA,c.personB].sort().join("|")}`:null;
  return null;
 }
 ancestors(node:ActualEvidenceNode):ActualEvidenceNode[]{if(!this.ancestryCache.has(node.id)){const seen=new Set<string>(),stack=[node.id],found:ActualEvidenceNode[]=[];while(stack.length){const id=stack.pop()!;if(seen.has(id))continue;seen.add(id);const n=this.graph.nodes.get(id);if(n)found.push(n);for(const p of this.parentMap.get(id)??[])stack.push(p);}this.ancestryCache.set(node.id,found);}return this.ancestryCache.get(node.id)!;}
 private query(s:EvidenceSelector):ActualEvidenceNode[]{
  const buckets:string[][]=[s.kinds.flatMap(k=>this.byKind.get(k)??[])];
  if(s.evidenceId)buckets.push(this.byEvidenceId.get(s.evidenceId)??[]);if(s.observationPointer)buckets.push(this.byPointer.get(s.observationPointer)??[]);if(s.producer)buckets.push(this.byProducer.get(canonicalJson(s.producer))??[]);
  if(s.source?.catalogKey)buckets.push(this.bySourceKey.get(s.source.catalogKey)??[]);
  if(s.source?.file&&s.source.pointer!==undefined&&s.source.fileSha256)buckets.push(this.bySourceLocator.get(canonicalJson([s.source.file,s.source.pointer,s.source.fileSha256]))??[]);else if(s.source?.file)buckets.push(this.byFile.get(s.source.file)??[]);
  if(s.temporalScope)buckets.push(this.byScope.get(s.temporalScope)??[]);
  for(const f of s.fields){if(!paths.includes(f.path))return [];buckets.push(this.byField.get(canonicalJson([f.path,f.equals]))??[]);}
  buckets.sort((a,b)=>a.length-b.length);const rest=buckets.slice(1).map(b=>new Set(b));return [...new Set(buckets[0])].filter(id=>rest.every(s=>s.has(id))).sort().map(id=>this.graph.nodes.get(id)!);
 }
 match(spec:NormalizedSourceRequirement):KnowledgeBindingMatch{
  const trace=spec.sourceCatalogKeys.filter(k=>this.catalog.sourceChecks.get(k)?.state==="PASS");
  const result:KnowledgeBindingMatch={requirementId:spec.id,sourceCatalogKeys:spec.sourceCatalogKeys,matchedSourceReferences:trace,matchedActualEvidence:[],rejectedNodeIds:[],rejectedReasons:[],identityMatches:0,state:"UNKNOWN",reasons:[...spec.gaps]};
  if(spec.sourceCatalogKeys.some(k=>!this.catalog.semantic.graph.byKey.has(k)||this.catalog.sourceChecks.get(k)?.state!=="PASS"))result.reasons.push("SOURCE_INTEGRITY_FAILED");
  if(!spec.selector){result.state=spec.use==="DOCUMENTARY"&&trace.length===spec.sourceCatalogKeys.length&&trace.length>0&&!result.reasons.length?"PASS":"UNKNOWN";if(result.state!=="PASS"&&!result.reasons.length)result.reasons.push("CONTRACT_NOT_MACHINE_CHECKABLE");return result;}
  const selector=spec.selector,expectedOwner=this.owner(selector.owner),matches=this.query(selector);result.identityMatches=matches.length;
  if(selector.fields.some(f=>!paths.includes(f.path)))result.reasons.push("UNSUPPORTED_PREDICATE_FIELD");
  const ownMatches=expectedOwner?matches.filter(n=>n.owner.fixtureOwnerId===expectedOwner):[];
  for(const n of ownMatches.length?ownMatches:matches){const reasons:string[]=[];
   if(!expectedOwner)reasons.push("UNKNOWN_OWNER");else if(n.owner.fixtureOwnerId!==expectedOwner)reasons.push("WRONG_OWNER");
   if(n.status==="WITHHELD")reasons.push("REQUIRED_GRAPH_NODE_WITHHELD");
   if(!n.ancestry.complete||n.ancestry.missingIds.length||n.ancestry.cycle)reasons.push("INCOMPLETE_ACTUAL_ANCESTRY");
   if(n.blockers.some(b=>b.code!=="UNADDRESSABLE_PRODUCER_OBSERVATION"))reasons.push(...n.blockers.map(b=>b.code));
   if(n.sources.some(s=>s.state!=="VERIFIED"))reasons.push("SOURCE_REFERENCE_UNVERIFIED");
   if(selector.source?.fileSha256&&!n.sources.some(s=>s.fileSha256===selector.source!.fileSha256))reasons.push("SOURCE_HASH_MISMATCH");
   if(n.fact.addressability==="PRODUCER_OBSERVATION_ONLY"&&(!n.fact.observationPointer||!n.producer.version||!n.ancestry.complete))reasons.push("UNADDRESSABLE_PRODUCER_OBSERVATION");
   if(selector.requiresScoring&&(!isRecord(n.value)||n.value.classification!=="SCORING_SEMANTIC"))reasons.push("REFERENCE_ONLY_CANNOT_BECOME_SCORING");
   if(selector.direction){const a=this.request.graph.context.owners.personA,z=this.request.graph.context.owners.personB,subject=selector.direction==="A_TO_B"?a:z,recipient=selector.direction==="A_TO_B"?z:a;const god=isRecord(n.value)&&isRecord(n.value.receivedTenGod)?n.value.receivedTenGod:null;
    if(!n.direction||n.direction.subject!==subject||n.direction.recipient!==recipient||n.direction.relationId!==n.fact.producerEvidenceId||!god||god.viewerDayStem!==n.direction.recipientDayMaster||god.targetDayStem!==n.direction.subjectDayMaster)reasons.push("WRONG_DIRECTION");
   }
   if(n.kind==="CANONICAL_PAIR_FACT"){const ownerSet=new Set(n.participants.map(p=>p.owner));if(ownerSet.size!==2||!ownerSet.has(this.owner("A")??"")||!ownerSet.has(this.owner("B")??""))reasons.push("MISSING_PARTICIPANT");}
   if(selector.participants&&!selector.participants.every(p=>n.participants.some(a=>a.owner===this.owner(p.owner)&&a.position===p.position&&a.slot===p.slot&&a.value===p.value)))reasons.push("MISSING_PARTICIPANT");
   if(selector.memberValues&&canonicalJson([...selector.memberValues].sort())!==canonicalJson(n.participants.map(p=>p.value).sort()))reasons.push("MISSING_PARTICIPANT");
   const ancestors=this.ancestors(n);
   if(selector.referenceDirection){const a=this.request.graph.context.owners.personA,z=this.request.graph.context.owners.personB,subject=selector.referenceDirection==="A_TO_B"?a:z,recipient=selector.referenceDirection==="A_TO_B"?z:a;if(n.kind!=="SOURCE_DECLARATION"||!ancestors.some(p=>p.direction!==null&&p.direction.subject===subject&&p.direction.recipient===recipient))reasons.push("WRONG_DIRECTION");const input=this.request.graphInput.evidence.input;if(input.kind!=="compatibility"||!isRecord(n.value)||n.value.sourceType!==(selector.referenceDirection==="A_TO_B"?input.personA.mbtiType:input.personB.mbtiType)||n.value.targetType!==(selector.referenceDirection==="A_TO_B"?input.personB.mbtiType:input.personA.mbtiType))reasons.push("PAIR_REFERENCE_TYPE_MISMATCH");}
   if(ancestors.some(a=>a.status==="WITHHELD"||!a.ancestry.complete||a.sources.some(s=>s.state!=="VERIFIED")))reasons.push("REQUIRED_ANCESTOR_WITHHELD");
   if(selector.requiresFusionRoots){const own=ancestors.filter(a=>a.owner.fixtureOwnerId===n.owner.fixtureOwnerId),natal=own.some(a=>a.kind==="CALCULATED_NATAL_FACT"&&a.fact.rootType==="PRODUCER_OBSERVATION"),mbti=own.some(a=>a.kind==="MBTI_SOURCE_NODE"&&a.fact.rootType==="SOURCE_ATTRIBUTION");if(!natal||!mbti)reasons.push("MISSING_FUSION_ROOT");if(ancestors.some(a=>["SEMANTIC_DERIVATION","CALCULATED_NATAL_FACT","MBTI_SOURCE_NODE"].includes(a.kind)&&a.owner.fixtureOwnerId!==n.owner.fixtureOwnerId))reasons.push("WRONG_OWNER");if(!isRecord(n.value)||n.value.ruleId==="UNKNOWN"||!n.value.ruleId)reasons.push("MISSING_RULE_ID");}
   for(const required of selector.requiredAncestors??[])if(!ancestors.some(a=>required.kinds.includes(a.kind)&&a.owner.fixtureOwnerId===this.owner(required.owner)&&required.fields.every(f=>canonicalJson(valueAt(a,f.path))===canonicalJson(f.equals))&&(!required.source||a.sources.some(s=>(!required.source!.catalogKey||s.catalogKeys.includes(required.source!.catalogKey))&&(!required.source!.file||s.file===required.source!.file)&&(required.source!.pointer===undefined||s.pointer===required.source!.pointer)&&(!required.source!.fileSha256||s.fileSha256===required.source!.fileSha256)))&&(!required.requiresScoring||isRecord(a.value)&&a.value.classification==="SCORING_SEMANTIC")))reasons.push("REQUIRED_FUSION_ANCESTOR_NOT_MATCHED");
   if(selector.allowedContexts?.length&&(!isRecord(n.value)||!Array.isArray(n.value.contexts)||!n.value.contexts.some(c=>selector.allowedContexts!.includes(String(c)))))reasons.push("FUSION_CONTEXT_MISMATCH");
   if(reasons.length){result.rejectedNodeIds.push(n.id);result.rejectedReasons.push(...reasons);continue;}
   result.matchedActualEvidence.push({nodeId:n.id,producerEvidenceId:n.fact.producerEvidenceId,ownerId:n.owner.fixtureOwnerId,rootIds:n.ancestry.rootIds,producer:n.producer,addressability:n.fact.addressability,participants:n.participants,direction:n.direction,temporal:n.temporal,sources:n.sources});
  }
  if(!matches.length){result.reasons.push(selector.requiresFusionRoots?"RULE_SPECIFIC_FUSION_NOT_FOUND":"ACTUAL_EVIDENCE_NOT_FOUND");if(selector.source?.catalogKey&&!this.catalog.semantic.graph.byKey.has(selector.source.catalogKey))result.reasons.push("CATALOG_KEY_MISSING");const unknown=(this.byKind.get("UNKNOWN_REQUIREMENT")??[]).map(id=>this.graph.nodes.get(id)!).filter(n=>n.owner.fixtureOwnerId===expectedOwner);if(selector.requiresScoring&&unknown.some(n=>isRecord(n.value)&&n.value.code==="UNKNOWN_MBTI"))result.reasons.push("UNKNOWN_MBTI");const hour=selector.observationPointer?.split("/").includes("hour")||selector.fields.some(f=>f.path==="value.position"&&f.equals==="hour")||selector.participants?.some(p=>p.position==="hour");if(hour&&unknown.some(n=>isRecord(n.value)&&n.value.code==="UNKNOWN_BIRTH_TIME"))result.reasons.push("UNKNOWN_BIRTH_TIME");}
  result.rejectedReasons=[...new Set(result.rejectedReasons)].sort();if(!result.matchedActualEvidence.length)result.reasons.push(...result.rejectedReasons);
  result.reasons=[...new Set(result.reasons)].sort();result.state=result.matchedActualEvidence.length&&!result.reasons.length?"PASS":!expectedOwner||result.reasons.some(r=>["UNKNOWN_MBTI","UNKNOWN_BIRTH_TIME"].includes(r))?"UNKNOWN":"FAIL";return result;
 }
 temporal(nodeIds:readonly string[],scope:string|null,compositeLayers:number){
  if(compositeLayers>2)return {state:"FAIL" as const,reasons:["UNSUPPORTED_COMPOSITE"]};
  if(scope==="UNKNOWN")return {state:"UNKNOWN" as const,reasons:["UNKNOWN_INTERVAL"]};
  const nodes=nodeIds.map(id=>this.graph.nodes.get(id)!).filter(Boolean),periods=nodes.flatMap(n=>n.temporal?[n.temporal]:[]);
  if(scope&&scope!=="natal"&&nodes.some(n=>n.kind==="CALCULATED_NATAL_FACT"))return {state:"FAIL" as const,reasons:["NATAL_FACT_IS_NOT_PERIOD_EVENT"]};
  if(scope&&scope!=="natal"&&!periods.some(p=>p.scope===scope))return {state:"UNKNOWN" as const,reasons:["ACTUAL_PERIOD_REQUIRED"]};
  if(!periods.length)return {state:"NOT_APPLICABLE" as const,reasons:[]};
  if(this.request.requiredWindow)periods.push(this.request.requiredWindow);
  const intersection=intersectEvidencePeriods(periods,compositeLayers);
  return {state:intersection.state==="CONFIRMED_INTERSECTION"?"PASS" as const:intersection.state==="UNKNOWN_INTERVAL"||intersection.state==="CONDITIONAL_INTERSECTION"?"UNKNOWN" as const:"FAIL" as const,reasons:intersection.state==="CONFIRMED_INTERSECTION"?[]:[intersection.reason??intersection.state]};
 }
 fingerprint(){return evidenceHash(this.request.graph);}
}
