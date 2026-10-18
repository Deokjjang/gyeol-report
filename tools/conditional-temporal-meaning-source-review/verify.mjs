import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),out=path.resolve(process.argv[2]||'');
if(process.argv.length!==4||out===root||out.startsWith(root+path.sep)||fs.existsSync(out))throw Error('NEW_EXTERNAL_OUTPUT_DIRECTORY_REQUIRED');
const {bootstrap}=await import('../publication-safety/bootstrap.mjs');
const {load}=bootstrap(root),base='src/lib/report-knowledge/knowledge-integration-foundation/';
const json=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const {SourceReader,hash}=load(base+'sourceReader.ts');
const {SourceVerificationEngine}=load(base+'source-verification/engine.ts');
const {TemporalTenGodSourceResolver}=load(base+'global-source-domain-resolution/temporalTenGodSource.ts');
const {verifyTemporalTenGodCalculation}=load(base+'global-source-domain-resolution/temporalTenGodEvidence.ts');
const {KnowledgeBinderCatalog}=load(base+'knowledge-binder/catalog.ts');
const {bindKnowledgeCandidate}=load(base+'knowledge-binder/engine.ts');
const {ActualBindingIndex}=load(base+'knowledge-binder/matching.ts');
const cr='docs/validation/v4-knowledge-unified-catalog-01',sr='docs/validation/v4-knowledge-source-verification-01',sd='docs/validation/v4-knowledge-semantic-domain-verification-01';
const records=[...new Set(json(cr+'/knowledge-catalog.json').map(r=>r.shard))].flatMap(f=>json(cr+'/'+f));
const edges=json(cr+'/knowledge-edges.json').flatMap(r=>json(cr+'/'+r.shard)),sourceReceipts=json(sr+'/source-verification-receipts.json');
const config=json(sd+'/verification-config.json'),cc=json(cr+'/compiler-config.json'),sv=json(sr+'/verification-config.json'),frozen=new Map(Object.entries(json('docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json')));
const materialFile=base+'global-source-domain-resolution/conditionalTemporalReviewMaterial.ts';
frozen.set(materialFile,hash(fs.readFileSync(path.join(root,materialFile))));
const {reviewTemporalMeaning,applyTemporalMeaningReview,temporalReviewDigest}=load(base+'global-source-domain-resolution/conditionalTemporalMeaningReview.ts');
const {EXTERNAL_TEMPORAL_SOURCES}=load(materialFile);
const reader=new SourceReader(root,async file=>load(path.relative(root,file)),[...cc.knownSourceVersions,config.baseSha,sv.baseSha]);
const native=new SourceVerificationEngine(reader,records,edges,sv,cc,frozen),resolver=new TemporalTenGodSourceResolver(reader,records,frozen,native,json(cr+'/unresolved-references.json'));
const decisions=json(sd+'/semantic-domain-decisions.json'),input={records,edges,sourceReceipts,domainQueue:json(sr+'/domain-review-queue.json'),sourceGroups:json(sr+'/source-group-review.json'),directReviews:json(sd+'/direct-meaning-reviews.json'),config,frozen};
const catalog=new KnowledgeBinderCatalog(reader,input,{records,sourceReceipts,decisions,policyRules:config.rules,staticAncestry:json(sd+'/ancestor-domain-audit.json'),readFile:f=>fs.readFileSync(path.join(root,f),'utf8'),frozen},decisions);
await catalog.prepare();fs.mkdirSync(out,{recursive:true});

const priorBytes=fs.readFileSync(path.resolve(process.argv[3]));
if(hash(priorBytes)!=='748e4cedc112315db3cb73cc9291864ffaa860ebca5fa3f791c581ef79e2d781')throw Error('ARCHIVED_CALCULATION_HASH_REQUIRED');
const prior=JSON.parse(priorBytes),verified=prior.filter(r=>r.result.actualCalculation==='ACTUAL_CALCULATION_VERIFIED');
if(prior.length!==767||verified.length!==749)throw Error('ARCHIVED_OBSERVATION_COUNTS');
const reviews=[];
for(const record of records.filter(r=>r.originalId.startsWith('tr:god:')&&r.locator.exportName==='TEMPORAL_GOD_ROLES'))for(const field of ['dayun','saeun','wolun']){
 const a=await reviewTemporalMeaning(resolver,record,field),b=await reviewTemporalMeaning(resolver,record,field);
 if(JSON.stringify(a)!==JSON.stringify(b))throw Error('NONDETERMINISTIC_REVIEW');reviews.push(a);
}
if(reviews.length!==30||new Set(reviews.map(r=>r.originalResearchId+'/'+r.originalMeaningField)).size!==30)throw Error('THIRTY_ORIGINAL_FIELDS');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts');
const {observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts');
const {buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const fixtureInputs=json('tests/fixtures/six-product-integration-01/source-locks.json'),calculations=[],links=[],comparison=[];
for(const [product,id] of [['major','A'],['major','F'],['major','C'],['annual','A'],['annual','F'],['annual','C2028']]){
 const f=fixtureInputs.find(f=>f.product===product&&f.id===id),generated=await generateV4ShadowReport(f.payload,f.clock);
 if(!generated.ok||generated.externalCalls.length)throw Error('ACTUAL_OFFLINE_FIXTURE_REQUIRED');
 const evidence=generated.evidencePacket,profiles=observeActualProfiles(evidence);
 const originalFixtureId=product==='major'&&id==='C'?'fixture-major-transition-C':product==='annual'&&id==='C2028'?'fixture-annual-transition-C2028':'fixture-'+product+'-'+id;
 const originalOwner=prior.find(x=>x.fixture===originalFixtureId)?.spec.owner;if(!originalOwner)throw Error('ARCHIVED_OWNER_REQUIRED');
 const graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:originalFixtureId,synthetic:true,evaluatedAt:evidence.generatedAt,owners:{person:originalOwner},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
 const built=buildActualEvidenceGraph(graphInput,catalog.evidence);if(!built.ok)throw Error('ACTUAL_GRAPH_REQUIRED');
 const request={graph:built.graph,graphInput,product:built.graph.product,relationship:null,contexts:[],actualUserState:{}};
 const before=temporalReviewDigest(request),start=calculations.length;
 const c=request.graphInput.evidence.composition,calc=request.graphInput.evidence.calculations.person;
 for(const n of request.graph.nodes){
  const v=n.value??{},ptr=n.fact.observationPointer,specs=[];
  const add=(origin,god,referenceStem,targetStem,cycleIndex)=>specs.push({nodeId:n.id,owner:n.owner.fixtureOwnerId,origin,god,referenceStem,targetStem,cycleIndex,window:n.temporal});
  if(n.producer.symbol==='collectStructureAtoms'&&v.location==='visible'){
   const own=request.graphInput.evidence.calculations[n.owner.slot];add('NATAL_STEM',v.god,own.dayMaster,v.stem);
  }
  if(c.product==='major_fortune'){
   if(n.producer.symbol==='calculateCustomerDayun'&&v.tenGod)add('DAYUN_STEM',v.tenGod,calc.dayMaster,v.ganji[0],v.cycleIndex);
   if(n.kind==='EDITORIAL_PROOF_OBSERVATION'&&v.tenGod&&/annual\/evidenceIds\/1$/.test(ptr)){const y=c.result.evidence.years.find(y=>y.year===v.year);add('ANNUAL_STEM',v.tenGod,calc.dayMaster,y.annual.ganji[0]);}
  }
  if(c.product==='annual_fortune'&&n.kind==='CALCULATED_PERIOD_FACT'){
   const e=c.result.evidence,m=/calendarMonths\/(\d+)\/segments\/(\d+)\/evidenceIds\/(\d+)$/.exec(ptr),s=m&&e.raw.calendarMonths[+m[1]].segments[+m[2]];
   if(s){const cross=e.crossPeriods.find(x=>Date.parse(x.startKst)<=Date.parse(s.startKst)&&Date.parse(x.endKstExclusive)>=Date.parse(s.endKstExclusive)&&JSON.stringify(x.segment.effectiveAnnualPillar)===JSON.stringify(s.effectiveAnnualPillar)&&JSON.stringify(x.segment.activeDayunContext)===JSON.stringify(s.activeDayunContext));
    if(+m[3]===3){add('MONTH_STEM',s.stemTenGod,calc.dayMaster,s.monthPillar.stem);const {HIDDEN_STEMS}=load('src/lib/saju/constants.ts');add('MONTH_BRANCH_MAIN',s.branchTenGod,calc.dayMaster,HIDDEN_STEMS[s.monthPillar.branch][0].stem);}
    if(cross&&+m[3]===1)add('ANNUAL_STEM',cross.annualGod,calc.dayMaster,s.effectiveAnnualPillar.stem);
    if(cross&&+m[3]===2)for(const x of cross.cycles){add('DAYUN_STEM',x.god,calc.dayMaster,x.cycle.stem,x.cycle.index);add('FLOW_GOD',x.flowGod,x.cycle.stem,s.effectiveAnnualPillar.stem,x.cycle.index);}
   }
  }
  for(const spec of specs){const result=verifyTemporalTenGodCalculation(resolver,request,spec);if(!result.graphAndPacketUnchanged)throw Error('ORIGINAL_ACTUAL_DATA_MUTATED');calculations.push({fixture:request.graph.context.fixtureId,spec,result});}
 }

 for(const entry of calculations.slice(start)){
  const field={DAYUN_STEM:'dayun',ANNUAL_STEM:'saeun',MONTH_STEM:'wolun',MONTH_BRANCH_MAIN:'wolun'}[entry.spec.origin];if(!field)continue;
  const review=reviews.find(r=>r.originalResearchId==='tr:god:'+entry.spec.god&&r.originalMeaningField===field);if(!review)continue;
  const record=records.find(r=>r.originalId===review.originalResearchId&&r.locator.exportName==='TEMPORAL_GOD_ROLES');
  const result=await applyTemporalMeaningReview(resolver,record,field,request,entry.spec,{packetHash:review.packetHash,requestedScope:review.temporalScope});
  links.push({fixture:graphInput.context.fixtureId,...result});
 }
 if(c.product==='major_fortune'){
  const index=new ActualBindingIndex(request,catalog);
  for(const candidate of catalog.candidates.values())if(candidate.record.locator.file.endsWith('major-fortune-product-research/tenGodResearch.ts')){
   const beforeReceipt=bindKnowledgeCandidate(candidate,index,catalog);
   const related=reviews.filter(r=>r.majorSourceProof.originalId===candidate.record.originalId);
   if(related.length!==3)throw Error('EXACT_MAJOR_REVIEW_LINK_REQUIRED');
   const afterReceipt=bindKnowledgeCandidate(candidate,index,catalog);
   if(JSON.stringify(beforeReceipt)!==JSON.stringify(afterReceipt))throw Error('BINDER_GATE_MUTATION');
   comparison.push({fixture:graphInput.context.fixtureId,originalId:candidate.record.originalId,beforeGate:beforeReceipt.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY'),afterGate:afterReceipt.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY'),allTwelveGates:afterReceipt.allTwelveGateResults,allTwelveGatesUnchanged:true,reviewPacketHashes:related.map(r=>r.packetHash),newReadProofsLinked:related.every(r=>r.externalSources.every(s=>s.proof.actualHash===s.proof.expectedHash)),exactModernMeaningStillUnverified:true,customerApproved:false});
  }
 }
 if(before!==temporalReviewDigest(request))throw Error('ORIGINAL_GRAPH_OR_PACKET_CHANGED');
 process.stderr.write('reviewed actual fixture '+product+'/'+id+'\n');
}
const originalFailure=json('docs/validation/v4-global-source-domain-resolution-01/major-source-integrity-failures.json');
if(comparison.length!==30||comparison.some(r=>r.beforeGate.state!=='FAIL'||r.afterGate.state!=='FAIL'))throw Error('ORIGINAL_SOURCE_FAILURE_COHORT_CHANGED');
const summary={status:'PARTIAL',originalMeaningFields:30,commonMeanings:10,independentPeriodSpecificTraditionalMeanings:0,exactDefinitionProofs:10,externalSourcesReviewed:EXTERNAL_TEMPORAL_SOURCES.length,conditionalProposals:30,conceptualProposalsRequiringReview:24,weakMeaningBridges:6,exactConditionalMeaningSourcesUnverified:30,sourceIntegrityBefore:30,sourceIntegrityAfter:30,actualFixtures:6,newCalculationObservations:calculations.length,newVerifiedCalculations:calculations.filter(r=>r.result.actualCalculation==='ACTUAL_CALCULATION_VERIFIED').length,scopedLinks:links.filter(r=>r.technicalLinkage==='SCOPED_CALCULATION_LINK_VERIFIED').length,reusedCalculationObservations:749,customerApproval:0,customerClaims:0,customerReaderBridge:0,newIndependentFacts:0};
const archive={file:path.resolve(process.argv[3]),sha256:hash(priorBytes),observations:767,verifiedObservationsReused:749,unknownObservationsHeld:18,unmodified:true};
const coverage=reviews.map(r=>({originalResearchId:r.originalResearchId,field:r.originalMeaningField,packetHash:r.packetHash,scope:r.temporalScope,archiveMatches:verified.filter(x=>x.spec.god===r.originalResearchId.slice(7)&&({dayun:['DAYUN_STEM'],saeun:['ANNUAL_STEM'],wolun:['MONTH_STEM','MONTH_BRANCH_MAIN']}[r.originalMeaningField]).includes(x.spec.origin)).map(x=>({fixture:x.fixture,nodeId:x.spec.nodeId,owner:x.result.owner,origin:x.result.origin,referenceStem:x.result.referenceStem,targetStem:x.result.targetStem,producer:x.result.producer,effectiveInterval:x.result.effectiveInterval,temporalScopeValid:x.result.temporalScopeValid})),archiveIsNotCustomerApproval:true}));
const payloads={'temporal-meaning-source-review.json':{summary,externalSources:EXTERNAL_TEMPORAL_SOURCES,reviews},'temporal-meaning-applicability.json':{archive,coverage,actualLinks:links,summary},'source-integrity-comparison.json':{meaningDenominator:30,binderDenominator:30,originalFailureDigest:temporalReviewDigest(originalFailure),beforeFail:30,afterFail:30,rows:comparison},'summary.json':summary};
for(const[name,value]of Object.entries(payloads))fs.writeFileSync(path.join(out,name),JSON.stringify(value,null,2)+'\n');
process.stdout.write(JSON.stringify(summary)+'\n');
