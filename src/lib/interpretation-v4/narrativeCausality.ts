import type { EditorialCandidate } from "./comprehensivePlanCore";
import type { EvidenceAtom, SemanticAxis } from "./semanticCore";

export type CausalRelation = "SUPPORTS" | "EXPLAINS" | "AMPLIFIES" | "CONTRASTS" | "APPLIES_TO" | "LEADS_TO_SHADOW" | "GUIDES_ACTION";
export type CausalLink = { relation: CausalRelation; claimId: string; evidenceId: string; axes: SemanticAxis[] };
/** A root merely carrying many axes is not permission to expose all its meanings. */
export function causalAxes(c: EditorialCandidate, atom: EvidenceAtom): SemanticAxis[] {
  const charm = /^A\d/.test(c.sourceId);
  const allowed: readonly SemanticAxis[] = charm ? ["EXPRESSION", "CHARISMA", "SOCIAL_ATTUNEMENT", "CARE", "RELATION_STYLE"] : c.primaryAxes;
  return allowed.filter(a => (atom.axes[a] ?? 0) !== 0);
}
export function reasonLink(c: EditorialCandidate, atom: EvidenceAtom): CausalLink | undefined {
  const axes = causalAxes(c, atom);
  if (!axes.length) return undefined;
  return { relation: c.factBomb ? "LEADS_TO_SHADOW" : "EXPLAINS", claimId: c.id, evidenceId: atom.id, axes };
}
