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
const {adaptAnnualFebruaryRelations}=load(base+'annual-february-relation/adapter.ts');
const {evaluateFebruary,validateFebruaryCandidate,validateApplicabilityWitness,FEBRUARY_CONTRACT}=load(base+'annual-february-relation/contract.ts');
const {AnnualSpecialistIndex}=load(base+'annual-fortune-specialist-engine/candidateIndex.ts');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const prior=json('docs/validation/v4-annual-april-relation-evidence-01/april-native-binding-coverage.json');
const row=new AnnualSpecialistIndex(foundation).byOriginalId.get(FEBRUARY_CONTRACT.originalId),proof=await resolver.proof(row.candidate.record.locator,row.originalResearchId,row.catalogKey);
const source={month:2,id:row.originalResearchId,proof,originalRequirements:row.original.requires,originalRecord:row.original,meaningIdentity:row.candidate.requirement.meaningIdentity,claimIdentity:row.candidate.requirement.claimIdentity};
async function consume(id,facts,supplemental=false){
 if(!facts.ok)throw Error('ACTUAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const r=await adaptAnnualFebruaryRelations(facts.request,facts,{resolver,foundation});if(!r.ok)throw Error('FEBRUARY_ADAPTER_FAILED:'+id+':'+r.reasons.join('|'));
 const native=r.baseline.baseline.baseline.baseline.baseline.baseline,previous=prior.nativeDiagnosticComparison.find(c=>c.fixture===id);
 const graphHash=actualSemanticDigest(facts.request.graph),calculationHash=actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash=actualSemanticDigest(facts.handoff);
 if(!supplemental&&(!previous||graphHash!==previous.graphHash||calculationHash!==previous.calculationHash||factHandoffHash!==previous.factHandoffHash||native.context.nativeDiagnosticHash!==previous.nativeDiagnosticHash||native.originalReceiptsVerified!==previous.originalReceipts))throw Error('BASE_CALCULATION_OR_ORIGINAL_RECEIPTS_CHANGED:'+id);
 const originals=[...r.handoff.historicalMajorCandidates,...r.handoff.historicalAnnualCandidates],allowed=[...prior.historical31CandidateHashes,...prior.aprilMonthCandidates];
 for(const c of originals){const candidateHash=actualSemanticDigest(c);if(!supplemental&&!allowed.some(p=>p.candidateId===c.candidateId&&p.candidateHash===candidateHash))throw Error('HISTORICAL_CANDIDATE_CHANGED:'+c.candidateId);if(!supplemental)historical.push({fixture:id,candidateId:c.candidateId,candidateHash});}
 if(r.observation){
  const recreated=await evaluateFebruary(r.context);if(!recreated.ok||actualSemanticDigest(recreated.observation)!==actualSemanticDigest(r.observation))throw Error('FEBRUARY_NONDETERMINISTIC');
  const o=r.observation;if(!o.ipchunBoundary.valid)throw Error('INVALID_IPCHUN');
  for(const s of o.segmentResults){
   if(s.applicabilityWitnesses.length!==Math.max(1,o.originalDeclarations.length))throw Error('OMITTED_DECLARATION');
   if(s.binding.typedNativeReceipt.selectedActualEvidence.length!==3||s.binding.sourceWitnessesAreGraphFacts!==false)throw Error('WITNESS_DISGUISED_AS_GRAPH_FACT');
   const original=native.native.receipts.find(n=>n.originalResearchId===FEBRUARY_CONTRACT.originalId);
   if(s.binding.typedNativeReceipt.allTwelveGateResults.length!==12||s.binding.typedNativeReceipt.allTwelveGateResults.find(g=>g.gate==='TIME_INTERSECTION').state!=='PASS'||s.binding.typedNativeReceipt.customerApproved||s.binding.typedNativeReceipt.operatorApproved)throw Error('TYPED_GATE_PROMOTION');
   if(actualSemanticDigest(s.binding.typedNativeReceipt.sourceGroupEvaluation)!==actualSemanticDigest(original.sourceGroupEvaluation))throw Error('SOURCE_GROUP_CHANGED');
   if(s.binding.typedNativeReceipt.temporalWitnesses.some(w=>w.start!==s.originalSegment.startKst||w.endExclusive!==s.originalSegment.endKstExclusive))throw Error('CROSS_SEGMENT_NATIVE_BINDING');
  }
  for(const w of o.applicabilityWitnesses){
   const check=await validateApplicabilityWitness(r.context,structuredClone(w));if(!check.ok||check.eligibleAsCalculatedRelationFact||w.calculatedRelationFactVerified||w.graphRelationNodeId!==null||w.newFactRoots||w.independentFactsAdded||w.customerUseAllowed)throw Error('WITNESS_REVALIDATION_FAILED');
   if(w.originalAnnualRelationDeclaration&&w.nominalAnnualStem!==w.effectiveAnnualStem&&w.applicabilityState!=='NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT')throw Error('PRE_IPCHUN_EXTRAPOLATION');
   if(!w.originalAnnualRelationDeclaration&&w.applicabilityState!=='NO_ORIGINAL_RELATION_DECLARATION')throw Error('FALSE_ABSENCE_RELATION');
   if(w.originalNatalStemEvidence&&!facts.request.graph.nodes.some(n=>actualSemanticDigest(n)===actualSemanticDigest(w.originalNatalStemEvidence)))throw Error('NATAL_NODE_CHANGED');
   if(!facts.request.graph.nodes.some(n=>actualSemanticDigest(n)===actualSemanticDigest(w.actualAnnualSegmentEvidence)))throw Error('ANNUAL_NODE_CHANGED');
   if(w.originalFactRoots.some(root=>!facts.request.graph.nodes.some(n=>n.fact.rootId===root)))throw Error('NEW_ROOT');
  }
  observations.push({fixture:id,supplemental,observationHash:actualSemanticDigest(o),...o,withheld:r.withheld,monthCandidateEmitted:r.handoff.februaryCandidates.length===1,determinism:true});
 }
 for(const c of r.handoff.februaryCandidates){
  if(!(await validateFebruaryCandidate(r.context,structuredClone(c))).ok)throw Error('FEBRUARY_CANDIDATE_REVALIDATION_FAILED');
  if(c.segmentResults.some(s=>s.state!=='VERIFIED')||c.customerUseAllowed||c.plannerUseAllowed||c.customerClaims||c.customerApprovals||c.newFactRoots||c.independentFactsAdded||c.verifiedActualUnitIds.length||c.originalMeaningIdentity!==null||c.originalClaimIdentity!==null)throw Error('INCOMPLETE_MONTH_OR_CUSTOMER_PROMOTION');
  for(const b of c.typedBindings)for(const k of ['unresolvedConditions','sourceGroups','requiredContext','products','relationships','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'])if(actualSemanticDigest(c.originalCandidate.requirement[k])!==actualSemanticDigest(b.typedCandidate.requirement[k]))throw Error('ORIGINAL_CONDITION_CHANGED');
  links.push({fixture:id,supplemental,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),sourcePreconditions:c.sourcePreconditions,originalNativeReceiptId:c.originalNativeReceipt.receiptId,originalNativeReceiptHash:c.originalNativeReceiptHash,originalSelectedEvidence:c.originalNativeReceipt.selectedActualEvidence,
   originalGates:c.originalNativeReceipt.allTwelveGateResults,originalFactRoots:c.originalFactRoots,additionalExistingGraphReferenceRoots:c.additionalExistingGraphReferenceRoots,
   typedBindings:c.typedBindings.map(b=>({segmentPointer:b.segmentPointer,window:b.effectiveInterval,witnessIds:b.sourcePreconditionWitnessIds,receiptId:b.typedNativeReceipt.receiptId,receiptHash:b.typedNativeReceiptHash,selectedActualEvidence:b.typedNativeReceipt.selectedActualEvidence,gates:b.typedNativeReceipt.allTwelveGateResults,originalConditionsPreserved:true})),
   meaningIdentity:null,claimIdentity:null,meaningReviewState:c.meaningReviewState,productReviewState:c.productReviewState,customerApprovalState:c.customerApprovalState,customerUseAllowed:false,plannerUseAllowed:false,newFactRoots:0,independentFactsAdded:0,determinism:true});
 }
 if(before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('INPUT_MUTATED');
 const linked=new Set(originals.flatMap(c=>c.verifiedActualUnitIds??[])),input=facts.request.graphInput.evidence.input;
 if(input.kind!=='compatibility')for(const k of ['name','birthDate'])forbidden.add(input.person[k]);
 cases.push({fixture:id,supplemental,product:facts.request.product,verifiedUnits:facts.handoff.units.length,withheldAttempts:facts.withheld.length,originalReceipts:native.originalReceiptsVerified,originalSourceFail:native.native.receipts.filter(v=>v.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,
  graphHash,calculationHash,factHandoffHash,nativeDiagnosticHash:native.context.nativeDiagnosticHash,allBaseDigestsEqual:!supplemental,historicalCandidateHashesEqual:!supplemental,originalRoots:facts.handoff.canonicalFactRoots,rootReferenceOccurrences:facts.handoff.rootReferenceOccurrences,
  majorCandidates:r.handoff.historicalMajorCandidates.length,historicalAnnualCandidates:r.handoff.historicalAnnualCandidates.length,newFebruaryCandidates:r.handoff.februaryCandidates.length,unmatchedBefore:facts.handoff.units.length-linked.size,unmatchedAfter:facts.handoff.units.length-linked.size,
  withholds:r.withheld,segments:r.observation?.segmentResults.length??0,typedBindings:r.observation?.typedBindings.length??0});
 process.stderr.write(id+' february-candidates='+r.handoff.februaryCandidates.length+' bindings='+(r.observation?.typedBindings.length??0)+'\n');
}
for(const [product,id]of [['major','A'],['major','F'],['major','C'],['annual','A'],['annual','F'],['annual','C2028']])await consume('fixture-'+product+'-'+id,await runActualCalculationFixture(root,{product,id},{resolver,foundation}));
const ranged=structuredClone(json('tests/fixtures/six-product-integration-01/source-locks.json').find(f=>f.product==='annual'&&f.id==='A'));
Object.assign(ranged.payload.person,{birthDate:'1999-07-31',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',gender:'MALE'});ranged.payload.productOptions.selectedYear='2027';ranged.clock.policyDate='2027-10-12T12:00:00+09:00';
const generated=await generateV4ShadowReport(ranged.payload,ranged.clock);if(!generated.ok||generated.externalCalls.length)throw Error('EXISTING_RANGE_FIXTURE_FAILED');
const evidence=generated.evidencePacket,profiles=observeActualProfiles(evidence),graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:'fixture-annual-ranged-transition',synthetic:true,evaluatedAt:evidence.generatedAt,owners:{person:'fixture-person-annual-ranged-transition'},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
const graph=buildActualEvidenceGraph(graphInput,catalog.evidence);if(!graph.ok)throw Error('EXISTING_RANGE_GRAPH_FAILED');
const request={graph:graph.graph,graphInput,product:graph.graph.product,relationship:null,contexts:[],actualUserState:evidence.input.userContext};
await consume(graphInput.context.fixtureId,{...await adaptActualCalculationRequest(request,{resolver,foundation}),request});
// Supplemental original fixture H2025 verifies a nonempty declaration without changing the locked 7-fixture comparison cohort.
await consume('fixture-annual-H2025',await runActualCalculationFixture(root,{product:'annual',id:'H2025'},{resolver,foundation}),true);
const cohort=cases.filter(c=>!c.supplemental),cohortObservations=observations.filter(o=>!o.supplemental),cohortLinks=links.filter(c=>!c.supplemental);
const total=k=>cohort.reduce((n,c)=>n+c[k],0),witnesses=cohortObservations.flatMap(o=>o.applicabilityWitnesses);
const summary={fixtures:cohort.length,supplementalFixtures:cases.filter(c=>c.supplemental).length,annualFixtures:cohortObservations.length,verifiedUnits:total('verifiedUnits'),withheldAttempts:total('withheldAttempts'),originalReceipts:total('originalReceipts'),originalSourceFail:total('originalSourceFail'),majorCandidates:total('majorCandidates'),annualCandidatesBefore:total('historicalAnnualCandidates'),annualCandidatesAfter:total('historicalAnnualCandidates')+cohortLinks.length,februaryCandidates:cohortLinks.length,actualFebruarySegments:total('segments'),februaryTypedBindings:total('typedBindings'),originalDeclarations:cohortObservations.reduce((n,o)=>n+o.originalDeclarations.length,0),applicabilityWitnesses:witnesses.length,
 applicabilityStates:Object.fromEntries(['APPLICABLE_VERIFIED_DECLARATION_SCOPE','NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT','NO_ORIGINAL_RELATION_DECLARATION','SOURCE_OR_ADDRESS_UNVERIFIED','WITHHELD_UNKNOWN_CONTEXT'].map(state=>[state,witnesses.filter(w=>w.applicabilityState===state).length])),
 supplementalStates:Object.fromEntries(['APPLICABLE_VERIFIED_DECLARATION_SCOPE','NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT','NO_ORIGINAL_RELATION_DECLARATION'].map(state=>[state,observations.filter(o=>o.supplemental).flatMap(o=>o.applicabilityWitnesses).filter(w=>w.applicabilityState===state).length])),
 verifiedMonthsBefore:[3,4,5,7,9,10,12],verifiedMonthsAfter:cohortLinks.length?[2,3,4,5,7,9,10,12]:[3,4,5,7,9,10,12],unmatchedBefore:total('unmatchedBefore'),unmatchedAfter:total('unmatchedAfter'),originalRoots:new Set(cohort.flatMap(c=>c.originalRoots)).size,rootReferenceOccurrences:total('rootReferenceOccurrences'),newFactRoots:0,newUnitLinks:0,independentFactsAdded:0,calculatedRelationFactsVerified:0,graphRelationNodesCreated:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.withheldAttempts!==164||summary.originalReceipts!==703||summary.originalSourceFail!==30||summary.majorCandidates!==2||summary.annualCandidatesBefore!==31||historical.length!==33||summary.unmatchedBefore!==396||summary.unmatchedAfter!==396||summary.originalRoots!==246)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'fixtures.json':cases,'source-proof.json':source,'relation-observations.json':observations,'february-links.json':links,'historical-candidate-hashes.json':historical})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
