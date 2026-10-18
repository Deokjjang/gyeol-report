import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualMonthMatrix } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-month-matrix/adapter";
import { createMatrixCandidate, validateMatrixCandidate, MATRIX_CONTRACTS } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-month-matrix/contract";
import type { ActualCalculationRun } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-specialist-claim-contract/contract";
import { actualSemanticDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
import type { KnowledgeCatalogRecord, KnowledgeReferenceEdge, CatalogConfig } from "@/lib/report-knowledge/knowledge-integration-foundation/types";
import type { SemanticInputs, SemanticConfig, SemanticDomainDecision } from "@/lib/report-knowledge/knowledge-integration-foundation/semantic-domain-verification/types";
import type { VerificationConfig, VerificationReceipt } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/types";
import type { KnowledgeBindingRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/types";
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

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualMonthMatrix>>, { ok: true }>;
let facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, result: Run, foundation: ProductSpecialistFoundation;
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, { resolver, foundation });
  if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualMonthMatrix(f.request, f, { resolver, foundation });
  if (!r.ok) throw Error(r.reasons.join()); if (r.withheld.length) throw Error(JSON.stringify(r.withheld)); result = r;
}, 240000);
const candidate = (month: 7 | 12 = 7) => result.handoff.newMatrixCandidates.find(c => c.month === month)!;
it.each([7, 12] as const)("binds each declared month independently over every actual segment: %s", async month => {
  const rows = result.handoff.newMatrixCandidates.filter(c => c.month === month); expect(rows).toHaveLength(2);
  for (const c of rows) {
    expect(c.originalResearchId).toBe(MATRIX_CONTRACTS[month].originalId);
    expect(c.originalSourceProof.actualHash).toBe(MATRIX_CONTRACTS[month].recordSha256);
    expect(c.originalNativeReceipt.selectedActualEvidence).toEqual([]);
    expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(result.baseline.baseline.native.receipts.find(r => r.receiptId === c.originalNativeReceipt.receiptId)));
    expect(c.typedNativeReceipt.selectedActualEvidence).toHaveLength(month === 7 ? 3 : 2);
    expect(c.allTwelveGateResults).toHaveLength(12);
    expect(c.sourcePreconditions.allSegmentPointers).toHaveLength(2);
    expect(c.sourcePreconditions.ledger).toHaveLength(3);
    expect(c.selectedGraphFacts.every(n => n.window?.start === c.effectiveInterval.start && n.window.endExclusive === c.effectiveInterval.endExclusive && n.ancestry.complete)).toBe(true);
    for (const field of ["unresolvedConditions", "sourceGroups", "counterexamples", "prohibitions", "requiredUserState", "meaningIdentity", "claimIdentity"] as const) expect(c.typedCandidate.requirement[field]).toEqual(c.originalCandidate.requirement[field]);
    expect(c.typedCandidate.requirement.sourceRequirements.slice(0, c.originalCandidate.requirement.sourceRequirements.length)).toEqual(c.originalCandidate.requirement.sourceRequirements);
    expect(c.originalFactRoots).toEqual([...new Set(c.originalFactRoots)].sort());
    expect(c.originalFactRoots.every(r => result.handoff.originalFactRoots.includes(r))).toBe(true);
    expect(c.originalMeaningIdentity).toBeNull(); expect(c.originalClaimIdentity).toBeNull();
    expect(c.allTwelveGateResults.find(g => g.gate === "ACTUAL_USER_STATE")?.state).toBe("UNKNOWN");
    expect(c.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")?.state).toBe("REVIEW_REQUIRED");
    expect((await validateMatrixCandidate(result.context!, structuredClone(c))).ok).toBe(true);
  }
});
it("keeps active-cycle support separate from a god meaning and from native receipt reference roots", () => {
  const c = candidate(); expect(c.sourcePreconditions.annualContinues).toBe(true);
  expect(c.verifiedCalculationFacts.map(u => u.originLayer)).toEqual(["DAYUN_STEM", "ANNUAL_STEM"]);
  expect(c.verifiedCalculationFacts.every(u => c.typedNativeReceipt.selectedActualEvidence.includes(u.originalEvidenceNodeId))).toBe(true);
  expect(c.additionalReferenceRoots).toHaveLength(1);
  expect(c.additionalReferenceRoots.every(r => !c.originalFactRoots.includes(r))).toBe(true);
  expect(c.typedCandidate.requirement.sourceRequirements.slice(-3).some(r => r.selector?.fields.some(f => /God$/.test(f.path)))).toBe(false);
});
it("uses December Graph facts without issuing fake Units or a next-year segment", () => {
  const c = candidate(12); expect(c.verifiedActualUnitIds).toEqual([]); expect(c.verifiedCalculationFacts).toEqual([]);
  expect(c.sourcePreconditions.nextYear).toBe("UNAVAILABLE_NO_EXTRAPOLATION"); expect(c.sourcePreconditions.nextYearSegmentIds).toEqual([]);
  expect(c.sourcePreconditions.ledger.at(-1)!.window.endExclusive).toBe("2027-01-01T00:00:00+09:00");
});
it("preserves all previous May candidates and the ten ambiguous monthly-god Sources", () => {
  expect(result.handoff.historicalMayCandidates).toEqual(result.baseline.handoff.technicalCandidates); expect(result.handoff.historicalMayCandidates).toHaveLength(2);
  const n = result.baseline.baseline.native; if (n.version !== "annual-fortune-specialist-v1") throw Error("ANNUAL_REQUIRED");
  const ds = n.diagnostics.filter(d => d.researchKind === "MONTHLY_TEN_GOD"); expect(ds).toHaveLength(10);
  expect(ds.every(d => d.receipt.selectedActualEvidence.length === 0 && d.monthMatches.every(m => m.god?.role === "AMBIGUOUS" && !m.god.matched))).toBe(true);
});
it.each(["month-source", "month-number-clone", "missing-previous", "invented-next", "nominal-annual", "uncertain-cycle", "stem-main-mix", "extrapolation", "owner", "producer-version", "source-hash", "old-receipt", "duplicate-root", "meaning-approved", "diagnostic-native", "synthetic", "actual-context", "official-approval", "source-group", "counterexample", "prohibition"])("rejects forged provenance or a relaxed condition: %s", async variant => {
  const c = structuredClone(candidate());
  if (variant === "month-source") c.originalCatalogKey = candidate(12).originalCatalogKey;
  if (variant === "month-number-clone") c.month = 12;
  if (variant === "missing-previous") c.sourcePreconditions.previousLastPointer = "missing";
  if (variant === "invented-next") Object.assign(c.sourcePreconditions, { nextYearSegmentIds: ["invented"] });
  if (variant === "nominal-annual") c.verifiedCalculationFacts[1].effectiveAnnualPillar = "NOMINAL";
  if (variant === "uncertain-cycle") c.sourcePreconditions.ledger[1].activeDayunContext.status = "transition_uncertain";
  if (variant === "stem-main-mix") c.verifiedCalculationFacts[0].originLayer = "MONTH_BRANCH_MAIN";
  if (variant === "extrapolation") c.effectiveInterval.endExclusive = "2030-01-01T00:00:00+09:00";
  if (variant === "owner") c.selectedGraphFacts[0].owner.fixtureOwnerId = "foreign";
  if (variant === "producer-version") c.selectedGraphFacts[0].producer.version = "forged";
  if (variant === "source-hash") c.originalSourceProof.actualHash = "forged";
  if (variant === "old-receipt") c.originalNativeReceipt.selectedActualEvidence.push("forged");
  if (variant === "duplicate-root") c.originalFactRoots.push(c.originalFactRoots[0]);
  if (variant === "meaning-approved") c.allTwelveGateResults.find(g => g.gate === "INTERPRETATION_REVIEW")!.state = "PASS";
  if (variant === "diagnostic-native") c.typedNativeReceipt.selectedActualEvidence = ["diagnostic-only"];
  if (variant === "synthetic") c.originalMeaningIdentity = "SYNTHETIC_TEST_ONLY";
  if (variant === "actual-context") c.typedCandidate.requirement.unresolvedConditions = [];
  if (variant === "official-approval") Object.assign(c, { customerUseAllowed: true, customerApprovals: 1 });
  if (variant === "source-group") Reflect.deleteProperty(c.typedCandidate.requirement, "sourceGroups");
  if (variant === "counterexample") c.typedCandidate.requirement.counterexamples = [];
  if (variant === "prohibition") c.typedCandidate.requirement.prohibitions = [];
  expect((await validateMatrixCandidate(result.context!, c)).ok).toBe(false);
});
it.each(["source-hash", "source-record"])("rereads exact original Source: %s", async variant => {
  const proof = resolver.proof.bind(resolver), record = resolver.record.bind(resolver);
  if (variant === "source-hash") resolver.proof = async (...args) => ({ ...await proof(...args), actualHash: "forged" });
  else resolver.record = async (...args) => ({ ...await record(...args) as Record<string, unknown>, month: 5 });
  try { expect((await createMatrixCandidate(result.context!, 7, candidate().originalCatalogKey, candidate().segmentPointer)).ok).toBe(false); }
  finally { resolver.proof = proof; resolver.record = record; }
});
it("rejects mismatched month/Source/segment and cloned contexts", async () => {
  expect((await createMatrixCandidate(result.context!, 7, candidate(12).originalCatalogKey, candidate().segmentPointer)).ok).toBe(false);
  expect((await createMatrixCandidate(result.context!, 7, candidate().originalCatalogKey, candidate(12).segmentPointer)).ok).toBe(false);
  expect((await createMatrixCandidate(structuredClone(result.context!), 7, candidate().originalCatalogKey, candidate().segmentPointer)).ok).toBe(false);
});
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("never approves %s", async usage => {
  expect(await validateMatrixCandidate(result.context!, candidate(), usage)).toMatchObject({ ok: false, reasons: ["CUSTOMER_CLAIM_NOT_AUTHORIZED"] });
});
it("recreates deterministically and leaves original request, facts, receipts and May candidates unchanged", async () => {
  const before = actualSemanticDigest([facts.request, facts.handoff, facts.native, result.baseline.handoff]);
  expect(await createMatrixCandidate(result.context!, 7, candidate().originalCatalogKey, candidate().segmentPointer)).toEqual({ ok: true, candidate: candidate() });
  expect(actualSemanticDigest([facts.request, facts.handoff, facts.native, result.baseline.handoff])).toBe(before);
});
