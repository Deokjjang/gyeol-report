// Offline composition root: reuse the existing catalog, source verifier,
// 27 real graph fixtures and unchanged Binder. No network or customer bridge.
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),out=path.resolve(process.argv[2]||'');
if(process.argv.length!==3||out===root||out.startsWith(root+path.sep)||fs.existsSync(out))throw Error('NEW_EXTERNAL_OUTPUT_DIRECTORY_REQUIRED');
const {bootstrap}=await import('../publication-safety/bootstrap.mjs');
const {load}=bootstrap(root),base='src/lib/report-knowledge/knowledge-integration-foundation/';
const json=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const {SourceReader,hash}=load(base+'sourceReader.ts');
const {SourceVerificationEngine}=load(base+'source-verification/engine.ts');
const {TemporalTenGodSourceResolver}=load(base+'global-source-domain-resolution/temporalTenGodSource.ts');
const {verifyTemporalTenGodCalculation,bindTemporalTenGodSource}=load(base+'global-source-domain-resolution/temporalTenGodEvidence.ts');
const {KnowledgeBinderCatalog}=load(base+'knowledge-binder/catalog.ts');
const {bindKnowledgeCandidate}=load(base+'knowledge-binder/engine.ts');
const {ActualBindingIndex}=load(base+'knowledge-binder/matching.ts');
const cr='docs/validation/v4-knowledge-unified-catalog-01',sr='docs/validation/v4-knowledge-source-verification-01',sd='docs/validation/v4-knowledge-semantic-domain-verification-01';
const records=[...new Set(json(cr+'/knowledge-catalog.json').map(r=>r.shard))].flatMap(f=>json(cr+'/'+f));
const edges=json(cr+'/knowledge-edges.json').flatMap(r=>json(cr+'/'+r.shard)),sourceReceipts=json(sr+'/source-verification-receipts.json');
const config=json(sd+'/verification-config.json'),cc=json(cr+'/compiler-config.json'),sv=json(sr+'/verification-config.json'),frozen=new Map(Object.entries(json('docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json')));
const reader=new SourceReader(root,async file=>load(path.relative(root,file)),[...cc.knownSourceVersions,config.baseSha,sv.baseSha]);
const native=new SourceVerificationEngine(reader,records,edges,sv,cc,frozen),resolver=new TemporalTenGodSourceResolver(reader,records,frozen,native,json(cr+'/unresolved-references.json'));
const decisions=json(sd+'/semantic-domain-decisions.json'),input={records,edges,sourceReceipts,domainQueue:json(sr+'/domain-review-queue.json'),sourceGroups:json(sr+'/source-group-review.json'),directReviews:json(sd+'/direct-meaning-reviews.json'),config,frozen};
const catalog=new KnowledgeBinderCatalog(reader,input,{records,sourceReceipts,decisions,policyRules:config.rules,staticAncestry:json(sd+'/ancestor-domain-audit.json'),readFile:f=>fs.readFileSync(path.join(root,f),'utf8'),frozen},decisions);
await catalog.prepare();fs.mkdirSync(out,{recursive:true});
const source=await Promise.all(sourceReceipts.filter(r=>r.originalLocator.file.endsWith('temporal-interaction-research/temporalGodRoles.ts')&&r.referenceField==='/traditionalRef/0').map(r=>resolver.resolve(r)));
if(source.length!==10||source.some(r=>!r.temporalTenGod?.sourceResolved||r.newTechnicalAssessment==='PROVEN_TECHNICAL_RESOLUTION'))throw Error('DEFINITION_ONLY_SOURCE_CONTRACT_REQUIRED:'+JSON.stringify(source.map(r=>r.temporalTenGod?.blockingReasons)));
// The historical graph CLI has pre-publication frozen source hashes. Keep
// that CLI unchanged; reuse its exact 27 input recipes with current producers.
const graphApi=load(base+'actual-evidence-graph/engine.ts'),cases=[];
const {calculateCustomerDayun}=load('src/lib/saju/customerDayun.ts');
const fixtureInputs=json('tests/fixtures/six-product-integration-01/source-locks.json');
 const selected=fixtureInputs.filter(c=>c.id==='A'||c.product==='compatibility'&&['marriage','parentChild','coworker','managerReport','businessPartner','friendship'].includes(c.id)||c.id==='F'&&c.product!=='compatibility').map(c=>({...c,id:c.product+'-'+c.id}));
 const clone=(product,id,label)=>{const c=structuredClone(fixtureInputs.find(c=>c.product===product&&c.id===id));c.id=label;return c;};
 selected.push(clone('major','C','major-transition-C'),clone('annual','C2028','annual-transition-C2028'),clone('compatibility','F','compatibility-unknown-both'));
 const swapped=clone('compatibility','A','compatibility-slot-swap');[swapped.payload.personA,swapped.payload.personB]=[swapped.payload.personB,swapped.payload.personA];selected.push(swapped);
 const same=clone('comprehensive','A','same-natal-different-mbti');same.payload.person.mbtiType='INTJ';selected.push(same);
 const other=clone('comprehensive','B','same-mbti-different-natal');other.payload.person.mbtiType='ENFJ';selected.push(other);
 const career=clone('comprehensive','A','same-natal-career');career.payload.productKey='career_money_study';career.payload.productSlug='career-money-study';selected.push(career);
 const ranged=clone('annual','A','annual-ranged-transition');Object.assign(ranged.payload.person,{birthDate:'1999-07-31',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',gender:'MALE'});ranged.payload.productOptions.selectedYear='2027';ranged.clock.policyDate='2027-10-12T12:00:00+09:00';selected.push(ranged);
 const early=clone('annual','A','annual-before-first-dayun');Object.assign(early.payload.person,{birthDate:'1999-07-31',birthTime:'07:30',birthTimeUnknown:false,birthTimePrecision:'exact',gender:'MALE'});const dayun=calculateCustomerDayun(early.payload.person);if(!dayun.ok)throw Error('BEFORE_FIRST_FIXTURE_PRODUCER_FAILED');const firstYear=dayun.value.cycles[0].startYear;early.payload.productOptions.selectedYear=String(firstYear);early.clock.policyDate=firstYear+'-10-12T12:00:00+09:00';selected.push(early);
 const noPair=clone('compatibility','A','compatibility-no-detected-pair');for(const [slot,i]of[['personA',0],['personB',1]])Object.assign(noPair.payload[slot],{name:'가상무관계'+(i?'B':'A'),birthDate:i?'1999-03-28':'1999-03-16',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',mbtiType:'',approximateBirthTimeSlot:''});selected.push(noPair);
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts');
const {observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts');
const identities=new Map();
for(const f of selected){
 const generated=await generateV4ShadowReport(f.payload,f.clock);if(!generated.ok||generated.externalCalls.length)throw Error('ACTUAL_OFFLINE_GENERATION_REQUIRED');
 const evidence=generated.evidencePacket,owners={};
 for(const slot of evidence.input.kind==='compatibility'?['personA','personB']:['person']){
  const person=evidence.input.kind==='compatibility'?evidence.input[slot]:evidence.input.person;
  const identity=JSON.stringify([person.name,person.birthDate,person.birthTime,person.gender,person.birthTimePrecision]);
  if(!identities.has(identity))identities.set(identity,'fixture-person-'+(identities.size+1));owners[slot]=identities.get(identity);
 }
 const profiles=observeActualProfiles(evidence);if(profiles.failures.length)throw Error('ORIGINAL_PROFILE_REQUIRED');
 const graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:'fixture-'+f.id,synthetic:true,evaluatedAt:evidence.generatedAt,owners,catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
 const result=graphApi.buildActualEvidenceGraph(graphInput,catalog.evidence);if(!result.ok||!result.inputUnchanged)throw Error('ORIGINAL_ACTUAL_GRAPH_REQUIRED');
 cases.push({graph:result.graph,graphInput,product:result.graph.product,relationship:result.graph.relationship,contexts:[],actualUserState:evidence.input.kind==='compatibility'?{}:evidence.input.userContext});
 process.stderr.write('observed '+f.id+' nodes='+result.graph.nodes.length+'\n');
}
const totals=cases.reduce((a,c)=>({nodes:a.nodes+c.graph.nodes.length,edges:a.edges+c.graph.edges.length}),{nodes:0,edges:0});
if(cases.length!==27||totals.nodes!==109333||totals.edges!==351274)throw Error('ORIGINAL_GRAPH_COHORT_COUNTS_CHANGED:'+JSON.stringify(totals));
fs.writeFileSync(path.join(out,'graph27-summary.json'),JSON.stringify({cases:cases.map(c=>({fixtureId:c.graph.context.fixtureId,graphHash:hash(JSON.stringify(c.graph)),nodes:c.graph.nodes.length,edges:c.graph.edges.length})),totals},null,2)+'\n');
const calculations=[],comparison=[],forbidden=new Set();
for(const request of cases){
 const input=request.graphInput.evidence.input;
 for(const p of input.kind==='compatibility'?[input.personA,input.personB]:[input.person]){forbidden.add(p.name);forbidden.add(p.birthDate);}
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
 if(c.product==='major_fortune'){
  const index=new ActualBindingIndex(request,catalog);
  for(const candidate of catalog.candidates.values())if(candidate.record.locator.file.endsWith('major-fortune-product-research/tenGodResearch.ts')){
   const originalReceipt=bindKnowledgeCandidate(candidate,index,catalog),entry=calculations.find(x=>x.fixture===request.graph.context.fixtureId&&x.spec.origin==='DAYUN_STEM');
   if(!entry)throw Error('ACTUAL_MAJOR_CYCLE_REQUIRED');
   const after=await bindTemporalTenGodSource(resolver,candidate,request,catalog,entry.spec);
   if(JSON.stringify(originalReceipt)!==JSON.stringify(after.originalBindingReceipt)||after.customerApproved||after.customerClaims)throw Error('NATIVE_GATES_CHANGED');
   comparison.push({fixture:request.graph.context.fixtureId,originalId:candidate.record.originalId,beforeGate:originalReceipt.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY'),afterGate:after.originalBindingReceipt.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY'),allTwelveGatesUnchanged:true,inheritedSourceProof:after.inheritedSourceProof,sourceResolved:after.source?.sourceResolved??false,sourceUnresolved:true,producerSupported:after.calculation.producerSupported,temporalScopeValid:after.calculation.temporalScopeValid,meaningReviewRequired:true,customerApproved:false});
  }
 }
}
if(comparison.length!==30||comparison.some(x=>x.beforeGate.state!=='FAIL'||x.afterGate.state!=='FAIL'))throw Error('ORIGINAL_THIRTY_SOURCE_FAILURE_COHORT_REQUIRED');
const counts={graphFixtures:27,sourceRecords:source.length,definitionSourcesResolved:source.filter(x=>x.temporalTenGod.sourceResolved).length,conditionalSourcesUnresolved:10,majorBeforeFail:30,majorAfterFail:30,calculationObservations:calculations.length,verifiedCalculations:calculations.filter(x=>x.result.actualCalculation==='ACTUAL_CALCULATION_VERIFIED').length,temporalScopesValid:calculations.filter(x=>x.result.temporalScopeValid).length,customerApprovals:0,customerClaims:0,customerReaderBridges:0};
for(const[name,value]of Object.entries({'temporal-source-contract.json':source,'source-integrity-comparison.json':comparison,'calculation-observations.json':calculations,'summary.json':counts})){
 const text=JSON.stringify(value,null,2)+'\n';for(const s of forbidden)if(s&&text.includes(s))throw Error('PRIVACY_LEAK');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(counts)+'\n');
