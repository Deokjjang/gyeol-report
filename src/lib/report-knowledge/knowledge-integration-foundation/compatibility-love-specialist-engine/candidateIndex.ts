import { readOriginalPairResearch, type OriginalMaterial } from "./researchCatalog";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { BindingOwner, EvidenceSelector, KnowledgeCandidate, NormalizedSourceRequirement } from "../knowledge-binder/types";
import { resolveCareerReference } from "../career-specialist-engine/requirementAdapter";
import { canonicalJson } from "../sourceReader";
import { isRecord } from "../normalization";
import type { CatalogKey } from "../types";
type Identity = { sourceKind: string; sourceId: string; recordSha256: string; sourceFileSha256: string };
const resolve = resolveCareerReference as unknown as (ref: Identity, catalog: ProductSpecialistFoundation["catalog"]) => ReturnType<typeof resolveCareerReference>;
const ownerMap: Record<string, BindingOwner> = { A: "A", B: "B", SHARED: "PAIR", PAIR_AB: "A", PAIR_BA: "B", DIRECTION_AB: "A", DIRECTION_BA: "B" };
export function adaptPairMaterial(original: KnowledgeCandidate, material: OriginalMaterial, foundation: ProductSpecialistFoundation, research = readOriginalPairResearch(foundation.catalog)) {
  const catalog = foundation.catalog, candidate = structuredClone(original);

  const sources = material.ownedSources.map((source, i) => {
    const refs = research.sources.filter(r => r.key === source.sourceKey), ref = refs.length === 1 ? refs[0] : null;
    const resolved = ref ? resolve({ ...ref, sourceKind: ref.sourceKind === "individual_mbti" ? "mbti_trait" : ref.sourceKind }, catalog) : null;
    const record = resolved?.record, raw = record ? catalog.raw.get(record.catalogKey) : null;
    const owner = ownerMap[source.owner], verified = !!record && resolved?.verified === true;
    let selector: EvidenceSelector | null = null;
    if (verified && record && ref) {
      const loc = record.locator, locator = { catalogKey: record.catalogKey, file: loc.file, pointer: loc.pointer, fileSha256: ref.sourceFileSha256 };
      if (source.sourceUse === "individual_trait_condition" && ["A", "B"].includes(source.owner)) selector = { kinds: ["MBTI_SOURCE_NODE"], owner, source: locator, fields: [{ path: "value.classification", equals: "SCORING_SEMANTIC" }], requiresScoring: true };
      if (source.sourceUse === "pair_reference" && ["PAIR_AB", "PAIR_BA"].includes(source.owner)) selector = { kinds: ["SOURCE_DECLARATION"], owner, referenceDirection: source.owner === "PAIR_AB" ? "A_TO_B" : "B_TO_A", source: locator, fields: [{ path: "value.classification", equals: "REFERENCE_ONLY" }] };
      const relation = research.relations.find(r => r.sourceId === ref.sourceId);
      if (source.sourceUse === "canonical_membership_condition" && source.owner === "SHARED" && relation?.crossSupport === "membership_only_actual_refs_required" && relation.actualCrossProducerKind) selector = { kinds: ["CANONICAL_PAIR_FACT"], owner: "PAIR", fields: [{ path: "value.kind", equals: relation.actualCrossProducerKind }, { path: "value.actualCrossPersonDetection", equals: true }], memberValues: [...relation.members] };
      if (["individual_definition_condition", "recipient_direction_definition"].includes(source.sourceUse) && isRecord(raw) && typeof raw.targetId === "string") {
        const targets = catalog.originalIds.get(raw.targetId) ?? [], target = targets.length === 1 ? targets[0] : null, definition = target ? catalog.raw.get(target.catalogKey) : null;
        const gods = catalog.reader.typeLiterals("src/lib/saju/types.ts", "TenGod");
        if (target && catalog.sourceChecks.get(target.catalogKey)?.state === "PASS" && catalog.sourceAncestors(record.catalogKey).includes(target.catalogKey) && isRecord(definition) && definition.category === "ten_god" && isRecord(definition.support) && definition.support.calculation === "native") {
          const aliases = [...new Set([definition.labelKo, ...(Array.isArray(definition.aliases) ? definition.aliases : [])].filter((x): x is string => typeof x === "string" && gods.includes(x)))];
          if (aliases.length === 1) selector = source.sourceUse === "recipient_direction_definition" ? { kinds: ["DIRECTIONAL_RELATION_FACT"], owner, direction: source.owner === "DIRECTION_AB" ? "A_TO_B" : "B_TO_A", fields: [{ path: "value.god", equals: aliases[0] }] } : { kinds: ["CALCULATED_NATAL_FACT"], owner, fields: [{ path: "value.god", equals: aliases[0] }] };
          // Direction's native schema nests TenGod; exact matching is checked
          // separately below, not an unsupported dotted-field predicate.
          if (selector?.direction) selector.fields = [];
        }
      }
      if (source.sourceUse === "individual_fusion_condition" && isRecord(raw) && typeof raw.existingRuleId === "string") selector = { kinds: ["FUSION_DERIVATION"], owner, fields: [{ path: "value.ruleId", equals: raw.existingRuleId }], requiresFusionRoots: true, allowedContexts: Array.isArray(raw.contexts) ? raw.contexts.filter((x): x is string => typeof x === "string") : [] };
    }
    // Observation only: preserve original group semantics, do not invent an AND group.
    const spec: NormalizedSourceRequirement | null = selector ? { id: material.id + ":native-witness:" + i, originalField: "/ownedSources/" + i, originalDeclaration: { source, sourceLocator: record?.locator, sourceHash: ref?.recordSha256, existenceOnly: true }, sourceKey: null, sourceCatalogKeys: [], owner, use: "ACTUAL_FACT", selector, required: false, gaps: [] } : null;
    if (spec) candidate.requirement.sourceRequirements.push(spec);
    return { source, registry: ref, originalLocator: record?.locator ?? null, originalRaw: raw, verified, spec, conditionsRemainUnresolved: true };
  });
  if (canonicalJson({ ...candidate.requirement, sourceRequirements: original.requirement.sourceRequirements }) !== canonicalJson(original.requirement) || canonicalJson(candidate.requirement.sourceRequirements.slice(0, original.requirement.sourceRequirements.length)) !== canonicalJson(original.requirement.sourceRequirements)) throw Error("ORIGINAL_PAIR_REQUIREMENTS_RELAXED");
  return { candidate, sources };
}
export class CompatibilityLoveIndex {
  readonly candidates;
  readonly research;
  readonly materials = new Map<CatalogKey, { material: OriginalMaterial; candidate: KnowledgeCandidate; sources: ReturnType<typeof adaptPairMaterial>["sources"]; links: ProductSpecialistFoundation["questions"]["links"] }>();
  readonly questions;
  constructor(readonly foundation: ProductSpecialistFoundation) {
    this.research = readOriginalPairResearch(foundation.catalog);
    this.candidates = foundation.catalog.search("saju_mbti_compatibility", "love");
    this.questions = foundation.registry.questions.filter(q => q.productKey === "saju_mbti_compatibility" && q.relationshipCategory === "love");
    for (const c of this.candidates) {
      if (!c.record.originalId.startsWith("clr:material:") || !/\/chapter\d+Materials\.ts$/.test(c.record.locator.file)) continue;
      const raw = foundation.catalog.raw.get(c.record.catalogKey);
      if (!isRecord(raw) || !Array.isArray(raw.ownedSources) || raw.relationshipCategory !== "love") throw Error("ORIGINAL_PAIR_MATERIAL_REQUIRED");
      const material = raw as unknown as OriginalMaterial;
      this.materials.set(c.record.catalogKey, { material, ...adaptPairMaterial(foundation.overlays.get(c.record.catalogKey)!.candidate, material, foundation, this.research), links: foundation.questions.links.filter(l => l.catalogKey === c.record.catalogKey) });
    }
    if (this.candidates.length !== 190 || this.materials.size !== 80 || this.questions.length !== 180) throw Error("ORIGINAL_LOVE_COHORT_CHANGED");
  }
}
