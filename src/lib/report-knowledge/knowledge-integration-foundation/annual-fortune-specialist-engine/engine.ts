import { evidenceHash } from "../actual-evidence-graph/graph";
import { v4Digest } from "../../../interpretation-v4/runtimeProjection";
import { ActualBindingIndex } from "../knowledge-binder/matching";
import { bindKnowledgeCandidate } from "../knowledge-binder/engine";
import type { KnowledgeBindingRequest } from "../knowledge-binder/types";
import type { ProductSpecialistFoundation } from "../product-specialist-foundation/binderIntegration";
import type { SpecialistFoundationResult } from "../product-specialist-foundation/types";
import { AnnualSpecialistIndex } from "./candidateIndex";
import { annualQuestions } from "./monthQuestionRegistry";
import { observeAnnualLedger } from "./fullSegmentLedger";
import { matchMonthlyGod, godReferenceAudit } from "./monthlyTenGodMatcher";
import { validateAnnualRelation } from "./relationMatcher";
import { matchAnnualTransit } from "./transitEvidence";
import { compareAnnualSegments } from "./monthComparator";
import { validateDayunContext } from "./boundaryValidator";
import { annualStructuralConflicts } from "./conflictGraph";
import { VERSION, type AnnualResult, type AnnualDiagnostic } from "./types";
export class AnnualFortuneSpecialistEngine {
  readonly index;
  constructor(readonly foundation: ProductSpecialistFoundation) { this.index = new AnnualSpecialistIndex(foundation); }
  diagnose(request: KnowledgeBindingRequest, prepared?: SpecialistFoundationResult): AnnualResult {
    const composition = request.graphInput.evidence.composition;
    if (request.product !== "annual_fortune" || request.relationship !== null || request.graphInput.evidence.input.kind !== "annualFortune" || composition.product !== "annual_fortune") throw Error("ANNUAL_SINGLE_PERSON_SCOPE_REQUIRED");
    const before = evidenceHash([request.graph, request.graphInput.evidence]), e = composition.result.evidence, base = prepared ?? this.foundation.run(request), actual = new ActualBindingIndex(request, this.foundation.catalog), observation = observeAnnualLedger(request, actual, this.foundation.questions);
    const receipts = [...this.index.candidates.values()].map(c => bindKnowledgeCandidate(c.candidate, actual, this.foundation.catalog));
    const diagnostics: AnnualDiagnostic[] = [...this.index.candidates.values()].map((c, i) => {
      // Indexed month requirements avoid multiplying every material by every
      // segment; only original explicit civil-month/god scope is probed here.
      const segments = c.researchKind === "MONTH_QUESTION" ? observation.segments.filter(s => s.contract.month === c.original.month) : c.researchKind === "MONTHLY_TEN_GOD" ? observation.segments.filter(s => s.raw.stemTenGod === c.original.god || s.raw.branchTenGod === c.original.god) : [];
      return { catalogKey: c.catalogKey, originalResearchId: c.originalResearchId, researchKind: c.researchKind, receipt: receipts[i], originalConditions: c.original, monthMatches: segments.map(s => ({ month: s.contract.month, segmentPointer: s.originalPointer, window: s.contract.window, god: c.researchKind === "MONTHLY_TEN_GOD" ? matchMonthlyGod(c, s, e, actual) : null, actualEvidenceIds: c.researchKind === "MONTH_QUESTION" ? s.raw.evidenceIds.slice(0, 2) : [], canonicalFactRoots: c.researchKind === "MONTH_QUESTION" ? s.nodes.filter(n => [s.contract.componentNodeIds.month, s.contract.componentNodeIds.annual].includes(n.id)).flatMap(n => n.fact.rootId ? [n.fact.rootId] : []) : [], informationFunction: "WITHHELD", customerEligible: false, reasons: ["ORIGINAL_CONDITIONS_REVIEW_REQUIRED", "MEANING_REVIEW_REQUIRED", "CUSTOMER_APPROVAL_PENDING", ...(c.researchKind === "MONTHLY_TEN_GOD" ? ["AMBIGUOUS_MONTHLY_GOD_ROLE"] : [])] })), meaningIdentity: null, meaningReviewRequired: true, customerRank: null, customerEligible: false };
    });
    const conflicts: AnnualResult["conflicts"] = [], rows = [...this.index.candidates.values()];
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) conflicts.push({ left: rows[i].catalogKey, right: rows[j].catalogKey, kind: "MEANING_REVIEW_REQUIRED", state: "REVIEW_REQUIRED", independentInformation: null });
    const relations = observation.segments.flatMap(s => s.raw.relationFacts.map(f => validateAnnualRelation(s, f, e))), transit = observation.segments.flatMap(s => matchAnnualTransit(s, e));
    const { contentDigest, ...body } = request.graphInput.evidence;
    const errors = [...base.errors, ...actual.errors, ...observation.errors, ...(contentDigest !== v4Digest(body) ? ["ORIGINAL_PRODUCER_PACKET_SEAL_INVALID"] : []), ...(before !== evidenceHash([request.graph, request.graphInput.evidence]) ? ["ORIGINAL_GRAPH_OR_PACKET_MUTATED"] : []), ...observation.segments.flatMap(s => validateDayunContext(e.raw.customerDayun!, s.raw)), ...(receipts.some(r => r.customerApproved || r.operatorApproved) ? ["REAL_APPROVAL_MUST_REMAIN_ZERO"] : [])];
    return { version: VERSION, mode: "REAL_RESEARCH_DIAGNOSTICS", fixtureId: request.graph.context.fixtureId, observation, questions: annualQuestions(this.index, observation.months), diagnostics, baselineReceipts: base.after, receipts, foundation: base, relations, transit, structuralConflicts: annualStructuralConflicts(diagnostics, relations, transit), comparison: compareAnnualSegments(observation.segments), crossPeriods: godReferenceAudit(e), conflicts, actualCustomerEligible: 0, customerSelectionRun: false, actualClaimsEmitted: 0, errors: [...new Set(errors)] };
  }
}
