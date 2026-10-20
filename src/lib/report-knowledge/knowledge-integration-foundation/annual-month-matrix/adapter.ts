import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { prepareMatrixContext, createMatrixCandidate, MATRIX_CONTRACTS, type MatrixCandidate } from "./contract";
export async function adaptAnnualMonthMatrix(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), prepared = await prepareMatrixContext(request, bridge, services);
  if (!prepared.ok) return prepared;
  const candidates: MatrixCandidate[] = [], withheld = [];
  if (prepared.context && prepared.baseline.baseline.native.version === "annual-fortune-specialist-v1") {
    for (const month of [7, 12] as const) {
      const native = prepared.baseline.baseline.native, original = native.receipts.find(r => r.originalResearchId === MATRIX_CONTRACTS[month].originalId)!;
      const segments = native.observation.months.find(v => v.civilMonth === month)!.segments, rows: MatrixCandidate[] = [];
      for (const segment of segments) {
        const r = await createMatrixCandidate(prepared.context, month, original.candidateCatalogKey, segment.pointer);
        if (r.ok) rows.push(r.candidate); else withheld.push({ month, segmentPointer: segment.pointer, reasons: r.reasons });
      }
      if (rows.length === segments.length) candidates.push(...rows);
      else withheld.push({ month, segmentPointer: `month-${month}`, reasons: ["EVERY_ORIGINAL_SEGMENT_REQUIRED"] });
    }
  }
  const linked = new Set(candidates.flatMap(c => c.verifiedActualUnitIds));
  const unitStates = prepared.baseline.handoff.unitStates.map(u => ({ ...u, matrixState: linked.has(u.unitId) ? "TECHNICAL_REQUIREMENT_RESOLVED" as const : u.technicalState,
    matrixCandidateIds: candidates.filter(c => c.verifiedActualUnitIds.includes(u.unitId)).map(c => c.candidateId) }));
  if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) return { ok: false as const, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"], customerUseAllowed: false as const };
  return { ok: true as const, context: prepared.context, baseline: prepared.baseline,
    handoff: { version: "annual-month-matrix-handoff-v1" as const, fixtureId: request.graph.context.fixtureId,
      historicalMajorCandidates: prepared.baseline.handoff.historicalCandidates, historicalMayCandidates: prepared.baseline.handoff.technicalCandidates,
      newMatrixCandidates: candidates, unitStates, originalNativeReceipts: prepared.baseline.handoff.originalNativeReceipts, originalFactRoots: prepared.baseline.handoff.originalFactRoots,
      newFactRoots: 0 as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, plannerUseAllowed: false as const }, withheld };
}
