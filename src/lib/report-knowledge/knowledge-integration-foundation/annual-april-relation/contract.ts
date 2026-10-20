import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualTemporalComparisons } from "../annual-temporal-comparison/adapter";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { validateAnnualRelation } from "../annual-fortune-specialist-engine/relationMatcher";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import type { AnnualCandidate, AnnualSegment, OriginalAnnual } from "../annual-fortune-specialist-engine/types";
import type { EvidenceParticipant } from "../actual-evidence-graph/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import { NATIVE_MONTH_PAIR_CONTRACT } from "../native-requirement-binding/contract";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, EvidenceSelector } from "../knowledge-binder/types";
import { BINDING_HARD_GATES } from "../types";

export const APRIL_CONTRACT = freeze({ version: "annual-april-relation-binding-v1", originalId: "afpr:month-slot:04", index: 3,
  recordSha256: "47cbf493b7d9db5598a9204b131c34f6cb74755a10cafa75c7c016bb5b54cdf4",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "actual affectedPillars + participant identity + root ancestry"] } as const);
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type AprilContext = Readonly<{ version: "annual-april-relation-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; row: AnnualCandidate; originalReceipt: KnowledgeBindingReceipt; segments: AnnualSegment[]; typedRoots: string[]; index: ActualBindingIndex };
const sessions = new WeakMap<AprilContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_APRIL_RELATION_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, reasons: [e instanceof Error ? e.message : "APRIL_RELATION_UNVERIFIED"], customerUseAllowed: false as const });
async function source(s: Pick<Session, "row" | "services">) {
  const row = s.row, pin = APRIL_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await s.services.resolver.record(row.candidate.record), proof = await s.services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 4 || row.original.scope !== "civil_month" || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false
    || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_APRIL_SOURCE_REQUIRED");
  return proof;
}
export async function prepareAprilContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualTemporalComparisons(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const row = new AnnualSpecialistIndex(services.foundation).byOriginalId.get(APRIL_CONTRACT.originalId);
    if (!row) throw Error("ORIGINAL_APRIL_SOURCE_REQUIRED"); await source({ row, services });
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog);
    if (index.errors.length) throw Error(index.errors.join("|"));
    const context = freeze({ version: "annual-april-relation-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: snapshot, index, services, row: freeze(structuredClone(row)), originalReceipt: freeze(structuredClone(native.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!)), segments: structuredClone(native.observation.segments), typedRoots: [...bridge.handoff.canonicalFactRoots] });
    return { ok: true as const, context, baseline };
  } catch (e) { return fail(e); }
}
function occurrence(s: Session, segment: AnnualSegment, f: AnnualSegment["raw"]["relationFacts"][number], ordinal: number, e: OriginalAnnual) {
  const check = validateAnnualRelation(segment, f, e), node = segment.nodes.find(n => n.fact.producerEvidenceId === f.id && same(n.value, f));
  if (!node || check.nodeIds.length !== 1 || !same(s.index.graph.nodes.get(node.id), node)) throw Error("ORIGINAL_RELATION_NODE_IDENTITY_REQUIRED");
  const owner = segment.owner, counterpartIds: string[] = [], expected: EvidenceParticipant[] = [];
  const reasons = [...check.reasons, ...validateAnnualNodeIdentity(node, segment)];
  const parent = (pointer: string) => {
    const n = [...s.index.graph.nodes.values()].find(n => n.owner.fixtureOwnerId === owner && n.fact.observationPointer === pointer);
    if (!n) reasons.push("REQUIRED_ORIGINAL_PARENT_MISSING:" + pointer); else counterpartIds.push(n.id);
    return n;
  };
  if (f.source === "month_natal_element") {
    expected.push(...f.monthElements.map(value => ({ owner, position: "month", slot: "element", value })), { owner, position: "natal-distribution", slot: "element", value: f.element });
    const n = parent("/calculations/person/elements");
    if (!n || !same(n.value, { elements: e.calculation.elements, yinYang: e.calculation.yinYang, completeHour: !!e.calculation.pillars.hour }) || f.monthElements.some(v => !segment.raw.elements.includes(v))) reasons.push("ORIGINAL_ELEMENT_DISTRIBUTION_REQUIRED");
  } else {
    expected.push({ owner, position: "month", slot: "transit_branch", value: segment.raw.monthPillar.branch });
    if (f.source === "month_natal_branch") for (const position of f.affectedPillars) {
      const branch = e.calculation.pillars[position]?.branch, n = parent(`/calculations/person/pillars/${position}/branch`);
      if (!branch || !n || !same(n.participants, [{ owner, position, slot: "branch", value: branch }])) reasons.push("ORIGINAL_NATAL_POSITION_PARENT_REQUIRED");
      if (branch) expected.push({ owner, position, slot: "natal_branch", value: branch });
    } else if (f.counterpart.scope === "annual") {
      expected.push({ owner, position: "annual", slot: "branch", value: segment.raw.effectiveAnnualPillar.branch }); counterpartIds.push(segment.contract.componentNodeIds.annual!);
    } else {
      const counterpart = f.counterpart, ci = e.raw.customerDayun!.cycles.findIndex(c => c.index === counterpart.cycleIndex && c.ganji === counterpart.pillar);
      const n = parent(`/composition/result/evidence/raw/customerDayun/cycles/${ci}`);
      if (ci < 0 || !n || n.producer.symbol !== "calculateCustomerDayun" || n.producer.version !== e.raw.customerDayun!.calculationVersion) reasons.push("ORIGINAL_DAYUN_CYCLE_SOURCE_REQUIRED");
      expected.push({ owner, position: `dayun-cycle:${f.counterpart.cycleIndex}`, slot: "branch", value: f.counterpart.pillar.slice(-1) });
    }
    if (f.type === "삼합" && (new Set(f.participants).size !== 3 || !same(sorted(f.participants), sorted(expected.map(p => p.value))))) reasons.push("THREE_ORIGINAL_SIMULTANEOUS_BRANCH_VALUES_REQUIRED");
  }
  const requiredParentIds = sorted([segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, ...counterpartIds]);
  const parents = requiredParentIds.flatMap(id => s.index.graph.nodes.get(id) ?? []);
  if (!same(node.participants, expected) || node.fact.observationPointer !== `${segment.originalPointer}/relationFacts/${ordinal}`) reasons.push("EXACT_ORIGINAL_PARTICIPANTS_AND_POSITION_REQUIRED");
  if (!same(sorted(node.ancestry.parentIds), requiredParentIds) || parents.length !== requiredParentIds.length) reasons.push("EXACT_REQUIRED_PARENT_NODES_REQUIRED");
  if (!node.fact.rootId || !node.ancestry.rootIds.includes(node.fact.rootId) || node.ancestry.rootIds.some(r => ![...s.index.graph.nodes.values()].some(n => n.fact.rootId === r))) reasons.push("ORIGINAL_GRAPH_ROOT_ANCESTRY_REQUIRED");
  if (!node.ancestry.complete || node.ancestry.missingIds.length || node.ancestry.cycle || node.status !== "VERIFIED" || node.sources.some(v => v.state !== "VERIFIED")
    // Original Binder accepts ID-less producer observations by exact pointer and ancestry.
    // Preserve their PARTIAL status; never promote an unknown or blocked parent.
    || parents.some(p => p.status === "WITHHELD" || !p.ancestry.complete || p.ancestry.missingIds.length || p.ancestry.cycle || p.sources.some(v => v.state !== "VERIFIED")
      || p.blockers.some(b => b.code !== "UNADDRESSABLE_PRODUCER_OBSERVATION") || p.fact.addressability === "PRODUCER_OBSERVATION_ONLY" && (!p.fact.observationPointer || !p.producer.version))) reasons.push("ORIGINAL_RELATION_OR_ANCESTOR_WITHHELD");
  if (node.certainty !== "confirmed" || f.certainty !== "confirmed") reasons.push("CONDITIONAL_RELATION_NOT_CONFIRMED");
  const body = { version: "actual-annual-relation-occurrence-v1" as const, fixtureId: s.request.graph.context.fixtureId, originalRelationEvidenceId: f.id, originalGraphNodeId: node.id, originalProducer: node.producer, producerVersion: node.producer.version,
    relationType: f.type, relationSource: f.source, originalAffectedPillars: f.source === "month_natal_branch" ? f.affectedPillars : null, originalRelationFact: f, actualParticipants: node.participants,
    participantPositions: node.participants.map(p => ({ owner: p.owner, position: p.position, slot: p.slot })), participantValues: node.participants.map(p => p.value), owner: node.owner, direction: node.direction,
    originalMonthSegment: { pointer: segment.originalPointer, recordHash: segment.recordHash, selectedYear: segment.contract.selectedYear, month: segment.contract.month, monthPillar: segment.raw.monthPillar, effectiveAnnualPillar: segment.raw.effectiveAnnualPillar, activeDayunContext: segment.raw.activeDayunContext },
    temporalScope: node.temporal!.scope, relationScope: check.scope, effectiveInterval: node.temporal!, calculationCertainty: node.certainty, originalFactIdentity: node.fact, originalFactRoot: node.fact.rootId!,
    completeAncestry: node.ancestry, requiredParentNodes: parents, sourceReferences: node.sources, originalBlockingReasons: node.blockers, withholdReasons: sorted(reasons), verificationState: reasons.length ? "WITHHELD" as const : "VERIFIED" as const,
    prohibitedInferences: { original: s.row.original.disallowed, unsupported: ["합화", "격국 변화", "강약 변화", "용신 변경", "사건 발생", "운의 영향 크기"] }, meaningIdentity: null, claimIdentity: null, customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING" as const,
    independentInformationAdded: 0 as const, newFactRoots: 0 as const, customerUseAllowed: false as const };
  return freeze(structuredClone({ ...body, witnessId: `actual-annual-relation-witness:v1:${v4Digest(body)}` }));
}
export type RelationWitness = ReturnType<typeof occurrence>;
function bindSegment(s: Session, segment: AnnualSegment, witnesses: RelationWitness[]) {
  const candidate = structuredClone(s.row.candidate), ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!, ...witnesses.map(w => w.originalGraphNodeId)];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  const selectors: EvidenceSelector[] = ["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"].map(role => annualRoleSelector(role as "BOUNDARY" | "MONTH_PILLAR" | "EFFECTIVE_ANNUAL", undefined, segment.contract)!);
  for (const w of witnesses) selectors.push({ kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", temporalScope: "month", evidenceId: w.originalRelationEvidenceId, observationPointer: index.graph.nodes.get(w.originalGraphNodeId)!.fact.observationPointer,
    producer: w.originalProducer, fields: [{ path: "value.type", equals: w.relationType }], participants: w.actualParticipants.map(p => ({ ...p, owner: "person" as const })), memberValues: w.participantValues });
  selectors.forEach((selector, i) => candidate.requirement.sourceRequirements.push({ id: `${s.row.catalogKey}#${APRIL_CONTRACT.version}/${segment.contract.segmentIndex}/${i}`, originalField: i < 3 ? "/requires/0" : "/requires/2", originalDeclaration: s.row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] }));
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.originalReceipt, technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || !same(sorted(receipt.selectedActualEvidence), sorted(ids)) || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || receipt.customerApproved || receipt.operatorApproved
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation) || receipt.canonicalFactRoots.some(r => ![...index.graph.nodes.values()].some(n => n.fact.rootId === r))) throw Error("EXACT_ALL_RELATION_NATIVE_BINDING_REQUIRED");
  return { version: APRIL_CONTRACT.version, segmentPointer: segment.originalPointer, effectiveInterval: segment.contract.window, witnessIds: witnesses.map(w => w.witnessId), typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}
async function evaluate(s: Session) {
  const proof = await source(s), c = s.request.graphInput.evidence.composition; if (c.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
  const e = c.result.evidence, raw = e.raw.calendarMonths![3], all = s.segments.filter(v => v.contract.month === 4);
  if (!all.length || all.length !== raw.segments.length || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive
    || all.some((v, i) => !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash || v.contract.selectedYear !== e.selectedYear || v.owner !== s.request.graph.context.owners.person || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst)) throw Error("EVERY_ORIGINAL_APRIL_SEGMENT_REQUIRED");
  const segmentResults = all.map(segment => {
    const witnesses = segment.raw.relationFacts.map((f, i) => occurrence(s, segment, f, i, e)), reasons = sorted([...witnesses.flatMap(w => w.withholdReasons), ...(!witnesses.length ? ["NO_ORIGINAL_RELATION_OCCURRENCE"] : [])]);
    return { segmentPointer: segment.originalPointer, originalRecordHash: segment.recordHash, originalSegment: segment.raw, originalBoundaryNode: s.index.graph.nodes.get(segment.contract.boundaryNodeId!)!, sourcePreconditions: { originalRequires: s.row.original.requires, proof, currentSegmentOnly: true }, witnesses,
      state: reasons.length ? "WITHHELD" as const : "VERIFIED" as const, reasons, binding: reasons.length ? null : bindSegment(s, segment, witnesses) };
  });
  const typedBindings = segmentResults.flatMap(s => s.binding ? [s.binding] : []), relationWitnesses = segmentResults.flatMap(s => s.witnesses), monthReady = segmentResults.every(s => s.state === "VERIFIED");
  const roots = sorted(typedBindings.flatMap(b => b.typedNativeReceipt.canonicalFactRoots));
  const body = { version: APRIL_CONTRACT.version, fixtureId: s.request.graph.context.fixtureId, month: 4 as const, originalResearchId: s.row.originalResearchId, originalCatalogKey: s.row.catalogKey, originalSourceProof: proof, originalResearchRecord: s.row.original,
    originalCandidate: s.row.candidate, originalNativeReceipt: s.originalReceipt, originalNativeReceiptHash: actualSemanticDigest(s.originalReceipt), originalMeaningIdentity: null, originalClaimIdentity: null,
    sourcePreconditions: { selectedYear: e.selectedYear, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive }, everyCanonicalSegment: all.map(s => s.originalPointer), everyOriginalRelation: relationWitnesses.map(w => w.originalRelationEvidenceId), originalRequiredConditions: s.row.original.requires, allSegmentsRequired: true as const },
    segmentResults, relationWitnesses, typedBindings, allTwelveGateResults: typedBindings.map(b => ({ segmentPointer: b.segmentPointer, receiptId: b.typedNativeReceipt.receiptId, gates: b.typedNativeReceipt.allTwelveGateResults })),
    originalFactRoots: roots, originalRelationOccurrenceRoots: sorted(relationWitnesses.map(w => w.originalFactRoot)), additionalExistingGraphReferenceRoots: roots.filter(r => !s.typedRoots.includes(r)),
    blockingReasons: typedBindings.flatMap(b => b.typedNativeReceipt.blockingReasons), verifiedActualUnitIds: [] as string[], meaningReviewState: "REVIEW_REQUIRED" as const, productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const,
    customerUseAllowed: false as const, plannerUseAllowed: false as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  return { monthReady, observation: freeze(structuredClone({ source: proof, segmentResults, relationWitnesses, typedBindings })), candidate: monthReady ? freeze(structuredClone({ ...body, technicalState: "TECHNICAL_APRIL_RELATION_VERIFIED" as const, candidateId: `annual-april-relation-candidate:v1:${v4Digest(body)}` })) : null };
}
export type AprilCandidate = NonNullable<Awaited<ReturnType<typeof evaluate>>["candidate"]>;
export async function evaluateApril(context: AprilContext) {
  offline(); try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_APRIL_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s) }; } catch (e) { return fail(e); }
}
export async function validateRelationWitness(context: AprilContext, witness: RelationWitness, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateApril(context), expected = result.ok ? result.observation.relationWitnesses.find(w => w.originalGraphNodeId === witness.originalGraphNodeId) : null;
  return { ok: !!expected && same(expected, witness), verificationState: expected?.verificationState ?? "UNVERIFIED", eligibleForTechnicalBinding: !!expected && same(expected, witness) && expected.verificationState === "VERIFIED", reasons: expected && same(expected, witness) ? [] : ["ORIGINAL_RELATION_WITNESS_CHANGED"], customerUseAllowed: false as const };
}
export async function validateAprilCandidate(context: AprilContext, candidate: AprilCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateApril(context);
  return { ok: result.ok && result.candidate !== null && same(result.candidate, candidate), reasons: result.ok && result.candidate !== null && same(result.candidate, candidate) ? [] : ["ORIGINAL_APRIL_CANDIDATE_CHANGED_OR_WITHHELD"], customerUseAllowed: false as const };
}
