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
import { adaptAnnualOctoberFocus } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-october-focus/adapter";
import { createOctoberCandidate, validateOctoberCandidate, prepareOctoberContext, OCTOBER_FOCUS_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-october-focus/contract";
import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import { v4Digest, type V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { observeActualProfiles } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/producers";
import { buildActualEvidenceGraph } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/engine";
import { adaptActualCalculationRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
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

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualOctoberFocus>>, { ok: true }>;
let facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, result: Run, foundation: ProductSpecialistFoundation;
let baseline: Extract<Awaited<ReturnType<typeof adaptAnnualMonthMatrix>>, { ok: true }>;
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, { resolver, foundation });
  if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualOctoberFocus(f.request, f, { resolver, foundation });
  if (!r.ok) throw Error(r.reasons.join()); if (r.withheld.length) throw Error(JSON.stringify(r.withheld)); result = r;
  const matrix = await adaptAnnualMonthMatrix(f.request, f, { resolver, foundation }); if (!matrix.ok) throw Error(matrix.reasons.join()); baseline = matrix;
}, 240000);
const candidate = () => result.handoff.octoberCandidates[0];
it("binds original October focus only and preserves every unselected segment and its ancestry", async () => {
  const c = candidate(); expect(result.handoff.octoberCandidates).toHaveLength(1);
  expect(c.originalResearchId).toBe("afpr:month-slot:10"); expect(c.originalSourceProof.actualHash).toBe(OCTOBER_FOCUS_CONTRACT.recordSha256);
  expect(c.sourcePreconditions.originalRequiredConditions).toEqual(OCTOBER_FOCUS_CONTRACT.requires);
  expect(c.sourcePreconditions.allSegments).toHaveLength(2); expect(c.sourcePreconditions.unselectedSegmentWitnesses).toHaveLength(1);
  expect(c.sourcePreconditions.allSegments.filter(s => s.focusSelected)).toHaveLength(1);
  expect(c.sourcePreconditions.unselectedSegmentWitnesses[0].use).toBe("UNSELECTED_SEGMENT_WITNESS");
  expect(c.selectedGraphFacts).toHaveLength(2);
  expect(c.selectedGraphFacts.every(n => n.window?.start === c.editorialFocus.interval.start && n.window.endExclusive === c.editorialFocus.interval.endExclusive && n.ancestry.complete)).toBe(true);
  expect(c.selectedGraphFacts.map(n => n.pointer).sort()).toEqual([c.editorialFocus.segmentPointer, c.editorialFocus.segmentPointer + "/evidenceIds/0"].sort());
  expect(c.originalNativeReceipt.selectedActualEvidence).toEqual([]); expect(c.originalNativeReceiptHash).toBe(actualSemanticDigest(c.originalNativeReceipt));
  expect(c.originalFactRoots.every(r => result.handoff.originalFactRoots.includes(r))).toBe(true);
  expect(c.verifiedActualUnitIds).toEqual([]); expect(c.editorialFocus.independentCalculatedFact).toBe(false);
  expect((await validateOctoberCandidate(result.context!, structuredClone(c))).ok).toBe(true);
});
it("preserves all historical Major/May/July/December candidates, all gates and original conditions", () => {
  expect(result.handoff.historicalMayCandidates).toEqual(baseline.handoff.historicalMayCandidates);
  expect(result.handoff.historicalMatrixCandidates).toEqual(baseline.handoff.newMatrixCandidates);
  expect(result.handoff.historicalMajorCandidates).toEqual(baseline.handoff.historicalMajorCandidates);
  expect(result.handoff.unitStates).toEqual(baseline.handoff.unitStates);
  const c = candidate(); expect(c.allTwelveGateResults).toHaveLength(12);
  for (const key of ["unresolvedConditions", "sourceGroups", "requiredUserState", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity"] as const) expect(c.typedCandidate.requirement[key]).toEqual(c.originalCandidate.requirement[key]);
  expect(c.typedCandidate.requirement.sourceRequirements.slice(0, c.originalCandidate.requirement.sourceRequirements.length)).toEqual(c.originalCandidate.requirement.sourceRequirements);
  expect(c.originalMeaningIdentity).toBeNull(); expect(c.originalClaimIdentity).toBeNull();
  expect(c.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")?.state).toBe("REVIEW_REQUIRED");
  expect(c.allTwelveGateResults.find(g => g.gate === "ACTUAL_USER_STATE")?.state).toBe("UNKNOWN");
});
const scenarios = ["A-first", "B-after-jie", "C-exact-jie", "D-before-october", "E-after-october", "F-future-year", "G-past-year"] as const;
it.each(scenarios)("re-runs real Producer with an explicit separate offline clock: %s", async scenario => {
  const source = json<{product:string;id:string;payload:{productOptions:{selectedYear:string}};clock:{evaluatedAt:string;policyDate?:string}}[]>("tests/fixtures/six-product-integration-01/source-locks.json").find(f => f.product === "annual" && f.id === "A")!;
  const input = structuredClone(source), jie = candidate().sourcePreconditions.allSegments[1].interval.start!;
  const times = { "A-first": "2026-10-01T00:00:00+09:00", "B-after-jie": new Date(Date.parse(jie) + 1).toISOString(), "C-exact-jie": jie,
    "D-before-october": "2026-09-30T23:59:59+09:00", "E-after-october": "2026-11-01T00:00:00+09:00", "F-future-year": "2026-10-12T12:00:00+09:00", "G-past-year": "2026-10-12T12:00:00+09:00" };
  input.clock.evaluatedAt = times[scenario];
  if (scenario === "F-future-year" || scenario === "G-past-year") { input.payload.productOptions.selectedYear = scenario === "F-future-year" ? "2028" : "2025"; input.clock.policyDate = input.payload.productOptions.selectedYear + "-10-12T12:00:00+09:00"; }
  const generated = await generateV4ShadowReport(input.payload, input.clock); if (!generated.ok) throw Error(JSON.stringify(generated.error)); expect(generated.externalCalls).toEqual([]);
  const evidence = generated.evidencePacket as V4RuntimeEvidence, observed = observeActualProfiles(evidence);
  const graphInput = { evidence, profiles: observed.profiles, context: { fixtureId: "fixture-october-" + scenario, synthetic: true as const, evaluatedAt: evidence.generatedAt, owners: { person: "fixture-owner-october-" + scenario }, catalogVersion: catalog.evidence.versions.catalog, sourceVersion: catalog.evidence.versions.source, semanticVersion: catalog.evidence.versions.semantic } };
  const built = buildActualEvidenceGraph(graphInput, catalog.evidence); if (!built.ok) throw Error(JSON.stringify(built));
  const request: KnowledgeBindingRequest = { graph: built.graph, graphInput, product: built.graph.product, relationship: null, contexts: [], actualUserState: evidence.input.kind === "compatibility" ? {} : evidence.input.userContext };
  const bridge = await adaptActualCalculationRequest(request, { resolver, foundation }); if (!bridge.ok) throw Error(bridge.reasons.join());
  const adapted = await adaptAnnualOctoberFocus(request, bridge, { resolver, foundation }); if (!adapted.ok) throw Error(adapted.reasons.join()); expect(adapted.withheld).toEqual([]);
  const c = adapted.handoff.octoberCandidates[0], active = ["A-first", "B-after-jie", "C-exact-jie"].includes(scenario);
  expect(c.clock.readingInstant).toBe(times[scenario]); expect(c.clock.selectedYear).toBe(Number(input.payload.productOptions.selectedYear));
  expect(c.editorialFocus.activeAtReading).toBe(active); expect(c.editorialFocus.state).toBe(active ? "ACTUAL_ACTIVE_AT_READING" : "REPRESENTATIVE_FOCUS_NOT_ACTIVE");
  expect(c.editorialFocus.segmentPointer).toBe("/composition/result/evidence/raw/calendarMonths/9/segments/" + (scenario === "A-first" ? 0 : 1));
  expect(c.editorialFocus.selectionReason).toBe(active ? "ACTIVE_SEGMENT_AT_READING" : "REPRESENTATIVE_JIE_SEGMENT");
  if (scenario === "C-exact-jie") expect(c.sourcePreconditions.unselectedSegmentWitnesses[0].readingTimePosition).toBe("past");
  if (scenario === "D-before-october" || scenario === "F-future-year") expect(c.sourcePreconditions.allSegments.every(s => s.readingTimePosition === "future")).toBe(true);
  if (scenario === "E-after-october" || scenario === "G-past-year") expect(c.sourcePreconditions.allSegments.every(s => s.readingTimePosition === "past")).toBe(true);
  expect((await validateOctoberCandidate(adapted.context!, structuredClone(c))).ok).toBe(true);
}, 240000);
it.each(["reading-missing", "wrong-clock-source", "policy-as-reading", "focus-forged", "other-month", "year-changed", "boundary-extrapolated", "future-active", "past-active", "unselected-missing", "segment-reordered", "node-identity", "source-hash", "foreign-owner", "original-receipt", "source-group", "counterexample", "gate-pass", "meaning-invented", "approval-forged", "synthetic-promoted"])("rejects forged contracts: %s", async variant => {
  const c = structuredClone(candidate());
  if (variant === "reading-missing") Reflect.deleteProperty(c.clock, "readingInstant");
  if (variant === "wrong-clock-source") Object.assign(c.clock, { readingInstantSource: "/generatedAt" });
  if (variant === "policy-as-reading") Object.assign(c.clock, { readingInstant: "2028-10-12T12:00:00+09:00", readingInstantSource: "/composition/result/evidence/clock/policyDate" });
  if (variant === "focus-forged") c.sourcePreconditions.allSegments[0].focusSelected = true;
  if (variant === "other-month") c.editorialFocus.segmentPointer = "/composition/result/evidence/raw/calendarMonths/8/segments/1";
  if (variant === "year-changed") c.clock.selectedYear++;
  if (variant === "boundary-extrapolated") c.editorialFocus.interval.endExclusive = "2027-01-01T00:00:00+09:00";
  if (variant === "future-active" || variant === "past-active") { c.clock.readingInstant = variant === "future-active" ? "2025-10-12T12:00:00+09:00" : "2028-10-12T12:00:00+09:00"; c.editorialFocus.activeAtReading = true; }
  if (variant === "unselected-missing") c.sourcePreconditions.unselectedSegmentWitnesses = [];
  if (variant === "segment-reordered") c.sourcePreconditions.allSegments.reverse();
  if (variant === "node-identity") c.selectedGraphFacts[0].nodeId = "forged";
  if (variant === "source-hash") c.originalSourceProof.actualHash = "forged";
  if (variant === "foreign-owner") c.selectedGraphFacts[0].owner.fixtureOwnerId = "foreign";
  if (variant === "original-receipt") c.originalNativeReceipt.selectedActualEvidence.push("forged");
  if (variant === "source-group") Reflect.deleteProperty(c.typedCandidate.requirement, "sourceGroups");
  if (variant === "counterexample") c.typedCandidate.requirement.counterexamples = [];
  if (variant === "gate-pass") c.allTwelveGateResults.find(g => g.gate === "INTERPRETATION_REVIEW")!.state = "PASS";
  if (variant === "meaning-invented") c.originalMeaningIdentity = "invented";
  if (variant === "approval-forged") Object.assign(c, { customerUseAllowed: true, customerApprovals: 1 });
  if (variant === "synthetic-promoted") { c.typedCandidate.provenance = "SYNTHETIC_TEST_ONLY"; c.typedCandidate.requirement.meaningIdentity = "SYNTHETIC_TEST_ONLY"; }
  expect((await validateOctoberCandidate(result.context!, c)).ok).toBe(false);
});
it("rejects forged input clocks and focus before issuing an authentic context", async () => {
  for (const variant of ["missing", "policy", "focus", "graph-clock"]) {
    const request = structuredClone(facts.request), composition = request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
    if (variant === "missing") Reflect.deleteProperty(composition.result.evidence.clock, "currentDate");
    if (variant === "policy") composition.result.evidence.clock.currentDate = "2028-10-12T12:00:00+09:00";
    if (variant === "focus") composition.result.evidence.months[9].focus = composition.result.evidence.raw.calendarMonths![9].segments[0];
    if (variant === "graph-clock") request.graph.context.evaluatedAt = "2028-10-12T12:00:00+09:00";
    expect((await prepareOctoberContext(request, facts, { resolver, foundation })).ok).toBe(false);
  }
});
it("rejects a different Graph evaluation instant without weakening the original Graph contract", () => {
  const input = structuredClone(facts.request.graphInput); input.context.evaluatedAt = "2028-10-12T12:00:00+09:00";
  expect(buildActualEvidenceGraph(input, catalog.evidence).ok).toBe(false);
});
it.each(["CUSTOMER_PUBLICATION", "PLANNER_ASSIGNMENT"] as const)("never authorizes %s", async use => {
  expect((await validateOctoberCandidate(result.context!, candidate(), use)).ok).toBe(false);
});
it("recreates deterministically without mutating inputs and refuses cloned contexts", async () => {
  const before = actualSemanticDigest([facts.request, facts.handoff, facts.native, result.baseline.handoff]);
  expect(await createOctoberCandidate(result.context!, candidate().originalCatalogKey)).toEqual({ ok: true, candidate: candidate() });
  expect((await createOctoberCandidate(structuredClone(result.context!), candidate().originalCatalogKey)).ok).toBe(false);
  expect(actualSemanticDigest([facts.request, facts.handoff, facts.native, result.baseline.handoff])).toBe(before);
});
it("rereads Source hash rather than trusting a previously exported proof", async () => {
  const proof = resolver.proof.bind(resolver); resolver.proof = async (...args) => ({ ...await proof(...args), actualHash: "forged" });
  try { expect((await createOctoberCandidate(result.context!, candidate().originalCatalogKey)).ok).toBe(false); } finally { resolver.proof = proof; }
});
it("rejects a rehashed forged focus even after rebuilding Graph and Bridge", async () => {
  // Deliberately forged negative input, never labelled a real Producer result.
  const request = structuredClone(facts.request), packet = request.graphInput.evidence, c = packet.composition;
  if (c.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
  const wrong = c.result.evidence.raw.calendarMonths![9].segments[0];
  c.result.evidence.months[9].focus = wrong; c.result.months[9].focus = wrong;
  const { contentDigest: oldDigest, ...body } = packet; request.graphInput.evidence = { ...body, contentDigest: v4Digest(body) }; expect(request.graphInput.evidence.contentDigest).not.toBe(oldDigest);
  const built = buildActualEvidenceGraph(request.graphInput, catalog.evidence); expect(built.ok).toBe(true); request.graph = built.graph;
  const bridge = await adaptActualCalculationRequest(request, { resolver, foundation }); if (!bridge.ok) throw Error(bridge.reasons.join());
  const adapted = await prepareOctoberContext(request, bridge, { resolver, foundation });
  expect(adapted).toMatchObject({ ok: false, reasons: ["ORIGINAL_PRODUCER_FOCUS_OR_LEDGER_MISMATCH"] });
}, 240000);

it("isolates authoritative Receipt and roots from mutable handoff containers", async () => {
  const outer = result.baseline.baseline, original = outer.baseline;
  try {
    const changed = structuredClone(original), receipt = changed.native.receipts.find(r => r.originalResearchId === "afpr:month-slot:10")!;
    receipt.selectedActualEvidence.push("forged"); outer.baseline = changed;
    expect(await createOctoberCandidate(result.context!, candidate().originalCatalogKey)).toEqual({ ok: true, candidate: candidate() });
    expect(candidate().approvalState.product).toBe(candidate().allTwelveGateResults.find(g => g.gate === "PRODUCT_SPECIALISM")!.state);
  } finally { outer.baseline = original; }
});
