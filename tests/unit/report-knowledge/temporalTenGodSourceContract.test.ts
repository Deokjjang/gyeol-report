import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import locks from "../../fixtures/six-product-integration-01/source-locks.json";
import { SourceReader, hash, recordHash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver, TEMPORAL_DEFINITION_IDS } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { verifyTemporalTenGodCalculation, bindTemporalTenGodSource, type TenGodApplicationRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodEvidence";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { bindKnowledgeCandidate } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/engine";
import { ActualBindingIndex } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/matching";
import { buildActualEvidenceGraph } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/engine";
import { observeActualProfiles } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/producers";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import type { V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import type { KnowledgeBindingRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types";
import type { KnowledgeCatalogRecord, KnowledgeReferenceEdge, CatalogConfig } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import type { SemanticInputs, SemanticConfig, SemanticDomainDecision } from "@/lib/report-knowledge/knowledge-integration-foundation/semantic-domain-verification/types";
import type { VerificationConfig, VerificationReceipt } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/types";
const json = <T,>(f: string): T => JSON.parse(readFileSync(f, "utf8"));
const cr = "docs/validation/v4-knowledge-unified-catalog-01", sr = "docs/validation/v4-knowledge-source-verification-01", sd = "docs/validation/v4-knowledge-semantic-domain-verification-01";
const cc = json<CatalogConfig>(cr + "/compiler-config.json"), sv = json<VerificationConfig>(sr + "/verification-config.json"), config = json<SemanticConfig>(sd + "/verification-config.json");
const records = [...new Set(json<{shard:string}[]>(cr + "/knowledge-catalog.json").map(r => r.shard))].flatMap(f => json<KnowledgeCatalogRecord[]>(cr + "/" + f));
const edges = json<{shard:string}[]>(cr + "/knowledge-edges.json").flatMap(r => json<KnowledgeReferenceEdge[]>(cr + "/" + r.shard));
const frozen = new Map(Object.entries(json<Record<string,string>>("docs/validation/v4-global-source-domain-resolution-01/original-file-hashes.json")));
const receipts = json<VerificationReceipt[]>(sr + "/source-verification-receipts.json"), unresolved = json<KnowledgeReferenceEdge[]>(cr + "/unresolved-references.json");
const reader = new SourceReader(process.cwd(), async f => import(/* @vite-ignore */pathToFileURL(f).href), [...cc.knownSourceVersions, sv.baseSha, config.baseSha]);
const native = new SourceVerificationEngine(reader, records, edges, sv, cc, frozen);
const resolver = new TemporalTenGodSourceResolver(reader, records, frozen, native, unresolved);
const input: SemanticInputs = { records, edges, sourceReceipts: receipts, domainQueue:json(sr+"/domain-review-queue.json"), sourceGroups:json(sr+"/source-group-review.json"), directReviews:json(sd+"/direct-meaning-reviews.json"), config, frozen };
const decisions = json<SemanticDomainDecision[]>(sd+"/semantic-domain-decisions.json");
const catalog = new KnowledgeBinderCatalog(reader,input,{ records,sourceReceipts:receipts,decisions,policyRules:config.rules,staticAncestry:json(sd+"/ancestor-domain-audit.json"),readFile:f=>readFileSync(f,"utf8"),frozen },decisions);
const originalRecords = Object.keys(TEMPORAL_DEFINITION_IDS).map(god=>records.find(r=>r.originalId===`tr:god:${god}`)!);
const requests = new Map<string,KnowledgeBindingRequest>();
beforeAll(async()=>{
 await catalog.prepare();
 for(const [product,id] of [["major","A"],["major","F"],["major","C"],["annual","A"],["annual","F"],["annual","C2028"]]){
  const f=locks.find(f=>f.product===product&&f.id===id)!;const generated=await generateV4ShadowReport(f.payload,f.clock);
  if(!generated.ok)throw Error("REAL_OFFLINE_FIXTURE_REQUIRED");
  const evidence=generated.evidencePacket as V4RuntimeEvidence, profiles=observeActualProfiles(evidence);
  const graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:`fixture-${product}-${id}`,synthetic:true as const,evaluatedAt:evidence.generatedAt,owners:{person:"fixture-owner"},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
  const built=buildActualEvidenceGraph(graphInput,catalog.evidence);expect(built.ok).toBe(true);
  requests.set(`${product}/${id}`,{graph:built.graph,graphInput,product:built.graph.product,relationship:null,contexts:[],actualUserState:{}});
 }
},180000);
it.each(originalRecords)("verifies exact original/definition identity without temporal approval: $originalId",async record=>{
 const result=await resolver.temporalContract(record);expect(result.sourceResolved,result.blockingReasons.join()).toBe(true);
 expect(result.originalRecordHash).toBe(record.locator.recordSha256);expect(result.originalSourceVersion).toBe(record.locator.sourceVersion);
 expect(result.traditionalDefinition.exactDefinitionSource).toMatchObject({expectedHash:result.traditionalDefinition.sourceHash,actualHash:result.traditionalDefinition.sourceHash});
 expect(result.traditionalReference.kind).toBe("NATURAL_LANGUAGE_SUMMARY_NOT_SOURCE_ID");
 expect(result).toMatchObject({sourceUnresolved:true,customerApproved:false,establishesPersonalEvidence:false,newIndependentFacts:0,conditionalApplication:{state:"UNVERIFIED_SOURCE",meaningReview:"MEANING_REVIEW_REQUIRED"}});
});
it.each(["originalId","sourceVersion","recordSha256","file"])("blocks altered exact record %s",async field=>{
 const record=structuredClone(originalRecords[0]);
 if(field==="originalId")record.originalId+="2";else Object.assign(record.locator,{[field]:"invalid"});
 expect((await resolver.temporalContract(record)).sourceResolved).toBe(false);
});
it("does not search by a similar label or manufacture an original ID",async()=>{
 const record={...originalRecords[0],originalId:"tr:god:비견과비슷함"};expect((await resolver.temporalContract(record)).sourceResolved).toBe(false);
});
it.each(["src/lib/report-knowledge/sajuFoundationKnowledge.ts","src/lib/report-knowledge/temporal-interaction-research/temporalGodRoles.ts","src/lib/report-knowledge/temporal-interaction-research/sajuFoundationTemporalSources.ts"])("withholds changed or absent frozen source %s",async file=>{
 for(const mismatch of [true,false]){const map=new Map(frozen);if(mismatch)map.set(file,"0".repeat(64));else map.delete(file);const r=new TemporalTenGodSourceResolver(reader,records,map,native,unresolved);expect((await r.temporalContract(originalRecords[0])).sourceResolved).toBe(false);}
});
it("preserves every original unresolved traditionalRef receipt",async()=>{
 for(const receipt of receipts.filter(r=>r.originalResearchId.startsWith("tr:god:")&&r.referenceField==="/traditionalRef/0")){
  const result=await resolver.resolve(receipt);expect(result.newTechnicalAssessment).not.toBe("PROVEN_TECHNICAL_RESOLUTION");expect(result.originalTarget).toBe(receipt.originalTarget);expect(result.temporalTenGod?.sourceResolved).toBe(true);
 }
});
function monthRequest(key="annual/A"){
 const request=requests.get(key)!;const c=request.graphInput.evidence.composition;if(c.product!=="annual_fortune")throw Error("ANNUAL_REQUIRED");
 const n=request.graph.nodes.find(n=>n.kind==="CALCULATED_PERIOD_FACT"&&n.fact.observationPointer.endsWith("/evidenceIds/3"))!;
 const m=/calendarMonths\/(\d+)\/segments\/(\d+)/.exec(n.fact.observationPointer)!;const s=c.result.evidence.raw.calendarMonths![+m[1]].segments[+m[2]];
 const spec:TenGodApplicationRequest={nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"MONTH_STEM",god:s.stemTenGod,referenceStem:c.result.evidence.raw.dayMaster,targetStem:s.monthPillar.stem,window:n.temporal};return {request,spec,n,s};
}
it("verifies the existing monthly stem value and keeps its exact interval and roots",()=>{
 const {request,spec,n}=monthRequest(),result=verifyTemporalTenGodCalculation(resolver,request,spec);
 expect(result.actualCalculation,result.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");expect(result.temporalScopeValid).toBe(true);
 expect(result.canonicalFactRoots).toEqual([...new Set(n.ancestry.rootIds)].sort());expect(result.effectiveInterval).toEqual(n.temporal);expect(result.status).toBe("WITHHELD");
});
it.each(["owner","direction","reference","target","god","origin"])("blocks incorrect monthly %s",variant=>{
 const {request,spec}=monthRequest();
 if(variant==="owner")spec.owner="other";if(variant==="direction")spec.direction="A_TO_B";if(variant==="reference")spec.referenceStem="invalid";if(variant==="target")spec.targetStem="invalid";if(variant==="god")spec.god="invalid";if(variant==="origin")spec.origin="NATAL_STEM";
 expect(verifyTemporalTenGodCalculation(resolver,request,spec).actualCalculation).toBe("UNVERIFIED_CALCULATION");
});
it.each(["root","parent","producer","version","value","certainty"])("blocks graph tampering: %s",variant=>{
 const original=monthRequest(),request=structuredClone(original.request),spec=structuredClone(original.spec),n=request.graph.nodes.find(n=>n.id===spec.nodeId)!;
 if(variant==="root")n.ancestry.rootIds=["aeg:root:forged"];if(variant==="parent")n.ancestry.parentIds.push("missing");if(variant==="producer")n.producer.file="package.json";if(variant==="version")n.producer.version="invented";if(variant==="value")n.value={};if(variant==="certainty")n.temporal!.certainty="conditional";
 expect(verifyTemporalTenGodCalculation(resolver,request,spec).actualCalculation).toBe("UNVERIFIED_CALCULATION");
});
it("blocks changed calculation source bytes",()=>{
 const {request,spec}=monthRequest(),map=new Map(frozen);map.set("src/lib/report-knowledge/annualMonthJie.ts","0".repeat(64));
 const r=new TemporalTenGodSourceResolver(reader,records,map,native,unresolved);expect(verifyTemporalTenGodCalculation(r,request,spec).reasons).toContain("CALCULATION_SOURCE_HASH_MISMATCH");
});
it.each(["widen","end-exclusive","unknown","conditional","wrong-scope"])("does not widen a segment: %s",variant=>{
 const {request,spec,n}=monthRequest();spec.window={...n.temporal!};
 if(variant==="widen"){spec.window.start="2026-01-01T00:00:00+09:00";spec.window.endExclusive="2027-01-01T00:00:00+09:00";}
 if(variant==="end-exclusive")spec.window.start=spec.window.endExclusive;
 if(variant==="unknown")spec.window.start=null;if(variant==="conditional")spec.window.certainty="conditional";if(variant==="wrong-scope")spec.window.scope="annual";
 const result=verifyTemporalTenGodCalculation(resolver,request,spec);expect(result.actualCalculation).toBe("ACTUAL_CALCULATION_VERIFIED");expect(result.temporalScopeValid).toBe(false);
});
it("keeps the unknown-hour fixture unknown and never creates an hour observation",()=>{
 for(const key of ["annual/F","major/F"]){const r=requests.get(key)!;expect(r.graph.nodes.some(n=>n.producer.symbol==="collectStructureAtoms"&&n.participants.some(p=>p.position==="hour"))).toBe(false);}
});
it("does not promote partial major annual endpoints into a whole-year interval",()=>{
 const request=requests.get("major/A")!,c=request.graphInput.evidence.composition;if(c.product!=="major_fortune")throw Error("MAJOR_REQUIRED");
 const n=request.graph.nodes.find(n=>n.fact.observationPointer==="/composition/result/evidence/years/0/annual/evidenceIds/1")!,y=c.result.evidence.years[0];
 const r=verifyTemporalTenGodCalculation(resolver,request,{nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"ANNUAL_STEM",god:y.annual.tenGod,referenceStem:c.result.evidence.calculation.dayMaster,targetStem:y.annual.ganji[0],window:n.temporal});
 expect(r.actualCalculation,r.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");expect(r.temporalScopeValid).toBe(false);expect(r.effectiveInterval?.start).toBeNull();expect(r.effectiveAnnualPillar).toBeNull();expect(r.nominalAnnualPillar).toBe(y.annual.ganji);
});
it("preserves all thirty native source failures and all twelve hard gates",async()=>{
 let count=0;
 for(const key of ["major/A","major/F","major/C"]){const request=requests.get(key)!,index=new ActualBindingIndex(request,catalog),n=request.graph.nodes.find(n=>n.producer.symbol==="calculateCustomerDayun"&&(n.value as {tenGod?:string}).tenGod)!;const v=n.value as {tenGod:string;ganji:string;cycleIndex:number};
  for(const candidate of catalog.candidates.values())if(candidate.record.locator.file.endsWith("major-fortune-product-research/tenGodResearch.ts")){
   const before=bindKnowledgeCandidate(candidate,index,catalog),after=await bindTemporalTenGodSource(resolver,candidate,request,catalog,{nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"DAYUN_STEM",god:v.tenGod,referenceStem:request.graphInput.evidence.calculations.person!.dayMaster,targetStem:v.ganji[0],cycleIndex:v.cycleIndex,window:n.temporal});
   expect(after.originalBindingReceipt).toEqual(before);expect(before.allTwelveGateResults.find(g=>g.gate==="SOURCE_INTEGRITY")?.state).toBe("FAIL");expect(after.customerApproved).toBe(false);expect(after.customerClaims).toBe(0);expect(after.source?.sourceResolved).toBe(true);expect(after.inheritedSourceProof?.sourceVersion).toBe("565c4613d4e01d65510380e0f597c535f81396c0");expect(after.inheritedSourceProof?.expectedHash).toBe(after.source?.originalRecordHash);count++;
  }
 }expect(count).toBe(30);
},60000);
it("keeps exact major transition and fourteen-year structure",()=>{
 const r=requests.get("major/C")!.graphInput.evidence.composition;if(r.product!=="major_fortune")throw Error("MAJOR_REQUIRED");
 expect(r.result.evidence.years).toHaveLength(14);expect(r.result.evidence.horizon.transitions.some(t=>t.startSolarKst==="2028-04-23T21:42:00+09:00")).toBe(true);
});
it("repeated verification is deterministic and does not issue roots",()=>{
 const {request,spec}=monthRequest();const before=JSON.stringify(request);const a=verifyTemporalTenGodCalculation(resolver,request,spec),b=verifyTemporalTenGodCalculation(resolver,request,spec);expect(a).toEqual(b);expect(JSON.stringify(request)).toBe(before);expect(a.newIndependentFacts).toBe(0);
});
it("the original research files still match their catalog file hashes",()=>{
 for(const file of [originalRecords[0].locator.file,"src/lib/report-knowledge/major-fortune-product-research/tenGodResearch.ts"]){expect(hash(readFileSync(file))).toBe(frozen.get(file));}
 expect(originalRecords.every(r=>Boolean(r.locator.recordSha256)&&Boolean(r.locator.sourceVersion))).toBe(true);expect(recordHash(TEMPORAL_DEFINITION_IDS)).toHaveLength(64);
});

it("verifies native natal encoding without treating it as temporal evidence",()=>{
 const request=requests.get("major/A")!,n=request.graph.nodes.find(n=>n.producer.symbol==="collectStructureAtoms"&&(n.value as {location?:string}).location==="visible")!;
 const v=n.value as {god:string;stem:string};const spec:TenGodApplicationRequest={nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"NATAL_STEM",god:v.god,referenceStem:request.graphInput.evidence.calculations.person!.dayMaster,targetStem:v.stem,window:null};
 const r=verifyTemporalTenGodCalculation(resolver,request,spec);expect(r.actualCalculation,r.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");expect(r.temporalScopeValid).toBe(true);expect(r.calculatedTenGod).toBe(v.god);
 expect(verifyTemporalTenGodCalculation(resolver,request,{...spec,origin:"DAYUN_STEM"}).actualCalculation).toBe("UNVERIFIED_CALCULATION");
});
function crossSpec(key="annual/A"){
 const {request,n,s}=monthRequest(key),c=request.graphInput.evidence.composition;if(c.product!=="annual_fortune")throw Error("ANNUAL_REQUIRED");
 const p=c.result.evidence.crossPeriods.find(p=>Date.parse(p.startKst)<=Date.parse(s.startKst)&&Date.parse(p.endKstExclusive)>=Date.parse(s.endKstExclusive))!;
 const node=request.graph.nodes.find(x=>x.fact.observationPointer===n.fact.observationPointer.replace("/evidenceIds/3","/evidenceIds/2"))!;
 const x=p.cycles[0];const spec:TenGodApplicationRequest={nodeId:node.id,owner:node.owner.fixtureOwnerId,origin:"FLOW_GOD",god:x.flowGod,referenceStem:x.cycle.stem,targetStem:s.effectiveAnnualPillar.stem,cycleIndex:x.cycle.index,window:node.temporal};return {request,p,n:node,x,spec};
}
it("preserves flowGod's cycle-stem reference and existing shared roots",()=>{
 const {request,x,spec}=crossSpec(),flow=verifyTemporalTenGodCalculation(resolver,request,spec),dayun=verifyTemporalTenGodCalculation(resolver,request,{...spec,origin:"DAYUN_STEM",god:x.god,referenceStem:request.graphInput.evidence.calculations.person!.dayMaster,targetStem:x.cycle.stem});
 expect(flow.actualCalculation,flow.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");expect(dayun.actualCalculation,dayun.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");
 expect(flow.referenceBasis).toBe("DAYUN_STEM");expect(dayun.referenceBasis).toBe("NATAL_DAY_MASTER");expect(flow.canonicalFactRoots).not.toEqual(dayun.canonicalFactRoots);
 const existingRoots=new Set(request.graph.nodes.flatMap(n=>n.ancestry.rootIds));expect([...flow.canonicalFactRoots,...dayun.canonicalFactRoots].every(id=>existingRoots.has(id))).toBe(true);expect(flow.newIndependentFacts+dayun.newIndependentFacts).toBe(0);
 expect(verifyTemporalTenGodCalculation(resolver,request,{...spec,referenceStem:"invalid-natal-reference"}).actualCalculation).toBe("UNVERIFIED_CALCULATION");
});
it("uses effective annual pillars on both sides of Lichun",()=>{
 const request=requests.get("annual/A")!,c=request.graphInput.evidence.composition;if(c.product!=="annual_fortune")throw Error("ANNUAL_REQUIRED");
 const segments=c.result.evidence.raw.calendarMonths![1].segments;expect(new Set(segments.map(s=>s.effectiveAnnualPillar.stem+s.effectiveAnnualPillar.branch)).size).toBe(2);
 for(const s of segments){const p=c.result.evidence.crossPeriods.find(p=>Date.parse(p.startKst)<=Date.parse(s.startKst)&&Date.parse(p.endKstExclusive)>=Date.parse(s.endKstExclusive))!;
  const n=request.graph.nodes.find(n=>n.fact.observationPointer.endsWith("/evidenceIds/1")&&n.temporal?.start===s.startKst&&n.temporal.endExclusive===s.endKstExclusive)!;
  const r=verifyTemporalTenGodCalculation(resolver,request,{nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"ANNUAL_STEM",god:p.annualGod,referenceStem:c.result.evidence.raw.dayMaster,targetStem:s.effectiveAnnualPillar.stem,window:n.temporal});expect(r.actualCalculation,r.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");expect(r.effectiveAnnualPillar).toBe(s.effectiveAnnualPillar.stem+s.effectiveAnnualPillar.branch);
 }
});
it("keeps the two exact 2028 transition-side contexts separate",()=>{
 const request=requests.get("annual/C2028")!,c=request.graphInput.evidence.composition;if(c.product!=="annual_fortune")throw Error("ANNUAL_REQUIRED");
 const segments=c.result.evidence.raw.calendarMonths![3].segments;expect(segments.some(s=>s.startKst==="2028-04-23T21:42:00+09:00")).toBe(true);
 const roots=new Set<string>();
 for(const s of segments){const p=c.result.evidence.crossPeriods.find(p=>Date.parse(p.startKst)<=Date.parse(s.startKst)&&Date.parse(p.endKstExclusive)>=Date.parse(s.endKstExclusive))!;
  const n=request.graph.nodes.find(n=>n.fact.observationPointer.endsWith("/evidenceIds/2")&&n.temporal?.start===s.startKst&&n.temporal.endExclusive===s.endKstExclusive)!;
  for(const x of p.cycles){const r=verifyTemporalTenGodCalculation(resolver,request,{nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"FLOW_GOD",god:x.flowGod,referenceStem:x.cycle.stem,targetStem:s.effectiveAnnualPillar.stem,cycleIndex:x.cycle.index,window:n.temporal});expect(r.actualCalculation,r.reasons.join()).toBe("ACTUAL_CALCULATION_VERIFIED");r.canonicalFactRoots.forEach(id=>roots.add(id));}
 }expect(roots.size).toBeGreaterThan(1);
});
it("does not invent an unexposed monthly observation",()=>{
 const {request,spec}=monthRequest();expect(verifyTemporalTenGodCalculation(resolver,request,{...spec,nodeId:"missing-month-god"}).actualCalculation).toBe("UNVERIFIED_CALCULATION");
});
