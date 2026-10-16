import {readFileSync} from "node:fs";
import {join} from "node:path";
import {createHash} from "node:crypto";
import {gunzipSync} from "node:zlib";
import {hash} from "../sourceReader";
import {isRecord} from "../normalization";
export const SHARD_FORMAT = "GYEOL_GLOBAL_AUDIT_SHARDS_V1";
export const GZIP_FORMAT = "GYEOL_GLOBAL_AUDIT_GZIP_V1";
export function readGlobalArtifact(directory: string, name: string): unknown {
  const cache = new Map<string, unknown>();
  const read = (file: string, expected?: string, depth = 0): unknown => {
    if (!/^[a-z0-9-]+\.json$/.test(file) || depth > 32) throw Error("UNSAFE_GLOBAL_ARTIFACT_REFERENCE");
    let text = readFileSync(join(directory, file), "utf8");
    if (expected && hash(text) !== expected) throw Error("GLOBAL_ARTIFACT_SHARD_HASH_MISMATCH");
    if (cache.has(file)) return cache.get(file);
    let raw: unknown = JSON.parse(text);
    if (isRecord(raw) && raw.format === GZIP_FORMAT) {
      if (typeof raw.payloadFile !== "string" || !/^[a-z0-9-]+\.json\.gz$/.test(raw.payloadFile) || typeof raw.payloadHash !== "string" || typeof raw.logicalJsonHash !== "string" || typeof raw.uncompressedBytes !== "number" || !Number.isSafeInteger(raw.uncompressedBytes) || raw.uncompressedBytes <= 0 || raw.uncompressedBytes >= 49 * 1024 * 1024) throw Error("INVALID_GLOBAL_GZIP_MANIFEST");
      const compressed = readFileSync(join(directory, raw.payloadFile));
      if (createHash("sha256").update(compressed).digest("hex") !== raw.payloadHash) throw Error("GLOBAL_GZIP_PAYLOAD_HASH_MISMATCH");
      const bytes = gunzipSync(compressed, {maxOutputLength: raw.uncompressedBytes});
      text = bytes.toString("utf8");
      if (bytes.length !== raw.uncompressedBytes || hash(text) !== raw.logicalJsonHash) throw Error("GLOBAL_GZIP_LOGICAL_HASH_MISMATCH");
      raw = JSON.parse(text);
    }
    if (!isRecord(raw) || raw.format !== SHARD_FORMAT) {cache.set(file, raw); return raw;}
    if (!Array.isArray(raw.parts) || typeof raw.logicalJsonHash !== "string") throw Error("INVALID_GLOBAL_ARTIFACT_MANIFEST");
    const parts = raw.parts.map(p => {if (!isRecord(p) || typeof p.file !== "string" || typeof p.sha256 !== "string") throw Error("INVALID_GLOBAL_ARTIFACT_PART"); return {meta: p, value: read(p.file, p.sha256, depth + 1)};});
    let value: unknown;
    if (raw.shape === "ARRAY") {
      const rows: unknown[] = [];
      for (const p of parts) {if (p.meta.kind === "ITEM") rows.push(p.value); else if (p.meta.kind === "CHUNK" && Array.isArray(p.value)) {for (const row of p.value) rows.push(row);} else throw Error("INVALID_GLOBAL_ARRAY_PART");}
      if (rows.length !== raw.entries) throw Error("GLOBAL_ARRAY_ENTRY_COUNT_MISMATCH"); value = rows;
    } else if (raw.shape === "OBJECT" && Array.isArray(raw.keys) && raw.keys.every(k => typeof k === "string")) {
      const fields = new Map<string, unknown>();
      for (const p of parts) {
        if (p.meta.kind === "FIELD" && typeof p.meta.key === "string") {if (fields.has(p.meta.key)) throw Error("DUPLICATE_GLOBAL_OBJECT_KEY"); fields.set(p.meta.key, p.value);}
        else if (p.meta.kind === "CHUNK" && isRecord(p.value)) for (const [key, field] of Object.entries(p.value)) {if (fields.has(key)) throw Error("DUPLICATE_GLOBAL_OBJECT_KEY"); fields.set(key, field);}
        else throw Error("INVALID_GLOBAL_OBJECT_PART");
      }
      if (fields.size !== raw.keys.length || new Set(raw.keys).size !== raw.keys.length || raw.keys.some(k => !fields.has(k))) throw Error("GLOBAL_OBJECT_KEY_COUNT_MISMATCH");
      value = Object.fromEntries(raw.keys.map(k => [k, fields.get(k)]));
    } else throw Error("INVALID_GLOBAL_ARTIFACT_SHAPE");
    if (hash(JSON.stringify(value, null, 2) + "\n") !== raw.logicalJsonHash) throw Error("GLOBAL_ARTIFACT_LOGICAL_HASH_MISMATCH");
    cache.set(file, value); return value;
  };
  return read(name);
}
