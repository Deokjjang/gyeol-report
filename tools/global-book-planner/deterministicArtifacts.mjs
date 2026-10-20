import fs from'node:fs';import path from'node:path';import{gzipSync}from'node:zlib';import{createHash}from'node:crypto';
const sha=x=>createHash('sha256').update(x).digest('hex');
// Reuse both authenticated legacy formats. Every gzip leaf is below the
// existing reader's 49 MB limit; large logical plans remain exact and sharded.
export function artifactWriter(out,validate){
 const files=[];
 return{files,write(name,value){validate(value);let counter=0;const base=name.slice(0,-5),next=()=>base+'-part-'+String(++counter).padStart(4,'0')+'.json';
  const raw=(file,bytes)=>{fs.writeFileSync(path.join(out,file),bytes);files.push(file);return sha(bytes);};
  const node=(file,value)=>{const text=JSON.stringify(value,null,2)+'\n',bytes=Buffer.byteLength(text);let manifest;
   if(bytes<=8*1024*1024){if(bytes>512*1024){const payloadFile=file+'.gz',compressed=gzipSync(text,{level:9});raw(payloadFile,compressed);manifest={format:'GYEOL_GLOBAL_AUDIT_GZIP_V1',payloadFile,payloadHash:sha(compressed),logicalJsonHash:sha(text),uncompressedBytes:bytes};}else return raw(file,text);}
   else if(Array.isArray(value)){const parts=[];let chunk=[],chunkBytes=0;const flush=()=>{if(!chunk.length)return;const child=next(),hash=node(child,chunk);parts.push({file:child,sha256:hash,kind:'CHUNK'});chunk=[];chunkBytes=0;};for(const item of value){const size=Buffer.byteLength(JSON.stringify(item,null,2));if(size>2*1024*1024){flush();const child=next(),hash=node(child,item);parts.push({file:child,sha256:hash,kind:'ITEM'});}else{if(chunkBytes+size>2*1024*1024)flush();chunk.push(item);chunkBytes+=size;}}flush();manifest={format:'GYEOL_GLOBAL_AUDIT_SHARDS_V1',shape:'ARRAY',entries:value.length,logicalJsonHash:sha(text),parts};}
   else if(value&&typeof value==='object'){const parts=[];for(const[key,item]of Object.entries(value)){const child=next(),hash=node(child,item);parts.push({file:child,sha256:hash,kind:'FIELD',key});}manifest={format:'GYEOL_GLOBAL_AUDIT_SHARDS_V1',shape:'OBJECT',keys:Object.keys(value),logicalJsonHash:sha(text),parts};}
   else throw Error('UNSHARDABLE_PLANNER_ARTIFACT');
   return raw(file,JSON.stringify(manifest,null,2)+'\n');
  };node(name,value);
 }};
}
