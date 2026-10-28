import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { annualNarrativeEvidence } from "../../../interpretation-v4/annualEvidence";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualJanuaryCarryover } from "../annual-january-carryover/adapter";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { validateAnnualRelation } from "../annual-fortune-specialist-engine/relationMatcher";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import { declaredMonthlyRole, matchMonthlyGod, godReferenceAudit } from "../annual-fortune-specialist-engine/monthlyTenGodMatcher";
import type { EvidenceParticipant } from "../actual-evidence-graph/types";
import type { RelationWitness } from "../annual-april-relation/contract";
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

import { compareAnnualSegments } from "../annual-fortune-specialist-engine/monthComparator";
import { intersectEvidencePeriods } from "../actual-evidence-graph/temporal";
export const JUNE_CONTRACT = freeze({ version: "annual-june-previous-god-scope-v1", originalId: "afpr:month-slot:06", index: 5,
  recordSha256: "d11f10905a2dc8cf7d07f4b32d43ae46c2bbe3c36e100fbe8d7c46415856f409",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "previous same god + current actual relations + source scope"] } as const);
export const JUNE_SOURCE_FILES = freeze({
  "src/lib/report-knowledge/annual-fortune-product-research/monthlyTenGodResearch.ts": "ace1f94e6b43c7ab2bd117c15b22c3cd2ea3f9ca1f2518ceb52b78d2c727ce24",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-fortune-specialist-engine/monthlyTenGodMatcher.ts": "0f621a1513731eaef50857950b5d80b8e212cfb04cc18f8638e657a125b625c7",
  "src/lib/report-knowledge/knowledge-integration-foundation/annual-april-relation/contract.ts": "66c3a4410b5de84f361a0e99bfe6bd85707fcce399c98facc25513f0897976ea",
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
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type JuneContext = Readonly<{ version: "annual-june-same-god-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; row: AnnualCandidate; originalReceipt: KnowledgeBindingReceipt; segments: AnnualSegment[]; typedRoots: string[]; index: ActualBindingIndex; original: OriginalAnnual; monthlyRows: AnnualCandidate[]; monthlySourceProofs: Awaited<ReturnType<TemporalTenGodSourceResolver["proof"]>>[] };
const sessions = new WeakMap<JuneContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_JUNE_RELATION_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, verificationState: "JUNE_CONTRACT_WITHHELD" as const, reasons: [e instanceof Error ? e.message : "JUNE_RELATION_UNVERIFIED"], customerUseAllowed: false as const });
async function source(s: Pick<Session, "row" | "services">) {
  const row = s.row, pin = JUNE_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await s.services.resolver.record(row.candidate.record), proof = await s.services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 6 || row.original.scope !== "civil_month" || row.original.previousMonthDifference !== "compare actual prior last/current first/new Jie signatures; absent prior source -> withhold" || row.original.jieName !== "망종" || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false
    || row.catalogKey !== "kc:v1:f5ec8a9ad9e2f6f6acea1105299b88c192b5d5621a60d32276ef19a4fe1ede8d" || Object.hasOwn(row.original, "requiredRole") || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_JUNE_SOURCE_REQUIRED");
  const files = Object.entries(JUNE_SOURCE_FILES).map(([file, expectedHash]) => {
    const actualHash = hash(s.services.resolver.reader.text(file));
    if (actualHash !== expectedHash || s.services.resolver.frozen.has(file) && s.services.resolver.frozen.get(file) !== expectedHash) throw Error("ORIGINAL_RELATION_SOURCE_FILE_CHANGED:" + file);
    return { file, actualHash, expectedHash, sourceVersion: expectedHash, verification: "REPOSITORY_CODE_ONLY_NOT_MEANING_APPROVAL" as const };
  });
  return { research: proof, files };
}
export async function prepareJuneContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualJanuaryCarryover(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const researchIndex = new AnnualSpecialistIndex(services.foundation), row = researchIndex.byOriginalId.get(JUNE_CONTRACT.originalId);
    if (!row) throw Error("ORIGINAL_JUNE_SOURCE_REQUIRED"); await source({ row, services });
    const monthlyRows = researchIndex.byKind.get("MONTHLY_TEN_GOD") ?? [], monthlySourceProofs = [];
    if (monthlyRows.length !== 10 || new Set(monthlyRows.map(r => r.original.god)).size !== 10 || monthlyRows.some(r => declaredMonthlyRole(r.original) !== "AMBIGUOUS" || Object.hasOwn(r.original, "requiredRole"))) throw Error("ORIGINAL_TEN_MONTHLY_ROLE_AMBIGUITIES_REQUIRED");
    for (const monthly of monthlyRows) {
      const record = await services.resolver.record(monthly.candidate.record), proof = await services.resolver.proof(monthly.candidate.record.locator, monthly.originalResearchId, monthly.catalogKey);
      if (!same(record, monthly.original) || proof.actualHash !== monthly.candidate.record.locator.recordSha256 || proof.expectedHash !== proof.actualHash || proof.sourceVersion !== NATIVE_MONTH_PAIR_CONTRACT.sourceVersion || monthly.candidate.requirement.meaningIdentity !== null || monthly.candidate.requirement.claimIdentity !== null) throw Error("ORIGINAL_MONTHLY_GOD_SOURCE_REQUIRED");
      monthlySourceProofs.push(proof);
    }
    const composition = request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
    const original = composition.result.evidence;
    // Reexecute the original producer, including the full Dayun basis and canonical calendar.
    const reproduced = await annualNarrativeEvidence(request.graphInput.evidence.input, original.clock);
    if (!reproduced.ok || !same(reproduced, original)) throw Error("ORIGINAL_ANNUAL_DAYUN_CALENDAR_NOT_REPRODUCIBLE");
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog);
    if (index.errors.length) throw Error(index.errors.join("|"));
    const context = freeze({ version: "annual-june-same-god-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: snapshot, index, services, row: freeze(structuredClone(row)), originalReceipt: freeze(structuredClone(native.receipts.find(r => r.candidateCatalogKey === row.catalogKey)!)), segments: structuredClone(native.observation.segments), typedRoots: [...bridge.handoff.canonicalFactRoots], original: freeze(structuredClone(original)), monthlyRows: freeze(structuredClone(monthlyRows)), monthlySourceProofs: freeze(structuredClone(monthlySourceProofs)) });
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

function occurrence(s: Session, segment: AnnualSegment, f: AnnualSegment["raw"]["relationFacts"][number], ordinal: number, e: OriginalAnnual): RelationWitness {
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

export type MonthlyObservationRole = "MONTH_STEM" | "MONTH_BRANCH_MAIN";
function ancestry(s: Session, seeds: ActualEvidenceNode[]) {
  const nodes = new Map<string, ActualEvidenceNode>();
  const visit = (n: ActualEvidenceNode) => { if (nodes.has(n.id)) return; if (!same(s.index.graph.nodes.get(n.id), n) || n.owner.fixtureOwnerId !== s.request.graph.context.owners.person || !n.ancestry.complete || n.ancestry.missingIds.length || n.ancestry.cycle || n.sources.some(p => p.state !== "VERIFIED")) throw Error("ORIGINAL_COMPLETE_ANCESTRY_REQUIRED"); nodes.set(n.id, n); for (const id of n.ancestry.parentIds) { const parent = s.index.graph.nodes.get(id); if (!parent) throw Error("MISSING_ORIGINAL_ANCESTOR"); visit(parent); } };
  seeds.forEach(visit); return [...nodes.values()];
}
function godObservation(s: Session, segment: AnnualSegment, role: MonthlyObservationRole) {
  const god = role === "MONTH_STEM" ? segment.raw.stemTenGod : segment.raw.branchTenGod, row = s.monthlyRows.find(r => r.original.god === god);
  if (!row) throw Error("EXACT_ORIGINAL_MONTHLY_GOD_RECORD_REQUIRED");
  // Explicit role is a diagnostic projection of already calculated fields.
  // It does not resolve the original research's missing requiredRole.
  const match = matchMonthlyGod(row, segment, s.original, s.index, role), node = s.index.graph.nodes.get(segment.contract.componentNodeIds.ten_gods!);
  if (!node || !same(segment.nodes.find(n => n.id === node.id), node)) throw Error("ORIGINAL_GOD_GRAPH_NODE_REQUIRED");
  const reasons = sorted([...match.reasons, ...validateAnnualNodeIdentity(node, segment), ...(!match.matched || !same(match.nodeIds, [node.id]) || match.actualGod !== god || match.referenceStem !== s.original.raw.dayMaster || match.referenceStem !== s.original.calculation.pillars.day.stem || !match.targetStem
    || node.fact.producerEvidenceId !== segment.raw.evidenceIds[3] || node.certainty !== "confirmed" || node.status !== "VERIFIED" ? ["EXACT_CALCULATED_ROLE_OBSERVATION_REQUIRED"] : [])]);
  const completeAncestry = ancestry(s, [node]), body = { fixtureId: s.request.graph.context.fixtureId, owner: segment.owner, selectedYear: segment.contract.selectedYear, segmentPointer: segment.originalPointer,
    interval: segment.contract.window, originRole: role, dayMaster: s.original.raw.dayMaster, referenceStem: match.referenceStem, targetStem: match.targetStem, tenGod: god,
    originalEvidenceId: node.fact.producerEvidenceId, originalGraphNodeId: node.id, originalProducer: node.producer, producerVersion: node.producer.version, sourceVersion: segment.sourceVersion,
    originalGraphNode: node, originalRootId: node.fact.rootId, originalRootIds: sorted(node.ancestry.rootIds), completeAncestry, certainty: node.certainty, originalBlockers: node.blockers,
    sourceIdentity: { originalMonthlyResearchId: row.originalResearchId, originalLocator: row.candidate.record.locator, originalRecordHash: row.candidate.record.locator.recordSha256 },
    originalResearchRole: declaredMonthlyRole(row.original), diagnosticRoleOnly: true as const, selectorWitness: match, verificationState: reasons.length ? "UNVERIFIED_PREVIOUS_OCCURRENCE" as const : "VERIFIED_CALCULATED_OBSERVATION" as const,
    reasons, meaningIdentity: null, claimIdentity: null, independentMeaningCount: 0 as const, newFactRoots: 0 as const, customerUseAllowed: false as const };
  return freeze(structuredClone({ ...body, observationId: `annual-monthly-god-observation:v1:${v4Digest(body)}` }));
}
export type GodObservation = ReturnType<typeof godObservation>;
function relationSignature(witnesses: RelationWitness[]) {
  return witnesses.map(w => { const value = { ...w.originalRelationFact }; Reflect.deleteProperty(value, "id"); return { value, participants: w.actualParticipants, originalProducer: w.originalProducer, certainty: w.calculationCertainty, verificationState: w.verificationState, originalBlockers: w.originalBlockingReasons }; }).sort((a, b) => v4Digest(a).localeCompare(v4Digest(b), "en"));
}
function compareOccurrences(s: Session, previous: GodObservation, current: GodObservation, relations: Map<string, RelationWitness[]>, graph: ReturnType<typeof compareAnnualSegments>) {
  const p = s.segments.find(v => v.originalPointer === previous.segmentPointer)!, c = s.segments.find(v => v.originalPointer === current.segmentPointer)!;
  if (!p || !c || previous.fixtureId !== current.fixtureId || previous.owner !== current.owner || previous.selectedYear !== current.selectedYear || p.contract.month < 1 || p.contract.month > 5
    || Date.parse(previous.interval.endExclusive!) > Date.parse(current.interval.start!) || intersectEvidencePeriods([previous.interval, current.interval]).state !== "NO_INTERSECTION") throw Error("ACTUAL_EARLIER_SAME_YEAR_OWNER_REQUIRED");
  const priorRelations = relations.get(p.originalPointer)!, currentRelations = relations.get(c.originalPointer)!, a = { interval: p.contract.window, effectiveAnnualPillar: p.raw.effectiveAnnualPillar, activeDayunContext: p.raw.activeDayunContext, relationSignatures: relationSignature(priorRelations) }, b = { interval: c.contract.window, effectiveAnnualPillar: c.raw.effectiveAnnualPillar, activeDayunContext: c.raw.activeDayunContext, relationSignatures: relationSignature(currentRelations) };
  const changedContextFields = (Object.keys(a) as (keyof typeof a)[]).filter(k => !same(a[k], b[k])), sameRole = previous.originRole === current.originRole;
  const reasons = sorted([...previous.reasons, ...current.reasons, ...priorRelations.flatMap(w => w.withholdReasons), ...currentRelations.flatMap(w => w.withholdReasons)]);
  const start = s.segments.indexOf(p), end = s.segments.indexOf(c), path = graph.segmentEdges.slice(start, end);
  if (start < 0 || end <= start || path.length !== end - start || path[0].from !== p.originalPointer || path.at(-1)!.to !== c.originalPointer) throw Error("ORIGINAL_LEDGER_COMPARISON_PATH_REQUIRED");
  const priorRoots = sorted([...previous.originalRootIds, ...priorRelations.flatMap(w => w.completeAncestry.rootIds)]), currentRoots = sorted([...current.originalRootIds, ...currentRelations.flatMap(w => w.completeAncestry.rootIds)]);
  const priorParticipants = relationSignature(priorRelations).flatMap(w => w.participants), currentParticipants = relationSignature(currentRelations).flatMap(w => w.participants);
  return { previousObservationId: previous.observationId, currentObservationId: current.observationId, previousRole: previous.originRole, currentRole: current.originRole,
    roleMatchState: sameRole ? "EXACT_ROLE_SCOPED_MATCH" as const : "SAME_GOD_DIFFERENT_ROLE" as const,
    comparisonState: !sameRole ? "SAME_GOD_DIFFERENT_ROLE" as const : changedContextFields.length ? "SAME_GOD_DIFFERENT_CONTEXT" as const : "EXACT_ROLE_SCOPED_MATCH" as const,
    roleSourceResolution: "ORIGINAL_ROLE_UNRESOLVED" as const, contextComparisonState: reasons.length ? "WITHHELD" as const : "VERIFIED_CALCULATED_CONTEXT_COMPARISON" as const,
    beforeInterval: previous.interval, afterInterval: current.interval, temporalScope: previous.interval.endExclusive === current.interval.start ? "ADJACENT_SOURCE_COMPARISON" as const : "NON_ADJACENT_SOURCE_WITNESS" as const,
    periodSemantics: "NON_SIMULTANEOUS_SOURCE_COMPARISON" as const, originalAdjacentPathEdges: path, directAdjacentObservation: previous.interval.endExclusive === current.interval.start ? path[0] : null,
    previousContext: a, currentContext: b, changedContextFields, differentPeriodOnly: changedContextFields.length === 1 && changedContextFields[0] === "interval", calculatedContextChangedBeyondPeriod: changedContextFields.some(k => k !== "interval"), previousParticipantIdentities: priorParticipants, currentParticipantIdentities: currentParticipants,
    participantIdentitiesChanged: !same(priorParticipants, currentParticipants), previousRelationWitnessIds: priorRelations.map(w => w.witnessId), currentRelationWitnessIds: currentRelations.map(w => w.witnessId),
    rootComparisonScope: "ALL_ORIGINAL_FACT_AND_SUPPORTING_ANCESTRY_ROOTS" as const, sharedRoots: priorRoots.filter(r => currentRoots.includes(r)), changedRoots: sorted([...priorRoots.filter(r => !currentRoots.includes(r)), ...currentRoots.filter(r => !priorRoots.includes(r))]),
    originalRootReferences: sorted([...previous.originalRootIds, ...current.originalRootIds, ...priorRelations.flatMap(w => w.completeAncestry.rootIds), ...currentRelations.flatMap(w => w.completeAncestry.rootIds)]),
    repeatedGodIsIndependentMeaning: false as const, rootDifferenceEstablishesNewMeaning: false as const, distinctCalculatedPeriodObservation: true as const, comparisonApproved: false as const,
    independentInformationAdded: 0 as const, newFactRoots: 0 as const, customerClaims: 0 as const, reasons };
}
function previousWitness(s: Session, segment: AnnualSegment, observations: GodObservation[], relations: Map<string, RelationWitness[]>, proof: Awaited<ReturnType<typeof source>>, comparator: ReturnType<typeof compareAnnualSegments>) {
  const current = observations.filter(o => o.segmentPointer === segment.originalPointer), earlier = observations.filter(o => { const row = s.segments.find(v => v.originalPointer === o.segmentPointer)!; return row.contract.month >= 1 && row.contract.month <= 5 && o.selectedYear === s.original.selectedYear && o.owner === segment.owner && Date.parse(o.interval.endExclusive!) <= Date.parse(segment.raw.startKst); });
  const matching = earlier.filter(p => current.some(c => p.tenGod === c.tenGod)), comparisons = current.flatMap(c => matching.filter(p => p.tenGod === c.tenGod && p.verificationState === "VERIFIED_CALCULATED_OBSERVATION" && c.verificationState === "VERIFIED_CALCULATED_OBSERVATION").map(p => compareOccurrences(s, p, c, relations, comparator)));
  const body = { version: JUNE_CONTRACT.version, originalJuneResearchId: s.row.originalResearchId, originalJuneSourceProof: proof, fixtureId: s.request.graph.context.fixtureId, owner: segment.owner, selectedYear: s.original.selectedYear,
    currentSegmentPointer: segment.originalPointer, currentInterval: segment.contract.window, currentTenGodObservations: current, previousMatchingObservations: matching,
    currentRoleResults: current.map(c => { const matched = matching.filter(p => p.tenGod === c.tenGod && p.verificationState === "VERIFIED_CALCULATED_OBSERVATION"), unverified = matching.filter(p => p.tenGod === c.tenGod && p.verificationState !== "VERIFIED_CALCULATED_OBSERVATION"); return { currentObservationId: c.observationId, role: c.originRole, tenGod: c.tenGod,
      previousObservationIds: matched.map(p => p.observationId), unverifiedPreviousObservationIds: unverified.map(p => p.observationId), occurrenceState: c.verificationState !== "VERIFIED_CALCULATED_OBSERVATION" || !matched.length && unverified.length ? "UNVERIFIED_PREVIOUS_OCCURRENCE" as const : matched.length ? "PREVIOUS_CALCULATED_OCCURRENCES_VERIFIED" as const : "NO_PREVIOUS_OCCURRENCE" as const, selectedRepresentative: null }; }),
    comparisons, roleResolutionState: "ORIGINAL_ROLE_UNRESOLVED" as const, requiredConditions: s.row.original.requires, withholdReasons: ["ROLE_SOURCE_DECISION_REQUIRED"],
    originalRoleSelected: null, diagnosticRolesOnly: ["MONTH_STEM", "MONTH_BRANCH_MAIN"] as const, nonMonthlyRolesExcluded: ["ANNUAL_STEM", "DAYUN_STEM", "FLOW_GOD"] as const,
    newFactRoots: 0 as const, independentMeaningCount: 0 as const, meaningIdentity: null, claimIdentity: null, customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING" as const, customerUseAllowed: false as const };
  return freeze(structuredClone({ ...body, witnessId: `annual-june-previous-god-witness:v1:${v4Digest(body)}` }));
}
export type PreviousGodWitness = ReturnType<typeof previousWitness>;
function bindSegment(s: Session, segment: AnnualSegment, witnesses: RelationWitness[]) {
  const candidate = structuredClone(s.row.candidate), ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!, ...witnesses.map(w => w.originalGraphNodeId)];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  const selectors: EvidenceSelector[] = ["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"].map(role => annualRoleSelector(role as "BOUNDARY" | "MONTH_PILLAR" | "EFFECTIVE_ANNUAL", undefined, segment.contract)!);
  for (const w of witnesses) selectors.push({ kinds: ["CALCULATED_PERIOD_FACT"], owner: "person", temporalScope: "month", evidenceId: w.originalRelationEvidenceId, observationPointer: index.graph.nodes.get(w.originalGraphNodeId)!.fact.observationPointer,
    producer: w.originalProducer, fields: [{ path: "value.type", equals: w.relationType }], participants: w.actualParticipants.map(p => ({ ...p, owner: "person" as const })), memberValues: w.participantValues });
  selectors.forEach((selector, i) => candidate.requirement.sourceRequirements.push({ id: `${s.row.catalogKey}#${JUNE_CONTRACT.version}/${segment.contract.segmentIndex}/${i}`, originalField: i < 3 ? "/requires/0" : "/requires/2", originalDeclaration: s.row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] }));
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.originalReceipt, technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || !same(sorted(receipt.selectedActualEvidence), sorted(ids)) || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || receipt.customerApproved || receipt.operatorApproved
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation) || receipt.canonicalFactRoots.some(r => ![...index.graph.nodes.values()].some(n => n.fact.rootId === r))) throw Error("EXACT_ALL_RELATION_NATIVE_BINDING_REQUIRED");
  return { use: "CURRENT_FACT_SCOPE_ONLY_NOT_JUNE_APPLICABILITY" as const, originalRoleResolution: "ORIGINAL_ROLE_UNRESOLVED" as const, version: JUNE_CONTRACT.version, segmentPointer: segment.originalPointer, effectiveInterval: segment.contract.window, witnessIds: witnesses.map(w => w.witnessId), typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}

async function evaluate(s: Session) {
  const proof = await source(s), e = s.original, raw = e.raw.calendarMonths![5], all = s.segments.filter(v => v.contract.month === 6), searched = s.segments.filter(v => v.contract.month >= 1 && v.contract.month <= 6);
  if (!all.length || all.length !== raw.segments.length || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive || raw.startKst !== `${e.selectedYear}-06-01T00:00:00+09:00` || raw.endKstExclusive !== `${e.selectedYear}-07-01T00:00:00+09:00`
    || all.some((v, i) => !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash || v.owner !== s.request.graph.context.owners.person || v.contract.selectedYear !== e.selectedYear || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst)) throw Error("EVERY_ORIGINAL_JUNE_SEGMENT_REQUIRED");
  for (const segment of all) {
    const boundary = originalNode(s, segment.contract.boundaryNodeId);
    if (boundary.kind !== "TEMPORAL_BOUNDARY" || boundary.fact.observationPointer !== segment.originalPointer || !same(boundary.temporal, segment.contract.window) || boundary.producer.symbol !== "buildAnnualMonthCalendar" || boundary.producer.version !== segment.sourceVersion) throw Error("ORIGINAL_JUNE_BOUNDARY_REQUIRED");
  }
  const calculatedObservations = searched.flatMap(segment => (["MONTH_STEM", "MONTH_BRANCH_MAIN"] as const).map(role => godObservation(s, segment, role))), relations = new Map(searched.map(segment => [segment.originalPointer, segment.raw.relationFacts.map((f, i) => occurrence(s, segment, f, i, e))])), comparator = compareAnnualSegments(s.segments);
  const segmentResults = all.map(segment => {
    const witnesses = relations.get(segment.originalPointer)!, previousGodWitness = previousWitness(s, segment, calculatedObservations, relations, proof, comparator), reasons = sorted(witnesses.flatMap(w => w.withholdReasons));
    return { segmentPointer: segment.originalPointer, originalSegment: segment.raw, originalBoundaryNode: originalNode(s, segment.contract.boundaryNodeId), currentRelationWitnesses: witnesses, previousGodWitness,
      relationScopeState: reasons.length ? "WITHHELD" as const : "VERIFIED_ORIGINAL_CURRENT_RELATION_SCOPE" as const, relationWithholdReasons: reasons,
      currentFactBinding: reasons.length ? null : bindSegment(s, segment, witnesses), originalJuneCandidateState: "WITHHELD_ROLE_SOURCE_DECISION_REQUIRED" as const };
  });
  const body = { version: JUNE_CONTRACT.version, fixtureId: s.request.graph.context.fixtureId, month: 6 as const, originalResearchId: s.row.originalResearchId, originalSourceProof: proof,
    originalResearchRecord: s.row.original, originalCandidate: s.row.candidate, originalNativeReceipt: s.originalReceipt, originalNativeReceiptHash: actualSemanticDigest(s.originalReceipt), originalMeaningIdentity: null, originalClaimIdentity: null,
    sourcePreconditions: { selectedYear: e.selectedYear, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive }, everyCanonicalSegment: all.map(v => v.originalPointer), searchScope: { months: [1, 2, 3, 4, 5], sameSelectedYearOnly: true, earlierThanCurrentOnly: true }, originalRequiredConditions: s.row.original.requires },
    calculatedObservations, previousGodWitnesses: segmentResults.map(v => v.previousGodWitness), segmentResults,
    sourceRelationWitnesses: [...relations.values()].flat(), typedBindings: segmentResults.flatMap(v => v.currentFactBinding ? [v.currentFactBinding] : []),
    monthlyGodRoleSourceAudit: s.monthlyRows.map((row, i) => ({ originalId: row.originalResearchId, originalRole: declaredMonthlyRole(row.original), originalSourceProof: s.monthlySourceProofs[i], requiredRoleAdded: false as const })),
    otherLayerReferenceAudit: godReferenceAudit(e), originalResearchRoleResolution: "ORIGINAL_ROLE_UNRESOLVED" as const, roleSourceResolution: "ROLE_SOURCE_DECISION_REQUIRED" as const,
    explicitWithholdReasons: sorted(["ROLE_SOURCE_DECISION_REQUIRED", ...segmentResults.flatMap(v => v.relationWithholdReasons)]), originalFactRoots: [...s.typedRoots],
    verifiedActualUnitIds: [] as string[], meaningReviewState: "REVIEW_REQUIRED" as const, productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const,
    customerUseAllowed: false as const, plannerUseAllowed: false as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const, independentMeaningsAdded: 0 as const };
  return { monthReady: false as const, candidate: null, observation: freeze(structuredClone(body)) };
}
export type JuneObservation = Awaited<ReturnType<typeof evaluate>>["observation"];
export async function evaluateJune(context: JuneContext) {
  offline(); try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_JUNE_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s) }; } catch (e) { return fail(e); }
}
export async function validatePreviousGodWitness(context: JuneContext, witness: PreviousGodWitness, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateJune(context), expected = result.ok ? result.observation.previousGodWitnesses.find(w => w.witnessId === witness.witnessId) : null, ok = !!expected && same(expected, witness);
  return { ok, reasons: ok ? [] : ["ORIGINAL_PREVIOUS_GOD_WITNESS_CHANGED"], eligibleAsIndependentFact: false as const, originalRoleResolved: false as const, customerUseAllowed: false as const };
}
export async function validateJuneObservation(context: JuneContext, observation: JuneObservation, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateJune(context), ok = result.ok && same(result.observation, observation);
  return { ok, reasons: ok ? [] : ["ORIGINAL_JUNE_OBSERVATION_CHANGED"], juneCandidateAuthorized: false as const, customerUseAllowed: false as const };
}
