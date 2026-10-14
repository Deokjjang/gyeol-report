import { hash, canonicalJson } from "../sourceReader";
import type { CatalogKey, KnowledgeCatalogRecord } from "../types";
import type { EvidenceSourceIdentity, GraphKnowledgeInputs } from "./types";
import { technicallyVerified } from "../source-verification/classification";
/** Exact file/pointer containment and original IDs only. No semantic similarity lookup. */
export class EvidenceKnowledgeIndex {
  readonly versions: { catalog: string; source: string; semantic: string };
  readonly byKey = new Map<CatalogKey, KnowledgeCatalogRecord>();
  readonly byId = new Map<string, KnowledgeCatalogRecord[]>();
  private byFile = new Map<string, KnowledgeCatalogRecord[]>();
  private references = new Map<CatalogKey, string[]>();
  private decisions = new Map<CatalogKey, string[]>();
  private files = new Map<string, { text: string; sha: string }>();
  private parsedJson = new Map<string, unknown>();
  private staticByAncestor = new Map<CatalogKey, GraphKnowledgeInputs["staticAncestry"]>();
  constructor(readonly input: GraphKnowledgeInputs) {
    const version = (file: string) => { const bytes = input.readFile(file); if (hash(bytes) !== input.frozen.get(file)) throw new Error("VERIFICATION_MANIFEST_HASH_MISMATCH"); return String((JSON.parse(bytes) as { version: string }).version); };
    this.versions = { catalog: version("docs/validation/v4-knowledge-unified-catalog-01/coverage-manifest.json"), source: version("docs/validation/v4-knowledge-source-verification-01/source-verification-manifest.json"), semantic: version("docs/validation/v4-knowledge-semantic-domain-verification-01/semantic-domain-manifest.json") };
    const policyFile = "docs/validation/v4-knowledge-semantic-domain-verification-01/verification-config.json", policyBytes = input.readFile(policyFile);
    if (hash(policyBytes) !== input.frozen.get(policyFile) || canonicalJson((JSON.parse(policyBytes) as { rules: unknown }).rules) !== canonicalJson(input.policyRules)) throw new Error("ORIGINAL_SEMANTIC_POLICY_CHANGED");
    for (const r of input.records) { this.byKey.set(r.catalogKey, r); this.byId.set(r.originalId, [...(this.byId.get(r.originalId) ?? []), r]); this.byFile.set(r.locator.file, [...(this.byFile.get(r.locator.file) ?? []), r]); }
    for (const r of input.sourceReceipts) if (technicallyVerified(r)) for (const target of r.candidateTargets) if (target.catalogKey) this.references.set(target.catalogKey, [...(this.references.get(target.catalogKey) ?? []), r.referenceKey]);
    for (const d of input.decisions) this.decisions.set(d.catalogKey, [...(this.decisions.get(d.catalogKey) ?? []), d.decisionKey]);
    for (const a of input.staticAncestry) for (const key of a.requiredSourceKeys) this.staticByAncestor.set(key, [...(this.staticByAncestor.get(key) ?? []), a]);
  }
  source(file: string, pointer: string, expectedValue?: unknown): EvidenceSourceIdentity {
    if (!this.files.has(file)) { const text = this.input.readFile(file); this.files.set(file, { text, sha: hash(text) }); }
    const data = this.files.get(file)!;
    let state: EvidenceSourceIdentity["state"] = data.sha === this.input.frozen.get(file) ? "VERIFIED" : "HASH_MISMATCH";
    if (expectedValue !== undefined) {
      try { if (!this.parsedJson.has(file)) this.parsedJson.set(file, JSON.parse(data.text.replace(/^\uFEFF/, ""))); let value: unknown = this.parsedJson.get(file); for (const k of pointer.split("/").slice(1)) value = (value as Record<string, unknown>)[k.replace(/~1/g, "/").replace(/~0/g, "~")]; if (JSON.stringify(value) !== JSON.stringify(expectedValue)) state = "UNRESOLVED"; } catch { state = "UNRESOLVED"; }
    }
    const containing = (this.byFile.get(file) ?? []).filter(r => r.locator.pointer !== undefined && (pointer === r.locator.pointer || pointer.startsWith(r.locator.pointer + "/")));
    const length = Math.max(-1, ...containing.map(r => r.locator.pointer!.length));
    const keys = containing.filter(r => r.locator.pointer!.length === length).map(r => r.catalogKey).sort();
    return { file, pointer, fileSha256: data.sha, catalogKeys: keys, sourceReferenceKeys: [...new Set(keys.flatMap(k => this.references.get(k) ?? []))].sort(), semanticDecisionKeys: [...new Set(keys.flatMap(k => this.decisions.get(k) ?? []))].sort(), state };
  }
  staticAffected(source: EvidenceSourceIdentity) { return [...new Map(source.catalogKeys.flatMap(k => this.staticByAncestor.get(k) ?? []).map(a => [a.root, a])).values()].map(a => ({ researchCatalogKey: a.root, originalId: this.byKey.get(a.root)?.originalId ?? "UNKNOWN", staticProhibitions: a.prohibitions, actualCalculationAncestor: false })); }
}
