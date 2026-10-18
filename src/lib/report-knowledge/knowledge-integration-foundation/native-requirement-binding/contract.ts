import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { actualSemanticDigest, validateActualCalculatedUnit, type ActualCalculatedSemanticUnit } from "../actual-calculation-semantic-bridge/units";
import { adaptActualSpecialistClaims } from "../full-product-integration/actualSpecialistAdapter";
import type { ActualCalculationRun } from "../actual-specialist-claim-contract/contract";
import { AnnualSpecialistIndex } from "../annual-fortune-specialist-engine/candidateIndex";
import type { AnnualCandidate } from "../annual-fortune-specialist-engine/types";
import { annualRoleSelector } from "../product-specialist-foundation/annualSelector";
import type { AnnualSegmentContract } from "../product-specialist-foundation/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { TemporalTenGodSourceResolver } from "../global-source-domain-resolution/temporalTenGodSource";
import type { SourceProof } from "../source-verification/types";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest, KnowledgeBindingReceipt, KnowledgeCandidate, NormalizedSourceRequirement } from "../knowledge-binder/types";
import { BINDING_HARD_GATES } from "../types";

// A closed, versioned technical reading of this exact original clause. This is
// not a role decision for the ten ambiguous MONTHLY_TEN_GOD research records.
export const NATIVE_MONTH_PAIR_CONTRACT = freeze({
  version: "native-month-pair-requirement-v1", originalId: "afpr:month-slot:05",
  file: "src/lib/report-knowledge/annual-fortune-product-research/monthMatrix.ts",
  exportName: "ANNUAL_MONTH_MATRIX", index: 4,
  recordSha256: "025e86bd5b175fc3f440867ebceee4deb5d6591ed6902ddce85c4d8a9b017012",
  fileSha256: "261d8167c98dbc339d3090b8477edecfe770d0e5e1c8573088601640f03a96e3",
  sourceVersion: "6d471db103d53dd9165e4832744501a686e59edc",
  requires: ["selectedYear + actual civil month bounds", "every canonical segment", "month stemTenGod/branchTenGod + main-hidden-stem convention"],
  roles: ["MONTH_STEM", "MONTH_BRANCH_MAIN"],
} as const);
type Services = { resolver: TemporalTenGodSourceResolver; foundation: ProductSpecialistFoundation };
type Baseline = Extract<Awaited<ReturnType<typeof adaptActualSpecialistClaims>>, { ok: true }>;
export type NativeRequirementContext = Readonly<{ version: typeof NATIVE_MONTH_PAIR_CONTRACT.version; fixtureId: string; requestHash: string }>;
export type NativeRequirementCandidate = {
  version: "actual-specialist-native-requirement-candidate-v2"; candidateId: string;
  technicalContract: typeof NATIVE_MONTH_PAIR_CONTRACT; technicalState: "TECHNICAL_REQUIREMENT_RESOLVED";
  evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE"; originalSpecialistEngine: "AnnualFortuneSpecialistEngine";
  fixtureId: string; originalCatalogKey: string; originalResearchId: string; originalResearchProof: SourceProof;
  originalResearchRecord: AnnualCandidate["original"]; originalCandidate: KnowledgeCandidate;
  originalNativeReceipt: KnowledgeBindingReceipt; originalNativeReceiptHash: string;
  typedCandidate: KnowledgeCandidate; typedNativeReceipt: KnowledgeBindingReceipt; typedNativeReceiptHash: string;
  originalMeaningIdentity: string | null; originalClaimIdentity: string | null;
  segment: AnnualSegmentContract; verifiedCalculationFacts: ActualCalculatedSemanticUnit[]; verifiedActualUnitIds: string[];
  originalFactRoots: string[]; verifiedUnitFactRoots: string[]; additionalReferenceRoots: string[];
  allTwelveGateResults: KnowledgeBindingReceipt["allTwelveGateResults"];
  reviewStates: readonly ["ACTUAL_CONTEXT_REQUIRED", "MEANING_REVIEW_REQUIRED", "PRODUCT_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING"];
  customerUseAllowed: false; plannerUseAllowed: false; customerClaims: 0; customerApprovals: 0; newFactRoots: 0;
};
type Session = { request: KnowledgeBindingRequest; bridge: ActualCalculationRun; services: Services; baseline: Baseline; row: AnnualCandidate; segments: AnnualSegmentContract[]; units: ActualCalculatedSemanticUnit[] };
const sessions = new WeakMap<NativeRequirementContext, Session>();
const same = (a: unknown, b: unknown) => actualSemanticDigest(a) === actualSemanticDigest(b);
const fail = (e: unknown) => ({ ok: false as const, reasons: [e instanceof Error ? e.message : "NATIVE_REQUIREMENT_UNVERIFIED"], customerUseAllowed: false as const });
function offline() { if (process.env.VERCEL || typeof window !== "undefined") throw Error("NATIVE_REQUIREMENT_OFFLINE_ONLY"); }
function freeze<T>(value: T): T { if (value && typeof value === "object" && !Object.isFrozen(value)) { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
async function verifyOriginal(row: AnnualCandidate, services: Services) {
  const pin = NATIVE_MONTH_PAIR_CONTRACT, locator = row.candidate.record.locator;
  const original = await services.resolver.record(row.candidate.record);
  const proof = await services.resolver.proof(locator, row.originalResearchId, row.catalogKey);
  if (row.researchKind !== "MONTH_QUESTION" || row.originalResearchId !== pin.originalId || locator.file !== pin.file || locator.exportName !== pin.exportName || locator.index !== pin.index
    || locator.recordSha256 !== pin.recordSha256 || (locator.fileSha256 !== undefined && locator.fileSha256 !== pin.fileSha256) || locator.sourceVersion !== pin.sourceVersion
    || proof.originalId !== pin.originalId || proof.matchedCatalogKey !== row.catalogKey || proof.role !== "ORIGINAL_RECORD"
    || proof.actualHash !== pin.recordSha256 || proof.expectedHash !== pin.recordSha256 || proof.sourceVersion !== pin.sourceVersion || !same(proof.locator, { ...locator, fileSha256: pin.fileSha256 })
    || !same(original, row.original) || !same(row.original.requires, pin.requires) || row.original.month !== 5 || row.original.scope !== "civil_month"
    || row.original.approvedForCustomer !== false || row.original.connectedToRuntime !== false || row.candidate.requirement.requiredTemporalScope !== "month") throw Error("EXACT_ORIGINAL_MONTH_PAIR_SOURCE_REQUIRED");
  return proof;
}
/** Reuses the authentic real Bridge + original Specialist path before adding
 * any requirements. All 703 historical receipts remain in that baseline. */
export async function prepareNativeRequirementContext(request: KnowledgeBindingRequest, bridge: ActualCalculationRun, services: Services) {
  offline();
  try {
    const before = actualSemanticDigest([request, bridge.handoff, bridge.native]);
    const baseline = await adaptActualSpecialistClaims(request, bridge, services);
    if (!baseline.ok) return baseline;
    if (baseline.native.version !== "annual-fortune-specialist-v1") return { ok: true as const, context: null, baseline };
    const rows = new AnnualSpecialistIndex(services.foundation), source = rows.byOriginalId.get(NATIVE_MONTH_PAIR_CONTRACT.originalId);
    if (!source) throw Error("ORIGINAL_MONTH_PAIR_RESEARCH_REQUIRED");
    const row = structuredClone(source); await verifyOriginal(row, services);
    const month = baseline.native.observation.months.find(m => m.civilMonth === 5);
    if (!month || !month.allSegmentsRequired || !month.segments.length) throw Error("COMPLETE_CANONICAL_MONTH_REQUIRED");
    if (before !== actualSemanticDigest([request, bridge.handoff, bridge.native])) throw Error("ORIGINAL_INPUT_CHANGED_DURING_ADAPTATION");
    const context = freeze({ version: NATIVE_MONTH_PAIR_CONTRACT.version, fixtureId: request.graph.context.fixtureId, requestHash: actualSemanticDigest(request) });
    sessions.set(context, { request: structuredClone(request), bridge, services, baseline: freeze(baseline), row: freeze(row), segments: structuredClone(month.segments), units: structuredClone(bridge.handoff.units) });
    return { ok: true as const, context, baseline };
  } catch (e) { return fail(e); }
}
/** Both declared roles are required together, once per canonical segment. An
 * address shared by roles alone is never sufficient for this contract. */
export async function createNativeRequirementCandidate(context: NativeRequirementContext, catalogKey: string, segmentPointer: string) {
  offline();
  try {
    const s = sessions.get(context); if (!s) throw Error("AUTHENTIC_NATIVE_REQUIREMENT_CONTEXT_REQUIRED");
    const row = s.row, segment = s.segments.find(v => v.pointer === segmentPointer);
    if (catalogKey !== row.catalogKey || !segment) throw Error("EXACT_ORIGINAL_RESEARCH_AND_SEGMENT_REQUIRED");
    const proof = await verifyOriginal(row, s.services), candidate = structuredClone(row.candidate);
    const units: ActualCalculatedSemanticUnit[] = [];
    const index = new ActualBindingIndex({ ...s.request, requiredWindow: segment.window, restrictEvidenceTo: [segment.boundaryNodeId!, ...Object.values(segment.componentNodeIds).filter((id): id is string => typeof id === "string")] }, s.services.foundation.catalog);
    for (const role of NATIVE_MONTH_PAIR_CONTRACT.roles) {
      const found = s.units.filter(u => u.originLayer === role && u.originalEvidenceNodeId === segment.componentNodeIds.ten_gods && same(u.effectiveInterval, segment.window));
      if (found.length !== 1) throw Error("EXACT_BOTH_MONTH_ROLES_REQUIRED");
      const unit = found[0];
      if (!(await validateActualCalculatedUnit(s.bridge.context, unit)).ok || unit.referenceBasis !== "NATAL_DAY_MASTER" || !unit.calculatedTenGod
        || unit.owner.fixtureOwnerId !== s.request.graph.context.owners.person || unit.direction !== null || unit.temporalScope !== "month"
        || unit.calculatedTenGod !== (role === "MONTH_STEM" ? segment.stemTenGod : segment.branchTenGod)) throw Error("AUTHENTIC_ROLE_REFERENCE_TARGET_OWNER_INTERVAL_REQUIRED");
      const selector = annualRoleSelector(role, unit.calculatedTenGod, segment)!; selector.producer = unit.originalProducer;
      const spec: NormalizedSourceRequirement = { id: `${catalogKey}#${context.version}/${segment.segmentIndex}/${role}`, originalField: "/requires/2", originalDeclaration: row.original.requires,
        sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] };
      candidate.requirement.sourceRequirements.push(spec); units.push(unit);
    }
    const boundary = index.graph.nodes.get(segment.boundaryNodeId!); if (!boundary) throw Error("ORIGINAL_SEGMENT_BOUNDARY_REQUIRED");
    const selector = annualRoleSelector("BOUNDARY", undefined, segment)!; selector.producer = boundary.producer;
    candidate.requirement.sourceRequirements.push({ id: `${catalogKey}#${context.version}/${segment.segmentIndex}/BOUNDARY`, originalField: "/requires/0", originalDeclaration: row.original.requires,
      sourceKey: null, sourceCatalogKeys: [], owner: "person", use: "ACTUAL_FACT", selector, required: true, gaps: [] });
    candidate.requirement.requiredOwner = [...new Set([...candidate.requirement.requiredOwner, "person" as const])];
    const original = s.baseline.native.receipts.find(r => r.candidateCatalogKey === catalogKey)!;
    const receipt = bindKnowledgeCandidate(candidate, index, s.services.foundation.catalog);
    const technicalGates = ["PRODUCER_SUPPORT", "ACTUAL_CALCULATED_FACT", "ACTUAL_OWNER", "ALL_ANCESTOR_DOMAINS", "TIME_INTERSECTION"];
    const issues = [
      ...index.errors,
      ...(receipt.customerApproved || receipt.operatorApproved ? ["UNEXPECTED_APPROVAL"] : []),
      ...(!same(receipt.allTwelveGateResults.map(g => g.gate), BINDING_HARD_GATES) ? ["HARD_GATE_ORDER_CHANGED"] : []),
      ...(!receipt.selectedActualEvidence.includes(boundary.id) ? ["BOUNDARY_NOT_SELECTED"] : []),
      // Monthly god nodes are original derived observations: fact.rootId is
      // null, while their complete ancestry carries the existing fact roots.
      // Preserve null and verify that exact root set; never mint a primary root.
      ...units.flatMap(u => !receipt.selectedActualEvidence.includes(u.originalEvidenceNodeId) ? ["ROLE_NODE_NOT_SELECTED"]
        : !same([...new Set(index.graph.nodes.get(u.originalEvidenceNodeId)!.ancestry.rootIds)].sort(), u.canonicalFactRoots)
          || u.canonicalFactRoots.some(root => !receipt.canonicalFactRoots.includes(root)) ? ["ROLE_ANCESTRY_ROOTS_NOT_SELECTED"] : []),
      ...receipt.allTwelveGateResults.filter(g => technicalGates.includes(g.gate) && g.state !== "PASS").map(g => `${g.gate}:${g.state}:${g.reasons.join("|")}`),
      ...receipt.allTwelveGateResults.filter(g => !technicalGates.includes(g.gate)).flatMap(g => {
        const old = original.allTwelveGateResults.find(v => v.gate === g.gate)!;
        return g.state !== old.state || !same(g.reasons, old.reasons) ? [`ORIGINAL_GATE_CHANGED:${g.gate}`] : [];
      }),
      ...(!same(receipt.sourceGroupEvaluation, original.sourceGroupEvaluation) ? ["ORIGINAL_SOURCE_GROUP_CHANGED"] : []),
    ];
    if (issues.length) throw Error("EXACT_NATIVE_SELECTION_WITH_ORIGINAL_REVIEW_GATES_REQUIRED:" + issues.join(";"));
    const roots = [...new Set(units.flatMap(u => u.canonicalFactRoots))].sort();
    const body: Omit<NativeRequirementCandidate, "candidateId"> = {
      version: "actual-specialist-native-requirement-candidate-v2", technicalContract: NATIVE_MONTH_PAIR_CONTRACT, technicalState: "TECHNICAL_REQUIREMENT_RESOLVED",
      evidenceKind: "SPECIALIST_INTERPRETATION_CANDIDATE", originalSpecialistEngine: "AnnualFortuneSpecialistEngine", fixtureId: context.fixtureId,
      originalCatalogKey: catalogKey, originalResearchId: row.originalResearchId, originalResearchProof: proof, originalResearchRecord: row.original, originalCandidate: row.candidate,
      originalNativeReceipt: original, originalNativeReceiptHash: actualSemanticDigest(original), typedCandidate: candidate, typedNativeReceipt: receipt, typedNativeReceiptHash: actualSemanticDigest(receipt),
      originalMeaningIdentity: row.candidate.requirement.meaningIdentity, originalClaimIdentity: row.candidate.requirement.claimIdentity,
      segment, verifiedCalculationFacts: units, verifiedActualUnitIds: units.map(u => u.unitId), originalFactRoots: receipt.canonicalFactRoots, verifiedUnitFactRoots: roots,
      additionalReferenceRoots: roots.filter(r => !receipt.canonicalFactRoots.includes(r)), allTwelveGateResults: receipt.allTwelveGateResults,
      reviewStates: ["ACTUAL_CONTEXT_REQUIRED", "MEANING_REVIEW_REQUIRED", "PRODUCT_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING"],
      customerUseAllowed: false, plannerUseAllowed: false, customerClaims: 0, customerApprovals: 0, newFactRoots: 0,
    };
    return { ok: true as const, candidate: freeze(structuredClone({ ...body, candidateId: `actual-specialist-native:v2:${v4Digest(body)}` })) };
  } catch (e) { return fail(e); }
}
export async function validateNativeRequirementCandidate(context: NativeRequirementContext, candidate: NativeRequirementCandidate, usage: "INTERNAL_REVIEW" | "CUSTOMER_PUBLICATION" | "PLANNER_ASSIGNMENT" = "INTERNAL_REVIEW") {
  if (usage !== "INTERNAL_REVIEW") return fail(Error("CUSTOMER_CLAIM_NOT_AUTHORIZED"));
  const expected = await createNativeRequirementCandidate(context, candidate.originalCatalogKey, candidate.segment.pointer);
  return { ok: expected.ok && v4Digest(candidate) === v4Digest(expected.candidate), reasons: expected.ok ? v4Digest(candidate) === v4Digest(expected.candidate) ? [] : ["ORIGINAL_TYPED_REQUIREMENT_CANDIDATE_CHANGED"] : expected.reasons, customerUseAllowed: false as const };
}
