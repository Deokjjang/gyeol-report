import fs from 'node:fs';import path from 'node:path';import Module from 'node:module';import ts from 'typescript';
import{bootstrap as original}from'../official-approval-contract/bootstrap.mjs';
export const BASE='f104134ffac56d7d0ec32055d1a3095411c9d702';
export function bootstrap(root=process.cwd()){
 const b=original(root),prior=Module._extensions['.ts'];
 Module._extensions['.ts']=(m,f)=>{if(!f.startsWith(path.join(root,'src/lib/report-knowledge/knowledge-integration-foundation/korean-editorial-engine/')))return prior(m,f);m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);};return b;
}
