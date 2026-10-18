import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualTemporalComparisons } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-temporal-comparison/adapter";
import { evaluateComparisonMonth, validateComparisonCandidate, prepareComparisonContext, COMPARISON_CONTRACTS } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-temporal-comparison/contract";
import { actualSemanticDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
import { ActualBindingIndex } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/matching";
import { bindKnowledgeCandidate } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/engine";
import { intersectEvidencePeriods } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/temporal";
import { annualRoleSelector } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/annualSelector";
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

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualTemporalComparisons>>, { ok: true }>;
let result: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, { resolver, foundation }); if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualTemporalComparisons(f.request, f, { resolver, foundation }); if (!r.ok) throw Error(r.reasons.join()); result = r;
  if (r.withheld.length) throw Error(JSON.stringify(r.withheld));
}, 240000);
const candidate = (month: 3 | 9 = 3) => result.handoff.comparisonCandidates.find(c => c.month === month)!;
it.each([3, 9] as const)("binds each original Source independently: %s", async month => {
  const c = candidate(month); expect(c).toBeDefined(); expect(c.originalResearchId).toBe(COMPARISON_CONTRACTS[month].originalId); expect(c.originalSourceProof.actualHash).toBe(COMPARISON_CONTRACTS[month].recordSha256);
  expect(c.comparisonWitnesses).toHaveLength(2); expect(c.segmentProofs).toHaveLength(3); expect(c.typedReceipts).toHaveLength(3);
  expect(c.sourcePreconditions.allCurrentSegmentPointers).toHaveLength(2); expect(c.sourcePreconditions.actualJiePointer).toBe(c.comparisonWitnesses[1].afterSegmentPointer);
  expect(c.comparisonWitnesses.map(w => w.result)).toEqual([month === 3 ? "CONTINUITY" : "CARRYOVER_CONTINUITY", "VERIFIED_SIGNATURE_DIFFERENCE"]);
  expect(c.comparisonWitnesses[0].beforeSignature).toEqual(c.comparisonWitnesses[0].afterSignature);
  expect(c.comparisonWitnesses[0].changedRootSet.length).toBeGreaterThan(0); // Period roots differ, signatures do not.
  expect(c.comparisonWitnesses[1].changedFields).toContain("monthPillar"); expect(c.comparisonWitnesses[1].changedFields).not.toContain("effectiveAnnualPillar");
  expect(c.comparisonWitnesses.every(w => w.originalComparatorObservation.comparisonApproved === false && !w.comparisonApproved && w.independentInformationAdded === 0 && !w.independentCalculatedFact)).toBe(true);
  expect((await validateComparisonCandidate(result.context!, structuredClone(c))).ok).toBe(true);
}, 120000);
it("keeps Before/After windows separate and all source conditions and original gates intact", () => {
  for (const c of result.handoff.comparisonCandidates) {
    for (const w of c.comparisonWitnesses) { expect(intersectEvidencePeriods([w.beforeInterval, w.afterInterval]).state).toBe("NO_INTERSECTION"); expect(w.beforeInterval.endExclusive).toBe(w.afterInterval.start); expect(w.periodSemantics).toBe("NON_SIMULTANEOUS_COMPARISON"); }
    for (const t of c.typedReceipts) {
      expect(t.typedNativeReceipt.allTwelveGateResults).toHaveLength(12); expect(t.typedNativeReceipt.selectedActualEvidence).toHaveLength(4);
      expect(t.typedNativeReceipt.temporalWitnesses.every(w => w.start === c.segmentProofs.find(p => p.pointer === t.segmentPointer)!.interval.start && w.endExclusive === c.segmentProofs.find(p => p.pointer === t.segmentPointer)!.interval.endExclusive)).toBe(true);
      for (const key of ["unresolvedConditions", "sourceGroups", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity", "requiredUserState"] as const) expect(t.typedCandidate.requirement[key]).toEqual(c.originalCandidate.requirement[key]);
      expect(t.typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")?.state).toBe("PASS");
      expect(t.typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")?.state).toBe("REVIEW_REQUIRED");
    }
    expect(c.originalNativeReceipt.selectedActualEvidence).toEqual([]); expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(c.originalNativeReceipt));
    expect(c.originalMeaningIdentity).toBeNull(); expect(c.originalClaimIdentity).toBeNull(); expect(c.newFactRoots).toBe(0); expect(c.verifiedActualUnitIds).toEqual([]);
  }
});
it("a real combined Binder request fails the unchanged simultaneous TIME_INTERSECTION gate", () => {
  const c = candidate(), typed = structuredClone(c.originalCandidate), native = result.baseline.baseline.baseline.baseline.native;
  if (native.version !== "annual-fortune-specialist-v1") throw Error("ANNUAL_REQUIRED");
  const pair = c.comparisonWitnesses[0], segments = [pair.beforeSegmentPointer, pair.afterSegmentPointer].map(p => native.observation.segments.find(s => s.originalPointer === p)!.contract);
  for (const [i, s] of segments.entries()) typed.requirement.sourceRequirements.push({ id: "negative-simultaneous-" + i, originalField: "/requires/2", originalDeclaration: c.originalResearchRecord.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: annualRoleSelector("MONTH_PILLAR", undefined, s), required: true, gaps: [] });
  typed.requirement.requiredOwner = ["person"];
  const index = new ActualBindingIndex({ ...facts.request, restrictEvidenceTo: segments.map(s => s.componentNodeIds.month!) }, catalog);
  const receipt = bindKnowledgeCandidate(typed, index, catalog); expect(receipt.selectedActualEvidence).toHaveLength(2);
  expect(receipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")).toMatchObject({ state: "FAIL", reasons: ["NO_TIME_INTERSECTION"] });
});
it.each(["foreign-owner", "year", "fixture", "source-month", "source-hash", "segment-id", "reversed", "not-adjacent", "invented-previous", "fake-jie", "producer", "participant", "signature", "false-difference", "new-root", "repeated-as-independent", "uncertain-confirmed", "simultaneous", "relaxed-gate", "original-receipt", "source-group", "counterexample", "meaning-claim", "approval", "synthetic"])("rejects forged comparison contract: %s", async variant => {
  const c = structuredClone(candidate()), w = c.comparisonWitnesses[0];
  if (variant === "foreign-owner") w.owner = "foreign";
  if (variant === "year") c.sourcePreconditions.selectedYear++;
  if (variant === "fixture") w.fixtureId = "fixture-foreign";
  if (variant === "source-month") c.originalCatalogKey = candidate(9).originalCatalogKey;
  if (variant === "source-hash") c.originalSourceProof.actualHash = "forged";
  if (variant === "segment-id") w.beforeSegmentPointer = "forged";
  if (variant === "reversed") [w.beforeSegmentPointer, w.afterSegmentPointer] = [w.afterSegmentPointer, w.beforeSegmentPointer];
  if (variant === "not-adjacent") w.beforeInterval.endExclusive = "2026-02-28T00:00:00+09:00";
  if (variant === "invented-previous") c.sourcePreconditions.previousLastPointer = "invented";
  if (variant === "fake-jie") w.actualBoundary.instant = "2026-03-02T00:00:00+09:00";
  if (variant === "producer") w.beforeProducer.version = "forged";
  if (variant === "participant") c.segmentProofs[0].graphEvidence.find(n => n.participants.length)!.participants[0].value = "forged";
  if (variant === "signature") w.beforeSignature.stemTenGod = "정재" === w.beforeSignature.stemTenGod ? "편재" : "정재";
  if (variant === "false-difference") w.result = "VERIFIED_SIGNATURE_DIFFERENCE";
  if (variant === "new-root") w.changedRootSet.push("invented-root");
  if (variant === "repeated-as-independent") Object.assign(w, { independentInformationAdded: 1, independentCalculatedFact: true });
  if (variant === "uncertain-confirmed") c.segmentProofs[0].signature.activeDayunContext.status = "transition_uncertain";
  if (variant === "simultaneous") Object.assign(w, { periodSemantics: "SIMULTANEOUS" });
  if (variant === "relaxed-gate") c.typedReceipts[0].typedNativeReceipt.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")!.state = "PASS";
  if (variant === "original-receipt") c.originalNativeReceipt.selectedActualEvidence.push("forged");
  if (variant === "source-group") Reflect.deleteProperty(c.typedReceipts[0].typedCandidate.requirement, "sourceGroups");
  if (variant === "counterexample") c.typedReceipts[0].typedCandidate.requirement.counterexamples = [];
  if (variant === "meaning-claim") Object.assign(c, { originalMeaningIdentity: "invented", originalClaimIdentity: "invented" });
  if (variant === "approval") Object.assign(c, { customerUseAllowed: true, customerApprovals: 1 });
  if (variant === "synthetic") { c.typedReceipts[0].typedCandidate.provenance = "SYNTHETIC_TEST_ONLY"; Object.assign(c, { customerUseAllowed: true }); }
  expect((await validateComparisonCandidate(result.context!, c)).ok).toBe(false);
}, 120000);
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("never authorizes %s", async use => {
  expect((await validateComparisonCandidate(result.context!, candidate(), use)).ok).toBe(false);
});
it("recomputes deterministically and never trusts a cloned context or altered source proof", async () => {
  const before = actualSemanticDigest([facts.request, facts.handoff, facts.native]);
  const c = candidate(); expect((await evaluateComparisonMonth(result.context!, 3, c.originalCatalogKey))).toMatchObject({ ok: true, candidate: c });
  expect((await evaluateComparisonMonth(structuredClone(result.context!), 3, c.originalCatalogKey)).ok).toBe(false);
  const proof = resolver.proof.bind(resolver); resolver.proof = async (...args) => ({ ...await proof(...args), actualHash: "forged" });
  try { expect((await evaluateComparisonMonth(result.context!, 3, c.originalCatalogKey)).ok).toBe(false); } finally { resolver.proof = proof; }
  expect(actualSemanticDigest([facts.request, facts.handoff, facts.native])).toBe(before);
}, 120000);
it("rejects changed Graph, packet, owner or native receipts before accepting a context", async () => {
  const request = structuredClone(facts.request); request.graph.context.owners.person = "foreign";
  expect((await prepareComparisonContext(request, facts, { resolver, foundation })).ok).toBe(false);
});

it("withholds actual unknown-hour/MBTI F relations instead of promoting an incomplete comparison", async () => {
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "F" }, { resolver, foundation });
  if (!f.ok) throw Error(f.reasons.join());
  const before = actualSemanticDigest([f.request, f.handoff, f.native]);
  const r = await adaptAnnualTemporalComparisons(f.request, f, { resolver, foundation });
  if (!r.ok) throw Error(r.reasons.join());
  expect(r.handoff.comparisonCandidates).toHaveLength(0);
  expect(r.withheld.map(w => w.month)).toEqual([3, 9]);
  expect(r.observations).toHaveLength(2);
  for (const o of r.observations) {
    expect(o.sourcePreconditions.allCurrentSegmentPointers).toHaveLength(2);
    expect(o.comparisonWitnesses).toHaveLength(2);
    expect(o.comparisonWitnesses.every(w => w.result === "WITHHELD" && w.reasons.includes("UNKNOWN_BIRTH_TIME_ELEMENT_LIMIT") && w.changedFields.length === 0)).toBe(true);
  }
  expect(actualSemanticDigest([f.request, f.handoff, f.native])).toBe(before);
}, 240000);
