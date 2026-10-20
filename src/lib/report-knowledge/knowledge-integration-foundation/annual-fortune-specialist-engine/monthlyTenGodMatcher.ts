import { HIDDEN_STEMS } from "../../../saju/constants";
import { annualRoleSelector, evaluateTypedSelector } from "../product-specialist-foundation/annualSelector";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { AnnualCandidate, AnnualSegment, GodMatch, OriginalAnnual, Role } from "./types";
/** A natural-language "monthly god" declaration supplies no stem/main role.
 * The two diagnostic alternatives never add an active Binder requirement. */
export function declaredMonthlyRole(raw: Readonly<Record<string, unknown>>): Role | "AMBIGUOUS" {
  return raw.requiredRole === "MONTH_STEM" || raw.requiredRole === "MONTH_BRANCH_MAIN" ? raw.requiredRole : "AMBIGUOUS";
}
export function matchMonthlyGod(c: AnnualCandidate, s: AnnualSegment, e: OriginalAnnual, actual: ActualBindingIndex, explicitRole?: "MONTH_STEM" | "MONTH_BRANCH_MAIN"): GodMatch {
  const role = explicitRole ?? declaredMonthlyRole(c.original), god = typeof c.original.god === "string" ? c.original.god : "UNKNOWN", raw = s.raw;
  const alternatives = (["MONTH_STEM", "MONTH_BRANCH_MAIN"] as const).map(r => {
    const selector = annualRoleSelector(r, god, s.contract)!;
    const n = actual.graph.nodes.get(s.contract.componentNodeIds.ten_gods!); if (n) selector.producer = n.producer;
    return evaluateTypedSelector({ id: `${c.catalogKey}#${s.originalPointer}/${r}`, kind: "MONTH_SEGMENT_SELECTOR", catalogKey: c.catalogKey, originalRequirement: c.original, originalContractLocator: c.candidate.record.locator, originalContractHash: c.candidate.record.locator.recordSha256 ?? "UNKNOWN", role: r, selector, requiredWindow: s.contract.window, state: role === "AMBIGUOUS" ? "CONTRACT_NOT_MACHINE_CHECKABLE" : "EXACT_TYPED_CONTRACT", proposalOnly: role === "AMBIGUOUS", originalMeaningUnchanged: true }, actual);
  });
  const chosen = role === "AMBIGUOUS" ? null : alternatives.find(a => a.role === role)!;
  const targetStem = role === "MONTH_STEM" ? raw.monthPillar.stem : role === "MONTH_BRANCH_MAIN" ? HIDDEN_STEMS[raw.monthPillar.branch].find(h => h.kind === "MAIN")?.stem ?? null : null;
  const nodeIds = chosen?.acceptedNodeIds ?? [], nodes = nodeIds.map(id => actual.graph.nodes.get(id)!);
  const reasons = [...(role === "AMBIGUOUS" ? ["AMBIGUOUS_MONTHLY_GOD_ROLE", "ROLE_AMBIGUITY_REVIEW_REQUIRED"] : []), ...(!targetStem ? ["REFERENCE_OR_TARGET_STEM_UNKNOWN"] : []), ...(chosen && !nodeIds.length ? ["ACTUAL_ROLE_GOD_WINDOW_NOT_MATCHED"] : [])];
  return { role, requiredGod: god, actualGod: role === "MONTH_STEM" ? raw.stemTenGod : role === "MONTH_BRANCH_MAIN" ? raw.branchTenGod : null, referenceStem: e.raw.dayMaster, targetStem, actualEvidenceIds: nodes.flatMap(n => n.fact.producerEvidenceId ? [n.fact.producerEvidenceId] : []), nodeIds, canonicalFactRoots: [...new Set(nodes.flatMap(n => n.ancestry.rootIds))], window: s.contract.window, matched: !reasons.length, alternatives, reasons };
}
export function godReferenceAudit(e: OriginalAnnual) {
  return e.crossPeriods.map(p => ({ window: { start: p.startKst, endExclusive: p.endKstExclusive }, effectiveAnnual: p.segment.effectiveAnnualPillar, annualGod: { value: p.annualGod, referenceStem: e.raw.dayMaster, targetStem: p.segment.effectiveAnnualPillar.stem, sourceScope: "EFFECTIVE_ANNUAL_STEM", evidenceId: null, addressability: "ORIGINAL_PRODUCER_OBSERVATION_NO_DEDICATED_GRAPH_ID" }, cycles: p.cycles.map(c => ({ cycleIndex: c.cycle.index, cycleGod: { value: c.god, referenceStem: e.raw.dayMaster, targetStem: c.cycle.stem, sourceScope: "DAYUN_STEM" }, flowGod: { value: c.flowGod, referenceStem: c.cycle.stem, targetStem: p.segment.effectiveAnnualPillar.stem, sourceScope: "DAYUN_TO_EFFECTIVE_ANNUAL" }, certainty: p.segment.activeDayunContext.status, branchRelations: c.branchRelations })), sourceRefs: p.sourceRefs, customerClaimAllowed: false }));
}
