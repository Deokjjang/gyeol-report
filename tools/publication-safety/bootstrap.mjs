import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';
export function bootstrap(root = process.cwd()) {
  const require = createRequire(import.meta.url), resolve = Module._resolveFilename, load = Module._load;
  Module._resolveFilename = function (name, ...args) { return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, ...args); };
  Module._load = function (name, ...args) { return name === 'server-only' ? {} : load.call(this, name, ...args); };
  Module._extensions['.tsx'] = Module._extensions['.ts'] = (m, file) => m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(file).href)), {
    fileName: file, compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, file);
  global.fetch = async () => { throw Error('OFFLINE_PUBLICATION_NETWORK_DISABLED'); };
  for (const name of ['node:http', 'node:https']) { const h = require(name); h.request = h.get = () => { throw Error('OFFLINE_PUBLICATION_NETWORK_DISABLED'); }; }
  return { require, load: file => require(path.join(root, file)) };
}
