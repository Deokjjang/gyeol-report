import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import { readFriendshipResearch } from "./researchCatalog";
export class FriendshipCandidateIndex {
  readonly research; readonly candidates; readonly questions;
  readonly materials; readonly indexes = new Map<string, Map<string, Set<string>>>();
  constructor(readonly foundation: ProductSpecialistFoundation) {
    this.research = readFriendshipResearch(foundation.catalog);
    this.candidates = foundation.catalog.search("saju_mbti_compatibility", "friendship");
    this.questions = foundation.registry.questions.filter(q => q.productKey === "saju_mbti_compatibility" && q.relationshipCategory === "friendship");
    this.materials = this.research.materials.map(material => {
      const candidate = this.candidates.find(c => c.record.originalId === material.id);
      if (!candidate) throw Error("ORIGINAL_MATERIAL_CANDIDATE_REQUIRED");
      const overlay = foundation.overlays.get(candidate.record.catalogKey)!;
      return { material, candidate: overlay.candidate, links: foundation.questions.links.filter(l => l.catalogKey === candidate.record.catalogKey) };
    }).sort((a,b) => a.material.id.localeCompare(b.material.id,"en"));
    for (const { material: m, candidate: c, links } of this.materials) {
      for (const [field, values] of Object.entries({ OriginalResearchId: [m.id], CatalogKey: [c.record.catalogKey], ReaderAddress: [m.address], MaterialMode: [m.mode], QuestionId: links.map(l => l.questionId), ConceptId: m.conceptIds, SourceInventoryRef: m.ownedSources.map(s => s.sourceRef), Owner: m.binding.ownerRoots, Direction: [m.binding.direction ?? "NONE"], Facet: m.facetRefs, IntroducedGroup: m.binding.introducedGroups.map((_,i) => m.id + "#/binding/introducedGroups/" + i), ApprovalState: ["REVIEW_REQUIRED"] })) for (const value of values) this.add(field,value,c.record.catalogKey);
      for(const life of this.research.life.filter(l=>l.materialAddresses.includes(m.address)))this.add("LifeContext",life.key,c.record.catalogKey);
      for(const study of this.research.repairs.filter(r=>r.frictionAddress===m.address||r.repairAddresses.includes(m.address)))this.add("RepairStudy",study.id,c.record.catalogKey);
      for(const key of m.binding.actualContextRequired)this.add("ConsentRequirement",key,c.record.catalogKey);
      this.add("PrivacyRequirement","INFORMATION_OWNER_SCOPE_AND_PERMISSION_REQUIRED",c.record.catalogKey);
      this.add("ActualDisplay","NOT_ISSUED",c.record.catalogKey);
    }
    if (this.candidates.length !== 173 || this.questions.length !== 180 || this.materials.length !== 36) throw Error("ORIGINAL_FRIENDSHIP_COHORT_CHANGED");
  }
  add(field: string, value: string, key: string) { const index = this.indexes.get(field) ?? new Map<string,Set<string>>(); const keys = index.get(value) ?? new Set<string>(); keys.add(key); index.set(value,keys); this.indexes.set(field,index); }
  lookup(field: string, value: string) { return [...(this.indexes.get(field)?.get(value) ?? [])].sort(); }
}
