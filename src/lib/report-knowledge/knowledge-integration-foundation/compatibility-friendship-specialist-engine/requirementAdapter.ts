import type { KnowledgeCandidate } from "../knowledge-binder/types";
import type { Material } from "./researchCatalog";
export const REFERENCE_KINDS = ["SOURCE_INVENTORY_REFERENCE","DOCUMENTARY_EDITORIAL_REFERENCE","ACTUAL_REQUIRED_EVIDENCE","OPTIONAL_SUPPORTING_REFERENCE","UNSUPPORTED_COMPARISON","ACTUAL_CONTEXT_REQUIREMENT","DISPLAY_DEPENDENCY"] as const;
// Preserve the Foundation overlay and its unresolved requirements exactly.
// Inventory references cannot supply a claim-specific producer selector.
export function normalizeFriendshipRequirement(candidate: KnowledgeCandidate, material: Material) {
  return { original: material.binding, binder: structuredClone(candidate.requirement), policy: material.binding.sourceUsePolicy, sourceAndCreated: false, introducedGroupsAreSourceGroups: false,
    requirements: [
      ...material.ownedSources.map(s => ({ kind: s.sourceRef.startsWith("frpr:inventory:") ? "SOURCE_INVENTORY_REFERENCE" : "DOCUMENTARY_EDITORIAL_REFERENCE", original: s, state: s.sourceRef.startsWith("frpr:inventory:") ? "SOURCE_ROLE_NOT_MACHINE_CHECKABLE" : "DOCUMENTARY_ONLY", proposalOnly: true })),
      ...material.binding.actualContextRequired.map(key => ({ kind: "ACTUAL_CONTEXT_REQUIREMENT", original: key, state: "ACTUAL_USER_STATE_REQUIRED", proposalOnly: false })),
      ...material.binding.introducedGroups.map(group => ({ kind: "DISPLAY_DEPENDENCY", original: group, state: "ACTUAL_DISPLAY_REQUIRED", proposalOnly: false })),
      ...candidate.requirement.sourceRequirements.filter(s => s.selector).map(s => ({ kind: "ACTUAL_REQUIRED_EVIDENCE", original: s, state: "EXISTING_TYPED_CONTRACT", proposalOnly: false }))
    ] };
}
