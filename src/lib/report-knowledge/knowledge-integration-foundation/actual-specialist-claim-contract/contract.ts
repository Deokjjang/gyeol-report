import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { canonicalJson, hash } from "../sourceReader";
import { isRecord } from "../normalization";
import { BINDING_HARD_GATES } from "../types";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, KnowledgeCandidate, NormalizedKnowledgeRequirement } from "../knowledge-binder/types";
import type { SourceProof } from "../source-verification/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import { reviewTemporalMeaning, type TemporalMeaningContract } from "../global-source-domain-resolution/conditionalTemporalMeaningReview";
import { MajorFortuneSpecialistEngine } from "../major-fortune-specialist-engine/engine";
import { AnnualFortuneSpecialistEngine } from "../annual-fortune-specialist-engine/engine";
import type { MajorDiagnostic } from "../major-fortune-specialist-engine/types";
import type { AnnualDiagnostic } from "../annual-fortune-specialist-engine/types";
import { validateActualCalculatedUnit, actualSemanticDigest, type ActualCalculatedSemanticUnit } from "../actual-calculation-semantic-bridge/units";
import type { adaptActualCalculationRequest } from "../full-product-integration/actualCalculationAdapter";

export type ActualCalculationRun = Extract<Awaited<ReturnType<typeof adaptActualCalculationRequest>>, { ok: true }>;
export type ActualClaimState = "FACT_ONLY_VERIFIED" | "SPECIALIST_CANDIDATE_LINKED" | "SOURCE_HELD" | "MEANING_REVIEW_REQUIRED" | "CONTEXT_REQUIRED" | "PRODUCT_REVIEW_REQUIRED" | "APPROVAL_PENDING" | "UNMATCHED_NATIVE_EVIDENCE";
export type ActualSpecialistClaimCandidate = {
  version: "actual-specialist-claim-candidate-v1"; candidateId: string;
  evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE";
  originalSpecialistEngine: "MajorFortuneSpecialistEngine" | "AnnualFortuneSpecialistEngine"; originalSpecialistVersion: string;
  fixtureId: string; product: "major_fortune" | "annual_fortune";
  originalResearchId: string; originalCatalogKey: string; originalMaterialIdentity: string;
  originalResearchRecordHash: string; originalSourceVersion: string; originalResearchProof: SourceProof;
  originalNativeReceiptId: string; originalNativeReceiptHash: string;
  originalClaimIdentity: string | null; originalMeaningIdentity: string | null;
  originalCandidate: KnowledgeCandidate; originalResearchRecord: Record<string, unknown>;
  originalNativeReceipt: KnowledgeBindingReceipt; nativeDiagnostic: MajorDiagnostic | AnnualDiagnostic;
  verifiedActualUnitIds: string[]; originalEvidenceNodeIds: string[]; originalFactRoots: string[];
  verifiedUnitFactRoots: string[]; additionalReferenceRoots: string[];
  verifiedCalculationFacts: ActualCalculatedSemanticUnit[];
  completeAncestry: ActualCalculatedSemanticUnit["completeAncestry"];
  owner: ActualCalculatedSemanticUnit["owner"]; direction: ActualCalculatedSemanticUnit["direction"];
  originLayer: ActualCalculatedSemanticUnit["originLayer"]; temporalScope: ActualCalculatedSemanticUnit["temporalScope"];
  effectiveInterval: ActualCalculatedSemanticUnit["effectiveInterval"];
  conditionalInterpretation: { evidenceKind: "CONDITIONAL_INTERPRETIVE_MEANING"; originalText: string | null; originalMeaningIdentity: string | null; meaningApproved: false };
  conditionalTemporalReview: Pick<TemporalMeaningContract, "packetHash" | "originalResearchId" | "originalMeaningField" | "originalRecordHash" | "originalSourceVersion" | "originalSourceProof" | "inheritedSourceProof" | "majorSourceProof" | "originalConditionReview" | "requiredConditions" | "counterexamples" | "prohibitedInferences" | "meaningReview" | "productApplicability" | "customerApproval" | "meaningClaim"> | null;
  requiredConditions: { normalized: NormalizedKnowledgeRequirement; original: Record<string, unknown> };
  sourceRequirements: NormalizedKnowledgeRequirement["sourceRequirements"];
  sourceGroups: NormalizedKnowledgeRequirement["sourceGroups"];
  sourceGroupEvaluation: KnowledgeBindingReceipt["sourceGroupEvaluation"];
  actualEvidenceMatches: KnowledgeBindingReceipt["matches"]; selectedEvidence: string[];
  counterexamples: unknown; prohibitedInferences: unknown;
  productApplicability: { products: NormalizedKnowledgeRequirement["products"]; relationships: NormalizedKnowledgeRequirement["relationships"]; originalGate: KnowledgeBindingReceipt["allTwelveGateResults"][number] };
  allTwelveGateResults: KnowledgeBindingReceipt["allTwelveGateResults"];
  originalBlockingReasons: KnowledgeBindingReceipt["blockingReasons"];
  blockingReasons: { state: ActualClaimState; code: string; fields: string[] }[];
  actualReviewStates: ActualClaimState[]; customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING";
  customerUseAllowed: false; plannerUseAllowed: false; customerClaims: 0; newFactRoots: 0;
};
export type ActualSpecialistClaimContext = Readonly<{ fixtureId: string; product: "major_fortune" | "annual_fortune"; requestHash: string; nativeDiagnosticHash: string }>;
type NativeRow = { candidate: KnowledgeCandidate; original: Record<string, unknown>; diagnostic: MajorDiagnostic | AnnualDiagnostic; receipt: KnowledgeBindingReceipt };
type Session = { request: KnowledgeBindingRequest; bridge: ActualCalculationRun; services: { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation }; rows: Map<string, NativeRow>; units: Map<string, ActualCalculatedSemanticUnit>; index: ActualBindingIndex; engine: ActualSpecialistClaimCandidate["originalSpecialistEngine"]; engineVersion: string };
const sessions = new WeakMap<ActualSpecialistClaimContext, Session>();
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("ACTUAL_SPECIALIST_CLAIMS_OFFLINE_ONLY"); }
function freeze<T>(v: T): T { if (v && typeof v === "object" && !Object.isFrozen(v)) { Object.values(v).forEach(freeze); Object.freeze(v); } return v; }
const same = (a: unknown, b: unknown) => actualSemanticDigest(a) === actualSemanticDigest(b);
const fail = (e: unknown) => ({ ok: false as const, reasons: [e instanceof Error ? e.message : "ACTUAL_SPECIALIST_CONTRACT_UNVERIFIED"], customerUseAllowed: false as const });
/** Re-execute the original engines, never accept a caller's receipt or PASS flag. */
export async function prepareActualSpecialistClaimContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Session["services"]) {
  offline();
  try {
    const before = actualSemanticDigest(request), bridgeBefore = actualSemanticDigest([bridge.handoff, bridge.native]);
    if (bridge.context.graphHash !== actualSemanticDigest(request.graph) || bridge.context.evidenceHash !== actualSemanticDigest(request.graphInput.evidence)
      || bridge.context.fixtureId !== request.graph.context.fixtureId || bridge.context.product !== request.product || !bridge.handoff.units.length) throw Error("EXACT_ACTUAL_FIXTURE_CONTEXT_REQUIRED");
    const units = new Map<string, ActualCalculatedSemanticUnit>();
    for (const u of bridge.handoff.units) {
      if (units.has(u.unitId) || !(await validateActualCalculatedUnit(bridge.context, u)).ok) throw Error("AUTHENTIC_UNIQUE_ACTUAL_UNIT_REQUIRED");
      units.set(u.unitId, structuredClone(u));
    }
    const roots = [...new Set([...units.values()].flatMap(u => u.canonicalFactRoots))].sort();
    if (!same(roots, bridge.handoff.canonicalFactRoots) || bridge.handoff.customerClaims || bridge.handoff.customerApproval || bridge.handoff.customerReaderBridge || bridge.handoff.newIndependentFacts) throw Error("ORIGINAL_FACT_HANDOFF_REQUIRED");
    const prepared = services.foundation.run(request);
    if (!same(prepared, bridge.native)) throw Error("ORIGINAL_FOUNDATION_RECEIPTS_REQUIRED");
    const engine = request.product === "major_fortune" ? new MajorFortuneSpecialistEngine(services.foundation) : request.product === "annual_fortune" ? new AnnualFortuneSpecialistEngine(services.foundation) : null;
    if (!engine) throw Error("ACTUAL_MAJOR_OR_ANNUAL_REQUIRED");
    const native = engine.diagnose(request, prepared);
    if (native.errors.length || native.actualClaimsEmitted || native.actualCustomerEligible || native.customerSelectionRun) throw Error("NATIVE_SPECIALIST_DIAGNOSTIC_HELD:" + native.errors.join("|"));
    const snapshot = structuredClone(request), index = new ActualBindingIndex(snapshot, services.foundation.catalog), rows = new Map<string, NativeRow>();
    for (const row of engine.index.candidates.values()) {
      const candidate = "bindingCandidate" in row ? row.bindingCandidate : row.candidate;
      const diagnostic = native.diagnostics.find(d => d.catalogKey === row.catalogKey), receipt = native.receipts.find(r => r.candidateCatalogKey === row.catalogKey);
      if (!diagnostic || !receipt || !same(diagnostic.receipt, receipt) || !same(bindKnowledgeCandidate(candidate, index, services.foundation.catalog), receipt)
        || hash(canonicalJson(candidate.requirement)) !== row.bindingRequirementHash || candidate.provenance !== "ACTUAL_RESEARCH"
        || receipt.customerApproved || receipt.operatorApproved || receipt.fixtureId !== snapshot.graph.context.fixtureId || receipt.product !== snapshot.product
        || receipt.originalResearchId !== candidate.record.originalId || receipt.allTwelveGateResults.length !== 12
        || !same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES)) throw Error("ORIGINAL_NATIVE_CANDIDATE_RECEIPT_OR_GATES_REQUIRED");
      rows.set(row.catalogKey, structuredClone({ candidate, original: row.original, diagnostic, receipt }));
    }
    if (rows.size !== native.receipts.length || before !== actualSemanticDigest(request) || bridgeBefore !== actualSemanticDigest([bridge.handoff, bridge.native])) throw Error("ORIGINAL_REQUEST_OR_NATIVE_RECEIPTS_CHANGED");
    const context = freeze({ fixtureId: snapshot.graph.context.fixtureId, product: snapshot.product as ActualSpecialistClaimContext["product"], requestHash: before, nativeDiagnosticHash: actualSemanticDigest(native) });
    sessions.set(context, { request: snapshot, bridge, services, rows, units, index, engine: engine instanceof MajorFortuneSpecialistEngine ? "MajorFortuneSpecialistEngine" : "AnnualFortuneSpecialistEngine", engineVersion: native.version });
    return { ok: true as const, context, native, verifiedUnits: freeze(structuredClone([...units.values()])), originalReceiptsVerified: rows.size };
  } catch (e) { return fail(e); }
}
function reviewStates(row: NativeRow) {
  const q = row.candidate.requirement, r = row.receipt;
  const states: ActualClaimState[] = ["SPECIALIST_CANDIDATE_LINKED"];
  const reasons: ActualSpecialistClaimCandidate["blockingReasons"] = [];
  const held = (state: ActualClaimState, code: string, fields: string[]) => { states.push(state); reasons.push({ state, code, fields }); };
  const gate = (id: string) => r.allTwelveGateResults.find(g => g.gate === id)!;
  const pass = (id: string) => ["PASS", "NOT_APPLICABLE"].includes(gate(id).state);
  if (!pass("SOURCE_INTEGRITY") || r.sourceGroupEvaluation.some(g => g.state !== "PASS")) held("SOURCE_HELD", "ORIGINAL_SOURCE_OR_GROUP_HELD", ["sourceRequirements", "sourceGroups"]);
  if (!pass("INTERPRETATION_REVIEW") || !q.meaningIdentity || !q.claimIdentity) held("MEANING_REVIEW_REQUIRED", "ORIGINAL_MEANING_OR_CLAIM_NOT_APPROVED", ["meaningIdentity", "claimIdentity", "originalReviewState"]);
  if (!pass("ACTUAL_USER_STATE") || q.unresolvedConditions.length) held("CONTEXT_REQUIRED", "MISSING_REQUIRED_CONTEXT", [...q.unresolvedConditions.map(c => c.field), ...q.requiredUserState.map(c => c.originalField), "requiredContext"]);
  if (!pass("PRODUCT_SPECIALISM")) held("PRODUCT_REVIEW_REQUIRED", "ORIGINAL_PRODUCT_APPLICABILITY_HELD", ["products", "readerQuestion", "coreMeaning"]);
  held("APPROVAL_PENDING", "CUSTOMER_CLAIM_NOT_AUTHORIZED", ["officialCustomerApproval"]);
  return { states, reasons };
}
/** One receipt + one original Unit interval per candidate; never merge periods
 * merely because their ten-god labels or original roots are the same. */
export async function createActualSpecialistCandidate(context: ActualSpecialistClaimContext, catalogKey: string, unitId: string) {
  offline();
  try {
    const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_ACTUAL_SPECIALIST_CONTEXT_REQUIRED");
    const row = s.rows.get(catalogKey), unit = s.units.get(unitId);
    if (!row || !unit) throw Error("ORIGINAL_NATIVE_CANDIDATE_AND_ACTUAL_UNIT_REQUIRED");
    if (!row.receipt.selectedActualEvidence.includes(unit.originalEvidenceNodeId)) throw Error("UNMATCHED_NATIVE_EVIDENCE");
    if (!(await validateActualCalculatedUnit(s.bridge.context, unit)).ok || !same(bindKnowledgeCandidate(row.candidate, s.index, s.services.foundation.catalog), row.receipt)) throw Error("ORIGINAL_UNIT_OR_NATIVE_RECEIPT_CHANGED");
    const proof = await s.services.resolver.proof(row.candidate.record.locator, row.candidate.record.originalId, row.candidate.record.catalogKey);
    const original = await s.services.resolver.record(row.candidate.record);
    if (!isRecord(original) || !same(original, row.original) || proof.actualHash !== row.candidate.record.locator.recordSha256
      || row.receipt.claimIdentity !== row.candidate.requirement.claimIdentity || row.receipt.meaningIdentity !== row.candidate.requirement.meaningIdentity
      || !unit.canonicalFactRoot || !row.receipt.canonicalFactRoots.includes(unit.canonicalFactRoot)
      || s.index.graph.nodes.get(unit.originalEvidenceNodeId)?.fact.rootId !== unit.canonicalFactRoot
      || unit.owner.fixtureOwnerId !== s.request.graph.context.owners.person || unit.direction !== null
      || row.candidate.requirement.products.indexOf(s.request.product) < 0 || row.receipt.relationship !== null) throw Error("EXACT_ORIGINAL_SOURCE_IDENTITY_OWNER_ROOT_SCOPE_REQUIRED");
    // A shared node can hold more than one role. Selection of its address alone
    // cannot turn FLOW_GOD or branch-main into the originally required relation.
    const roleVerified = "tenGodChecks" in row.diagnostic
      ? unit.originLayer === "DAYUN_STEM" && row.diagnostic.tenGodChecks.some(t => t.observed && t.originalGodLiteral === unit.definitionLabel
        && t.cycleIndex === unit.calculationWitness?.cycleIndex && t.dayMaster === unit.referenceStem && t.cycleStem === unit.targetStem)
      : row.diagnostic.monthMatches.some(m => m.god?.matched && m.god.role === unit.originLayer && m.god.referenceStem === unit.referenceStem
        && m.god.targetStem === unit.targetStem && m.god.nodeIds.includes(unit.originalEvidenceNodeId) && same(m.god.window, unit.effectiveInterval));
    if (!roleVerified) throw Error("EXACT_NATIVE_ROLE_WITNESS_REQUIRED");
    let conditionalTemporalReview: ActualSpecialistClaimCandidate["conditionalTemporalReview"] = null;
    if (isRecord(row.original.inheritedRole) && typeof row.original.inheritedRole.originalId === "string") {
      const inheritedId = row.original.inheritedRole.originalId;
      const records = s.services.resolver.records.filter(r => r.originalId === inheritedId);
      if (records.length !== 1 || unit.originLayer !== "DAYUN_STEM") throw Error("EXACT_INHERITED_TEMPORAL_ROLE_REQUIRED");
      const review = await reviewTemporalMeaning(s.services.resolver, records[0], "dayun");
      const linked = s.bridge.handoff.conditionalMeaningLinks.find(l => l.unitId === unitId);
      if (linked?.reviewPacketHash !== review.packetHash || review.originalSourceIdentity !== unit.sourceIdentity) throw Error("EXACT_ORIGINAL_CONDITIONAL_REVIEW_REQUIRED");
      const { packetHash, originalResearchId, originalMeaningField, originalRecordHash, originalSourceVersion, originalSourceProof, inheritedSourceProof, majorSourceProof,
        originalConditionReview, requiredConditions, counterexamples, prohibitedInferences, meaningReview, productApplicability, customerApproval, meaningClaim } = review;
      conditionalTemporalReview = { packetHash, originalResearchId, originalMeaningField, originalRecordHash, originalSourceVersion, originalSourceProof, inheritedSourceProof, majorSourceProof,
        originalConditionReview, requiredConditions, counterexamples, prohibitedInferences, meaningReview, productApplicability, customerApproval, meaningClaim };
    }
    const q = row.candidate.requirement, state = reviewStates(row);
    const body: Omit<ActualSpecialistClaimCandidate, "candidateId"> = {
      version: "actual-specialist-claim-candidate-v1", evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE",
      originalSpecialistEngine: s.engine, originalSpecialistVersion: s.engineVersion, fixtureId: context.fixtureId, product: context.product,
      originalResearchId: row.candidate.record.originalId, originalCatalogKey: catalogKey, originalMaterialIdentity: row.candidate.record.originalId,
      originalResearchRecordHash: proof.actualHash, originalSourceVersion: proof.sourceVersion, originalResearchProof: proof,
      originalNativeReceiptId: row.receipt.receiptId, originalNativeReceiptHash: actualSemanticDigest(row.receipt), originalClaimIdentity: q.claimIdentity, originalMeaningIdentity: q.meaningIdentity,
      originalCandidate: row.candidate, originalResearchRecord: row.original, originalNativeReceipt: row.receipt, nativeDiagnostic: row.diagnostic,
      verifiedActualUnitIds: [unitId], originalEvidenceNodeIds: [unit.originalEvidenceNodeId], originalFactRoots: row.receipt.canonicalFactRoots,
      verifiedUnitFactRoots: unit.canonicalFactRoots, additionalReferenceRoots: unit.canonicalFactRoots.filter(root => !row.receipt.canonicalFactRoots.includes(root)),
      verifiedCalculationFacts: [unit], completeAncestry: unit.completeAncestry, owner: unit.owner, direction: unit.direction,
      originLayer: unit.originLayer, temporalScope: unit.temporalScope, effectiveInterval: unit.effectiveInterval,
      conditionalInterpretation: { evidenceKind: "CONDITIONAL_INTERPRETIVE_MEANING", originalText: q.coreMeaning, originalMeaningIdentity: q.meaningIdentity, meaningApproved: false },
      conditionalTemporalReview,
  requiredConditions: { normalized: q, original: row.original }, sourceRequirements: q.sourceRequirements, sourceGroups: q.sourceGroups,
      sourceGroupEvaluation: row.receipt.sourceGroupEvaluation, actualEvidenceMatches: row.receipt.matches, selectedEvidence: row.receipt.selectedActualEvidence,
      counterexamples: q.counterexamples, prohibitedInferences: q.prohibitions,
      productApplicability: { products: q.products, relationships: q.relationships, originalGate: row.receipt.allTwelveGateResults.find(g => g.gate === "PRODUCT_SPECIALISM")! },
      allTwelveGateResults: row.receipt.allTwelveGateResults, originalBlockingReasons: row.receipt.blockingReasons, blockingReasons: state.reasons, actualReviewStates: state.states,
      customerAuthorizationState: "CUSTOMER_APPROVAL_PENDING", customerUseAllowed: false, plannerUseAllowed: false, customerClaims: 0, newFactRoots: 0,
    };
    return { ok: true as const, candidate: freeze(structuredClone({ ...body, candidateId: `actual-specialist-candidate:v1:${v4Digest(body)}` })) };
  } catch (e) { return fail(e); }
}
export async function validateActualSpecialistCandidate(context: ActualSpecialistClaimContext, candidate: ActualSpecialistClaimCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return { ok: false, reasons: ["CUSTOMER_CLAIM_NOT_AUTHORIZED"], customerUseAllowed: false as const };
  if (candidate.verifiedActualUnitIds.length !== 1) return { ok: false, reasons: ["EXACT_SINGLE_UNIT_INTERVAL_REQUIRED"], customerUseAllowed: false as const };
  const expected = await createActualSpecialistCandidate(context, candidate.originalCatalogKey, candidate.verifiedActualUnitIds[0]);
  return { ok: expected.ok && v4Digest(expected.candidate) === v4Digest(candidate), reasons: expected.ok ? v4Digest(expected.candidate) === v4Digest(candidate) ? [] : ["ORIGINAL_NATIVE_CANDIDATE_CONTENT_CHANGED"] : expected.reasons, customerUseAllowed: false as const };
}
