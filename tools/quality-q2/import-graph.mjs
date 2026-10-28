#!/usr/bin/env node
// Static import graph of src/ from the Next.js app entry points.
// No project imports; run with `node tools/quality-q2/import-graph.mjs [--json] [--root <checkout>] [--list]`.
// Resolves relative imports and the `@/` alias (-> src/), with .ts/.tsx/.js/.mjs/.json and index files.
// Counts static imports, re-exports, side-effect imports, dynamic import() and require(), type-only included.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootIndex = process.argv.indexOf("--root");
const ROOT = rootIndex > 0 ? resolve(process.argv[rootIndex + 1]) : resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = join(ROOT, "src");
const APP = join(SRC, "app");

const TARGETS = [
  "openaiAnnualFortuneReportWriter.ts",
  "openaiAnnualFortuneReportWriterPrompt.ts",
  "openaiCareerReportWriter.ts",
  "openaiCareerReportWriterPrompt.ts",
  "openaiCompatibilityReportWriter.ts",
  "openaiCompatibilityReportWriterPrompt.ts",
  "openaiComprehensiveReportWriter.ts",
  "openaiLoveMarriageChildReportWriter.ts",
  "openaiLoveMarriageChildReportWriterPrompt.ts",
  "openaiMajorFortuneReportWriter.ts",
  "openaiMajorFortuneReportWriterPrompt.ts",
  "openaiReportWriterClient.ts",
  "openaiReportWriterPrompt.ts",
  "paidWriterRequest.ts",
  "paidWriterRescue.ts",
  "reportWriterCallGuard.ts",
  "reportWriterRuntime.ts",
].map(name => `src/lib/report-generation/${name}`);

const ENTRY_RE = /^(page|layout|template|default|loading|error|global-error|not-found|route|opengraph-image|twitter-image|icon|apple-icon|sitemap|robots|manifest)\.(ts|tsx|js|jsx)$/;
const EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"];

const rel = abs => relative(ROOT, abs).split("\\").join("/");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const abs = join(dir, name);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}

function entries() {
  const list = walk(APP).filter(abs => ENTRY_RE.test(abs.split("/").pop()));
  for (const extra of ["middleware", "proxy", "instrumentation"]) {
    for (const ext of [".ts", ".tsx", ".js"]) {
      const abs = join(SRC, extra + ext);
      if (existsSync(abs)) list.push(abs);
    }
  }
  return list.sort();
}

// Remove comments while keeping string/template contents intact.
function stripComments(code) {
  let out = "";
  let i = 0;
  let quote = null;
  while (i < code.length) {
    const c = code[i];
    const n = code[i + 1];
    if (quote) {
      out += c;
      if (c === "\\") { out += n ?? ""; i += 2; continue; }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }
    if (c === "/" && n === "/") { while (i < code.length && code[i] !== "\n") i += 1; continue; }
    if (c === "/" && n === "*") { const end = code.indexOf("*/", i + 2); i = end < 0 ? code.length : end + 2; continue; }
    if (c === "'" || c === "\"" || c === "`") quote = c;
    out += c;
    i += 1;
  }
  return out;
}

const SPEC_RES = [
  /\b(?:import|export)\s+(?:type\s+)?[^'"`;]*?\bfrom\s*["']([^"']+)["']/gs,
  /\bimport\s*["']([^"']+)["']/g,
  /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
];

function specifiers(abs) {
  const code = stripComments(readFileSync(abs, "utf8"));
  const found = new Set();
  for (const re of SPEC_RES) for (const m of code.matchAll(re)) found.add(m[1]);
  return [...found];
}

function resolveSpec(fromAbs, spec) {
  let base;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith("./") || spec.startsWith("../")) base = resolve(dirname(fromAbs), spec);
  else return { external: true };
  const candidates = [base, ...EXTS.map(e => base + e), ...EXTS.map(e => join(base, "index" + e))];
  for (const c of candidates) if (existsSync(c) && statSync(c).isFile()) return { file: c };
  return { unresolved: true };
}

function buildGraph() {
  const roots = entries();
  const parent = new Map();
  const unresolved = [];
  const queue = [];
  for (const r of roots) { parent.set(r, null); queue.push(r); }
  while (queue.length) {
    const cur = queue.shift();
    if (!/\.(ts|tsx|js|jsx|mjs)$/.test(cur)) continue;
    for (const spec of specifiers(cur)) {
      const res = resolveSpec(cur, spec);
      if (res.external) continue;
      if (res.unresolved) { unresolved.push({ from: rel(cur), spec }); continue; }
      if (!parent.has(res.file)) { parent.set(res.file, cur); queue.push(res.file); }
    }
  }
  return { roots, parent, unresolved };
}

function chain(parent, abs) {
  const path = [];
  for (let cur = abs; cur; cur = parent.get(cur)) path.unshift(rel(cur));
  return path;
}

const { roots, parent, unresolved } = buildGraph();
const allSrc = walk(SRC).filter(f => /\.(ts|tsx)$/.test(f));
const targets = TARGETS.map(t => {
  const abs = join(ROOT, t);
  const exists = existsSync(abs);
  const lines = exists ? readFileSync(abs, "utf8").split("\n").length - (readFileSync(abs, "utf8").endsWith("\n") ? 1 : 0) : 0;
  const reachable = parent.has(abs);
  return { file: t, exists, lines, reachable, chain: reachable ? chain(parent, abs) : [] };
});
const result = {
  entryPoints: roots.length,
  srcTsFiles: allSrc.length,
  reachableFiles: parent.size,
  unresolvedLocalImports: unresolved,
  targets,
  summary: {
    targetsExisting: targets.filter(t => t.exists).length,
    targetLines: targets.reduce((s, t) => s + t.lines, 0),
    targetsReachable: targets.filter(t => t.reachable).length,
  },
};

if (process.argv.includes("--list")) {
  for (const file of [...parent.keys()].map(rel).sort()) console.log(file);
} else if (process.argv.includes("--json")) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`entry points: ${result.entryPoints}`);
  console.log(`src .ts/.tsx files: ${result.srcTsFiles}`);
  console.log(`reachable files from entries: ${result.reachableFiles}`);
  console.log(`unresolved local imports: ${unresolved.length}`);
  for (const u of unresolved) console.log(`  ${u.from} -> ${u.spec}`);
  console.log(`targets existing: ${result.summary.targetsExisting}/${TARGETS.length}, lines: ${result.summary.targetLines}, reachable: ${result.summary.targetsReachable}`);
  for (const t of targets) {
    console.log(`- ${t.file} [${t.exists ? `${t.lines} lines` : "deleted"}] ${t.reachable ? "REACHABLE" : "unreachable"}`);
    if (t.reachable) console.log(`    via ${t.chain.join(" -> ")}`);
  }
}
