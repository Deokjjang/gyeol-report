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
const {adaptAnnualAprilRelations}=load(base+'annual-april-relation/adapter.ts');
const {evaluateApril,validateAprilCandidate,validateRelationWitness,APRIL_CONTRACT}=load(base+'annual-april-relation/contract.ts');
const {AnnualSpecialistIndex}=load(base+'annual-fortune-specialist-engine/candidateIndex.ts');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const prior=json('docs/validation/v4-annual-march-september-comparison-01/technical-binding-coverage.json');
const row=new AnnualSpecialistIndex(foundation).byOriginalId.get(APRIL_CONTRACT.originalId),proof=await resolver.proof(row.candidate.record.locator,row.originalResearchId,row.catalogKey);
const source={month:4,id:row.originalResearchId,proof,originalRequirements:row.original.requires,originalRecord:row.original,meaningIdentity:row.candidate.requirement.meaningIdentity,claimIdentity:row.candidate.requirement.claimIdentity};
async function consume(id,facts){
 if(!facts.ok)throw Error('ACTUAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const r=await adaptAnnualAprilRelations(facts.request,facts,{resolver,foundation});if(!r.ok)throw Error('APRIL_ADAPTER_FAILED:'+id+':'+r.reasons.join('|'));
 const native=r.baseline.baseline.baseline.baseline.baseline,previous=prior.nativeDiagnosticComparison.find(c=>c.fixture===id);
 const graphHash=actualSemanticDigest(facts.request.graph),calculationHash=actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash=actualSemanticDigest(facts.handoff);
 if(!previous||graphHash!==previous.graphHash||calculationHash!==previous.calculationHash||factHandoffHash!==previous.factHandoffHash||native.context.nativeDiagnosticHash!==previous.nativeDiagnosticHash||native.originalReceiptsVerified!==previous.originalReceipts)throw Error('BASE_CALCULATION_OR_ORIGINAL_RECEIPTS_CHANGED:'+id);
 const originals=[...r.handoff.historicalMajorCandidates,...r.handoff.historicalAnnualCandidates],allowed=[...prior.historicalCandidateHashes,...prior.newComparisonBindings];
 for(const c of originals){const candidateHash=actualSemanticDigest(c);if(!allowed.some(p=>p.candidateId===c.candidateId&&p.candidateHash===candidateHash))throw Error('HISTORICAL_CANDIDATE_CHANGED:'+c.candidateId);historical.push({fixture:id,candidateId:c.candidateId,candidateHash});}
 if(r.observation){
  const recreated=await evaluateApril(r.context);if(!recreated.ok||actualSemanticDigest(recreated.observation)!==actualSemanticDigest(r.observation))throw Error('APRIL_NONDETERMINISTIC');
  const o=r.observation;
  for(const s of o.segmentResults){
   if(s.witnesses.length!==s.originalSegment.relationFacts.length||s.witnesses.some((w,i)=>w.originalRelationEvidenceId!==s.originalSegment.relationFacts[i].id))throw Error('OMITTED_OR_INVENTED_RELATION');
   if((s.witnesses.some(w=>w.verificationState==='WITHHELD')||!s.witnesses.length)&&s.binding)throw Error('PARTIAL_SEGMENT_PROMOTED');
  }
  for(const w of o.relationWitnesses){
   const check=await validateRelationWitness(r.context,structuredClone(w));if(!check.ok||check.eligibleForTechnicalBinding!==(w.verificationState==='VERIFIED'))throw Error('WITNESS_REVALIDATION_FAILED');
   const n=facts.request.graph.nodes.find(n=>n.id===w.originalGraphNodeId);if(!n||n.fact.rootId!==w.originalFactRoot||actualSemanticDigest(n.ancestry)!==actualSemanticDigest(w.completeAncestry)||actualSemanticDigest(n.participants)!==actualSemanticDigest(w.actualParticipants)||actualSemanticDigest(n.value)!==actualSemanticDigest(w.originalRelationFact)||w.newFactRoots||w.independentInformationAdded||w.customerUseAllowed)throw Error('ORIGINAL_GRAPH_RELATION_CHANGED');
   if(w.calculationCertainty!=='confirmed'&&w.verificationState!=='WITHHELD')throw Error('CONDITIONAL_RELATION_PROMOTED');
  }
  for(const b of o.typedBindings){
   const original=native.native.receipts.find(n=>n.originalResearchId===APRIL_CONTRACT.originalId);
   if(b.typedNativeReceipt.allTwelveGateResults.length!==12||b.typedNativeReceipt.allTwelveGateResults.find(g=>g.gate==='TIME_INTERSECTION').state!=='PASS'||b.typedNativeReceipt.customerApproved||b.typedNativeReceipt.operatorApproved)throw Error('TYPED_GATE_PROMOTION');
   if(actualSemanticDigest(b.typedNativeReceipt.sourceGroupEvaluation)!==actualSemanticDigest(original.sourceGroupEvaluation))throw Error('SOURCE_GROUP_CHANGED');
   if(b.typedNativeReceipt.temporalWitnesses.some(w=>w.start!==b.effectiveInterval.start||w.endExclusive!==b.effectiveInterval.endExclusive))throw Error('CROSS_SEGMENT_NATIVE_BINDING');
  }
  observations.push({fixture:id,observationHash:actualSemanticDigest(o),...o,withheld:r.withheld,monthCandidateEmitted:r.handoff.aprilCandidates.length===1,determinism:true});
 }
 for(const c of r.handoff.aprilCandidates){
  if(!(await validateAprilCandidate(r.context,structuredClone(c))).ok)throw Error('APRIL_CANDIDATE_REVALIDATION_FAILED');
  if(c.segmentResults.some(s=>s.state!=='VERIFIED')||c.customerUseAllowed||c.plannerUseAllowed||c.customerClaims||c.customerApprovals||c.newFactRoots||c.independentFactsAdded||c.verifiedActualUnitIds.length||c.originalMeaningIdentity!==null||c.originalClaimIdentity!==null)throw Error('INCOMPLETE_MONTH_OR_CUSTOMER_PROMOTION');
  for(const b of c.typedBindings)for(const k of ['unresolvedConditions','sourceGroups','requiredContext','products','relationships','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'])if(actualSemanticDigest(c.originalCandidate.requirement[k])!==actualSemanticDigest(b.typedCandidate.requirement[k]))throw Error('ORIGINAL_CONDITION_CHANGED');
  links.push({fixture:id,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),sourceProof:c.originalSourceProof,sourcePreconditions:c.sourcePreconditions,originalNativeReceiptId:c.originalNativeReceipt.receiptId,originalNativeReceiptHash:c.originalNativeReceiptHash,originalSelectedEvidence:c.originalNativeReceipt.selectedActualEvidence,
   originalGates:c.originalNativeReceipt.allTwelveGateResults,allTwelveGateResults:c.allTwelveGateResults,originalFactRoots:c.originalFactRoots,originalRelationOccurrenceRoots:c.originalRelationOccurrenceRoots,additionalExistingGraphReferenceRoots:c.additionalExistingGraphReferenceRoots,blockingReasons:c.blockingReasons,
   typedBindings:c.typedBindings.map(b=>({segmentPointer:b.segmentPointer,window:b.effectiveInterval,witnessIds:b.witnessIds,receiptId:b.typedNativeReceipt.receiptId,receiptHash:b.typedNativeReceiptHash,selectedActualEvidence:b.typedNativeReceipt.selectedActualEvidence,originalConditionsPreserved:true})),
   meaningIdentity:null,claimIdentity:null,meaningReviewState:c.meaningReviewState,productReviewState:c.productReviewState,customerApprovalState:c.customerApprovalState,customerUseAllowed:false,plannerUseAllowed:false,newFactRoots:0,independentFactsAdded:0,determinism:true});
 }
 if(before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('INPUT_MUTATED');
 const linked=new Set(originals.flatMap(c=>c.verifiedActualUnitIds??[])),input=facts.request.graphInput.evidence.input;
 if(input.kind!=='compatibility')for(const k of ['name','birthDate'])forbidden.add(input.person[k]);
 cases.push({fixture:id,product:facts.request.product,verifiedUnits:facts.handoff.units.length,withheldAttempts:facts.withheld.length,originalReceipts:native.originalReceiptsVerified,originalSourceFail:native.native.receipts.filter(v=>v.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,
  graphHash,calculationHash,factHandoffHash,nativeDiagnosticHash:native.context.nativeDiagnosticHash,allBaseDigestsEqual:true,historicalCandidateHashesEqual:true,originalRoots:facts.handoff.canonicalFactRoots,rootReferenceOccurrences:facts.handoff.rootReferenceOccurrences,
  majorCandidates:r.handoff.historicalMajorCandidates.length,historicalAnnualCandidates:r.handoff.historicalAnnualCandidates.length,newAprilCandidates:r.handoff.aprilCandidates.length,unmatchedBefore:facts.handoff.units.length-linked.size,unmatchedAfter:facts.handoff.units.length-linked.size,
  withholds:r.withheld,segments:r.observation?.segmentResults.length??0,typedBindings:r.observation?.typedBindings.length??0,relationWitnesses:r.observation?.relationWitnesses.length??0});
 process.stderr.write(id+' april-candidates='+r.handoff.aprilCandidates.length+' verified-bindings='+(r.observation?.typedBindings.length??0)+' held-segments='+r.withheld.length+'\n');
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

const total=k=>cases.reduce((n,c)=>n+c[k],0),witnesses=observations.flatMap(o=>o.relationWitnesses),summary={fixtures:cases.length,annualFixtures:observations.length,verifiedUnits:total('verifiedUnits'),withheldAttempts:total('withheldAttempts'),originalReceipts:total('originalReceipts'),originalSourceFail:total('originalSourceFail'),majorCandidates:total('majorCandidates'),annualCandidatesBefore:total('historicalAnnualCandidates'),annualCandidatesAfter:total('historicalAnnualCandidates')+links.length,aprilCandidates:links.length,actualAprilSegments:total('segments'),aprilTypedBindings:total('typedBindings'),heldAprilSegments:observations.reduce((n,o)=>n+o.withheld.length,0),relationFactsObserved:witnesses.length,relationWitnessesVerified:witnesses.filter(w=>w.verificationState==='VERIFIED').length,relationWitnessesWithheld:witnesses.filter(w=>w.verificationState==='WITHHELD').length,
 bySource:Object.fromEntries(['month_natal_branch','month_annual_branch','month_dayun_branch','month_natal_element'].map(source=>[source,{observed:witnesses.filter(w=>w.relationSource===source).length,verified:witnesses.filter(w=>w.relationSource===source&&w.verificationState==='VERIFIED').length,withheld:witnesses.filter(w=>w.relationSource===source&&w.verificationState==='WITHHELD').length}])),
 originalRelationOccurrenceRoots:new Set(witnesses.map(w=>w.originalFactRoot)).size,relationAncestryRoots:new Set(witnesses.flatMap(w=>w.completeAncestry.rootIds)).size,relationRootReferenceOccurrences:witnesses.reduce((n,w)=>n+w.completeAncestry.rootIds.length,0),conditionalRelations:witnesses.filter(w=>w.calculationCertainty!=='confirmed').length,
 verifiedMonthsBefore:[3,5,7,9,10,12],verifiedMonthsAfter:links.length?[3,4,5,7,9,10,12]:[3,5,7,9,10,12],unmatchedBefore:total('unmatchedBefore'),unmatchedAfter:total('unmatchedAfter'),originalRoots:new Set(cases.flatMap(c=>c.originalRoots)).size,rootReferenceOccurrences:total('rootReferenceOccurrences'),additionalExistingGraphReferenceRoots:new Set(links.flatMap(c=>c.additionalExistingGraphReferenceRoots)).size,newFactRoots:0,newUnitLinks:0,independentFactsAdded:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.withheldAttempts!==164||summary.originalReceipts!==703||summary.originalSourceFail!==30||summary.majorCandidates!==2||summary.annualCandidatesBefore!==29||historical.length!==31||summary.unmatchedBefore!==396||summary.unmatchedAfter!==396||summary.originalRoots!==246)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'fixtures.json':cases,'source-proof.json':source,'relation-observations.json':observations,'april-links.json':links,'historical-candidate-hashes.json':historical})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
