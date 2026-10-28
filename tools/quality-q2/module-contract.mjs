#!/usr/bin/env node
// Regenerates tests/fixtures/technical-stabilization-01/module-contract.json with the same
// helper the tests use (tests/helpers/moduleDependencyGraph.ts, loaded via Node type stripping).
// `names` and `semantics` are kept; `customer` is recomputed from src/. `layers` are only reported
// (rewritten with --layers): their drift predates the OpenAI removal and is a separate review.
// Usage: node tools/quality-q2/module-contract.mjs [--write --source-sha <sha>] [--layers] [--list-removed]
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
process.chdir(ROOT);
const { customerRuntimeGraph, layerImports, readModuleGraph } = await import("../../tests/helpers/moduleDependencyGraph.ts");

const FIXTURE = "tests/fixtures/technical-stabilization-01/module-contract.json";
const previous = JSON.parse(readFileSync(FIXTURE, "utf8"));
const graph = readModuleGraph();
const layers = Object.fromEntries(Object.entries(previous.names).map(([key, names]) => [key, layerImports(graph, names)]));
const customer = customerRuntimeGraph(graph);
const argv = process.argv.slice(2);
const shaIndex = argv.indexOf("--source-sha");
const next = { ...previous, sourceSha: shaIndex >= 0 ? argv[shaIndex + 1] : previous.sourceSha, layers: argv.includes("--layers") ? layers : previous.layers, customer };

const same = key => JSON.stringify(previous[key]) === JSON.stringify(next[key]);
console.log(`layers unchanged: ${["scheduler", "foundation", "language"].map(k => `${k}=${JSON.stringify(previous.layers[k]) === JSON.stringify(layers[k])}`).join(" ")}`);
console.log(`customer unchanged: ${same("customer")} (roots ${previous.customer.roots.length} -> ${customer.roots.length}, files ${previous.customer.files.length} -> ${customer.files.length}, blocked ${customer.blocked.length}, unresolved ${customer.unresolved.length})`);
const before = new Set(previous.customer.files), after = new Set(customer.files);
console.log(`customer files removed: ${[...before].filter(f => !after.has(f)).length}, added: ${[...after].filter(f => !before.has(f)).length}`);
if (argv.includes("--list-removed")) for (const f of [...before].filter(f => !after.has(f))) console.log(`  - ${f}`);
if (argv.includes("--write")) {
  const text = `${JSON.stringify(next, null, 2)}\n`;
  writeFileSync(FIXTURE, text);
  console.log(`wrote ${FIXTURE} sha256=${createHash("sha256").update(text).digest("hex")} sourceSha=${next.sourceSha}`);
}
