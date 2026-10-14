import type { MajorEvidence, MajorYearEvidence } from "../../../interpretation-v4/majorEvidence";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { AnnualBranchInteraction } from "../../annualFortuneTypes";
import type { MajorRelationWitness, RelationScope } from "./types";
import type { CustomerDayun } from "../../../saju/customerDayun";
const unique = (v: string[]) => [...new Set(v)];
export function validateRelationParticipants(scope: RelationScope, relation: AnnualBranchInteraction, e: MajorEvidence, cycleBranch: string, annualBranch: string | null) {
  const participants: MajorRelationWitness["participants"] = [], reasons: string[] = [];
  if (scope !== "natal_dayun" && annualBranch) participants.push({ scope: "annual", position: "annual", value: annualBranch });
  if (scope !== "natal_saeun") participants.push({ scope: "dayun", position: "dayun", value: cycleBranch });
  if (scope !== "dayun_saeun") {
    if (!relation.affectedPillars?.length) reasons.push("NATAL_PARTICIPANT_UNKNOWN");
    for (const position of relation.affectedPillars ?? []) {
      const value = e.calculation.pillars[position]?.branch;
      if (!value || !relation.branches.includes(value)) reasons.push(position === "hour" ? "UNKNOWN_BIRTH_TIME" : "MISSING_PARTICIPANT");
      else participants.push({ scope: "natal", position, value });
    }
  }
  if (relation.branches.some(b => !participants.some(p => p.value === b)) || participants.some(p => !relation.branches.includes(p.value as AnnualBranchInteraction["branches"][number]))) reasons.push("MISSING_PARTICIPANT");
  if (relation.type === "삼합" && (unique(participants.map(p => p.value)).length < 3 || scope === "dayun_saeun")) reasons.push("TWO_PARTICIPANT_SAMHAP_UNSUPPORTED");
  return { participants, reasons: unique(reasons) };
}
export function annualRelations(e: MajorEvidence, y: MajorYearEvidence, owner: string, actual: ActualBindingIndex | null): MajorRelationWitness[] {
  const out: MajorRelationWitness[] = [], transition = e.horizon.transitions.find(t => t.year === y.year);
  for (const [scope, rows, reasonKind, suffix] of [["natal_saeun", y.annual.natalRelations, "natal-relation", "natal"], ["dayun_saeun", y.annual.cycleRelations, "cycle-relation", "cycle"]] as const) {
    for (const relation of rows) {
      const ending = `:${suffix}:${relation.type}:${relation.branches.join("")}:${relation.affectedPillars?.join("-") ?? "cycle"}`;
      // Resolve only an original producer reason; never emit the lookup suffix
      // as evidence if the original reason or its evidence-list membership fails.
      const prefix = `major:${y.cycle.index}:${y.cycle.ganji}:year:${y.year}:${y.annual.ganji}`;
      const reason = y.annual.reasons.find(r => r.kind === reasonKind && r.evidenceId === prefix + ending);
      const check = validateRelationParticipants(scope, relation, e, y.cycle.ganji.slice(-1), y.annual.ganji.slice(-1));
      if (!reason || !y.annual.evidenceIds.includes(reason.evidenceId) || !y.annual.evidenceIds.includes(prefix) || y.annual.year !== y.year) check.reasons.push("ORIGINAL_REASON_ID_MISSING");
      const nodes = [...actual?.graph.nodes.values() ?? []].filter(n => n.fact.producerEvidenceId === reason?.evidenceId && n.owner.fixtureOwnerId === owner && n.producer.symbol === "buildMajorFortuneDecadeReading" && n.producer.version === "major-decade-v2");
      out.push({ scope, owner, year: y.year, cycleIndex: y.cycle.index, cycleGanji: y.cycle.ganji, annualGanji: y.annual.ganji, relationType: relation.type, participants: check.participants, originalEvidenceId: reason?.evidenceId ?? null, originalReasonId: reason?.evidenceId ?? null, graphNodeIds: nodes.map(n => n.id), canonicalFactRoots: unique(nodes.flatMap(n => n.ancestry.rootIds)), producer: "majorFortuneDecadeReading:buildMajorFortuneDecadeReading", producerVersion: "major-decade-v2", temporal: "YEAR_SCOPE_OBSERVATION", validAfter: scope === "dayun_saeun" ? transition?.startSolarKst ?? transition?.startSolarRange.earliestKst ?? null : null, validBefore: null, uncertainUntil: scope === "dayun_saeun" && transition && !transition.startSolarKst ? transition.startSolarRange.latestKst : null, state: check.reasons.length ? "WITHHELD" : "VERIFIED_YEAR_OBSERVATION", reasons: [...check.reasons, "PRECISE_ANNUAL_INTERVAL_NOT_EXPOSED", ...(scope === "dayun_saeun" && transition ? ["AFTER_CYCLE_ONLY_PRE_TRANSITION_PACKET_UNSUPPORTED"] : [])] });
    }
  }
  return out;
}
export function natalDayunRelations(e: MajorEvidence, owner: string, actual: ActualBindingIndex | null, basis: CustomerDayun): MajorRelationWitness[] {
  const cycle = basis.cycles.find(c => c.index === e.majorNatal.cycleIndex), next = basis.cycles.find(c => c.index === e.majorNatal.cycleIndex + 1);
  return e.majorNatal.relations.map(f => {
    const check = validateRelationParticipants("natal_dayun", f.relation, e, e.majorNatal.ganji.slice(-1), null);
    const nodes = [...actual?.graph.nodes.values() ?? []].filter(n => n.fact.producerEvidenceId === f.evidenceId && n.owner.fixtureOwnerId === owner);
    if (!cycle || cycle.ganji !== e.majorNatal.ganji) check.reasons.push("SOURCE_CYCLE_IDENTITY_UNAVAILABLE");
    return { scope: "natal_dayun", owner, year: null, cycleIndex: e.majorNatal.cycleIndex, cycleGanji: e.majorNatal.ganji, annualGanji: null, relationType: f.relation.type, participants: check.participants, originalEvidenceId: f.evidenceId, originalReasonId: f.evidenceId, graphNodeIds: nodes.map(n => n.id), canonicalFactRoots: unique(nodes.flatMap(n => n.ancestry.rootIds)), producer: "majorFortuneEvidence:getMajorFortuneBranchInteractions", producerVersion: "major-decade-v2", temporal: "YEAR_SCOPE_OBSERVATION", validAfter: cycle?.startSolarKst ?? cycle?.startSolarRange.earliestKst ?? null, validBefore: next?.startSolarKst ?? next?.startSolarRange.earliestKst ?? null, uncertainUntil: cycle && !cycle.startSolarKst ? cycle.startSolarRange.latestKst : null, state: check.reasons.length ? "WITHHELD" : "VERIFIED_YEAR_OBSERVATION", reasons: [...check.reasons, "CURRENT_CYCLE_ONLY", "GRAPH_EXACT_TIME_INTERSECTION_STILL_REQUIRED"] };
  });
}
export function relationApplication(witness: MajorRelationWitness, request: { scope: RelationScope; cycleIndex: number; year: number | null; instant?: string; exactTime?: boolean }) {
  const reasons = witness.state === "WITHHELD" ? [...witness.reasons] : [];
  if (witness.scope !== request.scope) reasons.push("WRONG_RELATION_SCOPE");
  if (witness.cycleIndex !== request.cycleIndex) reasons.push("OTHER_CYCLE_RELATION_UNAVAILABLE");
  if (witness.year !== null && witness.year !== request.year) reasons.push("WRONG_ANNUAL_YEAR");
  if (request.instant && witness.validAfter) {
    const t = Date.parse(request.instant);
    if (!Number.isFinite(t)) reasons.push("INVALID_OBSERVATION_INSTANT");
    else if (t < Date.parse(witness.validAfter)) reasons.push("PRE_POST_TRANSITION_CONFLICT", "PRE_TRANSITION_RELATION_UNSUPPORTED");
    else if (witness.uncertainUntil && t < Date.parse(witness.uncertainUntil)) reasons.push("ACTIVE_CYCLE_UNCERTAIN");
    if (witness.validBefore && t >= Date.parse(witness.validBefore)) reasons.push("NO_TEMPORAL_OVERLAP");
  }
  if (request.exactTime) reasons.push("PRECISE_ANNUAL_INTERVAL_NOT_EXPOSED");
  return { allowed: reasons.length === 0, reasons: unique(reasons), scope: witness.temporal };
}
