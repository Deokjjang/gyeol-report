import { prepareActualFactContext, createActualDayMasterUnit, createActualTenGodUnit, validateActualCalculatedUnit, actualSemanticDigest, type ActualFactContext } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
import { actualCalculationSpecs, adaptActualCalculationRequest, linkConditionalReview } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import locks from "../../fixtures/six-product-integration-01/source-locks.json";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver, TEMPORAL_DEFINITION_IDS } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { verifyTemporalTenGodCalculation, type TenGodApplicationRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodEvidence";
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
const materialFile="src/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/conditionalTemporalReviewMaterial.ts";
frozen.set(materialFile,hash(readFileSync(materialFile)));
const reader = new SourceReader(process.cwd(), async f => import(/* @vite-ignore */pathToFileURL(f).href), [...cc.knownSourceVersions, sv.baseSha, config.baseSha]);
const native = new SourceVerificationEngine(reader, records, edges, sv, cc, frozen);
const resolver = new TemporalTenGodSourceResolver(reader, records, frozen, native, unresolved);
const input: SemanticInputs = { records, edges, sourceReceipts: receipts, domainQueue:json(sr+"/domain-review-queue.json"), sourceGroups:json(sr+"/source-group-review.json"), directReviews:json(sd+"/direct-meaning-reviews.json"), config, frozen };
const decisions = json<SemanticDomainDecision[]>(sd+"/semantic-domain-decisions.json");
const catalog = new KnowledgeBinderCatalog(reader,input,{ records,sourceReceipts:receipts,decisions,policyRules:config.rules,staticAncestry:json(sd+"/ancestor-domain-audit.json"),readFile:f=>readFileSync(f,"utf8"),frozen },decisions);
const contexts=new Map<string,ActualFactContext>();
const requests = new Map<string,KnowledgeBindingRequest>();
beforeAll(async()=>{
 await catalog.prepare();
 for(const [product,id] of [["major","A"],["major","F"],["major","C"],["annual","A"],["annual","F"],["annual","C2028"]]){
  const f=locks.find(f=>f.product===product&&f.id===id)!;const generated=await generateV4ShadowReport(f.payload,f.clock);
  if(!generated.ok)throw Error("REAL_OFFLINE_FIXTURE_REQUIRED");
  const evidence=generated.evidencePacket as V4RuntimeEvidence, profiles=observeActualProfiles(evidence);
  const graphInput={evidence,profiles:profiles.profiles,context:{fixtureId:`fixture-${product}-${id}`,synthetic:true as const,evaluatedAt:evidence.generatedAt,owners:{person:"fixture-owner"},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
  const built=buildActualEvidenceGraph(graphInput,catalog.evidence);expect(built.ok).toBe(true);
  const request:KnowledgeBindingRequest={graph:built.graph,graphInput,product:built.graph.product,relationship:null,contexts:[],actualUserState:{}};requests.set(`${product}/${id}`,request);const prepared=prepareActualFactContext(resolver,request,catalog);expect(prepared.ok,prepared.reasons.join()).toBe(true);if(prepared.ok)contexts.set(`${product}/${id}`,prepared.context);
 }
},180000);

function spec(origin:TenGodApplicationRequest["origin"],key="annual/A"){
 const found=actualCalculationSpecs(requests.get(key)!).find(s=>s.origin===origin&&(origin==="NATAL_STEM"||s.window?.certainty==="confirmed"&&s.window.start&&s.window.endExclusive));
 if(!found)throw Error("REAL_ORIGIN_FIXTURE_REQUIRED:"+origin);return structuredClone(found);
}
async function unit(origin:TenGodApplicationRequest["origin"]="MONTH_STEM",key="annual/A"){
 const result=await createActualTenGodUnit(contexts.get(key)!,spec(origin,key));expect(result.ok,result.ok?"":result.reasons.join()).toBe(true);
 if(!result.ok)throw Error("EXPECTED_ACTUAL_UNIT");return result.unit;
}
it.each(["major/A","major/F","major/C","annual/A","annual/F","annual/C2028"])("builds a real day-master Unit independent of meaning approvals %s",async key=>{
 const request=requests.get(key)!,node=request.graph.nodes.find(n=>n.fact.observationPointer==="/calculations/person/pillars/day/stem")!;
 const result=await createActualDayMasterUnit(contexts.get(key)!,node.id);expect(result.ok).toBe(true);if(!result.ok)return;
 const u=result.unit;expect(u.calculatedTenGod).toBeNull();expect(u.referenceStem).toBe(request.graphInput.evidence.calculations.person!.dayMaster);
 expect(u.targetStem).toBe(u.referenceStem);expect(u.sourceIdentity).toBe(`foundation:day_master:${u.referenceStem}`);
 expect(u.canonicalFactRoot).toBe(node.fact.rootId);expect(u.effectiveInterval).toBeNull();expect(u.customerApproved).toBe(false);
});
it.each(["NATAL_STEM","DAYUN_STEM","ANNUAL_STEM","MONTH_STEM","MONTH_BRANCH_MAIN","FLOW_GOD"] as const)("creates a verified calculation-only Unit for %s",async origin=>{
 const key=origin==="DAYUN_STEM"?"major/A":"annual/A",request=requests.get(key)!,u=await unit(origin,key),s=spec(origin,key),node=request.graph.nodes.find(n=>n.id===s.nodeId)!;
 const verified=verifyTemporalTenGodCalculation(resolver,request,s);
 expect(u.calculatedTenGod).toBe(s.god);expect(u.referenceStem).toBe(s.referenceStem);expect(u.targetStem).toBe(s.targetStem);
 expect(u.sourceProof.expectedHash).toBe(u.sourceProof.actualHash);expect(Object.values(TEMPORAL_DEFINITION_IDS)).toContain(u.sourceIdentity);
 expect(u.canonicalFactRoots).toEqual(verified.canonicalFactRoots);expect(u.completeAncestry.original).toEqual(node.ancestry);
 expect(u.originalProducer).toEqual(node.producer);expect(u.effectiveInterval).toEqual(node.temporal);expect(u.direction).toBe(node.direction);
 expect(u).toMatchObject({evidenceKind:"VERIFIED_CALCULATED_FACT",customerApproved:false,newIndependentFacts:0,customerClaims:0,sourceDefinitionVerified:true,calculationVerified:true,meaningReview:"MEANING_REVIEW_REQUIRED",productReview:"PRODUCT_REVIEW_REQUIRED",customerAuthorizationState:"CUSTOMER_APPROVAL_PENDING"});
 expect(u.referenceBasis).toBe(origin==="FLOW_GOD"?"DAYUN_STEM":"NATAL_DAY_MASTER");
 expect(await validateActualCalculatedUnit(contexts.get(key)!,u)).toEqual({ok:true,reasons:[]});
 expect(await createActualTenGodUnit(contexts.get(key)!,s)).toEqual({ok:true,unit:u});
});
it.each(["producer","root-owner","node-value","source-hash","ancestry","verified-flag","profile"])("rejects caller-forged Graph/proof %s",variant=>{
 const request=structuredClone(requests.get("annual/A")!),n=request.graph.nodes.find(n=>n.id===spec("MONTH_STEM").nodeId)!;
 if(variant==="producer")n.producer.version="forged";if(variant==="root-owner")n.owner.fixtureOwnerId="other";if(variant==="node-value")n.value={god:"정재"};
 if(variant==="source-hash")n.sources.push({file:"package.json",pointer:"",fileSha256:"0".repeat(64),catalogKeys:[],sourceReferenceKeys:[],semanticDecisionKeys:[],state:"VERIFIED"});
 if(variant==="ancestry")n.ancestry.rootIds.push("aeg:root:forged");if(variant==="verified-flag")Object.assign(n,{verified:true});
 if(variant==="profile")Object.assign(request.graphInput.profiles.person!,{forgedVerified:true});
 expect(prepareActualFactContext(resolver,request,catalog).ok).toBe(false);
});
it.each(["owner","direction","reference","target","god","origin","widen","narrow","end-exclusive","conditional"])("withholds unsafe actual calculation request %s",async variant=>{
 const s=spec("MONTH_STEM");if(variant==="owner")s.owner="other";if(variant==="direction")s.direction="A_TO_B";if(variant==="reference")s.referenceStem="甲-invalid";
 if(variant==="target")s.targetStem="乙-invalid";if(variant==="god")s.god="자원 관리";if(variant==="origin")s.origin="NATAL_STEM";
 if(["widen","narrow","end-exclusive","conditional"].includes(variant)){s.window={...s.window!};if(variant==="widen"){s.window.start="2026-01-01T00:00:00+09:00";s.window.endExclusive="2027-01-01T00:00:00+09:00";}if(variant==="narrow")s.window.endExclusive=new Date(Date.parse(s.window.start!)+60000).toISOString();if(variant==="end-exclusive")s.window.start=s.window.endExclusive;if(variant==="conditional")s.window.certainty="conditional";}
 const r=await createActualTenGodUnit(contexts.get("annual/A")!,s);expect(r.ok).toBe(false);if(!r.ok)expect(r.unitIssued).toBe(false);
});
it.each(["sourceHash","sourceVersion","producerVersion","owner","root","scope","meaning","approval","synthetic","extra-claim"])("revalidates and rejects tampered Unit %s",async variant=>{
 const u=structuredClone(await unit());
 if(variant==="sourceHash")u.sourceHash="forged";if(variant==="sourceVersion")u.sourceVersion="forged";if(variant==="producerVersion")u.producerVersion="forged";
 if(variant==="owner")u.owner.fixtureOwnerId="other";if(variant==="root")u.canonicalFactRoots.push("aeg:root:other-owner");if(variant==="scope")u.temporalScope="dayun";
 if(variant==="meaning")Object.assign(u,{evidenceKind:"CONDITIONAL_INTERPRETIVE_MEANING",text:"정재이므로 수입이 늘어난다"});if(variant==="approval")Object.assign(u,{customerApproved:true});
 if(variant==="synthetic")Object.assign(u,{syntheticDefinition:{approved:true}});if(variant==="extra-claim")Object.assign(u,{customerClaim:"이미 승진했다"});
 expect((await validateActualCalculatedUnit(contexts.get("annual/A")!,u)).ok).toBe(false);
});
it("blocks counterfeit contexts and forged exact definition source versions",async()=>{
 expect((await createActualTenGodUnit(structuredClone(contexts.get("annual/A")!),spec("MONTH_STEM"))).ok).toBe(false);
 const frozenBad=new Map(frozen);frozenBad.set("src/lib/report-knowledge/sajuFoundationKnowledge.ts","0".repeat(64));
 const bad=new TemporalTenGodSourceResolver(reader,records,frozenBad,native,unresolved),p=prepareActualFactContext(bad,requests.get("annual/A")!,catalog);expect(p.ok).toBe(true);
 if(p.ok)expect((await createActualTenGodUnit(p.context,spec("MONTH_STEM"))).ok).toBe(false);
});
it("fact Units survive a withheld conditional review source without gaining approval",async()=>{
 const map=new Map(frozen);map.delete(materialFile);const r=new TemporalTenGodSourceResolver(reader,records,map,native,unresolved),request=requests.get("annual/A")!,p=prepareActualFactContext(r,request,catalog);expect(p.ok).toBe(true);if(!p.ok)return;
 const a=await createActualTenGodUnit(p.context,spec("MONTH_STEM"));expect(a.ok).toBe(true);if(!a.ok)return;
 const link=await linkConditionalReview(p.context,a.unit,request,r);expect(link.technicalLinkage).toBe("WITHHELD");expect(link.meaningApproved).toBe(false);expect(link.customerApproved).toBe(false);
});
it("keeps unknown hour absent and never promotes nominal major annual observations",async()=>{
 for(const key of ["major/F","annual/F"]){expect(actualCalculationSpecs(requests.get(key)!).filter(s=>s.origin==="NATAL_STEM").every(s=>!requests.get(key)!.graph.nodes.find(n=>n.id===s.nodeId)!.participants.some(p=>p.position==="hour"))).toBe(true);}
 const r=await createActualTenGodUnit(contexts.get("major/A")!,actualCalculationSpecs(requests.get("major/A")!).find(s=>s.origin==="ANNUAL_STEM")!);expect(r.ok).toBe(false);
 const fake=await createActualDayMasterUnit(contexts.get("major/F")!,"/calculations/person/pillars/hour/stem");expect(fake.ok).toBe(false);
});
it("preserves shared original roots without counting a new fact for each Unit",async()=>{
 const a=await unit("MONTH_STEM"),b=await unit("MONTH_BRANCH_MAIN");expect(a.unitId).not.toBe(b.unitId);expect(a.originalEvidenceNodeId).toBe(b.originalEvidenceNodeId);
 expect(a.canonicalFactRoots).toEqual(b.canonicalFactRoots);expect(new Set([...a.canonicalFactRoots,...b.canonicalFactRoots]).size).toBe(a.canonicalFactRoots.length);expect(a.newIndependentFacts+b.newIndependentFacts).toBe(0);
});
it("different real inputs preserve their different calculation identities",async()=>{
 const a=await unit("NATAL_STEM","major/A"),b=await unit("NATAL_STEM","major/C");expect(a.unitId).not.toBe(b.unitId);expect(actualSemanticDigest([a.referenceStem,a.targetStem,a.calculatedTenGod])).not.toBe(actualSemanticDigest([b.referenceStem,b.targetStem,b.calculatedTenGod]));
});
it("real offline Foundation consumes the Units and retains thirty Source failures",async()=>{
 const foundation=await ProductSpecialistFoundation.prepare(catalog);let failures=0;
 for(const key of ["major/A","major/F","major/C"]){const request=requests.get(key)!,before=actualSemanticDigest(request),r=await adaptActualCalculationRequest(request,{resolver,foundation});
 expect(r.ok,r.ok?"":r.reasons.join()).toBe(true);if(!r.ok)continue;expect(r.handoff.units.length).toBeGreaterThan(0);expect(r.handoff.syntheticMeaningDefinitionsUsed).toBe(0);
 expect(r.handoff.canonicalFactRoots).toEqual([...new Set(r.handoff.units.flatMap(u=>u.canonicalFactRoots))].sort());expect(r.handoff.nativeEvidenceLinks).toHaveLength(r.handoff.units.length);
 const index=new ActualBindingIndex(request,catalog);for(const receipt of r.native.before)if(receipt.originalResearchId.startsWith("mfpr:god:")){
 expect(bindKnowledgeCandidate(catalog.candidates.get(receipt.candidateCatalogKey)!,index,catalog)).toEqual(receipt);expect(receipt.allTwelveGateResults).toHaveLength(12);
 expect(receipt.allTwelveGateResults.find(g=>g.gate==="SOURCE_INTEGRITY")!.state).toBe("FAIL");failures++;}
 expect(r.handoff).toMatchObject({customerClaims:0,customerReaderBridge:0,customerApproval:0,newIndependentFacts:0,plannerChanged:false,writerChanged:false});expect(actualSemanticDigest(request)).toBe(before);
 }expect(failures).toBe(30);
},180000);
it("preserves effective annual Units on both sides of Lichun",async()=>{
 const boundary="2026-02-04T05:02:08+09:00",specs=actualCalculationSpecs(requests.get("annual/A")!).filter(s=>s.origin==="ANNUAL_STEM");
 const left=specs.find(s=>s.window?.endExclusive===boundary)!,right=specs.find(s=>s.window?.start===boundary)!;
 const a=await createActualTenGodUnit(contexts.get("annual/A")!,left),b=await createActualTenGodUnit(contexts.get("annual/A")!,right);
 expect(a.ok&&b.ok).toBe(true);if(!a.ok||!b.ok)return;
 expect(a.unit.effectiveAnnualPillar).toBe("乙巳");expect(b.unit.effectiveAnnualPillar).toBe("丙午");expect(a.unit.nominalAnnualPillar).toBe("丙午");
 expect(a.unit.effectiveInterval?.endExclusive).toBe(b.unit.effectiveInterval?.start);expect(a.unit.calculatedTenGod).toBe("정재");expect(b.unit.calculatedTenGod).toBe("편관");
});
it("keeps the original Jie split and separates month stem from branch main",async()=>{
 const specs=actualCalculationSpecs(requests.get("annual/A")!).filter(s=>s.origin==="MONTH_STEM"),left=specs[0],right=specs.find(s=>s.window?.start===left.window?.endExclusive)!;
 expect(right).toBeDefined();const a=await createActualTenGodUnit(contexts.get("annual/A")!,left),b=await createActualTenGodUnit(contexts.get("annual/A")!,right);
 expect(a.ok&&b.ok).toBe(true);if(!a.ok||!b.ok)return;expect(a.unit.targetStem).not.toBe(b.unit.targetStem);expect(a.unit.effectiveInterval?.endExclusive).toBe(b.unit.effectiveInterval?.start);
 const branch=await unit("MONTH_BRANCH_MAIN");expect(branch.producerSources.some(s=>s.file==="src/lib/saju/constants.ts")).toBe(true);
});
it("preserves cycle-stem FLOW_GOD Units across the exact transition",async()=>{
 const boundary="2028-04-23T21:42:00+09:00",specs=actualCalculationSpecs(requests.get("annual/C2028")!).filter(s=>s.origin==="FLOW_GOD");
 const a=await createActualTenGodUnit(contexts.get("annual/C2028")!,specs.find(s=>s.window?.endExclusive===boundary)!),b=await createActualTenGodUnit(contexts.get("annual/C2028")!,specs.find(s=>s.window?.start===boundary)!);
 expect(a.ok&&b.ok).toBe(true);if(!a.ok||!b.ok)return;expect(a.unit.referenceStem).toBe("壬");expect(b.unit.referenceStem).toBe("辛");expect(a.unit.targetStem).toBe("戊");expect(b.unit.targetStem).toBe("戊");
 expect(a.unit.calculatedTenGod).toBe("편관");expect(b.unit.calculatedTenGod).toBe("정인");expect(a.unit.referenceBasis).toBe("DAYUN_STEM");expect(b.unit.referenceBasis).toBe("DAYUN_STEM");
});
it("a conditional active-cycle interval cannot be promoted by verified flags",async()=>{
 const request=requests.get("annual/F")!,s=actualCalculationSpecs(request).find(s=>s.origin==="DAYUN_STEM")!;
 const r=await createActualTenGodUnit(contexts.get("annual/F")!,s);expect(r.ok).toBe(false);if(!r.ok)expect(r.reasons.join()).toMatch(/CONFIRMED_ANCESTRY_INTERVAL_REQUIRED|ACTUAL_SCOPED_CALCULATION_REQUIRED/);
});

it.each(["verified", "conditionalMeaning", "syntheticDefinition"])("never embeds untrusted request metadata %s in a fact Unit",async field=>{
 const s=spec("MONTH_STEM");Object.assign(s,{[field]:field==="verified"?true:"정재이므로 수입이 늘어난다"});
 const result=await createActualTenGodUnit(contexts.get("annual/A")!,s);expect(result.ok).toBe(false);
 if(!result.ok)expect(result.reasons).toContain("UNEXPECTED_CALCULATION_REQUEST_FIELD");
});

it.each(["NATAL_STEM","DAYUN_STEM","ANNUAL_STEM","MONTH_STEM","MONTH_BRANCH_MAIN","FLOW_GOD"] as const)("revalidates serialized actual Units without Synthetic definitions: %s",async origin=>{
 const key=origin==="DAYUN_STEM"?"major/A":"annual/A",u=await unit(origin,key),parsed=JSON.parse(JSON.stringify(u));
 expect((await validateActualCalculatedUnit(contexts.get(key)!,parsed)).ok).toBe(true);expect(parsed.unitId).toBe(u.unitId);
});
