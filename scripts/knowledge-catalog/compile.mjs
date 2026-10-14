/* Explicit offline CLI. The only modules executed are repository research/data
 * modules enumerated by reviewed config. Never import this loader from a route. */
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
const loadModule = createRequire(import.meta.url);
const root = process.cwd();
const oldResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return oldResolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, ...args);
};
Module._extensions['.ts'] = (m, file) => m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, file);
global.fetch = async () => { throw new Error('OFFLINE_CATALOG_NETWORK_DISABLED'); };
const folder = 'docs/validation/v4-knowledge-unified-catalog-01';
const config = JSON.parse(fs.readFileSync(path.join(root, folder, 'compiler-config.json'), 'utf8'));
const { compileCatalog, writeArtifacts } = loadModule('../../src/lib/report-knowledge/knowledge-integration-foundation/compiler.ts');
compileCatalog(root, config, async file => loadModule(file)).then(a => {
  writeArtifacts(path.resolve(process.argv[2] || folder), a);
  process.stdout.write(JSON.stringify({ research: a.manifest.actualResearchRecords, foundation: a.manifest.foundationSourceRecords, references: a.manifest.references, issues: a.manifest.issues.length }) + '\n');
  if (a.manifest.families.some(f => f.actual !== f.expected) || a.manifest.issues.some(i => ['DUPLICATE_CATALOG_KEY', 'RESEARCH_UNREADABLE', 'UNCONFIGURED_RESEARCH_FAMILY', 'FOUNDATION_UNREADABLE', 'FOUNDATION_EXPORT_UNSUPPORTED', 'INHERITED_INVENTORY_MISMATCH'].includes(i.code))) process.exitCode = 1;
}).catch(error => { process.stderr.write(String(error) + '\n'); process.exitCode = 1; });
