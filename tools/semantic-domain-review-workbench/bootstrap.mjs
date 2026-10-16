/* Offline-only composition root; never imported by customer routes. */
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import Module,{createRequire}from'node:module';import {execFileSync}from'node:child_process';import {pathToFileURL}from'node:url';import ts from'typescript';
export const BASE='820f8dcdf71b73aa2601bcdae8e70d99762bb9e8';
export function bootstrap(root=process.cwd()) {
 const require=createRequire(import.meta.url),sha=b=>crypto.createHash('sha256').update(b).digest('hex');
 execFileSync('git',['merge-base','--is-ancestor',BASE,'HEAD'],{cwd:root,stdio:'pipe'});
 const tree=execFileSync('git',['ls-tree','-r','-z',BASE],{cwd:root,encoding:'utf8'}),frozen=new Map();
 for(const entry of tree.split('\0').filter(Boolean)){const [metadata,file]=entry.split('\t'),oid=metadata.split(' ')[2],bytes=fs.readFileSync(path.join(root,file)),gitHash=crypto.createHash('sha1').update('blob '+bytes.length+'\0').update(bytes).digest('hex');if(gitHash!==oid)throw Error('FROZEN_BASE_CHANGED:'+file);frozen.set(file,sha(bytes));}
 const oldResolve=Module._resolveFilename,oldLoad=Module._load;
 Module._resolveFilename=function(n,...a){return oldResolve.call(this,n.startsWith('@/')?path.join(root,'src',n.slice(2)):n,...a)};
 Module._load=function(n,...a){return n==='server-only'?{}:oldLoad.call(this,n,...a)};
 Module._extensions['.ts']=Module._extensions['.tsx']=(m,f)=>{const rel=path.relative(root,f),b=fs.readFileSync(f);if(rel.startsWith('..')||!rel.includes('semantic-domain-review-workbench/')&&(!frozen.has(rel)||sha(b)!==frozen.get(rel)))throw Error('UNREVIEWED_WORKBENCH_MODULE:'+rel);m._compile(ts.transpileModule(b.toString('utf8').replaceAll('import.meta.url',JSON.stringify(pathToFileURL(f).href)),{fileName:f,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,resolveJsonModule:true}}).outputText,f)};
 global.fetch=async()=>{throw Error('OFFLINE_WORKBENCH_NETWORK_DISABLED')};for(const name of ['node:http','node:https']){const h=require(name);h.get=h.request=()=>{throw Error('OFFLINE_WORKBENCH_NETWORK_DISABLED')}}
 const ownInputs=new Map();for(const folder of ['src/lib/report-knowledge/knowledge-integration-foundation/semantic-domain-review-workbench','tools/semantic-domain-review-workbench'])for(const file of fs.readdirSync(path.join(root,folder)).sort()){const full=path.join(root,folder,file);if(fs.statSync(full).isFile())ownInputs.set(folder+'/'+file,sha(fs.readFileSync(full)));}
 const verify=()=>{for(const[file,h]of ownInputs)if(sha(fs.readFileSync(path.join(root,file)))!==h)throw Error('WORKBENCH_INPUT_CHANGED:'+file);for(const[file,h]of frozen)if(sha(fs.readFileSync(path.join(root,file)))!==h)throw Error('FROZEN_SOURCE_CHANGED:'+file)};
 const versions=new Map();
 const verifyVersion=p=>{if(!p.sourceVersion||!frozen.has(p.file))return false;if(/^[a-f0-9]{64}$/.test(p.sourceVersion))return p.sourceVersion===frozen.get(p.file);if(!/^[a-f0-9]{40}$/.test(p.sourceVersion))return false;const key=p.sourceVersion+':'+p.file;if(!versions.has(key)){try{versions.set(key,sha(execFileSync('git',['show',key],{cwd:root,maxBuffer:128*1024*1024})));}catch{versions.set(key,null);}}return versions.get(key)===frozen.get(p.file);};
 return {root,require,frozen,verify,sha,verifyVersion,ownInputs};
}
