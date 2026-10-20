import type { MajorCandidate, MajorCycleIdentity } from "./types";
import type { MajorEvidence } from "../../../interpretation-v4/majorEvidence";
import { getTenGodForStemPair } from "../../annualFortuneYearRules";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import { isRecord } from "../normalization";
export function matchMajorTenGod(c: MajorCandidate, cycle: MajorCycleIdentity | null, e: MajorEvidence, actual: ActualBindingIndex | null) {
  const god = c.original.god, owner = cycle?.owner;
  const nativeCycle = cycle && e.years.find(y => y.cycle.index === cycle.cycleIndex)?.cycle;
  const actualGod = nativeCycle ? getTenGodForStemPair(e.calculation.dayMaster, nativeCycle.ganji[0] as Parameters<typeof getTenGodForStemPair>[1]) : null;
  const nodes = [...actual?.graph.nodes.values() ?? []];
  const natal = nodes.filter(n => n.kind === "CALCULATED_NATAL_FACT" && n.owner.fixtureOwnerId === owner && isRecord(n.value) && n.value.god === god);
  const annual = e.years.filter(y => y.annual.tenGod === god).map(y => ({ year: y.year, evidenceIds: y.annual.evidenceIds.filter(id => id.endsWith(":ten-god")), role: "ANNUAL_NOT_DAYUN" }));
  return { originalGodLiteral: typeof god === "string" ? god : null, actualGod, scope: "dayun", cycleIndex: cycle?.cycleIndex ?? null, cycleStem: cycle?.stem ?? null, dayMaster: e.calculation.dayMaster, originalProducer: cycle?.producer ?? null, originalVersion: cycle?.calculationVersion ?? null, temporalValidity: { startSolarKst: cycle?.startSolarKst ?? null, startSolarRange: cycle?.startSolarRange ?? null, calendarStartYear: cycle?.startYear ?? null, calendarEndYear: cycle?.endYear ?? null, graphTimeState: cycle?.graphTimeState ?? "UNKNOWN_INTERVAL" }, observed: typeof god === "string" && god === cycle?.tenGod && god === actualGod, natal: natal.map(n => ({ node: n.id, producer: n.producer, participants: n.participants, roots: n.ancestry.rootIds, role: "NATAL_NOT_DAYUN" })), annual, originalNatalRequirement: c.original.natalRequired ?? null, originalElementRequirement: c.original.elementRequired ?? null, prerequisiteState: "CONTRACT_NOT_MACHINE_CHECKABLE", customerEligible: false };
}
