import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync, gunzipSync } from "node:zlib";
import { canonicalJson, hash } from "../sourceReader";
import { BINDING_HARD_GATES } from "../types";
import { bindingCoverage } from "../knowledge-binder/engine";
import type { GlobalSpecialistAuditCoordinator } from "./foundationCoordinator";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { CandidateEnvelope } from "./types";
import { digest } from "./candidateEnvelope";
import { SHARD_FORMAT, GZIP_FORMAT } from "./artifactReader";
import { isRecord } from "../normalization";

export class DeterministicArtifactWriter {
  readonly files: Record<string, string> = {};
  constructor(readonly out: string, readonly forbidden: Set<string>) {mkdirSync(out, {recursive: true});}
  write(name: string, value: unknown) {
    if (!/^[a-z0-9-]+\.json$/.test(name)) throw Error("UNSAFE_ARTIFACT_NAME");
    let text = JSON.stringify(value, null, 2) + "\n";
    if (Buffer.byteLength(text) >= 49 * 1024 * 1024) {const logicalHash = hash(text); text = ""; this.writeShards(name, value, logicalHash); return;}
    for (const term of this.forbidden) if (term.length > 1 && text.includes(term)) throw Error("PRIVATE_INPUT_IN_GLOBAL_ARTIFACT:" + name);
    if (/(?:access_token|service_role|TOSS_SECRET|SUPABASE_SERVICE_ROLE)/i.test(text)) throw Error("SECRET_IN_GLOBAL_ARTIFACT");
    if (Buffer.byteLength(text) >= 1024 * 1024) {
      const payloadFile = name + ".gz", compressed = gzipSync(text, {level: 9});
      const payloadHash = createHash("sha256").update(compressed).digest("hex");
      writeFileSync(this.out + "/" + payloadFile, compressed); this.files[payloadFile] = payloadHash;
      this.write(name, {format: GZIP_FORMAT, payloadFile, payloadHash, logicalJsonHash: hash(text), uncompressedBytes: Buffer.byteLength(text)});
      return;
    }
    writeFileSync(this.out + "/" + name, text); this.files[name] = hash(text);
  }
  private writeShards(name: string, value: unknown, logicalJsonHash: string) {
    const target = 16 * 1024 * 1024, parts: {file: string; sha256: string; kind: "CHUNK" | "ITEM" | "FIELD"; key?: string}[] = [];
    let ordinal = 0;
    const part = (value: unknown, kind: "CHUNK" | "ITEM" | "FIELD", key?: string) => {
      const file = name.replace(/\.json$/, "") + "-part-" + String(++ordinal).padStart(4, "0") + ".json";
      this.write(file, value); parts.push({file, sha256: this.files[file], kind, ...(key === undefined ? {} : {key})});
    };
    if (Array.isArray(value)) {
      let chunk: unknown[] = [], bytes = 0;
      const flush = () => {if (chunk.length) part(chunk, "CHUNK"); chunk = []; bytes = 0;};
      for (const item of value) {
        const size = Buffer.byteLength(JSON.stringify(item, null, 2) ?? "null");
        if (size > target) {flush(); part(item, "ITEM");}
        else {if (bytes + size > target) flush(); chunk.push(item); bytes += size;}
      }
      flush(); this.write(name, {format: SHARD_FORMAT, shape: "ARRAY", entries: value.length, logicalJsonHash, parts});
    } else if (isRecord(value)) {
      let chunk: [string, unknown][] = [], bytes = 0;
      const keys: string[] = [];
      const flush = () => {if (chunk.length) part(Object.fromEntries(chunk), "CHUNK"); chunk = []; bytes = 0;};
      for (const [key, field] of Object.entries(value)) {
        const encoded = JSON.stringify(field, null, 2); if (encoded === undefined) continue; keys.push(key);
        const size = Buffer.byteLength(encoded) + Buffer.byteLength(key) + 8;
        if (size > target) {flush(); part(field, "FIELD", key);}
        else {if (bytes + size > target) flush(); chunk.push([key, field]); bytes += size;}
      }
      flush(); this.write(name, {format: SHARD_FORMAT, shape: "OBJECT", keys, logicalJsonHash, parts});
    } else throw Error("GLOBAL_ARTIFACT_SCALAR_TOO_LARGE");
  }
  finish() {
    for (const [name, expected] of Object.entries(this.files)) {
      const bytes = readFileSync(this.out + "/" + name);
      if (createHash("sha256").update(bytes).digest("hex") !== expected) throw Error("OUTPUT_CHANGED_AFTER_CAPTURE:" + name);
      const text = (name.endsWith(".json.gz") ? gunzipSync(bytes, {maxOutputLength: 49 * 1024 * 1024}) : bytes).toString("utf8");
      for (const term of this.forbidden) if (term.length > 1 && text.includes(term)) throw Error("PRIVATE_INPUT_IN_FINAL_GLOBAL_OUTPUT:" + name);
    }
    this.write("global-deterministic-validation.json", {version: "global-specialist-artifacts-v1", files: {...this.files}, performanceLogs: "EXTERNAL_ONLY", canonicalFactRootsIssued: 0});
  }
}
export function validateIntegrationCohorts(coordinator: GlobalSpecialistAuditCoordinator, expected: ReadonlyMap<string, {before: unknown; after: unknown}>) {
  const ledger = coordinator.invocations, envelopes = [...coordinator.identity.candidates.values()], receipts = [...coordinator.receipts.values()];
  const entries = [...coordinator.registry.byEngine.values()];
  const matrix = entries.map(entry => {
    const rows = ledger.filter(l => l.engineId === entry.engineId);
    const engineEnvelopes = envelopes.filter(e => e.engine === entry.engineId);
    const afterReceipts = engineEnvelopes.map(e => coordinator.receipts.get(e.originalBinderReceipt.key)!);
    const after = bindingCoverage(afterReceipts);
    const beforeReceipts = rows.flatMap(row => [...coordinator.baselines.get(JSON.stringify([row.fixtureId, row.product, row.relationship]))!]);
    const before = bindingCoverage(beforeReceipts);
    const sum = (side: "before" | "after", key: "candidateOccurrences" | "sourceMatchOccurrences" | "actualEvidenceMatchOccurrences" | "structurallyMatched") => rows.reduce((n, row) => n + row[side][key], 0);
    const totals = {before: Object.fromEntries(["candidateOccurrences", "sourceMatchOccurrences", "actualEvidenceMatchOccurrences", "structurallyMatched"].map(key => [key, sum("before", key as Parameters<typeof sum>[1])])), after: Object.fromEntries(["candidateOccurrences", "sourceMatchOccurrences", "actualEvidenceMatchOccurrences", "structurallyMatched"].map(key => [key, sum("after", key as Parameters<typeof sum>[1])]))};
    const original = expected.get(entry.engineId);
    if (!original) throw Error("ORIGINAL_MANIFEST_MISSING");
    // Major's original manifest adds its explicit FACTS_MATCHED stage count.
    // Preserve that native extension rather than dropping it or comparing unlike schemas.
    const withNativeExtension = (coverage: typeof before, rows: typeof beforeReceipts, original: unknown) => ({...coverage, ...(Object.prototype.hasOwnProperty.call(original, "factsMatched") ? {factsMatched: rows.filter(r => r.stages.includes("FACTS_MATCHED")).length} : {})});
    if (canonicalJson(withNativeExtension(before, beforeReceipts, original.before)) !== canonicalJson(original.before) || canonicalJson(withNativeExtension(after, afterReceipts, original.after)) !== canonicalJson(original.after)) throw Error("ORIGINAL_FULL_COVERAGE_CHANGED:" + entry.engineId);
    for (const side of ["before", "after"] as const) for (const [key, value] of Object.entries(totals[side])) if ((original[side] as Record<string, unknown>)[key] !== value) throw Error("ORIGINAL_MANIFEST_COHORT_CHANGED:" + entry.engineId + ":" + side + ":" + key);
    if (rows.length !== entry.fixtureIds.length || new Set(rows.map(row => row.fixtureId)).size !== entry.fixtureIds.length) throw Error("ENGINE_CASE_COVERAGE_MISMATCH");
    return {engineId: entry.engineId, graphCases: rows.length, ...totals, originalManifest: entry.originalManifestLocator, originalManifestHash: entry.originalManifestHash, actualAfterCoverage: after};
  });
  const totals = (side: "before" | "after", key: string) => matrix.reduce((n, row) => n + (row[side][key] ?? 0), 0);
  const required = {graphCases: 27, evaluations: 5073, sourceBefore: 10536, sourceAfter: 11170, evidenceBefore: 917, evidenceAfter: 1489, structuralBefore: 81, structuralAfter: 81};
  const actual = {graphCases: ledger.length, evaluations: envelopes.length, sourceBefore: totals("before", "sourceMatchOccurrences"), sourceAfter: totals("after", "sourceMatchOccurrences"), evidenceBefore: totals("before", "actualEvidenceMatchOccurrences"), evidenceAfter: totals("after", "actualEvidenceMatchOccurrences"), structuralBefore: totals("before", "structurallyMatched"), structuralAfter: totals("after", "structurallyMatched")};
  if (canonicalJson(required) !== canonicalJson(actual) || entries.length !== 12 || ledger.some(l => l.graphStatus !== "PARTIAL") || receipts.some(r => r.customerApproved || r.operatorApproved)) throw Error("GLOBAL_BASELINE_OR_APPROVAL_CHANGED");
  return {matrix, actual};
}
export function writeIntegrationArtifacts(writer: DeterministicArtifactWriter, coordinator: GlobalSpecialistAuditCoordinator, foundation: ProductSpecialistFoundation, expected: ReadonlyMap<string, {before: unknown; after: unknown}>, sourceVerification: readonly Record<string, unknown>[], domainDecisions: readonly Record<string, unknown>[], companions: Record<string, unknown>) {
  const ledger = coordinator.invocations, envelopes = [...coordinator.identity.candidates.values()], receipts = [...coordinator.receipts.values()];
  const entries = [...coordinator.registry.byEngine.values()];
  const {matrix, actual} = validateIntegrationCohorts(coordinator, expected);
  const sourceImpact = Object.fromEntries([...coordinator.sourceImpact].sort(([a], [b]) => a.localeCompare(b, "en")).map(([k, ids]) => [k, [...ids].sort()]));
  const reasonRows = [...coordinator.reasons].map(([originalCode, row]) => ({originalCode, globalCategory: row.category, occurrences: row.occurrences, distinctAffectedCandidates: row.candidateAddresses.size, affectedCandidates: [...row.candidateAddresses].sort(), originalBlockingReasons: row.original}));
  const pending = sourceVerification.map((source, i) => ({originalReference: {file: "docs/validation/v4-knowledge-source-verification-01/source-verification-receipts.json", pointer: "/" + i, traceHash: digest(source), traceHashEncoding: "JSON_CANONICAL", originalSourceHash: source.expectedHash, originalSourceHashAlgorithm: source.hashAlgorithm}, referenceKey: source.referenceKey, affectedCatalogKey: source.affectedCatalogKey, originalLocator: source.originalLocator, matchedLocator: source.matchedLocator, resolutionState: source.resolutionState, sourceReviewState: source.sourceReviewState, blockingState: source.blockingState, blockingReasons: source.blockingReasons, followupAction: source.followupAction, affectedCandidates: typeof source.affectedCatalogKey === "string" ? sourceImpact[source.affectedCatalogKey] ?? [] : [], technicalRecoveryIsCustomerApproval: false}));
  const domains = domainDecisions.map((decision, i) => ({originalReference: {file: "docs/validation/v4-knowledge-semantic-domain-verification-01/semantic-domain-decisions.json", pointer: "/" + i, traceHash: digest(decision), traceHashEncoding: "JSON_CANONICAL", originalRecordHash: decision.originalRecordHash}, decisionKey: decision.decisionKey, catalogKey: decision.catalogKey, sourceDomain: decision.sourceDomain, targetDomain: decision.targetDomain, reviewState: decision.reviewState, decisionState: decision.decisionState, blockingReasons: decision.blockingReasons, affectedCandidates: typeof decision.catalogKey === "string" ? sourceImpact[decision.catalogKey] ?? [] : [], approvedByIntegration: false}));
  const rootIndex = coordinator.identity.export().CanonicalFactRoot ?? {};
  const sourceBuckets = coordinator.identity.export().SourceId ?? {};
  const collisions = Object.entries(sourceBuckets).filter(([, ids]) => ids.length > 1).map(([sourceId, candidateAddresses]) => ({sourceId, candidateAddresses, engines: [...new Set(candidateAddresses.map(id => coordinator.identity.candidates.get(id)!.engine))].sort(), relation: "POTENTIAL_SAME_MEANING", reviewState: "REVIEW_REQUIRED", verifiedRelation: false, sharedSourceIsNotSameActualFact: true}));
  const planner = envelopes.map(e => ({candidate: e.identity.globalId, receipt: e.originalBinderReceipt, schemaReady: true, sourceTraceable: e.normalizedGateResults.find(g => g.gate === "SOURCE_INTEGRITY")!.state, evidenceMatched: e.normalizedGateResults.find(g => g.gate === "ACTUAL_CALCULATED_FACT")!.state, structurallyMatched: e.normalizedGateResults.filter(g => !["INTERPRETATION_REVIEW", "COUNTEREXAMPLES_AND_PROHIBITIONS", "CUSTOMER_APPROVAL"].includes(g.gate)).every(g => g.state === "PASS" || g.state === "NOT_APPLICABLE"), meaningReview: "REVIEW_REQUIRED", operatorApproval: false, customerEligible: false, plannerAssignable: false, customerPublished: false, bookAllocation: 0, reasons: e.withholdReasons}));
  const audit = (select: (e: CandidateEnvelope) => unknown) => envelopes.map(e => ({candidate: e.identity.globalId, ...select(e) as Record<string, unknown>}));
  const payloads: Record<string, unknown> = {
    "global-specialist-manifest.json": {version: "global-specialist-integration-v1", baseSha: "0872595559ccd88a0452ad1edfe9f771b1ef4678", status: "OFFLINE_IMPLEMENTED_WITH_OPEN_GATES", engines: entries.length, products: [...new Set(entries.map(e => e.productKey))].sort(), relationships: entries.map(e => e.relationshipCategory).filter(Boolean).sort(), ...actual, researchRecords: foundation.catalog.input.records.filter(r => r.namespace === "RESEARCH").length, actualOperatorApproved: 0, actualCustomerEligible: 0, actualSelections: 0, actualClaims: 0, bookAllocations: 0, newCanonicalFactRoots: 0, confirmedSemanticConflicts: 0},
    "global-engine-registry.json": entries.map(entry => Object.fromEntries(Object.entries(entry).filter(([key]) => key !== "invoke"))),
    "global-engine-invocation-results.json": ledger,
    "global-engine-interface-matrix.json": entries.map(e => ({engineId: e.engineId, actualInvoker: e.actualEngineInvoker, adapter: e.specialistAdapter, actualInvocations: ledger.filter(l => l.engineId === e.engineId).length, originalReceiptField: ["comprehensive", "career", "love"].includes(e.engineId) ? "allProductReceipts" : "receipts", preparedFoundationShared: true})),
    "global-product-routing-matrix.json": entries.map(e => ({engineId: e.engineId, product: e.productKey, relationship: e.relationshipCategory, fixtureIds: e.fixtureIds})),
    "global-candidate-fixture-ledger.json": ledger.map(l => ({engineId: l.engineId, fixtureId: l.fixtureId, candidateCount: l.after.candidateOccurrences, graphHash: l.graphHash, graphStatus: l.graphStatus})),
    "global-source-match-matrix.json": matrix,
    "global-evidence-match-matrix.json": matrix.map(m => ({engine: m.engineId, before: m.before.actualEvidenceMatchOccurrences, after: m.after.actualEvidenceMatchOccurrences, independentFactsIssued: 0})),
    "global-structural-match-matrix.json": matrix.map(m => ({engine: m.engineId, before: m.before.structurallyMatched, after: m.after.structurallyMatched, customerEligible: 0})),
    "global-candidate-envelope-index.json": coordinator.identity.export(),
    "global-original-receipt-index.json": envelopes.map(e => ({candidate: e.identity.globalId, ...e.originalBinderReceipt, preservedFields: Object.keys(coordinator.receipts.get(e.originalBinderReceipt.key)!).sort()})),
    "global-source-provenance-index.json": [...coordinator.provenance].map(([catalogKey, original]) => ({catalogKey, original})),
    "global-source-hash-integrity.json": [...coordinator.provenance].map(([catalogKey, original]) => ({catalogKey, original, globalHashRewritten: false})),
    "global-evidence-witness-index.json": [...coordinator.witnesses.values()],
    "global-owner-direction-audit.json": {nodes: [...coordinator.scopeAudits], candidates: audit(e => ({fixture: e.fixtureScope, requiredOwner: e.ownerRequirements, requiredDirection: e.directionRequirements, originalReceipt: e.originalBinderReceipt, ownerGate: e.normalizedGateResults.find(g => g.gate === "ACTUAL_OWNER"), directionGate: e.normalizedGateResults.find(g => g.gate === "ACTUAL_DIRECTION")}))},
    "global-reader-question-index.json": {questions: foundation.registry.questions, originalLinks: foundation.questions.links, scopedIndex: coordinator.identity.export().ReaderAddress, materialLinkKinds: coordinator.identity.export().MaterialLinkKind, nativeTemporalQuestions: "SEE_GLOBAL_TEMPORAL_SCOPE_AUDIT"},
    "global-temporal-scope-audit.json": coordinator.temporal,
    "global-source-group-audit.json": audit(e => ({original: e.sourceGroups, receipt: e.originalBinderReceipt, sourceGroupEvaluation: coordinator.receipts.get(e.originalBinderReceipt.key)!.sourceGroupEvaluation})),
    "global-domain-ancestry-audit.json": {nativeDiagnostics: [...coordinator.diagnosticIndex], witnesses: "global-evidence-witness-index.json", originalDomainDecisions: domains, gates: audit(e => ({fullRequiredAncestry: e.normalizedGateResults.find(g => g.gate === "ALL_ANCESTOR_DOMAINS"), prohibitions: e.prohibitions}))},
    "global-hard-gate-audit.json": {order: BINDING_HARD_GATES, evaluations: audit(e => ({receipt: e.originalBinderReceipt, gates: e.normalizedGateResults})), statePromotionAllowed: false},
    "global-approval-isolation.json": {originalOperatorApproved: 0, originalCustomerApproved: 0, syntheticApprovalImported: false, actualDisplayLedgerIssued: false, customerClaims: 0, bookAllocations: 0, receipts: envelopes.map(e => e.originalBinderReceipt)},
    "global-negative-audit.json": [...coordinator.negativeAudits.values()],
    "global-specialist-policy-matrix.json": {registrations: entries.map(e => ({engine: e.engineId, policySources: e.policySources, reuse: e.reusePolicy, temporal: e.temporalPolicy, sourceGroup: e.sourceGroupPolicy, owner: e.ownerPolicy, direction: e.directionPolicy, domain: e.domainPolicy, recall: e.recallPolicy})), nativePolicies: [...coordinator.policyResults], originalDiagnosticFieldHashes: [...coordinator.diagnosticIndex]},
    "global-fact-root-reuse.json": {scopedRootIndex: rootIndex, addressIsNotNewFact: true, crossFixtureMerged: false, issued: 0},
    "global-meaning-review-index.json": coordinator.reviewQueue(),
    "global-semantic-conflict-candidates.json": {potentialSameSourceGroups: collisions, nativeSemanticAudits: coordinator.semanticAudits.map(s => ({hash: digest(s), originalPayload: "PER_CASE_SHARDS"})), crossFixtureActualFactEquivalence: false, confirmedSemanticConflicts: 0, verifiedRelations: 0, rankingPurpose: "OPERATOR_REVIEW_ONLY"},
    "global-withhold-reasons.json": {originalToGlobal: reasonRows, globalToOriginal: Object.fromEntries([...new Set(reasonRows.map(r => r.globalCategory))].sort().map(category => [category, reasonRows.filter(r => r.globalCategory === category).map(r => r.originalCode)]))},
    "global-blocker-impact.json": {sourceVerificationReferences: pending, domainDecisions: domains, sourceImpact, originalReasons: reasonRows, countsAreEvaluationOccurrencesNotCustomers: true},
    "global-operator-review-queue.json": coordinator.reviewQueue(),
    "global-planner-handoff-contract.json": {compiler: "compilePlannerHandoff", compiledCandidateCount: envelopes.length, compiledObjects: "PER_CASE_SHARDS", customerEligible: 0, customerSelectionReady: false, sourceReviewPending: 3202, domainReviewPending: 2966, actualAllocation: 0},
    "global-planner-readiness.json": planner,
    "global-privacy-audit.json": {forbiddenInputValuesChecked: writer.forbidden.size, passed: true, rawCustomerInputExported: false, witnessValues: "HASH_AND_ALLOWLIST_ONLY", syntheticOnly: true},
    ...companions
  };
  for (const [name, value] of Object.entries(payloads).sort(([a], [b]) => a.localeCompare(b, "en"))) writer.write(name, value);
  writer.finish();
  return {actual, matrix, receiptCount: receipts.length, witnessAddresses: coordinator.witnesses.size, candidateEnvelopeHash: digest(envelopes)};
}
