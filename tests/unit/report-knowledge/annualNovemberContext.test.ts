import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualNovemberContext } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-november-context/adapter";
import { evaluateNovember, validateNovemberObservation, validateNovemberWitness, diagnoseSubmittedContextTimestamp, NOVEMBER_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-november-context/contract";
import { actualSemanticDigest } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-calculation-semantic-bridge/units";
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

import { ActualBindingIndex } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/matching";
import { bindKnowledgeCandidate } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/engine";
import { annualPeriodTime } from "@/lib/interpretation-v4/annualEvidence";

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualNovemberContext>>, { ok: true }>;
let unknownFacts: ActualCalculationRun & { request: KnowledgeBindingRequest };
let result: Run, unknown: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
const services = () => ({ resolver, foundation });
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, services()); if (!f.ok) throw Error(f.reasons.join()); facts = f;
  const r = await adaptAnnualNovemberContext(f.request, f, services()); if (!r.ok) throw Error(r.reasons.join()); result = r;
  const u = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "F" }, services()); if (!u.ok) throw Error(u.reasons.join());
  unknownFacts = u; const ur = await adaptAnnualNovemberContext(u.request, u, services()); if (!ur.ok) throw Error(ur.reasons.join()); unknown = ur;
}, 480000);
const observation = () => result.observation!;
const witness = () => observation().witnesses[0];
function change<T>(value: T, path: string, replacement: unknown) { const parts = path.split("."); let target = value as Record<string, unknown>; for (const part of parts.slice(0, -1)) target = target[part] as Record<string, unknown>; target[parts.at(-1)!] = replacement; return value; }
it("authenticates the exact original November research and every producer segment, without approving November", async () => {
  const o = observation(); expect(o.originalResearchId).toBe(NOVEMBER_CONTRACT.originalId); expect(o.originalSourceProof.research.actualHash).toBe(NOVEMBER_CONTRACT.recordSha256);
  const composition = facts.request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
  expect(o.witnesses).toHaveLength(composition.result.evidence.raw.calendarMonths![10].segments.length);
  expect(o.sourcePreconditions.everyCanonicalSegment).toEqual(o.witnesses.map(w => w.novemberSegmentPointer));
  expect(o.sourcePreconditions.civilMonthBounds).toEqual({ start: "2026-11-01T00:00:00+09:00", endExclusive: "2026-12-01T00:00:00+09:00" });
  expect(o.ipdong).toHaveLength(1); expect(o.ipdong[0].name).toBe("입동"); expect(o.ipdong[0].valid).toBe(true);
  expect(await evaluateNovember(result.context!)).toMatchObject({ ok: true, monthReady: false, candidate: null }); expect(result.handoff.novemberCandidates).toEqual([]);
});
it("distinguishes payload provenance from an absent original observation timestamp and distinct clocks", () => {
  const c = observation().contextTimestampProvenance;
  expect(c.contextPayloadIdentityVerified).toBe(true); expect(c.contextProvenanceState).toBe("CONTEXT_TIMESTAMP_MISSING"); expect(c.contextProvenanceVerified).toBe(false);
  expect(c.contextObservationTimestamp).toBeNull(); expect(c.contextTimestampSource).toBeNull(); expect(c.observedContextFields).toEqual([]); expect(c.observationTemporalScope).toBeNull(); expect(c.suppliedContextFields).toEqual(["relationshipStatus", "jobStatus", "detailJob", "focusAreas"]);
  expect(c.readingInstant).toBe("2026-10-12T12:00:00+09:00"); expect(c.generatedAt).toBe(facts.request.graphInput.evidence.generatedAt); expect(c.graphEvaluationInstant).toBe(facts.request.graph.context.evaluatedAt);
  expect(c.clockSourcePointers.contextObservedAt).toBeNull(); expect(c.clockSourcePointers.readingInstant).not.toBe(c.clockSourcePointers.generatedAt); expect(c.timestampSubstitutionAllowed).toBe(false); expect(c.futureStateGuaranteed).toBe(false);
  expect(c.originalGraphNode).toEqual(facts.request.graph.nodes.find(n => n.id === c.originalSourceId)); expect(c.originalSourceHash).toBe(actualSemanticDigest(c.originalGraphNode));
  const input = facts.request.graphInput.evidence.input; if (input.kind === "compatibility") throw Error("SINGLE_REQUIRED"); expect(c.contextPayloadHash).toBe(actualSemanticDigest(input.userContext));
});
it("uses the original half-open reading-time classifier on actual November boundaries", () => {
  for (const w of observation().witnesses) {
    expect(w.periodTimePosition).toBe("FUTURE"); expect(w.graphTimePosition).toBe("future");
    const { start, endExclusive } = w.novemberSegmentWindow;
    expect(annualPeriodTime(start!, endExclusive!, new Date(Date.parse(start!) - 1).toISOString())).toBe("future");
    expect(annualPeriodTime(start!, endExclusive!, start!)).toBe("current"); expect(annualPeriodTime(start!, endExclusive!, endExclusive!)).toBe("past");
  }
});
it("keeps source hypothetical scenes distinct from calculated facts and unverified customer history", () => {
  for (const w of observation().witnesses) {
    expect(w.sceneSource.originalScene).toEqual({ text: "가상으로 그때 과제가 생긴 경우의 투입 한도를 정한다.", hypothetical: true, isCustomerHistory: false });
    expect(w.sceneHypothetical).toBe(true); expect(w.sceneIsCustomerHistory).toBe(false); expect(w.actualConditionalSceneState).toBe("CONDITIONAL_SCENE_SOURCE_VERIFIED"); expect(w.customerSceneState).toBe("CUSTOMER_SCENE_NOT_VERIFIED"); expect(w.futureStateGuaranteed).toBe(false);
    expect(w.originalGraphEvidence.some(n => n.fact.observationPointer === "/input/userContext")).toBe(false);
  }
});
it("binds only exact same-window original core facts and preserves all source conditions and twelve gates", () => {
  const o = observation(); expect(o.typedBindings).toHaveLength(o.witnesses.length);
  for (const [i, b] of o.typedBindings.entries()) {
    const w = o.witnesses[i]; expect(b.use).toBe("CURRENT_FACT_SCOPE_ONLY"); expect([...b.typedNativeReceipt.selectedActualEvidence].sort()).toEqual(w.originalGraphEvidence.map(n => n.id).sort());
    expect(b.typedNativeReceipt.temporalWitnesses.every(t => t.start === b.effectiveInterval.start && t.endExclusive === b.effectiveInterval.endExclusive)).toBe(true);
    for (const key of ["unresolvedConditions", "sourceGroups", "requiredContext", "products", "relationships", "requiredUserState", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity"] as const) expect(b.typedCandidate.requirement[key]).toEqual(o.originalCandidate.requirement[key]);
    expect(b.typedNativeReceipt.allTwelveGateResults).toHaveLength(12);
    for (const gate of b.typedNativeReceipt.allTwelveGateResults) if (!["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"].includes(gate.gate)) { const old = o.originalNativeReceipt.allTwelveGateResults.find(g => g.gate === gate.gate)!; expect([gate.state, gate.reasons]).toEqual([old.state, old.reasons]); }
    expect(b.typedNativeReceipt.customerApproved).toBe(false); expect(b.typedNativeReceipt.operatorApproved).toBe(false);
  }
});
it("retains complete original Graph ancestry and other evidence statuses without issuing new roots", () => {
  for (const run of [result, unknown]) for (const w of run.observation!.witnesses) {
    expect(w.periodFactsState).toBe("PERIOD_FACTS_VERIFIED"); expect(w.periodFactScope).toEqual(["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"]);
    const ids = new Set(w.completeAncestry.map(n => n.id)); for (const n of w.completeAncestry) { expect(n.ancestry.parentIds.every(id => ids.has(id))).toBe(true); expect(n.ancestry.complete).toBe(true); }
    expect([...new Set(w.completeAncestry.flatMap(n => n.ancestry.rootIds))].sort()).toEqual(w.originalFactRoots);
    expect(w.newFactRoots).toBe(0); expect(w.independentFactsAdded).toBe(0); expect(w.meaningIdentity).toBeNull(); expect(w.claimIdentity).toBeNull();
  }
  for (const w of unknown.observation!.witnesses) for (const n of [...w.otherOriginalGraphEvidence, ...w.otherEvidenceCompleteAncestry]) expect(n).toEqual(unknownFacts.request.graph.nodes.find(old => old.id === n.id));
  const actualOtherNodes = unknown.observation!.witnesses.flatMap(w => w.otherOriginalGraphEvidence);
  const actualHeld = actualOtherNodes.filter(n => n.status === "WITHHELD");
  expect(actualHeld.every(n => unknownFacts.request.graph.nodes.find(old => old.id === n.id)?.status === "WITHHELD")).toBe(true);
  // Unknown-hour evidence may be absent in November; never manufacture a held relation just for a fixture.
  expect(actualOtherNodes.filter(n => n.blockers.some(b => b.code === "UNKNOWN_BIRTH_TIME"))).toHaveLength(0);
});
it.each(["generatedAt", "readingInstant", "policyDate", "arbitrary-source-free-string"])("rejects caller timestamp substitution: %s", field => {
  const c = observation().contextTimestampProvenance;
  const originalFuturePolicy = json<{ product: string; id: string; clock: { policyDate?: string } }[]>("tests/fixtures/six-product-integration-01/source-locks.json").find(f => f.product === "annual" && f.id === "C2028")!.clock.policyDate;
  const value = field === "policyDate" ? originalFuturePolicy : field in c ? c[field as keyof typeof c] : "2026-11-01T00:00:00+09:00";
  expect(typeof value).toBe("string"); expect(Number.isFinite(Date.parse(String(value)))).toBe(true);
  expect(diagnoseSubmittedContextTimestamp(result.context!, { contextObservedAt: value, source: field })).toMatchObject({ contextProvenanceState: "CONTEXT_SOURCE_UNVERIFIED", authenticated: false, contextObservationTimestamp: null, contextTimestampSource: null, customerUseAllowed: false });
});
it.each([
  ["fixtureId", "another-fixture"], ["owner", "another-owner"], ["selectedYear", 2027],
  ["contextObservationTimestamp", "2026-10-12T12:00:00+09:00"], ["contextTimestampSource", "generatedAt"],
  ["contextPayloadIdentity.contextPayloadHash", "forged"], ["contextPayloadIdentity.suppliedContextFields", ["unexpected-marriage"]],
  ["contextProvenanceState", "CONTEXT_TIMESTAMP_AUTHENTICATED"], ["futureStateGuaranteed", true],
  ["sceneSource.originalScene.text", "이미 새 일을 시작했습니다"], ["sceneHypothetical", false], ["sceneIsCustomerHistory", true],
  ["novemberSegmentPointer", "/composition/result/evidence/raw/calendarMonths/10/segments/999"],
  ["novemberSegmentWindow.start", "2026-11-08T00:00:00+09:00"], ["originalSegment.boundaryReason", ["jie:forged"]],
  ["originalGraphEvidence.0.value.month", 10], ["originalGraphEvidence.1.fact.producerEvidenceId", "another-segment-evidence"],
  ["originalSourceProof.research.actualHash", "forged"], ["requiredConditions", []], ["meaningIdentity", "invented-meaning"], ["claimIdentity", "invented-claim"],
  ["customerAuthorizationState", "APPROVED"], ["customerUseAllowed", true], ["newFactRoots", 1]
])("rejects modified witness field %s", async (field, value) => {
  expect(await validateNovemberWitness(result.context!, change(structuredClone(witness()), field as string, value))).toMatchObject({ ok: false, customerUseAllowed: false });
});
it.each([
  ["originalCandidate.requirement.sourceGroups", undefined], ["originalCandidate.requirement.counterexamples", []],
  ["originalCandidate.requirement.meaningIdentity", "invented"], ["originalCandidate.requirement.claimIdentity", "invented"],
  ["originalNativeReceiptHash", "changed"], ["originalNativeReceipt.receiptId", "changed"], ["typedBindings.0.typedNativeReceipt.allTwelveGateResults.11.state", "PASS"],
  ["typedBindings.0.typedNativeReceipt.customerApproved", true], ["ipdong.0.instantKst", "2026-11-08T00:00:00+09:00"], ["contextTimestampProvenance.contextProvenanceVerified", true]
])("rejects changed original conditions, receipts and approvals: %s", async (field, value) => {
  const modified = change(structuredClone(observation()), field as string, value); expect(actualSemanticDigest(modified)).not.toBe(actualSemanticDigest(observation()));
  expect(await validateNovemberObservation(result.context!, modified)).toMatchObject({ ok: false, customerUseAllowed: false });
});
it("rejects other fixture contexts, unregistered copies and customer or planner use", async () => {
  expect(await validateNovemberWitness(unknown.context!, witness())).toMatchObject({ ok: false });
  expect(await evaluateNovember(structuredClone(result.context!))).toMatchObject({ ok: false });
  expect(await validateNovemberObservation(result.context!, observation(), "CUSTOMER_PUBLICATION")).toMatchObject({ ok: false });
  expect(await validateNovemberWitness(result.context!, witness(), "PLANNER_ASSIGNMENT")).toMatchObject({ ok: false });
});
it.each(["invented-status", "invented-timestamp"])("rejects unsubmitted state before adaptation: %s", async kind => {
  const request = structuredClone(facts.request);
  if (kind === "invented-status") request.actualUserState = { ...(request.actualUserState as Record<string, unknown>), jobStatus: "invented-employment" };
  else { const input = request.graphInput.evidence.input; if (input.kind === "compatibility") throw Error("SINGLE_REQUIRED"); Object.assign(input.userContext, { contextObservedAt: "2026-10-12T12:00:00+09:00" }); }
  expect(await adaptAnnualNovemberContext(request, facts, services())).toMatchObject({ ok: false });
});
it("re-evaluates deterministically and preserves June withholding and every inherited candidate identity", async () => {
  expect(await validateNovemberWitness(result.context!, structuredClone(witness()))).toMatchObject({ ok: true });
  expect(await validateNovemberObservation(result.context!, structuredClone(observation()))).toMatchObject({ ok: true, novemberCandidateAuthorized: false });
  expect(actualSemanticDigest((await evaluateNovember(result.context!)))).toBe(actualSemanticDigest((await evaluateNovember(result.context!))));
  expect(result.baseline.observation!.roleSourceResolution).toBe("ROLE_SOURCE_DECISION_REQUIRED"); expect(result.baseline.handoff.juneCandidates).toEqual([]);
  expect(result.handoff.historicalAnnualCandidates).toEqual(result.baseline.handoff.historicalAnnualCandidates); expect(result.handoff.historicalMajorCandidates).toEqual(result.baseline.handoff.historicalMajorCandidates);
  expect(result.handoff.originalNativeReceipts).toEqual(result.baseline.handoff.originalNativeReceipts); expect(result.handoff.originalFactRoots).toEqual(result.baseline.handoff.originalFactRoots);
  expect(result.handoff).toMatchObject({ newFactRoots: 0, customerClaims: 0, customerApprovals: 0, customerReaderBridges: 0, plannerUseAllowed: false });
});

it("rejects mixing the two actual disjoint November segment facts in a simultaneous Native receipt", () => {
  const o = observation(), nodes = o.witnesses.map(w => w.originalGraphEvidence[1]); expect(nodes.length).toBeGreaterThan(1);
  const typed = structuredClone(o.originalCandidate);
  for (const [i, n] of nodes.entries()) typed.requirement.sourceRequirements.push({ id: "negative-november-period-" + i, originalField: "/requires/2", originalDeclaration: o.originalResearchRecord.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", observationPointer: n.fact.observationPointer, fields: [] }, required: true, gaps: [] });
  typed.requirement.requiredOwner = ["person"];
  const receipt = bindKnowledgeCandidate(typed, new ActualBindingIndex({ ...facts.request, restrictEvidenceTo: nodes.map(n => n.id) }, catalog), catalog);
  expect(receipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")).toMatchObject({ state: "FAIL", reasons: ["NO_TIME_INTERSECTION"] });
});
