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

const {adaptAnnualJanuaryCarryover}=load(base+'annual-january-carryover/adapter.ts');
const {evaluateJanuary,validateJanuaryCandidate,validatePriorDecember,JANUARY_CONTRACT}=load(base+'annual-january-carryover/contract.ts');
const {AnnualSpecialistIndex}=load(base+'annual-fortune-specialist-engine/candidateIndex.ts');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const prior=json('docs/validation/v4-annual-august-conditional-dayun-01/august-native-binding-coverage.json');
const row=new AnnualSpecialistIndex(foundation).byOriginalId.get(JANUARY_CONTRACT.originalId),proof=await resolver.proof(row.candidate.record.locator,row.originalResearchId,row.catalogKey);
const source={month:1,id:row.originalResearchId,proof,originalRequirements:row.original.requires,originalRecord:row.original,meaningIdentity:row.candidate.requirement.meaningIdentity,claimIdentity:row.candidate.requirement.claimIdentity};
async function consume(id,facts){
 if(!facts.ok)throw Error('ACTUAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const r=await adaptAnnualJanuaryCarryover(facts.request,facts,{resolver,foundation});if(!r.ok)throw Error('JANUARY_ADAPTER_FAILED:'+id+':'+r.reasons.join('|'));
 const native=r.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline,previous=prior.nativeDiagnosticComparison.find(c=>c.fixture===id);
 const graphHash=actualSemanticDigest(facts.request.graph),calculationHash=actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash=actualSemanticDigest(facts.handoff);
 if(!previous||graphHash!==previous.graphHash||calculationHash!==previous.calculationHash||factHandoffHash!==previous.factHandoffHash||native.context.nativeDiagnosticHash!==previous.nativeDiagnosticHash||native.originalReceiptsVerified!==previous.originalReceipts)throw Error('BASE_CALCULATION_OR_ORIGINAL_RECEIPTS_CHANGED:'+id);
 const originals=[...r.handoff.historicalMajorCandidates,...r.handoff.historicalAnnualCandidates],allowed=[...prior.historical37CandidateHashes,...prior.augustCandidates];
 for(const c of originals){const candidateHash=actualSemanticDigest(c);if(!allowed.some(p=>p.candidateId===c.candidateId&&p.candidateHash===candidateHash))throw Error('HISTORICAL_CANDIDATE_CHANGED:'+c.candidateId);historical.push({fixture:id,candidateId:c.candidateId,candidateHash});}
 if(r.observation){
  const recreated=await evaluateJanuary(r.context);if(!recreated.ok||actualSemanticDigest(recreated.observation)!==actualSemanticDigest(r.observation))throw Error('JANUARY_NONDETERMINISTIC');
  const p=r.observation.priorDecember,check=await validatePriorDecember(r.context,structuredClone(p));if(!check.ok||check.eligibleAsCalculatedFact||p.originalGraphEvidence.length||p.originalFactRoots.length||p.originalNativeReceiptsAdded)throw Error('ADJACENT_SOURCE_PROMOTED');
  if(p.sourceWitness&&(p.sourceWitness.recordKind!=='SOURCE_ONLY_ADJACENT_YEAR_WITNESS'||p.sourceWitness.originalGraphEvidence.length||p.sourceWitness.originalFactRoots.length||p.sourceWitness.independentCalculatedFact||p.sourceWitness.newFactRoots||p.sourceWitness.customerUseAllowed))throw Error('SOURCE_ONLY_CONTRACT_VIOLATED');
  for(const segment of r.observation.segmentResults){
   for(const node of segment.completeAncestry)if(!facts.request.graph.nodes.some(old=>actualSemanticDigest(old)===actualSemanticDigest(node)))throw Error('ORIGINAL_GRAPH_ANCESTRY_CHANGED');
   if(segment.existingFactRoots.some(root=>!facts.request.graph.nodes.some(n=>n.fact.rootId===root)))throw Error('NEW_ROOT');
   const b=segment.binding,receipt=b.typedNativeReceipt;if(receipt.selectedActualEvidence.length!==3||receipt.allTwelveGateResults.length!==12||receipt.customerApproved||receipt.operatorApproved)throw Error('NATIVE_GATE_PROMOTION');
   if(receipt.temporalWitnesses.some(w=>w.start!==segment.originalSegment.startKst||w.endExclusive!==segment.originalSegment.endKstExclusive))throw Error('DISJOINT_NATIVE_BINDING');
  }
  const c=r.observation.crossYearComparison;
  if(c&&(c.comparisonScope!=='CALENDAR_AND_RELATION_SIGNATURES_ONLY'||c.graphRootAndTransitComparisonState!=='WITHHELD_MISSING_PRIOR_GRAPH'||c.originalComparatorObservation.changedRoots.length||c.originalComparatorObservation.kinds.some(k=>['NEW_ACCEPTED_TRANSIT','NEW_RELATION_ROOT'].includes(k))||c.beforeGraphEvidence.length||c.beforeFactRoots.length||c.beforeWindow.endExclusive!==c.afterWindow.start||c.comparisonApproved||c.newFactRoots))throw Error('CROSS_YEAR_WITNESS_PROMOTED');
  observations.push({fixture:id,observationHash:actualSemanticDigest(r.observation),...r.observation,withheld:r.withheld,determinism:true});
 }
 for(const c of r.handoff.januaryCandidates){
  if(!(await validateJanuaryCandidate(r.context,structuredClone(c))).ok||c.customerUseAllowed||c.plannerUseAllowed||c.customerClaims||c.customerApprovals||c.newFactRoots||c.independentFactsAdded||c.verifiedActualUnitIds.length||c.originalMeaningIdentity!==null||c.originalClaimIdentity!==null)throw Error('CANDIDATE_PROMOTION');
  for(const b of c.typedBindings)for(const key of ['unresolvedConditions','sourceGroups','requiredContext','products','relationships','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'])if(actualSemanticDigest(c.originalCandidate.requirement[key])!==actualSemanticDigest(b.typedCandidate.requirement[key]))throw Error('ORIGINAL_CONDITION_CHANGED');
  links.push({fixture:id,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),sourcePreconditions:c.sourcePreconditions,originalNativeReceiptId:c.originalNativeReceipt.receiptId,originalNativeReceiptHash:c.originalNativeReceiptHash,originalGates:c.originalNativeReceipt.allTwelveGateResults,originalFactRoots:c.originalFactRoots,
   typedBindings:c.typedBindings.map(b=>({segmentPointer:b.segmentPointer,window:b.effectiveInterval,receiptId:b.typedNativeReceipt.receiptId,receiptHash:b.typedNativeReceiptHash,selectedActualEvidence:b.typedNativeReceipt.selectedActualEvidence,gates:b.typedNativeReceipt.allTwelveGateResults,originalConditionsPreserved:true})),meaningIdentity:null,claimIdentity:null,customerUseAllowed:false,newFactRoots:0,independentFactsAdded:0,determinism:true});
 }
 if(before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('INPUT_MUTATED');
 const linked=new Set(originals.flatMap(c=>c.verifiedActualUnitIds??[])),input=facts.request.graphInput.evidence.input;
 if(input.kind!=='compatibility')for(const key of ['name','birthDate'])forbidden.add(input.person[key]);
 cases.push({fixture:id,product:facts.request.product,verifiedUnits:facts.handoff.units.length,withheldAttempts:facts.withheld.length,originalReceipts:native.originalReceiptsVerified,originalSourceFail:native.native.receipts.filter(v=>v.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,
  originalReceiptHashes:native.native.receipts.map(receipt=>({receiptId:receipt.receiptId,fullReceiptHash:actualSemanticDigest(receipt)})),graphHash,calculationHash,factHandoffHash,nativeDiagnosticHash:native.context.nativeDiagnosticHash,allBaseDigestsEqual:true,historicalCandidateHashesEqual:true,originalRoots:facts.handoff.canonicalFactRoots,rootReferenceOccurrences:facts.handoff.rootReferenceOccurrences,
  majorCandidates:r.handoff.historicalMajorCandidates.length,historicalAnnualCandidates:r.handoff.historicalAnnualCandidates.length,newJanuaryCandidates:r.handoff.januaryCandidates.length,unmatchedBefore:facts.handoff.units.length-linked.size,unmatchedAfter:facts.handoff.units.length-linked.size,segments:r.observation?.segmentResults.length??0,typedBindings:r.observation?.typedBindings.length??0});
 process.stderr.write(id+' january-candidates='+r.handoff.januaryCandidates.length+' bindings='+(r.observation?.typedBindings.length??0)+' prior='+r.observation?.priorDecember.availabilityState+' comparison='+r.observation?.crossYearComparisonState+'\n');
}
for(const [product,id]of [['major','A'],['major','F'],['major','C'],['annual','A'],['annual','F'],['annual','C2028']])await consume('fixture-'+product+'-'+id,await runActualCalculationFixture(root,{product,id},{resolver,foundation}));
const ranged=structuredClone(json('tests/fixtures/six-product-integration-01/source-locks.json').find(f=>f.product==='annual'&&f.id==='A'));
Object.assign(ranged.payload.person,{birthDate:'1999-07-31',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',gender:'MALE'});ranged.payload.productOptions.selectedYear='2027';ranged.clock.policyDate='2027-10-12T12:00:00+09:00';
const generated=await generateV4ShadowReport(ranged.payload,ranged.clock);if(!generated.ok||generated.externalCalls.length)throw Error('EXISTING_RANGE_FIXTURE_FAILED');
const evidence=generated.evidencePacket,profiles=observeActualProfiles(evidence),graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:'fixture-annual-ranged-transition',synthetic:true,evaluatedAt:evidence.generatedAt,owners:{person:'fixture-person-annual-ranged-transition'},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
const graph=buildActualEvidenceGraph(graphInput,catalog.evidence);if(!graph.ok)throw Error('EXISTING_RANGE_GRAPH_FAILED');
const request={graph:graph.graph,graphInput,product:graph.graph.product,relationship:null,contexts:[],actualUserState:evidence.input.userContext};
await consume(graphInput.context.fixtureId,{...await adaptActualCalculationRequest(request,{resolver,foundation}),request});
const total=key=>cases.reduce((n,c)=>n+c[key],0);
const summary={fixtures:cases.length,annualFixtures:observations.length,verifiedUnits:total('verifiedUnits'),withheldAttempts:total('withheldAttempts'),originalReceipts:total('originalReceipts'),originalSourceFail:total('originalSourceFail'),majorCandidates:total('majorCandidates'),annualCandidatesBefore:total('historicalAnnualCandidates'),annualCandidatesAfter:total('historicalAnnualCandidates')+links.length,januaryCandidates:links.length,actualJanuarySegments:total('segments'),januaryTypedBindings:total('typedBindings'),
 priorDecemberNotInOriginalLedger:observations.filter(o=>o.priorDecember.originalLedgerState==='PRIOR_DECEMBER_NOT_IN_ORIGINAL_LEDGER').length,priorDecemberProducerVerified:observations.filter(o=>o.priorDecember.availabilityState==='PRIOR_DECEMBER_VERIFIED').length,
 crossYearComparisonVerified:observations.filter(o=>o.crossYearComparisonState==='PREVIOUS_DECEMBER_COMPARISON_VERIFIED').length,crossYearComparisonWithheld:observations.filter(o=>o.crossYearComparisonState==='PRIOR_DECEMBER_COMPARISON_WITHHELD').length,
 verifiedMonthsBefore:[2,3,4,5,7,8,9,10,12],verifiedMonthsAfter:observations.length===4&&links.length===4?[1,2,3,4,5,7,8,9,10,12]:[2,3,4,5,7,8,9,10,12],unmatchedBefore:total('unmatchedBefore'),unmatchedAfter:total('unmatchedAfter'),originalRoots:new Set(cases.flatMap(c=>c.originalRoots)).size,rootReferenceOccurrences:total('rootReferenceOccurrences'),newFactRoots:0,newUnitLinks:0,independentFactsAdded:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.withheldAttempts!==164||summary.originalReceipts!==703||summary.originalSourceFail!==30||summary.majorCandidates!==2||summary.annualCandidatesBefore!==38||historical.length!==40||summary.unmatchedBefore!==396||summary.unmatchedAfter!==396||summary.originalRoots!==246)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'fixtures.json':cases,'source-proof.json':source,'january-observations.json':observations,'january-links.json':links,'historical-candidate-hashes.json':historical})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
