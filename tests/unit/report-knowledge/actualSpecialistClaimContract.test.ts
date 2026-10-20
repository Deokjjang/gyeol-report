import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptActualSpecialistClaims } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualSpecialistAdapter";
import { prepareActualSpecialistClaimContext, createActualSpecialistCandidate, validateActualSpecialistCandidate, type ActualCalculationRun } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-specialist-claim-contract/contract";
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

type Run = Extract<Awaited<ReturnType<typeof adaptActualSpecialistClaims>>, { ok: true }>;
const facts = new Map<string, ActualCalculationRun & { request: KnowledgeBindingRequest }>();
const results = new Map<string, Run>();
let foundation: ProductSpecialistFoundation;
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  for (const id of ["A", "C", "F"]) {
    const f = await runActualCalculationFixture(process.cwd(), { product: "major", id }, { resolver, foundation });
    if (!f.ok) throw Error("ACTUAL_FIXTURE_REQUIRED:" + f.reasons.join());
    facts.set(id, f);
    const r = await adaptActualSpecialistClaims(f.request, f, { resolver, foundation });
    if (!r.ok) throw Error("ACTUAL_SPECIALIST_REQUIRED:" + r.reasons.join());
    results.set(id, r);
  }
}, 240000);
function real(id = "A") { return results.get(id)!; }
function candidate(id = "A") { return real(id).handoff.candidates[0]; }

it.each(["A", "C"])("executes native Major diagnose and creates an exact internal candidate: %s", async id => {
  const r = real(id), c = candidate(id), f = facts.get(id)!;
  expect(r.handoff.candidates).toHaveLength(1); expect(r.originalReceiptsVerified).toBe(r.native.receipts.length);
  expect(c.originalSpecialistEngine).toBe("MajorFortuneSpecialistEngine");
  expect(c.originalNativeReceipt.selectedActualEvidence).toContain(c.originalEvidenceNodeIds[0]);
  expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(r.native.receipts.find(v => v.receiptId === c.originalNativeReceiptId)));
  expect(c.allTwelveGateResults).toEqual(c.originalNativeReceipt.allTwelveGateResults);
  expect(c.allTwelveGateResults).toHaveLength(12);
  expect(c.actualReviewStates).toEqual(expect.arrayContaining(["SPECIALIST_CANDIDATE_LINKED", "SOURCE_HELD", "MEANING_REVIEW_REQUIRED", "CONTEXT_REQUIRED", "APPROVAL_PENDING"]));
  expect(c.blockingReasons.some(b => b.code === "MISSING_REQUIRED_CONTEXT")).toBe(true);
  expect(c.originalClaimIdentity).toBeNull(); expect(c.originalMeaningIdentity).toBeNull();
  expect(c.verifiedCalculationFacts[0]).toEqual(f.handoff.units.find(u => u.unitId === c.verifiedActualUnitIds[0]));
  expect(c.conditionalInterpretation).toMatchObject({ evidenceKind: "CONDITIONAL_INTERPRETIVE_MEANING", meaningApproved: false });
  expect(c).toMatchObject({ customerUseAllowed: false, plannerUseAllowed: false, customerClaims: 0, newFactRoots: 0 });
  expect((await validateActualSpecialistCandidate(r.context, JSON.parse(JSON.stringify(c)))).ok).toBe(true);
});
it("retains inherited temporal conditions and Source ancestry without approving the thirty reviews", () => {
  const c = candidate(); expect(c.conditionalTemporalReview?.originalMeaningField).toBe("dayun");
  expect(c.conditionalTemporalReview?.originalConditionReview.extraEvidence).toBeTruthy();
  expect(c.conditionalTemporalReview?.originalConditionReview.natalRequired).toBe(c.originalResearchRecord.natalRequired);
  expect(c.conditionalTemporalReview?.originalConditionReview.elementRequired).toBe(c.originalResearchRecord.elementRequired);
  expect(c.conditionalTemporalReview).toMatchObject({ meaningReview: "MEANING_REVIEW_REQUIRED", customerApproval: "CUSTOMER_APPROVAL_PENDING" });
});
it("preserves unmatched native evidence as facts rather than invented Specialist selections", async () => {
  const r = real("F"); expect(r.handoff.candidates).toHaveLength(0);
  expect(r.handoff.unitStates.every(u => u.factState === "FACT_ONLY_VERIFIED" && u.nativeState === "UNMATCHED_NATIVE_EVIDENCE")).toBe(true);
  const f = facts.get("A")!, unmatched = f.handoff.units.find(u => !candidate().originalNativeReceipt.selectedActualEvidence.includes(u.originalEvidenceNodeId))!;
  expect((await createActualSpecialistCandidate(real().context, candidate().originalCatalogKey, unmatched.unitId)).ok).toBe(false);
});
it("keeps original root union and no Planner or customer assignments", () => {
  for (const id of ["A", "C", "F"]) {
    const r = real(id), f = facts.get(id)!;
    expect(r.handoff.originalFactRoots).toEqual([...new Set(f.handoff.units.flatMap(u => u.canonicalFactRoots))].sort());
    expect(r.handoff).toMatchObject({ newFactRoots: 0, customerClaims: 0, customerReaderBridges: 0, customerApprovals: 0, plannerAssignments: [], plannerUseAllowed: false });
    expect(r.handoff.repeatedRootGroups.every(g => g.independentFactsAdded === 0)).toBe(true);
  }
});
it("different actual fixtures retain different evidence and candidate identities", () => {
  expect(candidate().candidateId).not.toBe(candidate("C").candidateId);
  expect(candidate().originalEvidenceNodeIds).not.toEqual(candidate("C").originalEvidenceNodeIds);
  expect(candidate().verifiedCalculationFacts[0].calculatedTenGod).not.toBe(candidate("C").verifiedCalculationFacts[0].calculatedTenGod);
});
it("re-execution is deterministic and does not alter the request, Bridge or native receipts", async () => {
  const f = facts.get("A")!, before = actualSemanticDigest([f.request, f.handoff, f.native]);
  const second = await adaptActualSpecialistClaims(f.request, f, { resolver, foundation }); expect(second.ok).toBe(true);
  if (second.ok) expect(second.handoff).toEqual(real().handoff);
  expect(actualSemanticDigest([f.request, f.handoff, f.native])).toBe(before);
}, 60000);
it.each(["foreign-fixture", "native-receipt", "source-hash", "producer", "owner-root", "interval", "origin", "flow-basis", "conditional", "approval"])("rejects forged actual input or Foundation receipt: %s", async variant => {
  const f = facts.get("A")!, cloned = { ...f, handoff: structuredClone(f.handoff), native: structuredClone(f.native) };
  const u = cloned.handoff.units[0];
  if (variant === "foreign-fixture") cloned.handoff.units[0] = facts.get("C")!.handoff.units[0];
  if (variant === "native-receipt") { const gate = cloned.native.after.flatMap(r => r.allTwelveGateResults).find(g => g.gate === "SOURCE_INTEGRITY" && g.state === "FAIL")!; expect(gate.state).toBe("FAIL"); gate.state = "PASS"; }
  if (variant === "source-hash") u.sourceHash = "forged";
  if (variant === "producer") u.producerVersion = "forged";
  if (variant === "owner-root") u.owner.fixtureOwnerId = "other-owner";
  if (variant === "interval") u.effectiveInterval = { ...candidate().effectiveInterval!, scope: "annual", start: "2026-01-01T00:00:00+09:00", endExclusive: "2027-01-01T00:00:00+09:00", certainty: "confirmed" };
  if (variant === "origin") u.originLayer = "ANNUAL_STEM";
  if (variant === "flow-basis") { u.originLayer = "FLOW_GOD"; u.referenceBasis = "DAYUN_STEM"; }
  if (variant === "conditional") u.calculationCertainty = "conditional" as typeof u.calculationCertainty;
  if (variant === "approval") Object.assign(cloned.handoff, { customerApproval: 1 });
  expect((await prepareActualSpecialistClaimContext(f.request, cloned, { resolver, foundation })).ok).toBe(false);
});
it.each(["product", "research-id", "record-hash", "source-hash", "source-version", "receipt", "receipt-hash", "claim-id", "meaning-id", "meaning", "counterexamples", "prohibitions", "source-group", "source-requirements", "gate-pass", "owner", "roots", "interval", "origin", "producer", "diagnostic", "context", "approval", "synthetic", "multiple-periods"])("rejects altered Candidate provenance, conditions or gates: %s", async variant => {
  const c = structuredClone(candidate());
  if (variant === "product") c.product = "annual_fortune";
  if (variant === "research-id") c.originalResearchId = "mfpr:god:fake";
  if (variant === "record-hash") c.originalResearchRecordHash = "forged";
  if (variant === "source-hash") c.originalResearchProof.actualHash = "forged";
  if (variant === "source-version") c.originalSourceVersion = "forged";
  if (variant === "receipt") c.originalNativeReceipt.receiptId = "forged";
  if (variant === "receipt-hash") c.originalNativeReceiptHash = "forged";
  if (variant === "claim-id") c.originalClaimIdentity = "invented-claim";
  if (variant === "meaning-id") c.originalMeaningIdentity = "invented-meaning";
  if (variant === "meaning") c.conditionalInterpretation.originalText = "정재이므로 실제 소득이 증가한다";
  if (variant === "counterexamples") Reflect.deleteProperty(c, "counterexamples");
  if (variant === "prohibitions") Reflect.deleteProperty(c, "prohibitedInferences");
  if (variant === "source-group") Reflect.deleteProperty(c, "sourceGroups");
  if (variant === "source-requirements") c.sourceRequirements = [];
  if (variant === "gate-pass") c.allTwelveGateResults.forEach(g => { g.state = "PASS"; g.reasons = []; });
  if (variant === "owner") c.owner.fixtureOwnerId = "other-owner";
  if (variant === "roots") c.originalFactRoots.push("forged-root");
  if (variant === "interval") c.effectiveInterval = null;
  if (variant === "origin") c.originLayer = "ANNUAL_STEM";
  if (variant === "producer") c.verifiedCalculationFacts[0].producerVersion = "forged";
  if (variant === "diagnostic") c.nativeDiagnostic.originalResearchId = "forged";
  if (variant === "context") c.requiredConditions.original.natalRequired = "삭제";
  if (variant === "approval") Object.assign(c, { customerUseAllowed: true, customerAuthorizationState: "APPROVED" });
  if (variant === "synthetic") Object.assign(c, { syntheticDefinition: "required-2", conditionalInterpretation: { originalText: "SYNTHETIC_TEST_ONLY", meaningApproved: true } });
  if (variant === "multiple-periods") c.verifiedActualUnitIds.push(facts.get("C")!.handoff.units[0].unitId);
  expect((await validateActualSpecialistCandidate(real().context, c)).ok).toBe(false);
});
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("never authorizes an internally linked candidate for %s", async usage => {
  expect(await validateActualSpecialistCandidate(real().context, candidate(), usage)).toMatchObject({ ok: false, customerUseAllowed: false, reasons: ["CUSTOMER_CLAIM_NOT_AUTHORIZED"] });
});
it("rejects cloned contexts and cross-fixture Candidate reuse", async () => {
  expect((await createActualSpecialistCandidate(structuredClone(real().context), candidate().originalCatalogKey, candidate().verifiedActualUnitIds[0])).ok).toBe(false);
  expect((await validateActualSpecialistCandidate(real("C").context, candidate())).ok).toBe(false);
});

it("keeps the original selected cycle root separate from its verified day-master reference root", () => {
  const c = candidate(), u = c.verifiedCalculationFacts[0];
  expect(c.originalFactRoots).toEqual(c.originalNativeReceipt.canonicalFactRoots);
  expect(c.verifiedUnitFactRoots).toEqual(u.canonicalFactRoots);
  expect(c.originalFactRoots).toContain(u.canonicalFactRoot);
  expect(c.additionalReferenceRoots).toHaveLength(1);
  expect(c.additionalReferenceRoots.every(root => !c.originalFactRoots.includes(root))).toBe(true);
  expect(c.completeAncestry.nodes.some(n => c.additionalReferenceRoots.includes(n.factRoot!))).toBe(true);
  expect(c.selectedEvidence).toEqual(c.originalNativeReceipt.selectedActualEvidence);
  expect(c.newFactRoots).toBe(0);
});

it("rejects input changed while a verified native Candidate is being assembled", async () => {
  const f = facts.get("A")!, input = { ...f, handoff: structuredClone(f.handoff) };
  const originalProof = resolver.proof.bind(resolver); let changed = false;
  resolver.proof = async (...args: Parameters<TemporalTenGodSourceResolver["proof"]>) => {
    const proof = await originalProof(...args);
    if (args[1] === candidate().originalResearchId && !changed) { changed = true; input.handoff.units[0].sourceHash = "caller-mutated"; }
    return proof;
  };
  try {
    const r = await adaptActualSpecialistClaims(f.request, input, { resolver, foundation });
    expect(changed).toBe(true); expect(r).toMatchObject({ ok: false, reasons: ["ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION"] });
  } finally { resolver.proof = originalProof; }
});
