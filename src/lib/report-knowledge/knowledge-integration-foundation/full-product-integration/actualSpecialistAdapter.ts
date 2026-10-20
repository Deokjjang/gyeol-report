import { runActualCalculationFixture } from "./actualCalculationAdapter";
import { prepareActualSpecialistClaimContext, createActualSpecialistCandidate, type ActualCalculationRun, type ActualSpecialistClaimCandidate } from "../actual-specialist-claim-contract/contract";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
/** Existing real fact adapter -> original diagnose -> unchanged native receipts.
 * Diagnostic observations never stand in for native selectedActualEvidence. */
export async function adaptActualSpecialistClaims(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  const originalInputHash = actualSemanticDigest([request, bridge.handoff, bridge.native]);
  const prepared = await prepareActualSpecialistClaimContext(request, bridge, services);
  if (!prepared.ok) return prepared;
  const units = prepared.verifiedUnits;
  const candidates: ActualSpecialistClaimCandidate[] = [], withheld = [], audit = [];
  for (const receipt of prepared.native.receipts) {
    const selectedUnits = units.filter(u => receipt.selectedActualEvidence.includes(u.originalEvidenceNodeId));
    audit.push({ originalCatalogKey: receipt.candidateCatalogKey, originalResearchId: receipt.originalResearchId, originalNativeReceiptId: receipt.receiptId,
      originalNativeReceiptHash: actualSemanticDigest(receipt), selectedEvidence: receipt.selectedActualEvidence,
      matchingEvidence: [...new Set(receipt.matches.flatMap(m => m.matchedActualEvidence.map(n => n.nodeId)))],
      linkedUnitIds: selectedUnits.map(u => u.unitId), allTwelveGateResults: receipt.allTwelveGateResults, blockingReasons: receipt.blockingReasons });
    for (const unit of selectedUnits) {
      const result = await createActualSpecialistCandidate(prepared.context, receipt.candidateCatalogKey, unit.unitId);
      if (result.ok) candidates.push(result.candidate); else withheld.push({ catalogKey: receipt.candidateCatalogKey, unitId: unit.unitId, reasons: result.reasons });
    }
  }
  const unitStates = units.map(u => {
    const links = candidates.filter(c => c.verifiedActualUnitIds.includes(u.unitId));
    return { unitId: u.unitId, factState: "FACT_ONLY_VERIFIED" as const, nativeState: links.length ? "SPECIALIST_CANDIDATE_LINKED" as const : "UNMATCHED_NATIVE_EVIDENCE" as const,
      originalNodeId: u.originalEvidenceNodeId, originalFactRoots: u.canonicalFactRoots, candidateIds: links.map(c => c.candidateId), reasons: links.length ? [] : ["UNMATCHED_NATIVE_EVIDENCE"] };
  });
  const roots = [...new Set(units.flatMap(u => u.canonicalFactRoots))].sort();
  const handoff = { version: "actual-specialist-claim-handoff-v1" as const, fixtureId: request.graph.context.fixtureId, product: request.product,
    candidates, unitStates, nativeReceiptAudit: audit, originalFactRoots: roots, newFactRoots: 0 as const,
    repeatedRootGroups: roots.map(root => ({ root, unitIds: units.filter(u => u.canonicalFactRoots.includes(root)).map(u => u.unitId), independentFactsAdded: 0 as const })).filter(g => g.unitIds.length > 1),
    meaningReuseState: "ORIGINAL_IDENTITIES_ONLY_NO_ASSIGNMENTS" as const,
    missingMeaningIdentityCandidateIds: candidates.filter(c => c.originalMeaningIdentity === null).map(c => c.candidateId),
    potentialExactTextDuplicates: candidates.flatMap((a, i) => candidates.slice(i + 1).filter(b => a.originalResearchId !== b.originalResearchId && a.conditionalInterpretation.originalText !== null && a.conditionalInterpretation.originalText === b.conditionalInterpretation.originalText).map(b => ({ candidateIds: [a.candidateId, b.candidateId], state: "TEXT_EQUALITY_IS_NOT_MEANING_EQUIVALENCE" as const }))),
    customerClaims: 0 as const, customerReaderBridges: 0 as const, customerApprovals: 0 as const, plannerAssignments: [] as const, plannerUseAllowed: false as const };
  if (originalInputHash !== actualSemanticDigest([request, bridge.handoff, bridge.native])) return { ok: false as const, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"], customerUseAllowed: false as const };
  return { ok: true as const, context: prepared.context, native: prepared.native, originalReceiptsVerified: prepared.originalReceiptsVerified, handoff, withheld };
}
export async function runActualSpecialistFixture(root: string, selection: { product: "major" | "annual"; id: string }, services: Services) {
  const facts = await runActualCalculationFixture(root, selection, services);
  if (!facts.ok) return facts;
  const result = await adaptActualSpecialistClaims(facts.request, facts, services);
  return { ...result, facts, request: facts.request };
}
