import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { prepareComparisonContext, evaluateComparisonMonth, COMPARISON_CONTRACTS, type ComparisonCandidate } from "./contract";
export async function adaptAnnualTemporalComparisons(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), prepared = await prepareComparisonContext(request, bridge, services);
  if (!prepared.ok) return prepared;
  const candidates: ComparisonCandidate[] = [], observations = [], withheld = [];
  if (prepared.context) for (const month of [3, 9] as const) {
    const original = prepared.baseline.baseline.baseline.baseline.native.receipts.find(r => r.originalResearchId === COMPARISON_CONTRACTS[month].originalId)!;
    const result = await evaluateComparisonMonth(prepared.context, month, original.candidateCatalogKey);
    if (!result.ok) withheld.push({ month, reasons: result.reasons });
    else { observations.push({ month, ...result.observation }); if (result.candidate) candidates.push(result.candidate); else withheld.push({ month, reasons: ["EVERY_REQUIRED_COMPARISON_MUST_BE_VERIFIED"], comparisons: result.observation.comparisonWitnesses.filter(w => w.result === "WITHHELD") }); }
  }
  if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) return { ok: false as const, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"], customerUseAllowed: false as const };
  return { ok: true as const, context: prepared.context, baseline: prepared.baseline, observations, withheld,
    handoff: { version: "annual-temporal-comparison-handoff-v1" as const, fixtureId: request.graph.context.fixtureId,
      historicalMajorCandidates: prepared.baseline.handoff.historicalMajorCandidates, historicalAnnualCandidates: [...prepared.baseline.handoff.historicalMayCandidates, ...prepared.baseline.handoff.historicalMatrixCandidates, ...prepared.baseline.handoff.octoberCandidates],
      comparisonCandidates: candidates, unitStates: prepared.baseline.handoff.unitStates, originalNativeReceipts: prepared.baseline.handoff.originalNativeReceipts, originalFactRoots: prepared.baseline.handoff.originalFactRoots,
      newFactRoots: 0 as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, plannerUseAllowed: false as const } };
}
