import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture, adaptActualCalculationRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualAugustRelations } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-august-dayun/adapter";
import { evaluateAugust, validateAugustCandidate, validateConditionalDayunWitness, AUGUST_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-august-dayun/contract";
import { actualSemanticDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
import { ActualBindingIndex } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/matching";
import { bindKnowledgeCandidate } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/engine";
import type { KnowledgeCatalogRecord, KnowledgeReferenceEdge, CatalogConfig } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import type { SemanticInputs, SemanticConfig, SemanticDomainDecision } from "@/lib/report-knowledge/knowledge-integration-foundation/semantic-domain-verification/types";
import type { VerificationConfig, VerificationReceipt } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/types";
import type { KnowledgeBindingRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types";
import type { ActualCalculationRun } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-specialist-claim-contract/contract";
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

import type { V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { observeActualProfiles } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/producers";
import { buildActualEvidenceGraph } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/engine";
import type { GraphInput } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/types";
type Run = Extract<Awaited<ReturnType<typeof adaptAnnualAugustRelations>>, { ok: true }>;
let result: Run, ranged: Run, early: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
const services = () => ({ resolver, foundation });
async function derived(beforeFirst: boolean) {
  const lock = json<{product:string;id:string;payload:Record<string,unknown>;clock:Parameters<typeof generateV4ShadowReport>[1]}[]>("tests/fixtures/six-product-integration-01/source-locks.json").find(f=>f.product==="annual"&&f.id==="A")!;
  const payload = structuredClone(lock.payload), person = payload.person as Record<string,unknown>, options = payload.productOptions as Record<string,unknown>;
  Object.assign(person, beforeFirst ? {birthDate:"2024-07-31",birthTime:"07:30",birthTimeUnknown:false,birthTimePrecision:"exact",gender:"MALE"} : {birthDate:"1999-07-31",birthTime:"",birthTimeUnknown:true,birthTimePrecision:"unknown",gender:"MALE"});
  options.selectedYear = beforeFirst ? "2026" : "2027";
  const clock = {...lock.clock,policyDate:beforeFirst?"2026-10-12T12:00:00+09:00":"2027-10-12T12:00:00+09:00"};
  const generated=await generateV4ShadowReport(payload,clock);if(!generated.ok)throw Error("ORIGINAL_DERIVED_CALCULATION_REQUIRED");expect(generated.externalCalls).toEqual([]);
  const evidence=generated.evidencePacket as V4RuntimeEvidence,profiles=observeActualProfiles(evidence),id=beforeFirst?"fixture-annual-before-first":"fixture-annual-ranged-transition";
  const graphInput:GraphInput={evidence,profiles:profiles.profiles,context:{fixtureId:id,synthetic:true,evaluatedAt:evidence.generatedAt,owners:{person:beforeFirst?"fixture-person-annual-before-first":"fixture-person-annual-ranged-transition"},catalogVersion:catalog.evidence.versions.catalog,sourceVersion:catalog.evidence.versions.source,semanticVersion:catalog.evidence.versions.semantic}};
  const graph=buildActualEvidenceGraph(graphInput,catalog.evidence);expect(graph.ok).toBe(true);
  if(evidence.input.kind==="compatibility")throw Error("ANNUAL_INPUT_REQUIRED");
  const request:KnowledgeBindingRequest={graph:graph.graph,graphInput,product:graph.graph.product,relationship:null,contexts:[],actualUserState:evidence.input.userContext};
  const bridge=await adaptActualCalculationRequest(request,services());if(!bridge.ok)throw Error(bridge.reasons.join());
  const run=await adaptAnnualAugustRelations(request,bridge,services());if(!run.ok)throw Error(run.reasons.join());return run;
}
beforeAll(async()=>{
  await catalog.prepare();foundation=await ProductSpecialistFoundation.prepare(catalog);
  const f=await runActualCalculationFixture(process.cwd(),{product:"annual",id:"A"},services());if(!f.ok)throw Error(f.reasons.join());facts=f;
  const r=await adaptAnnualAugustRelations(f.request,f,services());if(!r.ok)throw Error(r.reasons.join());result=r;
  ranged=await derived(false);early=await derived(true);
},480000);
const candidate=()=>result.handoff.augustCandidates[0];
const uncertain=()=>ranged.observation!.conditionalDayunWitnesses.find(w=>w.contextStatus==="transition_uncertain"&&w.conditionalRelations.length>0)!;
function change<T>(value:T,path:string,replacement:unknown){const parts=path.split(".");let target:Record<string,unknown>=value as Record<string,unknown>;for(const part of parts.slice(0,-1))target=target[part] as Record<string,unknown>;target[parts.at(-1)!]=replacement;return value;}
it("binds all real August segments only when no original uncertainty is present",async()=>{
 const c=candidate();expect(c).toBeDefined();expect(c.originalResearchId).toBe(AUGUST_CONTRACT.originalId);expect(c.originalSourceProof.research.actualHash).toBe(AUGUST_CONTRACT.recordSha256);
 expect(c.segmentResults).toHaveLength(2);expect(c.typedBindings).toHaveLength(2);expect(c.conditionalDayunWitnesses.every(w=>w.verificationState==="CONFIRMED_ACTIVE_CYCLE"&&w.uncertaintyVerificationState==="NO_UNCERTAINTY_PRESENT_VERIFIED"&&w.earliestKst===null&&w.latestKst===null)).toBe(true);
 expect(await validateAugustCandidate(result.context!,structuredClone(c))).toMatchObject({ok:true});
 for(const w of c.conditionalDayunWitnesses)expect(await validateConditionalDayunWitness(result.context!,structuredClone(w))).toMatchObject({ok:true,eligibleAsCalculatedFact:false});
});
it("preserves the real range, alternatives, original withheld graph and candidate identities",async()=>{
 expect(ranged.observation!.segmentResults).toHaveLength(3);expect(ranged.handoff.augustCandidates).toEqual([]);
 const w=uncertain();expect(w.verificationState).toBe("CONDITIONAL_RANGE_SOURCE_VERIFIED");expect(w.actualCycleConfirmed).toBe(false);expect(w.actualRelationConfirmed).toBe(false);expect(w.candidatesAreAlternatives).toBe(true);expect(w.simultaneousConfirmedCycles).toBe(0);
 expect(w.earliestKst).toBe("2027-04-08T00:00:00+09:00");expect(w.latestKst).toBe("2027-08-08T21:59:59+09:00");
 expect(w.previousCycle!.ganji).toBe("己巳");expect(w.candidateNextCycle!.ganji).toBe("戊辰");expect(w.originalCandidateCycleIndices).toEqual([2,3]);expect(w.includesBeforeFirstCycle).toBe(false);
 expect(w.originalGraphStatuses.some(n=>n.status==="WITHHELD"&&n.blockers.some(b=>b.code==="UNCERTAIN_TRANSITION"))).toBe(true);
 expect(ranged.observation!.segmentResults.filter(s=>s.scopeWitness.contextStatus==="transition_uncertain").every(s=>s.binding===null&&s.reasons.includes("UNCERTAIN_TRANSITION"))).toBe(true);
 for(const scope of ranged.observation!.conditionalDayunWitnesses)expect(scope.conditionalRelations).toHaveLength(scope.originalMonthSegment.relationFacts.filter(f=>f.source==="month_dayun_branch").length);
 expect(w.conditionalRelations.length).toBeGreaterThan(0);for(const relation of w.conditionalRelations){expect(relation.originalGraphNode.status).toBe("WITHHELD");expect(relation.originalValidator.reasons).toContain("CONDITIONAL_RELATION_NOT_CONFIRMED");expect(relation.eligibleAsConfirmedRelation).toBe(false);}
 expect(await validateConditionalDayunWitness(ranged.context!,structuredClone(w))).toMatchObject({ok:true,eligibleAsCalculatedFact:false});
});
it("keeps an actual first-cycle absence without inventing a previous or active cycle",()=>{
 expect(early.handoff.augustCandidates).toEqual([]);for(const w of early.observation!.conditionalDayunWitnesses){expect(w.verificationState).toBe("BEFORE_FIRST_CYCLE");expect(w.originalCandidateCycles).toEqual([]);expect(w.includesBeforeFirstCycle).toBe(true);expect(w.previousCycle).toBeNull();expect(w.actualCycleConfirmed).toBe(false);expect(w.earliestKst).toBeNull();expect(w.unresolvedConditions).toContain("BEFORE_FIRST_DAYUN");}
});
it("preserves original requirements, gates, approvals and a single exact binding window",()=>{
 const c=candidate();for(const b of c.typedBindings){expect(b.typedNativeReceipt.selectedActualEvidence).toHaveLength(3);expect(b.sourceWitnessesAreGraphFacts).toBe(false);expect(b.typedNativeReceipt.allTwelveGateResults).toHaveLength(12);
 expect(b.typedNativeReceipt.temporalWitnesses.every(w=>w.start===b.effectiveInterval.start&&w.endExclusive===b.effectiveInterval.endExclusive)).toBe(true);
 for(const key of ["unresolvedConditions","sourceGroups","requiredContext","products","relationships","requiredUserState","counterexamples","prohibitions","meaningIdentity","claimIdentity"] as const)expect(b.typedCandidate.requirement[key]).toEqual(c.originalCandidate.requirement[key]);
 for(const g of b.typedNativeReceipt.allTwelveGateResults)if(!["PRODUCER_SUPPORT","ACTUAL_CALCULATED_FACT","ACTUAL_OWNER","ALL_ANCESTOR_DOMAINS","TIME_INTERSECTION"].includes(g.gate)){const old=c.originalNativeReceipt.allTwelveGateResults.find(v=>v.gate===g.gate)!;expect([g.state,g.reasons]).toEqual([old.state,old.reasons]);}
 }
 expect(c.verifiedActualUnitIds).toEqual([]);expect(c.newFactRoots).toBe(0);expect(c.independentFactsAdded).toBe(0);expect(c.customerClaims).toBe(0);expect(c.customerUseAllowed).toBe(false);expect(c.plannerUseAllowed).toBe(false);
});
it("keeps the original half-open TIME_INTERSECTION gate",()=>{
 const c=candidate(),typed=structuredClone(c.originalCandidate),ids=c.segmentResults.map(s=>s.originalGraphEvidence[2].id);
 c.segmentResults.forEach((s,i)=>typed.requirement.sourceRequirements.push({id:"negative-august-"+i,originalField:"/requires/2",originalDeclaration:c.originalResearchRecord.requires,sourceKey:null,sourceCatalogKeys:[],owner:"person",use:"ACTUAL_FACT",selector:{kinds:["CALCULATED_PERIOD_FACT"],owner:"person",observationPointer:s.originalGraphEvidence[2].fact.observationPointer,fields:[]},required:true,gaps:[]}));typed.requirement.requiredOwner=["person"];
 const receipt=bindKnowledgeCandidate(typed,new ActualBindingIndex({...facts.request,restrictEvidenceTo:ids},catalog),catalog);expect(receipt.allTwelveGateResults.find(g=>g.gate==="TIME_INTERSECTION")).toMatchObject({state:"FAIL",reasons:["NO_TIME_INTERSECTION"]});
});
const witnessMutations:[string,string,unknown][]=[
 ["Owner","originalOwner.fixtureOwnerId","foreign"],["Fixture","fixtureId","foreign"],["year","selectedYear",2099],["segment","segmentPointer","foreign"],
 ["index","originalCandidateCycles.0.cycle.index",99],["Ganji","originalCandidateCycles.0.cycle.ganji","甲子"],["phantom previous","previousCycle",{index:999,ganji:"甲子"}],
 ["uncertain as confirmed","verificationState","CONFIRMED_ACTIVE_CYCLE"],["reverse range","earliestKst","2028-01-01T00:00:00+09:00"],
 ["shrink range","earliestKst","2027-08-01T00:00:00+09:00"],["expand range","latestKst","2027-09-01T00:00:00+09:00"],
 ["fake exact instant","latestKst","2027-04-08T00:00:00+09:00"],["simultaneous cycles","simultaneousConfirmedCycles",2],
 ["blockers removed","originalGraphNodes.1.blockers",[]],["conditional relation promoted","conditionalRelations.0.originalGraphNode.status","VERIFIED"],
 ["producer","producerVersion","foreign"],["Source Hash","sourceHash","foreign"],["root","existingFactRoots",["invented"]],
 ["meaning","meaningIdentity","invented"],["Claim","claimIdentity","invented"],["customer approval","customerAuthorizationState","APPROVED"]
];
it.each(witnessMutations)("rejects forged conditional Witness: %s",async(_name,path,value)=>{
 const w=change(structuredClone(uncertain()),path,value);expect((await validateConditionalDayunWitness(ranged.context!,w)).ok).toBe(false);
});
it("rejects before-first promoted to active",async()=>{
 const w=change(structuredClone(early.observation!.conditionalDayunWitnesses[0]),"contextStatus","active");expect((await validateConditionalDayunWitness(early.context!,w)).ok).toBe(false);
});
it.each([
 ["Receipt","originalNativeReceipt.receiptId","foreign"],["TIME gate","typedBindings.0.typedNativeReceipt.allTwelveGateResults",[]],
 ["Source Group contract removed","originalCandidate.requirement.sourceGroups",null],["counterexample","originalCandidate.requirement.counterexamples",[]],["prohibition","originalCandidate.requirement.prohibitions",[]],
 ["held Unit released","verifiedActualUnitIds",["held-original-unit"]],["Meaning","originalMeaningIdentity","invented"],["Claim","originalClaimIdentity","invented"],["Approval","customerApprovals",1],
 ["missing segment","sourcePreconditions.everyCanonicalSegment",[]]
] as [string,string,unknown][])("rejects forged August Candidate: %s",async(_name,path,value)=>{
 expect((await validateAugustCandidate(result.context!,change(structuredClone(candidate()),path,value))).ok).toBe(false);
});
it("rejects a cloned context and all customer/Planner use",async()=>{
 expect((await evaluateAugust(structuredClone(result.context!))).ok).toBe(false);
 expect((await validateAugustCandidate(result.context!,candidate(),"CUSTOMER_PUBLICATION")).ok).toBe(false);
 expect((await validateAugustCandidate(result.context!,candidate(),"PLANNER_ASSIGNMENT")).ok).toBe(false);
 expect((await validateConditionalDayunWitness(ranged.context!,uncertain(),"CUSTOMER_PUBLICATION")).ok).toBe(false);
});
it("has deterministic Source scope without modifying calculation, graph or native receipt",async()=>{
 const before=actualSemanticDigest([facts.request,facts.handoff,facts.native]),a=await evaluateAugust(result.context!),b=await evaluateAugust(result.context!);expect(a.ok&&b.ok).toBe(true);expect(actualSemanticDigest(a)).toBe(actualSemanticDigest(b));expect(actualSemanticDigest([facts.request,facts.handoff,facts.native])).toBe(before);
});
