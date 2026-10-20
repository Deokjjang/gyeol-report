import type { ComprehensiveSpecialistIndex } from "./candidateIndex";
import type { MaterialDiagnostic, MeaningRelationship, ConflictEdge, MeaningView } from "./types";
import { resolveMeaningRelationship } from "./meaningIdentity";
export function materialConflictGraph(index: ComprehensiveSpecialistIndex, diagnostics: readonly MaterialDiagnostic[]) {
    const byId = new Map<string, MaterialDiagnostic>(diagnostics.map(d => [d.catalogKey, d])), buckets = new Map<string, string[]>(), pairs = new Set<string>();
    const add = (key: string, id: string) => buckets.set(key, [...(buckets.get(key) ?? []), id]);
    for (const d of diagnostics) {
        const c = index.candidates.get(d.catalogKey)!;
        for (const r of d.roots)
            add("root:" + r, d.catalogKey);
        for (const f of c.facets) {
            add("facet:" + f.id, d.catalogKey);
            add("axis:" + f.axis, d.catalogKey);
        }
        if (c.meaning.originalMeaningId)
            add("meaning:" + c.meaning.originalMeaningId, d.catalogKey);
        for (const prior of c.precedingMeaningRefs) {
            const target = index.byMaterial.get(prior);
            if (target)
                pairs.add(JSON.stringify([d.catalogKey, target].sort()));
        }
    }
    for (const ids of buckets.values()) {
        const unique = [...new Set(ids)].sort();
        for (let i = 0; i < unique.length; i++)
            for (const right of unique.slice(i + 1))
                pairs.add(JSON.stringify([unique[i], right]));
    }
    const relations: MeaningRelationship[] = [], edges: ConflictEdge[] = [];
    const view = (d: MaterialDiagnostic): MeaningView => { const c = index.candidates.get(d.catalogKey)!; return { id: d.catalogKey, roots: d.roots, meaningId: c.meaning.originalMeaningId, claimId: c.meaning.originalClaimId, question: c.material.readerQuestion, conditions: [...c.material.prerequisites], action: c.material.application, context: c.context, reviewed: false, recall: c.material.kind === "recall", actuallyDisplayed: false }; };
    for (const pair of [...pairs].sort()) {
        const [left, right] = JSON.parse(pair) as [
            string,
            string
        ], a = byId.get(left)!, b = byId.get(right)!, ca = index.candidates.get(left)!, cb = index.candidates.get(right)!;
        relations.push(resolveMeaningRelationship(view(a), view(b)));
        const shared = a.roots.filter(r => b.roots.includes(r));
        const put = (kind: ConflictEdge["kind"], state: ConflictEdge["state"], reason: string) => edges.push({ left, right, kind, state, blocksJointPrimary: false, reasons: [reason] });
        if (shared.length) {
            put("SAME_UNDERLYING_FACT", "VERIFIED", "EXACT_EXISTING_CANONICAL_ROOT_INTERSECTION");
            if (ca.material.address !== cb.material.address)
                put("SOURCE_REUSE_WITH_DIFFERENT_QUESTION", "REVIEW_REQUIRED", "DIFFERENT_QUESTION_DOES_NOT_PROVE_NEW_MEANING");
        }
        if (ca.precedingMeaningRefs.includes(cb.material.id) || cb.precedingMeaningRefs.includes(ca.material.id))
            put("REQUIRES_PRIOR_INTRODUCTION", "VERIFIED", "DECLARED_REFERENCE_IS_NOT_ACTUAL_DISPLAY");
        if (ca.material.meaningClass === "contextual_application" && cb.material.meaningClass === "contextual_application" && ca.context.some(c => !cb.context.includes(c)))
            put("DIFFERENT_APPLICATION", "REVIEW_REQUIRED", "ORIGINAL_APPLICATION_CONDITIONS_NOT_MACHINE_VERIFIED");
        if (a.semanticSignals.some(x => x.kind === "SIGNED_BIPOLAR" && b.semanticSignals.some(y => x.axis === y.axis && x.value * y.value < 0)))
            put("CONDITIONAL_TENSION", "REVIEW_REQUIRED", "ACTUAL_OPPOSITE_SIGNALS_REQUIRE_CONTEXT_AND_ORIGINAL_SPLIT");
    }
    const duplicateFactGroups = [...buckets].filter(([k, ids]) => k.startsWith("root:") && new Set(ids).size > 1).map(([k, ids]) => ({ root: k.slice(5), materialIds: [...new Set(ids)].sort() }));
    return { relations, edges, duplicateFactGroups };
}
/** Reviewed synthetic contracts only. Shared roots/axes alone never prove a
 * meaning equivalence or a resolved conditional split. */
export function syntheticConflictGraph(options: readonly import("./types").SyntheticOption[]): ConflictEdge[] {
    const edges: ConflictEdge[] = [];
    for (let i = 0; i < options.length; i++)
        for (const b of options.slice(i + 1)) {
            const a = options[i], ma = a.meaning, mb = b.meaning, shared = a.roots.some(r => b.roots.includes(r));
            const put = (kind: ConflictEdge["kind"], state: ConflictEdge["state"], blocksJointPrimary: boolean, reason: string) => edges.push({ left: a.id, right: b.id, kind, state, blocksJointPrimary, reasons: [reason] });
            if (shared)
                put("SAME_UNDERLYING_FACT", "VERIFIED", false, "EXACT_SYNTHETIC_REGISTERED_ROOT_INTERSECTION");
            const view = (o: typeof a): MeaningView => ({ id: o.id, roots: o.roots, meaningId: o.meaning.meaningId, claimId: o.meaning.claimId, question: o.questionId, conditions: o.meaning.conditions, action: o.meaning.action, context: [o.meaning.context], reviewed: true, recall: !!o.meaning.recallOf, actuallyDisplayed: o.eligible && !!o.meaning.recallOf });
            const relation = resolveMeaningRelationship(view(a), view(b));
            if (!ma.recallOf && !mb.recallOf && ma.claimId === mb.claimId)
                put("SAME_MEANING", "VERIFIED", true, "SAME_CLAIM_PRIMARY_REUSE");
            else if (!ma.recallOf && !mb.recallOf && ma.meaningId === mb.meaningId && relation.relation !== "NEW_APPLICATION")
                put("SAME_MEANING", "VERIFIED", true, "SAME_MEANING_WITHOUT_NEW_APPLICATION");
            if (relation.relation === "NEW_APPLICATION")
                put("DIFFERENT_APPLICATION", "VERIFIED", false, "EXPLICIT_REVIEWED_DIFFERENT_QUESTION_CONDITION_ACTION");
            if (shared && a.questionId !== b.questionId)
                put("SOURCE_REUSE_WITH_DIFFERENT_QUESTION", "VERIFIED", false, "QUESTION_DIFFERENCE_REMAINS_SUBJECT_TO_ROOT_BUDGET");
            if (ma.recallOf === b.id || mb.recallOf === a.id)
                put("REQUIRES_PRIOR_INTRODUCTION", "VERIFIED", !a.eligible || !b.eligible, "PLANNED_SELECTION_IS_NOT_ACTUAL_DISPLAY");
            if (ma.exclusiveWith.includes(b.id) || mb.exclusiveWith.includes(a.id))
                put("MUTUALLY_EXCLUSIVE", "VERIFIED", true, "EXPLICIT_SYNTHETIC_EXCLUSION");
            if (ma.verifiedComplementWith.includes(b.id) || mb.verifiedComplementWith.includes(a.id))
                put("CONDITIONAL_COMPLEMENT", "VERIFIED", false, "EXPLICIT_REVIEWED_SYNTHETIC_COMPLEMENT");
            if (ma.axis && mb.axis && ma.axis.id === mb.axis.id && ma.axis.direction !== mb.axis.direction) {
                const split = ma.verifiedSplitWith.includes(b.id) || mb.verifiedSplitWith.includes(a.id), different = ma.context !== mb.context;
                put("CONDITIONAL_TENSION", split || different ? "VERIFIED" : "REVIEW_REQUIRED", !split && !different, "OPPOSITE_SIGNALS_REQUIRE_ACTUAL_CONTEXT_OR_REVIEWED_SPLIT");
            }
        }
    return edges.sort((a, b) => JSON.stringify([a.left, a.right, a.kind]).localeCompare(JSON.stringify([b.left, b.right, b.kind]), "en"));
}
