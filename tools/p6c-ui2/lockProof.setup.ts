/**
 * 잠금 재기록 증명(P6c-ui2 1단계): 잠금 값(대부분 sha256)을 만든 입력까지 풀어서 파일로 남긴다.
 *   V5_LOCK_DUMP=<폴더> pnpm exec vitest run --config tools/p6c-ui2/vitest.lockProof.config.ts --no-file-parallelism
 * 같은 시험을 예전 보정 문구(LOCK_PROOF_OLD_NOTE=1)와 지금 문구로 돌려 두 폴더를 lockProofDiff.ts로 비교한다.
 */
import { appendFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { expect } from "vitest";

const DIR = process.env.V5_LOCK_DUMP;
const require = createRequire(import.meta.url);
const inputs = new Map<string, string>();

if (DIR) {
  mkdirSync(DIR, { recursive: true });
  // sha256 입력 기록: 잠금 값이 해시(또는 해시 목록)라 입력이 있어야 무엇이 바뀌었는지 보인다.
  const crypto = require("node:crypto") as typeof import("node:crypto");
  const original = crypto.createHash;
  (crypto as { createHash: typeof original }).createHash = ((algorithm: string, options?: object) => {
    const hash = original.call(crypto, algorithm, options as never);
    if (String(algorithm).toLowerCase() !== "sha256") return hash;
    const parts: string[] = [], update = hash.update.bind(hash), digest = hash.digest.bind(hash);
    hash.update = ((data: string | NodeJS.ArrayBufferView, encoding?: BufferEncoding) => {
      parts.push(typeof data === "string" ? data : Buffer.from(data.buffer, data.byteOffset, data.byteLength).toString("utf8"));
      update(data as never, encoding as never); return hash;
    }) as typeof hash.update;
    hash.digest = ((encoding?: BufferEncoding) => {
      const out = digest(), hex = out.toString("hex"), input = parts.join("");
      if (!inputs.has(hex) && input.length < 4_000_000) inputs.set(hex, input);
      return encoding ? out.toString(encoding) : out;
    }) as typeof hash.digest;
    return hash;
  }) as typeof original;
  (require("node:module") as typeof import("node:module")).syncBuiltinESMExports();

  const HEX = /^[0-9a-f]{64}$/;
  const parse = (text: string): unknown => { try { return JSON.parse(text); } catch { return text; } };
  // 해시 → {sha256, input}. 입력 안의 해시도 4단계까지 푼다(묶음 해시 = 해시들의 해시).
  const resolveValue = (value: unknown, depth = 0): unknown => {
    if (typeof value === "string") return HEX.test(value) && inputs.has(value) && depth < 4 ? { sha256: value, input: resolveValue(parse(inputs.get(value)!), depth + 1) } : value;
    if (Array.isArray(value)) return value.map(v => resolveValue(v, depth));
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveValue(v, depth)]));
    return value;
  };
  const counters = new Map<string, number>();
  (globalThis as { __v5LockDump?: (key: string, actual: unknown) => void }).__v5LockDump = (key, actual) => {
    const state = expect.getState(), test = state.currentTestName ?? "?", n = (counters.get(test) ?? 0) + 1;
    counters.set(test, n);
    appendFileSync(join(DIR, `${basename(state.testPath ?? "unknown")}.jsonl`), JSON.stringify({ test, n, key, value: resolveValue(actual) }) + "\n");
  };
}
