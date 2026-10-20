import { isRecord, selected, crosswalk } from "../normalization";
import { hash, canonicalJson, recordHash, type SourceReader } from "../sourceReader";
import { validateCatalogRecord } from "../validation";
import type { CatalogKey, JsonRecord, KnowledgeCatalogRecord, RelationshipCategory } from "../types";
import type { DomainQueueEntry } from "../source-verification/types";
import { declaredDomains, SemanticAncestryIndex } from "./graph";
import type { AncestorPolicyReceipt, DirectMeaningReview, GroupSemanticReview, SemanticArtifacts, SemanticDomainDecision, SemanticDomainWithholdReason, SemanticInputs, SemanticReviewReceipt, SourceMeaningProof } from "./types";
const meaningNames = ["coreMeaning", "meaning", "definition", "core", "originalMeaning", "existingDefinition", "plainKo", "positive", "risk", "shadow", "readerQuestion", "question", "originalRole", "sharedGround", "difference", "independentInformation"];
export function originalField(value: unknown, pointer: string): unknown {
  let v = value;
  for (const key of pointer.split("/").slice(1).map(k => k.replace(/~1/g, "/").replace(/~0/g, "~"))) {
    if ((!isRecord(v) && !Array.isArray(v)) || !Object.hasOwn(v, key)) return undefined;
    v = (v as JsonRecord)[key];
  }
  return v;
}
/** Offline definition/policy review. No actual people, calculations, candidate selection or approval. */
export class SemanticDomainVerificationEngine {
  readonly graph: SemanticAncestryIndex;
  private rawCache = new Map<CatalogKey, Promise<unknown>>();
  private proofCache = new Map<CatalogKey, Promise<SourceMeaningProof>>();
  private checkedFiles = new Map<string, string>();
  private direct = new Map<CatalogKey, DirectMeaningReview>();
  private mbtiDomainMap: JsonRecord = {};
  private sourceReferenceKeys: Set<string>;
  readonly policyProofs: SemanticArtifacts["policyProofs"] = [];
  constructor(readonly reader: SourceReader, readonly input: SemanticInputs) {
    this.graph = new SemanticAncestryIndex(input);
    if (input.sourceReceipts.some(r => r.customerApproved !== false || r.establishesPersonalEvidence !== false)) throw new Error("SOURCE_REVIEW_IS_NOT_CUSTOMER_APPROVAL");
    this.sourceReferenceKeys = new Set(input.sourceReceipts.map(r => r.referenceKey));
    for (const review of input.directReviews) { if (this.direct.has(review.catalogKey)) throw new Error("DUPLICATE_MODEL_REVIEW"); this.direct.set(review.catalogKey, review); }
  }
  unique(id: string): KnowledgeCatalogRecord { const found = this.graph.byId.get(id) ?? []; if (found.length !== 1) throw new Error("ORIGINAL_ID_NOT_UNIQUE:" + id); return found[0]; }
  async raw(key: CatalogKey): Promise<unknown> {
    if (!this.rawCache.has(key)) this.rawCache.set(key, (async () => {
      const r = this.graph.byKey.get(key); if (!r) throw new Error("CATALOG_KEY_MISSING");
      if (!this.checkedFiles.has(r.locator.file)) { this.reader.text(r.locator.file); const actual = this.reader.files.get(r.locator.file)!; if (actual !== this.input.frozen.get(r.locator.file)) throw new Error("ORIGINAL_FILE_HASH_MISMATCH"); this.checkedFiles.set(r.locator.file, actual); }
      const result = await this.reader.locate(r.locator); if (result.code) throw new Error(result.code);
      if (validateCatalogRecord(r).some(e => ["INVALID_CATALOG_KEY", "INVALID_RECORD_HASH", "UNAUTHORIZED_CUSTOMER_OR_RUNTIME_APPROVAL"].includes(e))) throw new Error("INVALID_ORIGINAL_CATALOG_CONTRACT");
      return result.value;
    })());
    return this.rawCache.get(key)!;
  }
  async proof(key: CatalogKey): Promise<SourceMeaningProof> {
    if (!this.proofCache.has(key)) this.proofCache.set(key, (async () => {
      const r = this.graph.byKey.get(key)!; const raw = await this.raw(key);
      const fields: JsonRecord = isRecord(raw) ? selected(raw, meaningNames) : { value: raw };
      for (const pointer of this.direct.get(key)?.sourceFields ?? []) fields[pointer] = originalField(raw, pointer);
      return { catalogKey: key, originalId: r.originalId, locator: r.locator, originalRecordHash: r.locator.recordSha256!, actualRecordHash: recordHash(raw), fileHash: this.checkedFiles.get(r.locator.file)!, meaningFields: fields, originalState: r.originalState, actualPersonalFact: false };
    })());
    return this.proofCache.get(key)!;
  }
  async prepare(): Promise<void> {
    const moduleFile = this.input.config.staticModules.mbtiCore;
    if (moduleFile && this.reader.exists(moduleFile)) {
      this.reader.text(moduleFile);
      if (this.reader.files.get(moduleFile) !== this.input.frozen.get(moduleFile)) throw new Error("ORIGINAL_MBTI_DOMAIN_DEFINITION_CHANGED");
      const ex = await this.reader.exports(moduleFile);
      if (!isRecord(ex.MBTI_TRAIT_DOMAINS)) throw new Error("MBTI_DOMAIN_DECLARATION_MISSING");
      this.mbtiDomainMap = ex.MBTI_TRAIT_DOMAINS;
    }

    for (const rule of this.input.config.rules) {
      const r = this.unique(rule.originalId), raw = await this.raw(r.catalogKey), declaration = originalField(raw, rule.field);
      if (typeof declaration !== "string" || !declaration.includes(rule.exactDeclaration)) throw new Error("POLICY_DECLARATION_CHANGED:" + rule.id);
      this.policyProofs.push({ rule, proof: await this.proof(r.catalogKey) });
    }
    for (const [key, review] of this.direct) {
      const proof = await this.proof(key), raw = await this.raw(key);
      if (proof.originalRecordHash !== review.originalRecordHash || review.reviewActorType !== "CODEX_MODEL" || review.operatorApproved !== false || review.customerApproved !== false || !review.sourceFields.length || review.sourceFields.some(p => originalField(raw, p) === undefined)) throw new Error("MODEL_REVIEW_NOT_BOUND_TO_EXACT_SOURCE:" + review.reviewId);
      if (![review.commonUnits, review.differingUnits, review.requiredConditions, review.prohibitedUses, review.counterexamples].every(a => a.length && a.every(v => typeof v === "string" && v.length))) throw new Error("INCOMPLETE_DIRECT_READING_RECORD");
      for (const id of review.supportingOriginalIds) await this.proof(this.unique(id).catalogKey);
    }
    for (const policy of [...this.input.config.products, ...this.input.config.relationships]) for (const id of policy.originalIds) await this.proof(this.unique(id).catalogKey);
  }
  private relationships(r: KnowledgeCatalogRecord, raw: unknown): RelationshipCategory[] {
    const declared = isRecord(raw) ? [raw.relationshipType, raw.relationshipCategory, raw.category] : [];
    return [...new Set([...r.applicability.relationships, ...declared.filter((v): v is RelationshipCategory => typeof v === "string" && this.input.config.relationships.some(p => p.id === v))])];
  }
  private async tracePolicy(key: CatalogKey, categories: RelationshipCategory[]): Promise<AncestorPolicyReceipt> {
    const trace = this.graph.trace(key), prohibitions: AncestorPolicyReceipt["prohibitions"] = [];
    for (const ancestor of trace.requiredSourceKeys) {
      const domains = declaredDomains(await this.raw(ancestor));
      const record = this.graph.byKey.get(ancestor)!;
      if (record.namespace === "FOUNDATION" && record.locator.file.startsWith(this.input.config.mbtiSourceRoot + "/") && record.locator.pointer?.startsWith("/traits/")) {
        const area = record.locator.pointer.split("/")[2];
        if (typeof this.mbtiDomainMap[area] !== "string") throw new Error("EXACT_MBTI_DOMAIN_DECLARATION_REQUIRED");
        domains.push(this.mbtiDomainMap[area] as string);
      }
      for (const { rule } of this.policyProofs) if (categories.includes(rule.relationship)) for (const domain of domains) if (rule.prohibitedDomains.includes(domain)) prohibitions.push({ ruleId: rule.id, ancestor, domain });
    }
    return { ...trace, prohibitions };
  }
  private async receipt(key: CatalogKey): Promise<SemanticReviewReceipt> {
    const review = this.direct.get(key) ?? null;
    return { receiptKey: `sdv:receipt:${hash(canonicalJson([key, this.input.config.version, review]))}`, catalogKey: key, sourceProof: await this.proof(key), directReview: review, supportingSourceProofs: await Promise.all((review?.supportingOriginalIds ?? []).map(id => this.proof(this.unique(id).catalogKey))), reviewMethod: review ? "DIRECT_SOURCE_READING" : "DETERMINISTIC_STRUCTURAL_CHECK", reviewActorType: review ? "CODEX_MODEL" : "MECHANICAL", humanOperatorApproval: false, customerApproved: false, clockIncluded: false };
  }
  async decide(entry: DomainQueueEntry): Promise<{ decision: SemanticDomainDecision; receipt: SemanticReviewReceipt; ancestry: AncestorPolicyReceipt }> {
    const r = this.graph.byKey.get(entry.catalogKey); if (!r || r.originalId !== entry.originalId) throw new Error("DOMAIN_QUEUE_IDENTITY_MISMATCH");
    if (entry.originalSourceProof.matchedCatalogKey !== r.catalogKey || entry.originalSourceProof.originalId !== r.originalId || entry.originalSourceProof.expectedHash !== r.locator.recordSha256 || entry.originalSourceProof.actualHash !== r.locator.recordSha256) throw new Error("SOURCE_PROOF_IDENTITY_MISMATCH");
    if ([...entry.ancestorReferenceKeys, ...entry.remainingReferenceBlockers].some(k => !this.sourceReferenceKeys.has(k))) throw new Error("SOURCE_VERIFICATION_RECEIPT_MISSING");
    const raw = await this.raw(r.catalogKey);
    if (canonicalJson(entry.originalDomain) !== canonicalJson(isRecord(raw) ? raw.domain ?? raw.domains ?? null : null)) throw new Error("ORIGINAL_DOMAIN_VALUE_MISMATCH");
    const body = isRecord(raw) ? raw : {}, receipt = await this.receipt(r.catalogKey), categories = this.relationships(r, raw);
    const ancestry = await this.tracePolicy(r.catalogKey, categories), blocked: SemanticDomainWithholdReason[] = [];
    const add = (code: string, detail: unknown, sources: CatalogKey[] = []) => blocked.push({ code, catalogKey: r.catalogKey, sourceKeys: sources, detail, nextAction: "Keep this scoped use withheld; verify the exact original condition and obtain the missing review or actual Evidence in a separate stage." });
    if (entry.classifications.includes("ORIGINAL_POLICY_PROHIBITS") || ancestry.prohibitions.length) add("EXPLICITLY_PROHIBITED", ancestry.prohibitions.length ? ancestry.prohibitions : entry.policyProofs, ancestry.prohibitions.map(p => p.ancestor));
    const incomplete = [...new Set([...entry.remainingReferenceBlockers, ...ancestry.incompleteReferenceKeys])];
    if (incomplete.length) add("SOURCE_INCOMPLETE", incomplete);
    const unsupported: CatalogKey[] = [];
    for (const key of ancestry.requiredSourceKeys) { const v = await this.raw(key); if (isRecord(v) && (v.producerSupport === "unsupported" || v.crossSupport === "unsupported_withhold" || isRecord(v.support) && v.support.calculation === "unsupported")) unsupported.push(key); }
    if (unsupported.length) add("UNSUPPORTED_PRODUCER", "Exact original unsupported declaration; no new producer is inferred.", unsupported);
    if (isRecord(body.originalState) && body.originalState.currentProjectionAllowed === false) add("ORIGINAL_PROJECTION_NOT_ALLOWED", body.originalState);
    if (!receipt.directReview) add("SEMANTIC_REVIEW_REQUIRED", "No direct reading review for this exact source hash and proposed use.");
    if (entry.classifications.includes("PRODUCT_POLICY_REQUIRED")) add("PRODUCT_POLICY_REVIEW_REQUIRED", r.applicability.products);
    if (!categories.length && !r.applicability.products.length) add("TARGET_PRODUCT_AND_RELATIONSHIP_UNKNOWN", "UNKNOWN");
    const current = blocked.some(b => b.code === "EXPLICITLY_PROHIBITED") ? "EXPLICITLY_PROHIBITED" : incomplete.length ? "SOURCE_INCOMPLETE" : unsupported.length ? "UNSUPPORTED_PRODUCER" : r.kind === "REJECTED_OR_HELD" || body.status === "rejected" ? "NOT_APPLICABLE" : blocked.some(b => b.code === "ORIGINAL_PROJECTION_NOT_ALLOWED") ? "POLICY_REVIEW_REQUIRED" : receipt.directReview ? receipt.directReview.semanticRelation === "CONDITIONAL" ? "CONDITIONAL_CROSSWALK_REVIEWED" : "REVIEWED_MEANING_NOT_CUSTOMER_APPROVED" : entry.classifications.includes("PRODUCT_POLICY_REQUIRED") ? "POLICY_REVIEW_REQUIRED" : "SEMANTIC_REVIEW_REQUIRED";
    const originalRequirements = selected(body, ["requirements", "requires", "prerequisites", "requiredEvidence", "evidenceRequired", "applicationGate", "condition", "conditions", "strengthConditions", "unsupportedProducerScopeRefs", "sourcePolicy"]);
    const requiredEvidence = ["ACTUAL_SOURCE_AND_PRODUCER", "ACTUAL_OWNER_AND_DIRECTION", "ALL_ANCESTOR_DOMAINS", "ORIGINAL_CONDITIONS_AND_COUNTEREXAMPLES", "ACTUAL_TIME_SCOPE_AND_COMPATIBLE_GROUP", "HUMAN_OPERATOR_AND_CUSTOMER_APPROVAL"].map(gate => ({ gate, originalDeclaration: Object.keys(originalRequirements).length ? originalRequirements : "UNKNOWN", suppliedBy: "FUTURE_EVIDENCE_GRAPH_OR_OPERATOR" as const, fulfilled: false as const }));
    const decision: SemanticDomainDecision = {
      decisionKey: `sdv:decision:${hash(canonicalJson([r.catalogKey, this.input.config.version]))}`, catalogKey: r.catalogKey, originalId: r.originalId, researchFamily: r.family, originalRecordHash: r.locator.recordSha256!,
      sourceVerificationReferenceKeys: [...new Set([...entry.ancestorReferenceKeys, ...ancestry.sourceReferenceKeys])].sort(), originalMeaning: Object.keys(receipt.sourceProof.meaningFields).length ? receipt.sourceProof.meaningFields : "UNKNOWN", targetMeaning: receipt.directReview?.proposedMeaning ?? "UNKNOWN",
      sourceDomain: entry.originalDomain, targetDomain: body.targetDomain ?? "UNKNOWN", targetProduct: r.applicability.products.length ? r.applicability.products : "UNKNOWN", targetRelationship: categories.length ? categories : "UNKNOWN", context: body.context ?? body.contexts ?? body.requiredContext ?? "UNKNOWN", semanticAxis: body.axis ?? body.axes ?? "UNKNOWN", semanticFacet: body.semanticFacets ?? body.facets ?? body.facetRefs ?? "UNKNOWN",
      semanticRelation: receipt.directReview?.semanticRelation ?? "INSUFFICIENT_VERIFICATION", declaredRelationNotApproved: crosswalk(r).relation,
      requiredEvidence, requiredUserState: body.requiredUserState ?? body.additionalInput ?? (isRecord(body.requirements) ? body.requirements.additionalInput ?? "UNKNOWN" : "UNKNOWN"), counterexamples: body.counterexample ?? body.counterexamples ?? "UNKNOWN", prohibitedInference: selected(body, ["disallowed", "doNotApply", "doNotInfer", "forbiddenClaims", "exclusions", "prohibitedClaim", "prohibitedInference", "disallowedClaims"]),
      originalPolicyRefs: [...new Set([...entry.policyProofs.map(p => p.originalId).filter((p): p is string => p !== null), ...ancestry.prohibitions.map(p => p.ruleId), ...categories.flatMap(c => this.input.config.relationships.find(p => p.id === c)?.originalIds ?? [])])], ancestryRefs: ancestry.requiredSourceKeys, originalSourceReviewState: r.review,
      domain: { state: blocked.some(b => b.code === "EXPLICITLY_PROHIBITED") ? "PROHIBITED" : "UNKNOWN", originalDomain: entry.originalDomain, targetDomain: body.targetDomain ?? "UNKNOWN", automaticEquivalence: false },
      products: (r.applicability.products.length ? r.applicability.products : ["UNKNOWN" as const]).map(product => ({ product, state: "REVIEW_REQUIRED", policyIds: this.input.config.products.find(p => p.id === product)?.originalIds ?? [], actualInputVerified: false })),
      relationships: (categories.length ? categories : ["UNKNOWN" as const]).map(relationship => ({ relationship, state: ancestry.prohibitions.length ? "PROHIBITED" : "REVIEW_REQUIRED", policyIds: this.input.config.relationships.find(p => p.id === relationship)?.originalIds ?? [], actualRolesVerified: false })),
      reviewMethod: receipt.reviewMethod, reviewActorType: receipt.reviewActorType, reviewState: receipt.directReview ? "CODEX_MODEL_REVIEWED_OPERATOR_PENDING" : "UNREVIEWED", decisionState: current, blockingReasons: blocked, receiptKey: receipt.receiptKey, customerApproved: false, actualCalculatedEvidence: "NOT_SUPPLIED", runtimeConnected: false,
    };
    return { decision, receipt, ancestry };
  }
  async groups(): Promise<GroupSemanticReview[]> {
    const result: GroupSemanticReview[] = [];
    for (const original of this.input.sourceGroups) {
      const r = this.graph.byKey.get(original.catalogKey)!; const categories = this.relationships(r, await this.raw(r.catalogKey));
      const groups: GroupSemanticReview["groups"] = [];
      for (const g of original.groups) {
        const found = g.requiredSources.map(key => this.graph.sourceKey(r.family, key));
        const sources = found.flatMap(r => r.length === 1 ? [r[0].catalogKey] : []);
        const ancestry = await Promise.all(sources.map(key => this.tracePolicy(key, categories)));
        const blockers = [...(original.semantics === "UNKNOWN_GROUP_SEMANTICS" ? ["UNKNOWN_GROUP_SEMANTICS"] : []), ...(g.status === "WITHHELD" || found.some(r => r.length !== 1) || !g.requiredSources.length ? ["ORIGINAL_SOURCE_GROUP_INCOMPLETE"] : []), ...(ancestry.some(a => a.prohibitions.length) ? ["EXPLICITLY_PROHIBITED_ANCESTOR_IN_THIS_GROUP"] : []), ...(ancestry.some(a => a.incompleteReferenceKeys.length) ? ["SOURCE_INCOMPLETE"] : []), ...(g.conflictingOwnerTypeDeclarations ? ["OWNER_TYPE_CONFLICT"] : []), "ACTUAL_DISPLAYED_COMPATIBLE_GROUP_REQUIRED", "ACTUAL_OWNER_DIRECTION_TIME_REQUIRED", "CUSTOMER_APPROVAL_REQUIRED"];
        groups.push({ originalGroup: g.originalGroup, requiredSources: g.requiredSources, verifiedSources: sources, ancestry, groupState: blockers.some(b => ["UNKNOWN_GROUP_SEMANTICS", "ORIGINAL_SOURCE_GROUP_INCOMPLETE", "EXPLICITLY_PROHIBITED_ANCESTOR_IN_THIS_GROUP", "SOURCE_INCOMPLETE", "OWNER_TYPE_CONFLICT"].includes(b)) ? "WITHHELD" : "DECLARATION_CHECKED_ACTUAL_GROUP_PENDING", blockers });
      }
      result.push({ catalogKey: r.catalogKey, originalGroupReview: original, groups, allAlternativesMustNotBeMerged: true, actualDisplayedGroup: "UNKNOWN", customerApproved: false });
    }
    return result;
  }
  private async staticInventory(): Promise<{ schema: JsonRecord; mbti: unknown[] }> {
    const files = this.input.config.staticModules;
    for (const file of Object.values(files)) { this.reader.text(file); if (this.reader.files.get(file) !== this.input.frozen.get(file)) throw new Error("STATIC_DEFINITION_HASH_MISMATCH"); }
    const core = await this.reader.exports(files.semanticCore), types = await this.reader.exports(files.types), rank = await this.reader.exports(files.ranking), mbtiCore = await this.reader.exports(files.mbtiCore), fusion = await this.reader.exports(files.fusionCore);
    const nodeModule = await this.reader.exports(files.mbtiInventory), annotationsModule = await this.reader.exports(files.mbtiAnnotations);
    if (typeof nodeModule.inventoryMbtiSource !== "function" || typeof annotationsModule.annotateMbtiSource !== "function") throw new Error("STATIC_MBTI_REVIEW_FUNCTION_MISSING");
    const inventory = nodeModule.inventoryMbtiSource as typeof import("../../../interpretation-v4/mbtiSourceAdapter").inventoryMbtiSource;
    const annotate = annotationsModule.annotateMbtiSource as typeof import("../../../interpretation-v4/mbtiSemanticAnnotations").annotateMbtiSource;
    const profiles = this.input.records.filter(r => r.namespace === "FOUNDATION" && r.locator.pointer === "" && r.locator.file.endsWith(".json") && typeof r.metadata.type === "string").sort((a, b) => String(a.metadata.type).localeCompare(String(b.metadata.type), "en"));
    const mbti = [];
    for (const r of profiles) {
      const raw = await this.raw(r.catalogKey), type = r.metadata.type as Parameters<typeof inventory>[0];
      const original = inventory(type, raw), reviewed = annotate(type, original.nodes);
      mbti.push({ type, sourceLocator: r.locator, fileSha256: this.checkedFiles.get(r.locator.file), sourceNodeCount: reviewed.nodes.length, classifications: Object.fromEntries([...new Set(reviewed.nodes.map(n => n.classification))].sort().map(c => [c, reviewed.nodes.filter(n => n.classification === c).length])), sourceCoverage: Object.fromEntries([...new Set(reviewed.nodes.map(n => n.sourceCoverage).filter((s): s is string => s !== undefined))].sort().map(c => [c, reviewed.nodes.filter(n => n.sourceCoverage === c).length])), originalNodeSha256: hash(canonicalJson(reviewed.nodes)), originalAnnotationSha256: hash(canonicalJson(reviewed.annotations)), hardErrors: [...original.hardErrors, ...reviewed.hardErrors], directIsNotEmpiricalValidity: true, referenceOnlyPromotionAllowed: false, reviewer: "EXISTING_STATIC_INVENTORY_AND_ANNOTATION_DECLARATIONS", actualPersonSupplied: false, customerApproved: false });
    }
    const schema = { bipolarAxes: core.BIPOLAR_AXES, strengthAxes: core.STRENGTH_AXES, originalDirections: core.BIPOLAR_DIRECTIONS, dynamicTags: core.DYNAMIC_TAGS, fortuneTags: core.FORTUNE_TAGS, v4Domains: types.V4_DOMAINS, semanticTags: this.reader.typeLiterals(files.types, "SemanticTag"), contexts: this.reader.typeLiterals(files.semanticCore, "InterpretationContext"), broadThemes: rank.BROAD_SEMANTIC_THEMES, mbtiDomainContexts: mbtiCore.MBTI_DOMAIN_CONTEXTS, mbtiWeightClasses: mbtiCore.MBTI_WEIGHT_CLASSES, fusionSystems: [{ name: "Legacy Fusion", originalTypes: this.reader.typeLiterals(files.types, "FusionKind"), definitionFile: files.types }, { name: "Semantic Fusion", originalTypes: fusion.FUSION_TYPES, definitionFile: files.fusionCore }, { name: "Fusion Complement", originalRuleCount: this.input.records.filter(r => r.locator.exportName === "FUSION_COMPLEMENT_RULES").length, interchangeableWithLegacy: false }, { name: "Personal Resonance", originalExportSymbols: [...this.reader.exportedSymbols(files.resonanceCore)].sort(), definitionFile: files.resonanceCore, interchangeableWithFusion: false }, { name: "Conditional Fusion Research", actualFact: false, bothSamePersonRootsRequired: true }] };
    return { schema, mbti };
  }
  async run(): Promise<SemanticArtifacts> {
    await this.prepare();
    const rows = [];
    for (const entry of this.input.domainQueue) rows.push(await this.decide(entry));
    const reviews = await Promise.all([...this.direct.keys()].map(k => this.receipt(k)));
    const groups = await this.groups();
    const already = new Set(rows.map(r => r.decision.catalogKey));
    const friendship = this.input.config.relationships.find(p => p.id === "friendship")!;
    const prefix = friendship.originalIds[0].split(":")[0] + ":";
    const extraAncestry = [];
    for (const r of this.input.records.filter(r => r.originalId.startsWith(prefix) && !already.has(r.catalogKey))) extraAncestry.push(await this.tracePolicy(r.catalogKey, ["friendship"]));
    const select = (name: string) => this.input.records.filter(r => r.locator.exportName === name);
    const facets = await Promise.all(select("SEMANTIC_FACETS").map(async r => ({ catalogKey: r.catalogKey, originalId: r.originalId, originalRecordHash: r.locator.recordSha256, declaration: await this.raw(r.catalogKey), structuralRelation: "PARTIAL_PARENT_SCOPE_ONLY", fullAxisEquivalence: false, actualFacetObserved: false, customerApproved: false })));
    const tags = await Promise.all(select("LEGACY_TAG_RESEARCH").map(async r => ({ catalogKey: r.catalogKey, originalId: r.originalId, declaration: await this.raw(r.catalogKey), actualRelation: this.direct.get(r.catalogKey)?.semanticRelation ?? "INSUFFICIENT_VERIFICATION", automaticAxisEquivalence: false, customerApproved: false })));
    const definitions = await Promise.all(select("AXIS_RESEARCH").map(async r => ({ catalogKey: r.catalogKey, declaration: await this.raw(r.catalogKey), reviewActorType: this.direct.has(r.catalogKey) ? "CODEX_MODEL" : "MECHANICAL", scoresChanged: false, negativeIsDefect: false, lowStrengthIsOpposite: false })));
    const contexts = await Promise.all(select("CONTEXT_DOMAIN_RESEARCH").map(async r => ({ catalogKey: r.catalogKey, declaration: await this.raw(r.catalogKey), actualRelation: this.direct.get(r.catalogKey)?.semanticRelation ?? "INSUFFICIENT_VERIFICATION", declaredScopeIsNotCustomerApproval: true })));
    const fusion = await Promise.all(this.input.records.filter(r => r.kind === "FUSION_RESEARCH").map(async r => {
      const raw = await this.raw(r.catalogKey);
      return { catalogKey: r.catalogKey, originalId: r.originalId, originalHash: r.locator.recordSha256, originalState: r.originalState, originalDeclarations: isRecord(raw) ? selected(raw, ["origin", "scope", "scopeRef", "existingRuleId", "existingRuleSha256", "originalMeaning", "coreMeaning", "myeongli", "mbti", "facets", "contexts", "conditions", "counterexample", "exclusions", "orientationPolicy", "sourceFactPolicy", "missingEvidencePolicy"]) : "UNKNOWN", bothSamePersonRootsRequired: true, directionContextRuleAndHashRequired: true, actualRootsSupplied: false, independentFactsAdded: 0, customerApproved: false };
    }));
    const staticInventory = await this.staticInventory();
    const specialistProducts = new Map<string, unknown[]>(), specialistRelationships = new Map<string, unknown[]>();
    for (const r of this.input.records) {
      const question = r.metadata.readerQuestion ?? r.metadata.question;
      if (question === undefined) continue;
      const row = { catalogKey: r.catalogKey, originalId: r.originalId, originalRecordHash: r.locator.recordSha256, question, originalConditions: selected(r.metadata, ["requirements", "prerequisites", "requires", "applicationGate", "counterexample", "prohibitedInference", "exclusions"]), sourceDomain: r.metadata.domain ?? r.metadata.domains ?? "UNKNOWN", context: r.applicability.fields.context ?? r.applicability.fields.contexts ?? r.metadata.context ?? r.metadata.contexts ?? "UNKNOWN", actualUseReviewed: this.direct.has(r.catalogKey) };
      for (const product of r.applicability.products) specialistProducts.set(product, [...(specialistProducts.get(product) ?? []), row]);
      const relationships = r.applicability.relationships.length ? r.applicability.relationships : r.originalId.startsWith(prefix) ? this.relationships(r, await this.raw(r.catalogKey)) : [];
      for (const category of relationships) specialistRelationships.set(category, [...(specialistRelationships.get(category) ?? []), row]);
    }
    const inventory: JsonRecord = { specialistProductQuestions: Object.fromEntries(specialistProducts), specialistRelationshipQuestions: Object.fromEntries(specialistRelationships), axes: definitions, contexts, axisCount: select("AXIS_RESEARCH").length, facetCount: facets.length, legacyTagCount: tags.length, contextDomainDeclarations: contexts.length, broadThemeCount: select("BROAD_THEME_RESEARCH").length, actualScoringChanged: false, ...staticInventory.schema };
    const crosswalks = this.input.records.filter(r => r.kind === "CROSSWALK").map(r => ({ ...crosswalk(r), originalRecordHash: r.locator.recordSha256, reviewedRelation: this.direct.get(r.catalogKey)?.semanticRelation ?? "INSUFFICIENT_VERIFICATION", automaticEquivalence: false, customerApproved: false }));
    const saju = await Promise.all(this.input.records.filter(r => r.namespace === "FOUNDATION" && /saju|foundation-/.test(r.locator.file) || ["COMPOSITE_PROFILES", "RELATION_PROFILES", "TEMPORAL_SCOPES"].includes(r.locator.exportName ?? "")).map(async r => {
      const raw = await this.raw(r.catalogKey);
      return { catalogKey: r.catalogKey, originalId: r.originalId, locator: r.locator, originalDeclarations: r.metadata, originalState: r.originalState, declaredMeaningClassification: isRecord(raw) ? selected(raw, ["class", "evidenceLevel", "verification", "review", "sourceStatus", "definitionRelation"]) : "UNKNOWN", declaredProducerAndScope: isRecord(raw) ? selected(raw, ["support", "producerSupport", "producerScopeRefs", "unsupportedProducerScopeRefs", "scopeRefs", "scope"]) : "UNKNOWN", originalLimitations: isRecord(raw) ? selected(raw, ["doNotApply", "doNotInfer", "forbiddenClaims", "prohibitedInference", "exclusions", "conditions", "prerequisites"]) : "UNKNOWN", definitionIsNotCalculatedPersonalFact: true, traditionalIsNotEmpiricalPrediction: true, customerApproved: false };
    }));
    const allSourceFiles = [...this.reader.files].sort(([a], [b]) => a.localeCompare(b, "en"));
    const decisions = rows.map(r => r.decision), states = [...new Set(decisions.map(r => r.decisionState))].sort();
    return { decisions, receipts: rows.map(r => r.receipt), ancestry: [...rows.map(r => r.ancestry), ...extraAncestry], groups, reviews, policyProofs: this.policyProofs, inventory, crosswalk: crosswalks, facets, tags, fusion, saju, mbti: staticInventory.mbti, duplication: reviews.map(r => ({ catalogKey: r.catalogKey, meaningReuseNeedsActualRootAndIntroducedLedger: true, originalDeclaration: this.graph.byKey.get(r.catalogKey)?.metadata.sourceFactPolicy ?? "UNKNOWN", independentFactsAdded: 0, newApplicationNotIndependentFact: true })), sourceIntegrity: allSourceFiles.map(([file, sha256]) => ({ file, sha256 })),
      manifest: { version: this.input.config.version, baseSha: this.input.config.baseSha, domainQueueTotal: this.input.domainQueue.length, domainQueueClassified: decisions.length, actualMeaningReviewed: reviews.length, actualMeaningReviewedInDomainQueue: decisions.filter(d => d.reviewActorType === "CODEX_MODEL").length, meaningReviewPendingInDomainQueue: decisions.filter(d => d.reviewActorType !== "CODEX_MODEL").length, domainExplicitProhibitions: decisions.filter(d => d.blockingReasons.some(b => b.code === "EXPLICITLY_PROHIBITED")).length, inheritedExplicitProhibitions: this.input.domainQueue.filter(q => q.classifications.includes("ORIGINAL_POLICY_PROHIBITS")).length, inheritedSourceIncomplete: this.input.domainQueue.filter(q => q.classifications.includes("INCOMPLETE_SOURCE")).length, sourceIncomplete: decisions.filter(d => d.blockingReasons.some(b => b.code === "SOURCE_INCOMPLETE")).length, productPolicyReview: decisions.filter(d => d.blockingReasons.some(b => b.code === "PRODUCT_POLICY_REVIEW_REQUIRED")).length, unsupportedProducers: decisions.filter(d => d.blockingReasons.some(b => b.code === "UNSUPPORTED_PRODUCER")).length, decisionStates: Object.fromEntries(states.map(s => [s, decisions.filter(d => d.decisionState === s).length])), sourceGroups: groups.length, inheritedSourceGroupBlockers: this.input.sourceGroups.filter(g => g.groups.some(s => s.status === "WITHHELD")).length, ancestryAudits: rows.length + extraAncestry.length, friendshipChildPolicyBlocks: extraAncestry.filter(a => a.prohibitions.some(p => p.domain === "CHILDREN")).length, humanOperatorReviewed: 0, humanReviewRequired: decisions.length, customerApproval: 0, runtimeConnection: 0, actualEvidenceIssued: 0, deterministicClockExcluded: true }, };
  }
}
