import { evidenceHash } from "../actual-evidence-graph/graph";
import { majorPeriodSelection } from "../product-specialist-foundation/majorSelector";
import { isRecord } from "../normalization";
import type { MajorEvidence } from "../../../interpretation-v4/majorEvidence";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { CustomerDayunInput } from "../../../saju/customerDayun";
import { matchActualCycles } from "./cycleMatcher";
import { annualRelations, natalDayunRelations } from "./relationMatcher";
import type { MajorObservation, MajorYearContext } from "./types";
export const MAJOR_PRODUCER_GAPS = ["GRAPH_CYCLE_ENDPOINTS_PARTIAL", "PRECISE_ANNUAL_INTERVAL_NOT_EXPOSED", "OTHER_CYCLE_NATAL_DAYUN_RELATIONS_UNAVAILABLE", "PRE_TRANSITION_DAYUN_ANNUAL_PACKET_UNAVAILABLE", "NATAL_DAYUN_ANNUAL_COMPOSITE_VERDICT_UNSUPPORTED", "STEM_COMBINATION_TRANSFORMATION_WONJIN_STRENGTH_FAVORABILITY_UNSUPPORTED", "SOURCE_GROUP_NOT_DECLARED", "MEANING_AND_CUSTOMER_APPROVAL_PENDING"] as const;
export function observeMajorPeriods(e: MajorEvidence, person: CustomerDayunInput, request: KnowledgeBindingRequest | null = null, actual: ActualBindingIndex | null = null, offlineOwner?: string): MajorObservation {
  const before = evidenceHash(e), graphBefore = request ? evidenceHash(request.graph) : null;
  const matched = matchActualCycles(e, request, actual, person, offlineOwner);
  if (!matched.ok) throw Error("ORIGINAL_DAYUN_PRODUCER_WITHHELD:" + matched.originalError);
  const { cycles, basis, owner } = matched, nodes = [...actual?.graph.nodes.values() ?? []];
  if (e.horizon.from !== e.currentYear - 3 || e.horizon.through !== e.currentYear + 10 || e.years.length !== 14 || e.years.some((y, i) => y.year !== e.currentYear - 3 + i)) throw Error("ORIGINAL_FOURTEEN_YEAR_HORIZON_REQUIRED");
  const natal = natalDayunRelations(e, owner, actual, basis);
  const years: MajorYearContext[] = e.years.map(y => {
    const cycle = cycles.find(c => c.cycleIndex === y.cycle.index) ?? null, annualIds = new Set(y.annual.evidenceIds);
    const annualNodes = nodes.filter(n => n.owner.fixtureOwnerId === owner && n.fact.producerEvidenceId && annualIds.has(n.fact.producerEvidenceId));
    const annualRoots = [...new Set(annualNodes.flatMap(n => n.ancestry.rootIds))], natalNodes = nodes.filter(n => n.kind === "CALCULATED_NATAL_FACT" && n.owner.fixtureOwnerId === owner);
    const relations = annualRelations(e, y, owner, actual), transition = e.horizon.transitions.find(t => t.year === y.year) ?? null;
    return { productKey: "major_fortune", relativeYearOffset: y.year - e.currentYear, calendarYear: y.year, owner, cycle, annualGanji: y.annual.ganji, annualTenGod: y.annual.tenGod, annualEvidenceIds: y.annual.evidenceIds, reasonIds: y.annual.reasons.map(r => r.evidenceId), annualRoots, natalRoots: [...new Set(natalNodes.flatMap(n => n.ancestry.rootIds))], graphNodeIds: annualNodes.map(n => n.id), relations, transition, certainty: "YEAR_SCOPE_OBSERVATION", missing: ["PRECISE_ANNUAL_INTERVAL_NOT_EXPOSED", ...(!cycle ? ["TARGET_CYCLE_UNAVAILABLE"] : cycle.graphTimeState === "UNKNOWN_INTERVAL" ? ["GRAPH_CYCLE_INTERVAL_WITHHELD"] : []), ...(cycle?.cycleIndex !== e.majorNatal.cycleIndex ? ["OTHER_CYCLE_RELATION_UNAVAILABLE"] : []), ...(transition ? ["PRE_TRANSITION_DAYUN_ANNUAL_PACKET_UNAVAILABLE"] : [])], sourceAncestry: annualNodes.map(n => ({ nodeId: n.id, producer: n.producer, source: n.sources, ancestry: n.ancestry, certainty: n.certainty, temporal: n.temporal, originalProducerEvidenceId: n.fact.producerEvidenceId })) };
  });
  const unknownHour = !e.calculation.pillars.hour;
  if (unknownHour && [...years.flatMap(y => y.relations), ...natal].some(r => r.participants.some(p => p.scope === "natal" && p.position === "hour"))) throw Error("UNKNOWN_HOUR_PARTICIPANT_IN_ORIGINAL_PRODUCER");
  if (nodes.some(n => isRecord(n.value) && n.value.origin === "CURRENT_CYCLE_ONLY" && n.value.cycleIndex !== e.majorNatal.cycleIndex)) throw Error("ORIGINAL_CURRENT_CYCLE_ANCESTRY_MISMATCH");
  return { owner, evaluatedAt: e.evaluatedAt, baseYear: e.currentYear, precision: basis.precision, cycles, originalDayun: basis, originalSelection: e.dayunSelection ?? null, originalSelectionMatches: matched.originalSelectionMatches, years, natalDayunRelations: natal, allTenYearCycles: cycles.every(c => c.endYear - c.startYear === 9), graphPeriodSelection: request && actual ? majorPeriodSelection(request, actual) : null, graphUnchanged: !request || graphBefore === evidenceHash(request.graph), packetUnchanged: before === evidenceHash(e), producerGaps: [...MAJOR_PRODUCER_GAPS] };
}
