import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import { prepareAugustContext, evaluateAugust } from "./contract";
export async function adaptAnnualAugustRelations(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }) {
  const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), prepared = await prepareAugustContext(request, bridge, services);
  if (!prepared.ok) return prepared;
  const result = prepared.context ? await evaluateAugust(prepared.context) : null;
  if (result && !result.ok) return result;
  if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) return { ok: false as const, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"], customerUseAllowed: false as const };
  return { ok: true as const, context: prepared.context, baseline: prepared.baseline, observation: result?.observation ?? null,
    withheld: result ? result.observation.segmentResults.filter(s => s.state === "WITHHELD").map(s => ({ segmentPointer: s.segmentPointer, reasons: s.reasons })) : [],
    handoff: { version: "annual-august-relation-handoff-v1" as const, fixtureId: request.graph.context.fixtureId, historicalMajorCandidates: prepared.baseline.handoff.historicalMajorCandidates,
      historicalAnnualCandidates: [...prepared.baseline.handoff.historicalAnnualCandidates, ...prepared.baseline.handoff.februaryCandidates], augustCandidates: result?.candidate ? [result.candidate] : [],
      unitStates: prepared.baseline.handoff.unitStates, originalNativeReceipts: prepared.baseline.handoff.originalNativeReceipts, originalFactRoots: prepared.baseline.handoff.originalFactRoots,
      newFactRoots: 0 as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, plannerUseAllowed: false as const } };
}
