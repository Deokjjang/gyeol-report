import { canonicalJson, hash } from "../sourceReader";
import { isRecord } from "../normalization";
import type { MajorCandidate, MajorMatch, MajorObservation, MajorYearContext } from "./types";
import type { KnowledgeBinderCatalog } from "../knowledge-binder/catalog";
import type { KnowledgeBindingReceipt } from "../knowledge-binder/types";
export function majorResearchYearMatch(c: MajorCandidate, y: MajorYearContext, o: MajorObservation, receipt: KnowledgeBindingReceipt, catalog: KnowledgeBinderCatalog, fixtureId: string): MajorMatch {
  const r = c.original, reasons = ["CUSTOMER_APPROVAL_PENDING", "MEANING_REVIEW_REQUIRED"], actualEvidenceIds: string[] = [], nodes: string[] = [], roots: string[] = [];
  let observed = false;
  if (typeof r.god === "string") {
    observed = r.god === y.cycle?.tenGod;
    if (!observed) reasons.push("ACTUAL_CYCLE_TEN_GOD_NOT_MATCHED");
    else { nodes.push(...y.cycle!.graphNodeIds); roots.push(...y.cycle!.canonicalFactRoots); }
    if (y.cycle?.graphTimeState !== "EXACT_TIME_VALIDATED_EVIDENCE") reasons.push("UNKNOWN_INTERVAL");
  } else if (c.researchKind === "TEMPORAL_INTERACTION") {
    const relations = r.scope === "natal_dayun" ? o.natalDayunRelations.filter(w => w.cycleIndex === y.cycle?.cycleIndex) : y.relations.filter(w => w.scope === r.scope);
    const verified = relations.filter(w => w.state === "VERIFIED_YEAR_OBSERVATION");
    observed = verified.length > 0;
    for (const w of verified) { if (w.originalEvidenceId) actualEvidenceIds.push(w.originalEvidenceId); nodes.push(...w.graphNodeIds); roots.push(...w.canonicalFactRoots); }
    if (r.scope === "natal_dayun_saeun") reasons.push("UNSUPPORTED_COMPOSITE");
    else if (!relations.length) reasons.push(r.scope === "natal_dayun" && y.cycle?.cycleIndex !== o.originalSelection?.activeCycleAtEvaluation ? "OTHER_CYCLE_RELATION_UNAVAILABLE" : "RELATION_NOT_DETECTED_NOT_A_PEACE_VERDICT");
    reasons.push("PRECISE_ANNUAL_INTERVAL_NOT_EXPOSED");
  } else if (c.researchKind === "YEAR_SLOT_QUESTION") {
    observed = r.offset === y.relativeYearOffset; reasons.push("QUESTION_VIEW_IS_NOT_INTERPRETATION_CLAIM");
  } else if (c.researchKind === "YEAR_COMPARISON") {
    observed = o.years.some(x => x.calendarYear !== y.calendarYear); reasons.push("TWO_PERIODS_AND_REVIEWED_MEANING_REQUIRED");
  } else if (c.researchKind === "TRANSITION_POLICY") {
    const exact = !!y.transition?.startSolarKst, range = !!y.transition && !exact;
    observed = r.state === "exact" ? exact : r.state === "range" ? range : false;
    if (!observed) reasons.push("TRANSITION_STATE_NOT_MATCHED_OR_NATURAL_POLICY_UNRESOLVED");
  } else if (c.researchKind === "OBSERVED_FIXTURE_RESEARCH") {
    const f = isRecord(r.observedFacts) ? r.observedFacts : null, a = f && isRecord(f.annual) ? f.annual : null, cy = f && isRecord(f.cycle) ? f.cycle : null;
    // Documentary fixture equality is useful review evidence, never proof of
    // this owner's event or an ancestry selector derived from another person.
    observed = !!a && !!cy && !!y.cycle && a.year === y.calendarYear && a.ganji === y.annualGanji && a.tenGod === y.annualTenGod && cy.index === y.cycle.cycleIndex && cy.ganji === y.cycle.ganji;
    reasons.push("OBSERVED_FIXTURE_IS_REFERENCE_NOT_ACTUAL_OWNER_ANCESTRY");
  } else { observed = !!y.cycle; reasons.push("CONTRACT_NOT_MACHINE_CHECKABLE"); }
  const unresolvedRequirements = c.sourceRoles.filter(s => s.role === "ACTUAL_REQUIRED_EVIDENCE" && !s.machineCheckable).map(s => ({ field: "/" + s.field, original: s.value }));
  if (c.researchKind === "LIFE_DOMAIN_APPLICATION") reasons.push("HISTORICAL_AND_FUTURE_LIFE_STATE_UNKNOWN");
  if (unresolvedRequirements.length) reasons.push("ORIGINAL_NATURAL_PREREQUISITES_UNRESOLVED");
  const sourceKeys = [...new Set(receipt.matches.flatMap(m => m.sourceCatalogKeys))];
  const sourceAncestry = sourceKeys.map(k => ({ catalogKey: k, locator: catalog.semantic.graph.byKey.get(k)?.locator ?? null, ancestors: catalog.sourceAncestors(k), role: "SOURCE_REFERENCE_NOT_ACTUAL_EVIDENCE" }));
  if (hash(canonicalJson(c.bindingCandidate.requirement)) !== c.bindingRequirementHash) throw Error("ORIGINAL_REQUIREMENT_CHANGED");
  return { fixtureId, owner: o.owner, catalogKey: c.catalogKey, researchKind: c.researchKind, year: y.calendarYear, cycleIndex: y.cycle?.cycleIndex ?? null, observed, actualEvidenceIds, graphNodeIds: [...new Set(nodes)], canonicalFactRoots: [...new Set(roots)], timeState: "YEAR_SCOPE_OBSERVATION", sourceAncestry, requiredParticipants: r.participants ?? null, unresolvedRequirements, informationFunction: r.scope === "natal_dayun_saeun" ? "UNSUPPORTED" : c.researchKind === "YEAR_COMPARISON" && observed ? "CONDITIONAL_COMPARISON" : "WITHHELD", reasons: [...new Set(reasons)].sort(), customerEligible: false, customerRank: null };
}
