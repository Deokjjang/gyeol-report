/**
 * P6c A1 변환 항목 뽑기: pnpm exec tsx tools/p6c/seeds/extract.ts <작업 폴더> [--size 550] [--only-missing]
 * 지식 DB(legacy 제외)를 RULES로 걸러 { id: "파일#경로", kind, ctx, text } 묶음을 batch-NN.json으로 쓴다.
 * --only-missing: 결과 필드가 이미 있는 항목은 뺀다(재변환·누락분만).
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { PHASE2, RULES, walk, type Kind } from "./rules";

export const KNOW = resolve(import.meta.dirname, "../../../src/data/knowledge-v5");
export type Item = { id: string; kind: Kind; ctx: string; text: string };
const get = (root: unknown, path: string): unknown => (path.match(/[^.[\]]+|\[\d+\]/g) ?? []).reduce<unknown>((o, k) => (o == null ? o : (o as Record<string, unknown>)[k.startsWith("[") ? Number(k.slice(1, -1)) : k]), root);

export function dbFiles(): string[] {
  const out: string[] = [];
  const go = (d: string) => { for (const f of readdirSync(d, { withFileTypes: true })) { const p = join(d, f.name); if (f.isDirectory()) { if (f.name !== "legacy") go(p); } else if (f.name.endsWith(".json")) out.push(p); } };
  go(KNOW);
  return out.sort();
}

/** 항목 맥락: 기능 이름·영역·조건(작가가 아니라 변환하는 쪽이 뜻을 놓치지 않게). */
function ctxOf(root: unknown, path: string): string {
  const head = path.match(/^(features|profiles|rules|entries|types|jobs)\[\d+\]/)?.[0] ?? "";
  const o = get(root, head) as Record<string, unknown> | undefined;
  const name = (o?.name ?? o?.type ?? o?.myeongriId ?? o?.tenGod ?? o?.title ?? o?.label ?? "") as string;
  const extra = o && "mbtiTarget" in o ? ` × ${o.mbtiTarget}` : "";
  return `${name}${extra} · ${path.slice(head.length + 1).replace(/\[\d+\]/g, "")}`;
}

export function extractAll(onlyMissing = false): Item[] {
  const items: Item[] = [];
  // --only-missing: materials.json에 이미 재료가 있는 원문은 뺀다(원문 sha1 앞 12자).
  const mf = join(KNOW, "materials.json");
  const done = new Set(onlyMissing && existsSync(mf) ? Object.keys((JSON.parse(readFileSync(mf, "utf8")) as { items: Record<string, string> }).items) : []);
  for (const abs of dbFiles()) {
    const file = relative(KNOW, abs), root = JSON.parse(readFileSync(abs, "utf8"));
    const rules = RULES.filter(r => r.file.test(file));
    if (!rules.length) continue;
    for (const [path, text] of walk(root)) {
      const r = rules.find(x => x.path.test(path)); if (!r || !text.trim()) continue;
      if (onlyMissing && done.has(createHash("sha1").update(text).digest("hex").slice(0, 12))) continue;
      items.push({ id: `${file}#${path}`, kind: r.kind, ctx: ctxOf(root, path), text });
    }
  }
  return items;
}

if (process.argv[1]?.endsWith("extract.ts")) {
  const dir = process.argv[2]; if (!dir) throw new Error("작업 폴더");
  const size = process.argv.includes("--size") ? Number(process.argv[process.argv.indexOf("--size") + 1]) : 550;
  // --phase 1|2: 1차(장면·forYou 등) 또는 2차(PHASE2) 항목만. --start: 묶음 번호 시작.
  const phase = process.argv.includes("--phase") ? process.argv[process.argv.indexOf("--phase") + 1] : "";
  const start = process.argv.includes("--start") ? Number(process.argv[process.argv.indexOf("--start") + 1]) : 1;
  // --kind seed|dir: 종류별 묶음(씨앗은 짧은 명사구라 따로 맡긴다). dir에는 core·fn도 든다.
  const kind = process.argv.includes("--kind") ? process.argv[process.argv.indexOf("--kind") + 1] : "";
  const items = extractAll(process.argv.includes("--only-missing")).filter(x => (!phase || (phase === "2") === PHASE2.test(x.id)) && (!kind || (kind === "seed") === (x.kind === "seed")));
  mkdirSync(dir, { recursive: true });
  const batches: Item[][] = [];
  for (let i = 0; i < items.length; i += size) batches.push(items.slice(i, i + size));
  batches.forEach((b, i) => writeFileSync(join(dir, `batch-${String(i + start).padStart(2, "0")}.json`), JSON.stringify(b, null, 0).replace(/\},\{/g, "},\n{") + "\n"));
  const byKind = items.reduce<Record<string, number>>((a, x) => ({ ...a, [x.kind]: (a[x.kind] ?? 0) + 1 }), {});
  console.log(JSON.stringify({ items: items.length, batches: batches.length, byKind, chars: items.reduce((a, x) => a + x.text.length, 0) }));
}
