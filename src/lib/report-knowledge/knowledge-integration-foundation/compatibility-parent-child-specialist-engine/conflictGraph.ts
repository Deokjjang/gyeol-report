export type ConflictCandidate = { mode: string; roleVersion: string; developmentalContexts: readonly string[]; informationRoots: readonly string[]; meaningIdentity: string | null; claimIdentity: string | null; reviewed: boolean; reasons: readonly string[] };
export function parentChildConflictRelations(a: ConflictCandidate, b: ConflictCandidate) {
  const structural = new Set<string>(), review = new Set<string>();
  if (a.informationRoots.some(r => b.informationRoots.includes(r))) structural.add("SAME_UNDERLYING_FACT");
  if (a.mode !== b.mode) structural.add([a.mode, b.mode].some(m => ["AB", "BA"].includes(m)) ? "DIFFERENT_DIRECTION" : "DIFFERENT_OWNER");
  if (a.roleVersion !== b.roleVersion) structural.add("ROLE_DECLARATION_CHANGED");
  if (a.roleVersion !== "compatibility-fixed-ab-v1" || b.roleVersion !== "compatibility-fixed-ab-v1") structural.add("WRONG_ROLE_VERSION");
  const mappings: Record<string, string> = { PARENTS_SOURCE_WRONG_OWNER: "PARENTS_SOURCE_WRONG_OWNER", CHILDREN_SOURCE_WRONG_OWNER: "CHILDREN_SOURCE_WRONG_OWNER", SCORING_PROJECTION_NOT_SUPPORTED: "NON_SCORING_SOURCE_PROMOTED", CHILD_REPAIR_BURDEN_FORBIDDEN: "CHILD_REPAIR_BURDEN_FORBIDDEN", ADULT_AUTONOMY_REQUIRED: "ADULT_AUTONOMY_REQUIRED", UNSAFE_REPAIR_OR_CONTACT_BLOCKED: "UNSAFE_REPAIR", PARENT_CHILD_REQUIRED_ANCESTOR_DOMAIN_NOT_ALLOWED: "DISALLOWED_DOMAIN", UNSUPPORTED_PRODUCER: "UNSUPPORTED_RELATION", INCOMPLETE_REQUIRED_ANCESTRY: "INCOMPLETE_ANCESTRY", ACTUALLY_DISPLAYED_COMPATIBLE_MEANING_REQUIRED: "RECALL_REQUIRES_INTRODUCTION" };
  // A withheld application is a restriction, not a claim that an unsafe act occurred.
  for (const reason of [...a.reasons, ...b.reasons]) if (mappings[reason]) review.add(mappings[reason]);
  if (a.reviewed && b.reviewed && (a.meaningIdentity && a.meaningIdentity === b.meaningIdentity || a.claimIdentity && a.claimIdentity === b.claimIdentity)) structural.add("SAME_MEANING");
  if (!a.reviewed || !b.reviewed) review.add("MEANING_REVIEW_REQUIRED");
  if ([...a.reasons, ...b.reasons].includes("DEVELOPMENTAL_STAGE_UNVERIFIED")) review.add("DEVELOPMENTAL_STAGE_UNVERIFIED");
  return { structural: [...structural].sort(), restrictions: [...review].sort(), differentDevelopmentalResearchContext: a.developmentalContexts.join("|") !== b.developmentalContexts.join("|"), responsibility: "PARENT_CHILD_RESPONSIBILITY_ASYMMETRY", confirmedMeaningConflict: structural.has("SAME_MEANING") };
}
