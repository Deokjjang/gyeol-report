import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { annualNarrativeEvidence } from "../../../interpretation-v4/annualEvidence";
import { STEM_COMBINATIONS } from "../../../saju/constants";
import { actualSemanticDigest } from "../actual-calculation-semantic-bridge/units";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { adaptAnnualAprilRelations } from "../annual-april-relation/adapter";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import { validateNominalStemRelation } from "../annual-fortune-specialist-engine/relationMatcher";
import { validateAnnualNodeIdentity } from "../annual-fortune-specialist-engine/annualIdentity";
import { validateJieCalendar } from "../annual-fortune-specialist-engine/boundaryValidator";
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

export const FEBRUARY_CONTRACT = freeze({ version: "annual-february-effective-year-binding-v1", originalId: "afpr:month-slot:02", index: 1,
  recordSha256: "757b56db6d32f93f0a35671827024b3a9fc53a2cb8440069eed005f55cc8b11b",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "effective annual before/after + annualStemRelations validity"] } as const);
// Content-addressed versions authenticate original code, not traditional meaning approval.
export const FEBRUARY_SOURCE_FILES = freeze({
  "src/lib/interpretation-v4/annualEvidence.ts": "89f8d78841501317f4623a6f130c74d95ac5c9110a2eb27f257f089cec7b6533",
  "src/lib/saju/constants.ts": "709f977a2dd80f397f1bfb249d115896f1b97acfd4880b07253f1474badccfaa",
  "src/lib/report-knowledge/annualMonthJie.ts": "555676ca85aefd8812ebad1f4bc7ff863a9eb78e92a8ce977c79f792f0b12d5f",
  "src/lib/report-knowledge/annualFortuneYearRules.ts": "9fe7ec48a5c605984ba17d245bb60c4a7097c2eae031643812e16b0371e317fe",
  "src/lib/saju/calculateSaju.ts": "512dabfdb1d9bea14dd739fb3ead53565a88c953e7f498b4c37cbd4b85650cbd",
  "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/natal.ts": "d67f68564d255b101b5a3c18933baa37fd642d3e838147684ef8aec5a6a9d602",
  "src/lib/report-knowledge/knowledge-integration-foundation/actual-evidence-graph/periods.ts": "70413c47eb8f8819b3b7542cff932f3ac05e132dcd859b629265d1b60ae46753",
} as const);
export type RelationApplicability = "APPLICABLE_VERIFIED_DECLARATION_SCOPE" | "NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT" | "NO_ORIGINAL_RELATION_DECLARATION" | "SOURCE_OR_ADDRESS_UNVERIFIED" | "WITHHELD_UNKNOWN_CONTEXT";
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
export type FebruaryContext = Readonly<{ version: "annual-february-relation-context-v1"; fixtureId: string; requestHash: string }>;
type Session = { request: KnowledgeBindingRequest; services: Services; row: AnnualCandidate; originalReceipt: KnowledgeBindingReceipt; segments: AnnualSegment[]; typedRoots: string[]; index: ActualBindingIndex; original: OriginalAnnual };
const sessions = new WeakMap<FebruaryContext, Session>();
const same = (a: unknown, b: unknown) => v4Digest(a) === v4Digest(b);
const sorted = (v: readonly string[]) => [...new Set(v)].sort();
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ANNUAL_FEBRUARY_RELATION_OFFLINE_ONLY"); }
const fail = (e: unknown) => ({ ok: false as const, applicabilityState: "SOURCE_OR_ADDRESS_UNVERIFIED" as const, reasons: [e instanceof Error ? e.message : "FEBRUARY_RELATION_UNVERIFIED"], customerUseAllowed: false as const });
async function source(s: Pick<Session, "row" | "services">) {
  const row = s.row, pin = FEBRUARY_CONTRACT, common = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const record = await s.services.resolver.record(row.candidate.record), proof = await s.services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== common.file || locator.exportName !== common.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || locator.sourceVersion !== common.sourceVersion || !same(proof.locator, { ...locator, fileSha256: common.fileSha256 })
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== common.sourceVersion || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || !same(record, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 2 || row.original.scope !== "civil_month" || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false
    || row.candidate.requirement.meaningIdentity !== null || row.candidate.requirement.claimIdentity !== null) throw Error("EXACT_ORIGINAL_FEBRUARY_SOURCE_REQUIRED");
  const files = Object.entries(FEBRUARY_SOURCE_FILES).map(([file, expectedHash]) => {
    const actualHash = hash(s.services.resolver.reader.text(file));
    if (actualHash !== expectedHash || s.services.resolver.frozen.get(file) !== expectedHash) throw Error("ORIGINAL_RELATION_SOURCE_FILE_CHANGED:" + file);
    return { file, actualHash, expectedHash, sourceVersion: expectedHash, verification: "REPOSITORY_CODE_ONLY_NOT_MEANING_APPROVAL" as const };
  });
  const moduleExports = await s.services.resolver.reader.exports("src/lib/saju/constants.ts");
  if (v4Digest(STEM_COMBINATIONS) !== "cfca3789a298deff5b97aef5aba38fe9f7cd3e986ecee7206445ddff797b421d" || !same(moduleExports.STEM_COMBINATIONS, STEM_COMBINATIONS)) throw Error("ORIGINAL_STEM_COMBINATIONS_CHANGED");
  return { research: proof, files, combinationSource: { file: "src/lib/saju/constants.ts", symbol: "STEM_COMBINATIONS", originalTable: STEM_COMBINATIONS, tableHash: v4Digest(STEM_COMBINATIONS), fileHash: FEBRUARY_SOURCE_FILES["src/lib/saju/constants.ts"] } };
}
export async function prepareFebruaryContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]), baseline = await adaptAnnualAprilRelations(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (request.product !== "annual_fortune") return { ok: true as const, context: null, baseline };
    const native = baseline.baseline.baseline.baseline.baseline.baseline.native;
    if (native.version !== "annual-fortune-specialist-v1") throw Error("ORIGINAL_ANNUAL_LEDGER_REQUIRED");
    const row = new AnnualSpecialistIndex(services.foundation).byOriginalId.get(FEBRUARY_CONTRACT.originalId);
    if (!row) throw Error("ORIGINAL_FEBRUARY_SOURCE_REQUIRED"); await source({ row, services });
    const composition = request.graphInput.evidence.composition; if (composition.product !== "annual_fortune") throw Error("ANNUAL_REQUIRED");
    const original = composition.result.evidence;
    // Reexecute the original producer, including genuinely empty declaration lists.
    const reproduced = await annualNarrativeEvidence(request.graphInput.evidence.input, original.clock);
    if (!reproduced.ok || !same(reproduced, original)) throw Error("ORIGINAL_ANNUAL_DECLARATIONS_NOT_REPRODUCIBLE");
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog);
    if (index.errors.length) throw Error(index.errors.join("|"));
    const context = freeze({ version: "annual-february-relation-context-v1" as const, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
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
function witness(s: Session, segment: AnnualSegment, declaration: OriginalAnnual["annualStemRelations"][number] | null, ordinal: number | null, proof: Awaited<ReturnType<typeof source>>) {
  const annual = originalNode(s, segment.contract.componentNodeIds.annual), boundary = originalNode(s, segment.contract.boundaryNodeId);
  if (validateAnnualNodeIdentity(annual, segment).length || !same(annual.value, { component: "annual", effectiveAnnualPillar: segment.raw.effectiveAnnualPillar })) throw Error("EXACT_EFFECTIVE_ANNUAL_REQUIRED");
  const producer = { file: "src/lib/interpretation-v4/annualEvidence.ts", symbol: "annualNarrativeEvidence", version: FEBRUARY_SOURCE_FILES["src/lib/interpretation-v4/annualEvidence.ts"] };
  const pointer = ordinal === null ? "/composition/result/evidence/annualStemRelations" : `/composition/result/evidence/annualStemRelations/${ordinal}`;
  let natal: ActualEvidenceNode | null = null, applicabilityState: RelationApplicability = "NO_ORIGINAL_RELATION_DECLARATION", reasons: string[] = [];
  let legacyCheck: ReturnType<typeof validateNominalStemRelation> | null = null;
  if (declaration) {
    if (ordinal === null || !same(s.original.annualStemRelations[ordinal], declaration)) throw Error("EXACT_ORIGINAL_DECLARATION_REQUIRED");
    const position = declaration.position;
    if (!["year", "month", "day", "hour"].includes(position)) throw Error("ORIGINAL_NATAL_POSITION_REQUIRED");
    const pillar = s.original.calculation.pillars[position as "year" | "month" | "day" | "hour"];
    const found = [...s.index.graph.nodes.values()].find(n => n.fact.observationPointer === `/calculations/person/pillars/${position}/stem` && n.owner.fixtureOwnerId === segment.owner);
    if (!pillar || !found || position === "hour" && s.request.graphInput.evidence.input.kind !== "compatibility" && s.request.graphInput.evidence.input.person.birthTimePrecision !== "exact") {
      applicabilityState = "WITHHELD_UNKNOWN_CONTEXT"; reasons = ["ORIGINAL_NATAL_PARTICIPANT_OR_EXACT_HOUR_UNAVAILABLE"];
    } else {
      natal = originalNode(s, found.id);
      if (declaration.natalStem !== pillar.stem || declaration.annualStem !== s.original.raw.annualGanji.stem || declaration.type !== "천간합"
        || !same(declaration.sourceRefs, ["saju/constants:STEM_COMBINATIONS", `natal:${position}:stem`, `annual:${s.original.selectedYear}:stem`])
        || !same(natal.participants, [{ owner: segment.owner, position, slot: "stem", value: pillar.stem }]) || natal.producer.symbol !== "calculateSaju" || natal.producer.version !== s.original.calculation.calculationVersion) throw Error("EXACT_DECLARATION_PARTICIPANT_SOURCE_REQUIRED");
      legacyCheck = validateNominalStemRelation(segment, declaration);
      applicabilityState = declaration.annualStem === segment.raw.effectiveAnnualPillar.stem ? "APPLICABLE_VERIFIED_DECLARATION_SCOPE" : "NOT_APPLICABLE_TO_EFFECTIVE_SEGMENT";
      // Preserve the original validator's missing Graph-address warning. Scope verification never upgrades it to a calculated relation Fact.
      reasons = [...legacyCheck.reasons];
    }
  } else if (s.original.annualStemRelations.length) throw Error("NONEMPTY_DECLARATION_LIST_CANNOT_BE_ABSENCE");
  const body = { version: "annual-effective-stem-relation-v1" as const, recordKind: "SOURCE_DECLARATION_APPLICABILITY_ONLY" as const, fixtureId: s.request.graph.context.fixtureId,
    originalResearchId: s.row.originalResearchId, originalSourceProof: proof, originalAnnualRelationDeclaration: declaration, declarationIdentity: { pointer, ordinal, hash: v4Digest(declaration ?? s.original.annualStemRelations), producer, owner: segment.owner },
    declarationSourceReferences: declaration?.sourceRefs ?? [], originalDeclarationListHash: v4Digest(s.original.annualStemRelations), originalDeclarationCount: s.original.annualStemRelations.length, producerReexecutionVerified: true as const,
    natalPosition: declaration?.position ?? null, natalStem: declaration?.natalStem ?? null, nominalAnnualPillar: s.original.raw.annualGanji, nominalAnnualStem: s.original.raw.annualGanji.stem, effectiveAnnualStem: segment.raw.effectiveAnnualPillar.stem,
    relationType: declaration?.type ?? null, originalCombinationSource: proof.combinationSource, actualOwner: annual.owner, originalNatalStemEvidence: natal, actualAnnualSegmentEvidence: annual, originalBoundaryEvidence: boundary,
    producerIdentity: producer, producerVersion: producer.version, exactSegmentWindow: segment.contract.window, segmentPointer: segment.originalPointer,
    originalAncestry: [boundary, annual, ...(natal ? [natal] : [])].map(n => ({ nodeId: n.id, ancestry: n.ancestry })), originalFactRoots: sorted([boundary, annual, ...(natal ? [natal] : [])].flatMap(n => n.ancestry.rootIds)),
    applicabilityState, blockingReasons: reasons, originalNominalValidator: legacyCheck,
    calculatedRelationFactVerified: false as const, graphRelationNodeId: null, newFactRoots: 0 as const, independentFactsAdded: 0 as const, meaningIdentity: null, claimIdentity: null,
    meaningReviewState: "REVIEW_REQUIRED" as const, customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING" as const, customerUseAllowed: false as const };
  return freeze(structuredClone({ ...body, witnessId: `annual-effective-stem-witness:v1:${v4Digest(body)}` }));
}
export type RelationApplicabilityWitness = ReturnType<typeof witness>;
function bindSegment(s: Session, segment: AnnualSegment, witnesses: RelationApplicabilityWitness[]) {
  const candidate = structuredClone(s.row.candidate), ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!];
  const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.contract.window, restrictEvidenceTo: ids }, s.services.foundation.catalog);
  for (const [i, role] of (["BOUNDARY", "MONTH_PILLAR", "EFFECTIVE_ANNUAL"] as const).entries()) candidate.requirement.sourceRequirements.push({ id: `${s.row.catalogKey}#${FEBRUARY_CONTRACT.version}/${segment.contract.segmentIndex}/${i}`, originalField: "/requires/0", originalDeclaration: s.row.original.requires, sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector: annualRoleSelector(role, undefined, segment.contract)!, required: true, gaps: [] });
  candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
  const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog), original = s.originalReceipt, technical = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
  if (index.errors.length || !same(sorted(receipt.selectedActualEvidence), sorted(ids)) || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) || receipt.customerApproved || receipt.operatorApproved
    || receipt.allTwelveGateResults.some(g => technical.includes(g.gate) ? g.state !== "PASS" : !same([g.state, g.reasons], (() => { const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!; return [old.state, old.reasons]; })()))
    || !same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation)) throw Error("EXACT_FEBRUARY_NATIVE_BINDING_REQUIRED");
  return { version: FEBRUARY_CONTRACT.version, segmentPointer: segment.originalPointer, effectiveInterval: segment.contract.window, sourcePreconditionWitnessIds: witnesses.map(w => w.witnessId), sourceWitnessesAreGraphFacts: false as const, typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt) };
}
async function evaluate(s: Session) {
  const proof = await source(s), e = s.original, raw = e.raw.calendarMonths![1], all = s.segments.filter(v => v.contract.month === 2);
  if (!all.length || all.length !== raw.segments.length || all[0].raw.startKst !== raw.startKst || all.at(-1)!.raw.endKstExclusive !== raw.endKstExclusive
    || all.some((v, i) => !same(v.raw, raw.segments[i]) || v.recordHash !== v.contract.contractHash || v.contract.selectedYear !== e.selectedYear || v.owner !== s.request.graph.context.owners.person || i > 0 && all[i - 1].raw.endKstExclusive !== v.raw.startKst)) throw Error("EVERY_ORIGINAL_FEBRUARY_SEGMENT_REQUIRED");
  const boundaries = validateJieCalendar(e.raw.calendarMonths!, e.selectedYear).filter(j => j.name === "입춘");
  if (boundaries.length !== 1 || !boundaries[0].valid || !all.some(s => s.raw.startKst === boundaries[0].instantKst)) throw Error("ORIGINAL_IPCHUN_BEFORE_AT_AFTER_REQUIRED");
  const segmentResults = all.map(segment => {
    const ids = [segment.contract.boundaryNodeId!, segment.contract.componentNodeIds.month!, segment.contract.componentNodeIds.annual!];
    const nodes = ids.map(id => originalNode(s, id)), boundary = nodes[0];
    if (boundary.kind !== "TEMPORAL_BOUNDARY" || boundary.fact.observationPointer !== segment.originalPointer || !same(boundary.temporal, segment.contract.window)
      || boundary.producer.symbol !== "buildAnnualMonthCalendar" || boundary.producer.version !== segment.sourceVersion || nodes.slice(1).some(n => validateAnnualNodeIdentity(n, segment).length)) throw Error("ORIGINAL_BOUNDARY_COMPONENT_IDENTITY_REQUIRED");
    const witnesses = e.annualStemRelations.length ? e.annualStemRelations.map((d, i) => witness(s, segment, d, i, proof)) : [witness(s, segment, null, null, proof)];
    const reasons = witnesses.filter(w => w.applicabilityState === "WITHHELD_UNKNOWN_CONTEXT").flatMap(w => w.blockingReasons);
    return { segmentPointer: segment.originalPointer, originalRecordHash: segment.recordHash, originalSegment: segment.raw, originalGraphEvidence: nodes, applicabilityWitnesses: witnesses,
      state: reasons.length ? "WITHHELD" as const : "VERIFIED" as const, reasons, binding: reasons.length ? null : bindSegment(s, segment, witnesses) };
  });
  const typedBindings = segmentResults.flatMap(v => v.binding ? [v.binding] : []), witnesses = segmentResults.flatMap(v => v.applicabilityWitnesses), roots = sorted(typedBindings.flatMap(b => b.typedNativeReceipt.canonicalFactRoots));
  const body = { version: FEBRUARY_CONTRACT.version, fixtureId: s.request.graph.context.fixtureId, month: 2 as const, originalResearchId: s.row.originalResearchId, originalCatalogKey: s.row.catalogKey, originalSourceProof: proof, originalResearchRecord: s.row.original,
    originalCandidate: s.row.candidate, originalNativeReceipt: s.originalReceipt, originalNativeReceiptHash: actualSemanticDigest(s.originalReceipt), originalMeaningIdentity: null, originalClaimIdentity: null,
    sourcePreconditions: { selectedYear: e.selectedYear, civilMonthBounds: { start: raw.startKst, endExclusive: raw.endKstExclusive }, everyCanonicalSegment: all.map(s => s.originalPointer), originalRequiredConditions: s.row.original.requires,
      originalDeclarationCount: e.annualStemRelations.length, originalDeclarationListHash: v4Digest(e.annualStemRelations), allSegmentsRequired: true as const, relationDeclarationsAreNotGraphFacts: true as const },
    ipchunBoundary: boundaries[0], nominalAnnualPillar: e.raw.annualGanji, segmentResults, applicabilityWitnesses: witnesses, typedBindings,
    originalFactRoots: roots, additionalExistingGraphReferenceRoots: roots.filter(r => !s.typedRoots.includes(r)), verifiedActualUnitIds: [] as string[],
    meaningReviewState: "REVIEW_REQUIRED" as const, productReviewState: "UNKNOWN" as const, customerApprovalState: "PENDING" as const,
    customerUseAllowed: false as const, plannerUseAllowed: false as const, customerClaims: 0 as const, customerApprovals: 0 as const, customerReaderBridges: 0 as const, newFactRoots: 0 as const, independentFactsAdded: 0 as const };
  const monthReady = segmentResults.every(s => s.state === "VERIFIED");
  return { monthReady, observation: freeze(structuredClone({ source: proof, ipchunBoundary: boundaries[0], originalDeclarations: e.annualStemRelations, originalDeclarationListHash: v4Digest(e.annualStemRelations), segmentResults, applicabilityWitnesses: witnesses, typedBindings })),
    candidate: monthReady ? freeze(structuredClone({ ...body, technicalState: "TECHNICAL_FEBRUARY_DECLARATION_SCOPE_VERIFIED" as const, candidateId: `annual-february-relation-candidate:v1:${v4Digest(body)}` })) : null };
}
export type FebruaryCandidate = NonNullable<Awaited<ReturnType<typeof evaluate>>["candidate"]>;
export async function evaluateFebruary(context: FebruaryContext) {
  offline(); try { const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_FEBRUARY_CONTEXT_REQUIRED"); return { ok: true as const, ...await evaluate(s) }; } catch (e) { return fail(e); }
}
export async function validateApplicabilityWitness(context: FebruaryContext, witness: RelationApplicabilityWitness, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateFebruary(context), expected = result.ok ? result.observation.applicabilityWitnesses.find(w => w.witnessId === witness.witnessId) : null;
  return { ok: !!expected && same(expected, witness), eligibleAsCalculatedRelationFact: false as const, applicabilityState: expected?.applicabilityState ?? "SOURCE_OR_ADDRESS_UNVERIFIED", reasons: expected && same(expected, witness) ? [] : ["ORIGINAL_APPLICABILITY_WITNESS_CHANGED"], customerUseAllowed: false as const };
}
export async function validateFebruaryCandidate(context: FebruaryContext, candidate: FebruaryCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const result = await evaluateFebruary(context);
  return { ok: result.ok && result.candidate !== null && same(result.candidate, candidate), reasons: result.ok && result.candidate !== null && same(result.candidate, candidate) ? [] : ["ORIGINAL_FEBRUARY_CANDIDATE_CHANGED_OR_WITHHELD"], customerUseAllowed: false as const };
}
