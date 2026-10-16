import { canonicalJson, hash } from "../sourceReader";
import { BINDING_HARD_GATES } from "../types";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, KnowledgeCandidate } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { CandidateEnvelope, EngineRegistration } from "./types";
import { isRecord } from "../normalization";

export const digest = (value: unknown) => hash(value === undefined ? "GLOBAL_UNDEFINED_V1" : canonicalJson(value));
export function scopedAddress(namespace: string, ...parts: readonly unknown[]): string { return namespace + ":" + digest(parts); }
export function normalizeCandidate(entry: EngineRegistration, request: KnowledgeBindingRequest, candidate: KnowledgeCandidate, receipt: KnowledgeBindingReceipt, foundation: ProductSpecialistFoundation, diagnosticRef: string, nativeDiagnostic: unknown = null): CandidateEnvelope {
  const r = candidate.requirement, fixtureId = request.graph.context.fixtureId;
  const d = isRecord(nativeDiagnostic) ? nativeDiagnostic : {};
  const contractFields = ["job", "recommendation", "avoid", "economic", "learning", "positiveSymbols", "fusion", "states", "questionFits", "enteredContext", "unenteredFacts", "mode", "originalRequirements", "sourceRequirements", "sourceGroups", "groupEvaluation", "predicates", "repair", "recall", "display", "introducedGroups", "precedingMeaningRefs", "introducedMeaningRequirements", "businessContext", "authorityContext", "economicCondition", "safeNegotiationCondition", "roleVersion", "declaredRoles", "personAAction", "personBAction", "additionalBusinessInfo", "originalConditions", "normalization", "boundary", "status", "parentChild", "context", "work", "axes", "semanticSignals"];
  const nativeContract = Object.fromEntries(Object.entries(d).filter(([key]) => contractFields.includes(key)));
  if (receipt.fixtureId !== fixtureId || receipt.product !== request.product || receipt.relationship !== request.relationship || receipt.candidateCatalogKey !== candidate.record.catalogKey || receipt.originalResearchId !== candidate.record.originalId) throw Error("ORIGINAL_RECEIPT_SCOPE_MISMATCH");
  if (receipt.allTwelveGateResults.length !== BINDING_HARD_GATES.length || receipt.allTwelveGateResults.some((g, i) => g.gate !== BINDING_HARD_GATES[i] || !["PASS", "FAIL", "UNKNOWN", "NOT_APPLICABLE", "REVIEW_REQUIRED"].includes(g.state))) throw Error("ORIGINAL_HARD_GATE_CONTRACT_MISMATCH");
  for (const [gate, required] of [["ACTUAL_OWNER", r.requiredOwner.length > 0], ["ACTUAL_DIRECTION", r.requiredDirection.length > 0], ["TIME_INTERSECTION", r.requiredTemporalScope !== null || request.requiredWindow !== undefined]] as const) {
    if (required && receipt.allTwelveGateResults.find(g => g.gate === gate)?.state === "NOT_APPLICABLE") throw Error("REQUIRED_GATE_INCORRECTLY_NOT_APPLICABLE:" + gate);
  }
  if (receipt.operatorApproved || receipt.customerApproved || receipt.finalDisposition === "CUSTOMER_ELIGIBLE" || candidate.provenance !== "ACTUAL_RESEARCH") throw Error("ACTUAL_APPROVAL_ISOLATION_REQUIRED");
  const links = (foundation.questions.byCatalog.get(candidate.record.catalogKey) ?? []).flatMap(id => foundation.questions.linksByQuestion.get(id) ?? []).filter(l => l.catalogKey === candidate.record.catalogKey && foundation.questions.byId.get(l.questionId)?.productKey === request.product && foundation.questions.byId.get(l.questionId)?.relationshipCategory === request.relationship);
  const questions = links.map(l => foundation.questions.byId.get(l.questionId)!);
  const ids = [request.product, request.relationship, questions.map(q => q.address.originalAddress).join("|"), links.map(l => l.questionId).join("|"), candidate.record.catalogKey, fixtureId];
  const nodes = new Map(request.graph.nodes.map(n => [n.id, n]));
  if (receipt.selectedActualEvidence.some(id => !nodes.has(id))) throw Error("ORIGINAL_EVIDENCE_NODE_MISSING");
  return {
    identity: {globalId: scopedAddress("global-candidate-address-v1", ...ids), originalResearchId: candidate.record.originalId, catalogKey: candidate.record.catalogKey, materialId: candidate.record.originalId, addressNamespace: ids},
    engine: entry.engineId, productScope: request.product, relationshipScope: request.relationship,
    fixtureScope: {fixtureId, graphVersion: request.graph.version, ownerIds: Object.values(request.graph.context.owners).sort()},
    originalMaterial: {locator: candidate.record.locator, recordHash: candidate.record.locator.recordSha256 ?? null, knowledgeKind: candidate.record.kind, provenance: candidate.provenance},
    nativeQuestionLinks: [], questionLinks: links, readerAddress: questions.map(q => q.address), sourceRequirements: r.sourceRequirements, sourceGroups: r.sourceGroups,
    originalLocators: r.originalSourceLocators, sourceHashes: r.originalSourceLocators.map(p => ({hash: p.recordSha256 ?? null, encoding: p.recordHashEncoding ?? "JSON_INSERTION"})),
    actualEvidenceWitnesses: receipt.selectedActualEvidence.map(id => scopedAddress("actual-node-address-v1", fixtureId, request.graph.version, id)),
    ownerRequirements: r.requiredOwner, directionRequirements: r.requiredDirection,
    temporalRequirements: {scope: r.requiredTemporalScope, requiredWindow: request.requiredWindow ?? null, originalWitnesses: receipt.temporalWitnesses, participantRequirements: r.requiredParticipants},
    actualContextRequirements: {contexts: r.requiredContext, states: r.requiredUserState, unresolved: r.unresolvedConditions, originalConditions: r.originalReviewState, nativeContextContract: Object.fromEntries(Object.entries(nativeContract).filter(([key]) => /Context|Condition|predicates|boundary|status|parentChild|context|work/.test(key)))},
    informationRoots: receipt.canonicalFactRoots,
    informationRootAddresses: request.graph.nodes.filter(n => n.fact.rootId && receipt.canonicalFactRoots.includes(n.fact.rootId)).map(n => ({address: scopedAddress("original-root-address-v1", fixtureId, request.graph.version, n.owner.fixtureOwnerId, n.producer, n.fact.rootId, n.temporal), originalRootId: n.fact.rootId!, ownerId: n.owner.fixtureOwnerId, producer: n.producer, temporal: n.temporal, rootType: n.fact.rootType, independentFact: n.fact.independentFact})),
    supportingAncestryRoots: [...new Set(receipt.selectedActualEvidence.flatMap(id => nodes.get(id)!.ancestry.rootIds))].sort(),
    semanticIdentity: receipt.meaningIdentity, claimIdentity: receipt.claimIdentity, counterexamples: r.counterexamples, prohibitions: r.prohibitions,
    semanticDescription: {normalizedCoreMeaning: r.coreMeaning, normalizedReaderQuestion: r.readerQuestion, nativeCoreMeaning: d.coreMeaning ?? null, nativeReaderQuestion: d.readerQuestion ?? null},
    nativeSpecialistContract: {diagnosticRef, sourceFields: nativeContract},
    specialistPolicies: {registryRef: entry.engineId, diagnosticRef, originalRequirementHash: digest(r)},
    originalBinderReceipt: {key: scopedAddress("original-receipt-address-v1", entry.engineId, fixtureId, receipt.receiptId, receipt.candidateCatalogKey), hash: digest(receipt)},
    normalizedGateResults: receipt.allTwelveGateResults, withholdReasons: receipt.blockingReasons.map(b => b.code), approvalState: "CUSTOMER_APPROVAL_REQUIRED",
    displayRequirements: {requiresIntroducedLedger: r.requiresIntroducedLedger, introducedIds: r.introducedIds, nativeContract: Object.fromEntries(Object.entries(nativeContract).filter(([key]) => /repair|recall|display|introduced|preceding|mode/.test(key))), actualLedger: request.introducedLedger ?? [], actualDisplayLedgerIssued: false},
    plannerReadiness: {schemaReady: true, customerEligible: false, plannerAssignable: false, customerPublished: false}
  };
}

// Validate against the authentic native invocation, never against caller-supplied
// approval or a reconstructed source. Exact states and identities are immutable.
export function validateEnvelope(envelope: CandidateEnvelope, expected: CandidateEnvelope, receipt: KnowledgeBindingReceipt): void {
  if (digest(receipt) !== expected.originalBinderReceipt.hash) throw Error("ORIGINAL_RECEIPT_CHANGED");
  if (digest(envelope) !== digest(expected)) throw Error("GLOBAL_ENVELOPE_CONTRACT_CHANGED");
  if (envelope.plannerReadiness.customerEligible || envelope.plannerReadiness.plannerAssignable || envelope.plannerReadiness.customerPublished) throw Error("REAL_RESEARCH_ACTIVATION_BLOCKED");
}
