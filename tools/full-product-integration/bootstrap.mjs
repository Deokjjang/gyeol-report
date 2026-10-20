import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import ts from 'typescript';
import { bootstrap as original } from '../korean-editorial-engine/bootstrap.mjs';
export const BASE = '1e4f6b0b74818a6605a7ea39a8dbcd34a8a9ea3c';
export function bootstrap(root = process.cwd()) {
  const b = original(root), prior = Module._extensions['.ts'];
  Module._extensions['.ts'] = (m, file) => {
    if (!file.startsWith(path.join(root, 'src/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/'))) return prior(m, file);
    m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { fileName: file, compilerOptions: {
      module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true,
    } }).outputText, file);
  };
  return b;
}
