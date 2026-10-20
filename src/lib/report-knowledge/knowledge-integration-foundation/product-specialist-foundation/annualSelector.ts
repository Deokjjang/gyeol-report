import { canonicalJson, hash } from "../sourceReader";
import type { KnowledgeBindingRequest, EvidenceSelector } from "../knowledge-binder/types";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { ProductQuestionIndex } from "./questionIndex";
import type { AnnualMonthContract, TypedSelectorContract, TemporalSelectorWitness, AnnualSegmentContract } from "./types";
const components = ["month", "annual", "dayun", "ten_gods", "elements"] as const;
export function annualMonthContracts(request: KnowledgeBindingRequest, index: ActualBindingIndex, questions: ProductQuestionIndex): AnnualMonthContract[] {
    const composition = request.graphInput.evidence.composition;
    if (composition.product !== "annual_fortune")
        return [];
    const e = composition.result.evidence, raw = e.raw;
    if (raw.monthlyCalculationVersion !== "annual-month-jie-kst-v2" || raw.calendarMonths?.length !== 12)
        throw Error("ANNUAL_CANONICAL_LEDGER_REQUIRED");
    return raw.calendarMonths.map((month, mi) => {
        if (month.month !== mi + 1 || !month.segments.length)
            throw Error("ANNUAL_MONTH_ORDER_OR_SEGMENTS_MISSING");
        const segments: AnnualSegmentContract[] = month.segments.map((s, si) => {
            const pointer = `/composition/result/evidence/raw/calendarMonths/${mi}/segments/${si}`, boundary = (index.byPointer.get(pointer) ?? []).map(id => index.graph.nodes.get(id)!).find(n => n.kind === "TEMPORAL_BOUNDARY" && n.owner.fixtureOwnerId === request.graph.context.owners.person);
            if (!boundary || boundary.temporal?.start !== s.startKst || boundary.temporal.endExclusive !== s.endKstExclusive)
                throw Error("ORIGINAL_ANNUAL_SEGMENT_BOUNDARY_MISMATCH");
            const ids: AnnualSegmentContract["componentNodeIds"] = {};
            for (const [j, component] of components.entries()) {
                const nodes = (index.byPointer.get(`${pointer}/evidenceIds/${j}`) ?? []).map(id => index.graph.nodes.get(id)!), expected = component === "month" ? { component, monthPillar: s.monthPillar } : component === "annual" ? { component, effectiveAnnualPillar: s.effectiveAnnualPillar } : component === "dayun" ? { component, activeDayunContext: s.activeDayunContext } : component === "ten_gods" ? { component, stemTenGod: s.stemTenGod, branchTenGod: s.branchTenGod } : { component, elements: s.elements };
                const n = nodes.find(n => n.fact.producerEvidenceId === s.evidenceIds[j] && n.owner.fixtureOwnerId === request.graph.context.owners.person && n.temporal?.start === s.startKst && n.temporal.endExclusive === s.endKstExclusive && canonicalJson(n.value) === canonicalJson(expected));
                if (!n)
                    throw Error("ORIGINAL_ANNUAL_COMPONENT_OR_ROLE_MISMATCH:" + component);
                ids[component] = n.id;
            }
            return { month: month.month, segmentIndex: si, pointer, selectedYear: e.selectedYear, nominalAnnualGanji: raw.annualGanji, monthPillar: s.monthPillar, effectiveAnnualPillar: s.effectiveAnnualPillar, activeDayunContext: s.activeDayunContext, stemTenGod: s.stemTenGod, branchTenGod: s.branchTenGod, relationFacts: s.relationFacts, uncertainty: s.uncertainty, window: boundary.temporal!, boundaryNodeId: boundary.id, componentNodeIds: ids, focus: e.months[mi].focus.startKst === s.startKst, contractHash: hash(canonicalJson(s)) };
        });
        if (segments[0].window.start !== month.startKst || segments.at(-1)!.window.endExclusive !== month.endKstExclusive || segments.some((s, i) => i > 0 && s.window.start !== segments[i - 1].window.endExclusive))
            throw Error("ANNUAL_SEGMENT_LEDGER_GAP_OR_OVERLAP");
        return { selectedYear: e.selectedYear, civilMonth: month.month, calendarBounds: { start: month.startKst, endExclusive: month.endKstExclusive }, questionIds: [...questions.byId.values()].filter(q => q.productKey === "annual_fortune" && q.address.periodId === `month-${month.month}`).map(q => q.id), segments, allSegmentsRequired: true, monthlyCalculationVersion: raw.monthlyCalculationVersion!, unresolvedConditions: [] };
    });
}
export function annualRoleSelector(role: TypedSelectorContract["role"], god: string | undefined, segment?: AnnualSegmentContract): EvidenceSelector | null {
    const base: EvidenceSelector = { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", temporalScope: "month", fields: [] };
    if (role === "MONTH_STEM" || role === "MONTH_BRANCH_MAIN")
        return { ...base, observationPointer: segment ? `${segment.pointer}/evidenceIds/3` : undefined, fields: [{ path: "value.component", equals: "ten_gods" }, ...(god ? [{ path: role === "MONTH_STEM" ? "value.stemTenGod" : "value.branchTenGod", equals: god }] : [])] };
    if (role === "MONTH_PILLAR" || role === "EFFECTIVE_ANNUAL")
        return god ? null : { ...base, observationPointer: segment ? `${segment.pointer}/evidenceIds/${role === "MONTH_PILLAR" ? 0 : 1}` : undefined, fields: [{ path: "value.component", equals: role === "MONTH_PILLAR" ? "month" : "annual" }] };
    if (role === "BOUNDARY")
        return { kinds: ["TEMPORAL_BOUNDARY"], owner: "person", temporalScope: "month", observationPointer: segment?.pointer, fields: [] };
    if (role === "DAYUN_STEM")
        return null; // Graph exposes no annual-cycle tenGod field.
    if (role === "NATAL")
        return { kinds: ["CALCULATED_NATAL_FACT"], owner: "person", fields: god ? [{ path: "value.god", equals: god }] : [] };
    return null;
}
export function evaluateTypedSelector(contract: TypedSelectorContract, index: ActualBindingIndex): TemporalSelectorWitness {
    const match = index.match({ id: contract.id, originalField: "/verifiedTypedSelector", originalDeclaration: contract.originalRequirement, sourceKey: null, sourceCatalogKeys: [], owner: contract.selector.owner, use: "ACTUAL_FACT", selector: contract.selector, required: true, gaps: [] });
    const found = match.matchedActualEvidence.filter(n => !contract.requiredWindow || n.temporal?.start === contract.requiredWindow.start && n.temporal.endExclusive === contract.requiredWindow.endExclusive), windows = found.map(n => n.temporal).filter((w): w is NonNullable<typeof w> => w !== null), distinct = new Set(windows.map(w => canonicalJson([w.start, w.endExclusive, w.certainty])));
    return { selectorId: contract.id, role: contract.role, nodeIds: found.map(n => n.nodeId), acceptedNodeIds: found.map(n => n.nodeId), rejectedNodeIds: [...new Set([...match.rejectedNodeIds, ...match.matchedActualEvidence.filter(n => !found.includes(n)).map(n => n.nodeId)])], windows, reasons: [...match.reasons, ...(found.length < match.matchedActualEvidence.length ? ["REQUIRED_EXACT_WINDOW_MISMATCH"] : []), ...(distinct.size > 1 ? ["MULTIPLE_PERIOD_WITNESSES_REQUIRE_WINDOW"] : [])], ambiguity: distinct.size > 1 ? "MULTIPLE_PERIOD_WITNESSES_REQUIRE_WINDOW" : windows.some(w => w.certainty !== "confirmed" || !w.start || !w.endExclusive) ? "UNKNOWN_INTERVAL" : "NONE", selectionMade: false };
}
