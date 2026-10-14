import { canonicalJson, hash } from "../sourceReader";
import { evidenceHash } from "../actual-evidence-graph/graph";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledge, bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, NormalizedSourceRequirement } from "../knowledge-binder/types";
import { ProductQuestionRegistry } from "./questionRegistry";
import { ProductQuestionIndex } from "./questionIndex";
import { connectQuestionMaterials } from "./questionMatcher";
import { normalizeSpecialistRequirement } from "./requirementNormalizer";
import { annualMonthContracts, annualRoleSelector, evaluateTypedSelector } from "./annualSelector";
import { majorPeriodSelection } from "./majorSelector";
import { questionCoverage } from "./coverage";
import { SPECIALIST_FOUNDATION_VERSION, type CandidateWithOverlay, type SpecialistFoundationResult, type TypedSelectorContract, type TemporalSelectorWitness, type PeriodBindingAttempt } from "./types";
export class ProductSpecialistFoundation {
    readonly overlays = new Map<string, CandidateWithOverlay>();
    readonly questions: ProductQuestionIndex;
    constructor(readonly catalog: KnowledgeBinderCatalog, readonly registry: ProductQuestionRegistry) { this.questions = connectQuestionMaterials(new ProductQuestionIndex(registry.questions), catalog); for (const c of catalog.candidates.values())
        if (c.classification === "INTERPRETATION_CANDIDATE")
            this.overlays.set(c.record.catalogKey, normalizeSpecialistRequirement(c, catalog)); }
    static async prepare(catalog: KnowledgeBinderCatalog) { return new ProductSpecialistFoundation(catalog, await new ProductQuestionRegistry(catalog).compile()); }
    run(request: KnowledgeBindingRequest, baseline?: KnowledgeBindingReceipt[]): SpecialistFoundationResult {
        const selected = this.catalog.search(request.product, request.relationship), original = evidenceHash([request.graph, request.graphInput.evidence]), catalogBefore = hash(canonicalJson(selected.map(c => c.requirement))), index = new ActualBindingIndex(request, this.catalog);
        const before = baseline ?? bindKnowledge(request, this.catalog).receipts, after = selected.map(c => bindKnowledgeCandidate(this.overlays.get(c.record.catalogKey)?.candidate ?? c, index, this.catalog));
        const annualMonths = annualMonthContracts(request, index, this.questions), temporalDiagnostics: TemporalSelectorWitness[] = [], periodAttempts: PeriodBindingAttempt[] = [];
        for (const month of annualMonths) {
            const periodCandidates = selected.filter(c => this.catalog.raw.get(c.record.catalogKey)?.month === month.civilMonth && this.catalog.raw.get(c.record.catalogKey)?.scope === "civil_month");
            for (const segment of month.segments) {
                const scopedRequest = { ...request, requiredWindow: segment.window, restrictEvidenceTo: [segment.boundaryNodeId!, ...Object.values(segment.componentNodeIds).filter((id): id is string => typeof id === "string")] }, scopedIndex = new ActualBindingIndex(scopedRequest, this.catalog);
                for (const c of periodCandidates) {
                    const overlay = this.overlays.get(c.record.catalogKey)!, candidate = structuredClone(overlay.candidate), witnesses: TemporalSelectorWitness[] = [];
                    for (const role of ["MONTH_PILLAR", "EFFECTIVE_ANNUAL", "BOUNDARY"] as const) {
                        const selector = annualRoleSelector(role, undefined, segment)!;
                        const n = scopedIndex.graph.nodes.get(role === "BOUNDARY" ? segment.boundaryNodeId! : segment.componentNodeIds[role === "MONTH_PILLAR" ? "month" : "annual"]!)!;
                        selector.producer = n.producer;
                        const contract: TypedSelectorContract = { id: `${c.record.catalogKey}#/month/${month.civilMonth}/segment/${segment.segmentIndex}/${role}`, kind: role === "BOUNDARY" ? "TEMPORAL_BOUNDARY_SELECTOR" : "MONTH_SEGMENT_SELECTOR", catalogKey: c.record.catalogKey, originalRequirement: { scope: "civil_month", month: month.civilMonth }, originalContractLocator: c.record.locator, originalContractHash: c.record.locator.recordSha256 ?? "UNKNOWN", role, selector, requiredWindow: segment.window, state: "EXACT_TYPED_CONTRACT", proposalOnly: false, originalMeaningUnchanged: true };
                        const spec: NormalizedSourceRequirement = { id: contract.id, originalField: "/month", originalDeclaration: contract.originalRequirement, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] };
                        candidate.requirement.sourceRequirements.push(spec);
                        witnesses.push(evaluateTypedSelector(contract, scopedIndex));
                    }
                    candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
                    candidate.requirement.requiredTemporalScope = "month";
                    const receipt = bindKnowledgeCandidate(candidate, scopedIndex, this.catalog);
                    if (receipt.customerApproved)
                        throw Error("CUSTOMER_APPROVAL_MUST_REMAIN_ZERO");
                    periodAttempts.push({ catalogKey: c.record.catalogKey, questionIds: month.questionIds, periodId: `${month.selectedYear}:${month.civilMonth}:${segment.segmentIndex}`, purpose: "EXACT_DECLARED_PERIOD", bindingUsesVerifiedRole: true, receipt, selectorWitnesses: witnesses, customerUseAllowed: false });
                }
            }
        }
        // Role alternatives expose real observations without promoting an ambiguous
        // research declaration into an active Binder requirement or choosing one.
        for (const c of selected) {
            const raw = this.catalog.raw.get(c.record.catalogKey);
            if (raw?.scope !== "monthly_segment" || typeof raw.god !== "string")
                continue;
            for (const role of ["MONTH_STEM", "MONTH_BRANCH_MAIN"] as const) {
                const selector = annualRoleSelector(role, raw.god)!;
                const contract: TypedSelectorContract = { id: `${c.record.catalogKey}#/ambiguous-role/${role}`, kind: "MONTH_SEGMENT_SELECTOR", catalogKey: c.record.catalogKey, originalRequirement: { god: raw.god, scope: raw.scope, monthlyGate: raw.monthlyGate }, originalContractLocator: c.record.locator, originalContractHash: c.record.locator.recordSha256 ?? "UNKNOWN", role, selector, requiredWindow: null, state: "CONTRACT_NOT_MACHINE_CHECKABLE", proposalOnly: true, originalMeaningUnchanged: true };
                const witness = evaluateTypedSelector(contract, index);
                witness.ambiguity = "AMBIGUOUS_MONTHLY_GOD_ROLE";
                witness.reasons = [...new Set([...witness.reasons, "AMBIGUOUS_MONTHLY_GOD_ROLE"])];
                temporalDiagnostics.push(witness);
            }
        }
        const graphUnchanged = original === evidenceHash([request.graph, request.graphInput.evidence]), catalogUnchanged = catalogBefore === hash(canonicalJson(selected.map(c => c.requirement))), errors = [...index.errors, ...(!graphUnchanged ? ["ORIGINAL_GRAPH_OR_EVIDENCE_CHANGED"] : []), ...(!catalogUnchanged ? ["ORIGINAL_CATALOG_REQUIREMENTS_CHANGED"] : []), ...(after.some(r => r.customerApproved) ? ["CUSTOMER_APPROVAL_MUST_REMAIN_ZERO"] : [])];
        return { version: SPECIALIST_FOUNDATION_VERSION, fixtureId: request.graph.context.fixtureId, before, after, annualMonths, temporalDiagnostics, periodAttempts, majorSelection: majorPeriodSelection(request, index), questionCoverage: questionCoverage(this.questions, request, after, periodAttempts), errors, graphUnchanged, catalogUnchanged, customerEligible: 0, customerClaimsEmitted: 0, rankingEnabled: false, bookChanges: 0 };
    }
}
