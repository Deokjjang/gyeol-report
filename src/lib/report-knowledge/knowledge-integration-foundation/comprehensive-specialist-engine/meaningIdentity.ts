import { classifyMeaningReuse } from "../semantic-domain-verification/rules";
import type { MeaningView, MeaningRelationship } from "./types";
export function resolveMeaningRelationship(a: MeaningView, b: MeaningView): MeaningRelationship {
    const roots = a.roots.length > 0 && a.roots.length === b.roots.length && a.roots.every(r => b.roots.includes(r));
    // A source/reference/facet label is not an approved meaning identity. Even
    // different identity strings require reviewed semantics before independence.
    if (!a.reviewed || !b.reviewed)
        return { left: a.id, right: b.id, relation: roots ? "SAME_FACT" : "MEANING_RELATION_REVIEW_REQUIRED", sameUnderlyingRoots: roots, independentInformation: null, reasons: ["ORIGINAL_MEANING_AND_APPLICATION_REVIEW_REQUIRED", ...(roots ? ["SAME_FACT_IS_NOT_SAME_CLAIM"] : [])] };
    const r = classifyMeaningReuse({ sourceRootKeys: a.roots, priorRootKeys: b.roots, sourceClaimId: a.claimId, targetClaimId: b.claimId, sourceMeaningId: a.meaningId, targetMeaningId: b.meaningId, priorQuestion: b.question, targetQuestion: a.question, priorConditions: b.conditions, targetConditions: a.conditions, priorAction: b.action, targetAction: a.action, recallRequested: a.recall, actuallyDisplayed: a.actuallyDisplayed });
    return { left: a.id, right: b.id, relation: r.relation === "INSUFFICIENT_VERIFICATION" ? "MEANING_RELATION_REVIEW_REQUIRED" : r.relation, sameUnderlyingRoots: roots, independentInformation: r.relation === "DIFFERENT_MEANING" || r.relation === "NEW_APPLICATION" ? true : r.relation === "INSUFFICIENT_VERIFICATION" ? null : false, reasons: r.relation === "INSUFFICIENT_VERIFICATION" ? ["MEANING_RELATION_REVIEW_REQUIRED"] : [] };
}
