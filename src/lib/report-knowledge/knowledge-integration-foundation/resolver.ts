import type { CatalogKey, JsonRecord, KnowledgeCatalogRecord, KnowledgeReferenceEdge, KnowledgeSourcePointer } from "./types";
import { isRecord } from "./normalization";
import { hash, SourceReader } from "./sourceReader";
export type Reference = { field: string; target: unknown; kind: KnowledgeReferenceEdge["kind"] };
const refNames = /(?:Refs?$|^source.*Keys?$)/;
const refExclude = new Set(["id", "originalId", "runtimeEvidenceIds", "evidenceIds", "evidenceRefs", "claimIdentity", "meaningIdentity", "expressionIdentity", "sceneIdentity"]);
export function extractReferences(value: unknown, field = ""): Reference[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => extractReferences(v, `${field}/${i}`));
  if (!isRecord(value)) return [];
  if (typeof value.catalog === "string" && typeof value.catalogKey === "string") return [{ field, target: value, kind: "REUSES_SOURCE" }];
  if (typeof value.pointer === "string" || (typeof value.file === "string" && typeof value.exportName === "string")) return [{ field, target: value, kind: "REUSES_SOURCE" }];
  const refs: Reference[] = [];
  if (typeof value.distinguishAxis === "string") refs.push({ field: `${field}/distinguishAxis`, target: value.distinguishAxis, kind: "CONTRASTS_WITH" });
  if (Array.isArray(value.relatedAxes)) for (const axis of value.relatedAxes) if (typeof axis === "string") refs.push({ field: `${field}/relatedAxes`, target: axis, kind: "RELATED_TO" });
  if (typeof value.sourceId === "string" && !value.auditRef) refs.push({ field: `${field}/sourceId`, target: { sourceId: value.sourceId, passage: value.locator ?? null }, kind: "REFERENCES" });
  if (typeof value.auditRef === "string") refs.push({ field: `${field}/auditRef`, target: value, kind: "REUSES_SOURCE" });
  else if (typeof value.file === "string" && typeof (value.fileSha256 ?? value.sourceHash ?? value.sourceFileSha256) === "string") refs.push({ field: `${field}/file`, target: { ...value, fileSha256: value.fileSha256 ?? value.sourceHash ?? value.sourceFileSha256 }, kind: "REFERENCES" });
  if (typeof value.sourceFile === "string" && typeof value.sourceHash === "string") refs.push({ field: `${field}/sourceFile`, target: { file: value.sourceFile, fileSha256: value.sourceHash }, kind: "REFERENCES" });
  for (const [key, v] of Object.entries(value)) {
    if (refExclude.has(key) || ["raw", "originalState", "sourceState", "auditRef", "basis"].includes(key)) continue;
    const path = `${field}/${key}`;
    if ((key === "forward" || key === "reverse") && isRecord(v) && typeof v.pointer === "string" && !v.file && typeof value.sourceType === "string" && typeof value.targetType === "string") {
      refs.push({ field: path, target: { ...v, mbtiProfileType: key === "forward" ? value.sourceType : value.targetType, expectedWithType: key === "forward" ? value.targetType : value.sourceType }, kind: "REFERENCES" });
      continue;
    }
    if ((refNames.test(key) || ["sourceRecord", "reverseSourceRecord", "existingRuleId", "originalResearchId", "targetId", "contrastTargetId", "otherTargetId", "applicationIds", "requirementIds"].includes(key)) && (typeof v === "string" || Array.isArray(v))) {
      const kind = /related/i.test(key) ? "RELATED_TO" : /(?:required|producer|formation|scope|policy)/i.test(key) ? "REQUIRES" : /contrast|otherTarget/i.test(key) ? "CONTRASTS_WITH" : "REFERENCES";
      for (const [i, target] of (Array.isArray(v) ? v : [v]).entries()) if (typeof target === "string") {
        const expectedHash = key === "existingRuleId" ? value.existingRuleSha256 : key === "originalResearchId" ? value.originalResearchHash : undefined;
        refs.push({ field: `${path}/${i}`, target: typeof expectedHash === "string" ? { referenceId: target, recordSha256: expectedHash } : target, kind });
      } else refs.push(...extractReferences(target, `${path}/${i}`));
    } else refs.push(...extractReferences(v, path));
  }
  // Basis locators are actual MBTI JSON pointers, not inferred personal traits.
  if (Array.isArray(value.basis)) refs.push(...value.basis.flatMap((v, i) => extractReferences(v, `${field}/basis/${i}`)));
  return refs;
}
export class ReferenceResolver {
  private ids = new Map<string, KnowledgeCatalogRecord[]>();
  private keys = new Map<string, KnowledgeCatalogRecord[]>();
  private auditCache = new Map<string, unknown>();
  private locators = new Map<string, KnowledgeCatalogRecord>();
  private locatorKey(p: KnowledgeSourcePointer): string { return JSON.stringify([p.file, p.exportName ?? "", p.pointer ?? (p.index !== undefined ? `/${p.index}` : "")]); }
  constructor(readonly reader: SourceReader, readonly records: KnowledgeCatalogRecord[], readonly documentation: Record<string, string>, readonly definitions: ReadonlyMap<string, string> = new Map()) {
    for (const r of records) {
      this.locators.set(this.locatorKey(r.locator), r);
      this.ids.set(r.originalId, [...(this.ids.get(r.originalId) ?? []), r]);
      const alias = `${r.locator.file.split("/").at(-1)?.replace(/\.ts$/, "")}:${r.originalId}`;
      this.ids.set(alias, [...(this.ids.get(alias) ?? []), r]);
      const key = r.metadata.key;
      if (typeof key === "string") this.keys.set(key, [...(this.keys.get(key) ?? []), r]);
    }
  }
  private async pointer(target: JsonRecord, family: string): Promise<{ pointer?: KnowledgeSourcePointer; code?: string }> {
    if (typeof target.catalog === "string") {
      const catalog = this.reader.json(target.catalog);
      if (!isRecord(catalog) || !isRecord(catalog.entries)) return { code: "CATALOG_SHAPE_UNSUPPORTED" };
      const p = catalog.entries[String(target.catalogKey)];
      if (!isRecord(p)) return { code: "CATALOG_KEY_MISSING" };
      for (const k of ["originalId", "recordSha256", "sourceVersion"]) if (target[k] !== p[k]) return { code: `CATALOG_${k.toUpperCase()}_MISMATCH` };
      return { pointer: p as KnowledgeSourcePointer };
    }
    if (typeof target.auditRef === "string") {
      const [file, key] = target.auditRef.split("#");
      const path = `${this.documentation[family]}/${file}`;
      if (!this.reader.exists(path)) return { code: "AUDIT_FILE_MISSING" };
      if (!this.auditCache.has(path)) this.auditCache.set(path, this.reader.json(path));
      const data = this.auditCache.get(path);
      const flatten = (v: unknown): JsonRecord[] => Array.isArray(v) ? v.flatMap(flatten) : isRecord(v) ? [v, ...Object.values(v).filter(x => Array.isArray(x) || isRecord(x)).flatMap(flatten)] : [];
      const candidates = flatten(data);
      const audit = candidates.find(v => isRecord(v) && (v.key === key || v.id === key));
      if (!isRecord(audit)) return { code: "AUDIT_KEY_MISSING" };
      if (typeof audit.file !== "string") return { code: "AUDIT_WITHOUT_ORIGINAL_LOCATOR" };
      // Record hash in the registry is authoritative; an embedded audit copy is not the original.
      return { pointer: { file: audit.file, exportName: typeof audit.exportName === "string" ? audit.exportName : typeof audit.export === "string" ? audit.export : undefined, pointer: typeof audit.pointer === "string" ? audit.pointer : undefined, index: typeof audit.index === "number" ? audit.index : undefined, recordSha256: typeof target.recordSha256 === "string" ? target.recordSha256 : typeof audit.recordSha256 === "string" ? audit.recordSha256 : undefined, fileSha256: typeof target.sourceFileSha256 === "string" ? target.sourceFileSha256 : undefined } };
    }
    if (typeof target.file !== "string" && typeof target.mbtiProfileType === "string") {
      const profiles = this.records.filter(r => r.namespace === "FOUNDATION" && r.locator.pointer === "" && r.metadata.type === target.mbtiProfileType);
      if (profiles.length !== 1) return { code: "MBTI_PROFILE_SOURCE_NOT_UNIQUE" };
      target = { ...target, file: profiles[0].locator.file };
    }
    if (typeof target.file !== "string") return { code: "POINTER_FILE_NOT_DECLARED" };
    return { pointer: { ...target, recordSha256: target.recordSha256 ?? target.sha256, recordHashEncoding: target.sha256 && !target.plainKoSha256 ? "JSON_CANONICAL" : "JSON_INSERTION", plainKoSha256: target.plainKoSha256 ?? target.sourceMeaningSha256 } as KnowledgeSourcePointer };
  }
  async resolve(from: KnowledgeCatalogRecord, ref: Reference): Promise<KnowledgeReferenceEdge> {
    const base = { from: from.catalogKey, field: ref.field, target: isRecord(ref.target) ? Object.fromEntries(Object.entries(ref.target).filter(([k]) => ["file", "exportName", "pointer", "index", "originalId", "recordSha256", "fileSha256", "sourceFileSha256", "sourceVersion", "catalog", "catalogKey", "auditRef", "sourceId", "sha256", "sourceMeaningSha256", "plainKoSha256", "mbtiProfileType", "expectedWithType"].includes(k))) : ref.target, kind: ref.kind, establishesPersonalEvidence: false as const };
    try {
      if (isRecord(ref.target) && typeof ref.target.referenceId === "string") {
        const resolved = await this.resolve(from, { ...ref, target: ref.target.referenceId });
        const source = this.records.find(r => r.catalogKey === resolved.to);
        if (resolved.resolution === "RESOLVED" && source?.locator.recordSha256 !== ref.target.recordSha256) return { ...resolved, target: ref.target, to: null, resolution: "UNRESOLVED", reason: "REFERENCED_RECORD_HASH_MISMATCH" };
        return { ...resolved, target: ref.target };
      }
      if (isRecord(ref.target) && typeof ref.target.sourceId === "string" && !ref.target.auditRef && !ref.target.file) {
        const resolved = await this.resolve(from, { ...ref, target: ref.target.sourceId });
        return { ...resolved, target: ref.target };
      }
      if (isRecord(ref.target)) {
        const p = await this.pointer(ref.target, from.family);
        if (!p.pointer) return { ...base, to: null, resolution: "UNRESOLVED", reason: p.code ?? "UNSUPPORTED_LOCATOR" };
        if (p.pointer.sourceVersion && !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(p.pointer.sourceVersion)) return { ...base, to: null, resolution: "UNRESOLVED", reason: "SOURCE_VERSION_NOT_COMMIT_VERIFIED" };
        const located = await this.reader.locate(p.pointer);
        if (located.code) return { ...base, to: null, resolution: "UNRESOLVED", reason: located.code };
        if (typeof ref.target.expectedWithType === "string" && (!isRecord(located.value) || located.value.withType !== ref.target.expectedWithType)) return { ...base, to: null, resolution: "UNRESOLVED", reason: "MBTI_PAIR_DIRECTION_MISMATCH" };
        if (p.pointer.recordSha256 && !p.pointer.exportName && p.pointer.pointer === undefined) return { ...base, to: null, resolution: "UNRESOLVED", reason: "RECORD_LOCATOR_NOT_SPECIFIED" };
        const to = this.locators.get(this.locatorKey(p.pointer));
        if (typeof ref.target.expectedKind === "string" && to?.kind !== ref.target.expectedKind) return { ...base, to: null, resolution: "UNRESOLVED", reason: "SOURCE_KIND_MISMATCH" };
        if (isRecord(ref.target.expectedState) && (!to || Object.entries(ref.target.expectedState).some(([k, v]) => JSON.stringify(to.originalState[k]) !== JSON.stringify(v)))) return { ...base, to: null, resolution: "UNRESOLVED", reason: "SOURCE_STATE_MISMATCH" };
        return { ...base, to: to?.catalogKey ?? `source:${p.pointer.file}#${p.pointer.exportName ?? ""}${p.pointer.pointer ?? ""}`, resolution: "RESOLVED", reason: null };
      }
      if (typeof ref.target !== "string") return { ...base, to: null, resolution: "UNRESOLVED", reason: "UNSUPPORTED_REFERENCE_SHAPE" };
      const definition = this.definitions.get(ref.target);
      if (definition) return { ...base, to: definition, resolution: "RESOLVED", reason: null };
      const [targetId, fragment] = ref.target.split("#");
      const found = [...(this.ids.get(targetId) ?? []), ...(this.keys.get(targetId) ?? [])];
      const unique = [...new Map(found.map(r => [r.catalogKey, r])).values()];
      const local = unique.filter(r => r.family === from.family);
      const candidates = local.length ? local : unique;
      if (candidates.length === 1) {
        if (fragment) {
          const located = await this.reader.locate({ ...candidates[0].locator, originalId: undefined, recordSha256: undefined });
          let value = located.value;
          for (const part of fragment.split(":")) { if (!isRecord(value) || !(part in value)) return { ...base, to: null, resolution: "UNRESOLVED", reason: "REFERENCE_FRAGMENT_MISSING" }; value = value[part]; }
          return { ...base, to: `${candidates[0].catalogKey}#${fragment}`, resolution: "RESOLVED", reason: null };
        }
        return { ...base, to: candidates[0].catalogKey, resolution: "RESOLVED", reason: null };
      }
      if (candidates.length > 1) {
        const origins = [...new Set(candidates.map(r => r.metadata.file ?? r.metadata.location).filter((v): v is string => typeof v === "string"))];
        if (origins.length === 1 && candidates.every(r => (r.metadata.file ?? r.metadata.location) === origins[0]) && this.reader.exists(origins[0])) {
          this.reader.text(origins[0]);
          return { ...base, to: `source:${origins[0]}`, kind: "REUSES_SOURCE", resolution: "RESOLVED", reason: null };
        }
      }
      if (candidates.length > 1) return { ...base, to: null, resolution: "UNRESOLVED", reason: "AMBIGUOUS_ID_OR_ALIAS" };
      return { ...base, to: null, resolution: "UNRESOLVED", reason: "TARGET_ID_NOT_INDEXED" };
    } catch (e) { return { ...base, to: null, resolution: "UNRESOLVED", reason: e instanceof Error ? e.message : "RESOLUTION_ERROR" }; }
  }
}
export function duplicateKeys(records: readonly KnowledgeCatalogRecord[]): CatalogKey[] { const seen = new Set<CatalogKey>(); return records.flatMap(r => { if (seen.has(r.catalogKey)) return [r.catalogKey]; seen.add(r.catalogKey); return []; }); }
export const referenceFingerprint = (e: KnowledgeReferenceEdge) => e.to ?? `unresolved:${hash(JSON.stringify(e.target))}`;
