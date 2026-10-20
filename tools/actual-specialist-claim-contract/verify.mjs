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
const {actualSemanticDigest,validateActualCalculatedUnit}=load(base+'actual-calculation-semantic-bridge/units.ts');
const {bindKnowledgeCandidate}=load(base+'knowledge-binder/engine.ts'),{ActualBindingIndex}=load(base+'knowledge-binder/matching.ts');
const foundation=await ProductSpecialistFoundation.prepare(catalog),cases=[],sourceFailures=[],forbidden=new Set(),specialistCases=[];
const {adaptActualSpecialistClaims}=load(base+"full-product-integration/actualSpecialistAdapter.ts");
const {validateActualSpecialistCandidate}=load(base+"actual-specialist-claim-contract/contract.ts");
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
async function consume(id,result){
 if(!result.ok||!result.handoff.units.length)throw Error('VERIFIED_ACTUAL_UNITS_REQUIRED:'+id+':'+JSON.stringify(result.reasons));
 const h=result.handoff;
 const claims=await adaptActualSpecialistClaims(result.request,result,{resolver,foundation});
 if(!claims.ok)throw Error('ACTUAL_SPECIALIST_DIAGNOSE_FAILED:'+id+':'+claims.reasons.join('|'));
 for(const candidate of claims.handoff.candidates){
  if(!(await validateActualSpecialistCandidate(claims.context,JSON.parse(JSON.stringify(candidate)))).ok)throw Error('SPECIALIST_CANDIDATE_REVALIDATION_FAILED');
  if(candidate.customerUseAllowed||candidate.customerClaims||candidate.newFactRoots||candidate.originalClaimIdentity!==candidate.originalNativeReceipt.claimIdentity||candidate.originalMeaningIdentity!==candidate.originalNativeReceipt.meaningIdentity)throw Error('CLAIM_IDENTITY_OR_APPROVAL_PROMOTED');
 }
 specialistCases.push({fixture:id,engine:result.request.product==='major_fortune'?'MajorFortuneSpecialistEngine':'AnnualFortuneSpecialistEngine',nativeDiagnosticHash:claims.context.nativeDiagnosticHash,originalReceiptsVerified:claims.originalReceiptsVerified,unitsConsumed:h.units.length,withheldFactAttempts:result.withheld.length,handoff:claims.handoff,withheld:claims.withheld});
 process.stderr.write('specialist '+id+' receipts='+claims.originalReceiptsVerified+' candidates='+claims.handoff.candidates.length+' unmatched='+claims.handoff.unitStates.filter(u=>u.nativeState==='UNMATCHED_NATIVE_EVIDENCE').length+'\n');
 for(const unit of h.units){
  if(unit.evidenceKind!=='VERIFIED_CALCULATED_FACT'||unit.customerApproved||unit.newIndependentFacts||unit.customerClaims)throw Error('FACT_APPROVAL_OR_ROOT_PROMOTION');
  const roots=new Set(result.request.graph.nodes.flatMap(n=>n.ancestry.rootIds));if(unit.canonicalFactRoots.some(r=>!roots.has(r)))throw Error('NEW_ROOT_CREATED');
 }
 for(const origin of ['NATAL_STEM','DAYUN_STEM','ANNUAL_STEM','MONTH_STEM','MONTH_BRANCH_MAIN','FLOW_GOD']){
  const unit=h.units.find(u=>u.originLayer===origin);if(unit&&!((await validateActualCalculatedUnit(result.context,JSON.parse(JSON.stringify(unit)))).ok))throw Error('UNIT_REVALIDATION_OR_DETERMINISM_FAILED');
 }
 if(result.request.product==='major_fortune'){
  const index=new ActualBindingIndex(result.request,catalog);
  for(const receipt of result.native.before)if(receipt.originalResearchId.startsWith('mfpr:god:')){
   const c=catalog.candidates.get(receipt.candidateCatalogKey),after=bindKnowledgeCandidate(c,index,catalog);
   if(actualSemanticDigest(receipt)!==actualSemanticDigest(after))throw Error('TWELVE_GATES_CHANGED');
   const gate=after.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY');if(gate.state!=='FAIL')throw Error('SOURCE_GATE_PROMOTED');
   sourceFailures.push({fixture:id,originalId:receipt.originalResearchId,sourceGate:gate,allTwelveGatesUnchanged:true,beforeReceiptHash:actualSemanticDigest(receipt),afterReceiptHash:actualSemanticDigest(after)});
  }
 }
 const input=result.request.graphInput.evidence.input;if(input.kind!=='compatibility')for(const k of ['name','birthDate'])forbidden.add(input.person[k]);
 cases.push({fixture:id,graphHash:actualSemanticDigest(result.request.graph),calculationHash:actualSemanticDigest(result.request.graphInput.evidence.calculations),handoffHash:actualSemanticDigest(h),units:h.units,withheld:result.withheld,meaningLinks:h.conditionalMeaningLinks,roots:h.canonicalFactRoots,rootReferenceOccurrences:h.rootReferenceOccurrences,nativeEvidenceLinks:h.nativeEvidenceLinks,nativeCustomerClaims:result.native.customerClaimsEmitted,graphUnchanged:result.originalGraphAndPacketUnchanged});
 process.stderr.write('actual '+id+' units='+h.units.length+' withheld='+result.withheld.length+'\n');
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
const units=cases.flatMap(c=>c.units),held=cases.flatMap(c=>c.withheld),byOrigin={};
for(const origin of ['NATAL_STEM','DAYUN_STEM','ANNUAL_STEM','MONTH_STEM','MONTH_BRANCH_MAIN','FLOW_GOD'])byOrigin[origin]={verified:units.filter(u=>u.originLayer===origin).length,withheld:held.filter(u=>u.originLayer===origin).length};
if(sourceFailures.length!==30||new Set(units.map(u=>u.unitId)).size!==units.length)throw Error('COHORT_OR_UNIT_ID_COLLISION');
const summary={status:'IMPLEMENTED_WITH_EXPLICIT_WITHHOLDS',actualFixtures:7,registeredFixtures:6,existingRangeRecipe:1,verifiedFactUnits:units.length,unverifiedUnitsIssued:0,withheldAttempts:held.length,byOrigin,dayMasterUnits:units.filter(u=>u.factType==='NATAL_DAY_MASTER').length,originalRootsDistinct:new Set(units.flatMap(u=>u.canonicalFactRoots)).size,rootReferenceOccurrences:units.reduce((n,u)=>n+u.canonicalFactRoots.length,0),newIndependentFacts:0,sourceIntegrityFailBefore:30,sourceIntegrityFailAfter:30,customerClaims:0,customerReaderBridge:0,customerApprovals:0,syntheticMeaningDefinitionsUsed:0,syntheticMeaningFileReads,conditionalReviewsRemainPending:true,meaningLinkCounts:{scoped:cases.flatMap(c=>c.meaningLinks).filter(l=>l.technicalLinkage==='SCOPED_CALCULATION_LINK_VERIFIED').length,withheld:cases.flatMap(c=>c.meaningLinks).filter(l=>l.technicalLinkage==='WITHHELD').length,notApplicable:cases.flatMap(c=>c.meaningLinks).filter(l=>l.technicalLinkage==='NOT_APPLICABLE').length}};
const candidates=specialistCases.flatMap(c=>c.handoff.candidates);if(!candidates.length)throw Error('BLOCKED_NO_NATIVE_RECEIPT_LINKED_CANDIDATE');
Object.assign(summary,{nativeSpecialistEngines:[...new Set(specialistCases.map(c=>c.engine))],originalReceiptsVerified:specialistCases.reduce((n,c)=>n+c.originalReceiptsVerified,0),specialistCandidates:candidates.length,specialistCandidatesWithheld:candidates.filter(c=>!c.customerUseAllowed).length,nativeUnitReceiptLinks:candidates.reduce((n,c)=>n+c.verifiedActualUnitIds.length,0),unmatchedNativeUnits:specialistCases.flatMap(c=>c.handoff.unitStates).filter(u=>u.nativeState==='UNMATCHED_NATIVE_EVIDENCE').length,states:Object.fromEntries(['SOURCE_HELD','MEANING_REVIEW_REQUIRED','CONTEXT_REQUIRED','PRODUCT_REVIEW_REQUIRED','APPROVAL_PENDING'].map(state=>[state,candidates.filter(c=>c.actualReviewStates.includes(state)).length]))});
for(const[name,value]of Object.entries({'actual-units.json':cases,'source-failures.json':sourceFailures,'specialist-candidates.json':specialistCases,'summary.json':summary})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_FIXTURE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
