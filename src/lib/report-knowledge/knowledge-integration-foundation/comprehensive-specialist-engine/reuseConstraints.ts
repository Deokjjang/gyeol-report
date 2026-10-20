import { syntheticConflictGraph } from "./conflictGraph";
import type { SyntheticIntroduction, SyntheticOption } from "./types";
export const REUSE_CONTRACT = Object.freeze({ sourceFile: "src/lib/interpretation-v4/comprehensiveReleaseSources.ts", selectSymbol: "selectReleaseSource", commitSymbol: "commitReleaseSource", runtimeRootPrimaryMax: 3, runtimeRootUnit: "ReleaseSource.atom.id", runtimeFacetMax: 5, runtimeFacetUnit: "RELEASE_FACETS key", facetContextMax: 1, explicitMbtiMax: 7, explicitMbtiSource: "src/lib/interpretation-v4/comprehensiveReleaseValidator.ts", canonicalRootToReleaseAtomBridge: "UNVERIFIED_NO_AUTOMATIC_EQUIVALENCE", researchSubfacetToReleaseFacetBridge: "UNVERIFIED_NO_INDEPENDENT_SUBFACET_BUDGET", recallDoesNotCreatePrimaryDefinition: true, existingScheduler: { sourceFile: "src/lib/interpretation-v4/comprehensiveEvidenceOwnership.ts", maxExactPrimaryExposures: 1, maxSupportExposures: "1 or 2 by original owner", themePrimaryCore: 2, themePrimaryOther: 1, themeSupport: 1, fusionExplicitTotal: 7, fusionExplicitByType: { REINFORCE: 3, TENSION: 2, COMPLEMENT: 3 } }, unitsAreNotInterchangeable: true, syntheticRootCap: 3, syntheticFacetCap: 5 });
export function checkSyntheticRecall(option: SyntheticOption, ledger: readonly SyntheticIntroduction[]): string[] {
    if (!option.meaning.recallOf)
        return [];
    const matching = ledger.filter(l => l.materialId === option.meaning.recallOf && l.actuallyDisplayed && l.displayRecord && l.owner === option.owner && l.mbtiType === option.mbtiType && l.meaningId === option.meaning.meaningId && l.claimId === option.meaning.claimId && (l.context === option.meaning.context || option.meaning.compatiblePriorContexts.includes(l.context)) && l.roots.length > 0 && l.roots.every(r => option.roots.includes(r)) && option.roots.every(r => l.roots.includes(r)) && l.nodeIds.length > 0 && l.nodeIds.every(id => option.receipt.selectedActualEvidence.includes(id)));
    return matching.length ? [] : ["ACTUAL_SAME_OWNER_TYPE_MEANING_ROOT_CONTEXT_DISPLAY_REQUIRED"];
}
export function selectionViolations(options: readonly SyntheticOption[], ledger: readonly SyntheticIntroduction[]): string[] {
    const errors: string[] = [], roots = new Map<string, number>(), facets = new Map<string, number>(), contexts = new Set<string>(), questions = new Set<string>();
    let explicitMbti = 0;
    for (const o of options) {
        if (!o.eligible)
            errors.push("INELIGIBLE:" + o.id);
        if (questions.has(o.questionId))
            errors.push("QUESTION_ASSIGNED_TWICE");
        questions.add(o.questionId);
        errors.push(...checkSyntheticRecall(o, ledger));
        if (o.meaning.exclusiveWith.some(id => options.some(r => r.id === id)))
            errors.push("MUTUALLY_EXCLUSIVE");
        if (o.meaning.recallOf)
            continue;
        for (const root of new Set(o.roots))
            roots.set(root, (roots.get(root) ?? 0) + 1);
        facets.set(o.meaning.facet, (facets.get(o.meaning.facet) ?? 0) + 1);
        const key = o.meaning.facet + ":" + o.meaning.context;
        if (contexts.has(key))
            errors.push("FACET_CONTEXT_REUSE");
        contexts.add(key);
        if (o.receipt.matches.some(m => m.matchedActualEvidence.some(n => n.sources.some(s => s.originalClassification === "SCORING_SEMANTIC"))))
            explicitMbti++;
    }
    if ([...roots.values()].some(n => n > REUSE_CONTRACT.syntheticRootCap))
        errors.push("ROOT_PRIMARY_BUDGET");
    if ([...facets.values()].some(n => n > REUSE_CONTRACT.syntheticFacetCap))
        errors.push("FACET_BUDGET");
    if (explicitMbti > REUSE_CONTRACT.explicitMbtiMax)
        errors.push("EXPLICIT_MBTI_BUDGET");
    for (const edge of syntheticConflictGraph(options))
        if (edge.blocksJointPrimary)
            errors.push(...edge.reasons);
    return [...new Set(errors)].sort();
}
