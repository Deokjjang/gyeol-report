import { beforeAll, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { SourceReader, hash } from "@/lib/report-knowledge/knowledge-integration-foundation/sourceReader";
import { SourceVerificationEngine } from "@/lib/report-knowledge/knowledge-integration-foundation/source-verification/engine";
import { TemporalTenGodSourceResolver } from "@/lib/report-knowledge/knowledge-integration-foundation/global-source-domain-resolution/temporalTenGodSource";
import { KnowledgeBinderCatalog } from "@/lib/report-knowledge/knowledge-integration-foundation/knowledge-binder/catalog";
import { ProductSpecialistFoundation } from "@/lib/report-knowledge/knowledge-integration-foundation/product-specialist-foundation/binderIntegration";
import { runActualCalculationFixture } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { adaptAnnualJuneSameGod } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-june-same-god/adapter";
import { evaluateJune, validateJuneObservation, validatePreviousGodWitness, JUNE_CONTRACT } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-june-same-god/contract";
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

import { generateV4ShadowReport } from "@/lib/interpretation-v4/runtimeShadow";
import type { V4RuntimeEvidence } from "@/lib/interpretation-v4/runtimeProjection";
import { observeActualProfiles } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/producers";
import { buildActualEvidenceGraph } from "@/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/engine";
import { adaptActualCalculationRequest } from "@/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter";
import { AnnualSpecialistIndex } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/candidateIndex";
import { matchMonthlyGod } from "@/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/monthlyTenGodMatcher";

type Run = Extract<Awaited<ReturnType<typeof adaptAnnualJuneSameGod>>, { ok: true }>;
let result: Run, unknown: Run, ranged: Run, facts: ActualCalculationRun & { request: KnowledgeBindingRequest }, foundation: ProductSpecialistFoundation;
const services = () => ({ resolver, foundation });
async function adapt(f: Awaited<ReturnType<typeof runActualCalculationFixture>>) { if (!f.ok) throw Error(f.reasons.join()); const r = await adaptAnnualJuneSameGod(f.request, f, services()); if (!r.ok) throw Error(r.reasons.join()); return r; }
beforeAll(async () => {
  await catalog.prepare(); foundation = await ProductSpecialistFoundation.prepare(catalog);
  const f = await runActualCalculationFixture(process.cwd(), { product: "annual", id: "A" }, services()); if (!f.ok) throw Error(f.reasons.join()); facts = f; result = await adapt(f);
  unknown = await adapt(await runActualCalculationFixture(process.cwd(), { product: "annual", id: "F" }, services()));
  const fixture = structuredClone(json<{ product: string; id: string; payload: Record<string, unknown>; clock: Parameters<typeof generateV4ShadowReport>[1] }[]>("tests/fixtures/six-product-integration-01/source-locks.json").find(v => v.product === "annual" && v.id === "A")!);
  const person = fixture.payload.person as Record<string, unknown>, options = fixture.payload.productOptions as Record<string, unknown>;
  Object.assign(person, { birthDate: "1999-07-31", birthTime: "", birthTimeUnknown: true, birthTimePrecision: "unknown", gender: "MALE" }); options.selectedYear = "2027"; const clock = { ...fixture.clock, policyDate: "2027-10-12T12:00:00+09:00" };
  const generated = await generateV4ShadowReport(fixture.payload, clock); if (!generated.ok || generated.externalCalls?.length) throw Error("RANGE_FIXTURE_REQUIRED");
  const evidence = generated.evidencePacket as V4RuntimeEvidence; if (evidence.input.kind === "compatibility") throw Error("ANNUAL_REQUIRED");
  const profiles = observeActualProfiles(evidence), graphInput = { evidence, profiles: profiles.profiles, context: { fixtureId: "fixture-annual-ranged-transition", synthetic: true as const, evaluatedAt: evidence.generatedAt, owners: { person: "fixture-person-annual-ranged-transition" }, catalogVersion: catalog.evidence.versions.catalog, sourceVersion: catalog.evidence.versions.source, semanticVersion: catalog.evidence.versions.semantic } };
  const graph = buildActualEvidenceGraph(graphInput, catalog.evidence); if (!graph.ok) throw Error("RANGE_GRAPH_REQUIRED");
  const request: KnowledgeBindingRequest = { graph: graph.graph, graphInput, product: graph.graph.product, relationship: null, contexts: [], actualUserState: evidence.input.userContext };
  const bridge = await adaptActualCalculationRequest(request, services()); if (!bridge.ok) throw Error(bridge.reasons.join());
  const r = await adaptAnnualJuneSameGod(request, bridge, services()); if (!r.ok) throw Error(r.reasons.join()); ranged = r;
}, 480000);
const observation = () => result.observation!;
const witness = () => observation().previousGodWitnesses[0];
function change<T>(value: T, path: string, replacement: unknown) { const parts = path.split("."); let target = value as Record<string, unknown>; for (const part of parts.slice(0, -1)) target = target[part] as Record<string, unknown>; target[parts.at(-1)!] = replacement; return value; }
it("verifies the exact June source and every actual canonical segment without selecting a research role", async () => {
  const o = observation(); expect(o.originalResearchId).toBe(JUNE_CONTRACT.originalId); expect(o.originalSourceProof.research.actualHash).toBe(JUNE_CONTRACT.recordSha256);
  expect(o.segmentResults).toHaveLength(2); expect(o.sourcePreconditions.everyCanonicalSegment).toEqual(o.segmentResults.map(s => s.segmentPointer)); expect(o.sourcePreconditions.civilMonthBounds).toEqual({ start: "2026-06-01T00:00:00+09:00", endExclusive: "2026-07-01T00:00:00+09:00" });
  expect(o.roleSourceResolution).toBe("ROLE_SOURCE_DECISION_REQUIRED"); expect(o.originalResearchRoleResolution).toBe("ORIGINAL_ROLE_UNRESOLVED"); expect(result.handoff.juneCandidates).toEqual([]);
  const evaluated = await evaluateJune(result.context!); expect(evaluated).toMatchObject({ ok: true, monthReady: false, candidate: null }); expect(await validateJuneObservation(result.context!, structuredClone(o))).toMatchObject({ ok: true, juneCandidateAuthorized: false });
});
it("preserves both original calculated roles, target/reference stems and full original ancestry", () => {
  const o = observation(); expect(o.calculatedObservations).toHaveLength(24);
  for (const v of o.calculatedObservations) {
    expect(v.verificationState).toBe("VERIFIED_CALCULATED_OBSERVATION"); expect(v.referenceStem).toBe(v.dayMaster); expect(v.targetStem).toBeTruthy(); expect(v.originalResearchRole).toBe("AMBIGUOUS"); expect(v.diagnosticRoleOnly).toBe(true);
    expect(facts.request.graph.nodes.find(n => n.id === v.originalGraphNodeId)).toEqual(v.originalGraphNode); expect(v.completeAncestry.every(n => facts.request.graph.nodes.some(old => actualSemanticDigest(old) === actualSemanticDigest(n)))).toBe(true);
  }
  const sameGodPairs = o.calculatedObservations.filter(v => v.originRole === "MONTH_STEM").map(v => [v, o.calculatedObservations.find(w => w.segmentPointer === v.segmentPointer && w.originRole === "MONTH_BRANCH_MAIN")!]).filter(([a, b]) => a.tenGod === b.tenGod);
  expect(sameGodPairs.length).toBeGreaterThan(0); for (const [a, b] of sameGodPairs) { expect(a.targetStem).toBe(b.targetStem); expect(a.originalGraphNodeId).toBe(b.originalGraphNodeId); expect(a.observationId).not.toBe(b.observationId); expect(a.originRole).not.toBe(b.originRole); }
  for (const s of o.segmentResults) { const rows = s.previousGodWitness.currentTenGodObservations; expect(rows.map(r => r.originRole)).toEqual(["MONTH_STEM", "MONTH_BRANCH_MAIN"]); expect(new Set(rows.map(r => r.observationId)).size).toBe(2); expect(rows[0].originalGraphNodeId).toBe(rows[1].originalGraphNodeId); }
});
it("searches only January to May in the same actual owner/year and retains every role/window occurrence", () => {
  for (const w of observation().previousGodWitnesses) {
    expect(w.originalRoleSelected).toBeNull(); expect(w.roleResolutionState).toBe("ORIGINAL_ROLE_UNRESOLVED"); expect(w.nonMonthlyRolesExcluded).toEqual(["ANNUAL_STEM", "DAYUN_STEM", "FLOW_GOD"]);
    for (const p of w.previousMatchingObservations) { expect(p.fixtureId).toBe(w.fixtureId); expect(p.owner).toBe(w.owner); expect(p.selectedYear).toBe(w.selectedYear); expect(Date.parse(p.interval.endExclusive!)).toBeLessThanOrEqual(Date.parse(w.currentInterval.start!)); expect(p.segmentPointer).toMatch(/calendarMonths\/[0-4]\/segments\//); }
    expect(new Set(w.previousMatchingObservations.map(p => p.observationId)).size).toBe(w.previousMatchingObservations.length);
  }
});
it("distinguishes same-role matches, cross-role matches and genuine context differences without new meaning", () => {
  const comparisons = observation().previousGodWitnesses.flatMap(w => w.comparisons);
  expect(comparisons.some(c => c.roleMatchState === "EXACT_ROLE_SCOPED_MATCH")).toBe(true); expect(comparisons.some(c => c.roleMatchState === "SAME_GOD_DIFFERENT_ROLE")).toBe(true); expect(comparisons.some(c => c.comparisonState === "SAME_GOD_DIFFERENT_CONTEXT")).toBe(true);
  for (const c of comparisons) { expect(c.roleMatchState === "EXACT_ROLE_SCOPED_MATCH").toBe(c.previousRole === c.currentRole); expect(c.changedContextFields).toContain("interval"); expect(c.differentPeriodOnly).toBe(!c.calculatedContextChangedBeyondPeriod); expect(c.repeatedGodIsIndependentMeaning).toBe(false); expect(c.rootDifferenceEstablishesNewMeaning).toBe(false); expect(c.independentInformationAdded).toBe(0); expect(c.newFactRoots).toBe(0); expect(c.customerClaims).toBe(0); }
});
it("uses actual adjacent comparison edges only as an explicit non-adjacent source path", () => {
  const rows = observation().previousGodWitnesses.flatMap(w => w.comparisons).filter(c => c.temporalScope === "NON_ADJACENT_SOURCE_WITNESS"); expect(rows.length).toBeGreaterThan(0);
  for (const c of rows) { expect(c.directAdjacentObservation).toBeNull(); expect(c.originalAdjacentPathEdges.length).toBeGreaterThan(0); expect(c.periodSemantics).toBe("NON_SIMULTANEOUS_SOURCE_COMPARISON"); expect(c.beforeInterval.endExclusive! <= c.afterInterval.start!).toBe(true); expect(c.comparisonApproved).toBe(false); }
});
it("compares complete original ancestry roots even when the God node has no direct root", () => {
  let observed = false;
  for (const w of observation().previousGodWitnesses) for (const c of w.comparisons) {
    const previous = w.previousMatchingObservations.find(v => v.observationId === c.previousObservationId)!, current = w.currentTenGodObservations.find(v => v.observationId === c.currentObservationId)!;
    const shared = previous.originalRootIds.filter(r => current.originalRootIds.includes(r));
    expect(c.rootComparisonScope).toBe("ALL_ORIGINAL_FACT_AND_SUPPORTING_ANCESTRY_ROOTS"); for (const r of shared) expect(c.sharedRoots).toContain(r);
    expect(new Set(c.sharedRoots).size).toBe(c.sharedRoots.length); expect(new Set(c.changedRoots).size).toBe(c.changedRoots.length); expect(c.sharedRoots.some(r => c.changedRoots.includes(r))).toBe(false);
    expect([...c.sharedRoots, ...c.changedRoots].sort()).toEqual([...c.originalRootReferences].sort()); expect(c.newFactRoots).toBe(0);
    if (previous.originalRootId === null && current.originalRootId === null && shared.length) observed = true;
  }
  expect(observed).toBe(true);
});
it("records a real absent prior occurrence without inventing a substitute role or fact", () => {
  const absent = observation().previousGodWitnesses.flatMap(w => w.currentRoleResults).filter(r => r.occurrenceState === "NO_PREVIOUS_OCCURRENCE"); expect(absent.length).toBeGreaterThan(0);
  for (const r of absent) { expect(r.previousObservationIds).toEqual([]); expect(r.unverifiedPreviousObservationIds).toEqual([]); expect(r.selectedRepresentative).toBeNull(); }
});
it("retains the original matcher ambiguity for all ten research rows", () => {
  const original = result.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.native;
  if (original.version !== "annual-fortune-specialist-v1") throw Error("ANNUAL_REQUIRED");
  const composition = facts.request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
  const segment = original.observation.segments.find(s => s.contract.month === 6)!, index = new ActualBindingIndex(facts.request, catalog), rows = new AnnualSpecialistIndex(foundation).byKind.get("MONTHLY_TEN_GOD")!;
  expect(rows).toHaveLength(10); for (const row of rows) { expect(Object.hasOwn(row.original, "requiredRole")).toBe(false); const match = matchMonthlyGod(row, segment, composition.result.evidence, index); expect(match.matched).toBe(false); expect(match.role).toBe("AMBIGUOUS"); expect(match.reasons).toContain("AMBIGUOUS_MONTHLY_GOD_ROLE"); }
  expect(observation().monthlyGodRoleSourceAudit.every(r => r.originalRole === "AMBIGUOUS" && !r.requiredRoleAdded)).toBe(true);
});
it("reuses exact original current relation participants, periods, types and all twelve Binder gates", () => {
  const o = observation(); expect(o.typedBindings).toHaveLength(2);
  for (const s of o.segmentResults) for (const w of s.currentRelationWitnesses) { const n = facts.request.graph.nodes.find(v => v.id === w.originalGraphNodeId)!; expect(w.actualParticipants).toEqual(n.participants); expect(w.originalRelationFact).toEqual(n.value); expect(w.effectiveInterval).toEqual(n.temporal); expect(w.effectiveInterval).toMatchObject(s.previousGodWitness.currentInterval); expect(w.verificationState).toBe("VERIFIED"); }
  for (const b of o.typedBindings) {
    expect(b.use).toBe("CURRENT_FACT_SCOPE_ONLY_NOT_JUNE_APPLICABILITY"); expect(b.typedNativeReceipt.allTwelveGateResults).toHaveLength(12); expect(b.typedNativeReceipt.temporalWitnesses.every(w => w.start === b.effectiveInterval.start && w.endExclusive === b.effectiveInterval.endExclusive)).toBe(true);
    for (const key of ["unresolvedConditions", "sourceGroups", "requiredContext", "products", "relationships", "requiredUserState", "counterexamples", "prohibitions", "meaningIdentity", "claimIdentity"] as const) expect(b.typedCandidate.requirement[key]).toEqual(o.originalCandidate.requirement[key]);
    for (const gate of b.typedNativeReceipt.allTwelveGateResults) if (!["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"].includes(gate.gate)) { const original = o.originalNativeReceipt.allTwelveGateResults.find(g => g.gate === gate.gate)!; expect([gate.state, gate.reasons]).toEqual([original.state, original.reasons]); }
  }
});
it("preserves actual unknown-hour relation blockers without filling in an hour pillar", () => {
  const o = unknown.observation!, held = o.segmentResults.flatMap(s => s.currentRelationWitnesses).filter(w => w.relationSource === "month_natal_element"); expect(held.length).toBeGreaterThan(0); expect(held.every(w => w.verificationState === "WITHHELD")).toBe(true); expect(held.every(w => w.withholdReasons.length > 0)).toBe(true); expect(o.segmentResults.filter(s => s.currentRelationWitnesses.some(w => w.verificationState === "WITHHELD")).every(s => s.currentFactBinding === null)).toBe(true);
  expect(o.sourceRelationWitnesses.every(w => !w.actualParticipants.some(p => p.position === "hour"))).toBe(true);
});
it("preserves original conditional prior relations and uncertain June Dayun without inventing a current relation", () => {
  const o = ranged.observation!, held = o.sourceRelationWitnesses.filter(w => w.relationSource === "month_dayun_branch" && w.calculationCertainty === "conditional"); expect(held.length).toBeGreaterThan(0); expect(held.every(w => w.verificationState === "WITHHELD" && w.calculationCertainty !== "confirmed")).toBe(true); expect(held.every(w => w.withholdReasons.includes("CONDITIONAL_RELATION_NOT_CONFIRMED"))).toBe(true); expect(o.segmentResults.every(s => s.originalSegment.activeDayunContext.status === "transition_uncertain")).toBe(true); expect(o.segmentResults.flatMap(s => s.currentRelationWitnesses).filter(w => w.relationSource === "month_dayun_branch")).toEqual([]); expect(o.typedBindings).toEqual([]); expect(ranged.handoff.juneCandidates).toEqual([]);
});
it("keeps disjoint prior/current facts out of a simultaneous Native Binder receipt", () => {
  const o = observation(), previous = o.calculatedObservations[0].originalGraphNode, current = o.calculatedObservations.find(v => v.segmentPointer === o.segmentResults[0].segmentPointer)!.originalGraphNode, typed = structuredClone(o.originalCandidate), ids = [previous.id, current.id];
  for (const [i, n] of [previous, current].entries()) typed.requirement.sourceRequirements.push({ id: "negative-june-period-" + i, originalField: "/requires/2", originalDeclaration: o.originalResearchRecord.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: { kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", observationPointer: n.fact.observationPointer, fields: [] }, required: true, gaps: [] }); typed.requirement.requiredOwner = ["person"];
  const receipt = bindKnowledgeCandidate(typed, new ActualBindingIndex({ ...facts.request, restrictEvidenceTo: ids }, catalog), catalog); expect(receipt.allTwelveGateResults.find(g => g.gate === "TIME_INTERSECTION")).toMatchObject({ state: "FAIL", reasons: ["NO_TIME_INTERSECTION"] });
});
it.each([
  ["foreign fixture", "previousMatchingObservations.0.fixtureId", "foreign"], ["foreign owner", "previousMatchingObservations.0.owner", "foreign"], ["foreign selected year", "previousMatchingObservations.0.selectedYear", 2099],
  ["merged role", "previousMatchingObservations.0.originRole", "FLOW_GOD"], ["same god promoted to meaning", "independentMeaningCount", 1], ["current selected as past", "previousMatchingObservations.0.interval", { start: "2026-06-01T00:00:00+09:00", endExclusive: "2026-06-06T00:00:00+09:00" }], ["future selected as past", "previousMatchingObservations.0.interval", { start: "2099-01-01T00:00:00+09:00", endExclusive: "2099-02-01T00:00:00+09:00" }],
  ["source-free representative", "originalRoleSelected", "MONTH_STEM"], ["required role invented", "requiredRole", "MONTH_BRANCH_MAIN"], ["source hash", "originalJuneSourceProof.research.actualHash", "foreign"], ["producer version", "previousMatchingObservations.0.producerVersion", "foreign"], ["reference stem", "previousMatchingObservations.0.referenceStem", "foreign"], ["target stem", "previousMatchingObservations.0.targetStem", "foreign"], ["day master", "previousMatchingObservations.0.dayMaster", "foreign"],
  ["double counted root", "newFactRoots", 1], ["new meaning identity", "meaningIdentity", "invented"], ["new claim identity", "claimIdentity", "invented"], ["customer approval", "customerUseAllowed", true], ["role resolution invented", "roleResolutionState", "EXACT_ROLE_SCOPED_MATCH"], ["same god independent information", "comparisons.0.independentInformationAdded", 1]
])("rejects previous-god witness mutation: %s", async (_name, path, value) => { expect((await validatePreviousGodWitness(result.context!, change(structuredClone(witness()), path, value))).ok).toBe(false); });
it.each([
  ["relation participant", "segmentResults.0.currentRelationWitnesses.0.actualParticipants", []], ["relation type", "segmentResults.0.currentRelationWitnesses.0.relationType", "invented"], ["original receipt", "originalNativeReceipt.receiptId", "foreign"], ["source group deleted", "originalCandidate.requirement.sourceGroups", undefined], ["counterexample deleted", "originalCandidate.requirement.counterexamples", []], ["prohibition deleted", "originalCandidate.requirement.prohibitions", []], ["role research approved", "monthlyGodRoleSourceAudit.0.originalRole", "MONTH_STEM"], ["native gate relaxed", "typedBindings.0.typedNativeReceipt.allTwelveGateResults.0.state", "FORGED_PASS"], ["native time rewritten", "typedBindings.0.effectiveInterval.start", "2099-01-01T00:00:00+09:00"], ["claim identity created", "originalClaimIdentity", "invented"], ["meaning identity created", "originalMeaningIdentity", "invented"], ["customer approval", "customerApprovals", 1], ["independent facts", "independentFactsAdded", 1]
])("rejects June observation mutation: %s", async (_name, path, value) => { expect((await validateJuneObservation(result.context!, change(structuredClone(observation()), path, value))).ok).toBe(false); });
it("rejects confirmation of unknown-hour or conditional Dayun witnesses", async () => {
  for (const r of [unknown, ranged]) { const fake = structuredClone(r.observation!), segment = fake.segmentResults.find(s => s.currentRelationWitnesses.some(w => w.verificationState === "WITHHELD"))!, w = segment.currentRelationWitnesses.find(w => w.verificationState === "WITHHELD")!; w.verificationState = "VERIFIED"; w.withholdReasons = []; expect((await validateJuneObservation(r.context!, fake)).ok).toBe(false); }
});
it("rejects confirmation of an original conditional prior relation or the uncertain June Dayun context", async () => {
  const fake = structuredClone(ranged.observation!), conditional = fake.sourceRelationWitnesses.find(w => w.relationSource === "month_dayun_branch" && w.calculationCertainty === "conditional")!; conditional.calculationCertainty = "confirmed"; conditional.verificationState = "VERIFIED"; conditional.withholdReasons = []; expect((await validateJuneObservation(ranged.context!, fake)).ok).toBe(false);
  const changed = change(structuredClone(ranged.observation!), "segmentResults.0.originalSegment.activeDayunContext.status", "confirmed"); expect((await validateJuneObservation(ranged.context!, changed)).ok).toBe(false);
});
it("rejects a copied opaque context and a witness from a different actual fixture", async () => { expect((await evaluateJune(structuredClone(result.context!))).ok).toBe(false); expect((await validatePreviousGodWitness(unknown.context!, witness())).ok).toBe(false); });
it("never authorizes customer publication or Planner assignment", async () => { expect((await validatePreviousGodWitness(result.context!, witness(), "CUSTOMER_PUBLICATION")).ok).toBe(false); expect((await validateJuneObservation(result.context!, observation(), "CUSTOMER_PUBLICATION")).ok).toBe(false); expect((await validateJuneObservation(result.context!, observation(), "PLANNER_ASSIGNMENT")).ok).toBe(false); });
it("preserves all baseline candidates, receipt hashes, roots and zero customer handoffs", () => {
  expect(result.handoff.historicalAnnualCandidates).toEqual([...result.baseline.handoff.historicalAnnualCandidates, ...result.baseline.handoff.januaryCandidates]); expect(result.handoff.historicalMajorCandidates).toEqual(result.baseline.handoff.historicalMajorCandidates); expect(result.handoff.originalNativeReceipts).toEqual(result.baseline.handoff.originalNativeReceipts); expect(result.handoff.originalFactRoots).toEqual(facts.handoff.canonicalFactRoots); expect(result.handoff).toMatchObject({ newFactRoots: 0, customerClaims: 0, customerApprovals: 0, customerReaderBridges: 0, plannerUseAllowed: false });
});
