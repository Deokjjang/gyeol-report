import { mkdtempSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { beforeAll, expect, it } from "vitest";
import { compileCatalog, stableJson, writeArtifacts } from "@/lib/report-knowledge/knowledge-integration-foundation/compiler";
import { groupSemantics } from "@/lib/report-knowledge/knowledge-integration-foundation/normalization";
import { duplicateKeys, extractReferences, ReferenceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/resolver";
import { canonicalJson, hash, recordHash, SourceReader } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { validateBindingScenarioFixture, validateCatalogRecord, validateSignalDeclaration, validateTemporalDeclaration } from "@/lib/report-knowledge/knowledge-integration-foundation/validation";
import { BINDING_HARD_GATES, type ActualEvidenceId, type CatalogArtifacts, type CatalogConfig, type CatalogKey, type KnowledgeCatalogRecord } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
type Assert<T extends true> = T;
export type CatalogIsNotEvidence = Assert<CatalogKey extends ActualEvidenceId ? false : true>;
const config = JSON.parse(readFileSync("docs/validation/v4-knowledge-unified-catalog-01/compiler-config.json", "utf8")) as CatalogConfig;
const loader = async (file: string) => import(/* @vite-ignore */ pathToFileURL(file).href);
let compiled: CatalogArtifacts;
beforeAll(async () => { compiled = await compileCatalog(process.cwd(), config, loader); }, 180000);
it("parses every actual export in twenty families with preserved IDs, locators and hashes", async () => {
  expect(compiled.manifest.inheritedInventory).toEqual({ expected: 18218, matched: 18218, mismatched: 0, newResearchRecords: 392 });
  expect(compiled.manifest.actualResearchRecords).toBe(18610); expect(compiled.manifest.families).toHaveLength(20);
  expect(compiled.manifest.families.every(f => f.expected === f.actual)).toBe(true);
  expect(duplicateKeys(compiled.records)).toEqual([]);
  const originals = new SourceReader(process.cwd(), loader, config.knownSourceVersions);
  for (const r of compiled.records) expect((await originals.locate(r.locator)).code, r.catalogKey).toBeUndefined();
  expect(compiled.records.every(r => r.locator.recordSha256 && r.locator.sourceVersion === config.sourceVersion)).toBe(true);
  expect(compiled.manifest.issues.every(i => i.code === "DOMAIN_REQUIRES_CROSSWALK_REVIEW")).toBe(true);
});
it("keeps foundation coverage separate and acquires actual MBTI16/pair256, axes8+28/facets109/tag22/theme16", () => {
  const exp = (e: string) => compiled.manifest.foundationExports.find(x => x.exportName === e)?.count;
  expect(exp("BIPOLAR_AXES")).toBe(8); expect(exp("STRENGTH_AXES")).toBe(28); expect(exp("SemanticTag")).toBe(22); expect(exp("BROAD_SEMANTIC_THEMES")).toBe(16);
  expect(compiled.records.filter(r => r.locator.exportName === "SEMANTIC_FACETS")).toHaveLength(109);
  expect(compiled.manifest.foundationExports.filter(f => f.exportName === "actualDirectedPairs")).toHaveLength(16);
  expect(compiled.manifest.foundationExports.filter(f => f.exportName === "actualDirectedPairs").reduce((n, f) => n + f.count, 0)).toBe(256);
  expect(compiled.manifest.foundationSourceRecords).toBeGreaterThan(3000);
  for (const key of Object.values(config.productAliases)) expect(compiled.indexes.product[key]?.length).toBeGreaterThan(0);
  for (const cat of ["love", "marriage", "parentChild", "coworker", "managerReport", "businessPartner", "friendship"]) expect(compiled.indexes.relationship[cat]?.length).toBeGreaterThan(0);
});
it("separates all fourteen kinds and source reference reuse from independent facts", () => {
  expect(Object.keys(compiled.manifest.kinds)).toHaveLength(14);
  expect(compiled.duplicates.length).toBeGreaterThan(0);
  expect(compiled.duplicates.every(d => d.references > 1 && d.classification === "REFERENCE_REUSE_NOT_INDEPENDENT_FACTS")).toBe(true);
  expect(compiled.edges.every(e => e.establishesPersonalEvidence === false)).toBe(true);
  expect(compiled.graphNodes.some(n => n.kind === "CALCULATION_PRODUCER")).toBe(true);
  expect(compiled.graphNodes.some(n => n.kind === "COUNTEREXAMPLE")).toBe(true);
});
it("retains unresolved targets and all independent unapproved review dimensions", () => {
  expect(compiled.manifest.references.unresolved).toBeGreaterThan(0);
  for (const r of compiled.records) { expect(r.review.customerApproved).toBe(false); expect(r.connectedToRuntime).toBe(false); expect(r.review.calculationApplicability).toBe("REQUIRES_ACTUAL_EVIDENCE"); expect(r.originalId).not.toBe(r.catalogKey); }
  expect(compiled.crosswalks.every(c => !c.equalityApproved && !c.scoresChanged)).toBe(true);
  expect(BINDING_HARD_GATES).toHaveLength(12);
});
it("makes a byte-identical second rebuild including shards, resolver and indexes", async () => {
  const again = await compileCatalog(process.cwd(), config, loader);
  expect(recordHash(again)).toBe(recordHash(compiled));
  const a = mkdtempSync(join(tmpdir(), "catalog-determinism-a-")), b = mkdtempSync(join(tmpdir(), "catalog-determinism-b-"));
  writeArtifacts(a, compiled); writeArtifacts(b, again);
  const walk = (p: string): string[] => readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(p, e.name)) : [join(p, e.name)]);
  for (const file of walk(a)) expect(hash(readFileSync(file))).toBe(hash(readFileSync(b + file.slice(a.length))));
}, 180000);
it("detects duplicate catalog keys without merging research IDs or claim identities", () => {
  expect(duplicateKeys([compiled.records[0], compiled.records[0]])).toEqual([compiled.records[0].catalogKey]);
  expect(extractReferences({ sourceRefs: [{ sourceId: "sm1", locator: "original passage" }] })[0]).toMatchObject({ target: { sourceId: "sm1", passage: "original passage" } });
  expect(extractReferences({ productKey: "annual_fortune", claimIdentity: "claim:x", runtimeEvidenceIds: [] })).toEqual([]);
});
it("resolves exact original/file/export/ID/hash and reports each broken reference precisely", async () => {
  const dir = mkdtempSync(join(tmpdir(), "catalog-ref-")); const raw = { id: "research:one", review: "conditional", approvedForCustomer: false };
  writeFileSync(join(dir, "original.json"), stableJson([raw]));
  const reader = new SourceReader(dir, async () => ({ ORIGINAL: [raw] }), [config.sourceVersion]);
  const from: KnowledgeCatalogRecord = { ...compiled.records[0], catalogKey: `kc:v1:${"a".repeat(64)}`, originalId: raw.id, kind: "SOURCE_KNOWLEDGE", locator: { file: "original.json", pointer: "/0", recordSha256: recordHash(raw) }, originalState: { review: "conditional" } };
  const resolver = new ReferenceResolver(reader, [from], {});
  const pointer = { file: "original.json", pointer: "/0", originalId: raw.id, recordSha256: recordHash(raw) };
  const check = (target: unknown) => resolver.resolve(from, { field: "fixture", target, kind: "REFERENCES" });
  expect((await check(pointer)).resolution).toBe("RESOLVED");
  expect((await check({ ...pointer, recordSha256: undefined, sha256: hash(canonicalJson(raw)) })).resolution).toBe("RESOLVED");
  expect((await check({ ...pointer, file: "missing.json" })).reason).toBe("FILE_MISSING");
  expect((await check({ ...pointer, pointer: "/9" })).reason).toBe("POINTER_MISSING");
  expect((await check({ ...pointer, originalId: "wrong" })).reason).toBe("ID_MISMATCH");
  expect((await check({ ...pointer, recordSha256: "0".repeat(64) })).reason).toBe("RECORD_HASH_MISMATCH");
  expect((await check({ ...pointer, fileSha256: "0".repeat(64) })).reason).toBe("FILE_HASH_MISMATCH");
  expect((await check({ ...pointer, exportName: "NO_EXPORT" })).reason).toBe("EXPORT_MISSING");
  expect((await check({ ...pointer, sourceVersion: "0".repeat(40) })).reason).toBe("UNKNOWN_SOURCE_VERSION");
  expect((await check({ ...pointer, expectedWithType: "INTJ" })).reason).toBe("MBTI_PAIR_DIRECTION_MISMATCH");
  expect((await check({ ...pointer, expectedKind: "TEST_FIXTURE" })).reason).toBe("SOURCE_KIND_MISMATCH");
  expect((await check({ ...pointer, expectedState: { review: "approved" } })).reason).toBe("SOURCE_STATE_MISMATCH");
  expect((await check({ ...pointer, file: "../outside.json" })).resolution).toBe("UNRESOLVED");
  expect((await check({ pointer: "/without/file", sha256: "0".repeat(64) })).reason).toBe("POINTER_FILE_NOT_DECLARED");
  expect((await check({ referenceId: raw.id, recordSha256: "0".repeat(64) })).reason).toBe("REFERENCED_RECORD_HASH_MISMATCH");
  expect((await check("calculated:personal:fact" )).reason).toBe("TARGET_ID_NOT_INDEXED");
  const catalogLocator = { ...pointer, sourceVersion: config.sourceVersion };
  writeFileSync(join(dir, "catalog.json"), stableJson({ entries: { anchor: catalogLocator } }));
  const sourcePointer = { catalog: "catalog.json", catalogKey: "anchor", originalId: raw.id, recordSha256: recordHash(raw), sourceVersion: config.sourceVersion };
  expect((await check(sourcePointer)).resolution).toBe("RESOLVED");
  expect((await check({ ...sourcePointer, catalogKey: "absent" })).reason).toBe("CATALOG_KEY_MISSING");
  expect((await check({ ...sourcePointer, sourceVersion: "0".repeat(40) })).reason).toBe("CATALOG_SOURCEVERSION_MISMATCH");
  expect((await check({ ...pointer, sourceVersion: hash(readFileSync(join(dir, "original.json"))) })).resolution).toBe("RESOLVED");
  const two = await check(pointer); expect(two.to).toBe((await check(pointer)).to);
});
it("requires explicit group semantics and preserves displayed-group conjunction without inventing OR", () => {
  expect(groupSemantics({ sourceGroups: [{ sourceKeys: ["a", "b"] }] })).toBe("UNKNOWN_GROUP_SEMANTICS");
  expect(groupSemantics({ requirements: { groupPolicy: "compatible_actually_displayed_group_only", sourceGroups: [{ allSourcesWithinGroupRequired: true }] } })).toBe("AND_WITHIN_CONDITIONAL_DISPLAYED_GROUPS");
  expect(groupSemantics({ groupPolicy: "all_direct_sources", sourceGroups: [] })).toBe("ALL_DIRECT_SOURCES");
});
it("validates rejected/invalid source states and forbids implicit customer approval", () => {
  const r = compiled.records[0];
  expect(validateCatalogRecord({ ...r, kind: "REJECTED_OR_HELD" })).toContain("HELD_NO_CUSTOMER_USE");
  const broken = JSON.parse(JSON.stringify(r)); broken.review.sourceExistence = "verified"; broken.review.customerApproved = true;
  expect(validateCatalogRecord(broken)).toContain("INVALID_SOURCE_STATE"); expect(validateCatalogRecord(broken)).toContain("UNAUTHORIZED_CUSTOMER_OR_RUNTIME_APPROVAL");
});
it("makes unknown MBTI/hour, reversed direction and any prohibited ancestor domain explicit fixture gaps", () => {
  expect(validateBindingScenarioFixture({ mbti: null, birthTime: null, requiresMbti: true, requiresHour: true, requiredDirection: "A_TO_B", declaredDirection: "B_TO_A", allowedDomains: ["love"], ancestryDomains: ["love", "work"], customerApproved: false })).toEqual(["ACTUAL_MBTI_SOURCE_REQUIRED", "ACTUAL_HOUR_EVIDENCE_REQUIRED", "DIRECTION_MISMATCH", "ANCESTOR_DOMAIN_PROHIBITED", "CUSTOMER_APPROVAL_REQUIRED"]);
  expect(validateBindingScenarioFixture({ mbti: null, birthTime: null, requiresMbti: false, requiresHour: false, requiredDirection: null, declaredDirection: null, allowedDomains: [], ancestryDomains: [], customerApproved: false })).toEqual(["CUSTOMER_APPROVAL_REQUIRED"]);
});
it("keeps negative bipolar signals neutral and unknown/conflicting time windows withheld", () => {
  expect(validateSignalDeclaration({ axis: "ACTION_TEMPO", kind: "bipolar", value: -2, negativeIsDefect: false, lowStrengthEstablishesOpposite: false })).toEqual([]);
  expect(validateSignalDeclaration({ axis: "CARE", kind: "strength", value: 0, negativeIsDefect: false, lowStrengthEstablishesOpposite: false })).toEqual([]);
  expect(validateTemporalDeclaration(null, null, "month", "year")).toEqual(["TEMPORAL_SCOPE_CONFLICT", "ACTUAL_TIME_WINDOW_REQUIRED"]);
  expect(validateTemporalDeclaration("2026-02-01", "2026-01-01", "month", "month")).toEqual(["INVALID_TEMPORAL_WINDOW"]);
});
it("preserves every acquired source byte and excludes runtime imports of the offline compiler", () => {
  for (const f of compiled.sourceIntegrity) expect(hash(readFileSync(f.file))).toBe(f.sha256);
  const reader = new SourceReader(process.cwd(), loader);
  for (const file of reader.walk("src").filter(f => /\.(ts|tsx)$/.test(f) && !f.includes("knowledge-integration-foundation/"))) {
    expect(readFileSync(resolve(file), "utf8")).not.toMatch(/from\s+["'][^"']*knowledge-integration-foundation/);
  }
});
