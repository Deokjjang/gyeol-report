import { adaptPairMaterial } from "../compatibility-love-specialist-engine/candidateIndex";
import type { OriginalMaterial } from "../compatibility-love-specialist-engine/researchCatalog";
import type { KnowledgeCandidate } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { MarriageMaterial, readMarriageResearch } from "./researchCatalog";
// Only native witness lookup is reused. This explicit adapter translates source
// use labels, never Marriage meaning, original declarations, groups or approval.
export const SOURCE_USE = {
 own_entered_type_only: "individual_trait_condition",
 directed_reference_only: "pair_reference",
 actual_canonical_membership_required: "canonical_membership_condition",
 both_same_person_roots_required: "individual_fusion_condition",
 recipient_direction_definition: "recipient_direction_definition",
 actual_natal_condition_required: "individual_definition_condition",
 context_guidance_not_person_fact: "documentary_guidance",
 unsupported_comparison_only: "unsupported_comparison_only",
} as const;
export function adaptMarriageMaterial(original: KnowledgeCandidate, material: MarriageMaterial, foundation: ProductSpecialistFoundation, research: ReturnType<typeof readMarriageResearch>) {
 if (material.requirements.sourceUsesAreConjunctive !== true) throw Error("ORIGINAL_SOURCE_CONJUNCTION_REQUIRED");
 const view: OriginalMaterial = {...material, ownedSources: material.ownedSources.map(s => {
  if (!(s.sourceUse in SOURCE_USE)) throw Error("UNKNOWN_ORIGINAL_SOURCE_USE");
  return {...s, sourceUse: SOURCE_USE[s.sourceUse as keyof typeof SOURCE_USE]};
 })};
 const adapted = adaptPairMaterial(original, view, foundation, research);
 const sources = adapted.sources.map((s,i) => {
  const source = material.ownedSources[i];
  if (s.spec) s.spec.originalDeclaration = {source, sourceLocator:s.originalLocator, sourceHash:s.registry?.recordSha256, existenceOnly:true};
  return {...s,source, factRequired: !["context_guidance_not_person_fact","unsupported_comparison_only","directed_reference_only"].includes(source.sourceUse), documentaryOnly:source.sourceUse === "context_guidance_not_person_fact", unsupported:source.sourceUse === "unsupported_comparison_only"};
 });
 return {...adapted,sources};
}
