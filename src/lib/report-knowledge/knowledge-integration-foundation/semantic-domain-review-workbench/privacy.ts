import {isRecord} from '../normalization';
export function collectPrivateTerms(value:unknown,out=new Set<string>()){
 if(Array.isArray(value)){for(const v of value)collectPrivateTerms(v,out);}
 else if(isRecord(value))for(const[k,v]of Object.entries(value)){if(['name','birthDate'].includes(k)&&typeof v==='string'&&v.length>1)out.add(v);else collectPrivateTerms(v,out);}
 return out;
}
export function validatePrivateExport(value:unknown,forbidden:ReadonlySet<string>){
 const text=JSON.stringify(value);for(const term of forbidden)if(text.includes(term))throw Error('PRIVATE_FIXTURE_INPUT_EXPORTED');
 const walk=(v:unknown):void=>{if(Array.isArray(v)){for(const a of v)walk(a);}else if(isRecord(v))for(const[k,x]of Object.entries(v)){if(k==='originalPersonId'&&x!==null&&x!==undefined)throw Error('ORIGINAL_PERSON_HASH_EXPORTED');if(k==='birthDate'&&typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x))throw Error('BIRTH_DATE_EXPORTED');walk(x);}};walk(value);
 if(/(?:access_token|service_role|TOSS_SECRET|SUPABASE_SERVICE_ROLE)/i.test(text))throw Error('SECRET_FIELD_EXPORTED');
}
/** Presentation projection only. The frozen witness itself is never mutated. */
export function redactOriginalPersonHashes(value:unknown):unknown {
 if(Array.isArray(value))return value.map(redactOriginalPersonHashes);
 if(isRecord(value))return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,k==='originalPersonId'?null:redactOriginalPersonHashes(v)]));
 return value;
}
