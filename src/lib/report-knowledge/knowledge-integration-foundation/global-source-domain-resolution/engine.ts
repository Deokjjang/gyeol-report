import {readFileSync} from "node:fs";
import {join} from "node:path";
import {SourceReader} from "../sourceReader";
import {SourceVerificationEngine} from "../source-verification/engine";
import {technicallyVerified} from "../source-verification/classification";
import type {CatalogConfig,KnowledgeCatalogRecord,KnowledgeReferenceEdge} from "../types";
import type {VerificationConfig,VerificationReceipt,GroupReview} from "../source-verification/types";
import type {SemanticDomainDecision} from "../semantic-domain-verification/types";
import {ResolutionIndex} from "./resolutionIndex";
import {ExactSourceResolver} from "./exactSourceResolver";
import {prioritize} from "./priorityEngine";
import {domainOverlay,sourceGroupImpact} from "./domainPolicyAnalyzer";
import {DeterministicArtifactWriter} from "../global-specialist-integration/deterministicArtifacts";
export class GlobalSourceDomainResolution {
  readonly index:ResolutionIndex;
  constructor(readonly root:string,readonly reader:SourceReader,readonly frozen:ReadonlyMap<string,string>,readonly writer:DeterministicArtifactWriter){this.index=new ResolutionIndex(root);}
  json<T>(file:string):T{return JSON.parse(readFileSync(join(this.root,file),"utf8")) as T;}
  async prepare(){
   const sourceDir="docs/validation/v4-knowledge-source-verification-01",domainDir="docs/validation/v4-knowledge-semantic-domain-verification-01";
   const config=this.json<VerificationConfig>(sourceDir+"/verification-config.json"),catalogConfig=this.json<CatalogConfig>(config.catalogConfig),catalogRoot=config.catalogRoot;
   const manifest=this.json<{shard:string}[]>(catalogRoot+"/knowledge-catalog.json"),records=[...new Set(manifest.map(r=>r.shard))].flatMap(f=>this.json<KnowledgeCatalogRecord[]>(catalogRoot+"/"+f));
   const edges=this.json<{shard:string}[]>(catalogRoot+"/knowledge-edges.json").flatMap(r=>this.json<KnowledgeReferenceEdge[]>(catalogRoot+"/"+r.shard)),unresolved=this.json<KnowledgeReferenceEdge[]>(catalogRoot+"/unresolved-references.json");
   const originalReceipts=this.json<VerificationReceipt[]>(sourceDir+"/source-verification-receipts.json"),receipts=originalReceipts.filter(r=>!technicallyVerified(r));
   const domains=this.json<SemanticDomainDecision[]>(domainDir+"/semantic-domain-decisions.json"),groups=this.json<GroupReview[]>(sourceDir+"/source-group-review.json");
   const counts=Object.fromEntries([...new Set(receipts.map(r=>r.resolutionState))].sort().map(k=>[k,receipts.filter(r=>r.resolutionState===k).length]));
   const expected={DOCUMENTARY_REFERENCE_ONLY:623,FUTURE_REQUIREMENT_ONLY:1418,AMBIGUOUS_SOURCE:48,ORIGINAL_LOCATOR_MISSING:78,SOURCE_RECORD_MISSING:90,UNSUPPORTED_REFERENCE:945};
   if(originalReceipts.length!==6490||receipts.length!==3202||Object.entries(expected).some(([k,v])=>counts[k]!==v)||domains.length!==2966||groups.length!==192)throw Error("SOURCE_DOMAIN_OR_GROUP_BASELINE_CHANGED");
   const native=new SourceVerificationEngine(this.reader,records,edges,config,catalogConfig,this.frozen),resolver=new ExactSourceResolver(this.reader,records,this.frozen,native,unresolved),overlay=[];
   for(const r of receipts)overlay.push(await resolver.resolve(r));
   const priority=prioritize(receipts,overlay,this.index,domains),domainRows=await domainOverlay(domains,this.index,resolver,records,overlay),groupRows=await sourceGroupImpact(groups,overlay,this.index,records,originalReceipts,resolver);
   for(const [name,value] of Object.entries({"source-resolution-overlay.json":overlay,"source-resolution-priority.json":priority,"source-exact-proofs.json":overlay.filter(o=>o.newTechnicalAssessment==="PROVEN_TECHNICAL_RESOLUTION"),"source-alias-fragment-audit.json":overlay.filter(o=>o.resolutionMethod.includes("ALIAS")||o.resolutionMethod.includes("FRAGMENT")),"source-missing-originals.json":overlay.filter(o=>["ORIGINAL_LOCATOR_MISSING","SOURCE_RECORD_MISSING","AMBIGUOUS_SOURCE"].includes(o.originalResolutionState)),"source-unsupported-references.json":overlay.filter(o=>o.originalResolutionState==="UNSUPPORTED_REFERENCE"),"domain-resolution-overlay.json":domainRows,"domain-policy-boundaries.json":domainRows.filter(d=>d.originalDecisionState==="EXPLICITLY_PROHIBITED"),"source-group-impact.json":groupRows}))this.writer.write(name,value);
   return {receipts,overlay,priority,domains,domainRows,groupRows,resolver,records};
  }
}
