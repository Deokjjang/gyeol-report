import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{bootstrap}from'./bootstrap.mjs';
export async function context(root=process.cwd()){
 const b=bootstrap(root),load=b.load,json=b.json,p='src/lib/report-knowledge/knowledge-integration-foundation/';
 const cr='docs/validation/v4-knowledge-unified-catalog-01',sr='docs/validation/v4-knowledge-source-verification-01',sd='docs/validation/v4-knowledge-semantic-domain-verification-01';
 const{SourceReader}=load(p+'sourceReader.ts'),{intake}=load(p+'semantic-domain-review-workbench/sourceReaderAdapter.ts'),config=json(sd+'/verification-config.json'),reader=new SourceReader(root,async f=>load(f),[...json(cr+'/compiler-config.json').knownSourceVersions,config.baseSha]),original=intake(root,reader,b.frozen);
 const input={records:original.records,edges:json(cr+'/knowledge-edges.json').flatMap(r=>json(cr+'/'+r.shard)),sourceReceipts:original.receipts,domainQueue:json(sr+'/domain-review-queue.json'),sourceGroups:json(sr+'/source-group-review.json'),directReviews:original.prior,config,frozen:b.frozen};
 const{KnowledgeBinderCatalog}=load(p+'knowledge-binder/catalog.ts'),catalog=new KnowledgeBinderCatalog(reader,input,{records:input.records,sourceReceipts:input.sourceReceipts,decisions:original.domains,policyRules:config.rules,staticAncestry:original.ancestry,readFile:f=>fs.readFileSync(path.join(root,f),'utf8'),frozen:b.frozen},original.domains);await catalog.prepare();
 const{ProductSpecialistFoundation}=load(p+'product-specialist-foundation/binderIntegration.ts'),foundation=await ProductSpecialistFoundation.prepare(catalog),{GlobalSpecialistRegistry}=load(p+'global-specialist-integration/engineRegistry.ts'),{ACTUAL_INVOKERS}=load('tools/global-specialist-integration-audit/invokers.ts'),{readGlobalArtifact}=load(p+'global-specialist-integration/artifactReader.ts');
 const read=name=>readGlobalArtifact(path.join(root,'docs/validation/v4-global-specialist-integration-audit-01'),name+'.json');
 const entries=json('tools/global-specialist-integration-audit/registry-data.json').map(r=>({...r,invoke:ACTUAL_INVOKERS[r.engineId]})),registry=new GlobalSpecialistRegistry(entries);assert.equal(registry.byEngine.size,12);
 for(const r of entries){assert.equal(b.sha(fs.readFileSync(path.join(root,r.originalManifestLocator))),r.originalManifestHash);for(const f of r.policySources)assert.equal(b.sha(fs.readFileSync(path.join(root,f.file))),f.sha256);}
 const archivedQuestions=read('global-reader-question-index');assert.deepEqual(archivedQuestions.questions,JSON.parse(JSON.stringify(foundation.registry.questions)));
 return{b,p,load,json,catalog,foundation,registry,entries,read,files:read('global-case-files'),witnesses:read('global-evidence-witness-index')};
}
