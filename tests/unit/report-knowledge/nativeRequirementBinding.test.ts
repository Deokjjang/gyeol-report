import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptNativeRequirementBindings } from "@/lib/report-knowledge/knowledge-integration-foundation/native-requirement-binding/adapter";
import { createNativeRequirementCandidate, validateNativeRequirementCandidate, NATIVE_MONTH_PAIR_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/native-requirement-binding/contract";
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

type Run = Extract<Awaited<ReturnType<typeof adaptNativeRequirementBindings>>, { ok: true }>;
let facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, result: Run, foundation: ProductSpecialistFoundation;
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, { resolver, foundation });
  if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptNativeRequirementBindings(f.request, f, { resolver, foundation });
  if (!r.ok) throw Error(r.reasons.join());
  if (r.withheld.length) throw Error(JSON.stringify(r.withheld)); result = r;
}, 240000);
const candidate = () => result.handoff.technicalCandidates[0];
it("binds the exact original both-role declaration for every May segment without rewriting old receipts", async () => {
  expect(result.context).not.toBeNull();
  expect(result.handoff.originalNativeReceipts).toBe(109);
  expect(result.baseline.handoff.candidates).toHaveLength(0);
  expect(result.handoff.technicalCandidates).toHaveLength(2); expect(result.withheld).toEqual([]);
  for (const c of result.handoff.technicalCandidates) {
    expect(c.originalResearchId).toBe(NATIVE_MONTH_PAIR_CONTRACT.originalId);
    expect(c.originalResearchProof.actualHash).toBe(NATIVE_MONTH_PAIR_CONTRACT.recordSha256);
    expect(c.originalNativeReceipt.selectedActualEvidence).toEqual([]);
    expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(result.baseline.native.receipts.find(r => r.receiptId === c.originalNativeReceipt.receiptId)));
    expect(c.verifiedCalculationFacts.map(u => u.originLayer)).toEqual(["MONTH_STEM", "MONTH_BRANCH_MAIN"]);
    expect(c.verifiedCalculationFacts.every(u => c.typedNativeReceipt.selectedActualEvidence.includes(u.originalEvidenceNodeId))).toBe(true);
    expect(c.typedNativeReceipt.selectedActualEvidence).toHaveLength(2); // one shared god node + boundary, not two invented facts
    expect(c.originalFactRoots.length).toBe(new Set(c.originalFactRoots).size);
    expect(c.verifiedCalculationFacts.every(u => u.canonicalFactRoot === null)).toBe(true);
    expect(c.originalFactRoots).toEqual(c.verifiedUnitFactRoots);
    expect(c.verifiedUnitFactRoots).toEqual([...new Set(c.verifiedCalculationFacts.flatMap(u => u.canonicalFactRoots))].sort());
    expect(c.typedCandidate.requirement.sourceRequirements.slice(0, c.originalCandidate.requirement.sourceRequirements.length)).toEqual(c.originalCandidate.requirement.sourceRequirements);
    for (const field of ["sourceGroups", "unresolvedConditions", "counterexamples", "prohibitions", "requiredUserState", "meaningIdentity", "claimIdentity"] as const) expect(c.typedCandidate.requirement[field]).toEqual(c.originalCandidate.requirement[field]);
    expect(c.originalMeaningIdentity).toBeNull(); expect(c.originalClaimIdentity).toBeNull();
    expect(c.allTwelveGateResults).toHaveLength(12);
    expect(c.reviewStates).toContain("ACTUAL_CONTEXT_REQUIRED"); expect(c.reviewStates).toContain("MEANING_REVIEW_REQUIRED");
    expect(c.allTwelveGateResults.find(g => g.gate === "ACTUAL_USER_STATE")?.state).toBe("UNKNOWN");
    expect(c.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")?.state).toBe("REVIEW_REQUIRED");
    expect(c).toMatchObject({ customerUseAllowed: false, plannerUseAllowed: false, customerClaims: 0, newFactRoots: 0 });
    expect((await validateNativeRequirementCandidate(result.context!, structuredClone(c))).ok).toBe(true);
  }
});
it("keeps all ten original monthly-god roles ambiguous instead of promoting alternatives", async () => {
  if (result.baseline.native.version !== "annual-fortune-specialist-v1") throw Error("ANNUAL_REQUIRED");
  const ds = result.baseline.native.diagnostics.filter(d => d.researchKind === "MONTHLY_TEN_GOD");
  expect(ds).toHaveLength(10);
  expect(ds.every(d => d.receipt.selectedActualEvidence.length === 0 && d.monthMatches.every(m => m.god?.role === "AMBIGUOUS" && !m.god.matched))).toBe(true);
  expect((await createNativeRequirementCandidate(result.context!, ds[0].catalogKey, candidate().segment.pointer)).ok).toBe(false);
});
it.each(["source-hash", "research", "role-guess", "role-mix", "nominal-annual", "flow-reference", "extrapolation", "owner", "foreign-evidence", "duplicate-root", "diagnostic-selection", "context", "meaning", "source-group", "counterexample", "prohibition", "gate-pass", "approval"])("rejects a changed technical candidate: %s", async variant => {
  const c = structuredClone(candidate());
  if (variant === "source-hash") c.originalResearchProof.actualHash = "forged";
  if (variant === "research") c.originalResearchId = "afpr:month-slot:06";
  if (variant === "role-guess") c.verifiedCalculationFacts[0].originLayer = "ANNUAL_STEM";
  if (variant === "role-mix") c.verifiedCalculationFacts.reverse();
  if (variant === "nominal-annual") c.verifiedCalculationFacts[0].effectiveAnnualPillar = "NOMINAL";
  if (variant === "flow-reference") c.verifiedCalculationFacts[0].referenceBasis = "DAYUN_STEM";
  if (variant === "extrapolation") c.segment.window.endExclusive = "2030-01-01T00:00:00+09:00";
  if (variant === "owner") c.verifiedCalculationFacts[0].owner.fixtureOwnerId = "foreign";
  if (variant === "foreign-evidence") c.verifiedCalculationFacts[0] = structuredClone(facts.handoff.units.find(u => u.originLayer === "FLOW_GOD")!);
  if (variant === "duplicate-root") c.originalFactRoots.push(c.originalFactRoots[0]);
  if (variant === "diagnostic-selection") c.typedNativeReceipt.selectedActualEvidence = ["diagnostic-alternative"];
  if (variant === "context") c.typedCandidate.requirement.unresolvedConditions = [];
  if (variant === "meaning") c.originalMeaningIdentity = "invented";
  if (variant === "source-group") Reflect.deleteProperty(c.typedCandidate.requirement, "sourceGroups");
  if (variant === "counterexample") c.typedCandidate.requirement.counterexamples = [];
  if (variant === "prohibition") c.typedCandidate.requirement.prohibitions = [];
  if (variant === "gate-pass") c.allTwelveGateResults.forEach(g => { g.state = "PASS"; g.reasons = []; });
  if (variant === "approval") Object.assign(c, { customerUseAllowed: true, customerApprovals: 1 });
  expect((await validateNativeRequirementCandidate(result.context!, c)).ok).toBe(false);
});
it.each(["source-hash", "source-record"])("rechecks original Source rather than trusting saved approval: %s", async variant => {
  const proof = resolver.proof.bind(resolver), record = resolver.record.bind(resolver);
  if (variant === "source-hash") resolver.proof = async (...args) => ({ ...await proof(...args), actualHash: "forged" });
  else resolver.record = async (...args) => ({ ...await record(...args) as Record<string, unknown>, month: 6 });
  try { expect((await createNativeRequirementCandidate(result.context!, candidate().originalCatalogKey, candidate().segment.pointer)).ok).toBe(false); }
  finally { resolver.proof = proof; resolver.record = record; }
});
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("blocks internal technical candidates from %s", async usage => {
  expect(await validateNativeRequirementCandidate(result.context!, candidate(), usage)).toMatchObject({ ok: false, reasons: ["CUSTOMER_CLAIM_NOT_AUTHORIZED"] });
});
it("rejects cloned contexts and segment extrapolation", async () => {
  expect((await createNativeRequirementCandidate(structuredClone(result.context!), candidate().originalCatalogKey, candidate().segment.pointer)).ok).toBe(false);
  expect((await createNativeRequirementCandidate(result.context!, candidate().originalCatalogKey, candidate().segment.pointer + "/invented")).ok).toBe(false);
});
it("re-evaluates deterministically while preserving source, Graph and old receipts", async () => {
  const before = actualSemanticDigest([facts.request, facts.handoff, facts.native]);
  expect(await createNativeRequirementCandidate(result.context!, candidate().originalCatalogKey, candidate().segment.pointer)).toEqual({ ok: true, candidate: candidate() });
  expect(actualSemanticDigest([facts.request, facts.handoff, facts.native])).toBe(before);
});
