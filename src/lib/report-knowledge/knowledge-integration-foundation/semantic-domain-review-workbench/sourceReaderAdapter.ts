import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {SourceReader,hash,recordHash,canonicalJson} from '../sourceReader';
import {ExactSourceResolver} from '../global-source-domain-resolution/exactSourceResolver';
import {SourceVerificationEngine} from '../source-verification/engine';
import {readGlobalArtifact} from '../global-specialist-integration/artifactReader';
import {isRecord} from '../normalization';
import type {CatalogConfig,KnowledgeCatalogRecord,KnowledgeReferenceEdge,KnowledgeSourcePointer} from '../types';
import type {VerificationConfig,VerificationReceipt} from '../source-verification/types';
import type {SemanticDomainDecision,DirectMeaningReview,AncestorPolicyReceipt} from '../semantic-domain-verification/types';
import type {SourceResolution} from '../global-source-domain-resolution/types';
import type {OriginalReading} from './types';
import {digest} from '../global-specialist-integration/candidateEnvelope';
export const RESOLUTION_DIR='docs/validation/v4-global-source-domain-resolution-01';
export function intake(root:string,reader:SourceReader,frozen:ReadonlyMap<string,string>){
 const json=<T>(file:string):T=>JSON.parse(readFileSync(join(root,file),'utf8')) as T;
 const artifact=<T>(dir:string,name:string):T=>readGlobalArtifact(join(root,dir),name) as T;
 const sd='docs/validation/v4-knowledge-source-verification-01',dd='docs/validation/v4-knowledge-semantic-domain-verification-01',config=json<VerificationConfig>(sd+'/verification-config.json'),cc=json<CatalogConfig>(config.catalogConfig),manifest=json<{shard:string}[]>(config.catalogRoot+'/knowledge-catalog.json');
 const records=[...new Set(manifest.map(r=>r.shard))].flatMap(f=>json<KnowledgeCatalogRecord[]>(config.catalogRoot+'/'+f)),edges=json<{shard:string}[]>(config.catalogRoot+'/knowledge-edges.json').flatMap(r=>json<KnowledgeReferenceEdge[]>(config.catalogRoot+'/'+r.shard));
 const receipts=json<VerificationReceipt[]>(sd+'/source-verification-receipts.json'),domains=json<SemanticDomainDecision[]>(dd+'/semantic-domain-decisions.json'),overlay=artifact<SourceResolution[]>(RESOLUTION_DIR,'source-resolution-overlay.json'),prior=json<DirectMeaningReview[]>(dd+'/direct-meaning-reviews.json'),ancestry=json<AncestorPolicyReceipt[]>(dd+'/ancestor-domain-audit.json');
 const native=new SourceVerificationEngine(reader,records,edges,config,cc,frozen),resolver=new ExactSourceResolver(reader,records,frozen,native,json<KnowledgeReferenceEdge[]>(config.catalogRoot+'/unresolved-references.json'));
 if(records.filter(r=>r.namespace==='RESEARCH').length!==18610||cc.families.length!==20||receipts.length!==6490||domains.length!==2966||overlay.length!==3202||overlay.filter(o=>o.newTechnicalAssessment==='PROVEN_TECHNICAL_RESOLUTION').length!==525||domains.filter(d=>d.decisionState==='EXPLICITLY_PROHIBITED').length!==1040||prior.length!==31)throw Error('FROZEN_INTAKE_COUNT_CHANGED');
 return {json,artifact,records,receipts,domains,overlay,prior,ancestry,resolver,config,cc};
}
const CONTENT=new Set(['coreMeaning','core','meaning','question','readerQuestion','plainKo','definition','traditional','formation','positive','risk','shadow','twist','positiveSource','riskSource','application','applicationGate','loveApplication','requirements','prerequisites','requires','exclusions','forbidden','disallowed','counterexample','evidenceCondition','roleContributions','factBomb','strongLine','domains','layerRoles','conditions','boundary','failures']);
const METADATA=new Set(['id','sourceId','originalId','sourceRefs','sourceKeys','runtimeEvidenceIds','sourceVersion','recordSha256','sourceFileSha256','connectedToRuntime','approvedForCustomer','verification','review','bindingState']);
export function contentFields(value:unknown,pointer=''):{pointer:string;text:string}[]{
 if(typeof value==='string')return value.trim().length>1?[{pointer,text:value}]:[];
 if(Array.isArray(value))return value.flatMap((v,i)=>contentFields(v,pointer+'/'+i));
 if(!isRecord(value))return [];
 return Object.entries(value).filter(([k])=>!METADATA.has(k)&&(pointer!==''||CONTENT.has(k))).flatMap(([k,v])=>contentFields(v,pointer+'/'+k.replace(/~/g,'~0').replace(/\//g,'~1')));
}
export async function readOriginal(record:KnowledgeCatalogRecord,resolver:ExactSourceResolver,verifyVersion:(pointer:KnowledgeSourcePointer)=>boolean):Promise<OriginalReading>{
 if(!verifyVersion(record.locator))throw Error('ORIGINAL_SOURCE_VERSION_UNVERIFIED');
 const original=await resolver.record(record),proof=await resolver.proof(record.locator,record.originalId,record.catalogKey),fields=contentFields(original);
 if(!isRecord(original)||!fields.length)throw Error('METADATA_ONLY_READING_BLOCKED');
 if(proof.originalId!==record.originalId||proof.matchedCatalogKey!==record.catalogKey||proof.expectedHash!==record.locator.recordSha256||proof.actualHash!==proof.expectedHash||!proof.locator.fileSha256||proof.sourceVersion!==record.locator.sourceVersion)throw Error('ORIGINAL_PROOF_IDENTITY_MISMATCH');
 // File-version hashes are checked by SourceReader. Git versions are checked by
 // the CLI against the same path at the exact declared commit, never HEAD alone.
 return {catalogKey:record.catalogKey,originalId:record.originalId,original,proof,contentFields:fields,contentHash:digest(fields),sourceVersionVerified:true};
}
export function validateReading(reading:OriginalReading){
 const actual=reading.proof.hashAlgorithm==='SHA256_JSON_CANONICAL'?hash(canonicalJson(reading.original)):recordHash(reading.original);
 if(actual!==reading.proof.actualHash||reading.proof.originalId!==reading.originalId||reading.proof.matchedCatalogKey!==reading.catalogKey||!reading.contentFields.length||digest(contentFields(reading.original))!==reading.contentHash||digest(reading.contentFields)!==reading.contentHash||reading.proof.actualHash!==reading.proof.expectedHash||!reading.proof.locator.fileSha256||!reading.sourceVersionVerified)throw Error('READING_CONTENT_OR_PROOF_CHANGED');
 return hash(JSON.stringify(reading.original));
}
