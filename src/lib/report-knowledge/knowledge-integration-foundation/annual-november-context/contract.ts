import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { annualNarrativeEvidence, annualPeriodTime } from "../../../interpretation-v4/annualEvidence";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualJuneSameGod } from "../annual-june-same-god/adapter";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import type { AnnualCandidate, AnnualSegment, OriginalAnnual } from "../annual-fortune-specialist-engine/types";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import { NATIVE_MONTH_PAIR_CONTRACT } from "../native-requirement-binding/contract";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, EvidenceSelector } from "../knowledge-binder/types";
import { BINDING_HARD_GATES } from "../types";
import { hash } from "../sourceReader";

import { temporalPosition } from "../actual-evidence-graph/temporal";
import { validateJieCalendar, validateDayunContext } from "../annual-fortune-specialist-engine/boundaryValidator";
export const NOVEMBER_CONTRACT = freeze({ version: "annual-november-context-provenance-v1", originalId: "afpr:month-slot:11", index: 10,
  recordSha256: "2a1f4275e2edc58e6c62a68d2bcdb4a2b55aaa9b51f1ea38b43c9be6d5a0affa",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "period time + context timestamp + actual/conditional scene status"] } as const);
const CONTEXT_FIELDS = ["relationshipStatus", "jobStatus", "detailJob", "focusAreas"] as const;
export const NOVEMBER_SCENE = freeze({ text: "가상으로 그때 과제가 생긴 경우의 투입 한도를 정한다.", hypothetical: true, isCustomerHistory: false } as const);
export const NOVEMBER_SOURCE_FILES = freeze({
  "src/lib/report-generation/reportInputTypes.ts": "0052f84a359e3390ebad37107d777f04faa0809b05a20b2276c4ad99b466a20d",
  "src/lib/report-knowledge/userContextTypes.ts": "5fd8d7abb0c1ae02e9dc41dd149abd18620b2851c32482f7a9b75c93c785b6c9",
  "src/lib/report-generation/reportInputAdapter.ts": "1b05251cd0a7bf1b0fb6a386bf3e3b6a40a02ca49a4fb9299fd71a641496b497",
  "src/lib/interpretation-v4/annualEvidence.ts": "11a74bd10e28546653725c59af931f7a18c1e67a218d1b0824b97f292c9513f1",
  "src/lib/interpretation-v4/runtimeShadow.ts": "6c0fe9e34c523442d4964bcb2328eb4964f2eb9426c3ca0ae0d472f7b79adef2",
  "src/lib/interpretation-v4/runtimeProjection.ts": "793ef8b1dce3b693e01a6a243a7dfcca793af467b7ac232b1219523029a2feee",
  "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/engine.ts": "df22dcc02f8e07bbe522f06a6ffee7e83a022d06e78b8cdd36f6bc8d4f10171d",
  "src/lib/report-knowledge/knowledge-integration-foundation/full-product-integration/actualCalculationAdapter.ts": "c247b0144b3019915b848dfe6f36a7ac898605beb30d7e3a861d5684dd88a47f",
  "src/lib/report-knowledge/annualMonthJie.ts": "555676ca85aefd8812ebad1f4bc7ff863a9eb78e92a8ce977c79f792f0b12d5f",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/boundaryValidator.ts": "ecca715f9d7b8ed4f1e3eabf49aab58b8c972f36d1c4b6b30e46ebce69041440",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/annualIdentity.ts": "4ff12d10dffb5e0bcd6442849161d2ec9abee8a82dd27737501e47298ebba228",
  "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/periods.ts": "70413c47eb8f8819b3b7542cff932f3ac05e132dcd859b629265d1b60ae46753",
} as const);
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type NovemberContext = Readonly<{ version: "annual-november-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; row: AnnualCandidate; originalReceipt: KnowledgeBindingReceipt; segments: AnnualSegment[]; typedRoots: string[]; index: ActualBindingIndex; original: OriginalAnnual };
const sessions = new WeakMap<NovemberContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_NOVEMBER_CONTEXT_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, verificationState: "NOVEMBER_CONTRACT_WITHHELD" as const, reasons: [e instanceof Error ? e.message : "NOVEMBER_CONTEXT_UNVERIFIED"], customerUseAllowed: false as const });
async function source(s: Pick<Session, "row" | "services">) {
  const row = s.row, pin = NOVEMBER_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await s.services.resolver.record(row.candidate.record), proof = await s.services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(row.original.scene, NOVEMBER_SCENE) || row.original.meaning !== "미래 월과 미입력 생활 상태의 구분" || row.original.counterexample !== "예정되지 않은 취업·만남·가족 사건을 넣지 않는다."
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 11 || row.original.scope !== "civil_month" || row.original.previousMonthDifference !== "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold" || row.original.jieName !== "입동" || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false
    || row.catalogKey !== "kc:v1:291a7f708cf2cf6b7002c06934cbad6b4301ab9b521850bd524ffe59077a573d" || Object.hasOwn(row.original, "requiredRole") || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_NOVEMBER_SOURCE_REQUIRED");
  const files = Object.entries(NOVEMBER_SOURCE_FILES).map(([file, expectedHash]) => {
    const actualHash = hash(s.services.resolver.reader.text(file));
    if (actualHash !== expectedHash || s.services.resolver.frozen.has(file) && s.services.resolver.frozen.get(file) !== expectedHash) throw Error("ORIGINAL_RELATION_SOURCE_FILE_CHANGED:" + file);
    return { file, actualHash, expectedHash, sourceVersion: expectedHash, verification: "REPOSITORY_CODE_ONLY_NOT_MEANING_APPROVAL" as const };
  });
  return { research: proof, files };
}
export async function prepareNovemberContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    if (request.product === "annual_fortune") {
      const input = request.graphInput.evidence.input;
      if (input.kind === "compatibility" || !same(Object.keys(input.userContext).sort(), [...CONTEXT_FIELDS].sort()) || !same(request.actualUserState, input.userContext)) throw Error("EXACT_ORIGINAL_CONTEXT_PAYLOAD_REQUIRED");
    }
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualJuneSameGod(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const researchIndex = new AnnualSpecialistIndex(services.foundation), row = researchIndex.byOriginalId.get(NOVEMBER_CONTRACT.originalId);
    if (!row) throw Error("ORIGINAL_NOVEMBER_SOURCE_REQUIRED"); await source({ row, services });
    const composition = request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
    const original = composition.result.evidence;
    // Reexecute the original producer, including the full Dayun basis and canonical calendar.
    const reproduced = await annualNarrativeEvidence(request.graphInput.evidence.input, original.clock);
    if (!reproduced.ok || !same(reproduced, original)) throw Error("ORIGINAL_ANNUAL_DAYUN_CALENDAR_NOT_REPRODUCIBLE");
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog);
    if (index.errors.length) throw Error(index.errors.join("|"));
    const context = freeze({ version: "annual-november-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
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

function ancestry(s: Session, seeds: ActualEvidenceNode[]) {
  const nodes = new Map<string, ActualEvidenceNode>();
  const visit = (n: ActualEvidenceNode) => { if (nodes.has(n.id)) return; if (!same(s.index.graph.nodes.get(n.id), n) || n.owner.fixtureOwnerId !== s.request.graph.context.owners.person || !n.ancestry.complete || n.ancestry.missingIds.length || n.ancestry.cycle || n.sources.some(p => p.state !== "VERIFIED")) throw Error("ORIGINAL_COMPLETE_ANCESTRY_REQUIRED"); nodes.set(n.id, n); for (const id of n.ancestry.parentIds) { const parent = s.index.graph.nodes.get(id); if (!parent) throw Error("MISSING_ORIGINAL_ANCESTOR"); visit(parent); } };
  seeds.forEach(visit); return [...nodes.values()];
}
/** Preserve the original closure, including withheld facts; this is not a verification promotion. */
function supportingSnapshot(s: Session, seeds: ActualEvidenceNode[]) {
  const nodes = new Map<string, ActualEvidenceNode>();
  const visit = (id: string) => {
    if (nodes.has(id)) return;
    const node = s.index.graph.nodes.get(id);
    if (!node || node.owner.fixtureOwnerId !== s.request.graph.context.owners.person || !node.ancestry.complete || node.ancestry.missingIds.length || node.ancestry.cycle) throw Error("ORIGINAL_SUPPORTING_ANCESTRY_REQUIRED");
    nodes.set(id, node); node.ancestry.parentIds.forEach(visit);
  };
  seeds.forEach(n => visit(n.id)); return [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id, "en"));
}
function contextPayload(s: Session) {
  const packet = s.request.graphInput.evidence, input = packet.input;
  if (input.kind === "compatibility" || !same(Object.keys(input.userContext).sort(), [...CONTEXT_FIELDS].sort()) || !same(s.request.actualUserState, input.userContext)) throw Error("EXACT_ORIGINAL_CONTEXT_PAYLOAD_REQUIRED");
  const nodes = [...s.index.graph.nodes.values()].filter(n => n.kind === "CONTEXT_INPUT" && n.fact.observationPointer === "/input/userContext");
  if (nodes.length !== 1) throw Error("ORIGINAL_CONTEXT_INPUT_NODE_REQUIRED");
  const node = originalNode(s, nodes[0].id), producer = { file: "src/lib/report-generation/reportInputAdapter.ts", symbol: "normalizeReportInputPayload", version: `source-sha256:${NOVEMBER_SOURCE_FILES["src/lib/report-generation/reportInputAdapter.ts"]}`, system: "normalized-input" };
  if (!same(node.producer, producer) || node.temporal !== null || node.certainty !== "confirmed" || !same(node.value, { jobStatus: input.userContext.jobStatus, relationshipStatus: input.userContext.relationshipStatus, detailJobProvided: !!input.userContext.detailJob, rawFreeTextRetainedOnlyInCallerInput: true })) throw Error("ORIGINAL_CONTEXT_PRODUCER_PAYLOAD_REQUIRED");
  // The pinned producer authenticates payload provenance only. Its contract contains no observation timestamp.
  return { fixtureId: s.request.graph.context.fixtureId, owner: node.owner, originalSourceId: node.id, originalSourceHash: actualSemanticDigest(node), sourceProducer: node.producer, sourceVersion: node.producer.version,
    sourcePointer: "/input/userContext", contextPayloadHash: actualSemanticDigest(input.userContext), packetContentDigest: packet.contentDigest,
    suppliedContextFields: [...CONTEXT_FIELDS], observedContextFields: [] as string[], observationTemporalScope: null,
    originalGraphNode: node, completeAncestry: ancestry(s, [node]), originalRootReferences: [...node.ancestry.rootIds],
    contextPayloadIdentityVerified: true as const, contextObservationTimestamp: null, contextTimestampSource: null,
    contextProvenanceState: "CONTEXT_TIMESTAMP_MISSING" as const, contextProvenanceVerified: false as const, authenticated: false as const,
    readingInstant: s.original.clock.currentDate, graphEvaluationInstant: s.request.graph.context.evaluatedAt, generatedAt: packet.generatedAt, policyDate: s.original.clock.policyDate ?? null,
    clockSourcePointers: { readingInstant: "/composition/result/evidence/clock/currentDate", graphEvaluationInstant: "/graph/context/evaluatedAt", generatedAt: "/generatedAt", policyDate: "/composition/result/evidence/clock/policyDate", contextObservedAt: null },
    timestampSubstitutionAllowed: false as const, futureStateGuaranteed: false as const, customerHistoryInferred: false as const,
    blockingReasons: ["ACTUAL_CONTEXT_TIMESTAMP_REQUIRED"], newFactRoots: 0 as const, customerUseAllowed: false as const };
}
/** Negative diagnostic only. A caller value cannot establish an absent source contract. */
export function diagnoseSubmittedContextTimestamp(context: NovemberContext, submission: unknown) {
  offline(); const s = sessions.get(context);
  if (!s) return fail(Error("AUTHENTIC_NOVEMBER_CONTEXT_REQUIRED"));
  const payload = contextPayload(s);
  return { contextProvenanceState: "CONTEXT_SOURCE_UNVERIFIED" as const, submittedValueHash: actualSemanticDigest(submission), contextObservationTimestamp: null, contextTimestampSource: null,
    contextPayloadHash: payload.contextPayloadHash, authenticated: false as const, futureStateGuaranteed: false as const,
    blockingReasons: ["ACTUAL_CONTEXT_TIMESTAMP_REQUIRED", "CALLER_TIMESTAMP_IS_NOT_AUTHENTICATED_CONTEXT_SOURCE"], customerUseAllowed: false as const };
}
function bindSegment(s: Session, segment: AnnualSegment) {
  const candidate = structuredClone(s.row.candidate), ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  const selectors: EvidenceSelector[] = ["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"].map(role => annualRoleSelector(role as "BOUNDARY" | "MONTH_PILLAR" | "EFFECTIVE_ANNUAL", undefined, segment.contract)!);
  selectors.forEach((selector, i) => candidate.requirement.sourceRequirements.push({ id: `${s.row.catalogKey}#${NOVEMBER_CONTRACT.version}/${segment.contract.segmentIndex}/${i}`, originalField: i < 3 ? "/requires/0" : "/requires/2", originalDeclaration: s.row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] }));
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.originalReceipt, technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || !same(sorted(receipt.selectedActualEvidence), sorted(ids)) || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || receipt.customerApproved || receipt.operatorApproved
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation) || receipt.canonicalFactRoots.some(r => ![...index.graph.nodes.values()].some(n => n.fact.rootId === r))) throw Error("EXACT_NOVEMBER_CORE_NATIVE_BINDING_REQUIRED");
  return { use: "CURRENT_FACT_SCOPE_ONLY" as const, version: NOVEMBER_CONTRACT.version, segmentPointer: segment.originalPointer, effectiveInterval: segment.contract.window, typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}

function segmentWitness(s: Session, segment: AnnualSegment, proof: Awaited<ReturnType<typeof source>>, payload: ReturnType<typeof contextPayload>) {
  const boundary = originalNode(s, segment.contract.boundaryNodeId), month = originalNode(s, segment.contract.componentNodeIds.month), annual = originalNode(s, segment.contract.componentNodeIds.annual);
  const originalProducer = { file: "src/lib/report-knowledge/annualMonthJie.ts", symbol: "buildAnnualMonthCalendar", version: segment.sourceVersion, system: "annual-month" };
  if (boundary.kind !== "TEMPORAL_BOUNDARY" || !same(boundary.producer, originalProducer) || boundary.fact.observationPointer !== segment.originalPointer || !same(boundary.temporal, segment.contract.window)
    || !same(boundary.value, { month: 11, boundaryReason: segment.raw.boundaryReason, uncertainty: segment.raw.uncertainty, activeDayunContext: segment.raw.activeDayunContext, timePosition: temporalPosition(segment.contract.window, s.request.graph.context.evaluatedAt), focus: s.original.months[10].focus.startKst === segment.raw.startKst })) throw Error("ORIGINAL_NOVEMBER_BOUNDARY_REQUIRED");
  for (const [node, component, value, ordinal] of [[month, "month", segment.raw.monthPillar, 0], [annual, "annual", segment.raw.effectiveAnnualPillar, 1]] as const) {
    if (validateAnnualNodeIdentity(node, segment).length || node.certainty !== "confirmed" || node.fact.producerEvidenceId !== segment.raw.evidenceIds[ordinal] || !same(node.value, component === "month" ? { component, monthPillar: value } : { component, effectiveAnnualPillar: value })) throw Error("ORIGINAL_NOVEMBER_PILLAR_REQUIRED");
  }
  const reading = annualPeriodTime(segment.raw.startKst, segment.raw.endKstExclusive, payload.readingInstant), completeAncestry = ancestry(s, [boundary, month, annual]);
  const body = { version: NOVEMBER_CONTRACT.version, originalResearchId: s.row.originalResearchId, originalSourceProof: proof, fixtureId: s.request.graph.context.fixtureId, owner: segment.owner, selectedYear: s.original.selectedYear,
    novemberSegmentPointer: segment.originalPointer, novemberSegmentWindow: segment.contract.window, originalSegment: segment.raw, originalSegmentHash: segment.recordHash,
    originalProducer, originalGraphEvidence: [boundary, month, annual], originalFactRoots: sorted(completeAncestry.flatMap(n => n.ancestry.rootIds)), completeAncestry,
    otherOriginalGraphEvidence: segment.nodes.filter(n => ![boundary.id, month.id, annual.id].includes(n.id)),
    otherEvidenceCompleteAncestry: supportingSnapshot(s, segment.nodes), otherEvidenceUse: "ORIGINAL_STATUS_PRESERVATION_ONLY" as const,
    periodFactsState: "PERIOD_FACTS_VERIFIED" as const, periodFactScope: ["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"] as const,
    activeDayunContext: segment.raw.activeDayunContext, certainty: segment.contract.window.certainty, otherEvidenceStatusesPreserved: true as const,
    readingInstant: payload.readingInstant, graphEvaluationInstant: payload.graphEvaluationInstant, generatedAt: payload.generatedAt, policyDate: payload.policyDate,
    contextObservationTimestamp: null, contextTimestampSource: null, contextPayloadIdentity: payload,
    contextProvenanceState: payload.contextProvenanceState, contextProvenanceVerified: false as const, periodTimePosition: reading.toUpperCase() as "PAST" | "CURRENT" | "FUTURE",
    graphTimePosition: temporalPosition(segment.contract.window, payload.graphEvaluationInstant), futureStateGuaranteed: false as const,
    sceneSource: { researchProof: proof.research, originalPointer: "/scene", sceneHash: actualSemanticDigest(NOVEMBER_SCENE), originalScene: s.row.original.scene },
    sceneHypothetical: true as const, sceneIsCustomerHistory: false as const, actualConditionalSceneState: "CONDITIONAL_SCENE_SOURCE_VERIFIED" as const, customerSceneState: "CUSTOMER_SCENE_NOT_VERIFIED" as const,
    requiredConditions: s.row.original.requires, blockingReasons: ["ACTUAL_CONTEXT_TIMESTAMP_REQUIRED"], meaningIdentity: null, claimIdentity: null,
    meaningReviewState: "REVIEW_REQUIRED" as const, customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING" as const, customerUseAllowed: false as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  return freeze(structuredClone({ ...body, witnessId: `annual-november-context-witness:v1:${v4Digest(body)}` }));
}
export type NovemberContextWitness = ReturnType<typeof segmentWitness>;
async function evaluate(s: Session) {
  const proof = await source(s), e = s.original, raw = e.raw.calendarMonths![10], all = s.segments.filter(v => v.contract.month === 11), payload = contextPayload(s);
  if (!all.length || all.length !== raw.segments.length || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive || raw.startKst !== `${e.selectedYear}-11-01T00:00:00+09:00` || raw.endKstExclusive !== `${e.selectedYear}-12-01T00:00:00+09:00`
    || all.some((v, i) => !same(v.raw, raw.segments[i]) || v.originalPointer !== `/composition/result/evidence/raw/calendarMonths/10/segments/${i}` || v.recordHash !== v.contract.contractHash || v.owner !== s.request.graph.context.owners.person || v.contract.selectedYear !== e.selectedYear || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst
      || !e.raw.customerDayun || validateDayunContext(e.raw.customerDayun, v.raw).length || v.nodes.some(n => !same(s.index.graph.nodes.get(n.id), n)))) throw Error("EVERY_ORIGINAL_NOVEMBER_SEGMENT_REQUIRED");
  const ipdong = validateJieCalendar(e.raw.calendarMonths!, e.selectedYear).filter(j => j.name === "입동");
  if (ipdong.length !== 1 || !ipdong[0].valid || !all.some(v => v.raw.startKst === ipdong[0].instantKst && v.raw.boundaryReason.includes("jie:입동"))) throw Error("ORIGINAL_IPDONG_BOUNDARY_REQUIRED");
  const witnesses = all.map(segment => segmentWitness(s, segment, proof, payload)), typedBindings = all.map(segment => bindSegment(s, segment));
  const body = { version: NOVEMBER_CONTRACT.version, fixtureId: s.request.graph.context.fixtureId, month: 11 as const, originalResearchId: s.row.originalResearchId, originalSourceProof: proof,
    originalResearchRecord: s.row.original, originalCandidate: s.row.candidate, originalNativeReceipt: s.originalReceipt, originalNativeReceiptHash: actualSemanticDigest(s.originalReceipt), originalMeaningIdentity: null, originalClaimIdentity: null,
    sourcePreconditions: { selectedYear: e.selectedYear, originalSegmentCount: raw.segments.length, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive }, everyCanonicalSegment: all.map(v => v.originalPointer), originalRequiredConditions: s.row.original.requires },
    ipdong, contextTimestampProvenance: payload, witnesses, typedBindings, periodFactsState: "PERIOD_FACTS_VERIFIED" as const, originalCandidateState: "WITHHELD_ACTUAL_CONTEXT_TIMESTAMP_REQUIRED" as const,
    explicitWithholdReasons: ["ACTUAL_CONTEXT_TIMESTAMP_REQUIRED"], originalFactRoots: [...s.typedRoots], verifiedActualUnitIds: [] as string[],
    meaningReviewState: "REVIEW_REQUIRED" as const, productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const,
    customerUseAllowed: false as const, plannerUseAllowed: false as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const, independentMeaningsAdded: 0 as const };
  return { monthReady: false as const, candidate: null, observation: freeze(structuredClone(body)) };
}
export type NovemberObservation = Awaited<ReturnType<typeof evaluate>>["observation"];
export async function evaluateNovember(context: NovemberContext) {
  offline(); try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_NOVEMBER_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s) }; } catch (e) { return fail(e); }
}
export async function validateNovemberWitness(context: NovemberContext, witness: NovemberContextWitness, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateNovember(context), expected = result.ok ? result.observation.witnesses.find(w => w.witnessId === witness.witnessId) : null, ok = !!expected && same(expected, witness);
  return { ok, reasons: ok ? [] : ["ORIGINAL_NOVEMBER_WITNESS_CHANGED"], customerUseAllowed: false as const };
}
export async function validateNovemberObservation(context: NovemberContext, observation: NovemberObservation, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateNovember(context), ok = result.ok && same(result.observation, observation);
  return { ok, reasons: ok ? [] : ["ORIGINAL_NOVEMBER_OBSERVATION_CHANGED"], novemberCandidateAuthorized: false as const, customerUseAllowed: false as const };
}
