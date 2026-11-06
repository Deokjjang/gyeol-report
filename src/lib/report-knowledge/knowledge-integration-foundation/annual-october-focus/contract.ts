import { readFileSync } from "node:fs";
import { join } from "node:path";
import { annualNarrativeEvidence, annualPeriodTime } from "../../../interpretation-v4/annualEvidence";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { hash } from "../sourceReader";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualMonthMatrix } from "../annual-month-matrix/adapter";
import { NATIVE_MONTH_PAIR_CONTRACT } from "../native-requirement-binding/contract";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import type { AnnualCandidate, AnnualSegment } from "../annual-fortune-specialist-engine/types";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt } from "../knowledge-binder/types";
import type { ActualEvidenceNode } from "../actual-evidence-graph/types";
import { temporalPosition } from "../actual-evidence-graph/temporal";
import { BINDING_HARD_GATES } from "../types";

export const OCTOBER_FOCUS_CONTRACT = freeze({
  version: "annual-october-reading-focus-v1", originalId: "afpr:month-slot:10", index: 9,
  recordSha256: "6bafa2af71967a35934e08b7705fed9b7f4ddcfb881788f4b85a084488fd3c94",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "actual reading instant + focus interval + all unselected segments"],
  focusProducer: { file: "src/lib/interpretation-v4/annualEvidence.ts", symbol: "annualNarrativeEvidence", fileSha256: "11a74bd10e28546653725c59af931f7a18c1e67a218d1b0824b97f292c9513f1" },
} as const);
export type OctoberSegmentState = "ACTUAL_ACTIVE_AT_READING" | "REPRESENTATIVE_FOCUS_NOT_ACTIVE" | "PAST_SEGMENT" | "FUTURE_SEGMENT" | "WITHHELD_UNVERIFIED_TIME";
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type OctoberContext = Readonly<{ version: "annual-october-focus-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; originalReceipt: KnowledgeBindingReceipt; originalRoots: string[]; row: AnnualCandidate; segments: AnnualSegment[] };
const sessions = new WeakMap<OctoberContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("OCTOBER_FOCUS_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, reasons: [e instanceof Error ? e.message : "OCTOBER_FOCUS_UNVERIFIED"], customerUseAllowed: false as const });
const instant = (s: unknown): s is string => typeof s === "string" && /T.*(?:Z|[+-]\d\d:\d\d)$/.test(s) && Number.isFinite(Date.parse(s));
function annual(request: KnowledgeBindingRequest) {
  const packet = request.graphInput.evidence, c = packet.composition;
  if (c.product !== "annual_fortune" || packet.input.kind !== "annualFortune") throw Error("ORIGINAL_ANNUAL_PACKET_REQUIRED");
  const e = c.result.evidence;
  if (!instant(e.clock?.currentDate) || e.clock.currentDate !== packet.generatedAt || !instant(request.graph.context.evaluatedAt)) throw Error("ORIGINAL_ANNUAL_CLOCK_CURRENT_DATE_REQUIRED");
  if (e.selectedYear !== Number(packet.input.productOptions.selectedYear) || e.raw.selectedYear !== e.selectedYear) throw Error("EXACT_SELECTED_YEAR_REQUIRED");
  return { packet, evidence: e };
}
async function source(row: AnnualCandidate, services: Services) {
  const pin = OCTOBER_FOCUS_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const original = await services.resolver.record(row.candidate.record), proof = await services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(original, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 10 || row.original.scope !== "civil_month"
    || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false || row.candidate.requirement.requiredTemporalScope !== "month") throw Error("EXACT_ORIGINAL_OCTOBER_SOURCE_REQUIRED");
  return proof;
}
/** Re-run the original Producer. No second focus selection implementation. */
export async function prepareOctoberContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualMonthMatrix(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const { packet, evidence: e } = annual(request), pin = OCTOBER_FOCUS_CONTRACT.focusProducer;
    if (hash(readFileSync(join(process.cwd(), pin.file))) !== pin.fileSha256) throw Error("ORIGINAL_FOCUS_PRODUCER_REQUIRED");
    const produced = await annualNarrativeEvidence(packet.input, structuredClone(e.clock));
    if (!produced.ok || !same(produced.raw.calendarMonths, e.raw.calendarMonths) || !same(produced.months[9].focus, e.months[9].focus)
      || produced.selectedYear !== e.selectedYear || !same(packet.composition.product === "annual_fortune" && packet.composition.result.months[9].focus, produced.months[9].focus)) throw Error("ORIGINAL_PRODUCER_FOCUS_OR_LEDGER_MISMATCH");
    const original = new AnnualSpecialistIndex(services.foundation).byOriginalId.get(OCTOBER_FOCUS_CONTRACT.originalId);
    if (!original || baseline.baseline.baseline.native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_OCTOBER_RECORD_AND_LEDGER_REQUIRED");
    const row = structuredClone(original); await source(row, services);
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const context = freeze({ version: "annual-october-focus-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: structuredClone(request), services, originalReceipt: freeze(structuredClone(baseline.baseline.baseline.native.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!)), originalRoots: [...bridge.handoff.canonicalFactRoots], row: freeze(row), segments: structuredClone(baseline.baseline.baseline.native.observation.segments.filter(v => v.contract.month === 10)) });
    return { ok: true as const, context, baseline };
  } catch (e) { return fail(e); }
}
function graphFact(n: ActualEvidenceNode) {
  return { nodeId: n.id, kind: n.kind, producer: n.producer, owner: n.owner, pointer: n.fact.observationPointer, originalFact: n.fact, value: n.value, window: n.temporal, certainty: n.certainty, roots: n.ancestry.rootIds, ancestry: n.ancestry, status: n.status };
}
async function buildCandidate(s: Session, context: OctoberContext, catalogKey: string) {
  const { request, row, segments: all } = s, { evidence: e } = annual(request), proof = await source(row, s.services);
  if (row.catalogKey !== catalogKey) throw Error("EXACT_OCTOBER_CATALOG_REQUIRED");
  const raw = e.raw.calendarMonths![9], focus = all.filter(v => same(v.raw, e.months[9].focus));
  if (raw.month !== 10 || all.length !== raw.segments.length || focus.length !== 1 || all.filter(v => v.contract.focus).length !== 1 || !focus[0].contract.focus
    || raw.startKst !== `${e.selectedYear}-10-01T00:00:00+09:00` || raw.endKstExclusive !== `${e.selectedYear}-11-01T00:00:00+09:00`
    || all[0]?.raw.startKst !== raw.startKst || all.at(-1)?.raw.endKstExclusive !== raw.endKstExclusive) throw Error("EXACT_FULL_OCTOBER_AND_SINGLE_PRODUCER_FOCUS_REQUIRED");
  const index = new ActualBindingIndex(request, s.services.foundation.catalog), readingInstant = e.clock.currentDate, graphEvaluationInstant = request.graph.context.evaluatedAt;
  const witnesses = all.map((v, i) => {
    const b = index.graph.nodes.get(v.contract.boundaryNodeId!);
    const focused = v === focus[0], position = annualPeriodTime(v.raw.startKst, v.raw.endKstExclusive, readingInstant), graphPosition = temporalPosition(v.contract.window, graphEvaluationInstant);
    if (v.contract.segmentIndex !== i || v.originalPointer !== `/composition/result/evidence/raw/calendarMonths/9/segments/${i}` || !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash
      || !instant(v.raw.startKst) || !instant(v.raw.endKstExclusive) || Date.parse(v.raw.startKst) >= Date.parse(v.raw.endKstExclusive) || v.contract.window.certainty !== "confirmed" || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst
      || !b || b.kind !== "TEMPORAL_BOUNDARY" || b.owner.fixtureOwnerId !== v.owner || b.fact.observationPointer !== v.originalPointer
      || b.producer.symbol !== "buildAnnualMonthCalendar" || b.producer.version !== v.sourceVersion || !same(b.temporal, v.contract.window)
      || !same(b.value, { month: 10, boundaryReason: v.raw.boundaryReason, uncertainty: v.raw.uncertainty, activeDayunContext: v.raw.activeDayunContext, timePosition: graphPosition, focus: focused })) throw Error("ORIGINAL_OCTOBER_SEGMENT_GRAPH_TIME_OR_FOCUS_MISMATCH");
    const state: OctoberSegmentState = position === "current" ? "ACTUAL_ACTIVE_AT_READING" : focused ? "REPRESENTATIVE_FOCUS_NOT_ACTIVE" : position === "past" ? "PAST_SEGMENT" : "FUTURE_SEGMENT";
    const ids = [b.id, ...v.nodes.map(n => n.id)];
    return { use: focused ? "ORIGINAL_PRODUCER_FOCUS" as const : "UNSELECTED_SEGMENT_WITNESS" as const, pointer: v.originalPointer, recordHash: v.recordHash, owner: v.owner,
      monthPillar: v.raw.monthPillar, effectiveAnnualPillar: v.raw.effectiveAnnualPillar, activeDayunContext: v.raw.activeDayunContext, boundaryReasons: v.raw.boundaryReason,
      boundaryNodeId: b.id, componentNodeIds: v.contract.componentNodeIds, sourceVersion: v.sourceVersion, interval: v.contract.window, certainty: v.contract.window.certainty,
      focusSelected: focused, readingTimePosition: position, graphTimePosition: graphPosition, state,
      graphFacts: ids.map(id => graphFact(index.graph.nodes.get(id)!)) };
  });
  const segment = focus[0].contract, fw = witnesses.find(v => v.focusSelected)!;
  const reason = fw.readingTimePosition === "current" ? "ACTIVE_SEGMENT_AT_READING" as const : focus[0].raw.boundaryReason.some(b => b.startsWith("jie:")) ? "REPRESENTATIVE_JIE_SEGMENT" as const : "REPRESENTATIVE_FIRST_SEGMENT" as const;
  // Unselected intervals are witnesses only. Bind precisely the focus interval.
  const selectedIndex = new ActualBindingIndex({ ...request, requiredWindow: segment.window, restrictEvidenceTo: [segment.componentNodeIds.month!, segment.boundaryNodeId!] }, s.services.foundation.catalog);
  const typed = structuredClone(row.candidate);
  for (const role of ["MONTH_PILLAR", "BOUNDARY"] as const) {
    const selector = annualRoleSelector(role, undefined, segment)!;
    selector.producer = selectedIndex.graph.nodes.get(role === "BOUNDARY" ? segment.boundaryNodeId! : segment.componentNodeIds.month!)!.producer;
    typed.requirement.sourceRequirements.push({ id: `${catalogKey}#${OCTOBER_FOCUS_CONTRACT.version}/${segment.segmentIndex}/${role}`, originalField: "/requires/2", originalDeclaration: row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] });
  }
  typed.requirement.requiredOwner = [...new Set([...typed.requirement.requiredOwner, "person" as const])];
  const original = s.originalReceipt;
  const receipt = bindKnowledgeCandidate(typed, selectedIndex, s.services.foundation.catalog), technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || selectedIndex.errors.length || !original || receipt.customerApproved || receipt.operatorApproved || receipt.selectedActualEvidence.length !== 2
    || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation)
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || receipt.canonicalFactRoots.some(r => !s.originalRoots.includes(r))) throw Error("EXACT_FOCUS_NATIVE_SELECTION_AND_ORIGINAL_GATES_REQUIRED");
  const body = { version: OCTOBER_FOCUS_CONTRACT.version, fixtureId: context.fixtureId, technicalState: "TECHNICAL_REQUIREMENT_RESOLVED" as const, evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE" as const,
    originalResearchId: row.originalResearchId, originalCatalogKey: catalogKey, originalSourceProof: proof, originalResearchRecord: row.original, originalCandidate: row.candidate,
    originalNativeReceipt: original, originalNativeReceiptHash: actualSemanticDigest(original), typedCandidate: typed, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt),
    originalMeaningIdentity: row.candidate.requirement.meaningIdentity, originalClaimIdentity: row.candidate.requirement.claimIdentity,
    clock: { readingInstant, readingInstantSource: "/composition/result/evidence/clock/currentDate" as const, graphEvaluationInstant, graphEvaluationSource: "/context/evaluatedAt" as const,
      selectedYear: e.selectedYear, selectedYearSource: "/composition/result/evidence/selectedYear" as const, policyDate: e.clock.policyDate ?? null, policyDateUse: "OFFLINE_COMMERCE_ONLY_NOT_READING_INSTANT" as const, instantsEqual: readingInstant === graphEvaluationInstant },
    civilOctoberBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive },
    editorialFocus: { independentCalculatedFact: false as const, producer: OCTOBER_FOCUS_CONTRACT.focusProducer, originalFocusPointer: "/composition/result/evidence/months/9/focus", segmentPointer: segment.pointer, interval: segment.window,
      selectionReason: reason, activeAtReading: fw.readingTimePosition === "current", state: fw.state, originalProducerRerunVerified: true as const },
    sourcePreconditions: { use: "SOURCE_PRECONDITION_ONLY_NOT_NATIVE_SELECTION" as const, originalRequiredConditions: row.original.requires, allSegmentPointers: witnesses.map(v => v.pointer), allSegments: witnesses,
      unselectedSegmentWitnesses: witnesses.filter(v => !v.focusSelected) },
    selectedGraphFacts: receipt.selectedActualEvidence.map(id => graphFact(selectedIndex.graph.nodes.get(id)!)), originalFactRoots: receipt.canonicalFactRoots,
    verifiedActualUnitIds: [] as string[], allTwelveGateResults: receipt.allTwelveGateResults, blockingReasons: receipt.blockingReasons,
    approvalState: { sourceIntegrity: receipt.allTwelveGateResults.find(g => g.gate === "SOURCE_INTEGRITY")!.state, meaning: receipt.allTwelveGateResults.find(g => g.gate === "INTERPRETATION_REVIEW")!.state, product: receipt.allTwelveGateResults.find(g => g.gate === "PRODUCT_SPECIALISM")!.state, customer: receipt.allTwelveGateResults.find(g => g.gate === "CUSTOMER_APPROVAL")!.state, authorization: "CUSTOMER_APPROVAL_PENDING" as const },
    customerUseAllowed: false as const, plannerUseAllowed: false as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const };
  return { ...body, candidateId: `annual-october-focus:v1:${v4Digest(body)}` };
}
export type OctoberCandidate = Awaited<ReturnType<typeof buildCandidate>>;
export async function createOctoberCandidate(context: OctoberContext, catalogKey: string) {
  offline();
  try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_OCTOBER_CONTEXT_REQUIRED"); return { ok: true as const, candidate: freeze(structuredClone(await buildCandidate(s, context, catalogKey))) }; }
  catch (e) { return fail(e); }
}
export async function validateOctoberCandidate(context: OctoberContext, candidate: OctoberCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const expected = await createOctoberCandidate(context, candidate.originalCatalogKey);
  return { ok: expected.ok && same(expected.candidate, candidate), reasons: expected.ok ? same(expected.candidate, candidate) ? [] : ["ORIGINAL_OCTOBER_CANDIDATE_CHANGED"] : expected.reasons, customerUseAllowed: false as const };
}
