import { canonicalJson, hash } from "../sourceReader";
import { evidenceHash } from "../actual-evidence-graph/graph";
import { annualMonthContracts } from "../product-specialist-foundation/annualSelector";
import type { ActualBindingIndex } from "../knowledge-binder/matching";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductQuestionIndex } from "../product-specialist-foundation/questionIndex";
import type { AnnualObservation, AnnualSegment } from "./types";
import { auditBoundaries } from "./boundaryValidator";
import { validateAnnualNodeIdentity } from "./annualIdentity";
export function validateLedgerBounds(months: AnnualObservation["months"]): string[] {
  const errors: string[] = [];
  if (months.length !== 12) errors.push("TWELVE_CIVIL_MONTHS_REQUIRED");
  months.forEach((m, i) => {
    const start = `${m.selectedYear}-${String(i + 1).padStart(2, "0")}-01T00:00:00+09:00`, end = `${i === 11 ? m.selectedYear + 1 : m.selectedYear}-${String(i === 11 ? 1 : i + 2).padStart(2, "0")}-01T00:00:00+09:00`;
    if (m.civilMonth !== i + 1 || m.calendarBounds.start !== start || m.calendarBounds.endExclusive !== end) errors.push("CIVIL_MONTH_BOUNDS_OR_ORDER_INVALID");
    if (!m.segments.length || m.segments[0].window.start !== start || m.segments.at(-1)!.window.endExclusive !== end) errors.push("SEGMENT_FULL_MONTH_COVERAGE_REQUIRED");
    for (const [j, s] of m.segments.entries()) {
      if (!s.window.start || !s.window.endExclusive || !/\+09:00$/.test(s.window.start) || !/\+09:00$/.test(s.window.endExclusive) || !(Date.parse(s.window.start) < Date.parse(s.window.endExclusive))) errors.push("SEGMENT_KST_NONEMPTY_INTERVAL_REQUIRED");
      if (j && s.window.start !== m.segments[j - 1].window.endExclusive) errors.push("SEGMENT_GAP_OR_OVERLAP");
    }
  }); return [...new Set(errors)];
}
export function observeAnnualLedger(request: KnowledgeBindingRequest, actual: ActualBindingIndex, questions: ProductQuestionIndex): AnnualObservation {
  const composition = request.graphInput.evidence.composition;
  if (composition.product !== "annual_fortune") throw Error("ANNUAL_SCOPE_REQUIRED");
  const before = evidenceHash(request.graph), packet = evidenceHash(request.graphInput.evidence), e = composition.result.evidence;
  const months = annualMonthContracts(request, actual, questions), owner = request.graph.context.owners.person!;
  const segments: AnnualSegment[] = months.flatMap(m => m.segments.map(s => {
    const raw = e.raw.calendarMonths![m.civilMonth - 1].segments[s.segmentIndex];
    const nodes = [...actual.graph.nodes.values()].filter(n => n.owner.fixtureOwnerId === owner && n.fact.observationPointer?.startsWith(s.pointer + "/") && n.temporal?.start === raw.startKst && n.temporal.endExclusive === raw.endKstExclusive);
    return { contract: s, raw, owner, sourceVersion: e.raw.monthlyCalculationVersion!, originalPointer: s.pointer, recordHash: hash(canonicalJson(raw)), nodes, canonicalFactRoots: [...new Set(nodes.flatMap(n => n.fact.rootId ? [n.fact.rootId] : []))].sort(), supportingAncestryRoots: [...new Set(nodes.flatMap(n => n.ancestry.rootIds))].sort() };
  }));
  return { selectedYear: e.selectedYear, owner, months, segments, errors: [...new Set([...validateLedgerBounds(months), ...segments.flatMap(s=>s.nodes.flatMap(n=>validateAnnualNodeIdentity(n,s,e.monthly.version)))])], boundaryAudit: auditBoundaries(segments), graphUnchanged: before === evidenceHash(request.graph), packetUnchanged: packet === evidenceHash(request.graphInput.evidence) };
}
