import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualFebruaryRelations } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-february-relation/adapter";
import { evaluateFebruary, validateFebruaryCandidate, prepareFebruaryContext, validateApplicabilityWitness, FEBRUARY_CONTRACT, FEBRUARY_SOURCE_FILES } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-february-relation/contract";
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

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualFebruaryRelations>>, { ok: true }>;
let result: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
const services = () => ({ resolver, foundation });
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "H2025" }, services()); if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualFebruaryRelations(f.request, f, services()); if (!r.ok) throw Error(r.reasons.join()); result = r;
  if (!r.handoff.februaryCandidates.length) throw Error("NONEMPTY_DECLARATION_CASE_REQUIRED");
}, 240000);
const candidate = () => result.handoff.februaryCandidates[0];
it("verifies original nonempty declarations only within their effective annual scope", async () => {
  const c = candidate(); expect(c.originalResearchId).toBe(FEBRUARY_CONTRACT.originalId); expect(c.originalSourceProof.research.actualHash).toBe(FEBRUARY_CONTRACT.recordSha256);
  expect(c.ipchunBoundary.valid).toBe(true); expect(c.segmentResults).toHaveLength(2); expect(c.typedBindings).toHaveLength(2);
  expect(c.sourcePreconditions.originalDeclarationCount).toBeGreaterThan(0);
  const before = c.segmentResults[0], after = c.segmentResults[1];
  expect(before.originalSegment.endKstExclusive).toBe(c.ipchunBoundary.instantKst); expect(after.originalSegment.startKst).toBe(c.ipchunBoundary.instantKst);
  for (const w of before.applicabilityWitnesses) { expect(w.applicabilityState).toBe("NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT"); expect(w.nominalAnnualStem).not.toBe(w.effectiveAnnualStem); }
  for (const w of after.applicabilityWitnesses) {
    expect(w.applicabilityState).toBe("APPLICABLE_VERIFIED_DECLARATION_SCOPE"); expect(w.nominalAnnualStem).toBe(w.effectiveAnnualStem);
    expect(w.originalNominalValidator!.reasons).toContain("NO_DEDICATED_SEGMENT_STEM_RELATION_GRAPH_ID");
    expect(w.originalNatalStemEvidence!.participants).toEqual([{ owner: w.actualOwner.fixtureOwnerId, position: w.natalPosition, slot: "stem", value: w.natalStem }]);
    expect(w.originalNatalStemEvidence!.fact.observationPointer).toBe(`/calculations/person/pillars/${w.natalPosition}/stem`);
    expect(w.originalAnnualRelationDeclaration!.annualStem).toBe(w.nominalAnnualStem);
    expect(w.producerVersion).toBe(FEBRUARY_SOURCE_FILES["src/lib/interpretation-v4/annualEvidence.ts"]);
    expect(w.originalAncestry.every(a => a.ancestry.complete && !a.ancestry.cycle)).toBe(true);
    expect(await validateApplicabilityWitness(result.context!, structuredClone(w))).toMatchObject({ ok: true, eligibleAsCalculatedRelationFact: false });
  }
  expect(await validateFebruaryCandidate(result.context!, structuredClone(c))).toMatchObject({ ok: true });
}, 120000);
it("separates Source preconditions from exactly three original Binder facts and all original gates", () => {
  const c = candidate(); expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(c.originalNativeReceipt));
  for (const b of c.typedBindings) {
    expect(b.typedNativeReceipt.selectedActualEvidence).toHaveLength(3); expect(b.sourceWitnessesAreGraphFacts).toBe(false);
    expect(b.typedNativeReceipt.allTwelveGateResults).toHaveLength(12);
    expect(b.typedNativeReceipt.temporalWitnesses.every(w => w.start === b.effectiveInterval.start && w.endExclusive === b.effectiveInterval.endExclusive)).toBe(true);
    for (const key of ["unresolvedConditions", "sourceGroups", "requiredContext", "products", "relationships", "requiredUserState", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity"] as const) expect(b.typedCandidate.requirement[key]).toEqual(c.originalCandidate.requirement[key]);
    for (const g of b.typedNativeReceipt.allTwelveGateResults) if (!["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"].includes(g.gate)) { const old = c.originalNativeReceipt.allTwelveGateResults.find(v => v.gate === g.gate)!; expect([g.state, g.reasons]).toEqual([old.state, old.reasons]); }
  }
  for (const w of c.applicabilityWitnesses) { expect(w.graphRelationNodeId).toBeNull(); expect(w.calculatedRelationFactVerified).toBe(false); expect(w.newFactRoots).toBe(0); }
  expect(c.originalMeaningIdentity).toBeNull(); expect(c.originalClaimIdentity).toBeNull(); expect(c.customerClaims).toBe(0); expect(c.customerApprovals).toBe(0); expect(c.customerReaderBridges).toBe(0); expect(c.plannerUseAllowed).toBe(false);
});
it("retains original half-open TIME_INTERSECTION and rejects a single receipt combining pre/post Ipchun", () => {
  const c = candidate(), typed = structuredClone(c.originalCandidate), ids = c.segmentResults.map(s => s.originalGraphEvidence[2].id);
  c.segmentResults.forEach((s, i) => typed.requirement.sourceRequirements.push({ id: "negative-ipchun-" + i, originalField: "/requires/2", originalDeclaration: c.originalResearchRecord.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", observationPointer: s.originalGraphEvidence[2].fact.observationPointer, fields: [] }, required: true, gaps: [] }));
  typed.requirement.requiredOwner = ["person"];
  const index = new ActualBindingIndex({ ...facts.request, restrictEvidenceTo: ids }, catalog), receipt = bindKnowledgeCandidate(typed, index, catalog);
  expect(receipt.selectedActualEvidence).toHaveLength(2); expect(receipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")).toMatchObject({ state: "FAIL", reasons: ["NO_TIME_INTERSECTION"] });
});
it.each(["foreign-fixture", "foreign-declaration", "owner", "natal-position", "unknown-hour", "natal-stem", "annual-stem", "nominal-effective", "pre-ipchun", "at-ipchun", "boundary", "segment-deleted", "source-hash", "producer-version", "combination-table", "declaration-forged", "absent-as-relation", "witness-as-fact", "root-added", "original-receipt", "time-gate", "meaning", "source-group", "counterexample", "customer-approval"])("rejects forged February candidate: %s", async variant => {
  const c = structuredClone(candidate()), before = c.segmentResults[0], after = c.segmentResults[1], w = c.applicabilityWitnesses.at(-1)!;
  if (variant === "foreign-fixture") w.fixtureId = "foreign";
  if (variant === "foreign-declaration") w.declarationIdentity.hash = "foreign";
  if (variant === "owner") w.actualOwner.fixtureOwnerId = "foreign";
  if (variant === "natal-position") w.natalPosition = "foreign-position";
  if (variant === "unknown-hour") { w.natalPosition = "hour"; w.originalNatalStemEvidence!.participants[0].position = "invented-hour"; }
  if (variant === "natal-stem") Object.assign(w, { natalStem: "forged" });
  if (variant === "annual-stem") Object.assign(w.originalAnnualRelationDeclaration!, { annualStem: "forged" });
  if (variant === "nominal-effective") w.effectiveAnnualStem = before.originalSegment.effectiveAnnualPillar.stem;
  if (variant === "pre-ipchun") before.applicabilityWitnesses[0].applicabilityState = "APPLICABLE_VERIFIED_DECLARATION_SCOPE";
  if (variant === "at-ipchun") after.originalSegment.effectiveAnnualPillar = before.originalSegment.effectiveAnnualPillar;
  if (variant === "boundary") c.ipchunBoundary.instantKst = before.originalSegment.startKst;
  if (variant === "segment-deleted") c.segmentResults.pop();
  if (variant === "source-hash") c.originalSourceProof.research.actualHash = "forged";
  if (variant === "producer-version") Object.assign(w.producerIdentity, { version: "forged" });
  if (variant === "combination-table") Object.assign(w.originalCombinationSource, { originalTable: [["甲", "乙"]] });
  if (variant === "declaration-forged") w.originalAnnualRelationDeclaration!.sourceRefs = [];
  if (variant === "absent-as-relation") { w.originalAnnualRelationDeclaration = null; w.applicabilityState = "APPLICABLE_VERIFIED_DECLARATION_SCOPE"; }
  if (variant === "witness-as-fact") Object.assign(w, { calculatedRelationFactVerified: true, graphRelationNodeId: w.witnessId });
  if (variant === "root-added") w.originalFactRoots.push("invented");
  if (variant === "original-receipt") c.originalNativeReceipt.selectedActualEvidence.push("invented");
  if (variant === "time-gate") c.typedBindings[0].typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")!.reasons.push("RELAXED");
  if (variant === "meaning") Object.assign(c, { originalMeaningIdentity: "invented" });
  if (variant === "source-group") Reflect.deleteProperty(c.typedBindings[0].typedCandidate.requirement, "sourceGroups");
  if (variant === "counterexample") c.typedBindings[0].typedCandidate.requirement.counterexamples = [];
  if (variant === "customer-approval") Object.assign(c, { customerUseAllowed: true, customerApprovals: 1 });
  expect((await validateFebruaryCandidate(result.context!, c)).ok).toBe(false);
}, 120000);
it("authenticates contexts and rechecks actual Source files, declaration table and research proofs", async () => {
  expect((await evaluateFebruary(structuredClone(result.context!))).ok).toBe(false);
  const originalProof = resolver.proof.bind(resolver); resolver.proof = async (...args) => ({ ...await originalProof(...args), actualHash: "forged" });
  try { expect(await evaluateFebruary(result.context!)).toMatchObject({ ok: false, applicabilityState: "SOURCE_OR_ADDRESS_UNVERIFIED" }); } finally { resolver.proof = originalProof; }
  const originalText = reader.text.bind(reader); reader.text = f => f === "src/lib/interpretation-v4/annualEvidence.ts" ? originalText(f) + "forged" : originalText(f);
  try { expect((await evaluateFebruary(result.context!)).ok).toBe(false); } finally { reader.text = originalText; }
  const originalExports = reader.exports.bind(reader); reader.exports = async f => f === "src/lib/saju/constants.ts" ? { ...await originalExports(f), STEM_COMBINATIONS: [["甲", "乙"]] } : originalExports(f);
  try { expect((await evaluateFebruary(result.context!)).ok).toBe(false); } finally { reader.exports = originalExports; }
  expect((await evaluateFebruary(result.context!)).ok).toBe(true);
}, 120000);
it("rejects a declaration injected into the original request before issuing an authentic context", async () => {
  const request = structuredClone(facts.request), c = request.graphInput.evidence.composition;
  if (c.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
  c.result.evidence.annualStemRelations[0].position = "hour";
  expect((await prepareFebruaryContext(request, facts, services())).ok).toBe(false);
}, 120000);
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("never authorizes %s", async usage => {
  expect((await validateFebruaryCandidate(result.context!, candidate(), usage)).ok).toBe(false);
});
it("reexecutes genuine empty A/F lists without inventing relations or unknown hour participants", async () => {
  for (const id of ["A", "F"]) {
    const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id }, services()); if (!f.ok) throw Error(f.reasons.join());
    const before = actualSemanticDigest([f.request, f.handoff, f.native]), r = await adaptAnnualFebruaryRelations(f.request, f, services()); if (!r.ok) throw Error(r.reasons.join());
    expect(r.handoff.februaryCandidates).toHaveLength(1); expect(r.observation!.originalDeclarations).toEqual([]);
    for (const w of r.observation!.applicabilityWitnesses) { expect(w.applicabilityState).toBe("NO_ORIGINAL_RELATION_DECLARATION"); expect(w.originalAnnualRelationDeclaration).toBeNull(); expect(w.originalNatalStemEvidence).toBeNull(); expect(w.producerReexecutionVerified).toBe(true); }
    const c = r.handoff.februaryCandidates[0]; expect(c.ipchunBoundary.instantKst).toBe("2026-02-04T05:02:08+09:00");
    expect(c.segmentResults.map(s => s.originalSegment.effectiveAnnualPillar)).toEqual([{ stem: "乙", branch: "巳" }, { stem: "丙", branch: "午" }]);
    const forged = structuredClone(c.applicabilityWitnesses[0]); forged.applicabilityState = "APPLICABLE_VERIFIED_DECLARATION_SCOPE";
    expect((await validateApplicabilityWitness(r.context!, forged)).ok).toBe(false);
    expect(actualSemanticDigest([f.request, f.handoff, f.native])).toBe(before);
  }
}, 300000);
