import {readMarriageResearch,type MarriageMaterial} from "./researchCatalog";
import {adaptMarriageMaterial} from "./requirementAdapter";
import type {ProductSpecialistFoundation} from "../product-specialist-foundation/binderIntegration";
import type {KnowledgeCandidate} from "../knowledge-binder/types";
import type {CatalogKey} from "../types";
import {isRecord} from "../normalization";
export class CompatibilityMarriageIndex {
  readonly candidates;
  readonly research;
  readonly materials = new Map<CatalogKey, { material: MarriageMaterial; candidate: KnowledgeCandidate; sources: ReturnType<typeof adaptMarriageMaterial>["sources"]; links: ProductSpecialistFoundation["questions"]["links"] }>();
  readonly questions;
 readonly indexes = new Map<string, Map<string, Set<CatalogKey>>>();
 lookup(field:string,value:string) { return [...(this.indexes.get(field)?.get(value) ?? [])].map(k=>this.materials.get(k)!); }
 private add(field:string,value:string,key:CatalogKey) {const index=this.indexes.get(field)??new Map<string,Set<CatalogKey>>();const set=index.get(value)??new Set<CatalogKey>();set.add(key);index.set(value,set);this.indexes.set(field,index);}

  constructor(readonly foundation: ProductSpecialistFoundation) {
    this.research = readMarriageResearch(foundation.catalog);
    this.candidates = foundation.catalog.search("saju_mbti_compatibility", "marriage");
    this.questions = foundation.registry.questions.filter(q => q.productKey === "saju_mbti_compatibility" && q.relationshipCategory === "marriage");
    for (const c of this.candidates) {
      if (!c.record.originalId.startsWith("cmpr:material:") || !/\/chapter\d+Materials\.ts$/.test(c.record.locator.file)) continue;
      const raw = foundation.catalog.raw.get(c.record.catalogKey);
      if (!isRecord(raw) || !Array.isArray(raw.ownedSources) || raw.relationshipCategory !== "marriage") throw Error("ORIGINAL_PAIR_MATERIAL_REQUIRED");
      const material = raw as unknown as MarriageMaterial;
      this.materials.set(c.record.catalogKey, { material, ...adaptMarriageMaterial(foundation.overlays.get(c.record.catalogKey)!.candidate, material, foundation, this.research), links: foundation.questions.links.filter(l => l.catalogKey === c.record.catalogKey) });
    }
    for(const [key,row] of this.materials) {
 const m=row.material;
 for(const [field,value] of [["OriginalResearchId",m.id],["CatalogKey",key],["ReaderAddress",m.address],["MaterialMode",m.mode],["ApprovalState","PENDING"]]) this.add(field,value,key);
 for(const l of row.links)this.add("QuestionId",l.questionId,key);
 for(const s of row.sources){this.add("SourceKey",s.source.sourceKey,key);this.add("SourceUse",s.source.sourceUse,key);this.add("Owner",s.source.owner,key);if(s.registry?.sourceKind==="relation_definition")this.add("CanonicalRelationId",s.registry.sourceId,key);}
 for(const p of m.requirements.enteredTypePredicates)this.add("MBTIType",p.owner+":"+p.type,key);
 for(const t of m.householdTopics)this.add("HouseholdTopic",t,key);
 for(const p of m.jointDecision.processRoles)this.add("ResponsibilityPhase",p,key);
 this.add("DecisionRight",m.jointDecision.assignedBy,key);
 if(m.requirements.direction)this.add("Direction",m.requirements.direction.direction,key);
 for(const f of m.semanticFacets){if(isRecord(f)){if(typeof f.axis==="string")this.add("SemanticAxis",f.axis,key);if(typeof f.id==="string")this.add("Facet",f.id,key);}}
 }
 if (this.candidates.length !== 222 || this.materials.size !== 112 || this.questions.length !== 180) throw Error("ORIGINAL_MARRIAGE_COHORT_CHANGED");
  }
}
