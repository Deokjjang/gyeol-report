import { isRecord } from "../normalization";
import { canonicalJson } from "../sourceReader";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
export function majorPeriodSelection(request: KnowledgeBindingRequest, index: ActualBindingIndex) {
    const c = request.graphInput.evidence.composition;
    if (c.product !== "major_fortune")
        return null;
    const e = c.result.evidence;
    if (e.horizon.rows.length !== 14 || e.horizon.rows.some((r, i) => r.year !== e.horizon.from + i))
        throw Error("ORIGINAL_FOURTEEN_YEAR_HORIZON_REQUIRED");
    const cycles = [...index.graph.nodes.values()].filter(n => n.kind === "CALCULATED_PERIOD_FACT" && n.temporal?.scope === "dayun" && n.owner.fixtureOwnerId === request.graph.context.owners.person);
    const relationNodes = [...index.graph.nodes.values()].filter(n => n.kind === "CALCULATED_PERIOD_FACT" && isRecord(n.value) && n.value.origin === "CURRENT_CYCLE_ONLY");
    if (relationNodes.some(n => !isRecord(n.value) || n.value.cycleIndex !== e.majorNatal.cycleIndex))
        throw Error("MAJOR_NATAL_SOURCE_CYCLE_MISMATCH");
    return { currentYear: e.currentYear, editorialHorizon: { from: e.horizon.from, through: e.horizon.through, slots: e.horizon.rows.map(r => ({ year: r.year, cycleIndex: r.cycle.index, cycleGanji: r.cycle.ganji, transitionDate: r.transitionDate, beforeCycle: r.beforeCycle })) }, tenYearCycles: cycles.map(n => ({ nodeId: n.id, value: n.value, window: n.temporal, verified: n.status !== "WITHHELD" && n.ancestry.complete, blockers: n.blockers })), instantActiveCycle: e.dayunSelection?.activeCycleAtEvaluation ?? null, selectedCycle: e.dayunSelection?.selectedCycle.index ?? null, transitions: e.horizon.transitions, currentCycleNatalRelations: { cycleIndex: e.majorNatal.cycleIndex, nodes: relationNodes.map(n => n.id) }, endpointsNotInvented: true, annualSlotsAreNotIndependentCycles: true, originalSelectionSignature: canonicalJson(e.dayunSelection) };
}
