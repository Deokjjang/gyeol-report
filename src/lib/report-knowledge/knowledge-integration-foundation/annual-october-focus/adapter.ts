import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { prepareOctoberContext, createOctoberCandidate, OCTOBER_FOCUS_CONTRACT, type OctoberCandidate } from "./contract";
export async function adaptAnnualOctoberFocus(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), prepared = await prepareOctoberContext(request, bridge, services);
  if (!prepared.ok) return prepared;
  const candidates: OctoberCandidate[] = [], withheld = [];
  if (prepared.context) {
    const original = prepared.baseline.baseline.baseline.native.receipts.find(r => r.originalResearchId === OCTOBER_FOCUS_CONTRACT.originalId)!;
    const result = await createOctoberCandidate(prepared.context, original.candidateCatalogKey);
    if (result.ok) candidates.push(result.candidate); else withheld.push({ month: 10, state: "WITHHELD_UNVERIFIED_TIME" as const, reasons: result.reasons });
  }
  if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) return { ok: false as const, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"], customerUseAllowed: false as const };
  return { ok: true as const, context: prepared.context, baseline: prepared.baseline,
    handoff: { version: "annual-october-focus-handoff-v1" as const, fixtureId: request.graph.context.fixtureId,
      historicalMajorCandidates: prepared.baseline.handoff.historicalMajorCandidates, historicalMayCandidates: prepared.baseline.handoff.historicalMayCandidates,
      historicalMatrixCandidates: prepared.baseline.handoff.newMatrixCandidates, octoberCandidates: candidates,
      unitStates: prepared.baseline.handoff.unitStates, originalNativeReceipts: prepared.baseline.handoff.originalNativeReceipts, originalFactRoots: prepared.baseline.handoff.originalFactRoots,
      newFactRoots: 0 as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, plannerUseAllowed: false as const }, withheld };
}
