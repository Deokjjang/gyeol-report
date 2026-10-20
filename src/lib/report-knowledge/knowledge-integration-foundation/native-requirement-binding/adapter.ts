import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { prepareNativeRequirementContext, createNativeRequirementCandidate, NATIVE_MONTH_PAIR_CONTRACT, type NativeRequirementCandidate } from "./contract";
/** Offline additive adapter. Historical v1 candidates and receipts are returned
 * intact; new Binder evaluations have an explicit, separate technical version. */
export async function adaptNativeRequirementBindings(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  const before = actualSemanticDigest([request, bridge.handoff, bridge.native]);
  const prepared = await prepareNativeRequirementContext(request, bridge, services);
  if (!prepared.ok) return prepared;
  const candidates: NativeRequirementCandidate[] = [], withheld = [];
  if (prepared.context && prepared.baseline.native.version === "annual-fortune-specialist-v1") {
    const row = prepared.baseline.native.receipts.find(r => r.originalResearchId === NATIVE_MONTH_PAIR_CONTRACT.originalId)!;
    const month = prepared.baseline.native.observation.months.find(m => m.civilMonth === 5)!;
    for (const segment of month.segments) {
      const r = await createNativeRequirementCandidate(prepared.context, row.candidateCatalogKey, segment.pointer);
      if (r.ok) candidates.push(r.candidate); else withheld.push({ segmentPointer: segment.pointer, reasons: r.reasons });
    }
    // The original source requires every segment, not the representative one.
    if (candidates.length !== month.segments.length) { candidates.length = 0; withheld.push({ segmentPointer: "month-5", reasons: ["ALL_ORIGINAL_SEGMENTS_REQUIRED"] }); }
  }
  const linked = new Set(candidates.flatMap(c => c.verifiedActualUnitIds));
  const unitStates = prepared.baseline.handoff.unitStates.map(u => ({ ...u, technicalState: linked.has(u.unitId) ? "TECHNICAL_REQUIREMENT_RESOLVED" as const : u.nativeState,
    technicalCandidateIds: candidates.filter(c => c.verifiedActualUnitIds.includes(u.unitId)).map(c => c.candidateId) }));
  if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) return { ok: false as const, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"], customerUseAllowed: false as const };
  return { ok: true as const, context: prepared.context, baseline: prepared.baseline,
    handoff: { version: "native-requirement-binding-handoff-v1" as const, fixtureId: request.graph.context.fixtureId, product: request.product,
      historicalCandidates: prepared.baseline.handoff.candidates, technicalCandidates: candidates, unitStates,
      originalNativeReceipts: prepared.baseline.originalReceiptsVerified, originalFactRoots: prepared.baseline.handoff.originalFactRoots,
      newFactRoots: 0 as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, plannerUseAllowed: false as const }, withheld };
}
