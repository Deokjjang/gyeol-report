import { isRecord } from "../normalization";
import { recordHash } from "../sourceReader";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { Material, Concept, Crosswalk, PersonLens, DirectionStudy, RepairStudy, LifeContext, ExternalSource, SourceGroup, Chapter, Role, TenGodStudy } from "../../../../../tools/compatibility-friendship-specialist-engine/researchTypes";
export type { Material };
export function readFriendshipResearch(catalog: KnowledgeBinderCatalog) {
  const records = catalog.input.records.filter(r => r.originalId.startsWith("frpr:")).map(record => {
    const raw = catalog.raw.get(record.catalogKey);
    if (!isRecord(raw) || raw.id !== record.originalId || raw.relationshipType !== "friendship" || catalog.sourceChecks.get(record.catalogKey)?.state !== "PASS" || recordHash(raw) !== record.locator.recordSha256) throw Error("ORIGINAL_FRIENDSHIP_RECORD_REQUIRED");
    return { record, raw };
  });
  const by = <T,>(prefix: string) => records.filter(r => r.record.originalId.startsWith("frpr:" + prefix + ":")).map(r => r.raw as unknown as T);
  const result = { records, materials: by<Material>("material"), concepts: by<Concept>("concept"), repairs: by<RepairStudy>("repair"), life: by<LifeContext>("life"), lenses: by<PersonLens>("person"), directions: by<DirectionStudy>("direction"), traits: by<Crosswalk>("trait"), pairs: by<Crosswalk>("pair"), fusion: by<Crosswalk>("fusion"), facets: by<Crosswalk>("facet"), canonical: by<Crosswalk>("canonical"), sources: by<ExternalSource>("source"), inventory: by<SourceGroup>("inventory"), chapters: by<Chapter>("chapter"), roles: by<Role>("role"), gods: by<TenGodStudy>("ten-god") };
  if (records.length !== 2138 || result.materials.length !== 36) throw Error("ORIGINAL_FRIENDSHIP_INVENTORY_CHANGED");
  return result;
}
export type FriendshipResearch = ReturnType<typeof readFriendshipResearch>;
