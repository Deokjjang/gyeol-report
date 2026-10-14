import { BINDING_SAFETY_REQUIREMENTS } from "./safety";
import { NativeDefinitionIndex } from "./nativeDefinitions";
import { relative } from "node:path";
import { isRecord, groupSemantics } from "../normalization";
import { ReferenceResolver } from "../resolver";
import { canonicalJson, hash, recordHash, SourceReader } from "../sourceReader";
import type { CatalogConfig, CatalogKey, JsonRecord, KnowledgeCatalogRecord, KnowledgeReferenceEdge, KnowledgeSourcePointer } from "../types";
import { occurrence, risk, targetId, technicallyVerified } from "./classification";
import type { DomainQueueEntry, GroupReview, ResolutionState, SourceProof, VerificationArtifacts, VerificationConfig, VerificationOccurrence, VerificationReceipt } from "./types";

const candidateView = (r: KnowledgeCatalogRecord) => ({ catalogKey: r.catalogKey, originalId: r.originalId, locator: r.locator, kind: r.kind });
const errorState = (code: string): ResolutionState => /VERSION/.test(code) ? "SOURCE_VERSION_MISMATCH" : /HASH_MISMATCH/.test(code) ? "SOURCE_HASH_MISMATCH" : /KIND/.test(code) ? "SOURCE_KIND_MISMATCH" : /AMBIGUOUS/.test(code) ? "AMBIGUOUS_SOURCE" : /LOCATOR/.test(code) ? "ORIGINAL_LOCATOR_MISSING" : "SOURCE_RECORD_MISSING";
export class SourceVerificationEngine {
  private byKey = new Map<CatalogKey, KnowledgeCatalogRecord>();
  private byId = new Map<string, KnowledgeCatalogRecord[]>();
  private rawCache = new Map<CatalogKey, Promise<unknown>>();
  private forward = new Map<CatalogKey, Set<CatalogKey>>();
  private reverse = new Map<CatalogKey, Set<CatalogKey>>();
  private originalResolver: ReferenceResolver;
  readonly aliasDeclarations: unknown[] = [];
  constructor(readonly reader: SourceReader, readonly records: KnowledgeCatalogRecord[], readonly edges: KnowledgeReferenceEdge[], readonly config: VerificationConfig, readonly catalogConfig: CatalogConfig, readonly frozenFiles: ReadonlyMap<string, string>) {
    for (const r of records) { this.byKey.set(r.catalogKey, r); this.byId.set(r.originalId, [...(this.byId.get(r.originalId) ?? []), r]); }
    for (const e of edges) if (e.to && this.byKey.has(e.to as CatalogKey) && ["REFERENCES", "REUSES_SOURCE", "REQUIRES"].includes(e.kind)) {
      const k = e.to as CatalogKey; const parents = this.reverse.get(k) ?? new Set(); parents.add(e.from); this.reverse.set(k, parents);
      const children = this.forward.get(e.from) ?? new Set(); children.add(k); this.forward.set(e.from, children);
    }
    this.originalResolver = new ReferenceResolver(reader, records, Object.fromEntries(catalogConfig.families.map(f => [f.name, f.documentation])));
  }
  private downstream(key: CatalogKey): number {
    const seen = new Set<CatalogKey>(), stack = [key];
    while (stack.length) for (const p of this.reverse.get(stack.pop()!) ?? []) if (!seen.has(p)) { seen.add(p); stack.push(p); }
    return [...seen].filter(k => ["PRODUCT_SPECIALIST", "RELATIONSHIP_SPECIALIST", "CONDITIONAL_INTERPRETATION", "FUSION_RESEARCH"].includes(this.byKey.get(k)!.kind)).length;
  }
  private async raw(r: KnowledgeCatalogRecord): Promise<unknown> {
    if (!this.rawCache.has(r.catalogKey)) this.rawCache.set(r.catalogKey, this.reader.locate(r.locator).then(v => { if (v.code) throw new Error(v.code); return v.value; }));
    return this.rawCache.get(r.catalogKey)!;
  }
  private fileProof(file: string, role: SourceProof["role"], expected?: string): SourceProof {
    const bytes = this.reader.text(file), actual = this.reader.files.get(file)!, frozen = expected ?? this.frozenFiles.get(relative(this.reader.root, this.reader.path(file)));
    if (!frozen) throw new Error("SOURCE_VERSION_SNAPSHOT_MISSING");
    if (actual !== frozen) throw new Error("FILE_HASH_MISMATCH");
    void bytes;
    return { locator: { file, fileSha256: frozen, sourceVersion: this.config.baseSha }, matchedCatalogKey: null, originalId: null, role, expectedHash: frozen, actualHash: actual, hashAlgorithm: "SHA256_FILE", sourceVersion: this.config.baseSha, reviewState: "file_bytes_only_not_content_approval" };
  }
  private async proof(r: KnowledgeCatalogRecord, extra: Partial<KnowledgeSourcePointer> = {}): Promise<SourceProof> {
    this.fileProof(r.locator.file, "ORIGINAL_RECORD");
    const pointer = { ...r.locator, fileSha256: this.frozenFiles.get(r.locator.file), ...extra }, result = await this.reader.locate(pointer);
    if (result.code) throw new Error(result.code);
    const actual = pointer.recordHashEncoding === "JSON_CANONICAL" ? hash(canonicalJson(result.value)) : recordHash(result.value);
    return { locator: pointer, matchedCatalogKey: r.catalogKey, originalId: r.originalId, role: "ORIGINAL_RECORD", expectedHash: pointer.recordSha256 ?? r.locator.recordSha256!, actualHash: actual, hashAlgorithm: pointer.recordHashEncoding === "JSON_CANONICAL" ? "SHA256_JSON_CANONICAL" : "SHA256_JSON_INSERTION", sourceVersion: pointer.sourceVersion ?? r.locator.sourceVersion!, qualification: isRecord(result.value) ? Object.fromEntries(["support", "crossSupport", "producerSupport", "prerequisites", "strengthConditions", "applicationGate", "doNotApply", "forbiddenClaims"].filter(k => result.value && isRecord(result.value) && result.value[k] !== undefined).map(k => [k, (result.value as JsonRecord)[k]])) : null, reviewState: { ...r.originalState, mbtiSourceCoverage: isRecord(result.value) ? result.value.sourceCoverage ?? null : null }, ...(isRecord(result.value) && typeof result.value.plainKo === "string" ? { originalMeaning: result.value.plainKo } : {}) };
  }
  private receipt(o: VerificationOccurrence, r: KnowledgeCatalogRecord): VerificationReceipt {
    const downstreamCandidateCount = this.downstream(r.catalogKey);
    return { ...o, originalCatalogKey: o.affectedCatalogKey, originalField: o.referenceField, verificationVersion: this.config.version, verificationMethod: "UNRESOLVED", matchedLocator: null, matchedOriginalId: null, matchedSourceVersion: null, hashAlgorithm: null, expectedHash: null, actualHash: null,
      candidateTargets: [], resolutionMethod: "NONE", resolutionState: "UNSUPPORTED_REFERENCE", verificationStrength: "UNVERIFIED", verificationEvidence: [],
      sourceReviewState: { SOURCE_EXISTENCE: "UNREVIEWED", HASH_INTEGRITY: "UNREVIEWED", REFERENCE_RESOLUTION: "FAIL", ORIGINAL_RECORD_IDENTITY: "UNREVIEWED", SOURCE_VERSION: "UNREVIEWED", ORIGINAL_CONTENT_REVIEW: "UNREVIEWED", TRADITIONAL_SOURCE_REVIEW: "UNREVIEWED", MBTI_SOURCE_COVERAGE: null, SEMANTIC_REVIEW: "UNREVIEWED", PRODUCER_SUPPORT: "ACTUAL_EVIDENCE_REQUIRED", DOMAIN_REVIEW: "UNREVIEWED", PRODUCT_APPLICABILITY: "UNREVIEWED", CUSTOMER_APPROVAL: false },
      blockingState: "SOURCE_BLOCKED", blockingReasons: ["SOURCE_REFERENCE_UNVERIFIED", "CUSTOMER_APPROVAL_REQUIRED", "ACTUAL_OWNER_DIRECTION_TIME_EVIDENCE_REQUIRED"], followupAction: "Inspect the exact original declaration and supply a versioned locator; do not replace the target by similarity.", needsHumanReview: true, customerApproved: false, establishesPersonalEvidence: false, checkedAtPolicy: this.config.checkedAtPolicy,
      risk: risk(o, r, downstreamCandidateCount), impact: { originalRecordKind: r.kind, downstreamCandidateCount, actualRuntimeConnected: false, potentialFutureUseOnly: true } };
  }
  private success(receipt: VerificationReceipt, state: ResolutionState, method: string, proofs: SourceProof[], candidates: KnowledgeCatalogRecord[] = []): VerificationReceipt {
    const p = proofs.find(p => p.role === "ORIGINAL_RECORD") ?? proofs[0];
    const recovered = technicallyVerified({ resolutionState: state });
    return { ...receipt, resolutionState: state, resolutionMethod: method, verificationMethod: method, verificationEvidence: proofs, candidateTargets: candidates.map(candidateView), matchedLocator: p?.locator ?? null, matchedOriginalId: p?.originalId ?? null, matchedSourceVersion: p?.sourceVersion ?? null, hashAlgorithm: p?.hashAlgorithm ?? null, expectedHash: p?.expectedHash ?? null, actualHash: p?.actualHash ?? null,
      verificationStrength: !recovered ? "DOCUMENTARY_ONLY" : proofs.every(p => p.role === "DECLARATION") ? "DECLARATION_ONLY" : "ORIGINAL_SOURCE",
      sourceReviewState: { ...receipt.sourceReviewState, SOURCE_EXISTENCE: "PASS", HASH_INTEGRITY: "PASS", REFERENCE_RESOLUTION: recovered ? "PASS" : "UNREVIEWED", ORIGINAL_RECORD_IDENTITY: recovered ? "PASS" : "UNREVIEWED", SOURCE_VERSION: "PASS", MBTI_SOURCE_COVERAGE: p && isRecord(p.reviewState) ? p.reviewState.mbtiSourceCoverage ?? null : null },
      blockingState: recovered ? "REQUIRES_FUTURE_BINDING_AND_APPROVAL" : "SOURCE_BLOCKED", blockingReasons: [ ...(recovered ? [] : ["DOCUMENTARY_OR_FUTURE_REFERENCE_IS_NOT_ORIGINAL_FACT"]), "SEMANTIC_AND_DOMAIN_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_REQUIRED", "ACTUAL_OWNER_DIRECTION_TIME_EVIDENCE_REQUIRED" ], followupAction: recovered ? "Review original meaning, ancestry domain, producer, actual owner/direction/window and explicit customer approval before binding." : "Trace the original source beyond this documentary snapshot; retain the block." };
  }
  private async mbti(receipt: VerificationReceipt, id: string): Promise<VerificationReceipt> {
    const match = /^mbti:([^:]+):traits:([^:]+):([^:]+)$/.exec(id);
    if (!match) return { ...receipt, resolutionState: "UNSUPPORTED_REFERENCE" };
    const [, type, area, trait] = match;
    const profiles = this.records.filter(r => r.namespace === "FOUNDATION" && r.locator.pointer === "" && r.metadata.type === type && r.locator.file.endsWith(".json"));
    if (profiles.length !== 1) return { ...receipt, resolutionState: profiles.length ? "AMBIGUOUS_SOURCE" : "SOURCE_RECORD_MISSING", blockingReasons: [...receipt.blockingReasons, "EXACT_MBTI_TYPE_NOT_FOUND"] };
    const profile = await this.raw(profiles[0]);
    if (!isRecord(profile) || profile.type !== type || !isRecord(profile.traits) || !Array.isArray(profile.traits[area])) return { ...receipt, resolutionState: "SOURCE_RECORD_MISSING", blockingReasons: [...receipt.blockingReasons, "EXACT_MBTI_AREA_NOT_FOUND"] };
    const indexes = (profile.traits[area] as unknown[]).flatMap((v, i) => isRecord(v) && v.id === trait ? [i] : []);
    if (indexes.length !== 1) return { ...receipt, resolutionState: indexes.length ? "AMBIGUOUS_SOURCE" : "SOURCE_RECORD_MISSING", blockingReasons: [...receipt.blockingReasons, "EXACT_MBTI_TRAIT_ID_NOT_FOUND_NO_SUBSTITUTION"] };
    const pointer = `/traits/${area}/${indexes[0]}`, candidates = this.records.filter(r => r.locator.file === profiles[0].locator.file && r.locator.pointer === pointer && !r.locator.exportName);
    if (candidates.length !== 1) return { ...receipt, resolutionState: "ORIGINAL_LOCATOR_MISSING" };
    const p = await this.proof(candidates[0]); p.qualification = { type, area, traitId: trait, sourceFileSha256: this.reader.files.get(p.locator.file), sourceCoverageIsNotEmpirical: true, usageField: receipt.referenceField };
    return this.success(receipt, "EXACT_SOURCE_VERIFIED", "EXACT_MBTI_TYPE_AREA_TRAIT_AND_POINTER", [p, this.fileProof(profiles[0].locator.file, "DECLARATION")], candidates);
  }
  private async fragments(receipt: VerificationReceipt, record: KnowledgeCatalogRecord, fragment: string): Promise<VerificationReceipt> {
    const raw = await this.raw(record);
    let requested: string[][];
    if (fragment.includes(",")) {
      const grammar = this.config.fragmentGrammars.find(g => g.exportName === record.locator.exportName && g.referenceField === receipt.referenceField);
      if (!grammar || fragment !== grammar.fields.join(",")) return { ...receipt, resolutionState: "UNSUPPORTED_REFERENCE", blockingReasons: [...receipt.blockingReasons, "FRAGMENT_GRAMMAR_NOT_DECLARED"] };
      requested = grammar.fields.map(f => [f]);
    } else if (fragment.startsWith("/")) requested = [fragment.split("/").slice(1).map(k => k.replace(/~1/g, "/").replace(/~0/g, "~"))];
    else requested = [fragment.split(":")];
    const missing = requested.filter(path => { let v = raw; for (const key of path) { if ((!isRecord(v) && !Array.isArray(v)) || !Object.prototype.hasOwnProperty.call(v, key)) return true; v = (v as JsonRecord)[key]; } return v === undefined; });
    if (missing.length) return { ...receipt, candidateTargets: [candidateView(record)], resolutionState: "PARTIAL_FRAGMENT", blockingReasons: [...receipt.blockingReasons, `MISSING_FRAGMENT_FIELDS:${missing.map(p => p.join("/")).join(",")}`] };
    const p = await this.proof(record); p.qualification = { requestedFields: requested, allRequestedFieldsExist: true, interpretationNotApproved: true };
    return this.success(receipt, "FRAGMENT_VERIFIED", "DECLARED_COMPLETE_FIELD_FRAGMENT", [p], [record]);
  }
  private async audit(receipt: VerificationReceipt, from: KnowledgeCatalogRecord, target: unknown): Promise<VerificationReceipt> {
    const auditRef = isRecord(target) ? target.auditRef : target;
    if (typeof auditRef !== "string") return receipt;
    const [name, key] = auditRef.split("#"), family = this.catalogConfig.families.find(f => f.name === from.family);
    if (!family) return { ...receipt, resolutionState: "ORIGINAL_LOCATOR_MISSING" };
    const file = `${family.documentation}/${name}`;
    if (!this.reader.exists(file)) return { ...receipt, resolutionState: "ORIGINAL_LOCATOR_MISSING", blockingReasons: [...receipt.blockingReasons, "FAMILY_LOCAL_AUDIT_DOCUMENT_MISSING_NO_BASENAME_SEARCH"] };
    const data = this.reader.json(file), entries: { value: JsonRecord; pointer: string }[] = [];
    const walk = (v: unknown, pointer: string) => { if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${pointer}/${i}`)); else if (isRecord(v)) { entries.push({ value: v, pointer }); for (const [k, x] of Object.entries(v)) if (isRecord(x) || Array.isArray(x)) walk(x, `${pointer}/${k.replace(/~/g, "~0").replace(/\//g, "~1")}`); } };
    walk(data, "");
    const found = key?.startsWith("/") ? entries.filter(e => e.pointer === key) : key ? entries.filter(e => e.value.key === key || e.value.id === key) : [{ value: isRecord(data) ? data : { entries: data }, pointer: "" }];
    if (found.length !== 1) return { ...receipt, resolutionState: found.length ? "AMBIGUOUS_SOURCE" : "SOURCE_RECORD_MISSING", blockingReasons: [...receipt.blockingReasons, "EXACT_AUDIT_ENTRY_NOT_UNIQUE"] };
    const entry = found[0], proofs = [this.fileProof(file, "AUDIT_RECORD")];
    const expected = isRecord(target) && typeof target.recordSha256 === "string" ? target.recordSha256 : typeof entry.value.recordSha256 === "string" ? entry.value.recordSha256 : null;
    if (expected && entry.value.raw !== undefined && recordHash(entry.value.raw) !== expected) throw new Error("AUDIT_SNAPSHOT_HASH_MISMATCH");
    proofs[0].locator = { ...proofs[0].locator, pointer: entry.pointer }; proofs[0].originalId = String(entry.value.sourceId ?? entry.value.id ?? entry.value.key ?? "audit-entry");
    proofs[0].qualification = { auditRecordHash: recordHash(entry.value), snapshotExpectedHash: expected, snapshotActualHash: entry.value.raw !== undefined ? recordHash(entry.value.raw) : null, originalSourceUrl: entry.value.url ?? null, auditRecordVerified: true, originalWebContentVerified: false };
    if (typeof entry.value.file === "string" && (typeof entry.value.exportName === "string" || typeof entry.value.pointer === "string")) {
      const p: KnowledgeSourcePointer = { file: entry.value.file, exportName: typeof entry.value.exportName === "string" ? entry.value.exportName : undefined, pointer: typeof entry.value.pointer === "string" ? entry.value.pointer : undefined, index: typeof entry.value.index === "number" ? entry.value.index : undefined, recordSha256: expected ?? undefined, fileSha256: typeof entry.value.sourceFileSha256 === "string" ? entry.value.sourceFileSha256 : undefined };
      const v = await this.reader.locate(p); if (v.code) throw new Error(v.code);
      proofs.push(this.fileProof(p.file, "DECLARATION"));
      proofs.push({ locator: p, matchedCatalogKey: null, originalId: isRecord(v.value) && typeof v.value.id === "string" ? v.value.id : null, role: "ORIGINAL_RECORD", expectedHash: expected ?? recordHash(v.value), actualHash: recordHash(v.value), hashAlgorithm: "SHA256_JSON_INSERTION", sourceVersion: this.config.baseSha, reviewState: "original_record_located_not_meaning_approval" });
      return this.success(receipt, "AUDIT_AND_ORIGINAL_VERIFIED", "AUDIT_ENTRY_AND_DECLARED_ORIGINAL_LOCATOR", proofs);
    }
    return this.success(receipt, "DOCUMENTARY_REFERENCE_ONLY", "AUDIT_RECORD_VERIFIED_ORIGINAL_LOCATOR_MISSING", proofs);
  }
  private async documentaryAlias(receipt: VerificationReceipt, id: string): Promise<VerificationReceipt | null> {
    for (const document of this.config.aliasDocuments) {
      const data = this.reader.json(document.file), entries = isRecord(data) ? data[document.field] : null;
      if (!Array.isArray(entries)) continue;
      const found = entries.filter(v => isRecord(v) && v.id === id);
      if (!found.length) continue;
      if (found.length !== 1 || !isRecord(found[0]) || !Array.isArray(found[0].files)) return { ...receipt, resolutionState: "AMBIGUOUS_SOURCE" };
      const declaration = found[0], proofs = [this.fileProof(document.file, "AUDIT_RECORD")];
      for (const v of declaration.files as unknown[]) {
        if (!isRecord(v) || typeof v.file !== "string" || typeof v.sha256 !== "string") return { ...receipt, resolutionState: "ORIGINAL_LOCATOR_MISSING" };
        proofs.push(this.fileProof(v.file, v.file.startsWith("docs/") ? "DOCUMENTARY_SNAPSHOT" : "DECLARATION", v.sha256));
      }
      this.aliasDeclarations.push({ referenceKey: receipt.referenceKey, originalId: id, document: document.file, declaration, allDeclaredFilesChecked: true });
      const state = proofs.slice(1).every(p => p.role === "DECLARATION") ? "UNIQUE_ALIAS_VERIFIED" : "DOCUMENTARY_REFERENCE_ONLY";
      return this.success(receipt, state, "EXPLICIT_ALIAS_REGISTRY_ALL_FILE_HASHES", proofs);
    }
    for (const source of this.config.declarationSources) {
      const ex = await this.reader.exports(source.file);
      if (Array.isArray(ex[source.exportName]) && (ex[source.exportName] as unknown[]).includes(id)) {
        return this.success(receipt, "DOCUMENTARY_REFERENCE_ONLY", "DECLARED_RESEARCH_OR_AUTHORING_ID_ONLY", [this.fileProof(source.file, "DOCUMENTARY_SNAPSHOT")]);
      }
    }
    return null;
  }
  private async qualifiedAlias(receipt: VerificationReceipt, from: KnowledgeCatalogRecord, id: string): Promise<VerificationReceipt | null> {
    if (receipt.targetNamespace === "SEMANTIC_ID" && /relatedAxes|distinguishAxis/.test(receipt.referenceField)) {
      const candidates = (this.byId.get(id) ?? []).filter(r => ["BIPOLAR_AXES", "STRENGTH_AXES"].includes(r.locator.exportName ?? ""));
      if (candidates.length === 1) return this.success(receipt, "UNIQUE_ALIAS_VERIFIED", "DECLARED_SEMANTIC_AXIS_NAMESPACE", [await this.proof(candidates[0])], candidates);
    }
    if (receipt.targetNamespace === "TRADITIONAL_SOURCE_ID") {
      let candidates = (this.byId.get(id) ?? []).filter(r => ["SOURCE_REFERENCE", "SOURCE_KNOWLEDGE"].includes(r.kind) && (typeof r.metadata.url === "string" || typeof r.metadata.location === "string"));
      if (candidates.length === 1) { const p = await this.proof(candidates[0]); p.qualification = { passage: isRecord(receipt.originalTarget) ? receipt.originalTarget.passage : null, registryIdentityOnlyNotFreshWebReview: true }; return this.success(receipt, "UNIQUE_ALIAS_VERIFIED", "DOCUMENTARY_SOURCE_KIND_QUALIFIED_ALIAS", [p], candidates); }
      const raw = await this.raw(from);
      if (isRecord(raw) && typeof raw.sourceId === "string" && typeof raw.originalHash === "string") {
        const upstream = (this.byId.get(raw.sourceId) ?? []).filter(r => r.locator.recordSha256 === raw.originalHash);
        if (upstream.length === 1) {
          const ancestry = await this.proof(upstream[0]);
          candidates = candidates.filter(r => r.family === upstream[0].family);
          if (candidates.length === 1) {
            const p = await this.proof(candidates[0]); p.qualification = { passage: isRecord(receipt.originalTarget) ? receipt.originalTarget.passage : null, inheritedFrom: ancestry.matchedCatalogKey, sourceEditionRegistryVerified: true, originalWebContentNotNewlyReviewed: true };
            return this.success(receipt, "UNIQUE_ALIAS_VERIFIED", "HASH_VERIFIED_ORIGINAL_FAMILY_AND_EDITION_REGISTRY", [p, ancestry], candidates);
          }
        }
      }
      return { ...receipt, candidateTargets: candidates.map(candidateView), resolutionState: "AMBIGUOUS_SOURCE" };
    }
    const scopes = this.records.filter(r => r.locator.exportName === this.config.scopeAlias.exportName && r.metadata[this.config.scopeAlias.field] === id);
    if (scopes.length === 1 && /scopeRefs/.test(receipt.referenceField)) return this.success(receipt, "UNIQUE_ALIAS_VERIFIED", "EXACT_DECLARED_TEMPORAL_SCOPE_ALIAS_NOT_CALCULATED_WINDOW", [await this.proof(scopes[0])], scopes);
    for (const convention of this.config.locatorConventions) {
      if (!id.startsWith(convention.prefix + ":")) continue;
      const remainder = id.slice(convention.prefix.length + 1), parts = convention.fieldSuffix ? remainder.split(":") : [remainder];
      const candidates = this.records.filter(r => r.locator.file === convention.file && r.locator.exportName === convention.exportName && (r.originalId === parts[0] || r.metadata.key === parts[0]));
      if (candidates.length !== 1) return { ...receipt, candidateTargets: candidates.map(candidateView), resolutionState: candidates.length ? "AMBIGUOUS_SOURCE" : "SOURCE_RECORD_MISSING" };
      if (parts.length > 1) return this.fragments(receipt, candidates[0], parts.slice(1).join(":"));
      return this.success(receipt, "UNIQUE_ALIAS_VERIFIED", "EXACT_SOURCE_PREFIX_EXPORT_AND_ORIGINAL_ID", [await this.proof(candidates[0])], candidates);
    }
    return this.documentaryAlias(receipt, id);
  }
  private async verifyInternal(edge: KnowledgeReferenceEdge, ordinal: number): Promise<VerificationReceipt> {
    const from = this.byKey.get(edge.from); if (!from) throw new Error("AFFECTED_CATALOG_KEY_MISSING");
    const o = occurrence(edge, from, ordinal, this.config), initial = this.receipt(o, from), id = targetId(edge.target);
    try {
      // The affected source must itself still be the original base record.
      await this.raw(from); this.fileProof(from.locator.file, "ORIGINAL_RECORD");
      if (id && this.byKey.has(id as CatalogKey)) { const r = this.byKey.get(id as CatalogKey)!; return this.success(initial, "EXACT_SOURCE_VERIFIED", "EXACT_CATALOG_KEY", [await this.proof(r)], [r]); }
      if (isRecord(edge.target) && (typeof edge.target.file === "string" || typeof edge.target.catalog === "string")) {
        const direct = await this.originalResolver.resolve(from, { field: edge.field, target: edge.target, kind: edge.kind });
        if (direct.resolution !== "RESOLVED" || !direct.to || !this.byKey.has(direct.to as CatalogKey)) throw new Error(direct.reason ?? "SOURCE_RECORD_MISSING");
        const r = this.byKey.get(direct.to as CatalogKey)!;
        return this.success(initial, "EXACT_SOURCE_VERIFIED", "EXACT_DECLARED_LOCATOR_AND_EXISTING_RESOLVER", [await this.proof(r, typeof edge.target.file === "string" ? edge.target as Partial<KnowledgeSourcePointer> : {})], [r]);
      }
      if (o.targetNamespace === "MBTI_STRUCTURED_ID" && id) return await this.mbti(initial, id);
      if (o.targetNamespace === "AUDIT_REFERENCE") return await this.audit(initial, from, edge.target);
      if (o.targetNamespace === "FUTURE_BINDING_REQUIREMENT" || o.targetNamespace === "CALCULATED_EVIDENCE_REQUIREMENT") return { ...initial, resolutionState: "FUTURE_REQUIREMENT_ONLY", resolutionMethod: "DECLARED_REQUIREMENT_NOT_SOURCE_INSTANCE", verificationMethod: "DECLARED_REQUIREMENT_NOT_SOURCE_INSTANCE", blockingReasons: ["ACTUAL_EVIDENCE_OR_BINDING_GATE_NOT_SUPPLIED", "CUSTOMER_APPROVAL_REQUIRED"], followupAction: "Supply an actual Evidence Graph instance with original producer, person, direction, ancestry and effective interval. Do not convert this research string into Evidence." };
      if (id?.includes("#") && o.targetNamespace === "FIELD_FRAGMENT") {
        const [root, fragment] = id.split("#"), candidates = this.byId.get(root) ?? [];
        if (candidates.length !== 1) return { ...initial, candidateTargets: candidates.map(candidateView), resolutionState: candidates.length ? "AMBIGUOUS_SOURCE" : "SOURCE_RECORD_MISSING" };
        return await this.fragments(initial, candidates[0], fragment);
      }
      if (id) { const alias = await this.qualifiedAlias(initial, from, id); if (alias) return alias; }
      const old = await this.originalResolver.resolve(from, { field: edge.field, target: edge.target, kind: edge.kind });
      if (old.resolution === "RESOLVED" && old.to && this.byKey.has(old.to as CatalogKey)) {
        const r = this.byKey.get(old.to as CatalogKey)!, extra = isRecord(edge.target) && typeof edge.target.file === "string" ? edge.target as Partial<KnowledgeSourcePointer> : {};
        return this.success(initial, "EXACT_SOURCE_VERIFIED", "EXISTING_RESOLVER_PLUS_ORIGINAL_HASH_VERIFICATION", [await this.proof(r, extra)], [r]);
      }
      if (old.reason?.includes("HASH_MISMATCH") || old.reason?.includes("VERSION") || old.reason?.includes("KIND_MISMATCH")) throw new Error(old.reason);
      if (id) {
        const exact = this.byId.get(id) ?? [], local = exact.filter(r => r.family === from.family), candidates = local.length ? local : exact;
        if (candidates.length === 1) return this.success(initial, "EXACT_SOURCE_VERIFIED", "EXACT_ID_NAMESPACE_FAMILY_AND_HASH", [await this.proof(candidates[0])], candidates);
        if (candidates.length > 1) return { ...initial, candidateTargets: candidates.map(candidateView), resolutionState: "AMBIGUOUS_SOURCE" };
        if (/^src\/.*\.(?:ts|tsx)$/.test(id)) return this.success(initial, "EXACT_SOURCE_VERIFIED", "EXACT_SOURCE_FILE_HASH_DECLARATION_ONLY", [this.fileProof(id, "DECLARATION")]);
        const definitions = this.native.find(id);
        if (definitions.length === 1) { const d = definitions[0], p = this.fileProof(d.file, "DECLARATION"); p.originalId = id; p.locator.exportName = d.symbol; p.qualification = d; return this.success(initial, "EXACT_SOURCE_VERIFIED", "EXACT_EXPORTED_NATIVE_DECLARATION_AND_TYPE_MEMBERS", [p]); }
        if (definitions.length > 1) return { ...initial, resolutionState: "AMBIGUOUS_SOURCE", blockingReasons: [...initial.blockingReasons, "MULTIPLE_NATIVE_DECLARATIONS"] };
      }
      return { ...initial, resolutionState: o.targetNamespace === "UNKNOWN" ? "UNSUPPORTED_REFERENCE" : "SOURCE_RECORD_MISSING" };
    } catch (error) {
      const code = error instanceof Error ? error.message : String(error);
      return { ...initial, resolutionState: errorState(code), blockingReasons: [...initial.blockingReasons, code], followupAction: "Restore the exact provenance evidence or obtain manual review; preserve the original reference and block use." };
    }
  }
  async verify(edge: KnowledgeReferenceEdge, ordinal: number): Promise<VerificationReceipt> {
    const result = await this.verifyInternal(edge, ordinal);
    if (!isRecord(edge.target)) return result;
    let failure: string | null = null;
    const original = result.verificationEvidence.find(p => p.role === "ORIGINAL_RECORD");
    const declarations = [edge.target, ...(isRecord(edge.target.passage) ? [edge.target.passage] : [])];
    for (const declared of declarations) {
      const version = declared.sourceVersion;
      if (typeof version === "string") {
        if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(version) || (/^[a-f0-9]{40}$/.test(version) && !this.reader.knownSourceVersions.includes(version))) failure = "UNKNOWN_SOURCE_VERSION";
        else if (/^[a-f0-9]{40}$/.test(version) && original && version !== this.config.baseSha && version !== (original.matchedCatalogKey ? this.byKey.get(original.matchedCatalogKey)?.locator.sourceVersion : original.sourceVersion)) failure = "DECLARED_SOURCE_VERSION_MISMATCH";
        else if (/^[a-f0-9]{64}$/.test(version) && original && version !== this.reader.files.get(original.locator.file)) failure = "SOURCE_VERSION_HASH_MISMATCH";
      }
      if (!technicallyVerified(result) || !original) continue;
      if (typeof declared.originalId === "string" && declared.originalId !== original.originalId) failure = "DECLARED_ORIGINAL_ID_MISMATCH";
      if (typeof declared.exportName === "string" && declared.exportName !== original.locator.exportName) failure = "DECLARED_SOURCE_LOCATOR_MISMATCH";
      if (typeof declared.index === "number" && `/${declared.index}` !== (original.locator.pointer ?? `/${original.locator.index}`)) failure = "DECLARED_SOURCE_LOCATOR_MISMATCH";
      if (typeof declared.file === "string" && declared.file !== original.locator.file) failure = "DECLARED_SOURCE_LOCATOR_MISMATCH";
      if (typeof declared.pointer === "string" && declared.pointer !== (original.locator.pointer ?? (original.locator.index !== undefined ? `/${original.locator.index}` : ""))) failure = "DECLARED_SOURCE_LOCATOR_MISMATCH";
      if (typeof declared.recordSha256 === "string" && declared.recordSha256 !== original.actualHash) failure = "REFERENCED_RECORD_HASH_MISMATCH";
      if (typeof declared.fileSha256 === "string" && declared.fileSha256 !== this.reader.files.get(original.locator.file)) failure = "FILE_HASH_MISMATCH";
      if (typeof declared.sha256 === "string" || typeof declared.plainKoSha256 === "string" || declared.expectedState !== undefined || declared.expectedWithType !== undefined) {
        const v = await this.reader.locate(original.locator);
        if (declared.expectedWithType !== undefined && (!isRecord(v.value) || v.value.withType !== declared.expectedWithType)) failure = "MBTI_PAIR_DIRECTION_KIND_MISMATCH";
        if (isRecord(declared.expectedState) && (!isRecord(v.value) || Object.entries(declared.expectedState).some(([k, expected]) => canonicalJson((v.value as JsonRecord)[k]) !== canonicalJson(expected)))) failure = "SOURCE_STATE_MISMATCH";
        if (typeof declared.sha256 === "string" && declared.sha256 !== hash(canonicalJson(v.value))) failure = "CANONICAL_RECORD_HASH_MISMATCH";
        if (typeof declared.plainKoSha256 === "string" && (!isRecord(v.value) || typeof v.value.plainKo !== "string" || hash(v.value.plainKo) !== declared.plainKoSha256)) failure = "PLAIN_KO_HASH_MISMATCH";
      }
    }
    if (technicallyVerified(result) && typeof edge.target.expectedKind === "string" && result.candidateTargets[0]?.kind !== edge.target.expectedKind) failure = "SOURCE_KIND_MISMATCH";
    if (!failure) return result;
    return { ...result, resolutionState: errorState(failure), verificationStrength: "UNVERIFIED", blockingState: "SOURCE_BLOCKED", blockingReasons: [...result.blockingReasons, failure], sourceReviewState: { ...result.sourceReviewState, REFERENCE_RESOLUTION: "FAIL", ...(failure.includes("HASH") ? { HASH_INTEGRITY: "FAIL" as const } : {}), ...(failure.includes("VERSION") ? { SOURCE_VERSION: "FAIL" as const } : {}) } };
  }
  private get native() { return this.nativeIndex ??= new NativeDefinitionIndex(this.reader, this.config.nativeDefinitionFiles); }
  private nativeIndex?: NativeDefinitionIndex;

  async domainQueue(receipts: VerificationReceipt[]): Promise<DomainQueueEntry[]> {
    const queue: DomainQueueEntry[] = [];
    const byAffected = new Map<CatalogKey, VerificationReceipt[]>();
    const links = new Map([...this.forward].map(([key, values]) => [key, new Set(values)]));
    for (const receipt of receipts) {
      byAffected.set(receipt.affectedCatalogKey, [...(byAffected.get(receipt.affectedCatalogKey) ?? []), receipt]);
      if (technicallyVerified(receipt)) for (const target of receipt.candidateTargets) { const values = links.get(receipt.affectedCatalogKey) ?? new Set(); values.add(target.catalogKey); links.set(receipt.affectedCatalogKey, values); }
    }

    for (const r of this.records.filter(r => r.applicability.domainValidation === "UNRESOLVED")) {
      const own = byAffected.get(r.catalogKey) ?? [], reached = new Set<CatalogKey>(), stack = [r.catalogKey];
      while (stack.length) { const key = stack.pop()!; if (reached.has(key)) continue; reached.add(key); for (const child of links.get(key) ?? []) stack.push(child); }
      const ancestryReferences = [...reached].flatMap(key => byAffected.get(key) ?? []);
      const remaining = ancestryReferences.filter(x => !technicallyVerified(x) && x.resolutionState !== "FUTURE_REQUIREMENT_ONLY");
      const originalSourceProof = await this.proof(r);
      const classifications: DomainQueueEntry["classifications"] = [], policyProofs: SourceProof[] = [];
      if (remaining.length) classifications.push("INCOMPLETE_SOURCE");
      for (const policy of this.config.domainPolicies) if (r.applicability.relationships.includes(policy.relationship as never) && typeof r.metadata.domain === "string" && policy.domains.includes(r.metadata.domain)) {
        const record = this.byId.get(policy.policyId) ?? [];
        if (record.length === 1) { const body = await this.raw(record[0]); if (isRecord(body) && Array.isArray(body.rules) && body.rules.some(v => typeof v === "string" && v.includes(policy.quote))) { classifications.push("ORIGINAL_POLICY_PROHIBITS"); policyProofs.push(await this.proof(record[0])); } }
      }
      const unsupportedProducerSourceKeys = [...reached].filter(key => {
        const source = this.byKey.get(key)?.metadata;
        return source && (source.crossSupport === "unsupported_withhold" || source.producerSupport === "unsupported" || (isRecord(source.support) && source.support.calculation === "unsupported"));
      });
      if (unsupportedProducerSourceKeys.length) classifications.push("UNSUPPORTED_PRODUCER");
      if (r.applicability.products.length || r.applicability.relationships.length) classifications.push("PRODUCT_POLICY_REQUIRED");
      classifications.push("SEMANTIC_REVIEW_REQUIRED");
      queue.push({ catalogKey: r.catalogKey, originalId: r.originalId, family: r.family, originalDomain: r.metadata.domain ?? r.metadata.domains ?? null, baselineReferenceOverlap: own.length, ancestorReferenceKeys: ancestryReferences.map(v => v.referenceKey), unsupportedProducerSourceKeys, originalSourceProof, recoveredReferences: ancestryReferences.filter(technicallyVerified).length, remainingReferenceBlockers: remaining.map(v => v.referenceKey), classifications: [...new Set(classifications)], priority: classifications.includes("ORIGINAL_POLICY_PROHIBITS") ? "CRITICAL" : remaining.length ? "HIGH" : "MEDIUM", policyProofs, domainApproved: false, futureAllAncestorReviewRequired: true });
    }
    return queue;
  }
  async groups(receipts: VerificationReceipt[]): Promise<GroupReview[]> {
    const heldKeys = new Set(receipts.filter(r => !technicallyVerified(r) && r.resolutionState !== "FUTURE_REQUIREMENT_ONLY").map(r => r.affectedCatalogKey));
    const rows: GroupReview[] = [];
    for (const r of this.records.filter(r => r.groupSemantics !== "NOT_DECLARED")) {
      const raw = await this.raw(r), req = isRecord(raw) && isRecord(raw.requirements) ? raw.requirements : raw;
      if (!isRecord(req) || !Array.isArray(req.sourceGroups)) continue;
      const semantics = groupSemantics(isRecord(raw) ? raw : {}), groups: GroupReview["groups"] = [];
      const declaredGroups: unknown[] = req.sourceGroups.length ? req.sourceGroups : req.groupPolicy === "all_direct_sources" ? [{ directSourceProjectionNotOriginalGroup: true, originalOwnedSources: isRecord(raw) ? raw.ownedSources ?? null : null, sourceKeys: [...new Set([ ...(isRecord(raw) && Array.isArray(raw.sourceKeys) ? raw.sourceKeys : []), ...(isRecord(raw) && Array.isArray(raw.ownedSources) ? raw.ownedSources.flatMap(v => isRecord(v) && typeof v.sourceKey === "string" ? [v.sourceKey] : []) : []), ...(Array.isArray(req.typePredicates) ? req.typePredicates.flatMap(v => isRecord(v) && typeof v.sourceKey === "string" ? [v.sourceKey] : []) : []) ])], typePredicates: req.typePredicates ?? [] }] : [];
      for (const original of declaredGroups) {
        const g = isRecord(original) ? original : {}, keys = Array.isArray(g.sourceKeys) ? g.sourceKeys.filter((k): k is string => typeof k === "string") : [];
        const verified: string[] = [], held: string[] = [], ownerTypes = new Map<string, Set<string>>();
        for (const key of keys) {
          const source = this.records.filter(v => v.family === r.family && v.metadata.key === key);
          if (source.length !== 1 || heldKeys.has(source[0].catalogKey)) held.push(key);
          else { try { await this.proof(source[0]); verified.push(key); } catch { held.push(key); } }
        }
        if (Array.isArray(g.typePredicates)) for (const predicate of g.typePredicates) if (isRecord(predicate) && typeof predicate.owner === "string" && typeof predicate.type === "string") { const set = ownerTypes.get(predicate.owner) ?? new Set(); set.add(predicate.type); ownerTypes.set(predicate.owner, set); if (typeof predicate.sourceKey === "string" && !keys.includes(predicate.sourceKey)) held.push(predicate.sourceKey); }
        const conflicting = [...ownerTypes.values()].some(s => s.size > 1);
        groups.push({ originalGroup: original, requiredSources: keys, verifiedSourceKeys: verified, heldSourceKeys: [...new Set(held)], conflictingOwnerTypeDeclarations: conflicting, status: keys.length === 0 || held.length || conflicting || semantics === "UNKNOWN_GROUP_SEMANTICS" ? "WITHHELD" : "DECLARED_SOURCES_VERIFIED" });
      }
      rows.push({ catalogKey: r.catalogKey, originalId: r.originalId, semantics, originalGroupPolicy: req.groupPolicy ?? null, groups, blockingReasons: [ ...(semantics === "UNKNOWN_GROUP_SEMANTICS" ? ["UNKNOWN_GROUP_SEMANTICS"] : []), ...(groups.some(g => g.status === "WITHHELD") ? ["ALL_REQUIRED_GROUP_SOURCES_NOT_VERIFIED"] : []), ...(semantics === "AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS" ? ["ACTUALLY_DISPLAYED_COMPATIBLE_GROUP_REQUIRED"] : []), "ACTUAL_OWNER_DIRECTION_AND_TIME_REQUIRED", "CUSTOMER_APPROVAL_REQUIRED" ], actualOwnersDirectionsTimesRequired: true, approvedForCustomer: false });
    }
    return rows;
  }
  async run(unresolved: KnowledgeReferenceEdge[]): Promise<VerificationArtifacts> {
    const receipts: VerificationReceipt[] = [];
    for (const [i, edge] of unresolved.entries()) receipts.push(await this.verify(edge, i));
    const domainQueue = await this.domainQueue(receipts), groups = await this.groups(receipts);
    const states = Object.fromEntries([...new Set(receipts.map(r => r.resolutionState))].sort().map(s => [s, receipts.filter(r => r.resolutionState === s).length]));
    return { receipts, domainQueue, groups, aliasDeclarations: this.aliasDeclarations,
      sourceIntegrity: [...this.reader.files].sort(([a], [b]) => a.localeCompare(b, "en")).map(([file, sha256]) => ({ file, sha256 })),
      safetyContract: BINDING_SAFETY_REQUIREMENTS,
      manifest: { version: this.config.version, baseSha: this.config.baseSha, originalReferences: unresolved.length, classifiedReferences: receipts.length, originalResolvedReferences: this.edges.filter(e => e.resolution === "RESOLVED" && !["CAN_APPLY_TO", "SPECIALIZES", "NEEDS_VALIDATION", "PROHIBITED_FOR"].includes(e.kind)).length, originalUnresolvedReferences: this.edges.filter(e => e.resolution === "UNRESOLVED").length, resolutionStates: states, technicallyRecovered: receipts.filter(technicallyVerified).length, unresolvedAfterVerification: receipts.filter(r => !technicallyVerified(r)).length, documentaryAndFutureAreNotRecovered: true, hashMismatches: states.SOURCE_HASH_MISMATCH ?? 0, versionMismatches: states.SOURCE_VERSION_MISMATCH ?? 0, domainQueue: domainQueue.length, domainClassifications: Object.fromEntries([...new Set(domainQueue.flatMap(r => r.classifications))].sort().map(c => [c, domainQueue.filter(r => r.classifications.includes(c)).length])), sourceGroups: groups.length, sourceGroupBlockers: groups.filter(r => r.groups.some(g => g.status === "WITHHELD") || r.semantics === "UNKNOWN_GROUP_SEMANTICS").length, highRiskReferenceBlockers: receipts.filter(r => ["CRITICAL", "HIGH"].includes(r.risk)).length, humanReviewRequired: receipts.length, customerApproval: 0, runtimeConnection: 0, wallClockInReceipts: false } };
  }
}
