import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { annualNarrativeEvidence } from "../../../interpretation-v4/annualEvidence";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualFebruaryRelations } from "../annual-february-relation/adapter";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { validateAnnualRelation } from "../annual-fortune-specialist-engine/relationMatcher";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import { validateDayunContext } from "../annual-fortune-specialist-engine/boundaryValidator";
import type { AnnualCandidate, AnnualSegment, OriginalAnnual } from "../annual-fortune-specialist-engine/types";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import { NATIVE_MONTH_PAIR_CONTRACT } from "../native-requirement-binding/contract";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt } from "../knowledge-binder/types";
import { BINDING_HARD_GATES } from "../types";
import { hash } from "../sourceReader";

import type { CustomerDayunCycle } from "../../../saju/customerDayun";
export const AUGUST_CONTRACT = freeze({ version: "annual-august-conditional-dayun-binding-v1", originalId: "afpr:month-slot:08", index: 7,
  recordSha256: "b20fb8c21347dccfe1e0dfc36b1d2dc989fba861c548d70b22aa91d569128945",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "actual uncertainty range if present + conditional counterpart cycle"] } as const);
export const AUGUST_SOURCE_FILES = freeze({
  "src/lib/interpretation-v4/annualEvidence.ts": "11a74bd10e28546653725c59af931f7a18c1e67a218d1b0824b97f292c9513f1",
  "src/lib/saju/customerDayun.ts": "d4249f81df903de85ce7ea088696b2dc7522eca36a9ee8e6a841655d6d899123",
  "src/lib/saju/calendarVersion.ts": "4afd5b85df5f5cd5e2d5b6249077b40c3bca1057aae5662e12fbb1ebd73a07a5",
  "src/lib/report-knowledge/annualMonthJie.ts": "555676ca85aefd8812ebad1f4bc7ff863a9eb78e92a8ce977c79f792f0b12d5f",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/boundaryValidator.ts": "ecca715f9d7b8ed4f1e3eabf49aab58b8c972f36d1c4b6b30e46ebce69041440",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/relationMatcher.ts": "546cb3f97227273be1705ae330d516a4e516caf7fd065a72630bf29ad33f74b4",
  "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/periods.ts": "70413c47eb8f8819b3b7542cff932f3ac05e132dcd859b629265d1b60ae46753"
} as const);
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type AugustContext = Readonly<{ version: "annual-august-dayun-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; row: AnnualCandidate; originalReceipt: KnowledgeBindingReceipt; segments: AnnualSegment[]; typedRoots: string[]; index: ActualBindingIndex; original: OriginalAnnual };
const sessions = new WeakMap<AugustContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_AUGUST_RELATION_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, verificationState: "WITHHELD_UNVERIFIED_RANGE" as const, reasons: [e instanceof Error ? e.message : "AUGUST_RELATION_UNVERIFIED"], customerUseAllowed: false as const });
async function source(s: Pick<Session, "row" | "services">) {
  const row = s.row, pin = AUGUST_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await s.services.resolver.record(row.candidate.record), proof = await s.services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 8 || row.original.scope !== "civil_month" || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false
    || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_AUGUST_SOURCE_REQUIRED");
  const files = Object.entries(AUGUST_SOURCE_FILES).map(([file, expectedHash]) => {
    const actualHash = hash(s.services.resolver.reader.text(file));
    if (actualHash !== expectedHash || s.services.resolver.frozen.get(file) !== expectedHash) throw Error("ORIGINAL_RELATION_SOURCE_FILE_CHANGED:" + file);
    return { file, actualHash, expectedHash, sourceVersion: expectedHash, verification: "REPOSITORY_CODE_ONLY_NOT_MEANING_APPROVAL" as const };
  });
  return { research: proof, files };
}
export async function prepareAugustContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualFebruaryRelations(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const row = new AnnualSpecialistIndex(services.foundation).byOriginalId.get(AUGUST_CONTRACT.originalId);
    if (!row) throw Error("ORIGINAL_AUGUST_SOURCE_REQUIRED"); await source({ row, services });
    const composition = request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
    const original = composition.result.evidence;
    // Reexecute the original producer, including the full Dayun basis and canonical calendar.
    const reproduced = await annualNarrativeEvidence(request.graphInput.evidence.input, original.clock);
    if (!reproduced.ok || !same(reproduced, original)) throw Error("ORIGINAL_ANNUAL_DAYUN_CALENDAR_NOT_REPRODUCIBLE");
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog);
    if (index.errors.length) throw Error(index.errors.join("|"));
    const context = freeze({ version: "annual-august-dayun-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: snapshot, index, services, row: freeze(structuredClone(row)), originalReceipt: freeze(structuredClone(native.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!)), segments: structuredClone(native.observation.segments), typedRoots: [...bridge.handoff.canonicalFactRoots], original: freeze(structuredClone(original)) });
    return { ok: true as const, context, baseline };
  } catch (e) { return fail(e); }
}
function originalNode(s: Session, id: string | null | undefined): ActualEvidenceNode {
  const n = id ? s.index.graph.nodes.get(id) : null;
  if (!n || n.owner.fixtureOwnerId !== s.request.graph.context.owners.person || !n.ancestry.complete || n.ancestry.missingIds.length || n.ancestry.cycle || n.fact.rootId !== null && !n.ancestry.rootIds.includes(n.fact.rootId)
    || n.ancestry.rootIds.some(r => ![...s.index.graph.nodes.values()].some(p => p.fact.rootId === r)) || n.sources.some(p => p.state !== "VERIFIED") || n.status === "WITHHELD"
    || n.blockers.some(b => b.code !== "UNADDRESSABLE_PRODUCER_OBSERVATION") || n.fact.addressability === "PRODUCER_OBSERVATION_ONLY" && (!n.fact.observationPointer || !n.producer.version)) throw Error("ORIGINAL_GRAPH_ANCESTRY_REQUIRED");
  return n;
}
// A Source witness authenticates possible states; it never authorizes either possible cycle.
function verification(status: AnnualSegment["raw"]["activeDayunContext"]["status"], invalid: boolean) {
  if (invalid) return { verificationState: "WITHHELD_UNVERIFIED_RANGE", actualCycleConfirmed: false, uncertaintyVerificationState: "UNVERIFIED" } as const;
  if (status === "transition_uncertain") return { verificationState: "CONDITIONAL_RANGE_SOURCE_VERIFIED", actualCycleConfirmed: false, uncertaintyVerificationState: "CONDITIONAL_RANGE_SOURCE_VERIFIED" } as const;
  if (status === "before_first_cycle") return { verificationState: "BEFORE_FIRST_CYCLE", actualCycleConfirmed: false, uncertaintyVerificationState: "NO_UNCERTAINTY_PRESENT_VERIFIED" } as const;
  return { verificationState: "CONFIRMED_ACTIVE_CYCLE", actualCycleConfirmed: true, uncertaintyVerificationState: "NO_UNCERTAINTY_PRESENT_VERIFIED" } as const;
}
function witness(s: Session, segment: AnnualSegment, proof: Awaited<ReturnType<typeof source>>) {
  const basis = s.original.raw.customerDayun; if (!basis) throw Error("ORIGINAL_CUSTOMER_DAYUN_REQUIRED");
  const context = segment.raw.activeDayunContext, boundary = originalNode(s, segment.contract.boundaryNodeId);
  const dayun = s.index.graph.nodes.get(segment.contract.componentNodeIds.dayun!);
  if (!dayun || !same(dayun.value, { component: "dayun", activeDayunContext: context }) || validateAnnualNodeIdentity(dayun, segment).length) throw Error("ORIGINAL_DAYUN_GRAPH_COMPONENT_REQUIRED");
  const reasons = validateDayunContext(basis, segment.raw), candidateCycles: { cycle: CustomerDayunCycle; originalGraphNode: ActualEvidenceNode }[] = [];
  for (const c of context.cycles) {
    const ordinal = basis.cycles.findIndex(v => v.index === c.index && v.ganji === c.ganji), cycle = basis.cycles[ordinal];
    const node = [...s.index.graph.nodes.values()].find(n => n.fact.observationPointer === `/composition/result/evidence/raw/customerDayun/cycles/${ordinal}` && n.owner.fixtureOwnerId === segment.owner);
    if (!cycle || !node || node.producer.symbol !== "calculateCustomerDayun" || node.producer.version !== basis.calculationVersion
      || !same(node.value, { index: cycle.index, ganji: cycle.ganji, stem: cycle.stem, branch: cycle.branch, startYear: cycle.startYear, endYear: cycle.endYear, activeAtEvaluation: (node.value as { activeAtEvaluation: boolean | null }).activeAtEvaluation, tenYearCycle: true })
      || !same(node.temporal?.transitionRange, cycle.startSolarRange)) throw Error("ORIGINAL_CANDIDATE_CYCLE_IDENTITY_REQUIRED");
    candidateCycles.push({ cycle, originalGraphNode: node });
  }
  const range = context.transitionRange, uncertainNext = range ? candidateCycles.find(c => same(c.cycle.startSolarRange, range)) ?? null : null;
  const previousCycle = uncertainNext ? basis.cycles.find(c => c.index === uncertainNext.cycle.index - 1) ?? null : null;
  if (context.includesBeforeFirstCycle !== (context.status === "before_first_cycle" || context.status === "transition_uncertain" && previousCycle === null)) reasons.push("ORIGINAL_BEFORE_FIRST_CYCLE_FLAG_REQUIRED");
  if (range) {
    if (!uncertainNext || !(Date.parse(range.earliestKst) < Date.parse(range.latestKst)) || Date.parse(segment.raw.startKst) < Date.parse(range.earliestKst) || Date.parse(segment.raw.endKstExclusive) > Date.parse(range.latestKst)
      || !same(segment.raw.uncertainty, [{ kind: "dayun_transition", range }])) reasons.push("EXACT_ORIGINAL_UNCERTAINTY_WINDOW_REQUIRED");
  } else if (context.status === "transition_uncertain" || segment.raw.uncertainty.length) reasons.push("NO_FABRICATED_UNCERTAINTY_ALLOWED");
  const relations = segment.raw.relationFacts.flatMap((f, ordinal) => {
    if (f.source !== "month_dayun_branch" || f.counterpart.scope !== "dayun") return [];
    const node = segment.nodes.find(n => n.fact.producerEvidenceId === f.id && same(n.value, f));
    if (!node || !same(s.index.graph.nodes.get(node.id), node) || node.fact.observationPointer !== `${segment.originalPointer}/relationFacts/${ordinal}`) throw Error("ORIGINAL_CONDITIONAL_RELATION_NODE_REQUIRED");
    const counterpart = f.counterpart, cycle = candidateCycles.find(c => c.cycle.index === counterpart.cycleIndex && c.cycle.ganji === counterpart.pillar);
    if (!cycle || f.certainty !== (context.status === "transition_uncertain" ? "conditional" : "confirmed") || node.certainty !== f.certainty || validateAnnualNodeIdentity(node, segment).length) reasons.push("ORIGINAL_RELATION_CANDIDATE_SOURCE_REQUIRED");
    return [{ originalRelationId: f.id, originalRelation: f, originalCandidateCycle: cycle?.cycle ?? null, originalGraphNode: node, originalValidator: validateAnnualRelation(segment, f, s.original), eligibleAsConfirmedRelation: false as const }];
  });
  const seed = [boundary, dayun, ...candidateCycles.map(c => c.originalGraphNode), ...relations.map(r => r.originalGraphNode)], ancestry = new Map<string, ActualEvidenceNode>();
  const visit = (node: ActualEvidenceNode) => { if (ancestry.has(node.id)) return; ancestry.set(node.id, node); for (const id of node.ancestry.parentIds) { const parent = s.index.graph.nodes.get(id); if (!parent) reasons.push("MISSING_ORIGINAL_ANCESTOR:" + id); else visit(parent); } };
  seed.forEach(visit); const nodes = [...ancestry.values()];
  if (nodes.some(n => n.owner.fixtureOwnerId !== segment.owner || !n.ancestry.complete || n.ancestry.missingIds.length || n.ancestry.cycle || n.sources.some(p => p.state !== "VERIFIED") || n.ancestry.rootIds.some(r => ![...s.index.graph.nodes.values()].some(p => p.fact.rootId === r)))) reasons.push("ORIGINAL_COMPLETE_SOURCE_ANCESTRY_REQUIRED");
  const blocking = sorted(nodes.flatMap(n => n.blockers.map(b => b.code)));
  if (context.status === "transition_uncertain" && (dayun.status !== "WITHHELD" || !dayun.blockers.some(b => b.code === "UNCERTAIN_TRANSITION") || dayun.certainty !== "conditional")) reasons.push("ORIGINAL_CONDITIONAL_WITHHOLD_REQUIRED");
  const unresolved = sorted([...reasons, ...(context.status !== "active" ? [context.status === "before_first_cycle" ? "BEFORE_FIRST_DAYUN" : "UNCERTAIN_TRANSITION"] : []), ...blocking.filter(b => b !== "UNADDRESSABLE_PRODUCER_OBSERVATION")]);
  const body = { version: "annual-conditional-dayun-scope-v1" as const, recordKind: "SOURCE_SCOPE_ONLY_NOT_CALCULATED_FACT" as const, fixtureId: s.request.graph.context.fixtureId,
    originalResearchId: s.row.originalResearchId, originalSourceProof: proof, originalCycleProducer: { file: "src/lib/saju/customerDayun.ts", symbol: "calculateCustomerDayun", version: basis.calculationVersion, system: "dayun" },
    producerVersion: basis.calculationVersion, calendarVersion: basis.calendarVersion, sourceHash: AUGUST_SOURCE_FILES["src/lib/saju/customerDayun.ts"], sourceVersion: AUGUST_SOURCE_FILES["src/lib/saju/customerDayun.ts"],
    originalOwner: dayun.owner, selectedYear: s.original.selectedYear, originalMonthSegment: segment.raw, segmentPointer: segment.originalPointer, originalRecordHash: segment.recordHash,
    originalBoundaryNode: boundary, exactSegmentWindow: segment.contract.window, originalDayunContext: context, contextStatus: context.status,
    earliestKst: range?.earliestKst ?? null, latestKst: range?.latestKst ?? null, originalCandidateCycles: candidateCycles, originalCandidateCycleIndices: context.cycles.map(c => c.index), originalCandidateCycleGanji: context.cycles.map(c => c.ganji),
    previousCycle, candidateNextCycle: uncertainNext?.cycle ?? null, includesBeforeFirstCycle: context.includesBeforeFirstCycle, candidatesAreAlternatives: context.status === "transition_uncertain", simultaneousConfirmedCycles: 0 as const,
    originalGraphNodes: seed, originalGraphStatuses: seed.map(n => ({ nodeId: n.id, status: n.status, blockers: n.blockers })), completeAncestry: nodes,
    existingFactRoots: sorted(nodes.flatMap(n => n.ancestry.rootIds)), conditionalRelations: relations, ...verification(context.status, reasons.length > 0), unresolvedConditions: unresolved,
    producerReexecutionVerified: true as const, actualRelationConfirmed: false as const, customerMeaningApproved: false as const, meaningIdentity: null, claimIdentity: null,
    customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING" as const, customerUseAllowed: false as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  return freeze(structuredClone({ ...body, witnessId: `annual-conditional-dayun-witness:v1:${v4Digest(body)}` }));
}
export type ConditionalDayunWitness = ReturnType<typeof witness>;
function bindSegment(s: Session, segment: AnnualSegment, witnesses: ConditionalDayunWitness[]) {
  const candidate = structuredClone(s.row.candidate), ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  for (const [i, role] of (["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"] as const).entries()) candidate.requirement.sourceRequirements.push({ id: `${s.row.catalogKey}#${AUGUST_CONTRACT.version}/${segment.contract.segmentIndex}/${i}`, originalField: "/requires/0", originalDeclaration: s.row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: annualRoleSelector(role, undefined, segment.contract)!, required: true, gaps: [] });
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.originalReceipt, technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || !same(sorted(receipt.selectedActualEvidence), sorted(ids)) || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || receipt.customerApproved || receipt.operatorApproved
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation)) throw Error("EXACT_AUGUST_NATIVE_BINDING_REQUIRED");
  return { version: AUGUST_CONTRACT.version, segmentPointer: segment.originalPointer, effectiveInterval: segment.contract.window, sourcePreconditionWitnessIds: witnesses.map(w => w.witnessId), sourceWitnessesAreGraphFacts: false as const, typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}
async function evaluate(s: Session) {
  const proof = await source(s), e = s.original, raw = e.raw.calendarMonths![7], all = s.segments.filter(v => v.contract.month === 8);
  if (!all.length || all.length !== raw.segments.length || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive
    || all.some((v, i) => !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash || v.contract.selectedYear !== e.selectedYear || v.owner !== s.request.graph.context.owners.person || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst)) throw Error("EVERY_ORIGINAL_AUGUST_SEGMENT_REQUIRED");
  const segmentResults = all.map(segment => {
    const nodes = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!].map(id => originalNode(s, id)), boundary = nodes[0];
    if (boundary.kind !== "TEMPORAL_BOUNDARY" || boundary.fact.observationPointer !== segment.originalPointer || !same(boundary.temporal, segment.contract.window) || boundary.producer.symbol !== "buildAnnualMonthCalendar"
      || boundary.producer.version !== segment.sourceVersion || nodes.slice(1).some(n => validateAnnualNodeIdentity(n, segment).length)) throw Error("ORIGINAL_BOUNDARY_COMPONENT_IDENTITY_REQUIRED");
    const scope = witness(s, segment, proof), reasons = scope.unresolvedConditions;
    return { segmentPointer: segment.originalPointer, originalSegment: segment.raw, originalGraphEvidence: nodes, scopeWitness: scope, state: reasons.length ? "WITHHELD" as const : "VERIFIED" as const, reasons,
      binding: reasons.length ? null : bindSegment(s, segment, [scope]) };
  });
  const typedBindings = segmentResults.flatMap(v => v.binding ? [v.binding] : []), witnesses = segmentResults.map(v => v.scopeWitness), roots = sorted(typedBindings.flatMap(b => b.typedNativeReceipt.canonicalFactRoots));
  const body = { version: AUGUST_CONTRACT.version, fixtureId: s.request.graph.context.fixtureId, month: 8 as const, originalResearchId: s.row.originalResearchId, originalCatalogKey: s.row.catalogKey, originalSourceProof: proof, originalResearchRecord: s.row.original,
    originalCandidate: s.row.candidate, originalNativeReceipt: s.originalReceipt, originalNativeReceiptHash: actualSemanticDigest(s.originalReceipt), originalMeaningIdentity: null, originalClaimIdentity: null,
    sourcePreconditions: { selectedYear: e.selectedYear, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive }, everyCanonicalSegment: all.map(s => s.originalPointer), originalRequiredConditions: s.row.original.requires, allSegmentsRequired: true as const, uncertaintyOnlyIfPresent: true as const, witnessesAreNotGraphFacts: true as const },
    segmentResults, conditionalDayunWitnesses: witnesses, typedBindings, originalFactRoots: roots, additionalExistingGraphReferenceRoots: roots.filter(r => !s.typedRoots.includes(r)), verifiedActualUnitIds: [] as string[],
    meaningReviewState: "REVIEW_REQUIRED" as const, productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const, customerUseAllowed: false as const, plannerUseAllowed: false as const,
    customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  const monthReady = segmentResults.every(s => s.state === "VERIFIED");
  return { monthReady, observation: freeze(structuredClone({ source: proof, segmentResults, conditionalDayunWitnesses: witnesses, typedBindings })),
    candidate: monthReady ? freeze(structuredClone({ ...body, technicalState: "TECHNICAL_AUGUST_CONFIRMED_SCOPE_VERIFIED" as const, candidateId: `annual-august-dayun-candidate:v1:${v4Digest(body)}` })) : null };
}
export type AugustCandidate = NonNullable<Awaited<ReturnType<typeof evaluate>>["candidate"]>;
export async function evaluateAugust(context: AugustContext) {
  offline(); try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_AUGUST_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s) }; } catch (e) { return fail(e); }
}
export async function validateConditionalDayunWitness(context: AugustContext, witness: ConditionalDayunWitness, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateAugust(context), expected = result.ok ? result.observation.conditionalDayunWitnesses.find(w => w.witnessId === witness.witnessId) : null;
  return { ok: !!expected && same(expected, witness), eligibleAsCalculatedFact: false as const, verificationState: expected && same(expected, witness) ? expected.verificationState : "WITHHELD_UNVERIFIED_RANGE", reasons: expected && same(expected, witness) ? [] : ["ORIGINAL_CONDITIONAL_SCOPE_WITNESS_CHANGED"], customerUseAllowed: false as const };
}
export async function validateAugustCandidate(context: AugustContext, candidate: AugustCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateAugust(context);
  return { ok: result.ok && result.candidate !== null && same(result.candidate, candidate), reasons: result.ok && result.candidate !== null && same(result.candidate, candidate) ? [] : ["ORIGINAL_AUGUST_CANDIDATE_CHANGED_OR_WITHHELD"], customerUseAllowed: false as const };
}
