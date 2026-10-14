/* Explicit offline entry point. No customer route imports this file.
 * Reuses the catalog SourceReader/ReferenceResolver. The small TS bootstrap is
 * local because importing the existing compile.mjs would execute compilation.
 * Only frozen repository modules and this verifier's modules may be loaded. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';
const root = process.cwd();
const folder = 'docs/validation/v4-actual-evidence-graph-01';
const implementation = 'src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/';
const json = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const config = {version:'actual-evidence-graph-v1',catalogRoot:'docs/validation/v4-knowledge-unified-catalog-01',sourceRoot:'docs/validation/v4-knowledge-source-verification-01'};

const frozen = json(`${folder}/original-file-hashes.json`);
const out = path.resolve(process.argv[2] || folder);
if (process.argv.length > 3 || out === root || out.startsWith(path.join(root, 'docs/validation/v4-knowledge-semantic-domain-verification-01')) || out.startsWith(path.join(root, config.catalogRoot)) || out.startsWith(path.join(root, config.sourceRoot)) || out.startsWith(path.join(root, 'src')) || out.startsWith(path.join(root, 'scripts'))) throw new Error('UNSAFE_OUTPUT_DIRECTORY');
if (out !== path.resolve(folder) && fs.existsSync(out) && fs.readdirSync(out).length) {
  const marker = path.join(out, 'actual-evidence-graph-manifest.json');
  if (!fs.existsSync(marker) || JSON.parse(fs.readFileSync(marker, 'utf8')).version !== config.version) throw new Error('NONEMPTY_UNRELATED_OUTPUT_DIRECTORY');
}
const ownFiles = new Set(fs.readdirSync(path.join(root, implementation)).filter(f => f.endsWith('.ts')).map(f => implementation + f));
const loadModule = createRequire(import.meta.url);
const oldLoad = Module._load;
// Same server-only boundary stub as the existing offline unit harness; no routes are loaded.
Module._load = function(name, ...args) { return name === 'server-only' ? {} : oldLoad.call(this, name, ...args); };
const oldResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return oldResolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, ...args);
};
Module._extensions['.ts'] = (m, file) => {
  const relative = path.relative(root, file);
  const bytes = fs.readFileSync(file);
  if (relative.startsWith('..') || (!ownFiles.has(relative) && (!frozen[relative] || sha(bytes) !== frozen[relative]))) throw new Error('UNREVIEWED_MODULE_OR_HASH_MISMATCH');
  m._compile(ts.transpileModule(bytes.toString('utf8').replaceAll('import.meta.url', JSON.stringify(new URL('file://' + file).href)), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, file);
};
// An unexpected network use fails closed, including non-fetch Node clients.
global.fetch = async () => { throw new Error('OFFLINE_SEMANTIC_VERIFICATION_NETWORK_DISABLED'); };
for (const name of ['node:http', 'node:https']) {
  const http = loadModule(name);
  http.request = http.get = () => { throw new Error('OFFLINE_SEMANTIC_VERIFICATION_NETWORK_DISABLED'); };
}

const semanticRoot='docs/validation/v4-knowledge-semantic-domain-verification-01';
const api=loadModule('../../'+implementation+'engine.ts'),producers=loadModule('../../'+implementation+'producers.ts'),artifacts=loadModule('../../'+implementation+'artifacts.ts');
const {EvidenceKnowledgeIndex}=loadModule('../../'+implementation+'knowledge.ts');
const {calculateCustomerDayun}=loadModule('../../src/lib/saju/customerDayun.ts');
try {
 for(const [file,expected] of Object.entries(frozen)) if(sha(fs.readFileSync(path.join(root,file)))!==expected) throw Error('BASE_INPUT_CHANGED:'+file);
 const catalog=json(config.catalogRoot+'/coverage-manifest.json'),source=json(config.sourceRoot+'/source-verification-manifest.json'),semantic=json(semanticRoot+'/semantic-domain-manifest.json');
 const inherited={researchFamilies:catalog.families.length,researchRecords:catalog.actualResearchRecords,foundationSlots:catalog.foundationSourceRecords,originalReferences:catalog.references.resolved+catalog.references.unresolved,technicallyRecovered:source.technicallyRecovered,heldReferences:source.unresolvedAfterVerification,domainQueue:semantic.domainQueueTotal,scopedProhibitions:semantic.domainExplicitProhibitions,incompleteQueue:semantic.sourceIncomplete,productPolicyReview:semantic.productPolicyReview,ancestryAudits:semantic.ancestryAudits,sourceGroups:semantic.sourceGroups,sourceGroupBlockers:semantic.inheritedSourceGroupBlockers,customerApproval:semantic.customerApproval,runtimeConnection:semantic.runtimeConnection,actualEvidenceIssuedByPriorEngine:semantic.actualEvidenceIssued};
 const expected={researchFamilies:20,researchRecords:18610,foundationSlots:4799,originalReferences:75588,technicallyRecovered:3288,heldReferences:3202,domainQueue:2966,scopedProhibitions:1040,incompleteQueue:331,productPolicyReview:2145,ancestryAudits:5104,sourceGroups:192,sourceGroupBlockers:188,customerApproval:0,runtimeConnection:0,actualEvidenceIssuedByPriorEngine:0};
 for(const [k,v] of Object.entries(expected))if(inherited[k]!==v)throw Error('INHERITED_CONTRACT_MISMATCH:'+k+':'+inherited[k]);
 const records=[...new Set(json(config.catalogRoot+'/knowledge-catalog.json').map(r=>r.shard))].flatMap(f=>json(config.catalogRoot+'/'+f));
 const knowledge=new EvidenceKnowledgeIndex({records,sourceReceipts:json(config.sourceRoot+'/source-verification-receipts.json'),decisions:json(semanticRoot+'/semantic-domain-decisions.json'),policyRules:json(semanticRoot+'/verification-config.json').rules,staticAncestry:json(semanticRoot+'/ancestor-domain-audit.json'),readFile:f=>fs.readFileSync(path.join(root,f),'utf8'),frozen:new Map(Object.entries(frozen))});
 const cases=json('tests/fixtures/six-product-integration-01/source-locks.json');
 const selected=cases.filter(c=>c.id==='A'||c.product==='compatibility'&&['marriage','parentChild','coworker','managerReport','businessPartner','friendship'].includes(c.id)||c.id==='F'&&c.product!=='compatibility').map(c=>({...c,id:c.product+'-'+c.id}));
 const clone=(product,id,label)=>{const c=structuredClone(cases.find(c=>c.product===product&&c.id===id));c.id=label;return c;};
 selected.push(clone('major','C','major-transition-C'),clone('annual','C2028','annual-transition-C2028'),clone('compatibility','F','compatibility-unknown-both'));
 const swapped=clone('compatibility','A','compatibility-slot-swap');[swapped.payload.personA,swapped.payload.personB]=[swapped.payload.personB,swapped.payload.personA];selected.push(swapped);
 const same=clone('comprehensive','A','same-natal-different-mbti');same.payload.person.mbtiType='INTJ';selected.push(same);
 const other=clone('comprehensive','B','same-mbti-different-natal');other.payload.person.mbtiType='ENFJ';selected.push(other);
 const career=clone('comprehensive','A','same-natal-career');career.payload.productKey='career_money_study';career.payload.productSlug='career-money-study';selected.push(career);
 const ranged=clone('annual','A','annual-ranged-transition');Object.assign(ranged.payload.person,{birthDate:'1999-07-31',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',gender:'MALE'});ranged.payload.productOptions.selectedYear='2027';ranged.clock.policyDate='2027-10-12T12:00:00+09:00';selected.push(ranged);
 const early=clone('annual','A','annual-before-first-dayun');Object.assign(early.payload.person,{birthDate:'1999-07-31',birthTime:'07:30',birthTimeUnknown:false,birthTimePrecision:'exact',gender:'MALE'});const dayun=calculateCustomerDayun(early.payload.person);if(!dayun.ok)throw Error('BEFORE_FIRST_FIXTURE_PRODUCER_FAILED');const firstYear=dayun.value.cycles[0].startYear;early.payload.productOptions.selectedYear=String(firstYear);early.clock.policyDate=firstYear+'-10-12T12:00:00+09:00';selected.push(early);
 const noPair=clone('compatibility','A','compatibility-no-detected-pair');for(const [slot,i]of[['personA',0],['personB',1]])Object.assign(noPair.payload[slot],{name:'가상무관계'+(i?'B':'A'),birthDate:i?'1999-03-28':'1999-03-16',birthTime:'',birthTimeUnknown:true,birthTimePrecision:'unknown',mbtiType:'',approximateBirthTimeSlot:''});selected.push(noPair);
 const {generateV4ShadowReport}=loadModule('../../src/lib/interpretation-v4/runtimeShadow.ts');
 const identities=new Map(),rawGraphs=[],forbidden=new Set(),observations=[],timings=[];const started=performance.now();
 for(const c of selected){
  const producerStart=performance.now();const generated=await generateV4ShadowReport(c.payload,c.clock);const producerGenerationMs=performance.now()-producerStart;if(generated.externalCalls.length)throw Error('UNEXPECTED_EXTERNAL_CALL');if(!generated.ok)throw Error('ACTUAL_GENERATION_FAILED:'+c.id+':'+generated.error.message);
  const evidence=generated.evidencePacket,owners={};
  for(const slot of evidence.input.kind==='compatibility'?['personA','personB']:['person']){const person=evidence.input.kind==='compatibility'?evidence.input[slot]:evidence.input.person;const identity=JSON.stringify([person.name,person.birthDate,person.birthTime,person.gender,person.birthTimePrecision]);if(!identities.has(identity))identities.set(identity,'fixture-person-'+(identities.size+1));owners[slot]=identities.get(identity);forbidden.add(person.name);forbidden.add(person.birthDate);}
  const before=sha(JSON.stringify(evidence));const profileStart=performance.now();const observed=producers.observeActualProfiles(evidence);const profileReprojectionMs=performance.now()-profileStart;if(observed.failures.length)throw Error('ACTUAL_PROFILE_PRODUCER_FAILED:'+c.id);
  const graphStart=performance.now();const built=api.buildActualEvidenceGraph({evidence,profiles:observed.profiles,context:{fixtureId:'fixture-'+c.id,synthetic:true,evaluatedAt:evidence.generatedAt,owners,catalogVersion:catalog.version??'catalog-v1',sourceVersion:source.version,semanticVersion:semantic.version}},knowledge);
  timings.push({fixtureId:'fixture-'+c.id,producerGenerationMs,profileReprojectionMs,graphMs:performance.now()-graphStart});if(!built.ok||!built.inputUnchanged||before!==sha(JSON.stringify(evidence)))throw Error('INVALID_ACTUAL_GRAPH:'+c.id+':'+JSON.stringify(built.graph.validation));
  process.stderr.write('observed '+c.id+' nodes='+built.graph.nodes.length+'\n');rawGraphs.push(built.graph);observations.push({fixtureId:'fixture-'+c.id,product:evidence.productType,relationship:built.graph.relationship,normalizedKind:evidence.input.kind,precision:Object.values(evidence.natalTableEvidence).map(t=>t.precision),profileMode:observed.mode,birthCalendarRecalculationsByGraph:0,coverage:built.graph.coverage});
 }
 const aliases=new Map([...new Set(rawGraphs.flatMap(g=>g.nodes.flatMap(n=>n.ancestry.rootIds)))].sort().map((r,i)=>[r,'fixture-root-'+(i+1)]));
 const safe=rawGraphs.map(g=>artifacts.privacySafeGraph(g,[...forbidden],aliases));
 const outputTypes={calculateSaju:'SajuCalcResult',buildCanonicalNatalTable:'CanonicalNatalTableEvidence | null',collectStructureAtoms:'readonly StructureAtom[]',adaptSupplementTable:'FoundationSupplementInput',buildIntegratedMyeongliProfile:'IntegratedProfileResult',buildMbtiSemanticProfile:'MbtiProfileResult',buildMyeongliMbtiFusion:'FusionResult',buildMyeongliMaterialPacket:'v4-material-packet-1',compatibilityNarrativeEvidence:'PairEvidence | failure',buildCompatibilityDirectionEvidence:'CompatibilityDirectionEvidence',calculateCustomerDayun:'CustomerDayun | Failure',buildMajorFortuneDecadeReading:'MajorDecadeReading',buildAnnualMonthCalendar:'readonly AnnualCalendarMonth[]',extendAnnualMonthEvidence:'AnnualMonthExtendedEvidence',normalizeReportInputPayload:'ReportInputAdapterResult<ReportGenerationInput>','V4Composition.narrative.proof':'NarrativeProof observation; no writer invoked','V4RuntimeEvidence':'Requirement/schema observation; not a calculation producer'};
 const contractMap=new Map();for(const g of rawGraphs)for(const n of g.nodes){const key=JSON.stringify(n.producer),row=contractMap.get(key)??{...n.producer,sourceSha256:frozen[n.producer.file]??null,outputType:outputTypes[n.producer.symbol]??'UNKNOWN',idContracts:[],nodeKinds:[],observedNodes:0};row.observedNodes++;if(!row.idContracts.includes(n.fact.addressability))row.idContracts.push(n.fact.addressability);if(!row.nodeKinds.includes(n.kind))row.nodeKinds.push(n.kind);row.idContracts.sort();row.nodeKinds.sort();contractMap.set(key,row);}
 artifacts.writeGraphArtifacts(out,safe,inherited,[...contractMap.values()]);
 fs.writeFileSync(path.join(out,'actual-producer-observations.json'),JSON.stringify(observations,null,2)+'\n');
 const staticLinks=[];for(const g of safe)for(const n of g.nodes)if(n.sources.length){const affected=n.sources.flatMap(s=>knowledge.staticAffected(s)).filter(a=>a.staticProhibitions.length);if(affected.length)staticLinks.push({fixtureId:g.context.fixtureId,nodeId:n.id,staticResearchReferences:affected,actualRuntimeEnforcementClaimed:false});}
 fs.writeFileSync(path.join(out,'static-actual-ancestry-comparison.json'),JSON.stringify(staticLinks,null,2)+'\n');
 const runFile=path.join(os.tmpdir(),'gyeol-actual-graph-run-'+process.pid+'.json');fs.writeFileSync(runFile,JSON.stringify({elapsedMs:performance.now()-started,fixtures:safe.length,distinctBatchRoots:aliases.size,timings,network:'disabled',finishedAt:new Date().toISOString()},null,2)+'\n');
 process.stdout.write(JSON.stringify({fixtures:safe.length,distinctBatchRoots:aliases.size,manifest:path.join(out,'actual-evidence-graph-manifest.json'),runFile})+'\n');
}catch(error){process.stderr.write(String(error)+'\n');process.exitCode=1;}
