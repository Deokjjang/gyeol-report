import { SourceReader, recordHash } from "../sourceReader";
import { SemanticDomainVerificationEngine } from "../semantic-domain-verification/engine";
import { EvidenceKnowledgeIndex } from "../actual-evidence-graph/knowledge";
import { isRecord } from "../normalization";
import type { CatalogKey, JsonRecord, KnowledgeCatalogRecord, ProductKey, RelationshipCategory } from "../types";
import type { SemanticInputs, SemanticDomainDecision } from "../semantic-domain-verification/types";
import type { GraphKnowledgeInputs } from "../actual-evidence-graph/types";
import type { KnowledgeCandidate, BinderDecisionIndex } from "./types";
import { adaptKnowledgeRequirement, interpretationClassification } from "./requirements";
export class KnowledgeBinderCatalog {
  readonly semantic: SemanticDomainVerificationEngine;
  readonly evidence: EvidenceKnowledgeIndex;
  readonly raw = new Map<CatalogKey, JsonRecord>();
  readonly candidates = new Map<CatalogKey, KnowledgeCandidate>();
  readonly familyKeys = new Map<string, KnowledgeCatalogRecord[]>();
  readonly originalIds = new Map<string, KnowledgeCatalogRecord[]>();
  readonly byLocator = new Map<string, KnowledgeCatalogRecord[]>();
  mbtiDomains: JsonRecord = {};
  readonly sourceChecks = new Map<CatalogKey, KnowledgeCandidate["sourceCheck"]>();
  readonly product = new Map<ProductKey, CatalogKey[]>();
  readonly relationship = new Map<RelationshipCategory, CatalogKey[]>();
  readonly sourceGroupIds = new Map<string, { catalogKey: CatalogKey; groupIndex: number }[]>();
  readonly decisions: BinderDecisionIndex;
  private selectorCache = new Map<string, CatalogKey[]>();
  constructor(readonly reader: SourceReader, readonly input: SemanticInputs, graphKnowledge: GraphKnowledgeInputs, decisions: readonly SemanticDomainDecision[]) {
    this.semantic = new SemanticDomainVerificationEngine(reader,input);
    this.evidence = new EvidenceKnowledgeIndex(graphKnowledge);
    const ds = new Map<CatalogKey, SemanticDomainDecision[]>();
    for (const d of decisions) ds.set(d.catalogKey,[...(ds.get(d.catalogKey)??[]),d]);
    this.decisions=ds;
    for (const r of input.records) { this.originalIds.set(r.originalId,[...(this.originalIds.get(r.originalId)??[]),r]); const locator=JSON.stringify([r.locator.file,r.locator.pointer??null]);this.byLocator.set(locator,[...(this.byLocator.get(locator)??[]),r]); if(typeof r.metadata.key==="string")this.familyKeys.set(`${r.family}:${r.metadata.key}`,[...(this.familyKeys.get(`${r.family}:${r.metadata.key}`)??[]),r]); }
  }
  async prepare() {
    await this.semantic.prepare();
    const mbtiCore=this.input.config.staticModules.mbtiCore;
    if(mbtiCore){const source=await this.reader.exports(mbtiCore);if(isRecord(source.MBTI_TRAIT_DOMAINS))this.mbtiDomains=source.MBTI_TRAIT_DOMAINS;}
    for (const r of this.input.records) {
      try { const value=await this.semantic.raw(r.catalogKey);this.raw.set(r.catalogKey,isRecord(value)?value:{value}); this.sourceChecks.set(r.catalogKey,{state:"PASS",reasons:[],actualRecordHash:recordHash(value),fileHash:this.reader.files.get(r.locator.file)??null}); }
      catch(e){this.sourceChecks.set(r.catalogKey,{state:"FAIL",reasons:[e instanceof Error?e.message:String(e)],actualRecordHash:null,fileHash:null});}
    }
    for (const r of this.input.records.filter(r=>r.namespace==="RESEARCH")) {
      const raw=this.raw.get(r.catalogKey)??{},classification=interpretationClassification(r,raw),requirement=adaptKnowledgeRequirement(r,raw,this);
      const candidate:KnowledgeCandidate={record:r,requirement,...classification,sourceCheck:this.sourceChecks.get(r.catalogKey)!,provenance:"ACTUAL_RESEARCH"};this.candidates.set(r.catalogKey,candidate);
      for(const group of requirement.sourceGroups)if(group.originalId)this.sourceGroupIds.set(group.originalId,[...(this.sourceGroupIds.get(group.originalId)??[]),{catalogKey:r.catalogKey,groupIndex:group.originalIndex}]);
      if(candidate.classification!=="INTERPRETATION_CANDIDATE")continue;
      for(const p of requirement.products)this.product.set(p,[...(this.product.get(p)??[]),r.catalogKey]);
      for(const c of requirement.relationships)this.relationship.set(c,[...(this.relationship.get(c)??[]),r.catalogKey]);
    }
  }
  sourceKey(family:string,key:string) { return this.familyKeys.get(`${family}:${key}`)??this.originalIds.get(key)??[]; }
  sourceAncestors(key:CatalogKey):CatalogKey[]{if(!this.selectorCache.has(key))this.selectorCache.set(key,this.semantic.graph.trace(key).requiredSourceKeys);return this.selectorCache.get(key)!;}
  search(product:ProductKey,relationship:RelationshipCategory|null):KnowledgeCandidate[]{return (this.product.get(product)??[]).map(k=>this.candidates.get(k)!).filter(c=>product!=="saju_mbti_compatibility"?!c.requirement.relationships.length:relationship!==null&&c.requirement.relationships.includes(relationship));}
}
