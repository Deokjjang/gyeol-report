import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualJanuaryCarryover } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-january-carryover/adapter";
import { evaluateJanuary, validateJanuaryCandidate, validatePriorDecember, JANUARY_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-january-carryover/contract";
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

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualJanuaryCarryover>>, { ok: true }>;
let result: Run, withheld: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
const services = () => ({ resolver, foundation });
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, services()); if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualJanuaryCarryover(f.request, f, services()); if (!r.ok) throw Error(r.reasons.join()); result = r;
  const hold = await adaptAnnualJanuaryCarryover(f.request, f, services(), { adjacentYear: "WITHHOLD" }); if (!hold.ok) throw Error(hold.reasons.join()); withheld = hold;
}, 480000);
const candidate = () => result.handoff.januaryCandidates[0];
const availability = () => candidate().priorDecember;
function change<T>(value: T, path: string, replacement: unknown) { const parts = path.split("."); let target = value as Record<string, unknown>; for (const part of parts.slice(0, -1)) target = target[part] as Record<string, unknown>; target[parts.at(-1)!] = replacement; return value; }
it("verifies every real January segment, effective annual pillar and exact Sohan", async () => {
  const c = candidate(); expect(c).toBeDefined(); expect(c.originalResearchId).toBe(JANUARY_CONTRACT.originalId); expect(c.originalSourceProof.research.actualHash).toBe(JANUARY_CONTRACT.recordSha256);
  expect(c.segmentResults).toHaveLength(2); expect(c.typedBindings).toHaveLength(2); expect(c.sourcePreconditions.everyCanonicalSegment).toHaveLength(2);
  expect(c.januaryBoundaryProof.civilYearStartIsIpchun).toBe(false); expect(c.januaryBoundaryProof.sohan.name).toBe("소한"); expect(c.januaryBoundaryProof.ipchun.name).toBe("입춘");
  expect(c.segmentResults.every(v => v.originalSegment.effectiveAnnualPillar.stem + v.originalSegment.effectiveAnnualPillar.branch !== c.nominalAnnualPillar.ganji)).toBe(true);
  expect(c.segmentResults[1].originalSegment.startKst).toBe(c.januaryBoundaryProof.sohan.instantKst);
  expect(await validateJanuaryCandidate(result.context!, structuredClone(c))).toMatchObject({ ok: true });
});
it("reruns the existing producer from an exactly reproduced current-year basis", async () => {
  const p = availability(); expect(p.originalLedgerState).toBe("PRIOR_DECEMBER_NOT_IN_ORIGINAL_LEDGER"); expect(p.availabilityState).toBe("PRIOR_DECEMBER_VERIFIED");
  const w = p.sourceWitness!; expect(w.recordKind).toBe("SOURCE_ONLY_ADJACENT_YEAR_WITNESS"); expect(w.producer.symbol).toBe("buildAnnualMonthCalendar"); expect(w.currentYearReexecutionVerified).toBe(true);
  expect(w.priorYear).toBe(w.selectedYear - 1); expect(w.adjacentYearOnlyInputChange).toBe("selectedYear"); expect(w.december.endKstExclusive).toBe(candidate().sourcePreconditions.civilMonthBounds.start);
  expect(w.originalGraphEvidence).toEqual([]); expect(w.originalFactRoots).toEqual([]); expect(w.newFactRoots).toBe(0); expect(w.customerUseAllowed).toBe(false);
  expect(await validatePriorDecember(result.context!, structuredClone(p))).toMatchObject({ ok: true, eligibleAsCalculatedFact: false });
});
it("records continuity across civil New Year without inventing a pillar event", () => {
  const c = candidate(), cross = c.crossYearComparison!; expect(c.crossYearComparisonState).toBe("PREVIOUS_DECEMBER_COMPARISON_VERIFIED"); expect(cross.result).toBe("CARRYOVER_CONTINUITY");
  expect(cross.comparisonScope).toBe("CALENDAR_AND_RELATION_SIGNATURES_ONLY"); expect(cross.graphRootAndTransitComparisonState).toBe("WITHHELD_MISSING_PRIOR_GRAPH"); expect(cross.originalComparatorObservation.kinds).not.toContain("NEW_ACCEPTED_TRANSIT"); expect(cross.originalComparatorObservation.kinds).not.toContain("NEW_RELATION_ROOT"); expect(cross.originalComparatorObservation.changedRoots).toEqual([]);
  expect(cross.changedFields).toEqual([]); expect(cross.originalComparatorObservation.kinds).toContain("CONTINUITY"); expect(cross.beforeWindow.endExclusive).toBe(cross.afterWindow.start);
  expect(cross.beforeGraphEvidence).toEqual([]); expect(cross.beforeFactRoots).toEqual([]); expect(cross.comparisonApproved).toBe(false); expect(cross.periodSemantics).toBe("NON_SIMULTANEOUS_COMPARISON");
  expect(c.withinJanuaryComparisons.some(w => w.originalComparatorObservation.kinds.includes("JIE_BOUNDARY"))).toBe(true);
});
it("verifies January independently when adjacent-year recomputation is explicitly withheld", async () => {
  const c = withheld.handoff.januaryCandidates[0]; expect(c.technicalState).toBe("JANUARY_TECHNICAL_CONTRACT_VERIFIED"); expect(c.typedBindings).toHaveLength(2);
  expect(c.priorDecember.availabilityState).toBe("PRIOR_DECEMBER_RECOMPUTATION_UNVERIFIED"); expect(c.priorDecember.originalLedgerState).toBe("PRIOR_DECEMBER_NOT_IN_ORIGINAL_LEDGER"); expect(c.priorDecember.sourceWitness).toBeNull();
  expect(c.crossYearComparison).toBeNull(); expect(c.crossYearComparisonState).toBe("PRIOR_DECEMBER_COMPARISON_WITHHELD"); expect(c.explicitWithholdReasons).toContain("PRIOR_DECEMBER_COMPARISON_WITHHELD");
  expect(await validateJanuaryCandidate(withheld.context!, structuredClone(c))).toMatchObject({ ok: true });
  expect((await validatePriorDecember(withheld.context!, availability())).ok).toBe(false);
});
it("keeps original conditions, all twelve gates and each independent binding window", () => {
  const c = candidate(); for (const b of c.typedBindings) {
    expect(b.typedNativeReceipt.selectedActualEvidence).toHaveLength(3); expect(b.typedNativeReceipt.allTwelveGateResults).toHaveLength(12); expect(b.sourceWitnessesAreGraphFacts).toBe(false);
    expect(b.typedNativeReceipt.temporalWitnesses.every(w => w.start === b.effectiveInterval.start && w.endExclusive === b.effectiveInterval.endExclusive)).toBe(true);
    for (const key of ["unresolvedConditions", "sourceGroups", "requiredContext", "products", "relationships", "requiredUserState", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity"] as const) expect(b.typedCandidate.requirement[key]).toEqual(c.originalCandidate.requirement[key]);
    for (const gate of b.typedNativeReceipt.allTwelveGateResults) if (!["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"].includes(gate.gate)) { const original = c.originalNativeReceipt.allTwelveGateResults.find(g => g.gate === gate.gate)!; expect([gate.state, gate.reasons]).toEqual([original.state, original.reasons]); }
  }
  expect(c.verifiedActualUnitIds).toEqual([]); expect(c.newFactRoots).toBe(0); expect(c.independentFactsAdded).toBe(0); expect(c.customerClaims).toBe(0); expect(c.customerUseAllowed).toBe(false); expect(c.plannerUseAllowed).toBe(false);
});
it("preserves the existing NO_TIME_INTERSECTION block for disjoint January windows", () => {
  const c = candidate(), typed = structuredClone(c.originalCandidate), ids = c.segmentResults.map(s => s.originalGraphEvidence[2].id);
  c.segmentResults.forEach((s, i) => typed.requirement.sourceRequirements.push({ id: "negative-january-" + i, originalField: "/requires/2", originalDeclaration: c.originalResearchRecord.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", observationPointer: s.originalGraphEvidence[2].fact.observationPointer, fields: [] }, required: true, gaps: [] })); typed.requirement.requiredOwner = ["person"];
  const receipt = bindKnowledgeCandidate(typed, new ActualBindingIndex({ ...facts.request, restrictEvidenceTo: ids }, catalog), catalog);
  expect(receipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")).toMatchObject({ state: "FAIL", reasons: ["NO_TIME_INTERSECTION"] });
});
it.each([
  ["wrong December year", "sourceWitness.priorYear", 2099], ["foreign Fixture", "sourceWitness.fixtureId", "foreign"], ["foreign Owner", "sourceWitness.owner", "foreign"],
  ["different day master", "sourceWitness.inputBasis.dayMaster", "invented"], ["different natal basis", "sourceWitness.inputBasis.natalBranches", []], ["different CustomerDayun", "sourceWitness.inputBasis.customerDayunHash", "foreign"],
  ["different original input", "sourceWitness.originalInputHash", "foreign"], ["nonexistent December", "sourceWitness.december.segments", []], ["forged original Graph Node", "sourceWitness.originalGraphEvidence", ["forged"]],
  ["forged root", "sourceWitness.originalFactRoots", ["forged"]], ["source hash", "sourceWitness.sourceProof.0.actualHash", "foreign"], ["producer version", "sourceWitness.producer.version", "foreign"],
  ["false approval", "sourceWitness.customerUseAllowed", true], ["fabricated Meaning", "sourceWitness.meaningIdentity", "invented"]
] as [string, string, unknown][])("rejects adjacent-year source forgery: %s", async (_name, path, value) => {
  expect((await validatePriorDecember(result.context!, change(structuredClone(availability()), path, value))).ok).toBe(false);
});
it.each([
  ["research Source Hash", "originalSourceProof.research.actualHash", "foreign"], ["missing original segment", "segmentResults", []], ["forged current Graph Node", "segmentResults.0.originalGraphEvidence.0.id", "foreign"],
  ["January 1 as Ipchun", "januaryBoundaryProof.civilYearStartIsIpchun", true], ["nominal as effective", "segmentResults.0.originalSegment.effectiveAnnualPillar", { stem: "丙", branch: "午" }],
  ["altered Sohan", "januaryBoundaryProof.sohan.instantKst", "2026-01-01T00:00:00+09:00"], ["missing January segment", "sourcePreconditions.everyCanonicalSegment", []],
  ["reversed comparison", "crossYearComparison.beforeWindow.start", "2099-01-01T00:00:00+09:00"], ["source-free prior comparison", "priorDecember.sourceWitness", null],
  ["forged Original Receipt", "originalNativeReceipt.receiptId", "foreign"], ["removed Counterexample", "originalCandidate.requirement.counterexamples", []], ["removed Prohibition", "originalCandidate.requirement.prohibitions", []],
  ["removed Source Group contract", "originalCandidate.requirement.sourceGroups", null], ["fabricated Meaning", "originalMeaningIdentity", "invented"], ["fabricated Claim", "originalClaimIdentity", "invented"],
  ["customer approval", "customerApprovals", 1], ["extra Fact Root", "originalFactRoots", ["invented"]], ["gate bypass", "typedBindings.0.typedNativeReceipt.allTwelveGateResults", []]
] as [string, string, unknown][])("rejects January contract forgery: %s", async (_name, path, value) => {
  expect((await validateJanuaryCandidate(result.context!, change(structuredClone(candidate()), path, value))).ok).toBe(false);
});
it("rejects a source witness from another authentic optional-source context", async () => {
  expect((await validateJanuaryCandidate(withheld.context!, candidate())).ok).toBe(false);
});
it("rejects cloned contexts, customer publication and Planner assignment", async () => {
  expect((await evaluateJanuary(structuredClone(result.context!))).ok).toBe(false);
  expect((await validateJanuaryCandidate(result.context!, candidate(), "CUSTOMER_PUBLICATION")).ok).toBe(false);
  expect((await validateJanuaryCandidate(result.context!, candidate(), "PLANNER_ASSIGNMENT")).ok).toBe(false);
  expect((await validatePriorDecember(result.context!, availability(), "CUSTOMER_PUBLICATION")).ok).toBe(false);
});
it("is deterministic and leaves original calculation, Graph and receipt bytes unchanged", async () => {
  const before = actualSemanticDigest([facts.request, facts.handoff, facts.native]), a = await evaluateJanuary(result.context!), b = await evaluateJanuary(result.context!);
  expect(a.ok && b.ok).toBe(true); expect(actualSemanticDigest(a)).toBe(actualSemanticDigest(b)); expect(actualSemanticDigest([facts.request, facts.handoff, facts.native])).toBe(before);
});
