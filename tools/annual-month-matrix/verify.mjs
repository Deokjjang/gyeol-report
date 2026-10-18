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

const foundation=await ProductSpecialistFoundation.prepare(catalog),cases=[],monthlyCoverage=[],links=[],forbidden=new Set();
const {adaptAnnualMonthMatrix}=load(base+'annual-month-matrix/adapter.ts'),{validateMatrixCandidate}=load(base+'annual-month-matrix/contract.ts');
const {AnnualSpecialistIndex}=load(base+'annual-fortune-specialist-engine/candidateIndex.ts');
const {validateActualSpecialistCandidate}=load(base+'actual-specialist-claim-contract/contract.ts'),{validateNativeRequirementCandidate}=load(base+'native-requirement-binding/contract.ts');
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const prior=json('docs/validation/v4-native-requirement-binding-resolution-01/before-after-native-links.json'),priorMay=json('docs/validation/v4-native-requirement-binding-resolution-01/annual-typed-requirement-validation.json');
const rows=[...new AnnualSpecialistIndex(foundation).candidates.values()].filter(r=>r.researchKind==='MONTH_QUESTION'),sources=[];
for(const row of rows){const proof=await resolver.proof(row.candidate.record.locator,row.originalResearchId,row.catalogKey);if(proof.actualHash!==row.candidate.record.locator.recordSha256)throw Error('MONTH_SOURCE_CHANGED');sources.push({month:row.original.month,id:row.originalResearchId,catalogKey:row.catalogKey,proof,originalRequirements:row.original.requires,previousMonthDifference:row.original.previousMonthDifference,nextMonthConnection:row.original.nextMonthConnection,counterexample:row.original.counterexample,disallowed:row.original.disallowed,originalMeaningIdentity:row.candidate.requirement.meaningIdentity,originalClaimIdentity:row.candidate.requirement.claimIdentity});}
async function consume(id,facts){
 if(!facts.ok)throw Error('ACTUAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const result=await adaptAnnualMonthMatrix(facts.request,facts,{resolver,foundation});if(!result.ok)throw Error('MATRIX_FAILED:'+id+':'+result.reasons.join('|'));
 const b=result.baseline,old=b.baseline,previous=prior.fixtures.find(c=>c.fixture===id),newCandidates=result.handoff.newMatrixCandidates;
 const graphHash=actualSemanticDigest(facts.request.graph),calculationHash=actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash=actualSemanticDigest(facts.handoff);
 if(!previous||graphHash!==previous.graphHash||calculationHash!==previous.calculationHash||factHandoffHash!==previous.factHandoffHash||old.context.nativeDiagnosticHash!==previous.nativeDiagnosticHash||old.originalReceiptsVerified!==previous.originalReceipts)throw Error('BASE_CALCULATION_OR_NATIVE_RECEIPTS_CHANGED:'+id);
 for(const c of b.handoff.historicalCandidates){if(!(await validateActualSpecialistCandidate(old.context,JSON.parse(JSON.stringify(c)))).ok||!previous.historicalCandidates.some(p=>p.candidateId===c.candidateId&&p.candidateHash===actualSemanticDigest(c)))throw Error('MAJOR_CANDIDATE_CHANGED');}
 for(const c of b.handoff.technicalCandidates){if(!(await validateNativeRequirementCandidate(b.context,JSON.parse(JSON.stringify(c)))).ok||!priorMay.candidates.some(p=>p.candidateId===c.candidateId&&p.candidateHash===actualSemanticDigest(c)))throw Error('MAY_CANDIDATE_CHANGED');}
 for(const c of newCandidates){
  if(!(await validateMatrixCandidate(result.context,JSON.parse(JSON.stringify(c)))).ok)throw Error('NEW_BINDING_REVALIDATION_FAILED');
  if(c.originalMeaningIdentity!==null||c.originalClaimIdentity!==null||c.customerClaims||c.customerApprovals||c.customerUseAllowed||c.newFactRoots)throw Error('APPROVAL_PROMOTION');
  links.push({fixture:id,month:c.month,technicalVersion:c.technicalContract.version,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),source:c.originalSourceProof,originalResearchId:c.originalResearchId,sourcePreconditions:c.sourcePreconditions,
   segmentPointer:c.segmentPointer,window:c.effectiveInterval,originalReceiptId:c.originalNativeReceipt.receiptId,originalReceiptHash:c.originalNativeReceiptHash,originalSelected:c.originalNativeReceipt.selectedActualEvidence,
   typedReceiptId:c.typedNativeReceipt.receiptId,typedReceiptHash:c.typedNativeReceiptHash,typedSelected:c.typedNativeReceipt.selectedActualEvidence,selectedGraphFacts:c.selectedGraphFacts,
   actualUnitIds:c.verifiedActualUnitIds,actualUnits:c.verifiedCalculationFacts.map(u=>({id:u.unitId,nodeId:u.originalEvidenceNodeId,origin:u.originLayer,reference:u.referenceStem,target:u.targetStem,tenGod:u.calculatedTenGod,sourceIdentity:u.sourceIdentity,sourceHash:u.sourceHash,sourceVersion:u.sourceVersion,producer:u.originalProducer,primaryRoot:u.canonicalFactRoot,roots:u.canonicalFactRoots,ancestryHash:actualSemanticDigest(u.completeAncestry)})),
   receiptRoots:c.originalFactRoots,unitRoots:c.verifiedUnitFactRoots,additionalReferenceRoots:c.additionalReferenceRoots,
   originalGates:c.originalNativeReceipt.allTwelveGateResults.map(g=>({gate:g.gate,state:g.state,reasons:g.reasons})),typedGates:c.allTwelveGateResults.map(g=>({gate:g.gate,state:g.state,reasons:g.reasons})),
   originalConditionsPreserved:['unresolvedConditions','sourceGroups','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'].every(k=>actualSemanticDigest(c.originalCandidate.requirement[k])===actualSemanticDigest(c.typedCandidate.requirement[k])),customerUseAllowed:false});
 }
 const linkedBefore=new Set([...b.handoff.historicalCandidates,...b.handoff.technicalCandidates].flatMap(c=>c.verifiedActualUnitIds)),linkedAfter=new Set([...linkedBefore,...newCandidates.flatMap(c=>c.verifiedActualUnitIds)]);
 if(old.native.version==='annual-fortune-specialist-v1'){
  const n=old.native,composition=facts.request.graphInput.evidence.composition;if(composition.product!=='annual_fortune')throw Error('ANNUAL_REQUIRED');const e=composition.result.evidence;
  for(const m of n.observation.months){
   const segments=n.observation.segments.filter(s=>s.contract.month===m.civilMonth),p=n.observation.segments.filter(s=>s.contract.month===m.civilMonth-1).at(-1),next=n.observation.segments.find(s=>s.contract.month===m.civilMonth+1),source=rows.find(r=>r.original.month===m.civilMonth),receipt=n.receipts.find(r=>r.candidateCatalogKey===source.catalogKey);
   monthlyCoverage.push({fixture:id,month:m.civilMonth,sourceId:source.originalResearchId,catalogKey:source.catalogKey,originalReceiptId:receipt.receiptId,originalReceiptHash:actualSemanticDigest(receipt),originalSelected:receipt.selectedActualEvidence,
    civilBounds:m.calendarBounds,previousLastPointer:p?.originalPointer??null,nextFirstPointer:next?.originalPointer??null,nextYearSegmentAvailable:false,readingInstant:e.clock.currentDate,focusPointers:segments.filter(s=>s.contract.focus).map(s=>s.originalPointer),unselectedSegmentPointers:segments.filter(s=>!s.contract.focus).map(s=>s.originalPointer),
    actualContextTimestampProvided:Object.hasOwn(facts.request.actualUserState,'timestamp'),originalSceneHypothetical:source.original.scene?.hypothetical===true,sourceSceneIsCustomerHistory:source.original.scene?.isCustomerHistory===true,
    annualStemRelationsPresent:e.annualStemRelations.length,annualRelationParticipantStems:e.annualStemRelations.map(r=>({natal:r.natalStem,annual:r.annualStem,position:r.position})),
    segments:segments.map(s=>({pointer:s.originalPointer,recordHash:s.recordHash,window:s.contract.window,componentNodeIds:s.contract.componentNodeIds,boundaryNodeId:s.contract.boundaryNodeId,producerVersion:s.sourceVersion,
     monthPillar:s.raw.monthPillar,effectiveAnnualPillar:s.raw.effectiveAnnualPillar,activeDayunContext:s.raw.activeDayunContext,boundaryReasons:s.raw.boundaryReason,relationIds:s.raw.relationFacts.map(r=>r.id),
     graphRelationNodes:s.nodes.filter(n=>n.fact.observationPointer.includes('/relationFacts/')).map(n=>({id:n.id,pointer:n.fact.observationPointer,producer:n.producer,participants:n.participants,roots:n.ancestry.rootIds,complete:n.ancestry.complete,status:n.status})),
     verifiedUnitOrigins:facts.handoff.units.filter(u=>u.effectiveInterval?.start===s.raw.startKst&&u.effectiveInterval.endExclusive===s.raw.endKstExclusive).map(u=>({id:u.unitId,origin:u.originLayer,node:u.originalEvidenceNodeId})),
     componentFactProofs:[s.contract.boundaryNodeId,...Object.values(s.contract.componentNodeIds)].map(id=>{const v=facts.request.graph.nodes.find(n=>n.id===id);return {id,kind:v.kind,producer:v.producer,owner:v.owner,window:v.temporal,roots:v.ancestry.rootIds,complete:v.ancestry.complete,missingAncestors:v.ancestry.missingIds,status:v.status};})})),
    newBindings:newCandidates.filter(c=>c.month===m.civilMonth).map(c=>c.candidateId),withholds:result.withheld.filter(w=>w.month===m.civilMonth)});
  }
  const ambiguous=n.diagnostics.filter(d=>d.researchKind==='MONTHLY_TEN_GOD');if(ambiguous.length!==10||ambiguous.some(d=>d.receipt.selectedActualEvidence.length||d.monthMatches.some(m=>m.god?.role!=='AMBIGUOUS'||m.god.matched)))throw Error('AMBIGUOUS_ROLE_PROMOTED');
 }
 const roots=facts.handoff.canonicalFactRoots;
 if(newCandidates.some(c=>c.originalFactRoots.some(r=>!roots.includes(r)))||before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('NEW_ROOT_OR_MUTATION');
 const input=facts.request.graphInput.evidence.input;if(input.kind!=='compatibility')for(const key of ['name','birthDate'])forbidden.add(input.person[key]);
 cases.push({fixture:id,product:facts.request.product,verifiedUnits:facts.handoff.units.length,withheldAttempts:facts.withheld.length,graphHash,calculationHash,factHandoffHash,nativeDiagnosticHash:old.context.nativeDiagnosticHash,originalReceipts:old.originalReceiptsVerified,
  originalRoots:roots,rootReferenceOccurrences:facts.handoff.rootReferenceOccurrences,oldMajorCandidates:b.handoff.historicalCandidates.length,oldMayCandidates:b.handoff.technicalCandidates.length,
  oldCandidateIds:[...b.handoff.historicalCandidates,...b.handoff.technicalCandidates].map(c=>c.candidateId),newCandidates:newCandidates.length,newByMonth:Object.fromEntries([7,12].map(m=>[m,newCandidates.filter(c=>c.month===m).length])),
  unmatchedBefore:facts.handoff.units.length-linkedBefore.size,unmatchedAfter:facts.handoff.units.length-linkedAfter.size,newUnitLinks:linkedAfter.size-linkedBefore.size,withholds:result.withheld,
  originalSourceFail:old.native.receipts.filter(r=>r.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,allBaseDigestsEqual:true,mayAndMajorCandidateHashesEqual:true});
 process.stderr.write(id+' new='+newCandidates.length+' new-links='+(linkedAfter.size-linkedBefore.size)+' held='+result.withheld.length+'\n');
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
const total=key=>cases.reduce((n,c)=>n+c[key],0),summary={fixtures:cases.length,verifiedUnits:total('verifiedUnits'),withheldAttempts:total('withheldAttempts'),originalReceipts:total('originalReceipts'),originalSourceFail:total('originalSourceFail'),oldMajorCandidates:total('oldMajorCandidates'),oldMayCandidates:total('oldMayCandidates'),newMatrixCandidates:total('newCandidates'),annualCandidatesBefore:total('oldMayCandidates'),annualCandidatesAfter:total('oldMayCandidates')+total('newCandidates'),unmatchedBefore:total('unmatchedBefore'),unmatchedAfter:total('unmatchedAfter'),newUnitLinks:total('newUnitLinks'),originalRoots:new Set(cases.flatMap(c=>c.originalRoots)).size,rootReferenceOccurrences:total('rootReferenceOccurrences'),newFactRoots:0,customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.withheldAttempts!==164||summary.originalReceipts!==703||summary.originalSourceFail!==30||summary.oldMajorCandidates!==2||summary.oldMayCandidates!==8||summary.unmatchedBefore!==404||summary.originalRoots!==246)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'fixtures.json':cases,'source-proofs.json':sources,'month-observations.json':monthlyCoverage,'new-links.json':links})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
