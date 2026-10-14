import { mkdtempSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, expect, it } from "vitest";
import { SourceReader, hash, recordHash, canonicalJson } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { stableJson } from "@/lib/report-knowledge/knowledge-integration-foundation/compiler";
import { groupSemantics } from "@/lib/report-knowledge/knowledge-integration-foundation/normalization";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { namespace, technicallyVerified } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/classification";
import { writeVerificationArtifacts } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/artifacts";
import { assessSourceUseFixture, BINDING_SAFETY_REQUIREMENTS, type SourceUseFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/safety";
import type { CatalogConfig, JsonRecord, KnowledgeCatalogRecord, KnowledgeReferenceEdge } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import type { VerificationArtifacts, VerificationConfig } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/types";
const folder = "docs/validation/v4-knowledge-source-verification-01";
const json = <T,>(file: string): T => JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const config = json<VerificationConfig>(`${folder}/verification-config.json`);
const catalogConfig = json<CatalogConfig>(config.catalogConfig);
const frozen = new Map(Object.entries(json<Record<string, string>>(`${folder}/original-file-hashes.json`)));
const index = json<{ shard: string }[]>(`${config.catalogRoot}/knowledge-catalog.json`);
const records = [...new Set(index.map(r => r.shard))].flatMap(s => json<KnowledgeCatalogRecord[]>(`${config.catalogRoot}/${s}`));
const edges = json<{ shard: string }[]>(`${config.catalogRoot}/knowledge-edges.json`).flatMap(s => json<KnowledgeReferenceEdge[]>(`${config.catalogRoot}/${s.shard}`));
const unresolved = json<KnowledgeReferenceEdge[]>(`${config.catalogRoot}/unresolved-references.json`);
const loader = async (file: string) => import(/* @vite-ignore */ pathToFileURL(file).href);
const reader = () => new SourceReader(process.cwd(), loader, [...catalogConfig.knownSourceVersions, config.baseSha]);
const newEngine = () => new SourceVerificationEngine(reader(), records, edges, config, catalogConfig, frozen);
let engine: SourceVerificationEngine, artifacts: VerificationArtifacts;
beforeAll(async () => { engine = newEngine(); artifacts = await engine.run(unresolved); }, 180000);
const edge = (target: unknown, from = records[0], field = "/fixture"): KnowledgeReferenceEdge => ({ from: from.catalogKey, to: null, kind: "REFERENCES", field, target, resolution: "UNRESOLVED", reason: "TARGET_ID_NOT_INDEXED", establishesPersonalEvidence: false });
const verify = (target: unknown) => engine.verify(edge(target), 0);
const mbtiId = "mbti:ISTJ:traits:money:family_responsibility_spending";
function fixture(values: JsonRecord[], customize: (r: KnowledgeCatalogRecord, i: number) => KnowledgeCatalogRecord = r => r) {
  const root = mkdtempSync(join(tmpdir(), "source-verification-fixture-"));
  writeFileSync(join(root, "original.json"), stableJson(values));
  const rs = values.map((v, i) => customize({ ...records[0], catalogKey: `kc:v1:${hash(String(i))}`, originalId: String(v.id), family: "fixture", kind: "SOURCE_KNOWLEDGE", metadata: v, groupSemantics: groupSemantics(v), locator: { file: "original.json", pointer: `/${i}`, originalId: String(v.id), recordSha256: recordHash(v), sourceVersion: config.baseSha } }, i));
  const hashes = new Map([["original.json", hash(readFileSync(join(root, "original.json")))]]);
  const sr = new SourceReader(root, async () => ({ COMPLETION_DAYPILLARS: values }), [config.baseSha]);
  const cfg = { ...config, aliasDocuments: [], declarationSources: [], nativeDefinitionFiles: [], domainPolicies: [] };
  const cc = { ...catalogConfig, families: [{ name: "fixture", expected: values.length, documentation: ".", defaultKind: "SOURCE_KNOWLEDGE" as const, exportKinds: {} }] };
  return { root, rs, hashes, sr, make: (fixtureEdges: KnowledgeReferenceEdge[] = []) => new SourceVerificationEngine(sr, rs, fixtureEdges, cfg, cc, hashes) };
}
it("01 preserves all 6490 original occurrences, ordinals, targets, fields, reasons and stable keys", () => {
  expect(artifacts.receipts).toHaveLength(6490); expect(new Set(artifacts.receipts.map(r => r.referenceKey)).size).toBe(6490);
  artifacts.receipts.forEach((r, i) => { const e = unresolved[i]; expect([r.affectedCatalogKey, r.referenceField, r.referenceKind, r.originalTarget, r.originalReason, r.originalEdgeOrdinal]).toEqual([e.from, e.field, e.kind, e.target, e.reason, i]); expect(r.originalReferencePreserved).toBe(true); expect(r.originalCatalogKey).toBe(e.from); expect(r.originalField).toBe(e.field); });
});
it("02 classifies the eighteen declared reference namespaces without coercing unknown strings", () => {
  const cases: [unknown, string, string][] = [[records[0].catalogKey, "", "CATALOG_KEY"], ["rr:x", "", "RESEARCH_ID"], ["completion:x", "", "FOUNDATION_ID"], [{ file: "x", exportName: "E" }, "", "LOCATOR"], [{ file: "x", pointer: "/0" }, "", "JSON_POINTER"], [mbtiId, "", "MBTI_STRUCTURED_ID"], ["taxonomy:x", "", "SAJU_KNOWLEDGE_ID"], ["sar:x", "", "SEMANTIC_ID"], ["fkr:x", "", "FUSION_ID"], ["ckr:x", "", "PRODUCT_RESEARCH_ID"], ["bppr:x", "", "RELATIONSHIP_RESEARCH_ID"], ["ker:x", "", "EDITORIAL_ID"], [{ sourceId: "sm2", passage: "論三刑" }, "", "TRADITIONAL_SOURCE_ID"], [{ auditRef: "audit.json#x" }, "", "AUDIT_REFERENCE"], ["completion:x#core", "", "FIELD_FRAGMENT"], ["sar:gate:x", "", "FUTURE_BINDING_REQUIREMENT"], ["natal:person", "", "CALCULATED_EVIDENCE_REQUIREMENT"], ["알 수 없는 문장", "", "UNKNOWN"]];
  expect(cases.map(([target, field]) => namespace(target, field, config))).toEqual(cases.map(c => c[2]));
});
it("03 verifies exact catalog key and actual file/export/pointer/ID/hash without semantic substitution", async () => {
  const r = records.find(r => r.originalId === "completion:day_pillar:丙午")!;
  expect((await verify(r.catalogKey)).resolutionState).toBe("EXACT_SOURCE_VERIFIED");
  expect((await verify(r.locator)).resolutionState).toBe("EXACT_SOURCE_VERIFIED");
  const source = await engine.reader.locate(r.locator);
  const canonicalPointer = { ...r.locator }; delete canonicalPointer.recordSha256; delete canonicalPointer.recordHashEncoding;
  expect((await verify({ ...canonicalPointer, sha256: hash(canonicalJson(source.value)) })).resolutionState).toBe("EXACT_SOURCE_VERIFIED");
});
it("04 blocks wrong original ID and missing ID without approximate or first-match fallback", async () => {
  expect(technicallyVerified(await verify("completion:day_pillar:不存在"))).toBe(false);
  const r = records.find(r => r.originalId === "completion:day_pillar:丙午")!;
  expect(technicallyVerified(await verify({ ...r.locator, originalId: "wrong" }))).toBe(false);
});
it("05 leaves an ambiguous sm2 alias blocked and only qualifies a copied source with hash-checked ancestry", async () => {
  const ambiguous = await verify({ sourceId: "sm2", passage: "論三刑" });
  expect(ambiguous.resolutionState).toBe("AMBIGUOUS_SOURCE"); expect(ambiguous.candidateTargets.length).toBeGreaterThan(1);
  const verified = artifacts.receipts.find(r => r.verificationMethod === "HASH_VERIFIED_ORIGINAL_FAMILY_AND_EDITION_REGISTRY")!;
  expect(verified).toBeDefined(); expect(verified.verificationEvidence).toHaveLength(2);
  expect(verified.verificationEvidence.every(p => p.expectedHash === p.actualHash)).toBe(true);
  expect(verified.sourceReviewState.TRADITIONAL_SOURCE_REVIEW).toBe("UNREVIEWED");
});
it("06 blocks wrong record, file, canonical and plainKo hashes", async () => {
  const r = records.find(r => r.originalId === "completion:day_pillar:丙午")!;
  for (const field of ["recordSha256", "fileSha256", "sha256", "plainKoSha256"]) expect((await verify({ ...r.locator, [field]: "0".repeat(64) })).resolutionState).toBe("SOURCE_HASH_MISMATCH");
});
it("07 validates both commit sourceVersion and file-hash sourceVersion", async () => {
  const r = records.find(r => r.originalId === "completion:day_pillar:丙午")!;
  for (const version of ["0".repeat(40), "0".repeat(64), "bad-version"]) expect((await verify({ ...r.locator, sourceVersion: version })).resolutionState).toBe("SOURCE_VERSION_MISMATCH");
  expect(technicallyVerified(await verify({ ...r.locator, sourceVersion: frozen.get(r.locator.file) }))).toBe(true);
});
it("08 blocks nonexistent MBTI TYPE and a conflicting explicit TYPE/file locator", async () => {
  expect(technicallyVerified(await verify(mbtiId.replace("ISTJ", "XXXX")))).toBe(false);
  expect(technicallyVerified(await verify({ sourceId: mbtiId, passage: { file: "docs/product/mbti/source/INTJ.json", pointer: "/traits/money/4" } }))).toBe(false);
});
it("09 blocks mismatched trait area and nonexistent trait ID", async () => {
  expect(technicallyVerified(await verify(mbtiId.replace(":money:", ":romance:")))).toBe(false);
  expect(technicallyVerified(await verify(mbtiId + "_not_present"))).toBe(false);
});
it("10 checks the actual ISTJ trait pointer, meaning, both hashes and declared nested pointer", async () => {
  const r = await verify(mbtiId), file = "docs/product/mbti/source/ISTJ.json";
  expect(r.resolutionState).toBe("EXACT_SOURCE_VERIFIED"); expect(r.matchedLocator?.pointer).toBe("/traits/money/4");
  const source = json<{ traits: { money: JsonRecord[] } }>(file).traits.money[4];
  expect(source.id).toBe("family_responsibility_spending"); expect(r.actualHash).toBe(recordHash(source)); expect(r.verificationEvidence[1].actualHash).toBe(hash(readFileSync(file)));
  expect(r.verificationEvidence[0].originalMeaning).toBe(source.plainKo);
  expect(technicallyVerified(await verify({ sourceId: mbtiId, passage: { file, pointer: "/traits/money/3" } }))).toBe(false);
});
it("11 preserves original MBTI direct/inferred coverage without empirical or customer approval", () => {
  for (const r of artifacts.receipts.filter(r => r.targetNamespace === "MBTI_STRUCTURED_ID" && technicallyVerified(r))) {
    expect(r.sourceReviewState.MBTI_SOURCE_COVERAGE).toEqual(r.verificationEvidence[0].reviewState && (r.verificationEvidence[0].reviewState as JsonRecord).mbtiSourceCoverage);
    expect(r.sourceReviewState.ORIGINAL_CONTENT_REVIEW).toBe("UNREVIEWED"); expect(r.customerApproved).toBe(false);
  }
});
it("12 verifies native declarations while preserving the distinction from actual calculated facts", async () => {
  const r = await verify("SajuCalcResult"); expect(r.resolutionState).toBe("EXACT_SOURCE_VERIFIED"); expect(r.verificationStrength).toBe("DECLARATION_ONLY"); expect(r.establishesPersonalEvidence).toBe(false);
  expect((await verify("SajuCalcResult:actualPerson" )).resolutionState).toBe("FUTURE_REQUIREMENT_ONLY");
});
it("13 blocks a multi-field fragment if any required field is missing", async () => {
  const f = fixture([{ id: "completion:day_pillar:甲子", core: "core", positive: "positive" }], r => ({ ...r, locator: { ...r.locator, exportName: "COMPLETION_DAYPILLARS" } }));
  const r = await f.make().verify(edge("completion:day_pillar:甲子#core,positive,risk", f.rs[0], "/inheritedMeaningRef/0"), 0);
  expect(r.resolutionState).toBe("PARTIAL_FRAGMENT"); expect(r.blockingReasons.join(" ")).toContain("risk");
});
it("14 verifies all sixty declared comma fragments and rejects undeclared comma grammar", async () => {
  const refs = artifacts.receipts.filter(r => r.originalReason === "REFERENCE_FRAGMENT_MISSING"); expect(refs).toHaveLength(60);
  expect(refs.every(r => r.resolutionState === "FRAGMENT_VERIFIED")).toBe(true);
  expect(refs.every(r => (r.verificationEvidence[0].qualification as JsonRecord).allRequestedFieldsExist === true)).toBe(true);
  expect(technicallyVerified(await verify("completion:day_pillar:丙午#core,positive,risk"))).toBe(false);
});
it("15 separates audit-only snapshots from audit plus an explicitly located original", async () => {
  const rows = artifacts.receipts.filter(r => r.originalReason === "AUDIT_WITHOUT_ORIGINAL_LOCATOR"); expect(rows).toHaveLength(46); expect(rows.every(r => r.resolutionState === "DOCUMENTARY_REFERENCE_ONLY")).toBe(true);
  expect(rows.every(r => r.sourceReviewState.ORIGINAL_RECORD_IDENTITY === "UNREVIEWED")).toBe(true);
  const raw = { id: "source:real", meaning: "original" }, f = fixture([raw]);
  writeFileSync(join(f.root, "audit.json"), stableJson({ entries: [{ key: "entry", file: "original.json", pointer: "/0", recordSha256: recordHash(raw), raw }] }));
  f.hashes.set("audit.json", hash(readFileSync(join(f.root, "audit.json"))));
  const r = await f.make().verify(edge({ auditRef: "audit.json#entry", recordSha256: recordHash(raw) }, f.rs[0]), 0);
  expect(r.resolutionState).toBe("AUDIT_AND_ORIGINAL_VERIFIED"); expect(r.matchedLocator?.pointer).toBe("/0"); expect(r.verificationEvidence.some(p => p.role === "AUDIT_RECORD")).toBe(true);
});
it("16 preserves AND inside displayed alternatives, does not combine mutually exclusive owner types, and holds unknown semantics", async () => {
  const values = [{ id: "a", key: "a" }, { id: "b", key: "b" }, { id: "groups", requirements: { groupPolicy: "compatible_actually_displayed_group_only", sourceGroups: [{ allSourcesWithinGroupRequired: true, sourceKeys: ["a", "b"], typePredicates: [{ owner: "A", type: "ISTJ", sourceKey: "a" }] }, { allSourcesWithinGroupRequired: true, sourceKeys: ["a", "missing"] }, { allSourcesWithinGroupRequired: true, sourceKeys: ["a", "b"], typePredicates: [{ owner: "A", type: "ISTJ" }, { owner: "A", type: "ENFP" }] }] } }, { id: "unknown", sourceGroups: [{ sourceKeys: ["a"] }] }];
  const f = fixture(values); const rows = await f.make().groups([]);
  expect(rows[0].semantics).toBe("AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS"); expect(rows[0].groups.map(g => g.status)).toEqual(["DECLARED_SOURCES_VERIFIED", "WITHHELD", "WITHHELD"]);
  expect(rows[0].groups[1].heldSourceKeys).toContain("missing"); expect(rows[0].groups[2].conflictingOwnerTypeDeclarations).toBe(true); expect(rows[1].semantics).toBe("UNKNOWN_GROUP_SEMANTICS"); expect(rows[1].groups[0].status).toBe("WITHHELD");
  expect(artifacts.groups).toHaveLength(192); expect(artifacts.groups.every(r => !r.approvedForCustomer)).toBe(true);
});
it("17 gives repeated occurrences distinct receipts without inventing independent fact roots", async () => {
  const a = await engine.verify(edge(mbtiId), 0), b = await engine.verify(edge(mbtiId), 1);
  expect(a.referenceKey).not.toBe(b.referenceKey); expect(a.matchedLocator).toEqual(b.matchedLocator); expect(a.establishesPersonalEvidence).toBe(false);
});
it("18 queues all 2966 domains and preserves explicit businessPartner policy without automatic mappings", () => {
  expect(artifacts.domainQueue).toHaveLength(2966); expect(artifacts.domainQueue.every(r => !r.domainApproved)).toBe(true);
  const prohibited = artifacts.domainQueue.filter(r => r.classifications.includes("ORIGINAL_POLICY_PROHIBITS")); expect(prohibited.length).toBeGreaterThan(0); expect(prohibited.every(r => r.policyProofs.length === 1)).toBe(true);
  expect(artifacts.domainQueue.every(r => !r.classifications.includes("EXPLICIT_MAPPING_DECLARED"))).toBe(true);
});
it("19 keeps all thirteen review dimensions independent and never auto-approves any recovered source", () => {
  for (const r of artifacts.receipts) { expect(Object.keys(r.sourceReviewState)).toHaveLength(13); expect(r.customerApproved).toBe(false); expect(r.needsHumanReview).toBe(true); expect(r.sourceReviewState.CUSTOMER_APPROVAL).toBe(false); expect(r.blockingReasons).toContain("CUSTOMER_APPROVAL_REQUIRED"); }
});
it("20 keeps future/calculated Evidence requirements separate from real source recovery", () => {
  const future = artifacts.receipts.filter(r => r.resolutionState === "FUTURE_REQUIREMENT_ONLY"); expect(future.length).toBeGreaterThan(0); expect(future.every(r => !technicallyVerified(r) && !r.establishesPersonalEvidence)).toBe(true);
  expect(artifacts.manifest.technicallyRecovered).toBe(artifacts.receipts.filter(technicallyVerified).length);
});
it("21 preserves every frozen base source/file hash including all research and original catalogs", () => {
  for (const [file, digest] of frozen) expect(hash(readFileSync(file)), file).toBe(digest);
});
it("22 keeps all existing catalog keys unique and preserves original locator/ID identities", () => {
  expect(records).toHaveLength(18610 + 4799); expect(new Set(records.map(r => r.catalogKey)).size).toBe(records.length);
  const byKey = new Map(records.map(r => [r.catalogKey, r]));
  for (const r of artifacts.receipts) { expect(byKey.get(r.affectedCatalogKey)?.originalId).toBe(r.originalResearchId); expect(byKey.get(r.affectedCatalogKey)?.locator).toEqual(r.originalLocator); }
});
it("23 produces deterministic receipts across fresh readers/engines with no clock fields", async () => {
  const again = await newEngine().run(unresolved); expect(hash(canonicalJson(again))).toBe(hash(canonicalJson(artifacts)));
  expect(stableJson(again.receipts)).not.toMatch(/\"(?:checkedAt|startedAt|finishedAt)\"/);
}, 180000);
it("24 produces byte-identical artifacts and valid overlay JSON-pointer receipt links", () => {
  const a = mkdtempSync(join(tmpdir(), "verification-bytes-a-")), b = mkdtempSync(join(tmpdir(), "verification-bytes-b-")); writeVerificationArtifacts(a, artifacts); writeVerificationArtifacts(b, artifacts);
  expect(readdirSync(a)).toHaveLength(20); for (const name of readdirSync(a)) expect(hash(readFileSync(join(a, name)))).toBe(hash(readFileSync(join(b, name))));
  const overlay = json<{ referenceKey: string; receiptReference: string }[]>(join(a, "source-verification-overlay.json"));
  overlay.forEach((r, i) => { expect(r.receiptReference).toBe(`source-verification-receipts.json#/${i}`); expect(r.referenceKey).toBe(artifacts.receipts[i].referenceKey); });
});
it("25 keeps the source verifier disconnected from every customer runtime import", () => {
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
  for (const file of walk("src").filter(f => /\.(ts|tsx)$/.test(f) && !f.includes("knowledge-integration-foundation/"))) expect(readFileSync(resolve(file), "utf8")).not.toMatch(/source-verification[/'"]/);
  expect(artifacts.manifest.runtimeConnection).toBe(0);
});
it("26 preserves the Vercel tracing configuration and keeps raw research out of traced runtime inputs", () => {
  expect(hash(readFileSync("next.config.ts"))).toBe(frozen.get("next.config.ts"));
  const source = readFileSync("scripts/knowledge-source-verification/verify.mjs", "utf8"); expect(source).toContain("OFFLINE_SOURCE_VERIFICATION_NETWORK_DISABLED"); expect(source).toContain("UNREVIEWED_MODULE_OR_HASH_MISMATCH");
  // Actual production-build NFT contents are independently measured by validation.
  expect(artifacts.receipts.every(r => r.impact.actualRuntimeConnected === false)).toBe(true);
});
const safeFixture: SourceUseFixture = { ancestryDomains: ["love"], category: "love", sourceKind: "OTHER", requestedUse: "OTHER", declaredOrigin: "unknown", mixedTransitionWindows: false, sourceRootsVerified: true, factRoots: ["root:a"], actualOwnersDirectionsTimesVerified: true, customerApproved: false };
it.each([
  [{ ancestryDomains: ["CHILDREN"], category: "friendship" }, "CHILDREN_ANCESTRY_PROHIBITED_WITHOUT_EXPLICIT_REVIEW"],
  [{ ancestryDomains: ["MONEY"], category: "businessPartner" }, "EXISTING_BUSINESS_DOMAIN_POLICY_BLOCK"],
  [{ sourceKind: "MBTI_PAIR_REFERENCE", requestedUse: "PERSONAL_TRAIT" }, "PAIR_REFERENCE_IS_NOT_PERSONAL_FACT"],
  [{ sourceKind: "CALCULATION_DEFINITION", requestedUse: "CALCULATED_PAIR" }, "ACTUAL_PAIR_EVIDENCE_REQUIRED"],
  [{ declaredOrigin: "natal", requestedUse: "PERIOD_EVENT" }, "ACTUAL_PERIOD_FACT_AND_INTERVAL_REQUIRED"],
  [{ mixedTransitionWindows: true }, "TRANSITION_WINDOW_INTERSECTION_REQUIRED"],
  [{ sourceKind: "FUSION_RESEARCH", sourceRootsVerified: false }, "ALL_FUSION_ROOTS_REQUIRED"],
  [{ factRoots: ["root:a", "root:a"] }, "REPEATED_ROOT_NOT_INDEPENDENT_EVIDENCE"],
] as [Partial<SourceUseFixture>, string][])("blocks misuse fixture %s with required future gate %s", (bad, gate) => {
  const assessed = assessSourceUseFixture({ ...safeFixture, ...bad }); expect(assessed.requiredGates).toContain(gate); expect(assessed.approvedForCustomer).toBe(false); expect(assessed.eligibleCandidateProduced).toBe(false);
});
it("retains all eight handoff contracts and requires approval even for structurally clean fixtures", () => {
  expect(BINDING_SAFETY_REQUIREMENTS).toHaveLength(8); expect(assessSourceUseFixture(safeFixture).requiredGates).toEqual(["CUSTOMER_APPROVAL_REQUIRED"]); expect(assessSourceUseFixture({ ...safeFixture, factRoots: ["a", "a", "b"] }).independentRootCount).toBe(2);
});

it("traces unresolved ancestor references into the domain queue instead of only inspecting direct overlaps", async () => {
  const f = fixture([{ id: "ancestor", producerSupport: "unsupported" }, { id: "domain" }], (r, i) => i ? { ...r, applicability: { ...r.applicability, domainValidation: "UNRESOLVED" } } : { ...r, applicability: { ...r.applicability, domainValidation: "DECLARED_ONLY" } });
  const connection: KnowledgeReferenceEdge = { ...edge("ancestor", f.rs[1]), to: f.rs[0].catalogKey, resolution: "RESOLVED", reason: null };
  const e = f.make([connection]), held = await e.verify(edge("missing:original", f.rs[0]), 0);
  const rows = await e.domainQueue([held]); expect(rows).toHaveLength(1); expect(rows[0].baselineReferenceOverlap).toBe(0);
  expect(rows[0].ancestorReferenceKeys).toEqual([held.referenceKey]); expect(rows[0].remainingReferenceBlockers).toEqual([held.referenceKey]); expect(rows[0].classifications).toContain("INCOMPLETE_SOURCE"); expect(rows[0].classifications).toContain("UNSUPPORTED_PRODUCER");
});

it("rejects a known but conflicting declared commit version rather than only checking version syntax", async () => {
  const f = fixture([{ id: "source" }]), otherVersion = "a".repeat(40);
  const sr = new SourceReader(f.root, async () => ({}), [config.baseSha, otherVersion]);
  const e = new SourceVerificationEngine(sr, f.rs, [], config, catalogConfig, f.hashes);
  expect((await e.verify(edge({ ...f.rs[0].locator, sourceVersion: otherVersion }, f.rs[0]), 0)).resolutionState).toBe("SOURCE_VERSION_MISMATCH");
});
