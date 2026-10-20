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

const foundation=await ProductSpecialistFoundation.prepare(catalog),cases=[],observations=[],links=[],historical=[],forbidden=new Set();
const {adaptAnnualTemporalComparisons}=load(base+'annual-temporal-comparison/adapter.ts');
const {validateComparisonCandidate,evaluateComparisonMonth}=load(base+'annual-temporal-comparison/contract.ts');
const {AnnualSpecialistIndex}=load(base+'annual-fortune-specialist-engine/candidateIndex.ts');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const prior=json('docs/validation/v4-native-requirement-binding-resolution-01/before-after-native-links.json');
const priorMay=json('docs/validation/v4-native-requirement-binding-resolution-01/annual-typed-requirement-validation.json');
const priorMatrix=json('docs/validation/v4-annual-month-matrix-contract-completion-01/actual-month-evidence-links.json');
const priorOctober=json('docs/validation/v4-annual-october-focus-contract-01/technical-candidate-coverage.json');
const rows=[...new AnnualSpecialistIndex(foundation).candidates.values()].filter(r=>r.researchKind==='MONTH_QUESTION'&&[3,9].includes(r.original.month)),sources=[];
for(const row of rows){const proof=await resolver.proof(row.candidate.record.locator,row.originalResearchId,row.catalogKey);sources.push({month:row.original.month,id:row.originalResearchId,proof,originalRequirements:row.original.requires,originalRecord:row.original,meaningIdentity:row.candidate.requirement.meaningIdentity,claimIdentity:row.candidate.requirement.claimIdentity});}
async function consume(id,facts){
 if(!facts.ok)throw Error('ACTUAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const r=await adaptAnnualTemporalComparisons(facts.request,facts,{resolver,foundation});if(!r.ok)throw Error('COMPARISON_ADAPTER_FAILED:'+id+':'+r.reasons.join('|'));
 const native=r.baseline.baseline.baseline.baseline,previous=prior.fixtures.find(c=>c.fixture===id);
 const graphHash=actualSemanticDigest(facts.request.graph),calculationHash=actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash=actualSemanticDigest(facts.handoff);
 if(!previous||graphHash!==previous.graphHash||calculationHash!==previous.calculationHash||factHandoffHash!==previous.factHandoffHash||native.context.nativeDiagnosticHash!==previous.nativeDiagnosticHash||native.originalReceiptsVerified!==previous.originalReceipts)throw Error('BASE_CALCULATION_OR_ORIGINAL_RECEIPTS_CHANGED:'+id);
 const originals=[...r.handoff.historicalMajorCandidates,...r.handoff.historicalAnnualCandidates];
 const allowed=[...previous.historicalCandidates,...priorMay.candidates,...priorMatrix.links,...priorOctober.octoberBindings];
 for(const c of originals){const candidateHash=actualSemanticDigest(c);if(!allowed.some(p=>p.candidateId===c.candidateId&&p.candidateHash===candidateHash))throw Error('HISTORICAL_CANDIDATE_CHANGED:'+c.candidateId);historical.push({fixture:id,candidateId:c.candidateId,candidateHash});}
 for(const c of r.handoff.comparisonCandidates){
  if(!(await validateComparisonCandidate(r.context,structuredClone(c))).ok)throw Error('COMPARISON_REVALIDATION_FAILED');
  const recreated=await evaluateComparisonMonth(r.context,c.month,c.originalCatalogKey);if(!recreated.ok||actualSemanticDigest(recreated.candidate)!==actualSemanticDigest(c))throw Error('NONDETERMINISTIC_COMPARISON');
  if(c.customerUseAllowed||c.plannerUseAllowed||c.customerClaims||c.customerApprovals||c.customerReaderBridges||c.newFactRoots||c.independentFactsAdded||c.verifiedActualUnitIds.length||c.originalMeaningIdentity!==null||c.originalClaimIdentity!==null)throw Error('CUSTOMER_PROMOTION');
  for(const t of c.typedReceipts){
   for(const k of ['unresolvedConditions','sourceGroups','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'])if(actualSemanticDigest(c.originalCandidate.requirement[k])!==actualSemanticDigest(t.typedCandidate.requirement[k]))throw Error('SOURCE_CONDITION_CHANGED');
   if(t.typedNativeReceipt.allTwelveGateResults.length!==12||t.typedNativeReceipt.allTwelveGateResults.find(g=>g.gate==='TIME_INTERSECTION').state!=='PASS')throw Error('SIDE_GATE_NOT_VERIFIED');
  }
  links.push({fixture:id,month:c.month,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),originalResearchId:c.originalResearchId,originalCatalogKey:c.originalCatalogKey,originalNativeReceiptId:c.originalNativeReceipt.receiptId,originalNativeReceiptHash:c.originalNativeReceiptHash,originalSelectedEvidence:c.originalNativeReceipt.selectedActualEvidence,
   sourceProof:c.originalSourceProof,sourcePreconditions:c.sourcePreconditions,comparisonIds:c.comparisonWitnesses.map(w=>w.comparisonId),originalFactRoots:c.originalFactRoots,comparisonReferenceRoots:c.comparisonReferenceRoots,additionalExistingGraphReferenceRoots:c.additionalExistingGraphReferenceRoots,
   originalGates:c.originalNativeReceipt.allTwelveGateResults,allTwelveGateResults:c.allTwelveGateResults,blockingReasons:c.blockingReasons,typedReceipts:c.typedReceipts.map(t=>({pointer:t.segmentPointer,use:t.use,receiptId:t.typedNativeReceipt.receiptId,receiptHash:t.typedNativeReceiptHash,selectedActualEvidence:t.typedNativeReceipt.selectedActualEvidence,temporalWitnesses:t.typedNativeReceipt.temporalWitnesses,sourceGroupEvaluation:t.typedNativeReceipt.sourceGroupEvaluation,originalConditionsPreserved:true})),
   meaningIdentity:null,claimIdentity:null,meaningReviewState:c.meaningReviewState,productReviewState:c.productReviewState,customerApprovalState:c.customerApprovalState,customerUseAllowed:false,plannerUseAllowed:false,newFactRoots:0,independentFactsAdded:0,determinism:true});
 }
 for(const o of r.observations){
  observations.push({fixture:id,...o});
  if(o.segmentProofs.some(s=>s.roots.some(root=>!facts.request.graph.nodes.some(n=>n.fact.rootId===root))))throw Error('NEW_GRAPH_ROOT');
  if(o.comparisonWitnesses.some(w=>w.beforeInterval.endExclusive!==w.afterInterval.start||w.independentInformationAdded||w.comparisonApproved))throw Error('FALSE_COMPARISON');
 }
 if(before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('INPUT_MUTATED');
 const n=native.native,linked=new Set(originals.flatMap(c=>c.verifiedActualUnitIds??[]));
 const input=facts.request.graphInput.evidence.input;if(input.kind!=='compatibility')for(const k of ['name','birthDate'])forbidden.add(input.person[k]);
 cases.push({fixture:id,product:facts.request.product,verifiedUnits:facts.handoff.units.length,withheldAttempts:facts.withheld.length,originalReceipts:native.originalReceiptsVerified,originalSourceFail:n.receipts.filter(v=>v.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,
  graphHash,calculationHash,factHandoffHash,nativeDiagnosticHash:native.context.nativeDiagnosticHash,allBaseDigestsEqual:true,historicalCandidateHashesEqual:true,originalRoots:facts.handoff.canonicalFactRoots,rootReferenceOccurrences:facts.handoff.rootReferenceOccurrences,
  majorCandidates:r.handoff.historicalMajorCandidates.length,historicalAnnualCandidates:r.handoff.historicalAnnualCandidates.length,newComparisonCandidates:r.handoff.comparisonCandidates.length,unmatchedBefore:facts.handoff.units.length-linked.size,unmatchedAfter:facts.handoff.units.length-linked.size,
  withholds:r.withheld,monthCoverage:r.observations.map(o=>({month:o.month,currentSegments:o.sourcePreconditions.allCurrentSegmentPointers.length,previousLast:o.sourcePreconditions.previousLastPointer,pairs:o.comparisonWitnesses.length,verified:o.comparisonWitnesses.filter(w=>w.result!=='WITHHELD').length,withheld:o.comparisonWitnesses.filter(w=>w.result==='WITHHELD').length})),
  rangedAugustSegments:n.version==='annual-fortune-specialist-v1'&&id.includes('ranged')?n.observation.segments.filter(s=>s.contract.month===8).map(s=>({pointer:s.originalPointer,window:s.contract.window,activeDayun:s.raw.activeDayunContext,uncertainty:s.raw.uncertainty})):[]});
 process.stderr.write(id+' candidates='+r.handoff.comparisonCandidates.length+' held-months='+r.withheld.length+'\n');
}
for(const [product,id]of [['major','A'],['major','F'],['major','C'],['annual','A'],['annual','F'],['annual','C2028']]){
 const result=await runActualCalculationFixture(root,{product,id},{resolver,foundation});await consume('fixture-'+product+'-'+id,result);
}
// Reuse the exact pre-existing ranged-transition input recipe from the earlier
// temporal verifier. No policy/gate changes and no invented calculation values.
const ranged=structuredClone(json('tests/fixtures/six-product-integration-01/source-locks.json').find(f=>f.product==='annual'&&f.id==='A'));
Object.assign(ranged.payload.person,{birthDate:'1999-07-31',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',gender:'MALE'});ranged.payload.productOptions.selectedYear='2027';ranged.clock.policyDate='2027-10-12T12:00:00+09:00';
const generated=await generateV4ShadowReport(ranged.payload,ranged.clock);if(!generated.ok||generated.externalCalls.length)throw Error('EXISTING_RANGE_FIXTURE_FAILED');
const evidence=generated.evidencePacket,profiles=observeActualProfiles(evidence),graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:'fixture-annual-ranged-transition',synthetic:true,evaluatedAt:evidence.generatedAt,owners:{person:'fixture-person-annual-ranged-transition'},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
const graph=buildActualEvidenceGraph(graphInput,catalog.evidence);if(!graph.ok)throw Error('EXISTING_RANGE_GRAPH_FAILED');
const request={graph:graph.graph,graphInput,product:graph.graph.product,relationship:null,contexts:[],actualUserState:evidence.input.userContext};
await consume(graphInput.context.fixtureId,{...await adaptActualCalculationRequest(request,{resolver,foundation}),request});

const total=k=>cases.reduce((n,c)=>n+c[k],0),witnesses=observations.flatMap(o=>o.comparisonWitnesses),summary={fixtures:cases.length,annualFixtures:observations.length/2,verifiedUnits:total('verifiedUnits'),withheldAttempts:total('withheldAttempts'),originalReceipts:total('originalReceipts'),originalSourceFail:total('originalSourceFail'),majorCandidates:total('majorCandidates'),annualCandidatesBefore:total('historicalAnnualCandidates'),annualCandidatesAfter:total('historicalAnnualCandidates')+links.length,comparisonCandidates:links.length,marchCandidates:links.filter(c=>c.month===3).length,septemberCandidates:links.filter(c=>c.month===9).length,actualBeforeAfterWitnesses:witnesses.length,verifiedComparisonWitnesses:witnesses.filter(w=>w.result!=='WITHHELD').length,withheldComparisons:witnesses.filter(w=>w.result==='WITHHELD').length,actualCurrentSegments:observations.reduce((n,o)=>n+o.sourcePreconditions.allCurrentSegmentPointers.length,0),sideProofs:observations.reduce((n,o)=>n+o.segmentProofs.length,0),independentTypedReceipts:links.reduce((n,c)=>n+c.typedReceipts.length,0),verifiedMonthsBefore:[5,7,10,12],verifiedMonthsAfter:[3,5,7,9,10,12].filter(m=>![3,9].includes(m)||links.some(c=>c.month===m)),unmatchedBefore:total('unmatchedBefore'),unmatchedAfter:total('unmatchedAfter'),originalRoots:new Set(cases.flatMap(c=>c.originalRoots)).size,rootReferenceOccurrences:total('rootReferenceOccurrences'),additionalExistingGraphReferenceRoots:new Set(links.flatMap(c=>c.additionalExistingGraphReferenceRoots)).size,newFactRoots:0,newUnitLinks:0,independentFactsAdded:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.withheldAttempts!==164||summary.originalReceipts!==703||summary.originalSourceFail!==30||summary.majorCandidates!==2||summary.annualCandidatesBefore!==24||historical.length!==26||summary.unmatchedBefore!==396||summary.unmatchedAfter!==396||summary.originalRoots!==246)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'fixtures.json':cases,'source-proofs.json':sources,'comparison-observations.json':observations,'comparison-links.json':links,'historical-candidate-hashes.json':historical})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
