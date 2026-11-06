import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { annualNarrativeEvidence } from "../../../interpretation-v4/annualEvidence";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualAugustRelations } from "../annual-august-dayun/adapter";
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

import { buildAnnualMonthCalendar, getAnnualJieBoundaries, ANNUAL_MONTH_CALCULATION_VERSION, type AnnualMonthCalendarInput, type AnnualMonthSegment } from "../../annualMonthJie";
import { annualMonthlyEvidenceMatches } from "../../../report-generation/annualMonthlyPublication";
import { compareAnnualSegments } from "../annual-fortune-specialist-engine/monthComparator";
import { intersectEvidencePeriods } from "../actual-evidence-graph/temporal";
import type { FiveElement, EarthlyBranch } from "../../annualFortuneTypes";
export const JANUARY_CONTRACT = freeze({ version: "annual-january-carryover-v1", originalId: "afpr:month-slot:01", index: 0,
  recordSha256: "46198ef6865a13a9214287c0567c59d015e18afcef3435162cdc640835ad4ef4",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "previous December segment if actually available"] } as const);
export const JANUARY_SOURCE_FILES = freeze({
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/monthComparator.ts": "fd6b6a9179be3853075c5f971bcf83e12e224a08ada3a17e092ebaccebffed83",
  "src/lib/report-generation/annualMonthlyPublication.ts": "8b9659ef27e5b51ac959c42f10e559f013b5b6c7c1447a51172c215b66249a72",
  "src/lib/report-knowledge/annualFortuneEvidence.ts": "133314070c86ad93a77aa641f9100ff1c25a0dc98176e1ddb0a61594f53a9a08",
  "src/lib/interpretation-v4/annualEvidence.ts": "11a74bd10e28546653725c59af931f7a18c1e67a218d1b0824b97f292c9513f1",
  "src/lib/saju/customerDayun.ts": "d4249f81df903de85ce7ea088696b2dc7522eca36a9ee8e6a841655d6d899123",
  "src/lib/saju/calendarVersion.ts": "4afd5b85df5f5cd5e2d5b6249077b40c3bca1057aae5662e12fbb1ebd73a07a5",
  "src/lib/report-knowledge/annualMonthJie.ts": "555676ca85aefd8812ebad1f4bc7ff863a9eb78e92a8ce977c79f792f0b12d5f",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/boundaryValidator.ts": "ecca715f9d7b8ed4f1e3eabf49aab58b8c972f36d1c4b6b30e46ebce69041440",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/relationMatcher.ts": "546cb3f97227273be1705ae330d516a4e516caf7fd065a72630bf29ad33f74b4",
  "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/periods.ts": "70413c47eb8f8819b3b7542cff932f3ac05e132dcd859b629265d1b60ae46753"
} as const);
export type JanuaryOptions = { adjacentYear?: "RECOMPUTE" | "WITHHOLD" };
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type JanuaryContext = Readonly<{ version: "annual-january-carryover-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; row: AnnualCandidate; originalReceipt: KnowledgeBindingReceipt; segments: AnnualSegment[]; typedRoots: string[]; index: ActualBindingIndex; original: OriginalAnnual; adjacentYear: "RECOMPUTE" | "WITHHOLD" };
const sessions = new WeakMap<JanuaryContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_JANUARY_RELATION_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, verificationState: "JANUARY_CONTRACT_WITHHELD" as const, reasons: [e instanceof Error ? e.message : "JANUARY_RELATION_UNVERIFIED"], customerUseAllowed: false as const });
async function source(s: Pick<Session, "row" | "services">) {
  const row = s.row, pin = JANUARY_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await s.services.resolver.record(row.candidate.record), proof = await s.services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 1 || row.original.scope !== "civil_month" || row.original.previousMonthDifference !== "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold" || row.original.jieName !== "소한" || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false
    || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_JANUARY_SOURCE_REQUIRED");
  const files = Object.entries(JANUARY_SOURCE_FILES).map(([file, expectedHash]) => {
    const actualHash = hash(s.services.resolver.reader.text(file));
    if (actualHash !== expectedHash || s.services.resolver.frozen.get(file) !== expectedHash) throw Error("ORIGINAL_RELATION_SOURCE_FILE_CHANGED:" + file);
    return { file, actualHash, expectedHash, sourceVersion: expectedHash, verification: "REPOSITORY_CODE_ONLY_NOT_MEANING_APPROVAL" as const };
  });
  return { research: proof, files };
}
export async function prepareJanuaryContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services, options: JanuaryOptions = {}) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualAugustRelations(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const row = new AnnualSpecialistIndex(services.foundation).byOriginalId.get(JANUARY_CONTRACT.originalId);
    if (!row) throw Error("ORIGINAL_JANUARY_SOURCE_REQUIRED"); await source({ row, services });
    const composition = request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
    const original = composition.result.evidence;
    // Reexecute the original producer, including the full Dayun basis and canonical calendar.
    const reproduced = await annualNarrativeEvidence(request.graphInput.evidence.input, original.clock);
    if (!reproduced.ok || !same(reproduced, original)) throw Error("ORIGINAL_ANNUAL_DAYUN_CALENDAR_NOT_REPRODUCIBLE");
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog);
    if (index.errors.length) throw Error(index.errors.join("|"));
    const context = freeze({ version: "annual-january-carryover-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: snapshot, index, services, row: freeze(structuredClone(row)), originalReceipt: freeze(structuredClone(native.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!)), segments: structuredClone(native.observation.segments), typedRoots: [...bridge.handoff.canonicalFactRoots], original: freeze(structuredClone(original)), adjacentYear: options.adjacentYear ?? "RECOMPUTE" });
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

// Reconstruct exactly the existing stored-calendar verifier's input. The full
// current calendar must reproduce before the same producer may observe a prior year.
function calendarInput(s: Session): AnnualMonthCalendarInput {
  const raw = s.original.raw, names: Record<FiveElement, string> = { wood: "목", fire: "화", earth: "토", metal: "금", water: "수" };
  if (!raw.customerDayun || !annualMonthlyEvidenceMatches(raw)) throw Error("ORIGINAL_CALENDAR_BASIS_UNVERIFIED");
  const input: AnnualMonthCalendarInput = { selectedYear: s.original.selectedYear, dayMaster: raw.baseSaju.dayMaster,
    natalBranches: [raw.baseSaju.pillars.year, raw.baseSaju.pillars.month, raw.baseSaju.pillars.day, raw.baseSaju.pillars.hour].filter((p): p is string => typeof p === "string").map(p => p[1] as EarthlyBranch),
    missingElements: (Object.keys(names) as FiveElement[]).filter(e => raw.baseSaju.natalLabels.includes(`${names[e]} 부족`)),
    heavyElements: (Object.keys(names) as FiveElement[]).filter(e => raw.baseSaju.natalLabels.includes(`${names[e]} 과다`)), customerDayun: raw.customerDayun };
  if (!same(buildAnnualMonthCalendar(input), raw.calendarMonths)) throw Error("EXACT_CURRENT_CALENDAR_REEXECUTION_REQUIRED");
  return input;
}
function priorDecember(s: Session, proof: Awaited<ReturnType<typeof source>>) {
  const year = s.original.selectedYear, graphNodes = s.request.graph.nodes.filter(n => n.producer.symbol === "buildAnnualMonthCalendar" && n.fact.producerEvidenceId?.startsWith(`month-v2:${year - 1}:12:`));
  if (graphNodes.length || s.original.raw.calendarMonths!.some(m => m.startKst.startsWith(`${year - 1}-12-`))) throw Error("UNEXPECTED_PREVIOUS_DECEMBER_IN_ORIGINAL_LEDGER");
  const absent = { originalLedgerState: "PRIOR_DECEMBER_NOT_IN_ORIGINAL_LEDGER" as const, originalGraphEvidence: [] as never[], originalFactRoots: [] as never[], originalNativeReceiptsAdded: 0 as const };
  try {
    if (s.adjacentYear === "WITHHOLD") throw Error("ADJACENT_YEAR_RECOMPUTATION_NOT_REQUESTED");
    const input = calendarInput(s), priorInput = { ...input, selectedYear: year - 1 }, output = buildAnnualMonthCalendar(priorInput), december = output[11];
    if (year <= 1 || output.length !== 12 || !december || december.month !== 12 || december.startKst !== `${year - 1}-12-01T00:00:00+09:00` || december.endKstExclusive !== `${year}-01-01T00:00:00+09:00`
      || output.some((m, i) => m.month !== i + 1 || !m.segments.length || m.segments[0].startKst !== m.startKst || m.segments.at(-1)!.endKstExclusive !== m.endKstExclusive || i > 0 && output[i - 1].endKstExclusive !== m.startKst
        || m.segments.some((v, j) => !(Date.parse(v.startKst) < Date.parse(v.endKstExclusive)) || j > 0 && m.segments[j - 1].endKstExclusive !== v.startKst || validateDayunContext(input.customerDayun, v).length))) throw Error("EXACT_PRIOR_YEAR_PRODUCER_PERIOD_REQUIRED");
    const body = { recordKind: "SOURCE_ONLY_ADJACENT_YEAR_WITNESS" as const, version: "annual-adjacent-year-source-v1" as const, fixtureId: s.request.graph.context.fixtureId, owner: s.request.graph.context.owners.person!,
      selectedYear: year, priorYear: year - 1, originalLedgerState: absent.originalLedgerState, originalPacketHash: v4Digest(s.original.raw), originalGraphHash: v4Digest(s.request.graph),
      producer: { file: "src/lib/report-knowledge/annualMonthJie.ts", symbol: "buildAnnualMonthCalendar", version: ANNUAL_MONTH_CALCULATION_VERSION }, sourceProof: proof.files,
      inputBasis: { dayMaster: input.dayMaster, natalBranches: input.natalBranches, missingElements: input.missingElements, heavyElements: input.heavyElements,
        customerDayunHash: v4Digest(input.customerDayun), calculationVersion: input.customerDayun.calculationVersion, calendarVersion: input.customerDayun.calendarVersion },
      originalInputHash: v4Digest(input), adjacentInputHash: v4Digest(priorInput), currentYearReexecutionVerified: true as const, adjacentYearOnlyInputChange: "selectedYear" as const,
      fullProducerPeriod: { start: output[0].startKst, endExclusive: december.endKstExclusive }, fullProducerOutputHash: v4Digest(output), december,
      originalGraphEvidence: [] as never[], originalFactRoots: [] as never[], independentCalculatedFact: false as const, newFactRoots: 0 as const, meaningIdentity: null, claimIdentity: null, customerUseAllowed: false as const };
    return { ...absent, availabilityState: "PRIOR_DECEMBER_VERIFIED" as const, sourceWitness: freeze(structuredClone({ ...body, witnessId: `annual-adjacent-year-source:v1:${v4Digest(body)}` })), reasons: [] as string[] };
  } catch (e) {
    return { ...absent, availabilityState: "PRIOR_DECEMBER_RECOMPUTATION_UNVERIFIED" as const, sourceWitness: null, reasons: [e instanceof Error ? e.message : "ADJACENT_YEAR_RECOMPUTATION_UNVERIFIED"] };
  }
}
export type PriorDecemberAvailability = ReturnType<typeof priorDecember>;
// A comparator-only view carries no Graph node, Fact Root or Binder selector.
// Its pointer names the separate producer output, never the original Graph.
function sourceComparatorView(raw: AnnualMonthSegment, ordinal: number, year: number, s: Session): AnnualSegment {
  const pointer = `/source-only-adjacent-year/${year}/calendarMonths/11/segments/${ordinal}`, recordHash = v4Digest(raw);
  return { raw, originalPointer: pointer, recordHash, owner: s.request.graph.context.owners.person!, sourceVersion: ANNUAL_MONTH_CALCULATION_VERSION, nodes: [], canonicalFactRoots: [], supportingAncestryRoots: [],
    contract: { month: 12, segmentIndex: ordinal, pointer, selectedYear: year, nominalAnnualGanji: null, monthPillar: raw.monthPillar, effectiveAnnualPillar: raw.effectiveAnnualPillar,
      activeDayunContext: raw.activeDayunContext, stemTenGod: raw.stemTenGod, branchTenGod: raw.branchTenGod, relationFacts: raw.relationFacts, uncertainty: raw.uncertainty,
      window: { scope: "month", start: raw.startKst, endExclusive: raw.endKstExclusive, certainty: "confirmed", originalBounds: { boundaryReason: raw.boundaryReason }, compatibleCombination: true },
      boundaryNodeId: null, componentNodeIds: {}, focus: false, contractHash: recordHash } };
}
function signature(raw: AnnualMonthSegment) {
  return { monthPillar: raw.monthPillar, effectiveAnnualPillar: raw.effectiveAnnualPillar, activeDayunContext: raw.activeDayunContext, stemTenGod: raw.stemTenGod, branchTenGod: raw.branchTenGod,
    relations: raw.relationFacts.map(f => { const value = { ...f }; Reflect.deleteProperty(value, "id"); return value; }).sort((a, b) => v4Digest(a).localeCompare(v4Digest(b), "en")) };
}
function comparison(before: AnnualSegment, after: AnnualSegment, sourceWitnessId: string | null) {
  if (before.owner !== after.owner || before.raw.endKstExclusive !== after.raw.startKst || intersectEvidencePeriods([before.contract.window, after.contract.window]).state !== "NO_INTERSECTION") throw Error("EXACT_NONSIMULTANEOUS_COMPARISON_REQUIRED");
  // A missing prior Graph cannot prove newly accepted transit/root changes.
  // Use symmetric source-signature views; retain actual Graph references separately.
  const comparisonViews = sourceWitnessId ? [before, after].map(v => ({ ...v, nodes: [], canonicalFactRoots: [], supportingAncestryRoots: [] })) : [before, after];
  const originalComparatorObservation = compareAnnualSegments(comparisonViews).segmentEdges[0], a = signature(before.raw), b = signature(after.raw);
  const reasons = [before, after].some(v => v.raw.uncertainty.length || v.raw.activeDayunContext.status === "transition_uncertain") ? ["CONDITIONAL_DAYUN_COMPARISON_WITHHELD"] : [];
  return { comparisonScope: sourceWitnessId ? "CALENDAR_AND_RELATION_SIGNATURES_ONLY" as const : "ORIGINAL_ADJACENT_SEGMENT_COMPARISON" as const, graphRootAndTransitComparisonState: sourceWitnessId ? "WITHHELD_MISSING_PRIOR_GRAPH" as const : "ORIGINAL_GRAPH_OBSERVATION_NOT_MEANING" as const, periodSemantics: "NON_SIMULTANEOUS_COMPARISON" as const, beforePointer: before.originalPointer, afterPointer: after.originalPointer, beforeWindow: before.contract.window, afterWindow: after.contract.window,
    beforeSignature: a, afterSignature: b, originalComparatorObservation, sourceWitnessId,
    beforeGraphEvidence: before.nodes.map(n => n.id), afterGraphEvidence: after.nodes.map(n => n.id), beforeFactRoots: before.canonicalFactRoots, afterFactRoots: after.canonicalFactRoots,
    result: reasons.length ? "WITHHELD" as const : same(a, b) ? "CARRYOVER_CONTINUITY" as const : "VERIFIED_SIGNATURE_DIFFERENCE" as const,
    changedFields: reasons.length ? [] : (Object.keys(a) as (keyof typeof a)[]).filter(k => !same(a[k], b[k])), reasons,
    comparisonApproved: false as const, independentCalculatedFact: false as const, newFactRoots: 0 as const, customerUseAllowed: false as const };
}
function bindSegment(s: Session, segment: AnnualSegment) {
  const candidate = structuredClone(s.row.candidate), ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  for (const [i, role] of (["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"] as const).entries()) candidate.requirement.sourceRequirements.push({ id: `${s.row.catalogKey}#${JANUARY_CONTRACT.version}/${segment.contract.segmentIndex}/${i}`, originalField: "/requires/0", originalDeclaration: s.row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: annualRoleSelector(role, undefined, segment.contract)!, required: true, gaps: [] });
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.originalReceipt, technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || !same(sorted(receipt.selectedActualEvidence), sorted(ids)) || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || receipt.customerApproved || receipt.operatorApproved
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation)) throw Error("EXACT_JANUARY_NATIVE_BINDING_REQUIRED");
  return { version: JANUARY_CONTRACT.version, segmentPointer: segment.originalPointer, effectiveInterval: segment.contract.window,  sourceWitnessesAreGraphFacts: false as const, typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}

async function evaluate(s: Session) {
  const proof = await source(s), e = s.original, raw = e.raw.calendarMonths![0], all = s.segments.filter(v => v.contract.month === 1), jie = getAnnualJieBoundaries(e.selectedYear), sohan = jie.find(j => j.name === "소한"), ipchun = jie.find(j => j.name === "입춘");
  if (!all.length || all.length !== raw.segments.length || raw.startKst !== `${e.selectedYear}-01-01T00:00:00+09:00` || raw.endKstExclusive !== `${e.selectedYear}-02-01T00:00:00+09:00` || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive
    || !sohan || !ipchun || sohan.instantKst === raw.startKst || ipchun.instantKst <= raw.endKstExclusive || all.filter(v => v.raw.boundaryReason.includes("jie:소한") && v.raw.startKst === sohan.instantKst).length !== 1
    || all.some((v, i) => !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash || v.contract.selectedYear !== e.selectedYear || v.owner !== s.request.graph.context.owners.person || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst
      || v.raw.boundaryReason.includes("jie:입춘") || !same(v.raw.effectiveAnnualPillar, sohan.beforeYear) || validateDayunContext(e.raw.customerDayun!, v.raw).length)) throw Error("EVERY_ORIGINAL_JANUARY_EFFECTIVE_SEGMENT_AND_SOHAN_REQUIRED");
  const sohanIndex = all.findIndex(v => v.raw.startKst === sohan.instantKst);
  if (sohanIndex < 1 || !same(all[sohanIndex - 1].raw.monthPillar, sohan.beforeMonth) || !same(all[sohanIndex].raw.monthPillar, sohan.afterMonth) || !same(sohan.beforeYear, sohan.afterYear)) throw Error("ORIGINAL_SOHAN_PILLARS_REQUIRED");
  const segmentResults = all.map(segment => {
    const nodes = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!].map(id => originalNode(s, id)), boundary = nodes[0];
    if (boundary.kind !== "TEMPORAL_BOUNDARY" || boundary.fact.observationPointer !== segment.originalPointer || !same(boundary.temporal, segment.contract.window) || boundary.producer.symbol !== "buildAnnualMonthCalendar"
      || boundary.producer.version !== segment.sourceVersion || nodes.slice(1).some(n => validateAnnualNodeIdentity(n, segment).length)) throw Error("ORIGINAL_BOUNDARY_COMPONENT_IDENTITY_REQUIRED");
    const graphEvidence = [boundary, ...segment.nodes], ancestry = new Map<string, ActualEvidenceNode>();
    const visit = (n: ActualEvidenceNode) => { if (ancestry.has(n.id)) return; if (!same(s.index.graph.nodes.get(n.id), n) || !n.ancestry.complete || n.ancestry.missingIds.length || n.ancestry.cycle || n.sources.some(p => p.state !== "VERIFIED")) throw Error("ORIGINAL_COMPLETE_ANCESTRY_REQUIRED"); ancestry.set(n.id, n); for (const id of n.ancestry.parentIds) { const parent = s.index.graph.nodes.get(id); if (!parent) throw Error("MISSING_ORIGINAL_ANCESTOR"); visit(parent); } };
    graphEvidence.forEach(visit);
    return { segmentPointer: segment.originalPointer, originalSegment: segment.raw, originalGraphEvidence: nodes, originalDayunContext: segment.raw.activeDayunContext, originalComponentAndRelationEvidence: graphEvidence,
      relationValidations: segment.raw.relationFacts.map(f => validateAnnualRelation(segment, f, e)), completeAncestry: [...ancestry.values()], existingFactRoots: sorted([...ancestry.values()].flatMap(n => n.ancestry.rootIds)), state: "VERIFIED" as const, binding: bindSegment(s, segment) };
  });
  const prior = priorDecember(s, proof), crossYearComparison = prior.sourceWitness ? comparison(sourceComparatorView(prior.sourceWitness.december.segments.at(-1)!, prior.sourceWitness.december.segments.length - 1, e.selectedYear - 1, s), all[0], prior.sourceWitness.witnessId) : null;
  const withinJanuaryComparisons = all.slice(1).map((after, i) => comparison(all[i], after, null)), typedBindings = segmentResults.map(v => v.binding), roots = sorted(typedBindings.flatMap(b => b.typedNativeReceipt.canonicalFactRoots));
  const body = { version: JANUARY_CONTRACT.version, fixtureId: s.request.graph.context.fixtureId, originalOwner: s.request.graph.context.owners.person!, originalProducer: { file: "src/lib/report-knowledge/annualMonthJie.ts", symbol: "buildAnnualMonthCalendar", version: e.raw.monthlyCalculationVersion! }, month: 1 as const, originalResearchId: s.row.originalResearchId, originalCatalogKey: s.row.catalogKey, originalSourceProof: proof, originalResearchRecord: s.row.original,
    originalCandidate: s.row.candidate, originalNativeReceipt: s.originalReceipt, originalNativeReceiptHash: actualSemanticDigest(s.originalReceipt), originalMeaningIdentity: null, originalClaimIdentity: null,
    sourcePreconditions: { selectedYear: e.selectedYear, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive }, everyCanonicalSegment: all.map(v => v.originalPointer), originalRequiredConditions: s.row.original.requires, allSegmentsRequired: true as const, optionalPriorDecember: true as const },
    nominalAnnualPillar: e.raw.annualGanji, januaryBoundaryProof: { civilYearStart: raw.startKst, civilYearStartIsIpchun: false as const, sohan, ipchun, effectiveAnnualPillar: all[0].raw.effectiveAnnualPillar, nominalAnnualIsNotEffectiveJanuary: true as const },
    segmentResults, typedBindings, priorDecember: prior, crossYearComparison, crossYearComparisonState: crossYearComparison && crossYearComparison.result !== "WITHHELD" ? "PREVIOUS_DECEMBER_COMPARISON_VERIFIED" as const : "PRIOR_DECEMBER_COMPARISON_WITHHELD" as const,
    explicitWithholdReasons: prior.sourceWitness ? crossYearComparison?.reasons ?? [] : [...prior.reasons, "PRIOR_DECEMBER_COMPARISON_WITHHELD"], withinJanuaryComparisons,
    originalFactRoots: roots, additionalExistingGraphReferenceRoots: roots.filter(r => !s.typedRoots.includes(r)), verifiedActualUnitIds: [] as string[], meaningReviewState: "REVIEW_REQUIRED" as const,
    productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const, customerUseAllowed: false as const, plannerUseAllowed: false as const,
    customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  return { monthReady: true as const, observation: freeze(structuredClone(body)), candidate: freeze(structuredClone({ ...body, technicalState: "JANUARY_TECHNICAL_CONTRACT_VERIFIED" as const, candidateId: `annual-january-carryover-candidate:v1:${v4Digest(body)}` })) };
}
export type JanuaryCandidate = Awaited<ReturnType<typeof evaluate>>["candidate"];
export async function evaluateJanuary(context: JanuaryContext) {
  offline(); try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_JANUARY_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s) }; } catch (e) { return fail(e); }
}
export async function validatePriorDecember(context: JanuaryContext, availability: PriorDecemberAvailability, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateJanuary(context), ok = result.ok && same(result.observation.priorDecember, availability);
  return { ok, eligibleAsCalculatedFact: false as const, reasons: ok ? [] : ["ORIGINAL_ADJACENT_YEAR_SOURCE_CHANGED"], customerUseAllowed: false as const };
}
export async function validateJanuaryCandidate(context: JanuaryContext, candidate: JanuaryCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateJanuary(context), ok = result.ok && same(result.candidate, candidate);
  return { ok, reasons: ok ? [] : ["ORIGINAL_JANUARY_CANDIDATE_CHANGED"], customerUseAllowed: false as const };
}
