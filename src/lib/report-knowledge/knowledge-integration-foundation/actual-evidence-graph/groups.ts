import type { GroupReview } from "../source-verification/types";
import type { ActualEvidenceNode } from "./types";
/** Validates declared group use only; it never selects research interpretations. */
export function verifyActualSourceGroup(original: GroupReview, groupIndex: number, actualSources: ReadonlyMap<string, ActualEvidenceNode>, ownerId: string, actuallyDisplayedCompatibleGroup: boolean, mergedAlternatives = false) {
  const group = original.groups[groupIndex], reasons: string[] = [];
  if (!group || group.status === "WITHHELD" || original.semantics === "UNKNOWN_GROUP_SEMANTICS") reasons.push("INCOMPATIBLE_SOURCE_GROUP");
  if (mergedAlternatives) reasons.push("INCOMPATIBLE_SOURCE_GROUP");
  if (original.semantics === "AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS" && !actuallyDisplayedCompatibleGroup) reasons.push("ACTUALLY_DISPLAYED_COMPATIBLE_GROUP_REQUIRED");
  if (group?.conflictingOwnerTypeDeclarations) reasons.push("WRONG_OWNER");
  for (const key of group?.requiredSources ?? []) {
    const actual = actualSources.get(key);
    if (!actual || !actual.ancestry.complete) reasons.push("SOURCE_REFERENCE_UNRESOLVED");
    else if (actual.owner.fixtureOwnerId !== ownerId) reasons.push("WRONG_OWNER");
    else if (actual.blockers.some(b => b.code === "DISALLOWED_ANCESTOR_DOMAIN")) reasons.push("DISALLOWED_ANCESTOR_DOMAIN");
  }
  return { sourcesVerified: !reasons.length, reasons: [...new Set(reasons)], originalGroup: group?.originalGroup ?? null, alternativesMerged: false, customerApproved: false, bindingAllowed: false };
}
