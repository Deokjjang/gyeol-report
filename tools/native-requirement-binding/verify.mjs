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

const foundation=await ProductSpecialistFoundation.prepare(catalog),cases=[],forbidden=new Set(),gapRows=[],technicalCandidates=[],sourceInventory=[],receiptAudits=[];
const {adaptNativeRequirementBindings}=load(base+"native-requirement-binding/adapter.ts");
const {validateNativeRequirementCandidate}=load(base+"native-requirement-binding/contract.ts");
const {AnnualSpecialistIndex}=load(base+"annual-fortune-specialist-engine/candidateIndex.ts"),{MajorSpecialistIndex}=load(base+"major-fortune-specialist-engine/candidateIndex.ts");
const {validateActualSpecialistCandidate}=load(base+"actual-specialist-claim-contract/contract.ts");
const {generateV4ShadowReport}=load('src/lib/interpretation-v4/runtimeShadow.ts'),{observeActualProfiles}=load(base+'actual-evidence-graph/producers.ts'),{buildActualEvidenceGraph}=load(base+'actual-evidence-graph/engine.ts');
const indexes={major_fortune:new MajorSpecialistIndex(foundation),annual_fortune:new AnnualSpecialistIndex(foundation)};
for(const [product,index] of Object.entries(indexes))for(const row of index.candidates.values()){
 const c=row.bindingCandidate??row.candidate,proof=await resolver.proof(c.record.locator,row.originalResearchId,row.catalogKey);
 if(proof.actualHash!==c.record.locator.recordSha256)throw Error('ORIGINAL_RESEARCH_PROOF_CHANGED');
 sourceInventory.push({product,catalogKey:row.catalogKey,originalResearchId:row.originalResearchId,researchKind:row.researchKind,proof,
  originalRequirements:Object.fromEntries(Object.entries(row.original).filter(([k])=>['scope','month','god','requiredRole','requires','requiredFacts','natalRequired','elementRequired','monthlyGate','annualGate','participants','sourceObservation','window','condition','sourceRefs','counterexample','disallowed'].includes(k))),
  sourceSelectors:c.requirement.sourceRequirements.map(s=>({id:s.id,originalField:s.originalField,required:s.required,selector:s.selector})),
  requiredTemporalScope:c.requirement.requiredTemporalScope,originalMeaningIdentity:c.requirement.meaningIdentity,originalClaimIdentity:c.requirement.claimIdentity,
  unresolvedFields:c.requirement.unresolvedConditions.map(c=>c.field)});
}
const count=(rows,key)=>Object.fromEntries([...new Set(rows.map(r=>r[key]))].sort().map(k=>[k,rows.filter(r=>r[key]===k).length]));
async function consume(id,facts){
 if(!facts.ok)throw Error('REAL_CALCULATION_FAILED:'+id+':'+facts.reasons.join('|'));
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]);
 const result=await adaptNativeRequirementBindings(facts.request,facts,{resolver,foundation});
 if(!result.ok)throw Error('REAL_NATIVE_BINDING_FAILED:'+id+':'+result.reasons.join('|'));
 if(result.withheld.length)throw Error('VERIFIED_CONTRACT_WITHHELD:'+JSON.stringify(result.withheld));
 const old=result.baseline,product=facts.request.product,nativeRows=[...indexes[product].candidates.values()];
 const newCandidates=result.handoff.technicalCandidates;
 for(const c of newCandidates){
  if(!(await validateNativeRequirementCandidate(result.context,JSON.parse(JSON.stringify(c)))).ok)throw Error('NEW_CANDIDATE_REVALIDATION_FAILED');
  if(c.originalMeaningIdentity!==null||c.originalClaimIdentity!==null||c.customerUseAllowed||c.customerClaims||c.customerApprovals||c.newFactRoots)throw Error('APPROVAL_PROMOTED');
  if(c.typedNativeReceipt.selectedActualEvidence.length!==new Set(c.typedNativeReceipt.selectedActualEvidence).size)throw Error('ROOT_COUNT_INFLATED');
  technicalCandidates.push({fixture:id,candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),originalResearchId:c.originalResearchId,originalCatalogKey:c.originalCatalogKey,sourceProof:c.originalResearchProof,
   segmentPointer:c.segment.pointer,window:c.segment.window,verifiedActualUnitIds:c.verifiedActualUnitIds,
   roles:c.verifiedCalculationFacts.map(u=>({unitId:u.unitId,role:u.originLayer,nodeId:u.originalEvidenceNodeId,referenceStem:u.referenceStem,targetStem:u.targetStem,tenGod:u.calculatedTenGod,producer:u.originalProducer,sourceIdentity:u.sourceIdentity,sourceHash:u.sourceHash,sourceVersion:u.sourceVersion,primaryRoot:u.canonicalFactRoot,unitRoots:u.canonicalFactRoots,completeAncestryHash:actualSemanticDigest(u.completeAncestry)})),
   originalNativeReceiptId:c.originalNativeReceipt.receiptId,originalNativeReceiptHash:c.originalNativeReceiptHash,originalSelected:c.originalNativeReceipt.selectedActualEvidence,
   typedNativeReceiptId:c.typedNativeReceipt.receiptId,typedNativeReceiptHash:c.typedNativeReceiptHash,typedSelected:c.typedNativeReceipt.selectedActualEvidence,typedFactRoots:c.originalFactRoots,additionalReferenceRoots:c.additionalReferenceRoots,
   originalGates:c.originalNativeReceipt.allTwelveGateResults.map(g=>({gate:g.gate,state:g.state,reasons:g.reasons})),typedGates:c.allTwelveGateResults.map(g=>({gate:g.gate,state:g.state,reasons:g.reasons})),reviewStates:c.reviewStates,
   allOriginalConditionsPreserved:['sourceGroups','unresolvedConditions','requiredUserState','counterexamples','prohibitions','meaningIdentity','claimIdentity'].every(k=>actualSemanticDigest(c.typedCandidate.requirement[k])===actualSemanticDigest(c.originalCandidate.requirement[k])),customerUseAllowed:false});
 }
 const audit=old.handoff.nativeReceiptAudit;
 for(const a of audit)receiptAudits.push({fixture:id,...a});
 const historicalIds=new Set(old.handoff.candidates.flatMap(c=>c.verifiedActualUnitIds)),newIds=new Set(newCandidates.flatMap(c=>c.verifiedActualUnitIds));
 for(const u of facts.handoff.units.filter(u=>!historicalIds.has(u.unitId))){
  let primaryGap, relevant;
  const annual=product==='annual_fortune';
  if(newIds.has(u.unitId)){primaryGap='STRUCTURAL_TYPED_REQUIREMENT_MISSING_RESOLVED';relevant=nativeRows.filter(r=>r.originalResearchId==='afpr:month-slot:05');}
  else if(['MONTH_STEM','MONTH_BRANCH_MAIN'].includes(u.originLayer)){
   primaryGap='MONTHLY_GOD_ROLE_AMBIGUOUS';relevant=nativeRows.filter(r=>r.researchKind==='MONTHLY_TEN_GOD'&&r.original.god===u.definitionLabel);
   if(!relevant.length||relevant.some(r=>r.original.requiredRole!==undefined))throw Error('AMBIGUITY_CLASSIFICATION_WITHOUT_ORIGINAL_PROOF');
  }else if(u.originLayer==='ANNUAL_STEM'){
   primaryGap='ANNUAL_RESEARCH_VS_SEGMENT_SCOPE_NO_NATIVE_SELECTOR';relevant=nativeRows.filter(r=>['afpr:core:stem','afpr:core:ten-god'].includes(r.originalResearchId)||(r.researchKind==='ANNUAL_TEN_GOD'&&r.original.god===u.definitionLabel));
   if(u.temporalScope!=='month'||relevant.some(r=>(r.candidate??r.bindingCandidate).requirement.requiredTemporalScope!=='annual'))throw Error('SCOPE_GAP_WITHOUT_ACTUAL_SCOPE_MISMATCH');
  }else if(u.originLayer==='DAYUN_STEM'){
   primaryGap='DAYUN_GOD_NO_DEDICATED_NATIVE_GRAPH_FIELD';relevant=nativeRows.filter(r=>r.originalResearchId==='afpr:core:dayun');
   const n=facts.request.graph.nodes.find(n=>n.id===u.originalEvidenceNodeId);
   if(!n||n.value.component!=='dayun'||Object.hasOwn(n.value,'tenGod'))throw Error('ADDRESS_GAP_WITHOUT_ACTUAL_NODE_PROOF');
  }else if(u.originLayer==='FLOW_GOD'){
   primaryGap='FLOW_REFERENCE_NO_ORIGINAL_NATIVE_ROLE_CONTRACT';relevant=nativeRows.filter(r=>r.originalResearchId==='afpr:core:ten-god');
   if(u.referenceBasis!=='DAYUN_STEM'||!String(relevant[0]?.original.counterexample).includes('flowGod'))throw Error('FLOW_GAP_WITHOUT_SOURCE_REFERENCE_WARNING');
  }else{
   primaryGap=u.factType==='NATAL_DAY_MASTER'?'NATAL_REFERENCE_ONLY_NOT_NATIVE_SELECTED':'NATAL_CONTEXT_NOT_STANDALONE_NATIVE_SELECTION';
   relevant=annual?nativeRows.filter(r=>r.originalResearchId==='afpr:core:natal'):nativeRows.filter(r=>r.researchKind==='TEN_GOD_LONG_TERM'&&(u.calculatedTenGod===null||r.original.god===u.definitionLabel));
  }
  if(!relevant.length)throw Error('UNCLASSIFIED_OR_UNSOURCED_UNIT:'+u.unitId);
  const evidence=relevant.map(r=>audit.find(a=>a.originalCatalogKey===r.catalogKey));
  if(evidence.some(a=>!a||a.selectedEvidence.includes(u.originalEvidenceNodeId)))throw Error('FALSE_UNMATCHED_CLASSIFICATION');
  gapRows.push({fixture:id,unitId:u.unitId,factType:u.factType,originLayer:u.originLayer,nodeId:u.originalEvidenceNodeId,temporalScope:u.temporalScope,window:u.effectiveInterval,referenceBasis:u.referenceBasis,primaryGap,
   resolved:newIds.has(u.unitId),researchProofRefs:relevant.map(r=>r.catalogKey),nativeReceiptRefs:evidence.map(a=>({receiptId:a.originalNativeReceiptId,receiptHash:a.originalNativeReceiptHash,selectedUnitNode:false,matchedUnitNode:a.matchingEvidence.includes(u.originalEvidenceNodeId)})),
   note:primaryGap==='MONTHLY_GOD_ROLE_AMBIGUOUS'?'Primary gap relative to matching monthly-god research; other month-question research has separate, unevaluated requirements. This is not proof that every other research use is impossible.':null});
 }
 const roots=new Set(facts.request.graph.nodes.flatMap(n=>n.ancestry.rootIds));if(facts.handoff.units.some(u=>u.canonicalFactRoots.some(r=>!roots.has(r))))throw Error('NEW_FACT_ROOT');
 for(const c of old.handoff.candidates)if(!(await validateActualSpecialistCandidate(old.context,JSON.parse(JSON.stringify(c)))).ok)throw Error('HISTORICAL_CANDIDATE_CHANGED');
 if(before!==actualSemanticDigest([facts.request,facts.handoff,facts.native]))throw Error('ORIGINAL_DATA_MUTATION');
 const input=facts.request.graphInput.evidence.input;if(input.kind!=='compatibility')for(const k of ['name','birthDate'])forbidden.add(input.person[k]);
 cases.push({fixture:id,product,units:facts.handoff.units.length,withheldAttempts:facts.withheld.length,graphHash:actualSemanticDigest(facts.request.graph),calculationHash:actualSemanticDigest(facts.request.graphInput.evidence.calculations),factHandoffHash:actualSemanticDigest(facts.handoff),
  unitsHash:actualSemanticDigest(facts.handoff.units),roots:facts.handoff.canonicalFactRoots,rootReferences:facts.handoff.rootReferenceOccurrences,nativeDiagnosticHash:old.context.nativeDiagnosticHash,originalReceipts:old.originalReceiptsVerified,
  historicalCandidates:old.handoff.candidates.map(c=>({candidateId:c.candidateId,candidateHash:actualSemanticDigest(c),originalResearchId:c.originalResearchId,receiptId:c.originalNativeReceiptId,receiptHash:c.originalNativeReceiptHash,selected:c.selectedEvidence,roots:c.originalFactRoots,additionalReferenceRoots:c.additionalReferenceRoots,meaningIdentity:c.originalMeaningIdentity,claimIdentity:c.originalClaimIdentity,gates:c.allTwelveGateResults.map(g=>({gate:g.gate,state:g.state}))})),
  technicalCandidates:newCandidates.length,newUnitLinks:newIds.size,unmatchedBefore:facts.handoff.units.length-historicalIds.size,unmatchedAfter:facts.handoff.units.length-historicalIds.size-newIds.size,
  sourceFailBefore:facts.native.before.filter(r=>r.originalResearchId.startsWith('mfpr:god:')&&r.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length,
  sourceFailAfter:old.native.receipts.filter(r=>r.originalResearchId.startsWith('mfpr:god:')&&r.allTwelveGateResults.find(g=>g.gate==='SOURCE_INTEGRITY').state==='FAIL').length});
 process.stderr.write(id+' units='+facts.handoff.units.length+' historical='+historicalIds.size+' technical='+newCandidates.length+' new-links='+newIds.size+'\n');
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
const summary={status:'TECHNICAL_REQUIREMENT_RESOLVED_WITH_EXPLICIT_WITHHOLDS',fixtures:cases.length,verifiedUnits:cases.reduce((n,c)=>n+c.units,0),withheldAttempts:cases.reduce((n,c)=>n+c.withheldAttempts,0),originalNativeReceipts:cases.reduce((n,c)=>n+c.originalReceipts,0),
 originalRoots:new Set(cases.flatMap(c=>c.roots)).size,rootReferenceOccurrences:cases.reduce((n,c)=>n+c.rootReferences,0),newFactRoots:0,
 unmatchedBefore:gapRows.length,unmatchedAfter:gapRows.filter(r=>!r.resolved).length,primaryGapCounts:count(gapRows,'primaryGap'),historicalMajorCandidates:cases.flatMap(c=>c.historicalCandidates).length,annualCandidatesBefore:0,annualTechnicalCandidatesAfter:technicalCandidates.length,newAnnualUnitLinks:technicalCandidates.reduce((n,c)=>n+c.verifiedActualUnitIds.length,0),
 sourceFailBefore:cases.reduce((n,c)=>n+c.sourceFailBefore,0),sourceFailAfter:cases.reduce((n,c)=>n+c.sourceFailAfter,0),customerClaims:0,customerApprovals:0,customerReaderBridges:0,syntheticMeaningFileReads};
if(summary.verifiedUnits!==422||summary.originalNativeReceipts!==703||summary.unmatchedBefore!==420||summary.originalRoots!==246||summary.sourceFailBefore!==30||summary.sourceFailAfter!==30)throw Error('BASE_COHORT_CHANGED');
for(const [name,value]of Object.entries({'summary.json':summary,'cases.json':cases,'source-inventory.json':sourceInventory,'unit-gaps.json':gapRows,'technical-candidates.json':technicalCandidates,'original-receipt-audit.json':receiptAudits})){
 const text=JSON.stringify(value,null,2)+'\n';for(const term of forbidden)if(term&&text.includes(term))throw Error('PRIVATE_INPUT_IN_EXPORT');fs.writeFileSync(path.join(out,name),text);
}
process.stdout.write(JSON.stringify(summary)+'\n');
