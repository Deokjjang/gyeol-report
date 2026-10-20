/* Explicit offline entry point. No customer route imports this file.
 * Reuses the catalog SourceReader/ReferenceResolver. The small TS bootstrap is
 * local because importing the existing compile.mjs would execute compilation.
 * Only frozen repository modules and this verifier's modules may be loaded. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
const root = process.cwd();
const folder = 'docs/validation/v4-knowledge-source-verification-01';
const implementation = 'src/lib/report-knowledge/knowledge-integration-foundation/source-verification/';
const json = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const config = json(`${folder}/verification-config.json`);
const catalogConfig = json(config.catalogConfig);
const frozen = json(`${folder}/original-file-hashes.json`);
const out = path.resolve(process.argv[2] || folder);
if (process.argv.length > 3 || out === root || out.startsWith(path.join(root, config.catalogRoot)) || out.startsWith(path.join(root, 'src')) || out.startsWith(path.join(root, 'scripts'))) throw new Error('UNSAFE_OUTPUT_DIRECTORY');
const ownFiles = new Set(fs.readdirSync(path.join(root, implementation)).filter(f => f.endsWith('.ts')).map(f => implementation + f));
const loadModule = createRequire(import.meta.url);
const oldResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return oldResolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, ...args);
};
Module._extensions['.ts'] = (m, file) => {
  const relative = path.relative(root, file);
  const bytes = fs.readFileSync(file);
  if (relative.startsWith('..') || (!ownFiles.has(relative) && (!frozen[relative] || sha(bytes) !== frozen[relative]))) throw new Error('UNREVIEWED_MODULE_OR_HASH_MISMATCH');
  m._compile(ts.transpileModule(bytes.toString('utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, file);
};
// An unexpected network use fails closed, including non-fetch Node clients.
global.fetch = async () => { throw new Error('OFFLINE_SOURCE_VERIFICATION_NETWORK_DISABLED'); };
for (const name of ['node:http', 'node:https']) {
  const http = loadModule(name);
  http.request = http.get = () => { throw new Error('OFFLINE_SOURCE_VERIFICATION_NETWORK_DISABLED'); };
}
const { SourceReader } = loadModule('../../src/lib/report-knowledge/knowledge-integration-foundation/sourceReader.ts');
const { SourceVerificationEngine } = loadModule('../../' + implementation + 'engine.ts');
const { writeVerificationArtifacts } = loadModule('../../' + implementation + 'artifacts.ts');
try {
  // Check all frozen inputs before module evaluation or output, not just used sources.
  for (const [file, expected] of Object.entries(frozen)) if (sha(fs.readFileSync(path.join(root, file))) !== expected) throw new Error(`BASE_INPUT_CHANGED:${file}`);
  const index = json(`${config.catalogRoot}/knowledge-catalog.json`);
  const shards = [...new Set(index.map(r => r.shard))];
  const records = shards.flatMap(file => json(`${config.catalogRoot}/${file}`));
  const edges = json(`${config.catalogRoot}/knowledge-edges.json`).flatMap(r => json(`${config.catalogRoot}/${r.shard}`));
  const unresolved = json(`${config.catalogRoot}/unresolved-references.json`);
  const reader = new SourceReader(root, async file => loadModule(file), [...catalogConfig.knownSourceVersions, config.baseSha]);
  const engine = new SourceVerificationEngine(reader, records, edges, config, catalogConfig, new Map(Object.entries(frozen)));
  const startedAt = new Date().toISOString();
  const result = await engine.run(unresolved);
  writeVerificationArtifacts(out, result);
  // Wall clock deliberately never enters versioned, reproducible artifacts.
  const runMetadata = path.join(os.tmpdir(), `gyeol-source-verification-run-${process.pid}.json`);
  fs.writeFileSync(runMetadata, JSON.stringify({ startedAt, finishedAt: new Date().toISOString(), baseSha: config.baseSha, output: out, references: result.receipts.length, network: 'disabled' }, null, 2) + '\n');
  process.stdout.write(JSON.stringify({ ...result.manifest, runMetadata }) + '\n');
} catch (error) {
  process.stderr.write(String(error) + '\n'); process.exitCode = 1;
}
