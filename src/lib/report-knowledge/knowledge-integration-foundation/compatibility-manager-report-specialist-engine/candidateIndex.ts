import {readManagerReportResearch,type Material} from "./researchCatalog";
import {adaptManagerReportMaterial} from "./requirementAdapter";
import type {ProductSpecialistFoundation} from "../product-specialist-foundation/binderIntegration";
import type {CatalogKey} from "../types";
export class CompatibilityManagerReportIndex{
 readonly research;readonly candidates;readonly questions;
 readonly materials=new Map<CatalogKey,ReturnType<typeof adaptManagerReportMaterial>&{material:Material;links:ProductSpecialistFoundation["questions"]["links"]}>();
 readonly indexes=new Map<string,Map<string,Set<CatalogKey>>>();
 add(field:string,value:string,key:CatalogKey){const index=this.indexes.get(field)??new Map<string,Set<CatalogKey>>(),set=index.get(value)??new Set<CatalogKey>();set.add(key);index.set(value,set);this.indexes.set(field,index);}
 lookup(field:string,value:string){return [...this.indexes.get(field)?.get(value)??[]].map(k=>this.materials.get(k)!);}
 constructor(readonly foundation:ProductSpecialistFoundation){
 this.research=readManagerReportResearch(foundation.catalog);this.candidates=foundation.catalog.search("saju_mbti_compatibility","managerReport");this.questions=foundation.registry.questions.filter(q=>q.productKey==="saju_mbti_compatibility"&&q.relationshipCategory==="managerReport");
 const links=new Map<CatalogKey,ProductSpecialistFoundation["questions"]["links"]>();for(const l of foundation.questions.links){const a=links.get(l.catalogKey)??[];a.push(l);links.set(l.catalogKey,a);}
 for(const c of this.candidates){if(!c.record.originalId.startsWith("mrpr:material:"))continue;const material=foundation.catalog.raw.get(c.record.catalogKey) as unknown as Material;this.materials.set(c.record.catalogKey,{material,...adaptManagerReportMaterial(foundation.overlays.get(c.record.catalogKey)!.candidate,material,foundation,this.research),links:links.get(c.record.catalogKey)??[]});}
 for(const [key,row]of this.materials){const m=row.material;for(const [f,v]of [["OriginalResearchId",m.id],["CatalogKey",key],["ReaderAddress",m.address],["MaterialMode",m.mode],["WorkStage",m.workStage],["OutputType",m.outputType],["AuthorityRequirement",m.requirements.authority],["JobContext",m.requirements.jobRole],["ApprovalState","PENDING"],["RoleVersion",m.roleVersion],["AuthorityKind",m.authorityContext.kind]])this.add(f,v,key);
 for(const g of m.requirements.sourceGroups)this.add("SourceGroupId",g.groupId,key);for(const c of this.research.concepts)if(c.materialRefs.includes(m.id))this.add("ManagementConcept",c.concept,key);for(const f of m.requirements.additionalInput)this.add("ReportingRequirement",f,key);for(const s of row.sources)if(s.source.sourceUse==="recipient_direction_definition"&&s.originalRaw&&typeof s.originalRaw.label==="string")this.add("ReceivedTenGod",s.originalRaw.label,key);
 for(const l of row.links)this.add("QuestionId",l.questionId,key);for(const f of m.workFunctions)this.add("WorkFunction",f,key);for(const s of row.sources){this.add("SourceKey",s.source.sourceKey,key);this.add("SourceUse",s.source.sourceUse,key);this.add("Owner",s.source.owner,key);if(s.registry?.sourceKind==="relation_definition")this.add("CanonicalRelationId",s.registry.sourceId,key);}
 for(const p of m.requirements.typePredicates){this.add("MBTIType",p.owner+":"+p.type,key);this.add("MBTIType",p.type,key);this.add("SourceDomain",p.domain,key);}if(m.requirements.direction)this.add("Direction",m.requirements.direction.direction,key);for(const f of m.semanticFacets){this.add("SemanticAxis",f.axis,key);this.add("Facet",f.id,key);}for(const j of this.research.jobs)if(j.materialRefs.includes(m.id))this.add("JobContext",j.jobKey,key);}
 if(this.candidates.length!==275||this.materials.size!==96||this.questions.length!==180)throw Error("ORIGINAL_MANAGER_REPORT_COHORT_CHANGED");
 }
}
