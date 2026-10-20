import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualOctoberFocus } from "../annual-october-focus/adapter";
import { NATIVE_MONTH_PAIR_CONTRACT } from "../native-requirement-binding/contract";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { compareAnnualSegments } from "../annual-fortune-specialist-engine/monthComparator";
import { auditBoundaries } from "../annual-fortune-specialist-engine/boundaryValidator";
import { validateAnnualRelation } from "../annual-fortune-specialist-engine/relationMatcher";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import type { AnnualCandidate, AnnualSegment, OriginalAnnual } from "../annual-fortune-specialist-engine/types";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt } from "../knowledge-binder/types";
import { intersectEvidencePeriods } from "../actual-evidence-graph/temporal";
import { BINDING_HARD_GATES } from "../types";

export const COMPARISON_CONTRACTS = freeze({
  3: { version: "annual-march-signature-comparison-v1", originalId: "afpr:month-slot:03", index: 2, jie: "경칩",
    recordSha256: "ec1daf02dd14578a4d6bd69fe8870144f81ebb0ad94ca1fd9de257ffe1fe9303",
    requires: ["selectedYear + actual civil month bounds", "every canonical segment", "actual before/after month pillar and relation signatures"] },
  9: { version: "annual-september-carryover-comparison-v1", originalId: "afpr:month-slot:09", index: 8, jie: "백로",
    recordSha256: "81de9d7b2756401b029c4d8c2eabdabaffe097fc812ee86ec1a75125831aee82",
    requires: ["selectedYear + actual civil month bounds", "every canonical segment", "prior month last segment + current first/new Jie segment"] },
} as const);
export type ComparisonMonth = keyof typeof COMPARISON_CONTRACTS;
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type ComparisonContext = Readonly<{ version: "annual-temporal-comparison-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; rows: Map<ComparisonMonth, AnnualCandidate>; receipts: KnowledgeBindingReceipt[]; segments: AnnualSegment[]; typedRoots: string[] };
const sessions = new WeakMap<ComparisonContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_COMPARISON_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, reasons: [e instanceof Error ? e.message : "ANNUAL_COMPARISON_UNVERIFIED"], customerUseAllowed: false as const });
async function source(row: AnnualCandidate, month: ComparisonMonth, services: Services) {
  const pin = COMPARISON_CONTRACTS[month], common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await services.resolver.record(row.candidate.record), proof = await services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== month || row.original.scope !== "civil_month"
    || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_COMPARISON_SOURCE_REQUIRED");
  return proof;
}
export async function prepareComparisonContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualOctoberFocus(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const index = new AnnualSpecialistIndex(services.foundation), rows = new Map<ComparisonMonth, AnnualCandidate>();
    for (const month of [3, 9] as const) { const row = index.byOriginalId.get(COMPARISON_CONTRACTS[month].originalId); if (!row) throw Error("ORIGINAL_MONTH_SOURCE_REQUIRED"); await source(row, month, services); rows.set(month, freeze(structuredClone(row))); }
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const context = freeze({ version: "annual-temporal-comparison-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: structuredClone(request), services, rows, receipts: freeze(structuredClone(native.receipts)), segments: structuredClone(native.observation.segments), typedRoots: [...bridge.handoff.canonicalFactRoots] });
    return { ok: true as const, context, baseline };
  } catch (e) { return fail(e); }
}
const stableOrder = <T,>(values: readonly T[]): T[] => [...values].sort((a, b) => v4Digest(a) < v4Digest(b) ? -1 : v4Digest(a) > v4Digest(b) ? 1 : 0);
function side(segment: AnnualSegment, e: OriginalAnnual, index: ActualBindingIndex) {
  const b = index.graph.nodes.get(segment.contract.boundaryNodeId!);
  if (!b || b.kind !== "TEMPORAL_BOUNDARY" || b.owner.fixtureOwnerId !== segment.owner || b.fact.observationPointer !== segment.originalPointer || !same(b.temporal, segment.contract.window)
    || b.producer.symbol !== "buildAnnualMonthCalendar" || b.producer.version !== segment.sourceVersion) throw Error("ORIGINAL_BOUNDARY_IDENTITY_REQUIRED");
  const graphEvidence = [b, ...Object.values(segment.contract.componentNodeIds).map(id => index.graph.nodes.get(id!)!), ...segment.raw.relationFacts.flatMap(f => segment.nodes.filter(n => n.fact.producerEvidenceId === f.id))];
  const relations = segment.raw.relationFacts.map(f => validateAnnualRelation(segment, f, e));
  const reasons = sorted([...graphEvidence.flatMap(n => n.id === b.id ? [] : validateAnnualNodeIdentity(n, segment)),
    ...graphEvidence.filter(n => !n.ancestry.complete || n.ancestry.missingIds.length || n.ancestry.cycle || n.status !== "VERIFIED" || n.certainty !== "confirmed" || n.sources.some(v => v.state !== "VERIFIED")).map(n => "UNVERIFIED_REQUIRED_GRAPH_FACT:" + n.id),
    ...relations.flatMap(r => r.reasons), ...(segment.raw.activeDayunContext.status === "transition_uncertain" || segment.raw.uncertainty.length ? ["CONDITIONAL_DAYUN_COMPARISON_WITHHELD"] : [])]);
  const relationSignatures = segment.raw.relationFacts.map(f => {
    const n = graphEvidence.find(n => n.fact.producerEvidenceId === f.id)!;
    const value = { ...f }; Reflect.deleteProperty(value, "id");
    // IDs, windows and period-specific roots prove provenance, not meaning change.
    return { value, producer: n.producer, participants: stableOrder(n.participants), direction: n.direction, ancestorDomains: n.ancestry.domains };
  });
  const signature = { monthPillar: segment.raw.monthPillar, effectiveAnnualPillar: segment.raw.effectiveAnnualPillar, activeDayunContext: segment.raw.activeDayunContext,
    stemTenGod: segment.raw.stemTenGod, branchTenGod: segment.raw.branchTenGod, relations: stableOrder(relationSignatures) };
  return { pointer: segment.originalPointer, recordHash: segment.recordHash, owner: segment.owner, selectedYear: segment.contract.selectedYear, interval: segment.contract.window,
    producer: b.producer, graphEvidence, relations, roots: sorted(graphEvidence.flatMap(n => n.ancestry.rootIds)), signature, signatureHash: v4Digest(signature),
    state: reasons.length ? "WITHHELD" as const : "VERIFIED" as const, reasons };
}
function bindSide(s: Session, row: AnnualCandidate, segment: AnnualSegment, month: ComparisonMonth) {
  const candidate = structuredClone(row.candidate), contract = segment.contract;
  const ids = [contract.boundaryNodeId!, contract.componentNodeIds.month!, contract.componentNodeIds.annual!, contract.componentNodeIds.ten_gods!];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  for (const role of ["MONTH_PILLAR", "EFFECTIVE_ANNUAL", "MONTH_STEM", "MONTH_BRANCH_MAIN", "BOUNDARY"] as const) {
    const god = role === "MONTH_STEM" ? segment.raw.stemTenGod : role === "MONTH_BRANCH_MAIN" ? segment.raw.branchTenGod : undefined;
    const selector = annualRoleSelector(role, god, contract)!;
    selector.producer = index.graph.nodes.get(role === "BOUNDARY" ? contract.boundaryNodeId! : contract.componentNodeIds[role === "EFFECTIVE_ANNUAL" ? "annual" : role === "MONTH_PILLAR" ? "month" : "ten_gods"]!)!.producer;
    candidate.requirement.sourceRequirements.push({ id: `${row.catalogKey}#${COMPARISON_CONTRACTS[month].version}/${contract.month}/${contract.segmentIndex}/${role}`, originalField: "/requires/2", originalDeclaration: row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] });
  }
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!;
  const technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || receipt.customerApproved || receipt.operatorApproved || receipt.selectedActualEvidence.length !== 4 || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES)
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation) || receipt.canonicalFactRoots.some(r => !s.typedRoots.includes(r))) throw Error("EXACT_INDEPENDENT_NATIVE_RECEIPT_REQUIRED");
  return { segmentPointer: segment.originalPointer, use: "INDEPENDENT_EXACT_PERIOD_BINDING" as const, typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}
async function evaluate(s: Session, context: ComparisonContext, month: ComparisonMonth, catalogKey: string) {
  const row = s.rows.get(month); if (!row || row.catalogKey !== catalogKey) throw Error("EXACT_MONTH_COMPARISON_SOURCE_REQUIRED");
  const proof = await source(row, month, s.services), c = s.request.graphInput.evidence.composition;
  if (c.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
  const e = c.result.evidence, all = s.segments.filter(v => v.contract.month === month), previous = s.segments.filter(v => v.contract.month === month - 1).at(-1), pin = COMPARISON_CONTRACTS[month];
  const raw = e.raw.calendarMonths![month - 1];
  if (!previous || !all.length || all.length !== raw.segments.length || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive || previous.raw.endKstExclusive !== raw.startKst
    || all.some((v, i) => v.contract.selectedYear !== e.selectedYear || v.owner !== previous.owner || !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash || v.contract.window.certainty !== "confirmed" || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst)
    || all.filter(v => v.raw.boundaryReason.includes("jie:" + pin.jie)).length !== 1) throw Error("ACTUAL_PREVIOUS_EVERY_SEGMENT_AND_JIE_REQUIRED");
  if (month === 3 && all.some(v => !same(v.raw.effectiveAnnualPillar, previous.raw.effectiveAnnualPillar))) throw Error("MARCH_ANNUAL_CONTINUITY_REQUIRED_NO_IPCHUN_REISSUE");
  const index = new ActualBindingIndex(s.request, s.services.foundation.catalog), chain = [previous, ...all], sides = chain.map(v => side(v, e, index));
  const comparator = compareAnnualSegments(s.segments), boundaries = auditBoundaries(s.segments);
  const pairs = sides.slice(1).map((after, i) => {
    const before = sides[i], observed = comparator.segmentEdges.find(v => v.from === before.pointer && v.to === after.pointer);
    if (!observed || observed.comparisonApproved !== false || intersectEvidencePeriods([before.interval, after.interval]).state !== "NO_INTERSECTION" || before.interval.endExclusive !== after.interval.start) throw Error("ORIGINAL_NONCONCURRENT_ADJACENT_COMPARISON_REQUIRED");
    const actualBoundary = boundaries.find(v => v.afterPointer === after.pointer) ?? { instant: after.interval.start, reason: chain[i + 1].raw.boundaryReason, beforePointer: before.pointer, afterPointer: after.pointer, state: "VERIFIED_ADJACENT_CIVIL_BOUNDARY" as const };
    if (actualBoundary.beforePointer !== before.pointer || actualBoundary.instant !== after.interval.start) throw Error("EXACT_ORIGINAL_BOUNDARY_REQUIRED");
    const shared = before.roots.filter(r => after.roots.includes(r)), beforeOnly = before.roots.filter(r => !after.roots.includes(r)), afterOnly = after.roots.filter(r => !before.roots.includes(r));
    const changedFields = (Object.keys(before.signature) as (keyof typeof before.signature)[]).filter(k => !same(before.signature[k], after.signature[k]));
    const reasons = sorted([...before.reasons, ...after.reasons]), result = reasons.length ? "WITHHELD" as const : changedFields.length ? "VERIFIED_SIGNATURE_DIFFERENCE" as const : month === 9 && i === 0 ? "CARRYOVER_CONTINUITY" as const : "CONTINUITY" as const;
    const body = { version: "annual-temporal-comparison-witness-v1" as const, originalResearchId: row.originalResearchId, originalRecordHash: proof.actualHash, sourceVersion: proof.sourceVersion, product: "annual_fortune" as const, fixtureId: context.fixtureId, owner: previous.owner,
      comparisonType: observed.level, beforeSegmentPointer: before.pointer, afterSegmentPointer: after.pointer, beforeInterval: before.interval, afterInterval: after.interval, beforeProducer: before.producer, afterProducer: after.producer,
      beforeGraphEvidence: before.graphEvidence.map(n => n.id), afterGraphEvidence: after.graphEvidence.map(n => n.id), beforeRootSet: before.roots, afterRootSet: after.roots, sharedRootSet: shared, changedRootSet: sorted([...beforeOnly, ...afterOnly]),
      beforeSignature: before.signature, afterSignature: after.signature, actualBoundary, originalComparatorObservation: observed, result, changedFields: reasons.length ? [] : changedFields, reasons,
      sourcePreconditionProof: { beforeRecordHash: before.recordHash, afterRecordHash: after.recordHash, beforeSourceProof: proof, afterSourceProof: proof, originalRequiredConditions: row.original.requires },
      periodSemantics: "NON_SIMULTANEOUS_COMPARISON" as const, meaningReviewState: "REVIEW_REQUIRED" as const, customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING" as const,
      comparisonApproved: false as const, independentCalculatedFact: false as const, independentInformationAdded: 0 as const, newFactRoots: 0 as const };
    return { ...body, comparisonId: `annual-temporal-comparison:v1:${v4Digest(body)}` };
  });
  const sourcePreconditions = { use: "SOURCE_PRECONDITION_ONLY_NOT_SIMULTANEOUS_SELECTION" as const, selectedYear: e.selectedYear, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive },
    previousLastPointer: previous.originalPointer, allCurrentSegmentPointers: all.map(v => v.originalPointer), actualJiePointer: all.find(v => v.raw.boundaryReason.includes("jie:" + pin.jie))!.originalPointer,
    originalRequiredConditions: row.original.requires, marchIpchunReissued: false as const };
  const monthReady = pairs.every(p => p.result !== "WITHHELD");
  const typedReceipts = monthReady ? chain.map(v => bindSide(s, row, v, month)) : [];
  const originalGraphRoots = sorted(s.request.graph.nodes.flatMap(n => n.fact.rootId ? [n.fact.rootId] : []));
  if (sides.some(v => v.roots.some(r => !originalGraphRoots.includes(r)))) throw Error("ORIGINAL_GRAPH_ROOTS_ONLY");
  const original = s.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!;
  const body = { version: "annual-march-september-comparison-candidate-v1" as const, month, technicalContract: pin.version, fixtureId: context.fixtureId, originalResearchId: row.originalResearchId, originalCatalogKey: catalogKey,
    originalSourceProof: proof, originalResearchRecord: row.original, originalCandidate: row.candidate, originalNativeReceipt: original, originalNativeReceiptHash: actualSemanticDigest(original),
    originalMeaningIdentity: null, originalClaimIdentity: null, sourcePreconditions, segmentProofs: sides, comparisonWitnesses: pairs, typedReceipts,
    originalFactRoots: sorted(typedReceipts.flatMap(r => r.typedNativeReceipt.canonicalFactRoots)), comparisonReferenceRoots: sorted(sides.flatMap(v => v.roots)),
    additionalExistingGraphReferenceRoots: sorted(sides.flatMap(v => v.roots).filter(r => !s.typedRoots.includes(r))), verifiedActualUnitIds: [] as string[],
    allTwelveGateResults: typedReceipts.map(r => ({ segmentPointer: r.segmentPointer, receiptId: r.typedNativeReceipt.receiptId, gates: r.typedNativeReceipt.allTwelveGateResults })),
    blockingReasons: typedReceipts.flatMap(r => r.typedNativeReceipt.blockingReasons), meaningReviewState: "REVIEW_REQUIRED" as const, productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const,
    customerUseAllowed: false as const, plannerUseAllowed: false as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  return { month, monthReady, observation: freeze(structuredClone({ source: proof, sourcePreconditions, segmentProofs: sides, comparisonWitnesses: pairs })),
    candidate: monthReady ? freeze(structuredClone({ ...body, technicalState: "TECHNICAL_COMPARISON_VERIFIED" as const, candidateId: `annual-comparison-candidate:v1:${v4Digest(body)}` })) : null };
}
export type ComparisonCandidate = NonNullable<Awaited<ReturnType<typeof evaluate>>["candidate"]>;
export async function evaluateComparisonMonth(context: ComparisonContext, month: ComparisonMonth, catalogKey: string) {
  offline();
  try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_COMPARISON_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s, context, month, catalogKey) }; }
  catch (e) { return fail(e); }
}
export async function validateComparisonCandidate(context: ComparisonContext, candidate: ComparisonCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const expected = await evaluateComparisonMonth(context, candidate.month, candidate.originalCatalogKey);
  return { ok: expected.ok && expected.candidate !== null && same(expected.candidate, candidate), reasons: expected.ok ? expected.candidate !== null && same(expected.candidate, candidate) ? [] : ["ORIGINAL_COMPARISON_CANDIDATE_CHANGED_OR_WITHHELD"] : expected.reasons, customerUseAllowed: false as const };
}
