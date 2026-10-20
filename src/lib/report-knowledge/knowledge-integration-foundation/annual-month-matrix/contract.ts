import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { actualSemanticDigest, validateActualCalculatedUnit, type ActualCalculatedSemanticUnit } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptNativeRequirementBindings } from "../native-requirement-binding/adapter";
import { NATIVE_MONTH_PAIR_CONTRACT } from "../native-requirement-binding/contract";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import type { AnnualCandidate, AnnualSegment } from "../annual-fortune-specialist-engine/types";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import type { SourceProof } from "../source-verification/types";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, KnowledgeCandidate, EvidenceSelector } from "../knowledge-binder/types";
import { BINDING_HARD_GATES } from "../types";

export const MATRIX_CONTRACTS = freeze({
  7: { version: "annual-july-active-context-v1", originalId: "afpr:month-slot:07", index: 6,
    recordSha256: "33eff463556f20ad6118ff6e78ebcf461e460e51affd1004dda17253f5abefa1",
    requires: ["selectedYear + actual civil month bounds", "every canonical segment", "actual boundaries + active cycle + continuing annual pillar"] },
  12: { version: "annual-december-last-boundary-v1", originalId: "afpr:month-slot:12", index: 11,
    recordSha256: "ddde19351c827b889f5bb8da48cb3a668f3fac2911d0b2ccdcd74585793cd0a7",
    requires: ["selectedYear + actual civil month bounds", "every canonical segment", "actual last segment + optional next-year canonical segment + boundaries"] },
} as const);
type Month = keyof typeof MATRIX_CONTRACTS;
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
type Baseline = Extract<Awaited<ReturnType<typeof adaptNativeRequirementBindings>>, { ok: true }>;
export type MatrixContext = Readonly<{ version: "annual-month-matrix-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; bridge: ActualCalculationRun; services: Services; baseline: Baseline; rows: Map<Month, AnnualCandidate>; segments: AnnualSegment[]; units: ActualCalculatedSemanticUnit[] };
export type MatrixCandidate = {
  version: "annual-month-matrix-candidate-v1"; candidateId: string; month: Month; technicalContract: (typeof MATRIX_CONTRACTS)[Month];
  technicalState: "TECHNICAL_REQUIREMENT_RESOLVED"; evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE"; fixtureId: string;
  originalResearchId: string; originalCatalogKey: string; originalSourceProof: SourceProof; originalResearchRecord: AnnualCandidate["original"];
  originalCandidate: KnowledgeCandidate; originalNativeReceipt: KnowledgeBindingReceipt; originalNativeReceiptHash: string;
  typedCandidate: KnowledgeCandidate; typedNativeReceipt: KnowledgeBindingReceipt; typedNativeReceiptHash: string;
  originalMeaningIdentity: string | null; originalClaimIdentity: string | null;
  segmentPointer: string; effectiveInterval: AnnualSegment["contract"]["window"];
  sourcePreconditions: { use: "SOURCE_PRECONDITION_ONLY_NOT_NATIVE_SELECTION"; previousLastPointer: string; allSegmentPointers: string[];
    ledger: { pointer: string; recordHash: string; window: AnnualSegment["contract"]["window"]; componentNodeIds: AnnualSegment["contract"]["componentNodeIds"]; monthPillar: AnnualSegment["raw"]["monthPillar"]; effectiveAnnualPillar: AnnualSegment["raw"]["effectiveAnnualPillar"]; activeDayunContext: AnnualSegment["raw"]["activeDayunContext"] }[];
    annualContinues: boolean | null; lastSegmentPointer: string; nextYear: "NOT_REQUESTED" | "UNAVAILABLE_NO_EXTRAPOLATION"; nextYearSegmentIds: readonly [] };
  verifiedCalculationFacts: ActualCalculatedSemanticUnit[]; verifiedActualUnitIds: string[];
  selectedGraphFacts: { nodeId: string; kind: string; producer: AnnualSegment["nodes"][number]["producer"]; owner: AnnualSegment["nodes"][number]["owner"]; pointer: string; window: AnnualSegment["nodes"][number]["temporal"]; roots: string[]; ancestry: AnnualSegment["nodes"][number]["ancestry"] }[];
  originalFactRoots: string[]; verifiedUnitFactRoots: string[]; additionalReferenceRoots: string[];
  allTwelveGateResults: KnowledgeBindingReceipt["allTwelveGateResults"];
  customerUseAllowed: false; plannerUseAllowed: false; customerClaims: 0; customerApprovals: 0; newFactRoots: 0;
};
const sessions = new WeakMap<MatrixContext, Session>();
const same = (a: unknown, b: unknown) => actualSemanticDigest(a) === actualSemanticDigest(b);
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_MATRIX_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, reasons: [e instanceof Error ? e.message : "ANNUAL_MATRIX_UNVERIFIED"], customerUseAllowed: false as const });
async function source(row: AnnualCandidate, month: Month, services: Services) {
  const pin = MATRIX_CONTRACTS[month], common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const original = await services.resolver.record(row.candidate.record), proof = await services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(original, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== month || row.original.scope !== "civil_month"
    || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false || row.candidate.requirement.requiredTemporalScope !== "month") throw Error("EXACT_ORIGINAL_MONTH_MATRIX_SOURCE_REQUIRED");
  return proof;
}
/** The original May adapter remains authoritative and byte-for-byte unchanged. */
export async function prepareMatrixContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptNativeRequirementBindings(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (baseline.baseline.native.version !== "annual-fortune-specialist-v1") return { ok: true as const, context: null, baseline };
    const index = new AnnualSpecialistIndex(services.foundation), rows = new Map<Month, AnnualCandidate>();
    for (const month of [7, 12] as const) {
      const original = index.byOriginalId.get(MATRIX_CONTRACTS[month].originalId); if (!original) throw Error("ORIGINAL_MONTH_MATRIX_RECORD_REQUIRED");
      const row = structuredClone(original); await source(row, month, services); rows.set(month, freeze(row));
    }
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const context = freeze({ version: "annual-month-matrix-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: structuredClone(request), bridge, services, baseline, rows, segments: structuredClone(baseline.baseline.native.observation.segments), units: structuredClone(bridge.handoff.units) });
    return { ok: true as const, context, baseline };
  } catch (e) { return fail(e); }
}
export async function createMatrixCandidate(context: MatrixContext, month: Month, catalogKey: string, segmentPointer: string) {
  offline();
  try {
    const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_MONTH_MATRIX_CONTEXT_REQUIRED");
    const row = s.rows.get(month), all = s.segments.filter(v => v.contract.month === month), current = all.find(v => v.originalPointer === segmentPointer);
    if (!row || row.catalogKey !== catalogKey || !current) throw Error("EXACT_MONTH_SOURCE_AND_SEGMENT_REQUIRED");
    const proof = await source(row, month, s.services), first = all[0], last = all.at(-1)!, previous = s.segments.filter(v => v.contract.month === month - 1).at(-1);
    if (!previous || previous.raw.endKstExclusive !== first.raw.startKst || all.some((v, i) => v.contract.window.certainty !== "confirmed" || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst)) throw Error("ACTUAL_PREVIOUS_AND_EVERY_CANONICAL_SEGMENT_REQUIRED");
    const units: ActualCalculatedSemanticUnit[] = [];
    const annualContinues = month === 7 ? all.every(v => same(v.raw.effectiveAnnualPillar, previous.raw.effectiveAnnualPillar)) : null;
    if (month === 7) {
      if (!annualContinues || all.some(v => v.raw.activeDayunContext.status !== "active" || v.raw.activeDayunContext.cycles.length !== 1 || v.raw.activeDayunContext.transitionRange)) throw Error("CONFIRMED_ACTIVE_CYCLE_AND_CONTINUING_ANNUAL_REQUIRED");
      // A real active-cycle context is not an invented ten-god field. Existing
      // god Units verify calculation support; they do not assign god meanings.
      for (const origin of ["DAYUN_STEM", "ANNUAL_STEM"] as const) {
        for (const segment of all) {
          const ids = s.units.filter(u => u.originLayer === origin && u.originalEvidenceNodeId === segment.contract.componentNodeIds[origin === "DAYUN_STEM" ? "dayun" : "annual"] && same(u.effectiveInterval, segment.contract.window));
          if (ids.length !== 1 || !(await validateActualCalculatedUnit(s.bridge.context, ids[0])).ok) throw Error("AUTHENTIC_ACTIVE_CYCLE_AND_ANNUAL_UNIT_REQUIRED");
          const u = ids[0];
          if (u.referenceBasis !== "NATAL_DAY_MASTER" || u.owner.fixtureOwnerId !== s.request.graph.context.owners.person || u.direction !== null
            || (origin === "DAYUN_STEM" ? u.calculationWitness?.cycleIndex !== segment.raw.activeDayunContext.cycles[0].index || u.targetStem !== segment.raw.activeDayunContext.cycles[0].ganji[0] : u.targetStem !== segment.raw.effectiveAnnualPillar.stem)) throw Error("EXACT_ACTIVE_CYCLE_REFERENCE_OWNER_REQUIRED");
          if (segment.originalPointer === segmentPointer) units.push(u);
        }
      }
    } else {
      // The original clause makes next-year data optional. A year-end bound is
      // not a next-year segment. The existing ledger has exactly twelve months.
      if (last.raw.endKstExclusive !== `${last.contract.selectedYear + 1}-01-01T00:00:00+09:00` || s.segments.some(v => v.contract.selectedYear !== last.contract.selectedYear)) throw Error("ACTUAL_DECEMBER_LAST_SEGMENT_REQUIRED");
    }
    const segment = current.contract, candidate = structuredClone(row.candidate);
    const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.window, restrictEvidenceTo: [segment.boundaryNodeId!, ...Object.values(segment.componentNodeIds).filter((id): id is string => typeof id === "string")] }, s.services.foundation.catalog);
    const roles = month === 7 ? ["EFFECTIVE_ANNUAL", "ACTIVE_DAYUN_CONTEXT", "BOUNDARY"] as const : ["MONTH_PILLAR", "BOUNDARY"] as const;
    for (const role of roles) {
      const id = role === "BOUNDARY" ? segment.boundaryNodeId! : segment.componentNodeIds[role === "EFFECTIVE_ANNUAL" ? "annual" : role === "ACTIVE_DAYUN_CONTEXT" ? "dayun" : "month"]!;
      const n = index.graph.nodes.get(id); if (!n) throw Error("EXACT_ORIGINAL_GRAPH_FACT_REQUIRED");
      const selector: EvidenceSelector = role === "ACTIVE_DAYUN_CONTEXT" ? { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", temporalScope: "month", observationPointer: `${segment.pointer}/evidenceIds/2`, fields: [{ path: "value.component", equals: "dayun" }] } : annualRoleSelector(role, undefined, segment)!;
      selector.producer = n.producer;
      candidate.requirement.sourceRequirements.push({ id: `${catalogKey}#${MATRIX_CONTRACTS[month].version}/${segment.segmentIndex}/${role}`, originalField: "/requires/2", originalDeclaration: row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] });
    }
    candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
    const original = s.baseline.baseline.native.receipts.find(r => r.candidateCatalogKey === catalogKey)!;
    const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
    if (index.errors.length || receipt.customerApproved || receipt.operatorApproved || receipt.selectedActualEvidence.length !== roles.length || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES)
      || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
      || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation) || receipt.canonicalFactRoots.some(r => !s.bridge.handoff.canonicalFactRoots.includes(r))
      || units.some(u => !receipt.selectedActualEvidence.includes(u.originalEvidenceNodeId) || index.graph.nodes.get(u.originalEvidenceNodeId)!.ancestry.rootIds.some(r => !receipt.canonicalFactRoots.includes(r)))) throw Error("EXACT_NATIVE_MONTH_SELECTION_AND_ORIGINAL_GATES_REQUIRED");
    const roots = [...new Set(units.flatMap(u => u.canonicalFactRoots))].sort();
    const body: Omit<MatrixCandidate, "candidateId"> = {
      version: "annual-month-matrix-candidate-v1", month, technicalContract: MATRIX_CONTRACTS[month], technicalState: "TECHNICAL_REQUIREMENT_RESOLVED", evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE", fixtureId: context.fixtureId,
      originalResearchId: row.originalResearchId, originalCatalogKey: catalogKey, originalSourceProof: proof, originalResearchRecord: row.original, originalCandidate: row.candidate, originalNativeReceipt: original, originalNativeReceiptHash: actualSemanticDigest(original),
      typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt), originalMeaningIdentity: row.candidate.requirement.meaningIdentity, originalClaimIdentity: row.candidate.requirement.claimIdentity,
      segmentPointer, effectiveInterval: segment.window,
      sourcePreconditions: { use: "SOURCE_PRECONDITION_ONLY_NOT_NATIVE_SELECTION", previousLastPointer: previous.originalPointer, allSegmentPointers: all.map(v => v.originalPointer), ledger: [previous, ...all].map(v => ({ pointer: v.originalPointer, recordHash: v.recordHash, window: v.contract.window, componentNodeIds: v.contract.componentNodeIds, monthPillar: v.raw.monthPillar, effectiveAnnualPillar: v.raw.effectiveAnnualPillar, activeDayunContext: v.raw.activeDayunContext })), annualContinues, lastSegmentPointer: last.originalPointer, nextYear: month === 12 ? "UNAVAILABLE_NO_EXTRAPOLATION" : "NOT_REQUESTED", nextYearSegmentIds: [] },
      verifiedCalculationFacts: units, verifiedActualUnitIds: units.map(u => u.unitId),
      selectedGraphFacts: receipt.selectedActualEvidence.map(id => { const n = index.graph.nodes.get(id)!; return { nodeId: id, kind: n.kind, producer: n.producer, owner: n.owner, pointer: n.fact.observationPointer, window: n.temporal, roots: n.ancestry.rootIds, ancestry: n.ancestry }; }),
      originalFactRoots: receipt.canonicalFactRoots, verifiedUnitFactRoots: roots, additionalReferenceRoots: roots.filter(r => !receipt.canonicalFactRoots.includes(r)), allTwelveGateResults: receipt.allTwelveGateResults,
      customerUseAllowed: false, plannerUseAllowed: false, customerClaims: 0, customerApprovals: 0, newFactRoots: 0,
    };
    return { ok: true as const, candidate: freeze(structuredClone({ ...body, candidateId: `annual-month-matrix:v1:${v4Digest(body)}` })) };
  } catch (e) { return fail(e); }
}
export async function validateMatrixCandidate(context: MatrixContext, candidate: MatrixCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const expected = await createMatrixCandidate(context, candidate.month, candidate.originalCatalogKey, candidate.segmentPointer);
  return { ok: expected.ok && v4Digest(expected.candidate) === v4Digest(candidate), reasons: expected.ok ? v4Digest(expected.candidate) === v4Digest(candidate) ? [] : ["ORIGINAL_MONTH_MATRIX_CANDIDATE_CHANGED"] : expected.reasons, customerUseAllowed: false as const };
}
