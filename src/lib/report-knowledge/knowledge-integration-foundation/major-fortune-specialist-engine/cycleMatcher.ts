import { calculateCustomerDayun, selectCustomerDayun } from "../../../saju/customerDayun";
import { getTenGodForStemPair } from "../../annualFortuneYearRules";
import type { MajorEvidence } from "../../../interpretation-v4/majorEvidence";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import { isRecord } from "../normalization";
import { canonicalJson } from "../sourceReader";
import type { MajorCycleIdentity } from "./types";
export function matchActualCycles(e: MajorEvidence, request: KnowledgeBindingRequest | null, actual: ActualBindingIndex | null, person: Parameters<typeof calculateCustomerDayun>[0], offlineOwner = "offline:major:unmerged-observation") {
  const result = calculateCustomerDayun(person);
  if (!result.ok) return { ok: false as const, originalError: result.error };
  const basis = result.value, selection = selectCustomerDayun(basis, e.currentYear, new Date(e.evaluatedAt)), owner = request?.graph.context.owners.person ?? offlineOwner;
  const nodes = [...actual?.graph.nodes.values() ?? []];
  const cycles: MajorCycleIdentity[] = basis.cycles.map(c => {
    const graphNodes = nodes.filter(n => n.kind === "CALCULATED_PERIOD_FACT" && n.owner.fixtureOwnerId === owner && n.producer.symbol === "calculateCustomerDayun" && n.producer.version === basis.calculationVersion && isRecord(n.value) && n.value.cycleIndex === c.index && n.value.ganji === c.ganji);
    return { owner, producer: "saju/customerDayun:calculateCustomerDayun", calculationVersion: basis.calculationVersion, calendarVersion: basis.calendarVersion, cycleIndex: c.index, ganji: c.ganji, tenGod: getTenGodForStemPair(e.calculation.dayMaster, c.stem), stem: c.stem, branch: c.branch, startYear: c.startYear, endYear: c.endYear, startSolarKst: c.startSolarKst, startSolarRange: c.startSolarRange, canonicalFactRoots: [...new Set(graphNodes.flatMap(n => n.ancestry.rootIds))], graphNodeIds: graphNodes.map(n => n.id), graphTimeState: graphNodes.length > 0 && graphNodes.every(n => n.status === "VERIFIED" && n.temporal?.certainty === "confirmed" && n.temporal.start && n.temporal.endExclusive) ? "EXACT_TIME_VALIDATED_EVIDENCE" : "UNKNOWN_INTERVAL" };
  });
  const rowsMatch = e.years.every(y => cycles.some(c => c.startYear <= y.year && y.year <= c.endYear && c.cycleIndex === y.cycle.index && c.ganji === y.cycle.ganji && c.tenGod === y.cycle.tenGod && c.startYear === y.cycle.startYear && c.endYear === y.cycle.endYear));
  return { ok: true as const, basis, cycles, originalSelectionMatches: rowsMatch && selection.ok && canonicalJson(selection.value) === canonicalJson(e.dayunSelection), owner };
}
