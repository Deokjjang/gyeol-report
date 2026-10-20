import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";
import ts from "typescript";
import { isRecord } from "./normalization";
import type { JsonRecord, KnowledgeSourcePointer } from "./types";
export const hash = (v: string | Buffer): string => createHash("sha256").update(v).digest("hex");
export const recordHash = (v: unknown): string => hash(JSON.stringify(v));
export function canonicalJson(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(",")}]`;
  const o = v as JsonRecord;
  return `{${Object.keys(o).sort().map(k => `${JSON.stringify(k)}:${canonicalJson(o[k])}`).join(",")}}`;
}
export type ExportLoader = (absoluteFile: string) => Promise<JsonRecord>;
export class SourceReader {
  readonly files = new Map<string, string>();
  private modules = new Map<string, Promise<JsonRecord>>();
  private jsonCache = new Map<string, unknown>();
  constructor(readonly root: string, readonly loadExports: ExportLoader, readonly knownSourceVersions: readonly string[] = []) {}
  path(file: string): string {
    const full = resolve(this.root, file), rel = relative(this.root, full);
    if (isAbsolute(rel) || rel === ".." || rel.startsWith("../")) throw new Error("OUTSIDE_REPOSITORY");
    return full;
  }
  exists(file: string): boolean { return existsSync(this.path(file)); }
  text(file: string): string { const b = readFileSync(this.path(file)); this.files.set(file, hash(b)); return b.toString("utf8").replace(/^\uFEFF/, ""); }
  json(file: string): unknown { if (!this.jsonCache.has(file)) this.jsonCache.set(file, JSON.parse(this.text(file))); return this.jsonCache.get(file); }
  async exports(file: string): Promise<JsonRecord> {
    if (!this.modules.has(file)) { this.text(file); this.modules.set(file, this.loadExports(this.path(file))); }
    return this.modules.get(file)!;
  }
  walk(folder: string): string[] { return readdirSync(this.path(folder), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "en")).flatMap(e => e.isDirectory() ? this.walk(`${folder}/${e.name}`) : [`${folder}/${e.name}`]); }
  exportedSymbols(file: string): Set<string> {
    const ast = ts.createSourceFile(file, this.text(file), ts.ScriptTarget.Latest, true);
    const symbols = new Set<string>();
    for (const s of ast.statements) {
      if (!ts.canHaveModifiers(s) || !ts.getModifiers(s)?.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
      if (ts.isVariableStatement(s)) { for (const d of s.declarationList.declarations) if (ts.isIdentifier(d.name)) symbols.add(d.name.text); }
      else if (ts.isFunctionDeclaration(s) || ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s) || ts.isClassDeclaration(s)) { if (s.name) symbols.add(s.name.text); }
    }
    return symbols;
  }
  typeLiterals(file: string, name: string): string[] {
    const ast = ts.createSourceFile(file, this.text(file), ts.ScriptTarget.Latest, true);
    const node = ast.statements.find((s): s is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(s) && s.name.text === name);
    if (!node || !ts.isUnionTypeNode(node.type)) return [];
    return node.type.types.flatMap(t => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal) ? [t.literal.text] : []);
  }
  async locate(p: KnowledgeSourcePointer): Promise<{ value?: unknown; code?: string; detail?: string }> {
    try {
      if (!this.exists(p.file)) return { code: "FILE_MISSING" };
      if (p.sourceVersion && !/^[a-f0-9]{64}$/.test(p.sourceVersion) && this.knownSourceVersions.length && !this.knownSourceVersions.includes(p.sourceVersion)) return { code: "UNKNOWN_SOURCE_VERSION" };
      if (p.sourceVersion && /^[a-f0-9]{64}$/.test(p.sourceVersion)) { this.text(p.file); if (this.files.get(p.file) !== p.sourceVersion) return { code: "SOURCE_VERSION_HASH_MISMATCH" }; }
      let value: unknown;
      if (p.exportName?.startsWith("type:")) {
        const values = this.typeLiterals(p.file, p.exportName.slice(5));
        const id = p.pointer?.slice(1);
        if (!values.includes(id ?? "")) return { code: "TYPE_MEMBER_MISSING" };
        const value = { id, typeUnion: p.exportName.slice(5), definitionOnly: true };
        if (p.recordSha256 && recordHash(value) !== p.recordSha256) return { code: "RECORD_HASH_MISMATCH" };
        return { value };
      }
      if (p.exportName) {
        const [name, ...members] = p.exportName.split(".");
        const ex = await this.exports(p.file);
        if (!(name in ex)) return { code: "EXPORT_MISSING" };
        value = ex[name];
        for (const member of members) { if (!isRecord(value) || !(member in value)) return { code: "EXPORT_MEMBER_MISSING" }; value = value[member]; }
      } else if (p.pointer !== undefined || p.file.endsWith(".json")) value = this.json(p.file);
      else { this.text(p.file); return p.fileSha256 && this.files.get(p.file) !== p.fileSha256 ? { code: "FILE_HASH_MISMATCH" } : { value: { file: p.file, fileSha256: this.files.get(p.file) } }; }
      const pointer = p.pointer ?? (p.index !== undefined ? `/${p.index}` : "");
      for (const part of pointer.split("/").slice(1)) {
        const key = part.replace(/~1/g, "/").replace(/~0/g, "~");
        if ((isRecord(value) || Array.isArray(value)) && Object.prototype.hasOwnProperty.call(value, key)) value = (value as JsonRecord)[key];
        else return { code: "POINTER_MISSING", detail: pointer };
      }
      if (value === undefined) return { code: "RECORD_MISSING" };
      const id = isRecord(value) ? value.id : undefined;
      if (p.originalId !== undefined && id !== p.originalId) return { code: "ID_MISMATCH" };
      if (p.fileSha256 && this.files.get(p.file) !== p.fileSha256) return { code: "FILE_HASH_MISMATCH" };
      if (p.plainKoSha256 && (!isRecord(value) || typeof value.plainKo !== "string" || hash(value.plainKo) !== p.plainKoSha256)) return { code: "MEANING_FIELD_HASH_MISMATCH" };
      if (p.recordSha256 && (p.recordHashEncoding === "JSON_CANONICAL" ? hash(canonicalJson(value)) : recordHash(value)) !== p.recordSha256) return { code: "RECORD_HASH_MISMATCH" };
      return { value };
    } catch (e) { return { code: "UNREADABLE_SOURCE", detail: e instanceof Error ? e.message : String(e) }; }
  }
}
