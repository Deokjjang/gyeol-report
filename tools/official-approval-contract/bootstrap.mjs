import fs from 'node:fs';import path from 'node:path';import Module from 'node:module';import ts from 'typescript';
import {bootstrap as existing} from '../global-book-planner/bootstrap.mjs';
export const BASE='16afa43981db46a4cd936f120bfcc5cf86d58c54';
export function bootstrap(root=process.cwd()){
 const b=existing(root),prior=Module._extensions['.ts'];
 Module._extensions['.ts']=(m,f)=>{if(!f.startsWith(path.join(root,'src/lib/report-knowledge/knowledge-integration-foundation/official-approval-contract/')))return prior(m,f);m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);};
 return b;
}
