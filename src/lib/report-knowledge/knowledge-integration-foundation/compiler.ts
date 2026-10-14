/** Offline only. Called explicitly by the CLI/tests; no Next route imports this module. */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogArtifacts, CatalogConfig, CatalogKey, JsonRecord, KnowledgeCatalogRecord, KnowledgeRecordKind, KnowledgeSourcePointer } from "./types";
import { applicability, classify, crosswalk, groupSemantics, isRecord, metadata, review, selected } from "./normalization";
import { duplicateKeys, extractReferences, ReferenceResolver, referenceFingerprint } from "./resolver";
import { hash, recordHash, SourceReader, type ExportLoader } from "./sourceReader";
export const stableJson = (value: unknown): string => JSON.stringify(value, null, 2) + "\n";
export async function compileCatalog(root: string, config: CatalogConfig, load: ExportLoader): Promise<CatalogArtifacts> {
  const reader = new SourceReader(root, load, config.knownSourceVersions), records: KnowledgeCatalogRecord[] = [], raws = new Map<CatalogKey, JsonRecord>();
  const issues: CatalogArtifacts["manifest"]["issues"] = [], foundationExports: CatalogArtifacts["manifest"]["foundationExports"] = [];
  const domains = ["identity", "strengths", "weaknesses", "work", "money", "study", "love", "marriage", "relationships", "success/fortune"];
  const add = (rawValue: unknown, loc: KnowledgeSourcePointer, family: string, kind: KnowledgeRecordKind, namespace: KnowledgeCatalogRecord["namespace"], fallbackId: string) => {
    const raw = isRecord(rawValue) ? rawValue : { value: rawValue };
    const id = typeof raw.id === "string" ? raw.id : fallbackId;
    const catalogKey = `kc:v1:${hash(JSON.stringify([namespace, loc.file, loc.exportName ?? "json", id, namespace === "FOUNDATION" ? loc.pointer ?? loc.index ?? "" : ""]))}` as CatalogKey;
    const r: KnowledgeCatalogRecord = { catalogKey, originalId: id, family, namespace, kind: classify(raw, kind), locator: { ...loc, originalId: typeof raw.id === "string" ? id : undefined, recordSha256: recordHash(rawValue), sourceVersion: config.sourceVersion }, review: review(raw), applicability: applicability(raw, config, domains), originalState: selected(raw, ["review", "verification", "class", "status", "sourceStatus", "sourceCoverage", "connectedToRuntime", "approvedForCustomer", "existingScoreContribution", "runtimeEvidenceIds", "empiricalVerification", "sourceVersion"]), metadata: { ...metadata(raw), ...selected(raw, ["key", "sourceId", "originalResearchId", "existingRuleId", "definitionRelation", "defectInferenceAllowed", "weakSignalLimit", "notIndependentFact", "noNewFact"]) }, groupSemantics: groupSemantics(raw), connectedToRuntime: false };
    records.push(r); raws.set(catalogKey, raw);
    if (r.groupSemantics === "UNKNOWN_GROUP_SEMANTICS") issues.push({ code: "UNKNOWN_GROUP_SEMANTICS", location: catalogKey, detail: "Preserve original sourceGroups; no inferred AND/OR." });
    if (r.applicability.domainValidation === "UNRESOLVED") issues.push({ code: "DOMAIN_REQUIRES_CROSSWALK_REVIEW", location: catalogKey, detail: "Original domain taxonomy is preserved; no implicit V4-domain transfer." });
  };
  const families: CatalogArtifacts["manifest"]["families"] = [];
  const detected = reader.walk(config.researchRoot).filter(f => f.endsWith(".ts") && /\/-?[^/]+-research\//.test(f));
  const actualFamilies = [...new Set(detected.map(f => f.slice(config.researchRoot.length + 1).split("/")[0]))].sort();
  for (const name of actualFamilies) if (!config.families.some(f => f.name === name)) issues.push({ code: "UNCONFIGURED_RESEARCH_FAMILY", location: name, detail: "No family adapter: not silently ingested as interpretation." });
  for (const family of config.families) {
    let actual = 0;
    for (const file of detected.filter(f => f.startsWith(`${config.researchRoot}/${family.name}/`)).sort()) {
      try {
        const ex = await reader.exports(file);
        for (const [name, value] of Object.entries(ex).sort(([a], [b]) => a.localeCompare(b, "en"))) {
          if (!Array.isArray(value) || !value.length || !value.every(v => isRecord(v) && typeof v.id === "string")) continue;
          if (!(name in family.exportKinds)) issues.push({ code: "UNCLASSIFIED_EXPORT", location: `${file}#${name}`, detail: "Uses family default; requires adapter review." });
          value.forEach((v, index) => add(v, { file, exportName: name, index }, family.name, family.exportKinds[name] ?? family.defaultKind, "RESEARCH", String(index)));
          actual += value.length;
        }
      } catch (e) { issues.push({ code: "RESEARCH_UNREADABLE", location: file, detail: String(e) }); }
    }
    families.push({ name: family.name, expected: family.expected, actual });
    if (actual !== family.expected) issues.push({ code: "RESEARCH_COUNT_MISMATCH", location: family.name, detail: `${actual} != ${family.expected}` });
  }
  for (const source of config.foundation) {
    try {
      const ex = await reader.exports(source.file), value = ex[source.exportName];
      if (value === undefined || value instanceof Map || value instanceof Set || typeof value === "function") { issues.push({ code: "FOUNDATION_EXPORT_UNSUPPORTED", location: `${source.file}#${source.exportName}`, detail: "Missing export or non-data export; no fabricated records." }); continue; }
      const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v] as const) : isRecord(value) ? Object.entries(value) : [["", value] as const];
      foundationExports.push({ ...source, count: entries.length });
      for (const [key, v] of entries) add(v, { file: source.file, exportName: source.exportName, pointer: key === "" ? "" : `/${key.replace(/~/g, "~0").replace(/\//g, "~1")}` }, "foundation", source.kind, "FOUNDATION", isRecord(v) ? String(v.key ?? v.type ?? v.feature ?? key) : String(v));
    } catch (e) { issues.push({ code: "FOUNDATION_UNREADABLE", location: source.file, detail: String(e) }); }
  }
  for (const type of config.typeUnions) {
    const values = reader.typeLiterals(type.file, type.name);
    foundationExports.push({ file: type.file, exportName: type.name, count: values.length });
    if (!values.length) issues.push({ code: "TYPE_UNION_UNREADABLE", location: type.name, detail: "Expected finite literal union" });
    for (const value of values) add({ id: value, typeUnion: type.name, definitionOnly: true }, { file: type.file, exportName: `type:${type.name}`, pointer: `/${value}` }, "foundation", "SEMANTIC_DEFINITION", "FOUNDATION", value);
  }
  for (const file of reader.walk(config.mbtiRoot).filter(f => f.endsWith(".json"))) {
    const profile = reader.json(file);
    if (!isRecord(profile) || typeof profile.type !== "string") { issues.push({ code: "MBTI_PROFILE_INVALID", location: file, detail: "Missing actual type" }); continue; }
    add(profile, { file, pointer: "" }, "foundation", "SOURCE_KNOWLEDGE", "FOUNDATION", `mbti-profile:${profile.type}`);
    if (isRecord(profile.traits)) for (const [area, traits] of Object.entries(profile.traits)) if (Array.isArray(traits)) traits.forEach((v, i) => add(v, { file, pointer: `/traits/${area}/${i}` }, "foundation", "SOURCE_KNOWLEDGE", "FOUNDATION", `${profile.type}:${area}:${i}`));
    const hints = profile.relationshipHints;
    const pairs = isRecord(hints) && Array.isArray(hints.notablePairs) ? hints.notablePairs : [];
    pairs.forEach((v, i) => add(v, { file, pointer: `/relationshipHints/notablePairs/${i}` }, "foundation", "SOURCE_KNOWLEDGE", "FOUNDATION", `mbti-pair:${profile.type}>${isRecord(v) ? v.withType : i}`));
    foundationExports.push({ file, exportName: "actualDirectedPairs", count: pairs.length });
  }
  const inherited = reader.json(config.inheritedInventory);
  const inheritedRows = Array.isArray(inherited) ? inherited : [];
  const originalByLocator = new Map(records.filter(r => r.namespace === "RESEARCH").map(r => [JSON.stringify([r.locator.file, r.locator.exportName, r.locator.index]), r]));
  let inheritedMatched = 0;
  for (const row of inheritedRows) {
    if (!isRecord(row) || !isRecord(row.locator)) continue;
    const loc = row.locator, actual = originalByLocator.get(JSON.stringify([loc.file, loc.exportName, loc.index]));
    if (actual && actual.originalId === loc.originalId && actual.locator.recordSha256 === loc.recordSha256) inheritedMatched++;
    else issues.push({ code: "INHERITED_INVENTORY_MISMATCH", location: JSON.stringify(loc), detail: "Actual source differs from the inherited inventory" });
  }
  records.sort((a, b) => a.catalogKey.localeCompare(b.catalogKey, "en"));
  for (const key of duplicateKeys(records)) issues.push({ code: "DUPLICATE_CATALOG_KEY", location: key, detail: "Distinct source slots collide; must resolve before approval." });
  const graphNodes: CatalogArtifacts["graphNodes"] = records.map(r => ({ id: r.catalogKey, kind: r.metadata.sceneIdentity ? "CONDITIONAL_SCENE" : r.locator.exportName === "SEMANTIC_FACETS" ? "SEMANTIC_FACET" : r.locator.exportName === "BIPOLAR_AXES" || r.locator.exportName === "STRENGTH_AXES" ? "SEMANTIC_AXIS" : r.kind, locator: r.locator, personalEvidence: false }));
  const definitions = new Map<string, string>(), ambiguousDefinitions = new Set<string>();
  for (const file of config.definitionFiles) {
    if (!reader.exists(file)) { issues.push({ code: "DEFINITION_FILE_MISSING", location: file, detail: "Declared producer/type file absent" }); continue; }
    const text = reader.text(file);
    for (const symbol of reader.exportedSymbols(file)) {
      const id = `definition:${file}#${symbol}`;
      graphNodes.push({ id, kind: config.producerSymbols.includes(symbol) ? "CALCULATION_PRODUCER" : new RegExp(`export (?:async )?function ${symbol}\\b`).test(text) ? "EXPORTED_FUNCTION_DEFINITION" : "CALCULATION_RESULT_OR_DEFINITION", locator: { file, exportName: symbol, fileSha256: reader.files.get(file), sourceVersion: config.sourceVersion }, personalEvidence: false });
      if (definitions.has(symbol)) ambiguousDefinitions.add(symbol); else definitions.set(symbol, id);
      definitions.set(`${file.split("/").at(-1)?.replace(/\.ts$/, "")}:${symbol}`, id);
    }
  }
  for (const name of ambiguousDefinitions) definitions.delete(name);
  const resolver = new ReferenceResolver(reader, records, Object.fromEntries(config.families.map(f => [f.name, f.documentation])), definitions);
  const edges: CatalogArtifacts["edges"] = [];
  for (const r of records) {
    for (const ref of extractReferences(raws.get(r.catalogKey))) edges.push(await resolver.resolve(r, ref));
    if (r.groupSemantics === "UNKNOWN_GROUP_SEMANTICS") edges.push({ from: r.catalogKey, to: null, kind: "NEEDS_VALIDATION", field: "sourceGroups", target: "UNKNOWN_GROUP_SEMANTICS", resolution: "UNRESOLVED", reason: "UNKNOWN_GROUP_SEMANTICS", establishesPersonalEvidence: false });
    for (const p of r.applicability.products) edges.push({ from: r.catalogKey, to: `product:${p}`, kind: "CAN_APPLY_TO", field: "declaredProduct", target: p, resolution: "RESOLVED", reason: null, establishesPersonalEvidence: false });
    for (const c of r.applicability.relationships) edges.push({ from: r.catalogKey, to: `relationship:${c}`, kind: "SPECIALIZES", field: "declaredRelationship", target: c, resolution: "RESOLVED", reason: null, establishesPersonalEvidence: false });
  }
  for (const r of records) {
    const reviewId = `review:${recordHash(r.review)}`; graphNodes.push({ id: reviewId, kind: "VERIFICATION_RECORD", personalEvidence: false });
    edges.push({ from: r.catalogKey, to: reviewId, kind: "NEEDS_VALIDATION", field: "independentReviewDimensions", target: "customer approval and actual applicability required", resolution: "RESOLVED", reason: null, establishesPersonalEvidence: false });
    const text = r.metadata.counterexample;
    if (typeof text === "string") { const id = `counterexample:${hash(text)}`; graphNodes.push({ id, kind: "COUNTEREXAMPLE", text, personalEvidence: false }); edges.push({ from: r.catalogKey, to: id, kind: "PROHIBITED_FOR", field: "counterexample", target: text, resolution: "RESOLVED", reason: null, establishesPersonalEvidence: false }); }
  }
  const nodeIds = new Set(graphNodes.map(n => n.id));
  for (const e of edges) if (e.to && !nodeIds.has(e.to)) { nodeIds.add(e.to); graphNodes.push({ id: e.to, kind: e.to.startsWith("product:") ? "PRODUCT_CONTEXT" : e.to.startsWith("relationship:") ? "RELATIONSHIP_POLICY" : "SOURCE_REFERENCE_TARGET", personalEvidence: false }); }
  const grouped = new Map<string, CatalogArtifacts["edges"]>();
  for (const e of edges) if (e.kind !== "CAN_APPLY_TO" && e.kind !== "SPECIALIZES" && e.kind !== "NEEDS_VALIDATION" && e.kind !== "PROHIBITED_FOR" && e.resolution === "RESOLVED") { const k = referenceFingerprint(e); const g = grouped.get(k) ?? []; g.push(e); grouped.set(k, g); }
  const duplicates = [...grouped].filter(([, e]) => e.length > 1).sort(([a], [b]) => a.localeCompare(b, "en")).map(([target, refs]) => ({ target, references: refs.length, affectedCatalogKeys: [...new Set(refs.map(e => e.from))].sort(), classification: "REFERENCE_REUSE_NOT_INDEPENDENT_FACTS" as const }));
  const indexes: CatalogArtifacts["indexes"] = { product: {}, relationship: {}, domain: {}, condition: {} };
  const index = (kind: keyof typeof indexes, value: string, key: CatalogKey) => { (indexes[kind][value] ??= []).push(key); };
  for (const r of records) {
    for (const p of r.applicability.products) index("product", p, r.catalogKey);
    for (const c of r.applicability.relationships) index("relationship", c, r.catalogKey);
    const d = r.metadata.domain; if (typeof d === "string") index("domain", d, r.catalogKey);
    index("condition", r.groupSemantics, r.catalogKey);
    if (Object.keys(r.applicability.temporal.declared as object).length) index("condition", "ACTUAL_TIME_REQUIRED", r.catalogKey);
    if (r.kind === "REJECTED_OR_HELD") index("condition", "HELD_NO_CUSTOMER_USE", r.catalogKey);
  }
  return { records, edges, duplicates, indexes, graphNodes: [...new Map(graphNodes.map(n => [n.id, n])).values()].sort((a, b) => a.id.localeCompare(b.id, "en")), crosswalks: records.filter(r => r.kind === "CROSSWALK").map(crosswalk), sourceIntegrity: [...reader.files].sort(([a], [b]) => a.localeCompare(b, "en")).map(([file, sha256]) => ({ file, sha256 })), manifest: { version: config.version, sourceVersion: config.sourceVersion, expectedResearchRecords: config.families.reduce((n, f) => n + f.expected, 0), actualResearchRecords: records.filter(r => r.namespace === "RESEARCH").length, foundationSourceRecords: records.filter(r => r.namespace === "FOUNDATION").length, inheritedInventory: { expected: inheritedRows.length, matched: inheritedMatched, mismatched: inheritedRows.length - inheritedMatched, newResearchRecords: records.filter(r => r.namespace === "RESEARCH").length - inheritedRows.length }, families, foundationExports, kinds: Object.fromEntries([...new Set(records.map(r => r.kind))].sort().map(k => [k, records.filter(r => r.kind === k).length])), references: { resolved: edges.filter(e => e.resolution === "RESOLVED" && e.kind !== "CAN_APPLY_TO" && e.kind !== "SPECIALIZES" && e.kind !== "NEEDS_VALIDATION" && e.kind !== "PROHIBITED_FOR").length, unresolved: edges.filter(e => e.resolution === "UNRESOLVED").length, hashMismatches: edges.filter(e => e.reason?.includes("HASH_MISMATCH")).length }, duplicateReferenceGroups: duplicates.length, issues, customerApproved: 0, runtimeConnections: 0 } };
}
export function writeArtifacts(out: string, a: CatalogArtifacts): void {
  mkdirSync(out, { recursive: true });
  const write = (name: string, value: unknown) => writeFileSync(join(out, name + ".json"), stableJson(value));
  for (const family of [...new Set(a.records.map(r => r.family))]) {
    mkdirSync(join(out, "catalog"), { recursive: true }); mkdirSync(join(out, "edges"), { recursive: true });
    const rows = a.records.filter(r => r.family === family), keys = new Set(rows.map(r => r.catalogKey));
    write(`catalog/${family}`, rows); write(`edges/${family}`, a.edges.filter(e => keys.has(e.from)));
  }
  const familyByKey = new Map(a.records.map(r => [r.catalogKey, r.family]));
  write("research-inventory", a.manifest.families); write("foundation-inventory", a.manifest.foundationExports);
  write("knowledge-graph-nodes", a.graphNodes);
  write("knowledge-edges", [...new Set(a.records.map(r => r.family))].map(family => ({ family, shard: `edges/${family}.json`, count: a.edges.filter(e => familyByKey.get(e.from) === family).length })));
  write("coverage-manifest", a.manifest); write("source-integrity", a.sourceIntegrity);
  write("knowledge-catalog", a.records.map(r => ({ catalogKey: r.catalogKey, originalId: r.originalId, kind: r.kind, shard: `catalog/${r.family}.json` })));
  write("unresolved-references", a.edges.filter(e => e.resolution === "UNRESOLVED")); write("duplicate-reference-audit", a.duplicates);
  write("knowledge-status-matrix", a.records.map(r => ({ catalogKey: r.catalogKey, ...r.review })));
  write("product-applicability", a.indexes.product); write("relationship-applicability", a.indexes.relationship); write("selective-index-design", a.indexes);
  write("temporal-conditions", a.records.filter(r => Object.keys(r.applicability.temporal.declared as object).length).map(r => ({ catalogKey: r.catalogKey, ...r.applicability.temporal })));
  write("semantic-crosswalk", a.crosswalks);
  write("fusion-crosswalk", a.records.filter(r => r.kind === "FUSION_RESEARCH" || r.metadata.existingRuleId).map(r => ({ catalogKey: r.catalogKey, originalRule: r.metadata.existingRuleId ?? null, scope: r.metadata.scope ?? null, sourceFactPolicy: r.metadata.sourceFactPolicy ?? null, applicability: r.applicability, customerApproved: false })));
  write("korean-expression-contract", a.records.filter(r => r.metadata.claimIdentity || r.metadata.expressionIdentity || r.metadata.sceneIdentity).map(r => ({ catalogKey: r.catalogKey, metadata: r.metadata, applicability: r.applicability, customerApproved: false })));
}
