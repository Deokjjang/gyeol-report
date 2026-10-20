import fs from'node:fs';import path from'node:path';import Module from'node:module';import ts from'typescript';import{pathToFileURL}from'node:url';import{bootstrap as original}from'../semantic-domain-review-workbench/bootstrap.mjs';
export const BASE='fe1764f802985516458663e58e40ced586d95024';
export function bootstrap(root=process.cwd()){
 const b=original(root),prior=Module._extensions['.ts'];
 Module._extensions['.ts']=(m,f)=>{if(!f.startsWith(path.join(root,'src/lib/report-knowledge/knowledge-integration-foundation/global-book-planner/') )&&!f.startsWith(path.join(root,'tools/global-book-planner/')))return prior(m,f);m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);};
 return{...b,load:f=>b.require(path.isAbsolute(f)?f:path.join(root,f)),json:f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8')),url:pathToFileURL};
}
