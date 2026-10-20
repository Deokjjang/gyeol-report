import { canonicalJson } from "../sourceReader";
export type ParentChildMeaningIdentity = { owner: string; direction: string | null; context: string; responsibility: string; application: string; roots: readonly string[]; meaningId: string | null; claimId: string | null; reviewed: boolean; recall: boolean; actuallyDisplayed: boolean };
export function classifyParentChildMeaning(a: ParentChildMeaningIdentity, b: ParentChildMeaningIdentity) {
  if (a.owner !== b.owner) return "DIFFERENT_PERSON_OWNER";
  if (a.direction !== b.direction) return "DIFFERENT_DIRECTION";
  if (a.context !== b.context) return "DIFFERENT_DEVELOPMENTAL_CONTEXT";
  if (a.responsibility !== b.responsibility) return "DIFFERENT_RESPONSIBILITY";
  if (!a.reviewed || !b.reviewed) return "REVIEW_REQUIRED";
  const sameRoots = a.roots.length > 0 && canonicalJson([...a.roots].sort()) === canonicalJson([...b.roots].sort());
  if (sameRoots && a.meaningId && a.meaningId === b.meaningId && a.claimId && a.claimId === b.claimId && b.recall && b.actuallyDisplayed) return "VALID_RECALL";
  if (a.claimId && a.claimId === b.claimId) return "SAME_CLAIM";
  if (a.meaningId && a.meaningId === b.meaningId) return "SAME_MEANING";
  if (a.application !== b.application) return "DIFFERENT_APPLICATION";
  return sameRoots ? "SAME_FACT" : "REVIEW_REQUIRED";
}
