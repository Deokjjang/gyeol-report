import fs from 'node:fs';
import path from 'node:path';
let syntheticMeaningFileReads=0;
const originalReadFileSync=fs.readFileSync;
fs.readFileSync=(file,...args)=>{if(String(file).includes('korean-editorial-engine-01/synthetic-meaning-definitions.json')){syntheticMeaningFileReads++;throw Error('SYNTHETIC_MEANING_DEPENDENCY_FORBIDDEN');}return originalReadFileSync(file,...args);};
const root=process.cwd(),out=path.resolve(process.argv[2]||'');
if(process.argv.length!==3||out===root||out.startsWith(root+path.sep)||fs.existsSync(out))throw Error('NEW_EXTERNAL_OUTPUT_DIRECTORY_REQUIRED');
const {bootstrap}=await import('../publication-safety/bootstrap.mjs');
const {load}=bootstrap(root),base='src/lib/report-knowledge/knowledge-integration-foundation/';
const json=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const {SourceReader,hash}=load(base+'sourceReader.ts');
const {SourceVerificationEngine}=load(base+'source-verification/engine.ts');
const {TemporalTenGodSourceResolver}=load(base+'global-source-domain-resolution/temporalTenGodSource.ts');
const {KnowledgeBinderCatalog}=load(base+'knowledge-binder/catalog.ts');
const cr='docs/validation/v4-knowledge-unified-catalog-01',sr='docs/validation/v4-knowledge-source-verification-01',sd='docs/validation/v4-knowledge-semantic-domain-verification-01';
const records=[...new Set(json(cr+'/knowledge-catalog.json').map(r=>r.shard))].flatMap(f=>json(cr+'/'+f));
const edges=json(cr+'/knowledge-edges.json').flatMap(r=>json(cr+'/'+r.shard)),sourceReceipts=json(sr+'/source-verification-receipts.json');
const config=json(sd+'/verification-config.json'),cc=json(cr+'/compiler-config.json'),sv=json(sr+'/verification-config.json'),frozen=new Map(Object.entries(json('docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json')));
const materialFile=base+'global-source-domain-resolution/conditionalTemporalReviewMaterial.ts';
frozen.set(materialFile,hash(fs.readFileSync(path.join(root,materialFile))));


const reader=new SourceReader(root,async file=>load(path.relative(root,file)),[...cc.knownSourceVersions,config.baseSha,sv.baseSha]);
const native=new SourceVerificationEngine(reader,records,edges,sv,cc,frozen),resolver=new TemporalTenGodSourceResolver(reader,records,frozen,native,json(cr+'/unresolved-references.json'));
const decisions=json(sd+'/semantic-domain-decisions.json'),input={records,edges,sourceReceipts,domainQueue:json(sr+'/domain-review-queue.json'),sourceGroups:json(sr+'/source-group-review.json'),directReviews:json(sd+'/direct-meaning-reviews.json'),config,frozen};
const catalog=new KnowledgeBinderCatalog(reader,input,{records,sourceReceipts,decisions,policyRules:config.rules,staticAncestry:json(sd+'/ancestor-domain-audit.json'),readFile:f=>fs.readFileSync(path.join(root,f),'utf8'),frozen},decisions);
await catalog.prepare();fs.mkdirSync(out,{recursive:true});


const {ProductSpecialistFoundation}=load(base+'product-specialist-foundation/binderIntegration.ts');
const {runActualCalculationFixture,adaptActualCalculationRequest}=load(base+'full-product-integration/actualCalculationAdapter.ts');
const {actualSemanticDigest}=load(base+'actual-calculation-semantic-bridge/units.ts');

const foundation=await ProductSpecialistFoundation.prepare(catalog),cases=[],observations=[],historical=[],forbidden=new Set();

const {adaptAnnualNovemberContext}=load(base+'annual-november-context/adapter.ts');
const {evaluateNovember,validateNovemberObservation,validateNovemberWitness,NOVEMBER_CONTRACT}=load(base+'annual-november-context/contract.ts');
const {AnnualSpecialistIndex}=load(base+'annual-fortune-specialist-engine/candidateIndex.ts');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const prior=json('docs/validation/v4-annual-june-same-ten-god-scope-01/june-native-binding-coverage.json');
const row=new AnnualSpecialistIndex(foundation).byOriginalId.get(NOVEMBER_CONTRACT.originalId),proof=await resolver.proof(row.candidate.record.locator,row.originalResearchId,row.catalogKey);
const source={month:11,id:row.originalResearchId,proof,originalRequirements:row.original.requires,originalRecord:row.original,meaningIdentity:row.candidate.requirement.meaningIdentity,claimIdentity:row.candidate.requirement.claimIdentity};
async function consume(id,facts){
 if(!facts.ok)throw Error('ACTUAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const r=await adaptAnnualNovemberContext(facts.request,facts,{resolver,foundation});if(!r.ok)throw Error('NOVEMBER_ADAPTER_FAILED:'+id+':'+r.reasons.join('|'));
 const originalNative=r.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline,previous=prior.nativeDiagnosticComparison.find(c=>c.fixture===id);
 const graphHash=actualSemanticDigest(facts.request.graph),calculationHash=actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash=actualSemanticDigest(facts.handoff);
 if(!previous||graphHash!==previous.graphHash||calculationHash!==previous.calculationHash||factHandoffHash!==previous.factHandoffHash||originalNative.context.nativeDiagnosticHash!==previous.nativeDiagnosticHash||originalNative.originalReceiptsVerified!==previous.originalReceipts)throw Error('BASE_CALCULATION_OR_ORIGINAL_RECEIPTS_CHANGED:'+id);
 const originals=[...r.handoff.historicalMajorCandidates,...r.handoff.historicalAnnualCandidates],allowed=prior.historical44CandidateHashes.filter(p=>p.fixture===id);
 const hashes=originals.map(c=>({fixture:id,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c)}));
 if(actualSemanticDigest(hashes.map(v=>[v.candidateId,v.candidateHash]).sort())!==actualSemanticDigest(allowed.map(v=>[v.candidateId,v.candidateHash]).sort()))throw Error('HISTORICAL_CANDIDATE_MULTISET_CHANGED:'+id);historical.push(...hashes);
 const oldReceipts=originalNative.native.receipts.map(receipt=>({receiptId:receipt.receiptId,fullReceiptHash:actualSemanticDigest(receipt)}));
 if(actualSemanticDigest(oldReceipts)!==actualSemanticDigest(previous.originalReceiptHashes))throw Error('ORIGINAL_FULL_RECEIPT_MULTISET_CHANGED:'+id);
 const june=prior.segmentCoverage.find(c=>c.fixture===id);if(r.baseline.observation&&(!june||june.observationHash!==actualSemanticDigest(r.baseline.observation)))throw Error('JUNE_OBSERVATION_CHANGED:'+id);
 if(r.observation){
  const o=r.observation,recreated=await evaluateNovember(r.context);
  if(!recreated.ok||recreated.monthReady||recreated.candidate!==null||actualSemanticDigest(recreated.observation)!==actualSemanticDigest(o)||!(await validateNovemberObservation(r.context,structuredClone(o))).ok)throw Error('NOVEMBER_NONDETERMINISTIC_OR_PROMOTED');
  if(o.contextTimestampProvenance.contextObservationTimestamp!==null||o.contextTimestampProvenance.contextTimestampSource!==null||o.contextTimestampProvenance.contextProvenanceVerified||o.contextTimestampProvenance.contextProvenanceState!=='CONTEXT_TIMESTAMP_MISSING'||r.handoff.novemberCandidates.length||o.customerUseAllowed||o.plannerUseAllowed||o.customerClaims||o.customerApprovals||o.newFactRoots||o.independentMeaningsAdded||o.independentFactsAdded||o.verifiedActualUnitIds.length||o.originalMeaningIdentity!==null||o.originalClaimIdentity!==null)throw Error('CONTEXT_OR_CANDIDATE_PROMOTION');
  for(const w of o.witnesses){
   if(!(await validateNovemberWitness(r.context,structuredClone(w))).ok||w.customerUseAllowed||w.newFactRoots||w.contextObservationTimestamp!==null||w.futureStateGuaranteed||w.sceneIsCustomerHistory||!w.sceneHypothetical)throw Error('SOURCE_WITNESS_PROMOTED');
   for(const n of [...w.originalGraphEvidence,...w.completeAncestry,...w.otherOriginalGraphEvidence,...w.otherEvidenceCompleteAncestry])if(!facts.request.graph.nodes.some(old=>actualSemanticDigest(old)===actualSemanticDigest(n)))throw Error('ORIGINAL_GRAPH_CHANGED');
  }
  for(const b of o.typedBindings){
   const receipt=b.typedNativeReceipt;if(receipt.allTwelveGateResults.length!==12||receipt.customerApproved||receipt.operatorApproved||receipt.temporalWitnesses.some(w=>w.start!==b.effectiveInterval.start||w.endExclusive!==b.effectiveInterval.endExclusive))throw Error('NATIVE_GATE_OR_PERIOD_PROMOTION');
   for(const key of ['unresolvedConditions','sourceGroups','requiredContext','products','relationships','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'])if(actualSemanticDigest(o.originalCandidate.requirement[key])!==actualSemanticDigest(b.typedCandidate.requirement[key]))throw Error('ORIGINAL_CONDITION_CHANGED');
  }
  observations.push({fixture:id,observationHash:actualSemanticDigest(o),...o,withheld:r.withheld,determinism:true});
 }
 if(before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('INPUT_MUTATED');
 const linked=new Set(originals.flatMap(c=>c.verifiedActualUnitIds??[])),actualInput=facts.request.graphInput.evidence.input;
 if(actualInput.kind!=='compatibility')for(const key of ['name','birthDate'])forbidden.add(actualInput.person[key]);
 cases.push({fixture:id,product:facts.request.product,verifiedUnits:facts.handoff.units.length,withheldAttempts:facts.withheld.length,originalReceipts:originalNative.originalReceiptsVerified,originalSourceFail:originalNative.native.receipts.filter(v=>v.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,
  originalReceiptHashes:oldReceipts,graphHash,calculationHash,factHandoffHash,nativeDiagnosticHash:originalNative.context.nativeDiagnosticHash,allBaseDigestsEqual:true,historicalCandidateHashesEqual:true,juneObservationHash:r.baseline.observation?actualSemanticDigest(r.baseline.observation):null,juneObservationPreserved:true,originalRoots:facts.handoff.canonicalFactRoots,rootReferenceOccurrences:facts.handoff.rootReferenceOccurrences,
  majorCandidates:r.handoff.historicalMajorCandidates.length,historicalAnnualCandidates:r.handoff.historicalAnnualCandidates.length,newNovemberCandidates:r.handoff.novemberCandidates.length,unmatchedBefore:facts.handoff.units.length-linked.size,unmatchedAfter:facts.handoff.units.length-linked.size,segments:r.observation?.witnesses.length??0,typedBindings:r.observation?.typedBindings.length??0});
 process.stderr.write(id+' november-candidates=0 segments='+(r.observation?.witnesses.length??0)+' bindings='+(r.observation?.typedBindings.length??0)+' context='+r.observation?.contextTimestampProvenance.contextProvenanceState+'\n');
}
for(const [product,id]of [['major','A'],['major','F'],['major','C'],['annual','A'],['annual','F'],['annual','C2028']])await consume('fixture-'+product+'-'+id,await runActualCalculationFixture(root,{product,id},{resolver,foundation}));
const ranged=structuredClone(json('tests/fixtures/six-product-integration-01/source-locks.json').find(f=>f.product==='annual'&&f.id==='A'));
Object.assign(ranged.payload.person,{birthDate:'1999-07-31',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',gender:'MALE'});ranged.payload.productOptions.selectedYear='2027';ranged.clock.policyDate='2027-10-12T12:00:00+09:00';
const generated=await generateV4ShadowReport(ranged.payload,ranged.clock);if(!generated.ok||generated.externalCalls.length)throw Error('EXISTING_RANGE_FIXTURE_FAILED');
const evidence=generated.evidencePacket,profiles=observeActualProfiles(evidence),graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:'fixture-annual-ranged-transition',synthetic:true,evaluatedAt:evidence.generatedAt,owners:{person:'fixture-person-annual-ranged-transition'},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
const graph=buildActualEvidenceGraph(graphInput,catalog.evidence);if(!graph.ok)throw Error('EXISTING_RANGE_GRAPH_FAILED');
const request={graph:graph.graph,graphInput,product:graph.graph.product,relationship:null,contexts:[],actualUserState:evidence.input.userContext};
await consume(graphInput.context.fixtureId,{...await adaptActualCalculationRequest(request,{resolver,foundation}),request});
const total=key=>cases.reduce((n,c)=>n+c[key],0),witnesses=observations.flatMap(o=>o.witnesses);
const summary={fixtures:cases.length,annualFixtures:observations.length,verifiedUnits:total('verifiedUnits'),withheldAttempts:total('withheldAttempts'),originalReceipts:total('originalReceipts'),originalSourceFail:total('originalSourceFail'),majorCandidates:total('majorCandidates'),annualCandidatesBefore:total('historicalAnnualCandidates'),annualCandidatesAfter:total('historicalAnnualCandidates'),novemberCandidates:0,actualNovemberSegments:total('segments'),novemberTypedBindings:total('typedBindings'),novemberWithheldFixtures:observations.length,
 contextTimestampsFound:0,contextTimestampsMissing:observations.filter(o=>o.contextTimestampProvenance.contextProvenanceState==='CONTEXT_TIMESTAMP_MISSING').length,periodFactsVerified:witnesses.filter(w=>w.periodFactsState==='PERIOD_FACTS_VERIFIED').length,sourceScenesVerified:witnesses.filter(w=>w.actualConditionalSceneState==='CONDITIONAL_SCENE_SOURCE_VERIFIED').length,customerHistoryInferred:0,periodPositions:witnesses.map(w=>({fixture:w.fixtureId,pointer:w.novemberSegmentPointer,position:w.periodTimePosition})),
 verifiedMonthsBefore:[1,2,3,4,5,7,8,9,10,12],verifiedMonthsAfter:[1,2,3,4,5,7,8,9,10,12],juneRoleSourceResolution:'ROLE_SOURCE_DECISION_REQUIRED',juneObservationsPreserved:cases.every(c=>c.juneObservationPreserved),unmatchedBefore:total('unmatchedBefore'),unmatchedAfter:total('unmatchedAfter'),originalRoots:new Set(cases.flatMap(c=>c.originalRoots)).size,rootReferenceOccurrences:total('rootReferenceOccurrences'),newFactRoots:0,newUnitLinks:0,independentFactsAdded:0,independentMeaningsAdded:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.withheldAttempts!==164||summary.originalReceipts!==703||summary.originalSourceFail!==30||summary.majorCandidates!==2||summary.annualCandidatesBefore!==42||historical.length!==44||summary.unmatchedBefore!==396||summary.unmatchedAfter!==396||summary.originalRoots!==246||summary.contextTimestampsMissing!==4)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'fixtures.json':cases,'source-proof.json':source,'november-observations.json':observations,'historical-candidate-hashes.json':historical})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
