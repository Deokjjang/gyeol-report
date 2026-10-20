import { bindingCoverage } from "../knowledge-binder/engine";
import { evidenceHash } from "../actual-evidence-graph/graph";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import type { CandidateEnvelope, EngineRegistration, InvocationLedger, NativeInvocation } from "./types";
import { GlobalSpecialistRegistry } from "./engineRegistry";
import { GlobalCandidateIdentityIndex } from "./identityIndex";
import { digest, normalizeCandidate, scopedAddress, validateEnvelope } from "./candidateEnvelope";
import { compilePlannerHandoff } from "./plannerHandoff";
import { globalWithholdCategory } from "./withholdRegistry";
import { isRecord } from "../normalization";
import { runNegativeAudit } from "./negativeAudit";
import { auditNodeScope } from "./scopeValidation";
import { assertFoundationScope, auditFoundationCacheIsolation } from "./foundationScope";

export class GlobalSpecialistAuditCoordinator {
  readonly identity = new GlobalCandidateIdentityIndex();
  readonly invocations: InvocationLedger[] = [];
  readonly receipts = new Map<string, KnowledgeBindingReceipt>();
  readonly baselines = new Map<string, readonly KnowledgeBindingReceipt[]>();
  readonly provenance = new Map<string, unknown>();
  readonly witnesses = new Map<string, unknown>();
  readonly scopeAudits = new Map<string, unknown>();
  readonly reasons = new Map<string, {category: string; occurrences: number; candidateAddresses: Set<string>; original: unknown[]}>();
  readonly sourceImpact = new Map<string, Set<string>>();
  readonly temporal: unknown[] = [];
  readonly diagnosticIndex = new Map<string, unknown>();
  readonly policyResults = new Map<string, unknown>();
  readonly negativeAudits = new Map<string, unknown>();
  readonly semanticAudits: unknown[] = [];
  readonly pending: Promise<unknown>[] = [];
  readonly graphScopes = new Set<string>();
  private readonly invokers = new Map<string, ReturnType<EngineRegistration["invoke"]>>();
  private readonly requiredAncestry = new Map<string, readonly string[]>();
  private foundation: ProductSpecialistFoundation | null = null;
  get preparedFoundation(): ProductSpecialistFoundation {if (!this.foundation) throw Error("FOUNDATION_NOT_PREPARED"); return this.foundation;}
  constructor(readonly registry: GlobalSpecialistRegistry, readonly emitCase: (entry: EngineRegistration, fixtureId: string, envelopes: CandidateEnvelope[], receipts: KnowledgeBindingReceipt[], semantic: unknown, nativeViews: Record<string, unknown>) => void) {}

  capture(foundation: ProductSpecialistFoundation, request: KnowledgeBindingRequest, prepared: SpecialistFoundationResult): InvocationLedger {
    assertFoundationScope(request, prepared);
    const entry = this.registry.route(request); this.registry.assertRequest(entry, request);
    if (this.foundation && this.foundation !== foundation) throw Error("SHARED_FOUNDATION_REPLACED"); this.foundation = foundation;
    const scope = JSON.stringify([request.graph.context.fixtureId, request.product, request.relationship]);
    if (this.graphScopes.has(scope)) throw Error("GRAPH_SCOPE_REPLAY"); this.graphScopes.add(scope);
    const inputHash = evidenceHash([request.graph, request.graphInput.evidence]);
    const preparedHash = digest(prepared);
    let invoke = this.invokers.get(entry.engineId);
    if (!invoke) {invoke = entry.invoke(foundation); this.invokers.set(entry.engineId, invoke);}
    const native = invoke(request, prepared);
    entry.evidenceRequirementKinds = [...new Set([...native.candidates.values()].flatMap(c => c.requirement.sourceRequirements.flatMap(s => s.selector?.kinds ?? [])))].sort();
    if (!this.invocations.some(l => l.engineId === entry.engineId)) entry.readerContract = {originalManifestContract: entry.readerContract, foundationProductContract: foundation.registry.products.filter(p => p.productKey === request.product && p.relationship === request.relationship)};
    if (native.errors.length || native.version !== entry.engineVersion || digest(native.baseline) !== digest(prepared.after)) throw Error("NATIVE_ENGINE_RESULT_INVALID:" + entry.engineId + ":" + native.errors.join(","));
    const receiptHashes = native.receipts.map(digest);
    if (!this.negativeAudits.has(entry.engineId)) {
      for (const wrong of [{...request, product: request.product === "major_fortune" ? "annual_fortune" as const : "major_fortune" as const}, {...request, relationship: request.relationship === "friendship" ? "marriage" as const : "friendship" as const}]) {
        let rejected = false; try {invoke(wrong, prepared);} catch {rejected = true;}
        if (!rejected) throw Error("NATIVE_ENGINE_WRONG_SCOPE_ACCEPTED:" + entry.engineId);
      }
    }
    this.semanticAudits.push({engineId: entry.engineId, fixtureId: request.graph.context.fixtureId, original: native.semantic});
    this.baselines.set(scope, native.baseline);
    this.pending.push(native.finish());
    const diagnostics = this.indexDiagnostics(entry, request, native);
    const diagnosticValues = new Map(native.diagnostics.flatMap(d => isRecord(d) && typeof d.catalogKey === "string" ? [[d.catalogKey, d] as const] : []));
    const envelopes = native.receipts.map(receipt => {
      const candidate = native.candidates.get(receipt.candidateCatalogKey);
      if (!candidate) throw Error("NATIVE_CANDIDATE_NOT_FOUND");
      const diagnosticRef = diagnostics.get(receipt.candidateCatalogKey) ?? "NO_SPECIALIST_MATERIAL_DIAGNOSTIC";
      const e = normalizeCandidate(entry, request, candidate, receipt, foundation, diagnosticRef, diagnosticValues.get(receipt.candidateCatalogKey));
      e.nativeQuestionLinks = native.nativeQuestionLinks.filter(link => link.catalogKey === receipt.candidateCatalogKey);
      const originalHash = digest(receipt); validateEnvelope(e, e, receipt);
      if (!this.negativeAudits.has(entry.engineId)) this.negativeAudits.set(entry.engineId, {...runNegativeAudit(this.registry, entry, request, e, receipt), foundationCacheResults: auditFoundationCacheIsolation(request, prepared)});
      if (this.receipts.has(e.originalBinderReceipt.key)) throw Error("RECEIPT_ADDRESS_COLLISION");
      this.receipts.set(e.originalBinderReceipt.key, receipt); this.identity.register(e);
      if (digest(receipt) !== originalHash) throw Error("NORMALIZATION_MUTATED_RECEIPT");
      const key = candidate.record.catalogKey;
      if (!this.provenance.has(key)) this.provenance.set(key, {record: candidate.record, sourceCheck: candidate.sourceCheck, sourceHashEncoding: candidate.record.locator.recordHashEncoding ?? "JSON_INSERTION", originalRequirement: candidate.requirement, originalRequirementHash: digest(candidate.requirement), crossProductUseIsNotFactIssuance: true});
      if (!this.requiredAncestry.has(key)) this.requiredAncestry.set(key, foundation.catalog.sourceAncestors(key));
      for (const source of [key, ...this.requiredAncestry.get(key)!, ...candidate.requirement.sourceRequirements.flatMap(s => s.sourceCatalogKeys)]) {
        const ids = this.sourceImpact.get(source) ?? new Set<string>(); ids.add(e.identity.globalId); this.sourceImpact.set(source, ids);
      }
      for (const b of receipt.blockingReasons) {
        const row = this.reasons.get(b.code) ?? {category: globalWithholdCategory(b.code), occurrences: 0, candidateAddresses: new Set<string>(), original: []};
        row.occurrences++; row.candidateAddresses.add(e.identity.globalId); row.original.push({candidate: e.identity.globalId, ...b}); this.reasons.set(b.code, row);
      }
      return e;
    });
    this.captureWitnesses(request, native.receipts);
    this.policyResults.set(entry.engineId, native.policies);
    if (native.temporal) this.temporal.push({engineId: entry.engineId, fixtureId: request.graph.context.fixtureId, original: native.temporal});
    if (receiptHashes.some((h, i) => h !== digest(native.receipts[i])) || preparedHash !== digest(prepared) || inputHash !== evidenceHash([request.graph, request.graphInput.evidence])) throw Error("GLOBAL_NORMALIZATION_MUTATED_NATIVE_INPUT");
    const ledger: InvocationLedger = {engineId: entry.engineId, fixtureId: request.graph.context.fixtureId, product: request.product, relationship: request.relationship, before: bindingCoverage(native.baseline), after: bindingCoverage(native.receipts), receiptHashes, graphHash: inputHash, graphStatus: request.graph.validation.status, nativeApprovalObservations: native.approvalObservations, errors: native.errors};
    this.invocations.push(ledger); this.emitCase(entry, ledger.fixtureId, envelopes, native.receipts, native.semantic, native.nativeResultViews);
    return ledger;
  }
  private indexDiagnostics(entry: EngineRegistration, request: KnowledgeBindingRequest, native: NativeInvocation) {
    const byKey = new Map<string, string>();
    for (const d of native.diagnostics) {
      if (!isRecord(d) || typeof d.catalogKey !== "string") throw Error("NATIVE_DIAGNOSTIC_ID_REQUIRED");
      const id = scopedAddress("native-diagnostic-address-v1", entry.engineId, request.graph.context.fixtureId, d.catalogKey);
      // Preserve the exact native diagnostic hash and every field hash. Source
      // locators plus invocation replay recover the original; bulky ancestry is
      // not duplicated once per material in global artifacts.
      const fieldHashes = Object.fromEntries(Object.entries(d).map(([k, v]) => [k, digest(v)]));
      const review = Object.fromEntries(Object.entries(d).filter(([k]) => ["address", "mode", "meaningIdentity", "claimIdentity", "meaningReviewRequired", "blockers", "recall", "display", "introducedGroups", "originalConditions", "normalization", "status", "boundary"].includes(k)));
      this.diagnosticIndex.set(id, {engineId: entry.engineId, fixtureId: request.graph.context.fixtureId, catalogKey: d.catalogKey, originalDiagnosticHash: digest(d), fieldHashes, review}); byKey.set(d.catalogKey, id);
    }
    return byKey;
  }
  private captureWitnesses(request: KnowledgeBindingRequest, receipts: readonly KnowledgeBindingReceipt[]) {
    const nodes = new Map(request.graph.nodes.map(n => [n.id, n]));
    const selected = new Set(receipts.flatMap(r => r.selectedActualEvidence)); const pending = [...selected];
    while (pending.length) {const n = nodes.get(pending.pop()!); if (!n) continue; for (const parent of n.ancestry.parentIds) if (!selected.has(parent)) {selected.add(parent); pending.push(parent);}}
    for (const id of selected) {
      const n = nodes.get(id); if (!n) continue;
      const address = scopedAddress("actual-node-address-v1", request.graph.context.fixtureId, request.graph.version, id);
      const {value, ...metadata} = n;
      const valueIdentity = isRecord(value) ? Object.fromEntries(Object.entries(value).filter(([k]) => ["god", "kind", "axis", "ruleId", "sourceDomain", "classification", "sourceType", "targetType", "receivedTenGod", "score", "element"].includes(k))) : null;
      this.witnesses.set(address, {globalAddress: address, fixtureId: request.graph.context.fixtureId, graphVersion: request.graph.version, originalNode: metadata, valueHash: digest(value), valueIdentity, personalValueExported: false, newFactIssued: false});
      this.scopeAudits.set(address, auditNodeScope(request, n, nodes));
      for (const domain of n.ancestry.domains) for (const candidate of this.identity.lookup("ActualEvidenceId", address)) this.identity.add("Domain", domain, candidate);
      for (const candidate of this.identity.lookup("ActualEvidenceId", address)) this.identity.add("TemporalScope", n.temporal?.scope ?? "UNKNOWN", candidate);
    }
  }
  handoff() { return [...this.identity.candidates.values()].map(compilePlannerHandoff); }
  reviewQueue() {
    return [...this.identity.candidates.values()].map(e => {
      const gates = e.normalizedGateResults.filter(g => g.state !== "PASS" && g.state !== "NOT_APPLICABLE");
      const technical = gates.find(g => g.gate === "SOURCE_INTEGRITY"), producer = gates.find(g => g.gate === "PRODUCER_SUPPORT"), context = gates.find(g => g.gate === "ACTUAL_USER_STATE");
      const order = technical ? 0 : e.actualEvidenceWitnesses.length ? 1 : producer?.state === "FAIL" ? 2 : context ? 3 : 4;
      return {candidate: e.identity.globalId, originalMaterial: e.originalMaterial, catalogKey: e.identity.catalogKey, originalResearchId: e.identity.originalResearchId, product: e.productScope, relationship: e.relationshipScope, questions: e.questionLinks, addresses: e.readerAddress, sourceRoots: e.supportingAncestryRoots, requiredContext: e.actualContextRequirements, counterexamples: e.counterexamples, meaning: e.semanticIdentity, originalMeaning: e.semanticDescription, claim: e.claimIdentity, nativeDiagnostic: e.specialistPolicies.diagnosticRef, nativeHardConstraints: {diagnosticRef: e.nativeSpecialistContract.diagnosticRef, sourceFieldsHash: digest(e.nativeSpecialistContract.sourceFields)}, originalReceipt: e.originalBinderReceipt, reviewStates: gates.map(g => ({gate: g.gate, state: g.state, nextAction: g.nextAction})), researchReviewGroup: scopedAddress("research-review-group-v1", e.engine, e.productScope, e.relationshipScope, e.identity.catalogKey, e.readerAddress), actualApplicationReview: e.identity.globalId, operatorPriorityClass: order, requiredOperatorDecision: gates.map(g => g.nextAction).filter(Boolean), customerRanking: null, customerApproved: false};
    }).sort((a, b) => a.operatorPriorityClass - b.operatorPriorityClass || a.researchReviewGroup.localeCompare(b.researchReviewGroup, "en") || a.candidate.localeCompare(b.candidate, "en"));
  }
}
