import { reviewTemporalMeaning, applyTemporalMeaningReview, temporalReviewDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/conditionalTemporalMeaningReview";
import { CONDITIONAL_TEMPORAL_READINGS, EXTERNAL_TEMPORAL_SOURCES, type MeaningField } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/conditionalTemporalReviewMaterial";
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
function monthRequest(key="annual/A"){
 const request=requests.get(key)!;const c=request.graphInput.evidence.composition;if(c.product!=="annual_fortune")throw Error("ANNUAL_REQUIRED");
 const n=request.graph.nodes.find(n=>n.kind==="CALCULATED_PERIOD_FACT"&&n.fact.observationPointer.endsWith("/evidenceIds/3"))!;
 const m=/calendarMonths\/(\d+)\/segments\/(\d+)/.exec(n.fact.observationPointer)!;const s=c.result.evidence.raw.calendarMonths![+m[1]].segments[+m[2]];
 const spec:TenGodApplicationRequest={nodeId:n.id,owner:n.owner.fixtureOwnerId,origin:"MONTH_STEM",god:s.stemTenGod,referenceStem:c.result.evidence.raw.dayMaster,targetStem:s.monthPillar.stem,window:n.temporal};return {request,spec,n,s};
}

const allFields=originalRecords.flatMap(record=>(["dayun","saeun","wolun"] as const).map(field=>({record,field})));
it.each(allFields)("reviews original field $record.originalId/$field without approving it",async({record,field})=>{
 const review=await reviewTemporalMeaning(resolver,record,field),original=await resolver.record(record) as Record<string,unknown>;
 expect(review.originalMeaning).toBe(original[field]);expect(review.originalRecordHash).toBe(record.locator.recordSha256);
 expect(review.originalSourceVersion).toBe(record.locator.sourceVersion);expect(review.definitionProof?.actualHash).toBe(review.definitionProof?.expectedHash);
 expect(review.inheritedSourceProof.sourceVersion).toBe("565c4613d4e01d65510380e0f597c535f81396c0");
 expect(review.externalSources.length).toBeGreaterThan(2);expect(review.meaningClaim.classification).toContain("D");
 expect(review.meaningClaim.directTraditionalSupport).toBe(false);expect(review.exactConditionalMeaningSource).toBe("SOURCE_UNVERIFIED");
 expect(review.requiredConditions.modernActualContext).toHaveLength(2);expect(review.counterexamples).toHaveLength(3);
 expect(review.prohibitedInferences.length).toBeGreaterThan(3);expect(review.temporalIndependence.independentKnowledgeCount).toBe(0);
 expect(review.workbenchDecomposition.claims[0].originalText).toBe(original[field]);
 expect(review).toMatchObject({customerClaims:0,customerApproved:false,operatorApproved:false,readerBridge:0,newIndependentFacts:0});
 expect(review.productApplicability.permissionGranted).toBe(false);
 expect(review.states).toEqual(["SOURCE_VERIFIED","SOURCE_UNVERIFIED","CONDITIONAL_MEANING_PROPOSED","MEANING_REVIEW_REQUIRED","PRODUCT_REVIEW_REQUIRED","CUSTOMER_APPROVAL_PENDING"]);
 expect(await reviewTemporalMeaning(resolver,record,field)).toEqual(review);
});
it.each(EXTERNAL_TEMPORAL_SOURCES)("retains an actual bounded external access receipt $id",s=>{
 expect(s.status).toBe(200);expect(s.bodySha256).toMatch(/^[a-f0-9]{64}$/);expect(s.bytes).toBeGreaterThan(10000);
 expect(Number.isFinite(Date.parse(s.accessedAt))).toBe(true);expect(s.authorOrCompiler.length).toBeGreaterThan(2);
 expect(s.readSummary).not.toBe(s.doesNotSupport[0]);expect(s.empiricalEvidence).toBe(false);expect(s.modernNotesArePrimaryText).toBe(false);
});
it("has ten common meanings, thirty distinct readings and preserves contested sources",()=>{
 expect(CONDITIONAL_TEMPORAL_READINGS).toHaveLength(10);expect(new Set(CONDITIONAL_TEMPORAL_READINGS.map(r=>r.commonMeaningId)).size).toBe(10);
 expect(new Set(CONDITIONAL_TEMPORAL_READINGS.flatMap(r=>Object.values(r.fields).map(f=>f.analysis))).size).toBe(30);
 expect(CONDITIONAL_TEMPORAL_READINGS.filter(r=>r.classification==="E").map(r=>r.god)).toEqual(["비견","편인"]);
 expect(EXTERNAL_TEMPORAL_SOURCES.find(s=>s.id==="zp2")!.doesNotSupport.join()).toContain("단일 정답화");
});
it.each(["file","recordSha256","sourceVersion","originalId"])("rejects forged original Source %s",async field=>{
 const record=structuredClone(originalRecords[0]);if(field==="originalId")record.originalId="tr:god:forged";else Object.assign(record.locator,{[field]:"forged"});
 await expect(reviewTemporalMeaning(resolver,record,"dayun")).rejects.toThrow("ORIGINAL_TEMPORAL_SOURCE_REQUIRED");
});
it.each(["absent","changed"])("rejects %s review material bytes",async kind=>{
 const f=new Map(frozen);if(kind==="absent")f.delete(materialFile);else f.set(materialFile,"0".repeat(64));
 const r=new TemporalTenGodSourceResolver(reader,records,f,native,unresolved);await expect(reviewTemporalMeaning(r,originalRecords[0],"dayun")).rejects.toThrow();
});
it("rejects a nonexistent meaning field",async()=>{await expect(reviewTemporalMeaning(resolver,originalRecords[0],"future" as MeaningField)).rejects.toThrow("EXACT_TEMPORAL_MEANING_FIELD_REQUIRED");});
async function monthly(key="annual/A"){
 const {request,spec,n}=monthRequest(key),record=originalRecords.find(r=>r.originalId===`tr:god:${spec.god}`)!;
 const review=await reviewTemporalMeaning(resolver,record,"wolun");return {request,spec,n,record,review,demand:{packetHash:review.packetHash,requestedScope:"month" as const}};
}
it.each(["annual/A","annual/F","annual/C2028"])("links real monthly evidence but holds personal meaning: %s",async key=>{
 const {request,spec,record,review,demand,n}=await monthly(key),before=temporalReviewDigest(request);
 const r=await applyTemporalMeaningReview(resolver,record,"wolun",request,spec,demand);
 expect(r.technicalLinkage,r.reasons.join()).toBe("SCOPED_CALCULATION_LINK_VERIFIED");expect(r.calculatedTenGod).toBe(spec.god);
 expect(r.effectiveInterval).toEqual(n.temporal);expect(r.actualEvidence.roots).toEqual([...new Set(n.ancestry.rootIds)].sort());
 expect(r.packetHash).toBe(review.packetHash);expect(r.unfulfilledConditions.length).toBeGreaterThan(4);
 expect(r).toMatchObject({status:"WITHHELD",meaningApproved:false,customerApproved:false,customerClaims:0,readerBridge:0,newIndependentFacts:0});
 expect(temporalReviewDigest(request)).toBe(before);
});
it.each(["packet","approval","customer","period","owner","direction","origin","reference","target","god","end-exclusive","conditional","widen"])("holds unsafe scoped meaning %s",async variant=>{
 const {request,spec,record,demand}=await monthly();const d:{packetHash:string;requestedScope:"month"|"annual";claimedMeaningApproval?:boolean;customerApproved?:boolean}={...demand};
 if(variant==="packet")d.packetHash="forged";if(variant==="approval")d.claimedMeaningApproval=true;if(variant==="customer")d.customerApproved=true;
 if(variant==="period")d.requestedScope="annual";if(variant==="owner")spec.owner="other";if(variant==="direction")spec.direction="B_TO_A";
 if(variant==="origin")spec.origin="NATAL_STEM";if(variant==="reference")spec.referenceStem="invalid";if(variant==="target")spec.targetStem="invalid";if(variant==="god")spec.god="정재-invalid";
 if(["end-exclusive","conditional","widen"].includes(variant)){spec.window={...spec.window!};if(variant==="end-exclusive")spec.window.start=spec.window.endExclusive;
 if(variant==="conditional")spec.window.certainty="conditional";if(variant==="widen"){spec.window.start="2026-01-01T00:00:00+09:00";spec.window.endExclusive="2027-01-01T00:00:00+09:00";}}
 const r=await applyTemporalMeaningReview(resolver,record,"wolun",request,spec,d);expect(r.technicalLinkage).toBe("WITHHELD");expect(r.customerApproved).toBe(false);
});
it("does not promote thirty native failures while reviewing all twelve gates",async()=>{
 let count=0;for(const key of ["major/A","major/F","major/C"]){const request=requests.get(key)!,index=new ActualBindingIndex(request,catalog);
 for(const candidate of catalog.candidates.values())if(candidate.record.locator.file.endsWith("major-fortune-product-research/tenGodResearch.ts")){
 const before=bindKnowledgeCandidate(candidate,index,catalog),record=originalRecords.find(r=>r.originalId===candidate.record.originalId.replace("mfpr:","tr:"))!;
 const review=await reviewTemporalMeaning(resolver,record,"dayun");expect(review.externalSources.length).toBeGreaterThan(2);
 const after=bindKnowledgeCandidate(candidate,index,catalog);expect(after).toEqual(before);expect(after.allTwelveGateResults).toHaveLength(12);
 expect(after.allTwelveGateResults.find(g=>g.gate==="SOURCE_INTEGRITY")!.state).toBe("FAIL");count++;
 }}expect(count).toBe(30);
},60000);
it("does not invent unknown-hour evidence or copy natal evidence to a temporal layer",()=>{
 for(const key of ["annual/F","major/F"]){const r=requests.get(key)!;expect(r.graph.nodes.some(n=>n.producer.symbol==="collectStructureAtoms"&&n.participants.some(p=>p.position==="hour"))).toBe(false);}
 const {request,spec}=monthRequest();expect(verifyTemporalTenGodCalculation(resolver,request,{...spec,origin:"NATAL_STEM"}).actualCalculation).toBe("UNVERIFIED_CALCULATION");
});
